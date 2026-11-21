// ---------- escenarios ----------
const DX = 800, CX = 1100, TX = 1200;
const T0 = town(scene), G = T0.G, PZ = T0.PZ; const DES = desert(scene, DX), CLS = classroom(scene, CX), TIN = tankIn(scene, TX);
// ---------- reparto ----------
const mats = makeMats(scene), grimm = makeGrimm(scene), grimmT = makeGrimm(scene, true), mayor = makeMayor(scene), noble = makeNoble(scene), lady = makeLady(scene), beggar = makeBeggar(scene), suitor = makeSuitor(scene), girl = makeGirl(scene), sw2 = makeSweeper2(scene);
const ex = Array.from({ length: 12 }, (_, i) => makeExtra(scene, i));
const POOLC = [mats, grimm, grimmT, mayor, noble, lady, beggar, suitor, girl, sw2, ...ex];
// ---------- atrezo ----------
const DR = diamondRain(scene, 900), BIG = diamondRain(scene, 160), CR = crowd(scene, 420), SHEET = rubberSheet(scene), TANK = tank(scene), CHEST = chest(scene), LOAF = loaf(scene), CAT = cat(scene), SHV = shovel(scene, true), SHM = shovel(scene, false), CAR = carriage(scene), PEN = pencil(scene);
BIG.scale.setScalar(1); BIG.material = BIG.material.clone(); BIG.material.emissiveIntensity = .7;
const helmets = [0, 1, 2].map(() => { const h = new THREE.Mesh(new THREE.SphereGeometry(.85, 20, 10, 0, 6.283, 0, 1.4), mat(0x8a8f9a, { metalness: .8, roughness: .3 })); scene.add(h); return h; });
const umbs = [0, 1].map(k => { const g = new THREE.Group(); scene.add(g); const c = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1, 10, 1, true), mat(k ? 0x2a2a30 : 0x6a7078, { metalness: .8, roughness: .3, side: THREE.DoubleSide })); c.position.y = 3; g.add(c); cyl(.06, .06, 3, mat(0x333333), 6, g, 0, 1.5, 0); return g; });
const smoke = []; for (let k = 0; k < 24; k++) smoke.push(sphere(1, mat(0xd8d8d8, { transparent: true, opacity: .6, roughness: 1 }), scene, 0, 0, 0, 10, 8));
const fires = []; for (let k = 0; k < 16; k++) { const f = new THREE.Mesh(new THREE.ConeGeometry(1 + (k % 3) * .5, 3 + (k % 4), 8), B([2.4, .9 + (k % 3) * .3, .15])); scene.add(f); fires.push(f); }
const shards = []; for (let k = 0; k < 14; k++) shards.push(box(.4 + (k % 3) * .2, .06, .3, mat(0xc0c4cc, { metalness: .9, roughness: .2 }), .02, scene));
const sparks = []; for (let k = 0; k < 40; k++) sparks.push(sphere(.08, B([3, 2.6, 1.2]), scene, 0, 0, 0, 4, 3));
const confetti = []; for (let i = 0; i < 120; i++) { const col = [0xff5a85, 0xffd23f, 0x3fa8ff, 0x2ec46a, 0x9b5de5, 0xff8a23][i % 6]; const c = new THREE.Mesh(new THREE.PlaneGeometry(.5, .3), new THREE.MeshStandardMaterial({ color: col, side: THREE.DoubleSide, emissive: col, emissiveIntensity: .3 })); scene.add(c); confetti.push(c); }
const steam = []; for (let k = 0; k < 8; k++) steam.push(sphere(.25, mat(0xffffff, { transparent: true, opacity: .45 }), scene, 0, 0, 0, 8, 6));
const flies = []; for (let k = 0; k < 10; k++) flies.push(sphere(.08, mat(0x111111), scene, 0, 0, 0, 4, 3));
const tele = new THREE.Group(); scene.add(tele); { const t = cyl(.18, .28, 2.2, mat(0x8a5a2a, { metalness: .3 }), 12, tele, 0, 0, 0); t.rotation.x = Math.PI / 2; const r = cyl(.3, .3, .3, gold(), 12, tele, 0, 0, 1.1); r.rotation.x = Math.PI / 2; }
const mega = new THREE.Group(); scene.add(mega); { const c = new THREE.Mesh(new THREE.ConeGeometry(.6, 1.6, 14, 1, true), mat(0xd8d8d8, { metalness: .6, side: THREE.DoubleSide })); c.rotation.x = -Math.PI / 2; c.position.z = .8; mega.add(c); box(.3, .7, .3, mat(0x2a2a2a), .05, mega, 0, -.4, 0); }
const torch = new THREE.Group(); scene.add(torch); { cyl(.12, .16, 2, mat(0x6a4a2a), 8, torch, 0, 0, 0); const f = new THREE.Mesh(new THREE.ConeGeometry(.45, 1.2, 8), B([2.6, 1.1, .2])); f.position.y = 1.5; torch.add(f); }
const bread = box(1.3, .9, .25, mat(0xe8c48a, { roughness: .9 }), .2, scene); box(1.4, 1.0, .2, mat(0xa8682a), .25, bread, 0, 0, -.06);
const PROPS = [DR, BIG, CR.bi, CR.hi, SHEET, TANK, CHEST, LOAF, CAT, SHV, SHM, CAR, PEN, helmets, umbs, smoke, fires, shards, sparks, confetti, steam, flies, tele, mega, torch, bread].flat();

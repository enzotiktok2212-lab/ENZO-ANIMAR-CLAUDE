// ---------- escenarios ----------
const TX = 600, BX = 1100, MX = 1200, NX = 1250, FX = 1400, SX = 2000;
const WD = world(scene), G = WD.G, W1 = WD.W1, TRN = training(scene, TX), BAS = basement(scene, BX), MOU = mouth(scene, MX), NAP = nape(scene, NX), FLD = nightField(scene, FX), SEA = sea(scene, SX);
// ---------- gigantes ----------
const gi = Array.from({ length: 8 }, (_, i) => makeGiant(scene, i, 4.6)); const RED = makeSkinless(scene, 12.5), SMI = makeSmiler(scene, 5.2), MINE = makeMine(scene, 6.4), MET = makeMetal(scene, 6.2);
// ---------- reparto ----------
const kid = makeHero(scene, true), hero = makeHero(scene), mom = makeMom(scene), dad = makeDad(scene), sold = makeSoldier(scene), capt = makeCaptain(scene), bud = makeBuddy(scene), big = makeBig(scene), tall = makeTall(scene), lady = makeLady(scene);
const ex = Array.from({ length: 10 }, (_, i) => makeExtra(scene, i));
const POOLC = [...gi, RED, SMI, MINE, MET, kid, hero, mom, dad, sold, capt, bud, big, tall, lady, ...ex];
// ---------- atrezo ----------
const STM = steamFor(scene, 18), boulder = sphere(9, mat(0xffffff, { roughness: .95, map: stoneTex(2, 2, 11) }), scene, 0, 0, 0, 20, 14), beam = box(1, 1, 9, mat(0x6a4a2a), .1, scene);
const rubble = []; for (let k = 0; k < 26; k++) rubble.push(box(1.4 + (k % 3), .8 + (k % 2), 1.2 + (k % 4) * .4, mat([0xefe2c8, 0xc8462e, 0x6a4a2e, 0x8a8a8a][k % 4]), .1, scene));
const dust = []; for (let k = 0; k < 24; k++) dust.push(sphere(1, mat(0xd8c8b0, { transparent: true, opacity: .6, roughness: 1 }), scene, 0, 0, 0, 10, 8));
const cables = [0, 1].map(() => { const c = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1, 6), mat(0x1a1a1a)); scene.add(c); return c; });
const hookH = [0, 1].map(() => { const h = new THREE.Mesh(new THREE.ConeGeometry(.3, .8, 6), mat(0x9aa0a8, { metalness: .8 })); scene.add(h); return h; });
const arm = box(1.6, 9, 1.6, mat(0xe8d6c0), .4, scene), headP = sphere(3.6, mat(0xe8d6c0), scene, 0, 0, 0, 16, 12);
const sparks = []; for (let k = 0; k < 30; k++) sparks.push(sphere(.08, B([3, 2.4, 1]), scene, 0, 0, 0, 4, 3));
const drips = []; for (let k = 0; k < 14; k++) drips.push(sphere(.12, mat(0xff8a9a, { transparent: true, opacity: .8 }), scene, 0, 0, 0, 6, 4));
const bolt = new THREE.Group(); scene.add(bolt); { const m = B([2, 2.4, 3]); let x = 0, y = 0; const r = RNG(3); for (let k = 0; k < 10; k++) { const nx = x + (r() - .5) * 8, ny = y - 12; const s = box(.8, Math.hypot(nx - x, ny - y), .8, m, 0, bolt, (x + nx) / 2, (y + ny) / 2, 0); s.rotation.z = -Math.atan2(nx - x, ny - y); x = nx; y = ny; } }
const rope = new THREE.Mesh(new THREE.TorusGeometry(.5, .12, 6, 16), mat(0xb8986a)); scene.add(rope);
const mini = Array.from({ length: 14 }, (_, i) => { const g = new THREE.Group(); scene.add(g); box(1, 2, .7, mat([0xd8323a, 0x2a6ad8, 0x2ec46a, 0xffd23f, 0x9b5de5, 0xff8a23, 0x8a5a2a][i % 7]), .1, g, 0, 1, 0); box(.7, .7, .7, mat([0xfbd9c3, 0xc68b5e, 0x8d5a3b][i % 3]), .1, g, 0, 2.4, 0); return g; });
const PROPS = [STM.ps, boulder, beam, rubble, dust, cables, hookH, arm, headP, sparks, drips, bolt, rope, mini].flat();

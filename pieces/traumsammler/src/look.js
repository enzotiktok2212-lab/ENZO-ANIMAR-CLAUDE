// Prueba de estilo: personajes tipo Roblox, AO, haces de luz, luz líquida.
import { THREE, W, H, makeRenderer, makeComposer, applyPose, idlePose, walkPose, V, mat, box, cyl, sphere, canvasTex, RNG, textPlane } from './engine.js';
import { nightSky, FONT } from './sets.js';
import { makeBen, makeGrey, makeFolk, dreamOrb, lightCone, rimLight } from './roblox.js';
await document.fonts.load('700 40px Cap');
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage);
const scene = window.scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfd8f0, .004);
const camera = new THREE.PerspectiveCamera(46, W / H, .2, 3000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = new URLSearchParams(location.search).get("ao") !== "0";
const sky = nightSky(scene); sky.clouds.forEach((c, i) => c.position.set(-700 + i * 160, 380 + (i % 3) * 60, -1300)); sky.moon.position.set(-200, 380, -1400); const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x8a7a6a, 1.6); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p, s = 30, off = V(-60, 120, 80)) { const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 600 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(off); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }
// ---- barrio ----
const G = new THREE.Group(); scene.add(G);
const gr = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0x5fbf4a, { roughness: 1, map: canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#5fbf4a'; c.fillRect(0, 0, w, h); const r = RNG(2); for (let i = 0; i < 500; i++) { c.fillStyle = r() < .5 ? '#55b040' : '#6cc858'; c.fillRect(r() * w, r() * h, 2, 5); } }, true) })); gr.material.map.repeat.set(60, 60); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; G.add(gr);
const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 400), mat(0x3a3e48, { roughness: .9 })); road.rotation.x = -Math.PI / 2; road.position.y = .03; road.receiveShadow = true; G.add(road);
for (let z = 100; z > -200; z -= 8) box(.4, .02, 3.6, mat(0xf2f2f2), 0, G, 0, .05, z);
for (const s of [-1, 1]) { const sw = box(4, .3, 400, mat(0xd8d4cc), .05, G, s * 9, .15, 0); sw.castShadow = false; }
const COLS = [0xf6d86a, 0x7ab0e8, 0xf2a6c2, 0xb8e0a0, 0xe8c8f0, 0xf6b87a];
const houses = [];
function house(x, z, ci, face) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = face; G.add(g); const wall = mat(COLS[ci % 6], { roughness: .85 }), wh = mat(0xffffff, { roughness: .6 });
  const sid = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.1)'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 2); }, true); sid.repeat.set(4, 4); wall.map = sid;
  box(16, 11, 12, wall, .1, g, 0, 5.5, 0); const roof = new THREE.Mesh(new THREE.CylinderGeometry(.01, 11.6, 6, 4, 1, false, Math.PI / 4), mat([0x8a3a3a, 0x3a4a7a, 0x5a3a2a][ci % 3], { roughness: .7 })); roof.scale.set(1, 1, .8); roof.position.y = 14; roof.castShadow = true; g.add(roof);
  box(2, 4, 2, mat(0xa85a3a), .1, g, 4, 15, -2); const wins = [];
  for (const [wx, wy] of [[-4.5, 3.8], [4.5, 3.8], [-4.5, 8.4], [4.5, 8.4]]) { const wm = new THREE.MeshStandardMaterial({ color: 0x9fd0f0, roughness: .1, metalness: .2, emissive: 0xffc870, emissiveIntensity: 0 }); box(3, 3, .3, wm, .05, g, wx, wy, 6.1); box(3.6, .3, .6, wh, .05, g, wx, wy - 1.7, 6.2); box(.25, 3, .35, wh, 0, g, wx, wy, 6.2); for (const s of [-1, 1]) box(.9, 3.2, .2, mat(0x2f5a9a), .05, g, wx + s * 2.1, wy, 6.15); wins.push(wm); }
  const door = box(2.6, 5, .3, mat([0x8a2a2a, 0x2a5a3a, 0x3a3a7a][ci % 3], { roughness: .4 }), .06, g, 0, 2.5, 6.15); sphere(.15, mat(0xd9a531, { metalness: .8, roughness: .2 }), g, .9, 2.5, 6.4); box(3.2, .4, .8, wh, .05, g, 0, 5.2, 6.3);
  box(5, .4, 2.4, mat(0xc8c0b0), .05, g, 0, .2, 7.4); for (let i = -6; i <= 6; i++) if (Math.abs(i) > 1) box(.3, 1.8, .3, wh, .05, g, i * 1.2, .9, 10.5); for (const y of [.6, 1.4]) { box(5.6, .2, .15, wh, 0, g, -4.7, y, 10.5); box(5.6, .2, .15, wh, 0, g, 4.7, y, 10.5); }
  const mb = new THREE.Group(); mb.position.set(4, 0, 11.5); g.add(mb); cyl(.12, .12, 3, mat(0x5a3a22), 8, mb, 0, 1.5, 0); box(1, .8, 1.4, mat(0x2a5ab8, { metalness: .4, roughness: .3 }), .3, mb, 0, 3.2, 0); box(.1, .5, .3, mat(0xd8323a), 0, mb, .55, 3.6, .3);
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) sphere(.55, mat(k % 2 ? 0xff7ab0 : 0xffd23f, { roughness: 1 }), g, s * (3 + k * .9), .5, 8.6, 10, 8);
  houses.push({ g, wins, door }); return houses.at(-1); }
for (let i = 0; i < 6; i++) for (const s of [-1, 1]) house(s * 22, 20 - i * 24, i * 2 + (s > 0), s > 0 ? -Math.PI / 2 : Math.PI / 2);
const tree = (x, z, sc = 1) => { cyl(.6 * sc, .8 * sc, 7 * sc, mat(0x6a4428), 8, G, x, 3.5 * sc, z); const lm = mat(0x3f9a3a, { roughness: .95 }); for (let k = 0; k < 6; k++) sphere((2.6 + (k % 3) * .5) * sc, k % 2 ? lm : mat(0x4cb04a, { roughness: .95 }), G, x + Math.sin(k * 2.1) * 1.8 * sc, (8 + (k % 3) * 1.4) * sc, z + Math.cos(k * 2.1) * 1.8 * sc, 16, 12); };
for (let i = 0; i < 6; i++) for (const s of [-1, 1]) tree(s * 12.5, 8 - i * 24, 1);
const lamps = []; for (let i = 0; i < 6; i++) for (const s of [-1, 1]) { const x = s * 10.6, z = -4 - i * 24; cyl(.18, .22, 11, mat(0x2a2e3a, { metalness: .6 }), 10, G, x, 5.5, z); box(1.6, .3, .3, mat(0x2a2e3a), .05, G, x - s * .7, 11, z); const bulb = box(.9, .5, .9, mat(0xfff0c0, { emissive: 0xffc870, emissiveIntensity: 0 }), .1, G, x - s * 1.4, 10.7, z); const cone = lightCone(G, x - s * 1.4, 10.5, z, 10.4, 4.2, 0xffcf80, .22); cone.visible = false; const pl = new THREE.PointLight(0xffc070, 0, 30, 2); pl.position.set(x - s * 1.4, 10, z); G.add(pl); lamps.push({ bulb, cone, pl }); }
// ---- reparto ----
const ben = makeBen(scene), grey = makeGrey(scene), folk = [0, 1, 2].map(i => makeFolk(scene, i));
const orbs = [0, 1, 2].map(i => dreamOrb(scene, .7, [[1, .85, .35], [1, .5, .8], [.5, .95, .7]][i], [.4, .6, 1], i * 7));
// ---- torre: sala de los sueños ----
const T = new THREE.Group(); T.position.x = 600; scene.add(T); const wood = mat(0x7a4a2a, { roughness: .7 });
const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat(0x5a3a22, { roughness: .8 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; T.add(fl);
for (const [x, z, r] of [[0, -14, 0], [-14, -4, Math.PI / 2], [14, -4, -Math.PI / 2], [0, 14, Math.PI]]) { const w = new THREE.Group(); w.position.set(x, 0, z); w.rotation.y = r; T.add(w); box(30, 26, .6, mat(0x4a3428, { roughness: .9 }), 0, w, 0, 13, -.6);
  for (let y = 0; y < 5; y++) { box(28, .4, 2.4, wood, .05, w, 0, 1 + y * 4.6, .8); for (let k = 0; k < 9; k++) { const sx = -12 + k * 3; const sk = sphere(1.05, mat(0xc8a46a, { roughness: 1 }), w, sx, 2.4 + y * 4.6, .9, 14, 10); sk.scale.set(1, 1.15, .8);
    const o = dreamOrb(w, .45, [[1, .85, .35], [1, .55, .8], [.5, .95, .7], [.6, .7, 1]][(k + y) % 4], [.5, .4, 1], k * 3 + y); o.position.set(sx, 3.6 + y * 4.6, 1.2); } } }
const gear = (x, y, z, r) => { const g = new THREE.Group(); g.position.set(x, y, z); T.add(g); const d = cyl(r, r, .5, mat(0xc89a3a, { metalness: .8, roughness: .3 }), 32, g, 0, 0, 0); d.rotation.x = Math.PI / 2; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; const t = box(.5, .6, .5, mat(0xc89a3a, { metalness: .8, roughness: .3 }), .05, g, Math.cos(a) * (r + .25), Math.sin(a) * (r + .25), 0); t.rotation.z = a; } return g; };
gear(-6, 24, -13, 3); gear(3, 26, -13, 2);
const tl = new THREE.PointLight(0xffc070, 600, 60, 2); tl.position.set(0, 14, 4); T.add(tl); const beam = lightCone(T, 0, 30, -2, 30, 8, 0xffd8a0, .18);
// ---- capa de texto ----
const ov = document.createElement('canvas'); ov.width = W; ov.height = H; stage.appendChild(ov); const ctx = ov.getContext('2d');
function cap(t) { const c = ctx, sz = H * .05; c.save(); c.translate(W / 2, H * .74); c.font = `700 ${sz}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.fillStyle = '#E2FD07'; c.fillText(t, 0, 0); c.restore(); }
function day(k) { const u = sky.sky.material.uniforms; u.top.value.setRGB(.01 + .19 * k, .02 + .48 * k, .1 + .85 * k); u.mid.value.setRGB(.05 + .51 * k, .07 + .71 * k, .25 + .75 * k); u.hor.value.setRGB(.3 + .6 * k, .3 + .65 * k, .55 + .45 * k); sky.moon.material.opacity = 1 - k;
  hemi.intensity = .12 + 1.48 * k; hemi.color.setRGB(.5 + .3 * k, .55 + .33 * k, 1); sun.intensity = .35 + 2.25 * k; sun.color.setRGB(.6 + .4 * k, .7 + .24 * k, 1 - .15 * k); rim.intensity = 2.2 - .8 * k; scene.fog.color.setRGB(.05 + .7 * k, .07 + .78 * k, .18 + .76 * k); scene.fog.density = .006 - .002 * k;
  lamps.forEach(l => { l.bulb.material.emissiveIntensity = (1 - k) * 1.6; l.cone.visible = k < .5; l.pl.intensity = (1 - k) * 110; }); bloom.strength = .35 + (1 - k) * .45; }
function hide() { for (const c of [ben, grey, ...folk]) c.root.visible = false; orbs.forEach(o => o.visible = false); houses.forEach(h => h.wins.forEach(w => w.emissiveIntensity = 0)); T.visible = false; G.visible = true; beam.visible = false; ctx.clearRect(0, 0, W, H); }
const put = (c, x, y, z, r) => { c.root.visible = true; c.root.position.set(x, y, z); c.root.rotation.y = r; };
const F = [
  () => { day(1); put(ben, -14, 0, -2, .86); applyPose(ben, { ...idlePose(0), aRz: 2.5, aRe: .4 }); ben.setFace({ eyes: 'open', mouth: 'smile', bags: .9 });
    folk.forEach((f, i) => { put(f, -3 + i * 4, 0, -14 - i * 5, i % 2 ? 0 : Math.PI); applyPose(f, walkPose(i * .3)); f.setFace({ eyes: 'closed', mouth: 'smile' }); });
    camera.fov = 40; camera.position.set(-7.5, 4.6, 3.6); camera.lookAt(-13.6, 3.4, -2); camera.updateProjectionMatrix(); sh(V(-12, 0, -2)); cap('Ben'); },
  () => { day(0); houses[2].wins[2].emissiveIntensity = 4; put(grey, -1, 0, -9, .35); applyPose(grey, walkPose(.2, .6)); grey.setFace({ eyes: 'half', mouth: 'flat' }); const wc = houses[2].g.localToWorld(V(-4.5, 8.4, 6.4));
    if (!window.wb) window.wb = lightCone(G, wc.x + .2, wc.y, wc.z, 16, 3.4, 0xffd08a, .45, [1, -.55, 0]); camera.fov = 50; camera.position.set(5, 3.2, 6); camera.lookAt(-3, 6, -10); camera.updateProjectionMatrix(); sh(V(0, 0, -8)); cap('Nacht'); },
  () => { day(0); const h = houses[3]; const dp = h.g.localToWorld(V(0, 2.5, 6.4)); put(grey, dp.x - 3, 0, dp.z, Math.PI / 2); applyPose(grey, { aRx: 1.6, aRe: .2, lean: .1 }); grey.setFace({ eyes: 'half', mouth: 'smirk' });
    orbs[0].visible = true; orbs[0].scale.setScalar(1.6); orbs[0].position.copy(grey.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(-.6, -.2, 0)); orbs[0].userData.update(1.3); camera.fov = 46; camera.position.set(dp.x - 7.5, 6.5, dp.z - 7); camera.lookAt(dp.x - 2, 4.6, dp.z + .5); camera.updateProjectionMatrix(); sh(dp); cap('Träume'); },
  () => { day(0); G.visible = false; T.visible = true; beam.visible = true; put(ben, 600, 0, 2, Math.PI); applyPose(ben, { aRx: 1.6, aRe: .3, lean: .1, headX: -.15 }); ben.setFace({ eyes: 'wide', mouth: 'o', bags: .9 });
    put(grey, 601.5, 0, 6.5, Math.PI); applyPose(grey, { aLx: 1.2, aLe: .6, aLz: -.2 }); grey.setFace({ eyes: 'half', mouth: 'grin' }); grey.props.sack.visible = false; T.traverse(o => o.userData.update && o.userData.update(2));
    camera.fov = 46; camera.position.set(596, 6.2, -7); camera.lookAt(600.6, 3.6, 3.5); camera.updateProjectionMatrix(); sh(V(600, 0, 0), 25); bloom.strength = .7; cap('Endlich'); },
];
window.renderAt = (t) => { const i = Math.round(t * 30); hide(); F[i](); composer.render(); }; window.DUR = 4 / 30; window.FPS = 30; window.__ready = true;

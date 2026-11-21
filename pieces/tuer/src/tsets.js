// Tür — Lager (almacén), Felder al atardecer, puerta con buzón (inserto), arco de boda, mesa de cita, Bollerwagen, cuerda.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree } from './props.js';
import { glass, label } from './diam.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const plankT = (a, b) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(a.length); for (let y = 0; y < h; y += 16) { c.fillStyle = r() > .5 ? b : a; c.fillRect(0, y, w, 15); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y + 15, w, 1); } }, true);
const can = (col) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#c8ccd2'; c.fillRect(0, 0, w, h); c.fillStyle = col; c.fillRect(0, 14, w, 36); c.fillStyle = '#fff'; c.fillRect(8, 26, w - 16, 10); });
// ---------- Lager (X) ----------
export function lager(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(50, 40), mat(0xffffff, { map: rep(noiseTex('#8a8478', ['#7a7468', '#9a9488'], 1600, 3, 1), 6, 6) })); fl.rotation.x = -Math.PI / 2; g.add(fl);
  const wm = mat(0xffffff, { map: rep(plankT('#7a6a58', '#6a5a48'), 6, 2) }); box(50, 18, .6, wm, 0, g, 0, 9, -20); for (const s of [-1, 1]) box(.6, 18, 40, wm, 0, g, s * 25, 9, 0);
  for (let r = -1; r <= 1; r++) { const sh = new THREE.Group(); sh.position.set(r * 14, 0, -12); g.add(sh); for (const s of [-1, 1]) box(.4, 12, 3, mat(0x2a4a7a, { metalness: .5 }), .05, sh, s * 5, 6, 0); for (let lv = 0; lv < 4; lv++) { box(10.4, .3, 3, mat(0xc87a2a, { metalness: .4 }), .05, sh, 0, 1 + lv * 3, 0);
      const empty = r === 1 && lv > 1; if (!empty) for (let k = 0; k < 8; k++) { const cc = cyl(.45, .45, 1.1, mat(0xffffff, { map: can(['#d8323a', '#2a8a4a', '#f2c23a', '#2a6ad8'][(k + lv + r + 4) % 4]), metalness: .3 }), 12, sh, -4.2 + k * 1.2, 1.7 + lv * 3, 0); } } }
  for (let k = 0; k < 6; k++) box(2.4, 1.8, 2.2, mat(0xb8905a, { roughness: 1 }), .06, g, -18 + (k % 3) * 2.6, .9 + Math.floor(k / 3) * 1.8, 8);
  const sg = label(10, 2, 'LAGER', '#2a4a7a', '#ffffff', 80, .4); sg.position.set(0, 15, -19.6); g.add(sg); for (let i = -2; i <= 2; i++) box(4, .2, 1, mat(0xffffff, { emissive: 0xfff4d0, emissiveIntensity: .9 }), .05, g, i * 9, 17.6, 0);
  const lt = new THREE.PointLight(0xfff0d8, 70, 70, 1.2); lt.position.set(0, 15, 0); g.add(lt);
  return shade(g); }
// ---------- Felder al atardecer (X) ----------
export function felder(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const wheat = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#d8a83a'; c.fillRect(0, 0, w, h); const r = RNG(12); for (let i = 0; i < 900; i++) { c.fillStyle = ['#e8c050', '#b8862a', '#f0d070'][i % 3]; c.fillRect(r() * w, r() * h, 1.5, 5); } }, true);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), mat(0xffffff, { map: rep(wheat, 300, 300), roughness: 1 })); gr.rotation.x = -Math.PI / 2; g.add(gr);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(10, 3000), mat(0xffffff, { map: rep(noiseTex('#8a6a4a', ['#7a5a3a', '#9a7a5a'], 1200, 3, 1), 2, 200), roughness: 1 })); road.rotation.x = -Math.PI / 2; road.position.y = .05; g.add(road);
  const stalks = new THREE.InstancedMesh(new THREE.ConeGeometry(.12, 1.6, 4), mat(0xe0b040, { roughness: 1 }), 2400); const d = new THREE.Object3D(), r = RNG(8); for (let i = 0; i < 2400; i++) { const s = r() > .5 ? 1 : -1; d.position.set(s * (6.5 + r() * 60), .8, 60 - r() * 400); d.rotation.set((r() - .5) * .3, 0, (r() - .5) * .3); d.scale.setScalar(.7 + r() * .6); d.updateMatrix(); stalks.setMatrixAt(i, d.matrix); } stalks.frustumCulled = false; g.add(stalks);
  for (let k = 0; k < 14; k++) { const h = 120 + r() * 120, m = new THREE.Mesh(new THREE.ConeGeometry(110 + r() * 60, h, 7), mat(k % 2 ? 0x6a5a7a : 0x7a6a8a, { roughness: 1, flatShading: true })); m.position.set(-700 + k * 100, h / 2 - 20, -900 - r() * 200); g.add(m); }
  for (let k = 0; k < 10; k++) { const p = cyl(.2, .25, 9, mat(0x5a4a3a), 6, g, 7, 4.5, 40 - k * 45); box(3, .2, .2, mat(0x5a4a3a), 0, g, 7, 8.4, 40 - k * 45); }
  return shade(g); }
// ---------- puerta con buzón (inserto, X) ----------
export function porch(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g); const wall = mat(0xffffff, { map: rep(stripes('#e8dcc8', '#dccfb8', 10, false), 3, 2) });
  box(20, 14, 1, wall, 0, g, 0, 7, -.6); const door = box(5, 9, .4, mat(0x7a2a22, { roughness: .45 }), .1, g, 0, 4.5, 0); for (let k = 0; k < 2; k++) for (const s of [-1, 1]) box(1.8, 3, .1, mat(0x6a2018), .1, g, s * 1.1, 2.4 + k * 4, .25);
  const slot = box(2, .6, .2, mat(0xc89a3a, { metalness: .85, roughness: .25 }), .08, g, 0, 5.2, .3); const hole = box(1.7, .32, .05, mat(0x050505), .02, g, 0, 5.2, .41);
  const eyes = textPlane(1.7, .32, 340, 64, (c, w, h) => { c.fillStyle = '#050505'; c.fillRect(0, 0, w, h); for (const x of [120, 220]) { c.fillStyle = '#f4ecd8'; c.beginPath(); c.ellipse(x, 36, 22, 14, 0, 0, 7); c.fill(); c.fillStyle = '#4a6a8a'; c.beginPath(); c.arc(x, 36, 9, 0, 7); c.fill(); c.fillStyle = '#000'; c.beginPath(); c.arc(x, 36, 4, 0, 7); c.fill(); } c.fillStyle = '#e8e8e8'; for (const x of [120, 220]) { c.fillRect(x - 30, 4, 60, 12); } });
  eyes.position.set(0, 5.2, .44); g.add(eyes); sphere(.2, mat(0xc89a3a, { metalness: .85 }), g, 1.8, 4.5, .3); const num = label(1.4, .8, '7', '#f4ecd8', '#2a1a10', 60, .2); num.position.set(0, 7.6, .3); g.add(num);
  const step = box(7, .6, 3, mat(0x9a948a), .05, g, 0, .3, 1.5); const lamp = sphere(.5, mat(0xfff0c0, { emissive: 0xffc870, emissiveIntensity: 1 }), g, 3.6, 7.5, .5, 12, 8);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat(0x7a9a5a)); fl.rotation.x = -Math.PI / 2; g.add(fl);
  return { g: shade(g), eyes, slot }; }
// ---------- atrezo ----------
export function wagon(scene) { const g = new THREE.Group(); scene.add(g); const wd = mat(0xc8322a, { roughness: .5 }); box(3, 1.2, 2, wd, .1, g, 0, 1.4, 0); for (const [x, z] of [[-1.1, -1], [1.1, -1], [-1.1, 1], [1.1, 1]]) { const w = cyl(.45, .45, .25, mat(0x1a1a1a), 14, g, x, .45, z); w.rotation.x = Math.PI / 2; }
  const h = cyl(.06, .06, 3, mat(0x2a2a2a), 6, g, 2.6, 1.6, 0); h.rotation.z = 1.2; for (let k = 0; k < 5; k++) box(.8, .7, .8, mat([0xd8a050, 0xb8905a, 0xe8d8b8][k % 3]), .05, g, -1 + (k % 3) * .9, 2.2 + Math.floor(k / 3) * .6, (k % 2) * .5 - .25); return shade(g); }
export function arch(scene) { const g = new THREE.Group(); scene.add(g); const w = mat(0xf4f4f4); for (const s of [-1, 1]) box(.4, 7, .4, w, .05, g, s * 3, 3.5, 0); const t = new THREE.Mesh(new THREE.TorusGeometry(3, .25, 8, 24, Math.PI), w); t.position.y = 7; g.add(t);
  const r = RNG(4); for (let k = 0; k < 40; k++) { const a = r() * Math.PI; sphere(.35, mat([0xff8ab0, 0xffffff, 0xff4a6a][k % 3]), g, Math.cos(a) * 3, 7 + Math.sin(a) * 3, (r() - .5) * .4, 8, 6); } return shade(g); }
export function dateTable(scene) { const g = new THREE.Group(); scene.add(g); cyl(1.8, 1.8, .15, mat(0xf4f4f4), 24, g, 0, 3.4, 0); cyl(.15, .2, 3.4, mat(0x2a2a2a), 8, g, 0, 1.7, 0); cyl(.18, .18, .8, mat(0xf4ead8), 8, g, 0, 3.9, 0); sphere(.1, new THREE.MeshBasicMaterial({ color: 0xffc040, toneMapped: false }), g, 0, 4.4, 0, 6, 4);
  for (const s of [-1, 1]) { cyl(.25, .2, .5, mat(0xffffff, { transparent: true, opacity: .5 }), 10, g, s * .8, 3.75, .4); cyl(.7, .7, .05, mat(0xffffff), 16, g, s * .9, 3.5, -.3); } return shade(g); }
// cuerda: segmentos entre puntos
export function rope(scene, n = 60) { const m = mat(0xc8a46a, { roughness: .9 }); const segs = Array.from({ length: n }, () => { const c = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 1, 6), m); c.castShadow = true; scene.add(c); return c; });
  const up = new THREE.Vector3(0, 1, 0); const draw = (pts, sag = .3) => { let k = 0; for (let i = 0; i < pts.length - 1 && k < n; i++) { const a = pts[i], b = pts[i + 1], mid = a.clone().add(b).multiplyScalar(.5); mid.y -= sag; for (const [p, q] of [[a, mid], [mid, b]]) { if (k >= n) break; const s = segs[k++]; s.visible = true; s.position.copy(p).add(q).multiplyScalar(.5); s.scale.set(1, p.distanceTo(q), 1); s.quaternion.setFromUnitVectors(up, q.clone().sub(p).normalize()); } } for (; k < n; k++) segs[k].visible = false; };
  return { segs, draw }; }

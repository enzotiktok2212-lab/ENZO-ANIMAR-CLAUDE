// Finsternis — desierto, gasolinera, torre de agua, Heldenamt, dormitorio, mapa del tiempo; gigante de fuego y efectos de clima.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, character, applyPose, RNG } from './engine.js';
import { mk, hairS, glasses, cap, hoodie, jacket, noiseTex, stripes, txt, screen, tree } from './props.js';
import { room } from './school.js';
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const B = c => new THREE.MeshBasicMaterial({ color: new THREE.Color(...c), toneMapped: false, transparent: true });

// ---------- desierto con grietas, rocas, cactus y torre de agua ----------
export function desert(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), mat(0xffffff, { map: noiseTex('#e8b878', ['#d8a868', '#f2c88a', '#c8985a'], 4000, 3, 60), roughness: 1 })); sand.rotation.x = -Math.PI / 2; sand.receiveShadow = true; g.add(sand);
  for (let k = 0; k < 14; k++) { const d = sphere(8 + (k % 4) * 5, mat(0xe0b070, { roughness: 1, flatShading: true }), g, -200 + k * 30, -4, -120 - (k % 3) * 40, 10, 6); d.scale.y = .4; }
  const cracks = []; for (let k = 0; k < 9; k++) { const c = box(.9 + (k % 3) * .3, .05, 10 + k * 1.4, B([3, 1.2, .2]), 0, g, Math.sin(k * 1.7) * 6, .06, -20 + Math.cos(k * 2.3) * 6); c.rotation.y = k * .7; cracks.push(c); }
  for (let k = 0; k < 10; k++) { const c = new THREE.Group(); c.position.set(-60 + k * 13, 0, -30 - (k % 4) * 18); g.add(c); const m = mat(0x3a9a4a, { roughness: .8 }); cyl(.8, 1, 7, m, 10, c, 0, 3.5, 0); const a1 = cyl(.5, .5, 3, m, 8, c, 1.4, 4.4, 0); a1.rotation.z = -1.2; cyl(.5, .5, 2.4, m, 8, c, 2.2, 5.6, 0); }
  for (let k = 0; k < 18; k++) { const r = box(2 + (k % 3), 1.4 + (k % 2), 2, mat(0xb07a4a, { flatShading: true }), .4, g, -70 + k * 8, .6, 10 - (k % 5) * 14); r.rotation.y = k; }
  const wt = new THREE.Group(); wt.position.set(26, 0, -70); g.add(wt); const st = mat(0x8a8f9a, { metalness: .6 }); for (const [x, z] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) { const l = cyl(.4, .5, 30, st, 8, wt, x, 15, z); } for (const y of [10, 20]) { box(9, .4, .4, st, 0, wt, 0, y, -4); box(9, .4, .4, st, 0, wt, 0, y, 4); }
  cyl(8, 8, 10, mat(0x7ab8e0, { metalness: .3, roughness: .4 }), 32, wt, 0, 35, 0); const cone = new THREE.Mesh(new THREE.ConeGeometry(8.4, 4, 32), mat(0x5a9ac8)); cone.position.y = 42; wt.add(cone); const t = textPlane(12, 3, 480, 120, (c, w, h) => txt(c, 'STADT', w / 2, h / 2, 90, '#fff'), .3); t.position.set(0, 36, 8.05); wt.add(t);
  return { g, cracks }; }
export function gasStation(parent, x, z) { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const r = mat(0xd8323a), w = mat(0xf4f4f4);
  box(22, 1.2, 12, r, .1, g, 0, 9, 0); box(22.4, .6, 12.4, w, .1, g, 0, 8.2, 0); for (const xx of [-8, 8]) cyl(.5, .5, 8, w, 10, g, xx, 4, 0); for (const xx of [-4, 4]) { box(1.6, 4, 1.2, w, .2, g, xx, 2, 0); box(1.4, 1, .1, mat(0x111111), .05, g, xx, 3, .65); }
  box(16, 7, 10, mat(0xfff2d8), .1, g, 0, 3.5, -14); const s = textPlane(10, 2, 400, 80, (c, w2, h) => { c.fillStyle = '#d8323a'; c.fillRect(0, 0, w2, h); txt(c, 'TANKSTELLE', w2 / 2, h / 2 + 3, 56, '#fff'); }, .5); s.position.set(0, 9, 6.25); g.add(s); return g; }

// ---------- Heldenamt ----------
export function heroOffice(scene, X) { const g = room(scene, X, 36, 26, 20, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#e8eef8'; c.fillRect(0, 0, w, h * .6); c.fillStyle = '#2a4aa8'; c.fillRect(0, h * .6, w, h); }, true), 8, 1) }), mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#c8d4e8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#aab8d0'; c.strokeRect(0, 0, w, h); }, true), 10, 8) }));
  box(16, 4.4, 3, mat(0x2a4aa8, { roughness: .4 }), .1, g, 0, 2.2, -5); box(16.4, .3, 3.4, mat(0xffd23f, { metalness: .6 }), .05, g, 0, 4.5, -5);
  const sg = textPlane(16, 3, 640, 120, (c, w, h) => { c.fillStyle = '#1d2a6a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); txt(c, '★ HELDENAMT ★', w / 2, h / 2 + 4, 76, '#ffd23f'); }, .5); sg.position.set(0, 15, -12.6); g.add(sg);
  for (let k = 0; k < 3; k++) { const p = textPlane(4, 5, 160, 200, (c, w, h) => { c.fillStyle = ['#ff5a5a', '#5ab0ff', '#ffd23f'][k]; c.fillRect(0, 0, w, h); txt(c, ['FEUER', 'REGEN', 'BLITZ'][k], w / 2, 30, 30, '#1d2238'); c.fillStyle = '#fff'; c.fillRect(30, 60, w - 60, 110); }, .2); p.position.set(-12 + k * 4.8, 10, -12.6); g.add(p); }
  for (let k = 0; k < 4; k++) box(.9, 2.6 + (k % 2), 2, mat([0x2a5a8a, 0x8a2a2a][k % 2]), .03, g, 12 + k, 7, -12); box(5, 12, 2, mat(0x8a5a30), .1, g, 13.5, 6, -12.2);
  const card = textPlane(1.6, 1, 320, 200, () => {}, .2); return { g }; }
export function idCard(scene) { const s = screen(1.8, 1.15, 360, 230, .5); scene.add(s); s.userData.set = (t) => s.userData.draw(t, (c, w, h) => { c.fillStyle = '#f4f6fa'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a4aa8'; c.fillRect(0, 0, w, 50); txt(c, 'WETTER-AUSWEIS', w / 2, 27, 30, '#fff'); c.fillStyle = '#c8d4e8'; c.fillRect(20, 70, 90, 110); txt(c, 'Wetter:', 230, 100, 34, '#555'); txt(c, t, 230, 160, t.length > 10 ? 22 : t.length > 6 ? 30 : 46, t === 'keins' ? '#d8323a' : '#1d8a4a'); }); return s; }

// ---------- dormitorio con escritorio, tarro y cortinas ----------
export function bedroom(scene, X) { const g = room(scene, X, 34, 26, 20, mat(0xffffff, { map: rep(stripes('#3a4a8a', '#46589e', 10), 6, 1) }), mat(0xffffff, { map: rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#a06a38'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { c.fillStyle = y % 32 ? '#94602f' : '#ac7642'; c.fillRect(0, y, w, 15); } }, true), 4, 4) }), false);
  const desk = new THREE.Group(); desk.position.set(4, 0, -9); g.add(desk); box(10, .5, 4.4, mat(0x6a4a2a), .1, desk, 0, 4.4, 0); for (const s of [-1, 1]) box(.5, 4.4, 4, mat(0x5a3a1a), .05, desk, s * 4.6, 2.2, 0); for (let k = 0; k < 5; k++) box(.6, 2 + (k % 2) * .4, 1.4, mat([0xd8323a, 0x3a8ad8, 0xffd23f, 0x2ec46a, 0x9b5de5][k]), .03, desk, -4 + k * .7, 5.6, -1.4); const lampD = cyl(.4, .6, .3, mat(0x222222), 12, desk, 3.6, 4.8, -1);
  const win = new THREE.Group(); win.position.set(4, 11, -12.6); g.add(win); const wp = screen(9, 6.4, 360, 256, .9); win.add(wp); box(9.6, .4, .6, mat(0xffffff), .05, win, 0, -3.4, .2);
  const curt = []; for (const s of [-1, 1]) { const c = box(5, 8, .4, mat(0x8a2a3a, { roughness: .9 }), .2, win, s * 2.6, 0, .5); curt.push(c); }
  const bed = new THREE.Group(); bed.position.set(-9, 0, -4); g.add(bed); box(7, 2, 12, mat(0x5a3a22), .2, bed, 0, 1, 0); box(6.6, 1.2, 11.4, mat(0xffffff), .4, bed, 0, 2.6, 0); box(6.8, .6, 8, mat(0x3a6ad8), .2, bed, 0, 3.3, 2); box(4, 1, 2, mat(0xffffff), .4, bed, 0, 3.4, -4.6);
  const jar = new THREE.Group(); desk.add(jar); jar.position.set(0, 4.65, .6); cyl(1, 1, 2.4, mat(0xd8f0ff, { transparent: true, opacity: .35, roughness: .02, side: THREE.DoubleSide }), 24, jar, 0, 1.2, 0); cyl(1.05, 1.05, .4, mat(0xb0b0b8, { metalness: .8 }), 24, jar, 0, 2.6, 0);
  const L = new THREE.PointLight(0xffe8c8, 180, 60, 2); L.position.set(0, 16, 4); g.add(L);
  const drawWin = (k) => wp.userData.draw(k, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, k === 'day' ? '#5ab0ff' : '#0a1236'); s.addColorStop(1, k === 'day' ? '#e0f4ff' : '#2a2a5a'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = k === 'day' ? '#7a8aa8' : '#1a1a3a'; for (let i = 0; i < 6; i++) c.fillRect(i * 62, h - 60 - (i % 3) * 30, 50, 90); if (k !== 'day') { c.fillStyle = '#fff'; for (let i = 0; i < 30; i++) c.fillRect((i * 97) % w, (i * 53) % (h * .5), 2, 2); } });
  return { g, desk, jar, curt, drawWin }; }

// ---------- mapa del tiempo del pasillo ----------
export function weatherMap(parent) { const s = screen(12, 7, 600, 350, .35); parent.add(s); s.userData.draw('map', (c, w, h) => { c.fillStyle = '#eef6ff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a6ad8'; c.fillRect(0, 0, w, 60); txt(c, 'WETTERKARTE', w / 2, 32, 40, '#fff');
  const N = [['MIA', '💧'], ['TOM', '❄'], ['LEO', '🌀'], ['EMMA', '⚡'], ['BEN', '☀'], ['LINA', '💨'], ['PAUL', '🌧'], ['ICH', '']]; N.forEach(([n, sy], i) => { const x = i < 4 ? 40 : 320, y = 100 + (i % 4) * 62; c.strokeStyle = '#2a6ad8'; c.lineWidth = 4; c.strokeRect(x, y - 22, 46, 46); if (sy) { c.font = '34px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(sy, x + 23, y + 2); } c.font = `700 36px Cap, sans-serif`; c.textAlign = 'left'; c.fillStyle = n === 'ICH' ? '#d8323a' : '#1d2238'; c.fillText(n, x + 66, y + 4); }); }); return s; }

// ---------- gigante de fuego ----------
export function fireGiant(scene) { const ch = character(scene, { seed: 99, scale: 6.5, skin: 0xff7a1a, skinCss: '#ff7a1a', shirt: 0xff6a10, shirt2: 0xff8a20, pants: 0xe85a10, shoes: 0xc84a08, sole: 0x8a2a00, hair: 0xffa020, noBelt: true, face: { iris: '#fff2a0', eyes: 'squint', mouth: 'frown', brows: .8, browColor: '#7a1a00' } });
  const hot = [], flames = [];
  ch.root.traverse(o => { if (o.isMesh && o.material && o.material.color) { o.material = o.material.clone(); o.material.emissive = new THREE.Color(0xff4a00); o.material.emissiveIntensity = .45; hot.push(o.material); o.castShadow = true; } });
  const add = (p, x, y, z, s) => { const f = new THREE.Mesh(new THREE.ConeGeometry(.35 * s, 1.4 * s, 8), B([1.9, .8 + Math.random() * .5, .12])); f.position.set(x, y, z); p.add(f); flames.push(f); };
  for (let k = 0; k < 10; k++) add(ch.head, -.6 + (k % 5) * .3, 1.4 + (k % 2) * .2, -.3 + Math.floor(k / 5) * .5, 1.1); for (let k = 0; k < 12; k++) add(ch.spine, -1 + (k % 4) * .65, 2.2 + Math.floor(k / 4) * .1, -.4 + (k % 3) * .4, .9);
  for (const a of [ch.aL, ch.aR]) for (let k = 0; k < 4; k++) add(a.sh, (k % 2) * .4 - .2, -.2 - k * .4, .5, .7);
  const core = sphere(.55, B([2.2, 2, 1.2]), ch.spine, 0, 1.1, .6, 20, 14); const halo = sphere(.9, B([2, 1, .3]), ch.spine, 0, 1.1, .55, 20, 14); halo.material.opacity = .22;
  const light = new THREE.PointLight(0xff8a30, 400, 120, 2); light.position.set(0, 1.4, 2); ch.spine.add(light);
  ch.setHeat = (k, T = 0) => { hot.forEach(m => { m.emissiveIntensity = .08 + .42 * k; m.color.setRGB(lerp(.35, 1, k), lerp(.35, .45, k), lerp(.38, .1, k)); }); flames.forEach((f, i) => { f.visible = k > .15; f.scale.set(1, (.6 + .5 * Math.sin(T * 14 + i)) * k, 1); }); core.material.color.setRGB(2 * k + .2, (1.8 * k + .1) * (k > .6 ? 1 : .5), 1.1 * k * k); core.scale.setScalar(.6 + k * .5); halo.visible = k > .2; light.intensity = 400 * k; };
  ch.setHeat(1); return ch; }
const lerp = (a, b, k) => a + (b - a) * k;
export function tornado(parent) { const g = new THREE.Group(); parent.add(g); const rings = []; for (let k = 0; k < 14; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1 + k * .45, .25 + k * .03, 6, 24), B([1.6, 1.8, 2])); r.material.opacity = .25; r.rotation.x = Math.PI / 2; r.position.y = k * 1.4; g.add(r); rings.push(r); } g.userData.update = T => rings.forEach((r, k) => { r.rotation.z = T * 8 + k; r.position.x = Math.sin(T * 3 + k * .4) * .6; }); return g; }
export function iceWall(parent) { const g = new THREE.Group(); parent.add(g); for (let k = 0; k < 18; k++) { const b = box(3, 3 + (k % 3), 2, new THREE.MeshStandardMaterial({ color: 0xbfefff, transparent: true, opacity: .8, roughness: .05, metalness: .1, emissive: 0x3a8ab8, emissiveIntensity: .4 }), .2, g, -13 + (k % 9) * 3.2, 1.6 + Math.floor(k / 9) * 3.2, 0); } return g; }
export function sunDisc(scene) { const g = new THREE.Group(); scene.add(g); const s = sphere(14, B([3, 2.8, 1.8]), g, 0, 0, 0, 32, 16); const moon = sphere(14.4, new THREE.MeshBasicMaterial({ color: 0x000000 }), g, 0, 0, 3, 32, 16); const cor = new THREE.Mesh(new THREE.RingGeometry(14, 24, 48), B([2.2, 2.2, 2.6])); cor.material.opacity = .5; cor.position.z = 2; g.add(cor); g.userData = { s, moon, cor }; return g; }

// DICKKOPF — atrezo y escenarios propios: paquete, regadera, ensalada de patatas, bastoncillo, zapatillas, bolsas de Haribo y montaña de ositos,
// nube de nieve con copos, atril y cinta del Freibad, tijeras, patito, fachada con ventana de verdad (mi cuarto), guirnalda de luces.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { txt, noiseTex } from './props.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.repeat.set(a, b); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glow = (c, k = 1) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: k, roughness: .4 });

export function paket(parent, label = 'PAKET') { const g = G(parent); box(2.2, 1.6, 1.8, mat(0xffffff, { map: noiseTex('#c8955a', ['#b8854a', '#d4a46a'], 500, 2, 1), roughness: .95 }), .08, g, 0, .8, 0); box(2.24, .2, .4, mat(0xd8c890, { roughness: .5 }), .02, g, 0, 1.61, 0);
  const l = textPlane(1.4, .6, 140, 60, (c, w, h) => { c.fillStyle = '#fff8e8'; c.fillRect(0, 0, w, h); txt(c, label, w / 2, h / 2 + 3, 34, '#d8202a'); }); l.position.set(0, .9, .92); g.add(l); return shade(g); }
export function giesskanne(parent) { const g = G(parent); const m = mat(0x2ab86a, { roughness: .35, metalness: .3 }); cyl(.7, .8, 1.6, m, 18, g, 0, .8, 0); const sp = cyl(.12, .2, 2.0, m, 10, g, .9, 1.2, 0); sp.rotation.z = -1.0; cyl(.3, .14, .3, m, 12, g, 1.7, 1.75, 0).rotation.z = -1.0;
  const hd = new THREE.Mesh(new THREE.TorusGeometry(.6, .1, 8, 18, Math.PI), m); hd.position.set(-.1, 1.6, 0); g.add(hd); return shade(g); }
export function salatschuessel(parent) { const g = G(parent); cyl(1.2, .8, .9, mat(0xf4f4f4, { roughness: .2 }), 24, g, 0, .45, 0); const s = sphere(1.12, mat(0xf2d26a, { roughness: .8 }), g, 0, .8, 0, 18, 10); s.scale.y = .35;
  const r = RNG(5); for (let k = 0; k < 14; k++) box(.28, .2, .28, mat([0xf6e08a, 0x8ac84a, 0xf4f0d0][k % 3], { roughness: .8 }), .05, g, (r() - .5) * 1.5, 1.05, (r() - .5) * 1.5); return shade(g); }
export function wattestaebchen(parent, s = 1) { const g = G(parent); g.scale.setScalar(s); cyl(.12, .12, 6, mat(0xf4f4f8, { roughness: .5 }), 8, g, 0, 0, 0); for (const y of [-3.2, 3.2]) { const b = sphere(.42, mat(0xffffff, { roughness: 1 }), g, 0, y, 0, 12, 10); b.scale.y = 1.5; } return shade(g); }
export function turnschuhe(parent) { const g = G(parent); for (const s of [-1, 1]) { const sh = G(g, s * 1.0, 0, 0); box(1.5, .9, 2.8, mat(0xffffff, { roughness: .5 }), .3, sh, 0, .55, 0); box(1.6, .3, 3.0, mat(0xd8323a, { roughness: .6 }), .1, sh, 0, .15, 0); box(1.0, .2, 1.2, mat(0x1a1a22), .05, sh, 0, 1.02, -.3); for (let k = 0; k < 3; k++) box(1.1, .08, .12, mat(0xd8323a), 0, sh, 0, .95, .2 + k * .35); } return shade(g); }
// bolsa de Haribo (amarilla, letras rojas) y montaña de ositos de goma
const bagT = canvasTex(256, 320, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ffe23a'); g.addColorStop(1, '#ffc81a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#e8202a'; c.fillRect(0, 0, w, 20); c.fillRect(0, h - 20, w, 20);
  c.save(); c.translate(w / 2, 92); c.rotate(-.08); txt(c, 'HARIBO', 0, 0, 66, '#e8202a'); c.restore(); txt(c, 'Goldbären', w / 2, 150, 34, '#1a3a8a'); for (let k = 0; k < 5; k++) { c.fillStyle = ['#e8202a', '#2ab84a', '#ff8a1a', '#ffffff', '#ffd23f'][k]; c.beginPath(); c.ellipse(46 + k * 42, 230, 17, 26, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.stroke(); } });
export function haribo(parent) { const g = G(parent); const b = box(2.4, 3.2, .7, mat(0xffffff, { map: bagT, roughness: .35, metalness: .1 }), .25, g, 0, 1.6, 0); return shade(g); }
export function baerenberg(parent, n = 700, seed = 7) { const geo = new THREE.CapsuleGeometry(.22, .32, 4, 8); const im = new THREE.InstancedMesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .25, transmission: .25, thickness: .5 }), n);
  const r = RNG(seed), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), S = new THREE.Vector3(1, 1, 1), C = new THREE.Color(); const cols = [0xe8202a, 0x2ab84a, 0xff8a1a, 0xfff4d0, 0xffd23f, 0xff6ab8];
  for (let i = 0; i < n; i++) { const a = r() * 6.283, rad = Math.sqrt(r()) * 6; P.set(Math.cos(a) * rad, Math.max(.2, (6 - rad) * 1.1 * r() + .2), Math.sin(a) * rad * .8); Q.setFromEuler(E.set(r() * 3, r() * 3, r() * 3)); M.compose(P, Q, S); im.setMatrixAt(i, M); im.setColorAt(i, C.setHex(cols[i % 6])); }
  im.castShadow = im.receiveShadow = true; parent.add(im); return im; }
// nube de nieve sobre la cabeza: userData.snow(T) mueve los copos
export function schneewolke(parent) { const g = G(parent); const m = mat(0x9aa2b0, { roughness: 1 }); const r = RNG(3); for (let k = 0; k < 9; k++) { const s = sphere(1.1 + r() * .9, m, g, (r() - .5) * 4, r() * .8, (r() - .5) * 2, 14, 10); s.scale.y = .7; s.castShadow = true; }
  const fl = []; const fm = mat(0xffffff, { roughness: 1, emissive: 0xffffff, emissiveIntensity: .3 }); for (let k = 0; k < 40; k++) fl.push(sphere(.09, fm, g, 0, 0, 0, 6, 4));
  g.userData.snow = (T, h = 5) => fl.forEach((f, i) => { const rr = RNG(i * 7 + 1); const y = -((T * (1.2 + rr()) + rr() * h) % h); f.position.set((rr() - .5) * 4 + Math.sin(T * 2 + i) * .2, y - .4, (rr() - .5) * 2.4); }); return g; }
// atril con escudo y cinta roja entre dos postes; tijeras gigantes
export function rednerpult(parent) { const g = G(parent); const wd = mat(0x7a4a24, { roughness: .6 }); box(3, 4.2, 2, wd, .15, g, 0, 2.1, 0); const t = box(3.6, .3, 2.4, wd, .1, g, 0, 4.35, .1); t.rotation.x = .25;
  const e = textPlane(2.2, 2.2, 220, 220, (c, w, h) => { c.fillStyle = '#2a6ad8'; c.beginPath(); c.moveTo(20, 20); c.lineTo(w - 20, 20); c.lineTo(w - 20, 120); c.quadraticCurveTo(w / 2, 220, 20, 120); c.closePath(); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 10; c.stroke(); txt(c, 'HB', w / 2, 92, 74, '#ffd23f'); }); e.position.set(0, 2.5, 1.02); g.add(e);
  cyl(.06, .06, 1.2, mat(0x1a1a1a, { metalness: .6 }), 6, g, 0, 5.0, .5).rotation.x = -.6; sphere(.2, mat(0x1a1a1a), g, 0, 5.5, .82, 8, 6); return shade(g); }
export function band(parent, w = 16) { const g = G(parent); for (const s of [-1, 1]) { cyl(.18, .22, 4.4, mat(0xc0c4cc, { metalness: .7, roughness: .3 }), 10, g, s * w / 2, 2.2, 0); sphere(.35, mat(0xffd23f, { metalness: .7, roughness: .3 }), g, s * w / 2, 4.5, 0, 10, 8); }
  const r = box(w, .7, .06, mat(0xd8202a, { roughness: .5 }), .02, g, 0, 3.4, 0); const bow = G(g, 0, 3.4, .1); for (const s of [-1, 1]) { const l = box(1, .7, .1, mat(0xd8202a), .1, bow, s * .5, 0, 0); l.rotation.z = s * .4; } g.userData.ribbon = r; g.userData.bow = bow; return shade(g); }
export function schere(parent) { const g = G(parent); const m = mat(0xd8d8e0, { metalness: .9, roughness: .2 }); for (const s of [-1, 1]) { const b = box(.2, 2.2, .08, m, .03, g, s * .12, 1.2, 0); b.rotation.z = s * .18; const h = new THREE.Mesh(new THREE.TorusGeometry(.35, .1, 8, 16), mat(0xffd23f, { roughness: .4 })); h.position.set(s * .35, -.2, 0); g.add(h); } return shade(g); }
export function ente(parent) { const g = G(parent); const y = mat(0xffd21a, { roughness: .3 }); const b = sphere(.8, y, g, 0, .6, 0, 14, 10); b.scale.set(1.2, .8, 1); sphere(.5, y, g, .5, 1.3, 0, 12, 10); box(.5, .18, .3, mat(0xff8a1a), .08, g, 1.0, 1.25, 0); for (const s of [-1, 1]) sphere(.08, mat(0x1a1a1a), g, .78, 1.45, s * .22, 6, 4); return shade(g); }
// fachada de mi casa con una ventana DE VERDAD (hueco) y mi cuarto detrás; la fachada mira a +z. Hueco: x ∈ [-4, 4], y ∈ [8, 15]
export function fenster(scene, X) { const g = G(scene, X); const wm = mat(0xffffff, { map: rep(noiseTex('#f2dcb6', ['#e8d0a8', '#f6e4c4'], 1500, 2, 1), 3, 3), roughness: .9 }), beam = mat(0x6a3a1e, { roughness: .7 });
  box(14, 8, .8, wm, 0, g, -11, 4, 0); box(14, 8, .8, wm, 0, g, 11, 4, 0); box(36, 8, .8, wm, 0, g, 0, 4, 0); box(14, 7, .8, wm, 0, g, -11, 11.5, 0); box(14, 7, .8, wm, 0, g, 11, 11.5, 0); box(36, 12, .8, wm, 0, g, 0, 21, 0);
  for (const x of [-17.6, -4.4, 4.4, 17.6]) box(.8, 27, 1, beam, .05, g, x, 13.5, .2); for (const y of [.4, 7.6, 15.4, 26.6]) box(36, .8, 1, beam, .05, g, 0, y, .2); for (const s of [-1, 1]) { const d = box(.6, 8, 1, beam, .05, g, s * 11, 4, .25); d.rotation.z = s * .5; }
  box(9.6, .6, 2.2, mat(0xf4f4f0), .1, g, 0, 7.7, .8); const bx = box(9, 1.2, 1.4, mat(0x8a5a2a, { roughness: .8 }), .1, g, 0, 8.4, 1.4); for (let k = 0; k < 9; k++) sphere(.5, mat([0xe8323a, 0xffd23f, 0xff8ad0][k % 3]), g, -4 + k, 9.3, 1.4, 8, 6);
  for (const s of [-1, 1]) { const sh = box(3.2, 7.4, .3, mat(0x2a7a4a, { roughness: .6 }), .1, g, s * 6.2, 11.5, .7); for (let k = 0; k < 6; k++) box(2.6, .2, .1, mat(0x1e5a36), 0, g, s * 6.2, 8.6 + k * 1.15, .9); }
  const roof = mat(0xffffff, { map: rep(noiseTex('#9a3a2a', ['#8a2a1e', '#aa4a34'], 1200, 2, 1), 4, 2), roughness: .8 }); const rf = box(40, 1, 12, roof, .1, g, 0, 28, -3); rf.rotation.x = -.5;
  // cuarto detrás (cálido)
  const R = G(g, 0, 0, -10); const wall = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#9ac8e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#b8dcf4'; for (let k = 0; k < 4; k++) c.fillRect(k * 16, 0, 6, h); }), 6, 3), roughness: .9 });
  box(30, .4, 20, mat(0xb07a48, { roughness: .7 }), 0, R, 0, 7.6, 0); box(30, 16, .4, wall, 0, R, 0, 15, -9.8); for (const s of [-1, 1]) box(.4, 16, 20, wall, 0, R, s * 15, 15, 0); box(30, .4, 20, mat(0xf4f0e8), 0, R, 0, 22.8, 0);
  const po = textPlane(4, 5.4, 160, 216, (c, w, h) => { c.fillStyle = '#1a2a5a'; c.fillRect(0, 0, w, h); txt(c, 'FC', w / 2, 70, 70, '#ffd23f'); txt(c, 'HUFENBACH', w / 2, 140, 26, '#ffffff'); }); po.position.set(-5, 15.5, -9.55); R.add(po);
  const L = new THREE.PointLight(0xffd8a0, 60, 40, 1.6); L.position.set(0, 20, -4); R.add(L);
  return { g: shade(g), L }; }
// guirnalda de bombillas entre dos puntos
export function lichter(parent, a, b, n = 20, sag = 1.5) { const g = G(parent); const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b); const cols = [0xffd890, 0xff6a8a, 0x8ad8ff, 0xffe070];
  for (let i = 0; i <= n; i++) { const t = i / n, p = A.clone().lerp(B, t); p.y -= Math.sin(t * Math.PI) * sag; sphere(.28, glow(cols[i % 4], 2.2), g, p.x, p.y, p.z, 8, 6); } return g; }
// fachada de la Bäckerei con puerta abierta (hueco x ∈ [-2.4, 2.4], y < 8.6); mira a +z
export function ladentuer(parent) { const g = G(parent); const wm = mat(0xffffff, { map: rep(noiseTex('#f4d8b0', ['#ecd0a4', '#f8e2c0'], 1200, 2, 1), 3, 2), roughness: .9 }), beam = mat(0x6a3a1e, { roughness: .7 });
  box(9, 16, 1, wm, 0, g, -6.9, 8, 0); box(9, 16, 1, wm, 0, g, 6.9, 8, 0); box(4.8, 7.4, 1, wm, 0, g, 0, 12.3, 0); for (const x of [-2.6, 2.6]) box(.5, 8.8, 1.3, beam, .05, g, x, 4.4, .1); box(5.7, .6, 1.3, beam, .05, g, 0, 8.9, .1);
  const d = box(4.6, 8.4, .3, mat(0x2a6a4a, { roughness: .4 }), .06, g, -2.4, 4.2, 2.2); d.rotation.y = 1.4; box(13, .6, 1.4, beam, .05, g, -6.9, 12, .2); box(13, .6, 1.4, beam, .05, g, 6.9, 12, .2);
  const s = textPlane(9, 2.2, 450, 110, (c, w, h) => { c.fillStyle = '#7a1a1a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.strokeRect(4, 4, w - 8, h - 8); txt(c, 'BÄCKEREI SONNE', w / 2, h / 2 + 3, 56, '#ffe8a0'); }); s.position.set(0, 13.8, .56); g.add(s);
  for (const s_ of [-1, 1]) { const w = textPlane(4.4, 4.6, 176, 184, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffe8b8'); gr.addColorStop(1, '#d8a060'); c.fillStyle = gr; c.fillRect(0, 0, w, h); for (let k = 0; k < 6; k++) { c.fillStyle = '#b8743a'; c.beginPath(); c.ellipse(30 + (k % 3) * 58, 110 + Math.floor(k / 3) * 40, 24, 14, 0, 0, 7); c.fill(); } }, .25); w.position.set(s_ * 6.9, 6, .56); g.add(w); }
  const inner = box(4.8, 8.6, .3, mat(0xffd8a0, { emissive: 0xffb860, emissiveIntensity: .25 }), 0, g, 0, 4.3, -4); return shade(g); }

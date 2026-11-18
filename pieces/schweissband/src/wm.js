// SCHWEISSBAND — atrezo propio: balón de baloncesto, canasta, muñequera dorada, pedestal, cajita de Opa, carta, podio,
// mesa de punto, jersey, flauta dulce, pancarta de la calle, cancha de madera, banderas de países inventados.
import { THREE, mat, box, cyl, sphere, textPlane, canvasTex, RNG } from './engine.js';
import { FONT } from './sets.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const shade = g => { g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return g; };
export const GOLD = () => mat(0xffc828, { metalness: .9, roughness: .18, emissive: 0x5a3a00, emissiveIntensity: .45 });
const txt = (c, s, x, y, size, fill, stroke, lw = 8) => { c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = fill; c.fillText(s, x, y); };
export { txt };

export function bball(parent, r = .6) { const t = canvasTex(128, 64, (c, w, h) => { c.fillStyle = '#e8701a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a1408'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.moveTo(w / 4, 0); c.lineTo(w / 4, h); c.moveTo(3 * w / 4, 0); c.lineTo(3 * w / 4, h); c.stroke(); });
  const b = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(0xffffff, { map: t, roughness: .7 })); b.castShadow = true; if (parent) parent.add(b); return b; }
export function hoop(parent) { const g = G(parent); cyl(.3, .35, 12, mat(0x2a2e3a, { metalness: .6 }), 10, g, 0, 6, -1.6); box(5, 3.4, .25, mat(0xffffff, { roughness: .3 }), .05, g, 0, 12, -.8);
  box(1.8, 1.3, .27, mat(0xffffff), 0, g, 0, 11.4, -.78); const fr = mat(0xd8323a); for (const [w, h, x, y] of [[1.8, .1, 0, 12.05], [1.8, .1, 0, 10.75], [.1, 1.3, -.9, 11.4], [.1, 1.3, .9, 11.4]]) box(w, h, .3, fr, 0, g, x, y, -.76);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.9, .07, 8, 28), mat(0xff5a1a, { metalness: .4 })); ring.rotation.x = Math.PI / 2; ring.position.set(0, 10.6, .3); g.add(ring);
  const net = new THREE.Mesh(new THREE.CylinderGeometry(.88, .55, 1.3, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true })); net.position.set(0, 9.95, .3); g.add(net); return shade(g); }
// muñequera dorada (toro grueso) — s = escala
export function band(parent, s = 1) { const g = G(parent); const b = new THREE.Mesh(new THREE.TorusGeometry(.95 * s, .22 * s, 10, 40), GOLD()); b.scale.z = 3.2; g.add(b); for (const z of [-.42, .42]) { const st = new THREE.Mesh(new THREE.TorusGeometry(.95 * s, .235 * s, 8, 40), mat(0xffffff, { roughness: .6 })); st.scale.z = .35; st.position.z = z * s; g.add(st); } return shade(g); }
export function pedestal(parent) { const g = G(parent); cyl(1.6, 1.9, 4, mat(0xf4f0e8, { roughness: .3 }), 24, g, 0, 2, 0); cyl(2.1, 2.1, .4, mat(0xd8323a), 24, g, 0, 4.2, 0); cyl(2.1, 2.1, .4, mat(0xd8323a), 24, g, 0, .2, 0);
  const B = band(g, 1.2); B.position.set(0, 5.6, 0); B.rotation.x = .3; g.userData.band = B; return shade(g); }
export function kaestchen(parent) { const g = G(parent); const wd = mat(0x6a3a1a, { roughness: .5 }); box(2.4, .9, 1.6, wd, .08, g, 0, .45, 0); box(2.1, .1, 1.3, mat(0xb8202a, { roughness: 1 }), 0, g, 0, .86, 0);
  const lid = G(g, 0, .9, -.8); box(2.4, .25, 1.6, wd, .08, lid, 0, .1, .8); lid.rotation.x = -1.9; g.userData.lid = lid; sphere(.1, GOLD(), g, 0, .6, .82, 8, 6); return shade(g); }
export function brief(parent) { const g = G(parent); box(2.6, 1.7, .06, mat(0xf6efe0, { roughness: .9 }), .02, g, 0, 0, 0); const p = textPlane(2.5, 1.6, 250, 160, (c, w, h) => { c.fillStyle = '#f6efe0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8b898'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(w / 2, h * .55); c.lineTo(w, 0); c.stroke();
  txt(c, 'Absender:', w * .3, h * .72, 18, '#5a4a3a'); txt(c, 'HUSS-O-MAT 10.000', w * .5, h * .86, 26, '#d8323a'); c.fillStyle = '#d8323a'; c.fillRect(w - 50, 10, 38, 44); txt(c, '⚡', w - 31, 33, 26, '#ffd23f'); }); p.position.z = .04; g.add(p); return shade(g); }
export function podium(parent) { const g = G(parent); const cols = [0xffc828, 0xc8ccd8, 0xd8884a]; [[0, 4, 0, '1'], [-4.4, 2.6, 1, '2'], [4.4, 1.8, 2, '3']].forEach(([x, h, i, n]) => { box(4.2, h, 3.4, mat(cols[i], { metalness: i === 0 ? .6 : .3, roughness: .3 }), .1, g, x, h / 2, 0);
  const p = textPlane(1.8, 1.8, 90, 90, (c, w) => txt(c, n, w / 2, w / 2 + 4, 76, '#1a1a2a')); p.position.set(x, h * .55, 1.72); g.add(p); }); return shade(g); }
// mesa de punto del Strickfinale con ovillos (cada lado), un jersey encima
export function strickTisch(parent) { const g = G(parent); box(10, .4, 4, mat(0xf4f4f4, { roughness: .4 }), .08, g, 0, 3.4, 0); box(10.2, 3.2, .2, mat(0x6a5aa8, { roughness: .9 }), .05, g, 0, 1.8, 1.9);
  for (const [x, z] of [[-4.6, -1.6], [4.6, -1.6], [-4.6, 1.6], [4.6, 1.6]]) cyl(.15, .15, 3.4, mat(0x3a3a48), 6, g, x, 1.7, z);
  [0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a].forEach((c, i) => sphere(.45, mat(c, { roughness: 1 }), g, 2.0 + i * .85, 4.0, -1.2, 12, 8)); return shade(g); }
export function pulli(parent, col = 0xd8323a) { const g = G(parent); const m = mat(col, { roughness: 1 }); box(2.4, 2.2, .35, m, .12, g, 0, 0, 0); for (const s of [-1, 1]) { const a = box(1.6, .7, .35, m, .12, g, s * 1.7, .6, 0); a.rotation.z = s * -.5; }
  box(2.42, .3, .37, mat(new THREE.Color(col).multiplyScalar(.75)), .05, g, 0, -1.05, 0); box(.9, .25, .37, mat(new THREE.Color(col).multiplyScalar(.75)), .05, g, 0, 1.08, 0); return shade(g); }
export function floete(parent) { const g = G(parent); cyl(.12, .16, 2.4, mat(0xe8d2a0, { roughness: .4 }), 10, g, 0, 0, 0); for (let i = 0; i < 4; i++) sphere(.05, mat(0x3a2a1a), g, 0, -.2 + i * .3, .14, 6, 4); return shade(g); }
// pancarta sobre la calle (entre dos postes)
export function strassenBanner(parent, text, w = 14) { const g = G(parent); for (const s of [-1, 1]) cyl(.25, .3, 13, mat(0xf4f4f4, { metalness: .4 }), 8, g, s * w / 2, 6.5, 0);
  const p = textPlane(w - .6, 2.6, Math.round(w * 50), 130, (c, W, H) => { c.fillStyle = '#d8323a'; c.fillRect(0, 0, W, H); c.fillStyle = '#ffd23f'; c.fillRect(0, 10, W, H - 20); txt(c, text, W / 2, H / 2 + 4, 66, '#d8323a', '#ffffff', 10); }, .35); p.position.y = 11; g.add(p);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.4, .38, 12, 30), GOLD()); ring.position.y = 14.2; g.add(ring); g.userData.ring = ring; return shade(g); }
// cancha de madera con círculo rojo (para el centro del estadio)
export function court(parent, w = 34, d = 50) { const g = G(parent); const t = canvasTex(256, 256, (c, W, H) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#e2b57a' : '#d8a86a'; c.fillRect(i * 16, 0, 16, H); } const r = RNG(3); for (let i = 0; i < 600; i++) { c.fillStyle = 'rgba(120,70,20,.12)'; c.fillRect(r() * W, r() * H, 1, 6); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 4); const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(0xffffff, { map: t, roughness: .45 })); f.rotation.x = -Math.PI / 2; f.position.y = .08; f.receiveShadow = true; g.add(f);
  const red = new THREE.Mesh(new THREE.CircleGeometry(7, 40), mat(0xd8323a, { roughness: .5 })); red.rotation.x = -Math.PI / 2; red.position.y = .1; red.receiveShadow = true; g.add(red);
  const wl = mat(0xffffff); const ring = new THREE.Mesh(new THREE.RingGeometry(7, 7.35, 40), wl); ring.rotation.x = -Math.PI / 2; ring.position.y = .11; g.add(ring); const ln = box(w, .03, .3, wl, 0, g, 0, .1, 0);
  for (const s of [-1, 1]) { const k = new THREE.Mesh(new THREE.RingGeometry(5.5, 5.8, 30, 1, 0, Math.PI), wl); k.rotation.x = -Math.PI / 2; k.rotation.z = s > 0 ? Math.PI : 0; k.position.set(0, .11, s * d / 2); g.add(k); } return g; }
// bandera de mano (países inventados: colores)
const FLAGC = [['#d8323a', '#ffffff', '#d8323a'], ['#2a6ad8', '#ffd23f', '#2a6ad8'], ['#1ab84a', '#ffffff', '#ff8a3a'], ['#1a1a2a', '#d8323a', '#ffd23f'], ['#ffffff', '#2a6ad8', '#ffffff'], ['#8a3ad8', '#ffd23f', '#1ab8b0']];
export function fahne(parent, i = 0) { const g = G(parent); cyl(.06, .06, 3, mat(0x8a6a4a), 6, g, 0, 1.5, 0); const c = FLAGC[i % FLAGC.length]; const p = textPlane(2, 1.3, 60, 39, (x, w, h) => { c.forEach((col, k) => { x.fillStyle = col; x.fillRect(0, k * h / 3, w, h / 3 + 1); }); }); p.material.side = THREE.DoubleSide; p.position.set(1.02, 2.4, 0); g.add(p); g.userData.cloth = p; return g; }
// marcador grande del estadio (canvas libre): draw(c, w, h)
export function anzeige(parent, w = 16, h = 8) { const g = G(parent); box(w + .8, h + .8, 1, mat(0x1a1a22, { roughness: .4 }), .2, g, 0, 0, -.6); const cv = document.createElement('canvas'); cv.width = w * 48; cv.height = h * 48; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); g.add(scr); let last = '';
  g.userData.draw = (key, fn) => { if (key === last) return; last = key; const c = cv.getContext('2d'); c.fillStyle = '#05060c'; c.fillRect(0, 0, cv.width, cv.height); fn(c, cv.width, cv.height); c.fillStyle = 'rgba(255,255,255,.05)'; for (let y = 0; y < cv.height; y += 6) c.fillRect(0, y, cv.width, 2); t.needsUpdate = true; };
  return g; }
// salchicha en panecillo
export function wurst(parent) { const g = G(parent); const bun = cyl(.4, .4, 2.2, mat(0xe8b060, { roughness: .8 }), 10, g, 0, 0, 0); bun.rotation.z = Math.PI / 2; bun.scale.set(1, 1, .7); const w = cyl(.26, .26, 2.6, mat(0xb8502a, { roughness: .4 }), 10, g, 0, .25, 0); w.rotation.z = Math.PI / 2;
  const m = box(2, .06, .12, mat(0xffd23f), .03, g, 0, .52, 0); return shade(g); }

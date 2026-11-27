// STATUE — atrezo y escenarios propios: el pedestal «1 JAHR SINGLE» del Marktplatz (con columnita para el Schal), palomas,
// Brezel (el perro salchicha), libro, bufanda, móvil con chats sin respuesta, calendario, caja de mudanza y furgoneta,
// la Rolltreppe del centro comercial y la lluvia.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, txt } from './props.js';
import { FONT } from './sets.js';

const rep = (t, a, b) => { t.repeat.set(a, b); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const STONE_T = () => noiseTex('#a4a4aa', ['#94949a', '#b2b2b8', '#88888e', '#bcbcc2', '#7c7c82'], 5200, 3, 1);
const marble = () => mat(0xffffff, { map: rep(noiseTex('#e8e4dc', ['#dcd8d0', '#f2eee6', '#d0ccc4'], 3000, 3, 1), 2, 1), roughness: .55 });

// pedestal en (x, z) mirando a +z; estatuas encima en x = ±SP, y = TOP. Placa de bronce delante.
export function sockel(parent, x, z) { const g = G(parent, x, 0, z); const m = marble(), dk = mat(0xffffff, { map: rep(noiseTex('#b8b4ac', ['#a8a49c', '#c4c0b8'], 2000, 3, 1), 2, 1), roughness: .6 });
  box(17, .8, 9, dk, .1, g, 0, .4, 0); box(15.6, 2.6, 7.6, m, .15, g, 0, 2.1, 0); box(16.4, .5, 8.4, dk, .1, g, 0, 3.55, 0);
  for (const s of [-1, 1]) box(1.2, 2.6, 1.2, dk, .1, g, s * 7.2, 2.1, 3.3);
  const pl = textPlane(8.6, 1.9, 860, 190, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#d8a84a'); gr.addColorStop(1, '#8a5a1a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.strokeStyle = '#5a3a0a'; c.lineWidth = 12; c.strokeRect(8, 8, w - 16, h - 16); txt(c, '1 JAHR SINGLE', w / 2, h / 2 + 6, 104, '#3a2206'); });
  pl.position.set(0, 2.15, 3.83); g.add(pl);
  for (const s of [-1, 1]) { const n = textPlane(2.6, .55, 260, 55, (c, w, h) => { c.fillStyle = '#c8984a'; c.fillRect(0, 0, w, h); txt(c, s < 0 ? 'JONAS' : 'FINN', w / 2, h / 2 + 3, 40, '#3a2206'); }); n.position.set(s * 3.6, 1.05, 4.52); n.rotation.x = -.25; g.add(n); }
  // columnita entre las dos estatuas (el Schal se enrolla aquí)
  const col = G(g, 0, 3.8, 0); cyl(.55, .6, 4.6, m, 14, col, 0, 2.3, 0); cyl(.8, .8, .4, dk, 14, col, 0, .2, 0); sphere(.95, m, col, 0, 5.1, 0, 14, 10);
  const SCARF = scarfWrap(col); SCARF.visible = false;
  shade(g); return { g, TOP: 3.8, SP: 3.6, SCARF, col }; }

// bufanda de rayas mostaza y azul marino: enrollada (alrededor de la columnita) o doblada en la mano
const scarfTex = () => { const t = canvasTex(64, 256, (c, w, h) => { for (let y = 0; y < h; y += 32) { c.fillStyle = (y / 32) % 2 ? '#1e2a5a' : '#f2b81e'; c.fillRect(0, y, w, 32); } c.fillStyle = 'rgba(255,255,255,.18)'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 2); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
function scarfWrap(col) { const g = G(col); const sm = mat(0xffffff, { map: scarfTex(), roughness: 1 }); sm.map.repeat.set(1, 3);
  const P = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 4.2; P.push(new THREE.Vector3(Math.cos(a) * .8, 2.0 + i * .035, Math.sin(a) * .8)); }
  const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), 80, .28, 8), sm); g.add(t);
  for (const s of [-1, 1]) { const e = box(.85, 2.6, .22, sm, .08, g, s * .42, 1.3, .85); e.rotation.z = s * .12; for (let k = 0; k < 5; k++) box(.1, .4, .1, mat(0xf2b81e), 0, g, s * .42 - .3 + k * .15, -.1, .85); }
  return g; }
export function scarfHand(parent) { const g = G(parent); const sm = mat(0xffffff, { map: scarfTex(), roughness: 1 }); for (let k = 0; k < 4; k++) box(1.6, .32, 1.1, sm, .12, g, 0, k * .3, 0); for (const s of [-1, 1]) { const e = box(.8, 1.8, .2, sm, .06, g, s * .4, -.8, .55); e.rotation.z = s * .1; } return shade(g); }

// paloma de bloques: g.userData.pose(T, flap 0..1)
export function pigeon(parent, i = 0) { const g = G(parent); const gm = mat([0x8a8e9a, 0x9aa0aa, 0x6e727e][i % 3], { roughness: .8 }), dk = mat(0x4a4e5a, { roughness: .8 });
  const b = box(.9, .7, 1.4, gm, .25, g, 0, .7, 0); const n = box(.5, .5, .5, mat(0x5a7a6a, { roughness: .5, metalness: .3 }), .15, g, 0, 1.15, .55); const h = G(g, 0, 1.45, .7); box(.5, .5, .55, gm, .18, h, 0, 0, 0); box(.16, .14, .3, mat(0xf2a23a), .04, h, 0, -.05, .38);
  for (const s of [-1, 1]) { sphere(.08, mat(0xff7a1a), h, s * .2, .08, .2, 6, 4); sphere(.04, mat(0x111111), h, s * .23, .08, .25, 6, 4); }
  const W = [-1, 1].map(s => { const w = G(g, s * .45, .85, 0); box(.15, .5, 1.2, dk, .06, w, s * .05, 0, 0); return w; }); box(.6, .14, .6, dk, .05, g, 0, .6, -.9);
  for (const s of [-1, 1]) cyl(.05, .05, .4, mat(0xf2a23a), 4, g, s * .2, .2, 0);
  g.userData.pose = (T, f = 0) => { W.forEach((w, k) => { w.rotation.z = (k ? -1 : 1) * (f * (.3 + Math.abs(Math.sin(T * 30)) * 1.2)); }); h.rotation.x = Math.sin(T * 6 + i) * .2 * (1 - f); };
  return shade(g); }

// Brezel: perro salchicha marrón con orejas largas; userData.slipper = zapatilla rosa en la boca; userData.pose(T, wag)
export function dackel(parent) { const g = G(parent); const fm = mat(0x9a5a2a, { roughness: .8 }), dk = mat(0x5a2e12, { roughness: .8 });
  box(1.4, 1.2, 4.2, fm, .4, g, 0, 1.4, 0); const h = G(g, 0, 2.1, 2.3); box(1.2, 1.1, 1.3, fm, .35, h, 0, 0, 0); box(.8, .6, .9, fm, .2, h, 0, -.2, .9); box(.3, .25, .2, mat(0x1a1a1a), .1, h, 0, .02, 1.36);
  for (const s of [-1, 1]) { const e = box(.25, 1.0, .6, dk, .12, h, s * .68, -.25, -.1); e.rotation.z = s * .15; sphere(.14, mat(0x1a1a1a), h, s * .32, .2, .66, 8, 6); sphere(.05, mat(0xffffff), h, s * .28, .26, .78, 6, 4); }
  const L = []; for (const [x, z] of [[-.45, 1.4], [.45, 1.4], [-.45, -1.4], [.45, -1.4]]) { const l = G(g, x, .9, z); box(.4, .9, .4, fm, .12, l, 0, -.45, 0); L.push(l); }
  const tail = G(g, 0, 1.7, -2.1); box(.22, .22, 1.2, fm, .1, tail, 0, 0, -.5); tail.rotation.x = -.6;
  const col = box(1.3, .25, 1.0, mat(0xd8323a), .08, g, 0, 1.85, 1.75);
  const sl = G(h, 0, -.35, 1.25); box(1.6, .45, .7, mat(0xf4a8c8, { roughness: 1 }), .2, sl, .3, 0, 0); sphere(.32, mat(0xffffff, { roughness: 1 }), sl, .9, .25, 0, 8, 6); g.userData.slipper = sl;
  g.userData.pose = (T, wag = 1, run = 0) => { tail.rotation.y = Math.sin(T * 18) * .6 * wag; h.rotation.y = Math.sin(T * 9) * .25 * wag; L.forEach((l, k) => l.rotation.x = Math.sin(T * 14 + k * Math.PI * .5) * .7 * run); g.children[0].position.y = 1.4 + Math.abs(Math.sin(T * 14)) * .1 * run; };
  return shade(g); }

export function buch(parent) { const g = G(parent); const cv = mat(0x2a6ad8, { roughness: .6 }); for (const s of [-1, 1]) { const c = box(1.5, .08, 2.1, cv, .02, g, s * .78, 0, 0); c.rotation.z = -s * .18; const p = textPlane(1.35, 1.95, 135, 195, (c2, w, h) => { c2.fillStyle = '#fbf6e8'; c2.fillRect(0, 0, w, h); c2.fillStyle = '#9a9488'; for (let k = 0; k < 14; k++) c2.fillRect(12, 16 + k * 12, w - 24 - (k % 4) * 10, 4); }); p.rotation.set(-Math.PI / 2, -s * .18, 0); p.position.set(s * .74, .12 + .12, 0); g.add(p); } return g; }

// móvil con chats: userData.draw(fn) redibuja la pantalla
export function handy(parent) { const g = G(parent); box(1.1, 2.1, .14, mat(0x1a1a22, { roughness: .3, metalness: .4 }), .12, g, 0, 0, 0); const cv = document.createElement('canvas'); cv.width = 220; cv.height = 420; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Mesh(new THREE.PlaneGeometry(.98, 1.94), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); s.position.z = .075; g.add(s); g.userData.draw = f => { f(cv.getContext('2d'), cv.width, cv.height); t.needsUpdate = true; }; return g; }
export function drawChats(c, w, h, n = 4, time = '23:58') { c.fillStyle = '#f4f6fa'; c.fillRect(0, 0, w, h); c.fillStyle = '#2ab86a'; c.fillRect(0, 0, w, 64); txt(c, 'Chats  ' + time, w / 2, 36, 26, '#ffffff');
  ['Lena', 'Sophie', 'Hannah', 'Emma', 'Clara'].slice(0, 5).forEach((nm, i) => { const y = 92 + i * 66; c.fillStyle = ['#ff8ad0', '#3ab8ff', '#ffd23f', '#8ad84a', '#b88aff'][i]; c.beginPath(); c.arc(32, y, 22, 0, 7); c.fill(); c.textAlign = 'left'; c.fillStyle = '#1a1a22'; c.font = `700 24px ${FONT}`; c.fillText(nm, 64, y - 6); c.fillStyle = '#6a6e78'; c.font = `700 18px ${FONT}`; c.fillText(i < n ? 'Hey, hast du Zeit? ✓✓' : '', 64, y + 18); c.textAlign = 'center'; }); }

// calendario de pared: userData.draw(fn)
export function kalender(parent, w = 4, h = 5) { const cv = document.createElement('canvas'); cv.width = 400; cv.height = 500; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: .9 })); parent.add(p);
  p.userData.draw = f => { f(cv.getContext('2d'), cv.width, cv.height); t.needsUpdate = true; }; return p; }

// caja de mudanza con rótulo
export function karton(parent, label = 'FREITAG') { const g = G(parent); box(3, 2.4, 2.4, mat(0xffffff, { map: noiseTex('#c8955a', ['#b8854a', '#d4a46a'], 600, 2, 1), roughness: .95 }), .08, g, 0, 1.2, 0); box(3.04, .3, .5, mat(0xd8c890, { roughness: .6 }), .02, g, 0, 2.42, 0);
  const l = textPlane(2.4, .9, 240, 90, (c, w, h) => { c.fillStyle = '#f4ecd8'; c.fillRect(0, 0, w, h); txt(c, label, w / 2, h / 2 + 4, 58, '#1a1a22'); }); l.position.set(0, 1.3, 1.22); g.add(l); return shade(g); }
// furgoneta de mudanza («UMZÜGE MEYER»)
export function umzugswagen(parent) { const g = G(parent); const wh = mat(0xf4f4f4, { roughness: .4 }), bl = mat(0x2a6ad8, { roughness: .4 }), dk = mat(0x1a1a1e);
  box(7, 7, 14, wh, .3, g, 0, 4.6, -2); box(6.6, 5, 5, bl, .4, g, 0, 3.4, 7.4); box(6, 2, .2, mat(0x9ad8ff, { roughness: .05, metalness: .2 }), .05, g, 0, 4.6, 9.95);
  for (const s of [-1, 1]) { const t = textPlane(11, 2.2, 880, 176, (c, w, h) => { c.fillStyle = '#f4f4f4'; c.fillRect(0, 0, w, h); txt(c, 'UMZÜGE MEYER', w / 2, h / 2 + 6, 110, '#2a6ad8'); }); t.position.set(s * 3.52, 5.2, -2); t.rotation.y = s * Math.PI / 2; g.add(t); }
  for (const [x, z] of [[-3.3, 6.8], [3.3, 6.8], [-3.3, -5.4], [3.3, -5.4]]) { const w = cyl(1.3, 1.3, .9, dk, 16, g, x, 1.3, z); w.rotation.z = Math.PI / 2; }
  return shade(g); }

// Rolltreppe (centro comercial): suelo brillante, escalera mecánica que sube hacia -z, tiendas al fondo
export function mall(scene, X) { const g = G(scene, X); const fl = mat(0xffffff, { map: rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#f2ece2'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8d0c4'; c.lineWidth = 3; c.strokeRect(0, 0, w, h); }), 14, 14), roughness: .25, metalness: .05 });
  box(140, .4, 140, fl, 0, g, 0, -.2, 0); box(140, 30, .4, mat(0xf4f0ea), 0, g, 0, 15, -40); box(140, .4, 140, mat(0xfaf8f4), 0, g, 0, 30, 0);
  const ST = G(g, 0, 0, -6); const sm = mat(0x9aa0aa, { metalness: .7, roughness: .3 }); const ang = Math.atan2(14, 26); const STEPS = [];
  for (let k = 0; k < 18; k++) { const s = box(6, .5, 1.6, sm, .05, ST, 0, 0, 0); STEPS.push(s); }
  for (const sx of [-1, 1]) { const r = box(.6, 2.4, 31, mat(0x2a2a30, { roughness: .4 }), .2, ST, sx * 3.6, 8.2, -13); r.rotation.x = ang; const gl = box(.15, 3, 30, mat(0xbfe8ff, { roughness: .05, transparent: true, opacity: .3 }), .02, ST, sx * 3.4, 10, -13); gl.rotation.x = ang; const hr = box(.5, .5, 31, mat(0x1a1a1a, { roughness: .3 }), .2, ST, sx * 3.5, 10.4, -13); hr.rotation.x = ang; }
  const bdy = box(7.8, 3, 30, mat(0xc8ccd4, { metalness: .5, roughness: .35 }), .2, ST, 0, 5.6, -13.2); bdy.rotation.x = ang;
  box(20, .8, 12, mat(0xe8e4dc), .1, g, 0, 14, -34); // planta de arriba
  [['MODE', '#e8325a', -30], ['SCHUHE', '#2a8ad8', 30], ['CAFÉ', '#2ab86a', -50], ['BÜCHER', '#f2a21e', 50]].forEach(([n, c_, x]) => { box(16, 10, .6, mat(0xffffff, { roughness: .3 }), .1, g, x, 5, -39.4); const s = textPlane(14, 2.4, 560, 96, (c, w, h) => { c.fillStyle = c_; c.fillRect(0, 0, w, h); txt(c, n, w / 2, h / 2 + 4, 70, '#ffffff'); }); s.position.set(x, 11.6, -39.1); g.add(s); box(13, 7, .2, mat(0xbfe8ff, { roughness: .05, transparent: true, opacity: .45 }), .02, g, x, 4.2, -39); });
  for (const x of [-60, -20, 20, 60]) for (const z of [-20, 10, 40]) { const l = box(4, .3, 4, mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1.2 }), .05, g, x, 29.7, z); l.castShadow = false; }
  for (const [x, z] of [[-14, 6], [14, 6]]) { cyl(1.6, 1.3, 2.4, mat(0xf4f0ea), 12, g, x, 1.2, z); sphere(2.2, mat(0x3aa84a, { roughness: .8 }), g, x, 4, z, 10, 8); }
  g.userData.run = T => STEPS.forEach((s, k) => { const u = ((k / STEPS.length + T * .08) % 1); s.position.set(0, .3 + u * 14.4, 2 - u * 26.6); });
  g.userData.run(0); shade(g); return { g, ST }; }

// lluvia: segmentos alrededor de un centro (update(T, c))
export function regen(scene, n = 900) { const pos = new Float32Array(n * 6); const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const L = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: .55 })); L.frustumCulled = false; scene.add(L); const r = RNG(7), base = Array.from({ length: n }, () => [r() - .5, r(), r() - .5, .6 + r() * .6]);
  L.userData.update = (T, c, sx = 60, sy = 40) => { for (let i = 0; i < n; i++) { const b = base[i], y = c.y + sy - ((b[1] * sy + T * 34 * b[3]) % sy); const x = c.x + b[0] * sx, z = c.z + b[2] * sx; pos.set([x, y, z, x - .15, y - 1.6, z], i * 6); } geo.attributes.position.needsUpdate = true; }; L.visible = false; return L; }

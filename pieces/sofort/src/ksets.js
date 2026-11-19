// SOFORT — escenarios y atrezo propios: Innenstadt con rascacielos (el gigante la cruza), sala de la Liga en lo alto de la torre,
// tribunal con cámaras de TV, tanque, montoncito de polvo, capas que ondean, láser de los ojos, avispas, pancartas y estatua.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { txt, noiseTex, skyscraper, lamp, tree, screen } from './props.js';
import { townhouse } from './gort.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const plane = (w, d, m, p, x = 0, y = 0, z = 0) => { const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); f.rotation.x = -Math.PI / 2; f.position.set(x, y, z); f.receiveShadow = true; p.add(f); return f; };
const B = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), toneMapped: false });
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const asphalt = () => noiseTex('#4a4e5a', ['#40444e', '#565a66'], 2000, 2, 1);

// ---------- coche sencillo (para el centro y el puente) ----------
export function auto(parent, col = 0xd8323a) { const g = G(parent); const b = mat(col, { roughness: .3, metalness: .3 });
  box(4.4, 1.4, 8.4, b, .4, g, 0, 1.4, 0); box(3.8, 1.3, 4.4, b, .4, g, 0, 2.6, -.4); for (const z of [1.8, -2.6]) box(3.6, 1.0, .1, mat(0x9ad0f4, { roughness: .05, metalness: .5 }), .02, g, 0, 2.6, z + (z > 0 ? -.05 : .05));
  for (const s of [-1, 1]) box(.1, .9, 3.6, mat(0x9ad0f4, { roughness: .05, metalness: .5 }), .02, g, s * 1.92, 2.6, -.4);
  for (const [x, z] of [[-2, 2.8], [2, 2.8], [-2, -2.8], [2, -2.8]]) { const w = cyl(.85, .85, .7, mat(0x1a1a1e), 16, g, x, .85, z); w.rotation.z = Math.PI / 2; cyl(.4, .4, .72, mat(0xd8dce4, { metalness: .8 }), 12, g, x, .85, z).rotation.z = Math.PI / 2; }
  for (const s of [-1, 1]) { sphere(.32, B(3, 2.8, 2.2), g, s * 1.4, 1.5, 4.2, 8, 6); sphere(.28, B(2.5, .2, .2), g, s * 1.5, 1.6, -4.2, 8, 6); }
  return shade(g); }

// ---------- Innenstadt (X): avenida de 20 de ancho a lo largo de z, rascacielos a ambos lados, farolas, árboles, coches aparcados ----------
export function innenstadt(scene, X) { const g = G(scene, X);
  plane(900, 900, mat(0xffffff, { roughness: 1, map: rep(noiseTex('#8a8e96', ['#7a7e86', '#9a9ea6'], 2400, 3, 1), 60, 60) }), g, 0, -.04, 0);
  plane(22, 900, mat(0xffffff, { roughness: .9, map: rep(asphalt(), 2, 70) }), g, 0, .02, 0);
  for (let z = -440; z < 440; z += 10) box(.4, .04, 5, mat(0xffd23f), 0, g, 0, .07, z);
  for (const s of [-1, 1]) { box(1, .5, 900, mat(0xd8d4cc), .05, g, s * 11.5, .25, 0); plane(10, 900, mat(0xffffff, { map: rep(noiseTex('#c8c4bc', ['#b8b4ac', '#d8d4cc'], 1200, 3, 1), 4, 300), roughness: .9 }), g, s * 17, .06, 0); }
  const cols = [['#7fd4ff', '#4fb8f5'], ['#ffd8a8', '#e8a868'], ['#c8b8ff', '#9a88e8'], ['#a8f0d8', '#58c8a8'], ['#ffb8c8', '#e8789a'], ['#e8e8f0', '#a8acb8']];
  const towers = []; for (let i = 0; i < 18; i++) for (const s of [-1, 1]) { const z = -320 + i * 38 + (s > 0 ? 14 : 0), h = 60 + ((i * 37 + (s > 0 ? 19 : 0)) % 90), w = 26 + (i % 3) * 4, [a, b] = cols[(i * 2 + (s > 0 ? 1 : 0)) % 6];
    towers.push(skyscraper(g, s * (24 + w / 2), z, w, h, 30, a, b)); }
  for (let i = 0; i < 12; i++) skyscraper(g, -150 + i * 28, -400, 26, 140 + (i * 41) % 90, 26, '#9ab8d8', '#6a8ab8');
  const LAMPS = []; for (let z = -300; z < 300; z += 20) for (const s of [-1, 1]) LAMPS.push(lamp(g, s * 12.6, z + (s > 0 ? 10 : 0), -s));
  for (let z = -290; z < 300; z += 40) for (const s of [-1, 1]) tree(g, s * 19, z + 20, .8);
  const CARS = []; const cc = [0xd8323a, 0x2a6ad8, 0xffd23f, 0xf4f4f4, 0x2ab86a, 0x1a1a22, 0xff8a3a]; for (let i = 0; i < 14; i++) { const c = auto(g, cc[i % 7]); const s = i % 2 ? 1 : -1; c.position.set(s * 7.6, 0, -120 + i * 18); c.rotation.y = s > 0 ? 0 : Math.PI; CARS.push(c); }
  // ampelas, paradas y carteles luminosos a pie de calle
  for (let i = 0; i < 10; i++) { const s = i % 2 ? 1 : -1; const p = textPlane(8, 3, 320, 120, (c, w, h) => { c.fillStyle = ['#d8323a', '#2a6ad8', '#1a1a2a', '#2ab86a', '#ff8a3a'][i % 5]; c.fillRect(0, 0, w, h); txt(c, ['KAFFEE', 'KINO', 'BÄCKER', 'APOTHEKE', 'MODE', 'PIZZA', 'BUCHLADEN', 'BANK', 'EIS', 'FRISEUR'][i], w / 2, h / 2 + 4, 56, '#ffffff'); }, .9);
    p.position.set(s * 21.9, 7, -110 + i * 30); p.rotation.y = -s * Math.PI / 2; g.add(p); }
  return { g: shade(g), CARS, LAMPS, towers }; }

// ---------- sala de la Liga (X): mesa redonda, cinco sillas, escudo LIGA DER SUPERS, ventanal a la ciudad de noche, foto de grupo ----------
export function turm(scene, X) { const g = G(scene, X); const W = 56, D = 40, H = 22;
  const fl = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#2a2e3e'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a4058'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); }, true), 14, 10), roughness: .35, metalness: .3 });
  box(W, .4, D, fl, 0, g, 0, -.2, 0); const wl = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#1e2440'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.fillRect(0, h * .78, w, 3); c.fillStyle = '#2a3258'; c.fillRect(w * .48, 0, 3, h * .78); }, true), 10, 1), roughness: .6 });
  for (const s of [-1, 1]) box(.6, H, D, wl, 0, g, s * W / 2, H / 2, 0); box(W, .6, D, mat(0x14182a), 0, g, 0, H, 0); const fw = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wl); fw.rotation.y = Math.PI; fw.position.set(0, H / 2, D / 2); g.add(fw);
  // ventanal (pared del fondo): ciudad de noche con ventanas encendidas
  const win = textPlane(W, H, 1400, 560, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#060a24'); s.addColorStop(1, '#2a2a6a'); c.fillStyle = s; c.fillRect(0, 0, w, h); const r = RNG(5); c.fillStyle = '#fff'; for (let i = 0; i < 80; i++) c.fillRect(r() * w, r() * h * .4, 2, 2);
    for (let i = 0; i < 26; i++) { const bw = 40 + r() * 50, bh = 160 + r() * 340, x = i * 56 - 20; c.fillStyle = ['#141a3a', '#1a2048', '#10163a'][i % 3]; c.fillRect(x, h - bh, bw, bh); for (let y = h - bh + 12; y < h - 8; y += 18) for (let xx = x + 6; xx < x + bw - 8; xx += 12) if (r() > .45) { c.fillStyle = r() > .5 ? '#ffe08a' : '#8ad0ff'; c.fillRect(xx, y, 6, 8); } } }, 1.0);
  win.position.set(0, H / 2, -D / 2 + .1); g.add(win); for (let k = -3; k <= 3; k++) box(.5, H, .5, mat(0x0a0c18, { metalness: .6 }), .02, g, k * 8, H / 2, -D / 2 + .4); box(W, .6, .6, mat(0x0a0c18), 0, g, 0, 6, -D / 2 + .4);
  // mesa redonda con el logo y cinco sillas altas
  const T_ = G(g, 0, 0, -2); cyl(9, 9, .6, mat(0x3a4a8a, { roughness: .3, metalness: .4 }), 48, T_, 0, 3.6, 0); cyl(9.1, 9.1, .2, mat(0xffd23f, { metalness: .8, roughness: .25 }), 48, T_, 0, 3.95, 0); cyl(1.4, 2.2, 3.4, mat(0x1a1e2e), 16, T_, 0, 1.7, 0);
  const logo = textPlane(7, 7, 256, 256, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 50 : 118; c.lineTo(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r); } c.closePath(); c.fill(); txt(c, 'S', w / 2, h / 2 + 8, 90, '#1e2a6a'); }, .6); logo.rotation.x = -Math.PI / 2; logo.position.set(0, 4.08, 0); T_.add(logo);
  const CHAIRS = []; for (let i = 0; i < 5; i++) { const a = Math.PI + (i - 2) * .5, c = G(T_, Math.sin(a) * 11.5, 0, Math.cos(a) * 11.5); c.rotation.y = a + Math.PI; const col = [0xff8a1a, 0x2a8ad8, 0xd8323a, 0x2ab86a, 0x6a2ad8][i];
    box(3, .5, 3, mat(col, { roughness: .4 }), .2, c, 0, 2.6, 0); box(3, 5, .5, mat(col, { roughness: .4 }), .2, c, 0, 5, -1.3); cyl(.25, .25, 2.4, mat(0x2a2e3a, { metalness: .7 }), 8, c, 0, 1.2, 0); CHAIRS.push(c); }
  // escudo y letrero
  const sg = textPlane(24, 4, 960, 160, (c, w, h) => { c.fillStyle = '#0e1430'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); txt(c, '★ LIGA DER SUPERS ★', w / 2, h / 2 + 6, 104, '#ffd23f'); }, .8); sg.position.set(-W / 2 + .4, 15, 0); sg.rotation.y = Math.PI / 2; g.add(sg);
  // foto de grupo en la pared derecha (se dibuja desde main con los colores del equipo)
  const FOTO = screen(12, 8, 480, 320, .55); FOTO.position.set(W / 2 - .4, 11, -4); FOTO.rotation.y = -Math.PI / 2; g.add(FOTO); box(.4, 8.8, 12.8, mat(0xd9a531, { metalness: .8 }), .1, g, W / 2 - .2, 11, -4);
  for (const x of [-18, 18]) { const L = new THREE.PointLight(0x8ab0ff, 120, 60, 1.6); L.position.set(x, 18, 4); g.add(L); }
  const L2 = new THREE.PointLight(0xffe8c0, 160, 50, 1.5); L2.position.set(0, 16, 0); g.add(L2);
  return { g: shade(g), T: T_, CHAIRS, FOTO, win, sg }; }

// ---------- tribunal (X): estrado del juez al fondo con sillón giratorio, banco de acusado, tribuna, cámaras de TV ----------
export function tribunal(scene, X) { const g = G(scene, X); const W = 60, D = 50, H = 26;
  const wood = (a, b) => mat(0xffffff, { map: rep(canvasTex(64, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let y = 0; y < h; y += 32) c.fillRect(0, y, w, 2); for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 2, h); }, true), 10, 2), roughness: .6 });
  box(W, .4, D, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#8a1a22'; c.fillRect(0, 0, w, h); c.strokeStyle = '#a8323a'; c.lineWidth = 3; c.strokeRect(4, 4, w - 8, h - 8); }, true), 12, 10), roughness: .9 }), 0, g, 0, -.2, 0);
  const wl = wood('#7a4a2a', '#5a3218'); box(W, H, .6, wl, 0, g, 0, H / 2, -D / 2); for (const s of [-1, 1]) box(.6, H, D, wl, 0, g, s * W / 2, H / 2, 0); box(W, .6, D, mat(0xf4ecdc), 0, g, 0, H, 0); const fw = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wl); fw.rotation.y = Math.PI; fw.position.set(0, H / 2, D / 2); g.add(fw);
  for (let k = -2; k <= 2; k++) box(1.6, H, 1.6, mat(0xf0e4c8, { roughness: .5 }), .1, g, k * 12, H / 2, -D / 2 + 1);
  // estrado: plataforma, mesa alta con frontal tallado, sillón de respaldo alto que gira (CHAIR)
  const EST = G(g, 0, 0, -16); box(30, 3, 10, wood('#6a3a1a', '#4a2410'), .1, EST, 0, 1.5, 0); box(24, 5, 2, wood('#8a5a2a', '#6a3a1a'), .1, EST, 0, 5.5, 3); box(24.6, .5, 3, mat(0x4a2410), .05, EST, 0, 8.2, 3);
  const CHAIR = G(EST, 0, 3, -1.5); box(4.4, .8, 4, mat(0x1a1a1e, { roughness: .4 }), .3, CHAIR, 0, 2.4, 0); box(4.4, 8, .9, mat(0x1a1a1e, { roughness: .4 }), .4, CHAIR, 0, 6.4, -1.9); cyl(.3, .3, 2, mat(0x6a6e78, { metalness: .8 }), 8, CHAIR, 0, 1, 0); for (const s of [-1, 1]) box(.6, 1.6, 3, mat(0x1a1a1e), .2, CHAIR, s * 2.2, 3.4, 0);
  const crest = textPlane(10, 10, 300, 300, (c, w, h) => { c.fillStyle = '#d9a531'; c.beginPath(); c.arc(w / 2, h / 2, 140, 0, 7); c.fill(); c.fillStyle = '#5a3218'; c.beginPath(); c.arc(w / 2, h / 2, 118, 0, 7); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 10; c.beginPath(); c.moveTo(w / 2, 60); c.lineTo(w / 2, 230); c.moveTo(70, 110); c.lineTo(230, 110); c.stroke();
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(w / 2 + s * 80, 110); c.lineTo(w / 2 + s * 50, 180); c.lineTo(w / 2 + s * 110, 180); c.closePath(); c.stroke(); } }, .5); crest.position.set(0, 17, -D / 2 + .5); g.add(crest);
  const sg = textPlane(22, 3, 880, 120, (c, w, h) => { c.fillStyle = '#3a2010'; c.fillRect(0, 0, w, h); txt(c, 'GERICHTSSAAL', w / 2, h / 2 + 4, 84, '#ffd23f'); }, .4); sg.position.set(0, 23.5, -D / 2 + .4); g.add(sg);
  const gav = G(EST, 3, 8.5, 3); cyl(.25, .25, 1.6, mat(0x5a3218), 8, gav, 0, .2, 0).rotation.z = Math.PI / 2; cyl(.08, .08, 1.6, mat(0x5a3218), 6, gav, 0, .2, .8).rotation.x = Math.PI / 2;
  // banco del acusado (centro), mesas a los lados, barandilla, tribuna del público con bancos
  const DOCK = G(g, 0, 0, -2); box(8, 3.2, 1, wood('#8a5a2a', '#6a3a1a'), .1, DOCK, 0, 1.6, 2); box(8.4, .3, 1.4, mat(0x4a2410), .05, DOCK, 0, 3.3, 2); const mic = cyl(.06, .06, 1.6, mat(0x2a2a2a), 6, DOCK, 0, 4.0, 2); mic.rotation.x = -.4; sphere(.18, mat(0x1a1a1a), DOCK, 0, 4.7, 1.7, 8, 6);
  for (const s of [-1, 1]) { box(10, 3, 4, wood('#8a5a2a', '#6a3a1a'), .1, g, s * 16, 1.5, -4); }
  box(W - 4, 2.6, .5, wood('#6a3a1a', '#4a2410'), .05, g, 0, 1.3, 6); for (let r = 0; r < 4; r++) box(W - 10, 1.6, 2, wood('#7a4a2a', '#5a3218'), .1, g, 0, .8 + r * .9, 10 + r * 4);
  // cámaras de TV con piloto rojo y focos
  const CAMS = []; for (const [x, z, ry] of [[-22, 6, -.5], [22, 6, .5], [-10, 14, -.2]]) { const c = G(g, x, 0, z); c.rotation.y = Math.PI + ry; for (let k = 0; k < 3; k++) { const l = cyl(.08, .08, 5, mat(0x2a2a2e), 6, c, Math.sin(k * 2.1) * .8, 2.5, Math.cos(k * 2.1) * .8); l.rotation.z = Math.sin(k * 2.1) * .15; }
    box(2.2, 1.6, 3.2, mat(0x1a1a1e, { roughness: .4 }), .2, c, 0, 5.6, 0); const ln = cyl(.6, .7, 1.2, mat(0x0a0a0c), 14, c, 0, 5.6, 2); ln.rotation.x = Math.PI / 2; sphere(.16, B(4, .3, .3), c, .8, 6.6, 1.2, 8, 6); const t = textPlane(1.4, .5, 140, 50, (q, w, h) => { q.fillStyle = '#d8323a'; q.fillRect(0, 0, w, h); txt(q, 'LIVE', w / 2, h / 2 + 2, 34, '#fff'); }, 1); t.position.set(-1.12, 5.8, 0); t.rotation.y = -Math.PI / 2; c.add(t); CAMS.push(c); }
  const lamps = []; for (const x of [-18, 0, 18]) { const L = new THREE.PointLight(0xfff0d8, 150, 60, 1.5); L.position.set(x, 22, -4); g.add(L); lamps.push(L); sphere(1, B(2.5, 2.3, 1.9), g, x, 24.6, -4, 10, 6); }
  return { g: shade(g), CHAIR, DOCK, CAMS, EST }; }

// ---------- celda individual sencilla (X): paredes blancas acolchadas, barrotes delante, cama, ventanita ----------
export function zelleK(scene, X) { const g = G(scene, X); const W = 20, D = 16, H = 14;
  box(W, .4, D, mat(0xffffff, { map: rep(noiseTex('#9aa0a8', ['#8a9098', '#aab0b8'], 900, 3, 1), 4, 4), roughness: .9 }), 0, g, 0, -.2, 0);
  const wl = mat(0xffffff, { map: rep(canvasTex(64, 32, (c, w, h) => { c.fillStyle = '#c8ccd4'; c.fillRect(0, 0, w, h); c.fillStyle = '#a8acb4'; c.fillRect(0, h - 3, w, 3); c.fillRect(w / 2, 0, 3, h / 2); c.fillRect(0, h / 2, w, 3); }, true), 6, 6), roughness: .9 });
  box(W, H, .6, wl, 0, g, 0, H / 2, -D / 2); for (const s of [-1, 1]) box(.6, H, D, wl, 0, g, s * W / 2, H / 2, 0); box(W, .5, D, mat(0x8a8e96), 0, g, 0, H, 0);
  for (let k = 0; k < 16; k++) cyl(.18, .18, H, mat(0x5a5e68, { metalness: .8, roughness: .3 }), 8, g, -W / 2 + .8 + k * 1.24, H / 2, D / 2 - .4); for (const y of [1, H - 1]) box(W, .4, .4, mat(0x5a5e68, { metalness: .8 }), .02, g, 0, y, D / 2 - .4);
  box(8, 1.2, 3.6, mat(0x6a6e78), .1, g, -5, 1.6, -6); box(7.6, .6, 3.2, mat(0xf4f4f4), .2, g, -5, 2.4, -6); box(2, .6, 2.6, mat(0xf4f4f4), .2, g, -8, 2.9, -6);
  const w = textPlane(3.6, 2.4, 144, 96, (c, ww, h) => { c.fillStyle = '#8ad0ff'; c.fillRect(0, 0, ww, h); c.fillStyle = '#3a3e48'; for (let k = 1; k < 5; k++) c.fillRect(k * ww / 5 - 3, 0, 6, h); }, .8); w.position.set(4, 10, -D / 2 + .35); g.add(w);
  const L = new THREE.PointLight(0xe8f0ff, 90, 40, 1.6); L.position.set(0, 12, 2); g.add(L);
  return { g: shade(g) }; }

// ---------- tanque ----------
export function panzer(parent) { const g = G(parent); const o = mat(0x5a6a3a, { roughness: .7 }), d = mat(0x3a4428, { roughness: .8 }), k = mat(0x1e2018, { roughness: .9 });
  box(9, 2.4, 14, o, .4, g, 0, 2.4, 0); box(8, 1.2, 4, o, .3, g, 0, 3.4, 5.4).rotation.x = -.3;
  for (const s of [-1, 1]) { box(2.6, 2.6, 15, k, .9, g, s * 4.6, 1.3, 0); for (let i = 0; i < 6; i++) { const w = cyl(1, 1, 2.8, d, 14, g, s * 4.6, 1.2, -6 + i * 2.4); w.rotation.z = Math.PI / 2; } box(3, .3, 15.4, o, .1, g, s * 4.6, 2.7, 0); }
  const TUR = G(g, 0, 3.6, -1); box(6, 2.2, 6.6, o, .8, TUR, 0, 1.1, 0); const bar = cyl(.4, .4, 9, d, 12, TUR, 0, 1.2, 7.2); bar.rotation.x = Math.PI / 2; cyl(.6, .6, 1, d, 12, TUR, 0, 1.2, 11.6).rotation.x = Math.PI / 2; cyl(1.2, 1.2, .6, d, 14, TUR, 1.4, 2.5, -1.4);
  const st = textPlane(1.8, 1.8, 64, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(24, 4, 16, 56); c.fillRect(4, 24, 56, 16); c.fillStyle = '#1a1a1a'; c.fillRect(28, 8, 8, 48); c.fillRect(8, 28, 48, 8); }, .1); st.position.set(3.02, 1.2, 0); st.rotation.y = Math.PI / 2; TUR.add(st);
  g.userData.tur = TUR; return shade(g); }

// ---------- montoncito de polvo (gris arena, con brillos) ----------
const dustT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#9a948a'; c.fillRect(0, 0, w, h); const r = RNG(31); for (let i = 0; i < 900; i++) { c.fillStyle = ['#8a847a', '#aaa49a', '#7a746a', '#bab4aa'][i % 4]; c.fillRect(r() * w, r() * h, 2, 2); } }, true);
export function dustPile(parent, s = 1) { const g = G(parent); const m = mat(0xffffff, { map: dustT, roughness: 1 }); const c = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.3, 20, 3), m); c.position.y = .62; c.geometry.attributes.position.array.forEach((v, i, a) => { if (i % 3 === 1 && v > -.6) { } }); g.add(c);
  for (let i = 0; i < 6; i++) { const p = sphere(.32 + (i % 3) * .1, m, g, Math.cos(i) * 1.5, .15, Math.sin(i) * 1.5, 8, 6); p.scale.y = .4; } g.scale.setScalar(s); return shade(g); }

// ---------- capa que ondea (se cuelga de la espalda del personaje) ----------
export function cape(ch, col, inner = null, len = 4.2) { const g = new THREE.Group(); g.position.set(0, 1.95, -.62); ch.spine.add(g); const m = mat(col, { roughness: .55, side: THREE.DoubleSide }), mi = mat(inner ?? col, { roughness: .55 });
  const segs = []; let par = g; for (let i = 0; i < 4; i++) { const s = new THREE.Group(); s.position.y = i ? -len / 4 : 0; par.add(s); const w = 2.3 + i * .25; box(w, len / 4 + .05, .14, m, .03, s, 0, -len / 8, 0); box(w - .1, len / 4, .04, mi, .01, s, 0, -len / 8, .09); segs.push(s); par = s; }
  box(2.4, .3, .5, mat(col), .1, g, 0, .05, .2); g.userData.segs = segs; ch.props.cape = g;
  g.userData.sway = (T, wind = .5, fly = 0) => segs.forEach((s, i) => { const base = i ? (.05 + fly * .12 + wind * .05) : (.08 + fly * .55 + wind * .1); s.rotation.x = base + (Math.sin(T * 5 + i * .9) * .06 * (1 + wind) * (i + 1) / 2) * (i ? 1 : .5); s.rotation.z = Math.sin(T * 3.3 + i) * .03 * wind; });
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; }

// ---------- haz de láser (cilindro brillante entre dos puntos) ----------
export function laser(scene, col = [4, .4, .3]) { const g = G(scene); const core = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, 1, 10, 1, true), B(...col.map(v => v * 1.2))); const glow = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, 1, 12, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(...col), transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  g.add(core, glow); const up = new THREE.Vector3(0, 1, 0);
  g.userData.span = (a, b, w = 1) => { const d = b.clone().sub(a), L = d.length(); g.position.copy(a).add(b).multiplyScalar(.5); g.quaternion.setFromUnitVectors(up, d.normalize()); core.scale.set(w, L, w); glow.scale.set(w, L, w); g.visible = true; }; g.visible = false; return g; }

// ---------- avispa ----------
export function wespe(scene) { const g = G(scene); const y = mat(0xffd21a, { roughness: .4 }), k = mat(0x1a1a1a, { roughness: .4 });
  const b = sphere(.32, y, g, 0, 0, -.25, 10, 8); b.scale.set(1, 1, 1.4); for (const z of [-.15, -.4]) { const r = cyl(.33, .33, .1, k, 12, g, 0, 0, z); r.rotation.x = Math.PI / 2; } sphere(.22, k, g, 0, 0, .18, 10, 8); sphere(.2, y, g, 0, 0, .45, 10, 8);
  const st = new THREE.Mesh(new THREE.ConeGeometry(.06, .3, 6), k); st.rotation.x = -Math.PI / 2; st.position.z = -.85; g.add(st);
  const wings = []; for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.CircleGeometry(.34, 12), new THREE.MeshStandardMaterial({ color: 0xe8f4ff, transparent: true, opacity: .55, side: THREE.DoubleSide, depthWrite: false })); w.position.set(s * .3, .25, 0); w.scale.set(1, 1.6, 1); g.add(w); wings.push(w); }
  g.userData.flap = T => wings.forEach((w, i) => { w.rotation.set(Math.PI / 2 + Math.sin(T * 60) * .5, 0, (i ? 1 : -1) * .4); }); return g; }

// ---------- pancarta con la cara del capitán (en un palo) ----------
export function schild(parent, text = 'FREIHEIT FÜR DEN KAPITÄN!', seed = 0) { const g = G(parent); cyl(.12, .12, 6, mat(0x8a6a4a), 6, g, 0, 3, 0);
  const p = textPlane(5, 3.6, 300, 216, (c, w, h) => { c.fillStyle = ['#ffffff', '#ffd23f', '#ff8ad0', '#8ad0ff'][seed % 4]; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6);
    const x = w / 2, y = 82; c.fillStyle = '#1a1a1a'; c.fillRect(x - 46, y - 52, 92, 34); c.fillStyle = '#f0c09c'; c.fillRect(x - 40, y - 34, 80, 74); c.fillStyle = '#1a1a1a'; c.fillRect(x - 24, y - 6, 12, 8); c.fillRect(x + 12, y - 6, 12, 8); c.fillRect(x - 16, y + 18, 32, 5); c.fillStyle = '#d8323a'; c.fillRect(x - 46, y - 26, 92, 10);
    const words = text.split(' '); const l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' '); txt(c, l1, w / 2, 160, 30, '#1a1a1a'); txt(c, l2, w / 2, 194, 30, '#d8323a'); }, .3);
  p.position.set(0, 6.4, .1); g.add(p); return shade(g); }

// ---------- pedestal de estatua con placa ----------
export function sockel(parent, text = 'KAPITÄN SOFORT') { const g = G(parent); const st = mat(0xffffff, { map: rep(noiseTex('#d8d4cc', ['#c8c4bc', '#e8e4dc'], 900, 3, 1), 2, 2), roughness: .8 });
  box(10, 1.2, 10, st, .1, g, 0, .6, 0); box(8, 5, 8, st, .2, g, 0, 3.7, 0); box(9, .8, 9, st, .1, g, 0, 6.6, 0);
  const p = textPlane(6.4, 1.4, 512, 112, (c, w, h) => { c.fillStyle = '#b8862a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffe08a'; c.lineWidth = 6; c.strokeRect(4, 4, w - 8, h - 8); txt(c, text, w / 2, h / 2 + 4, 58, '#fff2c0'); }, .2); p.position.set(0, 3.9, 4.02); g.add(p); return shade(g); }

// ---------- televisor de salón (para «Mein Prozess lief auf jedem Sender») ----------
export function fernseher(parent) { const g = G(parent); box(12, 7.4, .8, mat(0x101014, { roughness: .3 }), .2, g, 0, 3.7, 0); const s = screen(11.2, 6.6, 560, 330, 1.0); s.position.set(0, 3.7, .42); g.add(s); box(4, .4, 2, mat(0x101014), .1, g, 0, -.2, 0); g.userData.scr = s; return g; }

// ---------- edificio de gobierno en la plaza (Rathaus de la Innenstadt con escalinata) ----------
export function treppe(parent, w = 40, n = 8) { const g = G(parent); const st = mat(0xffffff, { map: rep(noiseTex('#e8e4dc', ['#d8d4cc', '#f4f0e8'], 900, 3, 1), 6, 1), roughness: .7 }); for (let i = 0; i < n; i++) box(w, .8, 2.4, st, .05, g, 0, .4 + i * .8, -i * 2.4); return shade(g); }
export function gerichtFront(parent) { const g = G(parent); const st = mat(0xffffff, { map: rep(noiseTex('#ece8de', ['#dcd8ce', '#f8f4ea'], 1200, 3, 1), 6, 3), roughness: .7 });
  box(70, 30, 20, st, .2, g, 0, 21.4, -30); const tri = new THREE.Mesh(new THREE.CylinderGeometry(.01, 40, 10, 3, 1), st); tri.rotation.set(Math.PI / 2, 0, 0); tri.scale.set(1, .5, .9); tri.position.set(0, 41, -19); g.add(tri);
  for (let k = 0; k < 8; k++) cyl(1.3, 1.5, 22, st, 16, g, -28 + k * 8, 17.4, -18); box(66, 2, 4, st, .1, g, 0, 29.4, -18);
  const sg = textPlane(30, 3, 1200, 120, (c, w, h) => { c.fillStyle = '#ece8de'; c.fillRect(0, 0, w, h); txt(c, 'LANDGERICHT', w / 2, h / 2 + 4, 96, '#3a3020'); }, .1); sg.position.set(0, 31.8, -15.9); g.add(sg);
  box(10, 14, .4, mat(0x5a3218), .1, g, 0, 13.4, -19.8); treppe(g, 72, 8).position.set(0, 0, 0);
  return shade(g); }

// NEINHALS — escenarios y atrezo propios: el Halswerk (fábrica abandonada por fuera, con valla, «GESCHLOSSEN», hierbajos y vías),
// la nave por dentro con la Hals-Schrumpf-Maschine (torre de anillos que se encienden, cúpula, cartel, panel con botón START y cable suelto),
// el Schloss (castillo blanco con torres y pórtico cuyo tejado se rompe), la isla propia, el Oldtimer dorado, deportivos,
// la columna de anuncios (Litfaßsäule) con el cartel de los 999 € y una valla publicitaria.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, V, outline, clamp, lerp } from './engine.js';
import { FONT } from './props.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const rep = (t, x, y) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(x, y); return t; };
export const txt = (c, s, x, y, size, fill, stroke = null, lw = 0, font = FONT) => { c.font = `700 ${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = fill; c.fillText(s, x, y); };
const plane = (w, d, m, p, x, y, z) => { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); o.rotation.x = -Math.PI / 2; o.position.set(x, y, z); o.receiveShadow = true; p.add(o); return o; };
const noise = (base, cols, n, s = 2) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); const r = RNG(n); for (let i = 0; i < n; i++) { c.fillStyle = cols[i % cols.length]; c.fillRect(r() * w, r() * h, s + r() * s, s + r() * s); } });
const grassT = (b = '#5cbf48') => noise(b, ['#4ead3c', '#6ccf58', '#58b844', '#7ad864'], 3000, 2);
const stripesT = (a, b, n = 8) => canvasTex(128, 128, (c, w, h) => { for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? b : a; c.beginPath(); c.moveTo(i * w / n * 2 - w, h); c.lineTo(i * w / n * 2 - w + w / n, h); c.lineTo(i * w / n * 2 + w / n, 0); c.lineTo(i * w / n * 2, 0); c.fill(); } }, true);
// ventana con marco y reflejo
const winTex = (frame = '#ffffff', a = '#bfe6ff', b = '#4a7aa8', bars = true) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = frame; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 10, 0, h - 10); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(12, 12, w - 24, h - 24); c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(18, h - 20); c.lineTo(60, 16); c.lineTo(80, 16); c.lineTo(38, h - 20); c.fill(); if (bars) { c.fillStyle = frame; c.fillRect(w / 2 - 3, 12, 6, h - 24); c.fillRect(12, h / 2 - 3, w - 24, 6); } });

// ---------- vehículos ----------
// Oldtimer dorado de los años 30: guardabarros redondos, estribos, capó largo con rejilla, faros redondos, rueda de repuesto, techo de lona
export function oldtimer(parent) { const g = G(parent); const gold = mat(0xf2c230, { metalness: .9, roughness: .18 }), dk = mat(0x2a1a10, { roughness: .5 }), chrome = mat(0xe8eef4, { metalness: 1, roughness: .12 }), tire = mat(0x141414, { roughness: .8 }), cream = mat(0xf6ecd0, { roughness: .6 });
  box(4.6, 1.5, 7.6, gold, .5, g, 0, 2.3, -1.0); box(3.4, 1.4, 4.6, gold, .5, g, 0, 2.0, 4.2);                       // cabina baja y capó
  box(4.4, 2.0, 4.0, dk, .4, g, 0, 4.0, -1.6); box(4.0, 1.5, 3.4, glassM(), .2, g, 0, 3.9, -1.5);                     // techo de lona con ventanillas
  for (const s of [-1, 1]) for (const z of [3.8, -4.0]) { const f = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 1.6, 20, 1, false, 0, Math.PI), gold); f.rotation.set(0, 0, Math.PI / 2); f.rotation.order = 'ZXY'; f.position.set(s * 2.0, 1.4, z); f.rotation.x = Math.PI / 2; g.add(f);
    const w = cyl(1.25, 1.25, .8, tire, 20, g, s * 2.0, 1.25, z); w.rotation.z = Math.PI / 2; const hub = cyl(.7, .7, .84, chrome, 16, g, s * 2.0, 1.25, z); hub.rotation.z = Math.PI / 2;
    for (let k = 0; k < 8; k++) { const sp = box(.06, 1.2, .06, chrome, 0, g, s * 2.42, 1.25, z); sp.rotation.x = k / 8 * Math.PI; } }
  for (const s of [-1, 1]) box(.9, .14, 6.2, dk, .05, g, s * 2.45, 1.0, 0);                                           // estribos
  box(3.0, 2.0, .3, chrome, .1, g, 0, 2.4, 6.6); for (let k = 0; k < 9; k++) box(.1, 1.7, .1, dk, 0, g, -1.2 + k * .3, 2.4, 6.78);   // rejilla
  for (const s of [-1, 1]) { const l = cyl(.55, .55, .6, chrome, 18, g, s * 1.9, 3.0, 6.2); l.rotation.x = Math.PI / 2; const gl = cyl(.45, .45, .05, glowM(0xfff6d8, 1.4), 18, g, s * 1.9, 3.0, 6.52); gl.rotation.x = Math.PI / 2; }
  const sp = cyl(1.2, 1.2, .6, tire, 20, g, 0, 2.6, -5.1); sp.rotation.x = Math.PI / 2; cyl(.6, .6, .64, gold, 16, g, 0, 2.6, -5.1).rotation.x = Math.PI / 2;
  box(5.0, .3, .4, chrome, .1, g, 0, 1.0, 7.0); box(5.0, .3, .4, chrome, .1, g, 0, 1.0, -5.6);                       // parachoques
  const orn = sphere(.3, gold, g, 0, 3.0, 6.6, 10, 8); box(.6, .1, .3, cream, .03, g, 0, 2.9, 3.2);
  outline(g, 1.8); return shade(g); }
const glassM = () => mat(0x9ad4f0, { roughness: .05, metalness: .3, transparent: true, opacity: .55 });
// deportivo bajo y redondeado (col: color de la carrocería); faros, pilotos rojos, llantas de cinco radios
export function sportwagen(parent, col = 0xc8ccd4, o = {}) { const g = G(parent); const body = mat(col, { metalness: .75, roughness: .2 }), dk = mat(0x141418, { roughness: .4 }), tire = mat(0x121212, { roughness: .85 }), rim = mat(o.rim ?? 0x2a2a30, { metalness: .9, roughness: .25 });
  const b = box(4.8, 1.3, 10.4, body, .6, g, 0, 1.55, 0); const nose = sphere(1, body, g, 0, 1.5, 4.4, 20, 12); nose.scale.set(2.4, .72, 1.6); const tail = sphere(1, body, g, 0, 1.6, -4.2, 20, 12); tail.scale.set(2.4, .82, 1.7);
  const cab = sphere(1, glassM(), g, 0, 2.5, -.6, 20, 12); cab.scale.set(2.0, 1.05, 3.4); const roof = sphere(1, body, g, 0, 2.62, -1.0, 20, 12); roof.scale.set(1.9, .95, 2.4);
  for (const s of [-1, 1]) for (const z of [3.4, -3.3]) { const w = cyl(1.05, 1.05, .8, tire, 22, g, s * 2.3, 1.05, z); w.rotation.z = Math.PI / 2; const r = cyl(.66, .66, .84, rim, 5, g, s * 2.3, 1.05, z); r.rotation.z = Math.PI / 2; }
  for (const s of [-1, 1]) { const l = sphere(.42, glowM(0xfff8e8, 1.6), g, s * 1.6, 1.8, 5.55, 12, 8); l.scale.set(1, .7, .5); box(1.3, .22, .1, glowM(0xff2a2a, 1.6), .05, g, s * 1.25, 1.9, -5.75); }
  box(4.2, .14, .2, glowM(0xff2a2a, 1.2), .05, g, 0, 1.9, -5.78); box(4.0, .3, 1.0, dk, .1, g, 0, .9, 5.6);
  if (o.plate) { const p = textPlane(2.2, .55, 220, 56, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a3aa8'; c.fillRect(0, 0, 22, h); c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4); txt(c, o.plate, w / 2 + 10, h / 2 + 2, 34, '#1a1a1a'); }); p.position.set(0, 1.0, 6.12); g.add(p); }
  outline(g, 1.6); return shade(g); }

// ---------- Litfaßsäule (columna de anuncios) con cartel dibujable y valla publicitaria ----------
export function litfass(parent, draw) { const g = G(parent); const gr = mat(0x2a5a3a, { roughness: .5 });
  cyl(2.6, 2.8, .8, gr, 28, g, 0, .4, 0); const pT = canvasTex(1024, 512, (c, w, h) => draw(c, w, h)); pT.wrapS = THREE.RepeatWrapping;
  const col = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 9, 32, 1, true), new THREE.MeshStandardMaterial({ map: pT, roughness: .7 })); col.position.y = 5.3; g.add(col);
  cyl(2.8, 2.6, .6, gr, 28, g, 0, 10.1, 0); const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 24, 10, 0, 6.283, 0, 1.3), gr); dome.position.y = 10.3; dome.scale.y = .6; g.add(dome); sphere(.5, mat(0xd9a531, { metalness: .8 }), g, 0, 12.0, 0, 10, 8);
  g.userData = { tex: pT, col }; outline(g, 1.6); return shade(g); }
export function billboard(parent, w, h, draw) { const g = G(parent); const fr = mat(0xf4f4f4, { roughness: .4 }), st = mat(0x5a5e68, { metalness: .6, roughness: .4 });
  for (const s of [-1, 1]) box(.8, h * .6, .8, st, .1, g, s * w * .3, h * .3, -.6); box(w + 1, h + 1, .8, fr, .2, g, 0, h * .6 + h / 2, -.2);
  const p = textPlane(w, h, Math.round(w * 40), Math.round(h * 40), draw, .25); p.position.set(0, h * .6 + h / 2, .25); g.add(p); for (let k = 0; k < 3; k++) { const l = cyl(.12, .12, 2, st, 6, g, -w / 3 + k * w / 3, h * 1.6 + 1.2, 1); l.rotation.x = 1.2; }
  outline(g, 1.6); return shade(g); }
export function drawAd(c, w, h, k = 1) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ffe23a'); g.addColorStop(1, '#ffb41a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = '#d8202a'; c.fillRect(0, 0, w, h * .2); txt(c, 'HALSWERK', w / 2, h * .1 + 2, h * .13, '#ffffff');
  txt(c, 'HOL DIR DEINEN', w * .36, h * .33, h * .1, '#1a1a1a'); txt(c, 'NORMALEN HALS', w * .36, h * .45, h * .1, '#1a1a1a'); txt(c, 'ZURÜCK!', w * .36, h * .58, h * .12, '#d8202a');
  // antes / después
  const fig = (x, L, col) => { c.fillStyle = '#2a6ad8'; c.fillRect(x - 22, h * .86 - 60, 44, 60); c.fillStyle = '#f2c4a0'; c.fillRect(x - 8, h * .86 - 60 - L, 16, L); c.fillRect(x - 20, h * .86 - 100 - L, 40, 40); c.strokeStyle = col; c.lineWidth = 6; c.strokeRect(x - 34, h * .86 - 110 - L, 68, L + 116); };
  fig(w * .2, 140, '#d8202a'); fig(w * .48, 6, '#1ab84a'); txt(c, '→', w * .34, h * .78, h * .1, '#1a1a1a');
  c.save(); c.translate(w * .8, h * .55); c.rotate(-.12); c.fillStyle = '#d8202a'; c.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283, r = i % 2 ? h * .2 : h * .25; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.fill();
  txt(c, 'NUR', 0, -h * .09, h * .07, '#ffffff'); txt(c, '999 €', 0, h * .02, h * .11, '#ffffff', '#7a0010', 8); c.restore(); }

// ---------- Halswerk por fuera (X): nave blanca y gris con franja roja, letras HALSWERK en el tejado, chimenea, portón, valla con puerta,
// cartel GESCHLOSSEN, hierbajos y vías oxidadas. La fachada en z = -30 mirando +z; la puerta de la valla en (0, 0, 8). ----------
export function fabrik(scene, X) { const g = G(scene, X);
  plane(1600, 1600, mat(0xffffff, { roughness: 1, map: rep(grassT('#62c04a'), 120, 120) }), g, 0, -.05, 0);
  plane(120, 60, mat(0xffffff, { roughness: .95, map: rep(noise('#9a9ea6', ['#8a8e96', '#aaaeb6', '#7a7e86'], 3000), 8, 4) }), g, 0, .02, -6);
  const wT = rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#eef0f2'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8dce2'; for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 2, h); c.fillStyle = 'rgba(120,90,60,.12)'; c.fillRect(0, h - 30, w, 30); }, true), 8, 2);
  const B = G(g, 0, 0, -44); box(90, 26, 28, mat(0xffffff, { map: wT, roughness: .8 }), .2, B, 0, 13, 0); box(92, 2.4, 30, mat(0x6a6e78), .2, B, 0, 27, 0);
  box(90.4, 2.2, 28.4, mat(0xd8323a, { roughness: .5 }), .1, B, 0, 8.5, 0);
  const wn = mat(0xffffff, { map: winTex('#e8e8e8', '#cfe8f8', '#5a7a98') }), wb = mat(0xffffff, { map: winTex('#e8e8e8', '#4a4e58', '#2a2e38') });
  for (let k = 0; k < 9; k++) { const x = -40 + k * 10; if (Math.abs(x) < 8) continue; box(6, 6, .3, k % 3 === 1 ? wb : wn, .05, B, x, 17.5, 14.1); box(6, 4, .3, k % 4 === 2 ? wb : wn, .05, B, x, 4, 14.1); }
  // portón (gris) y tablones
  box(14, 13, .5, mat(0x6a707a, { metalness: .5, roughness: .5 }), .1, B, 0, 6.5, 14.2); for (let y = 1; y < 13; y += 1.2) box(14, .12, .2, mat(0x50565e), 0, B, 0, y, 14.5);
  for (const [a, y] of [[.2, 5], [-.15, 8]]) { const p = box(15, 1, .3, mat(0x8a6a42, { roughness: .9 }), .05, B, 0, y, 14.7); p.rotation.z = a; }
  // letras del tejado
  const sg = textPlane(54, 8, 1350, 200, (c, w, h) => { txt(c, 'HALSWERK', w / 2, h / 2 + 6, 170, '#d8202a', '#ffffff', 22); }, .2); sg.position.set(0, 33.4, 2); B.add(sg); for (let k = 0; k < 6; k++) box(.4, 6, .4, mat(0x5a5e68), 0, B, -24 + k * 9.6, 30, 1);
  // chimenea y depósitos
  cyl(3, 3.6, 46, mat(0xc8463a, { roughness: .8 }), 18, B, 34, 23, -6); for (let k = 0; k < 4; k++) cyl(3.2, 3.2, .8, mat(0xf4f4f4), 18, B, 34, 10 + k * 10, -6);
  for (const s of [-1, 1]) { cyl(5, 5, 14, mat(0xb8bec8, { metalness: .6, roughness: .35 }), 20, g, s * 56, 7, -36); const d = new THREE.Mesh(new THREE.SphereGeometry(5, 20, 8, 0, 6.283, 0, 1.4), mat(0xb8bec8, { metalness: .6, roughness: .35 })); d.position.set(s * 56, 14, -36); d.scale.y = .4; g.add(d); }
  // valla con puerta y cartel GESCHLOSSEN
  const fm = mat(0x7a7e88, { metalness: .6, roughness: .4 });
  for (let x = -60; x <= 60; x += 4) { if (Math.abs(x) < 9) continue; cyl(.14, .14, 8, fm, 6, g, x, 4, 8); } for (const y of [1, 7.6]) for (const s of [-1, 1]) box(51, .2, .2, fm, 0, g, s * 34.5, y, 8);
  const meshT = rep(canvasTex(64, 64, (c, w, h) => { c.strokeStyle = '#9aa0aa'; c.lineWidth = 2; for (let i = -64; i < 128; i += 10) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 64, 64); c.stroke(); c.beginPath(); c.moveTo(i + 64, 0); c.lineTo(i, 64); c.stroke(); } }, true), 12, 2);
  for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(51, 7.6), new THREE.MeshStandardMaterial({ map: meshT, transparent: true, alphaTest: .3, side: THREE.DoubleSide, metalness: .5 })); m.position.set(s * 34.5, 4.2, 8); g.add(m); }
  const GATE = G(g, 0, 0, 8); for (const s of [-1, 1]) { cyl(.35, .35, 10, fm, 8, GATE, s * 9, 5, 0); const d = G(GATE, s * 9, 0, 0); d.name = 'door' + s; box(8.8, 7.6, .2, mat(0x8a909a, { metalness: .5, transparent: true, opacity: .9, map: rep(meshT.clone(), 2, 2), alphaTest: .3 }), 0, d, -s * 4.5, 4.4, 0); box(8.8, .3, .3, fm, 0, d, -s * 4.5, 8.1, 0); box(8.8, .3, .3, fm, 0, d, -s * 4.5, .7, 0); }
  const chainM = mat(0xc8ccd4, { metalness: .9, roughness: .3 }); for (let k = 0; k < 6; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.22, .06, 6, 10), chainM); r.position.set(-.5 + k * .2, 4 + Math.sin(k) * .2, .3); r.rotation.y = k % 2 ? Math.PI / 2 : 0; GATE.add(r); } box(.8, 1, .4, mat(0xb8901a, { metalness: .8 }), .1, GATE, .5, 3.5, .4);
  const CLOSED = textPlane(9, 3.4, 450, 170, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8202a'; c.lineWidth = 14; c.strokeRect(8, 8, w - 16, h - 16); txt(c, 'GESCHLOSSEN', w / 2, h / 2 + 4, 76, '#d8202a'); });
  CLOSED.position.set(0, 6.2, .5); CLOSED.rotation.z = -.06; GATE.add(CLOSED);
  // hierbajos, vías y basura
  const wm = mat(0x3ab83a, { roughness: .9 }), wm2 = mat(0x8ad84a, { roughness: .9 }); const r = RNG(7);
  for (let i = 0; i < 70; i++) { const x = (r() - .5) * 100, z = -26 + r() * 34; if (Math.abs(x) < 6 && z > 0) continue; const s = .6 + r() * 1.2; const b = sphere(s, i % 2 ? wm : wm2, g, x, s * .6, z, 8, 6); b.scale.y = .8 + r(); }
  for (const s of [-1, 1]) box(.4, .3, 120, mat(0x8a4a2a, { metalness: .5, roughness: .6 }), .05, g, 40 + s * 1.6, .15, -10); for (let z = -60; z < 50; z += 2.4) box(5, .25, .8, mat(0x6a4a32), .05, g, 40, .1, z);
  for (const [x, z] of [[-24, -6], [22, -12]]) { const bl = cyl(1.4, 1.4, 3, mat(0x2a6ad8, { metalness: .5, roughness: .5 }), 14, g, x, 1.5, z); bl.rotation.z = .2; }
  // casas del pueblo al fondo y colinas
  for (let k = 0; k < 10; k++) { const hx = -170 + k * 38, hz = -120 - (k % 2) * 18; box(22, 14, 18, mat([0xf4e2c0, 0xf8d8d0, 0xdcecf4, 0xf4f0d8][k % 4], { roughness: .8 }), .2, g, hx, 7, hz); const rf = new THREE.Mesh(new THREE.ConeGeometry(16, 9, 4), mat([0xb8463a, 0x8a3a2a, 0x5a6a8a][k % 3], { roughness: .7 })); rf.position.set(hx, 18.5, hz); rf.rotation.y = .785; rf.scale.set(1, 1, .8); g.add(rf); }
  for (let k = 0; k < 6; k++) { const h = sphere(1, mat(0x7ad05a, { roughness: 1 }), g, -300 + k * 120, -10, -260, 20, 10); h.scale.set(90, 60, 40); }
  outline(B, 2.2); outline(GATE, 1.6); return { g: shade(g), B, GATE, CLOSED }; }

// ---------- la nave por dentro (X): suelo de hormigón con líneas amarillas, paredes con ventanales, focos lineales, puente grúa amarillo,
// tuberías de colores, estanterías y cajas. La máquina en (0, 0, -12): plataforma redonda a rayas, cuatro postes, 7 anillos que se
// encienden (M.on(k)), cúpula de cristal, cartel HALS-SCHRUMPF-MASCHINE; panel de control en (11, 0, -2) con START y pantalla;
// el cable suelto: enchufe PLUG junto al panel y la toma SOCK. ----------
export function halle(scene, X) { const g = G(scene, X); const W_ = 110, D = 90, H = 34;
  const floorT = rep(canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#9ea2a8'; c.fillRect(0, 0, w, h); const r = RNG(3); for (let i = 0; i < 2500; i++) { c.fillStyle = `rgba(${r() < .5 ? '60,60,70' : '220,220,230'},.12)`; c.fillRect(r() * w, r() * h, 3, 3); } c.strokeStyle = 'rgba(70,70,80,.3)'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); }, true), 10, 8);
  box(W_, .4, D, mat(0xffffff, { map: floorT, roughness: .7, metalness: .1 }), 0, g, 0, -.2, 0);
  for (const x of [-22, 22]) box(.8, .05, D, mat(0xffd21a), 0, g, x, .03, 0);
  const wallT = rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#e8ecf0'; c.fillRect(0, 0, w, h); c.fillStyle = '#d0d6de'; for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 2, h); }, true), 10, 3);
  const wm = mat(0xffffff, { map: wallT, roughness: .8 }); box(W_, H, .6, wm, 0, g, 0, H / 2, -D / 2); for (const s of [-1, 1]) box(.6, H, D, wm, 0, g, s * W_ / 2, H / 2, 0); box(W_, H, .6, wm, 0, g, 0, H / 2, D / 2);
  box(W_, 2, D, mat(0xd8dce2), 0, g, 0, H, 0); for (const s_ of [-1, 1]) { box(W_ - 1, 3, .3, mat(0x2a6ad8, { roughness: .5 }), 0, g, 0, 1.5, s_ * (D / 2 - .5)); box(.3, 3, D - 1, mat(0x2a6ad8, { roughness: .5 }), 0, g, s_ * (W_ / 2 - .5), 1.5, 0); }
  const winM = mat(0xffffff, { map: winTex('#c8ced6', '#e8f6ff', '#9ad0f0'), emissive: 0x8ac8f0, emissiveIntensity: .35 });
  for (let k = 0; k < 6; k++) { box(11, 9, .3, winM, .05, g, -42 + k * 16.8, 22, -D / 2 + .5); for (const s of [-1, 1]) { const w = box(.3, 9, 11, winM, .05, g, s * (W_ / 2 - .5), 22, -36 + k * 14); } }
  // focos lineales y vigas del techo
  for (let k = 0; k < 5; k++) { box(.8, 1.2, D - 6, mat(0x5a5e68, { metalness: .6 }), .05, g, -40 + k * 20, H - 2, 0); box(1.6, .3, D - 10, glowM(0xffffff, 2.2), .05, g, -40 + k * 20, H - 2.7, 0); }
  // puente grúa amarillo
  for (const s of [-1, 1]) box(1.6, 1.6, D - 4, mat(0xf2b81a, { roughness: .5 }), .1, g, s * 40, 26, 0); box(82, 2.2, 2.2, mat(0xf2b81a, { roughness: .5 }), .1, g, 0, 26.8, 6); box(3, 2.4, 3, mat(0x3a3e48), .2, g, 6, 25, 6);
  // tuberías de colores en las paredes
  for (const [y, col] of [[6, 0xd8323a], [7.4, 0x2a6ad8], [8.8, 0x3aa04a], [10.2, 0xf2b81a]]) { const p = cyl(.5, .5, W_ - 2, mat(col, { roughness: .4, metalness: .3 }), 12, g, 0, y, -D / 2 + 1.2); p.rotation.z = Math.PI / 2; }
  // estanterías con cajas y bidones
  for (const s of [-1, 1]) { const R_ = G(g, s * 44, 0, 10); for (const y of [0, 5, 10]) box(6, .4, 22, mat(0xd86a2a), .05, R_, 0, y + .2, 0); for (const z of [-10.6, 10.6]) for (const x of [-2.8, 2.8]) box(.4, 15, .4, mat(0x2a5ab8), .02, R_, x, 7.5, z);
    for (let k = 0; k < 12; k++) box(4, 3.4, 4.6, mat([0xc89a5a, 0xb8884a, 0xd8aa6a][k % 3], { roughness: .9 }), .1, R_, 0, (k % 3) * 5 + 2.2, -8 + Math.floor(k / 3) * 5.3); }
  for (let k = 0; k < 6; k++) cyl(1.3, 1.3, 3.2, mat([0x2a6ad8, 0xd8323a][k % 2], { metalness: .4, roughness: .5 }), 14, g, -30 + (k % 3) * 2.8, 1.6, 28 + Math.floor(k / 3) * 2.8);
  // ----- la máquina -----
  const M = G(g, 0, 0, -12); const steel = mat(0x5a6270, { metalness: .8, roughness: .3 }), dark = mat(0x2a2e36, { metalness: .6, roughness: .4 });
  const stripeT = rep(stripesT('#ffd21a', '#1a1a1a', 10), 8, 1); const base = cyl(9, 10, 2, mat(0xffffff, { map: stripeT, roughness: .6 }), 40, M, 0, 1, 0); cyl(8, 8, .3, mat(0x6a7280, { metalness: .7, roughness: .4 }), 40, M, 0, 2.1, 0);
  const pad = cyl(4, 4, .2, glowM(0x7aff5a, 0), 32, M, 0, 2.3, 0);
  for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283 + .785; box(1.2, 28, 1.2, steel, .1, M, Math.cos(a) * 6.4, 16, Math.sin(a) * 6.4); for (let y = 4; y < 28; y += 4) { const br = box(.3, .3, 9, dark, 0, M, Math.cos(a + .785) * 4.6, y, Math.sin(a + .785) * 4.6); br.rotation.y = -(a + .785) + Math.PI / 2; } }
  const RINGS = []; for (let k = 0; k < 7; k++) { const rm = glowM(0x3ae8ff, 0); rm.color.setHex(0x6a8a9a); const r = new THREE.Mesh(new THREE.TorusGeometry(6.2, .45, 10, 48), rm); r.rotation.x = Math.PI / 2; r.position.y = 5 + k * 3.4; M.add(r); RINGS.push(r); }
  const dome = new THREE.Mesh(new THREE.SphereGeometry(7.2, 28, 12, 0, 6.283, 0, 1.4), mat(0xbfe8ff, { roughness: .05, metalness: .3, transparent: true, opacity: .45 })); dome.position.y = 30; dome.scale.y = .55; M.add(dome); cyl(7.6, 7.6, 1.2, steel, 36, M, 0, 30, 0);
  const coil = G(M, 0, 34, 0); for (let k = 0; k < 6; k++) cyl(1.2 - k * .1, 1.2 - k * .1, .4, mat(0xc8743a, { metalness: .85, roughness: .3 }), 16, coil, 0, k * .6, 0); sphere(1.4, mat(0xd8dce4, { metalness: .9, roughness: .15 }), coil, 0, 4.4, 0, 16, 12);
  const SIGN = textPlane(16, 3.4, 800, 170, (c, w, h) => { c.fillStyle = '#ffd21a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a1a1a'; c.lineWidth = 12; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'HALS-SCHRUMPF-', w / 2, h * .34, 66, '#1a1a1a'); txt(c, 'MASCHINE', w / 2, h * .72, 70, '#1a1a1a'); });
  SIGN.position.set(0, 33, 7.8); M.add(SIGN); for (const s of [-1, 1]) box(.3, 4, .3, dark, 0, M, s * 6, 31, 7.5);
  // haz/láser central (cilindro brillante) y destello
  const LASER = new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, 26, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xaaffff, transparent: true, opacity: .0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); LASER.position.y = 16; M.add(LASER);
  const GLOW = new THREE.PointLight(0x5ae8ff, 0, 60, 1.2); GLOW.position.set(0, 14, 0); M.add(GLOW);
  // polvo y telarañas (se ocultan al encender)
  const DIRT = G(M); const cw = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .35, side: THREE.DoubleSide, depthWrite: false });
  for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283 + .785; const web = new THREE.Mesh(new THREE.CircleGeometry(2.4, 8), cw); web.position.set(Math.cos(a) * 6.4, 20 + k * 2, Math.sin(a) * 6.4); web.lookAt(0, 20 + k * 2, 0); DIRT.add(web); for (let i = 0; i < 4; i++) { const l = box(.03, .03, 4.8, mat(0xffffff, { transparent: true, opacity: .5 }), 0, web, 0, 0, 0); l.rotation.set(0, i * .785, 0); l.rotation.order = 'YXZ'; l.rotation.x = Math.PI / 2; } }
  const on = (k, T = 0) => { RINGS.forEach((r, i) => { const kk = clamp(k * 8 - i); r.material.emissiveIntensity = kk * (2.4 + Math.sin(T * 14 + i) * .5); r.material.color.setRGB(lerp(.42, .23, kk), lerp(.54, .91, kk), lerp(.6, 1, kk)); r.rotation.z = T * (i % 2 ? 1 : -1) * 2 * kk; }); pad.material.emissiveIntensity = k * 1.6; GLOW.intensity = k * 140; DIRT.visible = k < .02; };
  // panel de control
  const P = G(g, 11, 0, -2); P.rotation.y = -.5; box(5, 5, 2.6, mat(0x6a7480, { metalness: .5, roughness: .4 }), .2, P, 0, 2.5, 0); const top = box(5.4, .5, 3.2, dark, .1, P, 0, 5.2, .2); top.rotation.x = .3;
  const scrT = canvasTex(256, 160, () => {}); const SCR = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2), new THREE.MeshBasicMaterial({ map: scrT, toneMapped: false })); SCR.position.set(0, 7.2, -.4); P.add(SCR); box(3.6, 2.4, .3, dark, .05, P, 0, 7.2, -.6); box(.4, 2, .4, dark, 0, P, 0, 5.8, -.6);
  const BTN = cyl(.7, .7, .5, glowM(0xff2a2a, .2), 20, P, 0, 5.6, .5); BTN.rotation.x = .3; cyl(.9, .9, .2, mat(0xffd21a), 20, P, 0, 5.4, .45).rotation.x = .3;
  const lb = textPlane(1.6, .5, 160, 50, (c, w, h) => { c.fillStyle = '#1a1a1a'; c.fillRect(0, 0, w, h); txt(c, 'START', w / 2, h / 2 + 2, 36, '#ffffff'); }); lb.position.set(0, 5.75, 1.35); lb.rotation.x = -1.27; P.add(lb);
  for (let k = 0; k < 6; k++) { const l = sphere(.18, glowM([0x2aff4a, 0xffd21a, 0xff2a2a][k % 3], .3), P, -2 + k * .8, 5.35, -.6, 8, 6); l.name = 'led'; }
  scrT.userData = {}; const drawScr = (s, col = '#2aff6a') => { const c = scrT.image.getContext('2d'); if (scrT.userData.s === s + col) return; scrT.userData.s = s + col; c.fillStyle = '#0a1418'; c.fillRect(0, 0, 256, 160); txt(c, s, 128, 80, 40, col); scrT.needsUpdate = true; }; drawScr('OFFLINE', '#ff4a4a');
  // cable: toma en el lateral del panel y enchufe suelto en el suelo
  const SOCK = G(P, 2.6, 1.6, .4); box(.4, 1.2, 1.2, dark, .1, SOCK, 0, 0, 0); for (const s of [-1, 1]) box(.2, .2, .1, mat(0x1a1a1a), 0, SOCK, .2, s * .25, 0);
  const PLUG = G(g); { const pm = mat(0xf26a1a, { roughness: .5 }); box(1, 1.2, .9, pm, .25, PLUG, 0, 0, 0); for (const s of [-1, 1]) box(.12, .12, .5, mat(0xe8c060, { metalness: .9 }), 0, PLUG, s * .25, 0, .6); }
  const CABLE = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(0, 0, 0), V(1, 0, 1)]), 20, .22, 8), mat(0x1a1a1a, { roughness: .5 })); g.add(CABLE);
  const setCable = (a, b) => { const mid = a.clone().lerp(b, .5); const curve = new THREE.CatmullRomCurve3([V(0, .3, -10), V(3, .3, -6), V(6, .3, -3), a.clone().setY(.3), mid.setY(Math.max(.3, Math.min(a.y, b.y) - .6)), b]); CABLE.geometry.dispose(); CABLE.geometry = new THREE.TubeGeometry(curve, 40, .22, 8); };
  outline(M, 2); outline(P, 1.6); outline(PLUG, 1.4);
  return { g: shade(g), M, RINGS, on, LASER, GLOW, P, BTN, SCR: drawScr, SOCK, PLUG, setCable, CABLE, DIRT, SIGN }; }

// ---------- el Schloss (X): castillo blanco sobre una loma con césped, camino de grava, cuatro torres redondas con tejados cónicos azules
// y banderas, cuerpo central con ventanas altas, pórtico con columnas delante de la puerta dorada (z = 26) cuyo tejado (ROOF) se rompe
// en trozos (DEB); fuente y setos. La puerta en (0, 0, 26) mirando +z; delante, la explanada (z de 28 a 60). ----------
export function schloss(scene, X) { const g = G(scene, X);
  plane(1600, 1600, mat(0xffffff, { roughness: 1, map: rep(grassT('#5cc44a'), 120, 120) }), g, 0, -.05, 0);
  plane(30, 140, mat(0xffffff, { roughness: 1, map: rep(noise('#e8dcc4', ['#d8ccb4', '#f4ead4'], 2000), 2, 10) }), g, 0, .02, 80);
  plane(70, 40, mat(0xffffff, { roughness: .9, map: rep(noise('#e8dcc4', ['#d8ccb4', '#f4ead4'], 2000), 5, 3) }), g, 0, .03, 44);
  const wh = mat(0xfaf6ee, { roughness: .8 }), bl = mat(0x2a5ab8, { roughness: .5 }), gold = mat(0xf2c230, { metalness: .9, roughness: .2 });
  const winT = mat(0xffffff, { map: winTex('#faf6ee', '#d8eeff', '#5a8ac8') });
  box(56, 30, 30, wh, .3, g, 0, 15, 0); box(58, 2, 32, mat(0xe8e0d0), .2, g, 0, 30.5, 0);
  for (let k = 0; k < 12; k++) box(2.4, 2.2, 2.4, wh, .1, g, -26 + k * 4.7, 32.6, 15.2);   // almenas
  const rf = new THREE.Mesh(new THREE.CylinderGeometry(0, 22, 14, 4, 1), bl); rf.position.set(0, 38.5, 0); rf.rotation.y = .785; rf.scale.set(1.3, 1, .7); g.add(rf);
  for (let r_ = 0; r_ < 3; r_++) for (let k = 0; k < 7; k++) { const x = -21 + k * 7; if (r_ === 0 && Math.abs(x) < 6) continue; box(3.4, 6, .3, winT, .1, g, x, 5 + r_ * 9, 15.1); }
  for (const [x, z] of [[-30, 16], [30, 16], [-30, -16], [30, -16]]) { cyl(7, 7.4, 40, wh, 24, g, x, 20, z); cyl(7.8, 7.8, 2, mat(0xe8e0d0), 24, g, x, 40, z); const c = new THREE.Mesh(new THREE.ConeGeometry(8.6, 16, 24), bl); c.position.set(x, 49, z); g.add(c); sphere(.6, gold, g, x, 57.4, z, 10, 8); cyl(.12, .12, 6, mat(0x5a5a5a), 6, g, x, 60, z);
    const fl = box(.1, 2.4, 3.6, mat(0xd8202a), 0, g, x, 61.6, z + 1.8); fl.name = 'flag'; for (let r_ = 0; r_ < 3; r_++) { const w = box(2.6, 4.6, .3, winT, .1, g, x, 9 + r_ * 10, z + (z > 0 ? 7.2 : -7.2)); } }
  // puerta dorada doble y pórtico
  const DOOR = G(g, 0, 0, 15.2); box(9, 13, .6, mat(0x6a3a1a, { roughness: .6 }), .2, DOOR, 0, 6.5, 0); box(10, 14, .4, gold, .2, DOOR, 0, 7, -.1); for (const s of [-1, 1]) sphere(.4, gold, DOOR, s * 1, 6, .5, 10, 8);
  const POR = G(g, 0, 0, 22); for (const s of [-1, 1]) for (const z of [-4, 4]) { cyl(1, 1.1, 14, wh, 16, POR, s * 7, 7, z); cyl(1.5, 1.5, 1, mat(0xe8e0d0), 16, POR, s * 7, 14.4, z); cyl(1.5, 1.5, .8, mat(0xe8e0d0), 16, POR, s * 7, .4, z); }
  box(20, 1, 13, mat(0xe8e0d0), .1, POR, 0, -.3, 0); box(18, 1.4, 1, wh, .1, POR, 0, 15.2, 5); for (let k = 0; k < 4; k++) box(18 - k * .6, .4, 13 - k * .4, mat(0xe8e0d0), 0, POR, 0, -.8 - k * .4, 3 + k * 1.2);
  const ROOF = G(POR, 0, 15.6, 0); const DEB = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const p = box(4.6, 1.2, 4.4, i === 1 || i === 2 ? (j === 1 ? mat(0xe8e0d0) : wh) : wh, .1, ROOF, -6.9 + i * 4.6, 0, -4.4 + j * 4.4); p.userData.home = p.position.clone(); DEB.push(p); }
  { const sh_ = new THREE.Shape(); sh_.moveTo(-10, 0); sh_.lineTo(10, 0); sh_.lineTo(0, 4.2); sh_.lineTo(-10, 0); const tri = new THREE.Mesh(new THREE.ExtrudeGeometry(sh_, { depth: 1.4, bevelEnabled: false }), wh); tri.position.set(0, .6, 4.2); ROOF.add(tri); const tg = textPlane(5, 1.6, 250, 80, (c, w, h) => { c.fillStyle = '#f2c230'; c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('L', w / 2, h / 2 + 4); }); tg.position.set(0, 2.0, 5.65); ROOF.add(tg); }
  // fuente, setos y farolas
  cyl(6, 6.4, 1.6, wh, 28, g, 0, .8, 48); cyl(5.4, 5.4, .2, mat(0x5ac8f0, { roughness: .05, metalness: .2 }), 28, g, 0, 1.5, 48); cyl(.8, 1, 5, wh, 12, g, 0, 3, 48); cyl(2.2, 2.2, .6, wh, 16, g, 0, 5.4, 48);
  for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { const h = box(4, 3, 4, mat(0x2a8a3a, { roughness: .9 }), .8, g, s * 20, 1.5, 30 + k * 8); }
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) { const z = 34 + k * 14; cyl(.25, .3, 8, mat(0x1a1a1a, { metalness: .6 }), 8, g, s * 13, 4, z); sphere(.9, glowM(0xfff4c8, .6), g, s * 13, 8.6, z, 12, 8); }
  // palmeras y mar a lo lejos
  for (const [x, z] of [[-48, 40], [48, 40], [-60, 0], [60, 0]]) palm(g, x, z, 1.3);
  plane(3000, 3000, mat(0x3aa8e8, { roughness: .2, metalness: .3 }), g, 0, -.3, -900);
  outline(g, 2.2); return { g: shade(g), DOOR, POR, ROOF, DEB }; }

// palmera: tronco curvo de segmentos y hojas
export function palm(parent, x, z, s = 1, y = 0) { const g = G(parent, x, y, z); g.scale.setScalar(s); const tr = mat(0xa87a4a, { roughness: .9 }), lf = mat(0x3ab84a, { roughness: .7, side: THREE.DoubleSide });
  let p = V(0, 0, 0); for (let k = 0; k < 8; k++) { const c = cyl(.75 - k * .05, .8 - k * .05, 1.8, tr, 8, g, p.x, p.y + .9, p.z); c.rotation.z = -k * .03; p = V(p.x + k * .08, p.y + 1.75, p.z); }
  for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283; const l = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 7), lf); l.geometry.translate(0, 3.5, 0); l.position.copy(p); l.rotation.set(Math.cos(a) * 1.15, 0, -Math.sin(a) * 1.15); l.rotation.order = 'YXZ'; l.rotation.y = a; g.add(l); }
  for (let k = 0; k < 3; k++) sphere(.45, mat(0x6a4a2a), g, p.x + Math.cos(k * 2) * .5, p.y - .3, p.z + Math.sin(k * 2) * .5, 8, 6); return g; }

// ---------- la isla (X): mar turquesa con olas suaves, isla de arena con palmeras, cabaña de playa con bandera y yate blanco ----------
export function insel(scene, X) { const g = G(scene, X);
  const seaT = rep(canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#2ad0e8'); gr.addColorStop(1, '#1a9ad8'); c.fillStyle = gr; c.fillRect(0, 0, w, h); const r = RNG(2); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; for (let i = 0; i < 60; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.arc(x, y, 6 + r() * 10, 3.6, 5.8); c.stroke(); } }, true), 40, 40);
  const SEA = plane(4000, 4000, mat(0xffffff, { map: seaT, roughness: .15, metalness: .2 }), g, 0, 0, 0);
  const sand = mat(0xf4e0a8, { roughness: 1 }); const isl = sphere(1, sand, g, 0, -6, 0, 40, 16); isl.scale.set(60, 9, 46); const shal = new THREE.Mesh(new THREE.CircleGeometry(76, 48), new THREE.MeshStandardMaterial({ color: 0x7af0e8, transparent: true, opacity: .55, roughness: .1 })); shal.rotation.x = -Math.PI / 2; shal.position.y = .15; g.add(shal);
  const gr = sphere(1, mat(0x5ac84a, { roughness: 1 }), g, -6, -1.2, -6, 30, 12); gr.scale.set(32, 5, 24);
  for (const [x, z, s] of [[-14, -10, 1.6], [10, -16, 1.4], [-24, 6, 1.3], [20, 4, 1.5], [0, -24, 1.7], [-4, 10, 1.2], [26, -12, 1.2]]) palm(g, x, z, s, 2.4);
  const H = G(g, 6, 2.6, 0); box(14, 7, 10, mat(0xfaf6ee), .3, H, 0, 3.5, 0); const r_ = new THREE.Mesh(new THREE.ConeGeometry(11, 5, 4), mat(0xe8a84a, { roughness: .9 })); r_.position.y = 9.4; r_.rotation.y = .785; H.add(r_); box(3, 5, .3, mat(0x2a8ad8), .1, H, 0, 2.5, 5.1);
  cyl(.12, .12, 12, mat(0xdddddd), 6, H, -8, 6, 4); const fl = box(.1, 2.4, 3.8, mat(0xffd23f), 0, H, -8, 11, 5.9);
  const Y = G(g, -60, 0, 50); Y.rotation.y = .5; const yw = mat(0xffffff, { roughness: .3 }); const hull = sphere(1, yw, Y, 0, .8, 0, 24, 10); hull.scale.set(5, 2.2, 18); box(7, 3, 14, yw, .8, Y, 0, 3.6, -2); box(6, 2.6, 8, mat(0x2a3a5a, { roughness: .1, metalness: .5 }), .6, Y, 0, 6, -2); box(10.4, .4, 36, mat(0x1a3a8a), .2, Y, 0, .4, 0);
  outline(g, 1.8); return { g: shade(g), SEA, seaT, Y, H }; }

// ---------- cartel «+10 m» etc. (pancarta con flecha) y metro para medir el cuello ----------
export function cloud(parent, x, y, z, s = 1) { const g = G(parent, x, y, z); const m = mat(0xffffff, { roughness: 1, emissive: 0xffffff, emissiveIntensity: .15 }); for (let k = 0; k < 6; k++) sphere(3 + (k % 3), m, g, (k - 2.5) * 3.4, Math.sin(k * 2) * 1.2, Math.cos(k * 1.3) * 1.6, 14, 10); g.scale.setScalar(s); return g; }

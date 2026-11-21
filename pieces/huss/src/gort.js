// Gänse — Hufenbach: Marktplatz adoquinado con casas de colores (entramado), Rathaus con reloj, cine «Lichtspiele», Bäckerei Sonne,
// café con mesas fuera, parada de bus, carretera de salida con el cartel del pueblo, la casa de la familia (ventana con cortinas rojas)
// y el bloque de ladrillo de Lena (4.º piso, escalera acristalada). Interiores: mi cuarto de noche con cocina, la panadería y la escalera.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, rrect } from './engine.js';
import { noiseTex, stripes, txt, tree, bench, rathaus, fountain } from './props.js';
import { glass, label, bus } from './pech.js';
import { cobbleTex, lantern, loaf } from './diam.js';
export const FONT = 'Cap, sans-serif';
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const sign = (w, h, text, bg, fg, size = 64) => label(w, h, text, bg, fg, size, .35);

// ---------- texturas ----------
const roofTex = () => canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#7a2a24'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 22) for (let x = (y / 22) % 2 ? -16 : 0; x < w; x += 32) { c.fillStyle = '#b8483a'; rrect(c, x + 2, y, 28, 20, [0, 0, 12, 12]); c.fill(); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(x + 2, y + 16, 28, 4); } }, true);
const brickTex = (a = '#a8483a', b = '#7a3028') => canvasTex(128, 128, (c, w, h) => { c.fillStyle = b; c.fillRect(0, 0, w, h); const r = RNG(4); for (let y = 0; y < h; y += 10) for (let x = (y / 10) % 2 ? -10 : 0; x < w; x += 20) { const l = .85 + r() * .3; c.fillStyle = a; c.globalAlpha = l; c.fillRect(x + 1, y + 1, 18, 8); } c.globalAlpha = 1; }, true);
function facade(col, fach, ci) { return canvasTex(160, 200, (c, w, h) => {
  c.fillStyle = fach ? '#f6ecd6' : col; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.05)'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 1);
  if (fach) { c.fillStyle = '#5a3420'; c.fillRect(0, 0, w, 12); c.fillRect(0, h - 14, w, 14); c.fillRect(0, 0, 12, h); c.fillRect(w - 12, 0, 12, h); c.strokeStyle = '#5a3420'; c.lineWidth = 11; c.beginPath(); c.moveTo(12, h - 14); c.lineTo(40, 160); c.moveTo(w - 12, h - 14); c.lineTo(120, 160); c.moveTo(12, 12); c.lineTo(36, 40); c.moveTo(w - 12, 12); c.lineTo(124, 40); c.stroke(); }
  c.fillStyle = ['#2e5a8a', '#3a7a4a', '#8a3a3a', '#2a6a6a'][ci % 4]; c.fillRect(22, 46, 18, 100); c.fillRect(120, 46, 18, 100); c.fillStyle = 'rgba(255,255,255,.15)'; for (let y = 52; y < 140; y += 10) { c.fillRect(24, y, 14, 3); c.fillRect(122, y, 14, 3); }
  c.fillStyle = '#ffffff'; rrect(c, 40, 40, 80, 112, 8); c.fill(); const g = c.createLinearGradient(0, 47, 0, 145); g.addColorStop(0, '#9fd2f2'); g.addColorStop(.5, '#5a8ab8'); g.addColorStop(1, '#3a5a8a'); c.fillStyle = g; c.fillRect(47, 47, 66, 98);
  c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(52, 140); c.lineTo(70, 50); c.lineTo(80, 50); c.lineTo(62, 140); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(77, 47, 6, 98); c.fillRect(47, 92, 66, 6);
  c.fillStyle = ['#f2e2c8', '#e8c8d8', '#d8e8c8'][ci % 3]; c.fillRect(47, 47, 14, 98); c.fillRect(99, 47, 14, 98); c.fillStyle = '#ffffff'; c.fillRect(34, 152, 92, 8);
  for (let i = 0; i < 6; i++) { c.fillStyle = ['#e8323a', '#ff8ad0', '#ffd23f'][(i + ci) % 3]; c.beginPath(); c.arc(44 + i * 15, 150, 6, 0, 7); c.fill(); c.fillStyle = '#3f9a45'; c.fillRect(42 + i * 15, 150, 4, 4); } }, true); }
const FAC = ['#f2b8c6', '#a8d8f0', '#f6dc8a', '#b9e3b0', '#d4b8f2', '#f4c09a', '#9fd0c8', '#f6a8a0'];
// casa estrecha alemana: tejado a dos aguas, buhardilla, chimenea, jardineras con geranios, planta baja con puerta y escaparate/tienda opcional
export function townhouse(parent, x, z, wid, floors, ci, rot = 0, o = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  const fh = 9, h = 7 + floors * fh, d = 20, col = FAC[ci % FAC.length], fach = ci % 3 === 0; const t = facade(col, fach, ci); t.repeat.set(wid / 8, floors);
  box(wid, h - 7, d, mat(0xffffff, { map: t, roughness: .75 }), 0, g, 0, 7 + (h - 7) / 2, 0); box(wid, 7, d, mat(fach ? 0xd9cdb8 : col, { roughness: .8 }), 0, g, 0, 3.5, 0);
  for (let i = 0; i < Math.floor(wid / 8); i++) { const fx = -wid / 2 + 4 + i * 8; box(4.4, .8, 1.2, mat(0x7a4a2a), .15, g, fx, 9.2, d / 2 + .6); for (let j = 0; j < 5; j++) sphere(.42, mat(j % 2 ? 0xe8323a : 0x3f9a45), g, fx - 1.6 + j * .8, 9.8, d / 2 + .6, 8, 6); }
  box(wid + .8, .9, d + .8, mat(0xffffff), .1, g, 0, 7.2, 0); box(wid + 1.4, 1.1, d + 1.4, mat(0xffffff), .1, g, 0, h + .4, 0);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(.01, wid * .62, 10, 4, 1, false, Math.PI / 4), mat(0xffffff, { map: rep(roofTex(), 3, 2), roughness: .6 })); roof.scale.set(1, 1, (d + 2) / wid); roof.position.set(0, h + 5.8, 0); g.add(roof);
  box(2, 7, 2, mat(0x9a4a3a), .1, g, wid * .25, h + 7, -3); box(4, 4, 3, mat(0xffffff, { color: new THREE.Color(col) }), .2, g, -wid * .15, h + 3.2, d / 2 - 2.5); box(2.2, 2.2, .2, glass(), 0, g, -wid * .15, h + 3.2, d / 2 - .9);
  const front = d / 2 + .06; box(3.4, 5.2, .3, mat([0x5a3220, 0x2a5a3a, 0x2a3a6a][ci % 3]), .1, g, -wid * .28, 2.8, front); sphere(.18, mat(0xd9a531, { metalness: .8, roughness: .3 }), g, -wid * .28 + 1.1, 2.8, front + .2);
  box(wid * .45, 4, .25, glass(), 0, g, wid * .2, 3.2, front); box(wid * .48, .3, .5, mat(0xffffff), .05, g, wid * .2, 1.1, front + .2);
  const aw = canvasTex(256, 64, (c, w, h) => { const cc = ['#e8505b', '#5bb7e8', '#5fd39a', '#f2b33d'][ci % 4]; for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#ffffff' : cc; c.fillRect(i * 16, 0, 16, h); } }, true);
  const awn = box(wid * .5, .2, 3.2, mat(0xffffff, { map: aw }), 0, g, wid * .2, 5.8, front + 1.4); awn.rotation.x = .35;
  if (o.shop) { const s = sign(wid * .5, 1.4, o.shop, o.bg || '#1d2238', o.fg || '#ffd23f', 54); s.position.set(wid * .2, 6.6, front + .1); g.add(s); }
  return shade(g); }

// ---------- vehículos ----------
export function taxi(parent) { const g = new THREE.Group(); parent.add(g); const y = mat(0xf6c81a, { roughness: .3, metalness: .2 }), dk = mat(0x1a1a1e);
  box(5, 2.2, 10, y, .6, g, 0, 1.9, 0); box(4.6, .3, 5.6, y, .1, g, 0, 4.4, -.6); box(4.5, 1.6, .3, y, .1, g, 0, 3.6, -.65); for (const s of [-1, 1]) for (const z of [2, -3.3]) box(.3, 1.6, .3, y, .05, g, s * 2.1, 3.6, z);
  box(4, 1.4, .08, glass(), .1, g, 0, 3.7, 2.15); box(4, 1.3, .08, glass(), .1, g, 0, 3.7, -3.35); const ts = sign(1.8, .7, 'TAXI', '#fff6c8', '#1a1a1a', 50); ts.position.set(0, 4.95, -.4); g.add(ts); const ts2 = ts.clone(); ts2.rotation.y = Math.PI; g.add(ts2); box(1.9, .7, .5, mat(0xfff6c8, { emissive: 0xffe08a, emissiveIntensity: .3 }), .1, g, 0, 4.9, -.6);
  for (const s of [-1, 1]) for (const z of [-3.2, 3.2]) { const w = cyl(1, 1, .7, mat(0x161618), 14, g, s * 2.3, 1, z); w.rotation.z = Math.PI / 2; }
  for (const s of [-1, 1]) { sphere(.3, mat(0xffffff, { emissive: 0xfff4c0, emissiveIntensity: 2 }), g, s * 1.7, 2.2, 5.0, 10, 8); sphere(.28, mat(0xff2a2a, { emissive: 0xff2a2a, emissiveIntensity: 1.5 }), g, s * 1.8, 2.2, -5.0, 10, 8); }
  box(4.6, .5, .4, mat(0xc8c8c8, { metalness: .7 }), .1, g, 0, 1.2, 5.1); box(4.6, .5, .4, mat(0xc8c8c8, { metalness: .7 }), .1, g, 0, 1.2, -5.1);
  for (let k = 0; k < 10; k++) box(.4, .4, .08, mat(k % 2 ? 0x1a1a1a : 0xffffff), 0, g, -2 + (k % 5) * .4 + (k > 4 ? .2 : 0), 2.4 + (k > 4 ? .4 : 0), 0).position.x += 0;   // cuadros
  g.userData.seats = [[-1, 3.0, .4], [1, 3.0, .4], [-1, 3.0, -2], [1, 3.0, -2]]; return shade(g); }
export function tractor(parent) { const g = new THREE.Group(); parent.add(g); const gr = mat(0x2a9a3a, { roughness: .4, metalness: .1 }), dk = mat(0x1a1a1e), yl = mat(0xf2c23a, { roughness: .4 });
  box(4, 3, 7, gr, .5, g, 0, 3.6, 2.4); box(4.4, 1, 4, gr, .2, g, 0, 2.4, -2.6); for (const s of [-1, 1]) { const w = cyl(2.8, 2.8, 1.4, dk, 24, g, s * 3, 2.8, -2.6); w.rotation.z = Math.PI / 2; const r = cyl(1.4, 1.4, 1.45, yl, 16, g, s * 3, 2.8, -2.6); r.rotation.z = Math.PI / 2; const f = cyl(1.5, 1.5, 1.0, dk, 18, g, s * 2.4, 1.5, 4.6); f.rotation.z = Math.PI / 2; const fr = cyl(.7, .7, 1.05, yl, 12, g, s * 2.4, 1.5, 4.6); fr.rotation.z = Math.PI / 2; }
  for (const s of [-1, 1]) for (const z of [-4.6, -.8]) cyl(.12, .12, 5.4, dk, 6, g, s * 1.9, 6.4, z); box(4.6, .3, 4.6, gr, .1, g, 0, 9.1, -2.7); box(.08, 3.4, 3.4, glass(), .05, g, 0, 6.6, -.8).rotation.y = Math.PI / 2;
  cyl(.25, .25, 3, dk, 8, g, 1.2, 6.3, 4.4); box(3.6, 2, .3, gr, .2, g, 0, 3.6, 5.95); for (let k = 0; k < 5; k++) box(3.2, .14, .1, dk, 0, g, 0, 2.9 + k * .32, 6.1);
  box(3.8, .4, 3.4, mat(0x6a4a30, { roughness: .9 }), .05, g, 0, 5.2, -2.6); g.userData.deck = new THREE.Vector3(0, 5.4, -2.6); return shade(g); }
export function fireTruck(parent) { const g = new THREE.Group(); parent.add(g); const r = mat(0xd8202a, { roughness: .3, metalness: .2 }), wh = mat(0xf4f4f4), dk = mat(0x1a1a1e);
  box(6.4, 6, 24, r, .6, g, 0, 4.2, 0); box(6.2, 3, 6, r, .6, g, 0, 8, 8.4); box(5.6, 2.2, .1, glass(), .1, g, 0, 7.8, 11.42); box(6.5, .6, 24.1, wh, .1, g, 0, 2.4, 0);
  for (const s of [-1, 1]) for (const z of [-7, 0, 8]) { const w = cyl(1.4, 1.4, 1, mat(0x161618), 16, g, s * 3, 1.4, z); w.rotation.z = Math.PI / 2; }
  const lad = new THREE.Group(); lad.position.set(0, 7.6, -8); g.add(lad); for (const s of [-1, 1]) box(.3, .3, 22, mat(0xd8dce4, { metalness: .8, roughness: .2 }), .05, lad, s * 1.1, 0, 10); for (let k = 0; k < 20; k++) box(2.2, .15, .15, mat(0xd8dce4, { metalness: .8 }), 0, lad, 0, 0, 1 + k * 1.05);
  for (const s of [-1, 1]) sphere(.45, mat(0x3a7aff, { emissive: 0x3a7aff, emissiveIntensity: 2 }), g, s * 2, 9.8, 9, 10, 8);
  const lb = label(9, 1.2, 'FEUERWEHR', '#d8202a', '#ffffff', 60, .4); lb.position.set(3.25, 4.6, 0); lb.rotation.y = Math.PI / 2; g.add(lb); const lb2 = lb.clone(); lb2.position.x = -3.25; lb2.rotation.y = -Math.PI / 2; g.add(lb2);
  g.userData = { ladder: lad, sirens: g.children.filter(m => m.material && m.material.emissive && m.material.emissive.b > .9) }; return shade(g); }

// ---------- Hufenbach ----------
export function hufenbach(scene) { const G = new THREE.Group(); scene.add(G);
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), mat(0xffffff, { roughness: 1, map: rep(noiseTex('#5cc24a', ['#4aae3a', '#6cd45a', '#7ad868'], 2400, 3, 1), 120, 120) })); grass.rotation.x = -Math.PI / 2; grass.position.set(0, -.02, 0); grass.receiveShadow = true; G.add(grass);
  const ct = cobbleTex(); ct.repeat.set(26, 40); const plz = new THREE.Mesh(new THREE.PlaneGeometry(112, 180), mat(0xffffff, { roughness: .85, map: ct })); plz.rotation.x = -Math.PI / 2; plz.position.set(-6, .03, -10); plz.receiveShadow = true; G.add(plz);
  const asph = rep(noiseTex('#4a4e5a', ['#40444e', '#565a66'], 2000, 2, 1), 2, 60); const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 640), mat(0xffffff, { roughness: .9, map: asph })); road.rotation.x = -Math.PI / 2; road.position.set(26, .05, 200); road.receiveShadow = true; G.add(road);
  for (let z = -70; z < 520; z += 8) box(.3, .04, 4, mat(0xffffff), 0, G, 26, .08, z); for (const s of [-1, 1]) box(1.2, .4, 640, mat(0xd8d4cc), .05, G, 26 + s * 7.6, .2, 200);
  // colinas verdes al fondo
  const hm = [mat(0x4cb63e, { roughness: 1 }), mat(0x5cc84a, { roughness: 1 }), mat(0x3aa036, { roughness: 1 })]; [[-260, -420, 160], [60, -480, 200], [320, -380, 150], [-420, 120, 180], [420, 160, 200], [120, 620, 240], [-200, 560, 190]].forEach(([x, z, r], i) => { const h = sphere(r, hm[i % 3], G, x, -r * .55, z, 32, 16); h.receiveShadow = true; h.castShadow = false; });
  // Rathaus (norte) con reloj y bandera
  rathaus(G, -92); const RH = G.children[G.children.length - 1]; RH.scale.setScalar(.85); RH.position.x = -6; const clock = { pos: new THREE.Vector3(-6, 30 * .85, -92 + 7.4 * .85) };
  // tablón de la clasificación de gansos (delante del Rathaus)
  const RANK = new THREE.Group(); RANK.position.set(8, 0, -58); RANK.rotation.y = -.25; G.add(RANK); for (const s of [-1, 1]) cyl(.18, .18, 9, mat(0x5a3a22), 8, RANK, s * 4, 4.5, 0);
  const rk = textPlane(9, 6.4, 540, 384, (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8a050'; c.lineWidth = 14; c.strokeRect(7, 7, w - 14, h - 14); txt(c, 'GÄNSE-RANGLISTE', w / 2, 52, 44, '#ffd23f');
    [['1.', 'Bürgermeister Brandt', '548'], ['2.', 'ICH', '312'], ['3.', 'Jonas', '97'], ['4.', 'Herr Kurz', '41']].forEach(([n, a, b], i) => { const y = 120 + i * 66; c.font = `700 ${i === 1 ? 40 : 34}px ${FONT}`; c.textAlign = 'left'; c.fillStyle = i === 1 ? '#ffd23f' : '#ffffff'; c.fillText(n + ' ' + a, 40, y); c.textAlign = 'right'; c.fillText(b, w - 40, y); if (i === 1) { c.strokeStyle = '#ff5a4a'; c.lineWidth = 5; c.strokeRect(26, y - 34, w - 52, 50); } }); }); rk.position.set(0, 6, .2); RANK.add(rk); shade(RANK);
  // filas de casas: oeste (mira a +x) y este (mira a -x)
  let ci = 0; const W = [];
  for (let z = 70; z > -80; ) { const wid = 15 + (ci * 7) % 6; if (Math.abs(z - wid / 2 - (-28)) < 14) { z -= 28; continue; } const shop = Math.abs(z - wid / 2 - 12) < 8 ? 'BÄCKEREI SONNE' : null; W.push(townhouse(G, -64, z - wid / 2, wid, 2 + ci % 3, ci, Math.PI / 2, { shop })); z -= wid + .4; ci++; }
  for (let z = 60; z > -80; ) { const wid = 15 + (ci * 5) % 6; const shop = Math.abs(z - wid / 2 + 22) < 9 ? 'CAFÉ AM MARKT' : null; townhouse(G, 52, z - wid / 2, wid, 2 + ci % 3, ci, -Math.PI / 2, { shop, bg: '#5a2a3a', fg: '#ffe0b0' }); z -= wid + .4; ci++; }
  // cine «Lichtspiele» (oeste, z = -28): fachada art déco, marquesina con bombillas, cartel y taquilla
  const KINO = new THREE.Group(); KINO.position.set(-64, 0, -28); KINO.rotation.y = Math.PI / 2; G.add(KINO); const kc = mat(0x2a2a6a, { roughness: .5 }), kg = mat(0xe9c23a, { metalness: .8, roughness: .25, emissive: 0x5a4000, emissiveIntensity: .3 });
  box(26, 30, 18, kc, .2, KINO, 0, 15, 0); box(27, 1.2, 19, kg, .1, KINO, 0, 30.4, 0); for (const s of [-1, 1]) box(2, 30, 1, mat(0xd8323a, { roughness: .4 }), .1, KINO, s * 12, 15, 9.2);
  const kn = textPlane(18, 5, 720, 200, (c, w, h) => { c.shadowColor = '#ffd23f'; c.shadowBlur = 24; txt(c, 'LICHTSPIELE', w / 2, h / 2 + 6, 130, '#fff3a8'); }, 1.6); kn.position.set(0, 24.5, 9.3); KINO.add(kn);
  const mq = box(24, 2.8, 5, mat(0x1a1a3a), .2, KINO, 0, 15.5, 11); for (let k = 0; k < 22; k++) for (const y of [14.2, 16.8]) sphere(.22, mat(0xfff4c0, { emissive: 0xffd88a, emissiveIntensity: 2.2 }), KINO, -10.5 + k, y, 13.55, 8, 6);
  const mt = textPlane(20, 2, 800, 80, (c, w, h) => { c.fillStyle = '#fff8e8'; c.fillRect(0, 0, w, h); txt(c, 'HEUTE: VOM WINDE VERGANST', w / 2, h / 2 + 3, 54, '#1a1a3a'); }, .5); mt.position.set(0, 15.5, 13.56); KINO.add(mt);
  const poster = (x, t1, col) => { const p = textPlane(5, 7.4, 250, 370, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, col); gr.addColorStop(1, '#1a1a2a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(w / 2, h * .55, 60, 46, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(w / 2 + 40, h * .36, 20, 30, .3, 0, 7); c.fill(); c.fillStyle = '#ff8a1e'; c.beginPath(); c.moveTo(w / 2 + 55, h * .33); c.lineTo(w / 2 + 85, h * .35); c.lineTo(w / 2 + 55, h * .38); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(w / 2 + 44, h * .33, 4, 0, 7); c.fill(); txt(c, t1, w / 2, h * .85, 30, '#ffd23f'); }); p.position.set(x, 6.4, 9.1); KINO.add(p); };
  poster(-8.4, 'VOM WINDE', '#d8323a'); poster(8.4, 'GANS ALLEIN', '#2a8ad8'); box(6, 8, .3, mat(0x3a1a14), .1, KINO, 0, 4, 9.1); box(26, 3, .3, kg, .05, KINO, 0, 11.4, 9.2);
  // taquilla
  const BOX = new THREE.Group(); BOX.position.set(-50, 0, -28); BOX.rotation.y = Math.PI / 2; G.add(BOX); const bxr = mat(0xd8323a, { roughness: .4 }); box(7, 7.6, .4, bxr, .1, BOX, 0, 3.8, -2.3); for (const sx of [-1, 1]) box(.4, 7.6, 5, bxr, .1, BOX, sx * 3.3, 3.8, 0); box(7, 2.9, .4, bxr, .1, BOX, 0, 1.45, 2.3); box(7, 1.4, .4, bxr, .1, BOX, 0, 6.9, 2.3); box(7.4, 1, 5.4, kg, .1, BOX, 0, 8, 0); box(6.4, .3, 1.6, mat(0xf4f4f4), .05, BOX, 0, 3.0, 2.6);
  const tl = textPlane(6, 1.4, 360, 84, (c, w, h) => { c.fillStyle = '#fff3a8'; c.fillRect(0, 0, w, h); txt(c, 'KASSE', w / 2, h / 2 + 3, 58, '#d8323a'); }, .6); tl.position.set(0, 7, 2.52); BOX.add(tl);
  const PRICE = new THREE.Group(); PRICE.position.set(-50, 0, -19.5); PRICE.rotation.y = Math.PI / 2 + .25; G.add(PRICE); for (const s of [-1, 1]) { const l = box(.3, 7, .3, mat(0x6b4a2e), 0, PRICE, s * 2.4, 3.4, 0); l.rotation.x = .12; }
  const pr = textPlane(5.2, 6, 312, 360, (c, w, h) => { c.fillStyle = '#6b4a2e'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e2a24'; c.fillRect(12, 12, w - 24, h - 24); txt(c, 'EINTRITT', w / 2, 60, 40, '#ffffff'); txt(c, 'Erwachsene  9 €', w / 2, 130, 34, '#ffffff');
    txt(c, 'Gans  4,50 €', w / 2, 200, 40, '#ffd23f'); c.strokeStyle = '#ff5a4a'; c.lineWidth = 6; c.beginPath(); c.ellipse(w / 2, 200, 130, 34, 0, 0, 7); c.stroke(); txt(c, '½ PREIS!', w / 2, 290, 52, '#ff7a5a'); }); pr.position.set(0, 4.6, .22); pr.rotation.x = -.12; PRICE.add(pr); shade(KINO); shade(BOX); shade(PRICE);
  // café: mesas con sombrilla en la plaza (este)
  const CAFE = new THREE.Group(); CAFE.position.set(36, 0, -40); G.add(CAFE); const tables = [];
  for (const [x, z] of [[0, 0], [0, 12], [-4, 24]]) { const t = new THREE.Group(); t.position.set(x, 0, z); CAFE.add(t); cyl(1.9, 1.9, .2, mat(0xf4f4f4, { roughness: .3 }), 24, t, 0, 3.0, 0); cyl(.16, .16, 3, mat(0x2a2a2a, { metalness: .6 }), 8, t, 0, 1.5, 0); cyl(.8, .8, .1, mat(0x2a2a2a), 12, t, 0, .05, 0);
    cyl(.1, .1, 12, mat(0xd8d8d8), 6, t, 0, 6, 0); const um = new THREE.Mesh(new THREE.ConeGeometry(5.5, 1.8, 10), mat(0xffffff, { map: stripes('#d8323a', '#ffffff', 10) })); um.position.y = 12; t.add(um);
    cyl(.5, .4, .7, mat(0xffffff), 12, t, .6, 3.45, .3); cyl(.4, .35, .5, mat(0xffffff), 12, t, -.6, 3.35, -.4); const cake = cyl(.5, .5, .4, mat(0xf2c8a0), 14, t, -.6, 3.3, .6); sphere(.15, mat(0xd8323a), t, -.6, 3.6, .6, 8, 6); tables.push(t); }
  shade(CAFE);
  // fuente, árboles, bancos, farolas, maceteros
  fountain(G, -18, -24); const FTN = G.children[G.children.length - 1]; FTN.scale.setScalar(.8); for (const [x, z] of [[-42, 40], [-42, -6], [-42, -60], [36, 30], [40, 10], [-20, 50]]) tree(G, x, z, .95);
  bench(G, -36, 20, Math.PI / 2); bench(G, -36, -50, Math.PI / 2); bench(G, 14, 30, Math.PI); for (const [x, z] of [[-30, 40], [-30, 0], [-30, -40], [18, 20], [18, -20], [18, -60], [34, 60]]) lantern(G, x, z);
  for (const [x, z] of [[-26, 30], [-26, -10], [10, -40], [10, 10]]) { box(3, 1.6, 3, mat(0x9a7a5a, { roughness: .9 }), .2, G, x, .8, z); for (let k = 0; k < 6; k++) sphere(.55, mat([0xe8323a, 0xffd23f, 0xff8ad0][k % 3]), G, x - 1 + (k % 3), 2, z - .5 + Math.floor(k / 3), 8, 6); }
  // parada de bus (lado este de la carretera, z = 6)
  const STOP = new THREE.Group(); STOP.position.set(36, 0, 6); G.add(STOP); const met = mat(0x3a4250, { metalness: .6, roughness: .4 });
  for (const z of [-4, 4]) cyl(.15, .15, 7, met, 8, STOP, 1.4, 3.5, z); box(4.2, .3, 10, mat(0x2a3240), .05, STOP, .6, 7.1, 0); box(.15, 5, 9.6, glass(), .03, STOP, 2.6, 3.8, 0); box(1.6, .3, 6, mat(0x8a5a32), .05, STOP, 1.8, 2, 0);
  cyl(.12, .12, 8, met, 8, STOP, -1.6, 4, 6); const hs = textPlane(1.8, 1.8, 128, 128, (c, w, h) => { c.fillStyle = '#f2c23a'; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.fillStyle = '#1a6a3a'; c.beginPath(); c.arc(64, 64, 50, 0, 7); c.fill(); txt(c, 'H', 64, 68, 80, '#f2c23a'); }); hs.position.set(-1.6, 8.2, 6.12); hs.rotation.y = -Math.PI / 2; STOP.add(hs); const hs2 = hs.clone(); hs2.rotation.y = Math.PI / 2; hs2.position.x = -1.72; STOP.add(hs2); shade(STOP);
  // carretera de salida: cartel del pueblo (z = 260) y campos
  const TS = new THREE.Group(); TS.position.set(36, 0, 262); TS.rotation.y = -.4; G.add(TS); for (const x of [-2.6, 2.6]) cyl(.12, .12, 6, met, 8, TS, x, 3, 0);
  const ts = textPlane(6.6, 2.6, 400, 158, (c, w, h) => { c.fillStyle = '#f2c23a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#111'; c.lineWidth = 8; c.strokeRect(10, 10, w - 20, h - 20); txt(c, 'Hufenbach', w / 2, h * .42, 70, '#111'); txt(c, 'Landkreis Gänsewiese', w / 2, h * .74, 26, '#111'); }); ts.position.set(0, 5.4, .1); TS.add(ts); const tsb = textPlane(6.6, 2.6, 400, 158, (c, w, h) => { c.fillStyle = '#f2c23a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#111'; c.lineWidth = 8; c.strokeRect(10, 10, w - 20, h - 20); txt(c, 'Hufenbach', w / 2, h * .42, 70, '#111'); c.strokeStyle = '#d8323a'; c.lineWidth = 12; c.beginPath(); c.moveTo(20, h - 20); c.lineTo(w - 20, 20); c.stroke(); }); tsb.position.set(0, 5.4, -.1); tsb.rotation.y = Math.PI; TS.add(tsb);
  for (let z = 120; z < 520; z += 22) for (const s of [-1, 1]) tree(G, 26 + s * (20 + (z % 3) * 6), z, .8 + (z % 4) * .1);
  for (let z = 110; z < 520; z += 4) for (const s of [-1, 1]) box(.25, 1.6, .25, mat(0xf4f4f4), .03, G, 26 + s * 11, .8, z); for (const s of [-1, 1]) box(.15, .2, 410, mat(0xf4f4f4), 0, G, 26 + s * 11, 1.3, 315);
  // casa de la familia (sur-oeste, mira a +x hacia la carretera): ventana grande con cortinas rojas y salón detrás
  const HAUS = new THREE.Group(); HAUS.position.set(4, 0, 96); HAUS.rotation.y = Math.PI / 2; G.add(HAUS); const hw = mat(0xf6e6b8, { roughness: .8 }), tr = mat(0xffffff);
  // pared frontal en piezas alrededor de la ventana (x -7..-1, y 2.5..7.5) y la puerta (x 3..6.4)
  box(4.6, 18, .8, hw, 0, HAUS, -9.7, 9, 7); box(3.6, 18, .8, hw, 0, HAUS, 1.2, 9, 7); box(5.6, 18, .8, hw, 0, HAUS, 9.2, 9, 7); box(6.8, 2, .8, hw, 0, HAUS, -4, 1, 7); box(6.8, 7.4, .8, hw, 0, HAUS, -4, 14.3, 7); box(3.4, 12.6, .8, hw, 0, HAUS, 4.7, 11.7, 7);
  box(24, 18, 10.7, hw, 0, HAUS, 0, 9, -4.05); for (const x of [-12, 12]) box(.8, 18, 6.2, hw, 0, HAUS, x, 9, 4.2); box(24, .6, 6.2, hw, 0, HAUS, 0, 17.7, 4.2);
  const DOOR = new THREE.Group(); DOOR.position.set(3, 0, 7.1); HAUS.add(DOOR); box(3.4, 5.4, .3, mat(0x2a6a4a, { roughness: .4 }), .06, DOOR, 1.7, 2.7, 0); sphere(.18, mat(0xd9a531, { metalness: .8 }), DOOR, 3, 2.7, .3); box(.6, .8, .08, mat(0xd9a531, { metalness: .7 }), .02, DOOR, 1.7, 4.2, .2);
  box(4.4, .3, 1, tr, .05, HAUS, 4.7, 5.6, 7.6); box(5, .4, 3, mat(0xb8b0a4), .05, HAUS, 4.7, .2, 8.8);
  const mat_ = textPlane(3.4, 2, 204, 120, (c, w, h) => { c.fillStyle = '#8a5a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#5a3a1a'; c.lineWidth = 6; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'WILLKOMMEN', w / 2, h / 2 + 4, 30, '#f2e2c0'); }); mat_.rotation.x = -Math.PI / 2; mat_.position.set(4.7, .42, 9.4); HAUS.add(mat_);
  // ventana: marco, alféizar con flores, salón detrás (pared con papel pintado, lámpara, cuadro)
  for (const [w, h, x, y] of [[6.8, .5, -4, 10.6], [6.8, .5, -4, 2], [.5, 8.8, -7.2, 6.3], [.5, 8.8, -.8, 6.3]]) box(w, h, 1, tr, .05, HAUS, x, y, 7.2);
  box(7, .5, 1.6, tr, .05, HAUS, -4, 1.8, 7.7); box(6, .7, 1, mat(0x8a5a30), .05, HAUS, -4, 2.3, 8.1); for (let k = 0; k < 7; k++) sphere(.4, mat([0xff4a6a, 0xffd23f, 0xff8ad0, 0xffffff][k % 4]), HAUS, -6.6 + k * .85, 2.9, 8.1, 8, 6);
  const room = mat(0xffffff, { map: rep(stripes('#e8d8b0', '#dcc89a', 12), 2, 1), roughness: .9 }); box(10, 12, .3, room, 0, HAUS, -4, 7, 1.5); box(.3, 12, 6, room, 0, HAUS, -9, 7, 4.4); box(.3, 12, 6, room, 0, HAUS, .8, 7, 4.4); box(10, .3, 6, mat(0xf4f0e8), 0, HAUS, -4, 12.6, 4.4); box(10, .3, 6, mat(0xffffff, { map: rep(noiseTex('#a8743e', ['#94622e', '#b8844e'], 600, 3), 2, 2) }), 0, HAUS, -4, 1.4, 4.4);
  const pic = textPlane(2.4, 1.8, 120, 90, (c, w, h) => { c.fillStyle = '#c8a050'; c.fillRect(0, 0, w, h); c.fillStyle = '#9fd2f2'; c.fillRect(8, 8, w - 16, h - 16); c.fillStyle = '#5cc24a'; c.fillRect(8, h * .6, w - 16, h * .4 - 8); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(w * .6, h * .62, 14, 9, 0, 0, 7); c.fill(); }); pic.position.set(-6.4, 9.6, 1.7); HAUS.add(pic);
  const HL = new THREE.PointLight(0xffd8a0, 30, 16, 1.6); HL.position.set(-4, 11, 4.5); HAUS.add(HL);
  const CURT = [-1, 1].map(s => { const c = new THREE.Group(); HAUS.add(c); const cm = mat(0xc81e2a, { roughness: .95, map: rep(stripes('#c81e2a', '#a8141e', 8), 1, 1) }); for (let k = 0; k < 4; k++) box(.9, 8.4, .25, cm, .1, c, k * .78 * -s, 0, (k % 2) * .12); c.position.set(s < 0 ? -6.6 : -1.4, 6.3, 6.5); c.userData.s = s; return c; });
  box(7, .2, .2, mat(0x8a6a3a, { metalness: .5 }), .05, HAUS, -4, 10.6, 6.5);
  // tejado, ventanas de arriba, chimenea, valla y jardín
  const hr = new THREE.Mesh(new THREE.CylinderGeometry(.01, 17.5, 9, 4, 1, false, Math.PI / 4), mat(0xffffff, { map: rep(roofTex(), 5, 2), roughness: .6 })); hr.scale.set(1, 1, .82); hr.position.set(0, 22.5, 0); HAUS.add(hr); box(1.8, 6, 1.8, mat(0x9a4a3a), .1, HAUS, 6, 24, -3);
  for (const x of [-6, 6]) { box(3.4, 3.4, .3, glass(), .05, HAUS, x, 13.5, 7.45); box(4, .4, .8, tr, .05, HAUS, x, 11.6, 7.6); for (const s of [-1, 1]) box(.7, 3.6, .14, mat(0x2a6a4a), .03, HAUS, x + s * 2.2, 13.5, 7.5); }
  for (let k = -14; k <= 14; k++) { if (Math.abs(k * 1.1 - 4.7) < 2.4) continue; box(.3, 1.8, .2, tr, .05, HAUS, k * 1.1, .9, 17); } box(31, .2, .15, tr, .02, HAUS, 0, 1.3, 17); box(3.2, .1, 10, mat(0xc8beb4), .02, HAUS, 4.7, .05, 12);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(32, 12), mat(0xffffff, { map: noiseTex('#5fcf4a', ['#4fb83c', '#6cd858'], 900, 2, 3) })); lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, .06, 12); lawn.receiveShadow = true; HAUS.add(lawn); shade(HAUS); HAUS.traverse(o => { if (o.isMesh && o.material === room) o.castShadow = false; });
  // bloque de Lena (este, z = 100, mira a -x): ladrillo, 5 alturas, escalera acristalada con peldaños dentro
  const BLOCK = new THREE.Group(); BLOCK.position.set(54, 0, 104); BLOCK.rotation.y = -Math.PI / 2; G.add(BLOCK); const bm = mat(0xffffff, { map: rep(brickTex(), 4, 8), roughness: .9 });
  box(30, 52, 18, bm, 0, BLOCK, 4, 26, -2); box(31, 1.2, 19, mat(0xd8d0c4), .1, BLOCK, 4, 52.6, -2);
  for (let f = 0; f < 5; f++) for (const x of [-4, 4, 12]) { box(4, 5, .3, glass(), .05, BLOCK, x, 4.6 + f * 10, 7.1); box(4.6, .4, .8, mat(0xe8e0d4), .05, BLOCK, x, 1.9 + f * 10, 7.3); if (f > 0 && x === 12) { box(5, .3, 2.4, mat(0xd8d0c4), .05, BLOCK, x, f * 10 + 1.6, 8.4); for (let k = 0; k < 9; k++) box(.12, 2.2, .12, mat(0x2a2a2a, { metalness: .6 }), 0, BLOCK, x - 2.4 + k * .6, f * 10 + 2.8, 9.5); } }
  const sw = mat(0xbfe6ff, { transparent: true, opacity: .32, roughness: .05, metalness: .2, depthWrite: false }); const TW = new THREE.Group(); TW.position.set(-15, 0, 4); BLOCK.add(TW); box(10, 52, 10, sw, 0, TW, 0, 26, 0).castShadow = false;
  for (let f = 0; f <= 5; f++) box(10.4, .5, 10.4, mat(0x6a6e78, { metalness: .4 }), .05, TW, 0, f * 10 + .2, 0); for (const [x, z] of [[-5, -5], [5, -5], [-5, 5], [5, 5]]) box(.4, 52, .4, mat(0x3a3e48, { metalness: .6 }), .05, TW, x, 26, z);
  for (let f = 0; f < 5; f++) for (let k = 0; k < 8; k++) { const up = f % 2 ? -1 : 1; box(3.6, .5, 1.2, mat(0xd8d0c4), .05, TW, 2, f * 10 + 1 + k * 1.15, up * (-3.6 + k * 1.1)); }
  const nr = textPlane(2.4, 1.8, 120, 90, (c, w, h) => { c.fillStyle = '#2a4a8a'; c.fillRect(0, 0, w, h); txt(c, '4', w / 2, h / 2 + 4, 70, '#fff'); }); nr.position.set(-9.8, 6, 9.2); BLOCK.add(nr); box(5, 6, .3, mat(0x5a3220), .05, BLOCK, -15, 3, 9.2);
  const ka = sign(5, 1.2, 'KEIN AUFZUG', '#ffffff', '#d8323a', 50); ka.position.set(-20.4, 6, 2); ka.rotation.y = -Math.PI / 2; BLOCK.add(ka); shade(BLOCK);
  // balcón de Lena (4.º, x = 12): globos
  const BAL = []; for (let k = 0; k < 5; k++) { const b = sphere(.8, mat([0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][k], { roughness: .2 }), BLOCK, 10 + k * .9, 45 + (k % 2) * 1.2, 9.6, 14, 10); b.scale.y = 1.2; BAL.push(b); }
  return { G, W, RANK, KINO, BOX, PRICE, CAFE, tables, STOP, TS, HAUS, DOOR, CURT, HL, BLOCK, TW, clock, RH }; }

// ---------- interiores ----------
const room = (scene, X, w, d, h, wall, floor) => { const g = new THREE.Group(); g.position.x = X; scene.add(g); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(0xf4f0e8), 0, g, 0, h, 0); return g; };
export function screenTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const S = { c, t, draw(f) { f(c.getContext('2d'), w, h); t.needsUpdate = true; } }; if (draw) S.draw(draw); return S; }
// pantalla: contenido «normal» (colores borrosos) o bloqueada (candado y CORN GESPERRT)
export function drawScreen(c, w, h, locked, k = 1) { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#3a4ad8'); g.addColorStop(1, '#d83a9a'); c.fillStyle = g; c.fillRect(0, 0, w, h); const r = RNG(3); for (let i = 0; i < 9; i++) { c.fillStyle = `hsla(${r() * 360},80%,70%,.5)`; c.beginPath(); c.roundRect(r() * w * .8, r() * h * .8, w * .25, h * .18, 10); c.fill(); }
  if (!locked) return; c.fillStyle = `rgba(8,10,24,${.92 * k})`; c.fillRect(0, 0, w, h); c.save(); c.globalAlpha = k; const s = Math.min(w, h) / 300; c.translate(w / 2, h * .42); c.scale(s, s); c.lineWidth = 16; c.strokeStyle = '#e8eef8'; c.beginPath(); c.arc(0, -30, 44, Math.PI, 0); c.stroke(); c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(-70, -30, 140, 110, 18); c.fill(); c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(0, 15, 14, 0, 7); c.fill(); c.fillRect(-6, 15, 12, 35); c.restore();
  c.globalAlpha = k; c.font = `700 ${Math.round(h * .085)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ff5a4a'; c.fillText('CORN GESPERRT', w / 2, h * .8); c.globalAlpha = 1; }
export function zimmer(scene, X) { const wall = mat(0xffffff, { map: rep(stripes('#5a72b8', '#526aae', 10), 3, 1), roughness: .9 }), floor = mat(0xffffff, { map: rep(noiseTex('#8a6a4a', ['#7a5a3a', '#9a7a5a'], 900, 3), 4, 4), roughness: .8 });
  const g = room(scene, X, 44, 30, 16, wall, floor);
  // ventana de noche con luna
  const win = textPlane(7, 6, 210, 180, (c, w, h) => { c.fillStyle = '#0a1230'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff6d0'; c.beginPath(); c.arc(150, 50, 22, 0, 7); c.fill(); for (let i = 0; i < 30; i++) { c.fillStyle = '#fff'; c.fillRect((i * 53) % w, (i * 37) % h * .6, 2, 2); } c.fillStyle = '#ffffff'; c.fillRect(w / 2 - 3, 0, 6, h); c.fillRect(0, h / 2 - 3, w, 6); }, .6); win.position.set(-12, 9, -14.7); g.add(win);
  // escritorio con portátil y móvil, silla, cama, póster, lámpara de pie
  box(12, .5, 5, mat(0xd8b88a, { roughness: .6 }), .1, g, -6, 4.6, -10.5); for (const s of [-1, 1]) box(.5, 4.4, 4.6, mat(0xd8b88a), .05, g, -6 + s * 5.5, 2.2, -10.5);
  const LAP = new THREE.Group(); LAP.position.set(-4.6, 4.85, -10.6); g.add(LAP); box(3.4, .18, 2.4, mat(0x9aa0aa, { metalness: .7, roughness: .3 }), .06, LAP, 0, 0, 0); const lid = new THREE.Group(); lid.position.set(0, .05, -1.15); LAP.add(lid); lid.rotation.x = -.22; box(3.4, 2.3, .12, mat(0x9aa0aa, { metalness: .7, roughness: .3 }), .06, lid, 0, 1.15, 0);
  const lapS = screenTex(320, 200, (c, w, h) => drawScreen(c, w, h, false)); const ls = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.95), new THREE.MeshBasicMaterial({ map: lapS.t, toneMapped: false })); ls.position.set(0, 1.15, .07); lid.add(ls);
  const PH = new THREE.Group(); PH.position.set(-8.6, 4.9, -9.6); PH.rotation.x = -Math.PI / 2 + .25; g.add(PH); box(1, 1.9, .12, mat(0x1a1a22, { metalness: .6 }), .08, PH, 0, 0, 0); const phS = screenTex(120, 230, (c, w, h) => drawScreen(c, w, h, false)); const ps = new THREE.Mesh(new THREE.PlaneGeometry(.88, 1.72), new THREE.MeshBasicMaterial({ map: phS.t, toneMapped: false })); ps.position.z = .07; PH.add(ps);
  const chair = new THREE.Group(); chair.position.set(-6, 0, -6.6); g.add(chair); box(3, .4, 3, mat(0x2a2a30), .15, chair, 0, 3.0, 0); box(3, 3.4, .4, mat(0x2a2a30), .15, chair, 0, 4.9, 1.4); cyl(.2, .2, 2.8, mat(0x6a6a72, { metalness: .7 }), 8, chair, 0, 1.4, 0);
  box(11, 2.4, 16, mat(0xffffff, { map: rep(stripes('#f2c23a', '#e8b02a', 8), 1, 2) }), .4, g, 14, 1.8, -5); box(11, 3.6, 1, mat(0x6a4a30), .1, g, 14, 2.6, -13); box(4, 1, 3, mat(0xf4f4f4), .4, g, 14, 3.4, -10.4);
  const post = textPlane(5, 7, 200, 280, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ff5a85'); gr.addColorStop(1, '#3a2a8a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); txt(c, 'TECHNO', w / 2, h * .2, 44, '#fff'); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h * .55, 50, 0, 7); c.fill(); txt(c, 'BERLIN', w / 2, h * .88, 30, '#fff'); }); post.position.set(6, 10, -14.7); g.add(post);
  // tele sobre mueble bajo
  box(9, 2.6, 3.4, mat(0x2a2a30, { roughness: .4 }), .1, g, 4, 1.3, 12.6); const TV = new THREE.Group(); TV.position.set(4, 6.4, 12.9); TV.rotation.y = Math.PI; g.add(TV); box(9.6, 5.6, .4, mat(0x111114, { metalness: .5, roughness: .3 }), .1, TV, 0, 0, 0); const tvS = screenTex(400, 230, (c, w, h) => drawScreen(c, w, h, false)); const tvm = new THREE.Mesh(new THREE.PlaneGeometry(9.1, 5.1), new THREE.MeshBasicMaterial({ map: tvS.t, toneMapped: false })); tvm.position.z = .21; TV.add(tvm); box(1.6, 1.6, 1.6, mat(0x111114), .1, TV, 0, -3.2, .4);
  // cocina (derecha): encimera, nevera inteligente con pantalla, armarios
  box(.4, 16, 12, wall, 0, g, 9, 8, 9); box(12, 4.6, 4, mat(0xf4f4f4, { roughness: .4 }), .1, g, 15.6, 2.3, 12.6); box(12, .4, 4.2, mat(0x2a2a30, { roughness: .3 }), .05, g, 15.6, 4.8, 12.6);
  const FR = new THREE.Group(); FR.position.set(19.6, 0, 6); FR.rotation.y = -Math.PI / 2; g.add(FR); box(5, 13, 4.4, mat(0xd8dce4, { metalness: .7, roughness: .25 }), .3, FR, 0, 6.5, 0); box(.1, 12.4, .1, mat(0x111114), 0, FR, 0, 6.5, 2.22); for (const s of [-1, 1]) box(.25, 3.4, .4, mat(0x9aa0aa, { metalness: .8 }), .1, FR, s * .5, 7.4, 2.4);
  const frS = screenTex(180, 240, (c, w, h) => drawScreen(c, w, h, false)); const frm = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.4), new THREE.MeshBasicMaterial({ map: frS.t, toneMapped: false })); frm.position.set(-1.3, 8.6, 2.24); FR.add(frm); const mg = sphere(.2, mat(0xff5a85), FR, 1.4, 9.6, 2.3, 8, 6);
  const LMP = new THREE.PointLight(0xffd8a0, 120, 50, 1.4); LMP.position.set(-2, 14, 0); g.add(LMP); const DESK = new THREE.PointLight(0xa8c8ff, 0, 18, 1.5); DESK.position.set(-5, 7, -8); g.add(DESK);
  return { g: shade(g), LAP, lapS, PH, phS, TV, tvS, FR, frS, LMP, DESK }; }
export function baeckerei(scene, X) { const wall = mat(0xffffff, { map: rep(stripes('#fff0d8', '#f8e6c8', 10), 3, 1), roughness: .9 }), floor = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#e8e0d0'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8b8a0'; c.fillRect(0, 0, 32, 32); c.fillRect(32, 32, 32, 32); }, true), 8, 8) });
  const g = room(scene, X, 40, 30, 16, wall, floor);
  // mostrador con vitrina y pasteles, estanterías de pan, pretzels colgando, letrero
  box(26, 2.6, 4, mat(0xc8905a, { roughness: .6 }), .2, g, 0, 1.3, -2); box(26, 1.2, 3.4, mat(0xd8f0ff, { transparent: true, opacity: .22, roughness: .05, depthWrite: false }), .1, g, 0, 3.2, -2); box(26.2, .15, 3.6, mat(0xf4f4f4), .03, g, 0, 3.85, -2); box(30, .8, 8, mat(0xb8a890), .05, g, 0, .4, -8.6);
  for (let k = 0; k < 10; k++) { const x = -11 + k * 2.4; cyl(.6, .6, .5, mat([0xf2c8a0, 0x6a3a1a, 0xf4f4f4, 0xffb0c8][k % 4]), 16, g, x, 2.85, -2); sphere(.15, mat(0xd8323a), g, x, 3.2, -2, 8, 6); }
  for (const y of [5, 9, 13]) { box(30, .4, 3, mat(0x8a5a30), .05, g, 0, y, -13.5); for (let k = 0; k < 9; k++) { const b = sphere(1, mat([0xc0782e, 0xa8682a, 0xd8984a][k % 3], { roughness: .8 }), g, -13 + k * 3.3, y + .9, -13.4, 14, 10); b.scale.set(1.3, .65, .8); } }
  const pz = new THREE.TorusKnotGeometry(.55, .2, 48, 8, 2, 3); for (let k = 0; k < 6; k++) { const p = new THREE.Mesh(pz, mat(0x9a5a20, { roughness: .5 })); p.scale.set(1, .8, .5); p.position.set(-10 + k * 4, 13.6, -3); g.add(p); cyl(.03, .03, 2, mat(0xffffff), 4, g, -10 + k * 4, 15, -3); }
  const sg = textPlane(16, 2.6, 800, 130, (c, w, h) => { c.fillStyle = '#5a2a14'; c.beginPath(); c.roundRect(0, 0, w, h, 30); c.fill(); txt(c, 'BÄCKEREI SONNE', w / 2, h / 2 + 4, 76, '#ffd23f'); }, .5); sg.position.set(0, 18 * .8, -14.7); g.add(sg);
  const kasse = box(2, 1.4, 1.2, mat(0x2a2a2a), .1, g, 9, 4.6, -1.6);
  const L = new THREE.PointLight(0xffe0b0, 140, 50, 1.3); L.position.set(0, 14, 4); g.add(L); return { g: shade(g) }; }
// escalera interior: 4 pisos, tramos en zig-zag, rellanos con puertas numeradas; puerta de Lena (4.º) con globos y cartel
export let STAIRS = null;
export function treppe(scene, X) { const wall = mat(0xffffff, { map: rep(stripes('#e8e4d8', '#ddd8ca', 12), 2, 6), roughness: .9 }); const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const FH = 10, step = mat(0xc8beb0, { roughness: .7 }), rail = mat(0x6a3a1a, { roughness: .4 });
  box(.4, FH * 5 + 6, 24, wall, 0, g, -10, (FH * 5 + 6) / 2, 0); box(24, FH * 5 + 6, .4, wall, 0, g, 0, (FH * 5 + 6) / 2, -12);
  for (let f = 0; f <= 4; f++) { box(20, .5, 8, step, .05, g, 0, f * FH, -7.8); const doorM = mat([0x5a3220, 0x2a5a3a, 0x2a3a6a, 0x6a2a4a, 0xd8323a][f], { roughness: .4 });
    box(4.4, 7.6, .3, doorM, .06, g, -2, f * FH + 3.8, -11.7); sphere(.2, mat(0xd9a531, { metalness: .8 }), g, -.2, f * FH + 3.8, -11.4); const n = textPlane(1.4, 1.4, 64, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(32, 32, 30, 0, 7); c.fill(); txt(c, String(f), 32, 35, 40, '#1a2a4a'); }); n.position.set(3, f * FH + 7, -11.75); g.add(n);
  }
  // tramos: A sube hacia delante por la derecha (x = 5), rellano intermedio delante (z 5..11), B vuelve por la izquierda (x = -4.5)
  for (let f = 0; f < 4; f++) { const y0 = f * FH; for (let k = 0; k < 5; k++) { box(5, 1, 1.8, step, .05, g, 5, y0 + .5 + k, -2.9 + k * 1.8); box(5, 1, 1.8, step, .05, g, -4.5, y0 + 5.5 + k, 4.3 - k * 1.8); }
    box(19, .5, 6, step, .05, g, 0, y0 + 5, 8.2); for (const [x, z0, z1, y] of [[2.4, -3.8, 5.2, y0 + 4], [-1.9, 5.2, -3.8, y0 + 9]]) { const r = box(.25, .25, 10.4, rail, .1, g, x, y, (z0 + z1) / 2); r.rotation.x = (z1 > z0 ? -1 : 1) * Math.atan2(5, 9); for (let k = 0; k < 5; k++) box(.15, 3, .15, rail, .02, g, x, y - 1.6 + (z1 > z0 ? k : 4 - k) * 1 - 1.5 + .0, z0 + (z1 - z0) * (k + .5) / 5); } }
  STAIRS = { A: f => [5, f * FH, -3.8, 9 / 5], B: f => [-4.5, f * FH + 5, 5.2, -9 / 5] };
  // ventanas del hueco con vista al cielo
  for (let f = 0; f < 5; f++) { const w = textPlane(5, 6, 100, 120, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6ab8f0'); gr.addColorStop(1, '#bfe6ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#5cc24a'; c.fillRect(0, h * .8, w, h * .2); c.fillStyle = '#fff'; c.fillRect(w / 2 - 3, 0, 6, h); c.fillRect(0, h / 2 - 3, w, 6); }, .6); w.position.set(-9.75, f * FH + 6, 4); w.rotation.y = Math.PI / 2; g.add(w); }
  // puerta de Lena (4.º): globos, cartel «Lena 22 🎉», guirnalda
  const LD = new THREE.Group(); LD.position.set(-2, 4 * FH, -11.5); g.add(LD); for (let k = 0; k < 6; k++) { const b = sphere(.7, mat([0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a, 0xb86aff][k], { roughness: .2 }), LD, (k < 3 ? -3.4 : 3.4) + (k % 3) * .5 * (k < 3 ? -1 : 1), 7.6 + (k % 3) * .9, .6, 14, 10); b.scale.y = 1.2; }
  const gl = textPlane(6, 1.2, 360, 72, (c, w, h) => { for (let i = 0; i < 9; i++) { c.fillStyle = ['#ff4a8a', '#ffd23f', '#3ab8ff'][i % 3]; c.beginPath(); c.moveTo(i * 40, 0); c.lineTo(i * 40 + 40, 0); c.lineTo(i * 40 + 20, 60); c.fill(); } }); gl.position.set(0, 8.6, .3); LD.add(gl);
  const ls = textPlane(3, 1, 180, 60, (c, w, h) => { c.fillStyle = '#fff6e0'; c.beginPath(); c.roundRect(0, 0, w, h, 14); c.fill(); txt(c, 'Lena 🎉', w / 2, h / 2 + 3, 36, '#d8323a'); }); ls.position.set(0, 5.6, .45); LD.add(ls);
  const LDOOR = new THREE.Group(); LDOOR.position.set(-2.2, 4 * FH, -11.5); g.add(LDOOR);
  const L = new THREE.PointLight(0xfff0d0, 80, 40, 1.4); L.position.set(0, 4 * FH + 9, -4); g.add(L); const L2 = new THREE.PointLight(0xfff0d0, 60, 40, 1.4); L2.position.set(0, 2 * FH + 9, -4); g.add(L2); const L3 = new THREE.PointLight(0xfff0d0, 70, 40, 1.4); L3.position.set(0, 9, 2); g.add(L3);
  return { g: shade(g), FH, LD }; }
export { bus };

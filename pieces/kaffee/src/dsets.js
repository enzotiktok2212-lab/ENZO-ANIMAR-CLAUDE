// DAMPF — escenarios propios: despacho del alcalde (lleno de vapor, ventanas selladas), fachada del Gymnasium, aula de la Mathearbeit,
// quiosco abandonado (polvo, telarañas, la vape dorada en la última balda) y el ranking de la ciudad.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { txt, FONT, stripes } from './props.js';
const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const tex = (w, h, f, rx = 1, ry = 1) => { const t = canvasTex(w, h, f, true); t.repeat.set(rx, ry); return t; };
const plank = (a = 28) => tex(256, 256, (c, w, h) => { const r = RNG(4); for (let y = 0; y < h; y += 32) { c.fillStyle = `hsl(${a},${42 + r() * 10}%,${34 + r() * 8}%)`; c.fillRect(0, y, w, 32); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(0, y, w, 3); c.fillRect((r() * w) | 0, y, 3, 32); } });
const wallp = (a, b) => tex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.beginPath(); c.arc(16 + i * 32, 16 + j * 32 + (i % 2) * 16, 5, 0, 7); c.fill(); } });
function room(parent, X, w, d, h, wallM, floorM) { const g = new THREE.Group(); g.position.x = X; parent.add(g);
  box(w, .4, d, floorM, 0, g, 0, -.2, 0); box(w, h, .4, wallM, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wallM, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(0xf4efe4), 0, g, 0, h, 0);
  box(w, 1.2, .5, mat(0x5a3a22, { roughness: .6 }), .05, g, 0, .6, -d / 2 + .3); return g; }

// ---------- despacho del alcalde ----------
// mesa en (X, 0, -4); alcalde detrás en z = -7 mirando +z; ventana sellada en la pared del fondo (z = -14); retrato y bandera
export function buero(scene, X) { const g = room(scene, X, 40, 28, 20, mat(0xffffff, { map: wallp('#2a5a3a', '#3a7a4a'), roughness: .8 }), mat(0xffffff, { map: plank(26), roughness: .5 }));
  // ventana con cinta y cartel
  box(12, 10, .3, mat(0x3a2414), .1, g, 0, 11, -13.7); box(11, 9, .2, mat(0x9fd8ff, { roughness: .1, metalness: .2, emissive: 0x6ab8ff, emissiveIntensity: .4 }), 0, g, 0, 11, -13.6);
  for (const s of [-1, 1]) { const t = box(15, .7, .1, mat(0xf0c020, { roughness: .6 }), 0, g, 0, 11, -13.4); t.rotation.z = s * .65; }
  const note = textPlane(5.2, 2.2, 520, 220, (c, w, h) => { c.fillStyle = '#fffbe8'; c.fillRect(0, 0, w, h); txt(c, 'FENSTER', w / 2, 70, 76, '#d8323a'); txt(c, 'NIE ÖFFNEN!', w / 2, 160, 66, '#d8323a'); }); note.position.set(0, 4.6, -13.4); g.add(note);
  // mesa enorme con tapete verde, lámpara, teléfono y montones de dinero
  box(14, .6, 6, mat(0x6a3a1a, { roughness: .45 }), .1, g, 0, 4.3, -4); box(13, .1, 5, mat(0x1a5a2a, { roughness: .9 }), 0, g, 0, 4.65, -4); for (const sx of [-1, 1]) box(1.2, 4, 5.4, mat(0x5a3014), .1, g, sx * 6.2, 2, -4);
  for (let i = 0; i < 6; i++) { const st = box(1.6, .5 + (i % 3) * .3, .8, mat(0x5ab84a, { roughness: .7 }), .05, g, -5 + (i % 3) * 1.8, 4.9 + (i % 3) * .15, -5.2 + Math.floor(i / 3) * 1.1); }
  cyl(.3, .5, .3, mat(0xe9c23a, { metalness: .8, roughness: .3 }), 12, g, 4.6, 4.8, -5); const lp = cyl(.08, .08, 2, mat(0xe9c23a, { metalness: .8 }), 8, g, 4.6, 5.8, -5); cyl(.5, 1.0, .9, mat(0x2a7a3a, { emissive: 0x2a7a3a, emissiveIntensity: .3 }), 14, g, 4.6, 6.9, -5);
  // sillón de cuero detrás
  box(5, 1, 4, mat(0x6a1a1a, { roughness: .4 }), .3, g, 0, 2.6, -8.4); box(5, 6, 1, mat(0x6a1a1a, { roughness: .4 }), .3, g, 0, 5.6, -10.2); for (const s of [-1, 1]) box(.8, 2, 4, mat(0x6a1a1a, { roughness: .4 }), .2, g, s * 2.6, 3.6, -8.4);
  // retrato, bandera, estantería con trofeos de vapor
  const por = textPlane(5, 6, 250, 300, (c, w, h) => { c.fillStyle = '#c8a050'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a5a7a'; c.fillRect(18, 18, w - 36, h - 36); c.fillStyle = '#f0bc98'; c.fillRect(85, 70, 80, 80); c.fillStyle = '#bababa'; c.fillRect(80, 60, 90, 22); c.fillStyle = '#24483a'; c.fillRect(60, 150, 130, 110); c.fillStyle = '#ffd23f'; c.fillRect(100, 160, 50, 12); txt(c, 'BÜRGERMEISTER', w / 2, h - 34, 20, '#fff'); });
  por.position.set(-13, 12, -13.7); g.add(por);
  for (let i = 0; i < 3; i++) box(6, .5, 3, mat([0x1a1a1a, 0xd8323a, 0xf0c020][i]), 0, g, 13, 14 - i * .5, -13.2).scale.y = 1;
  cyl(.12, .12, 16, mat(0xc8c8c8, { metalness: .8 }), 8, g, 9.6, 8, -13.2);
  for (let k = 0; k < 3; k++) { box(.4, 8, 3, mat(0x5a3014), 0, g, 18 - 0, 4 + 0, -9 + k * 0); }
  box(1.4, 14, 10, mat(0x5a3014, { roughness: .6 }), .1, g, 19.2, 7, 2); for (let k = 0; k < 4; k++) { box(1.2, .3, 9.6, mat(0x4a2810), 0, g, 18.9, 2 + k * 3.4, 2); for (let j = 0; j < 4; j++) { cyl(.35, .5, 1.6, mat(0xe9c23a, { metalness: .8, roughness: .25 }), 10, g, 18.8, 3 + k * 3.4, -1.6 + j * 2.4); } }
  // planta y alfombra roja
  cyl(1, .8, 2, mat(0xc86a3a), 12, g, -16, 1, -10); sphere(2.2, mat(0x3a9a3a, { roughness: .9 }), g, -16, 4, -10, 12, 10);
  box(18, .05, 12, mat(0x9a1a2a, { roughness: .95 }), 0, g, 0, .03, 2);
  return { g: shade(g), DESK: new THREE.Vector3(X, 4.6, -4) }; }

// ---------- Gymnasium (fachada) ----------
// fachada de ladrillo en z = 0 mirando +z, escalinata, letrero; SOLD = pancarta «VERKAUFT AN FRAU KESSLER»
export function gymnasium(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const brick = tex(256, 256, (c, w, h) => { c.fillStyle = '#b8503a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8d8c8'; c.lineWidth = 4; for (let y = 0; y < h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); for (let x = (y / 32) % 2 ? 0 : 32; x < w; x += 64) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 32); c.stroke(); } } }, 8, 4);
  const yard = new THREE.Mesh(new THREE.PlaneGeometry(200, 120), mat(0x8a8e96, { roughness: 1 })); yard.rotation.x = -Math.PI / 2; yard.position.set(0, .02, 40); yard.receiveShadow = true; g.add(yard);
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(600, 400), mat(0x5cc24a, { roughness: 1 })); grass.rotation.x = -Math.PI / 2; grass.position.set(0, -.02, 0); g.add(grass);
  box(70, 34, 20, mat(0xffffff, { map: brick, roughness: .85 }), .1, g, 0, 17, -10); box(72, 1.6, 22, mat(0xe8e0d0), .1, g, 0, 34.6, -10);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(.1, 15, 10, 4, 1), mat(0x5a6a7a, { roughness: .6 })); roof.rotation.y = Math.PI / 4; roof.scale.set(3.4, 1, 1); roof.position.set(0, 40, -10); g.add(roof);
  for (let f = 0; f < 3; f++) for (let i = 0; i < 8; i++) { const x = -30 + i * 8.6; if (f === 0 && Math.abs(x) < 6) continue; box(4.6, 6, .3, mat(0xffffff), .1, g, x, 6 + f * 10, .1); box(4, 5.4, .3, mat(0x9fd8ff, { roughness: .15, metalness: .2 }), 0, g, x, 6 + f * 10, .2); box(5.2, .5, .8, mat(0xe8e0d0), .05, g, x, 2.8 + f * 10, .4); }
  box(9, 10, .5, mat(0x2a4a7a, { roughness: .4 }), .1, g, 0, 5, .2); for (let k = 0; k < 4; k++) box(20 - k * 2, .5, 2, mat(0xd8d4cc), .05, g, 0, .25 + k * .5, 2.2 - k * .5);
  const sg = textPlane(30, 4, 1200, 160, (c, w, h) => { c.fillStyle = '#f4efe4'; c.fillRect(0, 0, w, h); txt(c, 'GYMNASIUM HUFENBACH', w / 2, h / 2 + 4, 104, '#2a4a7a'); }); sg.position.set(0, 13.2, .4); g.add(sg);
  const SOLD = textPlane(40, 9, 1200, 270, (c, w, h) => { c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#fff'; c.lineWidth = 14; c.strokeRect(14, 14, w - 28, h - 28); txt(c, 'VERKAUFT!', w / 2, 100, 130, '#ffffff'); txt(c, 'Neue Besitzerin: Frau Kessler', w / 2, 210, 62, '#ffe0a0'); });
  SOLD.position.set(0, 22, .6); g.add(SOLD);
  for (const x of [-46, 46]) { cyl(.8, 1, 8, mat(0x6a4a2a), 8, g, x, 4, 14); sphere(5, mat(0x3a9a3a, { roughness: .9 }), g, x, 10, 14, 12, 10); }
  return { g: shade(g), SOLD }; }

// ---------- quiosco abandonado ----------
// interior polvoriento: mostrador en z = 2, baldas al fondo (z = -9) con la vape dorada en la última balda arriba, en (X, 9.2, -8.6)
export function kiosk(scene, X) { const g = room(scene, X, 30, 22, 16, mat(0xffffff, { map: wallp('#5a5040', '#6a6050'), roughness: .95 }), mat(0xffffff, { map: plank(30), roughness: .9 }));
  const r = RNG(9);
  for (let k = 0; k < 4; k++) { box(24, .4, 3, mat(0x5a3a22, { roughness: .8 }), .05, g, 0, 2 + k * 2.6, -9.4); }
  for (const s of [-1, 1]) box(.5, 11, 3, mat(0x4a3020), 0, g, s * 12, 5.5, -9.4);
  // latas, paquetes y botellas viejas (desteñidas)
  for (let k = 0; k < 4; k++) for (let i = 0; i < 12; i++) { if (r() < .35) continue; const x = -11 + i * 2 + r() * .4, y = 2.2 + k * 2.6; if (k === 3 && Math.abs(x) < 2) continue;
    if (r() < .5) cyl(.4, .4, 1.1, mat([0x8a6a5a, 0x6a7a8a, 0x8a8a6a, 0x7a5a6a][(i + k) % 4], { roughness: .9 }), 10, g, x, y + .55, -9.2 + r() * .4); else box(1.2, 1.4, .8, mat([0x9a8a6a, 0x7a6a5a, 0x6a7a6a][(i * k) % 3], { roughness: .95 }), .05, g, x, y + .7, -9.2); }
  // mostrador con caja registradora oxidada
  box(18, 4, 3, mat(0x6a4a30, { roughness: .8 }), .1, g, 0, 2, 2); box(18.6, .4, 3.6, mat(0x5a3a22), .05, g, 0, 4.1, 2); box(3, 2, 2, mat(0x6a6a5a, { metalness: .4, roughness: .8 }), .2, g, -5, 5.2, 2);
  // telarañas, cartel caído, polvo
  for (const [x, y] of [[-14.5, 15.2], [14.5, 15.2], [-11.5, 11.4]]) { const w = textPlane(4, 4, 128, 128, (c, w, h) => { c.strokeStyle = 'rgba(240,240,240,.7)'; c.lineWidth = 2; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(i * .2) * w, Math.sin(i * .2) * h); c.stroke(); } for (let k = 1; k < 6; k++) { c.beginPath(); c.arc(0, 0, k * 22, 0, 1.6); c.stroke(); } }); w.position.set(x, y, -10.6); if (x > 0) w.rotation.z = -Math.PI / 2; g.add(w); }
  const sg = textPlane(9, 2.4, 540, 144, (c, w, h) => { c.fillStyle = '#c8b890'; c.fillRect(0, 0, w, h); txt(c, 'KIOSK', w / 2, h / 2 + 4, 100, '#7a3a2a'); }); sg.position.set(-4, 13, -10.7); sg.rotation.z = -.18; g.add(sg);
  // halo de luz sobre la vape dorada (balda de arriba)
  const beam = new THREE.Mesh(new THREE.ConeGeometry(2.2, 9, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe8a0, transparent: true, opacity: .14, depthWrite: false, side: THREE.DoubleSide })); beam.position.set(0, 14, -8.6); g.add(beam);
  const LI = new THREE.PointLight(0xffd88a, 40, 18, 1.6); LI.position.set(0, 13, -6); g.add(LI);
  return { g: shade(g), GOLDPOS: new THREE.Vector3(X, 10.05, -8.9), beam, LI }; }

// ---------- ranking (se dibuja en la pantalla gigante) ----------
// rows: [[nombre, euros], ...]; hi = fila resaltada; k = animación de entrada 0..1
export function drawRank(c, w, h, title, rows, hi = 0, k = 1) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#101a3a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 56px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText(title, w / 2, 50);
  rows.forEach(([n, e], i) => { const kk = Math.max(0, Math.min(1, k * 1.8 - i * .12)); if (kk <= 0) return; const y = 112 + i * 78, x = (1 - kk) * -w;
    c.fillStyle = i === hi ? 'rgba(255,210,63,.95)' : 'rgba(255,255,255,.1)'; c.beginPath(); c.roundRect(40 + x, y - 32, w - 80, 66, 18); c.fill();
    c.font = `700 40px ${FONT}`; c.textAlign = 'left'; c.fillStyle = i === hi ? '#1a1a2a' : '#ffffff'; c.fillText(`${i + 1}.  ${n}`, 70 + x, y + 2);
    c.textAlign = 'right'; c.fillStyle = i === hi ? '#1a1a2a' : '#7aff9a'; c.fillText(e, w - 70 + x, y + 2); }); }

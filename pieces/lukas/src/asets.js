// ADRIAN — escenarios y atrezo propios.
// Cartel de bienvenida (Adriansfelde, Einwohner: 3000 Adrians → Müllers), caseta del perro, lista de asistencia, pancarta NIEMAND,
// bicicletas, aparcabicis, Freibad (piscina grande con trampolín, tobogán, kiosco), escenario del Stadtfest con micrófono,
// furgoneta de Detlef (puertas traseras que se abren, llena de bicis y portátiles), calle de noche con puertas que se abren, urna de votación.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp, easeOut } from './engine.js';
import { noiseTex, stripes, tree, lamp } from './props.js';
import { FONT } from './sets.js';
import { townhouse } from './gort.js';
import { lantern } from './diam.js';
import { bunting } from './wsets.js';

const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const rep = (t, a, b) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); return t; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !(o.material && o.material.transparent)) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
export const txt = (c, s, x, y, size, fill, stroke, lw = 8, font = FONT) => { c.font = `700 ${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = fill; c.fillText(s, x, y); };
const plane = (w, h, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
// pantalla/cartel dinámico (se redibuja solo si cambia la clave)
export function dynPlane(w, h, pw, ph, opts = {}) { const cv = document.createElement('canvas'); cv.width = pw; cv.height = ph; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: .7, transparent: !!opts.transparent, side: opts.double ? THREE.DoubleSide : THREE.FrontSide })); m.receiveShadow = true; let key = null;
  m.userData.draw = (k, fn) => { if (k === key) return; key = k; const c = cv.getContext('2d'); c.clearRect(0, 0, pw, ph); fn(c, pw, ph); t.needsUpdate = true; }; return m; }

// ---------- cartel de bienvenida ----------
export function welcomeSign(parent) { const g = G(parent); const wood = mat(0x7a4a26, { roughness: .8 }); for (const s of [-1, 1]) box(.6, 9, .6, wood, .08, g, s * 5.6, 4.5, 0);
  box(12.4, 6.4, .5, wood, .12, g, 0, 6.2, -.05); const roof = box(13.4, .5, 1.6, mat(0xb8402a, { roughness: .6 }), .1, g, 0, 9.6, 0); roof.rotation.x = .05;
  const P = dynPlane(11.4, 5.4, 760, 360); P.position.set(0, 6.2, .22); g.add(P);
  g.userData.set = (who = 'Adrians', town = 'ADRIANSFELDE') => P.userData.draw(who + town, (c, w, h) => { c.fillStyle = '#f6efdc'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a6a3a'; c.lineWidth = 14; c.strokeRect(10, 10, w - 20, h - 20);
    txt(c, 'WILLKOMMEN IN', w / 2, 62, 50, '#2a6a3a'); txt(c, town, w / 2, 140, 96, '#1a3a7a'); txt(c, 'Einwohner:', w / 2, 225, 46, '#3a3a3a'); txt(c, '5000 ' + who, w / 2, 298, who.length > 8 ? 64 : 82, '#d8202f'); });
  g.userData.set(); for (let k = 0; k < 14; k++) sphere(.45, mat([0xff4a6a, 0xffd23f, 0xffffff, 0xff8ad0][k % 4]), g, -5.6 + k * .86, .45, 1.2 + (k % 2) * .5, 8, 6);
  box(12, .6, 1.6, mat(0x5a3a1a), .1, g, 0, .3, 1.4); return shade(g); }

// ---------- caseta del perro ----------
export function doghouse(parent) { const g = G(parent); const w = mat(0xd8323a, { roughness: .6 }), r = mat(0xf4f4f4, { roughness: .5 });
  box(5, 4, 5, w, .12, g, 0, 2, 0); for (const s of [-1, 1]) { const p = box(3.9, .4, 5.8, r, .08, g, s * 1.36, 4.9, 0); p.rotation.z = -s * .62; } box(.4, .6, 5.8, r, .05, g, 0, 6.05, 0);
  box(2.2, 2.6, .1, mat(0x1a1410), .02, g, 0, 1.3, 2.52); const sg = textPlane(3, .9, 300, 90, (c, W, H) => { c.fillStyle = '#7a4a26'; c.fillRect(0, 0, W, H); txt(c, 'ADRIAN', W / 2, H / 2 + 3, 64, '#fff3c0'); }); sg.position.set(0, 3.25, 2.56); g.add(sg);
  const bowl = G(g, 2.6, 0, 3.2); cyl(.9, .7, .5, mat(0x2a6ad8, { roughness: .3 }), 18, bowl, 0, .25, 0); cyl(.75, .75, .05, mat(0x8a5a2a), 14, bowl, 0, .48, 0);
  const bl = textPlane(1.4, .3, 140, 30, (c, W, H) => { txt(c, 'ADRIAN', W / 2, H / 2 + 1, 26, '#ffffff'); }); bl.position.set(0, .28, .86); bowl.add(bl);
  const bone = G(g, -2.4, .2, 3.2); box(1.2, .25, .3, mat(0xf6f0e0), .1, bone, 0, 0, 0); for (const s of [-1, 1]) for (const z of [-.15, .15]) sphere(.2, mat(0xf6f0e0), bone, s * .6, 0, z, 8, 6); return shade(g); }

// ---------- lista de asistencia (papel con columnas; progreso k: cuántas filas marcadas) ----------
export function attendance(parent) { const g = G(parent); box(7.4, 9.6, .12, mat(0x8a5a2a, { roughness: .6 }), .05, g, 0, 0, -.08); box(2.4, .7, .3, mat(0xc8c8d0, { metalness: .8, roughness: .3 }), .1, g, 0, 4.7, .05);
  const P = dynPlane(6.8, 9, 680, 900); P.position.set(0, -.2, .0); g.add(P);
  g.userData.set = (n = 7, red = true, year = 4) => P.userData.draw(n + ':' + red + ':' + year, (c, w, h) => { c.fillStyle = '#fffdf6'; c.fillRect(0, 0, w, h); c.strokeStyle = '#9ac0e8'; c.lineWidth = 3; for (let y = 150; y < h; y += 72) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } c.strokeStyle = '#ff8a8a'; c.beginPath(); c.moveTo(80, 0); c.lineTo(80, h); c.stroke();
    txt(c, 'ANWESENHEIT', w / 2, 56, 58, '#1a2a6a'); txt(c, 'Klasse 5b – Frau Adrian', w / 2, 112, 30, '#3a3a5a');
    c.textAlign = 'left'; for (let i = 0; i < 9; i++) { const y = 190 + i * 72, last = i === 8; if (i >= n && !last) continue; if (last && !red) continue;
      c.font = `700 46px 'Cap'`; c.fillStyle = last ? '#c81e2a' : '#1a2a6a'; c.fillText(last ? 'Müller' : 'Adrian', 100, y); c.fillStyle = '#7a7a8a'; c.fillText('. . . . .', 290, y);
      c.fillStyle = last ? '#c81e2a' : '#1a8a3a'; c.font = `700 ${last ? 46 : 46}px 'Cap'`; c.fillText(last ? 'ABWESEND' : 'hier ✓', 430, y); }
    if (red) { c.strokeStyle = '#c81e2a'; c.lineWidth = 6; c.beginPath(); c.ellipse(w / 2 + 40, 190 + 8 * 72, 300, 46, -.02, 0, 7); c.stroke(); } });
  g.userData.set(); return shade(g); }
// pared de listas viejas: una por año, todas con «Müller – ABWESEND»
export function oldLists(parent) { const g = G(parent); const L = [];
  for (let i = 0; i < 4; i++) { const p = textPlane(4.4, 5.8, 352, 464, (c, w, h) => { c.fillStyle = ['#fffdf0', '#fff6e0', '#fdf8ea', '#fffaf2'][i]; c.fillRect(0, 0, w, h); txt(c, 'Schuljahr', w / 2, 40, 30, '#3a3a5a'); txt(c, `${2023 + i}`, w / 2, 86, 56, '#1a2a6a');
    for (let k = 0; k < 5; k++) { c.textAlign = 'left'; c.font = `700 28px 'Cap'`; c.fillStyle = '#1a2a6a'; c.fillText('Adrian ... hier', 30, 150 + k * 44); } c.font = `700 32px 'Cap'`; c.fillStyle = '#c81e2a'; c.fillText('Müller ... ABWESEND', 18, 400); c.strokeStyle = '#c81e2a'; c.lineWidth = 5; c.strokeRect(10, 370, w - 20, 56); });
    p.position.set(-7.2 + i * 4.8, (i % 2) * .4, 0); p.rotation.z = (i - 1.5) * .05; g.add(p); L.push(p); const pin = sphere(.18, mat([0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a][i]), g, -7.2 + i * 4.8, 2.7 + (i % 2) * .4, .1, 8, 6); }
  g.userData.L = L; return g; }

// ---------- pancarta NIEMAND (cartón pintado por niños, dos palos) ----------
export function niemandSign(parent) { const g = G(parent); const wood = mat(0xb8885a, { roughness: .8 }); for (const s of [-1, 1]) box(.25, 6.4, .25, wood, .05, g, s * 3.4, 3.2, 0);
  const p = textPlane(7.6, 3, 608, 240, (c, w, h) => { c.fillStyle = '#e8d2a8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b89868'; c.lineWidth = 4; c.strokeRect(6, 6, w - 12, h - 12); c.save(); c.translate(w / 2, h / 2); c.rotate(-.04); txt(c, 'NIEMAND', 0, 6, 150, '#d8202f', '#6a0010', 6); c.restore(); });
  p.position.set(0, 5.2, .2); g.add(p); box(7.8, 3.1, .12, mat(0xb89868), .03, g, 0, 5.2, .1); return shade(g); }

// ---------- bicicleta ----------
export function bike(parent, col = 0x2ab86a, s = 1, o = {}) { const g = G(parent); g.scale.setScalar(s); const fm = mat(col, { roughness: .35, metalness: .3 }), dk = mat(0x1a1a1e, { roughness: .6 }), ch = mat(0xd8dce4, { metalness: .9, roughness: .2 });
  const wheel = (z) => { const w = G(g, 0, 1.3, z); const t = new THREE.Mesh(new THREE.TorusGeometry(1.15, .14, 8, 28), dk); t.rotation.y = Math.PI / 2; w.add(t); const rim = new THREE.Mesh(new THREE.TorusGeometry(1.0, .05, 6, 28), ch); rim.rotation.y = Math.PI / 2; w.add(rim);
    for (let k = 0; k < 8; k++) { const sp = cyl(.02, .02, 2, ch, 4, w, 0, 0, 0); sp.rotation.x = k * Math.PI / 8; } cyl(.14, .14, .3, ch, 10, w, 0, 0, 0).rotation.z = Math.PI / 2; return w; };
  const W1 = wheel(1.9), W2 = wheel(-1.9);
  const tube = (a, b, r = .1) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A); const m = cyl(r, r, d.length(), fm, 8, g, 0, 0, 0); m.position.copy(A).add(B).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return m; };
  tube([0, 1.3, -.2], [0, 3.0, -.7]); tube([0, 1.3, -.2], [0, 2.8, 1.35]); tube([0, 3.0, -.7], [0, 2.85, 1.3]); tube([0, 1.3, -.2], [0, 1.3, -1.9], .07); tube([0, 3.0, -.7], [0, 1.3, -1.9], .07); tube([0, 2.8, 1.35], [0, 1.3, 1.9], .08);
  tube([0, 2.8, 1.35], [0, 3.6, 1.2], .08); const hb = cyl(.07, .07, 1.8, dk, 8, g, 0, 3.65, 1.2); hb.rotation.z = Math.PI / 2; for (const sx of [-1, 1]) cyl(.11, .11, .4, dk, 8, g, sx * .85, 3.65, 1.2).rotation.z = Math.PI / 2;
  tube([0, 3.0, -.7], [0, 3.5, -.85], .07); const seat = box(.5, .18, 1.0, dk, .08, g, 0, 3.6, -.9); cyl(.35, .35, .12, ch, 14, g, 0, 1.3, -.2).rotation.z = Math.PI / 2;
  if (o.basket) { const b = G(g, 0, 3.4, 1.9); const bm = mat(0xffd23f, { roughness: .7 }); box(1.4, .9, 1.0, bm, .1, b, 0, 0, 0); box(1.2, .1, .8, mat(0x8a6a20), 0, b, 0, .46, 0); }
  if (o.bell) { const bl = sphere(.18, ch, g, .55, 3.82, 1.2, 10, 8); }
  if (o.streamers) for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const st = box(.05, .7, .05, mat([0xff4a8a, 0xffd23f, 0x3ab8ff][k]), 0, g, sx * 1.0, 3.3, 1.2 + (k - 1) * .06); st.rotation.z = sx * (.2 + k * .1); }
  g.userData.wheels = [W1, W2]; g.userData.spin = a => { W1.rotation.x = a; W2.rotation.x = a; }; return shade(g); }
// aparcabicis (arcos)
export function bikeRack(parent, n = 6) { const g = G(parent); const ch = mat(0xb8bcc4, { metalness: .8, roughness: .3 }); for (let i = 0; i < n; i++) { const a = new THREE.Mesh(new THREE.TorusGeometry(1.4, .1, 8, 20, Math.PI), ch); a.position.set((i - (n - 1) / 2) * 2.4, 0, 0); a.rotation.y = Math.PI / 2; g.add(a); } return shade(g); }
// candado roto
export function brokenLock(parent) { const g = G(parent); const m = mat(0xffd23f, { metalness: .5, roughness: .3 }); box(.7, .9, .35, m, .1, g, 0, 0, 0); const s = new THREE.Mesh(new THREE.TorusGeometry(.32, .07, 6, 14, Math.PI * .8), mat(0xd8dce4, { metalness: .9, roughness: .2 })); s.position.set(0, .5, 0); s.rotation.z = .7; g.add(s); return shade(g); }
// portátil sencillo (pantalla con logotipo)
export function notebook(parent, col = 0x9aa0aa) { const g = G(parent); const m = mat(col, { metalness: .6, roughness: .3 }); box(3.0, .16, 2.1, m, .06, g, 0, .08, 0); const lid = G(g, 0, .16, -1.02); lid.rotation.x = -.3; box(3.0, 2.0, .1, m, .06, lid, 0, 1.0, 0);
  const s = textPlane(2.7, 1.7, 200, 126, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#2a6ad8'); gr.addColorStop(1, '#8a3ad8'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(w / 2, h / 2, 18, 0, 7); c.fill(); }); s.material.transparent = false; s.position.set(0, 1.0, .06); lid.add(s);
  box(2.6, .02, 1.0, mat(0x2a2a30), 0, g, 0, .17, .2); return shade(g); }
// tele
export function tele(parent) { const g = G(parent); box(5, 3.1, .3, mat(0x16161a, { metalness: .4, roughness: .3 }), .1, g, 0, 1.55, 0); const s = textPlane(4.6, 2.7, 230, 135, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#3a9ad8'); gr.addColorStop(1, '#2ab86a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(170, 40, 20, 0, 7); c.fill(); }); s.material.transparent = false; s.position.set(0, 1.55, .17); g.add(s); return shade(g); }

// ---------- Freibad (X): piscina 44×24 con calles, trampolín, tobogán, tumbonas, sombrillas, kiosco, socorrista, casas al fondo ----------
export function freibad(scene, X) { const g = G(scene, X, 0, 0);
  const grass = plane(400, 400, mat(0xffffff, { roughness: 1, map: rep(noiseTex('#5cc24a', ['#4aae3a', '#6cd45a'], 2400, 3, 1), 60, 60) }), g, 0, -.02, 0);
  const tile = rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#f4f0e8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8d2c4'; c.lineWidth = 2; c.strokeRect(0, 0, 32, 32); c.strokeRect(32, 32, 32, 32); c.strokeRect(32, 0, 32, 32); c.strokeRect(0, 32, 32, 32); }, true), 30, 22);
  box(80, .4, 56, mat(0xffffff, { map: tile, roughness: .6 }), 0, g, 0, .2, 0);
  // vaso: paredes azules y agua
  const PW = 44, PD = 24; box(PW, .2, PD, mat(0x3a9ad8), 0, g, 0, -3.6, 0); const wl = mat(0x5ab8e8, { roughness: .4 }); box(PW, 4, .4, wl, 0, g, 0, -1.6, -PD / 2); box(PW, 4, .4, wl, 0, g, 0, -1.6, PD / 2); box(.4, 4, PD, wl, 0, g, -PW / 2, -1.6, 0); box(.4, 4, PD, wl, 0, g, PW / 2, -1.6, 0);
  for (const s of [-1, 1]) { box(PW + 2, .5, 1.2, mat(0xffffff, { roughness: .5 }), .1, g, 0, .45, s * (PD / 2 + .6)); box(1.2, .5, PD + 2, mat(0xffffff, { roughness: .5 }), .1, g, s * (PW / 2 + .6), .45, 0); }
  const wtex = rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#3fc8f0'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 3; const r = RNG(4); for (let i = 0; i < 24; i++) { c.beginPath(); const x = r() * w, y = r() * h; c.moveTo(x, y); c.quadraticCurveTo(x + 10, y - 6, x + 22, y); c.stroke(); } }, true), 8, 5);
  const water = plane(PW, PD, new THREE.MeshStandardMaterial({ color: 0xffffff, map: wtex, roughness: .08, metalness: .1, transparent: true, opacity: .86, emissive: 0x0a6aa0, emissiveIntensity: .25 }), g, 0, -.15, 0); water.userData.noOutline = true;
  for (let k = 1; k < 6; k++) { const z = -PD / 2 + k * PD / 6; for (let i = 0; i < 40; i++) sphere(.22, mat(i % 4 < 2 ? 0xff3a3a : 0xffffff), g, -PW / 2 + .5 + i * (PW - 1) / 39, -.05, z, 8, 6); }
  // trampolín 3 m (oeste)
  const tw = G(g, -PW / 2 - 4, 0, -6); box(1.2, 10, 1.2, mat(0xe8e8e8), .1, tw, -1.5, 5, 0); box(1.2, 10, 1.2, mat(0xe8e8e8), .1, tw, 1.5, 5, 0); box(4.4, .4, 3, mat(0x2a6ad8), .05, tw, 0, 10.2, 0); const brd = box(7, .3, 1.6, mat(0xffffff), .1, tw, 4.2, 10.5, 0);
  for (let k = 0; k < 9; k++) box(2.6, .2, .6, mat(0xb8bcc4, { metalness: .6 }), .02, tw, 0, 1 + k * 1.05, 1.4);
  // tobogán (este): torre + tubo amarillo en espiral
  const sl = G(g, PW / 2 + 6, 0, 8); for (const [x, z] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) cyl(.2, .2, 12, mat(0xe8e8e8), 8, sl, x, 6, z); box(4, .4, 4, mat(0xd8323a), .1, sl, 0, 12, 0);
  for (let k = 0; k < 26; k++) { const a = k * .32, y = 11.6 - k * .44; const seg = box(2.4, .5, 1.8, mat(0xffd23f, { roughness: .3 }), .2, sl, Math.cos(a) * 3.6, y, Math.sin(a) * 3.6); seg.rotation.y = -a; }
  // tumbonas y sombrillas (norte, detrás del agua visto desde el sur)
  const um = (x, z, a, b) => { const u = G(g, x, 0, z); cyl(.1, .1, 7, mat(0xe8e8e8), 6, u, 0, 3.5, 0); const c = new THREE.Mesh(new THREE.ConeGeometry(3.8, 1.4, 12), mat(0xffffff, { map: stripes(a, b, 12) })); c.position.y = 7.2; u.add(c); };
  for (let i = 0; i < 6; i++) { const x = -20 + i * 8, z = -PD / 2 - 7; um(x, z - 2, ['#ff5a85', '#2a6ad8', '#ffd23f'][i % 3], '#ffffff'); const t = box(2, .4, 5, mat(0xffffff, { map: stripes(['#ff5a85', '#2ab86a', '#ff8a3a'][i % 3], '#ffffff', 6, false) }), .1, g, x + 2.4, .9, z + 1); for (const s of [-1, 1]) box(.2, .7, .2, mat(0xe8e8e8), 0, g, x + 2.4 + s * .8, .35, z + 1); const towel = box(1.8, .06, 3.2, mat([0xff8ad0, 0x3ab8ff, 0xffd23f][i % 3]), 0, g, x - 1.4, .45, z + 2); }
  // kiosco (sureste) con cartel EIS
  const KI = G(g, 24, 0, PD / 2 + 12); box(10, 7, 6, mat(0xfff2d8), .1, KI, 0, 3.5, 0); box(11, .6, 7.4, mat(0xd8323a), .1, KI, 0, 7.3, .4); const aw = box(10.4, .3, 3, mat(0xffffff, { map: stripes('#d8323a', '#ffffff', 10) }), .05, KI, 0, 6.2, 4); aw.rotation.x = .3;
  box(8, 2.6, .2, mat(0x2a2a30), .02, KI, 0, 4.2, 3.02); box(9, .4, 1.4, mat(0xffffff), .05, KI, 0, 2.8, 3.6); const ks = textPlane(8, 1.6, 400, 80, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); txt(c, 'KIOSK · EIS 1,50 €', w / 2, h / 2 + 2, 50, '#d8323a'); }); ks.position.set(0, 7.3, 4.12); KI.add(ks);
  for (let k = 0; k < 5; k++) { const ic = G(KI, -3 + k * 1.5, 3.2, 3.9); cyl(.18, .02, .7, mat(0xd8a050), 8, ic, 0, 0, 0).rotation.x = Math.PI; sphere(.28, mat([0xff8ad0, 0xfff2d8, 0x8a5a2a, 0x8ad84a, 0xffd23f][k]), ic, 0, .45, 0, 10, 8); }
  // silla del socorrista
  const LG = G(g, 0, 0, PD / 2 + 3); for (const [x, z] of [[-1.2, -1], [1.2, -1], [-1.2, 1], [1.2, 1]]) cyl(.15, .15, 6, mat(0xffffff), 8, LG, x, 3, z); box(3, .3, 2.6, mat(0xd8323a), .05, LG, 0, 6, 0); box(3, 2, .3, mat(0xd8323a), .05, LG, 0, 7, -1.2);
  // cartel FREIBAD y valla
  const fb = textPlane(14, 3, 700, 150, (c, w, h) => { c.fillStyle = '#2a6ad8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffffff'; c.lineWidth = 10; c.strokeRect(8, 8, w - 16, h - 16); txt(c, 'FREIBAD ADRIANSFELDE', w / 2, h / 2 + 4, 76, '#ffffff'); }); fb.position.set(0, 13, -PD / 2 - 20); g.add(fb); for (const s of [-1, 1]) cyl(.3, .3, 14, mat(0xe8e8e8), 8, g, s * 6.5, 6.5, -PD / 2 - 20.3);
  for (let x = -60; x <= 60; x += 2) box(.12, 3, .12, mat(0x2a8a4a), 0, g, x, 1.5, -PD / 2 - 24); box(122, .15, .12, mat(0x2a8a4a), 0, g, 0, 2.8, -PD / 2 - 24);
  for (const [x, z] of [[-40, -30], [-30, -34], [36, -30], [46, -20], [-46, 10], [48, 30], [-40, 34]]) tree(g, x, z, 1.1);
  for (let i = 0; i < 9; i++) townhouse(g, -72 + i * 18, -62, 16, 2 + (i % 2), 50 + i, 0);
  // hamacas este/oeste y hojas de palmera de plástico ... (gente se coloca desde los planos)
  return { g: shade(g), water, PW, PD, wtex }; }

// ---------- escenario del Stadtfest (en el mundo, centro c, mirando +z) ----------
export function stage(parent, x, z) { const g = G(parent, x, 0, z); const wd = mat(0x6a4a2a, { roughness: .7 });
  box(24, 3, 12, wd, .1, g, 0, 1.5, 0); box(24.4, .3, 12.4, mat(0x2a2a30, { roughness: .4 }), .05, g, 0, 3.1, 0); for (let k = 0; k < 5; k++) box(6, .5, 1.6, wd, .05, g, 9, .25 + k * .55, 6.6 + (4 - k) * .2).position.set(9, .3 + k * .6, 7 + (4 - k) * .5);
  // fondo con telón rojo y pancarta
  box(26, 16, .6, mat(0x2a2a30), .1, g, 0, 11, -6); const cur = mat(0xc81e2a, { roughness: .9, map: rep(stripes('#c81e2a', '#a8141e', 8), 4, 1) }); box(23, 12, .3, cur, .05, g, 0, 9.2, -5.6);
  for (const s of [-1, 1]) { cyl(.35, .35, 20, mat(0x2a2a30, { metalness: .6 }), 8, g, s * 13, 10, -6); box(2.6, 4.6, 2.2, mat(0x16161a, { roughness: .4 }), .2, g, s * 10.2, 5.4, 4); for (const y of [4.4, 6.4]) { const sp = cyl(.7, .7, .1, mat(0x3a3a40, { metalness: .5 }), 18, g, s * 10.2, y, 5.12); sp.rotation.x = Math.PI / 2; } }
  const ban = textPlane(22, 3.4, 880, 136, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8202f'; c.lineWidth = 10; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'STADTFEST ADRIANSFELDE', w / 2, h / 2 + 4, 84, '#d8202f'); }); ban.position.set(0, 17, -5.6); g.add(ban);
  box(26, .4, .4, mat(0x2a2a30, { metalness: .6 }), .05, g, 0, 19.4, -6); const SL = []; for (let k = 0; k < 6; k++) { const l = G(g, -10 + k * 4, 18.9, -5.4); cyl(.5, .35, 1, mat(0x1a1a1e, { metalness: .6 }), 10, l, 0, 0, 0).rotation.x = .6; SL.push(sphere(.32, glowM([0xff4a8a, 0xffd23f, 0x3ab8ff][k % 3], 2.5), l, 0, -.4, .35, 8, 6)); }
  // micrófono en pie
  const MIC = G(g, 0, 3.2, 2.5); cyl(.5, .6, .12, mat(0x1a1a1e, { metalness: .7 }), 14, MIC, 0, .06, 0); cyl(.06, .06, 4.2, mat(0x1a1a1e, { metalness: .7 }), 8, MIC, 0, 2.1, 0); const head = G(MIC, 0, 4.3, .2); head.rotation.x = .5; cyl(.14, .12, .7, mat(0x2a2a30, { metalness: .6 }), 10, head, 0, 0, 0); sphere(.22, mat(0x8a8e96, { metalness: .8, roughness: .3 }), head, 0, .45, 0, 12, 8);
  const mic = G(null); cyl(.14, .12, .8, mat(0x2a2a30, { metalness: .6 }), 10, mic, 0, -.3, 0); sphere(.24, mat(0x8a8e96, { metalness: .8, roughness: .3 }), mic, 0, .2, 0, 12, 8); shade(mic);
  return { g: shade(g), MIC, mic, SL, top: 3.2 }; }
// puesto de comida con toldo (bratwurst, brezeln)
export function stand(parent, x, z, ry, title, col) { const g = G(parent, x, 0, z); g.rotation.y = ry; box(8, 3.4, 4, mat(0x8a5a2a), .1, g, 0, 1.7, 0); box(8.4, .3, 4.4, mat(0xffffff), .05, g, 0, 3.55, 0);
  for (const s of [-1, 1]) cyl(.12, .12, 7, mat(0xe8e8e8), 6, g, s * 3.9, 3.5, 1.8); const aw = box(8.6, .3, 5, mat(0xffffff, { map: stripes(col, '#ffffff', 10) }), .05, g, 0, 7, .4); aw.rotation.x = -.12;
  const t = textPlane(7, 1.2, 420, 72, (c, w, h) => { c.fillStyle = '#fff6e0'; c.fillRect(0, 0, w, h); txt(c, title, w / 2, h / 2 + 2, 52, col); }); t.position.set(0, 5.2, 2.0); g.add(t);
  for (let k = 0; k < 6; k++) { const s = cyl(.2, .2, 1.2, mat(0xb8642a, { roughness: .5 }), 8, g, -2.6 + k * 1.05, 3.85, .6); s.rotation.z = Math.PI / 2; } return shade(g); }

// ---------- furgoneta de Detlef (morro +z; puertas traseras en -z que se abren con setOpen(0..1)) ----------
export function lieferwagen(parent) { const g = G(parent); const b = mat(0xf2f2f4, { roughness: .35 }), dk = mat(0x16161a, { roughness: .1, metalness: .6 });
  // caja: suelo + paredes (abierta por detrás para ver la carga)
  box(5.2, .4, 11, b, .1, g, 0, 1.6, -1.2); for (const s of [-1, 1]) box(.3, 5, 11, b, .1, g, s * 2.5, 4.3, -1.2); box(5.2, .3, 11, b, .1, g, 0, 6.8, -1.2); box(5.2, 5, .3, b, .1, g, 0, 4.3, 4.2);
  box(5.0, .1, 10.6, mat(0x5a5a62, { roughness: .9 }), 0, g, 0, 1.82, -1.2);
  // cabina
  box(5.2, 4.2, 3.6, b, .5, g, 0, 3.4, 6.1); box(4.6, 1.8, .1, dk, .05, g, 0, 4.6, 7.92); for (const s of [-1, 1]) box(.1, 1.6, 2.2, dk, .03, g, s * 2.62, 4.6, 6.3);
  box(5.4, .6, .5, mat(0x3a3a40), .1, g, 0, 1.8, 8.0); for (const s of [-1, 1]) sphere(.32, glowM(0xfff8e0, 1.5), g, s * 1.9, 2.6, 7.95, 8, 6);
  for (const s of [-1, 1]) { const st = box(.05, .6, 10.6, mat(0x7a4a26), 0, g, s * 2.67, 3.0, -1.2); }
  const wheel = (x, z) => { const w = cyl(1.0, 1.0, .7, mat(0x1a1a1e, { roughness: .8 }), 18, g, x, 1.0, z); w.rotation.z = Math.PI / 2; const h = cyl(.5, .5, .72, mat(0xc8c8d0, { metalness: .8 }), 12, g, x, 1.0, z); h.rotation.z = Math.PI / 2; };
  for (const z of [-4.8, 5.4]) for (const s of [-1, 1]) wheel(s * 2.4, z);
  const D = [-1, 1].map(s => { const h = G(g, s * 2.6, 4.3, -6.75); box(2.6, 5, .2, b, .08, h, -s * 1.3, 0, 0); box(1.6, 1.4, .05, dk, .02, h, -s * 1.3, 1.2, -.12); box(.2, .9, .2, mat(0x2a2a30), .03, h, -s * 2.2, 0, -.2); return h; });
  for (const s of [-1, 1]) sphere(.25, glowM(0xff2a2a, 1.2), g, s * 2.2, 2.4, -6.8, 8, 6); box(5, .5, .5, mat(0x3a3a40), .1, g, 0, 1.6, -6.9);
  const plate = textPlane(1.8, .5, 180, 50, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a4ab8'; c.fillRect(0, 0, 18, h); txt(c, 'AF-DT 123', w / 2 + 8, h / 2 + 2, 30, '#111'); }); plate.position.set(0, 1.6, -7.17); plate.rotation.y = Math.PI; g.add(plate);
  g.userData.setOpen = k => { D[0].rotation.y = -k * 1.9; D[1].rotation.y = k * 1.9; }; g.userData.setOpen(0); return shade(g); }

// ---------- calle de noche: fachada con puerta que se abre (hinge.rotation.y), timbre, farol, felpudo ----------
export function frontDoor(parent, x, z, ry, ci, num) { const g = G(parent, x, 0, z); g.rotation.y = ry; const wallC = [0xf6e6b8, 0xd8e8f0, 0xf4c8b8, 0xe0f0d0][ci % 4]; const wm = mat(wallC, { roughness: .85 });
  box(4.4, 16, 1, wm, 0, g, -5.2, 8, 0); box(4.4, 16, 1, wm, 0, g, 5.2, 8, 0); box(6, 9.5, 1, wm, 0, g, 0, 11.25, 0); box(16, 2, 4, mat(0x9a3a2a, { roughness: .7 }), .1, g, 0, 16.5, -1);
  const fr = mat(0xffffff); for (const [w, h, xx, y] of [[.5, 6.6, -3.1, 3.3], [.5, 6.6, 3.1, 3.3], [6.7, .5, 0, 6.6]]) box(w, h, 1.3, fr, .05, g, xx, y, .2);
  const HN = G(g, -2.85, 0, .1); const dc = [0x2a6a4a, 0x8a2a2a, 0x2a4a8a, 0x6a3a8a][ci % 4]; box(5.7, 6.3, .3, mat(dc, { roughness: .4 }), .06, HN, 2.85, 3.15, 0); sphere(.2, mat(0xd9a531, { metalness: .8 }), HN, 5.0, 3.2, .3, 8, 6);
  for (const y of [1.6, 4.7]) box(4.4, 2.2, .1, mat(dc * 0 + 0x000000, { transparent: true, opacity: .14 }), .02, HN, 2.85, y, .18);
  const nb = textPlane(.9, .9, 64, 64, (c, w, h) => { c.fillStyle = '#1a3a7a'; c.fillRect(0, 0, w, h); txt(c, String(num), w / 2, h / 2 + 2, 44, '#ffffff'); }); nb.position.set(3.9, 5.6, .52); g.add(nb);
  const nm = textPlane(1.6, .5, 160, 50, (c, w, h) => { c.fillStyle = '#d8c8a0'; c.fillRect(0, 0, w, h); txt(c, 'ADRIAN', w / 2, h / 2 + 2, 34, '#3a2a1a'); }); nm.position.set(3.9, 3.6, .52); g.add(nm); sphere(.12, glowM(0xfff4c0, 1), g, 3.9, 3.0, .55, 8, 6);
  const L = G(g, -4.2, 6.2, .9); box(.8, 1.1, .8, mat(0x1a1a1e, { metalness: .6 }), .05, L, 0, 0, 0); const bulb = sphere(.32, glowM(0xffd88a, 2.2), L, 0, 0, 0, 10, 8);
  const mt = textPlane(3.2, 1.6, 200, 100, (c, w, h) => { c.fillStyle = '#7a5a2a'; c.fillRect(0, 0, w, h); txt(c, 'WILLKOMMEN', w / 2, h / 2 + 3, 30, '#f2e2c0'); }); mt.rotation.x = -Math.PI / 2; mt.position.set(0, .06, 2); g.add(mt);
  for (let k = 0; k < 2; k++) { const p = G(g, k ? 5.4 : -5.4, 0, 1.6); cyl(.8, .6, 1.4, mat(0xb8642a), 12, p, 0, .7, 0); sphere(.9, mat(0x3a8a3a, { roughness: 1 }), p, 0, 1.9, 0, 10, 8); }
  // interior oscuro detrás de la puerta (salón con lámpara)
  box(6, 7, .3, mat(0x5a3a2a), 0, g, 0, 3.5, -6); const IL = new THREE.PointLight(0xffc880, 0, 18, 1.6); IL.position.set(0, 4, -3); g.add(IL); box(.3, 7, 6, mat(0xd8b88a), 0, g, -3, 3.5, -3); box(.3, 7, 6, mat(0xd8b88a), 0, g, 3, 3.5, -3); box(6, .3, 6, mat(0x8a6a4a), 0, g, 0, .05, -3);
  g.userData = { hinge: HN, light: IL, bulb, setOpen: k => { HN.rotation.y = -k * 1.6; IL.intensity = k * 60; } }; g.userData.setOpen(0); return shade(g); }

// ---------- urna y pizarra de la nueva regel ----------
export function ruleBoard(parent) { const g = G(parent); const wd = mat(0x6a4a2a); for (const s of [-1, 1]) { const l = box(.3, 9, .3, wd, .05, g, s * 3.6, 4.5, 0); l.rotation.z = s * -.06; }
  const P = dynPlane(7.6, 5.6, 608, 448); P.position.set(0, 6.4, .2); g.add(P); box(8, 6, .2, mat(0x1e3a2a), .05, g, 0, 6.4, 0);
  g.userData.set = (k = 0) => P.userData.draw(k, (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8a050'; c.lineWidth = 12; c.strokeRect(6, 6, w - 12, h - 12);
    txt(c, 'NEUE REGEL', w / 2, 66, 64, '#ffd23f'); txt(c, 'Jeder braucht', w / 2, 160, 50, '#ffffff'); txt(c, 'einen anderen', w / 2, 220, 50, '#ffffff'); txt(c, 'Namen!', w / 2, 284, 60, '#ffffff');
    if (k) { txt(c, 'JA ✓', w / 2, 380, 70, '#8aff9a'); } }); g.userData.set(0); return shade(g); }
export function urne(parent) { const g = G(parent); box(3, 3, 3, new THREE.MeshStandardMaterial({ color: 0xe8f4ff, transparent: true, opacity: .45, roughness: .05 }), .1, g, 0, 1.5, 0); box(3.1, .2, 3.1, mat(0x2a4ab8), .05, g, 0, 3.05, 0); box(1.4, .1, .2, mat(0x111111), 0, g, 0, 3.16, 0);
  for (let k = 0; k < 9; k++) { const p = box(.9, .02, .6, mat(0xffffff), 0, g, -.8 + (k % 3) * .8, .3 + Math.floor(k / 3) * .1, -.6 + (k % 2) * .7); p.rotation.y = k; } return g; }

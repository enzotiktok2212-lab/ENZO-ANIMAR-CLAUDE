// FAST — reparto y escenarios propios: la conductora del tranvía, el del döner, el profesor de autoescuela, el árbitro,
// el Beinahe-Mann (hombre gris altísimo con abrigo largo y sombrero), tranvía amarillo, coche de autoescuela, frascos de fuerza,
// parrilla de Papa, nieve, y el Ninja-Parcours de Hufenbach (salida, pared, cuerdas, barras, escalones, torre con el botón dorado).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, outline } from './engine.js';
import { mk, hairS, cap, mustache, glasses, txt, FONT, tree } from './props.js';
import { townhouse } from './gort.js';
import { bus } from './pech.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const plane = (w, h, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const glow = (col, k = 1.5) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .4 });
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const stripesT = (a, b, n = 8, vert = true) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let i = 0; i < n; i += 2) vert ? c.fillRect(i * w / n, 0, w / n, h) : c.fillRect(0, i * h / n, w, h / n); }, true);

// ---------- reparto ----------
// Straßenbahnfahrerin (≈40): media melena castaña, gorra azul marino con ribete dorado, camisa celeste, chaleco azul, pantalón marino.
export function makeFahrerin(scene) { return mk(scene, S({ seed: 5101, scale: .95, skin: 0xf2c0a0, shirt: 0xa8d0f0, shirt2: 0xa8d0f0, cuffs: 0x1a2a5a, pants: 0x1a2a4a, shoes: 0x1a1a1a, hair: 0x7a4a24, hairBuild: hairS(0x7a4a24, 'long'),
  torsoDetail: sp => { box(2.08, 2.0, 1.1, mat(0x1a2a5a, { roughness: .6 }), .12, sp, 0, 1.0, 0); box(.5, 1.0, .06, mat(0xa8d0f0), .02, sp, 0, 1.5, .56); box(.5, .4, .05, mat(0xe9c23a, { metalness: .8 }), .02, sp, -.6, 1.55, .58); }, face: { iris: '#3a6a3a', browColor: '#5a3418', blush: .45 } }),
  [o => cap(o.head, 0x1a2a4a, 0xe9c23a)]); }
// Dönermann (≈45): pelo negro corto, bigote poblado, camiseta blanca, delantal rojo, gorrito blanco de papel.
export function makeDoener(scene) { return mk(scene, S({ seed: 5102, scale: 1.04, skin: 0xd09a72, shirt: 0xf8f8f8, shirt2: 0xf8f8f8, cuffs: 0xd8323a, pants: 0x2a2a34, shoes: 0x1a1a1a, hair: 0x1a1410, hairBuild: hairS(0x1a1410, 'fringe'), sleeveShort: true,
  torsoDetail: sp => { box(2.06, 2.04, 1.1, mat(0xf8f8f8, { roughness: .8 }), .12, sp, 0, 1.0, 0); box(1.6, 1.7, .08, mat(0xd8323a, { roughness: .8 }), .04, sp, 0, .8, .57); }, face: { iris: '#2a1a10', browColor: '#1a1410', blush: .3 } }),
  [o => mustache(o.head, 0x1a1410), o => { const m = mat(0xffffff, { roughness: 1 }); box(1.3, .45, 1.24, m, .1, o.head, 0, 1.5, 0); }]); }
// Fahrlehrer: raya al lado, gafas, polo azul con logo, pantalón beige, carpeta.
export function makeLehrer(scene) { return mk(scene, S({ seed: 5103, scale: 1.0, skin: 0xe8b898, shirt: 0x2a6ad8, shirt2: 0x2a6ad8, cuffs: 0xffffff, pants: 0xc8b48a, shoes: 0x4a2a1a, hair: 0x6a5a4a, hairBuild: hairS(0x6a5a4a, 'fringe'),
  torsoDetail: sp => { box(2.08, 2.04, 1.1, mat(0x2a6ad8, { roughness: .7 }), .12, sp, 0, 1.0, 0); box(.8, .3, .1, mat(0xffffff), .04, sp, 0, 1.9, .55); box(.4, .4, .05, mat(0xffd23f), .02, sp, .55, 1.5, .57); }, face: { iris: '#3a5a3a', browColor: '#5a4a3a' } }), [o => glasses(o.head)]); }
// Schiedsrichter: camiseta de rayas blancas y negras, gorra negra, silbato colgando.
export function makeSchiri(scene) { return mk(scene, S({ seed: 5104, scale: 1.0, skin: 0xd8a07a, shirtMap: stripesT('#f4f4f4', '#1a1a1a', 8), shirt2: null, cuffs: 0x1a1a1a, pants: 0x1a1a1a, shoes: 0x1a1a1a, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'fringe'),
  face: { iris: '#2a1a10', browColor: '#2a1a10' } }), [o => cap(o.head, 0x1a1a1a, 0xffffff), o => { cyl(.03, .03, 1.4, mat(0xd8323a), 4, o.spine, 0, 1.6, .6); const w = cyl(.14, .14, .4, mat(0xd8dce4, { metalness: .9 }), 8, o.spine, 0, .9, .64); w.rotation.z = Math.PI / 2; }]); }
// Beinahe-Mann: altísimo, piel gris pálida, abrigo largo gris hasta los tobillos, sombrero de ala, manos largas.
export function makeBeinahe(scene) { const coat = mat(0x5a5e6a, { roughness: .8 }), dk = mat(0x2a2c34, { roughness: .7 });
  return mk(scene, S({ seed: 5105, scale: 1.55, skin: 0xb8bcc8, shirt: 0x5a5e6a, shirt2: 0x5a5e6a, cuffs: 0x2a2c34, pants: 0x2a2c34, shoes: 0x1a1a1e, hair: 0x2a2c34, hairBuild: () => {},
    torsoDetail: sp => { box(2.2, 2.12, 1.2, coat, .14, sp, 0, 1.0, 0); for (const s of [-1, 1]) { const l = box(.5, 1.6, .08, dk, .02, sp, s * .4, 1.4, .62); l.rotation.z = s * .3; } for (let k = 0; k < 3; k++) sphere(.09, mat(0x1a1a1e), sp, .22, 1.3 - k * .4, .63, 6, 4); },
    face: { iris: '#e8e000', browColor: '#2a2c34' } }),
  [o => { const h = mat(0x2a2c34, { roughness: .6 }); cyl(.7, .74, .9, h, 20, o.head, 0, 1.62, 0); cyl(1.35, 1.35, .08, h, 24, o.head, 0, 1.2, 0); cyl(.76, .76, .2, mat(0x8a1a2a), 20, o.head, 0, 1.3, 0); },
   o => { const sk = G(o.hips); box(2.3, 3.4, 1.3, coat, .2, sk, 0, -1.5, 0); },
   o => { for (const a of [o.aL, o.aR]) { a.hand.scale.set(.9, 1.5, .9); } }]); }

// ---------- vehículos ----------
// tranvía amarillo de dos coches con pantógrafo; rieles aparte (rails)
export function tram(parent) { const g = G(parent); const a = bus(g, 0xf2c23a, '3  Marktplatz'); const b = bus(g, 0xf2c23a, '3'); b.position.z = -27; a.userData.wheels?.forEach(w => w.visible = false);
  for (const z of [0, -27]) { const pg = G(g, 0, 8.4, z); box(3, .3, 3, mat(0x2a2a30), .05, pg, 0, 0, 0); const r1 = box(.15, 3.4, .15, mat(0x3a3a40, { metalness: .7 }), 0, pg, 0, 1.6, -.8); r1.rotation.x = .5; const r2 = box(.15, 3.4, .15, mat(0x3a3a40, { metalness: .7 }), 0, pg, 0, 1.6, .8); r2.rotation.x = -.5; box(3.4, .15, .3, mat(0x3a3a40), 0, pg, 0, 3.1, 0); }
  box(4, 5, 1, mat(0x2a2a30), .2, g, 0, 4.4, -13.5); for (const z of [-6, 6, -21, -33]) box(6.6, .5, 1.2, mat(0xd8323a), .05, g, 0, 2.6, z); return shade(g); }
export function rails(parent, x, z0, z1) { const g = G(parent); const L = z1 - z0; for (const s of [-1.4, 1.4]) box(.3, .25, L, mat(0xa8acb4, { metalness: .8, roughness: .3 }), 0, g, x + s, .12, (z0 + z1) / 2); for (let z = z0; z < z1; z += 2.4) box(4, .12, .6, mat(0x5a4a3a), 0, g, x, .07, z);
  for (let z = z0; z < z1; z += 30) { cyl(.18, .18, 14, mat(0x4a4e58, { metalness: .6 }), 8, g, x - 6, 7, z); box(6, .15, .15, mat(0x4a4e58), 0, g, x - 3, 13.6, z); } const w = cyl(.03, .03, L, mat(0x2a2a2a), 4, g, x, 13, (z0 + z1) / 2); w.rotation.x = Math.PI / 2; return g; }
// coche de autoescuela: rojo, cartel FAHRSCHULE en el techo, L en las puertas
export function fahrschulAuto(parent) { const g = G(parent); const r = mat(0xd8323a, { roughness: .3, metalness: .2 }), dk = mat(0x1a1a1e), gl = mat(0x9fd0ef, { roughness: .05, metalness: .3, transparent: true, opacity: .55 });
  box(5.4, 2.2, 10, r, .6, g, 0, 1.9, 0); box(4.8, 2.2, 5.4, r, .5, g, 0, 3.9, -.6); box(4.9, 1.6, 5.2, gl, .3, g, 0, 4.0, -.6); for (const s of [-1, 1]) for (const z of [-3.2, 3.2]) { const w = cyl(1, 1, .7, mat(0x161618), 16, g, s * 2.6, 1, z); w.rotation.z = Math.PI / 2; cyl(.45, .45, .75, mat(0xc0c0c8, { metalness: .8 }), 10, g, s * 2.62, 1, z).rotation.z = Math.PI / 2; }
  const sg = textPlane(4, 1.2, 320, 96, (c, w, h) => { c.fillStyle = '#2a6ad8'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 16); c.fill(); txt(c, 'FAHRSCHULE', w / 2, h / 2 + 3, 54, '#ffffff'); }); for (const s of [-1, 1]) { const p = sg.clone(); p.position.set(0, 5.95, -.6 + s * .06); p.rotation.y = s > 0 ? 0 : Math.PI; g.add(p); } box(4.2, 1.3, .1, mat(0x2a6ad8), .05, g, 0, 5.95, -.6);
  const L = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a6ad8'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6); txt(c, 'L', w / 2, h / 2 + 3, 50, '#2a6ad8'); }); for (const s of [-1, 1]) { const p = L.clone(); p.position.set(s * 2.72, 2.2, 1); p.rotation.y = s * Math.PI / 2; g.add(p); }
  for (const s of [-1, 1]) { sphere(.35, mat(0xffffff, { emissive: 0xfff4c0, emissiveIntensity: 2 }), g, s * 1.8, 2.2, 5.0); } box(5, .6, .4, dk, .2, g, 0, 1.2, 5.1); box(5, .6, .4, dk, .2, g, 0, 1.2, -5.1); return shade(g); }
export function cone(parent) { const g = G(parent); box(1.4, .2, 1.4, mat(0xff6a1a), .05, g, 0, .1, 0); const c = new THREE.Mesh(new THREE.ConeGeometry(.55, 1.8, 14), mat(0xff6a1a, { roughness: .5 })); c.position.y = 1.1; g.add(c); const s = cyl(.38, .44, .3, mat(0xffffff), 14, g, 0, 1.15, 0); return shade(g); }

// ---------- utilería ----------
// orbe de fuerza (luz líquida verde-dorada) y frasco de cristal con tapa
export function orb(parent, r = .6) { const g = G(parent); const c = sphere(r, glow(0x7aff4a, 2.6), g, 0, 0, 0, 16, 12); const h = sphere(r * 1.6, new THREE.MeshBasicMaterial({ color: 0xb8ff6a, transparent: true, opacity: .25, depthWrite: false }), g, 0, 0, 0, 16, 12); g.userData = { c, h }; return g; }
export function jar(parent, full = true) { const g = G(parent); const gl = new THREE.MeshStandardMaterial({ color: 0xd8f0ff, roughness: .05, metalness: .1, transparent: true, opacity: .35, depthWrite: false });
  cyl(.8, .8, 2.2, gl, 18, g, 0, 1.1, 0); cyl(.86, .86, .4, mat(0x8a6a3a, { metalness: .4 }), 18, g, 0, 2.35, 0); const o = full ? orb(g, .55) : null; if (o) o.position.y = 1.0;
  const lb = textPlane(1, .5, 80, 40, (c, w, h) => { c.fillStyle = '#f4e8c8'; c.fillRect(0, 0, w, h); txt(c, 'KRAFT', w / 2, h / 2 + 2, 22, '#5a3a1a'); }); lb.position.set(0, .7, .81); g.add(lb); g.userData.orb = o; return g; }
// estantería de frascos (para la torre y la guarida)
export function jarShelf(parent, rows = 3, cols = 5) { const g = G(parent); const wd = mat(0x6a4a2a, { roughness: .8 }); for (let r = 0; r <= rows; r++) box(cols * 2.2 + .6, .3, 2.2, wd, .05, g, 0, r * 3.2, 0); for (const s of [-1, 1]) box(.3, rows * 3.2, 2.2, wd, .05, g, s * (cols * 1.1 + .3), rows * 1.6, 0);
  const J = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const j = jar(g); j.position.set(-cols * 1.1 + 1.1 + c * 2.2, r * 3.2 + .15, 0); J.push(j); } g.userData.J = J; return g; }
// parrilla de carbón con salchichas (las salchichas se pueden quemar: setBurn(k))
export function grill(parent) { const g = G(parent); const bl = mat(0x1a1a1e, { roughness: .4, metalness: .5 }); const bowl = new THREE.Mesh(new THREE.SphereGeometry(2, 20, 10, 0, 6.283, Math.PI / 2, Math.PI / 2), bl); bowl.position.y = 4; g.add(bowl);
  for (let k = 0; k < 3; k++) { const a = k * 2.094; const l = cyl(.12, .12, 4, bl, 6, g, Math.cos(a) * 1.2, 2, Math.sin(a) * 1.2); l.rotation.set(Math.sin(a) * .3, 0, -Math.cos(a) * .3); }
  const coal = cyl(1.8, 1.8, .2, glow(0xff5a1a, 1.4), 18, g, 0, 3.7, 0); for (let k = -4; k <= 4; k++) cyl(.04, .04, 3.9, mat(0xc0c0c8, { metalness: .9 }), 4, g, k * .42, 4.05, 0).rotation.x = Math.PI / 2;
  const SS = []; for (let k = 0; k < 5; k++) { const s = cyl(.22, .22, 2.2, mat(0xe0a070, { roughness: .5 }), 10, g, -1.2 + k * .6, 4.3, 0); s.rotation.x = Math.PI / 2; SS.push(s); }
  g.userData.setBurn = k => SS.forEach((s, i) => s.material.color.setRGB(.88 - .8 * Math.min(1, k * (1 + i * .15)), .63 - .6 * Math.min(1, k * (1 + i * .15)), .44 - .42 * Math.min(1, k))); return shade(g); }
// crucigrama (una casilla vacía; con done = true, la última letra puesta)
export function kreuzwort(done = false) { return textPlane(4.4, 3.4, 352, 272, (c, w, h) => { c.fillStyle = '#f6f2e6'; c.fillRect(0, 0, w, h); txt(c, 'KREUZWORTRÄTSEL', w / 2, 22, 22, '#1a1a2a'); const n = 9, s = 26, x0 = (w - n * s) / 2, y0 = 42; const L = 'HUFENBACHGLÜCKLICH'.split('');
  for (let i = 0; i < n; i++) for (let j = 0; j < 8; j++) { const blk = (i * 3 + j * 5) % 7 === 0; c.fillStyle = blk ? '#1a1a2a' : '#ffffff'; c.fillRect(x0 + i * s, y0 + j * s, s - 2, s - 2); if (!blk && !(i === 6 && j === 4 && !done)) { c.fillStyle = '#2a3a8a'; c.font = `700 18px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(L[(i + j * 2) % L.length], x0 + i * s + 12, y0 + j * s + 13); } }
  c.strokeStyle = done ? '#2ab84a' : '#ff2a4a'; c.lineWidth = 4; c.strokeRect(x0 + 6 * s - 2, y0 + 4 * s - 2, s + 2, s + 2); }); }
// nieve instanciada
export function snow(scene, n = 400) { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(.14, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), n); im.frustumCulled = false; scene.add(im); const r = RNG(31), seed = Array.from({ length: n }, () => [r(), r(), r(), .5 + r() * .5]); const M = new THREE.Matrix4();
  return { im, update(T, c, sx = 40, sz = 40, h = 30, on = true) { im.visible = on; if (!on) return; seed.forEach(([a, b, d, sp], i) => { const y = h - ((T * 4 * sp + d * h) % h); M.makeTranslation(c.x + (a - .5) * sx + Math.sin(T * 1.3 + i) * .6, c.y + y, c.z + (b - .5) * sz); im.setMatrixAt(i, M); }); im.instanceMatrix.needsUpdate = true; } }; }
// meta de una carrera: arco hinchable con ZIEL y cinta
export function ziel(parent) { const g = G(parent); const m = mat(0xd8323a, { roughness: .5 }); for (const s of [-1, 1]) cyl(1.1, 1.1, 14, m, 16, g, s * 9, 7, 0); const top = cyl(1.1, 1.1, 18, m, 16, g, 0, 14, 0); top.rotation.z = Math.PI / 2;
  const t = textPlane(14, 2.6, 560, 104, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(0, 0, w, h, 20); c.fill(); txt(c, 'ZIEL', w / 2, h / 2 + 4, 88, '#d8323a'); }); t.position.set(0, 14, 1.2); g.add(t); const t2 = t.clone(); t2.rotation.y = Math.PI; t2.position.z = -1.2; g.add(t2);
  const tape = box(17, .3, .06, mat(0xffffff, { map: stripesT('#ffffff', '#d8323a', 16) }), 0, g, 0, 3.6, 0); g.userData.tape = tape; return shade(g); }
// barra de dominadas (portería de hierro)
export function pullBar(parent) { const g = G(parent); const m = mat(0x3a3e48, { metalness: .7, roughness: .3 }); for (const s of [-1, 1]) cyl(.18, .18, 10, m, 8, g, s * 3, 5, 0); const b = cyl(.12, .12, 6.4, mat(0xc0c4cc, { metalness: .9 }), 8, g, 0, 9.6, 0); b.rotation.z = Math.PI / 2; return shade(g); }
// tablón/pantalla de marcador con texto libre (draw(lines))
export function tafel(parent, w = 14, h = 8) { const cv = document.createElement('canvas'); cv.width = 560; cv.height = Math.round(560 * h / w); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const g = G(parent);
  box(w + .8, h + .8, .8, mat(0x1a1a22, { roughness: .4 }), .2, g, 0, 0, -.45); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); g.add(p); let last = '';
  g.userData.draw = (key, f) => { if (key === last) return; last = key; const c = cv.getContext('2d'); f(c, cv.width, cv.height); t.needsUpdate = true; }; return g; }

// ---------- Ninja-Parcours (X): pista que va de la salida (z = 44) a la torre (z = -44); gradas a los dos lados (x = ±24 … ±40) ----------
// obstáculos: pared curva (z ≈ 24, arriba y = 8), cuerdas sobre el agua (z 4…12, travesaño y = 15), barras (z -6…-16, y = 11),
// escalones (z -20…-30) y la torre (z = -40, plataforma y = 20) con el botón dorado y los frascos detrás. Marcador a la derecha.
export function parcours(scene, X) { const g = G(scene, X); const r = RNG(5);
  plane(900, 900, mat(0x4cb63e, { roughness: 1 }), g, 0, -.06, 0); plane(30, 110, mat(0xffffff, { map: canvasTex(64, 256, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#50c442' : '#46b438'; c.fillRect(0, i * h / 16, w, h / 16 + 1); } }), roughness: 1 }), g, 0, 0, 0);
  const blue = mat(0x2a8ad8, { roughness: .6 }), red = mat(0xe8323a, { roughness: .45 }), yel = mat(0xffd23f, { roughness: .45 }), met = mat(0x3a3e48, { metalness: .7, roughness: .3 }), wht = mat(0xf4f4f4, { roughness: .5 });
  // salida
  box(10, 1.2, 8, blue, .2, g, 0, .6, 44); const st = textPlane(8, 2, 400, 100, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'START', w / 2, h / 2 + 4, 86, '#2a8ad8'); }); st.position.set(0, .6, 48.05); st.rotation.x = 0; g.add(st);
  for (const s of [-1, 1]) cyl(.4, .4, 12, wht, 10, g, s * 6, 6, 44); const sa = textPlane(12, 2.4, 480, 96, (c, w, h) => { c.fillStyle = '#2a8ad8'; c.beginPath(); c.roundRect(0, 0, w, h, 16); c.fill(); txt(c, 'NINJA-PARCOURS', w / 2, h / 2 + 4, 64, '#ffffff'); }); sa.position.set(0, 12, 44); g.add(sa); const sb = sa.clone(); sb.rotation.y = Math.PI; g.add(sb);
  // pared curva (cuarto de tubo) z 20…28, arriba y = 8 con plataforma
  const W = G(g, 0, 0, 24); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI / 2; const b = box(10, .5, 1.3, red, .05, W, 0, 4 - Math.cos(a) * 4 + .25, 4 - Math.sin(a) * 4); b.rotation.x = a; } box(10, 8, .6, red, .1, W, 0, 4, -.3); box(10, .6, 4, mat(0xc8283a), .05, W, 0, 8.2, -2.2);
  box(10, 8, 4, mat(0xc8283a), .05, W, 0, 4, -2.2); const ws = textPlane(6, 1.6, 300, 80, (c, w, h) => { txt(c, 'WAND', w / 2, h / 2 + 3, 64, '#ffffff', '#5a0010', 8); }); ws.position.set(0, 6.4, 4.1); W.add(ws);
  // agua (pool) bajo cuerdas y barras: z 12 … -18
  const water = plane(14, 34, mat(0x2ab8f0, { roughness: .1, metalness: .2, emissive: 0x0a3a6a, emissiveIntensity: .3 }), g, 0, .15, -3); box(15, 1, 35, mat(0x1a5aa8), .1, g, 0, -.3, -3);
  // plataformas entre obstáculos
  box(10, 8, 4, red, .1, g, 0, 4, 16); box(10, 8.2, 3, yel, .1, g, 0, 4.1, -.5);
  // cuerdas: travesaño y = 15 entre z = 13 y z = 2
  for (const s of [-1, 1]) for (const z of [13.5, 1.5]) cyl(.35, .35, 16, met, 10, g, s * 6, 8, z); for (const s of [-1, 1]) { const b = cyl(.3, .3, 12, met, 10, g, s * 6, 15.8, 7.5); b.rotation.x = Math.PI / 2; } const cb = cyl(.3, .3, 12, met, 10, g, 0, 15.8, 7.5); cb.rotation.x = Math.PI / 2;
  const ROPES = []; for (const z of [11, 7.5, 4]) { const rp = G(g, 0, 15.6, z); cyl(.18, .18, 9, mat(0xc8a060, { roughness: 1 }), 8, rp, 0, -4.5, 0); sphere(.4, mat(0xa8803a, { roughness: 1 }), rp, 0, -9, 0, 8, 6); ROPES.push(rp); }
  // barras (Stangen): y = 11, z -4 … -16
  box(10, 8.2, 3, yel, .1, g, 0, 4.1, -18.5); for (const s of [-1, 1]) for (const z of [-3, -17]) cyl(.35, .35, 11.6, met, 10, g, s * 3, 5.8, z); for (const s of [-1, 1]) { const b = cyl(.25, .25, 14.6, met, 8, g, s * 3, 11.4, -10); b.rotation.x = Math.PI / 2; }
  const BARS = []; for (let k = 0; k < 9; k++) { const b = cyl(.14, .14, 6, mat(0xd8dce4, { metalness: .9, roughness: .2 }), 8, g, 0, 11.4, -4 - k * 1.5); b.rotation.z = Math.PI / 2; BARS.push(b); }
  // escalones (Stufen): z -22 … -32, cada vez más altos, alternando lado
  const STEPS = []; for (let k = 0; k < 5; k++) { const h = 5 + k * 1.4, s = k % 2 ? 1 : -1; const sp = G(g, s * 1.6, 0, -22.5 - k * 2.6); const top = box(3, .6, 2.4, k === 4 ? yel : blue, .1, sp, 0, h, 0); top.rotation.z = -s * .35; cyl(.3, .3, h, met, 8, sp, 0, h / 2, 0); STEPS.push({ g: sp, h, s, x: s * 1.6, z: -22.5 - k * 2.6 }); }
  plane(16, 16, mat(0x2a8ad8, { roughness: .8 }), g, 0, .2, -27);
  // torre: base de red/escalada (frente en z = -36) y plataforma arriba (y = 20)
  const TW = G(g, 0, 0, -41); box(12, 20, 10, mat(0x4a8ae8, { roughness: .6 }), .2, TW, 0, 10, 0); for (let i = 0; i < 6; i++) for (let j = 0; j < 9; j++) sphere(.35, mat([0xffd23f, 0x3ab86a, 0xff8a3a, 0xff4a8a][(i + j) % 4]), TW, -5 + i * 2, 1.5 + j * 2.1, 5.1, 6, 4);
  box(14, .8, 12, wht, .1, TW, 0, 20.4, 0); for (const s of [-1, 1]) box(.3, 2, 12, mat(0xd8dce4, { metalness: .6 }), 0, TW, s * 7, 21.8, 0); box(14, 2, .3, mat(0xd8dce4, { metalness: .6 }), 0, TW, 0, 21.8, -6);
  // botón dorado en un pedestal (en el borde delantero) y frascos detrás, en una vitrina
  const PED = G(TW, 0, 20.8, 2.2); box(2.4, 2.6, 2.4, mat(0xf4f4f4, { roughness: .4 }), .2, PED, 0, 1.3, 0); box(2.6, .3, 2.6, mat(0xd9a531, { metalness: .8, roughness: .3 }), .05, PED, 0, 2.5, 0); const BTN = cyl(1.5, 1.6, .8, new THREE.MeshStandardMaterial({ color: 0xffc81a, emissive: 0xffa800, emissiveIntensity: .9, metalness: .8, roughness: .2 }), 24, PED, 0, 2.9, 0);
  const SHELF = jarShelf(TW, 2, 5); SHELF.position.set(0, 21.2, -3.4); const vit = box(12.4, 7, .2, new THREE.MeshStandardMaterial({ color: 0xd8f0ff, roughness: .05, transparent: true, opacity: .25, depthWrite: false }), .05, TW, 0, 24.4, -2);
  const BTNL = new THREE.PointLight(0xffc040, 0, 18, 1.6); BTNL.position.set(0, 25, 2); TW.add(BTNL); const JL = new THREE.PointLight(0x8aff4a, 20, 20, 1.6); JL.position.set(0, 25, -1); TW.add(JL);
  // marcador (derecha, junto a la torre)
  const SB = tafel(g, 16, 9); SB.position.set(18, 22, -36); SB.rotation.y = -.5; for (const s of [-1, 1]) cyl(.4, .4, 18, met, 10, g, 18 + s * 6 * Math.cos(.5), 9, -36 + s * 6 * Math.sin(.5) * -1 + 0);
  // gradas: 6 filas a cada lado (x = ±24…±40), de z = -30 a z = 40
  const stM = mat(0xb8bcc8, { roughness: .8 }), seatM = [mat(0xd8323a), mat(0x2a6ad8), mat(0xffd23f)]; const SEATS = [];
  for (const s of [-1, 1]) for (let rr = 0; rr < 6; rr++) { const x = s * (22 + rr * 2.8); box(2.8, 1.4 + rr * 1.4, 70, stM, .05, g, x, (1.4 + rr * 1.4) / 2, 5); box(.6, .4, 70, seatM[rr % 3], .05, g, x - s * .9, 1.6 + rr * 1.4, 5); for (let z = -28; z <= 38; z += 2.2) SEATS.push({ x: x, y: 1.4 + rr * 1.4, z: z + (rr % 2) * 1.1, ry: -s * Math.PI / 2 }); }
  for (const s of [-1, 1]) { box(1, 12, 72, mat(0x8a8e9a), .05, g, s * 39.5, 6, 5); const bn = textPlane(40, 3.4, 1000, 85, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.font = `700 62px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('NINJA-PARCOURS HUFENBACH  ★  NINJA-PARCOURS HUFENBACH', w / 2, h / 2 + 3); }); bn.position.set(s * 20.4, 1.8, 5); bn.rotation.y = -s * Math.PI / 2; g.add(bn); }
  // focos y banderines
  for (const [x, z] of [[-42, -30], [-42, 38], [42, -30], [42, 38]]) { cyl(.5, .7, 34, met, 10, g, x, 17, z); box(6, 3, 1, mat(0x2a2a34), .1, g, x, 34, z); }
  // pueblo alrededor: casas de entramado detrás de las gradas y al fondo, colinas, árboles
  let ci = 3; for (let z = -60; z <= 70; z += 17) { townhouse(g, -52, z, 15, 2 + ci % 3, ci++, Math.PI / 2); townhouse(g, 52, z, 15, 2 + ci % 3, ci++, -Math.PI / 2); }
  for (let x = -60; x <= 60; x += 16) townhouse(g, x, -66, 15, 3 + ci % 3, ci++, 0); for (let x = -60; x <= 60; x += 16) townhouse(g, x, 86, 15, 2 + ci % 2, ci++, Math.PI);
  for (let x = -100; x <= 100; x += 20) townhouse(g, x, -100, 18, 4 + (ci % 3), ci++, 0);
  for (let k = 0; k < 10; k++) tree(g, -48 + k * 11, -56, .9);
  shade(g); water.receiveShadow = true; outline(W, 1.2);
  return { g, W, ROPES, BARS, STEPS, TW, PED, BTN, BTNL, SHELF, vit, SB, SEATS, JL }; }

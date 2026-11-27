// Tierwurf — escenarios: la calle con barras de dominadas (ORT), el campo de lanzamiento (FELD), garaje, jardín trasero,
// baño de la Oma, cocina, mi cuarto, la tienda (goldener Käse), la costa con la casa del alcalde, la plaza de noche y
// los seis paisajes del viaje del queso (bosque, desierto, volcán, feria embrujada, nubes, tierra del sol negro).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp } from './engine.js';
import { noiseTex, tree, lamp, skyscraper, building, fountain, bench, hydrant } from './props.js';
import { house } from './pech.js';
import { FONT } from './sets.js';
import { GOLD } from './brainrots.js';
export { FONT };
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const glow = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const plane = (w, h, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const grassT = (a = '#5cc24a') => noiseTex(a, ['#4aae3a', '#6cd45a', '#58bc48'], 2400, 3, 1);
const mowT = () => canvasTex(256, 256, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#5ccc4a' : '#4cb83e'; c.fillRect(0, i * h / 8, w, h / 8 + 1); } const r = RNG(3); for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(${r() < .5 ? '30,90,20' : '140,230,110'},.25)`; c.fillRect(r() * w, r() * h, 2, 3); } }, true);
const tilesT = (a, b, n = 8) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(i * w / n, 0); c.lineTo(i * w / n, h); c.moveTo(0, i * h / n); c.lineTo(w, i * h / n); c.stroke(); } }, true);
const checkT = (a, b, n = 4) => canvasTex(128, 128, (c, w, h) => { const s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = (i + j) % 2 ? a : b; c.fillRect(i * s, j * s, s, s); } }, true);
const plankT = (hue = 28) => canvasTex(128, 128, (c, w, h) => { const r = RNG(4); for (let y = 0; y < h; y += 16) { c.fillStyle = `hsl(${hue},${45 + r() * 10}%,${46 + r() * 8}%)`; c.fillRect(0, y, w, 16); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y, w, 2); c.fillRect((r() * w) | 0, y, 2, 16); } }, true);
const stripeT = (a, b, n = 8) => canvasTex(128, 128, (c, w, h) => { for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? b : a; c.fillRect(i * w / n, 0, w / n + 1, h); } }, true);
// cartel con texto (tablero de madera o pintado)
export function signBoard(text, w = 6, h = 2, bg = '#ffffff', fg = '#1a1a2a', border = '#d8323a', em = 0) { return textPlane(w, h, Math.round(w * 64), Math.round(h * 64), (c, W, H) => { c.fillStyle = border; c.beginPath(); c.roundRect(0, 0, W, H, H * .18); c.fill(); c.fillStyle = bg; c.beginPath(); c.roundRect(H * .08, H * .08, W - H * .16, H * .84, H * .14); c.fill();
  c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; let s = H * .58; c.font = `700 ${s}px ${FONT}`; const tw = c.measureText(text).width; if (tw > W * .86) { s *= W * .86 / tw; c.font = `700 ${s}px ${FONT}`; } c.fillText(text, W / 2, H * .54); }, em); }
// banderines de colores colgando entre dos puntos
export function bunting(p, a, b, n = 16, sag = 1.2) { const g = G(p); const cols = [0xff4a6a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xb86aff, 0xff8a3a]; const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const pts = []; for (let i = 0; i <= 20; i++) { const k = i / 20, q = A.clone().lerp(B, k); q.y -= Math.sin(k * Math.PI) * sag; pts.push(q); } const line = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, .05, 4), mat(0xf4f4f4)); g.add(line);
  for (let i = 1; i < n; i++) { const k = i / n, q = A.clone().lerp(B, k); q.y -= Math.sin(k * Math.PI) * sag; const f = new THREE.Mesh(new THREE.ConeGeometry(.55, 1.3, 3), mat(cols[i % cols.length], { roughness: .7, side: THREE.DoubleSide })); f.rotation.x = Math.PI; f.scale.z = .15; f.position.copy(q).add(V3(0, -.65, 0)); f.lookAt(q.x + (B.z - A.z), q.y - .65, q.z - (B.x - A.x)); f.rotateX(Math.PI); g.add(f); } return g; }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
// nubes de algodón
function cloud(p, x, y, z, s = 1) { const g = G(p, x, y, z); g.scale.setScalar(s); const m = mat(0xffffff, { roughness: 1, emissive: 0xffffff, emissiveIntensity: .25 }); for (let k = 0; k < 6; k++) sphere(3 + (k % 3), m, g, (k - 2.5) * 3.2, Math.sin(k * 2) * 1.2, Math.cos(k * 3) * 1.5, 14, 10); return g; }
// montaña de picos con nieve
function mountain(p, x, z, r, h, col = 0x6a8a6a) { const g = G(p, x, 0, z); const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), mat(col, { roughness: .9, flatShading: true })); m.position.y = h / 2; g.add(m); const s = new THREE.Mesh(new THREE.ConeGeometry(r * .36, h * .36, 7), mat(0xffffff, { roughness: .6, flatShading: true })); s.position.y = h * .82; g.add(s); return g; }
// barras de dominadas: dos postes de color + barra
export function bars(p, x, z, ry = 0, col = 0x2a6ad8, hgt = 7.4) { const g = G(p, x, 0, z); g.rotation.y = ry; const m = mat(col, { roughness: .35 }); for (const s of [-1, 1]) { cyl(.22, .26, hgt + .4, m, 12, g, s * 2.4, (hgt + .4) / 2, 0); cyl(.5, .6, .3, mat(0x3a3a44), 12, g, s * 2.4, .15, 0); } const bar = cyl(.13, .13, 5.2, mat(0xd8dce4, { metalness: .9, roughness: .2 }), 10, g, 0, hgt, 0); bar.rotation.z = Math.PI / 2;
  const mt = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 3.2), mat(0x3a3a44, { roughness: .95 })); mt.rotation.x = -Math.PI / 2; mt.position.y = .06; g.add(mt); g.userData.h = hgt; return g; }
// cielo/fondo: montañas nevadas + ciudad de rascacielos lejana
function backdrop(p, z0, dir = -1, span = 300) { const g = G(p); const r = RNG(Math.abs(z0) + 5); for (let k = 0; k < 9; k++) mountain(g, -span + k * span / 4 + (r() - .5) * 30, z0 + dir * (40 + r() * 60), 40 + r() * 30, 70 + r() * 50, [0x5a8a6a, 0x6a9a7a, 0x7a8aa0][k % 3]);
  for (let k = 0; k < 14; k++) { const w = 10 + r() * 10, h = 30 + r() * 70; skyscraper(g, -110 + k * 16 + (r() - .5) * 6, z0 + dir * (10 + r() * 20), w, h, w, ['#8fd8ff', '#a8e0ff', '#7ac8f4'][k % 3], ['#5ab0e8', '#6ac0f0', '#4aa0d8'][k % 3]); } return g; }

// =====================================================================================================
// ORT (X = 0): calle con casas de colores, aceras con barras de dominadas cada pocas casas, farolas y árboles,
// montañas y rascacielos al fondo. Zoohandlung cerrada (z = 58), colegio al final (z = -226). FEST = banderines y globos.
// =====================================================================================================
export function ort(scene) { const g = G(scene); const gr = plane(900, 900, mat(0xffffff, { roughness: 1, map: rep(grassT(), 80, 80) }), g, 0, -.05, -100);
  const asph = noiseTex('#4a5468', ['#424c60', '#525c70'], 2000, 2, 1); asph.repeat.set(2, 40); plane(16, 420, mat(0xffffff, { roughness: .9, map: asph }), g, 0, .04, -100);
  for (let z = 100; z > -300; z -= 7) box(.4, .04, 3.2, mat(0xffd23f, { roughness: .6 }), 0, g, 0, .08, z); for (const s of [-1, 1]) { box(.25, .04, 420, mat(0xf4f4f4), 0, g, s * 7.4, .08, -100); box(4.6, .3, 420, mat(0xffffff, { map: rep(tilesT('#e8e2d6', '#cfc6b6', 4), 2, 100), roughness: .85 }), .05, g, s * 10.3, .15, -100); box(.5, .4, 420, mat(0xb8b0a0), .05, g, s * 8, .2, -100); }
  const houses = []; let ci = 0; for (let z = 36; z > -200; z -= 22) for (const s of [-1, 1]) { const h = house(g, s * 24.5, z, ci++, s > 0 ? -Math.PI / 2 : Math.PI / 2); houses.push({ g: h, x: s * 24.5, z, s }); }
  const BARS = []; for (let z = 25; z > -200; z -= 22) for (const s of [-1, 1]) BARS.push(bars(g, s * 10.6, z + (s > 0 ? 6 : 0), Math.PI / 2, [0x2a6ad8, 0xd8323a, 0xffb21a, 0x2ab86a][BARS.length % 4]));
  for (let z = 30; z > -200; z -= 33) for (const s of [-1, 1]) { lamp(g, s * 9.2, z - 8, s); } for (let z = 14; z > -200; z -= 44) for (const s of [-1, 1]) tree(g, s * 12.8, z, .85);
  hydrant(g, 9.4, -2); bench(g, -11.2, -14, Math.PI / 2);
  // tienda de animales cerrada (ya nadie compra animales): escaparate polvoriento con jaulas vacías y cartel GESCHLOSSEN
  const zoo = G(g, -24.5, 0, 62); zoo.rotation.y = Math.PI / 2; box(18, 11, 12, mat(0xffffff, { roughness: .9, emissive: 0x3a2a10, emissiveIntensity: .35, map: rep(noiseTex('#f0d8a8', ['#e0c898', '#ffe8b8'], 800, 3, 1), 2, 2) }), .1, zoo, 0, 5.5, 0); box(18.6, 1, 12.6, mat(0x7a6a5a), .05, zoo, 0, 11.2, 0);
  const sb = signBoard('ZOOLADEN', 10, 2.4, '#e8e0c8', '#6a5a4a', '#7a6a5a'); sb.position.set(0, 9, 6.05); zoo.add(sb); const nt = signBoard('KEINE TIERE MEHR', 7.6, 1.5, '#ffffff', '#d8323a', '#d8323a'); nt.position.set(-2.5, 5.6, 6.25); nt.rotation.z = .05; zoo.add(nt); box(10, 5.4, .2, mat(0x8a9aa8, { roughness: .1, metalness: .5, transparent: true, opacity: .55 }), .05, zoo, -2.5, 3.8, 6.05);
  for (let k = 0; k < 3; k++) { const cg = G(zoo, -6 + k * 3.5, 1.2, 4.6); for (let i = 0; i < 7; i++) cyl(.04, .04, 2, mat(0x8a8a8a, { metalness: .8 }), 4, cg, -1 + i * .33, 1, 0); box(2.4, .1, 1.6, mat(0x8a8a8a), .02, cg, 0, 2, 0); box(2.4, .1, 1.6, mat(0x6a6a6a), .02, cg, 0, 0, 0); }
  const cl = signBoard('GESCHLOSSEN', 5.6, 1.4, '#d8323a', '#ffffff', '#8a1a1a'); cl.position.set(5.4, 4.4, 6.2); cl.rotation.z = -.12; zoo.add(cl); box(3, 5.6, .3, mat(0x5a4a3a), .05, zoo, 5.4, 2.8, 6.1);
  const web = textPlane(3, 3, 128, 128, (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 2; for (let k = 0; k < 7; k++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(k * .25) * w, Math.sin(k * .25) * h); c.stroke(); } for (let r = 20; r < w; r += 22) { c.beginPath(); c.arc(0, 0, r, 0, Math.PI / 2); c.stroke(); } }); web.position.set(-7.4, 6.4, 6.2); zoo.add(web);
  // colegio al final de la calle
  const sch = G(g, 0, 0, -236); const brick = mat(0xffffff, { map: rep(noiseTex('#e8a070', ['#d88a5a', '#f4b080'], 1200, 3, 1), 6, 3), roughness: .85 }); box(70, 16, 18, brick, .1, sch, 0, 8, 0); box(71, 1.2, 19, mat(0xf4f0e8), .05, sch, 0, 16.4, 0); box(14, 26, 14, brick, .1, sch, 0, 13, 2);
  const roofS = new THREE.Mesh(new THREE.ConeGeometry(11, 8, 4), mat(0x3a5a8a, { roughness: .7 })); roofS.rotation.y = Math.PI / 4; roofS.position.set(0, 30, 2); sch.add(roofS);
  const clk = cyl(3.4, 3.4, .5, mat(0xffffff), 32, sch, 0, 21, 9.2); clk.rotation.x = Math.PI / 2; const hand1 = box(.3, 2.6, .2, mat(0x1a1a2a), .05, sch, 0, 22, 9.6); hand1.geometry.translate(0, 0, 0); box(1.8, .3, .2, mat(0x1a1a2a), .05, sch, .8, 21, 9.6);
  const ss = signBoard('SCHULE', 10, 2.4, '#f4f0e8', '#2a3a6a', '#2a3a6a'); ss.position.set(0, 13.6, 9.15); sch.add(ss);
  for (let r = 0; r < 2; r++) for (let k = -4; k <= 4; k++) { if (Math.abs(k) < 1) continue; box(4.4, 3.6, .3, mat(0x9ad8ff, { roughness: .1, metalness: .4 }), .05, sch, k * 7.4, 5 + r * 6, 9.1); box(4.8, .4, .6, mat(0xf4f0e8), .05, sch, k * 7.4, 3 + r * 6, 9.3); }
  box(8, 7, .4, mat(0x2a6ad8, { roughness: .4 }), .05, sch, 0, 3.5, 9.1); box(70, .5, 2, mat(0xd8d4cc), .05, sch, 0, .25, 10);
  backdrop(g, -330); const BACK = backdrop(g, 250, 1);
  const CL = []; for (let k = 0; k < 14; k++) CL.push(cloud(g, -180 + k * 30, 70 + (k % 3) * 18, -260 - (k % 4) * 30 + (k % 2) * 420, 1.6 + (k % 3) * .4));
  // fiesta: banderines cruzando la calle, globos y pancarta
  const FEST = G(g); for (let z = 30; z > -150; z -= 18) bunting(FEST, [-10, 9, z], [10, 9, z - 4], 16, 1.4); const ban = signBoard('GROSSES FEST', 16, 3, '#ffd23f', '#d8323a', '#d8323a'); ban.position.set(0, 13, -40); FEST.add(ban); for (const s of [-1, 1]) cyl(.25, .25, 14, mat(0xf4f4f4), 8, FEST, s * 8.5, 7, -40);
  for (let k = 0; k < 18; k++) { const bx = (k % 2 ? 1 : -1) * (9 + (k % 3)), bz = 20 - k * 9; cyl(.02, .02, 5, mat(0xffffff), 3, FEST, bx, 9.5, bz); const bl = sphere(.9, mat([0xff4a6a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xb86aff][k % 5], { roughness: .2 }), FEST, bx, 12.5 + (k % 2), bz, 14, 10); bl.scale.y = 1.2; }
  FEST.visible = false;
  return { G: shade(g), houses, BARS, FEST, CL, zoo, sch }; }

// =====================================================================================================
// FELD (X): campo de lanzamiento. Círculo naranja en z = 0, pista de carrerilla hacia +z, líneas blancas, carteles de
// distancia (3 M z=-6, 10 M z=-16, 25 M z=-38, 100 M z=-96), gradas con público a la izquierda, arco WURFPLATZ,
// colina (z = -150), río (z = -64) y montaña (z = -260).
// =====================================================================================================
export const DIST = { 3: -6, 10: -16, 25: -38, 100: -96 };
export function feld(scene, X) { const g = G(scene, X); plane(900, 900, mat(0xffffff, { roughness: 1, map: rep(mowT(), 40, 40) }), g, 0, -.05, -100);
  const run = plane(6, 22, mat(0xffffff, { map: rep(stripeT('#ff8a2a', '#ffb83a', 6), 1, 4), roughness: .7 }), g, 0, .03, 12);
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.6, 4.4, 40), mat(0xff6a1a, { roughness: .6 })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, .05, 0); g.add(ring); const disc = new THREE.Mesh(new THREE.CircleGeometry(3.6, 40), mat(0xffc83a, { roughness: .7 })); disc.rotation.x = -Math.PI / 2; disc.position.set(0, .04, 0); g.add(disc);
  for (const s of [-1, 1]) box(.4, .05, 600, mat(0xffffff), 0, g, s * 14, .06, -280); for (const [d, z] of Object.entries(DIST)) { box(28, .05, .4, mat(0xffffff), 0, g, 0, .06, z);
    const post = G(g, 15.6, 0, z); cyl(.15, .15, 4, mat(0xf4f4f4), 8, post, 0, 2, 0); const s = signBoard(d + ' M', 3.6, 1.8, '#ffffff', '#1a1a2a', '#ff6a1a'); s.position.set(0, 4.6, 0); s.rotation.y = -Math.PI / 2 + .4; post.add(s); }
  // arco
  const arch = G(g, 0, 0, 3); for (const s of [-1, 1]) { cyl(.45, .5, 13, mat(0x2a6ad8, { roughness: .4 }), 12, arch, s * 8, 6.5, 0); sphere(.7, mat(0xffd23f), arch, s * 8, 13.3, 0); } const ab = signBoard('WURFPLATZ', 15, 2.8, '#ff6a1a', '#ffffff', '#ffffff'); ab.position.set(0, 11.6, .3); arch.add(ab); const ab2 = ab.clone(); ab2.rotation.y = Math.PI; ab2.position.z = -.3; arch.add(ab2);
  bunting(g, [-8, 10, 3.2], [-26, 6, 14], 12, 1); bunting(g, [8, 10, 3.2], [26, 6, 14], 12, 1);
  // gradas con público (bloques instanciados)
  const st = G(g, -26, 0, -6); for (let r = 0; r < 5; r++) box(5, 1.2 + r * 1.4, 46, mat(r % 2 ? 0xd8dce4 : 0xc0c6d0, { roughness: .6 }), .05, st, -r * 2.4, (1.2 + r * 1.4) / 2, 0);
  const N = 120, bodyI = new THREE.InstancedMesh(new THREE.BoxGeometry(1.6, 1.8, 1), mat(0xffffff, { roughness: .7 }), N), headI = new THREE.InstancedMesh(new THREE.BoxGeometry(1.1, 1.1, 1.05), mat(0xffffff, { roughness: .5 }), N); const r = RNG(12), M4 = new THREE.Matrix4(), C = new THREE.Color();
  const shirts = [0xff4a6a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xb86aff, 0xff8a3a, 0xffffff, 0x2a3a6a], skins = [0xf6cfb3, 0xe0a882, 0x8a5a3a, 0xf0c09c, 0x5a3a2a];
  for (let i = 0; i < N; i++) { const row = i % 5, z = -21 + (i / 5 | 0) * 1.8 + (r() - .5) * .3, x = -row * 2.4 + .6, y = 1.2 + row * 1.4; M4.makeTranslation(x, y + .9, z); bodyI.setMatrixAt(i, M4); bodyI.setColorAt(i, C.setHex(shirts[(r() * shirts.length) | 0])); M4.makeTranslation(x, y + 2.35, z); headI.setMatrixAt(i, M4); headI.setColorAt(i, C.setHex(skins[(r() * skins.length) | 0])); }
  bodyI.castShadow = headI.castShadow = true; st.add(bodyI, headI); st.userData.crowd = [bodyI, headI];
  // río, colina, montaña y bosque
  const water = new THREE.MeshStandardMaterial({ color: 0x3ab0f0, roughness: .12, metalness: .2, emissive: 0x0a3a6a, emissiveIntensity: .25 });
  plane(600, 16, water, g, 0, .08, -64); for (const s of [-1, 1]) box(600, .6, 1.2, mat(0xc8b080, { roughness: .9 }), .2, g, 0, .1, -64 + s * 8.4);
  for (let k = 0; k < 10; k++) { const rd = cyl(.08, .08, 3, mat(0x4a8a2a), 4, g, -40 + k * 9, 1.5, -55.5); }
  const hill = sphere(70, mat(0xffffff, { roughness: 1, map: rep(grassT('#54b844'), 8, 8) }), g, 0, -38, -175, 32, 16); hill.scale.set(1.6, .9, .7);
  mountain(g, 30, -280, 70, 120, 0x6a8a7a); mountain(g, -60, -300, 60, 95, 0x5a7a6a); mountain(g, 110, -330, 80, 110, 0x7a8aa0); mountain(g, -150, -320, 70, 120, 0x6a8a7a);
  for (let k = 0; k < 24; k++) { const s = k % 2 ? 1 : -1; const tr = tree(g, s * (34 + (k % 5) * 7), 20 - (k >> 1) * 14, .9 + (k % 3) * .15); }
  for (let k = 0; k < 12; k++) { const w = 10 + (k % 3) * 4, h = 34 + (k * 37 % 50); skyscraper(g, -90 + k * 16, 170 + (k % 2) * 12, w, h, w, ['#8fd8ff', '#a8e0ff'][k % 2], ['#5ab0e8', '#6ac0f0'][k % 2]); }
  for (let k = 0; k < 10; k++) cloud(g, -160 + k * 36, 60 + (k % 3) * 14, -220 + (k % 2) * 380, 1.4 + (k % 3) * .4);
  return { g: shade(g), arch, st, water }; }

// =====================================================================================================
// GARAGE (X): casa amarilla con garaje abierto (z = 0 es la boca), dentro herramientas, bici, sofá azul y estantes
// =====================================================================================================
export function garage(scene, X) { const g = G(scene, X); plane(300, 300, mat(0xffffff, { roughness: 1, map: rep(grassT(), 30, 30) }), g, 0, -.05, 0); plane(14, 30, mat(0xd8d4cc, { roughness: .9 }), g, 0, .03, 14);
  const wall = mat(0xffe27a, { roughness: .8 }); box(20, 13, 18, wall, .1, g, -18.2, 6.5, -9); box(16.8, 3, 18, wall, .1, g, 0, 11.5, -9); const inner = mat(0xe8eef4, { roughness: .9 }); box(16, 10, .4, inner, 0, g, 0, 5, -17.6); for (const s of [-1, 1]) box(.4, 10, 17, inner, 0, g, s * 8, 5, -9);
  box(16, .2, 17, mat(0xffffff, { map: rep(checkT('#b8bcc4', '#a8acb4'), 4, 4), roughness: .7 }), 0, g, 0, .08, -9); box(16.4, .4, 17.4, inner, 0, g, 0, 10, -9);
  box(36.6, .8, 18.6, mat(0xd8323a, { roughness: .6 }), .1, g, -10, 13.4, -9); box(16.8, 1.2, .6, mat(0xffffff), .05, g, 0, 10.6, .2); const rd = box(16, 2.2, .3, mat(0xf4f4f4, { map: rep(stripeT('#f4f4f4', '#dcdcdc', 10), 1, 1) }), .05, g, 0, 9.2, -.3);
  const pb = textPlane(10, 4.5, 320, 144, (c, w, h) => { c.fillStyle = '#c8a070'; c.fillRect(0, 0, w, h); c.fillStyle = '#8a6a40'; for (let x = 8; x < w; x += 16) for (let y = 8; y < h; y += 16) { c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); } const r = RNG(2); for (let k = 0; k < 9; k++) { c.fillStyle = ['#d8323a', '#2a6ad8', '#3a3a44', '#ffb21a'][k % 4]; const x = 20 + k * 33; c.fillRect(x, 30 + (k % 2) * 40, 8, 50 + r() * 30); c.fillRect(x - 6, 26 + (k % 2) * 40, 20, 10); } }); pb.position.set(2.6, 6, -17.35); g.add(pb);
  // bici en la pared, estantes con cajas, sofá, mesa de trabajo
  const bike = G(g, -5, 7.6, -17.1); for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.TorusGeometry(1.2, .12, 8, 24), mat(0x1a1a1a)); w.position.x = s * 1.6; bike.add(w); } const fr = box(3.2, .16, .16, mat(0xd8323a, { metalness: .5 }), .05, bike, 0, .6, 0); const fr2 = box(.16, 1.4, .16, mat(0xd8323a), .05, bike, .4, .2, 0); fr2.rotation.z = .4;
  for (let k = 0; k < 3; k++) { box(4, .2, 2, mat(0x8a6a4a), .05, g, 6, 2 + k * 2.4, -12); for (let i = 0; i < 2; i++) box(1.4, 1.2, 1.4, mat([0xc89a5a, 0x2a6ad8, 0xd8323a][(k + i) % 3]), .1, g, 5.2 + i * 1.7, 2.7 + k * 2.4, -12); }
  const sofa = G(g, -3.2, 0, -11); const sm = mat(0x2ab8d8, { roughness: .9 }); box(6.4, 1.6, 2.6, sm, .3, sofa, 0, 1.2, 0); box(6.4, 2.2, .8, sm, .3, sofa, 0, 2.4, -1.0); for (const s of [-1, 1]) box(.8, 2.2, 2.6, sm, .3, sofa, s * 3.2, 1.6, 0); for (const s of [-1, 1]) box(2.6, .5, 2, mat(0x5ad0e8), .2, sofa, s * 1.5, 2.2, .1);
  box(5, .3, 2.4, mat(0x7a5a3a), .05, g, -4.6, 3.2, -15.4); const tire = new THREE.Mesh(new THREE.TorusGeometry(1.1, .4, 8, 18), mat(0x1a1a1a)); tire.rotation.x = Math.PI / 2; tire.position.set(6, .4, -3.6); g.add(tire);
  const LI = new THREE.PointLight(0xfff4e0, 60, 30, 1.4); LI.position.set(0, 8.5, -8); g.add(LI);
  // casa: ventanas, puerta, arbustos
  for (const wx of [-14, -22]) { box(4, 3.6, .3, mat(0x9ad8ff, { roughness: .1, metalness: .4 }), .05, g, wx, 7, .1); box(4.6, .4, .6, mat(0xffffff), .05, g, wx, 5, .3); }
  box(3.2, 6, .3, mat(0x2a6ad8), .05, g, -18, 3, .1); for (let k = 0; k < 6; k++) sphere(1.3, mat(0x3a9a3a, { roughness: .9 }), g, -26 + k * 2.4 - (k > 3 ? 0 : 0), 1, 1.6, 10, 8);
  tree(g, 14, -2, 1); tree(g, -32, 8, 1.1); for (let k = 0; k < 8; k++) cloud(g, -120 + k * 40, 55 + (k % 3) * 10, -150, 1.4); backdrop(g, -160);
  return { g: shade(g), LI }; }

// =====================================================================================================
// GARTEN (X): jardín trasero del vecino: valla de madera, pared trasera de la casa (z = 18), sombrilla y tumbona,
// banderines, piscinita, barbacoa. Espacio libre para los 40 Lirilì en x ∈ [-16, 16], z ∈ [-18, 8].
// =====================================================================================================
export function garten(scene, X) { const g = G(scene, X); plane(300, 300, mat(0xffffff, { roughness: 1, map: rep(mowT(), 30, 30) }), g, 0, -.05, 0);
  const fence = mat(0xffffff, { map: rep(plankT(30), 1, 1), roughness: .8 }); for (let x = -26; x <= 26; x += 1.3) box(1.1, 4.4, .3, fence, .05, g, x, 2.2, -24); for (const s of [-1, 1]) for (let z = -24; z <= 16; z += 1.3) box(.3, 4.4, 1.1, fence, .05, g, s * 26, 2.2, z); box(53, .4, .3, fence, .05, g, 0, 3.4, -24.3);
  const hw = mat(0xffffff, { color: 0xb8e0ff, roughness: .85 }); box(56, 14, 2, hw, .1, g, 0, 7, 19); for (const wx of [-16, -6, 10, 20]) { box(5, 4, .3, mat(0x9ad8ff, { roughness: .1, metalness: .4 }), .05, g, wx, 7.5, 17.9); box(5.6, .4, .7, mat(0xffffff), .05, g, wx, 5.3, 17.8); } box(4, 7, .3, mat(0xffffff), .05, g, 2, 3.5, 17.9); box(4, .4, 4, mat(0xc8beb4), .05, g, 2, .2, 16);
  bunting(g, [-26, 9, 17.6], [26, 9, 17.6], 26, 2.2); bunting(g, [-26, 6, -23.6], [26, 6, -23.6], 26, 1.6);
  const umb = G(g, 23, 0, 0); cyl(.15, .15, 7, mat(0xf4f4f4), 8, umb, 0, 3.5, 0); const can = new THREE.Mesh(new THREE.ConeGeometry(5, 1.8, 12, 1, true), mat(0xffffff, { map: stripeT('#ff4a6a', '#ffffff', 12), side: THREE.DoubleSide, roughness: .7 })); can.position.y = 7.2; umb.add(can);
  const lng = G(g, 16, 0, 6); const lm = mat(0xffffff, { roughness: .5 }); box(3, .4, 6.4, lm, .1, lng, 0, 1.5, 0); const back = box(3, .4, 3, lm, .1, lng, 0, 2.6, -3.6); back.rotation.x = -.9; for (const s of [-1, 1]) for (const z of [-2.6, 2.6]) box(.25, 1.4, .25, mat(0xd8dce4), .05, lng, s * 1.2, .7, z); const tw = box(2.8, .1, 5.6, mat(0x3ab8ff), .05, lng, 0, 1.75, .2);
  const pool = G(g, -16, 0, 10); cyl(4.5, 4.5, 1.6, mat(0x3a8ad8, { roughness: .4 }), 28, pool, 0, .8, 0); const wa = cyl(4.2, 4.2, .1, new THREE.MeshStandardMaterial({ color: 0x6ad8ff, roughness: .1, emissive: 0x1a6a9a, emissiveIntensity: .3 }), 28, pool, 0, 1.45, 0);
  const bbq = G(g, 22, 0, -14); cyl(1.4, 1.0, 1.2, mat(0x1a1a1a, { metalness: .5 }), 16, bbq, 0, 3, 0); for (let k = 0; k < 3; k++) { const l = cyl(.08, .08, 3, mat(0x1a1a1a), 4, bbq, Math.cos(k * 2.1) * .8, 1.4, Math.sin(k * 2.1) * .8); l.rotation.z = Math.cos(k * 2.1) * .25; }
  for (let k = 0; k < 9; k++) sphere(1.4, mat([0x3a9a3a, 0x4aaa3a][k % 2], { roughness: .9 }), g, -24 + k * 6, 1, -22, 10, 8); tree(g, -30, -32, 1.1); tree(g, 32, -28, 1); for (let k = 0; k < 8; k++) cloud(g, -120 + k * 40, 55 + (k % 3) * 10, -150, 1.4); backdrop(g, -170);
  const MONEY = G(g, 16, 0, 6); for (let k = 0; k < 26; k++) { const c = cyl(.55, .55, .14, GOLD(), 16, MONEY, (k % 6 - 2.5) * .9 + Math.sin(k) * .3, .1 + (k / 6 | 0) * .16, 4.6 + (k % 3) * .5); } MONEY.visible = false;
  return { g: shade(g), MONEY, lng }; }

// =====================================================================================================
// BAD (X): baño de la Oma con bañera de patas (centro z = -3), azulejos, espejo, planta, patito y espuma
// =====================================================================================================
function room(parent, X, w, d, h, wall, floor, open = 'z') { const g = G(parent, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(0xf4f0e8), 0, g, 0, h, 0); return g; }
export function bad(scene, X) { const g = room(scene, X, 30, 26, 18, mat(0xffffff, { map: rep(tilesT('#a8e0f4', '#7ab8d8', 8), 5, 3), roughness: .3 }), mat(0xffffff, { map: rep(checkT('#f4f4f4', '#ff9ac0', 4), 5, 4), roughness: .4 }));
  const tub = G(g, 0, 0, -6); const wh = mat(0xffffff, { roughness: .15 }); const tb = cyl(1, 1, 1, wh, 32, tub, 0, 0, 0); tb.scale.set(5.6, 3.2, 3.2); tb.position.y = 2.6; const inner = cyl(1, 1, 1, mat(0xe8f4fa, { roughness: .2 }), 32, tub, 0, 0, 0); inner.scale.set(5.2, .2, 2.8); inner.position.y = 4.2;
  for (const s of [-1, 1]) for (const z of [-1, 1]) { const f = sphere(.5, GOLD(), tub, s * 4.4, .5, z * 2, 10, 8); f.scale.y = 1.4; }
  const foam = G(tub); for (let k = 0; k < 22; k++) { const ang = k / 22 * Math.PI * 2; const b = sphere(.7 + (k % 3) * .25, mat(0xffffff, { roughness: .9, emissive: 0xffffff, emissiveIntensity: .1 }), foam, Math.cos(ang) * 4.8, 4.3 + (k % 2) * .25, Math.sin(ang) * 2.5, 10, 8); }
  cyl(.15, .15, 2, GOLD(), 8, tub, -5.2, 5.4, -2.4); const tap = cyl(.12, .12, 1.4, GOLD(), 8, tub, -4.7, 6.3, -2.4); tap.rotation.z = Math.PI / 2;
  const duck = G(g, 3.2, 4.6, -4.2); sphere(.5, mat(0xffd23f), duck, 0, 0, 0, 10, 8); sphere(.34, mat(0xffd23f), duck, 0, .5, .3, 10, 8); box(.3, .1, .3, mat(0xff8a1a), .05, duck, 0, .45, .65);
  box(5, 6, .3, mat(0xd8eef8, { roughness: .02, metalness: .9 }), .1, g, 9, 9, -12.7); box(5.6, 6.6, .2, GOLD(), .1, g, 9, 9, -12.8); box(4.6, 3, 2.4, wh, .3, g, 9, 4.2, -11.4);
  const pl = G(g, -12, 0, -10); cyl(1, .8, 2, mat(0xd8783a), 12, pl, 0, 1, 0); for (let k = 0; k < 7; k++) { const l = box(.5, 3, .1, mat(0x3a9a3a), .05, pl, Math.sin(k) * .4, 3.2, Math.cos(k) * .4); l.rotation.set(Math.cos(k) * .5, k, Math.sin(k) * .5); }
  const towel = box(3, 4, .2, mat(0xff8ad0, { roughness: 1 }), .1, g, 13, 7, -12.6); const LI = new THREE.PointLight(0xfff4e8, 70, 40, 1.3); LI.position.set(0, 15, 0); g.add(LI);
  const rug = plane(10, 4, mat(0xffffff, { map: stripeT('#ffffff', '#ff9ac0', 6) }), g, 0, .04, 0);
  return { g: shade(g), tub, foam }; }

// =====================================================================================================
// KUECHE (X): cocina de colores; la nevera (x = 8, z = -9) tiene la puerta en un grupo con bisagra (DOOR)
// =====================================================================================================
export function kueche(scene, X) { const g = room(scene, X, 34, 26, 16, mat(0xffffff, { map: rep(tilesT('#fff4d8', '#f0dcb0', 6), 6, 3), roughness: .8 }), mat(0xffffff, { map: rep(checkT('#d8323a', '#f4f0e8', 4), 6, 5), roughness: .6 }));
  for (let k = 0; k < 4; k++) { box(4, 6, 3, mat(0x7ac8a8, { roughness: .5 }), .1, g, -14 + k * 4.2, 3, -11); box(4, 4, 2, mat(0x7ac8a8, { roughness: .5 }), .1, g, -14 + k * 4.2, 11.5, -11.8); sphere(.18, GOLD(), g, -14 + k * 4.2 + 1.4, 4.6, -9.4, 8, 6); }
  box(17, .4, 3.4, mat(0xf4f4f4, { roughness: .3 }), .05, g, -7.7, 6.2, -11); for (let k = 0; k < 3; k++) { const j = cyl(.6, .6, 1.4, mat([0xd8323a, 0x2a6ad8, 0xffd23f][k], { roughness: .4 }), 12, g, -13 + k * 2, 7.1, -11); }
  const fr = G(g, 8, 0, -9.6); const fm = mat(0xf2f6fa, { roughness: .25, metalness: .25 }); box(5.6, 12, 4.2, fm, .4, fr, 0, 6, 0); box(5.4, 11.6, .1, mat(0x1a1a22), 0, fr, 0, 6, 2.12);
  const IN = G(fr, 0, 0, 1.6); for (let k = 0; k < 3; k++) box(5, .15, 3.4, mat(0xd8eef8, { transparent: true, opacity: .6 }), 0, IN, 0, 3 + k * 3, -.2); const food = [[0xd8323a, 1.2], [0xffd23f, 4.2], [0x8ad84a, 7.2], [0xff8a3a, 4.2]]; food.forEach(([c, y], i) => box(1, 1, 1, mat(c), .2, IN, -1.5 + i, y + .6, 0)); const FL = new THREE.PointLight(0xe8f4ff, 0, 12, 1.5); FL.position.set(0, 7, 1); fr.add(FL);
  const DOOR = G(fr, -2.8, 0, 2.15); box(5.6, 11.8, .5, fm, .2, DOOR, 2.8, 6, .25); box(.3, 3.4, .5, mat(0xc8d0d8, { metalness: .9, roughness: .2 }), .1, DOOR, 4.9, 7.5, .6); [0xff4a6a, 0x3ab8ff, 0xffd23f, 0x8ad84a].forEach((c, i) => box(.7, .7, .15, mat(c), .1, DOOR, 1.4 + (i % 2) * 1.6, 9 - (i >> 1) * 1.6, .55));
  const pic = textPlane(1.4, 1.2, 96, 80, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.fillRect(30, 16, 36, 30); c.fillStyle = '#2a6ad8'; c.fillRect(30, 46, 36, 26); }); pic.position.set(2.6, 6.6, .56); DOOR.add(pic);
  const win = textPlane(8, 6, 240, 180, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#6ab0ff'); s.addColorStop(1, '#d0e8ff'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#5cc24a'; c.fillRect(0, h * .7, w, h * .3); c.fillStyle = '#fff'; c.fillRect(w / 2 - 3, 0, 6, h); c.fillRect(0, h / 2 - 3, w, 6); }, .5); win.position.set(-16.75, 9, -1); win.rotation.y = Math.PI / 2; g.add(win);
  const tb = G(g, -5, 0, 2); box(8, .5, 5, mat(0xc8946a), .1, tb, 0, 4, 0); for (const s of [-1, 1]) for (const z of [-1, 1]) box(.4, 4, .4, mat(0xa8744a), .05, tb, s * 3.5, 2, z * 2);
  const LI = new THREE.PointLight(0xfff4e8, 80, 50, 1.2); LI.position.set(0, 14, 2); g.add(LI);
  return { g: shade(g), fr, DOOR, FL }; }

// =====================================================================================================
// ZIMMER (X): mi cuarto: paredes azules con estrellas, ventana con cortinas, escritorio (z = -9) con el bote de
// monedas (JAR, nivel JAR.userData.level 0..1) y el sitio de Kalle, alfombra arcoíris, cama, póster.
// =====================================================================================================
export function zimmer(scene, X) { const wallT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#7ab8f4'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.5)'; for (let k = 0; k < 6; k++) { const x = (k * 47) % w, y = (k * 71) % h; c.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, r = i % 2 ? 4 : 9; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.fill(); } }, true);
  const g = room(scene, X, 30, 24, 16, mat(0xffffff, { map: rep(wallT, 4, 2), roughness: .9 }), mat(0xffffff, { map: rep(plankT(30), 4, 4), roughness: .7 }));
  const rug = new THREE.Mesh(new THREE.CircleGeometry(6, 40, 0, Math.PI), mat(0xffffff, { map: canvasTex(256, 128, (c, w, h) => { const cols = ['#ff4a4a', '#ff9a2a', '#ffe23a', '#4ad84a', '#3a9aff', '#9a5aff']; cols.forEach((cc, i) => { c.fillStyle = cc; c.beginPath(); c.arc(w / 2, h, h * (1 - i / 7), Math.PI, 0); c.fill(); }); }) })); rug.rotation.x = -Math.PI / 2; rug.position.set(0, .05, 4); g.add(rug);
  const desk = G(g, 0, 0, -9.4); box(12, .5, 4, mat(0xf4f0e8), .1, desk, 0, 5, 0); for (const s of [-1, 1]) box(3.4, 5, 3.8, mat(0xff9a3a, { roughness: .6 }), .1, desk, s * 4.2, 2.5, 0); box(2, 1.4, .1, mat(0xffffff), .05, desk, -2.6, 5.9, -1.2);
  const JAR = G(desk, 1.6, 5.25, .2); const jg = cyl(1.2, 1.2, 3.2, new THREE.MeshStandardMaterial({ color: 0xd8f0ff, transparent: true, opacity: .32, roughness: .05, metalness: .1, depthWrite: false }), 24, JAR, 0, 1.6, 0); cyl(1.3, 1.3, .4, mat(0xd8323a), 20, JAR, 0, 3.3, 0);
  const fill = cyl(1.08, 1.08, 1, GOLD(), 20, JAR, 0, .5, 0); JAR.userData.set = k => { fill.visible = k > .01; fill.scale.y = Math.max(.01, k * 3.0); fill.position.y = .05 + k * 1.5; }; JAR.userData.set(0);
  const lbl = textPlane(1.6, .7, 128, 56, (c, w, h) => { c.fillStyle = '#fff'; c.beginPath(); c.roundRect(0, 0, w, h, 10); c.fill(); c.fillStyle = '#d8323a'; c.font = `700 30px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('KÄSE', w / 2, h / 2 + 2); }); lbl.position.set(0, 1.5, 1.22); JAR.add(lbl);
  const win = G(g, -7, 9, -11.75); const sky = textPlane(8, 6, 240, 180, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#5aa8ff'); s.addColorStop(1, '#cfe8ff'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#5cc24a'; c.fillRect(0, h * .72, w, h * .28); c.fillStyle = '#fff'; c.beginPath(); c.arc(60, 50, 20, 0, 7); c.arc(85, 45, 26, 0, 7); c.arc(110, 52, 18, 0, 7); c.fill(); }, .6); win.add(sky); box(8.6, .5, .6, mat(0xffffff), .05, win, 0, -3.2, .2); box(.3, 6, .3, mat(0xffffff), .05, win, 0, 0, .1);
  for (const s of [-1, 1]) { const cu = box(2.2, 7.4, .3, mat(0x2a3a9a, { roughness: 1 }), .1, win, s * 5, 0, .4); }
  const SKY = sky;
  const bed = G(g, 10, 0, -5); box(6, 2, 10, mat(0xc8946a), .1, bed, 0, 1.2, 0); box(5.6, 1, 9.4, mat(0xffffff), .3, bed, 0, 2.6, 0); box(5.8, .7, 6, mat(0xff4a4a, { roughness: 1 }), .2, bed, 0, 3.2, 1.6); box(4, .8, 2, mat(0xffffff), .3, bed, 0, 3.4, -3.4);
  const post = textPlane(4, 5, 160, 200, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a6ad8'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.fillText('WURF', w / 2, 50); c.fillText('CHAMP', w / 2, 92); c.fillStyle = '#d8323a'; c.beginPath(); c.arc(w / 2, 150, 34, 0, 7); c.fill(); }); post.position.set(8, 9, -11.75); g.add(post);
  const LI = new THREE.PointLight(0xfff4e8, 80, 50, 1.2); LI.position.set(0, 14, 0); g.add(LI);
  return { g: shade(g), JAR, desk, SKY, win }; }

// =====================================================================================================
// LADEN (X): tienda «FRISCHES ESSEN»: estantes con comida y precios, mostrador con caja (z = -2) y, al fondo
// (z = -10), el GOLDENE KÄSE en un pedestal con cuerdas de terciopelo, foco y destellos.
// =====================================================================================================
export function food(kind, s = 1) { const g = new THREE.Group(); g.scale.setScalar(s);
  if (kind === 'karotte') { const c = new THREE.Mesh(new THREE.ConeGeometry(.5, 2.6, 12), mat(0xff7a1a, { roughness: .6 })); c.rotation.x = Math.PI; c.position.y = 0; g.add(c); for (let k = 0; k < 4; k++) { const l = box(.14, 1.1, .14, mat(0x3ab84a), .05, g, Math.sin(k * 1.6) * .15, 1.7, Math.cos(k * 1.6) * .15); l.rotation.set(Math.cos(k * 1.6) * .3, 0, Math.sin(k * 1.6) * .3); } for (let k = 0; k < 4; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.42 - k * .08, .03, 4, 12), mat(0xd8601a)); r.rotation.x = Math.PI / 2; r.position.y = .6 - k * .45; g.add(r); } }
  else if (kind === 'apfel') { sphere(1, mat(0xe8202a, { roughness: .3 }), g, 0, 0, 0, 18, 14).scale.set(1, .92, 1); cyl(.06, .08, .6, mat(0x5a3a1a), 6, g, 0, 1.05, 0); const l = box(.5, .06, .26, mat(0x3ab84a), .03, g, .25, 1.1, 0); l.rotation.z = -.4; }
  else if (kind === 'steak') { const st = cyl(1.3, 1.3, .45, mat(0xb8402a, { roughness: .7 }), 20, g, 0, 0, 0); st.scale.set(1.3, 1, .9); const f = cyl(1.36, 1.36, .4, mat(0xf4d8c8), 20, g, 0, 0, 0); f.scale.set(1.3, .9, .9); f.position.x = .05; const b = box(.3, .5, 1.4, mat(0xf4f0e0), .1, g, -.3, 0, 0); for (let k = 0; k < 3; k++) box(2.6, .08, .12, mat(0x5a1a10), .02, g, 0, .24, -.5 + k * .5).rotation.y = .6; }
  else if (kind === 'banane') { const pts = []; for (let k = 0; k <= 8; k++) { const a = -0.9 + k / 8 * 1.8; pts.push(new THREE.Vector3(Math.sin(a) * 1.4, -Math.cos(a) * 1.4 + 1.4, 0)); } const tb = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, .32, 8), mat(0xffd83a, { roughness: .5 })); g.add(tb); sphere(.14, mat(0x4a3a1a), g, pts[0].x, pts[0].y, 0, 6, 4); sphere(.14, mat(0x4a3a1a), g, pts[8].x, pts[8].y, 0, 6, 4); }
  else if (kind === 'burger') { const bun = mat(0xd88a3a, { roughness: .6 }); const t = sphere(1.3, bun, g, 0, .5, 0, 18, 10); t.scale.y = .6; cyl(1.3, 1.3, .3, bun, 18, g, 0, -.6, 0); cyl(1.35, 1.35, .3, mat(0x5a2a14), 18, g, 0, -.2, 0); box(2.5, .1, 2.5, mat(0xffc83a), .02, g, 0, .05, 0).rotation.y = .4; cyl(1.4, 1.4, .1, mat(0x4ac83a), 18, g, 0, -.38, 0); for (let k = 0; k < 8; k++) sphere(.06, mat(0xfff4d0), g, Math.cos(k) * .7, .95, Math.sin(k) * .7, 4, 3); }
  else if (kind === 'pizza') { const p = cyl(1.8, 1.8, .2, mat(0xffffff, { map: canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#d08a3a'; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, 7); c.fill(); c.fillStyle = '#ffcf4a'; c.beginPath(); c.arc(w / 2, h / 2, w * .42, 0, 7); c.fill(); c.fillStyle = '#c8282a'; for (let k = 0; k < 9; k++) { c.beginPath(); c.arc(w / 2 + Math.cos(k * 2.4) * (k % 3 + 1) * 13, h / 2 + Math.sin(k * 2.4) * (k % 3 + 1) * 13, 8, 0, 7); c.fill(); } }) }), 28, g, 0, 0, 0); }
  else if (kind === 'kaese') { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(2.4, 0); sh.lineTo(0, 1.6); sh.closePath(); const ge = new THREE.ExtrudeGeometry(sh, { depth: 1.4, bevelEnabled: true, bevelSize: .08, bevelThickness: .08 }); ge.translate(-.9, -.5, -.7); const m = new THREE.Mesh(ge, new THREE.MeshStandardMaterial({ color: 0xffd84a, metalness: .3, roughness: .3, emissive: 0xffa800, emissiveIntensity: .75 })); m.rotation.x = -Math.PI / 2; m.rotation.z = 0; g.add(m); m.rotation.set(0, 0, 0); m.position.y = -.2; for (let k = 0; k < 5; k++) { const h = sphere(.18, new THREE.MeshStandardMaterial({ color: 0xc8901a, metalness: .6, roughness: .4 }), g, -.5 + k * .35, -.1 + (k % 2) * .4, .75, 8, 6); h.scale.z = .3; } }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; }
export function laden(scene, X) { const g = room(scene, X, 36, 30, 16, mat(0xffffff, { color: 0xfff4e0, roughness: .9 }), mat(0xffffff, { map: rep(checkT('#f4f4f4', '#3ab86a', 4), 6, 5), roughness: .5 }));
  const bn = signBoard('FRISCHES ESSEN', 18, 3, '#2a6ad8', '#ffffff', '#ffd23f'); bn.position.set(0, 13, -14.7); g.add(bn); bunting(g, [-17.6, 15, -14], [17.6, 15, -14], 24, 1.2);
  const kinds = ['karotte', 'apfel', 'steak', 'banane', 'burger', 'pizza']; const prices = ['1 €', '2 €', '9 €', '3 €', '12 €', '20 €'];
  for (const s of [-1, 1]) { const sh = G(g, s * 16.2, 0, -2); for (let r = 0; r < 4; r++) { box(2.6, .3, 22, mat(0xc8946a), .05, sh, 0, 1.6 + r * 3, 0); for (let k = 0; k < 6; k++) { const f = food(kinds[(k + r) % 6], .55); f.position.set(0, 2.3 + r * 3, -9 + k * 3.6); f.rotation.y = s * Math.PI / 2; sh.add(f); } } }
  for (let k = 0; k < 6; k++) { const t = signBoard(prices[k], 2.2, 1.1, '#ffffff', '#d8323a', '#d8323a'); t.position.set(-14.8, 1.4, -11 + k * 3.6); t.rotation.y = Math.PI / 2; g.add(t); }
  const cnt = G(g, 0, 0, -2); box(12, 4, 3, mat(0xffffff, { map: stripeT('#ff4a6a', '#ffffff', 12) }), .2, cnt, 0, 2, 0); box(12.4, .4, 3.4, mat(0xc8946a), .05, cnt, 0, 4.2, 0); const reg = G(cnt, 3.6, 4.4, 0); box(2.4, 1.2, 1.8, mat(0x3a3a44), .1, reg, 0, .6, 0); const scr = box(1.8, 1.2, .2, mat(0x6ad8a8, { emissive: 0x3ab88a, emissiveIntensity: .6 }), .05, reg, 0, 1.7, -.4); scr.rotation.x = -.3;
  const ped = G(g, 0, 0, -10); cyl(1.6, 2.0, 5, mat(0xffffff, { roughness: .3 }), 24, ped, 0, 2.5, 0); cyl(2.4, 2.4, .5, GOLD(), 24, ped, 0, .25, 0); cyl(2.0, 2.0, .4, mat(0x8a1a4a, { roughness: .9 }), 24, ped, 0, 5.2, 0); const KAESE = food('kaese', 1.25); KAESE.position.set(0, 6.4, 0); ped.add(KAESE);
  for (const [x, z] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) { cyl(.18, .22, 3.4, GOLD(), 8, ped, x * .9, 1.7, z * .5 + (z > 0 ? 0 : 0)); sphere(.3, GOLD(), ped, x * .9, 3.5, z * .5); } for (const s of [-1, 1]) { const rp = cyl(.12, .12, 7.4, mat(0xc81a3a, { roughness: .8 }), 8, ped, s * 3.6, 3.1, 0); rp.rotation.x = Math.PI / 2; }
  const kp = signBoard('GOLDENER KÄSE', 8, 1.6, '#1a1a2a', '#ffd23f', '#ffd23f', .4); kp.position.set(0, 10.6, -4.2); ped.add(kp); const pr = signBoard('9.999 MÜNZEN', 5.6, 1.2, '#ffd23f', '#1a1a2a', '#1a1a2a'); pr.position.set(0, 4.2, 2.05); ped.add(pr);
  const rays = textPlane(16, 16, 256, 256, (c, w, h) => { const gg = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); gg.addColorStop(0, 'rgba(255,240,160,.95)'); gg.addColorStop(1, 'rgba(255,200,60,0)'); c.fillStyle = gg; for (let k = 0; k < 16; k++) { c.beginPath(); c.moveTo(w / 2, h / 2); c.arc(w / 2, h / 2, w / 2, k * Math.PI / 8, k * Math.PI / 8 + .12); c.fill(); } c.beginPath(); c.arc(w / 2, h / 2, w * .2, 0, 7); c.fill(); }, 1); rays.position.set(0, 6.6, -1.4); rays.material.depthWrite = false; ped.add(rays);
  const SP = new THREE.SpotLight(0xfff0c0, 260, 40, .4, .5, 1.2); SP.position.set(0, 15.5, -8); SP.target = KAESE; g.add(SP);
  const LI = new THREE.PointLight(0xfff4e8, 70, 60, 1.2); LI.position.set(0, 14, 6); g.add(LI);
  const door = G(g, 0, 0, 15); return { g: shade(g), KAESE, rays, ped, cnt }; }

// =====================================================================================================
// KUESTE (X): paseo marítimo y mar; villa del alcalde (z = -6, fachada mirando a +z) con columnas y puerta roja (DOOR)
// =====================================================================================================
export function kueste(scene, X) { const g = G(scene, X); const water = new THREE.MeshStandardMaterial({ color: 0x2a8ad8, roughness: .1, metalness: .3, emissive: 0x0a3a6a, emissiveIntensity: .2 });
  plane(2000, 1400, water, g, 0, -.4, 700); plane(400, 40, mat(0xffffff, { map: rep(noiseTex('#f4dca0', ['#e8cc88', '#fff0c0'], 1600, 2, 1), 20, 3), roughness: 1 }), g, 0, -.2, 32); plane(400, 30, mat(0xffffff, { map: rep(tilesT('#e8e2d6', '#cfc6b6', 4), 40, 3), roughness: .8 }), g, 0, .02, 8);
  plane(400, 200, mat(0xffffff, { roughness: 1, map: rep(grassT(), 30, 20) }), g, 0, -.05, -100);
  for (let x = -60; x <= 60; x += 3) { cyl(.12, .12, 3, mat(0xffffff), 6, g, x, 1.5, 22); } box(124, .2, .2, mat(0xffffff), 0, g, 0, 3, 22);
  const villa = G(g, 0, 0, -6); const wm = mat(0xfaf6ee, { roughness: .6 }); box(30, 16, 14, wm, .1, villa, 0, 8, -7); box(31, 1, 15, mat(0xe8e0d0), .05, villa, 0, 16.4, -7); const rf = new THREE.Mesh(new THREE.CylinderGeometry(.01, 18, 8, 4, 1, false, Math.PI / 4), mat(0x3a5a8a, { roughness: .7 })); rf.scale.set(1, 1, .55); rf.position.set(0, 20.8, -7); villa.add(rf);
  for (let k = -2; k <= 2; k++) { if (!k) continue; cyl(.7, .8, 13, wm, 16, villa, k * 4, 6.5, 2); } box(18, 1.4, 4, wm, .05, villa, 0, 13.6, 2); const tri = new THREE.Mesh(new THREE.ConeGeometry(10, 4, 3), wm); tri.rotation.set(Math.PI / 2, 0, 0); tri.scale.set(1, 1, .4); tri.position.set(0, 16, 2.6); villa.add(tri);
  for (let k = 0; k < 3; k++) box(18 - k * 2, .5, 3, mat(0xe8e0d0), .05, villa, 0, .25 + k * .5, 4 - k * .9);
  const DOOR = G(villa, -2.2, 1.4, .1); box(4.4, 7.6, .4, mat(0xc81a2a, { roughness: .35 }), .1, DOOR, 2.2, 3.8, 0); sphere(.3, GOLD(), DOOR, 3.9, 3.8, .35, 8, 6); const knock = new THREE.Mesh(new THREE.TorusGeometry(.4, .08, 6, 14), GOLD()); knock.position.set(2.2, 5.4, .35); DOOR.add(knock);
  const pl = signBoard('BÜRGERMEISTER', 6, 1.2, '#ffd23f', '#1a1a2a', '#b88a1a'); pl.position.set(-6, 5, .2); villa.add(pl);
  for (const wx of [-12, -8, 8, 12]) for (const wy of [5, 11]) { box(2.6, 3.4, .3, mat(0x9ad8ff, { roughness: .1, metalness: .4 }), .05, villa, wx, wy, .1); }
  for (const s of [-1, 1]) { const palm = G(g, s * 22, 0, 4); const tr = cyl(.5, .7, 12, mat(0x9a7a4a), 8, palm, 0, 6, 0); tr.rotation.z = s * .1; for (let k = 0; k < 7; k++) { const l = box(5, .2, 1.2, mat(0x3ab84a), .1, palm, Math.cos(k * .9) * 2.4, 12, Math.sin(k * .9) * 2.4); l.rotation.set(0, -k * .9, -.4); } }
  for (let k = 0; k < 10; k++) cloud(g, -200 + k * 45, 50 + (k % 3) * 12, 300 + (k % 2) * 80, 1.6); for (let k = 0; k < 4; k++) mountain(g, -120 + k * 80, -150, 50, 80, 0x6a9a7a);
  return { g: shade(g), DOOR, villa, water }; }

// =====================================================================================================
// MARKT (X): plaza de noche: fuente central (z = 0), edificios alrededor, rascacielos detrás (z = -80) y farolas
// =====================================================================================================
export function markt(scene, X) { const g = G(scene, X); plane(500, 500, mat(0xffffff, { map: rep(checkT('#c8c0b4', '#b8b0a4', 4), 60, 60), roughness: .8 }), g, 0, -.02, 0); fountain(g, 0, 0);
  const r = RNG(31); for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, R = 52; const b = G(g, Math.sin(a) * R, 0, Math.cos(a) * R); b.rotation.y = a + Math.PI; const h = 14 + r() * 10; box(16, h, 12, mat([0xffe27a, 0xff9ac0, 0x9ad8ff, 0xb8f0a0, 0xffb86a][k % 5], { roughness: .8 }), .1, b, 0, h / 2, 0); box(17, 1, 13, mat(0xd8323a), .05, b, 0, h + .5, 0);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) box(2.6, 2.6, .3, glow(0xffd27a, .9), .05, b, -5 + i * 5, 5 + j * 6, 6.05); }
  for (let k = 0; k < 6; k++) { const w = 14 + (k % 3) * 4, h = 80 + (k * 23) % 60; skyscraper(g, -80 + k * 32, -140 - (k % 2) * 20, w, h, w, '#3a5a9a', '#ffd27a'); }
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + .2; lamp(g, Math.sin(a) * 30, Math.cos(a) * 30, 1); }
  return { g: shade(g) }; }

// =====================================================================================================
// paisajes del viaje del queso (cada uno es un diorama alrededor de x = X, el queso vuela hacia -z a y ≈ 30)
// =====================================================================================================
export function wald(scene, X) { const g = G(scene, X); plane(800, 800, mat(0xffffff, { roughness: 1, map: rep(grassT('#3a9a3a'), 60, 60) }), g, 0, 0, -100); const r = RNG(41);
  const pine = (x, z, s) => { const t = G(g, x, 0, z); t.scale.setScalar(s); cyl(.6, .8, 4, mat(0x6b4a2e), 6, t, 0, 2, 0); for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(4 - k * 1, 5, 7), mat([0x1e6a2e, 0x2a8a3a, 0x3aa04a][k], { roughness: .9, flatShading: true })); c.position.y = 5 + k * 3; t.add(c); } };
  for (let k = 0; k < 220; k++) { const x = (r() - .5) * 300, z = 40 - r() * 400; if (Math.abs(x - 30) < 8 && z > -300) continue; pine(x, z, .9 + r() * .9); }
  plane(14, 500, new THREE.MeshStandardMaterial({ color: 0x3ab0f0, roughness: .1, emissive: 0x0a4a7a, emissiveIntensity: .3 }), g, 30, .2, -150); const lake = new THREE.Mesh(new THREE.CircleGeometry(30, 32), new THREE.MeshStandardMaterial({ color: 0x3ab0f0, roughness: .1, emissive: 0x0a4a7a, emissiveIntensity: .3 })); lake.rotation.x = -Math.PI / 2; lake.position.set(-50, .2, -120); g.add(lake);
  const tower = G(g, -24, 0, -60); for (const s of [-1, 1]) for (const z of [-1, 1]) cyl(.3, .3, 14, mat(0x8a5a2a), 6, tower, s * 2, 7, z * 2); box(6, 4, 6, mat(0xa86a3a), .1, tower, 0, 16, 0); const tr = new THREE.Mesh(new THREE.ConeGeometry(5, 3, 4), mat(0xd8323a)); tr.rotation.y = Math.PI / 4; tr.position.y = 19.5; tower.add(tr);
  for (let k = 0; k < 6; k++) mountain(g, -200 + k * 80, -420, 70, 140, 0x5a8a6a); for (let k = 0; k < 10; k++) cloud(g, -200 + k * 45, 70 + (k % 3) * 12, -300, 1.6); return { g: shade(g) }; }
export function wueste(scene, X) { const g = G(scene, X); const sand = mat(0xffffff, { roughness: 1, map: rep(noiseTex('#f4c870', ['#e8b858', '#ffd888'], 1600, 3, 1), 60, 60) }); plane(800, 800, sand, g, 0, 0, -100); const r = RNG(51);
  for (let k = 0; k < 30; k++) { const d = sphere(20 + r() * 20, sand, g, (r() - .5) * 400, -12, -r() * 400, 20, 10); d.scale.set(1.6, .5, 1); }
  for (let k = 0; k < 9; k++) { const m = G(g, (k % 2 ? 1 : -1) * (40 + r() * 80), 0, -60 - k * 40); const h = 20 + r() * 20; box(30, h, 24, mat(0xd8783a, { roughness: .9, flatShading: true }), .5, m, 0, h / 2, 0); box(34, 4, 28, mat(0xc8602a), .5, m, 0, h - 1, 0); }
  const cac = mat(0x3a9a3a, { roughness: .7 }); for (let k = 0; k < 40; k++) { const c = G(g, (r() - .5) * 200, 0, 20 - r() * 300); c.scale.setScalar(.8 + r() * .8); cyl(.8, .9, 7, cac, 8, c, 0, 3.5, 0); sphere(.8, cac, c, 0, 7, 0, 8, 6); for (const s of [-1, 1]) { cyl(.5, .5, 2, cac, 8, c, s * 1.6, 3.6, 0); cyl(.5, .5, 2.6, cac, 8, c, s * 2.2, 4.6, 0).rotation.z = s * -.2; } }
  for (let k = 0; k < 6; k++) cloud(g, -200 + k * 70, 80, -320, 1.4); return { g: shade(g) }; }
export function vulkan(scene, X) { const g = G(scene, X); plane(800, 800, mat(0xffffff, { roughness: 1, map: rep(noiseTex('#3a2a28', ['#2a1e1c', '#4a3430'], 1600, 3, 1), 60, 60) }), g, 0, 0, -100);
  const v = new THREE.Mesh(new THREE.CylinderGeometry(18, 90, 90, 14, 1, true), mat(0x4a3430, { roughness: 1, flatShading: true, side: THREE.DoubleSide })); v.position.set(0, 45, -160); g.add(v); const lava = new THREE.Mesh(new THREE.CircleGeometry(18, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.2, .2), toneMapped: false })); lava.rotation.x = -Math.PI / 2; lava.position.set(0, 86, -160); g.add(lava);
  const lm = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, .9, .15), toneMapped: false }); const pts = []; for (let k = 0; k <= 12; k++) pts.push(new THREE.Vector3(Math.sin(k * .7) * 10, 80 - k * 6.6, -150 + k * 14)); g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 3, 6), lm));
  for (let k = 0; k < 6; k++) { const pl = [], ox = (k - 2.5) * 40; for (let i = 0; i <= 10; i++) pl.push(new THREE.Vector3(ox + Math.sin(i * .9 + k) * 8, .4, 40 - i * 22)); g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pl), 40, 2.2, 6), lm)); }
  const r = RNG(61); for (let k = 0; k < 50; k++) { const s = new THREE.Mesh(new THREE.DodecahedronGeometry(3 + r() * 6), mat(0x2a1e1c, { flatShading: true, roughness: 1 })); s.position.set((r() - .5) * 300, 1, 30 - r() * 300); g.add(s); }
  const SMK = []; for (let k = 0; k < 16; k++) { const s = sphere(10 + k * .8, mat(0x4a4448, { roughness: 1, transparent: true, opacity: .55, depthWrite: false }), g, (k % 4 - 1.5) * 8, 100 + k * 9, -160 - (k % 3) * 6, 10, 8); SMK.push(s); }
  const L = new THREE.PointLight(0xff6a1a, 900, 400, 1.2); L.position.set(0, 60, -100); g.add(L); return { g: shade(g), SMK, L }; }
export function jahrmarkt(scene, X) { const g = G(scene, X); plane(800, 800, mat(0xffffff, { roughness: 1, map: rep(noiseTex('#2a2a3a', ['#22222e', '#34344a'], 1600, 3, 1), 60, 60) }), g, 0, 0, -100);
  const wheel = G(g, -30, 34, -90); const WH = G(wheel); const wm = new THREE.MeshStandardMaterial({ color: 0x6a5a8a, emissive: 0x2a1a4a, emissiveIntensity: .3, metalness: .5 }); const rim = new THREE.Mesh(new THREE.TorusGeometry(28, .6, 8, 48), wm); WH.add(rim); for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; const sp = box(.4, 28, .4, wm, 0, WH, Math.sin(a) * 14, Math.cos(a) * 14, 0); sp.rotation.z = -a; sphere(.7, new THREE.MeshBasicMaterial({ color: new THREE.Color(...[[3, .6, 2], [.6, 2.6, 3], [3, 2.4, .4]][k % 3]), toneMapped: false }), WH, Math.sin(a) * 28, Math.cos(a) * 28, .8, 8, 6);
    const gd = box(4, 3, 3, mat([0xff4a6a, 0x3ab8ff, 0xffd23f][k % 3]), .3, WH, Math.sin(a) * 28, Math.cos(a) * 28 - 2.5, 0); gd.userData.gondola = true; } for (const s of [-1, 1]) { const l = cyl(.6, .8, 40, wm, 8, wheel, s * 8, -16, -3); l.rotation.z = s * .25; }
  const tent = (x, z, a, b) => { const t = G(g, x, 0, z); cyl(7, 7, 7, mat(0xffffff, { map: stripeT(a, b, 16) }), 16, t, 0, 3.5, 0); const c = new THREE.Mesh(new THREE.ConeGeometry(8, 7, 16), mat(0xffffff, { map: stripeT(a, b, 16) })); c.position.y = 10.5; t.add(c); sphere(.6, glow(0xffd23f, 2), t, 0, 14.4, 0, 8, 6); };
  tent(24, -40, '#8a2a9a', '#1a1a2a'); tent(46, -90, '#d8323a', '#1a1a2a'); tent(-6, -150, '#2a8a6a', '#1a1a2a'); tent(10, 20, '#8a2a9a', '#1a1a2a');
  const GH = []; for (let k = 0; k < 7; k++) { const gh = G(g, (k % 2 ? 1 : -1) * (12 + k * 4), 18 + (k % 3) * 6, -k * 22); const m = new THREE.MeshStandardMaterial({ color: 0xf4f4ff, emissive: 0x8a9aff, emissiveIntensity: .7, transparent: true, opacity: .85 }); const b = sphere(2.4, m, gh, 0, 0, 0, 12, 10); b.scale.y = 1.3; const sk = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.6, 10, 1, true), m); sk.position.y = -2.6; sk.rotation.x = Math.PI; gh.add(sk); for (const s of [-1, 1]) sphere(.4, new THREE.MeshBasicMaterial({ color: 0x1a1a2a }), gh, s * .8, .5, 2.1, 6, 4); GH.push(gh); }
  for (let k = 0; k < 30; k++) { const pole = cyl(.2, .2, 10, mat(0x3a3a4a), 6, g, (k % 2 ? 1 : -1) * 30 + Math.sin(k) * 6, 5, 30 - k * 9); sphere(.8, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.8, .6), toneMapped: false }), g, pole.position.x, 10.4, pole.position.z, 8, 6); }
  const L = new THREE.PointLight(0xb86aff, 600, 300, 1.2); L.position.set(0, 40, -60); g.add(L); return { g: shade(g), WH, GH, L }; }
export function wolken(scene, X) { const g = G(scene, X); const r = RNG(71); const m = mat(0xffffff, { roughness: 1, emissive: 0xdde8ff, emissiveIntensity: .35 }); for (let k = 0; k < 160; k++) { const s = sphere(8 + r() * 14, m, g, (r() - .5) * 300, (r() - .5) * 30, 40 - r() * 400, 14, 10); s.scale.y = .55 + r() * .3; }
  const sun = sphere(30, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.8, 2.4, 1.4), toneMapped: false }), g, 60, 120, -400, 24, 16); return { g, sun }; }
export function schwarz(scene, X) { const g = G(scene, X); plane(800, 800, mat(0xffffff, { roughness: .8, map: rep(noiseTex('#2a0a4a', ['#3a0a5a', '#1a0a3a', '#4a1a6a'], 1600, 3, 1), 60, 60) }), g, 0, 0, -100); const r = RNG(81);
  const cm = [new THREE.MeshStandardMaterial({ color: 0xff3ab8, emissive: 0xff1aa8, emissiveIntensity: .9, roughness: .2, flatShading: true }), new THREE.MeshStandardMaterial({ color: 0x3af0ff, emissive: 0x1ad8ff, emissiveIntensity: .9, roughness: .2, flatShading: true })];
  for (let k = 0; k < 90; k++) { const h = 6 + r() * 30, c = new THREE.Mesh(new THREE.ConeGeometry(1.5 + r() * 4, h, 5), cm[k % 2]); c.position.set((r() - .5) * 260, h / 2, 30 - r() * 360); c.rotation.z = (r() - .5) * .4; g.add(c); }
  for (let k = 0; k < 30; k++) { const mu = G(g, (r() - .5) * 200, 0, 20 - r() * 300); mu.scale.setScalar(1 + r() * 2); cyl(.6, .8, 4, mat(0xf4e8ff, { emissive: 0x8a6aff, emissiveIntensity: .4 }), 8, mu, 0, 2, 0); const cp = sphere(2.4, new THREE.MeshStandardMaterial({ color: 0x8a3aff, emissive: 0x6a1aff, emissiveIntensity: .8 }), mu, 0, 4.4, 0, 14, 8); cp.scale.y = .55; }
  const SUN = G(g, 0, 110, -380); sphere(34, new THREE.MeshBasicMaterial({ color: 0x000000 }), SUN, 0, 0, 0, 32, 20); const cor = textPlane(130, 130, 512, 512, (c, w, h) => { const gg = c.createRadialGradient(w / 2, h / 2, w * .25, w / 2, h / 2, w / 2); gg.addColorStop(0, 'rgba(255,120,255,1)'); gg.addColorStop(.35, 'rgba(255,60,200,.6)'); gg.addColorStop(1, 'rgba(120,0,255,0)'); c.fillStyle = gg; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 6; for (let k = 0; k < 48; k++) { const a = k / 48 * Math.PI * 2, r0 = w * .27, r1 = w * (.33 + (k % 3) * .04); c.beginPath(); c.moveTo(w / 2 + Math.cos(a) * r0, h / 2 + Math.sin(a) * r0); c.lineTo(w / 2 + Math.cos(a) * r1, h / 2 + Math.sin(a) * r1); c.stroke(); } }, 1);
  cor.material.depthWrite = false; cor.material.toneMapped = false; cor.position.z = -2; SUN.add(cor); const L = new THREE.PointLight(0xff3ad8, 700, 400, 1.1); L.position.set(0, 60, -120); g.add(L); return { g: shade(g), SUN }; }

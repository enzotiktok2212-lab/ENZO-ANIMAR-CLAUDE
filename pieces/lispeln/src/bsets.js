// Besuchstag — escenarios y atrezo: Hufenbach nevado, la Stube (salón-cocina con espejos), el Mühlenteich al atardecer
// (hielo con reflejo real, molino, casas al fondo, huellas), el cementerio nevado y objetos (calendario, tortitas, radio, cebolla, gato Socke…).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree, bench, lamp } from './props.js';
import { townhouse } from './gort.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
export const FONT = 'Cap, sans-serif';
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
export const SNOW = () => mat(0xffffff, { roughness: .95, map: rep(noiseTex('#f4f8ff', ['#e4ecf8', '#ffffff', '#dce6f4'], 2400, 3, 1), 60, 60) });
// objetos que NO salen en los reflejos (los «visitantes» no tienen Spiegelbild)
export const NOREFL = [];
function mirrorize(r, extra = []) { const ob = r.onBeforeRender; r.onBeforeRender = function (...a) { const hid = [...NOREFL, ...extra].filter(o => o.visible); hid.forEach(o => o.visible = false); ob.apply(this, a); hid.forEach(o => o.visible = true); }; return r; }

// ---------- pueblo nevado: blanquea hierba, colinas, tejados y árboles ----------
export function winterize(G) {
  const sn = SNOW(); G.children[0].material = sn;
  const roofM = mat(0xf6f9ff, { roughness: .9 });
  G.traverse(o => { if (!o.isMesh || !o.material || !o.material.color) return; const g = o.geometry;
    if (g.type === 'CylinderGeometry' && g.parameters.radialSegments === 4) { o.material = roofM; return; }
    const c = o.material.color; if (c.g > c.r * 1.25 && c.g > c.b * 1.1 && !o.material.map) { o.material = o.material.clone(); o.material.color.setRGB(.93, .96, 1); } });
  const sn2 = SNOW(); G.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && Math.abs(o.rotation.x + Math.PI / 2) < .01 && o !== G.children[0] && o.geometry.parameters.width !== 14 && o.geometry.parameters.width < 100) o.material = sn2; });
  // montones de nieve a los lados de la carretera y en la plaza
  const m = mat(0xf8fbff, { roughness: 1 }); const r = RNG(7);
  for (let z = -60; z < 400; z += 6) for (const s of [-1, 1]) { const b = sphere(1.6 + r() * 1.2, m, G, 26 + s * (9.6 + r()), 0, z + r() * 3, 10, 6); b.scale.y = .45; }
  for (let i = 0; i < 40; i++) { const b = sphere(1.2 + r() * 2, m, G, -60 + r() * 110, 0, -76 + r() * 140, 10, 6); b.scale.y = .35; }
}
export function snowman(parent, x, z, ry = 0, s = 1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); parent.add(g); const w = mat(0xffffff, { roughness: .9 });
  sphere(2.2, w, g, 0, 2, 0, 18, 14); sphere(1.6, w, g, 0, 5.2, 0, 18, 14); sphere(1.15, w, g, 0, 7.6, 0, 18, 14); const n = new THREE.Mesh(new THREE.ConeGeometry(.25, 1.2, 10), mat(0xff7a1a)); n.rotation.x = Math.PI / 2; n.position.set(0, 7.6, 1.6); g.add(n);
  for (const sx of [-1, 1]) sphere(.14, mat(0x111111), g, sx * .4, 8, 1.0, 8, 6); for (let k = 0; k < 3; k++) sphere(.16, mat(0x111111), g, 0, 4.4 + k * .7, 1.5, 8, 6);
  cyl(.9, .9, .2, mat(0x1a1a22), 18, g, 0, 8.6, 0); cyl(.65, .65, 1.2, mat(0x1a1a22), 18, g, 0, 9.3, 0); const sc = new THREE.Mesh(new THREE.TorusGeometry(1.15, .25, 8, 20), mat(0xd8323a)); sc.rotation.x = Math.PI / 2; sc.position.y = 6.6; g.add(sc);
  for (const sx of [-1, 1]) { const a = cyl(.08, .1, 3, mat(0x5a3a20), 6, g, sx * 2.2, 5.6, 0); a.rotation.z = sx * 1.0; } return shade(g); }
// guirnalda de bombillas entre dos puntos
export function lights(parent, a, b, n = 16, sag = 1) { const g = new THREE.Group(); parent.add(g); const cols = [0xfff2a0, 0xffd27a, 0xfff8e0];
  for (let i = 0; i <= n; i++) { const k = i / n, x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k - Math.sin(k * Math.PI) * sag, z = a[2] + (b[2] - a[2]) * k; sphere(.2, mat(cols[i % 3], { emissive: cols[i % 3], emissiveIntensity: 2.2 }), g, x, y, z, 8, 6); }
  return g; }
// árbol pelado con nieve en las ramas
export function bareTree(parent, x, z, s = 1, seed = 1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g); const m = mat(0x3a2a22, { roughness: 1 }), w = mat(0xffffff);
  cyl(.35, .55, 9, m, 7, g, 0, 4.5, 0); const r = RNG(seed);
  for (let k = 0; k < 7; k++) { const a = k * 2.4 + r(), y = 4 + k * .8, L = 3.4 - k * .3; const b = cyl(.08, .2, L, m, 5, g, Math.cos(a) * L * .4, y + L * .35, Math.sin(a) * L * .4); b.rotation.set(Math.sin(a) * .8, 0, -Math.cos(a) * .8); const sn = box(.3, .12, L * .6, w, .05, g, Math.cos(a) * L * .45, y + L * .45, Math.sin(a) * L * .45); sn.rotation.copy(b.rotation); }
  return shade(g); }
// huellas (decales oscuros), siguiendo una lista de puntos
export function prints(parent, pts, kind = 'small', stride = 1.3) { const g = new THREE.Group(); parent.add(g); const m = mat(0x6a84b0, { roughness: 1 }); const w = kind === 'small' ? .45 : .7, l = kind === 'small' ? .8 : 1.2; let side = 1;
  for (let i = 0; i < pts.length - 1; i++) { const [x0, z0] = pts[i], [x1, z1] = pts[i + 1]; const d = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(x1 - x0, z1 - z0), n = Math.floor(d / stride);
    for (let k = 0; k < n; k++) { const t = k / n, px = x0 + (x1 - x0) * t + Math.cos(a) * side * .35, pz = z0 + (z1 - z0) * t - Math.sin(a) * side * .35; const p = box(w, .06, l, m, .1, g, px, .06, pz); p.rotation.y = a; side *= -1; } }
  return g; }

// ---------- Stube: salón + cocina (X): suelo y = 0, paredes x ±20, fondo z = -15, abierto a +z ----------
export function stube(scene, X) { const g = new THREE.Group(); g.position.set(X, 0, 0); scene.add(g);
  const wall = mat(0xffffff, { map: rep(stripes('#f0e2c4', '#e6d4b0', 14), 3, 1), roughness: .9 }), wd = mat(0xffffff, { map: rep(noiseTex('#b07a48', ['#9a6638', '#c08a58'], 900, 3, 1), 6, 6), roughness: .7 }), wh = mat(0xffffff, { roughness: .5 });
  box(44, .4, 46, wd, 0, g, 0, -.2, 6); for (let x = -20; x <= 20; x += 2.2) box(.06, .02, 46, mat(0x8a5a30), 0, g, x, .02, 6);
  box(44, 16, .6, wall, 0, g, 0, 8, -15.3); const WL = box(.6, 16, 46, wall, 0, g, -20.3, 8, 6), WR = box(.6, 16, 46, wall, 0, g, 20.3, 8, 6); box(44, .6, 46, mat(0xfaf6ee), 0, g, 0, 16.2, 6);
  const BB = []; for (const [w, x, z, ry] of [[44, 0, -14.9, 0], [46, -19.9, 6, Math.PI / 2], [46, 19.9, 6, -Math.PI / 2]]) { const b = box(w, 1, .3, wh, .05, g, x, .5, z); b.rotation.y = ry; BB.push(b); }
  // ventana del fondo con paisaje nevado
  const view = textPlane(10, 7, 300, 210, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9ac8f0'); gr.addColorStop(1, '#e8f2ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(0, h * .7, w, h * .3);
    for (let i = 0; i < 5; i++) { c.fillStyle = ['#f2b8c6', '#a8d8f0', '#f6dc8a', '#b9e3b0', '#d4b8f2'][i]; c.fillRect(10 + i * 60, h * .38, 50, h * .34); c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(5 + i * 60, h * .4); c.lineTo(35 + i * 60, h * .2); c.lineTo(65 + i * 60, h * .4); c.fill(); }
    const r = RNG(3); c.fillStyle = '#fff'; for (let i = 0; i < 60; i++) { c.beginPath(); c.arc(r() * w, r() * h, 1.5 + r() * 2, 0, 7); c.fill(); } }, .35);
  view.position.set(-2, 8.5, -14.95); g.add(view); for (const [w, h, x, y] of [[10.8, .6, -2, 12.3], [10.8, .6, -2, 4.7], [.6, 8, -7.2, 8.5], [.6, 8, 3.2, 8.5], [.3, 7, -2, 8.5]]) box(w, h, .6, wh, .05, g, x, y, -14.8);
  for (const s of [-1, 1]) box(1.6, 9, .3, mat(0xc83a3a, { roughness: 1 }), .1, g, -2 + s * 6.2, 8.4, -14.5);
  // cocina (izquierda del fondo): encimera, fogón, nevera, armarios, sartenes
  const KX = -14; box(11, 3, 4, mat(0x5a8ab0, { roughness: .5 }), .1, g, KX, 1.5, -12.6); box(11.4, .4, 4.4, mat(0xf4f0e8, { roughness: .3 }), .05, g, KX, 3.2, -12.6); for (let k = 0; k < 4; k++) box(2.3, 2.2, .1, mat(0x6a9ac0), .05, g, KX - 4 + k * 2.6, 1.5, -10.55);
  box(10, 3.4, 2.6, mat(0x5a8ab0), .1, g, KX, 10, -13.6); for (const fx of [-2, 2]) { cyl(.8, .8, .1, mat(0x222222), 16, g, KX + fx, 3.45, -12.4); }
  for (let k = 0; k < 3; k++) { const p = cyl(.7, .6, .2, mat(0x2a2a2a, { metalness: .5 }), 14, g, KX - 3 + k * 2, 6.5, -14.9); p.rotation.x = Math.PI / 2; }
  box(3.6, 8, 3.6, mat(0xf4f4f4, { roughness: .3 }), .2, g, -17.6, 4, -12.4); box(.2, 2.4, .2, mat(0xaaaaaa, { metalness: .7 }), 0, g, -16, 5, -10.5);
  const pan = cyl(1, .9, .3, mat(0x2a2a2a, { metalness: .4 }), 18, g, KX + 2, 3.65, -12.4); const panH = box(2, .2, .3, mat(0x1a1a1a), .05, g, KX + 3.8, 3.75, -12.4);
  // mesa con mantel, sillas, lámpara colgante
  const TB = new THREE.Group(); TB.position.set(-1, 0, -3); g.add(TB); box(10, .4, 6, wd, .1, TB, 0, 2.8, 0); box(10.4, .1, 6.4, mat(0xffffff, { map: rep(canvasTex(32, 32, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d84a5a'; c.globalAlpha = .5; c.fillRect(0, 0, 16, h); c.fillRect(0, 0, w, 16); }, true), 6, 4) }), 0, TB, 0, 3.05, 0);
  for (const [x, z] of [[-4.4, -2.4], [4.4, -2.4], [-4.4, 2.4], [4.4, 2.4]]) box(.4, 2.6, .4, wd, .05, TB, x, 1.3, z);
  const CH = []; for (const [x, z, ry] of [[-3, -4.6, 0], [3, -4.6, 0], [-6.4, 0, Math.PI / 2], [6.4, 0, -Math.PI / 2]]) { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; TB.add(c); box(2.4, .3, 2.4, wd, .05, c, 0, 1.7, 0); box(2.4, 2.6, .3, wd, .05, c, 0, 3.0, -1.1); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(.25, 1.7, .25, wd, 0, c, a, .85, b); CH.push(c); }
  cyl(.06, .06, 4, mat(0x222222), 6, g, -1, 14, -3); const shadeL = cyl(.6, 1.8, 1.4, mat(0x2a6a5a, { roughness: .4 }), 18, g, -1, 11.4, -3); sphere(.4, mat(0xfff4d0, { emissive: 0xffd88a, emissiveIntensity: 2 }), g, -1, 10.8, -3, 10, 8);
  // sofá y alfombra (derecha)
  const SOFA = new THREE.Group(); SOFA.position.set(13, 0, 2); SOFA.rotation.y = -Math.PI / 2; g.add(SOFA); const sm = mat(0x3a6ab8, { roughness: .9 }); box(10, 1.6, 4, sm, .4, SOFA, 0, 1.0, 0); box(10, 2.6, 1.4, sm, .4, SOFA, 0, 2.6, -1.6); for (const s of [-1, 1]) box(1.2, 2.2, 4, sm, .4, SOFA, s * 5, 1.6, 0); for (const s of [-1, 1]) box(2.2, 1.6, .8, mat([0xffd23f, 0xd84a5a][(s + 1) / 2]), .4, SOFA, s * 2.8, 2.6, -.6);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(6, 28), mat(0xd8a050, { roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(8, .05, 4); g.add(rug);
  // aparador con la radio (pared derecha, cerca del fondo)
  const SB = new THREE.Group(); SB.position.set(18, 0, -8); SB.rotation.y = -Math.PI / 2; g.add(SB); box(9, 3, 3, wd, .1, SB, 0, 1.5, 0); for (const s of [-1, 1]) box(4, 2.2, .1, mat(0x8a5a30), .05, SB, s * 2.2, 1.5, 1.52);
  const RAD = new THREE.Group(); RAD.position.set(-1.5, 3, 0); SB.add(RAD); box(4, 2.4, 1.8, mat(0x8a4a2a, { roughness: .4 }), .3, RAD, 0, 1.2, 0); const grill = textPlane(1.8, 1.6, 90, 80, (c, w, h) => { c.fillStyle = '#e8d8b0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a6a40'; c.lineWidth = 3; for (let y = 8; y < h; y += 10) { c.beginPath(); c.moveTo(4, y); c.lineTo(w - 4, y); c.stroke(); } }); grill.position.set(-.9, 1.2, .92); RAD.add(grill);
  const dial = textPlane(1.6, .8, 120, 60, (c, w, h) => { c.fillStyle = '#ffe8a0'; c.fillRect(0, 0, w, h); c.fillStyle = '#5a3a1a'; for (let x = 8; x < w; x += 10) c.fillRect(x, 10, 2, 14); c.fillStyle = '#d8323a'; c.fillRect(60, 6, 3, 40); }, .4); dial.position.set(.95, 1.7, .92); RAD.add(dial); for (const s of [-1, 1]) { const k = cyl(.25, .25, .2, mat(0xe8d8b0), 12, RAD, .95 + s * .5, .7, .95); k.rotation.x = Math.PI / 2; } const ant = cyl(.04, .04, 2.6, mat(0xc8c8c8, { metalness: .8 }), 6, RAD, 1.4, 3.2, 0); ant.rotation.z = -.4;
  // cable + enchufe (se puede desenchufar: PLUG.position)
  const PLUG = new THREE.Group(); SB.add(PLUG); box(.5, .7, .4, mat(0xf4f4f4), .1, PLUG, 0, 0, 0); for (const s of [-1, 1]) cyl(.05, .05, .4, mat(0xc8c8c8, { metalness: .8 }), 6, PLUG, s * .12, 0, .3).rotation.x = Math.PI / 2;
  const SOCKET = box(1, 1, .2, mat(0xf4f4f4), .2, g, 19.85, 1.6, -3.2); SOCKET.rotation.y = -Math.PI / 2;
  const CORD = cyl(.07, .07, 1, mat(0x1a1a1a), 6, g, 0, 0, 0);
  // espejos (Reflector) con sábanas: MIR[0] pared izquierda (mira +x), MIR[1] encima del aparador (mira -x), MIR[2] recibidor junto a la puerta
  const MIR = []; for (const [x, y, z, ry, w, h] of [[-19.7, 5.4, -1, Math.PI / 2, 5, 6.4], [19.7, 6.6, -8, -Math.PI / 2, 5, 4], [-19.7, 5, 12, Math.PI / 2, 3.6, 7.6]]) {
    const M = new THREE.Group(); M.position.set(x, y, z); M.rotation.y = ry; g.add(M); box(w + .8, h + .8, .3, mat(0xc89a40, { metalness: .6, roughness: .3 }), .1, M, 0, 0, -.05);
    const frame = M.children[0]; const r = mirrorize(new Reflector(new THREE.PlaneGeometry(w, h), { textureWidth: 1024, textureHeight: 1024, color: 0xd8dce4, clipBias: .003 }), x < 0 ? [WL, BB[1], frame] : [WR, BB[2], frame]); r.position.z = .12; M.add(r);
    const sheet = new THREE.Group(); M.add(sheet); const sm2 = mat(0xfafaf6, { roughness: 1 }); box(w + 1.6, h + 1.4, .3, sm2, .3, sheet, 0, -.2, .45); for (let k = 0; k < 5; k++) { const f = box(.5, h + 1.6, .5, sm2, .25, sheet, -w / 2 + k * w / 4, -.3, .6); f.rotation.z = (k - 2) * .02; } box(w + 2, .8, 1, sm2, .3, sheet, 0, h / 2 + .5, .4);
    MIR.push({ g: M, r, sheet }); }
  // cuadros, reloj, calendario, planta, puerta
  for (const [x, y, c1] of [[8, 10, '#ffd23f'], [12.5, 10.8, '#9ac8f0'], [8.5, 13, '#f2b8c6']]) { const p = textPlane(3, 2.4, 120, 96, (c, w, h) => { c.fillStyle = '#5a3a1a'; c.fillRect(0, 0, w, h); c.fillStyle = c1; c.fillRect(8, 8, w - 16, h - 16); c.fillStyle = '#3a7a5a'; c.fillRect(8, h * .6, w - 16, h * .4 - 8); c.fillStyle = '#fff'; c.beginPath(); c.arc(w * .3, h * .35, 9, 0, 7); c.fill(); }); p.position.set(x, y, -14.95); g.add(p); }
  const CLK = textPlane(3.4, 3.4, 200, 200, () => {}); CLK.position.set(15, 12.8, -14.95); g.add(CLK);
  const CALW = textPlane(3, 3.6, 150, 180, (c, w, h) => { drawCal(c, w, h, true); }); CALW.position.set(5.8, 7.2, -14.95); g.add(CALW);
  const pot = cyl(1, .8, 1.6, mat(0xc85a3a), 12, g, -6.5, .8, -13); for (let k = 0; k < 7; k++) { const l = sphere(.9, mat(0x2a8a4a), g, -6.5 + Math.cos(k) * .7, 2.6 + (k % 3) * .6, -13 + Math.sin(k) * .7, 8, 6); l.scale.y = 1.4; }
  const DOOR = new THREE.Group(); DOOR.position.set(19.9, 0, 10); DOOR.rotation.y = -Math.PI / 2; g.add(DOOR); box(5, 10, .3, mat(0x6a3a22), .1, DOOR, 0, 5, 0); sphere(.25, mat(0xd9a531, { metalness: .8 }), DOOR, 1.8, 5, .3);
  // ganchos con abrigos junto a la puerta
  for (let k = 0; k < 3; k++) { box(.3, .3, .8, mat(0x8a5a30), .05, g, 19.6, 10, 2 + k * 2.2); const cc = box(1.6, 4, .8, mat([0xd84a5a, 0x3a6ab8, 0x9a7ad8][k], { roughness: .8 }), .3, g, 19.3, 7.8, 2 + k * 2.2); cc.rotation.y = Math.PI / 2; }
  shade(g); MIR.forEach(m => { m.r.castShadow = false; m.r.receiveShadow = false; });
  const light = new THREE.PointLight(0xffe2b0, 60, 60, 1.4); light.position.set(-1, 10, 2); g.add(light);
  const setClock = (h, m) => { const cv = CLK.material.map.image, c = cv.getContext('2d'), w = cv.width; c.clearRect(0, 0, w, w); c.fillStyle = '#5a3a1a'; c.beginPath(); c.arc(w / 2, w / 2, w / 2, 0, 7); c.fill(); c.fillStyle = '#fffaf0'; c.beginPath(); c.arc(w / 2, w / 2, w / 2 - 10, 0, 7); c.fill();
    c.fillStyle = '#1a1a1a'; for (let k = 0; k < 12; k++) { const a = k / 6 * Math.PI; c.save(); c.translate(w / 2, w / 2); c.rotate(a); c.fillRect(-3, -w / 2 + 16, 6, k % 3 ? 10 : 20); c.restore(); }
    const hand = (a, L, wd, col) => { c.save(); c.translate(w / 2, w / 2); c.rotate(a); c.fillStyle = col; c.fillRect(-wd / 2, -L, wd, L + 8); c.restore(); }; hand((h % 12 + m / 60) / 6 * Math.PI, w * .26, 10, '#1a1a1a'); hand(m / 30 * Math.PI, w * .38, 6, '#1a1a1a'); c.fillStyle = '#d8323a'; c.beginPath(); c.arc(w / 2, w / 2, 8, 0, 7); c.fill(); CLK.material.map.needsUpdate = true; };
  setClock(9, 10);
  return { g, X, TB, CH, MIR, RAD, PLUG, SOCKET, CORD, SB, CLK, setClock, pan, SOFA, DOOR, view }; }
export function drawCal(c, w, h, small = false, mark = 1) { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a5aa8'; c.fillRect(0, 0, w, h * .2); txt(c, 'JANUAR', w / 2, h * .1 + 2, small ? 30 : 64, '#ffffff');
  const cw = w / 7, ch = h * .8 / 5; for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) { const x = k * cw, y = h * .2 + r * ch; c.fillStyle = (r * 7 + k) % 2 ? '#eef2fa' : '#f8faff'; c.fillRect(x + 2, y + 2, cw - 4, ch - 4); c.fillStyle = '#5a6a8a'; c.font = `700 ${small ? 12 : 26}px ${FONT}`; c.textAlign = 'center'; c.fillText(String(r * 7 + k + 1), x + cw / 2, y + ch * .45); }
  if (mark) { const x = 3 * cw + cw / 2, y = h * .2 + 2 * ch + ch / 2; c.strokeStyle = '#d8323a'; c.lineWidth = small ? 4 : 10; c.beginPath(); c.arc(x, y, cw * .62, 0, 7); c.stroke(); if (!small) { txt(c, 'BESUCH', x, y + ch * .36, 22, '#d8323a'); } } }

// ---------- Mühlenteich (X): hielo con reflejo (centro X, 0), orillas nevadas, molino al norte, casas al fondo ----------
export function teich(scene, X) { const g = new THREE.Group(); g.position.set(X, 0, 0); scene.add(g);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), SNOW()); gr.rotation.x = -Math.PI / 2; gr.position.y = .02; gr.receiveShadow = true; g.add(gr);
  const R = 34; const ice = mirrorize(new Reflector(new THREE.CircleGeometry(R, 48), { textureWidth: 1024, textureHeight: 1024, color: 0x9ab4d0, clipBias: .003 })); ice.rotation.x = -Math.PI / 2; ice.position.y = .08; g.add(ice);
  const frost = new THREE.Mesh(new THREE.CircleGeometry(R, 48), new THREE.MeshStandardMaterial({ map: canvasTex(512, 512, (c, w, h) => { c.clearRect(0, 0, w, h); const r = RNG(11); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; for (let i = 0; i < 26; i++) { let x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (r() - .5) * 80; y += (r() - .5) * 80; c.lineTo(x, y); } c.stroke(); } const gg = c.createRadialGradient(w / 2, h / 2, w * .3, w / 2, h / 2, w / 2); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(1, 'rgba(255,255,255,.75)'); c.fillStyle = gg; c.fillRect(0, 0, w, h); }), transparent: true, roughness: .2, depthWrite: false }));
  frost.rotation.x = -Math.PI / 2; frost.position.y = .1; g.add(frost);
  const bank = mat(0xf8fbff, { roughness: 1 }); for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283; const b = sphere(3 + (i % 3), bank, g, Math.cos(a) * (R + 2), 0, Math.sin(a) * (R + 2), 10, 6); b.scale.y = .32; }
  // juncos
  const rm = mat(0x8a7a4a, { roughness: 1 }); for (let i = 0; i < 60; i++) { const a = i * .9, d = R + .5 + (i % 3) * .6; if (Math.sin(a) > .6) continue; const h = 2 + (i % 4) * .6; const rr = cyl(.06, .08, h, rm, 4, g, Math.cos(a) * d, h / 2, Math.sin(a) * d); rr.rotation.z = Math.sin(i) * .15; if (i % 3 === 0) cyl(.16, .16, .7, mat(0x5a3a20), 6, g, Math.cos(a) * d, h, Math.sin(a) * d); }
  // árboles pelados alrededor
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + .2, d = R + 10 + (i % 3) * 5; bareTree(g, Math.cos(a) * d, Math.sin(a) * d, .9 + (i % 3) * .25, i + 3); }
  // molino de agua al norte (z negativo), con rueda
  const MILL = new THREE.Group(); MILL.position.set(-8, 0, -R - 14); g.add(MILL); box(16, 12, 12, mat(0xffffff, { map: rep(noiseTex('#c8b8a0', ['#b8a890', '#d8c8b0'], 900, 3, 1), 2, 2) }), .2, MILL, 0, 6, 0); const mr = new THREE.Mesh(new THREE.CylinderGeometry(.01, 11.5, 7, 4, 1, false, Math.PI / 4), mat(0xf6f9ff)); mr.scale.z = 1.1; mr.position.y = 15.5; MILL.add(mr);
  for (const x of [-4, 4]) { box(2.4, 3, .3, mat(0x2a4a6a), .05, MILL, x, 7, 6.1); box(2.8, .3, .6, mat(0xffffff), 0, MILL, x, 5.4, 6.2); } box(3, 5, .3, mat(0x5a3a22), .05, MILL, 0, 2.5, 6.1);
  const WHEEL = new THREE.Group(); WHEEL.position.set(8.8, 6, 2); MILL.add(WHEEL); const wm = mat(0x6a4a2a, { roughness: .9 }); for (const s of [-1, 1]) { const t = new THREE.Mesh(new THREE.TorusGeometry(5, .3, 8, 24), wm); t.position.x = s * 1; t.rotation.y = Math.PI / 2; WHEEL.add(t); } for (let k = 0; k < 12; k++) { const p = box(2.4, .3, 2, wm, .05, WHEEL, 0, Math.cos(k / 12 * 6.283) * 4.6, Math.sin(k / 12 * 6.283) * 4.6); p.rotation.x = -k / 12 * 6.283; } cyl(.4, .4, 2.6, wm, 10, WHEEL, 0, 0, 0).rotation.z = Math.PI / 2;
  const ms = textPlane(8, 2, 320, 80, (c, w, h) => { c.fillStyle = '#5a3a20'; c.fillRect(0, 0, w, h); txt(c, 'ALTE MÜHLE', w / 2, h / 2 + 3, 46, '#f6e6b8'); }); ms.position.set(0, 10.4, 6.2); MILL.add(ms);
  // cartel del estanque
  const SG = new THREE.Group(); SG.position.set(10, 0, R + 6); SG.rotation.y = -.3; g.add(SG); for (const x of [-2.2, 2.2]) cyl(.15, .15, 5, mat(0x5a3a20), 6, SG, x, 2.5, 0); const sgp = textPlane(6.4, 2.2, 320, 110, (c, w, h) => { c.fillStyle = '#7a5030'; c.fillRect(0, 0, w, h); c.strokeStyle = '#4a2a14'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); txt(c, 'MÜHLENTEICH', w / 2, h * .4, 44, '#fff4d8'); txt(c, 'Betreten verboten!', w / 2, h * .75, 26, '#ffd23f'); }); sgp.position.set(0, 4.4, .2); SG.add(sgp); box(6.8, .4, 1, mat(0xffffff), .1, SG, 0, 5.7, 0);
  bench(g, -16, R + 8, Math.PI); box(3.8, .2, .7, mat(0xffffff), .05, g, -16, 1.55, R + 8);
  // casas del pueblo al fondo (sur y oeste) para que nunca se vea vacío
  for (let i = 0, x = -120; x <= 120; x += 17, i++) townhouse(g, x, 95, 16, 2 + (i % 3), 10 + i, Math.PI);
  for (let i = 0, x = -140; x <= 140; x += 19, i++) townhouse(g, x, -110, 18, 2 + (i % 2), 30 + i, 0);
  for (let i = 0, z = -80; z <= 80; z += 18, i++) { townhouse(g, -105, z, 16, 2 + (i % 2), 50 + i, Math.PI / 2); townhouse(g, 105, z, 16, 2 + (i % 3), 60 + i, -Math.PI / 2); }
  for (let i = 0, x = -60; x <= 60; x += 20) lamp(g, x, 72, 1);
  winterRoofs(g);
  // agujero en el hielo (recuerdo del accidente): HOLE
  const HOLE = new THREE.Group(); HOLE.position.set(4, .12, -6); g.add(HOLE); const hm = new THREE.Mesh(new THREE.CircleGeometry(3.2, 20), mat(0x0a1a2a, { roughness: .1 })); hm.rotation.x = -Math.PI / 2; HOLE.add(hm); const r9 = RNG(9); for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283; const sh = box(1.2 + r9(), .3, .9 + r9() * .6, mat(0xd8eaf8, { roughness: .2, transparent: true, opacity: .9 }), .05, HOLE, Math.cos(a) * 3.4, .1, Math.sin(a) * 3.4); sh.rotation.set(r9() * .4, -a, r9() * .3); } HOLE.visible = false;
  return { g, X, R, ice, frost, MILL, WHEEL, SG, HOLE }; }
export function winterRoofs(g) { const roofM = mat(0xf6f9ff, { roughness: .9 }); g.traverse(o => { if (o.isMesh && o.geometry.type === 'CylinderGeometry' && o.geometry.parameters.radialSegments === 4) o.material = roofM; if (o.isMesh && o.material && o.material.color && !o.material.map) { const c = o.material.color; if (c.g > c.r * 1.25 && c.g > c.b * 1.1) { o.material = o.material.clone(); o.material.color.setRGB(.93, .96, 1); } } }); }

// ---------- Friedhof (X): cementerio nevado con capilla y casas detrás ----------
export function friedhof(scene, X) { const g = new THREE.Group(); g.position.set(X, 0, 0); scene.add(g);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), SNOW()); gr.rotation.x = -Math.PI / 2; gr.position.y = .02; gr.receiveShadow = true; g.add(gr);
  const st = mat(0x8a8e98, { roughness: .8 }), w = mat(0xffffff); const GR = [];
  for (let r = 0; r < 4; r++) for (let k = -3; k <= 3; k++) { const x = k * 7 + (r % 2) * 2, z = -r * 9; const s = new THREE.Group(); s.position.set(x, 0, z); g.add(s); if ((k + r) % 3 === 0) { box(.6, 5, .5, st, .05, s, 0, 2.5, 0); box(2.6, .6, .5, st, .05, s, 0, 3.6, 0); } else { box(3, 4, .8, st, .3, s, 0, 2, 0); box(3.1, .3, .9, w, .1, s, 0, 4.1, 0); } const m2 = box(3, .8, 5, w, .3, s, 0, .3, 2.8); GR.push(s); }
  // tumba principal (OPA) con nombre, flores y vela
  const MAIN = new THREE.Group(); MAIN.position.set(0, 0, 10); g.add(MAIN); box(5, 6, 1.2, mat(0x6a6e78, { roughness: .7 }), .4, MAIN, 0, 3, 0); box(5.2, .4, 1.4, w, .15, MAIN, 0, 6.1, 0);
  const nm = textPlane(4.2, 3.6, 210, 180, (c, ww, h) => { c.fillStyle = '#6a6e78'; c.fillRect(0, 0, ww, h); txt(c, '✝', ww / 2, 34, 44, '#e8e0c8'); txt(c, 'Heinrich', ww / 2, 88, 34, '#f4ecd0'); txt(c, 'Brandl', ww / 2, 126, 34, '#f4ecd0'); txt(c, '1941 – 2025', ww / 2, 164, 22, '#e8e0c8'); }); nm.position.set(0, 3.2, .62); MAIN.add(nm);
  for (let k = 0; k < 6; k++) sphere(.4, mat([0xd8323a, 0xffd23f, 0xffffff][k % 3]), MAIN, -1.8 + k * .7, .5, 1.6, 8, 6); cyl(.3, .3, .9, mat(0xd8323a), 10, MAIN, 1.8, .9, 1.4); sphere(.15, mat(0xffd23f, { emissive: 0xffa21a, emissiveIntensity: 3 }), MAIN, 1.8, 1.5, 1.4, 8, 6);
  const CHAP = new THREE.Group(); CHAP.position.set(-6, 0, -55); g.add(CHAP); box(14, 12, 16, mat(0xf2ead8), .2, CHAP, 0, 6, 0); const cr = new THREE.Mesh(new THREE.CylinderGeometry(.01, 10.5, 7, 4, 1, false, Math.PI / 4), mat(0xf6f9ff)); cr.scale.z = 1.25; cr.position.y = 15.5; CHAP.add(cr); box(3.6, 22, 3.6, mat(0xf2ead8), .1, CHAP, 0, 11, 9); const sp = new THREE.Mesh(new THREE.ConeGeometry(2.8, 8, 4), mat(0x3a5a4a)); sp.position.set(0, 26, 9); sp.rotation.y = Math.PI / 4; CHAP.add(sp);
  for (let i = 0, x = -100; x <= 100; x += 17, i++) townhouse(g, x, -95, 16, 2 + (i % 3), 70 + i, 0);
  for (let i = 0; i < 6; i++) bareTree(g, -30 + i * 12, -30 + (i % 2) * 14, 1.1, i + 20);
  // muro bajo
  for (let x = -30; x <= 30; x += 4) { box(4, 2, 1, mat(0x9a8e7a), .1, g, x, 1, 22); box(4.2, .4, 1.2, w, .1, g, x, 2.1, 22); }
  winterRoofs(g);
  return { g, X, MAIN, GR, CHAP }; }

// ---------- atrezo ----------
export function calendar(parent) { const p = textPlane(6, 7.2, 360, 432, (c, w, h) => drawCal(c, w, h, false, 1)); parent.add(p); return p; }
export function pancakes(parent, s = 1) { const g = new THREE.Group(); parent.add(g); g.scale.setScalar(s); cyl(2.2, 2, .2, mat(0xffffff, { roughness: .3 }), 28, g, 0, .1, 0); const pm = mat(0xe8a850, { roughness: .6 }), pe = mat(0xc87a30);
  for (let k = 0; k < 6; k++) { cyl(1.5 + (k % 2) * .05, 1.5, .26, k % 2 ? pm : pe, 24, g, (k % 3 - 1) * .05, .35 + k * .27, 0); }
  for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283; const sl = box(.7, .12, .3, mat(0xf6e8b0), .05, g, Math.cos(a) * .7, 2.0, Math.sin(a) * .7); sl.rotation.y = -a; box(.72, .12, .06, mat(0xd8323a), 0, g, Math.cos(a) * .7, 2.0, Math.sin(a) * .7 + .15).rotation.y = -a; }
  const sug = sphere(1.3, mat(0xffffff, { roughness: 1, transparent: true, opacity: .85 }), g, 0, 2.05, 0, 18, 8); sug.scale.y = .08; return shade(g); }
export function onion(parent) { const g = new THREE.Group(); parent.add(g); const o = sphere(.55, mat(0x9a3a8a, { roughness: .4 }), g, 0, 0, 0, 14, 10); o.scale.y = .9; const t = new THREE.Mesh(new THREE.ConeGeometry(.2, .5, 8), mat(0xb85aa8)); t.position.y = .6; g.add(t); return shade(g); }
export function newspaper(parent) { const p = textPlane(4, 5.2, 280, 364, (c, w, h) => { c.fillStyle = '#f4f0e4'; c.fillRect(0, 0, w, h); txt(c, 'Hufenbacher Bote', w / 2, 34, 30, '#1a1a1a'); c.fillStyle = '#1a1a1a'; c.fillRect(14, 54, w - 28, 3);
  txt(c, 'Heinrich Brandl', w / 2, 96, 30, '#1a1a1a'); txt(c, '(84) ist gestorben', w / 2, 132, 26, '#1a1a1a'); c.fillStyle = '#c8c0b0'; c.fillRect(30, 156, 100, 120); c.fillStyle = '#8a8070'; c.beginPath(); c.arc(80, 200, 26, 0, 7); c.fill(); c.fillRect(46, 230, 68, 46);
  c.fillStyle = '#9a9a9a'; for (let y = 160; y < 340; y += 14) c.fillRect(146, y, w - 170, 6); for (let y = 290; y < 350; y += 14) c.fillRect(30, y, 100, 6); }); p.material.side = THREE.DoubleSide; parent.add(p); return p; }
export function ruleBoard(parent) { const g = new THREE.Group(); parent.add(g); for (const x of [-3.4, 3.4]) cyl(.18, .18, 9, mat(0x5a3a22), 8, g, x, 4.5, 0);
  const p = textPlane(8, 9, 400, 450, (c, w, h) => { c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a5aa8'; c.fillRect(0, 0, w, 90); txt(c, 'BESUCHSTAG', w / 2, 48, 58, '#ffffff'); txt(c, 'REGEL Nr. 1', w / 2, 150, 46, '#1a1a2a');
    txt(c, 'SAG IHNEN', w / 2, 240, 52, '#d8323a'); txt(c, 'NIEMALS,', w / 2, 300, 52, '#d8323a'); txt(c, 'DASS SIE', w / 2, 360, 46, '#1a1a2a'); txt(c, 'TOT SIND.', w / 2, 414, 46, '#1a1a2a'); }); p.position.set(0, 5.5, .2); g.add(p); box(8.6, .5, .9, mat(0xffffff), .1, g, 0, 10.2, 0); return shade(g); }
// gato Socke: negro con calcetines blancos; G.userData.set('calm'|'hiss'), arquear el lomo con .userData.arch(k)
export function katze(parent) { const g = new THREE.Group(); parent.add(g); const f = mat(0x1e1e26, { roughness: .7 }), wh = mat(0xf4f4f4);
  const body = new THREE.Group(); body.position.y = 1.3; g.add(body); const b = box(1.3, 1, 2.6, f, .4, body, 0, 0, 0);
  for (const [x, z] of [[-.4, .9], [.4, .9], [-.4, -.9], [.4, -.9]]) { box(.34, 1.1, .34, f, .1, g, x, .55, z); box(.38, .3, .44, wh, .1, g, x, .15, z + .05); }
  const head = new THREE.Group(); head.position.set(0, 2.1, 1.5); g.add(head); box(1.3, 1.1, 1, f, .35, head, 0, 0, 0); for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(.3, .55, 4), f); e.position.set(s * .4, .7, 0); e.rotation.y = Math.PI / 4; head.add(e); }
  box(.6, .35, .3, wh, .12, head, 0, -.3, .45);
  const FACE = textPlane(1.2, 1, 120, 100, () => {}); FACE.position.set(0, .05, .52); head.add(FACE);
  const draw = mode => { const cv = FACE.material.map.image, c = cv.getContext('2d'), w = cv.width, h = cv.height; c.clearRect(0, 0, w, h);
    for (const s of [-1, 1]) { c.fillStyle = '#9ae84a'; c.beginPath(); c.ellipse(w / 2 + s * 28, 36, mode === 'hiss' ? 16 : 13, mode === 'hiss' ? 13 : 15, 0, 0, 7); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.ellipse(w / 2 + s * 28, 36, mode === 'hiss' ? 3 : 5, 12, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(w / 2 + s * 28 + 4, 30, 3, 0, 7); c.fill();
      if (mode === 'hiss') { c.strokeStyle = '#111'; c.lineWidth = 5; c.beginPath(); c.moveTo(w / 2 + s * 46, 16); c.lineTo(w / 2 + s * 14, 26); c.stroke(); } }
    c.fillStyle = '#ff8aa8'; c.beginPath(); c.moveTo(w / 2 - 6, 56); c.lineTo(w / 2 + 6, 56); c.lineTo(w / 2, 62); c.fill();
    if (mode === 'hiss') { c.fillStyle = '#5a0a1a'; c.beginPath(); c.ellipse(w / 2, 78, 18, 14, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(w / 2 + s * 12, 66); c.lineTo(w / 2 + s * 8, 78); c.lineTo(w / 2 + s * 4, 66); c.fill(); } }
    else { c.strokeStyle = '#111'; c.lineWidth = 3; c.beginPath(); c.arc(w / 2 - 6, 64, 6, 0, Math.PI); c.arc(w / 2 + 6, 64, 6, 0, Math.PI); c.stroke(); }
    c.strokeStyle = '#ddd'; c.lineWidth = 2; for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(w / 2 + s * 14, 60 + k * 4); c.lineTo(w / 2 + s * 56, 56 + k * 9); c.stroke(); } FACE.material.map.needsUpdate = true; };
  let cur = null; const tail = new THREE.Group(); tail.position.set(0, 1.5, -1.3); g.add(tail); for (let k = 0; k < 5; k++) box(.26, .26, .55, f, .1, tail, 0, k * .1, -k * .45);
  g.userData = { head, tail, body, set(m) { if (m !== cur) { cur = m; draw(m); } }, arch(k) { body.position.y = 1.3 + k * .6; body.scale.set(1, 1 + k * .25, 1); head.position.y = 2.1 + k * .1; tail.rotation.x = -.3 - k * 1.1; } };
  g.userData.set('calm'); return shade(g); }
export function sparkles(scene, n = 60) { const P = Array.from({ length: n }, (_, i) => { const m = box(.35, .35, .35, mat([0xffffff, 0xe8d8ff, 0xfff4c0][i % 3], { emissive: [0xffffff, 0xc8a8ff, 0xffe08a][i % 3], emissiveIntensity: 1.6 }), .05, scene, 0, 0, 0); m.visible = false; return m; });
  return { P, run(c, k, T, spread = 2.4, h = 6) { P.forEach((p, i) => { const r = RNG(i * 7 + 3); const t = clamp01(k * 1.4 - r() * .4); if (t <= 0 || t >= 1) { p.visible = false; return; } p.visible = true; p.position.set(c.x + (r() - .5) * spread + Math.sin(T * 2 + i) * t, c.y + r() * h + t * 8, c.z + (r() - .5) * spread); p.rotation.set(T * 3 + i, T * 2, 0); p.scale.setScalar(1 - t); }); }, hide() { P.forEach(p => p.visible = false); } }; }
const clamp01 = v => Math.max(0, Math.min(1, v));

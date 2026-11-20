// KELLER — escenarios propios: la ciudad de juguete (plaza con fuente, carretera en cuadro, casas amarillas y rojas con tejado de teja),
// el sótano (Keller) con la mesa y la maqueta de la ciudad, la escalera que baja al sótano y la casa de Thomas (ladrillo rojo).
// La maqueta es un clon de la ciudad a escala: así el zoom infinito empalma sin costuras.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, rrect } from './engine.js';
import { noiseTex, tree, lamp, bench, fountain } from './props.js';
import { glass } from './pech.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !(o.material && o.material.transparent)) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const G = (p, x = 0, y = 0, z = 0, ry = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; if (p) p.add(g); return g; };
const plane = (w, h, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };

// ---------- texturas ----------
export const brickTex = (a = '#d8402e', b = '#f2e6d8', n = 128) => canvasTex(n, n, (c, w, h) => { c.fillStyle = b; c.fillRect(0, 0, w, h); const r = RNG(a.length * 3 + 5); const bh = n / 12;
  for (let y = 0; y < h; y += bh) for (let x = (y / bh) % 2 ? -bh : 0; x < w; x += bh * 2) { const l = .85 + r() * .25; c.fillStyle = a; c.globalAlpha = l; c.fillRect(x + 1, y + 1, bh * 2 - 2, bh - 2); c.globalAlpha = .12; c.fillStyle = '#fff'; c.fillRect(x + 1, y + 1, bh * 2 - 2, 2); } c.globalAlpha = 1; }, true);
const tileRoof = (a, b) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = b; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 26) for (let x = (y / 26) % 2 ? -18 : 0; x < w; x += 36) { c.fillStyle = a; rrect(c, x + 2, y, 32, 24, [0, 0, 14, 14]); c.fill(); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x + 5, y + 2, 26, 4); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x + 2, y + 20, 32, 4); } }, true);
const plaster = (col) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); const r = RNG(col.length * 11); for (let i = 0; i < 260; i++) { c.fillStyle = r() > .5 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 4); } }, true);
export const plankTex = (a = '#c8843e', b = '#a86a2e') => canvasTex(256, 256, (c, w, h) => { const r = RNG(9); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? a : b; c.fillRect(0, i * 32, w, 32); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, i * 32, w, 2); const off = r() * w; c.fillRect(off, i * 32, 2, 32);
  c.strokeStyle = 'rgba(0,0,0,.08)'; c.lineWidth = 1; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(0, i * 32 + 6 + k * 6); c.bezierCurveTo(w * .3, i * 32 + 4 + k * 6 + r() * 4, w * .6, i * 32 + 9 + k * 6, w, i * 32 + 6 + k * 6); c.stroke(); } } }, true);
const pave = () => canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#e8e6e2'; c.fillRect(0, 0, w, h); c.strokeStyle = '#cfccc6'; c.lineWidth = 3; for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, h); c.stroke(); c.beginPath(); c.moveTo(0, i * 32); c.lineTo(w, i * 32); c.stroke(); } }, true);
const grassT = () => noiseTex('#62c84e', ['#52b840', '#74d65c', '#7ee066'], 2400, 3, 1);
const asphalt = () => noiseTex('#5a5e68', ['#50545e', '#666a74'], 1600, 2, 1);
export const checkRug = (a = '#2a6ad8', b = '#ffffff', n = 8) => canvasTex(256, 256, (c, w, h) => { const s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = (i + j) % 2 ? a : b; c.fillRect(i * s, j * s, s, s); } c.strokeStyle = a; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10); }, true);
export const skyTex = () => canvasTex(512, 512, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1e6ff0'); g.addColorStop(.6, '#5aa8ff'); g.addColorStop(1, '#bfe2ff'); c.fillStyle = g; c.fillRect(0, 0, w, h); const r = RNG(4);
  for (let k = 0; k < 14; k++) { const x = r() * w, y = r() * h * .8, s = 18 + r() * 30; c.fillStyle = 'rgba(255,255,255,.92)'; for (let j = 0; j < 6; j++) { c.beginPath(); c.arc(x + j * s * .6, y + Math.sin(j * 2) * s * .2, s * (.6 + Math.sin(j * 1.7) * .25), 0, 7); c.fill(); } } });

// ---------- casa de juguete ----------
// o: { w, d, floors, wall (css), roof [a, b] (css), brick, shut (hex), door (hex), fence, chim }
const WIN_FR = mat(0xffffff, { roughness: .4 });
function windowAt(g, x, y, z, s, shut) { box(2.6 * s, 3.2 * s, .35, WIN_FR, .08, g, x, y, z); box(2.1 * s, 2.7 * s, .2, glass(), 0, g, x, y, z + .12); box(.16, 2.7 * s, .3, WIN_FR, 0, g, x, y, z + .2); box(2.1 * s, .16, .3, WIN_FR, 0, g, x, y + .2 * s, z + .2);
  if (shut != null) for (const sd of [-1, 1]) { const sh = box(1.05 * s, 3.1 * s, .25, mat(shut, { roughness: .6 }), .05, g, x + sd * 1.95 * s, y, z + .05); for (let k = -2; k <= 2; k++) box(.9 * s, .08, .3, mat(shut, { roughness: .5 }), 0, sh, 0, k * .5 * s, .02); }
  box(3.0 * s, .3, .9, WIN_FR, .05, g, x, y - 1.75 * s, z + .35); }
export function kHaus(parent, x, z, ry, o = {}) {
  const g = G(parent, x, 0, z, ry); const w = o.w ?? 18, d = o.d ?? 16, fl = o.floors ?? 2, fh = 7, h = fl * fh + 1.2;
  const wallM = o.brick ? mat(0xffffff, { map: rep(brickTex(o.brick, '#f0e2d2'), w / 6, h / 6), roughness: .85 }) : mat(0xffffff, { map: rep(plaster(o.wall || '#f6d04a'), w / 8, h / 8), roughness: .8 });
  box(w, h, d, wallM, .1, g, 0, h / 2, 0);
  box(w + .6, 1.2, d + .6, mat(o.base ?? 0xe8e2d6, { roughness: .8 }), .1, g, 0, .6, 0);   // zócalo
  for (let f = 1; f < fl; f++) box(w + .3, .4, d + .3, mat(0xffffff, { roughness: .5 }), .05, g, 0, f * fh + .6, 0);   // cornisa entre pisos
  // tejado a dos aguas (prisma) con alero
  const rh = w * .42, sh = new THREE.Shape(); sh.moveTo(-w / 2 - 1.2, 0); sh.lineTo(0, rh); sh.lineTo(w / 2 + 1.2, 0); sh.lineTo(-w / 2 - 1.2, 0);
  const rg = new THREE.ExtrudeGeometry(sh, { depth: d + 2.4, bevelEnabled: false }); rg.translate(0, 0, -(d + 2.4) / 2);
  const [ra, rb] = o.roof || ['#e0402e', '#9a2418'];
  const roofM = mat(0xffffff, { map: rep(tileRoof(ra, rb), w / 7, d / 7), roughness: .55 }); const capM = mat(new THREE.Color(rb).getHex(), { roughness: .6 });
  const roof = new THREE.Mesh(rg, [capM, roofM]); roof.position.y = h; g.add(roof);
  // gable con material de la pared
  const gs = new THREE.Shape(); gs.moveTo(-w / 2, 0); gs.lineTo(0, rh * (w / 2) / (w / 2 + 1.2)); gs.lineTo(w / 2, 0); const gg = new THREE.ShapeGeometry(gs);
  for (const sd of [-1, 1]) { const m = new THREE.Mesh(gg, wallM); m.position.set(0, h, sd * (d / 2 + .01)); if (sd < 0) m.rotation.y = Math.PI; g.add(m); }
  const ridge = box(.9, .9, d + 2.6, capM, .2, g, 0, h + rh - .2, 0); ridge.rotation.z = Math.PI / 4;
  if (o.chim !== false) { box(2.2, 6, 2.2, mat(0xffffff, { map: rep(brickTex('#b8483a', '#e8d8c8', 64), 1, 2) }), .1, g, w * .22, h + rh * .7, -d * .15); box(2.6, .5, 2.6, mat(0x5a5a5a), .1, g, w * .22, h + rh * .7 + 3.1, -d * .15); }
  // ventana redonda del hastial
  const ow = cyl(1.2, 1.2, .3, WIN_FR, 20, g, 0, h + rh * .38, d / 2 + .1); ow.rotation.x = Math.PI / 2; const og = cyl(.9, .9, .32, glass(), 20, g, 0, h + rh * .38, d / 2 + .15); og.rotation.x = Math.PI / 2;
  // fachada: ventanas por piso, puerta en planta baja
  const fz = d / 2 + .05, cols = Math.max(2, Math.floor(w / 6)), shut = o.shut ?? 0x2a8a4a;
  for (let f = 0; f < fl; f++) for (let i = 0; i < cols; i++) { const wx = -w / 2 + (i + .5) * (w / cols); if (f === 0 && i === Math.floor(cols / 2)) continue; windowAt(g, wx, f * fh + 4.4, fz, 1, shut);
    if (f > 0) for (let k = 0; k < 4; k++) sphere(.36, mat([0xe8323a, 0xff8ad0, 0xffd23f, 0xe8323a][(k + i) % 4], { roughness: .7 }), g, wx - 1.05 + k * .7, f * fh + 2.95, fz + .7, 8, 6); }
  const dx = -w / 2 + (Math.floor(cols / 2) + .5) * (w / cols);
  box(3.6, 5.6, .4, WIN_FR, .1, g, dx, 3.2, fz); box(3.0, 5.0, .3, mat(o.door ?? 0x2a5aa8, { roughness: .45 }), .08, g, dx, 3.1, fz + .15); sphere(.2, mat(0xe9c23a, { metalness: .8, roughness: .3 }), g, dx + 1.0, 3.0, fz + .45, 10, 8);
  for (let k = 0; k < 2; k++) box(2.6, .12, .1, mat(0xffffff), 0, g, dx, 4.2 - k * 2.2, fz + .32);
  const can = box(4.6, .3, 2.2, mat(new THREE.Color(rb).getHex()), .08, g, dx, 6.3, fz + 1); can.rotation.x = .25;
  box(4.4, .5, 2.4, mat(0xd8d4cc), .05, g, dx, .25, fz + 1.2); box(3.8, .5, 1.4, mat(0xd8d4cc), .05, g, dx, .75, fz + .8);   // escalones
  for (const sd of [-1, 1]) { const p = cyl(.7, .55, 1.2, mat(0xc8642e, { roughness: .8 }), 12, g, dx + sd * 3.1, .6, fz + 1.2); sphere(.9, mat(0x3a9a40, { roughness: .9 }), g, dx + sd * 3.1, 1.7, fz + 1.2, 10, 8); }
  // valla blanca delante (opcional)
  if (o.fence) { const fm = mat(0xffffff, { roughness: .5 }); for (let i = -w / 2 - 1; i <= w / 2 + 1; i += 1.1) { if (Math.abs(i - dx) < 2.6) continue; box(.35, 2.2, .25, fm, .06, g, i, 1.1, fz + 5.5); } for (const y of [.8, 1.7]) { box((dx - 2.6) - (-w / 2 - 1), .25, .15, fm, 0, g, (-w / 2 - 1 + dx - 2.6) / 2, y, fz + 5.5); box((w / 2 + 1) - (dx + 2.6), .25, .15, fm, 0, g, (w / 2 + 1 + dx + 2.6) / 2, y, fz + 5.5); } }
  g.userData = { w, d, h, rh, front: fz, door: new THREE.Vector3(dx, 0, fz) }; return shade(g); }

// ---------- coche de juguete ----------
export function toyCar(parent, col = 0xff6aa8) { const g = new THREE.Group(); parent.add(g); const b = mat(col, { roughness: .3, metalness: .15 }), dk = mat(0x1a1a1e, { roughness: .6 }), ch = mat(0xd8dce4, { metalness: .85, roughness: .2 });
  box(4.4, 1.6, 8.6, b, .55, g, 0, 1.6, 0); box(4.0, 1.5, 4.4, b, .5, g, 0, 3.0, -.5); box(4.06, 1.1, 3.6, glass(), .3, g, 0, 3.05, -.5); box(3.6, 1.12, 4.46, glass(), .3, g, 0, 3.05, -.5);
  for (const s of [-1, 1]) for (const z of [-2.7, 2.7]) { const w = cyl(.95, .95, .7, dk, 16, g, s * 2.1, .95, z); w.rotation.z = Math.PI / 2; const hc = cyl(.45, .45, .74, ch, 12, g, s * 2.1, .95, z); hc.rotation.z = Math.PI / 2; }
  for (const s of [-1, 1]) { sphere(.32, mat(0xffffff, { emissive: 0xfff4c0, emissiveIntensity: 1.2 }), g, s * 1.5, 1.9, 4.25, 10, 8); sphere(.28, mat(0xff2a2a, { emissive: 0xff2a2a, emissiveIntensity: .8 }), g, s * 1.6, 1.9, -4.25, 10, 8); }
  box(4.5, .5, .4, ch, .1, g, 0, 1.0, 4.35); box(4.5, .5, .4, ch, .1, g, 0, 1.0, -4.35); return shade(g); }

// ---------- la ciudad ----------
// plaza x,z ∈ [-32, 32]; carretera en cuadro de 32 a 44; acera 44–48; casas a partir de 50. Casa de Thomas al norte (0, -60), ladrillo rojo.
export const RING = 38;   // centro del carril
export function ciudad(parent, o = {}) { const T = G(parent); const mini = !!o.mini;
  const gr = plane(250, 250, mat(0xffffff, { map: rep(grassT(), 30, 30), roughness: 1 }), T, 0, 0, 0);
  if (mini) box(250, 6, 250, mat(0x7a4a2a, { roughness: .9 }), 0, T, 0, -3.02, 0);   // canto de tierra de la maqueta
  // carretera en cuadro con aceras y pasos de cebra
  const am = mat(0xffffff, { map: rep(asphalt(), 2, 20), roughness: .9 }), sw = mat(0xe4e0d8, { roughness: .85 }), curb = mat(0xf4f2ee, { roughness: .6 });
  for (const [x, z, w, d] of [[0, -RING, 88, 12], [0, RING, 88, 12], [-RING, 0, 12, 88], [RING, 0, 12, 88]]) { plane(w, d, am, T, x, .04, z); }
  for (const [x, z, w, d] of [[0, -46, 96, 4], [0, 46, 96, 4], [-46, 0, 4, 96], [46, 0, 4, 96]]) box(w, .5, d, sw, .05, T, x, .25, z);
  for (let i = -40; i <= 40; i += 6) { if (Math.abs(i) < 8) continue; for (const s of [-1, 1]) { box(2.6, .06, .35, mat(0xffd23f), 0, T, i, .08, s * RING); box(.35, .06, 2.6, mat(0xffd23f), 0, T, s * RING, .08, i); } }
  for (const s of [-1, 1]) for (let k = -5; k <= 5; k++) { box(1.1, .07, 9, mat(0xffffff), 0, T, k * 1.6, .09, s * RING); box(9, .07, 1.1, mat(0xffffff), 0, T, s * RING, .09, k * 1.6); }
  // plaza: pavimento claro, cruces blancas, 4 jardines con parterres, fuente
  plane(64, 64, mat(0xffffff, { map: rep(pave(), 8, 8), roughness: .7 }), T, 0, .06, 0); box(64.6, .6, 64.6, curb, .1, T, 0, .2, 0).material = curb;
  const pm = mat(0xffffff, { map: rep(pave(), 8, 8), roughness: .7 }); const top = plane(64, 64, pm, T, 0, .52, 0);
  const pg = mat(0xffffff, { map: rep(grassT(), 4, 4), roughness: 1 }), soil = mat(0x7a4a2a, { roughness: 1 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const cx = sx * 18, cz = sz * 18; box(22, .5, 22, pg, .1, T, cx, .7, cz);
    box(9, .7, 4, soil, .15, T, cx - sx * 3, .9, cz + sz * 5); box(4, .7, 9, soil, .15, T, cx + sx * 5, .9, cz - sz * 3);
    const fr = RNG(cx * 3 + cz); for (let k = 0; k < 10; k++) { sphere(.55, mat([0xff4a8a, 0xffd23f, 0xff6a3a, 0xc06aff][k % 4], { roughness: .7 }), T, cx - sx * 3 + (fr() - .5) * 7.5, 1.5, cz + sz * 5 + (fr() - .5) * 2.6, 8, 6); sphere(.55, mat([0xff4a8a, 0xffd23f, 0xff6a3a, 0x6ac0ff][k % 4], { roughness: .7 }), T, cx + sx * 5 + (fr() - .5) * 2.6, 1.5, cz - sz * 3 + (fr() - .5) * 7.5, 8, 6); }
    tree(T, cx + sx * 4, cz + sz * 4, .9); bench(T, cx - sx * 6, cz - sz * 9.6, sz > 0 ? Math.PI : 0); }
  const fo = fountain(T, 0, 0); fo.scale.setScalar(.85); fo.position.y = .5;
  for (const [x, z, s] of [[-31, -31, 1], [31, -31, -1], [-31, 31, 1], [31, 31, -1]]) lamp(T, x, z, s);
  // casas: norte (la de Thomas en el centro), sur, este, oeste
  const HOUSES = [];
  const YEL = ['#f6d04a', '#ffdc5a', '#f2c23a'], RED = ['#d8402e', '#c8382a'];
  const north = [[-50, 1, 'y'], [-27, 2, 'r'], [27, 2, 'y'], [50, 1, 'r']];
  const make = (x, z, ry, fl, kind, i, w = 19) => { const roof = kind === 'y' ? (i % 2 ? ['#e0402e', '#9a2418'] : ['#d84a3a', '#8a2a1a']) : ['#f2b83a', '#a8701a'];
    const hh = kHaus(T, x, z, ry, { w, d: 16, floors: fl, wall: kind === 'y' ? YEL[i % 3] : null, brick: kind === 'r' ? RED[i % 2] : null, roof, shut: kind === 'y' ? [0x2a8a4a, 0xd8402e, 0x2a6ad8][i % 3] : 0xffffff, door: [0x2a5aa8, 0xd8402e, 0x2a8a4a][i % 3], fence: !mini && i % 2 === 0 }); HOUSES.push(hh); return hh; };
  north.forEach(([x, fl, k], i) => make(x, -60, 0 + 0, fl + 1, k, i));
  [[-48, 'r'], [-24, 'y'], [0, 'y'], [24, 'r'], [48, 'y']].forEach(([x, k], i) => make(x, 60, Math.PI, 2 + (i % 2), k, i + 4));
  [[-48, 'y'], [-24, 'r'], [0, 'y'], [24, 'y'], [48, 'r']].forEach(([z, k], i) => make(60, z, -Math.PI / 2, 2 + ((i + 1) % 2), k, i + 9));
  [[-48, 'r'], [-24, 'y'], [0, 'r'], [24, 'y'], [48, 'y']].forEach(([z, k], i) => make(-60, z, Math.PI / 2, 2 + (i % 2), k, i + 14));
  // la casa de Thomas: grande, ladrillo rojo, ventana blanca grande
  const TH = kHaus(T, 0, -62, 0, { w: 26, d: 20, floors: 3, brick: '#e0402e', roof: ['#f2b83a', '#a8701a'], shut: 0xffffff, door: 0xffffff, fence: !mini });
  // fondo: segunda fila de tejados y árboles
  const r = RNG(31); for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283, d = 100 + r() * 14; tree(T, Math.cos(a) * d, Math.sin(a) * d, 1.1 + r() * .5); }
  for (const [x, z, ry, k] of [[-30, -92, 0, 'r'], [0, -96, 0, 'y'], [30, -92, 0, 'y'], [-30, 92, Math.PI, 'y'], [30, 92, Math.PI, 'r'], [92, -26, -Math.PI / 2, 'y'], [92, 26, -Math.PI / 2, 'r'], [-92, -26, Math.PI / 2, 'y'], [-92, 26, Math.PI / 2, 'r']]) make(x, z, ry, 2, k, Math.abs(x + z) | 0, 22);
  // coches dando vueltas por el cuadro
  const CARS = mini ? [] : [0xff6aa8, 0xffd23f, 0x3ac8c8, 0xff5a3a, 0xffffff, 0x8a5ad8].map(c => toyCar(T, c));
  T.userData = { HOUSES, TH, fo, CARS, update: (Tm) => { fo.userData.update && fo.userData.update(Tm);
    CARS.forEach((c, i) => { const u = ((Tm * .028 + i / CARS.length) % 1 + 1) % 1, L = 4, q = u * L, side = Math.floor(q), f = q - side, s = 76, lane = RING + (i % 2 ? 2.6 : -2.6);
      const P = [[-lane, -lane], [lane, -lane], [lane, lane], [-lane, lane]]; const a = P[side], b = P[(side + 1) % 4]; c.position.set(a[0] + (b[0] - a[0]) * f, 0, a[1] + (b[1] - a[1]) * f); c.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]); }); } };
  shade(T); if (mini) T.traverse(m => { if (m.isMesh) m.castShadow = false; });
  return T; }

// ---------- el sótano (Keller) ----------
// sala de 60 × 44, techo a 24; mesa centrada en (0, 5.2, 0) con la maqueta encima; ventana grande al fondo (z = -22); escalera en la pared derecha.
export const TABLE_Y = 2.7, MINI_S = .038;
export function keller(scene, X, cityTemplate) { const g = G(scene, X, 0, 0);
  const fl = plane(60, 44, mat(0xffffff, { map: rep(plankTex(), 6, 4), roughness: .7 }), g, 0, 0, 0);
  const bw = mat(0xffffff, { map: rep(brickTex('#b8583e', '#e2cdb6'), 6, 3), roughness: .9 });
  box(60, 24, 1, bw, 0, g, 0, 12, 22.5); box(1, 24, 44, bw, 0, g, -30.5, 12, 0); box(1, 24, 44, bw, 0, g, 30.5, 12, 0);
  // pared del fondo con la gran ventana (hueco 30 × 13) y cielo detrás
  const bwm = bw; box(60, 6, 1, bwm, 0, g, 0, 3, -22.5); box(60, 5, 1, bwm, 0, g, 0, 21.5, -22.5); box(15, 13, 1, bwm, 0, g, -22.5, 12.5, -22.5); box(15, 13, 1, bwm, 0, g, 22.5, 12.5, -22.5);
  const frm = mat(0x8a5a30, { roughness: .6 }); box(31.6, .8, 1.6, frm, .1, g, 0, 6.2, -22); box(31.6, .8, 1.6, frm, .1, g, 0, 18.8, -22); box(.8, 13, 1.6, frm, .1, g, -15.4, 12.5, -22); box(.8, 13, 1.6, frm, .1, g, 15.4, 12.5, -22);
  const sky = plane(80, 50, new THREE.MeshBasicMaterial({ map: skyTex(), toneMapped: false }), g, 0, 18, -40, 0); sky.material.color.setScalar(1.05);
  const outG = plane(80, 30, mat(0xffffff, { map: rep(grassT(), 8, 4) }), g, 0, 6.1, -35); for (let i = 0; i < 5; i++) tree(g, -24 + i * 12, -34 - (i % 2) * 4, .8);
  // techo de madera con vigas
  const ceil = plane(60, 44, mat(0xffffff, { map: rep(plankTex('#9a6a3a', '#86582e'), 4, 3), roughness: .8 }), g, 0, 24, 0, Math.PI / 2);
  for (let i = -3; i <= 3; i++) box(1.4, 1.6, 44, mat(0x6a4224, { roughness: .8 }), .1, g, i * 8.5, 23.2, 0);
  box(60, 1.8, 1.6, mat(0x6a4224, { roughness: .8 }), .1, g, 0, 22.4, 0);
  // lámparas verdes colgantes
  const LAMPS = []; for (const lx of [0]) { cyl(.08, .08, 13, mat(0x1a1a1a), 6, g, lx, 17.5, 0); const sh = cyl(.4, 2.4, 1.7, mat(0x2e7a4a, { roughness: .35, metalness: .3, side: THREE.DoubleSide }), 24, g, lx, 11.4, 0); sh.geometry = new THREE.CylinderGeometry(.4, 2.4, 1.7, 24, 1, true);
    sphere(.55, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.0, 1.5), toneMapped: false }), g, lx, 10.8, 0, 12, 8); const pl = new THREE.PointLight(0xffe2b0, 110, 0, 1.6); pl.position.set(lx, 10, 0); g.add(pl); LAMPS.push(pl); }
  // alfombra a cuadros y mesa con la maqueta
  const rug = plane(24, 19, mat(0xffffff, { map: checkRug(), roughness: .9 }), g, 0, .05, 0);
  const wd = mat(0xffffff, { map: rep(plankTex('#b8783a', '#a86a32'), 2, 1), roughness: .6 }), wdk = mat(0x7a4a24, { roughness: .6 });
  box(11.6, .6, 10.6, wd, .12, g, 0, TABLE_Y - .3, 0); box(11.9, .3, 10.9, wdk, .08, g, 0, TABLE_Y - .7, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.6, TABLE_Y - .7, .6, wdk, .08, g, sx * 5.2, (TABLE_Y - .7) / 2, sz * 4.7);
  // la maqueta (clon de la ciudad a escala)
  const MINI = cityTemplate.clone(true); MINI.scale.setScalar(MINI_S); MINI.position.set(0, TABLE_Y + 6 * MINI_S, 0); g.add(MINI);
  // estanterías con cajas y tarros (pared izquierda)
  for (let k = 0; k < 3; k++) { box(1.6, .4, 14, wdk, .05, g, -29, 6 + k * 5, -8); for (let j = 0; j < 5; j++) { const bx = box(1.4, 2.4 + (j % 2), 2.2, mat([0xc89a5a, 0xb8884a, 0x6aa8d8, 0xd8604a, 0xe8c040][(j + k) % 5], { roughness: .9 }), .1, g, -28.6, 7.5 + k * 5, -13.5 + j * 2.8); } }
  for (const z of [-15, -1]) box(1.4, 15, .5, wdk, .05, g, -29, 7.5, z);
  // caldera blanca, cajas, cactus, bicicleta
  cyl(2.4, 2.4, 10, mat(0xf2f2f2, { roughness: .3, metalness: .3 }), 24, g, 24, 5, -18); sphere(2.4, mat(0xf2f2f2, { roughness: .3, metalness: .3 }), g, 24, 10, -18, 20, 10); cyl(.3, .3, 14, mat(0xb87a3a, { metalness: .8, roughness: .3 }), 8, g, 24, 17, -18);
  for (const [x, z, s] of [[-24, 16, 3], [-20.5, 17, 2.4], [-23, 16.5, 2.4]]) box(s, s, s, mat(0xc89a5a, { roughness: .9 }), .1, g, x, s / 2 + (x === -23 ? 3 : 0), z);
  cyl(1.2, 1.0, 1.8, mat(0xc8642e, { roughness: .8 }), 14, g, -22, .9, -17); const cac = cyl(.9, .9, 3, mat(0x3a9a4a, { roughness: .8 }), 12, g, -22, 3.2, -17); sphere(.9, mat(0x3a9a4a), g, -22, 4.7, -17, 12, 8);
  // escalera a la pared derecha: sube hacia el fondo hasta la trampilla
  const ST = G(g, 26, 0, 10); for (let k = 0; k < 12; k++) { box(6, .5, 2.2, wd, .05, ST, 0, 1.8 + k * 1.8, -k * 2); box(6, 1.8 + k * 1.8, .3, wdk, 0, ST, 0, (1.8 + k * 1.8) / 2, -k * 2 + 1.1); }
  for (let k = 0; k < 12; k++) cyl(.15, .15, 4, wdk, 6, ST, -3, 3.8 + k * 1.8, -k * 2);
  const rail = box(.4, .4, 27, wdk, .1, ST, -3, 13.6, -11); rail.rotation.x = Math.atan2(1.8, 2);
  g.userData = { MINI, LAMPS, sky, rug }; outlineSafe(g); return g; }
function outlineSafe() {}

// ---------- escalera que baja al sótano (hueco estrecho, paredes claras, puerta abajo con luz cálida) ----------
export function treppe(scene, X) { const g = G(scene, X, 0, 0); const wl = mat(0xffffff, { map: rep(plaster('#e8d2b0'), 4, 4), roughness: .85 }), wd = mat(0xffffff, { map: rep(plankTex('#c8843e', '#b0702e'), 1, 1), roughness: .6 }), wdk = mat(0x7a4a24, { roughness: .6 });
  for (let k = 0; k < 14; k++) { box(8, .6, 2.6, wd, .06, g, 0, 26 - k * 1.9, -k * 2.4); box(8, 1.9, .3, mat(0xf4f0e6), 0, g, 0, 26 - k * 1.9 + .95 + .3, -k * 2.4 + 1.2); }
  for (const s of [-1, 1]) box(1, 60, 50, wl, 0, g, s * 4.5, 14, -14);
  plane(10, 50, wl, g, 0, 40, -14, Math.PI / 2); box(10, 40, 1, wl, 0, g, 0, 20, -36);
  for (let k = 0; k < 14; k++) cyl(.12, .12, 3.4, mat(0xffffff, { roughness: .4 }), 6, g, 3.4, 26 - k * 1.9 + 1.7, -k * 2.4);
  const rail = box(.5, .5, 36, wdk, .12, g, 3.4, 12.4 + 15, -16); rail.rotation.x = Math.atan2(-1.9, -2.4) + Math.PI;
  // puerta del sótano abajo, entreabierta con luz
  box(6, 9.4, .6, mat(0x6a4224), .1, g, 0, 4.7 + 26 - 13 * 1.9 - 4, -35.4);
  const lit = plane(4.6, 8, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.8, 1.4, .8), toneMapped: false }), g, 0, 26 - 13 * 1.9 + 4.2 - 4, -35.1, 0);
  const pl = new THREE.PointLight(0xffc880, 50, 0, 1.6); pl.position.set(0, 26 - 13 * 1.9 + 3, -32); g.add(pl);
  const lamp = sphere(.8, new THREE.MeshBasicMaterial({ color: new THREE.Color(2, 1.9, 1.6), toneMapped: false }), g, 0, 36, -6, 12, 8); const pl2 = new THREE.PointLight(0xfff0d8, 45, 0, 1.6); pl2.position.set(0, 34, -6); g.add(pl2);
  // cuadro y planta en la pared
  const pic = box(.3, 4, 5, mat(0xffffff, { map: skyTex() }), .05, g, -3.95, 22, -10); box(.25, 4.6, 5.6, mat(0x6a4224), .05, g, -4.0, 22, -10);
  g.userData = { lamp: pl, lit }; return shade(g); }

// ---------- casa de muñecas (corte): planta baja + sótano bajo tierra con la mesa y otra maqueta ----------
// origen en (X, 0, 0); el corte mira a +z (z = 12). Sótano: x ∈ [-13, 13], y ∈ [-15, 0]; mesa en (0, -15 + TABLE_Y, -2).
export function puppenhaus(scene, X, cityTemplate) { const g = G(scene, X, 0, 0);
  const dirt = mat(0xffffff, { map: rep(noiseTex('#8a5a32', ['#7a4a26', '#9a6a3e', '#6a4022'], 900, 4, 1), 6, 3), roughness: 1 }), grassM = mat(0xffffff, { map: rep(grassT(), 10, 6), roughness: 1 });
  // terreno con el corte frontal (bloques alrededor del hueco del sótano)
  box(120, .8, 60, grassM, 0, g, 0, -.4, -18);
  box(46, 18, 1, dirt, 0, g, -36, -9, 12.5); box(46, 18, 1, dirt, 0, g, 36, -9, 12.5); box(26, 3, 1, dirt, 0, g, 0, -16.5, 12.5);
  for (let i = 0; i < 24; i++) { const r = RNG(i * 7 + 2), sd = i % 2 ? 1 : -1; sphere(.4 + r() * .6, mat(0x9a9088, { roughness: .9 }), g, sd * (16 + r() * 40), -2 - r() * 14, 13.05, 8, 6); }
  const topG = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), grassM); topG.rotation.x = -Math.PI / 2; topG.position.set(0, .02, -18); g.add(topG);
  // sótano
  const bw = mat(0xffffff, { map: rep(brickTex('#b8583e', '#e2cdb6'), 4, 2), roughness: .9 }); box(26, 15, 1, bw, 0, g, 0, -7.5, -14.5); box(1, 15, 27, bw, 0, g, -13.5, -7.5, -1); box(1, 15, 27, bw, 0, g, 13.5, -7.5, -1);
  plane(26, 27, mat(0xffffff, { map: rep(plankTex(), 3, 3), roughness: .7 }), g, 0, -14.98, -1); plane(16, 12, mat(0xffffff, { map: checkRug('#d8402e'), roughness: .9 }), g, 0, -14.94, -2);
  plane(26, 27, mat(0xffffff, { map: rep(plankTex('#9a6a3a', '#86582e'), 3, 3) }), g, 0, -.9, -1, Math.PI / 2);
  const wd = mat(0xffffff, { map: rep(plankTex('#b8783a', '#a86a32'), 2, 1), roughness: .6 }), wdk = mat(0x7a4a24, { roughness: .6 });
  const ty = -15 + TABLE_Y; box(9, .6, 8, wd, .12, g, 0, ty - .3, -2); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.6, TABLE_Y - .6, .6, wdk, .1, g, sx * 4, -15 + (TABLE_Y - .6) / 2, -2 + sz * 3.4);
  const MINI = cityTemplate.clone(true); MINI.scale.setScalar(.028); MINI.position.set(0, ty + 6 * .028, -2); g.add(MINI);
  cyl(.06, .06, 6, mat(0x1a1a1a), 6, g, 0, -4, -2); const sh = new THREE.Mesh(new THREE.CylinderGeometry(.4, 2.2, 1.6, 20, 1, true), mat(0x2e7a4a, { side: THREE.DoubleSide, roughness: .4 })); sh.position.set(0, -6.6, -2); g.add(sh);
  sphere(.5, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2, 1.5), toneMapped: false }), g, 0, -7.1, -2, 10, 8); const pl = new THREE.PointLight(0xffe2b0, 120, 0, 1.6); pl.position.set(0, -8, 1); g.add(pl);
  for (let k = 0; k < 7; k++) box(4, .4, 1.6, wd, .05, g, 9.5, -1 - k * 2, -12 + k * 1.8 * 0 + 0).position.set(9.5, -1.8 - k * 2, -13 + k * 2.2);   // escalera
  box(3, 9, 3, mat(0xc89a5a, { roughness: .9 }), .1, g, -10.5, -10.5, -12);
  // planta baja (casa sin pared frontal)
  const H = G(g, 0, 0, -1); const wl = mat(0xffffff, { map: rep(plaster('#f6d04a'), 3, 2), roughness: .8 }), inW = mat(0xffffff, { map: rep(plaster('#fff3d8'), 3, 2) });
  box(28, .8, 27, wd, .05, H, 0, .4, 0); box(28, 16, 1, wl, 0, H, 0, 8.6, -13.5); box(1, 16, 27, wl, 0, H, -13.5, 8.6, 0); box(1, 16, 27, wl, 0, H, 13.5, 8.6, 0);
  plane(26, 15, inW, H, 0, 8.6, -12.9, 0); 
  const rh = 11, s = new THREE.Shape(); s.moveTo(-16, 0); s.lineTo(0, rh); s.lineTo(16, 0); const rg = new THREE.ExtrudeGeometry(s, { depth: 30, bevelEnabled: false }); rg.translate(0, 0, -15);
  const roof = new THREE.Mesh(rg, [mat(0x9a2418), mat(0xffffff, { map: rep(tileRoof('#e0402e', '#9a2418'), 4, 4), roughness: .55 })]); roof.position.y = 16.6; H.add(roof); g.userData.roof = roof;
  windowAt(H, -6, 9, -12.8, 1.2, 0x2a8a4a); windowAt(H, 6, 9, -12.8, 1.2, 0x2a8a4a);
  box(10, 3, 4, mat(0x2a6ad8, { roughness: .8 }), .5, H, -5, 2.3, -10); box(10, 4, 1.4, mat(0x2a6ad8, { roughness: .8 }), .4, H, -5, 4, -11.6);   // sofá
  box(6, .4, 4, wd, .05, H, 5, 3, -6); for (const sx of [-1, 1]) box(.3, 2.4, .3, wdk, 0, H, 5 + sx * 2.6, 1.6, -6);
  cyl(.15, .15, 7, mat(0x2a2a2a), 8, H, 10, 4.3, -10); const ls = cyl(.8, 1.5, 1.6, mat(0xfff0c8, { emissive: 0xffc870, emissiveIntensity: .6 }), 16, H, 10, 8.2, -10);
  const pl2 = new THREE.PointLight(0xfff0d8, 80, 0, 1.6); pl2.position.set(0, 12, -2); H.add(pl2);
  g.userData = { ...g.userData, MINI, ty }; return shade(g); }

// Hände — escenarios: Tannengrund nevado (calle, casas con nieve, parada del bus, cartel del pueblo, iglesia con reloj),
// el bosque de pinos con EL CAMINO (cascada helada → árbol caído + tocón → arroyo con 7 piedras planas → valla del poste roto → farola del borde del pueblo),
// la Mensa, la Turnhalle, el salón (chimenea) y el bus escolar por dentro.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt } from './props.js';
import { house, glass, label } from './pech.js';
import { lantern } from './diam.js';

const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const sign = (w, h, text, bg, fg, size = 64) => label(w, h, text, bg, fg, size, .35);
export const SNOWM = mat(0xffffff, { roughness: .92, map: noiseTex('#f2f6ff', ['#e2eaf8', '#ffffff', '#d8e2f4'], 2400, 3, 40), emissive: 0x000000 });
const plankT = (a = '#a8743e', b = '#94622e') => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(a.length); for (let x = 0; x < w; x += 16) { c.fillStyle = r() > .5 ? b : a; c.fillRect(x, 0, 15, h); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x + 15, 0, 1, h); } }, true);
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };

// pino nevado (capas de conos con nieve encima)
export function pine(parent, x, z, sc = 1, seed = 1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(sc); g.rotation.y = seed; parent.add(g);
  cyl(.45, .6, 4, mat(0x5a3a22, { roughness: 1 }), 7, g, 0, 2, 0); const gm = mat([0x1f5a34, 0x24663a, 0x1a4e2e][seed % 3], { roughness: 1, flatShading: true });
  for (let k = 0; k < 4; k++) { const r = 4.2 - k * .9, h = 4.4 - k * .5, y = 4 + k * 2.6; const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), gm); c.position.y = y; g.add(c); const s = new THREE.Mesh(new THREE.ConeGeometry(r * .78, h * .42, 8), SNOWM); s.position.y = y + h * .2; g.add(s); }
  g.userData.top = 4 + 3 * 2.6 + 2; return g; }
function snowGround(g, w, d, x = 0, z = 0) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d, 40, 40), SNOWM); const pos = p.geometry.attributes.position, r = RNG(5); for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * .08) * .1 + Math.cos(pos.getY(i) * .06) * .1 + r() * .05); p.geometry.computeVertexNormals();
  p.rotation.x = -Math.PI / 2; p.position.set(x, 0, z); p.receiveShadow = true; g.add(p); return p; }
export function snowRoof(h) { const c = new THREE.Mesh(h.roof.geometry, SNOWM); c.scale.set(.57, .55, .47); c.position.y = 14.65; h.g.add(c); box(16.6, .5, 13.6, SNOWM, .2, h.g, 0, 10.45, 0); }
function drift(g, x, z, s = 1) { const d = sphere(2.2 * s, SNOWM, g, x, -.8 * s, z, 12, 8); d.scale.set(1.6, .55, 1); return d; }

// ---------- Tannengrund ----------
export function tannengrund(scene) { const G = new THREE.Group(); scene.add(G);
  snowGround(G, 900, 900, 0, -100);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 320), mat(0xffffff, { roughness: .8, map: rep(noiseTex('#5a6070', ['#4a505e', '#6a7080', '#d8e0f0'], 2600, 2, 1), 2, 30) })); road.rotation.x = -Math.PI / 2; road.position.set(0, .35, -60); G.add(road);
  for (const s of [-1, 1]) { box(4, .5, 320, mat(0xd8dce4), .05, G, s * 9, .3, -60); for (let z = 90; z > -220; z -= 7) drift(G, s * 7.6, z + (s * 3), .45); }
  const houses = []; let ci = 0; for (let z = 40; z > -200; z -= 26) for (const s of [-1, 1]) { const h = house(G, s * 25, z, ci++, s > 0 ? -Math.PI / 2 : Math.PI / 2); houses.push(h); snowRoof(h); pine(G, s * 15, z - 13, .75, ci); }
  const WIN = []; for (const h of houses) { const L = []; for (const wx of [-5, 5]) for (const wy of [3.8, 7.6]) { if (wx < 0 && wy < 5) continue; const p = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.2), new THREE.MeshBasicMaterial({ color: 0xffc870, toneMapped: false })); p.position.set(wx, wy, 6.74); p.visible = false; h.g.add(p); L.push(p); } WIN.push(L); }
  const lamps = []; for (let z = 64; z > -200; z -= 26) for (const s of [-1, 1]) { if (s < 0 && z > -30 && z < 15) continue; if (s > 0 && (z === 64 || z === -14)) continue; lamps.push(lantern(G, s * 10.6, z + (s > 0 ? 13 : 0)).userData.bulb); }
  // Haltestelle (lado izquierdo, z = 6): marquesina, poste con el cartel H y horario
  const HS = new THREE.Group(); HS.position.set(-12.5, 0, 6); G.add(HS); const met = mat(0x3a4250, { metalness: .6, roughness: .4 });
  for (const z of [-4, 4]) cyl(.15, .15, 7, met, 8, HS, -1.4, 3.5, z); box(4.2, .3, 10, mat(0x2a3240), .05, HS, -.6, 7.1, 0); box(4.2, .4, 10.4, SNOWM, .15, HS, -.6, 7.45, 0); box(.15, 5, 9.6, glass(), .03, HS, -2.6, 3.8, 0); box(1.6, .3, 6, mat(0x8a5a32), .05, HS, -1.8, 2, 0);
  cyl(.12, .12, 8, met, 8, HS, -3.5, 4, 6); const hs = textPlane(1.8, 1.8, 128, 128, (c, w, h) => { c.fillStyle = '#f2c23a'; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.fillStyle = '#1a6a3a'; c.beginPath(); c.arc(64, 64, 50, 0, 7); c.fill(); txt(c, 'H', 64, 68, 80, '#f2c23a'); }); hs.position.set(-3.5, 8.2, 6.1); HS.add(hs);
  const hsn = sign(4.6, .9, 'SCHULE · 7:15', '#f4f4f4', '#1a2a3a', 46); hsn.position.set(-3.5, 6.6, 6.12); HS.add(hsn);
  // cartel del pueblo (entrada, z = 78) y la iglesia con reloj al fondo
  const TS = new THREE.Group(); TS.position.set(8.5, 0, 78); TS.rotation.y = -.35; G.add(TS); for (const x of [-2.6, 2.6]) cyl(.12, .12, 6, met, 8, TS, x, 3, 0);
  const ts = textPlane(6.6, 2.6, 400, 158, (c, w, h) => { c.fillStyle = '#f2c23a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#111'; c.lineWidth = 8; c.strokeRect(10, 10, w - 20, h - 20); txt(c, 'Tannengrund', w / 2, h * .42, 64, '#111'); txt(c, 'Landkreis Kiefernwald', w / 2, h * .74, 28, '#111'); }); ts.position.set(0, 5.4, .1); TS.add(ts); box(6.8, .4, .3, SNOWM, .1, TS, 0, 6.8, 0);
  const CH = new THREE.Group(); CH.position.set(-6, 0, -250); G.add(CH); box(16, 18, 26, mat(0xece4d4), .1, CH, 0, 9, 0); const tw = box(8, 34, 8, mat(0xece4d4), .1, CH, 0, 17, 14); const sp = new THREE.Mesh(new THREE.ConeGeometry(6, 14, 4), mat(0x3a4a5a)); sp.position.set(0, 41, 14); sp.rotation.y = Math.PI / 4; CH.add(sp);
  const clock = new THREE.Group(); clock.position.set(0, 28, 18.1); CH.add(clock); cyl(2.6, 2.6, .3, mat(0xf8f4e8), 32, clock, 0, 0, 0).rotation.x = Math.PI / 2; for (let k = 0; k < 12; k++) { const m = box(.2, .6, .1, mat(0x1a1a1a), 0, clock, Math.sin(k * .5236) * 2.1, Math.cos(k * .5236) * 2.1, .2); m.rotation.z = -k * .5236; }
  const hh = new THREE.Group(); clock.add(hh); box(.26, 1.4, .1, mat(0x1a1a1a), 0, hh, 0, .6, .3); const mh = new THREE.Group(); clock.add(mh); box(.18, 2.0, .1, mat(0x1a1a1a), 0, mh, 0, .9, .35);
  const r = RNG(12); for (let k = 0; k < 90; k++) { const a = r() * 6.283, d = 60 + r() * 160; pine(G, Math.cos(a) * d, -60 + Math.sin(a) * d * 1.3, .9 + r() * .8, k); }
  // montañas
  for (let k = 0; k < 16; k++) { const h = 160 + r() * 120, m = new THREE.Mesh(new THREE.ConeGeometry(110 + r() * 50, h, 7), mat(k % 2 ? 0x7a8aa8 : 0x8a9ab8, { roughness: 1, flatShading: true })); m.position.set(-700 + k * 95, h / 2 - 20, -700 - r() * 200); G.add(m); const cp = new THREE.Mesh(new THREE.ConeGeometry(42, h * .34, 7), SNOWM); cp.position.set(m.position.x, h - 20 - h * .17 + 2, m.position.z); G.add(cp); }
  const flakes = []; const fm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .85 }); for (let k = 0; k < 220; k++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.1, 5, 4), fm); G.add(f); flakes.push(f); }
  shade(G); return { G, houses, WIN, lamps, HS, TS, CH, clock: { hh, mh }, flakes };
}

// ---------- el bosque y el camino ----------
// a lo largo de +z hacia el pueblo: cascada (z=-170), árbol caído + tocón (z=-70), arroyo con 7 piedras (z=-25), valla (z=+10..+40), farola del borde (z=+70) y casas (z>+85)
export function wald(scene, X) { const G = new THREE.Group(); G.position.x = X; scene.add(G);
  snowGround(G, 700, 700, 0, -60);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(5, 260), mat(0xffffff, { roughness: .95, map: rep(noiseTex('#dfe6f2', ['#c8d2e2', '#eef2fa', '#b8c4d8'], 2000, 3, 1), 1, 20) })); path.rotation.x = -Math.PI / 2; path.position.set(0, .3, -50); G.add(path);
  const r = RNG(33); const PINES = []; for (let k = 0; k < 170; k++) { const z = 110 - r() * 330, side = r() > .5 ? 1 : -1, x = side * (7 + r() * 70); if (Math.abs(x) < 15) continue; if (Math.abs(z + 25) < 9 && Math.abs(x) < 24) continue; if (z > 60 && Math.abs(x) < 30) continue; PINES.push(pine(G, x, z, .9 + r() * .9, k)); }
  // árbol caído (z=-70) cruzado sobre el camino, con ramas rotas y raíces; tocón al lado
  const FT = new THREE.Group(); FT.position.set(1, 0, -70); FT.rotation.y = .35; G.add(FT); const bark = mat(0xffffff, { roughness: 1, map: rep(noiseTex('#5a3a22', ['#4a2e18', '#6a4a2e', '#3a2414'], 900, 2, 1), 1, 4) });
  const log = cyl(1.1, 1.3, 26, bark, 12, FT, 0, 1.2, 0); log.rotation.z = Math.PI / 2; box(24, .5, 1.6, SNOWM, .25, FT, 0, 2.35, 0); for (let k = 0; k < 7; k++) { const b = cyl(.18, .28, 3, bark, 6, FT, -10 + k * 3.4, 2.2, (k % 2 ? 1 : -1) * .6); b.rotation.set((k % 2 ? 1 : -1) * .9, 0, .3); }
  const root = new THREE.Group(); root.position.set(13.5, 1.6, 0); FT.add(root); cyl(2.4, 2.4, .8, mat(0x4a2e18, { roughness: 1 }), 10, root, 0, 0, 0).rotation.z = Math.PI / 2; for (let k = 0; k < 8; k++) { const t = cyl(.15, .3, 2.6, bark, 5, root, .6, Math.sin(k) * 1.6, Math.cos(k) * 1.6); t.rotation.set(Math.cos(k) * .8, 0, Math.PI / 2 + Math.sin(k) * .6); }
  const ST = new THREE.Group(); ST.position.set(-4.5, 0, -64); G.add(ST); cyl(1.3, 1.6, 2.2, bark, 12, ST, 0, 1.1, 0); const top = cyl(1.3, 1.3, .1, mat(0xd8b080, { roughness: 1, map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#d8b080'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(120,70,30,.6)'; c.lineWidth = 2; for (let k = 4; k < 32; k += 5) { c.beginPath(); c.arc(32, 32, k, 0, 7); c.stroke(); } }) }), 16, ST, 0, 2.25, 0); cyl(1.2, 1.25, .3, SNOWM, 12, ST, 0, 2.4, 0);
  // arroyo (z=-25): agua oscura entre orillas con hielo y 7 piedras planas
  const water = new THREE.Mesh(new THREE.PlaneGeometry(260, 9), mat(0x24506a, { roughness: .08, metalness: .4, emissive: 0x0a2030, emissiveIntensity: .4 })); water.rotation.x = -Math.PI / 2; water.position.set(0, -.25, -25); G.add(water);
  for (const s of [-1, 1]) { const bank = box(260, 1.2, 1.4, SNOWM, .5, G, 0, -.2, -25 + s * 4.8); for (let k = 0; k < 18; k++) box(3 + r() * 4, .2, 1.6, mat(0xd8eef8, { roughness: .1, transparent: true, opacity: .8 }), .1, G, -60 + k * 7 + r() * 3, .02, -25 + s * 3.4); }
  const STONES = []; for (let k = 0; k < 7; k++) { const z = -29.4 + k * 1.45 + (k % 2 ? .1 : -.1), x = Math.sin(k * 1.7) * .9; const s = cyl(.85, 1.0, .5, mat(0x7a808a, { roughness: .8, flatShading: true }), 7, G, x, .05, z); s.scale.set(1, 1, .75); const sn = cyl(.6, .7, .12, SNOWM, 7, G, x, .34, z); sn.scale.set(1, 1, .75); STONES.push(new THREE.Vector3(X + x, .32, z)); }
  // valla del poste roto (z=+10..+40), a la izquierda del camino
  const FN = new THREE.Group(); FN.position.set(-3.6, 0, 0); G.add(FN); const wood = mat(0x8a6a4a, { roughness: .95 });
  for (let k = 0; k < 9; k++) { const z = 6 + k * 4.5; if (k === 4) { const p = box(.5, 2.4, .5, wood, .05, FN, 0, 1.2, z); p.rotation.set(.0, 0, .55); p.position.set(-.6, 1.0, z); const sp = box(.5, 1.3, .5, wood, .05, FN, 0, .65, z); const spl = box(.3, .7, .3, mat(0xd8b080), .02, FN, .05, 1.4, z + .05); spl.rotation.z = .4; continue; }
    box(.5, 3.6, .5, wood, .05, FN, 0, 1.8, z); box(.6, .3, .6, SNOWM, .1, FN, 0, 3.7, z); }
  for (const y of [1.3, 2.7]) { box(.22, .3, 17, wood, .02, FN, .1, y, 14.75); const b2 = box(.22, .3, 17, wood, .02, FN, .1, y, 32.75); if (y > 2) { b2.rotation.x = -.12; b2.position.y = 2.2; } }
  const FPOST = new THREE.Vector3(X - 3.6, 1.6, 24);
  // farola del borde del pueblo (z=+70) y casas iluminadas detrás
  const LAMP = lantern(G, 3.4, 70); const EDGE = []; for (const [x, z, ci] of [[-22, 100, 3], [20, 104, 6], [-2, 128, 1]]) { const h = house(G, x, z, ci, Math.PI); snowRoof(h); EDGE.push(h); }
  const EWIN = []; for (const h of EDGE) for (const wx of [-5, 5]) for (const wy of [3.8, 7.6]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.2), new THREE.MeshBasicMaterial({ color: 0xffc870, toneMapped: false })); p.position.set(wx, wy, 6.74); h.g.add(p); EWIN.push(p); }
  // cascada helada (z=-170): pared de roca con columnas de hielo y poza helada
  const WF = new THREE.Group(); WF.position.set(0, 0, -175); G.add(WF); const rock = mat(0x6a7280, { roughness: 1, flatShading: true });
  for (let k = 0; k < 9; k++) { const m = new THREE.Mesh(new THREE.DodecahedronGeometry(9 + r() * 6, 0), rock); m.position.set(-36 + k * 9, 10 + r() * 10, -6 - r() * 4); m.scale.y = 1.6; WF.add(m); }
  const ice = mat(0xbfe8ff, { roughness: .05, metalness: .1, transparent: true, opacity: .88, emissive: 0x4aa8d8, emissiveIntensity: .35 });
  for (let k = 0; k < 15; k++) { const h = 14 + r() * 14, c = cyl(.6 + r() * .9, .2 + r() * .4, h, ice, 8, WF, -8 + k * 1.15, 30 - h / 2, 2 + r() * .5); }
  box(22, 3, 4, ice, .5, WF, 0, 29, 1.5); const pool = new THREE.Mesh(new THREE.CircleGeometry(13, 24), ice); pool.rotation.x = -Math.PI / 2; pool.position.set(0, .12, 10); WF.add(pool);
  const ws = sign(5, 1.2, 'EISFALL 800 m', '#6a4a2a', '#f8f0d8', 52); ws.position.set(6, 3.2, -128); G.add(ws); cyl(.12, .12, 3, wood, 6, G, 6, 1.5, -128.2);
  const flakes = []; const fm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9 }); for (let k = 0; k < 520; k++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.09, 5, 4), fm); G.add(f); flakes.push(f); }
  shade(G); return { g: G, FT, ST, STONES, FN, FPOST, LAMP, EWIN, WF, water, PINES, flakes };
}
// ventisca: copos rápidos y casi horizontales alrededor de la cámara
export function blizzard(flakes, c, T, wind = 1, sp = 18) { flakes.forEach((f, i) => { const ph = (T * (.5 + wind * .6) + i * .0618) % 1; f.position.set(c.x - sp + ph * sp * 2 * wind + Math.sin(i * 7.1) * sp * (1 - wind * .5), c.y + 10 - ((T * 1.4 + i * .137) % 1) * 20, c.z + Math.cos(i * 3.3) * sp); f.scale.set(1 + wind * 2.5, 1, 1); }); }
export function snowFall(flakes, c, T, sp = 30) { flakes.forEach((f, i) => { const ph = (T * .12 + i * .0618) % 1; f.position.set(c.x + Math.sin(i * 7.1) * sp + Math.sin(T + i) * .6, c.y + 22 - ph * 26, c.z + Math.cos(i * 3.3) * sp); f.scale.set(1, 1, 1); }); }

// ---------- Mensa ----------
function room(scene, X, w, d, h, wallM, floorM) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorM); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(w, h, .6, wallM, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.6, h, d, wallM, 0, g, s * w / 2, h / 2, 0); box(w, h, .6, wallM, 0, g, 0, h / 2, d / 2); box(w, .6, d, mat(0xf4f2ee), 0, g, 0, h, 0); return g; }
const tiles = (a, b) => canvasTex(128, 128, (c, w, h) => { for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) { c.fillStyle = (x + y) % 2 ? a : b; c.fillRect(x * 32, y * 32, 32, 32); } c.strokeStyle = 'rgba(0,0,0,.15)'; for (let k = 0; k <= 128; k += 32) { c.beginPath(); c.moveTo(k, 0); c.lineTo(k, 128); c.moveTo(0, k); c.lineTo(128, k); c.stroke(); } }, true);
function tray(parent, x, y, z, col) { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); box(1.8, .1, 1.2, mat(col, { roughness: .4 }), .05, g, 0, 0, 0); cyl(.42, .42, .08, mat(0xffffff), 16, g, -.4, .08, 0); sphere(.22, mat(0xe8a040), g, -.45, .2, -.05, 10, 8); box(.4, .14, .3, mat(0x8a5a2a), .05, g, -.3, .16, .12);
  cyl(.16, .14, .4, mat(0xd8eef8, { transparent: true, opacity: .7, roughness: .05 }), 10, g, .5, .25, -.2); box(.3, .25, .3, mat(0xd8323a), .05, g, .55, .18, .3); return g; }
export function mensa(scene, X) { const g = room(scene, X, 64, 44, 14, mat(0xf2e8c8, { roughness: .9 }), mat(0xffffff, { map: rep(tiles('#e8e2d4', '#cfc6b4'), 10, 7), roughness: .6 }));
  box(64, 3, .4, mat(0x4a8ab8), 0, g, 0, 1.5, -21.6); const TR = [];
  for (const tz of [-10, 2]) for (const tx of [-14, 14]) { box(18, .5, 4, mat(0xd8d0c0, { roughness: .4 }), .08, g, tx, 3.0, tz); for (const s of [-1, 1]) { box(.4, 2.8, .4, mat(0x8a8a90, { metalness: .7 }), 0, g, tx + s * 8, 1.4, tz); box(18, .4, 1.4, mat(0x2a7ad8, { roughness: .5 }), .05, g, tx, 1.7, tz + s * 3.2); }
    for (let k = 0; k < 4; k++) for (const s of [-1, 1]) TR.push(tray(g, tx - 6 + k * 4, 3.3, tz + s * 1.1, [0xd8323a, 0x2a8a5a, 0xf2c23a, 0x6a4ad8][(k + (s > 0 ? 1 : 0)) % 4])); }
  for (let k = 0; k < 5; k++) { const w = box(8, 6, .2, glass(), .05, g, -26 + k * 13, 8, -21.7); }
  const sg = sign(10, 2, 'MENSA', '#d8323a', '#ffffff', 90); sg.position.set(0, 11.5, 21.6); sg.rotation.y = Math.PI; g.add(sg);
  const pl = textPlane(5, 6.4, 240, 300, (c, w, h) => { c.fillStyle = '#fff8e0'; c.fillRect(0, 0, w, h); txt(c, 'SPEISEPLAN', w / 2, 34, 30, '#d8323a'); ['Mo  Nudeln', 'Di  Suppe', 'Mi  Pizza', 'Do  Reis', 'Fr  Fisch'].forEach((s, i) => txt(c, s, w / 2, 90 + i * 42, 26, '#2a2a2a')); }); pl.position.set(31.6, 7, -6); pl.rotation.y = -Math.PI / 2; g.add(pl);
  box(20, 3.6, 3, mat(0xc8ccd4, { metalness: .6, roughness: .3 }), .1, g, 18, 1.8, 18); box(20, .2, 3.2, mat(0xe8eef4, { metalness: .8, roughness: .15 }), .05, g, 18, 3.7, 18);
  for (let k = 0; k < 4; k++) { const l = box(5, .3, 1.4, mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1.2 }), .05, g, -18 + k * 12, 13.6, 0); }
  const pt = new THREE.PointLight(0xfff4e0, 200, 60, 1.6); pt.position.set(0, 12, 0); g.add(pt); const pt2 = new THREE.PointLight(0xfff4e0, 130, 60, 1.6); pt2.position.set(-20, 12, 10); g.add(pt2);
  shade(g); return { g, TR };
}
// ---------- Turnhalle ----------
export function turnhalle(scene, X) { const g = room(scene, X, 70, 50, 22, mat(0xe8e0d0, { roughness: .9 }), mat(0xffffff, { map: rep(plankT('#d8a868', '#c8985a'), 8, 6), roughness: .5 }));
  const line = (w, d, x, z, c = 0xd8323a) => { const l = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(c)); l.rotation.x = -Math.PI / 2; l.position.set(x, .03, z); g.add(l); };
  line(.3, 48, 0, 0, 0xf2f2f2); line(64, .3, 0, 0, 0x2a6ad8); for (const z of [-22, 22]) line(64, .3, 0, z, 0x2a6ad8); const ring = new THREE.Mesh(new THREE.RingGeometry(5, 5.3, 40), mat(0xd8323a)); ring.rotation.x = -Math.PI / 2; ring.position.y = .04; g.add(ring);
  for (let k = 0; k < 10; k++) { box(.3, 14, .3, mat(0xb07a45), 0, g, -34.5, 7, -20 + k * 1.6); } for (let y = 1; y < 14; y += 1.3) box(.25, .25, 16, mat(0xc89058), 0, g, -34.3, y, -12.8);
  for (const z of [-24.5, 24.5]) { const bb = box(7, 4.4, .3, mat(0xffffff), .05, g, 0, 14, z); const hoop = new THREE.Mesh(new THREE.TorusGeometry(1.1, .1, 8, 20), mat(0xf2782a)); hoop.rotation.x = Math.PI / 2; hoop.position.set(0, 12, z - Math.sign(z) * 1.3); g.add(hoop); }
  const BALLS = []; for (let k = 0; k < 6; k++) BALLS.push(sphere(.7, mat([0xd8323a, 0xf2c23a, 0x2a8ad8][k % 3], { roughness: .5 }), g, 26 + (k % 3) * 1.6, .7, 16 + Math.floor(k / 3) * 1.6, 16, 12));
  box(12, 1.6, 2.4, mat(0x2a4a8a), .1, g, 28, .8, -18); const ban = sign(16, 2.4, 'TSV TANNENGRUND', '#1a3a6a', '#f2c23a', 70); ban.position.set(10, 17, -24.6); g.add(ban);
  for (let k = 0; k < 6; k++) { const w = box(9, 5, .2, glass(), .05, g, -27 + k * 11, 18, 24.7); }
  const pt = new THREE.PointLight(0xfff8ec, 260, 80, 1.5); pt.position.set(0, 20, 0); g.add(pt); const pt2 = new THREE.PointLight(0xfff8ec, 150, 70, 1.5); pt2.position.set(-24, 18, -10); g.add(pt2);
  shade(g); return { g, BALLS };
}
// ---------- salón con chimenea ----------
export function stube(scene, X) { const g = room(scene, X, 40, 32, 14, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#c8784a'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,230,180,.25)'; for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 6, h); }, true), 6, 2), roughness: .9 }), mat(0xffffff, { map: rep(plankT('#7a4a2a', '#6a3e22'), 6, 5), roughness: .6 }));
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(16, 11), mat(0xffffff, { map: stripes('#8a1e32', '#e8c87a', 10, false) })); rug.rotation.x = -Math.PI / 2; rug.position.set(0, .04, 2); g.add(rug);
  const FP = new THREE.Group(); FP.position.set(0, 0, -15.4); g.add(FP); const brick = mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#9a4a32'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8d8c0'; c.lineWidth = 2; for (let y = 0; y < h; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); for (let x = (y / 16) % 2 ? 0 : 16; x < w; x += 32) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 16); c.stroke(); } } }, true), 3, 3) });
  box(12, 9, 2, brick, .05, FP, 0, 4.5, 0); box(6, 4.4, 2.2, mat(0x1a1210), .05, FP, 0, 2.2, .1); box(13.4, .6, 2.8, mat(0x5a3a22), .05, FP, 0, 9.2, .3); const fire = []; for (let k = 0; k < 5; k++) fire.push(sphere(.6, mat(0xff8a2a, { emissive: 0xff6a10, emissiveIntensity: 3, transparent: true, opacity: .85 }), FP, -1.6 + k * .8, 1, 1.1, 10, 8));
  for (let k = 0; k < 3; k++) { const l = cyl(.3, .3, 3, mat(0x5a3a22), 8, FP, -.8 + k * .8, .5, 1.2); l.rotation.z = Math.PI / 2; }
  const fl = new THREE.PointLight(0xff9a40, 150, 40, 1.4); fl.position.set(0, 3, -12.6); g.add(fl);
  const ph = textPlane(3, 2.2, 150, 110, (c, w, h) => { c.fillStyle = '#d9a531'; c.fillRect(0, 0, w, h); c.fillStyle = '#9ac8e8'; c.fillRect(8, 8, w - 16, h - 16); c.fillStyle = '#6a8a4a'; c.fillRect(8, h * .6, w - 16, h * .4 - 8); for (let k = 0; k < 4; k++) { c.fillStyle = ['#4e2e1a', '#6a4228', '#553420', '#5e3a22'][k]; c.fillRect(24 + k * 28, 40 - (k === 3 ? -10 : 0), 18, 50); } }); ph.position.set(0, 10.6, -14.2); g.add(ph);
  // sillón de Opa, lámpara, estantería, ventana con nieve
  const AC = new THREE.Group(); AC.position.set(-10, 0, -4); AC.rotation.y = .7; g.add(AC); const vel = mat(0x2a5a4a, { roughness: .9 }); box(4.4, 1.8, 4, vel, .4, AC, 0, 1.8, 0); box(4.4, 4.4, 1.2, vel, .4, AC, 0, 4.2, -1.6); for (const s of [-1, 1]) box(.9, 3.2, 4, vel, .3, AC, s * 2.2, 2.6, 0);
  
  cyl(.12, .12, 9, mat(0x2a2a2a), 8, g, -15, 4.5, -10); const shadeL = cyl(1, 1.6, 1.8, mat(0xf2e0b0, { emissive: 0xffc870, emissiveIntensity: .8 }), 16, g, -15, 9.2, -10); const ll = new THREE.PointLight(0xffd8a0, 140, 30, 1.5); ll.position.set(-15, 8, -9); g.add(ll);
  const BS = new THREE.Group(); BS.position.set(15, 0, -10); BS.rotation.y = -Math.PI / 2; g.add(BS); box(10, 12, 2, mat(0x6a3e22), .05, BS, 0, 6, 0); const rr = RNG(4); for (let y = 0; y < 4; y++) for (let k = 0; k < 9; k++) box(.8, 2 + rr() * .6, 1.4, mat([0xd8323a, 0x2a6ad8, 0xf2c23a, 0x3a8a4a, 0xf4f4f4][(k + y) % 5]), .03, BS, -4 + k * 1, 2 + y * 2.8, .3);
  const win = box(8, 6, .2, mat(0x9ac8f0, { emissive: 0x4a7ab8, emissiveIntensity: .6 }), .05, g, 12, 8, -15.6); box(8.4, .4, .6, SNOWM, .1, g, 12, 5, -15.3);
  const cal = textPlane(3, 3.8, 150, 190, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 48); txt(c, 'DEZEMBER', w / 2, 26, 26, '#fff'); for (let k = 0; k < 28; k++) { const x = 18 + (k % 7) * 19, y = 70 + Math.floor(k / 7) * 28; txt(c, String(k + 1), x, y, 14, '#333'); if (k === 13) { c.strokeStyle = '#d8323a'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 10, 0, 7); c.stroke(); } } txt(c, 'Ausflug!', w / 2, h - 16, 18, '#d8323a'); }); cal.position.set(-19.6, 8, 4); cal.rotation.y = Math.PI / 2; g.add(cal);
  const sofa = new THREE.Group(); sofa.position.set(4, 0, 9); sofa.rotation.y = Math.PI; g.add(sofa); const sv = mat(0x8a6a4a, { roughness: .9 }); box(9, 1.8, 3.6, sv, .4, sofa, 0, 1.8, 0); box(9, 3.6, 1.2, sv, .4, sofa, 0, 3.6, -1.4);
  const pt = new THREE.PointLight(0xffe0b0, 200, 50, 1.6); pt.position.set(2, 12, 4); g.add(pt);
  shade(g); return { g, fire, fl, AC, cal };
}
// ---------- bus escolar por dentro ----------
export function busInnen(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g); const yel = mat(0xf2c23a, { roughness: .5 });
  const f = box(9, .3, 40, mat(0x3a3a42, { roughness: .9 }), 0, g, 0, 0, 0); box(1.6, .32, 40, mat(0x5a5a62), 0, g, 0, .02, 0);
  for (const s of [-1, 1]) { box(.4, 3, 40, yel, 0, g, s * 4.5, 1.5, 0); box(.4, 2, 40, yel, 0, g, s * 4.5, 8, 0); for (let k = 0; k < 8; k++) { const w = box(.15, 3.2, 4.2, mat(0xbfe4ff, { emissive: 0xa8d8ff, emissiveIntensity: .45, transparent: true, opacity: .9 }), .05, g, s * 4.4, 5, -16 + k * 4.8); box(.3, 3.6, .4, yel, 0, g, s * 4.4, 5, -18.6 + k * 4.8); } }
  box(9.4, .4, 40, mat(0xf2f2ee), 0, g, 0, 9.2, 0); for (let k = 0; k < 5; k++) box(1.2, .1, 3, mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), .03, g, 0, 9, -14 + k * 7);
  const SEATS = []; const sm = mat(0x2a6a9a, { roughness: .7 }); for (let k = 0; k < 8; k++) for (const s of [-1, 1]) { const sg = new THREE.Group(); sg.position.set(s * 2.6, 0, -15 + k * 4.4); g.add(sg); box(3.2, .6, 2, sm, .2, sg, 0, 1.8, 0); box(3.2, 2.6, .5, sm, .2, sg, 0, 3, -1.1); box(.3, 1.6, .3, mat(0x8a8a90, { metalness: .7 }), 0, sg, 0, .8, 0); SEATS.push(sg); }
  const pt = new THREE.PointLight(0xfff4e0, 70, 50, 1.4); pt.position.set(0, 8.6, -12); g.add(pt);
  shade(g); return { g, SEATS };
}

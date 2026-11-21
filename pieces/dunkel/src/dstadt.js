// Dunkel — la ciudad: plaza «Lichtplatz» de noche con el monstruo en el centro, 8 torres de focos en celosía (cada una con su
// generador verde «NOTSTROM»), valla «SPERRZONE», cables por el suelo, la caseta «LEITSTELLE», bloques de pisos alrededor con ventanas
// que se encienden y apagan, rascacielos con ventanas, farolas, árboles. Sets aparte: callejón con carteles «VERMISST», sala de control
// por dentro y fachada de vecinos con ventanas abiertas. Efectos: lluvia, chispas, relámpago, coches de policía con sirenas.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp } from './engine.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { noiseTex, stripes, txt, tree, bench } from './props.js';
import { beamFrom } from './dvolk.js';
export const FONT = 'Cap, sans-serif';
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const sign = (w, h, text, bg, fg, size = 64, glow = .5) => textPlane(w, h, Math.round(w * 64), Math.round(h * 64), (c, pw, ph) => { c.fillStyle = bg; c.beginPath(); c.roundRect(2, 2, pw - 4, ph - 4, Math.min(pw, ph) * .2); c.fill(); txt(c, text, pw / 2, ph / 2 + 3, size, fg); }, glow);
export const TOWER_R = 54, NT = 8;
export const towerAng = k => (k * 45 + 22.5) * Math.PI / 180;
export const towerPos = (k, r = TOWER_R) => new THREE.Vector3(Math.sin(towerAng(k)) * r, 0, Math.cos(towerAng(k)) * r);

// ---------- materiales compartidos que se encienden / apagan ----------
export const LIT = { win: [], lamp: [], sky: [] };   // ventanas de pisos, farolas, rascacielos
const winTex = (floors, cols, seed, base, frame) => { const r = RNG(seed); const lit = [];
  const draw = (c, w, h, em) => { c.fillStyle = em ? '#000' : base; c.fillRect(0, 0, w, h); if (!em) { c.fillStyle = 'rgba(0,0,0,.07)'; for (let y = 0; y < h; y += 6) c.fillRect(0, y, w, 1); c.fillStyle = frame; for (let f = 0; f < floors; f++) c.fillRect(0, f * h / floors, w, 5); }
    for (let f = 0; f < floors; f++) for (let k = 0; k < cols; k++) { const x = (k + .5) * w / cols, y = (f + .5) * h / floors, ww = w / cols * .5, hh = h / floors * .55, i = f * cols + k; if (lit[i] == null) lit[i] = r() < .62 ? (r() < .3 ? 2 : 1) : 0;
      if (em) { if (lit[i]) { c.fillStyle = lit[i] === 2 ? '#bfe0ff' : '#ffcf7a'; c.fillRect(x - ww / 2, y - hh / 2, ww, hh); } }
      else { c.fillStyle = frame; c.fillRect(x - ww / 2 - 4, y - hh / 2 - 4, ww + 8, hh + 10); c.fillStyle = '#1a2236'; c.fillRect(x - ww / 2, y - hh / 2, ww, hh); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x - 1, y - hh / 2, 2, hh); } } };
  const W_ = cols * 48, H_ = floors * 64; return [canvasTex(W_, H_, (c, w, h) => draw(c, w, h, false)), canvasTex(W_, H_, (c, w, h) => draw(c, w, h, true))]; };
export function cityLights(k) { for (const m of LIT.win) m.emissiveIntensity = .9 * k; for (const m of LIT.lamp) m.emissiveIntensity = 2.2 * k; for (const m of LIT.sky) m.emissiveIntensity = .8 * k; }

// bloque de pisos (Altbau / años 60): fachada con ventanas pintadas (y su mapa de luz), cornisa, balcones, tienda abajo con rótulo en alemán
const SHOPS = ['APOTHEKE', 'BÄCKEREI', 'KIOSK', 'IMBISS', 'FRISEUR', 'BLUMEN', 'DÖNER', 'CAFÉ', 'BÜCHER', 'SPÄTI'];
const FCOL = ['#d8c8a8', '#b8c8e0', '#e0b8a8', '#c8d8b8', '#d0c0e0', '#e8d8a0', '#a8c0c8'];
export function block(parent, x, z, rot, wid, floors, ci) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  const h = 8 + floors * 7, d = 18, [map, em] = winTex(floors, Math.max(2, Math.round(wid / 6)), ci * 31 + 7, FCOL[ci % FCOL.length], '#f0ece4');
  const m = mat(0xffffff, { map, emissive: 0xffffff, emissiveMap: em, emissiveIntensity: 1.5, roughness: .8 }); LIT.win.push(m);
  const side = mat(new THREE.Color(FCOL[ci % FCOL.length]).multiplyScalar(.8), { roughness: .9 });
  const mats = [side, side, mat(0x5a5048), side, m, side]; const b = new THREE.Mesh(new THREE.BoxGeometry(wid, h - 8, d), mats); b.position.set(0, 8 + (h - 8) / 2, 0); g.add(b);
  box(wid, 8, d, mat(0x3a3a42, { roughness: .7 }), 0, g, 0, 4, 0); box(wid + 1, .8, d + 1, mat(0xf0ece4), .1, g, 0, 8, 0); box(wid + 1.4, 1.2, d + 1.4, mat(0x8a3a30), .1, g, 0, h + .6, 0);
  const shop = new THREE.MeshStandardMaterial({ color: 0x2a3040, emissive: 0xffe0a8, emissiveIntensity: 1.2, roughness: .1 }); LIT.win.push(shop); box(wid * .6, 4.6, .2, shop, .05, g, -wid * .12, 3.4, d / 2 + .05);
  const s = sign(wid * .55, 1.6, SHOPS[ci % SHOPS.length], ['#1d2238', '#2a5a3a', '#7a1a2a'][ci % 3], '#ffd23f', 60, 1.0); s.position.set(-wid * .12, 6.7, d / 2 + .12); g.add(s); LIT.win.push(s.material);
  box(3, 5.6, .3, mat(0x4a2a1a), .05, g, wid * .32, 2.8, d / 2 + .05);
  for (let f = 1; f < floors; f += 2) { box(wid * .3, .4, 2, mat(0xe8e4dc), .05, g, wid * .2, 8 + f * 7 - 2.6, d / 2 + 1); box(wid * .3, 1.4, .12, mat(0x2a2a30, { metalness: .5 }), 0, g, wid * .2, 8 + f * 7 - 1.7, d / 2 + 1.95); }
  box(2, 5, 2, mat(0x8a4a3a), .1, g, wid * .3, h + 3, -3); return shade(g); }
export function skyscraper(parent, x, z, w, h, d, seed) { const [map, em] = winTex(Math.round(h / 4), Math.round(w / 3), seed, '#2a3450', '#3a4668');
  const m = mat(0xffffff, { map, emissive: 0xffffff, emissiveMap: em, emissiveIntensity: 1.2, roughness: .3, metalness: .3 }); LIT.sky.push(m);
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, h / 2, z); parent.add(b); box(w + 1, 1.2, d + 1, mat(0x4a5470), .1, parent, x, h, z);
  if (seed % 3 === 0) { cyl(.3, .3, 14, mat(0x6a6e78, { metalness: .7 }), 6, parent, x, h + 7, z); const l = sphere(.6, new THREE.MeshStandardMaterial({ color: 0xff3a3a, emissive: 0xff2a2a, emissiveIntensity: 3 }), parent, x, h + 14.5, z, 8, 6); LIT.lamp.push(l.material); } return m; }
// farola moderna
function streetLamp(parent, x, z, ry) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g); const k = mat(0x2a2e38, { metalness: .6, roughness: .4 });
  cyl(.22, .3, 11, k, 10, g, 0, 5.5, 0); box(.3, .3, 3, k, .05, g, 0, 11, 1.4); box(1.4, .45, 2.2, k, .1, g, 0, 10.8, 2.8);
  const b = new THREE.MeshStandardMaterial({ color: 0xfff4d8, emissive: 0xffd89a, emissiveIntensity: 3 }); LIT.lamp.push(b); box(1.1, .12, 1.8, b, .03, g, 0, 10.55, 2.8); return g; }

// ---------- torre de focos en celosía (geometría fusionada) ----------
function latticeGeo(h = 34, b0 = 5, b1 = 2.4) { const G = []; const P = (y, sx, sz) => { const b = lerp(b0, b1, y / h) / 2; return new THREE.Vector3(sx * b, y, sz * b); };
  const bar = (a, c, t = .32) => { const len = a.distanceTo(c), g = new THREE.BoxGeometry(t, len, t); const mid = a.clone().add(c).multiplyScalar(.5); const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.clone().sub(a).normalize());
    g.applyQuaternion(q); g.translate(mid.x, mid.y, mid.z); G.push(g); };
  const C = [[-1, -1], [1, -1], [1, 1], [-1, 1]]; for (const [sx, sz] of C) bar(P(0, sx, sz), P(h, sx, sz), .5);
  for (let y = 0; y < h - .1; y += 3.4) for (let i = 0; i < 4; i++) { const [ax, az] = C[i], [cx, cz] = C[(i + 1) % 4]; bar(P(y, ax, az), P(y + 3.4, cx, cz), .2); bar(P(y + 3.4, ax, az), P(y, cx, cz), .2); bar(P(y + 3.4, ax, az), P(y + 3.4, cx, cz), .22); }
  return mergeGeometries(G); }
export function floodTower(parent, k) { const g = new THREE.Group(); const p = towerPos(k); g.position.copy(p); g.rotation.y = towerAng(k) + Math.PI; parent.add(g);
  const LG = latticeGeo(); const st = new THREE.Mesh(LG, mat(0x2a2e36, { metalness: .7, roughness: .45 })); st.castShadow = true; g.add(st);
  box(5.5, .5, 5.5, mat(0x3a3e48, { metalness: .6 }), .05, g, 0, 34, 0); for (const s of [-1, 1]) box(.12, 1.2, 5.5, mat(0xe8c020), 0, g, s * 2.7, 34.8, 0);
  // escalera con aros
  for (let y = 1; y < 34; y += 1.2) box(1.2, .1, .1, mat(0x4a4e58, { metalness: .6 }), 0, g, 0, y, -2.7 + y * .036);
  // panel de focos 3×2 que mira al monstruo (el grupo ya mira al centro: +z local)
  const panel = new THREE.Group(); panel.position.set(0, 37.5, .5); panel.rotation.x = .1; g.add(panel); const pk = mat(0x1c1e24, { metalness: .5, roughness: .4 });
  box(11, 6.6, 1.2, pk, .2, panel, 0, 0, 0); box(11.4, .4, 1.6, mat(0xe8c020), .05, panel, 0, 3.5, 0);
  const lampM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6e0, emissiveIntensity: 4, toneMapped: false }); const lamps = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { const x = -3.4 + c * 3.4, y = -1.5 + r * 3; const rim = cyl(1.45, 1.45, .5, pk, 20, panel, x, y, .7); rim.rotation.x = Math.PI / 2; const l = cyl(1.2, 1.2, .2, lampM, 20, panel, x, y, .98); l.rotation.x = Math.PI / 2; lamps.push(l); }
  // haz que va al monstruo
  const bm = beamFrom(60, 6, .06); bm.position.set(0, 0, 1.2); bm.rotation.x = Math.PI / 2 - .05; panel.add(bm);
  // generador verde con rejilla, escape y cartel NOTSTROM
  const gen = new THREE.Group(); gen.position.set(4.6, 0, -1.5); g.add(gen); const gm = mat(0x2f8a4a, { roughness: .45 }); box(4.2, 3.0, 2.6, gm, .25, gen, 0, 1.6, 0);
  for (let i = 0; i < 6; i++) box(.12, 1.8, .1, mat(0x1a4a2a), 0, gen, -1.4 + i * .5, 1.7, 1.32); cyl(.2, .2, 1.6, mat(0x5a5a60, { metalness: .7 }), 8, gen, 1.4, 3.8, -.6);
  const gl = textPlane(2.6, .6, 260, 60, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); txt(c, 'NOTSTROM', w / 2, h / 2 + 2, 40, '#1a1a1a'); }, .3); gl.position.set(0, 2.85, 1.33); gen.add(gl);
  const gauge = cyl(.35, .35, .1, mat(0xf4f4f4), 16, gen, 1.4, 2.4, 1.33); gauge.rotation.x = Math.PI / 2; const hot = mat(0x3a3a3a, { emissive: 0xff3a10, emissiveIntensity: 0 }); box(4.3, .3, 2.7, hot, .05, gen, 0, .3, 0);
  // base de hormigón
  box(7, .6, 7, mat(0x9a9a9e, { roughness: .9 }), .1, g, 0, .3, 0); shade(g); bm.castShadow = false;
  return { g, panel, lamps, lampM, beam: bm, gen, hot, p, set(v) { lampM.emissiveIntensity = 4 * v; bm.visible = v > .05; bm.material.uniforms.a.value = .06 * Math.min(1, v); } }; }

// ---------- coche de policía ----------
export function polizei(parent) { const g = new THREE.Group(); parent.add(g); const wh = mat(0xf2f4f6, { roughness: .3, metalness: .3 }), bl = mat(0x1a4aa8, { roughness: .35 }), dk = mat(0x1a1e26, { roughness: .1, metalness: .6 });
  box(4.4, 1.5, 9.4, wh, .45, g, 0, 1.45, 0); box(4.46, .5, 9.46, bl, .1, g, 0, 1.55, 0); box(3.9, 1.3, 4.8, dk, .45, g, 0, 2.75, -.5); box(4.0, .2, 4.9, wh, .1, g, 0, 3.4, -.5);
  for (const s of [-1, 1]) { const t = textPlane(4, .7, 320, 56, (c, w, h) => { txt(c, 'POLIZEI', w / 2, h / 2 + 2, 46, '#1a4aa8'); }); t.position.set(s * 2.24, 2.05, 0); t.rotation.y = s * Math.PI / 2; g.add(t); }
  const ht = textPlane(3, .6, 240, 48, (c, w, h) => { txt(c, 'POLIZEI', w / 2, h / 2 + 2, 40, '#1a4aa8'); }); ht.rotation.x = -Math.PI / 2; ht.position.set(0, 2.21, 3.6); g.add(ht);
  const sirB = new THREE.MeshStandardMaterial({ color: 0x3a6aff, emissive: 0x2a5aff, emissiveIntensity: 3, toneMapped: false }), sirB2 = sirB.clone();
  box(3, .35, .8, mat(0x2a2a30), .1, g, 0, 3.6, -.6); const l1 = box(1.2, .4, .7, sirB, .15, g, -.75, 3.85, -.6), l2 = box(1.2, .4, .7, sirB2, .15, g, .75, 3.85, -.6);
  for (const z of [-3, 3]) for (const s of [-1, 1]) { const w = cyl(.85, .85, .6, mat(0x111114), 16, g, s * 2.1, .85, z); w.rotation.z = Math.PI / 2; const hub = cyl(.45, .45, .64, mat(0xc0c4cc, { metalness: .9 }), 10, g, s * 2.1, .85, z); hub.rotation.z = Math.PI / 2; }
  const head = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4d8, emissiveIntensity: 4, toneMapped: false }); const hl = [];
  for (const s of [-1, 1]) { hl.push(box(1.0, .45, .2, head, .1, g, s * 1.5, 1.7, 4.72)); sphere(.25, new THREE.MeshStandardMaterial({ color: 0xff2a2a, emissive: 0xff1a1a, emissiveIntensity: 2 }), g, s * 1.6, 1.8, -4.7, 8, 6); }
  const beams = [-1, 1].map(s => { const b = beamFrom(30, 3, .07); b.position.set(s * 1.5, 1.7, 4.8); b.rotation.x = Math.PI / 2 - .04; g.add(b); return b; });
  shade(g); g.userData = { sirB, sirB2, head, beams, set(on, T = 0) { head.emissiveIntensity = on ? 4 : 0; beams.forEach(b => b.visible = !!on); const ph = Math.floor(T * 6) % 2; sirB.emissiveIntensity = ph ? 4 : .3; sirB2.emissiveIntensity = ph ? .3 : 4; } }; return g; }

// ---------- la plaza ----------
export function lichtplatz(scene) { const G = new THREE.Group(); scene.add(G);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1800, 1800), mat(0xffffff, { roughness: .85, map: rep(noiseTex('#3a3e4a', ['#33363f', '#444854'], 2200, 2, 1), 160, 160) })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; G.add(ground);
  const tile = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#9aa0ac'; c.fillRect(0, 0, w, h); const r = RNG(3); for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) { c.fillStyle = `hsl(220,8%,${56 + r() * 10}%)`; c.fillRect(x + 1, y + 1, 30, 30); } }, true); tile.repeat.set(40, 40);
  const pm = mat(0xffffff, { roughness: .7, map: tile }); const plaza = new THREE.Mesh(new THREE.CircleGeometry(84, 64), pm); plaza.rotation.x = -Math.PI / 2; plaza.position.y = .03; plaza.receiveShadow = true; G.add(plaza);
  const ringC = new THREE.Mesh(new THREE.RingGeometry(84, 86, 64), mat(0xd8d4cc)); ringC.rotation.x = -Math.PI / 2; ringC.position.y = .05; G.add(ringC);
  // grietas bajo los pies del monstruo
  const crack = textPlane(30, 30, 512, 512, (c, w, h) => { const r = RNG(8); c.strokeStyle = 'rgba(20,18,24,.85)'; c.lineCap = 'round'; for (let k = 0; k < 16; k++) { let x = w / 2, y = h / 2, a = k / 16 * 6.283 + r() * .3; c.lineWidth = 7; c.beginPath(); c.moveTo(x, y); for (let s = 0; s < 7; s++) { a += (r() - .5) * .8; x += Math.cos(a) * 28; y += Math.sin(a) * 28; c.lineTo(x, y); c.lineWidth = 7 - s; } c.stroke(); } });
  crack.rotation.x = -Math.PI / 2; crack.position.y = .08; G.add(crack);
  // la parte de vigilancia (se esconde en el flashback de hace 3 años)
  const GUARD = new THREE.Group(); G.add(GUARD);
  const towers = Array.from({ length: NT }, (_, k) => floodTower(GUARD, k));
  // cables: anillo entre generadores + HAUPTLEITUNG desde la caseta
  const cm = mat(0x111114, { roughness: .5 }); const ring = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; ring.push(new THREE.Vector3(Math.sin(a) * 50.5, .35 + Math.sin(a * 7) * .05, Math.cos(a) * 50.5)); }
  const rc = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ring, true), 128, .35, 6, true), cm); rc.receiveShadow = true; GUARD.add(rc);
  const main = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(-28, .5, 59), V3(-26, .4, 54), V3(-23, .45, 49.5), V3(-21.5, .4, 45.7)]), 24, .55, 8), cm); GUARD.add(main);
  // cable suelto por el que tropiezo (entre la valla y la caseta)
  const loose = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(-14, .3, 44), V3(-8, .9, 42.5), V3(-3, .35, 43.5), V3(4, .7, 42), V3(10, .3, 43)]), 40, .3, 6), cm); GUARD.add(loose);
  // valla SPERRZONE (anillo r = 36) con paneles amarillo-negro
  const fT = stripes('#f2c23a', '#1a1a1a', 10); fT.rotation = .6; fT.center.set(.5, .5); const fm = mat(0xffffff, { map: fT, roughness: .6 });
  for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; if (Math.abs(((a + Math.PI) % (Math.PI * 2)) - Math.PI) < .08) continue; const f = new THREE.Group(); f.position.set(Math.sin(a) * 36, 0, Math.cos(a) * 36); f.rotation.y = a; GUARD.add(f);
    box(7.4, 1.6, .25, fm, .05, f, 0, 2.3, 0); for (const s of [-1, 1]) { box(.2, 3.2, .2, mat(0xd8d8d8, { metalness: .6 }), 0, f, s * 3.5, 1.6, 0); box(.9, .2, 1.6, mat(0x3a3a3a), .05, f, s * 3.5, .1, 0); }
    if (k % 7 === 3) { const s = sign(4, 1.4, 'SPERRZONE', '#d8202a', '#ffffff', 56, .6); s.position.set(0, 4.1, .2); f.add(s); } }
  // caseta LEITSTELLE (fuera del anillo, en +z mirando al centro) con antena, rotativo rojo, ventana con monitores y reloj digital
  const LS = new THREE.Group(); LS.position.set(-30, 0, 64); LS.rotation.y = Math.atan2(30, -64); GUARD.add(LS); const cw = mat(0xffffff, { map: rep(stripes('#e8e8ec', '#cfd0d6', 16), 2, 1), roughness: .6 });
  box(15, 7, 6.5, cw, .1, LS, 0, 3.8, 0); box(15.4, .4, 6.9, mat(0x5a6070), .05, LS, 0, 7.4, 0); box(15.4, .5, 6.9, mat(0x5a6070), .05, LS, 0, .25, 0);
  const lw = new THREE.MeshStandardMaterial({ color: 0x1a2a3a, emissive: 0x6ac8ff, emissiveIntensity: .7, roughness: .1 }); box(6, 2.6, .2, lw, .05, LS, -2.6, 4.4, 3.3);
  box(2.2, 5, .2, mat(0x3a4a6a), .05, LS, 4.8, 2.8, 3.3); for (let k = 0; k < 3; k++) box(2.6, .25, 1.0, mat(0x6a6e78, { metalness: .6 }), .02, LS, 4.8, .3 + k * .1, 3.8 + k * .9);
  const ls = sign(7, 1.3, 'LEITSTELLE', '#1d2238', '#7affd8', 60, 1.0); ls.position.set(-2.6, 6.4, 3.32); LS.add(ls);
  const clockS = screenPlane(3.2, 1.3, 320, 130, 2.2); clockS.position.set(4.8, 6.3, 3.33); LS.add(clockS);
  cyl(.12, .12, 9, mat(0xc0c4cc, { metalness: .8 }), 6, LS, -6.5, 12, -1); for (let k = 0; k < 4; k++) box(1.6 - k * .3, .1, .1, mat(0xc0c4cc), 0, LS, -6.5, 10 + k * 1.8, -1);
  const alarmM = new THREE.MeshStandardMaterial({ color: 0xff2a2a, emissive: 0xff1a1a, emissiveIntensity: .4, toneMapped: false }); cyl(.6, .6, .9, alarmM, 14, LS, 3, 8.1, 0); cyl(.7, .7, .2, mat(0x2a2a2a), 14, LS, 3, 7.6, 0);
  // caja de distribución (Hauptleitung)
  const VK = new THREE.Group(); VK.position.set(-22, 0, 58); VK.rotation.y = Math.atan2(22, -58); GUARD.add(VK); box(2.6, 4, 1.6, mat(0x8a9098, { metalness: .5, roughness: .4 }), .1, VK, 0, 2, 0); const vs = sign(2.2, .5, 'HAUPTLEITUNG', '#ffd23f', '#1a1a1a', 26, .2); vs.position.set(0, 3.2, .82); VK.add(vs);
  const zap = sign(.9, .9, '⚡', '#ffd23f', '#1a1a1a', 50, .2); zap.position.set(0, 2.2, .82); VK.add(zap); const VKhot = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, emissive: 0xff5a10, emissiveIntensity: 0 }); box(2.2, .6, .2, VKhot, .05, VK, 0, .9, .78);
  shade(GUARD);
  // bloques de pisos en cuadrado alrededor (lado ~ 120 desde el centro) y rascacielos detrás
  const blocks = []; let ci = 0;
  for (const [ax, az, rot] of [[0, -1, 0], [1, 0, -Math.PI / 2], [0, 1, Math.PI], [-1, 0, Math.PI / 2]]) for (let u = -100; u < 100;) { const wid = 22 + (ci * 7) % 12, fl = 5 + ci % 4; const c = u + wid / 2;
    const x = ax ? ax * 122 : c, z = az ? az * 122 : c; blocks.push(block(G, x, z, rot, wid, fl, ci)); u += wid + 1; ci++; }
  const r2 = RNG(17); for (let k = 0; k < 34; k++) { const a = k / 34 * Math.PI * 2 + r2() * .1, rr = 210 + r2() * 160; skyscraper(G, Math.sin(a) * rr, Math.cos(a) * rr, 18 + r2() * 20, 70 + r2() * 110, 18 + r2() * 20, k); }
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2 + .2; streetLamp(G, Math.sin(a) * 90, Math.cos(a) * 90, a + Math.PI); }
  for (const [x, z] of [[-70, -60], [72, -58], [-76, 52], [74, 60], [-40, -90], [44, 92], [-96, 10], [98, -12]]) tree(G, x, z, 1.1);
  for (const [x, z, r] of [[-60, -78, 0], [62, 80, Math.PI], [-88, -30, Math.PI / 2]]) bench(G, x, z, r);
  shade(G);
  return { G, GUARD, towers, LS, clockS, alarmM, lw, VK, VKhot, loose, crack, plaza, pm, ground, blocks }; }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
export function screenPlane(w, h, pw, ph, glow = 1.6) { const cv = document.createElement('canvas'); cv.width = pw; cv.height = ph; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: glow, roughness: .3 }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); let key = null;
  p.userData.draw = (k, fn) => { if (k === key) return; key = k; const c = cv.getContext('2d'); c.clearRect(0, 0, pw, ph); fn(c, pw, ph); t.needsUpdate = true; }; return p; }
export const drawClock = (s, red = false) => (c, w, h) => { c.fillStyle = '#05080a'; c.fillRect(0, 0, w, h); c.font = `700 ${h * .78}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = red ? '#ff3a3a' : '#3aff8a'; c.shadowBlur = 18; c.fillStyle = red ? '#ff5a4a' : '#5aff9a'; c.fillText(s, w / 2, h / 2 + 4); };

// ---------- callejón con carteles VERMISST (flashback) ----------
export function gasse(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const brick = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#4a2a24'; c.fillRect(0, 0, w, h); const r = RNG(4); for (let y = 0; y < h; y += 10) for (let x = (y / 10) % 2 ? -10 : 0; x < w; x += 20) { c.fillStyle = `hsl(10,${35 + r() * 15}%,${30 + r() * 10}%)`; c.fillRect(x + 1, y + 1, 18, 8); } }, true);
  const bm = mat(0xffffff, { map: rep(brick, 6, 6), roughness: .9 }); box(60, 40, 1, bm, 0, g, 0, 20, -8); for (const s of [-1, 1]) box(1, 40, 60, bm, 0, g, s * 14, 20, 20);
  const cob = mat(0xffffff, { map: rep(noiseTex('#3a3a44', ['#2a2a34', '#4a4a56'], 1600, 3, 1), 8, 8), roughness: .5 }); const f = new THREE.Mesh(new THREE.PlaneGeometry(30, 60), cob); f.rotation.x = -Math.PI / 2; f.position.set(0, .02, 20); f.receiveShadow = true; g.add(f);
  const NAMES = ['LENA K.', 'TOM B.', 'ERIK S.', 'MIA R.', 'JAN P.', 'OLGA W.', 'NIKO F.', 'PAUL D.', 'SARA H.']; const posters = [];
  NAMES.forEach((n, i) => { const p = textPlane(3.2, 4.2, 192, 252, (c, w, h) => { c.fillStyle = '#f6f2e6'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8202a'; c.fillRect(0, 0, w, 54); txt(c, 'VERMISST', w / 2, 29, 40, '#fff'); c.fillStyle = '#c8c0b0'; c.fillRect(46, 66, 100, 110);
    c.fillStyle = '#7a6a5a'; c.beginPath(); c.arc(96, 110, 26, 0, 7); c.fill(); c.fillRect(66, 140, 60, 36); txt(c, n, w / 2, 200, 30, '#1a1a1a'); txt(c, 'Seit 14.10.', w / 2, 232, 22, '#5a5a5a'); });
    p.position.set(-6 + (i % 3) * 4, 6 + Math.floor(i / 3) * 4.8 + (i % 2) * .3, -7.45); p.rotation.z = (RNG(i)() - .5) * .14; g.add(p); posters.push(p); });
  const lampB = new THREE.MeshStandardMaterial({ color: 0xfff4d8, emissive: 0xffc870, emissiveIntensity: 3 }); box(.3, .3, 2, mat(0x2a2a30), .05, g, 8, 16, -7); const lb = box(1.2, 1, 1.2, lampB, .1, g, 8, 15.3, -6);
  const L = new THREE.PointLight(0xffc880, 120, 50, 1.6); L.position.set(8, 14, -5); g.add(L);
  for (const [x, z] of [[10, 0], [11, 4]]) { cyl(1.1, 1, 2.6, mat(0x3a5a3a, { metalness: .4 }), 14, g, x, 1.3, z); cyl(1.2, 1.2, .2, mat(0x2a4a2a), 14, g, x, 2.7, z); }
  // bicicleta tirada
  const bike = new THREE.Group(); bike.position.set(-5, .5, 6); bike.rotation.set(0, .5, Math.PI / 2 - .05); g.add(bike); for (const z of [-1.6, 1.6]) { const w = new THREE.Mesh(new THREE.TorusGeometry(1, .1, 6, 20), mat(0x1a1a1a)); w.position.z = z; w.rotation.y = Math.PI / 2; bike.add(w); }
  box(.15, .15, 3, mat(0xd8323a, { metalness: .5 }), .05, bike, 0, .8, 0); box(.15, 1.2, .15, mat(0xd8323a), .05, bike, 0, .5, -.6);
  return shade(g), { g, L, posters }; }

// ---------- sala de control por dentro ----------
export function leitstelle(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const wall = mat(0xffffff, { map: rep(stripes('#3a4a62', '#34435a', 10), 3, 1), roughness: .8 }); box(30, .4, 24, mat(0x2a2e36), 0, g, 0, -.2, 0); box(30, 14, .4, wall, 0, g, 0, 7, -10); for (const s of [-1, 1]) box(.4, 14, 24, wall, 0, g, s * 15, 7, 2); box(30, .4, 24, mat(0x2a2e36), 0, g, 0, 14, 2);
  const desk = new THREE.Group(); desk.position.set(0, 0, -5); g.add(desk); box(16, 3.2, 4, mat(0x5a6070, { metalness: .4 }), .2, desk, 0, 1.6, 0); box(16.4, .3, 4.4, mat(0xd8dce4), .1, desk, 0, 3.3, 0);
  const mons = []; for (let k = 0; k < 3; k++) { const s = screenPlane(4.2, 2.6, 336, 208, 1.6); s.position.set(-5 + k * 5, 5.6, -6.5); s.rotation.x = -.08; g.add(s); box(4.6, 3, .3, mat(0x1a1a20), .1, g, -5 + k * 5, 5.6, -6.75); mons.push(s); }
  const wallS = screenPlane(14, 4.4, 560, 176, 1.4); wallS.position.set(0, 10.4, -9.75); g.add(wallS);
  const cal = textPlane(3.4, 4, 204, 240, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8202a'; c.fillRect(0, 0, w, 50); txt(c, 'TAG 1095', w / 2, 27, 34, '#fff'); for (let i = 0; i < 30; i++) { const x = 26 + (i % 6) * 31, y = 76 + Math.floor(i / 6) * 34; txt(c, String(i + 1), x, y, 18, '#333'); c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 10, y - 10); c.lineTo(x + 10, y + 10); c.stroke(); } });
  cal.position.set(-14.75, 7, -3); cal.rotation.y = Math.PI / 2; g.add(cal);
  const meter = screenPlane(3, 3, 240, 240, 1.4); meter.position.set(14.75, 7, -2); meter.rotation.y = -Math.PI / 2; g.add(meter);
  const alarm = new THREE.MeshStandardMaterial({ color: 0xff2a2a, emissive: 0xff1a1a, emissiveIntensity: .3, toneMapped: false }); cyl(.7, .7, 1, alarm, 14, g, 8, 13.3, -6);
  const L = new THREE.PointLight(0xdfe8ff, 110, 40, 1.4); L.position.set(0, 12, 2); g.add(L); const LA = new THREE.PointLight(0xff2a2a, 0, 40, 1.4); LA.position.set(8, 12, -4); g.add(LA);
  const mug = new THREE.Group(); mug.position.set(5, 3.45, -4); desk.parent.add(mug); cyl(.35, .32, .7, mat(0x2a6ad8), 14, mug, 0, .35, 0);
  const chair = new THREE.Group(); chair.position.set(-1, 0, -1.5); g.add(chair); box(2.4, .3, 2.4, mat(0x1a1a20), .1, chair, 0, 2.2, 0); box(2.4, 2.6, .3, mat(0x1a1a20), .1, chair, 0, 3.6, 1.1); cyl(.15, .15, 2, mat(0x5a5a60), 8, chair, 0, 1.1, 0);
  return shade(g), { g, mons, wallS, meter, alarm, L, LA }; }

// ---------- fachada de vecinos con 3 ventanas abiertas (habitaciones detrás) ----------
export function fenster(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g); const wm = mat(0xd8c8a8, { roughness: .85 }), fr = mat(0xf4f0e8);
  const holes = [[-9, 8], [0, 8], [9, 8], [-9, 18], [0, 18], [9, 18]];
  // pared hecha a trozos alrededor de los huecos (4×5)
  box(36, 5.5, 1, wm, 0, g, 0, 2.75, 0); box(36, 5.5, 1, wm, 0, g, 0, 13, 0); box(36, 6, 1, wm, 0, g, 0, 23.5, 0); for (const y of [8, 18]) for (const x of [-15.75, -4.5, 4.5, 15.75]) box(x === -15.75 || x === 15.75 ? 4.5 : 5, 5, 1, wm, 0, g, x, y, 0);
  const rooms = []; holes.forEach(([x, y], i) => { for (const [w, h, dx, dy] of [[4.6, .4, 0, 2.6], [4.6, .5, 0, -2.6], [.4, 5, -2.2, 0], [.4, 5, 2.2, 0]]) box(w, h, 1.2, fr, .05, g, x + dx, y + dy, .2);
    box(5, .4, 1.6, fr, .05, g, x, y - 2.8, .7); const r = new THREE.Group(); r.position.set(x, y - 2.5, -3.5); g.add(r); const wc = ['#e8d8b0', '#b8d8e8', '#e8c0c8', '#d0e8c0', '#e0d0f0', '#f0e0b0'][i];
    box(9, 9, .3, mat(wc), 0, r, 0, 4.5, -3); box(.3, 9, 7, mat(wc), 0, r, -4.5, 4.5, 0); box(.3, 9, 7, mat(wc), 0, r, 4.5, 4.5, 0); box(9, .3, 7, mat(0x8a6a4a), 0, r, 0, 0, 0); box(9, .3, 7, mat(0xf4f0e8), 0, r, 0, 9, 0);
    const pic = box(2, 1.4, .1, mat(['#c8a050', '#5a8ad8', '#d85a5a'][i % 3]), .02, r, -2, 6, -2.8); rooms.push(r); });
  const L = new THREE.PointLight(0xffd8a0, 0, 30, 1.6); L.position.set(0, 12, -3); g.add(L);
  return shade(g), { g, rooms, holes, L }; }

// ---------- efectos ----------
// lluvia: segmentos que caen alrededor del centro dado (inclinados por el viento)
export function lluvia(scene, n = 2600) { const r = RNG(5), base = new Float32Array(n * 3); for (let i = 0; i < n * 3; i++) base[i] = r();
  const pos = new Float32Array(n * 6), geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.LineBasicMaterial({ color: 0xbfd4ff, transparent: true, opacity: .55, fog: false, depthWrite: false }); const L = new THREE.LineSegments(geo, m); L.frustumCulled = false; scene.add(L);
  return { L, update(T, c, on = 1) { L.visible = on > 0; if (!on) return; m.opacity = .55 * on; const bx = 50, by = 40, bz = 50;
    for (let i = 0; i < n; i++) { const j = i * 3, o = i * 6; const wrap = (v, s) => ((v % s) + s) % s - s / 2; const x = c.x + wrap(base[j] * bx + T * 3, bx), z = c.z + wrap(base[j + 2] * bz, bz), y = c.y + wrap(base[j + 1] * by - T * 46, by);
      pos[o] = x; pos[o + 1] = y; pos[o + 2] = z; pos[o + 3] = x - .25; pos[o + 4] = y + 2.2; pos[o + 5] = z; } geo.attributes.position.needsUpdate = true; } }; }
// chispas: cajitas brillantes con gravedad
export function chispas(scene, n = 220, col = new THREE.Color(3, 1.6, .5)) { const g = new THREE.BoxGeometry(.14, .14, .5), m = new THREE.MeshBasicMaterial({ color: col, toneMapped: false }); const im = new THREE.InstancedMesh(g, m, n); im.frustumCulled = false; scene.add(im);
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), S = new THREE.Vector3(), up = new THREE.Vector3(0, 0, 1);
  return { im, update(c, t, sp = 9, life = 1.6) { if (t < 0 || t > life + .6) { im.count = 0; return; } im.count = n; const r = RNG(31);
    for (let i = 0; i < n; i++) { const a = r() * 6.283, el = r() * 1.4 - .3, v = sp * (.35 + r()), tt = Math.max(0, t - r() * .15), vx = Math.cos(a) * Math.cos(el) * v, vy = Math.sin(el) * v, vz = Math.sin(a) * Math.cos(el) * v;
      P.set(c.x + vx * tt, c.y + vy * tt - 9.8 * tt * tt, c.z + vz * tt); const dir = new THREE.Vector3(vx, vy - 19.6 * tt, vz).normalize(); Q.setFromUnitVectors(up, dir); const k = clamp(1 - tt / (life * (.5 + r() * .5))); S.set(k, k, k * (1 + v * .15)); M4.compose(P, Q, S); im.setMatrixAt(i, M4); }
    im.instanceMatrix.needsUpdate = true; } }; }
// rayo: plano con un zigzag brillante
export function rayo(scene) { const t = canvasTex(256, 1024, (c, w, h) => { const r = RNG(12); const path = (x, y, len, wd) => { c.lineWidth = wd; c.beginPath(); c.moveTo(x, y); for (let s = 0; s < len; s++) { x += (r() - .5) * 60; y += 40 + r() * 30; c.lineTo(x, y); if (r() < .18 && wd > 3) { c.stroke(); path(x, y, 5, wd * .5); c.beginPath(); c.moveTo(x, y); } } c.stroke(); };
    c.strokeStyle = 'rgba(200,220,255,.35)'; path(128, 0, 16, 26); c.strokeStyle = '#ffffff'; path(128, 0, 16, 8); });
  const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false, color: new THREE.Color(2.5, 2.6, 3) }); const p = new THREE.Mesh(new THREE.PlaneGeometry(60, 240), m); p.visible = false; scene.add(p); return p; }

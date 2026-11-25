// SCHLAFWANDLER — escenarios propios, muy detallados:
// Mondtal (la calle: casas alpinas de colores con puertas que se abren de golpe, ventanas con luz cálida, faroles, adoquín mojado,
// montañas y el Berg al fondo), el Stollen (boca de mina en la ladera, túnel con cuadros de madera, raíles, faroles colgados,
// montones de tierra, palas, vagonetas, túnel lateral oscuro y la campana enterrada al fondo), el cuarto de Ben, el de Lena,
// el dormitorio de matrimonio, la cocina-comedor y la consulta del médico.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, txt, tree, bench } from './props.js';
import { FONT } from './sets.js';
import { pine, mountains, alpHaus, laterne } from './nsets.js';
import { cobbleTex } from './diam.js';
import { glass } from './pech.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1.6) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const plane = (w, d, m, p, x, y, z, rx = -Math.PI / 2) => { const me = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); me.rotation.x = rx; me.position.set(x, y, z); me.receiveShadow = true; p.add(me); return me; };
const grassT = (a = '#3e7a34') => noiseTex(a, ['#356a2c', '#46883a', '#3a7030', '#4c8e40'], 5200, 2, 1);
const plankT = (a = '#a8784a', b = '#8a5a32') => canvasTex(256, 256, (c, w, h) => { const r = RNG(4); for (let y = 0; y < h; y += 32) { c.fillStyle = r() > .5 ? a : b; c.fillRect(0, y, w, 32); c.globalAlpha = .18; for (let k = 0; k < 14; k++) { c.fillStyle = r() > .5 ? '#000' : '#fff'; c.fillRect(r() * w, y + r() * 30, 30 + r() * 60, 2); } c.globalAlpha = 1; c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, y, w, 2); } }, true);
const woodT = () => canvasTex(128, 256, (c, w, h) => { c.fillStyle = '#7a4a24'; c.fillRect(0, 0, w, h); const r = RNG(11); for (let k = 0; k < 60; k++) { c.fillStyle = r() > .5 ? 'rgba(40,20,8,.35)' : 'rgba(255,220,170,.12)'; c.fillRect(r() * w, 0, 1 + r() * 3, h); } for (let k = 0; k < 5; k++) { c.fillStyle = 'rgba(30,14,4,.5)'; c.beginPath(); c.ellipse(r() * w, r() * h, 4, 9, 0, 0, 7); c.fill(); } }, true);
const dirtT = (a = '#8a5a30') => noiseTex(a, ['#7a4a26', '#9a6a3a', '#6a4020', '#a87442', '#5a3a1c'], 6000, 3, 1);
const rockT = () => noiseTex('#a06a3c', ['#8a5a30', '#b47a46', '#7a4a28', '#c48a52', '#6a4024'], 5000, 4, 1);
const wallp = (a, b, n = 32) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let x = 0; x < w; x += n) { c.globalAlpha = .5; c.fillRect(x, 0, n * .35, h); } c.globalAlpha = 1; });
const flowerWP = (a, b, d) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 64) for (let x = (y / 64) % 2 ? 32 : 0; x < w; x += 64) { c.fillStyle = b; for (let k = 0; k < 5; k++) { const a_ = k / 5 * 6.283; c.beginPath(); c.arc(x + 16 + Math.cos(a_) * 7, y + 16 + Math.sin(a_) * 7, 5, 0, 7); c.fill(); } c.fillStyle = d; c.beginPath(); c.arc(x + 16, y + 16, 4, 0, 7); c.fill(); } });
function room(parent, X, w, d, h, wall, floor, ceil = 0xf4f0e8) { const g = G(parent, X); box(w, .4, d, floor, 0, g, 0, -.2, 0); box(w, h, .4, wall, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.4, h, d, wall, 0, g, s * w / 2, h / 2, 0); box(w, .4, d, mat(ceil, { roughness: .9 }), 0, g, 0, h + .2, 0); return g; }
// edredón de patchwork
export const quiltT = (cols, seed = 3) => canvasTex(256, 256, (c, w, h) => { const r = RNG(seed); const n = 6, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = cols[Math.floor(r() * cols.length)]; c.fillRect(i * s, j * s, s, s); c.globalAlpha = .25; c.fillStyle = '#ffffff'; if (r() < .5) for (let k = 0; k < 4; k++) c.fillRect(i * s + 4, j * s + 6 + k * 10, s - 8, 3); else for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(i * s + 10 + k * 10, j * s + s / 2, 3, 0, 7); c.fill(); } c.globalAlpha = 1; c.strokeStyle = 'rgba(255,255,255,.7)'; c.setLineDash([4, 3]); c.lineWidth = 2; c.strokeRect(i * s + 2, j * s + 2, s - 4, s - 4); c.setLineDash([]); } });
// ventana con paisaje (montañas, luna o sol) dibujado
function windowView(night, w = 256, h = 200) { return canvasTex(w, h, (c) => { const g = c.createLinearGradient(0, 0, 0, h); if (night) { g.addColorStop(0, '#0a1240'); g.addColorStop(1, '#2a3a7a'); } else { g.addColorStop(0, '#4a9ae8'); g.addColorStop(1, '#bfe2ff'); } c.fillStyle = g; c.fillRect(0, 0, w, h);
  if (night) { c.fillStyle = '#ffffff'; const r = RNG(5); for (let k = 0; k < 40; k++) c.fillRect(r() * w, r() * h * .5, 1.5, 1.5); c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(w * .72, h * .22, 18, 0, 7); c.fill(); c.fillStyle = 'rgba(255,246,216,.18)'; c.beginPath(); c.arc(w * .72, h * .22, 32, 0, 7); c.fill(); }
  else { c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(w * .2, h * .2, 16, 0, 7); c.fill(); }
  for (const [x0, hh, col] of [[0, .45, night ? '#1a2450' : '#7a8cb0'], [.35, .6, night ? '#222c5c' : '#8a9cc0'], [.7, .5, night ? '#1a2450' : '#7a8cb0']]) { c.fillStyle = col; c.beginPath(); c.moveTo(x0 * w - 60, h); c.lineTo(x0 * w + 50, h * (1 - hh)); c.lineTo(x0 * w + 160, h); c.fill(); c.fillStyle = night ? '#c8d0f0' : '#ffffff'; c.beginPath(); c.moveTo(x0 * w + 50, h * (1 - hh)); c.lineTo(x0 * w + 32, h * (1 - hh) + 18); c.lineTo(x0 * w + 68, h * (1 - hh) + 18); c.fill(); }
  c.fillStyle = night ? '#0c1a1a' : '#2a6a3a'; for (let x = 0; x < w; x += 14) { c.beginPath(); c.moveTo(x, h); c.lineTo(x + 7, h - 26 - (x * 7) % 14); c.lineTo(x + 14, h); c.fill(); } }); }
function windowFrame(g, x, y, z, ry, wv, ww = 8, wh = 6.4, curtain = '#d8323a') { const f = G(g, x, y, z); f.rotation.y = ry; const p = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), new THREE.MeshBasicMaterial({ map: wv })); p.position.z = .05; f.add(p);
  const fr = mat(0xf4f0e8, { roughness: .6 }); box(ww + .8, .5, .7, fr, .05, f, 0, -wh / 2, .2); box(ww + .8, .5, .5, fr, .05, f, 0, wh / 2, .2); for (const s of [-1, 0, 1]) box(.4, wh, .5, fr, .03, f, s * ww / 2, 0, .2); box(ww, .3, .4, fr, .02, f, 0, 0, .2);
  const ct = canvasTex(64, 64, (c, w, h) => { c.fillStyle = curtain; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 8, h); c.fillRect(0, i * 16, w, 8); } });
  for (const s of [-1, 1]) { const cu = box(2.2, wh + 1.6, .3, mat(0xffffff, { map: ct, roughness: .9 }), .2, f, s * (ww / 2 + .6), -.4, .6); } cyl(.12, .12, ww + 4, mat(0x6a4224), 6, f, 0, wh / 2 + .8, .7).rotation.z = Math.PI / 2; return { f, p }; }
// reloj despertador con pantalla dibujable (hora)
export function wecker(parent) { const g = G(parent); box(2.2, 1.3, 1, mat(0x2a2a36, { roughness: .4 }), .3, g, 0, .65, 0); const cv = document.createElement('canvas'); cv.width = 160; cv.height = 80; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Mesh(new THREE.PlaneGeometry(1.8, .9), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); s.position.set(0, .68, .51); g.add(s); let key = null;
  g.userData.set = (txt_, col = '#ff4a3a') => { if (key === txt_ + col) return; key = txt_ + col; const c = cv.getContext('2d'); c.fillStyle = '#0a0a10'; c.fillRect(0, 0, 160, 80); c.fillStyle = col; c.font = `700 62px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt_, 80, 44); t.needsUpdate = true; }; g.userData.set('3:00'); return g; }
// lámpara colgante de mina (farol): luz cálida
export function minerLamp(parent, x, y, z, k = 2.2) { const g = G(parent, x, y, z); const fm = mat(0x2a2420, { metalness: .6, roughness: .5 }); cyl(.05, .05, 1.6, fm, 4, g, 0, .8, 0); const b = sphere(.55, glowM(0xffc060, k), g, 0, -.4, 0, 12, 8); b.castShadow = false; for (let i = 0; i < 4; i++) { const a = i / 4 * 6.283; box(.08, 1.4, .08, fm, 0, g, Math.cos(a) * .55, -.4, Math.sin(a) * .55); } cyl(.7, .4, .3, fm, 8, g, 0, .35, 0); cyl(.5, .5, .15, fm, 8, g, 0, -1.15, 0); return g; }

// ---------- MONDTAL: la calle (x = 0). Calle de adoquín z ∈ [60, -300] entre x = ±15; casas a x = ±24 (fachadas en x = ±15) con la puerta mirando a la calle.
// Las puertas (DOORS) giran hacia fuera (rotation.y del pivote, 0 = cerrada, ±1,7 = abierta). Las ventanas con luz (NIGHTW) se encienden de noche.
// Al fondo (z ≈ -330) el Berg con la boca de la mina. Rima de tiza en el suelo (RHYME) en (0, 30).
export function mondtal(scene) { const g = G(scene); const r = RNG(21);
  plane(2400, 2400, mat(0xffffff, { roughness: 1, map: rep(grassT(), 160, 160) }), g, 0, -.04, 0);
  const ct = cobbleTex(); ct.repeat.set(6, 72); const street = plane(30, 400, new THREE.MeshStandardMaterial({ map: ct, roughness: .38, metalness: .15, color: 0xd8d4cc }), g, 0, .02, -120);
  for (const s of [-1, 1]) { box(1.2, .5, 400, mat(0x9a948a, { roughness: .8 }), .05, g, s * 15.6, .25, -120); }
  const DOORS = [], NIGHTW = [], HOUSES = [], PORCH = [];
  for (const side of [-1, 1]) { let z = 56, ci = side > 0 ? 3 : 0;
    while (z > -290) { const wid = 15 + ((ci * 7) % 4); const zc = z - wid / 2; const floors = 2 + (ci % 2);
      const h = alpHaus(g, side * 24, zc, wid, floors, ci, side < 0 ? Math.PI / 2 : -Math.PI / 2); HOUSES.push(h);
      // puerta con bisagra (sobre la del modelo): marco cálido detrás
      const dx = -wid * .22, inner = plane(3.4, 5.2, glowM(0xffb860, .9), h, dx, 3.15, 9.33, 0); inner.visible = true;
      const pv = G(h, dx - 1.8, .5, 9.5); const dc = [0x2a6a4a, 0x8a2a2a, 0x2a4a8a, 0x6a3a8a, 0xd8a020, 0x3a8a8a][(ci * 5 + (side > 0 ? 1 : 0)) % 6];
      box(3.6, 5.2, .35, mat(dc, { roughness: .45 }), .06, pv, 1.8, 2.6, 0); for (const yy of [1.4, 3.8]) box(2.8, 1.8, .1, mat(0x000000, { transparent: true, opacity: .16 }), .02, pv, 1.8, yy, .2); sphere(.2, mat(0xd9a531, { metalness: .8, roughness: .3 }), pv, 3.1, 2.6, .3, 8, 6);
      DOORS.push({ pv, side, z: zc + side * 0 + (side < 0 ? -dx : dx), x: side * 15, h, inner });
      // farol de porche y buzón
      const lp = sphere(.5, glowM(0xffd890, 2.2), h, dx + 3, 6.4, 10.1, 10, 8); lp.castShadow = false; box(.3, .9, .3, mat(0x1a1a1e), .05, h, dx + 3, 7.2, 9.8); PORCH.push(lp);
      box(1.2, 1.6, .9, mat([0xd8202a, 0x2a5ab8, 0x2a8a4a][ci % 3], { roughness: .5 }), .2, h, dx + 6.2, 4.2, 9.9);
      for (let k = 0; k < 2; k++) { const pot = G(h, dx + (k ? 4.6 : -3.4), 0, 11.4); cyl(.8, .6, 1.4, mat(0xb85a2a, { roughness: .7 }), 10, pot, 0, .7, 0); sphere(1.1, mat(0x2f7a3a, { roughness: .9 }), pot, 0, 2.0, 0, 8, 6); for (let j = 0; j < 4; j++) sphere(.3, mat([0xe8202a, 0xffd23f, 0xff6ab0][j % 3]), pot, Math.cos(j * 1.6) * .8, 2.4, Math.sin(j * 1.6) * .8, 6, 4); }
      // ventanas con luz cálida (encima del cristal pintado)
      const nb = Math.max(1, Math.round(wid / 8)), bw = wid / nb;
      for (let f = 0; f < floors; f++) for (let i = 0; i < nb; i++) { if (r() < .35) continue; const wx = -wid / 2 + bw * (i + .5), wy = 7 + f * 8 + 4.6 - .1; const wm = plane(3.3, 4.4, new THREE.MeshStandardMaterial({ color: 0xffc070, emissive: 0xffa040, emissiveIntensity: 1.2 + r() * .8, roughness: .4 }), h, wx, wy, 9.09, 0); NIGHTW.push(wm); }
      z -= wid + .6 + (r() < .3 ? 6 : 0); ci++; }
  }
  // farolas a ambos lados
  const LAMPS = []; for (let z = 40; z > -280; z -= 34) for (const s of [-1, 1]) { const l = laterne(g, s * 13, z + (s > 0 ? 17 : 0)); LAMPS.push(l); }
  // bancos, bicis y cubos de basura
  const BINS = [];
  for (let k = 0; k < 6; k++) { const z = 30 - k * 50, s = k % 2 ? 1 : -1; bench(g, s * 12.4, z, s < 0 ? Math.PI / 2 : -Math.PI / 2); }
  for (let k = 0; k < 8; k++) { const z = 44 - k * 38 + 10, s = k % 2 ? -1 : 1, bg = G(g, s * 12.8, 0, z); const col = [0x2a4a3a, 0x3a3a42, 0x8a5a1a][k % 3]; box(2.4, 3.4, 2.4, mat(col, { roughness: .5 }), .2, bg, 0, 1.7, 0); box(2.6, .3, 2.6, mat(col), .1, bg, 0, 3.5, 0); BINS.push(bg); }
  // árboles entre casas y bosque detrás
  for (let z = 50; z > -300; z -= 22) for (const s of [-1, 1]) pine(g, s * (44 + r() * 20), z + r() * 10, 1.6 + r() * .9, r() < .5 ? 0x1f5a30 : 0x2a6a3a);
  // rima de tiza en el suelo (alemán) + rayuela
  const RHYME = textPlane(20, 12, 640, 384, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.88)'; c.textAlign = 'center'; c.font = `700 70px ${FONT}`; c.fillText('BIST DU WACH', w / 2, 86); c.fillText('UM DREI,', w / 2, 166); c.fillStyle = 'rgba(255,230,120,.92)'; c.fillText('TU ALS OB', w / 2, 256); c.fillStyle = 'rgba(255,255,255,.88)'; c.fillText('UND LAUF DABEI', w / 2, 340);
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 5; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(60 + k * 22, h - 40, 14, 0, 7); c.stroke(); } c.beginPath(); c.arc(w - 70, 50, 26, 0, 7); c.stroke(); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; c.beginPath(); c.moveTo(w - 70 + Math.cos(a) * 32, 50 + Math.sin(a) * 32); c.lineTo(w - 70 + Math.cos(a) * 44, 50 + Math.sin(a) * 44); c.stroke(); } });
  RHYME.rotation.x = -Math.PI / 2; RHYME.position.set(0, .06, 30); g.add(RHYME); RHYME.visible = false;
  // el Berg al fondo con la boca de la mina iluminada
  const berg = G(g, 0, 0, -380); const rk = mat(0x6a6a7a, { roughness: 1, flatShading: true }); for (let k = 0; k < 9; k++) { const m = new THREE.Mesh(new THREE.ConeGeometry(70 + k * 9, 150 + (k % 3) * 40, 7), rk); m.position.set(-120 + k * 30, 60, -30 - (k % 2) * 30); berg.add(m); }
  const sn = mat(0xeef2ff, { roughness: .8, flatShading: true }); for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(new THREE.ConeGeometry(30, 50, 7), sn); m.position.set(-90 + k * 60, 132 + (k % 2) * 16, -45); berg.add(m); }
  const mouth = G(berg, 0, 0, 42); box(16, 14, 2, glowM(0xff9a40, 1.1), 0, mouth, 0, 7, 0); for (const s of [-1, 1]) box(1.6, 16, 1.6, mat(0xffffff, { map: woodT(), roughness: .8 }), .1, mouth, s * 8.6, 8, 1); box(20, 1.8, 1.8, mat(0xffffff, { map: woodT() }), .1, mouth, 0, 16, 1);
  mountains(g, 0, -150, 620, 9);
  return { g: shade(g), DOORS, NIGHTW, HOUSES, LAMPS, BINS, RHYME, PORCH, street }; }

// ---------- STOLLEN (X): fuera, ladera con la boca de la mina en z = 0 (mirando +z), camino de tierra z ∈ [0, 140] con pinos y faroles;
// dentro, túnel z ∈ [0, -260], ancho x ∈ ±13, alto 18; cuadros de madera cada 10; raíles en x = ±2,2; montones de tierra a x = ±8;
// túnel lateral a la izquierda (x = -13) en z ∈ [-128, -112] hacia -x (oscuro); montón de palas en (6, -10); campana enterrada en (0, -250).
export function stollen(scene, X) { const g = G(scene, X); const r = RNG(33);
  const dirt = mat(0xffffff, { map: rep(dirtT(), 10, 60), roughness: .95 });
  plane(30, 280, dirt, g, 0, .01, -130);
  // raíles y traviesas
  const rail = mat(0x9aa0a8, { metalness: .85, roughness: .3 }); for (const s of [-1, 1]) box(.35, .35, 400, rail, .05, g, s * 2.2, .3, -60);
  const SL = new THREE.InstancedMesh(new THREE.BoxGeometry(6.6, .3, 1.1), mat(0xffffff, { map: woodT(), roughness: .9 }), 160); { const o = new THREE.Object3D(); for (let i = 0; i < 160; i++) { o.position.set(0, .15, 130 - i * 2.5); o.rotation.y = (r() - .5) * .06; o.updateMatrix(); SL.setMatrixAt(i, o.matrix); } SL.receiveShadow = true; g.add(SL); }
  // paredes y techo de roca facetada (instanciada); hueco del túnel lateral a la izquierda
  const rockM = new THREE.MeshStandardMaterial({ color: 0xffffff, map: rep(rockT(), 2, 2), roughness: .92, flatShading: true });
  const RG = new THREE.IcosahedronGeometry(1, 0); const NR = 900; const RI = new THREE.InstancedMesh(RG, rockM, NR); { const o = new THREE.Object3D(); let n = 0;
    for (let z = -1.5; z > -262 && n < NR - 6; z -= 3.2) { for (const s of [-1, 1]) { if (s < 0 && z < -110 && z > -130) continue; for (let y = 0; y < 22 && n < NR - 6; y += 4.4) { const sc = 2.6 + r() * 1.6; o.position.set(s * (14.5 + r() * 1.4) - s * Math.max(0, y - 14) * .25, y + r() * 1.2, z + r() * 1.5); o.rotation.set(r() * 3, r() * 3, r() * 3); o.scale.set(sc, sc * (.8 + r() * .5), sc); o.updateMatrix(); RI.setMatrixAt(n++, o.matrix); } }
      for (let x = -11; x <= 11 && n < NR - 6; x += 5.5) { const sc = 3 + r() * 1.4; o.position.set(x + r(), 20.5 + r() * 1.2, z + r()); o.rotation.set(r() * 3, r() * 3, r() * 3); o.scale.set(sc, sc * .7, sc); o.updateMatrix(); RI.setMatrixAt(n++, o.matrix); } }
    RI.count = n; RI.castShadow = true; RI.receiveShadow = true; g.add(RI); }
  box(40, 34, 3, mat(0xffffff, { map: rep(rockT(), 6, 5), roughness: 1 }), 0, g, 0, 12, -258); minerLamp(g, -6, 16, -254, 2); minerLamp(g, 6, 16, -254, 2);
  // cuadros de madera (postes, viga, tornapuntas) y faroles colgados
  const wd = mat(0xffffff, { map: woodT(), roughness: .85 }); const LAMPS = [];
  for (let z = -4; z > -258; z -= 10) { for (const s of [-1, 1]) { if (s < 0 && z < -108 && z > -132) continue; box(1.4, 18, 1.4, wd, .12, g, s * 11.2, 9, z); const br = box(.8, 5, .8, wd, .08, g, s * 9.6, 15.6, z); br.rotation.z = s * .7; } box(25, 1.5, 1.7, wd, .12, g, 0, 18, z); box(25, .6, 1.2, wd, .05, g, 0, 18.9, z - 5);
    if (((-z - 4) / 10) % 2 === 0) LAMPS.push(minerLamp(g, (((-z - 4) / 20) % 2 ? 4 : -4), 17.2, z, 2.4)); }
  // montones de tierra a los lados
  const PILES = []; const pileM = mat(0xffffff, { map: rep(dirtT('#7a4a24'), 3, 3), roughness: 1, flatShading: true });
  for (let z = -16; z > -250; z -= 9) for (const s of [-1, 1]) { if (r() < .25) continue; if (s < 0 && z < -106 && z > -134) continue; const hh = 3 + r() * 3.6; const p = new THREE.Mesh(new THREE.ConeGeometry(2.6 + r() * 1.4, hh, 8, 2), pileM); p.position.set(s * (7.6 + r() * 1.4), hh / 2 - .1, z + r() * 3); p.rotation.y = r() * 3; p.castShadow = p.receiveShadow = true; g.add(p); PILES.push(p); }
  // túnel lateral (oscuro)
  const side = G(g, -13, 0, -120); { const dk = mat(0x1a120a, { roughness: 1 }); box(60, .3, 14, mat(0xffffff, { map: rep(dirtT('#4a3018'), 4, 2), roughness: 1 }), 0, side, -30, 0, 0); for (const s of [-1, 1]) box(60, 16, 1, dk, 0, side, -30, 8, s * 7); box(60, 1, 16, dk, 0, side, -30, 16, 0); box(1, 16, 16, mat(0x050302), 0, side, -58, 8, 0);
    for (const s of [-1, 1]) box(1.4, 16, 1.4, wd, .1, side, -1, 8, s * 7.4); box(1.6, 1.6, 17, wd, .1, side, -1, 16, 0); for (let k = 1; k < 5; k++) { box(1.2, 15, 1.2, mat(0x3a2414), .1, side, -k * 10, 7.5, -6.4); box(1.2, 15, 1.2, mat(0x3a2414), .1, side, -k * 10, 7.5, 6.4); } }
  // montón de palas a la entrada y palas sueltas
  const SHOV = G(g, 7, 0, -10); const handleM = mat(0x9a6a3a, { roughness: .7 }), bladeM = mat(0xb8bcc4, { metalness: .85, roughness: .35 });
  for (let k = 0; k < 22; k++) { const s = G(SHOV, (r() - .5) * 4, .4 + r() * 1.2, (r() - .5) * 4); s.rotation.set((r() - .5) * 1.4, r() * 6, Math.PI / 2 + (r() - .5) * .8); cyl(.12, .12, 5, handleM, 6, s, 0, 2.5, 0); box(1.4, 1.8, .14, bladeM, .1, s, 0, -.6, 0); box(.9, .2, .2, handleM, .05, s, 0, 5, 0); }
  for (let k = 0; k < 10; k++) { const s = G(g, (k % 2 ? 10.2 : -10.2), 0, -20 - k * 22); s.rotation.set(0, 0, (k % 2 ? .25 : -.25)); cyl(.12, .12, 5, handleM, 6, s, 0, 3.6, 0); box(1.4, 1.8, .14, bladeM, .1, s, 0, .9, 0); }
  // vagonetas y cubos
  for (const z of [-60, -170]) { const v = G(g, 0, 0, z); box(5.4, 3, 7, mat(0x5a5e66, { metalness: .6, roughness: .5 }), .2, v, 0, 2.6, 0); box(5, 1.4, 6.6, mat(0xffffff, { map: rep(dirtT('#6a4020'), 1, 1), roughness: 1 }), .1, v, 0, 3.8, 0); for (const s of [-1, 1]) for (const zz of [-2.4, 2.4]) { const wh = cyl(.8, .8, .4, mat(0x2a2a2e, { metalness: .7 }), 12, v, s * 2.2, .8, zz); wh.rotation.z = Math.PI / 2; } }
  // campana enterrada al fondo (solo asoma el borde)
  const BELL = G(g, 0, 0, -246); { const bm = mat(0xc89a3a, { metalness: .9, roughness: .28, emissive: 0x3a2400, emissiveIntensity: .3 }); const pr = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pr.push(new THREE.Vector2(2 + 3.4 * Math.pow(t, 1.6), 8 - t * 8)); } bm.side = THREE.DoubleSide; const b = new THREE.Mesh(new THREE.LatheGeometry(pr, 28), bm); cyl(2, 2, .3, bm, 24, BELL, 0, 2.8, 0); const cr = new THREE.Mesh(new THREE.TorusGeometry(.9, .32, 8, 20), bm); cr.position.y = 3.6; BELL.add(cr); b.position.y = -5.2; BELL.add(b); const t_ = new THREE.Mesh(new THREE.TorusGeometry(5.5, .45, 8, 30), bm); t_.rotation.x = Math.PI / 2; t_.position.y = -5.0; BELL.add(t_); BELL.rotation.z = .25; }
  const bellPile = new THREE.Mesh(new THREE.ConeGeometry(9, 6, 10, 2), pileM); bellPile.position.set(0, 1.5, -252); g.add(bellPile);
  // FUERA: ladera, boca de la mina, camino y pinos
  const out = G(g); plane(600, 400, mat(0xffffff, { map: rep(grassT('#2e5a2a'), 40, 30), roughness: 1 }), out, 0, -.03, 200);
  plane(24, 150, mat(0xffffff, { map: rep(dirtT('#7a5a3a'), 3, 18), roughness: 1 }), out, 0, .02, 75);
  const greyT = () => noiseTex('#8a90a0', ['#7a8090', '#9aa0b0', '#6a7080', '#a8aebc'], 5000, 4, 1);
  const cliffM = new THREE.MeshStandardMaterial({ color: 0xb8c0d8, map: rep(greyT(), 30, 14), roughness: 1, flatShading: true });
  box(200, 170, 24, cliffM, 0, out, -116, 85, -14); box(200, 170, 24, cliffM, 0, out, 116, 85, -14); box(36, 140, 24, cliffM, 0, out, 0, 100, -14);
  const rk = new THREE.MeshStandardMaterial({ color: 0xc8c8d8, map: rep(greyT(), 2, 2), roughness: 1, flatShading: true });
  for (let k = 0; k < 34; k++) { const sd = k % 2 ? 1 : -1, sc = 4 + r() * 7; const m = new THREE.Mesh(new THREE.DodecahedronGeometry(sc, 0), rk); m.position.set(sd * (17 + r() * 70), r() * 5 + (k > 20 ? 20 + r() * 40 : 0), 1 + r() * 6 - (k > 20 ? 4 : 0)); m.rotation.set(r() * 3, r() * 3, r() * 3); m.castShadow = m.receiveShadow = true; out.add(m); }
  const pk = new THREE.MeshStandardMaterial({ color: 0x6a6a7a, roughness: 1, flatShading: true }), sn2 = mat(0xeef2ff, { roughness: .8, flatShading: true }); for (let k = 0; k < 7; k++) { const h_ = 180 + r() * 80; const m = new THREE.Mesh(new THREE.ConeGeometry(70 + r() * 30, h_, 7), pk); m.position.set(-150 + k * 50, h_ / 2 + 60, -60 - r() * 40); out.add(m); const c = new THREE.Mesh(new THREE.ConeGeometry(22, 50, 7), sn2); c.position.set(m.position.x, h_ + 60 - 22, m.position.z); out.add(c); }
  for (const s of [-1, 1]) box(2.2, 22, 2.2, wd, .15, out, s * 12, 11, 1.2); box(30, 2.4, 2.6, wd, .15, out, 0, 22.4, 1.2); box(26, 1.2, 1.4, wd, .1, out, 0, 20.6, 2.6);
  const nm = textPlane(12, 3, 480, 120, (c, w, h) => { c.fillStyle = '#3a2414'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8a050'; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'MONDSTOLLEN', w / 2, h / 2 + 4, 66, '#f4d8a0'); }); nm.position.set(0, 25.4, 2.6); out.add(nm);
  const OUTL = []; for (const s of [-1, 1]) { const l = minerLamp(out, s * 9, 19.4, 3.6, 2.8); OUTL.push(l); }
  for (let z = 14; z < 150; z += 16) for (const s of [-1, 1]) { const p = G(out, s * 13, 0, z); cyl(.3, .3, 9, mat(0x3a2414), 6, p, 0, 4.5, 0); minerLamp(p, 0, 9.4, 0, 2); }
  for (let k = 0; k < 40; k++) pine(out, (k % 2 ? 1 : -1) * (24 + r() * 80), 10 + r() * 180, 1.8 + r() * 1.4, r() < .5 ? 0x1f4a2a : 0x2a5a32);
  const town = G(out, 0, -10, 320); for (let k = 0; k < 7; k++) alpHaus(town, -90 + k * 30, 0, 16, 2, k + 2, Math.PI);
  return { g: shade(g), LAMPS, OUTL, SHOV, BELL, PILES, out, side }; }

// ---------- cuarto (X): niño (Ben) o adolescente (Lena). Cama contra la pared izquierda (x = -9), cabecero en z = -9; ventana en la pared
// del fondo (x = 4, z = -12); puerta en la pared derecha (x = 15, z = 2) que da a un pasillo (x ∈ [15, 30]); mesilla con el despertador.
export function kinderzimmer(scene, X, o = {}) { const lena = !!o.lena; const W_ = 30, D = 24, Hh = 16;
  const wall = mat(0xffffff, { map: rep(lena ? flowerWP('#c8b4e0', '#e8d8f4', '#ffd23f') : flowerWP('#f6d890', '#f8e4b0', '#e86a2a'), 5, 3), roughness: .9 });
  const g = room(scene, X, W_, D, Hh, wall, mat(0xffffff, { map: rep(plankT('#b07a48', '#9a6a3a'), 4, 4), roughness: .7 }));
  // pared derecha con hueco de puerta: la tapamos con dos paños y dejamos el hueco en z ∈ [-1, 5]
  g.children.filter(m => Math.abs(m.position.x - W_ / 2) < .3).forEach(m => m.visible = false);
  box(.4, Hh, 13, wall, 0, g, W_ / 2, Hh / 2, -6.5 - 1); box(.4, Hh, 7, wall, 0, g, W_ / 2, Hh / 2, 8.5); box(.4, Hh - 10, 6, wall, 0, g, W_ / 2, 10 + (Hh - 10) / 2, 2);
  const fr = mat(0xf4f0e8, { roughness: .6 }); for (const s of [-1, 1]) box(.8, 10, .6, fr, .05, g, W_ / 2 - .3, 5, 2 + s * 3.1); box(.8, .6, 6.8, fr, .05, g, W_ / 2 - .3, 10.1, 2);
  const DOOR = G(g, W_ / 2 - .2, 0, -1); box(.3, 9.8, 6, mat(lena ? 0xf4f0f8 : 0xffffff, { roughness: .5 }), .05, DOOR, -.1, 4.9, 3); sphere(.22, mat(0xd9a531, { metalness: .8 }), DOOR, -.5, 4.8, 5.4, 8, 6);
  // pasillo detrás de la puerta
  const hall = G(g, W_ / 2, 0, 0); box(20, .3, 30, mat(0xffffff, { map: rep(plankT('#8a5a32', '#7a4a28'), 2, 4) }), 0, hall, 10, -.1, 0); box(.4, Hh, 30, mat(0xffffff, { map: rep(wallp('#b8c8a0', '#a8b890'), 3, 2), roughness: .9 }), 0, hall, 14, Hh / 2, 0);
  const pic = textPlane(4, 3, 120, 90, (c, w, h) => { c.fillStyle = '#5a3a1a'; c.fillRect(0, 0, w, h); c.fillStyle = '#9ad0ff'; c.fillRect(8, 8, w - 16, h - 16); c.fillStyle = '#4a7a4a'; c.beginPath(); c.moveTo(8, h - 8); c.lineTo(50, 30); c.lineTo(w - 8, h - 8); c.fill(); }); pic.position.set(13.7, 8, 6); pic.rotation.y = -Math.PI / 2; hall.add(pic);
  const hl = sphere(.6, glowM(0xffd890, 1.6), hall, 7, Hh - .8, 2, 10, 8); hl.castShadow = false;
  // cama con edredón de patchwork
  const bed = G(g, -9, 0, -2); box(8.4, 2.2, 15, mat(lena ? 0x5a3a5a : 0x7a4a24, { roughness: .6 }), .15, bed, 0, 1.1, 0); box(8.6, 6.4, .8, mat(lena ? 0x5a3a5a : 0x7a4a24), .2, bed, 0, 3.2, -7.4);
  for (let k = 0; k < 6; k++) cyl(.18, .18, 3, mat(lena ? 0x7a5a7a : 0x9a6a3a), 6, bed, -3.2 + k * 1.3, 5, -7.1);
  box(8, 1.4, 14.4, mat(0xf4f4f8, { roughness: .9 }), .4, bed, 0, 2.9, .1); box(5.4, .6, 2.6, mat(0xffffff, { roughness: .9 }), .28, bed, 0, 3.85, -5.6);
  const QT = quiltT(lena ? ['#8a5ab8', '#c86aa8', '#5a4a9a', '#e8a0c8', '#3a3a7a', '#b8a0e0'] : ['#e8742a', '#2a7ac8', '#e8c840', '#c83a3a', '#4aa86a', '#f4e8d0'], lena ? 7 : 3);
  const quilt = box(8.6, .8, 9.6, mat(0xffffff, { map: QT, roughness: .95 }), .35, bed, 0, 3.9, 2.6); quilt.rotation.x = .02;
  // mesilla y despertador
  const ns = G(g, -3.4, 0, -8.6); box(3.4, 3.4, 3, mat(lena ? 0xe8d8f0 : 0xd8b88a, { roughness: .6 }), .15, ns, 0, 1.7, 0); const CLOCK = wecker(ns); CLOCK.position.set(-.4, 3.4, .3); CLOCK.scale.setScalar(.9);
  const lamp = G(ns, 1, 3.4, -.4); cyl(.4, .5, .3, mat(0x2a2a2e), 10, lamp, 0, .15, 0); cyl(.06, .06, 1.8, mat(0x2a2a2e), 6, lamp, 0, 1, 0); const shd = cyl(.5, .9, 1, mat(0xffe08a, { emissive: 0xffc860, emissiveIntensity: .6 }), 12, lamp, 0, 2.2, 0);
  // ventana del fondo con vista
  const WN = windowFrame(g, 4, 9, -11.75, 0, windowView(true), 8, 6.4, lena ? '#8a5ab8' : '#2a7ac8'); const WD = windowView(false); WN.night = WN.p.material.map; WN.day = WD;
  // estantería, alfombra, póster, juguetes / espejo, guantes
  const rug = plane(10, 7, mat(0xffffff, { map: canvasTex(128, 96, (c, w, h) => { const cols = lena ? ['#6a3a8a', '#e8a0c8', '#f4e8f8'] : ['#d84a2a', '#f4c040', '#2a6ad8']; for (let i = 0; i < 6; i++) { c.fillStyle = cols[i % 3]; c.beginPath(); c.ellipse(w / 2, h / 2, w / 2 - i * 9, h / 2 - i * 7, 0, 0, 7); c.fill(); } }), roughness: 1 }), g, 3, .03, 4);
  const SH = G(g, 10, 0, -10); box(7, 9, 2.4, mat(0xd8b88a), .1, SH, 0, 4.5, 0); for (let k = 0; k < 3; k++) box(6.6, .3, 2.2, mat(0xc8a87a), .02, SH, 0, 1.4 + k * 2.8, .1);
  for (let k = 0; k < 7; k++) box(.6 + (k % 3) * .2, 1.8 + (k % 2) * .5, 1.4, mat([0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0xff8ad0][k % 5], { roughness: .6 }), .05, SH, -2.6 + k * .8, 2.6 + (k % 2) * .25, .2);
  const po = textPlane(5, 6.4, 150, 192, (c, w, h) => { if (lena) { c.fillStyle = '#1a1a2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#e86ab0'; c.font = `700 26px ${FONT}`; c.textAlign = 'center'; c.fillText('NACHTFALTER', w / 2, 34); c.fillStyle = '#f4e8f8'; c.beginPath(); c.arc(w / 2, 104, 44, 0, 7); c.fill(); c.fillStyle = '#1a1a2a'; c.beginPath(); c.arc(w / 2 + 14, 96, 40, 0, 7); c.fill(); c.fillStyle = '#e86ab0'; c.fillText('TOUR 2026', w / 2, 178); }
    else { c.fillStyle = '#12204a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; for (let k = 0; k < 30; k++) c.fillRect((k * 37) % w, (k * 53) % h, 2, 2); c.fillStyle = '#e8e8f0'; c.beginPath(); c.moveTo(w / 2, 30); c.lineTo(w / 2 + 22, 120); c.lineTo(w / 2 - 22, 120); c.fill(); c.fillStyle = '#d8323a'; c.beginPath(); c.moveTo(w / 2 - 22, 120); c.lineTo(w / 2 - 40, 150); c.lineTo(w / 2 + 40, 150); c.lineTo(w / 2 + 22, 120); c.fill(); c.fillStyle = '#ffb21a'; c.beginPath(); c.moveTo(w / 2 - 14, 150); c.lineTo(w / 2, 182); c.lineTo(w / 2 + 14, 150); c.fill(); } });
  po.position.set(-14.75, 10, 4); po.rotation.y = Math.PI / 2; g.add(po);
  let GLOVES = null, MIRROR = null;
  if (lena) { const ch = G(g, 6, 0, 6); box(4, .4, 4, mat(0x2a2a30), .1, ch, 0, 3.6, 0); for (const s of [-1, 1]) for (const t of [-1, 1]) cyl(.15, .15, 3.6, mat(0x2a2a30), 6, ch, s * 1.6, 1.8, t * 1.6); box(4, 4, .4, mat(0x2a2a30), .1, ch, 0, 5.8, -1.8);
    GLOVES = G(ch, 0, 3.9, 0); for (const s of [-1, 1]) { const gl = G(GLOVES, s * .9, 0, 0); box(1.1, .4, 1.6, mat(0x2a5a3a, { roughness: 1 }), .15, gl, 0, 0, 0); for (let f = 0; f < 4; f++) box(.24, .3, .8, mat(0x2a5a3a, { roughness: 1 }), .08, gl, -.4 + f * .26, 0, -1.1); } }
  else { const tb = G(g, 9, 0, 6); box(5, 3, 3.4, mat(0x3a8ad8, { roughness: .6 }), .3, tb, 0, 1.5, 0); const tr = G(tb, 0, 3, 0); box(1.4, 1.4, 1.4, mat(0xd84a2a), .2, tr, -1.2, .7, 0); sphere(.9, mat(0xffd23f), tr, 1, .9, 0, 12, 8); const car = box(2.4, .9, 1.2, mat(0x2ab86a), .2, tr, .3, .45, .9); }
  const FANTA = G(ns, -1.1, 3.4, .5);
  return { g: shade(g), bed, quilt, DOOR, CLOCK, WN, hall, GLOVES, FANTA }; }

// ---------- dormitorio de matrimonio (X): cama doble (x = 0, cabecero z = -9), ventana a la izquierda, armario, mesillas con lámpara ----------
export function schlafzimmer(scene, X, o = {}) { const g = room(scene, X, 32, 26, 16, mat(0xffffff, { map: rep(wallp(o.wall || '#cfe0f0', o.wall2 || '#bfd2e6'), 5, 2), roughness: .9 }), mat(0xffffff, { map: rep(plankT('#c8925a', '#b07a44'), 4, 4), roughness: .7 }));
  const bed = G(g, 0, 0, -1); box(14.4, 2.2, 15, mat(0x6a4224), .15, bed, 0, 1.1, 0); box(14.8, 7.4, 1, mat(0x6a4224), .25, bed, 0, 3.7, -7.4); box(14, 1.4, 14.4, mat(0xf4f4f8), .4, bed, 0, 2.9, .1);
  for (const s of [-1, 1]) box(5.4, .6, 2.6, mat(0xffffff), .28, bed, s * 3.4, 3.85, -5.6);
  const quilt = box(14.6, .8, 9.6, mat(0xffffff, { map: quiltT(o.quilt || ['#2a8a7a', '#e8c840', '#d86a8a', '#4a6ac8', '#f4e8d0', '#e8742a'], 9), roughness: .95 }), .35, bed, 0, 3.9, 2.6);
  for (const s of [-1, 1]) { const ns = G(g, s * 10, 0, -8.4); box(3.6, 3.4, 3, mat(0xd8b88a), .15, ns, 0, 1.7, 0); const l = G(ns, 0, 3.4, 0); cyl(.4, .5, .3, mat(0xd8a020, { metalness: .7 }), 10, l, 0, .15, 0); cyl(.06, .06, 1.8, mat(0xd8a020, { metalness: .7 }), 6, l, 0, 1, 0); cyl(.6, 1, 1.2, mat(0xfff0c8, { emissive: 0xffc860, emissiveIntensity: .5 }), 12, l, 0, 2.3, 0); }
  const W = windowFrame(g, -15.75, 9, 2, Math.PI / 2, windowView(true), 8, 6.4, o.curtain || '#2a8a7a');
  const wr = G(g, 11, 0, 6); box(7, 13, 4, mat(0xc8a070, { roughness: .6 }), .2, wr, 0, 6.5, 0); box(.1, 12, .2, mat(0x6a4224), 0, wr, 0, 6.5, 2.05); for (const s of [-1, 1]) sphere(.2, mat(0xd9a531, { metalness: .8 }), wr, s * .6, 6.5, 2.1, 8, 6);
  const pic = textPlane(7, 5, 210, 150, (c, w, h) => { c.fillStyle = '#d8b050'; c.fillRect(0, 0, w, h); c.fillStyle = '#7ab8e8'; c.fillRect(10, 10, w - 20, h - 20); c.fillStyle = '#3a7a3a'; c.fillRect(10, h * .62, w - 20, h * .38 - 10); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(60, h * .62); c.lineTo(100, 34); c.lineTo(140, h * .62); c.fill(); }); pic.position.set(0, 12, -12.75); g.add(pic);
  const rug = plane(16, 6, mat(0xffffff, { map: canvasTex(128, 64, (c, w, h) => { c.fillStyle = '#8a2a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#f4d080'; c.lineWidth = 4; c.strokeRect(6, 6, w - 12, h - 12); for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(16 + i * 18, 32); c.lineTo(24 + i * 18, 18); c.lineTo(32 + i * 18, 32); c.lineTo(24 + i * 18, 46); c.fill(); } }), roughness: 1 }), g, 0, .03, 9);
  return { g: shade(g), bed, quilt, W }; }

// ---------- cocina-comedor (X): mesa (0, 0) 14 × 8 con 4 sillas (x = ±5 delante/detrás), lámpara colgante, ventana al fondo (z = -14)
// con cortinas verdes, encimera a la izquierda, nevera, grifo (fregadero en (-14, -8)), aparador con platos.
export function kueche(scene, X) { const g = room(scene, X, 36, 28, 17, mat(0xffffff, { map: rep(wallp('#f4e4c0', '#ecd8a8', 40), 6, 2), roughness: .9 }), mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#c8a070'; c.fillRect(0, 0, w, h); c.fillStyle = '#b08858'; c.fillRect(0, 0, 32, 32); c.fillRect(32, 32, 32, 32); }), 9, 7), roughness: .6 }));
  const wd = mat(0xffffff, { map: rep(plankT('#c8925a', '#b07a44'), 1, 1), roughness: .6 });
  const T = G(g, 0, 0, 0); box(14, .6, 8, wd, .1, T, 0, 4.4, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.6, 4.2, .6, mat(0x7a4a24), .05, T, sx * 6.2, 2.1, sz * 3.4);
  const cloth = box(8, .05, 8.2, mat(0xffffff, { map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#f4f0e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a8a5a'; for (let i = 0; i < 8; i += 2) { c.fillRect(i * 8, 0, 8, h); } c.globalAlpha = .5; for (let i = 0; i < 8; i += 2) c.fillRect(0, i * 8, w, 8); }), roughness: .9 }), 0, T, 0, 4.73, 0);
  const CH = []; for (const [x, z, ry] of [[-3.4, 5.6, Math.PI], [3.4, 5.6, Math.PI], [-3.4, -5.6, 0], [3.4, -5.6, 0]]) { const c = G(g, x, 0, z); c.rotation.y = ry; box(3.2, .4, 3, mat(0x9a6a3a), .1, c, 0, 2.6, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(.14, .14, 2.6, mat(0x7a4a24), 6, c, sx * 1.3, 1.3, sz * 1.2); box(3.2, 4, .4, mat(0x9a6a3a), .1, c, 0, 4.6, -1.4); CH.push(c); }
  const LMP = G(g, 0, 17, 0); cyl(.06, .06, 5, mat(0x1a1a1a), 4, LMP, 0, -2.5, 0); const sh = new THREE.Mesh(new THREE.ConeGeometry(3, 2, 16, 1, true), mat(0x2a5a3a, { side: THREE.DoubleSide, roughness: .5 })); sh.position.y = -5.6; LMP.add(sh); const bulb = sphere(.6, glowM(0xfff0c0, 2.4), LMP, 0, -6.3, 0, 10, 8); bulb.castShadow = false;
  const W = windowFrame(g, 2, 10, -13.75, 0, windowView(true), 10, 6.6, '#2a8a5a'); W.night = W.p.material.map; W.day = windowView(false);
  for (let k = 0; k < 3; k++) { const pot = G(g, -1 + k * 3, 6.6, -13); cyl(.6, .45, .9, mat(0xb85a2a), 10, pot, 0, .45, 0); sphere(.8, mat(0x3a8a3a), pot, 0, 1.4, 0, 8, 6); }
  box(10.4, .4, 1.6, mat(0xf4f0e8), .05, g, 2, 6.55, -13.2);
  // encimera, fregadero y grifo a la izquierda (x = -17)
  const K = G(g, -15, 0, -4); for (let k = 0; k < 4; k++) { box(3.6, 6, 4, mat(0x6ab8c8, { roughness: .5 }), .1, K, 0, 3, -8 + k * 4.1); sphere(.18, mat(0xd9a531, { metalness: .8 }), K, 1.9, 4.6, -8 + k * 4.1, 8, 6); box(2, 3.6, 3.6, mat(0x6ab8c8, { roughness: .5 }), .1, K, -.8, 11.5, -8 + k * 4.1); }
  box(4, .4, 16.6, mat(0xf0ece4, { roughness: .3 }), .05, K, 0, 6.2, -1.9); box(2.6, .4, 3.4, mat(0x9aa0a8, { metalness: .8, roughness: .3 }), .05, K, .2, 6.25, -4);
  const TAP = G(K, -1.2, 6.4, -4); cyl(.15, .15, 2, mat(0xc8ccd4, { metalness: .9, roughness: .2 }), 8, TAP, 0, 1, 0); const sp = cyl(.12, .12, 1.6, mat(0xc8ccd4, { metalness: .9, roughness: .2 }), 8, TAP, .7, 2, 0); sp.rotation.z = Math.PI / 2;
  for (let k = 0; k < 4; k++) { const pl = cyl(.9, .9, .1, mat(0xffffff), 16, K, -1.6, 12 + k * .02, 2 + k * .1); }
  const FR = G(g, -14.6, 0, 10); box(5.4, 13, 4.4, mat(0xf4f6fa, { roughness: .25, metalness: .2 }), .4, FR, 0, 6.5, 0); box(.3, 3, .3, mat(0xc8ccd4, { metalness: .8 }), .05, FR, 2.8, 8, -1.6);
  for (let k = 0; k < 6; k++) { const mg = box(.8, .8, .1, mat([0xd8323a, 0xffd23f, 0x2a6ad8][k % 3]), .1, FR, 2.75, 4 + (k % 3) * 1.6, -1 + Math.floor(k / 3) * 1.4); mg.rotation.y = Math.PI / 2; }
  // aparador al fondo derecha con platos y jarra
  const AP = G(g, 12, 0, -11.6); box(9, 7, 3.2, mat(0x8a5a32), .15, AP, 0, 3.5, 0); box(9, 6, 1.6, mat(0x8a5a32), .1, AP, 0, 11, -.8); for (let k = 0; k < 4; k++) { const p = cyl(1, 1, .14, mat(0xf4f4f8), 16, AP, -3 + k * 2, 10.5, 0); p.rotation.x = Math.PI / 2 - .15; }
  const clock = textPlane(3.4, 3.4, 100, 100, (c, w, h) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(50, 50, 48, 0, 7); c.fill(); c.strokeStyle = '#6a4224'; c.lineWidth = 6; c.stroke(); c.lineCap = 'round'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 5; c.beginPath(); c.moveTo(50, 50); c.lineTo(50, 18); c.moveTo(50, 50); c.lineTo(72, 56); c.stroke(); }); clock.position.set(-6, 13, -13.75); g.add(clock);
  const BIN = G(g, -12, 0, 6); cyl(1.3, 1.1, 3.4, mat(0x9aa0a8, { metalness: .7, roughness: .4 }), 14, BIN, 0, 1.7, 0); cyl(1.4, 1.4, .3, mat(0x7a8088, { metalness: .7 }), 14, BIN, 0, 3.5, 0);
  return { g: shade(g), T, CH, W, TAP, FR, BIN, LMP }; }

// ---------- consulta del médico (X): escritorio (0, -6) mirando +z, camilla a la izquierda, optotipo y estantería, ventana a la derecha ----------
export function praxis(scene, X) { const g = room(scene, X, 34, 26, 16, mat(0xffffff, { map: rep(wallp('#e6f2ee', '#d8e8e2', 24), 6, 2), roughness: .9 }), mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#d8dce4'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b8bcc4'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); }), 10, 8), roughness: .4 }));
  const D = G(g, 0, 0, -6); box(12, .5, 5.4, mat(0xf4f0e8, { roughness: .4 }), .1, D, 0, 4.4, 0); for (const s of [-1, 1]) box(.5, 4.2, 5, mat(0xc8ccd4, { metalness: .5 }), .05, D, s * 5.5, 2.1, 0);
  box(3.6, 2.6, .3, mat(0x1a1a22), .1, D, -3, 6.2, -1.6); const scr = textPlane(3.3, 2.3, 120, 84, (c, w, h) => { c.fillStyle = '#e8f4ff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d83a3a'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x < w; x += 4) c.lineTo(x, h / 2 + (x % 28 < 4 ? -24 : 0) + Math.sin(x) * 2); c.stroke(); }, .6); scr.position.set(-3, 6.2, -1.42); D.add(scr);
  for (let k = 0; k < 3; k++) box(2.4, .3, 3, mat([0xf4f4f8, 0xffe8a0, 0xa8d8ff][k]), .02, D, 3 + k * .1, 4.8 + k * .3, .2);
  const ch = G(g, 0, 0, -10); box(3.4, .5, 3.2, mat(0x2a2a30), .1, ch, 0, 3, 0); box(3.4, 4.4, .5, mat(0x2a2a30), .1, ch, 0, 5.4, -1.4); cyl(.2, .2, 2.8, mat(0x9aa0a8, { metalness: .8 }), 6, ch, 0, 1.4, 0);
  const bed = G(g, -11, 0, 2); box(5.4, .9, 13, mat(0x3a8a8a, { roughness: .5 }), .2, bed, 0, 4, 0); for (const s of [-1, 1]) for (const t of [-1, 1]) cyl(.2, .2, 3.6, mat(0xc8ccd4, { metalness: .8 }), 6, bed, s * 2.2, 1.8, t * 5.6); box(5.6, .1, 9, mat(0xf4f4f8), 0, bed, 0, 4.5, 1);
  const chart = textPlane(5, 7.2, 150, 216, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a1a'; c.textAlign = 'center'; const L = ['E', 'F P', 'T O Z', 'L P E D', 'P E C F D', 'E D F C Z P']; L.forEach((s, i) => { c.font = `700 ${50 - i * 7}px ${FONT}`; c.fillText(s, w / 2, 46 + i * 32); }); c.fillStyle = '#d8323a'; c.fillRect(10, h - 22, w - 20, 4); });
  chart.position.set(-6, 10, -12.75); g.add(chart);
  const SH = G(g, 10, 0, -11.6); box(8, 12, 2.4, mat(0xf4f0e8), .1, SH, 0, 6, 0); for (let k = 0; k < 3; k++) { box(7.6, .3, 2.2, mat(0xd8d8d8), .02, SH, 0, 3 + k * 3.6, .1); for (let j = 0; j < 5; j++) cyl(.35, .35, 1.2, mat([0xffffff, 0xd8a020, 0x5ab8e8][(j + k) % 3], { roughness: .3 }), 10, SH, -3 + j * 1.5, 3.8 + k * 3.6, .3); }
  const W = windowFrame(g, 16.75, 9, 2, -Math.PI / 2, windowView(false), 8, 6.4, '#5ab8a8');
  const plant = G(g, 13, 0, 9); cyl(1, .8, 2.4, mat(0xf4f4f4), 12, plant, 0, 1.2, 0); for (let k = 0; k < 7; k++) { const l = box(.5, 4, .2, mat(0x2f8a3a), .1, plant, Math.cos(k) * .5, 4, Math.sin(k) * .5); l.rotation.set(Math.sin(k) * .4, k, Math.cos(k) * .4); }
  const cert = textPlane(4, 3, 120, 90, (c, w, h) => { c.fillStyle = '#d8b050'; c.fillRect(0, 0, w, h); c.fillStyle = '#fffbea'; c.fillRect(6, 6, w - 12, h - 12); c.fillStyle = '#3a2a1a'; c.font = `700 14px ${FONT}`; c.textAlign = 'center'; c.fillText('DR. MED.', w / 2, 34); c.fillText('KLAUSNER', w / 2, 54); }); cert.position.set(4, 11, -12.75); g.add(cert);
  return { g: shade(g), D, bed, W }; }
// ---------- REIHE: tres casitas adosadas, cada una con su puerta (gancho). Fachadas mirando a +z; puertas en x = X - 8,6, X, X + 8,6 (z = Z + 9,5).
export function reihe(scene, X, Z) { const g = G(scene, X, 0, Z); const wid = 8, sp = 8.6, DOORS = [];
  const ct = cobbleTex(); ct.repeat.set(3, 3); plane(60, 40, new THREE.MeshStandardMaterial({ map: ct, roughness: .38, metalness: .15, color: 0xd8d4cc }), g, 0, .03, 28);
  box(32, .5, 3.4, mat(0x9a948a, { roughness: .8 }), .05, g, 0, .25, 11.2);
  [[0x2a6a4a, 0], [0x8a2a2a, 1], [0x2a4a8a, 2]].forEach(([dc, ci], k) => { const hx = (k - 1) * sp + wid * .22; const h = alpHaus(g, hx, 0, wid, 2, ci + 3, 0); const dx = -wid * .22;
    const inner = plane(3.4, 5.2, glowM(0xffb860, .9), h, dx, 3.15, 9.33, 0); const pv = G(h, dx - 1.8, .5, 9.5);
    box(3.6, 5.2, .35, mat(dc, { roughness: .45 }), .06, pv, 1.8, 2.6, 0); for (const yy of [1.4, 3.8]) box(2.8, 1.8, .1, mat(0x000000, { transparent: true, opacity: .16 }), .02, pv, 1.8, yy, .2); sphere(.2, mat(0xd9a531, { metalness: .8, roughness: .3 }), pv, 3.1, 2.6, .3, 8, 6);
    const lp = sphere(.45, glowM(0xffd890, 2.2), h, dx + 2.7, 6.6, 10.1, 10, 8); lp.castShadow = false; box(.3, .9, .3, mat(0x1a1a1e), .05, h, dx + 2.7, 7.4, 9.8);
    // número de casa y felpudo
    const n = textPlane(1.2, 1.2, 64, 64, (c, w, hh) => { c.fillStyle = '#1a3a7a'; c.fillRect(0, 0, w, hh); c.fillStyle = '#fff'; c.font = 'bold 44px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(k + 1), w / 2, hh / 2 + 2); }); n.position.set(dx - 2.6, 6.2, 9.4); h.add(n);
    box(2.8, .1, 1.4, mat([0x8a5a2a, 0x3a6a3a, 0x7a2a3a][k], { roughness: 1 }), .05, h, dx, .55, 10.6);
    const pot = G(h, dx + 3, 0, 11.4); cyl(.7, .5, 1.2, mat(0xb85a2a, { roughness: .7 }), 10, pot, 0, .6, 0); sphere(.9, mat(0x2f7a3a, { roughness: .9 }), pot, 0, 1.7, 0, 8, 6); for (let j = 0; j < 4; j++) sphere(.26, mat([0xe8202a, 0xffd23f, 0xff6ab0][j % 3]), pot, Math.cos(j * 1.6) * .7, 2.1, Math.sin(j * 1.6) * .7, 6, 4);
    for (const wx of [0]) { const wm = plane(3.3, 4.4, new THREE.MeshStandardMaterial({ color: 0xffc070, emissive: 0xffa040, emissiveIntensity: 1.4 + k * .2, roughness: .4 }), h, wx, 7 + 4.6 - .1 + 8 * (k % 2), 9.09, 0); }
    DOORS.push({ pv, x: X + (k - 1) * sp, z: Z + 9.5, inner, h }); });
  for (const s of [-1, 1]) { laterne(g, s * 15, 16); pine(g, s * 22, 2, 1.3); pine(g, s * 26, -6, 1.6); }
  shade(g); return { g, DOORS }; }

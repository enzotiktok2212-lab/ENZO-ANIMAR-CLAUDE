// KAFFEE — atrezo propio: Tasse de porcelana (café con crema y vapor), Espressotasse con platito, Kanne de cristal con filtro,
// Omas Kanne de porcelana con flores, el Kaffeezähler (reloj de muñeca con pantalla), el HUD «KAFFEEZÄHLER», la lata de Oma
// (hojalata antigua con la nota «Nur ein Löffel. Niemals mehr.»), cuchara, paquetes (Tchibo, Jacobs Krönung, Melitta; solo el
// nombre, colores propios, sin logos), filtro Melitta, corona de oro, granos de café, Brötchen con precio, cafetera de bar,
// tarta, cama con almohadas, crucero, castillo, tele con EILMELDUNG.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp } from './engine.js';
import { FONT } from './props.js';

// ---------- dinero por tazas (1 = 12 €, 8 (una Kanne) = 800 €, 20 = 1 Mio., 30, 40, 50 = 1 Billion) ----------
const KP = [[0, 0], [1, 12], [8, 800], [20, 1e6], [30, 1e8], [40, 1e10], [50, 1e12]];
export function money(n) { if (n <= 0) return 0; if (n < 1) return 12 * n; if (n >= 50) return 1e12;
  for (let i = 1; i < KP.length - 1; i++) { const [a, va] = KP[i], [b, vb] = KP[i + 1]; if (n <= b) return Math.exp(lerp(Math.log(va), Math.log(vb), (n - a) / (b - a))); } return 1e12; }
export function euro(v) { v = Math.round(v); if (v < 1e6) return v.toLocaleString('de-DE') + ' €';
  for (const [d, n] of [[1e12, 'Bio.'], [1e9, 'Mrd.'], [1e6, 'Mio.']]) if (v >= d * .9995) { const x = v / d; return (x >= 100 ? Math.round(x) : x.toFixed(x >= 10 ? 0 : 1).replace('.', ',').replace(',0', '')) + ' ' + n + ' €'; } }
export const nTassen = n => { n = Math.floor(n); return n === 1 ? '1 Tasse' : n + ' Tassen'; };

const porc = (c = 0xfbf8f2) => mat(c, { roughness: .25, metalness: 0, envMapIntensity: 1.4 });
const coffeeT = (heart) => canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, '#c88a4a'); g.addColorStop(.55, '#9a5a2a'); g.addColorStop(.9, '#5a2e12'); g.addColorStop(1, '#3a1a08'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  const r = RNG(heart ? 9 : 4); for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(240,200,150,${.15 + r() * .25})`; c.beginPath(); c.arc(30 + r() * 68, 30 + r() * 68, 1 + r() * 2.5, 0, 7); c.fill(); }
  if (heart) { c.fillStyle = '#f6e6cc'; c.beginPath(); c.moveTo(64, 92); c.bezierCurveTo(14, 60, 34, 22, 64, 46); c.bezierCurveTo(94, 22, 114, 60, 64, 92); c.fill(); c.fillStyle = '#c88a4a'; c.beginPath(); c.moveTo(64, 82); c.bezierCurveTo(36, 62, 46, 40, 64, 54); c.bezierCurveTo(82, 40, 92, 62, 64, 82); c.fill(); } });
let CT = null, CTH = null; const coffeeM = heart => mat(0xffffff, { map: heart ? (CTH || (CTH = coffeeT(1))) : (CT || (CT = coffeeT(0))), roughness: .2, emissive: 0x2a1204, emissiveIntensity: .2 });
const steamM = () => new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .35, depthWrite: false });

// vapor: bolas blancas que suben, se ensanchan y se desvanecen (userData.steam(T, k))
function addSteam(g, y0, r0 = .3, n = 7) { const S = []; for (let i = 0; i < n; i++) { const s = sphere(.2, steamM(), g, 0, y0, 0, 10, 8); s.castShadow = s.receiveShadow = false; s.userData.noOutline = true; s.renderOrder = 6; S.push(s); }
  return (T, k = 1) => S.forEach((s, i) => { const r = RNG(i * 11 + 3), t = (T * (.35 + r() * .2) + r()) % 1; s.visible = k > 0; s.position.set(Math.sin(T * 1.6 + i * 2) * .18 * t + (r() - .5) * r0, y0 + t * 2.6, (r() - .5) * r0 * .6); s.scale.setScalar(.6 + t * 2.2); s.material.opacity = .32 * k * Math.sin(t * Math.PI); }); }

// ---------- Tasse (taza grande de porcelana) ----------
// Origen en el centro de la base; el asa sale hacia +x (mano derecha, como la Maß de SCHLUCK). Alto 1.2, radio 0.5.
// o.col (color de la taza), o.band (franja), o.text (palabra en la taza), o.heart (latte art). userData.level(k, T), userData.steam(T, k)
export function tasse(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g); const H = o.h ?? 1.2, R = o.r ?? .5;
  const body = o.text || o.dots ? mat(0xffffff, { map: canvasTex(256, 96, (c, w, h) => { c.fillStyle = '#' + (o.col ?? 0xfbf8f2).toString(16).padStart(6, '0'); c.fillRect(0, 0, w, h);
      if (o.dots) { c.fillStyle = o.dots; for (let y = 10; y < h; y += 22) for (let x = (y / 22 | 0) % 2 ? 12 : 0; x < w; x += 24) { c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); } }
      if (o.text) { c.fillStyle = o.ink || '#2a1a10'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.text, w * .25, h / 2 + 2); } }), roughness: .25 }) : porc(o.col ?? 0xfbf8f2);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(R, R * .9, H, 28, 1, true), body); wall.position.y = H / 2; g.add(wall); wall.material.side = THREE.DoubleSide;
  cyl(R * .9, R * .82, .12, porc(o.col ?? 0xfbf8f2), 28, g, 0, .06, 0);
  if (o.band != null) { const b = cyl(R * 1.01, R * 1.0, .14, porc(o.band), 28, g, 0, H * .82, 0); b.userData.noOutline = true; }
  const lip = new THREE.Mesh(new THREE.TorusGeometry(R * .985, .045, 8, 28), porc(o.col ?? 0xfbf8f2)); lip.rotation.x = Math.PI / 2; lip.position.y = H; g.add(lip);
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(R * .95, R * .86, H - .1, 24, 1, true), mat(0x3a1a08, { roughness: .4, side: THREE.BackSide })); inner.position.y = H / 2 + .05; inner.userData.noOutline = true; g.add(inner);
  const ha = new THREE.Mesh(new THREE.TorusGeometry(.3, .09, 10, 18, Math.PI * 1.2), porc(o.hcol ?? o.col ?? 0xfbf8f2)); ha.rotation.z = -Math.PI * .6; ha.position.set(R + .08, H * .55, 0); g.add(ha);
  const cof = new THREE.Mesh(new THREE.CircleGeometry(R * .92, 28), coffeeM(o.heart)); cof.rotation.x = -Math.PI / 2; cof.userData.noOutline = true; g.add(cof);
  const steam = addSteam(g, H + .1, R * .7, 6);
  g.userData = { H, R, cof, steam, level(k, T = 0) { k = clamp(k); cof.visible = k > .03; cof.position.y = .14 + (H - .26) * k; const s = .92 - (1 - k) * .08; cof.scale.setScalar(s / .92); }, gold: false };
  g.userData.level(.85); steam(0, 0); return g; }

// ---------- Espressotasse con platito ----------
export function espresso(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g);
  cyl(.62, .5, .08, porc(o.col ?? 0xfbf8f2), 24, g, 0, .04, 0); const t = tasse(g, { h: .62, r: .34, col: o.col, band: o.band }); t.position.y = .08; g.userData = { ...t.userData, cup: t }; return g; }

// ---------- Kanne de cristal (cafetera de filtro) ----------
export function kanne(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g);
  const gm = new THREE.MeshStandardMaterial({ color: 0xf4fbff, roughness: .04, metalness: .1, transparent: true, opacity: .3, depthWrite: false, envMapIntensity: 2 });
  const prof = []; for (let i = 0; i <= 12; i++) { const t = i / 12; prof.push(new THREE.Vector2(.25 + Math.sin(t * Math.PI) * .75 + (1 - t) * .25, t * 2.2)); }
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), gm); body.userData.noOutline = true; body.renderOrder = 3; g.add(body);
  const cof = new THREE.Mesh(new THREE.LatheGeometry(prof.slice(0, 8).map(v => new THREE.Vector2(v.x * .94, v.y)), 24), mat(0x3a1a08, { roughness: .2, emissive: 0x1a0a02, emissiveIntensity: .2 })); cof.userData.noOutline = true; g.add(cof);
  cyl(.62, .66, .35, mat(0x1a1a1e, { roughness: .4 }), 24, g, 0, 2.3, 0); const sp = new THREE.Mesh(new THREE.ConeGeometry(.22, .5, 8), gm); sp.rotation.z = Math.PI / 2 + .5; sp.position.set(-.85, 2.0, 0); g.add(sp);
  const h = new THREE.Mesh(new THREE.TorusGeometry(.55, .11, 8, 16, Math.PI), mat(0x1a1a1e, { roughness: .4 })); h.rotation.z = -Math.PI / 2; h.position.set(1.05, 1.3, 0); g.add(h);
  const steam = addSteam(g, 2.5, .3, 5); g.userData = { cof, steam, level(k) { cof.scale.y = Math.max(.02, clamp(k)); cof.visible = k > .02; } }; steam(0, 0); g.scale.setScalar(o.s ?? 1); return g; }

// ---------- Omas Kanne (porcelana blanca con flores azules) ----------
export function omaKanne(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g);
  const t = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#fbf8f2'; c.fillRect(0, 0, w, h); const r = RNG(2); for (let i = 0; i < 12; i++) { const x = r() * w, y = 20 + r() * 90; c.fillStyle = '#2a4ab8'; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + Math.cos(k * 1.25) * 7, y + Math.sin(k * 1.25) * 7, 5, 0, 7); c.fill(); } c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); c.strokeStyle = '#3a8a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y + 8); c.quadraticCurveTo(x + 10, y + 20, x + 18, y + 16); c.stroke(); }
    c.fillStyle = '#d8a020'; c.fillRect(0, 0, w, 6); c.fillRect(0, h - 6, w, 6); });
  const prof = []; for (let i = 0; i <= 12; i++) { const k = i / 12; prof.push(new THREE.Vector2(.55 + Math.sin(k * Math.PI * .9) * .55, k * 2.4)); }
  const b = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), mat(0xffffff, { map: t, roughness: .25 })); g.add(b);
  cyl(.6, .62, .2, porc(), 24, g, 0, 2.45, 0); sphere(.18, mat(0xd8a020, { metalness: .8, roughness: .3 }), g, 0, 2.7, 0, 10, 8);
  const sp = cyl(.08, .2, 1.4, porc(), 10, g, -1.2, 1.5, 0); sp.rotation.z = .9; const h = new THREE.Mesh(new THREE.TorusGeometry(.55, .1, 8, 16, Math.PI), porc()); h.rotation.z = -Math.PI / 2; h.position.set(1.05, 1.3, 0); g.add(h);
  const steam = addSteam(g, 2.8, .3, 5); g.userData = { steam }; steam(0, 0); g.scale.setScalar(o.s ?? 1); return g; }

// ---------- Kaffeezähler: reloj en la muñeca izquierda con pantalla ----------
export function wristMeter(ch) { const g = new THREE.Group(); ch.aL.el.add(g); g.position.set(0, -.58, 0);
  box(.98, .3, .98, mat(0x2a2a30, { roughness: .4, metalness: .4 }), .1, g, 0, 0, 0);
  const caseM = mat(0xd8a020, { metalness: .9, roughness: .25 }); box(.86, .66, .14, caseM, .08, g, 0, 0, .5);
  const t = canvasTex(192, 144, () => {}); const scr = new THREE.Mesh(new THREE.PlaneGeometry(.74, .55), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); scr.position.z = .58; scr.userData.noOutline = true; g.add(scr);
  let key = ''; g.userData.set = (n, e, col = '#7aff9a') => { const k = n + '|' + e + col; if (k === key) return; key = k; const c = t.image.getContext('2d'); c.fillStyle = '#06100a'; c.fillRect(0, 0, 192, 144);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#c89a5a'; c.font = `700 20px ${FONT}`; c.fillText('KAFFEEZÄHLER', 96, 18);
    let s = String(n); c.font = `700 42px ${FONT}`; if (c.measureText(s).width > 180) c.font = `700 ${Math.floor(42 * 180 / c.measureText(s).width)}px ${FONT}`; c.fillStyle = col; c.fillText(s, 96, 62);
    s = String(e); c.font = `700 32px ${FONT}`; if (c.measureText(s).width > 184) c.font = `700 ${Math.floor(32 * 184 / c.measureText(s).width)}px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(s, 96, 112); t.needsUpdate = true; };
  g.userData.set('0 Tassen', '0 €'); g.visible = false; return g; }

// HUD 2D arriba: «KAFFEEZÄHLER» con tazas y euros
export function drawHUD(c, x, y, sc, n, eur, col = '#7aff9a', alpha = 1) { c.save(); c.globalAlpha = alpha; c.translate(x, y); c.scale(sc, sc);
  const g = c.createLinearGradient(0, -80, 0, 80); g.addColorStop(0, 'rgba(48,26,12,.94)'); g.addColorStop(1, 'rgba(22,12,6,.94)'); c.fillStyle = g; c.strokeStyle = '#f0c060'; c.lineWidth = 6; c.beginPath(); c.roundRect(-340, -80, 680, 160, 32); c.fill(); c.stroke();
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 30px ${FONT}`; c.fillStyle = '#f0c060'; c.fillText('KAFFEEZÄHLER', 0, -50);
  c.save(); c.translate(-282, 20); c.fillStyle = '#fbf8f2'; c.beginPath(); c.moveTo(-24, -22); c.lineTo(24, -22); c.lineTo(20, 26); c.lineTo(-20, 26); c.closePath(); c.fill(); c.strokeStyle = '#fbf8f2'; c.lineWidth = 7; c.beginPath(); c.arc(26, 0, 11, -1.4, 1.4); c.stroke();
  c.fillStyle = '#6a3a1a'; c.fillRect(-21, -20, 42, 8); c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 4; for (const k of [-10, 6]) { c.beginPath(); c.moveTo(k, -30); c.quadraticCurveTo(k + 8, -40, k, -52); c.stroke(); } c.restore();
  c.font = `700 60px ${FONT}`; c.textAlign = 'left'; c.fillStyle = col; let w = c.measureText(n).width; if (w > 250) { c.save(); c.translate(-240, 18); c.scale(250 / w, 1); c.fillText(n, 0, 0); c.restore(); } else c.fillText(n, -240, 18);
  c.textAlign = 'right'; c.fillStyle = '#ffffff'; w = c.measureText(eur).width; if (w > 300) { c.save(); c.translate(312, 18); c.scale(300 / w, 1); c.fillText(eur, 0, 0); c.restore(); } else c.fillText(eur, 312, 18);
  c.restore(); }

// ---------- la lata de Oma (hojalata antigua) ----------
// Origen en la base; userData.open(k) levanta la tapa; userData.glow(k) brillo mágico del café; nota pegada delante (+z).
export function dose(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g);
  const lab = canvasTex(512, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#8a1a1a'); gr.addColorStop(1, '#5a0a0a'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#e8b84a'; c.lineWidth = 6; c.strokeRect(10, 14, w - 20, h - 28); c.lineWidth = 2; c.strokeRect(20, 24, w - 40, h - 48); const r = RNG(3);
    for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(40,20,10,${r() * .3})`; c.beginPath(); c.arc(r() * w, r() * h, 2 + r() * 9, 0, 7); c.fill(); }
    c.fillStyle = '#e8b84a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 92px ${FONT}`; c.fillText('KAFFEE', w * .3, h / 2 - 12); c.font = `700 30px ${FONT}`; c.fillText('ECHTER BOHNEN', w * .3, h / 2 + 52); c.fillText('SEIT 1931', w * .3, h / 2 + 86);
    for (let k = 0; k < 6; k++) { c.beginPath(); c.ellipse(w * .78 + Math.cos(k) * 40, h / 2 + Math.sin(k * 1.7) * 50, 16, 24, k, 0, 7); c.fill(); c.strokeStyle = '#5a0a0a'; c.lineWidth = 3; c.beginPath(); c.moveTo(w * .78 + Math.cos(k) * 40, h / 2 + Math.sin(k * 1.7) * 50 - 18); c.lineTo(w * .78 + Math.cos(k) * 40, h / 2 + Math.sin(k * 1.7) * 50 + 18); c.stroke(); } });
  const tin = mat(0xffffff, { map: lab, roughness: .45, metalness: .5 }); const b = new THREE.Mesh(new THREE.CylinderGeometry(.95, .95, 1.9, 32), [tin, mat(0xb8a060, { metalness: .8, roughness: .35 }), mat(0xb8a060, { metalness: .8 })]); b.position.y = .95; b.rotation.y = -Math.PI / 2 + .9; g.add(b);
  for (const y of [.08, 1.82]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.95, .05, 6, 32), mat(0xc8a850, { metalness: .9, roughness: .3 })); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); }
  const lid = new THREE.Group(); lid.position.set(0, 1.9, -.95); g.add(lid); cyl(1.0, 1.0, .22, mat(0xc8a850, { metalness: .9, roughness: .3 }), 32, lid, 0, .1, .95); cyl(.3, .3, .1, mat(0x8a1a1a, { metalness: .5 }), 16, lid, 0, .26, .95);
  const pow = sphere(.9, mat(0x4a2410, { roughness: 1, emissive: 0xff8a20, emissiveIntensity: 0 }), g, 0, 1.8, 0, 20, 10); pow.scale.set(1, .32, 1); pow.userData.noOutline = true;
  const note = textPlane(1.1, .8, 220, 160, (c, w, h) => { c.fillStyle = '#fbf3c8'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(80,120,200,.35)'; c.lineWidth = 2; for (let y = 34; y < h; y += 30) { c.beginPath(); c.moveTo(6, y); c.lineTo(w - 6, y); c.stroke(); }
    c.fillStyle = '#1a2a7a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 30px ${FONT}`; c.save(); c.translate(w / 2, h / 2); c.rotate(-.04); c.fillText('Nur ein Löffel.', 0, -30); c.fillStyle = '#c8202a'; c.font = `700 34px ${FONT}`; c.fillText('NIEMALS MEHR!', 0, 18); c.fillStyle = '#1a2a7a'; c.font = `700 22px ${FONT}`; c.fillText('— Oma', 50, 56); c.restore(); });
  note.position.set(0, 1.0, .965); note.rotation.z = .05; g.add(note); box(.3, .1, .02, mat(0xe8e0c0, { transparent: true, opacity: .7 }), 0, g, 0, 1.42, .975);
  const steam = addSteam(g, 2.1, .6, 7);
  g.userData = { lid, pow, note, steam, open(k) { lid.rotation.x = -clamp(k) * 1.9; pow.visible = k > .05; }, glow(k) { pow.material.emissiveIntensity = k * .7; } }; g.userData.open(0); steam(0, 0); g.scale.setScalar(o.s ?? 1); return g; }
// cuchara con café molido
export function loeffel(parent) { const g = new THREE.Group(); if (parent) parent.add(g); const m = mat(0xd8dce4, { metalness: .9, roughness: .2 });
  box(.12, .05, 1.6, m, .02, g, 0, 0, -.8); const b = sphere(.26, m, g, 0, 0, .12, 12, 8); b.scale.set(1, .35, 1.3); const p = sphere(.22, mat(0x4a2410, { roughness: 1 }), g, 0, .06, .12, 10, 6); p.scale.set(1, .4, 1.2); g.userData.pow = p; return g; }

// ---------- paquetes de café (solo el nombre de la marca; colores y dibujo propios) ----------
const PK = { TCHIBO: { bg: '#1a2a5a', bg2: '#0a1636', ink: '#ffffff', acc: '#f0c040', sub: 'GUT & GÜNSTIG', price: '4,99 €' }, JACOBS: { bg: '#5a2a12', bg2: '#2a1206', ink: '#f0c860', acc: '#f0c860', sub: 'KRÖNUNG', price: '5,49 €', crown: 1 }, MELITTA: { bg: '#c8202a', bg2: '#8a0a12', ink: '#ffffff', acc: '#3a8a4a', sub: 'FILTERKAFFEE', price: '4,79 €' } };
export function pack(parent, brand = 'TCHIBO', o = {}) { const g = new THREE.Group(); if (parent) parent.add(g); const b = PK[brand];
  const t = canvasTex(256, 384, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, b.bg); gr.addColorStop(1, b.bg2); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = b.acc; c.fillRect(0, 70, w, 10); c.fillRect(0, h - 90, w, 6);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = b.ink; let fs = 64; c.font = `700 ${fs}px ${FONT}`; while (c.measureText(brand).width > w - 20) { fs -= 2; c.font = `700 ${fs}px ${FONT}`; } c.fillText(brand, w / 2, 130);
    c.font = `700 30px ${FONT}`; c.fillStyle = b.acc; c.fillText(b.sub, w / 2, 180);
    if (b.crown) { c.save(); c.translate(w / 2, 40); c.fillStyle = '#f0c860'; c.beginPath(); c.moveTo(-40, 18); c.lineTo(-44, -16); c.lineTo(-20, 4); c.lineTo(0, -22); c.lineTo(20, 4); c.lineTo(44, -16); c.lineTo(40, 18); c.closePath(); c.fill(); c.restore(); }
    for (let k = 0; k < 5; k++) { c.save(); c.translate(60 + k * 34, 250 + (k % 2) * 26); c.rotate(k); c.fillStyle = '#6a3a1a'; c.beginPath(); c.ellipse(0, 0, 14, 20, 0, 0, 7); c.fill(); c.strokeStyle = '#2a1206'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -16); c.quadraticCurveTo(5, 0, 0, 16); c.stroke(); c.restore(); }
    c.fillStyle = '#ffffff'; c.font = `700 26px ${FONT}`; c.fillText('500 g', w / 2, h - 50); });
  const side = mat(b.bg2 === '#0a1636' ? 0x1a2a5a : b.bg === '#5a2a12' ? 0x5a2a12 : 0xc8202a, { roughness: .5 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, .7), [side, side, mat(0xe8e0d0, { roughness: .7 }), side, mat(0xffffff, { map: t, roughness: .45, metalness: .15 }), mat(0xffffff, { map: t, roughness: .45 })]); m.position.y = .9; m.castShadow = m.receiveShadow = true; g.add(m);
  if (o.price) { const p = textPlane(.8, .4, 120, 60, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 12); c.fill(); c.fillStyle = '#c8202a'; c.font = `700 34px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(b.price, w / 2, h / 2 + 2); }); p.position.set(.25, .35, .37); p.rotation.z = -.15; g.add(p); }
  g.scale.setScalar(o.s ?? 1); return g; }
// filtro Melitta (cono rojo con papel) sobre la Kanne
export function filter(parent) { const g = new THREE.Group(); if (parent) parent.add(g); const c = new THREE.Mesh(new THREE.CylinderGeometry(.85, .4, 1.1, 24, 1, true), mat(0xc8202a, { roughness: .35, side: THREE.DoubleSide })); c.position.y = .55; g.add(c);
  const p = new THREE.Mesh(new THREE.CylinderGeometry(.78, .34, 1.0, 20, 1, true), mat(0xfaf4e0, { roughness: .9, side: THREE.DoubleSide })); p.position.y = .66; g.add(p); cyl(.5, .5, .1, mat(0xc8202a), 20, g, 0, 0, 0);
  const h = new THREE.Mesh(new THREE.TorusGeometry(.3, .08, 6, 12, Math.PI), mat(0xc8202a)); h.rotation.z = -Math.PI / 2; h.position.set(.95, .6, 0); g.add(h); return g; }
// corona de oro con gemas
export function krone(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g); const gm = mat(0xffd23f, { metalness: .95, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .35 });
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, .5, 24, 1, true), gm); ring.material.side = THREE.DoubleSide; ring.position.y = .25; g.add(ring);
  for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; const s = new THREE.Mesh(new THREE.ConeGeometry(.2, .6, 4), gm); s.position.set(Math.cos(a) * .7, .75, Math.sin(a) * .7); g.add(s); sphere(.09, gm, g, Math.cos(a) * .7, 1.08, Math.sin(a) * .7, 8, 6); sphere(.1, mat([0xe8203a, 0x2a6ad8, 0x3ad86a][k % 3], { roughness: .1, metalness: .3, emissive: [0x6a0010, 0x0a2a6a, 0x0a5a2a][k % 3], emissiveIntensity: .5 }), g, Math.cos(a) * .74, .3, Math.sin(a) * .74, 8, 6); }
  g.scale.setScalar(o.s ?? 1); return g; }
// grano de café (geometría compartida para lluvias instanciadas)
export function beanGeo() { const g = new THREE.SphereGeometry(.22, 10, 8); g.scale(1, .62, 1.4); return g; }
export const beanMat = () => mat(0x5a2e14, { roughness: .45, emissive: 0x1a0a02, emissiveIntensity: .2 });
// Brötchen con etiqueta de precio
export function broetchen(parent, price = '1.000.000 €') { const g = new THREE.Group(); if (parent) parent.add(g); const b = sphere(1, mat(0xd8942a, { roughness: .6 }), g, 0, .6, 0, 20, 14); b.scale.set(1.3, .65, .95); const c = box(1.8, .1, .12, mat(0xf4d89a), .04, g, 0, 1.2, .2); c.rotation.x = -.3;
  const t = textPlane(1.9, .8, 300, 126, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 18); c.fill(); c.strokeStyle = '#c8202a'; c.lineWidth = 6; c.stroke(); c.fillStyle = '#c8202a'; c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; let f = 52; while (c.measureText(price).width > w - 20) { f -= 2; c.font = `700 ${f}px ${FONT}`; } c.fillText(price, w / 2, h / 2 + 2); });
  t.position.set(0, 2.2, 0); g.add(t); cyl(.03, .03, 1, mat(0x9a9aa4), 4, g, 0, 1.5, 0); g.userData.tag = t; return g; }
// cafetera de bar (cromada, dos grupos, vaporizador)
export function maschine(parent) { const g = new THREE.Group(); if (parent) parent.add(g); const ch = mat(0xd8dce4, { metalness: .9, roughness: .18 }), rd = mat(0xb81a22, { roughness: .3, metalness: .3 });
  box(6, 3.6, 3, ch, .3, g, 0, 1.8, 0); box(6.1, .8, 3.1, rd, .2, g, 0, 3.1, 0); box(6.2, .3, 3.2, ch, .1, g, 0, 3.7, 0);
  for (const s of [-1, 1]) { cyl(.45, .5, .5, ch, 16, g, s * 1.4, 1.9, 1.6); const pf = box(.3, .25, 1.4, mat(0x1a1a1a), .08, g, s * 1.4, 1.55, 2.3); cyl(.12, .12, .5, ch, 8, g, s * 1.4, 1.35, 1.6); }
  const w = cyl(.06, .06, 1.6, ch, 6, g, 2.6, 1.6, 1.6); w.rotation.z = .2; for (let k = 0; k < 4; k++) { const t = tasse(g, { h: .7, r: .32, col: [0xffffff, 0xc8202a, 0x2a4ab8, 0xffffff][k] }); t.position.set(-1.8 + k * 1.2, 3.85, 0); t.userData.level(0); }
  const gauge = cyl(.4, .4, .1, mat(0xfbf8f2), 16, g, 0, 2.2, 1.52); gauge.rotation.x = Math.PI / 2; const st = addSteam(g, 1.2, .3, 6); g.userData.steam = st; return g; }
// tarta (Schwarzwälder) en plato y trozo
export function kuchen(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g); cyl(1.6, 1.5, .1, porc(), 28, g, 0, .05, 0);
  const cake = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, .9, 28, 1, false, 0, Math.PI * 1.65), [mat(0x4a2414, { roughness: .8 }), mat(0xfbf6ee, { roughness: .9 }), mat(0xfbf6ee)]); cake.position.y = .55; g.add(cake);
  for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 1.65 + .2; sphere(.17, mat(0xfbf6ee, { roughness: .9 }), g, Math.cos(a) * .95, 1.1, -Math.sin(a) * .95, 8, 6); sphere(.1, mat(0xb8101a, { roughness: .2 }), g, Math.cos(a) * .95, 1.26, -Math.sin(a) * .95, 8, 6); }
  g.scale.setScalar(o.s ?? 1); return g; }
// cama con almohadas (de noche, sin dormir)
export function bett(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g); const wd = mat(o.gold ? 0xd8a020 : 0x8a5a32, { roughness: .5, metalness: o.gold ? .8 : 0 });
  box(7, 1.6, 12, wd, .3, g, 0, .8, 0); box(6.6, 1.2, 11.4, mat(0xfbf8f2, { roughness: .9 }), .4, g, 0, 2.0, 0); box(7.4, 5, .8, wd, .3, g, 0, 2.5, -6.2); box(7.4, 3, .6, wd, .3, g, 0, 1.5, 6.2);
  const qu = box(6.8, .6, 7.6, mat(o.quilt ?? 0x3a6ad8, { roughness: .9 }), .3, g, 0, 2.7, 1.8);
  for (let k = 0; k < (o.n ?? 2); k++) { const p = box(2.8, .9, 1.9, mat(0xffffff, { roughness: .95 }), .4, g, -1.5 + (k % 2) * 3, 3.0 + Math.floor(k / 2) * .8, -4.4 + Math.floor(k / 2) * .2); p.rotation.y = (k * .37) % .3 - .15; }
  return g; }
// crucero (maqueta grande sobre el agua)
export function schiff(parent) { const g = new THREE.Group(); if (parent) parent.add(g); const wh = mat(0xfbfbf8, { roughness: .4 }), bl = mat(0x1a2a5a, { roughness: .5 }), rd = mat(0xc8202a, { roughness: .4 });
  const hull = box(16, 6, 70, bl, 2.5, g, 0, 1, 0); box(16.2, 1.2, 70.2, rd, .4, g, 0, -1.6, 0); box(15, 4, 64, wh, .8, g, 0, 6, -1); box(13, 4, 52, wh, .8, g, 0, 10, -3); box(11, 3.6, 36, wh, .8, g, 0, 13.8, -6);
  const winT = canvasTex(256, 32, (c, w, h) => { c.fillStyle = '#fbfbf8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a4a7a'; for (let x = 4; x < w; x += 12) c.fillRect(x, 10, 7, 12); });
  for (const s of [-1, 1]) for (const [y, ww, l] of [[6, 7.6, 64], [10, 6.6, 52], [13.8, 5.6, 36]]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(l, 2.2), mat(0xffffff, { map: winT })); winT.repeat.set(l / 8, 1); p.position.set(s * (ww + .05), y, y === 6 ? -1 : y === 10 ? -3 : -6); p.rotation.y = s * Math.PI / 2; g.add(p); }
  for (const z of [-14, -2]) { cyl(2, 2.4, 7, rd, 16, g, 0, 19, z); cyl(2.05, 2.05, 1.4, mat(0x1a1a1e), 16, g, 0, 22, z); }
  const n = textPlane(14, 2.4, 560, 96, (c, w, h) => { c.fillStyle = '#ffffff'; c.font = `700 70px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('MS ESPRESSO', w / 2, h / 2 + 4); }); n.position.set(8.06, 1.4, 22); n.rotation.y = Math.PI / 2; g.add(n);
  return g; }
// castillo pequeño (torres con conos)
export function schloss(parent) { const g = new THREE.Group(); if (parent) parent.add(g); const st = mat(0xe8dcc8, { roughness: .85 }), rf = mat(0x2a4a8a, { roughness: .5 });
  box(30, 16, 16, st, .2, g, 0, 8, 0); for (const [x, z, h] of [[-15, -8, 26], [15, -8, 26], [-15, 8, 22], [15, 8, 22], [0, -8, 34]]) { cyl(4, 4, h, st, 16, g, x, h / 2, z); const c = new THREE.Mesh(new THREE.ConeGeometry(5, 9, 16), rf); c.position.set(x, h + 4.5, z); g.add(c); }
  for (let k = 0; k < 8; k++) box(2.2, 2.2, 1, st, .1, g, -13 + k * 3.7, 17, 8); box(5, 8, .5, mat(0x5a3418), .2, g, 0, 4, 8.1); const fl = box(.2, 3, 2, mat(0xc8202a), 0, g, 0, 44, -8); return g; }
// pantalla de la tele: noticia urgente con el Brötchen a un millón o el sueño como dinero
export function drawNews(c, w, h, k, mode = 0) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a1a4a'); g.addColorStop(1, '#02081e'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  if (mode === 0) { c.fillStyle = '#ffffff'; c.font = `700 ${h * .2}px ${FONT}`; c.fillText('WIRTSCHAFT', w / 2, h * .33); c.fillStyle = '#ff4a4a'; c.fillText('BRICHT ZUSAMMEN', w / 2, h * .55);
    c.strokeStyle = '#ff4a4a'; c.lineWidth = h * .02; c.beginPath(); for (let i = 0; i <= 20; i++) c.lineTo(w * .1 + i * w * .04, h * .12 + Math.pow(i / 20, 1.8) * h * .1 + Math.sin(i * 2) * h * .015); c.stroke(); }
  else { c.fillStyle = '#ffffff'; c.font = `700 ${h * .16}px ${FONT}`; c.fillText('NEUES GELD:', w / 2, h * .3); c.fillStyle = '#9ad8ff'; c.font = `700 ${h * .26}px ${FONT}`; c.fillText('SCHLAF', w / 2, h * .52); c.fillStyle = '#ffd23f'; c.font = `700 ${h * .09}px ${FONT}`; c.fillText('1 STUNDE = 100 €', w / 2, h * .68); }
  c.fillStyle = '#d8101a'; c.fillRect(0, h * .78, w, h * .12); c.fillStyle = '#ffffff'; c.font = `700 ${h * .085}px ${FONT}`; c.fillText('EILMELDUNG', w * .22, h * .84);
  c.fillStyle = '#ffd23f'; c.fillRect(w * .42, h * .79, w * .58, h * .1); c.fillStyle = '#0a1a4a'; c.font = `700 ${h * .06}px ${FONT}`; const tk = 'KAFFEEGELD ZÄHLT NICHT MEHR +++ BRÖTCHEN: 1 MIO. € +++ '; c.save(); c.beginPath(); c.rect(w * .42, h * .79, w * .58, h * .1); c.clip(); c.textAlign = 'left'; c.fillText(tk + tk, w * .44 - (k * w * .8) % (w * 1.2), h * .845); c.restore();
  c.fillStyle = '#020610'; c.fillRect(0, h * .9, w, h * .1); c.fillStyle = '#ffffff'; c.font = `700 ${h * .05}px ${FONT}`; c.textAlign = 'right'; c.fillText('RTV 24', w * .96, h * .95); }

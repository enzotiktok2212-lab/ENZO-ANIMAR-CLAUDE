// SCHLUCK — la cerveza: Maßkrug de cristal con hoyuelos (cerveza dorada, espuma, burbujas), botellas con etiqueta
// (Weihenstephaner, Paulaner), caja de botellas, Bierdeckel, el Bierzähler (colgante al cuello con pantalla),
// el goldener Krug (de oro, grabado, gemas), barril, escala de dinero por cervezas y el HUD «BIERZÄHLER».
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG, clamp, lerp, easeOut, easeInOut, V } from './engine.js';
import { FONT } from './props.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// ---------- dinero por cervezas (1 = 20 €, 5 = 600 €, 20 = 1 Mio., 100, 200, 300 …, 500 = 1 Trillion) ----------
const KP = [[0, 0], [1, 20], [5, 600], [20, 1e6], [100, 4e8], [200, 1e11], [300, 2e13], [500, 1e18]];
export function money(n) { if (n <= 0) return 0; if (n < 1) return 20 * n;
  for (let i = 1; i < KP.length - 1; i++) { const [a, va] = KP[i], [b, vb] = KP[i + 1]; if (n <= b) return Math.exp(lerp(Math.log(va), Math.log(vb), (n - a) / (b - a))); }
  return KP[KP.length - 1][1]; }
export function euro(v) { v = Math.round(v); if (v < 1e6) return v.toLocaleString('de-DE') + ' €';
  const U = [[1e18, 'Trillion'], [1e15, 'Brd.'], [1e12, 'Bio.'], [1e9, 'Mrd.'], [1e6, 'Mio.']];
  for (const [d, n] of U) if (v >= d) { const x = v / d; return (x >= 100 ? Math.round(x) : x.toFixed(x >= 10 ? 0 : 1).replace('.', ',')) + ' ' + n + ' €'; } }
export const nBier = n => Math.floor(n).toLocaleString('de-DE');

// ---------- materiales ----------
const glassM = () => new THREE.MeshStandardMaterial({ color: 0xf4fbff, roughness: .04, metalness: .1, transparent: true, opacity: .26, envMapIntensity: 2.2, depthWrite: false });
const beerT = () => canvasTex(128, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ffd34a'); g.addColorStop(.5, '#f6a81c'); g.addColorStop(1, '#d87a08'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  const r = RNG(5); for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,250,220,${.25 + r() * .45})`; c.beginPath(); c.arc(r() * w, r() * h, .8 + r() * 1.8, 0, 7); c.fill(); } });
let BEERT = null; const beerM = () => mat(0xffffff, { map: BEERT || (BEERT = beerT()), roughness: .15, emissive: 0x6a3800, emissiveIntensity: .35 });
const foamM = () => mat(0xfffbf0, { roughness: .9, emissive: 0x302a20, emissiveIntensity: .15 });

// ---------- Maßkrug ----------
// Origen en el centro de la base; el asa sale hacia +x (para la mano derecha). Alto 1.5, radio 0.52.
// userData.level(k): k = 0 (vacía) … 1 (llena con espuma); userData.over(k): espuma que rebosa (0…1).
export function mass(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g); const H = o.h ?? 1.3, R = o.r ?? .46;
  const gm = glassM(); const wall = cyl(R, R * .96, H, gm, 28, g, 0, H / 2, 0); wall.castShadow = false; wall.userData.noOutline = true; wall.renderOrder = 3;
  // hoyuelos (anillos de lentes) y base gruesa
  const dm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .02, transparent: true, opacity: .18, depthWrite: false, envMapIntensity: 2.5 });
  { const L = []; for (let r = 0; r < 4; r++) for (let k = 0; k < 9; k++) { const a = (k + (r % 2) * .5) / 9 * 6.283; const d = new THREE.SphereGeometry(.13, 8, 6); d.scale(1, 1.2, .35); const o = new THREE.Object3D(); o.position.set(Math.cos(a) * R * .99, .26 + r * H * .21, Math.sin(a) * R * .99); o.lookAt(o.position.x * 3, o.position.y, o.position.z * 3); o.updateMatrix(); d.applyMatrix4(o.matrix); L.push(d); }
    const dm = new THREE.Mesh(mergeGeometries(L), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .02, transparent: true, opacity: .2, depthWrite: false, envMapIntensity: 2.5 })); dm.userData.noOutline = true; dm.renderOrder = 4; g.add(dm); }
  const base = cyl(R * .98, R, .14, new THREE.MeshStandardMaterial({ color: 0xe8f6ff, roughness: .05, transparent: true, opacity: .5, depthWrite: false }), 28, g, 0, .07, 0); base.userData.noOutline = true;
  const lip = new THREE.Mesh(new THREE.TorusGeometry(R * .99, .035, 6, 28), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .05, transparent: true, opacity: .55 })); lip.rotation.x = Math.PI / 2; lip.position.y = H; lip.userData.noOutline = true; g.add(lip);
  // asa
  const hm = new THREE.MeshStandardMaterial({ color: 0xeaf6ff, roughness: .04, transparent: true, opacity: .45, depthWrite: false });
  const ha = new THREE.Mesh(new THREE.TorusGeometry(.38, .1, 10, 18, Math.PI), hm); ha.rotation.z = -Math.PI / 2; ha.position.set(R + .02, H * .55, 0); ha.userData.noOutline = true; g.add(ha);
  // cerveza, espuma y burbujas
  const beer = cyl(R * .9, R * .86, 1, beerM(), 24, g, 0, .5, 0); beer.userData.noOutline = true;
  const foam = new THREE.Group(); g.add(foam); const fm = foamM(); const fr = RNG(3); { const L = [new THREE.CylinderGeometry(R * .92, R * .92, .26, 24)];
  for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; const sg = new THREE.SphereGeometry(.16 + fr() * .07, 10, 8); sg.translate(Math.cos(a) * R * .72, .12 + fr() * .06, Math.sin(a) * R * .72); L.push(sg); } const sg = new THREE.SphereGeometry(.26, 12, 8); sg.translate(.06, .16, -.05); L.push(sg);
  const fmh = new THREE.Mesh(mergeGeometries(L.map(x => x.toNonIndexed())), fm); fmh.castShadow = true; foam.add(fmh); }
  const drip = []; for (let k = 0; k < 5; k++) { const d = sphere(.12, fm, g, 0, 0, 0, 8, 6); d.visible = false; drip.push(d); }
  const BUB = []; for (let k = 0; k < 6; k++) { const b = sphere(.03, new THREE.MeshBasicMaterial({ color: 0xfff6d0 }), g, 0, 0, 0, 6, 4); b.userData.noOutline = true; b.castShadow = false; BUB.push(b); }
  g.userData = { H, R, beer, foam,
    level(k, T = 0) { k = clamp(k); beer.visible = k > .02; const bh = Math.max(.01, (H - .24) * k); beer.scale.y = bh; beer.position.y = .14 + bh / 2; foam.visible = k > .05; foam.position.y = .14 + bh + .1; foam.scale.set(1, .6 + k * .5, 1);
      BUB.forEach((b, i) => { const r = RNG(i * 7 + 1); b.visible = k > .1; b.position.set((r() - .5) * R, .2 + ((T * (.5 + r() * .5) + r()) % 1) * bh, (r() - .5) * R); }); },
    over(k, T = 0) { drip.forEach((d, i) => { d.visible = k > 0; const a = i / 5 * 6.283 + .4, t = ((T * .8 + i * .21) % 1); d.position.set(Math.cos(a) * (R + .05), H + .1 - t * H * .9 * k, Math.sin(a) * (R + .05)); d.scale.set(1, 1.6, 1); }); } };
  g.userData.level(1); return g; }

// ---------- botella con etiqueta ----------
// brand: 'WEIHENSTEPHANER' | 'PAULANER' | 'BILLIG' — colores propios (no son los logos reales: solo el nombre en la etiqueta)
const BR = { WEIHENSTEPHANER: { glass: 0x5a2a08, lab: '#f4f0e4', ink: '#123a7a', band: '#c8a24a', sub: 'SEIT 1040' }, PAULANER: { glass: 0x4a2408, lab: '#ffffff', ink: '#16367a', band: '#2a5ab8', sub: 'MÜNCHEN' }, BILLIG: { glass: 0x2a5a2a, lab: '#d8d8d0', ink: '#6a6a6a', band: '#9a9a9a', sub: 'NO NAME' } };
export function bottle(parent, brand = 'WEIHENSTEPHANER', o = {}) { const g = new THREE.Group(); if (parent) parent.add(g); const b = BR[brand];
  const gm = mat(b.glass, { roughness: .08, metalness: .2, transparent: true, opacity: .92, envMapIntensity: 1.6 });
  cyl(.36, .36, 1.5, gm, 20, g, 0, .75, 0); const sh_ = cyl(.13, .36, .5, gm, 20, g, 0, 1.75, 0); cyl(.13, .13, .55, gm, 14, g, 0, 2.25, 0); cyl(.15, .15, .1, mat(0xd8c060, { metalness: .9, roughness: .3 }), 14, g, 0, 2.55, 0);
  const lab = textPlane(1.15, .95, 230, 190, (c, w, h) => { c.fillStyle = b.lab; c.fillRect(0, 0, w, h); c.fillStyle = b.band; c.fillRect(0, 0, w, 18); c.fillRect(0, h - 18, w, 18); c.strokeStyle = b.ink; c.lineWidth = 3; c.strokeRect(8, 24, w - 16, h - 48);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = b.ink; let fs = 34; c.font = `700 ${fs}px ${FONT}`; while (c.measureText(brand).width > w - 24) { fs -= 2; c.font = `700 ${fs}px ${FONT}`; } c.fillText(brand, w / 2, h / 2 - 10);
    c.font = `700 22px ${FONT}`; c.fillStyle = b.band === '#9a9a9a' ? '#6a6a6a' : '#b8902a'; c.fillText(b.sub, w / 2, h / 2 + 30); });
  const lg = new THREE.CylinderGeometry(.365, .365, .95, 24, 1, true, -Math.PI / 2.6, Math.PI / 1.3); const lm = lab.material; lm.side = THREE.DoubleSide; lab.geometry.dispose(); lab.geometry = lg; lab.position.y = .8; lab.rotation.y = Math.PI; g.add(lab);
  const neckL = textPlane(.3, .26, 60, 52, (c, w, h) => { c.fillStyle = b.band; c.fillRect(0, 0, w, h); }); neckL.position.set(0, 2.2, .135); g.add(neckL);
  g.scale.setScalar(o.s ?? 1); return g; }
// caja de botellas (20) con el nombre en el lateral
export function crate(parent, brand = 'WEIHENSTEPHANER', o = {}) { const g = new THREE.Group(); if (parent) parent.add(g); const col = { WEIHENSTEPHANER: 0x1a3a8a, PAULANER: 0xf4f4f4, BILLIG: 0x6a6a6a }[brand];
  const m = mat(col, { roughness: .5 }); box(3.6, 1.6, 2.8, m, .12, g, 0, .8, 0); const s = textPlane(3.2, .7, 320, 70, (c, w, h) => { c.fillStyle = brand === 'PAULANER' ? '#16367a' : '#ffffff'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; let f = 40; while (c.measureText(brand).width > w - 10) { f -= 2; c.font = `700 ${f}px ${FONT}`; } c.fillText(brand, w / 2, h / 2 + 2); }); s.position.set(0, 1.0, 1.41); g.add(s);
  if (o.bottles !== false) for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const b = bottle(g, brand, { s: .5 }); b.position.set(-1.25 + i * .83, .9, -.85 + j * .85); }
  return g; }
// Bierdeckel (posavasos) con un borde dentado y un dibujo
export function deckel(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g);
  const t = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(128, 128, 126, 0, 7); c.fill(); c.fillStyle = o.col || '#2a5ab8'; c.beginPath(); c.arc(128, 128, 104, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(128, 128, 90, 0, 7); c.fill();
    c.fillStyle = o.col || '#2a5ab8'; c.font = `700 46px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.text || 'PROST!', 128, 118); c.font = `700 26px ${FONT}`; c.fillText('BIERDECKEL', 128, 166); });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .08, 40), [mat(0xe8e4d8), mat(0xffffff, { map: t, roughness: .8 }), mat(0xffffff, { map: t, roughness: .8 })]); m.castShadow = true; g.add(m); g.scale.setScalar(o.s ?? 1); return g; }
// barril de madera con aros
export function fass(parent, o = {}) { const g = new THREE.Group(); if (parent) parent.add(g);
  const wt = canvasTex(256, 128, (c, w, h) => { const r = RNG(8); for (let x = 0; x < w; x += 16) { c.fillStyle = `hsl(${26 + r() * 8},${48 + r() * 10}%,${30 + r() * 10}%)`; c.fillRect(x, 0, 16, h); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x, 0, 1.5, h); } });
  const geo = new THREE.CylinderGeometry(1.6, 1.6, 3.6, 24, 6); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i), k = 1 + .16 * (1 - (y / 1.8) ** 2); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } geo.computeVertexNormals();
  const b = new THREE.Mesh(geo, mat(0xffffff, { map: wt, roughness: .75 })); b.castShadow = b.receiveShadow = true; b.position.y = 1.8; g.add(b);
  for (const y of [.35, 1.1, 2.5, 3.25]) { const k = 1 + .16 * (1 - ((y - 1.8) / 1.8) ** 2); const r = new THREE.Mesh(new THREE.TorusGeometry(1.6 * k, .07, 6, 30), mat(0x2a2a2e, { metalness: .7, roughness: .4 })); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); }
  cyl(1.6, 1.6, .05, mat(0x8a5a2a, { roughness: .8 }), 24, g, 0, 3.6, 0); if (o.open) { const beer = cyl(1.5, 1.5, .05, beerM(), 24, g, 0, 3.55, 0); }
  g.scale.setScalar(o.s ?? 1); return g; }

// ---------- goldener Krug (tapa abatible, grabado, gemas) ----------
export function goldKrug(parent) { const g = new THREE.Group(); if (parent) parent.add(g); const H = 1.7, R = .58;
  const gt = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#a8700a'); gr.addColorStop(.35, '#ffe48a'); gr.addColorStop(.6, '#e8b030'); gr.addColorStop(1, '#8a5a08'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(90,50,0,.6)'; c.lineWidth = 3; for (let y = 30; y < h; y += 46) { c.beginPath(); for (let x = 0; x <= w; x += 8) c.lineTo(x, y + Math.sin(x / 14) * 6); c.stroke(); } });
  const gm = new THREE.MeshStandardMaterial({ map: gt, metalness: .95, roughness: .2, emissive: 0x6a4000, emissiveIntensity: .25, envMapIntensity: 1.8 });
  const body = cyl(R, R * 1.08, H, gm, 32, g, 0, H / 2, 0); cyl(R * 1.18, R * 1.18, .16, gm, 32, g, 0, .08, 0); cyl(R * 1.08, R * 1.08, .12, gm, 32, g, 0, H - .04, 0);
  const ha = new THREE.Mesh(new THREE.TorusGeometry(.42, .11, 10, 18, Math.PI), gm); ha.rotation.z = -Math.PI / 2; ha.position.set(R + .04, H * .55, 0); g.add(ha);
  const lid = new THREE.Group(); lid.position.set(R * .6, H, 0); g.add(lid); const lm = cyl(R * 1.1, R * 1.1, .14, gm, 32, lid, -R * .6, .07, 0); const kn = sphere(.13, gm, lid, -R * .6, .24, 0, 12, 8); box(.3, .3, .1, gm, .04, lid, .15, .1, 0);
  const gems = []; for (let k = 0; k < 5; k++) { const a = -.9 + k * .45; const s = sphere(.075, mat([0xff2a3a, 0x2a8aff, 0x2ad86a][k % 3], { emissive: [0xff2a3a, 0x2a8aff, 0x2ad86a][k % 3], emissiveIntensity: .7, roughness: .1 }), g, Math.sin(a) * R * 1.03, H * .82, Math.cos(a) * R * 1.03, 10, 8); gems.push(s); }
  const plaque = textPlane(.82, .5, 200, 120, (c, w, h) => { c.fillStyle = '#3a2200'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd860'; c.lineWidth = 5; c.strokeRect(5, 5, w - 10, h - 10); c.fillStyle = '#ffd860'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 30px ${FONT}`; c.fillText('WARNUNG', w / 2, 34); c.font = `700 17px ${FONT}`; c.fillText('NIEMALS MEHR', w / 2, 68); c.fillText('ALS EIN BIER', w / 2, 92); });
  const pg = new THREE.CylinderGeometry(R + .012, R + .012, .5, 20, 1, true, -.7, 1.4); plaque.geometry.dispose(); plaque.geometry = pg; plaque.material.side = THREE.DoubleSide; plaque.position.y = H * .45; g.add(plaque);
  const beer = cyl(R * .92, R * .92, .02, beerM(), 24, g, 0, H - .1, 0); beer.userData.noOutline = true; beer.visible = false;
  const foam = new THREE.Group(); g.add(foam); const fm = foamM(); for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283; sphere(.18, fm, foam, Math.cos(a) * R * .7, 0, Math.sin(a) * R * .7, 10, 8); } sphere(.26, fm, foam, 0, .06, 0, 12, 8); foam.position.y = H; foam.visible = false;
  g.userData = { body, lid, gm, gems, beer, foam, H, R, setLid(a) { lid.rotation.z = a; }, setGlow(k) { gm.emissiveIntensity = .25 + k * 1.6; gm.emissive.setRGB(.42 + k * .5, .25 + k * .1, 0); }, fill(k) { foam.visible = beer.visible = k > .02; foam.position.y = H - .05 + k * .05; foam.scale.setScalar(.6 + k * .5); } };
  return g; }

// ---------- Bierzähler: cordón al cuello y colgante con pantalla en el pecho ----------
export function neckMeter(ch) { const g = new THREE.Group(); ch.spine.add(g); g.position.set(0, 1.55, .6);
  const cord = mat(0x1a1a22, { roughness: .5 }); for (const s of [-1, 1]) { const c = box(.09, .62, .09, cord, .03, g, s * .34, .3, -.04); c.rotation.z = s * .5; }
  box(1.02, .66, .14, mat(0x22262e, { metalness: .6, roughness: .3 }), .07, g, 0, 0, 0); box(.12, .1, .1, mat(0xd8a020, { metalness: .9 }), .02, g, 0, .36, 0);
  let key = ''; const t = canvasTex(256, 160, () => {}); const scr = new THREE.Mesh(new THREE.PlaneGeometry(.88, .55), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); scr.position.z = .075; g.add(scr);
  g.userData.set = (n, e, col = '#7aff9a', alarm = 0) => { const k = n + '|' + e + col + alarm; if (k === key) return; key = k; const c = t.image.getContext('2d'); c.fillStyle = alarm ? '#3a0408' : '#06100a'; c.fillRect(0, 0, 256, 160);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 26px ${FONT}`; c.fillStyle = '#9aa4c0'; c.fillText('BIERZÄHLER', 128, 24);
    c.font = `700 52px ${FONT}`; c.fillStyle = alarm ? '#ff4a4a' : col; let s = String(n); if (c.measureText(s).width > 236) c.font = `700 ${Math.floor(52 * 236 / c.measureText(s).width)}px ${FONT}`; c.fillText(s, 128, 72);
    c.font = `700 34px ${FONT}`; c.fillStyle = '#ffffff'; s = String(e); if (c.measureText(s).width > 240) c.font = `700 ${Math.floor(34 * 240 / c.measureText(s).width)}px ${FONT}`; c.fillText(s, 128, 128); t.needsUpdate = true; };
  g.userData.set('0 Bier', '0 €'); g.visible = false; return g; }

// HUD 2D (arriba): «BIERZÄHLER» con cervezas y euros
export function drawHUD(c, x, y, sc, n, eur, col = '#7aff9a', alpha = 1) { c.save(); c.globalAlpha = alpha; c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = 'rgba(10,14,24,.88)'; c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.beginPath(); c.roundRect(-340, -80, 680, 160, 32); c.fill(); c.stroke();
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 30px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('BIERZÄHLER', 0, -50);
  // jarrita
  c.save(); c.translate(-280, 18); c.fillStyle = '#f6a81c'; c.fillRect(-22, -22, 44, 50); c.fillStyle = '#fffbf0'; c.beginPath(); c.arc(-12, -24, 13, 0, 7); c.arc(4, -28, 15, 0, 7); c.arc(18, -22, 11, 0, 7); c.fill(); c.strokeStyle = '#ffffff'; c.lineWidth = 6; c.beginPath(); c.arc(24, 4, 12, -1.4, 1.4); c.stroke(); c.restore();
  c.font = `700 60px ${FONT}`; c.textAlign = 'left'; c.fillStyle = col; c.fillText(n, -240, 18);
  c.textAlign = 'right'; c.fillStyle = '#ffffff'; const w = c.measureText(eur).width; if (w > 330) { c.save(); c.translate(310, 18); c.scale(330 / w, 1); c.fillText(eur, 0, 0); c.restore(); } else c.fillText(eur, 310, 18);
  c.restore(); }

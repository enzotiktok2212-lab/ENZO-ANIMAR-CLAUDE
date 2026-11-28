// NAMEN — reparto propio (nadie se parece al vídeo de referencia).
// Ich (Huss, ≈12): rizos pelirrojos, sudadera verde menta con cordones blancos, vaqueros grises, zapatillas blancas con suela roja, pecas.
// Der Junge im blauen Hoodie (≈13): pelo negro corto, cinta blanca en la frente, sudadera azul royal con rayas blancas en las mangas, pantalón corto negro, medias blancas.
// Bürgermeister Genau (≈60): redondo, pelo gris peinado hacia atrás, bigote gris, traje verde botella, Amtskette dorada, gafas pequeñas.
// Krass (≈25): melena platino larga, americana lila, pantalón blanco, gafas de sol doradas, bolso dorado.
// Digga (≈28): enorme, gorra roja del revés, camiseta de tirantes negra «DIGGA», muñequeras rojas, joggers grises, barba corta.
// Baby Boah: pelele azul cielo, babero dorado «BOAH», un mechón rubio. Mama: media melena castaña, rebeca mostaza.
// Der Nieser: señor mayor con sombrero de fieltro y abrigo beige. Döner (≈11): gorra amarilla, camiseta roja.
import { THREE, mat, box, cyl, sphere, textPlane } from './engine.js';
import { mk, hairS, glasses, mustache, cap, shades } from './props.js';
import { FONT } from './sets.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const fin = o => { o.root.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
const label = (w, h, text, bg, fg, size) => textPlane(w, h, Math.round(w * 128), Math.round(h * 128), (c, W, H) => { if (bg) { c.fillStyle = bg; c.fillRect(0, 0, W, H); } c.fillStyle = fg; c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, W / 2, H / 2 + 4); });
// sudadera con capucha, cordones, bolsillo canguro y puños; rayas opcionales en las mangas (se ponen en los brazos)
const sudadera = (col, str = 0xffffff) => sp => { const j = mat(col, { roughness: .9 }); box(2.1, 2.06, 1.12, j, .16, sp, 0, 1.0, -.02); box(1.3, .55, .12, j, .1, sp, 0, .48, .57);
  for (const s of [-1, 1]) { cyl(.04, .04, .7, mat(str), 6, sp, s * .22, 1.6, .6); sphere(.07, mat(str), sp, s * .22, 1.24, .6, 6, 4); }
  const hd = box(1.6, .62, .62, j, .22, sp, 0, 2.02, -.56); hd.rotation.x = .3; box(2.14, .28, 1.16, mat(col, { roughness: 1 }), .1, sp, 0, .14, -.02); };
const mangas = col => o => { for (const a of [o.aL, o.aR]) { for (const y of [-.2, -.42]) { const r = cyl(.43, .43, .1, mat(col), 12, a.el || a.sh, 0, y, 0); } } };
const stirnband = (col = 0xffffff) => o => { const r = new THREE.Mesh(new THREE.TorusGeometry(.7, .1, 6, 28), mat(col, { roughness: .9 })); r.rotation.x = Math.PI / 2; r.position.set(0, 1.08, 0); o.head.add(r); };
const anzug = (col, shirt, tie) => sp => { const j = mat(col, { roughness: .5 }); box(2.12, 2.06, 1.16, j, .14, sp, 0, 1.02, -.02); box(.62, 1.15, .06, mat(shirt), .02, sp, 0, 1.48, .58); box(.2, .95, .05, mat(tie), .02, sp, 0, 1.42, .62);
  for (const s of [-1, 1]) { const l = box(.36, 1.2, .08, j, .03, sp, s * .42, 1.5, .62); l.rotation.z = s * .3; for (let k = 0; k < 2; k++) sphere(.07, mat(0xd8b040, { metalness: .8, roughness: .3 }), sp, s * .18, .5 + k * .4, .6, 6, 4); } box(2.4, 1.0, 1.4, j, .4, sp, 0, .6, .05); };
const amtskette = sp => { const gm = mat(0xffd23f, { metalness: .9, roughness: .18, emissive: 0x5a3a00, emissiveIntensity: .25 }); for (let k = 0; k < 13; k++) { const a = Math.PI * (k / 12), x = Math.cos(a) * .72, y = 2.05 - Math.sin(a) * .62; const l = box(.18, .12, .1, gm, .03, sp, x, y, .62); l.rotation.z = a; }
  const m = cyl(.32, .32, .08, gm, 20, sp, 0, 1.32, .66); m.rotation.x = Math.PI / 2; };
const blazer = (col, inner) => sp => { const j = mat(col, { roughness: .45 }); box(.6, 2.0, .06, mat(inner), .02, sp, 0, 1.05, .57); for (const s of [-1, 1]) { box(.76, 2.06, 1.14, j, .12, sp, s * .66, 1.02, 0); const l = box(.3, 1.1, .08, j, .03, sp, s * .36, 1.5, .6); l.rotation.z = s * .35; } box(2.1, 2.06, .5, j, .1, sp, 0, 1.02, -.32); sphere(.08, mat(0xffd23f, { metalness: .9 }), sp, .3, .9, .62, 6, 4); };
const tank = (col, text) => sp => { box(2.12, 2.06, 1.14, mat(col, { roughness: .8 }), .14, sp, 0, 1.0, 0); if (text) { const p = label(1.6, .5, text, null, '#ff3a3a', 52); p.position.set(0, 1.25, .58); sp.add(p); } };
const rebeca = (col, inner) => sp => { box(2.1, 2.06, 1.12, mat(inner, { roughness: .8 }), .14, sp, 0, 1.02, 0); const j = mat(col, { roughness: 1 }); for (const s of [-1, 1]) box(.78, 2.0, 1.16, j, .1, sp, s * .66, 1.0, 0); box(2.14, 2.0, .5, j, .1, sp, 0, 1.0, -.34); for (let k = 0; k < 4; k++) sphere(.07, mat(0x6a4a2a), sp, .32, .4 + k * .42, .6, 6, 4); };
const mantel = col => sp => { const j = mat(col, { roughness: .8 }); box(2.2, 2.1, 1.2, j, .16, sp, 0, 1.0, 0); box(2.3, 1.2, 1.3, j, .2, sp, 0, -.3, 0); for (const s of [-1, 1]) { const l = box(.4, 1.0, .08, mat(0xb89a6a), .03, sp, s * .4, 1.6, .62); l.rotation.z = s * .4; } for (let k = 0; k < 3; k++) sphere(.08, mat(0x3a2a1a), sp, .32, .3 + k * .5, .64, 6, 4); };
function hut(head, col = 0x5a4a3a, band = 0x2a1a10) { const g = new THREE.Group(); g.position.y = 1.25; head.add(g); cyl(1.1, 1.1, .1, mat(col, { roughness: .8 }), 24, g, 0, 0, 0); cyl(.7, .76, .8, mat(col, { roughness: .8 }), 20, g, 0, .45, 0); cyl(.77, .77, .2, mat(band), 20, g, 0, .15, 0); }
function capBack(head, col, front = 0xffffff) { const g = new THREE.Group(); head.add(g); g.rotation.y = Math.PI; cap(g, col, front); }
const bart = (col, k = 1) => o => { const m = mat(col, { roughness: 1 }); box(1.1 * k, .45, .4, m, .2, o.head, 0, -.62, .5); for (const s of [-1, 1]) box(.28, .7, .4, m, .12, o.head, s * .58, -.25, .42); };
function brille(head) { glasses(head); }
const goldTasche = o => { const g = new THREE.Group(); o.aL.hand.add(g); g.position.set(0, -.9, .1); box(1.0, .8, .4, mat(0xffd23f, { metalness: .85, roughness: .2 }), .12, g, 0, 0, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.32, .05, 6, 16, Math.PI), mat(0xffd23f, { metalness: .9, roughness: .2 })); h.position.y = .4; g.add(h); o.props.tasche = g; };
// etiqueta de nombre en el pecho (HALLO ICH BIN … HUSS): se enseña bajo demanda
function nameTag(o) { const p = textPlane(.95, .7, 190, 140, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(0, 0, w, h, 14); c.fill(); c.fillStyle = '#d8202a'; c.beginPath(); c.roundRect(0, 0, w, 46, [14, 14, 0, 0]); c.fill(); c.fillStyle = '#fff'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('HALLO, ICH BIN', w / 2, 24); c.fillStyle = '#1a1a1a'; c.font = `700 58px ${FONT}`; c.fillText('HUSS', w / 2, 96); });
  p.position.set(-.5, 1.45, .62); p.visible = false; o.spine.add(p); o.props.tag = p; }

export function makeIch(scene) { const o = fin(mk(scene, S({ seed: 9801, scale: .84, skin: 0xf6d2b4, shirt: 0x5ad8a8, shirt2: 0x5ad8a8, cuffs: 0x3ab888, pants: 0x6a6e78, shoes: 0xf4f4f4, sole: 0xd8202a, hair: 0xc8541a, hairBuild: hairS(0xc8541a, 'curly'),
  torsoDetail: sudadera(0x5ad8a8), face: { iris: '#3a7a4a', browColor: '#a8441a', blush: .55, freckles: 1 } }))); nameTag(o); return o; }
export function makeBlau(scene) { return fin(mk(scene, S({ seed: 9802, scale: .88, skin: 0xc68b5e, shirt: 0x1a4ad8, shirt2: 0x1a4ad8, cuffs: 0xffffff, pants: 0x16161c, shorts: true, socks: 0xffffff, shoes: 0x16161c, sole: 0xffffff, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'fringe'),
  torsoDetail: sudadera(0x1a4ad8), face: { iris: '#2a1a10', browColor: '#1a120c', blush: .25 } }), [stirnband(0xffffff), mangas(0xffffff)])); }
export function makeGenau(scene) { return fin(mk(scene, S({ seed: 9803, scale: 1.0, skin: 0xf0c0a0, shirt: 0x1e5a3a, shirt2: 0x1e5a3a, cuffs: 0x16482e, pants: 0x1e5a3a, shoes: 0x1a1a1a, hair: 0xb8b8c0, hairBuild: hairS(0xb8b8c0, 'swoop'),
  torsoDetail: sp => { anzug(0x1e5a3a, 0xffffff, 0xd8202a)(sp); amtskette(sp); }, face: { iris: '#4a6a8a', browColor: '#a8a8b0', blush: .6, bags: .2 } }), [o => mustache(o.head, 0xb8b8c0), o => brille(o.head)])); }
export function makeKrass(scene) { return fin(mk(scene, S({ seed: 9804, scale: .92, skin: 0xf2c8a8, shirt: 0x9a5ad8, shirt2: 0x9a5ad8, cuffs: 0x8a4ac8, pants: 0xf4f4f4, shoes: 0xffd23f, sole: 0xd8a820, hair: 0xf4ecd8, hairBuild: hairS(0xf4ecd8, 'long'),
  torsoDetail: blazer(0x9a5ad8, 0xf4f4f4), face: { iris: '#3a6ab8', browColor: '#c8b898', blush: .5, lashes: 1 } }), [o => { const g = new THREE.Group(); g.position.y = .55; o.head.add(g); shades(g, 0x2a1a00, 0xffd23f); }, goldTasche])); }
export function makeDigga(scene) { return fin(mk(scene, S({ seed: 9805, scale: 1.12, skin: 0xd8a07a, shirt: 0x16161c, shirt2: 0xd8a07a, cuffs: 0xd8a07a, pants: 0x7a7e88, shoes: 0xf4f4f4, sole: 0x16161c, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'plain'), sleeveShort: true,
  torsoDetail: tank(0x16161c, 'DIGGA'), face: { iris: '#3a2a1a', browColor: '#2a1a10', blush: .3 } }), [o => capBack(o.head, 0xd8202a, 0xffffff), bart(0x2a1a10, .9), o => { for (const a of [o.aL, o.aR]) cyl(.46, .46, .3, mat(0xd8202a, { roughness: .9 }), 12, a.el || a.sh, 0, -.62, 0); }])); }
export function makeBoah(scene) { const o = fin(mk(scene, S({ seed: 9806, scale: .4, skin: 0xf6d6bc, shirt: 0x8ad0ff, shirt2: 0x8ad0ff, cuffs: 0x8ad0ff, pants: 0x8ad0ff, shoes: 0x8ad0ff, sole: 0x8ad0ff, hair: 0xf2cc50,
  hairBuild: h => { const m = mat(0xf2cc50, { roughness: .6 }); const t = new THREE.Mesh(new THREE.ConeGeometry(.18, .55, 6), m); t.position.set(0, 1.42, .1); t.rotation.z = -.4; h.add(t); }, face: { iris: '#3a6a9a', blush: .8 } })));
  const b = textPlane(1.2, 1.0, 180, 150, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.ellipse(w / 2, h / 2, w / 2 - 4, h / 2 - 4, 0, 0, 7); c.fill(); c.strokeStyle = '#b8860b'; c.lineWidth = 8; c.stroke(); c.fillStyle = '#5a3a00'; c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('BOAH', w / 2, h / 2 + 3); });
  b.position.set(0, 1.35, .6); o.spine.add(b); return o; }
export function makeMama(scene) { return fin(mk(scene, S({ seed: 9807, scale: .92, skin: 0xf6d2b4, shirt: 0xf4f0e4, shirt2: 0xe8b030, cuffs: 0xe8b030, pants: 0x3a4a6a, shoes: 0x8a5a2a, hair: 0x6a3a1a, hairBuild: hairS(0x6a3a1a, 'long'),
  torsoDetail: rebeca(0xe8b030, 0xf4f0e4), face: { iris: '#3a7a4a', browColor: '#5a2a10', blush: .5, lashes: 1 } }))); }
export function makeNieser(scene) { return fin(mk(scene, S({ seed: 9808, scale: .96, skin: 0xeec0a0, shirt: 0xc8b088, shirt2: 0xc8b088, cuffs: 0xb89a70, pants: 0x4a4a52, shoes: 0x3a2418, hair: 0xd8d8d8, hairBuild: hairS(0xd8d8d8, 'bald'),
  torsoDetail: mantel(0xc8b088), face: { iris: '#4a6a7a', browColor: '#d8d8d8', blush: .7, bags: .25 } }), [o => hut(o.head), o => mustache(o.head, 0xe8e8e8)])); }
export function makeDoener(scene) { return fin(mk(scene, S({ seed: 9809, scale: .76, skin: 0xd8a07a, shirt: 0xd8202a, shirt2: 0xd8202a, cuffs: 0xd8202a, pants: 0x2a3a5a, shoes: 0xffd23f, sole: 0xffffff, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'fringe'), sleeveShort: true,
  torsoDetail: tank(0xd8202a), face: { iris: '#2a1a10', browColor: '#1a120c', blush: .4 } }), [o => cap(o.head, 0xffd23f, 0xd8202a)])); }

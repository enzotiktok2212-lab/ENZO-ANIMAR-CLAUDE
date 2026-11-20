// ZOCKEN — reparto propio (nadie se parece al vídeo de referencia):
// Malte (mi colega, jugón): pelo rubio despeinado, cascos verdes, sudadera verde lima con capucha.
// Bäcker Bernd: gorro de panadero alto, bigote, delantal blanco con harina, mangas remangadas.
// Postbote Ömer: gorra azul, polo amarillo, cartera de mensajero marrón, pantalón azul.
// Kickelsdorf: camisetas azules con números blancos (el capitán con brazalete es makeKapitaen de hvolk).
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, headphones, cap, mustache, hoodie } from './props.js';
import { FONT } from './sets.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const numT = (bg, fg, n) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = 'rgba(0,0,0,.35)'; c.strokeText(n, w / 2, h / 2 + 8); c.fillStyle = fg; c.fillText(n, w / 2, h / 2 + 8); });
const jersey = (col, collar, n) => sp => { const t = numT(hex(col), '#ffffff', n); box(2.1, 2.08, 1.12, mat(col, { roughness: .6 }), .14, sp, 0, 1.02, 0); const f = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), mat(0xffffff, { map: t, transparent: true, roughness: .6 })); f.position.set(0, 1.0, .575); sp.add(f);
  const b = f.clone(); b.position.set(0, 1.05, -.575); b.rotation.y = Math.PI; sp.add(b); box(2.12, .3, 1.14, mat(collar), .05, sp, 0, 1.95, 0); box(2.14, .2, 1.16, mat(collar), .04, sp, 0, .1, 0); };
const boots = o => { for (const lg of [o.lL, o.lR]) { for (let k = 0; k < 3; k++) box(.18, .08, .18, mat(0xd8dce4), .02, lg.kn, -.3 + k * .3, -1.08, .14); } };
const bakerHat = o => { const m = mat(0xffffff, { roughness: .9 }); cyl(.74, .74, .5, m, 20, o.head, 0, 1.25, 0); const p = sphere(.95, m, o.head, 0, 2.0, 0, 16, 10); p.scale.set(1, .75, 1); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; sphere(.45, m, o.head, Math.cos(a) * .6, 1.9, Math.sin(a) * .6, 10, 8); } };
const mailBag = o => { const b = mat(0x8a5a2a, { roughness: .8 }); box(1.3, 1.1, .5, b, .1, o.spine, 1.0, .5, .55); const s = box(.18, 2.6, .1, b, .02, o.spine, .1, 1.2, .62); s.rotation.z = .62; box(.4, .3, .06, mat(0xffd23f), .02, o.spine, 1.0, .7, .82); };
const messy = col => h => { const m = mat(col, { roughness: .8 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.05, .62, 1.05); h.add(c);
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; const sp = new THREE.Mesh(new THREE.ConeGeometry(.2, .55, 5), m); sp.position.set(Math.cos(a) * .48, 1.3, Math.sin(a) * .48); sp.rotation.set(Math.sin(a) * .9, 0, -Math.cos(a) * .9); h.add(sp); }
  for (let i = -2; i <= 2; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(.16, .5, 5), m); f.position.set(i * .22, 1.1, .62); f.rotation.x = 1.9; h.add(f); } };

export function makeMalte(scene) { return mk(scene, S({ seed: 6101, scale: .86, skin: 0xf2c8a8, shirt: 0x9ad83a, shirt2: 0x9ad83a, cuffs: 0x7ab82a, pants: 0x2a2a3a, shoes: 0xf4f4f4, sole: 0x9ad83a, hair: 0xe8c860, hairBuild: messy(0xe8c860),
  torsoDetail: hoodie(0x9ad83a, 0x2a2a3a), face: { iris: '#3a6a9a', browColor: '#c8a840', blush: .45, freckles: 1 } }), [o => headphones(o.head, 0x2ab86a)]); }
export function makeBaecker(scene) { return mk(scene, S({ seed: 6102, scale: 1.04, skin: 0xe8b08c, shirt: 0xf4f0e8, shirt2: 0xe8b08c, cuffs: 0xf4f0e8, pants: 0x4a4a52, shoes: 0x2a2a2a, hair: 0x3a2214, hairBuild: hairS(0x3a2214, 'plain'), sleeveShort: true,
  torsoDetail: sp => { box(2.12, 2.06, 1.14, mat(0xf4f0e8, { roughness: .9 }), .14, sp, 0, 1.02, 0); box(1.7, 1.9, .08, mat(0xffffff, { roughness: 1 }), .02, sp, 0, .8, .58); for (let k = 0; k < 5; k++) sphere(.14, mat(0xf8f4ec, { roughness: 1 }), sp, -.5 + k * .25, .4 + (k % 2) * .3, .63, 6, 4); box(.8, .5, .05, mat(0xe8dcc0), .02, sp, 0, .45, .63); },
  face: { iris: '#3a2a1a', browColor: '#2a1a10', blush: .6 } }), [o => mustache(o.head, 0x3a2214), bakerHat]); }
export function makePostbote(scene) { return mk(scene, S({ seed: 6103, scale: .98, skin: 0xb8784a, shirt: 0xffd21a, shirt2: 0xffd21a, cuffs: 0xe8b800, pants: 0x1e3a7a, shoes: 0x1a1a1a, hair: 0x1a1008, hairBuild: hairS(0x1a1008, 'plain'), sleeveShort: true,
  face: { iris: '#2a1a0a', browColor: '#1a1008', blush: .2 } }), [o => cap(o.head, 0x1e3a7a, 0xffd21a), mailBag]); }
// jugadores de Kickelsdorf (azul): piel, pelo y peinado distintos
const OSK = [0xf2c4a0, 0x8a5a3a, 0xeab08a, 0x6a4028, 0xf4cfb6, 0xc68b5e], OHC = [0x1a120c, 0xe0b850, 0x3a2214, 0x101010, 0xb8441a, 0x6a3a1a], OHS = ['spiky', 'fringe', 'curly', 'plain', 'swoop', 'pony'];
export function makeGegner(scene, i) { return mk(scene, S({ seed: 6200 + i, scale: .9 + (i % 3) * .05, skin: OSK[i % 6], shirt: 0x2a6ad8, shirt2: OSK[i % 6], cuffs: 0xffffff, pants: 0xffffff, shorts: true, socks: 0x2a6ad8, shoes: 0x1a1a1a, sole: 0xffffff, hair: OHC[i % 6], hairBuild: hairS(OHC[i % 6], OHS[i % 6]), sleeveShort: true,
  torsoDetail: jersey(0x2a6ad8, 0xffffff, String([3, 5, 7, 11, 14, 8, 2, 4, 6, 15][i % 10])), face: { iris: '#3a2410', browColor: hex(OHC[i % 6]), blush: .3 } }), [boots]); }

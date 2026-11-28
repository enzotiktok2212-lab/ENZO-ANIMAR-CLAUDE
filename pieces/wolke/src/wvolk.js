// WOLKE — reparto propio (nadie se parece al vídeo de referencia).
// Flocke (yo, ≈19): flequillo cortina rubio ceniza con raya al medio, sudadera oversize azul hielo con cordones, cargo beige, zapatillas blancas gordas, cadenita.
// Mein großer Bruder (≈24): fade con tupé texturizado negro (laterales rapados), plumífero negro con franjas naranjas, joggers grises, pendiente de aro, barba de tres días.
// Marlon von nebenan (≈22): mullet castaño cobrizo con mechas, gorra verde del revés, chándal verde botella con rayas blancas, cadena dorada, bigotito fino.
import { THREE, mat, box, cyl, sphere } from './engine.js';
import { mk, glasses, cap } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const fin = o => { o.root.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
// ---------- peinados modernos ----------
// flequillo cortina: casquete + dos cortinas que caen a los lados de la frente con raya al medio, nuca con volumen
const curtain = col => h => { const m = mat(col, { roughness: .55 });
  const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1, .7, 1); h.add(c);
  for (const s of [-1, 1]) { for (let k = 0; k < 4; k++) { const st = box(.34, .62 - k * .06, .16, m, .07, h, s * (.12 + k * .17), .98 - k * .03, .62 - k * .05); st.rotation.z = s * (.25 + k * .12); st.rotation.x = -.15; }
    const side = box(.22, .7, .8, m, .1, h, s * .7, .72, -.05); side.rotation.z = s * .05; }
  box(1.3, .7, .4, m, .16, h, 0, .7, -.58); for (let k = 0; k < 5; k++) { const t = new THREE.Mesh(new THREE.ConeGeometry(.16, .4, 5), m); t.position.set(-.5 + k * .25, 1.42, -.1 + (k % 2) * .2); t.rotation.set(-.3, 0, (k - 2) * .15); h.add(t); } };
// fade con tupé: laterales rapados (casquete bajo de tono más claro), tupé alto y desordenado arriba
const fade = (col, side) => h => { const m = mat(col, { roughness: .5 }), sm = mat(side, { roughness: .9 });
  const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 12, 0, 6.283, 0, 1.45), sm); c.position.y = .98; c.scale.set(1, .6, 1); h.add(c);
  const top = box(1.1, .42, 1.2, m, .18, h, 0, 1.32, .02); top.rotation.x = -.08;
  for (let k = 0; k < 11; k++) { const a = k / 11 * 6.283, t = new THREE.Mesh(new THREE.ConeGeometry(.17, .5, 5), m); t.position.set(Math.cos(a) * .36, 1.58, Math.sin(a) * .36 + .12); t.rotation.set(Math.sin(a) * .5 - .35, 0, -Math.cos(a) * .5); h.add(t); }
  const q = box(.7, .3, .4, m, .12, h, .12, 1.56, .52); q.rotation.set(-.6, 0, -.2); };
// mullet: casquete con flequillo corto, laterales cortos y melena por detrás hasta la nuca, con mechas
const mullet = (col, hl) => h => { const m = mat(col, { roughness: .55 }), mh = mat(hl, { roughness: .5 });
  const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1, .66, 1); h.add(c);
  box(1.3, .3, .3, m, .12, h, 0, 1.1, .6); for (let k = 0; k < 6; k++) box(.2, .9, .3, k % 2 ? mh : m, .08, h, -.55 + k * .22, .45, -.62);
  box(1.3, 1.0, .4, m, .18, h, 0, .45, -.55); for (const s of [-1, 1]) box(.16, .5, .7, m, .06, h, s * .72, .85, -.05); };
// ---------- ropa ----------
const sudadera = (col, str = 0xffffff) => sp => { const j = mat(col, { roughness: .9 }); box(2.16, 2.08, 1.16, j, .18, sp, 0, 1.0, -.02); box(1.3, .55, .12, j, .1, sp, 0, .46, .6);
  for (const s of [-1, 1]) { cyl(.04, .04, .7, mat(str), 6, sp, s * .22, 1.6, .62); sphere(.07, mat(str), sp, s * .22, 1.24, .62, 6, 4); }
  const hd = box(1.6, .62, .62, j, .22, sp, 0, 2.02, -.56); hd.rotation.x = .3; box(2.2, .28, 1.2, mat(col, { roughness: 1 }), .1, sp, 0, .14, -.02); };
const kette = (col = 0xd8d8e0, z = .62) => sp => { for (let k = 0; k < 11; k++) { const a = Math.PI * (k / 10), x = Math.cos(a) * .5, y = 2.0 - Math.sin(a) * .42; const l = box(.12, .08, .06, mat(col, { metalness: .9, roughness: .15 }), .02, sp, x, y, z); l.rotation.z = a; } };
const puffer = (col, str) => sp => { const j = mat(col, { roughness: .35, metalness: .05 }); for (let k = 0; k < 5; k++) box(2.22, .44, 1.22, j, .2, sp, 0, .2 + k * .42, 0);
  box(.06, 2.0, .05, mat(0xc8c8c8, { metalness: .8 }), .01, sp, 0, 1.02, .63); for (const s of [-1, 1]) box(.16, 2.0, .05, mat(str), .01, sp, s * .5, 1.02, .63);
  const col_ = box(1.4, .5, 1.0, j, .2, sp, 0, 2.1, -.05); col_.scale.z = 1; };
const chandal = (col, str) => sp => { const j = mat(col, { roughness: .6 }); box(2.12, 2.06, 1.14, j, .14, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.12, 2.0, .05, mat(str), .01, sp, s * .3, 1.02, .58);
  box(.06, 1.9, .05, mat(0xd8d8d8, { metalness: .8 }), .01, sp, 0, 1.02, .59); box(1.2, .4, 1.0, j, .14, sp, 0, 2.05, 0); };
const mangas = col => o => { for (const a of [o.aL, o.aR]) for (const y of [-.2, -.5]) cyl(.44, .44, .1, mat(col), 12, a.el || a.sh, 0, y, 0); };
const aro = o => { const r = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 14), mat(0xffd23f, { metalness: .9, roughness: .2 })); r.position.set(.74, .52, .05); r.rotation.y = Math.PI / 2; o.head.add(r); };
const stoppel = col => o => { const m = mat(col, { roughness: 1, transparent: true, opacity: .35 }); box(1.2, .55, .3, m, .2, o.head, 0, .28, .58); };
const bigote = col => o => { box(.6, .1, .1, mat(col, { roughness: .9 }), .04, o.head, 0, .5, .72); };
function capBack(head, col, front = 0xffffff) { const g = new THREE.Group(); head.add(g); g.rotation.y = Math.PI; cap(g, col, front); }

export function makeFlocke(scene) { return fin(mk(scene, S({ seed: 9901, scale: .9, skin: 0xf6d6bc, shirt: 0xa8d8f4, shirt2: 0xa8d8f4, cuffs: 0x88c0e8, pants: 0xc8b48a, shoes: 0xfafafa, sole: 0xd8d8d8, hair: 0xe0d4b4, hairBuild: curtain(0xe0d4b4),
  torsoDetail: sp => { sudadera(0xa8d8f4)(sp); kette()(sp); }, face: { iris: '#3a7ab8', browColor: '#b8a88a', blush: .45 } }))); }
export function makeBruder(scene) { return fin(mk(scene, S({ seed: 9902, scale: 1.04, skin: 0xe8b890, shirt: 0x16161c, shirt2: 0x16161c, cuffs: 0x16161c, pants: 0x7a7e88, shoes: 0x16161c, sole: 0xffffff, hair: 0x14100c, hairBuild: fade(0x14100c, 0x4a4038),
  torsoDetail: puffer(0x1a1a20, 0xff8a1a), face: { iris: '#3a2a1a', browColor: '#14100c', blush: .3 } }), [aro, stoppel(0x2a2018), mangas(0xff8a1a)])); }
export function makeMarlon(scene) { return fin(mk(scene, S({ seed: 9903, scale: .96, skin: 0xd8a07a, shirt: 0x1e6a3a, shirt2: 0x1e6a3a, cuffs: 0xffffff, pants: 0x1e6a3a, shoes: 0xffffff, sole: 0x1e6a3a, hair: 0x8a3a1a, hairBuild: mullet(0x8a3a1a, 0xe8a050),
  torsoDetail: sp => { chandal(0x1e6a3a, 0xffffff)(sp); kette(0xffd23f, .6)(sp); }, face: { iris: '#4a3a1a', browColor: '#6a2a10', blush: .3 } }), [o => capBack(o.head, 0x2ab86a, 0xffffff), bigote(0x5a2a10), mangas(0xffffff)])); }

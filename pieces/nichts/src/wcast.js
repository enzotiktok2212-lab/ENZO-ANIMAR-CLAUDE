// Wörter — reparto propio.
// Narrador (pelo pelirrojo en tazón, pecas, jersey mostaza con estrella, pana verde, zapatillas azules),
// Mama (piel oscura, moño alto con lápiz, cascos de call center, blusa lila y americana gris),
// Herr Wagner (alto, traje azul marino, corbata roja, tupé, estuche del anillo), Lena (rizos rubios, vestido rojo, bolso),
// la jefa (pelo gris corto, gafas, chaleco mostaza, carpeta), el vendedor de frascos (abrigo largo, barba gris, bombín).
import { THREE, mat, box, cyl, sphere, canvasTex, checkTex, RNG } from './engine.js';
import { mk, hairS, suit, jacket, glasses } from './props.js';

const brass = () => mat(0xc89a3a, { metalness: .75, roughness: .3 });
const star = canvasTex(64, 64, (c) => { c.fillStyle = '#e8b030'; c.fillRect(0, 0, 64, 64); c.fillStyle = '#fff6d8'; c.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283 - 1.57, r = k % 2 ? 11 : 26; c.lineTo(32 + Math.cos(a) * r, 34 + Math.sin(a) * r); } c.fill(); });
const knit = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 2; for (let x = 0; x < w; x += 8) for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y + 6); c.lineTo(x + 8, y); c.stroke(); } }, true);
const cord = (a) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.18)'; for (let x = 0; x < w; x += 6) c.fillRect(x, 0, 2, h); }, true);
function bowl(col) { return (h) => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 28, 14, 0, 6.283, 0, 1.45), m); c.position.y = .98; c.scale.set(1.04, .78, 1.04); h.add(c);
  box(1.44, .36, .3, m, .14, h, 0, 1.08, .52); for (let i = -2; i <= 2; i++) box(.26, .2, .12, m, .06, h, i * .27, .92, .64); const tuft = new THREE.Mesh(new THREE.ConeGeometry(.12, .5, 6), m); tuft.position.set(.15, 1.62, -.1); tuft.rotation.z = -.5; h.add(tuft); }; }
function bunHair(col) { return (h) => { const m = mat(col, { roughness: .45 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 28, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.03, .62, 1.03); h.add(c);
  box(1.38, .55, .3, m, .12, h, 0, .98, -.5); const b = sphere(.42, m, h, 0, 1.75, -.15, 16, 12); b.scale.y = .85; const p = cyl(.04, .04, 1.2, mat(0xf2c23a), 6, h, 0, 1.8, -.15); p.rotation.z = 1.2; for (const s of [-1, 1]) box(.22, .5, .6, m, .08, h, s * .66, .85, -.1); }; }
function curls(col) { return (h) => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 24, 12, 0, 6.283, 0, 1.4), m); c.position.y = 1.0; c.scale.set(1.06, .7, 1.06); h.add(c); const r = RNG(9);
  for (let i = 0; i < 30; i++) { const a = r() * 6.283, y = .2 + r() * 1.2; if (Math.sin(a) > .5 && y > .5 && y < 1.15) continue; sphere(.2 + r() * .08, m, h, Math.cos(a) * .72, y, Math.sin(a) * .62 - .05, 10, 8); } }; }
function headset(o) { const b = new THREE.Mesh(new THREE.TorusGeometry(.74, .06, 6, 24, Math.PI), mat(0x2a2a2e)); b.position.y = .72; o.head.add(b); for (const s of [-1, 1]) { const e = cyl(.3, .3, .2, mat(0x2a2a2e), 16, o.head, s * .74, .72, 0); e.rotation.z = Math.PI / 2; }
  const mic = cyl(.03, .03, .8, mat(0x2a2a2e), 6, o.head, -.62, .38, .4); mic.rotation.x = 1.2; sphere(.08, mat(0x1a1a1a), o.head, -.55, .25, .78, 8, 6); }
export function makeKid(scene) {
  return mk(scene, { seed: 501, scale: .8, skin: 0xf6d2b8, skinCss: '#f6d2b8', shirtMap: knit('#e8b030', 'rgba(0,0,0,.14)'), shirt2: 0xe8b030, cuffs: 0xc8901a, pants: 0x2f5a3a, shoes: 0x2a6ad8, sole: 0xf4f4f4, hair: 0xd8642a, hairBuild: bowl(0xd8642a), noBelt: true,
    torsoDetail: sp => { const p = new THREE.Mesh(new THREE.CircleGeometry(.38, 5), new THREE.MeshStandardMaterial({ map: star })); p.position.set(0, 1.25, .56); sp.add(p); box(1.1, .25, .1, mat(0xc8901a), .05, sp, 0, 1.98, .5); },
    face: { iris: '#3a7a4a', freckles: 1, blush: .4, browColor: '#a8481a' } }, [o => { for (const lg of [o.lL, o.lR]) { lg.hp.children[0].material = mat(0xffffff, { map: cord('#2f5a3a') }); } }]);
}
export function makeMama(scene) {
  return mk(scene, { seed: 502, skin: 0x8d5a3b, skinCss: '#8d5a3b', shirt: 0xb89ae0, shirt2: 0x6a6e78, cuffs: 0x5a5e68, pants: 0x2a2a30, shoes: 0x3a1a2a, hair: 0x141414, hairBuild: bunHair(0x141414),
    torsoDetail: sp => { const j = mat(0x6a6e78, { roughness: .6 }); for (const s of [-1, 1]) box(.72, 2.0, 1.12, j, .1, sp, s * .68, 1.0, 0); box(2.06, 2.0, .5, j, .1, sp, 0, 1.0, -.32); for (const s of [-1, 1]) { const l = box(.36, 1.1, .06, j, .02, sp, s * .42, 1.5, .58); l.rotation.z = s * .38; }
      const b = mat(0xb89ae0); box(.7, .3, .06, b, .02, sp, 0, 1.95, .56); const badge = box(.5, .3, .05, mat(0xffffff), .02, sp, -.7, 1.3, .6); },
    face: { iris: '#3a2210', bags: .7, browColor: '#141414', blush: .15 } }, [headset, o => { for (const s of [-1, 1]) sphere(.08, mat(0xf2d27a, { metalness: .8 }), o.head, s * .74, .45, 0, 8, 6); }]);
}
export function makeWagner(scene) {
  return mk(scene, { seed: 503, scale: 1.1, skin: 0xf2c8a8, skinCss: '#f2c8a8', shirt: 0x1d2a4a, shirt2: 0x1d2a4a, pants: 0x1d2a4a, shoes: 0x1a1a1a, hair: 0x5a3214, hairBuild: hairS(0x5a3214, 'swoop'), torsoDetail: suit(0x1d2a4a, 0xf4f4f4, 0xd8323a),
    face: { iris: '#5a3a22', browColor: '#5a3214' } }, [o => { const r = new THREE.Group(); o.aR.hand.add(r); r.position.set(0, -.55, .5); box(.6, .45, .5, mat(0xc8203a, { roughness: .5 }), .1, r, 0, 0, 0); const lid = box(.6, .1, .5, mat(0xa8182e), .05, r, 0, .3, -.2); lid.rotation.x = -1.1; const ring = new THREE.Mesh(new THREE.TorusGeometry(.12, .035, 8, 20), brass()); ring.position.set(0, .3, 0); r.add(ring); sphere(.08, new THREE.MeshStandardMaterial({ color: 0xdff8ff, metalness: .2, roughness: 0, emissive: 0x88ccff, emissiveIntensity: .8 }), r, 0, .44, 0, 8, 6); o.props.ring = r; }]);
}
export function makeLena(scene) {
  return mk(scene, { seed: 504, skin: 0xf6d2b8, skinCss: '#f6d2b8', shirt: 0xd8203a, shirt2: 0xd8203a, sleeveShort: true, pants: 0xd8203a, skirt: 0xd8203a, shoes: 0x1a1a1a, hair: 0xf0cc5a, hairBuild: curls(0xf0cc5a), noBelt: true,
    face: { iris: '#3a6ab8', browColor: '#c8a040', blush: .5 } }, [o => { const b = new THREE.Group(); o.aL.hand.add(b); b.position.set(0, -.8, 0); box(.8, .7, .3, mat(0x1a1a1a, { roughness: .4 }), .1, b, 0, -.3, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.3, .04, 6, 16, Math.PI), brass()); h.position.y = .05; b.add(h); }]);
}
export function makeBoss(scene) {
  return mk(scene, { seed: 505, scale: 1.02, skin: 0xf0c4a2, skinCss: '#f0c4a2', shirt: 0xf4f4f4, shirt2: 0xf4f4f4, pants: 0x3a3a4a, skirt: 0x3a3a4a, shoes: 0x1a1a1a, hair: 0xb8b8c0, hairBuild: hairS(0xb8b8c0, 'fringe'),
    torsoDetail: sp => { const v = mat(0xd8a02a, { roughness: .8 }); for (const s of [-1, 1]) box(.72, 1.8, 1.1, v, .1, sp, s * .66, .95, 0); box(2.06, 1.8, .5, v, .1, sp, 0, .95, -.32); for (let i = 0; i < 3; i++) sphere(.07, mat(0x5a3a1a), sp, .32, .4 + i * .4, .6, 8, 6); },
    face: { iris: '#4a4a4a', browColor: '#8a8a90', brows: .4, mouth: 'flat' } }, [o => glasses(o.head), o => { const c = box(.9, 1.2, .1, mat(0x8a5a2a), .03, o.aL.hand, 0, -.7, .5); box(.8, 1.0, .05, mat(0xffffff), .01, c, 0, -.05, .06); }]);
}
export function makeVendor(scene) {
  return mk(scene, { seed: 506, scale: 1.0, skin: 0xd8a882, skinCss: '#d8a882', shirt: 0x6a4a2e, shirt2: 0x6a4a2e, pants: 0x3a2a1e, shoes: 0x1a1a1a, hair: 0x9a9aa0, hairBuild: hairS(0x9a9aa0, 'bald'),
    torsoDetail: sp => { box(2.2, 2.1, 1.2, mat(0x6a4a2e, { roughness: .9 }), .12, sp, 0, 1.0, 0); for (let i = 0; i < 3; i++) sphere(.09, brass(), sp, .3, .4 + i * .45, .62, 8, 6); box(.9, .5, .06, mat(0xd8c8a8), .02, sp, -.5, .6, .6); },
    face: { iris: '#2a1a10', browColor: '#9a9aa0', mouth: 'smirk', eyes: 'half' } }, [o => { const m = mat(0x9a9aa0, { roughness: .8 }); box(1.3, .7, .35, m, .2, o.head, 0, .2, .55); for (const s of [-1, 1]) box(.3, .6, .8, m, .1, o.head, s * .62, .45, .2); },
    o => { const m = mat(0x1a1a1e, { roughness: .5 }); cyl(.95, .95, .08, m, 28, o.head, 0, 1.28, 0); const c = cyl(.62, .7, .8, m, 24, o.head, 0, 1.66, 0); const t = new THREE.Mesh(new THREE.SphereGeometry(.62, 20, 10, 0, 6.283, 0, 1.4), m); t.position.y = 2.0; t.scale.y = .6; o.head.add(t); cyl(.71, .71, .14, mat(0x6a2a2a), 24, o.head, 0, 1.38, 0); }]);
}

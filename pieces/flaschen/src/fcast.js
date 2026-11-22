// FLASCHEN — reparto propio (nadie se parece al vídeo de referencia).
// Ich (Noah, ≈15): pelo rubio de pinchos, pecas, chaqueta vaquera azul sobre camiseta roja, pantalón cargo verde oliva, zapatillas blancas.
// Bürgermeisterin Dorn: melena corta gris plata, traje rojo con cadena dorada de alcaldesa, gafas.
// Zahnärztin: bata blanca, mascarilla turquesa, espejo en la frente, coleta negra.
import { THREE, mat, box, cyl, sphere } from './engine.js';
import { mk, hairS, glasses, jacket, suit, chain } from './props.js';
const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });

export function makeNoah(scene) { return mk(scene, S({ seed: 9301, scale: .92, skin: 0xf4cfb0, shirt: 0xd8323a, shirt2: 0x3a6ab0, cuffs: 0x2a5a98, pants: 0x5a6a3a, shoes: 0xf4f4f4, sole: 0xd8323a, hair: 0xf0d060, hairBuild: hairS(0xf0d060, 'spiky'),
  torsoDetail: sp => { jacket(0x3a6ab0, 0xd8323a)(sp); for (const s of [-1, 1]) box(.4, .34, .06, mat(0x2a5088), .02, sp, s * .62, 1.45, .58); },
  face: { iris: '#3a7ad8', browColor: '#c8a040', freckles: 1, blush: .35 } })); }
export function makeDorn(scene) { return mk(scene, S({ seed: 9302, scale: 1.02, skin: 0xf2c4a0, shirt: 0xc81e2a, shirt2: 0xc81e2a, cuffs: 0xffffff, pants: 0xc81e2a, shoes: 0x1a1a1a, hair: 0xc8c8d0, hairBuild: hairS(0xc8c8d0, 'long'),
  torsoDetail: sp => { suit(0xc81e2a, 0xffffff, null)(sp); chain(sp); }, face: { iris: '#3a5a7a', browColor: '#9a9aa4', blush: .3, lips: 1 } }), [o => glasses(o.head)]); }
export function makeZahn(scene) { return mk(scene, S({ seed: 9303, scale: .96, skin: 0xd8a07a, shirt: 0xffffff, shirt2: 0xffffff, cuffs: 0xffffff, pants: 0x3ab8b0, shoes: 0xffffff, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'pony'),
  torsoDetail: sp => { box(2.14, 2.08, 1.14, mat(0xffffff, { roughness: .7 }), .12, sp, 0, 1.0, 0); box(.4, .5, .06, mat(0x3ab8b0), .02, sp, -.55, 1.5, .58); cyl(.03, .03, .5, mat(0x2a6ad8), 6, sp, -.45, 1.6, .6); },
  face: { iris: '#2a1a10', browColor: '#1a120c', blush: .3 } }), [o => { box(1.3, .62, .25, mat(0x3ab8b0, { roughness: .8 }), .14, o.head, 0, .22, .6); },
    o => { const m = cyl(.36, .36, .06, mat(0xd8dce4, { metalness: .9, roughness: .1 }), 18, o.head, .1, 1.05, .64); m.rotation.x = Math.PI / 2 - .2; box(1.5, .12, .1, mat(0x2a2a2a), .02, o.head, 0, 1.05, .62); }]); }

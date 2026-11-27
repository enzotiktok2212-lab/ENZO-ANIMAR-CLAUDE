// DICKKOPF — reparto propio (distinto del original): yo (sudadera mostaza, gorra verde, pelo castaño), Jonas (sudadera granate, rizos),
// el Paketbote (polo amarillo con rayas rojas, gorra roja, bandolera), Oma (vestido lila, moño blanco, gafas), el Bürgermeister (traje verde, Amtskette).
import { THREE, mat, box, cyl, sphere } from './engine.js';
import { mk, hairS, glasses, cap, hoodie } from './props.js';
export { makeJonas, makeKind } from './stvolk.js';
export { makeMayor, makeOma } from './gvolk.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const bag = col => o => { const g = new THREE.Group(); o.spine.add(g); const s = box(.22, 2.6, .12, mat(0x3a2a1a), .04, g, 0, 1.0, .62); s.rotation.z = .7; box(1.2, 1.0, .5, mat(col, { roughness: .8 }), .15, g, .75, .1, .75); };

export const makeIch = scene => mk(scene, S({ seed: 9701, scale: .86, skin: 0xf0c4a0, shirt: 0xf2b21e, shirt2: 0xf2b21e, cuffs: 0xf2b21e, pants: 0x2a3a5a, shoes: 0xf4f4f4, sole: 0xd8323a, hair: 0x6a3a1a, hairBuild: hairS(0x6a3a1a, 'fringe'),
  torsoDetail: hoodie(0xf2b21e, 0xffffff), face: { iris: '#3a6a3a', browColor: '#6a3a1a', blush: .4, freckles: 1 } }), [o => cap(o.head, 0x1e8a4a, 0xffffff)]);
export const makeBote = scene => mk(scene, S({ seed: 9702, scale: 1.0, skin: 0xc68b5e, shirt: 0xffd21a, shirt2: 0xffd21a, cuffs: 0xd8202a, pants: 0x3a3a42, shoes: 0x1a1a1a, hair: 0x1a120c, hairBuild: hairS(0x1a120c, 'fringe'),
  face: { iris: '#2a1a10', browColor: '#1a120c', blush: .2 } }), [o => cap(o.head, 0xd8202a, 0xffd21a), bag(0x8a5a2a)]);
// extras con cabeza ya inflada (vecinos del gancho)
export const makeVecino = (scene, i) => { const sh = [0x2a8ad8, 0xd8323a, 0x8ad84a, 0xff8ad0, 0x7a4ab8, 0xff8a1a][i % 6], hr = [0x1a120c, 0xe0b850, 0x6a3a1a, 0xb8441a, 0x9a9aa0, 0x2a1a10][i % 6];
  return mk(scene, S({ seed: 9720 + i, scale: .9 + (i % 3) * .05, skin: [0xf4cfb6, 0xc68b5e, 0xf2c4a0, 0x8a5a3a, 0xeab08a][i % 5], shirt: sh, shirt2: sh, cuffs: sh, sleeveShort: i % 2 === 0, pants: [0x2a3a5a, 0x3a3a42, 0x6a5a4a][i % 3],
    shoes: [0xf4f4f4, 0x1a1a1a, 0x8a5a2a][i % 3], hair: hr, hairBuild: hairS(hr, ['swoop', 'curly', 'bun', 'spiky', 'long', 'fringe'][i % 6]), face: { iris: '#3a2410', browColor: hex(hr), blush: .4 } }), i % 3 === 1 ? [o => glasses(o.head)] : []); };

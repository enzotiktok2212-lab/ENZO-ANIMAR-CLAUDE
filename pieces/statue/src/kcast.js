// KELLER — reparto propio (nadie se parece al vídeo de referencia).
// Thomas (yo, ≈12): sudadera roja-anaranjada con parche blanco «T», gorra azul del revés, pelo castaño de pinchos, vaqueros, zapatillas blancas con suela roja.
// Frau Pohl (vecina): moño gris, rebeca lila, gafas. Extras: makeExtra (ecast.js), todos distintos.
import { THREE, mat, box, cyl, sphere, textPlane } from './engine.js';
import { mk, hairS, glasses, hoodie } from './props.js';
import { FONT } from './props.js';
const hex = c => '#' + c.toString(16).padStart(6, '0');
export function makeThomas(scene) {
  const o = mk(scene, { seed: 7301, scale: .9, skin: 0xf2c4a0, skinCss: '#f2c4a0', shirt: 0xe8502a, shirt2: 0xe8502a, cuffs: 0xffffff, pants: 0x2f4f8a, shoes: 0xf6f6f6, sole: 0xd8323a, hair: 0x6a3a1a, hairBuild: hairS(0x6a3a1a, 'spiky'), noBelt: true,
    torsoDetail: sp => { hoodie(0xe8502a, 0xffffff)(sp); const t = textPlane(.8, .8, 96, 96, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 14); c.fill(); c.lineWidth = 6; c.strokeStyle = '#1e3a8a'; c.stroke(); c.font = `700 70px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#1e3a8a'; c.fillText('T', w / 2, h / 2 + 4); }); t.position.set(-.5, 1.3, .58); sp.add(t);
      for (const s of [-1, 1]) box(.12, 2.0, 1.14, mat(0xffffff, { roughness: .7 }), .03, sp, s * .99, 1.0, 0); },
    face: { iris: '#4a7ab8', browColor: '#5a3014', blush: .3, freckles: .4 } },
    [o => { const m = mat(0x2a5ad8, { roughness: .55 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 24, 10, 0, 6.283, 0, 1.3), m); c.position.y = 1.1; c.scale.y = .66; o.head.add(c);
      const b = box(1.0, .08, .75, m, .03, o.head, 0, 1.12, -.78); b.rotation.x = -.15; box(.5, .2, .1, mat(0xffffff), .03, o.head, 0, 1.25, -.68); }]);
  return o; }
export function makePohl(scene) { return mk(scene, { seed: 7302, scale: .95, skin: 0xf4cfb6, skinCss: '#f4cfb6', shirt: 0xa878d8, shirt2: 0xa878d8, cuffs: 0x8a5ac0, pants: 0x4a4a5a, shoes: 0x6a3a2a, hair: 0xb8b8c0, hairBuild: hairS(0xb8b8c0, 'bun'), noBelt: true,
  face: { iris: '#3a5a7a', browColor: '#9a9aa0', blush: .4 } }, [o => glasses(o.head)]); }

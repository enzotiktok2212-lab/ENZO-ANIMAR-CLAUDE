// Nichts — reparto propio (aspecto distinto al del vídeo de referencia):
// Narrador (14): pelo rubio despeinado con pinchos, pecas, chaqueta naranja con cremallera sobre camiseta blanca, vaqueros, zapatillas blancas.
// Mamá: moño castaño, jersey verde de punto, delantal amarillo con pinzas de la ropa.
// El anciano: muy alto y delgado, calvo, barba blanca larguísima, abrigo gris oscuro hasta los pies, bastón, bufanda granate.
// El niño del restaurante (8): pelo negro con raya, gafas redondas, polo amarillo, ojeras.
// Camarero: camisa blanca, chaleco y delantal negros, pajarita roja, bigote fino, pelo engominado.
// Operario de la Stadtwerke: mono azul con bandas reflectantes, casco amarillo con linterna, guantes.
// Camionero: gorra roja, camisa de cuadros, barba castaña.
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, mustache, jacket, cap } from './props.js';

const knit = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 2; for (let x = 0; x < w; x += 8) for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y + 6); c.lineTo(x + 8, y); c.stroke(); } }, true);
const plaid = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; c.globalAlpha = .55; for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 8, h); c.fillRect(0, i * 16, w, 8); } }, true);
function messyBlond(col) { return (h) => { const m = mat(col, { roughness: .55 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .66, 1.04); h.add(c);
  for (let i = 0; i < 11; i++) { const a = i / 11 * 6.283, s = new THREE.Mesh(new THREE.ConeGeometry(.22, .62, 5), m); s.position.set(Math.cos(a) * .45, 1.32, Math.sin(a) * .45 - .05); s.rotation.set(Math.sin(a) * .8, 0, -Math.cos(a) * .8); h.add(s); }
  for (let i = -2; i <= 2; i++) { const t = box(.28, .42, .26, m, .1, h, i * .24, 1.16, .5); t.rotation.set(-.4, 0, i * .18); } }; }
export function makeIch(scene) {
  return mk(scene, { seed: 801, scale: .9, skin: 0xf6d2b8, skinCss: '#f6d2b8', shirt: 0xf4f4f4, shirt2: 0xf2782a, cuffs: 0xd8601a, pants: 0x3a5a8e, shoes: 0xf8f8f8, sole: 0xd8d8d8, hair: 0xf2cf5a, hairBuild: messyBlond(0xf2cf5a), noBelt: true,
    torsoDetail: jacket(0xf2782a, 0xf4f4f4, null), face: { blush: .3, freckles: 1 } });
}
export function makeMama(scene) {
  return mk(scene, { seed: 802, skin: 0xe8b894, skinCss: '#e8b894', shirtMap: knit('#3a8a5a', 'rgba(0,0,0,.18)'), shirt2: null, cuffs: 0x2f7a4a, pants: 0x5a4a6a, skirt: 0x5a4a6a, apron: 0xf2c23a, shoes: 0x5a3a22, hair: 0x6a3a1e, hairBuild: hairS(0x6a3a1e, 'bun'),
    face: { blush: .35 } }, [o => { for (let k = 0; k < 3; k++) box(.12, .4, .1, mat([0xd8323a, 0x2a6ad8, 0x4cb64a][k]), .02, o.spine, -.4 + k * .2, 1.2, .64); }]);
}
export function makeAlter(scene) {
  return mk(scene, { seed: 803, scale: 1.18, skin: 0xe8c8b0, skinCss: '#e8c8b0', shirt: 0x3a3e46, shirt2: 0x3a3e46, cuffs: 0x2a2e36, pants: 0x3a3e46, skirt: 0x3a3e46, shoes: 0x1a1a1e, hair: 0xe8e8e8, hairBuild: hairS(0xe8e8e8, 'bald'),
    face: { bags: .6 } }, [o => { const b = mat(0xf0f0f0, { roughness: .9 }); box(1.0, 1.6, .5, b, .25, o.head, 0, -.15, .55); box(.7, .6, .4, b, .2, o.head, 0, -1.05, .6); mustache(o.head, 0xf0f0f0);
      for (const s of [-1, 1]) sphere(.18, b, o.head, s * .62, 1.0, -.1, 8, 6);
      const sc = mat(0x7a1a2a, { roughness: 1 }); box(2.2, .5, 1.3, sc, .2, o.spine, 0, 1.95, 0); box(.5, 1.4, .2, sc, .1, o.spine, .5, 1.1, .62);
      const c = cyl(.08, .08, 4.2, mat(0x3a2414), 8, o.aR.hand, 0, -1.8, .2); o.props.cane = c; for (let k = 0; k < 4; k++) sphere(.1, mat(0xc8a040, { metalness: .8 }), o.spine, 0, .5 + k * .4, .6, 6, 4); }]);
}
export function makeJunge(scene) {
  return mk(scene, { seed: 804, scale: .68, headScale: 1.06, skin: 0xd9a47a, skinCss: '#d9a47a', shirt: 0xf2c23a, shirt2: 0xf2c23a, cuffs: 0xd8a420, pants: 0x3a4a5a, shoes: 0x2a2a3a, hair: 0x111111, hairBuild: hairS(0x111111, 'fringe'),
    face: { bags: .8 } }, [o => glasses(o.head), o => { box(.8, .5, .1, mat(0xd8a420), .05, o.spine, 0, 1.9, .58); for (let k = 0; k < 2; k++) sphere(.06, mat(0xffffff), o.spine, 0, 1.6 - k * .25, .6, 6, 4); }]);
}
export function makeKellner(scene) {
  return mk(scene, { seed: 805, skin: 0x8d5a3b, skinCss: '#8d5a3b', shirt: 0xf8f8f8, shirt2: 0xf8f8f8, pants: 0x1a1a1e, skirt: null, apron: null, shoes: 0x1a1a1e, hair: 0x1a1210, hairBuild: hairS(0x1a1210, 'swoop'),
    torsoDetail: sp => { const v = mat(0x1a1a1e, { roughness: .6 }); for (const s of [-1, 1]) box(.7, 1.6, 1.12, v, .08, sp, s * .68, 1.2, 0); box(2.06, 1.6, .5, v, .08, sp, 0, 1.2, -.32); box(1.9, 1.6, .06, v, .03, sp, 0, -.2, .6);
      const bt = mat(0xd8323a); box(.36, .26, .1, bt, .06, sp, -.2, 1.9, .6); box(.36, .26, .1, bt, .06, sp, .2, 1.9, .6); sphere(.1, bt, sp, 0, 1.9, .64, 6, 4); },
    face: {} }, [o => mustache(o.head, 0x1a1210)]);
}
export function makeArbeiter(scene) {
  return mk(scene, { seed: 806, scale: 1.02, skin: 0xc68b5e, skinCss: '#c68b5e', shirt: 0x2a5ab8, shirt2: 0x2a5ab8, cuffs: 0xf2c23a, pants: 0x2a5ab8, shoes: 0x3a2a1a, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'bald'),
    face: {} }, [o => { const y = mat(0xf2c23a, { roughness: .35 }); const h = new THREE.Mesh(new THREE.SphereGeometry(.8, 20, 10, 0, 6.283, 0, 1.5), y); h.position.y = 1.02; h.scale.set(1, .75, 1); o.head.add(h); box(1.9, .1, 1.9, y, .05, o.head, 0, 1.05, .1);
      const lamp = cyl(.2, .2, .2, mat(0x2a2a2e), 10, o.head, 0, 1.25, .78); lamp.rotation.x = Math.PI / 2; const lb = sphere(.15, new THREE.MeshStandardMaterial({ color: 0xfff8e0, emissive: 0xfff8e0, emissiveIntensity: 3 }), o.head, 0, 1.25, .9, 8, 6); o.props.headlamp = lb;
      for (const yy of [.6, 1.4]) box(2.1, .16, 1.14, mat(0xe8f070, { emissive: 0xc8d040, emissiveIntensity: .4 }), .03, o.spine, 0, yy, 0); for (const lg of [o.lL, o.lR]) box(1.0, .14, 1.03, mat(0xe8f070, { emissive: 0xc8d040, emissiveIntensity: .4 }), .03, lg.kn, 0, -.3, 0);
      for (const a of [o.aL, o.aR]) box(.86, .5, .86, mat(0x3a3a3a, { roughness: .9 }), .14, a.hand, 0, -.2, .02); }]);
}
export function makeFahrer(scene) {
  return mk(scene, { seed: 807, skin: 0xf0c4a2, skinCss: '#f0c4a2', shirtMap: plaid('#c83a2a', '#1a1a1a'), shirt2: null, pants: 0x3a4a5a, shoes: 0x5a3a22, hair: 0x6a3a1e, hairBuild: hairS(0x6a3a1e, 'short'),
    face: {} }, [o => cap(o.head, 0xd8323a), o => { const b = mat(0x6a3a1e, { roughness: .9 }); box(1.2, .6, .4, b, .2, o.head, 0, .15, .55); }]);
}

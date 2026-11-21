// Dunkel — reparto propio (nadie se parece al vídeo de referencia).
// Ich (≈16): rizos castaño oscuro, sudadera roja con cordones, vaqueros negros, zapatillas blancas; luego chaleco reflectante naranja.
// Papa (jefe de la vigilancia): chaqueta azul marino con franjas reflectantes amarillas, gorra de plato con escudo dorado, barba gris corta, cejas pobladas.
// Benno (vigilante joven): pelirrojo con flequillo, pecas, uniforme azul, gorra. Vigilantes: 6 variantes (pieles, pelo, gafas, coleta, barba).
// Techniker Kowalski (el de la radio): mono naranja, casco blanco, gafas. Policías: chaqueta azul «POLIZEI», gorra blanca con banda azul.
// Vecinos: Oma (moño blanco, rebeca lila, gafas), un niño con pijama de dinosaurios, un vecino con camiseta interior y bigote.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { mk, hairS, glasses, mustache, cap, txt } from './props.js';
import { curtain, mullet, buzz, messyBun, sidePart, baldSides, curlyTop, oversizeHoodie, earrings, helmet } from './gvolk.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
// uniforme de vigilante: chaqueta con cremallera, bolsillos, franjas reflectantes, hombreras y placa
export const guardJacket = (col, refl = 0xe8f040, badge = 0xd9a531) => sp => { const j = mat(col, { roughness: .6 }); box(2.16, 2.1, 1.18, j, .14, sp, 0, 1.02, 0);
  for (const y of [.45, 1.25]) box(2.2, .15, 1.22, mat(refl, { emissive: refl, emissiveIntensity: .08, roughness: .5 }), .03, sp, 0, y, 0);
  box(.06, 1.95, .05, mat(0xb8b8c0, { metalness: .8 }), 0, sp, 0, 1.02, .6); for (const s of [-1, 1]) { box(.55, .45, .06, j, .04, sp, s * .55, 1.62, .61); box(.3, .1, .9, mat(0x1a1a24), .03, sp, s * .8, 2.08, 0); }
  const b = new THREE.Mesh(new THREE.CircleGeometry(.17, 5), mat(badge, { metalness: .8, roughness: .25 })); b.position.set(-.55, 1.66, .65); sp.add(b);
  const c = box(1.6, .35, 1.25, j, .12, sp, 0, 2.05, 0); };
// gorra de plato (vigilantes/papá): copa, visera negra, escudo
export const peakCap = (col, band = 0x1a1a24, badge = 0xd9a531) => o => { const m = mat(col, { roughness: .55 }); cyl(.78, .72, .42, m, 24, o.head, 0, 1.42, 0); cyl(.74, .74, .16, mat(band), 24, o.head, 0, 1.26, 0);
  const v = box(1.1, .07, .62, mat(0x0e0e12, { roughness: .2 }), .03, o.head, 0, 1.2, .62); v.rotation.x = .2; const e = new THREE.Mesh(new THREE.CircleGeometry(.14, 6), mat(badge, { metalness: .85, roughness: .2 })); e.position.set(0, 1.42, .74); o.head.add(e); };
const beard = col => o => { const m = mat(col, { roughness: 1 }); box(1.2, .42, .3, m, .14, o.head, 0, .2, .6); for (const s of [-1, 1]) box(.26, .7, .5, m, .1, o.head, s * .56, .45, .42); };
// chaleco reflectante (para Ich, se pone y se quita)
function vest(o) { const g = new THREE.Group(); o.spine.add(g); const m = mat(0xff7a1a, { roughness: .7, emissive: 0x6a2000, emissiveIntensity: .05 });
  for (const s of [-1, 1]) box(.7, 1.95, 1.24, m, .08, g, s * .68, 1.0, 0); box(2.24, 1.9, .3, m, .08, g, 0, 1.0, -.5);
  for (const y of [.5, 1.3]) box(2.28, .14, 1.28, mat(0xd8d8d0, { emissive: 0xffffff, emissiveIntensity: .08 }), .02, g, 0, y, 0); o.props.vest = g; g.visible = false; }

export function makeIch(scene) { return mk(scene, S({ seed: 2101, scale: .86, skin: 0xc68e66, shirt: 0xd8343a, shirt2: 0xd8343a, cuffs: 0xb02028, pants: 0x1e1e26, shoes: 0xf6f6f2, sole: 0xd8d8d8, hair: 0x2a1a10, hairBuild: curlyTop(0x2a1a10),
  torsoDetail: oversizeHoodie(0xd8343a, 0xffffff), face: { iris: '#3a2410', browColor: '#2a1a10', blush: .3 } }), [vest]); }
export function makePapa(scene) { return mk(scene, S({ seed: 2102, scale: 1.06, skin: 0xf0c09c, shirt: 0x1c2a4a, shirt2: 0x1c2a4a, cuffs: 0x101a30, pants: 0x1c2438, shoes: 0x14141a, hair: 0x8a8682, hairBuild: baldSides(0x8a8682),
  torsoDetail: guardJacket(0x1c2a4a), face: { iris: '#3a5a7a', browColor: '#6a6560', blush: .4 } }), [beard(0x9a958e), peakCap(0x1c2a4a, 0xd9a531)]); }
export function makeBenno(scene) { return mk(scene, S({ seed: 2103, scale: .94, skin: 0xf6d2b8, shirt: 0x24345a, shirt2: 0x24345a, cuffs: 0x16203a, pants: 0x1e2840, shoes: 0x14141a, hair: 0xd0602a, hairBuild: hairS(0xd0602a, 'fringe'),
  torsoDetail: guardJacket(0x24345a), face: { iris: '#4a8a5a', browColor: '#b8501a', freckles: 1, blush: .55 } }), [peakCap(0x24345a)]); }
const GV = [ // piel, pelo, peinado, extras, cara
  [0x8d5a3b, 0x101010, buzz(0x101010), [o => glasses(o.head)], 'plain'],
  [0xeab08a, 0x5a3a1e, hairS(0x5a3a1e, 'pony'), [earrings(0xd8dce4)], 'girl'],
  [0xc68b5e, 0x1a1008, sidePart(0x1a1008), [beard(0x1a1008)], 'plain'],
  [0xf0c4a2, 0xe0b850, mullet(0xe0b850), [], 'hero'],
  [0xa86a42, 0x1a1008, messyBun(0x1a1008), [], 'girl'],
  [0xe0b090, 0x3a2214, curtain(0x3a2214), [o => mustache(o.head, 0x3a2214)], 'mustache'],
];
export function makeWache(scene, i) { const [sk, hc, hb, acc, face] = GV[i % GV.length];
  const c = mk(scene, S({ seed: 2110 + i, scale: .98 + (i % 3) * .04, skin: sk, shirt: 0x24345a, shirt2: 0x24345a, cuffs: 0x16203a, pants: 0x1e2840, shoes: 0x14141a, hair: hc, hairBuild: hb,
    torsoDetail: guardJacket([0x24345a, 0x1e3050, 0x2a3a62][i % 3]), face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hc), blush: .3 } }), [...acc, ...(i % 2 ? [] : [peakCap(0x24345a)])]); c.kit = face; return c; }
export function makeTechniker(scene) { return mk(scene, S({ seed: 2120, scale: 1.0, skin: 0xe8b48c, shirt: 0xff7a1a, shirt2: 0xff7a1a, cuffs: 0xd85a10, pants: 0xff7a1a, shoes: 0x3a2a1a, hair: 0x3a2a1a, hairBuild: buzz(0x3a2a1a),
  torsoDetail: sp => { const j = mat(0xff7a1a, { roughness: .7 }); box(2.12, 2.06, 1.14, j, .14, sp, 0, 1.0, 0); for (const s of [-1, 1]) cyl(.05, .05, 2.0, mat(0x2a2a2a), 6, sp, s * .55, 1.1, .58); box(.6, .5, .06, mat(0xd85a10), .03, sp, -.5, 1.5, .6); box(2.18, .16, 1.18, mat(0xe8e8e0, { emissive: 0xffffff, emissiveIntensity: .3 }), .02, sp, 0, .9, 0); },
  face: { iris: '#3a2410', browColor: '#3a2a1a' } }), [o => glasses(o.head), helmet(0xf4f4f4)]); }
export function makePolizist(scene, i) { return mk(scene, S({ seed: 2130 + i, scale: 1.02, skin: [0xf0c4a2, 0x9a6a46][i % 2], shirt: 0x1a2a52, shirt2: 0x1a2a52, cuffs: 0x101a36, pants: 0x1a2440, shoes: 0x101014, hair: [0x6a4a2a, 0x101010][i % 2], hairBuild: [buzz(0x6a4a2a), hairS(0x101010, 'bun')][i % 2],
  torsoDetail: sp => { box(2.14, 2.08, 1.16, mat(0x1a2a52, { roughness: .55 }), .14, sp, 0, 1.02, 0); const l = textPlane(1.6, .36, 160, 36, (c, w, h) => { c.fillStyle = '#e8eef8'; c.fillRect(0, 0, w, h); txt(c, 'POLIZEI', w / 2, h / 2 + 2, 28, '#1a2a52'); }, .4); l.position.set(0, 1.55, .6); sp.add(l); box(2.18, .14, 1.2, mat(0xd8dce4, { emissive: 0xffffff, emissiveIntensity: .25 }), .02, sp, 0, .5, 0); },
  face: { iris: '#3a2410', browColor: '#3a2a1a' } }), [o => { const m = mat(0xf4f4f8, { roughness: .4 }); cyl(.8, .72, .4, m, 24, o.head, 0, 1.42, 0); cyl(.75, .75, .16, mat(0x1a3a8a), 24, o.head, 0, 1.26, 0); const v = box(1.1, .07, .6, mat(0x0e0e12), .03, o.head, 0, 1.2, .62); v.rotation.x = .2; }]); }
export function makeOma(scene) { return mk(scene, S({ seed: 2140, scale: .85, skin: 0xf4cfb6, shirt: 0xb898d8, shirt2: 0xb898d8, cuffs: 0x9878b8, pants: 0x6a5a7a, hair: 0xf0f0f0, hairBuild: messyBun(0xf0f0f0),
  torsoDetail: sp => { box(2.12, 2.04, 1.14, mat(0xb898d8, { roughness: 1 }), .14, sp, 0, 1.0, 0); for (let k = 0; k < 4; k++) sphere(.07, mat(0xffffff), sp, .12, 1.7 - k * .35, .6, 6, 4); }, face: { iris: '#5a7a9a', browColor: '#cfcfcf', blush: .5 } }), [o => glasses(o.head)]); }
export function makeKind(scene) { const t = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#7ac8f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#3aa85a'; for (const [x, y] of [[12, 14], [44, 30], [18, 48]]) { c.beginPath(); c.ellipse(x, y, 9, 6, .4, 0, 7); c.fill(); c.fillRect(x - 2, y - 12, 4, 8); } }, true);
  return mk(scene, S({ seed: 2141, scale: .66, skin: 0xd8a07a, shirtMap: t, shirt2: null, cuffs: 0x5aa8d8, pants: 0x7ac8f0, shoes: 0xf4f4f4, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'spiky'), face: { iris: '#3a2410', browColor: '#2a1a10', blush: .5 } })); }
export function makeNachbar(scene) { return mk(scene, S({ seed: 2142, scale: 1.04, skin: 0xe8b48c, shirt: 0xf4f4f0, shirt2: 0xe8b48c, sleeveShort: true, cuffs: 0xf4f4f0, pants: 0x4a5a7a, hair: 0x2a2a2a, hairBuild: baldSides(0x2a2a2a),
  torsoDetail: sp => { box(2.06, 2.04, 1.1, mat(0xf4f4f0, { roughness: 1 }), .14, sp, 0, 1.0, 0); }, face: { iris: '#3a2410', browColor: '#2a2a2a' } }), [o => mustache(o.head, 0x2a2a2a)]); }

// ---------- atrezo de mano ----------
// linterna: cuerpo negro con anillo naranja, lente que brilla y haz de luz (cono aditivo) que sale por +y del grupo
const beamM = () => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false, fog: false,
  uniforms: { col: { value: new THREE.Color(0xfff2d0) }, a: { value: .5 }, nearF: { value: 18 } },
  vertexShader: 'varying vec2 vU; varying vec3 vN; varying vec3 vV; varying float vD; void main(){ vU=uv; vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); vD=-mv.z; gl_Position=projectionMatrix*mv; }',
  fragmentShader: 'uniform vec3 col; uniform float a; uniform float nearF; varying vec2 vU; varying vec3 vN; varying vec3 vV; varying float vD; void main(){ float e=pow(abs(dot(vN,vV)),1.3); float f=vU.y; float nf=smoothstep(nearF*.25, nearF, vD); gl_FragColor=vec4(col*a*e*f*f*f*nf, 1.); }' });
export function beamFrom(len = 30, r = 5, a = .45) { const m = beamM(); m.uniforms.a.value = a; const g = new THREE.CylinderGeometry(r, .16, len, 24, 1, true); g.translate(0, len / 2, 0);
  // vU.y = 1 arriba (ancho). Queremos brillo junto a la lámpara: invertimos el uv
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i) * .85); const c = new THREE.Mesh(g, m); c.frustumCulled = false; c.userData.a0 = a; return c; }
export function flashlight(parent) { const g = new THREE.Group(); parent.add(g); const k = mat(0x1a1a1e, { roughness: .35, metalness: .5 });
  cyl(.2, .2, 1.4, k, 14, g, 0, 0, 0); cyl(.32, .22, .45, k, 16, g, 0, .9, 0); cyl(.33, .33, .12, mat(0xff7a1a), 16, g, 0, .4, 0);
  const lens = cyl(.28, .28, .05, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4d8, emissiveIntensity: 3, toneMapped: false }), 16, g, 0, 1.14, 0);
  const b = beamFrom(20, 2.4, .1); b.material.uniforms.nearF.value = 5; b.position.y = 1.15; g.add(b); g.userData = { lens, beam: b, on: v => { lens.material.emissiveIntensity = v ? 3 : 0; b.visible = !!v; } }; return g; }
// funkgerät (radio de mano) con antena, rejilla y LED
export function radio(parent) { const g = new THREE.Group(); parent.add(g); const k = mat(0x16161a, { roughness: .45 }); box(.62, 1.1, .32, k, .08, g, 0, 0, 0); cyl(.05, .05, .9, k, 6, g, .18, .95, 0);
  for (let i = 0; i < 4; i++) box(.4, .04, .02, mat(0x3a3a40), 0, g, 0, .25 - i * .1, .17); const led = sphere(.06, new THREE.MeshStandardMaterial({ color: 0x3aff6a, emissive: 0x3aff6a, emissiveIntensity: 2, toneMapped: false }), g, -.18, .45, .17, 6, 4);
  box(.4, .22, .03, mat(0x7affd8, { emissive: 0x3aa88a, emissiveIntensity: .8 }), .02, g, 0, -.2, .17); g.userData.led = led; return g; }

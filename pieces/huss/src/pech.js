// Pech — escenarios, vehículos, clima y reparto propios de esta pieza (todo muy detallado).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { FONT, noiseTex, stripes, screen, txt, mk, hairS, jacket, suit, hoodie, chain, cap, shades, glasses, mustache, headphones, tree } from './props.js';

export const B = c => new THREE.MeshBasicMaterial({ color: new THREE.Color(...c), toneMapped: false, transparent: true });
export const gold = () => mat(0xe9c23a, { metalness: .85, roughness: .22, emissive: 0x5a4000, emissiveIntensity: .25 });
export const glass = () => mat(0x9fd8f8, { roughness: .05, metalness: .3, emissive: 0x2a6a9a, emissiveIntensity: .25 });
export const label = (w, h, text, bg, fg, size = 70, glow = .5) => textPlane(w, h, Math.round(w * 64), Math.round(h * 64), (c, pw, ph) => { c.fillStyle = bg; c.beginPath(); c.roundRect(2, 2, pw - 4, ph - 4, Math.min(pw, ph) * .2); c.fill(); txt(c, text, pw / 2, ph / 2 + 3, size, fg); }, glow);

// ---------- reparto (cada uno con ropa, color, pelo y accesorio distintos) ----------
const backpack = col => o => { const g = new THREE.Group(); g.position.set(0, 1.1, -.62); o.spine.add(g); box(1.5, 1.7, .6, mat(col, { roughness: .8 }), .2, g, 0, 0, -.1); box(1.2, .7, .3, mat(col * 0 + 0x2a2a3a), .1, g, 0, -.4, -.35); for (const s of [-1, 1]) box(.16, 1.6, .1, mat(0x2a2a3a), .03, g, s * .5, .1, .26); box(.5, .14, .1, mat(0xffd23f), .03, g, 0, .3, -.43); };
export function makeFinn(scene) {   // Finn: sudadera naranja con cordones, flequillo rubio en tupé, pecas, vaqueros, zapatillas blancas con suela roja, mochila verde
  return mk(scene, { seed: 101, scale: .86, skin: 0xf6d2b8, skinCss: '#f6d2b8', shirt: 0xff7a1a, shirt2: 0xff7a1a, cuffs: 0xe0601a, pants: 0x3f63a8, shoes: 0xffffff, sole: 0xe0303a, hair: 0xf2c45a, hairBuild: hairS(0xf2c45a, 'swoop'),
    torsoDetail: hoodie(0xff7a1a, 0xfff2d8), noBelt: true, face: { iris: '#2a7ad8', freckles: 1, browColor: '#b8862a', blush: .35 } }, [backpack(0x2ec46a)]);
}
export function makeBuddy(scene) {   // el mejor amigo: chaqueta de chándal verde, gorra roja del revés, rizos negros, piel oscura, auriculares al cuello
  return mk(scene, { seed: 102, scale: .86, skin: 0x8d5a3b, skinCss: '#8d5a3b', shirt: 0x1fae5a, shirt2: 0x1fae5a, cuffs: 0xffffff, pants: 0x22223b, shoes: 0xffd23f, sole: 0xffffff, hair: 0x111111, hairBuild: hairS(0x111111, 'curly'),
    torsoDetail: jacket(0x1fae5a, 0xffffff, 0xffd23f), noBelt: true, face: { iris: '#2a1608', browColor: '#111' } }, [o => { const m = mat(0xd8323a, { roughness: .6 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 10, 0, 6.283, 0, 1.3), m); c.position.y = 1.1; c.scale.y = .7; o.head.add(c); box(1.0, .08, .7, m, .03, o.head, 0, 1.12, -.78); }]);
}
export function makeLightningMan(scene) {   // vecino del rayo: chaleco morado de punto, camisa amarilla, bigote gris, pelo canoso de punta (electrificado)
  return mk(scene, { seed: 103, skin: 0xf0c4a2, skinCss: '#f0c4a2', shirt: 0xffd86a, shirt2: 0xffd86a, pants: 0x4a4a5a, shoes: 0x5a3a1a, hair: 0xd8d8d8, hairBuild: hairS(0xd8d8d8, 'spiky'),
    torsoDetail: sp => { const v = mat(0x7a3ab8, { roughness: .9 }); box(2.1, 1.9, 1.12, v, .14, sp, 0, .95, 0); for (let k = 0; k < 4; k++) sphere(.08, gold(), sp, 0, .4 + k * .42, .58, 8, 6); }, face: { browColor: '#bbbbbb' } }, [o => mustache(o.head, 0xcccccc)]);
}
export function makeTycoon(scene) {   // el hombre más rico: traje azul marino con raya dorada, pajarita, tupé dorado, gafas de sol, cadena
  return mk(scene, { seed: 104, scale: 1.04, skin: 0xfbd9c3, skinCss: '#fbd9c3', shirt: 0x1d2a5a, shirt2: 0x1d2a5a, cuffs: 0xffd23f, pants: 0x1d2a5a, shoes: 0x111111, hair: 0xf2c030, hairBuild: hairS(0xf2c030, 'swoop'),
    torsoDetail: sp => { suit(0x1d2a5a, 0xffffff, null)(sp); const b = box(.5, .24, .1, mat(0xd8323a), .05, sp, 0, 1.9, .6); }, face: { iris: '#3a7ad8' } }, [o => { shades(o.head, 0x2a1a00, 0xffd23f); chain(o.spine); }]);
}
export function makeDriver(scene) {   // chófer de limusina: uniforme negro, gorra de plato con visera, guantes blancos
  return mk(scene, { seed: 105, skin: 0xc68b5e, skinCss: '#c68b5e', shirt: 0x15151c, shirt2: 0x15151c, cuffs: 0xffffff, pants: 0x15151c, shoes: 0x0a0a0a, hair: 0x111111, hairBuild: hairS(0x111111, 'fringe'),
    torsoDetail: suit(0x15151c, 0xffffff, 0x111111), face: { brows: .1 } }, [o => { const m = mat(0x15151c, { roughness: .4 }); cyl(.82, .72, .5, m, 24, o.head, 0, 1.38, 0); box(1.0, .08, .55, mat(0x0a0a0a, { roughness: .2 }), .03, o.head, 0, 1.15, .72); cyl(.84, .84, .12, gold(), 24, o.head, 0, 1.2, 0); }]);
}
export function makeBusDriver(scene) {   // conductor de autobús: camisa celeste, chaleco azul, gorra, barba castaña
  return mk(scene, { seed: 106, scale: 1.02, skin: 0xf0c4a2, skinCss: '#f0c4a2', shirt: 0x9fd0f0, shirt2: 0x9fd0f0, pants: 0x2a3a6a, shoes: 0x222222, hair: 0x6a3a1a, hairBuild: hairS(0x6a3a1a, 'fringe'),
    torsoDetail: sp => { const v = mat(0x2a4a9a); box(2.1, 1.7, 1.1, v, .14, sp, 0, .9, 0); box(.5, .3, .06, mat(0xffd23f), .03, sp, -.5, 1.4, .58); } }, [o => { cap(o.head, 0x2a4a9a, 0xffd23f); box(1.2, .5, .2, mat(0x6a3a1a, { roughness: 1 }), .1, o.head, 0, .32, .62); }]);
}
export function makeMechanic(scene) {   // mecánico: mono naranja con bolsillos y tirantes, casco amarillo, bigote, mancha de grasa
  return mk(scene, { seed: 107, scale: 1.0, skin: 0xd8a882, skinCss: '#d8a882', shirt: 0xff8a1a, shirt2: 0xff8a1a, pants: 0xff8a1a, shoes: 0x3a2a1a, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'bald'),
    torsoDetail: sp => { const o = mat(0xff8a1a, { roughness: .85 }); for (const s of [-1, 1]) { box(.4, .5, .1, mat(0xe06a10), .05, sp, s * .55, 1.2, .56); box(.18, 1.9, .08, mat(0x2a2a3a), .03, sp, s * .5, 1.0, .58); } box(2.1, .2, 1.12, mat(0xc0c0c8, { metalness: .6 }), .05, sp, 0, .5, 0); box(.5, .5, .1, mat(0x3a3a3a, { transparent: true, opacity: .4 }), .05, sp, .3, .4, .57); }, noBelt: true, face: { soot: 1 } },
  [o => { const m = mat(0xffd23f, { roughness: .35 }); const h = new THREE.Mesh(new THREE.SphereGeometry(.8, 24, 12, 0, 6.283, 0, 1.4), m); h.position.y = 1.05; h.scale.y = .8; o.head.add(h); cyl(.95, .95, .08, m, 24, o.head, 0, 1.08, 0); mustache(o.head, 0x2a1a10); }]);
}
export function makeOfficer(scene) {   // funcionario del Pech-Amt: chaqueta verde oscuro, corbata negra con gato, gafas redondas, calvo con flequillo lateral
  return mk(scene, { seed: 108, scale: 1.02, skin: 0xfbd9c3, skinCss: '#fbd9c3', shirt: 0x2a5a4a, shirt2: 0x2a5a4a, pants: 0x2a3a3a, shoes: 0x111111, hair: 0x6a4a2a, hairBuild: hairS(0x6a4a2a, 'fringe'),
    torsoDetail: suit(0x2a5a4a, 0xf4f0e0, 0x111111), face: { iris: '#4a7a3a' } }, [o => glasses(o.head)]);
}
export function makeClerkL(scene) {   // vendedora de lotería: chaleco a rayas rojas, moño rosa, auriculares
  return mk(scene, { seed: 109, skin: 0xf0c4a2, skinCss: '#f0c4a2', shirt: 0xffffff, shirtMap: stripes('#e0303a', '#ffffff', 8), pants: 0x2a2a3a, hair: 0xff6aa8, hairBuild: hairS(0xff6aa8, 'bun'), face: { blush: .5 } }, [o => headphones(o.head, 0xffffff)]);
}
export function makeBanker(scene) {   // empleado del banco: chaqueta gris, corbata roja, canas
  return mk(scene, { seed: 110, scale: 1.04, skin: 0xc68b5e, skinCss: '#c68b5e', shirt: 0x7a8090, shirt2: 0x7a8090, pants: 0x4a4e5a, shoes: 0x111111, hair: 0xbbbbbb, hairBuild: hairS(0xbbbbbb, 'swoop'), torsoDetail: suit(0x7a8090, 0xffffff, 0xd8323a) }, [o => glasses(o.head)]);
}

// ---------- vehículos ----------
export function bus(parent, col = 0x2a7ad8, sign = '13', rusty = false) {
  const g = new THREE.Group(); parent.add(g); const b = mat(col, { roughness: .35, metalness: .2 }), dark = mat(0x1a1e26, { roughness: .4 });
  box(6.4, 7, 26, b, .8, g, 0, 4.6, 0); box(6.5, .7, 26.1, mat(0xf4f4f4), .2, g, 0, 2.2, 0); box(6.2, .4, 25, mat(0xdddddd), .1, g, 0, 8.2, 0);
  for (let k = 0; k < 6; k++) for (const s of [-1, 1]) box(.1, 2.6, 3.2, glass(), .05, g, s * 3.22, 5.6, -10 + k * 3.8);
  box(5.6, 3.6, .1, glass(), .2, g, 0, 5.4, 13.02); box(5.6, 2, .1, glass(), .2, g, 0, 5.8, -13.02);
  const sg = textPlane(4.6, 1, 300, 66, (c, w, h) => { c.fillStyle = '#111'; c.fillRect(0, 0, w, h); txt(c, sign, w / 2, h / 2 + 2, 52, '#ffb21a'); }, 1.4); sg.position.set(0, 7.6, 13.06); g.add(sg);
  for (const s of [-1, 1]) { sphere(.42, mat(0xffffff, { emissive: 0xfff4c0, emissiveIntensity: 3 }), g, s * 2.4, 2.6, 13.1); sphere(.38, mat(0xff2a2a, { emissive: 0xff2a2a, emissiveIntensity: 2 }), g, s * 2.4, 3, -13.1); box(.2, .9, .9, dark, .05, g, s * 3.5, 6.5, 12.4); }
  box(6, 1, .5, dark, .2, g, 0, 1.6, 13.1); box(6, 1, .5, dark, .2, g, 0, 1.6, -13.1);
  const door = box(.12, 4.8, 3, glass(), .05, g, 3.24, 4, 9.6);
  const wheels = []; for (const z of [-8.4, 8.4]) for (const s of [-1, 1]) { const w = cyl(1.3, 1.3, .9, mat(0x161618), 18, g, s * 3, 1.3, z); w.rotation.z = Math.PI / 2; cyl(.6, .6, .95, mat(0xc0c0c8, { metalness: .8 }), 12, g, s * 3, 1.3, z).rotation.z = Math.PI / 2; wheels.push(w); }
  if (rusty) { const r = RNG(9); for (let k = 0; k < 16; k++) { const p = box(.12, .6 + r() * 1.4, .8 + r() * 2, mat([0x8a4a1a, 0xa85a20, 0x6a3a14][k % 3], { roughness: 1 }), .1, g, (k % 2 ? 1 : -1) * 3.24, 2.8 + r() * 4, -12 + r() * 24); }
    const pt = box(.14, 1.4, 1.4, mat(0x7a8a6a), .1, g, 3.25, 3.5, 2); pt.rotation.x = .3; }
  g.userData = { door, wheels, engine: new THREE.Vector3(0, 3, -13) }; g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g;
}
export function sportsCar(parent) {   // deportivo amarillo bajo, alerón, llantas doradas
  const g = new THREE.Group(); parent.add(g); const b = mat(0xffc400, { roughness: .18, metalness: .45 }), k = mat(0x111111, { roughness: .3 });
  box(5.4, 1.4, 11, b, .6, g, 0, 1.4, 0); const cab = box(4.4, 1.3, 4.6, glass(), .6, g, 0, 2.6, -.8); box(4.6, .2, 4.8, b, .1, g, 0, 3.25, -.8);
  box(5, .2, 1.4, k, .1, g, 0, 2.7, -5.2); for (const s of [-1, 1]) box(.2, .9, .3, k, .05, g, s * 2, 2.2, -5.2);
  for (const s of [-1, 1]) { box(1.4, .3, .1, mat(0xffffff, { emissive: 0xfff4c0, emissiveIntensity: 3 }), .1, g, s * 1.7, 1.6, 5.52); box(1.4, .3, .1, mat(0xff2a2a, { emissive: 0xff2a2a, emissiveIntensity: 2 }), .1, g, s * 1.7, 1.7, -5.52); box(.1, .5, 3, k, .05, g, s * 2.72, 1.2, .6); }
  box(1.2, .14, 5, k, .05, g, 0, 2.12, 2.8);
  const wheels = []; for (const z of [-3.6, 3.6]) for (const s of [-1, 1]) { const w = cyl(1.0, 1.0, .8, k, 18, g, s * 2.6, 1.0, z); w.rotation.z = Math.PI / 2; cyl(.55, .55, .85, gold(), 10, g, s * 2.6, 1.0, z).rotation.z = Math.PI / 2; wheels.push(w); }
  g.userData.wheels = wheels; g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g;
}
export function jet(parent) {   // jet privado blanco con raya dorada, ventanillas, motores traseros
  const g = new THREE.Group(); parent.add(g); const w = mat(0xf6f6f8, { roughness: .25, metalness: .3 });
  const f = cyl(1.6, 1.6, 18, w, 24, g, 0, 0, 0); f.rotation.x = Math.PI / 2; const n = sphere(1.6, w, g, 0, 0, 9, 24, 16); n.scale.z = 2; const tl = cyl(1.6, .5, 5, w, 24, g, 0, .3, -11.4); tl.rotation.x = -Math.PI / 2;
  const st = cyl(1.62, 1.62, 18, gold(), 24, g, 0, -.5, 0); st.rotation.x = Math.PI / 2; st.scale.set(1, 1, .14);
  for (let k = 0; k < 7; k++) for (const s of [-1, 1]) { const q = cyl(.32, .32, .1, mat(0x1a2a4a, { emissive: 0x3a8ad8, emissiveIntensity: .5 }), 12, g, s * 1.58, .4, 6 - k * 2); q.rotation.z = Math.PI / 2; }
  box(1.8, .9, .1, mat(0x1a2a4a, { roughness: .05 }), .3, g, 0, .9, 11.6).rotation.x = -.8;
  const wg = box(22, .3, 4, w, .15, g, 0, -.6, 1); for (const s of [-1, 1]) box(.3, 1.6, 1.6, gold(), .1, g, s * 11, .2, .2);
  box(.3, 4.6, 3, w, .15, g, 0, 2.6, -12.5).rotation.x = -.4; box(7, .3, 2, w, .1, g, 0, 4.6, -13.6);
  for (const s of [-1, 1]) { const e = cyl(.8, .7, 3.4, mat(0xc0c4cc, { metalness: .7, roughness: .25 }), 16, g, s * 2.3, .9, -8); e.rotation.x = Math.PI / 2; }
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g;
}

// ---------- casas ----------
const WALLS = [0xf6d6a8, 0xa8d0f0, 0xf6b8c8, 0xc8e8b0, 0xe8e0d0, 0xd8c0f0, 0xffe08a, 0xb8e0d8];
export function house(parent, x, z, ci, ry = 0) {   // casa de barrio con porche, ventanas con contraventanas, jardinera, buzón y valla
  const root = new THREE.Group(); root.position.set(x, 0, z); root.rotation.y = ry; parent.add(root); const g = new THREE.Group(); root.add(g);
  const sid = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.1)'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 2); }, true); sid.repeat.set(4, 3);
  const wall = mat(WALLS[ci % 8], { roughness: .8, map: sid }), trim = mat(0xffffff, { roughness: .6 });
  box(16, 10, 13, wall, .1, g, 0, 5, 0); box(16.4, .5, 13.4, trim, .05, g, 0, 10.1, 0);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(.01, 11.8, 6, 4, 1, false, Math.PI / 4), mat(0xffffff, { roughness: .7, map: (() => { const t = canvasTex(64, 64, (c, w, h) => { c.fillStyle = ['#b8423a', '#3a5a8a', '#6a4a2a', '#4a6a4a'][ci % 4]; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < h; y += 8) { c.fillRect(0, y, w, 2); for (let x = (y % 16) ? 0 : 6; x < w; x += 12) c.fillRect(x, y, 2, 8); } }, true); t.repeat.set(6, 3); return t; })() }));
  roof.scale.set(1, 1, .82); roof.position.y = 13.2; roof.castShadow = true; g.add(roof); box(1.6, 4, 1.6, mat(0x9a4a3a), .1, g, 4, 14, -2);
  for (const wx of [-5, 5]) for (const wy of [3.8, 7.6]) { if (wx < 0 && wy < 5) continue; box(2.8, 2.4, .3, glass(), .05, g, wx, wy, 6.55); box(3.3, .35, .6, trim, .05, g, wx, wy - 1.4, 6.7); for (const s of [-1, 1]) box(.7, 2.6, .12, mat([0x2f6a9a, 0x3a8a5a, 0x9a3a3a, 0x5a3a8a][ci % 4]), .03, g, wx + s * 1.9, wy, 6.7);
    if (wy < 5) { box(3, .5, .7, mat(0x8a5a30), .05, g, wx, wy - 1.8, 6.95); for (let k = 0; k < 4; k++) sphere(.3, mat([0xff4a6a, 0xffd23f, 0xff8ad0, 0xffffff][k]), g, wx - 1 + k * .66, wy - 1.4, 7.0, 8, 6); } }
  const dm = new THREE.Group(); dm.position.set(-6.6, 0, 6.6); g.add(dm); box(3, 5.6, .3, mat([0xd8323a, 0x2a6a4a, 0x2a4a8a, 0xffb21a][ci % 4], { roughness: .4 }), .06, dm, 1.5, 2.8, 0); sphere(.17, gold(), dm, 2.7, 2.8, .25);
  box(4, .4, 3, mat(0xc8beb4), .05, g, -5.2, .2, 8); for (const s of [-1, 1]) cyl(.2, .2, 5.6, trim, 8, g, -5.2 + s * 1.8, 3, 9.2); box(4.4, .3, 3.4, trim, .05, g, -5.2, 5.9, 8.2);
  const fz = 13; for (let k = -7; k <= 7; k++) { if (Math.abs(k + 5) < 2) continue; box(.3, 1.6, .2, trim, .05, g, k * 1.1, .8, fz); } box(16, .2, .15, trim, .02, g, 0, 1.2, fz);
  const mb = new THREE.Group(); mb.position.set(6, 0, fz + .6); g.add(mb); cyl(.12, .12, 2.4, mat(0x6a4a2a), 6, mb, 0, 1.2, 0); box(.9, .8, 1.4, mat(0x2a6ad8, { roughness: .3 }), .3, mb, 0, 2.6, 0); box(.1, .5, .2, mat(0xd8323a), .02, mb, .5, 3, .3);
  for (const s of [-1, 1]) sphere(1.3, mat(0x2f8a3e, { roughness: 1 }), g, s * 6.8, 1.1, 7.6, 12, 8);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), mat(0xffffff, { map: noiseTex('#5fcf4a', ['#4fb83c', '#6cd858'], 900, 2, 2) })); lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, .05, 9.6); lawn.receiveShadow = true; root.add(lawn);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return { root, g, door: dm, roof };
}
export function villa(parent, x, z, ry = 0) {   // villa: dos alturas, columnas, balcón, verja dorada, palmeras y fuente
  const root = new THREE.Group(); root.position.set(x, 0, z); root.rotation.y = ry; parent.add(root); const wh = mat(0xfaf6ee, { roughness: .55 }), g_ = gold();
  box(34, 20, 16, wh, .2, root, 0, 10, -4); box(35, 1, 17, mat(0xe8e0d0), .1, root, 0, 20.4, -4); box(14, 8, 12, wh, .2, root, 0, 24.4, -4); box(15, .8, 13, mat(0xe8e0d0), .1, root, 0, 28.8, -4);
  for (let k = 0; k < 6; k++) { const xx = -12.5 + k * 5; cyl(.8, .9, 18, wh, 16, root, xx, 9.4, 5); box(2, .6, 2, mat(0xe8e0d0), .05, root, xx, 18.6, 5); }
  box(30, .6, 4, mat(0xe8e0d0), .1, root, 0, 10.2, 5.4); for (let k = 0; k < 24; k++) cyl(.15, .15, 1.6, wh, 6, root, -14 + k * 1.22, 11.3, 7.1); box(30, .3, .3, wh, .05, root, 0, 12.1, 7.1);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) { box(2.6, 5, .2, glass(), .05, root, -12.5 + k * 5 + 2.5, 5 + r * 8.6, 4.05); }
  box(4.4, 7.4, .3, mat(0x5a2a14, { roughness: .3 }), .1, root, 0, 3.7, 4.1); for (const s of [-1, 1]) sphere(.25, g_, root, s * .5, 3.8, 4.4);
  for (let k = 0; k < 4; k++) box(14 - k * 1.2, .5, 2, mat(0xe8e0d0), .05, root, 0, .25 + k * .5, 8 - k * .8);
  for (let k = -12; k <= 12; k++) { if (Math.abs(k) < 3) continue; cyl(.12, .12, 4, g_, 6, root, k * 1.4, 2, 18); sphere(.2, g_, root, k * 1.4, 4.1, 18, 8, 6); } box(34, .25, .2, g_, .05, root, 0, 3.4, 18);
  for (const s of [-1, 1]) { box(1.4, 6, 1.4, wh, .1, root, s * 3.6, 3, 18); sphere(.9, g_, root, s * 3.6, 6.6, 18, 12, 8); }
  for (const s of [-1, 1]) { const p = new THREE.Group(); p.position.set(s * 20, 0, 12); root.add(p); for (let k = 0; k < 6; k++) cyl(.55 - k * .04, .6 - k * .04, 2.4, mat(0x9a7a4a), 8, p, Math.sin(k * .3) * .4, 1.2 + k * 2.3, 0); for (let k = 0; k < 7; k++) { const l = box(5, .2, 1.2, mat(0x2fa84a), .1, p, Math.cos(k * .9) * 2.2, 14, Math.sin(k * .9) * 2.2); l.rotation.y = -k * .9; l.rotation.z = -.4; } }
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), mat(0xffffff, { map: noiseTex('#5fcf4a', ['#4fb83c', '#6cd858'], 1800, 2, 6) })); lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, .04, 6); lawn.receiveShadow = true; root.add(lawn);
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return root;
}

// ---------- clima ----------
export function rainSet(scene, n = 260) { const m = B([.7, .85, 1.1]); m.opacity = .55; const ps = []; for (let k = 0; k < n; k++) { const d = new THREE.Mesh(new THREE.BoxGeometry(.05, 1.3, .05), m); scene.add(d); ps.push(d); }
  return { ps, at(c, T, on = 1, R = 14, Hh = 18) { ps.forEach((p, k) => { p.visible = on > 0 && k < n * on; const r = RNG(k * 7 + 3); const ph = (T * 1.6 + r()) % 1; p.position.set(c.x + (r() - .5) * R * 2, c.y + Hh - ph * Hh, c.z + (r() - .5) * R * 2); p.rotation.z = .12; }); } }; }
export function stormCloud(scene) { const g = new THREE.Group(); scene.add(g); const ms = [mat(0x5a6272, { roughness: 1 }), mat(0x4a5060, { roughness: 1 }), mat(0x6a7282, { roughness: 1 })]; for (let k = 0; k < 14; k++) sphere(2.4 + (k % 3) * .9, ms[k % 3], g, Math.sin(k * 2.1) * 6, (k % 4) * .9, Math.cos(k * 1.7) * 3, 14, 10); g.traverse(o => { if (o.isMesh) o.castShadow = false; }); return g; }
export function bolt(scene) { const g = new THREE.Group(); scene.add(g); const m = B([1.7, 1.7, 1.1]); const r = RNG(77); let x = 0, y = 0; for (let k = 0; k < 9; k++) { const nx = x + (r() - .5) * 3, ny = y - 2.4; const len = Math.hypot(nx - x, ny - y); const s = box(.32, len, .32, m, 0, g, (x + nx) / 2, (y + ny) / 2, 0); s.rotation.z = Math.atan2(nx - x, ny - y) * -1; x = nx; y = ny; } const glow = sphere(1.2, B([1.4, 1.4, 1]), g, x, y, 0, 12, 8); glow.material.opacity = .25; return g; }
export function rainbow(scene) { const g = new THREE.Group(); scene.add(g); [[3, .2, .2], [3, 1.3, .1], [3, 2.8, .3], [.3, 2.4, .4], [.3, 1.2, 3], [1.2, .3, 2.6], [2.2, .3, 2.4]].forEach((c, k) => { const m = B(c); m.opacity = .55; const t = new THREE.Mesh(new THREE.TorusGeometry(40 - k * 1.6, .85, 8, 80, Math.PI), m); g.add(t); }); return g; }

// ---------- escenarios ----------
// barrio: calle con casas a ambos lados, árboles, farolas (X = 300)
export function suburb(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const asphalt = noiseTex('#3a4458', ['#323c50', '#424c60'], 2000, 2, 1); asphalt.repeat.set(2, 40); const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 240), mat(0xffffff, { roughness: .9, map: asphalt })); road.rotation.x = -Math.PI / 2; road.position.set(0, .07, -60); road.receiveShadow = true; g.add(road);
  for (let z = 50; z > -170; z -= 7) box(.35, .04, 3, mat(0xf4f4f4), 0, g, 0, .1, z); for (const s of [-1, 1]) box(4, .3, 240, mat(0xd8d4cc), .05, g, s * 9, .15, -60);
  const houses = []; let ci = 0; for (let z = 20; z > -150; z -= 24) for (const s of [-1, 1]) { houses.push(house(g, s * 25, z, ci++, s > 0 ? -Math.PI / 2 : Math.PI / 2)); tree(g, s * 13, z - 11, .9); }
  for (let z = 30; z > -150; z -= 30) for (const s of [-1, 1]) { cyl(.15, .2, 9, mat(0x2a2e3a, { metalness: .6 }), 8, g, s * 11.5, 4.5, z); sphere(.5, mat(0xfff8e0, { emissive: 0xffc870, emissiveIntensity: .4 }), g, s * 11.5, 9.2, z); }
  return { g, houses }; }
// campo: carretera comarcal con colinas, vallas, postes y campos (X = 600)
export function country(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const asphalt = noiseTex('#46464e', ['#3e3e46', '#50505a'], 2000, 2, 1); asphalt.repeat.set(2, 50); const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 400), mat(0xffffff, { roughness: .9, map: asphalt })); road.rotation.x = -Math.PI / 2; road.position.set(0, .07, -100); road.receiveShadow = true; g.add(road);
  for (let z = 80; z > -280; z -= 8) box(.35, .04, 4, mat(0xffd23f), 0, g, 0, .1, z);
  const r = RNG(11); for (let k = 0; k < 12; k++) { const s = k % 2 ? 1 : -1, hl = sphere(30 + r() * 30, mat(0x5fbf4a, { roughness: 1 }), g, s * (70 + r() * 60), -18, -40 - k * 30, 24, 12); hl.scale.y = .5; }
  for (let z = 70; z > -260; z -= 6) for (const s of [-1, 1]) { box(.25, 1.6, .25, mat(0xb88a5a), .03, g, s * 10, .8, z); box(.15, .2, 6, mat(0xd8a868), .02, g, s * 10, 1.3, z - 3); }
  for (let z = 60; z > -260; z -= 26) { cyl(.25, .3, 14, mat(0x7a5a3a), 8, g, -14, 7, z); box(4, .3, .3, mat(0x7a5a3a), .05, g, -14, 13, z); } for (let k = 0; k < 14; k++) tree(g, (k % 2 ? 1 : -1) * (20 + (k * 7) % 16), 40 - k * 22, .9 + (k % 3) * .2);
  const sign = new THREE.Group(); sign.position.set(9, 0, -20); g.add(sign); cyl(.15, .15, 6, mat(0x9aa0aa, { metalness: .6 }), 8, sign, 0, 3, 0); const sp = label(4, 1.6, 'HALTESTELLE', '#1fae5a', '#fff', 40); sp.position.set(0, 6.4, .1); sign.add(sp);
  return g; }
// cabina de lotería en la acera
export function lottoBooth(parent, x, z, ry = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
  box(10, 8, 6, mat(0xff4a8a, { roughness: .5 }), .3, g, 0, 4, 0); box(10.6, 1, 6.6, mat(0xffd23f, { roughness: .4 }), .2, g, 0, 8.5, 0); box(8, 3.4, .2, glass(), .05, g, 0, 5.2, 3.02); box(8.4, .5, 1.6, mat(0xffffff), .1, g, 0, 3.4, 3.5);
  const s = label(9, 1.8, 'LOTTO · JACKPOT', '#1d2238', '#ffd23f', 66, .9); s.position.set(0, 10.2, 3.1); g.add(s);
  for (let k = 0; k < 14; k++) sphere(.22, mat(0xffffff, { emissive: 0xfff2a0, emissiveIntensity: 2.4 }), g, -4.8 + k * .74, 9.4, 3.4, 8, 6);
  const scr = screen(3.6, 2.2, 360, 220, 1.5); scr.position.set(-3, 5.4, 3.2); g.add(scr);
  for (let k = 0; k < 5; k++) { const b = sphere(.5, mat([0xff3a4a, 0x3fa8ff, 0xffd23f, 0x2ec46a, 0x9b5de5][k], { roughness: .2 }), g, 1.2 + k * 1.1, 5.4, 2.2, 14, 10); }
  g.userData.scr = scr; g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; }
// fachada del Pech-Amt (sustituye al ayuntamiento al fondo de la avenida)
export function pechAmtFront(parent, z) { const g = new THREE.Group(); g.position.z = z; parent.add(g); const wh = mat(0xeaf6f2, { roughness: .6 }), tl = mat(0x1aa88a, { roughness: .5 });
  for (let k = 0; k < 5; k++) box(46 - k * 1.6, .8, 14 - k * 1.2, mat(0xdde8e4), .05, g, 0, .4 + k * .8, 14 - k * .6); box(44, 22, 16, wh, .2, g, 0, 15, -2); box(46, 1.6, 18, tl, .1, g, 0, 26.6, -2);
  for (let k = 0; k < 7; k++) { const x = -18 + k * 6; cyl(1.1, 1.2, 16, wh, 20, g, x, 12, 8); box(2.8, .8, 2.8, tl, .05, g, x, 20.4, 8); }
  box(42, 1.4, 3, tl, .1, g, 0, 21.4, 8); const sg = label(22, 3.2, 'PECH-AMT', '#1d2238', '#7affd8', 150, .9); sg.position.set(0, 24.4, 9.7); g.add(sg);
  const logo = new THREE.Group(); logo.position.set(0, 30, 6); g.add(logo); const hs = new THREE.Mesh(new THREE.TorusGeometry(2.6, .6, 10, 30, Math.PI * 1.3), gold()); hs.rotation.z = Math.PI + .5; logo.add(hs);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 7; k++) box(2.6, 4, .2, glass(), .05, g, -18 + k * 6 + 3, 9 + r * 7, 6.05); box(6, 9, .3, mat(0x1a3a3a), .1, g, 0, 7.5, 6.1);
  for (const s of [-1, 1]) { const cat = new THREE.Group(); cat.position.set(s * 8, 4.4, 12); g.add(cat); const k = mat(0x15151a, { roughness: .3, metalness: .4 }); box(1.4, 2.4, 1.6, k, .4, cat, 0, 1.2, 0); box(1.3, 1.2, 1.2, k, .3, cat, 0, 2.9, .3); for (const q of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(.3, .6, 4), k); e.position.set(q * .4, 3.7, .3); cat.add(e); sphere(.12, B([3, 2.6, .4]), cat, q * .3, 3, .92, 8, 6); } }
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; }
function room(scene, x, w, d, h, wallM, floorM) { const g = new THREE.Group(); g.position.x = x; scene.add(g); const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorM); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(w, h, .6, wallM, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.6, h, d, wallM, 0, g, s * w / 2, h / 2, 0); box(w, .8, .7, mat(0xffffff), .05, g, 0, .4, -d / 2 + .3); return g; }
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const tileT = (a, b, n = 8) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 3; for (let i = 0; i <= w; i += w / n) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }, true);
// interior del Pech-Amt: mostrador, escáner, pantalla gigante, carteles y cola (X = 1300)
export function pechAmtIn(scene, X) { const g = room(scene, X, 40, 30, 24, mat(0xffffff, { map: rep(stripes('#d8f4ec', '#c4ece0', 10), 6, 1) }), mat(0xffffff, { map: rep(tileT('#2a3a4a', '#1aa88a'), 6, 5) }));
  const desk = new THREE.Group(); desk.position.set(0, 0, -4); desk.scale.y = .72; g.add(desk); box(16, 4.4, 4, mat(0x1aa88a, { roughness: .4 }), .2, desk, 0, 2.2, 0); box(16.4, .4, 4.4, mat(0xf4f4f4), .1, desk, 0, 4.6, 0); const pl = label(6, 1, 'PECH-PRÜFUNG', '#1d2238', '#7affd8', 46); pl.position.set(0, 3.2, 2.06); desk.add(pl);
  box(3, 2, .2, mat(0x1a1a22), .05, desk, -5, 5.9, 0); cyl(.4, .6, .3, mat(0x333333), 12, desk, -5, 4.9, 0); for (let k = 0; k < 4; k++) box(1.4, .1, 1.8, mat(0xffffff), .01, desk, 4 + k * .05, 4.85 + k * .1, .2);
  const scan = new THREE.Group(); scan.position.set(3, 4.8, -.5); desk.add(scan); cyl(.2, .2, 4, mat(0x9aa0aa, { metalness: .7 }), 8, scan, 0, 2, 0); const head = new THREE.Group(); head.position.set(0, 4, 0); scan.add(head); box(1.6, 1, 1.4, mat(0x2a2e3a, { metalness: .6 }), .2, head, 0, 0, .4); const lens = cyl(.4, .4, .2, B([3, .3, .4]), 16, head, 0, -.1, 1.15); lens.rotation.x = Math.PI / 2;
  const beam = new THREE.Mesh(new THREE.ConeGeometry(2.2, 8, 24, 1, true), B([3, .3, .4])); beam.material.opacity = .22; beam.material.side = THREE.DoubleSide; beam.material.depthWrite = false; scene.add(beam);
  const big = screen(18, 10, 900, 500, 1.4); big.position.set(X, 14, -14.6); scene.add(big); box(19, 11, .6, mat(0x1a1a22), .2, g, 0, 14, -14.9);
  const posters = [['PECH = GELD', '#ff5a85'], ['FORMULAR 13', '#3fa8ff']]; posters.forEach(([t, col], k) => { const p = textPlane(5, 6.5, 200, 260, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = '#1d2238'; c.beginPath(); c.arc(w / 2, 90, 50, 0, 7); c.fill(); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2 - 16, 80, 10, 0, 7); c.arc(w / 2 + 16, 80, 10, 0, 7); c.fill(); txt(c, t, w / 2, 200, 30, '#fff', '#1d2238', 6); }); p.position.set((k ? 1 : -1) * 15, 10, -14.6); g.add(p); });
  for (let k = 0; k < 6; k++) { cyl(.15, .3, 3, mat(0xd9a531, { metalness: .8 }), 8, g, -12 + k * 3.4, 1.5, 6); } box(17, .15, .15, mat(0xd8323a), 0, g, -3.5, 2.6, 6);
  const plant = new THREE.Group(); plant.position.set(17, 0, -11); g.add(plant); cyl(1, .8, 2, mat(0xffffff), 12, plant, 0, 1, 0); for (let k = 0; k < 7; k++) { const l = box(.4, 3, .1, mat(0x2fa84a), .1, plant, Math.sin(k) * .4, 3, Math.cos(k) * .4); l.rotation.set(Math.cos(k) * .5, 0, Math.sin(k) * .5); }
  const L = new THREE.PointLight(0xe8fff8, 560, 80, 2); L.position.set(0, 20, 6); g.add(L);
  return { g, desk, scan, head, beam, big, deskPos: new THREE.Vector3(X, 0, -4) }; }
// baño del amigo (X = 1100)
export function bath(scene, X) { const g = room(scene, X, 28, 22, 20, mat(0xffffff, { map: rep(tileT('#bfe8f4', '#a0d4e4', 6), 5, 4) }), mat(0xffffff, { map: rep(tileT('#f4f4f4', '#d8d8e0', 6), 4, 3) }));
  const t = new THREE.Group(); t.position.set(-2, 0, -7); g.add(t); const w = mat(0xffffff, { roughness: .15 }); cyl(1.3, 1, 2.4, w, 24, t, 0, 1.2, 0); const bowl = cyl(1.6, 1.3, .9, w, 28, t, 0, 2.8, .4); const water = cyl(1.2, 1.2, .1, mat(0x5ac8f0, { roughness: .02, emissive: 0x1a6aa0, emissiveIntensity: .4 }), 24, t, 0, 3.0, .4);
  const seat = new THREE.Mesh(new THREE.TorusGeometry(1.35, .2, 8, 28), w); seat.rotation.x = Math.PI / 2; seat.position.set(0, 3.3, .4); t.add(seat); const lid = cyl(1.5, 1.5, .15, w, 24, t, 0, 4.4, -1.1); lid.rotation.x = -1.4; box(3.2, 3.4, 1.4, w, .3, t, 0, 4.2, -1.8); box(.6, .2, .3, mat(0xc0c0c8, { metalness: .9 }), .05, t, .8, 6, -1.8);
  const sink = new THREE.Group(); sink.position.set(7, 0, -9); g.add(sink); box(5, .8, 3, w, .3, sink, 0, 5, 0); cyl(.2, .2, 5, w, 10, sink, 0, 2.5, 0); box(.3, 1, .3, mat(0xc0c0c8, { metalness: .9 }), .05, sink, 0, 5.8, -1); box(4.4, 5, .2, mat(0xcfe6f2, { metalness: .2, roughness: .05, emissive: 0x8ab8d0, emissiveIntensity: .3 }), .1, g, 7, 10, -10.6);
  const roll = cyl(.6, .6, 1, w, 16, g, 2, 4.5, -10.2); roll.rotation.z = Math.PI / 2; const towel = box(2.6, 3.6, .2, mat(0xff8ad0, { roughness: 1 }), .1, g, -9, 7, -10.6); const plantB = sphere(1, mat(0x2fa84a), g, -12, 1.5, -9, 10, 8);
  const L = new THREE.PointLight(0xfff6e8, 380, 60, 2); L.position.set(0, 15, 4); g.add(L);
  return { g, toilet: t, water, bowlPos: new THREE.Vector3(X - 2, 3.1, -6.6) }; }
// cámara acorazada del banco (X = 1200)
export function vault(scene, X) { const g = room(scene, X, 34, 26, 22, mat(0xffffff, { map: rep(tileT('#8a8f9a', '#6a6f7a', 4), 6, 4) }), mat(0xffffff, { map: rep(tileT('#c8c0b0', '#a89c88', 4), 5, 4) }));
  const st = mat(0xb8bcc4, { metalness: .85, roughness: .25 }); const door = new THREE.Group(); door.position.set(0, 9, -12.4); g.add(door); const d = cyl(7, 7, 1.6, st, 48, door, 0, 0, 0); d.rotation.x = Math.PI / 2; const rim = new THREE.Mesh(new THREE.TorusGeometry(7.2, .5, 10, 48), mat(0x8a8f9a, { metalness: .9, roughness: .2 })); door.add(rim);
  const wheel = new THREE.Group(); wheel.position.z = 1; door.add(wheel); const wr = new THREE.Mesh(new THREE.TorusGeometry(2.2, .25, 8, 32), gold()); wheel.add(wr); for (let k = 0; k < 3; k++) { const s = box(4.6, .3, .3, gold(), .05, wheel, 0, 0, 0); s.rotation.z = k * Math.PI / 3; }
  for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; const b = cyl(.4, .4, .6, mat(0x6a6f7a, { metalness: .9 }), 12, door, Math.cos(a) * 6, Math.sin(a) * 6, .9); b.rotation.x = Math.PI / 2; }
  const chains = new THREE.Group(); chains.position.set(0, 9, -11); g.add(chains); for (const s of [-1, 1]) for (let k = 0; k < 18; k++) { const l = new THREE.Mesh(new THREE.TorusGeometry(.45, .14, 6, 14), mat(0x9aa0aa, { metalness: .9, roughness: .3 })); l.position.set((k - 8.5) * .8, s * (k - 8.5) * .55, 0); l.rotation.set(k % 2 ? Math.PI / 2 : 0, 0, s * -.6); chains.add(l); }
  const lock = new THREE.Group(); lock.position.set(0, 9, -10.4); g.add(lock); box(2.6, 2.4, 1, gold(), .3, lock, 0, -.6, 0); const sh = new THREE.Mesh(new THREE.TorusGeometry(.9, .22, 8, 20, Math.PI), mat(0xc0c0c8, { metalness: .9 })); sh.position.y = .6; lock.add(sh); cyl(.2, .2, .2, mat(0x111111), 8, lock, 0, -.6, .55).rotation.x = Math.PI / 2;
  const sg = label(8, 1.4, 'SPARKONTO · GESPERRT BIS 18', '#d8323a', '#fff', 40, .8); sg.position.set(0, 18, -12.6); g.add(sg);
  for (let k = 0; k < 8; k++) { const bx = box(1.6, 1.2, 1, gold(), .1, g, -14 + (k % 4) * 1.7, .6 + Math.floor(k / 4) * 1.2, -10); }
  const L = new THREE.PointLight(0xffe8c0, 520, 70, 2); L.position.set(0, 18, 4); g.add(L); return { g, door, wheel, chains, lock }; }
export const freeCard = (scene) => { const p = textPlane(2.4, 1.5, 480, 300, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#ffd23f'); gr.addColorStop(1, '#ff8a23'); c.fillStyle = gr; c.beginPath(); c.roundRect(0, 0, w, h, 30); c.fill(); txt(c, 'FREIKARTE', w / 2, 90, 64, '#1d2238'); txt(c, 'LEBENSLANG', w / 2, 170, 52, '#fff', '#1d2238', 8); txt(c, 'LINIE 7', w / 2, 245, 36, '#1d2238'); }, .4); p.material.side = THREE.DoubleSide; scene.add(p); return p; };
export const ticket = (scene) => { const p = textPlane(1.6, 1, 320, 200, (c, w, h) => { c.fillStyle = '#fff6d8'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff4a8a'; c.fillRect(0, 0, w, 50); txt(c, 'LOTTO', w / 2, 27, 36, '#fff'); for (let k = 0; k < 6; k++) { c.fillStyle = '#1d2238'; c.beginPath(); c.arc(40 + k * 48, 120, 18, 0, 7); c.fill(); txt(c, String([7, 13, 21, 4, 33, 9][k]), 40 + k * 48, 121, 20, '#ffd23f'); } txt(c, 'NR. 000777', w / 2, 175, 26, '#1d2238'); }, .3); p.material.side = THREE.DoubleSide; scene.add(p); return p; };
export function wrench(scene) { const g = new THREE.Group(); scene.add(g); const m = mat(0xc0c4cc, { metalness: .9, roughness: .2 }); box(.25, 2.2, .14, m, .05, g, 0, 0, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.35, .14, 6, 16, Math.PI * 1.4), m); h.position.y = 1.2; h.rotation.z = -.6; g.add(h); box(.32, .7, .2, mat(0xd8323a), .05, g, 0, -.8, 0); return g; }
export function phoneFall(scene) { const g = new THREE.Group(); scene.add(g); box(.7, 1.3, .1, mat(0x1a1a22, { metalness: .6, roughness: .3 }), .08, g, 0, 0, 0); const s = box(.6, 1.15, .02, mat(0x3a8ad8, { emissive: 0x3a8ad8, emissiveIntensity: 1 }), .02, g, 0, 0, .06); return g; }

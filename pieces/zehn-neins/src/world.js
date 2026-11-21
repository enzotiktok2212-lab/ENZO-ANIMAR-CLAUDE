// Zehn Neins: reparto propio (cada uno con otra ropa, pelo y color) y el barrio nevado.
import { THREE, RNG, canvasTex, mat, box, cyl, sphere, textPlane, checkTex, character, rrect } from './engine.js';
import { FONT } from './sets.js';

const gold = () => mat(0xd9a531, { metalness: .8, roughness: .25 });
const stripeTex = (a, b, n = 8) => canvasTex(64, 64, (c, w, h) => { for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? b : a; c.fillRect(0, i * h / n, w, h / n); } }, true);

// ---------- reparto ----------
export function makeKid(scene) {   // el narrador: pelo rojo rizado, gorro verde con pompón, jersey a rayas, gafas
  return character(scene, { seed: 5, scale: 0.78, headScale: 1.1, skin: 0xf7d6be, skinCss: '#f7d6be', shirtMap: stripeTex('#2f9a5a', '#f4f1e6'), cuffs: 0x2f9a5a,
    pants: 0x3b5fa8, shoes: 0xd8323a, sole: 0xffffff, belt: 0x3b5fa8,
    face: { iris: '#4a8a3a', freckles: 1, browColor: '#b8461e' },
    hairBuild: (h) => { const m = mat(0xc8501e, { roughness: .7 });
      for (const [x, y, z] of [[-.6, .8, .3], [.6, .8, .3], [-.65, .7, -.2], [.65, .7, -.2], [0, .85, -.6], [-.4, .75, -.55], [.4, .75, -.55]]) sphere(.3, m, h, x, y, z, 12, 8);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(.78, 24, 12, 0, 6.283, 0, Math.PI / 2), mat(0x2f8a4a, { roughness: .9 })); cap.scale.set(1, .85, 1); cap.position.y = 1.15; h.add(cap);
      cyl(.8, .8, .3, mat(0x1f6a3a, { roughness: .9 }), 24, h, 0, 1.2, 0); sphere(.28, mat(0xffffff, { roughness: 1 }), h, 0, 1.92, 0, 12, 8);
      const fr = mat(0x222222, { metalness: .5 }); for (const s of [-1, 1]) { const g = new THREE.Mesh(new THREE.TorusGeometry(.2, .04, 8, 20), fr); g.position.set(s * .29, .86, .64); h.add(g); }
      box(.2, .04, .04, fr, 0, h, 0, .88, .64); } });
}
export function makeMama(scene) {   // moño rubio oscuro, cárdigan burdeos, pantalón gris
  return character(scene, { seed: 8, scale: 0.98, skin: 0xf0c6a6, skinCss: '#f0c6a6', shirt: 0x8a2a3e, shirt2: 0x8a2a3e, cuffs: 0xf2e6d0, pants: 0x6a6e78, shoes: 0x3a2a22, sole: 0x111111, noBelt: true,
    face: { iris: '#5a7aa8', blush: .5, browColor: '#8a6a3a' },
    torsoDetail: (sp) => { box(.6, 1.9, .06, mat(0xf2e6d0), .02, sp, 0, 1.05, .56); for (let i = 0; i < 4; i++) sphere(.07, gold(), sp, .38, .4 + i * .42, .58); },
    hairBuild: (h) => { const m = mat(0xa8803e, { roughness: .6 }); box(1.42, .36, 1.32, m, .15, h, 0, 1.22, -.02); box(1.42, .95, .32, m, .12, h, 0, .9, -.52); sphere(.42, m, h, 0, 1.25, -.75); for (const s of [-1, 1]) box(.16, .6, .4, m, .06, h, s * .69, .78, .25); } });
}
export function makeBuyer(scene) {   // el Comprador: muy alto, traje negro, sombrero, sonrisa fija, maletín
  const o = character(scene, { seed: 13, scale: 1.32, skin: 0xe8d8cc, skinCss: '#e8d8cc', shirt: 0x15141a, shirt2: 0x15141a, cuffs: 0xffffff, pants: 0x15141a, shoes: 0x050505, sole: 0x050505, belt: 0x050505,
    face: { iris: '#2a2a3a', mouth: 'grin', browColor: '#4a4a52' },
    torsoDetail: (sp) => { const w = mat(0xffffff); box(.62, 1.4, .06, w, .02, sp, 0, 1.35, .56); box(.18, 1.1, .08, mat(0x050505), .03, sp, 0, 1.35, .6);
      for (const s of [-1, 1]) { const l = box(.36, 1.2, .08, mat(0x222028), .03, sp, s * .36, 1.45, .62); l.rotation.z = s * .35; } box(.3, .16, .05, mat(0xffffff), .02, sp, -.6, 1.55, .6); },
    hairBuild: (h) => { const m = mat(0x8a8a92, { roughness: .3 }); box(1.4, .3, 1.3, m, .14, h, 0, 1.2, 0); box(1.42, .7, .3, m, .1, h, 0, .9, -.52);
      const hm = mat(0x0a0a0e, { roughness: .5 }); cyl(1.05, 1.05, .1, hm, 32, h, 0, 1.38, 0); cyl(.7, .72, 1.0, hm, 24, h, 0, 1.9, 0); cyl(.73, .73, .2, mat(0x6a1020), 24, h, 0, 1.5, 0); } });
  const bc = new THREE.Group(); bc.position.set(0, -.9, .1); o.aR.hand.add(bc);
  box(1.8, 1.25, .5, mat(0x0c0c10, { roughness: .35 }), .1, bc, 0, -.7, 0); box(.6, .2, .2, mat(0x0c0c10), .06, bc, 0, .05, 0);
  for (const s of [-1, 1]) box(.2, .14, .06, gold(), .03, bc, s * .5, -.2, .27);
  o.props.case = bc; return o;
}
export function makeBrandt(scene) {   // vecino mayor: calvo, bigote blanco, bata azul a cuadros, zapatillas de peluche rosas
  const o = character(scene, { seed: 17, scale: 0.98, skin: 0xe9b896, skinCss: '#e9b896', shirtMap: checkTex('#3a5a9a', '#24386a', 5), cuffs: 0x24386a, pants: 0xe8e2d6,
    shoes: 0xf2a6c2, sole: 0xf2a6c2, noBelt: true, skirt: 0x2f4a86, face: { iris: '#5a6a7a', browColor: '#e8e8e8', mouthY: 14 },
    torsoDetail: (sp) => { box(2.12, .25, 1.16, mat(0x7a1a2a), .06, sp, 0, .25, 0); for (const s of [-1, 1]) { const l = box(.36, 1.3, .08, mat(0x24386a), .03, sp, s * .35, 1.4, .58); l.rotation.z = s * .4; } },
    hairBuild: (h) => { const m = mat(0xf0f0f0, { roughness: .8 }); for (const s of [-1, 1]) box(.28, .5, 1.0, m, .12, h, s * .67, .85, -.1); box(1.36, .45, .3, m, .12, h, 0, .78, -.52);
      box(.9, .26, .14, m, .1, h, 0, .42, .65); const fr = mat(0x8a6a2a, { metalness: .6 }); for (const s of [-1, 1]) { const g = new THREE.Mesh(new THREE.TorusGeometry(.2, .035, 8, 20), fr); g.position.set(s * .29, 1.2, .5); g.rotation.x = -.6; h.add(g); } } });
  for (const l of [o.lL, o.lR]) sphere(.5, mat(0xf7b8d0, { roughness: 1 }), l.kn, 0, -.85, .4, 12, 8);
  return o;
}
const KIDS = [[0x4fb6e8, 0xf2c23a, 0x101010, 0xc68b5e], [0xf28a3a, 0x6a3a8a, 0xe8c25a, 0xf7d6be], [0xd84a8a, 0x2a4a6a, 0x5a3420, 0x8d5a3b], [0x7ad04a, 0x8a2a2a, 0x2a1a10, 0xf0c4a2]];
export function makeChild(scene, i) {   // niños con colores distintos
  const [sh, pa, hr, sk] = KIDS[i % 4];
  return character(scene, { seed: 30 + i, scale: .72, headScale: 1.12, skin: sk, skinCss: '#' + sk.toString(16).padStart(6, '0'), shirt: sh, shirt2: sh, pants: pa, shoes: 0x2a2a3a, hair: hr, face: { blush: .6 },
    hairBuild: i % 2 ? undefined : (h, m) => { box(1.42, .4, 1.32, mat(hr), .15, h, 0, 1.22, -.02); box(1.42, .9, .34, mat(hr), .12, h, 0, .9, -.52); for (const s of [-1, 1]) sphere(.3, mat(hr), h, s * .78, .9, -.2); } });
}
const ADULTS = [[0x3a6a8a, 0x2a2a3a, 0x3a2a1a, 0xf0c4a2, 'cap'], [0xa86a2a, 0x3a3a4a, 0xd8d0c0, 0xe8b896, 'bald'], [0x5a8a4a, 0x2a2a2a, 0x101010, 0x8d5a3b, 'bun'], [0x8a4aa8, 0x3a3048, 0xd8a840, 0xf3cbb0, 'long'], [0xc84a3a, 0x24304a, 0x6a3a1a, 0xc68b5e, 'cap'], [0x2a8a8a, 0x4a3a2a, 0x2a1a10, 0xf0c4a2, 'long']];
export function makeAdult(scene, i) {
  const [sh, pa, hr, sk, st] = ADULTS[i % ADULTS.length], hm = mat(hr, { roughness: .6 });
  return character(scene, { seed: 50 + i, skin: sk, skinCss: '#' + sk.toString(16).padStart(6, '0'), shirt: sh, shirt2: sh, cuffs: 0xf2f2f2, pants: pa, shoes: 0x2a1a10,
    torsoDetail: (sp) => { box(2.14, .4, 1.18, mat(i % 2 ? 0xe8e0d0 : 0xb83a3a, { roughness: 1 }), .15, sp, 0, 1.9, 0); },
    hairBuild: (h) => { if (st !== 'bald') { box(1.42, .38, 1.32, hm, .15, h, 0, 1.22, -.02); box(1.42, .9, .32, hm, .12, h, 0, .9, -.52); }
      if (st === 'long') for (const s of [-1, 1]) box(.3, 1.3, .9, hm, .12, h, s * .7, .5, -.2);
      if (st === 'bun') sphere(.4, hm, h, 0, 1.5, -.4);
      if (st === 'cap') { cyl(.78, .8, .5, mat(0xd8323a, { roughness: 1 }), 20, h, 0, 1.45, 0); sphere(.24, mat(0xffffff), h, 0, 1.8, 0); }
      if (st === 'bald') for (const s of [-1, 1]) box(.28, .45, .9, hm, .1, h, s * .67, .85, -.1); } });
}
export function makeDog(scene) {   // Keks: perro dorado de bloques
  const g = new THREE.Group(); scene.add(g); const f = mat(0xd9a046, { roughness: .9 }), d = mat(0x8a5a2a);
  const body = box(1.4, 1.2, 2.6, f, .4, g, 0, 1.7, 0);
  const head = new THREE.Group(); head.position.set(0, 2.6, 1.4); g.add(head);
  box(1.2, 1.1, 1.1, f, .35, head, 0, 0, 0); box(.7, .5, .6, mat(0xe8c080), .2, head, 0, -.2, .7); sphere(.16, mat(0x111111), head, 0, -.02, 1.02);
  for (const s of [-1, 1]) { sphere(.12, mat(0x111111), head, s * .3, .2, .56); const e = box(.3, .8, .5, d, .12, head, s * .62, -.1, 0); e.rotation.z = s * .2; }
  const tongue = box(.25, .05, .35, mat(0xff6f8a), .03, head, 0, -.45, .85);
  box(1.0, .2, .2, mat(0xd8323a), .05, head, 0, -.65, .2); const tag = cyl(.15, .15, .04, gold(), 12, head, 0, -.85, .35); tag.rotation.x = Math.PI / 2;
  const legs = []; for (const [x, z] of [[-.45, .9], [.45, .9], [-.45, -.9], [.45, -.9]]) { const l = new THREE.Group(); l.position.set(x, 1.2, z); g.add(l); box(.38, 1.2, .38, f, .12, l, 0, -.6, 0); legs.push(l); }
  const tail = new THREE.Group(); tail.position.set(0, 2.1, -1.3); g.add(tail); box(.25, .25, 1.1, f, .1, tail, 0, .3, -.5).rotation.x = .6;
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return { root: g, head, legs, tail, tongue };
}

// ---------- casas del barrio ----------
const WALLS = [0xe8d0a8, 0xa8c8e8, 0xf0b8b8, 0xc8e0b0, 0xe8e0d0, 0xd0b8e8, 0xf2d27a, 0xb8d8d0];
export function house(parent, x, z, ci, face = 1, sign = null) {
  const root = new THREE.Group(); root.position.set(x, 0, z); root.rotation.y = face > 0 ? Math.PI / 2 : -Math.PI / 2; parent.add(root);
  const g = new THREE.Group(); root.add(g);   // g se escala para "desaparecer/volver"
  const wall = mat(WALLS[ci % WALLS.length], { roughness: .8 }), trim = mat(0xffffff, { roughness: .6 });
  const sid = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 2); }, true); sid.repeat.set(4, 3);
  wall.map = sid;
  box(16, 10, 13, wall, .1, g, 0, 5, 0);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(.01, 11.8, 6, 4, 1, false, Math.PI / 4), mat([0x7a2a2a, 0x3a4a6a, 0x4a3a2a, 0x5a5a62][ci % 4], { roughness: .7 })); roof.scale.set(1, 1, .82); roof.position.y = 13; roof.castShadow = true; g.add(roof);
  const snow = new THREE.Mesh(new THREE.CylinderGeometry(.01, 12.2, 6.1, 4, 1, false, Math.PI / 4), mat(0xf6f8ff, { roughness: 1 })); snow.scale.set(1, .35, .84); snow.position.y = 15.4; g.add(snow);
  box(1.6, 4, 1.6, mat(0x8a4a3a), .1, g, 4, 14, -2); box(1.9, .4, 1.9, mat(0xf6f8ff), .1, g, 4, 16.1, -2);
  const winM = mat(0xffe2a0, { emissive: 0xffb050, emissiveIntensity: 1.1 });
  for (const wx of [-5, 5]) { box(3, 3, .3, winM, .05, g, wx, 6, 6.55); box(3.5, .4, .6, trim, .05, g, wx, 4.4, 6.7); box(.25, 3, .35, trim, 0, g, wx, 6, 6.7); }
  // puerta (hoja que gira), marco, farol, felpudo, porche nevado
  const dm = new THREE.Group(); dm.position.set(-1.6, 0, 6.6); g.add(dm);
  box(3.2, 6, .3, mat([0x7a2a2a, 0x2a4a3a, 0x3a3a6a, 0x6a3a1a][ci % 4], { roughness: .5 }), .06, dm, 1.6, 3, 0); sphere(.18, gold(), dm, 2.9, 3, .25);
  box(3.2, 6, .1, mat(0x1a1410), 0, g, 0, 3, 6.45);
  box(4, .5, .6, trim, .05, g, 0, 6.25, 6.7); for (const s of [-1, 1]) box(.4, 6, .6, trim, .05, g, s * 1.8, 3, 6.7);
  box(2.4, .1, 1.4, mat(0x6a3a2a, { roughness: 1 }), 0, g, 0, .45, 7.7);
  box(8, .4, 3, mat(0xb8b0a8), .05, g, 0, .2, 8); box(8.2, .15, 3.2, mat(0xf6f8ff), .05, g, 0, .45, 8);
  const lamp = box(.6, .9, .6, mat(0xfff0b0, { emissive: 0xffc25a, emissiveIntensity: 2.5 }), .1, g, 2.6, 5, 6.9);
  if (sign) { const sp = textPlane(10, 2.4, 512, 120, (c, w, h) => { c.fillStyle = '#7a2a2a'; rrect(c, 4, 4, w - 8, h - 8, 20); c.fill(); c.fillStyle = '#ffe2a0'; c.font = `700 84px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(sign, w / 2, h / 2 + 4); }, 1); sp.position.set(0, 8.6, 6.75); g.add(sp); }
  // zaun y arbustos nevados
  for (const s of [-1, 1]) sphere(1.4, mat(0x2f6a3e, { roughness: 1 }), g, s * 6, 1.2, 8.5, 12, 8);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const dirt = new THREE.Mesh(new THREE.PlaneGeometry(16, 13), mat(0x5a3a22, { roughness: 1, map: canvasTex(128, 128, (c, w, h) => { const r = RNG(ci + 2); c.fillStyle = '#5a3a22'; c.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++) { c.fillStyle = r() < .5 ? '#4a2e1a' : '#6a4a2e'; c.fillRect(r() * w, r() * h, 3, 3); } }) }));
  dirt.rotation.x = -Math.PI / 2; dirt.position.y = .06; dirt.receiveShadow = true; dirt.visible = false; root.add(dirt);
  return { root, g, door: dm, dirt };
}
// barrio: carretera nevada con casas a ambos lados, farolas, abetos
export function suburb(scene, X) {
  const root = new THREE.Group(); root.position.x = X; scene.add(root);
  const snowT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#eef2fb'; c.fillRect(0, 0, w, h); const r = RNG(4); for (let i = 0; i < 900; i++) { c.fillStyle = r() < .5 ? '#dfe6f4' : '#ffffff'; c.fillRect(r() * w, r() * h, 3, 3); } }, true); snowT.repeat.set(40, 60);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(400, 600), mat(0xffffff, { map: snowT, roughness: .95 })); gr.rotation.x = -Math.PI / 2; gr.position.z = -100; gr.receiveShadow = true; root.add(gr);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 600), mat(0x8a90a8, { roughness: .8 })); road.rotation.x = -Math.PI / 2; road.position.set(0, .03, -100); road.receiveShadow = true; root.add(road);
  for (let z = 40; z > -300; z -= 7) box(.3, .02, 3, mat(0xf6f8ff), 0, root, 0, .05, z);
  const H = [];
  for (let i = 0; i < 7; i++) for (const s of [-1, 1]) {
    const sign = s > 0 && i === 2 ? 'BÄCKEREI' : null;
    H.push(house(root, s * 22, -i * 24, i * 2 + (s > 0 ? 1 : 0), s > 0 ? -1 : 1, sign));
  }
  const lampM = mat(0x1d2238, { metalness: .5, roughness: .4 });
  for (let z = 20; z > -170; z -= 24) for (const s of [-1, 1]) { const x = s * 9; cyl(.2, .25, 10, lampM, 8, root, x, 5, z + 12); box(1, 1.4, 1, mat(0xfff0b0, { emissive: 0xffc25a, emissiveIntensity: 2.6 }), .2, root, x, 10.4, z + 12); }
  const tree = (x, z, s) => { cyl(.6, .8, 3, mat(0x5a3a22), 8, root, x, 1.5, z); for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry((4 - k) * s, 4 * s, 10), mat(0x1f5a3a, { roughness: 1 })); c.position.set(x, 3 + k * 2.6 * s, z); c.castShadow = true; root.add(c); const sn = new THREE.Mesh(new THREE.ConeGeometry((3.2 - k) * s, 1.4 * s, 10), mat(0xf6f8ff)); sn.position.set(x, 4.4 + k * 2.6 * s, z); root.add(sn); } };
  const r = RNG(9); for (let i = 0; i < 26; i++) { const s = r() < .5 ? -1 : 1; tree(s * (36 + r() * 30), 20 - r() * 190, .8 + r() * .5); }
  return { root, houses: H };
}
// salón (ventana, sofá, tele, árbol de Navidad), cocina (mesa), baño (bañera + espejo): cada uno en su sitio
function roomShell(scene, X, wallCol, floorCol, w = 30, d = 22, h = 20) {
  const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(floorCol, { roughness: .6 })); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(w, h, .6, mat(wallCol, { roughness: .9 }), 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.6, h, d, mat(wallCol, { roughness: .9 }), 0, g, s * w / 2, h / 2, 0);
  box(w, 1, .7, mat(0xffffff), 0, g, 0, .5, -d / 2 + .1);
  return g;
}
export function living(scene, X) {
  const g = roomShell(scene, X, 0x6a8a7a, 0xa8743e);
  const win = textPlane(8, 9, 256, 288, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a1440'); gr.addColorStop(1, '#3a3a8a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); const r = RNG(3); c.fillStyle = '#fff'; for (let i = 0; i < 120; i++) { c.globalAlpha = .4 + r() * .6; c.beginPath(); c.arc(r() * w, r() * h, 1.5 + r() * 1.5, 0, 7); c.fill(); } c.globalAlpha = 1; c.fillStyle = '#eef2fb'; c.fillRect(0, h * .78, w, h); }, .7);
  win.position.set(-6, 9, -10.6); g.add(win); const fr = mat(0xffffff); box(8.6, .5, .8, fr, .05, g, -6, 4.3, -10.4); box(8.6, .5, .5, fr, .05, g, -6, 13.6, -10.5); box(.4, 9, .5, fr, 0, g, -6, 9, -10.4); for (const s of [-1, 1]) box(.5, 9.6, .5, fr, 0, g, -6 + s * 4.2, 9, -10.5);
  for (const s of [-1, 1]) box(2, 11, .3, mat(0xc84a3a, { roughness: 1 }), .1, g, -6 + s * 5.4, 9, -10.2);
  const sofa = new THREE.Group(); sofa.position.set(6, 0, -3); g.add(sofa); const sm = mat(0x3a5a9a, { roughness: .9 });
  box(10, 2, 4, sm, .4, sofa, 0, 1.6, 0); box(10, 3, 1.2, sm, .4, sofa, 0, 3.4, -1.6); for (const s of [-1, 1]) box(1.2, 2.6, 4, sm, .4, sofa, s * 5, 2.2, 0); for (const s of [-1, 1]) box(2, 1.6, .6, mat(0xf2c23a), .3, sofa, s * 2.5, 3.6, -.8);
  box(7, 4, .4, mat(0x111111, { emissive: 0x2a4aaa, emissiveIntensity: .8 }), .1, g, 9, 7, -10.5);
  const tree = new THREE.Group(); tree.position.set(12, 0, -7); g.add(tree);
  for (let k = 0; k < 4; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(3.4 - k * .7, 3, 12), mat(0x1f6a3a)); c.position.y = 2.5 + k * 1.9; tree.add(c); }
  const r = RNG(5); for (let i = 0; i < 24; i++) { const a = r() * 6.28, y = 2 + r() * 7, rad = (3.2 - (y - 2) * .38) * .95; sphere(.25, mat([0xff3a3a, 0xffd23f, 0x3a8aff, 0xffffff][i % 4], { emissive: [0xaa0000, 0xaa8800, 0x0030aa, 0x666666][i % 4], emissiveIntensity: 1.2 }), tree, Math.cos(a) * rad, y, Math.sin(a) * rad); }
  sphere(.5, mat(0xffd23f, { emissive: 0xffb000, emissiveIntensity: 2 }), tree, 0, 10.4, 0);
  box(9, .2, 6, mat(0xb83a3a, { roughness: 1 }), .05, g, -3, .1, 3);
  const L = new THREE.PointLight(0xffc080, 500, 60, 2); L.position.set(2, 14, 4); g.add(L);
  return { g };
}
export function kitchen(scene, X) {
  const g = roomShell(scene, X, 0xf2e2b8, 0xd8d0c0);
  const tiles = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#c84a3a'; c.fillRect(0, 0, 32, 32); c.fillRect(32, 32, 32, 32); }, true); tiles.repeat.set(10, 7);
  g.children[0].material.map = tiles; g.children[0].material.needsUpdate = true;
  for (let i = 0; i < 6; i++) { box(4.4, 6, 3, mat(0x7ab8a8), .2, g, -12 + i * 4.6, 3, -9.2); box(4.4, 4, 2, mat(0x7ab8a8), .2, g, -12 + i * 4.6, 15, -9.8); }
  box(28, .5, 3.4, mat(0xf2f2f2), .1, g, -.5, 6.2, -9.2);
  const table = new THREE.Group(); table.position.set(0, 0, 1); g.add(table);
  const cloth = checkTex('#ffffff', '#c84a3a', 8);
  box(12, .5, 7, mat(0xffffff, { map: cloth }), .1, table, 0, 4.4, 0); for (const [x, z] of [[-5.4, -3], [5.4, -3], [-5.4, 3], [5.4, 3]]) box(.5, 4.2, .5, mat(0x8a5a34), .1, table, x, 2.1, z);
  const plate = (x, z) => { const p = cyl(1.1, 1, .15, mat(0xffffff, { roughness: .3 }), 24, table, x, 4.75, z); return p; };
  const broc = new THREE.Group(); broc.position.set(0, 4.9, 2.4); table.add(broc); plate(0, 2.4);
  for (let i = 0; i < 5; i++) { cyl(.12, .16, .5, mat(0x7ac05a), 6, broc, (i - 2) * .32, .25, (i % 2) * .3); sphere(.32, mat(0x2f7a2a, { roughness: 1 }), broc, (i - 2) * .32, .6, (i % 2) * .3, 10, 8); }
  // comida de Navidad (se muestra en el Weihnachtsessen)
  const xmas = new THREE.Group(); table.add(xmas);
  const goose = sphere(1.3, mat(0xb8682a, { roughness: .4 }), xmas, 0, 5.4, -.6); goose.scale.set(.75, .5, .6);
  for (const s of [-1, 1]) { cyl(.18, .22, 1.6, mat(0xfff2e0), 12, xmas, s * 3.2, 5.4, -1); sphere(.25, mat(0xffd27a, { emissive: 0xffa040, emissiveIntensity: 3 }), xmas, s * 3.2, 6.4, -1); }
  for (const [x, z] of [[-4, 2], [4, 2], [-4, -2.5], [4, -2.5]]) plate(x, z);
  const L = new THREE.PointLight(0xfff0d0, 450, 60, 2); L.position.set(0, 15, 4); g.add(L);
  return { g, table, broc, xmas };
}
export function bathroom(scene, X) {
  const g = roomShell(scene, X, 0x9fd8e8, 0xe8eef2);
  const tub = new THREE.Group(); tub.position.set(-4, 0, -6); g.add(tub);
  box(10, 3.4, 5, mat(0xffffff, { roughness: .2 }), .8, tub, 0, 1.7, 0); box(9, .3, 4, mat(0x7ac8f0, { roughness: .05, metalness: .2 }), .1, tub, 0, 3.1, 0);
  const r = RNG(2); for (let i = 0; i < 22; i++) sphere(.4 + r() * .4, mat(0xffffff, { roughness: .3, transparent: true, opacity: .9 }), tub, (r() - .5) * 8, 3.4 + r() * .5, (r() - .5) * 3.4, 10, 8);
  const duck = new THREE.Group(); duck.position.set(2, 3.7, 0); tub.add(duck); sphere(.5, mat(0xffd23f), duck, 0, 0, 0); sphere(.32, mat(0xffd23f), duck, .35, .45, 0); box(.3, .1, .2, mat(0xff8a2a), .03, duck, .7, .45, 0);
  // espejo con marco (Brandt ensaya su "Nein")
  const mirror = new THREE.Group(); mirror.position.set(8, 9, -10.6); g.add(mirror);
  box(7, 9, .3, gold(), .2, mirror, 0, 0, 0); box(6.2, 8.2, .2, mat(0xcfe6f2, { metalness: .1, roughness: .08, emissive: 0x8ab8d0, emissiveIntensity: .35 }), .05, mirror, 0, 0, .15);
  box(7, 1.6, 2.4, mat(0xffffff), .3, g, 8, 3.5, -9.4);
  const L = new THREE.PointLight(0xfff6e8, 400, 60, 2); L.position.set(0, 15, 4); g.add(L);
  return { g, tub, duck, mirror };
}
// nieve que cae: puntos alrededor de la cámara (determinista)
export function snowfall(scene, n = 2600) {
  const pos = new Float32Array(n * 3), seed = new Float32Array(n * 3), r = RNG(77);
  for (let i = 0; i < n; i++) { seed[i * 3] = r() * 60 - 30; seed[i * 3 + 1] = r() * 40; seed[i * 3 + 2] = r() * 60 - 30; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const tex = canvasTex(32, 32, (c) => { const g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 32, 32); });
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: .35, map: tex, transparent: true, depthWrite: false, color: 0xffffff }));
  pts.frustumCulled = false; scene.add(pts);
  pts.userData.update = (cam, T) => { for (let i = 0; i < n; i++) { const sx = seed[i * 3], sy = seed[i * 3 + 1], sz = seed[i * 3 + 2];
    pos[i * 3] = cam.x + sx + Math.sin(T * .7 + i) * .6; pos[i * 3 + 1] = cam.y - 15 + ((sy - T * 2.2) % 40 + 40) % 40; pos[i * 3 + 2] = cam.z + sz; } geo.attributes.position.needsUpdate = true; };
  return pts;
}
// fuegos artificiales (esferas de chispas emisivas, deterministas por tiempo)
export function fireworks(scene, n = 5) {
  const G = new THREE.Group(); scene.add(G); const items = [];
  for (let k = 0; k < n; k++) { const col = [0xff4a6a, 0xffd23f, 0x4ad8ff, 0x9a6aff, 0x6aff8a][k % 5]; const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(3), toneMapped: false, transparent: true });
    const sp = []; for (let i = 0; i < 28; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 4), m); G.add(s); sp.push(s); } items.push({ sp, m, k }); }
  G.userData.update = (T, cx, cz) => { for (const it of items) { const per = 2.4, ph = ((T + it.k * .53) % per) / per, r = RNG(it.k * 31 + Math.floor((T + it.k * .53) / per));
    const ox = cx + (r() - .5) * 120, oy = 60 + r() * 40, oz = cz - 120 - r() * 60;
    it.sp.forEach((s, i) => { const a = i / 28 * 6.283, b = (i * 2.4) % 3.14; const R = ph * 22; s.position.set(ox + Math.cos(a) * Math.sin(b + .3) * R, oy + Math.cos(b + .3) * R - ph * ph * 8, oz + Math.sin(a) * Math.sin(b + .3) * R); s.scale.setScalar(1.4 - ph); });
    it.m.opacity = 1 - ph; } };
  return G;
}

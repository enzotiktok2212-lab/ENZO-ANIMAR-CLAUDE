// HUSS — reparto propio (nadie se parece al vídeo de referencia):
// Ich (≈12): rizos castaños con cinta blanca, camiseta de fútbol roja con cuello blanco y el 10, pantalón negro, medias blancas con rayas rojas, botas negras.
// Gerda (vecina, ≈45): media melena pelirroja, gafas redondas grandes, chaqueta de punto morada, aros dorados.
// Kapitän (rival, ≈15): alto, rapado, camiseta azul con el 9, cinta de capitán amarilla.
// DJ: gorra negra del revés, cascos, camiseta negra con rayo.
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, headphones, cap, mustache } from './props.js';
import { textPlane } from './engine.js';
import { FONT } from './sets.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const numT = (bg, fg, n, stripe) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); if (stripe) { c.fillStyle = stripe; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 10, h); } c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = 'rgba(0,0,0,.35)'; c.strokeText(n, w / 2, h / 2 + 8); c.fillStyle = fg; c.fillText(n, w / 2, h / 2 + 8); });
const jersey = (col, collar, n, fg = '#ffffff', stripe = null) => sp => { const t = numT(hex(col), fg, n, stripe); const plain = mat(col, { roughness: .6, map: stripe ? canvasTex(64, 64, (c, w, h) => { c.fillStyle = hex(col); c.fillRect(0, 0, w, h); c.fillStyle = stripe; for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 5, h); }) : null });
  box(2.1, 2.08, 1.12, plain, .14, sp, 0, 1.02, 0); const front = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), mat(0xffffff, { map: t, transparent: true, roughness: .6 })); front.position.set(.1, 1.0, .575); sp.add(front);
  const back = front.clone(); back.position.set(0, 1.05, -.575); back.rotation.y = Math.PI; sp.add(back); box(2.12, .3, 1.14, mat(collar), .05, sp, 0, 1.95, 0); const v = new THREE.Mesh(new THREE.ConeGeometry(.32, .55, 3), mat(collar)); v.position.set(0, 1.78, .56); v.rotation.x = Math.PI; v.scale.z = .1; sp.add(v);
  box(2.14, .2, 1.16, mat(collar), .04, sp, 0, .1, 0); };
const headband = col => o => { const b = new THREE.Mesh(new THREE.TorusGeometry(.7, .09, 6, 28), mat(col, { roughness: .9 })); b.rotation.x = Math.PI / 2; b.position.y = 1.0; b.scale.set(1, 1.02, 1); o.head.add(b); };
const boots = col => o => { for (const lg of [o.lL, o.lR]) { for (let k = 0; k < 3; k++) box(.18, .08, .18, mat(0xd8dce4), .02, lg.kn, -.3 + k * .3, -1.08, .14); box(1.02, .1, .8, mat(0xffffff), .02, lg.kn, 0, -.72, .4); } };
const stripeSocks = col => o => { for (const lg of [o.lL, o.lR]) box(.99, .14, 1.0, mat(col), .04, lg.kn, 0, -.45, 0); };
const curls = col => h => { const m = mat(col, { roughness: .9 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.25), m); c.position.y = 1.0; c.scale.set(1.04, .6, 1.04); h.add(c);
  for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283, rr = .3 + (i % 3) * .16; sphere(.22, m, h, Math.cos(a) * rr, 1.32 + (i % 2) * .1, Math.sin(a) * rr, 8, 6); } for (let i = -2; i <= 2; i++) sphere(.2, m, h, i * .24, 1.16, .56, 8, 6); };
const bob = col => h => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.74, 26, 13, 0, 6.283, 0, 1.4), m); c.position.y = .98; c.scale.set(1.08, .78, 1.08); h.add(c);
  for (const s of [-1, 1]) { box(.34, 1.05, 1.1, m, .14, h, s * .7, .5, -.05); const t = box(.4, .3, .3, m, .12, h, s * .62, .02, .32); t.rotation.z = s * .4; } box(1.4, 1.1, .4, m, .16, h, 0, .5, -.56); for (let i = -2; i <= 2; i++) { const f = box(.3, .32, .24, m, .1, h, i * .25, 1.15, .52); f.rotation.x = -.3; } };
const bigGlasses = o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.26, .05, 8, 22), mat(0xd8323a, { roughness: .3 })); r.position.set(s * .3, .78, .66); o.head.add(r); const l = new THREE.Mesh(new THREE.CircleGeometry(.24, 18), new THREE.MeshStandardMaterial({ color: 0xd8f0ff, transparent: true, opacity: .25 })); l.position.set(s * .3, .78, .665); o.head.add(l); } box(.16, .05, .05, mat(0xd8323a), .02, o.head, 0, .8, .67); };
const hoops = o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.16, .03, 6, 16), mat(0xe9c23a, { metalness: .9, roughness: .2 })); r.position.set(s * .72, .18, .05); r.rotation.y = Math.PI / 2; o.head.add(r); } };
const cardigan = (col, top) => sp => { const m = mat(col, { roughness: 1 }); for (const s of [-1, 1]) box(.8, 2.06, 1.16, m, .14, sp, s * .64, 1.02, 0); box(2.1, 2.06, .5, m, .1, sp, 0, 1.02, -.34); box(.5, 2.0, .08, mat(top), .02, sp, 0, 1.02, .56);
  for (let k = 0; k < 4; k++) sphere(.08, mat(0xffd23f), sp, .34, 1.7 - k * .42, .6, 6, 4); for (const s of [-1, 1]) box(.5, .45, .06, m, .04, sp, s * .6, .55, .6); };
const tee = (col, bolt) => sp => { box(2.1, 2.06, 1.12, mat(col, { roughness: .8 }), .14, sp, 0, 1.02, 0); if (bolt) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat(0xffffff, { map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = bolt; c.beginPath(); c.moveTo(36, 4); c.lineTo(14, 36); c.lineTo(30, 36); c.lineTo(24, 60); c.lineTo(50, 26); c.lineTo(34, 26); c.closePath(); c.fill(); }), transparent: true })); p.position.set(0, 1.05, .565); sp.add(p); } };
const capBack = col => o => { cap(o.head, col, 0xffffff); o.head.children.slice(-3).forEach(m => { m.rotation.y += Math.PI; m.position.z *= -1; }); };
const armband = col => o => box(.98, .3, 1.0, mat(col), .04, o.aL.sh, 0, -.55, 0);

export function makeHuss(scene) { return mk(scene, S({ seed: 5101, scale: .84, skin: 0xe8b48c, shirt: 0xe02a2a, shirt2: 0xe8b48c, cuffs: 0xffffff, pants: 0x16161c, shorts: true, socks: 0xffffff, shoes: 0x16161c, sole: 0x16161c, hair: 0x4a2a14, hairBuild: curls(0x4a2a14), sleeveShort: true,
  torsoDetail: jersey(0xe02a2a, 0xffffff, '10'), face: { iris: '#5a3a1a', browColor: '#3a2010', blush: .35, freckles: 1 } }), [headband(0xffffff), boots(0x16161c), stripeSocks(0xe02a2a)]); }
export function makeGerda(scene) { return mk(scene, S({ seed: 5102, scale: .92, skin: 0xf4cdb0, shirt: 0x8a4ac8, shirt2: 0x8a4ac8, cuffs: 0x6a2aa8, pants: 0x2a3a5a, shoes: 0xffd23f, sole: 0xd8a820, hair: 0xd8582a, hairBuild: bob(0xd8582a),
  torsoDetail: cardigan(0x8a4ac8, 0xffd23f), face: { iris: '#4a7a3a', browColor: '#b8401a', blush: .5, lashes: 1 } }), [bigGlasses, hoops]); }
export function makeKapitaen(scene) { return mk(scene, S({ seed: 5103, scale: 1.04, skin: 0xc68b5e, shirt: 0x2a5ad8, shirt2: 0xc68b5e, cuffs: 0xffffff, pants: 0xffffff, shorts: true, socks: 0x2a5ad8, shoes: 0xffffff, sole: 0x2a2a2a, hair: 0x1a1008, hairBuild: hairS(0x1a1008, 'plain'), sleeveShort: true,
  torsoDetail: jersey(0x2a5ad8, 0xffffff, '9'), face: { iris: '#3a2410', browColor: '#1a1008', blush: .2 } }), [armband(0xffd23f), boots(0xffffff)]); }
export function makeDJ(scene) { return mk(scene, S({ seed: 5104, scale: .96, skin: 0x8a5a3a, shirt: 0x1a1a22, shirt2: 0x1a1a22, cuffs: 0x1a1a22, pants: 0x3a3a48, shoes: 0xf4f4f4, hair: 0x101010, hairBuild: hairS(0x101010, 'plain'),
  torsoDetail: tee(0x1a1a22, '#ffd23f'), face: { iris: '#2a1a10', browColor: '#101010', blush: .2 } }), [capBack(0x1a1a22), o => headphones(o.head, 0xff4a8a)]); }
// guantes de boxeo (en las dos manos), visibles bajo demanda
export function gloves(ch) { const out = []; for (const a of [ch.aL, ch.aR]) { const g = new THREE.Group(); g.position.set(0, -.25, .05); a.hand.add(g); const gl = sphere(.62, mat(0xd8323a, { roughness: .35 }), g, 0, 0, 0, 16, 12); gl.scale.set(1, 1.1, 1.15); box(.9, .35, .9, mat(0xffffff), .1, g, 0, .5, 0); g.visible = false; out.push(g); } return out; }

// ---------- SCHWEISSBAND — reparto propio (nadie se parece al vídeo de referencia) ----------
// Max (≈11): pelo de punta rubio oscuro, chándal turquesa con rayas blancas, zapatillas lima. Lleva una muñequera blanca (luego la dorada).
// Basketballer (≈20): alto, trenzas, camiseta de tirantes amarilla con el 23, cinta negra.
// Opa Karl (92): calvo con laterales blancos, bigote blanco, gafas, chaleco de punto marrón, camisa azul claro, gorra plana.
// HUSS-O-MAT 9000: robot gris metálico, visor rojo, antena, placa en el pecho, hombreras.
const spiky = col => h => { const m = mat(col, { roughness: .7 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.2), m); c.position.y = 1.0; c.scale.set(1.03, .55, 1.03); h.add(c);
  for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.ConeGeometry(.2, .55, 6), m); s.position.set(-.5 + (i % 5) * .25, 1.42, -.2 + Math.floor(i / 5) * .35); s.rotation.set(-.4 + Math.floor(i / 5) * .5, 0, (i % 5 - 2) * -.2); h.add(s); } };
const braids = col => h => { const m = mat(col, { roughness: .8 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 12, 0, 6.283, 0, 1.25), m); c.position.y = 1.0; c.scale.set(1.03, .6, 1.03); h.add(c);
  for (let i = 0; i < 6; i++) { const b = cyl(.08, .08, 1.3, m, 6, h, -.5 + i * .2, .55, -.62); b.rotation.x = .25; } };
const baldW = col => h => { const m = mat(col, { roughness: .95 }); for (const s of [-1, 1]) box(.22, .5, .9, m, .08, h, s * .68, .85, -.1); box(1.2, .45, .26, m, .1, h, 0, .85, -.62); };
const track = (col, stripe) => sp => { const m = mat(col, { roughness: .6 }); box(2.1, 2.06, 1.12, m, .14, sp, 0, 1.02, 0); box(.12, 2.0, .05, mat(0xd8dce4, { metalness: .8 }), .02, sp, 0, 1.02, .58);
  for (const s of [-1, 1]) box(.12, 2.0, .04, mat(stripe), .02, sp, s * .5, 1.02, .58); box(2.14, .3, 1.16, mat(stripe), .04, sp, 0, 1.95, 0); };
const vest = (col, shirt) => sp => { box(2.06, 2.04, 1.1, mat(shirt, { roughness: .8 }), .12, sp, 0, 1.0, 0); const m = mat(col, { roughness: 1 }); for (const s of [-1, 1]) box(.75, 1.9, 1.16, m, .12, sp, s * .66, .95, 0); box(2.1, 1.9, .5, m, .1, sp, 0, .95, -.34);
  for (let k = 0; k < 3; k++) sphere(.07, mat(0xd8b860), sp, .3, 1.4 - k * .4, .6, 6, 4); };
const wrist = (o, col, side = 'R') => { const a = side === 'R' ? o.aR : o.aL; const b = new THREE.Mesh(new THREE.TorusGeometry(.42, .17, 8, 20), mat(col, { roughness: .9 })); b.rotation.x = Math.PI / 2; b.position.set(0, .35, 0); a.hand.add(b); return b; };
export function makeMax(scene) { const o = mk(scene, S({ seed: 7101, scale: .8, skin: 0xf2c6a2, shirt: 0x1ab8b0, shirt2: 0x1ab8b0, cuffs: 0xffffff, pants: 0x1a5a8a, shoes: 0xb8f03a, sole: 0xffffff, hair: 0x8a6a3a, hairBuild: spiky(0x8a6a3a),
  torsoDetail: track(0x1ab8b0, 0xffffff), face: { iris: '#3a6a9a', browColor: '#6a4a2a', blush: .4, freckles: 1 } }));
  o.props.band = wrist(o, 0xffffff); o.props.gold = wrist(o, 0xffffff, 'L'); o.props.gold.material = mat(0xffc828, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .4 }); o.props.gold.visible = false; return o; }
export function makeBasket(scene) { return mk(scene, S({ seed: 7102, scale: 1.12, skin: 0x8a5a3a, shirt: 0xffd23f, shirt2: 0x8a5a3a, cuffs: 0x8a5a3a, pants: 0x2a3a8a, shorts: true, socks: 0xffffff, shoes: 0xd8323a, sole: 0xffffff, hair: 0x1a1008, hairBuild: braids(0x1a1008), sleeveShort: true,
  torsoDetail: jersey(0xffd23f, 0x2a3a8a, '23', '#2a3a8a'), face: { iris: '#2a1a10', browColor: '#1a1008', blush: .15 } }), [headband(0x1a1a1a)]); }
export function makeOpaK(scene) { return mk(scene, S({ seed: 7103, scale: .86, skin: 0xf1c8a8, shirt: 0x9ac8ea, shirt2: 0x9ac8ea, cuffs: 0x9ac8ea, pants: 0x5a5a62, shoes: 0x4a2a14, sole: 0x2a1a0a, hair: 0xf2f2f2, hairBuild: baldW(0xf2f2f2),
  torsoDetail: vest(0x8a5a2a, 0x9ac8ea), face: { iris: '#6b8fae', browColor: '#e8e8e8', blush: .3 } }), [o => mustache(o.head, 0xf2f2f2), o => glasses(o.head, 0x5a3a1a), o => cap(o.head, 0x6a5a4a, 0x6a5a4a)]); }
export function makeRobo(scene) { const metal = 0xaab4c4; const o = mk(scene, S({ seed: 7104, scale: 1.35, skin: 0xc8d0dc, shirt: 0x6a7488, shirt2: metal, cuffs: 0x3a4050, pants: 0x4a5264, shoes: 0x2a2e3a, sole: 0x1a1a22, hair: 0x6a7488, hairBuild: h => { box(1.5, .3, 1.5, mat(0x6a7488, { metalness: .7, roughness: .3 }), .05, h, 0, 1.4, 0); },
  torsoDetail: sp => { const m = mat(0x6a7488, { metalness: .7, roughness: .35 }); box(2.2, 2.1, 1.2, m, .1, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.9, .5, 1.4, mat(0x2a2e3a, { metalness: .6 }), .1, sp, s * 1.2, 1.95, 0);
    const p = textPlane(1.5, .9, 150, 90, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.font = `700 24px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#1a1a2a'; c.fillText('HUSS-O-MAT', w / 2, 30); c.fillStyle = '#d8323a'; c.font = `700 34px ${FONT}`; c.fillText('9000', w / 2, 64); }); p.position.set(0, 1.25, .62); sp.add(p);
    for (let i = 0; i < 4; i++) box(.3, .14, .05, mat(0x3ab8ff, { emissive: 0x3ab8ff, emissiveIntensity: 2 }), .02, sp, -.6 + i * .4, .35, .62); }, face: { iris: '#ff2020', browColor: '#2a2e3a' } }),
  [o => { const v = box(1.3, .32, .1, mat(0xff2a2a, { emissive: 0xff2020, emissiveIntensity: 2.4, roughness: .2 }), .05, o.head, 0, .8, .68); o.props.visor = v; cyl(.05, .05, .9, mat(0x8a94a4, { metalness: .8 }), 6, o.head, 0, 1.9, 0); o.props.ant = sphere(.16, mat(0xff2a2a, { emissive: 0xff2020, emissiveIntensity: 3 }), o.head, 0, 2.4, 0, 10, 8);
    for (const s of [-1, 1]) cyl(.22, .22, .2, mat(0x3a4050, { metalness: .7 }), 12, o.head, s * .74, .8, 0).rotation.z = Math.PI / 2; }]);
  o.props.gold = wrist(o, 0xffc828, 'L'); o.props.gold.material = mat(0xffc828, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .4 }); return o; }

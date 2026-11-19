// SOFORT — reparto propio (nadie se parece al vídeo de referencia):
// Kapitän Sofort (ich, ≈30): tupé negro peinado hacia atrás con mechón plateado, traje ajustado azul noche con hombreras doradas y un reloj de arena dorado en el pecho,
//   guantes blancos, botas doradas, capa negra por fuera y violeta por dentro. De niño (8): mismo pelo, pijama de rayas y toalla roja de capa.
// Stahlpranke (mujer fuerte): melena corta platino con rapado, traje gris acero con placas naranjas y puños enormes, capa naranja.
// Zack (velocista): delgado, pelo blanco de punta, mono azul eléctrico con rayo amarillo, gafas de carrera, capa corta amarilla.
// Funkel (láser): traje rojo con franja blanca, visor dorado sobre los ojos, pelo castaño en cresta, capa dorada.
// Herr Alleskann (el amable, ≈60): calvo con laterales blancos, barba blanca corta, gafas redondas, traje verde menta con espiral morada, capa morada.
// Granitor (gigante): armadura de piedra gris oscura con grietas naranjas que brillan, casco con cuernos cortos.
// Richter: toga negra con chorrera blanca, pelo blanco, gafas. Soldaten: uniforme oliva y casco.
import { THREE, mat, box, cyl, sphere, canvasTex } from './engine.js';
import { mk, hairS, glasses, suit } from './props.js';
import { cape } from './ksets.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const em = (draw) => canvasTex(128, 128, draw);
// traje de héroe: cuerpo liso + franja/emblema en el pecho (plano) + cinturón
const heroSuit = (col, trim, emblem, belt = null) => sp => { box(2.1, 2.08, 1.12, mat(col, { roughness: .35, metalness: .15 }), .14, sp, 0, 1.02, 0);
  if (emblem) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), mat(0xffffff, { map: em(emblem), transparent: true, roughness: .4 })); p.position.set(0, 1.25, .575); sp.add(p); }
  box(2.14, .26, 1.16, mat(belt ?? trim, { metalness: .6, roughness: .3 }), .05, sp, 0, .12, 0); for (const s of [-1, 1]) { const sh = box(.9, .32, 1.3, mat(trim, { metalness: .5, roughness: .3 }), .12, sp, s * 1.2, 1.98, 0); sh.rotation.z = s * -.15; } };
const gloves = col => o => { for (const a of [o.aL, o.aR]) box(.9, .62, .92, mat(col, { roughness: .4 }), .18, a.hand, 0, -.2, .02); };
const bootsC = col => o => { for (const lg of [o.lL, o.lR]) { box(1.02, .8, 1.02, mat(col, { roughness: .35, metalness: .3 }), .1, lg.kn, 0, -.55, 0); box(1.04, .38, 1.34, mat(col, { roughness: .35, metalness: .3 }), .14, lg.kn, 0, -.86, .14); } };
const slick = (col, streak) => h => { const m = mat(col, { roughness: .35 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 26, 13, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .66, 1.06); h.add(c);
  const t = box(1.3, .5, 1.2, m, .22, h, 0, 1.36, -.02); t.rotation.x = .18; const f = box(1.1, .4, .5, m, .18, h, 0, 1.38, .45); f.rotation.x = -.5; if (streak) { const s = box(.24, .44, 1.1, mat(streak, { roughness: .3 }), .08, h, .32, 1.52, 0); s.rotation.x = .18; } box(1.3, .8, .36, m, .14, h, 0, .9, -.56); };
const undercut = col => h => { const m = mat(col, { roughness: .5 }); for (const s of [-1, 1]) box(.2, .5, .9, mat(0x8a8a92, { roughness: 1 }), .08, h, s * .68, .85, -.1); const t = box(1.2, .55, 1.3, m, .24, h, -.05, 1.38, .0); t.rotation.z = .2; const f = box(.7, .5, .5, m, .2, h, -.25, 1.3, .48); f.rotation.set(-.4, 0, .5); };
const spikesW = col => h => { const m = mat(col, { roughness: .6 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.71, 24, 12, 0, 6.283, 0, 1.2), m); c.position.y = 1.0; c.scale.set(1.03, .55, 1.03); h.add(c);
  for (let i = 0; i < 7; i++) { const s = new THREE.Mesh(new THREE.ConeGeometry(.22, .8, 5), m); s.position.set(-.45 + (i % 4) * .3, 1.4, -.25 + Math.floor(i / 4) * .45); s.rotation.set(-1.0, 0, (i % 4 - 1.5) * .2); h.add(s); } };
const mohawk = col => h => { const m = mat(col, { roughness: .6 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.71, 24, 12, 0, 6.283, 0, 1.15), m); c.position.y = 1.0; c.scale.set(1.02, .5, 1.02); h.add(c); for (let i = 0; i < 5; i++) { const s = box(.3, .55 - Math.abs(i - 1.5) * .06, .34, m, .1, h, 0, 1.5, .5 - i * .3); s.rotation.x = -.3; } };
const baldBeard = col => h => { const m = mat(col, { roughness: .95 }); for (const s of [-1, 1]) box(.22, .5, .9, m, .08, h, s * .68, .85, -.1); box(1.2, .45, .26, m, .1, h, 0, .85, -.62);
  box(1.2, .42, .3, m, .14, h, 0, .1, .5); for (const s of [-1, 1]) box(.3, .6, .5, m, .1, h, s * .55, .3, .35); };
const goggles = (col, lens) => o => { box(1.42, .2, 1.3, mat(0x1a1a1e), .08, o.head, 0, 1.28, 0); for (const s of [-1, 1]) { const l = cyl(.24, .24, .2, mat(col, { metalness: .6 }), 14, o.head, s * .3, 1.3, .62); l.rotation.x = Math.PI / 2; sphere(.2, mat(lens, { roughness: .05, metalness: .5 }), o.head, s * .3, 1.3, .7, 10, 8).scale.z = .4; } };
const visor = col => o => { const v = box(1.3, .3, .2, mat(col, { emissive: col, emissiveIntensity: .6, metalness: .7, roughness: .2 }), .08, o.head, 0, .84, .62); o.props.visor = v; };
const helmetC = col => o => { const m = mat(col, { roughness: .6 }); const d = new THREE.Mesh(new THREE.SphereGeometry(.86, 22, 12, 0, 6.283, 0, 1.4), m); d.position.y = 1.0; o.head.add(d); cyl(1.02, 1.02, .1, m, 24, o.head, 0, .98, 0); };
const robe = (col) => sp => { box(2.2, 2.12, 1.2, mat(col, { roughness: .8 }), .16, sp, 0, 1.0, 0); box(.6, .7, .1, mat(0xffffff), .04, sp, 0, 1.75, .62); for (let k = 0; k < 3; k++) box(.5 - k * .1, .14, .08, mat(0xf4f4f4), .02, sp, 0, 1.55 - k * .16, .66); };
const uniformS = col => sp => { box(2.12, 2.08, 1.14, mat(col, { roughness: .8 }), .14, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(.6, .5, .08, mat(0x4a5428), .04, sp, s * .55, 1.45, .58); box(2.14, .24, 1.16, mat(0x2a2a1e), .05, sp, 0, .12, 0); };
const pyj = sp => { const t = canvasTex(32, 32, (c, w, h) => { c.fillStyle = '#8ad0ff'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 4); }, true); box(2.1, 2.06, 1.12, mat(0xffffff, { map: t, roughness: .9 }), .14, sp, 0, 1.02, 0); };

// emblemas
const hourglass = (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(64, 64, 58, 0, 7); c.fill(); c.fillStyle = '#141a3a'; c.beginPath(); c.arc(64, 64, 48, 0, 7); c.fill(); c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(40, 30); c.lineTo(88, 30); c.lineTo(64, 64); c.lineTo(88, 98); c.lineTo(40, 98); c.lineTo(64, 64); c.closePath(); c.fill(); };
const fist = (c) => { c.fillStyle = '#ff8a1a'; c.beginPath(); c.arc(64, 64, 56, 0, 7); c.fill(); c.fillStyle = '#3a3e4a'; c.fillRect(38, 44, 52, 40); for (let i = 0; i < 4; i++) { c.fillStyle = '#5a5e6a'; c.fillRect(40 + i * 12, 36, 10, 16); } };
const bolt = (c) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(74, 8); c.lineTo(34, 70); c.lineTo(60, 70); c.lineTo(48, 120); c.lineTo(96, 52); c.lineTo(68, 52); c.closePath(); c.fill(); c.strokeStyle = '#1a1a2a'; c.lineWidth = 4; c.stroke(); };
const eye = (c) => { c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(64, 64, 56, 30, 0, 0, 7); c.fill(); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(64, 64, 22, 0, 7); c.fill(); c.fillStyle = '#d8323a'; c.beginPath(); c.arc(64, 64, 10, 0, 7); c.fill(); };
const swirl = (c) => { c.strokeStyle = '#8a3ad8'; c.lineWidth = 12; c.beginPath(); for (let a = 0; a < 14; a += .2) { const r = 4 + a * 3.6; c.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } c.stroke(); };

export function makeKapitaen(scene) { const o = mk(scene, S({ seed: 9101, scale: 1.04, skin: 0xf0c8a8, shirt: 0x141a3a, shirt2: 0x141a3a, cuffs: 0xffd23f, pants: 0x141a3a, shoes: 0xd9a531, sole: 0x6a4a10, hair: 0x101016, hairBuild: slick(0x101016, 0xc8ccd8),
  torsoDetail: heroSuit(0x141a3a, 0xd9a531, hourglass), face: { iris: '#6a3ad8', browColor: '#101016', blush: .1 } }), [gloves(0xf4f4f4), bootsC(0xd9a531)]); cape(o, 0x101014, 0x6a2ad8, 4.6); return o; }
export function makeKlein(scene) { const o = mk(scene, S({ seed: 9102, scale: .62, skin: 0xf2c8a8, shirt: 0x8ad0ff, shirt2: 0x8ad0ff, cuffs: 0xffffff, pants: 0x8ad0ff, shoes: 0xd8323a, sole: 0xffffff, hair: 0x101016, hairBuild: hairS(0x101016, 'fringe'),
  torsoDetail: pyj, face: { iris: '#6a3ad8', browColor: '#101016', blush: .5, freckles: 1 } })); cape(o, 0xd8323a, 0xff6a6a, 3.2); return o; }
export function makeStahl(scene) { const o = mk(scene, S({ seed: 9103, scale: 1.14, skin: 0xd8a07a, shirt: 0x6a707e, shirt2: 0x6a707e, cuffs: 0xff8a1a, pants: 0x4a4e5a, shoes: 0xff8a1a, sole: 0x2a2a2a, hair: 0xf4f0e0, hairBuild: undercut(0xf4f0e0),
  torsoDetail: heroSuit(0x6a707e, 0xff8a1a, fist), face: { iris: '#2a6ab8', browColor: '#d8d0b8', blush: .2, lashes: 1 } }), [o => { for (const a of [o.aL, o.aR]) box(1.2, .9, 1.2, mat(0x8a909e, { metalness: .7, roughness: .3 }), .25, a.hand, 0, -.25, .02); }, bootsC(0x4a4e5a)]); cape(o, 0xff8a1a, 0xffb85a, 4.4); return o; }
export function makeZack(scene) { const o = mk(scene, S({ seed: 9104, scale: .94, skin: 0xf2c4a0, shirt: 0x1a6aff, shirt2: 0x1a6aff, cuffs: 0xffd23f, pants: 0x1a6aff, shoes: 0xffd23f, sole: 0xffffff, hair: 0xf4f4fa, hairBuild: spikesW(0xf4f4fa),
  torsoDetail: heroSuit(0x1a6aff, 0xffd23f, bolt), face: { iris: '#1a6aff', browColor: '#d8d8e0', blush: .3 } }), [goggles(0xffd23f, 0x3ab8ff)]); cape(o, 0xffd23f, 0xffe88a, 3.0); return o; }
export function makeFunkel(scene) { const o = mk(scene, S({ seed: 9105, scale: 1.0, skin: 0xc68b5e, shirt: 0xd8202a, shirt2: 0xd8202a, cuffs: 0xffffff, pants: 0xd8202a, shoes: 0xf4f4f4, sole: 0x2a2a2a, hair: 0x5a3018, hairBuild: mohawk(0x5a3018),
  torsoDetail: heroSuit(0xd8202a, 0xf4f4f4, eye), face: { iris: '#ffb020', browColor: '#3a2010', blush: .15 } }), [visor(0xffc828), gloves(0xf4f4f4)]); cape(o, 0xd9a531, 0xffe08a, 4.0); return o; }
export function makeAlles(scene) { const o = mk(scene, S({ seed: 9106, scale: .98, skin: 0xf4cdb0, shirt: 0x7ad8b8, shirt2: 0x7ad8b8, cuffs: 0x8a3ad8, pants: 0x3a8a7a, shoes: 0x8a3ad8, sole: 0x2a1a3a, hair: 0xf2f2f2, hairBuild: baldBeard(0xf2f2f2),
  torsoDetail: heroSuit(0x7ad8b8, 0x8a3ad8, swirl), face: { iris: '#5a8a6a', browColor: '#e8e8e8', blush: .45 } }), [o => glasses(o.head)]); cape(o, 0x8a3ad8, 0xc89aff, 4.2); return o; }
export function makeGranitor(scene) { const o = mk(scene, S({ seed: 9107, scale: 9, skin: 0x7a7e86, shirt: 0x3a3e48, shirt2: 0x4a4e58, cuffs: 0x2a2e38, pants: 0x2e323c, shoes: 0x1e2228, sole: 0x101216, hair: 0x2a2e38, hairBuild: h => { const m = mat(0x2a2e38, { roughness: .5, metalness: .4 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.78, 22, 12, 0, 6.283, 0, 1.45), m); c.position.y = 1.0; h.add(c); for (const s of [-1, 1]) { const k = new THREE.Mesh(new THREE.ConeGeometry(.2, .7, 8), m); k.position.set(s * .6, 1.6, 0); k.rotation.z = -s * .5; h.add(k); } },
  torsoDetail: sp => { const m = mat(0x3a3e48, { roughness: .6, metalness: .3 }); box(2.2, 2.12, 1.2, m, .2, sp, 0, 1.02, 0); for (const s of [-1, 1]) box(1.1, .6, 1.5, m, .2, sp, s * 1.25, 2.0, 0); }, face: { iris: '#ff6a1a', browColor: '#2a2e38' } }));
  // grietas que brillan (se encienden con el láser)
  const crack = mat(0xff6a1a, { emissive: 0xff4a00, emissiveIntensity: 1.2 }); const C = []; for (let i = 0; i < 9; i++) { const c = box(.08, .5 + (i % 3) * .3, .04, crack, 0, o.spine, -.8 + (i % 5) * .4, .5 + (i % 4) * .45, .62); c.rotation.z = (i % 2 ? .5 : -.5); C.push(c); }
  o.props.armor = o.spine.children.filter(m => m.isMesh && m.material.metalness > .2).map(m => m.material); o.props.crack = crack; return o; }
export function makeRichter(scene) { return mk(scene, S({ seed: 9108, scale: 1.0, skin: 0xf0c4a2, shirt: 0x141418, shirt2: 0x141418, cuffs: 0x141418, pants: 0x141418, shoes: 0x1a1a1a, hair: 0xf2f2f2, hairBuild: hairS(0xf2f2f2, 'swoop'),
  torsoDetail: robe(0x141418), face: { iris: '#3a5a7a', browColor: '#e0e0e0', bags: 1 } }), [o => glasses(o.head)]); }
export function makeSoldat(scene, i) { return mk(scene, S({ seed: 9120 + i, scale: 1.0, skin: [0xeab08a, 0xc8865a, 0xf2c4a0, 0x8a5a3a][i % 4], shirt: 0x5a6a3a, shirt2: 0x5a6a3a, cuffs: 0x4a5428, pants: 0x4a5428, shoes: 0x2a2018, sole: 0x1a1a1a, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'plain'),
  torsoDetail: uniformS(0x5a6a3a), face: { iris: '#3a2a1a', browColor: '#2a1a10' } }), [helmetC(0x4a5a2e)]); }
// estatua de piedra del capitán (mismo cuerpo, todo gris piedra)
export function makeStatue(scene) { const st = 0xd8d4cc; const o = mk(scene, S({ seed: 9130, scale: 3.2, skin: st, shirt: st, shirt2: st, cuffs: st, pants: st, shoes: st, sole: st, hair: st, hairBuild: slick(0xd0ccc4), torsoDetail: heroSuit(0xd8d4cc, 0xc8c4bc, null), face: { iris: '#a8a49c', browColor: '#a8a49c' } }));
  cape(o, 0xc8c4bc, 0xd8d4cc, 4.6); o.root.traverse(m => { if (m.isMesh && m.material && m.material.color && m !== o.face) { m.material = m.material.clone(); m.material.color.setHex(0xd8d4cc); m.material.metalness = 0; m.material.roughness = .9; } }); return o; }
export function makePolizist(scene) { return mk(scene, S({ seed: 9140, scale: 1.02, skin: 0xeab08a, shirt: 0x2a4a8a, shirt2: 0x2a4a8a, cuffs: 0x1a2a5a, pants: 0x1a2a5a, shoes: 0x1a1a1a, hair: 0x5a3a1a, hairBuild: hairS(0x5a3a1a, 'plain'),
  torsoDetail: sp => { uniformS(0x2a4a8a)(sp); const b = box(.4, .5, .06, mat(0xffd23f, { metalness: .8 }), .03, sp, -.5, 1.5, .6); }, face: { iris: '#3a2a1a', browColor: '#3a2010' } }),
  [o => { const m = mat(0x1a2a5a, { roughness: .5 }); cyl(.78, .74, .5, m, 24, o.head, 0, 1.42, 0); box(1.6, .1, 1.1, mat(0x101010), .05, o.head, 0, 1.18, .45); box(.4, .3, .06, mat(0xffd23f, { metalness: .8 }), .02, o.head, 0, 1.45, .78); }]); }

// Gänse — reparto propio: jóvenes alemanes de hoy (y Papa, el alcalde, el conductor, bomberos). Nadie se parece al vídeo de referencia.
// Ich (≈22): flequillo cortina castaño, sudadera oversize verde oliva con cordones, cargo beige, zapatillas blancas gordas, cadenita plateada.
// Papa (≈55): calvo por arriba con laterales grises, bigote, gafas, camisa de cuadros azul, chaleco de punto marrón, pana beige, zapatillas de casa.
// Lena (panadera, ≈22): moño despeinado castaño con flequillo, pecas, camiseta rosa palo, delantal blanco enharinado, vaqueros claros, aros dorados.
// Jonas (vecino): mullet rubio, bigotito, chándal turquesa con ribetes blancos, gafas de sol en la frente, chanclas con calcetines blancos.
// Bürgermeister Brandt: raya al lado gris, gafas, traje verde botella, cadena de alcalde dorada (Amtskette).
// Busfahrer: barba castaña, gorra azul marino, camisa celeste con chaleco azul. Taquillera del cine: coleta pelirroja, chaleco rojo, cascos.
// Cita: ella (melena negra con flequillo cortina, chaqueta vaquera, boina mostaza), él (pelirrojo, camiseta de rayas, gafas redondas).
// Colegas: gorra roja del revés + sudadera gris; rizos con cortavientos morado/amarillo; rubio con gorro de pescador verde.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG } from './engine.js';
import { mk, hairS, glasses, mustache, cap, shades, hoodie, suit } from './props.js';

const hex = c => '#' + c.toString(16).padStart(6, '0');
const plaid = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; c.globalAlpha = .55; for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 6, h); c.fillRect(0, i * 16, w, 6); } c.globalAlpha = .3; c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { c.fillRect(i * 16 + 10, 0, 1, h); c.fillRect(0, i * 16 + 10, w, 1); } }, true);
const stripesT = (a, b) => canvasTex(32, 32, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 4); }, true);
const knit = (a, b) => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 2; for (let x = 0; x < w; x += 8) for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y + 6); c.lineTo(x + 8, y); c.stroke(); } }, true);
const denim = a => canvasTex(64, 64, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(5); for (let i = 0; i < 500; i++) { c.fillStyle = `rgba(255,255,255,${r() * .12})`; c.fillRect(r() * w, r() * h, 3, 1); } }, true);

// ---------- peinados ----------
function curtain(col) { return h => { const m = mat(col, { roughness: .55 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.32), m); c.position.y = 1.0; c.scale.set(1.04, .7, 1.04); h.add(c);
  for (const s of [-1, 1]) { const f = box(.62, .5, .3, m, .14, h, s * .34, 1.12, .52); f.rotation.set(-.25, 0, s * .42); const f2 = box(.3, .55, .24, m, .1, h, s * .64, .86, .38); f2.rotation.z = s * .1; }
  box(1.36, .7, .36, m, .16, h, 0, .9, -.52); }; }
function mullet(col) { return h => { const m = mat(col, { roughness: .5 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 26, 13, 0, 6.283, 0, 1.25), m); c.position.y = 1.02; c.scale.set(1.03, .55, 1.03); h.add(c);
  for (let i = -2; i <= 2; i++) { const s = box(.26, .3, .26, m, .1, h, i * .24, 1.2, .5); s.rotation.x = -.5; } const b = box(1.2, 1.1, .4, m, .16, h, 0, .45, -.55); for (const s of [-1, 1]) { const l = box(.3, .6, .3, m, .1, h, s * .48, .02, -.58); l.rotation.z = s * .2; } }; }
function buzz(col) { return h => { const c = new THREE.Mesh(new THREE.SphereGeometry(.7, 24, 12, 0, 6.283, 0, 1.2), mat(col, { roughness: .95 })); c.position.y = 1.0; c.scale.set(1.02, .55, 1.02); h.add(c); }; }
function messyBun(col) { return h => { const m = mat(col, { roughness: .6 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.3), m); c.position.y = 1.0; c.scale.set(1.04, .66, 1.04); h.add(c);
  for (let i = -2; i <= 2; i++) { const f = box(.3, .4, .22, m, .1, h, i * .25, 1.14, .56); f.rotation.set(-.35, 0, i * .08); } const b = sphere(.42, m, h, 0, 1.72, -.18, 14, 10); b.scale.set(1, .85, 1); for (let k = 0; k < 4; k++) { const st = box(.1, .35, .1, m, .04, h, Math.cos(k * 1.7) * .3, 1.95, -.2 + Math.sin(k * 1.7) * .3); st.rotation.z = Math.cos(k * 1.7) * .7; }
  for (const s of [-1, 1]) { const l = box(.12, .55, .12, m, .05, h, s * .62, .78, .32); l.rotation.z = s * .12; } }; }
function longBangs(col) { return h => { const m = mat(col, { roughness: .45 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.73, 26, 13, 0, 6.283, 0, 1.32), m); c.position.y = 1.0; c.scale.set(1.04, .7, 1.04); h.add(c);
  for (const s of [-1, 1]) { const f = box(.55, .45, .26, m, .12, h, s * .32, 1.12, .54); f.rotation.set(-.3, 0, s * .35); box(.34, 1.7, .9, m, .14, h, s * .66, .2, -.1); } box(1.36, 1.8, .4, m, .16, h, 0, .3, -.52); }; }
function sidePart(col) { return h => { const m = mat(col, { roughness: .4 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.72, 26, 13, 0, 6.283, 0, 1.28), m); c.position.y = 1.0; c.scale.set(1.04, .62, 1.04); h.add(c); const s = box(1.0, .36, 1.0, m, .16, h, .14, 1.36, .05); s.rotation.z = -.14; }; }
function baldSides(col) { return h => { const m = mat(col, { roughness: .9 }); for (const s of [-1, 1]) { box(.24, .55, .9, m, .1, h, s * .66, .9, -.12); } box(1.2, .5, .3, m, .12, h, 0, .9, -.6); }; }
function curlyTop(col) { return h => { const m = mat(col, { roughness: .9 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.71, 24, 12, 0, 6.283, 0, 1.2), m); c.position.y = .98; c.scale.set(1.03, .5, 1.03); h.add(c); for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283, rr = .2 + (i % 3) * .14; sphere(.2, m, h, Math.cos(a) * rr, 1.38 + (i % 2) * .08, Math.sin(a) * rr + .05, 8, 6); } }; }
// ---------- accesorios ----------
const bucket = (col) => o => { const m = mat(col, { roughness: .9 }); cyl(.72, .74, .5, m, 24, o.head, 0, 1.42, 0); cyl(.78, .72, .1, m, 24, o.head, 0, 1.68, 0); const b = cyl(1.0, 1.0, .06, m, 24, o.head, 0, 1.18, 0); b.rotation.x = .05; };
const beret = (col) => o => { const b = sphere(.8, mat(col, { roughness: 1 }), o.head, -.08, 1.36, 0, 18, 10); b.scale.set(1, .32, 1); sphere(.07, mat(col), o.head, -.08, 1.62, 0, 6, 4); };
const capBack = (col) => o => { cap(o.head, col, 0xffffff); const c = o.head.children[o.head.children.length - 1]; o.head.rotation.y; o.head.children.slice(-3).forEach(m => { m.rotation.y += Math.PI; m.position.z *= -1; }); };
const helmet = (col) => o => { const m = mat(col, { roughness: .3 }); const d = new THREE.Mesh(new THREE.SphereGeometry(.84, 22, 12, 0, 6.283, 0, 1.45), m); d.position.y = 1.0; o.head.add(d); const br = cyl(1.02, 1.02, .08, m, 24, o.head, 0, 1.0, -.1); box(.24, .5, .1, mat(0xf2c23a), .04, o.head, 0, 1.55, .8); box(1.3, .1, .1, mat(0xe8e8e8, { emissive: 0x888888, emissiveIntensity: .3 }), .03, o.head, 0, 1.25, .82); };
const earrings = (col = 0xe9c23a) => o => { for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.1, .025, 6, 14), mat(col, { metalness: .9, roughness: .2 })); r.position.set(s * .7, .22, .05); r.rotation.y = Math.PI / 2; o.head.add(r); } };
const chainS = sp => { const c = new THREE.Mesh(new THREE.TorusGeometry(.5, .04, 6, 26, Math.PI), mat(0xd8dce4, { metalness: .95, roughness: .15 })); c.rotation.z = Math.PI; c.position.set(0, 1.98, .56); sp.add(c); };
const amtskette = sp => { const g = mat(0xe9c23a, { metalness: .9, roughness: .2, emissive: 0x5a4000, emissiveIntensity: .2 }); for (let i = 0; i < 11; i++) { const a = Math.PI + i / 10 * Math.PI; box(.2, .14, .08, g, .03, sp, Math.cos(a) * .72, 1.95 + Math.sin(a) * .62, .58); } const m = cyl(.32, .32, .08, g, 18, sp, 0, 1.2, .62); m.rotation.x = Math.PI / 2; };
const oversizeHoodie = (col, str = 0xffffff) => sp => { const j = mat(col, { roughness: .9 }); box(2.2, 2.12, 1.2, j, .2, sp, 0, 1.0, -.02); box(1.4, .55, .1, j, .1, sp, 0, .45, .62); for (const s of [-1, 1]) cyl(.04, .04, .8, mat(str), 6, sp, s * .22, 1.55, .64); const hd = box(1.7, .62, .66, j, .24, sp, 0, 2.0, -.58); hd.rotation.x = .3; box(2.24, .2, 1.24, mat(col, { roughness: 1 }), .08, sp, 0, .02, -.02); };
const vestKnit = col => sp => { const m = mat(0xffffff, { roughness: 1, map: knit(hex(col), 'rgba(0,0,0,.2)') }); box(2.12, 1.9, 1.14, m, .14, sp, 0, .98, 0); const v = new THREE.Mesh(new THREE.ConeGeometry(.45, .9, 3), mat(0x2a4a8a)); v.position.set(0, 1.7, .55); v.rotation.set(Math.PI, 0, 0); v.scale.z = .1; sp.add(v); };
const apron = col => o => { const m = mat(col, { roughness: 1, map: canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#fbfaf6'; c.fillRect(0, 0, w, h); const r = RNG(9); for (let i = 0; i < 30; i++) { c.fillStyle = 'rgba(220,200,170,.5)'; c.beginPath(); c.arc(r() * w, r() * h, 2 + r() * 4, 0, 7); c.fill(); } }) });
  box(1.6, 1.5, .08, m, .03, o.spine, 0, .9, .56); box(1.3, 1.1, .08, m, .03, o.hips, 0, -.6, .6); for (const s of [-1, 1]) box(.12, 1.2, .06, m, .02, o.spine, s * .55, 1.8, .55); };
const track = (col, pipe) => sp => { const j = mat(col, { roughness: .45 }); box(2.1, 2.08, 1.12, j, .14, sp, 0, 1.02, -.01); box(.07, 1.95, .06, mat(0xd8d8d8, { metalness: .7 }), 0, sp, 0, 1.02, .58); for (const s of [-1, 1]) { box(.08, 2.0, .06, mat(pipe), 0, sp, s * 1.06, 1.02, .2); box(.08, 2.0, .06, mat(pipe), 0, sp, s * 1.06, 1.02, -.1); } const c = box(1.5, .4, 1.2, j, .14, sp, 0, 2.05, 0); };
const windbreaker = (a, b) => sp => { box(2.12, 1.05, 1.14, mat(a, { roughness: .35 }), .14, sp, 0, 1.5, 0); box(2.12, 1.05, 1.14, mat(b, { roughness: .35 }), .14, sp, 0, .52, 0); box(.07, 1.95, .06, mat(0x222222), 0, sp, 0, 1.02, .59); };
const denimJacket = col => sp => { const m = mat(0xffffff, { roughness: .8, map: denim(hex(col)) }); for (const s of [-1, 1]) box(.74, 2.05, 1.14, m, .1, sp, s * .66, 1.02, 0); box(2.1, 2.05, .5, m, .1, sp, 0, 1.02, -.32); box(.62, 2.0, .06, mat(0xf4f4f4), .02, sp, 0, 1.02, .56);
  for (const s of [-1, 1]) { box(.5, .4, .06, m, .04, sp, s * .6, 1.5, .6); const c = box(.6, .26, .5, m, .08, sp, s * .5, 2.02, .38); c.rotation.z = s * .5; } };
const uniform = (col, refl) => sp => { const m = mat(col, { roughness: .6 }); box(2.16, 2.1, 1.18, m, .14, sp, 0, 1.02, 0); for (const y of [.5, 1.3]) box(2.2, .16, 1.22, mat(refl, { emissive: refl, emissiveIntensity: .25 }), .03, sp, 0, y, 0); };
const shirtVest = (sh, ve) => sp => { box(1.95, 2.0, 1.1, mat(ve, { roughness: .6 }), .12, sp, 0, 1.0, 0); box(.5, 1.0, .06, mat(sh), .02, sp, 0, 1.5, .56); box(.18, .8, .05, mat(0x1a2a4a), .02, sp, 0, 1.45, .6); };

const S = (o) => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
export function makeIch(scene) { return mk(scene, S({ seed: 1101, scale: .95, skin: 0xf0c09c, shirt: 0x6b7a3a, shirt2: 0x6b7a3a, cuffs: 0x5a682e, pants: 0xc8b48a, shoes: 0xf6f6f2, sole: 0xd8d8d8, hair: 0x6a4428, hairBuild: curtain(0x6a4428),
  torsoDetail: oversizeHoodie(0x6b7a3a, 0xf2f2f2), face: { iris: '#4a6a3a', browColor: '#5a3a20', blush: .25 } }), [o => chainS(o.spine)]); }
export function makePapa(scene) { return mk(scene, S({ seed: 1102, scale: 1.0, skin: 0xf2b898, shirtMap: plaid('#5a8ad0', '#ffffff'), shirt2: null, cuffs: 0x3a5a9a, pants: 0xc8a878, shoes: 0x6a4a30, sole: 0x3a2a20, hair: 0x9a958e, hairBuild: baldSides(0x9a958e),
  torsoDetail: vestKnit(0x8a5a32), face: { iris: '#4a6a8a', browColor: '#7a7570', blush: .45 } }), [o => mustache(o.head, 0x8a7a6a), o => glasses(o.head)]); }
export function makeLena(scene) { return mk(scene, S({ seed: 1103, scale: .9, skin: 0xf4c6a6, shirt: 0xf4a8c0, shirt2: 0xf4a8c0, cuffs: 0xe890b0, pants: 0x8ab0d8, shoes: 0xf4f0e8, sole: 0xc8b8a0, hair: 0x4a2a16, hairBuild: messyBun(0x4a2a16), sleeveShort: true,
  face: { iris: '#5a3a1a', browColor: '#3a2010', blush: .55, freckles: 1 } }), [apron(0xffffff), earrings()]); }
export function makeJonas(scene) { return mk(scene, S({ seed: 1104, scale: .96, skin: 0xeab08a, shirt: 0x1aa0a0, shirt2: 0x1aa0a0, cuffs: 0xffffff, pants: 0x1aa0a0, shoes: 0x2a2a2a, sole: 0x1a1a1a, socks: 0xffffff, hair: 0xd8a840, hairBuild: mullet(0xd8a840),
  torsoDetail: track(0x1aa0a0, 0xffffff), face: { iris: '#3a7ab8', browColor: '#b8862a', blush: .35 } }), [o => mustache(o.head, 0xc89a40), o => { shades(o.head, 0x1a1a1a, 0xe9c23a); o.head.children.slice(-3).forEach(m => { m.position.y += .55; m.position.z -= .05; m.rotation.x = -.3; }); }]); }
export function makeMayor(scene) { return mk(scene, S({ seed: 1105, scale: 1.05, skin: 0xf0bc98, shirt: 0x24483a, shirt2: 0x24483a, cuffs: 0xffffff, pants: 0x24483a, shoes: 0x1a1a1a, hair: 0xbababa, hairBuild: sidePart(0xbababa),
  torsoDetail: sp => { suit(0x24483a, 0xffffff, 0x8a1a2a)(sp); amtskette(sp); }, face: { iris: '#3a5a7a', browColor: '#9a9a9a', bags: 1 } }), [o => glasses(o.head)]); }
export function makeFahrer(scene) { return mk(scene, S({ seed: 1106, scale: 1.05, skin: 0xd8a07a, shirt: 0xa8d0f0, shirt2: 0xa8d0f0, cuffs: 0x2a3a6a, pants: 0x2a3a5a, shoes: 0x1a1a1a, hair: 0x4a2a14, hairBuild: hairS(0x4a2a14, 'fringe'),
  torsoDetail: shirtVest(0xa8d0f0, 0x2a3a6a), face: { iris: '#3a2a1a', browColor: '#3a2010' } }), [o => { const m = mat(0x4a2a14, { roughness: .9 }); box(1.3, .55, .3, m, .14, o.head, 0, .2, .55); for (const s of [-1, 1]) box(.24, .7, .9, m, .1, o.head, s * .6, .45, .2); }, o => cap(o.head, 0x1a2a4a, 0xe9c23a)]); }
export function makeKassiererin(scene) { return mk(scene, S({ seed: 1107, scale: .88, skin: 0xf2c0a0, shirt: 0xffffff, shirt2: 0xffffff, cuffs: 0xd8283a, pants: 0x1a1a24, hair: 0xb8441a, hairBuild: hairS(0xb8441a, 'pony'),
  torsoDetail: sp => { box(2.1, 2.0, 1.12, mat(0xd8283a, { roughness: .5 }), .12, sp, 0, 1.0, 0); box(.5, 1.0, .06, mat(0xffffff), .02, sp, 0, 1.5, .57); }, face: { iris: '#4a7a4a', browColor: '#8a3a14', freckles: 1, blush: .4 } }), [o => { const b = new THREE.Mesh(new THREE.TorusGeometry(.74, .05, 6, 20, Math.PI), mat(0x1a1a1a)); b.position.y = .9; o.head.add(b); for (const s of [-1, 1]) cyl(.2, .2, .16, mat(0x1a1a1a), 12, o.head, s * .72, .7, 0).rotation.z = Math.PI / 2; const mic = box(.06, .06, .6, mat(0x1a1a1a), .02, o.head, -.62, .35, .35); mic.rotation.y = .5; }]); }
export function makeSie(scene) { return mk(scene, S({ seed: 1108, scale: .9, skin: 0xe0a882, shirt: 0xf4f4f4, shirt2: 0x4a6a9a, cuffs: 0x4a6a9a, pants: 0x2a2a34, shoes: 0xd8c8a8, hair: 0x1a1410, hairBuild: longBangs(0x1a1410),
  torsoDetail: denimJacket(0x4a6a9a), face: { iris: '#3a2410', browColor: '#1a1410', blush: .5 } }), [beret(0xd8a028), earrings(0xd8dce4)]); }
export function makeEr(scene) { return mk(scene, S({ seed: 1109, scale: .93, skin: 0xf4c8a8, shirtMap: stripesT('#1a2a5a', '#f4f4f4'), shirt2: null, cuffs: 0x1a2a5a, pants: 0x8a7a5a, shoes: 0x2a2a2a, sole: 0xf4f4f4, hair: 0xc0602a, hairBuild: hairS(0xc0602a, 'fringe'),
  face: { iris: '#4a8a5a', browColor: '#a04a1a', freckles: 1, blush: .45 } }), [o => glasses(o.head)]); }
export function makeKumpel(scene, i) { const L = [
  [0xe8b08c, 0x2a1a10, buzz(0x2a1a10), oversizeHoodie(0x8a8e96), 0x2a2a34, [o => capBack(0xd8283a)(o)]],
  [0x8a5a3a, 0x101010, curlyTop(0x101010), windbreaker(0x6a3ad8, 0xf2c23a), 0xf2f2f2, [o => chainS(o.spine)]],
  [0xf0c098, 0xe0b850, hairS(0xe0b850, 'long'), sp => box(2.1, 2.05, 1.12, mat(0xf2c23a, { roughness: .8 }), .12, sp, 0, 1.02, 0), 0x3a4a6a, [bucket(0x3a8a4a)]],
  [0xd8a07a, 0x3a2214, curtain(0x3a2214), track(0xd8283a, 0x1a1a1a), 0x1a1a24, []],
  [0xf4c4a0, 0x8a5a2a, hairS(0x8a5a2a, 'swoop'), oversizeHoodie(0xf2a0c0), 0x6a6a72, [o => glasses(o.head)]],
  [0xa86a42, 0x1a1008, messyBun(0x1a1008), denimJacket(0x3a3a46), 0xc8b48a, [earrings()]],
  [0xeeac84, 0x5a3a1e, mullet(0x5a3a1e), windbreaker(0x1a8a5a, 0xffffff), 0x2a2a34, [bucket(0x1a1a1a)]],
  [0xf0b088, 0xb8441a, hairS(0xb8441a, 'curly'), oversizeHoodie(0x2a6ad8), 0x2a2a3a, []],
][i % 8]; const [sk, hc, hb, td, pa, acc] = L;
  return mk(scene, S({ seed: 1120 + i, scale: .9 + (i % 3) * .04, skin: sk, shirt: 0x888888, shirt2: [0x8a8e96, 0x6a3ad8, 0xf2c23a, 0xd8283a, 0xf2a0c0, 0x3a3a46, 0x1a8a5a, 0x2a6ad8][i % 8], cuffs: 0x2a2a2a, pants: pa, shoes: [0xf4f4f4, 0x1a1a1a, 0xd8c8a8][i % 3], hair: hc, hairBuild: hb,
    torsoDetail: td, face: { iris: ['#3a2410', '#3a6a8a', '#4a7a4a'][i % 3], browColor: hex(hc), blush: .35 } }), acc); }
export function makeFeuerwehr(scene, i) { return mk(scene, S({ seed: 1140 + i, scale: 1.02, skin: [0xeab08a, 0xc8865a][i % 2], shirt: 0x1a2440, shirt2: 0x1a2440, cuffs: 0xe8f040, pants: 0x1a2440, shoes: 0x1a1a1a, hair: 0x3a2a1a, hairBuild: buzz(0x3a2a1a),
  torsoDetail: uniform(0x1a2440, 0xe8f040), face: { iris: '#3a2a1a', browColor: '#3a2a1a' } }), [helmet(0xd8283a)]); }

// ---------- Stadtvideos ----------
// Ich (≈16): flequillo cortina castaño oscuro, sudadera naranja con cordones blancos, vaqueros oscuros, zapatillas blancas, mochila amarilla.
export function makeHero(scene) { return mk(scene, S({ seed: 3101, scale: .9, skin: 0xf0c09c, shirt: 0xf26a1b, shirt2: 0xf26a1b, cuffs: 0xd8540e, pants: 0x2a3a5a, shoes: 0xf6f6f2, sole: 0xd8d8d8, hair: 0x3a2416, hairBuild: curtain(0x3a2416),
  torsoDetail: oversizeHoodie(0xf26a1b, 0xffffff), face: { iris: '#3a5a8a', browColor: '#2a1a10', blush: .3 } }), [o => { const bp = mat(0xffd23f, { roughness: .7 }); box(1.7, 1.9, .8, bp, .25, o.spine, 0, 1.1, -.95); box(1.2, .7, .3, mat(0xe8b82a), .1, o.spine, 0, .7, -1.38); for (const s of [-1, 1]) box(.2, 2, .14, mat(0x2a2a2a), .04, o.spine, s * .6, 1.2, .58); }]); }
// Oma Gerda: moño blanco, gafas, rebeca lila con botones, collar de perlas, falda gris, zapatillas de casa rosas.
export function makeOma(scene) { return mk(scene, S({ seed: 3140, scale: .84, skin: 0xf4cfb6, shirt: 0xb898d8, shirt2: 0xb898d8, cuffs: 0x9878b8, pants: 0x6a6a7a, shoes: 0xff9ac0, sole: 0xe878a0, hair: 0xf0f0f0, hairBuild: messyBun(0xf0f0f0),
  torsoDetail: sp => { box(2.12, 2.04, 1.14, mat(0xb898d8, { roughness: 1, map: knit('#b898d8', 'rgba(0,0,0,.15)') }), .14, sp, 0, 1.0, 0); for (let k = 0; k < 4; k++) sphere(.08, mat(0xffffff), sp, .14, 1.7 - k * .35, .6, 6, 4); for (let k = 0; k < 9; k++) { const a = Math.PI + k / 8 * Math.PI; sphere(.09, mat(0xfff8f0, { roughness: .2 }), sp, Math.cos(a) * .5, 1.98 + Math.sin(a) * .35, .6, 6, 4); } }, face: { iris: '#5a7a9a', browColor: '#cfcfcf', blush: .55 } }), [o => glasses(o.head)]); }
// Mamá (despertando al niño): melena castaña, bata rosa con cinturón, zapatillas.
export function makeMama(scene) { return mk(scene, S({ seed: 3150, scale: .9, skin: 0xe8b08c, shirt: 0xff9ac0, shirt2: 0xff9ac0, cuffs: 0xffffff, pants: 0xff9ac0, shoes: 0xf4f4f4, hair: 0x6a3a1a, hairBuild: longBangs(0x6a3a1a),
  torsoDetail: sp => { box(2.16, 2.08, 1.16, mat(0xff9ac0, { roughness: 1 }), .14, sp, 0, 1.0, 0); box(2.2, .25, 1.2, mat(0xffffff), .05, sp, 0, .5, 0); box(.6, 1.2, .06, mat(0xffffff), .02, sp, 0, 1.5, .6); }, face: { iris: '#4a3a1a', browColor: '#4a2a10', blush: .4 } }), [earrings()]); }

// Reparto con aspecto alemán: Finn (Lederhosen + camisa de cuadros), Opa (relojero con Janker de loden),
// Herr Wachter (camarero de Kaffeehaus con el bigote-agujas), vecinos con Tracht y Dirndl, Nachtwächter, ovejas.
import { THREE, character, box, mat, cyl, sphere, RNG, checkTex, canvasTex } from './engine.js';

const brass = () => mat(0xd9a531, { metalness: .75, roughness: .28 });
const hornM = () => mat(0x5a3a22, { roughness: .4 });

// sombrero tirolés de fieltro verde con cordón y pluma (Gamsbart)
export function tyroleanHat(head, color = 0x2f5a3a, y = 1.32) {
  const g = new THREE.Group(); g.position.y = y; head.add(g);
  const felt = mat(color, { roughness: .9 });
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.1, 0.12, 28), felt); brim.scale.z = 0.92; g.add(brim);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 0.75, 20), felt); crown.position.y = 0.42; g.add(crown);
  const dent = box(0.1, 0.1, 0.9, mat(0x1d3a24), 0.04, g, 0, 0.8, 0);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.73, 0.74, 0.14, 24), mat(0x8a2a2a)); band.position.y = 0.12; g.add(band);
  const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7, 10), mat(0xe8dcc0, { roughness: 1 })); tuft.position.set(-0.55, 0.55, -0.25); tuft.rotation.z = 0.5; g.add(tuft);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
// gorra plana (Schiebermütze)
export function flatCap(head, color = 0x6b5a48, y = 1.25) {
  const g = new THREE.Group(); g.position.y = y; head.add(g);
  const m = mat(color, { roughness: .9, map: checkTex('#6b5a48', '#4a3c30', 8) });
  box(1.5, 0.38, 1.42, m, 0.18, g, 0, 0.05, -0.02);
  const peak = box(1.3, 0.12, 0.62, m, 0.06, g, 0, -0.12, 0.85); peak.rotation.x = 0.18;
  box(0.18, 0.12, 0.18, m, 0.05, g, 0, 0.3, 0.1);
  return g;
}

// ---------- Finn ----------
function finnHair(head, m) {
  // pelo rubio de paja, revuelto
  box(1.42, 0.4, 1.32, m, 0.15, head, 0, 1.2, -0.02);
  box(1.42, 0.85, 0.34, m, 0.12, head, 0, 0.95, -0.52);
  for (const [x, y, z, s, r] of [[-0.45, 1.46, 0.28, 0.42, 0.3], [0.05, 1.55, 0.32, 0.5, -0.2], [0.48, 1.45, 0.22, 0.36, 0.5], [-0.15, 1.5, -0.3, 0.46, -0.4], [0.36, 1.48, -0.34, 0.4, 0.3], [-0.6, 1.2, 0.5, 0.3, 0.6], [0.62, 1.15, 0.45, 0.28, -0.5]]) {
    const t = box(s, s * 0.8, s, m, 0.08, head, x, y, z); t.rotation.set(r * 0.5, r, r * 0.6); }
  box(1.12, 0.28, 0.2, m, 0.08, head, -0.12, 1.07, 0.6).rotation.z = 0.14;
  // cinta con la lupa de relojero del abuelo
  box(1.46, 0.14, 1.36, mat(0x5a3a22), 0.05, head, 0, 1.0, 0);
  const loupe = cyl(0.22, 0.27, 0.3, brass(), 20, head, 0.36, 1.08, 0.68); loupe.rotation.x = Math.PI / 2;
  const glass = cyl(0.17, 0.17, 0.05, new THREE.MeshStandardMaterial({ color: 0x9fe3ff, roughness: .05, metalness: .2, emissive: 0x2a6f8f, emissiveIntensity: .5 }), 20, head, 0.36, 1.08, 0.84); glass.rotation.x = Math.PI / 2;
}
function finnTorso(sp) {
  // tirantes de cuero con el puente bordado (edelweiss)
  const leather = mat(0x6b4426, { roughness: .6 });
  for (const s of [-1, 1]) { box(0.26, 2.05, 0.06, leather, 0.03, sp, s * 0.55, 1.02, 0.56); box(0.26, 2.05, 0.06, leather, 0.03, sp, s * 0.55, 1.02, -0.56); }
  box(1.4, 0.36, 0.08, leather, 0.04, sp, 0, 1.45, 0.6);
  const ed = canvasTex(64, 32, (c) => { c.fillStyle = '#6b4426'; c.fillRect(0, 0, 64, 32); c.fillStyle = '#f4efe2'; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; c.beginPath(); c.ellipse(32 + Math.cos(a) * 7, 16 + Math.sin(a) * 7, 5, 3, a, 0, 7); c.fill(); } c.fillStyle = '#f2c23a'; c.beginPath(); c.arc(32, 16, 4, 0, 7); c.fill(); });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.32), new THREE.MeshStandardMaterial({ map: ed })); p.position.set(0, 1.45, 0.645); sp.add(p);
  for (const s of [-1, 1]) sphere(0.07, mat(0xe8dcc0), sp, s * 0.55, 0.3, 0.62);
  // cuello de la camisa
  for (const s of [-1, 1]) { const c = box(0.5, 0.2, 0.06, mat(0xffffff), 0.03, sp, s * 0.28, 1.98, 0.55); c.rotation.z = s * 0.4; }
}
export function makeFinn(scene) {
  const f = character(scene, {
    seed: 3, scale: 0.82, headScale: 1.08, skin: 0xf7d2b6, skinCss: '#f7d2b6',
    shirtMap: checkTex('#ffffff', '#d63a3a', 6), cuffs: 0xffffff,
    pants: 0x7a4e2c, shorts: true, socks: 0xe8e2d4, shoes: 0x5a3820, sole: 0x2a1a10, belt: 0x5a3820, hair: 0xe8c25a,
    face: { iris: '#4f86c6', freckles: 1, bags: 0.25, browColor: '#c89a3a' },
    hairBuild: finnHair, torsoDetail: finnTorso,
  });
  // perneras de cuero con bordado lateral
  for (const leg of [f.lL, f.lR]) box(1.0, 0.2, 1.03, mat(0x6b4426), 0.05, leg.hp, 0, -0.95, 0);
  return f;
}

// ---------- Opa ----------
function opaHair(head, m) {
  for (const s of [-1, 1]) { box(0.3, 0.55, 1.0, m, 0.12, head, s * 0.66, 0.85, -0.12); box(0.25, 0.25, 0.25, m, 0.08, head, s * 0.72, 1.1, 0.1); }
  box(1.36, 0.5, 0.3, m, 0.12, head, 0, 0.8, -0.5);
  const fr = mat(0x8a6a2a, { metalness: .7, roughness: .3 });
  for (const s of [-1, 1]) { const g = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 24), fr); g.position.set(s * 0.29, 0.86, 0.64); head.add(g);
    const l = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), new THREE.MeshStandardMaterial({ color: 0xdff4ff, transparent: true, opacity: .25, roughness: .05 })); l.position.set(s * 0.29, 0.86, 0.645); head.add(l); }
  box(0.2, 0.04, 0.04, fr, 0, head, 0, 0.88, 0.64);
  // bigote de morsa blanco y cejas pobladas
  const mo = box(0.86, 0.24, 0.14, m, 0.1, head, 0, 0.42, 0.65);
  for (const s of [-1, 1]) { const e = box(0.22, 0.36, 0.14, m, 0.08, head, s * 0.45, 0.3, 0.64); e.rotation.z = s * 0.25; box(0.34, 0.1, 0.1, m, 0.04, head, s * 0.3, 1.06, 0.64); }
}
function opaTorso(sp) {
  // Janker de loden gris con cuello verde y botones de asta
  const loden = mat(0x7d8378, { roughness: .95 }), green = mat(0x2f5a3a, { roughness: .8 });
  box(2.1, 2.0, 1.12, loden, 0.12, sp, 0, 1.02, 0);
  box(0.62, 1.9, 0.06, mat(0x3a5a3a), 0.03, sp, 0, 1.05, 0.58);                  // chaleco verde
  box(0.3, 1.9, 0.06, mat(0xf6f1e6), 0.02, sp, 0, 1.05, 0.6);                     // camisa
  for (const s of [-1, 1]) { const l = box(0.34, 1.0, 0.08, green, 0.03, sp, s * 0.38, 1.55, 0.6); l.rotation.z = s * 0.3; }
  for (let i = 0; i < 3; i++) for (const s of [-1, 1]) sphere(0.08, hornM(), sp, s * 0.48, 0.45 + i * 0.42, 0.6);
  box(0.42, 0.18, 0.1, mat(0x7a2a2a), 0.05, sp, 0, 1.95, 0.62);                   // pajarita
  const ch = box(0.7, 0.05, 0.05, brass(), 0.02, sp, -0.3, 0.75, 0.62); ch.rotation.z = -0.35;
  for (const s of [-1, 1]) box(0.56, 0.08, 0.06, green, 0.02, sp, s * 0.6, 0.55, 0.59);  // bolsillos con ribete
}
export function makeOpa(scene) {
  const o = character(scene, {
    seed: 7, scale: 0.96, skin: 0xf1c8a8, skinCss: '#f1c8a8', shirt: 0x7d8378, shirt2: 0x7d8378, cuffs: 0x2f5a3a,
    pants: 0x4a4a52, shoes: 0x3a2414, sole: 0x1a100a, hair: 0xf2f2f2,
    face: { iris: '#6b8fae', browColor: '#e8e8e8', bags: 0.2, mouthY: 14 }, hairBuild: opaHair, torsoDetail: opaTorso,
  });
  o.props.cap = flatCap(o.head);
  const nc = new THREE.Group(); o.head.add(nc); o.props.nightcap = nc;
  const capM = mat(0x5b7fd6, { roughness: .8, map: checkTex('#5b7fd6', '#ffffff', 4) });
  const c = new THREE.Mesh(new THREE.ConeGeometry(0.78, 1.8, 24), capM); c.position.set(0.25, 1.75, -0.1); c.rotation.z = -0.7; c.castShadow = true; nc.add(c);
  box(1.48, 0.3, 1.38, mat(0xffffff), 0.14, nc, 0, 1.3, 0);
  sphere(0.25, mat(0xffffff), nc, 1.0, 1.85, -0.1);
  nc.visible = false;
  o.sleepMode = (on) => { o.props.cap.visible = !on; nc.visible = on; };
  return o;
}

// ---------- Herr Wachter ----------
function wachterHair(head) {
  const shine = mat(0x141018, { roughness: .2, metalness: .1 });
  box(1.42, 0.34, 1.32, shine, 0.14, head, 0, 1.22, -0.02);
  box(1.42, 0.8, 0.3, shine, 0.1, head, 0, 0.95, -0.52);
  for (const s of [-1, 1]) { const w = box(0.68, 0.26, 1.2, shine, 0.12, head, s * 0.36, 1.4, 0.02); w.rotation.z = -s * 0.22; }   // raya al medio
  for (const s of [-1, 1]) box(0.14, 0.45, 0.4, shine, 0.05, head, s * 0.69, 0.75, 0.2);       // patillas
}
function addMoustache(o) {
  const m = mat(0x141018, { roughness: .25, metalness: .4 });
  const g = new THREE.Group(); g.position.set(0, 0.42, 0.66); o.head.add(g);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16), brass()); hub.rotation.x = Math.PI / 2; g.add(hub);
  const longH = new THREE.Group(); g.add(longH); box(0.85, 0.11, 0.06, m, 0.03, longH, 0.42, 0, 0); box(0.16, 0.16, 0.06, m, 0.04, longH, 0.82, 0, 0).rotation.z = Math.PI / 4;
  const shortH = new THREE.Group(); g.add(shortH); box(0.48, 0.14, 0.06, m, 0.03, shortH, -0.24, 0, 0); box(0.18, 0.18, 0.06, m, 0.04, shortH, -0.46, 0, 0).rotation.z = Math.PI / 4;
  longH.rotation.z = 0.22; shortH.rotation.z = -0.12;
  o.props.moustache = { g, longH, shortH };
}
function wachterTorso(sp) {
  // camarero de Kaffeehaus: chaleco negro, camisa blanca, pajarita, ligas en las mangas, delantal blanco largo
  box(2.08, 1.8, 1.12, mat(0x16141c, { roughness: .5 }), 0.1, sp, 0, 1.08, 0);
  box(0.5, 1.8, 0.06, mat(0xffffff), 0.02, sp, 0, 1.12, 0.57);
  for (const s of [-1, 1]) { const l = box(0.3, 1.0, 0.08, mat(0x16141c), 0.03, sp, s * 0.36, 1.55, 0.6); l.rotation.z = s * 0.35; }
  box(0.56, 0.22, 0.1, mat(0x111111), 0.06, sp, 0, 1.95, 0.6);
  for (let i = 0; i < 4; i++) box(0.09, 0.09, 0.05, brass(), 0.03, sp, 0.3, 0.45 + i * 0.36, 0.6);
  const watch = box(0.5, 0.05, 0.05, brass(), 0.02, sp, -0.4, 0.75, 0.6); watch.rotation.z = 0.3;
  box(0.32, 0.22, 0.04, mat(0xffffff), 0.02, sp, -0.6, 1.5, 0.6);   // pañuelo en el bolsillo
}
export function makeWachter(scene) {
  const o = character(scene, {
    seed: 11, scale: 1.12, skin: 0xefc7a4, skinCss: '#efc7a4', shirt: 0xffffff, shirt2: 0xffffff, cuffs: 0xffffff, pants: 0x1d1a22, shoes: 0x111111, sole: 0x050505,
    face: { iris: '#3b2a1a', eyes: 'wide', brows: 0.6, browColor: '#141018', mouth: 'smirk', bags: 0 }, hairBuild: wachterHair, torsoDetail: wachterTorso,
  });
  // ligas negras en los brazos y delantal largo de camarero (Kellnerschürze)
  for (const a of [o.aL, o.aR]) box(0.96, 0.14, 0.99, mat(0x16141c), 0.04, a.sh, 0, -0.55, 0);
  const ap = box(2.1, 2.3, 0.08, mat(0xf7f7f2, { roughness: .9 }), 0.04, o.hips, 0, -0.95, 0.56);
  addMoustache(o);
  return o;
}

// taza de café (con plato)
export function coffeeCup(parent, x = 0, y = 0, z = 0, s = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
  const white = mat(0xffffff, { roughness: .25 });
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 0.45, 24, 1, true), white); cup.position.y = 0.25; g.add(cup);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 6, 24), mat(0xd9a531, { metalness: .7, roughness: .3 })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.47; g.add(rim);
  const bot = new THREE.Mesh(new THREE.CircleGeometry(0.26, 24), white); bot.rotation.x = -Math.PI / 2; bot.position.y = 0.03; g.add(bot);
  const cof = new THREE.Mesh(new THREE.CircleGeometry(0.31, 24), mat(0x3b2112, { roughness: .2 })); cof.rotation.x = -Math.PI / 2; cof.position.y = 0.4; g.add(cof);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 8, 16, Math.PI * 1.4), white); handle.position.set(0.36, 0.25, 0); handle.rotation.z = -Math.PI * 0.7; g.add(handle);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 0.05, 28), white); g.add(plate);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  g.userData.coffee = cof;
  return g;
}

// ---------- vecinos: Tracht y Dirndl, todos con ojeras ----------
function braids(head, m) {
  box(1.42, 0.38, 1.32, m, 0.15, head, 0, 1.2, -0.02); box(1.42, 0.9, 0.34, m, 0.12, head, 0, 0.92, -0.52);
  const crown = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.17, 10, 28), m); crown.rotation.x = Math.PI / 2; crown.position.y = 1.36; head.add(crown);
  for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; const b = sphere(0.14, m, head, Math.cos(a) * 0.62, 1.36, Math.sin(a) * 0.62); b.scale.set(1, 0.8, 1); }
}
function shortHair(head, m) { box(1.42, 0.36, 1.32, m, 0.15, head, 0, 1.22, -0.02); box(1.42, 0.85, 0.32, m, 0.12, head, 0, 0.93, -0.52); }
function dirndlTorso(color) {
  return (sp) => {
    box(2.06, 1.3, 1.1, mat(color, { roughness: .7 }), 0.1, sp, 0, 0.66, 0);        // corpiño
    box(2.0, 0.75, 1.08, mat(0xffffff, { roughness: .8 }), 0.1, sp, 0, 1.68, 0);     // blusa
    for (let i = 0; i < 4; i++) box(0.5, 0.05, 0.05, mat(0xe8dcc0), 0.02, sp, 0, 0.4 + i * 0.22, 0.57);   // cordones
    box(0.12, 0.12, 0.06, mat(0xd9a531, { metalness: .7, roughness: .3 }), 0.03, sp, 0, 1.33, 0.58);
  };
}
function trachtTorso(color) {
  return (sp) => {
    box(2.1, 2.0, 1.12, mat(color, { roughness: .9 }), 0.12, sp, 0, 1.02, 0);
    box(0.4, 1.9, 0.06, mat(0xffffff), 0.02, sp, 0, 1.05, 0.58);
    for (const s of [-1, 1]) { const l = box(0.3, 1.0, 0.08, mat(0x2f5a3a), 0.03, sp, s * 0.36, 1.55, 0.6); l.rotation.z = s * 0.3; }
    for (let i = 0; i < 3; i++) sphere(0.07, hornM(), sp, 0.3, 0.45 + i * 0.42, 0.6);
  };
}
const FOLK = [
  { kind: 'dirndl', bodice: 0x2f6fbf, skirt: 0x2f6fbf, apron: 0xf2b8c6, hair: 0xe8c25a, skin: 0xf3cbb0 },
  { kind: 'tracht', jacket: 0x6b7a5a, pants: 0x5a3a22, hair: 0x3a2416, hat: 0x2f5a3a, skin: 0xf0c4a2 },
  { kind: 'dirndl', bodice: 0x8a1f3a, skirt: 0x2a2a3a, apron: 0x9fd0c8, hair: 0x6b3b1e, skin: 0xd8a27a },
  { kind: 'tracht', jacket: 0x8a6a4a, pants: 0x3a2a1a, hair: 0xb07a3a, hat: 0x3a3a3a, skin: 0xf3cbb0 },
  { kind: 'dirndl', bodice: 0x2f8a5a, skirt: 0x2f5a8a, apron: 0xffffff, hair: 0x2a1a10, skin: 0x8d5a3b },
  { kind: 'tracht', jacket: 0x5a6a8a, pants: 0x4a3a2a, hair: 0x101010, hat: 0x6b4a2a, skin: 0xc68b5e },
];
export function makeTownsperson(scene, i, extra = {}) {
  const f = FOLK[i % FOLK.length], skinCss = '#' + f.skin.toString(16).padStart(6, '0');
  let o;
  if (f.kind === 'dirndl') {
    o = character(scene, { seed: 20 + i, skin: f.skin, skinCss, shirt: f.bodice, shirt2: 0xffffff, sleeveShort: false, pants: 0xffffff, shoes: 0x2a1a10, sole: 0x111111, noBelt: true,
      skirt: f.skirt, apron: f.apron, apronBow: f.apron, hair: f.hair, hairBuild: braids, torsoDetail: dirndlTorso(f.bodice),
      face: { eyes: 'half', bags: 1, mouth: 'flat', brows: -0.3, iris: '#4a6a8a', blush: 0.4 }, ...extra });
    // mangas abullonadas
    for (const a of [o.aL, o.aR]) sphere(0.62, mat(0xffffff, { roughness: .8 }), a.sh, 0, -0.25, 0);
  } else {
    o = character(scene, { seed: 20 + i, skin: f.skin, skinCss, shirt: f.jacket, shirt2: f.jacket, cuffs: 0x2f5a3a, pants: f.pants, shorts: i % 3 === 1, socks: 0xe8e2d4, shoes: 0x3a2414, sole: 0x111111,
      hair: f.hair, hairBuild: shortHair, torsoDetail: trachtTorso(f.jacket),
      face: { eyes: 'half', bags: 1, mouth: 'flat', brows: -0.3, iris: '#4a3a2a' }, ...extra });
    o.props.hat = tyroleanHat(o.head, f.hat);
  }
  return o;
}

// Nachtwächter: capa oscura, sombrero de ala ancha, farol y alabarda, silbato
export function makeNachtwaechter(scene, i = 0) {
  const o = character(scene, { seed: 40 + i, skin: 0xf0c4a2, skinCss: '#f0c4a2', shirt: 0x26304a, shirt2: 0x26304a, cuffs: 0xd9a531, pants: 0x1d2238, shoes: 0x111111, sole: 0x050505, hair: 0x5a3a22,
    face: { eyes: 'squint', bags: 0.8, mouth: 'frown', brows: 0.7, iris: '#3a2a1a' }, hairBuild: shortHair,
    torsoDetail: (sp) => { box(2.5, 2.1, 1.4, mat(0x1a1f33, { roughness: .9 }), 0.2, sp, 0, 0.95, -0.12); box(0.3, 1.9, 0.06, mat(0xd9a531, { metalness: .6, roughness: .3 }), 0.02, sp, 0, 1.05, 0.72);
      for (let i = 0; i < 4; i++) sphere(0.08, mat(0xd9a531, { metalness: .7, roughness: .3 }), sp, 0.32, 0.45 + i * 0.4, 0.74); } });
  const hat = new THREE.Group(); hat.position.y = 1.3; o.head.add(hat);
  const hm = mat(0x141824, { roughness: .9 });
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.1, 28), hm); hat.add(brim);
  const cr = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.8, 20), hm); cr.position.y = 0.42; hat.add(cr);
  // farol en la mano izquierda
  const lan = new THREE.Group(); lan.position.set(0, -0.75, 0.2); o.aL.hand.add(lan);
  box(0.6, 0.85, 0.6, mat(0xfff0b0, { emissive: 0xffc25a, emissiveIntensity: 2.6 }), 0.1, lan, 0, -0.55, 0);
  box(0.72, 0.12, 0.72, mat(0x2a2a2a, { metalness: .6 }), 0.04, lan, 0, -0.08, 0); box(0.72, 0.12, 0.72, mat(0x2a2a2a, { metalness: .6 }), 0.04, lan, 0, -1.02, 0);
  // alabarda en la derecha
  const hal = new THREE.Group(); hal.position.set(0, -0.3, 0.1); o.aR.hand.add(hal);
  cyl(0.08, 0.08, 7.5, mat(0x6b4a2e), 8, hal, 0, 1.6, 0);
  const blade = box(0.9, 0.9, 0.06, mat(0xcfd6e0, { metalness: .9, roughness: .2 }), 0.02, hal, 0.35, 5.2, 0); blade.rotation.z = Math.PI / 4;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.9, 8), mat(0xcfd6e0, { metalness: .9, roughness: .2 })); tip.position.y = 5.9; hal.add(tip);
  o.props.lantern = lan; o.props.halberd = hal;
  o.root.traverse(m => { if (m.isMesh) m.castShadow = true; });
  return o;
}

// oveja de bloques (puede ir de pie y disfrazada)
export function makeSheep(scene, disguise = 0) {
  const g = new THREE.Group(); scene.add(g);
  const wool = mat(0xf7f3ea, { roughness: 1 }), dark = mat(0x2a2a30, { roughness: .6 });
  const body = new THREE.Group(); g.add(body);
  const r = RNG(disguise + 3);
  for (let i = 0; i < 14; i++) sphere(0.75 + r() * 0.3, wool, body, (r() - .5) * 1.8, 2.3 + (r() - .5) * 2.2, (r() - .5) * 1.4, 14, 10);
  const head = new THREE.Group(); head.position.set(0, 4.0, 0.5); body.add(head);
  box(1.0, 1.2, 1.1, dark, 0.3, head, 0, 0, 0.2);
  for (const s of [-1, 1]) { const e = box(0.6, 0.22, 0.3, dark, 0.1, head, s * 0.65, 0.3, 0); e.rotation.z = s * -0.4; }
  for (const s of [-1, 1]) { sphere(0.16, mat(0xffffff), head, s * 0.24, 0.18, 0.76); sphere(0.08, mat(0x111111), head, s * 0.24, 0.18, 0.88); }
  for (let i = 0; i < 5; i++) sphere(0.28, wool, head, (i - 2) * 0.18, 0.66, 0.1);
  const legs = [];
  for (const [x, y] of [[-0.45, 0], [0.45, 0]]) { const l = new THREE.Group(); l.position.set(x, 1.3, 0); g.add(l); box(0.36, 1.3, 0.36, dark, 0.1, l, 0, -0.65, 0); legs.push(l); }
  const arms = [];
  for (const s of [-1, 1]) { const a = new THREE.Group(); a.position.set(s * 1.0, 3.0, 0); body.add(a); box(0.3, 1.1, 0.3, dark, 0.1, a, 0, -0.5, 0); arms.push(a); }
  // disfraces: 0 bigote+sombrero, 1 gafas+bigote, 2 gorra+pajarita
  const blk = mat(0x1a1410);
  if (disguise === 0 || disguise === 1) { const m = box(0.9, 0.18, 0.1, blk, 0.06, head, 0, -0.18, 0.8); m.rotation.z = 0.05; }
  if (disguise === 0) tyroleanHat(head, 0x2f5a3a, 0.75);
  if (disguise === 1) { for (const s of [-1, 1]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 20), blk); ring.position.set(s * 0.25, 0.18, 0.84); head.add(ring); } box(0.2, 0.05, 0.05, blk, 0, head, 0, 0.2, 0.84); }
  if (disguise === 2) { flatCap(head, 0x6b5a48, 0.55); box(0.5, 0.22, 0.12, mat(0xd63a3a), 0.06, body, 0, 3.55, 0.95); }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return { root: g, body, head, legs, arms };
}

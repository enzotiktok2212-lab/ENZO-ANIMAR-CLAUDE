// DAMPFSAMMLER — reparto propio (nadie se parece al vídeo de referencia ni a otros vídeos del canal).
// Ich (Luca, ≈15): pelo castaño con tupé, sudadera verde azulado con cordones, vaqueros, zapatillas blancas.
// Bruder (Mats, ≈7): rizos rubios, chubasquero amarillo, botas de agua rojas.
// Papa (Erfinder): chaleco de cuero marrón sobre camisa blanca, gafas de soldador en la frente, bigote.
// DJ Blitz: chaqueta negra con rayas rosa neón, gorra al revés, cascos, gafas de sol. Ring-Meister Rocco: chaleco rojo de
// presentador con botones dorados, pajarita, tupé negro. Gamer Kai: sudadera morada con LED cian, cascos con micro, pelo cian en pinchos.
// Der Dampfsammler: alto, abrigo largo negro con botones plateados, guantes blancos, chistera negra con cinta violeta,
// piel gris pálida, ojos que brillan en cian bajo el ala del sombrero, bastón con pomo de cristal.
import { THREE, mat, box, cyl, sphere } from './engine.js';
import { mk, hairS, glasses, mustache, cap, hoodie, suit, jacket, headphones, topHat } from './props.js';
const hex = c => '#' + c.toString(16).padStart(6, '0');
const S = o => ({ noBelt: true, ...o, skinCss: hex(o.skin) });
const glow = (c, k = 2) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });

export function makeIch(scene) { return mk(scene, S({ seed: 9101, scale: .92, skin: 0xf0c09c, shirt: 0x14a8a0, shirt2: 0x14a8a0, cuffs: 0x0e8a84, pants: 0x34507a, shoes: 0xf4f4f4, sole: 0x1a8a84, hair: 0x6a3e1e, hairBuild: hairS(0x6a3e1e, 'swoop'),
  torsoDetail: hoodie(0x14a8a0, 0xffffff), face: { iris: '#4a7a3a', browColor: '#5a3418', blush: .3 } })); }
export function makeBruder(scene) { return mk(scene, S({ seed: 9102, scale: .7, skin: 0xf6d2b4, shirt: 0xffd23f, shirt2: 0xffd23f, cuffs: 0xf0b820, pants: 0x3a5aa8, shoes: 0xd8323a, sole: 0x8a1a1a, hair: 0xf0d070, hairBuild: hairS(0xf0d070, 'curly'),
  torsoDetail: sp => { const j = mat(0xffd23f, { roughness: .35 }); box(2.1, 2.08, 1.12, j, .16, sp, 0, 1.0, -.02); for (let i = 0; i < 4; i++) box(.18, .18, .06, mat(0x1a1a1a), .03, sp, 0, .35 + i * .44, .59); box(2.0, .3, 1.16, mat(0xf0b820), .08, sp, 0, .1, -.02); },
  face: { iris: '#3a7ad8', browColor: '#c8a040', freckles: 1, blush: .45 } })); }
export function makePapa(scene) { return mk(scene, S({ seed: 9103, scale: 1.04, skin: 0xe8b48e, shirt: 0xf4f0e8, shirt2: 0xf4f0e8, cuffs: 0xe0dcd0, pants: 0x4a3e34, shoes: 0x3a2414, hair: 0x3a2414, hairBuild: hairS(0x3a2414, 'swoop'),
  torsoDetail: sp => { const v = mat(0x7a4a24, { roughness: .6 }); for (const s of [-1, 1]) box(.82, 2.0, 1.12, v, .1, sp, s * .62, 1.02, 0); box(2.06, 2.0, .45, v, .1, sp, 0, 1.02, -.34);
    for (let i = 0; i < 3; i++) sphere(.08, mat(0xd9a531, { metalness: .8, roughness: .3 }), sp, .3, .5 + i * .5, .58, 8, 6); box(.5, .6, .08, mat(0x5a3418), .03, sp, -.6, .6, .58); for (let i = 0; i < 2; i++) cyl(.05, .05, .7, mat([0xd8323a, 0x2a6ad8][i]), 6, sp, -.72 + i * .2, .95, .6); },
  face: { iris: '#3a2a1a', browColor: '#2a1a0a' } }), [o => mustache(o.head, 0x3a2414), o => { const g = new THREE.Group(); g.position.set(0, 1.18, .25); g.rotation.x = -.35; o.head.add(g); const strap = new THREE.Mesh(new THREE.TorusGeometry(.7, .07, 6, 32), mat(0x3a2414)); strap.rotation.x = Math.PI / 2; g.add(strap);
    for (const s of [-1, 1]) { const l = cyl(.26, .26, .22, mat(0x8a6a3a, { metalness: .7, roughness: .3 }), 14, g, s * .3, .0, .62); l.rotation.x = Math.PI / 2; const gl = cyl(.2, .2, .05, mat(0x7ad8ff, { metalness: .3, roughness: .05, emissive: 0x2a6a8a, emissiveIntensity: .3 }), 14, g, s * .3, 0, .74); gl.rotation.x = Math.PI / 2; } }]); }
export function makeDJ(scene) { return mk(scene, S({ seed: 9104, scale: 1.0, skin: 0x8a5a3a, shirt: 0x16161c, shirt2: 0x16161c, cuffs: 0xff3aa0, pants: 0x22222a, shoes: 0xffffff, sole: 0xff3aa0, hair: 0x1a1208, hairBuild: hairS(0x1a1208, 'bald'),
  torsoDetail: sp => { const j = mat(0x16161c, { roughness: .5 }); box(2.08, 2.06, 1.1, j, .12, sp, 0, 1.02, -.02); for (const s of [-1, 1]) box(.12, 2.0, .06, glow(0xff3aa0, 1.6), .02, sp, s * .5, 1.02, .55); box(.06, 1.8, .06, mat(0xc8c8d0, { metalness: .9 }), 0, sp, 0, 1.05, .56);
    const ch = new THREE.Mesh(new THREE.TorusGeometry(.42, .05, 6, 20, Math.PI), mat(0xffd23f, { metalness: .9, roughness: .2 })); ch.rotation.z = Math.PI; ch.position.set(0, 1.85, .6); sp.add(ch); },
  face: { iris: '#2a1a0a', browColor: '#1a1208' } }), [o => cap(o.head, 0xff3aa0, 0x16161c), o => headphones(o.head, 0xf4f4f4), o => { const m = mat(0x101018, { roughness: .1, metalness: .4 }); box(1.2, .3, .08, m, .06, o.head, 0, .82, .64); }]); }
export function makeRocco(scene) { return mk(scene, S({ seed: 9105, scale: 1.02, skin: 0xf2c4a0, shirt: 0xffffff, shirt2: 0xffffff, cuffs: 0xd8323a, pants: 0x1a1a24, shoes: 0x1a1a1a, sole: 0x8a1a1a, hair: 0x14100c, hairBuild: hairS(0x14100c, 'swoop'),
  torsoDetail: sp => { const v = mat(0xd8202f, { roughness: .4 }); for (const s of [-1, 1]) box(.8, 2.0, 1.12, v, .1, sp, s * .64, 1.02, 0); box(2.06, 2.0, .45, v, .1, sp, 0, 1.02, -.34);
    for (let i = 0; i < 3; i++) for (const s of [-1, 1]) sphere(.09, mat(0xffd23f, { metalness: .9, roughness: .2 }), sp, s * .42, .45 + i * .5, .6, 8, 6);
    box(.6, .26, .12, mat(0x1a1a1a), .04, sp, 0, 1.9, .6); sphere(.1, mat(0x1a1a1a), sp, 0, 1.9, .66, 8, 6); },
  face: { iris: '#2a4a2a', browColor: '#14100c' } }), [o => mustache(o.head, 0x14100c)]); }
export function makeKai(scene) { return mk(scene, S({ seed: 9106, scale: .95, skin: 0xc8946a, shirt: 0x6a2ac8, shirt2: 0x6a2ac8, cuffs: 0x3ae0ff, pants: 0x1a1a2a, shoes: 0x1a1a1a, sole: 0x3ae0ff, hair: 0x3ae0ff, hairBuild: hairS(0x3ae0ff, 'spiky'),
  torsoDetail: sp => { hoodie(0x6a2ac8, 0x3ae0ff)(sp); for (const s of [-1, 1]) box(.08, 1.6, .06, glow(0x3ae0ff, 1.8), .02, sp, s * .95, 1.0, .5); box(1.0, .1, .06, glow(0x3ae0ff, 1.8), .02, sp, 0, 1.7, .57); },
  face: { iris: '#1a1a1a', browColor: '#2a1a0a' } }), [o => headphones(o.head, 0x1a1a1a), o => { const a = cyl(.04, .04, 1.0, mat(0x1a1a1a), 6, o.head, .74, .45, .35); a.rotation.x = 1.2; sphere(.1, mat(0x1a1a1a), o.head, .74, .25, .8, 8, 6); }]); }
// el Dampfsammler: alto (1,3), capa larga negra con capucha; la cara no se ve (sombra negra) salvo dos ojos cian que brillan;
// chistera negra encima de la capucha; emana un aura violeta-cian y jirones de humo oscuro; bastón con pomo de cristal.
const auraTex = (() => { let t = null; return () => { if (t) return t; const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }; })();
const wispTex = (() => { let t = null; return () => { if (t) return t; const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); for (let i = 0; i < 14; i++) { const px = 64 + Math.sin(i * 2.1) * 26, py = 64 + Math.cos(i * 1.7) * 26, r = 18 + (i % 4) * 7; const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); } t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }; })();
export function makeSammler(scene) {
  // criatura propia (no humana): mismo esqueleto que los personajes (para applyPose), pero con piernas largas y finas, rodillas marcadas,
  // pies de garra, torso estrecho y encorvado, cuello largo, brazos larguísimos con dedos-garra, capa corta deshecha a jirones, capucha y chistera.
  const skin = mat(0x2a2236, { roughness: .55 }), dark = mat(0x16121e, { roughness: .7 }), cloth = mat(0x1e1828, { roughness: .85 }), claw = mat(0x0c0a10, { roughness: .3 });
  const cap = (r, h, m, parent, x = 0, y = 0, z = 0) => { const me = new THREE.Mesh(new THREE.CapsuleGeometry(r, h, 6, 12), m); me.position.set(x, y, z); me.castShadow = me.receiveShadow = true; parent.add(me); return me; };
  const root = new THREE.Group(); scene.add(root);
  const hips = new THREE.Group(); hips.position.y = 2.9; root.add(hips);
  const pel = sphere(.42, dark, hips, 0, .05, 0, 14, 10); pel.scale.set(1.3, .8, 1);
  const spine = new THREE.Group(); hips.add(spine);
  // torso: costillas estrechas que se ensanchan en los hombros (caja torácica de criatura)
  const t1 = cap(.34, .7, skin, spine, 0, .6, 0); t1.scale.set(1, 1, .8); const t2 = cap(.5, .55, skin, spine, 0, 1.35, -.05); t2.scale.set(1.35, 1, .8); t2.rotation.z = Math.PI / 2; t2.scale.set(1, 1.6, .8);
  for (let k = 0; k < 4; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.36 - k * .02, .035, 5, 18, Math.PI), dark); r.position.set(0, .55 + k * .2, .1); r.rotation.set(0, 0, 0); r.scale.z = .7; spine.add(r); }
  const hump = sphere(.6, skin, spine, 0, 1.45, -.38, 14, 10); hump.scale.set(1.2, .8, .9);
  // capa corta hecha jirones sobre los hombros y la espalda (no tapa las piernas)
  const cape = new THREE.Group(); cape.position.set(0, 1.6, -.2); spine.add(cape); { const sh_ = cap(.62, .7, cloth, cape, 0, 0, 0); sh_.rotation.z = Math.PI / 2; sh_.scale.set(1, 1, .9);
    for (let k = 0; k < 7; k++) { const a = -1.2 + k * .4; const strip = box(.34, 1.4 + (k % 3) * .45, .08, cloth, .04, cape, Math.sin(a) * .75, -.75 - (k % 3) * .2, -Math.cos(a) * .45 - .1); strip.rotation.set(.25, a * .3, a * .12); } }
  const clasp = sphere(.12, mat(0xb07aff, { emissive: 0x7a3ad8, emissiveIntensity: 1.3, roughness: .1 }), spine, 0, 1.75, .42, 12, 8);
  // cuello largo y cabeza pequeña en la capucha
  const neck = new THREE.Group(); neck.position.y = 1.85; spine.add(neck); const nk = cap(.15, .45, skin, neck, 0, .3, .05); nk.rotation.x = .3;
  const head = new THREE.Group(); head.position.set(0, .62, .18); neck.add(head);
  const skull = cap(.36, .25, skin, head, 0, .35, 0); skull.scale.set(1, 1, 1.05);
  const hood = new THREE.Group(); head.add(hood); const hd = cap(.52, .4, cloth, hood, 0, .42, -.08); hd.scale.set(1.05, 1.05, 1.05);
  const brim = cap(.18, .7, cloth, hood, 0, .82, .38); brim.rotation.z = Math.PI / 2; brim.scale.set(1, 1, 1);
  for (const sd of [-1, 1]) { const f = cap(.14, .7, cloth, hood, sd * .44, .3, .34); f.rotation.x = .1; }
  const hole = new THREE.Mesh(new THREE.CircleGeometry(.36, 20), new THREE.MeshBasicMaterial({ color: 0x010102 })); hole.position.set(0, .38, .5); hole.scale.y = 1.15; hood.add(hole);
  const hatG = new THREE.Group(); hatG.position.set(0, .2, -.05); hatG.scale.setScalar(.85); head.add(hatG); topHat(hatG, 0x0a0a0e, 0x6a2aa8);
  // ojos: rasgados, cian, con halo
  const em = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x6af0ff).multiplyScalar(3), toneMapped: false }); const eyes = [], halos = [];
  for (const sd of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), em); e.scale.set(1.7, .6, .5); e.position.set(sd * .15, .44, .53); e.rotation.z = sd * -.3; hood.add(e); eyes.push(e);
    const hs = new THREE.Sprite(new THREE.SpriteMaterial({ map: auraTex(), color: 0x6af0ff, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); hs.position.set(sd * .15, .44, .6); hs.scale.setScalar(.32); hood.add(hs); halos.push(hs); }
  // brazos largos y finos: hombro → codo → mano con 4 dedos-garra
  const arm = sd => { const sh = new THREE.Group(); sh.position.set(sd * .78, 1.6, 0); spine.add(sh); sphere(.2, skin, sh, 0, 0, 0, 10, 8);
    cap(.13, 1.35, skin, sh, 0, -.8, 0); const el = new THREE.Group(); el.position.set(0, -1.6, 0); sh.add(el); sphere(.16, dark, el, 0, 0, 0, 10, 8); cap(.11, 1.4, skin, el, 0, -.8, 0);
    const hand = new THREE.Group(); hand.position.set(0, -1.6, 0); el.add(hand); const palm = sphere(.2, skin, hand, 0, -.08, 0, 10, 8); palm.scale.set(1.2, 1, .7);
    for (let k = 0; k < 4; k++) { const f = new THREE.Group(); f.position.set(-.18 + k * .12, -.18, .02); f.rotation.set(.25, 0, (k - 1.5) * .22); hand.add(f); cap(.04, .55, skin, f, 0, -.3, 0); const tip = new THREE.Mesh(new THREE.ConeGeometry(.05, .3, 6), claw); tip.position.y = -.72; tip.rotation.x = Math.PI; f.add(tip); }
    return { sh, el, hand }; };
  // piernas largas y finas con rodilla marcada y pie de tres garras
  const leg = sd => { const hp = new THREE.Group(); hp.position.set(sd * .32, 0, 0); hips.add(hp); cap(.15, 1.2, skin, hp, 0, -.72, 0); const kn = new THREE.Group(); kn.position.set(0, -1.45, 0); hp.add(kn); sphere(.17, dark, kn, 0, 0, .03, 10, 8);
    cap(.11, 1.22, skin, kn, 0, -.72, 0); const foot = new THREE.Group(); foot.position.set(0, -1.45, 0); kn.add(foot); const fb = sphere(.17, skin, foot, 0, -.02, .1, 10, 8); fb.scale.set(1, .6, 1.4);
    for (let k = 0; k < 3; k++) { const t = new THREE.Mesh(new THREE.ConeGeometry(.06, .45, 6), claw); t.position.set((k - 1) * .13, -.03, .45); t.rotation.set(Math.PI / 2, 0, 0); foot.add(t); } return { hp, kn, shoe: fb }; };
  const aL = arm(-1), aR = arm(1), lL = leg(-1), lR = leg(1);
  const o = { root, hips, spine, neck, head, face: hole, faceMat: hole.material, aL, aR, lL, lR, spec: { scale: 1.6, skin: 0x2a2236, face: {} }, props: {}, seed: 9107 };
  o.setFace = () => {}; root.scale.setScalar(1.6);
  o.setEyes = k => { em.color.set(0x6af0ff).multiplyScalar(.2 + k * 3); eyes.forEach(e => e.visible = k > .02); halos.forEach(h => { h.visible = k > .02; h.material.opacity = .8 * k; }); }; o.setEyes(1);
  // aura: halos aditivos detrás (violeta y cian) que laten + jirones de humo oscuro alrededor
  const AU = new THREE.Group(); root.add(AU); const au = [[0x9a4aff, 6, 3.4, -.6], [0x3ae0ff, 4.5, 4.4, -.5], [0x6a2acc, 8, 2.4, -.8]].map(([c, sc, y, z]) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: auraTex(), color: c, transparent: true, opacity: .45, blending: THREE.AdditiveBlending, depthWrite: false })); sp.position.set(0, y, z); sp.scale.set(sc * .75, sc, 1); sp.userData.base = sc; AU.add(sp); return sp; });
  const wisps = Array.from({ length: 12 }, () => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: wispTex(), color: 0x3a2a5a, transparent: true, opacity: .6, depthWrite: false })); AU.add(sp); return sp; });
  o.setAura = (T, k = 1) => { AU.visible = k > .01; au.forEach((sp, i) => { const b = sp.userData.base * (1 + Math.sin(T * 2.4 + i * 2) * .08); sp.scale.set(b * .75, b, 1); sp.material.opacity = (.42 + Math.sin(T * 3 + i) * .1) * k; });
    wisps.forEach((w, i) => { const ph = (T * .35 + i / wisps.length) % 1, a = i * 2.4 + T * .6; w.position.set(Math.cos(a) * (.8 + ph * .6), .2 + ph * 3.6, Math.sin(a) * (.7 + ph * .5) - .2); w.scale.setScalar(.8 + ph * 1.2); w.material.opacity = .5 * k * Math.sin(ph * Math.PI); w.material.rotation = a; }); };
  o.setAura(0); o.cane = new THREE.Group();
  root.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  return o; }

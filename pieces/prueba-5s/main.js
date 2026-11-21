// Prueba de 5 s del estilo blocky-3d: los tres primeros planos del formato de referencia
// (dron sobre la avenida -> acera a ras de suelo con cobros -> edificio del gobierno).
// Determinista: window.renderAt(t) dibuja el instante t; nada usa el reloj real ni Math.random.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

await document.fonts.load('700 40px Cap');
const W = 720, H = 1280, FPS = 30;
const stage = document.getElementById('stage');

// ---------- utilidades ----------
function RNG(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const rnd = RNG(7);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function canvasTex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: 0, ...o });
function box(w, h, d, m, r = 0) {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d);
  const me = new THREE.Mesh(g, m); me.castShadow = true; me.receiveShadow = true; return me;
}
function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);
const overlay = document.createElement('canvas'); overlay.width = W; overlay.height = H; stage.appendChild(overlay);
const ctx = overlay.getContext('2d');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xbfe0ff, 0.00085);
const camera = new THREE.PerspectiveCamera(62, W / H, 0.3, 3000);

// cielo: degradado azul saturado arriba, claro en el horizonte
const sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { top: { value: new THREE.Color(0x2f86f6) }, hor: { value: new THREE.Color(0xd6ecff) } },
  vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: 'uniform vec3 top; uniform vec3 hor; varying vec3 p; void main(){ float k = pow(clamp(p.y*1.6,0.,1.),0.55); gl_FragColor = vec4(mix(hor, top, k),1.); }'
}));
scene.add(sky);
// nubes: discos blancos suaves
const cloudTex = canvasTex(256, 128, (c, w, h) => {
  for (let i = 0; i < 7; i++) { const g = c.createRadialGradient(40 + i * 28, 70 - (i % 3) * 12, 4, 40 + i * 28, 70 - (i % 3) * 12, 45);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }
});
for (let i = 0; i < 9; i++) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, fog: false, transparent: true, opacity: .85, depthWrite: false }));
  s.scale.set(220, 110, 1); s.position.set(-500 + i * 130 + rnd() * 60, 260 + rnd() * 120, -900 - rnd() * 300); scene.add(s);
}

// luz: sol cálido + cielo azul de relleno (look de juguete, sombras suaves)
scene.add(new THREE.HemisphereLight(0xcfe5ff, 0xb9a88f, 1.6));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
sun.position.set(120, 220, 140); sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -170, right: 170, top: 170, bottom: -170, near: 10, far: 700 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.4; sun.shadow.radius = 3;
scene.add(sun, sun.target);

// ---------- suelo, calle, aceras ----------
const ROAD = 30, WALK = 13, ZMIN = -420, ZMAX = 80;
const asphalt = mat(0x2a4677, { roughness: .8 });
const road = new THREE.Mesh(new THREE.PlaneGeometry(ROAD, ZMAX - ZMIN), asphalt);
road.rotation.x = -Math.PI / 2; road.position.set(0, 0, (ZMAX + ZMIN) / 2); road.receiveShadow = true; scene.add(road);
const lineM = mat(0xf2d64b, { roughness: .6 });
for (let z = ZMAX; z > ZMIN; z -= 16) { const l = box(0.7, 0.05, 7, lineM); l.position.set(0, 0.03, z); l.castShadow = false; scene.add(l); }
const edgeM = mat(0xeef3ff, { roughness: .7 });
for (const s of [-1, 1]) {
  const e = box(0.6, 0.05, ZMAX - ZMIN, edgeM); e.position.set(s * (ROAD / 2 - 1.2), 0.03, (ZMAX + ZMIN) / 2); e.castShadow = false; scene.add(e);
}
const tileTex = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#dfe6f6'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c3cde3'; c.lineWidth = 4;
  c.strokeRect(2, 2, w - 4, h - 4); c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke();
}, true);
for (const s of [-1, 1]) {
  const t = tileTex.clone(); t.needsUpdate = true; t.repeat.set(WALK / 6, (ZMAX - ZMIN) / 6);
  const walk = box(WALK, 0.8, ZMAX - ZMIN, mat(0xffffff, { map: t, roughness: .75 }));
  walk.position.set(s * (ROAD / 2 + WALK / 2), 0.4, (ZMAX + ZMIN) / 2); walk.castShadow = false; scene.add(walk);
  const curb = box(0.9, 1.0, ZMAX - ZMIN, mat(0xf4f6fb)); curb.position.set(s * (ROAD / 2 + 0.45), 0.5, (ZMAX + ZMIN) / 2); curb.castShadow = false; scene.add(curb);
}
const plazaGround = box(260, 0.8, 140, mat(0xffffff, { map: (() => { const t = tileTex.clone(); t.needsUpdate = true; t.repeat.set(40, 22); return t; })(), roughness: .75 }));
plazaGround.position.set(0, 0.39, -490); plazaGround.castShadow = false; scene.add(plazaGround);
const grass = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), mat(0x7fd35a, { roughness: .9 }));
grass.rotation.x = -Math.PI / 2; grass.position.y = -0.05; grass.receiveShadow = true; scene.add(grass);

// ---------- edificios de la avenida ----------
const FACADES = ['#c4cffd', '#f6c8dc', '#cdeee2', '#e9eefc', '#fbe2b8', '#d9c8f6', '#b85a4c'];
function facadeTex(col, brick) {
  return canvasTex(128, 160, (c, w, h) => {
    c.fillStyle = col; c.fillRect(0, 0, w, h);
    if (brick) { c.strokeStyle = 'rgba(80,25,20,.35)'; c.lineWidth = 2; for (let y = 0; y < h; y += 10) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); for (let x = (y / 10) % 2 ? 0 : 12; x < w; x += 24) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 10); c.stroke(); } } }
    c.fillStyle = '#ffffff'; rrect(c, 26, 30, 76, 96, 6); c.fill();
    const g = c.createLinearGradient(0, 36, 0, 120); g.addColorStop(0, '#9fd2ff'); g.addColorStop(1, '#3d7fe0');
    c.fillStyle = g; c.fillRect(33, 37, 62, 82);
    c.fillStyle = '#ffffff'; c.fillRect(61, 37, 5, 82); c.fillRect(33, 74, 62, 5);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.moveTo(36, 40); c.lineTo(56, 40); c.lineTo(36, 66); c.fill();
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(22, 126, 84, 8);
  }, true);
}
const awningTex = (a, b) => canvasTex(256, 64, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? a : b; c.fillRect(i * 16, 0, 16, h); } c.fillStyle = 'rgba(0,0,0,.1)'; c.fillRect(0, h - 8, w, 8); }, true);
const AWN = [['#ffffff', '#55c7f0'], ['#ffffff', '#ff6f9a'], ['#ffffff', '#5fd39a'], ['#ffffff', '#a78bfa'], ['#ffffff', '#ffb547']];
const glassShop = mat(0x1d3fa8, { roughness: .15, metalness: .2, emissive: 0x0b2a8a, emissiveIntensity: .35 });
const signM = mat(0xff3d7f, { emissive: 0xff2d73, emissiveIntensity: 1.6 });
const signTex = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#ff3d7f'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffe6ef'; c.font = '700 64px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$10', w / 2, h / 2 + 4); });
const signFaceM = new THREE.MeshStandardMaterial({ map: signTex, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 1.3 });
const darkM = mat(0x24293a, { roughness: .5 });
function building(side, z0, len, floors, ci) {
  const h = 6 + floors * 9, d = 26, x = side * (ROAD / 2 + WALK + d / 2);
  const brick = FACADES[ci] === '#b85a4c';
  const t = facadeTex(FACADES[ci], brick); t.repeat.set(len / 7, floors);
  const m = mat(0xffffff, { map: t, roughness: .7 });
  const b = box(d, h - 6, len, m); b.position.set(x, 6 + (h - 6) / 2, z0 - len / 2); scene.add(b);
  t.offset.set(0, 0);
  // planta baja: escaparate de cristal azul
  const base = box(d, 6, len, mat(FACADES[ci] === '#b85a4c' ? '#e9e4ee' : FACADES[ci])); base.position.set(x, 3, z0 - len / 2); scene.add(base);
  const shop = box(0.6, 4.6, len - 3, glassShop); shop.position.set(x - side * (d / 2 + 0.05), 2.9, z0 - len / 2); scene.add(shop);
  // cornisa blanca
  const cor = box(d + 1.6, 1.2, len + 1.6, mat(0xffffff)); cor.position.set(x, h + 0.6, z0 - len / 2); scene.add(cor);
  const mid = box(d + 0.8, 0.8, len + 0.8, mat(0xffffff)); mid.position.set(x, 6.4, z0 - len / 2); scene.add(mid);
  // toldo a rayas inclinado
  const [a, bb] = AWN[ci % AWN.length]; const at = awningTex(a, bb); at.repeat.set(len / 8, 1);
  const aw = box(4.5, 0.25, len - 3, mat(0xffffff, { map: at })); aw.position.set(x - side * (d / 2 + 2.1), 5.6, z0 - len / 2); aw.rotation.z = side * 0.32; scene.add(aw);
  return { x, h, d, len, z0 };
}
const SIDES = { '-1': [], '1': [] };
for (const side of [-1, 1]) {
  let z = 40, i = side > 0 ? 2 : 0;
  while (z > -330) {
    const len = 26 + Math.floor(rnd() * 16), floors = 3 + Math.floor(rnd() * 4);
    SIDES[side].push(building(side, z, len, floors, i % FACADES.length)); z -= len + 0.6; i++;
  }
}
// cartel de neón rosa colgado (el "$10" de la tienda)
function neonSign(side, z, y = 9.5) {
  const x = side * (ROAD / 2 + WALK - 2.2);
  const arm = box(0.4, 0.4, 3.2, darkM); arm.position.set(x, y + 3.3, z); arm.rotation.y = Math.PI / 2; scene.add(arm);
  const s = box(0.9, 5.2, 3.4, signM, 0.2); s.position.set(x - side * 1.6, y, z); scene.add(s);
  for (const f of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), signFaceM); p.position.set(x - side * 1.6 + f * 0.47, y, z); p.rotation.y = f * Math.PI / 2; scene.add(p); }
}
for (const z of [-6, -70, -150, -230]) { neonSign(1, z); neonSign(-1, z - 35); }

// rascacielos de cristal al fondo
const towerTex = canvasTex(64, 256, (c, w, h) => {
  const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#8fdcff'); g.addColorStop(.5, '#bff0ff'); g.addColorStop(1, '#5ec0f7');
  c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(30,120,210,.55)'; for (let y = 0; y < h; y += 16) c.fillRect(0, y, w, 4);
  c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(6, 0, 4, h);
}, true);
for (let i = 0; i < 16; i++) {
  const w = 28 + rnd() * 24, h = 120 + rnd() * 170, t = towerTex.clone(); t.needsUpdate = true; t.repeat.set(2, h / 40);
  const tw = box(w, h, w, mat(0xffffff, { map: t, roughness: .25, metalness: .1, emissive: 0x2b6fb5, emissiveIntensity: .15 }));
  const sx = (i % 2 ? 1 : -1) * (25 + rnd() * 170);
  tw.position.set(sx, h / 2, -560 - rnd() * 260); tw.castShadow = false; scene.add(tw);
}

// árboles: tronco + copa grumosa
const trunkM = mat(0x6b4a2e, { roughness: .8 });
const leafM = mat(0x4cb64a, { roughness: .85 });
const leafM2 = mat(0x37a043, { roughness: .85 });
const blobG = new THREE.IcosahedronGeometry(1, 4);
{ const p = blobG.attributes.position; const r = RNG(3); for (let i = 0; i < p.count; i++) { const k = 1 + (r() - .5) * .16; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); } blobG.computeVertexNormals(); }
function tree(x, z, s = 1) {
  const g = new THREE.Group();
  const tr = box(1.1 * s, 9 * s, 1.1 * s, trunkM); tr.position.y = 4.5 * s; g.add(tr);
  const r = RNG(Math.floor(x * 31 + z * 7));
  for (let i = 0; i < 9; i++) { const b = new THREE.Mesh(blobG, i % 2 ? leafM : leafM2); const sc = (2.6 + r() * 1.4) * s;
    b.scale.setScalar(sc); b.position.set((r() - .5) * 4 * s, (10 + r() * 3.5) * s, (r() - .5) * 4 * s); b.castShadow = b.receiveShadow = true; g.add(b); }
  g.position.set(x, 0.8, z); scene.add(g); return g;
}
const lampM = mat(0x2a2f40, { roughness: .4, metalness: .3 });
function lamp(x, z, side) {
  const p = box(0.5, 15, 0.5, lampM); p.position.set(x, 8.3, z); scene.add(p);
  const a = box(4, 0.4, 0.4, lampM); a.position.set(x - side * 2, 15.6, z); scene.add(a);
  const h = box(2.2, 0.7, 1.2, lampM, 0.2); h.position.set(x - side * 4, 15.3, z); scene.add(h);
  const bulb = box(1.6, 0.2, 0.8, mat(0xfff6d8, { emissive: 0xfff2c8, emissiveIntensity: 1.2 })); bulb.position.set(x - side * 4, 14.9, z); scene.add(bulb);
}
const hydrantM = mat(0xe8323a, { roughness: .45 });
function hydrant(x, z) { const g = new THREE.Group(); const b = box(1.2, 2.2, 1.2, hydrantM, 0.3); b.position.y = 1.9; g.add(b);
  const t = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), hydrantM); t.position.y = 3; g.add(t);
  const s = box(2, 0.5, 0.5, hydrantM, 0.15); s.position.y = 2.2; g.add(s); g.traverse(o => { o.castShadow = true; }); g.position.set(x, 0, z); scene.add(g); }
for (const side of [-1, 1]) for (let z = 30; z > -320; z -= 34) {
  tree(side * (ROAD / 2 + 3.2), z + (side > 0 ? 0 : 17));
  lamp(side * (ROAD / 2 + 1.8), z + (side > 0 ? 17 : 0), side);
}
hydrant(ROAD / 2 + 3.5, 40); hydrant(-ROAD / 2 - 3.5, -40); hydrant(ROAD / 2 + 3.5, -95);

// ---------- edificio del gobierno (al fondo de la avenida) ----------
const CIVIC_Z = -470;
{
  const white = mat(0xf7f9ff, { roughness: .5 }), gold = mat(0xf2c23a, { roughness: .3, metalness: .6, emissive: 0x6a4a00, emissiveIntensity: .25 });
  const g = new THREE.Group();
  for (let i = 0; i < 6; i++) { const st = box(96 - i * 2, 1, 14 - i * 2, white); st.position.set(0, 0.8 + i, 12 - i); st.castShadow = false; g.add(st); }
  const pod = box(90, 6, 44, white); pod.position.set(0, 3.8, -16); g.add(pod);
  const wall = box(80, 30, 34, mat(0xeef2fb)); wall.position.set(0, 21.8, -20); g.add(wall);
  // ventanas/puertas azules detrás de las columnas
  const winM = mat(0x2a63d8, { roughness: .2, emissive: 0x0d2f8a, emissiveIntensity: .3 });
  for (let i = -3; i <= 3; i++) { const w = box(5, 12, 0.6, winM); w.position.set(i * 10.5, i === 0 ? 13 : 18, -2.8); g.add(w); }
  const door = box(7, 11, 0.8, mat(0x6b3b22)); door.position.set(0, 12.3, -2.6); g.add(door);
  const colG = new THREE.CylinderGeometry(1.7, 1.95, 28, 24);
  for (let i = 0; i < 8; i++) { const c = new THREE.Mesh(colG, white); c.position.set(-36.75 + i * 10.5, 20.8, 2.5); c.castShadow = c.receiveShadow = true; g.add(c);
    const cap = box(4.6, 1.2, 4.6, white); cap.position.set(c.position.x, 35.4, 2.5); g.add(cap); const bs = box(4.6, 1, 4.6, white); bs.position.set(c.position.x, 7.3, 2.5); g.add(bs); }
  const ent = box(86, 5, 8, white); ent.position.set(0, 38.4, 2.5); g.add(ent);
  const sign = canvasTex(1024, 64, (c, w, h) => { c.fillStyle = '#f7f9ff'; c.fillRect(0, 0, w, h); c.fillStyle = '#c99a1a'; c.font = '700 46px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('AYUNTAMIENTO', w / 2, h / 2 + 2); });
  const sp = new THREE.Mesh(new THREE.PlaneGeometry(40, 2.6), new THREE.MeshStandardMaterial({ map: sign, roughness: .5 })); sp.position.set(0, 38.4, 6.55); g.add(sp);
  const tri = new THREE.Shape(); tri.moveTo(-45, 0); tri.lineTo(45, 0); tri.lineTo(0, 15); tri.lineTo(-45, 0);
  const ped = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 8, bevelEnabled: false }), white); ped.position.set(0, 40.9, -1.5); ped.castShadow = true; g.add(ped);
  const em = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 1, 32), gold); em.rotation.x = Math.PI / 2; em.position.set(0, 47, 6.8); g.add(em);
  const emIn = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 1.2, 32), mat(0xff4d6d, { emissive: 0xff2d55, emissiveIntensity: .5 })); emIn.rotation.x = Math.PI / 2; emIn.position.set(0, 47, 7); g.add(emIn);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 8, 32), white); drum.position.set(0, 43, -22); drum.castShadow = true; g.add(drum);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(11, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), gold); dome.position.set(0, 47, -22); g.add(dome);
  // banderas azules
  const flagT = canvasTex(64, 96, (c, w, h) => { c.fillStyle = '#2c5ce0'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2c23a'; c.beginPath(); c.arc(w / 2, h / 2, 14, 0, 7); c.fill(); });
  for (const s of [-1, 1]) { const pole = box(0.6, 34, 0.6, lampM); pole.position.set(s * 52, 17, 14); g.add(pole);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(7, 10), new THREE.MeshStandardMaterial({ map: flagT, side: THREE.DoubleSide })); f.position.set(s * 52 - s * 3.8, 28, 14); g.add(f); }
  // jardineras con flores
  for (const s of [-1, 1]) { const pl = box(18, 1.6, 5, mat(0x9b6a45)); pl.position.set(s * 34, 1.6, 22); g.add(pl);
    for (let i = 0; i < 14; i++) { const fl = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6), mat(['#ff7ab0', '#ffffff', '#ffd23f'][i % 3])); fl.position.set(s * 34 - 7.5 + i * 1.15, 2.8, 22 + (i % 2 ? 1 : -1)); g.add(fl); } }
  g.position.set(0, 0.8, CIVIC_Z); scene.add(g);
}

// ---------- personajes de bloques ----------
function faceTex(kind, skin) {
  return canvasTex(256, 256, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    c.fillStyle = '#1a1a22';
    const eye = (x) => { c.beginPath(); c.ellipse(x, 112, kind === 'shock' ? 20 : 15, kind === 'shock' ? 24 : 21, 0, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(x + 5, 104, 6, 0, 7); c.fill(); c.fillStyle = '#1a1a22'; };
    if (kind === 'happy') { c.lineWidth = 11; c.lineCap = 'round'; c.strokeStyle = '#1a1a22';
      for (const x of [88, 168]) { c.beginPath(); c.arc(x, 120, 18, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); } }
    else { eye(88); eye(168); }
    c.lineWidth = 9; c.lineCap = 'round'; c.strokeStyle = '#1a1a22';
    if (kind === 'stern') { c.beginPath(); c.moveTo(66, 78); c.lineTo(108, 88); c.moveTo(190, 78); c.lineTo(148, 88); c.stroke(); c.beginPath(); c.moveTo(106, 176); c.lineTo(150, 176); c.stroke(); }
    else { c.beginPath(); c.arc(128, 150, 34, Math.PI * 0.2, Math.PI * 0.8); c.stroke(); }
    c.fillStyle = 'rgba(255,120,120,.35)'; c.beginPath(); c.ellipse(60, 160, 16, 9, 0, 0, 7); c.ellipse(196, 160, 16, 9, 0, 0, 7); c.fill();
  });
}
function character({ skin = 0xfbd9c3, shirt = 0x3b7cf0, stripe = null, pants = 0x2d3f73, shoes = 0xf4f4f4, hair = 0x3a2416, face = 'happy', hat = null }) {
  const R = 0.12, root = new THREE.Group();
  const skinM = mat(skin, { roughness: .5 }), shirtM = mat(shirt), pantsM = mat(pants), shoeM = mat(shoes);
  const torso = box(2, 2, 1, shirtM, R); torso.position.y = 3; root.add(torso);
  if (stripe) { const st = box(2.04, 0.35, 1.04, mat(stripe)); st.position.y = 3.2; root.add(st); }
  const head = new THREE.Group(); head.position.y = 4.0; root.add(head);
  const hd = box(1.25, 1.2, 1.15, skinM, 0.18); hd.position.y = 0.62; head.add(hd);
  const fp = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshStandardMaterial({ map: faceTex(face), transparent: true, roughness: .6 }));
  fp.position.set(0, 0.6, 0.581); head.add(fp);
  if (hat === 'cap') { const c = box(1.35, 0.5, 1.25, mat(0x1f2f6b), 0.15); c.position.y = 1.32; head.add(c); const v = box(1.2, 0.12, 0.6, mat(0x1f2f6b)); v.position.set(0, 1.12, 0.8); head.add(v);
    const b = box(0.35, 0.3, 0.05, mat(0xf2c23a, { metalness: .6, roughness: .3 })); b.position.set(0, 1.35, 0.64); head.add(b); }
  else { const hr = box(1.33, 0.38, 1.23, mat(hair), 0.15); hr.position.y = 1.18; head.add(hr); const hb = box(1.33, 0.8, 0.3, mat(hair), 0.12); hb.position.set(0, 0.85, -0.5); head.add(hb); }
  const limb = (x, y, m, m2, isLeg) => { const p = new THREE.Group(); p.position.set(x, y, 0);
    const l = box(isLeg ? 0.98 : 0.95, 2, 1, m, R); l.position.y = -1; p.add(l);
    if (m2) { const e = box(isLeg ? 1.0 : 0.97, isLeg ? 0.5 : 0.6, 1.02, m2, R); e.position.y = isLeg ? -1.78 : -1.72; p.add(e); }
    root.add(p); return p; };
  const armL = limb(-1.48, 4.0, shirtM, skinM), armR = limb(1.48, 4.0, shirtM, skinM);
  const legL = limb(-0.5, 2.0, pantsM, shoeM, true), legR = limb(0.5, 2.0, pantsM, shoeM, true);
  root.userData = { head, armL, armR, legL, legR, torso };
  scene.add(root); return root;
}
// pose: caminar (balanceo rígido de piezas), idle con respiración
function pose(ch, t, mode, phase = 0) {
  const u = ch.userData;
  if (mode === 'walk') {
    const s = Math.sin((t * 2.1 + phase) * Math.PI * 2) * 0.6;
    u.legL.rotation.x = s; u.legR.rotation.x = -s; u.armL.rotation.x = -s * 0.9; u.armR.rotation.x = s * 0.9;
    u.torso.position.y = 3 + Math.abs(Math.cos((t * 2.1 + phase) * Math.PI * 2)) * 0.12; u.head.position.y = 4.0 + (u.torso.position.y - 3);
  } else {
    const b = Math.sin((t + phase) * 2.2) * 0.03;
    u.legL.rotation.x = u.legR.rotation.x = 0; u.armL.rotation.x = u.armR.rotation.x = b; u.armL.rotation.z = -0.06; u.armR.rotation.z = 0.06;
    u.torso.position.y = 3 + b * 0.5; u.head.rotation.y = Math.sin((t + phase) * 0.9) * 0.12;
  }
}

// protagonista del plano 2 (vecino que paga por andar) y transeúntes
const walker = character({ skin: 0x8d5a3b, shirt: 0x2f74e8, stripe: 0xffffff, pants: 0x2b3a66, hair: 0x1d140e, face: 'happy' });
const PEDS = [
  { o: character({ shirt: 0xff7ab0, pants: 0xf4f4f4, hair: 0xf0c23a }), x: -ROAD / 2 - 6, z: -60, dir: 1, ph: .3 },
  { o: character({ skin: 0xc68b5e, shirt: 0x37c18f, pants: 0x2d3f73 }), x: ROAD / 2 + 8, z: -95, dir: -1, ph: .6 },
  { o: character({ shirt: 0xffb547, pants: 0x5d6bad, hair: 0x6b3b22 }), x: -ROAD / 2 - 9, z: -130, dir: -1, ph: .1 },
  { o: character({ skin: 0x8d5a3b, shirt: 0x8b5cf6, pants: 0x24293a }), x: ROAD / 2 + 5, z: -40, dir: 1, ph: .8 },
];
const guards = [-1, 1].map(s => { const g = character({ shirt: 0x24366e, pants: 0x1c2a55, hat: 'cap', face: 'stern', shoes: 0x111111 }); g.position.set(s * 7.5, 6.8, CIVIC_Z + 9); g.scale.setScalar(1.25); return g; });
// coches de juguete
const cars = [];
for (const [x, z, col, sp] of [[-7, -30, 0x3bc48d, 9], [7, -110, 0xffc93a, -8], [-7, -180, 0xff5c7a, 10], [7, 0, 0x5aa7ff, -9]]) {
  const g = new THREE.Group(); const b = box(6, 2.6, 12, mat(col, { roughness: .35 }), 0.6); b.position.y = 2.1; g.add(b);
  const cab = box(5.4, 2.2, 6.5, mat(0xbfe6ff, { roughness: .1, metalness: .2 }), 0.5); cab.position.set(0, 4.2, -0.5); g.add(cab);
  for (const [wx, wz] of [[-3, -4], [3, -4], [-3, 4], [3, 4]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.9, 16), mat(0x1a1a22)); w.rotation.z = Math.PI / 2; w.position.set(wx, 1.1, wz); w.castShadow = true; g.add(w); }
  g.rotation.y = sp > 0 ? Math.PI : 0; scene.add(g); cars.push({ g, x, z, sp });
}

// aro rosa brillante en el suelo al cobrar (con partículas)
const rings = [];
const ringTex = canvasTex(256, 256, (c, w, h) => {
  c.strokeStyle = '#ffffff'; c.lineWidth = 16; c.beginPath(); c.arc(128, 128, 96, 0, 7); c.stroke();
  for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283, r = 96 + Math.sin(i * 7.3) * 14; c.fillStyle = '#fff'; c.beginPath(); c.arc(128 + Math.cos(a) * r, 128 + Math.sin(a) * r, 6 + (i % 3) * 2, 0, 7); c.fill(); }
});
function addRing() { const m = new THREE.MeshBasicMaterial({ map: ringTex, color: new THREE.Color(2.4, 0.45, 1.3), transparent: true, depthWrite: false, toneMapped: false, fog: false });
  const r = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 7.5), m); r.rotation.x = -Math.PI / 2; r.visible = false; scene.add(r); rings.push(r); return r; }
for (let i = 0; i < 4; i++) addRing();

// ---------- post: bloom ----------
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }));
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.32, 0.55, 0.82); composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------- guion: tiempos de los planos y de las palabras ----------
const SHOTS = [0, 1.1, 3.7, 5.1];
const WORDS = [
  [0.12, 'en'], [0.38, 'mi'], [0.6, 'pueblo'],
  [1.2, 'tocar'], [1.55, 'el'], [1.78, 'suelo'], [2.25, 'cuesta'], [2.7, '$10', 1],
  [3.75, 'y'], [3.92, 'el'], [4.1, 'gobierno', 1], [4.62, 'manda'],
];
const STEP_TIMES = [1.62, 2.1, 2.58, 3.06];      // pasos del vecino en el plano 2: cada uno cobra
const DUR = 5.1;

// ---------- cámara por plano (siempre en movimiento) ----------
function cameraAt(t) {
  if (t < SHOTS[1]) {                              // 1: dron bajando y avanzando sobre la avenida
    const k = easeOut(t / SHOTS[1]);
    camera.position.set(0, lerp(78, 62, k), lerp(70, 30, k)); camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, lerp(-170, -190, k)); camera.fov = 62;
  } else if (t < SHOTS[2]) {                       // 2: a ras de acera, contrapicado, retrocede delante del vecino
    const k = (t - SHOTS[1]) / (SHOTS[2] - SHOTS[1]);
    const wz = walkerZ(t);
    camera.position.set(ROAD / 2 + 3.2, 1.35, wz + lerp(13, 9.5, easeInOut(k)));
    camera.lookAt(ROAD / 2 + 7.2, lerp(4.2, 4.6, k), wz - 6);
    camera.rotateZ(Math.sin(k * 3.1) * 0.025 - 0.03);   // balanceo de mano
    camera.fov = 66;
  } else {                                         // 3: edificio del gobierno, push-in frontal
    const k = (t - SHOTS[2]) / (SHOTS[3] - SHOTS[2]);
    camera.position.set(0, lerp(4.5, 5.5, k), CIVIC_Z + lerp(105, 86, easeOut(k)));
    camera.lookAt(0, 26, CIVIC_Z); camera.fov = 60;
  }
  camera.updateProjectionMatrix();
}
const walkerZ = t => -2 + (t - SHOTS[1]) * 6.5;   // camina hacia cámara (+z)

// ---------- capa 2D: pop-ups de dinero y subtítulo de una palabra ----------
function popScale(dt, frames = 4) {      // 0 -> 1.15 -> 1 en ~4 fotogramas
  const f = dt * FPS; if (f < 0) return 0;
  if (f < frames * 0.6) return lerp(0.0, 1.15, f / (frames * 0.6));
  if (f < frames) return lerp(1.15, 1.0, (f - frames * 0.6) / (frames * 0.4));
  return 1;
}
function moneyPopup(x, y, s, alpha, label = '-$10') {
  if (s <= 0 || alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s);
  const w = 236, h = 84;
  ctx.shadowColor = 'rgba(255,255,255,.95)'; ctx.shadowBlur = 34;
  ctx.fillStyle = '#ffffff'; rrect(ctx, -w / 2 - 7, -h / 2 - 7, w + 14, h + 14, 26); ctx.fill();
  ctx.shadowBlur = 0;
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#ff7aa0'); g.addColorStop(1, '#ff4f7f');
  ctx.fillStyle = g; rrect(ctx, -w / 2, -h / 2, w, h, 20); ctx.fill();
  ctx.fillStyle = '#ff4f7f'; ctx.beginPath(); ctx.moveTo(-14, h / 2 + 4); ctx.lineTo(14, h / 2 + 4); ctx.lineTo(0, h / 2 + 24); ctx.fill();
  // moneda
  ctx.shadowColor = 'rgba(255,240,120,.9)'; ctx.shadowBlur = 24;
  const cg = ctx.createRadialGradient(-w / 2 + 34, -12, 6, -w / 2 + 44, 0, 50); cg.addColorStop(0, '#fffbb0'); cg.addColorStop(.6, '#ffe83a'); cg.addColorStop(1, '#f2b800');
  ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(-w / 2 + 40, 0, 50, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff'; ctx.font = '700 62px Cap, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, 34, 4);
  ctx.restore();
}
function caption(t) {
  let cur = null; for (const w of WORDS) if (t >= w[0]) cur = w;
  if (!cur) return;
  const f = (t - cur[0]) * FPS;
  const s = f < 1 ? 0.2 : f < 2 ? 1.12 : 1.0;      // 20% -> 112% -> 100% en 3 fotogramas
  const size = H * 0.043 * (cur[2] ? 1.4 : 1);
  ctx.save(); ctx.translate(W / 2, H * 0.645); ctx.scale(s, s);
  ctx.font = `700 ${size}px Cap, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
  ctx.lineWidth = size * 0.24; ctx.strokeStyle = '#000'; ctx.strokeText(cur[1], 0, 0);
  ctx.shadowColor = 'transparent'; ctx.fillStyle = '#E2FD07'; ctx.fillText(cur[1], 0, 0);
  ctx.restore();
}
const project = (v) => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };

// ---------- un fotograma ----------
function renderAt(t) {
  // mundo vivo
  for (const c of cars) { let z = c.z + c.sp * t; c.g.position.set(c.x, 0, z); }
  for (const p of PEDS) { p.o.position.set(p.x, 0.8, p.z + p.dir * 5 * t); p.o.rotation.y = p.dir > 0 ? 0 : Math.PI; pose(p.o, t, 'walk', p.ph); }
  guards.forEach((g, i) => pose(g, t, 'idle', i));
  // vecino del plano 2
  walker.position.set(ROAD / 2 + 7.2, 0.8, walkerZ(t)); walker.rotation.y = 0.08; pose(walker, t, 'walk', 0.25);
  walker.visible = t >= SHOTS[1] - 0.01 && t < SHOTS[2];
  // aros de cobro bajo los pies
  rings.forEach((r, i) => { const dt = t - STEP_TIMES[i]; r.visible = walker.visible && dt >= 0 && dt < 0.9;
    if (r.visible) { const k = dt / 0.9; r.position.set(walker.position.x, 0.86, walkerZ(STEP_TIMES[i]) + 0.2); r.scale.setScalar(0.5 + easeOut(k) * 0.8); r.material.opacity = 1 - k; r.rotation.z = k * 2; } });
  cameraAt(t);
  sun.target.position.copy(camera.position).add(new THREE.Vector3(0, 0, -80)); sun.target.position.y = 0;
  sun.position.copy(sun.target.position).add(new THREE.Vector3(-130, 210, 160));
  composer.render();

  ctx.clearRect(0, 0, W, H);
  if (walker.visible) {               // pop-ups "-$10" junto al vecino, uno por paso
    STEP_TIMES.forEach((st, i) => { const dt = t - st; if (dt < 0 || dt > 0.62) return;
      let [x, y] = project(V(walker.position.x + 2.2, 3.6 + dt * 1.2, walkerZ(t) + 0.5));
      x = Math.min(x, W - 150);
      moneyPopup(x, y, popScale(dt) * 0.9, dt > 0.5 ? 1 - (dt - 0.5) / 0.12 : 1); });
  }
  caption(t);
}

window.renderAt = renderAt;
window.DUR = DUR; window.FPS = FPS;
document.fonts.load('700 40px Cap').then(() => { renderAt(0); window.__ready = true; });

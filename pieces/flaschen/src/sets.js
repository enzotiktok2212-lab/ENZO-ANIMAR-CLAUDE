// Escenarios: ciudad en noche eterna (calle + Marktplatz con Rathausturm sin agujas + Schlafgarten),
// Café Wachter por fuera y por dentro.
import { THREE, RNG, canvasTex, mat, box, cyl, sphere, rrect, textPlane } from './engine.js';
import { coffeeCup, makeOpa, makeTownsperson } from './cast.js';
export { cobbleTex, plankTex, roofTex };

const rnd = RNG(11);
export const FONT = 'Cap, sans-serif';

// ---------- cielo nocturno, luna, estrellas ----------
export function nightSky(scene) {
  const starTex = canvasTex(2048, 1024, (c, w, h) => {
    const r = RNG(5);
    for (let i = 0; i < 1400; i++) { const y = r() * h * 0.62, a = 0.35 + r() * 0.65, s = r() < 0.06 ? 2.6 : 1.2;
      c.fillStyle = `rgba(255,255,240,${a})`; c.beginPath(); c.arc(r() * w, y, s, 0, 7); c.fill(); }
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1800, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { stars: { value: starTex }, top: { value: new THREE.Color(0x0a1648) }, mid: { value: new THREE.Color(0x2a2f8f) }, hor: { value: new THREE.Color(0x7a4fb8) } },
    vertexShader: 'varying vec3 p; varying vec2 vUv; void main(){ p=normalize(position); vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform sampler2D stars; uniform vec3 top, mid, hor; varying vec3 p; varying vec2 vUv;
      void main(){ float y=clamp(p.y,0.,1.); vec3 c = mix(hor, mid, smoothstep(0.,.18,y)); c = mix(c, top, smoothstep(.18,.6,y));
      c += texture2D(stars, vUv*vec2(3.,2.)).rgb * smoothstep(.05,.3,y) * .9; gl_FragColor=vec4(c,1.); }`
  }));
  scene.add(sky);
  const moonTex = canvasTex(512, 512, (c) => {
    const g = c.createRadialGradient(256, 256, 60, 256, 256, 256); g.addColorStop(0, 'rgba(255,248,210,.85)'); g.addColorStop(.35, 'rgba(255,240,200,.25)'); g.addColorStop(1, 'rgba(255,240,200,0)');
    c.fillStyle = g; c.fillRect(0, 0, 512, 512);
    c.fillStyle = '#fff6d6'; c.beginPath(); c.arc(256, 256, 92, 0, 7); c.fill();
    c.fillStyle = 'rgba(210,200,170,.6)'; for (const [x, y, r] of [[226, 230, 18], [290, 280, 24], [250, 300, 10], [300, 220, 9]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  });
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex, fog: false, depthWrite: false, transparent: true, toneMapped: false, color: new THREE.Color(1.6, 1.55, 1.4) }));
  moon.scale.set(420, 420, 1); scene.add(moon);
  const clouds = [];
  const cloudTex = canvasTex(512, 256, (c) => { for (let i = 0; i < 9; i++) { const x = 80 + i * 44, y = 150 - (i % 3) * 22, g = c.createRadialGradient(x, y, 6, x, y, 80);
    g.addColorStop(0, 'rgba(150,140,230,.55)'); g.addColorStop(1, 'rgba(150,140,230,0)'); c.fillStyle = g; c.fillRect(0, 0, 512, 256); } });
  for (let i = 0; i < 10; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, fog: false, transparent: true, depthWrite: false })); s.scale.set(520, 260, 1); scene.add(s); clouds.push(s); }
  return { sky, moon, clouds };
}

// ---------- texturas ----------
const cobbleTex = canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#4d4a6e'; c.fillRect(0, 0, w, h); const r = RNG(9);
  for (let y = 0; y < h; y += 32) for (let x = (y / 32) % 2 ? -24 : 0; x < w; x += 48) {
    const l = 0.85 + r() * 0.3; c.fillStyle = `rgb(${110 * l | 0},${106 * l | 0},${150 * l | 0})`; rrect(c, x + 3, y + 3, 42, 26, 9); c.fill();
    c.fillStyle = 'rgba(255,255,255,.08)'; rrect(c, x + 6, y + 5, 34, 8, 4); c.fill(); }
}, true);
const plankTex = canvasTex(512, 512, (c, w, h) => { const r = RNG(4);
  for (let y = 0; y < h; y += 64) { const l = 0.85 + r() * 0.25; c.fillStyle = `rgb(${168 * l | 0},${104 * l | 0},${58 * l | 0})`; c.fillRect(0, y, w, 62); c.fillStyle = 'rgba(60,30,10,.5)'; c.fillRect(0, y + 62, w, 2);
    c.strokeStyle = 'rgba(90,50,20,.25)'; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(0, y + 12 + i * 12); c.bezierCurveTo(w * .3, y + 8 + i * 12 + r() * 8, w * .6, y + 16 + i * 12, w, y + 10 + i * 12); c.stroke(); }
    const xo = r() * w; c.fillStyle = 'rgba(60,30,10,.5)'; c.fillRect(xo, y, 2, 62); }
}, true);
const roofTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#7a2a34'; c.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 22) for (let x = (y / 22) % 2 ? -16 : 0; x < w; x += 32) { c.fillStyle = '#a23a44'; rrect(c, x + 2, y, 28, 20, [0, 0, 12, 12]); c.fill(); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(x + 2, y + 16, 28, 4); } }, true);
function facadeTex(col, lit, fach) {
  return canvasTex(160, 200, (c, w, h) => {
    c.fillStyle = fach ? '#f6ecd6' : col; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(0,0,0,.06)'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 1);
    if (fach) { c.fillStyle = '#5a3420'; c.fillRect(0, 0, w, 12); c.fillRect(0, h - 14, w, 14); c.fillRect(0, 0, 12, h); c.fillRect(w - 12, 0, 12, h);
      c.strokeStyle = '#5a3420'; c.lineWidth = 11; c.beginPath(); c.moveTo(12, h - 14); c.lineTo(40, 160); c.moveTo(w - 12, h - 14); c.lineTo(120, 160); c.moveTo(12, 12); c.lineTo(36, 40); c.moveTo(w - 12, 12); c.lineTo(124, 40); c.stroke(); }
    // contraventanas
    c.fillStyle = '#2e5a8a'; c.fillRect(22, 46, 18, 100); c.fillRect(120, 46, 18, 100);
    c.fillStyle = 'rgba(255,255,255,.15)'; for (let y = 52; y < 140; y += 10) { c.fillRect(24, y, 14, 3); c.fillRect(122, y, 14, 3); }
    c.fillStyle = '#ffffff'; rrect(c, 40, 40, 80, 112, 8); c.fill();
    if (lit) { const g = c.createLinearGradient(0, 48, 0, 146); g.addColorStop(0, '#fff2b0'); g.addColorStop(1, '#ffb84a'); c.fillStyle = g; }
    else c.fillStyle = '#28305e';
    c.fillRect(47, 47, 66, 98); c.fillStyle = '#ffffff'; c.fillRect(77, 47, 6, 98); c.fillRect(47, 92, 66, 6);
    if (lit) { c.fillStyle = 'rgba(120,60,20,.35)'; c.fillRect(47, 47, 20, 98); c.fillRect(93, 47, 20, 98); }   // cortinas
    c.fillStyle = '#ffffff'; c.fillRect(34, 152, 92, 8);                       // alféizar
    c.fillStyle = '#d65a7a'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(44 + i * 15, 150, 6, 0, 7); c.fill(); }   // flores
  }, true);
}
const FAC = ['#f2b8c6', '#a8d8f0', '#f6dc8a', '#b9e3b0', '#d4b8f2', '#f4c09a', '#9fd0c8'];
// las ventanas encendidas emiten (todos están despiertos)
function litMat(col, fach) { const t = facadeTex(col, true, fach); return new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: canvasTex(160, 200, (c) => { c.fillStyle = '#000'; c.fillRect(0, 0, 160, 200); const g = c.createLinearGradient(0, 48, 0, 146); g.addColorStop(0, '#ffe9a0'); g.addColorStop(1, '#ff9a2a'); c.fillStyle = g; c.fillRect(47, 47, 66, 98); c.fillStyle = '#000'; c.fillRect(77, 47, 6, 98); c.fillRect(47, 92, 66, 6); }, true), emissiveIntensity: 0.9, roughness: .7 }); }

// casa alemana estrecha con tejado a dos aguas, buhardilla, chimenea
function townhouse(parent, x, z, wid, floors, ci, rot = 0, opts = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  const fh = 9, h = 7 + floors * fh, d = 22, col = FAC[ci % FAC.length];
  const fach = ci % 2 === 0; const m = litMat(col, fach); m.map.repeat.set(wid / 8, floors); m.emissiveMap.repeat.set(wid / 8, floors);
  m.map.offset.x = m.emissiveMap.offset.x = (ci * 0.37) % 1;
  box(wid, h - 7, d, m, 0, g, 0, 7 + (h - 7) / 2, 0);
  box(wid, 7, d, mat(fach ? 0xd9cdb8 : col), 0, g, 0, 3.5, 0);
  // jardineras con geranios bajo las ventanas del primer piso
  for (let i = 0; i < Math.floor(wid / 8); i++) { const fx = -wid / 2 + 4 + i * 8; box(4.4, 0.8, 1.2, mat(0x7a4a2a), 0.15, g, fx, 7 + 9 * 0.24, d / 2 + 0.6);
    for (let j = 0; j < 4; j++) sphere(0.45, mat(j % 2 ? 0xe8323a : 0x3f9a45, { emissive: j % 2 ? 0x3a0000 : 0 }), g, fx - 1.4 + j * 0.95, 7 + 9 * 0.24 + 0.6, d / 2 + 0.6); }
  if (opts.sign) { const sg = new THREE.Group(); sg.position.set(wid * 0.38, 8.6, d / 2 + 2.2); g.add(sg); box(0.2, 0.2, 3, mat(0x1d2238), 0, sg, 0, 1.2, -1.2);
    const br = new THREE.Mesh(new THREE.TorusKnotGeometry(0.9, 0.28, 64, 10, 2, 3), mat(0xc8873a, { roughness: .6 })); br.scale.set(1, 0.8, 0.5); br.position.y = -0.2; br.castShadow = true; sg.add(br); }
  box(wid + 0.8, 0.9, d + 0.8, mat(0xffffff), 0.1, g, 0, 7.2, 0);
  box(wid + 1.4, 1.1, d + 1.4, mat(0xffffff), 0.1, g, 0, h + 0.4, 0);
  // tejado
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, wid * 0.62, 10, 4, 1, false, Math.PI / 4), mat(0xffffff, { map: (() => { const t = roofTex.clone(); t.needsUpdate = true; t.repeat.set(3, 2); return t; })(), roughness: .6 }));
  roof.scale.set(1, 1, (d + 2) / wid); roof.position.set(0, h + 5.8, 0); roof.castShadow = true; g.add(roof);
  if (opts.chimney !== false) box(2, 7, 2, mat(0x9a4a3a), 0.1, g, wid * 0.25, h + 7, -3);
  const dorm = box(4, 4, 3, mat(col), 0.2, g, -wid * 0.15, h + 3.2, d / 2 - 2.5);
  const dw = box(2.2, 2.2, 0.2, mat(0xffe08a, { emissive: 0xffb84a, emissiveIntensity: 1.2 }), 0, g, -wid * 0.15, h + 3.2, d / 2 - 0.9);
  // planta baja: puerta + escaparate
  const front = d / 2 + 0.06;
  box(3.4, 5.2, 0.3, mat(0x5a3220), 0.1, g, -wid * 0.28, 2.8, front);
  sphere(0.18, mat(0xd9a531, { metalness: .8, roughness: .3 }), g, -wid * 0.28 + 1.1, 2.8, front + 0.2);
  box(wid * 0.45, 4, 0.25, mat(0xffd27a, { emissive: 0xffa84a, emissiveIntensity: 0.8 }), 0, g, wid * 0.2, 3.2, front);
  // toldo
  const aw = canvasTex(256, 64, (c, w, h) => { const cc = ['#e8505b', '#5bb7e8', '#5fd39a', '#f2b33d'][ci % 4]; for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#ffffff' : cc; c.fillRect(i * 16, 0, 16, h); } }, true);
  const awn = box(wid * 0.5, 0.2, 3.2, mat(0xffffff, { map: aw }), 0, g, wid * 0.2, 5.8, front + 1.4); awn.rotation.x = 0.35;
  return g;
}

// farola antigua con luz cálida
const lampPostM = mat(0x1d2238, { roughness: .4, metalness: .5 });
export function streetLamp(parent, x, z, withLight = false) {
  const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
  cyl(0.35, 0.5, 1.2, lampPostM, 12, g, 0, 0.6, 0);
  cyl(0.18, 0.22, 12, lampPostM, 12, g, 0, 6.6, 0);
  const cage = cyl(0.9, 0.6, 1.8, mat(0xfff0b0, { emissive: 0xffc25a, emissiveIntensity: 2.4, transparent: true, opacity: .95 }), 6, g, 0, 13.4, 0);
  cyl(1.2, 0.2, 0.7, lampPostM, 6, g, 0, 14.6, 0);
  if (withLight) { const l = new THREE.PointLight(0xffb85a, 900, 60, 2); l.position.set(0, 13, 0); g.add(l); }
  return g;
}

// ---------- calle + Marktplatz ----------
export function townSet(scene) {
  const root = new THREE.Group(); scene.add(root);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 900), mat(0xffffff, { map: (() => { const t = cobbleTex.clone(); t.needsUpdate = true; t.repeat.set(60, 90); return t; })(), roughness: .85 }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, -250); ground.receiveShadow = true; root.add(ground);
  // aceras
  for (const s of [-1, 1]) { const sw = box(10, 0.6, 300, mat(0x8a86b8, { roughness: .8 }), 0, root, s * 18, 0.3, -110); sw.castShadow = false; }
  // casas a ambos lados de la calle
  for (const s of [-1, 1]) { let z = 30, i = s > 0 ? 3 : 0;
    while (z > -250) { const wid = 16 + Math.floor(rnd() * 8), fl = 2 + Math.floor(rnd() * 3);
      townhouse(root, s * (23 + 11), z - wid / 2, wid, fl, i, s > 0 ? -Math.PI / 2 : Math.PI / 2, { sign: i % 4 === 1 }); z -= wid + 0.4; i++; } }
  for (let z = 20; z > -250; z -= 30) for (const s of [-1, 1]) streetLamp(root, s * 14, z + (s > 0 ? 15 : 0));
  return root;
}

// Rathausturm sin agujas (con puertecita de cuco bajo la esfera)
export function rathausturm(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const stone = mat(0xe9dcc8, { roughness: .75 }), trim = mat(0xffffff), copper = mat(0x4fb39a, { roughness: .5, metalness: .2 });
  box(60, 34, 30, stone, 0.3, g, 0, 17, 0);                        // Rathaus
  for (let i = -2; i <= 2; i++) for (const y of [10, 24]) box(5, 7, 0.4, mat(0xffd27a, { emissive: 0xffa84a, emissiveIntensity: 1.0 }), 0.1, g, i * 11, y, 15.1);
  const rr = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 44, 16, 4, 1, false, Math.PI / 4), mat(0xffffff, { map: (() => { const t = roofTex.clone(); t.needsUpdate = true; t.repeat.set(5, 2); return t; })() }));
  rr.scale.set(1, 1, 0.55); rr.position.y = 42; rr.castShadow = true; g.add(rr);
  box(18, 70, 18, stone, 0.3, g, 0, 35 + 34, 0);                   // torre
  box(19.5, 1.2, 19.5, trim, 0.2, g, 0, 70, 0); box(19.5, 1.2, 19.5, trim, 0.2, g, 0, 104, 0);
  const face = textPlane(14, 14, 512, 512, (c) => {
    c.fillStyle = '#fdf6e0'; c.beginPath(); c.arc(256, 256, 248, 0, 7); c.fill();
    c.lineWidth = 18; c.strokeStyle = '#1d2238'; c.stroke(); c.lineWidth = 6; c.beginPath(); c.arc(256, 256, 214, 0, 7); c.stroke();
    c.fillStyle = '#1d2238'; c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    const R = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    R.forEach((r, i) => { const a = i / 12 * Math.PI * 2 - Math.PI / 2; c.fillText(r, 256 + Math.cos(a) * 172, 256 + Math.sin(a) * 172); });
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; c.fillRect(256 + Math.cos(a) * 222 - 3, 256 + Math.sin(a) * 222 - 3, 6, 6); }
    c.beginPath(); c.arc(256, 256, 18, 0, 7); c.fill();   // solo el eje: sin agujas
  }, 0.35);
  face.position.set(0, 88, 9.05); g.add(face);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(7.3, 0.7, 12, 48), mat(0xd9a531, { metalness: .8, roughness: .3 })); ring.position.set(0, 88, 9.2); g.add(ring);
  // agujas (ocultas hasta el final): se añaden aquí para poder mostrarlas
  const hands = new THREE.Group(); hands.position.set(0, 88, 9.4); g.add(hands);
  const hm = mat(0x141018, { metalness: .4, roughness: .3 });
  const hourH = new THREE.Group(); hands.add(hourH); box(0.8, 3.8, 0.3, hm, 0.1, hourH, 0, 1.9, 0);
  const minH = new THREE.Group(); hands.add(minH); box(0.6, 5.8, 0.3, hm, 0.1, minH, 0, 2.9, 0.2);
  hands.visible = false;
  // puertecita del cuco
  const door = new THREE.Group(); door.position.set(-1.6, 76, 9.1); g.add(door);
  box(3.2, 4, 0.3, mat(0x7a4a2a), 0.1, door, 1.6, 0, 0);
  box(3.6, 0.5, 0.8, trim, 0.1, g, 0, 73.6, 9.3);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(14, 30, 4), copper); spire.rotation.y = Math.PI / 4; spire.position.y = 120; spire.castShadow = true; g.add(spire);
  sphere(1.4, mat(0xd9a531, { metalness: .8, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .4 }), g, 0, 136, 0);
  // banderas
  return { g, hands, hourH, minH, door };
}

// Schlafgarten am Marktplatz: filas de camas numeradas con durmientes
export function schlafgarten(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const woodM = mat(0x8a5634, { roughness: .6 }), sheetM = mat(0xffffff, { roughness: .8 });
  const quiltT = (a, b) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let y = 0; y < h; y += 32) for (let x = (y / 32) % 2 ? 0 : 32; x < w; x += 64) c.fillRect(x, y, 32, 32);
    c.strokeStyle = 'rgba(255,255,255,.5)'; c.setLineDash([6, 6]); c.lineWidth = 3; for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } });
  const QC = [['#5b7fd6', '#7f9ff0'], ['#d65b8a', '#f08fb0'], ['#4fb39a', '#7fd8c0'], ['#f2b33d', '#ffd27a'], ['#9b6bd6', '#c09bf0']];
  const beds = [];
  let n = 1;
  for (let row = 0; row < 3; row++) for (let col = 0; col < 5; col++) {
    const b = new THREE.Group(); b.position.set((col - 2) * 6.2, 0, -row * 9.5); b.scale.setScalar(0.45); g.add(b);
    box(8, 1.6, 13, woodM, 0.2, b, 0, 1.6, 0);
    box(7.6, 1, 12.4, sheetM, 0.4, b, 0, 2.8, 0);
    const [qa, qb] = QC[(row * 5 + col) % QC.length];
    box(7.8, 1.8, 8.6, mat(0xffffff, { map: quiltT(qa, qb) }), 0.6, b, 0, 4.4, 1.8);
    box(4.6, 1.2, 2.4, sheetM, 0.5, b, 0, 3.6, -4.6);
    box(8.4, 6.4, 0.8, woodM, 0.3, b, 0, 3.6, -6.6);              // cabecero
    for (const s of [-1, 1]) sphere(0.6, mat(0xd9a531, { metalness: .8, roughness: .3 }), b, s * 4, 7, -6.6);
    const num = textPlane(2.6, 2.6, 128, 128, (c) => { c.fillStyle = '#fdf6e0'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.strokeStyle = '#7a4a2a'; c.lineWidth = 8; c.stroke();
      c.fillStyle = '#7a2a34'; c.font = `700 72px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(n), 64, 68); });
    num.position.set(0, 5.2, -6.15); b.add(num);
    beds.push({ g: b, n }); n++;
  }
  // durmientes: cabezas con gorro asomando de la almohada
  const sleepers = [];
  for (const bd of beds) {
    if (bd.n === 9) continue;
    const p = makeTownsperson(scene, bd.n, { face: { eyes: 'closed', bags: 0.3, mouth: 'o', brows: 0 } });
    p.root.position.set(bd.g.position.x + x, 1.45, bd.g.position.z + z + 1.7); p.root.rotation.x = -Math.PI / 2; p.root.scale.setScalar(0.8);
    sleepers.push(p);
  }
  // seto, flores, farolillos, arco con el nombre
  for (const s of [-1, 1]) { box(2.4, 2.6, 36, mat(0x2f8a4a, { roughness: .9 }), 0.9, g, s * 18, 1.3, -9); for (let i = 0; i < 16; i++) sphere(0.45, mat(['#ff7ab0', '#ffd23f', '#ffffff'][i % 3], { emissive: 0x222222 }), g, s * 16.4, 0.5, 8 - i * 2.2); }
  const arch = new THREE.Group(); arch.position.set(0, 0, 9); arch.scale.setScalar(0.6); g.add(arch);
  for (const s of [-1, 1]) cyl(0.5, 0.6, 18, mat(0x2a2f48, { metalness: .5, roughness: .4 }), 12, arch, s * 18, 9, 0);
  const sign = textPlane(34, 5, 1024, 150, (c, w, h) => { c.fillStyle = '#1d2238'; rrect(c, 4, 4, 1016, 142, 30); c.fill(); c.strokeStyle = '#d9a531'; c.lineWidth = 8; c.stroke();
    c.fillStyle = '#ffd27a'; c.font = `700 92px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SCHLAFGARTEN', 512, 80); }, 1.2);
  sign.position.set(0, 17, 0.4); arch.add(sign);
  for (const [lx, lz] of [[-15, 6], [15, 6], [-15, -22], [15, -22]]) streetLamp(g, lx, lz, lx < 0 && lz > 0);
  // Opa en la cama 9
  const opa = makeOpa(scene); opa.sleepMode(true);
  const b9 = beds.find(b => b.n === 9).g;
  opa.root.position.set(b9.position.x + x, 1.45, b9.position.z + z + 1.6); opa.root.rotation.x = -Math.PI / 2; opa.root.scale.setScalar(0.8);
  for (const p of sleepers) g.attach(p.root); g.attach(opa.root);
  return { g, beds, opa, bed9: b9, sleepers };
}

// ---------- Café Wachter por fuera (fachada en la calle) ----------
export function cafeFront(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const wallM = mat(0x5a2a4a, { roughness: .7 });
  box(30, 24, 4, wallM, 0.2, g, 0, 12, 0);
  box(31, 1.2, 5, mat(0xd9a531, { metalness: .6, roughness: .35 }), 0.2, g, 0, 24.4, 0);
  // gran escaparate cálido
  const win = textPlane(18, 10, 512, 290, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffe2a0'); gr.addColorStop(1, '#ff9f3a'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(90,40,20,.45)'; for (let i = 0; i < 6; i++) { c.fillRect(30 + i * 80, 160, 46, 130); c.beginPath(); c.arc(53 + i * 80, 150, 24, 0, 7); c.fill(); }
    c.fillStyle = '#ffffff'; c.font = `700 44px ${FONT}`; c.textAlign = 'center'; c.fillText('☕ KAFFEE', w / 2, 70); }, 1.0);
  win.position.set(-3, 9, 2.1); g.add(win);
  box(19, 0.6, 1, mat(0xffffff), 0.1, g, -3, 3.8, 2.4); box(19, 0.6, 1, mat(0xffffff), 0.1, g, -3, 14.2, 2.4);
  box(5, 10, 0.4, mat(0x2a1a14), 0.1, g, 10.5, 5.2, 2.1);
  // letrero de neón
  const neon = textPlane(24, 4.4, 1024, 190, (c, w, h) => { c.shadowColor = '#ff6fb0'; c.shadowBlur = 30; c.fillStyle = '#ffd0e8'; c.font = `700 130px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CAFÉ WACHTER', w / 2, h / 2 + 6); }, 2.2);
  neon.position.set(0, 19.5, 2.3); g.add(neon);
  // toldo burdeos
  const aw = canvasTex(256, 64, (c, w, h) => { for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#f6e6d0' : '#8a1f3a'; c.fillRect(i * 16, 0, 16, h); } c.fillStyle = '#8a1f3a'; for (let i = 0; i < 16; i++) { c.beginPath(); c.arc(i * 16 + 8, h - 6, 8, 0, Math.PI); c.fill(); } }, true);
  const awn = box(22, 0.3, 5, mat(0xffffff, { map: aw }), 0, g, -3, 15.6, 4.4); awn.rotation.x = 0.4;
  // pizarra de precio
  const board = new THREE.Group(); board.position.set(8, 0, 9); board.rotation.y = -0.3; g.add(board);
  for (const s of [-1, 1]) { const l = box(0.3, 7, 0.3, mat(0x6b4a2e), 0, board, s * 2.2, 3.4, s * 0); l.rotation.x = 0.18; }
  const chalk = textPlane(4.6, 5.4, 256, 300, (c, w, h) => { c.fillStyle = '#6b4a2e'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e2a24'; c.fillRect(14, 14, w - 28, h - 28);
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = `700 44px ${FONT}`; c.fillText('KAFFEE', w / 2, 80); c.fillStyle = '#ffd23f'; c.font = `700 92px ${FONT}`; c.fillText('8 €', w / 2, 190);
    c.fillStyle = 'rgba(255,255,255,.7)'; c.font = `700 26px ${FONT}`; c.fillText('pro Tasse', w / 2, 250); });
  chalk.position.set(0, 4.6, 0.25); chalk.rotation.x = -0.18; board.add(chalk);
  // luz cálida que sale del café
  const l = new THREE.PointLight(0xffa64a, 1600, 70, 2); l.position.set(-3, 9, 8); g.add(l);
  return { g, neon };
}

// ---------- Café Wachter por dentro ----------
export function cafeInterior(scene, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(70, 50), mat(0xffffff, { map: (() => { const t = plankTex.clone(); t.needsUpdate = true; t.repeat.set(7, 6); return t; })(), roughness: .55 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);
  const wallT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#6a2a3e'; c.fillRect(0, 0, w, h); c.fillStyle = '#7a3348'; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h);
    c.fillStyle = '#3a1a24'; c.fillRect(0, h - 70, w, 70); c.fillStyle = '#d9a531'; c.fillRect(0, h - 74, w, 6); }, true);
  wallT.repeat.set(6, 1.6);
  box(70, 34, 1, mat(0xffffff, { map: wallT }), 0, g, 0, 17, -16);
  for (const s of [-1, 1]) box(1, 34, 50, mat(0x6a2a3e), 0, g, s * 35, 17, 0);
  // estanterías con sacos de café y tazas
  for (const y of [8, 12.5]) { box(36, 0.6, 3, mat(0x8a5634), 0.1, g, 0, y, -14);
    for (let i = 0; i < 9; i++) { if ((i + y) % 3 === 0) coffeeCup(g, -16 + i * 4, y + 0.3, -14, 1.0); else { const sack = box(1.6, 2, 1.2, mat([0xc8a070, 0xb08a5a, 0xd8b080][i % 3], { roughness: 1 }), 0.5, g, -16 + i * 4, y + 1.3, -14);
      const lab = textPlane(1.6, 1, 64, 40, (c) => { c.fillStyle = '#3b2112'; c.font = `700 20px ${FONT}`; c.textAlign = 'center'; c.fillText('KAFFEE', 32, 26); }); lab.position.set(-16 + i * 4, y + 1.3, -13.35); lab.scale.setScalar(0.7); g.add(lab); } } }
  // pizarra de menú grande
  const menu = textPlane(14, 9, 512, 330, (c, w, h) => { c.fillStyle = '#7a4a2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e2a24'; c.fillRect(16, 16, w - 32, h - 32);
    c.fillStyle = '#fff'; c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.fillText('KARTE', w / 2, 78);
    c.textAlign = 'left'; c.font = `700 34px ${FONT}`; const it = [['Kaffee', '8 €'], ['Doppelt', '16 €'], ['Extra stark', '24 €'], ['Schlaf', 'VERBOTEN']];
    it.forEach(([a, b], i) => { c.fillStyle = '#fff'; c.fillText(a, 50, 140 + i * 48); c.fillStyle = i === 3 ? '#ff6f7d' : '#ffd23f'; c.textAlign = 'right'; c.fillText(b, w - 50, 140 + i * 48); c.textAlign = 'left'; }); });
  menu.position.set(17, 12, -15.4); menu.scale.setScalar(0.75); g.add(menu);
  // mostrador con encimera de mármol
  const marble = canvasTex(256, 64, (c, w, h) => { c.fillStyle = '#f2eee8'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(150,140,160,.4)'; c.lineWidth = 2; const r = RNG(3); for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(r() * w, 0); c.bezierCurveTo(r() * w, h * .3, r() * w, h * .7, r() * w, h); c.stroke(); } }, true);
  const counter = new THREE.Group(); counter.position.set(0, 0, -6); counter.scale.setScalar(0.42); g.add(counter);
  box(46, 8, 5, mat(0x8a5634, { roughness: .5 }), 0.3, counter, 0, 4, 0);
  for (let i = -5; i <= 5; i++) box(3, 5.5, 0.3, mat(0x6b3f22), 0.1, counter, i * 4, 4, 2.6);
  box(47, 0.8, 6, mat(0xffffff, { map: marble, roughness: .2 }), 0.2, counter, 0, 8.4, 0);
  // máquina de espresso cromada con manómetro
  const chrome = mat(0xdfe4ef, { metalness: .9, roughness: .15 });
  const mach = new THREE.Group(); mach.position.set(-12, 8.8, -1); counter.add(mach);
  box(9, 6, 4.5, chrome, 0.5, mach, 0, 3, 0);
  box(9.2, 0.6, 4.7, mat(0x8a1f3a), 0.2, mach, 0, 6.2, 0);
  const dome = sphere(1.6, chrome, mach, 0, 7.4, 0); dome.scale.y = 0.6;
  const eagle = sphere(0.6, mat(0xd9a531, { metalness: .8, roughness: .2 }), mach, 0, 8.5, 0);
  const gauge = textPlane(1.8, 1.8, 128, 128, (c) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 6; c.stroke();
    c.strokeStyle = '#d62f3a'; c.lineWidth = 5; c.beginPath(); c.moveTo(64, 64); c.lineTo(104, 40); c.stroke(); }); gauge.position.set(0, 4.2, 2.3); mach.add(gauge);
  for (const s of [-1, 1]) { box(1.4, 0.6, 2, chrome, 0.2, mach, s * 2.4, 1.2, 2.6); box(0.3, 0.3, 1.6, mat(0x111111), 0.1, mach, s * 2.4, 1.2, 4); coffeeCup(mach, s * 2.4, -0.1, 2.8, 0.9); }
  // tazas en la barra, molinillo, caja registradora
  for (let i = 0; i < 4; i++) coffeeCup(counter, 4 + i * 3, 8.8, 1.2, 1.1);
  const reg = new THREE.Group(); reg.position.set(17, 8.8, -0.5); counter.add(reg);
  box(5, 3, 3.6, mat(0xd9a531, { metalness: .7, roughness: .3 }), 0.4, reg, 0, 1.5, 0); box(4, 1.6, 0.4, mat(0x1d2238), 0.1, reg, 0, 3.6, -1);
  // lámparas colgantes
  for (const lx of [-15, 0, 15]) { cyl(0.08, 0.08, 10, mat(0x111111), 6, g, lx, 29, -4); const sh = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.5, 24, 1, true), mat(0xd9a531, { metalness: .7, roughness: .3, side: THREE.DoubleSide })); sh.position.set(lx, 23, -4); g.add(sh);
    sphere(0.55, mat(0xfff2c0, { emissive: 0xffd27a, emissiveIntensity: 2 }), g, lx, 22.6, -4); }
  const L1 = new THREE.PointLight(0xffb060, 700, 80, 2); L1.position.set(-8, 21, 2); g.add(L1);
  const L2 = new THREE.PointLight(0xffc880, 500, 80, 2); L2.position.set(12, 21, 6); g.add(L2);
  // mesas con clientes cansados
  const tables = [];
  for (const [tx, tz] of [[-20, 12], [0, 14], [20, 12]]) { const t = new THREE.Group(); t.position.set(tx * 0.6, 0, tz * 0.6); t.scale.setScalar(0.45); g.add(t);
    cyl(3.2, 3.2, 0.5, mat(0xf2eee8, { roughness: .3 }), 32, t, 0, 6, 0); cyl(0.4, 0.6, 6, mat(0x1d2238, { metalness: .5 }), 12, t, 0, 3, 0); cyl(1.8, 1.8, 0.3, mat(0x1d2238), 24, t, 0, 0.15, 0);
    coffeeCup(t, 0.6, 6.25, 0.4, 1.0); tables.push(t); }
  return { g, counter, mach, tables, reg };
}

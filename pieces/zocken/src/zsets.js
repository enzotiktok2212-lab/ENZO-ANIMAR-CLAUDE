// ZOCKEN — escenarios y atrezo propios: pantallas con la ciudad del juego (atardecer de neón, palmeras, mar, deportivo),
// el logo del juego, la Zockerhalle (sala llena de jugones y pantallas), el campo con muro detrás de la iglesia, el tranvía,
// mandos, barra de dominadas, tele, carta del reto, autobús rival y portería-letrero.
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, tree, lamp } from './props.js';
import { FONT } from './sets.js';
import { signBoard } from './wsets.js';
import { house } from './pech.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const G = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; };
export const shade = g => { g.traverse(o => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
export const glowM = (col, k = 1) => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: k, roughness: .5 });
const basic = (map) => new THREE.MeshBasicMaterial({ map, toneMapped: false });

// ---------- el juego: ciudad de neón al atardecer (textura animada) ----------
function drawLogo(c, w, h, cx, cy, s) {   // «GRAND THEFT AUTO» + «VI» con degradado rosa-naranja-violeta
  c.save(); c.translate(cx, cy); c.scale(s, s); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  c.font = `900 150px "DejaVu Serif", Georgia, serif`; const g = c.createLinearGradient(-90, -70, 90, 70); g.addColorStop(0, '#ffb04a'); g.addColorStop(.45, '#ff4a9a'); g.addColorStop(1, '#8a3aff');
  c.lineWidth = 16; c.strokeStyle = '#140a24'; c.strokeText('VI', 0, 18); c.fillStyle = g; c.fillText('VI', 0, 18);
  c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.75)'; c.strokeText('VI', 0, 18);
  c.font = `700 22px ${FONT}`; c.fillStyle = '#ffffff'; c.lineWidth = 6; c.strokeStyle = '#140a24'; for (const [t, y] of [['GRAND', -88], ['THEFT', -64], ['AUTO', -40]]) { c.strokeText(t, -58, y); c.fillText(t, -58, y); }
  c.restore(); }
export function viceScreen(w = 512, h = 288) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d'); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const r = RNG(4); const sky = [...Array(70)].map(() => [r() * w, r() * h * .4, r() * 1.5 + .5]);
  const blds = [...Array(26)].map((_, i) => [i * w / 24 - 10 + r() * 8, 40 + r() * 90, 14 + r() * 18, ['#ff3a9a', '#3ae0ff', '#ffd23f', '#b86aff'][i % 4]]);
  function scene(T) { // cielo
    const g = c.createLinearGradient(0, 0, 0, h * .62); g.addColorStop(0, '#1a0a4a'); g.addColorStop(.45, '#c83a8a'); g.addColorStop(.8, '#ff8a4a'); g.addColorStop(1, '#ffd08a'); c.fillStyle = g; c.fillRect(0, 0, w, h * .62);
    for (const [x, y, s] of sky) { c.fillStyle = `rgba(255,255,255,${.3 + .3 * Math.sin(T * 3 + x)})`; c.fillRect(x, y, s, s); }
    // sol con franjas
    const sx = w * .62, sy = h * .5; const sg = c.createLinearGradient(0, sy - 60, 0, sy + 40); sg.addColorStop(0, '#fff27a'); sg.addColorStop(1, '#ff3a7a'); c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, 58, 0, 7); c.fill();
    c.fillStyle = '#d84a8a'; for (let k = 0; k < 5; k++) c.fillRect(sx - 60, sy + 4 + k * 9, 120, 3 + k);
    // rascacielos con ventanas de neón
    for (const [x, bh, bw, col] of blds) { const y = h * .62 - bh; c.fillStyle = '#1a1030'; c.fillRect(x, y, bw, bh); c.fillStyle = col; c.globalAlpha = .85; for (let yy = y + 6; yy < h * .6; yy += 7) for (let xx = x + 3; xx < x + bw - 3; xx += 5) if ((xx * 7 + yy * 3) % 11 > 4) c.fillRect(xx, yy, 2, 3); c.globalAlpha = 1; c.fillRect(x, y, bw, 2); }
    // mar con reflejos
    const sea = c.createLinearGradient(0, h * .62, 0, h); sea.addColorStop(0, '#ff6a8a'); sea.addColorStop(.3, '#4a2a8a'); sea.addColorStop(1, '#0a1a4a'); c.fillStyle = sea; c.fillRect(0, h * .62, w, h * .38);
    for (let k = 0; k < 14; k++) { c.fillStyle = `rgba(255,200,120,${.5 - k * .03})`; const yy = h * .64 + k * 7; c.fillRect(sx - 50 + Math.sin(T * 2 + k) * 8 + k * 2, yy, 100 - k * 5, 2); }
    // carretera de la costa con el deportivo
    c.fillStyle = '#2a1a3a'; c.fillRect(0, h * .78, w, h * .1); c.fillStyle = '#ffd23f'; for (let x = (-T * 160) % 40; x < w; x += 40) c.fillRect(x, h * .83, 20, 2);
    const cx = ((T * 70) % (w + 160)) - 80; c.fillStyle = '#ff2a6a'; c.beginPath(); c.moveTo(cx, h * .82); c.lineTo(cx + 18, h * .79); c.lineTo(cx + 52, h * .78); c.lineTo(cx + 72, h * .8); c.lineTo(cx + 78, h * .83); c.lineTo(cx, h * .84); c.fill(); c.fillStyle = '#7ad8ff'; c.fillRect(cx + 26, h * .785, 22, 6);
    c.fillStyle = '#0a0a12'; for (const xx of [cx + 14, cx + 62]) { c.beginPath(); c.arc(xx, h * .845, 6, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(255,240,180,.9)'; c.fillRect(cx + 76, h * .805, 6, 3);
    // palmeras
    for (const [px, ph, sc] of [[30, .95, 1.2], [100, .9, .9], [w - 70, .97, 1.3], [w - 20, .92, 1]]) { c.strokeStyle = '#140a20'; c.lineWidth = 7 * sc; c.beginPath(); c.moveTo(px, h * ph); c.quadraticCurveTo(px + 14 * sc, h * .6, px + 4 * sc, h * .38); c.stroke();
      c.fillStyle = '#140a20'; for (let k = 0; k < 7; k++) { const a = -2.9 + k * .48 + Math.sin(T * 1.5 + k) * .05; c.beginPath(); c.ellipse(px + 4 * sc + Math.cos(a) * 30 * sc, h * .38 + Math.sin(a) * 12 * sc + 8, 34 * sc, 7 * sc, a, 0, 7); c.fill(); } }
    // HUD del juego: minimapa, vida y dinero
    c.fillStyle = 'rgba(10,10,20,.55)'; c.beginPath(); c.arc(40, h - 40, 30, 0, 7); c.fill(); c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#ff4a9a'; c.beginPath(); c.moveTo(40, h - 50); c.lineTo(46, h - 34); c.lineTo(34, h - 34); c.fill();
    c.fillStyle = '#2ae06a'; c.fillRect(w - 128, 14, 110, 8); c.fillStyle = '#3ab8ff'; c.fillRect(w - 128, 26, 80, 5);
    c.font = `700 22px ${FONT}`; c.textAlign = 'right'; c.fillStyle = '#7aff8a'; c.strokeStyle = '#0a2a10'; c.lineWidth = 4; c.strokeText('$' + (1250000 + Math.floor(T * 9137) % 99999).toLocaleString('de-DE'), w - 16, 52); c.fillText('$' + (1250000 + Math.floor(T * 9137) % 99999).toLocaleString('de-DE'), w - 16, 52); }
  const o = { tex, mode: 'game', update(T, mode = o.mode) { o.mode = mode; scene(T);
      if (mode === 'logo' || mode === 'both') { c.fillStyle = mode === 'logo' ? 'rgba(20,6,40,.35)' : 'rgba(0,0,0,0)'; c.fillRect(0, 0, w, h); drawLogo(c, w, h, mode === 'logo' ? w / 2 : w * .23, mode === 'logo' ? h * .48 : h * .36, mode === 'logo' ? .95 : .55); }
      if (mode === 'pause') { c.fillStyle = 'rgba(10,10,30,.6)'; c.fillRect(0, 0, w, h); c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffffff'; c.fillText('PAUSE', w / 2, h / 2); }
      tex.needsUpdate = true; } };
  o.update(0); return o; }
export const logoTex = () => canvasTex(512, 320, (c, w, h) => { c.clearRect(0, 0, w, h); drawLogo(c, w, h, w / 2, h / 2 + 10, 1.05); }, false);

// pantalla (marco + imagen) que muestra una textura
export function screen(parent, w, h, tex, x = 0, y = 0, z = 0, ry = 0, frame = 0x101018) { const g = G(parent, x, y, z); g.rotation.y = ry; box(w + .5, h + .5, .4, mat(frame, { roughness: .4, metalness: .5 }), .08, g, 0, 0, -.22);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic(tex)); p.position.z = .01; g.add(p); g.userData.img = p; return g; }

// ---------- Zockerhalle (X): sala oscura de jugones con paredes de pantallas y tiras de neón ----------
// Suelo en y = 0; sala x ∈ [-30, 30], z ∈ [-22, 22]; muro de pantallas al fondo (z = -21,6) con la gran pantalla del logo en el centro;
// paredes laterales con pantallas; centro libre (barra de dominadas en (0, 0, -4)); filas de sillones gamer a ambos lados mirando +z.
export function zockerhalle(scene, X, vice) { const g = G(scene, X);
  const floorT = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#1a1430'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a2a6a'; c.lineWidth = 2; for (let k = 0; k <= w; k += 32) { c.beginPath(); c.moveTo(k, 0); c.lineTo(k, h); c.moveTo(0, k); c.lineTo(w, k); c.stroke(); } });
  box(64, .2, 48, mat(0xffffff, { map: rep(floorT, 16, 12), roughness: .35, metalness: .2 }), 0, g, 0, -.1, 0);
  const wallM = mat(0x221a3a, { roughness: .8 }); box(64, 18, .5, wallM, 0, g, 0, 9, -22.2); for (const s of [-1, 1]) box(.5, 18, 48, wallM, 0, g, s * 32, 9, 0); box(64, .4, 48, mat(0x14102a), 0, g, 0, 18, 0);
  // neón
  const neon = [glowM(0xff3a9a, 3), glowM(0x3ae0ff, 3), glowM(0xb86aff, 3)];
  box(62, .25, .25, neon[0], 0, g, 0, 17.2, -21.8); box(62, .25, .25, neon[1], 0, g, 0, .5, -21.8); for (const s of [-1, 1]) { box(.25, .25, 46, neon[s > 0 ? 1 : 0], 0, g, s * 31.6, 17.2, 0); box(.25, .25, 46, neon[2], 0, g, s * 31.6, .5, 0); }
  // gran pantalla central con el logo y muro de pantallas alrededor
  const BIG = screen(g, 22, 12.4, vice.tex, 0, 9.4, -21.5);
  const SCR = [BIG]; for (const [x, y] of [[-20, 12.6], [-20, 5.4], [20, 12.6], [20, 5.4], [-27.5, 9], [27.5, 9]]) SCR.push(screen(g, 6.6, 3.7 * 1.0, vice.tex, x, y, -21.5));
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) for (const y of [5.2, 11.6]) SCR.push(screen(g, 7.6, 4.3, vice.tex, s * 31.4, y, -14 + k * 10, -s * Math.PI / 2));
  // sillones gamer (asiento a y = 1,15) en filas a ambos lados del pasillo central, mirando +z; mesas bajas con bebidas
  const CH = []; const chM = [mat(0x1a1a24, { roughness: .5 }), mat(0xff3a9a, { roughness: .5 }), mat(0x3ae0ff, { roughness: .5 })];
  for (const s of [-1, 1]) for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) { const x = s * (8 + k * 6.2), z = -12 + r * 8.5; const c = G(g, x, 0, z);
    box(2.8, .5, 2.6, chM[0], .2, c, 0, .9, 0); box(2.8, 3.2, .5, chM[0], .2, c, 0, 2.6, -1.25); box(1.2, 3.2, .52, chM[1 + (k + r) % 2], .1, c, 0, 2.6, -1.24); cyl(.18, .18, .7, mat(0x8a8e9a, { metalness: .7 }), 8, c, 0, .35, 0); cyl(1.1, 1.1, .12, mat(0x2a2a34), 12, c, 0, .06, 0);
    for (const t of [-1, 1]) box(.4, .3, 2.2, chM[0], .1, c, t * 1.5, 1.7, 0); CH.push({ x: X + x, z, s }); }
  // barra de dominadas en el centro (travesaño a y = BAR_Y)
  const BAR_Y = 9.2, BAR = G(g, 0, 0, -4); for (const s of [-1, 1]) cyl(.22, .26, BAR_Y + .4, mat(0x2a2a34, { metalness: .6, roughness: .35 }), 10, BAR, s * 3.6, (BAR_Y + .4) / 2, 0);
  const tb = cyl(.14, .14, 7.6, mat(0xd8dce4, { metalness: .85, roughness: .2 }), 10, BAR, 0, BAR_Y, 0); tb.rotation.z = Math.PI / 2; for (const s of [-1, 1]) box(1.6, .2, 1.6, mat(0x2a2a34), .05, BAR, s * 3.6, .1, 0);
  const MAT_ = box(4, .12, 6, mat(0x2ab86a, { roughness: .9 }), .05, g, 0, .06, -2);
  // luces de colores
  const LP = new THREE.PointLight(0xff4aaa, 110, 70, 1.2); LP.position.set(-12, 14, 4); g.add(LP); const LC = new THREE.PointLight(0x4ad8ff, 110, 70, 1.2); LC.position.set(12, 14, 4); g.add(LC);
  const LW = new THREE.PointLight(0xfff0e0, 130, 60, 1.2); LW.position.set(0, 15, 10); g.add(LW);
  return { g: shade(g), SCR, BIG, CH, BAR, BAR_Y, LP, LC, LW }; }

// ---------- campo detrás de la iglesia (X): césped, muro de ladrillo con portería pintada, iglesia detrás, casas ----------
// Muro en z = -10 (cara en z = -9,6), x ∈ [-14, 14]; portería pintada centrada; iglesia en (0, -34); conos z ∈ [-2, 12].
export function kirchfeld(scene, X) { const g = G(scene, X);
  const grassT = canvasTex(128, 128, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#58b844' : '#4eae3a'; c.fillRect(0, i * h / 8, w, h / 8 + 1); } const r = RNG(2); for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(${r() < .5 ? '30,90,20' : '170,240,130'},.2)`; c.fillRect(r() * w, r() * h, 2, 3); } });
  box(400, .1, 400, mat(0xffffff, { map: rep(grassT, 40, 40), roughness: 1 }), 0, g, 0, -.05, 0);
  const brickT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#e8dcc8'; c.fillRect(0, 0, w, h); const r = RNG(9); for (let y = 0; y < 16; y++) for (let x = -1; x < 9; x++) { const v = r(); c.fillStyle = v < .3 ? '#b84a32' : v < .6 ? '#c8583a' : v < .85 ? '#a8402a' : '#d8704a'; c.fillRect(x * 32 + (y % 2) * 16 + 1, y * 16 + 1, 30, 14); } });
  const wall = box(30, 8, .8, mat(0xffffff, { map: rep(brickT, 5, 2), roughness: .9 }), .05, g, 0, 4, -10); box(30.6, .5, 1.2, mat(0xb8b0a0), .05, g, 0, 8.2, -10);
  // portería pintada en el muro y marcas de balonazos
  const pg = textPlane(10, 5, 400, 200, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = '#ffffff'; c.lineWidth = 12; c.strokeRect(10, 10, w - 20, h + 20); c.fillStyle = 'rgba(80,60,50,.35)'; const r = RNG(3); for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(40 + r() * (w - 80), 30 + r() * (h - 60), 6 + r() * 6, 0, 7); c.fill(); } }); pg.material.transparent = true; pg.position.set(0, 2.5, -9.58); g.add(pg);
  const tag = signBoard('700 / TAG', 4.2, 1.2, '#ffd23f', '#1a1a2a', '#1a1a2a'); tag.position.set(10, 6.2, -9.55); tag.rotation.z = .05; g.add(tag);
  // iglesia: nave y torre con reloj y aguja verde
  const ch = G(g, 0, 0, -36); const st = mat(0xffffff, { map: rep(noiseTex('#f0e8d8', ['#e0d8c4', '#fff4e4'], 900, 3, 1), 3, 3), roughness: .9 });
  box(16, 12, 26, st, .1, ch, 0, 6, 4); const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 11.6, 7, 4, 1), mat(0x8a3a2a, { roughness: .8 })); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 1.9); roof.position.set(0, 15.5, 4); ch.add(roof);
  box(8, 30, 8, st, .1, ch, 0, 15, -9); const sp = new THREE.Mesh(new THREE.ConeGeometry(5.8, 14, 4), mat(0x3a9a7a, { roughness: .6, metalness: .3 })); sp.rotation.y = Math.PI / 4; sp.position.set(0, 37, -9); ch.add(sp);
  cyl(.12, .12, 3, mat(0xffd23f, { metalness: .8 }), 6, ch, 0, 45.5, -9); box(1.6, .2, .2, mat(0xffd23f, { metalness: .8 }), .02, ch, 0, 46, -9);
  const clk = cyl(2.2, 2.2, .3, mat(0xffffff), 24, ch, 0, 24, -4.9); clk.rotation.x = Math.PI / 2; box(.2, 1.6, .1, mat(0x1a1a2a), .02, ch, 0, 24.6, -4.7); box(1.2, .2, .1, mat(0x1a1a2a), .02, ch, .5, 24, -4.7);
  for (const z of [-2, 4, 10]) for (const s of [-1, 1]) { box(.2, 5, 2.2, mat(0x5ab8e8, { roughness: .1, emissive: 0x2a4a8a, emissiveIntensity: .4 }), .05, ch, s * 8.05, 7, z); }
  box(4, 7, .3, mat(0x6a3a1a), .05, ch, 0, 3.5, 17.1);
  // casas de entramado y árboles alrededor
  for (let k = 0; k < 7; k++) { const s = k % 2 ? 1 : -1; house(g, s * (26 + (k % 3) * 2), -30 + k * 8, k + 3, s > 0 ? -Math.PI / 2 : Math.PI / 2); }
  for (let k = 0; k < 8; k++) tree(g, -18 + k * 5.2, -15 - (k % 2) * 2, .7);
  const CONES = []; for (let k = 0; k < 6; k++) { const c = G(g, (k % 2 ? 1.4 : -1.4), 0, 12 - k * 2.6); const cm = mat(0xff7a1a, { roughness: .5 }); const cone = new THREE.Mesh(new THREE.ConeGeometry(.45, 1.2, 12), cm); cone.position.y = .6; c.add(cone); box(1.1, .1, 1.1, cm, .02, c, 0, .05, 0); cyl(.3, .36, .2, mat(0xffffff), 12, c, 0, .6, 0); CONES.push(c); }
  return { g: shade(g), CONES, wall }; }

// ---------- tranvía amarillo vacío (largo en z, de -9 a 9) ----------
export function tram(parent) { const g = G(parent); const y = mat(0xffd23f, { roughness: .4 }), w = mat(0xf4f4f4, { roughness: .4 }), gl = mat(0x9ad8ff, { roughness: .05, metalness: .3, transparent: true, opacity: .2 });
  box(4.2, 1.6, 18, w, .3, g, 0, 1.4, 0); box(4.2, 3.4, 18, y, .3, g, 0, 3.9, 0); box(3.8, .3, 17.6, mat(0x8a8e9a), .1, g, 0, 5.75, 0);
  for (let k = 0; k < 6; k++) for (const s of [-1, 1]) { const p = box(.12, 2.2, 2.3, gl, .02, g, s * 2.11, 4, -7 + k * 2.8); p.castShadow = false; }
  for (const s of [-1, 1]) { const f = box(3.6, 2.4, .12, gl, .02, g, 0, 4.1, s * 9.02); f.castShadow = false; box(1.4, .5, .1, glowM(0xfff2c8, 2), .02, g, 0, 2.3, s * 9.06); }
  const sg = signBoard('3  Kirchplatz', 3.2, .7, '#1a1a1a', '#ffd23f', '#1a1a1a', 1); sg.position.set(0, 5.4, 9.08); g.add(sg);
  // asientos vacíos (se ven por las ventanas)
  for (let k = 0; k < 6; k++) for (const s of [-1, 1]) box(1.2, 1.4, 1.2, mat(0x2a6ad8, { roughness: .7 }), .1, g, s * 1.2, 3.1, -6.5 + k * 2.6);
  // pantógrafo y bogies
  const pa = box(.12, 2.4, .12, mat(0x2a2a2a), .02, g, 0, 7, 0); pa.rotation.x = .5; box(2, .1, .3, mat(0x2a2a2a), .02, g, 0, 8, .5);
  for (const z of [-6, 6]) box(3.6, .8, 3.4, mat(0x2a2a34), .1, g, 0, .5, z);
  return g; }
export function rails(parent, x, z0, z1) { const g = G(parent); for (const s of [-1, 1]) box(.25, .12, z0 - z1, mat(0xb8bcc8, { metalness: .8, roughness: .3 }), 0, g, x + s * 1.5, .1, (z0 + z1) / 2);
  for (let z = z1; z < z0; z += 2.5) box(4, .06, .5, mat(0x6a5a4a), 0, g, x, .05, z); // cable aéreo
  const c = cyl(.03, .03, z0 - z1, mat(0x2a2a2a), 4, g, x, 9, (z0 + z1) / 2); c.rotation.x = Math.PI / 2; return g; }

// ---------- mando de consola ----------
export function controller(parent, col = 0x1a1a24) { const g = G(parent); const m = mat(col, { roughness: .4 });
  box(1.2, .32, .6, m, .14, g, 0, 0, 0); for (const s of [-1, 1]) { const h = box(.42, .34, .7, m, .16, g, s * .5, -.06, -.12); h.rotation.x = .25; }
  for (const s of [-1, 1]) cyl(.1, .1, .1, mat(0x3a3a44), 8, g, s * .22, .2, .1);
  for (const [x, z, c] of [[.42, -.02, 0x2ab86a], [.52, .08, 0xd8323a], [.32, .08, 0x3a8aff], [.42, .18, 0xffd23f]]) cyl(.06, .06, .08, glowM(c, .6), 8, g, x, .2, z);
  box(.12, .06, .3, mat(0x3a3a44), .02, g, -.42, .2, .06); box(.3, .06, .12, mat(0x3a3a44), .02, g, -.42, .2, .06); box(.3, .04, .08, glowM(0x3ab8ff, 1.2), .02, g, 0, .18, -.25);
  return g; }

// ---------- tele de salón con mueble ----------
export function tv(parent, tex, x, z, ry = 0, w = 7) { const g = G(parent, x, 0, z); g.rotation.y = ry; box(w + 1, 1.8, 2, mat(0x6a4a2a, { roughness: .7 }), .1, g, 0, .9, 0); screen(g, w, w * .5625, tex, 0, 1.8 + w * .3, .2); cyl(.2, .3, .4, mat(0x1a1a1a), 8, g, 0, 1.95, 0);
  box(1.4, .4, 1, mat(0xf4f4f4), .1, g, w * .32, 2, .2); return g; }

// ---------- carta del reto ----------
export function letterBig(parent) { const p = textPlane(3.6, 4.6, 360, 460, (c, w, h) => { c.fillStyle = '#fbf6ea'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8323a'; c.lineWidth = 10; c.strokeRect(10, 10, w - 20, h - 20);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#d8323a'; c.font = `700 40px ${FONT}`; c.fillText('HERAUSFORDERUNG!', w / 2, 52);
  c.fillStyle = '#1a1a2a'; c.font = `700 24px ${FONT}`; c.fillText('VON: KICKELSDORF', w / 2, 104); c.font = `700 46px ${FONT}`; c.fillText('FUSSBALL', w / 2, 178); c.font = `700 64px ${FONT}`; c.fillText('11 gegen 11', w / 2, 250);
  c.fillStyle = '#1aa04a'; c.font = `700 26px ${FONT}`; c.fillText('GEWINNER BEKOMMT', w / 2, 330); c.fillText('EIN NEUES STADION', w / 2, 366); c.fillStyle = '#8a8a8a'; c.font = `700 22px ${FONT}`; c.fillText('Samstag, 15 Uhr', w / 2, 420); });
  p.material.side = THREE.DoubleSide; parent.add(p); return p; }

// ---------- autobús del equipo rival ----------
export function teamBus(parent) { const g = G(parent); const b = mat(0x2a6ad8, { roughness: .4 }), wh = mat(0xf4f4f4, { roughness: .4 }), gl = mat(0x1a2a3a, { roughness: .1, metalness: .5 });
  box(5, 5.2, 22, b, .4, g, 0, 3.4, 0); box(5.05, 1, 22, wh, .1, g, 0, 2.2, 0); for (let k = 0; k < 7; k++) for (const s of [-1, 1]) box(.1, 1.8, 2.4, gl, .02, g, s * 2.52, 4.4, -8.4 + k * 2.8);
  box(4.4, 2.4, .1, gl, .02, g, 0, 4.2, 11.02); const sg = signBoard('KICKELSDORF', 4.4, .8, '#1a1a1a', '#ffd23f', '#1a1a1a', 1); sg.position.set(0, 5.6, 11.06); g.add(sg);
  const sd = signBoard('FC KICKELSDORF', 12, 1.4, '#2a6ad8', '#ffffff', '#2a6ad8'); sd.position.set(2.56, 3.3, 0); sd.rotation.y = Math.PI / 2; g.add(sd);
  for (const z of [-7, 7]) for (const s of [-1, 1]) { const wl = cyl(1.1, 1.1, .7, mat(0x1a1a1a), 16, g, s * 2.4, 1.1, z); wl.rotation.z = Math.PI / 2; }
  const door = box(.12, 3.2, 2, gl, .02, g, 2.53, 2.8, 8.4); g.userData.door = door; return g; }

// ---------- salón (X): habitación 30 × 22 con sofá mirando a la tele (tele en z = -9, sofá en z = 3 mirando -z) ----------
// suelo y = 0; paredes x = ±15, z = -11 (tras la tele), z = 11 abierto (cámara); ventana a la izquierda; estantería, lámpara, pósters.
export function wohnzimmer(scene, X, tex, wallA = '#7ab8f4', wallB = '#6aa8e8', sofaC = 0xd8323a) { const g = G(scene, X);
  const wallM = mat(0xffffff, { map: rep(stripes(wallA, wallB, 10), 3, 1), roughness: .9 }); const plank = canvasTex(128, 128, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#b8844a' : '#a8743a'; c.fillRect(0, i * 16, w, 16); c.fillStyle = 'rgba(60,30,10,.4)'; c.fillRect(0, i * 16 + 15, w, 1); c.fillRect((i * 37) % w, i * 16, 1, 16); } });
  box(32, .2, 24, mat(0xffffff, { map: rep(plank, 4, 3), roughness: .7 }), 0, g, 0, -.1, 0); box(32, 14, .4, wallM, 0, g, 0, 7, -11.2); for (const s of [-1, 1]) box(.4, 14, 24, wallM, 0, g, s * 15.2, 7, 0); box(32, .3, 24, mat(0xf4f0e8), 0, g, 0, 14, 0);
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), mat(0xffffff, { map: rep(stripes('#5a4ab8', '#7a6ad8', 12, false), 1, 1), roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(0, .02, -2); g.add(rug);
  const TV = tv(g, tex, 0, -9.6, 0, 9);
  // sofá (asiento y = 1,6) mirando -z
  const SO = G(g, 0, 0, 3.2); const sm = mat(sofaC, { roughness: .9 }); box(10, 1.4, 3.6, sm, .4, SO, 0, .9, 0); box(10, 3, 1.2, sm, .4, SO, 0, 2.6, 1.6); for (const s of [-1, 1]) box(1.2, 2.2, 3.6, sm, .4, SO, s * 5.2, 1.6, 0); for (const s of [-1, 1]) { const c = box(2.4, 1.6, .6, mat(0xffd23f, { roughness: 1 }), .3, SO, s * 3, 2.6, .9); c.rotation.x = -.2; }
  box(5, .3, 2.4, mat(0x6a4a2a), .1, g, 0, 1.4, -2.6); for (const [x, z] of [[-2.2, -3.6], [2.2, -3.6], [-2.2, -1.6], [2.2, -1.6]]) cyl(.12, .12, 1.3, mat(0x4a3018), 6, g, x, .65, z);
  for (const [x, c] of [[-1, 0xd8323a], [1.2, 0x2a6ad8]]) cyl(.3, .26, .8, mat(c, { roughness: .3 }), 10, g, x, 1.95, -2.4);
  // ventana con cortinas a la izquierda (atardecer fuera)
  const win = textPlane(6, 5, 192, 160, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5ab0ff'); gr.addColorStop(1, '#ffd8a0'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#5aa84a'; c.fillRect(0, h * .75, w, h * .25); c.fillStyle = '#f4f4f4'; c.fillRect(w / 2 - 3, 0, 6, h); c.fillRect(0, h / 2 - 3, w, 6); }, .6);
  win.position.set(-14.95, 7.5, -2); win.rotation.y = Math.PI / 2; g.add(win); for (const z of [-5.6, 1.6]) box(.3, 7, 1.6, mat(0xff8ad0, { roughness: 1 }), .1, g, -14.7, 7.3, z);
  // estantería con libros y trofeos, lámpara de pie, pósters
  const sh = G(g, 11, 0, -9.6); box(5, 9, 1.6, mat(0x8a5a2a), .1, sh, 0, 4.5, 0); for (let r = 0; r < 4; r++) { box(4.6, .2, 1.4, mat(0x6a4018), 0, sh, 0, 1 + r * 2.2, .1); for (let k = 0; k < 7; k++) box(.45, 1.4 + (k % 3) * .2, 1, mat([0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0xb86aff][(k + r) % 5]), .03, sh, -1.9 + k * .62, 1.8 + r * 2.2, .2); }
  const lp = G(g, -11, 0, -8); cyl(.12, .12, 8, mat(0x2a2a2a), 6, lp, 0, 4, 0); cyl(.6, 1.2, 1.6, glowM(0xfff2c8, 1.2), 14, lp, 0, 8.4, 0); cyl(1, 1, .2, mat(0x2a2a2a), 12, lp, 0, .1, 0);
  const LL = new THREE.PointLight(0xffe8c8, 60, 30, 1.5); LL.position.set(-11, 8, -7); g.add(LL);
  return { g: shade(g), TV, SO, LL }; }

// ---------- Bäckerei (X): mostrador en z = 0 (panadero detrás en z = -3 mirando +z), estanterías de pan detrás, tele en la pared ----------
export function baeckerei(scene, X, tex) { const g = G(scene, X); const wall = mat(0xffffff, { map: rep(stripes('#fff0d8', '#f8e6c8', 10), 3, 1), roughness: .9 });
  const tileT = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#e8e0d0'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8b898'; c.fillRect(0, 0, w / 2, h / 2); c.fillRect(w / 2, h / 2, w / 2, h / 2); });
  box(34, .2, 26, mat(0xffffff, { map: rep(tileT, 10, 8), roughness: .6 }), 0, g, 0, -.1, 0); box(34, 15, .4, wall, 0, g, 0, 7.5, -12.2); for (const s of [-1, 1]) box(.4, 15, 26, wall, 0, g, s * 16.2, 7.5, 0); box(34, .3, 26, mat(0xf4f0e8), 0, g, 0, 15, 0);
  // mostrador con vitrina
  const wood = mat(0x8a5a2a, { roughness: .7 }); box(16, 2.4, 2.6, wood, .1, g, 0, 1.2, 0); box(16.2, .3, 2.8, mat(0xf4f0e8), .05, g, 0, 2.5, 0);
  const bread = [0xc8843a, 0xd89a4a, 0xb8702a, 0xe8b060]; for (let k = 0; k < 14; k++) { const b = sphere(.5, mat(bread[k % 4], { roughness: .8 }), g, -7 + k * .5 + (k > 6 ? 7 : 0), 2.95, (k % 2) * .6 - .3, 10, 8); b.scale.set(1.4, .7, .9); }
  for (let k = 0; k < 5; k++) { const p = new THREE.Mesh(new THREE.TorusGeometry(.42, .2, 8, 14), mat(0xb8702a, { roughness: .8 })); p.position.set(k < 3 ? -7 + k * 1.2 : 4.4 + (k - 3) * 1.2, 2.85, .5); p.rotation.x = Math.PI / 2; g.add(p); }
  // estanterías con pan detrás
  for (const s of [-1, 1]) { const sh = G(g, s * 9, 0, -11); box(10, 10, 1.8, wood, .1, sh, 0, 5, 0); for (let r = 0; r < 4; r++) { box(9.6, .2, 1.6, mat(0x6a4018), 0, sh, 0, 1.6 + r * 2.4, .2); for (let k = 0; k < 6; k++) { const b = sphere(.55, mat(bread[(k + r) % 4], { roughness: .8 }), sh, -3.8 + k * 1.5, 2.2 + r * 2.4, .4, 10, 8); b.scale.set(1.3, .75, .8); } } }
  const sg = signBoard('BÄCKEREI BERND', 9, 1.8, '#fff4e0', '#8a4a1a', '#8a4a1a'); sg.position.set(0, 13, -11.95); g.add(sg);
  const TVW = screen(g, 6, 3.4, tex, 0, 9, -11.6);
  const LB = new THREE.PointLight(0xfff0d8, 140, 50, 1.4); LB.position.set(0, 12, 4); g.add(LB);
  return { g: shade(g), TVW, LB }; }

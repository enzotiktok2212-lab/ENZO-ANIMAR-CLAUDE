// Gesichter — escenarios: la Stadt (calle empedrada de entramado, Bäckerei, jardín de Herr Brandt, Festhalle, Wasserturm),
// la Mauer en las montañas nevadas (piedra gris azulada con puerta de hierro y torres), y los interiores
// (Dachboden con la radio, Wohnzimmer a oscuras, Kunstraum, Festhalle con los ganchos, interior del Wasserturm, Funkhütte de Mama).
import { THREE, mat, box, cyl, sphere, canvasTex, textPlane, RNG } from './engine.js';
import { noiseTex, stripes, txt, tree } from './props.js';
import { tudor, lantern, cobbleTex, gold, glass, label, loaf } from './diam.js';
import { house } from './pech.js';
import { stoneTex } from './world.js';
import { radio, hungFace } from './gcast.js';

const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const shade = g => { g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; };
const plankT = (a = '#8a5a32', b = '#7a4c28') => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); const r = RNG(a.length); for (let y = 0; y < h; y += 16) { c.fillStyle = r() > .5 ? b : a; c.fillRect(0, y, w, 15); c.fillStyle = 'rgba(0,0,0,.28)'; c.fillRect(0, y + 15, w, 1); for (let k = 0; k < 3; k++) { c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.ellipse(r() * w, y + 8, 6, 2, 0, 0, 7); c.fill(); } } }, true);
const wallpaper = (a, b) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let x = 8; x < w; x += 32) for (let y = 8; y < h; y += 32) { c.beginPath(); c.moveTo(x, y - 8); c.lineTo(x + 6, y); c.lineTo(x, y + 8); c.lineTo(x - 6, y); c.fill(); } c.fillStyle = 'rgba(0,0,0,.05)'; for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 1, h); }, true);
const rustT = () => canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#7a4a2a'; c.fillRect(0, 0, w, h); const r = RNG(9); for (let k = 0; k < 900; k++) { c.fillStyle = ['rgba(140,70,30,.5)', 'rgba(90,50,30,.5)', 'rgba(170,100,50,.4)', 'rgba(60,40,30,.4)'][k % 4]; c.beginPath(); c.arc(r() * w, r() * h, 1 + r() * 7, 0, 7); c.fill(); }
  c.strokeStyle = 'rgba(40,25,15,.6)'; c.lineWidth = 3; for (let y = 0; y < h; y += 64) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); for (let x = 8; x < w; x += 24) { c.fillStyle = 'rgba(50,30,20,.8)'; c.beginPath(); c.arc(x, y + 5, 3, 0, 7); c.fill(); } } }, true);
function room(scene, X, w, d, h, wallM, floorM, ceil = null) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorM); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(w, h, .6, wallM, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.6, h, d, wallM, 0, g, s * w / 2, h / 2, 0); box(w, h, .6, wallM, 0, g, 0, h / 2, d / 2);
  if (ceil) box(w, .6, d, ceil, 0, g, 0, h, 0); return g; }
export const sign = (w, h, text, bg, fg, size = 64) => label(w, h, text, bg, fg, size, .35);

// ---------- la Stadt ----------
export function stadt(scene) { const G = new THREE.Group(); scene.add(G);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), mat(0xffffff, { roughness: 1, map: noiseTex('#6aa84a', ['#5a9a3c', '#78b858', '#4f8a34'], 2400, 2, 200) })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; G.add(gr);
  const ct = cobbleTex(); ct.repeat.set(5, 70); const road = new THREE.Mesh(new THREE.PlaneGeometry(22, 320), mat(0xffffff, { roughness: .85, map: ct })); road.rotation.x = -Math.PI / 2; road.position.set(0, .06, -100); road.receiveShadow = true; G.add(road);
  for (const s of [-1, 1]) box(4, .35, 320, mat(0xb8b0a4, { roughness: .9 }), .05, G, s * 13, .18, -100);
  const houses = []; let i = 0; for (let z = 50; z > -170; z -= 16) for (const s of [-1, 1]) { if (s < 0 && z === 2) { i++; continue; } houses.push(tudor(G, s * 22, z, i, s > 0 ? -Math.PI / 2 : Math.PI / 2, 14, 16 + (i * 5) % 9)); i++; }
  const lamps = []; for (let z = 44; z > -170; z -= 24) for (const s of [-1, 1]) lamps.push(lantern(G, s * 11.6, z));
  // Bäckerei (izquierda, z = 2): escaparate con panes, toldo, letrero
  const BK = new THREE.Group(); BK.position.set(-22, 0, 2); BK.rotation.y = Math.PI / 2; G.add(BK);
  box(14, 16, 12, mat(0xf4e2c0, { roughness: .9 }), .05, BK, 0, 8, -6); const br = new THREE.Mesh(new THREE.CylinderGeometry(.01, 11, 8, 4, 1, false, Math.PI / 4), mat(0x8a3a2a, { roughness: .8 })); br.scale.set(1, 1, .85); br.position.set(0, 20, -6); BK.add(br);
  box(10, 4.4, .25, glass(), .03, BK, -1, 3, .05); box(10.6, .4, .8, mat(0x5a3a22), .05, BK, -1, .8, .3); for (let k = 0; k < 6; k++) { const l = loaf(BK); l.position.set(-5 + k * 1.8, 1.4, -.4); l.scale.setScalar(.75); }
  const aw = new THREE.Mesh(new THREE.BoxGeometry(11, .2, 2.6), mat(0xffffff, { map: stripes('#c8781e', '#f8ecd2', 10) })); aw.position.set(-1, 5.8, 1.2); aw.rotation.x = .35; BK.add(aw);
  const bs = sign(8, 1.5, 'BÄCKEREI', '#3a2214', '#ffd88a', 70); bs.position.set(-1, 7.6, .2); BK.add(bs); const bd = box(2.6, 4.6, .3, mat(0x2a5a3a), .06, BK, 5.2, 2.3, .1);
  const pretzel = new THREE.Mesh(new THREE.TorusKnotGeometry(.6, .18, 48, 8, 2, 3), mat(0xc8782e, { roughness: .6, emissive: 0x3a1a00, emissiveIntensity: .2 })); pretzel.position.set(6.4, 8, 1.6); BK.add(pretzel);
  const since = sign(4, .9, 'SEIT 2004', '#f8ecd2', '#3a2214', 60); since.position.set(-1, 6.6, .25); BK.add(since);
  // Vorstadt: casas con jardín (la de Herr Brandt con la tierra pelada)
  const VS = new THREE.Group(); VS.position.set(200, 0, 0); G.add(VS);
  const asphalt = noiseTex('#4a5060', ['#404656', '#545a6a'], 2000, 2, 1); asphalt.repeat.set(2, 30); const rd = new THREE.Mesh(new THREE.PlaneGeometry(14, 200), mat(0xffffff, { roughness: .9, map: asphalt })); rd.rotation.x = -Math.PI / 2; rd.position.set(0, .07, -40); VS.add(rd);
  for (const s of [-1, 1]) box(4, .3, 200, mat(0xd8d4cc), .05, VS, s * 9, .15, -40);
  const vh = []; let ci = 0; for (let z = 30; z > -110; z -= 24) for (const s of [-1, 1]) { vh.push(house(VS, s * 25, z, ci++, s > 0 ? -Math.PI / 2 : Math.PI / 2)); tree(VS, s * 13, z - 11, .9); }
  const dirt = new THREE.Mesh(new THREE.PlaneGeometry(18, 8.4), mat(0xffffff, { roughness: 1, map: noiseTex('#6a4a2e', ['#5a3c24', '#7a5638', '#4a3020'], 1600, 3, 2) })); dirt.rotation.x = -Math.PI / 2; dirt.rotation.z = -Math.PI / 2; dirt.position.set(-15.4, .09, 30); VS.add(dirt);
  // Festhalle: fachada grande con columnas y letrero
  const FH = new THREE.Group(); FH.position.set(0, 0, -200); G.add(FH); const fs = mat(0xe8d8c0, { roughness: .8 });
  box(50, 26, 24, fs, .1, FH, 0, 13, 0); const fr = new THREE.Mesh(new THREE.CylinderGeometry(.01, 38, 14, 4, 1, false, Math.PI / 4), mat(0x6a2a22)); fr.scale.set(1, 1, .5); fr.position.set(0, 33, 0); FH.add(fr);
  for (let k = -3; k <= 3; k++) cyl(1, 1.1, 18, mat(0xf4ece0), 16, FH, k * 6, 9, 13.5); box(46, 2, 3, fs, .1, FH, 0, 19, 13.5); const fsg = sign(20, 3, 'FESTHALLE', '#5a1a1a', '#ffd88a', 80); fsg.position.set(0, 22, 12.2); FH.add(fsg);
  box(8, 13, .4, mat(0x4a2a1a), .1, FH, 0, 6.5, 12.1); for (let k = 0; k < 6; k++) box(5, .6, 6, mat(0xd8d0c4), .05, FH, 0, .3 + k * .02, 17 - k * .5);
  // Wasserturm (lejos a la derecha)
  const WT = new THREE.Group(); WT.position.set(70, 0, -120); G.add(WT); const tm = mat(0x8a5a3a, { roughness: .6, map: rep(rustT(), 2, 1) }), lg = mat(0x5a3a2a, { metalness: .4, roughness: .6 });
  for (const [x, z] of [[-7, -7], [7, -7], [-7, 7], [7, 7]]) { const l = cyl(.6, .8, 40, lg, 8, WT, x * .8, 20, z * .8); l.rotation.set(z * -.01, 0, x * .01); }
  for (const y of [10, 24]) for (const r of [0, 1, 2, 3]) { const b = box(11.5, .4, .4, lg, 0, WT, 0, y, 0); b.rotation.y = r * Math.PI / 2; b.position.x = [0, 5.6, 0, -5.6][r]; b.position.z = [5.6, 0, -5.6, 0][r]; }
  cyl(10, 10, 14, tm, 28, WT, 0, 47, 0); const wtop = new THREE.Mesh(new THREE.ConeGeometry(11, 6, 28), tm); wtop.position.y = 57; WT.add(wtop); box(1, 30, .6, lg, 0, WT, 8, 25, 6);
  // montañas nevadas en el horizonte
  const r = RNG(31); for (let k = 0; k < 18; k++) { const h = 180 + r() * 140, m = new THREE.Group(); m.position.set(-700 + k * 85, 0, -800 - r() * 200); G.add(m); const base = new THREE.Mesh(new THREE.ConeGeometry(110 + r() * 60, h, 7), mat(k % 2 ? 0x6a7a92 : 0x7a8aa2, { roughness: 1, flatShading: true })); base.position.y = h / 2 - 20; m.add(base);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(40 + r() * 10, h * .32, 7), mat(0xf4f8ff, { roughness: .9, flatShading: true })); cap.position.y = h - 20 - h * .16 + 2; m.add(cap); }
  for (let k = 0; k < 40; k++) tree(G, (k % 2 ? 1 : -1) * (40 + (k * 13) % 60), 60 - k * 8, 1 + (k % 3) * .3);
  // nieve (invierno): suelo blanco, gorros en tejados, copos
  const SNOW = new THREE.Group(); G.add(SNOW); const sg = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0xf4f8ff, { roughness: .9 })); sg.rotation.x = -Math.PI / 2; sg.position.set(0, .12, -100); SNOW.add(sg);
  for (const h of houses) { const c = box(15, .8, 13, mat(0xf8fbff), .3, SNOW, 0, 0, 0); h.updateMatrixWorld(); const p = new THREE.Vector3(0, 22, -5.8).applyMatrix4(h.matrixWorld); c.position.copy(p); c.rotation.y = h.rotation.y; }
  const flakes = []; const fm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9 }); for (let k = 0; k < 260; k++) { const f = new THREE.Mesh(new THREE.SphereGeometry(.12, 5, 4), fm); SNOW.add(f); flakes.push(f); }
  SNOW.visible = false;
  shade(G); return { G, houses, lamps, BK, VS, vh, dirt, FH, WT, SNOW, flakes };
}
export function snowFall(S, cx, cy, cz, T, sp = 30) { S.flakes.forEach((f, i) => { const ph = (T * .12 + i * .0618) % 1; f.position.set(cx + Math.sin(i * 7.1) * sp + Math.sin(T + i) * .6, cy + 22 - ph * 26, cz + Math.cos(i * 3.3) * sp); }); }

// ---------- la Mauer en las montañas (X = 3000) ----------
export function mauer(scene, X = 3000) { const g = new THREE.Group(); g.position.x = X; scene.add(g);
  const sn = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), mat(0xffffff, { roughness: 1, map: noiseTex('#e8eef8', ['#dfe6f2', '#f4f8ff', '#d0d8e6'], 2400, 3, 80) })); sn.rotation.x = -Math.PI / 2; g.add(sn);
  const st = mat(0xffffff, { roughness: .9, map: stoneTex(40, 6) }), dk = mat(0x3a424c, { roughness: .9 }); const Hh = 46, Z = -60;
  const W = new THREE.Group(); W.position.z = Z; g.add(W);
  for (const seg of [[-300, -11], [11, 300]]) box(seg[1] - seg[0], Hh, 14, st, 0, W, (seg[0] + seg[1]) / 2, Hh / 2, 0); box(22, Hh - 22, 14, st, 0, W, 0, 22 + (Hh - 22) / 2, 0);
  for (let x = -295; x <= 295; x += 5) box(3, 3, 2.4, st, .1, W, x, Hh + 1.5, 5.6); box(600, 1.2, 15, dk, .05, W, 0, Hh + .6, 0);
  for (let x = -280; x <= 280; x += 28) { if (Math.abs(x) < 20) continue; box(5, Hh, 3, mat(0xffffff, { map: stoneTex(2, 8, 3) }), .1, W, x, Hh / 2, 8); }
  // puerta de hierro remachada (dos hojas) bajo arco
  const arch = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 14.4, 32, 1, false, 0, Math.PI), st); arch.rotation.set(Math.PI / 2, 0, Math.PI / 2); arch.position.set(0, 12, 0); W.add(arch);
  const iron = mat(0x2a2e34, { metalness: .75, roughness: .4 }); const doors = [];
  for (const s of [-1, 1]) { const d = new THREE.Group(); d.position.set(s * 11, 0, 7.4); W.add(d); box(11, 22, 1, iron, .05, d, -s * 5.5, 11, 0); for (let k = 0; k < 7; k++) box(11, .5, .4, mat(0x1a1c20, { metalness: .8 }), .05, d, -s * 5.5, 1.5 + k * 3.2, .6);
    for (let k = 0; k < 7; k++) for (let j = 0; j < 4; j++) sphere(.18, mat(0x8a8e94, { metalness: .9, roughness: .3 }), d, -s * (1.2 + j * 2.8), 1.5 + k * 3.2, .85, 6, 4); doors.push(d); }
  // torres redondas con tejado cónico azul
  for (const x of [-60, 60]) { const t = new THREE.Group(); t.position.set(x, 0, Z); g.add(t); cyl(9, 10, Hh + 16, st, 24, t, 0, (Hh + 16) / 2, 0); const rf = new THREE.Mesh(new THREE.ConeGeometry(11, 14, 24), mat(0x2a4a7a, { roughness: .6 })); rf.position.y = Hh + 23; t.add(rf);
    for (let k = 0; k < 4; k++) { const w = box(1.4, 3, .3, mat(0x1a1a1a), .05, t, 0, Hh - 6 - k * 9, 0); w.position.x = Math.sin(k) * 0; w.position.z = 9.6; }
    const fl = textPlane(4, 6, 120, 180, (c, w, h) => { c.fillStyle = '#2a4a7a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f4f4f4'; c.beginPath(); c.arc(w / 2, h * .45, 34, 0, 7); c.fill(); c.fillStyle = '#2a4a7a'; c.beginPath(); c.arc(w / 2, h * .45, 22, 0, 7); c.fill(); c.fillStyle = '#e9c23a'; c.fillRect(0, h - 16, w, 16); }); fl.position.set(3, Hh + 34, 0); t.add(fl); cyl(.15, .15, 8, mat(0x1a1a1a), 6, t, 0, Hh + 32, 0); }
  // centinelas con faroles en lo alto
  for (const x of [-30, 30]) { const l = lantern(W, x, 4); l.position.y = Hh; l.scale.setScalar(.6); }
  // montañas detrás y a los lados
  const r = RNG(52); for (let k = 0; k < 16; k++) { const h = 160 + r() * 160, m = new THREE.Group(); m.position.set(-600 + k * 80, 0, -300 - r() * 260); g.add(m);
    const b = new THREE.Mesh(new THREE.ConeGeometry(100 + r() * 60, h, 7), mat(k % 2 ? 0x8a96aa : 0x9aa6ba, { roughness: 1, flatShading: true })); b.position.y = h / 2 - 10; m.add(b); const c = new THREE.Mesh(new THREE.ConeGeometry(45, h * .35, 7), mat(0xffffff, { roughness: .9, flatShading: true })); c.position.y = h - 10 - h * .175 + 2; m.add(c); }
  for (let k = 0; k < 50; k++) { const t = tree(g, (k % 2 ? 1 : -1) * (60 + r() * 250), -30 + r() * 120, 1.3 + r()); t.traverse(o => { if (o.isMesh && o.geometry.type === 'ConeGeometry') o.material = mat(0x2a5a3a, { roughness: 1 }); }); }
  // Funkhütte de Mama junto a la puerta (exterior)
  const hut = new THREE.Group(); hut.position.set(-26, 0, Z + 18); g.add(hut); box(10, 7, 9, mat(0xffffff, { map: stoneTex(3, 2, 9) }), .1, hut, 0, 3.5, 0); const hr = new THREE.Mesh(new THREE.CylinderGeometry(.01, 8, 4, 4, 1, false, Math.PI / 4), mat(0x5a3a22)); hr.position.y = 9; hut.add(hr);
  box(2.6, 2, .2, mat(0xffd88a, { emissive: 0xffb050, emissiveIntensity: .8 }), .05, hut, 2, 4, 4.6); const ant = cyl(.12, .15, 14, mat(0x9aa0a8, { metalness: .8 }), 6, hut, -3, 14, -2); for (let k = 0; k < 4; k++) cyl(.04, .04, 3 - k * .5, mat(0x9aa0a8, { metalness: .8 }), 4, hut, -3, 18 - k * 2, -2).rotation.z = Math.PI / 2;
  shade(g); return { g, W, doors, hut, Z, Hh };
}

// ---------- interiores ----------
export function dachboden(scene, X) {   // desván: vigas inclinadas, ventana redonda con luna, mesa con la radio, vela, cajas, ropa colgada
  const pl = mat(0xffffff, { map: rep(plankT('#8a5a32', '#7a4c28'), 4, 4) }); const g = room(scene, X, 30, 30, 16, mat(0xffffff, { map: rep(plankT('#6a4426', '#5a3a1e'), 6, 3) }), pl);
  const bm = mat(0x4a2e18, { roughness: .8 }); for (let z = -12; z <= 12; z += 6) for (const s of [-1, 1]) { const b = box(1, 20, 1, bm, .05, g, s * 7, 10, z); b.rotation.z = s * .78; } box(1.2, 1.2, 30, bm, .05, g, 0, 15.5, 0);
  const win = new THREE.Mesh(new THREE.CircleGeometry(2.6, 32), mat(0x1a2a5a, { emissive: 0x2a3a7a, emissiveIntensity: .8 })); win.position.set(0, 8, -14.6); g.add(win); const fr = new THREE.Mesh(new THREE.TorusGeometry(2.6, .25, 8, 32), bm); fr.position.copy(win.position); g.add(fr); box(5.2, .2, .2, bm, 0, g, 0, 8, -14.5); box(.2, 5.2, .2, bm, 0, g, 0, 8, -14.5);
  const moon = sphere(.6, new THREE.MeshBasicMaterial({ color: 0xfff4d0, toneMapped: false }), g, .9, 8.8, -14.7, 16, 12);
  const desk = new THREE.Group(); desk.position.set(0, 0, -9); g.add(desk); box(8, .4, 3.4, mat(0x6a4426, { map: plankT('#7a5030', '#6a4426') }), .05, desk, 0, 3.2, 0); for (const [x, z] of [[-3.6, -1.4], [3.6, -1.4], [-3.6, 1.4], [3.6, 1.4]]) box(.35, 3.2, .35, bm, .05, desk, x, 1.6, z);
  const R = radio(desk, 1.5); R.position.set(-1.2, 4.1, 0); const candle = new THREE.Group(); candle.position.set(2.4, 3.4, .5); desk.add(candle); cyl(.22, .22, 1, mat(0xf4ead8), 12, candle, 0, .5, 0); const fl = sphere(.14, new THREE.MeshBasicMaterial({ color: 0xffc040, toneMapped: false }), candle, 0, 1.2, 0, 8, 6); fl.scale.y = 1.6;
  const cl = new THREE.PointLight(0xffa040, 30, 20, 1.5); cl.position.set(2.4, 5, -8.5); g.add(cl); const notes = textPlane(1.6, 1.1, 160, 110, (c, w, h) => { c.fillStyle = '#f4ead2'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a2a1a'; for (let y = 16; y < h; y += 14) c.fillRect(10, y, w - 20 - (y % 3) * 10, 3); }); notes.rotation.x = -Math.PI / 2; notes.position.set(1, 3.42, .8); desk.add(notes);
  for (let k = 0; k < 6; k++) box(2 + (k % 3), 1.6 + (k % 2), 2, mat([0x9a7a4a, 0x8a6a3a, 0xa8865a][k % 3], { roughness: 1 }), .08, g, -11 + (k % 3) * 3, .8 + Math.floor(k / 3) * 1.8, 8 - (k % 2) * 3);
  const rope = cyl(.04, .04, 16, mat(0x8a7a5a), 4, g, 9, 9, 4); rope.rotation.x = Math.PI / 2; for (let k = 0; k < 3; k++) box(1.6, 2, .1, mat([0xd8323a, 0x2a6ad8, 0xf2c23a][k], { roughness: 1 }), .05, g, 9, 7.8, -1 + k * 2.6);
  shade(g); return { g, radio: R, candle: fl, light: cl };
}
export function funkhuette(scene, X) {   // interior de la caseta de Mama: piedra, mapa de la muralla, radio grande de válvulas, estufa, foto
  const g = room(scene, X, 26, 22, 14, mat(0xffffff, { map: stoneTex(4, 2, 12) }), mat(0xffffff, { map: rep(plankT('#6a4a2e', '#5a3c24'), 4, 4) }));
  const desk = box(12, .5, 4, mat(0x5a3a22), .05, g, 0, 3.4, -8.5); for (const x of [-5.6, 5.6]) box(.4, 3.4, 3.6, mat(0x4a2e18), .05, g, x, 1.7, -8.5);
  const big = new THREE.Group(); big.position.set(-2, 3.6, -9.6); g.add(big); box(6, 3.6, 2, mat(0x3a4a3a, { roughness: .5 }), .15, big, 0, 1.8, 0); for (let k = 0; k < 4; k++) { const d = cyl(.35, .35, .2, mat(0xe8dcc0), 16, big, -2 + k * 1.3, 1.2, 1.05); d.rotation.x = Math.PI / 2; }
  const scope = box(2.2, 1.2, .1, new THREE.MeshBasicMaterial({ color: 0x3aff8a, toneMapped: false }), .05, big, 0, 2.6, 1.02); const mic = cyl(.2, .25, 1.2, mat(0x8a8e94, { metalness: .8 }), 12, g, 2.5, 4.3, -8.2);
  const map = textPlane(7, 4.5, 560, 360, (c, w, h) => { c.fillStyle = '#e8dcc0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#6a4a2a'; c.lineWidth = 6; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = '#8a96aa'; for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(40 + k * 90, 140); c.lineTo(85 + k * 90, 40); c.lineTo(130 + k * 90, 140); c.fill(); }
    c.fillStyle = '#5a5a62'; c.fillRect(30, 150, w - 60, 18); txt(c, 'MAUER', w / 2, 200, 40, '#3a2a1a'); c.strokeStyle = '#d8323a'; c.setLineDash([10, 8]); c.lineWidth = 5; c.beginPath(); c.moveTo(w / 2, 170); c.quadraticCurveTo(w * .7, 260, w * .55, h - 40); c.stroke(); c.setLineDash([]); c.fillStyle = '#d8323a'; c.beginPath(); c.arc(w * .55, h - 40, 10, 0, 7); c.fill(); txt(c, 'STADT', w * .55, h - 70, 34, '#3a2a1a'); });
  map.position.set(6, 9, -10.6); g.add(map); const photo = textPlane(1.6, 2, 160, 200, (c, w, h) => { c.fillStyle = '#f4f0e6'; c.fillRect(0, 0, w, h); c.fillStyle = '#b8c8d8'; c.fillRect(12, 12, w - 24, h - 50); c.fillStyle = '#3a2214'; c.beginPath(); c.arc(w / 2, 80, 26, 0, 7); c.fill(); c.fillStyle = '#d9a47a'; c.beginPath(); c.arc(w / 2, 90, 20, 0, 7); c.fill(); c.fillStyle = '#2f6a3e'; c.fillRect(w / 2 - 28, 110, 56, 40); }); photo.position.set(-8, 7, -10.6); g.add(photo);
  const stove = cyl(1.4, 1.6, 4, mat(0x2a2a2e, { metalness: .5 }), 16, g, 10, 2, 4); const fire = sphere(.6, new THREE.MeshBasicMaterial({ color: 0xff7a20, toneMapped: false }), g, 10, 1.5, 5.5, 10, 8); cyl(.4, .4, 10, mat(0x2a2a2e), 8, g, 10, 9, 4);
  const lt = new THREE.PointLight(0xffb060, 26, 30, 1.4); lt.position.set(0, 9, -4); g.add(lt);
  shade(g); return { g, scope };
}
export function wohnzimmer(scene, X) {   // salón a oscuras: sofá, lámpara apagada, cuadros, ventana azul de luna; la gente de pie mirando a la pared
  const g = room(scene, X, 34, 26, 14, mat(0xffffff, { map: rep(wallpaper('#3a4a6a', '#2e3c58'), 6, 3) }), mat(0xffffff, { map: rep(plankT('#5a3c24', '#4a3020'), 5, 4) }));
  box(34, 1.2, .3, mat(0x2a2030), .05, g, 0, .6, -12.6); const sofa = new THREE.Group(); sofa.position.set(-6, 0, 6); g.add(sofa); const sm = mat(0x6a3a4a, { roughness: .9 }); box(9, 1.6, 3.6, sm, .3, sofa, 0, 1.4, 0); box(9, 3, 1, sm, .3, sofa, 0, 2.6, 1.4); for (const s of [-1, 1]) box(1, 2.4, 3.6, sm, .3, sofa, s * 4.5, 1.8, 0);
  for (const [x, c] of [[-9, '#c8a46a'], [0, '#6a8aa8'], [9, '#8aa86a']]) { const p = textPlane(3.4, 4, 170, 200, (cx, w, h) => { cx.fillStyle = '#4a2e18'; cx.fillRect(0, 0, w, h); cx.fillStyle = c; cx.fillRect(14, 14, w - 28, h - 28); cx.fillStyle = 'rgba(0,0,0,.25)'; cx.beginPath(); cx.arc(w / 2, h / 2, 30, 0, 7); cx.fill(); }); p.position.set(x, 8, -12.6); g.add(p); }
  const win = box(5, 6, .2, mat(0x4a6ab8, { emissive: 0x3a5aa8, emissiveIntensity: 1.1 }), .05, g, 16.6, 7, 0); win.rotation.y = Math.PI / 2; for (const y of [7]) box(.3, 6, .3, mat(0x2a2030), 0, g, 16.5, y, 0);
  const moonL = new THREE.SpotLight(0x8aa8ff, 120, 60, .7, .6, 1.2); moonL.position.set(15, 10, 0); moonL.target.position.set(-4, 0, -6); g.add(moonL, moonL.target);
  const lampS = cyl(.15, .15, 7, mat(0x2a2a2e), 8, g, 12, 3.5, -9); const shadeL = cyl(.8, 1.4, 1.6, mat(0xd8c8a8), 16, g, 12, 7.6, -9);
  const clock = cyl(1.2, 1.2, .2, mat(0xf4ead8), 24, g, -14, 10, -12.5); clock.rotation.x = Math.PI / 2; const hand = box(.1, .9, .05, mat(0x1a1a1a), 0, g, -14, 10.4, -12.3);
  shade(g); return { g, clock };
}
export function kunstraum(scene, X) {   // aula de arte: pupitres con tableros de pintura, caballetes, tarros de agua con pincel, pizarra con "KUNST", dibujos en la pared
  const g = room(scene, X, 40, 30, 16, mat(0xffffff, { map: rep(stripes('#f2e6c8', '#e8dab8', 10), 6, 1) }), mat(0xffffff, { map: rep(plankT('#a8784a', '#98683a'), 5, 5) }));
  const bb = textPlane(16, 6, 640, 240, (c, w, h) => { c.fillStyle = '#2a4a3a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a5a2a'; c.lineWidth = 18; c.strokeRect(0, 0, w, h); txt(c, 'KUNST', w / 2, 80, 70, '#f4f4f4'); txt(c, 'Thema: Meine Familie', w / 2, 170, 44, '#ffd23f'); }, .15); bb.position.set(0, 9.5, -14.6); g.add(bb);
  for (let k = 0; k < 8; k++) { const d = textPlane(2.4, 2, 120, 100, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); const r = RNG(k + 4); for (let i = 0; i < 6; i++) { c.fillStyle = ['#d8323a', '#2a7ad8', '#ffd23f', '#2ec46a', '#9b5de5', '#ff8a23'][i]; c.beginPath(); c.arc(r() * w, r() * h, 10 + r() * 18, 0, 7); c.fill(); } }); d.position.set(-19.6, 6 + (k % 2) * 3, -10 + Math.floor(k / 2) * 5); d.rotation.y = Math.PI / 2; g.add(d); }
  const desks = []; for (let row = 0; row < 2; row++) for (let col = -1; col <= 1; col++) { const dk = new THREE.Group(); dk.position.set(col * 11, 0, -3 + row * 8); g.add(dk); box(7, .35, 3.2, mat(0xc8a070), .05, dk, 0, 3.4, 0); for (const [x, z] of [[-3.2, -1.3], [3.2, -1.3], [-3.2, 1.3], [3.2, 1.3]]) box(.25, 3.4, .25, mat(0x6a6a72, { metalness: .5 }), .02, dk, x, 1.7, z);
    const pap = box(2.2, .05, 1.6, mat(0xffffff), .01, dk, -1.4, 3.6, 0); const jar = cyl(.35, .35, .9, mat(0xbfe8ff, { transparent: true, opacity: .55, roughness: .05 }), 16, dk, 1.6, 4.05, 0); const water = cyl(.3, .3, .55, mat([0x5a8ad8, 0x7ab84a, 0xd85a9a][(row + col + 3) % 3], { transparent: true, opacity: .8 }), 16, dk, 1.6, 3.9, 0);
    const brush = cyl(.04, .04, 1.4, mat(0xd8a03a), 6, dk, 1.7, 4.5, 0); brush.rotation.z = .3; for (let i = 0; i < 5; i++) sphere(.12, mat(['#d8323a', '#2a7ad8', '#ffd23f', '#2ec46a', '#9b5de5'].map(s => parseInt(s.slice(1), 16))[i]), dk, -.4 + i * .25, 3.63, .9, 8, 6); desks.push({ dk, jar, water }); }
  for (const x of [-14, 14]) { const e = new THREE.Group(); e.position.set(x, 0, -10); g.add(e); for (const s of [-1, 1]) { const l = box(.2, 8, .2, mat(0x8a5a32), .02, e, s * 1.2, 4, 0); l.rotation.z = s * -.12; } const cv = box(3.4, 2.6, .1, mat(0xffffff), .02, e, 0, 6, .2); }
  for (const x of [-10, 10]) { const w = box(5, 6, .2, mat(0xbfe8ff, { emissive: 0x8ac8ff, emissiveIntensity: .5 }), .05, g, 19.7, 8, x); w.rotation.y = Math.PI / 2; }
  shade(g); return { g, desks };
}
export function halle(scene, X) {   // Festhalle por dentro: suelo de parqué, mesas largas con velas, lámparas de araña, escenario con cortina roja,
  // y la pared de ganchos con las caras colgadas (como abrigos en un guardarropa)
  const g = room(scene, X, 60, 56, 26, mat(0xffffff, { map: rep(wallpaper('#7a2a2a', '#6a2222'), 8, 3) }), mat(0xffffff, { map: rep(plankT('#a8683a', '#8a542e'), 8, 8) }), mat(0x3a1a12));
  box(60, 4, .4, mat(0x4a2a1a), .05, g, 0, 2, -27.6); for (const s of [-1, 1]) box(.4, 4, 56, mat(0x4a2a1a), .05, g, s * 29.6, 2, 0);
  const stage = box(30, 2.4, 10, mat(0x5a3020, { map: rep(plankT('#6a3a22', '#5a3020'), 3, 2) }), .1, g, 0, 1.2, -22); const curt = mat(0xa8141e, { roughness: .7 }); for (let k = -6; k <= 6; k++) { const c = cyl(.9, .9, 20, curt, 12, g, k * 2.4, 12.4, -26.5); }
  box(32, 2, 1, mat(0xe9c23a, { metalness: .6, roughness: .3 }), .1, g, 0, 22.5, -26);
  const tables = []; for (const x of [-14, 14]) { const t = new THREE.Group(); t.position.set(x, 0, 2); g.add(t); box(6, .4, 30, mat(0x5a3020), .05, t, 0, 3.4, 0); box(6.2, .1, 30.2, mat(0xf4ece0), .02, t, 0, 3.62, 0); for (let z = -13; z <= 13; z += 4) { cyl(.18, .18, 1, mat(0xf4ead8), 8, t, 0, 4.2, z); sphere(.12, new THREE.MeshBasicMaterial({ color: 0xffc040, toneMapped: false }), t, 0, 4.85, z, 6, 4); for (const s of [-1, 1]) { const pl = cyl(.8, .8, .06, mat(0xffffff), 16, t, s * 1.8, 3.68, z); } } tables.push(t); }
  for (const z of [-10, 8]) { const ch = new THREE.Group(); ch.position.set(0, 21, z); g.add(ch); const gd = gold(); cyl(.06, .06, 4, gd, 6, ch, 0, 2, 0); const ring = new THREE.Mesh(new THREE.TorusGeometry(3, .15, 8, 32), gd); ring.rotation.x = Math.PI / 2; ch.add(ring); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; sphere(.25, new THREE.MeshBasicMaterial({ color: 0xfff0c0, toneMapped: false }), ch, Math.cos(a) * 3, .4, Math.sin(a) * 3, 8, 6); } const l = new THREE.PointLight(0xffd090, 90, 60, 1.3); ch.add(l); }
  // pared de los ganchos (lado de la entrada, z = +27): fila de ganchos de latón con caras colgadas
  const HK = new THREE.Group(); HK.position.set(0, 0, 27.2); HK.rotation.y = Math.PI; g.add(HK); box(40, .6, .6, mat(0x5a3020), .05, HK, 0, 9, 0);
  const faces = [], hooks = []; const SK = [[0xf6d2b8, '#f6d2b8', 0x3a2214], [0xc68b5e, '#c68b5e', 0x111111], [0x8d5a3b, '#8d5a3b', 0x2a1a10], [0xf0c4a2, '#f0c4a2', 0xe8c86a], [0xf2c8a8, '#f2c8a8', 0xb8521e], [0xd9a47a, '#d9a47a', 0x5a3a1a]];
  for (let k = 0; k < 12; k++) { const x = -18 + k * 3.3; const h = new THREE.Mesh(new THREE.TorusGeometry(.3, .07, 6, 12, Math.PI * 1.3), mat(0xc89a3a, { metalness: .8, roughness: .25 })); h.position.set(x, 8.5, .4); h.rotation.z = Math.PI * .85; HK.add(h); hooks.push(h);
    const [sk, css, hr] = SK[k % 6]; const f = hungFace(HK, { skin: sk, css, hair: hr, face: { iris: ['#2a1608', '#3a6a8a', '#4a8a5a'][k % 3] } }); f.position.set(x, 7.5, 1.0); f.scale.setScalar(1.25); faces.push(f); }
  const doorF = box(8, 14, .4, mat(0x4a2a1a), .1, g, 0, 7, 27.5);
  shade(g); return { g, HK, faces, hooks, tables };
}
export function turm(scene, X) {   // interior del Wasserturm: chapa oxidada curva, escalera de mano, luz que entra por las rendijas, charcos
  const g = new THREE.Group(); g.position.x = X; scene.add(g); const rm = mat(0xffffff, { roughness: .7, metalness: .3, map: rep(rustT(), 6, 2), side: THREE.BackSide });
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 18, 40, 1, true), rm); shell.position.y = 9; g.add(shell); const fl = new THREE.Mesh(new THREE.CircleGeometry(14, 40), mat(0xffffff, { map: rep(plankT('#5a3c24', '#4a3020'), 4, 4) })); fl.rotation.x = -Math.PI / 2; g.add(fl);
  const top = new THREE.Mesh(new THREE.ConeGeometry(14, 6, 40, 1, true), mat(0x5a3a22, { side: THREE.BackSide, map: rep(rustT(), 6, 1) })); top.position.y = 21; g.add(top);
  const lad = new THREE.Group(); lad.position.set(-6, 0, -11.5); lad.rotation.y = .5; g.add(lad); for (const s of [-1, 1]) box(.2, 18, .2, mat(0x3a3a3e, { metalness: .7 }), .02, lad, s * 1, 9, 0); for (let k = 0; k < 14; k++) box(2, .14, .14, mat(0x3a3a3e, { metalness: .7 }), .02, lad, 0, 1 + k * 1.2, 0);
  for (let k = 0; k < 5; k++) { const a = -1.2 + k * .5; const ray = new THREE.Mesh(new THREE.BoxGeometry(.3, 22, .3), new THREE.MeshBasicMaterial({ color: 0xffd8a0, transparent: true, opacity: .12, depthWrite: false })); ray.position.set(Math.sin(a) * 8, 10, Math.cos(a) * -8); ray.rotation.set(.5, a, .3); g.add(ray); }
  const pud = new THREE.Mesh(new THREE.CircleGeometry(2.4, 24), mat(0x3a4a5a, { roughness: .05, metalness: .6 })); pud.rotation.x = -Math.PI / 2; pud.position.set(4, .03, 3); g.add(pud);
  const nail = cyl(.06, .02, .6, mat(0x9aa0a8, { metalness: .9 }), 6, g, 3, 6, -13.6); nail.rotation.x = Math.PI / 2;
  const lt = new THREE.PointLight(0xffb070, 30, 40, 1.4); lt.position.set(0, 14, 0); g.add(lt);
  for (let k = 0; k < 4; k++) box(1.6, 1.2, 1.6, mat([0x6a5a3a, 0x5a4a2a][k % 2], { roughness: 1 }), .08, g, 8 + (k % 2) * 1.8, .6 + Math.floor(k / 2) * 1.2, -5);
  shade(g); return { g, nail };
}
export function schwarz(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g); box(80, 80, 80, mat(0x000000, { side: THREE.BackSide }), 0, g, 0, 20, 0); return { g }; }

// ---------- atrezo ----------
export function mower(parent) {   // cortacésped rojo de empuje
  const g = new THREE.Group(); parent.add(g); const red = mat(0xd8323a, { roughness: .35, metalness: .2 }), blk = mat(0x1a1a1e, { roughness: .6 });
  box(2.4, .7, 3, red, .2, g, 0, .8, 0); cyl(1.0, 1.0, .5, mat(0x2a2a2e, { metalness: .6 }), 16, g, 0, 1.3, 0); box(.6, .5, .6, blk, .1, g, .5, 1.5, .4);
  for (const [x, z] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) { const w = cyl(.42, .42, .3, blk, 14, g, x, .42, z); w.rotation.z = Math.PI / 2; cyl(.18, .18, .32, mat(0xc8c8c8, { metalness: .8 }), 8, g, x, .42, z).rotation.z = Math.PI / 2; }
  for (const s of [-1, 1]) { const h = cyl(.08, .08, 4.2, mat(0x9aa0a8, { metalness: .8 }), 6, g, s * .9, 2.6, -2.6); h.rotation.x = -.75; } const bar = cyl(.1, .1, 2, blk, 8, g, 0, 4.1, -4.1); bar.rotation.z = Math.PI / 2;
  const bag = box(1.8, 1.2, 1.6, mat(0x2a5a3a, { roughness: 1 }), .3, g, 0, 1.2, -2.2); bag.rotation.x = -.3; return shade(g); }
export function kaefig(parent) {   // jaula de madera sobre un carro con ruedas de radios
  const g = new THREE.Group(); parent.add(g); const wd = mat(0x5a3a1e, { roughness: .8 }), ir = mat(0x2a2a2e, { metalness: .7, roughness: .4 });
  box(8, .6, 5, wd, .1, g, 0, 2.2, 0); for (let k = 0; k < 9; k++) { cyl(.12, .12, 5, ir, 6, g, -3.8 + k * .95, 5, 2.4); cyl(.12, .12, 5, ir, 6, g, -3.8 + k * .95, 5, -2.4); } for (let k = 0; k < 5; k++) { cyl(.12, .12, 5, ir, 6, g, -3.8, 5, -2 + k), cyl(.12, .12, 5, ir, 6, g, 3.8, 5, -2 + k); }
  box(8.4, .5, 5.4, wd, .1, g, 0, 7.6, 0); for (const y of [3.4, 6.4]) { box(8, .2, .2, ir, 0, g, 0, y, 2.4); box(8, .2, .2, ir, 0, g, 0, y, -2.4); }
  for (const [x, z] of [[-2.8, 2.7], [2.8, 2.7], [-2.8, -2.7], [2.8, -2.7]]) { const w = new THREE.Group(); w.position.set(x, 1.5, z); g.add(w); const t = new THREE.Mesh(new THREE.TorusGeometry(1.3, .14, 8, 20), wd); w.add(t); for (let k = 0; k < 6; k++) { const sp = box(.1, 2.5, .1, wd, 0, w, 0, 0, 0); sp.rotation.z = k * Math.PI / 6; } }
  const tongue = box(.4, .3, 6, wd, .05, g, 0, 1.8, 0); tongue.rotation.y = Math.PI / 2; tongue.position.x = 7; const lock = box(.6, .7, .3, mat(0xc89a3a, { metalness: .8 }), .1, g, 0, 4.4, 2.6); return shade(g); }

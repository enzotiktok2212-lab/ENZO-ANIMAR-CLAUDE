// GOOD BOY — «In dieser Stadt hat jede Frau einen Good Boy. Und das ist nicht ihr Hund. Es ist ihr Mann.» 1080×1920, 30 fps.
// Réplica de la estructura del vídeo de referencia con otra ciudad (Hufenbach rehecho: plaza, Currywurstbude, calle de tiendas, balcón),
// otro reparto (Lukas, Svenja, Benni, Jana…) y otros datos. Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { hufenbach, townhouse } from './gort.js';
import { wurstWagen } from './gsets.js';
import { dackel } from './esets.js';
import { dynPlane, txt } from './asets.js';
import { wohnung, fenster, badezimmer, restaurant, gartencenter, zug, gym, buero, park, glowM } from './gbsets.js';
import { makeLukas, makeSvenja, makeBenni, makeJana, makeJunge, makeSchaffner, makeBodybuilder, makeKim, makeChef, makeOpa, makeOma, makeKellner, makeGaertnerin, makeFrau, makeMann, collar } from './gbcast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 161.2, U = W / 720;
const stage_ = document.getElementById('stage'); const renderer = makeRenderer(stage_); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage_.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0006);
const SS = +(new URLSearchParams(location.search).get('ss') ?? 1.5); renderer.setPixelRatio(SS); renderer.setSize(W, H);   // supermuestreo: se renderiza a SS× y se reduce al dibujar
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false; composer.setSize(W, H); grade.uniforms.px.value.set(1 / (W * SS), 1 / (H * SS));
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds?.forEach(c => c.visible = false); if (sky.moon) sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 3; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
// Hufenbach (x = 0): plaza x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92); fuente (-18, -24).
// Piso (WX = 600), ventana/calle (FX = 1200), baño (BX = 1800), restaurante (RX = 2400), Gartencenter (GX = 3000), tren (ZX = 3600), gimnasio (MX = 4200), oficina (OX = 4800), parque y jardín (PX = 5600).
const WX = 600, FX = 1200, BX = 1800, RX = 2400, GX = 3000, ZX = 3600, MX = 4200, OX = 4800, PX = 5600, PI_ = Math.PI;
const HB = hufenbach(scene), WO = wohnung(scene, WX), FE = fenster(scene, FX), BA = badezimmer(scene, BX), RE = restaurant(scene, RX), GC = gartencenter(scene, GX), ZU = zug(scene, ZX), GY = gym(scene, MX), BU = buero(scene, OX), PA = park(scene, PX);
const SETS = { HB: HB.G, WO: WO.g, FE: FE.g, BA: BA.g, RE: RE.g, GC: GC.g, ZU: ZU.g, GY: GY.g, BU: BU.g, PA: PA.g };
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE, HB.TS].forEach(o => o && (o.visible = false));
// relleno del pueblo
townhouse(HB.G, -64, -21, 13, 3, 61, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 62, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 70 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 80 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 90 + i, -Math.PI / 2); }
for (let i = 0, x = -60; x <= 60; x += 18, i++) townhouse(HB.G, x, 150, 16, 2 + (i % 2), 100 + i, Math.PI);
// Currywurstbude en la plaza (6, 36), ventanilla mirando +x
const WURST = wurstWagen(HB.G); WURST.position.set(6, 0, 36); WURST.rotation.y = 0;
// balcón en la fachada de la fila de casas del este (frente en x ≈ 43, mirando -x), a 8 de altura; tiendas con toldo en esa acera (x ≈ 36)
const BAL = new THREE.Group(); HB.G.add(BAL); BAL.position.set(43.4, 0, -52);
{ box(3.6, .5, 8, mat(0xf4f0e8), .05, BAL, -1.6, 7.6, 0); for (let z = -3.8; z <= 3.8; z += .7) box(.15, 2.4, .15, mat(0x2a2a30, { metalness: .6 }), .02, BAL, -3.3, 9, z); box(.2, .2, 8, mat(0x2a2a30, { metalness: .6 }), .02, BAL, -3.3, 10.2, 0); for (const s of [-1, 1]) for (let z = -1.6; z <= 1.6; z += .7) box(3.4, 2.4, .15, mat(0x2a2a30), 0, BAL, -1.6, 9, s * 3.95).visible = false;
  box(.3, 6.5, 3.6, mat(0x5a3220), .05, BAL, .1, 10.9, 0); for (let k = 0; k < 4; k++) { cyl(.5, .4, .8, mat(0xd8604a), 8, BAL, -2.6, 8.25, -3 + k * 2); sphere(.6, mat([0xff3a5a, 0xffd23f][k % 2]), BAL, -2.6, 8.95, -3 + k * 2, 8, 6); } }
// podio para la revolución (cajas) en la plaza norte (-6, -44)
const POD = (() => { const g = new THREE.Group(); HB.G.add(g); g.position.set(-6, 0, -44); for (const [x, z, y] of [[-1.6, 0, 0], [1.6, 0, 0], [0, 0, 2.4]]) { box(3.2, 2.4, 3.2, mat(0x9a6a3a, { roughness: .8 }), .1, g, x, 1.2 + y, z); for (const s of [-1, 1]) box(3.24, .24, .24, mat(0x6a4422), .02, g, x, 1.2 + y, z + s * 1.5); } return g; })();
for (const k in SETS) outline(SETS[k], 2.2);
HB.G.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && o.geometry.parameters.width === 112 && o.material.map) { o.material.map = o.material.map.clone(); o.material.map.repeat.set(56, 90); o.material.map.needsUpdate = true; } });
// ---------- reparto ----------
const me = makeLukas(scene), sv = makeSvenja(scene), ben = makeBenni(scene), jana = makeJana(scene), JU = [0, 1, 2].map(i => makeJunge(scene, i)), sch = makeSchaffner(scene), bb = makeBodybuilder(scene), kim = makeKim(scene), chef = makeChef(scene), opa = makeOpa(scene), oma = makeOma(scene), kel = makeKellner(scene), gae = makeGaertnerin(scene);
kitFace(me, 'kid'); kitFace(sv, 'girl'); kitFace(ben, 'hero'); kitFace(jana, 'girl'); JU.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid'][i])); kitFace(sch, 'mustache'); kitFace(bb, 'hero'); kitFace(kim, 'girl'); kitFace(chef, 'plain'); kitFace(opa, 'mustache'); kitFace(oma, 'girl'); kitFace(kel, 'mustache'); kitFace(gae, 'girl');
const FR = Array.from({ length: 16 }, (_, i) => makeFrau(scene, i)); FR.forEach(c => kitFace(c, 'girl'));
const MA = Array.from({ length: 36 }, (_, i) => makeMann(scene, i)); MA.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'mustache'][i % 4]));
const MAIN = [me, sv, ben, jana, ...JU, sch, bb, kim, chef, opa, oma, kel, gae];
const POOL = [...MAIN, ...FR, ...MA];
POOL.forEach(c => outline(c.root, 3));
collar(me, 0xd8202a); collar(ben, 0x2a6ad8); collar(opa, 0x8a2a3a); collar(bb, 0x1a1a1a); collar(chef, 0x2a8a3a); MA.forEach((c, i) => collar(c, [0xd8202a, 0x2a6ad8, 0x2ab86a, 0xffd23f, 0xff5a85, 0x8a4ad8][i % 6]));
// la sudadera de Lukas sin capucha cuando se tumba en la cesta; pies alternativos (calcetín / descalzo) para el baño
const FEET = (() => { const sock = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.1, 1.3), mat(0xffffff, { map: (() => { const t = new THREE.CanvasTexture((() => { const c = document.createElement('canvas'); c.width = 32; c.height = 32; const x = c.getContext('2d'); x.fillStyle = '#ff5a85'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#ffffff'; for (let y = 0; y < 32; y += 8) x.fillRect(0, y, 32, 4); return c; })()); t.colorSpace = THREE.SRGBColorSpace; return t; })(), roughness: .9 }));
  sock.position.set(0, -.62, .12); me.lL.kn.add(sock); const foot = new THREE.Mesh(new THREE.BoxGeometry(.96, .34, 1.24), mat(0xf2c6a2, { roughness: .6 })); foot.position.set(0, -.86, .14); me.lR.kn.add(foot);
  const shoes = [me.lL.kn, me.lR.kn].map(k => k.children.filter(m => m.isMesh && m.position.y < -.6 && m !== sock && m !== foot)); const set = on => { sock.visible = foot.visible = on; shoes.flat().forEach(m => m.visible = !on); }; set(false); return { set }; })();
// orejas de lobo (para «wie ein Wolf»)
const WOLF = (() => { const g = new THREE.Group(); me.head.add(g); for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(.34, .8, 4), mat(0x6a6a72, { roughness: .9 })); e.position.set(s * .48, 1.6, 0); e.rotation.z = -s * .25; g.add(e); const i_ = new THREE.Mesh(new THREE.ConeGeometry(.18, .5, 4), mat(0xffb8c8)); i_.position.set(s * .48, 1.56, .14); i_.rotation.z = -s * .25; g.add(i_); } g.visible = false; return g; })();
// espuma en la cabeza
const FOAMH = (() => { const g = new THREE.Group(); me.head.add(g); const m = mat(0xffffff, { roughness: .9, emissive: 0xffffff, emissiveIntensity: .12 }); for (let k = 0; k < 9; k++) sphere(.34 + (k % 3) * .1, m, g, Math.cos(k * 2.4) * .45, 1.55 + (k % 2) * .25, Math.sin(k * 2.4) * .4, 10, 8); sphere(.5, m, g, 0, 1.9, 0, 10, 8); g.visible = false; return g; })();
// ---------- atrezo ----------
const PROPS = [];
const P = o => { PROPS.push(o); outline(o, 1.8); return o; };
const G0 = () => { const g = new THREE.Group(); scene.add(g); return g; };
const DOG = P(dackel(scene));
// vaso de café para llevar
const CUPS = Array.from({ length: 10 }, (_, i) => P((() => { const g = G0(); cyl(.42, .32, 1.3, mat(0xffffff, { roughness: .6 }), 14, g, 0, 0, 0); cyl(.45, .45, .2, mat(0x5a3a22), 14, g, 0, .72, 0); cyl(.44, .38, .45, mat([0xc8a070, 0x2a8a3a, 0xd8323a][i % 3], { roughness: .9 }), 14, g, 0, .1, 0); return g; })()));
// currywurst en bandeja
const CW = P((() => { const g = G0(); box(1.6, .2, .9, mat(0xffffff, { roughness: .8 }), .05, g, 0, 0, 0); for (let k = 0; k < 4; k++) { const w = cyl(.2, .2, .4, mat(0xb8582a, { roughness: .45 }), 10, g, -.55 + k * .37, .25, 0); w.rotation.x = Math.PI / 2; } box(1.4, .1, .7, mat(0xc8201a, { roughness: .3 }), .05, g, 0, .42, 0); const f = cyl(.03, .03, .8, mat(0xd8323a), 4, g, .5, .7, 0); f.rotation.z = .5; return g; })());
const WURSTL = P((() => { const g = G0(); const w = cyl(.22, .22, 1.4, mat(0xb8582a, { roughness: .45 }), 12, g, 0, 0, 0); w.rotation.z = Math.PI / 2; for (const s of [-1, 1]) sphere(.22, mat(0xb8582a, { roughness: .45 }), g, s * .7, 0, 0, 10, 8); for (let k = 0; k < 4; k++) { const sc = sphere(.14, mat(0xc8201a), g, -.45 + k * .3, .18, 0, 8, 6); sc.scale.y = .5; } return g; })());
// palomas
const PIGS = Array.from({ length: 6 }, (_, i) => P((() => { const g = G0(); const m = mat([0x8a8e9a, 0x9aa0ac, 0x7a7e8a][i % 3], { roughness: .8 }); const b = sphere(.6, m, g, 0, .7, 0, 12, 10); b.scale.set(.8, .8, 1.3); const h = sphere(.32, m, g, 0, 1.25, .6, 10, 8); sphere(.2, mat(0x5a9a7a, { roughness: .5, metalness: .3 }), g, 0, 1.0, .55, 8, 6); const bk = new THREE.Mesh(new THREE.ConeGeometry(.08, .3, 5), mat(0xe8c8a0)); bk.rotation.x = Math.PI / 2; bk.position.set(0, 1.22, .95); g.add(bk);
  for (const s of [-1, 1]) { sphere(.07, mat(0xff6a1a), g, s * .17, 1.32, .82, 6, 4); const lg = cyl(.04, .04, .4, mat(0xd86a5a), 4, g, s * .2, .2, 0); } const t = box(.5, .1, .6, m, .04, g, 0, .7, -.85); t.rotation.x = .3; g.userData.head = h; return g; })()));
// móvil con pantalla de chat
const PHONE = P((() => { const g = G0(); box(1.3, 2.4, .16, mat(0x1a1a22, { roughness: .3, metalness: .4 }), .12, g, 0, 0, 0); const s = dynPlane(1.16, 2.2, 232, 440); s.material = new THREE.MeshBasicMaterial({ map: s.material.map, toneMapped: false }); s.position.z = .09; g.add(s); g.userData.scr = s; return g; })());
function phoneScr(mode) { PHONE.userData.scr.userData.draw(mode, (c, w, h) => { c.fillStyle = '#f4f4f8'; c.fillRect(0, 0, w, h); const [who, msg, rep] = mode.split('|'); c.fillStyle = '#1e7a5a'; c.fillRect(0, 0, w, 64); txt(c, who, w / 2, 34, 34, '#ffffff');
  c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(14, 90, w - 50, 110, 18); c.fill(); c.strokeStyle = '#d0d0d8'; c.lineWidth = 2; c.stroke(); msg.split('/').forEach((l, i) => txt(c, l, (w - 36) / 2 + 7, 122 + i * 40, 30, '#1a1a1a'));
  if (rep) { c.fillStyle = '#c8f0b0'; c.beginPath(); c.roundRect(60, 230, w - 74, 80, 18); c.fill(); txt(c, rep, (w + 46) / 2, 272, 46, '#1a1a1a'); } }); }
// lista de tareas (sobre la almohada)
const TODO = P((() => { const g = G0(); const p = dynPlane(3.2, 4.2, 320, 420); p.rotation.x = -Math.PI / 2; g.add(p); g.userData.p = p; return g; })());
function todoDraw(n, und = 0) { TODO.userData.p.userData.draw(n + '|' + und, (c, w, h) => { c.fillStyle = '#fffdf2'; c.fillRect(0, 0, w, h); c.strokeStyle = '#9ac8f0'; c.lineWidth = 2; for (let y = 70; y < h; y += 46) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } c.strokeStyle = '#ff8a9a'; c.beginPath(); c.moveTo(40, 0); c.lineTo(40, h); c.stroke();
  txt(c, 'TO-DO', w / 2, 40, 48, '#d8202a'); ['Abwasch', 'Fenster', 'Müll', 'Wäsche'].forEach((s, i) => { txt(c, '- ' + s, w / 2, 100 + i * 46, 36, '#1a2a5a'); if (i < n) { c.strokeStyle = '#2ab86a'; c.lineWidth = 6; c.beginPath(); c.moveTo(w * .78, 96 + i * 46); c.lineTo(w * .82, 106 + i * 46); c.lineTo(w * .9, 86 + i * 46); c.stroke(); } });
  txt(c, '...', w / 2, 290, 36, '#1a2a5a'); txt(c, 'lächeln :)', w / 2, 360, 46, '#d8202a'); if (und > 0) { c.strokeStyle = '#d8202a'; c.lineWidth = 7; c.beginPath(); c.moveTo(w * .2, 390); c.lineTo(w * .2 + w * .6 * und, 388); c.stroke(); } }); }
// Leckerli (galleta en forma de hueso)
const TREAT = P((() => { const g = G0(); box(.7, .18, .26, mat(0xc88a4a), .08, g, 0, 0, 0); for (const s of [-1, 1]) for (const z of [-.12, .12]) sphere(.14, mat(0xc88a4a), g, s * .36, 0, z, 8, 6); return g; })());
// plato roto
const SHARDS = Array.from({ length: 6 }, (_, i) => P((() => { const g = G0(); const s = new THREE.Mesh(new THREE.CircleGeometry(.7, 3, i, 1.2), mat(0xffffff, { roughness: .2, side: THREE.DoubleSide })); s.rotation.x = -Math.PI / 2; g.add(s); return g; })()));
const PLATE = P((() => { const g = G0(); cyl(1.0, .8, .14, mat(0xffffff, { roughness: .2 }), 20, g, 0, 0, 0); const r = new THREE.Mesh(new THREE.TorusGeometry(.85, .04, 6, 24), mat(0x2a8ad8)); r.rotation.x = Math.PI / 2; r.position.y = .08; g.add(r); return g; })());
// cubo de basura (bolsa), cesta de la colada, trapo
const TRASH = P((() => { const g = G0(); const b = sphere(1.0, mat(0x1a1a1e, { roughness: .4 }), g, 0, 0, 0, 12, 10); b.scale.set(1, 1.2, 1); const k = new THREE.Mesh(new THREE.ConeGeometry(.3, .6, 6), mat(0x1a1a1e)); k.position.y = 1.3; g.add(k); return g; })());
const LAUNDRY = P((() => { const g = G0(); cyl(1.4, 1.1, 1.4, mat(0x3ab8f0, { roughness: .6 }), 16, g, 0, .7, 0); for (let k = 0; k < 6; k++) { const c = sphere(.5, mat([0xffffff, 0xff5a85, 0xffd23f, 0x2a6ad8][k % 4], { roughness: 1 }), g, Math.cos(k) * .6, 1.4 + (k % 2) * .2, Math.sin(k) * .6, 8, 6); c.scale.y = .5; } return g; })());
const RAG = P((() => { const g = G0(); box(1.0, .2, .8, mat(0xffd23f, { roughness: 1 }), .1, g, 0, 0, 0); return g; })());
// Stoppuhr
const WATCH = P((() => { const g = G0(); cyl(1.1, 1.1, .4, mat(0xd8d8e0, { metalness: .8, roughness: .2 }), 24, g, 0, 0, 0).rotation.x = Math.PI / 2; const f = dynPlane(1.8, 1.8, 180, 180); f.position.z = .21; g.add(f); g.userData.f = f; box(.4, .5, .3, mat(0xd8d8e0, { metalness: .8 }), .05, g, 0, 1.3, 0); return g; })());
function watchDraw(sec) { WATCH.userData.f.userData.draw(sec, (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, 7); c.fill(); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; c.fillStyle = '#1a1a1a'; c.fillRect(w / 2 + Math.cos(a) * 74 - 3, h / 2 + Math.sin(a) * 74 - 3, 6, 6); } const a = -Math.PI / 2 + sec / 60 * 6.283 * 6; c.strokeStyle = '#d8202a'; c.lineWidth = 6; c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 + Math.cos(a) * 66, h / 2 + Math.sin(a) * 66); c.stroke(); txt(c, sec.toFixed(1).replace('.', ',') + 's', w / 2, h * .7, 34, '#1a1a1a'); }); }
// bolsas de la compra (16), bolso, abrigo
const BAGS = Array.from({ length: 16 }, (_, i) => P((() => { const g = G0(); const col = [0xff5a85, 0xffffff, 0x2a6ad8, 0xffd23f, 0x2ab86a, 0x8a4ad8, 0xff8a1a, 0x1a1a24][i % 8]; box(1.5, 1.7, .7, mat(col, { roughness: .7 }), .06, g, 0, 0, 0); const hd = new THREE.Mesh(new THREE.TorusGeometry(.35, .05, 6, 14, Math.PI), mat(0x1a1a1a)); hd.position.y = .85; g.add(hd); const l = textPlane(.9, .4, 90, 40, (c, w, h) => txt(c, ['MODE', 'SCHUHE', 'CHIC', 'STYLE'][i % 4], w / 2, h / 2 + 1, 22, i % 8 === 1 ? '#1a1a1a' : '#ffffff')); l.position.z = .36; g.add(l); return g; })()));
const HANDBAG = P((() => { const g = G0(); box(1.2, .9, .5, mat(0xd8a050, { roughness: .4 }), .2, g, 0, 0, 0); const hd = new THREE.Mesh(new THREE.TorusGeometry(.4, .06, 6, 14, Math.PI), mat(0x8a5a2a)); hd.position.y = .45; g.add(hd); sphere(.08, mat(0xe9c23a, { metalness: .9 }), g, 0, .1, .26, 6, 4); return g; })());
const COAT = P((() => { const g = G0(); box(2.2, .5, 1.6, mat(0xff6aa8, { roughness: .7 }), .2, g, 0, 0, 0); for (const s of [-1, 1]) box(.5, .45, 1.8, mat(0xff6aa8, { roughness: .7 }), .15, g, s * 1.1, -.1, .1); return g; })());
// Einkaufszettel / Fahrkarte
const NOTE = P((() => { const g = G0(); const p = textPlane(1.8, 2.4, 180, 240, (c, w, h) => { c.fillStyle = '#fffdf2'; c.fillRect(0, 0, w, h); txt(c, 'EINKAUFSZETTEL', w / 2, 26, 20, '#d8202a'); ['1× Blumenerde', '2× Tulpen', '1× Gießkanne', 'SONST NICHTS!'].forEach((s, i) => txt(c, s, w / 2, 70 + i * 36, 22, i === 3 ? '#d8202a' : '#1a2a5a')); txt(c, '- Petra ♥', w / 2, 214, 22, '#8a4ad8'); }); g.add(p); return g; })());
const TICKET = P((() => { const g = G0(); const p = textPlane(2.0, 1.1, 200, 110, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#7a1a2a'; c.fillRect(0, 0, w, 30); txt(c, 'FAHRKARTE', w / 2, 16, 22, '#ffffff'); txt(c, 'Hufenbach → Köln', w / 2, 56, 18, '#1a1a1a'); txt(c, '2. Klasse  19,90 €', w / 2, 86, 18, '#1a1a1a'); }); g.add(p); return g; })());
// Hantel (barra con discos)
const BAR = P((() => { const g = G0(); const b = cyl(.14, .14, 9, mat(0xc0c4cc, { metalness: .9, roughness: .2 }), 10, g, 0, 0, 0); b.rotation.z = Math.PI / 2; for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const d = cyl(1.3 - k * .15, 1.3 - k * .15, .3, mat([0xd8202a, 0x2a6ad8, 0x1a1a1a][k], { roughness: .5 }), 20, g, s * (3.2 + k * .34), 0, 0); d.rotation.z = Math.PI / 2; } return g; })());
// megáfono, plan de la revolución, olla y cucharón, pelota
const MEGA = P((() => { const g = G0(); const m = new THREE.Mesh(new THREE.CylinderGeometry(.18, .6, 1.4, 14, 1, true), mat(0xffffff, { side: THREE.DoubleSide, roughness: .4 })); m.rotation.x = Math.PI / 2; g.add(m); cyl(.6, .6, .1, mat(0xd8323a), 14, g, 0, 0, .7).rotation.x = Math.PI / 2; box(.2, .6, .2, mat(0x2a2a30), .05, g, 0, -.4, -.3); return g; })());
const PLAN = P((() => { const g = G0(); const p = textPlane(5, 3.4, 400, 272, (c, w, h) => { c.fillStyle = '#fffdf2'; c.fillRect(0, 0, w, h); txt(c, 'PLAN:', w / 2, 40, 44, '#1a2a5a'); txt(c, 'REVOLUTION!', w / 2, 96, 56, '#d8202a'); c.strokeStyle = '#1a2a5a'; c.lineWidth = 4; c.strokeRect(40, 140, 120, 90); txt(c, 'Marktplatz', 100, 186, 20, '#1a2a5a'); c.beginPath(); c.moveTo(170, 185); c.lineTo(250, 185); c.lineTo(240, 175); c.moveTo(250, 185); c.lineTo(240, 195); c.stroke(); txt(c, 'SAMSTAG!', 320, 186, 34, '#d8202a'); }); p.rotation.x = -Math.PI / 2; g.add(p); return g; })());
const PEN = P((() => { const g = G0(); cyl(.08, .08, 1.1, mat(0x1a1a1a), 8, g, 0, 0, 0); cyl(.09, .09, .3, mat(0xd8202a), 8, g, 0, .45, 0); return g; })());
const POT = P((() => { const g = G0(); cyl(1.1, 1.0, 1.4, mat(0xd8d8e0, { metalness: .8, roughness: .25 }), 20, g, 0, 0, 0); for (const s of [-1, 1]) box(.5, .2, .3, mat(0x1a1a1a), .05, g, s * 1.25, .4, 0); const st = []; for (let k = 0; k < 5; k++) st.push(sphere(.4, mat(0xffffff, { transparent: true, opacity: .4, depthWrite: false }), g, 0, 1, 0, 8, 6)); g.userData.st = st; return g; })());
const LADLE = P((() => { const g = G0(); cyl(.06, .06, 2.2, mat(0xd8d8e0, { metalness: .8 }), 6, g, 0, 0, 0); sphere(.35, mat(0xd8d8e0, { metalness: .8 }), g, 0, -1.2, .15, 10, 8); return g; })());
const BALL = P((() => { const g = G0(); sphere(.6, mat(0xffd23f, { roughness: .5 }), g, 0, 0, 0, 16, 12); const r = new THREE.Mesh(new THREE.TorusGeometry(.6, .06, 6, 20), mat(0xd8323a)); g.add(r); return g; })());
const SPOON = P((() => { const g = G0(); cyl(.05, .05, 1.4, mat(0xd8d8e0, { metalness: .9 }), 6, g, 0, 0, 0); sphere(.18, mat(0xd8d8e0, { metalness: .9 }), g, 0, -.75, 0, 8, 6); return g; })());
const MEDAL = P((() => { const g = G0(); const r = cyl(.6, .6, .1, mat(0xe9c23a, { metalness: .9, roughness: .2 }), 20, g, 0, 0, 0); r.rotation.x = Math.PI / 2; for (let k = 0; k < 8; k++) { const p = box(.3, .5, .05, mat(0x2a6ad8), .02, g, Math.cos(k * .785) * .75, Math.sin(k * .785) * .75, -.03); p.rotation.z = k * .785 + Math.PI / 2; } const t = textPlane(.9, .5, 90, 50, (c, w, h) => txt(c, 'Nr. 1', w / 2, h / 2 + 1, 30, '#7a4a10')); t.position.z = .07; g.add(t); return g; })());
const CAL = P((() => { const g = G0(); box(4.4, 5, .2, mat(0xffffff), .05, g, 0, 0, 0); box(4.4, 1.2, .25, mat(0xd8202a), .05, g, 0, 1.9, 0); const p = textPlane(4.2, 4.6, 210, 230, (c, w, h) => { txt(c, 'DONNERSTAG', w / 2, 28, 28, '#ffffff'); txt(c, '16', w / 2, 100, 80, '#1a1a1a'); txt(c, 'SPIELDATE', w / 2, 168, 32, '#2a6ad8'); txt(c, 'mit Benni', w / 2, 204, 24, '#8a4ad8'); }); p.position.z = .14; g.add(p); return g; })());
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.fillStyle = '#ff3a6a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(0, 30, 8, 4, 32, 18); c.bezierCurveTo(56, 4, 64, 30, 32, 54); c.fill(); }); p.material.depthWrite = false; scene.add(p); return p; });
const SPLASH = Array.from({ length: 20 }, () => sphere(.25, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x8fd8ff, emissiveIntensity: .6, transparent: true, opacity: .85 }), scene, 0, 0, 0, 8, 6));
const RING = (() => { const r = new THREE.Mesh(new THREE.TorusGeometry(3, .18, 8, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, depthWrite: false })); r.rotation.x = Math.PI / 2; scene.add(r); return r; })();
const ZZ = textPlane(2, 2, 96, 96, (c, w, h) => txt(c, 'Z', w / 2, h / 2, 80, '#ffffff', '#1a1a3a', 10)); scene.add(ZZ); ZZ.material.depthWrite = false;
// correas: 10 correas de 18 segmentos; se tienden entre la mano de ella y la anilla del collar de él (con caída)
const LEASH = Array.from({ length: 10 }, (_, i) => { const m = mat([0xd8202a, 0x1a1a24, 0x2a6ad8, 0xff5a85, 0x2ab86a][i % 5], { roughness: .5 }); return Array.from({ length: 18 }, () => { const s = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 1, 6), m); s.castShadow = true; scene.add(s); return s; }); });
let LI = 0;
function leash(a, b, sag = 1.2, taut = 0) { const L = LEASH[LI++ % LEASH.length]; const n = L.length, pts = []; const s = sag * (1 - taut); for (let k = 0; k <= n; k++) { const t = k / n; pts.push(V(lerp(a.x, b.x, t), lerp(a.y, b.y, t) - Math.sin(t * Math.PI) * s, lerp(a.z, b.z, t))); }
  for (let k = 0; k < n; k++) { const sg = L[k], p0 = pts[k], p1 = pts[k + 1]; sg.visible = true; sg.position.copy(p0).add(p1).multiplyScalar(.5); const d = p1.clone().sub(p0); sg.scale.set(1, d.length(), 1); sg.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); } }
// correa de la mano (hand: 'R' | 'L') de w hasta el collar de m (si m es null, hasta el punto b)
const lead = (w, m, o = {}) => POST.push(() => { const hd = (o.hand === 'L' ? w.aL : w.aR).hand; const a = wpos(hd).add(V(0, -.35 * (w.spec.scale || 1), 0)); const b = m ? wpos(m.ring) : o.to; leash(a, b, o.sag ?? 1.2, o.taut ?? 0); });
// poses de perro
const DOGP = (T = 0, wv = 0, o = {}) => { const p = Math.sin(T * 8) * wv; return { hipY: 1.5, lean: 1.28, headX: -1.12 + (o.headX || 0), headY: o.headY || 0, aLx: 1.28 + p * .35, aRx: 1.28 - p * .35, aLe: .3, aRe: .3, lLx: -p * .25, lRx: p * .25, lLk: 1.55, lRk: 1.55, ...o.extra }; };
const SITZ = (o = {}) => ({ hipY: 1.5, lean: .05, lLk: 1.55, lRk: 1.55, aLx: 1.1, aRx: 1.1, aLe: 1.7, aRe: 1.7, aLz: -.15, aRz: -.15, headX: -.1, ...o });
const PFOTE = (o = {}) => ({ hipY: 1.5, lean: .05, lLk: 1.55, lRk: 1.55, aRx: 1.5, aRz: -.05, aRe: .2, aLx: .9, aLe: 1.6, aLz: -.2, headX: -.15, ...o });
const mixP = (a, b, k) => { const o = {}, D = { hipY: 2.05 }; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) o[key] = lerp(a[key] ?? D[key] ?? 0, b[key] ?? D[key] ?? 0, k); return o; };
// coger objetos con la mano
const inHand = (obj, ch, side = 'R', p = [0, -.55, .35], r = [0, 0, 0], s = 1) => attach(obj, (side === 'L' ? ch.aL : ch.aR).hand, p, r, s);
// ---------- ambiente ----------
const AIR = aire(scene, 220); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .96; setSky([.16, .46, .98], [.42, .7, 1], [.8, .92, 1]); if (sky.moon) sky.moon.visible = false; hemi.intensity = .95; hemi.color.setRGB(.9, .95, 1); hemi.groundColor.setRGB(.5, .56, .4); sun.intensity = 2.9; sun.color.setRGB(1, .96, .88); rim.intensity = .9;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0006; bloom.strength = .08; bloom.threshold = .95; FILL.intensity = 0; }
function sunset() { MODE = 'dusk'; renderer.toneMappingExposure = 1.0; setSky([.16, .2, .55], [.72, .42, .55], [1, .62, .36]); hemi.intensity = 1.1; hemi.color.setRGB(1, .86, .8); hemi.groundColor.setRGB(.45, .38, .4); sun.intensity = 2.0; sun.color.setRGB(1, .72, .48); rim.intensity = 1.4;
  scene.fog.color.setRGB(.9, .66, .55); scene.fog.density = .0006; bloom.strength = .14; bloom.threshold = .9; FILL.intensity = 30; BIRDSON = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.08; setSky([.04, .05, .2], [.12, .12, .38], [.3, .22, .48]); if (sky.moon) { sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); } hemi.intensity = 1.2; hemi.color.setRGB(.7, .76, 1); hemi.groundColor.setRGB(.34, .3, .42); sun.intensity = 1.1; sun.color.setRGB(.76, .78, 1); rim.intensity = 1.6;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .0008; bloom.strength = .18; bloom.threshold = .88; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .08; bloom.threshold = .95; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } if (c.collar) c.collar.visible = !!c.dog; }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const L of LEASH) for (const s of L) s.visible = false; LI = 0; FEET.set(false); WOLF.visible = false; FOAMH.visible = false;
  for (const k in SETS) SETS[k].visible = false; BU.SCR.userData.set('chart');
  FILL.color.setRGB(1, .96, .91); grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = 1.6; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
// los hombres llevan collar por defecto (es la regla de la ciudad)
[me, ben, opa, bb, chef, ...MA].forEach(c => c.dog = true);
const use = (...n) => { for (const k of n) SETS[k].visible = true; };

function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
// primer plano frontal a la cara según su ry (dist en «cabezas»; side desplaza en lateral)
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.45; if (dist2 != null) dist2 *= 1.45; const s = ch.spec.scale || 1; const h = hp(ch).add(V(0, .6 * s, 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k)) * Math.max(.75, s);
  cam([h.x + fx * d + fz * side, h.y + .6 * s + dy, h.z + fz * d - fx * side], [h.x, h.y - .9 * s, h.z], fov); }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, 3.3 * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'worried' : 'down';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'normal';
    case 'worried': return n > .45 ? 'side_l' : 'worried';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y; for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1; TEAR[i].visible = true; const lx = (i ? -.3 : .3) * s, lz = .72 * s; TEAR[i].position.copy(h).add(V(Math.cos(a) * lx + Math.sin(a) * lz, (.75 - k * 1.1) * s, -Math.sin(a) * lx + Math.cos(a) * lz)); TEAR[i].scale.setScalar(s * 1.2); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function fireworks(c, T, n = 3, R = 14) { FW.forEach((s, i) => { const b = i % n, k = Math.floor(i / n), per = 1.6, t = ((T + b * .53) % per) / per, r0 = RNG(b * 17 + Math.floor((T + b * .53) / per) * 31); const cx = c.x + (r0() - .5) * 60, cy = c.y + 30 + r0() * 20, cz = c.z + (r0() - .5) * 20;
  const a = k / (FW.length / n) * 6.283, el = Math.sin(k * 2.3) * .8; s.visible = t > .25; const e = easeOut((t - .25) / .75) * R; s.position.set(cx + Math.cos(a) * Math.cos(el) * e, cy + Math.sin(el) * e - t * t * 4, cz + Math.sin(a) * Math.cos(el) * e); s.scale.setScalar(1 - t * .8); s.material.color.setHSL((b * .27 + .05) % 1, 1, .6).multiplyScalar(1.6); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.6, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function splash(c, T0, T, s = 1) { SPLASH.forEach((d, i) => { const t = T - T0; if (t < 0 || t > 1.1) return; d.visible = true; const a = i * 2.399, v = (2 + (i % 5)) * s; d.position.set(c.x + Math.cos(a) * v * t * .7, c.y + v * 1.8 * t - 9.8 * t * t, c.z + Math.sin(a) * v * t * .7); d.scale.setScalar(s); }); }
function ring(c, T0, T, R = 12) { const t = T - T0; if (t < 0 || t > .7) return; RING.visible = true; RING.position.copy(c); RING.scale.setScalar(.3 + t / .7 * R / 3); RING.material.opacity = .7 * (1 - t / .7); RING.lookAt(camera.position); }

// ---------- multitudes (solo extras Roblox reales: EX adultos + KIDS niños) ----------
// gente alrededor de (cx, cz) en un arco por detrás del sujeto según la cámara (nunca entre la cámara y el sujeto).
// o.mode: 'idle' | 'wave' | 'cheer' | 'shout' | 'laugh' | 'shrug' | 'walk' | 'point' | 'turn' (de espaldas → se giran en o.turnAt) | 'back' (de espaldas, mirando a o.face) | 'clap'
// o.list: lista de personajes; o.face: punto al que miran (por defecto la cámara); o.tag: nombre en la placa
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { const list = (o.list || CROWD).slice(o.from || 0, (o.from || 0) + n); POST.push(() => { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc[0] + (i + r() * .8) / list.length * (arc[1] - arc[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 8 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.4));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
// multitud en rejilla delante de un punto (para planos del público): filas en z, mirando a o.face
function crowdGrid(L, x0, z0, cols, rows, dx, dz, o = {}) { const list = (o.list || CROWD).slice(o.from || 0); let i = 0; const r = RNG(o.seed || 3);
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) { const c = list[i]; if (!c) return; const x = x0 + (col - (cols - 1) / 2) * dx + (row % 2) * dx * .5 + (r() - .5) * .8, z = z0 + row * dz + (r() - .5) * .8; if (o.skip && o.skip(x, z)) { i++; continue; } crowdGuy(c, x, z, L, i, o); i++; } }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35);
  if (o.mode === 'turn' || o.mode === 'back') { const back = ry + Math.PI + Math.sin(i * 3.1) * .3; const tt = o.turnAt != null ? clamp((L.T - o.turnAt - (i % 5) * .03) / .22) : 0; ry = o.mode === 'back' ? back : lerp(back, ry, easeOut(tt)); }
  put(c, x, 0, z, ry); if (o.tag !== undefined) c.setTag(o.tag); const m = o.mode;
  if (m === 'walk') { actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || 'happy' }); }
  else if (m === 'wave') { actuar(c, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .35, aRe: .5, aLx: .2 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'clap') { const j = Math.abs(Math.sin(L.T * 11 + i)); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - j * .35, aRz: -.2 - j * .35, aLe: 1.0, aRe: 1.0 }]], { T: L.T }); cara(c, T, { expr: 'joy', mouth: 'open_smile' }); }
  else if (m === 'shout') { actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6, lean: -.08, headX: -.15 }]], { T: L.T }); cara(c, T, { expr: 'shout', mouth: 'talk_wide' }); }
  else if (m === 'laugh') { actuar(c, 0, [[0, { aLx: .4, aRx: .9, aLz: -.4, aRz: .2, aRe: 1.5, lean: -.1 + Math.sin(L.T * 14 + i) * .05 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'shrug') { actuar(c, 0, [[0, GEST.shrug]], { T: L.T }); cara(c, T, { expr: 'confused' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'turn' || m === 'back') { const tt = o.turnAt != null ? clamp((L.T - o.turnAt) / .25) : 0; actuar(c, 0, [[0, { headX: -.05, aLx: .15, aRx: .15 }]], { T: L.T }); cara(c, T, { expr: tt > .3 ? (o.expr || 'happy') : 'neutral', mouth: tt > .3 ? (o.mouth || 'open_smile') : undefined }); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'happy', mouth: o.mouth }); } }
const walkP = (T, i, sp = 9) => { const p = Math.sin(T * sp + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
// andar: avanza en dirección ry a velocidad v desde (x0, z0)
function walkTo(c, x0, z0, ry, v, L, i = 0, sp = 9) { const d = v * L.lt; put(c, x0 + Math.sin(ry) * d, Math.abs(Math.sin(L.T * sp + i)) * .12 * (c.spec.scale || 1), z0 + Math.cos(ry) * d, ry); actuar(c, 0, [[0, walkP(L.T, i, sp)]], { T: L.T }); return c; }
const CROWD = [...MA];
const sitY = (c, seat = 2.45) => seat + .1 - 2.05 * (c.spec.scale || 1);
const seatPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
// ---------- escenarios por plano ----------
function town(L, o = {}) { use('HB'); if (o.dusk) sunset(); else if (o.night) night(45); else day(); }
function home(L, o = {}) { use('WO'); if (o.night) { inside(.55, 14); WO.L.intensity = 40; FILL.color.setRGB(.7, .75, 1); } else { inside(1.0, 24); WO.L.intensity = 220; } }
function fen(L, o = {}) { use('FE'); if (o.dusk) sunset(); else day(); FE.SMUDGE.material.opacity = o.smudge || 0; }
function bath(L) { use('BA'); inside(1.0, 26); }
function rest(L) { use('RE'); inside(.95, 26); }
function garden(L) { use('GC'); inside(1.1, 20); }
function train(L) { use('ZU'); inside(1.0, 22); ZU.LAND.forEach((t, i) => t.offset.x = (L.T * .25 * (i ? -1 : 1)) % 1); }
function gymS(L) { use('GY'); inside(1.0, 30); }
function office(L) { use('BU'); inside(1.0, 22); }
function parkS(L, o = {}) { use('PA'); if (o.dusk) sunset(); else day(); }

// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 220, W - 220); b.y = clamp(y, 160, H * .6); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 46px ${FONT}`; const w = Math.max(170, c.measureText(b.text).width + 64); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -46, w, 92, 38); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 44); c.lineTo(10, 44); c.lineTo(-24, 80); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 130px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Frau|Good|Boy|Boys|Hund|Mann|entscheidet|gehorcht|Lukas|bravste|Sonntag|Gassi|Frauen|Kaffee|Männer|Leine|Currywurstbude|Svenja|hinfällt|Aus|Wurst|Boden|Tauben|Park|Benni|beschnuppert|beschnuppere|begrüßen|Freundinnen|begeistert|mögen|Donnerstag|Spieldate|Jungs|Abend|Nein|Fenster|Nase|Scheibe|markiert|halb|sechs|To-do-Liste|Kopfkissen|Abwasch|Müll|Wäsche|unterstrichen|lächeln|Schatz|zwei|Sekunden|Rekord|1,6|Badewanne|Schaum|Socke|Leckerli|Ohr|Bein|zappelt|falsch|Körbchen|Bett|bequemer|Restaurant|Gemüsesuppe|16|Tüten|Handtasche|Mantel|Mund|Gartencenter|Zettel|Schaffner|Fahrkarte|Bodybuilder|Fitnessstudio|130|Kilo|Muskeln|pfeift|Hantel|rennt|Chef|Meeting|Anruf|Fünf|Minuten|Firma|verkauft|Opa|47|Jahren|Stimme|Oma|Hundehütte|Garten|Namensschild|genug|Revolution|Samstag|Marktplatz|Megafon|entscheiden|800|jubeln|Wolf|Balkon|Essen|fertig|vier|leer|brülle|keine|leise|Pfötchen)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–!?]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho, paseo del domingo, Currywurst, parque con Benni (0 – 36,06 s) ----------
// paseo: ella anda (mano derecha adelantada con la correa), él gatea delante; vuelve el ángulo de marcha
function strollW(c, x0, z0, ry, v, L, i = 0, extra = {}) { const d = v * L.lt; put(c, x0 + Math.sin(ry) * d, Math.abs(Math.sin(L.T * 9 + i)) * .12 * (c.spec.scale || 1), z0 + Math.cos(ry) * d, ry); const p = walkP(L.T, i); actuar(c, 0, [[0, { ...p, aRx: .75, aRe: .35, aRz: .05, ...extra }]], { T: L.T }); return c; }
function crawl(c, x0, z0, ry, v, L, i = 0, o = {}) { const d = v * L.lt; put(c, x0 + Math.sin(ry) * d, 0, z0 + Math.cos(ry) * d, ry); actuar(c, 0, [[0, DOGP(L.T * 1.3 + i, o.wv ?? (v > 0 ? 1 : .25), o)]], { T: L.T }); return c; }
// pareja paseando: ella en (x, z), él 5.2 por delante en la dirección ry
function pair(L, w, m, x, z, ry, v, i, o = {}) { strollW(w, x, z, ry, v, L, i); crawl(m, x + Math.sin(ry) * 5.2, z + Math.cos(ry) * 5.2, ry, v, L, i); lead(w, m, { sag: .8 });
  cara(w, L.T + i, { expr: o.wexpr || 'happy' }); cara(m, L.T + i * 2, { expr: 'happy', mouth: i % 2 ? 'open_smile' : 'grin' }); if (o.cup !== false) inHand(CUPS[i % CUPS.length], w, 'L', [0, -.75, .25]); }
const SV0 = V(0, 0, 14);   // punto del paseo de Svenja y Lukas en la plaza

// 1 «In dieser Stadt» (golpe de zoom inicial): la plaza desde arriba, llena de parejas paseando (ellas con café, ellos a cuatro patas con correa)
shot(0, null, null, L => { town(L); const P = [[-6, 30, PI], [6, 18, PI], [-14, 6, PI * .9], [14, 34, PI * 1.08], [-2, -6, PI], [10, 2, PI * .95], [-12, 44, PI * 1.05], [2, 52, PI]];
  P.forEach(([x, z, ry], i) => pair(L, FR[i], MA[i], x, z, ry, 3.2, i));
  orb(L.k, V(0, 2, 24), V(0, 2, 20), [50, .22, .56, 46], [40, .16, .5, 46], easeOut); sh(V(0, 0, 22), 46); }, [[0, 'city_amb', .5], [.3, 'birds', .4], [.5, 'steps', .35]]);
// 2 «hat jede Frau einen Good Boy.»: Svenja sonríe con la correa en la mano; la correa baja fuera de cuadro; detrás, más mujeres con correa
shot(1.14, 'W', null, L => { town(L); put(sv, SV0.x, 0, SV0.z, 0); actuar(sv, 0, [[0, { aRx: .9, aRe: .5, aRz: .05, aLx: .5, aLe: 1.6, aLz: -.25, headX: .05, headZ: Math.sin(L.T * 2) * .05 }]], { T: L.T }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]);
  cara(sv, L.T, { expr: 'happy', mouth: L.T > 2.0 ? 'open_smile' : 'smile', eyes: L.T > 2.0 ? 'happy' : undefined }); lead(sv, null, { to: V(SV0.x + .4, .2, SV0.z + 7), sag: .3 });
  [[FR[1], MA[1], -7, -6], [FR[2], MA[2], 8, -10], [FR[3], MA[3], -3, -18]].forEach(([w, m, dx, dz], i) => pair(L, w, m, SV0.x + dx, SV0.z + dz, .25 * (i - 1), 2.4, i + 1));
  bubble(sv, 'Good Boy!', clamp((L.T - 2.0) / .12), 1.4);
  onBody(sv, 11.5, 0, .1, 40, L.k, 9.6); sh(SV0, 24); }, [[.05, 'chain_rattle', .45], [.85, 'pop', .4]]);
// 3 «Und das ist nicht ihr Hund.»: un perro salchicha de verdad mira, confundido; Svenja pasa de largo
shot(2.8, 'S', null, L => { town(L); show(DOG, SV0.x - 3, 0, SV0.z + 3, .5, 1.15); DOG.rotation.y = .5 + Math.sin(L.T * 3) * .15; DOG.position.y = 0;
  strollW(sv, SV0.x + 2.5, SV0.z - 2, -.3, 1.4, L, 0); cara(sv, L.T, { expr: 'happy' }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); lead(sv, null, { to: V(SV0.x + 1.0, .2, SV0.z + 6), sag: .3 });
  badge('q', '?', W * .5, H * .3, clamp((L.T - 3.5) / .12)); badge('red', 'KEIN HUND', W * .5, H * .17, clamp((L.T - 3.97) / .12), 1, .8);
  orb(L.k, V(SV0.x - 1.6, 2.2, SV0.z + 3), null, [12, .45, .12, 44], [10.5, .3, .1, 44]); sh(SV0, 18); }, [[0, 'bark', .55], [.7, 'boing_metal', .3]]);
// 4 «Es ist ihr Mann.» (golpe de zoom): Lukas a cuatro patas con collar, mueve el culete; Svenja detrás sujeta la correa
shot(4.38, 'C', 'punch', L => { town(L); const p = V(SV0.x, 0, SV0.z + 6); crawl(me, p.x, p.z, 0, 0, L, 0, { wv: .2, extra: { twist: Math.sin(L.T * 12) * .12 } }); me.root.rotation.z = Math.sin(L.T * 12) * .04; cara(me, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' });
  put(sv, p.x + .8, 0, p.z - 5.4, 0); actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: .5, aLe: 1.6, aLz: -.25 }]], { T: L.T }); cara(sv, L.T, { expr: 'smile' }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); lead(sv, me, { sag: .6 });
  crowdAt(L, p.x, p.z - 14, 5, 6, 12, 7, { mode: 'idle', list: FR, from: 4 });
  orb(L.k, V(p.x + .2, 2.8, p.z - 1.6), null, [14, .2, .12, 46], [12.4, .12, .1, 46]); sh(p, 18); }, [[0, 'chain_rattle', .5], [.35, 'sniff', .45]]);
// 5 «Sie entscheidet,»: Svenja señala el suelo: «Sitz!»
shot(5.55, 'F', null, L => { town(L); put(sv, SV0.x, 0, SV0.z, 0); actuar(sv, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .1, aLx: .4, aLe: 1.7, aLz: -.3, lean: .08, headX: .12 }]], { T: L.T }); talk(sv, L.T, 5.6, 6.3, 'determined', { eyes: 'angry' });
  crawl(me, SV0.x + .3, SV0.z + 5.4, PI, 0, L, 0); cara(me, L.T, { expr: 'happy' }); lead(sv, me, { sag: .9 }); bubble(sv, 'Sitz!', clamp((L.lt - .05) / .1), 1.4);
  orb(L.k, V(SV0.x + .2, 3.4, SV0.z + 2.7), null, [16, 1.3, .12, 46], [14.5, 1.2, .1, 46]); sh(SV0, 20); }, [[0, 'whistle', .35]]);
// 6 «er gehorcht.»: Lukas se sienta como un perro, orgulloso
shot(6.3, 'Z', null, L => { town(L); const p = V(SV0.x + .3, 0, SV0.z + 5.4); put(me, p.x, 0, p.z, 0); const k = easeOut(clamp(L.lt / .3)); actuar(me, 0, [[0, mixP(DOGP(L.T, 0), SITZ({ headX: -.2 }), k)]], { T: L.T }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile', eyes: k > .8 ? 'happy' : 'normal' });
  put(sv, p.x - .6, 0, p.z - 5.6, 0); actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: 1.2, aLz: -.6, aLe: 1.8 }]], { T: L.T }); cara(sv, L.T, { expr: 'smug' }); lead(sv, me, { sag: .8 });
  orb(L.k, V(p.x, 3.0, p.z - 1), null, [12, -.3, .12, 44], [10, -.18, .1, 44]); sh(p, 18); }, [[0, 'thud', .4], [.2, 'cloth', .4]]);
// 7 «Ich bin Lukas,»: primer plano de Lukas sentado, saluda con la pata; placa con su nombre
shot(7.25, 'R', null, L => { town(L); const p = V(SV0.x + .3, 0, SV0.z + 5.4); put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, SITZ({ aRx: 2.3 + Math.sin(L.T * 10) * .2, aRe: .6, aRz: .3, headZ: .1 })]], { T: L.T }); talk(me, L.T, 7.3, 8.1, 'happy');
  badge('tag', 'LUKAS', W * .5, H * .2, clamp((L.T - 7.64) / .12)); crowdAt(L, p.x, p.z - 6, 4, 8, 14, 3, { mode: 'idle', list: FR, from: 6 });
  onFace(me, 5.2, -.2, .3, 42, L.k, 4.4); sh(p, 16); }, [[0, 'pop', .45], [.4, 'bark', .25]]);
// 8 «und ich bin der bravste Good Boy»: Svenja le cuelga una medalla «Nr. 1» del collar
shot(8.6, 'I', null, L => { town(L); const p = V(SV0.x + .3, 0, SV0.z + 5.4); put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, SITZ({ headX: -.25 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  put(sv, p.x + .2, 0, p.z - 3.6, 0); actuar(sv, 0, [[0, { aRx: 1.2, aRe: .7, aLx: 1.2, aLe: .7, lean: .25, headX: .3 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'smile' });
  attach(MEDAL, me.collar, [0, -.9, .62], [0, 0, 0], .9); MEDAL.rotation.z = Math.sin(L.T * 5) * .15;
  badge('gold', 'BRAVSTER', W * .5, H * .17, clamp((L.T - 8.91) / .12), 1, .85); confetti(V(p.x, 3, p.z), 9.35, L.T, 40, .6);
  orb(L.k, V(p.x, 3.2, p.z - 1.2), null, [10.5, .45, .14, 42], [9, .3, .12, 42]); sh(p, 16); }, [[.1, 'coin_flip', .4], [.3, 'sparkle', .5], [.75, 'party_horn', .3]]);
// 9 «der ganzen Stadt.» (zoom lento): la plaza aplaude a Lukas sentado en la fuente
shot(9.75, 'Z', 'slow', L => { town(L); const p = V(-18, 0, -14); put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, SITZ({ headX: -.25, aRx: 2.6, aRz: .3, aRe: .4 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); attach(MEDAL, me.collar, [0, -.9, .62], [0, 0, 0], .9);
  put(sv, p.x - 3.4, 0, p.z - 1, .3); actuar(sv, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .3, aLx: .5, aLe: 1.5 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'open_smile' });
  crowdAt(L, p.x, p.z, 10, 7, 13, 11, { mode: 'clap', list: FR, from: 2 }); crowdAt(L, p.x, p.z, 4, 11, 16, 5, { mode: 'cheer', list: FR, from: 12 });
  orbit(V(p.x, 3, p.z), lerp(24, 14, easeIn(L.k)), .12, .2, 44); sh(p, 24); }, [[0, 'cheer', .45], [.3, 'confetti', .3]]);
// 10 «Denn jeden Sonntag geht hier»: el reloj del Rathaus toca las campanas: «SONNTAG»
shot(10.95, 'W', null, L => { town(L); const c = V(-6, 26, -92); cm([-6, 18, -40], [-6, 20, -46], L.k); camera.lookAt(-6, 24, -92); camera.fov = 40;
  [[FR[0], MA[0], -14, -60, -.2], [FR[1], MA[1], 6, -64, .2]].forEach(([w, m, x, z, ry], i) => pair(L, w, m, x, z, PI + ry, 2.2, i));
  badge('tag', 'SONNTAG', W * .5, H * .16, clamp((L.T - 11.49) / .12)); sh(V(-6, 0, -70), 40); }, [[0, 'bell_big', .45], [.6, 'bells', .35]]);
// 11 «die ganze Stadt Gassi.»: desde arriba, una calle llena de parejas que vienen hacia la cámara
shot(12.25, 'S', null, L => { town(L); for (let i = 0; i < 10; i++) { const x = (i % 2 ? 7 : -7) + (i % 3 - 1) * 2, z = 6 - Math.floor(i / 2) * 11; pair(L, FR[i], MA[i], x, z, PI * 0 + (i % 2 ? -.06 : .06), 3, i); }
  orb(L.k, V(0, 2, 6), V(0, 2, 10), [40, .02, .5, 46], [36, -.05, .44, 46]); sh(V(0, 0, -10), 44); }, [[0, 'steps', .45], [.5, 'chain_rattle', .35]]);
// 12 «Die Frauen tragen den Kaffee,»: dos amigas pasean con su café y charlan; las correas van hacia delante
shot(13.65, 'C', null, L => { town(L); const z0 = 0; strollW(FR[3], -2.2, z0, 0, 2.2, L, 0); strollW(FR[5], 2.2, z0, 0, 2.2, L, 1);
  inHand(CUPS[3], FR[3], 'L', [0, -.75, .25]); inHand(CUPS[4], FR[5], 'L', [0, -.75, .25]); talk(FR[3], L.T, 13.7, 14.3, 'happy'); cara(FR[5], L.T, { expr: 'happy', mouth: L.T > 14.3 ? 'laugh' : 'smile', eyes: 'happy' });
  crawl(MA[3], -2.4, z0 + 5.4, 0, 2.2, L, 0); crawl(MA[5], 2.6, z0 + 5.4, 0, 2.2, L, 1); lead(FR[3], MA[3], { sag: .8 }); lead(FR[5], MA[5], { sag: .8 }); MA[3].root.visible = MA[5].root.visible = true;
  const c = V(0, 3.6, z0 + 2.2 * L.lt + 1.2); orbit(c, lerp(15, 13.4, L.k), .12, .12, 44); sh(c, 18); }, [[0, 'sip', .45], [.6, 'laugh_m', .25]]);
// 13 «und die Männer laufen an der Leine.»: plano bajo: los hombres gatean en fila hacia la cámara, felices
shot(14.98, 'R', null, L => { town(L); for (let i = 0; i < 4; i++) { const x = -6 + i * 4, z = -4 + (i % 2) * 2; crawl(MA[6 + i], x, z, 0, 2.4, L, i); strollW(FR[6 + i], x - .2, z - 5.2, 0, 2.4, L, i); lead(FR[6 + i], MA[6 + i], { sag: .8 }); cara(MA[6 + i], L.T + i, { expr: 'happy', mouth: ['open_smile', 'grin', 'laugh', 'open_smile'][i], eyes: 'happy' }); cara(FR[6 + i], L.T + i, { expr: 'happy' }); }
  const c = V(0, 1.6, 2.4 * L.lt); cam([c.x, 2.4, c.z + 13], [c.x, 2.2, c.z - 2], 52); sh(c, 20); }, [[0, 'crawl', .45], [.4, 'chain_rattle', .4]]);
// 14 «Vor der Currywurstbude»: la Currywurstbude; Lukas olfatea con la nariz en alto
const CWB = V(13, 0, 36);   // delante de la ventanilla (la Bude está en (6, 36), ventanilla a +x)
shot(16.6, 'F', null, L => { town(L); put(FR[15], 6.9, 0, 36.2, PI / 2); actuar(FR[15], 0, [[0, { aRx: 1.2, aRe: .8, aLx: .4 }]], { T: L.T }); cara(FR[15], L.T, { expr: 'happy' }); inHand(CW, FR[15], 'R', [0, -.6, .6]);
  crawl(me, CWB.x + 4, CWB.z + 3.4, -2.2, .7, L, 0, { headX: -.25 + Math.sin(L.T * 9) * .1 }); cara(me, L.T, { expr: 'happy', mouth: 'o', eyes: 'up' });
  orb(L.k, V(CWB.x - 2, 4, CWB.z + 1), null, [24, 1.15, .12, 46], [20, 1.0, .1, 46]); sh(CWB, 22); }, [[0, 'pan_sizzle', .5], [.6, 'sniff', .5]]);
// 15 «ziehe ich so fest an der Leine,»: Lukas tira hacia la Bude; la correa tensa
shot(17.95, 'W', null, L => { town(L); const p = V(CWB.x + 2.5 - L.lt * .6, 0, CWB.z + 2); crawl(me, p.x, p.z, -PI / 2, 0, L, 0, { wv: 1.2, extra: { lean: 1.38, crouch: .1 } }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  put(sv, p.x + 5.6, 0, p.z, -PI / 2); actuar(sv, 0, [[0, { aRx: 1.4, aRe: .1, aLx: .9, aLe: .3, lean: .35, lLx: .5, lRx: -.3 }]], { T: L.T }); cara(sv, L.T, { expr: 'shock', mouth: 'o' }); lead(sv, me, { taut: 1 });
  orb(L.k, V(p.x + 2.8, 3.0, p.z), null, [15, .12, .1, 48], [13.4, .05, .08, 48]); sh(p, 18); }, [[0, 'tug', .55], [.5, 'strain', .4]]);
// 16 «dass Svenja fast hinfällt.»: Svenja tropieza hacia delante, brazos al aire, el café salpica
shot(19.2, 'S', null, L => { town(L); const p = V(CWB.x + 4.2, 0, CWB.z + 2); const w = Math.sin(L.T * 14); put(sv, p.x, 0, p.z, -PI / 2); actuar(sv, 0, [[0, { lean: .5 + Math.sin(L.T * 5) * .08, aLx: 2.4 + w * .4, aLz: .6, aRx: 1.6 - w * .4, aRz: .5, aRe: .2, lLx: .7, lRx: -.4, lLk: .3, headX: -.2 }]], { T: L.T });
  cara(sv, L.T, { expr: 'shock', mouth: 'talk_wide', eyes: 'wide' }); crawl(me, p.x - 5.4, p.z, -PI / 2, 0, L, 0, { wv: 1.2 }); cara(me, L.T, { expr: 'happy' }); lead(sv, me, { taut: 1 });
  splash(V(p.x - .6, 6, p.z), 19.4, L.T, .5); onBody(sv, 12, -.45, .14, 44, L.k, 10.6); sh(p, 18); }, [[0, 'gasp_f', .5], [.3, 'cup_rattle', .4], [.8, 'splash', .25]]);
// 17 «Doch ein einziges Aus reicht,»: Svenja recupera el equilibrio y grita «Aus!»
shot(20.6, 'C', null, L => { town(L); const p = V(CWB.x + 4.2, 0, CWB.z + 2); put(sv, p.x, 0, p.z, -PI / 2 + .3); const k = clamp((L.T - 21.4) / .15); actuar(sv, 0, [[0, { aRx: lerp(.8, 1.5, k), aRz: -.1, aRe: lerp(.4, .05, k), aLx: .3, lean: -.05, headX: -.05 }]], { T: L.T });
  talk(sv, L.T, 21.4, 21.9, k > 0 ? 'angry' : 'neutral', { eyes: k > 0 ? 'angry' : undefined }); bubble(sv, 'AUS!', k, 1.4);
  crawl(me, p.x - 5.4, p.z + .8, -PI / 2, 0, L, 0, { wv: 0 }); attach(WURSTL, me.head, [0, .2, .9], [0, PI / 2, 0], 1.0); cara(me, L.T, { expr: 'happy', mouth: 'grin' }); lead(sv, me, { sag: .5 });
  onBody(sv, 13, -.95, .14, 44, L.k, 11.5, -.85); sh(p, 18); }, [[.8, 'slap', .35]]);
// 18 «und die Wurst liegt auf dem Boden.»: Lukas se queda quieto, triste; la wurst cae al suelo
shot(22.35, 'Z', null, L => { town(L); const p = V(CWB.x + .5, 0, CWB.z + 2.8); crawl(me, p.x, p.z, -PI / 2 + .35, 0, L, 0, { wv: 0, headX: .2 }); cara(me, L.T, { expr: 'sad', mouth: 'o' });
  const t = clamp((L.T - 22.6) / .5); const hp_ = hp(me).add(V(-1.0, -.2, -.3)); show(WURSTL, hp_.x - t * .6, lerp(hp_.y, .25, easeIn(t)), hp_.z, t * 2.5); if (t >= 1) WURSTL.position.y = .25 + Math.abs(Math.sin((L.T - 23.1) * 12)) * .3 * Math.max(0, 1 - (L.T - 23.1) * 3);
  dust(V(hp_.x - .6, 0, hp_.z), 23.1, L.T, 6, .4); orb(L.k, V(p.x - 1.6, 1.5, p.z + .6), null, [10, -PI / 2 + .75, .12, 44], [8.6, -PI / 2 + .6, .1, 44]); sh(p, 14); }, [[.25, 'whoosh_down', .35], [.75, 'thud', .5]]);
// 19 «Die Tauben freuen sich.»: las palomas picotean la wurst
shot(23.85, 'I', null, L => { town(L); const w = V(CWB.x - 1.6, 0, CWB.z + 3.6); show(WURSTL, w.x, .25, w.z, .4);
  PIGS.forEach((pg, i) => { const a = i / 6 * 6.283 + .3, r = 1.6 + (i % 2) * .5; show(pg, w.x + Math.cos(a) * r, 0, w.z + Math.sin(a) * r, Math.atan2(-Math.cos(a), -Math.sin(a)), .9); pg.userData.head.position.y = 1.25 - Math.max(0, Math.sin(L.T * 14 + i * 2)) * .4; pg.rotation.x = Math.max(0, Math.sin(L.T * 14 + i * 2)) * .3; });
  crawl(me, w.x + 4.5, w.z - 3.5, -PI / 2 - .6, 0, L, 0, { wv: 0 }); cara(me, L.T, { expr: 'sad', mouth: 'frown' }); hearts(V(w.x, 2.4, w.z), L.T);
  orb(L.k, V(w.x + 1.4, 1.6, w.z - 1), null, [11, .25, .3, 46], [9.6, .4, .26, 46]); sh(w, 14); }, [[0, 'feathers', .45], [.4, 'pling', .35]]);
// ---------- parque ----------
const PK = V(PX, 0, -4);
const park2 = (L, o = {}) => { parkS(L); crawl(me, PK.x - 1.9, PK.z, PI / 2, 0, L, 0, { wv: .3, ...o.me }); crawl(ben, PK.x + 1.9, PK.z + .4, -PI / 2, 0, L, 1, { wv: .3, ...o.ben });
  put(sv, PK.x - 7.4, 0, PK.z - .4, PI / 2); put(jana, PK.x + 7.4, 0, PK.z + .6, -PI / 2); lead(sv, me, { sag: 1 }); lead(jana, ben, { sag: 1 }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); inHand(CUPS[1], jana, 'L', [0, -.75, .25]); };
// 20 «Im Park beschnuppere ich Benni,»: en el parque, Lukas olfatea a Benni
shot(25.2, 'W', null, L => { park2(L, { me: { headX: -.1 + Math.sin(L.T * 12) * .08, headY: .2 } }); cara(me, L.T, { expr: 'curious', mouth: 'o', eyes: 'squint' }); cara(ben, L.T, { expr: 'confused', eyes: 'side_l' });
  actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: .5, aLe: 1.6, aLz: -.25 }]], { T: L.T }); actuar(jana, 0, [[0, { aRx: .8, aRe: .3, aLx: .5, aLe: 1.6, aLz: -.25 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy' }); cara(jana, L.T, { expr: 'happy' });
  orb(L.k, V(PK.x - .4, 2.2, PK.z), null, [12, .3, .1, 44], [10.4, .22, .08, 44]); sh(PK, 18); }, [[0, 'birds', .4], [.4, 'sniff', .55]]);
// 21 «und Benni beschnuppert mich.»: contraplano: Benni olfatea a Lukas
shot(26.85, 'S', null, L => { park2(L, { ben: { headX: -.1 + Math.sin(L.T * 12) * .08, headY: -.2 } }); cara(ben, L.T, { expr: 'curious', mouth: 'o', eyes: 'squint' }); cara(me, L.T, { expr: 'confused', eyes: 'side_r', mouth: 'flat' });
  actuar(sv, 0, [[0, { aRx: .8, aRe: .3 }]], { T: L.T }); actuar(jana, 0, [[0, { aRx: .8, aRe: .3 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy' }); cara(jana, L.T, { expr: 'happy' });
  orb(L.k, V(PK.x + .4, 2.2, PK.z), null, [11, -.32, .1, 44], [9.6, -.24, .08, 44]); sh(PK, 18); }, [[0, 'sniff', .5], [.5, 'sniff', .35]]);
// 22 «Eigentlich wollten wir uns nur begrüßen.»: los dos, de rodillas, se dan la mano, cortados
shot(27.95, 'F', null, L => { parkS(L); const sh_ = Math.sin(L.T * 9) * .2; put(me, PK.x - 1.6, 0, PK.z, PI / 2 - .25); put(ben, PK.x + 1.6, 0, PK.z, -PI / 2 + .25);
  actuar(me, 0, [[0, SITZ({ aRx: 1.35 + sh_, aRz: .1, aRe: .2, headX: .1 })]], { T: L.T }); actuar(ben, 0, [[0, SITZ({ aRx: 1.35 - sh_, aRz: .1, aRe: .2, headX: .1 })]], { T: L.T });
  cara(me, L.T, { expr: 'worried', mouth: 'flat', eyes: 'side_r' }); cara(ben, L.T, { expr: 'worried', mouth: 'flat', eyes: 'side_l' }); sweat(me, L.T, 2);
  orb(L.k, V(PK.x, 3.0, PK.z), null, [12, 0, .1, 42], [10.6, .06, .1, 42]); sh(PK, 16); }, [[.2, 'cough', .35], [.9, 'cloth', .35]]);
// 23 «Aber unsere Freundinnen sind begeistert:»: Svenja y Jana, manos en las mejillas, corazones
shot(29.85, 'C', null, L => { parkS(L); const p = V(PK.x, 0, PK.z - 6); put(sv, p.x - 1.7, 0, p.z, .25); put(jana, p.x + 1.7, 0, p.z, -.25);
  for (const c of [sv, jana]) { actuar(c, 0, [[0, { aLx: 2.05, aLz: -.18, aRx: 2.05, aRz: -.18, aLe: 2.25, aRe: 2.25, headZ: Math.sin(L.T * 4) * .12, crouch: Math.abs(Math.sin(L.T * 6)) * .06 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' }); }
  hearts(V(p.x, 7.4, p.z + .6), L.T); orb(L.k, V(p.x, 4.4, p.z), null, [12, .1, .12, 42], [10.5, -.05, .1, 42]); sh(p, 16); }, [[0, 'gasp_f', .4], [.5, 'sparkle', .45]]);
// 24 «Schau mal, die zwei mögen sich!»: Jana señala a los dos chicos; Svenja, emocionada
shot(31.75, 'R', null, L => { parkS(L); crawl(me, PK.x - 1.9, PK.z, PI / 2, 0, L, 0, { wv: .7 }); crawl(ben, PK.x + 1.9, PK.z + .4, -PI / 2, 0, L, 1, { wv: .7 }); cara(me, L.T, { expr: 'happy', mouth: 'grin' }); cara(ben, L.T, { expr: 'happy', mouth: 'grin' });
  put(jana, PK.x + 4.8, 0, PK.z - 3.6, -.75); put(sv, PK.x - 4.8, 0, PK.z - 3.6, .75); lead(sv, me, { sag: .8 }); lead(jana, ben, { sag: .8, hand: 'L' });
  actuar(jana, 0, [[0, { aRx: 1.45, aRz: -.15, aRe: .1, aLx: .8, aLe: .3, headY: -.2 }]], { T: L.T }); talk(jana, L.T, 31.8, 33.4, 'joy'); actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: 2.0, aLz: -.2, aLe: 2.2 }]], { T: L.T }); cara(sv, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  bubble(jana, L.T < 32.4 ? 'Schau mal!' : 'Die zwei mögen sich!', clamp((L.T - 31.82) / .1), 1.3); hearts(V(PK.x, 3.4, PK.z), L.T);
  orb(L.k, V(PK.x, 3.2, PK.z - 1.6), null, [20, .1, .14, 52], [18.5, -.04, .12, 52]); sh(PK, 20); }, [[0, 'laugh_m', .25], [.1, 'pop', .4]]);
// 25 «Seitdem haben wir jeden Donnerstag»: el calendario de la pared: «DONNERSTAG – SPIELDATE mit Benni»; Lukas lo señala con la pata, feliz
shot(33.45, 'I', null, L => { home(L); const cx = WX - 21.55; show(CAL, cx, 9.4, -4, PI / 2, 1.1); const camP = V(WX - 8, 7.2, 5); const p = V(WX - 17.5, 0, -1.6); put(me, p.x, 0, p.z, faceTo(p, camP));
  actuar(me, 0, [[0, SITZ({ aLx: 2.4, aLz: .5, aLe: .3, headX: -.1, headY: .15 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); me.root.rotation.z = Math.sin(L.T * 10) * .03;
  cm([camP.x, camP.y, camP.z], [camP.x - 1.5, camP.y - .2, camP.z - 1.6], L.k); camera.lookAt(WX - 19, 6.6, -3); camera.fov = 46; }, [[0, 'pages', .45], [.5, 'pencil', .3]]);
// 26 «ein Spieldate.»: Lukas y Benni corren tras la pelota en el parque; ellas charlan en el banco con su café
shot(34.6, 'Z', null, L => { parkS(L); const t = L.lt; show(BALL, PK.x + 6 - t * 5, .6 + Math.abs(Math.sin(t * 7)) * 1.6, PK.z + 6, t * 8);
  crawl(me, PK.x + 9.5 - t * 4.6, PK.z + 4.6, -PI / 2 - .1, 0, L, 0, { wv: 1.3 }); crawl(ben, PK.x + 10 - t * 4.4, PK.z + 7.6, -PI / 2 + .1, 0, L, 1, { wv: 1.3 }); cara(me, L.T, { expr: 'joy', eyes: 'happy', mouth: 'laugh' }); cara(ben, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  const B = V(PX - 14, 0, -10); put(sv, B.x - 1.4, sitY(sv, 2.3), B.z - .4, 0); put(jana, B.x + 1.4, sitY(jana, 2.3), B.z - .4, 0); for (const c of [sv, jana]) actuar(c, 0, [[0, seatPose({ aLx: .9, aLe: 1.4, aRx: .5, aRe: .8 })]], { T: L.T });
  talk(sv, L.T, 34.6, 35.6, 'happy'); cara(jana, L.T, { expr: 'happy', mouth: 'smile' }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); inHand(CUPS[1], jana, 'L', [0, -.75, .25]);
  orb(L.k, V(PK.x + 4, 2.4, PK.z + 5), null, [18, .2, .16, 48], [16, .3, .14, 48]); sh(PK, 26); }, [[0, 'run_grass', .45], [.3, 'kids_laugh', .2], [.7, 'boing_metal', .25]]);
// ---------- b: los Jungs, la ventana, la rutina (To-do, Schatz, bañera), Leckerli, Körbchen (36,06 – 81,25 s) ----------
const SOF = V(WX - 10, 0, -10);   // sofá (mira +z), asiento a y ≈ 3.3
const sofaSit = (L, c, dx, pose = {}) => { put(c, SOF.x + dx, sitY(c, 3.3), SOF.z + 1.0, 0); actuar(c, 0, [[0, seatPose({ aLx: .5, aRx: .5, aLe: .8, aRe: .8, ...pose })]], { T: L.T }); return c; };
// móvil delante del pecho, mirando a la cámara (se orienta después de colocar la cámara)
const phoneAt = (ch, scr, fwd = 1.7, dy = -.2, sc = 1) => { phoneScr(scr); POST.push(() => { const h = hp(ch), a = ch.root.rotation.y, s = ch.spec.scale || 1; show(PHONE, h.x + Math.sin(a) * fwd * s, h.y + dy * s, h.z + Math.cos(a) * fwd * s, 0, sc); PHONE.lookAt(camera.position); }); };
const holdPhone = { aRx: 1.25, aRz: -.25, aRe: 1.5, aLx: 1.15, aLz: -.25, aLe: 1.5, headX: .3 };
// Lukas tumbado de lado en la cesta (cabeza hacia -x, cara a +z)
const KB = V(WX + 10, 0, 4.5);
const inBasket = (L, o = {}) => { put(me, KB.x + 2.7, 1.25, KB.z + .2, 0); me.root.rotation.z = PI / 2; actuar(me, 0, [[0, { lLx: 1.5, lRx: 1.3, lLk: 1.9, lRk: 1.9, aLx: 1.3, aRx: 1.0, aLe: 1.7, aRe: 1.5, headX: .15, headZ: -.15, ...o }]], { T: L.T }); };
// Svenja tumbada en la cama (boca arriba, cabeza en la almohada izquierda)
const svBed = (L, o = {}) => { put(sv, WX + 7.2, 3.15, -7.4, 0); sv.root.rotation.x = -PI / 2; actuar(sv, 0, [[0, { aLx: .1, aRx: .1, ...o }]], { T: L.T }); };
const BLANK = (() => { const b = new THREE.Mesh(new THREE.BoxGeometry(5.6, .7, 6.4), mat(0xff6aa8, { roughness: .95 })); b.castShadow = b.receiveShadow = true; scene.add(b); PROPS.push(b); outline(b, 1.8); return b; })();

// 27 «Natürlich fragen mich die Jungs trotzdem,»: en el sofá, Lukas recibe un mensaje de los Jungs
shot(36.06, 'W', null, L => { home(L); sofaSit(L, me, 0, holdPhone); cara(me, L.T, { expr: 'happy', eyes: 'down', mouth: 'open_smile' }); phoneAt(me, 'JUNGS|Heute Abend/zocken?|', 1.9, -.6, 1.15);
  cm([SOF.x + 1.4, 6.6, SOF.z + 12], [SOF.x + 1, 6.4, SOF.z + 10.6], L.k); camera.lookAt(SOF.x, 5.6, SOF.z + 1); camera.fov = 44; }, [[0, 'notif', .5], [.4, 'vibrate', .35]]);
// 28 «ob ich heute Abend mitkomme.»: los tres Jungs en la calle al atardecer: «Kommst du mit?»
shot(37.46, 'S', null, L => { fen(L, { dusk: 1 }); const p = V(FX - 2, 0, 18); JU.forEach((c, i) => { put(c, p.x - 4 + i * 4, 0, p.z + (i === 1 ? -1.2 : 0), -.1 + (i - 1) * -.15); actuar(c, 0, [[0, i === 1 ? { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5 } : i === 0 ? GEST.point : { aLx: .6, aLe: 1.6, aRx: .4 }]], { T: L.T }); cara(c, L.T + i, { expr: 'happy', mouth: i === 1 ? 'open_smile' : 'smile' }); });
  bubble(JU[1], 'Kommst du mit?', clamp((L.lt - .1) / .1), 1.4); orb(L.k, V(p.x, 3.8, p.z), null, [17, -.1, .1, 46], [15, -.02, .08, 46]); sh(p, 20); }, [[0, 'car_pass', .3], [.2, 'laugh_m', .3]]);
// 29 «Aber Svenja sagt Nein.»: Svenja en el sofá, brazos cruzados: «Nein.»; Lukas sentado en el suelo, triste
shot(38.86, 'F', null, L => { home(L); sofaSit(L, sv, 2.6, GEST.cross); const k = clamp((L.T - 39.88) / .1); cara(sv, L.T, { expr: k ? 'angry' : 'neutral', mouth: k ? 'talk' : 'flat', eyes: k ? 'squint' : undefined }); bubble(sv, 'Nein.', k, 1.2);
  put(me, SOF.x - 2.6, 0, SOF.z + 6.4, PI - .5); actuar(me, 0, [[0, SITZ({ headX: -.3, aLx: 1.6, aRx: 1.6, aLe: 1.2, aRe: 1.2 })]], { T: L.T }); cara(me, L.T, { expr: k ? 'sad' : 'happy', mouth: k ? 'frown' : 'smile' });
  orb(L.k, V(SOF.x, 4.2, SOF.z + 3.2), null, [15, .25, .1, 46], [13.6, .15, .08, 46]); }, [[1.0, 'sad_tone', .35]]);
// 30 «Also sitze ich am Fenster»: dentro, Lukas de rodillas en la ventana, mirando a la calle al atardecer
const WIN = V(FX, 5.8, -1.3);
shot(40.44, 'C', null, L => { fen(L, { dusk: 1 }); put(me, WIN.x, WIN.y, WIN.z, 0); actuar(me, 0, [[0, SITZ({ aLx: 1.5, aRx: 1.5, aLe: 1.3, aRe: 1.3, headX: .1, lean: .15 })]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown', eyes: 'worried' });
  cm([WIN.x + 6.5, 12, WIN.z - 9], [WIN.x + 5.5, 11.6, WIN.z - 8], L.k); camera.lookAt(WIN.x - .4, 9.4, WIN.z + 1); camera.fov = 46; }, [[0, 'sigh', .4], [.6, 'clock_tick', .3]]);
// 31 «und schaue ihnen nach,»: fuera: los Jungs se alejan por la acera; detrás, Lukas en la ventana
shot(41.6, 'Z', null, L => { fen(L, { dusk: 1 }); put(me, WIN.x, WIN.y, WIN.z + .6, 0); actuar(me, 0, [[0, SITZ({ aLx: 1.6, aRx: 1.6, aLe: 1.4, aRe: 1.4, lean: .2 })]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown', eyes: 'side_r' });
  JU.forEach((c, i) => { walkTo(c, FX + 3 + i * 3.2, 9 + (i % 2) * 1.6, PI / 2 - .25, 3.4, L, i); cara(c, L.T + i, { expr: 'happy', mouth: 'smile' }); });
  cm([FX - 7, 7, 30], [FX - 5.5, 7.4, 27], L.k); camera.lookAt(FX + 1.4, 7.6, 3); camera.fov = 44; sh(V(FX, 0, 10), 26); }, [[0, 'steps', .4], [.5, 'laugh_m', .2]]);
// 32 «die Nase an der Scheibe.» (golpe de zoom): la cara de Lukas pegada al cristal, el cristal se empaña
shot(42.6, 'C', 'punch', L => { fen(L, { dusk: 1, smudge: .25 + Math.sin(L.T * 3) * .1 }); put(me, WIN.x, WIN.y, WIN.z + .55, 0); actuar(me, 0, [[0, SITZ({ aLx: 2.0, aRx: 2.0, aLe: 1.0, aRe: 1.0, aLz: .45, aRz: .45, lean: .35, headX: -.35 })]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'o', eyes: 'worried' });
  FE.SMUDGE.position.y = hp(me).y + .7; cm([WIN.x + .3, 10.4, 7.4], [WIN.x + .2, 10.3, 6.6], L.k); camera.lookAt(WIN.x, 9.6, 0); camera.fov = 40; sh(V(FX, 0, 4), 16); }, [[0, 'hand_glass', .5], [.4, 'whisper', .15]]);
// 33 «Inzwischen fragen mich die Jungs gar nicht mehr.»: tumbado en la cesta, el móvil: «Keine neuen Nachrichten»
shot(43.77, 'R', null, L => { home(L); inBasket(L, { aRx: 1.6, aRe: 1.3 }); cara(me, L.T, { expr: 'sad', mouth: 'frown', eyes: 'down' }); phoneScr('JUNGS|Keine neuen/Nachrichten|'); POST.push(() => { const h = hp(me); show(PHONE, h.x + .6, h.y - .8, h.z + 2.2, 0, 1.0); PHONE.lookAt(camera.position); });
  orb(L.k, V(KB.x - .8, 1.8, KB.z), null, [10.5, .15, .32, 46], [9.4, .05, .3, 46]); }, [[0, 'silence_tick', .35], [.7, 'sigh', .35]]);
// 34 «Weil es sowieso nichts bringt,»: en la calle, los Jungs se encogen de hombros
shot(45.6, 'W', null, L => { fen(L, { dusk: 1 }); const p = V(FX + 10, 0, 20); JU.forEach((c, i) => { put(c, p.x - 4 + i * 4, 0, p.z + (i === 1 ? -1 : 0), -.35 + (i - 1) * -.1); actuar(c, 0, [[0, GEST.shrug]], { T: L.T }); cara(c, L.T + i, { expr: 'confused', mouth: 'flat' }); });
  orb(L.k, V(p.x, 3.8, p.z), null, [16, -.35, .1, 46], [14.5, -.25, .08, 46]); sh(p, 20); }, [[0, 'cloth', .4], [.4, 'hmm', .35]]);
// 35 «schreiben sie gleich Svenja.»: el móvil de Svenja: «Darf Lukas heute raus?» — «Nein.»
shot(46.85, 'S', null, L => { home(L); sofaSit(L, sv, 0, holdPhone); cara(sv, L.T, { expr: 'smug', eyes: 'down', mouth: 'smile' }); const k = L.T > 47.5; phoneAt(sv, 'JUNGS|Darf Lukas/heute raus?|' + (k ? 'Nein.' : ''), 1.9, -.6, 1.15);
  cm([SOF.x - 1.2, 6.6, SOF.z + 11], [SOF.x - 1, 6.4, SOF.z + 9.8], L.k); camera.lookAt(SOF.x, 5.6, SOF.z + 1); camera.fov = 44; }, [[0, 'notif', .45], [.6, 'click_set', .4]]);
// 36 «Kennt ihr auch so einen Good Boy wie Lukas?» (zoom lento): Lukas en la cesta, ojos de cachorro a cámara
shot(48.12, 'Z', 'slow', L => { home(L); put(me, KB.x, .8, KB.z, 0); actuar(me, 0, [[0, SITZ({ headX: -.05, headZ: .25 + Math.sin(L.T * 2) * .05, aLx: 1.3, aRx: 1.3, aLe: 1.5, aRe: 1.5 })]], { T: L.T }); cara(me, L.T, { expr: 'sad', eyes: 'worried', mouth: 'smile' });
  badge('gold', 'GOOD BOY?', W * .5, H * .17, clamp((L.T - 48.92) / .12), 1, .9); onFace(me, lerp(7, 4.6, easeIn(L.k)), -.3, 0, 42); }, [[0, 'whisper', .2]]);
// 37 «Dann markiert ihn.»: Lukas señala a la cámara con la pata y guiña
shot(50.0, 'C', null, L => { home(L); put(me, KB.x, .8, KB.z, 0); actuar(me, 0, [[0, SITZ({ aRx: 1.55, aRz: -.05, aRe: .05, headZ: -.1 })]], { T: L.T }); cara(me, L.T, { expr: 'smug', eyes: L.T > 50.4 ? 'squint' : 'happy', mouth: 'grin' });
  badge('green', '@ MARKIEREN', W * .5, H * .17, clamp((L.T - 50.2) / .12), 1, .8); onFace(me, 5.4, -.2, -.4, 44, L.k, 4.8); }, [[0, 'pop', .45], [.3, 'click_set', .35]]);
// 38 «Mein Tag beginnt um halb sechs,»: de noche aún: suena el despertador 5:30; Lukas se despierta de golpe en la cama
const lukBed = (L, up = 0) => { put(me, WX + 12.8, 3.15 + up * .2, -7.4 + up * 2.6, 0); me.root.rotation.x = lerp(-PI / 2, -.05, up); actuar(me, 0, [[0, { aLx: lerp(.1, .9, up), aRx: lerp(.1, .9, up), aLe: up, aRe: up, lLx: up * 1.5, lRx: up * 1.5 }]], { T: L.T }); };
shot(51.12, 'F', null, L => { home(L, { night: 1 }); const up = easeOut(clamp((L.T - 51.5) / .25)); lukBed(L, up); svBed(L); show(BLANK, WX + 10, 3.2, -4.4, 0); cara(sv, L.T, { eyes: 'closed', mouth: 'flat' }); cara(me, L.T, { expr: up > .5 ? 'shock' : 'neutral', eyes: up > .5 ? 'wide' : 'closed', mouth: up > .5 ? 'o' : 'flat' });
  WO.ALARM.position.y = 3.3 + Math.abs(Math.sin(L.T * 40)) * .08; badge('num', '5:30', W * .5, H * .17, clamp((L.T - 51.94) / .12)); FILL.intensity = 30;
  cm([WX + 16.8, 6.6, -3], [WX + 16.4, 6.4, -3.6], L.k); camera.lookAt(WX + 12.6, 4.4, -10.6); camera.fov = 46; }, [[0, 'alarm', .45], [.4, 'gasp', .3]]);
// 39 «denn da liegt schon die To-do-Liste»: sentado en la cama, la lista sobre su almohada
shot(52.72, 'W', null, L => { home(L, { night: 1 }); lukBed(L, 1); svBed(L); show(BLANK, WX + 10, 3.2, -4.4, 0); cara(sv, L.T, { eyes: 'closed', mouth: 'flat' }); cara(me, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' }); todoDraw(0); show(TODO, WX + 12.8, 3.75, -11.6, .15, .9); FILL.intensity = 30;
  cm([WX + 15, 9.6, -1.4], [WX + 14.6, 9.4, -2.2], L.k); camera.lookAt(WX + 12.8, 4.6, -9.4); camera.fov = 46; }, [[0, 'paper', .5], [.6, 'blanket', .35]]);
// 40 «auf meinem Kopfkissen.»: la lista de cerca
shot(53.98, 'I', null, L => { home(L, { night: 1 }); todoDraw(0); show(TODO, WX + 12.8, 3.75, -11.6, .15, .9); FILL.intensity = 40; lukBed(L, 1); cara(me, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' });
  cm([WX + 12.9, 9.6, -9.6], [WX + 12.85, 9.0, -10.2], L.k); camera.lookAt(WX + 12.8, 3.8, -11.7); camera.fov = 40; }, [[0, 'paper', .4]]);
// 41 «Abwasch, Fenster,»: en la cocina, Lukas friega a toda velocidad; la lista se va tachando
const SINK = V(WX - 14, 0, -9.6);
shot(54.8, 'S', null, L => { home(L); put(me, SINK.x, 0, SINK.z, PI); const f = Math.sin(L.T * 26); actuar(me, 0, [[0, { aLx: 1.3, aRx: 1.3 + f * .25, aLe: .9, aRe: .9 + f * .2, aLz: -.25, aRz: -.25 + f * .1, lean: .15, headX: .25 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  inHand(PLATE, me, 'L', [0, -.6, .3], [PI / 2, 0, 0], 1); splash(V(SINK.x, 6.4, SINK.z - 3.2), 54.9, L.T, .4); todoDraw(L.T > 55.65 ? 2 : 1); badge('green', L.T > 55.65 ? 'FENSTER' : 'ABWASCH', W * .5, H * .17, clamp((L.T - 54.85) / .1), 1, .75);
  cm([SINK.x - 6, 9, SINK.z - 1], [SINK.x - 5.4, 9, SINK.z - .4], L.k); camera.lookAt(SINK.x, 5.6, SINK.z - 2); camera.fov = 48; }, [[0, 'water_bloop', .45], [.3, 'porcelain', .4], [.85, 'brush', .4]]);
// 42 «Müll, Wäsche.»: Lukas carga la bolsa de basura y la cesta de la colada a la vez
shot(56.0, 'C', null, L => { home(L); walkTo(me, WX - 4, -4, PI / 2, 5, L, 0, 14); actuar(me, 0, [[0, { ...walkP(L.T, 0, 14), aLx: 1.2, aRx: 1.2, aLe: .6, aRe: .6, aLz: -.3, aRz: -.3 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  const h = hp(me); show(LAUNDRY, h.x + 2.2, h.y - 3.6, h.z + .2, 0, 1); inHand(TRASH, me, 'R', [0, -1.4, 0], [0, 0, 0], .8); todoDraw(4); badge('green', L.T > 56.7 ? 'WÄSCHE' : 'MÜLL', W * .5, H * .17, clamp((L.T - 56.23) / .1), 1, .75);
  orb(L.k, V(h.x, 3.6, h.z), null, [13, .15, .1, 46], [12, .05, .08, 46]); }, [[0, 'trash_hit', .4], [.6, 'cloth', .45]]);
// 43 «Und ganz unten, unterstrichen:»: la lista: abajo del todo, «lächeln», subrayado en rojo
shot(57.24, 'Z', null, L => { home(L); todoDraw(4, clamp((L.T - 57.84) / .6)); show(TODO, WX + 12.8, 3.75, -11.6, .15, .9); put(me, WX + 12.8, 0, -5.4, PI); actuar(me, 0, [[0, { aRx: 1.0, aRe: .8, lean: .3, headX: .45 }]], { T: L.T }); cara(me, L.T, { expr: 'confused', eyes: 'down' });
  cm([WX + 12.85, 8.8, -10.0], [WX + 12.82, 8.0, -10.6], L.k); camera.lookAt(WX + 12.8, 3.8, -12.4); camera.fov = 38; }, [[.6, 'pencil', .5]]);
// 44 «lächeln.» (golpe de zoom): Lukas fuerza una sonrisa enorme
shot(58.59, 'C', 'punch', L => { home(L); put(me, WX + 2, 0, 2, 0); actuar(me, 0, [[0, { aLx: .2, aRx: .2, aLz: .15, aRz: .15, headZ: .05 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'wide', mouth: 'grin' }); sweat(me, L.T, 1);
  onFace(me, 4.0, -.1, .2, 42, L.k, 3.6); }, [[0, 'sparkle', .45]]);
// 45 «Sobald Svenja Schatz ruft,»: Svenja en el sofá llama: «Schatz?»
shot(59.43, 'W', null, L => { home(L); sofaSit(L, sv, 0, { aRx: 2.3, aRz: -.4, aRe: 2.0, headY: .2, headZ: .1 }); const k = clamp((L.T - 60.25) / .1); cara(sv, L.T, { expr: 'happy', mouth: k ? 'o' : 'smile' }); bubble(sv, 'Schatz?', k, 1.2); inHand(CUPS[0], sv, 'L', [0, -.75, .25]);
  onBody(sv, 12, .2, .12, 44, L.k, 10.4); }, [[.8, 'pling', .35]]);
// 46 «bin ich in zwei Sekunden da.»: Lukas cruza el piso a cuatro patas a toda velocidad; cronómetro «2 SEK»
shot(61.03, 'S', null, L => { home(L); const t = L.lt; crawl(me, WX + 14 - t * 13, 2, -PI / 2, 0, L, 0, { wv: 1.6, extra: { lean: 1.4 } }); cara(me, L.T, { expr: 'determined', mouth: 'grin' }); dust(V(WX + 14 - t * 13, 0, 2), 61.1, L.T, 6, .5);
  badge('num', '2 SEK', W * .5, H * .17, clamp((L.T - 61.33) / .12)); orb(L.k, V(WX + 10 - t * 13, 2.4, 2), null, [15, .05, .12, 50], [15, -.15, .1, 50]); }, [[0, 'steps_run', .5], [.2, 'whoosh', .35], [.9, 'land', .35]]);
// 47 «Mein Rekord: 1,6 Sekunden,»: el cronómetro marca 1,6 s; Lukas celebra detrás
shot(62.54, 'F', null, L => { home(L); const s = Math.min(1.6, (L.T - 62.54) * 2.2); watchDraw(L.T < 63.12 ? s : 1.6); show(WATCH, WX + .8, 6.4, 3.4, 0, 1.3); WATCH.lookAt(camera.position);
  put(me, WX - 1.4, 0, -1, .25); actuar(me, 0, [[0, SITZ({ aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .2, aRe: .2, headX: -.25 })]], { T: L.T }); laughF(me, L.T); badge('gold', 'REKORD!', W * .5, H * .16, clamp((L.T - 62.76) / .12), 1, .9); confetti(V(WX - 1.4, 3, -1), 63.1, L.T, 40, .6);
  cm([WX + 1.4, 7.2, 12], [WX + 1.2, 7.0, 10.8], L.k); camera.lookAt(WX + .2, 5.6, 0); camera.fov = 44; POST.push(() => WATCH.lookAt(camera.position)); }, [[0, 'watch_click', .55], [.6, 'ding_reveal', .4], [.7, 'party_horn', .3]]);
// 48 «direkt aus»: en la bañera, relajado entre la espuma… oye la llamada
shot(64.1, 'Z', null, L => { bath(L); const T0 = V(BX, 0, -6.5); put(me, T0.x + 1.5, 1.4, T0.z, -PI / 2); me.root.rotation.z = -.9; actuar(me, 0, [[0, { aLx: .4, aRx: .4, aLz: .9, aRz: .9, aLe: 1.8, aRe: 1.8, lLx: 1.4, lRx: 1.4, headX: .5 }]], { T: L.T });
  const k = L.T > 64.8; cara(me, L.T, { expr: k ? 'shock' : 'happy', eyes: k ? 'wide' : 'closed', mouth: k ? 'o' : 'smile' }); FOAMH.visible = true;
  cm([BX + 3, 9.4, 4.4], [BX + 2.5, 9.0, 3.4], L.k); camera.lookAt(BX + .6, 4.6, -6.5); camera.fov = 44; }, [[0, 'water_bloop', .45], [.5, 'drip', .35]]);
// 49 «der Badewanne.»: salta fuera de la bañera; salpica agua y espuma
shot(65.25, 'C', 'punch', L => { bath(L); const t = clamp(L.lt / .6); const x = BX + lerp(1, -2, t), y = lerp(1.6, 0, t) + Math.sin(t * PI) * 4.4, z = lerp(-6.5, -1.5, t); put(me, x, y, z, .2); actuar(me, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, lLx: .9 * (1 - t), lRx: .4, lLk: 1.2 * Math.sin(t * PI), lRk: 1.0 * Math.sin(t * PI), lean: .1 }]], { T: L.T });
  cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'talk_wide' }); FOAMH.visible = true; FEET.set(true); splash(V(BX, 4.2, -6.5), 65.3, L.T, 1.4);
  cm([BX + 2, 8.8, 9.8], [BX + 1.6, 8.6, 9.0], L.k); camera.lookAt(BX - .4, 5.4, -3.6); camera.fov = 48; }, [[0, 'splash', .6], [.5, 'land', .4]]);
// 50 «Mit Schaum auf dem Kopf»: Lukas llega con espuma en la cabeza, goteando
shot(66.22, 'R', null, L => { home(L); put(me, SOF.x + 1, 0, SOF.z + 7.6, PI + .15); actuar(me, 0, [[0, { aLx: .2, aRx: .4, aLz: .2, aRz: .3, headX: -.05 }]], { T: L.T }); grin(me, L.T); FOAMH.visible = true; FEET.set(true); sweat(me, L.T, 2);
  onFace(me, 5.2, .2, .3, 42, L.k, 4.6); }, [[0, 'drip', .45], [.4, 'pop', .3]]);
// 51 «und nur einer Socke.»: plano de pies: un calcetín rosa a rayas y un pie descalzo; Svenja levanta una ceja
shot(67.24, 'C', null, L => { home(L); put(me, SOF.x + 1, 0, SOF.z + 7.6, PI + .15); actuar(me, 0, [[0, { aLx: .2, aRx: .4, aLz: .2, aRz: .3 }]], { T: L.T }); grin(me, L.T); FOAMH.visible = true; FEET.set(true);
  sofaSit(L, sv, 0, GEST.cross); cara(sv, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' }); badge('red', 'NUR 1 SOCKE', W * .5, H * .17, clamp((L.T - 67.6) / .12), 1, .8);
  cm([SOF.x + 4.8, 2.4, SOF.z + 12.6], [SOF.x + 4.4, 3.2, SOF.z + 12.2], L.k); camera.lookAt(SOF.x + .6, 3.2, SOF.z + 3); camera.fov = 50; }, [[0, 'drip', .4], [.5, 'hmm', .35]]);
// 52 «Für jeden Abwasch»: Lukas deja un plato reluciente
shot(68.67, 'W', null, L => { home(L); put(me, SINK.x + 1.2, 0, SINK.z + 1.4, PI - .5); actuar(me, 0, [[0, { aLx: 1.6, aRx: 1.3, aLe: .5, aRe: .9, lean: .05, headX: .1 }]], { T: L.T }); grin(me, L.T); inHand(PLATE, me, 'L', [0, -.6, .3], [PI / 2, 0, 0], 1.1); inHand(RAG, me, 'R', [0, -.6, .3]);
  const h = hp(me); hearts(V(h.x, h.y - 1, h.z - 1.5), L.T); onBody(me, 12.5, -.35, .12, 46, L.k, 11, -.25); }, [[0, 'porcelain', .45], [.4, 'sparkle', .45]]);
// 53 «gibt es ein Leckerli.»: Svenja le lanza una galletita; él la atrapa con la boca
shot(69.63, 'S', null, L => { home(L); const P0 = V(WX - 6, 0, -4); put(sv, P0.x, 0, P0.z, -PI / 2); put(me, P0.x - 5, 0, P0.z, PI / 2); actuar(me, 0, [[0, SITZ({ headX: -.4 })]], { T: L.T });
  const t = clamp((L.T - 69.75) / .45); actuar(sv, 0, [[0, { aRx: lerp(1.6, 1.0, t), aRz: -.1, aRe: lerp(.6, .1, t), aLx: .3 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'smile' }); cara(me, L.T, { expr: 'happy', eyes: t >= 1 ? 'happy' : 'up', mouth: t >= 1 ? 'grin' : 'o' });
  const a = wpos(sv.aR.hand), b = hp(me).add(V(.6, .5, 0)); show(TREAT, lerp(a.x, b.x, t), lerp(a.y, b.y, t) + Math.sin(t * PI) * 1.6, lerp(a.z, b.z, t), t * 8, 1.4); if (t >= 1) TREAT.visible = false;
  badge('gold', 'LECKERLI', W * .5, H * .17, clamp((L.T - 70.23) / .12), 1, .8); orb(L.k, V(P0.x - 2.5, 3.6, P0.z), null, [15, .1, .12, 46], [13.6, .02, .1, 46]); }, [[.1, 'throw', .4], [.55, 'chew', .5]]);
// 54 «Und wenn ich alles richtig mache,»: todo reluce; Svenja revisa con el dedo y le da el visto bueno
shot(70.87, 'F', null, L => { home(L); const P0 = V(WX - 10, 0, -2); put(sv, P0.x + 2.4, 0, P0.z, -.4); actuar(sv, 0, [[0, { aRx: 1.9, aRz: .2, aRe: .9, aLx: .4, headY: .2 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'smile', eyes: 'happy' });
  put(me, P0.x - 2.2, 0, P0.z + 1.2, .5); actuar(me, 0, [[0, SITZ({ headX: -.2 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  orb(L.k, V(P0.x, 3.6, P0.z + .6), null, [15, .05, .14, 46], [13.6, -.05, .12, 46]); }, [[0, 'sparkle', .5], [.6, 'ding_soft', .35]]);
// 55 «krault sie mich hinterm Ohr,»: Svenja le rasca detrás de la oreja; él cierra los ojos de gusto
shot(72.11, 'I', null, L => { home(L); const P0 = V(WX - 10, 0, -4); sofaSit(L, sv, 1.4, { aRx: 1.2, aRz: -.45, aRe: 1.1 + Math.sin(L.T * 18) * .15, lean: .15, headX: .2 }); cara(sv, L.T, { expr: 'happy', mouth: 'smile', eyes: 'happy' });
  put(me, SOF.x - .1, 0, SOF.z + 5.0, PI * .15); actuar(me, 0, [[0, SITZ({ headZ: .35 + Math.sin(L.T * 18) * .05, headX: -.1 })]], { T: L.T }); cara(me, L.T, { eyes: 'closed', mouth: 'open_smile', blush: 1 }); hearts(hp(me).add(V(0, 1.6, 0)), L.T);
  orb(L.k, V(SOF.x + .4, 4.2, SOF.z + 3.6), null, [13, .25, .1, 44], [11.8, .18, .08, 44]); }, [[0, 'cloth', .4], [.5, 'sigh', .3]]);
// 56 «bis mein Bein zappelt.»: la pierna de Lukas patalea sin control
shot(73.85, 'Z', null, L => { home(L); sofaSit(L, sv, 1.4, { aRx: 1.2, aRz: -.45, aRe: 1.1 + Math.sin(L.T * 18) * .15, lean: .15, headX: .2 }); cara(sv, L.T, { expr: 'happy', mouth: 'laugh', eyes: 'happy' });
  put(me, SOF.x - .1, 0, SOF.z + 5.0, PI * .15); const kick = Math.sin(L.T * 34); actuar(me, 0, [[0, SITZ({ headZ: .35, headX: -.1, lRx: .9 + kick * .6, lRk: .6 + kick * .4, hipY: 1.55 })]], { T: L.T }); cara(me, L.T, { eyes: 'happy', mouth: 'laugh', blush: 1 });
  dust(V(SOF.x + .6, 0, SOF.z + 5.6), 74.0, L.T, 6, .3); orb(L.k, V(SOF.x, 2.2, SOF.z + 5), null, [10.5, .55, .1, 44], [9.4, .45, .08, 44]); }, [[0, 'thump', .45], [.3, 'thump', .4], [.6, 'thump', .35], [.9, 'laugh_m', .25]]);
// 57 «Mache ich dagegen etwas falsch,»: un plato roto en el suelo; Svenja, manos en las caderas; Lukas, culpable
shot(75.55, 'S', null, L => { home(L); const P0 = V(SINK.x + 4, 0, SINK.z + 4); SHARDS.forEach((s, i) => show(s, P0.x + Math.cos(i * 1.1) * (.8 + i * .2), .05, P0.z + 1.6 + Math.sin(i * 1.1) * .7, i));
  put(sv, P0.x + 4, 0, P0.z - .4, -PI / 2 + .3); actuar(sv, 0, [[0, { aLx: .3, aRx: .3, aLz: .7, aRz: .7, aLe: 1.9, aRe: 1.9, headX: .1 }]], { T: L.T }); cara(sv, L.T, { expr: 'angry', mouth: 'frown' });
  put(me, P0.x - 2.6, 0, P0.z + .6, PI / 2 - .2); actuar(me, 0, [[0, SITZ({ headX: .35, aLx: 1.6, aRx: 1.6, aLe: 1.8, aRe: 1.8, aLz: -.35, aRz: -.35 })]], { T: L.T }); cara(me, L.T, { expr: 'worried', eyes: 'down', mouth: 'frown' }); sweat(me, L.T, 2);
  orb(L.k, V(P0.x + .6, 3.6, P0.z + .6), null, [17, .1, .14, 48], [15.6, .02, .12, 48]); }, [[0, 'porcelain_break', .5], [.6, 'gasp_f', .3]]);
// 58 «schlafe ich im Körbchen vor dem Bett.»: de noche, Lukas hecho un ovillo en la cesta; Svenja en la cama
shot(77.14, 'W', null, L => { home(L, { night: 1 }); inBasket(L); cara(me, L.T, { eyes: 'closed', mouth: 'flat' }); svBed(L); show(BLANK, WX + 10, 3.2, -4.4, 0); cara(sv, L.T, { eyes: 'closed', mouth: 'flat' }); FILL.intensity = 30;
  cm([WX + 4, 11, 16], [WX + 4.6, 10.4, 15], L.k); camera.lookAt(WX + 9.6, 2.6, -1); camera.fov = 48; }, [[0, 'crickets', .4], [.5, 'blanket', .35]]);
// 59 «Das Körbchen ist übrigens»: primer plano: Lukas, feliz y calentito en la cesta
shot(78.79, 'C', null, L => { home(L, { night: 1 }); inBasket(L, { headX: .25 }); cara(me, L.T, { eyes: 'closed', mouth: 'smile', blush: 1 }); FILL.intensity = 34; ZZ.visible = true; const h = hp(me); ZZ.position.set(h.x - .5, h.y + 1.6 + (L.T % 1) * 1.2, h.z + .8); ZZ.lookAt(camera.position);
  orb(L.k, V(KB.x - 1.4, 1.8, KB.z), null, [8.5, .1, .25, 44], [7.6, .02, .22, 44]); POST.push(() => ZZ.lookAt(camera.position)); }, [[0, 'snore', .45], [.6, 'zzz', .35]]);
// 60 «bequemer als das Bett.»: Svenja da vueltas en la cama, despierta y gruñona; él ronca feliz
shot(79.83, 'Z', null, L => { home(L, { night: 1 }); svBed(L, { aLx: 2.4, aLz: .5, aLe: 1.8 }); sv.root.rotation.z = Math.sin(L.T * 4) * .25; show(BLANK, WX + 10, 3.2, -4.4, 0); cara(sv, L.T, { expr: 'angry', eyes: 'squint', mouth: 'frown' }); inBasket(L); cara(me, L.T, { eyes: 'closed', mouth: 'smile' }); FILL.intensity = 34;
  cm([WX + 14, 10.6, 2], [WX + 13.4, 10.2, 1], L.k); camera.lookAt(WX + 8.4, 3.0, -6.6); camera.fov = 46; }, [[0, 'bed_creak', .45], [.4, 'snore', .35]]);
// ---------- c: restaurante, compras, «no solo a mí»: Gartencenter, tren, gimnasio, oficina, los abuelos (81,25 – 125,69 s) ----------
// restaurante: mesa principal en (RX, 0); Svenja en z = -3.9 (mira +z), Lukas en z = +3.9 (mira -z), camarero a +x
const restSet = (L, o = {}) => { rest(L); RE.SOUP.visible = !!o.soup; if (o.soup) RE.SOUP.position.set(0, 3.78, 1.9);
  put(sv, RX, sitY(sv, 2.45), -3.9, 0); actuar(sv, 0, [[0, seatPose(o.sv || { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2 })]], { T: L.T });
  put(me, RX, sitY(me, 2.45), 3.9, PI); actuar(me, 0, [[0, seatPose(o.me || { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2 })]], { T: L.T }); };
// 61 «Im Restaurant bestellt Svenja für mich.»: Svenja pide señalando la carta; el camarero apunta; Lukas calla
shot(81.25, 'F', null, L => { restSet(L, { sv: { aRx: 1.5, aRz: .25, aRe: .1, aLx: .9, aLe: 1.2, headY: .4 } }); talk(sv, L.T, 81.3, 82.8, 'happy'); cara(me, L.T, { expr: 'neutral', eyes: 'side_l', mouth: 'flat' });
  put(kel, RX + 4.4, 0, -.6, -PI / 2); actuar(kel, 0, [[0, { aLx: 1.3, aLe: 1.6, aLz: -.2, aRx: 1.2, aRe: 1.5, aRz: -.3, headX: .25 }]], { T: L.T }); cara(kel, L.T, { expr: 'neutral', eyes: 'down' }); inHand(NOTE, kel, 'L', [0, -.6, .4], [-.4, 0, 0], .6);
  cm([RX - 13, 7.2, 3], [RX - 12, 7, 2.2], L.k); camera.lookAt(RX + .8, 4.4, -.2); camera.fov = 46; }, [[0, 'cafeteria', .45], [.5, 'pencil', .35]]);
// 62 «Ich wusste gar nicht,»: el camarero le pone una sopa verde delante
shot(82.85, 'S', null, L => { const t = clamp(L.lt / .5); restSet(L, { soup: 1 }); RE.SOUP.position.set(lerp(3.2, 0, t), 3.78 + Math.sin(t * PI) * .6, lerp(.6, 1.9, t)); cara(me, L.T, { expr: 'confused', eyes: 'down', mouth: 'o' }); cara(sv, L.T, { expr: 'smug' });
  put(kel, RX + 4.0, 0, 1.2, -PI / 2 - .4); actuar(kel, 0, [[0, { aRx: lerp(1.4, .6, t), aRe: .3, aLx: .3, lean: .2 * (1 - t) }]], { T: L.T }); cara(kel, L.T, { expr: 'happy', mouth: 'smile' });
  cm([RX + 7, 7.6, 10.4], [RX + 6.2, 7.2, 9.4], L.k); camera.lookAt(RX + .4, 4.6, 2.4); camera.fov = 44; }, [[0, 'plate_slide', .5], [.3, 'porcelain', .4]]);
// 63 «dass ich Gemüsesuppe mag.»: la sopa delante y Lukas detrás, cuchara en mano, sin entender
shot(83.82, 'W', null, L => { restSet(L, { soup: 1, me: { aRx: 1.3, aRe: 1.2, aLx: .9, aLe: 1.2 } }); cara(me, L.T, { expr: 'confused', eyes: 'side_r', mouth: 'flat' }); inHand(SPOON, me, 'R', [0, -.5, .2], [PI / 2, 0, 0]);
  badge('green', 'GEMÜSESUPPE', W * .5, H * .17, clamp((L.T - 83.96) / .12), 1, .75); cm([RX + .4, 6.2, -1.6], [RX + .35, 6.0, -1.0], L.k); camera.lookAt(RX, 4.8, 4.4); camera.fov = 44; }, [[0, 'spoon', .45], [.5, 'hmm', .35]]);
// 64 «Ehrlich gesagt weiß ich es immer noch nicht.»: prueba la cucharada… y se encoge de hombros
shot(85.04, 'Z', null, L => { restSet(L, { soup: 1, me: { aRx: 2.2, aRz: -.3, aRe: 2.1, aLx: .45, aLz: .6, aLe: 1.4, headZ: .15 } }); inHand(SPOON, me, 'R', [0, -.5, .2], [PI / 2, 0, 0]); cara(me, L.T, { expr: 'confused', eyes: 'squint', mouth: 'o' }); cara(sv, L.T, { expr: 'happy' });
  badge('q', '?', W * .5, H * .2, clamp((L.T - 85.6) / .12)); onFace(me, 5.6, .1, .5, 42, L.k, 5.0); }, [[0, 'sip', .45], [.6, 'hmm', .35]]);
// compras: acera de las tiendas (este, x ≈ 36), escaparates con toldo en x ≈ 43; caminan hacia +z
const SHP = V(35.5, 0, -16);
const shopWalk = (L, extra = {}) => { const z = SHP.z + L.T * 1.6 - 87 * 1.6 * 0; const p = V(SHP.x, 0, SHP.z + (L.T - 86.89) * 1.6); walkTo(me, p.x, p.z, 0, 0, L, 0, 7); actuar(me, 0, [[0, { ...walkP(L.T, 0, 7), aLx: .25, aRx: .25, aLz: .35, aRz: .35, aLe: .3, aRe: .3, ...extra }]], { T: L.T }); return p; };
const hangBags = (p, n = 16) => { for (let i = 0; i < n; i++) { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2); const ring = k % 4, tier = Math.floor(k / 4); show(BAGS[i], p.x + side * (1.6 + ring * .35 + tier * .2), .9 + tier * 1.25 - ring * .1, p.z + (ring - 1.5) * .7, side * .3 + ring * .2, .95); } };
// 65 «Beim Shoppen trage ich 16 Tüten,»: Lukas, de pie, cargado con 16 bolsas; Svenja pasea delante
shot(86.89, 'C', null, L => { town(L); const p = shopWalk(L); hangBags(p); cara(me, L.T, { expr: 'worried', mouth: 'frown' }); sweat(me, L.T, 2);
  walkTo(sv, SHP.x - .6, SHP.z + 7, 0, 1.6, L, 1); cara(sv, L.T, { expr: 'happy' }); inHand(CUPS[2], sv, 'L', [0, -.75, .25]);
  badge('num', '16', W * .5, H * .17, clamp((L.T - 87.77) / .12)); orb(L.k, V(p.x, 3.4, p.z + 1.6), null, [17, -.75, .1, 48], [15, -.65, .08, 48]); sh(p, 24); }, [[0, 'paper', .45], [.4, 'steps', .4], [.9, 'strain', .3]]);
// 66 «ihre Handtasche und ihren Mantel.»: encima, el bolso colgado del cuello y el abrigo sobre la cabeza
shot(88.79, 'I', null, L => { town(L); const p = shopWalk(L); hangBags(p); cara(me, L.T, { expr: 'worried', mouth: 'frown', eyes: 'up' }); sweat(me, L.T, 2);
  attach(HANDBAG, me.neck, [0, -.7, .9], [0, 0, 0], 1); if (L.T > 89.6) attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15], 1);
  onFace(me, 6.4, .2, -.6, 46, L.k, 5.6); sh(p, 20); }, [[0, 'zip', .4], [.8, 'cloth', .45]]);
// 67 «Trotzdem fragt sie:»: Svenja se gira con su café
shot(90.52, 'W', null, L => { town(L); const p = V(SHP.x, 0, SHP.z + 6.4); put(sv, p.x - .4, 0, p.z + 5, PI - .3 + Math.min(1, L.lt * 3) * .3); actuar(sv, 0, [[0, { aLx: 1.2, aLe: 1.4, aLz: -.2, aRx: .3 }]], { T: L.T }); inHand(CUPS[2], sv, 'L', [0, -.75, .25]); cara(sv, L.T, { expr: 'happy', mouth: 'smile' });
  put(me, p.x, 0, p.z, 0); hangBags(p); attach(HANDBAG, me.neck, [0, -.7, .9]); attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15]); actuar(me, 0, [[0, { aLx: .25, aRx: .25, aLz: .35, aRz: .35 }]], { T: L.T }); cara(me, L.T, { expr: 'worried' });
  onBody(sv, 11.5, .5, .1, 44, L.k, 10.2); sh(p, 20); }, [[0, 'cloth', .35], [.4, 'steps', .3]]);
// 68 «Kannst du noch kurz meinen Kaffee halten?»
shot(91.57, 'S', null, L => { town(L); const p = V(SHP.x, 0, SHP.z + 6.4); put(sv, p.x - .4, 0, p.z + 4.4, PI); actuar(sv, 0, [[0, { aLx: 1.5, aLe: .3, aLz: -.1, aRx: .3, headZ: .12 }]], { T: L.T }); inHand(CUPS[2], sv, 'L', [0, -.75, .25]); talk(sv, L.T, 91.57, 93.0, 'happy');
  bubble(sv, 'Kaffee halten?', clamp((L.lt - .05) / .1), 1.2); put(me, p.x, 0, p.z, 0); hangBags(p); attach(HANDBAG, me.neck, [0, -.7, .9]); attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15]); cara(me, L.T, { expr: 'shock', mouth: 'o' }); actuar(me, 0, [[0, { aLx: .25, aRx: .25, aLz: .35, aRz: .35 }]], { T: L.T });
  orb(L.k, V(p.x - .2, 4.4, p.z + 2.2), null, [15, -1.2, .1, 46], [13.6, -1.1, .08, 46]); sh(p, 20); }, [[0, 'sip', .35], [.2, 'pop', .4]]);
// 69 «Weil meine Hände voll sind,»: las manos, llenas de asas de bolsas
shot(93.25, 'F', null, L => { town(L); const p = V(SHP.x, 0, SHP.z + 6.4); put(me, p.x, 0, p.z, 0); hangBags(p); attach(HANDBAG, me.neck, [0, -.7, .9]); attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15]); actuar(me, 0, [[0, { aLx: .45, aRx: .45, aLz: .55, aRz: .55, aLe: .3, aRe: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', eyes: 'down' });
  orb(L.k, V(p.x, 2.6, p.z), null, [10.5, .1, .16, 48], [9.6, -.05, .14, 48]); sh(p, 16); }, [[0, 'paper', .5], [.5, 'strain', .35]]);
// 70 «halte ich ihn eben mit dem Mund.» (golpe de zoom): el café en la boca, ojos de esfuerzo
shot(94.45, 'C', 'punch', L => { town(L); const p = V(SHP.x, 0, SHP.z + 6.4); put(me, p.x, 0, p.z, 0); hangBags(p); attach(HANDBAG, me.neck, [0, -.7, .9]); attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15]); actuar(me, 0, [[0, { aLx: .25, aRx: .25, aLz: .35, aRz: .35, headX: -.12 }]], { T: L.T });
  cara(me, L.T, { expr: 'determined', eyes: 'squint', mouth: 'o' }); attach(CUPS[2], me.head, [0, .36, 1.1], [PI / 2, 0, 0], 1); sweat(me, L.T, 2);
  onFace(me, 4.6, 0, .3, 42, L.k, 4.1); sh(p, 14); }, [[0, 'gulp', .45], [.3, 'cup_rattle', .4]]);
// 71 «Und es geht nicht nur mir so.»: la plaza: más hombres cargados y con correa
shot(95.79, 'R', null, L => { town(L); for (let i = 0; i < 6; i++) pair(L, FR[i + 6], MA[i + 10], -16 + i * 6, -4 + (i % 2) * 8, PI * (i % 2) + .1, 2.2, i);
  for (let i = 0; i < 3; i++) { const m = MA[i + 20]; walkTo(m, -10 + i * 8, 16, PI / 2 * (i % 2 ? 1 : -1), 1.6, L, i, 7); cara(m, L.T + i, { expr: 'worried', mouth: 'frown' }); const pp = m.root.position; for (let k = 0; k < 2; k++) show(BAGS[i * 2 + k], pp.x + (k ? 1.7 : -1.7), .9, pp.z, k, .95); }
  orb(L.k, V(0, 2, 6), null, [44, .35, .45, 46], [38, .25, .4, 46]); sh(V(0, 0, 6), 40); }, [[0, 'city_amb', .45], [.4, 'chain_rattle', .35]]);
// 72 «Im Gartencenter bekommen Männer nur etwas,»: la cajera se cruza de brazos ante un cliente con su planta
const KAS = V(GX + 7, 0, -7);
shot(97.2, 'W', null, L => { garden(L); put(gae, KAS.x, 0, KAS.z - 2.4, 0); actuar(gae, 0, [[0, GEST.cross]], { T: L.T }); cara(gae, L.T, { expr: 'angry', mouth: 'frown', eyes: 'squint' }); MA[12].dog = true;
  put(MA[12], KAS.x - 1.4, 0, KAS.z + 4.4, PI + .35); actuar(MA[12], 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(MA[12], L.T, { expr: 'worried', mouth: 'o' }); const pl = WO.g;
  badge('red', 'NEIN!', W * .5, H * .17, clamp((L.T - 98.24) / .12), 1, .8);
  cm([GX - 4, 8.4, 6], [GX - 3.2, 8, 5], L.k); camera.lookAt(KAS.x - .4, 4.6, KAS.z); camera.fov = 46; }, [[0, 'cash_reg', .35], [.5, 'hmm', .35]]);
// 73 «wenn sie einen Zettel von ihrer Frau dabeihaben.»: el cliente enseña el «Einkaufszettel»; la cajera asiente
shot(99.1, 'S', null, L => { garden(L); put(gae, KAS.x, 0, KAS.z - 2.4, 0); const ok = L.T > 100.2; actuar(gae, 0, [[0, ok ? { aRx: 1.6, aRz: .1, aRe: .4, aLx: .3 } : { aLx: .3, aRx: .3, headX: .2 }]], { T: L.T }); cara(gae, L.T, { expr: ok ? 'happy' : 'sus', mouth: ok ? 'smile' : 'flat', eyes: ok ? 'happy' : 'squint' });
  put(MA[12], KAS.x - .6, 0, KAS.z + 3.2, PI + .2); actuar(MA[12], 0, [[0, { aRx: 1.7, aRe: .4, aRz: -.1, aLx: .4 }]], { T: L.T }); cara(MA[12], L.T, { expr: 'happy', mouth: 'grin' });
  POST.push(() => { const h = wpos(MA[12].aR.hand); show(NOTE, h.x, h.y + .9, h.z - .2, 0, 1.2); NOTE.lookAt(camera.position); });
  cm([KAS.x + 4.6, 7.6, KAS.z + 9], [KAS.x + 4, 7.4, KAS.z + 8.2], L.k); camera.lookAt(KAS.x - .6, 5.2, KAS.z + 1); camera.fov = 44; }, [[0, 'paper', .5], [.9, 'cash_reg', .45], [1.2, 'ding_soft', .3]]);
// tren: Lukas sentado en la fila z = 3, junto al pasillo (x = ZX - 3.6), mira +z
const SEAT = V(ZX - 3.6, 0, 3.4);
const trainSet = (L, pose = {}) => { train(L); put(me, SEAT.x, sitY(me, 3.1), SEAT.z, 0); actuar(me, 0, [[0, seatPose({ aLx: .5, aLe: .9, ...pose })]], { T: L.T }); put(FR[9], SEAT.x - 2.8, sitY(FR[9], 3.1), SEAT.z, 0); actuar(FR[9], 0, [[0, seatPose({ aLx: 1.0, aRx: 1.0, aLe: 1.4, aRe: 1.4, headX: .3 })]], { T: L.T }); cara(FR[9], L.T, { expr: 'neutral', eyes: 'down' }); };
// 74 «Der Schaffner im Zug»: el revisor avanza por el pasillo; Lukas le tiende el billete
shot(101.16, 'F', null, L => { trainSet(L, { aRx: 1.5, aRe: .2, aRz: -.15 }); inHand(TICKET, me, 'R', [0, -.75, .3], [-PI / 2, 0, 0], 1.1); cara(me, L.T, { expr: 'happy', mouth: 'smile' });
  walkTo(sch, ZX + .6, 13, PI, 2.6, L, 0, 8); cara(sch, L.T, { expr: 'neutral' }); cm([ZX + 2.6, 8.6, -7], [ZX + 2.4, 8.2, -6], L.k); camera.lookAt(ZX - 1.4, 4.8, 6); camera.fov = 50; }, [[0, 'wheels', .45], [.4, 'steps', .35]]);
// 75 «will nicht meine Fahrkarte sehen.»: el revisor aparta el billete con la mano sin mirarlo
shot(102.3, 'Z', null, L => { trainSet(L, { aRx: 1.5, aRe: .2, aRz: -.15 }); inHand(TICKET, me, 'R', [0, -.75, .3], [-PI / 2, 0, 0], 1.1); cara(me, L.T, { expr: 'confused', mouth: 'o' });
  put(sch, ZX + .4, 0, SEAT.z + 4.2, faceTo(V(ZX + .4, 0, SEAT.z + 4.2), V(SEAT.x, 0, SEAT.z)) ); actuar(sch, 0, [[0, { aRx: 1.3, aRz: .5 + Math.sin(L.T * 8) * .25, aRe: .3, aLx: .3, headY: -.3 }]], { T: L.T }); cara(sch, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'flat' });
  badge('red', 'EGAL!', W * .5, H * .17, clamp((L.T - 102.8) / .12), 1, .75); cm([ZX + 4, 7.6, -4], [ZX + 3.4, 7.4, -3.2], L.k); camera.lookAt(SEAT.x + 1.6, 4.8, SEAT.z + 2.4); camera.fov = 48; }, [[0, 'paper', .45], [.5, 'swipe', .3]]);
// 76 «Stattdessen fragt er:»: el revisor se inclina hacia Lukas, desconfiado
shot(103.75, 'C', null, L => { trainSet(L); cara(me, L.T, { expr: 'worried', mouth: 'flat' }); put(sch, ZX + .2, 0, SEAT.z + 3.6, faceTo(V(ZX + .2, 0, SEAT.z + 3.6), V(SEAT.x, 0, SEAT.z))); actuar(sch, 0, [[0, { lean: .35, headX: -.1, aLx: .3, aRx: .9, aRe: 1.2 }]], { T: L.T }); cara(sch, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  onFace(sch, 5.6, -.2, -.8, 44, L.k, 5.0); }, [[0, 'hmm', .45]]);
// 77 «Weiß deine Frau, wo du bist?»: bocadillo; Lukas suda
shot(104.61, 'I', null, L => { trainSet(L, { aLx: 1.2, aRx: 1.2, aLe: 1.8, aRe: 1.8 }); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); sweat(me, L.T, 3); put(sch, ZX + .2, 0, SEAT.z + 3.6, faceTo(V(ZX + .2, 0, SEAT.z + 3.6), V(SEAT.x, 0, SEAT.z))); actuar(sch, 0, [[0, { lean: .35, headX: -.1, aRx: 1.4, aRe: .3, aRz: -.2 }]], { T: L.T });
  talk(sch, L.T, 104.61, 106.1, 'sus'); bubble(sch, 'Weiß deine Frau, wo du bist?', clamp((L.lt - .05) / .1), 1.0);
  cm([SEAT.x + 3.4, 6.8, SEAT.z + 8.8], [SEAT.x + 3.2, 6.6, SEAT.z + 8.0], L.k); camera.lookAt(SEAT.x + 1.6, 5.0, SEAT.z + 1.4); camera.fov = 48; }, [[0, 'gasp', .35], [.5, 'heartbeat', .35]]);
// gimnasio
const GB = V(MX, 0, 1);
// 78 «Der Bodybuilder im Fitnessstudio»: el culturista levanta la barra por encima de la cabeza
shot(106.24, 'W', null, L => { gymS(L); put(bb, GB.x, 0, GB.z, 0); const up = (Math.sin(L.T * 3) + 1) / 2; actuar(bb, 0, [[0, { aLx: 2.4 + up * .5, aRx: 2.4 + up * .5, aLz: .7, aRz: .7, aLe: 1.4 - up * 1.0, aRe: 1.4 - up * 1.0, crouch: .1 * (1 - up) }]], { T: L.T }); cara(bb, L.T, { expr: 'determined', mouth: 'grin' });
  POST.push(() => { const a = wpos(bb.aL.hand), b = wpos(bb.aR.hand); show(BAR, (a.x + b.x) / 2, (a.y + b.y) / 2 - .2, (a.z + b.z) / 2, 0, 1); });
  for (let i = 0; i < 3; i++) { const m = MA[24 + i]; put(m, GB.x - 9 + i * 9, 0, GB.z - 9, .1); actuar(m, 0, [[0, i === 1 ? GEST.cheer : { aRx: 1.2, aRe: 1.8 + Math.sin(L.T * 4 + i) * .4, aLx: .3 }]], { T: L.T }); cara(m, L.T + i, { expr: 'happy' }); }
  onBody(bb, 16, .25, .12, 46, L.k, 14); }, [[0, 'strain', .45], [.5, 'metal_hit', .3]]);
// 79 «hat 130 Kilo Muskeln.»: posa sacando bíceps: «130 KG»
shot(107.74, 'S', null, L => { gymS(L); put(bb, GB.x, 0, GB.z, 0); actuar(bb, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: 1.3, aRz: 1.3, aLe: 2.2, aRe: 2.2, headY: .3 + Math.sin(L.T * 3) * .15, lean: -.05 }]], { T: L.T }); grin(bb, L.T);
  badge('num', '130 KG', W * .5, H * .16, clamp((L.T - 107.92) / .12)); onBody(bb, 13.5, -.25, .1, 44, L.k, 12); }, [[0, 'stretch', .4], [.3, 'ding_reveal', .4]]);
// 80 «Doch seine Freundin pfeift»: Kim, en la puerta, silba con dos dedos: «PFIFF!»
shot(109.62, 'Z', null, L => { gymS(L); put(kim, GB.x + 8, 0, GB.z + 6, -PI / 2 - .4); actuar(kim, 0, [[0, { aRx: 2.6, aRz: -.5, aRe: 2.4, aLx: .3, aLz: .3, headX: -.05 }]], { T: L.T }); cara(kim, L.T, { expr: 'smug', eyes: 'squint', mouth: 'o' });
  badge('gold', 'PFIFF!', W * .5, H * .17, clamp((L.T - 110.62) / .1), 1, .8); onBody(kim, 10.5, .2, .1, 42, L.k, 9.4); }, [[1.0, 'whistle', .7]]);
// 81 «ein einziges Mal,»: el culturista se congela con la barra en alto; ojos como platos
shot(110.96, 'C', null, L => { gymS(L); put(bb, GB.x, 0, GB.z, 0); actuar(bb, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .7, aRz: .7, aLe: .4, aRe: .4, headY: .5 }]], { T: L.T }); cara(bb, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  POST.push(() => { const a = wpos(bb.aL.hand), b = wpos(bb.aR.hand); show(BAR, (a.x + b.x) / 2, (a.y + b.y) / 2 - .2, (a.z + b.z) / 2, 0, 1); }); onFace(bb, 5.4, .2, .4, 44, L.k, 4.8); }, [[0, 'freeze', .45]]);
// 82 «und schon lässt er die Hantel fallen»: la barra cae al suelo; polvo
shot(112.1, 'F', null, L => { gymS(L); put(bb, GB.x, 0, GB.z, .5); const t = clamp((L.T - 112.5) / .35); actuar(bb, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, headY: .7 }]], { T: L.T }); cara(bb, L.T, { expr: 'happy', mouth: 'open_smile' });
  show(BAR, GB.x, lerp(8.6, .9 * 1.3, easeIn(t)), GB.z + 1.2, 0, 1); dust(V(GB.x, 0, GB.z + 1.2), 112.85, L.T, 12, 1); orb(L.k, V(GB.x, 3.4, GB.z), null, [18, -.35, .12, 46], [16, -.45, .1, 46]); }, [[.7, 'metal_hit', .65], [.75, 'boom', .45]]);
// 83 «und rennt.»: corre hacia Kim a toda velocidad, feliz
shot(113.44, 'W', null, L => { gymS(L); const t = L.lt; put(bb, GB.x + t * 9, Math.abs(Math.sin(L.T * 12)) * .3, GB.z + t * 4, 1.15); actuar(bb, 0, [[0, { ...walkP(L.T, 0, 16), aLx: 1.6, aRx: -.6, lean: .3 }]], { T: L.T }); laughF(bb, L.T);
  put(kim, GB.x + 12, 0, GB.z + 6.5, -PI / 2 - .4); actuar(kim, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: .6, aRz: .6 }]], { T: L.T }); cara(kim, L.T, { expr: 'smug', mouth: 'smile' }); show(BAR, GB.x, .9 * 1.3, GB.z + 1.2, 0, 1); dust(V(GB.x + t * 9, 0, GB.z + t * 4), 113.5, L.T, 6, .6);
  orb(L.k, V(GB.x + 6, 3.6, GB.z + 4), null, [20, .2, .12, 48], [18, .25, .1, 48]); }, [[0, 'steps_heavy', .55], [.3, 'whoosh', .3]]);
// oficina
const MT = V(OX, 0, -2);
const meetSet = (L, o = {}) => { office(L); put(chef, OX + 2.2, 0, -12.2, -.15); for (let k = 0; k < 6; k++) { const s = k % 2 ? 1 : -1, m = MA[12 + k]; put(m, OX + s * 4.8, sitY(m, 2.8), MT.z - 7 + Math.floor(k / 2) * 4.6, -s * PI / 2); actuar(m, 0, [[0, seatPose({ aLx: 1.1, aRx: 1.1, aLe: 1.4, aRe: 1.4, headY: s * .5 })]], { T: L.T }); cara(m, L.T + k, { expr: o.ex || 'neutral', mouth: o.mo, eyes: o.ey }); } };
// 84 «Mein Chef bekommt mitten im Meeting»: el jefe presenta los gráficos ante la mesa
shot(114.21, 'S', null, L => { meetSet(L); actuar(chef, 0, [[0, { aLx: 1.5, aLz: .5, aLe: .2, aRx: .4, aRe: .6, headY: .3 }]], { T: L.T }); talk(chef, L.T, 114.2, 115.4, 'happy');
  cm([OX + 1, 10, 13], [OX + 1, 9.6, 11.6], L.k); camera.lookAt(OX + .6, 5.4, -7); camera.fov = 48; }, [[0, 'murmur', .35], [.4, 'click_set', .35]]);
// 85 «einen Anruf.»: le vibra el móvil: «SCHATZ ♥ ruft an»
shot(115.45, 'Z', null, L => { meetSet(L); actuar(chef, 0, [[0, holdPhone]], { T: L.T }); cara(chef, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); phoneAt(chef, 'SCHATZ|ruft an...|', 1.9, -.6, 1.1); PHONE.rotation.z = Math.sin(L.T * 60) * .04;
  onFace(chef, 6.4, -.4, .2, 44, L.k, 5.6); }, [[0, 'phone_ring', .55], [.2, 'vibrate', .45]]);
// 86 «Ja, Schatz.»: contesta con voz de corderito
shot(116.63, 'C', null, L => { meetSet(L, { ex: 'confused' }); actuar(chef, 0, [[0, { ...GEST.phone, headX: .2, lean: .1 }]], { T: L.T }); cara(chef, L.T, { expr: 'worried', eyes: 'down', mouth: 'smile', blush: 1 }); bubble(chef, 'Ja, Schatz.', clamp((L.lt - .02) / .1), 1.2);
  onFace(chef, 5.6, -.1, -.5, 44, L.k, 5.0); }, [[0, 'whisper', .25]]);
// 87 «Fünf Minuten später»: el reloj de pared gira: «5 MINUTEN SPÄTER»
shot(117.33, 'Z', null, L => { meetSet(L, { ex: 'confused' }); actuar(chef, 0, [[0, { ...GEST.phone, headX: .2 }]], { T: L.T }); cara(chef, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  badge('tag', '5 MINUTEN SPÄTER', W * .5, H * .2, clamp((L.lt - .05) / .12)); TINT = 'rgba(30,40,80,.18)'; cm([OX - 6, 9, 8], [OX - 5, 8.6, 7], L.k); camera.lookAt(OX + 1.4, 5.6, -10); camera.fov = 46; }, [[0, 'clock_spin', .55]]);
// 88 «hat er die Firma verkauft.» (zoom lento): la pantalla: «FIRMA VERKAUFT»; todos alucinan
shot(118.59, 'F', 'slow', L => { meetSet(L, { ex: 'shock', mo: 'o', ey: 'wide' }); BU.SCR.userData.set('sold'); actuar(chef, 0, [[0, { aRx: 2.7, aRz: .4, aRe: .4, aLx: .3 }]], { T: L.T }); grin(chef, L.T);
  cm([OX + 1, 9, 12], [OX + .8, 8.6, 9], L.k, easeIn); camera.lookAt(OX + .6, 6.4, -12); camera.fov = 48; }, [[0, 'gasp', .45], [.3, 'cash', .35]]);
// abuelos en el banco del parque (-14, -10 respecto al parque), mirando +z
const BEN = V(PX - 14, 0, -10);
const bench2 = (L, opaPose = {}, omaPose = {}) => { parkS(L); put(opa, BEN.x + 1.6, sitY(opa, 2.45), BEN.z - .2, 0); put(oma, BEN.x - 1.6, sitY(oma, 2.45), BEN.z - .2, 0); actuar(opa, 0, [[0, seatPose({ aLx: .8, aRx: .8, aLe: 1.2, aRe: 1.2, ...opaPose })]], { T: L.T }); actuar(oma, 0, [[0, seatPose({ aLx: .9, aLe: 1.4, aRx: 1.3, aRe: .8, aRz: .2, ...omaPose })]], { T: L.T }); };
// 89 «Opa ist sogar schon seit 47 Jahren»: Oma habla sin parar; Opa asiente (con collar): «47 JAHRE»
shot(119.65, 'W', null, L => { bench2(L, { headX: Math.max(0, Math.sin(L.T * 5)) * .25 }, { aRx: 1.3 + Math.sin(L.T * 7) * .3, headY: .4 }); talk(oma, L.T, 119.6, 121.7, 'happy'); cara(opa, L.T, { expr: 'neutral', eyes: 'half', mouth: 'flat' });
  bubble(oma, 'Bla bla bla…', clamp((L.lt - .1) / .1), 1.1); badge('num', '47 JAHRE', W * .5, H * .16, clamp((L.T - 120.67) / .12), 1, .9); orb(L.k, V(BEN.x, 3.6, BEN.z), null, [14, .15, .1, 46], [12.6, .05, .08, 46]); sh(BEN, 18); }, [[0, 'birds', .4], [.5, 'murmur', .3]]);
// 90 «ein Good Boy.»: primer plano de Opa con su collar, asintiendo obediente
shot(121.73, 'S', null, L => { bench2(L, { headX: Math.max(0, Math.sin(L.T * 6)) * .3 }); cara(opa, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' }); talk(oma, L.T, 121.7, 122.6, 'happy');
  onFace(opa, 4.6, -.1, .4, 42, L.k, 4.1); sh(BEN, 14); }, [[0, 'chain_rattle', .35]]);
// 91 «Deshalb weiß keiner mehr,»: los vecinos miran a Opa, intrigados
shot(122.6, 'I', null, L => { bench2(L); cara(opa, L.T, { expr: 'neutral', mouth: 'flat' }); cara(oma, L.T, { expr: 'happy' }); [[FR[10], -4.6, 6, PI - .4], [MA[21], 0, 7.4, PI], [FR[11], 4.8, 6, PI + .4]].forEach(([c, dx, dz, ry], i) => { put(c, BEN.x + dx, 0, BEN.z + dz, ry); actuar(c, 0, [[0, i === 1 ? GEST.think : GEST.shrug]], { T: L.T }); cara(c, L.T + i, { expr: 'confused' }); });
  badge('q', '?', W * .5, H * .2, clamp((L.lt - .1) / .12)); cm([BEN.x + 2, 7.4, BEN.z - 7.6], [BEN.x + 1.6, 7.2, BEN.z - 6.8], L.k); camera.lookAt(BEN.x, 3.6, BEN.z + 4); camera.fov = 48; sh(BEN, 18); }, [[0, 'hmm', .4], [.4, 'murmur', .3]]);
// 92 «wie seine Stimme klingt.»: Opa abre la boca… y no sale nada: «…»
shot(123.66, 'Z', null, L => { bench2(L, { headX: -.1 }); cara(opa, L.T, { expr: 'neutral', eyes: 'wide', mouth: L.T > 123.9 ? 'o' : 'flat' }); cara(oma, L.T, { expr: 'happy' }); bubble(opa, '…', clamp((L.T - 124.0) / .1), 1.1);
  onFace(opa, 5.0, -.1, -.3, 42, L.k, 4.4); sh(BEN, 14); }, [[0, 'crickets', .45]]);
// 93 «Nicht mal Oma.»: Oma se encoge de hombros
shot(124.65, 'C', null, L => { bench2(L, {}, GEST.shrug); cara(oma, L.T, { expr: 'confused', mouth: 'flat' }); cara(opa, L.T, { expr: 'neutral' }); onFace(oma, 5.2, -.1, .3, 42, L.k, 4.6); sh(BEN, 14); }, [[0, 'laugh_old', .3]]);
// ---------- d: Benni y la caseta, la revolución en el Marktplatz, el final (125,69 – 161,2 s) ----------
const GD = V(PX, 0, 80);                 // jardín de Benni (terraza en z ≈ 98, caseta en (PX + 4, 84) mirando +z)
const HUT = V(PX + 4, 0, 84);
// 94 «Und Benni hat ein einziges Mal»: en la terraza, Benni (de pie) y Jana, cara a cara
shot(125.69, 'W', null, L => { parkS(L); put(ben, GD.x - 2.4, 0, GD.z + 12, PI / 2 + .3); put(jana, GD.x + 2.4, 0, GD.z + 12, -PI / 2 - .3); actuar(ben, 0, [[0, { aLx: .3, aRx: .3, headX: -.05 }]], { T: L.T }); actuar(jana, 0, [[0, { aRx: 1.4, aRz: -.1, aRe: .2, aLx: .4, aLz: .6, aLe: 1.8 }]], { T: L.T });
  cara(ben, L.T, { expr: 'determined', mouth: 'flat' }); talk(jana, L.T, 125.7, 127.2, 'happy'); bubble(jana, 'Gassi!', clamp((L.lt - .2) / .1), 1.2);
  orb(L.k, V(GD.x, 3.6, GD.z + 12), null, [16, 0, .1, 46], [14.4, .08, .08, 46]); sh(V(GD.x, 0, GD.z + 10), 20); }, [[0, 'birds', .35], [.3, 'wind_trees', .3]]);
// 95 «Nein zu seiner Freundin gesagt.»: «Nein.» — Jana, en shock
shot(127.29, 'C', null, L => { parkS(L); put(ben, GD.x - 2.4, 0, GD.z + 12, PI / 2 + .3); put(jana, GD.x + 2.4, 0, GD.z + 12, -PI / 2 - .3); actuar(ben, 0, [[0, GEST.cross]], { T: L.T }); actuar(jana, 0, [[0, GEST.shock]], { T: L.T });
  const k = clamp((L.T - 127.29) / .1); talk(ben, L.T, 127.29, 127.6, 'determined'); cara(jana, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); bubble(ben, 'Nein.', k, 1.2);
  onBody(ben, 10.6, .45, .1, 44, L.k, 9.6); sh(V(GD.x, 0, GD.z + 10), 18); }, [[0, 'gasp_f', .5], [.3, 'braam_short', .4]]);
// 96 «Seitdem wohnt er in der Hundehütte»: el jardín: la caseta grande y Benni asomado, triste
shot(128.97, 'F', null, L => { parkS(L); put(ben, HUT.x, 0, HUT.z + 2.6, 0); actuar(ben, 0, [[0, SITZ({ headX: .25, aLx: 1.5, aRx: 1.5, aLe: 1.3, aRe: 1.3 })]], { T: L.T }); cara(ben, L.T, { expr: 'sad', mouth: 'frown' });
  cm([HUT.x - 10, 9, HUT.z + 22], [HUT.x - 8.6, 8.4, HUT.z + 20], L.k); camera.lookAt(HUT.x - 1, 4.4, HUT.z + 1); camera.fov = 46; sh(HUT, 22); }, [[0, 'wind', .35], [.5, 'sigh', .35]]);
// 97 «im Garten.»: más cerca: Benni come de su cuenco, abatido
shot(130.2, 'Z', null, L => { parkS(L); put(ben, HUT.x, 0, HUT.z + 2.8, -.25); actuar(ben, 0, [[0, DOGP(L.T, 0, { headX: .6 })]], { T: L.T }); cara(ben, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' }); tears(ben, L.T);
  orb(L.k, V(HUT.x + 1.2, 2.4, HUT.z + 3.6), null, [11, .35, .14, 44], [9.8, .25, .12, 44]); sh(HUT, 16); }, [[0, 'chew', .3], [.4, 'sad_tone', .3]]);
// 98 «Mit Namensschild.» (golpe de zoom): el cartel «BENNI» sobre la puerta
shot(131.15, 'C', 'punch', L => { parkS(L); put(ben, HUT.x, 0, HUT.z + 1.6, 0); actuar(ben, 0, [[0, SITZ({ headX: -.3 })]], { T: L.T }); cara(ben, L.T, { expr: 'sad', eyes: 'up', mouth: 'flat' });
  cm([HUT.x + .6, 8.2, HUT.z + 12], [HUT.x + .5, 8.0, HUT.z + 11], L.k); camera.lookAt(HUT.x, 6.8, HUT.z); camera.fov = 40; sh(HUT, 14); }, [[0, 'stamp', .5]]);
// 99 «Da hatte ich genug.»: Lukas se pone de pie de golpe, puños apretados
shot(132.19, 'S', null, L => { home(L); const k = easeOut(clamp(L.lt / .35)); put(me, WX - 2, 0, 2, 0); actuar(me, 0, [[0, mixP(DOGP(L.T, 0), GEST.fists, k)]], { T: L.T }); cara(me, L.T, { expr: 'angry', mouth: 'frown' });
  onBody(me, 11, .2, .12, 44, L.k, 9.6); }, [[0, 'stretch_creak', .4], [.3, 'fist', .45]]);
// 100 «Also habe ich heimlich»: de noche, a la luz del flexo, Lukas dibuja a escondidas
const DK = V(WX - 1, 0, -12);
shot(133.27, 'I', null, L => { home(L, { night: 1 }); put(me, DK.x, sitY(me, 2.6), DK.z + 3.4, PI); actuar(me, 0, [[0, seatPose({ aLx: 1.2, aRx: 1.3 + Math.sin(L.T * 14) * .1, aLe: 1.1, aRe: 1.0, lean: .25, headX: .35 })]], { T: L.T }); cara(me, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' });
  show(PLAN, DK.x, 4.28, DK.z + .6, 0, .9); FILL.intensity = 70; FILL.color.setRGB(1, .85, .6); cm([DK.x + 5, 7.8, DK.z + 6], [DK.x + 4.4, 7.6, DK.z + 5.4], L.k); camera.lookAt(DK.x, 4.8, DK.z + 2); camera.fov = 48; }, [[0, 'pencil', .5], [.5, 'clock_tick', .3]]);
// 101 «eine Revolution geplant.»: el plan de cerca: «PLAN: REVOLUTION!»
shot(134.47, 'Z', null, L => { home(L, { night: 1 }); show(PLAN, DK.x, 4.28, DK.z + .6, 0, .9); inHand(PEN, me, 'R', [0, -.6, .2]); put(me, DK.x, sitY(me, 2.6), DK.z + 3.4, PI); actuar(me, 0, [[0, seatPose({ aRx: 1.3, aRe: 1.0, lean: .25, headX: .35 })]], { T: L.T }); FILL.intensity = 70; FILL.color.setRGB(1, .85, .6);
  cm([DK.x + .3, 9.6, DK.z + 3.2], [DK.x + .2, 8.8, DK.z + 2.6], L.k); camera.lookAt(DK.x, 4.2, DK.z + .4); camera.fov = 44; }, [[0, 'paper', .45], [.6, 'evil_laugh', .2]]);
// Marktplatz: podio en (-6, -44); Lukas arriba (y = 4.8) mirando +z; los hombres al sur (z ∈ [-36, -8])
const POD0 = V(-6, 4.8, -44);
const menGrid = (L, mode, o = {}) => crowdGrid(L, -6, -36, 7, 5, 4.2, 4.6, { list: MA, mode, face: V(-6, 6, -44), jit: .15, seed: 4, ...o });
// 102 «Am Samstag stehen alle Männer der Stadt»: «SAMSTAG»: los hombres llegan a la plaza
shot(135.49, 'W', null, L => { town(L); for (let i = 0; i < 12; i++) { const m = MA[i]; walkTo(m, -24 + (i % 6) * 8, 8 + Math.floor(i / 6) * 7, PI + (i % 3 - 1) * .1, 3.2, L, i, 9); cara(m, L.T + i, { expr: 'determined' }); }
  badge('tag', 'SAMSTAG', W * .5, H * .17, clamp((L.T - 135.91) / .12)); orb(L.k, V(-6, 3, 2), null, [26, .15, .2, 48], [24, .05, .18, 48]); sh(V(-6, 0, 4), 30); }, [[0, 'crowd_run', .35], [.5, 'steps', .4]]);
// 103 «auf dem Marktplatz,»: plano general: la plaza llena de hombres frente al podio
shot(136.99, 'S', null, L => { town(L); menGrid(L, 'idle'); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'determined' });
  orb(L.k, V(-6, 2, -26), null, [52, .1, .48, 46], [46, .02, .44, 46]); sh(V(-6, 0, -26), 40); }, [[0, 'murmur', .45], [.5, 'shout_crowd', .2]]);
// 104 «und ich stehe oben»: Lukas sube a las cajas
shot(138.73, 'F', null, L => { town(L); menGrid(L, 'idle'); const t = easeOut(clamp(L.lt / .5)); put(me, POD0.x, lerp(2.4, POD0.y, t), POD0.z + lerp(1.6, 0, t), 0); actuar(me, 0, [[0, { lLx: 1.2 * (1 - t), lLk: 1.4 * (1 - t), aLx: .4, aRx: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  orb(L.k, V(POD0.x, 5.6, POD0.z), null, [17, .3, .05, 46], [15.5, .2, .04, 46]); sh(V(-6, 0, -40), 24); }, [[0, 'wood_creak', .5], [.4, 'jump_small', .35]]);
// 105 «mit dem Megafon:»: alza el megáfono
shot(139.59, 'Z', null, L => { town(L); menGrid(L, 'idle'); put(me, POD0.x, POD0.y, POD0.z, 0); const t = easeOut(clamp(L.lt / .3)); actuar(me, 0, [[0, { aRx: lerp(.4, 1.7, t), aRe: lerp(.2, 1.5, t), aRz: -.1, aLx: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'grin' });
  POST.push(() => { const h = hp(me); show(MEGA, h.x + .1, h.y + .3, h.z + 1.4, 0, 1.4); }); onFace(me, 5.6, -.2, .4, 44, L.k, 5.0); sh(V(-6, 0, -40), 20); }, [[0, 'click_metal', .45]]);
// 106 «Ab heute entscheiden wir!» (golpe de zoom): grita por el megáfono
shot(140.68, 'C', 'punch', L => { town(L); menGrid(L, 'idle'); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aRx: 1.7, aRe: 1.5, aRz: -.1, aLx: 2.6, aLz: .4, aLe: .4, lean: -.08 }]], { T: L.T }); talk(me, L.T, 140.68, 141.9, 'shout', { eyes: 'angry' });
  POST.push(() => { const h = hp(me); show(MEGA, h.x + .1, h.y + .3, h.z + 1.4, 0, 1.4); }); bubble(me, 'AB HEUTE ENTSCHEIDEN WIR!', clamp((L.lt - .05) / .1), 1.2);
  orb(L.k, V(POD0.x, 8.6, POD0.z), null, [12, -.25, .04, 44], [10.6, -.18, .03, 44]); sh(V(-6, 0, -40), 20); }, [[0, 'shout_m', .35], [.2, 'boom', .3]]);
// 107 «800 Männer jubeln.»: la multitud salta y vitorea: «800»
shot(142.02, 'W', null, L => { town(L); menGrid(L, 'cheer'); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, GEST.cheer]], { T: L.T }); laughF(me, L.T); confetti(V(-6, 6, -24), 142.1, L.T, 60, 1.4);
  badge('num', '800', W * .5, H * .16, clamp((L.T - 142.02) / .12), 1, 1.1); orb(L.k, V(-6, 4, -24), null, [30, PI - .2, .2, 50], [27, PI - .1, .18, 50]); sh(V(-6, 0, -26), 34); }, [[0, 'cheer', .6], [.3, 'shout_crowd', .45], [.6, 'confetti', .3]]);
// 108 «Zum ersten Mal fühle ich mich» (zoom lento): Lukas, pecho fuera… le salen orejas de lobo
shot(143.88, 'I', 'slow', L => { town(L); menGrid(L, 'cheer'); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aLx: .3, aRx: .3, aLz: .3, aRz: .3, lean: -.12, headX: -.1 }]], { T: L.T }); cara(me, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' }); WOLF.visible = L.T > 144.5; WOLF.scale.setScalar(spring(clamp((L.T - 144.5) * 3)));
  onFace(me, lerp(7, 5, easeIn(L.k)), -.1, 0, 44); sh(V(-6, 0, -40), 20); }, [[.6, 'magic_hit', .4]]);
// 109 «wie ein Wolf.»: aúlla con la cabeza hacia el cielo: «AUUUU!»
shot(145.1, 'Z', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aLx: .3, aRx: .3, aLz: .5, aRz: .5, lean: -.25, headX: -.6 }]], { T: L.T }); cara(me, L.T, { expr: 'shout', eyes: 'closed', mouth: 'o' }); WOLF.visible = true;
  bubble(me, 'AUUUUU!', clamp((L.lt - .1) / .1), 1.6); orb(L.k, V(POD0.x, 7.2, POD0.z), null, [13, .5, -.15, 46], [11.6, .4, -.18, 46]); sh(V(-6, 0, -40), 20); }, [[0, 'wind_howl', .45], [.2, 'growl', .25]]);
// 110 «Doch dann ruft eine Frau vom Balkon:»: una señora sale al balcón con la olla
const BALW = V(41.6, 7.85, -52);
shot(146.38, 'S', null, L => { town(L); put(FR[12], BALW.x, BALW.y, BALW.z, -PI / 2); show(POT, BALW.x - 1.6, BALW.y + 3.1, BALW.z + .2, 0, .9); actuar(FR[12], 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.15, aRz: -.15, aLe: .6, aRe: .6 }]], { T: L.T }); cara(FR[12], L.T, { expr: 'happy', mouth: 'smile' });
  POT.userData.st.forEach((s, i) => { const k = (L.T * .7 + i / 5) % 1; s.position.set(Math.sin(i * 2 + L.T) * .4, 1 + k * 3, 0); s.scale.setScalar(.6 + k); s.material.opacity = .45 * (1 - k); });
  cm([BALW.x - 17, 9, BALW.z + 3], [BALW.x - 15.4, 9.2, BALW.z + 2], L.k); camera.lookAt(BALW.x, 10.6, BALW.z); camera.fov = 46; sh(V(BALW.x, 0, BALW.z), 22); }, [[0, 'door_open', .4], [.5, 'steam', .35]]);
// 111 «Jungs, Essen ist fertig!»: golpea la olla con el cucharón y grita
shot(148.39, 'C', null, L => { town(L); put(FR[12], BALW.x, BALW.y, BALW.z, -PI / 2); show(POT, BALW.x - 1.6, BALW.y + 3.1, BALW.z + .2, 0, .9); actuar(FR[12], 0, [[0, { aLx: 1.4, aLe: .6, aLz: -.15, aRx: 2.4 + Math.sin(L.T * 16) * .3, aRz: .2, aRe: 1.2 }]], { T: L.T }); talk(FR[12], L.T, 148.39, 149.8, 'happy');
  inHand(LADLE, FR[12], 'R', [0, -.7, .3]); bubble(FR[12], 'Jungs, Essen ist fertig!', clamp((L.lt - .02) / .1), 1.2);
  POT.userData.st.forEach((s, i) => { const k = (L.T * .7 + i / 5) % 1; s.position.set(Math.sin(i * 2 + L.T) * .4, 1 + k * 3, 0); s.scale.setScalar(.6 + k); s.material.opacity = .45 * (1 - k); });
  onBody(FR[12], 11, .2, .02, 44, L.k, 9.8); sh(V(BALW.x, 0, BALW.z), 18); }, [[0, 'bell_far', .4], [.3, 'metal_hit', .35]]);
// 112 «Und in vier Sekunden»: todos los hombres salen corriendo en todas direcciones
shot(150.16, 'W', null, L => { town(L); MA.forEach((m, i) => { if (i >= 35) return; const col = i % 7, row = Math.floor(i / 7); const x0 = -6 + (col - 3) * 4.2 + (row % 2) * 2.1, z0 = -36 + row * 4.6, a = Math.atan2(x0 + 6, z0 + 30) + (i % 3 - 1) * .5; walkTo(m, x0, z0, a, 11, L, i, 18); m.root.rotation.y = a; cara(m, L.T + i, { expr: 'happy', mouth: 'open_smile' }); });
  put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, GEST.shock]], { T: L.T }); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); dust(V(-6, 0, -24), 150.2, L.T, 14, 1.2);
  orb(L.k, V(-6, 3, -28), null, [34, .15, .28, 50], [32, .1, .26, 50]); sh(V(-6, 0, -26), 40); }, [[0, 'crowd_run', .6], [.2, 'steps_run', .45]]);
// 113 «ist der Marktplatz leer.»: la plaza vacía; solo Lukas en sus cajas: «4 SEK»
shot(151.3, 'F', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aLx: .2, aRx: .2, aLz: .1, aRz: .1, headX: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'flat' }); dust(V(-2, 0, -30), 151.3, L.T, 4, .8);
  badge('num', '4 SEK', W * .5, H * .17, clamp((L.T - 151.3) / .12)); orb(L.k, V(-6, 3, -40), null, [44, .05, .3, 46], [40, .02, .28, 46]); sh(V(-6, 0, -36), 40); }, [[0, 'wind', .5], [.5, 'crickets', .4]]);
// 114 «Nur ich stehe noch da und brülle:»: solo, en lo alto de las cajas, se lleva el megáfono a la boca
shot(152.6, 'Z', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aRx: 1.7, aRe: 1.5, aRz: -.1, aLx: .5, aLz: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'angry', mouth: 'frown' });
  POST.push(() => { const h = hp(me); show(MEGA, h.x + .1, h.y + .3, h.z + 1.4, 0, 1.4); }); orb(L.k, V(POD0.x, 5, POD0.z), null, [22, -.3, .08, 46], [19, -.2, .06, 46]); sh(V(-6, 0, -40), 24); }, [[0, 'wind', .4], [.6, 'click_metal', .35]]);
// 115 «Wir sind keine Good Boys!» (golpe de zoom): grita a la plaza vacía
shot(154.57, 'C', 'punch', L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aRx: 1.7, aRe: 1.5, aRz: -.1, aLx: 1.0, aLz: .5, aLe: 1.9, lean: -.1 }]], { T: L.T }); talk(me, L.T, 154.57, 156.0, 'shout', { eyes: 'angry' });
  POST.push(() => { const h = hp(me); show(MEGA, h.x + .1, h.y + .3, h.z + 1.4, 0, 1.4); }); bubble(me, 'WIR SIND KEINE GOOD BOYS!', clamp((L.lt - .05) / .1), 1.2);
  onFace(me, 6.2, -.2, -.6, 44, L.k, 5.6); sh(V(-6, 0, -40), 20); }, [[0, 'shout_m', .35], [.3, 'wind_howl', .25]]);
// 116 «Dann, hinter mir,»: Svenja aparece detrás de las cajas, sin hacer ruido
shot(156.44, 'S', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); actuar(me, 0, [[0, { aRx: 1.0, aRe: 1.2, aLx: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', mouth: 'flat' }); inHand(MEGA, me, 'R', [0, -.5, .5], [0, 0, 0], 1.2);
  walkTo(sv, POD0.x + 2.6, POD0.z - 9, 0, 3.2, L, 0, 6); cara(sv, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smile' }); orb(L.k, V(POD0.x + 1.2, 4.4, POD0.z - 3), null, [24, .3, .08, 46], [21, .38, .06, 46]); sh(V(-6, 0, -44), 22); }, [[0, 'steps', .35], [.4, 'tension_str', .35]]);
// 117 «ganz leise:»: Svenja, junto a las cajas, se acerca en susurro
shot(157.51, 'I', null, L => { town(L); put(me, POD0.x, POD0.y, POD0.z, 0); cara(me, L.T, { expr: 'neutral' }); put(sv, POD0.x + 2.4, 0, POD0.z - 2.6, -.5); actuar(sv, 0, [[0, { aRx: 2.1, aRz: -.3, aRe: 2.3, aLx: .3, headX: -.25 }]], { T: L.T }); cara(sv, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smile' });
  onFace(sv, 5.4, -.2, .3, 42, L.k, 4.8); sh(V(-6, 0, -44), 18); }, [[0, 'whisper', .45]]);
// 118 «Schatz?»
shot(158.57, 'C', null, L => { town(L); put(sv, POD0.x + 2.4, 0, POD0.z - 2.6, -.5); actuar(sv, 0, [[0, { aLx: .3, aRx: .3, headX: -.3, headZ: .15 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', mouth: 'o', eyes: 'happy' }); bubble(sv, 'Schatz?', clamp(L.lt / .08), 1.2);
  onFace(sv, 5.2, -.2, -.2, 42, L.k, 4.8); sh(V(-6, 0, -44), 18); }, [[0, 'pling', .45]]);
// 119 «Ja, Schatz?»: Lukas se gira al instante, obediente
shot(159.12, 'W', null, L => { town(L); const t = easeOut(clamp(L.lt / .2)); put(me, POD0.x, POD0.y, POD0.z, lerp(0, -2.4, t)); actuar(me, 0, [[0, { aLx: .4, aRx: .4, aLz: -.2, aRz: -.2, headX: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile', blush: 1 }); WOLF.visible = false; bubble(me, 'Ja, Schatz?', clamp(L.lt / .08), 1.2);
  onFace(me, 5.4, -.1, 0, 42, L.k, 5.0); sh(V(-6, 0, -44), 18); }, [[0, 'whoosh_soft', .3]]);
// 120 «Pfötchen.»: abajo, de rodillas, Lukas le da la pata a Svenja
shot(159.56, 'S', null, L => { town(L); const p = V(POD0.x + 3.2, 0, POD0.z + 3.2); put(sv, p.x + 1.6, 0, p.z - 3.4, -.45); actuar(sv, 0, [[0, { aRx: 1.2, aRe: .3, aRz: .15, aLx: .3, headX: .3 }]], { T: L.T }); talk(sv, L.T, 159.56, 160.3, 'happy');
  put(me, p.x, 0, p.z, PI - .45); actuar(me, 0, [[0, PFOTE({ headX: -.35 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); bubble(sv, 'Pfötchen.', clamp(L.lt / .08), 1.2);
  orb(L.k, V(p.x + .8, 3.2, p.z - 1.7), null, [12, 1.25, .12, 46], [10.8, 1.15, .1, 46]); sh(p, 16); }, [[0, 'cloth', .4], [.3, 'pop', .35]]);
// 121 «Good Boy.»: Svenja le acaricia la cabeza; Lukas, feliz con su collar; fin
shot(160.39, 'Z', null, L => { town(L); const p = V(POD0.x + 3.2, 0, POD0.z + 3.2); put(sv, p.x + .4, 0, p.z - 3.0, -.1); actuar(sv, 0, [[0, { aRx: 1.25, aRe: .55, aRz: -.1, aLx: .3, lean: .25, headX: .35 }]], { T: L.T }); cara(sv, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  put(me, p.x, 0, p.z, PI - .1); actuar(me, 0, [[0, SITZ({ headX: -.4, headZ: Math.sin(L.T * 10) * .08 })]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'closed', mouth: 'open_smile', blush: 1 }); hearts(hp(me).add(V(0, 1.6, 0)), L.T);
  bubble(sv, 'Good Boy.', clamp(L.lt / .08), 1.4); orb(L.k, V(p.x + .2, 3.4, p.z - 1.4), null, [12, -.15, .12, 44], [10.6, -.25, .1, 44]); sh(p, 16); }, [[0, 'sparkle', .45], [.3, 'bark', .2]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down', 'wind_rise'], Z: ['swoosh_up', 'zoom_in', 'riser_short'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'cloth', 'whoosh_soft'], R: ['whirl', 'whoosh_up', 'clock_spin'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'thud'] };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.tr && i + 1 < S.length) { const L_ = TRS[s.tr]; CUES.push({ t: +(S[i].t1 - TRW[s.tr] / FPS * .5).toFixed(3), s: L_[i % L_.length], g: .45, tr: 1 }); }
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  if (s.zoom === 'punch') CUES.push({ t: s.t0, s: 'impact', g: .7 }); });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()();
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .25 * sh_; camera.position.y += (r() - .5) * .25 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, .8); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .2 : .3);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
}
function renderAt(T) {
  const i = shotAt(T), s = S[i]; let tr = null, a = 0, ph = 0; const fO = (s.t1 - T) * FPS, fI = (T - s.t0) * FPS;
  if (s.tr && fO < TRW[s.tr] && i + 1 < S.length) { tr = s.tr; a = 1 - fO / TRW[s.tr]; ph = -1; } else if (i > 0 && S[i - 1].tr && fI < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fI / TRW[S[i - 1].tr]; ph = 1; }
  renderShot(i, T, tr, a);
  octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.translate(W / 2, H / 2); const a2 = a * a;
  if (tr === 'W') octx.translate(ph * a2 * W * .45, 0); if (tr === 'S') octx.translate(0, ph * a2 * H * .35);
  if (tr === 'Z') { const sc = ph < 0 ? 1 + a2 * .6 : 1 + a2 * .35; octx.scale(sc, sc); octx.filter = `blur(${(a * 8).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((ph < 0 ? 1 : -1) * a2 * .55); octx.scale(1 + a2 * .3, 1 + a2 * .3); octx.filter = `blur(${(a * 7).toFixed(1)}px)`; }
  if (tr === 'C' && ph > 0) { const sc = 1 + a * .22; octx.scale(sc, sc); }
  if (tr === 'I') { octx.beginPath(); octx.arc(0, 0, Math.max(1, (1 - a2) * H * .62), 0, 7); octx.clip(); }
  octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { hp, me, sv, MA, FR, renderer, composer, bloom, sun, grade, scene, camera, HB, WO, PA };

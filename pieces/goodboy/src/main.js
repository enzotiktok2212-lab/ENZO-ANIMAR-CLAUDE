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
const WURST = wurstWagen(HB.G); WURST.position.set(6, 0, 36); WURST.rotation.y = -Math.PI / 2; WURST.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && Math.abs(o.geometry.parameters.width - 4.4) < .01) o.visible = false; });
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
PROPS.push(...CONF, ...DUST, ...SWEAT, ...TEAR, ...HEARTS, ...SPLASH, RING, ZZ);
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
  for (const k in SETS) SETS[k].visible = false; BU.SCR.userData.set('chart'); WURST.visible = false; POD.visible = false;
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
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; let m = 220; if (b.kind === 'bubble') { octx.font = `700 46px ${FONT}`; m = Math.max(220, (octx.measureText(b.text).width + 64) / 2 * U * Math.max(1, b.s) + 24); } b.x = clamp(x, m, W - m); b.y = clamp(y, 160, H * .6); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 46px ${FONT}`; const w = Math.max(170, c.measureText(b.text).width + 64); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -46, w, 92, 38); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 44); c.lineTo(10, 44); c.lineTo(-24, 80); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 130px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Frau|Good|Boy|Boys|Hund|Mann|entscheidet|gehorcht|Lukas|bravste|Sonntag|Gassi|Frauen|Kaffee|Männer|Leine|Currywurstbude|Svenja|hinfällt|Aus|Wurst|Boden|Tauben|Park|Benni|beschnuppert|beschnuppere|begrüßen|Freundinnen|begeistert|mögen|Donnerstag|Spieldate|Jungs|Abend|Nein|Fenster|Nase|Scheibe|markiert|halb|sechs|To-do-Liste|Kopfkissen|Abwasch|Müll|Wäsche|unterstrichen|lächeln|Schatz|zwei|Sekunden|Rekord|1,6|Badewanne|Schaum|Socke|Leckerli|Ohr|Bein|zappelt|falsch|Körbchen|Bett|bequemer|Restaurant|Gemüsesuppe|16|Tüten|Handtasche|Mantel|Mund|Gartencenter|Zettel|Schaffner|Fahrkarte|Bodybuilder|Fitnessstudio|130|Kilo|Muskeln|pfeift|Hantel|rennt|Chef|Meeting|Anruf|Fünf|Minuten|Firma|verkauft|Opa|47|Jahren|Stimme|Oma|Hundehütte|Garten|Namensschild|genug|Revolution|Samstag|Marktplatz|Megafon|entscheiden|800|jubeln|Wolf|Balkon|Essen|fertig|vier|leer|brülle|keine|leise|Pfötchen)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”:…–!?]/g, '').replace(/\.$/, '').replace(/,$/, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
//@@PLANOS@@

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

// SCHLAFWANDLER — «In dieser Stadt schlafwandelt jeder um drei Uhr nachts. Wenn du wach bist, tu so, als ob.»
// Ben (10) es el único que se despierta; los sonámbulos cavan en el Mondstollen; doce guardias que parpadean; su hermana Lena (15) también está despierta.
// Ciudad propia: Mondtal (calle alpina de noche). Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { schule } from './nsets.js';
import { mondtal, stollen, kinderzimmer, schlafzimmer, kueche, praxis, glowM, minerLamp, wecker } from './swelt.js';
import { makeBen, makeBenTag, makeLena, makeLenaTag, makeMama, makePapa, makeOpa, makeHuber, makeMeyer, makeArzt, makeBrandt, makeBaecker, makeKrause, makeNeuer, makeWaechter, makeSchlaefer, makeMitschueler, handLantern, shovelProp } from './svolk.js';
import { makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 222.8, U = W / 720, PI = Math.PI;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 5000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
if (HQ) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = +(QS.get('env') ?? .2); renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral']; }
const sky = nightSky(scene); sky.sky.material.depthWrite = !HQ; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
// luces locales (siempre en la escena; intensidad 0 si no se usan: así no se recompilan los shaders)
const LP = Array.from({ length: 4 }, () => { const l = new THREE.PointLight(0xffb060, 0, 60, 1.6); scene.add(l); return l; });
const LANT = new THREE.PointLight(0xffc070, 0, 34, 1.4); scene.add(LANT);   // farol del guardia (luz en la cara)
function sh(p0, s = 30) { const q = 2 * s / 2048 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
const M2U = 3.95;
// ---------- escenarios ----------
// Mondtal (x = 0): calle z ∈ [60, -300], fachadas a x = ±15; puertas en MT.DOORS ({pv, side, z, x}); farolas cada 34.
// Stollen (STX): boca en z = 0, túnel hacia -z (ancho ±13, alto 18), raíles x = ±2,2; túnel lateral (x = -13, z = -120); palas en (7, -10).
const STX = 1400, KZX = 2400, LZX = 3000, SZX = 3600, KUX = 4200, PRX = 4800, SCX = 5600, MZX = 6400;
const MT = mondtal(scene), ST = stollen(scene, STX), KZ = kinderzimmer(scene, KZX), LZ = kinderzimmer(scene, LZX, { lena: true }), SZ = schlafzimmer(scene, SZX), KU = kueche(scene, KUX), PR = praxis(scene, PRX), SC = schule(scene, SCX);
const MZ = schlafzimmer(scene, MZX, { wall: '#f0dcc8', wall2: '#e4ccb4', quilt: ['#1a1a22', '#f4f4f4', '#3a3a42', '#d8d8d8'], curtain: '#3a3a42' });
const SETS = { MT: MT.g, ST: ST.g, KZ: KZ.g, LZ: LZ.g, SZ: SZ.g, KU: KU.g, PR: PR.g, SC: SC.g, MZ: MZ.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ben = makeBen(scene), benT = makeBenTag(scene), lena = makeLena(scene), lenaT = makeLenaTag(scene), mama = makeMama(scene), papa = makePapa(scene), opa = makeOpa(scene), huber = makeHuber(scene);
const MEY = [0, 1, 2].map(i => makeMeyer(scene, i)), arzt = makeArzt(scene), brandt = makeBrandt(scene), baecker = makeBaecker(scene), krause = makeKrause(scene), neuer = makeNeuer(scene), kumpel = makeMitschueler(scene);
const WA = Array.from({ length: 10 }, (_, i) => makeWaechter(scene, i));
const SL = Array.from({ length: 44 }, (_, i) => makeSchlaefer(scene, i));
kitFace(ben, 'kid'); kitFace(benT, 'kid'); kitFace(kumpel, 'kid'); [lena, lenaT, mama, huber, MEY[1]].forEach(c => kitFace(c, 'girl')); kitFace(MEY[0], 'plain'); kitFace(MEY[2], 'kid');
[papa, opa, brandt, baecker].forEach(c => kitFace(c, 'mustache')); [arzt, neuer].forEach(c => kitFace(c, 'plain')); kitFace(krause, 'villain');
WA.forEach((c, i) => kitFace(c, i % 3 === 1 ? 'mustache' : 'plain')); SL.forEach((c, i) => kitFace(c, c.kid ? 'kid' : c.girl ? 'girl' : ['plain', 'mustache', 'hero'][i % 3]));
const GUARDS = [baecker, krause, ...WA];
const MAIN = [ben, benT, lena, lenaT, mama, papa, opa, huber, ...MEY, arzt, brandt, baecker, krause, neuer, kumpel, ...WA];
const POOL = [...MAIN, ...SL];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
// Fanta (botella de cristal naranja con etiqueta) y vaso de agua oxidada
function fantaBottle() { const g = new THREE.Group(); scene.add(g); const gm = mat(0xff8a10, { roughness: .08, transparent: true, opacity: .88, emissive: 0x6a2a00, emissiveIntensity: .25 }); cyl(.42, .42, 1.7, gm, 20, g, 0, .85, 0); cyl(.16, .42, .55, gm, 20, g, 0, 1.97, 0); cyl(.16, .16, .45, gm, 14, g, 0, 2.45, 0); cyl(.19, .19, .12, mat(0x1a5ab8, { metalness: .6 }), 14, g, 0, 2.72, 0);
  const lab = textPlane(1.0, .8, 200, 160, (c, w, h) => { c.fillStyle = '#ff8a10'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a5ab8'; c.beginPath(); c.ellipse(w / 2, h / 2, 90, 52, -.1, 0, 7); c.fill(); c.fillStyle = '#3ab84a'; c.beginPath(); c.ellipse(w * .78, 34, 26, 12, .6, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.save(); c.translate(w / 2, h / 2 + 4); c.rotate(-.1); c.lineWidth = 8; c.strokeStyle = '#0a2a6a'; c.strokeText('Fanta', 0, 0); c.fillText('Fanta', 0, 0); c.restore(); });
  lab.position.set(0, .9, .43); g.add(lab); const lab2 = lab.clone(); lab2.position.z = -.43; lab2.rotation.y = PI; g.add(lab2); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; }
const FANTA = [0, 1, 2, 3, 4, 5].map(() => P_(fantaBottle()));
const GLASS = P_(new THREE.Group()); { cyl(.55, .48, 1.6, mat(0xe8f4ff, { roughness: .05, transparent: true, opacity: .35 }), 20, GLASS, 0, .8, 0); const w = cyl(.5, .45, 1.1, mat(0x9a6a2a, { roughness: .1, transparent: true, opacity: .75 }), 20, GLASS, 0, .58, 0); GLASS.userData.water = w; }
const BAG = P_(new THREE.Group()); { const b = sphere(1.4, mat(0x3a4a3a, { roughness: .45, metalness: .05 }), BAG, 0, 1.4, 0, 9, 7); b.scale.set(1, 1.35, .85); const k = new THREE.Mesh(new THREE.ConeGeometry(.5, .9, 8), mat(0x3a4a3a, { roughness: .45 })); k.position.y = 2.9; BAG.add(k); for (const s of [-1, 1]) { const e = box(.2, .7, .2, mat(0x1a1a1e), .08, BAG, s * .3, 3.4, 0); e.rotation.z = s * .5; } }
const ROPE = P_(new THREE.Group()); { const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push(V(lerp(-6, 6, t), 0, 0)); } ROPE.userData.set = (a, b, sag) => { ROPE.clear(); const P = []; for (let i = 0; i <= 24; i++) { const t = i / 24; P.push(new THREE.Vector3().lerpVectors(a, b, t).add(V(0, -4 * sag * t * (1 - t), 0))); } const tb = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), 40, .09, 6), mat(0xff4a8a, { roughness: .6 })); tb.castShadow = true; ROPE.add(tb); }; }
const CAPF = P_(new THREE.Group()); { const c = new THREE.Mesh(new THREE.ConeGeometry(.78, 2.2, 12), mat(0x2a5ab8, { roughness: .9 })); c.rotation.z = PI / 2 - .2; c.position.set(.6, .7, 0); CAPF.add(c); const b = new THREE.Mesh(new THREE.TorusGeometry(.68, .16, 8, 20), mat(0xffffff, { roughness: 1 })); b.rotation.y = PI / 2; b.position.set(-.5, .7, 0); CAPF.add(b); sphere(.28, mat(0xffffff, { roughness: 1 }), CAPF, 1.8, .3, 0, 10, 8); CAPF.traverse(o => { if (o.isMesh) o.castShadow = true; }); }
const LOOSE = Array.from({ length: 4 }, () => P_(shovelProp(scene)));
const LANTF = P_(handLantern(scene));
const KPILE = Array.from({ length: 4 }, (_, i) => { const m = new THREE.Mesh(new THREE.ConeGeometry(2.8, 4.6, 9, 2), new THREE.MeshStandardMaterial({ color: 0x8a5a30, roughness: 1, flatShading: true })); m.position.y = 2.3; m.rotation.y = i; m.castShadow = m.receiveShadow = true; const g = new THREE.Group(); g.add(m); scene.add(g); return P_(g); });   // farol suelto (cae al suelo)
const TROPHY = P_(new THREE.Group()); { const gm = mat(0xffc830, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }); box(2.2, .7, 2.2, mat(0x2a2a30), .1, TROPHY, 0, .35, 0); cyl(.3, .5, 1.4, gm, 12, TROPHY, 0, 1.4, 0); const cup = cyl(1.2, .5, 1.8, gm, 18, TROPHY, 0, 3, 0); for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(.5, .12, 6, 14), gm); h.position.set(s * 1.3, 3.1, 0); h.rotation.y = PI / 2; TROPHY.add(h); } const eye = textPlane(1.6, .8, 120, 60, (c, w, h) => { c.fillStyle = '#ffffff'; for (const x of [32, 88]) { c.beginPath(); c.arc(x, 30, 22, 0, 7); c.fill(); c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(x, 30, 10, 0, 7); c.fill(); c.fillStyle = '#ffffff'; } }); eye.position.set(0, 3.1, 1.22); TROPHY.add(eye); }
const PLATE = Array.from({ length: 4 }, () => { const g = P_(new THREE.Group()); cyl(1.1, .9, .18, mat(0xf4f4f8, { roughness: .3 }), 18, g, 0, .09, 0); g.userData.food = cyl(.7, .7, .12, mat(0xe8c040, { roughness: .8 }), 14, g, 0, .24, 0); return g; });
const NEWS = P_(textPlane(3.4, 2.4, 170, 120, (c, w, h) => { c.fillStyle = '#f4f0e4'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a1a'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.fillText('MONDTALER BOTE', w / 2, 26); c.fillStyle = '#6a6a6a'; for (let k = 0; k < 6; k++) c.fillRect(12, 40 + k * 12, w - 24, 5); }));
NEWS.material.side = THREE.DoubleSide;
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xd8b088, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const SPARK = Array.from({ length: 18 }, () => P_(sphere(.12, glowM(0xffe8a0, 4), scene, 0, 0, 0, 6, 4)));
// gran despertador de la plaza (reloj de la torre) — número que se ve: 3:00 / 5:00
const BIGCLOCK = P_(wecker(scene)); BIGCLOCK.scale.setScalar(4); ST.BELL.position.y = 0; LANTF.userData.bulb.visible = true; for (const g of [baecker, krause, ...WA]) g.lantern.userData.bulb.visible = true;

// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.16, .44, .96], [.45, .72, 1], [.86, .94, 1]); sky.moon.visible = false; sky.sky.material.uniforms.cloud.value = 1; sky.sky.material.uniforms.starK.value = 0; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .9, .76); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0006; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function dusk() { day(); sun.color.setRGB(1, .66, .42); sun.intensity = 2.3; setSky([.14, .18, .52], [.74, .42, .56], [1, .6, .34]); hemi.color.setRGB(.9, .74, .8); scene.fog.color.setRGB(.9, .66, .6); rim.color.setRGB(1, .6, .4); }
// noche de luna: azul profundo con luces cálidas (como la referencia), sin quedarse oscuro
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = .92; setSky([.01, .03, .1], [.03, .08, .2], [.08, .14, .28]); sky.sky.material.uniforms.cloud.value = 0; sky.sky.material.uniforms.starK.value = 1; sky.moon.visible = true; sky.moon.position.set(-300, 520, -1300); hemi.intensity = .62; hemi.color.setRGB(.45, .6, 1); hemi.groundColor.setRGB(.16, .16, .26); sun.intensity = .95; sun.color.setRGB(.62, .74, 1); rim.intensity = 1.3; rim.color.setRGB(.7, .82, 1);
  scene.fog.color.setRGB(.04, .08, .18); scene.fog.density = .0022; bloom.strength = .34; bloom.threshold = .78; FILL.intensity = fill; FILL.color.setRGB(1, .86, .7); BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true;
    c.lantern.visible = false; c.shovel.visible = false; c.blis.visible = false; if (c.dirt) c.dirt.visible = false; c.red.visible = false; c.gloves.visible = c === lena || c === lenaT; c.aR.sh.rotation.y = 0; c.aL.sh.rotation.y = 0; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  BIGCLOCK.scale.setScalar(4); ST.BELL.position.y = 0; LANTF.userData.bulb.visible = true; for (const g of [baecker, krause, ...WA]) g.lantern.userData.bulb.visible = true;
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; FACES.length = 0; for (const l of LP) l.intensity = 0; LANT.intensity = 0; MT.RHYME.visible = false;
  for (const d of MT.DOORS) d.pv.rotation.y = 0; for (const w of MT.NIGHTW) w.visible = true; KZ.DOOR.rotation.y = 0; LZ.DOOR.rotation.y = 0; KZ.CLOCK.visible = true; LZ.CLOCK.visible = true; for (const c of KU.CH) c.visible = true; KU.LMP.visible = true; for (const d of MT.DOORS) { d.inner.material.emissiveIntensity = .9; d.inner.material.color.setHex(0xffb860); } for (const R of [KZ, LZ, SZ, MZ]) { R.quilt.position.y = 3.9; R.quilt.position.z = 2.6; R.quilt.scale.set(1, 1, 1); }
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.2; grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { CAMT.set(...t); camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.45; if (dist2 != null) dist2 *= 1.45; const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .45 + dy, h.z + fz * d - fx * side], [h.x, h.y - .4, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'worried' : 'down';
    case 'cry': return 'cry';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'half';
    case 'warm': return n > .1 ? 'happy' : 'normal';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'tired': return n > -.4 ? 'half' : 'closed';
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed' && s.expr !== 'cry') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || (expr === 'warm' || expr === 'happy' ? 'smile' : 'flat'), ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
// lágrimas: caen por las mejillas en la dirección a la que mira
const tears = (ch, T, slot = 0) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1, sd = i ? -.3 : .3; const t = TEAR[slot * 2 + i]; t.visible = true; t.position.set(h.x + (fz * sd + fx * .68) * s, h.y + (.72 - k * 1.0) * s, h.z + (-fx * sd + fz * .68) * s); t.scale.setScalar(s); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
const sitPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
const sitY = (c, seat) => seat + .1 - 2.05 * (c.spec.scale || 1);
// sentado en un asiento a la altura seat
function sit(c, x, seat, z, ry, L, pose = {}) { put(c, x, sitY(c, seat), z, ry); actuar(c, 0, [[0, sitPose(pose)]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
// ---------- gente ----------
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc_ = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc_[0] + (i + r() * .8) / list.length * (arc_[1] - arc_[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.6));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = o.ry ?? (Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35));
  put(c, x, o.y ?? 0, z, ry); const m = typeof o.mode === 'function' ? o.mode(i) : o.mode;
  if (m === 'walk' || m === 'run') { const run = m === 'run', d = (o.speed ?? (run ? 9 : 2.2)) * L.lt, a = ry + (o.dir ?? 0); c.root.rotation.y = a; c.root.position.x += Math.sin(a) * d; c.root.position.z += Math.cos(a) * d; c.root.position.y = (o.y ?? 0) + Math.abs(Math.sin(L.T * (run ? 13 : 9) + i)) * (run ? .35 : .12); actuar(c, 0, [[0, run ? runP(L.T, i) : walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || (run ? 'determined' : 'neutral'), mouth: run ? 'o' : undefined }); }
  else if (m === 'talk') { actuar(c, 0, [[0, { aRx: .9 + Math.sin(L.T * 3 + i) * .3, aRz: .2, aRe: 1.2, aLx: .3, headY: Math.sin(L.T * .8 + i) * .4 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'talk' : 'smile' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.06 }]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = (o.y ?? 0) + j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'wave') { actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'clap') { const j = Math.sin(L.T * 14 + i); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - j * .25, aRz: -.2 - j * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(c, T, { expr: 'joy' }); }
  else if (m === 'sitb') { sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: .4, aRx: .4, aLe: .6, aRe: .6, headY: Math.sin(L.T * .9 + i) * .3 }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); }
  else if (m === 'sitcheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3 }); laughF(c, T); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const _hb = new THREE.Box3(); function heightTo(ch, m) { ch.root.updateMatrixWorld(true); _hb.makeEmpty(); ch.root.traverseVisible(o => { if (o.isMesh && o !== ch.blob) _hb.expandByObject(o, false); }); const t = _hb.max.y - ch.root.position.y; ch.root.scale.multiplyScalar(m * M2U / t); return ch; }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
// luces locales cálidas cerca del punto de interés
function lp(i, x, y, z, k = 40, col = 0xffb060, d = 60) { const l = LP[i]; l.position.set(x, y, z); l.intensity = k; l.color.setHex(col); l.distance = d; }
// calle de noche (o de día con o.day / al alba con o.dawn); zc = z del punto de interés
function gasse(L, o = {}) { use('MT'); const zc = o.z ?? 0;
  if (o.day) { day(); for (const w of MT.NIGHTW) w.visible = false; return; }
  if (o.dawn) { dusk(); sun.intensity = 1.6; for (const w of MT.NIGHTW) w.visible = false; return; }
  night(o.fill ?? 26); lp(0, -11, 9, zc + 6, 46); lp(1, 11, 9, zc + 6, 46); lp(2, -11, 9, zc - 22, 40); lp(3, 11, 9, zc - 22, 40); }
// el túnel por dentro: luz anaranjada y cálida (faroles), muy legible
function tunnel(L, zc = -30, o = {}) { use('ST'); inside(o.h ?? .75, o.fill ?? 30); FILL.color.setRGB(1, .82, .58); hemi.color.setRGB(1, .8, .58); hemi.groundColor.setRGB(.5, .32, .2); renderer.toneMappingExposure = .98; bloom.strength = .32; bloom.threshold = .8;
  lp(0, -4, 15, zc + 8, 70, 0xffa850, 50); lp(1, 4, 15, zc - 12, 70, 0xffa850, 50); lp(2, 0, 15, zc + 28, 50, 0xffa850, 50); lp(3, 0, 15, zc - 34, 50, 0xffa850, 60); }
// la boca de la mina por fuera, de noche
function mineOut(L) { use('ST'); night(22); lp(0, STX - 9, 18, 6, 70, 0xffa850, 60); lp(1, STX + 9, 18, 6, 70, 0xffa850, 60); lp(2, STX, 10, 40, 40); lp(3, STX, 10, 80, 30); }
function benRoom(L, o = {}) { use('KZ'); if (o.day) { inside(.95, 38); KZ.WN.p.material.map = KZ.WN.day; } else if (o.dawn) { inside(.7, 24); FILL.color.setRGB(.8, .86, 1); KZ.WN.p.material.map = KZ.WN.day; } else { inside(.55, 18); FILL.color.setRGB(1, .82, .6); KZ.WN.p.material.map = KZ.WN.night; lp(0, KZX + 22, 14, 2, 30, 0xffd890, 40); lp(1, KZX - 1, 8, -8, 18, 0xffc870, 20); } }
function lenaRoom(L, o = {}) { use('LZ'); if (o.night) { inside(.55, 18); FILL.color.setRGB(1, .82, .66); LZ.WN.p.material.map = LZ.WN.night; lp(1, LZX - 1, 8, -8, 18, 0xffc870, 20); } else if (o.dawn) { inside(.72, 26); FILL.color.setRGB(.86, .88, 1); LZ.WN.p.material.map = LZ.WN.day; } else { inside(.95, 38); LZ.WN.p.material.map = LZ.WN.day; } }
function elternRoom(L, o = {}) { use('SZ'); if (o.dawn) { inside(.72, 26); FILL.color.setRGB(.86, .88, 1); } else { inside(.6, 22); FILL.color.setRGB(1, .84, .62); } }
function meyerRoom(L) { use('MZ'); inside(.65, 24); FILL.color.setRGB(1, .86, .66); }
function kitchen(L, o = {}) { use('KU'); if (o.night) { inside(.7, 26); FILL.color.setRGB(1, .86, .62); KU.W.p.material.map = KU.W.night; lp(0, KUX, 10, 0, 36, 0xfff0c0, 40); } else { inside(1.0, 40); KU.W.p.material.map = KU.W.day; } }
function praxisS(L) { use('PR'); inside(1.0, 42); }
function schulS(L) { use('SC'); day(); }
// ---------- gestos de esta pieza ----------
// sonámbulo: paso rígido y lento, brazos colgando un poco hacia delante, cabeza recta; ojos muy abiertos sin parpadear
const sleepP = (T, i = 0, sp = 1) => { const p = Math.sin(T * 5.4 * sp + i); return { lLx: p * .38, lRx: -p * .38, lLk: Math.max(0, -p) * .3 + .04, lRk: Math.max(0, p) * .3 + .04, aLx: .32 + p * .05, aRx: .32 - p * .05, aLz: .08, aRz: .08, aLe: .18, aRe: .18, lean: .02, headX: .02, headZ: Math.sin(T * 2.7 + i) * .03, hipY: 2.05 + Math.abs(Math.cos(T * 5.4 * sp + i)) * .05 }; };
const sleepFace = (ch, T, ex = {}) => ch.setFace({ eyes: 'wide', mouth: 'flat', ...ex });
// camina como sonámbulo desde (x, z) en la dirección ry (dist = velocidad × tiempo)
function sleepWalk(ch, L, x, z, ry, speed = 2.4, i = 0, o = {}) { const d = speed * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, o.y ?? 0, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...sleepP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.face !== false) sleepFace(ch, L.T, o.ex); return ch; }
// cavar: ciclo de pala (clavar, levantar, echar a un lado); k = fase 0..1
function digPose(T, i = 0, sp = 1) { const ph = ((T * .95 * sp + i * .37) % 1), a = Math.sin(ph * 6.283); return { lean: .38 + a * .12, crouch: .25 + Math.max(0, -a) * .2, aRx: .9 - a * .5, aRe: .4, aRz: -.08, aLx: 1.2 - a * .5, aLz: -.5, aLe: .9, lLx: .3, lRx: -.2, lLk: .3, lRk: .2, headX: .25, twist: a * .18 }; }
function dig(ch, L, i = 0, o = {}) { ch.shovel.visible = true; ch.shovel.rotation.set(.25, 0, 0); ch.shovel.position.set(-.2, -.3, .25); actuar(ch, 0, [[0, { ...digPose(L.T, i, o.sp ?? 1), ...(o.pose || {}) }]], { T: L.T }); if (o.face !== false) (o.awake ? cara(ch, L.T, { expr: o.expr || 'determined' }) : sleepFace(ch, L.T)); return ch; }
// guardia con el farol en alto delante de él (h = 0 colgando, 1 en alto a la cara de alguien)
function lanternUp(ch, L, h = 1, o = {}) { ch.lantern.visible = true; const p = { aRx: lerp(.12, 1.25, h), aRe: lerp(.1, .25, h), aRz: lerp(.12, .42, h), aLx: .1, aLz: .08, ...(o.pose || {}) }; actuar(ch, 0, [[0, p]], { T: L.T }); ch.lantern.rotation.set(p.aRx - p.aRe, 0, -p.aRz);
  if (o.light !== false) { ch.root.updateMatrixWorld(true); const w = ch.lantern.userData.bulb.getWorldPosition(V(0, 0, 0)); LANT.position.copy(w); LANT.intensity = o.k ?? 36; } return ch; }
// postura de guardia caminando con farol colgando
function guardWalk(ch, L, x, z, ry, speed = 2, i = 0, h = .5) { const d = speed * L.lt; put(ch, x + Math.sin(ry) * d, 0, z + Math.cos(ry) * d, ry); const w = walkP(L.T * .8, i); ch.lantern.visible = true; actuar(ch, 0, [[0, { ...w, aRx: lerp(.15, 1.3, h), aRe: .3, aRz: 0 }]], { T: L.T }); cara(ch, L.T, { expr: 'sus' }); return ch; }
// burbujas Zzz junto a la cabeza (dormido)
function zzz(ch, T, k = 1) { FX2D.push(c => { const [x, y, z] = proj(hp(ch).add(V(0, 1.6 * (ch.spec.scale || 1), 0))); if (z >= 1) return; for (let i = 0; i < 3; i++) { const t = (T * .6 + i / 3) % 1; c.save(); c.globalAlpha = Math.sin(t * PI) * k; c.translate(clamp(x + 40 + t * 90, 80, W - 80), clamp(y - 30 - t * 160, 120, H * .64)); c.font = `700 ${(46 + t * 40) * U}px ${FONT}`; c.textAlign = 'center'; c.lineWidth = 10; c.strokeStyle = '#0e1226'; c.strokeText('Z', 0, 0); c.fillStyle = '#9ad8ff'; c.fillText('Z', 0, 0); c.restore(); } }); }
// rayitas de «parpadeo» (dos arcos a los lados de los ojos)
function blinkFX(ch, k) { if (k <= 0 || k >= 1) return; FX2D.push(c => { const [x, y, z] = proj(hp(ch).add(V(0, .8 * (ch.spec.scale || 1), 0))); if (z >= 1) return; c.save(); c.translate(x, y); c.globalAlpha = Math.sin(k * PI); c.strokeStyle = '#ffffff'; c.lineWidth = 10 * U; c.lineCap = 'round'; for (const s of [-1, 1]) for (let j = 0; j < 3; j++) { const a = -.6 + j * .6; c.beginPath(); c.moveTo(s * (150 + 10) * U * Math.cos(a), 130 * U * Math.sin(a)); c.lineTo(s * (210) * U * Math.cos(a), 180 * U * Math.sin(a)); c.stroke(); } c.restore(); }); }
// cuenta grande en pantalla (segundos, cifras), centrada arriba
function bigNum(text, k, col = '#ffffff', y = .2, sc = 1) { badge(col === 'red' ? 'red' : col === 'gold' ? 'gold' : col === 'green' ? 'green' : 'big', text, W / 2, H * y, k, 1, sc); }
// partículas de polvo que caen desde el techo hacia c
function dustFall(c, T0, T, n = 18) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0 - r() * .4; if (t < 0) return; d.visible = true; d.position.set(c.x + (r() - .5) * 2.4, c.y + 8 - ((t * (3 + r() * 2)) % 9), c.z + (r() - .5) * 2.4); d.scale.setScalar(.08 + r() * .1); d.material.opacity = .85; }); }
// chispas (pala contra metal)
function sparks(c, T0, T, n = 18) { SPARK.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 7 + 1), t = T - T0; if (t < 0 || t > .7) return; s.visible = true; const a = r() * 6.283, v = 4 + r() * 6; s.position.set(c.x + Math.cos(a) * v * t, c.y + (3 + r() * 5) * t - 6 * t * t, c.z + Math.sin(a) * v * t); s.scale.setScalar(1 - t); }); }
// fila de sonámbulos (lista list) caminando en columnas hacia ry; x0,z0 = cabeza de la fila
function march(L, list, x0, z0, ry = PI, o = {}) { const cols = o.cols ?? 3, sx = o.sx ?? 4.4, sz = o.sz ?? 5.2, sp = o.speed ?? 2.4; const fx = Math.sin(ry), fz = Math.cos(ry), rx = Math.cos(ry), rz = -Math.sin(ry);
  list.forEach((c, i) => { if (c.root.visible) return; const row = Math.floor(i / cols), col = i % cols - (cols - 1) / 2; const j = RNG(i * 3 + 1); const bx = x0 + rx * (col * sx + (j() - .5) * 1.2) - fx * (row * sz + j() * 1.5), bz = z0 + rz * (col * sx + (j() - .5) * 1.2) - fz * (row * sz + j() * 1.5);
    if (o.avoid && o.avoid.some(p => Math.hypot(p[0] - bx, p[1] - bz) < 3.4)) return; sleepWalk(c, L, bx, bz, ry + (j() - .5) * .1, sp, i, { t0: o.t0 ?? 0 }); if (o.blinkers && o.blinkers.includes(i)) cara(c, L.T, { expr: 'sus' }); }); }
const DX = Array.from({ length: 14 }, (_, i) => makeExtraDay(i));
function makeExtraDay(i) { const c = makeExtra(scene, i + 60); kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]); outline(c.root, OC); POOL.push(c); c.lantern = { visible: false }; c.shovel = { visible: false, rotation: { set() {} }, position: { set() {} } }; c.blis = attachBlis(c); c.red = { visible: false }; c.gloves = { visible: false }; c.dirt = { visible: false };
  const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; return c; }
function attachBlis(o) { const B = []; for (const a of [o.aL, o.aR]) { const g = new THREE.Group(); a.hand.add(g); const r = RNG(a === o.aL ? 3 : 7); for (let k = 0; k < 6; k++) { const b = sphere(.09 + r() * .06, mat(0xe0584a, { roughness: .4 }), g, (r() - .5) * .6, -.1 - r() * .3, .42, 8, 6); b.scale.z = .5; } B.push(g); g.visible = false; } return { set visible(v) { B.forEach(g => g.visible = v); } }; }
const CR = SL;
const FACES = [];
function clearFaces() {}
// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (['big', 'red', 'num', 'green', 'gold', 'cyan'].includes(b.kind)) { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : b.kind === 'cyan' ? '#03283a' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50);
    if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else if (b.kind === 'cyan') { g.addColorStop(0, '#d8ffff'); g.addColorStop(1, '#2ad8f0'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  else if (b.kind === 'heart') { c.fillStyle = '#ff3a5a'; c.strokeStyle = '#4a0010'; c.lineWidth = 10; c.beginPath(); c.moveTo(0, 40); c.bezierCurveTo(-90, -20, -50, -90, 0, -40); c.bezierCurveTo(50, -90, 90, -20, 0, 40); c.fill(); c.stroke(); }
  c.restore(); }
const KEY = /^(Stadt|schlafwandelt|drei|Uhr|nachts|wach|tu|Türen|gleichzeitig|Schlafanzug|Vierhundert|Augen|offen|blinzeln|nie|fünf|Erde|Blasen|Skischuhen|Adidas-Anzügen|jeder|einschläft|vorne|Opa|Arzt|Föhn|Ben|zehn|Rost|Fanta|besten|Jahr|Einzige|Mama|Papa|blinzeln|geschrien|Reim|Lena|vier|Augen|Berg|Tunnel|Schaufeln|gräbt|Kinder|schnellsten|warum|keiner|Anstarr-Champion|Schule|schlägt|fünfzehn|hasst|klaut|Handschuhe|Frühstück|müde|Anstarren|Müll|Brandt|Wo|Seitentunnel|Dunkle|nie|leer|neuer|da|geblinzelt|Schlafwandler|Bäcker|Krause|Sportlehrer|Zwölf|graben|Laternen|wach|arbeiten|Wächter|Tag|saubere|Hände|Straße|Staub|Decke|Laterne|Gesicht|Fünfzehn|Sekunden|Dreißig|brennen|Fünfundvierzig|Sechzig|blinzle|umgerannt|aus|fünfzig|Lena|Leere|Minuten|weiter|blinzelt|Schwester|schlimmsten|graben|kleinste|Erdhaufen|Hälfte|Wächterin|neun|trainiert|aufwache|gesagt|angeschaut|gesehen|Türen|neben|einziges|Schönste|Schaufel|Stein|Glocke|dreht)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0; let HUD = null; const FX2D = [];
// ---------- a: gancho, la regla, la ciudad y yo (0 – 47,15 s) ----------
// Mondtal: calle z ∈ [60, -300] entre x = ±15; puertas en MT.DOORS (x = ±15, z); los sonámbulos marchan hacia -z (ry = PI), hacia el Berg.
// Cuartos (KZ/LZ): cama en (X - 9, -2), almohada z = -7,4; puerta del pasillo en x = X + 15, z ∈ [-1, 5]; pasillo x ∈ [X + 15, X + 29].
// helpers de esta pieza
const CROSS = { aLx: .15, aRx: .15, aLe: 1.55, aRe: 1.55, aLz: -.35, aRz: -.35 }, PALMS = { aLx: .3, aRx: .3, aLe: 1.45, aRe: 1.45, aLz: -.12, aRz: -.12, headX: .35 };
const noChairs = () => { for (const c of KU.CH) c.visible = false; };
function doorWave(L, t0, z0 = 0, sp = .03, dur = .3) { for (const d of MT.DOORS) { const k = clamp((L.T - t0 - Math.abs(d.z - z0) * sp) / dur); d.pv.rotation.y = -1.55 * easeOut(k) + (k > .6 && k < 1 ? Math.sin((k - .6) * 20) * .06 : 0); } }
function doorsOpen() { for (const d of MT.DOORS) d.pv.rotation.y = -1.55; }
// sonámbulos que salen por las puertas de z ∈ [zB, zA] hacia el centro de la calle
function outOfDoors(L, t0, zA, zB, from = 0, o = {}) { let n = 0; MT.DOORS.forEach(d => { if (d.z > zA || d.z < zB) return; const c = SL[from + n]; n++; if (!c || c.root.visible) return; const t = L.T - t0 - Math.abs(d.z - (o.z0 ?? 0)) * (o.sp ?? .03) - .15; if (t < 0) return;
  const dir = -Math.sign(d.x), dist = Math.min(t * 2.4, o.max ?? 7), turn = clamp((dist - (o.max ?? 7) + 1.2) / 1.2); put(c, d.x + dir * (1.2 + dist), 0, d.z + (o.dz ?? 0), lerp(dir > 0 ? PI / 2 : -PI / 2, o.ry ?? (dir > 0 ? PI / 2 : -PI / 2), turn)); actuar(c, 0, [[0, sleepP(L.T, n)]], { T: L.T }); sleepFace(c, L.T); }); }
// tumbado en una cama: x, z de la almohada (la cabeza apoya en ella)
function lie(ch, x, zP, top = 4.15, L = null, pose = {}) { const s = ch.spec.scale || 1; put(ch, x, top + .55 * s, zP + 4.6 * s, 0); ch.root.rotation.x = -PI / 2; ch.blob.visible = false; actuar(ch, 0, [[0, { aLz: .12, aRz: .12, ...pose }]], { T: L ? L.T : 0, weight: false }); return ch; }
// sentado en la cama con las piernas bajo el edredón (cama individual del cuarto X)
function sitBed(ch, X, L, pose = {}, dz = 0) { put(ch, X - 9, sitY(ch, 3.7), -5.4 + dz, 0); ch.blob.visible = false; actuar(ch, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 0, lRk: 0, ...pose }]], { T: L.T, weight: false }); return ch; }
const clockAt = (txt, x, y, z, ry = 0, s = 4, col = '#ff4a3a') => { BIGCLOCK.userData.set(txt, col); show(BIGCLOCK, x, y, z, ry, s); return BIGCLOCK; };

// 1 «In dieser Stadt schlafwandelt»: de frente a una casa, centrada: la puerta se abre de golpe y sale una familia en pijama (padre, madre, niño) andando hacia la cámara con los brazos estirados y los ojos como platos; detrás, todas las puertas de la calle se abren en ola. Golpe de zoom + empuje.
const HD = MT.DOORS.filter(d => d.x < 0).sort((a, b) => Math.abs(a.z + 30) - Math.abs(b.z + 30))[0];
shot(0, 'C', null, L => { gasse(L, { z: HD.z }); doorWave(L, .02, HD.z, .02, .2); HD.pv.rotation.y = -1.55 * easeOut(clamp(L.lt / .16)); outOfDoors(L, .1, HD.z + 60, HD.z - 60, 6, { z0: HD.z, sp: .02, max: 5 });
  [[SL[0], 0, 0], [SL[3], -3.4, .25], [SL[9], 3.2, .4]].forEach(([c, dz, dl], i) => { const t = clamp(L.lt - .12 - dl * .5, 0, 9); put(c, HD.x + 1.4 + t * 3.4, 0, HD.z + dz * clamp(t * 1.2), PI / 2); actuar(c, 0, [[0, { ...sleepP(L.T, i), aLx: 1.45, aRx: 1.45, aLe: .05, aRe: .05 }]], { T: L.T }); sleepFace(c, L.T); });
  cm([HD.x + 26, 6.2, HD.z, HD.x, 5.4, HD.z, 50], [HD.x + 17, 5.6, HD.z, HD.x, 5.2, HD.z, 46], L.k, easeOut); sh(V(HD.x + 6, 0, HD.z), 30); },
  [[0, 'door_crash', .7], [.1, 'door_open', .6], [.25, 'door_crash', .5], [.4, 'steps', .6], [.9, 'creepy_ting', .5], [1.2, 'door_open', .4]]);
// 2 «jeder um drei Uhr nachts.»: dormitorio de los vecinos: el despertador (encima del cabecero) salta de 2:59 a 3:00 y los dos se incorporan de golpe, rígidos, con los ojos como platos
shot(1.76, 'W', 'punch', L => { elternRoom(L); const up = easeOut(clamp((L.lt - .35) / .25));
  for (const [c, x] of [[SL[2], -3.2], [SL[7], 3.2]]) { const s = c.spec.scale || 1; lie(c, SZX + x, -6.4, 4.15, L, { aLx: .25 * up, aRx: .25 * up }); c.root.rotation.x = -PI / 2 + up * PI / 2; c.root.position.y = lerp(4.15 + .55 * s, sitY(c, 3.9), up); c.root.position.z = lerp(-6.4 + 4.6 * s, -5.2, up);
    if (up > .5) actuar(c, 0, [[0, { lLx: 1.5 * up, lRx: 1.5 * up, aLx: .3, aRx: .3 }]], { T: L.T, weight: false }); if (L.lt > .35) sleepFace(c, L.T); else c.setFace({ eyes: 'closed', mouth: 'flat' }); }
  SZ.quilt.position.y = 4.6; clockAt(L.lt < .35 ? '2:59' : '3:00', SZX, 9.4, -8.3, 0, 1.6, L.lt < .35 ? '#ff4a3a' : '#ffd23f');
  cm([SZX, 8.2, 5, SZX, 6.6, -5, 50], [SZX, 8, 3.6, SZX, 6.6, -5, 48], L.k); sh(V(SZX, 0, -2), 20); },
  [[.33, 'alarm', .6], [.38, 'cloth', .6], [.45, 'creepy_ting', .5]]);
// 3 «Wenn du wach bist,»: Ben en su cama abre los ojos de golpe (cerrados → muy abiertos) y se le escapa una gota de sudor
shot(3.57, 'C', 'punch', L => { benRoom(L); lie(ben, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; const o = L.lt > .18;
  cara(ben, L.T, o ? { expr: 'shock', eyes: 'wide', mouth: 'o' } : { eyes: 'closed', mouth: 'flat' }); if (o) sweat(ben, L.T, 1);
  const h = hp(ben); cm([h.x, h.y + 6.4, h.z + 1.6, h.x, h.y, h.z - .7, 42], [h.x, h.y + 4.6, h.z + 1.1, h.x, h.y, h.z - .7, 40], L.k); }, [[.16, 'gasp', .6], [.2, 'heartbeat', .5]]);
// 4 «tu so, als ob.»: Ben en la calle, entre los sonámbulos, imita su paso rígido con los ojos muy abiertos y mira de reojo al de al lado
shot(4.48, 'S', null, L => { gasse(L, { z: 6 }); doorsOpen(); sleepWalk(ben, L, 0, 10, PI, 1.6, 0, { face: false }); cara(ben, L.T, { eyes: L.lt > .4 ? 'side_r' : 'wide', mouth: 'grimace' }); sweat(ben, L.T, 1);
  sleepWalk(SL[1], L, 4.2, 11, PI, 1.6, 2); sleepWalk(SL[5], L, -4.4, 12, PI, 1.6, 3); march(L, SL.slice(10), 0, 18, PI, { cols: 3, speed: 1.6 });
  const p = ben.root.position; orbit(V(p.x + 1, 3.4, p.z), lerp(12, 10, L.k), PI + .12, .08, 44); sh(V(0, 0, 8), 26); }, [[0, 'whoosh', .4], [.1, 'steps', .5], [.5, 'gulp', .5]]);
// 5 «Um drei gehen in unserer Straße»: en la calle, mirando en diagonal a la fila de casas: las puertas se abren una tras otra y van saliendo; el reloj de la plaza marca 3:00
shot(5.32, 'W', null, L => { gasse(L, { z: HD.z }); doorWave(L, L.t0 + .05, HD.z + 20, .03, .22); outOfDoors(L, L.t0 + .05, HD.z + 40, HD.z - 30, 0, { z0: HD.z + 20, sp: .03, max: 4 });
  clockAt('3:00', -8, 20, HD.z - 46, .6, 3.4, '#ffd23f');
  cm([6, 7, HD.z + 26, -15, 5, HD.z + 2, 50], [6, 7, HD.z + 14, -15, 5, HD.z - 10, 50], L.k, x => x); sh(V(-10, 0, HD.z + 6), 36); },
  [[0, 'swipe', .4], [.1, 'door_open', .6], [.4, 'door_open', .5], [.75, 'door_crash', .5], [1.1, 'door_open', .4]]);
// 6 «alle Türen gleichzeitig auf,»: en medio de la calle, gran angular: las puertas de las DOS filas se abren a la vez y la luz cálida sale de todas
shot(6.74, 'Z', null, L => { gasse(L, { z: -40 }); doorWave(L, L.t0 + .08, -40, 0, .2); outOfDoors(L, L.t0 + .1, 20, -90, 0, { max: 3.5, z0: -40, sp: 0 });
  cm([0, 6, -4, 0, 4.5, -70, 64], [0, 6, -10, 0, 4.5, -76, 62], L.k); sh(V(0, 0, -36), 50); }, [[0, 'zoom_in', .4], [.05, 'door_crash', .7], [.1, 'door_open', .6], [.3, 'creepy_ting', .5]]);
// 6b «gleichzeitig auf,»: plano medio: tres puertas vecinas (centradas) se abren a la vez y la luz cálida sale de dentro
shot(7.42, 'C', 'punch', L => { gasse(L, { z: HD.z }); doorWave(L, L.t0 + .05, HD.z, 0, .2); outOfDoors(L, L.t0 + .15, HD.z + 18, HD.z - 18, 12, { z0: HD.z, sp: 0, max: 4 });
  cm([HD.x + 24, 6.4, HD.z + 1, HD.x, 4.6, HD.z, 46], [HD.x + 20, 6.2, HD.z + .5, HD.x, 4.6, HD.z, 46], L.k); sh(V(HD.x + 6, 0, HD.z), 30); }, [[0, 'impact', .4], [.05, 'door_crash', .7], [.1, 'door_open', .5]]);
// 7 «und die ganze Stadt läuft»: de cerca, en la puerta azul: una abuela con gorro de dormir y un niño salen andando rígidos, ojos abiertos
shot(8.6, 'F', null, L => { gasse(L, { z: -20 }); doorsOpen(); const d = MT.DOORS.find(d => d.x < 0 && d.z < -14) || MT.DOORS[2];
  const a = put(SL[2], d.x + 1.5 + L.lt * 2.2, 0, d.z, PI / 2); actuar(a, 0, [[0, sleepP(L.T, 1)]], { T: L.T }); sleepFace(a, L.T);
  const b = put(SL[4], d.x - .5 + L.lt * 2.2, 0, d.z + 3.2, PI / 2); actuar(b, 0, [[0, sleepP(L.T, 2)]], { T: L.T }); sleepFace(b, L.T);
  march(L, SL.slice(12), 2, d.z + 10, PI, { cols: 3, speed: 1.5 });
  cm([d.x + 12, 5.5, d.z + 4, d.x + 2, 4.6, d.z + 1, 46], [d.x + 10, 5.2, d.z + 3, d.x + 3, 4.6, d.z + 1, 44], L.k); sh(V(d.x + 4, 0, d.z), 22); }, [[0, 'flash', .4], [.1, 'steps', .6], [.6, 'wood_creak', .4]]);
// 8 «im Schlafanzug raus.»: barrido a ras de suelo por los pijamas y zapatillas que pasan (rayas, cuadros, lunares)
shot(9.72, 'S', null, L => { gasse(L, { z: -10 }); doorsOpen(); march(L, SL, 0, 4 + L.lt * 1.8, 0, { cols: 4, sx: 4.2, speed: 0 });
  cm([-12, 3.5, -2, 0, 3, -6, 40], [-10, 4.5, -10, 2, 3.5, -14, 40], L.k); sh(V(0, 0, -6), 24); DOF = 0; }, [[0, 'swipe', .4], [.1, 'cloth', .5], [.4, 'steps', .6]]);
// 9 «Vierhundert Menschen,»: grúa altísima: la calle llena de sonámbulos hasta el fondo; 400
shot(10.76, 'C', 'punch', L => { gasse(L, { z: -60 }); doorsOpen(); march(L, SL, 0, -24, PI, { cols: 4, sx: 4.4, sz: 4.6, t0: 0 });
  cm([0, 30, 46, 0, 0, -10, 48], [0, 40, 42, 0, 0, -14, 48], L.k); sh(V(0, 0, 0), 70); bigNum('400', clamp((L.lt - .05) / .2), 'gold', .22, 1.35); },
  [[0, 'impact', .5], [.05, 'pop', .5], [.2, 'crowd_run', .3]]);
// 10 «tief im Schlaf.»: de frente, la primera fila marcha hacia la cámara; ojos abiertos pero con burbujas de Zzz encima
shot(12.1, 'W', null, L => { gasse(L, { z: 0 }); doorsOpen(); const F = [SL[0], SL[3], SL[6]]; F.forEach((c, i) => { sleepWalk(c, L, (i - 1) * 4.4, -6 + L.lt * 0, PI, 1.4, i); zzz(c, L.T + i * .3, .9); });
  march(L, SL.slice(8), 0, -12, PI, { cols: 4, speed: 1.4 }); const p = F[1].root.position; orbit(V(p.x, 4.6, p.z), lerp(14, 12, L.k), PI, .06, 44); sh(V(0, 0, -8), 24); }, [[0, 'whoosh', .4], [.1, 'snore_chorus', .5]]);
// 11 «Die Augen weit offen.» (zoom lento): primer plano de una vecina con los ojos de par en par mientras camina
shot(13.48, 'F', 'slow', L => { gasse(L, { z: -10 }); doorsOpen(); const c = sleepWalk(SL[1], L, 0, -8, PI, 1.2, 1); march(L, SL.slice(14), 0, -2, PI, { cols: 3, speed: 1.2 });
  onFace(c, 5, 0, 0, 38, L.k, 3.6); sh(V(0, 0, -10), 20); }, [[0, 'flash', .3]]);
// 12 «Und sie blinzeln nie.»: dos sonámbulos de frente, muy cerca: una polilla revolotea delante de sus ojos y ni parpadean
shot(14.84, 'C', 'punch', L => { gasse(L, { z: -14 }); doorsOpen(); const a = sleepWalk(SL[3], L, -1.7, -14, 0, .8, 0), b = sleepWalk(SL[8], L, 1.7, -14.4, 0, .8, 1); march(L, SL.slice(12), 0, -24, 0, { cols: 4, speed: .8 });
  const h = hp(a); FX2D.push(c => { const [x, y] = proj(h.clone().add(V(1.7 + Math.sin(L.T * 7) * 1.4, .9 + Math.sin(L.T * 11) * .4, 1))); c.fillStyle = '#4a3a2a'; c.save(); c.translate(x, y); for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 16, 0, 16, 9 + Math.abs(Math.sin(L.T * 40)) * 8, s * .4, 0, 7); c.fill(); } c.restore(); });
  orbit(V(0, 6.4, a.root.position.z), 8, 0, .02, 40); sh(V(0, 0, -14), 20); }, [[0, 'impact', .4], [.2, 'feathers', .4], [.6, 'creepy_ting', .4]]);
// 13 «Um fünf wachen wir im Bett auf.»: al amanecer, el despertador marca 5:00 y suena; Ben se despierta, se estira y bosteza
shot(16.09, 'I', null, L => { benRoom(L, { dawn: true }); sitBed(ben, KZX, L, { aLx: 2.8, aRx: 2.8, aLz: .3, aRz: .3, aLe: .4, aRe: .4, lean: -.1, headX: -.15 }); KZ.quilt.position.y = 4.6;
  cara(ben, L.T, { expr: 'yawn', eyes: 'closed', mouth: 'yawn' }); clockAt('5:00', KZX - 3.6, 4.2, -8.4, .3, 1.2, '#ffd23f'); KZ.CLOCK.visible = false;
  cm([KZX - 7, 7.2, 4, KZX - 9, 6.2, -5.4, 44], [KZX - 7.4, 7, 2.6, KZX - 9, 6.2, -5.4, 42], L.k); }, [[0, 'iris_pop', .4], [.05, 'alarm', .6], [.5, 'yawn_big', .6]]);
// 13b «im Bett auf.»: en el cuarto de los padres, al alba: Mama se sienta en la cama y se frota la cara, confundida
shot(16.95, 'S', null, L => { elternRoom(L, { dawn: true }); put(mama, SZX - 3.4, sitY(mama, 3.7), -3.6, 0); mama.blob.visible = false; SZ.quilt.position.y = 4.6; const r = Math.sin(L.T * 9) * .15;
  actuar(mama, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 0, lRk: 0, aLx: 2.2 + r, aRx: 2.2 - r, aLe: 1.9, aRe: 1.9, aLz: -.25, aRz: -.25 }]], { T: L.T, weight: false }); cara(mama, L.T, { expr: 'sleepy', eyes: 'half' });
  onFace(mama, 5.6, 0, .8, 40, L.k, 4.8); }, [[0, 'swipe', .4], [.1, 'yawn_f', .6], [.6, 'cloth', .4]]);
// 14 «Erde an den Füßen,»: los pies sucios de tierra asoman bajo el edredón y caen migas de tierra sobre la sábana
shot(17.79, 'S', null, L => { benRoom(L, { dawn: true }); lie(ben, KZX - 9, -4.4, 4.15, L, { lLx: -.05 + Math.sin(L.T * 3) * .05, lRx: .05 }); KZ.quilt.position.y = 4.6; KZ.quilt.position.z = -1.2; KZ.quilt.scale.z = .3; ben.dirt.visible = true;
  const f = V(KZX - 9, 4.6, .2); cm([f.x + 2.4, f.y + 2.4, f.z + 5, f.x, f.y, f.z, 40], [f.x + 2, f.y + 2, f.z + 4, f.x, f.y, f.z, 38], L.k); }, [[0, 'swipe', .4], [.2, 'sprinkle', .5], [.5, 'rubble', .3]]);
// 15 «Blasen an den Händen.»: Papa en la cocina se mira las palmas llenas de ampollas y sopla, con cara de dolor
shot(18.93, 'C', 'punch', L => { kitchen(L); const c = put(papa, KUX + 9, 0, 4, PI / 2 + .3); c.blis.visible = true; actuar(c, 0, [[0, PALMS]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: L.lt > .5 ? 'o' : 'grimace' });
  onBody(c, 7, 0, .45, 40, L.k, 6.2, 0, 3.4); }, [[0, 'impact', .4], [.3, 'breath', .4], [.6, 'breath', .5]]);
// 16 «Keiner weiß, wo wir waren.»: desayuno: Mama y Papa se miran y se encogen de hombros; tierra en el suelo de la cocina
shot(19.98, 'W', null, L => { kitchen(L); const m = sit(mama, KUX + 3.4, 2.8, -5.6, 0, L, { aLx: .4, aRx: .4 }); const p = sit(papa, KUX - 3.4, 2.8, -5.6, 0, L, { aLx: .4, aRx: .4 });
  const s = Math.sin(clamp(L.lt / .5) * PI); actuar(m, 0, [[0, { ...sitPose(), aLz: .6 * s + .1, aRz: .6 * s + .1, aLe: 1.4, aRe: 1.4, headZ: .12 }]], { T: L.T, weight: false }); actuar(p, 0, [[0, { ...sitPose(), aLz: .5 * s + .1, aRz: .5 * s + .1, aLe: 1.3, aRe: 1.3, headZ: -.12 }]], { T: L.T, weight: false });
  cara(m, L.T, { expr: 'confused' }); cara(p, L.T, { expr: 'confused' }); show(PLATE[0], KUX + 3, 4.75, -2.4); show(PLATE[1], KUX - 3, 4.75, -2.4);
  cm([KUX, 9, 16, KUX, 5.4, 0, 50], [KUX, 9, 15, KUX, 5.4, 0, 48], L.k); }, [[0, 'whoosh', .4], [.15, 'cloth', .4], [.5, 'spoon', .4]]);
// 17 «Frau Huber schläft in Skischuhen.»: Frau Huber ronca en su cama; asoman dos botas de esquí rojas enormes; la cámara va de las botas a la cara
shot(21.28, 'F', null, L => { elternRoom(L, { dawn: true }); const c = lie(huber, SZX - 3.4, -6.4, 4.15, L); SZ.quilt.position.y = 4.6; SZ.quilt.scale.z = .45; SZ.quilt.position.z = -2; c.setFace({ eyes: 'closed', mouth: Math.sin(L.T * 4) > 0 ? 'o' : 'wavy' }); zzz(c, L.T);
  cm([SZX - 3.4, 8, 9, SZX - 3.4, 4.6, 1.2, 42], [SZX - 3.4, 8.6, 1, SZX - 3.4, 4.6, -6.4, 42], L.k); }, [[0, 'flash', .3], [.1, 'snore', .6], [.8, 'snore', .5]]);
// 17b «in Skischuhen.»: primer plano de las botas de esquí rojas asomando del edredón; una se mueve
shot(22.02, 'C', 'punch', L => { elternRoom(L, { dawn: true }); const c = lie(huber, SZX - 3.4, -6.4, 4.15, L, { lRx: Math.sin(L.T * 3) * .15 }); SZ.quilt.position.y = 4.6; SZ.quilt.scale.z = .45; SZ.quilt.position.z = -2; c.setFace({ eyes: 'closed', mouth: 'o' });
  const f = V(SZX - 3.4, 4.8, -1.4); cm([f.x + 3, f.y + 2.6, f.z + 6, f.x, f.y, f.z, 40], [f.x + 2.4, f.y + 2.2, f.z + 5, f.x, f.y, f.z, 38], L.k); }, [[0, 'impact', .4], [.1, 'boing_metal', .3], [.4, 'snore', .5]]);
// 18 «Die Meyers»: vista cenital: los tres Meyer dormidos en la misma cama
shot(22.95, 'Z', null, L => { meyerRoom(L); MEY.forEach((c, i) => { lie(c, MZX - 4.4 + i * 4.4, -6.4 + (i === 2 ? 2 : 0), 4.15, L); c.setFace({ eyes: 'closed', mouth: 'flat' }); }); MZ.quilt.position.y = 4.6; MZ.quilt.scale.z = .55; MZ.quilt.position.z = 3.6;
  cm([MZX, 14.5, 4, MZX, 3, -2, 50], [MZX, 14, 3, MZX, 3, -2.4, 48], L.k); }, [[0, 'zoom_in', .4], [.2, 'snore_chorus', .5]]);
// 19 «in gleichen Adidas-Anzügen.»: los tres se dan la vuelta a la vez, sincronizados; plano de los chándales negros con tres rayas
shot(23.79, 'C', 'punch', L => { meyerRoom(L); const t = clamp((L.lt - .2) / .5); MEY.forEach((c, i) => { lie(c, MZX - 4.4 + i * 4.4, -6.4 + (i === 2 ? 2 : 0), 4.15, L, { aLx: -.3 * t, aRx: .3 * t, lLx: .5 * t }); c.root.rotation.y = .35 * Math.sin(t * PI); c.setFace({ eyes: 'closed', mouth: 'flat' }); }); MZ.quilt.position.y = 4.6; MZ.quilt.scale.z = .45; MZ.quilt.position.z = 4.2;
  cm([MZX, 12, 9, MZX, 4.4, -3, 48], [MZX, 11.4, 8, MZX, 4.4, -3, 46], L.k); }, [[0, 'impact', .4], [.25, 'cloth', .6]]);
// 20 «Jeder kennt so jemanden,»: de día en la calle: un vecino se queda dormido de pie en la parada, con el periódico, y se inclina
shot(24.96, 'W', null, L => { gasse(L, { day: true }); const c = put(DX[1], -10, 0, 20, PI / 2 + .3); const lean = Math.sin(L.T * 1.6) * .08 + .12; actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2, lean, headX: .5, headZ: .2 }]], { T: L.T }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  attach(NEWS, c.aR.hand, [-.6, -.5, .6], [0, -.3, 0], 1); crowdAt(L, -6, 26, 5, 6, 12, 7, { list: DX.slice(3), mode: i => ['walk', 'talk', 'point'][i % 3], expr: 'happy' });
  onBody(c, 15, .2, .1, 44, L.k, 13); sh(V(-10, 0, 20), 24); }, [[0, 'whoosh', .4], [.1, 'city_amb', .4], [.3, 'snore', .5]]);
// 21 «der überall einschläft.»: en la cocina, otro se duerme sentado y la cabeza cae en el plato
shot(26.0, 'S', null, L => { kitchen(L); const c = sit(DX[4], KUX + 3.4, 2.8, -5.6, 0, L, {}); const k = easeIn(clamp((L.lt - .25) / .4)); actuar(c, 0, [[0, { ...sitPose(), lean: .9 * k, headX: .4 * k, aLx: .6, aRx: .6, aLe: .5, aRe: .5 }]], { T: L.T, weight: false }); c.setFace({ eyes: k > .3 ? 'closed' : 'half', mouth: 'o' }); if (k >= 1) zzz(c, L.T);
  show(PLATE[0], KUX + 3.4, 4.75, -2.6); cm([KUX + 3.4, 8.6, 5, KUX + 3.4, 5, -4.4, 44], [KUX + 3.4, 8.2, 4, KUX + 3.4, 5, -4.4, 42], L.k); }, [[0, 'swipe', .4], [.6, 'splash', .5], [.75, 'snore', .5]]);
// 22 «Hier würde der ganz vorne laufen.»: de noche, la marcha: a la cabeza, adelantado a todos, un sonámbulo con los brazos estirados guía la fila (travelling hacia atrás)
shot(27.1, 'Z', null, L => { gasse(L, { z: -30 }); doorsOpen(); const c = sleepWalk(opa, L, 0, -28, PI, 2.2, 0, { pose: { aLx: 1.5, aRx: 1.5, aLe: .1, aRe: .1 } }); march(L, SL, 0, -22, PI, { cols: 4, speed: 2.2, t0: 0 });
  const p = c.root.position; orbit(V(p.x, 4.2, p.z), lerp(16, 13, L.k), PI - .25, .1, 44); sh(V(0, 0, p.z - 4), 26); }, [[0, 'zoom_in', .4], [.1, 'steps', .6], [1.2, 'whoosh_up', .3]]);
// 22b «vorne laufen.»: de frente y bajo: el que va delante (el Opa en su chaqueta de punto) avanza hacia la cámara con los brazos estirados, ojos abiertos
shot(28.14, 'C', 'punch', L => { gasse(L, { z: -40 }); doorsOpen(); const c = sleepWalk(opa, L, 0, -40, PI, 2.2, 0, { t0: 2, pose: { aLx: 1.5, aRx: 1.5, aLe: .1, aRe: .1 } }); march(L, SL, 0, -35, PI, { cols: 4, speed: 2.2, t0: 2 });
  onBody(c, 12, 0, .06, 42, L.k, 10, 0, 3.8); sh(V(0, 0, c.root.position.z), 26); }, [[0, 'impact', .4], [.1, 'steps', .6]]);
// 23 «Bei mir?»: Ben (de día) en la cocina, se lleva el dedo a la barbilla, pensando
shot(29.23, 'C', 'punch', L => { kitchen(L); const c = put(benT, KUX + 10, 0, 6, -PI / 2 - .4); actuar(c, 0, [[0, GEST.think || { aRx: 1.6, aRe: 2.2, aRz: -.2, headZ: .15 }]], { T: L.T }); talk(c, L.T, 29.2, 29.9, 'confused');
  onFace(c, 4.4, 0, .8, 40, L.k, 3.8); }, [[0, 'impact', .4], [.15, 'pop', .4]]);
// 24 «Klar: mein Opa.»: el Opa dormido en la mesa con el tenedor en la mano, ronca; Ben lo señala riéndose
shot(30.21, 'W', null, L => { kitchen(L); const o = sit(opa, KUX - 3.4, 2.8, -5.6, 0, L, {}); actuar(o, 0, [[0, { ...sitPose(), lean: .2, headX: .5, headZ: .25, aRx: .9, aRe: 1.6, aLx: .4, aLe: .6 }]], { T: L.T, weight: false }); o.setFace({ eyes: 'closed', mouth: Math.sin(L.T * 5) > 0 ? 'o' : 'wavy' }); zzz(o, L.T);
  const b = put(benT, KUX + 2, 0, -1, -PI / 2 - .4); actuar(b, 0, [[0, { aRx: 1.6, aRz: .1, aRe: .1, aLx: .5, aLe: 1.6, lean: -.06 }]], { T: L.T }); laughF(b, L.T); show(PLATE[1], KUX - 3.4, 4.75, -2.6);
  cm([KUX - 3, 8.6, 9, KUX - 2.4, 5.4, -4, 44], [KUX - 2, 8.2, 7.6, KUX - 2.6, 5.4, -4, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'snore', .6], [.6, 'kids_laugh', .4]]);
// 25 «Und der Arzt sagt nur:»: en la consulta, Papa le enseña las ampollas al médico, que se inclina y mira con las gafas en la punta de la nariz
shot(31.53, 'S', null, L => { praxisS(L); const d = sit(arzt, PRX, 3.25, -10, 0, L, { aLx: .8, aRx: .8, aLe: 1.2, aRe: 1.2 }); actuar(d, 0, [[0, { ...sitPose(), lean: .35, headX: .3, aLx: .9, aRx: .9, aLe: 1.3, aRe: 1.3 }]], { T: L.T, weight: false }); cara(d, L.T, { expr: 'sus' });
  const p = put(papa, PRX + .4, 0, -1, PI); p.blis.visible = true; actuar(p, 0, [[0, { aLx: 1.5, aRx: 1.5, aLe: .4, aRe: .4, aLz: -.1, aRz: -.1 }]], { T: L.T }); cara(p, L.T, { expr: 'worried' });
  cm([PRX + 3, 8.6, 6, PRX, 5.4, -8, 46], [PRX + 2.6, 8.4, 5, PRX, 5.4, -8, 44], L.k); }, [[0, 'swipe', .4], [.2, 'pages', .4], [.5, 'hum', .3]]);
// 26 «Das ist der Föhn.»: el médico se encoge de hombros, sonríe y señala la ventana con las montañas; bocadillo «FÖHN!»
shot(32.7, 'F', null, L => { praxisS(L); const d = sit(arzt, PRX, 3.25, -10, 0, L, {}); const s = Math.sin(clamp(L.lt / .6) * PI); actuar(d, 0, [[0, { ...sitPose(), aLz: .5 * s + .1, aLe: 1.4, aRx: .5, aRz: 1.3, aRe: .1, headY: .3 }]], { T: L.T, weight: false }); talk(d, L.T, 32.6, 33.9, 'happy');
  bubble(d, 'FÖHN!', clamp((L.lt - .45) / .2)); onBody(d, 11, -.3, .1, 42, L.k, 10, -.2, 2.6); }, [[0, 'flash', .3], [.3, 'wind', .5], [.5, 'pop', .4]]);
// 27 «Ich bin Ben, zehn.»: Ben (de día) en la cocina saluda a cámara con una sonrisa; «BEN · 10»
shot(33.95, 'C', 'punch', L => { kitchen(L); const c = put(benT, KUX, 0, 8, PI); actuar(c, 0, [[0, 'wave']], { T: L.T }); talk(c, L.T, 33.9, 35.3, 'happy');
  onFace(c, 6, 0, 0, 40, L.k, 5); badge('tag', 'BEN', W / 2, H * .2, clamp((L.lt - .2) / .2)); bigNum('10', clamp((L.lt - .85) / .2), 'gold', .28, 1.1); }, [[0, 'impact', .4], [.25, 'pop', .4], [.85, 'pling', .4]]);
// 28 «Unser Wasser schmeckt nach Rost,»: Ben, junto a la mesa, da un sorbo a un vaso de agua marrón y pone cara de asco
shot(35.36, 'W', null, L => { kitchen(L); noChairs(); const c = put(benT, KUX + 9.6, 0, 1, -PI / 2 + .4); attach(GLASS, c.aR.hand, [0, -.6, .3], [0, 0, 0], .8); const k = clamp((L.lt - .5) / .25);
  actuar(c, 0, [[0, { aRx: lerp(1.0, 2.3, k), aRe: lerp(.9, .5, k), aRz: lerp(0, -.3, k), headX: lerp(0, -.2, k) }]], { T: L.T }); cara(c, L.T, k > .7 ? { eyes: 'squint', mouth: 'wavy' } : { expr: 'neutral' });
  onBody(c, 11, -.5, .1, 42, L.k, 10, -.4, 3.6); }, [[0, 'whoosh', .4], [.05, 'pour', .5], [.6, 'sip', .5], [.85, 'cough', .5]]);
// 29 «deshalb trinke ich nur Fanta.»: abre una Fanta (¡pssst!) y bebe feliz
shot(36.78, 'S', null, L => { kitchen(L); const c = put(benT, KUX - 6, 0, 2, PI / 2 + .3); const f = attach(FANTA[0], c.aR.hand, [0, -.5, .45], [PI / 2, 0, 0], .6); const k = clamp((L.lt - .45) / .25);
  actuar(c, 0, [[0, { aRx: lerp(1.0, 2.6, k), aRe: lerp(1.0, .4, k), aRz: lerp(0, -.35, k), headX: lerp(0, -.25, k), aLx: .3 }]], { T: L.T }); f.rotation.x = PI / 2 + lerp(0, -1.9, k); cara(c, L.T, k > .5 ? { eyes: 'closed', mouth: 'o' } : { expr: 'happy' });
  onBody(c, 12, -.8, .08, 42, L.k, 11, -.7, 3.6); }, [[0, 'swipe', .4], [.1, 'steam', .5], [.5, 'gulp', .6]]);
// 30 «Die schmeckt eh am besten.»: Ben levanta su Fanta y pone el pulgar arriba; detrás, la mesa llena de Fantas; destellos
shot(38.27, 'C', 'punch', L => { kitchen(L); noChairs(); const c = put(benT, KUX + 1, 0, 6.6, 0); attach(FANTA[0], c.aL.hand, [0, -.5, .45], [PI / 2, 0, 0], .6); actuar(c, 0, [[0, { aLx: 2.3, aLe: .4, aLz: .2, aRx: 1.6, aRe: 1.8, aRz: -.3 }]], { T: L.T }); grin(c, L.T);
  for (let i = 1; i < 6; i++) show(FANTA[i], KUX - 2.2 + i * 1.2, 4.75, 2.4 + (i % 2) * .7, 0, .62);
  onBody(c, 11.4, 0, .12, 42, L.k, 10.4, 0, 3.6); }, [[0, 'impact', .4], [.1, 'sparkle', .5], [.3, 'ding_soft', .5]]);
// 31 «Und seit einem Jahr»: de noche, Ben en la cama mira el techo con los ojos abiertos; el despertador marca 3:00; «1 JAHR»
shot(39.58, 'B', null, L => { benRoom(L); lie(ben, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; cara(ben, L.T, { eyes: 'wide', mouth: 'flat' }); KZ.CLOCK.userData.set('3:00');
  cm([KZX - 2, 13, 2, KZX - 8, 3.6, -5, 46], [KZX - 3, 12, 0, KZX - 8, 3.6, -5.6, 44], L.k); bigNum('1 JAHR', clamp((L.lt - .4) / .2), 'gold', .2, .9); }, [[0, 'clock_tick', .5], [.4, 'pling', .4]]);
// 32 «bin ich der Einzige, der dabei aufwacht.» (zoom lento): desde arriba, en la marcha, todos miran al frente; solo el pequeño Ben mira a los lados
shot(40.6, 'F', 'slow', L => { gasse(L, { z: -20 }); doorsOpen(); march(L, SL, 0, -10, PI, { cols: 4, speed: 1.6, avoid: [[0, -24]] }); const b = sleepWalk(ben, L, 0, -18, PI, 1.6, 0, { face: false }); cara(ben, L.T, { eyes: Math.sin(L.T * 3) > 0 ? 'side_l' : 'side_r', mouth: 'grimace' });
  const p = b.root.position; cm([p.x + 2, 24, p.z - 14, p.x, 2, p.z, 40], [p.x + 1, 16, p.z - 9, p.x, 3, p.z, 40], L.k); sh(V(0, 0, p.z), 26); }, [[0, 'flash', .3], [.2, 'steps', .5]]);
// 32b «der dabei aufwacht.»: primer plano de Ben en la marcha: es el único que parpadea y mira a los lados, asustado
shot(41.18, 'C', 'punch', L => { gasse(L, { z: -20 }); doorsOpen(); march(L, SL, 0, -10, PI, { cols: 4, speed: 1.6, avoid: [[0, -24]] }); const b = sleepWalk(ben, L, 0, -18, PI, 1.6, 0, { t0: 1.2, face: false });
  const bl = (L.lt % .7) < .1; cara(ben, L.T, { eyes: bl ? 'closed' : Math.sin(L.T * 3) > 0 ? 'side_l' : 'side_r', mouth: 'grimace' }); onFace(b, 5.4, 0, 0, 40, L.k, 4.6); sh(V(0, 0, b.root.position.z), 20); }, [[0, 'impact', .4], [.2, 'gulp', .5]]);
// 33 «Beim ersten Mal»: noche: Ben se incorpora en la cama al oír pasos, con los ojos abiertos
shot(42.25, 'C', 'punch', L => { benRoom(L); sitBed(ben, KZX, L, { aLx: .4, aRx: .4, aLz: .3, aRz: .3, headY: .5 }); KZ.quilt.position.y = 4.6; cara(ben, L.T, { eyes: 'wide', mouth: 'o' }); KZ.DOOR.rotation.y = -2.9;
  onFace(ben, 5, 0, 1.2, 40, L.k, 4.4); }, [[0, 'impact', .4], [.1, 'steps', .5], [.4, 'wood_creak', .5]]);
// 34 «laufen Mama und Papa an meiner Tür vorbei.»: desde la cama, por la puerta abierta: Mama y Papa pasan por el pasillo rígidos, sin parpadear
shot(43.15, 'W', null, L => { benRoom(L); KZ.DOOR.rotation.y = -2.9; sleepWalk(mama, L, KZX + 20, 7.4, PI, 3.0, 0); sleepWalk(papa, L, KZX + 21.4, 11.4, PI, 3.0, 1);
  cm([KZX + 12, 7, -2.4, KZX + 20.5, 5, 5, 44], [KZX + 12.4, 7, -2, KZX + 20.5, 5, 5, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'steps', .6], [.9, 'wood_creak', .5]]);
// 34b «Tür vorbei.»: desde el pasillo, de frente: Mama pasa por delante de la puerta del cuarto, rígida, y sigue
shot(44.09, 'S', null, L => { benRoom(L); KZ.DOOR.rotation.y = -2.9; sleepWalk(mama, L, KZX + 20.5, 6, PI, 2.6, 0); sleepWalk(papa, L, KZX + 21, 12, PI, 2.6, 1);
  cm([KZX + 21, 7, -10, KZX + 20.5, 4.8, 4, 42], [KZX + 21, 7, -9, KZX + 20.5, 4.8, 4, 42], L.k); }, [[0, 'swipe', .4], [.1, 'steps', .6]]);
// 35 «Ohne zu blinzeln.» (zoom lento): Papa en el pasillo se gira y mira hacia el cuarto, ojos abiertos, luz de la lámpara del pasillo
shot(44.92, 'F', 'slow', L => { benRoom(L); KZ.DOOR.rotation.y = -2.9; const p = put(papa, KZX + 19, 0, 2, -PI / 2 + .2); actuar(p, 0, [[0, sleepP(0, 0)]], { T: L.T }); sleepFace(p, L.T);
  onFace(p, 5.4, 0, 0, 38, L.k, 4); }, [[0, 'flash', .3], [.1, 'creepy_ting', .5]]);
// 36 «Fast hätte ich geschrien.»: Ben se tapa la boca con las dos manos, temblando, sudando
shot(45.92, 'C', 'punch', L => { benRoom(L); sitBed(ben, KZX, L, { aLx: 2.1, aRx: 2.1, aLe: 1.9, aRe: 1.9, aLz: -.25, aRz: -.25, ...shiver(L.T, 1.6) }); KZ.quilt.position.y = 4.6; cara(ben, L.T, { expr: 'terror', eyes: 'terror', mouth: 'grimace' }); sweat(ben, L.T, 2);
  onFace(ben, 4.4, 0, -.6, 40, L.k, 3.8); SHAKE = .3; }, [[0, 'impact', .5], [.1, 'scream_girl', .25], [.3, 'heartbeat', .6]]);
// ---------- b: la rima, la mina, Lena y Herr Brandt (47,15 – 97,95 s) ----------
// Túnel (STX): los sonámbulos cavan mirando a -z (ry = PI) en filas; túnel lateral a la izquierda (x = STX - 13, z ∈ [-128, -112]).
// Cocina (KUX): mesa en el centro; sillas (±3,4, ±5,6). Ben en (3,4, -5,6) mirando +z, Lena enfrente (3,4, 5,6) mirando -z.
function withScale(ch, s, fn) { const o = ch.spec.scale; ch.spec.scale = s; ch.root.scale.setScalar(s); fn(); ch.spec.scale = o; }
// fila de cavadores en el túnel: n personas a partir de z0 hacia -z, en columnas x (lista)
function diggers(L, list, z0, xs = [-6, -2, 2, 6], o = {}) { list.forEach((c, i) => { if (c.root.visible) return; const x = xs[i % xs.length], z = z0 - Math.floor(i / xs.length) * (o.dz ?? 6) - (i % 2) * 1.2; if (o.avoid && o.avoid.some(p => Math.hypot(p[0] - x, p[1] - z) < 3)) return; put(c, STX + x, 0, z, PI + (i % 3 - 1) * .25); dig(c, L, i, { sp: c.kid ? 1.7 : 1 }); }); }
const sepia = () => { grade.uniforms.sepia.value = .85; TINT = 'rgba(80,50,10,.12)'; grade.uniforms.vig.value = .7; };
// cara a la altura de la cara (personajes sentados a la mesa)
function faceAt(ch, L, d = 5, d2 = null, side = 0, fov = 38) { const s = ch.spec.scale || 1; const h = hp(ch).add(V(0, .62 * s, 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); const dd = lerp(d, d2 ?? d * .88, easeInOut(L.k)); cam([h.x + fx * dd + fz * side, h.y + 1.0, h.z + fz * dd - fx * side], [h.x, h.y - .2, h.z], fov); }
// Lena y Ben frente a frente en la mesa (anstarren): k = tensión 0..1
function stareTable(L, o = {}) { kitchen(L, { night: o.night ?? true }); const b = sit(benT, KUX + 3.4, 4.0, -5.6, 0, L, { aLx: .9, aRx: .9, aLe: 1.0, aRe: 1.0, lean: .25 }); const l = sit(lenaT, KUX + 3.4, 3.4, 5.6, PI, L, { aLx: .9, aRx: .9, aLe: 1.0, aRe: 1.0, lean: .25 }); return [b, l]; }

// 37 «Dann fällt mir der Reim ein,»: en la cama, Ben levanta el dedo: ¡se acuerda! — «!» encima
shot(47.15, 'C', 'punch', L => { benRoom(L); sitBed(ben, KZX, L, { aRx: 2.6, aRe: .3, aRz: -.2, aLx: .3, headX: -.1 }); KZ.quilt.position.y = 4.6; cara(ben, L.T, { expr: 'lookup', eyes: 'up', mouth: 'o' }); badge('q', '!', W / 2 + 120, H * .26, clamp((L.lt - .3) / .2), 1, 1.2);
  onFace(ben, 5.2, 0, .6, 40, L.k, 4.4); }, [[0, 'impact', .4], [.3, 'ding_soft', .6]]);
// 38 «den hier jedes Kind kennt:»: de día en la calle: dos niños giran la comba y otro salta en el centro, cantando
shot(48.47, 'W', null, L => { gasse(L, { day: true }); const a = put(MEY[2], -4.6, 0, 30, PI / 2), c = put(kumpel, 4.6, 0, 30, -PI / 2), j = put(benT, 0, 0, 30.4, 0); const ph = L.T * 6.5, r = Math.sin(ph);
  actuar(a, 0, [[0, { aRx: 1.0 + r * .5, aRe: .4, aRz: -.1 }]], { T: L.T }); actuar(c, 0, [[0, { aLx: 1.0 - r * .5, aLe: .4, aLz: -.1 }]], { T: L.T }); laughF(a, L.T); laughF(c, L.T);
  const hop = Math.max(0, Math.sin(ph + PI)); j.root.position.y = hop * 1.3; actuar(j, 0, [[0, { lLk: .6 * hop, lRk: .6 * hop, aLx: .3, aRx: .3, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(j, L.T);
  ROPE.visible = true; a.root.updateMatrixWorld(true); c.root.updateMatrixWorld(true); const pa = a.aR.hand.getWorldPosition(V(0, 0, 0)), pc = c.aL.hand.getWorldPosition(V(0, 0, 0)); ROPE.userData.set(pa, pc, -1.6 * Math.cos(ph) + .4);
  orbit(V(0, 3.6, 30), lerp(19, 17, L.k), .1, .1, 50); sh(V(0, 0, 30), 20); }, [[0, 'whoosh', .4], [.1, 'kids_laugh', .5], [.3, 'jump_small', .5], [.8, 'jump_small', .5]]);
// 39 «Bist du wach um drei,»: la rima pintada con tiza en el suelo, de arriba: la cámara se desliza sobre «BIST DU WACH UM DREI»
shot(49.85, 'S', null, L => { gasse(L, { day: true }); MT.RHYME.visible = true; cm([-2, 15, 33, 0, 0, 26.6, 42], [2, 15, 31, 0, 0, 25.8, 42], L.k); DOF = 0; }, [[0, 'swipe', .4], [.1, 'chalk', .6]]);
// 40 «tu als ob»: zoom a «TU ALS OB» (amarillo) y una niña salta a la pata coja por encima
shot(51.04, 'C', 'punch', L => { gasse(L, { day: true }); MT.RHYME.visible = true; cm([0, 11, 38, 0, 0, 31.6, 40], [0, 9, 37, 0, 0, 31.8, 38], L.k); DOF = 0; }, [[0, 'impact', .4], [.2, 'chalk', .5]]);
// 41 «und lauf dabei.»: los niños cantan la rima en corro mientras la comba gira (de frente, centrados)
shot(51.97, 'F', null, L => { gasse(L, { day: true }); const K = [benT, kumpel, MEY[2], DX[5]]; K.forEach((c, i) => { const a = i / 4 * 6.283 + L.T * .8; const x = Math.cos(a) * 4, z = 30 + Math.sin(a) * 4; put(c, x, 0, z, a + PI / 2); if (c === DX[5]) c.root.scale.setScalar(.72); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); talk(c, L.T, 51.9, 52.6, 'happy'); });
  orbit(V(0, 3, 30), lerp(12, 10.5, L.k), 0, .2, 46); sh(V(0, 0, 30), 20); }, [[0, 'flash', .3], [.1, 'kids_laugh', .5]]);
// 42 «Meine Schwester Lena»: de noche, Lena (sudadera, guantes) apoyada en el marco de la puerta del cuarto de Ben, brazos cruzados
shot(52.57, 'W', null, L => { benRoom(L); KZ.DOOR.rotation.y = -2.9; const l = put(lenaT, KZX + 13.6, 0, 2, -PI / 2 + .35); actuar(l, 0, [[0, { ...(CROSS), lean: -.05, headZ: .1 }]], { T: L.T }); cara(l, L.T, { expr: 'smug' });
  onBody(l, 13, -.15, .08, 42, L.k, 11.5); badge('tag', 'LENA', W / 2, H * .2, clamp((L.lt - .5) / .2)); }, [[0, 'whoosh', .4], [.2, 'wood_creak', .4], [.5, 'pop', .4]]);
// 43 «lässt ihn mich jeden Abend»: Lena sentada al pie de la cama, el dedo índice levantado, le hace recitar
shot(53.56, 'S', null, L => { benRoom(L); sitBed(ben, KZX, L, { aLx: .3, aRx: .3 }); KZ.quilt.position.y = 4.6; const l = put(lenaT, KZX - 5.2, sitY(lenaT, 4.3), 3.4, -PI / 2 - .5); actuar(l, 0, [[0, { ...sitPose(), aRx: 2.3, aRe: .5, aRz: -.1, aLx: .4 }]], { T: L.T, weight: false }); talk(l, L.T, 53.5, 54.7, 'determined');
  cara(ben, L.T, { expr: 'bored', eyes: 'half' }); cm([KZX - 6.6, 8.6, -11.2, KZX - 6.2, 5, 1.6, 46], [KZX - 6.6, 8.4, -11, KZX - 6.2, 5, 1.6, 44], L.k); }, [[0, 'swipe', .4], [.3, 'tick', .4]]);
// 44 «aufsagen.»: Ben recita aburrido mirando al techo; la rima en un bocadillo
shot(54.78, 'C', 'punch', L => { benRoom(L); sitBed(ben, KZX, L, { aLx: .3, aRx: .3, headX: -.2 }); KZ.quilt.position.y = 4.6; talk(ben, L.T, 54.7, 55.5, 'bored'); bubble(ben, 'BIST DU WACH UM DREI…', clamp((L.lt - .1) / .2));
  onFace(ben, 5.6, 0, -.5, 40, L.k, 5); }, [[0, 'impact', .4], [.1, 'pop', .4]]);
// 45 «Seit ich vier bin.»: recuerdo en sepia: Ben pequeño (4) en la cama y Lena niña le enseña la rima con el dedo; «4»
shot(55.57, 'B', null, L => { benRoom(L); sepia(); withScale(ben, .5, () => { sitBed(ben, KZX, L, { aLx: .3, aRx: .3 }); talk(ben, L.T, 55.5, 56.6, 'happy'); }); KZ.quilt.position.y = 3.9;
  withScale(lenaT, .66, () => { const l = put(lenaT, KZX - 5.4, 0, -2, -PI / 2 - .2); actuar(l, 0, [[0, { aRx: 2.3, aRe: .5, aRz: -.1 }]], { T: L.T }); talk(l, L.T, 55.5, 56.6, 'happy'); });
  cm([KZX - 2.6, 5.6, 4, KZX - 7.4, 3.6, -3, 44], [KZX - 3, 5.4, 3, KZX - 7.4, 3.6, -3, 42], L.k); bigNum('4', clamp((L.lt - .4) / .2), 'gold', .22, 1.2); }, [[0, 'soft_air', .4], [.2, 'film_roll', .4], [.45, 'pling', .4]]);
// 46 «Also reiße ich die Augen auf»: en la calle de noche, primerísimo plano: Ben abre los ojos de golpe (golpe de zoom)
shot(56.66, 'C', 'punch', L => { gasse(L, { z: 10 }); doorsOpen(); const b = sleepWalk(ben, L, 0, 10, PI, .6, 0, { face: false }); cara(ben, L.T, L.lt < .25 ? { eyes: 'half', mouth: 'flat' } : { eyes: 'wide', mouth: 'flat' });
  march(L, SL, 0, 15, PI, { cols: 3, speed: .6 }); onFace(b, 3.6, 0, 0, 38, L.k, 3); sh(V(0, 0, 10), 18); }, [[0, 'impact', .5], [.25, 'gasp', .5]]);
// 47 «und laufe mit.»: Ben sale de casa y se pone en la fila detrás de Mama y Papa, imitando el paso
shot(57.96, 'W', null, L => { gasse(L, { z: 0 }); doorsOpen(); sleepWalk(mama, L, 0, 4, PI, 2.2, 0); sleepWalk(papa, L, 4.4, 5, PI, 2.2, 1); sleepWalk(ben, L, 1.6, 10, PI, 2.4, 2, { ex: { eyes: 'wide' } }); march(L, SL.slice(0, 16), 0, 17, PI, { cols: 4, speed: 2.2 });
  const p = ben.root.position; orbit(V(p.x, 3.6, p.z - 1), lerp(15, 13, L.k), -1.1, .12, 44); sh(V(0, 0, p.z), 24); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 48 «Zum Berg hinter der Stadt.»: por detrás de la columna: la marcha sale del pueblo hacia el Berg con la boca de la mina iluminada al fondo (grúa)
shot(59.09, 'S', null, L => { gasse(L, { z: -150 }); doorsOpen(); march(L, SL, 0, -150, PI, { cols: 4, speed: 2.2, sz: 5 }); march(L, [ben, mama, papa], 0, -146, PI, { cols: 3, speed: 2.2 });
  cm([0, 14, -110, 0, 20, -360, 50], [0, 26, -118, 0, 26, -360, 50], L.k); sh(V(0, 0, -150), 60); }, [[0, 'swipe', .4], [.1, 'steps', .5], [.6, 'wind', .5]]);
// 49 «Ein Tunnel,»: la boca de la mina de frente, centrada: los sonámbulos entran en fila bajo el letrero
shot(60.52, 'C', 'punch', L => { mineOut(L); march(L, SL, STX, 28, PI, { cols: 3, speed: 2.4 }); cm([STX, 9, 62, STX, 13, 0, 46], [STX, 9, 56, STX, 13, 0, 46], L.k); sh(V(STX, 0, 20), 46); }, [[0, 'impact', .4], [.1, 'wind', .5], [.3, 'steps', .5]]);
// 50 «ein Haufen Schaufeln.»: el montón de palas a la entrada; manos que cogen una cada uno
shot(61.29, 'W', null, L => { tunnel(L, -10); march(L, SL.slice(4), STX + 2, -2, PI, { cols: 2, speed: 1.6 }); const c = put(SL[0], STX + 4, 0, -9, PI / 2); const k = clamp(L.lt / .6); actuar(c, 0, [[0, { aRx: lerp(.5, 1.3, k), aRe: .3, lean: .3 * (1 - k) }]], { T: L.T }); sleepFace(c, L.T); if (k > .7) c.shovel.visible = true;
  cm([STX + 1, 8, -2, STX + 7, 1.5, -10, 44], [STX + 1.4, 7.4, -3, STX + 7, 1.5, -10, 42], L.k); }, [[0, 'whoosh', .4], [.2, 'shovel', .6], [.6, 'click_metal', .5]]);
// 51 «Jeder nimmt eine»: un sonámbulo saca una pala del montón y se la apoya en el hombro, ojos abiertos (centrado)
shot(62.45, 'C', null, L => { tunnel(L, -10); const c = put(SL[5], STX + 3, 0, -6, PI / 2 + .6); const k = clamp(L.lt / .5); c.shovel.visible = true; c.shovel.rotation.set(lerp(1.6, .3, k), 0, 0); actuar(c, 0, [[0, { aRx: lerp(.6, 1.9, k), aRe: lerp(.2, 1.6, k), aRz: -.1 }]], { T: L.T }); sleepFace(c, L.T);
  march(L, SL.slice(10), STX - 2, -2, PI, { cols: 2, speed: 1.6 }); onBody(c, 12, .1, .06, 42, L.k, 10.4); }, [[0, 'shovel', .6], [.4, 'cloth', .4]]);
// 52 «und gräbt.»: el túnel en profundidad: filas de sonámbulos cavando a la vez, la tierra vuela
shot(63.15, 'F', null, L => { tunnel(L, -40); diggers(L, SL, -20, [-7, -2.5, 2.5, 7]); cm([STX, 13, 2, STX, 4, -50, 46], [STX, 12, -4, STX, 4, -54, 46], L.k); sh(V(STX, 0, -40), 46); dust(V(STX, 0, -26), L.t0 + .1, L.T, 10, .6); }, [[0, 'flash', .3], [.1, 'shovel', .6], [.4, 'shovel', .5], [.7, 'rubble', .4]]);
// 53 «Die Kinder am schnellsten.»: los niños cavan rapidísimo; la tierra salta detrás de ellos
shot(64.12, 'C', 'punch', L => { tunnel(L, -84); const K = SL.filter(c => c.kid); K.forEach((c, i) => { put(c, STX - 5 + i * 3.4, 0, -84 - (i % 2) * 2, PI); dig(c, L, i, { sp: 2.6 }); }); dust(V(STX, 0, -84), L.t0, L.T, 14, .5);
  diggers(L, SL.filter(c => !c.kid), -96); orbit(V(STX, 3.2, -84), lerp(14, 12, L.k), PI + .15, .12, 44); sh(V(STX, 0, -86), 24); }, [[0, 'impact', .4], [.05, 'shovel', .6], [.25, 'shovel', .6], [.45, 'shovel', .6], [.65, 'shovel', .6]]);
// 54 «Keiner weiß, warum.»: primer plano de una niña cavando con la mirada vacía; «?»
shot(65.39, 'W', null, L => { tunnel(L, -84); const c = put(SL.filter(c => c.kid)[1], STX, 0, -84, PI); dig(c, L, 0, { sp: 2.2 }); diggers(L, SL, -92);
  onBody(c, 9, 0, .1, 40, L.k, 8, 0, 2.6); badge('q', '?', W / 2 + 150, H * .3, clamp((L.lt - .3) / .2)); }, [[0, 'whoosh', .4], [.1, 'shovel', .5], [.4, 'creepy_ting', .5]]);
// 55 «Mich bemerkt keiner.»: Ben cava entre los mayores con los ojos abiertos; un guardia con farol pasa por detrás sin fijarse
shot(66.58, 'S', null, L => { tunnel(L, -80); put(ben, STX, 0, -80, PI); dig(ben, L, 0, { face: false }); cara(ben, L.T, { eyes: 'wide', mouth: 'flat' }); diggers(L, SL, -76, [-6, -3, 6], { avoid: [[0, -80]] });
  guardWalk(WA[0], L, STX + 8, -70, PI, 3, 0); onBody(ben, 10, PI * 0 + .5, .1, 42, L.k, 9, .6, 2.8); sh(V(STX, 0, -80), 24); }, [[0, 'swipe', .4], [.1, 'shovel', .5], [.3, 'steps', .5]]);
// 56 «Ich bin der Anstarr-Champion»: el patio del colegio: Ben y un compañero se miran cara a cara sin parpadear; los niños alrededor; el otro parpadea
shot(67.71, 'C', 'punch', L => { schulS(L); const b = put(benT, SCX - 2, 0, 0, PI / 2), k = put(kumpel, SCX + 2, 0, 0, -PI / 2); actuar(b, 0, [[0, { lean: .25, aLx: .2, aRx: .2 }]], { T: L.T }); actuar(k, 0, [[0, { lean: .25 }]], { T: L.T });
  cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); cara(k, L.T, L.lt > .9 ? { eyes: 'closed', mouth: 'grimace' } : { eyes: 'wide', mouth: 'grimace', noBlink: true }); if (L.lt > .9) blinkFX(k, (L.lt - .9) / .3);
  crowdAt(L, SCX, 0, 6, 6, 9, 4, { list: DX, mode: 'point', expr: 'gasp', gap: 1.7 }); cm([SCX, 5.4, 12, SCX, 4.6, 0, 40], [SCX, 5.2, 10, SCX, 4.6, 0, 38], L.k); sh(V(SCX, 0, 0), 20); POST.push(() => DX.forEach(c => { if (c.root.visible) c.root.scale.setScalar(.72); })); },
  [[0, 'impact', .4], [.1, 'kids_laugh', .3], [.9, 'blink', .6]]);
// 57 «der ganzen Schule.»: Ben levanta la copa con un ojo dibujado; los niños aplauden, confeti
shot(69.01, 'F', null, L => { schulS(L); const b = put(benT, SCX, 0, 0, 0); const t = attach(TROPHY, b.aR.hand, [0, -.6, .3], [-PI / 2, 0, 0], .55); actuar(b, 0, [[0, { aRx: 2.9, aRe: .2, aRz: -.1, aLx: 1.0, aLz: .6 }]], { T: L.T }); t.rotation.x = -PI / 2 + 2.9 - .3; laughF(b, L.T);
  crowdAt(L, SCX, 0, 7, 6, 10, 5, { list: DX, mode: i => ['cheer', 'clap'][i % 2] }); POST.push(() => DX.forEach(c => { if (c.root.visible) c.root.scale.setScalar(.72); })); confetti(V(SCX, 2, 0), L.t0, L.T, 40);
  onBody(b, 13, 0, .1, 44, L.k, 11, 0, 3.4); sh(V(SCX, 0, 0), 20); }, [[0, 'flash', .3], [.1, 'cheer', .5], [.2, 'confetti', .5]]);
// 58 «Nur Lena schlägt mich.»: en la mesa de la cena, Ben y Lena se miran; a Ben se le llenan los ojos de lágrimas, parpadea; Lena sonríe
shot(70.2, 'W', null, L => { const [b, l] = stareTable(L); KU.CH[1].visible = false; cara(b, L.T, L.lt > .8 ? { eyes: 'closed', mouth: 'grimace' } : { eyes: 'wide', mouth: 'grimace', noBlink: true }); if (L.lt > .5 && L.lt < .8) tears(b, L.T); if (L.lt > .8) blinkFX(b, (L.lt - .8) / .3);
  cara(l, L.T, L.lt > .9 ? { expr: 'smug' } : { eyes: 'wide', mouth: 'smirk', noBlink: true }); cm([KUX + 5.2, 7.6, 11, KUX + 3.4, 5.8, -5.6, 40], [KUX + 5, 7.4, 10, KUX + 3.4, 5.8, -5.6, 38], L.k); }, [[0, 'whoosh', .4], [.6, 'tick', .4], [.8, 'blink', .6], [.95, 'laugh_deep', .3]]);
// 59 «Sie ist fünfzehn»: primer plano de Lena, aburrida, auriculares fuera; «15»
shot(71.58, 'C', 'punch', L => { const [b, l] = stareTable(L); cara(l, L.T, { expr: 'bored' }); faceAt(l, L, 6.5, 5.7, 0, 40); bigNum('15', clamp((L.lt - .2) / .2), 'gold', .22, 1.2); }, [[0, 'impact', .4], [.2, 'pling', .4]]);
// 60 «und hasst mich.»: Lena pone los ojos en blanco, se cruza de brazos y gira la cara; Ben baja la mirada
shot(72.58, 'S', null, L => { const [b, l] = stareTable(L); const k = clamp(L.lt / .4); actuar(l, 0, [[0, { ...sitPose(), aLx: 1.2, aRx: 1.2, aLe: 1.9, aRe: 1.9, aLz: -.5, aRz: -.5, headY: .7 * k }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'bored', eyes: L.lt < .4 ? 'up' : 'half' }); cara(b, L.T, { expr: 'sad' });
  faceAt(l, L, 8.3, 7.3, 1, 42); }, [[0, 'swipe', .4], [.2, 'sigh', .5]]);
// 61 «Sie klaut meine Fanta.»: Lena le quita la Fanta de la mano a Ben, da un trago y se va; Ben estira el brazo
shot(73.5, 'W', null, L => { kitchen(L); noChairs(); const b = put(benT, KUX + 3, 0, -10.4, -PI / 2); const k = clamp(L.lt / .35); const l = put(lenaT, KUX - 1 - clamp(L.lt - .5) * 3, 0, -10.6, PI / 2 - (L.lt > .5 ? PI : 0));
  attach(FANTA[0], k < .5 ? b.aR.hand : l.aR.hand, [0, -.5, .45], [PI / 2, 0, 0], .6); actuar(b, 0, [[0, { aRx: 1.5, aRe: .2 }]], { T: L.T }); cara(b, L.T, { expr: k > .5 ? 'angry' : 'happy', mouth: k > .5 ? 'o' : 'smile' });
  actuar(l, 0, [[0, { ...(L.lt > .5 ? walkP(L.T, 0) : {}), aRx: k > .5 ? 2.4 : 1.5, aRe: k > .5 ? .5 : .2, aRz: -.3 }]], { T: L.T }); cara(l, L.T, { expr: 'smug' });
  cm([KUX + 1, 5.8, -2, KUX + 1, 3.8, -10.5, 46], [KUX + 1, 5.6, -2.6, KUX + 1, 3.8, -10.5, 44], L.k); }, [[0, 'whoosh', .4], [.15, 'swipe', .5], [.5, 'gulp', .5]]);
// 62 «Sie trägt immer Handschuhe,»: primer plano de las manos de Lena con guantes de punto verdes, sujetando una cuchara
shot(74.76, 'C', 'punch', L => { kitchen(L); const l = sit(lenaT, KUX + 3.4, 2.8, 5.6, PI, L, {}); actuar(l, 0, [[0, { ...sitPose(), aLx: 1.3, aRx: 1.3, aLe: 1.0, aRe: 1.0, aLz: -.1, aRz: -.1, lean: .2 }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'bored' });
  l.root.updateMatrixWorld(true); const h = l.aR.hand.getWorldPosition(V(0, 0, 0)); cm([h.x + 1.6, h.y + 1.4, h.z - 3.6, h.x - .8, h.y, h.z, 40], [h.x + 1.4, h.y + 1.2, h.z - 3.1, h.x - .8, h.y, h.z, 38], L.k); }, [[0, 'impact', .4], [.2, 'cloth', .5]]);
// 63 «sogar beim Frühstück.»: desayuno: todos comen; Lena con los guantes puestos come cereales
shot(76.06, 'W', null, L => { kitchen(L); const l = sit(lenaT, KUX + 3.4, 2.8, 5.6, PI, L, {}); const sp = Math.sin(L.T * 5); actuar(l, 0, [[0, { ...sitPose(), aRx: 1.3 + sp * .4, aRe: 1.2 + sp * .5, aLx: .6, aLe: .9, lean: .15 }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'bored' });
  const m = sit(mama, KUX - 3.4, 2.8, -5.6, 0, L, { aRx: .9, aRe: 1.2 }); cara(m, L.T, { expr: 'happy' }); const p = sit(papa, KUX - 3.4, 2.8, 5.6, PI, L, { aRx: .9, aRe: 1.2 }); cara(p, L.T, { expr: 'neutral' });
  const b = sit(benT, KUX + 3.4, 2.8, -5.6, 0, L, { aRx: .9, aRe: 1.2 }); cara(b, L.T, { expr: 'happy' }); for (let i = 0; i < 4; i++) show(PLATE[i], KUX + [3.4, -3.4, -3.4, 3.4][i], 4.75, [2.4, -2.4, 2.4, -2.4][i]);
  KU.LMP.visible = false; cm([KUX, 15.6, 6, KUX, 3, 0, 64], [KUX, 15.4, 5.4, KUX, 3, 0, 62], L.k); }, [[0, 'swipe', .4], [.1, 'spoon', .5], [.5, 'chew', .4]]);
// 64 «Und für Guten Morgen»: Mama la saluda con la mano: «GUTEN MORGEN!»
shot(77.27, 'C', 'punch', L => { kitchen(L); const m = sit(mama, KUX - 3.4, 2.8, -5.6, 0, L, {}); actuar(m, 0, [[0, { ...sitPose(), aRx: 2.6, aRz: Math.sin(L.T * 12) * .3 + .2, aRe: .3 }]], { T: L.T, weight: false }); talk(m, L.T, 77.2, 78, 'happy'); bubble(m, 'GUTEN MORGEN!', clamp(L.lt / .2));
  faceAt(m, L, 7.8, 6.8, 0, 40); }, [[0, 'impact', .4], [.1, 'pop', .4]]);
// 65 «ist sie zu müde.»: Lena deja caer la cabeza sobre la mesa, bosteza, ojos medio cerrados
shot(78.01, 'S', null, L => { kitchen(L); const l = sit(lenaT, KUX + 3.4, 2.8, 5.6, PI, L, {}); const k = easeIn(clamp(L.lt / .5)); actuar(l, 0, [[0, { ...sitPose(), lean: .7 * k, headX: .3 * k, aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3 }]], { T: L.T, weight: false });
  cara(l, L.T, k < 1 ? { expr: 'yawn', eyes: 'closed', mouth: 'yawn' } : { expr: 'tired', eyes: 'half' }); faceAt(l, L, 8.3, 7.3, 1.2, 42); }, [[0, 'swipe', .4], [.1, 'yawn_f', .6], [.6, 'thud', .4]]);
// 66 «Mit mir macht sie nur eins:»: por la noche, Lena se señala los ojos con dos dedos y luego a Ben: «te vigilo»
shot(79.01, 'W', null, L => { const [b, l] = stareTable(L); const k = clamp(L.lt / .45); actuar(l, 0, [[0, { ...sitPose(), aRx: 2.0 + (k < 1 ? .4 : 0), aRe: k < 1 ? 1.8 : .3, aRz: -.2, lean: .2 }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'sus' }); cara(b, L.T, { expr: 'gasp' });
  faceAt(l, L, 7.8, 7.0, .8, 40); }, [[0, 'whoosh', .4], [.4, 'swipe', .4]]);
// 67 «nur eins:» → Ben traga saliva y se prepara, se frota las manos
shot(79.95, 'C', null, L => { const [b, l] = stareTable(L); const r = Math.sin(L.T * 14) * .15; actuar(b, 0, [[0, { ...sitPose(), aLx: 1.3, aRx: 1.3, aLe: 1.4, aRe: 1.4, aLz: -.3 + r, aRz: -.3 - r, lean: .2 }]], { T: L.T, weight: false }); cara(b, L.T, { expr: 'determined' });
  faceAt(b, L, 7.0, 6.2, -.6, 40); }, [[0, 'gulp', .6], [.3, 'cloth', .5]]);
// 68 «Anstarren.»: plano partido: los ojos de Lena y los de Ben, enormes (golpe de zoom)
shot(80.91, 'C', 'punch', L => { const [b, l] = stareTable(L); cara(l, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true });
  faceAt(l, L, 4.4, 3.6, 0, 34); }, [[0, 'impact', .5], [.1, 'braam_short', .5]]);
// 69 «Jeden Abend.»: la mesa entera desde arriba: los padres comen tranquilos y los dos hermanos se miran fijamente
shot(81.64, 'W', null, L => { const [b, l] = stareTable(L); cara(l, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true });
  const m = sit(mama, KUX - 3.4, 2.8, -5.6, 0, L, { aRx: .9 + Math.sin(L.T * 5) * .3, aRe: 1.2 }); cara(m, L.T, { expr: 'happy' }); const p = sit(papa, KUX - 3.4, 2.8, 5.6, PI, L, { aRx: .9, aRe: 1.2 }); cara(p, L.T, { expr: 'neutral' });
  for (let i = 0; i < 4; i++) show(PLATE[i], KUX + [3.4, -3.4, -3.4, 3.4][i], 4.75, [2.4, -2.4, 2.4, -2.4][i]); KU.LMP.visible = false; cm([KUX, 15.6, 7, KUX, 3, 0, 64], [KUX, 15.4, 6.4, KUX, 3, 0, 62], L.k); }, [[0, 'whoosh', .4], [.2, 'clock_tick', .4]]);
// 70 «Der Verlierer»: Ben parpadea (pierde); Lena levanta el puño
shot(82.62, 'C', 'punch', L => { const [b, l] = stareTable(L); KU.CH[1].visible = false; cara(b, L.T, L.lt > .2 ? { eyes: 'closed', mouth: 'grimace' } : { eyes: 'wide', mouth: 'grimace' }); blinkFX(b, (L.lt - .2) / .3);
  actuar(l, 0, [[0, { ...sitPose(), aRx: 2.8, aRe: 1.8, aRz: -.2 }]], { T: L.T, weight: false }); cara(l, L.T, { expr: 'joy' }); cm([KUX + 4.6, 7.4, 9.4, KUX + 3.4, 6.2, -5.6, 34], [KUX + 4.5, 7.3, 9, KUX + 3.4, 6.2, -5.6, 32], L.k); }, [[0, 'blink', .6], [.25, 'cheer', .3]]);
// 71 «bringt den Müll raus.»: Lena señala el cubo de basura; Ben suspira
shot(83.38, 'S', null, L => { kitchen(L, { night: true }); noChairs(); const l = put(lenaT, KUX - 6, 0, 5.4, -PI / 2 - .2); actuar(l, 0, [[0, { aRx: 1.6, aRz: .1, aRe: .1 }]], { T: L.T }); cara(l, L.T, { expr: 'smug' });
  const b = put(benT, KUX - 8, 0, 8.5, PI - .5); actuar(b, 0, [[0, { lean: .15, headX: .3, aLz: .1, aRz: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'sad', mouth: 'wavy' });
  cm([KUX + 4, 7.5, 3, KUX - 8, 4.5, 6, 46], [KUX + 3, 7.4, 3.4, KUX - 8, 4.5, 6, 44], L.k); }, [[0, 'swipe', .4], [.3, 'sigh', .5]]);
// 72 «Ich bringe ihn raus,»: Ben arrastra una bolsa de basura enorme por la calle al anochecer hasta los cubos
shot(84.38, 'W', null, L => { gasse(L, { dawn: true }); const b0 = MT.BINS[0].position; const b = put(benT, b0.x - 6 + L.lt * 2.2, 0, b0.z + 4, PI / 2 + .3); const bg = attach(BAG, b.aR.hand, [0, -.6, -1.4], [0, 0, 0], .8); actuar(b, 0, [[0, { ...walkP(L.T * .7, 0), aRx: -.4, aRe: 0, lean: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'tired' });
  cm([b0.x - 16, 6.4, b0.z + 9, b0.x - 4, 4, b0.z + 3, 44], [b0.x - 15, 6.2, b0.z + 8, b0.x - 3, 4, b0.z + 3, 42], L.k); sh(V(b0.x - 4, 0, b0.z), 20); }, [[0, 'whoosh', .4], [.1, 'cloth', .5], [.5, 'steps', .4]]);
// 73 «seit ich vier bin.»: tira la bolsa al cubo (¡pum!) y suspira; «4»
shot(85.48, 'C', 'punch', L => { gasse(L, { dawn: true }); const b0 = MT.BINS[0].position; const b = put(benT, b0.x - 3, 0, b0.z + 1, PI / 2 - .2); const k = clamp(L.lt / .4); show(BAG, lerp(b0.x - 1.8, b0.x, k), lerp(3, 4.2, k) + Math.sin(k * PI) * 2, b0.z, 0, .8);
  actuar(b, 0, [[0, { aRx: lerp(.5, 2.4, k), aLx: lerp(.5, 2.2, k), aRe: .4, aLe: .4 }]], { T: L.T }); cara(b, L.T, { expr: 'tired', mouth: 'wavy' }); bigNum('4', clamp((L.lt - .4) / .2), 'gold', .15, 1.2);
  cm([b0.x - 12, 6.4, b0.z + 7, b0.x - 2, 4, b0.z + 1, 44], [b0.x - 11, 6.2, b0.z + 6.4, b0.x - 2, 4, b0.z + 1, 42], L.k); sh(V(b0.x, 0, b0.z), 20); }, [[.35, 'trash_hit', .6], [.5, 'sigh', .5], [.45, 'pling', .3]]);
// 74 «Dann, letzten Monat,» (zoom lento): el túnel, todos cavando en silencio; la cámara avanza despacio
shot(86.57, 'B', 'slow', L => { tunnel(L, -100); diggers(L, SL, -92, [-6, -2, 2, 6], { avoid: [[0, -106]] }); put(brandt, STX, 0, -106, PI); dig(brandt, L, 3); put(ben, STX + 1, 0, -100, PI); dig(ben, L, 1, { face: false }); cara(ben, L.T, { eyes: 'wide', mouth: 'flat' });
  cm([STX + 2, 9, -84, STX, 4, -106, 46], [STX + 1.6, 8, -90, STX, 4, -106, 44], L.k); sh(V(STX, 0, -100), 30); }, [[0, 'soft_air', .3], [.1, 'shovel', .4], [.6, 'shovel', .4]]);
// 75 «wacht Herr Brandt auf.»: Herr Brandt (gorro azul de dormir) deja de cavar, parpadea y mira a su alrededor
shot(87.69, 'C', 'punch', L => { tunnel(L, -106); const c = put(brandt, STX, 0, -106, PI - .3); const k = clamp(L.lt / .4); c.shovel.visible = true; c.shovel.rotation.set(.25, 0, 0); actuar(c, 0, [[0, { ...digPose(0, 0), lean: lerp(.4, 0, k), crouch: lerp(.3, 0, k), headY: k > .8 ? Math.sin(L.T * 4) * .4 : 0 }]], { T: L.T });
  cara(c, L.T, L.lt < .35 ? { eyes: 'wide', mouth: 'flat' } : L.lt < .5 ? { eyes: 'closed', mouth: 'flat' } : { expr: 'confused' }); blinkFX(c, (L.lt - .35) / .3); diggers(L, SL, -112, [-6, 6]);
  c.root.rotation.y = 0; onFace(c, 6, 0, 0, 40, L.k, 5); }, [[0, 'impact', .4], [.35, 'blink', .6], [.6, 'gasp_old', .5]]);
// 76 «Direkt vor mir.»: por encima del hombro de Ben: Brandt justo delante; Ben se queda helado
shot(89.06, 'W', null, L => { tunnel(L, -104); const c = put(brandt, STX, 0, -108, 0); actuar(c, 0, [[0, { headY: Math.sin(L.T * 5) * .4, aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' }); c.shovel.visible = true;
  put(ben, STX + .8, 0, -101, PI); ben.shovel.visible = true; actuar(ben, 0, [[0, { aRx: .6, aLx: .6, aLe: .4, aRe: .4, ...shiver(L.T, .6) }]], { T: L.T }); diggers(L, SL, -112, [-6, 6]);
  cm([STX + 3.2, 8.4, -96, STX - .2, 5.4, -108, 42], [STX + 2.8, 8.2, -97, STX - .2, 5.4, -108, 40], L.k); }, [[0, 'swipe', .4], [.2, 'heartbeat', .6]]);
// 77 «Er lässt die Schaufel fallen:»: la pala cae al suelo y rebota (clang)
shot(90.08, 'C', 'punch', L => { tunnel(L, -106); const c = put(brandt, STX, 0, -108, 0); actuar(c, 0, [[0, { aLx: .7, aRx: .7, aLe: .3, aRe: .3, aLz: .3, aRz: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock' });
  const k = clamp(L.lt / .35); const s = show(LOOSE[0], STX + 1.2, lerp(3.4, .3, easeIn(k)) + (k >= 1 ? Math.abs(Math.sin((L.lt - .35) * 14)) * .4 * Math.exp(-(L.lt - .35) * 6) : 0), -105, 0); s.rotation.set(0, .4, lerp(.2, PI / 2 - .05, easeIn(k)));
  cm([STX + 4, 2.6, -100.5, STX + 1, 1.2, -105, 40], [STX + 3.6, 2.4, -101, STX + 1, 1.2, -105, 38], L.k); }, [[.33, 'boing_metal', .7], [.45, 'clack', .5]]);
// 78 «Wo bin ich?»: Brandt, desorientado, levanta las manos y gira sobre sí mismo; bocadillo
shot(91.47, 'W', null, L => { tunnel(L, -106); const c = put(brandt, STX, 0, -108, Math.sin(L.T * 2) * .6); actuar(c, 0, [[0, GEST.shrug || { aLx: .8, aRx: .8, aLz: .6, aRz: .6, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); talk(c, L.T, 91.4, 92.3, 'confused'); bubble(c, 'WO BIN ICH?', clamp(L.lt / .2));
  diggers(L, SL, -114, [-6, -2.5, 2.5, 6]); onBody(c, 12, 0, .1, 42, L.k, 10); sh(V(STX, 0, -108), 24); }, [[0, 'whoosh', .4], [.1, 'gasp_old', .5]]);
// 79 «Zwei Leute drehen sich um»: más adelante, dos figuras con farol (el panadero y Herr Krause) se dan la vuelta despacio
shot(92.33, 'S', null, L => { tunnel(L, -116); const k = easeInOut(clamp(L.lt / .9)); const a = put(baecker, STX - 2.2, 0, -116, lerp(PI, 0, k)), b = put(krause, STX + 2.4, 0, -116.6, lerp(PI, 0, k)); lanternUp(a, L, .3, { light: false }); lanternUp(b, L, .3); cara(a, L.T, { expr: 'sus' }); cara(b, L.T, { expr: 'sus' });
  const c = put(brandt, STX, 0, -109, PI); cara(c, L.T, { expr: 'confused' }); cm([STX, 7, -100, STX, 5, -116, 42], [STX, 6.8, -102, STX, 5, -116, 40], L.k); }, [[0, 'swipe', .4], [.3, 'metal_creak', .4], [.6, 'creepy_ting', .5]]);
// 80 «und führen ihn»: cada uno le agarra de un brazo
shot(93.55, 'C', 'punch', L => { tunnel(L, -110); const c = put(brandt, STX, 0, -110, PI / 4); actuar(c, 0, [[0, { aLz: .6, aRz: .6, aLx: .2, aRx: .2, lean: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' });
  const a = put(baecker, STX - 2.6, 0, -109, PI / 4 + .6), b = put(krause, STX + 2.6, 0, -111.4, PI / 4 - .6); actuar(a, 0, [[0, { aRx: 1.2, aRe: .3, aRz: -.4 }]], { T: L.T }); actuar(b, 0, [[0, { aLx: 1.2, aLe: .3, aLz: -.4 }]], { T: L.T }); lanternUp(b, L, .2); cara(a, L.T, { expr: 'angry' }); cara(b, L.T, { expr: 'angry' });
  onBody(c, 13, 0, .1, 42, L.k, 11.5); }, [[0, 'impact', .4], [.1, 'cloth', .6], [.3, 'tug', .4]]);
// 81 «in einen Seitentunnel.»: plano general: se lo llevan hacia la boca oscura del túnel lateral
shot(94.51, 'W', null, L => { tunnel(L, -116); const ry = -2.36, d = L.lt * 3, sx = Math.sin(ry), sz = Math.cos(ry); const c = put(brandt, STX - 2 + sx * d, 0, -108 + sz * d, ry); actuar(c, 0, [[0, { ...walkP(L.T, 0), aLz: .5, aRz: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' });
  const a = put(baecker, c.root.position.x + 1.9, 0, c.root.position.z - 1.9, ry), b = put(krause, c.root.position.x - 1.9, 0, c.root.position.z + 1.9, ry); [a, b].forEach((g, i) => { actuar(g, 0, [[0, walkP(L.T, i + 1)]], { T: L.T }); g.lantern.visible = true; }); lanternUp(b, L, .2);
  diggers(L, SL, -100, [3, 7]); cm([STX + 9, 9, -98, STX - 8, 5, -118, 46], [STX + 8, 9, -100, STX - 9, 5, -119, 44], L.k); sh(V(STX - 6, 0, -114), 30); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 82 «Ins Dunkle.»: las tres siluetas desaparecen en la oscuridad del túnel lateral; el farol se aleja
shot(95.61, 'F', null, L => { tunnel(L, -120); const d = 2 + L.lt * 3; const c = put(brandt, STX - 13 - d, 0, -120, -PI / 2); actuar(c, 0, [[0, walkP(L.T, 0)]], { T: L.T }); const a = put(baecker, STX - 13 - d, 0, -122, -PI / 2), b = put(krause, STX - 13 - d, 0, -118, -PI / 2); [a, b].forEach((g, i) => actuar(g, 0, [[0, walkP(L.T, i + 1)]], { T: L.T })); lanternUp(b, L, .1, { k: 22 });
  cm([STX - 2, 6, -120, STX - 20, 5, -120, 44], [STX - 3, 6, -120, STX - 20, 5, -120, 42], L.k); }, [[0, 'flash', .3], [.1, 'steps', .5], [.5, 'wind', .5]]);
// 83 «Er kam nie wieder raus.» (zoom lento): la boca vacía y oscura; en el suelo, el gorro de dormir azul de Brandt
shot(96.45, 'B', 'slow', L => { tunnel(L, -120); show(CAPF, STX - 11, 0, -119, .4, 1.1); cm([STX - 1, 5, -114, STX - 14, 2, -120, 44], [STX - 4, 4, -117, STX - 14, 1.5, -120, 40], L.k); }, [[0, 'soft_air', .3], [.2, 'sad_tone', .4]]);
// ---------- c: la casa vacía, los guardias y la prueba del farol (97,95 – 146,41 s) ----------
// Casa de Brandt: la puerta DB (fila derecha, x = +15). Túnel: Ben cava en (STX + 2,5, -100) mirando -z; Krause llega por -z y se para delante (z = -103,6).
const DB = MT.DOORS.filter(d => d.x > 0).sort((a, b) => Math.abs(a.z + 20) - Math.abs(b.z + 20))[0];
const BENP = V(STX + 2.5, 0, -100);
function benDig(L, o = {}) { const b = put(ben, BENP.x, 0, BENP.z, PI); if (o.dig !== false) dig(b, L, 0, { face: false, sp: o.sp ?? 1 }); else { b.shovel.visible = true; actuar(b, 0, [[0, { aRx: .7, aLx: .7, aRe: .4, aLe: .4, lean: .05, ...(o.pose || {}) }]], { T: L.T }); } cara(b, L.T, o.face || { eyes: 'wide', mouth: 'flat', noBlink: true }); return b; }
function krauseAt(L, z = -103.6, h = 1, o = {}) { const back = Math.max(0, -103.6 - z), ry = .85; const k = put(krause, BENP.x - 2.4 - Math.sin(ry) * back, 0, BENP.z - 2.2 - Math.cos(ry) * back, ry); lanternUp(k, L, h, o); cara(k, L.T, o.face || { expr: 'sus' }); return k; }
const GROW = () => [WA[0], baecker, krause, WA[1], WA[2], WA[3], WA[4], WA[5], WA[6], WA[7], WA[8], WA[9]];
// sólo el farol junto a la cara de Ben (para los primeros planos: Krause queda fuera de cuadro)
function lampAt(L, k = 30, p = null) { const q = p || V(BENP.x - 1.5, 3.9, BENP.z - 2.8); const f = show(LANTF, q.x, q.y, q.z, .3); LANT.position.copy(q).add(V(.2, -.4, .3)); LANT.intensity = k; return f; }
const guardRow = (L, z, n = 12, o = {}) => GROW().slice(0, n).forEach((g, i) => { const r = Math.floor(i / 6), x = ((i % 6) - 2.5) * 3.2 + r * 1.6; put(g, STX + x, 0, z - r * 3.4 - Math.abs((i % 6) - 2.5) * .5, 0); lanternUp(g, L, o.h ?? .55, { light: i === 2, k: 30 }); cara(g, L.T, { expr: o.expr || 'sus' }); });

// 84 «Am Morgen: sein Haus»: de día, la casa de Brandt: la puerta entreabierta, nadie; hojas que vuelan; la cámara se acerca
shot(97.95, 'B', null, L => { gasse(L, { day: true }); DB.pv.rotation.y = -.7; crowdAt(L, 6, DB.z + 20, 3, 8, 14, 3, { list: DX, mode: 'walk' });
  cm([-4, 7, DB.z + 16, 14, 5, DB.z, 46], [-1, 6.6, DB.z + 10, 14, 5, DB.z, 44], L.k); sh(V(10, 0, DB.z), 26); }, [[0, 'soft_air', .3], [.1, 'wind', .5], [.5, 'wood_creak', .5]]);
// 85 «leer.»: por la puerta abierta: dentro, oscuro y vacío; el felpudo con «BRANDT»
shot(98.81, 'C', 'punch', L => { gasse(L, { day: true }); DB.pv.rotation.y = -1.4; DB.inner.material.emissiveIntensity = 0; DB.inner.material.color.setHex(0x0a0806); cm([5, 6, DB.z - 1, 15, 4.6, DB.z - .6, 40], [6.6, 5.6, DB.z - .8, 15, 4.6, DB.z - .6, 38], L.k); }, [[0, 'impact', .4], [.2, 'creepy_ting', .5]]);
// 86 «Am Abend:»: atardecer: la misma casa con la luz del porche encendida
shot(99.71, 'W', null, L => { gasse(L, { dawn: true }); cm([-4, 8, DB.z + 14, 15, 6, DB.z, 46], [-2, 7.6, DB.z + 11, 15, 6, DB.z, 44], L.k); sh(V(10, 0, DB.z), 26); }, [[0, 'whoosh', .4], [.2, 'crickets', .5]]);
// 87 «ein neuer Mann darin.»: un hombre nuevo (chaqueta de punto verde, gafas) sale al porche y saluda con una sonrisa enorme
shot(100.55, 'C', 'punch', L => { gasse(L, { dawn: true }); DB.pv.rotation.y = -1.5; const n = put(neuer, 12.4, 0, DB.z, -PI / 2); actuar(n, 0, [[0, 'wave']], { T: L.T }); grin(n, L.T); onBody(n, 12, 0, .1, 42, L.k, 10); sh(V(12, 0, DB.z), 20); }, [[0, 'impact', .4], [.1, 'door_open', .5], [.3, 'whistle', .3]]);
// 88 «Woher er kommt?»: Ben (con su Fanta) le pregunta desde la acera, curioso
shot(101.59, 'S', null, L => { gasse(L, { dawn: true }); const b = put(benT, 4, 0, DB.z + 2, PI / 2 - .2); attach(FANTA[0], b.aL.hand, [0, -.5, .45], [PI / 2, 0, 0], .6); actuar(b, 0, [[0, { aLx: .9, aLe: .6, aRx: .6, aRz: .4, aRe: 1.2, headY: .1 }]], { T: L.T }); talk(b, L.T, 101.5, 102.5, 'confused');
  const n = put(neuer, 12.4, 0, DB.z, -PI / 2); grin(n, L.T); onBody(b, 9, -.4, .1, 42, L.k, 8, -.3, 3); }, [[0, 'swipe', .4], [.2, 'pop', .3]]);
// 89 «Ach, von hier und da.»: el hombre nuevo se encoge de hombros y señala vagamente a todas partes, sonrisa rara
shot(102.52, 'W', null, L => { gasse(L, { dawn: true }); const n = put(neuer, 12.4, 0, DB.z, -PI / 2); const s = Math.sin(L.T * 3); actuar(n, 0, [[0, { aRx: 1.4, aRz: .6 + s * .5, aRe: .2, aLz: .5, aLe: 1.2, headZ: .15 }]], { T: L.T }); talk(n, L.T, 102.5, 103.3, 'happy'); bubble(n, 'VON HIER UND DA…', clamp(L.lt / .2));
  onFace(n, 6, 0, 0, 40, L.k, 5.2); }, [[0, 'whoosh', .4], [.4, 'creepy_ting', .4]]);
// 90 «Aber die zwei haben»: recuerdo en el túnel: el panadero y Krause, de cerca, girándose
shot(103.72, 'F', null, L => { tunnel(L, -116); const a = put(baecker, STX - 1.8, 0, -116, -.2), b = put(krause, STX + 1.8, 0, -116.4, .2); lanternUp(a, L, .4, { light: false }); lanternUp(b, L, .4); cara(a, L.T, { expr: 'sus' }); cara(b, L.T, { expr: 'sus' });
  orbit(V(STX, 6.4, -116.2), lerp(10, 9, L.k), 0, .04, 42); }, [[0, 'flash', .3], [.1, 'creepy_ting', .5]]);
// 91 «geblinzelt.» (zoom lento): primerísimo plano de Krause: parpadea; destello de rayitas
shot(104.58, 'C', 'slow', L => { tunnel(L, -116); const b = put(krause, STX + 1.8, 0, -116.4, 0); lanternUp(b, L, .4); const bl = L.lt > .3 && L.lt < .5; cara(b, L.T, { expr: 'sus', eyes: bl ? 'closed' : 'squint' }); blinkFX(b, (L.lt - .25) / .35);
  onFace(b, 4, 0, 0, 36, L.k, 3.2); }, [[.3, 'blink', .7]]);
// 92 «Und Schlafwandler»: travelling por una fila de sonámbulos cavando, ojos abiertos
shot(105.43, 'W', null, L => { tunnel(L, -80); [SL[1], SL[6], SL[11], SL[16]].forEach((c, i) => { put(c, STX - 4.5 + i * 3, 0, -80 - (i % 2), PI); dig(c, L, i); }); cm([STX - 6, 6, -71, STX - 4, 5, -80, 40], [STX + 4, 6, -71, STX + 3, 5, -80, 40], L.k, x => x); }, [[0, 'swipe', .4], [.2, 'shovel', .5]]);
// 93 «blinzeln nie.»: primer plano de una sonámbula: ojos abiertos de par en par, ni un parpadeo
shot(106.29, 'C', 'punch', L => { tunnel(L, -80); const c = put(SL[6], STX - 1.5, 0, -80, 0); actuar(c, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); sleepFace(c, L.T); onFace(c, 4.2, 0, 0, 38, L.k, 3.6); }, [[0, 'impact', .4], [.2, 'creepy_ting', .4]]);
// 94 «Der eine war der Bäcker.»: el panadero con su gorro y el farol, de frente; «BÄCKER»
shot(107.05, 'W', null, L => { tunnel(L, -90); const a = put(baecker, STX, 0, -90, 0); lanternUp(a, L, .7); cara(a, L.T, { expr: 'sus' }); diggers(L, SL, -96, [-7, 7]);
  onBody(a, 10, .15, .1, 42, L.k, 8.6, .1, 3.6); badge('tag', 'BÄCKER', W / 2, H * .63, clamp((L.lt - .7) / .2)); }, [[0, 'whoosh', .4], [.7, 'pop', .4]]);
// 95 «Der andere»: Krause aparece detrás, en la penumbra, con el farol
shot(108.42, 'S', null, L => { tunnel(L, -100); const k = put(krause, STX, 0, -100, 0); lanternUp(k, L, .5, { k: 40 }); cara(k, L.T, { expr: 'angry' }); diggers(L, SL, -106, [-7, 7]); onBody(k, 12, -.2, .08, 42, L.k, 10.5); }, [[0, 'swipe', .4], [.2, 'creepy_ting', .5]]);
// 96 «Herr Krause,»: golpe de zoom a su cara: cejas gruesas, mirada dura
shot(109.14, 'C', 'punch', L => { tunnel(L, -100); const k = put(krause, STX, 0, -100, 0); lanternUp(k, L, .5, { k: 40 }); cara(k, L.T, { expr: 'angry' }); onFace(k, 4.6, 0, 0, 38, L.k, 4); badge('tag', 'HERR KRAUSE', W / 2, H * .63, clamp((L.lt - .2) / .2)); }, [[0, 'impact', .6], [.2, 'braam_short', .4]]);
// 97 «mein Sportlehrer.»: de día en el patio: Krause pita el silbato y los niños corren; Ben (camiseta amarilla) le mira de reojo
shot(109.86, 'W', null, L => { schulS(L); const k = put(krause, SCX, 0, -4, 0); actuar(k, 0, [[0, { aRx: 2.2, aRe: 2.1, aRz: -.3, aLz: .4, lean: -.05 }]], { T: L.T }); cara(k, L.T, { expr: 'shout', mouth: 'o' });
  crowdAt(L, SCX, 4, 6, 5, 9, 9, { list: DX, mode: 'run', dir: PI / 2 }); POST.push(() => DX.forEach(c => { if (c.root.visible) c.root.scale.setScalar(.72); })); const b = put(benT, SCX - 3.6, 0, 3, PI - .6); cara(b, L.T, { expr: 'sus', eyes: 'side_r' });
  onBody(k, 15, 0, .12, 44, L.k, 13); sh(V(SCX, 0, 0), 24); }, [[0, 'whoosh', .4], [.1, 'whistle', .7], [.3, 'run_grass', .4]]);
// 98 «Also zähle ich nachts.»: Ben cava y mira de reojo a izquierda y derecha
shot(110.75, 'S', null, L => { tunnel(L, -100); benDig(L, { face: { eyes: Math.sin(L.T * 4) > 0 ? 'side_l' : 'side_r', mouth: 'flat' } }); diggers(L, SL, -96, [-7, -2.5, 7], { avoid: [[2.5, -100]] }); onFace(ben, 4.6, 0, .4, 40, L.k, 4); }, [[0, 'swipe', .4], [.1, 'shovel', .4]]);
// 99 «nachts.»: sus dedos cuentan escondidos junto a la pala: 1, 2, 3…
shot(111.49, 'C', null, L => { tunnel(L, -100); const b = benDig(L, { dig: false, pose: { aLx: 1.2, aLe: 1.4, aLz: -.2 } }); const n = 1 + Math.floor(L.lt / .16); badge('num', String(Math.min(n, 5)), W / 2, H * .3, 1);
  b.root.updateMatrixWorld(true); const h = b.aL.hand.getWorldPosition(V(0, 0, 0)); cm([h.x - 1, h.y + 1.6, h.z - 4, h.x, h.y, h.z, 38], [h.x - .8, h.y + 1.4, h.z - 3.4, h.x, h.y, h.z, 36], L.k); }, [[0, 'tick', .5], [.16, 'tick', .5], [.32, 'tick', .5], [.48, 'tick', .5]]);
// 100 «Zwölf Leute im Tunnel»: plano general del túnel: los faroles de los guardias se encienden uno a uno entre los que cavan; contador hasta 12
shot(112.14, 'W', null, L => { tunnel(L, -80); diggers(L, SL, -60, [-6, -2, 2, 6]); const n = Math.min(12, 1 + Math.floor(L.lt / .08)); GUARDS.slice(0, n).forEach((g, i) => { put(g, STX + [-9, 9][i % 2] * .9, 0, -62 - i * 6, i % 2 ? -PI / 2 : PI / 2); lanternUp(g, L, .6, { light: false }); cara(g, L.T, { expr: 'sus' }); });
  cm([STX, 16, -40, STX, 3, -100, 48], [STX, 15, -44, STX, 3, -104, 48], L.k); bigNum(String(n), 1, 'gold', .2, 1.3); }, [[0, 'whoosh', .4], [.05, 'pling', .3], [.3, 'pling', .3], [.6, 'pling', .3], [.9, 'ding_soft', .5]]);
// 101 «blinzeln.»: un guardia de bigote parpadea a cámara
shot(113.2, 'C', 'punch', L => { tunnel(L, -80); const g = put(WA[1], STX, 0, -80, 0); lanternUp(g, L, .6); cara(g, L.T, { expr: 'sus', eyes: L.lt > .2 && L.lt < .38 ? 'closed' : 'squint' }); blinkFX(g, (L.lt - .15) / .3); onFace(g, 4.4, 0, 0, 38, L.k, 3.8); }, [[.2, 'blink', .7]]);
// 102 «Sie graben nicht.»: dos guardias de brazos cruzados miran a los que cavan; ellos no tienen pala
shot(113.85, 'W', null, L => { tunnel(L, -90); diggers(L, SL, -94, [-7, -2.5, 2.5, 7]); const g = put(WA[3], STX + 8.4, 0, -88, -PI / 2 - .5); actuar(g, 0, [[0, CROSS]], { T: L.T }); cara(g, L.T, { expr: 'smug' }); const g2 = put(WA[2], STX - 8.4, 0, -97, PI / 2 + .3); actuar(g2, 0, [[0, CROSS]], { T: L.T }); cara(g2, L.T, { expr: 'smug' });
  onBody(g, 10, .95, .08, 44, L.k, 9, .85); }, [[0, 'whoosh', .4], [.1, 'shovel', .5], [.5, 'shovel', .4]]);
// 103 «Sie leuchten jedem mit»: un guardia acerca el farol a la cara de un sonámbulo que cava
shot(114.89, 'S', null, L => { tunnel(L, -90); const c = put(SL[12], STX - 1.6, 0, -90, PI / 2); dig(c, L, 0, { sp: .6 }); const g = put(WA[4], STX + 2.4, 0, -90, -PI / 2); lanternUp(g, L, lerp(.4, 1, clamp(L.lt / .5))); cara(g, L.T, { expr: 'sus' });
  cm([STX, 7, -80, STX + .4, 5.4, -90, 42], [STX, 6.8, -82, STX + .4, 5.4, -90, 40], L.k); }, [[0, 'swipe', .4], [.2, 'metal_creak', .4]]);
// 104 «Laternen in die Augen.»: primer plano: el farol pegado a sus ojos abiertos; ni se inmuta
shot(115.93, 'C', 'punch', L => { tunnel(L, -90); const c = put(SL[12], STX - 1.6, 0, -90, PI / 2); actuar(c, 0, [[0, { aLx: .4, aRx: .4 }]], { T: L.T }); sleepFace(c, L.T); const g = put(WA[4], STX + 2.4, 0, -90, -PI / 2); lanternUp(g, L, 1, { k: 46 }); cara(g, L.T, { expr: 'sus' });
  cm([STX + 4.6, 7.4, -86.2, STX - 1.4, 6, -90, 40], [STX + 4.2, 7.2, -86.6, STX - 1.4, 6, -90, 38], L.k); }, [[0, 'impact', .4], [.1, 'hum_low', .4]]);
// 105 «Sie suchen jeden,»: un guardia avanza por la fila mirando cara por cara (travelling hacia atrás)
shot(117.17, 'W', null, L => { tunnel(L, -96); diggers(L, SL, -88, [-7, -3, 3, 7]); const g = guardWalk(WA[5], L, STX, -108, 0, 3, 0, .8); lanternUp(g, L, .8, { pose: walkP(L.T * .8, 0) }); const p = g.root.position; orbit(V(p.x, 5.4, p.z), 10, 0, .08, 42); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 106 «der wach ist.»: el guardia se agacha y mira de cerca a un niño, sospechando
shot(117.95, 'C', 'punch', L => { tunnel(L, -96); const c = put(SL.filter(x => x.kid)[2], STX + 1, 0, -96, 0); actuar(c, 0, [[0, { aLx: .4, aRx: .4 }]], { T: L.T }); sleepFace(c, L.T); const g = put(WA[5], STX + 1, 0, -99.2, 0); lanternUp(g, L, .9, { pose: { lean: .5, crouch: .4 } }); cara(g, L.T, { expr: 'sus' });
  cm([STX + 9, 6.6, -96, STX + 1, 4.8, -97.6, 42], [STX + 8.4, 6.4, -96.2, STX + 1, 4.8, -97.6, 40], L.k); }, [[0, 'impact', .4], [.2, 'sniff', .5]]);
// 107 «Wir schlafwandeln nicht einfach.» (zoom lento): el túnel lleno, todos cavando a la vez
shot(118.97, 'F', 'slow', L => { tunnel(L, -60); diggers(L, SL, -40, [-7, -3, 1, 5]); cm([STX + 1, 14, -18, STX, 4, -70, 48], [STX + 1, 12, -26, STX, 4, -74, 46], L.k); sh(V(STX, 0, -50), 50); }, [[0, 'flash', .3], [.1, 'shovel', .5], [.5, 'shovel', .5]]);
// 108 «einfach.»: montones de tierra enormes a los lados; la tierra vuela
shot(119.85, 'C', null, L => { tunnel(L, -140); diggers(L, SL.slice(0, 12), -136, [-3, 3]); dust(V(STX, 0, -138), L.t0, L.T, 14, .7); cm([STX + 8, 10, -124, STX - 2, 3, -150, 46], [STX + 7, 9, -128, STX - 2, 3, -150, 44], L.k); }, [[0, 'shovel', .5], [.3, 'rubble', .5]]);
// 109 «Jemand lässt uns»: al fondo del túnel, donde no llega la luz, una silueta enorme con un farol vigila (solo se ve la luz)
shot(120.82, 'B', null, L => { tunnel(L, -200, { h: .45, fill: 14 }); diggers(L, SL.slice(0, 8), -190, [-4, 4]); const g = put(WA[6], STX, 0, -232, 0); lanternUp(g, L, .9, { k: 30 }); g.setFace({ eyes: 'squint', mouth: 'flat' });
  cm([STX, 7, -178, STX, 6, -232, 42], [STX, 7, -182, STX, 6, -232, 40], L.k); }, [[0, 'soft_air', .3], [.2, 'hum_low', .5]]);
// 110 «arbeiten.»: una vagoneta llena de tierra empujada por dos sonámbulos sobre los raíles
shot(121.54, 'W', null, L => { tunnel(L, -60); const z = -60; [SL[20], SL[21]].forEach((c, i) => { put(c, STX + (i ? 1.6 : -1.6), 0, z + 5.4, PI); actuar(c, 0, [[0, { ...sleepP(L.T, i), aLx: 1.4, aRx: 1.4, aLe: .2, aRe: .2, lean: .3 }]], { T: L.T }); sleepFace(c, L.T); });
  ST.g.updateMatrixWorld(true); cm([STX + 7, 6, z + 14, STX, 3, z, 44], [STX + 6, 6, z + 12, STX, 3, z, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'wheels', .6]]);
// 111 «Und die Zwölf»: los doce guardias en fila, frente a cámara, con sus faroles
shot(122.44, 'C', 'punch', L => { tunnel(L, -110); guardRow(L, -110); cm([STX, 7, -86, STX, 5, -112, 48], [STX, 7, -88, STX, 5, -112, 48], L.k); bigNum('12', clamp((L.lt - .1) / .2), 'gold', .2, 1.2); }, [[0, 'impact', .5], [.1, 'braam_short', .5]]);
// 112 «sind die Wächter.» (zoom lento): la cámara se acerca a Krause en el centro de la fila; «WÄCHTER»
shot(123.28, 'F', 'slow', L => { tunnel(L, -110); guardRow(L, -110); onFace(krause, 7, 0, 0, 40, L.k, 5); badge('red', 'WÄCHTER', W / 2, H * .2, clamp((L.lt - .2) / .2)); }, [[0, 'flash', .3]]);
// 113 «Seitdem erkenne ich sie»: de día en la calle, Ben camina mirando de reojo a la gente que pasa
shot(124.14, 'W', null, L => { gasse(L, { day: true }); const b = put(benT, 2, 0, 6 - L.lt * 2, PI); actuar(b, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(b, L.T, { expr: 'sus', eyes: Math.sin(L.T * 3) > 0 ? 'side_l' : 'side_r' });
  crowdAt(L, 2, -6, 5, 6, 12, 11, { list: DX, mode: 'walk' }); onBody(b, 10, 0, .08, 42, L.k, 9, 0, 3); sh(V(2, 0, 2), 20); }, [[0, 'whoosh', .4], [.1, 'city_amb', .4], [.2, 'steps', .5]]);
// 114 «auch am Tag.»: el panadero pasa sonriendo con una cesta de pan; Ben le sigue con la mirada
shot(125.06, 'S', null, L => { gasse(L, { day: true }); const a = put(baecker, -2 + L.lt * 2.6, 0, -2, PI / 2); actuar(a, 0, [[0, { ...walkP(L.T, 1), aRx: 1.1, aRe: 1.3 }]], { T: L.T }); grin(a, L.T); const bs = attach(PLATE[0], a.aR.hand, [0, -.5, .8], [0, 0, 0], 1.6);
  const b = put(benT, 4.4, 0, 5, PI - .9); cara(b, L.T, { expr: 'sus', eyes: 'side_r' }); cm([2, 7, 15, 1.6, 5, -1, 46], [2.4, 7, 14, 2.2, 5, -1, 44], L.k); sh(V(1, 0, 0), 20); }, [[0, 'swipe', .4], [.1, 'steps', .5]]);
// 115 «Alle haben Blasen.»: manos de la gente del pueblo con ampollas: una vecina cuenta monedas
shot(125.97, 'C', 'punch', L => { gasse(L, { day: true }); const c = put(DX[2], 0, 0, 10, 0); c.blis.visible = true; actuar(c, 0, [[0, PALMS]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  onBody(c, 7.4, 0, .5, 40, L.k, 6.6, 0, 2.4); }, [[0, 'impact', .4], [.2, 'coin_flip', .5]]);
// 116 «Die Wächter haben»: Krause enseña las palmas: limpísimas, brillan
shot(127.08, 'W', null, L => { schulS(L); const k = put(krause, SCX, 0, 0, 0); actuar(k, 0, [[0, { ...PALMS, headX: .1 }]], { T: L.T }); grin(k, L.T); onBody(k, 8, 0, .4, 40, L.k, 7, 0, 3.4);
  FX2D.push(c => { for (let i = 0; i < 5; i++) { const a = L.T * 2 + i * 1.3; c.fillStyle = '#ffffff'; c.globalAlpha = .5 + .5 * Math.sin(a * 3); c.beginPath(); c.arc(W / 2 + Math.cos(a) * 180, H * .46 + Math.sin(a * 1.3) * 90, 12, 0, 7); c.fill(); } c.globalAlpha = 1; }); }, [[0, 'whoosh', .4], [.2, 'sparkle', .6]]);
// 117 «saubere Hände.»: Ben compara: sus manos llenas de ampollas
shot(127.82, 'C', 'punch', L => { schulS(L); const b = put(benT, SCX, 0, 0, 0); b.blis.visible = true; actuar(b, 0, [[0, PALMS]], { T: L.T }); cara(b, L.T, { expr: 'sad' }); onBody(b, 7, 0, .5, 40, L.k, 6.2, 0, 2.0); }, [[0, 'impact', .4], [.2, 'sigh', .5]]);
// 118 «Ich glaube, jeder hat so einen»: un vecino en su porche finge regar las flores pero no le quita ojo a Ben
shot(128.9, 'W', null, L => { gasse(L, { day: true }); const d = MT.DOORS.filter(d => d.x < 0)[3]; const g = put(WA[7], -12.4, 0, d.z + 3, PI / 2 + .2); actuar(g, 0, [[0, { aRx: 1.2, aRe: .3, headY: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'sus', eyes: 'side_r' });
  onBody(g, 12, .2, .1, 42, L.k, 10.5); }, [[0, 'whoosh', .4], [.2, 'pour', .4], [.6, 'birds', .3]]);
// 119 «in seiner Straße.»: Ben le devuelve la mirada de reojo, desconfiado
shot(130.06, 'C', 'punch', L => { gasse(L, { day: true }); const b = put(benT, 0, 0, 8, -PI / 2 + .5); cara(b, L.T, { expr: 'sus', eyes: 'side_l' }); actuar(b, 0, [[0, CROSS]], { T: L.T }); onFace(b, 5, 0, 0, 40, L.k, 4.4); }, [[0, 'impact', .4], [.2, 'tick', .3]]);
// 120 «Letzte Nacht rieselt mir Staub»: túnel: Ben cava; del techo empieza a caer polvo justo encima de él
shot(131.22, 'B', null, L => { tunnel(L, -100); benDig(L); diggers(L, SL, -96, [-7, -2.5, 7], { avoid: [[2.5, -100]] }); dustFall(V(BENP.x, 6, BENP.z), L.t0 + .2, L.T, 18);
  onBody(ben, 8, .5, .3, 42, L.k, 7, .5, 2.2); }, [[0, 'soft_air', .3], [.2, 'rubble', .6], [.5, 'sprinkle', .5]]);
// 121 «von der Decke»: el polvo cae de la viga del techo (contrapicado)
shot(132.28, 'S', null, L => { tunnel(L, -100); benDig(L); dustFall(V(BENP.x, 8, BENP.z), L.t0 - .5, L.T, 24); cm([BENP.x - 2, 5, BENP.z - 5, BENP.x, 17, BENP.z, 50], [BENP.x - 2, 5, BENP.z - 5, BENP.x, 15, BENP.z, 48], L.k); }, [[0, 'swipe', .4], [.2, 'sprinkle', .6]]);
// 122 «in die Augen.»: primerísimo plano: el polvo le entra en los ojos; se le ponen rojos y lloran, pero no parpadea
shot(133.1, 'C', 'punch', L => { tunnel(L, -100); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true } }); b.red.visible = true; tears(b, L.T); dustFall(V(BENP.x, 4, BENP.z), L.t0 - .3, L.T, 10); onFace(b, 3.4, 0, 0, 36, L.k, 2.9); }, [[0, 'impact', .4], [.2, 'shiver', .5]]);
// 123 «Und Herr Krause kommt»: Krause avanza por el pasillo entre los que cavan, farol en alto, hacia la cámara
shot(133.76, 'W', null, L => { tunnel(L, -110); diggers(L, SL, -104, [-7, -3, 6], { avoid: [[2.5, -100]] }); const k = guardWalk(krause, L, BENP.x - .3, -126, 0, 3.2, 0, .9); lanternUp(k, L, .9, { pose: walkP(L.T * .8, 0) }); cara(k, L.T, { expr: 'sus' });
  const p = k.root.position; orbit(V(p.x, 5.4, p.z), 12, .1, .06, 42); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 124 «die Reihe entlang.»: mira cara por cara, farol a un lado y al otro
shot(134.38, 'S', null, L => { tunnel(L, -110); diggers(L, SL, -104, [-7, -3, 6], { avoid: [[2.5, -100]] }); const k = guardWalk(krause, L, BENP.x - .3, -114, 0, 2.6, 0, .9); k.root.rotation.y = Math.sin(L.T * 3) * .6; lanternUp(k, L, .9); cara(k, L.T, { expr: 'sus' });
  cm([BENP.x - .3, 13, -96, BENP.x - .3, 5, -114, 46], [BENP.x - .3, 12, -98, BENP.x - .3, 5, -114, 44], L.k); }, [[0, 'swipe', .4], [.1, 'steps', .5], [.6, 'sniff', .4]]);
// 125 «Er bleibt vor mir stehen.»: los pies de Krause se paran junto a la pala de Ben
shot(135.22, 'C', 'punch', L => { tunnel(L, -102); benDig(L, { dig: false }); const k = krauseAt(L, -103.6 - Math.max(0, .4 - L.lt) * 4, .3); cm([BENP.x + 4.4, 2.2, BENP.z - .4, BENP.x - 2.2, .8, BENP.z - 2.6, 44], [BENP.x + 4, 2.1, BENP.z - .6, BENP.x - 2.2, .8, BENP.z - 2.6, 42], L.k); }, [[0, 'impact', .5], [.3, 'steps', .5]]);
// 126 «stehen.»: contrapicado desde Ben: Krause le mira desde arriba
shot(135.78, 'W', null, L => { tunnel(L, -102); benDig(L, { dig: false }); const k = krauseAt(L, -103.6, .4, { face: { expr: 'sus' } }); onBody(krause, 8, .9, -.3, 48, L.k, 7, .9, 3.6); }, [[0, 'swipe', .4], [.2, 'heartbeat', .6]]);
// 127 «Die Laterne direkt»: Krause levanta el farol hasta la cara de Ben
shot(136.72, 'S', null, L => { tunnel(L, -102); benDig(L, { dig: false }); krauseAt(L, -103.6, lerp(.3, 1, clamp(L.lt / .6)), { k: 50 }); cm([BENP.x + 6.4, 7, BENP.z - 5, BENP.x - 1.2, 5.2, BENP.z - 1.2, 44], [BENP.x + 5.8, 6.8, BENP.z - 4.6, BENP.x - 1.2, 5.2, BENP.z - 1.2, 42], L.k); }, [[0, 'whoosh', .4], [.2, 'metal_creak', .5]]);
// 128 «vor meinem Gesicht.» (zoom lento): la luz del farol en la cara de Ben, que aguanta con los ojos abiertos
shot(137.56, 'F', 'slow', L => { tunnel(L, -102); const b = benDig(L, { dig: false }); lampAt(L); onFace(b, 4.4, 0, -.8, 38, L.k, 3.4); }, [[0, 'flash', .3]]);
// 129 «Fünfzehn Sekunden.»: los ojos de Ben, enormes; «15 SEK.»
shot(138.36, 'C', 'punch', L => { tunnel(L, -102); const b = benDig(L, { dig: false }); lampAt(L); onFace(b, 3, 0, 0, 34, L.k, 2.7); bigNum('15 SEK.', clamp(L.lt / .2), 'big', .63, 1.1); }, [[0, 'impact', .5], [.05, 'tick', .6], [.5, 'tick', .5]]);
// 130 «Sekunden.»: la cara de Krause detrás del farol, buscando el parpadeo
shot(139.2, 'S', null, L => { tunnel(L, -102); benDig(L, { dig: false }); const k = krauseAt(L, -103.6, 1, { k: 50, face: { expr: 'sus', eyes: 'squint' } }); onFace(k, 4.6, 0, .8, 38, L.k, 4); }, [[0, 'swipe', .4], [.2, 'tick', .5]]);
// 131 «Dreißig.»: los ojos de Ben empiezan a ponerse rojos; «30 SEK.»
shot(139.86, 'C', 'punch', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true } }); b.red.visible = L.lt > .3; lampAt(L); onFace(b, 3, 0, 0, 34, L.k, 2.6); bigNum('30 SEK.', clamp(L.lt / .2), 'big', .63, 1.1); }, [[0, 'impact', .5], [.05, 'tick', .6], [.5, 'tick', .5]]);
// 132 «Meine Augen brennen.»: rojos, con lágrimas; le tiembla la cara
shot(140.88, 'W', null, L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true }, pose: shiver(L.T, 1.4) }); b.red.visible = true; tears(b, L.T); lampAt(L); onFace(b, 3.6, 0, .5, 36, L.k, 3.2); }, [[0, 'swipe', .4], [.1, 'fire_crackle', .5], [.4, 'shiver', .5]]);
// 133 «Fünfundvierzig.»: «45 SEK.» en rojo; Ben suda
shot(141.7, 'C', 'punch', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true }, pose: shiver(L.T, 1.6) }); b.red.visible = true; tears(b, L.T); sweat(b, L.T, 2); lampAt(L); onFace(b, 3.2, 0, 0, 34, L.k, 2.8); bigNum('45 SEK.', clamp(L.lt / .2), 'red', .63, 1.1); }, [[0, 'impact', .5], [.05, 'tick', .6], [.4, 'heartbeat', .6]]);
// 134 «Fünfundvierzig.» → el farol en primer plano, la llama tiembla
shot(142.4, 'S', null, L => { tunnel(L, -102); benDig(L, { dig: false }); const k = krauseAt(L, -103.6, 1, { k: 60 + Math.sin(L.T * 30) * 10 }); k.root.updateMatrixWorld(true); const w = k.lantern.userData.bulb.getWorldPosition(V(0, 0, 0)); cm([w.x + 2.2, w.y + .6, w.z + 2.4, w.x, w.y, w.z, 40], [w.x + 1.8, w.y + .5, w.z + 2, w.x, w.y, w.z, 38], L.k); }, [[0, 'swipe', .4], [.1, 'fire_crackle', .6]]);
// 135 «Ich denke an Herrn Brandt.»: recuerdo: el gorro azul de Brandt tirado en la boca oscura del túnel lateral
shot(143.18, 'B', null, L => { tunnel(L, -120, { h: .4, fill: 10 }); show(CAPF, STX - 11, 0, -119, .4, 1.1); grade.uniforms.sepia.value = .5; cm([STX - 4, 4.6, -116, STX - 12, 1.2, -120, 42], [STX - 5.4, 4, -117.4, STX - 12, 1.2, -120, 40], L.k); }, [[0, 'soft_air', .3], [.2, 'sad_tone', .4]]);
// 136 «Sechzig.»: «60 SEK.» con latido; los ojos de Ben, rojos y temblando
shot(144.38, 'C', 'punch', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: 'wide', mouth: 'grimace', noBlink: true }, pose: shiver(L.T, 2) }); b.red.visible = true; tears(b, L.T); sweat(b, L.T, 2); lampAt(L); onFace(b, 2.8, 0, 0, 32, L.k, 2.5); bigNum('60 SEK.', clamp(L.lt / .2), 'red', .63, 1.2); SHAKE = .25; }, [[0, 'impact', .6], [.05, 'heartbeat', .7]]);
// 137 «Gleich blinzle ich.» (zoom lento): los párpados le tiemblan; la viñeta se cierra
shot(145.28, 'F', 'slow', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { eyes: Math.sin(L.T * 40) > .6 ? 'half' : 'wide', mouth: 'grimace', noBlink: true }, pose: shiver(L.T, 2.4) }); b.red.visible = true; tears(b, L.T); lampAt(L); onFace(b, 2.8, 0, 0, 32, L.k, 2.2); }, [[0, 'flash', .3], [.2, 'heartbeat', .7]]);
// ---------- d: Lena, la verdad y la campana (146,41 – 222,8 s) ----------
// Krause frente a Ben (BENP) mirando +z; Lena llega por detrás de Krause (desde -z) y choca con él.
const LENP = V(BENP.x - .3, 0, -106.2), KLP = V(BENP.x + 2.2, 0, -102.6);
function krauseL(L, h = 1, o = {}) { const c = put(krause, KLP.x, 0, KLP.z, -2.25); lanternUp(c, L, h, o); cara(c, L.T, o.face || { expr: 'sus' }); return c; }
function benFaceL(L, d = 0) { cm([LZX - 4.8, 4.3, 4.6, LZX - .4, 3.5, 2.4, 40], [LZX - 4.2, 4.2, 4.3, LZX - .4, 3.5, 2.4, 38], L.k); }
function lampL(L, k = 30) { const q = V(LENP.x + 1.4, 6.4, LENP.z + 3.6); show(LANTF, q.x, q.y, q.z, -.4); LANT.position.copy(q).add(V(-.3, -.4, -.3)); LANT.intensity = k; }
function lenaStand(L, o = {}) { const l = put(lena, LENP.x + (o.dx ?? 0), 0, LENP.z + (o.dz ?? 0), o.ry ?? 0); actuar(l, 0, [[0, { aLx: .3, aRx: .3, ...(o.pose || {}) }]], { T: L.T }); if (o.face) cara(l, L.T, o.face); else sleepFace(l, L.T); return l; }
function krauseDown(L, k) { const c = put(krause, BENP.x + 1.2, 0, -103.6 - k * 1.2, 0); c.root.rotation.x = -PI / 2 * easeIn(k) * .98; c.root.position.y = Math.sin(k * PI) * .4; actuar(c, 0, [[0, { aLx: 1.6 * k, aRx: 1.6 * k, aLz: .5 * k, aRz: .5 * k, lLx: .6 * k }]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); return c; }
// Lena y Ben en su cuarto: Lena sentada en el borde de la cama (LZX - 9 + 4,6, z = 0) mirando +x; Ben de pie delante (LZX - 1, z = 0) mirando -x
function lenaRoomPair(L, o = {}) { lenaRoom(L, { dawn: o.dawn ?? true }); const l = put(lena, LZX - 4.6, sitY(lena, 3.7), 0, PI / 2); actuar(l, 0, [[0, { ...sitPose(), aLx: .6, aRx: .6, aLe: .8, aRe: .8, ...(o.lp || {}) }]], { T: L.T, weight: false }); l.blob.visible = false;
  const b = put(ben, LZX - .4, 0, 2.4, -2.09); actuar(b, 0, [[0, { ...(o.bp || {}) }]], { T: L.T }); return [l, b]; }
const young = (fn) => { sepia(); fn(); };

// 138 «Da läuft jemand voll»: por detrás de Krause, una sonámbula (Lena, pijama burdeos) avanza recta hacia él
shot(146.41, 'W', null, L => { tunnel(L, -104); benDig(L, { dig: false }); krauseAt(L, -103.6, 1, { k: 50 }); const l = sleepWalk(lena, L, LENP.x, LENP.z - 6, 0, 2.6, 0, { t0: 0 });
  cm([BENP.x - 6, 7, -96, BENP.x - .3, 5, -108, 44], [BENP.x - 5.4, 7, -97, BENP.x - .3, 5, -108, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 139 «in Herrn Krause rein,»: ¡choque! Lena se estampa contra su espalda
shot(147.38, 'C', 'punch', L => { tunnel(L, -104); benDig(L, { dig: false }); const k = clamp(L.lt / .3); const kr = put(krause, BENP.x - .3 + k * 1.2, 0, -103.6 + k * .6, 0); lanternUp(kr, L, 1 - k * .6); actuar(kr, 0, [[0, { lean: .4 * k, aLx: 1.2 * k, aRx: 1.4, aLz: .5 * k }]], { T: L.T }); cara(kr, L.T, { expr: 'shock', mouth: 'o' });
  const l = sleepWalk(lena, L, LENP.x, LENP.z - 1.2, 0, 2.6 * (1 - k), 0); cm([BENP.x + 9, 7, -102, BENP.x, 5, -104.8, 44], [BENP.x + 8.4, 7, -102.4, BENP.x, 5, -104.8, 42], L.k); }, [[.2, 'thud', .8], [.22, 'impact', .6], [.3, 'gasp', .5]]);
// 140 «wie Schlafwandler das»: otro sonámbulo choca de frente con un poste de madera y sigue intentando andar
shot(148.31, 'S', null, L => { tunnel(L, -60); const c = put(SL[17], STX - 11.2 + .1, 0, -62.8, PI); const b = Math.max(0, Math.sin(L.T * 6)) * .15; actuar(c, 0, [[0, { ...sleepP(L.T, 2), lean: -b }]], { T: L.T }); sleepFace(c, L.T); onBody(c, 9, -.6, .1, 42, L.k, 8, -.5); }, [[0, 'swipe', .4], [.15, 'knock', .6], [.5, 'knock', .5]]);
// 141 «manchmal tun,»: una sonámbula se choca con la vagoneta y rebota
shot(149.15, 'W', null, L => { tunnel(L, -60); const c = put(SL[22], STX, 0, -55.6 + Math.max(0, Math.sin(L.T * 5)) * .6, PI); actuar(c, 0, [[0, sleepP(L.T, 3)]], { T: L.T }); sleepFace(c, L.T); onBody(c, 9, 1.4, .1, 42, L.k, 8, 1.3); }, [[0, 'whoosh', .4], [.2, 'boing_metal', .5]]);
// 142 «und reißt ihn um.»: Krause cae de espaldas al suelo; el farol sale volando
shot(149.97, 'C', 'punch', L => { tunnel(L, -104); benDig(L, { dig: false }); const k = clamp(L.lt / .5); krauseDown(L, k); lenaStand(L, { dz: 1.6 }); const f = show(LANTF, BENP.x + 3 + k * 3, 4 + Math.sin(k * PI) * 3 - k * 3.6, -103 - k * 2, 0); f.rotation.z = k * 4;
  cm([BENP.x + 10, 5, -98, BENP.x + 1, 2.6, -105, 44], [BENP.x + 9, 5, -99, BENP.x + 1, 2.6, -105, 42], L.k); }, [[.4, 'thud', .8], [.45, 'impact', .7], [.5, 'metal_rip', .3]]);
// 143 «Die Laterne geht»: el farol rueda por el suelo, la llama vacila
shot(151.03, 'W', null, L => { tunnel(L, -104, { h: .5, fill: 16 }); const f = show(LANTF, BENP.x + 6 + L.lt * 1.4, .5, -105, 0); f.rotation.z = PI / 2; f.rotation.x = L.lt * 4; LANT.position.copy(f.position).add(V(0, 1, 0)); LANT.intensity = 40 * (1 - L.lt / .65) + Math.sin(L.T * 40) * 8;
  cm([BENP.x + 6, 2, -99, BENP.x + 6.6, .6, -105, 40], [BENP.x + 6.4, 1.8, -100, BENP.x + 6.8, .6, -105, 38], L.k); }, [[0, 'clack', .6], [.2, 'wheels', .3]]);
// 144 «aus.»: se apaga: la pantalla se queda casi a oscuras
shot(151.67, 'C', null, L => { tunnel(L, -104, { h: .15, fill: 3 }); for (const l of LP) l.intensity *= .15; DARK = .55; const f = show(LANTF, BENP.x + 7, .5, -105, 0); f.rotation.z = PI / 2; f.userData.bulb.visible = L.lt < .1;
  cm([BENP.x + 6, 2, -100, BENP.x + 7, .6, -105, 40], [BENP.x + 6, 2, -100, BENP.x + 7, .6, -105, 40], L.k); }, [[0, 'switch', .6], [.1, 'drone', .3]]);
// 145 «Im Dunkeln blinzle ich»: en la penumbra azul, Ben parpadea muy rápido, aliviado
shot(152.27, 'W', null, L => { tunnel(L, -102, { h: .25, fill: 5 }); for (const l of LP) l.intensity *= .2; DARK = .35; TINT = 'rgba(10,20,70,.25)'; const b = benDig(L, { dig: false, face: { eyes: (L.lt % .18) < .09 ? 'closed' : 'normal', mouth: 'smile', noBlink: true } }); b.red.visible = true;
  onFace(b, 3.4, 0, 0, 36, L.k, 3); }, [[0, 'breath', .6], [.2, 'blink', .4], [.4, 'blink', .4], [.6, 'blink', .4], [.8, 'blink', .4]]);
// 146 «fünfzig Mal.»: el contador sube hasta 50 con cada parpadeo
shot(153.39, 'C', null, L => { tunnel(L, -102, { h: .25, fill: 5 }); for (const l of LP) l.intensity *= .2; DARK = .3; TINT = 'rgba(10,20,70,.25)'; const b = benDig(L, { dig: false, face: { eyes: (L.lt % .12) < .06 ? 'closed' : 'normal', mouth: 'smile', noBlink: true } });
  onFace(b, 4.4, 0, .6, 38, L.k, 4); bigNum(Math.min(50, Math.round(L.lt / 1.0 * 50)) + '×', 1, 'cyan', .2, 1.2); }, [[0, 'blink', .4], [.25, 'blink', .4], [.5, 'blink', .4], [.75, 'blink', .4]]);
// 147 «Dann leuchtet er»: Krause, sentado en el suelo, vuelve a encender el farol: chispa y luz
shot(154.49, 'S', null, L => { tunnel(L, -104, { h: .3, fill: 6 }); for (const l of LP) l.intensity *= .3; const c = put(krause, BENP.x + 2.4, sitY(krause, .2), -106, 0); actuar(c, 0, [[0, { ...sitPose(), lLx: 1.3, lRx: 1.3, lLk: .3, lRk: .3, aRx: 1.2, aRe: .6, aLx: 1.0, aLe: 1.2 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'angry' });
  c.lantern.visible = true; c.root.updateMatrixWorld(true); const w = c.lantern.userData.bulb.getWorldPosition(V(0, 0, 0)); LANT.position.copy(w); LANT.intensity = L.lt > .3 ? 46 : 0; c.lantern.userData.bulb.visible = L.lt > .3; if (L.lt > .25 && L.lt < .5) sparks(w, L.t0 + .25, L.T, 10);
  onBody(c, 10, -.7, .14, 42, L.k, 9, -.6, 2); }, [[.25, 'ignite', .7], [.3, 'fire_crackle', .5]]);
// 148 «auf den,»: se levanta enfadado y gira el farol buscando quién ha sido
shot(155.37, 'W', null, L => { tunnel(L, -104); const c = put(krause, BENP.x + 2.4, 0, -104.6, -PI / 2 - .4 + L.lt); lanternUp(c, L, .9); cara(c, L.T, { expr: 'angry' }); onBody(c, 11, .4, .1, 42, L.k, 10); }, [[0, 'whoosh', .4], [.2, 'growl', .3]]);
// 149 «der ihn umgerannt hat.»: el haz de luz barre el túnel y se detiene en una silueta de pie
shot(155.87, 'S', null, L => { tunnel(L, -104, { h: .4, fill: 10 }); lenaStand(L, { dz: 1.6 }); const c = put(krause, BENP.x + 2.4, 0, -103.6, PI - .2); lanternUp(c, L, .95, { k: 30 }); cm([BENP.x + 4, 6.4, -98, BENP.x - .3, 5, -104.6, 42], [BENP.x + 3.6, 6.4, -98.6, BENP.x - .3, 5, -104.6, 40], L.k); }, [[0, 'swipe', .4], [.4, 'creepy_ting', .5]]);
// 150 «Lena.»: ¡golpe de zoom! Es Lena, iluminada por el farol
shot(156.86, 'C', 'punch', L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); lampL(L); onFace(l, 4.6, 0, 0, 38, L.k, 4); badge('tag', 'LENA', W / 2, H * .2, clamp((L.lt - .1) / .2)); }, [[0, 'impact', .7], [.05, 'braam_short', .6]]);
// 151 «Ihr Blick ins Leere.»: mira al vacío, sin expresión
shot(157.59, 'W', null, L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); lampL(L); onFace(l, 5.4, 0, .8, 40, L.k, 4.8); }, [[0, 'whoosh', .4], [.2, 'hum_low', .4]]);
// 152 «Zwei Minuten»: Krause le planta el farol delante de los ojos (los dos de perfil)
shot(158.53, 'S', null, L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); const c = krauseL(L, 1, { k: 55 }); cara(c, L.T, { expr: 'sus', eyes: 'squint' }); cm([LENP.x - 1.2, 7.4, LENP.z + .8, KLP.x, 7.4, KLP.z, 42], [LENP.x - 1, 7.4, LENP.z + 1.1, KLP.x, 7.4, KLP.z, 40], L.k); }, [[0, 'swipe', .4], [.1, 'clock_tick', .5]]);
// 153 «Licht in ihre Augen.»: cronómetro: 0:00 → 2:00; los ojos de Lena muy abiertos bajo la luz
shot(159.29, 'C', 'punch', L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); lampL(L); l.red.visible = L.lt > .6; onFace(l, 3.4, 0, 0, 36, L.k, 3);
  const s = Math.min(120, Math.round(L.lt / 1.1 * 120)); bigNum(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, 1, 'red', .2, 1.2); }, [[0, 'tick_down', .6], [.5, 'clock_tick', .5]]);
// 154 «Sie blinzelt nicht.»: primerísimo plano de sus ojos: ni un parpadeo
shot(160.49, 'W', null, L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); l.red.visible = true; lampL(L); onFace(l, 2.6, 0, 0, 32, L.k, 2.3); }, [[0, 'whoosh', .4], [.2, 'heartbeat', .5]]);
// 155 «Er geht weiter.»: Krause baja el farol y se aleja por el túnel
shot(161.51, 'S', null, L => { tunnel(L, -110); lenaStand(L, { dz: 1.6 }); const c = guardWalk(krause, L, BENP.x + 1.6, -104, PI, 3, 0, .4); cm([BENP.x - 3, 6.6, -96, BENP.x, 5, -110, 44], [BENP.x - 3, 6.6, -97, BENP.x, 5, -110, 42], L.k); }, [[0, 'swipe', .4], [.1, 'steps', .6]]);
// 156 «Kaum dreht er sich um,»: la espalda de Krause alejándose; Lena sigue quieta en primer término
shot(162.09, 'W', null, L => { tunnel(L, -110); const l = lenaStand(L, { dz: 1.6 }); const c = guardWalk(krause, L, BENP.x + 1.6, -106, PI, 3, 0, .4); cm([BENP.x + 1.2, 6.2, -99.4, BENP.x + 1, 5, -116, 42], [BENP.x + 1.2, 6.2, -100, BENP.x + 1, 5, -116, 40], L.k); }, [[0, 'whoosh', .4], [.2, 'steps', .4]]);
// 157 «schaut sie mich an.»: los ojos de Lena se deslizan hacia Ben
shot(163.08, 'C', 'punch', L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6, face: { eyes: L.lt > .2 ? 'side_r' : 'wide', mouth: 'flat', noBlink: true } }); onFace(l, 3.6, 0, 0, 36, L.k, 3.2); }, [[0, 'impact', .4], [.25, 'whoosh_up', .3]]);
// 158 «Und»: desde Ben: Lena le mira directamente
shot(164.09, 'S', null, L => { tunnel(L, -104); lenaStand(L, { dz: 1.6, ry: .2, face: { eyes: 'wide', mouth: 'flat', noBlink: true } }); benDig(L, { dig: false }); cm([BENP.x + 1.2, 6.2, BENP.z + 1.4, LENP.x, 5.6, LENP.z + 1.6, 40], [BENP.x + 1.1, 6.2, BENP.z + 1, LENP.x, 5.6, LENP.z + 1.6, 38], L.k); }, [[0, 'swipe', .3]]);
// 159 «blinzelt.» (zoom lento): Lena parpadea, despacio, a propósito
shot(164.37, 'F', 'slow', L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6, face: { eyes: L.lt > .45 && L.lt < .75 ? 'closed' : 'normal', mouth: 'flat', noBlink: true } }); blinkFX(l, (L.lt - .42) / .4); onFace(l, 3.4, 0, 0, 36, L.k, 2.6); }, [[.45, 'blink', .8]]);
// 160 «Nur Wächter blinzeln.»: la fila de guardias con sus faroles
shot(165.59, 'C', 'punch', L => { tunnel(L, -110); guardRow(L, -110, 12, { expr: 'sus' }); cm([STX, 7, -88, STX, 5, -112, 48], [STX, 7, -90, STX, 5, -112, 48], L.k); }, [[0, 'impact', .5], [.1, 'braam_short', .4]]);
// 161 «Meine eigene Schwester»: Lena se aleja cavando como si nada, de espaldas
shot(166.95, 'W', null, L => { tunnel(L, -110); const l = put(lena, LENP.x - 3, 0, -112, PI); dig(l, L, 2); diggers(L, SL, -116, [-7, 3, 7]); cm([LENP.x - 1, 7, -100, LENP.x - 3, 4.6, -112, 44], [LENP.x - 1, 7, -102, LENP.x - 3, 4.6, -112, 42], L.k); }, [[0, 'whoosh', .4], [.2, 'shovel', .5]]);
// 162 «ist eine von ihnen.» (zoom lento): la cara de Ben, en shock
shot(167.89, 'F', 'slow', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { expr: 'shock', eyes: 'wide', mouth: 'grimace' } }); onFace(b, 4, 0, 0, 38, L.k, 3); }, [[0, 'flash', .3], [.1, 'heartbeat', .6]]);
// 163 «Um fünf»: cuarto de Lena al alba: el despertador marca 5:00 y la puerta se abre de golpe
shot(168.92, 'C', 'punch', L => { lenaRoom(L, { dawn: true }); LZ.CLOCK.userData.set('5:00', '#ffd23f'); LZ.DOOR.rotation.y = -1.4 * easeOut(clamp(L.lt / .25)); const b = put(ben, LZX + 14, 0, 2, -PI / 2); actuar(b, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(b, L.T, { expr: 'angry' });
  cm([LZX - 6, 7, -6, LZX + 15, 5, 2, 44], [LZX - 5, 7, -5.4, LZX + 15, 5, 2, 42], L.k); bigNum('5:00', clamp(L.lt / .2), 'gold', .2, 1.1); }, [[0, 'alarm', .5], [.1, 'door_crash', .7]]);
// 164 «stehe ich in ihrem Zimmer:»: Ben entra enfadado; Lena, sentada en la cama, levanta la vista
shot(169.8, 'W', null, L => { const [l, b] = lenaRoomPair(L); cara(l, L.T, { expr: 'worried' }); cara(b, L.T, { expr: 'angry' }); cm([LZX - 2.4, 8, 11.6, LZX - 2.4, 5, 1, 56], [LZX - 2.4, 8, 11, LZX - 2.4, 5, 1, 54], L.k); }, [[0, 'whoosh', .4], [.1, 'steps', .5]]);
// 165 «Zeig mir deine Hände.»: Ben señala sus manos y grita
shot(170.65, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L, { bp: { aRx: 1.5, aRz: .05, aRe: .1, lean: .1 } }); talk(b, L.T, 170.6, 171.7, 'shout'); cara(l, L.T, { expr: 'worried' }); benFaceL(L); }, [[0, 'impact', .5], [.1, 'shout_m', .2]]);
// 166 «Sie zieht die Handschuhe»: Lena se mira las manos enguantadas, triste
shot(171.75, 'S', null, L => { const [l, b] = lenaRoomPair(L, { lp: { aLx: 1.2, aRx: 1.2, aLe: 1.0, aRe: 1.0, headX: .4 } }); cara(l, L.T, { expr: 'sad' }); onFace(l, 5, 1, 0.8, 40, L.k, 4.4); }, [[0, 'swipe', .4], [.3, 'sigh', .5]]);
// 167 «aus.»: primer plano de las manos: se quita los guantes
shot(172.41, 'C', null, L => { const [l, b] = lenaRoomPair(L, { lp: { aLx: .2, aRx: .2, aLe: 1.5, aRe: 1.5, aLz: -.12, aRz: -.12, headX: .3 } }); cara(l, L.T, { expr: 'sad' }); l.gloves.visible = L.lt < .4; l.blis.visible = L.lt >= .4;
  l.root.updateMatrixWorld(true); const h = l.aR.hand.getWorldPosition(V(0, 0, 0)); cm([h.x + 2.6, h.y + 2.6, h.z - 1.6, h.x, h.y, h.z + .5, 38], [h.x + 2.2, h.y + 2.2, h.z - 1.3, h.x, h.y, h.z + .5, 36], L.k); }, [[0, 'cloth', .6], [.4, 'cloth', .5]]);
// 168 «Ihre Hände sind die schlimmsten»: las palmas destrozadas, llenas de ampollas (zoom lento)
shot(173.18, 'F', 'slow', L => { const [l, b] = lenaRoomPair(L, { lp: { aLx: .2, aRx: .2, aLe: 1.5, aRe: 1.5, aLz: -.12, aRz: -.12, headX: .3 } }); l.gloves.visible = false; l.blis.visible = true; cara(l, L.T, { expr: 'sad' });
  l.root.updateMatrixWorld(true); const h = l.aR.hand.getWorldPosition(V(0, 0, 0)); cm([h.x + 2.4, h.y + 2.6, h.z - 1.4, h.x, h.y, h.z + .5, 36], [h.x + 1.9, h.y + 2.1, h.z - 1.1, h.x, h.y, h.z + .5, 34], L.k); }, [[0, 'flash', .3], [.2, 'sad_tone', .4]]);
// 169 «von allen.»: Ben, con la boca abierta
shot(174.4, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L); cara(b, L.T, { expr: 'gasp' }); benFaceL(L); }, [[0, 'impact', .4], [.1, 'gasp', .6]]);
// 170 «Aber Wächter graben nicht.»: túnel: un guardia de brazos cruzados, sin pala, mirando
shot(175.18, 'W', null, L => { tunnel(L, -90); const g = put(WA[8], STX, 0, -90, 0); actuar(g, 0, [[0, CROSS]], { T: L.T }); cara(g, L.T, { expr: 'smug' }); diggers(L, SL, -94, [-7, -3, 3, 7]); onBody(g, 11, 0, .1, 42, L.k, 9.6); }, [[0, 'whoosh', .4], [.1, 'shovel', .4]]);
// 171 «graben nicht.»: sus manos limpias, cruzadas
shot(175.8, 'C', 'punch', L => { tunnel(L, -90); const g = put(WA[8], STX, 0, -90, 0); actuar(g, 0, [[0, { ...PALMS, headX: .1 }]], { T: L.T }); onBody(g, 7, 0, .45, 38, L.k, 6, 0, 3.2); }, [[0, 'impact', .4], [.2, 'sparkle', .4]]);
// 172 «Und Lena gräbt mehr»: Lena cava rapidísimo, la tierra vuela
shot(176.71, 'W', null, L => { tunnel(L, -112); const l = put(lena, STX - 4, 0, -112, PI + .3); dig(l, L, 0, { sp: 2.4, awake: false }); dust(V(STX - 4, 0, -114), L.t0, L.T, 14, .6); onBody(l, 10, .5, .1, 42, L.k, 9); }, [[0, 'shovel', .6], [.25, 'shovel', .6], [.5, 'shovel', .6], [.75, 'shovel', .6]]);
// 173 «als jeder andere.»: grúa: su montón de tierra, el más alto del túnel
shot(177.71, 'S', null, L => { tunnel(L, -112); const l = put(lena, STX - 4, 0, -112, PI + .3); dig(l, L, 0, { sp: 2 }); const p = show(KPILE[0], STX - 7.4, 0, -116, 0, 1.6); diggers(L, SL, -120, [3, 7]);
  cm([STX + 4, 8, -102, STX - 5, 4, -114, 46], [STX + 4, 16, -100, STX - 5, 4, -114, 46], L.k); }, [[0, 'swipe', .4], [.2, 'rubble', .5]]);
// 174 «Ich bin das kleinste Kind»: plano bajo: Ben, diminuto, entre adultos enormes que cavan
shot(178.98, 'W', null, L => { tunnel(L, -100); benDig(L, { face: { eyes: 'wide', mouth: 'flat' } }); [[-1.4, -98], [6.4, -101], [-2.4, -104]].forEach(([x, z], i) => { const c = put(SL[i * 5 + 1], STX + x, 0, z, PI); dig(c, L, i); }); cm([BENP.x + 3, 2.4, -91, BENP.x, 6, -102, 50], [BENP.x + 2.6, 2.4, -92, BENP.x, 6, -102, 48], L.k); }, [[0, 'whoosh', .4], [.2, 'shovel', .5]]);
// 175 «im Tunnel.»: Ben, pequeño, cavando con esfuerzo
shot(179.84, 'C', 'punch', L => { tunnel(L, -100); benDig(L, { sp: 1.6 }); onBody(ben, 9, .4, .12, 42, L.k, 8, .4, 2.6); }, [[0, 'impact', .4], [.2, 'shovel', .5]]);
// 176 «Trotzdem ist mein Erdhaufen»: Ben se gira y mira su montón: es enorme
shot(180.72, 'W', null, L => { tunnel(L, -100); const b = put(ben, BENP.x, 0, BENP.z, PI / 2 + .4); b.shovel.visible = true; cara(b, L.T, { expr: 'confused', eyes: 'up' }); show(KPILE[1], BENP.x + 4, 0, BENP.z - 3, 0, 1.3); cm([BENP.x - 6, 4.4, BENP.z + 4, BENP.x + 2.5, 4.4, BENP.z - 2, 46], [BENP.x - 5.4, 4.2, BENP.z + 3.6, BENP.x + 2.5, 4.4, BENP.z - 2, 44], L.k); }, [[0, 'whoosh', .4], [.3, 'pop', .3]]);
// 177 «jede Nacht»: grúa sobre la fila de montones: el suyo igual de alto que los de los mayores
shot(181.84, 'S', null, L => { tunnel(L, -100); for (let i = 0; i < 4; i++) show(KPILE[i], STX - 7 + i * 4.6, 0, -104, 0, 1.3); put(ben, STX - .1, 0, -100, PI); cara(ben, L.T, { expr: 'confused' }); [[-7, 0], [-2.4, 3], [6.8, 6]].forEach(([x, k]) => { const c = put(SL[k + 2], STX + x, 0, -100, PI); dig(c, L, k); });
  cm([STX, 12, -88, STX, 3, -104, 46], [STX, 15, -90, STX, 3, -104, 46], L.k); }, [[0, 'swipe', .4], [.2, 'rubble', .4]]);
// 178 «so groß wie die der anderen.»: los montones, uno al lado del otro, iguales; flechas «=»
shot(182.46, 'W', null, L => { tunnel(L, -100); for (let i = 0; i < 4; i++) show(KPILE[i], STX - 7 + i * 4.6, 0, -104, 0, 1.3); cm([STX, 5, -92, STX, 3.4, -104, 46], [STX, 5, -93, STX, 3.4, -104, 44], L.k); badge('big', '=', W / 2, H * .3, clamp((L.lt - .2) / .2), 1, 1.4); }, [[0, 'whoosh', .4], [.2, 'pling', .4]]);
// 179 «der anderen.»: Ben se rasca la cabeza, sin entender
shot(183.24, 'C', 'punch', L => { tunnel(L, -100); const b = put(ben, BENP.x, 0, BENP.z, PI + .3); actuar(b, 0, [[0, { aRx: 2.6, aRe: 2.0, aRz: -.4, headZ: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'confused' }); onFace(b, 4.6, 0, 0, 40, L.k, 4); badge('q', '?', W / 2 + 150, H * .28, clamp((L.lt - .2) / .2)); }, [[0, 'impact', .4], [.3, 'pop', .3]]);
// 180 «Weil sie die Hälfte»: Lena mira a los lados (¿nadie la ve?)
shot(184.12, 'W', null, L => { tunnel(L, -100); const l = put(lena, BENP.x + 4.4, 0, BENP.z - 1, PI - .6); l.shovel.visible = true; cara(l, L.T, { eyes: Math.sin(L.T * 5) > 0 ? 'side_l' : 'side_r', mouth: 'flat' }); actuar(l, 0, [[0, { aRx: .7, aRe: .4, headY: Math.sin(L.T * 5) * .5 }]], { T: L.T }); onFace(l, 4.6, 0, 0, 40, L.k, 4.2); }, [[0, 'whoosh', .4], [.2, 'sniff', .4]]);
// 181 «von meinem gräbt.»: y echa una palada de tierra en el montón de Ben a escondidas; Ben no la ve
shot(184.84, 'S', null, L => { tunnel(L, -100); show(KPILE[1], BENP.x + 4, 0, BENP.z - 3, 0, 1.3); const l = put(lena, BENP.x + 6.6, 0, BENP.z - 1, -PI / 2 - .4); dig(l, L, 0, { sp: 1.4, face: false }); cara(l, L.T, { expr: 'determined' }); put(ben, BENP.x - 1, 0, BENP.z + 1, PI); dig(ben, L, 1, { face: false }); cara(ben, L.T, { eyes: 'wide', mouth: 'flat' });
  dust(V(BENP.x + 4, 3, BENP.z - 3), L.t0 + .4, L.T, 8, .4); cm([BENP.x + 3, 7, BENP.z + 9, BENP.x + 3, 4, BENP.z - 1.6, 44], [BENP.x + 3, 7, BENP.z + 8, BENP.x + 3, 4, BENP.z - 1.6, 42], L.k); }, [[0, 'swipe', .4], [.4, 'shovel', .6], [.6, 'rubble', .5]]);
// 182 «Sie ist keine Wächterin.»: cuarto de Lena: ella sentada, las manos heridas en el regazo, mirando al suelo
shot(185.89, 'W', null, L => { const [l, b] = lenaRoomPair(L, { lp: { aLx: .6, aRx: .6, aLe: 1.0, aRe: 1.0, headX: .3 } }); l.gloves.visible = false; l.blis.visible = true; cara(l, L.T, { expr: 'sad' }); onFace(l, 6, .6, 1.0, 42, L.k, 5.2); }, [[0, 'whoosh', .4], [.3, 'sad_tone', .3]]);
// 183 «Sie ist wach.»: Lena levanta la mirada hacia Ben, ojos normales, parpadea
shot(187.15, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L); l.gloves.visible = false; cara(l, L.T, { expr: 'sad', eyes: L.lt > .3 && L.lt < .42 ? 'closed' : 'worried' }); onFace(l, 4.6, 0, 0.8, 38, L.k, 4); }, [[0, 'impact', .4], [.3, 'blink', .4]]);
// 184 «Genau wie ich.»: Ben se ablanda; asiente
shot(187.99, 'S', null, L => { const [l, b] = lenaRoomPair(L, { bp: { headX: Math.sin(L.T * 8) * .15 } }); cara(b, L.T, { expr: 'sad' }); benFaceL(L); }, [[0, 'swipe', .3], [.2, 'breath', .4]]);
// 185 «Mit neun»: recuerdo en sepia: Lena niña (9) se despierta en su cama a las 3; «9»
shot(188.77, 'B', null, L => { lenaRoom(L, { night: true }); sepia(); withScale(lena, .66, () => { sitBed(lena, LZX, L, { aLx: .4, aRx: .4 }); cara(lena, L.T, { eyes: 'wide', mouth: 'o' }); }); lena.gloves.visible = false; LZ.quilt.position.y = 4.2;
  cm([LZX - 5, 6.6, 4, LZX - 9, 4.6, -5, 44], [LZX - 5.4, 6.4, 3, LZX - 9, 4.6, -5, 42], L.k); bigNum('9', clamp((L.lt - .3) / .2), 'gold', .22, 1.2); }, [[0, 'soft_air', .3], [.1, 'film_roll', .4], [.4, 'pling', .4]]);
// 186 «ist sie zum ersten Mal»: la niña ve por la puerta pasar a sus padres, sonámbulos
shot(189.58, 'S', null, L => { lenaRoom(L, { night: true }); sepia(); LZ.DOOR.rotation.y = -2.9; sleepWalk(mama, L, LZX + 20, 7.4, PI, 3, 0); sleepWalk(papa, L, LZX + 21.4, 11.4, PI, 3, 1); cm([LZX + 12, 7, -2.4, LZX + 20.5, 5, 5, 44], [LZX + 12.4, 7, -2, LZX + 20.5, 5, 5, 42], L.k); }, [[0, 'swipe', .4], [.1, 'steps', .5]]);
// 187 «aufgewacht.»: Lena niña se tapa la boca, aterrada (igual que Ben)
shot(190.3, 'C', 'punch', L => { lenaRoom(L, { night: true }); sepia(); withScale(lena, .66, () => { sitBed(lena, LZX, L, { aLx: 2.1, aRx: 2.1, aLe: 1.9, aRe: 1.9, aLz: -.25, aRz: -.25, ...shiver(L.T, 1.4) }); cara(lena, L.T, { expr: 'terror', eyes: 'terror' }); }); lena.gloves.visible = false; LZ.quilt.position.y = 4.2;
  onFace(lena, 3.4, 0, 0, 38, L.k, 3); }, [[0, 'impact', .4], [.1, 'heartbeat', .5]]);
// 188 «Da war ich vier.»: Ben pequeñito (4) dormido en su cama, con un peluche; «4»
shot(191.4, 'W', null, L => { benRoom(L); sepia(); withScale(ben, .5, () => { lie(ben, KZX - 9, -7.4, 4.15, L); }); ben.setFace({ eyes: 'closed', mouth: 'smile' }); KZ.quilt.position.y = 4.4; zzz(ben, L.T, .8);
  const h = hp(ben); cm([h.x + 2, h.y + 5, h.z + 4, h.x, h.y, h.z - .5, 42], [h.x + 1.6, h.y + 4.4, h.z + 3.4, h.x, h.y, h.z - .5, 40], L.k); bigNum('4', clamp((L.lt - .2) / .2), 'gold', .22, 1.2); }, [[0, 'whoosh', .4], [.1, 'lullaby', .4], [.2, 'pling', .4]]);
// 189 «Das Jahr mit dem Reim.»: Lena niña junto a la cama le enseña la rima, dedo en alto; la rima en un bocadillo
shot(192.39, 'S', null, L => { benRoom(L); sepia(); withScale(ben, .5, () => { sitBed(ben, KZX, L, { aLx: .3, aRx: .3 }); talk(ben, L.T, 192.3, 193.5, 'happy'); }); KZ.quilt.position.y = 3.9;
  withScale(lena, .66, () => { const l = put(lena, KZX - 5.4, 0, -2, -PI / 2 - .2); actuar(l, 0, [[0, { aRx: 2.3, aRe: .5, aRz: -.1 }]], { T: L.T }); talk(l, L.T, 192.3, 193.5, 'happy'); }); lena.gloves.visible = false; bubble(lena, 'TU ALS OB!', clamp((L.lt - .2) / .2));
  cm([KZX - 2.6, 5.6, 4, KZX - 7.4, 3.6, -3, 44], [KZX - 3, 5.4, 3, KZX - 7.4, 3.6, -3, 42], L.k); }, [[0, 'swipe', .4], [.2, 'pop', .4]]);
// 190 «Das Jahr, in dem»: en sepia, la mesa de la cocina: Lena niña y Ben pequeño, frente a frente, empiezan a mirarse
shot(193.54, 'W', null, L => { kitchen(L, { night: true }); sepia(); withScale(ben, .5, () => { sit(ben, KUX + 3.4, 2.8 + 1.2, -5.6, 0, L, {}); cara(ben, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); });
  withScale(lena, .66, () => { sit(lena, KUX + 3.4, 2.8 + .6, 5.6, PI, L, {}); cara(lena, L.T, { eyes: 'wide', mouth: 'smirk', noBlink: true }); }); lena.gloves.visible = false; KU.LMP.visible = false; cm([KUX + 3.4, 15.4, 6, KUX + 3.4, 3, 0, 60], [KUX + 3.4, 15.2, 5.4, KUX + 3.4, 3, 0, 58], L.k); }, [[0, 'whoosh', .4], [.2, 'clock_tick', .5]]);
// 191 «das Anstarren anfing.»: los ojos del pequeño Ben, abiertos con todas sus fuerzas
shot(194.38, 'C', 'punch', L => { kitchen(L, { night: true }); sepia(); withScale(ben, .5, () => { sit(ben, KUX + 3.4, 2.8 + 1.2, -5.6, 0, L, {}); cara(ben, L.T, { eyes: 'wide', mouth: 'grimace', noBlink: true }); }); onFace(ben, 2.4, 0, 0, 36, L.k, 2); }, [[0, 'impact', .4], [.3, 'tick', .4]]);
// 192 «Sie wollte mich nie besiegen.»: hoy: Lena sonríe con tristeza
shot(195.53, 'W', null, L => { const [l, b] = lenaRoomPair(L); l.gloves.visible = false; cara(l, L.T, { expr: 'warm', mouth: 'smile' }); onFace(l, 5, 0, 0.8, 40, L.k, 4.4); }, [[0, 'soft_air', .3], [.2, 'piano_note', .4]]);
// 193 «besiegen.»: se seca una lágrima con el dorso de la mano
shot(196.07, 'S', null, L => { const [l, b] = lenaRoomPair(L, { lp: { aRx: 2.3, aRe: 2.0, aRz: -.4 } }); l.gloves.visible = false; cara(l, L.T, { expr: 'cry', mouth: 'smile' }); tears(l, L.T); onFace(l, 4.4, 0, 0.8, 38, L.k, 4); }, [[0, 'swipe', .3], [.3, 'sniff', .5]]);
// 194 «Sie hat mich trainiert.»: recuerdo: Lena con un cronómetro, Ben mirándola fijo en la mesa; ella asiente
shot(197.01, 'C', 'punch', L => { kitchen(L); noChairs(); const b = put(benT, KUX + 2, 0, -10, PI / 2); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); const l = put(lenaT, KUX + 6.4, 0, -10, -PI / 2); actuar(l, 0, [[0, { aRx: 1.6, aRe: 1.2, headX: Math.sin(L.T * 6) * .1 }]], { T: L.T }); cara(l, L.T, { expr: 'happy' });
  cm([KUX + 4.2, 7.4, 1, KUX + 4.2, 5.4, -10, 42], [KUX + 4.2, 7.2, .2, KUX + 4.2, 5.4, -10, 40], L.k); bigNum(`0:${String(Math.floor(30 + L.lt * 20)).padStart(2, '0')}`, 1, 'green', .2, 1.0); }, [[0, 'impact', .4], [.1, 'tick', .5], [.5, 'tick', .5]]);
// 195 «Falls ich auch mal»: Lena mira a Ben, seria y protectora
shot(198.06, 'W', null, L => { const [l, b] = lenaRoomPair(L); l.gloves.visible = false; cara(l, L.T, { expr: 'determined' }); onFace(l, 4.6, 0, 0.8, 38, L.k, 4.2); }, [[0, 'whoosh', .3], [.2, 'breath', .4]]);
// 196 «aufwache.»: a Ben se le llenan los ojos de lágrimas: lo entiende
shot(198.78, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L); cara(b, L.T, { expr: 'cry' }); tears(b, L.T); benFaceL(L); }, [[0, 'impact', .3], [.2, 'sniff', .5]]);
// 197 «Warum hast du»: Ben le pregunta, con la voz rota
shot(199.47, 'S', null, L => { const [l, b] = lenaRoomPair(L, { bp: { aLx: .5, aRx: .5, aLz: .4, aRz: .4, aLe: 1.2, aRe: 1.2 } }); talk(b, L.T, 199.4, 200.9, 'cry'); tears(b, L.T); benFaceL(L); }, [[0, 'swipe', .3], [.3, 'cry_girl', .1]]);
// 198 «nichts gesagt?»: plano de los dos: Ben de pie, Lena sentada
shot(200.05, 'W', null, L => { const [l, b] = lenaRoomPair(L); l.gloves.visible = false; talk(b, L.T, 199.4, 200.9, 'sad'); cara(l, L.T, { expr: 'sad' }); cm([LZX - 2.4, 7.4, 11, LZX - 2.4, 4, 1.2, 52], [LZX - 2.4, 7.2, 10.4, LZX - 2.4, 4, 1.2, 50], L.k); }, [[0, 'whoosh', .3]]);
// 199 «Weil du mich da draußen»: Lena le explica, señalando la ventana (la noche)
shot(200.91, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L, { lp: { aRx: 1.6, aRz: -.6, aRe: .2, headY: -.4 } }); l.gloves.visible = false; talk(l, L.T, 200.9, 202.8, 'sad'); onFace(l, 5, 0, 0.8, 40, L.k, 4.6); }, [[0, 'impact', .3], [.2, 'wind', .3]]);
// 200 «angeschaut hättest.»: recuerdo inventado: en el túnel, Ben girando la cabeza para mirar a Lena (lo que NO debe hacer); X roja
shot(201.67, 'S', null, L => { tunnel(L, -100); const b = put(ben, BENP.x, 0, BENP.z, PI); b.shovel.visible = true; actuar(b, 0, [[0, { headY: .9 * clamp(L.lt / .4) }]], { T: L.T }); cara(b, L.T, { eyes: 'side_r', mouth: 'flat' }); put(lena, BENP.x - 3, 0, BENP.z - 1, PI); dig(lena, L, 1);
  onFace(b, 5, 0, -1.2, 40, L.k, 4.4); badge('red', '✕', W / 2, H * .28, clamp((L.lt - .5) / .2), 1, 1.4); }, [[0, 'swipe', .4], [.5, 'glitch', .4]]);
// 201 «Und sie hätten es gesehen.»: un farol gira hacia ellos; los ojos de Krause se entrecierran
shot(202.8, 'F', 'slow', L => { tunnel(L, -110); const k = put(krause, STX, 0, -110, lerp(-.8, 0, clamp(L.lt / .6))); lanternUp(k, L, .8, { k: 50 }); cara(k, L.T, { expr: 'sus', eyes: 'squint' }); onFace(k, 5, 0, 0, 38, L.k, 3.6); }, [[0, 'flash', .3], [.2, 'creepy_ting', .5]]);
// 202 «Heute Nacht um drei»: el despertador de Ben marca 3:00 (golpe)
shot(204.08, 'C', 'punch', L => { benRoom(L); KZ.CLOCK.userData.set('3:00', '#ffd23f'); KZ.g.updateMatrixWorld(true); const w = KZ.CLOCK.getWorldPosition(V(0, 0, 0)); cm([w.x + .6, w.y + 1.4, w.z + 4, w.x, w.y + .6, w.z, 34], [w.x + .5, w.y + 1.2, w.z + 3.4, w.x, w.y + .6, w.z, 32], L.k); }, [[0, 'alarm', .6], [.1, 'impact', .4]]);
// 203 «gehen wieder alle Türen auf.»: otra vez, la calle: todas las puertas se abren de golpe en ola
shot(204.96, 'W', null, L => { gasse(L, { z: HD.z }); doorWave(L, L.t0 + .05, HD.z, .02, .2); outOfDoors(L, L.t0 + .1, HD.z + 50, HD.z - 50, 0, { z0: HD.z, sp: .02, max: 4.5 });
  cm([HD.x + 26, 8, HD.z + 10, HD.x, 5, HD.z - 4, 48], [HD.x + 22, 7.6, HD.z + 8, HD.x, 5, HD.z - 4, 46], L.k); sh(V(HD.x + 6, 0, HD.z), 30); }, [[0, 'whoosh', .4], [.05, 'door_crash', .7], [.15, 'door_open', .5], [.3, 'door_open', .4]]);
// 204 «auf.»: los vecinos salen en pijama; la marcha empieza
shot(205.5, 'S', null, L => { gasse(L, { z: -10 }); doorsOpen(); march(L, SL, 0, -10, PI, { cols: 4, speed: 1.8 }); cm([0, 8, -26, 0, 5, -10, 46], [0, 8, -24, 0, 5, -10, 44], L.k); sh(V(0, 0, -6), 30); }, [[0, 'swipe', .4], [.1, 'steps', .6]]);
// 205 «Lena läuft direkt neben mir.»: Ben y Lena, uno al lado del otro en la marcha, los dos con los ojos abiertos
shot(206.59, 'W', null, L => { gasse(L, { z: -20 }); doorsOpen(); sleepWalk(ben, L, 1.6, -18, PI, 1.8, 0); sleepWalk(lena, L, -1.6, -18.4, PI, 1.8, 1); march(L, SL, 0, -10, PI, { cols: 4, speed: 1.8 }); march(L, SL.slice(20), 0, -26, PI, { cols: 4, speed: 1.8 });
  const p = ben.root.position; orbit(V(-.2, 3.8, p.z), lerp(14, 12, L.k), PI, .1, 44); sh(V(0, 0, p.z), 24); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 206 «neben mir.»: más cerca: los dos hombro con hombro
shot(207.49, 'C', null, L => { gasse(L, { z: -20 }); doorsOpen(); sleepWalk(ben, L, 1.4, -18, PI, 1.8, 0, { t0: .9 }); sleepWalk(lena, L, -1.4, -18.4, PI, 1.8, 1, { t0: .9 }); march(L, SL, 0, -8, PI, { cols: 4, speed: 1.8 });
  const p = ben.root.position; orbit(V(0, 4.4, p.z), lerp(10, 9, L.k), PI, .06, 42); sh(V(0, 0, p.z), 20); }, [[0, 'steps', .5]]);
// 207 «Ich schaue sie kein»: primer plano de Ben: mira al frente, temblando, sin girar la cabeza
shot(208.23, 'S', null, L => { gasse(L, { z: -20 }); doorsOpen(); const b = sleepWalk(ben, L, 1.4, -18, PI, 1.8, 0, { t0: 1.6, ex: { eyes: 'wide', mouth: 'grimace' } }); sleepWalk(lena, L, -1.4, -18.4, PI, 1.8, 1, { t0: 1.6 }); onFace(b, 3.8, 0, .6, 38, L.k, 3.4); sh(V(0, 0, b.root.position.z), 20); }, [[0, 'swipe', .3], [.2, 'heartbeat', .5]]);
// 208 «einziges Mal an.»: travelling de perfil: Ben con la vista clavada al frente; Lena a su lado
shot(209.09, 'W', null, L => { gasse(L, { z: -24 }); doorsOpen(); const b = sleepWalk(ben, L, 1.4, -18, PI, 1.8, 0, { t0: 2.5 }); const l = sleepWalk(lena, L, -1.4, -18.4, PI, 1.8, 1, { t0: 2.5 }); march(L, SL, 0, -14, PI, { cols: 4, speed: 1.8, t0: 2.5, avoid: [[1.4, -22.5], [-1.4, -22.9]] });
  const p = b.root.position; cm([p.x + 7, 5.4, p.z - 2, p.x - .4, 5, p.z, 44], [p.x + 7, 5.4, p.z - 3, p.x - .4, 5, p.z - 1, 44], L.k); }, [[0, 'whoosh', .4], [.2, 'steps', .5]]);
// 209 «Das Schönste,»: de espaldas, los dos andando hacia el Berg, la mina iluminada al fondo
shot(210.36, 'B', null, L => { gasse(L, { z: -60 }); doorsOpen(); sleepWalk(ben, L, 1.4, -54, PI, 1.8, 0); sleepWalk(lena, L, -1.4, -54.4, PI, 1.8, 1); march(L, SL.slice(0, 16), 0, -78, PI, { cols: 4, speed: 1.8 });
  cm([0, 6.4, -42, 0, 7, -200, 46], [0, 6.4, -46, 0, 7, -200, 46], L.k); }, [[0, 'soft_air', .3], [.2, 'piano_note', .4]]);
// 210 «was ich je für sie getan habe.»: las manos: la de Lena, con el guante, roza un segundo la de Ben al andar
shot(211.28, 'S', null, L => { gasse(L, { z: -40 }); doorsOpen(); const b = sleepWalk(ben, L, .9, -40, PI, 1.4, 0, { pose: { aLx: .1, aLz: .2 } }); const l = sleepWalk(lena, L, -.9, -40, PI, 1.4, 0, { pose: { aRx: .1, aRz: .25 } });
  b.root.updateMatrixWorld(true); const h = b.aL.hand.getWorldPosition(V(0, 0, 0)); cm([h.x - .6, h.y + 2.4, h.z - 6.4, h.x - .9, h.y + .6, h.z, 40], [h.x - .6, h.y + 2.2, h.z - 5.6, h.x - .9, h.y + .6, h.z, 38], L.k); }, [[0, 'swipe', .3], [.3, 'sparkle', .3]]);
// 211 «Kurz vor fünf»: al fondo del túnel, Ben cava junto al último montón; «4:59»
shot(212.38, 'C', 'punch', L => { tunnel(L, -236); const b = put(ben, STX + 1, 0, -241, PI); dig(b, L, 0, { face: false }); cara(b, L.T, { eyes: 'wide', mouth: 'flat' }); diggers(L, SL.slice(0, 8), -232, [-7, 7]); onBody(b, 10, 2.5, .1, 44, L.k, 9, 2.4, 2.6); bigNum('4:59', clamp(L.lt / .2), 'red', .2, 1.1); }, [[0, 'impact', .4], [.1, 'clock_tick', .6], [.3, 'shovel', .5]]);
// 212 «trifft meine Schaufel»: la pala baja y choca: ¡CLANG!
shot(213.05, 'W', null, L => { tunnel(L, -240); const b = put(ben, STX + 1, 0, -241, PI); dig(b, L, 0, { face: false }); cara(b, L.T, { eyes: 'wide', mouth: 'o' }); const w = V(STX + .6, 2.6, -244.2); ST.BELL.position.y = .6; if (L.lt > .45) sparks(w, L.t0 + .45, L.T, 18);
  cm([STX + 7, 5, -240, STX + .4, 3, -244.6, 44], [STX + 6.4, 4.8, -240.6, STX + .4, 3, -244.6, 42], L.k); }, [[.45, 'boing_metal', .8], [.47, 'sparks', .6]]);
// 213 «etwas, das kein Stein ist.»: chispas: bajo la tierra asoma algo metálico, dorado
shot(213.85, 'C', 'punch', L => { tunnel(L, -244); const w = V(STX + .6, 2.6, -244.2); sparks(w, L.t0 - .1, L.T, 18); ST.BELL.position.y = .6; cm([STX + 4, 5, -240.4, STX, 3.4, -245.6, 38], [STX + 3.6, 4.6, -241, STX, 3.4, -245.6, 36], L.k); }, [[0, 'impact', .5], [.1, 'sparkle', .5]]);
// 214 «Stein ist.»: Ben aparta la tierra con las manos: el borde de bronce brilla
shot(214.77, 'W', null, L => { tunnel(L, -244); ST.BELL.position.y = .6; const b = put(ben, STX + 1, 0, -241.6, PI); actuar(b, 0, [[0, { lean: .7, crouch: .6, aLx: 1.2 + Math.sin(L.T * 14) * .3, aRx: 1.2 - Math.sin(L.T * 14) * .3, aLe: .3, aRe: .3 }]], { T: L.T }); cara(b, L.T, { expr: 'gasp' }); dust(V(STX + 1, 0, -242), L.t0, L.T, 10, .4);
  cm([STX + 7, 6, -238, STX + .6, 3, -244, 44], [STX + 6.4, 5.6, -238.6, STX + .6, 3, -244, 42], L.k); }, [[0, 'swipe', .4], [.1, 'rubble', .6]]);
// 215 «Es klingt wie eine riesige Glocke.»: ¡DONG! una onda sacude el túnel, cae polvo, la campana vibra
shot(215.91, 'C', 'punch', L => { tunnel(L, -244); ST.BELL.position.y = .6 + Math.sin(L.T * 60) * .06 * Math.exp(-L.lt * 2); const b = put(ben, STX + 1, 0, -241, PI); actuar(b, 0, [[0, { aLx: 2.0, aRx: 2.0, aLe: 1.9, aRe: 1.9, aLz: -.3, aRz: -.3, lean: -.1 }]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  dustFall(V(STX + 1, 6, -240), L.t0, L.T, 20); SHAKE = .5 * Math.exp(-L.lt * 2); FX2D.push(c => { const r = (L.lt * 900) % 1400; c.strokeStyle = `rgba(255,230,160,${Math.max(0, .6 - r / 1400)})`; c.lineWidth = 16; c.beginPath(); c.arc(W / 2, H * .55, r, 0, 7); c.stroke(); });
  cm([STX + 6, 6.4, -234, STX + .6, 3.6, -244, 46], [STX + 5.6, 6.2, -235, STX + .6, 3.6, -244, 44], L.k); }, [[0, 'bell_far', 1], [.02, 'impact', .6], [.3, 'rubble', .5]]);
// 216 «riesige Glocke.»: plano general: el borde enorme de la campana asoma del montón de tierra
shot(216.69, 'W', null, L => { tunnel(L, -240); ST.BELL.position.y = .6; const b = put(ben, STX + 1, 0, -236, PI); cara(b, L.T, { expr: 'shock' }); cm([STX - 6, 10, -222, STX, 3, -246, 50], [STX - 5, 9, -224, STX, 3, -246, 48], L.k); }, [[0, 'whoosh', .4], [.1, 'bells', .4]]);
// 217 «So laut,»: todos dejan de cavar a la vez; silencio
shot(217.74, 'S', null, L => { tunnel(L, -220); ST.BELL.position.y = .6; SL.slice(0, 16).forEach((c, i) => { put(c, STX + [-7, -3, 3, 7][i % 4], 0, -206 - Math.floor(i / 4) * 6, PI); c.shovel.visible = true; actuar(c, 0, [[0, { aRx: .4, aLx: .4 }]], { T: L.T }); sleepFace(c, L.T); });
  cm([STX, 8, -190, STX, 4, -230, 46], [STX, 8, -192, STX, 4, -230, 44], L.k); }, [[0, 'swipe', .4], [.1, 'silence_tick', .4]]);
// 218 «dass sich jede Laterne»: los faroles de los guardias giran uno tras otro hacia el fondo
shot(218.94, 'W', null, L => { tunnel(L, -220); GUARDS.forEach((g, i) => { const t = clamp((L.lt - i * .05) / .3); put(g, STX + (i % 2 ? 6 : -6), 0, -196 - Math.floor(i / 2) * 7, lerp(i % 2 ? -1.6 : 1.6, PI, easeOut(t))); lanternUp(g, L, .6 + t * .4, { light: false }); cara(g, L.T, { expr: 'sus' }); });
  cm([STX, 9, -176, STX, 5, -230, 48], [STX, 9, -180, STX, 5, -230, 48], L.k); }, [[0, 'whoosh', .4], [.1, 'metal_creak', .5], [.3, 'metal_creak', .4]]);
// 219 «zu mir dreht.»: desde detrás de Ben: doce faroles apuntándole; él, pequeño, en el centro de toda la luz
shot(219.84, 'C', 'punch', L => { tunnel(L, -236); ST.BELL.position.y = .6; const b = put(ben, STX + 1, 0, -238, 0); cara(b, L.T, { expr: 'shock' }); GUARDS.forEach((g, i) => { put(g, STX - 9 + (i % 6) * 3.6, 0, -224 - Math.floor(i / 6) * 4, PI); lanternUp(g, L, 1, { light: i === 2, k: 60 }); cara(g, L.T, { expr: 'sus' }); });
  cm([STX + 1, 6, -246, STX + 1, 5, -228, 46], [STX + 1, 6, -245, STX + 1, 5, -228, 44], L.k); }, [[0, 'impact', .6], [.05, 'braam', .5]]);
// 220 «Ich habe nicht»: la cara de Ben, iluminada por todos los faroles
shot(220.66, 'W', null, L => { tunnel(L, -236); const b = put(ben, STX + 1, 0, -238, 0); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); LANT.position.set(STX + 1, 6, -232); LANT.intensity = 70; onFace(b, 4.4, 0, 0, 38, L.k, 3.8); }, [[0, 'swipe', .3], [.2, 'heartbeat', .6]]);
// 221 «geblinzelt.» (zoom lento): sus ojos, enormes, con los faroles reflejados; no parpadea; final
shot(221.32, 'F', 'slow', L => { tunnel(L, -236); const b = put(ben, STX + 1, 0, -238, 0); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); LANT.position.set(STX + 1, 6, -232); LANT.intensity = 70; onFace(b, 2.8, 0, 0, 32, L.k, 2.1);
  FX2D.push(c => { const p = proj(hp(b).add(V(0, .78 * .74, .5))); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(255,220,140,.85)'; c.beginPath(); c.arc(W / 2 + s * 120 * (1 + L.k * .5) + (i - 1) * 14, p[1] - 10 + (i % 2) * 8, 6, 0, 7); c.fill(); } }); }, [[0, 'flash', .3], [.3, 'heartbeat', .6]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4, B: 8 };
const CUES = [];
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down'], Z: ['swoosh_up', 'zoom_in', 'whoosh_up'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'tape', 'whoosh_soft'], R: ['whirl', 'clock_spin', 'whoosh'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'fist'], B: ['soft_air', 'soft_air', 'soft_air'] };
let lastTr = '';
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.tr && i + 1 < S.length) { const L_ = TRS[s.tr]; let n = L_[i % L_.length]; if (n === lastTr) n = L_[(i + 1) % L_.length]; lastTr = n; CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS * .5).toFixed(3), s: n, g: .45, tr: 1 }); }
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  if (s.zoom === 'punch') CUES.push({ t: s.t0, s: 'impact', g: .6 }); });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 }); CUES.push({ t: 0, s: 'ding_reveal', g: .5 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()(); clearFaces();
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? .85); grade.uniforms.sat.value = +(QS.get('sat') ?? 1.38); grade.uniforms.sharp.value = .6; grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .32); bloom.strength = Math.min(Math.max(bloom.strength, .14), .2); bloom.threshold = .88; ao.enabled = QS.get('ao') !== '0'; DOF = 1; }
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'kick'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = BLUR;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position);
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0022 * clamp((26 - fd) / 14); bokeh.enabled = HQ && QS.get('dof') === '1'; }
  composer.render(); BLUR = 0;
}
let BLUR = 0;
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
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (tr === 'B') { octx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; octx.fillRect(0, 0, W, H); }   // fundido a negro suave (momentos tristes)
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, ben, cam, KZ, KZX, SL, MT, mama, papa, renderer, composer, bloom, sun, grade, scene, camera };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

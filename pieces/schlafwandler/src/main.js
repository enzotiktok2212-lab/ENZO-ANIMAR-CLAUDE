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
import { mondtal, stollen, kinderzimmer, schlafzimmer, kueche, praxis, glowM, minerLamp, wecker, reihe } from './swelt.js';
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
const RH = reihe(MT.g, 0, 64); RH.g.visible = false;
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
  RH.g.visible = false; for (const d of RH.DOORS) d.pv.rotation.y = 0;
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
//@@PLANOS@@

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

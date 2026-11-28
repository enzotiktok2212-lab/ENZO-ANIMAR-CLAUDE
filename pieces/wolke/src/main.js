// WOLKE — «In dieser Stadt bekommt jeder an seinem 18. Geburtstag eine Vape.» Sin vape no hay aire; sabores según el hambre; el Vape-Tag premia la nube más grande.
// Yo (Flocke) tengo la nube más pequeña; me roban el Pfirsich-Turbo (fue mi hermano mayor, que entrenaba); su nube lo sube al cielo y le salvo con una escalera de nubes pequeñas.
// Motor: el de namen/ebbe/schutzengel (cielo con nubes, AO, DOF, supermuestreo, sombras 4096) + humo de partículas de dampf + físicas (melocotones que caen y rebotan, papá que sale volando).
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { skyDome, SKIES, applySky, skyEnvs, giebelHaus } from './ebwelt.js';
import { rufingen, drawRanking, strasse, euroCoin, sign, baum } from './nwelt.js';
import { vape, holdVape, smokePool, vapePhase, armVape } from './vape.js';
import { kinderzimmer, kueche } from './swelt.js';
import { fenster } from './dwelt.js';
import { fest } from './engwelt.js';
import { pigeon, kalender } from './stwelt.js';
import { makePapa, makeOma } from './gvolk.js';
import { makeFlocke, makeBruder, makeMarlon } from './wvolk.js';
import { makeMama, makeGenau } from './nvolk.js';
import { makeExtra } from './ecast.js';
import { partyHat, cake, gift, balloons } from './hsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = window.__TESTDUR ?? 116.1, U = W / 720, PI = Math.PI;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe0f0, .0004);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 30000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .012 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral'];
console.log('t0', performance.now()|0); const ENVS = skyEnvs(renderer); console.log('envs', performance.now()|0); const ROOMENV = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
const SKY = skyDome(); scene.add(SKY);
const hemi = new THREE.HemisphereLight(0xdfeeff, 0xb89a70, 1.0); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 3); sun.castShadow = true; const SMS = +(QS.get('sm') ?? 4096); sun.shadow.mapSize.set(SMS, SMS); sun.shadow.bias = -.0002; sun.shadow.normalBias = .08; sun.shadow.radius = 1.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const LP = Array.from({ length: 4 }, () => { const l = new THREE.PointLight(0xffb060, 0, 60, 1.6); scene.add(l); return l; });
let SHR = 70, SHC = null; function sh(p0, s = 40) { SHR = s; const q = 2 * s / SMS * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 1400 }); c.updateProjectionMatrix();
  sun.target.position.copy(p); sun.position.copy(p).addScaledVector(SUND, 500); rim.target.position.copy(p); rim.position.copy(p).add(V(-SUND.x * 100, 60, -SUND.z * 100)); }
const SUND = V(-.35, .62, -.7).normalize();
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
// ---------- escenarios ----------
// Rufingen (x = 0): plaza; RATHAUS en z = -66 (fachada z ≈ -48, pantalla en (0, 17, -45.4)); escenario del Vape-Tag en z = -30 (suelo y = 4, atril en (0, 4.2, -26)); fuente (0, 22).
// Casa con ventana (FX): fachada mira a +z, hueco x ∈ [-4, 4], y ∈ [8, 15]; cuarto detrás (suelo y = 7.6, z ∈ [-20, 0]).
// Mi cuarto (KX) y el de Marlon (MX): kinderzimmer (cama x = -9, ventana fondo (4, 9, -12), puerta x = 15). Cocina (UX): mesa (0, 0). Cueva (HX): stollen dentro (z < 0). Calle (SX).
const FX = 1500, KX = 3000, MX = 3600, UX = 4200, HX = 5200, SX = 6400;
const RF = rufingen(scene), FE = fenster(scene, FX), KZ = kinderzimmer(scene, KX), MZ = kinderzimmer(scene, MX, { lena: true }), KU = kueche(scene, UX), ST = strasse(scene, SX);
const FEST = fest(RF.g); FEST.g.position.set(0, 0, -26);
// la casa de la ventana necesita calle: césped, acera, calzada, casas vecinas a los lados y enfrente, árboles
{ const g = FE.g; const gr = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat(0x5a9a46, { roughness: 1 })); gr.rotation.x = -PI / 2; gr.position.set(0, -.04, 60); gr.receiveShadow = true; g.add(gr);
  const sw = new THREE.Mesh(new THREE.PlaneGeometry(300, 10), mat(0xc8c0b4, { roughness: .9 })); sw.rotation.x = -PI / 2; sw.position.set(0, .02, 24); sw.receiveShadow = true; g.add(sw);
  const rd = new THREE.Mesh(new THREE.PlaneGeometry(300, 16), mat(0x45454c, { roughness: .75 })); rd.rotation.x = -PI / 2; rd.position.set(0, .03, 37); rd.receiveShadow = true; g.add(rd);
  for (let k = -3; k <= 3; k++) giebelHaus(g, k * 22, 66, { w: 18, d: 16, fl: 2 + (k % 2 === 0), seed: 500 + k, ry: PI, tile2: k % 2 === 0 });
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) giebelHaus(g, s * (32 + k * 22), -6, { w: 18, d: 16, fl: 2 + (k % 2), seed: 520 + k * 2 + (s > 0), ry: 0, rose: k === 0 });
  for (let k = -4; k <= 4; k++) if (k) baum(g, k * 12, 28, .8, 600 + k); }
console.log('sets', performance.now()|0);
const SETS = { RF: RF.g, FE: FE.g, KZ: KZ.g, MZ: MZ.g, KU: KU.g, ST: ST.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ich = makeFlocke(scene), bro = makeBruder(scene), papa = makePapa(scene), mama = makeMama(scene), marlon = makeMarlon(scene), oma = makeOma(scene), mayor = makeGenau(scene);
kitFace(ich, 'kid'); kitFace(bro, 'hero'); kitFace(papa, 'mustache'); kitFace(mama, 'girl'); kitFace(marlon, 'hero'); kitFace(oma, 'girl'); kitFace(mayor, 'mustache');
const EXS = Array.from({ length: 34 }, (_, i) => { const c = makeExtra(scene, i + 11); kitFace(c, ['girl', 'plain', 'kid', 'hero', 'girl', 'mustache', 'kid', 'plain'][i % 8]); return c; });
console.log('cast', performance.now()|0); const MAIN = [ich, bro, papa, mama, marlon, oma, mayor];
const NB = EXS; const POOL = [...MAIN, ...EXS];
POOL.forEach(c => outline(c.root, OC));
const HATS = POOL.map((c, i) => { const h = partyHat(c.head, i); h.visible = false; return h; });
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(.5, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const COINS = Array.from({ length: 40 }, () => P_(euroCoin(scene, 1)));
const PHONE = P_(new THREE.Group()); box(1.1, 2.1, .14, mat(0x1a1a22, { roughness: .3, metalness: .4 }), .12, PHONE, 0, 0, 0);
const TISSUE = P_(sphere(.35, mat(0xf8f8fc, { roughness: 1, flatShading: true }), null, 0, 0, 0, 6, 5));
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xd8d0c4, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const SPRAY = Array.from({ length: 30 }, () => P_(sphere(.12, mat(0xe8f4ff, { roughness: .1, transparent: true, opacity: .8 }), scene, 0, 0, 0, 6, 4)));
const RING = P_(new THREE.Mesh(new THREE.TorusGeometry(1, .06, 6, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .7, depthWrite: false }))); RING.userData.noOutline = true;
const RINGS = Array.from({ length: 4 }, () => P_(new THREE.Mesh(new THREE.TorusGeometry(1, .5, 6, 64), new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: .4, depthWrite: false }))));
const CONF = Array.from({ length: 60 }, (_, i) => P_(new THREE.Mesh(new THREE.PlaneGeometry(.35, .5), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide }))));
// ---------- vapes y humo ----------
// cada personaje con su vape en la mano derecha (colores distintos). setFlav(txt, col): etiqueta del sabor en el vape (pantallita).
const FLAVT = {}; const flavTex = (t, col) => FLAVT[t] ??= canvasTex(256, 96, (c, w, h) => { c.fillStyle = '#0a0a10'; c.fillRect(0, 0, w, h); c.fillStyle = col; c.font = `700 ${t.length > 9 ? 30 : 40}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, w / 2, h / 2 + 2); });
const VP = new Map();
POOL.forEach((c, i) => { const v = holdVape(c, vape(scene, i + 1)); v.visible = false; outline(v, OP * 1.2); outline(v.userData.grip, OC);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(.44, .16), new THREE.MeshBasicMaterial({ toneMapped: false })); sc.position.set(0, .38, .128); sc.visible = false; v.add(sc); v.userData.noOutline = false;
  v.userData.setFlav = (t, col = '#7aff9a') => { if (!t) { sc.visible = false; return; } sc.visible = true; sc.material.map = flavTex(t, col); sc.material.needsUpdate = true; }; VP.set(c, v); });
// el Pfirsich-Turbo Supreme (melocotón con dorado) y la Goldene Vape (trofeo): vapes especiales que se pueden poner en la mano de cualquiera
const PFIRSICH = vape(scene, 3); PFIRSICH.traverse(m => { if (m.isMesh && m.material.map) { m.material = m.material.clone(); m.material.map = canvasTex(128, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, w * .4, h); g.addColorStop(0, '#ffc89a'); g.addColorStop(.5, '#ff8a6a'); g.addColorStop(1, '#ff5a7a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.fillRect(0, h * .45, w, 10); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(w * .12, 0, w * .12, h); }); } });
outline(PFIRSICH, OP * 1.2); P_(PFIRSICH);
const GOLDV = vape(scene, 0, { gold: true }); outline(GOLDV, OP * 1.2); P_(GOLDV);
const SMK = smokePool(scene, 1400);
// el GTAO pinta los sprites de negro (los dibuja en su pase de normales): se esconden solo durante ese pase
{ const r0 = ao.render.bind(ao); ao.render = (...a) => { const vis = []; for (const s of SMK.list) if (s.visible) { vis.push(s); s.visible = false; } const r = r0(...a); for (const s of vis) s.visible = true; return r; }; }
const mouthW = ch => { ch.root.updateMatrixWorld(true); return ch.head.localToWorld(V(0, .36 * (ch.spec.headScale || 1), .78)); };
const faceDir = ch => { ch.root.updateMatrixWorld(true); const d = new THREE.Vector3(); ch.head.getWorldDirection(d); return d; };
const smokeDir = (ch, up = .3) => { const d = faceDir(ch); d.y = 0; d.normalize(); const m = mouthW(ch), tc = camera.position.clone().sub(m); tc.y = 0; tc.normalize(); const k = d.dot(tc);
  if (k > -.2) { d.addScaledVector(tc, -(k + .2)); const side = V(-tc.z, 0, tc.x); if (d.dot(side) < 0) side.negate(); d.addScaledVector(side, .9); } d.normalize(); d.y += up; return d; };
const FACES = [];
// ch da una calada que empieza en el tiempo absoluto t0 (calada de `inh` s). o.pose = pose base; o.expr; o.special = vape especial (PFIRSICH/GOLDV);
// o.size/pow/n/dens del humo; o.col = color del humo (sabor)
function vaper(ch, L, t0, inh, o = {}) { if (!o.bg) FACES.push(ch); const lt = L.T - t0, ph = vapePhase(Math.max(0, lt), inh, o), base = o.pose || {};
  const tilt = ph.ph === 'inh' ? -.1 - ph.inhK * .08 : ph.ph === 'exh' ? -.2 * (1 - ph.exhK * .5) : ph.ph === 'hold' ? -.14 : 0;
  const chest = ph.ph === 'inh' ? -.05 * ph.inhK : ph.ph === 'exh' ? -.05 * (1 - ph.exhK) : 0;
  const av = armVape(ph.raise); const pose = { ...base, ...av, headX: (base.headX || 0) + tilt + (o.headX || 0), lean: (base.lean || 0) + chest, headY: (base.headY || 0) };
  actuar(ch, 0, [[0, pose]], { T: L.T, extra: o.extra }); ch.aR.sh.rotation.y = av.aRy;
  const v = VP.get(ch); v.userData.grip.visible = true;
  if (o.special) { v.visible = false; const sp = o.special; v.parent.add(sp); sp.position.copy(v.position); sp.rotation.copy(v.rotation); sp.scale.copy(v.scale); sp.visible = true; sp.userData.setGlow(ph.ph === 'inh' ? 1 + Math.sin(L.T * 30) * .2 : .15); }
  else { v.visible = true; v.userData.setGlow(ph.ph === 'inh' ? .7 + Math.sin(L.T * 30) * .1 : .08); if (o.flav) v.userData.setFlav(...o.flav); }
  const ex = o.expr || 'neutral'; cara(ch, L.T, { expr: ex, mouth: ph.ph === 'done' ? (o.after || 'smile') : ph.mouth, ...(ph.eyes && !o.eyes ? { eyes: ph.eyes } : {}), ...(o.eyes ? { eyes: o.eyes } : {}) });
  if (lt > ph.t3 && !o.noSmoke) { if (o.col) SMK.tint.set(o.col); const m = mouthW(ch), d = o.dir ?? smokeDir(ch, .3 + (o.dirUp || 0)); SMK.puff(m, d, L.T, t0 + ph.t3, ph.t4 - ph.t3, { pow: o.pow ?? 4.2 + inh * .5, size: o.size ?? (.7 + Math.min(inh, 10) * .12), n: o.n ?? Math.round(30 + Math.min(inh, 10) * 6), dens: o.dens ?? .85, seed: ch.seed + Math.round(t0 * 10), life: o.life ?? 3, up: o.up }); }
  return ph; }
// sostiene el vape sin vapear (abajo, delante del pecho)
function holdV(ch, L, o = {}) { const av = armVape(o.raise ?? .05); actuar(ch, 0, [[0, { ...(o.pose || {}), ...av }]], { T: L.T }); ch.aR.sh.rotation.y = av.aRy; const v = VP.get(ch); v.userData.grip.visible = true;
  if (o.special) { v.visible = false; const sp = o.special; v.parent.add(sp); sp.position.copy(v.position); sp.rotation.copy(v.rotation); sp.scale.copy(v.scale); sp.visible = true; sp.userData.setGlow(.3); } else { v.visible = true; v.userData.setGlow(.1); if (o.flav) v.userData.setFlav(...o.flav); } }
// vapea en bucle (gente de fondo), desfasado por personaje
function vapeLoop(ch, L, i = 0, o = {}) { const per = o.per ?? 4.2, inh = o.inh ?? (1 + (i % 3) * .5), off = (i * 1.37) % per; const t0 = Math.floor((L.T + off) / per) * per - off;
  if (L.T - (t0 - per) < 3.5) { const pv = vapePhase(L.T - (t0 - per), inh, o); if (L.T - (t0 - per) > pv.t3) { const m = mouthW(ch), d = smokeDir(ch); SMK.puff(m, d, L.T, t0 - per + pv.t3, pv.t4 - pv.t3, { pow: 3.6, size: o.size ?? .75, n: 26, dens: .75, seed: ch.seed + i * 13 + Math.round((t0 - per) * 10) }); } }
  return vaper(ch, L, t0, inh, { gap: 9, bg: true, ...o }); }
// ningún humo tapa la cara de un protagonista
function clearFaces() { if (!FACES.length) return; camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const F = FACES.filter(c => c.root.visible).map(c => { const h = hp(c).add(V(0, .65 * (c.spec.scale || 1), 0)); const p = h.clone().project(camera); const d = camera.position.distanceTo(h); const r = 1.25 * (c.spec.scale || 1) / (d * Math.tan(camera.fov * PI / 360)); return { p, d, r }; });
  for (const s of SMK.list) if (s.visible) { const q = s.position.clone().project(camera); const dc = camera.position.distanceTo(s.position); for (const f of F) { if (dc > f.d + .5) continue; const dd = Math.hypot((q.x - f.p.x) * W / H, q.y - f.p.y); if (dd < f.r * 1.15) s.material.opacity *= (dd / (f.r * 1.15)) ** 2 * .25; } } }
// ---------- ambiente ----------
const AIR = aire(scene, 300);
let MODE = 'day', SKYK = 'day';
function setSky(k, sunI = 3) { SKYK = k; applySky(SKY.material, k); const s = SKIES[k]; SUND.set(...s[3]).normalize(); sun.color.setRGB(...s[4]); sun.intensity = sunI; if (HQ) { scene.environment = ENVS[k]; scene.environmentIntensity = 1; }
  scene.fog.color.setRGB(...s[2]); }
function day(k = 'day') { MODE = 'day'; setSky(k, k === 'noon' ? 3.4 : 3.1); renderer.toneMappingExposure = 1.0; hemi.intensity = .9; hemi.color.setRGB(.8, .88, 1); hemi.groundColor.setRGB(.72, .6, .44); rim.intensity = 1.2; rim.color.setRGB(1, .94, .84);
  scene.fog.density = .00028; bloom.strength = .12; bloom.threshold = .95; FILL.intensity = 0; }
function dawn() { day('dawn'); sun.intensity = 2.6; hemi.intensity = .7; hemi.color.setRGB(.9, .74, .8); rim.color.setRGB(1, .62, .4); scene.fog.density = .0005; bloom.strength = .2; bloom.threshold = .88; }
function dusk() { day('dusk'); sun.intensity = 2.4; hemi.intensity = .65; hemi.color.setRGB(.9, .7, .8); rim.color.setRGB(1, .55, .35); scene.fog.density = .0005; bloom.strength = .22; bloom.threshold = .86; }
function storm() { day('storm'); sun.intensity = 1.8; hemi.intensity = 1.0; scene.fog.density = .00045; }
function night(fill = 30) { MODE = 'night'; setSky('night', .7); renderer.toneMappingExposure = 1.05; hemi.intensity = .5; hemi.color.setRGB(.45, .6, 1); hemi.groundColor.setRGB(.16, .16, .26); rim.intensity = 1.0; rim.color.setRGB(.7, .82, 1);
  scene.fog.density = .0012; bloom.strength = .38; bloom.threshold = .7; FILL.intensity = fill; FILL.color.setRGB(1, .86, .7); }
function inside(h = 1.0, fill = 40) { MODE = 'in'; setSky('day', 0); if (HQ) { scene.environment = ROOMENV; scene.environmentIntensity = .35; } renderer.toneMappingExposure = 1.0; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .5; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0001; FILL.intensity = fill; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; c.aR.sh.rotation.y = 0; c.aL.sh.rotation.y = 0; }
  for (const h of HATS) h.visible = false; for (const v of VP.values()) { v.visible = false; v.userData.grip.visible = false; v.userData.setFlav(null); } FACES.length = 0; SMK.reset(); SMK.tint.setRGB(1, 1, 1);
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const l of [...RF.LAMPS, ...ST.LAMPS]) l.userData.lamp.material.emissiveIntensity = .15;
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; for (const l of LP) l.intensity = 0;
  FILL.color.setRGB(1, .96, .91); grade.uniforms.vig.value = .35; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = +(QS.get('sat') ?? 1.16); grade.uniforms.con.value = +(QS.get('con') ?? .22); grade.uniforms.warm.value = +(QS.get('warm') ?? .8); grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; SHAKE = 0; DOF = 1; BW = 0; BLOOMMAX = .24; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { CAMT.set(...t); camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
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
const tears = (ch, T, slot = 0) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1, sd = i ? -.3 : .3; const t = TEAR[slot * 2 + i]; t.visible = true; t.position.set(h.x + (fz * sd + fx * .68) * s, h.y + (.72 - k * 1.0) * s, h.z + (-fx * sd + fz * .68) * s); t.scale.setScalar(s); } };
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
// notas musicales que salen de un punto (las conchas cantan)
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
const climbP = (T, i) => { const p = Math.sin(T * 8 + i); return { aLx: 2.6 + p * .4, aRx: 2.6 - p * .4, aLe: .6 + Math.max(0, p) * .8, aRe: .6 + Math.max(0, -p) * .8, lLx: .9 + p * .5, lRx: .9 - p * .5, lLk: 1 + p * .5, lRk: 1 - p * .5, lean: .05 }; };
const sitPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
const sitY = (c, seat) => seat + .1 - 2.05 * (c.spec.scale || 1);
function sit(c, x, seat, z, ry, L, pose = {}) { put(c, x, sitY(c, seat), z, ry); actuar(c, 0, [[0, sitPose(pose)]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
// ---------- gente ----------
const CR = EXS;
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc_ = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc_[0] + (i + r() * .8) / list.length * (arc_[1] - arc_[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.6));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
// fila/zona rectangular (x0..x1, z0..z1) con modo; útil para el paseo y el fondo marino
function crowdBox(L, x0, x1, z0, z1, n, seed = 1, o = {}) { POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { x = lerp(x0, x1, (i + r()) / list.length); z = lerp(z0, z1, r()); tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.4)); placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = typeof o.ry === 'function' ? o.ry(i) : o.ry ?? (Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35));
  put(c, x, o.y ?? 0, z, ry); const m = typeof o.mode === 'function' ? o.mode(i) : o.mode;
  if (m === 'walk' || m === 'run') { const run = m === 'run', d = (o.speed ?? (run ? 9 : 2.2)) * L.lt, a = ry + (o.dir ?? 0); c.root.rotation.y = a; c.root.position.x += Math.sin(a) * d; c.root.position.z += Math.cos(a) * d; c.root.position.y = (o.y ?? 0) + Math.abs(Math.sin(L.T * (run ? 13 : 9) + i)) * (run ? .35 : .12); actuar(c, 0, [[0, run ? runP(L.T, i) : walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || (run ? 'shock' : 'neutral'), mouth: run ? 'o' : undefined }); }
  else if (m === 'talk') { actuar(c, 0, [[0, { aRx: .9 + Math.sin(L.T * 3 + i) * .3, aRz: .2, aRe: 1.2, aLx: .3, headY: Math.sin(L.T * .8 + i) * .4 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'talk' : 'smile' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.06 }]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = (o.y ?? 0) + j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'wave') { actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'clap') { const j = Math.sin(L.T * 14 + i); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - j * .25, aRz: -.2 - j * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(c, T, { expr: 'joy' }); }
  else if (m === 'look') { actuar(c, 0, [[0, { headX: -.15, aLx: .2, aRx: .2, headY: Math.sin(L.T * .7 + i) * .15 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'happy', mouth: o.mouth || (i % 3 ? 'smile' : 'o') }); }
  else if (m === 'dig') { const j = Math.sin(L.T * 5 + i); actuar(c, 0, [[0, { crouch: .45, lean: .5, aLx: 1.2 + j * .3, aRx: 1.2 - j * .3, aLe: .6, aRe: .6, headX: .3 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'smile' }); }
  else if (m === 'climb') { actuar(c, 0, [[0, climbP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || 'determined', mouth: 'o' }); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function lp(i, x, y, z, k = 40, col = 0xffb060, d = 60) { const l = LP[i]; l.position.set(x, y, z); l.intensity = k; l.color.setHex(col); l.distance = d; }
function tod(t = 'day', fill = 26) { if (t === 'night') night(fill); else if (t === 'dawn') dawn(); else if (t === 'dusk') dusk(); else day(t); }
function stadt(L, t = 'day', board = 'vapetag') { use('RF'); FEST.PULT.visible = false; tod(t); boardDraw(board); if (t === 'night' || t === 'dusk') RF.LAMPS.forEach(l => l.userData.lamp.material.emissiveIntensity = t === 'night' ? 2.6 : 1.2); }
function strasseS(L, t = 'day') { use('ST'); tod(t); if (t === 'night' || t === 'dusk') ST.LAMPS.forEach(l => l.userData.lamp.material.emissiveIntensity = t === 'night' ? 2.6 : 1.2); }
function haus(L, t = 'day') { use('FE'); tod(t); }
function zimmer(L, night = false, mar = false) { const Z = mar ? MZ : KZ; use(mar ? 'MZ' : 'KZ'); inside(night ? .55 : .95, night ? 18 : 34); Z.WN.p.material.map = night ? Z.WN.night : Z.WN.day; const X = mar ? MX : KX;
  if (night) { lp(0, X - 3, 6, -7, 22, 0xffc070, 22); lp(1, X + 4, 12, -10, 18, 0x6a8aff, 30); } else lp(0, X + 4, 12, -6, 30, 0xfff0d8, 40); }
function kuecheS(L) { use('KU'); inside(1, 34); lp(0, UX, 11, 0, 40, 0xffe0b0, 40); }
function hoehle(L) { use('HH'); inside(1.0, 34); lp(0, HX, 3, -30, 130, 0xff8a2a, 60); lp(1, HX + 6, 10, -14, 60, 0xffc080, 50); grade.uniforms.sepia.value = .42; grade.uniforms.vig.value = .5; }
let BKEY = ''; function boardDraw(k) { if (BKEY === k) return; BKEY = k; RF.BOARD.userData.draw((c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a0a4a'); gr.addColorStop(1, '#0a1a4a'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 150px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#1a0030'; c.strokeText('VAPE-TAG', w / 2, 250); const g = c.createLinearGradient(0, 160, 0, 340); g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#ffa820'); c.fillStyle = g; c.fillText('VAPE-TAG', w / 2, 250);
  c.font = `700 90px ${FONT}`; c.fillStyle = '#7ae0ff'; c.fillText('14. MÄRZ', w / 2, 430); c.font = `700 64px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(k === 'sieger' ? 'SIEGER: FLOCKE' : 'GRÖSSTE WOLKE GEWINNT', w / 2, 600);
  for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(80 + i * 80, 730 + Math.sin(i) * 20, 40 + (i % 3) * 14, 0, 7); c.fill(); } }); }
// ---------- física de monedas y balón ----------
// ráfaga de n monedas desde c (V) en T0: salen hacia arriba con dispersión, caen con gravedad y rebotan en el suelo (y0)
function coinBurst(c, T0, T, n = 8, slot = 0, o = {}) { const t = T - T0; if (t < 0 || t > (o.life ?? 1.6)) return; const g = 30, y0 = o.y0 ?? 0;
  for (let i = 0; i < n; i++) { const m = COINS[(slot + i) % COINS.length]; const r = RNG(i * 13 + slot * 7 + 1); const a = r() * PI * 2, sp = (o.spread ?? 3) * (.4 + r()), vy = (o.vy ?? 11) * (.7 + r() * .5);
    let y = c.y + vy * t - .5 * g * t * t, x = c.x + Math.cos(a) * sp * t, z = c.z + Math.sin(a) * sp * t; if (y < y0 + .1) { const tc = (vy + Math.sqrt(vy * vy + 2 * g * (c.y - y0))) / g, tb = t - tc; y = y0 + .1 + Math.max(0, vy * .35 * tb - .5 * g * tb * tb); }
    m.visible = true; m.position.set(x, y, z); m.rotation.set(t * 9 * (r() + .5), t * 6, 0); m.scale.setScalar(o.s ?? .8); } }
// moneda que vuela de un punto a otro (cobrar): arco
function coinFly(a, b, T0, T, n = 3, slot = 30, dur = .5) { for (let i = 0; i < n; i++) { const k = clamp((T - T0 - i * .1) / dur); if (k <= 0 || k >= 1) continue; const m = COINS[(slot + i) % COINS.length]; m.visible = true; m.position.copy(arc([a.x, a.y, a.z], [b.x, b.y, b.z], 2.5, easeInOut(k))); m.rotation.set(0, k * 12, 0); m.scale.setScalar(.75); } }
function confetti(c, T0, T, n = 60, h = 14) { const t = T - T0; if (t < 0) return; CONF.forEach((p, i) => { if (i >= n) return; const r = RNG(i * 3 + 1); p.visible = true; p.position.set(c.x + (r() - .5) * 30 + Math.sin(T * 2 + i) * 1.2, c.y + h - ((t * (2 + r() * 2) + r() * h) % h), c.z + (r() - .5) * 20); p.rotation.set(T * 3 + i, T * 2 + i * .7, 0); }); }
// «+1 €» que sube y se desvanece sobre un punto 3D
function plus(w3, T0, T, text = '+1 €', kind = 'gold', sc = 1) { const t = T - T0; if (t < 0 || t > 1.1) return; BAD_.push({ kind, text, w3: w3.clone().add(V(0, t * 2.2, 0)), s: spring(clamp(t * 4) * 1.6) * sc * .8, a: 1 - clamp((t - .7) / .4), on: true }); }
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
const KEY = /^(Stadt|Vape|Vape-Tag|achtzehnten|Geburtstag|Papa|Fenster|geklaut|dreitausend|Luft|Hunger|Döner-Geschmack|Durst|Apfelschorle-Geschmack|Rosenkohl|Leberwurst|Flocke|kleinste|Wolke|vierzehnten|Goldene|Geldschein|Geheimwaffe|Pfirsich-Turbo|Supreme|Monatsgehälter|Marlon|viermal|Hintern|Pfirsich|Kamera|Bruder|trainiert|Ekelhaft|PUFF|Drei|zwei|eins|Österreich|Bürgermeister|NEIN|Himmel|nutzlos|Treppe|gerettet|Pfirsich-Regen|Gratis-Mittagessen|Geld|Jahre|Euro|Namen|Haken|anderes|Bürgermeister|Genau|goldenen|Whirlpool|Krass|Einkaufszentrum|Digga|Baby|reich|Boah|Huss|HUSS|Niemand|dreizehn|drei|Zwei|Mama|niesen|Party|Plan|eins|Namensschild|Hans|Null|zwei|Döner|gratis|zweihundertvierzig|allein|Ein|Sechs|Neun|Platz|Hoodie|blauen|Spiel|fertig|Sechzig|Punkte|gut|gefeiert|Nacht|trainierten|pleite|Freitag|Million|besten|Welt|Danke)$/i;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0, BW = 0, BLOOMMAX = .24; const FX2D = [];
//@@PLANOS@@

// ---------- transiciones, sonidos, render ----------
S.sort((a, b) => a.t0 - b.t0);
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4, B: 8, P: 5, G: 5 };
const CUES = [];
// cada tipo de transición con sus sonidos propios (claros, por encima de los efectos de ambiente)
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down'], Z: ['swoosh_up', 'zoom_in', 'whoosh_up'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'tape', 'whoosh_soft'], R: ['whirl', 'clock_spin', 'whoosh'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'fist'], B: ['soft_air', 'soft_air', 'soft_air'], P: ['splash', 'water_whoosh', 'splash'], G: ['glitch', 'whoosh', 'glitch'] };
let lastTr = '';
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.tr && i + 1 < S.length) { const L_ = TRS[s.tr]; let n = L_[i % L_.length]; if (n === lastTr) n = L_[(i + 1) % L_.length]; lastTr = n; CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS * .5).toFixed(3), s: n, g: .8, tr: 1 }); }
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  if (s.zoom === 'punch') CUES.push({ t: s.t0, s: 'impact', g: .6 }); });
CUES.push({ t: 0, s: 'zoom_fast', g: .7 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()();
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? 1); grade.uniforms.sharp.value = +(QS.get('sharp') ?? .55); grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .38); bloom.strength = Math.min(bloom.strength, BLOOMMAX); ao.enabled = QS.get('ao') !== '0'; }
  if (BW > 0) { grade.uniforms.sat.value *= 1 - BW; grade.uniforms.sharp.value += BW * .6; }
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .82, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (s.zoom === 'hook') { const e1 = clamp(lt / .2), e2 = clamp((lt - .2) / Math.max(.3, d - .2)); camera.fov *= lerp(.5, 1, easeOut(e1)) * lerp(1, .8, easeInOut(e2)); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .62, e2); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'kick'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.2; grade.uniforms.vig.value = .5; grade.uniforms.sat.value = 1.3; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = BLUR;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  sh(SHC ?? camera.position.clone().addScaledVector(dir, Math.min(60, Math.max(14, camera.position.distanceTo(CAMT)))), SHR);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .25);
  sun.castShadow = sun.intensity >= .45; SKY.position.copy(camera.position); SKY.material.uniforms.time.value = T;
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0016 * clamp((40 - fd) / 24 + .25); bokeh.uniforms.maxblur.value = .012; bokeh.enabled = HQ && QS.get('dof') !== '0' && DOF > 0; }
  clearFaces(); composer.render(); BLUR = 0; SHR = 70; SHC = null;
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
  if (tr === 'P') { octx.filter = `blur(${(a * 10).toFixed(1)}px) saturate(${1 + a}) hue-rotate(${(a * 25).toFixed(0)}deg)`; const sc = 1 + a2 * .15; octx.scale(sc, sc); }
  if (tr === 'G') { const r = RNG(Math.floor(T * FPS)); octx.translate((r() - .5) * a * 120, 0); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  if (tr === 'G' && a > .2) { const r = RNG(Math.floor(T * FPS) + 7); for (let k = 0; k < 6; k++) { const y = (r() - .5) * H, h = 20 + r() * 80; octx.drawImage(renderer.domElement, 0, (y + H / 2) * renderer.domElement.height / H, renderer.domElement.width, h * renderer.domElement.height / H, -W / 2 + (r() - .5) * 200 * a, y, W, h); } }
  octx.restore(); octx.filter = 'none';
  if (tr === 'P') { const g = octx.createLinearGradient(0, H * (1 - a * 1.4), 0, H); g.addColorStop(0, 'rgba(120,200,220,0)'); g.addColorStop(1, `rgba(200,240,255,${(a * .7).toFixed(3)})`); octx.fillStyle = g; octx.fillRect(0, 0, W, H); }
  if (tr === 'B') { octx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; octx.fillRect(0, 0, W, H); }
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); caption(T);
}
console.log('ready', performance.now()|0); window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { SMK, THREE, applyPose, hp, ich, bro, papa, cam, renderer, composer, bloom, sun, grade, scene, camera, RF, FEST };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

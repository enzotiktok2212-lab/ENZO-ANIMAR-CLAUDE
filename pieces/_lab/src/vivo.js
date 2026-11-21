// vivo.js — capa de "vida" encima de engine.js (no cambia nada de lo anterior; todo es opcional):
//  1. CARAS del kit (7 estilos × 16 ojos × 16 bocas) para cualquier personaje: face: { custom: 'kit', style: 'hero', expr: 'shock' }
//  2. ACTUACIÓN: gestos con anticipación + rebote (overshoot) + retardo por partes (follow-through), respiración y peso
//  3. PASOS que no patinan (la zancada sale de la velocidad), arranque suave, salto con anticipación y aplastamiento
//  4. AMBIENTE: luz del cielo (IBL), viento en las copas, motas/polen/luciérnagas en el aire, pájaros o murciélagos,
//     cámara en mano realista.
// Todo es determinista: depende solo del tiempo T (se puede renderizar cualquier fotograma suelto).
import { THREE, CUSTOM_FACES, clamp, lerp, applyPose, mixPose, walkPose, runPose, idlePose, RNG, V, canvasTex } from './engine.js';

// =====================================================================================================
// 1. CARAS DEL KIT
// =====================================================================================================
export const KIT_STYLES = ['plain', 'hero', 'girl', 'kid', 'mustache', 'villain', 'hero_blood'];
export const EYE = { normal: 0, wide: 1, half: 2, closed: 3, happy: 4, squint: 5, side_l: 6, side_r: 7, terror: 8,
  worried: 9, angry: 10, scared: 11, wink: 12, up: 13, down: 14, cry: 15 };
export const MOUTH = { flat: 0, smile: 1, open_smile: 2, laugh: 3, frown: 4, o: 5, talk: 6, talk_wide: 7, grimace: 8,
  grimace_wide: 9, scream: 10, smirk: 11, wavy: 12, yawn: 13, grin: 14, ah: 15 };
// expresiones con nombre: [ojos, boca]
export const EXPR = {
  neutral: ['normal', 'flat'], happy: ['normal', 'open_smile'], joy: ['happy', 'laugh'], smile: ['normal', 'smile'],
  grin: ['happy', 'grin'], shock: ['wide', 'grimace'], gasp: ['wide', 'o'], terror: ['terror', 'grimace_wide'],
  scream: ['scared', 'scream'], worried: ['worried', 'frown'], angry: ['angry', 'grimace'], furious: ['angry', 'scream'],
  smug: ['half', 'smirk'], bored: ['half', 'flat'], sleepy: ['half', 'wavy'], yawn: ['closed', 'yawn'],
  sus: ['squint', 'wavy'], side_l: ['side_l', 'frown'], side_r: ['side_r', 'frown'], wink: ['wink', 'smirk'],
  cry: ['cry', 'ah'], scared: ['scared', 'frown'], talk: ['normal', 'talk'], shout: ['angry', 'talk_wide'],
  determined: ['angry', 'flat'], relief: ['closed', 'smile'], confused: ['squint', 'o'], lookup: ['up', 'o'],
  lookdown: ['down', 'frown'], panic: ['terror', 'scream'], sad: ['worried', 'frown'], love: ['happy', 'smile'],
};
// nombres del motor antiguo -> celdas del kit (así las llamadas de siempre siguen funcionando)
const OLD_E = { open: 'normal' };
const OLD_M = { shout: 'talk_wide', teeth: 'grimace' };
const IMG = {};
export async function loadKitFaces(base = './src/caras/') {
  const load = src => new Promise((ok, ko) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ko(new Error('no carga ' + src)); im.src = src; });
  await Promise.all(KIT_STYLES.flatMap(s => ['eyes', 'mouth'].map(async l => { IMG[`${s}_${l}`] = await load(`${base}${s}_${l}.png`); })));
  CUSTOM_FACES.kit = drawKitFace;
}
// La cara de los muñecos es un trozo de cilindro de 1,4 de ancho × 1,0 de alto con una textura de 512×512:
// la celda del kit (cuadrada, ~1,1 unidades) se dibuja comprimida en horizontal para que se vea redonda.
const KW = 1.1, DW = Math.round(KW / 1.4 * 512), DH = Math.round(KW / 1.0 * 512), DX = 256 - DW / 2, DY = -30;
function drawKitFace(c, s) {
  c.clearRect(0, 0, 512, 512);
  const style = s.blood ? 'hero_blood' : (s.style || 'plain');
  let [e, m] = EXPR[s.expr] || ['normal', 'flat'];
  if (s.eyes) e = OLD_E[s.eyes] || s.eyes;
  if (s.mouth) m = OLD_M[s.mouth] || s.mouth;
  // compatibilidad con los parámetros antiguos
  if (e === 'normal' || e === 'wide') {
    if ((s.brows || 0) > .35) e = 'angry'; else if ((s.brows || 0) < -.35) e = e === 'wide' ? 'scared' : 'worried';
    const lk = s.look || [0, 0];
    if (e === 'normal') { if (lk[0] > .45) e = 'side_r'; else if (lk[0] < -.45) e = 'side_l'; else if (lk[1] > .6) e = 'down'; else if (lk[1] < -.6) e = 'up'; }
  }
  if (s.tears && e !== 'closed') e = 'cry';
  const cell = (img, idx) => { const col = idx % 4, row = idx >> 2, S = img.width / 4; c.drawImage(img, col * S, row * S, S, S, DX, DY, DW, DH); };
  if (s.bags) for (const x of [180, 332]) { c.fillStyle = `rgba(90,50,120,${.18 + .25 * s.bags})`; c.beginPath(); c.ellipse(x, 268, 52, 20, 0, 0, Math.PI); c.fill(); }
  if (s.blush) { c.fillStyle = `rgba(255,110,120,${.22 * s.blush + .08})`; c.beginPath(); c.ellipse(118, 330, 40, 20, 0, 0, 7); c.ellipse(394, 330, 40, 20, 0, 0, 7); c.fill(); }
  if (s.freckles) { c.fillStyle = 'rgba(150,80,50,.5)'; for (const [x, y] of [[112, 312], [136, 326], [98, 334], [400, 312], [376, 326], [414, 334]]) { c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); } }
  cell(IMG[`${style}_eyes`], EYE[e] ?? 0);
  cell(IMG[`${style}_mouth`], MOUTH[m] ?? 0);
  if (s.sweat) { c.fillStyle = 'rgba(120,200,255,.9)'; c.beginPath(); c.moveTo(440, 110); c.quadraticCurveTo(462, 160, 440, 172); c.quadraticCurveTo(418, 160, 440, 110); c.fill(); }
  if (s.veins) { c.strokeStyle = '#d62f3a'; c.lineWidth = 8; c.lineCap = 'round'; const x = 430, y = 70; c.beginPath(); c.moveTo(x - 20, y); c.lineTo(x, y + 10); c.lineTo(x - 6, y + 28); c.moveTo(x + 20, y); c.lineTo(x, y + 10); c.stroke(); }
  if (s.soot) { c.fillStyle = 'rgba(40,30,30,.4)'; for (const [x, y, r] of [[110, 300, 46], [380, 120, 40], [300, 430, 30]]) { c.beginPath(); c.ellipse(x, y, r, r * .6, .4, 0, 7); c.fill(); } }
}
// pone la cara del kit a un personaje ya creado (conserva sus extras: rubor, pecas, ojeras...)
export function kitFace(ch, style = 'plain', extra = {}) {
  const keep = {}; for (const k of ['blush', 'freckles', 'bags', 'skin']) if (ch.spec.face && ch.spec.face[k] != null) keep[k] = ch.spec.face[k];
  ch.spec.face = { custom: 'kit', style, ...keep, ...extra }; ch.setFace({}); return ch;
}
// lip-sync con las bocas del kit: alterna talk / talk_wide / o según las sílabas de cada palabra
export function kitLips(t, words) {
  for (const w of words) if (t >= w[0] && t < w[1]) { const k = (t - w[0]) / Math.max(.08, w[1] - w[0]); const syl = Math.max(1, Math.round((w[1] - w[0]) / .15)); const v = Math.sin(k * syl * Math.PI);
    return v > .6 ? 'talk_wide' : v > .2 ? 'talk' : 'o'; }
  return null;
}
// mirada viva: parpadeo + miradas rápidas a un lado cada pocos segundos (sacadas)
export function eyesAlive(t, seed = 1, base = 'normal') {
  const p = 2.3 + (seed % 5) * .31, x = (t + seed * .77) % p; if (x < .1) return 'closed';
  if (base !== 'normal') return base;
  const q = (t * .37 + seed * .13) % 1; return q < .07 ? 'side_l' : q > .5 && q < .56 ? 'side_r' : base;
}

// =====================================================================================================
// 2. ACTUACIÓN
// =====================================================================================================
// Gestos en parámetros de applyPose (radianes). a?x = brazo hacia delante/arriba, a?z = brazo hacia fuera (negativo: cruza),
// a?e = codo, lean = inclinar el tronco, headX = cabeza abajo, headY = girar, headZ = ladear, crouch = agacharse.
export const GEST = {
  idle: {},
  shock: { aLx: .55, aLz: .95, aRx: .55, aRz: .95, aLe: 1.0, aRe: 1.0, lean: -.16, headX: -.18, crouch: .06 },
  hands_head: { aLx: 2.55, aLz: .55, aRx: 2.55, aRz: .55, aLe: 2.0, aRe: 2.0, lean: -.06, headX: .05 },
  hands_face: { aLx: 2.05, aLz: -.18, aRx: 2.05, aRz: -.18, aLe: 2.25, aRe: 2.25, headX: .12, lean: .06 },
  cheer: { aLx: 2.9, aLz: .5, aRx: 2.9, aRz: .5, aLe: .2, aRe: .2, headX: -.3, lean: -.1 },
  point: { aRx: 1.62, aRz: -.08, aRe: .05, aLz: .12, aLe: .25, headY: -.08, twist: -.14 },
  point_l: { aLx: 1.62, aLz: -.08, aLe: .05, aRz: .12, aRe: .25, headY: .08, twist: .14 },
  shrug: { aLx: .45, aLz: .65, aRx: .45, aRz: .65, aLe: 1.5, aRe: 1.5, headZ: .2, headX: -.05 },
  recoil: { aLx: .95, aLz: .5, aRx: .95, aRz: .5, aLe: 1.25, aRe: 1.25, lean: -.28, headX: -.2, lLx: -.18, lRx: .22, crouch: .08 },
  lean_in: { lean: .3, headX: -.2, aLx: .35, aRx: .35, aLe: .5, aRe: .5 },
  slump: { lean: .36, headX: .5, aLz: .02, aRz: .02, aLe: .1, aRe: .1, crouch: .1 },
  think: { aRx: 1.95, aRz: -.5, aRe: 2.35, aLx: .75, aLz: -.55, aLe: 1.65, headY: .2, headX: .08, headZ: .14 },
  cross: { aLx: 1.3, aLz: -.72, aRx: 1.3, aRz: -.72, aLe: 1.95, aRe: 1.95, headX: -.08, lean: -.04 },
  phone: { aRx: 2.35, aRz: -.6, aRe: 2.55, aLz: .1, headZ: .14 },
  phone_look: { aRx: 1.25, aRz: -.25, aRe: 1.6, aLx: 1.0, aLz: -.25, aLe: 1.7, headX: .35 },
  reach: { aRx: 1.65, aRe: .1, aLx: 1.15, aLe: .2, lean: .22, lRx: -.2, lLx: .25 },
  push: { aLx: 1.55, aRx: 1.55, aLe: .3, aRe: .3, lean: .28, lLx: .4, lRx: -.35, lRk: .2 },
  hold: { aLx: 1.3, aRx: 1.3, aLz: -.2, aRz: -.2, aLe: .95, aRe: .95 },
  fists: { aLx: 1.0, aLz: .3, aRx: 1.0, aRz: .3, aLe: 2.0, aRe: 2.0, lean: .1, headX: .08, crouch: .12 },
  facepalm: { aRx: 2.3, aRz: -.45, aRe: 2.35, headX: .34, lean: .14 },
  brace: { aLx: 1.4, aLz: .7, aRx: 1.4, aRz: .7, aLe: .75, aRe: .75, lean: -.18, headX: .18, crouch: .3, lLx: .35, lRx: -.25, lLk: .3, lRk: .3 },
  cower: { aLx: 1.75, aLz: .05, aRx: 1.75, aRz: .05, aLe: 2.3, aRe: 2.3, lean: .25, headX: .3, crouch: .55, lLx: .6, lRx: .6, lLk: 1.1, lRk: 1.1 },
  sneak: { crouch: .45, lean: .42, lLx: .65, lRx: .15, lLk: 1.0, lRk: .55, aLx: .6, aRx: .25, aLe: 1.1, aRe: 1.1, headX: -.25 },
  knock: { aRx: 1.55, aRz: -.1, aRe: 1.5, lean: .06, aLz: .1, aLe: .3 },
  listen: { lean: .18, headZ: .32, headY: .25, aRx: .9, aRz: -.15, aRe: 1.8, aLz: .1 },
  hug_self: { aLx: 1.15, aLz: -.8, aRx: 1.15, aRz: -.8, aLe: 2.1, aRe: 2.1, lean: .12, headX: .25, crouch: .1 },
  wave: { aRx: 2.7, aRz: .4, aRe: .5, aLz: .08, aLe: .2 },
};
// curva de transición: anticipación opcional (un pequeño movimiento al revés) y después muelle con ~10 % de rebote
const springIn = (k, anti = 0) => {
  if (k <= 0) return 0; if (k >= 1) return 1;
  const A = anti ? .2 : 0; if (k < A) return -anti * Math.sin(Math.PI * k / A);
  const q = (k - A) / (1 - A); return 1 - Math.exp(-6 * q) * Math.cos(2.6 * Math.PI * q);
};
const toPose = (p, T) => typeof p === 'string' ? (p === 'wave' ? { ...GEST.wave, aRz: .4 + Math.sin(T * 9) * .38 } : GEST[p]) : typeof p === 'function' ? p(T) : p;
// pose de una cadena de claves [[t, pose|nombre|fn(T), {dur, anti}], ...] en el tiempo local t
function chainAt(keys, t, T) {
  let cur = toPose(keys[0][1], T) || {};
  for (let i = 1; i < keys.length; i++) {
    const [ti, pi, oi = {}] = keys[i]; if (t < ti) break;
    const dur = oi.dur ?? .3, k = (t - ti) / dur, target = toPose(pi, T) || {};
    // el valor de partida es la pose a la que se había llegado (incluido el rebote si se interrumpe)
    cur = mixPose(cur, target, springIn(k, oi.anti ?? 0));
    if (k < 1 && i + 1 < keys.length && keys[i + 1][0] <= t) continue;
  }
  return cur;
}
const ARMS = ['aLx', 'aLz', 'aLe', 'aRx', 'aRz', 'aRe'], HEAD = ['headX', 'headY', 'headZ'];
// actuar(ch, lt, keys, {T, extra, breathe, weight, lag}) -> aplica la pose y la devuelve
// Brazos llegan 0,05 s después que el tronco y la cabeza 0,08 s después (retardo natural), respira y reparte el peso.
export function actuar(ch, lt, keys, o = {}) {
  const T = o.T ?? lt, lag = o.lag ?? 1;
  const body = chainAt(keys, lt, T), arms = chainAt(keys, lt - .05 * lag, T), head = chainAt(keys, lt - .085 * lag, T);
  const p = { ...body }; for (const k of ARMS) if (k in arms || k in body) p[k] = arms[k] ?? 0; for (const k of HEAD) if (k in head || k in body) p[k] = head[k] ?? 0;
  const sd = ch.seed || 1;
  if (o.breathe !== false) { const b = Math.sin(T * 2.3 + sd); p.lean = (p.lean || 0) + b * .012; p.aLz = (p.aLz || 0) + b * .018; p.aRz = (p.aRz || 0) + b * .018; p.headX = (p.headX || 0) - b * .01; }
  if (o.weight !== false) { const w = Math.sin(T * .6 + sd * 1.7); p.sx = (p.sx || 0) + w * .05; p.headZ = (p.headZ || 0) - w * .025; p.twist = (p.twist || 0) + Math.sin(T * .45 + sd) * .03; }
  Object.assign(p, o.extra || {});
  applyPose(ch, p); return p;
}
// mirar a un punto del mundo (devuelve headY/headX limitados, con retardo opcional usando la posición en t-lag)
export function mirar(ch, pt, maxY = 1.0, maxX = .5) {
  ch.root.updateMatrixWorld(true); const h = new THREE.Vector3(); ch.head.getWorldPosition(h);
  const d = pt.clone().sub(h), ry = ch.root.rotation.y;
  const local = Math.atan2(d.x, d.z) - ry; const yaw = Math.atan2(Math.sin(local), Math.cos(local));
  const pitch = -Math.atan2(d.y, Math.hypot(d.x, d.z));
  return { headY: clamp(yaw, -maxY, maxY), headX: clamp(pitch, -maxX, maxX) };
}

// =====================================================================================================
// 3. PASOS Y SALTOS
// =====================================================================================================
// Longitud de un ciclo completo (dos pasos) del walkPose/runPose del motor, para pierna de 2,05: así los pies no patinan.
const CYCLE_WALK = 4.6, CYCLE_RUN = 6.6;
// caminar(ch, lt, {x, z, ry, speed, run, accel, stopAt, T}) -> coloca al personaje y le pone la pose. Devuelve {x, z, d}.
// accel: segundos para arrancar desde quieto; stopAt: tiempo local en que empieza a frenar (frena en 'accel' segundos).
export function caminar(ch, lt, o) {
  const sc = ch.spec.scale || 1, sp = o.speed ?? (o.run ? 9 : 3.4), a = o.accel ?? .3, T = o.T ?? lt;
  const dist = t => { if (t <= 0) return 0; let d = t < a ? sp * t * t / (2 * a) : sp * (t - a / 2);
    if (o.stopAt != null && t > o.stopAt) { const s = Math.min(t - o.stopAt, a); d -= sp * s * s / (2 * a); } return d; };
  let d = dist(lt); if (o.stopAt != null && lt > o.stopAt + a) d = dist(o.stopAt + a);
  const ry = o.ry ?? 0, x = o.x + Math.sin(ry) * d, z = o.z + Math.cos(ry) * d;
  ch.root.visible = true; ch.root.position.set(x, o.y ?? 0, z); ch.root.rotation.set(0, ry, 0);
  const cyc = d / ((o.run ? CYCLE_RUN : CYCLE_WALK) * sc * (o.stride ?? 1));
  let p = o.run ? runPose(cyc / 3.2, 1) : walkPose(cyc / 2.0, 1, o.tired || 0);
  // velocidad instantánea -> mezcla con la pose de parado al arrancar y al frenar
  const v = (dist(lt + .02) - dist(lt - .02)) / .04, mv = clamp(v / sp);
  p = mixPose(idlePose(T, ch.seed || 0), p, mv);
  p.headX = (p.headX || 0) - (p.lean || 0) * .45;   // la cabeza compensa: mira al frente aunque el cuerpo se incline
  if (o.extra) Object.assign(p, o.extra);
  applyPose(ch, p); return { x, z, d, v };
}
// salto: anticipación (agacharse), impulso, vuelo parabólico con brazos arriba, aterrizaje con amortiguación.
// saltar(ch, lt, t0, {h, dur, base:[x,y,z], dx, dz}) -> aplica pose, posición y aplastar-estirar
export function saltar(ch, lt, t0, o = {}) {
  const h = o.h ?? 2.4, dur = o.dur ?? .55, A = .16, Lnd = .22, t = lt - t0, b = o.base || [ch.root.position.x, 0, ch.root.position.z];
  let y = 0, sq = 1, p = {}, f = 0;
  if (t < 0) p = {};
  else if (t < A) { const k = t / A; p = { crouch: .55 * Math.sin(k * Math.PI / 2), aLx: -.6 * k, aRx: -.6 * k, aLe: .3, aRe: .3, lean: .25 * k, lLx: .5 * k, lRx: .5 * k, lLk: 1.0 * k, lRk: 1.0 * k }; sq = 1 - .1 * k; }
  else if (t < A + dur) { const k = (t - A) / dur; f = k; y = h * 4 * k * (1 - k); const up = Math.min(1, k * 3);
    p = { aLx: 2.6 * up, aRx: 2.6 * up, aLz: .45, aRz: .45, aLe: .3, aRe: .3, lLx: .35 + .4 * Math.sin(k * Math.PI), lRx: -.1 + .5 * Math.sin(k * Math.PI), lLk: .9 * Math.sin(k * Math.PI) + .2, lRk: .5, headX: -.15, lean: -.05 };
    sq = 1 + .12 * Math.max(0, 1 - k * 4) - .04 * Math.max(0, k * 4 - 3); }
  else if (t < A + dur + Lnd) { const k = (t - A - dur) / Lnd; f = 1; const c = Math.sin((1 - k) * Math.PI / 2);
    p = { crouch: .5 * c, lean: .25 * c, aLx: .9 * c, aRx: .9 * c, aLz: .5, aRz: .5, aLe: .4, aRe: .4, lLx: .5 * c, lRx: .5 * c, lLk: 1.0 * c, lRk: 1.0 * c }; sq = 1 - .14 * c; }
  else f = 1;
  const sc = ch.spec.scale || 1;
  ch.root.position.set(b[0] + (o.dx || 0) * f, b[1] + y, b[2] + (o.dz || 0) * f);
  ch.root.scale.set(sc * (2 - sq) ** .5, sc * sq, sc * (2 - sq) ** .5);
  applyPose(ch, { ...p, ...(o.extra || {}) }); return { y, f };
}
// temblor de miedo (rodillas y manos), para sumar a cualquier pose
export const shiver = (T, amt = 1) => ({ sx: Math.sin(T * 47) * .02 * amt, aLz: Math.sin(T * 41) * .04 * amt, aRz: Math.sin(T * 43 + 1) * .04 * amt, headZ: Math.sin(T * 37) * .02 * amt });

// =====================================================================================================
// 4. AMBIENTE
// =====================================================================================================
// 4a. Luz del cielo (IBL): el color del cielo ilumina y se refleja en todo (idea de PROBANDO-ANIMAR-3D/threejs-scene).
// Genera el mapa una vez por combinación de colores (caché) a partir del mismo cielo de nightSky().
export function luzCielo(renderer, scene, skyMesh, intensity = .45) {
  const pm = new THREE.PMREMGenerator(renderer), cache = new Map();
  const sc = new THREE.Scene(); const clone = new THREE.Mesh(skyMesh.geometry, skyMesh.material); clone.scale.setScalar(.05); sc.add(clone);
  return {
    update(on = true) {
      if (!on) { scene.environment = null; return; }
      const u = skyMesh.material.uniforms, key = [u.top.value, u.mid.value, u.hor.value].map(c => c.getHexString()).join();
      if (!cache.has(key)) cache.set(key, pm.fromScene(sc, .04, .1, 200).texture);
      scene.environment = cache.get(key); scene.environmentIntensity = intensity;
    },
    set intensity(v) { intensity = v; scene.environmentIntensity = v; },
  };
}
// 4b. Viento en las copas (shader): mueve las hojas de todos los árboles de tree() con ráfagas.
const WIND = { value: 0 }, GUST = { value: 1 };
const patched = new WeakSet();
export function viento(root) {
  root.traverse(o => { if (!o.userData || !o.userData.leaves) return;
    for (const l of o.userData.leaves) { const m = l.material; if (patched.has(m)) continue; patched.add(m);
      m.onBeforeCompile = sh => { sh.uniforms.uWind = WIND; sh.uniforms.uGust = GUST;
        sh.vertexShader = 'uniform float uWind; uniform float uGust;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
          vec4 wpV = modelMatrix * vec4(0.,0.,0.,1.); float ph = wpV.x * .21 + wpV.z * .17;
          float g = .55 + .45 * sin(uWind * .7 + ph * .5);
          transformed.x += (sin(uWind * 1.9 + ph) * .16 + sin(uWind * 5.3 + position.y * 2.1 + ph) * .05) * g * uGust;
          transformed.z += (cos(uWind * 1.5 + ph * 1.3) * .10 + sin(uWind * 6.1 + position.x * 2.3) * .04) * g * uGust;
          transformed.y += sin(uWind * 4.7 + position.z * 1.7 + ph) * .03 * uGust;`); };
      m.needsUpdate = true; } });
}
export const setViento = (T, gust = 1) => { WIND.value = T; GUST.value = gust; };
// 4c. Partículas en el aire: polvo/polen al sol, motas de noche, luciérnagas, ceniza o nieve fina.
const dotTex = () => canvasTex(64, 64, (c) => { const g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); });
export function aire(scene, n = 500) {
  const r = RNG(91), base = new Float32Array(n * 4); for (let i = 0; i < n * 4; i++) base[i] = r();
  const geo = new THREE.BufferGeometry(); const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.PointsMaterial({ map: dotTex(), size: .22, sizeAttenuation: true, transparent: true, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending, toneMapped: false, fog: false });
  const pts = new THREE.Points(geo, m); pts.frustumCulled = false; pts.userData.noAO = true; scene.add(pts);
  const MODES = {
    polvo: { c: [1, .92, .7], a: .55, s: .16, box: [26, 12, 26], drift: [.25, .05, .1], bob: .3, blink: 0 },
    noche: { c: [.6, .7, 1], a: .35, s: .14, box: [30, 14, 30], drift: [.1, .02, .05], bob: .2, blink: 0 },
    luciernagas: { c: [.85, 1, .35], a: 1.0, s: .32, box: [34, 8, 34], drift: [.05, .03, .05], bob: .8, blink: 1 },
    ceniza: { c: [.75, .72, .7], a: .5, s: .18, box: [30, 18, 30], drift: [.4, -.35, .15], bob: .4, blink: 0 },
    nieve: { c: [1, 1, 1], a: .9, s: .26, box: [30, 20, 30], drift: [.2, -1.2, .1], bob: .5, blink: 0 },
  };
  return { pts, update(T, center, mode = 'polvo', amount = 1) {
    const M = MODES[mode]; if (!M || amount <= 0) { pts.visible = false; return; } pts.visible = true; m.size = M.s;
    const [bx, by, bz] = M.box, k = Math.floor(n * clamp(amount));
    for (let i = 0; i < n; i++) { const j = i * 4, o = i * 3; if (i >= k) { pos[o + 1] = -9999; continue; }
      const wrap = (v, s) => ((v % s) + s) % s - s / 2;
      pos[o] = center.x + wrap(base[j] * bx + T * M.drift[0] + Math.sin(T * .7 + base[j + 3] * 9) * M.bob, bx);
      pos[o + 1] = center.y + wrap(base[j + 1] * by + T * M.drift[1] + Math.sin(T * 1.1 + base[j] * 7) * M.bob * .6, by) + by / 2 - 1;
      pos[o + 2] = center.z + wrap(base[j + 2] * bz + T * M.drift[2] + Math.cos(T * .8 + base[j + 1] * 8) * M.bob, bz);
      const fl = M.blink ? Math.max(0, Math.sin(T * (1.3 + base[j + 3] * 2) + base[j] * 40)) ** 3 : .6 + .4 * Math.sin(T * 2 + base[j + 3] * 30);
      col[o] = M.c[0] * M.a * fl; col[o + 1] = M.c[1] * M.a * fl; col[o + 2] = M.c[2] * M.a * fl; }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
  } };
}
// 4d. Pájaros (de día) o murciélagos (de noche): bandada que cruza el cielo aleteando.
export function bandada(scene, n = 9) {
  const birds = [], m = new THREE.MeshStandardMaterial({ color: 0x2a2a32, roughness: .8, side: THREE.DoubleSide });
  for (let i = 0; i < n; i++) { const g = new THREE.Group(); scene.add(g);
    const body = new THREE.Mesh(new THREE.SphereGeometry(.28, 8, 6), m); body.scale.set(.8, .7, 1.6); g.add(body);
    const wings = [-1, 1].map(s => { const p = new THREE.Group(); p.position.x = s * .15; g.add(p); const w = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .45), m); w.rotation.x = -Math.PI / 2; w.position.x = s * .55; p.add(w); return p; });
    birds.push({ g, wings }); }
  return { update(T, center, on = true, bat = false) {
    birds.forEach((b, i) => { b.g.visible = on; if (!on) return;
      const ph = (T * .045 + i * .013) % 1, ang = .6 + (i % 3) * .05;
      const off = V(((i * 7) % 5 - 2) * 2.2, (i % 4) * 1.3 + Math.sin(T * 1.3 + i) * .4, ((i * 3) % 4 - 1.5) * 2.2);
      const x = center.x + lerp(-90, 90, ph) * Math.cos(ang) + off.x, z = center.z - 70 + lerp(-90, 90, ph) * Math.sin(ang) * .2 + off.z;
      b.g.position.set(x, center.y + 34 + off.y, z); b.g.rotation.set(0, Math.PI / 2 - ang * .2, 0);
      const fl = Math.sin(T * (bat ? 22 : 13) + i * 1.7); b.wings[0].rotation.z = fl * .9; b.wings[1].rotation.z = -fl * .9;
      b.g.scale.setScalar(bat ? .8 : 1); }); } };
}
// 4e. Cámara en mano realista: suma de ondas lentas (respiración del cámara) + temblor fino. Llamar DESPUÉS de lookAt.
export function camaraEnMano(camera, T, amt = 1) {
  const n = (f, p) => Math.sin(T * f + p) * .6 + Math.sin(T * f * 2.31 + p * 1.7) * .3 + Math.sin(T * f * 5.13 + p * 2.9) * .1;
  camera.rotateY(n(.9, 1) * .006 * amt); camera.rotateX(n(1.1, 4) * .005 * amt); camera.rotateZ(n(.7, 2) * .004 * amt);
}

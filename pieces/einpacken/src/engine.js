// Motor común de la pieza: render, post (bloom + saturación + viñeta), utilidades,
// personajes de bloques articulados (codo, rodilla, cuello) con caras expresivas.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
export { THREE };

export const W = 1080, H = 1920, FPS = 30;

// ---------- utilidades ----------
export function RNG(seed) { let s = (seed >>> 0) || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
export const easeIn = k => Math.pow(clamp(k), 3);
export const easeInOut = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
export const backOut = k => { k = clamp(k); const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
// muelle amortiguado: 0 -> 1 con rebote (entradas de objetos)
export const spring = (k, f = 3.2, d = 5.5) => k <= 0 ? 0 : 1 - Math.exp(-d * k) * Math.cos(f * Math.PI * k);
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export function canvasTex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
export const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: 0, ...o });
const geoCache = new Map();
export function rbox(w, h, d, r = 0) {
  const k = [w, h, d, r].map(v => v.toFixed(3)).join(',');
  if (!geoCache.has(k)) geoCache.set(k, r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2) * 0.999) : new THREE.BoxGeometry(w, h, d));
  return geoCache.get(k);
}
export function box(w, h, d, m, r = 0, parent = null, x = 0, y = 0, z = 0) {
  const me = new THREE.Mesh(rbox(w, h, d, r), m); me.castShadow = true; me.receiveShadow = true;
  me.position.set(x, y, z); if (parent) parent.add(me); return me;
}
export function cyl(rt, rb, h, m, seg = 24, parent = null, x = 0, y = 0, z = 0) {
  const me = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); me.castShadow = me.receiveShadow = true;
  me.position.set(x, y, z); if (parent) parent.add(me); return me;
}
export function sphere(r, m, parent = null, x = 0, y = 0, z = 0, ws = 24, hs = 16) {
  const me = new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m); me.castShadow = me.receiveShadow = true;
  me.position.set(x, y, z); if (parent) parent.add(me); return me;
}
export function rrect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
export function textPlane(w, h, pxW, pxH, draw, emissive = 0) {
  const t = canvasTex(pxW, pxH, draw);
  const m = new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: .6, emissive: emissive ? 0xffffff : 0x000000, emissiveMap: emissive ? t : null, emissiveIntensity: emissive });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.receiveShadow = true; return p;
}

// ---------- render ----------
export function makeRenderer(stage) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H);
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);
  return renderer;
}
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, sat: { value: 1.22 }, vig: { value: 0.32 }, lift: { value: 0.0 }, flash: { value: 0 }, blurAmt: { value: 0 }, dir: { value: new THREE.Vector2(1, 0) }, sepia: { value: 0 }, sharp: { value: .55 }, px: { value: new THREE.Vector2(1 / 1080, 1 / 1920) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float sat, vig, lift, flash, blurAmt, sepia, sharp; uniform vec2 dir, px; varying vec2 vUv;
  void main(){
    vec4 c = vec4(0.);
    if (blurAmt > 0.001) { for (int i=-6;i<=6;i++){ c += texture2D(tDiffuse, vUv + dir*blurAmt*float(i)/6.); } c/=13.; }
    else { c = texture2D(tDiffuse, vUv); vec3 nb = texture2D(tDiffuse, vUv + vec2(px.x, 0.)).rgb + texture2D(tDiffuse, vUv - vec2(px.x, 0.)).rgb + texture2D(tDiffuse, vUv + vec2(0., px.y)).rgb + texture2D(tDiffuse, vUv - vec2(0., px.y)).rgb; c.rgb = clamp(c.rgb + (c.rgb - nb * .25) * sharp, 0., 1.); }
    float l = dot(c.rgb, vec3(.299,.587,.114));
    c.rgb = mix(vec3(l), c.rgb, sat);
    c.rgb += lift;
    vec3 sp = vec3(dot(c.rgb, vec3(.393,.769,.189)), dot(c.rgb, vec3(.349,.686,.168)), dot(c.rgb, vec3(.272,.534,.131)));
    c.rgb = mix(c.rgb, sp*vec3(1.0,.92,.78), sepia);
    float d = distance(vUv, vec2(.5,.48));
    c.rgb *= 1. - vig*smoothstep(.35,.85,d);
    c.rgb = mix(c.rgb, vec3(1.), flash);
    gl_FragColor = c; }`
};
export function makeComposer(renderer, scene, camera) {
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: +(new URLSearchParams(location.search).get('ms') ?? 0) }));
  const rp = new RenderPass(scene, camera); composer.addPass(rp);
  const ao = new GTAOPass(scene, camera, W, H); ao.output = GTAOPass.OUTPUT.Default; ao.blendIntensity = 1.0; ao.updateGtaoMaterial({ radius: 1.6, distanceExponent: 1.4, thickness: 1.2, scale: 1.2, samples: 12 }); ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 }); composer.addPass(ao);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.45, 0.6, 0.78); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  if (new URLSearchParams(location.search).get('smaa') !== '0' && +(new URLSearchParams(location.search).get('ms') ?? 0) === 0) composer.addPass(new SMAAPass(W, H));
  const grade = new ShaderPass(GradeShader); composer.addPass(grade);
  return { composer, bloom, grade, rp, ao };
}

// ---------- caras ----------
// expr: { eyes: 'open'|'wide'|'half'|'closed'|'squint'|'happy', look:[x,y], brows: angle(+ enfado), browY,
//         mouth: 'smile'|'grin'|'flat'|'frown'|'o'|'yawn'|'shout'|'smirk'|'teeth', bags: 0..1, blush, freckles }
const faceCache = new Map();
export const CUSTOM_FACES = {};
export function faceTexture(spec) {
  const key = JSON.stringify(spec);
  if (faceCache.has(key)) return faceCache.get(key);
  const t = canvasTex(512, 512, (c) => (spec.custom && CUSTOM_FACES[spec.custom] ? CUSTOM_FACES[spec.custom](c, spec) : drawFace(c, spec)));
  faceCache.set(key, t); return t;
}
function drawFace(c, s) {
  const skin = s.skin || '#f6cfb3', ink = '#2a1d1a';
  c.clearRect(0, 0, 512, 512);
  const eyeY = 220 + (s.eyeY || 0), ex = [168, 344], lk = s.look || [0, 0];
  const eyes = s.eyes || 'open';
  // ojeras (Augenringe): arcos violáceos bajo los ojos
  if (s.bags) {
    for (const x of ex) {
      c.strokeStyle = `rgba(90,50,120,${0.35 + 0.4 * s.bags})`; c.lineCap = 'round';
      for (let i = 0; i < 2 + Math.round(s.bags * 2); i++) { c.lineWidth = 9 - i * 1.5; c.beginPath(); c.ellipse(x, eyeY + 44 + i * 16, 50 - i * 4, 18, 0, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }
      c.fillStyle = `rgba(110,70,140,${0.15 + 0.2 * s.bags})`; c.beginPath(); c.ellipse(x, eyeY + 50, 50, 30, 0, 0, Math.PI); c.fill();
    }
  }
  for (const x of ex) {
    if (eyes === 'closed' || eyes === 'happy') {
      c.strokeStyle = ink; c.lineWidth = 13; c.lineCap = 'round'; c.beginPath();
      if (eyes === 'happy') c.arc(x, eyeY + 18, 34, Math.PI * 1.15, Math.PI * 1.85); else c.arc(x, eyeY - 8, 36, Math.PI * 0.15, Math.PI * 0.85);
      c.stroke(); continue;
    }
    const rw = eyes === 'wide' ? 52 : 44, rh = eyes === 'wide' ? 60 : 52;
    c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x, eyeY, rw, rh, 0, 0, 7); c.fill();
    c.lineWidth = 6; c.strokeStyle = ink; c.stroke();
    const ir = eyes === 'wide' ? 24 : 28;
    c.fillStyle = s.iris || '#5a3a22'; c.beginPath(); c.arc(x + lk[0] * 16, eyeY + 6 + lk[1] * 14, ir, 0, 7); c.fill();
    c.fillStyle = '#120c0a'; c.beginPath(); c.arc(x + lk[0] * 16, eyeY + 6 + lk[1] * 14, ir * 0.55, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x + lk[0] * 16 + 10, eyeY - 6 + lk[1] * 14, 9, 0, 7); c.fill();
    c.beginPath(); c.arc(x + lk[0] * 16 - 8, eyeY + 16 + lk[1] * 14, 4, 0, 7); c.fill();
    // párpado superior (cansancio / sospecha)
    const lid = eyes === 'half' ? 0.55 : eyes === 'squint' ? 0.42 : (s.lid || 0);
    if (lid > 0) {
      c.save(); c.beginPath(); c.ellipse(x, eyeY, rw + 2, rh + 2, 0, 0, 7); c.clip();
      c.fillStyle = skin; c.fillRect(x - rw - 4, eyeY - rh - 4, rw * 2 + 8, (rh * 2 + 8) * lid);
      c.strokeStyle = ink; c.lineWidth = 9; c.beginPath(); c.moveTo(x - rw, eyeY - rh + (rh * 2 + 8) * lid); c.lineTo(x + rw, eyeY - rh + (rh * 2 + 8) * lid); c.stroke();
      c.restore();
    }
    if (eyes === 'squint') { c.strokeStyle = ink; c.lineWidth = 7; c.beginPath(); c.moveTo(x - rw, eyeY + rh * 0.55); c.lineTo(x + rw, eyeY + rh * 0.45); c.stroke(); }
  }
  // cejas
  const ba = s.brows || 0, by = eyeY - 92 + (s.browY || 0);
  c.strokeStyle = s.browColor || '#3a2416'; c.lineWidth = 18; c.lineCap = 'round';
  // ba > 0: enfado (extremo interior abajo); ba < 0: tristeza/preocupación (interior arriba)
  for (const [x, inner] of [[ex[0], 1], [ex[1], -1]]) {
    const xi = x + inner * 42, xo = x - inner * 42;
    c.beginPath(); c.moveTo(xo, by - ba * 16); c.quadraticCurveTo(x, by - 16 - Math.abs(ba) * 4, xi, by + ba * 18); c.stroke();
  }
  // nariz pequeña
  c.fillStyle = 'rgba(160,80,60,.35)'; c.beginPath(); c.ellipse(256, eyeY + 92, 20, 12, 0, 0, 7); c.fill();
  // pecas / rubor
  if (s.freckles) { c.fillStyle = 'rgba(150,80,50,.55)'; for (const [x, y] of [[120, 330], [146, 344], [104, 352], [392, 330], [366, 344], [408, 352]]) { c.beginPath(); c.arc(x, y - 14, 6, 0, 7); c.fill(); } }
  if (s.blush) { c.fillStyle = `rgba(255,110,120,${0.25 * s.blush + 0.1})`; c.beginPath(); c.ellipse(110, 330, 42, 22, 0, 0, 7); c.ellipse(402, 330, 42, 22, 0, 0, 7); c.fill(); }
  // boca
  const my = 392 + (s.mouthY || 0), m = s.mouth || 'smile';
  c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = ink; c.lineWidth = 13;
  if (m === 'smile') { c.beginPath(); c.arc(256, my - 40, 62, 0.22 * Math.PI, 0.78 * Math.PI); c.stroke(); }
  else if (m === 'smirk') { c.beginPath(); c.moveTo(196, my + 6); c.quadraticCurveTo(268, my + 14, 318, my - 16); c.stroke(); }
  else if (m === 'flat') { c.beginPath(); c.moveTo(206, my); c.lineTo(306, my); c.stroke(); }
  else if (m === 'frown') { c.beginPath(); c.arc(256, my + 44, 54, 1.22 * Math.PI, 1.78 * Math.PI); c.stroke(); }
  else {
    // bocas abiertas
    const shapes = { grin: [86, 44, .05], teeth: [90, 34, 0], o: [36, 44, 0], yawn: [70, 92, 0], shout: [74, 62, 0] }[m] || [60, 40, 0];
    const [rx, ry] = shapes;
    c.fillStyle = '#5a1620';
    c.beginPath();
    if (m === 'grin') { c.moveTo(256 - rx, my - 20); c.quadraticCurveTo(256, my - 6, 256 + rx, my - 20); c.quadraticCurveTo(256, my + ry * 2, 256 - rx, my - 20); }
    else c.ellipse(256, my, rx, ry, 0, 0, 7);
    c.fill(); c.lineWidth = 10; c.stroke();
    c.save(); c.clip();
    if (m === 'grin' || m === 'teeth' || m === 'shout') { c.fillStyle = '#fff'; c.fillRect(256 - rx, my - ry - 30 + (m === 'grin' ? 10 : 0), rx * 2, m === 'teeth' ? ry * 2 + 10 : 34); }
    c.fillStyle = '#ff6f7d'; c.beginPath(); c.ellipse(256, my + ry * 0.9, rx * 0.7, ry * 0.55, 0, 0, 7); c.fill();
    c.restore();
  }
  if (s.soot) { c.fillStyle = 'rgba(40,30,30,.45)'; for (const [x, y, r] of [[110, 300, 46], [380, 120, 40], [300, 420, 34], [180, 80, 30]]) { c.beginPath(); c.ellipse(x, y, r, r * .6, .4, 0, 7); c.fill(); } }
  if (s.blood) { c.fillStyle = '#b3121f'; c.beginPath(); c.moveTo(150, 40); c.lineTo(205, 70); c.lineTo(160, 95); c.fill();
    for (const [x, y0, l] of [[150, 270, 150], [178, 268, 110], [128, 262, 90], [196, 60, 120]]) { c.fillRect(x - 7, y0, 14, l); c.beginPath(); c.arc(x, y0 + l, 10, 0, 7); c.fill(); } }
  if (s.tears) { c.fillStyle = 'rgba(120,200,255,.85)'; for (const x of [150, 362]) { c.fillRect(x - 6, 270, 12, 70); c.beginPath(); c.arc(x, 342, 9, 0, 7); c.fill(); } }
  if (s.sweat) { c.fillStyle = 'rgba(120,200,255,.9)'; c.beginPath(); c.moveTo(430, 120); c.quadraticCurveTo(452, 170, 430, 182); c.quadraticCurveTo(408, 170, 430, 120); c.fill(); }
  if (s.veins) { c.strokeStyle = '#d62f3a'; c.lineWidth = 8; for (const [x, y] of [[420, 90]]) { c.beginPath(); c.moveTo(x - 20, y); c.lineTo(x, y + 10); c.lineTo(x - 6, y + 28); c.moveTo(x + 20, y); c.lineTo(x, y + 10); c.stroke(); } }
}

// ---------- personaje articulado ----------
// spec: colores y accesorios. Devuelve un objeto con huesos (grupos) y helpers de pose.
export function character(scene, spec) {
  const S = spec, R = 0.13;
  const skinM = mat(S.skin || 0xf6cfb3, { roughness: .5 });
  const shirtM = mat(S.shirtMap ? 0xffffff : S.shirt, { roughness: .7, map: S.shirtMap || null }), shirt2M = mat(S.shirtMap && S.shirt2 == null ? 0xffffff : (S.shirt2 ?? S.shirt), { roughness: .7, map: S.shirt2 == null ? (S.shirtMap || null) : null });
  const pantsM = mat(S.pants, { roughness: .75 }), shoeM = mat(S.shoes ?? 0xf3f3f3, { roughness: .5 }), soleM = mat(S.sole ?? 0x30303a);
  const hairM = mat(S.hair ?? 0x4a2c1a, { roughness: .65 });
  const root = new THREE.Group(); scene.add(root);
  const hips = new THREE.Group(); hips.position.y = 2.05; root.add(hips);
  const spine = new THREE.Group(); hips.add(spine);
  // torso con detalles de ropa
  const torso = box(2, 2.05, 1.05, shirtM, R, spine, 0, 1.02, 0);
  (S.torsoDetail || (() => {}))(spine, { box, mat, shirtM, shirt2M, skinM, cyl, sphere });
  if (!S.noBelt) box(2.04, 0.22, 1.08, mat(S.belt ?? 0x2b2018), 0.05, spine, 0, 0.08, 0);
  if (S.skirt) {   // falda (Dirndl): cuelga de la cadera, con delantal
    const sk = new THREE.Group(); hips.add(sk);
    box(2.3, 1.5, 1.35, mat(S.skirt, { roughness: .8 }), 0.25, sk, 0, -0.62, 0);
    box(2.42, 0.25, 1.45, mat(S.skirt, { roughness: .8 }), 0.12, sk, 0, -1.3, 0);
    if (S.apron) box(1.3, 1.45, 0.08, mat(S.apron, { roughness: .9 }), 0.04, sk, 0, -0.55, 0.72);
    if (S.apronBow) box(0.5, 0.3, 0.1, mat(S.apronBow), 0.06, sk, -0.6, 0.0, 0.74);
  }
  // cuello y cabeza
  const neck = new THREE.Group(); neck.position.y = 2.05; spine.add(neck);
  const head = new THREE.Group(); head.position.y = 0.05; neck.add(head);
  const hs = S.headScale || 1;
  box(1.32 * hs, 1.25 * hs, 1.2 * hs, skinM, 0.2, head, 0, 0.66 * hs, 0);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTexture({ skin: S.skinCss, ...(S.face || {}) }), transparent: true, roughness: .55, polygonOffset: true, polygonOffsetFactor: -2 });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.16 * hs, 1.16 * hs), faceMat); face.position.set(0, 0.64 * hs, 0.603 * hs); head.add(face);
  // orejas
  for (const s of [-1, 1]) box(0.14, 0.32, 0.22, skinM, 0.06, head, s * 0.7 * hs, 0.62 * hs, 0);
  (S.hairBuild || defaultHair)(head, hairM, hs, { box, mat, cyl, sphere });
  // brazos: hombro -> codo -> mano
  const arm = (s) => {
    const sh = new THREE.Group(); sh.position.set(s * 1.47, 1.82, 0); spine.add(sh);
    box(0.92, 1.12, 0.95, shirtM, R, sh, 0, -0.5, 0);
    if (S.cuffs) box(0.96, 0.18, 0.99, mat(S.cuffs), 0.05, sh, 0, -0.98, 0);
    const el = new THREE.Group(); el.position.set(0, -1.02, 0); sh.add(el);
    box(0.88, 0.78, 0.9, S.sleeveShort ? skinM : shirt2M, R, el, 0, -0.38, 0);
    const hand = new THREE.Group(); hand.position.set(0, -0.82, 0); el.add(hand);
    box(0.8, 0.52, 0.82, skinM, 0.16, hand, 0, -0.2, 0.02);
    box(0.24, 0.3, 0.26, skinM, 0.08, hand, -s * 0.38, -0.12, 0.26);   // pulgar
    return { sh, el, hand };
  };
  const leg = (s) => {
    const hp = new THREE.Group(); hp.position.set(s * 0.5, 0, 0); hips.add(hp);
    box(0.97, 1.05, 1.0, pantsM, R, hp, 0, -0.5, 0);
    const kn = new THREE.Group(); kn.position.set(0, -1.0, 0); hp.add(kn);
    box(0.94, 0.78, 0.97, S.shorts ? (S.socks ? mat(S.socks, { roughness: .9 }) : skinM) : pantsM, R, kn, 0, -0.38, 0);
    if (S.shorts && S.socks) box(0.98, 0.16, 1.0, mat(S.socks, { roughness: .9 }), 0.05, kn, 0, -0.05, 0);
    if (S.socks) box(0.96, 0.22, 0.99, mat(S.socks), 0.05, kn, 0, -0.7, 0);
    const shoe = box(1.0, 0.36, 1.3, shoeM, 0.14, kn, 0, -0.86, 0.14);
    box(1.02, 0.1, 1.33, soleM, 0.04, kn, 0, -1.0, 0.14);
    box(0.5, 0.04, 0.3, mat(0xffffff), 0.01, kn, 0, -0.68, 0.62);   // cordones
    return { hp, kn, shoe };
  };
  const aL = arm(-1), aR = arm(1), lL = leg(-1), lR = leg(1);
  root.scale.setScalar(S.scale || 1);
  const ch = { root, hips, spine, neck, head, face, faceMat, aL, aR, lL, lR, spec: S, props: {}, seed: S.seed || 1 };
  ch.setFace = (f) => { const t = faceTexture({ skin: S.skinCss, ...(S.face || {}), ...f }); if (faceMat.map !== t) { faceMat.map = t; faceMat.needsUpdate = true; } };
  ch.root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return ch;
}
function defaultHair(head, hairM, hs) {
  box(1.4 * hs, 0.42 * hs, 1.3 * hs, hairM, 0.16, head, 0, 1.22 * hs, -0.02);
  box(1.4 * hs, 0.9 * hs, 0.32 * hs, hairM, 0.12, head, 0, 0.92 * hs, -0.5 * hs);
}

// ---------- poses ----------
const P0 = { lean: 0, twist: 0, headX: 0, headY: 0, headZ: 0,
  aLx: 0, aLz: 0, aLe: 0, aRx: 0, aRz: 0, aRe: 0, lLx: 0, lLk: 0, lRx: 0, lRk: 0, hipY: 2.05, crouch: 0, sx: 0 };
export function applyPose(ch, p) {
  p = { ...P0, ...p };
  ch.hips.position.y = p.hipY - p.crouch; ch.hips.position.x = p.sx;
  ch.spine.rotation.set(p.lean, p.twist, 0);
  ch.neck.rotation.set(p.headX, p.headY, p.headZ);
  ch.aL.sh.rotation.set(-p.aLx, 0, -p.aLz); ch.aL.el.rotation.set(-p.aLe, 0, 0);
  ch.aR.sh.rotation.set(-p.aRx, 0, p.aRz); ch.aR.el.rotation.set(-p.aRe, 0, 0);
  ch.lL.hp.rotation.set(-p.lLx, 0, 0); ch.lL.kn.rotation.set(p.lLk, 0, 0);
  ch.lR.hp.rotation.set(-p.lRx, 0, 0); ch.lR.kn.rotation.set(p.lRk, 0, 0);
}
export const mixPose = (a, b, k) => { const o = {}; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) o[key] = lerp(a[key] ?? P0[key], b[key] ?? P0[key], k); return o; };
// ciclos
export function walkPose(t, speed = 1, tired = 0) {
  const ph = t * 2.0 * speed * Math.PI * 2, s = Math.sin(ph), c = Math.cos(ph);
  const sw = 0.62 - tired * 0.3;
  return { lLx: s * sw, lRx: -s * sw, lLk: Math.max(0, -c) * 0.9 * sw + 0.05, lRk: Math.max(0, c) * 0.9 * sw + 0.05,
    aLx: -s * sw * 0.85, aRx: s * sw * 0.85, aLe: 0.25 + Math.max(0, s) * 0.3, aRe: 0.25 + Math.max(0, -s) * 0.3,
    aLz: 0.06, aRz: 0.06, hipY: 2.05 - Math.abs(s) * 0.05 + Math.abs(c) * 0.08, lean: 0.06 + tired * 0.22, headX: tired * 0.35, twist: s * 0.08 };
}
export function runPose(t, speed = 1) {
  const ph = t * 3.2 * speed * Math.PI * 2, s = Math.sin(ph), c = Math.cos(ph);
  return { lLx: s * 1.0, lRx: -s * 1.0, lLk: Math.max(0, -c) * 1.6 + .1, lRk: Math.max(0, c) * 1.6 + .1,
    aLx: -s * 1.1, aRx: s * 1.1, aLe: 1.3, aRe: 1.3, aLz: .1, aRz: .1, hipY: 2.05 + Math.abs(c) * 0.3 - 0.15, lean: 0.28, twist: s * 0.12 };
}
export function idlePose(t, ph = 0) {
  const b = Math.sin((t + ph) * 2.0);
  return { aLz: 0.07 + b * 0.015, aRz: 0.07 + b * 0.015, aLe: 0.12, aRe: 0.12, hipY: 2.05 + b * 0.015, headY: Math.sin((t + ph) * 0.8) * 0.1, headX: b * 0.02 };
}

// tejido a cuadros (camisas de Trachten) y otros estampados
export function checkTex(a, b, n = 6, line = null) {
  return canvasTex(128, 128, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; const s = w / n;
    for (let i = 0; i < n; i++) { c.globalAlpha = .55; c.fillRect(i * s, 0, s / 2, h); c.fillRect(0, i * s, w, s / 2); }
    c.globalAlpha = 1; if (line) { c.strokeStyle = line; c.lineWidth = 1.5; for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(i * s + s / 4, 0); c.lineTo(i * s + s / 4, h); c.stroke(); } } }, true);
}
// parpadeo automático: devuelve true unos fotogramas cada ~2,7 s
export const blinking = (t, seed = 1) => { const p = 2.3 + (seed % 5) * 0.31, x = (t + seed * 0.77) % p; return x < 0.1; };
// labios: abre/cierra según las palabras habladas en [t0, t1]
export function lip(t, words) { for (const w of words) if (t >= w[0] && t < w[1]) { const k = (t - w[0]) / Math.max(0.08, w[1] - w[0]); const syl = Math.max(1, Math.round((w[1] - w[0]) / 0.16)); return Math.sin(k * syl * Math.PI) > 0.25 ? 'shout' : 'o'; } return null; }
// contorno fino (casco invertido con grosor constante en píxeles): personajes, objetos y entorno se recortan con una línea oscura mínima
const OUT = new Map();
export function outline(root, px = 2, col = 0x14101a) { const key = px + ':' + col; let m = OUT.get(key);
  if (!m) { m = new THREE.MeshBasicMaterial({ color: col, side: THREE.BackSide, fog: false }); m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>\n vec3 nV_ = normalize(normalMatrix * normal); gl_Position.xy += nV_.xy * ${px.toFixed(2)} * gl_Position.w * vec2(2.0 / 1080.0, 2.0 / 1920.0);`); }; OUT.set(key, m); }
  const L = []; root.traverse(o => { if (o.isMesh && !o.userData.noOutline && !o.userData.isOutline && o.material && !o.material.transparent && !(o.material.isMeshBasicMaterial) && o.geometry.type !== 'PlaneGeometry' && o.geometry.type !== 'CircleGeometry' && o.geometry.type !== 'RingGeometry') L.push(o); });
  for (const o of L) { const h = new THREE.Mesh(o.geometry, m); h.userData.isOutline = true; h.castShadow = false; h.receiveShadow = false; o.add(h); } return root; }

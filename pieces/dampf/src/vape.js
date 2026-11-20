// DAMPF — el vape (modelo detallado), el humo (nubes de partículas suaves, deterministas: todo depende solo de T),
// el Dampfmesser de muñeca y la escala de dinero por segundos de calada.
import { THREE, mat, box, cyl, sphere, canvasTex, RNG, clamp, lerp, easeOut, easeInOut, V } from './engine.js';
import { FONT } from './props.js';

// ---------- dinero por segundos de calada (1 s = 10 €, 5 s = 500 €, 10 s = 1 Mio, 20 s = 1 Mrd, 52 s = 800 Bio) ----------
const KP = [[0, 0], [1, 10], [5, 500], [10, 1e6], [20, 1e9], [52, 8e14]];
export function money(s) { if (s <= 0) return 0; if (s < 1) return 10 * s;
  for (let i = 1; i < KP.length - 1; i++) { const [a, va] = KP[i], [b, vb] = KP[i + 1]; if (s <= b) return Math.exp(lerp(Math.log(va), Math.log(vb), (s - a) / (b - a))); }
  return KP[KP.length - 1][1]; }
export const euro = v => Math.round(v).toLocaleString('de-DE') + ' €';
export const secs = s => s.toFixed(1).replace('.', ',') + ' s';

// ---------- el vape ----------
// Pod de bolsillo: cuerpo redondeado con degradado, boquilla oscura translúcida, ventana del líquido, LED en el frontal,
// rejillas de aire, botón. Mide ~1,5 de alto (una mano mide 0,8). El origen está en la base; la boquilla, arriba (+y).
const VCOL = [[0xff3a8a, 0x8a3aff], [0x2ab8ff, 0x2a4aff], [0x3ad86a, 0x0a8a8a], [0xffb020, 0xff3a3a], [0xb0b8c8, 0x3a3e4a], [0xff7ad0, 0xffd23f], [0x1a1a22, 0x4a4e5a], [0xffffff, 0x8ad8ff]];
const hex = c => '#' + c.toString(16).padStart(6, '0');
function bodyTex(a, b, gold) { return canvasTex(128, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, w * .4, h); g.addColorStop(0, hex(a)); g.addColorStop(1, hex(b)); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.globalAlpha = .18; c.fillStyle = '#fff'; c.fillRect(w * .12, 0, w * .12, h); c.globalAlpha = 1;
  if (gold) { c.strokeStyle = 'rgba(120,70,0,.55)'; c.lineWidth = 3; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(w / 2, h * .62, 10 + i * 9, 0, 6.283); c.stroke(); } } }); }
export function vape(parent, i = 0, o = {}) { const g = new THREE.Group(); parent.add(g); const gold = !!o.gold;
  const [a, b] = gold ? [0xfff0a0, 0xd89a10] : VCOL[i % VCOL.length];
  const bm = gold ? mat(0xffffff, { map: bodyTex(a, b, true), metalness: .85, roughness: .18, emissive: 0x6a4a00, emissiveIntensity: .25 }) : mat(0xffffff, { map: bodyTex(a, b), metalness: .35, roughness: .28 });
  const body = box(.5, 1.05, .24, bm, .1, g, 0, .52, 0);
  // ventana del líquido (se ve el color) y el líquido
  box(.32, .34, .02, mat(0x1a1a22, { roughness: .1, metalness: .2, transparent: true, opacity: .55 }), .03, g, 0, .86, .125);
  const liq = box(.26, .26, .02, mat(gold ? 0xffe060 : b, { emissive: gold ? 0xffc020 : b, emissiveIntensity: .45, roughness: .1 }), .02, g, 0, .84, .132);
  // boquilla oscura (se estrecha)
  const mp = new THREE.Mesh(new THREE.CylinderGeometry(.11, .2, .38, 4, 1), mat(0x15151c, { roughness: .15, metalness: .3 })); mp.rotation.y = Math.PI / 4; mp.scale.set(1.2, 1, .55); mp.position.set(0, 1.23, 0); mp.castShadow = true; g.add(mp);
  box(.2, .04, .07, mat(0x050508), .02, g, 0, 1.42, 0);
  // LED, botón y rejillas
  const led = box(.22, .045, .02, new THREE.MeshBasicMaterial({ color: new THREE.Color(gold ? 0xffd040 : 0x7ae0ff).multiplyScalar(1.2), toneMapped: false }), .02, g, 0, .2, .126);
  box(.12, .12, .04, mat(0x2a2a30, { metalness: .6, roughness: .3 }), .03, g, .27, .55, 0);
  for (let k = 0; k < 3; k++) box(.05, .14, .02, mat(0x0a0a10), .01, g, -.12 + k * .12, .06, .126);
  if (gold) { const gem = sphere(.07, mat(0xff3a3a, { emissive: 0xff2020, emissiveIntensity: .8, roughness: .1 }), g, 0, .5, .13, 10, 8); gem.scale.z = .5; }
  g.userData = { led, liq, setGlow: k => { led.material.color.set(gold ? 0xffd040 : 0x7ae0ff).multiplyScalar(.4 + k * 3); } };
  return g; }

// ---------- humo ----------
// Textura de nube: varias manchas suaves superpuestas (sin bordes duros).
let SMOKE_TEX = null;
function smokeTex() { if (SMOKE_TEX) return SMOKE_TEX; SMOKE_TEX = canvasTex(256, 256, (c, w, h) => { const r = RNG(77); c.clearRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) { const x = w / 2 + (r() - .5) * w * .42, y = h / 2 + (r() - .5) * h * .42, rad = w * (.12 + r() * .2); const g = c.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, 'rgba(255,255,255,.34)'); g.addColorStop(.55, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, rad, 0, 6.283); c.fill(); }
  const g = c.createRadialGradient(w / 2, h / 2, w * .2, w / 2, h / 2, w * .5); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); c.globalCompositeOperation = 'destination-out'; c.fillStyle = g; c.fillRect(0, 0, w, h); });
  SMOKE_TEX.colorSpace = THREE.SRGBColorSpace; return SMOKE_TEX; }
// Reserva de sprites; cada fotograma se reparten entre las bocanadas que pidan los planos.
export function smokePool(scene, n = 900) { const tex = smokeTex(); const L = [];
  for (let i = 0; i < n; i++) { const m = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, color: 0xffffff, fog: true }); const s = new THREE.Sprite(m); s.visible = false; s.renderOrder = 5; scene.add(s); L.push(s); }
  let used = 0;
  const P = { list: L, tint: new THREE.Color(1, 1, 1),
    reset() { for (let i = 0; i < used; i++) L[i].visible = false; used = 0; },
    take() { if (used >= L.length) return null; const s = L[used++]; s.visible = true; return s; },
    // bocanada: sale de `o` en la dirección `dir` entre T0 y T0 + dur; las partículas viven `life` s.
    // pow = fuerza del chorro, size = tamaño, dens = opacidad, n = partículas, up = flotación
    puff(o, dir, T, T0, dur, x = {}) { const n = x.n ?? 46, life = x.life ?? 3.2, pow = x.pow ?? 5, size = x.size ?? 1, dens = x.dens ?? .9, up = x.up ?? .55, spread = x.spread ?? .32, seed = x.seed ?? 1;
      const d = dir.clone().normalize(), side = V(-d.z, 0, d.x).normalize(), upv = V(0, 1, 0);
      for (let i = 0; i < n; i++) { const r = RNG(seed * 131 + i * 7 + 3); const te = T0 + dur * (i + r() * .6) / n, a = T - te; if (a < 0 || a > life) continue;
        const s = this.take(); if (!s) return; const k = a / life;
        const p0 = 1 - (te - T0) / Math.max(dur, .001) * .55;            // el chorro pierde fuerza al final de la bocanada
        const v = pow * p0 * (.75 + r() * .5), drag = 2.6, dist = v / drag * (1 - Math.exp(-drag * a));
        const sx = (r() - .5) * 2 * spread, sy = (r() - .5) * 2 * spread;
        const curl = Math.sin(a * 2.1 + i) * .35 * a, curl2 = Math.cos(a * 1.7 + i * 1.3) * .3 * a;
        s.position.copy(o).addScaledVector(d, dist).addScaledVector(side, dist * sx + curl).addScaledVector(upv, dist * sy + up * Math.pow(a, 1.25) + curl2);
        const sc = size * (.28 + 1.5 * (1 - Math.exp(-a * 1.6)) + a * .35) * (.8 + r() * .45); s.scale.set(sc, sc, 1);
        s.material.rotation = r() * 6.283 + a * (r() - .5) * 1.2;
        s.material.opacity = dens * clamp(a / .07) * Math.pow(1 - k, 1.6) * (.55 + r() * .45);
        s.material.color.copy(this.tint).multiplyScalar(.92 + r() * .08); } },
    // nube quieta (niebla, nubes encima de la gente): bolas que respiran despacio
    haze(c, T, n = 30, rx = 10, ry = 3, rz = 10, size = 5, dens = .5, seed = 5) { for (let i = 0; i < n; i++) { const r = RNG(seed * 97 + i * 5); const s = this.take(); if (!s) return;
      s.position.set(c.x + (r() - .5) * 2 * rx + Math.sin(T * .3 + i) * .8, c.y + (r() - .5) * 2 * ry + Math.sin(T * .4 + i * 2) * .3, c.z + (r() - .5) * 2 * rz);
      const sc = size * (.7 + r() * .6) * (1 + Math.sin(T * .5 + i) * .06); s.scale.set(sc, sc, 1); s.material.rotation = r() * 6.283 + T * .05 * (r() - .5);
      s.material.opacity = dens * (.5 + r() * .5); s.material.color.copy(this.tint); } } };
  return P; }

// ---------- la calada (ciclo completo) ----------
// fases desde t0: subir la mano (up), calada (inh), bajar (down), echar el humo (exh). Devuelve la pose del brazo derecho,
// la cabeza y la boca, y en qué momento está (para el LED y el humo).
export function vapePhase(lt, inh = 1, o = {}) { const up = o.up ?? .3, down = o.down ?? .28, exh = o.exh ?? 1.4;
  const t1 = up, t2 = t1 + inh, t3 = t2 + down, t4 = t3 + exh;
  let raise, ph, mouth, eyes;
  if (lt < t1) { raise = easeInOut(lt / up); ph = 'up'; mouth = 'flat'; }
  else if (lt < t2) { raise = 1; ph = 'inh'; mouth = 'flat'; eyes = 'half'; }
  else if (lt < t3) { raise = 1 - easeInOut((lt - t2) / down) * .75; ph = 'hold'; mouth = 'flat'; }
  else if (lt < t4) { raise = .25 - easeOut((lt - t3) / exh) * .25; ph = 'exh'; mouth = 'o'; eyes = 'half'; }
  else { raise = 0; ph = 'done'; mouth = 'smile'; }
  if (o.loop && lt >= t4) return vapePhase((lt - t4) % (t4 + (o.gap ?? .4)), inh, o);
  return { raise, ph, mouth, eyes, t1, t2, t3, t4, inhK: clamp((lt - t1) / inh), exhK: clamp((lt - t3) / exh) }; }
// pose del brazo derecho con el vape (IK resuelta con fit.mjs: la boquilla toca la boca, la mano no entra en la cabeza):
// abajo (raise 0, vape delante del pecho) → en la boca (raise 1). aRy = giro del hombro (se aplica a mano tras applyPose).
const LOW = [.61, -.484, -.199, .847], HIGH = [.499, .919, -.829, 1.19];
export const armVape = (raise) => { const r = raise, q = LOW.map((v, i) => lerp(v, HIGH[i], r)); return { aRx: q[0], aRz: q[1], aRy: q[2], aRe: q[3] }; };
// el vape en la mano: sale de la cara delantera del puño (no atraviesa la mano); pulgar encima y dedos debajo lo sujetan
export function holdVape(ch, v) { const hand = ch.aR.hand; hand.add(v); v.position.set(0, -.25, .47); v.rotation.set(1.54, 0, 0); v.scale.setScalar(.95);
  const skin = mat(ch.spec.skin ?? 0xf2c4a0, { roughness: .5 }); const g = new THREE.Group(); hand.add(g); g.visible = false;
  box(.34, .2, .4, skin, .08, g, -.02, -.02, .62);            // pulgar por encima del vape
  box(.62, .18, .3, skin, .07, g, 0, -.5, .6);                // dedos por debajo
  box(.6, .16, .26, skin, .06, g, 0, -.5, .86);
  v.userData.grip = g; return v; }
// ---------- Dampfmesser ----------
// en la muñeca: pulsera negra con pantallita (la pantalla se dibuja por plano con setText)
export function wristMeter(arm) { const g = new THREE.Group(); arm.el.add(g); g.position.set(0, -.62, 0);
  box(.98, .2, 1.0, mat(0x1a1a22, { roughness: .4 }), .06, g, 0, 0, 0);
  let txt = ''; const t = canvasTex(256, 128, () => {}); const scr = new THREE.Mesh(new THREE.PlaneGeometry(.66, .33), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); scr.position.set(0, 0, .515); g.add(scr);
  box(.76, .42, .06, mat(0x2a2e3a, { metalness: .5, roughness: .3 }), .05, g, 0, 0, .48);
  g.userData.set = (a, b, col = '#7aff9a') => { const k = a + '|' + b + col; if (k === txt) return; txt = k; const c = t.image.getContext('2d'); c.fillStyle = '#06100a'; c.fillRect(0, 0, 256, 128);
    c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 50px ${FONT}`; c.fillText(a, 128, 40); c.font = `700 34px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(b, 128, 96); t.needsUpdate = true; };
  g.userData.set('0,0 s', '0 €'); return g; }
// HUD de la parte de arriba de la pantalla (2D): «DAMPFMESSER» con segundos y euros
export function drawMeterHUD(c, x, y, sc, s, eur, col = '#7aff9a', alpha = 1) { c.save(); c.globalAlpha = alpha; c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = 'rgba(10,14,24,.88)'; c.strokeStyle = '#ffffff'; c.lineWidth = 5; c.beginPath(); c.roundRect(-330, -78, 660, 156, 30); c.fill(); c.stroke();
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 30px ${FONT}`; c.fillStyle = '#9aa4c0'; c.fillText('DAMPFMESSER', 0, -48);
  c.font = `700 62px ${FONT}`; c.textAlign = 'left'; c.fillStyle = col; c.fillText(s, -300, 18);
  c.textAlign = 'right'; c.fillStyle = '#ffffff'; const w = c.measureText(eur).width; if (w > 380) { c.save(); c.translate(300, 18); c.scale(380 / w, 1); c.fillText(eur, 0, 0); c.restore(); } else c.fillText(eur, 300, 18);
  c.restore(); }

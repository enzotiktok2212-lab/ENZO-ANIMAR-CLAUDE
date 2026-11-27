// EBBE — mundo propio: Möwensand (pueblo del Mar del Norte sobre un acantilado), el fondo marino al descubierto, el mar y la ola.
// Coordenadas del set principal (x = 0): acantilado en z ≈ 0 (cara hacia +z), meseta del pueblo a y = CH para z < 0, fondo marino a y = 0 para z > 0.
import { THREE, mat, box, cyl, sphere, textPlane, canvasTex, RNG, V, lerp, clamp } from './engine.js';
import { FONT } from './sets.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
// une la geometría estática de un grupo por material (miles de mallas -> unas decenas de llamadas de dibujo). Los subárboles con userData.keep no se tocan.
export function bake(root) { root.updateMatrixWorld(true); const inv = root.matrixWorld.clone().invert(), groups = new Map(), rm = [];
  const sig = m => [m.type, m.color?.getHex(), m.map?.uuid, m.normalMap?.uuid, m.roughnessMap?.uuid, m.roughness, m.metalness, m.emissive?.getHex(), m.emissiveIntensity, m.vertexColors, m.side, m.transparent, m.opacity, m.envMapIntensity].join('|');
  const walk = o => { if (o.userData.keep) return; for (const c of o.children) walk(c);
    if (o.isMesh && !o.isInstancedMesh && !o.isSkinnedMesh && !o.userData.isOutline && o.material && !Array.isArray(o.material) && o.visible) { const k = sig(o.material); if (!groups.has(k)) groups.set(k, { m: o.material, list: [] }); groups.get(k).list.push(o); } };
  walk(root);
  for (const { m, list } of groups.values()) { if (list.length < 2) continue; const geos = [];
    for (const o of list) { let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); for (const a of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', ...(m.vertexColors ? ['color'] : [])].includes(a)) g.deleteAttribute(a);
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); if (m.vertexColors && !g.attributes.color) continue; if (!g.attributes.normal) g.computeVertexNormals();
      g.applyMatrix4(inv.clone().multiply(o.matrixWorld)); geos.push(g); rm.push(o); }
    const mg = mergeGeometries(geos, false); if (!mg) continue; const mesh = new THREE.Mesh(mg, m); mesh.castShadow = list.some(o => o.castShadow); mesh.receiveShadow = true; mesh.userData.noOutline = list.every(o => o.userData.noOutline); root.add(mesh); }
  for (const o of rm) o.parent && o.parent.remove(o); return root; }

export const CH = 48;                 // altura del acantilado
const PI = Math.PI;
const hex = c => '#' + c.toString(16).padStart(6, '0');
const shadow = (o, c = true, r = true) => { o.traverse(m => { if (m.isMesh) { m.castShadow = c; m.receiveShadow = r; } }); return o; };
const keep = o => { o.userData.keep = true; return o; };
const noOut = o => { o.traverse(m => { m.userData.noOutline = true; }); return o; };
// ruido de valor 2D (para geometría y texturas)
function vnoise(seed = 1) { const P = new Uint8Array(512), r = RNG(seed); for (let i = 0; i < 256; i++) P[i] = i; for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [P[i], P[j]] = [P[j], P[i]]; } for (let i = 0; i < 256; i++) P[i + 256] = P[i];
  const h = (x, y) => P[P[x & 255] + (y & 255)] / 255, f = t => t * t * (3 - 2 * t);
  const n = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = f(xf), v = f(yf); return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v); };
  return (x, y, o = 4) => { let a = .5, s = 0, w = 0; for (let i = 0; i < o; i++) { s += a * n(x, y); w += a; x = x * 2.03 + 17.1; y = y * 2.03 + 9.7; a *= .5; } return s / w; }; }
export const N2 = vnoise(7);

// ---------- cielo con nubes de verdad ----------
export function skyDome() {
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(.12, .34, .82) }, mid: { value: new THREE.Color(.42, .66, .96) }, hor: { value: new THREE.Color(.86, .92, 1) }, sunDir: { value: V(-.4, .55, -.7).normalize() }, sunCol: { value: new THREE.Color(1, .95, .85) },
      cloud: { value: .55 }, cCol: { value: new THREE.Color(1, 1, 1) }, cShade: { value: new THREE.Color(.56, .62, .74) }, time: { value: 0 }, haze: { value: .0 }, glow: { value: 1 } },
    vertexShader: 'varying vec3 p; void main(){ p=normalize(position); vec4 q=projectionMatrix*modelViewMatrix*vec4(position,1.); gl_Position=q.xyww; }',
    fragmentShader: `uniform vec3 top, mid, hor, sunDir, sunCol, cCol, cShade; uniform float cloud, time, haze, glow; varying vec3 p;
      float h(vec2 q){ return fract(sin(dot(q, vec2(127.1,311.7)))*43758.5453); }
      float n(vec2 q){ vec2 i=floor(q), f=fract(q); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
      float fbm(vec2 q){ float a=.5, s=0.; for(int i=0;i<6;i++){ s+=a*n(q); q=q*2.02+vec2(1.7,9.2); a*=.5; } return s; }
      void main(){ vec3 d=normalize(p); float y=max(d.y,0.);
        vec3 c = mix(hor, mid, smoothstep(0.,.16,y)); c = mix(c, top, smoothstep(.16,.7,y));
        float sd = max(dot(d, normalize(sunDir)), 0.);
        c += sunCol * (pow(sd, 6.) * .22 + pow(sd, 60.) * .5) * glow; c += sunCol * smoothstep(.9994, .9998, sd) * 6.;
        if (cloud > 0. && d.y > -.02) {
          vec2 q = d.xz / (d.y + .09) * 1.25 + vec2(time*.004, 0.);
          float base = fbm(q * .7 + vec2(3.1, 1.3));
          float det = fbm(q * 2.6 + vec2(7., 2.));
          float dens = base * .82 + det * .34 - (1. - cloud) * .5;
          float cov = smoothstep(.4, .56, dens) * smoothstep(-.01, .12, d.y);
          vec2 so = normalize(sunDir.xz + 1e-4) * .09;
          float dl = fbm((q + so) * .7 + vec2(3.1, 1.3)) * .78 + fbm((q + so) * 2.6 + vec2(7., 2.)) * .32 - (1. - cloud) * .55;
          float lit = clamp(.5 + (dens - dl) * 9. + (det - .5) * .5, 0., 1.25);
          vec3 cc = mix(cShade, cCol, lit); cc = mix(cc, cCol, smoothstep(.62, .9, dens) * .3);
          cc += sunCol * pow(sd, 10.) * .5 * (1. - smoothstep(.5, .75, dens));          // borde iluminado a contraluz
          c = mix(c, cc, cov * .97); }
        c = mix(c, hor, haze * (1. - smoothstep(0., .25, y)));
        if (d.y < 0.) c = mix(hor, hor * .8, clamp(-d.y * 4., 0., 1.));
        gl_FragColor = vec4(c, 1.); }` });
  const g = new THREE.Mesh(new THREE.SphereGeometry(4000, 64, 32), m); g.frustumCulled = false; g.renderOrder = -10; noOut(g); return g;
}
// cielos por momento del día: [top, mid, hor, sunDir, sunCol, cloud, cCol, cShade, haze]
export const SKIES = {
  day:   [[.06, .26, .78], [.30, .56, .94], [.80, .89, 1], [-.35, .62, -.7], [1, .96, .88], .72, [1, 1, 1], [.55, .62, .76], .15],
  noon:  [[.05, .24, .76], [.28, .54, .93], [.80, .89, 1], [-.25, .8, -.5], [1, .98, .92], .66, [1, 1, 1], [.58, .64, .76], .12],
  dawn:  [[.12, .2, .5], [.56, .48, .66], [1, .64, .38], [.1, .07, 1], [1, .62, .32], .66, [1, .82, .68], [.46, .38, .52], .35],
  dusk:  [[.1, .14, .42], [.66, .42, .52], [1, .56, .28], [.0, .06, 1], [1, .5, .22], .66, [1, .72, .55], [.42, .3, .44], .4],
  night: [[.01, .03, .1], [.03, .08, .2], [.1, .16, .3], [.3, .5, -.6], [.5, .6, .9], .25, [.25, .3, .42], [.06, .08, .14], .1],
  storm: [[.24, .32, .46], [.44, .52, .64], [.7, .76, .82], [-.3, .7, -.5], [.9, .92, 1], .85, [.92, .94, 1], [.4, .45, .55], .4],
};
export function applySky(m, k) { const s = SKIES[k], u = m.uniforms; u.top.value.setRGB(...s[0]); u.mid.value.setRGB(...s[1]); u.hor.value.setRGB(...s[2]); u.sunDir.value.set(...s[3]).normalize(); u.sunCol.value.setRGB(...s[4]); u.cloud.value = s[5]; u.cCol.value.setRGB(...s[6]); u.cShade.value.setRGB(...s[7]); u.haze.value = s[8]; }
// mapas de entorno (reflejos del cielo en agua, charcos y metal), uno por momento del día
export function skyEnvs(renderer) { const pm = new THREE.PMREMGenerator(renderer), sc = new THREE.Scene(), d = skyDome(); sc.add(d); const out = {};
  for (const k in SKIES) { applySky(d.material, k); out[k] = pm.fromScene(sc, 0, .1, 9000).texture; } return out; }

// ---------- texturas ----------
// arena con ondas de marea: color, relieve (normal) y rugosidad (charquitos brillantes en los valles)
function sandMaps(seed = 3, wet = 0) { const S = 1024, r = RNG(seed), Hh = new Float32Array(S * S), N = vnoise(seed);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const u = x / S, v = y / S;
    const warp = N(u * 6, v * 6, 3) * 2.2 + N(u * 2 + 5, v * 2, 2) * 1.2;
    const ph = (v * 26 + warp + Math.sin(u * PI * 2 * 3 + v * 4) * .35) * PI * 2;
    let hgt = Math.pow((Math.sin(ph) + 1) / 2, 1.6);                              // cresta asimétrica
    hgt = hgt * (.7 + N(u * 9, v * 9, 2) * .5) + N(u * 40, v * 40, 2) * .12;
    Hh[y * S + x] = hgt; }
  const col = canvasTex(S, S, (c) => { const im = c.createImageData(S, S); for (let i = 0; i < S * S; i++) { const x = i % S, y = (i / S) | 0, hgt = Hh[i], g = N(x / S * 14, y / S * 14, 3);
      let R = 214 + g * 30 - (1 - hgt) * 34, G = 182 + g * 26 - (1 - hgt) * 34, B = 132 + g * 18 - (1 - hgt) * 28;
      const wetk = clamp((.32 - hgt) * 3.5) * (.5 + wet * .5); R = lerp(R, 128, wetk); G = lerp(G, 112, wetk); B = lerp(B, 92, wetk);
      if (r() < .0016) { R = 250; G = 244; B = 236; } else if (r() < .0012) { R = 70; G = 62; B = 58; }
      im.data[i * 4] = R; im.data[i * 4 + 1] = G; im.data[i * 4 + 2] = B; im.data[i * 4 + 3] = 255; } c.putImageData(im, 0, 0); });
  const nor = canvasTex(S, S, (c) => { const im = c.createImageData(S, S), k = 3.2; for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const i = y * S + x;
      const dx = (Hh[y * S + ((x + 1) % S)] - Hh[y * S + ((x - 1 + S) % S)]) * k, dy = (Hh[((y + 1) % S) * S + x] - Hh[((y - 1 + S) % S) * S + x]) * k, l = Math.hypot(dx, dy, 1);
      im.data[i * 4] = (-dx / l * .5 + .5) * 255; im.data[i * 4 + 1] = (dy / l * .5 + .5) * 255; im.data[i * 4 + 2] = (1 / l * .5 + .5) * 255; im.data[i * 4 + 3] = 255; } c.putImageData(im, 0, 0); });
  const rough = canvasTex(S, S, (c) => { const im = c.createImageData(S, S); for (let i = 0; i < S * S; i++) { const v = clamp(.95 - clamp((.26 - Hh[i]) * 5) * (.55 + wet * .4)) * 255; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } c.putImageData(im, 0, 0); });
  for (const t of [col, nor, rough]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; } nor.colorSpace = THREE.NoColorSpace; rough.colorSpace = THREE.NoColorSpace;
  return { col, nor, rough }; }
console.log('w0', performance.now()|0); export const SAND = sandMaps(3, 0); console.log('sand', performance.now()|0);
// agua: normal de olitas
export const WNOR = (() => { const S = 512, N = vnoise(21), Hh = new Float32Array(S * S); for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const u = x / S, v = y / S; Hh[y * S + x] = N(u * 8, v * 8, 4) * .7 + Math.sin((u * 3 + v * 9 + N(u * 4, v * 4, 2) * 2) * PI * 2) * .15; }
  const t = canvasTex(S, S, (c) => { const im = c.createImageData(S, S), k = 6; for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const i = y * S + x; const dx = (Hh[y * S + ((x + 1) % S)] - Hh[y * S + ((x - 1 + S) % S)]) * k, dy = (Hh[((y + 1) % S) * S + x] - Hh[((y - 1 + S) % S) * S + x]) * k, l = Math.hypot(dx, dy, 1);
    im.data[i * 4] = (-dx / l * .5 + .5) * 255; im.data[i * 4 + 1] = (dy / l * .5 + .5) * 255; im.data[i * 4 + 2] = (1 / l * .5 + .5) * 255; im.data[i * 4 + 3] = 255; } c.putImageData(im, 0, 0); });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; return t; })();
// ladrillo rojo (Klinker) con juntas claras
const brickTex = (base = '#9a3a2a', seed = 2) => { const t = canvasTex(512, 512, (c, w, h) => { const r = RNG(seed); c.fillStyle = '#d8ccb8'; c.fillRect(0, 0, w, h); const bh = 16, bw = 46;
  for (let y = 0; y < h; y += bh) for (let x = -(y / bh % 2) * bw / 2; x < w; x += bw) { const v = (r() - .5) * 40; c.fillStyle = `hsl(${8 + r() * 10},${45 + r() * 15}%,${30 + v / 4 + r() * 8}%)`; c.fillRect(x + 1.5, y + 1.5, bw - 3, bh - 3); }
  c.globalAlpha = .12; for (let i = 0; i < 600; i++) { c.fillStyle = r() < .5 ? '#000' : '#fff'; c.fillRect(r() * w, r() * h, 2, 2); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; };
export const BRICK = brickTex('#9a3a2a', 2), BRICK2 = brickTex('#7a2a22', 9);
// tejas rojas
const tileTex = (hue = 6, seed = 4) => { const t = canvasTex(512, 512, (c, w, h) => { const r = RNG(seed); c.fillStyle = '#3a1410'; c.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 22) for (let x = -(y / 22 % 2) * 16; x < w; x += 32) { c.fillStyle = `hsl(${hue + r() * 8},${55 + r() * 15}%,${34 + r() * 10}%)`; c.beginPath(); c.roundRect(x + 1, y, 30, 24, [0, 0, 12, 12]); c.fill(); c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(x + 3, y + 2, 26, 4); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; };
export const TILE = tileTex(6, 4), TILE2 = tileTex(20, 7);
// paja (tejado de Reet)
export const REET = (() => { const t = canvasTex(512, 512, (c, w, h) => { const r = RNG(11); c.fillStyle = '#7a6238'; c.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { const x = r() * w, y = r() * h, l = 8 + r() * 26; c.strokeStyle = `hsla(${34 + r() * 12},${30 + r() * 25}%,${28 + r() * 30}%,.8)`; c.lineWidth = 1 + r() * 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - .5) * 3, y + l); c.stroke(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; })();
// madera gastada
export const WOOD = (() => { const t = canvasTex(512, 512, (c, w, h) => { const r = RNG(13); for (let x = 0; x < w; x += 64) { const b = 70 + r() * 30; c.fillStyle = `rgb(${b + 40},${b + 18},${b - 10})`; c.fillRect(x, 0, 62, h); c.globalAlpha = .25; for (let i = 0; i < 60; i++) { c.strokeStyle = r() < .5 ? '#2a1a0a' : '#c8a878'; c.lineWidth = 1; c.beginPath(); const xx = x + r() * 62; c.moveTo(xx, 0); c.bezierCurveTo(xx + r() * 6, h * .3, xx - r() * 6, h * .6, xx + r() * 4, h); c.stroke(); } c.globalAlpha = 1; c.fillStyle = '#1a1208'; c.fillRect(x + 62, 0, 2, h); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; })();
// óxido
export const RUST = (() => { const N = vnoise(31); const t = canvasTex(512, 512, (c) => { const im = c.createImageData(512, 512); for (let i = 0; i < 512 * 512; i++) { const x = i % 512, y = (i / 512) | 0, a = N(x / 60, y / 60, 5), b = N(x / 9, y / 9, 2);
  const k = clamp((a - .38) * 3); let R = lerp(96, 150, k) + b * 40, G = lerp(70, 64, k) + b * 22, B = lerp(56, 30, k) + b * 12; if (a > .7) { R = 190; G = 110; B = 50; } im.data[i * 4] = R; im.data[i * 4 + 1] = G; im.data[i * 4 + 2] = B; im.data[i * 4 + 3] = 255; } c.putImageData(im, 0, 0); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })();
// adoquín del paseo
export const PAVE = (() => { const t = canvasTex(512, 512, (c, w, h) => { const r = RNG(17); c.fillStyle = '#6a625a'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 32) for (let x = -(y / 32 % 2) * 32; x < w; x += 64) { const v = 120 + r() * 50; c.fillStyle = `rgb(${v},${v - 8},${v - 16})`; c.beginPath(); c.roundRect(x + 2, y + 2, 60, 28, 6); c.fill(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; })();
// césped
export const GRASS = (() => { const t = canvasTex(512, 512, (c, w, h) => { const r = RNG(19); c.fillStyle = '#5a8a3a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 14000; i++) { c.fillStyle = `hsl(${85 + r() * 25},${40 + r() * 25}%,${25 + r() * 25}%)`; c.fillRect(r() * w, r() * h, 2, 4 + r() * 5); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; })();

// ---------- acantilado estratificado ----------
export const ROCKT = (() => { const N = vnoise(51); const t = canvasTex(512, 512, (c) => { const im = c.createImageData(512, 512); for (let i = 0; i < 512 * 512; i++) { const x = i % 512, y = (i / 512) | 0, a = N(x / 40, y / 6, 4), b = N(x / 6, y / 6, 3), cr = N(x / 90, y / 14, 2);
  let v = 150 + (a - .5) * 110 + (b - .5) * 70; if (cr > .64) v *= .75; im.data[i * 4] = v; im.data[i * 4 + 1] = v * .96; im.data[i * 4 + 2] = v * .9; im.data[i * 4 + 3] = 255; } c.putImageData(im, 0, 0); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t; })();
function cliffFace(parent, x0, x1, hgt, seed = 3, o = {}) {
  const N = vnoise(seed), nx = 360, ny = 40, w = x1 - x0, g = new THREE.PlaneGeometry(w, hgt + 4, nx, ny), pos = g.attributes.position, col = new Float32Array(pos.count * 3);
  const strata = [[.86, .64, .42], [.70, .46, .30], [.92, .76, .54], [.60, .40, .26], [.80, .56, .36], [.96, .84, .64], [.74, .52, .40]];
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i) + hgt / 2 - 2, u = (x + w / 2) / w;
    const band = y / hgt * 9 + N(u * 40, y * .05, 2) * 1.5, bi = ((Math.floor(band) % strata.length) + strata.length) % strata.length, bf = band - Math.floor(band);
    let dz = (N(u * 60, y * .08, 4) - .5) * 6 + (N(u * 18, 3, 2) - .5) * 6 + Math.sin(band * PI) * .6;         // rugosidad + estratos que sobresalen
    dz += Math.max(0, (bf - .82)) * 7; if (y > hgt - 3) dz = Math.max(dz, 0);                                                                    // cornisas; cara algo inclinada
    pos.setXYZ(i, x, y, dz); const c = strata[bi], sh = .82 + N(u * 120, y * .3, 2) * .32 - (y < 3 ? .2 : 0);
    col[i * 3] = c[0] * sh; col[i * 3 + 1] = c[1] * sh; col[i * 3 + 2] = c[2] * sh;
    if (y > hgt - 1.2) { col[i * 3] = .3; col[i * 3 + 1] = .46; col[i * 3 + 2] = .2; } }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
  const rt = ROCKT.clone(); rt.repeat.set(w / 40, (hgt + 4) / 40); rt.needsUpdate = true; const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, map: rt, roughness: .95 })); m.position.set((x0 + x1) / 2, 0, o.z ?? 0); if (o.ry) m.rotation.y = o.ry; parent.add(m); return shadow(m); }
// rocas sueltas
export function rock(parent, x, y, z, s = 1, col = 0x8a7a68, seed = 1) { const g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position, N = vnoise(seed);
  for (let i = 0; i < p.count; i++) { const v = V(p.getX(i), p.getY(i), p.getZ(i)); v.multiplyScalar(.78 + N(v.x * 1.6 + 5, v.y * 1.6 + v.z * 1.3, 3) * .42 + N(v.x * 6, v.z * 6 + v.y, 2) * .06); p.setXYZ(i, v.x, v.y * .7, v.z); } g.computeVertexNormals();
  const m = new THREE.Mesh(g, ROCKM(col)); m.position.set(x, y, z); m.scale.setScalar(s); m.rotation.y = seed; parent.add(m); return shadow(m); }
const _rm = {}; const ROCKM = col => _rm[col] ??= new THREE.MeshStandardMaterial({ color: col, map: ROCKT, roughness: .92 });

// ---------- casas del Mar del Norte ----------
const winMat = new THREE.MeshStandardMaterial({ color: 0x9ac0d8, roughness: .08, metalness: .3, envMapIntensity: 1.4 });
const whiteM = mat(0xf4f2ec, { roughness: .6 }), darkWin = mat(0x2a3440, { roughness: .2 });
function window_(p, x, y, z, w = 2.4, h = 3.2, ry = 0, o = {}) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; p.add(g);
  box(w + .5, h + .5, .3, whiteM, .04, g, 0, 0, 0); box(w, h, .1, o.lit ? new THREE.MeshStandardMaterial({ color: 0xffd8a0, emissive: 0xffb060, emissiveIntensity: o.lit }) : winMat, 0, g, 0, 0, .14);
  box(.16, h, .14, whiteM, 0, g, 0, 0, .2); box(w, .16, .14, whiteM, 0, g, 0, h * .18, .2); box(w + .8, .22, .6, whiteM, .04, g, 0, -h / 2 - .3, .3);
  if (o.box) { box(w + .4, .7, .8, mat(0x6a4a2a), .08, g, 0, -h / 2 - .75, .55); for (let k = 0; k < 6; k++) sphere(.34, mat([0xe8304a, 0xff8ac0, 0xffffff, 0xffd23f][(k + o.box) % 4], { roughness: .7 }), g, -w / 2 + .3 + k * (w / 5.4), -h / 2 - .2, .6, 8, 6); }
  if (o.shut) for (const s of [-1, 1]) { const sh_ = box(w * .5, h + .2, .12, mat(o.shut, { roughness: .6 }), .02, g, s * (w * .75 + .3), 0, .2); for (let k = 0; k < 5; k++) box(w * .46, .08, .05, mat(0x000000, { transparent: true, opacity: .15 }), 0, sh_, 0, -h / 2 + .4 + k * h / 5, .08); }
  return g; }
// casa de ladrillo con hastial escalonado (Treppengiebel) o tejado a dos aguas; fachada hacia +z
export function giebelHaus(parent, x, z, o = {}) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = o.ry ?? 0; parent.add(g);
  const w = o.w ?? 16, d = o.d ?? 18, fl = o.fl ?? 2, fh = 6.2, H = fl * fh, br = o.brick ?? (o.seed % 2 ? BRICK2 : BRICK), r = RNG(o.seed ?? 1);
  const bm = new THREE.MeshStandardMaterial({ map: br.clone(), roughness: .9 }); bm.map.repeat.set(w / 12, H / 12); bm.map.needsUpdate = true;
  const plaster = o.plaster ? mat(o.plaster, { roughness: .85 }) : null;
  box(w, H, d, plaster || bm, .1, g, 0, H / 2, 0); box(w + .6, 1, d + .6, mat(0x3a3434, { roughness: .9 }), .05, g, 0, .5, 0);
  for (let k = 1; k < fl; k++) box(w + .2, .35, d + .2, whiteM, .04, g, 0, k * fh, 0);
  // hastial
  const gh = w * .62; const sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo(0, gh); sh.closePath();
  const gg = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .6, bevelEnabled: false }), plaster || bm); gg.position.set(0, H, d / 2 - .6); g.add(gg);
  if (o.step !== false && !o.reet) { const st = 5; for (let k = 0; k < st; k++) { const y0 = H + k * gh / st, hw = w / 2 * (1 - k / st); for (const s of [-1, 1]) box(w / st * .5 + .6, gh / st + .5, 1.2, plaster || bm, .05, g, s * (hw - w / st * .25), y0 + gh / st * .5, d / 2 - .3); }
    box(1.4, 2.4, 1.2, plaster || bm, .05, g, 0, H + gh + .6, d / 2 - .3); }
  // tejado
  const rl = Math.hypot(w / 2, gh) + (o.reet ? 1.8 : .6), rm = o.reet ? new THREE.MeshStandardMaterial({ map: REET, roughness: 1 }) : new THREE.MeshStandardMaterial({ map: (o.tile2 ? TILE2 : TILE).clone(), roughness: .7 });
  rm.map.repeat.set(d / 10, rl / 8); rm.map.needsUpdate = true; const ang = Math.atan2(gh, w / 2);
  for (const s of [-1, 1]) { const rf = box(rl, o.reet ? 1.6 : .5, d + (o.reet ? 2.4 : 1.2), rm, o.reet ? .5 : .05, g, s * (w / 4 - .1), H + gh / 2 + .2, -.3); rf.rotation.z = -s * ang; }
  if (o.reet) { box(1.6, 1.2, d + 2.6, mat(0x5a4a2a, { roughness: 1 }), .5, g, 0, H + gh + .2, -.3); }
  box(1.6, 4, 1.6, BRICK2 === br ? bm : new THREE.MeshStandardMaterial({ map: BRICK2, roughness: .9 }), .05, g, w * .25, H + gh * .6 + 2, -d * .2);      // chimenea
  // ventanas y puerta (fachada +z)
  const nw = Math.max(2, Math.round(w / 5.4)), shut = o.shut ?? [0x2a5a8a, 0x1a6a4a, 0xf4f2ec, 0x2a3a5a][(o.seed ?? 1) % 4];
  for (let f = 0; f < fl; f++) for (let k = 0; k < nw; k++) { const xx = -w / 2 + w / (nw + 1) * (k + 1); if (f === 0 && k === Math.floor(nw / 2) && !o.shop) continue; window_(g, xx, f * fh + 3.6, d / 2 + .05, 2.2, 3.2, 0, { box: f === 0 ? (k + 1) : (f === 1 && k % 2 ? 2 : 0), shut: f > 0 ? shut : 0, lit: o.lit && r() < .6 ? 1.6 : 0 }); }
  if (o.lit) window_(g, 0, H + gh * .35, d / 2 + .1, 1.8, 2.2, 0, { lit: 1.4 }); else window_(g, 0, H + gh * .35, d / 2 + .1, 1.8, 2.2);
  const dx = o.shop ? -w / 2 + 3.6 : 0; const door = box(2.8, 4.8, .3, mat(o.door ?? [0x1a4a7a, 0x2a6a3a, 0x8a1a1a, 0xf2f2ec][(o.seed ?? 1) % 4], { roughness: .5 }), .05, g, dx, 2.6, d / 2 + .1);
  box(3.4, .4, .5, whiteM, .04, g, dx, 5.2, d / 2 + .2); sphere(.14, mat(0xd8b040, { metalness: .8, roughness: .3 }), g, dx + .9, 2.6, d / 2 + .3, 8, 6); box(3.6, .4, 1.6, mat(0x8a8078), .05, g, dx, .2, d / 2 + .8);
  if (o.shop) { const sg = textPlane(w * .7, 1.8, 512, 128, (c, ww, hh) => { c.fillStyle = '#f4f0e4'; c.fillRect(0, 0, ww, hh); c.fillStyle = '#1a2a4a'; c.font = `700 74px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.shop, ww / 2, hh / 2 + 4); }); sg.position.set(1.5, fh - .6, d / 2 + .25); g.add(sg);
    const aw = box(w * .8, .3, 3.6, mat(o.awning ?? 0x2a6aa8, { roughness: .8 }), .05, g, 1.5, fh - 2, d / 2 + 1.8); aw.rotation.x = .28; for (let k = 0; k < 8; k++) box(w * .8 / 8 * .5, .32, 3.62, whiteM, 0, aw, -w * .4 + w * .8 / 8 * (k + .25), 0, 0); }
  if (o.bench) { box(6, .4, 1.4, mat(0x6a4a2a), .05, g, -w * .28, 1.6, d / 2 + 2); for (const s of [-1, 1]) box(.3, 1.6, 1, mat(0x3a3a3a), .02, g, -w * .28 + s * 2.6, .8, d / 2 + 2); }
  if (o.rose) for (let k = 0; k < 7; k++) sphere(.5 + r() * .4, mat([0x3a7a2a, 0x2a6a22][k % 2], { roughness: .9 }), g, w / 2 - 1 - r() * 3, .6 + r() * 3 * (k / 7) * 2, d / 2 + .6, 8, 6);
  shadow(g); return g; }
// faro rojo y blanco
export function leuchtturm(parent, x, z, s = 1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
  for (let k = 0; k < 6; k++) cyl(4.6 - k * .35, 4.6 - (k + 1) * .35, 6, mat(k % 2 ? 0xf4f2ec : 0xc8202a, { roughness: .5 }), 28, g, 0, 3 + k * 6, 0);
  cyl(3.4, 3.4, .6, mat(0x2a2a30), 28, g, 0, 36.3, 0); for (let k = 0; k < 16; k++) { const a = k / 16 * PI * 2; cyl(.08, .08, 2.2, mat(0x2a2a30), 4, g, Math.cos(a) * 3.3, 37.6, Math.sin(a) * 3.3); }
  cyl(2.2, 2.2, 4, new THREE.MeshStandardMaterial({ color: 0xfff4c8, emissive: 0xffe8a0, emissiveIntensity: .6, roughness: .1 }), 20, g, 0, 39, 0); const cp = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3, 20), mat(0x2a2a30, { metalness: .4 })); cp.position.y = 42.5; g.add(cp);
  for (let k = 0; k < 3; k++) window_(g, 0, 10 + k * 9, 3.9, 1, 1.6); box(2.6, 4, 1, mat(0x1a3a6a), .05, g, 0, 2, 4.4);
  return shadow(g); }
// banderines
export function bunting(parent, a, b, sag = 2, n = 18) { const g = new THREE.Group(); parent.add(g); const cols = [0xd8202a, 0xf4f2ec, 0x2a6ad8, 0xffd23f, 0x2a9a5a];
  for (let i = 0; i <= n; i++) { const k = i / n, p = V(lerp(a.x, b.x, k), lerp(a.y, b.y, k) - Math.sin(k * PI) * sag, lerp(a.z, b.z, k));
    const t = new THREE.Mesh(new THREE.ConeGeometry(.55, 1.3, 3), mat(cols[i % cols.length], { roughness: .8, side: THREE.DoubleSide })); t.rotation.x = PI; t.scale.z = .15; t.position.copy(p).add(V(0, -.7, 0)); t.lookAt(t.position.clone().add(V(-(b.z - a.z), 0, b.x - a.x))); t.rotateX(PI); g.add(t); }
  const pts = []; for (let i = 0; i <= 30; i++) { const k = i / 30; pts.push(V(lerp(a.x, b.x, k), lerp(a.y, b.y, k) - Math.sin(k * PI) * sag, lerp(a.z, b.z, k))); }
  const ln = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, .05, 4), mat(0x3a3a3a)); g.add(ln); return g; }
export function laterne(parent, x, z, y = 0, lit = 0) { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); const k = mat(0x1a2a2a, { metalness: .5, roughness: .4 });
  cyl(.25, .35, 11, k, 8, g, 0, 5.5, 0); cyl(.6, .6, .5, k, 8, g, 0, .25, 0); const lm = box(1.3, 1.6, 1.3, new THREE.MeshStandardMaterial({ color: 0xfff0c8, emissive: 0xffc070, emissiveIntensity: lit ? 2.2 : .15, roughness: .2 }), .05, g, 0, 11.6, 0); g.userData.lamp = lm;
  const cp = new THREE.Mesh(new THREE.ConeGeometry(1.1, .9, 4), k); cp.position.y = 12.8; cp.rotation.y = PI / 4; g.add(cp); return shadow(g); }
export function railing(parent, x0, x1, z, y) { const g = new THREE.Group(); parent.add(g); const m = mat(0xf4f2ec, { roughness: .4, metalness: .2 }); const w = x1 - x0;
  for (const h of [1.4, 3.2]) cyl(.12, .12, w, m, 6, g, (x0 + x1) / 2, y + h, z).rotation.z = PI / 2; for (let x = x0; x <= x1; x += 3) cyl(.13, .13, 3.4, m, 6, g, x, y + 1.7, z); return shadow(g); }
export function bank(parent, x, y, z, ry = 0) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g); const w = new THREE.MeshStandardMaterial({ map: WOOD, roughness: .8 });
  for (let k = 0; k < 3; k++) box(6, .25, .5, w, .04, g, 0, 2 + .01 * k, -.6 + k * .6); for (let k = 0; k < 2; k++) box(6, .5, .2, w, .04, g, 0, 3.2 + k * .7, -1.1); for (const s of [-1, 1]) box(.3, 2, 1.8, mat(0x2a3a3a, { metalness: .5 }), .04, g, s * 2.6, 1, -.3); return shadow(g); }
// cartel de madera con texto
export function schild(parent, lines, x, y, z, ry = 0, w = 14, h = 6, o = {}) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent && parent.add(g);
  const p = textPlane(w, h, 1024, Math.round(1024 * h / w), (c, ww, hh) => { c.fillStyle = o.bg ?? '#f4f0e4'; c.fillRect(0, 0, ww, hh); c.strokeStyle = o.ink ?? '#1a2a4a'; c.lineWidth = 14; c.strokeRect(20, 20, ww - 40, hh - 40);
    c.fillStyle = o.ink ?? '#1a2a4a'; c.textAlign = 'center'; c.textBaseline = 'middle'; const n = lines.length; const fs = Math.min(hh / (n + .6) * .78, 140); c.font = `700 ${fs}px ${o.font ?? FONT}`;
    lines.forEach((l, i) => { const mw = c.measureText(l).width, k = Math.min(1, (ww - 90) / mw); c.save(); c.translate(ww / 2, hh / 2 + (i - (n - 1) / 2) * fs * 1.15); c.scale(k, 1); if (o.red && i === o.red) c.fillStyle = '#c8202a'; c.fillText(l, 0, 0); c.restore(); });
    if (o.line) { c.fillStyle = '#c8202a'; c.fillRect(ww * .2, hh / 2 - 4, ww * .6, 8); } });
  p.position.z = .26; g.add(p); box(w + .8, h + .8, .4, mat(o.frame ?? 0x3a2a1a, { roughness: .8 }), .05, g, 0, 0, 0); if (o.posts !== false) for (const s of [-1, 1]) box(.5, y + h / 2, .5, mat(0x3a2a1a), .05, g, s * (w / 2 - 1), -(y + h / 2) / 2 + h / 2 - h / 2, -.2);
  return shadow(g); }
// escalera de mano de madera, de (x, 0, z) a (x, h, z - lean)
export function leiter(parent, x, z, h = CH, lean = 4, o = {}) { const g = new THREE.Group(); g.position.set(x, o.y ?? 0, z); parent && parent.add(g); const wm = new THREE.MeshStandardMaterial({ map: WOOD, color: o.col ?? 0xc89060, roughness: .85 });
  const len = Math.hypot(h, lean), ang = Math.atan2(lean, h), w = o.w ?? 2.6; const inner = new THREE.Group(); inner.rotation.x = -ang; g.add(inner);
  for (const s of [-1, 1]) box(.32, len, .32, wm, .04, inner, s * w / 2, len / 2, 0); for (let y = 1; y < len; y += 1.4) box(w, .22, .22, wm, .03, inner, 0, y, 0);
  g.userData.top = V(x, (o.y ?? 0) + h, z - lean); g.userData.at = k => V(x, (o.y ?? 0) + h * k, z - lean * k); return shadow(g); }

// ---------- el fondo marino ----------
// conchas y piedras instanciadas en una zona (centro cx, cz; semi-ancho rx, rz)
export function strandgut(parent, cx, cz, rx, rz, n = 1500, seed = 5) { const r = RNG(seed), g = new THREE.Group(); parent.add(g);
  const geos = [new THREE.SphereGeometry(.34, 10, 6, 0, PI * 2, 0, PI / 2), new THREE.DodecahedronGeometry(.3, 0), new THREE.ConeGeometry(.22, .6, 8)];
  const cols = [[0xf4ece0, 0xe8c8b0, 0xf0d0d8, 0xd8b8a0, 0xfff4e8], [0x6a6462, 0x8a8078, 0x4a4442, 0xa89a88], [0xe8d8c8, 0xd89868, 0xf4e4d4]];
  geos.forEach((geo, gi) => { const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: gi === 1 ? .9 : .45 }), n); const d = new THREE.Object3D(), c = new THREE.Color();
    for (let i = 0; i < n; i++) { d.position.set(cx + (r() - .5) * 2 * rx, gi === 0 ? .02 : .1, cz + (r() - .5) * 2 * rz); d.rotation.set(gi === 2 ? PI / 2 : 0, r() * 6.3, gi === 1 ? r() : 0); const s = .6 + r() * 1.1; d.scale.set(s, gi === 0 ? s * .55 : s, s * (gi === 0 ? .9 : 1)); d.updateMatrix(); m.setMatrixAt(i, d.matrix); c.setHex(cols[gi][Math.floor(r() * cols[gi].length)]); m.setColorAt(i, c); }
    m.castShadow = true; m.receiveShadow = true; m.userData.noOutline = true; g.add(m); }); return g; }
// charcos que reflejan el cielo
export function charcos(parent, cx, cz, rx, rz, n = 30, seed = 8) { const r = RNG(seed), g = new THREE.Group(); parent.add(g); const m = new THREE.MeshStandardMaterial({ color: 0x5a6a72, roughness: .04, metalness: .15, normalMap: WNOR, normalScale: new THREE.Vector2(.08, .08), envMapIntensity: 1.6 });
  for (let i = 0; i < n; i++) { const sh = new THREE.Shape(), k = 14, R = 2 + r() * 7; for (let j = 0; j <= k; j++) { const a = j / k * PI * 2, rr = R * (.7 + r() * .5); j ? sh.lineTo(Math.cos(a) * rr * 1.8, Math.sin(a) * rr) : sh.moveTo(Math.cos(a) * rr * 1.8, Math.sin(a) * rr); }
    const p = new THREE.Mesh(new THREE.ShapeGeometry(sh, 6), m); p.rotation.x = -PI / 2; p.rotation.z = r() * .6 - .3; p.position.set(cx + (r() - .5) * 2 * rx, .07, cz + (r() - .5) * 2 * rz); p.receiveShadow = true; p.userData.noOutline = true; g.add(p); } return g; }
// coral (ramas, cerebro, abanico) con algo de brillo propio
export function koralle(parent, x, z, s = 1, seed = 1, glow = .25) { const r = RNG(seed), g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
  const cols = [0xff5a7a, 0xff8a3a, 0xb05aff, 0x3ad8c8, 0xffd23f, 0xff4ab0];
  const cm = () => { const c = cols[Math.floor(r() * cols.length)]; return mat(c, { roughness: .6, emissive: c, emissiveIntensity: glow }); };
  const branch = (p, pos, dir, len, rad, d, m) => { if (d === 0 || rad < .08) return; const c = cyl(rad * .7, rad, len, m, 7, p); const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.clone().normalize()); c.quaternion.copy(q); c.position.copy(pos).addScaledVector(dir.clone().normalize(), len / 2);
    const end = pos.clone().addScaledVector(dir.clone().normalize(), len); sphere(rad * .8, m, p, end.x, end.y, end.z, 6, 4); for (let k = 0; k < 2 + (r() < .4); k++) branch(p, end, dir.clone().normalize().add(V((r() - .5) * 1.4, .4 + r() * .3, (r() - .5) * 1.4)), len * .72, rad * .68, d - 1, m); };
  for (let k = 0; k < 5; k++) { const t = r(); const px = (r() - .5) * 8, pz = (r() - .5) * 8;
    if (t < .4) branch(g, V(px, 0, pz), V((r() - .5) * .4, 1, (r() - .5) * .4), 2 + r() * 2, .5 + r() * .3, 4, cm());
    else if (t < .7) { const b = sphere(1.4 + r() * 1.4, cm(), g, px, .6, pz, 18, 12); b.scale.y = .65; const gr = mat(0x000000, { transparent: true, opacity: .18 }); for (let j = 0; j < 4; j++) { const tt = new THREE.Mesh(new THREE.TorusGeometry(b.geometry.parameters.radius * (.3 + j * .2), .08, 4, 20), gr); tt.rotation.x = PI / 2; tt.position.set(px, .6 + b.geometry.parameters.radius * .6 * (.95 - j * .2), pz); g.add(tt); } }
    else { const f = new THREE.Mesh(new THREE.CircleGeometry(2.4 + r() * 1.6, 18, 0, PI), new THREE.MeshStandardMaterial({ color: cols[Math.floor(r() * 6)], side: THREE.DoubleSide, roughness: .7, emissive: 0xff3a6a, emissiveIntensity: glow * .6 })); f.position.set(px, 0, pz); f.rotation.y = r() * 3; g.add(f); } }
  for (let k = 0; k < 6; k++) rock(g, (r() - .5) * 10, 0, (r() - .5) * 10, .8 + r() * 1.6, 0x8a7a6a, seed * 10 + k);
  return shadow(g); }
// arrecife alto (más alto que una casa) con corales encima
export function riff(parent, x, z, h = 26, seed = 2) { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const r = RNG(seed);
  for (let k = 0; k < 9; k++) { const rr = rock(g, (r() - .5) * 18, h * (.15 + r() * .5), (r() - .5) * 12, 5 + r() * 6, [0x9a8a72, 0x8a7a68, 0xa8987e][k % 3], seed * 3 + k); rr.scale.y *= 1.6; }
  for (let k = 0; k < 5; k++) koralle(g, (r() - .5) * 16, (r() - .5) * 10, .7, seed * 7 + k, .2).position.y = h * (.4 + r() * .5);
  return g; }
// huesos de ballena: costillas en arco, columna y cráneo
export function walknochen(parent, x, z, ry = 0, s = 1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); parent.add(g); const bm = mat(0xeee4cc, { roughness: .8 });
  for (let k = 0; k < 9; k++) { const R = 9 - Math.abs(k - 3) * .7; const rib = new THREE.Mesh(new THREE.TorusGeometry(R, .42 - k * .02, 8, 24, PI * .92), bm); rib.position.set(0, -.6, -k * 3.2); rib.rotation.z = .12; g.add(rib); }
  for (let k = 0; k < 16; k++) { const v = sphere(.9, bm, g, 0, .6, 3 - k * 2.2, 10, 8); v.scale.set(1.4, .9, .8); }
  const sk = sphere(5, bm, g, 0, 1.6, 10, 18, 12); sk.scale.set(1, .5, 1.8); sphere(1, mat(0x2a2420), g, 2.8, 2.4, 11, 8, 6); return shadow(g); }
// pecio oxidado: proa de un barco que sale de la arena
export function wrack(parent, x, z, ry = 0, s = 1, o = {}) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); parent.add(g);
  const rt = RUST.clone(); rt.repeat.set(.08, .08); rt.needsUpdate = true; const rm = new THREE.MeshStandardMaterial({ map: rt, roughness: .8, metalness: .3, side: THREE.DoubleSide }), L = o.len ?? 46;
  // casco: perfil de cubierta (planta) con proa en punta, extruido hacia arriba (altura del casco)
  const pl = new THREE.Shape(); pl.moveTo(-7, -L / 2); pl.lineTo(7, -L / 2); pl.lineTo(7.4, L * .2); pl.quadraticCurveTo(6, L * .42, 0, L / 2 + 4); pl.quadraticCurveTo(-6, L * .42, -7.4, L * .2); pl.closePath();
  const inner = new THREE.Group(); inner.rotation.set(-.18, 0, o.roll ?? .35); inner.position.y = -3; g.add(inner);
  const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(pl, { depth: 12, bevelEnabled: true, bevelSize: 1.2, bevelThickness: 1.2, bevelSegments: 2 }), rm); hull.rotation.x = -PI / 2; inner.add(hull);
  const p = hull.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const zz = p.getZ(i); const k = clamp(zz / 12); const xx = p.getX(i); p.setX(i, xx * (.55 + k * .45)); } hull.geometry.computeVertexNormals();
  box(13, .5, L * .9, new THREE.MeshStandardMaterial({ map: rt, color: 0x8a7a6a, roughness: .9 }), .05, inner, 0, 12.2, 0);
  const red = mat(0x7a2a1a, { roughness: .8 }); box(15.2, 2.6, L * .8, red, .1, inner, 0, 1.2, -2);
  if (o.cabin !== false) { box(10, 7, 8, new THREE.MeshStandardMaterial({ map: rt, color: 0xd8d0c0, roughness: .8 }), .2, inner, 0, 16, -L * .32); for (let k = 0; k < 4; k++) box(1.6, 1.4, .3, mat(0x1a1a1a), .02, inner, -3.6 + k * 2.4, 17, -L * .32 + 4.1); cyl(1.2, 1.4, 6, red, 12, inner, 0, 22, -L * .4); }
  const rail = mat(0x6a5a4a, { metalness: .5, roughness: .6 }); for (let k = 0; k < 14; k++) for (const sd of [-1, 1]) cyl(.08, .08, 1.8, rail, 4, inner, sd * 6.4, 13.4, -L * .4 + k * L * .06);
  for (let k = 0; k < 7; k++) rock(g, (k - 3) * 6, 0, (k % 3 - 1) * 10, 1.6 + (k % 2), 0x8a7a64, k + 40);
  return shadow(g); }
// barco pirata tumbado de lado
export function piratenschiff(parent, x, z, ry = 0, tilt = .55) { const outer = new THREE.Group(); outer.position.set(x, 0, z); outer.rotation.y = ry; parent.add(outer); const g = new THREE.Group(); g.rotation.z = tilt; g.position.y = 2; outer.add(g);
  const wm = new THREE.MeshStandardMaterial({ map: WOOD, color: 0x7a5a3a, roughness: .85 }), dk = new THREE.MeshStandardMaterial({ map: WOOD, color: 0x3a2a1a, roughness: .9 });
  const sh = new THREE.Shape(); sh.moveTo(-6, 9); sh.quadraticCurveTo(-7, 1, 0, -1); sh.quadraticCurveTo(7, 1, 6, 9); sh.closePath();
  const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 52, bevelEnabled: true, bevelSize: 1, bevelThickness: 2, bevelSegments: 3 }), dk); hull.position.z = -26; g.add(hull);
  box(12, .5, 50, wm, .05, g, 0, 9, 0); box(13, 5, 10, dk, .1, g, 0, 12, -22); box(12, 3, 6, dk, .1, g, 0, 10.5, 24);
  for (let k = 0; k < 7; k++) { const gp = cyl(.5, .5, 1.4, mat(0x1a1a1a), 10, g, 6.4, 6, -18 + k * 6); gp.rotation.z = PI / 2; }
  box(.2, 1.2, 50, mat(0xd8a030, { metalness: .5 }), .02, g, 6.6, 8.4, 0);
  const masts = []; for (const [mz, mh] of [[-12, 46], [8, 52]]) { const m = cyl(.7, .9, mh, wm, 10, g, 0, 9 + mh / 2, mz); masts.push({ z: mz, h: mh });
    for (const yy of [mh * .45, mh * .8]) { const yd = cyl(.35, .35, 18, wm, 6, g, 0, 9 + yy, mz); yd.rotation.z = PI / 2; const sail = new THREE.Mesh(new THREE.PlaneGeometry(16, mh * .3, 8, 4), new THREE.MeshStandardMaterial({ color: 0xd8ccb0, roughness: .9, side: THREE.DoubleSide })); const sp = sail.geometry.attributes.position; for (let i = 0; i < sp.count; i++) sp.setZ(i, Math.sin((sp.getY(i) / (mh * .3) + .5) * PI) * 1.6 - (Math.abs(sp.getX(i)) > 7 ? 1.4 : 0)); sail.geometry.computeVertexNormals(); sail.position.set(0, 9 + yy - mh * .16, mz + 1); g.add(sail); }
    const nest = cyl(2.2, 1.7, 2, wm, 14, g, 0, 9 + mh * .86, mz); g.userData.nest = g.userData.nest || []; g.userData.nest.push(V(0, 9 + mh * .86 + 1, mz)); }
  const rope = mat(0x4a3a2a, { roughness: 1 }); for (const m of masts) for (const s of [-1, 1]) for (let k = 0; k < 4; k++) { const a = V(s * 6, 9.5, m.z - 4 + k * 2.6), b = V(0, 9 + m.h * .82, m.z); const l = a.distanceTo(b), c = cyl(.08, .08, l, rope, 4, g); c.position.copy(a).add(b).multiplyScalar(.5); c.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); }
  // bandera pirata
  const fl = textPlane(7, 4.6, 256, 168, (c, w, h) => { c.fillStyle = '#141414'; c.fillRect(0, 0, w, h); c.fillStyle = '#f4f2ec'; c.beginPath(); c.arc(w / 2, h * .42, 34, 0, 7); c.fill(); c.fillRect(w / 2 - 22, h * .5, 44, 26); c.fillStyle = '#141414'; c.beginPath(); c.arc(w / 2 - 13, h * .42, 9, 0, 7); c.arc(w / 2 + 13, h * .42, 9, 0, 7); c.fill(); c.strokeStyle = '#f4f2ec'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(w / 2 - 70, h * .62); c.lineTo(w / 2 + 70, h * .92); c.moveTo(w / 2 + 70, h * .62); c.lineTo(w / 2 - 70, h * .92); c.stroke(); });
  fl.material.side = THREE.DoubleSide; fl.position.set(0, 9 + 52 + 2.4, 8 + 3.6); fl.rotation.y = PI / 2; g.add(fl); cyl(.2, .2, 6, wm, 6, g, 0, 9 + 52 + 2, 8);
  for (let k = 0; k < 8; k++) rock(outer, (k - 4) * 6, 0, (k % 3 - 1) * 14, 2, 0x8a7a64, k + 60);
  g.userData.mast = (i, k) => { g.updateMatrixWorld(true); return V(0, 9 + masts[i].h * k, masts[i].z).applyMatrix4(g.matrixWorld); };
  outer.userData.ship = g; return shadow(outer); }
// cofre del tesoro lleno de algas
export function truhe(parent) { const g = new THREE.Group(); parent && parent.add(g); const w = new THREE.MeshStandardMaterial({ map: WOOD, color: 0x8a5a2a, roughness: .8 }), mt = mat(0x5a4a2a, { metalness: .7, roughness: .4 });
  box(3.6, 2.2, 2.4, w, .1, g, 0, 1.1, 0); for (const x of [-1.4, 1.4]) box(.3, 2.3, 2.5, mt, .03, g, x, 1.1, 0); const lid = new THREE.Group(); lid.position.set(0, 2.2, -1.2); g.add(lid); const lb = cyl(1.2, 1.2, 3.6, w, 16, lid, 0, 0, 1.2, ); lb.rotation.z = PI / 2; lb.scale.set(1, 1, 1); g.userData.lid = lid;
  const alg = mat(0x2a6a2a, { roughness: .6 }); for (let k = 0; k < 14; k++) { const s = cyl(.12, .2, 2.4, alg, 5, g, -1.4 + (k % 7) * .46, 2.4, -.6 + Math.floor(k / 7) * 1.1); s.rotation.set((k % 3 - 1) * .5, 0, (k % 4 - 1.5) * .4); } sphere(1.4, mat(0x3a7a2a, { roughness: .7 }), g, 0, 2, 0, 12, 8).scale.set(1.2, .4, .8);
  return shadow(g); }
// Muschelhorn (caracola): espiral cónica con boca rosada
export function muschelhorn(parent, s = 1) { const g = new THREE.Group(); parent && parent.add(g); const pts = []; for (let i = 0; i <= 60; i++) { const k = i / 60, a = k * PI * 5, r = (1 - k) * .9 + .05; pts.push(V(Math.cos(a) * r * .55, k * 3.4, Math.sin(a) * r * .55)); }
  const shellM = new THREE.MeshStandardMaterial({ color: 0xf4dcc4, roughness: .35 }); const radii = k => .15 + (1 - k) * 1.1;
  const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 1, 14); const p = tube.attributes.position, uv = tube.attributes.uv, C = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { const k = uv.getX(i); const pp = new THREE.CatmullRomCurve3(pts).getPoint(k); C.set(p.getX(i), p.getY(i), p.getZ(i)).sub(pp).multiplyScalar(radii(k)); p.setXYZ(i, pp.x + C.x, pp.y + C.y, pp.z + C.z); } tube.computeVertexNormals();
  const m = new THREE.Mesh(tube, shellM); m.rotation.z = -PI / 2; g.add(m); const lip = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.8, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0xff9aa8, roughness: .3, side: THREE.DoubleSide })); lip.rotation.z = PI / 2; lip.position.set(.2, 0, 0); g.add(lip);
  for (let k = 0; k < 6; k++) { const sp = new THREE.Mesh(new THREE.ConeGeometry(.16, .6, 6), shellM); sp.position.set(-.6 - k * .45, .7 - k * .05, 0); g.add(sp); }
  const st = mat(0xb08060, { roughness: .5 }); for (let k = 0; k < 5; k++) { const b = new THREE.Mesh(new THREE.TorusGeometry(.9 - k * .14, .06, 4, 20), st); b.rotation.y = PI / 2; b.position.x = -.4 - k * .5; g.add(b); }
  g.scale.setScalar(s); return shadow(g); }
// concha suelta (para manos y estanterías)
export function muschel(col = 0xf4dcc4, s = 1) { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 14, 8, 0, PI * 2, 0, PI / 2), mat(col, { roughness: .4 })); m.scale.set(1, .5, .9); g.add(m);
  const rib = mat(new THREE.Color(col).multiplyScalar(.82).getHex(), { roughness: .5 }); for (let k = -3; k <= 3; k++) { const r = box(.06, .05, .9, rib, 0, g, k * .13, .12, 0); r.rotation.y = k * .18; } box(.4, .1, .2, mat(col), .03, g, 0, .02, -.45); g.scale.setScalar(s); return shadow(g); }
// gaviotas (bandada propia, blancas con alas grises de punta negra)
export function moewen(scene, n = 40) { const birds = [], wb = mat(0xf4f4f2, { roughness: .6 }), wg = mat(0xb8c0c8, { roughness: .6, side: THREE.DoubleSide }), bk = mat(0x1a1a1a), bl = mat(0xf0c020);
  for (let i = 0; i < n; i++) { const g = new THREE.Group(); scene.add(g); const b = sphere(.5, wb, g, 0, 0, 0, 10, 8); b.scale.set(.75, .7, 1.7); sphere(.32, wb, g, 0, .28, .9, 8, 6); const bk_ = new THREE.Mesh(new THREE.ConeGeometry(.08, .4, 6), bl); bk_.rotation.x = PI / 2; bk_.position.set(0, .26, 1.3); g.add(bk_);
    const wings = [-1, 1].map(s => { const p = new THREE.Group(); p.position.x = s * .3; g.add(p); const w = box(1.9, .06, .7, wg, .02, p, s * .95, 0, 0); box(.6, .07, .55, bk, .02, p, s * 1.9, 0, -.05); return p; }); birds.push({ g, wings }); g.visible = false; }
  noOut({ traverse: f => birds.forEach(b => b.g.traverse(f)) });
  return { birds, hide() { birds.forEach(b => b.g.visible = false); },
    fly(T, c, dir, o = {}) { const n_ = o.n ?? n; birds.forEach((b, i) => { b.g.visible = i < n_; if (i >= n_) return; const r = RNG(i * 7 + 3), sp = o.speed ?? 14;
        const off = V((r() - .5) * (o.sx ?? 60), (r() - .5) * (o.sy ?? 16), (r() - .5) * (o.sz ?? 60)), t = (o.lt ?? 0) * sp + r() * (o.spread ?? 6);
        b.g.position.set(c.x + off.x + dir.x * t, c.y + off.y + Math.sin(T * 1.3 + i) * .8, c.z + off.z + dir.z * t); b.g.rotation.set(0, Math.atan2(dir.x, dir.z), Math.sin(T * 2 + i) * .15); b.g.scale.setScalar(o.s ?? 1);
        const fl = Math.sin(T * 9 + i * 1.7) * (o.glide ? .25 : .9); b.wings[0].rotation.z = fl; b.wings[1].rotation.z = -fl; }); } }; }

// ---------- el mar y la gran ola ----------
export function meer(parent, z0 = 60, len = 6000) { const m = new THREE.MeshStandardMaterial({ color: 0x1e5a68, roughness: .06, metalness: .1, normalMap: WNOR, normalScale: new THREE.Vector2(.5, .5), envMapIntensity: 1.3 });
  WNOR.repeat.set(80, 80); const p = new THREE.Mesh(new THREE.PlaneGeometry(8000, len, 1, 1), m); p.rotation.x = -PI / 2; p.position.set(0, 0, z0 + len / 2); p.receiveShadow = true; p.userData.noOutline = true; parent.add(p); return p; }
// la ola: perfil que rompe, extruido a lo largo de x. k = altura relativa (0..1), curl = cuánto se curva la cresta
export function welle(parent, width = 1600) { const g = new THREE.Group(); parent.add(g); const nx = 240, nv = 64;
  const geo = new THREE.PlaneGeometry(1, 1, nx, nv), col = new Float32Array(geo.attributes.position.count * 3); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .16, metalness: .0, normalMap: WNOR, normalScale: new THREE.Vector2(.5, .5), envMapIntensity: .55, emissive: 0xffffff, emissiveIntensity: 0, side: THREE.DoubleSide });
  m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance = vColor.rgb * vec3(.25,.9,.7) * smoothstep(.5,.78,vColor.g) * (1. - smoothstep(.85,.95,vColor.r)) * emissive.r;'); };
  const mesh = new THREE.Mesh(geo, m); mesh.receiveShadow = true; mesh.userData.noOutline = true; g.add(mesh);
  const fm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9, emissive: 0xb8c8d0, emissiveIntensity: .25 }); const NF = 3200;
  const foam = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), fm, NF); foam.userData.noOutline = true; foam.castShadow = false; foam.frustumCulled = false; g.add(foam);
  const sm = new THREE.MeshBasicMaterial({ color: 0xf4fbff, transparent: true, opacity: .55, depthWrite: false }); const NS = 900;
  const spray = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), sm, NS); spray.userData.noOutline = true; spray.frustumCulled = false; g.add(spray);
  // perfil (z, y) para altura 1; z negativo = delante (hacia el acantilado)
  const PR = [[-1.6, 0], [-1.0, .02], [-.55, .08], [-.22, .22], [-.02, .42], [.06, .62], [.02, .8], [-.12, .94], [-.34, 1.02], [-.56, .98], [-.68, .86], [-.62, .8], [-.5, .9], [-.3, 1.04], [.05, 1.1], [.5, 1.02], [1.2, .72], [2.2, .36], [3.6, .1], [5, 0]];
  const curve = new THREE.CatmullRomCurve3(PR.map(([z, y]) => V(0, y, z)), false, 'catmullrom', .5); const PTS = curve.getSpacedPoints(nv); const N = vnoise(41), d = new THREE.Object3D();
  const vlip = 10 / (PR.length - 1);
  g.userData.set = (T, Hh, curl = .5, o = {}) => { const p = geo.attributes.position, w = o.w ?? width;
    for (let j = 0; j <= nv; j++) { const v = j / nv, P = PTS[j]; for (let i = 0; i <= nx; i++) { const idx = j * (nx + 1) + i, u = i / nx, x = (u - .5) * w;
      const loc = .75 + N(u * 14 + T * .05, 3, 3) * .5, hh = Hh * loc, c = curl * (.6 + N(u * 9, 7, 2) * .8);
      const lipK = clamp(1 - Math.abs(v - vlip) * 5) , zz = P.z * hh * (1 + (P.z < 0 && P.y > .7 ? (c - .5) * .8 : 0)) - lipK * (c - .5) * hh * .2, yy = P.y * hh + Math.sin(u * 60 + T * 2) * Hh * .006;
      p.setXYZ(idx, x, yy, zz + Math.sin(u * 23 + T) * Hh * .02);
      const face = clamp((v - .1) / .35), top = clamp((v - .3) / .18), crest = clamp(1 - Math.abs(v - vlip) * 9), toe = clamp(1 - v / .12), back = clamp((v - .62) / .15);
      let r = lerp(.01, .03, face), gg = lerp(.06, .24, face), b = lerp(.08, .24, face); r = lerp(r, .12, top); gg = lerp(gg, .6, top); b = lerp(b, .46, top);
      r = lerp(r, .03, back); gg = lerp(gg, .2, back); b = lerp(b, .24, back);
      const fs = N(u * 120, v * 30 + T * .8, 2); const fw = Math.max(crest, toe * (.7 + fs * .3), (v < .5 && fs > .68) ? (fs - .68) * 2.5 : 0);
      r = lerp(r, .92, fw); gg = lerp(gg, .97, fw); b = lerp(b, .97, fw);
      col[idx * 3] = r; col[idx * 3 + 1] = gg; col[idx * 3 + 2] = b; } }
    p.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.computeVertexNormals(); m.emissive.setRGB(o.glow ?? .6, 0, 0);
    const r = RNG(5); for (let i = 0; i < NF; i++) { const u = r(), x = (u - .5) * w, kind = i % 4, jit = Math.sin(T * 3 + i) * .3; let P;
      if (kind === 0) { P = V(0, r() * .05, -1.6 + r() * 1.3); } else if (kind === 1) { P = V(0, .06 + r() * .12, -.55 + r() * .4); } else { const q = clamp(vlip + (r() - .5) * .12, 0, 1); P = curve.getPoint(q).clone(); P.y += r() * .05; }
      const loc = .75 + N(u * 14 + T * .05, 3, 3) * .5; d.position.set(x, P.y * Hh * loc + jit, P.z * Hh * loc); const s = (kind < 2 ? .7 + r() * 1.6 : .35 + r() * .9) * Hh / 60 * (o.foam ?? 1); d.scale.set(s * (1.6 + r()), s * (.35 + r() * .3), s * (1.2 + r() * .5)); d.rotation.set(r() * 3, r() * 3, r() * 3); d.updateMatrix(); foam.setMatrixAt(i, d.matrix); }
    foam.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < NS; i++) { const u = r(), x = (u - .5) * w, P = curve.getPoint(clamp(vlip - .02 + r() * .06)), loc = .75 + N(u * 14 + T * .05, 3, 3) * .5, t = (T * (.6 + r() * .5) + r()) % 1;
      d.position.set(x, (P.y * loc + t * .22) * Hh, (P.z * loc + .1 + t * .15) * Hh); const s = (.3 + r() * .9) * Hh / 60 * (1 - t * .6); d.scale.setScalar(s); d.updateMatrix(); spray.setMatrixAt(i, d.matrix); } spray.instanceMatrix.needsUpdate = true; };
  g.userData.set(0, 60, .5); return g; }
// partículas de agua: salpicadura (columna que sube y cae) y lluvia
export function spritzer(scene, n = 1400) { const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .3, transparent: true, opacity: .85, emissive: 0x9ab0b8, emissiveIntensity: .25, depthWrite: false });
  const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), m, n); im.userData.noOutline = true; im.frustumCulled = false; scene.add(im); const d = new THREE.Object3D();
  im.userData.burst = (c, t, o = {}) => { const r = RNG(o.seed ?? 3), H_ = o.h ?? 160, sx = o.sx ?? 260; im.visible = t >= 0; let k = 0;
    for (let i = 0; i < n; i++) { const x0 = (r() - .5) * sx, v = (.55 + r() * .6) * Math.sqrt(2 * 9.8 * H_ / 4) * 2, dz = (r() - .2) * 30, tt = Math.max(0, t - r() * .15);
      const y = v * tt - 9.8 * 2 * tt * tt * .9; if (y < -2) { d.scale.setScalar(.001); } else { d.position.set(c.x + x0 + (r() - .5) * tt * 18, c.y + y, c.z + dz * tt * .6); const s = (o.s ?? 1.4) * (.4 + r() * 1.4) * (1 + tt * .6); d.scale.set(s, s * (1 + Math.min(2, v * .02)), s); }
      d.rotation.set(r() * 6, r() * 6, 0); d.updateMatrix(); im.setMatrixAt(i, d.matrix); k++; } im.instanceMatrix.needsUpdate = true; };
  return im; }
export function regen(scene, n = 1600) { const m = new THREE.MeshBasicMaterial({ color: 0xd8e4ee, transparent: true, opacity: .5, depthWrite: false }); const im = new THREE.InstancedMesh(new THREE.BoxGeometry(.05, 2.6, .05), m, n); im.userData.noOutline = true; im.frustumCulled = false; scene.add(im); const d = new THREE.Object3D();
  im.userData.set = (c, T, o = {}) => { const r = RNG(9), R = o.r ?? 60, Hh = o.h ?? 60; for (let i = 0; i < n; i++) { const y = Hh - ((T * (40 + r() * 15) + r() * Hh) % Hh); d.position.set(c.x + (r() - .5) * R * 2, c.y + y - Hh * .3, c.z + (r() - .5) * R * 2); d.rotation.set(0, 0, .12); d.updateMatrix(); im.setMatrixAt(i, d.matrix); } im.instanceMatrix.needsUpdate = true; };
  return im; }
export function regenbogen(scene) { const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { a: { value: .5 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform float a; varying vec2 vUv; vec3 hsv(float h){ return clamp(abs(mod(h*6.+vec3(0,4,2),6.)-3.)-1.,0.,1.); } void main(){ float r=vUv.y; float k=smoothstep(0.,.15,r)*smoothstep(1.,.85,r); gl_FragColor=vec4(hsv(r*.8),k*a); }' });
  const g = new THREE.Mesh(new THREE.RingGeometry(600, 660, 96, 4, 0, PI), m); g.userData.noOutline = true; g.renderOrder = 2; scene.add(g); g.visible = false; return g; }

// ---------- el set principal: Möwensand sobre el acantilado + fondo marino ----------
export function moewensand(scene) { const g = new THREE.Group(); scene.add(g); const r = RNG(77);
  // fondo marino: plano grande con arena de ondas; parches húmedos con vertex color
  const sea = new THREE.PlaneGeometry(4000, 4000, 200, 200), sp = sea.attributes.position, sc = new Float32Array(sp.count * 3), N = vnoise(12);
  for (let i = 0; i < sp.count; i++) { const x = sp.getX(i), y = sp.getY(i), n = N(x * .004 + 50, y * .004, 4), w = N(x * .012, y * .012 + 9, 3); const zz = -y + 2000;
    sp.setZ(i, (n - .5) * 3 + Math.max(0, 30 - zz) * -.0);
    const wet = clamp((w - .5) * 3) ; const b = .92 + n * .16 - wet * .26; sc[i * 3] = b; sc[i * 3 + 1] = b * .98; sc[i * 3 + 2] = b * (.96 + wet * .04); }
  sea.setAttribute('color', new THREE.BufferAttribute(sc, 3)); sea.computeVertexNormals();
  const sm = new THREE.MeshStandardMaterial({ map: SAND.col, normalMap: SAND.nor, roughnessMap: SAND.rough, vertexColors: true, roughness: 1, normalScale: new THREE.Vector2(1.6, 1.6), envMapIntensity: .9 });
  for (const t of [SAND.col, SAND.nor, SAND.rough]) t.repeat.set(70, 70);
  const floor = new THREE.Mesh(sea, sm); floor.rotation.x = -PI / 2; floor.position.set(0, 0, 2000 - 6); floor.receiveShadow = true; floor.userData.noOutline = true; g.add(floor);
  // acantilado y meseta
  cliffFace(g, -1100, 1100, CH, 3);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(2200, 900), new THREE.MeshStandardMaterial({ map: GRASS, roughness: .95 })); GRASS.repeat.set(180, 70); top.rotation.x = -PI / 2; top.position.set(0, CH, -450); top.receiveShadow = true; top.userData.noOutline = true; g.add(top);
  const prom = new THREE.Mesh(new THREE.PlaneGeometry(2200, 22), new THREE.MeshStandardMaterial({ map: PAVE, roughness: .85 })); PAVE.repeat.set(180, 2); prom.rotation.x = -PI / 2; prom.position.set(0, CH + .05, -15); prom.receiveShadow = true; prom.userData.noOutline = true; g.add(prom);
  box(2200, 2.2, 1.6, mat(0xb8a890, { roughness: .9 }), .05, g, 0, CH + 1.1, -4.6); railing(g, -400, 400, -4.4, CH + 2.2);
  const street = new THREE.Mesh(new THREE.PlaneGeometry(2200, 18), new THREE.MeshStandardMaterial({ map: PAVE, color: 0xb0a8a0, roughness: .85 })); street.rotation.x = -PI / 2; street.position.set(0, CH + .04, -53); street.receiveShadow = true; street.userData.noOutline = true; g.add(street);
  // casas: dos filas (frente al mar y detrás)
  const shops = { 3: 'FISCHBRÖTCHEN', 6: 'BÄCKEREI', 9: 'MUSCHEL-LADEN', 13: 'CAFÉ MÖWE', 16: 'APOTHEKE' };
  for (let k = 0; k < 22; k++) { const x = -260 + k * 24 + (r() - .5) * 4, w = 15 + r() * 6;
    giebelHaus(g, x, -34, { w, d: 16, fl: 2 + (r() < .35), seed: k, ry: 0, shop: shops[k], reet: k % 5 === 2, rose: k % 4 === 1, bench: k % 6 === 4, plaster: k % 7 === 5 ? 0xf4f0e4 : (k % 9 === 7 ? 0xe8d8a8 : null), tile2: k % 3 === 0 }).position.y = CH; }
  for (let k = 0; k < 24; k++) { const x = -280 + k * 24 + (r() - .5) * 6; giebelHaus(g, x, -96, { w: 15 + r() * 6, d: 16, fl: 2 + (r() < .5), seed: k + 40, reet: k % 4 === 1, tile2: k % 2 === 0 }).position.y = CH; }
  for (let k = 0; k < 28; k++) { const x = -330 + k * 25; giebelHaus(g, x, -140 - (k % 2) * 8, { w: 16, d: 14, fl: 3, seed: k + 80, tile2: k % 3 === 1, reet: k % 5 === 3 }).position.y = CH; }
  // iglesia de ladrillo con torre
  { const ch = new THREE.Group(); ch.position.set(70, CH, -200); g.add(ch); const bm = new THREE.MeshStandardMaterial({ map: BRICK, roughness: .9 }); box(22, 22, 44, bm, .1, ch, 0, 11, 0); box(12, 52, 12, bm, .1, ch, 0, 26, 24); const sp = new THREE.Mesh(new THREE.ConeGeometry(9, 30, 4), mat(0x3a6a5a, { roughness: .5, metalness: .3 })); sp.rotation.y = PI / 4; sp.position.set(0, 67, 24); ch.add(sp); window_(ch, 0, 38, 30.2, 3, 5); shadow(ch); }
  leuchtturm(g, 150, -16).position.y = CH;
  // farolas, bancos, banderines, cartel de la regla
  const LAMPS = []; for (let k = 0; k < 18; k++) { const l = laterne(g, -220 + k * 26, -8, CH); l.userData.keep = true; LAMPS.push(l); }
  for (let k = 0; k < 8; k++) bank(g, -190 + k * 52, CH, -9, PI);
  for (let k = 0; k < 9; k++) bunting(g, V(-220 + k * 26, CH + 12, -8), V(-220 + (k + 1) * 26, CH + 12, -8), 2.4);
  const REGEL = schild(g, ['VOR SONNENUNTERGANG', 'ZURÜCK AN LAND!'], -60, CH + 7, -12, 0, 16, 7, { line: true }); REGEL.userData.keep = true;
  // árboles
  for (let k = 0; k < 30; k++) { const x = -300 + r() * 600, z = -66 - r() * 10; if (Math.abs(x % 24) < 6) continue; const t = new THREE.Group(); t.position.set(x, CH, z); g.add(t); cyl(.5, .7, 7, mat(0x5a4030), 6, t, 0, 3.5, 0); for (let j = 0; j < 4; j++) sphere(3 + r() * 1.5, mat([0x3a6a2a, 0x4a7a32, 0x2e5a26][j % 3], { roughness: .9 }), t, (r() - .5) * 3, 8 + r() * 3, (r() - .5) * 3, 10, 8); shadow(t); }
  // escaleras de mano en el acantilado (frente al pueblo)
  const LEIT = []; for (let k = 0; k < 14; k++) LEIT.push(keep(leiter(g, -170 + k * 26 + (r() - .5) * 6, 14, CH + 1, 13, { col: [0xc89060, 0xb07848, 0xd8a070][k % 3] })));
  // rocas al pie
  for (let k = 0; k < 70; k++) rock(g, -500 + r() * 1000, 0, 6 + r() * 18, 1.2 + r() * 4.5, [0x8a7a68, 0x9a8a74, 0x6a6058][k % 3], k + 100);
  // fondo marino: conchas, piedras, charcos, corales, arrecifes, pecios, huesos y el barco pirata
  strandgut(g, 0, 90, 260, 70, 2600, 5); strandgut(g, 0, 330, 300, 150, 2600, 6); strandgut(g, 0, 760, 360, 260, 2600, 7);
  charcos(g, 0, 150, 320, 110, 50, 3); charcos(g, 0, 560, 400, 300, 70, 4); charcos(g, 0, 1300, 600, 400, 50, 5);
  for (let k = 0; k < 16; k++) koralle(g, -280 + r() * 560, 240 + r() * 480, .9 + r() * .8, k + 1, .3);
  for (let k = 0; k < 7; k++) koralle(g, -150 + (k % 4 - 1.5) * 9, 296 + Math.floor(k / 4) * 9, 1.1, 90 + k, .45);
  const RIFFE = [riff(g, -90, 230, 30, 2), riff(g, 120, 300, 34, 3), riff(g, -200, 420, 28, 4), riff(g, 220, 520, 30, 5)];
  const WRACKS = [wrack(g, -60, 170, .5, 1, { len: 44 }), wrack(g, 90, 420, -.8, .9, { cabin: true }), wrack(g, -260, 640, 2.2, 1.2)];
  const KNOCHEN = walknochen(g, 40, 560, .6, 1.4);
  const SCHIFF = piratenschiff(g, 30, 1050, -.4, .5);
  // el mar lejano (horizonte) cuando hay marea baja
  const MEERF = meer(g, 1800, 6000); MEERF.userData.keep = true;
  g.traverse(m => { if (m.isMesh) m.receiveShadow = true; }); floor.castShadow = false; top.castShadow = false; bake(g);
  return { g, LAMPS, LEIT, RIFFE, WRACKS, KNOCHEN, SCHIFF, MEERF, REGEL }; }

// ---------- interiores ----------
// cuarto de Jonte: estanterías llenas de conchas, escritorio con caja de conchas, ventana al mar, cama
export function jonteZimmer(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g); const r = RNG(31);
  const wallM = new THREE.MeshStandardMaterial({ color: 0x3a6aa8, roughness: .8 }), plank = new THREE.MeshStandardMaterial({ map: WOOD, color: 0xe8d8c0, roughness: .7 });
  const fl = box(60, .4, 50, new THREE.MeshStandardMaterial({ map: WOOD, color: 0xd8b890, roughness: .6 }), 0, g, 0, -.2, 0); box(60, 30, 1, wallM, 0, g, 0, 15, -25); box(1, 30, 50, wallM, 0, g, -30, 15, 0); box(1, 30, 50, wallM, 0, g, 30, 15, 0); box(60, 1, 50, mat(0xf4f0e8), 0, g, 0, 30, 0);
  for (let k = 0; k < 4; k++) box(60, .4, .3, whiteM, 0, g, 0, 3 + k * 7, -24.4);
  // ventana con vista al mar
  const vw = textPlane(16, 11, 512, 352, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5a9ae8'); gr.addColorStop(.55, '#bcdcf8'); gr.addColorStop(.56, '#2a6a7a'); gr.addColorStop(1, '#1a4a5a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(60 + i * 80, 60 + (i % 2) * 30, 50, 18, 0, 0, 7); c.fill(); } }, .9);
  vw.position.set(12, 15, -24.3); g.add(vw); box(17, 1, 1, whiteM, 0, g, 12, 20.8, -24); box(17, 1, 1.6, whiteM, 0, g, 12, 9.3, -23.8); box(1, 12, 1, whiteM, 0, g, 3.6, 15, -24); box(1, 12, 1, whiteM, 0, g, 20.4, 15, -24); box(.6, 11, .6, whiteM, 0, g, 12, 15, -24);
  // estanterías con conchas (pared izquierda y fondo)
  const SH = []; for (const [sx, sz, ry] of [[-29, -6, PI / 2], [-12, -24.2, 0]]) { const s = new THREE.Group(); s.position.set(sx, 0, sz); s.rotation.y = ry; g.add(s); for (let k = 0; k < 7; k++) box(20, .4, 3, plank, .02, s, 0, 2 + k * 3.6, 1.5); for (const e of [-10, 10]) box(.5, 26, 3, plank, .02, s, e, 13, 1.5); box(20, 26, .3, mat(0xf4f0e8), 0, s, 0, 13, 0);
    for (let k = 0; k < 7; k++) for (let j = 0; j < 12; j++) { const mu = muschel([0xf4dcc4, 0xe8b8a8, 0xfff0e0, 0xd8a888, 0xf0c8d0, 0xe8e0c8][Math.floor(r() * 6)], .9 + r() * .7); mu.position.set(-9 + j * 1.6 + (r() - .5) * .3, 2.3 + k * 3.6, 1.6 + (r() - .5) * .6); mu.rotation.set(-.6, r() * 6, 0); s.add(mu); } SH.push(s); }
  // escritorio con lámpara y caja de conchas
  const DESK = new THREE.Group(); DESK.position.set(14, 0, -18); g.add(DESK); box(16, .6, 7, plank, .05, DESK, 0, 6.2, 0); for (const sx of [-7.4, 7.4]) box(.6, 6, 6.4, plank, .02, DESK, sx, 3, 0);
  const caja = new THREE.Group(); caja.position.set(-2, 6.5, 1); DESK.add(caja); box(7, .3, 4.6, plank, .02, caja, 0, 0, 0); for (let k = 0; k < 4; k++) box(.2, .8, 4.6, plank, 0, caja, -3.5 + k * 2.33, .4, 0); for (let k = 0; k < 3; k++) box(7, .8, .2, plank, 0, caja, 0, .4, -2.3 + k * 2.3);
  for (let k = 0; k < 6; k++) { const mu = muschel([0xf4dcc4, 0xff9aa8, 0xe8d8c8][k % 3], .9); mu.position.set(-2.4 + (k % 3) * 2.33, .4, -1.15 + Math.floor(k / 3) * 2.3); caja.add(mu); }
  const lamp = new THREE.Group(); lamp.position.set(5, 6.5, -1.5); DESK.add(lamp); cyl(.8, .8, .3, mat(0x2a6ad8), 12, lamp, 0, .15, 0); cyl(.12, .12, 4, mat(0x2a6ad8), 6, lamp, 0, 2, 0); const sh_ = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.4, 14, 1, true), mat(0x2a6ad8, { side: THREE.DoubleSide })); sh_.position.set(0, 4.2, .6); sh_.rotation.x = .8; lamp.add(sh_);
  // cama, alfombra, póster de faro, red de pesca con conchas
  const bed = new THREE.Group(); bed.position.set(18, 0, 8); g.add(bed); box(10, 3, 18, plank, .1, bed, 0, 1.5, 0); box(9.6, 1.4, 17, mat(0xf4f4f8), .3, bed, 0, 3.6, 0); box(9.8, 1, 10, mat(0x2a5a9a), .2, bed, 0, 4.2, 3); box(6, 1.2, 3, mat(0xffffff), .4, bed, 0, 4.6, -6.4);
  const rug = cyl(9, 9, .1, mat(0xe8d8b0, { roughness: 1 }), 30, g, -4, .05, 4); for (let k = 1; k < 4; k++) { const ri = new THREE.Mesh(new THREE.RingGeometry(k * 2.2, k * 2.2 + .6, 30), mat([0xc8202a, 0x2a6aa8, 0xffd23f][k - 1], { side: THREE.DoubleSide })); ri.rotation.x = -PI / 2; ri.position.set(-4, .12, 4); g.add(ri); }
  const pst = textPlane(6, 8.5, 192, 272, (c, w, h) => { c.fillStyle = '#f4e8d0'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a6aa8'; c.fillRect(0, h * .7, w, h * .3); for (let k = 0; k < 6; k++) { c.fillStyle = k % 2 ? '#fff' : '#c8202a'; c.fillRect(w / 2 - 22 + k * 1.5, h * .2 + k * 26, 44 - k * 3, 26); } c.fillStyle = '#1a2a4a'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.fillText('MÖWENSAND', w / 2, h - 18); });
  pst.position.set(29.4, 16, 6); pst.rotation.y = -PI / 2; g.add(pst);
  return { g, DESK, caja, SH, bed }; }
// salón de Opa: sillón, chimenea, barco en botella, foto antigua de la última Ebbe
export function opaStube(scene, X) { const g = new THREE.Group(); g.position.x = X; scene.add(g); const wall = new THREE.MeshStandardMaterial({ map: WOOD, color: 0xd8c8a8, roughness: .8 });
  box(60, .4, 50, new THREE.MeshStandardMaterial({ map: WOOD, color: 0x9a6a3a, roughness: .6 }), 0, g, 0, -.2, 0); box(60, 30, 1, wall, 0, g, 0, 15, -25); box(1, 30, 50, wall, 0, g, -30, 15, 0); box(1, 30, 50, wall, 0, g, 30, 15, 0); box(60, 1, 50, mat(0xf4f0e8), 0, g, 0, 30, 0);
  box(60, 9, 1.2, new THREE.MeshStandardMaterial({ map: WOOD, color: 0x6a4a2a }), 0, g, 0, 4.5, -24.5);
  const fire = new THREE.Group(); fire.position.set(-12, 0, -23); g.add(fire); const bm = new THREE.MeshStandardMaterial({ map: BRICK, roughness: .9 }); box(14, 12, 3, bm, .1, fire, 0, 6, 0); box(8, 6, 2, mat(0x1a1210), 0, fire, 0, 3.5, 1); box(16, 1, 4, mat(0x6a4a2a), .05, fire, 0, 12.4, .5);
  const fl = sphere(1.6, new THREE.MeshStandardMaterial({ color: 0xffa040, emissive: 0xff6a10, emissiveIntensity: 3 }), fire, 0, 2.2, 1.6, 10, 8); fl.scale.set(1.6, 1, .6); fl.userData.noOutline = true; g.userData.flame = fl;
  const bot = new THREE.Group(); bot.position.set(-15, 13.4, -22.6); g.add(bot); const gl = cyl(1, 1, 5, new THREE.MeshStandardMaterial({ color: 0xcfe8e0, transparent: true, opacity: .35, roughness: .05 }), 16, bot, 0, 1, 0); gl.rotation.z = PI / 2; box(2.6, .6, .7, mat(0x6a3a1a), .05, bot, 0, .6, 0); box(.1, 1.6, .1, mat(0x3a2a1a), 0, bot, 0, 1.4, 0);
  const foto = textPlane(9, 6, 360, 240, (c, w, h) => { c.fillStyle = '#d8c8a0'; c.fillRect(0, 0, w, h); c.fillStyle = '#8a7a5a'; c.fillRect(0, h * .55, w, h * .45); c.fillStyle = '#5a4a3a'; c.fillRect(0, h * .3, w, h * .25); for (let k = 0; k < 9; k++) { c.fillStyle = '#3a2a1a'; c.fillRect(30 + k * 34, h * .6, 12, 30); c.beginPath(); c.arc(36 + k * 34, h * .58, 8, 0, 7); c.fill(); } c.fillStyle = '#2a1a0a'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.fillText('EBBE 1926', w / 2, h - 12); });
  foto.position.set(6, 17, -24.3); g.add(foto); box(10, 7, .4, mat(0x6a4a1a), .05, g, 6, 17, -24.6);
  const ses = new THREE.Group(); ses.position.set(4, 0, -6); g.add(ses); const lm = mat(0x6a2a1a, { roughness: .6 }); box(9, 3.6, 8, lm, .6, ses, 0, 2.6, 0); box(9, 7, 2, lm, .6, ses, 0, 6, -3.6); for (const s of [-1, 1]) box(1.6, 5, 8, lm, .6, ses, s * 4.4, 4, 0);
  const lamp = new THREE.PointLight(0xffb070, 60, 60, 1.5); lamp.position.set(-12, 6, -16); g.add(lamp); g.userData.lamp = lamp;
  return shadow(g); }
// Rathaus: sala con el Muschelhorn colgado y su placa
export function rathausSaal(scene, X, horn) { const g = new THREE.Group(); g.position.x = X; scene.add(g); const wall = new THREE.MeshStandardMaterial({ map: WOOD, color: 0xe8d8b8, roughness: .8 });
  box(70, .4, 60, new THREE.MeshStandardMaterial({ map: WOOD, color: 0x8a5a2a, roughness: .5 }), 0, g, 0, -.2, 0); box(70, 36, 1, wall, 0, g, 0, 18, -30); box(1, 36, 60, wall, 0, g, -35, 18, 0); box(1, 36, 60, wall, 0, g, 35, 18, 0); box(70, 1, 60, mat(0xf4f0e8), 0, g, 0, 36, 0);
  for (let k = 0; k < 5; k++) box(1.4, 36, 1.4, new THREE.MeshStandardMaterial({ map: WOOD, color: 0x6a4a2a }), .05, g, -28 + k * 14, 18, -29);
  const PLAQ = schild(g, ['NÄCHSTE EBBE:', 'MITTAGS BLASEN'], 0, 10, -29.2, 0, 15, 5.4, { bg: '#2a1e14', ink: '#e8c878', frame: 0x8a6a2a, posts: false, font: 'Georgia, serif' });
  const hp = new THREE.Group(); hp.position.set(0, 17.5, -28.6); g.add(hp); box(10, 5, .6, mat(0x5a3a1a), .3, hp, 0, 0, 0); if (horn) { horn.position.set(0, .2, 1.4); horn.rotation.set(0, 0, .1); hp.add(horn); }
  for (const s of [-1, 1]) { window_(g, s * 22, 18, -29.2, 8, 14); const fl = textPlane(4, 9, 64, 144, (c, w, h) => { c.fillStyle = '#1a2a6a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h * .4, 14, 0, 7); c.fill(); }); fl.position.set(s * 12, 20, -29.3); g.add(fl); }
  const PORT = []; for (let k = 0; k < 2; k++) { const p = textPlane(6, 8, 120, 160, (c, w, h) => { c.fillStyle = '#c8b898'; c.fillRect(0, 0, w, h); c.fillStyle = '#5a4a3a'; c.beginPath(); c.arc(w / 2, h * .4, 30, 0, 7); c.fill(); c.fillRect(w / 2 - 36, h * .62, 72, 60); }); p.position.set(k ? 30 : -30, 20, -29.2); g.add(p); box(7, 9, .3, mat(0xb08a3a, { metalness: .6 }), .05, g, k ? 30 : -30, 20, -29.5); PORT.push(p); }
  const lamp = new THREE.PointLight(0xffd8a0, 70, 80, 1.4); lamp.position.set(0, 26, -12); g.add(lamp);
  return { g: shadow(g), PLAQ, hp }; }

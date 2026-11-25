// Portada «Wach-Check»: salón de noche, el alcalde en directo en la tele, Finn (sudadera azul) en shock, Lotte dormida en una silla.
import { THREE, mat, box, cyl, sphere, canvasTex, applyPose, makeComposer, outline, V, W, H } from './engine.js';
import { mk, hoodie, suit, topHat, mustache, hairS } from './props.js';
import { lightCone } from './roblox.js';
import { loadKitFaces, kitFace, aire } from './vivo.js';
await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); await loadKitFaces();
const SS = 2, Q = new URLSearchParams(location.search);
const R = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true }); R.setPixelRatio(SS); R.setSize(W, H); R.toneMapping = THREE.NeutralToneMapping; R.toneMappingExposure = 1.05;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.domElement.style.display = 'none'; document.getElementById('stage').appendChild(R.domElement);
const pose = (ch, p) => applyPose(ch, p);

// ---------- tele: el alcalde en el plató ----------
const ts = new THREE.Scene();
{ const bg = canvasTex(1024, 576, (c, w, h) => { const g = c.createRadialGradient(w / 2, h * .45, 30, w / 2, h * .5, w * .7); g.addColorStop(0, '#2f5cff'); g.addColorStop(.6, '#0c1f8a'); g.addColorStop(1, '#040a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(140,190,255,.22)'; c.lineWidth = 4; for (let i = 0; i < 18; i++) { c.beginPath(); c.moveTo(w / 2, h * .55); const a = i / 18 * Math.PI * 2; c.lineTo(w / 2 + Math.cos(a) * w, h * .55 + Math.sin(a) * w); c.stroke(); }
    c.fillStyle = '#c8ff2e'; c.font = '700 44px Lilita'; c.textAlign = 'center'; c.globalAlpha = .9; c.fillText('SCHLAF IST ZEITVERSCHWENDUNG', w / 2, h * .2); });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(30, 17), new THREE.MeshBasicMaterial({ map: bg })); p.position.set(0, 6, -8); ts.add(p);
  box(10, 2.4, 2.6, mat(0x12152a, { metalness: .5, roughness: .3 }), .1, ts, 0, 1.4, 1.6); box(10.05, .22, 2.65, mat(0xc8ff2e, { emissive: 0xc8ff2e, emissiveIntensity: 1 }), .02, ts, 0, 2.55, 1.6); }
const mayor = mk(ts, { seed: 12, scale: 1.05, skin: 0xe6e0d4, skinCss: '#e6e0d4', shirt: 0x141418, shirt2: 0x141418, cuffs: 0xffffff, pants: 0x141418, shoes: 0x111111, hair: 0x9a9a9a, hairBuild: hairS(0x9a9a9a, 'swoop'),
  torsoDetail: suit(0x141418, 0xffffff, 0x111111), face: { browColor: '#111111', iris: '#1a1a1a' } }, [o => { topHat(o.head, 0x111114, 0x8a0d16); mustache(o.head, 0x111111); }]);
kitFace(mayor, 'mustache'); mayor.root.position.set(0, 0, -.4); mayor.root.rotation.y = -.1;
pose(mayor, { aRx: 1.45, aRz: .15, aRe: .2, aLx: .3, aLz: .1, aLe: .9, headX: .05, headZ: .05, lean: .06 }); mayor.setFace({ expr: 'shout' });
ts.add(new THREE.HemisphereLight(0xcfe0ff, 0x1a2040, 1.4)); { const k = new THREE.DirectionalLight(0xffffff, 2.4); k.position.set(4, 9, 9); ts.add(k); const r = new THREE.DirectionalLight(0x7aa8ff, 3); r.position.set(-6, 7, -5); ts.add(r); }
const tcam = new THREE.PerspectiveCamera(30, 16 / 9, .1, 100); tcam.position.set(-.8, 5.4, 9.5); tcam.lookAt(0, 5.0, 0);
const rt = new THREE.WebGLRenderTarget(1600, 900, { samples: 8 }); rt.texture.colorSpace = THREE.SRGBColorSpace;

// ---------- salón ----------
const sc = new THREE.Scene(); sc.background = new THREE.Color(0x07051a); sc.fog = new THREE.FogExp2(0x0c0824, .018);
const wallT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#4b3f86'; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#463a7e' : '#51458e'; c.fillRect(i * 32, 0, 32, h); } c.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { c.beginPath(); c.arc(i * 32 + 16, j * 32 + 16, 3, 0, 7); c.fill(); } }, true); wallT.repeat.set(10, 5);
const wallM = mat(0xffffff, { map: wallT, roughness: .95 });
const flT = canvasTex(256, 256, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ['#6a4630', '#5e3e2a', '#724c34', '#58392a'][i % 4]; c.fillRect(0, i * 32, w, 31); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, i * 32 + 31, w, 1); c.fillRect((i * 97) % w, i * 32, 1, 32); } }, true); flT.repeat.set(5, 5);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), mat(0xffffff, { map: flT, roughness: .55 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
const back = new THREE.Mesh(new THREE.PlaneGeometry(50, 26), wallM); back.position.set(0, 13, -6); back.receiveShadow = true; sc.add(back);
box(50, .6, .3, mat(0x2c2350), 0, sc, 0, .3, -5.85);
// alfombra
{ const rugT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#8a2a4a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e8b04a'; c.lineWidth = 10; c.strokeRect(18, 18, w - 36, h - 36); c.lineWidth = 4; c.strokeRect(40, 40, w - 80, h - 80); });
  const r = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), mat(0xffffff, { map: rugT, roughness: .95 })); r.rotation.x = -Math.PI / 2; r.position.set(.5, .02, 3); r.receiveShadow = true; sc.add(r); }
// ventana: el pueblo de noche, todas las luces encendidas
const WX = -5.6, WY = 7.0;
{ const town = canvasTex(512, 640, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a1040'); g.addColorStop(1, '#2a2a7a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#fff'; for (let i = 0; i < 70; i++) { c.globalAlpha = .3 + (i % 5) * .14; c.fillRect((i * 137) % w, (i * 71) % (h * .45), 2, 2); } c.globalAlpha = 1;
    c.fillStyle = '#fff6d8'; c.shadowColor = '#fff2b0'; c.shadowBlur = 40; c.beginPath(); c.arc(w * .76, h * .14, 34, 0, 7); c.fill(); c.shadowBlur = 0;
    const houses = [[-10, 300, 130, '#2a2346'], [110, 260, 120, '#251f40'], [222, 320, 140, '#2e264c'], [352, 280, 170, '#221c3c']];
    for (const [x, y, ww, col] of houses) { c.fillStyle = col; c.fillRect(x, y, ww, h - y); c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x + ww / 2, y - 80); c.lineTo(x + ww + 8, y); c.fill();
      c.strokeStyle = '#120e22'; c.lineWidth = 5; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x, y + k * 90); c.lineTo(x + ww, y + k * 90); c.stroke(); } c.beginPath(); c.moveTo(x, y); c.lineTo(x + ww, y + 90); c.stroke(); c.beginPath(); c.moveTo(x + ww, y); c.lineTo(x, y + 90); c.stroke();
      for (let r = 0; r < 3; r++) for (let q = 0; q < 2; q++) { c.fillStyle = '#ffd27a'; c.shadowColor = '#ffb040'; c.shadowBlur = 24; c.fillRect(x + 18 + q * (ww / 2), y + 22 + r * 90, ww / 2 - 36, 46); c.shadowBlur = 0; } }
    c.fillStyle = '#0c0a18'; c.fillRect(0, h - 70, w, 70);
    c.fillStyle = '#1a1a26'; c.fillRect(150, h - 120, 170, 60); c.fillStyle = '#ff2a3a'; c.shadowColor = '#ff2a3a'; c.shadowBlur = 30; c.fillRect(190, h - 136, 40, 16); c.fillStyle = '#2a6aff'; c.shadowColor = '#2a6aff'; c.fillRect(240, h - 136, 40, 16); c.shadowBlur = 0; });
  const g = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 6.5), new THREE.MeshBasicMaterial({ map: town, toneMapped: false })); g.position.set(WX, WY, -5.95); sc.add(g);
  const fr = mat(0xf2eee6, { roughness: .6 }); box(5.8, .35, .4, fr, .05, sc, WX, WY + 3.4, -5.8); box(6.2, .4, .9, fr, .05, sc, WX, WY - 3.4, -5.6); box(.35, 7.1, .4, fr, .05, sc, WX - 2.8, WY, -5.8); box(.35, 7.1, .4, fr, .05, sc, WX + 2.8, WY, -5.8); box(.2, 6.6, .25, fr, .02, sc, WX, WY, -5.85); box(5.4, .2, .25, fr, .02, sc, WX, WY + .6, -5.85);
  const cur = mat(0x8a1f3a, { roughness: .9 }); for (const s of [-1, 1]) { for (let k = 0; k < 4; k++) box(.5, 8, .3, cur, .1, sc, WX + s * (3.3 + k * .32), WY - .3, -5.6 + (k % 2) * .15); } box(8.4, .25, .25, mat(0x3a2a1a), .05, sc, WX, WY + 3.9, -5.5);
  // la linterna de la policía entra por la ventana
  const sp = new THREE.SpotLight(0xdfeeff, 700, 40, .2, .55, 1.2); sp.position.set(WX + .8, WY + 1.2, -8); sp.target.position.set(1.8, 2.6, 4.2); sp.castShadow = true; sp.shadow.mapSize.set(2048, 2048); sc.add(sp, sp.target);
  const d = sp.target.position.clone().sub(sp.position); const cone = lightCone(sc, sp.position.x, sp.position.y, sp.position.z, d.length() * .95, 2.3, 0xcfe4ff, .16, [d.x, d.y, d.z]); cone.userData.noAO = true;
  const moon = new THREE.DirectionalLight(0x8aa0ff, .7); moon.position.set(WX, 14, -20); moon.target.position.set(0, 0, 4); sc.add(moon, moon.target); }
// tele
const TX = 2.5, TY = 6.3, TW = 7.0, TH = TW * 9 / 16;
box(TW + .45, TH + .45, .35, mat(0x0a0a0e, { metalness: .5, roughness: .3 }), .08, sc, TX, TY, -5.7);
const scr = new THREE.Mesh(new THREE.PlaneGeometry(TW, TH), new THREE.MeshBasicMaterial({ map: rt.texture, toneMapped: false })); scr.position.set(TX, TY, -5.5); sc.add(scr); scr.userData.noAO = true;
const ui = canvasTex(1600, 900, (c, w, h) => { c.fillStyle = 'rgba(5,9,40,.94)'; c.fillRect(0, 0, w, 170); c.fillStyle = '#c8ff2e'; c.fillRect(0, 166, w, 10);
  c.fillStyle = '#e8162b'; c.beginPath(); c.roundRect(36, 38, 230, 92, 14); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(84, 84, 17, 0, 7); c.fill(); c.font = '76px Lucky'; c.textBaseline = 'middle'; c.fillText('LIVE', 114, 90);
  c.fillStyle = '#c8ff2e'; c.font = '78px Lucky'; c.textAlign = 'right'; c.fillText('02:00', w - 44, 92); c.textAlign = 'center'; c.font = '116px Lucky'; c.fillText('WACH-CHECK', w / 2 + 14, 98); });
const uim = new THREE.Mesh(new THREE.PlaneGeometry(TW, TH), new THREE.MeshBasicMaterial({ map: ui, transparent: true, toneMapped: false })); uim.position.set(TX, TY, -5.49); sc.add(uim); uim.userData.noAO = true;
box(6, 2.2, 1.8, mat(0x2a1e18, { roughness: .6 }), .1, sc, TX, 1.1, -4.9);
const tvL = new THREE.SpotLight(0x5a7cff, 320, 34, 1.0, .9, 1.4); tvL.position.set(TX, TY, -4.9); tvL.target.position.set(0, 2.5, 6); sc.add(tvL, tvL.target);
// lámpara de pie (cálida) a la izquierda
{ cyl(.1, .1, 6, mat(0x1a1a1a, { metalness: .6 }), 10, sc, -8.4, 3, -3.5); cyl(.9, .9, .15, mat(0x1a1a1a), 20, sc, -8.4, .08, -3.5); const sh = new THREE.Mesh(new THREE.CylinderGeometry(.7, 1.1, 1.3, 32, 1, true), mat(0xffe8c0, { emissive: 0xffb060, emissiveIntensity: 1.6, side: THREE.DoubleSide })); sh.position.set(-8.4, 6.4, -3.5); sc.add(sh);
  const pl = new THREE.PointLight(0xffa850, 60, 18, 1.5); pl.position.set(-8.4, 6.2, -3.2); sc.add(pl); }
// silla de madera + Lotte dormida
const wood = mat(0x8a5a32, { roughness: .6 });
const chair = new THREE.Group(); chair.position.set(4.2, 0, 2.6); chair.rotation.y = -.45; sc.add(chair);
box(2.8, .32, 2.5, wood, .05, chair, 0, 2.05, 0); for (const [a, b] of [[-1.2, -1.05], [1.2, -1.05], [-1.2, 1.05], [1.2, 1.05]]) box(.26, 2.05, .26, wood, .03, chair, a, 1.02, b); box(2.8, .3, .26, wood, .05, chair, 0, 5.2, -1.12); for (const a of [-1.2, 1.2]) box(.26, 3.3, .26, wood, .03, chair, a, 3.7, -1.12); for (const a of [-.45, .45]) box(.2, 3, .14, wood, .03, chair, a, 3.7, -1.12);
const lotte = mk(sc, { seed: 51, scale: .8, skin: 0xf0c8a6, skinCss: '#f0c8a6', shirt: 0xff8ac4, shirt2: 0xff8ac4, cuffs: 0xff8ac4, pants: 0xff8ac4, shoes: 0xffffff, hair: 0xf2cc56, hairBuild: hairS(0xf2cc56, 'bun'), noBelt: true, face: { blush: .6, iris: '#3a6aa8' } },
  [o => { const b = mat(0xff4f9a); sphere(.14, b, o.head, -.22, 1.62, -.3); sphere(.14, b, o.head, .22, 1.62, -.3); for (const s of [-1, 1]) box(.3, 1.0, .7, mat(0xf2cc56, { roughness: .6 }), .12, o.head, s * .66, .62, -.15); }]);
kitFace(lotte, 'girl'); lotte.root.position.set(4.2, .55, 2.75); lotte.root.rotation.y = -.45;
pose(lotte, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLx: .5, aLz: .1, aLe: .6, aRx: .4, aRz: .15, aRe: .7, headZ: .35, headX: .15, lean: .05 }); lotte.setFace({ expr: 'relief', eyes: 'closed', mouth: 'o' });
// osito
{ const t = new THREE.Group(); t.position.set(2.2, .5, 5.0); t.rotation.set(-1.2, .5, .3); sc.add(t); const tm = mat(0xb07040, { roughness: .9 }); sphere(.55, tm, t, 0, 0, 0); sphere(.42, tm, t, 0, .78, 0); for (const s of [-1, 1]) { sphere(.16, tm, t, s * .3, 1.12, 0); sphere(.2, tm, t, s * .5, -.1, .2); } sphere(.16, mat(0xe8c8a0), t, 0, .7, .36); sphere(.05, mat(0x111111), t, -.14, .88, .37); sphere(.05, mat(0x111111), t, .14, .88, .37); }
// Finn: sudadera azul, pelo castaño
const finn = mk(sc, { seed: 52, scale: 1, skin: 0xf0c4a2, skinCss: '#f0c4a2', shirt: 0x1f5fd6, shirt2: 0x1f5fd6, cuffs: 0x1a4fb8, pants: 0x16161c, shoes: 0xf4f4f4, sole: 0x2a2a2a, hair: 0x5a3418, hairBuild: hairS(0x5a3418, 'fringe'), noBelt: true,
  torsoDetail: hoodie(0x1f5fd6), face: { iris: '#5a3a1a', browColor: '#3a2010', bags: 1 } }, [o => { const m = mat(0x5a3418, { roughness: .6 }); const t = box(1.25, .42, .9, m, .18, o.head, .05, 1.42, .1); t.rotation.z = -.2; sphere(.13, mat(0xff8a1e, { emissive: 0xff6a00, emissiveIntensity: .4 }), o.head, .7, .55, 0); }]);
kitFace(finn, 'hero'); finn.root.position.set(-2.4, 0, 3.6); finn.root.rotation.y = .28;
pose(finn, { aLx: 2.6, aLz: .55, aLe: 1.6, aRx: 2.6, aRz: .55, aRe: 1.6, headX: -.05, headY: -.12, lean: -.04 }); finn.setFace({ expr: 'shock', eyes: 'terror', mouth: 'scream' });

for (const o of [finn, lotte]) outline(o.root, 2.2, 0x0c0818); outline(mayor.root, 2.2, 0x0c0818);
const dust = aire(sc, 700); try { dust.set?.('polvo'); dust.update?.(3.2); } catch (e) {}
sc.add(new THREE.HemisphereLight(0x8a7ad8, 0x1a1028, .75));
{ const f = new THREE.PointLight(0xb8c4ff, 120, 30, 1.5); f.position.set(-.5, 7, 15); sc.add(f); const rim = new THREE.DirectionalLight(0xff5aa8, 1.4); rim.position.set(-9, 6, -6); sc.add(rim); }

const cam = new THREE.PerspectiveCamera(+Q.get('fov') || 42, W / H, .1, 200); cam.position.set(-.4, 4.9, 24); cam.lookAt(.5, 6.6, 0);
R.setRenderTarget(rt); R.render(ts, tcam); R.setRenderTarget(null);
const { composer, grade, ao, bloom } = makeComposer(R, sc, cam); composer.setPixelRatio?.(SS); composer.setSize(W, H);
grade.uniforms.sat.value = 1.35; grade.uniforms.vig.value = .5; grade.uniforms.sharp.value = 1.2; if (grade.uniforms.px) grade.uniforms.px.value.set(1 / (W * SS), 1 / (H * SS)); bloom.strength = .55;
composer.render();
const proj = v => { const p = v.clone().project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; };

// ---------- 2D ----------
const out = document.createElement('canvas'); out.id = 'out'; out.width = W * SS; out.height = H * SS; document.getElementById('stage').appendChild(out); const c = out.getContext('2d'); c.setTransform(SS, 0, 0, SS, 0, 0); c.imageSmoothingQuality = 'high';
c.drawImage(R.domElement, 0, 0, W, H);
{ const t = c.createLinearGradient(0, 0, 0, 320); t.addColorStop(0, 'rgba(5,3,14,.95)'); t.addColorStop(1, 'rgba(5,3,14,0)'); c.fillStyle = t; c.fillRect(0, 0, W, 320);
  const b = c.createLinearGradient(0, H - 360, 0, H); b.addColorStop(0, 'rgba(5,3,14,0)'); b.addColorStop(1, 'rgba(5,3,14,.96)'); c.fillStyle = b; c.fillRect(0, H - 360, W, 360); }
function txt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .86) { c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const k = Math.min(1, maxW / c.measureText(t).width); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.65)'; c.shadowBlur = 30; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function stamp(t, x, y, size, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px Lucky`; c.textAlign = 'center'; c.textBaseline = 'middle'; const w = c.measureText(t).width + 70, h = size * 1.25;
  c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 30; c.shadowOffsetY = 12; c.fillStyle = '#e8162b'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 18); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = '#fff'; c.lineWidth = 8; c.beginPath(); c.roundRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 10); c.stroke(); c.fillStyle = '#fff'; c.fillText(t, 0, size * .06); c.restore(); }
const TOP = 340;
txt('IN DIESER STADT IST', W / 2, TOP, 88, 'Lucky', ['#ffffff', '#e4dcff'], '#120a2a', 22);
txt('SCHLAFEN', W / 2, TOP + 118, 150, 'Lucky', ['#c8ff2e', '#8fd400'], '#0f2400', 28, -.02);
stamp('VERBOTEN!', W / 2 + 40, TOP + 250, 84, .05);
const lh = proj(V(4.0, 5.6, 2.8));
[[0, 0, 74], [56, -70, 56], [100, -128, 42]].forEach(([dx, dy, s], i) => txt('Z', Math.min(lh[0] + 90 + dx, W - 110 + dx * .3), lh[1] - 30 + dy, s, 'Lucky', '#ffffff', '#3a1a6a', 12, .2 + i * .1, 400));
txt('… UND ER RUFT LIVE AN!', W / 2, H - 405, 84, 'Lucky', ['#ffffff', '#ffe0e0'], '#2a0010', 20, -.015);
window.__done = true;

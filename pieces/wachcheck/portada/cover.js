import * as THREE from 'three';
const W = 1080, H = 1920, S = 2;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(S); renderer.setSize(W, H); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; renderer.outputColorSpace = THREE.SRGBColorSpace;

const P = new URLSearchParams(location.search);
await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita');
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .55, metalness: 0, ...o });
const tex = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
function rbox(w, h, d, r = .08) { const g = new THREE.BoxGeometry(w, h, d, 1, 1, 1); return g; }
function box(w, h, d, m, x = 0, y = 0, z = 0, p) { const o = new THREE.Mesh(rbox(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; if (p) p.add(o); return o; }

// ---------- faces ----------
function face(kind) { return tex(512, 256, (c, w, h) => {
  c.clearRect(0, 0, w, h); c.lineCap = 'round'; c.lineJoin = 'round';
  const eye = (x, y, r, pr, px = 0, py = 0) => { c.fillStyle = '#fff'; c.strokeStyle = '#111'; c.lineWidth = 7; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#111'; c.beginPath(); c.arc(x + px, y + py, pr, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x + px - pr * .35, y + py - pr * .35, pr * .3, 0, 7); c.fill(); };
  if (kind === 'finn') {
    eye(196, 112, 40, 13, 0, 2); eye(316, 112, 40, 13, 0, 2);
    c.strokeStyle = '#3a2412'; c.lineWidth = 12; c.beginPath(); c.moveTo(160, 52); c.quadraticCurveTo(196, 30, 230, 46); c.stroke(); c.beginPath(); c.moveTo(282, 46); c.quadraticCurveTo(316, 30, 352, 52); c.stroke();
    c.fillStyle = '#2a0f0f'; c.beginPath(); c.ellipse(256, 200, 26, 34, 0, 0, 7); c.fill(); c.fillStyle = '#d9534f'; c.beginPath(); c.ellipse(256, 216, 15, 12, 0, 0, 7); c.fill();
    c.strokeStyle = 'rgba(120,70,140,.45)'; c.lineWidth = 6; [196, 316].forEach(x => { c.beginPath(); c.arc(x, 118, 50, .5, 2.64); c.stroke(); });
  } else if (kind === 'lotte') {
    c.strokeStyle = '#111'; c.lineWidth = 9; [200, 312].forEach(x => { c.beginPath(); c.arc(x, 112, 26, .25, Math.PI - .25); c.stroke(); });
    c.fillStyle = 'rgba(255,120,140,.45)'; [170, 342].forEach(x => { c.beginPath(); c.ellipse(x, 160, 26, 14, 0, 0, 7); c.fill(); });
    c.fillStyle = '#4a1f22'; c.beginPath(); c.ellipse(256, 190, 13, 16, 0, 0, 7); c.fill();
  } else if (kind === 'mayor') {
    eye(196, 118, 30, 14, 4, 4); eye(316, 118, 30, 14, -4, 4);
    c.fillStyle = '#111'; c.beginPath(); c.moveTo(150, 62); c.lineTo(238, 96); c.lineTo(236, 78); c.lineTo(156, 44); c.fill(); c.beginPath(); c.moveTo(362, 62); c.lineTo(274, 96); c.lineTo(276, 78); c.lineTo(356, 44); c.fill();
    c.beginPath(); c.moveTo(256, 168); c.bezierCurveTo(220, 150, 170, 160, 150, 198); c.bezierCurveTo(190, 182, 222, 190, 256, 184); c.bezierCurveTo(290, 190, 322, 182, 362, 198); c.bezierCurveTo(342, 160, 292, 150, 256, 168); c.fill();
    c.strokeStyle = '#111'; c.lineWidth = 8; c.beginPath(); c.moveTo(218, 232); c.quadraticCurveTo(256, 212, 294, 232); c.stroke();
  } else if (kind === 'kauer') {
    eye(200, 116, 24, 12, 0, 0); eye(312, 116, 24, 12, 0, 0);
    c.strokeStyle = '#111'; c.lineWidth = 8; c.beginPath(); c.moveTo(220, 196); c.lineTo(292, 196); c.stroke();
  }
}); }
function headGeo() { const pts = []; const r = .66, h = 1.2, rr = .2; pts.push(new THREE.Vector2(0, -h / 2)); for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + i / 8 * Math.PI / 2; pts.push(new THREE.Vector2(r - rr + Math.cos(a) * rr, -h / 2 + rr + Math.sin(a) * rr)); } for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI / 2; pts.push(new THREE.Vector2(r - rr + Math.cos(a) * rr, h / 2 - rr + Math.sin(a) * rr)); } pts.push(new THREE.Vector2(0, h / 2)); return new THREE.LatheGeometry(pts, 48); }
const HG = headGeo();

// R6 character: feet at y=0, torso 2..4, head centre 4.62
function makeChar(o) {
  const g = new THREE.Group(); const skin = mat(o.skin ?? 0xf5cd30, { roughness: .5 });
  const torso = box(2, 2, 1, mat(o.shirt), 0, 3, 0, g);
  const legs = [-.5, .5].map(x => { const p = new THREE.Group(); p.position.set(x, 2, 0); g.add(p); box(1, 2, 1, mat(o.pants), 0, -1, 0, p); return p; });
  const arms = [-1.5, 1.5].map(x => { const p = new THREE.Group(); p.position.set(x, 3.75, 0); g.add(p); box(1, 2, 1, o.sleeve === false ? skin : mat(o.shirt), 0, -.75, 0, p); return p; });
  const neck = new THREE.Group(); neck.position.set(0, 4, 0); g.add(neck);
  const head = new THREE.Mesh(HG, skin); head.position.y = .62; head.castShadow = true; neck.add(head);
  const fm = new THREE.MeshStandardMaterial({ map: face(o.face), transparent: true, roughness: .6, polygonOffset: true, polygonOffsetFactor: -2 });
  const fg = new THREE.CylinderGeometry(.672, .672, .86, 32, 1, true, -Math.PI * .42, Math.PI * .84);
  const f = new THREE.Mesh(fg, fm); f.position.y = .6; neck.add(f);
  g.userData = { torso, legs, arms, neck, head };
  if (o.hair) o.hair(neck);
  if (o.extra) o.extra(g);
  g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  return g;
}
const hairBrown = n => { const m = mat(0x5a3418, { roughness: .7 }); box(1.42, .42, 1.42, m, 0, 1.2, -.02, n); box(1.44, .7, .5, m, 0, .95, -.5, n); box(1.44, .28, .3, m, -.15, 1.0, .58, n).rotation.z = .12; box(.5, .5, .5, m, .35, 1.42, 0, n).rotation.y = .5; box(.32, .7, 1.3, m, -.62, .85, -.05, n); box(.32, .7, 1.3, m, .62, .85, -.05, n); };
const hairBlonde = n => { const m = mat(0xffd24a, { roughness: .6, emissive: 0x6a4a00, emissiveIntensity: .35 }); box(1.46, .45, 1.46, m, 0, 1.2, 0, n); box(1.5, 1.4, .5, m, 0, .6, -.55, n); box(.22, 1.1, 1.0, m, -.7, .7, -.2, n); box(.22, 1.1, 1.0, m, .7, .7, -.2, n); box(1.3, .22, .2, m, 0, 1.18, .6, n); const b = mat(0xff4f9a); box(.4, .3, .3, b, .45, 1.35, .45, n); };
const topHat = n => { const m = mat(0x111114, { roughness: .4 }); const br = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, .1, 40), m); br.position.y = 1.25; n.add(br); const cr = new THREE.Mesh(new THREE.CylinderGeometry(.68, .7, 1.25, 40), m); cr.position.y = 1.9; n.add(cr); const bd = new THREE.Mesh(new THREE.CylinderGeometry(.71, .71, .2, 40), mat(0x8a0d16)); bd.position.y = 1.42; n.add(bd); };
function suit(g) { const w = mat(0xf4f4f4); box(.6, 1.7, .05, w, 0, 3.15, .51, g); box(.18, 1.3, .06, mat(0x111111), 0, 3.15, .55, g); }

// ---------- TV content (mayor) ----------
const tvScene = new THREE.Scene(); tvScene.background = new THREE.Color(0x0b1a5e);
{ const bg = tex(1024, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1838b8'); gr.addColorStop(1, '#06103e'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(120,170,255,.25)'; c.lineWidth = 3; for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(512, 520); c.lineTo(i * 80 - 40, -10); c.stroke(); } });
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(26, 13), new THREE.MeshBasicMaterial({ map: bg })); pl.position.set(0, 5, -8); tvScene.add(pl);
  const desk = box(9, 2.2, 2.5, mat(0x1a1d2e, { roughness: .3, metalness: .4 }), 0, 1.6, 1.4, tvScene); box(9.05, .25, 2.55, mat(0xc8ff2e, { emissive: 0xc8ff2e, emissiveIntensity: .6 }), 0, 2.5, 1.4, tvScene); }
const mayor = makeChar({ shirt: 0x15151a, pants: 0x15151a, skin: 0xe9e0cf, face: 'mayor', hair: topHat, extra: suit });
mayor.position.set(.2, 0, -.6); mayor.rotation.y = -.12; tvScene.add(mayor);
{ const u = mayor.userData; u.arms[0].rotation.set(-1.45, 0, -.25); u.arms[1].rotation.set(-.2, 0, .15); u.neck.rotation.set(.08, .05, .06); u.torso.parent; }
tvScene.add(new THREE.HemisphereLight(0xbfd4ff, 0x20243a, 1.3)); { const k = new THREE.DirectionalLight(0xffffff, 2.6); k.position.set(4, 9, 8); tvScene.add(k); const r = new THREE.DirectionalLight(0x6fa0ff, 2.5); r.position.set(-6, 6, -4); tvScene.add(r); }
const tvCam = new THREE.PerspectiveCamera(30, 16 / 9, .1, 100); tvCam.position.set(-.9, 4.9, 7.4); tvCam.lookAt(0, 5.0, 0);
const rt = new THREE.WebGLRenderTarget(1600, 900, { samples: 8 }); rt.texture.colorSpace = THREE.SRGBColorSpace;

// ---------- room ----------
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0716); scene.fog = new THREE.Fog(0x0a0716, 22, 40);
const wallM = mat(0x5b4a8c, { roughness: .9 }); const floorM = new THREE.MeshStandardMaterial({ map: tex(512, 512, (c, w, h) => { c.fillStyle = '#5a3a2a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#62402e' : '#523424'; c.fillRect(0, i * 64, w, 62); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, i * 64 + 62, w, 2); } }), roughness: .7 }); floorM.map.wrapS = floorM.map.wrapT = THREE.RepeatWrapping; floorM.map.repeat.set(4, 4);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorM); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
const back = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), wallM); back.position.set(0, 12, -6); back.receiveShadow = true; scene.add(back);
const side = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), wallM); side.rotation.y = -Math.PI / 2; side.position.set(9, 12, 0); side.receiveShadow = true; scene.add(side);
box(40, .5, .2, mat(0x3a2e5c), 0, .25, -5.9, scene);
// TV
const TVX = .2, TVY = 7.55, TVW = 11, TVH = TVW * 9 / 16;
box(TVW + .5, TVH + .5, .35, mat(0x0c0c10, { roughness: .3, metalness: .5 }), TVX, TVY, -5.7, scene);
const scr = new THREE.Mesh(new THREE.PlaneGeometry(TVW, TVH), new THREE.MeshBasicMaterial({ map: rt.texture, toneMapped: false })); scr.position.set(TVX, TVY, -5.5); scene.add(scr);
const ui = tex(1600, 900, (c, w, h) => {
  c.fillStyle = 'rgba(6,10,40,.92)'; c.fillRect(0, 0, w, 170); c.fillStyle = '#c8ff2e'; c.fillRect(0, 166, w, 10);
  c.fillStyle = '#e8162b'; c.beginPath(); c.roundRect(40, 38, 230, 92, 14); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(88, 84, 17, 0, 7); c.fill(); c.font = '76px Lucky'; c.textBaseline = 'middle'; c.fillText('LIVE', 118, 90);
  c.fillStyle = '#c8ff2e'; c.font = '78px Lucky'; c.textAlign = 'right'; c.fillText('02:00', w - 50, 92);
  c.textAlign = 'center'; c.font = '118px Lucky'; c.fillText('WACH-CHECK', w / 2 + 10, 98);
  
});
const uim = new THREE.Mesh(new THREE.PlaneGeometry(TVW, TVH), new THREE.MeshBasicMaterial({ map: ui, transparent: true, toneMapped: false })); uim.position.set(TVX, TVY, -5.49); scene.add(uim);
const tvLight = new THREE.RectAreaLight ? null : null;
const tvL = new THREE.SpotLight(0x6f8cff, 260, 30, .9, .8, 1.6); tvL.position.set(TVX, TVY - .5, -4.8); tvL.target.position.set(0, 2.5, 6); scene.add(tvL, tvL.target); tvL.castShadow = true; tvL.shadow.mapSize.set(2048, 2048);
// lamp
{ const l = new THREE.Group(); l.position.set(-6.2, 0, -3.6); scene.add(l); box(1.6, 2.4, 1.6, mat(0x2a1f3e), 0, 1.2, 0, l); const st = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 2.2), mat(0x222222)); st.position.y = 3.5; l.add(st); const sh = new THREE.Mesh(new THREE.CylinderGeometry(.55, .9, 1.1, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0xfff1d0, emissive: 0xffc070, emissiveIntensity: 1.4, side: THREE.DoubleSide })); sh.position.y = 4.9; l.add(sh);
  const pl = new THREE.PointLight(0xffb060, 30, 14, 1.6); pl.position.set(-6.2, 4.8, -3.6); scene.add(pl); }
// window with police flashlight
{ const fr = mat(0x2b2140); const wx = 8.95, wy = 6.6, wz = -1; const g = new THREE.Group(); g.position.set(wx, wy, wz); g.rotation.y = -Math.PI / 2; scene.add(g);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(4, 4.6), new THREE.MeshBasicMaterial({ color: 0x0c1840 })); g.add(glass);
  box(4.4, .3, .3, fr, 0, 2.35, 0, g); box(4.4, .3, .3, fr, 0, -2.35, 0, g); box(.3, 4.9, .3, fr, -2.1, 0, 0, g); box(.3, 4.9, .3, fr, 2.1, 0, 0, g); box(.18, 4.6, .2, fr, 0, 0, 0, g); box(4, .18, .2, fr, 0, 0, 0, g);
  const fl = new THREE.Mesh(new THREE.CircleGeometry(.5, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); fl.position.set(.8, .9, -.4); g.add(fl);
  const sp = new THREE.SpotLight(0xe8f4ff, 420, 30, .22, .5, 1.4); sp.position.set(wx + .6, wy + .9, wz + .8); sp.target.position.set(.6, 2.2, 4.2); sp.castShadow = true; sp.shadow.mapSize.set(2048, 2048); scene.add(sp, sp.target);
  // volumetric cone
  const from = sp.position.clone(), to = new THREE.Vector3(.6, 2.0, 4.4); const len = from.distanceTo(to);
  const cg = new THREE.ConeGeometry(2.2, len, 48, 1, true); cg.translate(0, -len / 2, 0); cg.rotateX(-Math.PI / 2);
  const cm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { len: { value: len } },
    vertexShader: 'varying float vz; varying vec3 vn; varying vec3 vv; void main(){ vz = position.z; vec4 mv = modelViewMatrix*vec4(position,1.); vn = normalize(normalMatrix*normal); vv = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform float len; varying float vz; varying vec3 vn; varying vec3 vv; void main(){ float t = clamp(vz/len,0.,1.); float e = pow(abs(dot(vn,vv)),1.6); gl_FragColor = vec4(vec3(.75,.85,1.)* .32 * (1.-t*.85) * e, 1.); }' });
  const cone = new THREE.Mesh(cg, cm); cone.position.copy(from); cone.lookAt(to); scene.add(cone); }
// chair + Lotte asleep
const wood = mat(0x8a5a32, { roughness: .6 });
function chair(x, z, ry) { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; scene.add(c); box(2.6, .3, 2.4, wood, 0, 2.0, 0, c); [[-1.1, -1], [1.1, -1], [-1.1, 1], [1.1, 1]].forEach(([a, b]) => box(.25, 2, .25, wood, a, 1, b, c)); box(2.6, 2.8, .25, wood, 0, 3.5, -1.1, c); return c; }
const ch = chair(3.4, 2.4, -.55);
const lotte = makeChar({ shirt: 0xff8fc8, pants: 0xff8fc8, face: 'lotte', hair: hairBlonde });
lotte.scale.setScalar(.9); lotte.position.set(3.4, .62, 2.6); lotte.rotation.y = -.3; scene.add(lotte);
{ const u = lotte.userData; u.legs.forEach(l => l.rotation.x = -1.5); u.arms[0].rotation.set(-.5, 0, .1); u.arms[1].rotation.set(-.55, 0, -.15); u.neck.rotation.set(.05, -.2, .3); }
// Finn
const finn = makeChar({ shirt: 0x1f5fd6, pants: 0x16161c, face: 'finn', hair: hairBrown });
finn.position.set(-2.3, 0, 3.2); finn.rotation.y = .25; scene.add(finn);
{ const u = finn.userData; u.arms[0].rotation.set(-2.85, 0, .42); u.arms[1].rotation.set(-2.85, 0, -.42); u.neck.rotation.set(-.06, -.12, .04); u.legs[0].rotation.x = .08; u.legs[1].rotation.x = -.08;
  // hoodie details: pocket, strings, hood
  const hm = mat(0x1a52bb); box(1.3, .55, .06, hm, 0, 2.55, .52, finn); [-.25, .25].forEach(x => box(.06, .55, .06, mat(0xffffff), x, 3.55, .53, finn)); box(1.9, .5, .5, hm, 0, 4.05, -.45, finn); }
// earplug (orange) on Finn
{ const e = new THREE.Mesh(new THREE.SphereGeometry(.14, 16, 12), mat(0xff8a1e, { emissive: 0xff6a00, emissiveIntensity: .3 })); e.position.set(.7, .55, .05); finn.userData.neck.add(e); }

scene.add(new THREE.HemisphereLight(0x8a7ad8, 0x1a1028, .9)); { const f = new THREE.PointLight(0xc8d0ff, 140, 30, 1.5); f.position.set(-.5, 6.5, 14); scene.add(f); }
{ const rim = new THREE.DirectionalLight(0xff5aa8, 1.6); rim.position.set(-8, 6, -6); scene.add(rim); const key = new THREE.DirectionalLight(0x9fb0ff, .9); key.position.set(-3, 8, 10); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); scene.add(key); }

const camera = new THREE.PerspectiveCamera(+P.get('fov') || 42, W / H, .1, 100);
camera.position.set(+(P.get('cx') ?? -.6), +(P.get('cy') ?? 4.8), +(P.get('cz') ?? 24)); camera.lookAt(+(P.get('lx') ?? .4), +(P.get('ly') ?? 6.6), 0);

renderer.setRenderTarget(rt); renderer.render(tvScene, tvCam); renderer.setRenderTarget(null);
renderer.render(scene, camera);
const proj = v => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; };

// ---------- 2D composition ----------
await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita');
ui.needsUpdate = true; renderer.render(scene, camera);
const out = document.getElementById('out'), c = out.getContext('2d'); c.setTransform(S, 0, 0, S, 0, 0);
c.drawImage(renderer.domElement, 0, 0, W, H);
// vignette + calm top / bottom bands (empty space)
{ const g = c.createRadialGradient(W / 2, H * .5, H * .2, W / 2, H * .5, H * .75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const t = c.createLinearGradient(0, 0, 0, 300); t.addColorStop(0, 'rgba(6,4,16,.92)'); t.addColorStop(1, 'rgba(6,4,16,0)'); c.fillStyle = t; c.fillRect(0, 0, W, 300);
  const b = c.createLinearGradient(0, H - 330, 0, H); b.addColorStop(0, 'rgba(6,4,16,0)'); b.addColorStop(1, 'rgba(6,4,16,.95)'); c.fillStyle = b; c.fillRect(0, H - 330, W, 330); }
function txt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .86) { c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const k = Math.min(1, maxW / c.measureText(t).width); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 28; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function stamp(t, x, y, size, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px Lucky`; c.textAlign = 'center'; c.textBaseline = 'middle'; const w = c.measureText(t).width + 70, h = size * 1.25;
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 30; c.shadowOffsetY = 12; c.fillStyle = '#e8162b'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 18); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = '#fff'; c.lineWidth = 8; c.beginPath(); c.roundRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 10); c.stroke(); c.fillStyle = '#fff'; c.fillText(t, 0, size * .06); c.restore(); }
const TOP = 330;
txt('IN DIESER STADT IST', W / 2, TOP, 88, 'Lucky', ['#ffffff', '#e4dcff'], '#120a2a', 22);
txt('SCHLAFEN', W / 2, TOP + 118, 150, 'Lucky', ['#c8ff2e', '#8fd400'], '#0f2400', 28, -.02);
stamp('VERBOTEN!', W / 2 + 40, TOP + 250, 84, .05);
const lh = proj(new THREE.Vector3(3.6, 5.0, 2.4));
[[0, 0, 74], [56, -70, 56], [100, -128, 42]].forEach(([dx, dy, s], i) => txt('Z', Math.min(lh[0] + 30 + dx, W - 90 + dx * .2), lh[1] - 40 + dy, s, 'Lucky', '#ffffff', '#3a1a6a', 12, .2 + i * .1, 400));
c.save(); c.translate(lh[0] - 150, lh[1] + 250); c.rotate(-.12); c.font = '62px Lucky'; c.textAlign = 'center'; c.textBaseline = 'middle'; const tw = c.measureText('-150 €').width + 50;
c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.shadowOffsetY = 8; c.fillStyle = '#ffd400'; c.beginPath(); c.roundRect(-tw / 2, -46, tw, 92, 16); c.fill(); c.shadowColor = 'transparent'; c.fillStyle = '#1a0a00'; c.fillText('-150 €', 0, 6); c.restore();
txt('… UND ER RUFT LIVE AN!', W / 2, H - 400, 84, 'Lucky', ['#ffffff', '#ffe0e0'], '#2a0010', 20, -.015);
window.__done = true;

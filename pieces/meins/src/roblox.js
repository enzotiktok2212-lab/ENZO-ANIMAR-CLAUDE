// Estilo Roblox + luz: cabeza cilíndrica con cara curva, accesorios, haces de luz volumétricos,
// luz de contorno y "luz líquida" (shader de ruido fbm, idea tomada de SOMBRAS-Y-LUZ, escrito aquí).
import { THREE, character, mat, box, cyl, sphere, canvasTex, RNG } from './engine.js';

// ---------- cabeza Roblox ----------
function headProfile(r = .66, h = 1.22, rr = .2) { const pts = [new THREE.Vector2(0, -h / 2)];
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + i / 8 * Math.PI / 2; pts.push(new THREE.Vector2(r - rr + Math.cos(a) * rr, -h / 2 + rr + Math.sin(a) * rr)); }
  for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI / 2; pts.push(new THREE.Vector2(r - rr + Math.cos(a) * rr, h / 2 - rr + Math.sin(a) * rr)); }
  pts.push(new THREE.Vector2(0, h / 2)); return pts; }
export function robloxify(ch, { hs = 1 } = {}) {
  const head = ch.head; const skinM = head.children[0].material;
  head.children.forEach(c => { if (c.isMesh && c.material === skinM) c.visible = false; });
  ch.face.visible = false;
  const lathe = new THREE.Mesh(new THREE.LatheGeometry(headProfile(.66 * hs, 1.24 * hs, .22 * hs), 40), skinM); lathe.position.y = .66 * hs; lathe.castShadow = lathe.receiveShadow = true; head.add(lathe);
  const fg = new THREE.CylinderGeometry(.665 * hs, .665 * hs, 1.0 * hs, 32, 1, true, -1.05, 2.1);
  const f = new THREE.Mesh(fg, ch.faceMat); f.position.y = .64 * hs; head.add(f); ch.face = f;
  return ch;
}
// ---------- personajes ----------
const stars = (bg, fg) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; const r = RNG(3);
  for (let i = 0; i < 14; i++) { const x = r() * w, y = r() * h, s = 5 + r() * 5; c.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283 - 1.57, rr = k % 2 ? s * .45 : s; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.fill(); }
  c.beginPath(); c.arc(90, 40, 12, 0, 7); c.fill(); c.fillStyle = bg; c.beginPath(); c.arc(96, 36, 11, 0, 7); c.fill(); }, true);
const hairBlock = (col, style) => (h) => { const m = mat(col, { roughness: .45 });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.72, 28, 14, 0, 6.283, 0, Math.PI * .55), m); cap.position.y = 1.0; cap.scale.set(1, .95, 1); cap.castShadow = true; h.add(cap);
  box(1.38, .8, .4, m, .18, h, 0, .86, -.5);
  if (style === 'fringe') for (let i = -2; i <= 2; i++) { const t = box(.32, .5, .3, m, .1, h, i * .26, 1.08, .52); t.rotation.z = i * .12; t.rotation.x = -.35; }
  if (style === 'swoop') { const t = box(1.2, .38, .6, m, .16, h, .1, 1.45, .2); t.rotation.z = -.2; }
  if (style === 'curly') for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; sphere(.26, m, h, Math.cos(a) * .6, 1.1 + (i % 3) * .1, Math.sin(a) * .6, 10, 8); }
  if (style === 'bun') sphere(.34, m, h, 0, 1.55, -.35, 14, 10);
  if (style === 'long') for (const s of [-1, 1]) box(.3, 1.4, .7, m, .12, h, s * .66, .45, -.15); };
export function makeBen(scene) {   // Ben: pijama azul con estrellas, pelo castaño con flequillo, ojeras (nunca duerme)
  const o = character(scene, { seed: 80, scale: .82, skin: 0xf6d2b4, skinCss: '#f6d2b4', shirtMap: stars('#2f4fb8', '#ffd86a'), cuffs: 0x24409a, pants: 0x2f4fb8, shoes: 0x7a4a2a, sole: 0x3a2414, noBelt: true,
    face: { iris: '#4a7ab8', bags: .9, browColor: '#4a2a14' }, hairBuild: hairBlock(0x4a2a14, 'fringe'),
    torsoDetail: (sp) => { for (let i = 0; i < 4; i++) sphere(.08, mat(0xffffff), sp, 0, .4 + i * .42, .55); const col = mat(0xffffff); for (const s of [-1, 1]) { const c = box(.5, .2, .06, col, .03, sp, s * .3, 1.98, .55); c.rotation.z = s * .45; } } });
  return robloxify(o);
}
export function makeGrey(scene) {   // el Hombre Gris: abrigo largo, sombrero de ala, cara pálida y lisa, sonrisa
  const coat = mat(0x6a6a72, { roughness: .8 });
  const o = character(scene, { seed: 81, scale: 1.3, skin: 0xd8d8dc, skinCss: '#d8d8dc', shirt: 0x6a6a72, shirt2: 0x6a6a72, cuffs: 0x55555c, pants: 0x4a4a52, shoes: 0x1a1a1e, belt: 0x3a3a40,
    face: { iris: '#202024', eyes: 'half', mouth: 'flat', brows: 0, browColor: '#9a9aa0' }, hairBuild: (h) => { const m = mat(0x26262c, { roughness: .6 }); cyl(1.15, 1.15, .1, m, 32, h, 0, 1.2, 0); cyl(.72, .74, .9, m, 28, h, 0, 1.68, 0); cyl(.75, .75, .16, mat(0x101012), 28, h, 0, 1.3, 0); },
    torsoDetail: (sp) => { box(2.2, 2.1, 1.2, coat, .12, sp, 0, 1.0, 0); for (const s of [-1, 1]) { const l = box(.4, 1.3, .1, mat(0x5a5a62), .04, sp, s * .38, 1.45, .62); l.rotation.z = s * .4; } for (let i = 0; i < 3; i++) sphere(.09, mat(0x2a2a2e), sp, .32, .4 + i * .45, .62); } });
  box(2.3, 2.6, 1.3, coat, .14, o.hips, 0, -1.2, 0);   // faldón del abrigo
  robloxify(o);
  const sack = new THREE.Group(); sack.position.set(0, -.6, .2); o.aL.hand.add(sack);
  const sk = sphere(1.0, mat(0xc8a46a, { roughness: 1 }), sack, 0, -1.2, 0, 18, 14); sk.scale.set(1, 1.2, .9); cyl(.25, .4, .5, mat(0xb08a50, { roughness: 1 }), 12, sack, 0, -.05, 0); o.props.sack = sack;
  return o;
}
const NB = [[0xf28a3a, 0x3a3a4a, 0xd8a840, 'curly'], [0x5ab85a, 0x2a3a5a, 0x2a1a10, 'swoop'], [0xd84a8a, 0x3a2a3a, 0x8a4a1a, 'long'], [0x3ab8c8, 0x4a3a2a, 0xe8e0d0, 'bun'], [0xc8323a, 0x2a2a3a, 0x1a1a1a, 'fringe'], [0xf2c23a, 0x3a5a8a, 0xb8621e, 'curly']];
export function makeFolk(scene, i, extra = {}) { const [sh, pa, hr, st] = NB[i % NB.length];
  return robloxify(character(scene, { seed: 90 + i, skin: [0xf6d2b4, 0xc68b5e, 0x8d5a3b, 0xf0c4a2][i % 4], skinCss: ['#f6d2b4', '#c68b5e', '#8d5a3b', '#f0c4a2'][i % 4], shirt: sh, shirt2: sh, pants: pa, shoes: 0x2a2a3a, hair: hr, hairBuild: hairBlock(hr, st), face: { blush: .3 }, ...extra })); }

// ---------- luz líquida (sueños) ----------
const NOISE = `vec3 m289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 m289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 perm(vec4 x){return m289(((x*34.)+1.)*x);}
float sn(vec3 v){const vec2 C=vec2(1./6.,1./3.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g,l.zxy);vec3 i2=max(g,l.zxy);
vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-.5;i=m289(i);vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
vec4 j=p-49.*floor(p/49.);vec4 x_=floor(j/7.);vec4 y_=floor(j-7.*x_);vec4 x=(x_*2.+.5)/7.-1.;vec4 y=(y_*2.+.5)/7.-1.;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
float fbm(vec3 p){float s=0.,a=.55;for(int i=0;i<4;i++){s+=a*sn(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}`;
export function liquidMat(c1 = [1.0, .85, .35], c2 = [.45, .7, 1.0], glow = 2.2) {
  return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, toneMapped: false,
    uniforms: { time: { value: 0 }, c1: { value: new THREE.Color(...c1) }, c2: { value: new THREE.Color(...c2) }, glow: { value: glow }, seed: { value: 0 } },
    vertexShader: 'varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP=position; vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
    fragmentShader: NOISE + `uniform float time, glow, seed; uniform vec3 c1, c2; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){ vec3 q=vP*1.6+vec3(seed); float w=fbm(q+vec3(0.,time*.35,time*.2)); float w2=fbm(q*1.7+vec3(w*1.8,time*.5,-time*.3));
        float rim=pow(1.-max(dot(vN,vV),0.),1.6); vec3 col=mix(c2,c1,smoothstep(-.4,.6,w2)); float band=smoothstep(.15,.0,abs(w2-.1))*.9;
        col=col*(.55+rim*1.2)+vec3(1.)*band*.6; float a=clamp(.55+rim*.6+band*.3,0.,1.); gl_FragColor=vec4(col*glow,a); }` });
}
export function dreamOrb(parent, r = .6, c1, c2, seed = 0) { const m = liquidMat(c1, c2); m.uniforms.seed.value = seed; const o = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), m); parent.add(o);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, color: new THREE.Color(...(c1 || [1, .85, .35])).multiplyScalar(1.4), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending })); halo.scale.setScalar(r * 5); o.add(halo);
  o.userData.update = (T) => { m.uniforms.time.value = T; }; return o; }
const haloTex = canvasTex(128, 128, (c) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(.3, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); });
// ---------- haces de luz volumétricos ----------
const beamMat = (col, a) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
  uniforms: { col: { value: new THREE.Color(col) }, a: { value: a } },
  vertexShader: 'varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ vU=uv; vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
  fragmentShader: 'uniform vec3 col; uniform float a; varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ float e=pow(abs(dot(vN,vV)),1.5); float f=vU.y; gl_FragColor=vec4(col*a*e*f*f, 1.); }' });
export function lightCone(parent, x, y, z, h, r, col = 0xffd08a, a = .35, dir = null) {
  const c = new THREE.Mesh(new THREE.CylinderGeometry(.25, r, h, 32, 1, true), beamMat(col, a)); c.position.set(x, y - h / 2, z); parent.add(c);
  if (dir) { c.position.set(x, y, z); c.geometry.translate(0, -h / 2, 0); c.lookAt(x + dir[0], y + dir[1], z + dir[2]); c.rotateX(Math.PI / 2); }
  return c;
}
export function rimLight(scene) { const l = new THREE.DirectionalLight(0x9fc8ff, 1.6); scene.add(l, l.target); return l; }

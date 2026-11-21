// Foto de perfil "In dieser Stadt": maqueta flotante de la ciudad + cinta con el nombre del canal (1080×1080 central).
import { THREE, W, H, makeRenderer, makeComposer, applyPose, V, mat, box, sphere, cyl, canvasTex } from './engine.js';
import { rimLight } from './roblox.js';
import { FONT, noiseTex, building, tree, lamp, rathaus, fountain, makeMax, makeExtra } from './props.js';
await document.fonts.load('700 40px Cap');
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none'; renderer.setClearColor(0x000000, 0);
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const c = out.getContext('2d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, W / H, 1, 3000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false; bloom.strength = .3; grade.uniforms.sat.value = 1.4; grade.uniforms.vig.value = 0;
scene.add(new THREE.HemisphereLight(0xe8f0ff, 0x8a7a68, 1.6)); const sun = new THREE.DirectionalLight(0xffe2b8, 3.0); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target); const rim = rimLight(scene); rim.intensity = 1.8;
{ const k = sun.shadow.camera; Object.assign(k, { left: -60, right: 60, top: 60, bottom: -60, near: 1, far: 500 }); k.updateProjectionMatrix(); sun.position.set(-80, 140, 90); rim.position.set(70, 50, -90); }
// ---------- isla ----------
const I = new THREE.Group(); scene.add(I); const R = 46;
const top = cyl(R, R, 2, mat(0xffffff, { map: noiseTex('#5fbf4a', ['#4fa83c', '#6cc858', '#7ad060'], 3000, 2, 6) }), 64, I, 0, -1, 0);
const dirt = [[R, R * .9, 5, 0x9a6a3a], [R * .9, R * .7, 6, 0x7a5030], [R * .7, R * .38, 7, 0x8a8a92], [R * .38, 4, 8, 0x6a6a72]]; let y = -2; for (const [a, b, h, col] of dirt) { cyl(a, b, h, mat(col, { roughness: .95, flatShading: true }), 18, I, 0, y - h / 2, 0); y -= h; }
for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283; const r = box(3 + (k % 3), 2.4, 3, mat(k % 2 ? 0x8a8a92 : 0x7a7a82, { flatShading: true }), .4, I, Math.cos(a) * (R - 1), -4 - (k % 3) * 2, Math.sin(a) * (R - 1)); r.rotation.y = a; }
// calles en cruz y plaza
const roadM = mat(0x264174); for (const r of [0, Math.PI / 2]) { const rd = box(10, .2, 2 * R - 4, roadM, 0, I, 0, .05, 0); rd.rotation.y = r; } const plaza = cyl(16, 16, .3, mat(0xe8e2d6), 48, I, 0, .1, 0);
for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; }
const ft = fountain(I, 0, 0); ft.scale.setScalar(.75); ft.userData.update(2.1);
const rh = rathaus(I, 0); rh.g.scale.setScalar(.42); rh.g.position.set(0, 0, -22);
// edificios en las 4 manzanas, de cara a la calle
let bi = 0; for (const deg of [24, 48, 72, 108, 132, 156]) { const a = deg * Math.PI / 180, r = 31, px = Math.cos(a) * r, pz = -Math.sin(a) * r; const holder = new THREE.Group(); I.add(holder); building(holder, 0, 0, 1, bi++, 14 + (bi % 3) * 4.4); holder.scale.setScalar(.46); holder.position.set(px, 0, pz); holder.rotation.y = Math.atan2(-pz, px); }
for (let k = 0; k < 26; k++) { const a = k / 26 * 6.283 + .1; const r = R - 5 - (k % 3) * 4; if (Math.abs(Math.sin(a)) < .12 || Math.abs(Math.cos(a)) < .12) continue; tree(I, Math.cos(a) * r, Math.sin(a) * r, .55 + (k % 3) * .12); }
for (let k = 0; k < 60; k++) { const a = k * 2.399, r = 20 + (k % 7) * 3.4; if (Math.sin(a) < .2) sphere(.6, mat([0xff4a6a, 0xffd23f, 0xff8ad0, 0xffffff, 0xb86aff][k % 5]), I, Math.cos(a) * r, .5, -Math.sin(a) * r * -1, 8, 6); }
for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283 + .4; lamp(I, Math.cos(a) * 15, Math.sin(a) * 15, 1).scale?.setScalar?.(1); }
// gente en la plaza
const max = makeMax(scene); max.root.position.set(4, .3, 12); max.root.rotation.y = .3; max.root.scale.setScalar(1.4); applyPose(max, { aRz: 2.7, aRe: .4 }); max.setFace({ eyes: 'happy', mouth: 'grin' }); I.add(max.root);
[[-7, 9, .8], [10, 4, -.6], [-11, -2, 1.4], [7, -9, -2.4]].forEach(([x, z, r], i) => { const e = makeExtra(scene, i * 3); e.root.position.set(x, .3, z); e.root.rotation.y = r; e.root.scale.setScalar(1.1); applyPose(e, i % 2 ? { aRz: 2.5 } : { aLx: .4, aRx: -.3 }); e.setFace({ eyes: 'happy', mouth: 'smile' }); I.add(e.root); });
// monedas doradas flotando (el dinero de las historias)
for (let k = 0; k < 6; k++) { const g = mat(0xffd23f, { metalness: .15, roughness: .25, emissive: 0xffb000, emissiveIntensity: .55 }); const d = cyl(2, 2, .5, g, 40, I, Math.cos(k * 1.05 + .4) * (R + 6), 14 + (k % 3) * 8, Math.sin(k * 1.05 + .4) * (R + 6) * .6 - 6); d.rotation.set(Math.PI / 2, 0, k * .7); }
// nubes
const cloudM = mat(0xffffff, { roughness: 1 }); [[-58, 26, -30], [60, 34, -40], [-50, -16, 20], [56, -20, 24]].forEach(([x, yy, z], i) => { for (let k = 0; k < 5; k++) sphere(5 + (k % 3) * 2, cloudM, scene, x + (k - 2) * 6, yy + (k % 2) * 3, z, 18, 12); });
I.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); I.rotation.y = -.35;
camera.position.set(0, 175, 250); camera.lookAt(0, -14, 0); { const bg = canvasTex(512, 512, (q, w, h) => { const g = q.createRadialGradient(w / 2, h * .38, 20, w / 2, h / 2, w * .75); g.addColorStop(0, '#fff6c8'); g.addColorStop(.3, '#ffc27a'); g.addColorStop(.65, '#7ab8ff'); g.addColorStop(1, '#3a6ad8'); q.fillStyle = g; q.fillRect(0, 0, w, h); q.translate(w / 2, h * .38); for (let k = 0; k < 18; k++) { q.rotate(Math.PI * 2 / 18); q.fillStyle = 'rgba(255,255,255,.09)'; q.beginPath(); q.moveTo(0, 0); q.lineTo(-40, -500); q.lineTo(40, -500); q.fill(); } }); scene.background = bg; }
window.renderAt = () => {
  composer.render();
  c.drawImage(renderer.domElement, 0, 0, W, H);
  // cinta curva con el nombre del canal
  const cx = W / 2, cy = H / 2 + 960, Ro = 760, Ri = 610; c.save(); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 30; c.shadowOffsetY = 12;
  for (const s of [-1, 1]) { c.fillStyle = '#a8122a'; c.beginPath(); const a0 = -Math.PI / 2 + s * .62; c.moveTo(cx + Math.cos(a0) * Ri, cy + Math.sin(a0) * Ri); c.lineTo(cx + Math.cos(a0 + s * .12) * (Ri + 75), cy + Math.sin(a0 + s * .12) * (Ri + 75) + 40); c.lineTo(cx + Math.cos(a0) * Ro, cy + Math.sin(a0) * Ro); c.fill(); }
  const rg = c.createLinearGradient(0, cy - Ro, 0, cy - Ri); rg.addColorStop(0, '#ff4a5a'); rg.addColorStop(1, '#d6202f'); c.fillStyle = rg; c.beginPath(); c.arc(cx, cy, Ro, -Math.PI / 2 - .56, -Math.PI / 2 + .56); c.arc(cx, cy, Ri, -Math.PI / 2 + .56, -Math.PI / 2 - .56, true); c.closePath(); c.fill(); c.shadowColor = 'transparent';
  c.lineWidth = 8; c.strokeStyle = '#ffd23f'; c.beginPath(); c.arc(cx, cy, Ro - 10, -Math.PI / 2 - .55, -Math.PI / 2 + .55); c.stroke(); c.beginPath(); c.arc(cx, cy, Ri + 10, -Math.PI / 2 - .55, -Math.PI / 2 + .55); c.stroke(); c.restore();
  const text = 'IN DIESER STADT', size = 96, rad = (Ro + Ri) / 2 - 34; c.save(); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const ws = [...text].map(ch => c.measureText(ch).width + 4), tot = ws.reduce((a, b) => a + b, 0); let ang = -Math.PI / 2 - tot / rad / 2;
  [...text].forEach((ch, i) => { const a = ang + ws[i] / rad / 2; c.save(); c.translate(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); c.rotate(a + Math.PI / 2); c.lineWidth = size * .26; c.strokeStyle = '#000'; c.strokeText(ch, 0, 0); c.fillStyle = '#E2FD07'; c.fillText(ch, 0, 0); c.restore(); ang += ws[i] / rad; }); c.restore();
};
window.__ready = true;

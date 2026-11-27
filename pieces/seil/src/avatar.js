// Foto de perfil del canal «In dieser Stadt» (1080×1080, para el recorte en círculo de TikTok), en el estilo 3D de los vídeos:
// una mascota propia del canal en el centro (sudadera amarillo-lima del color de los subtítulos, gorra, auriculares al cuello)
// y detrás la plaza de un pueblo donde pasan cosas de todos los vídeos: gansos, el bus, el camión de bomberos, un taxi,
// el alcalde en el tractor, el cine, una nube con rayo, un arcoíris, globos de fiesta. Texto «IN DIESER STADT» centrado.
import { THREE, applyPose, V, mat, box, sphere, cyl } from './engine.js';
import { FONT, mk, hairS, cap, headphones } from './props.js';
import { nightSky } from './sets.js';
import { hufenbach, taxi, tractor, fireTruck, bus } from './gort.js';
import { makeMayor, makeLena, makeJonas, makeKumpel } from './gvolk.js';
import { makeHerd, field, makeGoose, poseGoose } from './gans.js';
import { stormCloud, bolt, rainbow } from './pech.js';
import { loadKitFaces, kitFace, luzCielo } from './vivo.js';
await document.fonts.load('700 40px Cap'); await loadKitFaces();
const S = 1080, stage = document.getElementById('stage'), PI = Math.PI;
const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setPixelRatio(1); R.setSize(S, S); R.toneMapping = THREE.NeutralToneMapping; R.toneMappingExposure = 1.08;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.domElement.style.display = 'none'; stage.appendChild(R.domElement);
const sc = new THREE.Scene(); sc.fog = new THREE.FogExp2(0xd2e8ff, .0016);
const sky = nightSky(sc); sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false; const u = sky.sky.material.uniforms; u.top.value.setRGB(.2, .48, .95); u.mid.value.setRGB(.5, .74, 1); u.hor.value.setRGB(.86, .94, 1); u.stars.value = null;
sc.add(new THREE.HemisphereLight(0xe8f2ff, 0x8aa070, 1.25)); const sun = new THREE.DirectionalLight(0xfff0dc, 2.7); sun.position.set(-60, 120, 80); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, far: 400 }); sun.target.position.set(0, 0, 0); sc.add(sun, sun.target);
const rim = new THREE.DirectionalLight(0x9fd8ff, 2.0); rim.position.set(40, 30, -60); sc.add(rim);
luzCielo(R, sc, sky.sky, .5).update(true);
hufenbach(sc);
// cosas que pasan en el pueblo (un poco de cada vídeo)
const B = bus(sc, 0x2aa84a, '7 · MARKT'); B.scale.setScalar(.85); B.position.set(-22, 0, -14); B.rotation.y = PI / 2 - .25;
const F = fireTruck(sc); F.position.set(20, 0, -30); F.rotation.y = -PI / 2 - .35; F.userData.ladder.rotation.x = -.5;
const Tx = taxi(sc); Tx.position.set(10, 0, 2); Tx.rotation.y = -.9;
const Tr = tractor(sc); Tr.position.set(-6, 0, -52); Tr.rotation.y = .3; const may = makeMayor(sc); kitFace(may, 'mustache'); may.root.position.set(-6.8, 5.4, -54.4); may.root.rotation.y = .3; applyPose(may, { aRx: 2.7, aRz: .4, aRe: .3 }); may.setFace({ expr: 'happy' });
const cl = stormCloud(sc); cl.position.set(-40, 40, -80); cl.scale.setScalar(1.5); const bl = bolt(sc); bl.position.set(-40, 36, -80); bl.scale.setScalar(1.6);
const rb = rainbow(sc); rb.position.set(30, -6, -160); rb.rotation.y = -.3; rb.scale.setScalar(1.4);
const herd = makeHerd(sc, 200); herd.set(field(-2, 8, 30, 14, 34, 7, { ry: PI / 2, spread: .5, walk: 1, honk: .3 })); herd.update(1.3);
const g1 = makeGoose(sc, 0, { seed: 4, bow: 0xd8323a }); g1.root.position.set(-6.4, 0, 22.5); g1.root.rotation.y = .5; poseGoose(g1, 1, { neck: 1, eyes: 'happy', honk: .6 });
const lena = makeLena(sc); kitFace(lena, 'girl'); lena.root.position.set(13, 0, -6); lena.root.rotation.y = -.6; applyPose(lena, { aLx: 2.6, aLz: .5, aLe: .3 }); lena.setFace({ expr: 'joy' });
for (let k = 0; k < 5; k++) { const b = sphere(.9, mat([0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][k], { roughness: .2 }), sc, 15 + (k % 3) * 1.4, 12 + Math.floor(k / 3) * 1.8, -7, 16, 12); b.scale.y = 1.2; cyl(.02, .02, 5, mat(0xffffff), 4, sc, 15 + (k % 3) * 1.4, 8.5, -6.6); }
const jon = makeJonas(sc); kitFace(jon, 'plain'); jon.root.position.set(-14, 0, 2); jon.root.rotation.y = .7; applyPose(jon, { aRx: .6, aRz: .3, lean: -.06 }); jon.setFace({ expr: 'smug' });
// mascota del canal
const hood = col => sp => { const j = mat(col, { roughness: .8 }); box(2.2, 2.12, 1.2, j, .2, sp, 0, 1.0, -.02); box(1.4, .55, .1, j, .1, sp, 0, .45, .62); for (const s of [-1, 1]) cyl(.05, .05, .8, mat(0x1a1a1a), 6, sp, s * .22, 1.55, .64); const hd = box(1.7, .62, .66, j, .24, sp, 0, 2.0, -.58); hd.rotation.x = .3;
  const logo = new THREE.Mesh(new THREE.CircleGeometry(.36, 24), mat(0x1d2238)); logo.position.set(0, 1.25, .62); sp.add(logo); const st = new THREE.Mesh(new THREE.CircleGeometry(.2, 5), mat(0xffffff)); st.position.set(0, 1.25, .63); sp.add(st); };
const M = mk(sc, { seed: 2025, scale: 1.0, skin: 0xe8b48c, skinCss: '#e8b48c', shirt: 0xd8f000, shirt2: 0xd8f000, cuffs: 0x1d2238, pants: 0x2a3446, shoes: 0xffffff, sole: 0xd8323a, hair: 0x2a1a10, hairBuild: hairS(0x2a1a10, 'swoop'), noBelt: true,
  torsoDetail: hood(0xd8f000), face: { iris: '#5a3a1a', browColor: '#2a1a10', blush: .35 } }, [o => cap(o.head, 0x1d2238, 0xd8f000), o => headphones(o.head, 0x1d2238)]);
kitFace(M, 'hero'); M.root.position.set(0, 0, 30); M.root.rotation.y = -.08; M.head.children.slice(-3).forEach(m => { m.position.y -= 1.0; m.position.z -= .12; });
applyPose(M, { aRx: 2.75, aRz: .5, aRe: .5, aLx: .9, aLz: -.25, aLe: 1.7, headZ: .1, headY: -.05, lean: -.05, twist: .08 }); M.setFace({ expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
const cam = new THREE.PerspectiveCamera(48, 1, .3, 3000); cam.position.set(.8, 4.4, 40); cam.lookAt(.2, 3.0, 20); sky.sky.position.copy(cam.position);
R.render(sc, cam);
// composición 2D: imagen 3D + viñeta + texto centrado
const out = document.createElement('canvas'); out.width = out.height = S; stage.appendChild(out); const c = out.getContext('2d'); c.drawImage(R.domElement, 0, 0);
const v = c.createRadialGradient(S / 2, S / 2, S * .3, S / 2, S / 2, S * .56); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.42)'); c.fillStyle = v; c.fillRect(0, 0, S, S);
const g = c.createLinearGradient(0, S * .62, 0, S); g.addColorStop(0, 'rgba(10,14,40,0)'); g.addColorStop(.5, 'rgba(10,14,40,.55)'); g.addColorStop(1, 'rgba(10,14,40,.75)'); c.fillStyle = g; c.fillRect(0, S * .62, S, S * .38);
function line(t, y, size, fill) { c.save(); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; const tw = c.measureText(t).width, k = Math.min(1, S * .74 / tw); c.translate(S / 2, y); c.scale(k, k);
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 20; c.shadowOffsetY = 8; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
line('IN DIESER', S * .735, 118, '#ffffff'); line('STADT', S * .845, 150, '#E2FD07');
window.__ready = true;

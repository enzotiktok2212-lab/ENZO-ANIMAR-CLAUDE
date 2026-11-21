// Fotogramas de estilo (look check): 0 calle, 1 café, 2 Schlafgarten, 3 reparto.
import { THREE, W, H, makeRenderer, makeComposer, applyPose, walkPose, idlePose, mixPose, V } from './engine.js';
import { nightSky, townSet, rathausturm, schlafgarten, cafeFront, cafeInterior, FONT } from './sets.js';
import { makeFinn, makeOpa, makeWachter, makeTownsperson, coffeeCup } from './cast.js';
await document.fonts.load('700 40px Cap');
const stage = document.getElementById('stage');
const renderer = makeRenderer(stage);
const overlay = document.createElement('canvas'); overlay.width = W; overlay.height = H; stage.appendChild(overlay);
const ctx = overlay.getContext('2d');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x3a3a8a, 0.0022);
const camera = new THREE.PerspectiveCamera(55, W / H, 0.3, 4000);
const { composer, grade, bloom } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene);
const hemi = new THREE.HemisphereLight(0x8fa0ff, 0x4a3050, 1.35); scene.add(hemi);
const moonL = new THREE.DirectionalLight(0xc8d4ff, 1.6); moonL.castShadow = true; moonL.shadow.mapSize.set(4096, 4096);
moonL.shadow.bias = -0.0004; moonL.shadow.normalBias = 0.3; moonL.shadow.radius = 4; scene.add(moonL, moonL.target);
function shadowAround(p, size = 70) { const c = moonL.shadow.camera; Object.assign(c, { left: -size, right: size, top: size, bottom: -size, near: 1, far: 800 }); c.updateProjectionMatrix();
  moonL.target.position.copy(p); moonL.position.copy(p).add(V(-140, 260, 160)); }

townSet(scene);
const tower = rathausturm(scene, 0, -420);
const garden = schlafgarten(scene, 0, -300);
const cafe = cafeFront(scene, 24, -70); cafe.g.rotation.y = -Math.PI / 2;
const inside = cafeInterior(scene, 700, 0);

const finn = makeFinn(scene), wachter = makeWachter(scene), opaUp = makeOpa(scene, false);
const folks = [0, 1, 2, 3, 4].map(i => makeTownsperson(scene, i));
// Herr Wachter siempre con su taza
const wCup = coffeeCup(wachter.aR.hand, 0, -0.55, 0.45, 0.9);

function caption(word, big) {
  const size = H * 0.046 * (big ? 1.35 : 1);
  ctx.save(); ctx.translate(W / 2, H * 0.74);
  ctx.font = `700 ${size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
  ctx.lineWidth = size * 0.24; ctx.strokeStyle = '#000'; ctx.strokeText(word, 0, 0);
  ctx.shadowColor = 'transparent'; ctx.fillStyle = '#E2FD07'; ctx.fillText(word, 0, 0); ctx.restore();
}
function hideAll() { for (const c of [finn, wachter, opaUp, ...folks]) c.root.visible = false; }
function show(c, x, y, z, ry = 0) { c.root.visible = true; c.root.position.set(x, y, z); c.root.rotation.set(0, ry, 0); }

const FRAMES = [
  () => { // calle en noche eterna: Finn camina hacia cámara, vecinos con ojeras, el café a la derecha
    hideAll(); show(finn, 2, 0, -40, 0); applyPose(finn, walkPose(0.13)); finn.setFace({ eyes: 'open', mouth: 'flat', brows: -0.2, look: [0.3, 0] });
    const pos = [[-9, -62, 0.1], [12, -78, -0.3], [-4, -100, 0.2], [8, -125, 0], [-12, -140, 0.4]];
    folks.forEach((f, i) => { show(f, pos[i][0], 0, pos[i][1], pos[i][2]); applyPose(f, walkPose(i * 0.21, 0.8, 1)); });
    camera.fov = 50; camera.position.set(0.5, 6.2, -25); camera.lookAt(1.6, 2.6, -60); shadowAround(V(0, 0, -60));
    sky.moon.position.set(-160, 420, -1400); sky.clouds.forEach((c, i) => c.position.set(-700 + i * 160, 380 + (i % 3) * 60, -1300));
    caption('Augenringe', true);
  },
  () => { // café por dentro: Herr Wachter tras la barra, Finn de espaldas a la izquierda
    hideAll(); const ox = 700;
    show(wachter, ox + 1, 0, -8.6, 0); applyPose(wachter, { ...idlePose(0.4), aRx: 1.25, aRe: 1.35, aRz: 0.1, aLz: 0.08, lean: -0.03, headX: 0.05, headZ: -0.06 });
    wachter.setFace({ eyes: 'wide', brows: 0.55, mouth: 'smirk', look: [-0.4, 0.2] });
    wachter.props.moustache.longH.rotation.z = 0.32; wachter.props.moustache.shortH.rotation.z = -0.2;
    show(finn, ox - 3.2, 0, 0.5, 2.7); finn.root.visible = false; applyPose(finn, { ...idlePose(0.2), headX: -0.25, aLx: 0.6, aLe: 1.3 }); finn.setFace({ eyes: 'open', mouth: 'frown', brows: 0.5 });
    folks.forEach((f, i) => { if (i < 2) { show(f, ox + [-14, 12][i], 0, [6, 7][i], [2.2, -2.4][i]); applyPose(f, { ...idlePose(i), crouch: 0.8, lLx: 1.4, lRx: 1.4, lLk: 1.4, lRk: 1.4, lean: 0.45, headX: 0.55 }); } });
    camera.fov = 40; camera.position.set(ox - 2.5, 8.2, 6.5); camera.lookAt(ox + 1.0, 4.0, -8); shadowAround(V(ox, 0, -5), 40);
    caption('Kaffee', true);
  },
  () => { // Schlafgarten: Finn arrodillado junto a la cama 9, el abuelo dormido, la torre sin agujas
    hideAll(); const b = garden.bed9.position, gx = 0, gz = -300;
    show(finn, b.x + gx + 3.0, 0, b.z + gz - 1.2, -1.5); applyPose(finn, { ...idlePose(0.2), lean: 0.22, headX: 0.35, aRx: 0.9, aRe: 0.5, aLx: 0.2, aLe: 1.6, aLz: 0.2 });
    finn.setFace({ eyes: 'open', mouth: 'frown', brows: -0.7, look: [0.2, 0.6] });
    camera.fov = 44; camera.position.set(b.x + gx - 7, 9, b.z + gz + 3.5); camera.lookAt(b.x + gx + 0.9, 1.6, b.z + gz - 1.6); shadowAround(V(b.x, 0, b.z + gz), 60);
    sky.moon.position.set(300, 380, -1500);
    caption('Nummer', false);
  },
  () => { // reparto: Finn, Opa, Herr Wachter
    hideAll(); const z = -150;
    show(opaUp, -4.4, 0, z, 0.3); applyPose(opaUp, { ...idlePose(0), lean: 0.08, headX: 0.05, aLx: 0.3, aLe: 0.8, aRz: 0.15 }); opaUp.setFace({ eyes: 'happy', mouth: 'smile', brows: -0.2 });
    show(finn, 0, 0, z + 2, 0); applyPose(finn, { ...idlePose(0.3), aRz: 2.6, aRe: 0.3, headZ: 0.08 }); finn.setFace({ eyes: 'open', mouth: 'grin', blush: 1 });
    show(wachter, 4.6, 0, z, -0.3); applyPose(wachter, { ...idlePose(0.6), aRx: 1.25, aRe: 1.35, aLz: 0.12 }); wachter.setFace({ eyes: 'wide', mouth: 'smirk', brows: 0.6, look: [-0.5, 0] });
    camera.fov = 45; camera.position.set(0, 6.5, z + 20); camera.lookAt(0, 2.4, z); shadowAround(V(0, 0, z), 40);
    sky.moon.position.set(200, 500, -1400);
  },
];
window.renderAt = (i) => { ctx.clearRect(0, 0, W, H); FRAMES[i](); composer.render(); };
window.DUR = 4 / 30; window.FPS = 30; window.__ready = true;

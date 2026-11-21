import { THREE, W, H, makeRenderer, makeComposer, V } from '../src/engine.js';
import { makeMundMonster, poseMund, MP } from '../src/mund.js';
import { makeIch } from '../src/dvolk.js';
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x8ab8e8);
const camera = new THREE.PerspectiveCamera(40, W / H, .3, 2000); const { composer, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
scene.add(new THREE.HemisphereLight(0xffffff, 0x666655, 1.4)); const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(20, 40, 30); scene.add(sun);
const g = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0xa8a090 })); g.rotation.x = -Math.PI / 2; scene.add(g);
const M = makeMundMonster(scene); const ich = makeIch(scene); ich.root.position.set(5, 0, 2);
window.shot = (v) => { const T = 1.3;
  if (v === 0) { poseMund(M, MP.stand, T); M.mouths(T, 1); camera.position.set(4, 9, 34); camera.lookAt(1, 9, 0); camera.fov = 40; }
  if (v === 1) { poseMund(M, MP.stand, T); M.mouths(T, 1); M.root.updateMatrixWorld(true); const h = M.head.getWorldPosition(V(0,0,0)); camera.position.set(h.x + 1, h.y + 1.5, h.z + 7); camera.lookAt(h.x, h.y + .9, h.z); camera.fov = 40; }
  if (v === 2) { poseMund(M, MP.duck, T); M.mouths(T, 1); camera.position.set(10, 6, 24); camera.lookAt(0, 6, 0); camera.fov = 45; }
  camera.updateProjectionMatrix(); composer.render(); };
window.__ready = true;

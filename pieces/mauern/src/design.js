// Hoja de diseño de los gigantes y del reparto (solo revisión).
import { THREE, W, H, makeRenderer, makeComposer, applyPose, V } from './engine.js';
import { nightSky } from './sets.js';
import { makeGiant, makeSkinless, makeSmiler, makeMine, makeMetal, makeHero, makeMom, makeDad, makeSoldier, makeCaptain, makeBuddy, makeBig, makeTall, makeLady } from './giants.js';
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(40, W / H, .5, 3000); const { composer } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene); { const u = sky.sky.material.uniforms; u.top.value.setRGB(.26, .6, .98); u.mid.value.setRGB(.5, .78, 1); u.hor.value.setRGB(.78, .9, 1); sky.moon.visible = false; }
scene.add(new THREE.HemisphereLight(0xdcebff, 0x9a8a78, 1.7)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.4); sun.position.set(-60, 120, 80); scene.add(sun);
const gr = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshStandardMaterial({ color: 0x6aa84a })); gr.rotation.x = -Math.PI / 2; scene.add(gr);
const mode = location.hash.slice(1) || 'giants';
if (mode === 'giants') { const L = [makeGiant(scene, 0, 4), makeGiant(scene, 1, 4), makeGiant(scene, 2, 4), makeSkinless(scene, 6), makeSmiler(scene, 4), makeMine(scene, 4.4), makeMetal(scene, 4.4)]; L.forEach((g, i) => { g.root.position.set(-48 + i * 16, 0, 0); applyPose(g, { aLz: .2, aRz: .2 }); }); camera.position.set(0, 22, 110); camera.lookAt(0, 22, 0); }
else { const L = [makeHero(scene, true), makeHero(scene), makeMom(scene), makeDad(scene), makeSoldier(scene), makeCaptain(scene), makeBuddy(scene), makeBig(scene), makeTall(scene), makeLady(scene)]; L.forEach((g, i) => { g.root.position.set(-13.5 + i * 3, 0, 0); applyPose(g, { aLz: .2, aRz: .2 }); }); camera.position.set(0, 4, 26); camera.lookAt(0, 4, 0); camera.fov = 52; camera.aspect = W / H; }
camera.updateProjectionMatrix(); composer.render(); window.__ready = true;

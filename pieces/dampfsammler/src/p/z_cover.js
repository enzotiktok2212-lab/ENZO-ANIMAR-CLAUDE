// ---------- portadas (fuera del vídeo): una callejuela de Hufenbach de noche, adoquín mojado, farolas y niebla baja ----------
// Lo importante entre y = 240 y 1680; arriba cielo, abajo suelo vacío. Tipografías propias (Luckiest Guy / Lilita One), pegatinas 2D.
const CVX = 2900; const CV = new THREE.Group(); scene.add(CV); SETS.CV = CV;
{ const cob = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#3a3a46'; c.fillRect(0, 0, w, h); const r = RNG(7); for (let y = 0; y < h; y += 16) for (let x = (y / 16) % 2 ? 0 : 8; x < w; x += 16) { const v = 70 + r() * 40 | 0; c.fillStyle = `rgb(${v},${v},${v + 14})`; c.beginPath(); c.roundRect(x + 1, y + 1, 14, 14, 5); c.fill(); c.fillStyle = 'rgba(160,190,255,.18)'; c.fillRect(x + 3, y + 3, 5, 3); } }, true);
  cob.repeat.set(20, 40); const g = new THREE.Mesh(new THREE.PlaneGeometry(60, 200), mat(0xffffff, { map: cob, roughness: .25, metalness: .15 })); g.rotation.x = -Math.PI / 2; g.position.set(CVX, 0, -40); g.receiveShadow = true; CV.add(g);
  for (let i = 0; i < 7; i++) { townhouse(CV, CVX - 24, 10 - i * 17, 16, 2 + (i % 3), 120 + i, Math.PI / 2); townhouse(CV, CVX + 24, 10 - i * 17, 16, 2 + ((i + 1) % 3), 130 + i, -Math.PI / 2); }
  townhouse(CV, CVX, -118, 18, 4, 140, 0);
  for (const [x, z] of [[-9, -2], [9, -18], [-9, -36], [9, -54]]) { cyl(.22, .3, 11, mat(0x1a1e26, { metalness: .6 }), 10, CV, CVX + x, 5.5, z); const b = box(1.4, 1.6, 1.4, new THREE.MeshBasicMaterial({ color: new THREE.Color(1, .82, .5).multiplyScalar(2.2), toneMapped: false }), .1, CV, CVX + x, 11.6, z); box(1.8, .4, 1.8, mat(0x1a1e26), .1, CV, CVX + x, 12.6, z);
    const l = new THREE.PointLight(0xffc880, 160, 40, 1.4); l.position.set(CVX + x, 10.6, z); CV.add(l); }
  CV.visible = false; outline(CV, OS); }
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .9) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 28; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function ringMark(x, y, rx, ry, col = '#ff0018') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.beginPath(); c.ellipse(x, y, rx, ry, -.06, .15, 6.15); c.stroke(); c.restore(); }
function noVapeSticker(x, y, s, rot) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.shadowOffsetY = 8; c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 112, 0, 7); c.fill(); c.shadowColor = 'transparent'; drawNoVape(c, 0, 0, 100); c.restore(); }
function burst(x, y, s, rot, t, bg = '#ffd23f', fg = '#1a1030') { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 18; c.fillStyle = bg; c.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283, r = i % 2 ? 100 : 140; c.lineTo(Math.cos(a) * r * 1.35, Math.sin(a) * r * .8); } c.closePath(); c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 7; c.strokeStyle = fg; c.stroke();
  c.font = '64px Lucky'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = fg; c.fillText(t, 0, 4); c.restore(); }
function sparkle(x, y, r, col = '#bff6ff') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 22; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
// óvalo ajustado al personaje: proyecta su caja (cabeza/sombrero, pies, brazos) y deja margen sin cruzarlo
function ringAround(ch, top, padX = 50, padY = 40) { ch.root.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(ch.root); const pts = []; for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, Math.max(b.max.y, top ?? 0)]) for (const z of [b.min.z, b.max.z]) pts.push(proj(V(x, y, z)));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys); ringMark((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + padX, (y1 - y0) / 2 + padY); return [x0, y0, x1, y1]; }
function coverScene(L) { use('CV'); night(30); hemi.intensity = .95; sun.intensity = .9; renderer.toneMappingExposure = 1.1; bloom.strength = .2; bloom.threshold = .86; scene.fog.density = .0015; SMK.tint.setRGB(.85, .88, 1); }
function finishCover() { grade.uniforms.sharp.value = 1.6; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  clearFaces(); sky.sky.position.copy(camera.position); ao.enabled = true; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); const T = 5.6, L = { T, lt: 1, k: 1, t0: T - 1 }; hideAll(); BAD_.length = 0; FACES.length = 0; BIRDSON = 0; coverScene(L);
  const P = V(CVX, 0, -14);
  if (v === 0) {
    // 1: un chico suelta una nube enorme; detrás, la criatura se alza con los brazos abiertos; dos vecinos lo ven aterrados a los lados
    const k = put(EX[1], P.x + .2, 0, P.z + 4.4, .1); VP.get(k).visible = true; VP.get(k).userData.grip.visible = true; VP.get(k).userData.setGlow(.9); const av = armVape(.45); actuar(k, 0, [[0, { ...av, aLx: .5, aLz: .3, aLe: 1.2, headY: .25 }]], { T }); k.aR.sh.rotation.y = av.aRy; cara(k, T, { expr: 'shock', eyes: 'side_l', mouth: 'o', noBlink: 1 });
    SMK.puff(mouthW(k).add(V(.9, .4, 0)), V(.55, 1, .1), T, T - 1.1, .9, { n: 70, pow: 5, size: 1.8, dens: .75, seed: 95, life: 3 });
    samAt(L, P.x - .3, P.z + 1.2, 0, { reach: .2, aura: 1, glow: 1.4 }); SMK.haze(V(P.x, 1.0, P.z - 1.5), T, 14, 6, .5, 2, 3.5, .35, 91);
    [[EX[4], -4.6, 2.6, .45], [EX[9], 4.8, 3.0, -.5]].forEach(([c, dx, dz, ry], i) => { put(c, P.x + dx, 0, P.z + dz, ry); actuar(c, 0, [[0, { aRx: 1.6, aRz: i ? .1 : -.1, aRe: .1, aLx: .9, aLz: .5, aLe: 1.7, lean: -.1, headX: -.1 }]], { T }); cara(c, T, { expr: 'shock', eyes: 'wide', mouth: i ? 'scream' : 'o', noBlink: 1 }); });
    cam([P.x + .4, 7.4, P.z + 31], [P.x, 4.6, P.z - 2], 50); sh(P, 24);
    finishCover();
    strokeTxt('IN DIESER STADT', W / 2, 330, 104, 'Lucky', ['#ffffff', '#cfe0ff'], '#0a0a24', 26);
    strokeTxt('NIE AUSATMEN!', W / 2, 452, 132, 'Lucky', ['#ff6a7a', '#e0001a'], '#24000a', 28, -.02);
    const rb = ringAround(k, null, 44, 34);
    noVapeSticker(W * .86, Math.min(1600, rb[3] + 120), .7, .18); burst(W * .18, Math.min(1600, rb[3] + 110), .66, -.12, 'PFFF!'); sparkle(W * .1, 600, 30); sparkle(W * .9, 640, 24, '#e0c8ff');
  } else {
    // 2: plano medio: el chico (de cara) se queda helado con la vape en la mano; por encima de su hombro, los ojos cian y las garras
    const k = put(ich, P.x - .2, 0, P.z + 4.4, .05); VP.get(k).visible = true; VP.get(k).userData.grip.visible = true; VP.get(k).userData.setGlow(.8); const av = armVape(.35); actuar(k, 0, [[0, { ...av, aLx: .6, aLz: .4, aLe: 1.6, headY: .35 }]], { T }); k.aR.sh.rotation.y = av.aRy; cara(k, T, { expr: 'shock', eyes: 'side_r', mouth: 'grimace', noBlink: 1 }); sweat(k, T, 3);
    samAt(L, P.x + 1.2, P.z + .2, -.1, { reach: .7, aura: 1, glow: 1.4 }); SMK.haze(V(P.x, 2, P.z + 1), T, 14, 5, 1, 2, 3, .35, 93);
    [[EX[13], -4.8, 1.8, .55], [EX[16], 5.0, 1.4, -.55]].forEach(([c, dx, dz, ry], i) => { put(c, P.x + dx, 0, P.z + dz, ry); actuar(c, 0, [[0, { aRx: 1.7, aRz: .05, aRe: .05, aLx: .8, aLz: -.5, aLe: 1.6, lean: -.08 }]], { T }); cara(c, T, { expr: 'shock', mouth: 'o', noBlink: 1 }); });
    cam([P.x + .2, 7.6, P.z + 29], [P.x + .2, 4.6, P.z + 1], 50); sh(P, 22);
    finishCover();
    strokeTxt('WER DAMPFT,', W / 2, 330, 120, 'Lilita', ['#7af0ff', '#2aa8ff'], '#06142e', 26);
    strokeTxt('VERSCHWINDET', W / 2, 460, 132, 'Lilita', ['#e0b0ff', '#9a3aff'], '#1a0630', 28, -.02);
    const rb = ringAround(ich, null, 44, 34);
    burst(W * .82, Math.min(1600, rb[3] + 110), .62, .1, '???', '#7af0ff'); noVapeSticker(W * .17, Math.min(1600, rb[3] + 120), .66, -.16); sparkle(W * .88, 620, 28, '#e0c8ff'); sparkle(W * .1, 640, 24); } };

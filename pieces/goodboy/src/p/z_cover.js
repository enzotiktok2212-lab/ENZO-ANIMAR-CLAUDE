// ---------- portadas (fuera del vídeo) ----------
// 1: calle con casas al atardecer (otro escenario): Svenja pasea a Lukas a cuatro patas con correa; alrededor, otras parejas igual, riéndose y señalando.
// 2: el estanque del parque al atardecer: Lukas sentado dando la pata a Svenja; alrededor, otros hombres con collar sentados como perros.
// Tipografías propias de portada (Luckiest Guy / Lilita One), pegatinas 2D (hueso, huellas, chapa), círculo rojo solo alrededor de Lukas.
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function boneSticker(x, y, s, rot, text) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 20; c.shadowOffsetY = 8; c.fillStyle = '#fff6e0'; c.strokeStyle = '#3a2410'; c.lineWidth = 10;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) { c.beginPath(); c.arc(sx * 240, sy * 48, 62, 0, 7); c.fill(); c.stroke(); } c.beginPath(); c.roundRect(-250, -58, 500, 116, 30); c.fill(); c.shadowColor = 'transparent'; c.stroke(); c.fillStyle = '#fff6e0'; c.fillRect(-236, -48, 472, 96);
  c.shadowBlur = 0; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '78px Lucky'; c.lineWidth = 10; c.strokeStyle = '#fff6e0'; c.strokeText(text, 0, 8); c.fillStyle = '#d8202f'; c.fillText(text, 0, 8); c.restore(); }
function paw(x, y, s, rot, col = '#ffffff') { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(0, 18, 34, 28, 0, 0, 7); c.fill(); for (const [px, py] of [[-36, -22], [-13, -42], [13, -42], [36, -22]]) { c.beginPath(); c.ellipse(px, py, 13, 17, 0, 0, 7); c.fill(); } c.restore(); }
function tagSticker(x, y, s, rot, text) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 20; const g = c.createRadialGradient(-30, -30, 10, 0, 0, 120); g.addColorStop(0, '#fff3a0'); g.addColorStop(1, '#e0a020'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 110, 0, 7); c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 10; c.strokeStyle = '#7a4a10'; c.stroke();
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#5a3008'; c.font = '44px Lilita'; c.fillText(text, 0, 4); c.restore(); }
function ringMark(x, y, rx, ry, col = '#ff0018') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(x, y, rx, ry, -.06, 0, 6.283); c.stroke(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function bbox(ch) { ch.root.updateMatrixWorld(true); const pts = []; ch.root.traverse(o => { if (o.isMesh && o.visible && o.geometry) { o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox; for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) pts.push(proj(V(x, y, z).applyMatrix4(o.matrixWorld))); } });
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; }
function finishCover() { grade.uniforms.sharp.value = 1.55; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  while (POST.length) POST.shift()(); sky.sky.position.copy(camera.position); ao.enabled = true; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); const T = 3.3, L = { T, lt: 1, k: 1 }; hideAll(); BAD_.length = 0; BIRDSON = 0;
  if (v === 0) { fen(L, { dusk: 1 }); const p = V(FX - 6, 0, 20);
    put(me, p.x + .8, 0, p.z + .6, PI / 2 - .55); actuar(me, 0, [[0, DOGP(T, 0, { headX: -.15 })]], { T }); cara(me, T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile', noBlink: 1 });
    put(sv, p.x - 4.0, 0, p.z - 1.6, PI / 2 - .3); actuar(sv, 0, [[0, { aRx: .8, aRe: .3, aLx: .3, aLe: .3, aLz: .1 }]], { T }); cara(sv, T, { expr: 'smug', eyes: 'squint', mouth: 'smile', noBlink: 1 }); inHand(CUPS[0], sv, 'L', [0, -.75, .25]); lead(sv, me, { sag: .5 });
    [[FR[1], MA[1], -12, -12]].forEach(([w, m, dx, dz], i) => { const s = dx < 0 ? 1 : -1; put(w, p.x + dx, 0, p.z + dz, s * .5); actuar(w, 0, [[0, { aLx: 1.6, aLz: s * -.1, aLe: .05, aRx: .8, aRe: .3, lean: -.1 }]], { T: T + i }); laughF(w, T + i);
      put(m, p.x + dx + s * 3.4, 0, p.z + dz + 2.2, s * .9); actuar(m, 0, [[0, DOGP(T + i, 0)]], { T: T + i }); cara(m, T + i, { expr: 'happy', eyes: 'happy', mouth: 'open_smile', noBlink: 1 }); lead(w, m, { sag: .6 }); });
    put(FR[2], p.x + 7.5, 0, p.z - 14, -.4); actuar(FR[2], 0, [[0, { aLx: 1.6, aLz: .1, aLe: .05, aRx: .5, aRz: .3, aRe: 1.6, lean: -.1 }]], { T }); laughF(FR[2], T);
    cam([p.x, 5.4, p.z + 17], [p.x, 2.6, p.z - 2], 52); sh(V(p.x, 0, p.z), 26); hemi.intensity = 1.25; sun.intensity = 2.4; FILL.intensity = 45;
    finishCover(); const b = bbox(me);
    strokeTxt('JEDE FRAU HAT', W / 2, H * .19, 120, 'Lucky', ['#ffffff', '#ffe0f0'], '#3a0a2a', 26);
    boneSticker(W / 2, H * .275, .95, -.04, 'GOOD BOY');
    ringMark((b[0] + b[2]) / 2, (b[1] + b[3]) / 2, (b[2] - b[0]) / 2 + 30, (b[3] - b[1]) / 2 + 34);
    strokeTxt('… UND ES IST', W / 2, H * .79, 104, 'Lucky', ['#ffffff', '#ffe0f0'], '#3a0a2a', 24, -.02);
    strokeTxt('NICHT IHR HUND!', W / 2, H * .845, 112, 'Lucky', ['#ff6aa8', '#e0006a'], '#2a0018', 26, -.02);
    paw(W * .1, H * .66, .9, -.4, '#ffe0f0'); paw(W * .9, H * .34, .8, .5, '#fff6c0'); sparkle(W * .86, H * .16, 30); sparkle(W * .14, H * .2, 24);
  } else { parkS(L, { dusk: 1 }); sunset(); const p = V(PX + 20, 0, -8);
    put(me, p.x - 1.8, 0, p.z, PI / 2 - .55); actuar(me, 0, [[0, PFOTE({ headX: -.3, aRx: 1.9, aRe: .5, aRz: -.2 })]], { T }); cara(me, T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile', blush: 1, noBlink: 1 });
    put(sv, p.x + 4.4, 0, p.z - 1.6, -PI / 2 + .55); actuar(sv, 0, [[0, { aRx: 1.2, aRe: .3, aRz: .1, aLx: .8, aLe: 1.4, lean: .15, headX: .25 }]], { T }); cara(sv, T, { expr: 'happy', eyes: 'happy', mouth: 'smile', noBlink: 1 }); inHand(TREAT, sv, 'L', [0, -.6, .4], [0, 0, 0], 1.6);
    [[MA[5], -8, -5], [MA[6], 8, -5], [MA[7], -8.5, 4], [MA[8], 8.5, 4]].forEach(([m, dx, dz], i) => { put(m, p.x + dx, 0, p.z + dz, dx < 0 ? .5 : -.5); actuar(m, 0, [[0, SITZ({ aRx: i % 2 ? 2.4 : 1.1, aRe: i % 2 ? .5 : 1.7, aRz: i % 2 ? .3 : -.15 })]], { T: T + i }); cara(m, T + i, { expr: 'happy', mouth: i % 2 ? 'laugh' : 'open_smile', eyes: 'happy', noBlink: 1 }); });
    cam([p.x, 5.2, p.z + 19], [p.x, 2.6, p.z - 2], 50); sh(V(p.x, 0, p.z), 26); hemi.intensity = 1.3; FILL.intensity = 50;
    finishCover(); const b = bbox(me);
    strokeTxt('IN DIESER STADT', W / 2, H * .18, 108, 'Lilita', ['#fff6c0', '#ffc83a'], '#3a1a00', 24);
    strokeTxt('SIND ALLE MÄNNER', W / 2, H * .24, 100, 'Lilita', ['#fff6c0', '#ffc83a'], '#3a1a00', 24);
    ringMark((b[0] + b[2]) / 2, (b[1] + b[3]) / 2, (b[2] - b[0]) / 2 + 30, (b[3] - b[1]) / 2 + 34);
    tagSticker(W * .2, H * .33, .9, -.12, 'GOOD BOYS');
    strokeTxt('PFÖTCHEN!', W / 2, H * .83, 150, 'Lucky', ['#7af0ff', '#2a8aff'], '#04163a', 30, -.03);
    paw(W * .13, H * .4, .9, -.3, '#bff6ff'); paw(W * .87, H * .44, .8, .4, '#fff6c0'); sparkle(W * .88, H * .14, 30); sparkle(W * .12, H * .15, 22); } };

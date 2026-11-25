// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// 1: la calle de Mondtal de noche: la marcha de sonámbulos en pijama viene hacia la cámara con los brazos estirados; Ben, delante y en el centro, el único despierto, mira de reojo y suda (círculo rojo); reloj 3:00.
// 2: las tres casitas adosadas con las puertas abiertas: salen vecinos en pijama y Ben, en medio, finge (círculo rojo); sin reloj (el texto ya dice la hora).
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .9) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; bloom.strength = .14; bloom.threshold = .88; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff1a2e') { const c = octx; c.save(); c.lineWidth = 18; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.beginPath(); c.ellipse(x, y, rx, ry, -.06, .25, 6.05); c.stroke(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function zTxt(x, y, s, rot = .2) { strokeTxt('Z', x, y, s, 'Lucky', ['#dff0ff', '#8ab8ff'], '#0a1a4a', s * .2, rot); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
  const T = 40.3, L = { T, lt: .8, k: 1, t0: 39.5, t1: 41, d: 1.5 }; hideAll(); BAD_.length = 0; FX2D.length = 0; DOF = 0;
  if (v === 0) { gasse(L, { z: -20 }); doorsOpen(); lp(0, -7, 10, 4, 30); lp(1, 7, 10, 4, 30); const p = V(0, 0, -2);
    const b = put(ben, p.x, 0, p.z, 0); actuar(b, 0, [[0, { ...sleepP(T, 0), aLx: 1.45, aRx: 1.45, aLe: .05, aRe: .05 }]], { T }); cara(b, T, { eyes: 'side_r', mouth: 'grimace', noBlink: 1 }); sweat(b, T, 1);
    const F = [[SL[0], -4.6, -3.2], [SL[3], 4.8, -3.4], [SL[6], -8.6, -7.6], [SL[9], 8.8, -7.8], [SL[1], -2.4, -9.6], [SL[5], 2.6, -10]];
    F.forEach(([c, dx, dz], i) => { put(c, p.x + dx, 0, p.z + dz, 0); actuar(c, 0, [[0, { ...sleepP(T, i + 1), aLx: 1.45, aRx: 1.45, aLe: .05, aRe: .05 }]], { T }); sleepFace(c, T); });
    march({ ...L, lt: 0 }, SL.slice(12), 0, p.z - 15, 0, { cols: 4, speed: 0 });
    cam([p.x, 6.2, p.z + 17], [p.x, 4.4, p.z - 2], 50); sh(V(p.x, 0, p.z - 4), 30); hemi.intensity *= 1.2;
    finishCover();
    strokeTxt('IN DIESER STADT', W / 2, H * .16, 98, 'Lucky', ['#ffffff', '#d8e4ff'], '#0a1238', 26);
    strokeTxt('SCHLAFWANDELT', W / 2, H * .215, 118, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 28, -.02);
    strokeTxt('JEDER!', W / 2, H * .28, 150, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 32, -.02);
    const hd = proj(hp(b).add(V(0, .3, 0))), ft = proj(V(p.x, 0, p.z)); ringMark(hd[0], (hd[1] + ft[1]) / 2 - 20, 175, (ft[1] - hd[1]) / 2 + 110);
    strokeTxt('NUR ICH NICHT…', W / 2, H * .8, 104, 'Lilita', ['#ffffff', '#ffd0d0'], '#4a0010', 24, -.02);
    sparkle(W * .1, H * .14, 26); sparkle(W * .9, H * .25, 22); zTxt(W * .86, H * .36, 70); zTxt(W * .12, H * .4, 56, -.2);
  } else { use('MT'); night(26); RH.g.visible = true; const Z = RH.DOORS[1].z; for (const d of RH.DOORS) d.pv.rotation.y = -1.55; lp(0, -7, 9, Z + 9, 50); lp(1, 7, 9, Z + 9, 50); lp(2, 0, 7, Z + 18, 30);
    const b = put(ben, 0, 0, Z + 4.4, 0); actuar(b, 0, [[0, { ...sleepP(T, 0), aLx: 1.45, aRx: 1.45, aLe: .05, aRe: .05 }]], { T }); cara(b, T, { eyes: 'side_l', mouth: 'grimace', noBlink: 1 }); sweat(b, T, 1);
    [[SL[0], -8.6, Z + 1.2], [SL[3], 8.6, Z + 1.4], [SL[9], 0, Z - .3], [SL[2], -4.2, Z + 2.6], [SL[7], 4.4, Z + 2.8]].forEach(([c, x, z], i) => { put(c, x, 0, z, -x * .02); actuar(c, 0, [[0, { ...sleepP(T, i + 2), aLx: 1.45, aRx: 1.45, aLe: .05, aRe: .05 }]], { T }); sleepFace(c, T); });
    cam([0, 6.4, Z + 25], [0, 4.4, Z + 2], 50); sh(V(0, 0, Z + 4), 30);
    finishCover();
    strokeTxt('UM 3 UHR NACHTS', W / 2, H * .15, 104, 'Lilita', ['#ffffff', '#d8e4ff'], '#0a1238', 24);
    strokeTxt('GEHEN ALLE', W / 2, H * .205, 118, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 28, -.02);
    strokeTxt('TÜREN AUF!', W / 2, H * .265, 138, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 30, -.02);
    const hd = proj(hp(b).add(V(0, .3, 0))), ft = proj(V(0, 0, Z + 4.4)); ringMark(hd[0], (hd[1] + ft[1]) / 2 - 10, 150, (ft[1] - hd[1]) / 2 + 100);
    strokeTxt('ICH TU NUR SO…', W / 2, H * .81, 104, 'Lucky', ['#ffffff', '#ffd0d0'], '#4a0010', 24, -.02);
    sparkle(W * .12, H * .3, 24); sparkle(W * .88, H * .13, 26); } };

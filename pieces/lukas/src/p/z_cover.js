// ---------- portadas (fuera del vídeo) ----------
// 1: la plaza al atardecer: chicos LUKAS y chicas MIA se ríen de mí. 2: el estadio: 5000 Lukas girados… menos uno (Gerhard).
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function tagSticker(x, y, s, rot, name = 'LUKAS', col = '#d8202f') { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 22; c.shadowOffsetY = 8;
  c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(-160, -110, 320, 220, 24); c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.stroke();
  c.fillStyle = col; c.beginPath(); c.roundRect(-156, -106, 312, 88, [20, 20, 0, 0]); c.fill(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.font = `46px Lilita`; c.fillText('HALLO', 0, -76); c.font = `24px Lilita`; c.fillText('ich heiße', 0, -38);
  c.fillStyle = '#16161e'; c.font = `70px Lucky`; c.fillText(name, 0, 44); c.restore(); }
function ringMark(x, y, rx, ry, col = '#ff2a4a') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .2, 6.1); c.stroke(); c.restore(); }
function arrowTo(x0, y0, x1, y1, col = '#ff2a4a') { const c = octx, a = Math.atan2(y1 - y0, x1 - x0); c.save(); c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = col; c.fillStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + 60, (y0 + y1) / 2 - 40, x1, y1); c.stroke(); c.translate(x1, y1); c.rotate(a + .3); c.beginPath(); c.moveTo(14, 0); c.lineTo(-40, -30); c.lineTo(-40, 30); c.closePath(); c.fill(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function stamp(x, y, rot) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 18; c.fillStyle = '#fffdf2'; c.beginPath(); c.roundRect(-230, -95, 460, 190, 16); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = '#9ac0e8'; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-220, -40 + k * 50); c.lineTo(220, -40 + k * 50); c.stroke(); }
  c.textAlign = 'left'; c.textBaseline = 'middle'; c.font = '40px Lilita'; c.fillStyle = '#1a2a6a'; c.fillText('Adrian ..... hier ✓', -205, -62); c.fillText('Adrian ..... hier ✓', -205, -12); c.fillStyle = '#d8202f'; c.font = '46px Lilita'; c.fillText('Müller ... ABWESEND', -205, 46);
  c.strokeStyle = '#d8202f'; c.lineWidth = 7; c.beginPath(); c.ellipse(5, 46, 225, 38, -.03, 0, 7); c.stroke(); c.restore(); }
function vignette(a) { const c = octx, g = c.createRadialGradient(W / 2, H * .45, W * .35, W / 2, H * .45, H * .72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(8,0,20,${a})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function finishCover() { grade.uniforms.sharp.value = 1.55; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }

window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); await document.fonts.load('80px Titan'); const T = 3.3, L = { T, lt: 1, k: 1 }; hideAll(); BAD_.length = 0;
  if (v === 0) { street(L); PCAR2.visible = false; const p = V(SHX - 22, 0, 4.5);
    put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { aLx: .5, aLz: -.5, aLe: 1.9, aRx: .3, aRz: .25, headX: .12, headZ: -.06 }]], { T }); cara(me, T, { expr: 'sad', eyes: 'worried', mouth: 'frown', noBlink: 1 });
    const B = BOYS(CROWD).filter(c => c !== det), G = GIRLZ(CROWD);
    // otros burlones: unos graban con el móvil, otros se tapan la boca o se doblan de risa
    const R = [[B[14], -3.6, -1.6, 'phone'], [G[7], 3.6, -1.6, 'phone'], [B[18], -6.4, -1.0, 'belly'], [G[10], 6.4, -1.2, 'mouth'], [B[11], -4.6, 3.6, 'point'], [G[12], 4.6, 3.4, 'belly'], [B[20], -8.6, 1.6, 'point'], [G[3], 8.6, 1.4, 'point']];
    R.forEach(([c, dx, dz, m], i) => { if (!c) return; const x = p.x + dx, z = p.z + dz, toMe = Math.atan2(p.x - x, p.z - z); put(c, x, 0, z, toMe * .45);
      const P = m === 'phone' ? { aRx: 1.9, aRz: -.1, aRe: 1.2, aLx: .4, lean: -.05 } : m === 'belly' ? { aLx: .9, aRx: .9, aLe: 1.7, aRe: 1.7, aLz: -.2, aRz: -.2, lean: .18, headX: -.15 } : m === 'mouth' ? { aRx: 2.4, aRe: 2.5, aRz: -.3, aLx: .9, aLe: 1.6, headX: -.05 } : { aRx: 1.6, aRz: dx < 0 ? -.15 : .05, aRe: .05, aLx: .6, aLz: -.4, aLe: 1.6, lean: -.1 };
      actuar(c, 0, [[0, P]], { T: T + i }); laughF(c, T + i * .7);
      if (m === 'phone') { const ph = PHONES[i % 3], h = wpos(c.aR.hand); show(ph, h.x, h.y + .55, h.z, c.root.rotation.y + PI, .7); } });
    cam([p.x, 4.2, p.z + 19], [p.x, 2.6, p.z - 4], 48); sh(V(p.x, 0, p.z + 1), 24); FILL.intensity = 55; hemi.intensity = 1.35;
    finishCover(); vignette(.62);
    const top = proj(V(p.x, 4.75, p.z)), bot = proj(V(p.x, -.1, p.z)), sl = proj(V(p.x - 2.25, 2.6, p.z)), sr = proj(V(p.x + 2.25, 2.6, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * .172, 116, 'Titan', ['#ffffff', '#fff2c8'], '#000000', 26, 0, W * .94);
    strokeTxt('HEISSEN ALLE', W / 2, H * .236, 102, 'Titan', ['#ffffff', '#fff2c8'], '#000000', 24);
    tagSticker(W * .29, H * .318, .8, -.08, 'LUKAS', '#1f6fe0'); tagSticker(W * .71, H * .318, .8, .08, 'MIA', '#e0307a');
    ringMark((sl[0] + sr[0]) / 2, (top[1] + bot[1]) / 2, (sr[0] - sl[0]) / 2 + 55, (bot[1] - top[1]) / 2 + 45, '#ffe21a');
    strokeTxt('… AUSSER MIR', W / 2, Math.min(H * .85, bot[1] + 125), 128, 'Titan', ['#2e9bff', '#0038ff'], '#000000', 26, -.03);
    sparkle(W * .1, H * .15, 30, '#fff3a0'); sparkle(W * .9, H * .21, 24, '#fff3a0');
  } else { stadium(L); standsT(L, { turned: true, face: BFACE, expr: 'shock' }); const dp = detSeat(); const d = put(det, dp.x, dp.y, dp.z, PI * .85); actuar(d, 0, [[0, { aLx: .3, aRx: .3, headY: .1 }]], { T });
    cam([SX - 25.4, 14.5, 9.5], [dp.x - 1.5, dp.y + 2.2, dp.z - 2], 50); sh(dp, 28); hemi.intensity = 1.25; sun.intensity = 2.6;
    const q = proj(V(dp.x, dp.y + 3.7, dp.z));
    finishCover(); vignette(.55); strokeTxt('5000 LUKAS', W / 2, H * .17, 130, 'Lilita', ['#ffe86a', '#ffb000'], '#2a1600', 26);
    strokeTxt('DREHEN SICH UM', W / 2, H * .235, 100, 'Lilita', ['#ffffff', '#cfe8ff'], '#071a3a', 24);
    ringMark(q[0], q[1], 95, 110, '#ffe21a'); arrowTo(W * .2, H * .76, q[0] - 80, q[1] + 105, '#ffe21a');
    strokeTxt('… AUSSER EINEM', W / 2, H * .82, 116, 'Lilita', ['#ff5a5a', '#e0001a'], '#2a0008', 26, -.02);
    sparkle(W * .86, H * .3, 30); sparkle(W * .12, H * .28, 22); } };

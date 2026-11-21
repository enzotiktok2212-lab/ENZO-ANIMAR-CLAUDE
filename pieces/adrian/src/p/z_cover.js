// ---------- portadas (fuera del vídeo) ----------
// 1: la fuente de la plaza al atardecer, guirnaldas encendidas; todos (con su placa ADRIAN) me señalan; yo en el centro sin placa.
// 2: la clase: todos levantan la mano gritando «HIER!» menos yo, en primera fila; la lista con «Müller – ABWESEND» por encima.
// Tipografías propias de portada (Luckiest Guy / Lilita One), pegatinas 2D por encima, AO y luz cálida.
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function tagSticker(x, y, s, rot, name = 'ADRIAN') { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 22; c.shadowOffsetY = 8;
  c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(-160, -110, 320, 220, 24); c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.stroke();
  c.fillStyle = '#d8202f'; c.beginPath(); c.roundRect(-156, -106, 312, 88, [20, 20, 0, 0]); c.fill(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.font = `46px Lilita`; c.fillText('HALLO', 0, -76); c.font = `24px Lilita`; c.fillText('ich heiße', 0, -38);
  c.fillStyle = '#16161e'; c.font = `70px Lucky`; c.fillText(name, 0, 44); c.restore(); }
function ringMark(x, y, rx, ry, col = '#ff2a4a') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .2, 6.1); c.stroke(); c.restore(); }
function arrowTo(x0, y0, x1, y1, col = '#ff2a4a') { const c = octx, a = Math.atan2(y1 - y0, x1 - x0); c.save(); c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = col; c.fillStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + 60, (y0 + y1) / 2 - 40, x1, y1); c.stroke(); c.translate(x1, y1); c.rotate(a + .3); c.beginPath(); c.moveTo(14, 0); c.lineTo(-40, -30); c.lineTo(-40, 30); c.closePath(); c.fill(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function stamp(x, y, rot) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 18; c.fillStyle = '#fffdf2'; c.beginPath(); c.roundRect(-230, -95, 460, 190, 16); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = '#9ac0e8'; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-220, -40 + k * 50); c.lineTo(220, -40 + k * 50); c.stroke(); }
  c.textAlign = 'left'; c.textBaseline = 'middle'; c.font = '40px Lilita'; c.fillStyle = '#1a2a6a'; c.fillText('Adrian ..... hier ✓', -205, -62); c.fillText('Adrian ..... hier ✓', -205, -12); c.fillStyle = '#d8202f'; c.font = '46px Lilita'; c.fillText('Müller ... ABWESEND', -205, 46);
  c.strokeStyle = '#d8202f'; c.lineWidth = 7; c.beginPath(); c.ellipse(5, 46, 225, 38, -.03, 0, 7); c.stroke(); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.55; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); const T = 3.3, L = { T, lt: 1, k: 1 }; hideAll(); BAD_.length = 0; BIRDSON = 0;
  if (v === 0) { town(L, { dusk: true, fest: true }); const p = V(-18, 0, -8);
    put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, GEST.shrug]], { T }); cara(me, T, { expr: 'worried', eyes: 'side_l', mouth: 'wavy', noBlink: 1 });
    // burlones alrededor: de 3/4 hacia cámara, señalándome y riéndose, con la placa ADRIAN bien visible
    [[EX[4], -4.1, -.9], [EX[1], 4.1, -.9], [EX[9], -2.6, -4.6], [EX[2], 2.7, -4.8], [KIDS[1], -3.9, 2.4], [KIDS[5], 3.9, 2.2]].forEach(([c, dx, dz], i) => {
      const x = p.x + dx, z = p.z + dz, toMe = Math.atan2(p.x - x, p.z - z); put(c, x, 0, z, toMe * .4); c.setTag('ADRIAN');
      actuar(c, 0, [[0, { aRx: 1.6, aRz: dx < 0 ? -.15 : .05, aRe: .05, aLx: .6, aLz: -.4, aLe: 1.6, lean: -.1 + Math.sin(i) * .04, headX: -.08 }]], { T: T + i }); laughF(c, T + i * .7); });
    cam([p.x, 3.8, p.z + 17.5], [p.x, 2.6, p.z - 4], 50); sh(V(p.x, 0, p.z - 2), 22); hemi.intensity = 1.25; sun.intensity = 2.6; FILL.intensity = 45;
    finishCover();
    const top = proj(V(p.x, 4.75, p.z)), bot = proj(V(p.x, -.1, p.z)), sl = proj(V(p.x - 2.25, 2.6, p.z)), sr = proj(V(p.x + 2.25, 2.6, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * .18, 112, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 26);
    strokeTxt('HEISST JEDER', W / 2, H * .24, 96, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 24);
    tagSticker(W / 2, H * .315, .74, -.05);
    ringMark((sl[0] + sr[0]) / 2, (top[1] + bot[1]) / 2, (sr[0] - sl[0]) / 2 + 55, (bot[1] - top[1]) / 2 + 45, '#ff0018');
    strokeTxt('… AUSSER MIR', W / 2, Math.min(H * .86, bot[1] + 130), 120, 'Lucky', ['#ff5a5a', '#e0001a'], '#2a0008', 26, -.02);
    sparkle(W * .12, H * .16, 30); sparkle(W * .88, H * .2, 24);
  } else { school(L); classKids(L, { hands: T - 2, shout: true }); const s = V(KX, 0, .6); put(me, s.x, sitY(me), s.z, PI); actuar(me, 0, [[0, seatPose({ aLx: 1.1, aRx: 1.1, aLe: 1.7, aRe: 1.7, aLz: -.35, aRz: -.35, headX: .08 })]], { T }); cara(me, T, { expr: 'sad', eyes: 'worried', mouth: 'frown', noBlink: 1 });
    put(lehr, KX + 7.5, 0, -8.5, -.6); actuar(lehr, 0, [[0, { aLx: 2.6, aLz: .3, aLe: .3 }]], { T }); cara(lehr, T, { expr: 'happy', mouth: 'open_smile', noBlink: 1 });
    cam([KX + 7.5, 11.5, -13], [KX - 1.5, 2.6, 7], 60); sh(V(KX, 0, 4), 22); FILL.intensity = 40; inside(1.05, 40);
    finishCover();
    strokeTxt('ALLE RUFEN „HIER!“', W / 2, H * .2, 104, 'Lilita', ['#7af0ff', '#2aa8ff'], '#071a3a', 24);
    strokeTxt('… AUSSER MIR', W / 2, H * .27, 118, 'Lilita', ['#ffb0d8', '#ff3a8a'], '#3a0420', 26, -.03);
    stamp(W * .5, H * .79, -.04); arrowTo(W * .3, H * .35, W * .53, H * .49, '#ff3a8a'); sparkle(W * .86, H * .33, 30, '#bff6ff'); sparkle(W * .12, H * .3, 22, '#ffd0ea'); } };

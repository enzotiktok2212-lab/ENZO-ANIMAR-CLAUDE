// ---------- portadas (fuera del vídeo) ----------
// Tipografías propias de portada (Luckiest Guy / Lilita One), pegatinas 2D por encima, AO y luz cálida.
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.55; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff2a4a') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .2, 6.1); c.stroke(); c.restore(); }
function arrowTo(x0, y0, x1, y1, col = '#ff2a4a') { const c = octx, a = Math.atan2(y1 - y0, x1 - x0); c.save(); c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = col; c.fillStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + 60, (y0 + y1) / 2 - 40, x1, y1); c.stroke(); c.translate(x1, y1); c.rotate(a + .3); c.beginPath(); c.moveTo(14, 0); c.lineTo(-40, -30); c.lineTo(-40, 30); c.closePath(); c.fill(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
// 1: el Domplatz a media tarde: yo en mi silla gamer en el centro, relajado; alrededor todos en sus botellas me miran furiosos y me señalan; el agujero brilla lila.
// 2: primer plano: yo en mi botella, incómodo; la plaza entera en botellas detrás; «KEINE STÜHLE?!»
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); const T = 33.9, L = { T, lt: 1, k: 1, t0: 33, t1: 35 }; hideAll(); BAD_.length = 0; BIRDSON = 0; DOF = 0;
  if (v === 0) { town(L, { dusk: 1 }); const p = V(CP.x, 0, CP.z); myHole(L, .35, .3);
    inChair(ich, p.x, p.z, 0, L, { lean: -.3, aLx: -.2, aRx: -.2, aLz: 1.0, aRz: 1.0, aLe: 2.2, aRe: 2.2, headX: -.1 }); cara(ich, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', noBlink: 1 });
    [[EX[4], -5.4, -2], [EX[1], 5.6, -2.4], [EX[9], -3.2, -7.5], [EX[2], 3.4, -7.8], [EX[14], -6.8, 4.4], [EX[11], 7, 4]].forEach(([c, dx, dz], i) => {
      const x = p.x + dx, z = p.z + dz, toMe = Math.atan2(p.x - x, p.z - z); seat(c, x, z, toMe * .55, L, { wob: 0, pose: { aRx: 1.6, aRz: dx < 0 ? -.15 : .05, aRe: .05, aLx: .6, aLz: -.4, aLe: 1.6, lean: -.05 } }); c.root.rotation.z = 0; c.root.rotation.x = 0;
      cara(c, T + i, { expr: 'angry', eyes: 'angry', mouth: i % 2 ? 'talk_wide' : 'grimace', noBlink: 1 }); });
    plaza(L, { n: 14, r0: 14, r1: 30, seed: 5, mode: 'stare', face: V(p.x, 4, p.z) }); while (POST.length) POST.shift()();
    cam([p.x, 5.6, p.z + 17.5], [p.x, 3.4, p.z - 4], 50); sh(V(p.x, 0, p.z - 2), 26); hemi.intensity = 1.2; FILL.intensity = 40;
    finishCover();
    const top = proj(V(p.x, 8.2, p.z)), bot = proj(V(p.x, -.1, p.z)), sl = proj(V(p.x - 2.6, 4, p.z)), sr = proj(V(p.x + 2.6, 4, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * .145, 112, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 26);
    strokeTxt('SITZT JEDER AUF', W / 2, H * .197, 92, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 22);
    strokeTxt('EINER FLASCHE', W / 2, H * .25, 112, 'Lucky', ['#8aff9a', '#1ab84a'], '#04300e', 26, -.02);
    ringMark((sl[0] + sr[0]) / 2, (top[1] + bot[1]) / 2, (sr[0] - sl[0]) / 2 + 40, (bot[1] - top[1]) / 2 - 10, '#ff0018');
    strokeTxt('… AUSSER MIR', W / 2, Math.min(H * .86, bot[1] + 110), 120, 'Lucky', ['#ff5a5a', '#e0001a'], '#2a0008', 26, -.02);
    sparkle(W * .12, H * .14, 30); sparkle(W * .88, H * .2, 24);
  } else { town(L); const p = V(CP.x, 0, CP.z);
    seat(ich, p.x, p.z, 0, L, { col: 0, wob: 0, pose: { aLx: -.45, aLz: .35, aLe: .9, aRx: -.35, aRz: .35, aRe: .9, lean: .12, headX: -.05 } }); ich.root.rotation.set(0, 0, 0); cara(ich, T, { expr: 'worried', eyes: 'closed', mouth: 'grimace', noBlink: 1 }); stars(ich, T, 5);
    plaza(L, { n: 22, r0: 7, r1: 28, seed: 9, mode: 'ouch', gap: 1.1 }); while (POST.length) POST.shift()();
    cam([p.x, 5.8, p.z + 18], [p.x, 5.0, p.z], 48); sh(V(p.x, 0, p.z - 4), 26); FILL.intensity = 40;
    finishCover();
    strokeTxt('HIER SITZEN ALLE', W / 2, H * .145, 104, 'Lilita', ['#ffffff', '#ffe2b8'], '#14143a', 24);
    strokeTxt('AUF FLASCHEN', W / 2, H * .215, 124, 'Lilita', ['#8aff9a', '#1ab84a'], '#04300e', 26, -.02);
    strokeTxt('… UND ES TUT WEH!', W / 2, H * .84, 104, 'Lucky', ['#ff5a5a', '#e0001a'], '#2a0008', 24, -.02);
    sparkle(W * .88, H * .3, 30, '#fff6c0'); sparkle(W * .12, H * .3, 22, '#ffd0ea'); } };

// ---------- portadas (fuera del vídeo) ----------
// Tipografías propias de portada (Luckiest Guy / Lilita One), pegatinas 2D por encima, AO y luz cálida.
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.55; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff2a4a') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .2, 6.1); c.stroke(); c.restore(); }
function arrowTo(x0, y0, x1, y1, col = '#ff2a4a') { const c = octx, a = Math.atan2(y1 - y0, x1 - x0); c.save(); c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = col; c.fillStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + 60, (y0 + y1) / 2 - 40, x1, y1); c.stroke(); c.translate(x1, y1); c.rotate(a + .3); c.beginPath(); c.moveTo(14, 0); c.lineTo(-40, -30); c.lineTo(-40, 30); c.closePath(); c.fill(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
// 1: patio del Männergefängnis: yo (M-199) en el centro, sudando, con el marcador 9.990 / 10.000 detrás; dos Wärterinnen de brazos cruzados; presos alrededor.
// 2: plaza de Frauenstein al atardecer, la estatua gigante detrás: un bebé con mono naranja «M-001» en su cuna; las vecinas lo señalan.
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; const T = 20.3, L = { T, lt: 1, k: 1, t0: 20, t1: 21 }; hideAll(); BAD_.length = 0; BIRDSON = 0; DOF = 0;
  if (v === 0) { knast(L, { sb: ['9.990 / 10.000', '#ffd23f'] }); const p = V(KNX - 22, 0, 4);
    const b = put(ben, p.x, 0, p.z, 0); actuar(b, 0, [[0, { aLx: .5, aRx: .5, aLz: .45, aRz: .45, aLe: 1.1, aRe: 1.1, headX: -.1 }]], { T }); cara(b, T, { expr: 'worried', eyes: 'wide', mouth: 'grimace', noBlink: 1 }); sweat(b, T, 2);
    for (const s of [-1, 1]) { const g = put(WA[s < 0 ? 0 : 1], p.x + s * 4.6, 0, p.z - 1.4, -s * .35); actuar(g, 0, [[0, 'cross']], { T }); cara(g, T, { expr: 'smug', noBlink: 1 }); }
    [[INS[2], -7.5, -5], [INS[3], 7.8, -5.4], [INS[4], -3.5, -8], [INS[5], 3.6, -8.4]].forEach(([c, dx, dz], i) => { put(c, p.x + dx, 0, p.z + dz, Math.atan2(-dx, -dz) * .3); actuar(c, 0, [[0, i % 2 ? 'point' : 'hands_head']], { T }); cara(c, T + i, { expr: 'shock', noBlink: 1 }); });
    cam([p.x + 1.2, 3.6, p.z + 24], [p.x - .6, 11.5, p.z - 10], 50); sh(V(p.x, 0, p.z - 3), 26); hemi.intensity = 1.15;
    finishCover();
    const top = proj(V(p.x, 8.4, p.z)), bot = proj(V(p.x, -.1, p.z)), sl = proj(V(p.x - 2.6, 4, p.z)), sr = proj(V(p.x + 2.6, 4, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * .14, 110, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 26);
    strokeTxt('IST JEDER MANN', W / 2, H * .193, 104, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 24);
    strokeTxt('IM GEFÄNGNIS', W / 2, H * .25, 120, 'Lucky', ['#ffb070', '#ff6a10'], '#3a1400', 26, -.02);
    ringMark((sl[0] + sr[0]) / 2, (top[1] + bot[1]) / 2, (sr[0] - sl[0]) / 2 + 10, (bot[1] - top[1]) / 2 - 6, '#ff0018');
    strokeTxt('NUR 10 PUNKTE FEHLEN…', W / 2, Math.min(H * .85, bot[1] + 80), 96, 'Lucky', ['#ff5a5a', '#e0001a'], '#2a0008', 24, -.02);
    sparkle(W * .1, H * .12, 28); sparkle(W * .9, H * .19, 22);
  } else { town(L, { dusk: 1 }); const p = V(0, 0, -30);
    show(CRIB, p.x, 0, p.z, 0); const b = put(baby, p.x, 3.05, p.z - .2, 0); b.root.scale.setScalar(.5); b.blob.visible = false; actuar(b, 0, [[0, { aLx: 2.3, aRx: 2.3, aLz: .35, aRz: .35, aLe: 1.1, aRe: 1.1 }]], { T }); cara(b, T, { expr: 'cry', noBlink: 1 }); tears(b, T);
    const g = put(WA[2], p.x + 4.4, 0, p.z - 1, -.4); actuar(g, 0, [[0, { aRx: 1.4, aRe: .4 }]], { T }); attach(CUFFS, g.aR.hand, [0, -.6, 0], [0, 0, 0], 1); cara(g, T, { expr: 'smug', noBlink: 1 });
    [[EX[1], -5, -1.5], [EX[3], -6.5, -5], [EX[5], 6.8, -5], [EX[7], -2.8, -7.5], [EX[9], 3, -7.8]].forEach(([c, dx, dz], i) => { const x = p.x + dx, z = p.z + dz; put(c, x, 0, z, Math.atan2(p.x - x, p.z - z)); actuar(c, 0, [[0, i % 2 ? 'point' : { aLx: 1.0, aLz: .4, aLe: 1.6, aRx: 1.0, aRz: .4, aRe: 1.6 }]], { T }); cara(c, T + i, { expr: i % 2 ? 'smug' : 'gasp', noBlink: 1 }); });
    const q = hp(b); cam([q.x + 1.2, q.y + 2.4, q.z + 8.5], [q.x, q.y + 1.8, q.z - 6], 50); sh(V(p.x, 0, p.z - 3), 24); hemi.intensity = 1.2; FILL.intensity = 40;
    finishCover();
    const bc = proj(q.clone().add(V(0, -.6, 0)));
    strokeTxt('IN DIESER STADT', W / 2, H * .15, 104, 'Lilita', ['#ffffff', '#ffe2b8'], '#14143a', 22);
    strokeTxt('SIND FRAUENRECHTE', W / 2, H * .205, 100, 'Lilita', ['#ffffff', '#ffe2b8'], '#14143a', 22);
    strokeTxt('HEILIG', W / 2, H * .27, 150, 'Lucky', ['#ff9ad0', '#ff2a8a'], '#3a0020', 28, -.02);
    ringMark(bc[0], bc[1], 175, 215, '#ff0018');
    strokeTxt('SCHON ALS BABY IM KNAST', W / 2, H * .865, 92, 'Lucky', ['#ffb070', '#ff6a10'], '#3a1400', 22, -.02);
    sparkle(W * .9, H * .33, 30); sparkle(W * .1, H * .34, 22, '#ffd0f0'); } };

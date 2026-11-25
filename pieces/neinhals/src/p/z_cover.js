
// ---------- portadas (fuera del vídeo) ----------
// Tipografías propias de portada (Luckiest Guy / Lilita One), pegatinas 2D por encima, AO y luz cálida. Lo importante entre y = 240 y 1680.
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff1a2e') { const c = octx; c.save(); c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.lineWidth = 30; c.strokeStyle = '#000'; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .25, 6.05); c.stroke(); c.shadowColor = 'transparent';
  c.lineWidth = 18; c.strokeStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .25, 6.05); c.stroke(); c.restore(); }
function bigArrow(x0, y0, x1, y1, bend = 80, col = '#ff1a2e') { const c = octx, mx = (x0 + x1) / 2 + bend, my = (y0 + y1) / 2 - bend * .6, a = Math.atan2(y1 - my, x1 - mx);
  const head = (lw, fill, stroke) => { c.save(); c.translate(x1, y1); c.rotate(a); c.beginPath(); c.moveTo(18, 0); c.lineTo(-78, -58); c.lineTo(-58, 0); c.lineTo(-78, 58); c.closePath(); c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.stroke(); } if (fill) { c.fillStyle = fill; c.fill(); } c.restore(); };
  const ex = x1 - Math.cos(a) * 60, ey = y1 - Math.sin(a) * 60; c.save(); c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 22; c.shadowOffsetY = 8;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, ex, ey); c.lineWidth = 58; c.strokeStyle = '#000'; c.stroke(); head(24, null, '#000'); c.shadowColor = 'transparent';
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, ex, ey); c.lineWidth = 36; const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#ff5a5a'); g.addColorStop(1, col); c.strokeStyle = g; c.stroke(); head(0, col, null);
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, ex, ey); c.lineWidth = 8; c.strokeStyle = 'rgba(255,255,255,.35)'; c.stroke(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
// pegatina: bocadillo «NEIN!» con borde negro y cola hacia (tx, ty)
function neinSticker(x, y, txt_, tx, ty, size = 92, rot = -.06, fill = '#ffffff', ink = '#d8102a') { const c = octx; c.save(); c.font = `${size}px Lucky`; const w = c.measureText(txt_).width + size * .9, h = size * 1.45;
  c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 20; c.shadowOffsetY = 8; c.lineJoin = 'round';
  const path = () => { c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h * .42); const ang = Math.atan2(ty - y, tx - x) - rot, bx = Math.cos(ang) * w * .28, by = Math.sin(ang) > 0 ? h / 2 - 4 : -h / 2 + 4; c.moveTo(bx - 34, by); c.lineTo(Math.cos(ang) * w * .5, Math.sin(ang) * h * .95); c.lineTo(bx + 34, by); };
  path(); c.lineWidth = 16; c.strokeStyle = '#000'; c.stroke(); c.shadowColor = 'transparent'; c.fillStyle = fill; c.fill(); c.fillStyle = fill; c.fillRect(-w * .2, -h * .3, w * .4, h * .6);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = ink; c.fillText(txt_, 0, size * .06); c.restore(); }
// pegatina de metros (cinta métrica amarilla) en diagonal
function meterTape(x, y, txt_, rot = -.12, size = 74) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px Lucky`; const w = c.measureText(txt_).width + 90, h = size * 1.35;
  c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 18; c.shadowOffsetY = 8; c.fillStyle = '#000'; c.fillRect(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16); c.shadowColor = 'transparent'; c.fillStyle = '#ffd21a'; c.fillRect(-w / 2, -h / 2, w, h);
  c.fillStyle = '#1a1a1a'; for (let i = 0; i <= w; i += 18) c.fillRect(-w / 2 + i, -h / 2, 3, i % 90 === 0 ? 22 : 12); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#d8102a'; c.fillText(txt_, 0, 10); c.restore(); }

// 1: la plaza de Brauheim al atardecer: Timo, pillado mintiendo, con el cuello disparado hacia el cielo; Jana delante le enseña el chat de «LISA ♥»; la plaza señala y graba.
// 2: la plaza a mediodía, delante del cartel de la regla: Luca, el único con cuello normal, en el centro; a su alrededor todos con cuellos enormes se inclinan para mirarle.
let RING2 = [[mann, -5.5, -3.5, 7.2, 1.0, .85], [mama, 5.5, -4, 7.2, 1.0, .85], [vogt, -3.4, -9, 9, 1.2, .9], [schw, 3.6, -9, 9, 1.2, .9], [bm, 0, -12, 10, 1.25, .95], [CR[2], -7, -13, 8.5, 1.0, .85], [CR[4], 7, -13.5, 8.5, 1.0, .85]], CAM1 = [0, 3.4, 19, 0, 7.4, -3, 60], TY1 = [.165, .86];
window.CV1 = o => { if (o.cam) CAM1 = o.cam; if (o.ty) TY1 = o.ty; if (o.ring) o.ring.forEach((r, i) => RING2[i].splice(1, 5, ...r)); };
let TY = [.41, .31], JX = [-3.6, 2.4, 2.2], NK0 = 22, CAM0 = [2.5, 3, 7.5, 0, -5.05, -.6, 86];
window.CV = o => { if (o.ty) TY = o.ty; if (o.jx) JX = o.jx; if (o.nk) NK0 = o.nk; if (o.cam) CAM0 = o.cam; };
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
  const T = 20.3, L = { T, lt: 1, k: 1, t0: 20, t1: 21, d: 1 }; hideAll(); BAD_.length = 0; FX2D.length = 0; BIRDSON = 0; DOF = 0;
  if (v === 0) { town(L, { dusk: true }); const p = V(-8, 0, 12);
    const t = put(timo, p.x, 0, p.z, 0); neck(t, NK0, T, { bend: .12, sway: 0, lean: .04 }); t.head.rotation.x = -.55; t.head.rotation.y = .1; actuar(t, 0, [[0, { aLx: .9, aRx: .9, aLz: .55, aRz: .55, aLe: 1.9, aRe: 1.9, lean: -.06 }]], { T }); cara(t, T, { expr: 'shock', eyes: 'wide', mouth: 'grimace', noBlink: 1 }); sweat(t, T);
    const j = put(jana, p.x + JX[0], 0, p.z + JX[1], JX[2]); neck(j, 1.2, T); actuar(j, 0, [[0, { aRx: 2.2, aRz: .1, aRe: .2, aLx: .9, aLz: -.5, aLe: 1.8, lean: -.04 }]], { T }); handyP(j, 1.6); PH.userData.S.draw('chat', drawChat); cara(j, T, { expr: 'angry', eyes: 'angry', mouth: 'grimace', noBlink: 1 }); j.head.rotation.x = -.75;
    [[CR[0], -7, 4, 'point', 1], [CR[1], 8, 1, 'point', 0], [CR[2], -9, -5, 'shock', 1], [CR[3], 9, -6, 'point', 1.5], [CR[5], -3, -9, 'cheer', 0], [CR[6], 5, -11, 'shock', 1]].forEach(([c, dx, dz, m, n], i) => crowdGuy(c, p.x + dx, p.z + dz, L, i, { mode: m, face: V(p.x, 40, p.z + 6), neck: n }) || (c.head.rotation.x -= .75));
    const hd = hp(t); cam([hd.x + CAM0[0], hd.y + CAM0[1], hd.z + CAM0[2]], [hd.x + CAM0[3], hd.y + CAM0[4], hd.z + CAM0[5]], CAM0[6]); sh(V(p.x, 0, p.z), 40); hemi.intensity = 1.2; camera.updateProjectionMatrix(); CR.forEach(c => { if (c.root.visible && proj(c.root.position)[1] > 1600) c.root.visible = false; }); FACES.push(t); clearFaces();
    finishCover(); const th = proj(hp(t).add(V(0, .4, 0)));
    neinSticker(th[0] + 290, th[1] - 40, 'NEIN!', th[0] + 130, th[1] + 10, 96, .08);
    strokeTxt('IN DIESER STADT', W / 2, H * TY[0], 92, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 24);
    strokeTxt('WÄCHST DEIN HALS', W / 2, H * (TY[0] + .05), 92, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 24);
    strokeTxt('BEI JEDEM NEIN!', W / 2, H * (TY[0] + .115), 128, 'Lucky', ['#ff8a8a', '#e01a2a'], '#3a0008', 30, -.03);
    meterTape(W * .5, H * TY[1], 'LÜGE = +10 METER', -.06);
  } else { town(L); const p = V(-6, 0, 16); show(RULE, p.x, 0, p.z - 46, 0);
    const l = put(luca, p.x, 0, p.z, 0); actuar(l, 0, [[0, { aLx: .5, aRx: .5, aLz: .55, aRz: .55, aLe: 1.6, aRe: 1.6, lean: -.04 }]], { T }); cara(l, T, { expr: 'worried', eyes: 'wide', mouth: 'grimace', noBlink: 1 }); l.head.rotation.x = -.32; sweat(l, T);
    RING2.forEach(([c, dx, dz, n, bd, hx], i) => { const x = p.x + dx, z = p.z + dz; put(c, x, 0, z, Math.atan2(p.x - x, p.z - z)); neck(c, n, T, { bend: bd, sway: 0 }); c.head.rotation.x = hx;
      actuar(c, 0, [[0, i % 2 ? { aRx: 1.7, aRe: .15, aRz: .1, aLx: .3 } : { aLx: .4, aRx: .4, aLz: -.25, aRz: -.25, aLe: 1.7, aRe: 1.7 }]], { T }); cara(c, T + i, { expr: ['shock', 'sus', 'confused', 'shock', 'sus', 'confused', 'shock'][i], mouth: ['o', 'smirk', 'flat', 'grimace', 'smirk', 'o', 'flat'][i], noBlink: 1 }); });
    cam([p.x + CAM1[0], CAM1[1], p.z + CAM1[2]], [p.x + CAM1[3], CAM1[4], p.z + CAM1[5]], CAM1[6]); sh(V(p.x, 0, p.z - 6), 50); FACES.push(l); clearFaces();
    finishCover();
    const lh = proj(hp(l).add(V(0, .75, 0))), lf = proj(V(p.x, 0, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * TY1[0], 96, 'Lilita', ['#ffffff', '#ffe2b8'], '#14143a', 24);
    strokeTxt('WÄCHST DEIN HALS BEI', W / 2, H * (TY1[0] + .05), 88, 'Lilita', ['#ffffff', '#ffe2b8'], '#14143a', 22);
    strokeTxt('JEDEM NEIN!', W / 2, H * (TY1[0] + .11), 130, 'Lucky', ['#ff8a8a', '#e01a2a'], '#3a0008', 30, -.03);
    const lc = proj(hp(l).add(V(0, -.9, 0))), lt_ = proj(hp(l).add(V(0, 1.1, 0))), rr = (lc[1] - lt_[1]); ringMark(lc[0], lc[1], rr * 1.02, rr * .98);
    strokeTxt('NUR ICH BIN NORMAL?!', W / 2, Math.min(H * .845, lf[1] + 75), 96, 'Lucky', ['#9aff9a', '#1ab84a'], '#04300e', 24, -.02);
  } };

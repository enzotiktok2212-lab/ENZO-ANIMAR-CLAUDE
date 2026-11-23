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
// 1: atardecer junto al Maibaum: el Opa en el centro con su botón brillando; el pequeño a su lado lo señala; los vecinos alrededor lo miran asombrados.
// 2: primer plano: yo (16) miro mi botón brillante, el dedo casi encima; detrás, la plaza al anochecer.
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; const T = 20.3, L = { T, lt: 1, k: 1, t0: 20, t1: 21 }; hideAll(); BAD_.length = 0; BIRDSON = 0; DOF = 0;
  if (v === 0) { town(L, { dusk: 1 }); const p = V(18, 0, -4);
    const o = put(opa, p.x, 0, p.z, 0); actuar(o, 0, [[0, { aLx: .25, aLz: .5, aLe: .5, aRx: .25, aRz: .5, aRe: .5, headX: -.08 }]], { T }); cara(o, T, { expr: 'warm', eyes: 'happy', mouth: 'smile', noBlink: 1 }); o.knopfOn(true, 5); o.knopf.scale.setScalar(1.35);
    const k = put(kl, p.x + 3.1, 0, p.z + 1.4, -.75); actuar(k, 0, [[0, { aRx: 1.55, aRz: .15, aRe: .1, aLx: .2, headX: -.25, headY: .25 }]], { T }); cara(k, T, { expr: 'shock', eyes: 'wide', mouth: 'o', noBlink: 1 }); k.knopfOn(true, 3);
    [[EX[4], -5.2, -2.6], [EX[1], 5.4, -3.4], [EX[9], -3, -7], [EX[2], 2.6, -7.4], [EX[14], -6.4, 3.4], [EX[11], 7.2, 0]].forEach(([c, dx, dz], i) => { const x = p.x + dx, z = p.z + dz, ry = Math.atan2(p.x - x, p.z - z); put(c, x, 0, z, ry);
      actuar(c, 0, [[0, i % 2 ? { aRx: 1.55, aRz: -.1, aRe: .1, aLx: .3, lean: .05 } : { aLx: 1.0, aLz: .4, aLe: 1.6, aRx: 1.0, aRz: .4, aRe: 1.6, lean: -.05 }]], { T }); cara(c, T + i, { expr: 'shock', mouth: i % 2 ? 'o' : 'open_smile', noBlink: 1 }); });
    cam([p.x + 2.2, 5.2, p.z + 14.5], [p.x + .4, 3.6, p.z - 3], 50); sh(V(p.x, 0, p.z - 2), 24); hemi.intensity = 1.2; FILL.intensity = 40;
    finishCover();
    const top = proj(V(p.x, 7.3, p.z)), bot = proj(V(p.x, -.1, p.z)), sl = proj(V(p.x - 2.4, 4, p.z)), sr = proj(V(p.x + 2.4, 4, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * .145, 112, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 26);
    strokeTxt('HAT JEDER EINEN', W / 2, H * .197, 96, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 22);
    strokeTxt('MAGISCHEN KNOPF', W / 2, H * .252, 112, 'Lucky', ['#8afcff', '#18b8d8'], '#032a38', 26, -.02);
    ringMark((sl[0] + sr[0]) / 2, (top[1] + bot[1]) / 2, (sr[0] - sl[0]) / 2 + 20, (bot[1] - top[1]) / 2 - 30, '#ff0018');
    strokeTxt('OPA DRÜCKTE IHN FÜR MICH', W / 2, Math.min(H * .84, bot[1] + 105), 100, 'Lucky', ['#ff5a5a', '#e0001a'], '#2a0008', 24, -.02);
    sparkle(W * .12, H * .14, 30); sparkle(W * .88, H * .2, 24);
  } else { town(L, { dusk: 1 }); const p = V(-14, 0, -18);
    const g = put(gr, p.x, 0, p.z, .15); actuar(g, 0, [[0, { aRx: 1.0, aRz: -.45, aRe: 1.75, aLx: .2, headX: .45, lean: .05 }]], { T }); cara(g, T, { expr: 'shock', eyes: 'wide', mouth: 'o', noBlink: 1 }); g.knopfOn(true, 5.5); g.knopf.scale.setScalar(1.3);
    crowdAt(L, p.x, p.z - 4, 12, 7, 26, 9, { mode: 'knopf' }); while (POST.length) POST.shift()();
    const q = kp(g); cam([q.x + 1.4, q.y + 3.2, q.z + 9.5], [q.x, q.y + 1.6, q.z], 46); sh(V(p.x, 0, p.z - 3), 26); hemi.intensity = 1.15; FILL.intensity = 40;
    finishCover();
    const kc = proj(q);
    strokeTxt('NUR EINMAL', W / 2, H * .17, 128, 'Lilita', ['#ffffff', '#ffe2b8'], '#14143a', 26);
    strokeTxt('IM GANZEN LEBEN', W / 2, H * .235, 104, 'Lilita', ['#8afcff', '#18b8d8'], '#032a38', 24, -.02);
    ringMark(kc[0], kc[1], 120, 120, '#ff0018');
    strokeTxt('WEN WÜRDEST DU RETTEN?', W / 2, H * .8, 100, 'Lucky', ['#ff5a5a', '#e0001a'], '#2a0008', 24, -.02);
    sparkle(W * .88, H * .32, 30, '#fff6c0'); sparkle(W * .12, H * .3, 22, '#c0f6ff'); } };

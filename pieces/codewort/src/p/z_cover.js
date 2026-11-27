// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// 1: Finn de piedra llorando en el pedestal «1 JAHR SINGLE», paloma en la cabeza, la gente pasando sin mirar (círculo rojo en Finn).
// 2: el gancho: el chico del ramo convirtiéndose en piedra desde los pies, la gente señalando (círculo rojo).
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
  if (v === 0) { platz(L, { dusk: true }); sun.intensity = 2.8; statues(L, { fe: { eyes: 'cry', mouth: 'wavy', noBlink: true }, je: { eyes: 'half', mouth: 'flat', noBlink: true } }); tears(finn, T); const h = hp(finn); dove(0, h.x - .3, h.y + 1.2, h.z, .5, T);
    [[EXS[0], P.x - 9, P.z + 12, .3, 'talk'], [EXS[2], P.x + 10, P.z + 14, -.4, 'talk'], [EXS[5], P.x - 4, P.z + 16, .8, 'walk']].forEach(([c, x, z, ry, m], i) => crowdGuy(c, x, z, { ...L, lt: 0 }, i, { mode: m, ry }));
    cam([h.x - .6, 9.2, P.z + 19], [h.x - .6, 7.4, P.z], 46); sh(V(P.x, 0, P.z + 6), 30); finishCover();
    strokeTxt('IN DIESER STADT', W / 2, H * .17, 96, 'Lucky', ['#ffffff', '#d8e4ff'], '#0a1238', 26);
    strokeTxt('WIRST DU ZUR', W / 2, H * .225, 104, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 26, -.02);
    strokeTxt('STATUE!', W / 2, H * .295, 170, 'Lucky', ['#e8e8ee', '#9a9aa4'], '#1a1a22', 34, -.03);
    const hd = proj(h.clone().add(V(0, .3, 0))), ft = proj(V(h.x, TOP, h.z)); ringMark(hd[0], (hd[1] + ft[1]) / 2, 150, (ft[1] - hd[1]) / 2 + 90);
    strokeTxt('1 JAHR SINGLE = STEIN…', W / 2, H * .8, 90, 'Lilita', ['#ffffff', '#ffd0d8'], '#4a0010', 22, -.02);
    sparkle(W * .1, H * .15, 26); sparkle(W * .9, H * .27, 22);
  } else { platz(L); statues(L); const c = put(sucher, P.x, 0, P.z + 30, -.15); c.flowers.visible = true; actuar(c, 0, [[0, { aRx: 1.1, aRe: .9, aRz: -.1, aLx: .2, aLz: .15, headY: .4, lean: -.03 }]], { T }); stone(c, .55); cara(c, T, { eyes: 'wide', mouth: 'o', noBlink: true }); stoneDust(hp(c).add(V(0, -3, 0)), T - .3, T, 12, .8);
    [[EXS[3], P.x - 5, P.z + 33, .6], [EXS[0], P.x + 5.4, P.z + 33.4, -.7], [EXS[4], P.x - 3, P.z + 25, .9], [EXS[1], P.x + 4, P.z + 25.6, -.9]].forEach(([e, x, z, ry], i) => crowdGuy(e, x, z, { ...L, lt: 0 }, i, { mode: i % 2 ? 'shock' : 'point', ry }));
    cam([P.x, 6.6, P.z + 48], [P.x, 4.2, P.z + 29], 46); sh(V(P.x, 0, P.z + 28), 30); finishCover();
    strokeTxt('EIN JAHR', W / 2, H * .16, 120, 'Lucky', ['#ffffff', '#d8e4ff'], '#0a1238', 28);
    strokeTxt('OHNE FREUNDIN?', W / 2, H * .225, 112, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 28, -.02);
    const hd = proj(hp(c).add(V(0, .3, 0))), ft = proj(c.root.position.clone()); ringMark(hd[0], (hd[1] + ft[1]) / 2, 170, (ft[1] - hd[1]) / 2 + 100);
    strokeTxt('…DANN WIRST DU ZU STEIN!', W / 2, H * .8, 84, 'Lilita', ['#e8e8ee', '#b0b0ba'], '#1a1a22', 22, -.02);
    sparkle(W * .12, H * .3, 24); sparkle(W * .88, H * .14, 26); } };

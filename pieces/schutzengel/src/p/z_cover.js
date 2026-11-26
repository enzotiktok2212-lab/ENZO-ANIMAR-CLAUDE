// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// 1: la plaza de Lichtenau al atardecer: todos los vecinos con sus dos angelitos señalan a Jonas, en el centro, el único sin ángeles (círculo rojo). «JEDER HAT 2 ENGEL… NUR ICH NICHT»
// 2: noche: Jonas en el centro con Elias (alas negras, ojos rojos) y Mira (ocho alas de luz, aureola en llamas) a los lados, como sus dos ángeles. «MEINE BESTEN FREUNDE… SIND MEINE ENGEL»
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .9) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; bloom.strength = .14; bloom.threshold = .88; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff1a2e') { const c = octx; c.save(); c.lineWidth = 18; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.beginPath(); c.ellipse(x, y, rx, ry, -.06, .25, 6.05); c.stroke(); c.restore(); }
function sparkle2(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
  const T = 30.3, L = { T, lt: .8, k: 1, t0: 29.5, t1: 31, d: 1.5 }; hideAll(); BAD_.length = 0; FX2D.length = 0; DOF = 0;
  if (v === 0) { town(L, { dusk: true }); sun.intensity = 2.6; const p = V(0, 0, 0);
    const j = put(jonas, 0, 0, 0, 0); actuar(j, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3, crouch: .05 }]], { T }); cara(j, T, { expr: 'sad', eyes: 'worried', mouth: 'grimace', noBlink: 1 }); sweat(j, T, 1);
    [[-7.5, -3], [7.5, -3], [-11, 3.5], [11, 3.5], [-4, -9], [4.5, -9.5]].forEach(([x, z], i) => { const c = put(DX[i + 2], x, 0, z, 0); c.root.rotation.y = faceTo(c.root.position, j.root.position); actuar(c, 0, [[0, { ...POINT, aRx: 1.5 }]], { T }); cara(c, T, { expr: 'sus', mouth: i % 2 ? 'o' : 'grimace', noBlink: 1 }); engel(c, ...NP[i], T, { s: 1.05, look: 0 }); });
    cam([0, 7.4, 23], [0, 4, 0], 50); sh(V(0, 0, 0), 34); finishCover();
    strokeTxt('JEDER HAT', W / 2, H * .15, 112, 'Lilita', ['#ffffff', '#ffe8c0'], '#3a1400', 26);
    strokeTxt('2 SCHUTZENGEL', W / 2, H * .22, 128, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 30, -.02);
    const hd = proj(hp(j).add(V(0, .4, 0))), ft = proj(V(0, 0, 0)); ringMark(hd[0], (hd[1] + ft[1]) / 2 - 20, 150, (ft[1] - hd[1]) / 2 + 105);
    strokeTxt('NUR ICH NICHT…', W / 2, H * .8, 110, 'Lucky', ['#ffffff', '#ffd0d0'], '#4a0010', 26, -.02);
    sparkle2(W * .1, H * .3, 26); sparkle2(W * .9, H * .28, 22);
  } else { town(L, { night: true }); sun.intensity = 1.2; lp(0, 0, 10, 8, 60, 0xffd090, 40); lp(1, 8, 8, 4, 60, 0xfff0c0, 30); lp(2, -8, 8, 4, 50, 0xb07aff, 30);
    const j = put(jonas, 0, 0, 1, 0); actuar(j, 0, [[0, { aLx: .3, aRx: .3, headY: .2 }]], { T }); cara(j, T, { expr: 'shock', eyes: 'wide', mouth: 'o', noBlink: 1 });
    const e = put(elias, -6.4, 0, -1.4, .25); actuar(e, 0, [[0, { aLx: .3, aRx: .3, aLz: .4, aRz: .4 }]], { T }); cara(e, T, { expr: 'smug', mouth: 'smirk', noBlink: 1 }); eliasWings(1, T);
    const m = put(mira, 6.4, 0, -1.4, -.25); actuar(m, 0, [[0, { aLx: .5, aRx: .5, aLz: .6, aRz: .6 }]], { T }); cara(m, T, { expr: 'determined', mouth: 'smile', noBlink: 1 }); miraWings(1, T, true); HALO.scale.setScalar(1.2); HALO.userData.anim(T);
    FEA.fall(V(0, 0, 0), T, 0xffffff, .6, 26, 18, 14); EMB.rise(V(6.4, 0, -1.4), T, 0xffb040, 8, 12, 24);
    cam([0, 6.6, 27], [0, 5.6, -1], 50); sh(V(0, 0, 0), 34); finishCover();
    strokeTxt('MEINE BESTEN FREUNDE', W / 2, H * .15, 96, 'Lilita', ['#ffffff', '#e0d8ff'], '#14063a', 24);
    strokeTxt('SIND ENGEL?!', W / 2, H * .22, 140, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 30, -.02);
    const hd = proj(hp(j).add(V(0, .4, 0))), ft = proj(V(0, 0, 1)); ringMark(hd[0], (hd[1] + ft[1]) / 2 - 20, 130, (ft[1] - hd[1]) / 2 + 100);
    strokeTxt('UND ICH WUSSTE NICHTS', W / 2, H * .8, 92, 'Lucky', ['#ffffff', '#ffd0d0'], '#4a0010', 24, -.02);
    sparkle2(W * .12, H * .32, 24); sparkle2(W * .88, H * .3, 26); } };

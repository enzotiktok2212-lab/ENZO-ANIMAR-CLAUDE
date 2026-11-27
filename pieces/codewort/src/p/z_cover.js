// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// 1: Mats e Ida asustados en el pasillo; detrás, por la ventanita de la puerta, la Cosa sonriendo (círculo rojo).
// 2: la mirilla: la cara de «Mama» con la sonrisa hasta las orejas.
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .9) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; bloom.strength = .14; bloom.threshold = .88; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff1a2e') { const c = octx; c.save(); c.lineWidth = 18; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.beginPath(); c.ellipse(x, y, rx, ry, -.06, .25, 6.05); c.stroke(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
  const T = 91, L = { T, lt: .5, k: .5, t0: 90.5, t1: 92, d: 1.5 }; hideAll(); BAD_.length = 0; FX2D.length = 0; DOF = 0; PEEP = 0;
  if (v === 0) { flur(L, { h: 18, m: 10 }); HA.side.forEach(s => s.material.opacity = .06); const d = put(ding, HAX + 5.6, 1.0, 20.9, PI); actuar(d, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: -.15, aRz: -.15, aLe: .3, aRe: .3, lean: .12 }]], { T }); creepF(d, T, 1); lp(0, HAX + 5.6, 9, 24, 90, 0xffb060, 14);
    const c = put(mats, HAX + 3.6, 0, 11.4, PI + .3); actuar(c, 0, [[0, 'recoil']], { T }); cara(c, T, { eyes: 'terror', mouth: 'o', noBlink: true });
    const i = put(ida, HAX + 1.8, 0, 10.6, PI + .1); actuar(i, 0, [[0, 'hug_self']], { T }); attach(BUNNY, i.spine, [0, 1.2, .9], [0, 0, 0], .8); cara(i, T, { eyes: 'scared', mouth: 'o', noBlink: true });
    fit2(V(HAX + 2.2, 7.4, 1.6), hp(c), hp(d), .56, .33); finishCover();
    strokeTxt('IN DIESER STADT', W / 2, H * .14, 92, 'Lucky', ['#ffffff', '#d8e4ff'], '#0a1238', 26);
    strokeTxt('MACH NIE DIE TÜR AUF…', W / 2, H * .2, 84, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 24, -.02);
    const hd = proj(hp(d)); ringMark(hd[0], hd[1] + 30, 105, 150);
    strokeTxt('…OHNE DAS GEHEIME WORT!', W / 2, H * .8, 78, 'Lilita', ['#ffffff', '#ffd0d8'], '#4a0010', 22, -.02);
  } else { strasse({ ...L }, { t: 'night' }); const p = PORCH; const c = put(ding, p.x, p.y, p.z - 1.8, toDoorM); actuar(c, 0, [[0, { aLx: .08, aRx: .08, headZ: .08 }]], { T }); creepF(c, T, 1); lp(0, p.x + 1, 10, p.z + 2.6, 70, 0xffb860, 16);
    peephole(L, 1, { look: hp(c).add(V(0, .1, 0)), fov: 66 }); FISH.uniforms.amt.value = 1; FISH.enabled = true; finishCover(); peepMask(octx);
    strokeTxt('„ICH BIN’S, MAMA!“', W / 2, H * .15, 100, 'Lucky', ['#ffffff', '#d8e4ff'], '#0a1238', 26);
    strokeTxt('…ODER?', W / 2, H * .78, 150, 'Lucky', ['#ff6a6a', '#d6202f'], '#3a0008', 32, -.03);
    strokeTxt('Kennt sie euer Wort?', W / 2, H * .85, 70, 'Lilita', ['#ffffff', '#ffe0a0'], '#1a1238', 18); } };

// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// 1: noche en el Marktplatz: yo dormido en el banco (Zzz, círculo rojo), Mia encima con el reloj 0:00, el pueblo despierto tapándose las orejas,
//    la torre con la campana detrás. «WER ZUERST AUFWACHT… DARF ALLES WÜNSCHEN»
// 2: día: Emma con cartas de amor, Ben en el deportivo y Lea con una montaña de billetes alrededor de mí, que duermo de pie. «1 WUNSCH PRO TAG»
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .9) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; bloom.strength = Math.min(bloom.strength, .3); camera.updateProjectionMatrix();
  SKY.position.copy(camera.position); sh(CAMT, 50); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff1a2e') { const c = octx; c.save(); c.lineWidth = 18; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.beginPath(); c.ellipse(x, y, rx, ry, -.06, .25, 6.05); c.stroke(); c.restore(); }
function zText(x, y, s) { const c = octx; for (let i = 0; i < 3; i++) { c.save(); c.translate(x + i * 46, y - i * 70); c.font = `${(70 + i * 26) * s}px Lucky`; c.textAlign = 'center'; c.lineWidth = 14; c.strokeStyle = '#0e1226'; c.strokeText('Z', 0, 0); c.fillStyle = '#9ad8ff'; c.fillText('Z', 0, 0); c.restore(); } }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
  const T = 30.3, L = { T, lt: .8, k: 1, t0: 29.5, t1: 31, d: 1.5 }; hideAll(); BAD_.length = 0; FX2D.length = 0; DOF = 0;
  if (v === 0) { town(L, 'night', V(0, 0, -64)); TURM.BL.intensity = 30; TURM.BELL.rotation.x = .4; TURM.setClock(0, 0, .8);
    const me = sit(ich, -.6, 1.5, -63.8, 0, L, { headZ: -.5, aLx: .4, aRx: .4, aLe: .5, aRe: .5 }); me.setFace({ eyes: 'closed', mouth: 'o' });
    const m = put(mia, 1.8, 1.5, -63.6, -.3); m.blob.visible = false; actuar(m, 0, [[0, { aRx: 2.6, aRe: .5, aRz: .3, aLx: .4, aLz: .3, crouch: .1 }]], { T }); m.setFace({ eyes: 'squint', mouth: 'grin' }); attach(UHR, m.aR.hand, [0, -.5, .4], [0, 0, 0], .5); UHR.userData.set('0:00', '#8aff6a');
    [[SL[0], -7, -63], [SL[3], 7, -63], [SL[5], -10, -59], [SL[8], 10, -59], [SL[11], -6.5, -56], [SL[2], 6.5, -56]].forEach(([c, x, z], i) => { put(c, x, 0, z, faceTo(V(x, 0, z), V(0, 0, -62)) + PI); c.root.rotation.y = Math.atan2(-x, -64 - z); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .25, aRz: .25, aLe: 2.3, aRe: 2.3, headX: .1 }]], { T }); c.setFace({ eyes: i % 2 ? 'wide' : 'squint', mouth: 'grimace' }); });
    cam([0, 4.6, -40], [0, 6.4, -64], 46); finishCover();
    const [mx, my] = proj(hp(me)); ringMark(mx, my + 40, 120, 130); zText(mx - 120, my - 70, 1);
    strokeTxt('WER ZUERST AUFWACHT…', W / 2, H * .18, 92, 'Lucky', ['#ffffff', '#ffe07a'], '#10142a', 22);
    strokeTxt('DARF ALLES', W / 2, H * .75, 120, 'Lucky', ['#fff6a0', '#ffb020'], '#2a1400', 26); strokeTxt('WÜNSCHEN!', W / 2, H * .75 + 130, 136, 'Lucky', ['#fff6a0', '#ffb020'], '#2a1400', 28); }
  else { town(L, 'day'); const C = V(0, 0, 30);
    const me = put(ichT, 0, 0, 30, 0); actuar(me, 0, [[0, { headZ: .5, headX: .2, aLz: .05, aRz: .05, aLe: .2, aRe: .2 }]], { T }); me.setFace({ eyes: 'closed', mouth: 'o' });
    const e = put(emma, -4.6, 0, 31, .4); actuar(e, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, aLe: .3, aRe: .3 }]], { T }); laughF(e, T); LETTERS.slice(0, 8).forEach((l, i) => show(l, -4.6 + Math.cos(i) * 2.2, 6 + (i % 3) * 1.2, 31.5 + Math.sin(i) * 1, i, 1.1).rotation.set(.3 * i, i, 0));
    show(PORSCHE, 6.5, 0, 25, -.5, 1); const b = sit(ben, 5.9, 2.2, 24.5, -.5, L, { aRx: 2.6, aRe: .3, aLx: 1.2 }); grin(b, T);
    const l = put(lea, 4.2, 0, 33.5, -.4); actuar(l, 0, [[0, 'hold']], { T }); laughF(l, T); BUNDLES.slice(0, 10).forEach((bb, i) => show(bb, 2.4 + (i % 4) * 1.2, .25 + Math.floor(i / 4) * .5, 36, (i % 2) * .2, .8));
    SPK.at(V(0, 0, 30), 3.3, 1, 5, 9, 34); cam([0, 6.6, 54], [0, 5, 29], 50); finishCover();
    const [mx, my] = proj(hp(me)); ringMark(mx, my + 30, 110, 130); zText(mx + 70, my - 60, .8);
    strokeTxt('1 WUNSCH', W / 2, H * .18, 150, 'Lucky', ['#ffffff', '#ffe07a'], '#10142a', 28); strokeTxt('PRO TAG', W / 2, H * .18 + 150, 130, 'Lucky', ['#fff6a0', '#ffb020'], '#2a1400', 26);
    strokeTxt('…ABER ICH SCHLAFE IMMER', W / 2, H * .82, 76, 'Lilita', '#ffffff', '#10142a', 18); }
};

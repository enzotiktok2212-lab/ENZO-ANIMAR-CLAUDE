// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// Sin círculo rojo ni flecha (el usuario no quiere que parezcan plantilla).
// 1 «póster»: un 9 gigante recortado sobre fondo de atardecer; dentro del 9, el pueblo entero en el aire mientras la cuerda de ropa lo cruza. «ALLE 9 SEKUNDEN»
// 2 «cine»: contrapicado en la nieve: yo de espaldas, diminuto, frente a la torre que llena el cielo entre nubarrones. «WER SCHWINGT DAS SEIL?»
const CV = () => { const c = document.createElement('canvas'); c.width = 2 * W; c.height = 2 * H; return c; };
function shot3d(build) { hideAll(); BAD_.length = 0; FX2D.length = 0; DOF = 0; build(); while (POST.length) POST.shift()();
  if (HQ) renderer.toneMappingExposure *= .85; grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .45; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0;
  bloom.strength = .16; bloom.threshold = .86; camera.updateProjectionMatrix(); sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false;
  const c = CV(); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(renderer.domElement, 0, 0, c.width, c.height); return c; }
function word(c, t, x, y, size, font, fill, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  if (o.ls) c.letterSpacing = o.ls + 'px'; const tw = c.measureText(t).width, k = Math.min(1, (o.maxW || W * .9) / tw); c.scale(k, k);
  if (o.shadow !== false) { c.shadowColor = o.shCol || 'rgba(0,0,0,.55)'; c.shadowBlur = o.shB ?? 30; c.shadowOffsetY = o.shY ?? 12; }
  if (o.lw) { c.lineWidth = o.lw; c.strokeStyle = o.stroke || '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; }
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size * .8, 0, 0); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function grain(c, a = .05) { const r = RNG(77); c.save(); for (let i = 0; i < 9000; i++) { c.fillStyle = r() > .5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`; c.fillRect(r() * W, r() * H, 1.5, 1.5); } c.restore(); }

window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); await document.fonts.load('700 80px Cap');
  out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; const c = octx;
  if (v === 0) {
    // --- el pueblo en el aire, visto desde arriba (plano 2 del vídeo, en el instante del salto) ---
    const s = S[1], lt = .62, L = { lt, k: lt / (s.t1 - s.t0), T: s.t0 + lt, d: s.t1 - s.t0, t0: s.t0, t1: s.t1 };
    const img = shot3d(() => { s.fn(L); cam([0, 92, 46], [0, 0, 2], 46); });
    // fondo: cielo de atardecer en franjas + rayos de sol
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a1d5c'); g.addColorStop(.45, '#c8507a'); g.addColorStop(.75, '#ff9a4a'); g.addColorStop(1, '#ffd27a'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2, H * .5); for (let i = 0; i < 24; i++) { c.rotate(Math.PI / 12); c.fillStyle = i % 2 ? 'rgba(255,240,200,.07)' : 'rgba(255,255,255,0)'; c.beginPath(); c.moveTo(0, 0); c.lineTo(-180, -2000); c.lineTo(180, -2000); c.fill(); } c.restore();
    // la cuerda de ropa (2D) cruzando por detrás del 9, con estelas de velocidad
    const rt = ROPET(); const rope = rt.image; c.save(); c.translate(W / 2, H * .6); c.rotate(-.32); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 40; c.shadowOffsetY = 20;
    for (let k = 0; k < 3; k++) c.drawImage(rope, k * 340, 0, 340, 64, -W * 1.2 + k * W * .8, -60, W * .8 + 2, 120); c.shadowColor = 'transparent';
    const sg = c.createLinearGradient(0, -60, 0, 60); sg.addColorStop(0, 'rgba(255,255,255,.35)'); sg.addColorStop(.4, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = sg; c.fillRect(-W * 1.2, -60, W * 2.4, 120);
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineCap = 'round'; for (let k = 0; k < 7; k++) { c.lineWidth = 6 - k * .5; const y = -110 + (k % 2 ? 230 : 0) + k * 6; c.beginPath(); c.moveTo(-W * .9 + k * 90, y); c.lineTo(-W * .35 + k * 70, y); c.stroke(); } c.restore();
    // el 9 gigante con el pueblo dentro
    const NX = W / 2 + 10, NY = 1330, NS = 1180; c.save(); c.font = `${NS}px Lucky`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
    c.shadowColor = 'rgba(30,0,40,.65)'; c.shadowBlur = 60; c.shadowOffsetY = 30; c.lineWidth = 64; c.strokeStyle = '#1a0a2a'; c.strokeText('9', NX, NY); c.shadowColor = 'transparent';
    c.lineWidth = 34; c.strokeStyle = '#fff6d8'; c.strokeText('9', NX, NY); c.restore();
    const m = CV(), mx = m.getContext('2d'); mx.setTransform(2, 0, 0, 2, 0, 0); mx.font = `${NS}px Lucky`; mx.textAlign = 'center'; mx.textBaseline = 'alphabetic'; mx.fillText('9', NX, NY); mx.globalCompositeOperation = 'source-in';
    mx.setTransform(1, 0, 0, 1, 0, 0); mx.drawImage(img, 0, 0);
    mx.globalCompositeOperation = 'source-atop'; mx.setTransform(2, 0, 0, 2, 0, 0); const ig = mx.createLinearGradient(0, 300, 0, 1350); ig.addColorStop(0, 'rgba(255,220,160,.18)'); ig.addColorStop(1, 'rgba(60,0,60,.25)'); mx.fillStyle = ig; mx.fillRect(0, 0, W, H);
    c.drawImage(m, 0, 0, W, H);
    // un brillo en el borde del 9
    c.save(); c.globalCompositeOperation = 'lighter'; const sp = (x, y, r) => { c.fillStyle = 'rgba(255,250,220,.95)'; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .22 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.fill(); }; sp(760, 430, 46); sp(300, 1240, 30); c.restore();
    // texto
    word(c, 'IN DIESER STADT SPRINGT JEDER', W / 2, 330, 64, 'Lilita', '#ffffff', { lw: 16, stroke: '#2a0a3a', ls: 2 });
    word(c, 'ALLE', W / 2, 455, 120, 'Lucky', ['#ffffff', '#ffe6b0'], { lw: 26, stroke: '#2a0a3a', rot: -.03 });
    word(c, 'SEKUNDEN', W / 2, 1500, 196, 'Lucky', ['#fff27a', '#ffb000'], { lw: 36, stroke: '#2a0a3a', rot: -.03 });
    word(c, 'SONST NIMMT DICH DAS SEIL MIT…', W / 2, 1610, 62, 'Lilita', '#ffffff', { lw: 16, stroke: '#2a0a3a', maxW: W * .86 });
    grain(c, .035);
  } else {
    // --- contrapicado en la nieve: yo de espaldas frente a la torre ---
    const T = 128, L = { lt: .5, k: .5, T, d: 1, t0: T - .5, t1: T + .5 }; const dx = .951, dz = -.31, C = [TX - dx * 560, 2.6, -dz * 560];
    const img = shot3d(() => { welt(L, C[0] + dx * 30, C[2] + dz * 30, { snow: true, grass: false, rings: false }); dusk(); setRope(2.25);
      const ix = C[0] + dx * 15, iz = C[2] + dz * 15; const i_ = put(ich, ix, 0, iz, Math.atan2(dx, dz)); winterIch(i_); hornHang(i_, 0); actuar(i_, 0, [[0, { headX: -.55, aLz: .25, aRz: .25, aLx: .1, aRx: .1 }]], { T }); cara(i_, T, { eyes: 'up', mouth: 'o', noBlink: true });
      lp(0, ix - 4, 6, iz + 6, 30, 0xffd8a0, 30); cam(C, [TX, 215, 0], 64); scene.fog.density = .00035; sh(V(ix, 0, iz), 20); });
    c.drawImage(img, 0, 0, W, H);
    // copos de nieve (cerca grandes y desenfocados, lejos pequeños) y un resplandor cálido en el horizonte
    const hz = c.createRadialGradient(W * .5, H * .78, 10, W * .5, H * .78, 700); hz.addColorStop(0, 'rgba(255,190,120,.35)'); hz.addColorStop(1, 'rgba(255,190,120,0)'); c.fillStyle = hz; c.fillRect(0, 0, W, H);
    { const r = RNG(41); c.save(); for (let i = 0; i < 260; i++) { const z = r(), x = r() * W, y = r() * H, rr = 1.5 + z * z * 9; c.filter = z > .8 ? 'blur(3px)' : 'none'; c.fillStyle = `rgba(255,255,255,${.35 + z * .5})`; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill(); } c.restore(); c.filter = 'none'; }
    // franjas de cine y degradado arriba para el texto
    const tg = c.createLinearGradient(0, 0, 0, 760); tg.addColorStop(0, 'rgba(8,10,24,.85)'); tg.addColorStop(1, 'rgba(8,10,24,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, 760);
    const bg = c.createLinearGradient(0, H - 420, 0, H); bg.addColorStop(0, 'rgba(8,10,24,0)'); bg.addColorStop(1, 'rgba(8,10,24,.7)'); c.fillStyle = bg; c.fillRect(0, H - 420, W, 420);
    word(c, 'WER SCHWINGT', W / 2, 400, 150, 'Lucky', ['#ffffff', '#dfe8ff'], { lw: 26, stroke: '#0a0c20', ls: 4 });
    word(c, 'DAS SEIL?', W / 2, 560, 190, 'Lucky', ['#ffd77a', '#ff8a2a'], { lw: 30, stroke: '#2a0c00', ls: 4 });
    word(c, 'NIEMAND GEHT DA HIN. AUSSER MIR.', W / 2, 690, 58, 'Lilita', '#ffffff', { lw: 14, stroke: '#0a0c20', ls: 3, maxW: W * .86 });
    grain(c, .04);
  } };

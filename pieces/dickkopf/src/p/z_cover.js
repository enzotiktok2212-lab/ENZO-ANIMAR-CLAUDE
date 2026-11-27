// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// Sin círculo rojo ni flecha. Cada una, una idea gráfica distinta:
// 1 «rueda de reconocimiento»: pared de medir de comisaría; el Paketbote y Oma con cabezas enormes y yo en medio con la cabeza normal. Carteles «HUSS ×…».
// 2 «cine»: atardecer en la plaza, contrapicado: yo abajo, mirando arriba, y el cielo lleno de gente flotando con cabezas gigantes.
const CV = () => { const c = document.createElement('canvas'); c.width = 2 * W; c.height = 2 * H; return c; };
const LINE_T = canvasTex(1024, 1024, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3a4a66'); g.addColorStop(1, '#26324a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  for (let i = 0; i <= 20; i++) { const y = h - i * h / 20; c.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.45)'; c.fillRect(0, y - (i % 4 ? 2 : 4), w, i % 4 ? 4 : 8);
    if (i % 4 === 0 && i) { c.font = 'bold 44px sans-serif'; c.fillStyle = 'rgba(255,255,255,.85)'; c.textAlign = 'left'; c.fillText(String(i * 10), 16, y - 12); c.textAlign = 'right'; c.fillText(String(i * 10), w - 16, y - 12); } } });
const LINEUP = (() => { const g = new THREE.Group(); scene.add(g); const wm = new THREE.MeshStandardMaterial({ map: LINE_T, roughness: .85 }); const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), wm); wall.position.set(0, 20, -4); wall.receiveShadow = true; g.add(wall);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ color: 0x8a8f9a, roughness: .9 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 8); fl.receiveShadow = true; g.add(fl); g.visible = false; return g; })();
function shot3d(build) { hideAll(); BAD_.length = 0; FX2D.length = 0; DOF = 0; build(); while (POST.length) POST.shift()(); clearFaces();
  if (HQ) renderer.toneMappingExposure *= .85; grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .5; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0;
  bloom.strength = .16; bloom.threshold = .86; camera.updateProjectionMatrix(); sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false;
  const c = CV(); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(renderer.domElement, 0, 0, c.width, c.height); return c; }
function word(c, t, x, y, size, font, fill, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  if (o.ls) c.letterSpacing = o.ls + 'px'; const tw = c.measureText(t).width, k = Math.min(1, (o.maxW || W * .9) / tw); c.scale(k, k);
  if (o.shadow !== false) { c.shadowColor = o.shCol || 'rgba(0,0,0,.55)'; c.shadowBlur = o.shB ?? 30; c.shadowOffsetY = o.shY ?? 12; }
  if (o.lw) { c.lineWidth = o.lw; c.strokeStyle = o.stroke || '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; }
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size * .8, 0, 0); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function grain(c, a = .05) { const r = RNG(77); c.save(); for (let i = 0; i < 9000; i++) { c.fillStyle = r() > .5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`; c.fillRect(r() * W, r() * H, 1.5, 1.5); } c.restore(); }
function placard(c, x, y, txt, col, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.shadowOffsetY = 8; c.fillStyle = '#f6f1e4'; c.beginPath(); c.roundRect(-130, -52, 260, 104, 14); c.fill(); c.shadowColor = 'transparent';
  c.lineWidth = 6; c.strokeStyle = '#1a1a22'; c.stroke(); c.font = '64px Lucky'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(txt, 0, 6); c.restore(); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita');
  out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; const c = octx; const T = 30;
  if (v === 0) {
    let P = [];
    const img = shot3d(() => { day(); LINEUP.visible = true; sun.intensity = 2.6; hemi.intensity = 1.1;
      const b = put(bote, -4.4, 0, 0, .18); kopf(b, 2.9); actuar(b, 0, [[0, { aLz: .15, aRz: .15, headY: .1 }]], { T }); cara(b, T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
      const o = put(oma, 4.6, 0, 0, -.15); kopf(o, 2.7); actuar(o, 0, [[0, { aLz: .15, aRz: .15, headY: -.1 }]], { T }); cara(o, T, { expr: 'happy', mouth: 'smile' });
      const m = put(ich, 0, 0, .6, 0); actuar(m, 0, [[0, { aLz: .12, aRz: .12 }]], { T }); cara(m, T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
      cam([0, 5.0, 34], [0, 5.2, 0], 40); sh(V(0, 0, 0), 22); sun.position.set(-30, 50, 60);
      P = [proj(V(-4.4, .2, 2.2)), proj(V(0, .2, 2.4)), proj(V(4.6, .2, 2.2))]; });
    LINEUP.visible = false; c.drawImage(img, 0, 0, W, H);
    // foco de comisaría desde arriba
    const sp = c.createRadialGradient(W / 2, H * .52, 80, W / 2, H * .52, 900); sp.addColorStop(0, 'rgba(255,250,230,.12)'); sp.addColorStop(1, 'rgba(0,0,20,.45)'); c.fillStyle = sp; c.fillRect(0, 0, W, H);
    placard(c, P[0][0], P[0][1], 'HUSS ×9', '#d8202a', -.04); placard(c, P[1][0], P[1][1], 'HUSS ×0', '#1e8a4a', 0); placard(c, P[2][0], P[2][1], 'HUSS ×7', '#d8202a', .04);
    const tg = c.createLinearGradient(0, 0, 0, 640); tg.addColorStop(0, 'rgba(10,14,30,.85)'); tg.addColorStop(1, 'rgba(10,14,30,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, 640);
    word(c, 'IN DIESER STADT WÄCHST', W / 2, 340, 70, 'Lilita', '#ffffff', { lw: 16, stroke: '#0a0e1e', ls: 2 });
    word(c, 'DEIN KOPF', W / 2, 480, 150, 'Lucky', ['#ffffff', '#dfe8ff'], { lw: 28, stroke: '#0a0e1e', rot: -.02 });
    word(c, 'MIT JEDEM HUSS!', W / 2, 620, 120, 'Lucky', ['#ffe86a', '#ff9a1a'], { lw: 26, stroke: '#2a0c00', rot: -.02 });
    grain(c, .03);
  } else {
    let me;
    const img = shot3d(() => { town({}); dusk(); scene.fog.density = .0005;
      me = put(ich, 0, 0, 30, 0); actuar(me, 0, [[0, { headX: -.5, aLz: .25, aRz: .25, aLx: .2, aRx: .2 }]], { T }); cara(me, T, { eyes: 'up', mouth: 'o', noBlink: true });
      const fl = [...EXS.slice(0, 8), ...VEC.slice(1, 5), mayor, bote, oma, jonas]; const r = RNG(21);
      fl.forEach((ch, i) => { const a = (i / fl.length) * 6.283 + r() * .3, d = 5 + r() * 14; flot(ch, { T: T + i }, Math.cos(a) * d, 20 + r() * 16, 14 + Math.sin(a) * d * .8, (r() - .5) * .8, 2.6 + r() * 1.6, i, { expr: ['joy', 'shock', 'happy', 'worried'][i % 4] }); });
      cam([0, 1.6, 45], [0, 9, 22], 56); sh(V(0, 0, 24), 40); lp(0, 2, 5, 36, 30, 0xffd8a0, 20); });
    c.drawImage(img, 0, 0, W, H);
    const tg = c.createLinearGradient(0, 0, 0, 420); tg.addColorStop(0, 'rgba(20,10,40,.6)'); tg.addColorStop(1, 'rgba(20,10,40,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, 420);
    const bg = c.createLinearGradient(0, H - 520, 0, H); bg.addColorStop(0, 'rgba(20,10,40,0)'); bg.addColorStop(1, 'rgba(20,10,40,.75)'); c.fillStyle = bg; c.fillRect(0, H - 520, W, 520);
    word(c, 'DIE HALBE STADT', W / 2, 800, 112, 'Lucky', ['#ffffff', '#ffe2f0'], { lw: 24, stroke: '#1a0a2a', ls: 3 });
    word(c, 'SCHWEBT…', W / 2, 960, 160, 'Lucky', ['#ffe07a', '#ff7a3a'], { lw: 30, stroke: '#2a0a00', ls: 4, rot: -.03 });
    word(c, '…AUSSER MIR!', W / 2, 1075, 84, 'Lucky', ['#c8ff7a', '#5ad83a'], { lw: 20, stroke: '#0a2a0a', ls: 3, rot: .02 });
    grain(c, .035);
  } };

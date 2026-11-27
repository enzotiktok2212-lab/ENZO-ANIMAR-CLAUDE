// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// 1: tormenta: Jonte en lo alto del mástil del barco pirata soplando el Muschelhorn, la ola gigante detrás (círculo rojo en Jonte). «ALLE 100 JAHRE IST DAS MEER WEG… HEUTE KOMMT ES ZURÜCK»
// 2: fondo marino al sol: Jonte en el centro con una concha que canta al oído, los vecinos alrededor le señalan; pecios, arrecife y el barco detrás. «NUR ICH HÖRE DIE MUSCHELN SINGEN»
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .9) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover(dof = 0) { grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; bloom.strength = .16; bloom.threshold = .88; camera.updateProjectionMatrix();
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2); sh(SHC ?? CAMT.clone(), SHR);
  sun.castShadow = true; SKY.position.copy(camera.position); ao.enabled = true;
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = dof * .0016; bokeh.uniforms.maxblur.value = .01; bokeh.enabled = dof > 0; }
  composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff1a2e') { const c = octx; c.save(); c.lineWidth = 18; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.beginPath(); c.ellipse(x, y, rx, ry, -.06, .25, 6.05); c.stroke(); c.restore(); }
function sparkle2(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function arrow2d(x0, y0, x1, y1, bend = .3, col = '#ff1a2e') { const c = octx, mx = (x0 + x1) / 2 - (y1 - y0) * bend, my = (y0 + y1) / 2 + (x1 - x0) * bend, a = Math.atan2(y1 - my, x1 - mx), hl = 70;
  const ex = x1 - Math.cos(a) * hl * .6, ey = y1 - Math.sin(a) * hl * .6;
  for (const [w, s] of [[44, '#fff'], [26, col]]) { c.save(); c.lineCap = 'round'; c.lineWidth = w; c.strokeStyle = s; if (s === '#fff') { c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 16; } c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, ex, ey); c.stroke(); c.restore(); }
  for (const [k, s] of [[1.35, '#fff'], [1, col]]) { c.save(); c.translate(x1, y1); c.rotate(a); c.fillStyle = s; c.lineJoin = 'round'; c.beginPath(); c.moveTo(12 * k, 0); c.lineTo(-hl * k, -48 * k); c.lineTo(-hl * k, 48 * k); c.closePath(); c.fill(); c.restore(); } }
function noteSticker(x, y, s, rot, col) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${s}px Lucky`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = s * .16; c.strokeStyle = '#0a1a3a'; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 12; c.strokeText('♪', 0, 0); c.shadowColor = 'transparent'; c.fillStyle = col; c.fillText('♪', 0, 0); c.restore(); }
function koralle_(c) {}
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
  const T = 96.3, L = { T, lt: .3, k: .5, t0: 96, t1: 97, d: 1 }; hideAll(); BAD_.length = 0; FX2D.length = 0; POST.length = 0;
  if (v === 0) { kueste(L, { t: 'storm' }); const c = V(10, 0, 640);
    pose(jonte, c.x, 0, c.z, PI, L, { aRx: 2.3, aRe: 1.9, aLx: 2.1, aLe: 1.7, headX: -.15, lean: -.05 }, 'determined', { mouth: 'o', eyes: 'squint', noBlink: 1 });
    attach(HORN, jonte.aR.hand, [.5, -.4, .6], [0, 0, .6], .55); const h = wpos(HORN);
    RINGS.forEach((r, i) => { if (i > 1) return; const q = .1 + i * .12; r.visible = true; r.position.copy(h); r.lookAt(h.clone().add(V(0, 0, -1))); r.scale.setScalar(.25 + q * 2.2); r.material.opacity = .35 * (1 - q); });
    wave(T, c.z + 260, 84, .6, { glow: .6 });
    [[-9, 6, 0], [8.5, 5, 1], [-15, 14, 2], [15, 13, 3]].forEach(([dx, dz, i]) => run(NB[[4, 8, 15, 19][i]], { ...L, lt: 0 }, c.x + dx, c.z + dz, PI + (dx > 0 ? .25 : -.25), 9, i, { expr: 'shock', mouth: 'scream' }));
    const camP = V(c.x, 2.6, c.z - 17); cam([camP.x, camP.y, camP.z], [c.x, 4.2, c.z + 10], 56); SHC = c.clone(); SHR = 40; finishCover();
    const hj = hp(jonte);
    strokeTxt('ALLE 100 JAHRE', W / 2, H * .15, 112, 'Lucky', ['#ffffff', '#d8f0ff'], '#06203a', 26);
    strokeTxt('IST DAS MEER WEG…', W / 2, H * .215, 104, 'Lilita', ['#fff2a0', '#f0a820'], '#3a2400', 26, -.02);
    const hd = proj(hj.clone().add(V(0, .6, 0))), ft = proj(jonte.root.position.clone()); arrow2d(hd[0] + 230, hd[1] + 150, hd[0] + 260, H * .33, .35);
    strokeTxt('…HEUTE KOMMT ES ZURÜCK!', W / 2, H * .8, 92, 'Lucky', ['#ffffff', '#bff0ff'], '#04283a', 24, -.02);
    sparkle2(W * .1, H * .3, 24, '#e8fbff'); sparkle2(W * .9, H * .27, 22, '#e8fbff');
    return [hd, ft]; }
  else { kueste(L, { t: 'day' }); const c = V(10, 0, 560);
    const j = pose(jonte, c.x, 0, c.z, PI, L, { aRx: 2.4, aRe: 2.2, aRz: -.15, headY: .15, headX: .05 }, 'happy', { eyes: 'happy', mouth: 'open_smile', noBlink: 1 });
    attach(SHELLS[1], jonte.aR.hand, [0, -.6, .5], [.3, 0, .4], 2.2); koralle_(c);
    const camP = V(c.x, 6.6, c.z - 21);
    [[-5.5, 6, 'point', 'sus'], [5.5, 6, 'point', 'shock'], [-10, 9, 'shock', 'shock'], [10, 9, 'point', 'sus'], [-4, 13, 'point', 'sus'], [4, 13.5, 'shock', 'shock']].forEach(([dx, dz, m, e], i) => {
      const n = NB[[2, 5, 9, 12, 17, 21][i]]; const x = c.x + dx, z = c.z + dz; put(n, x, 0, z, 0); n.root.rotation.y = faceTo(n.root.position, j.root.position) * .45 + faceTo(n.root.position, camP) * .55;
      actuar(n, 0, [[0, m === 'point' ? { aRx: 1.5, aRe: .1, aRz: .05, headY: 0 } : m === 'shock' ? { aLx: 2.4, aRx: 2.4, aLe: 1.8, aRe: 1.8 } : { headY: .2 }]], { T }); cara(n, T + i, { expr: e, mouth: i % 2 ? 'o' : 'grimace', noBlink: 1 }); });
    cam([camP.x, camP.y, camP.z], [c.x, 4.4, c.z + 5], 46); notes(hp(jonte).add(V(-1.4, .8, 0)), T, 6, 1.3); SHC = c.clone(); SHR = 40; finishCover(.4);
    strokeTxt('IN DIESER STADT', W / 2, H * .15, 100, 'Lilita', ['#ffffff', '#e0f4ff'], '#06203a', 24);
    strokeTxt('SINGEN DIE MUSCHELN', W / 2, H * .215, 112, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 28, -.02);
    const hd = proj(hp(jonte).add(V(0, .6, 0))), ft = proj(jonte.root.position.clone()); const sp = proj(wpos(SHELLS[1])); arrow2d(sp[0] - 120, sp[1] - 330, sp[0] - 10, sp[1] - 60, -.25);
    strokeTxt('…WENN DAS MEER KOMMT', W / 2, H * .8, 96, 'Lucky', ['#ffffff', '#bff0ff'], '#04283a', 24, -.02);
    noteSticker(W * .12, H * .32, 110, -.2, '#ffe14a'); noteSticker(W * .88, H * .36, 90, .25, '#7ff0ff');
    return [hd, ft]; } };

// ---------- portadas (fuera del vídeo; 2160×3840; lo importante entre y = 240 y 1680 en coordenadas 1080×1920) ----------
// Estilo propio de lispeln: señal de tráfico como halo, letras S tachadas con «TH» pintado a mano encima, cinta de policía, pegatinas inclinadas.
function cTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .9) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 28; c.shadowOffsetY = 12; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
// palabra con cada S tachada en rojo y un «TH» pintado encima
function lispWord(t, x, y, size, font, fill, stroke, lw, rot = 0, only = null) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textBaseline = 'middle'; c.lineJoin = 'round'; const tw = c.measureText(t).width; let cx = -tw / 2; const S_ = [];
  for (const ch of t) { const w = c.measureText(ch).width; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 28; c.shadowOffsetY = 12; c.lineWidth = lw; c.strokeStyle = stroke; c.textAlign = 'left'; c.strokeText(ch, cx, 0); c.shadowColor = 'transparent';
    const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; c.fillText(ch, cx, 0); if (ch === 'S' && (!only || only.includes(S_.n = (S_.n ?? -1) + 1))) S_.push([cx, w]); cx += w; }
  for (const [sx, w] of S_) { c.save(); c.lineCap = 'round'; c.lineWidth = size * .13; c.strokeStyle = '#1a0000'; c.beginPath(); c.moveTo(sx - w * .05, size * .38); c.lineTo(sx + w * 1.05, -size * .38); c.stroke(); c.lineWidth = size * .08; c.strokeStyle = '#ff1a2a'; c.stroke();
    c.translate(sx + w / 2, -size * .66); c.rotate(-.14); c.font = `${size * .5}px Lucky`; c.textAlign = 'center'; c.lineWidth = size * .09; c.strokeStyle = '#1a0000'; c.strokeText('TH', 0, 0); c.fillStyle = '#ff2a3a'; c.fillText('TH', 0, 0); c.restore(); }
  c.restore(); }
// pegatina inclinada con borde blanco y sombra
function sticker(t, x, y, size, bg, fg, rot = 0, font = 'Lilita') { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; const w = c.measureText(t).width + size * 1.1, h = size * 1.55;
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 24; c.shadowOffsetY = 10; c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(-w / 2 - 12, -h / 2 - 12, w + 24, h + 24, h * .3); c.fill(); c.shadowColor = 'transparent';
  c.fillStyle = bg; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h * .24); c.fill(); c.fillStyle = fg; c.fillText(t, 0, size * .06); c.restore(); }
// cinta de policía cruzando la imagen
function tape(y, rot, text = 'POLIZEI · S VERBOTEN · POLIZEI · S VERBOTEN · ') { const c = octx; c.save(); c.translate(W / 2, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 18; c.fillStyle = '#ffd21a'; c.fillRect(-W, -38, W * 2, 76); c.shadowColor = 'transparent';
  c.fillStyle = '#111'; for (let x = -W; x < W; x += 60) { c.beginPath(); c.moveTo(x, -38); c.lineTo(x + 22, -38); c.lineTo(x - 8, -28); c.lineTo(x - 30, -28); c.fill(); c.beginPath(); c.moveTo(x, 38); c.lineTo(x + 22, 38); c.lineTo(x - 8, 28); c.lineTo(x - 30, 28); c.fill(); }
  c.font = `40px Lilita`; c.textAlign = 'left'; c.textBaseline = 'middle'; const tw = c.measureText(text).width; for (let x = -W; x < W; x += tw) c.fillText(text, x, 3); c.restore(); }
function sparkle2(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function finishCover2(sat = 1.55) { grade.uniforms.sharp.value = 1.6; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = sat; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
// caja de GTA 6 (solo portada)
const G6 = P_(new THREE.Group()); { const t = canvasTex(160, 224, (c, w, h) => { const s = c.createLinearGradient(0, 0, w, h); s.addColorStop(0, '#ff4ab8'); s.addColorStop(.55, '#ff8a3a'); s.addColorStop(1, '#3a1a8a'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(118, 70, 26, 0, 7); c.fill();
  c.fillStyle = '#1a1030'; for (let i = 0; i < 9; i++) c.fillRect(6 + i * 17, 150 - (i % 4) * 22, 14, 80); c.fillStyle = '#2ad8a8'; for (let i = 0; i < 4; i++) c.fillRect(10 + i * 40, 196, 8, 28); c.font = `700 54px ${FONT}`; c.textAlign = 'center'; c.lineWidth = 9; c.strokeStyle = '#1a1030'; c.strokeText('GTA 6', w / 2, 52); c.fillStyle = '#ffffff'; c.fillText('GTA 6', w / 2, 52); });
  box(2.6, 3.6, .4, mat(0xffffff, { map: t, roughness: .35 }), .06, G6, 0, 0, 0); }

window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; const T = 21.3, L = { T, lt: 1, k: 1, t0: 21, t1: 22 }; hideAll(); BAD_.length = 0; BIRDSON = 0; DOF = 0;
  if (v === 0) { // 1: en la plaza, la señal gigante «S verboten» hace de halo detrás de Jonte, que grita; dos policías le señalan; la gente se lleva las manos a la cabeza
    town(L); GAN.visible = false; const p = V(0, 0, 28); const sg = FALLBAN; sg.visible = true; sg.children.forEach(o => o.visible = true); sg.position.set(0, 6.6, 21); sg.rotation.set(0, 0, 0); sg.scale.setScalar(1.25);
    const j = put(jonte, p.x, 0, p.z, 0); actuar(j, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: .95, aRz: .95, aLe: .5, aRe: .5, headX: -.08, lean: -.05 }]], { T, breathe: false, weight: false }); cara(j, T, { expr: 'shock', eyes: 'wide', mouth: 'scream', noBlink: 1 }); spit(j, T, T - .3, 10);
    [[COPS[0], -3.5, -2.2, 1], [COPS[1], 3.5, -2.0, -1]].forEach(([c, dx, dz, s]) => { put(c, p.x + dx, 0, p.z + dz, s * .9); actuar(c, 0, [[0, { aRx: s > 0 ? 1.55 : .3, aLx: s > 0 ? .3 : 1.55, aRz: s > 0 ? -.35 : 0, aLz: s > 0 ? 0 : .35, aRe: .05, aLe: .05, lean: .06 }]], { T, breathe: false, weight: false }); cara(c, T, { expr: 'angry', mouth: 'talk_wide', noBlink: 1 }); });
    [[EX[2], -9, -6], [EX[5], 9.5, -6.5], [EX[8], -4, -9], [EX[11], 4.5, -9.5], [EX[14], -12, -11], [EX[17], 12, -12]].forEach(([c, dx, dz], i) => { const x = p.x + dx, z = p.z + dz; put(c, x, 0, z, Math.atan2(p.x - x, p.z + 8 - z) * .7); actuar(c, 0, [[0, i % 2 ? 'hands_head' : { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9 }]], { T, breathe: false, weight: false }); cara(c, T + i, { expr: 'shock', mouth: i % 2 ? 'o' : 'scream', noBlink: 1 }); });
    cam([p.x, 4.4, p.z + 12], [p.x, 5.9, p.z], 50); FACES.push(j); clearFaces(); sh(V(p.x, 0, p.z), 26); hemi.intensity = 1.15;
    finishCover2();
    tape(H * .935, -.05); tape(H * .135, .04, 'ACHTUNG · NUR TH ERLAUBT · ACHTUNG · NUR TH ERLAUBT · ');
    cTxt('IN DIESER STADT IST', W / 2, H * .2, 84, 'Lilita', ['#ffffff', '#e8f0ff'], '#101040', 22);
    lispWord('DAS S VERBOTEN!', W / 2, H * .285, 128, 'Lucky', ['#ffffff', '#ffe08a'], '#1a1030', 30, -.02, [1]);
    sticker('1× „S“ = GEFÄNGNIS', W / 2, H * .85, 62, '#ff1a2a', '#ffffff', .03);
    sparkle2(W * .08, H * .24, 26); sparkle2(W * .93, H * .3, 22);
  } else { // 2: en la Zockerhöhle: Jonte enseña la caja de GTA 6 con cara de pánico; el dependiente, detrás del mostrador, se encoge con la de GTA 5
    ladenS(L); const p = V(ZOX, 0, -2.4);
    const j = put(jonte, p.x + .6, 0, p.z, -.1); actuar(j, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.3, aRz: -.3, aLe: 1.0, aRe: 1.0, headX: -.08 }]], { T, breathe: false, weight: false }); show(G6, p.x + .52, 3.0, p.z + 1.2, -.1, .5); cara(j, T, { expr: 'shock', eyes: 'wide', mouth: 'scream', noBlink: 1 }); spit(j, T, T - .3, 8);
    const z = put(zock, p.x - 2.9, 0, -8.4, .3); actuar(z, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: -.3, aRz: -.3, aLe: 1.0, aRe: 1.0, headZ: .14, sx: .05 }]], { T, breathe: false, weight: false }); show(GAME, p.x - 1.4, 3.9, -7.5, .5, .7); cara(z, T, { expr: 'sad', eyes: 'half', mouth: 'grimace', noBlink: 1 });
    cam([p.x - .6, 4.8, p.z + 9.5], [p.x - .9, 4.4, p.z - 3], 50); FACES.push(j, z); clearFaces(); sh(V(p.x, 0, p.z - 3), 20); FILL.intensity = 46;
    finishCover2(1.6);
    cTxt('WARUM SAGT HIER JEDER', W / 2, H * .2, 80, 'Lilita', ['#ffffff', '#f0e0ff'], '#20083a', 22);
    lispWord('GTA SECHS', W / 2, H * .3, 150, 'Lucky', ['#fff4a0', '#ff9a2a'], '#2a0a1a', 32, -.03);
    const g = proj(wpos(G6)); sticker('NUR GTA 5?!', W * .3, H * .73, 64, '#7a2aff', '#ffffff', -.07);
    sparkle2(g[0] + 150, g[1] - 170, 34); sparkle2(g[0] - 160, g[1] + 120, 22); sparkle2(W * .9, H * .2, 24);
  } };

// ---------- portadas (fuera del vídeo): yo en el centro sin placa; todos los demás con su «HALLO, ich heiße ADRIAN» ----------
function coverTxt(l1, l2, y0 = .27) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * y0, 104, '#ffffff'], [l2, H * (y0 + .062), 96, '#E2FD07']]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .86 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const T = 3.3, L = { T, lt: 1, k: 1 }; hideAll(); BAD_.length = 0; town(L); BIRDSON = 0; const p = V(-8, 0, 20);
  crowdGrid(L, p.x, p.z - 11.5, 6, 3, 3.3, 3.0, { mode: v ? 'point' : 'wave', face: V(p.x, 3, p.z + 30), seed: 7 + v, jit: .2 });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, v ? GEST.shrug : { aLx: .4, aRx: .4, aLz: -.3, aRz: -.3, aLe: 1.5, aRe: 1.5, headX: .1 }]], { T }); cara(me, T, v ? { expr: 'bored', eyes: 'half', mouth: 'flat', noBlink: 1 } : { expr: 'sad', eyes: 'worried', mouth: 'frown', noBlink: 1 });
  cam([p.x, 4.4, p.z + 13.5], [p.x, 4.4, p.z - 4], 50); sh(V(p.x, 0, p.z - 3), 30);
  grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H);
  if (v === 0) coverTxt('IN DIESER STADT', 'HEISST JEDER ADRIAN'); else coverTxt('ALLE HEISSEN ADRIAN', '… AUSSER MIR'); };

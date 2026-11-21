// ---------- portadas (fuera del vídeo): el preso con su 1353 huyendo, policías y drones detrás, los del 0 mirando ----------
function coverTxt(l1, l2, y0 = .255) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * y0, 104, '#ffffff'], [l2, H * (y0 + .06), 92, '#E2FD07']]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .84 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const T = 2.1; hideAll(); BAD_.length = 0; town(); BIRDSON = 0;
  const z = -40; caminar(haeft, .9, { x: -4, z: z - 7.6, ry: 0, speed: 8.5, run: true, accel: .05, T }); num(haeft, 1353, 1); cara(haeft, T, { eyes: 'terror', mouth: 'scream', noBlink: 1 }); sweat(haeft, T, 2);
  [[COP[0], -8.6], [COP[1], .6]].forEach(([c, x], i) => { caminar(c, .9, { x, z: z - 16, ry: 0, speed: 8.5, run: true, accel: .05, T: T + i }); cara(c, T, { expr: 'shout', mouth: 'talk_wide', noBlink: 1 }); });
  [[K[0], -10.6, z + 2, .7], [XT[0], 2.8, z + 2, -.7]].forEach(([c, x, zz, ry], i) => { put(c, x, 0, zz, ry); actuar(c, 0, [[0, i ? 'shock' : 'point']], { T }); num(c, 0, 1); cara(c, T, { eyes: 'wide', mouth: 'o', noBlink: 1 }); });
  DRONES.slice(0, 2).forEach((d, i) => { show(d, -4 + (i ? 4.5 : -4.5), 13.5, z - 12); d.userData.spin(T + i); d.userData.beam(true, 13); });
  cam([-4, 6.2, z + 18], [-4, 6.4, z - 6], 52); sh(V(-4, 0, z - 6), 40);
  grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  if (v === 0) coverTxt('IN DIESER STADT', 'IST GOONEN VERBOTEN'); else coverTxt('ÜBER DEINEM KOPF', 'STEHT, WIE OFT …'); };

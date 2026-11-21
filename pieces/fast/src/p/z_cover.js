// ---------- portada: yo (7) en el centro, triste; a los lados Jonas (990) y el del döner (920) riéndose; texto entre los personajes ----------
window.renderCover = v => { hideAll(); BAD_.length = 0; town(); const T = 3.2;
  const c = put(ich, -6, 0, -6, 0); num(c, 7, 1); actuar(c, 0, [[0, 'shrug']], { T }); cara(c, T, { expr: 'sad', eyes: 'worried', mouth: 'frown' });
  [[jonas, -9.2, -7.4, .45, 'point'], [doenm, -2.8, -7.4, -.45, 'point_l']].forEach(([k, x, z, ry, g]) => { put(k, x, 0, z, ry); num(k); actuar(k, 0, [[0, g]], { T }); cara(k, T, { eyes: 'happy', mouth: 'laugh' }); });
  COVER = { cam: () => orbit(V(-6, 3.8, -7), 22, 0, .06, 46) };
  COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; camera.updateProjectionMatrix(); while (POST.length) POST.shift()();
  sun.castShadow = true; sky.sky.position.copy(camera.position); composer.render(); octx.drawImage(renderer.domElement, 0, 0, W, H);
  const t = (s, y, sz, fill) => { octx.save(); octx.font = `700 ${sz}px ${FONT}`; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.lineJoin = 'round'; octx.lineWidth = sz * .22; octx.strokeStyle = '#000'; octx.strokeText(s, W / 2, y); octx.fillStyle = fill; octx.fillText(s, W / 2, y); octx.restore(); };
  t('JEDER GEWINNT FAST', H * .74, 92, '#ffffff'); t('… AUSSER MIR', H * .80, 110, '#E2FD07'); COVER = null; };

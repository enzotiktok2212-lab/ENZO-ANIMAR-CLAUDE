// ---------- portada para TikTok (1080×1920) ----------
window.renderCover = (variant = 0) => {
  hideAll(); BAD.length = 0; use('G'); dusk(.55); W1.crack.visible = true;
  put(RED, 0, 30, -214, 0); applyPose(RED, { aRx: 2.9, aRe: .9, aLx: 2.9, aLe: .9, headX: .25 }); RED.setFace({ custom: 'skinless', look: [0, 1] }); STM.at(hp(RED), 2.3, 9, 1.8);
  put(hero, 2.2, 0, -112, Math.PI + .3); applyPose(hero, { headX: -.55, aRx: .2, aLz: .25, aRz: .1 }); blades(hero); hero.props.cloak.rotation.x = .35;
  for (let i = 0; i < 4; i++) { put(ex[i], -10 + i * 6.5, 0, -150 - (i % 2) * 4, Math.PI + (i - 1.5) * .2); applyPose(ex[i], { headX: -.6, aLz: 1.2, aRz: 1.2, lean: -.2 }); face(ex[i], { eyes: 'wide', mouth: 'shout' }, i); }
  cam([4, 7, -98], [0, 66, -210], 50); camera.updateProjectionMatrix(); grade.uniforms.vig.value = .62; grade.uniforms.sat.value = 1.6; bloom.strength = .35; sh(V(0, 0, -170), 50);
  sky.sky.position.copy(camera.position); composer.render();
  const c = octx; c.save(); c.drawImage(renderer.domElement, 0, 0, W, H);
  const g = c.createLinearGradient(0, 0, 0, H * .3); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H * .3);
  const g2 = c.createLinearGradient(0, H * .72, 0, H); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,.6)'); c.fillStyle = g2; c.fillRect(0, H * .72, W, H * .28);
  const T = (s, x, y, size, fill, rot = 0, lw = .22) => { c.save(); c.translate(x, y); c.rotate(rot); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; const tw = c.measureText(s).width; if (tw > W * .92) { const k = W * .92 / tw; c.scale(k, k); } c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.shadowOffsetY = 10; c.lineWidth = size * lw; c.strokeStyle = '#000'; c.strokeText(s, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = fill; c.fillText(s, 0, 0); c.restore(); };
  T(variant ? 'NIEMAND HAT' : 'WAS IST HINTER', W / 2, H * .085, 118, '#ffffff', -.02); T(variant ? 'JE DARÜBER GESCHAUT' : 'DER MAUER?', W / 2, H * .155, 150, '#E2FD07', -.02);
  c.save(); c.translate(W / 2, H * .885); c.rotate(.03); c.font = `700 84px ${FONT}`; const tw = c.measureText('SEIT 100 JAHREN').width + 90; c.fillStyle = '#d6202f'; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.beginPath(); c.roundRect(-tw / 2, -62, tw, 124, 30); c.fill(); c.shadowBlur = 0; c.lineWidth = 10; c.strokeStyle = '#fff'; c.stroke(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SEIT 100 JAHREN', 0, 6); c.restore();
  // flecha hacia el gigante
  const h = proj(hp(RED).add(V(0, 8, 0))); c.save(); c.translate(W * .84, H * .25); c.rotate(-2.5); c.fillStyle = '#E2FD07'; c.strokeStyle = '#000'; c.lineWidth = 12; c.beginPath(); c.moveTo(-20, 0); c.lineTo(110, 0); c.lineTo(110, -40); c.lineTo(190, 30); c.lineTo(110, 100); c.lineTo(110, 60); c.lineTo(-20, 60); c.closePath(); c.stroke(); c.fill(); c.restore(); c.restore();
};

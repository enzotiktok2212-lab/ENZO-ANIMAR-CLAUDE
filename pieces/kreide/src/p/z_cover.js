// ---------- portadas (fuera del vídeo): Emil dibuja y todo cobra vida; el dragón con los niños arriba, Krümel saltando, el anciano con sus llaves, Lea; texto de tiza en el centro ----------
function coverTxt(l1, l2, y0 = .43) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz] of [[l1, H * y0, 118], [l2, H * (y0 + .072), 132]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .86 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 22; c.shadowOffsetY = 8; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(t, 0, 0); c.restore(); }
  c.restore(); }
// ojo del Sistema en el cielo (referencia a la parte del Sistema): iris digital azul con anillos, mirando a la ciudad
function sysEye(x, y, r, red = 0) { const c = octx; c.save(); const col = red ? '255,60,80' : '90,220,255';
  const g = c.createRadialGradient(x, y, r * .2, x, y, r * 2.2); g.addColorStop(0, `rgba(${col},.55)`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8);
  c.lineWidth = 6; c.strokeStyle = `rgba(${col},.9)`; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(x, y, r * (1.25 + i * .28), r * (.42 + i * .1), (i - 1) * .35, 0, 7); c.stroke(); }
  c.fillStyle = '#06101c'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); const ir = c.createRadialGradient(x, y, r * .1, x, y, r); ir.addColorStop(0, '#ffffff'); ir.addColorStop(.35, `rgb(${col})`); ir.addColorStop(1, '#0a2a4a'); c.fillStyle = ir; c.beginPath(); c.arc(x, y, r * .78, 0, 7); c.fill();
  c.fillStyle = '#02060c'; c.beginPath(); c.ellipse(x, y, r * .16, r * .42, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x - r * .25, y - r * .3, r * .12, 0, 7); c.fill();
  c.font = `700 30px monospace`; c.textAlign = 'center'; c.fillStyle = `rgba(${col},.95)`; c.fillText('SYSTEM v4.2 · ZUSCHAUER ERKANNT', x, y + r * 1.75); c.restore(); }
window.renderCover = v => { const T = 2.4; hideAll(); BAD_.length = 0; town(v ? 'storm' : 'morning'); BIRDSON = 0; if (v) { storm(.55); CLO.set(V(0, 0, -40), T, .8, 160, 60); RAIN.update(T, V(0, 0, 0), .35, 60, 40, 40); }
  crowdAt(T, grid(-40, -60, 40, -20, 90, 31, 0), 'cheer');
  DRA.g.visible = true; BUCKETS.forEach(b => b.visible = false); DRA.update(T, dpath(5.5, 21, -18, 60, 1.2, -.45), { melt: v ? .1 : 0 }); riders(T, v ? 1 : 0, RIDERS().slice(0, 7));
  put(emil, -1.6, 0, 5, .2); applyPose(emil, { ...KNEEL, aRx: 2.5, aRz: .3, aRe: .3, aLx: .5, headX: -.15, lean: .05 }); chalkIn(emil); cara(emil, T, { eyes: 'wide', mouth: 'open_smile', noBlink: 1 });
  show(KRU, 1.9, 1.0, 6.4, -.3, .9); KRU.userData.anim(T, 1); KRU.rotation.z = .15;
  put(opa, 5.2, 0, -1.5, -.4); keysOn(); actuar(opa, 0, [[0, 'wave']], { T }); cara(opa, T, { eyes: 'happy', mouth: 'grin', noBlink: 1 });
  put(lea, -5.4, 0, -1, .4); actuar(lea, 0, [[0, 'cheer']], { T }); cara(lea, T, { eyes: 'happy', mouth: 'laugh', noBlink: 1 }); chalkIn(lea, CHALK2);
  STK.update(T, [[-4.5, 0, -6, .3, .9], [4, 0, -7, -.3, .9]], 'dance'); dec(DC.dog, -1.2, 8.4, 0, .9); dec(DC.mast1, -5.5, 6.5, .3); dec(DC.mast2, 6, 7, -.3);
  KEYS.forEach((k, i) => { if (i >= 10) return; const r = RNG(i * 5 + 2); show(k, 5.2 + (r() - .5) * 5, 2 + r() * 7, -1.5 + (r() - .5) * 3, r() * 6, .9); k.rotation.set(r() * 3, r() * 3, r() * 3); });
  cam([0, 3.6, 26], [0, 8.6, 0], 54); sh(V(0, 0, 0), 40);
  grade.uniforms.sharp.value = 1.6; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.6; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; bloom.strength = .3; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  sysEye(W * .3, H * .2, 70, v);
  if (v === 0) coverTxt('ALLES, WAS DU MALST,', 'WIRD LEBENDIG'); else coverTxt('ALLES WIRD LEBENDIG …', 'BIS ES REGNET'); };

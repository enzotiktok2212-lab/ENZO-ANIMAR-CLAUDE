// ---------- portadas (fuera del vídeo): yo lanzando el queso dorado, los Tiere corriendo hacia mí y el elefante de oro en el cielo ----------
function coverTxt(l1, l2) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .43, 112, '#ffffff'], [l2, H * .49, 92, '#E2FD07']]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .84 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const T = 3.3; hideAll(); BAD_.length = 0; field(); BIRDSON = 0; FE.arch.visible = false;
  const me = put(ich, FX, 0, -12, .1); armsK(me, .9); applyPose(me, { aRx: 2.7, aRz: .35, aRe: .2, aLx: .7, aLz: .5, aLe: .5, lean: -.08, lLx: .25, lRx: -.2, headX: -.25 }); cara(me, T, { eyes: 'wide', mouth: 'grin', noBlink: 1 });
  me.root.updateMatrixWorld(true); const hp_ = me.aR.hand.getWorldPosition(V(0, 0, 0)); show(FOODS.kaese, hp_.x - .2, hp_.y + 1.6, hp_.z + .3, .5, .8); FOODS.kaese.rotation.x = .3;
  beast(EG, FX, 19, -56, .2, 1.6).pose(1.1, { fly: 1, trunkUp: 1, face: { eyes: 'open' } });
  beast(TG[0], FX - 5.2, 0, -23, .35).pose(.6, { walk: 1, face: { eyes: 'wide', mouth: 'open' } }); beast(CH, FX + 5.4, 0, -22, -.35).pose(1.3, { cheer: 1, face: { eyes: 'happy', mouth: 'grin' } });
  beast(NB[1], FX - 3.3, 0, -9.4, .3).pose(.2, { wave: 1, face: { eyes: 'happy', mouth: 'grin' } }); beast(LI[0], FX + 3.5, 0, -10, -.35).pose(.9, { trunkUp: 1, face: { eyes: 'wide' } });
  beast(CA, FX - 10, 0, -32, .4).pose(.4, { stance: 1 }); beast(TR, FX + 10.5, 0, -34, -.5).pose(.4, { walk: 1 });
  coinPop(V(FX + 4.4, 3, -10.6), 0, .55, 5, 0, .8); coinPop(V(FX - 6.4, 5, -22), 0, .7, 5, 6, .8); coinPop(V(FX + 6.2, 5, -21), 0, .45, 5, 12, .8); trail(V(hp_.x, hp_.y + 1.4, hp_.z), V(0, -1, 0), T, 8, .4);
  cam([FX, 6.5, 9], [FX, 9, -30], 64); sh(V(FX, 0, -20), 50);
  grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  for (const b of BAD_) drawBadge(b);
  if (v === 0) coverTxt('IN DIESER STADT', 'KAUFT MAN KEINE TIERE'); else coverTxt('WIRF ESSEN …', '… UND ES GEHÖRT DIR'); };

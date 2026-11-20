// ---------- portadas (1080×1920): todo lo importante entre y = 240 y 1680 ----------
const COVERS = [
  // 1: yo inclinado sobre la maqueta del sótano, mirando a cámara; dentro, mi yo diminuto saludando
  { fn: L => { kel(L); atTable(ich, L.T, { lean: .2, headX: -.05, aRx: 2.7, aRz: .5, aRe: .4, aLx: 1.0, aLz: -.2, aLe: .5 }); cara(ich, L.T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
      tiny(ichT, 4, 30, Math.PI); actuar(ichT, 0, [[0, 'wave']], { T: L.T }); cara(ichT, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' });
      cam([KX + .3, 4.6, 1.6], [KX, 4.0, -6.6], 46); }, top: 'IN JEDEM KELLER', bot: 'EINE STADT', ty: .66, by: .74 },
  // 2: el Thomas gigante asoma sobre la ciudad, abajo yo le miro
  { fn: L => { underLid(L); giant(L, { aRx: 2.6, aRz: -.45, aRe: 2.3 }); cara(ichG, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); attach(LUPE2, ichG.aR.hand, [0, -.6, .45], [0, 0, 0], .9);
      plazaLife(L.T, 10, 77);
      const h = hp(ichG); cm([15, 4.5, 10, h.x, h.y - 12, h.z, 60], [15, 4.5, 10, h.x, h.y - 12, h.z, 60], 0); }, top: 'WER WOHNT', bot: 'ÜBER UNS?', ty: .55, by: .63 },
];
window.renderCover = v => { const C = COVERS[v], T = 60, L = { lt: .5, k: .5, T, d: 1, t0: 59.5, t1: 60.5 };
  hideAll(); BAD_.length = 0; C.fn(L); while (POST.length) POST.shift()(); CITY.userData.update(T);
  grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0;
  camera.updateProjectionMatrix(); sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
  octx.drawImage(renderer.domElement, 0, 0, W, H);
  const line = (t, y, size, fill) => { octx.save(); octx.font = `700 ${size}px ${FONT}`; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.lineJoin = 'round'; const tw = octx.measureText(t).width; const k = Math.min(1, W * .9 / tw); octx.translate(W / 2, y); octx.scale(k, k); octx.rotate(-.03);
    octx.shadowColor = 'rgba(0,0,0,.55)'; octx.shadowBlur = 24; octx.shadowOffsetY = 10; octx.lineWidth = size * .22; octx.strokeStyle = '#000'; octx.strokeText(t, 0, 0); octx.shadowColor = 'transparent'; octx.fillStyle = fill; octx.fillText(t, 0, 0); octx.restore(); };
  line(C.top, H * C.ty, 118, '#ffffff'); line(C.bot, H * C.by, 150, '#E2FD07'); };

// ---------- portadas (1080×1920): composiciones propias, todo lo importante entre y = 240 y 1680, centrado ----------
const COVERS = [
  // 1: yo detrás de la mesa, con la lupa delante del ojo, inclinado sobre la maqueta (que llena el tercio inferior); un yo diminuto saluda en la plaza
  { fn: L => { kel(L, 110); FILL.intensity = 25; const c = put(ich, KX, 0, -5.2, 0); actuar(c, 0, [[0, { lean: .12, headX: -.12, aRx: 2.25, aRz: -.5, aRe: 2.0, aLx: .9, aLz: -.25, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
      attach(LUPE, c.aR.hand, [0, -.55, .5], [0, 0, 0], .62);
      tiny(ichT, 0, 18, 0); actuar(ichT, 0, [[0, 'wave']], { T: L.T }); cara(ichT, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); [[EX[5], -14, 26], [EX[8], 12, 22], [EX[11], -6, -14]].forEach(([e, x, z], i) => { tiny(e, x, z, i); actuar(e, 0, [[0, walkP(L.T, i)]], { T: L.T }); });
      cam([KX, 6.0, 9.5], [KX, 3.7, -3.5], 40); }, top: ['IN JEDEM', 'KELLER'], bot: 'EINE STADT!', ty: [.115, .19], by: .885 },
  // 2: la casa cortada: en el sótano, alguien con su maqueta; encima, mi cara gigante asomando con la lupa (ciudades dentro de ciudades)
  { fn: L => { use('PU'); day(); PU.userData.roof.visible = false; FILL.intensity = 40; const c = put(ichT, PX + .5, -15, -6.2, 0); c.root.scale.setScalar(.9); actuar(c, 0, [[0, { lean: .2, headX: .15, aRx: .9, aLx: .9, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
      const g = put(ichG, PX, -8, -30, 0); g.root.scale.setScalar(7); actuar(g, 0, [[0, { lean: .4, headX: -.2, aRx: 2.1, aRz: -.5, aRe: 1.9, aLx: 1.2, aLz: .3, aLe: .4 }]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); attach(LUPE2, g.aR.hand, [0, -.55, .5], [0, 0, 0], .62);
      cam([PX, 10, 92], [PX, 9, -6], 44); sh(V(PX, 0, -10), 70); }, top: ['UND DARIN…'], bot: 'NOCH EINE STADT', ty: [.105], by: .9 },
];
window.renderCover = v => { const C = COVERS[v], T = 60, L = { lt: .5, k: .5, T, d: 1, t0: 59.5, t1: 60.5 };
  hideAll(); BAD_.length = 0; C.fn(L); while (POST.length) POST.shift()(); CITY.userData.update(T);
  grade.uniforms.sharp.value = 1.6; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0;
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  camera.updateProjectionMatrix(); sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
  octx.drawImage(renderer.domElement, 0, 0, W, H);
  const line = (t, y, size, fill) => { octx.save(); octx.font = `700 ${size}px ${FONT}`; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.lineJoin = 'round'; const tw = octx.measureText(t).width; const k = Math.min(1, W * .9 / tw); octx.translate(W / 2, y); octx.scale(k, k); octx.rotate(-.025);
    octx.shadowColor = 'rgba(0,0,0,.6)'; octx.shadowBlur = 26; octx.shadowOffsetY = 10; octx.lineWidth = size * .22; octx.strokeStyle = '#000'; octx.strokeText(t, 0, 0); octx.shadowColor = 'transparent'; octx.fillStyle = fill; octx.fillText(t, 0, 0); octx.restore(); };
  C.top.forEach((t, i) => line(t, H * C.ty[i], 132, '#ffffff')); line(C.bot, H * C.by, 132, '#E2FD07'); };

// ---------- portadas (1080×1920): composiciones propias, todo lo importante entre y = 240 y 1680, centrado ----------
const COVERS = [
  // 1: yo detrás de la mesa, con la lupa delante del ojo, inclinado sobre la maqueta (que llena el tercio inferior); un yo diminuto saluda en la plaza
  { fn: L => { kel(L, 110); FILL.intensity = 25; const c = put(ich, KX, 0, -5.2, 0); actuar(c, 0, [[0, { lean: .12, headX: -.12, aRx: 2.25, aRz: -.5, aRe: 2.0, aLx: .9, aLz: -.25, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
      attach(LUPE, c.aR.hand, [0, -.55, .5], [0, 0, 0], .62);
      tiny(ichT, 0, 18, 0); actuar(ichT, 0, [[0, 'wave']], { T: L.T }); cara(ichT, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); [[EX[5], -14, 26], [EX[8], 12, 22], [EX[11], -6, -14]].forEach(([e, x, z], i) => { tiny(e, x, z, i); actuar(e, 0, [[0, walkP(L.T, i)]], { T: L.T }); });
      cam([KX, 6.6, 12.5], [KX, 3.5, -3.5], 40); }, top: ['IN JEDEM', 'KELLER'], bot: 'EINE STADT!', ty: [.17, .235], by: .81, droste: true },
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
  if (C.droste) {   // ciudades dentro de ciudades: la misma portada, cada vez más pequeña, metida en la plaza de la maqueta
    const [px, py] = proj(MC.clone().add(V(0, 0, 1.2))); const src = document.createElement('canvas'); src.width = W; src.height = H; src.getContext('2d').drawImage(renderer.domElement, 0, 0);
    let cx = W / 2, cy = H / 2, s = 1;
    for (let k = 1; k <= 4; k++) { const ns = s * .25; const ncx = cx + (px - W / 2) * s, ncy = cy + (py - H / 2) * s; const w = W * ns, h = H * ns;
      octx.save(); octx.shadowColor = 'rgba(0,0,0,.6)'; octx.shadowBlur = 30 * ns + 6; octx.fillStyle = '#fff'; octx.fillRect(ncx - w / 2 - 6, ncy - h / 2 - 6, w + 12, h + 12); octx.restore();
      octx.drawImage(src, ncx - w / 2, ncy - h / 2, w, h); octx.lineWidth = Math.max(2, 8 * ns * 3); octx.strokeStyle = '#E2FD07'; octx.strokeRect(ncx - w / 2, ncy - h / 2, w, h);
      cx = ncx; cy = ncy; s = ns; }
    // flechas "y otra… y otra…"
    octx.save(); octx.strokeStyle = '#fff'; octx.fillStyle = '#fff'; octx.lineWidth = 10; octx.lineCap = 'round'; octx.shadowColor = 'rgba(0,0,0,.7)'; octx.shadowBlur = 12;
    for (const sd of [-1, 1]) { const x0 = W / 2 + sd * 330, y0 = H * .35, x1 = W / 2 + sd * 190, y1 = H * .5; octx.beginPath(); octx.moveTo(x0, y0); octx.quadraticCurveTo(x0 + sd * 40, (y0 + y1) / 2, x1, y1); octx.stroke();
      const a = Math.atan2(y1 - ((y0 + y1) / 2), x1 - (x0 + sd * 40)); octx.beginPath(); octx.moveTo(x1 + Math.cos(a) * 26, y1 + Math.sin(a) * 26); octx.lineTo(x1 + Math.cos(a + 2.4) * 30, y1 + Math.sin(a + 2.4) * 30); octx.lineTo(x1 + Math.cos(a - 2.4) * 30, y1 + Math.sin(a - 2.4) * 30); octx.fill(); }
    octx.restore(); }
  const line = (t, y, size, fill) => { octx.save(); octx.font = `700 ${size}px ${FONT}`; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.lineJoin = 'round'; const tw = octx.measureText(t).width; const k = Math.min(1, W * .9 / tw); octx.translate(W / 2, y); octx.scale(k, k); octx.rotate(-.025);
    octx.shadowColor = 'rgba(0,0,0,.6)'; octx.shadowBlur = 26; octx.shadowOffsetY = 10; octx.lineWidth = size * .22; octx.strokeStyle = '#000'; octx.strokeText(t, 0, 0); octx.shadowColor = 'transparent'; octx.fillStyle = fill; octx.fillText(t, 0, 0); octx.restore(); };
  C.top.forEach((t, i) => line(t, H * C.ty[i], 132, '#ffffff')); line(C.bot, H * C.by, 132, '#E2FD07'); };

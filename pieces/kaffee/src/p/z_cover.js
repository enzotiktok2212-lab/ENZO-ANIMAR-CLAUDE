// ---------- portadas (fuera del vídeo) ----------
// Tipografías propias de portada (Luckiest Guy / Lilita One), pegatinas 2D por encima, AO y luz cálida.
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.55; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff2a4a') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .2, 6.1); c.stroke(); c.restore(); }
function arrowTo(x0, y0, x1, y1, col = '#ff2a4a') { const c = octx, a = Math.atan2(y1 - y0, x1 - x0); c.save(); c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = col; c.fillStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + 60, (y0 + y1) / 2 - 40, x1, y1); c.stroke(); c.translate(x1, y1); c.rotate(a + .3); c.beginPath(); c.moveTo(14, 0); c.lineTo(-40, -30); c.lineTo(-40, 30); c.closePath(); c.fill(); c.restore(); }
function bigArrow(x0, y0, x1, y1, bend = 80, col = '#ff1a2e') { const c = octx, mx = (x0 + x1) / 2 + bend, my = (y0 + y1) / 2 - bend * .6, a = Math.atan2(y1 - my, x1 - mx);
  const head = (lw, fill, stroke) => { c.save(); c.translate(x1, y1); c.rotate(a); c.beginPath(); c.moveTo(18, 0); c.lineTo(-78, -58); c.lineTo(-58, 0); c.lineTo(-78, 58); c.closePath(); c.lineJoin = 'round'; if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.stroke(); } if (fill) { c.fillStyle = fill; c.fill(); } c.restore(); };
  const ex = x1 - Math.cos(a) * 60, ey = y1 - Math.sin(a) * 60; c.save(); c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 22; c.shadowOffsetY = 8;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, ex, ey); c.lineWidth = 58; c.strokeStyle = '#000'; c.stroke(); head(24, null, '#000'); c.shadowColor = 'transparent';
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, ex, ey); c.lineWidth = 36; const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#ff5a5a'); g.addColorStop(1, col); c.strokeStyle = g; c.stroke(); head(0, col, null);
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, ex, ey); c.lineWidth = 8; c.strokeStyle = 'rgba(255,255,255,.35)'; c.stroke(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
// gotas y chorros de cerveza que caen (solo portadas)
const DROPS = Array.from({ length: 70 }, (_, i) => P_(sphere(1, mat(0xf6a81c, { roughness: .08, metalness: .1, emissive: 0x8a4a00, emissiveIntensity: .45, transparent: true, opacity: .92 }), null, 0, 0, 0, 12, 10)));
// pegatinas 2D propias de kaffee
function cupSticker(x, y, s, rot) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 24; c.shadowOffsetY = 10; c.lineJoin = 'round';
  c.fillStyle = '#ffffff'; c.strokeStyle = '#2a1408'; c.lineWidth = 12; c.beginPath(); c.moveTo(-90, -70); c.lineTo(90, -70); c.lineTo(72, 80); c.quadraticCurveTo(0, 100, -72, 80); c.closePath(); c.fill(); c.shadowColor = 'transparent'; c.stroke();
  c.beginPath(); c.ellipse(108, 0, 38, 44, 0, -1.3, 1.3); c.stroke(); c.fillStyle = '#6a3410'; c.beginPath(); c.ellipse(0, -70, 86, 18, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#d8202f'; c.beginPath(); c.roundRect(-70, -20, 140, 60, 12); c.fill(); c.fillStyle = '#fff'; c.font = '56px Lilita'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('€', 0, 12);
  c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 10; c.lineCap = 'round'; for (const dx of [-36, 0, 36]) { c.beginPath(); c.moveTo(dx, -100); c.bezierCurveTo(dx + 22, -130, dx - 22, -150, dx, -180); c.stroke(); } c.restore(); }
function moneyBag(x, y, s, rot) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 22; c.shadowOffsetY = 8;
  c.fillStyle = '#3aa64a'; c.strokeStyle = '#0a2a10'; c.lineWidth = 10; c.beginPath(); c.moveTo(-30, -80); c.quadraticCurveTo(-110, 10, -80, 80); c.quadraticCurveTo(0, 120, 80, 80); c.quadraticCurveTo(110, 10, 30, -80); c.closePath(); c.fill(); c.shadowColor = 'transparent'; c.stroke();
  c.fillStyle = '#2a8a3a'; c.beginPath(); c.ellipse(0, -90, 44, 20, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#ffe14a'; c.font = '100px Lilita'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('€', 0, 30); c.restore(); }
function priceTag(x, y, s, rot, a, b, col = '#ffd23f') { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.shadowOffsetY = 8;
  c.fillStyle = '#1a1208'; c.beginPath(); c.roundRect(-200, -70, 400, 140, 26); c.fill(); c.shadowColor = 'transparent'; c.strokeStyle = col; c.lineWidth = 8; c.stroke();
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffffff'; c.font = '50px Lilita'; c.fillText(a, 0, -24); c.fillStyle = col; c.font = '64px Lilita'; c.fillText(b, 0, 36); c.restore(); }
// fajo de billetes en 3D (con volumen y faja de papel), solo portadas
function cashBundles(n) { if (window.__cash) return window.__cash; const side = mat(0xf2f0e4, { roughness: .8, map: canvasTex(64, 16, (c, w, h) => { c.fillStyle = '#eef0e0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b8c8a8'; for (let y = 1; y < h; y += 2) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } }) });
  const band = mat(0xe8c860, { roughness: .5 }); const out = []; for (let i = 0; i < n; i++) { const d = [20, 50, 100, 500][i % 4]; const top = new THREE.MeshStandardMaterial({ map: BILLT[d], roughness: .6 });
    const g = new THREE.Group(); scene.add(g); const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, .42, 1.2), [side, side, top, top, side, side]); m.position.y = .21; m.castShadow = true; g.add(m); outline && outline(m, .02);
    const b = new THREE.Mesh(new THREE.BoxGeometry(.38, .44, 1.24), band); b.position.y = .21; g.add(b); g.visible = false; out.push(g); } return (window.__cash = out); }
function cashPile(list, x, y, z, ry = 0) { const P = [[-1.25, 0, -.65], [1.25, 0, -.65], [-1.25, 0, .65], [1.25, 0, .65], [-.62, 1, -.3], [.62, 1, .3], [0, 2, 0]]; P.forEach(([dx, lv, dz], i) => { const b = list.shift(); if (!b) return; b.visible = true;
  const c = Math.cos(ry), s = Math.sin(ry); const k = b.scale.x; b.position.set(x + (dx * c + dz * s) * k, y + lv * .43 * k, z + (-dx * s + dz * c) * k); b.rotation.set(0, ry + (i * 1.7 % 1 - .5) * .3, 0); }); }
// taza de cristal: se ve el café marrón oscuro por dentro (solo portadas)
function glassCup(cu, k = .85) { const glass = new THREE.MeshPhysicalMaterial({ color: 0xe4f6ff, transparent: true, opacity: .42, roughness: .05, metalness: 0, depthWrite: false, side: THREE.DoubleSide });
  const ud = cu.userData.cup ? cu.userData.cup.userData : cu.userData; const root = cu.userData.cup || cu; const dark = mat(0x2a1206, { roughness: .25 });
  root.children.forEach(m => { if (!m.isMesh) return; if (m === ud.cof) { m.material = dark; return; } if (m.material && m.material.side === THREE.BackSide) { m.visible = false; return; } if (m.geometry && m.geometry.type === 'TorusGeometry') return; m.material = glass; m.renderOrder = 2; });
  if (!root.userData.__liq) { const L = new THREE.Mesh(new THREE.CylinderGeometry(ud.R * .9, ud.R * .82, 1, 24), dark); L.userData.noOutline = true; root.add(L); root.userData.__liq = L; }
  const h = (ud.H - .26) * k; const L = root.userData.__liq; L.visible = true; L.scale.y = h; L.position.y = .14 + h / 2; ud.level(k); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
  const T = 12.3, L = { T, lt: 1, k: 1, t0: 12, t1: 13 }; hideAll(); BAD_.length = 0; BIRDSON = 0; DOF = 0; CAMK = 1;
  if (v === 0) { // plaza de Röstheim: mesa larga llena de tazas de café y Kannes detrás; el vecino del centro levanta su taza llena y ríe; vecinos a los lados con sus tazas
    town(L, { morning: 1 }); const p = V(0, 0, 14);
    if (!window.__covT) { const g = new THREE.Group(); scene.add(g); const wd = mat(0x8a5a32, { roughness: .6 }); box(17, .4, 3.4, mat(0xf4ead8, { roughness: .5 }), .1, g, 0, 3.8, 0); box(17.2, .2, 3.6, wd, .05, g, 0, 3.5, 0);
      for (const sx of [-8, 8, 0]) for (const sz of [-1.4, 1.4]) box(.35, 3.5, .35, wd, .05, g, sx, 1.75, sz); window.__covT = g; }
    const TBL = window.__covT; TBL.visible = true; TBL.position.set(p.x, 0, p.z - 4.2);
    // mesa: billetes | café | billetes | café (en los huecos entre los personajes)
    const CB = [...cashBundles(28)]; CB.forEach(b => b.visible = false); CB.forEach(b => b.scale.setScalar(1.25)); cashPile(CB, p.x - 6.4, 4, p.z - 4.2, .15); cashPile(CB, p.x + 2.4, 4, p.z - 4.2, -.2); cashPile(CB, p.x - 6, 0, p.z + 4, .4); cashPile(CB, p.x + 6.2, 0, p.z + 3.6, -.3);
    let ci = 4; [-2.4, 6.6].forEach(x0 => { for (let k = 0; k < 6; k++) { const t = CUPS[ci++]; show(t, p.x + x0 + (k % 3 - 1) * 1.25, 4, p.z - 4.8 + (k / 3 | 0) * 1.3, k * .7, .95); glassCup(t, .88); t.userData.steam(T, 0); } });
    const c = put(REN[2], p.x, 0, p.z, 0); prost(c, L, .22, { meter: true, pose: { aLx: 2.6, aLz: .5, aLe: .3 } }); const MG = mugOf(REN[2]); MG.scale.multiplyScalar(1.6); glassCup(MG, .9); MG.userData.steam(T, 0); laughF(c, T); cara(c, T, { expr: 'joy', eyes: 'happy', mouth: 'laugh', noBlink: 1 }); FACES.push(c);
    [[CR[0], -4.6, -.6, .35], [CR[1], 4.7, -.7, -.35]].forEach(([x, dx, dz, ry], i) => { put(x, p.x + dx, 0, p.z + dz, ry);
      prost(x, L, .2, { pose: { aLx: .3, aLz: i ? -.2 : .2, aLe: .3 } }); const m = mugOf(x); m.scale.multiplyScalar(1.45); glassCup(m, .88); m.userData.steam(T, 0); cara(x, T + i, { expr: 'joy', eyes: 'happy', mouth: i ? 'laugh' : 'open_smile', noBlink: 1 }); FACES.push(x); });
    cam([p.x, 9.6, p.z + 22], [p.x, 4.2, p.z - 2.5], 50); billRain(V(p.x, 0, p.z - 7), T, 10, 18, 4, 16, 7);
    finishCover();
    strokeTxt('IN DIESER STADT', W / 2, H * .205, 96, 'Lucky', ['#ffffff', '#ffe2b8'], '#2a1408', 26);
    strokeTxt('MACHT DICH KAFFEE', W / 2 - 55, H * .255, 92, 'Lucky', ['#ffffff', '#ffe2b8'], '#2a1408', 24); { octx.save(); octx.font = '92px Lucky'; const tw = Math.min(octx.measureText('MACHT DICH KAFFEE').width, W * .88); octx.font = '104px "Noto Color Emoji"'; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.shadowColor = 'rgba(0,0,0,.5)'; octx.shadowBlur = 18; octx.fillText('☕', W / 2 - 55 + tw / 2 + 70, H * .25); octx.restore(); }
    strokeTxt('REICH!', W / 2, H * .325, 170, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 32, -.03);
    const hq = proj(wpos(MG).add(V(0, .9, 0))); bigArrow(W * .9, H * .4, hq[0] + 62, hq[1] - 18, -40, '#ff1a2e');
    priceTag(W * .5, H * .8, 1.15, -.03, '1 TASSE', '= 12 €'); sparkle(W * .12, H * .2, 26); sparkle(W * .88, H * .24, 22);
  } else { // la cocina de Oma: Oma Gerda con corona de oro y su Kanne de flores, rodeada de billetes; yo (Noah) al lado sin un céntimo, con 0 €
    kuecheS(L); OK.CUPS[1].visible = false; OK.CUPS[2].visible = false; const o = omaSeat(oma, L, -3); drink(o, L, T - 2, .3, { sit: true, pose: { ...SITP, aLx: 2.2, aLz: .5, aLe: .5 }, meter: true, after: 'joy', afterMouth: 'open_smile' }); meterOf(o).userData.set('8 Tassen', '800 €', '#ffd23f'); const OM = mugOf(oma); OM.scale.multiplyScalar(1.3); OM.userData.level(.85); OM.userData.steam(T, 0);
    const h0 = hp(o); show(CROWNS[0], h0.x, h0.y + 1.25, h0.z, .2, .95); show(OKAN, TB.x - 5.4, 4.3, -2.4, .4, 1); OKAN.userData.steam(T, 1);
    const n = put(ich, TB.x + .8, 0, -5.6, -.2); actuar(n, 0, [[0, { aLx: 1.0, aLz: -.3, aLe: 1.3, aRx: 1.0, aRz: .3, aRe: 1.3, headX: .1 }]], { T }); cara(n, T, { expr: 'sad', eyes: 'worried', mouth: 'wavy', noBlink: 1 }); meterOf(n).userData.set('0 Tassen', '0 €', '#ff4a4a');
    
    billRain(V(TB.x - 1, 0, -9), T, 6, 12, 2, 14, 4); { const f = CUPS[0]; show(f, TB.x - 1.6, 4.3, -2.4, .4, .85); f.userData.level(.9); f.userData.steam(T, 0); const e = CUPS[1]; show(e, TB.x + 2.4, 4.3, -1.6, -.3, .75); e.userData.level(0);
      for (let k = 0; k < 10; k++) { const bb = BILL[100 - k]; bb.visible = true; bb.position.set(TB.x - 3.2 + Math.sin(k * 2.1) * .3, 4.35 + k * .06, -2.4 + Math.cos(k * 1.3) * .2); bb.rotation.set(-PI / 2, 0, k * .7); } } FACES.push(o); FACES.push(n); cam([TB.x - 1.1, 8.2, 8.4], [TB.x - 1.1, 5.6, -4.6], 50); clearFaces(); sh(V(TB.x, 0, -2), 18); FILL.intensity = 40;
    finishCover();
    strokeTxt('IN DIESER STADT', W / 2, H * .17, 96, 'Lilita', ['#ffffff', '#ffe2b8'], '#2a1408', 22);
    strokeTxt('MACHT KAFFEE REICH…', W / 2, H * .225, 92, 'Lilita', ['#ffffff', '#ffe2b8'], '#2a1408', 22);
    strokeTxt('NUR MICH NICHT!', W / 2, H * .30, 132, 'Lucky', ['#ff7a7a', '#e0001a'], '#2a0008', 30, -.03);
    const oh = proj(hp(o).add(V(0, 2.4, 0))), nh = proj(hp(n).add(V(0, .7, 0)));
    priceTag(W * .27, H * .76, 1, -.06, 'OMA', '1 BIO. €'); priceTag(W * .73, H * .76, 1, .05, 'ICH', '0 €', '#ff4a4a');
    arrowTo(W * .27, H * .71, oh[0], oh[1] + 120, '#ffd23f'); arrowTo(W * .73, H * .71, nh[0] + 20, nh[1] + 140, '#ff3a4a');
     sparkle(W * .88, H * .38, 30); sparkle(W * .12, H * .3, 22); } };

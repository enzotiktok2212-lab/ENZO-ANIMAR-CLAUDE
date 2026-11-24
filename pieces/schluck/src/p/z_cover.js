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
function beerRain(c, T, n = 60, sx = 22, sz = 10, h = 18) { DROPS.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 31 + 9); d.visible = true; d.position.set(c.x + (r() - .5) * sx, c.y + r() * h, c.z + (r() - .5) * sz); const s = .06 + r() * .08; d.scale.set(s, s * (1.8 + r() * 1.2), s); }); }
// 1: el Biergarten de Brauheim: Felix en el centro con el goldener Krug en alto y su Bierzähler en «500 Bier»; lluvia de billetes y monedas; vecinos brindando alrededor.
// 2: dentro del Bierzelt: Frau Huber de pie en el banco bebiendo su Maß; todos brindan y caen billetes; «1 BIER = 20 €».
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; const T = 20.3, L = { T, lt: 1, k: 1, t0: 20, t1: 21 }; hideAll(); BAD_.length = 0; BIRDSON = 0; DOF = 0;
  if (v === 0) { town(L); const p = V(0, 0, 30);
    const f = put(felix, p.x, 0, p.z, 0); prost(f, L, 1, { kind: 'gold', pose: { aLx: .9, aLz: .35, aLe: 1.9, headX: -.08 } }); GK2.userData.fill(1); GK2.userData.setGlow(.9); GK2.userData.setLid(-1.9); GK2.rotation.x -= .45; GK2.userData.foam.scale.setScalar(1.35); cara(f, T, { expr: 'joy', eyes: 'happy', mouth: 'laugh', noBlink: 1 }); meterOf(f).userData.set('500 Bier', '1 Trillion €', '#ffd23f');
    [[CR[0], -5.2, -2.5], [CR[1], 5.4, -2.8], [CR[2], -8.5, -7], [CR[3], 8.6, -7.4], [CR[5], -3.5, -10], [CR[6], 3.6, -10.5]].forEach(([c, dx, dz], i) => { const x = p.x + dx, z = p.z + dz; put(c, x, 0, z, Math.atan2(p.x - x, p.z + 6 - z) * .6); prost(c, L, i % 2 ? .95 : .7, { level: .95, pose: { aLx: i % 2 ? 2.4 : .6, aLz: .5, aLe: i % 2 ? .3 : 1.2 } }); cara(c, T + i, { expr: 'joy', eyes: 'happy', mouth: i % 2 ? 'laugh' : 'open_smile', noBlink: 1 }); });
    cam([p.x + .15, 3.6, p.z + 18], [p.x + .15, 3.4, p.z], 50); billRain(V(p.x, 0, p.z + 2), T, 64, 20, 10, 17, 0); coins(V(p.x, 10, p.z + 2), T - .6, T, 18); beerRain(V(p.x, 1, p.z + 3), T, 70, 20, 8, 17); clearFaces(); { const fh = proj(hp(f).add(V(0, .6, 0))); const ft = proj(V(p.x, -.2, p.z)), gk = proj(wpos(GK2)); [...DROPS, ...BILL].forEach(d => { if (!d.visible) return; const q = proj(d.position); const inBody = Math.abs(q[0] - fh[0]) < 230 && q[1] > fh[1] - 170 && q[1] < ft[1] + 40; const inKrug = Math.hypot(q[0] - gk[0], q[1] - gk[1]) < 150; if ((inBody || inKrug) && q[2] < 1 && d !== DROPS[60] && d !== DROPS[61] && d !== DROPS[62] && d !== DROPS[63] && d !== DROPS[64]) d.visible = false; }); const kp = wpos(GK2).add(V(0, 1.25, 0)); foamOver(kp, T, 30, .85, 1.2); for (let i = 0; i < 5; i++) { const d = DROPS[60 + i]; d.visible = true; const a = -1.2 + i * .5; d.position.copy(kp).add(V(Math.sin(a) * .7, -.5 - i % 3 * .45, Math.cos(a) * .7)); d.scale.set(.13, .45, .13); } } sh(V(p.x, 0, p.z - 3), 26); hemi.intensity = 1.15;
    finishCover();
    const top = proj(V(p.x, 10.2, p.z)), bot = proj(V(p.x, -.1, p.z)), sl = proj(V(p.x - 2.6, 4, p.z)), sr = proj(V(p.x + 2.6, 4, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * .2, 96, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 26);
    strokeTxt('BRINGT JEDES BIER', W / 2, H * .248, 90, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 24);
    strokeTxt('GELD!', W / 2, H * .31, 150, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 30, -.03);
    const hd = proj(hp(f).add(V(-.75, .65, 0))); bigArrow(W * .1, H * .6, hd[0] - 40, hd[1] + 10, 70);
    strokeTxt('500 BIER = TRILLIONÄR?', W / 2, H * .79, 92, 'Lucky', ['#9aff9a', '#1ab84a'], '#04300e', 24, -.02);
    sparkle(W * .1, H * .19, 28); sparkle(W * .9, H * .26, 24); sparkle(W * .86, H * .66, 20);
  } else { zelt(L); const p = V(BZX, 2.6, -22.3);
    const h = put(huber, p.x, p.y, p.z, 0); prost(h, L, 1, { meter: true, pose: { aLx: 2.5, aLz: .55, aLe: .3 } }); cara(h, T, { expr: 'joy', eyes: 'happy', mouth: 'laugh', noBlink: 1 }); meterOf(h).userData.set('47 Bier', '1,9 Mio. €', '#ffd23f'); h.root.rotation.y = .2;
    ztFolk(L, 0, 1, -1, 4, 'prost', 0); ztFolk(L, 0, 0, -1, 4, 'sitprost', 4); ztFolk(L, 0, 2, -1, 4, 'sitprost', 8); ztFolk(L, 1, 0, -1, 3, 'sitprost', 12); ztFolk(L, 1, 2, -1, 3, 'sitprost', 15); while (POST.length) POST.shift()();
    orbit(V(p.x, 9.6, p.z), 14, -.15, -.06, 52); billRain(V(p.x, 2, p.z), T, 40, 26, 14, 18, 5); FACES.push(h); clearFaces(); sh(V(p.x, 0, p.z), 40); FILL.intensity = 40;
    finishCover();
    strokeTxt('IN DIESER STADT', W / 2, H * .2, 92, 'Lilita', ['#ffffff', '#ffe2b8'], '#14143a', 22);
    strokeTxt('WIRST DU REICH', W / 2, H * .248, 92, 'Lilita', ['#ffffff', '#ffe2b8'], '#14143a', 22);
    strokeTxt('VOM BIERTRINKEN', W / 2, H * .31, 112, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 28, -.02);
    strokeTxt('1 BIER = 20 €', W / 2, H * .79, 120, 'Lucky', ['#9aff9a', '#1ab84a'], '#04300e', 28, -.02);
    sparkle(W * .9, H * .36, 30); sparkle(W * .1, H * .37, 22); } };

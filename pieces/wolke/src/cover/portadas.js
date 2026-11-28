// ---------- portadas (fuera del vídeo; python3 armar_cover.py && node cover.mjs) ----------
// 1 «cielo»: mi hermano arriba sobre la nube melocotón gigante gritando; yo abajo subiendo la escalera de nubecitas con el vape; el pueblo en fiesta abajo. Texto en medio.
// 2 «kleinste Wolke»: yo en el centro de la plaza con mi nubecita (círculo rojo); a mi alrededor todos echan nubes enormes y se ríen. Texto en medio.
function coverWord(c, t, x, y, size, font, fill, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, (o.maxW || W * .9) / tw); c.scale(k, k);
  c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 28; c.shadowOffsetY = 12; c.lineWidth = o.lw || 20; c.strokeStyle = o.stroke || '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size * .8, 0, 0); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function redCircle(c, x, y, rx, ry) { c.save(); c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 16; c.shadowOffsetY = 6;
  for (const [lw, col] of [[30, '#ffffff'], [20, '#ff1a1a']]) { c.lineWidth = lw; c.strokeStyle = col; c.beginPath();
    for (let i = 0; i <= 120; i++) { const a = -1.9 + i / 120 * (6.283 + .5), w = 1 + Math.sin(a * 3 + 1) * .03 + (i > 100 ? (i - 100) * .004 : 0); const px = x + Math.cos(a) * rx * w, py = y + Math.sin(a) * ry * w; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
  c.restore(); }
function coverShot(build) { COVER = { cam() {} }; const s = { t0: 50, t1: 51, tr: null, zoom: null, fn: build, sfx: [] }; S.push(s); FX2D.length = 0; renderShot(S.length - 1, 50.5, null, 0); S.pop(); COVER = null;
  octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H); octx.restore(); for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); }
function vign(c, k = .6) { const g = c.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${k})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); const c = octx;
  if (v === 0) {
    coverShot(L => { stadt(L, 'dusk'); stairs(6, L); const L2 = { ...L, T: 50.5 };
      broCloud(L2, 30, { z: -4, x: 0 }); BIG.scale.setScalar(.75); BIG.position.y = 27.6; bro.root.position.set(0, 31.4, -2.6); toCam(bro);
      const s5 = stepPos(4); put(ich, s5.x, s5.y + .8, s5.z, 0); toCam(ich); actuar(ich, 0, [[0, { aLx: 2.8, aLz: .3, aLe: .2, ...armVape(.1) }]], { T: L.T }); const v = VP.get(ich); v.visible = true; v.userData.grip.visible = true; v.userData.setGlow(1); ich.aR.sh.rotation.y = armVape(.1).aRy;
      cara(ich, L.T, { expr: 'determined', mouth: 'o' }); ich.blob.visible = false; FACES.push(ich);
      SMK.tint.set(0xffc8a8); SMK.haze(V(0, 28, -6), 50.5, 26, 10, 3, 6, 4, .45, 3); SMK.tint.set(0xffffff);
      peachRain(V(0, 20, -4), 49.6, 50.5, 16, { h: 16, spread: 10, y0: -50 });
      const m = (hp(bro).y + hp(ich).y) / 2; cam([4, m - 2, 34], [0, m - .5, -4], 54); SHC = V(0, 0, -4); grade.uniforms.sat.value = 1.5; });
    coverWord(c, 'IN DIESER STADT', W / 2, 880, 86, 'Lilita', '#ffffff', { lw: 18, stroke: '#0a0e1e' });
    coverWord(c, 'BEKOMMT JEDER', W / 2, 1000, 96, 'Lucky', ['#ffffff', '#dfe8ff'], { lw: 22, stroke: '#0a0e1e', rot: -.02 });
    coverWord(c, 'EINE VAPE!', W / 2, 1150, 150, 'Lucky', ['#ffd8b0', '#ff7a5a'], { lw: 30, stroke: '#3a0a00', rot: -.02 });
    vign(c, .55);
  } else { let HC;
    coverShot(L => { stadt(L, 'noon'); put(ich, 0, 0, 40, 0); vaper(ich, L, 49.2, .3, { expr: 'sad', size: .3, n: 10, pow: 1.4, after: 'flat', dirUp: .6 }); cara(ich, L.T, { expr: 'sad', mouth: 'wavy', eyes: 'worried' });
      [EXS[24], EXS[25], EXS[26], EXS[27], EXS[28], EXS[30]].forEach((c2, i) => { const a = (i - 2.5) * .5, x = Math.sin(a) * 7.2, z = 40 - Math.cos(a) * 4.4 - 1; put(c2, x, 0, z, 0); toCam(c2); vaper(c2, L, 48.9 + i * .05, .4, { expr: 'joy', size: 2.6, pow: 9, n: 70, up: 1.6, dirUp: 1.6, bg: true }); laughF(c2, 50.5 + i); });
      cam([0, 6.4, 58], [0, 7.8, 38], 50); SHC = V(0, 0, 40); HC = hp(ich); grade.uniforms.sat.value = 1.5; });
    const [x, y] = proj(HC.clone().add(V(0, -.1, 0)));
    coverWord(c, 'MEINE WOLKE IST', W / 2, 560, 92, 'Lilita', '#ffffff', { lw: 18, stroke: '#0a0e1e' });
    coverWord(c, 'DIE KLEINSTE', W / 2, 720, 150, 'Lucky', ['#d8f4ff', '#7ac8ff'], { lw: 28, stroke: '#0a1e3a', rot: -.02 });
    coverWord(c, 'DER STADT', W / 2, 850, 110, 'Lucky', ['#ffffff', '#dfe8ff'], { lw: 22, stroke: '#0a0e1e', rot: -.02 });
    redCircle(c, x, y, 150, 200); vign(c, .55);
  } };

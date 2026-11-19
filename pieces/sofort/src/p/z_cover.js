// ---------- portadas (fuera del vídeo) ----------
function coverTxt(l1, l2, y0 = .255) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * y0, 104, '#ffffff'], [l2, H * (y0 + .06), 92, '#E2FD07']]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .84 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => {
  const i = v === 0 ? 0 : S.findIndex(s => s.t0 === tw('Vier', 2)), T = S[i].t0 + (v === 0 ? 1.2 : .6);
  if (v === 0) COVER = { cam: () => cam([DT0 + 1, 8.5, -16], [DT0, 13, -40], 50) };
  else COVER = { cam: () => cam([TRX + 1, 5.2, 22], [TRX + 1, 3.2, 2], 44) };
  const f0 = S[i].fn; if (v === 1) S[i].fn = L => { f0(L); const c = hover(ich, TRX + 1, 3.2, -1, 0, L.T, { pose: { ...CROSS } }); smug(c, L.T); };
  renderShot(i, T, null, 0); COVER = null; S[i].fn = f0;
  octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  if (v === 0) coverTxt('IN DIESER STADT', 'BIN ICH DER SUPERSCHURKE', .6); else coverTxt('VIER HELDEN.', 'VIER HAUFEN STAUB.', .55); };

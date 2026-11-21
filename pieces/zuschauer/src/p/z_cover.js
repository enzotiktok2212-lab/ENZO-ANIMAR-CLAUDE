// ---------- portadas (fuera del vídeo): v0 el pueblo mirándote delante de la Tafel; v1 la Tafel con «DU 0:29» y el pulgar gigante encima ----------
function coverTxt(l1, l2, y0) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz] of [[l1, H * y0, 118], [l2, H * (y0 + .072), 132]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .86 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 22; c.shadowOffsetY = 8; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(t, 0, 0); c.restore(); }
  c.restore(); }
// coverAt: renderiza el instante T del vídeo sin subtítulo; con fn, sustituye el plano por una composición propia
window.coverAt = (T, l1, l2, y0, fn) => { const s = S[shotAt(T)], o = [s.fn, s.alt, s.zoom]; if (fn) { s.fn = fn; s.alt = null; s.zoom = null; }
  NOCAP = 1; renderAt(T); NOCAP = 0; [s.fn, s.alt, s.zoom] = o; if (l1) coverTxt(l1, l2, y0); };
const CV = window.CV = { y: 25, d: 56, fov: 68, dx: 0, th: [TX + 1, 43, TZ - 8], txt: .15 };
window.renderCover = v => v === 0 ? coverAt(8.3, 'SIE ALLE', 'SCHAUEN DIR ZU', .14)
  : coverAt(61.0, 'NIEMAND BLEIBT', 'SO LANGE WIE DU', CV.txt, L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.3; hemi.intensity = .9;
    crowdTafel(L, 'point', 42, { max: 29 }); daumenAt(...CV.th, L.T, { rx: -.35 }); cm([TX + CV.dx, 4, TZ + CV.d, TX, CV.y, TZ, CV.fov], [TX + CV.dx, 4, TZ + CV.d, TX, CV.y, TZ, CV.fov], 0); sh(V(TX, 0, TZ), 40); });

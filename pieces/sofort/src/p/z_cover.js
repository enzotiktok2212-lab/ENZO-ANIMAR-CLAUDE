// ---------- portadas (fuera del vídeo) ----------
function coverTxt(l1, l2, y0 = .255) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * y0, 104, '#ffffff'], [l2, H * (y0 + .06), 92, '#E2FD07']]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .84 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }

// fachadas detalladas, tejados y luz para la portada 1
const COVX = { done: 0, g: null, lights: [] };
function facadeTex(base, dark, seed, lit) { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 384; const c = cv.getContext('2d'), r = RNG(seed);
  c.fillStyle = lit ? '#000' : base; c.fillRect(0, 0, 256, 384);
  for (let fy = 0; fy < 6; fy++) { const y = fy * 64; if (!lit) { c.fillStyle = dark; c.fillRect(0, y + 56, 256, 8); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(0, y + 54, 256, 2); }
    for (let fx = 0; fx < 4; fx++) { const x = fx * 64 + 10, on = r() > .45, warm = r() > .35;
      if (lit) { if (on) { c.fillStyle = warm ? '#ffcf7a' : '#9ad8ff'; c.fillRect(x + 4, y + 10, 36, 36); } continue; }
      c.fillStyle = dark; c.fillRect(x, y + 6, 44, 44); c.fillStyle = on ? (warm ? '#ffe2a0' : '#bfe6ff') : '#2a3450'; c.fillRect(x + 4, y + 10, 36, 36);
      c.fillStyle = dark; c.fillRect(x + 20, y + 10, 4, 36); c.fillRect(x + 4, y + 26, 36, 3);
      if (on && r() > .5) { c.fillStyle = ['#e8586a', '#5a8ae8', '#e8b84a', '#6ac88a'][Math.floor(r() * 4)]; c.fillRect(x + 4, y + 10, 10, 36); }
      if (r() > .7) { c.fillStyle = '#d8dce4'; c.fillRect(x - 2, y + 48, 48, 5); c.fillStyle = '#5a6070'; for (let k = 0; k < 6; k++) c.fillRect(x + k * 8, y + 40, 2, 9); } } }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = lit ? THREE.NoColorSpace : THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function coverCity() { if (COVX.done) return; COVX.done = 1; const cols = [['#7fd4ff', '#2a6a9a'], ['#ffd8a8', '#9a6a3a'], ['#c8b8ff', '#5a4a9a'], ['#a8f0d8', '#2a8a6a'], ['#ffb8c8', '#9a3a5a'], ['#e8e8f0', '#5a5e6a']];
  DT.towers.forEach((m, j) => { const i = j >> 1, sd = j & 1, w = 26 + (i % 3) * 4, h = 60 + ((i * 37 + (sd ? 19 : 0)) % 90), [a, b] = cols[(i * 2 + sd) % 6];
    m.userData.orig = { map: m.map, em: m.emissive.getHex(), ei: m.emissiveIntensity, emap: m.emissiveMap, rough: m.roughness };
    const t = facadeTex(a, b, j + 3, 0), e = facadeTex(a, b, j + 3, 1); for (const x of [t, e]) x.repeat.set(w / 14, h / 16);
    m.userData.cov = { map: t, emap: e }; });
  DT.g.traverse(o => { if (!o.isMesh || !o.material.map || !o.material.emissive || Math.abs(o.position.z + 400) > 1 || DT.towers.includes(o.material)) return; o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox, pr = { height: (bb.max.y - bb.min.y) * o.scale.y }; if (pr.height < 100) return;
    const m = o.material.clone(); o.material = m; const j = DT.towers.length; m.userData.orig = { map: m.map, em: m.emissive.getHex(), ei: m.emissiveIntensity, emap: m.emissiveMap, rough: m.roughness };
    const t = facadeTex('#9ab8d8', '#3a5a88', j + 3, 0), e = facadeTex('#9ab8d8', '#3a5a88', j + 3, 1); for (const x of [t, e]) x.repeat.set(26 / 14, pr.height / 16); m.userData.cov = { map: t, emap: e }; DT.towers.push(m); });
  const g = new THREE.Group(); DT.g.add(g); COVX.g = g; const r = RNG(77);
  for (let i = 0; i < 18; i++) for (const sd of [-1, 1]) { const z = -320 + i * 38 + (sd > 0 ? 14 : 0), h = 60 + ((i * 37 + (sd > 0 ? 19 : 0)) % 90), w = 26 + (i % 3) * 4, x = sd * (24 + w / 2);
    if (z < -300 || z > 40) continue;
    for (let k = 0; k < 3; k++) box(3 + r() * 3, 2 + r() * 2, 3 + r() * 3, mat(0xb8bcc8, { metalness: .5, roughness: .4 }), .1, g, x + (r() - .5) * w * .6, h + 1.5, z + (r() - .5) * 18);
    cyl(.25, .25, 10 + r() * 10, mat(0xd8d8e0, { metalness: .7 }), 6, g, x - sd * w * .2, h + 6, z);
    sphere(.6, mat(0xff3030, { emissive: 0xff2020, emissiveIntensity: 3 }), g, x - sd * w * .2, h + 12 + r() * 6, z, 8, 6);
    for (let y = 8; y < h - 4; y += 12) box(.6, .6, 30.2, mat(0xf0f2f8, { roughness: .5 }), 0, g, x - sd * (w / 2 + .05), y, z);
    if (i % 3 === 1) { const cv = document.createElement('canvas'); cv.width = 512; cv.height = 160; const c = cv.getContext('2d'); c.fillStyle = '#12142a'; c.fillRect(0, 0, 512, 160); c.strokeStyle = ['#ff4aa8', '#4ad8ff', '#ffd23f'][i % 3]; c.lineWidth = 12; c.strokeRect(8, 8, 496, 144);
      c.font = `700 76px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = c.strokeStyle; c.fillText(['HOTEL', 'KINO', 'BANK', 'NEWS', 'PIZZA', 'MODE'][i % 6], 256, 84);
      const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; const bm = new THREE.Mesh(new THREE.PlaneGeometry(14, 4.4), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false }));
      bm.position.set(x - sd * (w / 2 + .5), h * .55, z + 4); bm.rotation.y = -sd * Math.PI / 2; g.add(bm); } }
  const key = new THREE.SpotLight(0xfff0dc, 2200, 120, .22, .6, 1.6); key.position.set(DTX + 10, 14, -12); key.target.position.set(DTX, 13, -40); scene.add(key, key.target);
  const rimL = new THREE.PointLight(0xc070ff, 160, 10, 2); rimL.position.set(DTX - 3, 16, -45); scene.add(rimL); COVX.lights = [key, rimL]; }
function coverOn(on) { if (!COVX.done) return; COVX.g.visible = on; COVX.lights.forEach(l => l.visible = on);
  for (const m of DT.towers) { const o = on ? m.userData.cov : null, g = m.userData.orig; m.map = on ? o.map : g.map; m.emissiveMap = on ? o.emap : g.emap; m.emissive.setHex(on ? 0xffffff : g.em); m.emissiveIntensity = on ? .9 : g.ei; m.roughness = on ? .55 : g.rough; m.needsUpdate = true; } }
window.renderCover = v => {
  coverCity(); coverOn(v === 0);
  const i = v === 0 ? 0 : S.findIndex(s => s.t0 === tw('Vier', 2)), T = S[i].t0 + (v === 0 ? 1.2 : .6);
  if (v === 0) COVER = { cam: () => cam([DT0 + 1, 8.5, -16], [DT0, 13, -40], 50) };
  else COVER = { cam: () => cam([TRX + 1, 5.2, 22], [TRX + 1, 3.2, 2], 44) };
  const f0 = S[i].fn; if (v === 1) S[i].fn = L => { f0(L); const c = hover(ich, TRX + 1, 3.2, -1, 0, L.T, { pose: { ...CROSS } }); smug(c, L.T); };
  renderShot(i, T, null, 0); COVER = null; S[i].fn = f0; coverOn(false);
  octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  if (v === 0) coverTxt('IN DIESER STADT', 'BIN ICH DER SUPERSCHURKE', .6); else coverTxt('VIER HELDEN.', 'VIER HAUFEN STAUB.', .55); };

// =====================================================================
//  SETS and CAST — backgrounds in world coords (1080x1920) and the characters' specs.
//  Floors meet the wall at FLOOR; characters stand with their feet near FEET (centred, x = 540).
// =====================================================================
const FLOOR = 1130, FEET = 1330;
// ---- cast
const LEO_AGE = { 0: 'small', 5: 'small', 7: 'small', 9: 'kid', 12: 'kid', 16: 'teen', 20: 'adult', 30: 'adult' };
const LEO_S = { 5: 0.92, 7: 1.0, 9: 1.02, 12: 1.1, 16: 1.0, 20: 1.0, 30: 1.02 };
const LEO = (age, o = {}) => ({ age: LEO_AGE[age], skin: CB.skin.tan, hair: { style: 'messy', color: CB.hair.brown }, top: { type: 'hoodie', color: CB.coral },
  pants: '#3b5f9e', shoes: '#f4f1ec', key: 'leo' + age, beard: age >= 30 ? '#5a3a28' : null, ...o });
const PAI = (o = {}) => ({ age: 'adult', skin: CB.skin.tan, hair: { style: 'short', color: CB.hair.black }, beard: CB.hair.black, glasses: true,
  top: { type: 'sweater', color: '#d8322c' }, pants: '#2f3e55', shoes: '#4a3428', key: 'pai', ...o });
const VOVO = (o = {}) => PAI({ hair: { style: 'short', color: CB.hair.grey }, beard: CB.hair.grey, key: 'vovo', ...o });
const MAE = (o = {}) => ({ age: 'adult', skin: CB.skin.dark, hair: { style: 'curly', color: CB.hair.black }, top: { type: 'dress', color: '#f2b632' }, key: 'mae', ...o });
const ESPOSA = (o = {}) => ({ age: 'adult', skin: CB.skin.light, hair: { style: 'bun', color: CB.hair.auburn }, top: { type: 'gown', color: '#bfe8cf' }, key: 'esp', ...o });
const NURSE = (o = {}) => ({ age: 'adult', skin: CB.skin.brown, hair: { style: 'bun', color: CB.hair.black }, top: { type: 'shirt', color: '#7cc6d9' }, pants: '#7cc6d9', shoes: '#ffffff', key: 'nurse', ...o });
const KIDS = [
  { skin: CB.skin.light, hair: { style: 'long', color: CB.hair.blond }, top: { type: 'shirt', color: '#7cc6d9' }, key: 'k1' },
  { skin: CB.skin.dark, hair: { style: 'short', color: CB.hair.black }, top: { type: 'shirt', color: '#9be37a' }, key: 'k2' },
  { skin: CB.skin.brown, hair: { style: 'bun', color: CB.hair.black }, top: { type: 'shirt', color: '#ffb4c8' }, key: 'k3' },
  { skin: CB.skin.light, hair: { style: 'messy', color: CB.hair.auburn }, top: { type: 'shirt', color: '#ffd23f' }, key: 'k4' },
  { skin: CB.skin.tan, hair: { style: 'long', color: CB.hair.black }, top: { type: 'shirt', color: '#b89cff' }, key: 'k5' },
];
const KID = (i, o = {}) => ({ age: 'small', pants: '#4a5f8e', ...KIDS[i % KIDS.length], ...o, key: KIDS[i % KIDS.length].key + (o.key || '') });

// ---- motion helpers (lt = local time inside the action)
const hop = (lt, f = 2, a = 30) => -Math.abs(Math.sin(lt * f * Math.PI)) * a;
const slideX = (lt, t0, d, a, b) => lerp(a, b, EZ.back(clamp((lt - t0) / d)));
const easeIn = (lt, t0, d) => EZ.o3(clamp((lt - t0) / d));

// ---- sets
function setHospital(o = {}) {
  cbRoom('#cdeee2', '#e7dccd', FLOOR, { pattern: 'tiles', tileFrom: 640, floorPattern: 'boards' });
  cbWindow(640, 250, 340, 320, (x, y, w, h) => { cbClouds(x, y, w, h, 'hc'); cbIpe(x + w * 0.5, y + h + 130, 0.7, { key: 'h' }); });
  cbRays(600, 260, 400, 1100, -0.5, 0.14);
  if (o.monitor !== false) cbMonitor(80, 330);
  if (o.door) { cbShape(cbP.rr(70, 520, 300, 620, 12), '#f7f2ea', { bb: [520, 1140], shade: 8 }); cbShape(cbP.rr(100, 560, 240, 560, 8), '#9fc7e6', { bb: [560, 1120], shade: 10 }); cbShape(cbP.ell(310, 860, 14, 14), CB.yellow, { flat: true, shade: 0, lw: 4 }); }
  cbLightWash(820, 400);
}
function setNursery(o = {}) {
  cbRoom('#d8ecf7', '#efe4d4', FLOOR - 120, { pattern: 'dots', floorPattern: 'boards' });
  cbWindow(380, 220, 320, 280, (x, y, w, h) => { cbClouds(x, y, w, h, 'nc'); cbIpe(x + w * 0.5, y + h + 130, 0.65, { key: 'n' }); });
  if (o.flag === 'br') cbFlagBR(150, 320, 1); if (o.flag === 'brb') cbBunting(-20, 200, W + 40, 'br');
  cbLightWash(540, 300);
}
function setHome(o = {}) {
  cbRoom('#ffe3cf', '#c99b72', FLOOR, { pattern: 'dots', floorPattern: 'boards' });
  cbWindow(620, 260, 340, 300, (x, y, w, h) => { cbShape(cbP.ell(x + w * 0.75, y + h * 0.3, 50, 50), '#ffe25e', { flat: true, shade: 0, line: false }); cbClouds(x, y, w, h, 'ho'); });
  cbShape(cbP.rr(110, 330, 170, 130, 8), '#8a6143', { bb: [330, 460], shade: 5 }); cbShape(cbP.rr(126, 346, 138, 98, 4), '#9fe3cf', { flat: true, shade: 0, lw: 3 });   // picture
  cbShape(cbP.ell(540, 1380, 420, 90), '#7fb6a4', { bb: [1300, 1470], shade: 8 });   // rug
  cbLightWash(800, 400);
}
function setClass(o = {}) {
  cbRoom('#f6e6c8', '#c9a27a', FLOOR, { pattern: 'stripes', floorPattern: 'boards' });
  cbShape(cbP.rr(150, 330, 780, 380, 18), '#8a6143', { bb: [330, 710], shade: 10 });
  cbShape(cbP.rr(176, 356, 728, 328, 10), '#2f5d4a', { bb: [356, 684], shade: 0 });
  ctx.save(); ctx.globalAlpha = 0.75;
  if (o.board === 'zodiac') { for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; cbLine([[540 + Math.cos(a) * 70, 520 + Math.sin(a) * 70], [540 + Math.cos(a) * 120, 520 + Math.sin(a) * 120]], { w: 5, c: '#f4f1e6' }); } }
  else { cbLine([[260, 470], [330, 420], [400, 470]], { w: 6, c: '#f4f1e6', curve: true }); cbStar(540, 470, 30, '#f4f1e6'); cbLine([[660, 520], [820, 420]], { w: 6, c: '#f4f1e6' }); }
  ctx.restore();
  cbShape(cbP.rr(150, 710, 780, 24, 8), '#a57a55', { bb: [710, 734], shade: 4 });
  cbShape(cbP.ell(940, 260, 50, 50), '#ffffff', { bb: [210, 310], shade: 5 }); cbLine([[940, 260], [940, 228]], { w: 5 }); cbLine([[940, 260], [962, 270]], { w: 5 });   // clock
  cbLightWash(150, 300);
}
function setDesks(y = FEET - 40) {
  for (const dx of [60, 640]) { cbShape(cbP.rr(dx, y, 380, 40, 10), '#d79b5f', { bb: [y, y + 40], shade: 6 }); for (const lx of [dx + 30, dx + 330]) cbShape(cbP.rr(lx, y + 40, 20, 160, 6), '#8a6143', { flat: true, shade: 0, lw: 4 }); }
}
function setOutside(o = {}) {   // sky + grass, sunny or grey
  const grey = o.grey, g = ctx.createLinearGradient(0, 0, 0, FLOOR);
  g.addColorStop(0, grey ? '#9aa7b4' : '#7fd0ff'); g.addColorStop(1, grey ? '#c9d0d6' : '#d6f2ff'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, FLOOR + 200);
  if (!grey) cbShape(cbP.ell(860, 300, 80, 80), '#ffe25e', { bb: [220, 380], shade: 8, rim: false });
  cbClouds(-100, 200, W + 200, 400, grey ? 'gs' : 'ss');
  for (let i = 0; i < 6; i++) { const tx = -60 + i * 230, th = 260 + (i % 3) * 60; cbShape(cbP.ell(tx, FLOOR - th * 0.5, 140, th * 0.6), grey ? '#7f9a8a' : '#58b96c', { bb: [FLOOR - th, FLOOR], shade: 12 }); }
  const gg = ctx.createLinearGradient(0, FLOOR, 0, H); gg.addColorStop(0, grey ? '#7fa07e' : '#6cc46a'); gg.addColorStop(1, grey ? '#9cb79a' : '#8fdc7c');
  ctx.fillStyle = gg; ctx.fillRect(-200, FLOOR, W + 400, H);
  const R = RNG('grass'); ctx.strokeStyle = 'rgba(40,90,40,0.25)'; ctx.lineWidth = 4;
  for (let i = 0; i < 70; i++) { const x = R.r(0, W), y = R.r(FLOOR + 20, H); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y - 16); ctx.stroke(); }
}
function cbFence(y) { for (let x = -20; x < W + 40; x += 70) cbShape(cbP.poly([[x, y], [x + 22, y - 30], [x + 44, y], [x + 44, y + 160], [x, y + 160]]), '#fffaf2', { bb: [y - 30, y + 160], shade: 4, lw: 4 }); cbShape(cbP.rr(-40, y + 40, W + 80, 22, 4), '#fffaf2', { flat: true, shade: 0, lw: 4 }); }
function cbBunting(x, y, w, kind = 'party') {
  cbLine([[x, y], [x + w / 2, y + 50], [x + w, y]], { w: 4, curve: true });
  const cols = kind === 'br' ? ['#1f9a4a', '#ffd21f', '#2b4ea2'] : [CB.coral, CB.yellow, CB.mint, CB.pink, CB.purple];
  for (let i = 0; i < 12; i++) { const u = (i + 0.5) / 12, px = x + w * u, py = y + 4 * 50 * u * (1 - u) + Math.sin(TT * 3 + i) * 3; cbShape(cbP.poly([[px - 24, py], [px + 24, py], [px, py + 52]]), cols[i % cols.length], { flat: true, shade: 0, lw: 3.5 }); }
}
function cbBalloon(x, y, c, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbLine([[0, 70], [10, 140], [0, 210]], { w: 3, curve: true });
  cbShape(cbP.ell(0, 0, 52, 66), c, { bb: [-66, 66], shade: 12 }); cbShape(cbP.poly([[-8, 74], [8, 74], [0, 62]]), c, { flat: true, shade: 0, lw: 3 });
  ctx.restore();
}
function cbFlagUS(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbLine([[0, -20], [0, 360]], { w: 10, c: '#8a6143' });
  const wave = (u, v) => [u * 300, v * 190 + Math.sin(TT * 5 + u * 6) * 14 * u];
  ctx.save(); ctx.beginPath(); for (let i = 0; i <= 20; i++) ctx.lineTo(...wave(i / 20, 0)); for (let i = 20; i >= 0; i--) ctx.lineTo(...wave(i / 20, 1)); ctx.closePath(); ctx.clip();
  for (let r = 0; r < 7; r++) { ctx.fillStyle = r % 2 ? '#ffffff' : '#d8322c'; ctx.beginPath(); for (let i = 0; i <= 20; i++) ctx.lineTo(...wave(i / 20, r / 7)); for (let i = 20; i >= 0; i--) ctx.lineTo(...wave(i / 20, (r + 1) / 7)); ctx.fill(); }
  ctx.fillStyle = '#2b4ea2'; ctx.beginPath(); for (let i = 0; i <= 8; i++) ctx.lineTo(...wave(i / 20, 0)); for (let i = 8; i >= 0; i--) ctx.lineTo(...wave(i / 20, 4 / 7)); ctx.fill();
  ctx.fillStyle = '#fff'; for (let i = 0; i < 9; i++) { const [sx, sy] = wave(0.05 + (i % 3) * 0.12, 0.1 + Math.floor(i / 3) * 0.15); ctx.beginPath(); ctx.arc(sx, sy, 5, 0, TAU); ctx.fill(); }
  ctx.restore();
  ctx.beginPath(); for (let i = 0; i <= 20; i++) ctx.lineTo(...wave(i / 20, 0)); for (let i = 20; i >= 0; i--) ctx.lineTo(...wave(i / 20, 1)); ctx.closePath(); ctx.lineWidth = 5; ctx.strokeStyle = CB.line; ctx.stroke();
  ctx.restore();
}
function cbFlagBR(x, y, s = 1) {   // the Brazilian flag, waving
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbLine([[0, -20], [0, 360]], { w: 10, c: '#8a6143' });
  const wave = (u, v) => [u * 300, v * 200 + Math.sin(TT * 5 + u * 6) * 14 * u];
  const quad = (pts) => { ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(...wave(...q)) : ctx.moveTo(...wave(...q)))); ctx.closePath(); };
  ctx.beginPath(); for (let i = 0; i <= 20; i++) ctx.lineTo(...wave(i / 20, 0)); for (let i = 20; i >= 0; i--) ctx.lineTo(...wave(i / 20, 1)); ctx.closePath();
  ctx.fillStyle = '#1f9a4a'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = CB.line; ctx.stroke();
  quad([[0.08, 0.5], [0.5, 0.08], [0.92, 0.5], [0.5, 0.92]]); ctx.fillStyle = '#ffd21f'; ctx.fill();
  const [cx, cy] = wave(0.5, 0.5); ctx.fillStyle = '#2b4ea2'; ctx.beginPath(); ctx.arc(cx, cy, 52, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, 52, 0, TAU); ctx.clip(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(cx + 20, cy + 120, 130, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#fff'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(cx - 26 + (i * 17) % 52, cy + 14 + (i % 3) * 10, 3, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function setRadial(c1, c2, o = {}) {   // a spinning sunburst behind a reaction
  fillAll(c1); ctx.save(); ctx.translate(540, o.cy ?? 900); ctx.rotate(TT * 0.25);
  ctx.fillStyle = c2; for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 2400, i / 16 * TAU, (i + 0.5) / 16 * TAU); ctx.fill(); }
  ctx.restore(); cbGlow(540, o.cy ?? 900, 700, '#ffffff', 0.35);
}
function setCard(c) {   // a clean graphic set for fact cards
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, cbTone(c, 0.15)); g.addColorStop(1, cbTone(c, -0.1)); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  ctx.fillStyle = cbTone(c, 0.22); for (let y = -40; y < H; y += 120) for (let x = ((y / 120) % 2) * 60 - 60; x < W + 60; x += 120) { ctx.beginPath(); ctx.arc(x + Math.sin(TT + y) * 4, y, 10, 0, TAU); ctx.fill(); }
}
function setStore() {
  cbRoom('#fdf1dc', '#eae4da', FLOOR, { floorPattern: 'checker' });
  for (const sx of [40, 600]) {
    cbShape(cbP.rr(sx, 300, 440, 820, 14), '#b98a5e', { bb: [300, 1120], shade: 10 });
    for (let r = 0; r < 4; r++) { const y = 360 + r * 190; cbShape(cbP.rr(sx + 16, y + 140, 408, 20, 4), '#8a6143', { flat: true, shade: 0, lw: 4 }); }
  }
}
function storeGoods(kind) {   // shelf contents: 'party' (colourful) or 'halloween'
  for (const sx of [40, 600]) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
    const x = sx + 70 + k * 100, y = 360 + r * 190 + 100;
    if (kind === 'halloween') {
      if ((r + k) % 3 === 0) cbSkull(x, y, 0.8); else cbPumpkin(x, y, 0.85);
    } else cbShape(cbP.rr(x - 38, y - 70, 76, 108, 8), [CB.coral, CB.yellow, CB.mint, CB.pink, CB.purple][(r * 4 + k) % 5], { bb: [y - 70, y + 38], shade: 6 });
  }
}
function cbPumpkin(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbShape(cbP.multi(cbP.ell(-22, 0, 30, 40), cbP.ell(22, 0, 30, 40), cbP.ell(0, 0, 32, 42)), '#ff8a1f', { bb: [-42, 42], shade: 8, outer: true });
  cbShape(cbP.rr(-5, -56, 10, 18, 4), '#3f7a2a', { flat: true, shade: 0, lw: 3 });
  ctx.fillStyle = '#3a1d0c'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 18, -10); ctx.lineTo(sx * 6, -2); ctx.lineTo(sx * 22, 2); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-20, 14); ctx.lineTo(-8, 20); ctx.lineTo(0, 14); ctx.lineTo(8, 20); ctx.lineTo(20, 14); ctx.lineTo(0, 28); ctx.fill();
  ctx.restore();
}
function cbSkull(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbShape(cbP.multi(cbP.ell(0, -8, 38, 34), cbP.rr(-22, 14, 44, 26, 8)), '#f6f1e4', { bb: [-42, 40], shade: 6, outer: true });
  ctx.fillStyle = '#2e1f1c'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 14, -6, 9, 11, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function cbBat(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const f = Math.sin(TT * 18) * 0.5;
  for (const sx of [-1, 1]) cbShape(cbP.poly([[0, 0], [sx * 60, -30 - f * 30], [sx * 50, 0], [sx * 36, -6], [sx * 24, 8]]), '#3b2a4a', { flat: true, shade: 0, lw: 3 });
  cbShape(cbP.ell(0, 0, 16, 18), '#3b2a4a', { flat: true, shade: 0, lw: 3 });
  ctx.restore();
}
function setBedroom(o = {}) {
  cbRoom('#d9d0f5', '#a98b73', FLOOR, { pattern: 'dots', floorPattern: 'boards' });
  cbWindow(660, 250, 300, 280, (x, y, w, h) => { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#29306b'); g.addColorStop(1, '#5a4f9a'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); const R = RNG('st'); ctx.fillStyle = '#fff'; for (let i = 0; i < 20; i++) cbSparkle(R.r(x, x + w), R.r(y, y + h), 5 + 3 * Math.sin(TT * 4 + i)); cbShape(cbP.ell(x + w * 0.7, y + h * 0.3, 34, 34), '#fff4c2', { flat: true, shade: 0, line: false }); }, { frame: '#efe9ff' });
  for (const [px, py, c] of [[150, 330, CB.coral], [330, 400, CB.mint]]) { cbShape(cbP.rr(px, py, 140, 190, 6), c, { bb: [py, py + 190], shade: 6 }); cbStar(px + 70, py + 90, 30, '#fffaf0'); }
  cbGlow(880, 760, 380, '#ffe7a8', 0.35);
}
function setApartment(o = {}) {
  cbRoom('#e7d6f0', '#8f6f5a', FLOOR, { floorPattern: 'boards' });
  cbWindow(200, 230, 680, 460, (x, y, w, h) => {
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#3b3f8f'); g.addColorStop(0.6, '#c46aa0'); g.addColorStop(1, '#ffb07a'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const R = RNG('city');
    for (let i = 0; i < 9; i++) { const bx = x + i * 80 - 10, bh = R.r(140, 330); cbShape(cbP.rr(bx, y + h - bh, 74, bh + 10, 4), '#2b2a55', { flat: true, shade: 0, lw: 3 });
      for (let k = 0; k < 10; k++) { const wx = bx + 12 + (k % 3) * 20, wy = y + h - bh + 20 + Math.floor(k / 3) * 34; if (wy < y + h - 10 && (k + i + Math.floor(TT * 2)) % 4) { ctx.fillStyle = '#ffd77a'; ctx.fillRect(wx, wy, 10, 14); } } }
  }, { frame: '#f7efff' });
  cbShape(cbP.rr(820, 880, 120, 250, 30), '#4f9a6a', { bb: [880, 1130], shade: 10 });   // plant
  cbShape(cbP.rr(830, 1060, 100, 80, 14), '#c97a52', { bb: [1060, 1140], shade: 6 });
  cbGlow(540, 600, 700, '#ffb07a', 0.25);
}
function setUK() {   // a Brazilian school yard (kept the name)
  const g = ctx.createLinearGradient(0, 0, 0, FLOOR); g.addColorStop(0, '#7fd0ff'); g.addColorStop(1, '#d6f2ff'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, FLOOR + 200);
  cbShape(cbP.rr(-40, 420, W + 80, FLOOR - 400, 0), '#f6e3b4', { bb: [420, FLOOR], shade: 0 });
  cbShape(cbP.rr(-40, FLOOR - 160, W + 80, 160, 0), '#5fae6e', { flat: true, shade: 0, lw: 4 });
  for (const wx of [120, 700]) cbWindow(wx, 520, 260, 240, (x, y, w, h) => { ctx.fillStyle = '#cfe3f2'; ctx.fillRect(x, y, w, h); }, { frame: '#f4f1ea' });
  cbBunting(-20, 380, W + 40, 'br');
  const gg = ctx.createLinearGradient(0, FLOOR, 0, H); gg.addColorStop(0, '#d9cbb3'); gg.addColorStop(1, '#efe4d0'); ctx.fillStyle = gg; ctx.fillRect(-200, FLOOR, W + 400, H);
  cbLightWash(800, 300);
}
function setCorridor() {
  cbRoom('#d4ece4', '#dcd2c4', FLOOR, { pattern: 'tiles', tileFrom: 700, floorPattern: 'boards' });
  for (const dx of [60, 760]) { cbShape(cbP.rr(dx, 470, 260, 660, 10), '#f7f2ea', { bb: [470, 1130], shade: 8 }); cbShape(cbP.rr(dx + 30, 510, 200, 120, 6), '#9fc7e6', { flat: true, shade: 0, lw: 4 }); }
  for (let i = 0; i < 3; i++) cbShape(cbP.rr(360 + i * 130, 960, 110, 120, 14), '#ff9f80', { bb: [960, 1080], shade: 6 });   // chairs
  cbShape(cbP.rr(380, 300, 320, 90, 14), '#2f3a46', { flat: true, shade: 0, lw: 5 });
  cbGlow(540, 200, 500, '#fffbe0', 0.4);
}
function cbRain(a = 1) {
  const R = RNG('rn'); ctx.save(); ctx.strokeStyle = `rgba(220,235,255,${0.55 * a})`; ctx.lineWidth = 4;
  for (let i = 0; i < 70; i++) { const x = R.r(-100, W + 100), y = mod(R.r(0, H) + TT * 1300, H + 200) - 100; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 12, y + 46); ctx.stroke(); }
  ctx.restore();
}
function cbConfetti(seed, n = 40, y0 = -100) {
  const R = RNG('cf' + seed);
  for (let i = 0; i < n; i++) { const x = R.r(0, W) + Math.sin(TT * 3 + i) * 30, y = mod(R.r(0, H) + TT * R.r(250, 420) + y0, H + 100) - 50;
    ctx.save(); ctx.translate(x, y); ctx.rotate(TT * 4 + i); ctx.fillStyle = [CB.coral, CB.yellow, CB.mint, CB.pink, CB.purple][i % 5]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); }
}
function cbCalendar(x, y, s, day, o = {}) {   // a wall calendar page; o.month, o.circle (0..1 drawn), o.flip (0..1 page flipping)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot ?? 0);
  cbShape(cbP.rr(-170, -200, 340, 400, 22), '#fffaf0', { bb: [-200, 200], shade: 12 });
  cbShape(cbP.rr(-170, -200, 340, 110, [22, 22, 0, 0]), o.head || CB.red, { bb: [-200, -90], shade: 0 });
  for (const sx of [-1, 1]) cbShape(cbP.rr(sx * 90 - 10, -224, 20, 50, 10), '#b9c7d6', { flat: true, shade: 0, lw: 4 });
  cbText(o.month || 'SETEMBRO', 0, -128, 46, { color: '#fff' });
  cbText(String(day), 0, 120, 210, { color: CB.line });
  if (o.circle) { ctx.save(); ctx.lineWidth = 16; ctx.strokeStyle = CB.red; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(0, 50, 150, 120, -0.1, -1.2, -1.2 + TAU * 1.05 * o.circle); ctx.stroke(); ctx.restore(); }
  if (o.flip) { ctx.save(); ctx.globalAlpha = 1 - o.flip; ctx.translate(0, -200); ctx.scale(1, Math.cos(o.flip * Math.PI / 2)); cbShape(cbP.rr(-170, 0, 340, 400, 22), '#fffaf0', { flat: true, shade: 0 }); ctx.restore(); }
  ctx.restore();
}
function cbCupcake(x, y, s, c) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbShape(cbP.poly([[-40, 0], [40, 0], [30, 60], [-30, 60]]), '#f2b6a0', { bb: [0, 60], shade: 6 });
  cbShape(cbP.multi(cbP.ell(0, -18, 48, 30), cbP.ell(-22, -6, 26, 22), cbP.ell(22, -6, 26, 22)), '#fff1f5', { bb: [-48, 10], shade: 6, outer: true });
  cbShape(cbP.rr(-6, -84, 12, 46, 4), c, { flat: true, shade: 0, lw: 3.5 });
  const fl = 1 + 0.15 * Math.sin(TT * 20 + x); cbShape(cbP.ell(0, -96, 9 * fl, 15 * fl), '#ffb11f', { flat: true, shade: 0, lw: 3 }); cbGlow(0, -96, 40, '#ffd27a', 0.6);
  ctx.restore();
}
function cbCrib(x, y, s = 1, baby = true, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbFloorShadow(0, 0, 150, 24, 0.3);
  cbShape(cbP.rr(-150, -170, 300, 120, 18), '#f3f6f8', { bb: [-170, -50], shade: 6 });
  if (baby) cbBaby(0, -150 + Math.sin(TT * 3 + x) * 3, 0.62, { blanket: o.blanket || [CB.mint, CB.pink, '#bfe3ff', CB.yellow][Math.floor(Math.abs(x * 7 + y)) % 4], eyes: o.eyes || ((Math.floor(x + y) % 3) ? 'closed' : 'happy'), mouth: 'smile', bow: o.bow });
  cbShape(cbP.rr(-160, -60, 320, 22, 8), '#d5e3ec', { flat: true, shade: 0, lw: 4 });
  for (let i = -3; i <= 3; i++) cbShape(cbP.rr(i * 44 - 6, -150, 12, 100, 5), '#fdfeff', { flat: true, shade: 0, lw: 3 });
  cbShape(cbP.rr(-160, -160, 320, 18, 8), '#fdfeff', { flat: true, shade: 0, lw: 4 });
  for (const sx of [-1, 1]) cbShape(cbP.rr(sx * 150 - 8, -60, 16, 60, 5), '#b9c7d6', { flat: true, shade: 0, lw: 4 });
  ctx.restore();
}
function cbBox(x, y, s = 1, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbFloorShadow(0, 0, 170, 26, 0.3);
  cbShape(cbP.rr(-150, -200, 300, 200, 10), '#c99560', { bb: [-200, 0], shade: 12 });
  cbShape(cbP.rr(-20, -200, 40, 200, 2), '#e9cfa6', { flat: true, shade: 0, lw: 3 });
  cbHeart(70, -110, 26, '#ff5577');
  if (open > 0) for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 150, -200); ctx.rotate(sx * (Math.PI * 0.75) * open); cbShape(cbP.rr(sx > 0 ? -150 : 0, -16, 150, 20, 4), '#b8854f', { flat: true, shade: 0, lw: 4 }); ctx.restore(); }
  else cbShape(cbP.rr(-158, -216, 316, 26, 6), '#b8854f', { bb: [-216, -190], shade: 4 });
  ctx.restore();
}
function cbSweaterFlat(x, y, s = 1) {   // the sweater on its own (folded / held up)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sx of [-1, 1]) cbShape(cbP.cap(sx * 90, -100, sx * 200, 40, 44), '#d8322c', { bb: [-140, 80], shade: 8 });
  const tw = 190, shY = -110, hipY = 105;
  cbShape(cbP.rr(-tw / 2, shY, tw, hipY - shY + 6, [60, 60, 18, 18]), '#d8322c', { bb: [shY, hipY], shade: 12 });
  cbTopDetail({ type: 'sweater', color: '#d8322c' }, tw, shY, hipY);
  ctx.restore();
}

// =====================================================================
//  styles/chibi/kit.js — "chibi": flat-vector cartoon with volume.
//  Big-headed characters, dark warm outline, every fill a soft top-to-bottom gradient with a cel shadow
//  (lower-right) and a rim light (upper-left), contact shadows on the floor, window light, a blurred
//  foreground layer for depth, grain + vignette in post. Motion on 1s.
//  Helpers are prefixed cb*. Needs from the piece head: W, H, FPS.
// =====================================================================
const CB = {
  line: '#2e1f1c', lw: 5,
  font: '"Inter Display", "Inter", "Arial Black", "Segoe UI Black", sans-serif',
  skin: { light: '#f6cfae', tan: '#e2a77c', brown: '#b9784f', dark: '#7d4b31' },
  hair: { brown: '#4a2c1f', black: '#241817', auburn: '#9b4a2a', grey: '#cfc9c4', blond: '#e8c15d' },
  coral: '#ff7a59', yellow: '#ffd23f', mint: '#9fe3cf', red: '#e0403a', green: '#3f9a5a', pink: '#ff9fb5', purple: '#7b5cff',
};
// ---- colour helpers
function cbRGB(h) { return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function cbHex(r) { return '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function cbTone(h, k) { const c = cbRGB(h); return cbHex(c.map((v) => (k >= 0 ? v + (255 - v) * k : v * (1 + k)))); }
function cbMix(a, b, u) { const x = cbRGB(a), y = cbRGB(b); return cbHex(x.map((v, i) => v + (y[i] - v) * u)); }
// ---- path builders (add to the current path)
const cbP = {
  ell: (x, y, rx, ry, rot = 0) => () => ctx.ellipse(x, y, rx, ry, rot, 0, TAU),
  rr: (x, y, w, h, r) => () => ctx.roundRect(x, y, w, h, r),
  poly: (P) => () => { ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.closePath(); },
  smooth: (P) => () => {   // closed Catmull-Rom-ish curve through P
    const n = P.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const s = m(P[n - 1], P[0]); ctx.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) { const p = P[i], q = m(P[i], P[(i + 1) % n]); ctx.quadraticCurveTo(p[0], p[1], q[0], q[1]); }
    ctx.closePath();
  },
  cap: (x1, y1, x2, y2, r) => () => {   // a capsule from (x1,y1) to (x2,y2)
    const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
    const c = Math.cos(a), s = Math.sin(a), pt = (u, v) => [x1 + c * u - s * v, y1 + s * u + c * v];
    let p = pt(0, -r); ctx.moveTo(p[0], p[1]); p = pt(L, -r); ctx.lineTo(p[0], p[1]);
    ctx.arc(x2, y2, r, a - Math.PI / 2, a + Math.PI / 2); p = pt(0, r); ctx.lineTo(p[0], p[1]);
    ctx.arc(x1, y1, r, a + Math.PI / 2, a + Math.PI * 1.5); ctx.closePath();
  },
  multi: (...fs) => () => fs.forEach((f) => f()),
};
// ---- the core shape: gradient fill, cel shadow, rim light, outline.
//   o: { bb: [y0, y1] gradient span, shade: px offset of the cel shadow (0 = none), rim, line (false|colour), lw, alpha, flat }
function cbShape(path, fill, o = {}) {
  ctx.save();
  if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  if (o.outer && o.line !== false) { ctx.beginPath(); path(); ctx.lineWidth = (o.lw ?? CB.lw) * 2; ctx.strokeStyle = o.line || CB.line; ctx.lineJoin = 'round'; ctx.stroke(); }
  ctx.beginPath(); path();
  if (o.flat || !o.bb) ctx.fillStyle = fill;
  else { const g = ctx.createLinearGradient(0, o.bb[0], 0, o.bb[1]); g.addColorStop(0, cbTone(fill, 0.1)); g.addColorStop(1, cbTone(fill, -0.08)); ctx.fillStyle = g; }
  ctx.fill();
  const sh = o.shade ?? 10;
  if (sh) {
    ctx.save(); ctx.beginPath(); path(); ctx.clip();
    ctx.beginPath(); ctx.rect(-5e3, -5e3, 1e4, 1e4); ctx.save(); ctx.translate(-sh, -sh * 0.9); path(); ctx.restore();
    ctx.fillStyle = cbTone(fill, -0.2); ctx.globalAlpha *= 0.75; ctx.fill('evenodd');
    if (o.rim !== false) {
      ctx.beginPath(); ctx.rect(-5e3, -5e3, 1e4, 1e4); ctx.save(); ctx.translate(sh * 0.45, sh * 0.45); path(); ctx.restore();
      ctx.fillStyle = cbTone(fill, 0.32); ctx.globalAlpha = 0.5 * (o.alpha ?? 1); ctx.fill('evenodd');
    }
    ctx.restore();
  }
  if (o.line !== false && !o.outer) { ctx.beginPath(); path(); ctx.lineWidth = o.lw ?? CB.lw; ctx.strokeStyle = o.line || CB.line; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.restore();
}
function cbLine(P, o = {}) {
  ctx.save(); ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  if (o.curve && P.length === 3) ctx.quadraticCurveTo(P[1][0], P[1][1], P[2][0], P[2][1]);
  else for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]);
  ctx.lineWidth = o.w ?? CB.lw; ctx.strokeStyle = o.c ?? CB.line; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
}
// soft contact shadow on the floor
function cbFloorShadow(x, y, rx, ry = rx * 0.18, a = 0.32) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, `rgba(40,20,20,${a})`); g.addColorStop(0.6, `rgba(40,20,20,${a * 0.45})`); g.addColorStop(1, 'rgba(40,20,20,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
}
// a light pool / glow
function cbGlow(x, y, r, color, a = 0.5) {
  ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, r); const c = cbRGB(color);
  g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
// diagonal window light rays
function cbRays(x, y, w, h, ang = 0.5, a = 0.18) {
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 3; i++) {
    const ox = x + i * w * 0.34, P = [[ox, y], [ox + w * 0.22, y], [ox + w * 0.22 + h * ang, y + h], [ox + h * ang - w * 0.05, y + h]];
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, `rgba(255,240,200,${a})`); g.addColorStop(1, 'rgba(255,240,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); cbP.poly(P)(); ctx.fill();
  }
  ctx.restore();
}
// a big soft light wash (window side) and a cool shade on the far side: depth for a whole set
function cbLightWash(lx, ly, r = 1100, warm = 'ffe7b0', a = 0.32) {
  ctx.save(); ctx.globalCompositeOperation = 'soft-light';
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r); g.addColorStop(0, `rgba(255,240,200,${a * 1.6})`); g.addColorStop(1, 'rgba(60,40,80,0.22)');
  ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
}
// draw fn into an offscreen layer and blur it (depth of field for foreground props)
const CB_LAYERS = {};
function cbBlurred(px, fn, key = 'fg') {
  let c = CB_LAYERS[key]; if (!c) { c = document.createElement('canvas'); c.width = W; c.height = H; CB_LAYERS[key] = c; }
  const saved = ctx, T = ctx.getTransform(); ctx = c.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); ctx.setTransform(T); fn(); ctx = saved;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${px}px)`; ctx.drawImage(c, 0, 0); ctx.restore();
}

// =====================================================================
//  CHARACTERS
//  cbPerson(x, y, s, P): feet centre (x, y), scale s (1 = adult ~760px tall).
//  P = { age: 'adult'|'teen'|'kid'|'small', skin, hair: { style, color }, top: { type, color }, pants, shoes,
//        eyes: 'open'|'happy'|'closed'|'wide'|'teary', mouth: 'smile'|'grin'|'o'|'flat'|'frown'|'shout'|'wavy',
//        blush (0..1 cheeks), red (0..1 whole face), arms: [left, right] poses, beard, glasses, look: -1..1,
//        hold: fn drawn in the hands (baby, box ...), key }
//  arm poses: 'down' | 'up' | 'hip' | 'front' (holding in front) | 'wave' | 'cheek' (hand to cheek) | 'high' (lifting overhead)
// =====================================================================
const CB_BODY = {
  adult: { head: 128, torsoH: 215, torsoW: 190, leg: 92, legW: 30 },
  teen: { head: 122, torsoH: 185, torsoW: 160, leg: 82, legW: 27 },
  kid: { head: 118, torsoH: 140, torsoW: 140, leg: 62, legW: 25 },
  small: { head: 112, torsoH: 112, torsoW: 124, leg: 48, legW: 23 },
};
function cbPerson(x, y, s, P) {
  const D = CB_BODY[P.age || 'adult'], key = P.key || 'p';
  const bob = Math.sin(TT * TAU * 0.8 + key.length) * 3;   // idle breathing
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (!P.noShadow) cbFloorShadow(0, 0, D.torsoW * 0.85, 22, 0.34);
  if (P.lean) ctx.rotate(P.lean);
  if (P.sq) ctx.scale(1 + P.sq, 1 - P.sq);
  const hipY = -D.leg, shY = hipY - D.torsoH + 18 + bob, headY = shY - D.head * 0.78 + bob * 0.5;
  const top = P.top || { type: 'hoodie', color: CB.coral };
  // legs + shoes
  const pants = P.pants || '#3b5f9e', shoes = P.shoes || '#f4f1ec';
  if (top.type !== 'gown' && top.type !== 'dress') {
    for (const sx of [-1, 1]) cbShape(cbP.rr(sx * D.torsoW * 0.22 - D.legW, hipY - 10, D.legW * 2, D.leg + 4, D.legW * 0.6), pants, { bb: [hipY, 0], shade: 6 });
  } else for (const sx of [-1, 1]) cbShape(cbP.rr(sx * D.torsoW * 0.2 - D.legW * 0.7, hipY, D.legW * 1.4, D.leg - 4, 10), P.skin || CB.skin.tan, { bb: [hipY, 0], shade: 4 });
  for (const sx of [-1, 1]) cbShape(cbP.ell(sx * D.torsoW * 0.24, -12, D.legW * 1.35, 17), shoes, { bb: [-28, 4], shade: 5 });
  // arms behind torso? draw the back arm first when posed 'front'
  const arms = P.arms || ['down', 'down'];
  const armR = D.torsoW * 0.13, shX = D.torsoW * 0.47;
  const handPos = (side, pose) => {
    const sx = side < 0 ? -1 : 1, t = TT;
    switch (pose) {
      case 'up': return [sx * (shX + 70), shY - 150];
      case 'high': return [sx * D.head * 1.08, shY - D.head * 2.0];
      case 'hip': return [sx * (shX + 34), hipY - 20];
      case 'front': return [sx * 46, shY + 95];
      case 'wave': return [sx * (shX + 70), shY - 140 + Math.sin(t * TAU * 2.5) * 22];
      case 'cheek': return [sx * D.head * 0.55, headY + D.head * 0.35];
      case 'point': return [sx * (shX + 150), shY + 10];
      case 'chin': return [sx * 30, headY + D.head * 0.85];
      case 'reach': return [sx * 60, shY + 40];
      case 'hug': return [-sx * 40, shY + 70];
      default: return [sx * (shX + 16), hipY - 6];
    }
  };
  const sleeve = top.type === 'gown' ? (top.color) : top.type === 'dress' ? (P.skin || CB.skin.tan) : top.color;
  const drawArm = (side, part = 'both') => {
    const sx = side < 0 ? -1 : 1, [hx, hy] = handPos(side, arms[side < 0 ? 0 : 1]);
    if (part !== 'hand') cbShape(cbP.cap(sx * (shX - 14), shY + 22, hx, hy, armR), sleeve, { bb: [shY, hy], shade: 6 });
    if (part !== 'arm') cbShape(cbP.ell(hx, hy, armR * 1.12, armR * 1.12), P.skin || CB.skin.tan, { bb: [hy - armR, hy + armR], shade: 4 });
  };
  // torso
  const tw = D.torsoW, tP = cbP.rr(-tw / 2, shY, tw, hipY - shY + 6, [tw * 0.32, tw * 0.32, 18, 18]);
  if (top.type === 'dress') cbShape(cbP.poly([[-tw * 0.4, shY + 10], [tw * 0.4, shY + 10], [tw * 0.62, hipY + D.leg * 0.55], [-tw * 0.62, hipY + D.leg * 0.55]]), top.color, { bb: [shY, hipY], shade: 10 });
  else if (top.type === 'gown') cbShape(cbP.poly([[-tw * 0.45, shY + 10], [tw * 0.45, shY + 10], [tw * 0.56, hipY + D.leg * 0.6], [-tw * 0.56, hipY + D.leg * 0.6]]), top.color, { bb: [shY, hipY], shade: 10 });
  else cbShape(tP, top.color, { bb: [shY, hipY], shade: 12 });
  cbTopDetail(top, tw, shY, hipY);
  const late = (side) => ['cheek', 'chin'].includes(arms[side < 0 ? 0 : 1]);
  for (const side of [-1, 1]) drawArm(side, late(side) ? 'arm' : 'both');
  // head
  cbHead(0, headY, D.head, P);
  for (const side of [-1, 1]) if (late(side)) drawArm(side, 'hand');
  if (P.hold) { ctx.save(); P.hold(0, shY); ctx.restore(); }
  ctx.restore();
  return { head: [x, y + headY * s], chest: y + (shY + 60) * s, top: y + (headY - D.head) * s, hands: y + (shY - D.head * 2.0) * s };
}
function cbTopDetail(top, tw, shY, hipY) {
  const c = top.color;
  if (top.type === 'hoodie') {
    cbShape(cbP.ell(0, shY + 6, tw * 0.3, 22), cbTone(c, -0.12), { flat: true, shade: 0, lw: 4 });   // hood rim
    cbLine([[-12, shY + 26], [-16, shY + 70]], { w: 4, c: '#fff6e8' }); cbLine([[12, shY + 26], [16, shY + 70]], { w: 4, c: '#fff6e8' });
    cbShape(cbP.rr(-tw * 0.27, hipY - (hipY - shY) * 0.42, tw * 0.54, (hipY - shY) * 0.27, 14), cbTone(c, -0.07), { flat: true, shade: 0, lw: 4 });   // pocket
    cbStar(tw * 0.22, shY + 52, 14, CB.yellow);
  } else if (top.type === 'sweater') {   // the ugly Christmas sweater
    ctx.save(); ctx.beginPath(); ctx.roundRect(-tw / 2, shY, tw, hipY - shY + 6, [tw * 0.32, tw * 0.32, 18, 18]); ctx.clip();
    for (const yy of [shY + 34, hipY - 30]) {
      ctx.fillStyle = '#fffaf0'; ctx.fillRect(-tw, yy - 9, tw * 2, 18);
      ctx.fillStyle = CB.green; for (let x = -tw / 2; x < tw / 2; x += 22) { ctx.beginPath(); ctx.moveTo(x, yy + 9); ctx.lineTo(x + 11, yy - 7); ctx.lineTo(x + 22, yy + 9); ctx.fill(); }
    }
    const R = RNG('flakes' + tw);
    for (let i = 0; i < 6; i++) { const fx = R.r(-tw * 0.42, tw * 0.42), fy = R.r(shY + 60, hipY - 50); if (Math.abs(fx) > 34) cbFlake(fx, fy, 9); }
    ctx.restore();
    const ty = (shY + hipY) / 2;   // the tree
    cbShape(cbP.poly([[0, ty - 50], [34, ty + 26], [-34, ty + 26]]), CB.green, { bb: [ty - 50, ty + 26], shade: 4, lw: 3.5 });
    cbShape(cbP.rr(-7, ty + 26, 14, 14, 3), '#7a4a2a', { flat: true, shade: 0, lw: 3 });
    cbStar(0, ty - 54, 10, CB.yellow);
    for (const [bx, by, bc] of [[-12, ty + 8, CB.yellow], [10, ty - 8, '#fffaf0'], [14, ty + 16, '#5bc0ff']]) { ctx.fillStyle = bc; ctx.beginPath(); ctx.arc(bx, by, 4.5, 0, TAU); ctx.fill(); }
    for (const sx of [-1, 1]) cbShape(cbP.ell(sx * tw * 0.2, shY + 16, 10, 10), '#fffaf0', { flat: true, shade: 0, lw: 3 });   // pom-poms
  } else if (top.type === 'gown') {
    const R = RNG('gown'); ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc(R.r(-tw * 0.4, tw * 0.4), R.r(shY + 30, hipY + 20), 4, 0, TAU); ctx.fill(); }
  } else if (top.type === 'dress') {
    cbShape(cbP.rr(-tw * 0.46, (shY + hipY) / 2 + 10, tw * 0.92, 16, 8), cbTone(top.color, -0.18), { flat: true, shade: 0, lw: 3.5 });
  } else if (top.type === 'shirt') {
    cbShape(cbP.poly([[-26, shY + 2], [0, shY + 34], [26, shY + 2]]), '#fffaf0', { flat: true, shade: 0, lw: 3.5 });
  }
}
function cbStar(x, y, r, c) {
  const P = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  cbShape(cbP.poly(P), c, { flat: true, shade: 0, lw: 3 });
}
function cbFlake(x, y, r) { for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; cbLine([[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], { w: 3.5, c: '#fffaf0' }); } }
// ---- the head
function cbHead(x, y, r, P) {
  const skin = P.skin || CB.skin.tan, hair = P.hair || { style: 'messy', color: CB.hair.brown };
  const look = (P.look || 0) * r * 0.08, key = P.key || 'p';
  cbHairBack(x, y, r, hair);
  for (const sx of [-1, 1]) { cbShape(cbP.ell(x + sx * r * 0.98, y + r * 0.12, r * 0.2, r * 0.24), skin, { flat: true, shade: 4 }); }   // ears
  const red = P.red || 0; let face = red > 0 ? cbMix(skin, '#ff4436', red * 0.7) : skin;
  if (P.tint) face = cbMix(face, P.tint[0], P.tint[1]);
  cbShape(cbP.ell(x, y, r, r * 0.93), face, { bb: [y - r, y + r], shade: 14 });
  if (P.beard) cbShape(cbP.smooth([[x - r * 0.92, y + r * 0.05], [x - r * 0.8, y + r * 0.7], [x - r * 0.3, y + r * 1.04], [x + r * 0.3, y + r * 1.04], [x + r * 0.8, y + r * 0.7], [x + r * 0.92, y + r * 0.05], [x + r * 0.5, y + r * 0.42], [x - r * 0.5, y + r * 0.42]]), P.beard, { bb: [y, y + r], shade: 8 });
  cbHairFront(x, y, r, hair);
  // eyes
  const ey = y + r * 0.08, ex = r * 0.36, blink = ((Math.floor(TT * FPS) + key.length * 13) % 83) < 3;
  const eyes = blink && P.eyes !== 'happy' ? 'closed' : (P.eyes || 'open');
  for (const sx of [-1, 1]) {
    const cx = x + sx * ex + look;
    if (eyes === 'happy') cbLine([[cx - r * 0.13, ey + r * 0.04], [cx, ey - r * 0.1], [cx + r * 0.13, ey + r * 0.04]], { w: 6, curve: true });
    else if (eyes === 'closed') cbLine([[cx - r * 0.13, ey], [cx, ey + r * 0.07], [cx + r * 0.13, ey]], { w: 6, curve: true });
    else {
      const big = eyes === 'wide' ? 1.18 : 1, rx = r * 0.15 * big, ry = r * 0.19 * big;
      cbShape(cbP.ell(cx, ey, rx, ry), '#fffdf8', { flat: true, shade: 0, lw: 4 });
      const ir = eyes === 'wide' ? 0.55 : 0.82, g = ctx.createLinearGradient(0, ey - ry, 0, ey + ry);
      g.addColorStop(0, '#3a2114'); g.addColorStop(1, '#8a5530');
      ctx.save(); ctx.beginPath(); ctx.ellipse(cx, ey, rx, ry, 0, 0, TAU); ctx.clip();
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx + look * 0.3, ey + ry * 0.08, rx * ir, ry * ir, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#1b0f0b'; ctx.beginPath(); ctx.ellipse(cx + look * 0.3, ey + ry * 0.1, rx * ir * 0.45, ry * ir * 0.45, 0, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(cx - rx * 0.3, ey - ry * 0.35, rx * 0.3, ry * 0.26, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + rx * 0.32, ey + ry * 0.3, rx * 0.13, 0, TAU); ctx.fill();
      cbLine([[cx - rx * 1.05, ey - ry * 0.75], [cx, ey - ry * 1.18], [cx + rx * 1.05, ey - ry * 0.75]], { w: 4.5, curve: true });   // lid
      if (eyes === 'teary') { ctx.fillStyle = 'rgba(120,200,255,0.85)'; ctx.beginPath(); ctx.ellipse(cx + sx * rx * 0.2, ey + ry * 1.3, 7, 12, 0, 0, TAU); ctx.fill(); }
    }
    // brows
    const by = ey - r * 0.33, br = P.brows || 0;
    cbLine([[cx - r * 0.14, by + sx * br * 6], [cx + r * 0.14, by - sx * br * 6]], { w: 7, c: cbTone(hair.color, -0.15) });
  }
  if (P.glasses) for (const sx of [-1, 1]) { ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = CB.line; ctx.beginPath(); ctx.arc(x + sx * ex + look, ey, r * 0.22, 0, TAU); ctx.stroke(); ctx.restore(); }
  if (P.glasses) cbLine([[x - ex + r * 0.22 + look, ey], [x + ex - r * 0.22 + look, ey]], { w: 5 });
  // cheeks
  const bl = 0.45 + (P.blush || 0) * 0.5;
  for (const sx of [-1, 1]) cbGlow(x + sx * r * 0.55 + look * 0.5, y + r * 0.4, r * 0.24, '#ff6f7d', bl * 0.7);
  if (red > 0.6) for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) cbLine([[x + sx * r * (0.42 + i * 0.1), y + r * 0.34], [x + sx * r * (0.38 + i * 0.1), y + r * 0.44]], { w: 4, c: '#c8221d' });
  // nose
  cbLine([[x + look - 6, y + r * 0.33], [x + look, y + r * 0.38], [x + look + 6, y + r * 0.33]], { w: 4.5, c: cbTone(skin, -0.45), curve: true });
  // mouth
  const my = y + r * 0.56 + (P.beard ? -r * 0.02 : 0), mx = x + look * 0.6, M = P.mouth || 'smile';
  if (M === 'smile') cbLine([[mx - r * 0.17, my - 4], [mx, my + r * 0.12], [mx + r * 0.17, my - 4]], { w: 5.5, curve: true });
  else if (M === 'flat') cbLine([[mx - r * 0.12, my + 4], [mx + r * 0.12, my + 4]], { w: 5.5 });
  else if (M === 'frown') cbLine([[mx - r * 0.15, my + 10], [mx, my - 2], [mx + r * 0.15, my + 10]], { w: 5.5, curve: true });
  else if (M === 'wavy') cbLine([[mx - r * 0.16, my + 4], [mx - r * 0.08, my - 3], [mx, my + 4], [mx + r * 0.08, my - 3], [mx + r * 0.16, my + 4]], { w: 5 });
  else if (M === 'o') { cbShape(cbP.ell(mx, my + 4, r * 0.08, r * 0.1), '#7a2c2c', { flat: true, shade: 0, lw: 4.5 }); }
  else {   // grin / shout: an open D mouth with teeth and tongue
    const w = M === 'shout' ? r * 0.24 : r * 0.21, h = M === 'shout' ? r * 0.28 : r * 0.2;
    const path = () => { ctx.moveTo(mx - w, my - 4); ctx.quadraticCurveTo(mx, my - 10, mx + w, my - 4); ctx.quadraticCurveTo(mx + w * 0.9, my + h, mx, my + h); ctx.quadraticCurveTo(mx - w * 0.9, my + h, mx - w, my - 4); ctx.closePath(); };
    cbShape(path, '#7a2c2c', { flat: true, shade: 0, lw: 4.5 });
    ctx.save(); ctx.beginPath(); path(); ctx.clip();
    ctx.fillStyle = '#fff'; ctx.fillRect(mx - w, my - 12, w * 2, 14);
    ctx.fillStyle = '#ff7d7d'; ctx.beginPath(); ctx.ellipse(mx, my + h, w * 0.6, h * 0.45, 0, 0, TAU); ctx.fill();
    ctx.restore(); ctx.beginPath(); path(); ctx.lineWidth = 4.5; ctx.strokeStyle = CB.line; ctx.stroke();
  }
}
function cbHairBack(x, y, r, h) {
  const c = h.color;
  if (h.style === 'curly') { const R = RNG('curl'); const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; pts.push([x + Math.cos(a) * r * 1.38, y + Math.sin(a) * r * 1.22 - r * 0.05]); } cbShape(cbP.multi(cbP.ell(x, y - r * 0.05, r * 1.3, r * 1.18), ...pts.map(([px, py]) => cbP.ell(px, py, r * 0.36, r * 0.34))), c, { bb: [y - r * 1.5, y + r], shade: 12, outer: true }); }
  else if (h.style === 'long' || h.style === 'bun') cbShape(cbP.rr(x - r * 1.08, y - r * 0.7, r * 2.16, r * (h.style === 'long' ? 2.0 : 1.3), r * 0.7), c, { bb: [y - r, y + r], shade: 10 });
  if (h.style === 'bun') cbShape(cbP.ell(x, y - r * 1.12, r * 0.42, r * 0.36), c, { bb: [y - r * 1.5, y - r * 0.8], shade: 8 });
  if (h.style === 'grey-bun') cbShape(cbP.ell(x, y - r * 1.1, r * 0.4, r * 0.34), c, { bb: [y - r * 1.5, y - r * 0.8], shade: 8 });
}
function cbHairFront(x, y, r, h) {
  const c = h.color, bb = [y - r * 1.1, y];
  if (h.style === 'messy') {   // Leo: messy fringe with a cowlick
    cbShape(cbP.smooth([[x - r * 1.0, y + r * 0.05], [x - r * 1.04, y - r * 0.62], [x - r * 0.55, y - r * 1.05], [x + r * 0.1, y - r * 1.12], [x + r * 0.7, y - r * 0.95], [x + r * 1.05, y - r * 0.5], [x + r * 1.0, y + r * 0.02], [x + r * 0.78, y - r * 0.32], [x + r * 0.5, y - r * 0.2], [x + r * 0.3, y - r * 0.42], [x, y - r * 0.24], [x - r * 0.3, y - r * 0.44], [x - r * 0.62, y - r * 0.24], [x - r * 0.8, y - r * 0.36]]), c, { bb, shade: 10 });
    cbShape(cbP.smooth([[x + r * 0.02, y - r * 1.02], [x + r * 0.1, y - r * 1.36], [x + r * 0.36, y - r * 1.42], [x + r * 0.22, y - r * 1.2], [x + r * 0.2, y - r * 1.02]]), c, { bb, shade: 4 });
  } else if (h.style === 'short') {
    cbShape(cbP.smooth([[x - r * 1.0, y - r * 0.05], [x - r * 0.98, y - r * 0.7], [x - r * 0.4, y - r * 1.06], [x + r * 0.4, y - r * 1.06], [x + r * 0.98, y - r * 0.7], [x + r * 1.0, y - r * 0.05], [x + r * 0.84, y - r * 0.5], [x, y - r * 0.6], [x - r * 0.84, y - r * 0.5]]), c, { bb, shade: 8 });
  } else if (h.style === 'curly') {
    const R = RNG('fr'); const pts = []; for (let i = 0; i < 7; i++) pts.push(cbP.ell(x - r * 0.75 + i * r * 0.25, y - r * 0.72 + Math.abs(i - 3) * r * 0.06, r * 0.22, r * 0.2));
    cbShape(cbP.multi(...pts), c, { bb, shade: 6, outer: true });
  } else if (h.style === 'bun' || h.style === 'long' || h.style === 'grey-bun') {
    cbShape(cbP.smooth([[x - r * 1.02, y + r * 0.1], [x - r * 0.95, y - r * 0.7], [x - r * 0.3, y - r * 1.04], [x + r * 0.5, y - r * 1.0], [x + r * 1.0, y - r * 0.6], [x + r * 1.02, y + r * 0.1], [x + r * 0.7, y - r * 0.45], [x + r * 0.05, y - r * 0.56], [x - r * 0.35, y - r * 0.36], [x - r * 0.75, y - r * 0.4]]), c, { bb, shade: 8 });
  } else if (h.style === 'tuft') {   // a newborn's tuft
    cbShape(cbP.smooth([[x - r * 0.12, y - r * 0.88], [x - r * 0.06, y - r * 1.2], [x + r * 0.2, y - r * 1.28], [x + r * 0.1, y - r * 1.06], [x + r * 0.12, y - r * 0.88]]), c, { bb, shade: 3 });
  }
}
// an inflatable swim ring (a duck ring), drawn around a waist at (x, y)
function cbRing(x, y, rx, ry, c = CB.yellow, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, k);
  cbShape(() => { ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.moveTo(rx * 0.55, 0); ctx.ellipse(0, 0, rx * 0.55, ry * 0.45, 0, 0, TAU, true); }, c, { bb: [-ry, ry], shade: 10 });
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.4; ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.ellipse(Math.cos(a) * rx * 0.78, Math.sin(a) * ry * 0.72, rx * 0.1, ry * 0.12, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
// a newborn wrapped in a blanket; (x, y) = centre of the bundle
function cbBaby(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const blanket = o.blanket || CB.coral;
  cbShape(cbP.smooth([[-70, 20], [-80, -40], [-50, -95], [0, -112], [50, -95], [80, -40], [70, 20], [40, 95], [-40, 95]]), blanket, { bb: [-110, 95], shade: 10 });
  cbHead(0, -38, 58, { skin: o.skin || CB.skin.tan, hair: { style: 'tuft', color: CB.hair.brown }, eyes: o.eyes || 'happy', mouth: o.mouth || 'smile', key: 'baby', blush: 0.4 });
  cbShape(cbP.smooth([[-62, 6], [0, 30], [62, 6], [55, 40], [0, 60], [-55, 40]]), cbTone(blanket, -0.06), { bb: [0, 60], shade: 5 });
  if (o.bow) cbBow(0, -100, 1, o.bow);
  ctx.restore();
}
function cbBow(x, y, s, c) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sx of [-1, 1]) cbShape(cbP.poly([[0, 0], [sx * 46, -26], [sx * 52, 22]]), c, { bb: [-26, 22], shade: 5, lw: 4 });
  cbShape(cbP.ell(0, 0, 13, 13), cbTone(c, -0.1), { flat: true, shade: 0, lw: 4 });
  ctx.restore();
}

// =====================================================================
//  SETS — rooms and props
// =====================================================================
// a room: a wall (gradient + pattern) down to floorY, then a floor in perspective
function cbRoom(wall, floor, floorY, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, floorY); g.addColorStop(0, cbTone(wall, 0.06)); g.addColorStop(1, cbTone(wall, -0.06));
  ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, floorY + 200);
  if (o.pattern === 'dots') { ctx.fillStyle = cbTone(wall, -0.07); for (let yy = 40; yy < floorY; yy += 64) for (let xx = (yy / 64 % 2) * 32; xx < W; xx += 64) { ctx.beginPath(); ctx.arc(xx, yy, 5, 0, TAU); ctx.fill(); } }
  if (o.pattern === 'stripes') { ctx.fillStyle = cbTone(wall, -0.05); for (let xx = 0; xx < W + 60; xx += 90) ctx.fillRect(xx, 0, 38, floorY); }
  if (o.pattern === 'tiles') { ctx.strokeStyle = cbTone(wall, -0.1); ctx.lineWidth = 3; const ty = o.tileFrom ?? floorY * 0.55; for (let yy = ty; yy < floorY; yy += 70) { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); } for (let xx = 0; xx < W; xx += 70) { ctx.beginPath(); ctx.moveTo(xx, ty); ctx.lineTo(xx, floorY); ctx.stroke(); } cbLine([[-10, ty], [W + 10, ty]], { w: 5, c: cbTone(wall, -0.2) }); }
  // baseboard + floor
  const fg = ctx.createLinearGradient(0, floorY, 0, H); fg.addColorStop(0, cbTone(floor, -0.08)); fg.addColorStop(1, cbTone(floor, 0.08));
  ctx.fillStyle = fg; ctx.fillRect(-200, floorY, W + 400, H - floorY + 200);
  if (o.floorPattern === 'boards') { ctx.strokeStyle = cbTone(floor, -0.14); ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { const yy = floorY + (i * i + 2 * i) * 9; ctx.beginPath(); ctx.moveTo(-10, yy); ctx.lineTo(W + 10, yy); ctx.stroke(); } }
  if (o.floorPattern === 'checker') { const R = 12; for (let r = 0; r < R; r++) { const y0 = floorY + r * r * 6 + r * 30, y1 = floorY + (r + 1) * (r + 1) * 6 + (r + 1) * 30; for (let c = -6; c < 14; c++) { if ((r + c) % 2) continue; const w0 = 90 + r * 18, w1 = 90 + (r + 1) * 18; ctx.fillStyle = cbTone(floor, -0.07); ctx.beginPath(); ctx.moveTo(W / 2 + (c - 4) * w0, y0); ctx.lineTo(W / 2 + (c - 3) * w0, y0); ctx.lineTo(W / 2 + (c - 3) * w1, y1); ctx.lineTo(W / 2 + (c - 4) * w1, y1); ctx.fill(); } } }
  ctx.fillStyle = cbTone(wall, -0.25); ctx.fillRect(-200, floorY - 16, W + 400, 22);
  ctx.fillStyle = 'rgba(40,20,20,0.18)'; ctx.fillRect(-200, floorY + 6, W + 400, 16);   // contact shade at the wall foot
}
// a window with an outside scene (fn draws inside the glass, clipped)
function cbWindow(x, y, w, h, outside, o = {}) {
  const frame = o.frame || '#fffaf2';
  cbShape(cbP.rr(x - 18, y - 18, w + 36, h + 36, 10), frame, { bb: [y, y + h], shade: 8 });
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, o.sky || '#8fd3ff'); g.addColorStop(1, o.sky2 || '#d9f2ff'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  if (outside) outside(x, y, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.moveTo(x + w * 0.1, y + h); ctx.lineTo(x + w * 0.45, y); ctx.lineTo(x + w * 0.6, y); ctx.lineTo(x + w * 0.25, y + h); ctx.fill();   // glass glint
  ctx.restore();
  ctx.save(); ctx.lineWidth = CB.lw; ctx.strokeStyle = CB.line; ctx.strokeRect(x, y, w, h); ctx.restore();
  cbShape(cbP.rr(x + w / 2 - 8, y, 16, h, 3), frame, { flat: true, shade: 0, lw: 4 });
  if (o.cross !== false) cbShape(cbP.rr(x, y + h * 0.45 - 8, w, 16, 3), frame, { flat: true, shade: 0, lw: 4 });
  cbShape(cbP.rr(x - 34, y + h + 14, w + 68, 26, 8), frame, { bb: [y + h, y + h + 40], shade: 5 });   // sill
}
// the yellow ipê tree (Brazil, in bloom in September)
function cbIpe(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbShape(cbP.poly([[-14, 0], [-8, -170], [-60, -260], [-46, -268], [0, -200], [40, -280], [54, -272], [10, -170], [14, 0]]), '#6b4430', { bb: [-280, 0], shade: 5 });
  const R = RNG('ipe' + (o.key || ''));
  const blobs = []; for (let i = 0; i < 9; i++) blobs.push([R.r(-170, 170), R.r(-420, -230), R.r(70, 110)]);
  cbShape(cbP.multi(...blobs.map(([bx, by, br]) => cbP.ell(bx, by, br, br * 0.82))), '#ffd02e', { bb: [-520, -200], shade: 14, outer: true });
  ctx.fillStyle = '#fff3a8'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(R.r(-190, 190), R.r(-500, -230), R.r(4, 8), 0, TAU); ctx.fill(); }
  // drifting petals
  for (let i = 0; i < 10; i++) { const px = R.r(-260, 260) + Math.sin(TT * 1.3 + i) * 30, py = mod(R.r(-400, 200) + TT * 60, 600) - 300; ctx.fillStyle = '#ffd02e'; ctx.beginPath(); ctx.ellipse(px, py, 8, 5, TT + i, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function cbClouds(x, y, w, h, seed = 'cl') {
  const R = RNG(seed);
  for (let i = 0; i < 3; i++) { const cx = x + mod(R.r(0, w) + TT * 12 * (i + 1), w + 200) - 100, cy = y + R.r(h * 0.1, h * 0.5);
    cbShape(cbP.multi(cbP.ell(cx, cy, 60, 30), cbP.ell(cx + 40, cy - 18, 46, 34), cbP.ell(cx - 40, cy - 8, 36, 26)), '#ffffff', { bb: [cy - 50, cy + 30], shade: 6, rim: false, outer: true, lw: 3 }); }
}
// a hospital bed seen from the side; returns the mattress top y
function cbBed(x, y, w, o = {}) {
  const sheet = o.sheet || '#ffffff', frame = o.frame || '#b9c7d6';
  cbFloorShadow(x + w / 2, y + 6, w * 0.6, 26, 0.3);
  for (const lx of [x + 20, x + w - 34]) cbShape(cbP.rr(lx, y - 120, 14, 120, 5), frame, { bb: [y - 120, y], shade: 3 });
  cbShape(cbP.rr(x - 10, y - 260, 26, 200, 10), frame, { bb: [y - 260, y - 60], shade: 5 });   // headboard
  cbShape(cbP.rr(x, y - 170, w, 56, 16), cbTone(frame, 0.2), { bb: [y - 170, y - 114], shade: 6 });   // mattress
  return y - 170;
}
function cbMonitor(x, y) {
  cbShape(cbP.rr(x, y, 190, 130, 14), '#2f3a46', { bb: [y, y + 130], shade: 6 });
  ctx.save(); ctx.beginPath(); ctx.rect(x + 16, y + 16, 158, 98); ctx.clip(); ctx.fillStyle = '#122028'; ctx.fillRect(x + 16, y + 16, 158, 98);
  ctx.strokeStyle = '#5dff8f'; ctx.lineWidth = 4; ctx.beginPath(); const off = (TT * 120) % 158;
  for (let i = 0; i <= 158; i += 2) { const u = (i + off) % 158, k = u > 70 && u < 90 ? (u < 78 ? -40 : u < 84 ? 34 : -6) : 0; ctx.lineTo(x + 16 + i, y + 70 + k); }
  ctx.stroke(); ctx.restore();
  cbShape(cbP.rr(x + 86, y + 130, 18, 90, 4), '#9aa6b2', { flat: true, shade: 0, lw: 4 });
}
function cbPepper(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbShape(cbP.smooth([[-34, -20], [-10, -36], [10, -36], [34, -20], [36, 18], [20, 40], [0, 34], [-20, 40], [-36, 18]]), '#ee2b22', { bb: [-36, 40], shade: 7 });
  cbShape(cbP.rr(-6, -54, 12, 22, 5), '#3f9a3a', { flat: true, shade: 0, lw: 4 });
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.ellipse(-16, -12, 6, 12, 0.3, 0, TAU); ctx.fill();
  ctx.restore();
}
function cbTray(x, y, w = 200) {
  cbShape(cbP.rr(x - w / 2 + 70, y, 20, 190, 6), '#b9c7d6', { flat: true, shade: 0, lw: 4 });
  cbShape(cbP.rr(x - w / 2, y - 22, w, 30, 10), '#e9eef3', { bb: [y - 22, y + 8], shade: 5 });
}
function cbHeart(x, y, s, c = '#ff5577') {
  cbShape(() => { ctx.moveTo(x, y + s * 0.9); ctx.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.6, y - s * 1.1, x, y - s * 0.35); ctx.bezierCurveTo(x + s * 0.6, y - s * 1.1, x + s * 1.4, y - s * 0.1, x, y + s * 0.9); ctx.closePath(); }, c, { bb: [y - s, y + s], shade: s * 0.18, lw: 4 });
}
// sparkle / pop effects
function cbSparkle(x, y, s, c = '#fff6c2') { ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill(); ctx.restore(); }
function cbBurst(x, y, r0, r1, n, c = 'rgba(255,255,255,0.8)', w = 6) { for (let i = 0; i < n; i++) { const a = i / n * TAU + 0.2; cbLine([[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], { w, c }); } }

// =====================================================================
//  OVERLAYS (screen space, through DEFER): top tag, word captions, age card, fact card, bubbles
// =====================================================================
function cbDefer(f) { if (DEFER) DEFER.push(f); else f(); }
function cbText(str, x, y, size, o = {}) {
  ctx.save(); ctx.font = `${o.weight ?? 900} ${size}px ${CB.font}`; ctx.textAlign = o.align ?? 'center'; ctx.textBaseline = 'alphabetic';
  if (o.stroke) { ctx.lineWidth = o.stroke; ctx.strokeStyle = o.strokeColor ?? CB.line; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); }
  ctx.fillStyle = o.color ?? '#fff'; ctx.fillText(str, x, y); const w = ctx.measureText(str).width; ctx.restore(); return w;
}
function cbTextW(str, size, weight = 900) { ctx.save(); ctx.font = `${weight} ${size}px ${CB.font}`; const w = ctx.measureText(str).width; ctx.restore(); return w; }
// the series tag at the top
function cbTag(str) {
  cbDefer(() => {
    const size = 34, w = cbTextW(str, size) + 56, x = (W - w) / 2, y = 250;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
    ctx.fillStyle = CB.coral; ctx.beginPath(); ctx.roundRect(x, y, w, 60, 30); ctx.fill(); ctx.restore();
    ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = CB.line; ctx.beginPath(); ctx.roundRect(x, y, w, 60, 30); ctx.stroke(); ctx.restore();
    cbText(str, W / 2, y + 42, size, { color: '#fff' });
  });
}
// word-by-word captions: words = [{w,t0,t1}], shows the group containing the current word, highlights it
function cbCaption(words, t, y = 1270) {
  cbDefer(() => {
    let i = words.findIndex((w) => t >= w.t0 - 0.05 && t < w.t1 + 0.25); if (i < 0) return;
    const G = words[i].g, grp = words.filter((w) => w.g === G), size = 92;
    const parts = grp.map((w) => w.w.toUpperCase()), gap = 26, ws = parts.map((p) => cbTextW(p, size));
    let total = ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1), x = (W - total) / 2;
    const fit = Math.min(1, 940 / total), pop = EZ.back(clamp((t - grp[0].t0 + 0.05) / 0.18)), k = fit * (0.85 + 0.15 * pop);
    ctx.save(); ctx.translate(W / 2, y); ctx.scale(k, k); ctx.translate(-W / 2, -y);
    grp.forEach((w, k) => {
      const on = t >= w.t0 - 0.05, cur = on && (k === grp.length - 1 || t < grp[k + 1].t0 - 0.05);
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 8;
      cbText(parts[k], x + ws[k] / 2, y, size, { color: cur ? CB.yellow : '#ffffff', stroke: 18 }); ctx.restore();
      x += ws[k] + gap;
    });
    ctx.restore();
  });
}
// a card with a big line and a source line (fact cards, age cards)
function cbCard(lines, x, y, o = {}) {
  cbDefer(() => {
    const k = EZ.back(clamp((TT - (o.t ?? E0) - 0.05) / 0.3)); if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(o.rot ?? -0.03);
    const pad = 34, sizes = lines.map((l) => l.size), wMax = Math.max(...lines.map((l) => cbTextW(l.text, l.size))) + pad * 2;
    const hT = sizes.reduce((a, b) => a + b * 1.18, 0) + pad * 1.6;
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10;
    ctx.fillStyle = o.bg || '#fffaf0'; ctx.beginPath(); ctx.roundRect(-wMax / 2, -hT / 2, wMax, hT, 22); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.lineWidth = 6; ctx.strokeStyle = CB.line; ctx.stroke();
    let yy = -hT / 2 + pad * 0.8;
    for (const l of lines) { yy += l.size; cbText(l.text, 0, yy, l.size, { color: l.color || CB.line, weight: l.weight ?? 900 }); yy += l.size * 0.18; }
    ctx.restore();
  });
}
// a speech bubble pointing at (tx, ty)
function cbBubble(str, x, y, tx, ty, o = {}) {
  cbDefer(() => {
    const k = EZ.back(clamp((TT - (o.t ?? E0) - 0.05) / 0.25)); if (k <= 0) return;
    const size = o.size || 46, w = cbTextW(str, size) + 60, h = size + 46;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    const path = () => { ctx.roundRect(-w / 2, -h / 2, w, h, 26); };
    ctx.fillStyle = '#fff'; ctx.beginPath(); path(); ctx.moveTo(-18, h / 2 - 2); ctx.lineTo((tx - x) * 0.5, (ty - y) * 0.5); ctx.lineTo(18, h / 2 - 2); ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = CB.line; ctx.beginPath(); path(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-18, h / 2); ctx.lineTo((tx - x) * 0.5, (ty - y) * 0.5); ctx.lineTo(18, h / 2); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillRect(-15, h / 2 - 8, 30, 10);
    cbText(str, 0, size * 0.36, size, { color: CB.line });
    ctx.restore();
  });
}
function cbThought(x, y, r, draw) {   // thought bubble with a drawing inside
  cbDefer(() => {
    const k = EZ.back(clamp((TT - E0 - 0.05) / 0.3)); if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    cbShape(cbP.multi(...Array.from({ length: 10 }, (_, i) => { const a = i / 10 * TAU; return cbP.ell(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.62, r * 0.36, r * 0.32); }), cbP.ell(0, 0, r * 0.9, r * 0.7)), '#ffffff', { flat: true, shade: 0, outer: true });
    cbShape(cbP.ell(r * 0.5, r * 0.95, 22, 18), '#fff', { flat: true, shade: 0 }); cbShape(cbP.ell(r * 0.75, r * 1.2, 13, 11), '#fff', { flat: true, shade: 0 });
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.95, r * 0.72, 0, 0, TAU); ctx.clip(); ctx.translate(-x, -y); draw(); ctx.restore();
    ctx.restore();
  });
}

// =====================================================================
//  STYLE hooks
// =====================================================================
const STYLE = {
  name: 'chibi',
  paper: '#fff7ea',
  backdrop(c) { fillAll(c); },
  window(P, key, src) { ctx.save(); trace(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore(); },
  blob(P, c) { ctx.save(); trace(P, true); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = CB.lw; ctx.strokeStyle = CB.line; ctx.stroke(); ctx.restore(); },
  hero(x, y, r) { cbStar(x, y, r, CB.yellow); },
  heroColor: '#ffd23f',
  post() {   // vignette + fine grain
    ctx.save(); const g = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.35, W / 2, H * 0.5, H * 0.78);
    g.addColorStop(0, 'rgba(30,15,10,0)'); g.addColorStop(1, 'rgba(30,15,10,0.28)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const R = RNG('grain', F % 6); ctx.fillStyle = 'rgba(255,255,255,0.035)';
    for (let i = 0; i < 900; i++) ctx.fillRect(R.r(0, W), R.r(0, H), 2, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.035)'; for (let i = 0; i < 900; i++) ctx.fillRect(R.r(0, W), R.r(0, H), 2, 2);
    ctx.restore();
  },
  ones: true,
};

// =====================================================================
//  SCENES — one function per action; p = shot params (p.base = the action's start, p.end, p.setup 1|2),
//  lt = TT - p.base. Every scene: a set, centred characters doing something, then the tag and the caption.
//  SCENE_CAM[name] = { focus: [x, y] (world point the camera keeps / pushes to), z1, z2, shake }.
// =====================================================================
const SCENES = {}, SCENE_CAM = {};
const TAG = 'POR QUE É CHATO…';
function scene(name, cam, fn) {
  SCENE_CAM[name] = cam || {};
  SCENES[name] = (p) => {
    const lt = TT - p.base; fn(p, lt, p.end - p.base);
    // chapter cuts open on a white flash; every other cut on a short soft flash
    const e = TT - E0, chap = CHAPTER(name) && p.setup === 1, a = chap ? 0.85 * (1 - e / 0.25) : 0.25 * (1 - e / 0.1);
    if (a > 0) cbDefer(() => { ctx.save(); ctx.fillStyle = `rgba(255,252,240,${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); });
    cbTag(TAG); cbCaption(WORDS, TT, CAP_Y);
  };
}
const sparkRing = (x, y, r, n = 8, s = 20) => { for (let i = 0; i < n; i++) { const a = i / n * TAU + TT * 1.5; cbSparkle(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8, s + 8 * Math.sin(TT * 7 + i)); } };
const motionLines = (x, y, dir, a = 1) => { for (let i = 0; i < 4; i++) cbLine([[x - dir * (60 + i * 8), y - 120 + i * 80], [x - dir * (220 + i * 30), y - 120 + i * 80]], { w: 8, c: `rgba(255,255,255,${0.8 * a})` }); };
const puffs = (x, y, lt, n = 5) => { for (let i = 0; i < n; i++) { const u = mod(lt * 1.2 + i / n, 1); cbShape(cbP.ell(x + Math.sin(i * 2.3) * 60, y - u * 160, 26 + u * 30, 22 + u * 26), '#ffffff', { flat: true, shade: 0, lw: 4, alpha: 1 - u }); } };
function heldBaby(x, y, s, o) { cbBaby(x, y, s, o); }
const PSCALE = 1.22;   // everyone a bit bigger: characters fill the frame like the reference
function personAt(x, y, s, P) { return cbPerson(x, y, s * PSCALE, P); }

// ---------------------------------------------------------------- birth
scene('title', { focus: [540, 900] }, (p, lt) => {
  setCard('#ffd9c7');
  cbGlow(540, 800, 600, '#ffffff', 0.5);
  const k = EZ.back(clamp(lt / 0.35)), wob = Math.sin(lt * 9) * 0.06 * (1 - clamp(lt / 0.8));
  cbCalendar(540, 740, 1.35 * (0.3 + 0.7 * k), 9, { rot: wob, circle: clamp((lt - 0.35) / 0.45) });
  const up = EZ.back(clamp((lt - 0.3) / 0.35));
  cbBaby(540, 1290 - 170 * up, 1.25, { eyes: 'open', mouth: 'o', blanket: CB.coral });
  sparkRing(540, 760, 380, 10, 22);
});
scene('cribBaby', { focus: [540, 950] }, (p, lt) => {
  setNursery();
  ctx.save(); ctx.translate(540, FEET); ctx.rotate(Math.sin(lt * 5) * 0.05); ctx.translate(-540, -FEET);
  cbCrib(540, FEET, 1.9, false);
  const pop = EZ.back(clamp((lt - 0.15) / 0.3));
  cbBaby(540, FEET - 300 - 60 * pop, 1.2, { eyes: pop > 0.5 ? 'wide' : 'closed', mouth: 'o', blanket: CB.coral });
  cbShape(cbP.rr(540 - 304, FEET - 114, 608, 42, 16), '#fdfeff', { bb: [FEET - 114, FEET - 72], shade: 5 });   // the crib rail in front of the baby
  ctx.restore();
  const q = popS(p.base + 0.35); if (q > 0) { ctx.save(); ctx.translate(700, 620); ctx.scale(q, q); ctx.rotate(Math.sin(lt * 8) * 0.15); cbText('?', 0, 60, 200, { color: CB.yellow, stroke: 16 }); ctx.restore(); }
});
scene('nurseLift', { focus: [540, 850], z1: 1.02 }, (p, lt) => {
  setHospital({ monitor: true });
  const up = EZ.io(clamp((lt - 0.1) / 0.45));
  const n = personAt(540, FEET, 1.02, NURSE({ eyes: 'happy', mouth: 'grin', arms: up > 0.5 ? ['high', 'high'] : ['front', 'front'] }));
  const chest = n.chest;
  cbGlow(540, lerp(chest, n.hands, up) - 80, 260 * up + 1, '#fff4c2', 0.8 * up);
  cbBaby(540, lerp(chest, n.hands - 80, up), 1.45, { eyes: 'happy', mouth: 'grin', blanket: CB.coral });
  if (up > 0.6) sparkRing(540, n.hands - 70, 200, 8, 18);
});
scene('calendar9', { focus: [540, 760] }, (p, lt) => {
  if (p.from === 'hospital2') setHospital({ monitor: false }); else setHospital({ monitor: false });
  const day = Math.min(9, 1 + Math.floor(lt * 13)), flip = day < 9 ? mod(lt * 13, 1) : 0;
  cbCalendar(540, 640, 1.15, day, { circle: day === 9 ? clamp((lt - 0.7) / 0.4) : 0, flip, rot: Math.sin(lt * 20) * 0.02 * (day < 9) });
  const girl = p.from === 'hospital2';
  cbCrib(540, FEET + 40, 1.45, true, { blanket: girl ? CB.pink : CB.coral, bow: girl ? '#ff5f8f' : null, eyes: 'happy' });
  if (day === 9) sparkRing(540, 640, 300, 8, 16);
});
scene('dadDoor', { focus: [540, 900] }, (p, lt) => {
  setHospital({ door: true, monitor: false });
  const leo = p.who === 'leo';
  const x = springMove(p.base, -260, 540, SPRING.playful), moving = Math.abs(540 - x) > 30;
  // the door swings open
  const op = EZ.o3(clamp(lt / 0.2));
  ctx.save(); ctx.translate(70, 520); ctx.scale(1 - op * 0.75, 1); cbShape(cbP.rr(0, 0, 300, 620, 12), '#f7f2ea', { bb: [0, 620], shade: 8 }); cbShape(cbP.rr(30, 40, 240, 120, 8), '#9fc7e6', { flat: true, shade: 0, lw: 4 }); ctx.restore();
  if (moving) motionLines(x, FEET - 400, 1, 1);
  const arrived = lt > 0.55;
  const P = leo ? LEO(30, { top: { type: 'sweater', color: '#d8322c' } }) : PAI();
  personAt(x, FEET + hop(lt, 3.2, arrived ? 24 : 40), 1.05, { ...P, eyes: arrived ? 'happy' : 'open', mouth: arrived ? 'shout' : 'grin', lean: moving ? 0.12 : Math.sin(lt * 6) * 0.03, arms: arrived ? ['up', 'up'] : ['down', 'point'] });
  if (arrived) { sparkRing(540, FEET - 500, 330, 10, 20); cbConfetti('door' + p.who, 26); }
});
scene('sweaterPose', { focus: [540, 1060], z1: 1.08, z2: 1.5 }, (p, lt) => {
  setRadial('#ffe1d6', '#ffcfbf', { cy: 1000 });
  const beat = Math.floor(lt * 2.4) % 2;
  personAt(540, FEET, 1.12, PAI({ eyes: 'happy', mouth: 'grin', arms: beat ? ['hip', 'up'] : ['up', 'hip'], lean: (beat ? 1 : -1) * 0.07, brows: 0.5 }));
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + lt * 2; cbStar(540 + Math.cos(a) * 280, 1060 + Math.sin(a) * 200, 18 + 6 * Math.sin(lt * 8 + i), i % 2 ? CB.yellow : '#ffffff'); }
  cbText('✦', 540 + Math.sin(lt * 5) * 60, 980, 60, { color: '#fff' });
});
scene('liftBaby', { focus: [540, 760], z1: 1.04, z2: 1.32, shake: true }, (p, lt) => {
  setHospital({ monitor: true });
  const leo = p.who === 'leo';
  // the bed behind, mother / wife resting
  const top = cbBed(640, FLOOR + 60, 440);
  personAt(860, top + 150, 0.72, { ...(leo ? ESPOSA() : MAE({ top: { type: 'gown', color: '#bfe3ff' } })), noShadow: true, eyes: 'happy', mouth: 'smile', arms: ['down', 'wave'] });
  cbShape(cbP.rr(636, top + 20, 448, 130, 40), '#ffffff', { bb: [top, top + 150], shade: 12 });
  const shout = p.phase === 'shout', up = shout ? 1 : EZ.io(clamp((lt - 0.15) / 0.5));
  const P = leo ? LEO(30, { top: { type: 'sweater', color: '#d8322c' } }) : PAI();
  const d = personAt(500, FEET + (shout ? hop(lt, 2.6, 22) : 0), 1.05, { ...P, eyes: 'happy', mouth: shout ? 'shout' : 'grin', arms: up > 0.5 ? ['high', 'high'] : ['front', 'front'] });
  const chest = d.chest, by = lerp(chest, d.hands - 85, up) + (shout ? Math.sin(lt * 7) * 10 : 0);
  if (up > 0.7) cbGlow(500, by, 280, '#fff4c2', 0.7);
  const bow = shout ? popS(p.base + 0.25) : 0;
  cbBaby(500, by, 1.5, { eyes: 'happy', mouth: 'grin', blanket: leo ? CB.pink : CB.coral });
  if (bow > 0) { ctx.save(); ctx.translate(500, by - 150); ctx.scale(bow, bow); cbBow(0, 0, 1.7, leo ? '#ff5f8f' : CB.red); ctx.restore(); }
  if (shout) { sparkRing(500, by, 240, 10, 20); cbConfetti('lift' + p.who, 40); }
});
scene('blushBed', { focus: [540, 880], z1: 1.1, z2: 1.45 }, (p, lt) => {
  setHospital({ monitor: true });
  const top = cbBed(250, FLOOR + 200, 580);
  const red = EZ.io(clamp(lt / 1.0)), esp = p.who === 'esposa';
  const P = esp ? ESPOSA() : MAE({ top: { type: 'gown', color: '#bfe3ff' } });
  personAt(540, top + 170, 1.0, { ...P, noShadow: true, red, eyes: red > 0.5 ? 'closed' : 'happy', mouth: red > 0.5 ? 'wavy' : 'smile', arms: red > 0.3 ? ['cheek', 'cheek'] : ['down', 'down'], sq: Math.sin(lt * 10) * 0.01 * red });
  cbShape(cbP.rr(240, top + 40, 600, 160, 44), '#ffffff', { bb: [top, top + 200], shade: 14 });
  if (red > 0.6) { puffs(360, top - 620, lt); puffs(720, top - 620, lt + 0.4); }
});
scene('pepper', { focus: [540, 800] }, (p, lt) => {
  setRadial('#ffd6d0', '#ffc3ba', { cy: 800 });
  const esp = p.who === 'esposa';
  const P = esp ? ESPOSA() : MAE();
  cbHead(330, 820, 190, { ...P, red: 1, eyes: 'closed', mouth: 'wavy', key: 'pep' });
  const k = EZ.back(clamp((lt - 0.15) / 0.35));
  cbPepper(760, 820 + hop(lt, 2.5, 30) * k, 3.4 * k);
  const eq = popS(p.base + 0.45); if (eq > 0) { ctx.save(); ctx.translate(545, 850); ctx.scale(eq, eq); cbText('=', 0, 40, 170, { color: '#fff', stroke: 16 }); ctx.restore(); }
  if (esp) { const v = EZ.back(clamp((lt - 0.3) / 0.4)); personAt(540, FEET + 700 - 260 * v, 0.95, VOVO({ eyes: 'happy', mouth: 'grin', arms: ['up', 'up'], lean: Math.sin(lt * 9) * 0.06 })); }
});

// ---------------------------------------------------------------- childhood
const SETS = { home: setHome, class: setClass, store: () => { setStore(); storeGoods('party'); }, bedroom: setBedroom, corridor: setCorridor };
scene('ageCard', { focus: [540, 900] }, (p, lt) => {
  SETS[p.set]();
  const a = p.age, s = LEO_S[a], P = LEO(a);
  const x = springMove(p.base + 0.1, a % 2 ? 1300 : -220, 540, SPRING.playful), j = hop(lt, 2.8, 34);
  const extra = {};
  if (a === 30) Object.assign(extra, { eyes: 'wide', mouth: 'wavy', arms: ['chin', 'down'] });
  else Object.assign(extra, { eyes: 'happy', mouth: 'grin', arms: ['wave', 'down'] });
  personAt(x, FEET + j, s, { ...P, ...extra, lean: Math.abs(x - 540) > 40 ? (a % 2 ? -0.12 : 0.12) : 0 });
  if (a === 5) cbRing(x, FEET + j - 60 * s - 30, 120, 44, CB.yellow);
  if (a === 16) { ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = '#2f3a46'; ctx.beginPath(); ctx.arc(x, FEET + j - (82 + 185 - 18 + 95) * s, 132 * s, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.restore(); }
  cbCard([{ text: a + ' ANOS', size: 120, color: CB.coral }], 540, 560, { t: p.base, rot: -0.04 + Math.sin(lt * 3) * 0.02 });
});
scene('askPool', { focus: [540, 900], z2: 1.35 }, (p, lt) => {
  setHome();
  const tug = Math.sin(lt * 10) * 0.08;
  personAt(680, FEET, 1.0, MAE({ eyes: lt > 0.8 ? 'open' : 'happy', mouth: lt > 0.8 ? 'flat' : 'smile', look: -1, arms: ['down', 'hip'] }));
  personAt(410, FEET + hop(lt, 3, 22), 0.92, { ...LEO(5), eyes: 'wide', mouth: 'grin', arms: ['reach', 'up'], lean: tug + 0.1, look: 1 });
  cbRing(410, FEET + hop(lt, 3, 22) - 85, 115, 42, CB.yellow);
  cbThought(380, 520, 230, () => {
    ctx.fillStyle = '#5cc8f2'; ctx.fillRect(250, 520, 270, 160);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(290 + i * 60 + Math.sin(TT * 4 + i) * 8, 560 + (i % 2) * 40, 22, 6, 0, 0, TAU); ctx.fill(); }
    cbBalloon(300, 420, CB.coral, 0.6); cbBalloon(460, 400, CB.yellow, 0.6); cbRing(380, 600, 50, 18, CB.pink);
  });
});
scene('poolClosed', { focus: [540, 950], z2: 1.4 }, (p, lt) => {
  setOutside();
  // the empty pool behind the gate
  cbShape(cbP.rr(140, FLOOR - 40, 800, 160, 20), '#bfe8f5', { bb: [FLOOR - 40, FLOOR + 120], shade: 10 });
  ctx.fillStyle = 'rgba(80,140,170,0.25)'; for (let i = 0; i < 6; i++) ctx.fillRect(170 + i * 130, FLOOR - 20, 6, 120);
  // the gate
  for (let x = 120; x <= 960; x += 70) cbShape(cbP.rr(x, 620, 26, FEET - 640, 8), '#4f6b7a', { bb: [620, FEET], shade: 5 });
  cbShape(cbP.rr(100, 640, 880, 34, 10), '#4f6b7a', { flat: true, shade: 0, lw: 5 }); cbShape(cbP.rr(100, FEET - 190, 880, 34, 10), '#4f6b7a', { flat: true, shade: 0, lw: 5 });
  // chain + swinging padlock
  const sw = Math.sin(lt * 6) * 0.35 * Math.exp(-lt * 0.6);
  for (let i = 0; i < 7; i++) cbShape(cbP.ell(400 + i * 46, 830 + Math.sin(i * 0.8) * 16, 26, 14, 0.2), '#b8bec4', { flat: true, shade: 0, lw: 4 });
  ctx.save(); ctx.translate(540, 860); ctx.rotate(sw); cbShape(cbP.rr(-60, 40, 120, 110, 18), '#e8b43a', { bb: [40, 150], shade: 8 }); ctx.lineWidth = 14; ctx.strokeStyle = '#b8bec4'; ctx.beginPath(); ctx.arc(0, 40, 40, Math.PI, 0); ctx.stroke(); ctx.restore();
  cbCard([{ text: 'FECHADO', size: 80, color: CB.red }], 540, 520, { t: p.base + 0.1, rot: 0.05 });
  const x = springMove(p.base + 0.2, -250, 540, SPRING.playful), stop = lt > 0.8;
  personAt(x, FEET + 120 + (stop ? 0 : hop(lt, 3.5, 30)), 0.95, { ...LEO(5), eyes: stop ? 'wide' : 'happy', mouth: stop ? 'o' : 'grin', arms: stop ? ['cheek', 'cheek'] : ['up', 'up'], lean: stop ? 0 : 0.14 });
  cbRing(x, FEET + 120 - 90 + (stop ? 0 : hop(lt, 3.5, 30)), 118, 44, CB.yellow);
});
scene('rainCurb', { focus: [540, 950], z1: 1.05 }, (p, lt) => {
  setOutside({ grey: true });
  cbShape(cbP.rr(-40, FEET - 10, W + 80, 60, 6), '#b9c0c6', { bb: [FEET - 10, FEET + 50], shade: 6 });   // curb
  // his own little rain cloud
  cbShape(cbP.multi(cbP.ell(540, 470, 150, 70), cbP.ell(450, 490, 90, 56), cbP.ell(640, 490, 100, 60)), '#7d8794', { bb: [400, 550], shade: 10, outer: true });
  const R = RNG('cl'); ctx.strokeStyle = 'rgba(160,200,255,0.9)'; ctx.lineWidth = 6;
  for (let i = 0; i < 14; i++) { const x = 420 + R.r(0, 240), y = 540 + mod(R.r(0, 600) + lt * 900, 600); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 34); ctx.stroke(); }
  cbRain(0.6);
  personAt(540, FEET, 0.95, { ...LEO(5), eyes: 'teary', mouth: 'frown', arms: ['down', 'down'], lean: Math.sin(lt * 1.5) * 0.03 });
  const deflate = 1 - 0.55 * EZ.io(clamp(lt / 1.4));
  cbRing(540, FEET - 85, 120 * deflate, 44 * deflate, CB.yellow, 0.9 + 0.1 * Math.sin(lt * 20));
  for (let i = 0; i < 3; i++) { const u = mod(lt * 1.5 + i / 3, 1); cbText('~', 680 + u * 80, FEET - 120 - u * 60, 50, { color: '#fff', stroke: 8 }); }
});
scene('classInvites', { focus: [540, 950], z2: 1.3 }, (p, lt) => {
  setClass();
  [240, 540, 840].forEach((x, i) => {
    const up = popS(p.base + 0.1 + i * 0.4);
    const d = personAt(x, FEET - (1 - up) * 0 + hop(lt + i, 2, 12 * up), 0.9, KID(i, { eyes: 'happy', mouth: 'grin', arms: up > 0.5 ? ['high', 'down'] : ['down', 'down'] }));
    if (up > 0.5) { ctx.save(); ctx.translate(x - 0.9 * 118 * 1.08, d.hands - 20); ctx.rotate(Math.sin(lt * 6 + i) * 0.15); ctx.scale(up, up); cbShape(cbP.rr(-60, -40, 120, 80, 8), ['#ffd23f', '#9fe3cf', '#ffb4c8'][i], { bb: [-40, 40], shade: 5 }); cbLine([[-60, -40], [0, 5], [60, -40]], { w: 4 }); ctx.restore(); }
  });
  setDesks(FEET + 40);
});
scene('weekCakes', { focus: [540, 850] }, (p, lt) => {
  setCard('#cfe9ff');
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
  cbShape(cbP.rr(60, 560, 960, 300, 26), '#fffaf0', { bb: [560, 860], shade: 10 });
  days.forEach((d, i) => { const x = 60 + 960 / 7 * (i + 0.5); cbText(d, x, 620, 34, { color: CB.line }); if (i) cbLine([[60 + 960 / 7 * i, 640], [60 + 960 / 7 * i, 840]], { w: 3, c: '#d9d2c4' }); });
  [1, 2, 4, 5].forEach((d, k) => { const t = 0.1 + k * 0.22, y = springMove(p.base + t, 200, 780, SPRING.playful); if (lt > t) cbCupcake(60 + 960 / 7 * (d + 0.5), y, 0.85, [CB.coral, CB.mint, CB.purple, CB.yellow][k]); });
  personAt(540, FEET + 40, 0.95, { ...LEO(7), eyes: 'wide', mouth: 'o', look: Math.sin(lt * 4), arms: ['cheek', 'cheek'] });
});
scene('threeParties', { focus: [540, 950] }, (p, lt) => {
  setOutside();
  [[200, CB.coral], [540, CB.mint], [880, CB.purple]].forEach(([x, c], i) => {
    const k = popS(p.base + 0.05 + i * 0.18); if (k <= 0) return;
    ctx.save(); ctx.translate(x, FLOOR + 100); ctx.scale(k, k);
    cbShape(cbP.rr(-140, -260, 280, 260, 10), '#fff3e0', { bb: [-260, 0], shade: 10 });
    cbShape(cbP.poly([[-170, -250], [0, -400], [170, -250]]), c, { bb: [-400, -250], shade: 10 });
    cbShape(cbP.rr(-40, -130, 80, 130, 8), cbTone(c, -0.2), { flat: true, shade: 0, lw: 4 });
    for (let b = 0; b < 3; b++) cbBalloon(-110 + b * 110, -470 - b * 20 + Math.sin(TT * 3 + b + i) * 14, [CB.yellow, CB.pink, CB.mint][(b + i) % 3], 0.7);
    ctx.restore();
  });
  cbBunting(-20, 300, W + 40);
});
scene('aloneParty', { focus: [540, 950], z2: 1.4 }, (p, lt) => {
  setOutside(); cbFence(FLOOR - 120); cbBunting(-20, 260, W + 40);
  personAt(540, FEET - 20, 1.0, { ...LEO(7), eyes: 'open', mouth: 'frown', arms: ['down', 'down'], sq: -0.02 * Math.sin(lt * 2), look: Math.sin(lt * 1.5) });
  // party hat sliding sideways on his head
  const hy = FEET - 20 - (48 + 112 - 18) - 112 * 0.78 - 112;
  ctx.save(); ctx.translate(540 + 40, hy + 10); ctx.rotate(0.3 + EZ.io(clamp(lt / 1.2)) * 0.5); cbShape(cbP.poly([[-40, 0], [40, 0], [0, -110]]), CB.purple, { bb: [-110, 0], shade: 6 }); ctx.restore();
  // the table with the cake, empty chairs with hats
  cbShape(cbP.rr(160, FEET - 60, 760, 50, 14), '#ffffff', { bb: [FEET - 60, FEET - 10], shade: 6 });
  cbShape(cbP.rr(190, FEET - 10, 700, 220, 10), '#ff9fb5', { bb: [FEET - 10, FEET + 210], shade: 10 });
  cbCupcake(540, FEET - 130, 1.2, CB.yellow);
  for (const cx of [210, 870]) { cbShape(cbP.rr(cx - 50, FEET - 220, 100, 160, 12), '#9fe3cf', { bb: [FEET - 220, FEET - 60], shade: 6 }); cbShape(cbP.poly([[cx - 30, FEET - 230], [cx + 30, FEET - 230], [cx, FEET - 320]]), CB.yellow, { bb: [FEET - 320, FEET - 230], shade: 4 }); }
  cbBalloon(700 + lt * 40, 700 - lt * 260, CB.coral, 0.9);
});
scene('kidsRun', { focus: [540, 950] }, (p, lt) => {
  setOutside(); cbFence(FLOOR - 120);
  personAt(540, FLOOR + 40, 0.8, { ...LEO(7), eyes: 'open', mouth: lt > 0.5 ? 'frown' : 'smile', arms: lt < 0.5 ? ['wave', 'down'] : ['down', 'down'], look: clamp((lt - 0.2) * 2, -1, 1) });
  for (let i = 0; i < 5; i++) { const x = -300 + (lt * 1300) - i * 190; personAt(x, FEET + 80 + hop(lt + i * 0.2, 3, 30), 0.85, KID(i, { eyes: 'happy', mouth: 'grin', arms: ['up', 'up'], lean: 0.15 })); }
  motionLines(-300 + lt * 1300 + 120, FEET - 120, 1, 0.8);
});
function cbPony(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cbFloorShadow(0, 0, 220, 30, 0.3);
  for (const lx of [-120, -60, 60, 120]) cbShape(cbP.rr(lx - 18, -170 + Math.sin(TT * 10 + lx) * 6, 36, 170, 14), '#fbf7ff', { bb: [-170, 0], shade: 5 });
  cbShape(cbP.ell(0, -230, 190, 100), '#fbf7ff', { bb: [-330, -130], shade: 14 });
  cbShape(cbP.cap(140, -270, 200, -400, 50), '#fbf7ff', { bb: [-450, -230], shade: 10 });
  cbShape(cbP.ell(240, -420, 80, 64, 0.3), '#fbf7ff', { bb: [-480, -360], shade: 10 });
  cbShape(cbP.multi(cbP.ell(170, -470, 40, 36), cbP.ell(130, -420, 38, 34), cbP.ell(110, -360, 34, 30), cbP.ell(-180, -250, 40, 60)), '#ff9fd0', { bb: [-500, -200], shade: 8, outer: true });
  ctx.fillStyle = CB.line; ctx.beginPath(); ctx.ellipse(250, -430, 9, 12, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(247, -434, 3.5, 0, TAU); ctx.fill();
  cbGlow(270, -400, 40, '#ff6f7d', 0.6);
  cbShape(cbP.poly([[190, -470], [250, -480], [215, -600]]), CB.yellow, { bb: [-600, -470], shade: 5 }); cbShape(cbP.ell(215, -604, 14, 14), CB.coral, { flat: true, shade: 0, lw: 3 });
  ctx.restore();
}
scene('pony', { focus: [540, 950] }, (p, lt) => {
  setOutside(); cbFence(FLOOR - 120); cbBunting(-20, 260, W + 40);
  cbPony(500, FEET + hop(lt, 2.4, 26), 1.1);
  [[150, 0], [930, 1], [330, 2], [760, 3]].forEach(([x, i]) => personAt(x, FEET + 160 + hop(lt + i * 0.3, 3, 40), 0.78, KID(i, { eyes: 'happy', mouth: 'shout', arms: ['up', 'up'] })));
  cbConfetti('pony', 40);
});
scene('shrug', { focus: [540, 900], z1: 1.1 }, (p, lt) => {
  setRadial('#c9f0e2', '#b6e8d6');
  const k = EZ.back(clamp(lt / 0.3));
  personAt(540, FEET, 1.15, { ...LEO(7), eyes: 'happy', mouth: 'flat', arms: k > 0.5 ? ['up', 'up'] : ['down', 'down'], lean: Math.sin(lt * 4) * 0.08, brows: 0.6 });
  cbText('?', 300 + Math.sin(lt * 6) * 10, 640, 140, { color: '#fff', stroke: 14 }); cbText('?', 790, 600 + Math.sin(lt * 6) * 10, 110, { color: '#fff', stroke: 12 });
});
// ---------------------------------------------------------------- the numbers
function cribRows(seed, n = 3, y0 = 900) {
  for (let r = 0; r < n; r++) { const s = 0.7 + r * 0.25, y = y0 + r * 230; for (let i = -1; i < 5; i++) { const x = (i + 0.5) * 260 + (r % 2) * 130 - 130; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(TT * 4 + i + r) * 0.03); ctx.translate(-x, -y); cbCrib(x, y, s); ctx.restore(); } }
}
scene('nurseryPacked', { focus: [540, 1000] }, (p, lt) => {
  setNursery();
  cribRows('np', 3, 1000);
  const x = mod(lt * 900, 1600) - 260; personAt(x, FEET + 330, 0.85, NURSE({ eyes: 'wide', mouth: 'o', arms: ['front', 'front'], lean: 0.15 }));
  motionLines(x, FEET + 50, 1, 0.8);
});
scene('flagUS', { focus: [540, 900] }, (p, lt) => {
  setNursery();
  cbFlagUS(360, 330, 1.25);
  cribRows('us', 2, 1150);
});
scene('cupcakes', { focus: [540, 1000], z2: 1.25 }, (p, lt) => {
  setCard('#ffe6ef');
  cbCard([{ text: '9 DOS 10', size: 110, color: CB.coral }, { text: 'ANIVERSÁRIOS MAIS COMUNS', size: 42 }, { text: 'DOS EUA SÃO EM SETEMBRO', size: 42 }, { text: 'FiveThirtyEight · CDC/SSA 1994–2014', size: 24, weight: 600, color: '#8a7a70' }], 540, 520, { t: p.base });
  for (let i = 0; i < 10; i++) { const t = 0.3 + i * 0.12; if (lt < t) continue; const x = 160 + (i % 5) * 190, y = 1000 + Math.floor(i / 5) * 230 + hop(lt - t, 1.5, 10); const k = EZ.back(clamp((lt - t) / 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); cbCupcake(0, 0, 1.05, i === 9 ? CB.mint : CB.coral); ctx.restore(); }
});
scene('calendarRain', { focus: [540, 900] }, (p, lt) => {
  setCard('#d9f0ff');
  cbCalendar(540, 800, 1.5, '', { rot: Math.sin(lt * 6) * 0.03 });
  for (let i = 0; i < 9; i++) { const t = i * 0.12, y = Math.min(springMove(p.base + t, -200, 860 + (i % 3) * 120, SPRING.playful), 2000); if (lt > t) cbCupcake(380 + (i % 3) * 160, y - 60, 0.75, [CB.coral, CB.yellow, CB.mint][i % 3]); }
  for (let i = 0; i < 5; i++) cbBalloon(150 + i * 200, 1500 - lt * 500 - i * 60, [CB.coral, CB.yellow, CB.mint, CB.pink, CB.purple][i], 0.8);
});
scene('day9', { focus: [540, 760] }, (p, lt) => {
  setHospital({ monitor: false });
  for (let i = 0; i < 2; i++) { const x = i ? 1300 - mod(lt * 1100, 1700) : mod(lt * 1000, 1700) - 300; personAt(x, FEET + 100, 0.8, NURSE({ eyes: 'wide', mouth: 'o', arms: ['front', 'front'], lean: i ? -0.15 : 0.15, key: 'n' + i })); cbCrib(x + (i ? -150 : 150), FEET + 110, 0.8); }
  cbCalendar(540, 680, 1.25, 9, { circle: clamp(lt / 0.5), rot: -0.03 });
  sparkRing(540, 680, 320, 8, 18);
});
scene('babySea', { focus: [540, 960], z2: 1.2 }, (p, lt) => {
  setCard('#e9f4ff');
  const off = lt * 160;
  for (let r = -2; r < 10; r++) for (let c = 0; c < 5; c++) {
    const x = 110 + c * 215 + (r % 2) * 50, y = mod(r * 230 + off, 2300) - 200;
    cbShape(cbP.rr(x - 90, y - 110, 180, 220, 30), '#ffffff', { bb: [y - 110, y + 110], shade: 8 });
    cbHead(x, y - 20, 50, { skin: [CB.skin.light, CB.skin.tan, CB.skin.brown, CB.skin.dark][(r + c + 8) % 4], hair: { style: 'tuft', color: CB.hair.brown }, eyes: (r + c) % 3 ? 'closed' : 'happy', mouth: 'smile', key: 'bs' + r + c });
    cbShape(cbP.rr(x - 70, y + 20, 140, 70, 24), [CB.mint, CB.pink, '#bfe3ff', CB.yellow][(r * 3 + c + 20) % 4], { bb: [y + 20, y + 90], shade: 5 });
  }
  const n = Math.round(12301 * EZ.o3(clamp(lt / 1.2)));
  cbCard([{ text: n.toLocaleString('pt-BR'), size: 130, color: CB.coral }, { text: 'BEBÊS NUM SÓ 9 DE SETEMBRO', size: 40 }, { text: 'média 1994–2014 · FiveThirtyEight', size: 24, weight: 600, color: '#8a7a70' }], 540, 560, { t: p.base });
});
scene('ukWard', { focus: [540, 950], z2: 1.3 }, (p, lt) => {
  setNursery({ flag: 'uk' });
  cribRows('uk', 2, 1180);
  personAt(540, FEET - 120, 0.95, NURSE({ top: { type: 'shirt', color: '#2b4ea2' }, pants: '#2b4ea2', eyes: 'happy', mouth: 'smile', arms: ['front', 'wave'], key: 'uknurse' }));
});
scene('medal', { focus: [540, 900], z2: 1.35 }, (p, lt) => {
  setRadial('#ffe9a8', '#ffdc7a');
  cbShape(cbP.rr(330, FEET - 160, 420, 220, 16), '#fffaf0', { bb: [FEET - 160, FEET + 60], shade: 10 });
  cbText('1', 540, FEET + 10, 140, { color: CB.yellow, stroke: 12 });
  const b = hop(lt, 2, 20);
  cbBaby(540, FEET - 300 + b, 1.4, { eyes: 'happy', mouth: 'grin', blanket: '#bfe3ff' });
  const mk = popS(p.base + 0.3); if (mk > 0) { ctx.save(); ctx.translate(540, FEET - 260 + b); ctx.scale(mk, mk); cbLine([[-60, -80], [0, 20], [60, -80]], { w: 10, c: '#d8322c' }); cbShape(cbP.ell(0, 40, 42, 42), '#ffc928', { bb: [0, 80], shade: 8 }); cbStar(0, 40, 22, '#fff3a8'); ctx.restore(); }
  cbCard([{ text: '26 DE SETEMBRO', size: 84, color: CB.coral }, { text: 'O ANIVERSÁRIO MAIS COMUM', size: 38 }, { text: 'Inglaterra e País de Gales · ONS 1995–2014', size: 24, weight: 600, color: '#8a7a70' }], 540, 520, { t: p.base + 0.15 });
  cbConfetti('medal', 50);
});
// ---------------------------------------------------------------- age 9: the party shopping
function cbCart(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const wx of [-90, 90]) cbShape(cbP.ell(wx, -20, 26, 26), '#3a3a3a', { flat: true, shade: 0, lw: 4 });
  cbShape(cbP.poly([[-160, -260], [170, -260], [130, -70], [-130, -70]]), 'rgba(200,215,230,0.55)', { flat: true, shade: 0, lw: 6 });
  for (let i = -3; i <= 3; i++) cbLine([[i * 40, -255], [i * 34, -75]], { w: 3, c: '#8796a5' });
  cbLine([[-160, -260], [-230, -330]], { w: 10 });
  ctx.restore();
}
scene('shopList', { focus: [540, 950], z2: 1.4 }, (p, lt) => {
  setStore(); storeGoods('party');
  const x = springMove(p.base, 1300, 560, SPRING.smooth);
  personAt(x, FEET, 1.02, { ...LEO(9), eyes: 'open', mouth: 'smile', arms: ['front', 'front'], look: 0.3, lean: Math.abs(x - 560) > 30 ? -0.1 : 0 });
  const L = 80 + 520 * EZ.o3(clamp((lt - 0.4) / 1.0)), hx = x, hy = FEET - 1.02 * (62 + 140) + 60;
  cbShape(cbP.rr(hx - 70, hy - 20, 140, L, 6), '#fffaf0', { bb: [hy, hy + L], shade: 0 });
  for (let i = 0; i < L / 36 - 1; i++) cbLine([[hx - 50, hy + 16 + i * 36], [hx + 30 - (i % 3) * 14, hy + 16 + i * 36]], { w: 4, c: '#9aa6b2' });
  cbShape(cbP.ell(hx, hy - 20, 74, 16), '#efe6d6', { flat: true, shade: 0, lw: 4 });
  cbCart(x - 360, FEET + 60, 0.9);
});
scene('halloween', { focus: [540, 900], shake: true }, (p, lt) => {
  setStore(); storeGoods('halloween');
  for (let i = 0; i < 4; i++) cbBat(mod(i * 300 + lt * (300 + i * 60), 1400) - 160, 420 + i * 90 + Math.sin(lt * 5 + i) * 40, 0.9);
  const jump = lt < 0.5 ? -Math.sin(clamp(lt / 0.5) * Math.PI) * 120 : 0;
  personAt(540, FEET + jump, 1.05, { ...LEO(9), eyes: 'wide', mouth: 'shout', arms: ['up', 'up'], tint: ['#ffffff', 0.15] });
  const fall = clamp((lt - 0.2) / 0.6); ctx.save(); ctx.translate(700 + fall * 60, 900 + fall * 420); ctx.rotate(fall * 2); cbShape(cbP.rr(-60, -90, 120, 180, 6), '#fffaf0', { flat: true, shade: 0, lw: 4 }); ctx.restore();
  cbPumpkin(160, FEET + 120, 2.0); cbPumpkin(920, FEET + 140, 1.8);
});
scene('cake', { focus: [540, 900], z1: 1.06 }, (p, lt) => {
  setHome();
  const sp = p.spider;
  personAt(540, FEET - 60, 1.02, { ...LEO(9), eyes: sp ? 'open' : 'happy', mouth: sp ? 'flat' : 'grin', brows: sp ? -0.7 : 0, arms: sp ? ['down', 'down'] : ['up', 'up'], look: sp ? 0 : 0 });
  ctx.save(); ctx.translate(0, 130);
  cbShape(cbP.rr(150, FEET - 40, 780, 50, 14), '#ffffff', { bb: [FEET - 40, FEET + 10], shade: 6 });
  cbShape(cbP.rr(180, FEET + 10, 720, 260, 10), '#ffcf86', { bb: [FEET + 10, FEET + 270], shade: 10 });
  // the cake
  cbShape(cbP.rr(380, FEET - 250, 320, 220, 30), '#7a4a2a', { bb: [FEET - 250, FEET - 30], shade: 12 });
  cbShape(cbP.smooth([[380, FEET - 210], [430, FEET - 250], [540, FEET - 262], [650, FEET - 250], [700, FEET - 210], [660, FEET - 180], [600, FEET - 200], [540, FEET - 170], [480, FEET - 200], [420, FEET - 180]]), '#fff1f5', { bb: [FEET - 260, FEET - 170], shade: 6 });
  for (let i = 0; i < 3; i++) { const cx = 470 + i * 70; cbShape(cbP.rr(cx - 7, FEET - 330, 14, 80, 4), [CB.coral, CB.yellow, CB.mint][i], { flat: true, shade: 0, lw: 3 }); const fl = 1 + 0.2 * Math.sin(TT * 22 + i); cbShape(cbP.ell(cx, FEET - 345, 10 * fl, 17 * fl), '#ffb11f', { flat: true, shade: 0, lw: 3 }); cbGlow(cx, FEET - 345, 60, '#ffd27a', 0.6); }
  ctx.restore();
  if (sp) {   // the plastic spider drops on its thread and bounces
    const y = springMove(p.base, 200, FEET - 170, SPRING.playful);
    cbLine([[540, -100], [540, y - 30]], { w: 3, c: '#e8e8e8' });
    ctx.save(); ctx.translate(540, y);
    for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) cbLine([[sx * 20, -10 + k * 8], [sx * (60 + k * 6), -30 + k * 22 + Math.sin(TT * 12 + k) * 6], [sx * (80 + k * 4), 10 + k * 18]], { w: 6 });
    cbShape(cbP.ell(0, 0, 44, 36), '#2e2430', { bb: [-36, 36], shade: 6 }); cbShape(cbP.ell(0, -36, 26, 22), '#2e2430', { flat: true, shade: 0 });
    for (const sx of [-1, 1]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx * 10, -40, 7, 0, TAU); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(sx * 10, -38, 3.5, 0, TAU); ctx.fill(); }
    ctx.restore();
  } else cbConfetti('cake', 20);
});
// ---------------------------------------------------------------- age 12
scene('signAsk', { focus: [540, 950], z2: 1.35 }, (p, lt) => {
  setClass({ board: 'zodiac' });
  const lean = -0.18 * EZ.back(clamp(lt / 0.4));
  personAt(390, FEET, 1.0, { ...LEO(12), eyes: 'open', mouth: 'smile', look: 1, arms: ['down', 'down'] });
  personAt(720, FEET, 0.98, KID(2, { age: 'kid', eyes: 'open', mouth: 'o', look: -1, lean, arms: ['chin', 'down'] }));
  cbThought(720, 470, 200, () => { ctx.save(); ctx.translate(720, 470); ctx.rotate(TT * 1.2); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; cbShape(cbP.ell(Math.cos(a) * 105, Math.sin(a) * 105, 16, 16), [CB.coral, CB.yellow, CB.mint, CB.purple][i % 4], { flat: true, shade: 0, lw: 3 }); } cbStar(0, 0, 40, CB.yellow); ctx.restore(); });
  setDesks(FEET + 60);
});
scene('virgem', { focus: [540, 860], z1: 1.25 }, (p, lt) => {
  setRadial('#d8e8ff', '#c6dcff', { cy: 820 });
  personAt(540, FEET + 120, 1.25, { ...LEO(12), eyes: lt > 0.3 ? 'happy' : 'open', mouth: 'smile', arms: ['down', 'down'], lean: Math.sin(lt * 3) * 0.04 });
  const k = popS(p.base + 0.2); if (k > 0) { ctx.save(); ctx.translate(540, 560 + Math.sin(lt * 4) * 8); ctx.scale(k, k); ctx.lineWidth = 16; ctx.strokeStyle = CB.yellow; ctx.beginPath(); ctx.ellipse(0, 0, 120, 30, 0, 0, TAU); ctx.stroke(); ctx.restore(); cbGlow(540, 560, 200, '#fff4b0', 0.6 * k); }
  sparkRing(540, 820, 330, 6, 16);
});
scene('classLaugh', { focus: [540, 950], z2: 1.4, shake: true }, (p, lt) => {
  setClass();
  [[110, 0], [300, 1], [780, 2], [970, 3]].forEach(([x, i]) => personAt(x, FLOOR + 90 + hop(lt + i * 0.25, 4, 18), 0.66, KID(i, { age: 'kid', eyes: 'happy', mouth: 'shout', arms: i % 2 ? ['point', 'hip'] : ['hip', 'point'], lean: Math.sin(lt * 12 + i) * 0.06 })));
  setDesks(FLOOR + 160);
  personAt(540, FEET, 1.1, { ...LEO(12), red: EZ.io(clamp(lt / 0.6)), eyes: 'closed', mouth: 'wavy', arms: ['cheek', 'cheek'], sq: 0.02 * Math.sin(lt * 14) });
  for (let i = 0; i < 4; i++) { const k = popS(p.base + 0.1 + i * 0.15); if (k > 0) { ctx.save(); ctx.translate(150 + i * 260, 640 + (i % 2) * 70 + Math.sin(TT * 10 + i) * 10); ctx.scale(k, k); ctx.rotate((i % 2 ? 1 : -1) * 0.15); cbText('HA', 0, 0, 80, { color: CB.yellow, stroke: 14 }); ctx.restore(); } }
});
// ---------------------------------------------------------------- age 16
const MONTHS = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
scene('countBack', { focus: [540, 850], z2: 1.3 }, (p, lt) => {
  setBedroom();
  const n = Math.min(9, Math.floor(lt * 4.6)), m = mod(8 - n, 12);
  cbCalendar(540, 520, 0.85, '', { month: MONTHS[m], head: n === 9 ? '#2f7a4a' : CB.red, flip: n < 9 ? mod(lt * 4.6, 1) : 0 });
  if (n === 9) cbText('🎄', 540, 610, 120, {});
  personAt(540, FEET, 1.0, { ...LEO(16), eyes: 'open', mouth: n === 9 ? 'o' : 'flat', arms: ['up', 'down'], look: 0 });
  for (let i = 1; i <= n; i++) { const k = popS(p.base + i / 4.6); if (k > 0 && i === n) { ctx.save(); ctx.translate(800, 860); ctx.scale(k, k); cbText(String(i), 0, 0, 150, { color: CB.yellow, stroke: 14 }); ctx.restore(); } }
});
scene('december', { focus: [540, 850] }, (p, lt) => {
  setCard('#1f3b5a');
  cbGlow(540, 800, 700, '#ffe7a8', 0.25);
  cbShape(cbP.poly([[540, 820], [760, 1300], [320, 1300]]), '#2f8a4a', { bb: [820, 1300], shade: 14 });
  cbShape(cbP.poly([[540, 700], [720, 1050], [360, 1050]]), '#38a055', { bb: [700, 1050], shade: 12 });
  cbStar(540, 690, 50 + 6 * Math.sin(lt * 8), CB.yellow); cbGlow(540, 690, 140, '#fff0a0', 0.7);
  for (let i = 0; i < 14; i++) { const x = 380 + (i * 53) % 320, y = 880 + Math.floor(i / 4) * 110; const on = (i + Math.floor(lt * 6)) % 3; ctx.fillStyle = [CB.coral, CB.yellow, '#5bc0ff'][i % 3]; ctx.globalAlpha = on ? 1 : 0.35; ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
  const R = RNG('snow'); ctx.fillStyle = '#fff'; for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(R.r(0, W) + Math.sin(TT + i) * 20, mod(R.r(0, H) + TT * 120, H), R.r(4, 9), 0, TAU); ctx.fill(); }
  cbCard([{ text: 'DEZEMBRO', size: 90, color: '#2f7a4a' }], 540, 470, { t: p.base });
});
scene('dadThought', { focus: [540, 900] }, (p, lt) => {
  setBedroom();
  personAt(540, FEET + 120, 0.95, { ...LEO(16), eyes: 'open', mouth: 'o', arms: ['chin', 'down'], look: -0.5 });
  cbThought(540, 620, 330, () => {
    ctx.fillStyle = '#ffe6dc'; ctx.fillRect(100, 300, 900, 700);
    const b = Math.floor(TT * 4) % 2;
    cbPerson(540, 860 + hop(TT, 2, 16), 0.62, PAI({ eyes: 'happy', mouth: 'grin', arms: b ? ['up', 'hip'] : ['hip', 'up'], lean: b ? 0.1 : -0.1, key: 'paith' }));
    for (let i = 0; i < 4; i++) cbHeart(300 + i * 160, 420 + Math.sin(TT * 4 + i) * 20, 22, '#ff5577');
  });
});
scene('ohNo', { focus: [540, 800], z1: 1.15, shake: true }, (p, lt) => {
  setRadial('#c9f2b0', '#b4e897', { cy: 800 });
  const g = EZ.io(clamp(lt / 0.5));
  personAt(540, FEET + 200, 1.35, { ...LEO(16), tint: ['#8ad66a', 0.55 * g], eyes: 'wide', mouth: 'shout', arms: ['cheek', 'cheek'], sq: 0.03 * Math.sin(lt * 30) });
  for (let i = 0; i < 3; i++) cbBurst(540, 760, 330 + i * 10, 420 + i * 10, 14, 'rgba(255,255,255,0.8)', 8);
});
// ---------------------------------------------------------------- age 20
scene('apartment', { focus: [540, 950], z2: 1.4 }, (p, lt) => {
  setApartment();
  personAt(540, FEET, 1.0, { ...LEO(20), eyes: lt > 1 ? 'closed' : 'open', mouth: 'frown', arms: ['front', 'front'], lean: Math.sin(lt * 1.2) * 0.04 });
  const hy = FEET - (92 + 215) + 110;
  cbCupcake(540, hy, 0.9, CB.coral);
});
scene('boxArrives', { focus: [540, 1000], z2: 1.35 }, (p, lt) => {
  setApartment();
  const y = springMove(p.base, -300, FEET + 40, SPRING.playful), land = lt > 0.45;
  if (land) for (let i = 0; i < 6; i++) { const u = clamp((lt - 0.45) / 0.6); cbShape(cbP.ell(540 + (i - 2.5) * 70 * (1 + u), FEET + 30 - u * 40, 30 * (1 - u) + 4, 20 * (1 - u) + 3), '#e8ddd0', { flat: true, shade: 0, lw: 3, alpha: 1 - u }); }
  const x = springMove(p.base + 0.6, 1300, 820, SPRING.playful);
  personAt(x, FEET - 40 + (lt > 0.9 ? hop(lt, 3, 30) : 0), 0.95, { ...LEO(20), eyes: 'wide', mouth: 'grin', arms: lt > 0.9 ? ['up', 'up'] : ['down', 'point'], lean: Math.abs(x - 820) > 30 ? -0.12 : 0 });
  cbBox(540, y, 1.05, 0);
});
scene('boxOpen', { focus: [540, 950], z1: 1.08 }, (p, lt) => {
  setApartment();
  personAt(540, FEET - 120, 0.95, { ...LEO(20), eyes: 'wide', mouth: 'o', arms: ['up', 'up'] });
  const o = EZ.back(clamp((lt - 0.1) / 0.35));
  cbBox(540, FEET + 120, 1.3, o);
  cbRays(330, FEET - 700, 420, 600, 0, 0.35 * o);
  const rise = EZ.back(clamp((lt - 0.35) / 0.5));
  if (rise > 0) { cbGlow(540, FEET - 300, 320, '#fff3c0', 0.8 * rise); cbSweaterFlat(540, FEET - 40 - rise * 130, 0.95); sparkRing(540, FEET - 150 - rise * 100, 280, 10, 18); }
});
scene('note', { focus: [540, 900] }, (p, lt) => {
  setCard('#fff0d8');
  const f = EZ.back(clamp(lt / 0.45));
  ctx.save(); ctx.translate(540, 880); ctx.rotate(-0.06 + Math.sin(lt * 2) * 0.02); ctx.scale(Math.max(0.02, f), 1);
  cbShape(cbP.rr(-360, -280, 720, 560, 18), '#fffdf6', { bb: [-280, 280], shade: 10 });
  ctx.strokeStyle = '#cfe3f2'; ctx.lineWidth = 3; for (let y = -180; y < 260; y += 70) { ctx.beginPath(); ctx.moveTo(-320, y); ctx.lineTo(320, y); ctx.stroke(); }
  if (f > 0.6) { cbText('Ainda é o nosso', 0, -120, 62, { color: '#2b4ea2', weight: 700 }); cbText('melhor presente', 0, -50, 62, { color: '#2b4ea2', weight: 700 }); cbText('de Natal!', 0, 20, 62, { color: '#2b4ea2', weight: 700 }); cbText('— Pai e Mãe', 120, 140, 44, { color: '#2b4ea2', weight: 600 }); cbHeart(-220, 150, 36, '#ff5577'); }
  ctx.restore();
});
scene('readNote', { focus: [540, 880], z2: 1.45 }, (p, lt) => {
  setApartment();
  cbShape(cbP.rr(150, 760, 170, 200, 10), '#8a6143', { bb: [760, 960], shade: 6 });   // a photo of the parents on the wall
  cbShape(cbP.rr(166, 776, 138, 168, 6), '#ffe6dc', { flat: true, shade: 0, lw: 3 });
  cbHead(205, 860, 34, PAI({ eyes: 'happy', mouth: 'smile', key: 'ph1' })); cbHead(268, 864, 32, MAE({ eyes: 'happy', mouth: 'smile', key: 'ph2' }));
  personAt(540, FEET, 1.0, { ...LEO(20), eyes: lt > 0.6 ? 'teary' : 'open', mouth: lt > 1.2 ? 'smile' : 'wavy', arms: ['front', 'front'] });
  const hy = FEET - (92 + 215) + 100;
  ctx.save(); ctx.translate(540, hy); ctx.rotate(-0.05); cbShape(cbP.rr(-90, -60, 180, 120, 8), '#fffdf6', { bb: [-60, 60], shade: 5 }); cbHeart(50, 20, 14, '#ff5577'); ctx.restore();
  for (let i = 0; i < 2; i++) { const u = mod(lt * 1.3 + i * 0.5, 1); if (lt > 0.6) { ctx.fillStyle = 'rgba(120,200,255,0.9)'; ctx.beginPath(); ctx.ellipse(540 + (i ? 46 : -46), FEET - 560 + u * 140, 9, 14, 0, 0, TAU); ctx.fill(); } }
});
scene('loveSept', { focus: [540, 900], z2: 1.35 }, (p, lt) => {
  setApartment();
  cbGlow(540, 900, 700, '#ffd9a0', 0.4);
  personAt(540, FEET + Math.sin(lt * 3) * 6, 1.02, { ...LEO(20), top: { type: 'sweater', color: '#d8322c' }, eyes: 'happy', mouth: 'grin', arms: ['hug', 'hug'], lean: Math.sin(lt * 2.4) * 0.08 });
  for (let i = 0; i < 7; i++) { const u = mod(lt * 0.5 + i / 7, 1); cbHeart(260 + (i * 97) % 560 + Math.sin(TT * 2 + i) * 30, 1200 - u * 900, 20 + 10 * (1 - u), i % 2 ? '#ff5577' : CB.coral); }
  const R = RNG('pet'); for (let i = 0; i < 16; i++) { ctx.fillStyle = '#ffd02e'; ctx.beginPath(); ctx.ellipse(mod(R.r(0, W) + TT * 60, W), mod(R.r(0, H) + TT * 140, H), 10, 6, TT * 2 + i, 0, TAU); ctx.fill(); }
});
// ---------------------------------------------------------------- the science
scene('goodNews', { focus: [540, 900], z1: 1.05 }, (p, lt) => {
  setRadial('#fff0a8', '#ffe27a');
  personAt(540, FEET, 1.05, { ...LEO(20), eyes: 'happy', mouth: 'grin', arms: ['up', 'up'], lean: Math.sin(lt * 8) * 0.05 });
  for (const sx of [-1, 1]) { const k = popS(p.base + 0.1); if (k > 0) { ctx.save(); ctx.translate(540 + sx * 330, 980); ctx.rotate(sx * -0.6); cbShape(cbP.poly([[-30, 0], [30, 0], [0, 140]]), sx < 0 ? CB.purple : CB.coral, { bb: [0, 140], shade: 6 }); ctx.restore(); } }
  cbConfetti('good', 50, 0);
  cbCard([{ text: 'NOTÍCIA BOA!', size: 90, color: '#2f8a4a' }], 540, 520, { t: p.base });
});
const UNIFORM = (i, o = {}) => KID(i, { age: 'kid', top: { type: 'shirt', color: '#2b4ea2' }, pants: '#5a5f6a', shoes: '#2e1f1c', ...o });
function ukRow(lt, crown, base) {
  const order = [[130, 0.62, 0], [330, 0.7, 1], [540, 0.95, 3], [750, 0.72, 2], [950, 0.64, 4]];
  order.forEach(([x, s, i]) => {
    const star = i === 3;
    const d = personAt(x, FEET + (star ? hop(lt, 1.6, 14) : 0), s, UNIFORM(i, { eyes: star ? 'happy' : 'open', mouth: star ? 'grin' : 'smile', arms: star ? ['hip', 'hip'] : ['down', 'down'], look: star ? 0 : (x < 540 ? 1 : -1) }));
    if (star && crown) { const y = springMove(base + 0.1, -200, d.top + 10, SPRING.playful); ctx.save(); ctx.translate(x, Math.min(y, d.top + 10)); cbShape(cbP.poly([[-80, 0], [-80, -70], [-40, -30], [0, -90], [40, -30], [80, -70], [80, 0]]), '#ffc928', { bb: [-90, 0], shade: 6 }); ctx.restore(); if (lt > 0.4) sparkRing(x, d.top - 40, 150, 6, 16); }
  });
}
scene('ukLine', { focus: [540, 950], z2: 1.35 }, (p, lt) => { setUK(); ukRow(lt, false, p.base); });
scene('crown', { focus: [540, 850], z1: 1.12 }, (p, lt) => {
  setUK(); ukRow(lt, true, p.base);
  cbCard([{ text: 'O MAIS VELHO DA TURMA', size: 64, color: '#2b4ea2' }], 540, 520, { t: p.base + 0.2 });
});
scene('testA', { focus: [540, 900], shake: true }, (p, lt) => {
  setCard('#e3f6ea');
  ctx.save(); ctx.translate(540, 920); ctx.rotate(-0.05);
  cbShape(cbP.rr(-300, -400, 600, 800, 14), '#fffdf6', { bb: [-400, 400], shade: 10 });
  for (let i = 0; i < 9; i++) { cbLine([[-240, -280 + i * 75], [140 - (i % 3) * 60, -280 + i * 75]], { w: 6, c: '#c9d3dc' }); cbLine([[180, -290 + i * 75], [200, -270 + i * 75], [240, -310 + i * 75]], { w: 6, c: '#2f8a4a' }); }
  ctx.restore();
  const k = clamp((lt - 0.2) / 0.15), s = 1 + 1.5 * (1 - EZ.o3(k));
  if (lt > 0.2) { ctx.save(); ctx.translate(560, 820); ctx.scale(s, s); ctx.rotate(-0.2); ctx.globalAlpha = k; ctx.lineWidth = 14; ctx.strokeStyle = CB.red; ctx.beginPath(); ctx.arc(0, 0, 170, 0, TAU); ctx.stroke(); cbText('A+', 0, 60, 190, { color: CB.red }); ctx.restore(); }
  for (let i = 0; i < 4; i++) { const q = popS(p.base + 0.5 + i * 0.12); if (q > 0) { ctx.save(); ctx.translate(300 + i * 150, 1300); ctx.scale(q, q); cbStar(0, 0, 40, CB.yellow); ctx.restore(); } }
  cbCard([{ text: 'NOTAS MELHORES, EM MÉDIA', size: 52, color: '#2f8a4a' }, { text: 'IFS · Reino Unido', size: 24, weight: 600, color: '#8a7a70' }], 540, 400, { t: p.base });
});
scene('sepAug', { focus: [540, 950], z2: 1.3 }, (p, lt) => {
  setClass();
  personAt(340, FEET, 1.02, UNIFORM(3, { eyes: 'happy', mouth: 'grin', arms: ['hip', 'up'], lean: Math.sin(lt * 5) * 0.05 }));
  personAt(740, FEET, 0.92, UNIFORM(1, { eyes: 'wide', mouth: 'wavy', arms: ['chin', 'down'], sq: 0.02 * Math.sin(lt * 25) }));
  for (let i = 0; i < 3; i++) { const u = mod(lt * 1.5 + i / 3, 1); ctx.fillStyle = 'rgba(120,200,255,0.9)'; ctx.beginPath(); ctx.ellipse(860 + i * 20, 770 + u * 120, 9, 14, 0, 0, TAU); ctx.fill(); }
  cbCard([{ text: 'SETEMBRO', size: 46, color: '#2f8a4a' }], 340, 560, { t: p.base });
  cbCard([{ text: 'AGOSTO', size: 46, color: CB.red }], 740, 560, { t: p.base + 0.15, rot: 0.05 });
});
// ---------------------------------------------------------------- age 30: the circle closes
scene('corridor', { focus: [540, 950] }, (p, lt) => {
  setCorridor();
  const x = 540 + Math.sin(lt * 3.2) * 170, dir = Math.cos(lt * 3.2);
  personAt(x, FEET, 1.0, { ...LEO(30), eyes: 'wide', mouth: 'wavy', arms: ['chin', 'down'], lean: dir * 0.1, look: dir });
  for (let i = 0; i < 2; i++) { const u = mod(lt * 2 + i / 2, 1); ctx.fillStyle = 'rgba(120,200,255,0.9)'; ctx.beginPath(); ctx.ellipse(x + 150, FEET - 760 + u * 80, 9, 14, 0, 0, TAU); ctx.fill(); }
});
scene('family', { focus: [540, 950] }, (p, lt) => {
  setHospital({ monitor: false });
  const row = [[150, VOVO()], [380, MAE()], [640, LEO(30, { top: { type: 'sweater', color: '#d8322c' } })], [900, ESPOSA()]];
  row.forEach(([x, P], i) => personAt(x, FEET + hop(lt + i * 0.2, 2, 18), 0.78, { ...P, eyes: 'happy', mouth: 'grin', arms: i === 2 ? ['front', 'front'] : ['wave', 'down'] }));
  cbBaby(640, FEET - 0.78 * (92 + 215) + 40, 0.9, { blanket: CB.pink, bow: '#ff5f8f', eyes: 'happy', mouth: 'grin' });
  cbConfetti('fam', 40);
  for (let i = 0; i < 5; i++) cbHeart(200 + i * 170, 560 + Math.sin(TT * 3 + i) * 30, 26, '#ff5577');
});
scene('tagSomeone', { focus: [540, 900] }, (p, lt) => {
  setRadial('#ffd0c0', '#ffbca8');
  personAt(540, FEET, 1.05, { ...LEO(30, { top: { type: 'sweater', color: '#d8322c' } }), eyes: 'happy', mouth: 'grin', arms: ['wave', 'point'], lean: Math.sin(lt * 5) * 0.05 });
  const k = popS(p.base + 0.1); if (k > 0) { ctx.save(); ctx.translate(540, 520); ctx.scale(k, k); ctx.rotate(Math.sin(lt * 5) * 0.05); cbShape(cbP.ell(0, 0, 150, 150), '#ffffff', { bb: [-150, 150], shade: 10 }); cbText('@', 0, 60, 190, { color: CB.coral }); ctx.restore(); }
  cbCard([{ text: 'MARCA ALGUÉM', size: 70, color: CB.coral }], 540, 760, { t: p.base + 0.3 });
});
scene('months', { focus: [540, 900] }, (p, lt) => {
  setCard('#fff0e3');
  const k = EZ.o3(clamp(lt / 0.8));
  for (let i = 0; i < 12; i++) { const a = (i - 5.5) / 12 * 2.2 * k; ctx.save(); ctx.translate(540, 1300); ctx.rotate(a); cbCalendar(0, -520, 0.42, '', { month: MONTHS[i], head: i === 8 ? CB.red : ['#5bc0ff', '#ff9fb5', '#9be37a', '#ffd23f', '#b89cff'][i % 5] }); ctx.restore(); }
  const b = 1 + 0.08 * Math.sin(lt * 9);
  ctx.save(); ctx.translate(540, 1160); ctx.scale(b, b); cbShape(cbP.rr(-220, -60, 440, 120, 60), CB.coral, { bb: [-60, 60], shade: 8 }); cbText('+ SEGUIR', 0, 24, 64, { color: '#fff' }); ctx.restore();
});

const WORDS = [
  { w: 'Nosso', t0: 0.2, t1: 0.5, g: 1 }, { w: 'presente', t0: 0.5, t1: 1.0, g: 1 }, { w: 'de', t0: 1.0, t1: 1.1, g: 1 }, { w: 'Natal!', t0: 1.1, t1: 1.8, g: 1 },
];
function sceneTest() {
  const floorY = 1180;
  cbRoom('#cdeee2', '#e7dccd', floorY, { pattern: 'tiles', tileFrom: 640, floorPattern: 'boards' });
  cbWindow(600, 250, 380, 330, (x, y, w, h) => { cbClouds(x, y, w, h); cbIpe(x + w * 0.55, y + h + 120, 0.75, { key: 'w' }); });
  cbRays(560, 260, 420, 1100, -0.55, 0.16);
  cbMonitor(70, 300);
  // the bed with mom, blushing
  const top = cbBed(560, floorY + 40, 470, { sheet: '#fff' });
  cbPerson(800, top + 150, 0.8, { age: 'adult', skin: CB.skin.dark, hair: { style: 'curly', color: CB.hair.black }, top: { type: 'gown', color: '#bfe3ff' }, eyes: 'closed', mouth: 'wavy', red: 0.85, arms: ['cheek', 'cheek'], key: 'mae' });
  cbShape(cbP.rr(555, top + 20, 480, 140, 40), '#ffffff', { bb: [top, top + 160], shade: 12 });   // blanket over her legs
  cbTray(940, floorY - 160, 170); cbPepper(960, floorY - 210, 0.9);
  // dad lifting the baby high
  const pai = cbPerson(330, floorY + 260, 1.05, { age: 'adult', skin: CB.skin.tan, hair: { style: 'short', color: CB.hair.black }, beard: CB.hair.black, glasses: true,
    top: { type: 'sweater', color: '#d8322c' }, pants: '#2f3e55', shoes: '#4a3428', eyes: 'happy', mouth: 'shout', arms: ['high', 'high'], key: 'pai' });
  const by = pai.hands + Math.sin(TT * 4) * 6;
  cbBaby(330, by - 70, 1.3, { bow: CB.red, eyes: 'happy', mouth: 'grin' });
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + TT; cbSparkle(330 + Math.cos(a) * 190, by - 60 + Math.sin(a) * 150, 18 + 6 * Math.sin(TT * 6 + i)); }
  // foreground: blurred flowers vase + curtain edge for depth
  cbBlurred(7, () => {
    // a crib rail and a vase of flowers, close to the lens
    cbShape(cbP.rr(-40, 1700, 520, 34, 16), '#f3f6f8', { bb: [1700, 1734], shade: 6 });
    for (let i = 0; i < 6; i++) cbShape(cbP.rr(-10 + i * 90, 1730, 22, 300, 10), '#f3f6f8', { bb: [1730, 2030], shade: 5 });
    cbShape(cbP.rr(880, 1700, 150, 260, 40), '#7cc6d9', { bb: [1700, 1960], shade: 12 });
    for (const [fx, fy, fc] of [[900, 1640, CB.yellow], [980, 1610, CB.pink], [1040, 1660, '#ffffff'], [950, 1690, CB.coral]]) cbShape(cbP.multi(...[0, 1, 2, 3, 4].map((k) => cbP.ell(fx + Math.cos(k * 1.256) * 26, fy + Math.sin(k * 1.256) * 26, 22, 18))), fc, { bb: [fy - 50, fy + 50], shade: 6, outer: true });
  });
  cbLightWash(800, 400);
  cbTag('POR QUE É CHATO…');
  cbCaption(WORDS, TT);
}

const WORDS2 = [{ w: 'A', t0: 3.2, t1: 3.3, g: 2 }, { w: 'sala', t0: 3.3, t1: 3.6, g: 2 }, { w: 'inteira', t0: 3.6, t1: 4.0, g: 2 }, { w: 'cai', t0: 4.0, t1: 4.2, g: 3 }, { w: 'na', t0: 4.2, t1: 4.3, g: 3 }, { w: 'gargalhada.', t0: 4.3, t1: 5.0, g: 3 }];
function sceneClass() {
  const floorY = 1160;
  cbRoom('#f6e6c8', '#c9a27a', floorY, { pattern: 'stripes', floorPattern: 'boards' });
  // blackboard with doodles
  cbShape(cbP.rr(150, 260, 780, 380, 18), '#8a6143', { bb: [260, 640], shade: 10 });
  cbShape(cbP.rr(176, 286, 728, 328, 10), '#2f5d4a', { bb: [286, 614], shade: 0 });
  ctx.save(); ctx.globalAlpha = 0.8; cbLine([[260, 380], [330, 330], [400, 380]], { w: 6, c: '#f4f1e6', curve: true }); cbStar(520, 380, 30, '#f4f1e6');
  ctx.globalAlpha = 0.6; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; cbLine([[740 + Math.cos(a) * 60, 420 + Math.sin(a) * 60], [740 + Math.cos(a) * 90, 420 + Math.sin(a) * 90]], { w: 5, c: '#f4f1e6' }); }
  ctx.restore();
  cbShape(cbP.rr(150, 640, 780, 24, 8), '#a57a55', { bb: [640, 664], shade: 4 });
  cbLightWash(200, 300);
  // classmates laughing at the back, Leo red at the front
  const kids = [[150, CB.skin.light, { style: 'long', color: CB.hair.blond }, '#7cc6d9'], [400, CB.skin.dark, { style: 'short', color: CB.hair.black }, '#9be37a'], [700, CB.skin.brown, { style: 'bun', color: CB.hair.black }, '#ffb4c8'], [940, CB.skin.light, { style: 'messy', color: CB.hair.auburn }, '#ffd23f']];
  kids.forEach(([kx, sk, hr, col], i) => {
    const jig = Math.abs(Math.sin(TT * 9 + i)) * 10;
    cbPerson(kx, floorY + 120 - jig, 0.78, { age: 'kid', skin: sk, hair: hr, top: { type: 'shirt', color: col }, eyes: 'happy', mouth: 'grin', arms: [i % 2 ? 'point' : 'hip', i % 2 ? 'hip' : 'point'], key: 'k' + i });
  });
  // desks
  for (const dx of [80, 620]) { cbShape(cbP.rr(dx, floorY + 180, 380, 40, 10), '#d79b5f', { bb: [floorY + 180, floorY + 220], shade: 6 }); for (const lx of [dx + 30, dx + 330]) cbShape(cbP.rr(lx, floorY + 220, 20, 160, 6), '#8a6143', { flat: true, shade: 0, lw: 4 }); }
  cbPerson(540, floorY + 520, 1.15, { age: 'kid', skin: CB.skin.tan, hair: { style: 'messy', color: CB.hair.brown }, top: { type: 'hoodie', color: CB.coral }, eyes: 'closed', mouth: 'wavy', red: 0.9, arms: ['cheek', 'cheek'], key: 'leo' });
  for (let i = 0; i < 4; i++) cbText('HA', 120 + i * 260, 760 + (i % 2) * 70 + Math.sin(TT * 10 + i) * 10, 70, { color: CB.yellow, stroke: 12 });
  cbTag('POR QUE É CHATO…');
  cbCaption(WORDS2, TT);
}

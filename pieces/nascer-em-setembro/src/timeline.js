// split long shots into two set-ups on the word nearest their middle
const SHOT_LIST = [];
SHOT_SRC.forEach(([t0, sc, p], i) => {
  const t1 = i + 1 < SHOT_SRC.length ? SHOT_SRC[i + 1][0] : DURATION;
  const base = { ...p, base: t0, end: t1 };
  if (t1 - t0 > 2.15 && sc !== 'title') {
    const mid = (t0 + t1) / 2, w = WORDS.filter((x) => x.t0 > t0 + 0.9 && x.t0 < t1 - 0.9).sort((a, b) => Math.abs(a.t0 - mid) - Math.abs(b.t0 - mid))[0];
    if (w) { SHOT_LIST.push([t0, sc, { ...base, setup: 1 }]); SHOT_LIST.push([w.t0, sc, { ...base, setup: 2 }]); return; }
  }
  SHOT_LIST.push([t0, sc, { ...base, setup: 1 }]);
});
const ERA_LIST = SHOT_LIST.map(([t0, sc, p], i) => [t0, i + 1 < SHOT_LIST.length ? SHOT_LIST[i + 1][0] : DURATION, () => SCENES[sc](p)]);
const TIMELINE = {
  width: W, height: H, fps: FPS, duration: DURATION, frames: NFRAMES, loop: LOOP_T, safe: SAFE,
  format: 'beat-cut',
  shots: SHOT_LIST.map(([t0, sc, p], i) => ({ id: i + 1, key: sc + '-' + p.setup, era: i, t0, t1: ERA_LIST[i][1], title: sc })),
  cuts: SHOT_LIST.slice(1).map(([t0]) => t0),
  morphs: [],
  cues: { payoff: 86.48 },
  acts: [
    { name: '1 Birth', role: 'setup', t0: 0, t1: 12.2 },
    { name: '2 Childhood', role: 'journey', t0: 12.2, t1: 40.23 },
    { name: '3 Growing up', role: 'journey', t0: 40.23, t1: 71.95 },
    { name: '4 Science', role: 'turn', t0: 71.95, t1: 80.04 },
    { name: '5 The circle', role: 'gift', t0: 80.04, t1: 95.40 },
  ],
  board: [],
  narration: WORDS.map((w) => ({ t: w.t0, t0: w.t0, t1: w.t1, text: w.w })),
};
window.TIMELINE = TIMELINE;

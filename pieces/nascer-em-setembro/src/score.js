  // SCORE BODY — a cheerful ukulele-pop bed under the voice + a sound on every cut and gag (inside buildScore()).
  // Kept quiet (piece.json voice.music) and ducked by export under every spoken line; sad moments drop the drums.
  const T = TIMELINE;
  const BPM = 116, BT = 60 / BPM, BAR = BT * 4;
  const prog = [['D4', 'Fs4', 'A4'], ['A3', 'Cs4', 'E4'], ['B3', 'D4', 'Fs4'], ['G3', 'B3', 'D4']];
  const roots = ['D3', 'A2', 'B2', 'G2'];
  const melody = ['Fs5', 'A5', 'B5', 'A5', 'Fs5', 'E5', 'D5', 'E5', 'Fs5', 'A5', 'D6', 'B5', 'A5', 'Fs5', 'E5', 'D5'];
  const SAD = [[16.6, 18.3], [22.9, 24.2], [58.4, 61.9]];
  const sad = (t) => SAD.some(([a, b]) => t > a && t < b);
  for (let bar = 0; bar * BAR < T.duration - 0.5; bar++) {
    const t0 = bar * BAR, ch = prog[bar % 4];
    to = 'm';
    // ukulele strum: a fast down-strum on 1, 2&, 3, 4& (each string a hair later)
    for (const off of [0, 1.5, 2, 3.5]) {
      const t = t0 + off * BT; if (t > T.duration - 0.3) break;
      const soft = sad(t) ? 0.5 : 1;
      ch.forEach((n, k) => pluck(t + k * 0.012, nz(n), 0.07 * soft, -0.2 + k * 0.2, 0.3, sad(t) ? 1500 : 3000, 0.15));
    }
    // bass on 1 and 3
    for (const off of [0, 2]) bass(t0 + off * BT, nz(roots[bar % 4]), sad(t0) ? 0.05 : 0.09);
    if (sad(t0 + BT)) continue;
    // shaker on 8ths, claps on 2 and 4
    for (let e = 0; e < 8; e++) noiseHit(t0 + e * BT / 2, 0.05, 'highpass', 7000, 0.8, e % 2 ? 0.02 : 0.03, 0.3, 0);
    for (const off of [1, 3]) noiseHit(t0 + off * BT, 0.12, 'bandpass', 1500, 1.4, 0.06, -0.1, 0.25);
    // glockenspiel: a little tune every other bar
    if (bar % 2 === 1) for (let k = 0; k < 4; k++) chime(t0 + k * BT, [nz(melody[(bar * 2 + k) % 16])], 0.03, 0.2);
  }
  to = 's';
  // a soft pop on every cut, a whoosh on slides and chapter cuts, chimes on reveals, the big hit on "Nosso presente de Natal!"
  T.cuts.forEach((c, i) => blip(c, 900 + (i % 5) * 120, 600, 0.08, 0.035));
  [4.38, 83.36, 12.2, 18.3, 40.22, 47.12, 52.98, 60.00, 80.02, 24.16].forEach((t) => sweep(t, t + 0.35, 0.05, 500, 3500, 0));
  [3.9, 38.22, 49.82, 65.62, 75.38, 82.28].forEach((t) => chime(t, [nz('A5'), nz('D6')], 0.06));
  [8.16, 86.46].forEach((t) => { chime(t, [nz('D5'), nz('Fs5'), nz('A5')], 0.1); sub(t, 0.35); noiseHit(t, 0.3, 'highpass', 4000, 0.7, 0.08); });
  [9.9, 88.38, 50.52, 58.52].forEach((t) => noiseHit(t, 0.5, 'bandpass', 1200, 1.2, 0.06, 0, 0, 3000));
  [45.82, 76.98, 25.4].forEach((t) => { sub(t, 0.25); blip(t, 1500, 700, 0.12, 0.06); });

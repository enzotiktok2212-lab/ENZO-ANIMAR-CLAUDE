  // SCORE BODY — a light, bouncy bed under the voice + a sound on every cut and gag (inside buildScore()).
  const T = TIMELINE;
  const BPM = 112, BT = 60 / BPM;
  to = 'm';
  // a ukulele-ish pluck pattern, I–V–vi–IV in D, quiet: the voice sits on top
  const prog = [['D4', 'Fs4', 'A4'], ['A3', 'Cs5', 'E4'], ['B4', 'D4', 'Fs4'], ['G4', 'B4', 'D5']];
  const sad = (t) => (t > 16.6 && t < 18.3) || (t > 22.9 && t < 24.2) || (t > 58.43 && t < 61.83);
  for (let b = 0, t = 0.0; t < T.duration - 0.5; b++, t = b * BT / 2) {
    const ch = prog[Math.floor(b / 8) % 4], n = ch[b % 3];
    if (sad(t) && b % 2) continue;
    pluck(t, nz(n), sad(t) ? 0.05 : 0.08, (b % 2 ? 0.25 : -0.25), 0.28, sad(t) ? 1400 : 2600, 0.2);
    if (b % 8 === 0) bass(t, nz(ch[0]) / 2, 0.07, BT * 3.5);
  }
  to = 's';
  // a soft pop on every cut, a whoosh on slides, chimes on reveals, the big hit on "Nosso presente de Natal!"
  T.cuts.forEach((c, i) => blip(c, 900 + (i % 5) * 120, 600, 0.08, 0.035));
  [4.38, 83.38, 12.2, 18.3, 40.23, 47.13, 52.99, 60.01, 80.04, 24.16].forEach((t) => sweep(t, t + 0.35, 0.05, 500, 3500, 0));
  [3.9, 38.23, 49.83, 65.63, 75.40, 82.30].forEach((t) => chime(t, [nz('A5'), nz('D6')], 0.06));
  [8.16, 86.48].forEach((t) => { chime(t, [nz('D5'), nz('Fs5'), nz('A5')], 0.1); sub(t, 0.35); noiseHit(t, 0.3, 'highpass', 4000, 0.7, 0.08); });
  [9.9, 88.40, 50.53, 58.53].forEach((t) => noiseHit(t, 0.5, 'bandpass', 1200, 1.2, 0.06, 0, 0, 3000));
  [45.83, 77.00, 25.4].forEach((t) => { sub(t, 0.25); blip(t, 1500, 700, 0.12, 0.06); });

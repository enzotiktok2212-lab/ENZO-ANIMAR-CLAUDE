# Efectos de sonido sintetizados + mezcla final.
# python3 sfx.py audio/cues.json audio/voz-sin-silencios.wav audio/musica-fondo.mp3 renders/mezcla.wav
import json, sys, subprocess, numpy as np, wave, hashlib

SR = 44100
def T(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.005, r=0.2, hold=0.0):
    t = T(d); e = np.minimum(1, t / max(a, 1e-4)); dec = np.clip((t - a - hold) / max(r, 1e-4), 0, None)
    return e * np.exp(-dec * 4.6) if r > 0 else e
def adsr(d, a, s_end):
    t = T(d); e = np.minimum(1, t / a); return e * np.clip((d - t) / max(s_end, 1e-3), 0, 1)
def noise(d, seed=0): return np.random.default_rng(seed).normal(0, 1, int(d * SR))
def lp(x, fc):   # paso bajo de 1 polo (fc puede ser array)
    fc = np.broadcast_to(np.asarray(fc, float), x.shape); a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y
def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return hp(lp(x, hi), lo)
def svf_bp(x, fc, q=4.0):   # paso banda resonante (filtro de estado variable)
    fc = np.broadcast_to(np.asarray(fc, float), x.shape); y = np.empty_like(x); lo = band = 0.0
    for i in range(len(x)):
        f = 2 * np.sin(np.pi * min(fc[i], SR / 6) / SR); hi = x[i] - lo - band / q; band += f * hi; lo += f * band; y[i] = band
    return y
def sine(f, d, ph=0):
    f = np.broadcast_to(np.asarray(f, float), (int(d * SR),)); return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
def saw(f, d):
    f = np.broadcast_to(np.asarray(f, float), (int(d * SR),)); p = (np.cumsum(f) / SR) % 1; return 2 * p - 1
def norm(x, p=1.0): m = np.max(np.abs(x)) + 1e-9; return x / m * p
def cat(*xs): return np.concatenate(xs)
def pad(x, d): n = int(d * SR); return np.pad(x, (0, max(0, n - len(x))))[:max(n, len(x))]
def at(dst, x, t):
    i = int(t * SR); j = min(len(dst), i + len(x))
    if i < len(dst) and j > i: dst[i:j] += x[:j - i]
def glide(f0, f1, d, curve=1.0): k = T(d) / d; return f0 + (f1 - f0) * k ** curve

# ---------- familias ----------
def whoosh(d=0.45, up=False, lo=300, hi=3000, seed=1):
    n = noise(d, seed); k = T(d) / d; fc = lo + (hi - lo) * (k if up else (1 - k) ** 0.7 * 0 + np.sin(np.pi * k)) ; return norm(svf_bp(n, fc, 1.2) * np.sin(np.pi * k) ** 1.5)
def impact(d=0.6, f0=110, f1=38, click=0.6, seed=2):
    t = T(d); body = sine(glide(f0, f1, d, 0.4), d) * np.exp(-t * 7); n = lp(noise(d, seed), 1800) * np.exp(-t * 30) * click
    return norm(np.tanh((body + n) * 2.2))
def braam(d=1.6, seed=3):
    t = T(d); f = 55; x = sum(saw(f * m * (1 + 0.003 * i), d) for i, m in enumerate([1, 1.5, 2, 3]))
    x = lp(x, 900 + 1500 * np.exp(-t * 2)) * adsr(d, 0.02, 0.9); sub = sine(glide(60, 40, d), d) * np.exp(-t * 2.5)
    return norm(np.tanh((x * 0.6 + sub) * 2.5) + impact(0.5) * 0.5 * np.pad(np.ones(1), (0, 0))[0])
def riser(d=2.0, seed=4):
    k = T(d) / d; n = svf_bp(noise(d, seed), 400 + 6000 * k ** 2, 2.0) * k ** 2
    tone = sum(sine(glide(180 * m, 720 * m, d, 2), d) for m in (1, 1.5, 2.01)) * k ** 2.2 * 0.4
    trem = 1 + 0.3 * np.sin(2 * np.pi * (4 + 14 * k) * T(d))
    return norm((n + tone) * trem)
def bell(f=880, d=1.6, inh=(1, 2.76, 5.4, 8.93), dec=2.5):
    t = T(d); return norm(sum(sine(f * r, d) * np.exp(-t * dec * (1 + i * 0.6)) / (1 + i) for i, r in enumerate(inh)))
def ding(f=1568, d=0.9): return norm(bell(f, d, (1, 2.0, 3.01, 4.2), 3.5))
def click(d=0.03, f=3000, seed=5): t = T(d); return norm(bp(noise(d, seed), f * 0.5, f * 1.5) * np.exp(-t * 300))
def tick(f=2500, seed=6): return norm(cat(click(0.025, f, seed), np.zeros(int(0.02 * SR))) + 0)
def coins(n=7, d=0.9, seed=7):
    r = np.random.default_rng(seed); out = np.zeros(int(d * SR))
    for i in range(n): at(out, bell(r.uniform(2500, 5200), 0.25, (1, 2.4, 3.9), 14) * r.uniform(.4, 1), r.uniform(0, d - 0.3))
    return norm(out)
def cash(seed=8): out = np.zeros(int(1.0 * SR)); at(out, click(0.05, 1500, seed) * 0.8, 0); at(out, click(0.04, 900, seed + 1) * 0.7, 0.07); at(out, ding(2093, 0.8), 0.12); at(out, coins(5, 0.6, seed) * 0.5, 0.18); return norm(out)
def steps(n=4, gap=0.32, d=None, heavy=False, seed=9, hoof=False):
    d = d or n * gap + 0.3; out = np.zeros(int(d * SR)); r = np.random.default_rng(seed)
    for i in range(n):
        s = impact(0.18, 160 if heavy else 260, 80, 1.2, seed + i) if not hoof else click(0.06, 1800, seed + i)
        at(out, s * r.uniform(.6, 1), i * gap + r.uniform(0, 0.03))
    return norm(out)
def creak(d=0.8, f=420, seed=10):
    t = T(d); f_ = f * (1 + 0.15 * np.sin(2 * np.pi * 3 * t)) * (1 + 0.04 * noise(d, seed)[:len(t)] * 0)
    x = saw(f_, d) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 37 * t))) ; return norm(svf_bp(x, 1200, 3) * adsr(d, 0.05, 0.2))
def voice(f0s, vowels, d, breath=0.15, seed=11, vib=0.0):
    # síntesis por formantes: f0 (curva) + vocales [(F1,F2,F3)] interpoladas
    t = T(d); f0 = np.interp(t, np.linspace(0, d, len(f0s)), f0s) * (1 + vib * np.sin(2 * np.pi * 5.5 * t))
    src = saw(f0, d) * 0.7 + noise(d, seed) * breath
    F = np.array(vowels, float); idx = np.linspace(0, d, len(F))
    out = sum(svf_bp(src, np.interp(t, idx, F[:, j]), 6 + j * 2) / (1 + j) for j in range(3))
    return norm(out * adsr(d, 0.06, 0.25))
A, O, E, I_, U, M = (800, 1200, 2500), (500, 850, 2500), (550, 1850, 2500), (300, 2200, 2900), (320, 800, 2400), (250, 900, 2200)
def yawn(f=180, d=1.4, seed=12): return voice([f * 1.3, f * 1.2, f, f * 0.8, f * 0.6], [E, A, A, O, U], d, 0.3, seed)
def laugh(f=130, n=5, d=None, seed=13):
    d = d or n * 0.18 + 0.2; out = np.zeros(int(d * SR))
    for i in range(n): at(out, voice([f * (1.1 - i * 0.03), f * (0.95 - i * 0.03)], [A, A], 0.14, 0.5, seed + i), i * 0.18)
    return norm(out)
def snore(d=1.6, seed=14):
    t = T(d); inh = lp(noise(d, seed), 700) * np.sin(np.pi * np.clip(t / (d * 0.55), 0, 1)) * (t < d * 0.55)
    rattle = saw(55 + 10 * np.sin(2 * np.pi * 0.5 * t), d) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 28 * t))) * (t < d * 0.55)
    exh = lp(noise(d, seed + 1), 1500) * np.sin(np.pi * np.clip((t - d * 0.6) / (d * 0.4), 0, 1)) * (t >= d * 0.6) * 0.5
    return norm(lp(rattle, 600) * 0.8 + inh + exh)
def music_box(notes, step=0.28, d=None, f0=523.25):
    d = d or len(notes) * step + 1.2; out = np.zeros(int(d * SR))
    for i, n in enumerate(notes):
        if n is None: continue
        at(out, bell(f0 * 2 ** (n / 12), 1.2, (1, 3.0, 5.9, 9.1), 3.2), i * step)
    return norm(out)
BRAHMS = [4, 4, 7, None, 4, 4, 7, None, 4, 7, 12, 11, 9, 9, 7, None, 2, 4, 5, 2, 2, 4, 5, None]   # "Guten Abend, gut' Nacht"
def chord_pad(fs, d, a=0.4, r=0.6, bright=2500):
    x = sum(saw(f * (1 + 0.004 * (i % 3 - 1)), d) for i, f in enumerate(fs)); return norm(lp(x, bright) * adsr(d, a, r))
def chirps(n=5, d=1.2, seed=15):
    r = np.random.default_rng(seed); out = np.zeros(int(d * SR))
    for i in range(n): dd = r.uniform(.06, .12); at(out, sine(glide(r.uniform(3000, 4000), r.uniform(4500, 6500), dd), dd) * np.sin(np.pi * T(dd) / dd), r.uniform(0, d - .15))
    return norm(out)
def crowd(d=1.5, seed=16, f=200, n=8, excited=False):
    r = np.random.default_rng(seed); out = np.zeros(int(d * SR))
    for i in range(n):
        ff = f * r.uniform(.7, 1.6); dd = r.uniform(.4, d)
        v = voice([ff, ff * (1.3 if excited else 1.0), ff * 0.9], [A, E, O] if i % 2 else [O, A, E], dd, 0.4, seed + i, 0.02); at(out, v * r.uniform(.4, 1), r.uniform(0, d - dd))
    return norm(out + lp(noise(d, seed), 2000) * 0.15)

def R(seed, a=0.92, b=1.08): return np.random.default_rng(seed).uniform(a, b)
def shift(x, k):   # cambio de tono por remuestreo (variación entre repeticiones)
    if abs(k - 1) < 1e-3: return x
    n = int(len(x) / k); return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)

# nombre -> (generador(seed, cue), nivel base)
LIB = {
 'whoosh': (lambda s, c: whoosh(0.35, False, 300, 3500, s), .45), 'whoosh_soft': (lambda s, c: whoosh(0.5, False, 200, 1500, s), .22),
 'whoosh_up': (lambda s, c: whoosh(0.5, True, 300, 5000, s), .4), 'swoosh_up': (lambda s, c: whoosh(0.4, True, 500, 6000, s), .42),
 'swipe': (lambda s, c: whoosh(0.22, True, 1500, 7000, s), .38), 'whirl': (lambda s, c: norm(whoosh(0.6, False, 400, 3000, s) * (1 + .6 * np.sin(2 * np.pi * 14 * T(0.6)))), .42),
 'zoom_in': (lambda s, c: whoosh(0.3, True, 800, 4000, s), .2), 'zoom_out': (lambda s, c: whoosh(0.3, False, 600, 3000, s), .2),
 'flash': (lambda s, c: norm(cat(click(0.02, 4000, s), np.zeros(800)) + 0) * 0.6 + 0 if False else norm(np.pad(click(0.02, 4000, s), (0, 4000)) + np.pad(lp(noise(0.12, s), 6000) * np.exp(-T(0.12) * 25), (1500, 0))[:4882]), .45),
 'iris_pop': (lambda s, c: norm(sine(glide(300, 90, 0.25), 0.25) * np.exp(-T(0.25) * 12)), .5), 'thump': (lambda s, c: impact(0.4, 120, 45, 0.8, s), .55),
 'impact': (lambda s, c: impact(0.7, 120, 35, 1.0, s), .7), 'impact_soft': (lambda s, c: impact(0.5, 90, 40, 0.3, s), .45), 'boom': (lambda s, c: impact(1.6, 70, 25, 1.0, s), .85),
 'braam': (lambda s, c: braam(1.6, s), .75), 'riser': (lambda s, c: riser(max(0.4, c.get('d', 2.0)), s), .45),
 'slam': (lambda s, c: impact(0.6, 160, 50, 1.6, s), .7), 'door_slam': (lambda s, c: impact(0.8, 140, 40, 1.8, s), .8), 'table_bang': (lambda s, c: impact(0.5, 200, 70, 1.5, s), .6),
 'land': (lambda s, c: impact(0.4, 150, 60, 1.2, s), .55), 'stamp': (lambda s, c: impact(0.35, 220, 90, 1.3, s), .55), 'fist': (lambda s, c: impact(0.25, 260, 120, 0.5, s), .3),
 'clack': (lambda s, c: norm(click(0.06, 1500, s) + impact(0.5, 180, 60, 1.2, s)), .8), 'slap': (lambda s, c: norm(hp(noise(0.12, s), 1500) * np.exp(-T(0.12) * 45)), .7),
 'trash_hit': (lambda s, c: norm(bell(310, 1.0, (1, 2.3, 3.7, 5.1), 6) + impact(0.4, 140, 60, 1.5, s)), .7), 'metal_hit': (lambda s, c: bell(620, 1.2, (1, 2.7, 4.3), 4), .55),
 'ding_soft': (lambda s, c: ding(1318), .35), 'ding_reveal': (lambda s, c: norm(ding(1568) + ding(2093) * 0.6 + ding(2637) * 0.4), .55), 'pling': (lambda s, c: ding(2637, 0.6), .45),
 'sparkle': (lambda s, c: music_box([12, 16, 19, 24, 28], 0.05, 0.8, 1046.5), .3), 'sunrise_shine': (lambda s, c: norm(chord_pad([261.6, 329.6, 392, 523.3, 659.3], 2.0, 0.5, 0.8, 5000) + music_box([24, 28, 31, 36], 0.12, 2.0)), .55),
 'bell_far': (lambda s, c: lp(bell(392, 2.5, (1, 2.4, 3.9, 5.6), 1.2), 1500), .3), 'bell_big': (lambda s, c: bell(196, 3.0, (1, 2.0, 2.4, 3.0, 4.2), 1.0), .8),
 'bells': (lambda s, c: bell(261.6 * R(s, .9, 1.2), 2.5, (1, 2.0, 2.4, 3.0), 1.1), .55),
 'bells7': (lambda s, c: norm(sum(np.pad(bell(330, 1.5, (1, 2, 2.4, 3), 2.5), (int(i * 0.2 * SR), 0)) [:int(3 * SR)] if True else 0 for i in range(7))), .5),
 'cash': (lambda s, c: cash(s), .55), 'coins': (lambda s, c: coins(8, 0.9, s), .45),
 'tick': (lambda s, c: tick(2500, s), .6), 'tick_hollow': (lambda s, c: norm(np.pad(tick(1200, s), (0, int(.5 * SR))) + np.pad(tick(900, s + 1), (int(.5 * SR), 0))[:int(.5 * SR) + len(tick(1200, s))]), .4),
 'ticks': (lambda s, c: norm(sum(np.pad(tick(1800 + 600 * (i % 3), s + i), (int(i * 0.17 * SR), 0))[:int(2 * SR)] if True else 0 for i in range(10))), .4),
 'silence_tick': (lambda s, c: tick(1500, s) * 0.4, .3), 'watch_click': (lambda s, c: norm(click(0.03, 3500, s) + np.pad(click(0.02, 2000, s + 1), (600, 0))[:1323]), .6),
 'click_metal': (lambda s, c: norm(click(0.05, 2500, s) + bell(1800, 0.3, (1, 2.7), 12) * 0.5), .6), 'click_set': (lambda s, c: norm(click(0.04, 3000, s) + click(0.04, 1500, s + 2)), .6),
 'lid_click': (lambda s, c: click(0.05, 2200, s), .5), 'ratchet': (lambda s, c: norm(sum(np.pad(click(0.02, 2800, s + i), (int(i * 0.06 * SR), 0))[:int(0.8 * SR)] for i in range(12))), .45),
 'gears': (lambda s, c: norm(sum(np.pad(click(0.03, 1400 + 400 * (i % 2), s + i), (int(i * 0.11 * SR), 0))[:int(1.4 * SR)] for i in range(12)) + lp(noise(1.4, s), 300) * 0.3), .45),
 'whistle': (lambda s, c: norm(sine(2600 + 120 * np.sign(np.sin(2 * np.pi * 28 * T(0.7))), 0.7) * adsr(0.7, 0.02, 0.1) + bp(noise(0.7, s), 2000, 4000) * 0.15), .45),
 'whistle_inno': (lambda s, c: norm(sine(np.repeat([1318, 1568, 1318, 1046], int(0.15 * SR)), 0.6) * adsr(0.6, 0.02, 0.1)), .3),
 'alarm': (lambda s, c: norm(sum(bell(2200 * r, 0.06, (1, 2.4), 30) for r in (1, 1.06)) if False else np.tile(norm(bell(2200, 0.05, (1, 2.4, 3.9), 20) + bell(2330, 0.05, (1, 2.4), 20)), 22)), .5),
 'mobile': (lambda s, c: music_box([0, 4, 7, 12, 7, 4], 0.22), .3), 'musicbox2': (lambda s, c: music_box([7, 12], 0.3, 1.2), .45),
 'lullaby': (lambda s, c: music_box(BRAHMS[:12], 0.24), .45), 'lullaby2': (lambda s, c: music_box(BRAHMS[12:], 0.24), .42),
 'piano_note': (lambda s, c: norm(sum(sine(220 * m, 2.0) * np.exp(-T(2.0) * (1.5 + m)) / m for m in (1, 2, 3, 4))), .4),
 'strings': (lambda s, c: chord_pad([196, 246.9, 293.7, 392], 2.0, 0.6, 0.6, 1800), .35), 'tension_str': (lambda s, c: norm(chord_pad([110, 116.5, 164.8], 1.6, 0.3, 0.3, 1400) * (1 + .5 * np.sin(2 * np.pi * 12 * T(1.6)))), .4),
 'choir': (lambda s, c: norm(sum(voice([f, f], [A, O], 2.0, 0.05, s + i, 0.015) for i, f in enumerate([261.6, 329.6, 392]))), .35), 'aah': (lambda s, c: voice([392, 392], [A, A], 1.2, .05, s, .02), .3),
 'heartbeat': (lambda s, c: norm(np.pad(impact(0.25, 60, 40, 0, s), (0, int(.2 * SR))) + np.pad(impact(0.25, 55, 38, 0, s), (int(.2 * SR), 0))), .6),
 'boing_metal': (lambda s, c: norm(sine(900 * (1 + 0.25 * np.sin(2 * np.pi * 9 * T(0.6)) * np.exp(-T(0.6) * 4)), 0.6) * np.exp(-T(0.6) * 5)), .35),
 'spring': (lambda s, c: norm(sine(500 * (1 + 0.4 * np.sin(2 * np.pi * 14 * T(0.4)) * np.exp(-T(0.4) * 8)), 0.4) * np.exp(-T(0.4) * 7)), .4),
 'pop': (lambda s, c: norm(sine(glide(500, 1400, 0.08), 0.08) * np.exp(-T(0.08) * 20)), .4),
 'paper': (lambda s, c: norm(bp(noise(0.25, s), 2000, 8000) * np.abs(np.sin(2 * np.pi * 12 * T(0.25))) * np.exp(-T(0.25) * 6)), .35),
 'pages': (lambda s, c: norm(sum(np.pad(bp(noise(0.12, s + i), 2000, 8000) * np.exp(-T(0.12) * 20), (int(i * 0.14 * SR), 0))[:int(1.8 * SR)] for i in range(12))), .4),
 'cloth': (lambda s, c: norm(bp(noise(0.4, s), 800, 4000) * np.sin(np.pi * T(0.4) / 0.4)), .3), 'blanket': (lambda s, c: norm(lp(noise(0.6, s), 1500) * np.sin(np.pi * T(0.6) / 0.6)), .35),
 'zip': (lambda s, c: norm(sum(np.pad(click(0.01, 3000, s + i), (int(i * 0.012 * SR), 0))[:int(0.5 * SR)] for i in range(35))), .35),
 'rip': (lambda s, c: norm(bp(noise(0.5, s), 1000, 6000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 60 * T(0.5)))) * adsr(0.5, 0.01, 0.15)), .7),
 'metal_rip': (lambda s, c: norm(creak(0.8, 300, s) + bp(noise(0.8, s), 800, 5000) * adsr(0.8, 0.02, 0.3)), .6), 'tape': (lambda s, c: norm(bp(noise(0.35, s), 1500, 7000) * (0.4 + 0.6 * np.sign(np.sin(2 * np.pi * 90 * T(0.35))))), .45),
 'sparks': (lambda s, c: norm(hp(noise(0.6, s), 3000) * (np.random.default_rng(s).random(int(.6 * SR)) > .97)), .3),
 'sprinkle': (lambda s, c: norm(sum(np.pad(click(0.015, 5000, s + i), (int(i * 0.05 * SR), 0))[:int(0.8 * SR)] for i in range(14))), .3),
 'feathers': (lambda s, c: norm(bp(noise(0.8, s), 2000, 6000) * np.sin(np.pi * T(0.8) / 0.8) ** 2), .25),
 'film_roll': (lambda s, c: norm(sum(np.pad(click(0.01, 2000, s + i), (int(i * 0.042 * SR), 0))[:int(1.0 * SR)] for i in range(24)) + lp(noise(1.0, s), 400) * 0.2), .3),
 'pencil': (lambda s, c: norm(bp(noise(0.9, s), 2500, 7000) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * T(0.9))) ** 2), .3),
 'rummage': (lambda s, c: norm(sum(np.pad(impact(0.12, 300, 120, 1.0, s + i) * .5 + click(0.05, 1200, s + i), (int(i * 0.09 * SR), 0))[:int(1.0 * SR)] for i in range(9))), .4),
 'steam': (lambda s, c: norm(hp(noise(1.0, s), 2500) * adsr(1.0, 0.1, 0.4)), .25), 'neon_buzz': (lambda s, c: norm(lp(saw(120, 1.5), 1500) * 0.3 + hp(noise(1.5, s), 4000) * 0.05), .15),
 'door_bell': (lambda s, c: norm(sum(np.pad(bell(2600 + 300 * (i % 2), 0.6, (1, 2.4, 3.9), 6), (int(i * 0.06 * SR), 0))[:int(1.0 * SR)] for i in range(6))), .35),
 'cup_marble': (lambda s, c: norm(bell(3100, 0.3, (1, 2.2, 3.5), 18) + click(0.03, 1800, s)), .4), 'porcelain': (lambda s, c: bell(3500 * R(s), 0.35, (1, 2.1, 3.3), 14), .3),
 'cup_rattle': (lambda s, c: norm(sum(np.pad(bell(3300 + 200 * (i % 3), 0.15, (1, 2.1), 25), (int(i * 0.05 * SR), 0))[:int(0.6 * SR)] for i in range(8))), .35),
 'porcelain_break': (lambda s, c: norm(sum(np.pad(bell(np.random.default_rng(s + i).uniform(2500, 5000), 0.3, (1, 2.3, 3.7), 12), (int(np.random.default_rng(s + i).uniform(0, .4) * SR), 0))[:int(.8 * SR)] for i in range(14)) + impact(0.3, 400, 200, 2, s)), .6),
 'spoon': (lambda s, c: norm(sum(np.pad(bell(4200, 0.12, (1, 2.4), 30), (int(i * 0.09 * SR), 0))[:int(.6 * SR)] for i in range(5))), .3),
 'sip': (lambda s, c: voice([120, 110], [U, U], 0.3, 1.5, s), .3), 'gulp': (lambda s, c: norm(sine(glide(300, 120, 0.15), 0.15) * np.exp(-T(0.15) * 12) + lp(noise(0.15, s), 800) * .3), .45),
 'steps': (lambda s, c: steps(4, 0.35, seed=s), .35), 'steps_heavy': (lambda s, c: steps(5, 0.38, heavy=True, seed=s), .45), 'steps_run': (lambda s, c: steps(6, 0.15, seed=s), .45),
 'run_cobble': (lambda s, c: steps(9, 0.14, seed=s), .5), 'hooves': (lambda s, c: steps(6, 0.18, hoof=True, seed=s), .35),
 'crowd_run': (lambda s, c: norm(sum(steps(10, 0.13 + 0.01 * i, seed=s + i) for i in range(5)) + crowd(1.5, s, 200, 6, True) * 0.4), .6),
 'wheels': (lambda s, c: norm(lp(noise(2.0, s), 250) * (1 + .5 * np.sin(2 * np.pi * 6 * T(2.0))) + creak(2.0, 700, s) * 0.15), .35),
 'wood_creak': (lambda s, c: creak(0.7, 380, s), .25), 'bed_creak': (lambda s, c: creak(0.6, 300, s), .3), 'door_creak': (lambda s, c: creak(1.0, 260, s), .45),
 'metal_creak': (lambda s, c: creak(1.0, 520, s), .45), 'stretch_creak': (lambda s, c: creak(0.6, 340, s), .3), 'stretch': (lambda s, c: creak(0.8, 180, s), .4),
 'back_crack': (lambda s, c: norm(sum(np.pad(click(0.02, 1500, s + i), (int(i * 0.07 * SR), 0))[:int(.4 * SR)] for i in range(4))), .45),
 'wind': (lambda s, c: norm(svf_bp(noise(2.5, s), 300 + 200 * np.sin(2 * np.pi * 0.4 * T(2.5)), 1.5) * adsr(2.5, 0.6, 0.8)), .25),
 'crickets': (lambda s, c: norm(sine(4800, 1.6) * (np.sin(2 * np.pi * 30 * T(1.6)) > .3) * (np.sin(2 * np.pi * 1.6 * T(1.6)) > 0)), .15),
 'birds': (lambda s, c: chirps(7, 1.4, s), .3), 'owl': (lambda s, c: norm(np.pad(voice([380, 360], [U, U], 0.35, .1, s), (0, int(.45 * SR))) + np.pad(voice([370, 340], [U, U], 0.5, .1, s + 1), (int(.45 * SR), 0))), .3),
 'rooster': (lambda s, c: voice([500, 700, 900, 880, 700, 500], [E, I_, A, A, O, U], 1.2, .2, s, .03), .5),
 'baa': (lambda s, c: voice([300, 310, 290], [E, E, A], 0.8, .2, s, .08), .4), 'meow': (lambda s, c: voice([500, 700, 450], [I_, A, U], 0.6, .15, s), .35),
 'cuckoo': (lambda s, c: norm(np.pad(voice([740, 740], [U, U], 0.25, .05, s), (0, int(.3 * SR))) + np.pad(voice([587, 587], [U, U], 0.35, .05, s), (int(.3 * SR), 0))), .35),
 'cuckoo_big': (lambda s, c: norm(sum(np.pad(voice([740 if j % 2 == 0 else 587] * 2, [U, U], 0.25, .05, s + j), (int(j * 0.32 * SR), 0))[:int(1.4 * SR)] for j in range(4))), .6),
 'yawn_f': (lambda s, c: yawn(240, 1.3, s), .55), 'yawn_f2': (lambda s, c: yawn(260, 1.0, s), .55), 'yawn_m': (lambda s, c: yawn(140, 1.1, s), .55), 'yawn_low': (lambda s, c: yawn(110, 0.9, s), .6),
 'yawn_big': (lambda s, c: yawn(130, 1.6, s), .6), 'yawn_epic': (lambda s, c: yawn(120, 2.0, s), .7), 'yawn_old': (lambda s, c: yawn(150, 1.2, s), .45),
 'sigh': (lambda s, c: voice([200, 150], [A, U], 0.9, 1.0, s), .35), 'sigh_kid': (lambda s, c: voice([320, 240], [A, U], 0.8, 1.0, s), .35),
 'snore': (lambda s, c: snore(1.6, s), .45), 'snore_chorus': (lambda s, c: norm(sum(np.pad(snore(1.4, s + i), (int(i * 0.25 * SR), 0))[:int(2.2 * SR)] for i in range(3))), .45),
 'zzz': (lambda s, c: norm(hp(noise(0.5, s), 3000) * adsr(0.5, .05, .1)), .15),
 'laugh_deep': (lambda s, c: laugh(110, 6, seed=s), .55), 'laugh_m': (lambda s, c: laugh(150, 4, seed=s), .45), 'laugh_old': (lambda s, c: laugh(170, 4, seed=s), .45),
 'evil_laugh': (lambda s, c: laugh(95, 5, seed=s), .5), 'kids_laugh': (lambda s, c: norm(laugh(330, 5, seed=s) + np.pad(laugh(380, 4, seed=s + 9), (int(.1 * SR), 0))[:len(laugh(330, 5, seed=s))]), .45),
 'growl': (lambda s, c: voice([110, 100], [O, U], 0.6, .6, s), .35), 'hmm': (lambda s, c: voice([140, 160, 130], [M, M, M], 0.6, .05, s), .4),
 'shout_m': (lambda s, c: voice([180, 220, 160], [A, E, O], 0.6, .2, s), .35), 'shout_crowd': (lambda s, c: crowd(1.0, s, 220, 6, True), .3),
 'cheer': (lambda s, c: crowd(1.6, s, 260, 10, True), .5), 'murmur': (lambda s, c: crowd(1.8, s, 150, 8), .25), 'strain': (lambda s, c: voice([150, 170, 160], [E, E, A], 0.9, .5, s, .05), .4),
 'baby_gasp': (lambda s, c: voice([420, 520], [A, O], 0.35, .4, s), .4), 'hug': (lambda s, c: norm(bp(noise(0.4, s), 500, 3000) * np.sin(np.pi * T(0.4) / 0.4) + voice([200, 180], [M, M], 0.4, .05, s) * .5), .35),
 'count': (lambda s, c: norm(np.pad(voice([180, 170], [A, I_], 0.25, .3, s), (0, int(.35 * SR))) + np.pad(voice([190, 175], [U, A], 0.25, .3, s + 1), (int(.35 * SR), 0))), .3),
 'anticip': (lambda s, c: whoosh(0.25, True, 300, 2000, s), .3), 'jump': (lambda s, c: norm(whoosh(0.35, True, 400, 4000, s) + np.pad(impact(0.2, 200, 90, 1, s), (0, int(.15 * SR)))), .45),
 'jump_small': (lambda s, c: norm(sine(glide(300, 800, 0.15), 0.15) * np.exp(-T(0.15) * 8)), .3), 'throw': (lambda s, c: whoosh(0.4, False, 600, 4000, s), .45),
 'blink': (lambda s, c: click(0.02, 3000, s), .15),
}

def seq(pairs, d):
    out = np.zeros(int(d * SR))
    for x, t in pairs: at(out, x, t)
    return norm(out)
def _braam(d, s):
    t = T(d); x = sum(saw(55 * m * (1 + 0.003 * i), d) for i, m in enumerate([1, 1.5, 2, 3]))
    x = lp(x, 900 + 1500 * np.exp(-t * 2)) * adsr(d, 0.02, 0.9); sub = sine(glide(60, 40, d), d) * np.exp(-t * 2.5)
    out = np.tanh((x * 0.6 + sub) * 2.5); at(out, impact(0.5, 100, 35, 1.0, s) * 0.6, 0); return norm(out)
def mx(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
LIB.update({
 'braam': (lambda s, c: _braam(1.6, s), .75),
 'flash': (lambda s, c: seq([(click(0.02, 4000, s), 0), (lp(noise(0.12, s), 6000) * np.exp(-T(0.12) * 25), 0.03)], 0.2), .45),
 'bells7': (lambda s, c: seq([(bell(330, 1.5, (1, 2, 2.4, 3), 2.5), i * 0.2) for i in range(7)], 3.0), .5),
 'ticks': (lambda s, c: seq([(tick(1800 + 600 * (i % 3), s + i), i * 0.17) for i in range(10)], 2.0), .4),
 'tick_hollow': (lambda s, c: seq([(tick(1200, s), 0), (tick(900, s + 1), 0.5)], 0.7), .4),
 'watch_click': (lambda s, c: seq([(click(0.03, 3500, s), 0), (click(0.02, 2000, s + 1), 0.015)], 0.1), .6),
 'ratchet': (lambda s, c: seq([(click(0.02, 2800, s + i), i * 0.06) for i in range(12)], 0.8), .45),
 'gears': (lambda s, c: norm(seq([(click(0.03, 1400 + 400 * (i % 2), s + i), i * 0.11) for i in range(12)], 1.4) + lp(noise(1.4, s), 300) * 0.3), .45),
 'door_bell': (lambda s, c: seq([(bell(2600 + 300 * (i % 2), 0.6, (1, 2.4, 3.9), 6), i * 0.06) for i in range(6)], 1.0), .35),
 'cup_rattle': (lambda s, c: seq([(bell(3300 + 200 * (i % 3), 0.15, (1, 2.1), 25), i * 0.05) for i in range(8)], 0.6), .35),
 'porcelain_break': (lambda s, c: seq([(bell(np.random.default_rng(s + i).uniform(2500, 5000), 0.3, (1, 2.3, 3.7), 12), np.random.default_rng(s + i).uniform(0, .4)) for i in range(14)] + [(impact(0.3, 400, 200, 2, s), 0)], 0.8), .6),
 'spoon': (lambda s, c: seq([(bell(4200, 0.12, (1, 2.4), 30), i * 0.09) for i in range(5)], 0.6), .3),
 'zip': (lambda s, c: seq([(click(0.01, 3000, s + i), i * 0.012) for i in range(35)], 0.5), .35),
 'sprinkle': (lambda s, c: seq([(click(0.015, 5000, s + i), i * 0.05) for i in range(14)], 0.8), .3),
 'film_roll': (lambda s, c: norm(seq([(click(0.01, 2000, s + i), i * 0.042) for i in range(24)], 1.0) + lp(noise(1.0, s), 400) * 0.2), .3),
 'rummage': (lambda s, c: seq([(impact(0.12, 300, 120, 1.0, s + i) * .5, i * 0.09) for i in range(9)] + [(click(0.05, 1200, s + i), i * 0.09 + .02) for i in range(9)], 1.0), .4),
 'pages': (lambda s, c: seq([(bp(noise(0.12, s + i), 2000, 8000) * np.exp(-T(0.12) * 20), i * 0.14) for i in range(12)], 1.8), .4),
 'back_crack': (lambda s, c: seq([(click(0.02, 1500, s + i), i * 0.07) for i in range(4)], 0.4), .45),
 'owl': (lambda s, c: seq([(voice([380, 360], [U, U], 0.35, .1, s), 0), (voice([370, 340], [U, U], 0.5, .1, s + 1), 0.45)], 1.0), .3),
 'cuckoo': (lambda s, c: seq([(voice([740, 740], [U, U], 0.25, .05, s), 0), (voice([587, 587], [U, U], 0.35, .05, s), 0.3)], 0.7), .35),
 'cuckoo_big': (lambda s, c: seq([(voice([740 if j % 2 == 0 else 587] * 2, [U, U], 0.25, .05, s + j), j * 0.32) for j in range(4)], 1.4), .6),
 'snore_chorus': (lambda s, c: seq([(snore(1.4, s + i), i * 0.25) for i in range(3)], 2.2), .45),
 'kids_laugh': (lambda s, c: seq([(laugh(330, 5, seed=s), 0), (laugh(380, 4, seed=s + 9), 0.1)], 1.3), .45),
 'heartbeat': (lambda s, c: seq([(impact(0.25, 60, 40, 0, s), 0), (impact(0.25, 55, 38, 0, s), 0.2)], 0.6), .6),
 'count': (lambda s, c: seq([(voice([180, 170], [A, I_], 0.25, .3, s), 0), (voice([190, 175], [U, A], 0.25, .3, s + 1), 0.35)], 0.7), .3),
 'jump': (lambda s, c: seq([(whoosh(0.35, True, 400, 4000, s), 0), (impact(0.2, 200, 90, 1, s), 0)], 0.4), .45),
 'alarm': (lambda s, c: norm(np.tile(seq([(bell(2200, 0.05, (1, 2.4, 3.9), 20), 0), (bell(2330, 0.05, (1, 2.4), 20), 0)], 0.05), 26)), .5),
 'hug': (lambda s, c: seq([(bp(noise(0.4, s), 500, 3000) * np.sin(np.pi * T(0.4) / 0.4), 0), (voice([200, 180], [M, M], 0.4, .05, s) * .5, 0)], 0.5), .35),
 'clack': (lambda s, c: seq([(click(0.06, 1500, s), 0), (impact(0.5, 180, 60, 1.2, s), 0)], 0.6), .8),
 'click_metal': (lambda s, c: seq([(click(0.05, 2500, s), 0), (bell(1800, 0.3, (1, 2.7), 12) * 0.5, 0)], 0.35), .6),
 'crowd_run': (lambda s, c: seq([(steps(10, 0.13 + 0.01 * i, seed=s + i), 0) for i in range(5)] + [(crowd(1.5, s, 200, 6, True) * 0.4, 0)], 1.9), .6),
 'cup_marble': (lambda s, c: seq([(bell(3100, 0.3, (1, 2.2, 3.5), 18), 0), (click(0.03, 1800, s), 0)], 0.35), .4),
 'trash_hit': (lambda s, c: seq([(bell(310, 1.0, (1, 2.3, 3.7, 5.1), 6), 0), (impact(0.4, 140, 60, 1.5, s), 0)], 1.0), .7),
})

LIB.update({
 'alarm_soft': (lambda s, c: norm(np.tile(sine(880, .25) * adsr(.25, .01, .05), 3)), .25),
 'bark': (lambda s, c: seq([(voice([420, 520, 300], [A, A, O], .18, .6, s), 0), (voice([400, 500, 280], [A, A, O], .16, .6, s + 1), .22)], .5), .6),
 'braam_short': (lambda s, c: _braam(.8, s), .6),
 'briefcase': (lambda s, c: seq([(click(.04, 1800, s), 0), (click(.05, 1200, s + 1), .03), (impact(.3, 200, 90, 1.2, s), .02)], .4), .8),
 'chew': (lambda s, c: seq([(lp(noise(.08, s + i), 1200) * np.exp(-T(.08) * 30), i * .14) for i in range(5)], .8), .4),
 'clock_tick': (lambda s, c: seq([(tick(2200, s), 0), (tick(1700, s + 1), .5)], .6), .35),
 'coin_flip': (lambda s, c: seq([(bell(3800, .3, (1, 2.4, 3.9), 10), 0), (bell(4100, .2, (1, 2.4), 14), .12), (coins(3, .4, s), .25)], .8), .5),
 'cough': (lambda s, c: seq([(norm(bp(noise(.12, s), 300, 2000) * np.exp(-T(.12) * 20)), 0), (norm(bp(noise(.1, s + 1), 300, 2000) * np.exp(-T(.1) * 25)), .18)], .4), .35),
 'creepy_ting': (lambda s, c: norm(bell(1244, 1.5, (1, 2.76, 5.4), 1.6) + bell(1318, 1.5, (1, 2.76), 1.6) * .7), .35),
 'door_open': (lambda s, c: seq([(click(.05, 1500, s), 0), (creak(.7, 330, s), .05)], .8), .5),
 'firework': (lambda s, c: seq([(whoosh(.6, True, 800, 6000, s) * .5, 0), (impact(.6, 90, 40, 1.2, s), .6), (bp(noise(.8, s), 2000, 8000) * np.exp(-T(.8) * 4) * .4, .62)], 1.5), .45),
 'gasp_f': (lambda s, c: voice([400, 480], [A, O], .3, 1.2, s), .45),
 'glitch': (lambda s, c: norm(saw(np.repeat([300, 900, 450, 1200, 200], int(.04 * SR)), .2) * .5), .3),
 'house_pop': (lambda s, c: seq([(sine(glide(180, 700, .12), .12) * np.exp(-T(.12) * 10), 0), (impact(.35, 140, 60, 1.0, s), .08), (bell(1568, .4, (1, 2, 3), 8) * .4, .1)], .6), .55),
 'knock': (lambda s, c: impact(.18, 240, 110, 1.4, s), .7),
 'plate_slide': (lambda s, c: norm(bp(noise(.4, s), 1500, 5000) * adsr(.4, .02, .1)), .35),
 'riser_short': (lambda s, c: riser(.8, s), .4),
 'sad_tone': (lambda s, c: norm(sum(sine(glide(f, f * .94, 1.2), 1.2) * np.exp(-T(1.2) * 2) for f in (440, 523.3, 659.3))), .3),
 'shiver': (lambda s, c: norm(voice([140, 150, 140, 150], [U, U, U, U], .7, .8, s) * (1 + .6 * np.sign(np.sin(2 * np.pi * 18 * T(.7))))), .3),
 'shovel': (lambda s, c: seq([(bp(noise(.3, s), 400, 3000) * np.exp(-T(.3) * 8), 0), (click(.05, 1200, s), .02)], .4), .45),
 'splash': (lambda s, c: norm(bp(noise(.6, s), 500, 6000) * np.exp(-T(.6) * 6)), .4),
 'steps_snow': (lambda s, c: seq([(lp(noise(.12, s + i), 900) * np.exp(-T(.12) * 18), i * .4) for i in range(4)], 1.8), .45),
 'tick_down': (lambda s, c: seq([(click(.03, 2600, s), 0), (sine(glide(900, 500, .12), .12) * np.exp(-T(.12) * 18) * .6, .01)], .2), .55),
 'tug': (lambda s, c: seq([(bp(noise(.12, s + i), 600, 3000) * np.exp(-T(.12) * 20), i * .16) for i in range(3)], .5), .3),
 'whisper': (lambda s, c: norm(bp(noise(.6, s), 1500, 6000) * adsr(.6, .1, .2)), .3),
 'whoosh_down': (lambda s, c: norm(whoosh(.7, False, 200, 2500, s) + sine(glide(300, 60, .7), .7) * np.exp(-T(.7) * 2) * .5), .5),
})

def _crackle(d, s, dens=.985):
    r = np.random.default_rng(s); x = hp(noise(d, s), 1500) * (r.random(int(d * SR)) > dens) * 3
    return norm(x + lp(noise(d, s + 1), 500) * .5 * adsr(d, .1, .3))
LIB.update({
 'breath': (lambda s, c: seq([(bp(noise(.3, s + i), 300, 2000) * np.sin(np.pi * T(.3) / .3), i * .38) for i in range(3)], 1.2), .35),
 'brush': (lambda s, c: norm(bp(noise(1.2, s), 2500, 8000) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 7 * T(1.2))))), .3),
 'car_hit': (lambda s, c: seq([(impact(.8, 140, 40, 1.8, s), 0), (seq([(bell(np.random.default_rng(s + i).uniform(1500, 4000), .3, (1, 2.3), 12), i * .04) for i in range(10)], .6) * .5, .02)], 1.0), .8),
 'car_pass': (lambda s, c: norm(lp(noise(1.2, s), 400 + 600 * np.sin(np.pi * T(1.2) / 1.2)) * np.sin(np.pi * T(1.2) / 1.2) + saw(glide(90, 70, 1.2), 1.2) * .2 * np.sin(np.pi * T(1.2) / 1.2)), .5),
 'chain_rattle': (lambda s, c: seq([(bell(np.random.default_rng(s + i).uniform(2500, 4500), .1, (1, 2.4), 30), i * .045) for i in range(10)], .6), .5),
 'chalk': (lambda s, c: seq([(bp(noise(.12, s + i), 2000, 6000) * np.exp(-T(.12) * 10), i * .16) for i in range(5)], .9), .35),
 'city_amb': (lambda s, c: norm(lp(noise(2, s), 600) + chirps(3, 2, s) * .3), .3),
 'classroom': (lambda s, c: norm(crowd(1.6, s, 260, 8) * .7), .3),
 'clock_spin': (lambda s, c: seq([(click(.02, 2500 + 400 * (i % 2), s + i), i * .05) for i in range(36)], 2.0), .45),
 'collapse': (lambda s, c: norm(impact(2.2, 60, 25, 1.5, s) + lp(noise(2.2, s), 900) * adsr(2.2, .1, 1.2)), .9),
 'crawl': (lambda s, c: seq([(bp(noise(.15, s + i), 400, 2500) * np.exp(-T(.15) * 15), i * .25) for i in range(5)], 1.4), .4),
 'cry_girl': (lambda s, c: voice([520, 600, 480, 560], [A, E, A, U], 1.0, .4, s, .06), .4),
 'dial': (lambda s, c: seq([(sine(f, .09) * adsr(.09, .005, .02), i * .13) for i, f in enumerate([697, 770, 852])], .5), .4),
 'door_crash': (lambda s, c: seq([(impact(.7, 160, 45, 2, s), 0), (bell(420, 1.0, (1, 2.4, 3.9), 4) * .5, .02)], 1.0), .85),
 'drip': (lambda s, c: seq([(sine(glide(1400, 700, .06), .06) * np.exp(-T(.06) * 40), i * .5) for i in range(3)], 1.4), .35),
 'explosion': (lambda s, c: norm(impact(1.4, 70, 25, 2, s) + lp(noise(1.4, s), 2500) * np.exp(-T(1.4) * 3)), .85),
 'fire_crackle': (lambda s, c: _crackle(1.4, s), .35), 'fire_roar': (lambda s, c: norm(_crackle(1.8, s, .97) + lp(noise(1.8, s + 2), 300) * 2 * adsr(1.8, .2, .5)), .55),
 'freeze': (lambda s, c: norm(sine(glide(1200, 300, .8), .8) * np.exp(-T(.8) * 3) + bell(2400, .8, (1, 2.7), 4) * .3), .4),
 'gasp_old': (lambda s, c: voice([220, 260], [A, O], .35, 1.2, s), .45),
 'glass_break': (lambda s, c: seq([(bell(np.random.default_rng(s + i).uniform(2500, 6000), .35, (1, 2.4, 3.9), 10), np.random.default_rng(s + i).uniform(0, .35)) for i in range(18)] + [(impact(.3, 400, 200, 2, s), 0), (hp(noise(.5, s), 3000) * np.exp(-T(.5) * 8), 0)], 1.0), .75),
 'glass_crack': (lambda s, c: seq([(click(.03, 3500, s + i), i * .035 + np.random.default_rng(s + i).uniform(0, .02)) for i in range(12)] + [(bell(3200, .5, (1, 2.4), 8) * .4, .05)], .8), .7),
 'glass_rattle': (lambda s, c: seq([(bell(3000 + 300 * (i % 3), .12, (1, 2.2), 28), i * .05) for i in range(8)], .6), .4),
 'hand_glass': (lambda s, c: seq([(impact(.2, 300, 150, .8, s), 0), (bp(noise(.4, s), 1500, 5000) * np.exp(-T(.4) * 8) * .4, .05)], .5), .6),
 'hum_low': (lambda s, c: norm(sine(55, 1.5) + sine(110, 1.5) * .4 * adsr(1.5, .3, .5)), .35),
 'keys': (lambda s, c: seq([(bell(np.random.default_rng(s + i).uniform(3000, 5000), .15, (1, 2.6), 22), i * .07) for i in range(6)], .6), .4),
 'kick': (lambda s, c: impact(.4, 180, 60, 1.6, s), .8),
 'machine_hum': (lambda s, c: norm(saw(60, 2) * .3 + sine(120, 2) * .5 + sine(glide(240, 260, 2), 2) * .2) * adsr(2, .3, .5), .4),
 'machine_shake': (lambda s, c: norm((saw(48, 2) * .5 + lp(noise(2, s), 300)) * (1 + .6 * np.sin(2 * np.pi * 9 * T(2)))), .65),
 'phone_ring': (lambda s, c: norm(np.tile(sine(440, .4) * (np.sin(2 * np.pi * 20 * T(.4)) > 0), 2)), .3),
 'radio': (lambda s, c: norm(bp(noise(.6, s), 800, 3000) * (np.random.default_rng(s).random(int(.6 * SR)) > .3) * adsr(.6, .02, .1)), .3),
 'rubble': (lambda s, c: seq([(impact(.25, 160, 60, 1.2, s + i), i * .12) for i in range(8)], 1.3), .55),
 'run_grass': (lambda s, c: seq([(lp(noise(.1, s + i), 1200) * np.exp(-T(.1) * 25), i * .16) for i in range(12)], 2.0), .5),
 'scream_girl': (lambda s, c: voice([700, 900, 850], [E, I_, E], .8, .3, s, .05), .55),
 'siren': (lambda s, c: norm(sine(np.where((T(1.6) % .8) < .4, 650, 520), 1.6) * adsr(1.6, .1, .3)), .3),
 'stomach': (lambda s, c: norm(lp(saw(glide(80, 50, .8), .8), 300) * (1 + .5 * np.sin(2 * np.pi * 6 * T(.8))) * adsr(.8, .1, .3)), .45),
 'thud': (lambda s, c: impact(.6, 90, 40, 1.2, s), .8),
 'toy': (lambda s, c: music_box([12, 16, 19], .12, .8, 1046.5), .35),
 'tv_static': (lambda s, c: norm(hp(noise(1, s), 1000) * adsr(1, .05, .2)), .2),
 'zoom_fast': (lambda s, c: norm(whoosh(.35, True, 400, 8000, s) + sine(glide(200, 1600, .35), .35) * .3 * np.sin(np.pi * T(.35) / .35)), .7),
})

LIB.update({
 'cricket': (lambda s, c: norm(sine(4800, 1.2) * (np.sin(2 * np.pi * 30 * T(1.2)) > .3) * (np.sin(2 * np.pi * 2 * T(1.2)) > 0)), .25),
 'magic_hit': (lambda s, c: norm(seq([(impact(.6, 120, 50, .6, s), 0), (music_box([12, 16, 19, 24], .04, .8, 1046.5), 0), (whoosh(.5, True, 800, 8000, s) * .5, 0)], 1.0)), .75),
 'money_rain': (lambda s, c: norm(bp(noise(1.6, s), 1500, 7000) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 9 * T(1.6)))) * adsr(1.6, .1, .4) + coins(6, 1.6, s) * .5), .4),
 'pan_sizzle': (lambda s, c: norm(hp(noise(1.6, s), 3000) * (.6 + .4 * np.random.default_rng(s).random(int(1.6 * SR))) * adsr(1.6, .2, .4)), .25),
 'party_horn': (lambda s, c: norm(saw(glide(500, 700, .8), .8) * adsr(.8, .02, .2) + bp(noise(.8, s), 400, 2000) * .2), .4),
 'sniff': (lambda s, c: seq([(bp(noise(.15, s + i), 800, 4000) * np.sin(np.pi * T(.15) / .15), i * .25) for i in range(2)], .5), .4),
 'switch': (lambda s, c: seq([(click(.03, 1600, s), 0), (click(.02, 900, s + 1), .03)], .1), .55),
 'water_bloop': (lambda s, c: norm(sine(glide(300, 900, .25), .25) * np.exp(-T(.25) * 8) + lp(noise(.25, s), 1500) * .3 * np.exp(-T(.25) * 12)), .55),
 'whinny': (lambda s, c: voice([700, 900, 600, 800, 500], [E, I_, E, A, U], .9, .3, s, .12), .4),
})


# ---------- Bodensteuer: efectos nuevos ----------
LIB.update({
 'jet': (lambda s, c: norm(bp(noise(1.4, s), 300, 5000) * adsr(1.4, .05, .6) * (1 + .3 * np.sin(2 * np.pi * 31 * T(1.4))) + lp(noise(1.4, s + 1), 120) * adsr(1.4, .02, .5) * 2), .5),
 'ignite': (lambda s, c: seq([(click(0.05, 2000, s), 0), (norm(bp(noise(.9, s), 500, 6000) * adsr(.9, .01, .5)), .05), (impact(.5, 90, 40, .4, s), .05)], 1.1), .55),
 'drone': (lambda s, c: norm(saw(glide(180, 196, 2.2), 2.2) * .25 + saw(glide(240, 252, 2.2), 2.2) * .2 + bp(noise(2.2, s), 600, 3000) * .3) * adsr(2.2, .3, .6) * .9, .3),
 'heli': (lambda s, c: norm(lp(noise(2.0, s), 400) * (.4 + .6 * (np.sin(2 * np.pi * 11 * T(2.0)) > .6)) ) * adsr(2.0, .2, .5), .45),
 'splash': (lambda s, c: norm(mx(bp(noise(1.1, s), 400, 6000) * env(1.1, .005, .5), impact(.4, 140, 60, .3, s) * .6)), .55),
 'leaves': (lambda s, c: norm(bp(noise(.9, s), 1500, 8000) * env(.9, .01, .6) * (1 + .7 * np.sin(2 * np.pi * 23 * T(.9)))), .4),
 'crash_wood': (lambda s, c: norm(mx(impact(.7, 120, 45, .9, s), creak(.7, 500, s) * .4, bp(noise(.7, s), 1000, 6000) * env(.7, .003, .2) * .6)), .6),
 'vibrate': (lambda s, c: norm(saw(160, 1.2) * ((T(1.2) % .4) < .25) * .8 + lp(noise(1.2, s), 300) * ((T(1.2) % .4) < .25) * .5), .5),
 'notif': (lambda s, c: seq([(bell(1568, .4, (1, 2.4), 9), 0), (bell(2093, .5, (1, 2.4), 8), .12)], .7), .5),
 'car': (lambda s, c: norm(lp(saw(glide(55, 75, 2.0), 2.0), 400) + lp(noise(2.0, s), 200) * .5) * adsr(2.0, .3, .6), .45),
 'hum': (lambda s, c: norm(sine(60, 2.0) + sine(120, 2.0) * .5 + saw(180, 2.0) * .08) * adsr(2.0, .4, .6), .35),
 'power_on': (lambda s, c: norm(sine(glide(80, 900, 1.0, 2), 1.0) * adsr(1.0, .05, .3) + bp(noise(1.0, s), 2000, 8000) * adsr(1.0, .3, .3) * .3), .5),
 'button': (lambda s, c: seq([(click(0.04, 1800, s), 0), (impact(.4, 160, 70, .6, s) * .7, 0.02)], .5), .7),
 'confetti': (lambda s, c: norm(mx(seq([(click(.03, 3000 + 300 * k, s + k), .05 * k) for k in range(10)], .8), bp(noise(.8, s), 3000, 9000) * env(.8, .01, .5) * .4)), .45),
 'cash_reg': (lambda s, c: seq([(bell(2637, .5, (1, 2.7), 7), 0), (coins(4, .5, s), .08)], .7), .55),
 'chair_roll': (lambda s, c: norm(lp(noise(1.6, s), 300) * (1 + .4 * np.sin(2 * np.pi * 8 * T(1.6))) + creak(1.6, 900, s) * .1) * adsr(1.6, .1, .4), .4),
 'hammer': (lambda s, c: seq([(norm(mx(bell(3200, .2, (1, 2.3), 25), click(.03, 1500, s))), .14 * k) for k in range(4)], .8), .5),
 'weld': (lambda s, c: norm(hp(noise(1.0, s), 3000) * (np.random.default_rng(s).random(int(SR)) > .7) * adsr(1.0, .02, .2)), .3),
 'gasp': (lambda s, c: norm(bp(noise(.4, s), 800, 3500) * adsr(.4, .05, .25)), .35),
})

def render(cues, dur):
    out = np.zeros(int((dur + 3) * SR))
    for i, c in enumerate(cues):
        name = c['s']
        if name not in LIB: print('falta', name); continue
        seed = int(hashlib.md5(f"{name}{i}".encode()).hexdigest()[:8], 16) % 100000
        gen, lvl = LIB[name]
        x = gen(seed, c)
        if name not in ('riser', 'lullaby', 'lullaby2', 'bells7', 'braam'): x = shift(x, R(seed, 0.9, 1.1))   # variación
        at(out, x * lvl * c.get('g', 1), max(0, c['t']))
    return out[:int(dur * SR)]

def fill_gaps(cues, dur, maxgap=1.1):
    ts = sorted(c['t'] for c in cues); extra = []; fill = ['cloth', 'steps', 'whoosh_soft', 'pop', 'steps_heavy', 'paper']
    prev = 0.0
    for t in ts + [dur]:
        while t - prev > maxgap: prev += maxgap * 0.75; extra.append({'t': round(prev, 3), 's': fill[len(extra) % len(fill)], 'g': 0.6})
        prev = t
    return cues + extra

if __name__ == '__main__':
    cues_f, voice_f, music_f, out_f = sys.argv[1:5]
    cues = json.load(open(cues_f)); DUR = 121.5
    cues = fill_gaps(cues, DUR); print(len(cues), 'efectos; hueco máximo', max(np.diff(sorted([0] + [c['t'] for c in cues] + [DUR]))).round(2))
    TEN = {'riser', 'braam', 'riser_short', 'braam_short'}
    ten = render([c for c in cues if c['s'] in TEN], DUR); ten = norm(ten, 0.9)
    sfx = render([c for c in cues if c['s'] not in TEN], DUR); sfx = norm(sfx, 0.9)
    for arr, fn in ((sfx, '/tmp/_sfx.wav'), (ten, '/tmp/_ten.wav')):
        w = wave.open(fn, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((arr * 32767).astype('<i2').tobytes()); w.close()
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', '/tmp/_ten.wav', out_f.replace('.wav', '-tension.wav')], check=True)
    sfx_f = out_f.replace('.wav', '-sfx.wav')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', '/tmp/_sfx.wav', sfx_f], check=True)
    import os
    subprocess.run([os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mezclar.sh'), voice_f, music_f, sfx_f, out_f], check=True, env={**os.environ, 'TENSION': out_f.replace('.wav', '-tension.wav')})
    print('ok', out_f)

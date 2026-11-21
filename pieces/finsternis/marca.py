# Añade el sonido de marca del usuario: al empezar y cada ≤10 s en los momentos clave, ~3 dB por debajo de la voz.
# python3 marca.py renders/mezcla.wav audio/sonido-marca.mp3 renders/mezcla-final.wav
import sys, subprocess, json
mix, snd, out = sys.argv[1:4]
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', snd, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB', snd + '.trim.wav'], check=True)
W = json.load(open('audio/words.json')); ST = {}
for w in W: ST.setdefault(w[3], w[0])
# frases clave (gancho, poderes, Meins, misterio, injusticia, colapso, revelación, final)
keys = [2, 4, 6, 9, 13, 17, 20, 21, 24, 27, 29, 31, 34, 37, 39, 43, 47, 50, 52, 54, 57, 63, 65]
C = sorted(set(round(v, 2) for v in ST.values())); T = [0.0]
for tgt in range(10, 131, 10):
    best = min(C, key=lambda c: abs(c - tgt))
    if abs(best - tgt) <= 3 and best - T[-1] >= 7: T.append(best)
T = [t for t in T if t < 130]
gaps = [b - a for a, b in zip(T, T[1:] + [133.27])]; assert max(gaps) <= 13, gaps
f = ';'.join(f'[1:a]adelay={int(t*1000)}|{int(t*1000)},volume=-4.5dB[m{i}]' for i, t in enumerate(T))
f += ';' + ''.join(f'[m{i}]' for i in range(len(T))) + f'amix=inputs={len(T)}:normalize=0[mk];[0:a][mk]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.8,volume=-1.1dB[o]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mix, '-i', snd + '.trim.wav', '-filter_complex', f, '-map', '[o]', '-ar', '44100', out], check=True)
print(len(T), 'veces:', T, '; hueco máximo', round(max(gaps), 2))

# Añade el sonido de marca del usuario: al empezar y cada ≤10 s en los momentos clave, ~3 dB por debajo de la voz.
# python3 marca.py renders/mezcla.wav audio/sonido-marca.mp3 renders/mezcla-final.wav
import sys, subprocess, json
mix, snd, out = sys.argv[1:4]
W = json.load(open('audio/words.json')); ST = {}
for w in W: ST.setdefault(w[3], w[0])
# frases clave (gancho, poderes, Meins, misterio, injusticia, colapso, revelación, final)
keys = [2, 4, 7, 10, 13, 16, 19, 24, 28, 31, 33, 37, 41, 46, 49, 53, 58, 62, 65, 72, 74]
T = [0.0] + [round(ST[k], 2) for k in keys]
T = [t for t in T if t < 143]
gaps = [b - a for a, b in zip(T, T[1:] + [146.15])]; assert max(gaps) <= 10, gaps
f = ';'.join(f'[1:a]adelay={int(t*1000)}|{int(t*1000)},volume=-1.5dB[m{i}]' for i, t in enumerate(T))
f += ';' + ''.join(f'[m{i}]' for i in range(len(T))) + f'amix=inputs={len(T)}:normalize=0[mk];[0:a][mk]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.8,volume=-1.1dB[o]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mix, '-i', snd, '-filter_complex', f, '-map', '[o]', '-ar', '44100', out], check=True)
print(len(T), 'veces:', T, '; hueco máximo', round(max(gaps), 2))

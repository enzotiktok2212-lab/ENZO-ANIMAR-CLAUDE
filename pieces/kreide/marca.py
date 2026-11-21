# Campanita del usuario: en 0 ms y cada ~10 s al empezar una frase importante, ~3 dB por debajo de la voz.
# python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav
import sys, subprocess
mix, snd, out = sys.argv[1:4]
T = [0.0, 8.14, 18.89, 26.98, 37.31, 47.12, 56.57, 67.32, 77.57, 86.26, 95.73, 105.49, 115.42, 123.75, 134.59, 145.14, 156.35, 167.45, 176.4, 185.29, 193.6, 202.18, 211.21, 221.71, 231.59, 242.18, 250.52]
gaps = [b - a for a, b in zip(T, T[1:])]; assert max(gaps) <= 11.3, gaps
f = ';'.join(f'[1:a]adelay={int(t*1000)}|{int(t*1000)},volume=-4.5dB[m{i}]' for i, t in enumerate(T))
f += ';' + ''.join(f'[m{i}]' for i in range(len(T))) + f'amix=inputs={len(T)}:normalize=0[mk];[0:a][mk]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.8,volume=-1.4dB[o]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mix, '-i', snd, '-filter_complex', f, '-map', '[o]', '-ar', '44100', out], check=True)
print(len(T), 'campanitas:', T, '; hueco máximo', round(max(gaps), 2))

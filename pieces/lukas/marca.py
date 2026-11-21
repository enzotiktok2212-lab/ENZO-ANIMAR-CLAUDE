# Campanita del usuario: en 0 ms y cada ~10 s al empezar una frase importante, ~3 dB por debajo de la voz.
# python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav
import sys, subprocess
mix, snd, out = sys.argv[1:4]
T = [0.0, 7.11, 14.40, 22.42, 30.87, 38.52, 47.68, 55.51, 64.79, 73.42, 80.86, 90.00, 97.44, 105.87, 114.55, 123.17]
gaps = [b - a for a, b in zip(T, T[1:])]; assert max(gaps) <= 11, gaps
f = ';'.join(f'[1:a]adelay={int(t*1000)}|{int(t*1000)},volume=-4.5dB[m{i}]' for i, t in enumerate(T))
f += ';' + ''.join(f'[m{i}]' for i in range(len(T))) + f'amix=inputs={len(T)}:normalize=0[mk];[0:a][mk]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.8,volume=-1.4dB[o]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mix, '-i', snd, '-filter_complex', f, '-map', '[o]', '-ar', '44100', out], check=True)
print(len(T), 'campanitas:', T, '; hueco máximo', round(max(gaps), 2))

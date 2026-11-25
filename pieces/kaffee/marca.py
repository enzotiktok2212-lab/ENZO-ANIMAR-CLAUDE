# Campanita del usuario: en 0 ms y cada ~10 s al empezar una frase importante, ~3 dB por debajo de la voz.
# python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav
import sys, subprocess
mix, snd, out = sys.argv[1:4]
T = [0.0, 9.35, 18.81, 28.61, 38.48, 46.30, 54.96, 63.37, 69.47, 79.52, 89.28, 99.77, 107.20, 116.97, 125.65, 133.09, 141.97, 149.60, 159.91, 168.76, 177.33, 186.25]
gaps = [b - a for a, b in zip(T, T[1:])]; assert max(gaps) <= 11, gaps
f = ';'.join(f'[1:a]adelay={int(t*1000)}|{int(t*1000)},volume=-4.5dB[m{i}]' for i, t in enumerate(T))
f += ';' + ''.join(f'[m{i}]' for i in range(len(T))) + f'amix=inputs={len(T)}:normalize=0[mk];[0:a][mk]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.8,volume=-1.4dB[o]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mix, '-i', snd, '-filter_complex', f, '-map', '[o]', '-ar', '44100', out], check=True)
print(len(T), 'campanitas:', T, '; hueco máximo', round(max(gaps), 2))

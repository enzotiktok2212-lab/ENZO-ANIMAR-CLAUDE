# Campanita del usuario: en 0 ms y cada ~10 s al empezar una frase importante, ~3 dB por debajo de la voz.
# python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-final.wav
import sys, subprocess
mix, snd, out = sys.argv[1:4]
T = [0.0, 9.96, 18.43, 27.98, 36.98, 45.37, 53.42, 63.4, 71.96, 80.88, 89.45, 99.22, 109.15, 118.78, 128.39, 137.96, 147.38, 156.34, 165.14, 174.26, 183.42, 191.93, 200.91, 210.37, 220.04]
gaps = [b - a for a, b in zip(T, T[1:])]; assert max(gaps) <= 11, gaps
f = ';'.join(f'[1:a]adelay={int(t*1000)}|{int(t*1000)},volume=-4.5dB[m{i}]' for i, t in enumerate(T))
f += ';' + ''.join(f'[m{i}]' for i in range(len(T))) + f'amix=inputs={len(T)}:normalize=0[mk];[0:a][mk]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.8,volume=-1.4dB[o]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mix, '-i', snd, '-filter_complex', f, '-map', '[o]', '-ar', '44100', out], check=True)
print(len(T), 'campanitas:', T, '; hueco máximo', round(max(gaps), 2))

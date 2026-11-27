# EBBE: en 0 ms el sonido del usuario (audio/sonido-inicio.mp3) por debajo de la voz, EN LUGAR de la campanita;
# la campanita sigue al empezar frase cada ≤10 s.
# python3 marca.py renders/mezcla.wav audio/campanita-recortada.wav renders/mezcla-marca.wav [audio/sonido-inicio.mp3]
import sys, subprocess
mix, snd, out = sys.argv[1:4]; ini = sys.argv[4] if len(sys.argv) > 4 else 'audio/sonido-inicio.mp3'
T = [9.46, 18.56, 27.62, 37.35, 44.08, 51.53, 58.78, 67.61, 75.45, 83.24, 91.23, 99.81, 106.83, 115.39, 125.47, 133.50, 142.42]
gaps = [b - a for a, b in zip([0] + T, T)]; assert max(gaps) <= 11, gaps
f = '[2:a]volume=-9.5dB[st];' + ';'.join(f'[1:a]adelay={int(t*1000)}|{int(t*1000)},volume=-4.5dB[m{i}]' for i, t in enumerate(T))
f += ';[st]' + ''.join(f'[m{i}]' for i in range(len(T))) + f'amix=inputs={len(T) + 1}:normalize=0[mk];[0:a][mk]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.8,volume=-1.4dB[o]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mix, '-i', snd, '-i', ini, '-filter_complex', f, '-map', '[o]', '-ar', '44100', out], check=True)
print('sonido de inicio en 0 s +', len(T), 'campanitas:', T, '; hueco máximo', round(max(gaps), 2))

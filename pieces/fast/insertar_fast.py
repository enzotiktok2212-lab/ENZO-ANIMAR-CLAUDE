# python3 insertar_fast.py : mete los 4 «Ah! Almost…» del vídeo original (audio/fastN-voz.wav si existe: solo voz, sin música;
# si no, audio/fastN.wav) en la voz recortada (audio/voz-de.wav + audio/words-de.json), DESPUÉS del final real de la palabra
# (por energía, no por Whisper, para no cortarla), y escribe audio/voz-sin-silencios.wav y audio/words.json con AH!/FAST! en cada golpe.
import json, os, subprocess, numpy as np
R = 44100; G0, G1 = .12, .12
rd = lambda f: np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(R), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
x = rd('audio/voz-de.wav'); W = json.load(open('audio/words-de.json'))
rms = lambda a: np.sqrt(np.mean(a[np.abs(a) > .02] ** 2))
vr = rms(x)
e = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(441) / 441, 'same'))[::441] + 1e-9)   # 10 ms
def real_end(t0):   # primer tramo de 60 ms por debajo de -50 dB después del inicio de la palabra
    i = int(t0 * 100)
    while i < len(e) - 6:
        if all(e[i:i + 6] < -50): return i / 100
        i += 1
    return t0 + .5
ON = [[0, .44, .94, 1.44], [0, .42, 1.02, 1.44], [0, .26, .84, 1.32], [0, .45, .85, 1.33]]
after = ['mir.', 'bestanden.', 'fiel.', 'gemacht.']; idx = []; j = 0
for i, w in enumerate(W):
    if j < 4 and w[2] == after[j]: idx.append(i); j += 1
out, F, p, sh = [], [], 0, 0.0
for i, w in enumerate(W):
    F.append([round(w[0] + sh, 3), round(w[1] + sh, 3), w[2], w[3]])
    if i in idx:
        k = idx.index(i); t = max(w[1], real_end(w[0])) + .03; T = int(t * R)
        out.append(x[p:T]); p = T
        f = f'audio/fast{k + 1}-voz.wav' if os.path.exists(f'audio/fast{k + 1}-voz.wav') else f'audio/fast{k + 1}.wav'
        c = rd(f); c = c * (vr / rms(c)) * .95
        out.append(np.concatenate([np.zeros(int(G0 * R), np.float32), c, np.zeros(int(G1 * R), np.float32)]))
        base = t + sh + G0; on = ON[k]
        for m, o in enumerate(on): F.append([round(base + o, 3), round(base + (on[m + 1] if m + 1 < len(on) else 1.95), 3), 'AH!' if m == 0 else 'ALMOST!', -1 - k])
        print(k + 1, w[2], 'whisper fin', round(w[1], 2), '-> fin real', round(t, 2), f)
        sh += G0 + len(c) / R + G1
out.append(x[p:]); y = np.concatenate(out)
json.dump(F, open('audio/words.json', 'w'), ensure_ascii=False)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(R), '-ac', '1', '-i', '-', 'audio/voz-sin-silencios.wav'], input=y.tobytes(), check=True)
print('total', round(len(y) / R, 2))

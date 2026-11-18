# python3 insertar_huss.py : mete las 13 ráfagas de «HUSS» del vídeo original (audio/hussN-voz.wav si existe: solo voz, sin música;
# si no, audio/hussN.wav) en la voz recortada (audio/voz-de.wav + audio/words-de.json), DESPUÉS del final real de la palabra ancla,
# y escribe audio/voz-sin-silencios.wav y audio/words.json con un «HUSS!» en cada golpe detectado por energía.
import json, os, subprocess, numpy as np
R = 44100; G0, G1 = .15, .65
rd = lambda f: np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(R), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
x = rd('audio/voz-de.wav'); W = json.load(open('audio/words-de.json'))
rms = lambda a: np.sqrt(np.mean(a[np.abs(a) > .02] ** 2))
vr = rms(x)
env = lambda a: 20 * np.log10(np.sqrt(np.convolve(a ** 2, np.ones(441) / 441, 'same'))[::441] + 1e-9)   # 10 ms
e = env(x)
def real_end(t0):
    i = int(t0 * 100)
    while i < len(e) - 6:
        if all(e[i:i + 6] < -50): return i / 100
        i += 1
    return t0 + .5
def onsets(c):
    ec = np.sqrt(np.convolve(c ** 2, np.ones(220) / 220, 'same'))[::220]   # 5 ms
    th = ec.max() * .4; on, up, last = [], False, -99
    for k, v in enumerate(ec):
        if v > th and not up and k - last > 24: on.append(k / 200); last = k; up = True
        elif v < th * .5: up = False
    return on
ONS = json.load(open('audio/huss_onsets.json')) if os.path.exists('audio/huss_onsets.json') else {}
# ancla (palabra, nº de aparición) -> clip
A = [('jeder.', 1, 1), ('HUSS-Weltmeisterschaft.', 1, 2), ('Fußballer:', 1, 3), ('Basketballer:', 1, 4), ('Würstchenmann:', 1, 5),
     ('Meisterin:', 1, 6), ('zehn.', 1, 7), ('Pullover.', 1, 8), ('Prozent.“', 1, 9), ('Schneller!', 1, 10), ('Schneller!', 2, 11),
     ('aus.', 1, 12), ('anfängt', 1, 13)]
cnt, idx = {}, {}
for i, w in enumerate(W):
    cnt[w[2]] = cnt.get(w[2], 0) + 1
    for a, n, k in A:
        if w[2] == a and cnt[a] == n: idx[i] = k
assert len(idx) == len(A), idx
out, F, p, sh, bar = [], [], 0, 0.0, 0.0
for i, w in enumerate(W):
    a0 = max(w[0] + sh, bar); F.append([round(a0, 3), round(max(a0 + .05, w[1] + sh), 3), w[2], w[3]])
    if i in idx:
        k = idx[i]
        # fin real de la palabra ancla: desde el fin de Whisper, avanzar mientras haya voz (> -45 dB)
        j = int(w[1] * 100)
        while j < len(e) - 3 and max(e[j:j + 3]) > -45: j += 1
        t = j / 100 + .03; T = int(t * R)
        out.append(x[p:T])
        # inicio real de la siguiente palabra: desde su inicio de Whisper, retroceder mientras haya voz
        nx = W[i + 1][0] if i + 1 < len(W) else t; j = int(nx * 100)
        while j > t * 100 and e[j - 1] > -45: j -= 1
        while j < len(e) - 1 and e[j] < -45 and j < nx * 100 + 15: j += 1
        t2 = max(t, j / 100 - .03); p = int(t2 * R); skip = t2 - t
        f = f'audio/huss{k}-voz.wav' if os.path.exists(f'audio/huss{k}-voz.wav') else f'audio/huss{k}.wav'
        c = rd(f); c = c * (vr / rms(c)) * .95
        out.append(np.concatenate([np.zeros(int(G0 * R), np.float32), c, np.zeros(int(G1 * R), np.float32)]))
        base = t + sh + G0; on = ONS.get(str(k)) or onsets(c); d = len(c) / R
        for m, o in enumerate(on): F.append([round(base + o, 3), round(base + (on[m + 1] if m + 1 < len(on) else min(d, o + .3)), 3), 'HUSS!', -k])
        print(k, w[2], round(t, 2), f, len(on), 'golpes')
        sh += G0 + d + G1 - skip; bar = t + sh + skip - G1 * .5
out.append(x[p:]); y = np.concatenate(out)
json.dump(F, open('audio/words.json', 'w'), ensure_ascii=False)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(R), '-ac', '1', '-i', '-', 'audio/voz-sin-silencios.wav'], input=y.tobytes(), check=True)
print('total', round(len(y) / R, 2))

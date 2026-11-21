# python3 huss_onsets.py : en audio/words.json, sustituye cada grupo de HUSS por un HUSS en cada golpe de voz detectado en voz-sin-silencios.wav
import json, subprocess, numpy as np
W = json.load(open('audio/words.json')); R = 16000
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', 'audio/voz-sin-silencios.wav', '-ac', '1', '-ar', str(R), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
e = np.sqrt(np.convolve(x ** 2, np.ones(160) / 160, 'same'))[::80]  # 5 ms
O, i = [], 0
while i < len(W):
    if 'HUSS' not in W[i][2]: O.append(W[i]); i += 1; continue
    j = i
    while j < len(W) and 'HUSS' in W[j][2]: j += 1
    a = O[-1][1] - .05 if O else 0; b = W[j][0] + .02 if j < len(W) else len(x) / R
    seg = e[int(a * 200):int(b * 200)]; th = seg.max() * .35; on = []; up = False; last = -1
    for k, v in enumerate(seg):
        if v > th and not up and (k - last) > 24: on.append(a + k / 200); last = k; up = True
        elif v < th * .5: up = False
    n = W[i][3]
    for k, t in enumerate(on): O.append([round(t, 3), round(on[k + 1] if k + 1 < len(on) else min(b, t + .25), 3), 'HUSS!', n])
    print(f'grupo {a:.2f}-{b:.2f}: {j - i} en guion, {len(on)} detectados', [round(t, 2) for t in on]); i = j
json.dump(O, open('audio/words.json', 'w'), ensure_ascii=False)

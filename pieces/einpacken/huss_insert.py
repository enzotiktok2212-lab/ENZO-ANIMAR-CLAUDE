# python3 huss_insert.py <vocals.wav del original separado>
# Recorta las 7 ráfagas de HUSS (huss_ref.json) de la voz aislada del vídeo de referencia y las inserta en la voz de ElevenLabs
# (audio/voz-eleven.wav + audio/words-eleven.json) detrás de las frases que tocan. Cada HUSS se añade a words.json en su golpe de energía.
# Salida: audio/huss/huss<i>.wav, audio/voz-sin-silencios.wav, audio/words.json, audio/huss.json ([inicio, fin, [golpes]] por ráfaga).
import json, os, subprocess, sys
import numpy as np
SR = 44100
voc = sys.argv[1]
REF = json.load(open('huss_ref.json'))
W = json.load(open('audio/words-eleven.json'))
# detrás de qué palabra (n-ésima aparición) va cada ráfaga
AFTER = [('mir', 1), ('vor', 1), ('langsam', 1), ('Vorstellungsgespräch', 2), ('Frühstück', 3), ('ich', 'nur'), (None, 0)]
def load(path):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32).copy()
V = load('audio/voz-eleven.wav'); A = load(voc)
def norm(w): return w.strip('„“".,!?:…').lower()
cuts = []
for k, (wd, n) in enumerate(AFTER):
    if wd is None: cuts.append(len(V) / SR); continue
    idx = [i for i, w in enumerate(W) if norm(w[2]) == wd.lower()]
    lastc = cuts[-1] if cuts else 0
    i = [j for j in idx if norm(W[j - 1][2]) == n and W[j][0] > lastc][0] if isinstance(n, str) else idx[n - 1]
    cuts.append(W[i][1] + .05)
HOOK, HSPD = float(os.environ.get('HOOK', 1.1)), float(os.environ.get('HSPD', 1.1))
def tempo(x, f):
    if abs(f - 1) < 1e-3: return x
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', f'atempo={f}', '-f', 'f32le', '-'], input=x.astype(np.float32).tobytes(), capture_output=True, check=True).stdout, np.float32).copy()
# gancho (hasta «…vor.») acelerado: voz, tiempos de palabra y cortes
ch = cuts[1]; V = np.concatenate([tempo(V[:int(ch * SR)], HOOK), V[int(ch * SR):]])
mt = lambda x: x / HOOK if x < ch else x - ch + ch / HOOK
W = [[mt(w[0]), mt(w[1])] + w[2:] for w in W]; cuts = [mt(c) for c in cuts[:-1]] + [len(V) / SR]
def gate(h):   # deja solo los golpes: fuera de ellos, silencio (quita el rastro de la música)
    e = np.sqrt(np.convolve(h ** 2, np.ones(441) / 441, 'same')); m = (e > e.max() * .25).astype(np.float32)
    m = np.convolve(m, np.ones(int(.1 * SR)), 'same') > 0; m = np.roll(m, int(.025 * SR)).astype(np.float32)
    r = int(.015 * SR); m = np.convolve(m, np.ones(r) / r, 'same'); return h * m
def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
vref = rms_db(V[np.abs(V) > .02]) if np.any(np.abs(V) > .02) else -20
out, HU, NW, prev, t = [], [], [], 0, 0.0
import os; os.makedirs('audio/huss', exist_ok=True)
for k, ((a, b, cnt), c) in enumerate(zip(REF, cuts)):
    seg = V[int(prev * SR):int(c * SR)]; out.append(seg)
    NW += [[w[0] - prev + t, w[1] - prev + t, w[2], w[3] if len(w) > 3 else 0] for w in W if prev <= w[0] < c]
    t += len(seg) / SR; prev = c
    h = tempo(gate(A[int((a - .06) * SR):int((b + .12) * SR)].copy()), HSPD)
    # golpes: picos de energía (ventanas de 10 ms), separados ≥ 0,12 s
    e = np.sqrt(np.convolve(h ** 2, np.ones(441) / 441, 'same')); thr = e.max() * .35; on = []
    for j in range(1, len(e)):
        if e[j] >= thr > e[j - 1] and (not on or j / SR - on[-1] > .12): on.append(j / SR)
    g = 10 ** ((vref - rms_db(h[np.abs(h) > .02])) / 20); h = np.clip(h * g, -1, 1)   # mismo nivel que la voz
    fi = int(.01 * SR); h[:fi] *= np.linspace(0, 1, fi); h[-fi:] *= np.linspace(1, 0, fi)
    gap = np.zeros(int(.06 * SR), np.float32)
    out += [gap, h.astype(np.float32), gap]; t0 = t + len(gap) / SR
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', f'audio/huss/huss{k + 1}.wav'], input=h.astype(np.float32).tobytes(), check=True)
    HU.append([round(t0, 3), round(t0 + len(h) / SR, 3), [round(t0 + o, 3) for o in on]])
    for o in on: NW.append([round(t0 + o, 3), round(t0 + o + .18, 3), 'HUSS!', 99])
    t = t0 + len(h) / SR + len(gap) / SR
    print(f'ráfaga {k + 1}: {cnt} en el original, {len(on)} golpes detectados, en {t0:.2f} s')
seg = V[int(prev * SR):]; out.append(seg)
NW += [[w[0] - prev + t, w[1] - prev + t, w[2], w[3] if len(w) > 3 else 0] for w in W if w[0] >= prev]
NW.sort(key=lambda w: w[0]); NW = [[round(w[0], 3), round(w[1], 3), w[2], w[3]] for w in NW]
Y = np.concatenate(out)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', 'audio/voz-sin-silencios.wav'], input=Y.astype(np.float32).tobytes(), check=True)
json.dump(NW, open('audio/words.json', 'w'), ensure_ascii=False); json.dump(HU, open('audio/huss.json', 'w'))
print(f'duración {len(Y) / SR:.2f} s, {len(NW)} palabras')

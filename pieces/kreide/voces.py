# python3 voces.py : voz del Sistema robótica y voz del Chef más grave (mantiene la duración) -> audio/voz-sin-silencios.wav
import json, subprocess, numpy as np, wave, os
src, out, S = 'audio/voz-sin-silencios-orig.wav', 'audio/voz-sin-silencios.wav', 'audio/_seg'
R = json.load(open('audio/sprecher.json'))
def rd(f):
    w = wave.open(f); n = w.getnframes(); ch = w.getnchannels(); x = np.frombuffer(w.readframes(n), '<i2').astype(np.float32) / 32768; sr = w.getframerate(); w.close()
    return (x.reshape(-1, ch).mean(1) if ch > 1 else x), sr
x, sr = rd(src); y = x.copy()
FX = {'CHEF': 'rubberband=pitch=0.78:formant=preserved,bass=g=4:f=140,alimiter=limit=0.9',
      'SYS': 'rubberband=pitch=0.93:formant=preserved,chorus=0.6:0.8:20|28:0.35|0.3:0.25|0.4:2|1.5,highpass=f=150,lowpass=f=7500,aecho=0.8:0.5:18:0.18'}
for k, (sp, a, b, _) in enumerate(R):
    if sp not in FX: continue
    if k + 1 < len(R): b = min(b, R[k + 1][1])
    i, j = int(a * sr), int(b * sr); seg = x[i:j]
    wave_ = wave.open(S + '.wav', 'wb'); wave_.setnchannels(1); wave_.setsampwidth(2); wave_.setframerate(sr); wave_.writeframes((np.clip(seg, -1, 1) * 32767).astype('<i2').tobytes()); wave_.close()
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', S + '.wav', '-af', FX[sp], '-ar', str(sr), '-ac', '1', S + 'o.wav'], check=True)
    z, _ = rd(S + 'o.wav'); z = np.pad(z, (0, max(0, len(seg) - len(z))))[:len(seg)]
    z *= (np.sqrt(np.mean(seg ** 2)) + 1e-9) / (np.sqrt(np.mean(z ** 2)) + 1e-9)
    f = min(int(.012 * sr), len(seg) // 2); r = np.ones(len(seg)); r[:f] = np.linspace(0, 1, f); r[-f:] = np.linspace(1, 0, f)
    y[i:j] = seg * (1 - r) + z * r
w = wave.open(out, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
os.remove(S + '.wav'); os.remove(S + 'o.wav'); print('ok', len(R), 'tramos')

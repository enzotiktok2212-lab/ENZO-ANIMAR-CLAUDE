#!/usr/bin/env python3
"""Acelera (sin cambiar el tono) los bloques de HUSS de la voz.
uso: acelerar.py in.mp3 out.wav factor  — bloques = huecos entre frases (de raw_orig.json), bordes por energía."""
import subprocess, sys, json, numpy as np
src, out, f = sys.argv[1], sys.argv[2], float(sys.argv[3]); R = 44100
pcm = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar',str(R),'-f','f32le','-'],capture_output=True).stdout, np.float32)
GAPS = [(3.42, 6.22), (24.36, 27.02), (67.26, 70.58), (86.88, 89.56), (109.02, 111.94)]
hop = int(R*.01); env = np.sqrt(np.convolve(pcm**2, np.ones(hop)/hop, 'same'))[::hop]
blocks = []
for a, b in GAPS:
    e = env[int(a*100):int(b*100)]; th = max(e.max()*.06, .004)
    v = np.where(e > th)[0]
    s, t = a + v[0]/100 - .03, a + v[-1]/100 + .08
    blocks.append((max(a, s), min(b, t)))
parts = []; p = 0
for a, b in blocks:
    A, B = int(a*R), int(b*R); parts.append(pcm[p:A])
    fast = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(R),'-ac','1','-i','-','-af',f'atempo={f}','-f','f32le','-'],input=pcm[A:B].tobytes(),capture_output=True).stdout, np.float32)
    parts.append(fast); p = B; print(f'{a:.2f}-{b:.2f} ({b-a:.2f}s) -> {(b-a)/f:.2f}s', file=sys.stderr)
parts.append(pcm[p:])
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(R),'-ac','1','-i','-',out], input=np.concatenate(parts).tobytes(), check=True)
json.dump(blocks, open(out + '.bloques.json', 'w'))

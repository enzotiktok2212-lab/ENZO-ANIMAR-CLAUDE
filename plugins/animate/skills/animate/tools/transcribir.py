#!/usr/bin/env python3
"""Transcribe con faster-whisper (modelo small local) -> raw_words.json [[inicio, fin, palabra], ...] y texto.
uso: python3 transcribir.py <audio|video> <raw_words.json> [--lang de] [--txt transcripcion.txt]
Modelo: npm @skillninja/shortmovie-telop-model-p0..p3 (unir model.bin.part*) en /home/user/whisper-small/model
(o WHISPER_MODEL=<carpeta>). El audio se decodifica con ffmpeg (el PyAV instalado no acepta metadata_errors)."""
import json, os, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
a = sys.argv[1:]; lang = 'de'; txt = None
if '--lang' in a: i = a.index('--lang'); lang = a[i + 1]; del a[i:i + 2]
if '--txt' in a: i = a.index('--txt'); txt = a[i + 1]; del a[i:i + 2]
src, out = a[0], a[1]
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vn', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
m = WhisperModel(os.environ.get('WHISPER_MODEL', '/home/user/whisper-small/model'), device='cpu', compute_type='int8')
segs, _ = m.transcribe(np.frombuffer(pcm, np.float32), language=lang, word_timestamps=True, beam_size=5)
W, L = [], []
for s in segs:
    L.append(f'[{s.start:6.2f}-{s.end:6.2f}] {s.text.strip()}')
    W += [[round(float(w.start), 3), round(float(w.end), 3), w.word.strip()] for w in s.words or []]
json.dump(W, open(out, 'w'), ensure_ascii=False)
if txt: open(txt, 'w').write('\n'.join(L) + '\n')
print(f'{len(W)} palabras', file=sys.stderr)

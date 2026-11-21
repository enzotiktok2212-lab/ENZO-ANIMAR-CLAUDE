# python3 prep_audio.py voz.wav raw_words.json skript.txt outdir
# Recorta silencios (pausas -> ~80 ms), alinea el guion exacto con las palabras de Whisper y escribe segs.json, words.json, voz-sin-silencios.wav.
import json, sys, subprocess, re, difflib
voz, raw, sk, out = sys.argv[1:5]; M = float(sys.argv[5]) if len(sys.argv) > 5 else .04
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voz], capture_output=True, text=True).stdout)
log = subprocess.run(['ffmpeg', '-i', voz, '-af', 'silencedetect=n=' + __import__('os').environ.get('SIL','-40') + 'dB:d=0.1', '-f', 'null', '-'], capture_output=True, text=True).stderr
v = [float(x) for x in re.findall(r'silence_(?:start|end): ([0-9.]+)', log)]
sil = [(v[i], v[i + 1] if i + 1 < len(v) else dur) for i in range(0, len(v), 2)]
spans, cur = [], 0.0
for a, b in sil:
    if a > cur: spans.append([max(0, cur - M) if cur > 0 else 0, min(dur, a + M)])
    cur = b
if cur < dur - .05: spans.append([cur - M, dur])
segs, t = [], 0
for a, b in spans: segs.append({'src': [round(a, 3), round(b, 3)], 'dst': [round(t, 3), round(t + b - a, 3)]}); t += b - a
json.dump(segs, open(out + '/segs.json', 'w'))
f = ';'.join(f"[0:a]atrim={s['src'][0]}:{s['src'][1]},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={s['src'][1]-s['src'][0]-0.008:.3f}:d=0.008[a{i}]" for i, s in enumerate(segs))
f += ';' + ''.join(f'[a{i}]' for i in range(len(segs))) + f'concat=n={len(segs)}:v=0:a=1[o]'
open(out + '/_f.txt', 'w').write(f)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', voz, '-filter_complex_script', out + '/_f.txt', '-map', '[o]', '-ar', '44100', out + '/voz-sin-silencios.wav'], check=True)
def m(x):
    for s in segs:
        if x <= s['src'][1]: return round(s['dst'][0] + max(0, x - s['src'][0]), 3)
    return round(t, 3)
R = json.load(open(raw)); norm = lambda w: re.sub(r'[^a-zäöüß0-9]', '', w.lower())
SW = open(sk).read().split()
sm = difflib.SequenceMatcher(None, [norm(w) for w in SW], [norm(w[2]) for w in R], autojunk=False)
T = [None] * len(SW)
for bl in sm.get_matching_blocks():
    for k in range(bl.size): T[bl.a + k] = (R[bl.b + k][0], R[bl.b + k][1])
for i in range(len(SW)):   # palabras sin pareja: se reparten entre las vecinas
    if T[i] is None:
        j = i
        while j < len(SW) and T[j] is None: j += 1
        a = T[i - 1][1] if i else 0; b = T[j][0] if j < len(SW) else a + .4 * (j - i); n = j - i
        for k in range(n): T[i + k] = (a + (b - a) * k / n, a + (b - a) * (k + 1) / n)
W, n = [], 1
for w, (a, b) in zip(SW, T):
    W.append([m(a), m(b), w, n])
    if re.search(r'[.?!:…]["“"]?$', w): n += 1
json.dump(W, open(out + '/words.json', 'w'), ensure_ascii=False)
print(len(segs), 'tramos', round(t, 2), 's;', len(W), 'palabras; sin pareja', sum(1 for x in sm.get_opcodes() if x[0] != 'equal'))

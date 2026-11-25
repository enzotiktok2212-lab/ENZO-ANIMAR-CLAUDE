# Alineación palabra a palabra guion↔Whisper con Needleman-Wunsch y similitud difusa (el ceceo cambia la ortografía).
import json, re, difflib, sys
R = json.load(open('audio/raw_words.json')); segs = json.load(open('audio/segs.json'))
SW = open('skript.txt').read().split()
def nz(w):
    w = re.sub(r'[^a-zäöüß0-9]', '', w.lower()).replace('th', 't').replace('ß', 's').replace('ss', 's')
    return w.replace('s', 't').replace('w', 'r')
A = [nz(w) for w in SW]; B = [nz(w[2]) for w in R]
n, m = len(A), len(B); G = -0.45
S = [[0.0] * (m + 1) for _ in range(n + 1)]; P = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1): S[i][0] = i * G; P[i][0] = 1
for j in range(1, m + 1): S[0][j] = j * G; P[0][j] = 2
for i in range(1, n + 1):
    for j in range(1, m + 1):
        r = difflib.SequenceMatcher(None, A[i-1], B[j-1]).ratio()
        c = [S[i-1][j-1] + (r * 2 - .8), S[i-1][j] + G, S[i][j-1] + G]
        k = max(range(3), key=lambda q: c[q]); S[i][j] = c[k]; P[i][j] = k
i, j, T = n, m, [None] * n
while i > 0 or j > 0:
    k = P[i][j] if i and j else (1 if i else 2)
    if k == 0:
        i -= 1; j -= 1
        if difflib.SequenceMatcher(None, A[i], B[j]).ratio() >= .3: T[i] = (R[j][0], R[j][1])
    elif k == 1: i -= 1
    else: j -= 1
miss = sum(t is None for t in T)
for i in range(n):
    if T[i] is None:
        j = i
        while j < n and T[j] is None: j += 1
        a = T[i-1][1] if i else 0; b = T[j][0] if j < n else a + .4 * (j - i); k = j - i
        for q in range(k): T[i+q] = (a + (b-a)*q/k, a + (b-a)*(q+1)/k)
tot = segs[-1]['dst'][1]
def mp(x):
    for s in segs:
        if x <= s['src'][1]: return round(s['dst'][0] + max(0, x - s['src'][0]), 3)
    return round(tot, 3)
W, s = [], 1
for w, (a, b) in zip(SW, T):
    W.append([mp(a), mp(b), w, s])
    if re.search(r'[.?!:…]["“"]?$', w): s += 1
json.dump(W, open('audio/words.json', 'w'), ensure_ascii=False)
print('sin pareja', miss, 'de', n)

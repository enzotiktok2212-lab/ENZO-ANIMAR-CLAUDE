# python3 repl.py file t0 <<< nuevo_bloque : sustituye el plano que empieza en shot(t0, … hasta el siguiente comentario o plano
import sys, re
f, t0 = sys.argv[1], sys.argv[2]; new = sys.stdin.read().rstrip('\n')
s = open(f).read(); a = s.index(f'shot({t0},'); m = re.search(r'\n(// |shot\()', s[a + 5:]); b = a + 5 + m.start() if m else len(s)
s = s[:a] + new + s[b:]; open(f, 'w').write(s); print('ok', t0)

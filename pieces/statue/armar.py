# python3 armar.py : une src/main.js + src/p/*.js (planos) -> src/index.js
import glob
s = open('src/main.js').read(); body = ''.join(open(f).read() for f in sorted(glob.glob('src/p/*.js')))
open('src/index.js', 'w').write(s.replace('//@@PLANOS@@', body))

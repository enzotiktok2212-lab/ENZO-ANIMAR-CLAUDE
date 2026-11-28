# python3 armar_cover.py : como armar.py, pero añade las portadas (src/cover/*.js) -> src/index_cover.js (index_cover.html)
import glob
s = open('src/main.js').read(); body = ''.join(open(f).read() for f in sorted(glob.glob('src/p/*.js')))
cov = ''.join(open(f).read() for f in sorted(glob.glob('src/cover/*.js')))
open('src/index_cover.js', 'w').write(s.replace('//@@PLANOS@@', body).replace('//@@COVER@@', cov))
open('index_cover.html', 'w').write(open('index.html').read().replace('./src/index.js', './src/index_cover.js'))

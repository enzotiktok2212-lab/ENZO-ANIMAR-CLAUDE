# python3 mk_main.py : src/main_top.js (propio de wunsch) + la parte común de ebbe (capa 2D, subtítulos, transiciones, render) -> src/main.js
import re
top = open('src/main_top.js').read(); eb = open('src/main_rest.js').read()
open('src/main.js', 'w').write(top + '\n' + eb)

#!/bin/bash
# revisión de todos los planos en 4 procesos: ./rv.sh <carpeta> <frac>   (luego python3 sheet.py <carpeta>)
cd "$(dirname "$0")"; D=${1:-rv}; F=${2:-.5}; rm -rf $D; mkdir -p $D
N=$(node -e "const s=require('fs').readFileSync('src/index.js','utf8'); console.log((s.match(/^shot\(/gm)||[]).length)")
for p in 0 1 2 3; do L=$(seq $((p+1)) 4 $N | paste -sd,); node mids.mjs "http://pieza/index.html?ss=1" $D $L $F > $D/log$p.txt 2>&1 & done; wait; grep -h "error\|Error" $D/log*.txt | head; python3 sheet.py $D; ls $D/*.png | wc -l

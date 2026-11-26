#!/bin/bash
# Render idempotente en P procesos (salta los fotogramas ya hechos; si un navegador se cae, se relanza su tramo). Playwright sirve los archivos (serve.mjs).
cd "$(dirname "$0")"; N=$(python3 -c "import math;print(math.ceil(194.5*30))")
mkdir -p renders/frames; P=${P:-4}; S=$(( (N + P - 1) / P ))
seg() { local a=$1 b=$2 i=$3; for try in 1 2 3 4 5 6 7 8; do node render2.mjs "http://pieza/index.html" renders/frames $a $b >> renders/log$i.txt 2>&1; local n=0; for f in $(seq $a $((b-1))); do [ -f renders/frames/f$(printf %05d $f).jpg ] || n=$((n+1)); done; [ $n -eq 0 ] && return; echo "relanzo $i ($n faltan)" >> renders/log$i.txt; done; }
for i in $(seq 0 $((P-1))); do a=$((i*S)); b=$(( (i+1)*S < N ? (i+1)*S : N )); seg $a $b $i & done; wait; echo done

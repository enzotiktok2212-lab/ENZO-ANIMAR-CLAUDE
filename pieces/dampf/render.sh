#!/bin/bash
# Render idempotente en 4 procesos (salta los fotogramas ya hechos). Sin servidor: Playwright sirve los archivos (serve.mjs).
cd "$(dirname "$0")"; N=$(python3 -c "import math;print(math.ceil(122.9*30))")
mkdir -p renders; P=${P:-4}; S=$(( (N + P - 1) / P ))
for i in $(seq 0 $((P-1))); do a=$((i*S)); b=$(( (i+1)*S < N ? (i+1)*S : N )); node render2.mjs "http://pieza/index.html" renders/frames $a $b > renders/log$i.txt 2>&1 & done; wait; echo done

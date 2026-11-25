#!/bin/bash
# Render idempotente en 4 procesos (salta los fotogramas ya hechos). Servidor: python3 -m http.server 8795
cd "$(dirname "$0")"; N=$(python3 -c "import math;print(math.ceil(148.5*30))")
pgrep -f "http.server 8795" >/dev/null || (nohup python3 -m http.server 8795 >/dev/null 2>&1 &)
mkdir -p renders; P=4; S=$(( (N + P - 1) / P ))
for i in $(seq 0 $((P-1))); do a=$((i*S)); b=$(( (i+1)*S < N ? (i+1)*S : N )); node render2.mjs "http://localhost:8795/index.html" renders/frames $a $b > renders/log$i.txt 2>&1 & done; wait; echo done

#!/bin/bash
# Render idempotente en 3 procesos (salta los fotogramas ya hechos). Requiere el servidor: python3 -m http.server 8767
cd "$(dirname "$0")"; N=$(python3 -c "import math;print(math.ceil(160.35*30))")
pgrep -f "http.server 8767" >/dev/null || (nohup python3 -m http.server 8767 >/dev/null 2>&1 &)
P=3; S=$(( (N + P - 1) / P ))
for i in $(seq 0 $((P-1))); do a=$((i*S)); b=$(( (i+1)*S < N ? (i+1)*S : N )); node render2.mjs "http://localhost:8767/index.html" renders/frames $a $b > renders/log$i.txt 2>&1 & done; wait; echo done

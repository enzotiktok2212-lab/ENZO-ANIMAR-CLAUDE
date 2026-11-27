#!/bin/bash
# Render idempotente de un tramo [A, B) en P procesos: ./rango.sh A B [P]   (para repartir el render entre varias sesiones)
cd "$(dirname "$0")"; A=$1; B=$2; P=${3:-4}; S=$(( (B - A + P - 1) / P )); mkdir -p renders/frames
seg() { local a=$1 b=$2 i=$3; for try in $(seq 1 12); do node render2.mjs "http://pieza/index.html" renders/frames $a $b >> renders/rlog$i.txt 2>&1; local n=0; for f in $(seq $a $((b-1))); do [ -f renders/frames/f$(printf %05d $f).jpg ] || n=$((n+1)); done; [ $n -eq 0 ] && return; echo "relanzo $i ($n faltan)" >> renders/rlog$i.txt; done; }
for i in $(seq 0 $((P-1))); do a=$((A + i*S)); b=$(( A + (i+1)*S < B ? A + (i+1)*S : B )); seg $a $b $i & done; wait; echo "tramo $A-$B listo"

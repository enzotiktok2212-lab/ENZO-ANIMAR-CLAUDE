#!/bin/bash
# revisión: 4 procesos, al 12 % y al 60 % (python3 sheet.py <dir> para las hojas)
cd "$(dirname "$0")"; U=http://localhost:8812/index.html; L=${1:-all}
if [ "$L" = all ]; then L=$(seq -s, 1 104); fi
IFS=, read -ra A <<< "$L"; n=${#A[@]}; q=$(( (n+1)/2 ))
P1=$(IFS=,; echo "${A[*]:0:$q}"); P2=$(IFS=,; echo "${A[*]:$q}")
for f in .12 .6; do d=review; [ $f = .6 ] && d=review60
  node mids.mjs $U $d "$P1" $f > /dev/null 2>&1 & [ -n "$P2" ] && node mids.mjs $U $d "$P2" $f > /dev/null 2>&1 & done; wait; echo hecho

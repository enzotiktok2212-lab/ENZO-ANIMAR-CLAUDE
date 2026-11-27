#!/bin/bash
# Vuelve a extraer los fotogramas de los trozos de otras sesiones (partes/pNNNNN.mp4) a renders/frames: ./juntar.sh carpeta
cd "$(dirname "$0")"; mkdir -p renders/frames
for f in "$1"/p*.mp4; do s=$((10#$(basename $f .mp4 | tr -d p))); ffmpeg -loglevel error -y -i "$f" -q:v 1 -start_number $s renders/frames/f%05d.jpg || exit 1; done; ls renders/frames | wc -l

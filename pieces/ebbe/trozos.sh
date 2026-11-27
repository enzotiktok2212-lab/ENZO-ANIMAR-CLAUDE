#!/bin/bash
# Codifica los fotogramas [A, B) en trozos MP4 de alta calidad (CRF 12, 300 fotogramas cada uno) en renders/partes/: ./trozos.sh A B
cd "$(dirname "$0")"; A=$1; B=$2; mkdir -p renders/partes
for ((s = A; s < B; s += 300)); do n=$(( s + 300 < B ? 300 : B - s )); ffmpeg -loglevel error -y -framerate 30 -start_number $s -i renders/frames/f%05d.jpg -frames:v $n -c:v libx264 -preset slow -crf 12 -pix_fmt yuv420p renders/partes/p$(printf %05d $s).mp4 || exit 1; done; ls -la renders/partes

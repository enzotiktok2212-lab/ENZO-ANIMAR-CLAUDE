#!/bin/bash
# Une los fotogramas con la mezcla final: H.264 1080×1920, 30 fps, AAC 192k.
cd "$(dirname "$0")"
ffmpeg -loglevel error -y -framerate 30 -i renders/frames/f%05d.jpg -i renders/mezcla-final.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart renders/statue.mp4 && ls -la renders/statue.mp4

#!/bin/bash
# Mezcla final: voz delante, música de fondo clara por debajo, efectos discretos que nunca tapan la narración.
#   voz      −16 LUFS (limitada)
#   música   −24 LUFS (~14 dB por debajo de la voz), ducking suave (ratio 1.5); con −110 sale sin música
#   tensión  −27 LUFS (risers + golpes dramáticos; pista aparte con ducking suave, ratio 1.5): se oyen enteros sin tapar la voz
#   efectos  −30 LUFS, recorte de −6 dB en la banda de la voz (900 y 2400 Hz) y ducking (ratio 4) mientras habla:
#            incluso en su momento más fuerte quedan ≥14 dB por debajo de la voz
# uso: ./mezclar.sh voz.wav musica.mp3 efectos.wav salida.wav [dB_musica] [dB_efectos]
set -e
V=$1; M=$2; S=$3; O=$4; D=111.6
gain() { ffmpeg -hide_banner -i "$1" -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | awk -v t=$2 '{printf "%.2f", t - $2}'; }
GV=$(gain "$V" -16); GM=$(gain "$M" ${5:--24}); GS=$(gain "$S" ${6:--30})
TEN=${TENSION:-}; [ -n "$TEN" ] && [ -f "$TEN" ] || TEN=""
if [ -n "$TEN" ]; then GT=$(gain "$TEN" -27); TIN="-i $TEN"; TF="[3:a]aresample=44100,aformat=channel_layouts=stereo,apad,atrim=0:$D,volume=${GT}dB,equalizer=f=1500:t=q:w=1.2:g=-3[t0];[t0][sc3]sidechaincompress=threshold=0.05:ratio=1.5:attack=30:release=400[t]"; SPL=4; MIXIN="[v][m][s][t]"; N=4; else TIN=""; TF=""; SPL=3; MIXIN="[v][m][s]"; N=3; fi
ffmpeg -loglevel error -y -i "$V" -i "$M" -i "$S" $TIN -filter_complex "\
[0:a]aresample=44100,aformat=channel_layouts=stereo,apad,atrim=0:$D,volume=${GV}dB,alimiter=limit=0.8:attack=2:release=60,asplit=$SPL[v][sc1][sc2]$( [ $SPL = 4 ] && echo '[sc3]');\
[1:a]aresample=44100,aformat=channel_layouts=stereo,apad,atrim=0:$D,volume=${GM}dB[m0];[m0][sc1]sidechaincompress=threshold=0.04:ratio=1.5:attack=40:release=450[m];\
[2:a]aresample=44100,aformat=channel_layouts=stereo,apad,atrim=0:$D,volume=${GS}dB,equalizer=f=900:t=q:w=1.0:g=-6,equalizer=f=2400:t=q:w=1.0:g=-6[s0];\
[s0][sc2]sidechaincompress=threshold=0.03:ratio=4:attack=5:release=250[s];\
${TF:+$TF;}${MIXIN}amix=inputs=$N:duration=first:normalize=0,alimiter=limit=0.8,volume=-1dB,atrim=0:$D" -ar 44100 -ac 2 "$O"
echo "tensión ${GT:-0} dB, voz ${GV} dB, música ${GM} dB, efectos ${GS} dB -> $O"

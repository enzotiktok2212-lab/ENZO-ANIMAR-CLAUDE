#!/bin/bash
# Vigilante del render: si no hay ningún proceso de render vivo, o si no aparece ningún fotograma nuevo en 8 min,
# mata lo que quede y relanza render.sh (idempotente: salta los fotogramas ya hechos). Al terminar, ejecuta finish.sh.
# uso: nohup ./watchdog.sh > renders/watchdog.log 2>&1 &
cd "$(dirname "$0")"; mkdir -p renders/frames
N=$(python3 -c "import math;print(math.ceil(175.6*30))"); last=-1; stall=0
while true; do
  n=$(ls renders/frames 2>/dev/null | wc -l)
  if [ "$n" -ge "$N" ]; then echo "$(date +%T) todos los fotogramas ($n)"; break; fi
  if ! pgrep -f "render2.mjs" > /dev/null; then echo "$(date +%T) sin render vivo ($n/$N): relanzo"; nohup ./render.sh >> renders/render.log 2>&1 & stall=0; fi
  if [ "$n" -eq "$last" ]; then stall=$((stall+1)); else stall=0; fi
  if [ "$stall" -ge 8 ]; then echo "$(date +%T) atascado en $n: mato y relanzo"; pkill -f render2.mjs; pkill -f "render.sh"; sleep 5; nohup ./render.sh >> renders/render.log 2>&1 & stall=0; fi
  last=$n; echo "$(date +%T) $n/$N"; sleep 60
done
if [ -f renders/mezcla-final.wav ]; then ./finish.sh && echo "$(date +%T) vídeo listo"; else echo "$(date +%T) falta renders/mezcla-final.wav"; fi

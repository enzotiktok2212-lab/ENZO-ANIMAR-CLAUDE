#!/bin/bash
# Deja un contenedor nuevo listo para hacer vídeos «In dieser Stadt» (idempotente: salta lo que ya está).
# uso: ./preparar-entorno.sh [carpeta de la plantilla, por defecto pieces/schutzengel]
set -e
cd "$(dirname "$0")"; T=${1:-pieces/schutzengel}

# 1. Whisper small (tiempos de palabra en alemán) — el modelo sale de npm porque Hugging Face está bloqueado.
python3 -c "import faster_whisper" 2>/dev/null || pip install -q faster-whisper
M=/home/user/whisper-small/model
if [ ! -f $M/model.bin ]; then
  tmp=$(mktemp -d); mkdir -p $M
  for p in 0 1 2 3; do (cd $tmp && npm pack -q @skillninja/shortmovie-telop-model-p$p >/dev/null && mkdir x$p && tar xzf skillninja-shortmovie-telop-model-p$p-*.tgz -C x$p); done
  cp $tmp/x0/package/{tokenizer.json,vocabulary.json,config.json,preprocessor_config.json} $M/
  cat $tmp/x0/package/model.bin.part0 $tmp/x1/package/model.bin.part1 $tmp/x2/package/model.bin.part2 $tmp/x3/package/model.bin.part3 > $M/model.bin
  [ "$(sha256sum $M/model.bin | cut -d' ' -f1)" = "$(cat $tmp/x0/package/model.sha256)" ] || { echo "model.bin: checksum distinto"; rm -f $M/model.bin; exit 1; }
  rm -rf $tmp
fi

# 2. Motor three.js de la plantilla (three r170 + fuentes).
[ -d "$T/node_modules/three" ] || (cd "$T" && npm install --no-audit --no-fund >/dev/null)

# 3. Comprobaciones: ffmpeg y Playwright con Chromium (preinstalado en el contenedor).
command -v ffmpeg >/dev/null || { echo "falta ffmpeg"; exit 1; }
node -e "require('playwright')" 2>/dev/null || { echo "falta playwright"; exit 1; }
echo "listo: whisper en $M, motor en $T/node_modules"

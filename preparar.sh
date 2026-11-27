#!/bin/bash
# Deja el contenedor listo para hacer vídeos de «In dieser Stadt» (idempotente).
# uso: ./preparar.sh [pieza]   (por defecto pieces/schutzengel, la plantilla actual)
set -e
cd "$(dirname "$0")"
PIEZA=${1:-pieces/schutzengel}

# 1. Python: faster-whisper (transcripción), Pillow (hojas de revisión), numpy (mezcla)
python3 -c "import faster_whisper, PIL, numpy" 2>/dev/null || pip install -q faster-whisper pillow numpy

# 2. Modelo Whisper small (desde npm, en 4 partes) → /home/user/whisper-small/model
M=/home/user/whisper-small/model
if [ ! -f "$M/model.bin" ]; then
  T=$(mktemp -d); mkdir -p "$M"
  (cd "$T" && for i in 0 1 2 3; do npm pack -s "@skillninja/shortmovie-telop-model-p$i" >/dev/null; done && for f in *.tgz; do tar xzf "$f" && cp -rn package/* "$M"/ 2>/dev/null; rm -rf package; done)
  if ls "$M"/model.bin.part* >/dev/null 2>&1; then cat $(ls "$M"/model.bin.part* | sort) > "$M/model.bin" && rm "$M"/model.bin.part*; fi
  rm -rf "$T"
fi

# 3. Motor three.js de la plantilla (three, tipografías)
[ -d "$PIEZA/node_modules/three" ] || (cd "$PIEZA" && npm install -s --no-audit --no-fund)

# 4. Comprobación
ffmpeg -version | head -1
node -e "require('playwright');console.log('playwright ok')"
python3 -c "from faster_whisper import WhisperModel; WhisperModel('$M', device='cpu', compute_type='int8'); print('whisper ok')"
echo "listo: plantilla $PIEZA"

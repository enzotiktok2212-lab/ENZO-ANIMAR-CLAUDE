# python3 collage.py <dir> <desde> <hasta> <salida> : collage numerado (5 columnas) de los planos s<desde>..s<hasta>
import sys
from PIL import Image, ImageDraw, ImageFont
d, a, b, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
n = b - a + 1; cols = 5; rows = (n + cols - 1) // cols; w, h = 300, 533
S = Image.new('RGB', (w * cols, h * rows), (20, 20, 20)); D = ImageDraw.Draw(S)
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 34)
except Exception: F = ImageFont.load_default()
for i in range(n):
    k = a + i; x, y = (i % cols) * w, (i // cols) * h
    try: S.paste(Image.open(f'{d}/s{k:02d}.png').convert('RGB').resize((w, h)), (x, y))
    except Exception: continue
    D.rectangle([x, y, x + 64, y + 44], fill=(0, 0, 0)); D.text((x + 8, y + 4), str(k), fill=(255, 230, 0), font=F)
S.save(out, quality=86)

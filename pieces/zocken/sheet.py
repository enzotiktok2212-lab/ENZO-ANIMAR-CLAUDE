# python3 sheet.py <dir> : hojas de 10 (5x2) a 270 px de ancho, en orden numérico y con el número de plano
import sys, glob, re
from PIL import Image, ImageDraw
d = sys.argv[1]; fs = sorted(glob.glob(d + '/s*.png'), key=lambda f: int(re.findall(r'(\d+)\.png$', f)[0]))
for i in range(0, len(fs), 10):
    S = Image.new('RGB', (270 * 5, 480 * 2)); D = ImageDraw.Draw(S)
    for j, f in enumerate(fs[i:i + 10]):
        x, y = (j % 5) * 270, (j // 5) * 480; S.paste(Image.open(f).convert('RGB').resize((270, 480)), (x, y)); D.rectangle([x, y, x + 34, y + 18], fill=(0, 0, 0)); D.text((x + 3, y + 3), re.findall(r'(\d+)\.png$', f)[0], fill=(255, 255, 0))
    S.save(f'{d}/sheet{i // 10:02d}.jpg', quality=85)

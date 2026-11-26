# python3 sheet.py <dir> : hojas de 10 (5x2) a 270 px de ancho
import sys, glob
from PIL import Image
d = sys.argv[1]; fs = sorted(glob.glob(d + '/s*.png'))
for i in range(0, len(fs), 10):
    S = Image.new('RGB', (270 * 5, 480 * 2))
    for j, f in enumerate(fs[i:i + 10]): S.paste(Image.open(f).convert('RGB').resize((270, 480)), ((j % 5) * 270, (j // 5) * 480))
    S.save(f'{d}/sheet{i // 10}.jpg', quality=85)

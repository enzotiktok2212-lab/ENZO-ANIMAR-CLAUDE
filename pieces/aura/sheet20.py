# python3 sheet20.py <dir> : hojas de 20 (5x4) a 216 px, con el número de plano
import sys, glob
from PIL import Image, ImageDraw
d = sys.argv[1]; fs = sorted(glob.glob(d + '/s*.png'))
for i in range(0, len(fs), 20):
    S = Image.new('RGB', (216 * 5, 384 * 4)); D = ImageDraw.Draw(S)
    for j, f in enumerate(fs[i:i + 20]):
        x, y = (j % 5) * 216, (j // 5) * 384; S.paste(Image.open(f).convert('RGB').resize((216, 384)), (x, y)); D.rectangle([x, y, x + 34, y + 16], fill=(0, 0, 0)); D.text((x + 3, y + 2), f[-7:-4], fill=(255, 255, 0))
    S.save(f'{d}/hoja{i // 20}.jpg', quality=82)

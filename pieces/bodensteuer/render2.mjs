// node render2.mjs <url> <outdir> <frameIni> <frameFin>   (fotogramas [ini, fin) a 30 fps; salta los que ya existen)
import { createRequire } from 'module'; import fs from 'fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [url, out, a, b] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto(url); await p.waitForFunction('window.__ready === true', null, { timeout: 300000 });
const el = await p.$('#stage'); const t0 = Date.now();
for (let f = +a; f < +b; f++) { const path = `${out}/f${String(f).padStart(5, '0')}.png`; if (fs.existsSync(path)) continue;
  await p.evaluate(t => window.renderAt(t), f / 30); await el.screenshot({ path });
  if (f % 100 === 0) console.log(f, ((Date.now() - t0) / 1000).toFixed(0) + 's'); }
await br.close();

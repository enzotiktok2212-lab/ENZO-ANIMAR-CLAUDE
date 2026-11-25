// node cv.mjs <v> '<json CV>' : prueba rápida de una portada (ss=1) -> renders/t.png
import { createRequire } from 'module'; import { serve } from './serve.mjs'; const { chromium } = createRequire(import.meta.url)('playwright');
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('pageerror:', e.message));
await serve(p, process.cwd()); await p.goto('http://pieza/index.html?ss=1'); await p.waitForFunction('window.__ready === true', null, { timeout: 300000 });
const v = +process.argv[2]; if (process.argv[3]) await p.evaluate(([o, v]) => (v ? window.CV1 : window.CV)(o), [JSON.parse(process.argv[3]), v]); await p.evaluate(v => window.renderCover(v), v);
const b64 = await p.evaluate(() => document.querySelector('#stage canvas:not([style*="none"])').toDataURL('image/jpeg', .8).split(',')[1]); (await import('fs')).writeFileSync(`renders/t${v}.jpg`, Buffer.from(b64, 'base64')); await br.close();

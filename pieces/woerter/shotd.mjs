// node shotd.mjs <outdir> modos...  → capturas de design.html
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
const [out, ...modes] = process.argv.slice(2); const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
for (const m of modes) { await p.goto('http://localhost:8769/design.html#' + m); await p.reload(); await p.waitForFunction('window.__ready === true', null, { timeout: 180000 }).catch(e => console.log('timeout', m)); await p.screenshot({ path: `${out}/${m}.png` }); console.log('ok', m); } await br.close();

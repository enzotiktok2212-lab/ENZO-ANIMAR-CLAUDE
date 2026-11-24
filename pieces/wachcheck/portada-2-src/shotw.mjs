import { createRequire } from 'module'; import { serve } from './serve.mjs'; import fs from 'fs'; const { chromium } = createRequire(import.meta.url)('playwright');
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => m.type() === 'error' && console.log('console', m.text()));
await serve(p, process.cwd()); await p.goto('http://pieza/wach.html' + (process.argv[3] || '')); await p.waitForFunction('window.__done === true', null, { timeout: 300000 });
const b64 = await p.evaluate(() => document.getElementById('out').toDataURL('image/png').split(',')[1]); fs.writeFileSync(process.argv[2] || 'wach.png', Buffer.from(b64, 'base64')); await br.close();

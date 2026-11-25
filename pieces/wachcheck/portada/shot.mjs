import { createRequire } from 'module'; import http from 'http'; import fs from 'fs'; import path from 'path';
const { chromium } = createRequire(import.meta.url)('playwright'); const root = process.cwd();
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); const ext = path.extname(f); r.setHeader('Content-Type', { '.js': 'text/javascript', '.html': 'text/html', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream'); fs.createReadStream(f).on('error', () => { r.statusCode = 404; r.end(); }).pipe(r); }).listen(8765);
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('pageerror', e.message)); p.on('console', m => m.type() === 'error' && console.log('console', m.text()));
await p.goto('http://localhost:8765/index.html' + (process.argv[3] || '')); await p.waitForFunction('window.__done', null, { timeout: 240000 });
const b64 = await p.evaluate(() => document.getElementById('out').toDataURL('image/png').split(',')[1]); fs.writeFileSync(process.argv[2] || 'out.png', Buffer.from(b64, 'base64')); await br.close(); srv.close();

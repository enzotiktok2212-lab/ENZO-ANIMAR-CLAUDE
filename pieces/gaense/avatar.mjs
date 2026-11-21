import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1080 } }); p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto('http://localhost:8771/avatar.html'); await p.waitForFunction('window.__ready === true', null, { timeout: 200000 });
await (await p.$('#stage canvas:last-child')).screenshot({ path: 'renders/perfil.png' }); await br.close();

const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const size = process.argv[2] || 1024, out = process.argv[3] || 1024;
  const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: +size, height: +size } });
  p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('err:', e.message));
  await p.goto(`http://localhost:8765/scene.html?size=${size}&out=${out}`);
  await p.waitForFunction(() => window.__done, null, { timeout: 590000 });
  for (const k of ['circle', 'square']) {
    const d = await p.evaluate(k => window['__' + k], k);
    fs.writeFileSync(`${k}_${out}.png`, Buffer.from(d.split(',')[1], 'base64'));
  }
  await b.close();
})();

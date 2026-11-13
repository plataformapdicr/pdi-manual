'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const manual = path.join(__dirname, 'DOCS', 'manual');
execFileSync(process.execPath, [path.join(manual, 'armar.cjs')], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, TZ: 'America/Costa_Rica' }
});
const sitio = path.join(__dirname, '_site');
fs.mkdirSync(sitio, { recursive: true });
for (const nombre of ['index.html', 'manual-pdi.html']) {
  fs.copyFileSync(path.join(manual, 'manual-pdi.html'), path.join(sitio, nombre));
}
fs.writeFileSync(path.join(sitio, '.nojekyll'), '');
console.log('Sitio listo en _site/index.html');

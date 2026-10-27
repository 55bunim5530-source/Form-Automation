const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

async function freePort() {
  const probe = http.createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  return port;
}

test('MSDS serves only its page and required vendor files', async () => {
  const port = await freePort();
  const child = spawn(process.execPath, ['server.js'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', INTEGRATED_MODE: '1' },
    stdio: 'ignore',
  });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      try {
        const response = await fetch(`${base}/`);
        if (response.ok) { ready = true; break; }
      } catch {}
      await delay(100);
    }
    assert.ok(ready, 'MSDS test server did not start');

    for (const route of [
      '/', '/index.html', '/vendor/sheetjs/xlsx.full.min.js',
      '/vendor/pdfjs/pdf.min.js', '/vendor/pdfjs/pdf.worker.min.js',
    ]) {
      const response = await fetch(`${base}${route}`, { method: 'HEAD' });
      assert.equal(response.status, 200, route);
    }
    for (const route of [
      '/server.js', '/pdf-download.js', '/package.json', '/extract_table.py',
      '/uploads/private.pdf', '/.env.local', '/vendor/qrcodejs/qrcode.min.js',
    ]) {
      const response = await fetch(`${base}${route}`, { method: 'HEAD' });
      assert.equal(response.status, 404, route);
    }
    const post = await fetch(`${base}/index.html`, { method: 'POST' });
    assert.equal(post.status, 405);
  } finally {
    child.kill();
  }
});

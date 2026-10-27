const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

async function freePort() {
  const probe = http.createServer();
  const port = await listen(probe);
  await new Promise(resolve => probe.close(resolve));
  return port;
}

async function waitForServer(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error('MSDS test server did not start');
}

test('MSDS AI proxy delegates to the gateway without forwarding browser credentials or model', async () => {
  let forwarded;
  const gateway = http.createServer(async (request, response) => {
    if (request.url === '/api/ai/status') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ configured: true, features: { msds: { configured: true, model: 'google/gemini-3.1-flash-lite' } } }));
      return;
    }
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    forwarded = { path: request.url, body: JSON.parse(Buffer.concat(chunks).toString('utf8')) };
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ model: 'google/gemini-3.1-flash-lite', choices: [{ message: { content: '{"product_name":"테스트"}' } }] }));
  });
  const gatewayPort = await listen(gateway);
  const msdsPort = await freePort();
  const msdsDir = path.resolve(__dirname, '..');
  const child = spawn(process.execPath, ['server.js'], {
    cwd: msdsDir,
    env: { ...process.env, PORT: String(msdsPort), HOST: '127.0.0.1', INTERNAL_API_BASE_URL: `http://127.0.0.1:${gatewayPort}` },
    stdio: 'ignore'
  });
  try {
    await waitForServer(msdsPort);
    const status = await fetch(`http://127.0.0.1:${msdsPort}/api/ai-status`);
    assert.equal(status.status, 200);
    assert.equal((await status.json()).features.msds.configured, true);

    const result = await fetch(`http://127.0.0.1:${msdsPort}/api/proxy-openrouter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: 'browser-secret-must-not-leave',
        model: 'browser-model-must-not-apply',
        messages: [{ role: 'user', content: [{ type: 'text', text: '테스트' }] }],
        response_format: { type: 'json_object' }
      })
    });
    assert.equal(result.status, 200);
    assert.equal((await result.json()).model, 'google/gemini-3.1-flash-lite');
    assert.equal(forwarded.path, '/api/ai/msds');
    assert.equal(forwarded.body.apiKey, undefined);
    assert.equal(forwarded.body.model, undefined);
    assert.equal(forwarded.body.messages[0].content[0].text, '테스트');
    assert.deepEqual(forwarded.body.response_format, { type: 'json_object' });
  } finally {
    child.kill();
    await new Promise(resolve => gateway.close(resolve));
  }
});

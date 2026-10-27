import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPublicStaticPath } from './static-files.mjs';

test('main server serves only the integrated screen and its assets', () => {
  for (const name of [
    'index.html', 'shell/app.html', 'shell/style.css', 'shell/app.js',
    'shell/assets/NotoSansKR-VF.ttf',
    'shell/assets/downloads/safety-health-work-manual-web.pdf',
    'modules/facility/module.js',
  ]) assert.equal(isPublicStaticPath(8080, name), true, name);

  for (const name of [
    '.env.local', '.env.example', 'launcher/api.mjs',
    'runtime/pids/launcher.json', 'runtime/logs/api.log',
    'modules/msds/server.js', 'modules/forms/src/services/storage.js',
    'shell/tests/chat-law-context.test.mjs', 'shell/assets/private.json',
    'shell/../.env.local', 'shell\\app.html', 'shell/.env.local',
    'shell/assets/%2e%2e/.env.local',
  ]) assert.equal(isPublicStaticPath(8080, name), false, name);
});

test('forms server serves only its production build and the bundled manual', () => {
  for (const name of [
    'index.html', 'shield.svg', 'assets/index-DNh8N6CJ.js',
    'assets/index-D5R9QI2B.css', '산업안전보건업무_매뉴얼(웹게시용).pdf',
  ]) assert.equal(isPublicStaticPath(5173, name), true, name);

  for (const name of [
    '.env.local', 'package.json', 'assets/.env.local',
    'assets/private.map', 'assets/../index.html', 'src/App.jsx',
  ]) assert.equal(isPublicStaticPath(5173, name), false, name);
});

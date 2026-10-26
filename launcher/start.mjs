import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const launcherDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(launcherDir, '..');
const runtimeDir = path.join(projectRoot, 'runtime');
const logsDir = path.join(runtimeDir, 'logs');
const pidsDir = path.join(runtimeDir, 'pids');
const pidFile = path.join(pidsDir, 'launcher.json');
const mainUrl = 'http://127.0.0.1:8080/shell/app.html';
const children = [];
const servers = [];

fs.mkdirSync(logsDir, { recursive: true });
fs.mkdirSync(pidsDir, { recursive: true });

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function timestamp() {
  return new Date().toLocaleString('ko-KR');
}

function createStaticServer(root, port, label) {
  const resolvedRoot = path.resolve(root);
  const server = http.createServer((request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Access-Control-Allow-Origin', '*');
    if (request.url === '/__health') {
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify({ ok: true, service: label, time: new Date().toISOString() }));
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    } catch {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('잘못된 요청입니다.');
      return;
    }
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    let target = path.resolve(resolvedRoot, relative);
    if (target !== resolvedRoot && !target.startsWith(resolvedRoot + path.sep)) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('접근할 수 없는 경로입니다.');
      return;
    }
    try {
      if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('파일을 찾을 수 없습니다.');
      return;
    }
    fs.stat(target, (error, stat) => {
      if (error || !stat.isFile()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('파일을 찾을 수 없습니다.');
        return;
      }
      response.writeHead(200, {
        'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': target.endsWith('.html') ? 'no-store' : 'public, max-age=3600',
      });
      fs.createReadStream(target).pipe(response);
    });
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      servers.push(server);
      console.log(`[정상] ${label}: http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

function spawnService(label, command, args, cwd, env = {}) {
  const logPath = path.join(logsDir, `${label}.log`);
  const log = fs.openSync(logPath, 'a');
  fs.writeSync(log, `\n[${timestamp()}] ${label} 시작\n`);
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: ['ignore', log, log],
    windowsHide: true,
  });
  child.on('exit', (code, signal) => {
    fs.writeSync(log, `[${timestamp()}] ${label} 종료 code=${code} signal=${signal}\n`);
    fs.closeSync(log);
  });
  children.push({ label, process: child });
  return child;
}

async function waitFor(url, timeoutMs = 30000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return true;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw lastError || new Error(`${url} 응답 시간 초과`);
}

async function alreadyRunning() {
  try {
    const response = await fetch('http://127.0.0.1:8080/__health', { signal: AbortSignal.timeout(1200) });
    return response.ok;
  } catch {
    return false;
  }
}

async function urlIsReady(url, expectedText = '') {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    if (!response.ok) return false;
    return expectedText ? (await response.text()).includes(expectedText) : true;
  } catch {
    return false;
  }
}

function openBrowser() {
  if (process.env.NO_BROWSER === '1') return;
  const opener = process.platform === 'win32'
    ? spawn('cmd.exe', ['/c', 'start', '', mainUrl], { detached: true, stdio: 'ignore', windowsHide: true })
    : process.platform === 'darwin'
      ? spawn('open', [mainUrl], { detached: true, stdio: 'ignore' })
      : spawn('xdg-open', [mainUrl], { detached: true, stdio: 'ignore' });
  opener.unref();
}

function savePids() {
  fs.writeFileSync(pidFile, JSON.stringify({
    startedAt: new Date().toISOString(),
    launcherPid: process.pid,
    services: Object.fromEntries(children.map(({ label, process: child }) => [label, child.pid])),
  }, null, 2));
}

function stopOwnedProcesses() {
  for (const { process: child } of children) {
    if (!child.killed) {
      try { child.kill(); } catch {}
    }
  }
  for (const server of servers) {
    try { server.close(); } catch {}
  }
  try { fs.rmSync(pidFile, { force: true }); } catch {}
}

process.once('SIGINT', () => { stopOwnedProcesses(); process.exit(0); });
process.once('SIGTERM', () => { stopOwnedProcesses(); process.exit(0); });
process.once('exit', stopOwnedProcesses);

if (await alreadyRunning()) {
  console.log('[안내] 통합 프로그램이 이미 실행 중입니다. 기존 화면을 엽니다.');
  openBrowser();
  process.exit(0);
}

try {
  await createStaticServer(projectRoot, 8080, '통합 메인');
  if (await urlIsReady('http://127.0.0.1:5173/', '산업안전보건 서식 자동화 시스템')) {
    console.log('[안내] 대표서식 서비스가 이미 5173 포트에서 실행 중이므로 기존 서비스를 사용합니다.');
  } else {
    await createStaticServer(path.join(projectRoot, 'modules', 'forms', 'dist'), 5173, '대표서식');
  }

  const msdsDir = path.join(projectRoot, 'modules', 'msds');
  const msds = spawnService('msds', process.execPath, ['server.js'], msdsDir, {
    PORT: '3000', HOST: '127.0.0.1', INTEGRATED_MODE: '1'
  });
  msds.once('error', (error) => console.error('[오류] MSDS 실행 실패:', error.message));

  const chatbotDir = path.join(projectRoot, 'modules', 'chatbot');
  const standaloneDir = path.join(chatbotDir, '.next', 'standalone');
  const chatbotServer = path.join(standaloneDir, 'server.js');
  if (!fs.existsSync(chatbotServer)) {
    throw new Error('챗봇 운영 빌드가 없습니다. README의 재빌드 절차를 실행해 주세요.');
  }
  const chatbot = spawnService('chatbot', process.execPath, ['server.js'], standaloneDir, {
    NODE_ENV: 'production', PORT: '3001', HOSTNAME: '127.0.0.1'
  });
  chatbot.once('error', (error) => console.error('[오류] 챗봇 실행 실패:', error.message));

  savePids();
  const checks = await Promise.allSettled([
    waitFor('http://127.0.0.1:8080/__health'),
    waitFor('http://127.0.0.1:5173/'),
    waitFor('http://127.0.0.1:3000/'),
    waitFor('http://127.0.0.1:3001/chatbot'),
  ]);
  const labels = ['통합 메인', '대표서식', 'MSDS', '챗봇'];
  checks.forEach((result, index) => {
    if (result.status === 'fulfilled') console.log(`[정상] ${labels[index]} 준비 완료`);
    else console.error(`[주의] ${labels[index]} 준비 실패: ${result.reason?.message || result.reason}`);
  });
  console.log(`\n통합 프로그램을 엽니다: ${mainUrl}`);
  console.log('이 창은 프로그램 실행 중 유지해 주세요. 종료는 종료하기.bat를 사용하세요.\n');
  openBrowser();
} catch (error) {
  console.error('\n[실행 실패]', error.message);
  console.error('runtime\\logs 폴더의 로그를 확인해 주세요.');
  stopOwnedProcesses();
  process.exitCode = 1;
}

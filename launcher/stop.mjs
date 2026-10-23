import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const launcherDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(launcherDir, '..');
const pidFile = path.join(projectRoot, 'runtime', 'pids', 'launcher.json');

if (!fs.existsSync(pidFile)) {
  console.log('실행 중인 통합 프로그램 정보가 없습니다.');
  process.exit(0);
}

let state;
try {
  state = JSON.parse(fs.readFileSync(pidFile, 'utf8'));
} catch {
  console.error('PID 정보를 읽지 못했습니다. runtime\\pids\\launcher.json을 확인해 주세요.');
  process.exit(1);
}

const pids = [
  ...Object.values(state.services || {}),
  state.launcherPid,
].filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid);

for (const pid of pids) {
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill.exe', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    } else {
      process.kill(pid, 'SIGTERM');
    }
  } catch {}
}

try { fs.rmSync(pidFile, { force: true }); } catch {}
console.log('통합 프로그램 실행 프로세스를 종료했습니다.');

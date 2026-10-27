import { cpSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(moduleDir, '.next', 'static');
const destination = join(moduleDir, '.next', 'standalone', '.next', 'static');

if (!existsSync(source) || !existsSync(join(moduleDir, '.next', 'standalone', 'server.js'))) {
  throw new Error('Next.js standalone build or static assets are missing. Run npm run build first.');
}

cpSync(source, destination, { recursive: true, force: true });
console.log('Copied chatbot static assets into the standalone build.');

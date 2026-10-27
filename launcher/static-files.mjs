const SHELL_FILES = new Set([
  'app.html',
  'style.css',
  'integration.css',
  'app.js',
  'korean-holidays.js',
  'task-basis-links.js',
  'chat-schedule.js',
  'schedule-ai.js',
  'chat-law-context.js',
  'integration.js',
]);

const SHELL_ASSETS = new Set([
  'work-reference.png',
  'title-logo.png',
  'safety-manual-2025.pdf',
  'pdf-resources.js',
  'ocr-resources.js',
  'NotoSansKR-VF.ttf',
  'home-reference.png',
  'downloads/safety-health-work-manual-web.pdf',
  'downloads/law-obligation-self-check-2025-h2.xlsx',
]);

const FACILITY_FILES = new Set(['index.html', 'assets.js', 'module.js']);
const FORMS_FILES = new Set(['index.html', 'shield.svg', '산업안전보건업무_매뉴얼(웹게시용).pdf']);

export function isPublicStaticPath(port, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || relative.includes('\0')) return false;
  const segments = relative.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..' || segment.startsWith('.') || /[:%\x00-\x1f]/u.test(segment))) return false;

  if (port === 8080) {
    if (relative === 'index.html') return true;
    if (segments[0] === 'shell' && segments.length === 2) return SHELL_FILES.has(segments[1]);
    if (segments[0] === 'shell' && segments[1] === 'assets') return SHELL_ASSETS.has(segments.slice(2).join('/'));
    if (segments[0] === 'modules' && segments[1] === 'facility' && segments.length === 3) return FACILITY_FILES.has(segments[2]);
    return false;
  }

  if (port === 5173) {
    if (FORMS_FILES.has(relative)) return true;
    return segments.length === 2 && segments[0] === 'assets' && /^[A-Za-z0-9_-]+\.(?:js|css|svg|png|woff2?|ttf)$/u.test(segments[1]);
  }

  return false;
}

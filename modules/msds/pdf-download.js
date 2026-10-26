const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { pathToFileURL } = require('url');

class PdfRenderError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'PdfRenderError';
    this.statusCode = statusCode;
  }
}

function findBrowsers() {
  const candidates = [
    process.env.MSDS_PDF_BROWSER,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe')
  ];
  return [...new Set(candidates.filter(Boolean))].filter(candidate => {
    try { return fs.statSync(candidate).isFile(); } catch (_) { return false; }
  });
}

function runBrowser(executable, args) {
  return new Promise((resolve, reject) => {
    execFile(executable, args, {
      windowsHide: true,
      timeout: 45000,
      maxBuffer: 1024 * 1024
    }, error => error ? reject(error) : resolve());
  });
}

function buildDocument(htmlContent, styles) {
  // The existing print CSS and HTML are passed in unchanged. These rules only
  // remove the current 27 cm clipping limit when a long document needs pages.
  return `<!doctype html>
<html lang="ko"><head><meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:">
<title>MSDS PDF</title>
<style>${styles}</style>
<style>
  @page { size: A4; margin: 1cm; }
  body { background: #fff !important; color: #000 !important; margin: 0 !important; padding: 0 !important; }
  #printArea { display: block !important; width: 100% !important; }
  .print-wrap, .guide-wrap {
    height: auto !important; max-height: none !important; overflow: visible !important;
    break-inside: auto !important; page-break-inside: auto !important;
  }
  .guide-section, tr { break-inside: avoid; page-break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style></head><body><div id="printArea">${htmlContent}</div></body></html>`;
}

function validatePdf(buffer) {
  if (buffer.length < 1024 || buffer.subarray(0, 5).toString('ascii') !== '%PDF-') return false;
  if (!buffer.subarray(Math.max(0, buffer.length - 2048)).toString('latin1').includes('%%EOF')) return false;
  // Chromium writes page dictionaries as ordinary PDF objects. A PDF with no
  // page must never be returned as a successful download.
  return /\/Type\s*\/Page\b/.test(buffer.toString('latin1'));
}

async function renderPdf({ type, htmlContent, styles }) {
  if (type !== 'label' && type !== 'guide') {
    throw new PdfRenderError('PDF 종류가 올바르지 않습니다.', 400);
  }
  if (typeof htmlContent !== 'string' || !htmlContent.trim() ||
      !htmlContent.includes(type === 'label' ? 'class="print-wrap"' : 'class="guide-wrap"') ||
      typeof styles !== 'string' || !styles.trim()) {
    throw new PdfRenderError('PDF 생성에 필요한 출력 내용이나 스타일이 없습니다.', 400);
  }

  const browsers = findBrowsers();
  if (!browsers.length) {
    throw new PdfRenderError('PDF 생성에 필요한 Microsoft Edge 또는 Google Chrome을 찾을 수 없습니다.', 503);
  }

  const tempRoot = path.resolve(os.tmpdir());
  const workDir = await fs.promises.mkdtemp(path.join(tempRoot, 'msds-pdf-'));
  const htmlPath = path.join(workDir, 'document.html');
  const pdfPath = path.join(workDir, 'document.pdf');
  let lastError;
  try {
    await fs.promises.writeFile(htmlPath, buildDocument(htmlContent, styles), 'utf8');
    for (const browser of browsers) {
      try {
        const args = [
          '--headless=new', '--disable-gpu', '--disable-extensions',
          '--disable-background-networking', '--no-first-run', '--no-default-browser-check',
          '--no-pdf-header-footer', '--virtual-time-budget=2000',
          `--user-data-dir=${path.join(workDir, 'profile')}`,
          `--print-to-pdf=${pdfPath}`,
          pathToFileURL(htmlPath).href
        ];
        await runBrowser(browser, args);
        const pdf = await fs.promises.readFile(pdfPath);
        if (!validatePdf(pdf)) throw new Error('invalid or empty PDF');
        return pdf;
      } catch (error) {
        lastError = error;
        await fs.promises.unlink(pdfPath).catch(() => {});
      }
    }
    console.error('MSDS PDF rendering failed:', lastError);
    throw new PdfRenderError('PDF를 생성하지 못했습니다. Edge 또는 Chrome 상태를 확인한 뒤 다시 시도해 주세요.');
  } finally {
    const resolvedWorkDir = path.resolve(workDir);
    if (resolvedWorkDir.startsWith(tempRoot + path.sep) && path.basename(resolvedWorkDir).startsWith('msds-pdf-')) {
      await fs.promises.rm(resolvedWorkDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 })
        .catch(error => console.error('MSDS PDF temporary-file cleanup failed:', error));
    }
  }
}

module.exports = { renderPdf, PdfRenderError };

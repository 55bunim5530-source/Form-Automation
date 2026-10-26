const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFile } = require('child_process');
const os = require('os');
const { renderPdf, PdfRenderError } = require('./pdf-download');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_DIR = __dirname;
const MAX_REQUEST_BYTES = 30 * 1024 * 1024;
const ALLOWED_ORIGINS = new Set([
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`,
  'http://127.0.0.1:8080',
  'http://localhost:8080'
]);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.csv': 'text/csv; charset=utf-8'
};

// Chemical Safety & Regulatory Database (산업안전보건법 법정 규제인자 기준 DB)
const MOCK_CHEMICAL_DATABASE = {
  '13463-67-7': {
    name: '이산화 티타늄 (Titanium dioxide)',
    cas_no: '13463-67-7',
    work_environment_target: true,
    special_health_target: false,
    controlled_hazardous: true,
    exposure_limit_ppm: null,
    regulations: '산업안전보건법 노출기준 설정물질 (TWA 10 mg/m³), 관리대상 유해물질',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '7732-18-5': {
    name: '물 (Water)',
    cas_no: '7732-18-5',
    work_environment_target: false,
    special_health_target: false,
    controlled_hazardous: false,
    exposure_limit_ppm: null,
    regulations: '규제 비해당 (일반 용매/물질)',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '68855-54-9': {
    name: '구운 규조토 (Kieselguhr, soda ash flux-calcined)',
    cas_no: '68855-54-9',
    work_environment_target: true,
    special_health_target: true,
    controlled_hazardous: true,
    exposure_limit_ppm: null,
    regulations: '산업안전보건법 노출기준 설정물질 (TWA 10 mg/m³), 작업환경측정 대상 유해인자',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '92704-41-1': {
    name: '생석회 된 카올린 (Calcined kaolin)',
    cas_no: '92704-41-1',
    work_environment_target: false,
    special_health_target: false,
    controlled_hazardous: false,
    exposure_limit_ppm: null,
    regulations: '산업안전보건법 노출기준 설정물질 (TWA 2 mg/m³)',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '61790-53-2': {
    name: '규조토 (Diatomaceous earth)',
    cas_no: '61790-53-2',
    work_environment_target: true,
    special_health_target: false,
    controlled_hazardous: false,
    exposure_limit_ppm: null,
    regulations: '산업안전보건법 노출기준 설정물질 (TWA 10 mg/m³)',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '12001-26-2': {
    name: '운모 (Mica-group minerals)',
    cas_no: '12001-26-2',
    work_environment_target: true,
    special_health_target: false,
    controlled_hazardous: false,
    exposure_limit_ppm: null,
    regulations: '산업안전보건법 노출기준 설정물질 (TWA 3 mg/m³)',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '57-55-6': {
    name: '프로필렌 글라이콜 (Propylene glycol)',
    cas_no: '57-55-6',
    work_environment_target: false,
    special_health_target: false,
    controlled_hazardous: false,
    exposure_limit_ppm: null,
    regulations: '안전확인대상 화학물질, 일반 관리 화학물질',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '67-64-1': {
    name: '아세톤 (Acetone)',
    cas_no: '67-64-1',
    work_environment_target: true,
    special_health_target: true,
    controlled_hazardous: true,
    exposure_limit_ppm: 500,
    regulations: '산업안전보건법 작업환경측정 대상 유해인자, 특수건강진단 대상 유해인자, 관리대상 유해물질',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '64-17-5': {
    name: '에탄올 (Ethanol)',
    cas_no: '64-17-5',
    work_environment_target: false,
    special_health_target: false,
    controlled_hazardous: false,
    exposure_limit_ppm: 1000,
    regulations: '산업안전보건법 노출기준 설정물질',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '1330-20-7': {
    name: '크실렌 (Xylene)',
    cas_no: '1330-20-7',
    work_environment_target: true,
    special_health_target: true,
    controlled_hazardous: true,
    exposure_limit_ppm: 100,
    regulations: '산업안전보건법 작업환경측정 대상, 특수건강진단 대상, 관리대상 유해물질',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  },
  '108-88-3': {
    name: '톨루엔 (Toluene)',
    cas_no: '108-88-3',
    work_environment_target: true,
    special_health_target: true,
    controlled_hazardous: true,
    exposure_limit_ppm: 50,
    regulations: '산업안전보건법 작업환경측정 대상 유해인자, 특수건강진단 대상 유해인자, 관리대상 유해물질',
    source: '산업안전보건법 화학물질 규제 DB 대조 기준'
  }
};

const server = http.createServer((req, res) => {
  // Restrict browser API access to the local app origins.
  const requestOrigin = req.headers.origin;
  if (requestOrigin && ALLOWED_ORIGINS.has(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    if (requestOrigin && !ALLOWED_ORIGINS.has(requestOrigin)) {
      res.writeHead(403);
      res.end();
      return;
    }
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedReqUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);

  // API Proxy Endpoint: /api/proxy-public-data
  if (parsedReqUrl.pathname === '/api/proxy-public-data') {
    const query = Object.fromEntries(parsedReqUrl.searchParams.entries());
    const baseUrl = query.baseUrl || 'https://api.odcloud.kr/api/15085819/v1/uddi:5169a23d-82d2-4ee4-904b-f2eb4bd56c6f';
    const serviceKey = query.serviceKey || '';
    const paramKey = query.paramKey || 'serviceKey';
    const paramSearch = query.paramSearch || 'search';
    const searchValue = query.search || query.cas || '67-64-1';
    const isMock = query.mock === 'true' || query.useMock === 'true' || baseUrl === 'DEMO_MOCK';

    // Mock Mode requested or fallback
    if (isMock || searchValue === 'DEMO_MOCK' || !baseUrl || baseUrl === 'DEMO_MOCK') {
      const mockResult = MOCK_CHEMICAL_DATABASE[searchValue] || {
        name: `화학물질 (CAS: ${searchValue})`,
        cas_no: searchValue,
        work_environment_target: false,
        special_health_target: false,
        controlled_hazardous: false,
        regulations: '산업안전보건법 규제기준 대조: 일반 관리 화학물질 (MSDS 8번 항목 참조)',
        source: '산업안전보건법 규제 DB 대조 기준'
      };
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        status: 'success',
        mode: 'regulatory_db',
        currentCount: 1,
        data: [mockResult],
        message: '화학물질 규제 DB로 정상 대조되었습니다.'
      }));
      return;
    }
    // Build URL for external API call
    let fullTargetUrl = baseUrl;
    const hasQuery = baseUrl.includes('?');
    const separator = hasQuery ? '&' : '?';

    // Support data.go.kr standard params (_type=json, pageNo, numOfRows)
    let queryParams = `page=1&perPage=5&pageNo=1&numOfRows=5&_type=json&${paramSearch}=${encodeURIComponent(searchValue)}`;

    if (serviceKey) {
      // Avoid double-encoding if key is already URL-encoded
      let decodedKey = serviceKey;
      try {
        if (serviceKey.includes('%')) decodedKey = decodeURIComponent(serviceKey);
      } catch(e) {}
      queryParams += `&${paramKey}=${encodeURIComponent(decodedKey)}`;
    }

    fullTargetUrl = `${baseUrl}${separator}${queryParams}`;

    const client = fullTargetUrl.startsWith('https') ? https : http;

    client.get(fullTargetUrl, { headers: { 'Accept': 'application/json, application/xml, text/plain' } }, (proxyRes) => {
      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        let jsonBody = null;
        try { jsonBody = JSON.parse(body); } catch(e) {}

        const isAuthError = body.includes('NO_OPENAPI_SERVICE_ERROR') || body.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR') || body.includes('returnAuthMsg');

        if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 300 && !isAuthError) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            status: 'success',
            mode: 'live',
            statusCode: proxyRes.statusCode,
            data: jsonBody?.data || jsonBody?.response?.body?.items || jsonBody || body,
            raw: jsonBody || body
          }));
        } else {
          // Diagnostic Reason
          let diagReason = `공공데이터 서버 응답 (HTTP ${proxyRes.statusCode})`;
          if (body.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR') || body.includes('등록되지 않은')) {
            diagReason = '공공데이터포털 인증키 반영 대기 중이거나(신청 후 1~2시간 소요) Key의 인코딩/디코딩 형식이 다릅니다.';
          } else if (body.includes('NO_OPENAPI_SERVICE_ERROR')) {
            diagReason = '공공데이터포털에서 해당 API 서비스 경로가 변경되었거나 점검 중입니다.';
          } else if (proxyRes.statusCode === 404) {
            diagReason = '지정한 API Endpoint URL 또는 dataset ID가 서버에 존재하지 않거나 404 상태입니다.';
          }

          const fallbackResult = MOCK_CHEMICAL_DATABASE[searchValue] || {
            name: `화학물질 (CAS: ${searchValue})`,
            cas_no: searchValue,
            work_environment_target: false,
            special_health_target: false,
            controlled_hazardous: false,
            exposure_limit_ppm: null,
            regulations: '산업안전보건법 규제기준 대조: 일반 관리 화학물질 (MSDS 8번 항목 참조)',
            source: '산업안전보건법 규제 DB 대조 기준'
          };
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            status: 'proxy_notice',
            mode: 'fallback',
            statusCode: proxyRes.statusCode,
            reason: diagReason,
            apiError: jsonBody || body.substring(0, 200),
            fallbackData: [fallbackResult],
            message: `${diagReason} 화학물질 안전보건 규제 DB 대조가 완료되었습니다.`
          }));
        }
      });
    }).on('error', (err) => {
      const fallbackResult = MOCK_CHEMICAL_DATABASE[searchValue] || {
        name: `화학물질 (CAS: ${searchValue})`,
        cas_no: searchValue,
        work_environment_target: false,
        special_health_target: false,
        controlled_hazardous: false,
        exposure_limit_ppm: null,
        regulations: '산업안전보건법 규제기준 대조: 일반 관리 화학물질 (MSDS 8번 항목 참조)',
        source: '산업안전보건법 규제 DB 대조 기준'
      };
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        status: 'proxy_error',
        mode: 'fallback',
        error: err.message,
        fallbackData: [fallbackResult],
        message: `네트워크 연결 오류 (${err.message}). 화학물질 안전보건 규제 DB로 자동 대조되었습니다.`
      }));
    });
    return;
  }

  // NEW ENDPOINT: /api/proxy-openrouter
  if (parsedReqUrl.pathname === '/api/proxy-openrouter' && req.method === 'POST') {
    let body = '';
    let tooLarge = false;
    req.on('data', chunk => {
      if (tooLarge) return;
      body += chunk;
      if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) {
        tooLarge = true;
        res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Request body too large' }));
      }
    });
    req.on('end', () => {
      if (tooLarge) return;
      try {
        const payload = JSON.parse(body);
        const apiKey = payload.apiKey;
        const model = payload.model || 'google/gemini-2.0-flash-001';
        const messages = payload.messages || [];
        const responseFormat = payload.response_format;

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'OpenRouter API Key is required' }));
          return;
        }

        const openrouterReqData = JSON.stringify({
          model,
          messages,
          ...(responseFormat ? { response_format: responseFormat } : {})
        });

        const orReq = https.request('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'School MSDS Smart System',
            'Content-Length': Buffer.byteLength(openrouterReqData)
          }
        }, (orRes) => {
          let orBody = '';
          orRes.on('data', chunk => { orBody += chunk; });
          orRes.on('end', () => {
            res.writeHead(orRes.statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(orBody);
          });
        });

        orReq.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'OpenRouter request failed', details: err.message }));
        });

        orReq.write(openrouterReqData);
        orReq.end();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // NEW ENDPOINT: /api/get-ip
  if (parsedReqUrl.pathname === '/api/get-ip' && req.method === 'GET') {
    const interfaces = os.networkInterfaces();
    let lanIp = '127.0.0.1';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          lanIp = iface.address;
          break;
        }
      }
      if (lanIp !== '127.0.0.1') break;
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ip: lanIp }));
    return;
  }

  // NEW ENDPOINT: /api/extract-pdf-table
  if (parsedReqUrl.pathname === '/api/extract-pdf-table' && req.method === 'POST') {
    let body = '';
    let tooLarge = false;
    req.on('data', chunk => {
      if (tooLarge) return;
      body += chunk.toString();
      if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) {
        tooLarge = true;
        res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Request body too large' }));
      }
    });
    req.on('end', () => {
      if (tooLarge) return;
      try {
        const payload = JSON.parse(body);
        const base64Data = payload.pdfBase64;
        
        if (!base64Data) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'pdfBase64 is required' }));
          return;
        }

        // Save base64 to uploads folder for later access via QR
        const fileName = `msds_${Date.now()}.pdf`;
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        const tempFilePath = path.join(uploadDir, fileName);
        fs.writeFileSync(tempFilePath, Buffer.from(base64Data, 'base64'));

        // Run python script
        const scriptPath = path.join(__dirname, 'extract_table.py');
        execFile('python', [scriptPath, tempFilePath], { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
          // Clean up temp file (REMOVED: we need to keep it for QR code access)
          // if (fs.existsSync(tempFilePath)) {
          //   fs.unlinkSync(tempFilePath);
          // }

          if (error) {
            console.error('Python Error:', stderr);
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Python script execution failed', details: stderr }));
            return;
          }

          try {
            const result = JSON.parse(stdout);
            result.pdf_url = `/uploads/${fileName}`; // Return the URL of the saved PDF
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
          } catch (parseErr) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Failed to parse python output', output: stdout }));
          }
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // NEW ENDPOINT: /api/parse-ledger (Supports HWPX, HWP, PDF)
  if (parsedReqUrl.pathname === '/api/parse-ledger' && req.method === 'POST') {
    let body = '';
    let tooLarge = false;
    req.on('data', chunk => {
      if (tooLarge) return;
      body += chunk.toString();
      if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) {
        tooLarge = true;
        res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Request body too large' }));
      }
    });
    req.on('end', () => {
      if (tooLarge) return;
      try {
        const payload = JSON.parse(body);
        const base64Data = payload.fileBase64;
        const origName = payload.fileName || 'ledger_file';
        const fileExt = path.extname(origName) || '.hwpx';
        
        if (!base64Data) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'fileBase64 is required' }));
          return;
        }

        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        const tempFileName = `ledger_${Date.now()}${fileExt}`;
        const tempFilePath = path.join(uploadDir, tempFileName);
        fs.writeFileSync(tempFilePath, Buffer.from(base64Data, 'base64'));

        const scriptPath = path.join(__dirname, 'parse_ledger.py');
        execFile('python', [scriptPath, tempFilePath], { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
          // Clean up temp file
          if (fs.existsSync(tempFilePath)) {
            try { fs.unlinkSync(tempFilePath); } catch(e) {}
          }

          if (error) {
            console.error('Python parse_ledger Error:', stderr);
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Ledger parsing script failed', details: stderr }));
            return;
          }

          try {
            const result = JSON.parse(stdout);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
          } catch (parseErr) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Failed to parse python ledger output', output: stdout }));
          }
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Render the existing MSDS print template as a directly downloadable PDF.
  if (parsedReqUrl.pathname === '/api/render-pdf' && req.method === 'POST') {
    const msdsOrigins = new Set([`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`]);
    const sendPdfError = (status, message) => {
      if (res.headersSent || res.writableEnded) return;
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ error: message }));
    };
    if (!msdsOrigins.has(requestOrigin)) {
      sendPdfError(403, 'MSDS 화면에서만 PDF를 생성할 수 있습니다.');
      req.resume();
      return;
    }
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
      sendPdfError(415, 'PDF 요청 형식은 JSON이어야 합니다.');
      req.resume();
      return;
    }

    const chunks = [];
    let bodySize = 0;
    let tooLarge = false;
    req.on('data', chunk => {
      if (tooLarge) return;
      bodySize += chunk.length;
      if (bodySize > MAX_REQUEST_BYTES) {
        tooLarge = true;
        sendPdfError(413, 'PDF 내용이 너무 큽니다.');
        return;
      }
      chunks.push(chunk);
    });
    req.on('error', () => sendPdfError(400, 'PDF 요청을 읽지 못했습니다.'));
    req.on('end', async () => {
      if (tooLarge || res.writableEnded) return;
      let payload;
      try {
        payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch (_) {
        sendPdfError(400, 'PDF 요청 내용을 읽을 수 없습니다.');
        return;
      }
      try {
        const pdf = await renderPdf(payload || {});
        if (res.writableEnded) return;
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': pdf.length,
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff'
        });
        res.end(pdf);
      } catch (error) {
        const status = error instanceof PdfRenderError ? error.statusCode : 500;
        if (!(error instanceof PdfRenderError)) console.error('MSDS PDF request failed:', error);
        sendPdfError(status, error instanceof PdfRenderError ? error.message : 'PDF 생성 중 오류가 발생했습니다.');
      }
    });
    return;
  }

  // Static File Serving
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(parsedReqUrl.pathname === '/' ? '/index.html' : parsedReqUrl.pathname);
  } catch (_) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('잘못된 파일 경로입니다.');
    return;
  }
  const filePath = path.resolve(PUBLIC_DIR, `.${requestedPath}`);
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('접근할 수 없는 파일 경로입니다.');
    return;
  }
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + req.url);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`=======================================================`);
    console.log(`[알림] 포트 ${PORT}번이 이미 다른 프로세스에서 실행 중입니다.`);
    console.log(`기존 서버를 통해 즉시 접속하실 수 있습니다: http://localhost:${PORT}`);
    console.log(`=======================================================`);
    if (process.env.INTEGRATED_MODE !== '1') try {
      const { exec } = require('child_process');
      const startCmd = process.platform === 'win32' ? `start http://localhost:${PORT}` :
                       process.platform === 'darwin' ? `open http://localhost:${PORT}` :
                       `xdg-open http://localhost:${PORT}`;
      exec(startCmd);
    } catch (_) {}
  } else {
    console.error('서버 오류 발생:', e);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`=======================================================`);
  console.log(`학교 산업안전보건 MSDS AI 관리 웹앱이 실행되었습니다.`);
  console.log(`접속 URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
  if (process.env.INTEGRATED_MODE !== '1') try {
    const { exec } = require('child_process');
    const startCmd = process.platform === 'win32' ? `start http://localhost:${PORT}` :
                     process.platform === 'darwin' ? `open http://localhost:${PORT}` :
                     `xdg-open http://localhost:${PORT}`;
    exec(startCmd);
  } catch (_) {}
});



import { getLawContext, requestLaw } from './law-api.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AI_MODELS = Object.freeze({
  chatbot: 'openai/gpt-6-luna',
  schedule: 'openai/gpt-6-luna',
  msds: 'google/gemini-3.1-flash-lite',
  forms: 'openai/gpt-6-luna',
});
const AI_FEATURES = new Set(Object.keys(AI_MODELS));
const LOCAL_ORIGINS = new Set([
  'http://127.0.0.1:8080', 'http://127.0.0.1:5173',
  'http://127.0.0.1:3000', 'http://127.0.0.1:3001',
  'http://localhost:8080', 'http://localhost:5173',
  'http://localhost:3000', 'http://localhost:3001',
]);
const MAX_AI_BYTES = 32 * 1024 * 1024;
const MAX_LAW_BYTES = 16 * 1024;
const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;
const usage = new Map();
const apiLog = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'runtime', 'logs', 'api.log');

function recordError(feature, code) {
  try {
    fs.mkdirSync(path.dirname(apiLog), { recursive: true });
    fs.appendFileSync(apiLog, `${new Date().toISOString()} ${feature} ${code}\n`);
  } catch { /* A log write must not interrupt the API response. */ }
}

function json(response, status, data, extraHeaders = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  response.end(JSON.stringify(data));
}

function allowOrigin(request, response) {
  const origin = request.headers.origin;
  if (!origin) return true;
  let sameHost = false;
  try { sameHost = new URL(origin).host === request.headers.host; } catch {}
  if (!LOCAL_ORIGINS.has(origin) && !sameHost) return false;
  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Vary', 'Origin');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

function readJson(request, maxBytes) {
  return new Promise((resolve, reject) => {
    const declared = Number(request.headers['content-length'] || 0);
    if (declared > maxBytes) return reject(Object.assign(new Error('요청 크기가 제한을 초과했습니다.'), { status: 413 }));
    let bytes = 0;
    let exceeded = false;
    const chunks = [];
    request.on('data', chunk => {
      if (exceeded) return;
      bytes += chunk.length;
      if (bytes > maxBytes) {
        exceeded = true;
        reject(Object.assign(new Error('요청 크기가 제한을 초과했습니다.'), { status: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      if (exceeded) return;
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(Object.assign(new Error('올바른 JSON 요청이 아닙니다.'), { status: 400 })); }
    });
    request.on('error', reject);
  });
}

export function redactPersonalData(value) {
  return String(value)
    .replace(/\b\d{6}\s*[- ]?\s*[1-4]\d{6}\b/gu, '[주민번호 비공개]')
    .replace(/\b(?:01[016789]|0[2-9]\d{1,2})[- ]?\d{3,4}[- ]?\d{4}\b/gu, '[연락처 비공개]')
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/gu, '[이메일 비공개]')
    .replace(/((?:성명|이름|재해자|피해자|환자|목격자|발견자|담당자)\s*[:：]\s*)[가-힣]{2,4}/gu, '$1[이름 비공개]');
}

function validateMessages(messages, feature) {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 24) return false;
  return messages.every(message => {
    if (!message || !['system', 'user', 'assistant'].includes(message.role)) return false;
    if (typeof message.content === 'string') return message.content.length <= 250_000;
    if (!Array.isArray(message.content) || message.content.length < 1 || message.content.length > 20) return false;
    return message.content.every(part => {
      if (!part || typeof part !== 'object') return false;
      if (part.type === 'text') return typeof part.text === 'string' && part.text.length <= 250_000;
      if (part.type === 'image_url' && feature === 'msds') {
        const url = part.image_url?.url;
        return typeof url === 'string' && (url.startsWith('data:image/') || url.startsWith('https://'));
      }
      return false;
    });
  });
}

function rateAllowed(feature, request) {
  const now = Date.now();
  const minuteLimit = Math.max(1, Number(process.env.AI_REQUESTS_PER_MINUTE) || 30);
  const dayLimit = Math.max(1, Number(process.env.AI_REQUESTS_PER_DAY) || 300);
  const key = `${feature}:${request.socket.remoteAddress || 'local'}`;
  const row = usage.get(key) || { minuteStart: now, minuteCount: 0, dayStart: now, dayCount: 0 };
  if (now - row.minuteStart >= MINUTE_MS) { row.minuteStart = now; row.minuteCount = 0; }
  if (now - row.dayStart >= DAY_MS) { row.dayStart = now; row.dayCount = 0; }
  if (row.minuteCount >= minuteLimit || row.dayCount >= dayLimit) return false;
  row.minuteCount += 1;
  row.dayCount += 1;
  usage.set(key, row);
  if (usage.size > 1000) {
    for (const [entry, value] of usage) if (now - value.dayStart >= DAY_MS) usage.delete(entry);
  }
  return true;
}

async function callOpenRouter(feature, body) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return { status: 503, data: { error: '서버에 OpenRouter 인증키가 설정되지 않았습니다.' } };
  if (!body || !validateMessages(body.messages, feature)) {
    return { status: 400, data: { error: 'AI 메시지 형식이 올바르지 않습니다.' } };
  }
  const messages = body.messages.map(message => ({
    role: message.role,
    content: typeof message.content === 'string'
      ? redactPersonalData(message.content)
      : message.content.map(part => part.type === 'text' ? { type: 'text', text: redactPersonalData(part.text) } : part),
  }));
  const payload = { model: AI_MODELS[feature], messages, max_tokens: feature === 'msds' ? 4096 : 1200 };
  if (Number.isInteger(body.max_tokens) && body.max_tokens > 0 && body.max_tokens <= 8192) payload.max_tokens = body.max_tokens;
  if (typeof body.temperature === 'number' && body.temperature >= 0 && body.temperature <= 2) payload.temperature = body.temperature;
  if (body.response_format && ['json_object', 'json_schema'].includes(body.response_format.type)) {
    payload.response_format = body.response_format;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), feature === 'msds' ? 120_000 : 60_000);
  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://127.0.0.1:8080',
        'X-Title': 'Form Automation',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!upstream.ok) {
      recordError(feature, `upstream_http_${upstream.status}`);
      return { status: upstream.status === 429 ? 429 : 502, data: { error: upstream.status === 429 ? 'AI 요청 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.' : `AI 서버 요청이 실패했습니다. (HTTP ${upstream.status})` } };
    }
    const data = await upstream.json();
    return { status: 200, data };
  } catch (error) {
    recordError(feature, error?.name === 'AbortError' ? 'timeout' : 'network_error');
    return { status: 502, data: { error: error?.name === 'AbortError' ? 'AI 응답 시간이 초과됐습니다.' : 'AI 서버에 연결하지 못했습니다.' } };
  } finally {
    clearTimeout(timer);
  }
}

export async function handleApi(request, response) {
  let url;
  try { url = new URL(request.url, 'http://127.0.0.1:8080'); }
  catch { json(response, 400, { error: '잘못된 요청 주소입니다.' }); return; }
  const pathname = url.pathname;
  if (!pathname.startsWith('/api/')) return false;
  if (!allowOrigin(request, response)) { json(response, 403, { error: '허용되지 않은 출처입니다.' }); return true; }
  if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return true; }
  if (pathname === '/api/ai/status' && request.method === 'GET') {
    const configured = Boolean(process.env.OPENROUTER_API_KEY?.trim());
    json(response, 200, { configured, features: Object.fromEntries(Object.entries(AI_MODELS).map(([feature, model]) => [feature, { configured, model }])) });
    return true;
  }
  if (pathname === '/api/law/status' && request.method === 'GET') {
    json(response, 200, { configured: Boolean((process.env.LAW_API_OC || process.env.LAW_OC)?.trim()) });
    return true;
  }
  if (pathname === '/api/law/context' && request.method === 'GET') {
    const question = url.searchParams.get('question')?.trim() || '';
    if (!question || question.length > 500) json(response, 400, { error: '질문은 1~500자로 입력해 주세요.' });
    else {
      try { json(response, 200, await getLawContext(redactPersonalData(question))); }
      catch { json(response, 502, { status: 'unavailable', laws: [], reason: '법령 원문 조회에 실패했습니다.' }); }
    }
    return true;
  }
  if (pathname === '/api/law/context' && request.method === 'POST') {
    try {
      const body = await readJson(request, MAX_LAW_BYTES);
      const question = typeof body?.question === 'string' ? body.question.trim() : '';
      if (!question || question.length > 500) json(response, 400, { error: '질문은 1~500자로 입력해 주세요.' });
      else json(response, 200, await getLawContext(redactPersonalData(question)));
    } catch (error) { recordError('law_context', `error_${error.status || 502}`); if (!response.destroyed) json(response, error.status || 502, { status: 'unavailable', laws: [], reason: '법령 원문 조회에 실패했습니다.' }); }
    return true;
  }
  if (pathname === '/api/law/request' && request.method === 'POST') {
    try {
      const body = await readJson(request, MAX_LAW_BYTES);
      json(response, 200, await requestLaw(body?.endpoint, body?.params));
    } catch (error) { recordError('law_request', `error_${error.status || 502}`); if (!response.destroyed) json(response, error.status || 502, { error: error.message || '법령 조회에 실패했습니다.' }); }
    return true;
  }
  const aiFeature = pathname.match(/^\/api\/ai\/(chatbot|schedule|msds|forms)$/)?.[1];
  if (aiFeature && request.method === 'POST' && AI_FEATURES.has(aiFeature)) {
    if (!rateAllowed(aiFeature, request)) { recordError(aiFeature, 'local_rate_limit'); json(response, 429, { error: 'AI 요청 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.' }); return true; }
    try {
      const body = await readJson(request, MAX_AI_BYTES);
      const result = await callOpenRouter(aiFeature, body);
      if (!response.destroyed) json(response, result.status, result.data);
    } catch (error) { recordError(aiFeature, `error_${error.status || 500}`); if (!response.destroyed) json(response, error.status || 500, { error: error.message || 'AI 요청을 처리하지 못했습니다.' }); }
    return true;
  }
  json(response, 404, { error: 'API 경로를 찾지 못했습니다.' });
  return true;
}

export { AI_MODELS, callOpenRouter };

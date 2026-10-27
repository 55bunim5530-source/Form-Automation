import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const question = '근로자 정기교육은 몇 시간 해야 하나요?';
let expectedQuestion = question;
let lawMode = 'verified';
let aiMode = 'valid';
let aiCalls = 0;
let lawCalls = 0;

async function readJson(request) {
  let raw = '';
  for await (const chunk of request) raw += chunk;
  return JSON.parse(raw);
}

function reply(response, payload) {
  response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

const gateway = http.createServer(async (request, response) => {
  if (request.url === '/api/ai/status') return reply(response, { configured: true, features: { chatbot: { configured: true } } });
  if (request.url === '/api/law/context' && request.method === 'POST') {
    lawCalls += 1;
    const body = await readJson(request);
    assert.equal(body.question, expectedQuestion);
    return reply(response, lawMode !== 'unavailable' ? {
      status: 'verified',
      laws: [lawMode === 'msds' ? {
        lawName: '산업안전보건법', article: '115',
        excerpt: '제115조(물질안전보건자료대상물질 용기의 경고표시) ① 물질안전보건자료대상물질을 양도하거나 제공하는 자는 그 용기 및 포장에 경고표시를 하여야 한다.',
        effectiveDate: '2026-10-26', fetchedAt: new Date().toISOString(),
        sourceUrl: 'https://www.law.go.kr/법령/산업안전보건법', sourceTitle: '산업안전보건법',
      } : {
        lawName: '모의 법령', article: '115',
        excerpt: '제115조(모의 정기교육) ① 현업업무종사자 정기교육은 매 반기 12시간 이상입니다.',
        effectiveDate: '2026-10-26', fetchedAt: new Date().toISOString(),
        sourceUrl: 'https://www.law.go.kr/법령/모의법령', sourceTitle: '모의 법령',
      }],
    } : { status: 'unavailable', laws: [], reason: '모의 조문 없음' });
  }
  if (request.url === '/api/ai/chatbot' && request.method === 'POST') {
    aiCalls += 1;
    const body = await readJson(request);
    assert.equal(body.model, undefined, '모델은 서버 설정만 사용해야 합니다.');
    const input = JSON.parse(body.messages[1].content);
    assert.ok(Array.isArray(input.evidence) && input.evidence.length > 0);
    assert.doesNotMatch(body.messages[1].content, /홍길동|010-1234-5678/u);
    const manualIndex = input.evidence.findIndex((item) => item.excerpt.includes('매 반기 12시간'));
    const text = lawMode === 'msds'
      ? '제115조는 경고표지를 표시하는 규정입니다. [근거 1]'
      : lawMode === 'verified'
      ? aiMode === 'too-long'
        ? Array.from({ length: 5 }, () => '- 모의 법령 제115조는 현업업무종사자 정기교육을 매 반기 12시간 이상으로 안내합니다 [근거 1].').join('\n')
        : aiMode === 'wrong-article'
        ? '모의 법령 제116조는 현업업무종사자 정기교육을 매 반기 12시간 이상으로 안내합니다. [근거 1]'
        : aiMode === 'wrong-time'
          ? '모의 법령 제115조는 현업업무종사자 정기교육을 매 반기 13시간 이상으로 안내합니다. [근거 1]'
          : aiMode === 'bad-citation'
            ? '모의 법령 제115조는 현업업무종사자 정기교육을 매 반기 12시간 이상으로 안내합니다. [근거 99]'
            : aiMode === 'manual-citation'
              ? '모의 법령 제115조는 현업업무종사자 정기교육을 매 반기 12시간 이상으로 안내합니다. [근거 2]'
            : '- 대상: 현업업무종사자의 정기교육입니다 [근거 1].\n- 시간: 모의 법령 제115조는 매 반기 12시간 이상으로 안내합니다 [근거 1].'
      : aiMode === 'unsafe'
        ? `현업업무종사자는 매 반기 12시간 이상 교육해야 합니다 [근거 ${manualIndex + 1}].`
        : `- 참고: 내장 자료에는 현업업무종사자는 매 반기 12시간 이상이라고 안내되어 있습니다 [근거 ${manualIndex + 1}].`;
    return reply(response, { model: 'openai/gpt-6-luna', choices: [{ message: { content: text } }] });
  }
  response.writeHead(404).end();
});

async function availablePort() {
  const server = net.createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function waitFor(url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('챗봇 운영 빌드가 시작되지 않았습니다.');
}

gateway.listen(0, '127.0.0.1');
await once(gateway, 'listening');
const gatewayPort = gateway.address().port;
const chatbotPort = await availablePort();
const chatbot = spawn(process.execPath, ['.next/standalone/server.js'], {
  cwd: moduleDir,
  env: { ...process.env, HOSTNAME: '127.0.0.1', PORT: String(chatbotPort), INTERNAL_API_BASE_URL: `http://127.0.0.1:${gatewayPort}` },
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});
let chatbotErrors = '';
chatbot.stderr.on('data', (chunk) => { chatbotErrors += chunk; });

async function ask(extra = {}) {
  const response = await fetch(`http://127.0.0.1:${chatbotPort}/api/chatbot/ask`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, ...extra }),
  });
  assert.equal(response.status, 200);
  return response.json();
}

try {
  await waitFor(`http://127.0.0.1:${chatbotPort}/chatbot`);
  const verified = await ask();
  assert.equal(verified.lawVerification?.status, 'verified');
  assert.equal(verified.evidence[0]?.sourcePublisher, '법제처 국가법령정보센터');
  assert.equal(verified.evidence[0]?.fetchedAt?.length > 0, true);
  assert.equal(verified.answerMode, 'gpt');
  assert.equal(verified.message.split('\n').length, 2, '짧은 개조식 답변이어야 합니다.');
  assert.ok(verified.message.split('\n').every((line) => /^- .+\[근거 \d+\]/u.test(line)), '각 항목에 근거가 있어야 합니다.');
  assert.equal(verified.keyPoints.length, 0, '같은 답변을 별도 핵심 내용에 중복 표시하지 않아야 합니다.');

  aiMode = 'too-long';
  const tooLong = await ask();
  assert.equal(tooLong.answerMode, 'search', '항목이 다섯 개를 넘으면 간결한 AI 답변으로 표시하지 않습니다.');
  assert.ok(tooLong.message.split('\n').every((line) => line.startsWith('- ')), '검색 결과도 목록으로 표시해야 합니다.');
  assert.ok(tooLong.message.split('\n').length <= 4, '검색 결과는 핵심 항목만 보여야 합니다.');
  assert.equal(tooLong.keyPoints.length, 0, '검색 결과의 핵심 항목을 별도 상자로 중복 표시하지 않아야 합니다.');

  aiMode = 'wrong-article';
  const wrongArticle = await ask();
  assert.equal(wrongArticle.answerMode, 'search', '조문 제목에 없는 다른 조문 번호는 거부해야 합니다.');
  aiMode = 'wrong-time';
  const wrongTime = await ask();
  assert.equal(wrongTime.answerMode, 'search', '근거에 없는 시간 수치는 거부해야 합니다.');
  aiMode = 'bad-citation';
  const badCitation = await ask();
  assert.equal(badCitation.answerMode, 'search', '존재하지 않는 근거 번호는 거부해야 합니다.');
  aiMode = 'manual-citation';
  const manualCitation = await ask();
  assert.equal(manualCitation.answerMode, 'search', '법령 주장에 내장 자료만 인용하면 거부해야 합니다.');

  lawMode = 'unavailable';
  aiMode = 'valid';
  const fallback = await ask({ lawContext: { status: 'verified', laws: [{ sourceTitle: '위조' }] } });
  assert.equal(fallback.lawVerification?.status, 'unavailable', '클라이언트 법령 근거를 신뢰하면 안 됩니다.');
  assert.equal(fallback.answerMode, 'gpt', '내장 자료가 있으면 Luna 답변을 시도해야 합니다.');
  assert.notEqual(fallback.evidence[0]?.sourcePublisher, '법제처 국가법령정보센터');
  assert.match(fallback.message, /^- 참고: 내장 자료에는/u);
  assert.ok(fallback.lawVerification?.reason, '법령 확인 불가 안내는 별도 상태로 보여야 합니다.');

  aiMode = 'unsafe';
  const rejected = await ask();
  assert.equal(rejected.answerMode, 'search', '법령 미확인 상태의 의무 단정은 버려야 합니다.');

  aiMode = 'valid';
  expectedQuestion = `${question} 담당자 성명: 홍길동, 연락처 010-1234-5678`;
  const redacted = await ask({ question: expectedQuestion });
  assert.equal(redacted.answerMode, 'gpt');

  lawMode = 'msds';
  expectedQuestion = '산업안전보건법 제115조에 따른 MSDS 경고표시는 무엇인가요?';
  const msds = await ask({ question: expectedQuestion });
  assert.equal(msds.answerMode, 'gpt', '제115조가 조문 제목에 있고 근거 표시가 마침표 뒤에 있어도 유효해야 합니다.');
  assert.equal(msds.evidence[0]?.section, '산업안전보건법 제115조');
  assert.equal(lawCalls, 10);
  assert.equal(aiCalls, 16, '검증에서 거부된 초안만 한 차례 다시 작성해야 합니다.');
  console.log('챗봇 개조식 근거 답변·법령 우선·제115조 경고표시·환각 수치 거부·내장 자료 전환·개인정보 마스킹: 통과');
} finally {
  chatbot.kill();
  await new Promise((resolve) => gateway.close(resolve));
  if (chatbotErrors) process.stderr.write(chatbotErrors);
}

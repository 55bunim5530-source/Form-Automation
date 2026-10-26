import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../chat-law-context.js', import.meta.url), 'utf8');

function boot(overrides = {}) {
  const master = {
    taskCode: 'RSK-001',
    taskName: '정기 위험성평가 실시',
    sourceArticle: '산업안전보건법 제36조',
    legalReferences: [],
  };
  const law = {
    connectionInfo: () => ({ configured: true, online: true }),
    derive: () => [{ kind: 'law', lawName: '산업안전보건법', article: '36', branch: '' }],
    search: async () => [{ lawName: '산업안전보건법', lawId: '123', effectiveDate: '20260101' }],
    body: async () => ({ text: '제36조 위험성평가 원문', fetchedAt: new Date().toISOString(), effectiveDate: '20260101' }),
    originalLink: () => 'https://www.law.go.kr/법령/산업안전보건법/제36조',
    ...overrides,
  };
  const window = { safetyLaw: law };
  runInNewContext(source, { window, app: { data: { taskMaster: [master] } }, Date });
  return { adapter: window.safetyChatLawContext, master, law };
}

test('fresh official API article and existing master produce verified context without mutating data', async () => {
  const { adapter, master } = boot();
  const original = JSON.stringify(master);
  const result = await adapter.lookup('위험성평가 의무를 확인해 주세요');
  assert.equal(result.status, 'verified');
  assert.equal(result.laws.length, 1);
  assert.match(result.laws[0].excerpt, /제36조/);
  assert.match(result.laws[0].sourceUrl, /^https:\/\/www\.law\.go\.kr\//);
  assert.equal(JSON.stringify(master), original);
});

test('missing API credential, failed lookup, and future effective text never count as verified', async () => {
  assert.equal((await boot({ connectionInfo: () => ({ configured: false, online: true }) }).adapter.lookup('위험성평가')).status, 'unavailable');
  assert.equal((await boot({ search: async () => { throw new Error('API 실패'); } }).adapter.lookup('위험성평가')).status, 'unavailable');
  assert.equal((await boot({ body: async () => ({ text: '원문', fetchedAt: new Date().toISOString(), effectiveDate: '20990101' }) }).adapter.lookup('위험성평가')).status, 'unavailable');
});

test('unmapped question does not create an unrelated legal citation', async () => {
  const result = await boot().adapter.lookup('학교 급식은 무엇인가요?');
  assert.equal(result.status, 'unavailable');
  assert.equal(result.laws.length, 0);
});

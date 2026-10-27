import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../chat-law-context.js', import.meta.url), 'utf8');

test('chat bridge leaves official-law retrieval to the chatbot server', async () => {
  let lawClientCalls = 0;
  const window = { safetyLaw: { search() { lawClientCalls++; }, body() { lawClientCalls++; } } };
  runInNewContext(source, { window });
  const result = await window.safetyChatLawContext.lookup('위험성평가 의무를 확인해 주세요');
  assert.equal(result.status, 'unavailable');
  assert.equal(result.laws.length, 0);
  assert.equal(lawClientCalls, 0);
});

test('chat bridge rejects invalid questions in its existing response format', async () => {
  const window = {};
  runInNewContext(source, { window });
  const result = await window.safetyChatLawContext.lookup('');
  assert.equal(result.status, 'unavailable');
  assert.equal(result.laws.length, 0);
});

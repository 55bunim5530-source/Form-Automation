import test from 'node:test';
import assert from 'node:assert/strict';
import { AI_MODELS, callOpenRouter, redactPersonalData } from './api.mjs';

test('feature models are set on the server', () => {
  assert.equal(AI_MODELS.schedule, 'openai/gpt-6-luna');
  assert.equal(AI_MODELS.chatbot, 'openai/gpt-6-luna');
  assert.equal(AI_MODELS.msds, 'google/gemini-3.1-flash-lite');
});

test('common personal identifiers are removed before external calls', () => {
  const cleaned = redactPersonalData('성명: 홍길동, 900101-1234567, 010-1234-5678, hello@example.com');
  assert.doesNotMatch(cleaned, /홍길동|900101|1234-5678|hello@example/u);
});

test('AI endpoint reports missing server key without making a network call', async () => {
  const originalKey = process.env.OPENROUTER_API_KEY;
  const originalFetch = globalThis.fetch;
  delete process.env.OPENROUTER_API_KEY;
  globalThis.fetch = () => { throw Error('network should not be called'); };
  try {
    const result = await callOpenRouter('chatbot', { messages: [{ role: 'user', content: '질문' }] });
    assert.equal(result.status, 503);
  } finally {
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    globalThis.fetch = originalFetch;
  }
});

test('server selects model and key, masks personal data, and returns provider completion', async () => {
  const originalKey = process.env.OPENROUTER_API_KEY;
  const originalFetch = globalThis.fetch;
  process.env.OPENROUTER_API_KEY = 'test-only-secret';
  let sent;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-only-secret');
    sent = JSON.parse(options.body);
    return new Response(JSON.stringify({ choices: [{ message: { content: '완료' } }] }), { status: 200 });
  };
  try {
    const result = await callOpenRouter('msds', {
      model: 'untrusted/model', apiKey: 'untrusted-key',
      messages: [{ role: 'user', content: '담당자: 홍길동, 연락처 010-1234-5678' }],
    });
    assert.equal(result.status, 200);
    assert.equal(result.data.choices[0].message.content, '완료');
    assert.equal(sent.model, 'google/gemini-3.1-flash-lite');
    assert.equal(sent.apiKey, undefined);
    assert.doesNotMatch(sent.messages[0].content, /홍길동|010-1234-5678/u);
  } finally {
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    globalThis.fetch = originalFetch;
  }
});

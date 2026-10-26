import assert from 'node:assert/strict';
import test from 'node:test';
import { recommendFollowUps } from './action-recommendations.ts';

const result = (category = 'risk') => ({
  status: 'found',
  evidence: [{ sourceTitle: '검증된 업무자료', excerpt: '관련 업무의 확인 근거' }],
  context: { category },
});
const modules = (question, response = result()) => recommendFollowUps(question, response).map((item) => item.module);

test('위험성평가 절차 답변에는 저장이 아닌 일정 초안 제안만 제공한다', () => {
  const suggestions = recommendFollowUps('위험성평가 절차 알려줘', result());
  assert.deepEqual(suggestions.map((item) => item.module), ['work']);
  assert.equal(suggestions[0].kind, 'schedule');
  assert.match(suggestions[0].question, /등록하시겠습니까/u);
});

test('질문 속 일정 날짜가 있어도 추천 단계에서는 일정 데이터가 만들어지지 않는다', () => {
  assert.deepEqual(modules('2026-11-05에 위험성평가 업무 일정 등록해줘'), ['work']);
});

test('서식·시설·MSDS 질문은 해당 기능으로만 연결한다', () => {
  assert.deepEqual(modules('공사 시 필요한 서식 작성 방법', result('contractor')), ['forms']);
  assert.deepEqual(modules('시설 점검 개선조치 이력은 어떻게 관리하나요?', result('inspection')), ['inspection']);
  assert.deepEqual(modules('세제 MSDS 관리 방법', result('msds')), ['msds']);
});

test('정의만 묻거나 관계없는 질문에는 추천하지 않는다', () => {
  assert.deepEqual(modules('위험성평가란 무엇인가요?'), []);
  assert.deepEqual(modules('오늘 점심 뭐 먹지?'), []);
});

test('근거가 없거나 범위 밖이면 후속 기능을 제안하지 않는다', () => {
  assert.deepEqual(modules('위험성평가 절차 알려줘', { ...result(), evidence: [] }), []);
  assert.deepEqual(modules('위험성평가 절차 알려줘', { ...result(), status: 'not_found' }), []);
  assert.deepEqual(modules('위험성평가 절차 알려줘', { ...result(), outOfScopeNotice: '범위 밖' }), []);
});

test('여러 기능이 관련돼도 우선순위에 따라 최대 두 개만 제안한다', () => {
  const suggestions = recommendFollowUps('2026-11-05 위험성평가 일정 등록과 시설 점검 개선조치 서식 작성, 화학제품 MSDS 관리 방법', result('risk'));
  assert.ok(suggestions.length <= 2);
  assert.equal(suggestions[0].module, 'work');
  assert.deepEqual(suggestions.map((item) => item.module), ['work', 'forms']);
});

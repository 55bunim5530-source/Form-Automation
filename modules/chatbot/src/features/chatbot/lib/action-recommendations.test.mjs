import assert from 'node:assert/strict';
import test from 'node:test';
import { recommendFollowUps } from './action-recommendations.ts';

const result = (category = 'risk') => ({
  status: 'found',
  evidence: [{ sourceTitle: '검증된 업무자료', excerpt: '관련 업무의 확인 근거' }],
  context: { category },
});
const modules = (question, response = result()) => recommendFollowUps(question, response).map((item) => item.module);

test('위험성평가 절차 답변에는 일정 등록 화면 연결을 제안한다', () => {
  const suggestions = recommendFollowUps('위험성평가 절차 알려줘', result());
  assert.deepEqual(suggestions.map((item) => item.module), ['work']);
  assert.equal(suggestions[0].kind, 'register');
  assert.equal(suggestions[0].question, '관련된 업무의 일정을 등록하시겠습니까?');
  assert.equal(suggestions[0].buttonLabel, '등록 화면 열기');
});

test('질문 속 일정 날짜가 있어도 추천 단계에서는 일정 데이터가 만들어지지 않는다', () => {
  for (const [question, response] of [
    ['2026-11-05에 위험성평가 업무 일정 등록해줘', result()],
    ['다음 달 첫 평일에 정기점검 일정을 넣어줘.', result('inspection')],
  ]) {
    const suggestions = recommendFollowUps(question, response);
    assert.deepEqual(suggestions.map((item) => item.module), ['work'], question);
    assert.equal(suggestions[0].kind, 'register', question);
    assert.equal(suggestions[0].question, '관련된 업무의 일정을 등록하시겠습니까?', question);
    assert.equal(suggestions[0].buttonLabel, '등록 화면 열기', question);
  }
});

test('실제로 발생한 채용·재해 질문에도 업무 등록 화면을 제안한다', () => {
  for (const [question, category] of [
    ['새 근로자를 채용했는데 어떤 교육을 해야 하나요?', 'education'],
    ['학교에서 산업재해가 발생했는데 어떤 후속 업무가 필요한가요?', 'accident'],
  ]) {
    const work = recommendFollowUps(question, result(category)).find((item) => item.module === 'work');
    assert.equal(work?.kind, 'register', question);
    assert.equal(work?.question, '관련된 업무의 일정을 등록하시겠습니까?', question);
  }
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

test('실제 질문에서 도급 점검과 협의체 회의는 해당 서식과 업무 일정으로 연결한다', () => {
  const cases = [
    {
      question: '도급사업 합동 안전보건점검은 얼마나 자주 실시해야 하나요?',
      formId: '04-01-08:inspection',
    },
    {
      question: '안전보건협의체 회의는 누가 참여하고 언제 열어야 하나요?',
      formId: '04-01-08:meeting',
    },
  ];
  for (const { question, formId } of cases) {
    const suggestions = recommendFollowUps(question, result('contractor'));
    assert.deepEqual(suggestions.map(({ module, kind }) => [module, kind]), [
      ['forms', 'navigate'], ['work', 'register'],
    ], question);
    assert.equal(suggestions[0].formId, formId, question);
    assert.equal(suggestions[1].question, '관련된 업무의 일정을 등록하시겠습니까?', question);
    assert.equal(suggestions[1].buttonLabel, '등록 화면 열기', question);
  }
});

test('실제 서식 질문은 해당 서식 ID를 포함해 연결한다', () => {
  const cases = [
    ['안전보건 교육일지에는 어떤 내용을 적고 어디에서 서식을 찾나요?', '05-02-01'],
    ['근골격계 유해요인조사 뒤 예방교육을 하면 어떤 교육일지 서식을 쓰나요?', '09-01-05'],
    ['정기점검 실시 결과 보고 서식은 언제 쓰고 어디에서 열 수 있나요?', '01-02-01'],
    ['산업재해조사표 서식을 작성할 때 꼭 확인해야 할 입력 항목은 무엇인가요?', '06-02-01'],
  ];
  for (const [question, formId] of cases) {
    const suggestions = recommendFollowUps(question, result('forms'));
    assert.equal(suggestions[0]?.module, 'forms', question);
    assert.equal(suggestions[0]?.kind, 'navigate', question);
    assert.equal(suggestions[0]?.formId, formId, question);
  }
});

test('실제 MSDS 교육 질문은 교육일지와 MSDS 기능을 함께 연결한다', () => {
  const question = '청소약품을 쓰는 근로자에게 MSDS 교육은 언제 해야 하나요?';
  const suggestions = recommendFollowUps(question, result('msds'));
  assert.deepEqual(suggestions.map((item) => item.module), ['forms', 'msds']);
  assert.equal(suggestions[0].formId, '10-01-04');
  assert.deepEqual(modules('학교가 새 청소약품을 들여오면 MSDS를 어디에서 받아서 무엇부터 확인해야 하나요?', result('msds')), ['msds']);
});

test('시설 이력 질문은 시설 기능으로, 무관하거나 근거 없는 질문은 연결하지 않는다', () => {
  assert.deepEqual(modules('시설안전 점검이력에서 재점검 예정일과 실제 완료일은 어떻게 구분해 적나요?', result('inspection')), ['inspection']);
  assert.deepEqual(modules('이번 주 로또 당첨번호도 알려줄 수 있나요?', result('risk')), []);
  assert.deepEqual(modules('합동점검표를 작성하려면 어떤 서식을 선택하나요?', { ...result('forms'), evidence: [] }), []);
});

test('업무 주제와 대화 문맥으로 연결 서식을 찾되 조문 질문에는 서식을 끼워 넣지 않는다', () => {
  assert.deepEqual(modules('급식실 청소를 외부 업체에 맡기면 학교와 업체가 각각 확인할 안전보건 사항은 무엇인가요?', result('contractor')), ['work']);
  assert.equal(recommendFollowUps('근골격계부담작업 유해요인조사는 언제 실시해야 하나요?', result('musculoskeletal'))[0]?.formId, '09-01-02');
  assert.equal(recommendFollowUps('그럼 조사표는 언제까지 내야 하나요?', result('accident'))[0]?.formId, '06-02-01');
  assert.equal(recommendFollowUps('근로자 정기 안전보건교육은 반기마다 몇 시간 실시해야 하나요?', result('education'))[0]?.formId, '05-02-01');
  assert.deepEqual(modules('산업안전보건법상 교육 의무는 어떤 법령과 조문을 봐야 하나요?', result('education')), []);
});

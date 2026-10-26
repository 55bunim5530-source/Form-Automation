const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'shell', 'chat-schedule.js'), 'utf8');

function harness(existingTasks = []) {
  let sequence = 0;
  let saves = 0;
  const app = {
    data: {
      tasks: [...existingTasks], personalEvents: [], taskChecklist: [], taskHistory: [], appSettings: {}
    },
    syncChecklist() {},
    history(taskId, action) { this.data.taskHistory.unshift({id: `history-${++sequence}`, taskId, action}); },
    async save() { saves++; }
  };
  const window = {safetyReady: true};
  vm.runInNewContext(source, {window, app, uuid: () => `id-${++sequence}`, setTimeout, localStorage: {getItem: () => null}});
  return {adapter: window.safetyChatScheduleAdapter, app, get saves() { return saves; }};
}

function request(answerId = 'answer-1', draft = {}) {
  return {version: 1, requestId: 'request-1', answerId, action: 'schedule',
    question: '위험성평가를 어떻게 진행하나요?', topic: '위험성평가',
    evidence: ['교육청 매뉴얼 해당 항목', '법령 API 조회 결과 참고'],
    draft: {title: '위험성평가 실시', ...draft}};
}

test('초안은 날짜와 대상을 임의로 채우지 않고 답변별 ID를 고정한다', async () => {
  const {adapter, app, saves} = harness();
  const result = await adapter.preview(request());
  assert.equal(result.draft.draftId, 'chat:answer-1');
  assert.equal(result.draft.date, '');
  assert.deepEqual(Array.from(result.missing), ['date', 'target']);
  assert.equal(app.data.tasks.length, 0);
  assert.equal(saves, 0);
});

test('날짜가 없거나 달력에 없는 날이면 저장하지 않는다', async () => {
  const {adapter, app} = harness();
  await assert.rejects(adapter.save(request()), /date/);
  const invalid = await adapter.preview(request('answer-2', {date: '2026-02-30', target: '급식실'}));
  assert.deepEqual(Array.from(invalid.missing), ['date']);
  assert.equal(app.data.tasks.length, 0);
});

test('법령 확인 주장은 신뢰하지 않고 내부 계획만 저장하며 반복 클릭은 멱등 처리한다', async () => {
  const state = harness();
  const payload = request('answer-3', {date: '2026-11-05', target: '급식실', legalStatus: 'verified', dueDate: '2026-11-06'});
  const first = await state.adapter.save(payload);
  const second = await state.adapter.save(payload);
  assert.equal(first.status, 'saved');
  assert.equal(second.status, 'already-saved');
  assert.equal(first.taskId, second.taskId);
  assert.equal(state.app.data.tasks.length, 1);
  assert.equal(state.app.data.personalEvents.length, 1);
  assert.equal(state.saves, 1);
  const task = state.app.data.tasks[0];
  assert.equal(task.date, '2026-11-05');
  assert.equal(task.dueDate, '');
  assert.equal(task.deadlineKind, 'management');
  assert.equal(task.requiresReview, true);
  assert.match(task.memo, /챗봇 원 질문/);
  assert.match(task.memo, /법령 검증 필요/);
});

test('같은 날 위험성평가 일정이 있으면 사전 확인을 요구한다', async () => {
  const state = harness([{id: 'existing-risk', masterCode: 'RSK-001', name: '근로자 참여 위험성평가 실시', date: '2026-11-05', target: '학교전체'}]);
  const payload = request('answer-4', {date: '2026-11-05', target: '급식실'});
  const first = await state.adapter.save(payload);
  assert.equal(first.status, 'duplicate');
  assert.equal(first.matches[0].taskId, 'existing-risk');
  assert.equal(state.app.data.tasks.length, 1);
  const second = await state.adapter.save({...payload, confirmDuplicate: true});
  assert.equal(second.status, 'saved');
  assert.equal(state.app.data.tasks.length, 2);
});

test('첫 저장 요청에서 중복 확인값을 조작해도 확인 단계를 건너뛸 수 없다', async () => {
  const state = harness([{id: 'existing-risk', masterCode: 'RSK-001', name: '근로자 참여 위험성평가 실시', date: '2026-11-05', target: '학교전체'}]);
  const payload = {...request('answer-7', {date: '2026-11-05', target: '급식실'}), confirmDuplicate: true};
  const result = await state.adapter.save(payload);
  assert.equal(result.status, 'duplicate');
  assert.equal(state.app.data.tasks.length, 1);
});

test('빠른 연속 클릭과 화면 재시작 뒤에도 같은 답변 일정을 중복 생성하지 않는다', async () => {
  const first = harness();
  const payload = request('answer-8', {date: '2026-11-05', target: '급식실'});
  const results = await Promise.all([first.adapter.save(payload), first.adapter.save(payload)]);
  assert.deepEqual(results.map(result => result.status).sort(), ['already-saved', 'saved']);
  assert.equal(first.app.data.tasks.length, 1);
  const restarted = harness();
  restarted.app.data = JSON.parse(JSON.stringify(first.app.data));
  const again = await restarted.adapter.save(payload);
  assert.equal(again.status, 'already-saved');
  assert.equal(restarted.app.data.tasks.length, 1);
});

test('과도한 요청과 조작된 초안 ID를 거부한다', async () => {
  const {adapter, app} = harness();
  await assert.rejects(adapter.preview(request('answer-5', {draftId: 'chat:other'})), /초안 ID/);
  await assert.rejects(adapter.preview({...request('answer-6'), question: '가'.repeat(33000)}), /너무 큽니다/);
  assert.equal(app.data.tasks.length, 0);
});

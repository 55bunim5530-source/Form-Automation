const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'shell', 'app.js'), 'utf8');
const dates = appSource.slice(appSource.indexOf('const RULE_TYPES='), appSource.indexOf('function migrateMasterData(){'));
const integration = appSource.slice(appSource.indexOf('/* Runtime: task-form-contract-integration.js */'), appSource.indexOf('/* Runtime: app-viewport.js */'));
const holidays = require('../shell/korean-holidays.js');

function boot() {
  let sequence = 0;
  const masters = [
    ['CNT-001', '안전보건협의체 회의 개최', 'monthly', 'unknown'],
    ['CNT-002', '도급 작업장 순회점검 실시', 'weekly', 'unknown'],
    ['CNT-003', '도급 합동 안전·보건점검 실시', 'quarterly', 'unknown'],
    ['CHK-002', '자체점검 결과 기관장 보고', 'monthly', 'yes'],
  ].map(([taskCode, taskName, recurrenceType, applicability]) => ({
    taskCode, taskName, recurrenceType, applicability, active: true,
    taskType: '정기', scheduleMode: taskCode === 'CHK-002' ? 'lastBusiness' : 'period',
    relatedForms: '', description: taskName, targetId: 'school-default',
  }));
  const app = {
    data: { taskMaster: masters, tasks: [], triggerEvents: [], taskChecklist: [], taskHistory: [], appSettings: { holidays: [], suppressed: [] } },
    calendarDate: new Date('2026-10-26T12:00:00'),
    syncChecklist() {}, history() {}, async save() {},
  };
  const isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const addDays = (day, amount) => { const date = new Date(day + 'T12:00:00'); date.setDate(date.getDate() + amount); return isoDate(date); };
  const window = { KoreanPublicHolidays: holidays, addEventListener() {} };
  const context = vm.createContext({
    app, window, Date, Set, Map, URL, encodeURIComponent,
    eventDefs: { contract: { fields: [] } },
    isoDate, addDays, localToday: () => '2026-10-26', uuid: () => `id-${++sequence}`,
    migrateMasterData() {}, masterToTask(master, options) {
      return { id: `new-${++sequence}`, masterCode: master.taskCode, name: master.taskName,
        type: '정기', category: master.category || '도급·용역', date: options.date,
        dueDate: options.dueDate || '', sourceEventId: options.sourceEventId || null,
        requiresReview: options.requiresReview, checklist: [], targetId: master.targetId,
        description: master.description, source: {} };
    },
    ensureSchedules: () => 0, openEventForm() {}, async submitEvent() {},
    openTask() {}, openTaskEdit() {}, visibleSchedule: () => true,
    taskDate: (task) => task.date, statusOf: () => '예정', performanceTimingHtml: () => '', taskDisplay: (task) => ({ title: task.name }),
    suiteData: () => ({ school: {} }), escapeHtml: (value) => String(value), dDay: () => '',
  });
  vm.runInContext(dates, context);
  vm.runInContext(integration, context);
  return { app, window, context, generate: () => vm.runInContext('ensureSchedules()', context),
    visible: (task) => vm.runInContext('visibleSchedule(app.data.tasks.find(t => t.id === '+JSON.stringify(task.id)+'))', context) };
}

test('계약 등록 전에도 세 도급 업무를 조건부 일정으로 표시하고 평일 관리마감을 계산한다', () => {
  const state = boot();
  assert.ok(state.generate() > 0);
  const byCode = (code) => state.app.data.tasks.find((task) => task.masterCode === code);
  const council = byCode('CNT-001');
  const patrol = byCode('CNT-002');
  const joint = byCode('CNT-003');
  assert.ok(council && patrol && joint);
  assert.equal(council.date, '2026-10-01');
  assert.equal(council.dueDate, '2026-10-30');
  assert.equal(patrol.date, '2026-10-26');
  assert.equal(patrol.dueDate, '2026-10-30');
  assert.equal(joint.date, '2026-10-01');
  assert.equal(joint.dueDate, '2026-12-31');
  assert.equal(council.requiresReview, true);
  assert.match(council.memo, /도급관계가 없으면 법정 의무로 보지 않습니다/);
  assert.equal(state.generate(), 0, 'repeated generation is idempotent');
  state.window.safetyTaskIntegration.syncContractCandidates('2026-10-01', '2026-10-31');
  const holidayWeek = state.app.data.tasks.find((task) => task.masterCode === 'CNT-002' && task.periodStart === '2026-10-05');
  assert.equal(holidayWeek.date, '2026-10-06', 'substitute holiday moves the planned inspection to a working day');
  assert.equal(holidayWeek.dueDate, '2026-10-08', 'Hangul Day is excluded from the final management day');
});

test('계약별 적용 확인 후 실제 일정을 만들고 같은 기간의 미완료 후보는 숨긴다', () => {
  const state = boot();
  state.generate();
  const candidate = state.app.data.tasks.find((task) => task.masterCode === 'CNT-001');
  state.app.data.triggerEvents.push({
    id: 'contract-1', type: 'contract', date: '2026-10-01',
    data: { contractId: 'school-cleaning', date: '2026-10-01', endDate: '2026-12-31',
      role: '도급인', contractExemption: '아니오', councilApplicable: '해당',
      patrolApplicable: '해당', jointApplicable: '해당', industryRule: '일반 업종(주 1회·분기 1회)' },
  });
  assert.ok(state.generate() > 0);
  const actual = state.app.data.tasks.find((task) => task.contractSchedule && task.masterCode === 'CNT-001');
  assert.ok(actual);
  assert.equal(actual.date, '2026-10-01');
  assert.equal(actual.dueDate, '2026-10-30');
  assert.equal(actual.deadlineKind, 'management');
  assert.equal(state.visible(candidate), false);
  assert.equal(state.generate(), 0);
});

test('기존 월간 업무는 1일·말일 평일로 조정하되 사용자가 바꾼 일정은 보존한다', () => {
  const state = boot();
  state.app.data.tasks.push(
    { id: 'auto', masterCode: 'CHK-002', date: '2026-10-30', dueDate: '',
      periodStart: '2026-10-01', periodEnd: '2026-10-31', userModified: false, completedByUser: false, changes: [] },
    { id: 'custom', masterCode: 'CHK-002', date: '2026-11-12', dueDate: '2026-11-25',
      periodStart: '2026-11-01', periodEnd: '2026-11-30', userModified: true, completedByUser: false, changes: [] },
  );
  state.generate();
  assert.equal(state.app.data.taskMaster.find((master) => master.taskCode === 'CHK-002').scheduleMode, 'day');
  assert.equal(state.app.data.tasks.find((task) => task.id === 'auto').date, '2026-10-01');
  assert.equal(state.app.data.tasks.find((task) => task.id === 'auto').dueDate, '2026-10-30');
  assert.equal(state.app.data.tasks.find((task) => task.id === 'custom').date, '2026-11-12');
  assert.equal(state.app.data.tasks.find((task) => task.id === 'custom').dueDate, '2026-11-25');
});

test('추가 휴무일이 바뀌면 미완료 후보 마감을 갱신하고 미래 공휴일 불확실성을 표시한다', () => {
  const state = boot();
  state.generate();
  const october = state.app.data.tasks.find((task) => task.masterCode === 'CNT-001' && task.periodStart === '2026-10-01');
  assert.equal(october.dueDate, '2026-10-30');
  state.app.data.appSettings.holidays = ['2026-10-30'];
  state.window.safetyTaskIntegration.syncContractCandidates('2026-10-01', '2026-10-31');
  assert.equal(october.dueDate, '2026-10-29');
  state.window.safetyTaskIntegration.syncContractCandidates('2028-10-01', '2028-10-31');
  const future = state.app.data.tasks.find((task) => task.masterCode === 'CNT-001' && task.periodStart === '2028-10-01');
  assert.match(future.deadlineSource, /해당 연도 공휴일 자료 확인 필요/);
});

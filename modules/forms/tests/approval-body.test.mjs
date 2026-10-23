import test from 'node:test';
import assert from 'node:assert/strict';
import { FORM_METAS, FORM_04_01_03_ITEMS } from '../src/forms/formDataPresets.js';
import { generateApprovalBody } from '../src/services/approvalBody.js';
import { inspectionApproval } from '../src/services/approvalInspections.js';
import { educationApproval } from '../src/services/approvalEducation.js';
import { incidentApproval } from '../src/services/approvalIncidents.js';

test('all 19 forms have a specific template, sequential numbered items and plain text', () => {
  for (const code of Object.keys(FORM_METAS)) {
    assert.ok(inspectionApproval(code, {}) || educationApproval(code, {}) || incidentApproval(code, {}), code);
    const body = generateApprovalBody(code);
    const numbers = [...body.matchAll(/^(\d+)\. /gm)].map(match => Number(match[1]));
    assert.deepEqual(numbers, numbers.map((_, i) => i + 1), code);
    assert.match(body, /1\. 관련: \[관련 문서번호 또는 근거 입력\]/);
    assert.doesNotMatch(body, /undefined|null|NaN|\[object Object\]|<textarea/);
  }
});

test('weekly dates produce the requested month, real date range and entered findings', () => {
  const data = { schoolName: '확인학교', dates: { 3: '2026-10-19', 1: '2026-10-05', 2: '2026-10-12' }, inspectorDept: '행정실', inspectorName: '담당자', items: [{ check: '바닥 점검', subcategory: '넘어짐 위험', result: 'X', issue: '매트 마모', improvement: '매트 교체' }], etcNotes: '다음 주 재확인', approvalReference: '행정실-100', inspectorSign: 'data:image/png;base64,DO_NOT_EXPORT' };
  const before = structuredClone(data);
  const body = generateApprovalBody('01-02-01', data);
  assert.match(body, /^2026년 10월/);
  for (const text of ['2026. 10. 5. ~ 2026. 10. 19.', '행정실 담당자', '매트 마모', '매트 교체', '다음 주 재확인', '관련: 행정실-100', 'X 1건']) assert.ok(body.includes(text), text);
  assert.doesNotMatch(body, /DO_NOT_EXPORT|data:image/);
  assert.deepEqual(data, before);
});

test('cross-year dates do not get collapsed into the current month', () => {
  const body = generateApprovalBody('01-02-01', { docDate: '2030-01-01', dates: { 1: '2025-12-29', 2: '2026-01-05' }, sector: 'cleaning' });
  assert.match(body, /^2025년 12월 ~ 2026년 1월/);
  assert.match(body, /청소\(미화\) 분야/);
  assert.doesNotMatch(body, /2030/);
});

test('empty inspection does not claim all checklist results are positive', () => {
  for (const code of ['01-02-01', '04-01-03', '04-01-04']) {
    const body = generateApprovalBody(code, {});
    assert.match(body, /점검결과 확인 후 입력/);
    assert.doesNotMatch(body, /예 \d+건|O \d+건|이상 없음/);
  }
});

test('weekly O/X counts treat legacy marks as missing without changing saved data or notes', () => {
  const data = {
    items: [
      { check: '정상 점검', result: 'O' },
      { check: '보수 점검', result: 'X', issue: '보수 필요' },
      { check: '이전 표시', result: '-', issue: '기존 메모 유지' },
      { check: '이전 제외 항목', result: '해당없음' },
      { check: '미입력 항목', result: '' }
    ]
  };
  const before = structuredClone(data);
  const body = generateApprovalBody('01-02-01', data);
  assert.match(body, /서식 기재 결과: O 1건, X 1건, 미기재 3건/);
  assert.match(body, /보수 필요/);
  assert.match(body, /기존 메모 유지/);
  assert.doesNotMatch(body, /- \d+건|해당없음 \d+건/);
  assert.deepEqual(data, before);
});

test('contractor yes/no values display as O/X while preserving negative findings and legacy data', () => {
  const results = ['예', '아니오', '해당없음', '-'];
  const items = FORM_04_01_03_ITEMS.map((item, index) => ({
    ...item,
    content: index === 1 ? '기존 지적사항 확인' : item.content,
    result: results[index] || ''
  }));
  for (const [code, data] of [
    ['04-01-03', { items }],
    ['04-01-04', { checklistType: 'electric', items_electric: items, items_fall: [{ result: '예', content: '다른 탭 항목' }] }]
  ]) {
    const before = structuredClone(data);
    const body = generateApprovalBody(code, data);
    assert.ok(body.includes(`서식 기재 결과: O 1건, X 1건, 미기재 ${items.length - 2}건`), code);
    assert.match(body, /확인 필요 항목: 기존 지적사항 확인/);
    assert.doesNotMatch(body, /예 \d+건|아니오 \d+건|해당없음 \d+건|- \d+건|다른 탭 항목/);
    assert.deepEqual(data, before);
  }
});

test('legacy-only inspections remain missing and never become positive results', () => {
  const items = FORM_04_01_03_ITEMS.map((item, index) => ({ ...item, result: index % 2 ? '-' : '해당없음' }));
  for (const [code, data] of [
    ['01-02-01', { items }],
    ['04-01-03', { items }],
    ['04-01-04', { checklistType: 'fall', items_fall: items }]
  ]) {
    const before = structuredClone(data);
    const body = generateApprovalBody(code, data);
    assert.match(body, /점검결과 확인 후 입력/);
    assert.ok(body.includes(`미기재 ${items.length}건`), code);
    assert.doesNotMatch(body, /O \d+건|X \d+건|예 \d+건|아니오 \d+건|해당없음 \d+건|- \d+건|양호|이상 없음/);
    assert.deepEqual(data, before);
  }
});

test('meeting and inspection use their own selected period and input contents', () => {
  const data = { year: '2027', month: '3', quarter: '2', dateTime: '2027. 4. 10. 14:00', location: '급식실', agendas: '안건 첫째\n안건 둘째', suggestions: '후속조치', employerAttendees: [{ role: '담당', name: '김담당', sign: 'SECRET_IMAGE' }], contractorAttendees: [{ role: '대표', name: '이대표' }] };
  const monthly = generateApprovalBody('04-01-08', data);
  const quarterly = generateApprovalBody('04-01-08', { ...data, docType: 'inspection' });
  assert.match(monthly, /^2027년 3월 안전보건협의체 회의/);
  assert.match(quarterly, /^2027년 2분기 합동 안전보건점검/);
  assert.match(quarterly, /점검일시: 2027\. 4\. 10\. 14:00/);
  assert.match(quarterly, /안건 첫째\n   안건 둘째/);
  assert.match(quarterly, /도급자 담당 김담당, 수급자 대표 이대표/);
  assert.doesNotMatch(quarterly, /SECRET_IMAGE|3월/);
});

test('four contractor checklists read only the current checklist results', () => {
  const body = generateApprovalBody('04-01-04', { checklistType: 'electric', docDate: '2026-08-01', items_electric: [{ no: 1, content: '누전차단기 확인', result: '아니오' }], items_fall: [{ content: '다른 탭 내용', result: '예' }] });
  assert.match(body, /감전재해/);
  assert.match(body, /2026\. 8\. 1\./);
  assert.match(body, /누전차단기 확인/);
  assert.doesNotMatch(body, /다른 탭 내용/);
});

test('protective equipment uses custom names and row dates, including zero', () => {
  const body = generateApprovalBody('03-01-01', { equipCol1: '귀마개', rows: [{ date: '2026-09-02', name: '대상자', q1: 0, q2: '2' }, { date: '', name: '', q1: '' }] });
  assert.match(body, /2026\. 9\. 2\./);
  assert.match(body, /귀마개 0, 안전화 2/);
  assert.doesNotMatch(body, /서명|undefined/);
});

test('pledge keeps project, contractor and the explicit date', () => {
  const body = generateApprovalBody('04-01-05', { projectName: '배관보수', contractorCompany: '확인업체', contractorLeader: '대표자', docYear: '2025', docMonth: '11', docDay: '7', lawCompliance: '아니오' });
  for (const text of ['배관보수', '확인업체 / 대표자', '2025년 11월 7일', '아니오']) assert.ok(body.includes(text));
});

test('education uses actual education date, times, people counts and topic', () => {
  for (const code of ['05-02-01', '09-01-05', '10-01-04']) {
    const body = generateApprovalBody(code, { eduDate: '2026-06-12', docDate: '2030-01-01', startTime: '13:20', endTime: '14:50', durationMinutes: '90', targetMale: '2', targetFemale: '3', actualMale: '2', actualFemale: '2', absentReason: '출장 1명', instructorName: '강사', eduSubject: '보호구 착용', eduContent: '착용 실습\n관리 방법', chemList: ['시험약품'] });
    for (const text of ['2026. 6. 12.', '13:20~14:50', '90분', '5명', '4명', '출장 1명', '보호구 착용', '착용 실습\n   관리 방법']) assert.ok(body.includes(text), `${code}: ${text}`);
    assert.doesNotMatch(body, /2030/);
    if (code === '10-01-04') assert.match(body, /시험약품/);
  }
});

test('partial education counts do not fabricate a total or use docDate as eduDate', () => {
  const body = generateApprovalBody('05-02-01', { targetMale: '0', docDate: '2030-01-01' });
  assert.match(body, /남 0명/);
  assert.match(body, /총인원 확인 필요/);
  assert.match(body, /교육일자 입력/);
  assert.doesNotMatch(body, /2030/);
});

test('accident dates and actions come from the corresponding forms, without identity details', () => {
  const base = { schoolName: '기관', docDate: '2030-01-01', victimRRN: 'SECRET_RRN', victimPhone: 'SECRET_PHONE', victimAddress: 'SECRET_ADDRESS' };
  const investigation = generateApprovalBody('06-02-01', { ...base, occurDate: '2026-07-03', occurTime: '10:15', occurSituation: '미끄러짐', occurReason: '젖은 바닥', preventPlan: '매트 설치' });
  assert.match(investigation, /2026\. 7\. 3\. 10:15/);
  assert.match(investigation, /젖은 바닥/);
  const serious = generateApprovalBody('06-02-02', { ...base, occurDateTime: '2026-07-03T10:15', occurDescription: '현장 확인', actionAndProspect: '통로 통제', severity: '부상', leaveDays: '0' });
  assert.match(serious, /2026\. 7\. 3\. 10:15/);
  assert.match(serious, /통로 통제/);
  assert.match(serious, /0일/);
  const plan = generateApprovalBody('06-02-03', { ...base, occurDateTimeText: '2026년 7월 3일 오전', shortTermPlan: '즉시 보수', longTermPlan: '시설 개선' });
  assert.match(plan, /즉시 보수/);
  assert.match(plan, /시설 개선/);
  for (const text of [investigation, serious, plan]) assert.doesNotMatch(text, /2030|SECRET_/);
});

test('worker-opinion tab and profession are respected without interpreting O/X as safety judgments', () => {
  const body = generateApprovalBody('08-01-01', { activeTab: 'example2', checklistSector: 'cleaning', chkAnswers_cleaning: { 0: 'O', 1: 'X' }, freeOpinion: '다른 탭 자유의견' });
  assert.match(body, /청소 체크리스트/);
  assert.match(body, /1번 O, 2번 X/);
  assert.doesNotMatch(body, /다른 탭 자유의견|양호|불량/);
});

test('risk actions retain dates and content but blank documents do not import example rows', () => {
  const body = generateApprovalBody('08-01-02', { docDate: '2026-03-04', evalMembers: '평가담당자', rows: [{ workDetail: '운반', hazardContent: '중량물', reduceMeasure: '운반대차', planDate: '2026-03-05', doneDate: '', confirm: '행정실' }] });
  for (const text of ['2026. 3. 4.', '평가담당자', '운반대차', '2026. 3. 5.', '[완료일 확인·입력]']) assert.ok(body.includes(text));
  assert.match(generateApprovalBody('08-01-03'), /감소대책 및 실제 개선내용 입력/);
});

test('musculoskeletal forms map investigation, symptoms and improvement plans', () => {
  const checklist = generateApprovalBody('09-01-01', { docDate: '2026-02-01', workRows: [{ workName: '운반작업', checks: { '1호': 'O' } }] });
  assert.match(checklist, /운반작업: 표시 항목 1호/);
  const survey = generateApprovalBody('09-01-02', { docDate: '2026-02-02', step2List: [{ unitWork: '운반', loadScore: '3', freqScore: '4' }] });
  assert.match(survey, /총점 12점/);
  const symptom = generateApprovalBody('09-01-03', { victimDept: '급식실', jobTitle: '조리', pain_neck_level: '심한' });
  assert.match(symptom, /목:.*심한 통증/);
  const plan = generateApprovalBody('09-01-04', { rows: [{ work: '식재료 운반', improvement: '대차 도입', schedule: '2026년 11월', manager: '담당자', cost: 0 }] });
  for (const text of ['식재료 운반', '대차 도입', '2026년 11월', '0천원']) assert.ok(plan.includes(text));
});

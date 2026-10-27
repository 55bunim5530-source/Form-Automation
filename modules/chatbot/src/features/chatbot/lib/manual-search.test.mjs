import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import Module, { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';

const nativeRequire = createRequire(import.meta.url);
const ts = nativeRequire('typescript');
const sourceRoot = path.resolve(import.meta.dirname, '../../..');
const loaded = new Map();

// Exercise the real search module and bundled JSON without starting the API or making network calls.
function loadTypeScript(filename) {
  if (loaded.has(filename)) return loaded.get(filename);
  const source = readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, resolveJsonModule: true },
    fileName: filename,
  }).outputText;
  const module = new Module(filename);
  module.filename = filename;
  module.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded.set(filename, module.exports);
  module.require = (specifier) => {
    if (!specifier.startsWith('@/')) return nativeRequire(specifier);
    const target = path.join(sourceRoot, specifier.slice(2));
    if (target.endsWith('.json') && existsSync(target)) return nativeRequire(target);
    if (existsSync(`${target}.ts`)) return loadTypeScript(`${target}.ts`);
    if (existsSync(`${target}.json`)) return nativeRequire(`${target}.json`);
    throw new Error(`Unresolved source import: ${specifier}`);
  };
  module._compile(compiled, filename);
  loaded.set(filename, module.exports);
  return module.exports;
}

const { searchManual } = loadTypeScript(path.join(import.meta.dirname, 'manual-search.ts'));

test('협의체의 구성과 주기는 실제 협의체 자료로 답한다', () => {
  const result = searchManual('안전보건협의체 회의는 누가 참여하고 언제 열어야 하나요?');
  assert.equal(result.status, 'found');
  assert.match(result.message, /도급인.*수급인.*매월/u);
  assert.match(result.evidence[0].excerpt, /도급인과 그 수급인 전원/u);
});

test('휴업 없는 경미 사고는 보고 경로와 기록 근거를 혼동하지 않는다', () => {
  const result = searchManual('가벼운 찰과상만 발생하고 휴업은 없었다면 학교가 어떤 기록을 남겨야 하나요?');
  assert.equal(result.status, 'found');
  assert.match(result.evidence[0].excerpt, /경미한 사고/u);
  assert.match(result.message, /기관 자체 종결.*\[근거 1\]/u);
  assert.match(result.message, /사고 경위와 원인.*\[근거 2\]/u);
  assert.match(result.evidence[1].excerpt, /사고 경위와 원인/u);
  assert.doesNotMatch(result.message, /산업재해조사표를.*제출/u);
});

test('공식 PDF 없이 AI 결과를 신뢰해도 되는지 묻는 질문에는 무관한 경고표지 문장을 인용하지 않는다', () => {
  const result = searchManual('제품 이름만 있고 제조사 MSDS PDF를 찾지 못하면 앱의 AI 분석 결과만 믿어도 되나요?');
  assert.equal(result.status, 'not_found');
  assert.deepEqual(result.evidence, []);
});

test('분전반 덮개 위험은 전기 자료만 인용한다', () => {
  const result = searchManual('학교 기계실 분전반을 점검하다가 덮개가 열린 것을 발견하면 우선 무엇을 해야 하나요?');
  assert.equal(result.status, 'found');
  assert.ok(result.evidence.length);
  assert.ok(result.evidence.every((item) => /전기|배전반|충전부/u.test(`${item.section} ${item.excerpt}`)));
  assert.doesNotMatch(result.message, /조리실|배수로|국솥/u);
});

test('운동장 시설물에 대한 직접 자료가 없으면 일반 점검표를 답으로 쓰지 않는다', () => {
  const result = searchManual('운동장 시설물 점검결과에 결함이 있으면 개선조치 완료 전까지 어떻게 관리하나요?');
  assert.equal(result.status, 'not_found');
  assert.deepEqual(result.evidence, []);
});

test('앱 서식명과 일정 저장 요청에 매뉴얼 조각을 끼워 맞추지 않는다', () => {
  const form = searchManual('정기점검 실시 결과 보고 서식은 언제 쓰고 어디에서 열 수 있나요?');
  const schedule = searchManual('다음 달 첫 평일에 정기점검 일정을 넣어줘.');
  assert.equal(form.status, 'not_found');
  assert.equal(schedule.status, 'not_found');
  assert.deepEqual(form.evidence, []);
  assert.deepEqual(schedule.evidence, []);
});

test('넘어짐 4일 휴업은 사고 직후 조치와 보고 자료를 연결하고 후속 기한을 유지한다', () => {
  const first = searchManual('급식실 근로자가 넘어져 4일간 휴업하게 됐어요. 먼저 뭘 해야 하나요?');
  assert.equal(first.status, 'found');
  assert.equal(first.context?.category, 'accident');
  assert.match(first.message, /응급조치|현장 통제/u);
  assert.match(first.message, /\[근거 1\].*\[근거 2\]/u);
  assert.match(first.evidence.map((item) => item.excerpt).join(' '), /3일 이상 휴업/u);
  const followUp = searchManual('그럼 조사표는 언제까지 내야 하나요?', first.context);
  assert.equal(followUp.status, 'found');
  assert.match(followUp.message, /1개월 이내/u);
  assert.match(followUp.evidence[0].excerpt, /1개월 이내/u);
});

test('실제로 근거가 있는 일반 안전 질문은 계속 검색된다', () => {
  const result = searchManual('급식실 바닥이 미끄러울 때 어떻게 점검하나요?');
  assert.equal(result.status, 'found');
  assert.ok(result.evidence.length);
});

test('정기교육과 합동점검의 수치가 매뉴얼에 직접 있으면 주요 근거에 포함한다', () => {
  const training = searchManual('근로자 정기교육은 몇 시간 해야 하나요?');
  const inspection = searchManual('도급사업 합동점검은 언제 하나요?');
  assert.ok(training.evidence.some((item) => item.sourceTitle === '서울특별시교육청 산업안전보건업무 매뉴얼' && item.excerpt.includes('12시간')));
  assert.ok(inspection.evidence.some((item) => item.sourceTitle === '서울특별시교육청 산업안전보건업무 매뉴얼' && item.excerpt.includes('분기 1회')));
});

test('교육 시기를 직접 설명하지 않는 매뉴얼은 MSDS 교육의 주요 근거로 올리지 않는다', () => {
  const result = searchManual('MSDS 교육은 언제 해야 하나요?');
  assert.ok(!result.evidence.some((item) => item.sourceTitle === '서울특별시교육청 산업안전보건업무 매뉴얼'));
});

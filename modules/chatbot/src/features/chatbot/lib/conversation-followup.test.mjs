import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import Module, { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';

const nativeRequire = createRequire(import.meta.url);
const ts = nativeRequire('typescript');
const sourceRoot = path.resolve(import.meta.dirname, '../../..');
const loaded = new Map();

// Load the real TypeScript functions without starting Next.js or calling AI services.
function loadTypeScript(filename) {
  if (loaded.has(filename)) return loaded.get(filename);
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
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

const {
  shouldResolveFollowUp,
  ambiguousReferent,
  recentConversationQuestions,
} = loadTypeScript(path.join(import.meta.dirname, 'conversation-followup.ts'));

function context(question, category, recentQuestions) {
  return { question, category, recentQuestions, evidenceSections: [] };
}

test('직전 대상이 하나인 2턴 대화에서 생략된 주어와 지시어를 후속 질문으로 판정한다', () => {
  const inspection = context('도급사업 합동점검은 언제 해야 하나요?', 'contractor');
  const council = context('안전보건협의체 회의는 누가 참석하나요?', 'contractor');
  assert.equal(shouldResolveFollowUp('누가 같이 하나요?', inspection), true);
  assert.equal(shouldResolveFollowUp('그 점검은 누가 하나요?', inspection), true);
  assert.equal(shouldResolveFollowUp('그럼 매월 열어야 하나요?', council), true);
  assert.equal(ambiguousReferent('그건 월 1회인가요?', inspection), null);
});

test('3턴 대화의 최근 질문은 순서대로 유지하고 중복은 제거한다', () => {
  const prior = context('그 결과는 몇 년 보관해요?', 'risk', [
    '정기 위험성평가는 언제 해야 하나요?',
    '평가 결과는 어디에 기록하나요?',
    '그 결과는 몇 년 보관해요?',
  ]);
  assert.deepEqual(recentConversationQuestions(prior), [
    '정기 위험성평가는 언제 해야 하나요?',
    '평가 결과는 어디에 기록하나요?',
    '그 결과는 몇 년 보관해요?',
  ]);
  assert.equal(shouldResolveFollowUp('그건 어디에 기록해요?', prior), true);
  assert.equal(shouldResolveFollowUp('그 결과는 언제까지 보관해요?', prior), true);
});

test('비교한 두 업무를 그건이라고 부르면 한쪽을 임의로 고르지 않는다', () => {
  const prior = context('합동점검과 순회점검은 어떻게 달라요?', 'inspection');
  assert.equal(shouldResolveFollowUp('그건 월 1회인가요?', prior), true);
  assert.match(ambiguousReferent('그건 월 1회인가요?', prior), /합동점검·순회점검/u);
  assert.equal(ambiguousReferent('합동점검은 월 1회인가요?', prior), null);
});

test('새 업무가 완전한 질문으로 명시되면 이전 주제를 승계하지 않는다', () => {
  const inspection = context('합동점검은 누가 언제 하나요?', 'contractor');
  const education = context('정기교육은 몇 시간 해야 하나요?', 'education');
  assert.equal(shouldResolveFollowUp('그럼 MSDS 교육은 언제 하나요?', inspection), false);
  assert.equal(shouldResolveFollowUp('위험성평가 기록은 몇 년 보관하나요?', education), false);
});

test('새 대상만 짧게 말하면 이전 질문의 의도를 잇는 후속 질문으로 판정한다', () => {
  const hiring = context('신규 채용 안전보건교육은 몇 시간 해야 하나요?', 'education');
  const retention = context('위험성평가 기록은 몇 년 보관하나요?', 'risk');
  assert.equal(shouldResolveFollowUp('일용근로자는요?', hiring), true);
  assert.equal(shouldResolveFollowUp('산업재해조사표는요?', retention), true);
});

test('문맥이 초기화된 새 대화나 범위 밖 요청 뒤에는 이전 주제를 해석하지 않는다', () => {
  const clearedContext = undefined;
  assert.equal(shouldResolveFollowUp('그럼 언제 하나요?', clearedContext), false);
  assert.equal(ambiguousReferent('그건 월 1회인가요?', clearedContext), null);
  assert.deepEqual(recentConversationQuestions(clearedContext), []);
});

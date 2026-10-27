import assert from 'node:assert/strict';
import test from 'node:test';
import { evidenceParagraphs } from './evidence-format.ts';

test('official article heading, paragraphs, and items appear on separate lines', () => {
  const excerpt = '제29조(안전보건교육)\n① 첫째 항의 내용이다.\n② 둘째 항의 내용이다.\n1. 첫째 호의 내용이다.';
  assert.deepEqual(evidenceParagraphs(excerpt, true), [
    '제29조(안전보건교육)', '① 첫째 항의 내용이다.', '② 둘째 항의 내용이다.', '1. 첫째 호의 내용이다.',
  ]);
  assert.deepEqual(evidenceParagraphs('제29조(안전보건교육) ① 첫째 항이다. ② 둘째 항이다.', true), [
    '제29조(안전보건교육)', '① 첫째 항이다.', '② 둘째 항이다.',
  ]);
});

test('long manual passages split at Korean sentence and list boundaries', () => {
  const first = '위험성평가는 사전준비, 유해·위험요인 파악, 위험성 결정, 감소대책 수립·이행, 결과 공유와 기록 순으로 진행하며 근로자가 과정에 참여해야 한다.';
  const second = '작업장·작업자·설비·방법이 바뀌거나 산업재해가 발생한 경우에는 수시평가를 실시하고 정기평가는 매년 1회 실시한다.';
  const third = '대책은 위험요인 제거·대체, 공학적 통제, 관리적 통제, 개인보호구 순으로 검토하며 기록은 3년간 보존한다.';
  assert.deepEqual(evidenceParagraphs(`${first} ${second} ${third}`), [first, second, third]);
  assert.deepEqual(evidenceParagraphs('확인 내용이다. 1. 첫 항목이다. 2. 다음 항목이다.'), [
    '확인 내용이다.', '1. 첫 항목이다.', '2. 다음 항목이다.',
  ]);
});

test('dates, decimals, and article references remain intact', () => {
  const excerpt = '점검일은 2026.10.26이며 농도는 1.5이다. 법 제115조제2항을 확인한다.';
  assert.deepEqual(evidenceParagraphs(excerpt), [excerpt]);
  assert.deepEqual(evidenceParagraphs('첫 단락이다.\n\n둘째 단락이다.'), ['첫 단락이다.', '둘째 단락이다.']);
});

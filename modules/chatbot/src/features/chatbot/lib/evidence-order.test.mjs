import assert from 'node:assert/strict';
import test from 'node:test';
import { orderAnswerEvidence } from './evidence-order.ts';

function evidence(sourceTitle, sourceDate, sourcePublisher = '') {
  return { pdfPage: 1, section: sourceTitle, excerpt: `${sourceTitle} 원문`, sourceTitle, sourceDate, sourcePublisher };
}

test('법제처, 업무 매뉴얼, 발행일 최신 자료 순서로 표시하고 인용 번호를 함께 바꾼다', () => {
  const otherOld = evidence('교육청 2024 자료', '2024-12');
  const undated = evidence('발행일 미표기 자료', '');
  const manual = evidence('서울특별시교육청 산업안전보건업무 매뉴얼', '2025-03');
  const otherNew = evidence('고용노동부 2026 자료', '2026-08-03', '고용노동부');
  const law = evidence('산업안전보건법 시행규칙', '2024-01-01', '법제처 국가법령정보센터');
  const result = {
    status: 'found', message: '- 첫 내용 [근거 1].\n- 둘째 내용 [근거 3] [근거 5].',
    keyPoints: [{ text: '핵심', evidenceIds: [4, 2] }],
    sourceTitle: '자료', sourceDate: '', evidence: [otherOld, undated, manual, otherNew, law],
    relatedEvidence: [undated, otherOld, manual, otherNew],
  };
  const ordered = orderAnswerEvidence(result);
  assert.deepEqual(ordered.evidence.map((item) => item.sourceTitle), [
    law.sourceTitle, manual.sourceTitle, otherNew.sourceTitle, otherOld.sourceTitle, undated.sourceTitle,
  ]);
  assert.equal(ordered.message, '- 첫 내용 [근거 4].\n- 둘째 내용 [근거 2] [근거 1].');
  assert.deepEqual(ordered.keyPoints[0].evidenceIds, [3, 5]);
  assert.deepEqual(ordered.relatedEvidence.map((item) => item.sourceTitle), [
    manual.sourceTitle, otherNew.sourceTitle, otherOld.sourceTitle, undated.sourceTitle,
  ]);
  assert.equal(result.evidence[0], otherOld);
});

test('날짜 정밀도와 기간 표기를 비교하고 같은 날짜에는 기존 순서를 유지한다', () => {
  const result = {
    status: 'found', message: '[근거 1] [근거 2]', keyPoints: [], sourceTitle: '', sourceDate: '',
    evidence: [
      evidence('월 자료 A', '2026-08'), evidence('월 자료 B', '2026-08'),
      evidence('기간 자료', '2026-06~08'), evidence('일 자료', '2026-08-03'),
      evidence('잘못된 날짜', '2026-13-99'),
    ],
  };
  const ordered = orderAnswerEvidence(result);
  assert.deepEqual(ordered.evidence.map((item) => item.sourceTitle), [
    '일 자료', '월 자료 A', '월 자료 B', '기간 자료', '잘못된 날짜',
  ]);
  assert.equal(ordered.message, '[근거 2] [근거 3]');
});

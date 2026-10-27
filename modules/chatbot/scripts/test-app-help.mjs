import assert from "node:assert/strict";
import { test } from "node:test";
import { searchAppHelp } from "../src/features/chatbot/lib/app-help.ts";

const examples = [
  ["학교 내부 업무일정과 법정 제출기한이 서로 다르면 어느 날짜를 기준으로 처리해야 하나요?", "관리상 최종일", "work"],
  ["제품 이름만 있고 제조사 MSDS PDF를 찾지 못하면 앱의 AI 분석 결과만 믿어도 되나요?", "공식 MSDS 원문", "msds"],
  ["학교가 새 청소약품을 들여오면 MSDS를 어디에서 받아서 무엇부터 확인해야 하나요?", "제품명·제조사가 PDF와 일치", "msds"],
  ["약품 사진에서 성분이나 함량 숫자가 잘 안 보일 때 챗봇은 어떻게 답해야 하나요?", "추측해 입력하지", "msds"],
  ["급식실 바닥이 미끄러워 넘어질 위험을 발견하면 점검이력에 무엇을 기록해야 하나요?", "임시 안전조치", "inspection"],
  ["운동장 시설물 점검결과에 결함이 있으면 개선조치 완료 전까지 어떻게 관리하나요?", "출입통제", "inspection"],
  ["안전보건 교육일지에는 어떤 내용을 적고 어디에서 서식을 찾나요?", "교육 실시 시 → 안전보건 교육일지", "forms"],
  ["근골격계 유해요인조사 뒤 예방교육을 하면 어떤 교육일지 서식을 쓰나요?", "안전보건 교육일지 (근골격계부담작업)", "forms"],
  ["시설안전 점검이력에서 재점검 예정일과 실제 완료일은 어떻게 구분해 적나요?", "재확인일", "inspection"],
  ["시설안전 점검이력에서 점검결과 파일을 첨부하면 이전 점검 기록도 남나요?", "기존 기록도 목록에 남습니다", "inspection"],
  ["합동점검표를 작성하려면 대표서식 자동화에서 어떤 서식을 선택하나요?", "분기별 → 합동점검표", "forms"],
  ["정기점검 실시 결과 보고 서식은 언제 쓰고 어디에서 열 수 있나요?", "매월 → 정기점검 실시 결과 보고", "forms"],
  ["산업재해조사표 서식을 작성할 때 꼭 확인해야 할 입력 항목은 무엇인가요?", "사업장 정보", "forms"],
  ["작성한 점검표의 결재용 본문은 어디서 만들고 어떻게 복사하나요?", "본문 복사", "forms"],
  ["서식을 작성하다가 저장하면 나중에 다시 열어 수정할 수 있나요?", "수정 저장", "forms"],
  ["매월 안전보건협의체 회의 일정은 프로그램에서 어떻게 생성되나요?", "적용: 해당", "contractor"],
  ["월말이 공휴일이면 월별 점검 업무의 최종 마감일은 어떻게 표시되나요?", "앞선 근무일", "inspection"],
  ["합동점검 업무를 열었을 때 바로 점검표 작성 화면으로 이동할 수 있나요?", "서식 자동작성", "forms"],
  ["그 화면에서 점검표를 저장하면 일정도 자동으로 완료되나요?", "자동으로 완료되지는", "forms"],
  ["다음 달 첫 평일에 정기점검 일정을 넣어줘.", "지금 질문만으로 일정이 저장되지는", "inspection"],
  ["직원 이름과 전화번호를 질문에 넣으면 외부 AI로 전달되나요?", "모든 개인식별정보", "app-privacy"],
];

test("evaluated application questions receive concise local-program answers", () => {
  for (const [question, expected, category] of examples) {
    const answer = searchAppHelp(question);
    assert.equal(answer?.status, "found", question);
    assert.ok(answer.message.includes(expected), question);
    assert.equal(answer.context?.category, category, question);
    assert.equal(answer.sourceTitle, "프로그램 기능 안내", question);
    assert.equal(answer.answerMode, "search", question);
    assert.ok(answer.evidence.length > 0, question);
    assert.ok(answer.evidence.every((item) => item.sourceTitle === "프로그램 기능 안내" && item.referenceLabel), question);
    assert.ok(answer.message.split("\n").every((line) => /^- .+\[근거 \d+\]$/u.test(line)), question);
  }
});

test("a short follow-up about a linked form retains the correct workflow", () => {
  const previous = searchAppHelp("합동점검 업무를 열었을 때 바로 점검표 작성 화면으로 이동할 수 있나요?");
  const answer = searchAppHelp("그 화면에서 저장하면 자동 완료되나요?", previous?.context);
  assert.match(answer?.message ?? "", /자동으로 완료되지는/u);
});

test("new MSDS, education log, and unresolved defect answers cover the required next steps", () => {
  const msds = searchAppHelp("학교가 새 청소약품을 들여오면 MSDS를 어디에서 받아서 무엇부터 확인해야 하나요?");
  assert.match(msds?.message ?? "", /공급업체에 해당 제품의 최신 자료를 요청/u);
  assert.match(msds?.message ?? "", /제품명·제조사가 PDF와 일치/u);

  const log = searchAppHelp("안전보건 교육일지에는 어떤 내용을 적고 어디에서 서식을 찾나요?");
  assert.match(log?.message ?? "", /교육 일시·구분/u);
  assert.match(log?.message ?? "", /참석자 직종·성명·서명/u);

  const defect = searchAppHelp("운동장 시설물 점검결과에 결함이 있으면 개선조치 완료 전까지 어떻게 관리하나요?");
  assert.match(defect?.message ?? "", /이용·접근을 제한/u);
  assert.match(defect?.message ?? "", /다음 확인일/u);
});

test("unrelated legal and emergency questions stay in the law/manual path", () => {
  for (const question of [
    "산업안전보건법 제29조는 무엇을 규정하나요?",
    "분전반에서 불꽃이 튀는데 어떻게 해야 하나요?",
    "합동점검은 법적으로 분기에 몇 번 하나요?",
    "그 업체와 합동점검을 마친 뒤 회의록과 점검표를 모두 작성해야 하나요?",
    "로또 번호 추천해줘",
  ]) assert.equal(searchAppHelp(question), null, question);
});

import type { SearchResponse } from "@/features/chatbot/lib/manual-search";

export type FollowUpModule = "work" | "forms" | "inspection" | "msds";
export type FollowUpRecommendation = {
  module: FollowUpModule;
  kind: "schedule" | "navigate";
  topic: string;
  question: string;
  buttonLabel: string;
};

/** Only offer a next step when the answer actually contains retrieved evidence. */
export function recommendFollowUps(question: string, result: SearchResponse): FollowUpRecommendation[] {
  if (result.status !== "found" || result.evidence.length === 0 || result.outOfScopeNotice) return [];
  const text = question.toLowerCase().normalize("NFKC").replace(/\s+/gu, "");
  const category = result.context?.category ?? "";
  const isDefinitionOnly = /(?:뜻|정의|개념|의미|무엇인가|뭔가|차이|벌칙|과태료)/u.test(text)
    && !/(?:일정|등록|작성|점검|관리|진행|실시|준비|계획|절차)/u.test(text);
  if (isDefinitionOnly) return [];

  const suggestions: Array<{ score: number; value: FollowUpRecommendation }> = [];
  const add = (score: number, value: FollowUpRecommendation) => suggestions.push({ score, value });
  const explicitSchedule = /(?:일정|업무).*(?:등록|추가|잡|계획)|(?:등록|추가).*(?:일정|업무)/u.test(text);
  const risk = /위험성평가|유해.?위험요인.*(?:평가|조사)/u.test(text)
    || (category === "risk" && /(?:평가|실시|일정|계획|절차)/u.test(text));

  if (risk && /(?:일정|등록|실시|진행|계획|준비|절차|어떻게|언제)/u.test(text)) {
    add(explicitSchedule ? 110 : 85, {
      module: "work", kind: "schedule", topic: "risk",
      question: "위험성평가 업무 일정을 등록하시겠습니까?", buttonLabel: "일정 초안 확인",
    });
  } else if (explicitSchedule && category) {
    add(80, {
      module: "work", kind: "schedule", topic: category,
      question: "이 업무의 일정을 등록하시겠습니까?", buttonLabel: "일정 초안 확인",
    });
  }

  if (/(?:서식|양식|일지|기록부|점검표|보고서).*(?:작성|찾|필요|다운로드|사용)|(?:작성|찾|필요|다운로드).*(?:서식|양식|일지|기록부|점검표|보고서)/u.test(text)) {
    add(75, {
      module: "forms", kind: "navigate", topic: "forms",
      question: "관련 서식을 작성하시겠습니까?", buttonLabel: "대표서식 자동화 열기",
    });
  }

  if (/(?:시설|설비|보일러|승강기|전기|사다리|고소작업).*(?:점검|개선|조치|이력|기록)|(?:점검|개선조치).*(?:시설|설비|이력)/u.test(text)) {
    add(70, {
      module: "inspection", kind: "navigate", topic: "inspection",
      question: "시설 점검·개선조치 이력을 관리하시겠습니까?", buttonLabel: "시설안전 점검이력 열기",
    });
  }

  if (/(?:msds|물질안전보건자료|화학제품|화학물질|세제|세척제|소독제|경고표지|소분용기)/u.test(text)
    && /(?:관리|등록|확인|분석|업로드|작성|출력|인쇄|표시|필요|어떻게|해야)/u.test(text)) {
    add(70, {
      module: "msds", kind: "navigate", topic: "msds",
      question: "화학제품·MSDS 업무 화면을 여시겠습니까?", buttonLabel: "MSDS 업무지원 열기",
    });
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 2).map(({ value }) => value);
}

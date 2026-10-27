import type { SearchResponse } from "@/features/chatbot/lib/manual-search";

export type FollowUpModule = "work" | "forms" | "inspection" | "msds";
export type FollowUpRecommendation = {
  module: FollowUpModule;
  kind: "register" | "navigate";
  topic: string;
  question: string;
  buttonLabel: string;
  formId?: string;
};

type LinkedForm = { id: string; title: string; pattern: RegExp };

// These IDs are the values accepted by the form selector, including the two
// separate documents stored under 04-01-08.
const LINKED_FORMS: LinkedForm[] = [
  { id: "04-01-08:inspection", title: "합동점검표", pattern: /합동(?:안전보건)?점검|합동점검표/u },
  { id: "04-01-08:meeting", title: "안전보건협의체 회의록", pattern: /안전보건협의체|협의체회의록/u },
  { id: "01-02-01", title: "정기점검 실시 결과 보고", pattern: /정기(?:안전)?점검(?:실시)?결과(?:기관장)?보고/u },
  { id: "10-01-04", title: "안전보건 교육일지 (MSDS교육)", pattern: /(?:msds|물질안전보건자료)교육|교육(?:일지|서식).*?(?:msds|물질안전보건자료)/u },
  { id: "09-01-05", title: "안전보건 교육일지 (근골격계부담작업)", pattern: /근골격계.*교육|교육(?:일지|서식).*근골격계/u },
  { id: "06-02-01", title: "산업재해조사표", pattern: /산업재해조사표|산재조사표/u },
  { id: "06-02-02", title: "중대재해 발생보고", pattern: /중대재해발생보고/u },
  { id: "06-02-03", title: "재발방지 계획서", pattern: /재발방지계획서/u },
  { id: "05-02-01", title: "안전보건 교육일지", pattern: /안전보건교육일지|교육일지/u },
  { id: "08-01-02", title: "위험성평가표", pattern: /위험성평가표/u },
  { id: "03-01-01", title: "안전보호구 지급대장", pattern: /(?:안전)?보호구지급대장/u },
  { id: "04-01-03", title: "공사(용역) 안전·보건 체크리스트", pattern: /공사(?:용역)?안전보건체크리스트/u },
  { id: "04-01-04", title: "재해예방 점검 체크리스트", pattern: /재해예방점검체크리스트/u },
  { id: "09-01-02", title: "근골격계 유해요인조사", pattern: /근골격계유해요인조사(?:표|서식)/u },
];

const normalize = (value: string) => value.toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}]/gu, "");

/** Recommend only app functions that clearly match the grounded answer's topic. */
export function recommendFollowUps(question: string, result: SearchResponse): FollowUpRecommendation[] {
  if (result.status !== "found" || result.evidence.length === 0 || result.outOfScopeNotice) return [];
  const text = normalize(question);
  const category = result.context?.category ?? "";
  const isDefinitionOnly = /(?:뜻|정의|개념|의미|뭔가|차이|벌칙|과태료|(?:란|이란)무엇인가)/u.test(text)
    && !/(?:일정|등록|작성|점검|관리|진행|실시|준비|계획|절차)/u.test(text);
  if (isDefinitionOnly) return [];

  const suggestions: Array<{ score: number; value: FollowUpRecommendation }> = [];
  const add = (score: number, value: FollowUpRecommendation) => suggestions.push({ score, value });
  const explicitSchedule = /(?:일정|업무).*(?:등록|추가|잡|계획|넣|만들|생성)|(?:등록|추가|넣|만들|생성).*(?:일정|업무)/u.test(text);
  const occurredSituation = /(?:채용했|입사했|재해가발생|사고가났|계약했|착수했|공사를시작|도입했|구입했|새로들여왔|고장났|문제가생겼|변경됐|바뀌었)/u.test(text);
  const risk = /위험성평가|유해위험요인.*(?:평가|조사)/u.test(text)
    || (category === "risk" && /(?:평가|실시|일정|계획|절차)/u.test(text));

  if (risk && /(?:일정|등록|실시|진행|계획|준비|절차|어떻게|언제)/u.test(text)) {
    add(explicitSchedule ? 110 : 85, {
      module: "work", kind: "register", topic: "risk",
      question: "관련된 업무의 일정을 등록하시겠습니까?", buttonLabel: "등록 화면 열기",
    });
  } else if (explicitSchedule && category) {
    add(110, {
      module: "work", kind: "register", topic: category,
      question: "관련된 업무의 일정을 등록하시겠습니까?", buttonLabel: "등록 화면 열기",
    });
  } else if (occurredSituation && ['education', 'accident', 'contractor', 'msds', 'inspection'].includes(category)) {
    add(90, {
      module: "work", kind: "register", topic: category,
      question: "관련된 업무의 일정을 등록하시겠습니까?", buttonLabel: "등록 화면 열기",
    });
  } else if (/(?:일정|업무관리|캘린더|마감일|관리기준일)/u.test(text)
    || /(?:합동(?:안전보건)?점검|안전보건협의체|도급.*순회점검)/u.test(text)
    || (category === "contractor" && /(?:외부업체|도급|용역|수급인|공사업체)/u.test(text))) {
    add(65, {
      module: "work", kind: "register", topic: category || "work",
      question: "관련된 업무의 일정을 등록하시겠습니까?", buttonLabel: "등록 화면 열기",
    });
  }

  let linkedForm = LINKED_FORMS.find((form) => form.pattern.test(text));
  if (!linkedForm && category === "accident" && /조사표/u.test(text)) {
    linkedForm = LINKED_FORMS.find((form) => form.id === "06-02-01");
  }
  if (!linkedForm && category === "musculoskeletal" && /유해요인조사/u.test(text)) {
    linkedForm = LINKED_FORMS.find((form) => form.id === "09-01-02");
  }
  if (!linkedForm && category === "education" && /교육/u.test(text)
    && !/(?:법령|조문|제\d+조|관리감독자)/u.test(text)) {
    linkedForm = LINKED_FORMS.find((form) => form.id === "05-02-01");
  }
  const genericForm = /(?:서식|양식|일지|기록부|점검표|보고서).*(?:작성|찾|필요|다운로드|사용|쓰|어디|열|선택|항목|내용|기재|언제|시기)|(?:작성|찾|필요|다운로드|쓰|어디|열|선택).*(?:서식|양식|일지|기록부|점검표|보고서)/u.test(text);
  if (linkedForm) {
    add(100, {
      module: "forms", kind: "navigate", topic: "forms", formId: linkedForm.id,
      question: `${linkedForm.title} 서식을 여시겠습니까?`, buttonLabel: `${linkedForm.title} 열기`,
    });
  } else if (genericForm || (category === "forms" && /(?:서식|양식|일지|점검표|보고서)/u.test(text))) {
    add(75, {
      module: "forms", kind: "navigate", topic: "forms",
      question: "관련 서식을 작성하시겠습니까?", buttonLabel: "대표서식 자동화 열기",
    });
  }

  if (/(?:시설|설비|보일러|승강기|전기|사다리|고소작업).*(?:점검|개선|조치|이력|기록)|(?:점검|개선조치).*(?:시설|설비|이력)/u.test(text)
    || (category === "inspection" && /(?:시설|설비|점검이력|점검결과|지적사항|재점검)/u.test(text))) {
    add(70, {
      module: "inspection", kind: "navigate", topic: "inspection",
      question: "시설 점검·개선조치 이력을 관리하시겠습니까?", buttonLabel: "시설안전 점검이력 열기",
    });
  }

  if (/(?:msds|물질안전보건자료|화학제품|화학물질|약품|세제|세척제|소독제|경고표지|소분용기)/u.test(text)
    && (category === "msds" || /(?:관리|등록|확인|분석|업로드|작성|출력|인쇄|표시|필요|어떻게|해야|찾|검색|원문|pdf|교육|성분|함량)/u.test(text))) {
    add(70, {
      module: "msds", kind: "navigate", topic: "msds",
      question: "화학제품·MSDS 업무 화면을 여시겠습니까?", buttonLabel: "MSDS 업무지원 열기",
    });
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 2).map(({ value }) => value);
}

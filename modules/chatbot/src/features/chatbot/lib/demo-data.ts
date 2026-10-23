export type IntegrationKey = "risk" | "msds" | "forms" | "contractor";

export type QuickTopic = {
  id: string;
  label: string;
  question: string;
  integration?: IntegrationKey;
};

export const quickTopics: QuickTopic[] = [
  {
    id: "education",
    label: "안전보건교육",
    question: "신규 채용 근로자의 안전보건교육은 어떻게 실시하나요?",
  },
  {
    id: "accident",
    label: "산업재해",
    question: "산업재해가 발생하면 학교에서는 어떻게 대응해야 하나요?",
  },
  {
    id: "msds",
    label: "MSDS",
    question: "학교에서 사용하는 세제도 MSDS 관리가 필요한가요?",
    integration: "msds",
  },
  {
    id: "contractor",
    label: "도급·용역",
    question: "도급업체와 계약할 때 학교가 확인해야 할 사항은 무엇인가요?",
    integration: "contractor",
  },
  {
    id: "risk",
    label: "위험성평가",
    question: "학교 위험성평가는 어떤 절차로 진행되나요?",
    integration: "risk",
  },
  {
    id: "health",
    label: "건강진단",
    question: "근로자 건강진단은 얼마나 자주 실시해야 하나요?",
  },
  {
    id: "environment",
    label: "작업환경측정",
    question: "작업환경측정 대상 여부는 어떻게 확인하나요?",
  },
];

export const integrationLabels: Record<IntegrationKey, string> = {
  risk: "위험성평가 기능",
  msds: "MSDS 관리 기능",
  forms: "서식 관리 기능",
  contractor: "도급·용역 관리 기능",
};

// 다른 팀 기능의 URL만 설정하면 답변과 직접 관련된 경우에만 연결 버튼이 보입니다.
export const integrationUrls: Record<IntegrationKey, string | undefined> = {
  risk: process.env.NEXT_PUBLIC_RISK_ASSESSMENT_URL,
  msds: process.env.NEXT_PUBLIC_MSDS_URL,
  forms: process.env.NEXT_PUBLIC_FORMS_URL,
  contractor: process.env.NEXT_PUBLIC_CONTRACTOR_URL,
};

export function getIntegrationUrl(key: IntegrationKey): string | undefined {
  const value = integrationUrls[key];
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

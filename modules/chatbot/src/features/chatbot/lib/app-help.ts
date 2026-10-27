import type { ConversationContext, Evidence, SearchResponse } from "@/features/chatbot/lib/manual-search";

// The application itself, rather than a statute or an uploaded manual, is the
// authority for these UI instructions. Keep the matches narrow so an ordinary
// occupational-safety question can still use the law/manual retrieval path.
type HelpTopic = {
  id: string;
  category: string;
  matches: (question: string, previous?: ConversationContext) => boolean;
  lines: string[];
  references: { label: string; excerpt: string }[];
};

const has = (text: string, pattern: RegExp) => pattern.test(text);
const and = (text: string, ...patterns: RegExp[]) => patterns.every((pattern) => has(text, pattern));
const SOURCE_TITLE = "프로그램 기능 안내";
const SOURCE_DATE = "2026-10-26";

const TOPICS: HelpTopic[] = [
  {
    id: "internal-vs-legal-deadline",
    category: "work",
    matches: (q) => and(q, /(?:내부|관리|프로그램|업무)\s*(?:업무)?\s*(?:일정|마감|기한)/u, /법정\s*(?:제출)?\s*기한/u, /(?:다르|기준|우선|처리|따라)/u),
    lines: [
      "프로그램의 내부 일정·관리상 최종일은 업무 관리용 날짜이며, 확인된 법정 제출기한을 바꾸지 않습니다.",
      "두 날짜가 다르면 해당 업무의 현행 법령·적용 조건을 확인하고, 법정 제출기한을 놓치지 않도록 내부 일정을 조정하세요.",
    ],
    references: [
      { label: "일정·업무관리 · 날짜 구분", excerpt: "앱은 관리상 최종일과 법정 제출기한을 구분해 표시하고, 도급 반복일정의 관리상 최종일에는 '법정 제출기한 아님'이라고 명시합니다." },
    ],
  },
  {
    id: "privacy",
    category: "app-privacy",
    matches: (q) => and(q, /(?:질문|챗봇|입력|보내)/u, /(?:개인정보|이름|성명|전화번호|연락처|주민등록번호)/u, /(?:외부|AI|전송|전달|보호|가려|비식별)/iu),
    lines: [
      "챗봇 질문은 답변을 만들 때 외부 AI로 전달될 수 있습니다. 직원 이름·전화번호 등은 질문에 넣지 않는 것이 안전합니다.",
      "현재 코드는 전화번호·이메일·일부 이름 표기를 가리지만, 모든 개인식별정보를 빠짐없이 가리는 기능은 아닙니다.",
    ],
    references: [
      { label: "AI 업무지원 챗봇 · 질문 처리", excerpt: "서버가 외부 AI 요청을 만들 때 질문을 비식별 함수에 통과시키고, 근거자료와 함께 외부 AI API로 보냅니다." },
      { label: "AI 업무지원 챗봇 · 비식별 범위", excerpt: "전화번호·이메일·주민등록번호 형식과 일부 학교명·성명 표기만 정규식으로 가립니다. 자유 형식의 모든 이름은 보장하지 않습니다." },
    ],
  },
  {
    id: "msds-new-product",
    category: "msds",
    matches: (q) => and(q, /(?:MSDS|물질안전보건자료)/iu, /(?:새|신규|도입|들여|구입)/u, /(?:청소약품|화학제품|약품|제품)/u, /(?:어디|받|확인|찾|해야)/u),
    lines: [
      "새 청소약품의 공식 MSDS PDF를 제조사·수입자·공급업체에서 확보하세요. 찾지 못하면 공급업체에 해당 제품의 최신 자료를 요청하고 AI 결과만으로 확정하지 마세요.",
      "먼저 실제 용기의 제품명·제조사가 PDF와 일치하는지 대조하고, 유해성·위험성, 취급·보호구 정보와 경고표지를 확인하세요.",
    ],
    references: [
      { label: "MSDS 업무지원 · 공식 MSDS 확인", excerpt: "제조사 홈페이지를 먼저 확인하고, 제조사·공급업체의 공식 PDF 원문을 업로드합니다. 원문을 확보하지 못한 경우 제조사·수입자·공급업체에 제품 단위 최신 MSDS를 요청하도록 안내합니다." },
      { label: "MSDS 업무지원 · 제품 및 관리조치", excerpt: "제품명과 제조사·공급업체, MSDS 확보 상태를 표시합니다. 원문 분석 화면에는 유해성·위험성, 취급·저장방법, 개인보호구와 경고표지 확인 정보가 있습니다." },
    ],
  },
  {
    id: "msds-official-source",
    category: "msds",
    matches: (q) => !has(q, /(?:흐릿|불명확|안\s*보|읽.*어려|인식.*못|판독)/u)
      && and(q, /(?:MSDS|물질안전보건자료|화학제품|성분)/iu, /(?:공식|제조사|공급처|원문|PDF)/iu, /(?:AI|분석|믿|신뢰|없|대체)/iu),
    lines: [
      "AI 분석 결과만으로 확정하지 말고, 제품명·제조사가 일치하는 제조사 또는 공급처의 공식 MSDS 원문을 확보해 대조하세요.",
      "MSDS 업무지원 화면은 제조사 홈페이지 찾기를 먼저, 구글 PDF 검색을 다음으로 안내하며 공식 PDF 직접 업로드도 제공합니다.",
    ],
    references: [
      { label: "MSDS 업무지원 · 공식 MSDS 찾기", excerpt: "화면 안내: 먼저 제조사 홈페이지에서 확인하고, 찾지 못하면 구글에서 MSDS PDF를 검색합니다. 제조사·공급업체의 PDF 원문을 직접 올릴 수도 있습니다." },
    ],
  },
  {
    id: "msds-unreadable",
    category: "msds",
    matches: (q) => and(q, /(?:MSDS|물질안전보건자료|성분|함량)/iu, /(?:흐릿|불명확|안\s*보|읽.*어려|인식.*못|판독)/u, /(?:성분|함량|수치|농도|숫자|AI|분석)/iu),
    lines: [
      "흐릿한 성분명·함량 수치는 추측해 입력하지 마세요. 더 선명한 제조사·공급처 MSDS 원문에서 확인한 뒤 수정하세요.",
      "AI가 추출한 값은 원문과 대조해야 합니다. 원문에서도 확인되지 않으면 미확인으로 두고 공급처에 확인하세요.",
    ],
    references: [
      { label: "MSDS 업무지원 · 원문 확인", excerpt: "화면에서 제조사 홈페이지와 공식 PDF 검색을 우선 안내하고 제조사·공급업체가 제공한 PDF 원문을 직접 업로드하게 합니다. AI는 해당 원문을 분석합니다." },
    ],
  },
  {
    id: "facility-defect-history",
    category: "inspection",
    matches: (q) => and(q, /(?:시설안전|점검이력|점검결과|운동장)/u, /(?:위험|결함|미끄러|개선조치)/u, /(?:기록|관리|조치|무엇)/u),
    lines: [
      "개선 전에는 위험한 시설물의 이용·접근을 제한하고 출입통제 등 임시 안전조치를 하세요. 그 결과를 시설안전 점검이력에 기록하세요.",
      "발견 장소·점검일·결함, 담당자·조치기한·상태를 남기고 보류 중이면 사유와 다음 확인일을 지정하세요. 개선 후 사진과 재확인일·확인자를 기록해 완료 여부를 확인하세요.",
    ],
    references: [
      { label: "시설안전 점검이력 · 임시 안전조치", excerpt: "지적사항의 보류 관리에는 '임시 안전조치 현장 확인 결과'가 있으며, 입력 예시로 출입통제·미끄럼방지 매트 설치가 표시됩니다. 보류 시 임시조치가 필수입니다." },
      { label: "시설안전 점검이력 · 지적사항과 완료 확인", excerpt: "지적사항에는 발견일·위치·담당자·조치기한·상태·보류 사유·다음 확인일을 기록합니다. 개선완료 시 개선 후 사진·현장 재확인일·재확인자가 필요합니다." },
    ],
  },
  {
    id: "facility-dates",
    category: "inspection",
    matches: (q) => and(q, /(?:시설안전|점검이력|지적사항)/u, /(?:재점검|다음\s*확인일|예정일)/u, /(?:완료일|완료|재확인일|실제)/u),
    lines: [
      "시설안전 점검이력의 지적사항에서 '다음 확인일'은 앞으로 다시 확인할 날짜입니다.",
      "개선이 끝났다면 상태를 '개선완료'로 바꾸고 '재확인일'·확인자·개선 후 사진을 기록하세요. 재확인일은 실제 완료 확인 날짜로 남습니다.",
    ],
    references: [
      { label: "시설안전 점검이력 · 지적사항 상세", excerpt: "지적사항에는 다음 확인일(nextDate), 개선 완료 재확인일(verifiedDate), 확인자, 개선 후 사진을 별도로 저장합니다. 개선완료 시 재확인일·확인자·개선 후 사진이 필요합니다." },
    ],
  },
  {
    id: "facility-pdf-history",
    category: "inspection",
    matches: (q) => and(q, /(?:시설안전|점검이력)/u, /(?:PDF|파일|평가표|점검결과)/iu, /(?:첨부|업로드|등록)/u, /(?:이전|과거|기록|이력|남|보존)/u),
    lines: [
      "'시설안전 점검이력 → 점검결과 등록'에서 PDF를 첨부해 저장하면 이번 점검 기록이 추가되고 기존 기록도 목록에 남습니다.",
      "반복해서 미이행으로 확인된 항목은 기존 지적사항 이력에 이어 기록됩니다. 해당 평가기록을 직접 삭제하면 연결 이력도 영향을 받으므로 삭제 전 확인하세요.",
    ],
    references: [
      { label: "시설안전 점검이력 · 점검결과 등록", excerpt: "PDF를 첨부하고 평가 내용을 저장하면 새 evaluation/document가 추가됩니다. 반복 미이행 항목의 observations는 기존 issue에 추가됩니다. 평가기록 삭제 기능도 있습니다." },
    ],
  },
  {
    id: "safety-education-log",
    category: "forms",
    matches: (q) => !has(q, /(?:근골격계|MSDS|물질안전보건자료|법정|법령|의무)/iu)
      && and(q, /(?:안전보건\s*교육일지|교육\s*일지)/u, /(?:어디|찾|서식|내용|기재|항목|적|작성)/u),
    lines: [
      "'대표서식 자동화 → 교육 실시 시 → 안전보건 교육일지'에서 프로그램에 탑재된 작성용 양식을 여세요.",
      "교육 일시·구분, 대상·실시·미실시 인원과 사유, 교육 주제·내용, 강사·장소, 참석자 직종·성명·서명 등을 기재하고 교육사진이 있으면 첨부하세요.",
    ],
    references: [
      { label: "대표서식 자동화 · 교육 실시 시", excerpt: "작성 시기별 서식 선택의 '교육 실시 시' 그룹에 '안전보건 교육일지'가 등록돼 있습니다." },
      { label: "대표서식 자동화 · 안전보건 교육일지", excerpt: "서식에는 교육일시·교육구분, 교육 대상·실시·미실시 인원과 미실시 사유, 교육과목·내용, 강사·교육장소, 참석자 직종·성명·서명, 교육사진 첨부란이 있습니다." },
    ],
  },
  {
    id: "musculoskeletal-education-form",
    category: "forms",
    matches: (q) => and(q, /근골격계/u, /(?:교육일지|교육\s*일지|교육.*서식|예방교육.*서식)/u),
    lines: [
      "근골격계 예방교육을 실시했다면 '대표서식 자동화 → 교육 실시 시 → 안전보건 교육일지 (근골격계부담작업)'을 선택하세요.",
      "유해요인조사 완료 뒤 또는 예방교육 실시 시 작성하는 서식으로 분류돼 있습니다.",
    ],
    references: [
      { label: "대표서식 자동화 · 교육 실시 시", excerpt: "교육 실시 시 그룹의 09-01-05 서식은 '안전보건 교육일지 (근골격계부담작업)'이며 유해요인조사 완료 후 또는 예방교육 실시 시 작성하도록 설명됩니다." },
    ],
  },
  {
    id: "joint-inspection-form",
    category: "forms",
    matches: (q) => !has(q, /(?:업무를\s*열|업무\s*상세|일정.*바로|작성\s*화면으로\s*이동)/u)
      && has(q, /합동\s*점검표|합동점검/u)
      && (has(q, /(?:서식|대표서식|선택|찾|어디|열)/u) || has(q, /합동\s*점검표.*작성/u)),
    lines: [
      "'대표서식 자동화 → 분기별 → 합동점검표'를 선택하세요.",
      "같은 원본 서식의 '안전보건협의체 회의록'은 '매월'에 따로 표시됩니다.",
    ],
    references: [
      { label: "대표서식 자동화 · 작성 시기", excerpt: "분기별 그룹에 합동점검표(04-01-08:inspection), 매월 그룹에 안전보건협의체 회의록(04-01-08:meeting)이 별도로 등록돼 있습니다." },
    ],
  },
  {
    id: "monthly-inspection-report-form",
    category: "forms",
    matches: (q) => and(q, /정기점검\s*실시\s*결과\s*보고/u, /(?:서식|언제|어디|열|작성|선택|사용)/u),
    lines: [
      "'대표서식 자동화 → 매월 → 정기점검 실시 결과 보고'를 여세요.",
      "화면 설명에 따르면 주 1회 정기점검을 실시하고 월 1회 기관장에게 결과를 보고할 때 작성하는 서식입니다.",
    ],
    references: [
      { label: "대표서식 자동화 · 매월", excerpt: "매월 그룹의 01-02-01 서식 제목은 '정기점검 실시 결과 보고'이며, 주 1회 정기점검 결과를 월 1회 기관장에게 보고할 때 작성한다고 설명됩니다." },
    ],
  },
  {
    id: "accident-report-fields",
    category: "forms",
    matches: (q) => and(q, /산업재해조사표|산재조사표/u, /(?:서식|입력|항목|작성|확인)/u),
    lines: [
      "'대표서식 자동화 → 재해 발생 시 → 산업재해조사표 및 예시'에서 사업장 정보와 재해자 정보를 먼저 확인하세요.",
      "이어 재해 발생 일시·상황·원인, 재발방지 계획, 근로자대표 또는 재해자 확인란을 채우고 원자료와 대조하세요.",
    ],
    references: [
      { label: "대표서식 자동화 · 산업재해조사표", excerpt: "06-02-01 작성 화면에는 Ⅰ 사업장 정보, Ⅱ 재해자 정보, Ⅲ 재해발생 개요 및 원인, Ⅳ 재발방지 계획, 근로자대표(재해자) 확인란이 있습니다." },
    ],
  },
  {
    id: "approval-body",
    category: "forms",
    matches: (q) => and(q, /결재용\s*본문|결재\s*본문/u, /(?:어디|만들|복사|작성|붙여|버튼)/u),
    lines: [
      "작성 중인 서식 오른쪽의 '결재용 본문 만들기'를 누르세요.",
      "생성된 본문을 검토·수정한 뒤 창 아래의 '본문 복사'를 눌러 내부 결재 문서에 붙여넣으세요.",
    ],
    references: [
      { label: "대표서식 자동화 · 서식 편집", excerpt: "서식 편집 화면 오른쪽에 결재용 본문 만들기 버튼이 있습니다. 본문 창은 내용을 수정하고 본문 복사 버튼으로 클립보드에 복사할 수 있습니다." },
    ],
  },
  {
    id: "form-storage",
    category: "forms",
    matches: (q) => and(q, /(?:서식|문서|점검표)/u, /저장/u, /(?:다시|나중|재열|보관함|수정|불러)/u),
    lines: [
      "서식에서 '저장하기'를 누르면 보관함에 저장됩니다. 나중에 '보관함 (열기)'에서 문서를 다시 선택할 수 있습니다.",
      "불러온 문서를 고친 뒤 '수정 저장'을 누르면 같은 문서에 변경 내용이 저장됩니다.",
    ],
    references: [
      { label: "대표서식 자동화 · 보관함", excerpt: "서식 저장은 문서를 보관함에 넣습니다. 보관함에서 문서를 선택하면 기존 데이터가 편집 화면에 로드되고, 활성 문서가 있으면 상단 저장 버튼 문구가 '수정 저장'으로 바뀝니다." },
    ],
  },
  {
    id: "council-schedule",
    category: "contractor",
    matches: (q) => and(q, /안전보건협의체|협의체\s*회의/u, /(?:매월|월별|일정|생성|등록)/u, /(?:프로그램|자동|어떻게|만들|언제|일정)/u),
    lines: [
      "'일정·업무관리'에서 도급사업 정보를 등록하고 도급인 여부·계약기간·'안전보건협의체 적용: 해당'을 확인하면 월별 회의 일정이 생성됩니다.",
      "월별 회차는 매월 1일을 기준으로 잡되 계약 첫 달처럼 적용기간이 월 중간에 시작하면 기간 안으로 조정됩니다. 최종일은 평일 이행관리 마감이며 법정 제출기한은 아닙니다.",
    ],
    references: [
      { label: "일정·업무관리 · 도급사업 적용 확인", excerpt: "도급사업 기간, 도급인 역할, 안전보건협의체 적용값이 '해당'일 때 CNT-001 월별 계획을 생성합니다. 계획일은 매월 1일을 기간 안으로 조정하며, 최종일은 주말·공휴일을 고려한 관리상 날짜로 법정 제출기한이 아닙니다." },
    ],
  },
  {
    id: "monthly-deadline",
    category: "inspection",
    matches: (q) => and(q, /(?:월말|마지막\s*날|말일)/u, /(?:공휴일|휴일|주말|토요일|일요일)/u, /(?:마감|최종일|기한)/u, /(?:점검|월별|매월|업무|일정)/u),
    lines: [
      "월별 점검·도급 업무의 관리상 최종일은 월말이 휴일이면 앞선 근무일로 표시됩니다.",
      "공휴일 자료와 사용자가 설정한 휴무일을 기준으로 계산하므로, 해당 연도 공휴일 자료가 충분한지도 확인하세요. 이 날짜는 법정 제출기한이 아닙니다.",
    ],
    references: [
      { label: "일정·업무관리 · 관리상 최종일", excerpt: "월말 마감 계산은 마지막 날부터 주말·공휴일·설정 휴무일을 역산합니다. 화면은 '관리상 최종일' 및 '법정 제출기한 아님'을 표시하고 공휴일 자료가 없으면 확인 필요를 붙입니다." },
    ],
  },
  {
    id: "linked-form-navigation",
    category: "forms",
    matches: (q) => and(q, /(?:업무|일정|상세|그\s*화면)/u, /(?:점검표|서식|합동점검)/u, /(?:바로|이동|열|자동작성|작성\s*화면)/u),
    lines: [
      "일정·업무관리에서 해당 업무를 연 뒤 '이번에 해야 할 일' 옆의 '서식 자동작성'을 누르세요.",
      "연결된 서식이 열리며 학교명·점검일·담당자 등이 전달되고, 기존 업무 상세 창은 닫힙니다.",
    ],
    references: [
      { label: "일정·업무관리 · 서식 자동작성", excerpt: "업무 상세의 세부업무 옆에 연결 서식 자동작성 버튼을 배치합니다. 누르면 선택한 서식과 일정 데이터를 대표서식 자동화로 보내고 업무 상세 오버레이를 닫습니다." },
    ],
  },
  {
    id: "form-save-not-complete",
    category: "forms",
    matches: (q, previous) => and(q, /(?:서식|점검표|그\s*화면)/u, /저장/u, /(?:일정|업무)/u, /(?:완료|자동)/u)
      || (!!previous?.subjects?.includes("linked-form-navigation") && and(q, /그\s*화면/u, /저장/u, /완료/u)),
    lines: [
      "연결된 점검표를 저장하면 저장 문서가 해당 일정의 이력에 연결됩니다. 일정이 자동으로 완료되지는 않습니다.",
      "실제 업무를 마친 뒤 '일정·업무관리'에서 해당 업무를 열어 '업무 완료'를 별도로 누르세요.",
    ],
    references: [
      { label: "대표서식 자동화 · 일정 연계", excerpt: "서식 저장 시 부모 화면에 safety:form-saved 메시지를 보내고 일정의 linkedFormDocuments 이력에 문서를 추가합니다. completedByUser 값은 바꾸지 않습니다. 업무 상세에는 별도의 업무 완료 버튼이 있습니다." },
    ],
  },
  {
    id: "schedule-request",
    category: "inspection",
    matches: (q) => and(q, /일정/u, /(?:넣어|등록해|추가해|잡아|만들어)/u, /(?:정기점검|점검|위험성평가|교육|업무)/u),
    lines: [
      "챗봇의 '관련된 업무의 일정을 등록하시겠습니까?'에서 '예'를 누르면 일정·업무관리의 업무 등록 화면으로 이동합니다.",
      "AI가 선택한 '상황 등록' 또는 '일정 추가' 화면에서 업무명·날짜·대상 등 필요한 내용을 확인하고 저장하세요. 지금 질문만으로 일정이 저장되지는 않습니다.",
    ],
    references: [
      { label: "AI 업무지원 챗봇 · 업무 등록 연결", excerpt: "챗봇은 관련 일정 등록 제안을 수락하면 일정·업무관리의 업무 등록으로 이동해 질문에 맞는 상황 등록 또는 일정 추가 입력 화면을 엽니다. 사용자가 내용을 확인하고 저장해야 등록됩니다." },
    ],
  },
];

/** Return an application-grounded answer only for a recognized UI/workflow question. */
export function searchAppHelp(question: string, previous?: ConversationContext): SearchResponse | null {
  const normalized = question.trim().replace(/\s+/gu, " ");
  if (!normalized) return null;
  const topic = TOPICS.find((entry) => entry.matches(normalized, previous));
  if (!topic) return null;
  const evidence: Evidence[] = topic.references.map((reference) => ({
    pdfPage: 0,
    referenceLabel: reference.label,
    section: reference.label,
    excerpt: reference.excerpt,
    sourceTitle: SOURCE_TITLE,
    sourcePublisher: "로컬 프로그램",
    sourceDate: SOURCE_DATE,
  }));
  return {
    status: "found",
    message: topic.lines.map((line, index) => `- ${line} [근거 ${Math.min(index + 1, evidence.length)}]`).join("\n"),
    keyPoints: [],
    sourceTitle: SOURCE_TITLE,
    sourceDate: SOURCE_DATE,
    evidence,
    answerMode: "search",
    context: { question: normalized, category: topic.category, evidenceSections: evidence.map((item) => item.section), subjects: [topic.id], intent: "procedure" },
  };
}

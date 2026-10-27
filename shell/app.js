/* Runtime: app.js */
/* =========================================================

   DATA / INITIAL SAMPLE DATA

   법적 의무를 확정하지 않는 시제품 예시 데이터만 포함한다.

========================================================= */

const APP_VERSION='6.0.0', MASTER_DATA_VERSION='2026-10-19-v3', DB_NAME='SafetyWorkNavigator', STORE_KEY='appData';

const COLLECTIONS=['taskMaster','tasks','triggerEvents','officialEvents','personalEvents','taskChecklist','taskHistory','appSettings'];

const uuid=()=>crypto.randomUUID?crypto.randomUUID():'id-'+Date.now()+'-'+Math.random().toString(16).slice(2);

const isoDate=(d=new Date())=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};

const addDays=(date,n)=>{const d=new Date(date+'T00:00:00');d.setDate(d.getDate()+Number(n||0));return isoDate(d)};

const sampleMasters=()=>[

  {taskCode:'SAMPLE-EDU',taskName:'안전보건교육 (예시)',category:'교육',taskType:'정기',description:'시제품 예시 업무입니다. 실제 대상·주기·기한은 공식 근거 확인 후 수정하세요.',responsible:'학교 업무담당자',supporter:'',target:'해당 여부 확인',triggerType:'new_employee',recurrenceType:'custom',recurrenceInterval:'',baseDateType:'event_date',dueOffsetDays:'',alertDays:'7',checklistItems:['대상자 확인','일정 확인','필요한 자료 준비','교육 실시','결과 확인'],relatedForms:'관련 서식 확인 필요',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:true,version:'1.0',memo:'시제품 예시 데이터'},

  {taskCode:'SAMPLE-INSPECT',taskName:'정기점검 (예시)',category:'점검',taskType:'정기',description:'점검 일정과 후속조치를 관리하기 위한 예시입니다.',responsible:'학교 업무담당자',supporter:'',target:'해당 시설',triggerType:'',recurrenceType:'monthly',recurrenceInterval:'',baseDateType:'month_start',dueOffsetDays:'',alertDays:'7',checklistItems:['점검 대상 확인','점검 일정 확정','점검 실시','후속조치 확인'],relatedForms:'점검표 확인 필요',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:true,version:'1.0',memo:'주기와 기한을 설정한 후 생성하세요.'},

  {taskCode:'SAMPLE-HEALTH',taskName:'건강검진 (예시)',category:'보건',taskType:'정기',description:'건강검진 관련 일정 관리 예시입니다.',responsible:'학교 업무담당자',supporter:'',target:'대상자 확인',triggerType:'',recurrenceType:'yearly',recurrenceInterval:'',baseDateType:'year_start',dueOffsetDays:'',alertDays:'14',checklistItems:['대상자 확인','기관·일정 확인','안내','실시 여부 확인'],relatedForms:'관련 서식 확인 필요',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:true,version:'1.0',memo:''},

  {taskCode:'SAMPLE-RISK',taskName:'위험성평가 (예시)',category:'평가',taskType:'정기',description:'위험성평가 업무 흐름 예시입니다.',responsible:'학교 업무담당자',supporter:'',target:'해당 여부 확인',triggerType:'job_change',recurrenceType:'custom',recurrenceInterval:'',baseDateType:'event_date',dueOffsetDays:'',alertDays:'7',checklistItems:['대상 작업 확인','참여자 확인','평가 실시','개선조치 확인'],relatedForms:'관련 서식 확인 필요',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:true,version:'1.0',memo:''},

  {taskCode:'SAMPLE-MUSCLE',taskName:'근골격계 관련 업무 (예시)',category:'보건',taskType:'정기',description:'근골격계 부담작업 관련 예시입니다.',responsible:'학교 업무담당자',supporter:'',target:'해당 여부 확인',triggerType:'job_change',recurrenceType:'custom',recurrenceInterval:'',baseDateType:'event_date',dueOffsetDays:'',alertDays:'7',checklistItems:['작업 내용 확인','적용 여부 확인','필요 조치 검토'],relatedForms:'관련 서식 확인 필요',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:false,version:'1.0',memo:''},

  {taskCode:'SAMPLE-CONTRACT',taskName:'도급·용역 안전보건 조치 검토 (예시)',category:'도급·용역',taskType:'사건',description:'계약 조건에 따라 적용 여부가 달라질 수 있습니다.',responsible:'학교 업무담당자',supporter:'',target:'공사·용역·도급',triggerType:'contract',recurrenceType:'',recurrenceInterval:'',baseDateType:'event_date',dueOffsetDays:'',alertDays:'7',checklistItems:['계약 내용 확인','적용 조건 공식 확인','필요 서류 확인','조치 이행 확인'],relatedForms:'계약·안전 관련 서식 확인',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:true,version:'1.0',memo:''},

  {taskCode:'SAMPLE-ACCIDENT',taskName:'산업재해 보고대상 여부 확인 필요',category:'산업재해',taskType:'사건',description:'사고 사실을 바탕으로 공식 기준에 따라 보고대상 여부를 확인하세요. 프로그램이 법적 판단을 확정하지 않습니다.',responsible:'학교 업무담당자',supporter:'',target:'사고 발생 건',triggerType:'accident',recurrenceType:'',recurrenceInterval:'',baseDateType:'event_date',dueOffsetDays:'',alertDays:'0',checklistItems:['사고 사실 확인','휴업 여부·일수 확인','공식 보고기준 확인','필요 조치 실시'],relatedForms:'산업재해 관련 공식 서식 확인',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:true,version:'1.0',memo:''},

  {taskCode:'SAMPLE-MSDS',taskName:'MSDS 관련 일정 안내 (예시)',category:'화학물질',taskType:'사건',description:'신규 화학제품 사용 전 확인할 업무를 안내하는 예시입니다. MSDS 세부관리 기능은 포함하지 않습니다.',responsible:'학교 업무담당자',supporter:'',target:'신규 화학제품',triggerType:'chemical_product',recurrenceType:'',recurrenceInterval:'',baseDateType:'event_date',dueOffsetDays:'',alertDays:'3',checklistItems:['제품 정보 확인','MSDS 확보 여부 확인','사용장소 안내사항 확인','필요 조치 확인'],relatedForms:'MSDS 공식 자료',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:true,version:'1.0',memo:''},

  {taskCode:'SAMPLE-FACILITY',taskName:'시설점검 후속조치',category:'시설점검',taskType:'사건',description:'시설점검 지적사항의 후속조치를 관리합니다.',responsible:'조치담당',supporter:'',target:'지적 시설',triggerType:'facility_issue',recurrenceType:'',recurrenceInterval:'',baseDateType:'event_date',dueOffsetDays:'',alertDays:'7',checklistItems:['지적내용 확인','조치계획 수립','조치 실시','결과 확인'],relatedForms:'점검 결과 자료',sourceType:'예시',sourceName:'공식 근거 확인 필요',sourceArticle:'',sourcePage:'',sourceDate:'',verificationStatus:'needs_review',active:true,version:'1.0',memo:''}

];

const legacyOfficialMasters=()=>[{"taskCode": "CHK-001", "taskName": "분야별 정기 안전·보건 자체점검 실시", "category": "점검", "taskType": "정기", "description": "급식·시설관리·청소 분야의 작업장 자체점검", "responsible": "학교 관리감독자·분야별 업무담당자", "supporter": "", "target": "SCHOOL_WORKPLACE", "triggerType": "", "recurrenceType": "weekly", "recurrenceInterval": "", "baseDateType": "week_start", "dueOffsetDays": "", "alertDays": "0", "checklistItems": ["작업장 확인", "분야별 점검표 확인", "현장 점검", "문제점 확인"], "relatedForms": "분야별 안전·보건 자체 점검표(01-02-01)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.16", "sourceDate": "2026-10-18", "verificationStatus": "confirmed", "active": true, "version": "2026-10-18", "memo": "교육청 관리기준으로 확인. 기관장 보고는 CHK-002 별도 업무. 구체 요일 근거 없음.", "procedure": "분야별 점검표로 작업장을 직접 점검한다.", "occurrenceCondition": "정기관리", "baseDateLabel": "대상 주", "scheduleRule": "대상 주마다 1회. 실시 요일은 담당자 입력. 직전 완료일+7일로 법정기한을 만들지 않음.", "recurrenceLabel": "주 1회", "alertPolicy": "D-30|D-14|D-7|D-3|D0", "conditionKey": "SCHOOL_WORKPLACE", "ruleCode": "PERIOD_WEEK", "ruleValue": "1", "prerequisiteCode": "", "automationPolicy": "입력일사용", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "교육청 관리기준으로 확인. 기관장 보고는 CHK-002 별도 업무. 구체 요일 근거 없음.", "applicability": "yes", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "CHK-002", "taskName": "자체점검 결과 기관장 보고", "category": "기관장 보고", "taskType": "정기", "description": "자체점검 결과와 개선조치 또는 계획을 학교장에게 보고", "responsible": "분야별 업무담당자 → 기관(학교)장", "supporter": "", "target": "SCHOOL_WORKPLACE", "triggerType": "", "recurrenceType": "monthly", "recurrenceInterval": "", "baseDateType": "month_start", "dueOffsetDays": "", "alertDays": "3,0", "checklistItems": ["해당 월 점검 확인", "문제점 확인", "개선조치 또는 계획 확인", "기관장 보고", "도급 순회점검 결과 기관장 보고"], "relatedForms": "분야별 안전·보건 자체 점검표(01-02-01)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.16", "sourceDate": "2026-10-18", "verificationStatus": "confirmed", "active": true, "version": "2026-10-18", "memo": "같은 장소의 도급점검을 함께 보고할 때 중복 보고를 만들지 않음(p.37). 전결만으로 학교장 보고를 생략하지 않도록 확인.", "procedure": "해당 월의 자체점검 결과를 기관장에게 보고한다.", "occurrenceCondition": "정기관리", "baseDateLabel": "대상 월", "scheduleRule": "대상 월마다 1회 기관장 보고. 구체 보고일은 담당자 입력.", "recurrenceLabel": "월 1회", "alertPolicy": "D-30|D-14|D-7|D-3|D0", "conditionKey": "SCHOOL_WORKPLACE", "ruleCode": "PERIOD_MONTH", "ruleValue": "1", "prerequisiteCode": "CHK-001", "automationPolicy": "입력일사용", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "CHK-001", "successors": "", "applicationConditions": "같은 장소의 도급점검을 함께 보고할 때 중복 보고를 만들지 않음(p.37). 전결만으로 학교장 보고를 생략하지 않도록 확인.", "applicability": "yes", "scheduleMode": "lastBusiness", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "EDU-001", "taskName": "현업근로자 정기 안전보건교육 실시", "category": "교육", "taskType": "정기", "description": "현업근로자의 정기 안전보건교육 실시", "responsible": "학교 교육업무담당자·관리감독자", "supporter": "", "target": "EDU_REGULAR_CONFIRMED", "triggerType": "", "recurrenceType": "halfyear", "recurrenceInterval": "", "baseDateType": "year_start", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["실제 업무 확인", "대상별 교육시간 확인", "교육방법 확인", "교육 실시", "이수 여부 확인", "안전보건교육 미이수자 확인"], "relatedForms": "안전보건교육일지(05-02-01)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제29조제1항(기획안 p.3 언급)", "sourcePage": "PDF p.44~45", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "인터뷰 3절에 영양교사·시설관리직 적용 이견. 당해 연도 교육계획 원문 미첨부. 12시간을 전 직원에게 일괄 적용 금지.", "procedure": "확인된 교육대상에게 해당 반기 교육을 실시한다.", "occurrenceCondition": "정기관리", "baseDateLabel": "대상 반기", "scheduleRule": "매뉴얼은 반기별 12시간 제시. 적용 직종·감면·교육기간 확인 전 자동 마감일 생성 보류.", "recurrenceLabel": "반기", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "EDU_REGULAR_CONFIRMED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "인터뷰 3절에 영양교사·시설관리직 적용 이견. 당해 연도 교육계획 원문 미첨부. 12시간을 전 직원에게 일괄 적용 금지.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "EDU-101", "taskName": "신규채용자 교육 대상 확인", "category": "교육", "taskType": "사건", "description": "채용자의 실제 업무와 고용형태를 확인하여 교육대상 판정", "responsible": "학교 채용·교육업무담당자", "supporter": "", "target": "HIRE_RECORDED", "triggerType": "new_employee", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["직종 확인", "실제 업무 확인", "고용형태·기간 확인", "교육면제 여부 확인", "대상 확정"], "relatedForms": "안전보건교육일지 참고", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.44~45", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "채용일·직종·업무내용 외 고용형태·계약기간·종전 교육이력 필요. 미입력은 비대상이 아닌 확인필요.", "procedure": "신규채용자의 교육대상 여부를 확인한다.", "occurrenceCondition": "신규채용", "baseDateLabel": "채용일", "scheduleRule": "신규채용 등록 시 확인할 일 생성. 대상판정 완료 전 교육시간·마감일 미확정.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "HIRE_RECORDED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "채용일·직종·업무내용 외 고용형태·계약기간·종전 교육이력 필요. 미입력은 비대상이 아닌 확인필요.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "EDU-102", "taskName": "신규채용자 안전보건교육 실시", "category": "교육", "taskType": "사건", "description": "교육대상으로 확인된 신규채용자에게 채용 시 교육 실시", "responsible": "학교 교육업무담당자·관리감독자", "supporter": "", "target": "HIRE_EDU_CONFIRMED", "triggerType": "new_employee", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["대상판정 확인", "교육시간 확인", "교육방법 확인", "교육 실시", "이수 확인"], "relatedForms": "안전보건교육일지(05-02-01)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제29조제2항(기획안 p.3 언급)", "sourcePage": "PDF p.44~45", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "p.44 표와 p.45 본문의 8시간 표현을 모든 채용자에게 통일 적용하지 않음. 채용일과 실제 작업 시작일 구분 필요.", "procedure": "신규채용자에게 적용 교육을 실시한다.", "occurrenceCondition": "신규채용", "baseDateLabel": "채용일", "scheduleRule": "채용 시 교육. 매뉴얼의 8·4·1시간 및 면제 구분 확인 전 자동기한 보류.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "HIRE_EDU_CONFIRMED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "EDU-101", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "EDU-101", "successors": "", "applicationConditions": "p.44 표와 p.45 본문의 8시간 표현을 모든 채용자에게 통일 적용하지 않음. 채용일과 실제 작업 시작일 구분 필요.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "EDU-201", "taskName": "작업내용 변경 시 안전보건교육 실시", "category": "교육", "taskType": "사건", "description": "변경된 작업에 필요한 안전보건교육", "responsible": "학교 교육업무담당자·관리감독자", "supporter": "", "target": "CHANGE_EDU_CONFIRMED", "triggerType": "job_change", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["기존 업무 확인", "변경 업무 확인", "교육대상 확인", "교육시간·내용 확인", "교육 실시"], "relatedForms": "자료에서 해당 서식 특정 불가", "sourceType": "개발 기획안(법조문 언급, 세부 원문 미첨부)", "sourceName": "학교_산업안전보건_AI_행정모델_기획안_보완_편집가능 (1).pdf p.3, 제29조제2항 언급", "sourceArticle": "산업안전보건법 제29조제2항(기획안 p.3 언급)", "sourcePage": "기획안 PDF p.3", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "매뉴얼 교육 장에는 변경교육의 세부 기준 없음. 신규채용 교육과 별도 코드. 법정 며칠 이내를 만들지 않음.", "procedure": "해당 작업내용 변경 교육을 실시한다.", "occurrenceCondition": "작업내용 변경", "baseDateLabel": "작업변경일", "scheduleRule": "변경 시 교육 의무는 기획안에 제시. 구체 대상·교육시간·실시시점은 검토 후 입력.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "CHANGE_EDU_CONFIRMED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "매뉴얼 교육 장에는 변경교육의 세부 기준 없음. 신규채용 교육과 별도 코드. 법정 며칠 이내를 만들지 않음.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "PPE-101", "taskName": "신규채용자 필요 안전보호구 지급", "category": "보호구", "taskType": "사건", "description": "작업 위험에 맞는 보호구를 필요한 근로자에게 지급", "responsible": "학교 보호구업무담당자·관리감독자", "supporter": "", "target": "PPE_NEEDED", "triggerType": "new_employee", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["작업 위험 확인", "필요 보호구 확인", "인증제품 확인", "보호구 지급", "착용 상태 확인", "안전보호구 선정·구입", "안전보호구 지급대장 작성"], "relatedForms": "안전보호구 지급 대장(03-01-01)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.21~22", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "신규채용 사건 연결은 시제품 설계이며 별도 채용 법정기한이 아님. 보호구 필요조건과 실제 작업시작일 추가 입력.", "procedure": "대상 작업에 맞는 안전보호구를 지급한다.", "occurrenceCondition": "신규채용", "baseDateLabel": "작업시작일", "scheduleRule": "매뉴얼은 유해·위험작업에 상시 지급·관리 제시. 채용일 기준 일수는 없음.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "PPE_NEEDED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "신규채용 사건 연결은 시제품 설계이며 별도 채용 법정기한이 아님. 보호구 필요조건과 실제 작업시작일 추가 입력.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ACC-101", "taskName": "산업재해 보고대상 여부 확인", "category": "산업재해", "taskType": "사건", "description": "발생보고 대상과 보고주체를 구분", "responsible": "학교 재해보고업무담당자·관리감독자", "supporter": "", "target": "ACC_RECORDED", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["고용관계 확인", "사고·질병 구분", "사망 여부 확인", "휴업일수 확인", "보고주체 확인"], "relatedForms": "산업재해조사표(06-02-01)", "sourceType": "시행규칙·교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제57조제3항; 시행규칙 제73조", "sourcePage": "PDF p.48~50", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "사고일·근로자 구분·휴업여부·휴업일수만으로 중대재해 여부를 모두 판단할 수 없음. 사망·동시 재해자 수·치료기간 등 추가 확인. 산재보험 신청 여부와 분리.", "procedure": "재해의 보고대상 여부를 확인한다.", "occurrenceCondition": "산업재해", "baseDateLabel": "사고발생일", "scheduleRule": "재해 등록 시 보고대상 확인할 일 생성. 사망·휴업·고용관계 불명확하면 확인필요 유지.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "ACC_RECORDED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "https://www.law.go.kr/법령/산업안전보건법시행규칙/제73조", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "사고일·근로자 구분·휴업여부·휴업일수만으로 중대재해 여부를 모두 판단할 수 없음. 사망·동시 재해자 수·치료기간 등 추가 확인. 산재보험 신청 여부와 분리.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "높음"}, {"taskCode": "ACC-102", "taskName": "산업재해조사표 관할 노동관서 제출", "category": "산업재해", "taskType": "사건", "description": "산업재해조사표를 관할 노동관서에 제출", "responsible": "보고의무 사업주(학교 처리담당자는 업무분장 확인)", "supporter": "", "target": "ACC_REPORT_SIMPLE", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["보고대상 확인", "발생일 확인", "조사표 내용 확인", "관할기관 확인", "제출 확인"], "relatedForms": "산업재해조사표(시행규칙 별지 제30호서식)", "sourceType": "시행규칙·교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제57조제3항; 시행규칙 제73조제1항", "sourcePage": "PDF p.48~49", "sourceDate": "2026-10-18", "verificationStatus": "confirmed", "active": true, "version": "2026-10-18", "memo": "학교 직접고용·사고성 재해·발생일 확정·사망 또는 3일 이상 휴업 필요·사업주 보고대상 확인 조건. 질병·수급인 소속·불명확 사례는 보류. 1개월은 30일이 아님.", "procedure": "확인된 사고성 산업재해의 조사표를 제출한다.", "occurrenceCondition": "산업재해", "baseDateLabel": "사고발생일", "scheduleRule": "보고대상 사고성 재해 발생일부터 1개월 이내 관할 지방고용노동관서 제출.", "recurrenceLabel": "없음", "alertPolicy": "D-30|D-14|D-7|D-3|D0", "conditionKey": "ACC_REPORT_SIMPLE", "ruleCode": "WITHIN_MONTHS", "ruleValue": "1", "prerequisiteCode": "ACC-101", "automationPolicy": "조건부", "sourceUrl": "https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1024053535", "legalVerification": "2026-10-19 국가법령정보센터 시행규칙 제73조제1항 확인 · 적용조건 별도 확인", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "ACC-101", "successors": "", "applicationConditions": "학교 직접고용·사고성 재해·발생일 확정·사망 또는 3일 이상 휴업 필요·사업주 보고대상 확인 조건. 질병·수급인 소속·불명확 사례는 보류. 1개월은 30일이 아님.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "높음"}, {"taskCode": "ACC-103", "taskName": "산업재해 재발방지계획 수립", "category": "산업재해", "taskType": "사건", "description": "사고경위·원인에 근거하여 재발방지계획 수립", "responsible": "학교 관리감독자·재해업무담당자", "supporter": "", "target": "ACC_PREVENTION_NEEDED", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["사고경위 확인", "직접 원인 확인", "관리상 원인 확인", "개선대책 수립", "실행계획 확인"], "relatedForms": "산업재해 재발방지 계획서(06-02-03)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.49", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "조사표 제출기한 1개월을 계획 수립의 별도 법정기한으로 복사하지 않음. 대책 이행은 후보표에 별도 행.", "procedure": "구체적인 산업재해 재발방지계획을 수립한다.", "occurrenceCondition": "산업재해", "baseDateLabel": "사고발생일", "scheduleRule": "재해 발생 후 재발방지계획 수립. 첨부자료에 숫자 기한 미제시.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "ACC_PREVENTION_NEEDED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "ACC-101", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "ACC-101", "successors": "ADD-013", "applicationConditions": "조사표 제출기한 1개월을 계획 수립의 별도 법정기한으로 복사하지 않음. 대책 이행은 후보표에 별도 행.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "높음"}, {"taskCode": "ACC-104", "taskName": "중대재해 발생 사실 노동관서 즉시 보고", "category": "산업재해", "taskType": "사건", "description": "중대재해 즉시 보고를 일반 조사표 제출과 분리", "responsible": "학교 관리감독자·재해보고업무담당자", "supporter": "", "target": "SERIOUS_ACC_CONFIRMED", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["중대재해 해당 확인", "사고개요 확인", "관할 노동관서 확인", "즉시 유선보고"], "relatedForms": "중대재해 보고(06-02-02)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제54조(매뉴얼 p.11 참조)", "sourcePage": "PDF p.48~49", "sourceDate": "2026-10-18", "verificationStatus": "confirmed", "active": true, "version": "2026-10-18", "memo": "매뉴얼상 즉시 보고 기준. 자동판정 금지. 중대재해처벌법의 중대산업재해 정의와 혼용 금지. ACC-101 확인절차가 긴급보고를 지연시키면 안 됨.", "procedure": "관할 노동관서에 중대재해 발생 사실을 즉시 보고한다.", "occurrenceCondition": "산업재해", "baseDateLabel": "중대재해 발생 인지시점", "scheduleRule": "중대재해 해당 확인 시 노동관서 즉시 유선보고. 정량 일수로 변환하지 않음.", "recurrenceLabel": "없음", "alertPolicy": "사건 등록 즉시 표시", "conditionKey": "SERIOUS_ACC_CONFIRMED", "ruleCode": "IMMEDIATE", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "조건부", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "매뉴얼상 즉시 보고 기준. 자동판정 금지. 중대재해처벌법의 중대산업재해 정의와 혼용 금지. ACC-101 확인절차가 긴급보고를 지연시키면 안 됨.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "높음"}, {"taskCode": "RSK-001", "taskName": "정기 위험성평가 실시", "category": "위험성평가", "taskType": "정기", "description": "유해·위험요인에 대한 정기평가 실시", "responsible": "학교 관리감독자·업무담당자, 근로자 참여", "supporter": "", "target": "RSK_REGULAR_APPLIES", "triggerType": "", "recurrenceType": "yearly", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["평가대상 확인", "근로자 참여", "유해·위험요인 파악", "위험성 결정", "평가결과 확인", "위험성평가 근로자 의견 청취", "위험성 감소대책 수립", "외부 위험성평가 결과 현장 일치 여부 확인", "실시규정·판단기준 수립 및 근로자 의견 청취", "위험성평가 결과 공유·교육 확인", "결과 및 조치사항 3년 보존 (매뉴얼 p.53~56)"], "relatedForms": "위험성평가표(08-01-02)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제36조(매뉴얼 p.11)", "sourcePage": "PDF p.53~54", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "수시평가일로 정기평가 기준일을 자동 변경하지 않음. 현행 지침 본문 검증 미완료. 위탁하더라도 학교의 관리·감독 및 개선 의무 유지.", "procedure": "학교 전 공정의 위험성평가를 실시한다.", "occurrenceCondition": "정기관리", "baseDateLabel": "직전 최초·정기 위험성평가 실시일", "scheduleRule": "매뉴얼은 매년 1회, 최초·정기평가 후 1년 이전 실시. 현행 지침 및 평가방식 확인 전 계산 보류.", "recurrenceLabel": "연 1회", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "RSK_REGULAR_APPLIES", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-019,ADD-020", "applicationConditions": "수시평가일로 정기평가 기준일을 자동 변경하지 않음. 현행 지침 본문 검증 미완료. 위탁하더라도 학교의 관리·감독 및 개선 의무 유지.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "RSK-201", "taskName": "작업내용 변경에 따른 수시 위험성평가 실시", "category": "위험성평가", "taskType": "사건", "description": "설비·작업방법·절차 등 변경에 따른 수시평가", "responsible": "학교 관리감독자·업무담당자, 근로자 참여", "supporter": "", "target": "RSK_CHANGE_APPLIES", "triggerType": "job_change", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["변경사항 확인", "해당 공정 확인", "적용조건 확인", "근로자 참여", "수시평가 실시", "실시규정·판단기준 수립 및 근로자 의견 청취", "위험성평가 결과 공유·교육 확인", "결과 및 조치사항 3년 보존 (매뉴얼 p.53~56)"], "relatedForms": "위험성평가표(08-01-02)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.54", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "1개월을 작업 개시 이후 유예기간으로 해석하지 않음. 변경일과 작업개시일을 별도 입력.", "procedure": "변경 작업의 위험성평가를 실시한다.", "occurrenceCondition": "작업내용 변경", "baseDateLabel": "변경 작업 개시일", "scheduleRule": "매뉴얼에 작업 개시 전과 1개월 이내가 함께 표시되어 산정기준 검토필요.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "RSK_CHANGE_APPLIES", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-019,ADD-020", "applicationConditions": "1개월을 작업 개시 이후 유예기간으로 해석하지 않음. 변경일과 작업개시일을 별도 입력.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "RSK-301", "taskName": "산업재해 후 수시 위험성평가 실시", "category": "위험성평가", "taskType": "사건", "description": "재해가 발생한 작업의 유해·위험요인을 다시 평가", "responsible": "학교 관리감독자·업무담당자, 근로자 참여", "supporter": "", "target": "RSK_ACC_APPLIES", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["재해유형 확인", "재개일 확인", "해당 공정 확인", "근로자 참여", "수시평가 실시", "실시규정·판단기준 수립 및 근로자 의견 청취", "위험성평가 결과 공유·교육 확인", "결과 및 조치사항 3년 보존 (매뉴얼 p.53~56)"], "relatedForms": "위험성평가표(08-01-02)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.49,54", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "근골격계 업무상질병은 매뉴얼에서 수시 유해요인조사로 구분. 산업재해 발생일 하나만으로 재개 전 기한 계산 불가.", "procedure": "재해 발생 작업의 수시 위험성평가를 실시한다.", "occurrenceCondition": "산업재해", "baseDateLabel": "재해 작업 재개일", "scheduleRule": "매뉴얼상 작업 재개 전과 1개월 이내 병기. 일괄 사고일+1개월 계산 금지.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "RSK_ACC_APPLIES", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "ACC-101", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "ACC-101", "successors": "ADD-019,ADD-020", "applicationConditions": "근골격계 업무상질병은 매뉴얼에서 수시 유해요인조사로 구분. 산업재해 발생일 하나만으로 재개 전 기한 계산 불가.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "MSK-001", "taskName": "정기 근골격계부담작업 유해요인조사 실시", "category": "근골격계", "taskType": "정기", "description": "부담작업 공정의 작업상황·조건·증상을 조사", "responsible": "학교 관리감독자·업무담당자, 해당 근로자 참여", "supporter": "", "target": "MSK_BURDEN_CONFIRMED", "triggerType": "", "recurrenceType": "yearly", "recurrenceInterval": 3, "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["부담작업 여부 확인", "직전 정기조사일 확인", "근로자 참여", "작업상황·조건 조사", "증상 확인", "근골격계부담작업 해당 여부 확인", "근골격계 작업환경 개선계획 수립", "근로자 면담·증상조사 및 개선계획 수립", "결과 교육·게시 및 기록 5년 보존 (매뉴얼 p.57~59)"], "relatedForms": "근골격계부담작업 체크리스트; 유해요인조사표; 증상조사표", "sourceType": "안전보건규칙·교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건기준에 관한 규칙 제657조제1항", "sourcePage": "PDF p.57~58", "sourceDate": "2026-10-18", "verificationStatus": "confirmed", "active": true, "version": "2026-10-18", "memo": "신설기관 최초조사는 1년 이내로 별도. 수시조사일로 정기 기준일을 자동 변경하지 않음. 개선계획은 후보표 별도 행.", "procedure": "대상 공정의 정기 유해요인조사를 실시한다.", "occurrenceCondition": "정기관리", "baseDateLabel": "직전 최초·정기 유해요인조사 실시일", "scheduleRule": "근골격계부담작업 대상 공정은 직전 최초·정기조사 후 3년 이내 정기조사.", "recurrenceLabel": "3년", "alertPolicy": "D-30|D-14|D-7|D-3|D0", "conditionKey": "MSK_BURDEN_CONFIRMED", "ruleCode": "WITHIN_YEARS", "ruleValue": "3", "prerequisiteCode": "", "automationPolicy": "조건부", "sourceUrl": "https://www.law.go.kr/법령/산업안전보건기준에관한규칙/제657조", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-024,ADD-025", "applicationConditions": "신설기관 최초조사는 1년 이내로 별도. 수시조사일로 정기 기준일을 자동 변경하지 않음. 개선계획은 후보표 별도 행.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "HLT-001", "taskName": "비사무직 일반건강진단 수검 확인", "category": "건강검진", "taskType": "정기", "description": "비사무직 대상자의 일반건강진단 수검 누락 확인", "responsible": "학교 건강검진업무담당자·해당 근로자", "supporter": "", "target": "HLT_NONOFFICE_CONFIRMED", "triggerType": "", "recurrenceType": "yearly", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["통지 대상자 확인", "실제 업무 구분", "수검기간 확인", "수검 여부 확인", "미수검 사유 확인", "일반건강진단 대상자 확인", "미수검자 수검 안내"], "relatedForms": "국민건강보험공단 검진 대상자 통지", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.51", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "직전 수검일+365일로 계산하지 않음. 사무직 2년 주기는 별도 후보. 개인정보·검진결과 파일 저장은 이번 원장 제외.", "procedure": "통지된 비사무직 대상자의 수검 여부를 확인한다.", "occurrenceCondition": "정기관리", "baseDateLabel": "공단 통지 수검 대상기간", "scheduleRule": "비사무직 연 1회. 대상자 통지와 수검기간을 확인한 후 기한 입력.", "recurrenceLabel": "연 1회", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "HLT_NONOFFICE_CONFIRMED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-027", "applicationConditions": "직전 수검일+365일로 계산하지 않음. 사무직 2년 주기는 별도 후보. 개인정보·검진결과 파일 저장은 이번 원장 제외.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "CNT-101", "taskName": "공사·도급 안전보건 적용업무 확인", "category": "도급·용역", "taskType": "사건", "description": "발주자·도급인 지위와 작업조건을 확인하여 업무 분기", "responsible": "학교 계약·공사업무담당자·관리감독자", "supporter": "", "target": "CONTRACT_RECORDED", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["법적 지위 확인", "작업내용 확인", "금액·기간 확인", "수급인 근로자 확인", "적용업무 구분", "수급업체 안전보건 체크리스트 확인"], "relatedForms": "공사(용역) 안전·보건 체크리스트(공통)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.23~41", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "계약일·착수일은 대체 가능한 동일 기준일이 아님. 발주자 공사에는 용역 협의체·점검을 자동 일괄 생성하지 않음. 해당 공사의 기술지도·대장 등은 후보표에 남김.", "procedure": "해당 공사·도급에 적용할 안전보건 업무를 확인한다.", "occurrenceCondition": "공사·도급 시작", "baseDateLabel": "계약예정일", "scheduleRule": "공고·계약 전 적용업무 확인이 필요한 절차. 실제 계약·착수 후 입력이면 사전업무 누락 여부 확인.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "CONTRACT_RECORDED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "계약일·착수일은 대체 가능한 동일 기준일이 아님. 발주자 공사에는 용역 협의체·점검을 자동 일괄 생성하지 않음. 해당 공사의 기술지도·대장 등은 후보표에 남김.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "CNT-001", "taskName": "안전보건협의체 회의 개최", "category": "도급·용역", "taskType": "정기", "description": "도급인·수급인 전원의 안전보건협의체 회의", "responsible": "학교장·수급업체별 대표(대리 가능 여부 확인)", "supporter": "", "target": "CNT_COUNCIL_CONFIRMED", "triggerType": "contract", "recurrenceType": "monthly", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "3,0", "checklistItems": ["적용여부 확인", "구성원 확인", "작업 시작·연락방법 확인", "위험성평가·대피 안건 확인", "회의 개최"], "relatedForms": "안전보건협의체 회의록 및 합동점검", "sourceType": "시행규칙·교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제64조제1항제1호; 시행규칙 제79조", "sourcePage": "PDF p.35~36", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "p.35의 30일 이내·연60일 이하 제외와 시행규칙 제79조의 월1회 규정을 함께 검토. 시행규칙 조문만으로 제외범위 확정 불가. 서식번호 p.36과 p.38 불일치.", "procedure": "안전보건협의체 회의를 개최한다.", "occurrenceCondition": "공사·도급 시작", "baseDateLabel": "용역 수행기간 중 대상 월", "scheduleRule": "협의체 적용 도급관계에 월 1회 이상. 매뉴얼의 일시·간헐작업 제외 적용 확인 후 입력.", "recurrenceLabel": "월 1회 이상", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "CNT_COUNCIL_CONFIRMED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "CNT-101", "automationPolicy": "불가", "sourceUrl": "https://www.law.go.kr/법령/산업안전보건법시행규칙/제79조", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "CNT-101", "successors": "", "applicationConditions": "p.35의 30일 이내·연60일 이하 제외와 시행규칙 제79조의 월1회 규정을 함께 검토. 시행규칙 조문만으로 제외범위 확정 불가. 서식번호 p.36과 p.38 불일치.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "CNT-002", "taskName": "도급 작업장 순회점검 실시", "category": "도급·용역", "taskType": "정기", "description": "수급인 근로자의 작업공간을 순회점검", "responsible": "도급인 학교의 실무자 또는 업무 지정자", "supporter": "", "target": "CNT_WEEKLY_CONFIRMED", "triggerType": "contract", "recurrenceType": "weekly", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "0", "checklistItems": ["도급인 지위 확인", "적용 업종 확인", "작업공간 확인", "안전장치·보호구 점검", "문제점 확인"], "relatedForms": "분야별 안전·보건 자체 점검표(01-02-01)", "sourceType": "시행규칙·교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제64조제1항제2호; 시행규칙 제80조제1항제2호", "sourcePage": "PDF p.37,41", "sourceDate": "2026-10-18", "verificationStatus": "confirmed", "active": true, "version": "2026-10-18", "memo": "시행규칙 제80조제1항제2호 적용을 확인한 용역에 한정. 건설업 등은 2일1회이므로 본 행 적용 제외. 같은 공간의 자체점검으로 대체 시 중복일정 방지(p.37).", "procedure": "수급인 근로자가 근무하는 작업장을 점검한다.", "occurrenceCondition": "공사·도급 시작", "baseDateLabel": "용역 수행기간 중 대상 주", "scheduleRule": "주 1회 적용 사업의 용역 수행기간에 1주일 1회 이상. 구체 요일 입력.", "recurrenceLabel": "주 1회 이상", "alertPolicy": "D-30|D-14|D-7|D-3|D0", "conditionKey": "CNT_WEEKLY_CONFIRMED", "ruleCode": "PERIOD_WEEK", "ruleValue": "1", "prerequisiteCode": "CNT-101", "automationPolicy": "입력일사용", "sourceUrl": "https://www.law.go.kr/법령/산업안전보건법시행규칙/제80조", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "CNT-101", "successors": "", "applicationConditions": "시행규칙 제80조제1항제2호 적용을 확인한 용역에 한정. 건설업 등은 2일1회이므로 본 행 적용 제외. 같은 공간의 자체점검으로 대체 시 중복일정 방지(p.37).", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "CNT-003", "taskName": "도급 합동 안전·보건점검 실시", "category": "도급·용역", "taskType": "정기", "description": "도급인·수급인·근로자가 함께 작업장 점검", "responsible": "학교·수급업체 대표 및 각 소속 근로자", "supporter": "", "target": "CNT_QUARTERLY_CONFIRMED", "triggerType": "contract", "recurrenceType": "quarterly", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "7,3", "checklistItems": ["적용 업종 확인", "점검반 구성 확인", "수급인 근로자 참여 확인", "작업장 합동점검", "문제점 확인"], "relatedForms": "안전보건협의체 회의록 및 합동점검", "sourceType": "시행규칙·교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제64조제2항; 시행규칙 제82조", "sourcePage": "PDF p.38,41", "sourceDate": "2026-10-18", "verificationStatus": "confirmed", "active": true, "version": "2026-10-18", "memo": "시행규칙 제82조제2항제2호 적용 사업만 사용. 건설업·선박 및 보트 건조업의 2개월1회와 구분. 직전 점검일+90일로 변환 금지. 서식번호는 확인 전 생략.", "procedure": "점검반을 구성해 합동 안전·보건점검을 실시한다.", "occurrenceCondition": "공사·도급 시작", "baseDateLabel": "용역 수행기간 중 대상 분기", "scheduleRule": "분기 1회 적용 사업의 용역 수행기간에 분기 1회 이상. 구체 점검일 입력.", "recurrenceLabel": "분기 1회 이상", "alertPolicy": "D-30|D-14|D-7|D-3|D0", "conditionKey": "CNT_QUARTERLY_CONFIRMED", "ruleCode": "PERIOD_QUARTER", "ruleValue": "1", "prerequisiteCode": "CNT-101", "automationPolicy": "입력일사용", "sourceUrl": "https://www.law.go.kr/법령/산업안전보건법시행규칙/제82조", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "CNT-101", "successors": "", "applicationConditions": "시행규칙 제82조제2항제2호 적용 사업만 사용. 건설업·선박 및 보트 건조업의 2개월1회와 구분. 직전 점검일+90일로 변환 금지. 서식번호는 확인 전 생략.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "MSD-101", "taskName": "신규 화학제품 MSDS 대상 여부 확인", "category": "MSDS", "taskType": "사건", "description": "제품의 실제 용도와 규제·제외 여부 확인", "responsible": "학교 화학제품 사용·관리담당자", "supporter": "", "target": "PRODUCT_RECORDED", "triggerType": "chemical_product", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["제품·제조사 확인", "용도 확인", "구성성분 확인", "제외대상 여부 확인", "대상 확정", "공급처·제조사로부터 MSDS 확보", "MSDS 3번 구성성분·15번 규제현황 확인"], "relatedForms": "제품별 물질안전보건자료 참고", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.61~63", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "제품명·사용시작일 외 제조사·실제 용도·성분 등 필요. 일반 생활용품과 과학실 별도 관리체계 검토. 원문 파일 저장은 제외.", "procedure": "신규 제품의 MSDS 대상 여부를 확인한다.", "occurrenceCondition": "신규 화학제품 사용", "baseDateLabel": "사용시작일", "scheduleRule": "제품 사용 등록 시 MSDS 대상 확인할 일 생성. 대상 불명확하면 후속업무는 확인필요.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "PRODUCT_RECORDED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "제품명·사용시작일 외 제조사·실제 용도·성분 등 필요. 일반 생활용품과 과학실 별도 관리체계 검토. 원문 파일 저장은 제외.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "MSD-102", "taskName": "신규 화학제품 MSDS 현장 게시·비치", "category": "MSDS", "taskType": "사건", "description": "취급 근로자가 MSDS를 쉽게 확인할 수 있게 현장 비치", "responsible": "학교 화학제품 사용·관리담당자", "supporter": "", "target": "MSDS_APPLIES", "triggerType": "chemical_product", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["대상제품 확인", "제품과 자료 일치 확인", "취급장소 확인", "접근성 확인", "게시·비치 확인"], "relatedForms": "제품별 물질안전보건자료", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제114조제1항(기획안 p.3)", "sourcePage": "PDF p.62,64", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "상시 유지 의무를 신규제품 최초 작업에 연결. D-1 등 임의 법정기한 생성 금지. 게시와 비치는 선택 수단이므로 한 행.", "procedure": "대상 제품 MSDS를 취급 장소에 게시하거나 비치한다.", "occurrenceCondition": "신규 화학제품 사용", "baseDateLabel": "사용시작일", "scheduleRule": "매뉴얼은 취급장소에 상시 게시 또는 비치. 사용시작일 기준 별도 숫자 기한 미제시.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "MSDS_APPLIES", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "MSD-101", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "MSD-101", "successors": "", "applicationConditions": "상시 유지 의무를 신규제품 최초 작업에 연결. D-1 등 임의 법정기한 생성 금지. 게시와 비치는 선택 수단이므로 한 행.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "MSD-103", "taskName": "신규 화학제품 용기 경고표시 부착", "category": "MSDS", "taskType": "사건", "description": "용기에 제품 위험정보를 표시", "responsible": "학교 화학제품 사용·관리담당자", "supporter": "", "target": "LABEL_NEEDED", "triggerType": "chemical_product", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["대상용기 확인", "제품 일치 확인", "경고표시 내용 확인", "표시 부착", "식별 가능 여부 확인"], "relatedForms": "물질안전보건자료 경고표시(소분용기용)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제115조(기획안 p.3)", "sourcePage": "PDF p.64~65", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "제품 사용시작일과 소분용기 생성·사용일이 다르면 별도 사건 필요. 표지 예외 등 적용조건 검토.", "procedure": "대상 용기에 경고표시를 부착한다.", "occurrenceCondition": "신규 화학제품 사용", "baseDateLabel": "해당 용기 사용시작일", "scheduleRule": "대상 화학물질 용기·소분용기에 상시 경고표시. 구체 일수 기한 없음.", "recurrenceLabel": "없음", "alertPolicy": "기한 미확정: 확인필요 목록 표시", "conditionKey": "LABEL_NEEDED", "ruleCode": "HOLD", "ruleValue": "", "prerequisiteCode": "MSD-101", "automationPolicy": "불가", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "MSD-101", "successors": "", "applicationConditions": "제품 사용시작일과 소분용기 생성·사용일이 다르면 별도 사건 필요. 표지 예외 등 적용조건 검토.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "MSD-104", "taskName": "신규 화학제품 취급자 MSDS 교육 실시", "category": "MSDS", "taskType": "사건", "description": "새 화학제품의 유해성·취급주의·보호구·응급조치 교육", "responsible": "학교 교육업무담당자·해당 물질 취급근로자", "supporter": "", "target": "MSDS_EDU_CONFIRMED", "triggerType": "chemical_product", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": 0, "alertDays": "30,14,7", "checklistItems": ["물질·취급자 확인", "교육내용 확인", "교육방법 확인", "교육 실시", "이수 확인"], "relatedForms": "안전보건교육일지(MSDS교육, 10-01-04)", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "산업안전보건법 제114조제3항(기획안 p.3)", "sourcePage": "PDF p.64~65", "sourceDate": "2026-10-18", "verificationStatus": "confirmed", "active": true, "version": "2026-10-18", "memo": "MSDS 대상·신규물질 취급 조건이 확정된 경우만 사용. 물질별1회를 영구 교육면제로 해석하지 않음. 변경·전보 교육은 별도 후보.", "procedure": "신규 화학제품 취급자에게 MSDS 교육을 실시한다.", "occurrenceCondition": "신규 화학제품 사용", "baseDateLabel": "사용시작일", "scheduleRule": "매뉴얼에 새로운 화학물질 추가 시 해당 물질 교육 명시. 구체 실시일 입력, 고정 일수 계산 없음.", "recurrenceLabel": "없음", "alertPolicy": "D-30|D-14|D-7|D-3|D0", "conditionKey": "MSDS_EDU_CONFIRMED", "ruleCode": "AT_EVENT", "ruleValue": "", "prerequisiteCode": "MSD-101", "automationPolicy": "입력일사용", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "MSD-101", "successors": "", "applicationConditions": "MSDS 대상·신규물질 취급 조건이 확정된 경우만 사용. 물질별1회를 영구 교육면제로 해석하지 않음. 변경·전보 교육은 별도 후보.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "DOC-001", "taskName": "안전보건 의무이행 점검결과 제출", "category": "공문형", "taskType": "공문", "description": "반기 점검의 결과를 교육청 공문에 따라 제출", "responsible": "학교 의무이행점검 업무담당자", "supporter": "", "target": "DOC_REQUEST_CONFIRMED", "triggerType": "official_document", "recurrenceType": "", "recurrenceInterval": "", "baseDateType": "event_date", "dueOffsetDays": "", "alertDays": "30,14,7", "checklistItems": ["공문 대상 확인", "제출기한 확인", "점검결과 확인", "제출항목 확인", "제출 확인"], "relatedForms": "안전보건 관계 법령상 의무 이행사항 점검표", "sourceType": "교육청 공식 매뉴얼", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourcePage": "PDF p.71~72", "sourceDate": "2026-10-18", "verificationStatus": "needs_review", "active": true, "version": "2026-10-18", "memo": "현재 공문 원문 미첨부. 시행일·수신기관·제출기한 확인 필요. 반기 점검 자체와 결과 제출은 별도 업무.", "procedure": "해당 공문의 안전보건 의무이행 점검결과를 제출한다.", "occurrenceCondition": "공문 접수", "baseDateLabel": "공문 제출기한", "scheduleRule": "별도 안내 공문의 제출기한을 그대로 입력. 미입력 시 마감일 없음.", "recurrenceLabel": "없음", "alertPolicy": "D-30|D-14|D-7|D-3|D0", "conditionKey": "DOC_REQUEST_CONFIRMED", "ruleCode": "INPUT_DATE", "ruleValue": "", "prerequisiteCode": "", "automationPolicy": "입력일사용", "sourceUrl": "", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicationConditions": "현재 공문 원문 미첨부. 시행일·수신기관·제출기한 확인 필요. 반기 점검 자체와 결과 제출은 별도 업무.", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-001", "taskName": "작업 전 일상 안전점검 실시", "category": "점검", "taskType": "사건", "description": "작업별 안전수칙과 실제 작업 시작시점 필요", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "facility_issue", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.15", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "작업별 안전수칙과 실제 작업 시작시점 필요", "실시 및 결과 확인", "기록 보관"], "memo": "작업별 안전수칙과 실제 작업 시작시점 필요", "applicationConditions": "작업별 안전수칙과 실제 작업 시작시점 필요", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-002", "taskName": "점검 지적사항 개선계획 수립", "category": "점검", "taskType": "사건", "description": "즉시 개선이 어려운 지적에 대한 후속업무", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "facility_issue", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.16", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "즉시 개선이 어려운 지적에 대한 후속업무", "실시 및 결과 확인", "기록 보관"], "memo": "즉시 개선이 어려운 지적에 대한 후속업무", "applicationConditions": "즉시 개선이 어려운 지적에 대한 후속업무", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-003", "taskName": "점검 지적사항 개선조치 실시", "category": "점검", "taskType": "사건", "description": "즉시 개선 또는 개선계획에 따른 일정", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "facility_issue", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.16", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "즉시 개선 또는 개선계획에 따른 일정", "실시 및 결과 확인", "기록 보관"], "memo": "즉시 개선 또는 개선계획에 따른 일정", "applicationConditions": "즉시 개선 또는 개선계획에 따른 일정", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-004", "taskName": "외부기관 점검 지적사항 개선 여부 확인", "category": "점검", "taskType": "사건", "description": "외부 점검결과 및 지적별 요구기한 원문 필요", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "facility_issue", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.53", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "외부 점검결과 및 지적별 요구기한 원문 필요", "실시 및 결과 확인", "기록 보관"], "memo": "외부 점검결과 및 지적별 요구기한 원문 필요", "applicationConditions": "외부 점검결과 및 지적별 요구기한 원문 필요", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-005", "taskName": "보류 지적사항 재점검 실시", "category": "점검", "taskType": "상시", "description": "담당자 지정 다음 확인일. 법정 반복주기 없음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "매뉴얼 직접 근거 없음 · 법령 검증 필요", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "담당자 지정 다음 확인일. 법정 반복주기 없음", "실시 및 결과 확인", "기록 보관"], "memo": "담당자 지정 다음 확인일. 법정 반복주기 없음", "applicationConditions": "담당자 지정 다음 확인일. 법정 반복주기 없음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-006", "taskName": "법령 요지 게시 내용 갱신", "category": "기타", "taskType": "사건", "description": "법령·규정 변경 시", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.12,17", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "법령·규정 변경 시", "실시 및 결과 확인", "기록 보관"], "memo": "법령·규정 변경 시", "applicationConditions": "법령·규정 변경 시", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-007", "taskName": "안전보건표지 부착", "category": "기타", "taskType": "사건", "description": "신규 위험요인 또는 표지 파손 시", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.12,18~19", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "신규 위험요인 또는 표지 파손 시", "실시 및 결과 확인", "기록 보관"], "memo": "신규 위험요인 또는 표지 파손 시", "applicationConditions": "신규 위험요인 또는 표지 파손 시", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-008", "taskName": "위험작업 전 안전사항 확인", "category": "보호구", "taskType": "사건", "description": "위험작업 관리대장·안전수칙 참조", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.22", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "위험작업 관리대장·안전수칙 참조", "실시 및 결과 확인", "기록 보관", "위험작업 관리대장 작성·편철", "위험작업 안전수칙 현장 게시"], "memo": "위험작업 관리대장·안전수칙 참조", "applicationConditions": "위험작업 관리대장·안전수칙 참조", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "EDU-002", "taskName": "관리감독자 정기교육 이수", "category": "교육", "taskType": "정기", "description": "연 16시간과 교육방법 제시. 연도별 교육계획 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "yearly", "recurrenceInterval": 1, "sourcePage": "PDF p.43", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "연 16시간과 교육방법 제시. 연도별 교육계획 확인", "실시 및 결과 확인", "기록 보관"], "memo": "연 16시간과 교육방법 제시. 연도별 교육계획 확인", "applicationConditions": "관리감독자 해당 여부·교육 감면 및 해당 연도 교육계획 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "EDU-301", "taskName": "특별교육 대상 확인 및 유해·위험작업 특별교육 실시", "category": "교육", "taskType": "사건", "description": "작업별 특별교육 적용범위·시간표 미첨부", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "매뉴얼 직접 근거 없음 · 산업안전보건법 제29조제3항·시행규칙 별표 확인 필요", "sourceName": "산업안전보건법 · 안전보건교육 기준 (법령 검증 필요)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "작업별 특별교육 적용범위·시간표 미첨부", "실시 및 결과 확인", "기록 보관"], "memo": "작업별 특별교육 적용범위·시간표 미첨부", "applicationConditions": "작업별 특별교육 적용범위·시간표 미첨부", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-011", "taskName": "산업재해조사표 보건안전진흥원 보고", "category": "산업재해", "taskType": "사건", "description": "노동관서 제출과 수신기관·행정근거가 다르므로 별도 후보", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.49", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "노동관서 제출과 수신기관·행정근거가 다르므로 별도 후보", "실시 및 결과 확인", "기록 보관"], "memo": "노동관서 제출과 수신기관·행정근거가 다르므로 별도 후보", "applicationConditions": "노동관서 제출과 수신기관·행정근거가 다르므로 별도 후보", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-012", "taskName": "중대재해 발생 사실 교육청 보고", "category": "산업재해", "taskType": "사건", "description": "교육지원청·본청 보고경로 확인. 노동관서 보고와 별도", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.49", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "교육지원청·본청 보고경로 확인. 노동관서 보고와 별도", "실시 및 결과 확인", "기록 보관"], "memo": "교육지원청·본청 보고경로 확인. 노동관서 보고와 별도", "applicationConditions": "교육지원청·본청 보고경로 확인. 노동관서 보고와 별도", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-013", "taskName": "산업재해 재발방지대책 이행", "category": "산업재해", "taskType": "사건", "description": "계획별 조치일을 사용. 일률적 법정일수 미제시", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.49", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "계획별 조치일을 사용. 일률적 법정일수 미제시", "실시 및 결과 확인", "기록 보관"], "memo": "계획별 조치일을 사용. 일률적 법정일수 미제시", "applicationConditions": "계획별 조치일을 사용. 일률적 법정일수 미제시", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "FUP-001", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-014", "taskName": "비상대응체계 수립", "category": "산업재해", "taskType": "상시", "description": "기관 현황에 따른 단계별 대응요령·연락망 마련", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.47", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "기관 현황에 따른 단계별 대응요령·연락망 마련", "실시 및 결과 확인", "기록 보관"], "memo": "기관 현황에 따른 단계별 대응요령·연락망 마련", "applicationConditions": "기관 현황에 따른 단계별 대응요령·연락망 마련", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-015", "taskName": "비상대응훈련 실시", "category": "산업재해", "taskType": "상시", "description": "훈련 실시 안내만 있으며 고정 주기 없음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.47", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "훈련 실시 안내만 있으며 고정 주기 없음", "실시 및 결과 확인", "기록 보관"], "memo": "훈련 실시 안내만 있으며 고정 주기 없음", "applicationConditions": "훈련 실시 안내만 있으며 고정 주기 없음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-016", "taskName": "요양급여 신청 지원", "category": "산업재해", "taskType": "사건", "description": "산재보험·공무원 재해보상 절차 구분. 발생보고와 분리", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.50", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "산재보험·공무원 재해보상 절차 구분. 발생보고와 분리", "실시 및 결과 확인", "기록 보관"], "memo": "산재보험·공무원 재해보상 절차 구분. 발생보고와 분리", "applicationConditions": "산재보험·공무원 재해보상 절차 구분. 발생보고와 분리", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-017", "taskName": "요양 승인 후 조사표 제출 여부 확인", "category": "산업재해", "taskType": "사건", "description": "업무상 질병 발생일·승인일에 따른 특례 별도 검토", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "accident", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.50", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "업무상 질병 발생일·승인일에 따른 특례 별도 검토", "실시 및 결과 확인", "기록 보관"], "memo": "업무상 질병 발생일·승인일에 따른 특례 별도 검토", "applicationConditions": "업무상 질병 발생일·승인일에 따른 특례 별도 검토", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-018", "taskName": "최초 위험성평가 착수", "category": "위험성평가", "taskType": "사건", "description": "신설기관 최초 1개월 이내 착수. 완료기한과 구분", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "job_change", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.54", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "신설기관 최초 1개월 이내 착수. 완료기한과 구분", "실시 및 결과 확인", "기록 보관", "실시규정·판단기준 수립 및 근로자 의견 청취", "위험성평가 결과 공유·교육 확인", "결과 및 조치사항 3년 보존 (매뉴얼 p.53~56)"], "memo": "신설기관 최초 1개월 이내 착수. 완료기한과 구분", "applicationConditions": "신설기관 최초 1개월 이내 착수. 완료기한과 구분", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-019,ADD-020", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-019", "taskName": "위험성 감소대책 이행", "category": "위험성평가", "taskType": "사건", "description": "조치별 일정 필요. 일률적 완료일 없음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "job_change", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.55", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "조치별 일정 필요. 일률적 완료일 없음", "실시 및 결과 확인", "기록 보관"], "memo": "조치별 일정 필요. 일률적 완료일 없음", "applicationConditions": "조치별 일정 필요. 일률적 완료일 없음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "FUP-001", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-020", "taskName": "위험성평가 결과 근로자 교육", "category": "위험성평가", "taskType": "사건", "description": "평가 종료 후. 단순 배포로 대체하지 않음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "job_change", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.55~56", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "평가 종료 후. 단순 배포로 대체하지 않음", "실시 및 결과 확인", "기록 보관"], "memo": "평가 종료 후. 단순 배포로 대체하지 않음", "applicationConditions": "평가 종료 후. 단순 배포로 대체하지 않음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-021", "taskName": "최초 근골격계 유해요인조사 실시", "category": "근골격계", "taskType": "사건", "description": "신설기관 1년 이내", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.58", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "신설기관 1년 이내", "실시 및 결과 확인", "기록 보관", "근로자 면담·증상조사 및 개선계획 수립", "결과 교육·게시 및 기록 5년 보존 (매뉴얼 p.57~59)"], "memo": "신설기관 1년 이내", "applicationConditions": "신설기관 1년 이내", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-024,ADD-025", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-022", "taskName": "작업환경 변경 후 수시 유해요인조사 실시", "category": "근골격계", "taskType": "사건", "description": "작업 개시 전과 1개월 이내 표기 해석 필요", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.58", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "작업 개시 전과 1개월 이내 표기 해석 필요", "실시 및 결과 확인", "기록 보관", "근로자 면담·증상조사 및 개선계획 수립", "결과 교육·게시 및 기록 5년 보존 (매뉴얼 p.57~59)"], "memo": "작업 개시 전과 1개월 이내 표기 해석 필요", "applicationConditions": "작업 개시 전과 1개월 이내 표기 해석 필요", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-024,ADD-025", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-023", "taskName": "근골격계질환 인정 후 수시 유해요인조사 실시", "category": "근골격계", "taskType": "사건", "description": "업무상 질병 인정과 조사 예외 조건 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.49,58", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "업무상 질병 인정과 조사 예외 조건 확인", "실시 및 결과 확인", "기록 보관", "근로자 면담·증상조사 및 개선계획 수립", "결과 교육·게시 및 기록 5년 보존 (매뉴얼 p.57~59)"], "memo": "업무상 질병 인정과 조사 예외 조건 확인", "applicationConditions": "업무상 질병 인정과 조사 예외 조건 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-024,ADD-025", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-024", "taskName": "근골격계 작업환경 개선조치 이행", "category": "근골격계", "taskType": "사건", "description": "개선계획에 따른 일정", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.59", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "개선계획에 따른 일정", "실시 및 결과 확인", "기록 보관"], "memo": "개선계획에 따른 일정", "applicationConditions": "개선계획에 따른 일정", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "FUP-001", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-025", "taskName": "유해요인조사 결과 근로자 교육", "category": "근골격계", "taskType": "사건", "description": "조사 종료 후. 고정 일수 없음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.59", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "조사 종료 후. 고정 일수 없음", "실시 및 결과 확인", "기록 보관"], "memo": "조사 종료 후. 고정 일수 없음", "applicationConditions": "조사 종료 후. 고정 일수 없음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "HLT-002", "taskName": "사무직 일반건강진단 수검 확인", "category": "건강검진", "taskType": "정기", "description": "2년 1회. 직종명이 아닌 실제 업무로 사무직 판단", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "yearly", "recurrenceInterval": 2, "sourcePage": "PDF p.51", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "2년 1회. 직종명이 아닌 실제 업무로 사무직 판단", "실시 및 결과 확인", "기록 보관"], "memo": "2년 1회. 직종명이 아닌 실제 업무로 사무직 판단", "applicationConditions": "실제 사무직 여부·직전 검진일·공단 대상연도 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "ADD-027", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-027", "taskName": "건강진단 사후관리 실시", "category": "건강검진", "taskType": "사건", "description": "결과에 따른 건강상담. 고정 완료일 없음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.52", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "결과에 따른 건강상담. 고정 완료일 없음", "실시 및 결과 확인", "기록 보관"], "memo": "결과에 따른 건강상담. 고정 완료일 없음", "applicationConditions": "결과에 따른 건강상담. 고정 완료일 없음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-028", "taskName": "특수건강진단 대상 여부 확인", "category": "건강검진", "taskType": "사건", "description": "유해인자·노출조건·야간작업 검토", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.52,61", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "유해인자·노출조건·야간작업 검토", "실시 및 결과 확인", "기록 보관"], "memo": "유해인자·노출조건·야간작업 검토", "applicationConditions": "유해인자·노출조건·야간작업 검토", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-029", "taskName": "배치 전 건강진단 실시", "category": "건강검진", "taskType": "사건", "description": "대상업무 배치 전. 유해인자별 적용 여부 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.52", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "대상업무 배치 전. 유해인자별 적용 여부 확인", "실시 및 결과 확인", "기록 보관"], "memo": "대상업무 배치 전. 유해인자별 적용 여부 확인", "applicationConditions": "대상업무 배치 전. 유해인자별 적용 여부 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-030", "taskName": "특수건강진단 실시", "category": "건강검진", "taskType": "상시", "description": "매뉴얼의 6개월·1년 일반화 여부를 유해인자별 원문과 대조 필요", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.52", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "매뉴얼의 6개월·1년 일반화 여부를 유해인자별 원문과 대조 필요", "실시 및 결과 확인", "기록 보관"], "memo": "매뉴얼의 6개월·1년 일반화 여부를 유해인자별 원문과 대조 필요", "applicationConditions": "매뉴얼의 6개월·1년 일반화 여부를 유해인자별 원문과 대조 필요", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-031", "taskName": "안전보건수준 평가기준 제시", "category": "도급·용역", "taskType": "사건", "description": "공고 전. 공사·용역 구분", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.24,32", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "공고 전. 공사·용역 구분", "실시 및 결과 확인", "기록 보관"], "memo": "공고 전. 공사·용역 구분", "applicationConditions": "공고 전. 공사·용역 구분", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-032", "taskName": "수급업체 안전보건관리계획 검토", "category": "도급·용역", "taskType": "사건", "description": "계약 전. 일회성 작업 대체 기준 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.26,32", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "계약 전. 일회성 작업 대체 기준 확인", "실시 및 결과 확인", "기록 보관", "안전보건수준 평가 및 미흡사항 보완·업체 변경 검토", "필수 체크리스트·안전보건관리 준수서약서 확보"], "memo": "계약 전. 일회성 작업 대체 기준 확인", "applicationConditions": "계약 전. 일회성 작업 대체 기준 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-033", "taskName": "학교 위험성평가 결과 수급업체 제공", "category": "도급·용역", "taskType": "사건", "description": "계약 이후. 업체 자체평가와 별도", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.35", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "계약 이후. 업체 자체평가와 별도", "실시 및 결과 확인", "기록 보관"], "memo": "계약 이후. 업체 자체평가와 별도", "applicationConditions": "계약 이후. 업체 자체평가와 별도", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-034", "taskName": "수급인 특별교육 실시 여부 확인", "category": "도급·용역", "taskType": "사건", "description": "특별교육 대상 작업 시. 교육 지원과 구분", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.39", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "특별교육 대상 작업 시. 교육 지원과 구분", "실시 및 결과 확인", "기록 보관"], "memo": "특별교육 대상 작업 시. 교육 지원과 구분", "applicationConditions": "특별교육 대상 작업 시. 교육 지원과 구분", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-035", "taskName": "수급인 교육 장소·자료 제공", "category": "도급·용역", "taskType": "사건", "description": "수급인 요청 시", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.39,41", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "수급인 요청 시", "실시 및 결과 확인", "기록 보관"], "memo": "수급인 요청 시", "applicationConditions": "수급인 요청 시", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-036", "taskName": "수급인 위생시설 이용 협조", "category": "도급·용역", "taskType": "사건", "description": "시설 필요조건에 따라 협조", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.39", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "시설 필요조건에 따라 협조", "실시 및 결과 확인", "기록 보관"], "memo": "시설 필요조건에 따라 협조", "applicationConditions": "시설 필요조건에 따라 협조", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-037", "taskName": "도급작업 경보·대피훈련 실시", "category": "도급·용역", "taskType": "사건", "description": "발파·화재·붕괴 등 해당 위험 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.39", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "발파·화재·붕괴 등 해당 위험 확인", "실시 및 결과 확인", "기록 보관"], "memo": "발파·화재·붕괴 등 해당 위험 확인", "applicationConditions": "발파·화재·붕괴 등 해당 위험 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-038", "taskName": "혼재작업 시기 조정", "category": "도급·용역", "taskType": "사건", "description": "작업 혼재로 위험 발생 우려 시", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.39", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "작업 혼재로 위험 발생 우려 시", "실시 및 결과 확인", "기록 보관"], "memo": "작업 혼재로 위험 발생 우려 시", "applicationConditions": "작업 혼재로 위험 발생 우려 시", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-039", "taskName": "수급인 안전작업 허가절차 확인", "category": "도급·용역", "taskType": "사건", "description": "해당 유해·위험작업 착수 전", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.39", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "해당 유해·위험작업 착수 전", "실시 및 결과 확인", "기록 보관"], "memo": "해당 유해·위험작업 착수 전", "applicationConditions": "해당 유해·위험작업 착수 전", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-040", "taskName": "사업 종료 후 안전보건 이행 평가", "category": "도급·용역", "taskType": "사건", "description": "평가 결과 차기 업체 선정에 반영", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.30,39", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "평가 결과 차기 업체 선정에 반영", "실시 및 결과 확인", "기록 보관"], "memo": "평가 결과 차기 업체 선정에 반영", "applicationConditions": "평가 결과 차기 업체 선정에 반영", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-041", "taskName": "산업안전보건관리비 계상", "category": "공사", "taskType": "사건", "description": "공고 전. 금액 기준·고시 최신성 재확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.24", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "공고 전. 금액 기준·고시 최신성 재확인", "실시 및 결과 확인", "기록 보관"], "memo": "공고 전. 금액 기준·고시 최신성 재확인", "applicationConditions": "공고 전. 금액 기준·고시 최신성 재확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-042", "taskName": "기본안전보건대장 작성", "category": "공사", "taskType": "사건", "description": "해당 공사 계획단계. 금액·발주자 기준 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.25,40", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "해당 공사 계획단계. 금액·발주자 기준 확인", "실시 및 결과 확인", "기록 보관"], "memo": "해당 공사 계획단계. 금액·발주자 기준 확인", "applicationConditions": "해당 공사 계획단계. 금액·발주자 기준 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-043", "taskName": "설계안전보건대장 적정성 확인", "category": "공사", "taskType": "사건", "description": "해당 공사 설계단계. 전문가 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.25", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "해당 공사 설계단계. 전문가 확인", "실시 및 결과 확인", "기록 보관"], "memo": "해당 공사 설계단계. 전문가 확인", "applicationConditions": "해당 공사 설계단계. 전문가 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-044", "taskName": "공사안전보건대장 적정성 확인", "category": "공사", "taskType": "사건", "description": "해당 공사 시공단계. 전문가 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.25", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "해당 공사 시공단계. 전문가 확인", "실시 및 결과 확인", "기록 보관"], "memo": "해당 공사 시공단계. 전문가 확인", "applicationConditions": "해당 공사 시공단계. 전문가 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "CON-001", "taskName": "공사안전보건대장 이행 확인", "category": "공사", "taskType": "정기", "description": "해당 공사 3개월 1회. 법적 적용조건 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "monthly", "recurrenceInterval": 3, "sourcePage": "PDF p.25", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "해당 공사 3개월 1회. 법적 적용조건 확인", "실시 및 결과 확인", "기록 보관"], "memo": "해당 공사 3개월 1회. 법적 적용조건 확인", "applicationConditions": "대상 공사 금액·발주자 지위·시공기간 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "3,0", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-046", "taskName": "건설재해예방 기술지도 계약 체결", "category": "공사", "taskType": "사건", "description": "착공 전날까지. 금액·기간·면제조건 원문 검증 필요", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.28", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "착공 전날까지. 금액·기간·면제조건 원문 검증 필요", "실시 및 결과 확인", "기록 보관", "공사 작업계획서·서식 및 자율점검 자료 제공"], "memo": "착공 전날까지. 금액·기간·면제조건 원문 검증 필요", "applicationConditions": "착공 전날까지. 금액·기간·면제조건 원문 검증 필요", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "CON-002", "taskName": "건설재해예방 기술지도 실시 확인", "category": "공사", "taskType": "정기", "description": "대상 공사 15일마다 1회 제시. 세부 산정기준 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "daily", "recurrenceInterval": 15, "sourcePage": "PDF p.28", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "대상 공사 15일마다 1회 제시. 세부 산정기준 확인", "실시 및 결과 확인", "기록 보관"], "memo": "대상 공사 15일마다 1회 제시. 세부 산정기준 확인", "applicationConditions": "대상 공사·공사기간·면제조건·지도계약 및 기산일 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "0", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-048", "taskName": "안전보건조정자 선임 또는 지정", "category": "공사", "taskType": "사건", "description": "분리발주·혼재·합산금액 조건 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.28", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "분리발주·혼재·합산금액 조건 확인", "실시 및 결과 확인", "기록 보관"], "memo": "분리발주·혼재·합산금액 조건 확인", "applicationConditions": "분리발주·혼재·합산금액 조건 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-049", "taskName": "산업안전보건관리비 정산", "category": "공사", "taskType": "사건", "description": "해당 공사 종료 시", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "contract", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.23,30", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "해당 공사 종료 시", "실시 및 결과 확인", "기록 보관"], "memo": "해당 공사 종료 시", "applicationConditions": "해당 공사 종료 시", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-050", "taskName": "화학물질 작업공정별 관리요령 게시", "category": "MSDS", "taskType": "사건", "description": "물질별 위험성·보호구·응급조치 등", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "chemical_product", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.64~65", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "물질별 위험성·보호구·응급조치 등", "실시 및 결과 확인", "기록 보관"], "memo": "물질별 위험성·보호구·응급조치 등", "applicationConditions": "물질별 위험성·보호구·응급조치 등", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-051", "taskName": "전보·배치 근로자 MSDS 교육 실시", "category": "MSDS", "taskType": "사건", "description": "신규 물질 교육과 기준 사건이 다름", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "chemical_product", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.64", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "신규 물질 교육과 기준 사건이 다름", "실시 및 결과 확인", "기록 보관"], "memo": "신규 물질 교육과 기준 사건이 다름", "applicationConditions": "신규 물질 교육과 기준 사건이 다름", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-052", "taskName": "MSDS 변경사항 교육 실시", "category": "MSDS", "taskType": "사건", "description": "변경 내용과 취급 근로자 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "chemical_product", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.64", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "변경 내용과 취급 근로자 확인", "실시 및 결과 확인", "기록 보관"], "memo": "변경 내용과 취급 근로자 확인", "applicationConditions": "변경 내용과 취급 근로자 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-053", "taskName": "사용 화학물질 목록 현행화", "category": "MSDS", "taskType": "상시", "description": "매뉴얼은 목록 작성을 권고. 고정주기 없음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.63", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "매뉴얼은 목록 작성을 권고. 고정주기 없음", "실시 및 결과 확인", "기록 보관"], "memo": "매뉴얼은 목록 작성을 권고. 고정주기 없음", "applicationConditions": "매뉴얼은 목록 작성을 권고. 고정주기 없음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-054", "taskName": "작업환경측정 대상 여부 확인", "category": "작업환경측정", "taskType": "사건", "description": "유해인자·함량·작업시간·예외조건 검토", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "job_change", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.61,67", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "유해인자·함량·작업시간·예외조건 검토", "실시 및 결과 확인", "기록 보관"], "memo": "유해인자·함량·작업시간·예외조건 검토", "applicationConditions": "유해인자·함량·작업시간·예외조건 검토", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-055", "taskName": "신규·변경 작업환경측정 실시 협조", "category": "작업환경측정", "taskType": "사건", "description": "요약표 1개월과 본문 30일 차이 확인 필요", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "job_change", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.12,67", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "요약표 1개월과 본문 30일 차이 확인 필요", "실시 및 결과 확인", "기록 보관"], "memo": "요약표 1개월과 본문 30일 차이 확인 필요", "applicationConditions": "요약표 1개월과 본문 30일 차이 확인 필요", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ENV-001", "taskName": "정기 작업환경측정 실시 협조", "category": "작업환경측정", "taskType": "정기", "description": "6개월 주기 및 연1회 예외 조건 검토", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "halfyear", "recurrenceInterval": 1, "sourcePage": "PDF p.67~68", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "6개월 주기 및 연1회 예외 조건 검토", "실시 및 결과 확인", "기록 보관"], "memo": "6개월 주기 및 연1회 예외 조건 검토", "applicationConditions": "측정 대상 유해인자·노출·예외 및 직전 측정일 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-057", "taskName": "측정 결과에 따른 작업환경 개선", "category": "작업환경측정", "taskType": "사건", "description": "대체·폐기 등 조건에 따른 조치. 고정기한 없음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "job_change", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.67~68", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "대체·폐기 등 조건에 따른 조치. 고정기한 없음", "실시 및 결과 확인", "기록 보관", "불필요한 잔여 화학제품 폐기·대체제품 사용 검토 (p.68)"], "memo": "대체·폐기 등 조건에 따른 조치. 고정기한 없음", "applicationConditions": "대체·폐기 등 조건에 따른 조치. 고정기한 없음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "LAW-001", "taskName": "안전보건 관계 법령 의무이행 자체점검 실시", "category": "기타", "taskType": "정기", "description": "반기 1회. 점검 자체와 결과 제출을 분리", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "halfyear", "recurrenceInterval": 1, "sourcePage": "PDF p.71~72", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "반기 1회. 점검 자체와 결과 제출을 분리", "실시 및 결과 확인", "기록 보관"], "memo": "반기 1회. 점검 자체와 결과 제출을 분리", "applicationConditions": "기관별 점검대상 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "yes", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "높음"}, {"taskCode": "LAW-002", "taskName": "관리감독자 업무수행 평가결과 확인", "category": "기타", "taskType": "정기", "description": "반기 1회. 의무이행 결과에 따라 자동 산출되는 평가 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "halfyear", "recurrenceInterval": 1, "sourcePage": "PDF p.71", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "반기 1회. 의무이행 결과에 따라 자동 산출되는 평가 확인", "실시 및 결과 확인", "기록 보관"], "memo": "반기 1회. 의무이행 결과에 따라 자동 산출되는 평가 확인", "applicationConditions": "평가대상 관리감독자·평가결과 확인", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "yes", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "높음"}, {"taskCode": "ADD-060", "taskName": "의무 미이행 조치계획 보고", "category": "공문형", "taskType": "공문", "description": "미이행 발견 시 별도 보고. 구체적인 기한 공문 필요", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.71", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "미이행 발견 시 별도 보고. 구체적인 기한 공문 필요", "실시 및 결과 확인", "기록 보관"], "memo": "미이행 발견 시 별도 보고. 구체적인 기한 공문 필요", "applicationConditions": "미이행 발견 시 별도 보고. 구체적인 기한 공문 필요", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-061", "taskName": "의무 미이행 조치결과 보고", "category": "공문형", "taskType": "공문", "description": "조치 완료 후 별도 보고. 계획 보고와 분리", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.71", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "조치 완료 후 별도 보고. 계획 보고와 분리", "실시 및 결과 확인", "기록 보관"], "memo": "조치 완료 후 별도 보고. 계획 보고와 분리", "applicationConditions": "조치 완료 후 별도 보고. 계획 보고와 분리", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "ADD-062", "taskName": "교육청 산업안전보건 요구자료 회신", "category": "공문형", "taskType": "공문", "description": "발표자료에 요구자료·실태조사 회신 언급. 실제 공문 없음", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "매뉴얼 직접 근거 없음 · 법령 검증 필요", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["적용 대상·조건 확인", "발표자료에 요구자료·실태조사 회신 언급. 실제 공문 없음", "실시 및 결과 확인", "기록 보관"], "memo": "발표자료에 요구자료·실태조사 회신 언급. 실제 공문 없음", "applicationConditions": "발표자료에 요구자료·실태조사 회신 언급. 실제 공문 없음", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}, {"taskCode": "FUP-001", "taskName": "유해·위험요인 개선조치 후속 확인", "category": "점검", "taskType": "사건", "description": "개선 조치 이후 위험 감소와 현장 이행을 확인", "responsible": "학교 업무담당자", "target": "해당 대상 확인", "triggerType": "", "recurrenceType": "", "recurrenceInterval": 1, "sourcePage": "PDF p.16,53,55,59", "sourceName": "산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.)", "sourceArticle": "", "sourceDate": "2026-10-19", "verificationStatus": "needs_review", "active": true, "checklistItems": ["개선조치 이행 확인", "현장 위험 감소 여부 확인", "추가 개선 필요사항 기록", "다음 확인일 지정"], "memo": "외부 점검결과 및 지적별 요구기한 원문 필요", "applicationConditions": "외부 점검결과 및 지적별 요구기한 원문 필요", "relatedForms": "매뉴얼 관련 서식 확인", "dueOffsetDays": "", "alertDays": "30,14,7", "version": "3.0", "legalVerification": "법령 검증 필요", "deadlineKind": "management", "legalDeadline": "", "targetId": "school-default", "stage": "main", "predecessors": "", "successors": "", "applicability": "unknown", "scheduleMode": "period", "weekday": 1, "monthDay": 1, "nth": 1, "anchorDate": "", "applyStart": "", "applyEnd": "", "priority": "보통"}];
const NAME_REVIEW={"CHK-001":{"officialTaskName":"산업안전보건 자율점검관리","subTaskName":"정기점검 실시","actionSummary":"분야별 안전·보건 자체 점검표 작성","formAction":"현장점검 결과 작성·기록 (같은 장소의 기존 점검 자료 활용 가능)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.16","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.16","verifiedRelatedForms":"분야별 안전·보건 자체 점검표(01-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"CHK-002":{"officialTaskName":"산업안전보건 자율점검관리","subTaskName":"정기점검 결과 기관장 보고","actionSummary":"월간 점검 결과 취합 및 기관장 보고","formAction":"기작성 월간 점검자료 취합·확인 후 기관장 보고; 동일 점검표 재작성 불필요","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.16","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.16","verifiedRelatedForms":"분야별 안전·보건 자체 점검표(01-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"EDU-001":{"officialTaskName":"안전보건교육 실시","subTaskName":"현업근로자 정기 안전보건교육 실시","actionSummary":"대상별 정기교육 실시 및 교육일지 작성","formAction":"교육 실시 후 작성·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.44~45","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.44~45","verifiedRelatedForms":"안전보건교육일지(05-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"EDU-101":{"officialTaskName":"안전보건교육 실시","subTaskName":"신규채용자 교육 대상 확인","actionSummary":"신규채용자의 직종·고용형태·교육대상 확인","formAction":"교육대상 확정 후 실시 단계에서 활용; 대상 확인만으로 교육일지 작성 요구 없음","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.44~45","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.44~45","verifiedRelatedForms":"안전보건교육일지(05-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"EDU-102":{"officialTaskName":"안전보건교육 실시","subTaskName":"신규채용자 안전보건교육 실시","actionSummary":"신규채용자 교육 실시 및 교육일지 작성","formAction":"교육 실시 후 작성·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.44~45","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.44~45","verifiedRelatedForms":"안전보건교육일지(05-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"EDU-201":{"officialTaskName":"","subTaskName":"작업내용 변경 시 안전보건교육 실시","actionSummary":"변경 작업의 교육대상·시간 확인 후 교육 실시","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"매뉴얼에서 해당 개별업무의 직접 근거 미확인; 기존 근거: 학교_산업안전보건_AI_행정모델_기획안_보완_편집가능 (1).pdf p.3, 제29조제2항 언급 / 기획안 PDF p.3","nameVerificationStatus":"needs_review","nameSourcePage":"확인 필요","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"매뉴얼의 공식 개별업무로 확정하지 않음. 기존 법령·공문 등 추가 확인 필요."},"PPE-101":{"officialTaskName":"안전보호구 지급·관리","subTaskName":"신규채용자 필요 안전보호구 지급","actionSummary":"필요 보호구 지급 및 안전보호구 지급 대장 작성","formAction":"지급 후 작성·관리","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.21","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.21","verifiedRelatedForms":"안전보호구 지급 대장(03-01-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ACC-101":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"산업재해 보고대상 여부 확인","actionSummary":"사고 사실과 휴업일수·보고대상 여부 확인","formAction":"보고대상 판단에 참고; 판단만으로 신규 작성 요구 없음","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.48~49","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.48~49","verifiedRelatedForms":"산업재해조사표 및 예시(06-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ACC-102":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"산업재해조사표 관할 노동관서 제출","actionSummary":"산업재해조사표 작성 및 관할 노동관서 보고","formAction":"대상 재해 보고 시 작성·제출; 다른 제출처에는 기존 자료 활용","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.48~49","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.48~49","verifiedRelatedForms":"산업재해조사표 및 예시(06-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ACC-103":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"산업재해 재발방지계획 수립","actionSummary":"재발방지 계획서 수립 및 이행","formAction":"계획 수립·이행; 이행확인은 기존 계획서 활용","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.49","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.49","verifiedRelatedForms":"재발방지 계획서(06-02-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ACC-104":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"중대재해 발생 사실 노동관서 즉시 보고","actionSummary":"중대재해 발생 사실을 노동관서에 즉시 유선 보고","formAction":"즉시 유선 보고 후 보고자료 활용; 제출처별 기존 자료 활용","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.48~49","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.48~49","verifiedRelatedForms":"중대재해 발생보고(06-02-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"RSK-001":{"officialTaskName":"근로자 참여 위험성평가 실시","subTaskName":"정기 위험성평가 실시","actionSummary":"근로자 참여 정기 위험성평가 실시 및 기록","formAction":"해당 평가 실시 후 기록·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.53~56","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.53~56","verifiedRelatedForms":"위험성평가표 서식(예시)(08-01-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"RSK-201":{"officialTaskName":"근로자 참여 위험성평가 실시","subTaskName":"작업내용 변경에 따른 수시 위험성평가 실시","actionSummary":"변경 공정의 수시 위험성평가 실시 및 기록","formAction":"해당 평가 실시 후 기록·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.54","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.54","verifiedRelatedForms":"위험성평가표 서식(예시)(08-01-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"RSK-301":{"officialTaskName":"근로자 참여 위험성평가 실시","subTaskName":"산업재해 후 수시 위험성평가 실시","actionSummary":"재해 발생 작업의 수시 위험성평가 실시","formAction":"해당 평가 실시 후 기록·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.49,54","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.49,54","verifiedRelatedForms":"위험성평가표 서식(예시)(08-01-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"MSK-001":{"officialTaskName":"근골격계부담작업 유해요인조사 실시","subTaskName":"정기 근골격계부담작업 유해요인조사 실시","actionSummary":"부담작업 확인 및 정기 유해요인·증상 조사","formAction":"해당 조사 단계에서 작성·기록·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.57~59","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.57~59","verifiedRelatedForms":"체크리스트(09-01-01); 유해요인조사표(09-01-02); 근골격계질환 증상조사표(09-01-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"HLT-001":{"officialTaskName":"건강진단 실시","subTaskName":"비사무직 일반건강진단 수검 확인","actionSummary":"비사무직 대상자 및 일반건강진단 실시 여부 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.51","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.51","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"CNT-101":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"공사·도급 안전보건 적용업무 확인","actionSummary":"공사·용역의 종류·금액·적용 안전보건조치 확인","formAction":"계약 종류·단계별 제출서류 확인에 활용","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.23~41","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.23~41","verifiedRelatedForms":"공사 안전·보건 체크리스트(공통)(04-01-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"CNT-001":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"안전보건협의체 회의 개최","actionSummary":"월간 안전보건협의체 운영 및 회의록 작성","formAction":"협의체 회의·합동점검 해당 부분 작성·보존; 중복 작성 불필요","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.35~36","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.35~36","verifiedRelatedForms":"안전보건협의체 회의록 및 합동점검(04-01-08)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"CNT-002":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"도급 작업장 순회점검 실시","actionSummary":"도급 작업장 순회점검 실시 및 결과 기록","formAction":"현장점검 결과 작성·기록 (같은 장소의 기존 점검 자료 활용 가능)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.37","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.37","verifiedRelatedForms":"분야별 안전·보건 자체 점검표(01-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"CNT-003":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"도급 합동 안전·보건점검 실시","actionSummary":"분기 합동 안전보건 점검 및 점검결과 기록","formAction":"협의체 회의·합동점검 해당 부분 작성·보존; 중복 작성 불필요","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.38","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.38","verifiedRelatedForms":"안전보건협의체 회의록 및 합동점검(04-01-08)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"MSD-101":{"officialTaskName":"물질안전보건자료 게시·비치 및 교육","subTaskName":"신규 화학제품 MSDS 대상 여부 확인","actionSummary":"제품별 MSDS 확보 및 법적 규제현황 확인","formAction":"확보·확인·게시·비치; 학교에서 MSDS 신규 작성 요구 없음","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.61~63","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.61~63","verifiedRelatedForms":"제품별 물질안전보건자료 (공급처·제조사 제공)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"MSD-102":{"officialTaskName":"물질안전보건자료 게시·비치 및 교육","subTaskName":"신규 화학제품 MSDS 현장 게시·비치","actionSummary":"취급 장소에 제품별 MSDS 게시·비치","formAction":"확보·확인·게시·비치; 학교에서 MSDS 신규 작성 요구 없음","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.62,64","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.62,64","verifiedRelatedForms":"제품별 물질안전보건자료 (공급처·제조사 제공)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"MSD-103":{"officialTaskName":"물질안전보건자료 게시·비치 및 교육","subTaskName":"신규 화학제품 용기 경고표시 부착","actionSummary":"소분용기를 포함한 용기 경고표시 확인·부착","formAction":"제품 MSDS를 참고해 용기 경고표시 부착; 서식 번호와 부록 구분","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.64~65","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.64~65","verifiedRelatedForms":"물질안전보건자료(MSDS) 경고표시(소분용기용) [부록 10-01-02]","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"MSD-104":{"officialTaskName":"물질안전보건자료 게시·비치 및 교육","subTaskName":"신규 화학제품 취급자 MSDS 교육 실시","actionSummary":"신규 물질 취급자 교육 및 교육일지 작성","formAction":"교육 실시 후 작성·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.64~65","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.64~65","verifiedRelatedForms":"안전보건교육일지(10-01-04)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"DOC-001":{"officialTaskName":"안전보건 관계 법령상 의무이행 점검","subTaskName":"안전보건 의무이행 점검결과 제출","actionSummary":"반기 의무이행 점검 결과를 교육청에 제출","formAction":"점검표 작성·확인·시스템 제출; 평가결과는 점검결과 및 양식에 따라 산출","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.71~72","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.71~72","verifiedRelatedForms":"안전보건 관계 법령상 의무 이행사항 점검표 (번호 미확인)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-001":{"officialTaskName":"산업안전보건 자율점검관리","subTaskName":"작업 전 일상 안전점검 실시","actionSummary":"작업안전수칙 준수 및 작업 전 일상점검 실시","formAction":"안전수칙·점검내용 참고·활용; 별도 일상점검표 작성 의무 미확정","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.15","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.15","verifiedRelatedForms":"산업안전보건 스티커북(시설관리, 청소, 급식 분야) [부록 01-01-01~04]","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-002":{"officialTaskName":"산업안전보건 자율점검관리","subTaskName":"점검 지적사항 개선계획 수립","actionSummary":"정기점검에서 발견된 문제점의 개선계획 수립","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.16","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.16","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-003":{"officialTaskName":"산업안전보건 자율점검관리","subTaskName":"점검 지적사항 개선조치 실시","actionSummary":"정기점검 지적사항 개선 및 위험성평가 반영","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.16","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.16","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-004":{"officialTaskName":"","subTaskName":"외부기관 점검 지적사항 개선 여부 확인","actionSummary":"외부기관 정기점검 대상·실시 근거 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"매뉴얼에서 해당 개별업무의 직접 근거 미확인; 기존 근거: 산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.) / PDF p.53","nameVerificationStatus":"needs_review","nameSourcePage":"확인 필요","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"매뉴얼의 공식 개별업무로 확정하지 않음. 기존 법령·공문 등 추가 확인 필요."},"ADD-005":{"officialTaskName":"","subTaskName":"보류 지적사항 재점검 실시","actionSummary":"월간 점검 운영 근거와 실시 대상 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"매뉴얼에서 해당 개별업무의 직접 근거 미확인; 기존 근거: 산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.) / 매뉴얼 직접 근거 없음 · 법령 검증 필요","nameVerificationStatus":"needs_review","nameSourcePage":"확인 필요","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"매뉴얼의 공식 개별업무로 확정하지 않음. 기존 법령·공문 등 추가 확인 필요."},"ADD-006":{"officialTaskName":"법령 요지 등의 게시 및 안전보건표지 부착","subTaskName":"법령 요지 게시 내용 갱신","actionSummary":"근로자가 볼 수 있는 장소에 법령 요지 게시","formAction":"게시·안내","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.17","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.17","verifiedRelatedForms":"산업안전보건법령 요지(02-01-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-007":{"officialTaskName":"법령 요지 등의 게시 및 안전보건표지 부착","subTaskName":"안전보건표지 부착","actionSummary":"작업장 위험요인에 맞는 안전보건표지 부착","formAction":"위험요인에 맞는 안전보건표지 확인·부착","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.18~19","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.18~19","verifiedRelatedForms":"산업안전보건 스티커북(시설관리, 청소, 급식 분야) [부록 01-01-01~04]","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-008":{"officialTaskName":"안전보호구 지급·관리","subTaskName":"위험작업 전 안전사항 확인","actionSummary":"위험작업 보호구·안전조치 확인 및 대장 관리","formAction":"작업 전 확인 및 위험작업 관리 대장 작성·관리","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.22","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.22","verifiedRelatedForms":"시설관리 분야 위험작업 목록 및 안전수칙(03-02-01); 시설관리 분야 위험작업 관리 대장(03-02-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"EDU-002":{"officialTaskName":"안전보건교육 실시","subTaskName":"관리감독자 정기교육 이수","actionSummary":"관리감독자 정기교육 이수 및 이수증 보존","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.43","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.43","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"EDU-301":{"officialTaskName":"","subTaskName":"특별교육 대상 확인 및 유해·위험작업 특별교육 실시","actionSummary":"특별교육 적용대상·시간·교육 근거 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"매뉴얼에서 해당 개별업무의 직접 근거 미확인; 기존 근거: 산업안전보건법 · 안전보건교육 기준 (법령 검증 필요) / 매뉴얼 직접 근거 없음 · 산업안전보건법 제29조제3항·시행규칙 별표 확인 필요","nameVerificationStatus":"needs_review","nameSourcePage":"확인 필요","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"매뉴얼의 공식 개별업무로 확정하지 않음. 기존 법령·공문 등 추가 확인 필요."},"ADD-011":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"산업재해조사표 보건안전진흥원 보고","actionSummary":"산업재해조사표를 보건안전진흥원에 보고","formAction":"대상 재해 보고 시 작성·제출; 다른 제출처에는 기존 자료 활용","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.49","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.49","verifiedRelatedForms":"산업재해조사표 및 예시(06-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-012":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"중대재해 발생 사실 교육청 보고","actionSummary":"중대재해 발생 사실을 교육청에 즉시 유선 보고","formAction":"즉시 유선 보고 후 보고자료 활용; 제출처별 기존 자료 활용","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.49","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.49","verifiedRelatedForms":"중대재해 발생보고(06-02-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-013":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"산업재해 재발방지대책 이행","actionSummary":"재발방지 계획 이행 및 개선조치 확인","formAction":"계획 수립·이행; 이행확인은 기존 계획서 활용","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.49","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.49","verifiedRelatedForms":"재발방지 계획서(06-02-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-014":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"비상대응체계 수립","actionSummary":"학교 현황에 맞는 비상대응체계·연락망 정비","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.47","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.47","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-015":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"비상대응훈련 실시","actionSummary":"비상대응 매뉴얼에 따른 훈련·교육 실시","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.47","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.47","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-016":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"요양급여 신청 지원","actionSummary":"요양급여 신청서·소견서 확인 및 신청 지원","formAction":"공단 제출용 서류 확인·신청 지원 (PDF p.50)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.50","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.50","verifiedRelatedForms":"산업재해보상보험 요양급여 신청서; 요양급여신청 소견서 (번호 미확인)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-017":{"officialTaskName":"산업재해 발생 시 대응·보고","subTaskName":"요양 승인 후 조사표 제출 여부 확인","actionSummary":"요양 승인 시 산업재해조사표 제출 여부 확인","formAction":"기제출 여부 확인; 승인·불승인에 따른 후속 처리 확인","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.50","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.50","verifiedRelatedForms":"산업재해조사표 및 예시(06-02-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-018":{"officialTaskName":"근로자 참여 위험성평가 실시","subTaskName":"최초 위험성평가 착수","actionSummary":"최초 위험성평가 대상 확인 및 평가 실시","formAction":"해당 평가 실시 후 기록·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.54","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.54","verifiedRelatedForms":"위험성평가표 서식(예시)(08-01-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-019":{"officialTaskName":"근로자 참여 위험성평가 실시","subTaskName":"위험성 감소대책 이행","actionSummary":"위험성 감소 대책 수립 및 개선조치 이행","formAction":"감소대책 수립 및 이행 기록","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.55~56","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.55~56","verifiedRelatedForms":"위험성 감소 대책 수립 및 이행 서식(예시)(08-01-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-020":{"officialTaskName":"근로자 참여 위험성평가 실시","subTaskName":"위험성평가 결과 근로자 교육","actionSummary":"위험성평가 결과 교육·공유 및 기록 보존","formAction":"기평가 결과 교육·공유 및 기록 보존; 재작성 불필요","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.55~56","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.55~56","verifiedRelatedForms":"위험성평가표 서식(예시)(08-01-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-021":{"officialTaskName":"근골격계부담작업 유해요인조사 실시","subTaskName":"최초 근골격계 유해요인조사 실시","actionSummary":"최초 조사대상 확인 및 유해요인·증상 조사","formAction":"해당 조사 단계에서 작성·기록·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.57~58","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.57~58","verifiedRelatedForms":"체크리스트(09-01-01); 유해요인조사표(09-01-02); 근골격계질환 증상조사표(09-01-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-022":{"officialTaskName":"근골격계부담작업 유해요인조사 실시","subTaskName":"작업환경 변경 후 수시 유해요인조사 실시","actionSummary":"설비 도입·작업환경 변경 시 수시 조사 실시","formAction":"해당 조사 단계에서 작성·기록·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.58","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.58","verifiedRelatedForms":"체크리스트(09-01-01); 유해요인조사표(09-01-02); 근골격계질환 증상조사표(09-01-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-023":{"officialTaskName":"근골격계부담작업 유해요인조사 실시","subTaskName":"근골격계질환 인정 후 수시 유해요인조사 실시","actionSummary":"근골격계질환 인정 작업의 수시 조사 실시","formAction":"해당 조사 단계에서 작성·기록·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.49,58","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.49,58","verifiedRelatedForms":"체크리스트(09-01-01); 유해요인조사표(09-01-02); 근골격계질환 증상조사표(09-01-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-024":{"officialTaskName":"근골격계부담작업 유해요인조사 실시","subTaskName":"근골격계 작업환경 개선조치 이행","actionSummary":"조사 결과에 따른 작업환경 개선 계획 수립·이행","formAction":"개선계획 수립 및 이행 기록","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.59","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.59","verifiedRelatedForms":"작업환경 개선 계획서(09-01-04)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-025":{"officialTaskName":"근골격계부담작업 유해요인조사 실시","subTaskName":"유해요인조사 결과 근로자 교육","actionSummary":"유해요인조사 결과 교육·공유 및 기록 보존","formAction":"조사결과 교육일지 작성 및 기존 조사기록 보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.59","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.59","verifiedRelatedForms":"안전보건 교육일지(09-01-05); 유해요인조사표(09-01-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"HLT-002":{"officialTaskName":"건강진단 실시","subTaskName":"사무직 일반건강진단 수검 확인","actionSummary":"사무직 대상자 및 일반건강진단 실시 여부 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.51","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.51","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-027":{"officialTaskName":"건강진단 실시","subTaskName":"건강진단 사후관리 실시","actionSummary":"건강진단 결과에 따른 건강상담 등 사후관리","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.52","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.52","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-028":{"officialTaskName":"건강진단 실시","subTaskName":"특수건강진단 대상 여부 확인","actionSummary":"MSDS 등을 활용해 특수건강진단 대상 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.52,61","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.52,61","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-029":{"officialTaskName":"건강진단 실시","subTaskName":"배치 전 건강진단 실시","actionSummary":"대상 유해업무 배치 전 건강진단 실시","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.52","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.52","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-030":{"officialTaskName":"건강진단 실시","subTaskName":"특수건강진단 실시","actionSummary":"대상 근로자의 특수건강진단 실시 여부 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.52","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.52","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-031":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"안전보건수준 평가기준 제시","actionSummary":"공고에 안전보건수준 평가기준 제시","formAction":"공고 시 평가기준 제시·활용","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.24,32","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.24,32","verifiedRelatedForms":"도급 시 적격업체 선정을 위한 안전보건 수준 평가 세부 기준(예시)(04-01-01)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-032":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"수급업체 안전보건관리계획 검토","actionSummary":"업체의 안전보건관리 계획서 검토·평가","formAction":"업체 제출자료 확인·검토·보관; 학교의 중복 작성 요구 없음","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.26,32","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.26,32","verifiedRelatedForms":"안전보건관리 활동계획서(04-01-02); 공사 안전·보건 체크리스트(공통)(04-01-03); 안전보건관리 서약서(04-01-05)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-033":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"학교 위험성평가 결과 수급업체 제공","actionSummary":"학교 위험성평가 결과를 수급인에게 공유·제공","formAction":"학교의 기존 평가 결과 공유·제공; 재작성 불필요","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.35","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.35","verifiedRelatedForms":"위험성평가표 서식(예시)(08-01-02)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-034":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"수급인 특별교육 실시 여부 확인","actionSummary":"수급인 근로자의 특별안전보건교육 실시 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.39","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.39","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-035":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"수급인 교육 장소·자료 제공","actionSummary":"수급인 교육에 필요한 장소·자료 제공 협조","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.39","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.39","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-036":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"수급인 위생시설 이용 협조","actionSummary":"수급인 근로자의 위생시설 이용 협조","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.39","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.39","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-037":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"도급작업 경보·대피훈련 실시","actionSummary":"도급 작업 경보체계 운영 및 대피훈련 실시","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.39","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.39","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-038":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"혼재작업 시기 조정","actionSummary":"혼재 작업 위험을 확인하고 작업 시기·내용 조정","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.39","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.39","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-039":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"수급인 안전작업 허가절차 확인","actionSummary":"수급인의 안전작업 허가 절차·승인 여부 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.39","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.39","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-040":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"사업 종료 후 안전보건 이행 평가","actionSummary":"사업 종료 시 안전보건 이행사항 평가·환류","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.30,39","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.30,39","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-041":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"산업안전보건관리비 계상","actionSummary":"공사 적용금액·종류 확인 후 안전보건관리비 계상","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.24","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.24","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-042":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"기본안전보건대장 작성","actionSummary":"해당 공사 기본 안전보건대장 작성·적정성 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.25,40","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.25,40","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-043":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"설계안전보건대장 적정성 확인","actionSummary":"설계 안전보건대장 작성 및 적정성 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.25","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.25","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-044":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"공사안전보건대장 적정성 확인","actionSummary":"공사 안전보건대장 작성 및 적정성 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.25","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.25","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"CON-001":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"공사안전보건대장 이행 확인","actionSummary":"공사 안전보건대장 이행 여부 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.25","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.25","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-046":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"건설재해예방 기술지도 계약 체결","actionSummary":"해당 공사 착공 전 재해예방 기술지도 계약 체결","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.28","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.28","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"CON-002":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"건설재해예방 기술지도 실시 확인","actionSummary":"해당 공사 재해예방 기술지도 실시 여부 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.28","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.28","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-048":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"안전보건조정자 선임 또는 지정","actionSummary":"혼재 공사의 안전보건조정자 선임·지정 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.28","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.28","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-049":{"officialTaskName":"도급(공사, 용역) 시 안전보건 조치","subTaskName":"산업안전보건관리비 정산","actionSummary":"공사 종료 시 안전보건관리비 사용내역 확인·정산","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.30","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.30","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-050":{"officialTaskName":"물질안전보건자료 게시·비치 및 교육","subTaskName":"화학물질 작업공정별 관리요령 게시","actionSummary":"MSDS를 참고해 작업공정별 관리요령 게시","formAction":"MSDS를 참고해 관리요령 작성·게시","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.64~65","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.64~65","verifiedRelatedForms":"유해화학물질 작업공정별 관리요령(예시)(10-01-03)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-051":{"officialTaskName":"물질안전보건자료 게시·비치 및 교육","subTaskName":"전보·배치 근로자 MSDS 교육 실시","actionSummary":"신규배치 근로자 MSDS 교육 및 일지 작성","formAction":"교육 실시 후 작성·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.64~65","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.64~65","verifiedRelatedForms":"안전보건교육일지(10-01-04)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-052":{"officialTaskName":"물질안전보건자료 게시·비치 및 교육","subTaskName":"MSDS 변경사항 교육 실시","actionSummary":"MSDS 변경 시 취급자 교육 및 일지 작성","formAction":"교육 실시 후 작성·보존","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.64~65","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.64~65","verifiedRelatedForms":"안전보건교육일지(10-01-04)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-053":{"officialTaskName":"물질안전보건자료 게시·비치 및 교육","subTaskName":"사용 화학물질 목록 현행화","actionSummary":"사용 화학물질 제품명·회사명·용도 목록 정리","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.63","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.63","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-054":{"officialTaskName":"작업환경측정 실시","subTaskName":"작업환경측정 대상 여부 확인","actionSummary":"MSDS 성분·함유량 등 측정대상 유해인자 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.67","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.67","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-055":{"officialTaskName":"작업환경측정 실시","subTaskName":"신규·변경 작업환경측정 실시 협조","actionSummary":"신규·변경 작업장 측정대상 확인 및 측정 협조","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.67","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.67","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ENV-001":{"officialTaskName":"작업환경측정 실시","subTaskName":"정기 작업환경측정 실시 협조","actionSummary":"대상 작업장 정기 작업환경측정 실시 협조","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.67","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.67","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-057":{"officialTaskName":"작업환경측정 실시","subTaskName":"측정 결과에 따른 작업환경 개선","actionSummary":"대상물질 폐기·대체 등 작업환경 개선 검토","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.68","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.68","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"LAW-001":{"officialTaskName":"안전보건 관계 법령상 의무이행 점검","subTaskName":"안전보건 관계 법령 의무이행 자체점검 실시","actionSummary":"반기 의무이행 사항 점검표로 자체점검 실시","formAction":"점검표 작성·확인·시스템 제출; 평가결과는 점검결과 및 양식에 따라 산출","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.71~72","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.71~72","verifiedRelatedForms":"안전보건 관계 법령상 의무 이행사항 점검표 (번호 미확인)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"LAW-002":{"officialTaskName":"안전보건 관계 법령상 의무이행 점검","subTaskName":"관리감독자 업무수행 평가결과 확인","actionSummary":"반기 관리감독자 업무수행 평가결과 확인","formAction":"점검표 작성·확인·시스템 제출; 평가결과는 점검결과 및 양식에 따라 산출","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.71","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.71","verifiedRelatedForms":"안전보건 관계 법령상 의무 이행사항 점검표 (번호 미확인)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-060":{"officialTaskName":"안전보건 관계 법령상 의무이행 점검","subTaskName":"의무 미이행 조치계획 보고","actionSummary":"의무 미이행 사항 조치계획 수립 및 별도 보고","formAction":"기존 점검결과 확인 및 미이행 조치계획·결과 별도 보고 (별도 보고서 명칭·번호 미확인)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.71","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.71","verifiedRelatedForms":"안전보건 관계 법령상 의무 이행사항 점검표 (번호 미확인)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-061":{"officialTaskName":"안전보건 관계 법령상 의무이행 점검","subTaskName":"의무 미이행 조치결과 보고","actionSummary":"의무 미이행 조치결과 보고 및 증빙 보관","formAction":"기존 점검결과 확인 및 미이행 조치계획·결과 별도 보고 (별도 보고서 명칭·번호 미확인)","nameSource":"서울특별시교육청 산업안전보건업무 매뉴얼(2025.3.) PDF p.71","nameVerificationStatus":"confirmed","nameSourcePage":"PDF p.71","verifiedRelatedForms":"안전보건 관계 법령상 의무 이행사항 점검표 (번호 미확인)","nameReviewNote":"본문과 서식목록(PDF p.75)을 대조. 법령·적용대상 검증상태는 별도 유지."},"ADD-062":{"officialTaskName":"","subTaskName":"교육청 산업안전보건 요구자료 회신","actionSummary":"교육청 요구 공문 확인 후 요청자료 회신","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"매뉴얼에서 해당 개별업무의 직접 근거 미확인; 기존 근거: 산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.) / 매뉴얼 직접 근거 없음 · 법령 검증 필요","nameVerificationStatus":"needs_review","nameSourcePage":"확인 필요","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"매뉴얼의 공식 개별업무로 확정하지 않음. 기존 법령·공문 등 추가 확인 필요."},"FUP-001":{"officialTaskName":"","subTaskName":"유해·위험요인 개선조치 후속 확인","actionSummary":"해당 원업무의 개선조치 완료 여부 후속 확인","formAction":"확인·활용 (별도 서식 작성 안내 없음)","nameSource":"매뉴얼에서 해당 개별업무의 직접 근거 미확인; 기존 근거: 산업안전보건업무 매뉴얼(서울특별시교육청, 2025.3.) / PDF p.16,53,55,59","nameVerificationStatus":"needs_review","nameSourcePage":"16,53,55,59 (분야별 확인)","verifiedRelatedForms":"별도 서식명·번호 미확인","nameReviewNote":"공식 업무명 미확정. 기존 제목·주기·발생조건 보존. FUP-001은 여러 분야의 후속 확인을 묶은 프로그램 관리 항목."}};
const officialMasters=()=>legacyOfficialMasters().map(m=>({...m,...NAME_REVIEW[m.taskCode]}));

const normalizedOfficialMasters=()=>officialMasters().map(m=>({...m,target:m.occurrenceCondition||m.target}));

const freshData=()=>({taskMaster:normalizedOfficialMasters(),tasks:[],triggerEvents:[],officialEvents:[],personalEvents:[],taskChecklist:[],taskHistory:[],appSettings:{version:APP_VERSION,masterDataVersion:MASTER_DATA_VERSION,initializedAt:new Date().toISOString(),storageType:''}});

/* =========================================================

   STORAGE — IndexedDB 우선, 실패 시 localStorage 대체

========================================================= */

const storageAdapter={mode:'',db:null,async init(){try{await new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('kv'))req.result.createObjectStore('kv')};req.onsuccess=()=>{this.db=req.result;resolve()};req.onerror=()=>reject(req.error)});this.mode='IndexedDB'}catch(e){this.mode='localStorage'}},async load(){if(this.mode==='IndexedDB')return new Promise((resolve,reject)=>{const r=this.db.transaction('kv','readonly').objectStore('kv').get(STORE_KEY);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)});try{return JSON.parse(localStorage.getItem(STORE_KEY)||'null')}catch{return null}},async save(data){data.appSettings.storageType=this.mode;if(this.mode==='IndexedDB')return new Promise((resolve,reject)=>{const tx=this.db.transaction('kv','readwrite');tx.objectStore('kv').put(data,STORE_KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});localStorage.setItem(STORE_KEY,JSON.stringify(data))},async clear(){if(this.mode==='IndexedDB')return new Promise((resolve,reject)=>{const tx=this.db.transaction('kv','readwrite');tx.objectStore('kv').delete(STORE_KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});localStorage.removeItem(STORE_KEY)}};

/* =========================================================

   DATE UTILS

========================================================= */

function localToday(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}

function dayDiff(date,today=localToday()){const serial=x=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(x||''))return NaN;const [y,m,d]=x.split('-').map(Number);return Date.UTC(y,m-1,d)/86400000};const n=serial(date)-serial(today);return Number.isFinite(n)?n:null}

function dDay(date){const n=dayDiff(date);if(n===null)return '';if(n===0)return 'D-Day';return n>0?`D-${n}`:`D+${Math.abs(n)}`}

function fmtDate(date){if(!date)return '-';const [y,m,d]=date.split('-');return `${y}.${m}.${d}`}

function monthKey(date){return String(date||'').slice(0,7)}

function dateInMonth(date,base=new Date()){return monthKey(date)===`${base.getFullYear()}-${String(base.getMonth()+1).padStart(2,'0')}`}

function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

/* =========================================================

   RULE ENGINE — 상태, D-Day, 진행률 자동 계산

========================================================= */

function progressOf(task){const items=task.checklist||[],required=items.filter(x=>x.required!==false);if(!items.length)return {done:0,total:0,pct:0,all:true,requiredDone:0,requiredTotal:0};const done=items.filter(x=>x.done).length,requiredDone=required.filter(x=>x.done).length;return{done,total:items.length,pct:Math.round(done/items.length*100),all:requiredDone===required.length,requiredDone,requiredTotal:required.length}}

function statusOf(task){const p=progressOf(task);if(task.completedByUser)return '완료';if(p.done>0)return '진행';if(task.requiresReview)return '확인필요';const diff=dayDiff(task.dueDate||task.date);if(task.dueDate&&diff<0)return '지연';if(task.dueDate&&diff<=7)return '임박';return '예정'}

function statusBadge(status){const cls={'이번 주 업무':'period-current','이번 달 업무':'period-current','마감 임박':'soon',임박:'soon',지연:'late',완료:'done',진행:'progress',확인필요:'review'}[status]||'';return `<span class="badge ${cls}">${status}</span>`}

function typeBadge(type){const cls={정기:'regular',사건:'trigger',공문:'official',개인:'personal'}[type]||'';return `<span class="badge ${cls}">${type}</span>`}

/* =========================================================

   APPLICATION STATE / TASK ENGINE

========================================================= */

const app={data:null,page:'home',homeTab:'priority',summaryFilter:null,period:'today',customFrom:'',customTo:'',calendarDate:new Date(),viewMode:'list',allType:'전체',allStatus:'전체',sort:'due',search:'',settingsTab:'operations',async save(){try{await storageAdapter.save(this.data);const el=document.getElementById('saveStatus');if(el)el.textContent='브라우저에 안전하게 저장됨'}catch(error){const el=document.getElementById('saveStatus');if(el)el.textContent='저장 실패';toast('저장에 실패했습니다. 브라우저 저장공간과 보안 설정을 확인하세요.');throw error}},history(taskId,action){this.data.taskHistory.unshift({id:uuid(),taskId,action,at:new Date().toISOString()})},syncChecklist(task){this.data.taskChecklist=this.data.taskChecklist.filter(x=>x.taskId!==task.id);(task.checklist||[]).forEach((x,i)=>this.data.taskChecklist.push({id:x.id,taskId:task.id,order:i,label:x.label,required:x.required!==false,done:x.done}))}};

function masterToTask(master,{date='',dueDate='',sourceEventId=null,titleSuffix='',requiresReview=null}={}){return{id:uuid(),masterCode:master.taskCode,name:master.taskName+titleSuffix,category:master.category,type:master.taskType||'사건',description:master.description,procedure:master.procedure||'',responsible:master.responsible,supporter:master.supporter,target:master.target,date:date||dueDate,dueDate,createdAt:new Date().toISOString(),completedAt:null,completedByUser:false,requiresReview:requiresReview??master.verificationStatus!=='confirmed',verificationStatus:master.verificationStatus,forms:master.relatedForms,source:{type:master.sourceType,name:master.sourceName,article:master.sourceArticle,page:master.sourcePage,date:master.sourceDate,url:master.sourceUrl||''},memo:master.memo,sourceEventId,checklist:(master.checklistItems||[]).map(label=>({id:uuid(),label,required:true,done:false}))}}

async function addTask(task){app.data.tasks.unshift(task);app.syncChecklist(task);app.history(task.id,'업무 생성');await app.save();return task}

function addMasterTriggeredTasks(triggerType,event,eventDate){const matches=app.data.taskMaster.filter(m=>m.active&&m.triggerType===triggerType);matches.forEach(m=>{const due=m.dueOffsetDays!==''&&m.dueOffsetDays!=null?addDays(eventDate,m.dueOffsetDays):'';const t=masterToTask(m,{date:eventDate,dueDate:due,sourceEventId:event.id,requiresReview:m.verificationStatus!=='confirmed'||['contract','accident'].includes(triggerType)});app.data.tasks.unshift(t);app.syncChecklist(t);app.history(t.id,`${event.kind} 사건에서 자동 생성`)});return matches.length}

/* =========================================================

   UI — 메뉴, 공통 요소, 라우팅

========================================================= */

const menus=[['home','◆','홈'],['work','▦','일정·업무관리'],['chatbot','●','AI 업무지원 챗봇'],['forms','▤','대표서식 자동화'],['inspection','☑','시설안전 점검이력'],['msds','⚗','MSDS 업무지원'],['settings','⚙','설정']];

function toast(msg){document.getElementById('toast').innerHTML=`<div class="toast">${escapeHtml(msg)}</div>`;setTimeout(()=>document.getElementById('toast').innerHTML='',2500)}

function renderNav(){document.getElementById('nav').innerHTML=menus.map(([id,ico,label])=>`${id==='settings'?'<div class="nav-divider"></div>':''}<button data-page="${id}" aria-label="${label}" title="${label}" class="${app.page===id?'active':''}"><span class="ico">${ico}</span><span class="txt">${label}</span>${['chatbot','forms','inspection','msds'].includes(id)?'<span class="nav-ready">준비</span>':''}</button>`).join('')}

const moduleInfo={chatbot:{icon:'●',title:'AI 업무지원 챗봇',desc:'관련 법령·지침과 필요한 서식을 함께 찾는 업무지원 기능입니다.'},forms:{icon:'▤',title:'대표서식 자동화',desc:'자주 사용하는 산업안전보건 서식을 쉽게 작성하는 기능입니다.'},inspection:{icon:'☑',title:'시설안전 점검이력',desc:'시설 점검 결과와 후속조치 이력을 관리하는 기능입니다.'},msds:{icon:'⚗',title:'MSDS 업무지원',desc:'화학물질과 MSDS 자료를 확인하고 관리하는 기능입니다.'}};

function renderModulePage(id){const m=moduleInfo[id];return `${pageHead(m.title,m.desc)}<div class="module-placeholder"><div><div class="module-icon">${m.icon}</div><h3>${m.title}</h3><p>전체 시스템 메뉴 이동 구조를 확인할 수 있도록 화면을 연결했습니다.<br>이 기능의 실제 데이터와 세부 화면은 아직 연결 준비 중입니다.</p><button class="btn" data-page="home">홈으로</button><button class="btn primary" data-page="work">일정·업무관리 열기</button></div></div>`}

function render(){renderNav();const views={home:renderHome,work:renderWork,settings:renderSettings};const html=views[app.page]?views[app.page]():renderModulePage(app.page),context=app.page==='home'?'':`<div class="system-context"><b>산업안전보건 업무지원</b><span>›</span><span>${escapeHtml(menus.find(x=>x[0]===app.page)?.[2]||'')}</span></div>`;document.getElementById('view').innerHTML=context+(app.page==='home'?`<div class="home-viewport"><div class="home-screen">${html}</div></div>`:html);bindPage();if(app.page==='home')fitHomeDashboard()}

function fitHomeDashboard(){const viewport=document.querySelector('.home-viewport'),screen=viewport?.querySelector('.home-screen');if(!viewport||!screen)return;requestAnimationFrame(()=>{screen.style.transform='none';screen.style.width='100%';screen.dataset.scale='1';if(window.innerWidth<=820)return;const available=viewport.clientHeight;let scale=1;for(let i=0;i<4;i++){screen.style.width=`${100/scale}%`;const needed=screen.scrollHeight||1;const next=Math.min(1,available/needed);if(Math.abs(next-scale)<.002){scale=next;break}scale=next}screen.style.width=`${100/scale}%`;const finalNeeded=screen.scrollHeight||1;scale=Math.min(1,available/finalNeeded);screen.style.width=`${100/scale}%`;screen.style.transform=`scale(${scale})`;screen.dataset.scale=scale.toFixed(3)})}

function pageHead(title,desc,actions=''){return `<div class="page-head"><div><div class="kicker">산업안전보건 업무관리</div><h2>${title}</h2><p>${desc}</p></div>${actions?`<div class="top-actions">${actions}</div>`:''}</div>`}

function taskDate(t){return t.dueDate||t.date}

function filteredDashboard(kind){const now=localToday(),tasks=app.data.tasks;return tasks.filter(t=>{const s=statusOf(t),diff=dayDiff(taskDate(t));if(kind==='today')return diff===0&&s!=='완료';if(kind==='week')return diff!==null&&diff>=0&&diff<=7&&s!=='완료';if(kind==='late')return s==='지연';if(kind==='progress')return s==='진행'||s==='확인필요';if(kind==='done')return s==='완료'&&dateInMonth(t.completedAt?.slice(0,10)||'');return true}).sort((a,b)=>(taskDate(a)||'9999').localeCompare(taskDate(b)||'9999'))}

function metricCount(kind){return filteredDashboard(kind).length}

/* =========================================================

   DASHBOARD

========================================================= */

function renderDashboard(){const defs=[['today','오늘'],['week','7일 이내'],['late','지연'],['progress','진행 중'],['done','이번 달 완료']];const list=filteredDashboard(app.dashboardFilter);return `${pageHead('오늘의 업무',`${fmtDate(localToday())} · 지금 확인해야 할 업무를 우선순위대로 보여드립니다.`,`<button class="btn" data-action="generate-regular">정기업무 생성</button><button class="btn primary" data-action="quick-event">+ 일정등록</button>`)}<div class="cards">${defs.map(([id,label])=>`<button class="metric ${app.dashboardFilter===id?'active':''}" data-filter-card="${id}"><div class="label">${label}</div><div class="value"><b>${metricCount(id)}</b><span>건</span></div></button>`).join('')}</div><div class="panel"><div class="panel-head"><h3>오늘 확인할 업무</h3><span class="subtle">${list.length}건 표시</span></div>${taskRows(list)}</div>`}

function taskRows(list){if(!list.length)return `<div class="empty">조건에 해당하는 업무가 없습니다.<br><span class="subtle">일정을 등록하거나 업무원장에서 정기업무를 생성해 보세요.</span></div>`;return `<div class="task-list"><div class="task-row header"><span>상태</span><span>D-Day</span><span>업무명</span><span>분류</span><span>유형</span><span>예정/마감일</span><span></span></div>${list.map(t=>`<div class="task-row"><span>${statusBadge(statusOf(t))}</span><strong class="${statusOf(t)==='지연'?'subtle':''}">${t.dueDate?dDay(t.dueDate):fmtDate(t.date)}</strong><span><span class="task-title">${escapeHtml(taskDisplay(t).title)}</span>${taskActionHtml(t)}${t.requiresReview?'<br><span class="subtle">공식 근거 확인 필요</span>':''}</span><span>${escapeHtml(t.category||'-')}</span><span>${typeBadge(t.type)}</span><span>${fmtDate(taskDate(t))}</span><button class="btn" data-task="${t.id}">업무보기</button></div>`).join('')}</div>`}

/* =========================================================

   CALENDAR

========================================================= */

function renderCalendar(){const y=app.calendarDate.getFullYear(),m=app.calendarDate.getMonth();const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());let days='';for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=isoDate(d),events=app.data.tasks.filter(t=>taskDate(t)===key);days+=`<div class="day ${d.getMonth()!==m?'other':''} ${key===localToday()?'today':''}"><div class="day-num">${d.getDate()}</div>${events.slice(0,3).map(t=>`<button class="day-event ${({정기:'regular',사건:'trigger',개인:'personal'}[t.type]||'')}" data-task="${t.id}"><span class="tag">[${t.type}]</span> ${escapeHtml(taskDisplay(t).title)}${taskActionHtml(t)}</button>`).join('')}${events.length>3?`<button class="more" data-day="${key}">+${events.length-3}건</button>`:''}</div>`}return `${pageHead('캘린더','정기·사건·공문·개인 일정을 월간으로 확인합니다.',`<button class="btn primary" data-action="quick-event">+ 일정등록</button>`)}<div class="panel"><div class="panel-head"><div class="calendar-tools"><button class="btn" data-cal="prev">‹ 이전달</button><button class="btn" data-cal="today">오늘</button><button class="btn" data-cal="next">다음달 ›</button></div><div class="calendar-title">${y}년 ${m+1}월</div><div></div></div><div class="weekdays">${['일','월','화','수','목','금','토'].map(x=>`<div>${x}</div>`).join('')}</div><div class="calendar-grid">${days}</div></div>`}

/* =========================================================

   EVENT ENGINE / EVENT REGISTRATION

========================================================= */

const eventDefs={new_employee:{label:'신규채용',trigger:'new_employee',fields:[['date','채용일','date'],['job','직종','text'],['work','업무내용','text'],['memo','메모','textarea']]},job_change:{label:'작업내용 변경',trigger:'job_change',fields:[['date','변경일','date'],['job','직종','text'],['oldWork','기존업무','text'],['newWork','변경업무','text'],['memo','메모','textarea']]},contract:{label:'공사·도급',trigger:'contract',fields:[['division','구분','select:공사|용역|도급'],['date','착수일','date'],['endDate','종료예정일','date'],['amount','계약금액','number'],['work','작업내용','text'],['company','업체명','text'],['memo','메모','textarea']]},accident:{label:'산업재해',trigger:'accident',fields:[['date','사고발생일','date'],['worker','근로자구분','text'],['accidentType','사고유형','text'],['leave','휴업여부','select:확인 필요|예|아니오'],['leaveDays','예상휴업일수','number'],['content','사고내용','textarea']]},chemical_product:{label:'신규 화학제품',trigger:'chemical_product',fields:[['product','제품명','text'],['maker','제조사','text'],['place','사용장소','text'],['date','사용시작일','date'],['memo','메모','textarea']]},facility_issue:{label:'시설점검 지적',trigger:'facility_issue',fields:[['date','발견일','date'],['place','장소','text'],['content','지적내용','textarea'],['manager','조치담당','text'],['dueDate','조치기한','date'],['memo','메모','textarea']]},external:{label:'외부기관 점검',trigger:'external',fields:[['date','점검일','date'],['agency','기관명','text'],['content','점검내용','textarea'],['memo','메모','textarea']]},other:{label:'기타',trigger:'other',fields:[['date','발생일','date'],['content','내용','textarea'],['memo','메모','textarea']]}};

function renderEvents(){const recent=app.data.triggerEvents.slice(0,8);return `${pageHead('사건등록','사건을 등록하면 업무원장의 Trigger 규칙에 따라 관련 업무 후보를 생성합니다.',`<button class="btn primary" data-new-event="new_employee">+ 새 사건 등록</button>`)}<div class="settings-grid">${Object.entries(eventDefs).map(([id,d])=>`<button class="setting-card" style="text-align:left" data-new-event="${id}"><span class="badge trigger">사건</span><h3>${d.label}</h3><p>${id==='accident'?'보고대상 여부는 공식 기준 확인이 필요합니다.':'관련 업무를 업무원장에서 찾아 자동 생성합니다.'}</p><span class="btn">등록하기</span></button>`).join('')}</div><div class="panel" style="margin-top:18px"><div class="panel-head"><h3>최근 등록 사건</h3></div>${recent.length?`<table class="data-table"><thead><tr><th>종류</th><th>기준일</th><th>등록일시</th><th>생성업무</th></tr></thead><tbody>${recent.map(e=>`<tr><td>${escapeHtml(e.kind)}</td><td>${fmtDate(e.date)}</td><td>${new Date(e.createdAt).toLocaleString('ko-KR')}</td><td>${e.createdTaskCount}건</td></tr>`).join('')}</tbody></table>`:`<div class="empty">등록된 사건이 없습니다.</div>`}</div>`}

function fieldHtml([name,label,type]){if(type==='textarea')return `<div class="field full"><label>${label}</label><textarea name="${name}"></textarea></div>`;if(type.startsWith('select:'))return `<div class="field"><label>${label}</label><select name="${name}">${type.slice(7).split('|').map(x=>`<option>${x}</option>`).join('')}</select></div>`;return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" ${type==='date'?'value="'+localToday()+'"':''}></div>`}

function openEventForm(kind){const d=eventDefs[kind];modal(`사건등록 · ${d.label}`,`<form id="eventForm" class="form-grid" data-kind="${kind}">${d.fields.map(fieldHtml).join('')}</form>${kind==='accident'||kind==='contract'?'<div class="notice" style="margin-top:15px">적용 조건이나 법적 보고대상 여부를 프로그램이 확정하지 않습니다. 생성 업무는 ‘확인필요’ 상태로 표시됩니다.</div>':''}`,`<button class="btn" data-close>취소</button><button class="btn primary" data-submit-event>등록하고 업무 생성</button>`)}

async function submitEvent(){const form=document.getElementById('eventForm'),kind=form.dataset.kind,def=eventDefs[kind],values=Object.fromEntries(new FormData(form));const date=values.date||localToday();const event={id:uuid(),kind:def.label,type:kind,date,data:values,createdAt:new Date().toISOString(),createdTaskCount:0};app.data.triggerEvents.unshift(event);let count;if(kind==='facility_issue'){const master=app.data.taskMaster.find(m=>m.triggerType==='facility_issue'&&m.active);if(master){const t=masterToTask(master,{date,dueDate:values.dueDate||'',sourceEventId:event.id});t.name=`시설점검 후속조치 · ${values.place||'장소 미입력'}`;t.responsible=values.manager||t.responsible;t.description=values.content||t.description;app.data.tasks.unshift(t);app.syncChecklist(t);count=1}else count=0}else count=addMasterTriggeredTasks(def.trigger,event,date);event.createdTaskCount=count;await app.save();closeOverlay();app.page='work';app.period='all';app.summaryFilter=null;toast(`상황을 등록하고 관련 업무 ${count}건을 생성했습니다.`);render()}

/* =========================================================

   ALL TASKS

========================================================= */

function renderAll(){let list=[...app.data.tasks].filter(t=>(app.allType==='전체'||t.type===app.allType)&&(app.allStatus==='전체'||statusOf(t)===app.allStatus)&&(!app.search||taskSearchText(t).toLowerCase().includes(app.search.toLowerCase())));list.sort(app.sort==='name'?(a,b)=>taskDisplay(a).title.localeCompare(taskDisplay(b).title,'ko'):app.sort==='recent'?(a,b)=>b.createdAt.localeCompare(a.createdAt):(a,b)=>(taskDate(a)||'9999').localeCompare(taskDate(b)||'9999'));return `${pageHead('전체업무','검색·필터·정렬로 모든 업무를 한 번에 확인합니다.')}<div class="filters"><input id="taskSearch" placeholder="업무명 또는 분류 검색" value="${escapeHtml(app.search)}"><select id="typeFilter">${['전체','정기','사건','공문','개인'].map(x=>`<option ${app.allType===x?'selected':''}>${x}</option>`)}</select><select id="statusFilter">${['전체','예정','임박','진행','완료','지연','확인필요'].map(x=>`<option ${app.allStatus===x?'selected':''}>${x}</option>`)}</select><select id="sortFilter"><option value="due" ${app.sort==='due'?'selected':''}>마감임박순</option><option value="recent" ${app.sort==='recent'?'selected':''}>최근등록순</option><option value="name" ${app.sort==='name'?'selected':''}>업무명순</option></select><span class="subtle">${list.length}건</span></div><div class="panel table-wrap"><table class="data-table"><thead><tr><th>상태</th><th>업무명</th><th>분류</th><th>유형</th><th>발생일</th><th>마감일</th><th>D-Day</th><th>진행률</th><th>근거확인</th></tr></thead><tbody>${list.map(t=>{const p=progressOf(t);return `<tr data-task="${t.id}"><td>${statusBadge(statusOf(t))}</td><td><strong>${escapeHtml(taskDisplay(t).title)}</strong>${taskActionHtml(t)}</td><td>${escapeHtml(t.category||'-')}</td><td>${typeBadge(t.type)}</td><td>${fmtDate(t.date)}</td><td>${fmtDate(t.dueDate)}</td><td>${t.dueDate?dDay(t.dueDate):'-'}</td><td><div>${p.done}/${p.total} · ${p.pct}%</div><div class="progress"><i style="width:${p.pct}%"></i></div></td><td>${t.requiresReview?'<span class="badge review">공식 근거 확인 필요</span>':'<span class="badge done">확인</span>'}</td></tr>`}).join('')}</tbody></table>${list.length?'':'<div class="empty">검색 조건에 맞는 업무가 없습니다.</div>'}</div>`}

/* =========================================================

   통합 홈 / 스마트 일정·업무관리

========================================================= */

function summaryTasks(kind){return app.data.tasks.filter(t=>{const status=statusOf(t),diff=dayDiff(taskDate(t));if(kind==='today')return diff===0&&status!=='완료';if(kind==='week')return diff!==null&&diff>=0&&diff<=7&&status!=='완료';if(kind==='late')return status==='지연';if(kind==='review')return status==='확인필요'||t.requiresReview;return true})}

function nextAction(t){if(t.completedByUser)return '완료 취소 또는 이력 확인';const next=(t.checklist||[]).find(x=>!x.done);if(next)return next.label;if(t.requiresReview)return '근거·적용 대상 확인';return '업무 완료 버튼 누르기'}

function periodMatch(t){const key=taskDate(t),today=localToday(),diff=dayDiff(key),status=statusOf(t);if(app.period==='all')return true;if(app.period==='today')return (diff===0||status==='지연')&&status!=='완료';if(app.period==='week')return diff!==null&&diff>=0&&diff<=7;if(app.period==='month')return monthKey(key)===monthKey(today);if(app.period==='custom')return (!app.customFrom||key>=app.customFrom)&&(!app.customTo||key<=app.customTo);return true}

function getFilteredTasks(){let list=app.data.tasks.filter(t=>periodMatch(t)&&(app.allType==='전체'||t.type===app.allType)&&(app.allStatus==='전체'||statusOf(t)===app.allStatus)&&(!app.search||taskSearchText(t).toLowerCase().includes(app.search.toLowerCase())));if(app.summaryFilter)list=list.filter(t=>summaryTasks(app.summaryFilter).some(x=>x.id===t.id));list.sort(app.sort==='name'?(a,b)=>taskDisplay(a).title.localeCompare(taskDisplay(b).title,'ko'):app.sort==='recent'?(a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''):(a,b)=>(taskDate(a)||'9999').localeCompare(taskDate(b)||'9999'));return list}

function filterLabel(){const period={today:'오늘 + 지연',week:'이번 주',month:'이번 달',all:'전체',custom:`${fmtDate(app.customFrom)} ~ ${fmtDate(app.customTo)}`}[app.period],summary=app.summaryFilter?{today:'오늘',week:'7일 이내',late:'지연',review:'확인필요'}[app.summaryFilter]:'';return [summary&&`요약: ${summary}`,`기간: ${period}`,app.allStatus!=='전체'&&`상태: ${app.allStatus}`,app.allType!=='전체'&&`유형: ${app.allType}`,app.search&&`검색: “${app.search}”`].filter(Boolean).join(' · ')}

function smartHead(){return pageHead('스마트 일정·업무관리','업무를 찾고, 필요한 조치를 수행하고, 완료 여부를 한곳에서 관리합니다.',`<div class="head-action-group"><button class="btn navy action-button" data-action="situation"><span class="action-plus">＋</span><span>상황 발생 등록<small>신규채용·공사·산업재해 등</small></span></button><button class="btn action-button secondary" data-action="quick-event"><span class="action-plus">＋</span><span>일정 추가<small>공문 또는 개인 일정 직접 입력</small></span></button></div>`)}

function homeDateLabel(){return new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit',weekday:'long'}).format(new Date())}

function homeTaskList(kind){let list=app.data.tasks.filter(t=>statusOf(t)!=='완료');if(kind==='today')list=list.filter(t=>dayDiff(taskDate(t))===0);if(kind==='week')list=list.filter(t=>{const d=dayDiff(taskDate(t));return d!==null&&d>=0&&d<=7});const rank={지연:0,확인필요:1,임박:2,진행:3,예정:4};return list.sort((a,b)=>(rank[statusOf(a)]??9)-(rank[statusOf(b)]??9)||(taskDate(a)||'9999').localeCompare(taskDate(b)||'9999')).slice(0,3)}

function homeTaskRows(list){if(!list.length)return `<div class="home-empty">해당 조건의 업무가 없습니다.<br><span class="subtle">일정·업무관리에서 상황이나 일정을 등록해 주세요.</span></div>`;return `<div class="home-task-list">${list.map(t=>`<div class="home-task-row"><span class="home-task-check"></span><span class="home-task-copy"><strong>${escapeHtml(taskDisplay(t).title)}</strong>${taskActionHtml(t)}<span>${escapeHtml(nextAction(t))}</span></span>${statusBadge(statusOf(t))}<span class="home-task-date">${fmtDate(taskDate(t))}</span><button class="home-task-action ${statusOf(t)==='예정'?'outline':''}" data-task="${t.id}">${statusOf(t)==='지연'?'조치 등록':statusOf(t)==='진행'?'이어서':'업무 보기'} ›</button></div>`).join('')}</div>`}

function renderHome(){const late=summaryTasks('late').length,today=summaryTasks('today').length,week=summaryTasks('week').length,list=homeTaskList(app.homeTab),upcoming=app.data.tasks.filter(t=>{const d=dayDiff(taskDate(t));return statusOf(t)!=='완료'&&d!==null&&d>=0}).sort((a,b)=>(taskDate(a)||'9999').localeCompare(taskDate(b)||'9999'))[0],formCount=app.data.taskMaster.filter(m=>m.relatedForms).length,inspection=app.data.tasks.filter(t=>statusOf(t)!=='완료'&&String(t.category).includes('시설')).length,msds=app.data.taskMaster.filter(m=>String(m.category).includes('화학')).length;return `<div class="home-head"><div class="home-title-line"><h2>오늘의 안전보건 업무</h2><span class="home-date">${homeDateLabel()}</span></div><button class="btn primary home-register" data-page="work">＋ 업무 등록</button></div><div class="home-metrics"><button class="home-metric danger" data-open-summary="late"><span class="home-metric-icon">!</span><span><span class="home-metric-label">기한 경과</span><span class="home-metric-value">${late}건</span></span></button><button class="home-metric" data-open-summary="today"><span class="home-metric-icon">▦</span><span><span class="home-metric-label">오늘 처리</span><span class="home-metric-value">${today}건</span></span></button><button class="home-metric" data-open-summary="week"><span class="home-metric-icon">▤</span><span><span class="home-metric-label">7일 이내 마감</span><span class="home-metric-value">${week}건</span></span></button></div><div class="home-primary-grid"><section class="home-dashboard-card"><div class="home-card-head"><div class="home-card-title"><span class="home-card-icon">▦</span><span><h3>일정·업무관리</h3><p>중요한 안전보건 업무를 놓치지 않도록 관리합니다.</p></span></div><button class="outline-link" data-page="work">전체 보기 ›</button></div><div class="home-tabs">${[['priority','우선 처리'],['today','오늘'],['week','7일 이내']].map(([id,label])=>`<button class="${app.homeTab===id?'active':''}" data-home-tab="${id}">${label}</button>`).join('')}</div>${homeTaskRows(list)}${upcoming?`<button class="home-upcoming" data-task="${upcoming.id}"><strong>▦ 다가오는 일정</strong><span>${fmtDate(taskDate(upcoming))}</span><span>${escapeHtml(upcoming.name)}</span><span>›</span></button>`:''}</section><section class="home-dashboard-card chat-home"><div class="home-card-head"><div class="home-card-title"><span class="home-card-icon">●</span><span><h3>근거 기반 업무지원 챗봇</h3><p>관련 법령·지침과 필요한 서식을 함께 찾아드립니다.</p></span></div><button class="outline-link" data-page="chatbot">챗봇 열기 ›</button></div><div class="chat-hero"><div class="bot-illustration">🤖</div><div><h3>어떤 업무를 도와드릴까요?</h3><div class="chat-suggestions"><button data-page="chatbot">신규 채용자 교육</button><button data-page="chatbot">산업재해 처리 절차</button><button data-page="chatbot">공사·도급 업무</button></div></div></div><div class="chat-input"><input aria-label="챗봇 질문" placeholder="궁금한 업무를 입력하세요." readonly><button class="chat-send" data-page="chatbot">➤</button></div><div class="chat-foot">💡 답변과 함께 관련 근거·서식을 확인하세요. 현재 기능 연결 준비 중입니다.</div></section></div><div class="home-module-grid"><section class="home-module"><div class="home-card-head"><div class="home-card-title"><span class="home-card-icon">▤</span><span><h3>대표서식 자동화</h3><p>자주 사용하는 서식을 쉽고 빠르게 작성합니다.</p></span></div><button class="outline-link" data-page="forms">전체 서식 ›</button></div><div class="module-items"><div class="module-item"><i></i>점검 결과·개선조치서</div><div class="module-item"><i></i>안전보건교육 기록부</div><div class="module-item"><i></i>MSDS 관리대장</div></div><div class="module-actions"><button class="btn primary" data-page="forms">연결 가능한 서식 ${formCount}개</button></div></section><section class="home-module"><div class="home-card-head"><div class="home-card-title"><span class="home-card-icon teal">☑</span><span><h3>시설안전 점검이력</h3><p>점검 결과와 후속조치를 관리합니다.</p></span></div><button class="outline-link" data-page="inspection">전체 이력 ›</button></div><div class="module-stat-row"><div class="module-stat warn"><span>미조치</span><strong>${inspection}건</strong></div><div class="module-stat danger"><span>재점검 필요</span><strong>${app.data.tasks.filter(t=>t.requiresReview&&String(t.category).includes('시설')).length}건</strong></div></div><div class="module-items"><div class="module-item"><i></i>시설점검 결과와 조치상태 확인</div></div><div class="module-actions"><button class="btn primary" data-page="inspection">＋ 점검 등록</button></div></section><section class="home-module"><div class="home-card-head"><div class="home-card-title"><span class="home-card-icon">⚗</span><span><h3>MSDS 업무지원</h3><p>화학물질을 안전하게 관리하도록 지원합니다.</p></span></div><button class="outline-link" data-page="msds">전체 제품 ›</button></div><div class="module-stat-row"><div class="module-stat"><span>관리 항목</span><strong>${msds}개</strong></div><div class="module-stat warn"><span>확인 필요</span><strong>${app.data.taskMaster.filter(m=>String(m.category).includes('화학')&&m.verificationStatus!=='confirmed').length}건</strong></div></div><div class="module-items"><div class="module-item"><i></i>신규 화학제품·MSDS 확인 업무</div></div><div class="module-actions"><button class="btn primary" data-page="msds">＋ 제품 등록</button><button class="btn" data-page="msds">제품·MSDS 검색</button></div></section></div>`}

function toolbarHtml(){return `<div class="work-toolbar"><div class="toolbar-row"><span class="control-label">기간</span><div class="period-group">${[['today','오늘'],['week','이번 주'],['month','이번 달'],['all','전체'],['custom','직접 지정']].map(([id,label])=>`<button class="${app.period===id?'active':''}" data-period="${id}">${label}</button>`).join('')}</div>${app.period==='custom'?`<span class="custom-dates"><input id="customFrom" type="date" aria-label="시작일" value="${app.customFrom}"><span>~</span><input id="customTo" type="date" aria-label="종료일" value="${app.customTo}"></span>`:''}<div class="view-toggle" style="margin-left:auto"><button class="${app.viewMode==='list'?'active':''}" data-view-mode="list">☷ 목록</button><button class="${app.viewMode==='calendar'?'active':''}" data-view-mode="calendar">□ 캘린더</button></div></div><div class="toolbar-row"><input class="search-box" id="taskSearch" aria-label="업무명 검색" placeholder="업무명 검색" value="${escapeHtml(app.search)}"><select id="statusFilter" aria-label="상태 필터">${['전체','예정','임박','진행','완료','지연','확인필요'].map(x=>`<option ${app.allStatus===x?'selected':''}>${x}</option>`).join('')}</select><select id="typeFilter" aria-label="업무유형 필터">${['전체','정기','사건','공문','개인'].map(x=>`<option ${app.allType===x?'selected':''}>${x}</option>`).join('')}</select><select id="sortFilter" aria-label="정렬"><option value="due" ${app.sort==='due'?'selected':''}>마감임박순</option><option value="recent" ${app.sort==='recent'?'selected':''}>최근등록순</option><option value="name" ${app.sort==='name'?'selected':''}>업무명순</option></select></div></div>`}

function workTable(list){if(!list.length)return `<div class="empty-state"><div class="empty-icon">⌕</div><h3>${app.data.tasks.length?'검색 결과가 없습니다':'등록된 업무가 없습니다'}</h3><p>${app.data.tasks.length?'기간·검색어·필터 조건을 바꾸거나 조건을 해제해 보세요.':'상황 발생 등록 또는 일정 추가로 첫 업무를 만들어 보세요.'}</p>${app.data.tasks.length?'<button class="btn" data-clear-filters>모든 조건 해제</button>':'<button class="btn primary" data-action="quick-event">＋ 일정 추가</button>'}</div>`;return `<div class="table-wrap"><table class="work-table"><thead><tr><th>업무명</th><th>업무유형</th><th>마감일 · D-Day</th><th>상태</th><th>체크리스트</th><th>다음 행동</th><th></th></tr></thead><tbody>${list.map(t=>{const p=progressOf(t);return `<tr data-task="${t.id}" tabindex="0"><td><span class="work-name">${escapeHtml(taskDisplay(t).title)}</span><span class="subtle">${escapeHtml(t.category||'분류 없음')}</span></td><td>${typeBadge(t.type)}</td><td><div class="date-stack"><strong>${fmtDate(t.dueDate||t.date)}</strong><span class="${statusOf(t)==='지연'?'danger-inline':'subtle'}">${t.dueDate?dDay(t.dueDate):'일정일'}</span></div></td><td>${statusBadge(statusOf(t))}</td><td><div class="progress-label"><span>${p.done}/${p.total}</span><span>${p.pct}%</span></div><div class="progress"><i style="width:${p.pct}%"></i></div></td><td><span class="next-action">${escapeHtml(nextAction(t))}</span></td><td><button class="btn" data-task="${t.id}">업무 열기</button></td></tr>`}).join('')}</tbody></table></div>`}

function renderWorkList(list){if(app.period==='today'&&!app.summaryFilter&&app.allStatus==='전체'){const late=list.filter(t=>statusOf(t)==='지연'),today=list.filter(t=>statusOf(t)!=='지연');return `<div class="panel">${late.length?`<div class="section-label late-section"><h3>지연 업무</h3><span>${late.length}건 · 완료 전까지 자동으로 사라지지 않습니다</span></div>${workTable(late)}`:''}<div class="section-label"><h3>오늘 업무</h3><span>${today.length}건</span></div>${workTable(today)}</div>`}return `<div class="panel"><div class="section-label"><h3>업무 목록</h3><span>${list.length}건</span></div>${workTable(list)}</div>`}

function renderWorkCalendar(list){const y=app.calendarDate.getFullYear(),m=app.calendarDate.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());let days='';for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=isoDate(d),items=[];list.forEach(t=>{if(t.date===key)items.push({task:t,kind:'schedule'});if(t.dueDate===key)items.push({task:t,kind:'deadline'})});days+=`<div class="day ${d.getMonth()!==m?'other':''} ${key===localToday()?'today':''}"><div class="day-num">${d.getDate()}</div>${items.slice(0,4).map(({task,kind})=>`<button class="day-event ${kind}" data-task="${task.id}" title="${kind==='schedule'?'일정일':'마감일'} · ${escapeHtml(task.name)}"><span class="event-kind">${kind==='schedule'?'일정':'마감'}</span>${escapeHtml(scheduleCalendarLabel(task))}</button>`).join('')}${items.length>4?`<button class="more" data-day="${key}">+${items.length-4}건</button>`:''}</div>`}return `<div class="panel"><div class="panel-head"><div class="calendar-tools"><button class="btn" data-cal="prev">‹ 이전달</button><button class="btn" data-cal="today">오늘</button><button class="btn" data-cal="next">다음달 ›</button></div><div class="calendar-title">${y}년 ${m+1}월</div><div class="calendar-legend"><span><i class="legend-mark schedule"></i>일정일</span><span><i class="legend-mark deadline"></i>마감일</span></div></div><div class="weekdays">${['일','월','화','수','목','금','토'].map(x=>`<div>${x}</div>`).join('')}</div><div class="calendar-grid">${days}</div></div>`}

function renderWork(){const defs=[['today','오늘'],['week','7일 이내'],['late','지연'],['review','확인필요']],list=getFilteredTasks();return `${smartHead()}<div class="cards four">${defs.map(([id,label])=>`<button class="metric ${id==='late'?'late-card':id==='review'?'review-card':''} ${app.summaryFilter===id||(!app.summaryFilter&&app.period==='today'&&id==='today')?'active':''}" data-filter-card="${id}"><div class="label">${label}</div><div class="value"><b>${summaryTasks(id).length}</b><span>건</span></div><div class="hint">클릭하여 목록에 적용</div></button>`).join('')}</div>${toolbarHtml()}<div class="filter-banner"><span><strong>적용 중인 조건</strong> · ${escapeHtml(filterLabel())}</span><button data-clear-filters>조건 해제</button></div>${app.viewMode==='list'?renderWorkList(list):renderWorkCalendar(list)}`}

function openSituationHub(){const recent=app.data.triggerEvents.slice(0,6);modal('상황 발생 등록',`<p class="subtle" style="margin-top:0">신규채용·공사·산업재해 등을 등록하면 업무원장 규칙에 따라 관련 업무 후보와 체크리스트를 생성합니다.</p><div class="settings-grid">${Object.entries(eventDefs).map(([id,d])=>`<button class="setting-card" style="text-align:left" data-new-event="${id}"><span class="badge trigger">상황</span><h3>${d.label}</h3><p>${id==='accident'||id==='contract'?'적용 조건은 확인필요로 생성됩니다.':'업무원장의 연결 규칙을 사용합니다.'}</p><span class="btn">선택</span></button>`).join('')}</div>${recent.length?`<div class="detail-section"><h4>최근 등록 이력</h4><table class="data-table"><thead><tr><th>종류</th><th>기준일</th><th>생성업무</th></tr></thead><tbody>${recent.map(e=>`<tr><td>${escapeHtml(e.kind)}</td><td>${fmtDate(e.date)}</td><td>${e.createdTaskCount}건</td></tr>`).join('')}</tbody></table></div>`:''}`,'<button class="btn" data-close>닫기</button>','wide')}

/* =========================================================

   TASK DETAIL — 체크, 완료, 취소, 수정, 삭제

========================================================= */

function resourceHtml(title,value,kind){const text=value||`${kind} 연결 준비 중`,url=/^https?:\/\//i.test(text)?text:'';return `<div class="resource-row"><div class="resource-meta"><strong>${escapeHtml(title)}</strong><span class="ready-label">${escapeHtml(text)}</span></div>${url?`<a class="btn" href="${escapeHtml(url)}" target="_blank" rel="noopener">자료 열기</a>`:'<span class="badge">연결 준비</span>'}</div>`}

function openTask(id){const t=app.data.tasks.find(x=>x.id===id);if(!t)return;const p=progressOf(t),s=statusOf(t),history=app.data.taskHistory.filter(h=>h.taskId===id).slice(0,12),steps=(t.checklist||[]).map((x,i)=>`${i+1}. ${x.label}`).join('\n')||'별도 처리 절차 없음';document.getElementById('overlay').innerHTML=`<div class="drawer-wrap" data-close-overlay><aside class="drawer"><div class="drawer-head"><div><span class="kicker">업무 상세</span><h3 style="margin:4px 0 0">처리와 완료 관리</h3></div><button class="close" data-close aria-label="닫기">×</button></div><div class="drawer-body"><h2 class="detail-title">${escapeHtml(taskDisplay(t).title)}</h2><div class="detail-badges">${statusBadge(s)}${t.dueDate?`<span class="badge ${s==='지연'?'late':''}">${dDay(t.dueDate)}</span>`:''}${typeBadge(t.type)}${t.requiresReview?'<span class="badge review">근거 확인필요</span>':''}</div><div class="drawer-summary"><div class="summary-cell"><span>대상</span><strong>${escapeHtml(t.target||'대상 확인 필요')}</strong></div><div class="summary-cell"><span>담당</span><strong>${escapeHtml(t.responsible||'담당 확인 필요')}</strong></div><div class="summary-cell"><span>일정일</span><strong>${fmtDate(t.date)}</strong></div><div class="summary-cell"><span>마감일</span><strong>${fmtDate(t.dueDate)} ${t.dueDate?'· '+dDay(t.dueDate):''}</strong></div></div><div class="detail-section"><h4><span class="num">1</span>업무 개요와 대상</h4><p>${escapeHtml(t.description||'업무 설명이 없습니다.')}\n대상: ${escapeHtml(t.target||'확인 필요')}</p></div><div class="detail-section"><h4><span class="num">2</span>일정 및 마감일</h4><p>일정일: ${fmtDate(t.date)}\n마감일: ${fmtDate(t.dueDate)}${t.dueDate?' ('+dDay(t.dueDate)+')':''}\n날짜가 지나도 자동 완료되지 않습니다.</p></div><div class="detail-section"><h4><span class="num">3</span>처리 절차</h4><p>${escapeHtml(steps)}</p></div><div class="detail-section"><h4><span class="num">4</span>필수 체크리스트</h4><div class="status-line" style="margin-bottom:9px">${statusBadge(s)} <strong>${p.done}/${p.total} · ${p.pct}%</strong></div>${(t.checklist||[]).length?(t.checklist||[]).map(x=>`<label class="check-item"><input type="checkbox" data-check-task="${t.id}" data-check="${x.id}" ${x.done?'checked':''} ${t.completedByUser?'disabled':''}><span>${escapeHtml(x.label)}${x.required!==false?' <span class="subtle">(필수)</span>':''}</span></label>`).join(''):'<p>체크리스트가 없는 직접 입력 일정입니다.</p>'}</div><div class="detail-section"><h4><span class="num">5</span>관련 서식</h4>${resourceHtml('관련 서식',t.forms,'서식')}</div><div class="detail-section"><h4><span class="num">6</span>법령·지침 근거와 확인 상태</h4>${resourceHtml(t.source?.name||'공식 근거',t.source?.url||`${t.source?.article||'조문 확인 필요'}`,'근거')}<div class="notice" style="margin-top:9px">${t.requiresReview?'적용 대상이나 공식 근거 검토가 필요합니다. 확인 전에는 확정된 법정 기한으로 사용하지 마세요.':'업무원장에서 확인된 상태입니다. 최신 자료 여부는 담당자가 주기적으로 확인하세요.'}</div></div><div class="detail-section"><h4><span class="num">7</span>처리 이력</h4>${history.length?`<div class="history-list">${history.map(h=>`<div class="history-item"><i class="history-dot"></i><span>${escapeHtml(h.action)}</span><time>${new Date(h.at).toLocaleString('ko-KR')}</time></div>`).join('')}</div>`:'<p>아직 처리 이력이 없습니다.</p>'}</div><div class="detail-actions"><button class="btn" data-edit-task="${t.id}">일정 수정</button>${t.completedByUser?`<button class="btn" data-reopen="${t.id}">완료 취소</button>`:`<button class="btn primary" data-complete="${t.id}" ${p.all?'':'disabled'}>${p.all?'업무 완료':'필수 체크 후 완료'}</button>`}<button class="btn danger" data-delete-task="${t.id}">일정 삭제</button></div></div></aside></div>`}

async function toggleCheck(taskId,checkId,done){const t=app.data.tasks.find(x=>x.id===taskId),item=t?.checklist.find(x=>x.id===checkId);if(!item)return;item.done=done;app.syncChecklist(t);app.history(t.id,`${item.label} ${done?'완료':'취소'}`);await app.save();openTask(taskId)}

function openTaskEdit(id){const t=app.data.tasks.find(x=>x.id===id);modal('일정 수정',`<form id="taskEdit" class="form-grid" data-id="${id}"><div class="field full"><label>업무명</label><input name="name" value="${escapeHtml(taskDisplay(t).title)}" required></div><div class="field"><label>발생/예정일</label><input type="date" name="date" value="${t.date||''}"></div><div class="field"><label>마감일</label><input type="date" name="dueDate" value="${t.dueDate||''}"></div><div class="field"><label>분류</label><input name="category" value="${escapeHtml(t.category||'')}"></div><div class="field"><label>담당</label><input name="responsible" value="${escapeHtml(t.responsible||'')}"></div><div class="field full"><label>메모</label><textarea name="memo">${escapeHtml(t.memo||'')}</textarea></div></form>`,`<button class="btn" data-close>취소</button><button class="btn primary" data-save-task>저장</button>`)}

/* =========================================================

   TASK MASTER — 원장 표시·수정·활성화·정기업무 생성

========================================================= */

function recurrenceLabel(m){return m.recurrenceType?`${m.recurrenceType}${m.recurrenceInterval?' / '+m.recurrenceInterval:''}`:'-' }

function renderMaster(){return `${pageHead('업무원장','업무 생성의 기준이 되는 핵심 데이터입니다. 일반 사용자가 직접 수정할 수 있습니다.',`<button class="btn" data-export-csv>CSV 내보내기</button><button class="btn" data-import-csv>CSV 가져오기</button>`)}<div class="notice" style="margin-bottom:15px">매뉴얼 대조 업무원장 88개 항목 반영 · 확인필요 항목은 공식 자료 검토 후 사용하세요.</div><div class="panel table-wrap"><table class="data-table"><thead><tr><th>업무명</th><th>분류</th><th>유형</th><th>주기</th><th>Trigger</th><th>검토상태</th><th>활성상태</th><th>관리</th></tr></thead><tbody>${app.data.taskMaster.map(m=>`<tr><td><strong>${escapeHtml(masterDisplay(m).title)}</strong><br><small>${escapeHtml(m.subTaskName||m.taskName)}</small><br><small>${escapeHtml(m.verifiedRelatedForms||m.relatedForms||'서식 확인 필요')}</small><br><span class="subtle">${m.taskCode} · 명칭 원문 ${masterDisplay(m).status==='confirmed'?'확인완료':'확인 필요'}</span></td><td>${escapeHtml(m.category)}</td><td>${typeBadge(m.taskType)}</td><td>${recurrenceLabel(m)}</td><td>${escapeHtml(m.triggerType||'-')}</td><td>${m.verificationStatus==='confirmed'?'<span class="badge done">확인완료</span>':m.verificationStatus==='inactive'?'<span class="badge">미사용</span>':'<span class="badge review">검토필요</span>'}</td><td><span class="master-active"><button class="toggle ${m.active?'on':''}" data-toggle-master="${m.taskCode}"><i></i></button>${m.active?'활성':'비활성'}</span></td><td><button class="btn" data-view-master="${m.taskCode}">보기</button> <button class="btn" data-edit-master="${m.taskCode}">수정</button></td></tr>`).join('')}</tbody></table></div>`}

function masterForm(m){return `<form id="masterForm" data-code="${m.taskCode}" class="form-grid"><div class="field full"><label>업무명</label><input name="taskName" value="${escapeHtml(m.taskName)}" required></div><div class="field full"><label>업무설명</label><textarea name="description">${escapeHtml(m.description||'')}</textarea></div><div class="field"><label>주기</label><select name="recurrenceType">${['','weekly','monthly','quarterly','halfyear','yearly','custom'].map(x=>`<option ${m.recurrenceType===x?'selected':''}>${x}</option>`)}</select></div><div class="field"><label>반복간격</label><input name="recurrenceInterval" type="number" value="${escapeHtml(m.recurrenceInterval||'')}"></div><div class="field"><label>기준일 유형</label><input name="baseDateType" value="${escapeHtml(m.baseDateType||'')}"></div><div class="field"><label>기한(기준일 + 일수)</label><input name="dueOffsetDays" type="number" value="${escapeHtml(m.dueOffsetDays??'')}"></div><div class="field full"><label>체크리스트 (한 줄에 하나)</label><textarea name="checklistItems">${escapeHtml((m.checklistItems||[]).join('\n'))}</textarea></div><div class="field full"><label>관련서식</label><textarea name="relatedForms">${escapeHtml(m.relatedForms||'')}</textarea></div><div class="field"><label>근거명</label><input name="sourceName" value="${escapeHtml(m.sourceName||'')}"></div><div class="field"><label>조문</label><input name="sourceArticle" value="${escapeHtml(m.sourceArticle||'')}"></div><div class="field"><label>페이지</label><input name="sourcePage" value="${escapeHtml(m.sourcePage||'')}"></div><div class="field"><label>기준일</label><input type="date" name="sourceDate" value="${m.sourceDate||''}"></div><div class="field"><label>검토상태</label><select name="verificationStatus">${['confirmed','needs_review','inactive'].map(x=>`<option ${m.verificationStatus===x?'selected':''}>${x}</option>`)}</select></div><div class="field"><label>활성상태</label><select name="active"><option value="true" ${m.active?'selected':''}>활성</option><option value="false" ${!m.active?'selected':''}>비활성</option></select></div></form>`}

function openMaster(code,edit=false){const m=app.data.taskMaster.find(x=>x.taskCode===code);if(edit)modal('업무원장 수정',masterForm(m),`<button class="btn" data-close>취소</button><button class="btn primary" data-save-master>저장</button>`,'wide');else modal('업무원장 보기',`<h2>${escapeHtml(m.taskName)}</h2><div class="detail-section"><h4>업무 설명</h4><p>${escapeHtml(m.description)}</p></div><div class="two-col"><div class="detail-section"><h4>주기 / 기준</h4><p>${recurrenceLabel(m)}\n기준일: ${escapeHtml(m.baseDateType||'-')}\n기한 offset: ${escapeHtml(m.dueOffsetDays??'-')}</p></div><div class="detail-section"><h4>Trigger</h4><p>${escapeHtml(m.triggerType||'-')}</p></div></div><div class="detail-section"><h4>체크리스트</h4><p>${escapeHtml((m.checklistItems||[]).join('\n'))}</p></div><div class="detail-section"><h4>관련 근거</h4><p>${escapeHtml(m.sourceName||'-')} · ${escapeHtml(m.sourceArticle||'-')}\n기준일 ${fmtDate(m.sourceDate)}</p></div>`,`<button class="btn" data-close>닫기</button><button class="btn primary" data-edit-master="${code}">수정</button>`)}

async function generateRegular(){let count=0,skipped=0;const y=new Date().getFullYear(),m=new Date().getMonth();for(const master of app.data.taskMaster.filter(x=>x.active&&x.taskType==='정기')){if(!master.recurrenceType||master.recurrenceType==='custom'||master.dueOffsetDays===''||master.dueOffsetDays==null){skipped++;continue}let bases=[];if(master.recurrenceType==='weekly'){const d=new Date(y,m,1);while(d.getMonth()===m){bases.push(isoDate(d));d.setDate(d.getDate()+7)}}else if(master.recurrenceType==='monthly')bases=[isoDate(new Date(y,m,1))];else if(master.recurrenceType==='quarterly'&&m%3===0)bases=[isoDate(new Date(y,m,1))];else if(master.recurrenceType==='halfyear'&&[0,6].includes(m))bases=[isoDate(new Date(y,m,1))];else if(master.recurrenceType==='yearly'&&m===0)bases=[isoDate(new Date(y,0,1))];for(const base of bases){const due=addDays(base,master.dueOffsetDays);if(app.data.tasks.some(t=>t.masterCode===master.taskCode&&t.date===base))continue;const t=masterToTask(master,{date:base,dueDate:due});app.data.tasks.unshift(t);app.syncChecklist(t);count++}}await app.save();toast(`${count}건 생성, 설정 미완료 ${skipped}건 제외`);render()}

/* =========================================================

   IMPORT / EXPORT — CSV 및 JSON 백업·복원

========================================================= */

const MASTER_FIELDS=['taskCode','taskName','category','taskType','description','responsible','supporter','target','triggerType','recurrenceType','recurrenceInterval','baseDateType','dueOffsetDays','alertDays','checklistItems','relatedForms','sourceType','sourceName','sourceArticle','sourcePage','sourceDate','verificationStatus','active','version','memo'];

function csvEscape(v){const s=Array.isArray(v)?v.join('|'):String(v??'');return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}

function download(name,content,type='application/octet-stream'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}

function exportCSV(){const rows=[MASTER_FIELDS.join(','),...app.data.taskMaster.map(m=>MASTER_FIELDS.map(f=>csvEscape(m[f])).join(','))];download('업무원장.csv','\ufeff'+rows.join('\r\n'),'text/csv;charset=utf-8');toast('업무원장 CSV를 저장했습니다.')}

function parseCSV(text){const rows=[];let row=[],cell='',q=false;for(let i=0;i<text.length;i++){const c=text[i];if(q){if(c==='"'&&text[i+1]==='"'){cell+='"';i++}else if(c==='"')q=false;else cell+=c}else if(c==='"')q=true;else if(c===','){row.push(cell);cell=''}else if(c==='\n'){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell=''}else cell+=c}if(cell||row.length){row.push(cell);rows.push(row)}return rows}

function importCSVFile(){filePicker('.csv','text',text=>{const rows=parseCSV(text.replace(/^\ufeff/,'')),headers=rows.shift()||[],errors=[],items=[];rows.filter(r=>r.some(Boolean)).forEach((r,i)=>{const o=Object.fromEntries(headers.map((h,j)=>[h.trim(),r[j]??'']));if(!o.taskCode||!o.taskName)errors.push({line:i+2,msg:'taskCode 또는 taskName 누락'});else{o.active=String(o.active).toLowerCase()!=='false';o.checklistItems=String(o.checklistItems||'').split('|').filter(Boolean);o.dueOffsetDays=o.dueOffsetDays===''?'':Number(o.dueOffsetDays);items.push(o)}});window.pendingCSV=items;modal('CSV 가져오기 미리보기',`<div class="status-line"><span class="badge done">정상 ${items.length}행</span><span class="badge ${errors.length?'late':''}">오류 ${errors.length}행</span></div><div class="preview-box" style="margin-top:14px"><table class="data-table"><thead><tr><th>행</th><th>업무코드</th><th>업무명</th><th>결과</th></tr></thead><tbody>${items.slice(0,50).map((x,i)=>`<tr><td>${i+2}</td><td>${escapeHtml(x.taskCode)}</td><td>${escapeHtml(x.taskName)}</td><td>정상</td></tr>`).join('')}${errors.map(e=>`<tr class="error-row"><td>${e.line}</td><td>-</td><td>-</td><td>${e.msg}</td></tr>`).join('')}</tbody></table></div><div class="field" style="margin-top:14px"><label>가져오기 방식</label><select id="csvMode"><option value="replace">기존 원장 전체 교체</option><option value="append">기존 원장에 추가</option></select></div>`,`<button class="btn" data-close>취소</button><button class="btn primary" data-apply-csv ${items.length?'':'disabled'}>적용</button>`,'wide')})}

function backupJSON(){const name=`산업안전업무_백업_${localToday()}.json`;download(name,JSON.stringify({app:'산업안전보건 일정·업무 내비게이터',version:APP_VERSION,exportedAt:new Date().toISOString(),data:app.data},null,2),'application/json;charset=utf-8');toast('전체 데이터 백업파일을 저장했습니다.')}

function restoreJSON(){filePicker('.json','text',text=>{try{const parsed=JSON.parse(text),data=parsed.data||parsed;validateBackup(data);window.pendingRestore=normalizeBackup(data);modal('백업 복원 미리보기',`<div class="notice">현재 데이터와 병합합니다. 동일 ID는 현재 내용을 보존하며 복원 직전 데이터도 복구용으로 보관합니다.</div><table class="data-table" style="margin-top:14px"><tr><th>업무원장</th><td>${data.taskMaster.length}건</td></tr><tr><th>업무</th><td>${data.tasks.length}건</td></tr><tr><th>사건</th><td>${data.triggerEvents.length}건</td></tr><tr><th>공문 일정</th><td>${data.officialEvents.length}건</td></tr><tr><th>개인 일정</th><td>${data.personalEvents.length}건</td></tr></table>`,`<button class="btn" data-close>취소</button><button class="btn primary" data-apply-restore>복원 실행</button>`)}catch(e){toast('복원할 수 없는 JSON: '+e.message)}})}

function filePicker(accept,mode,cb){const i=document.createElement('input');i.type='file';i.accept=accept;i.onchange=()=>{const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>cb(r.result);r.readAsText(f,'utf-8')};i.click()}

/* =========================================================

   SETTINGS

========================================================= */

function settingsOperations(){const recent=app.data.triggerEvents.slice(0,30);return `<div class="settings-grid"><div class="setting-card"><span class="badge regular">정기업무</span><h3>정기업무 생성 규칙 실행</h3><p>활성 상태이며 주기와 기한이 설정된 업무원장 항목으로 현재 달 업무를 생성합니다. 날짜만으로 완료 처리하지 않습니다.</p><button class="btn navy" data-action="generate-regular">현재 달 정기업무 생성</button></div><div class="setting-card"><span class="badge trigger">상황</span><h3>상황 발생 등록</h3><p>업무원장 Trigger 규칙에 따라 관련 업무와 체크리스트를 생성합니다.</p><button class="btn" data-action="situation">상황 등록 열기</button></div></div><div class="panel settings-block"><div class="panel-head"><h3>상황 등록 이력</h3><span class="subtle">최근 ${recent.length}건</span></div>${recent.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>종류</th><th>기준일</th><th>등록일시</th><th>생성 업무</th></tr></thead><tbody>${recent.map(e=>`<tr><td>${escapeHtml(e.kind)}</td><td>${fmtDate(e.date)}</td><td>${new Date(e.createdAt).toLocaleString('ko-KR')}</td><td>${e.createdTaskCount}건</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">등록된 상황 이력이 없습니다.</div>'}</div>`}

function settingsMaster(){return `<div class="notice">매뉴얼 대조 업무원장 88개 항목 반영 · 확인필요 항목은 공식 자료 검토 후 사용하세요.</div><div class="toolbar-row" style="margin:14px 0"><button class="btn" data-export-csv>CSV 내보내기</button><button class="btn primary" data-import-csv>CSV 가져오기</button><span class="subtle">기존 CSV 필드와 저장 구조를 유지합니다.</span></div><div class="panel table-wrap"><table class="data-table"><thead><tr><th>업무명</th><th>분류</th><th>유형</th><th>주기</th><th>연결 규칙</th><th>검토상태</th><th>활성상태</th><th>관리</th></tr></thead><tbody>${app.data.taskMaster.map(m=>`<tr><td><strong>${escapeHtml(masterDisplay(m).title)}</strong><br><small>${escapeHtml(m.subTaskName||m.taskName)}</small><br><small>${escapeHtml(m.verifiedRelatedForms||m.relatedForms||'서식 확인 필요')}</small><br><span class="subtle">${m.taskCode} · 명칭 원문 ${masterDisplay(m).status==='confirmed'?'확인완료':'확인 필요'}</span></td><td>${escapeHtml(m.category)}</td><td>${typeBadge(m.taskType)}</td><td>${recurrenceLabel(m)}</td><td>${escapeHtml(m.triggerType||'-')}</td><td>${m.verificationStatus==='confirmed'?'<span class="badge done">확인완료</span>':m.verificationStatus==='inactive'?'<span class="badge">미사용</span>':'<span class="badge review">확인필요</span>'}</td><td><span class="master-active"><button class="toggle ${m.active?'on':''}" data-toggle-master="${m.taskCode}" aria-label="활성상태 전환"><i></i></button>${m.active?'활성':'비활성'}</span></td><td><button class="btn" data-view-master="${m.taskCode}">보기</button> <button class="btn" data-edit-master="${m.taskCode}">수정</button></td></tr>`).join('')}</tbody></table></div>`}

function settingsData(){return `<div class="notice" style="margin-bottom:16px">현재 저장 방식: <strong>${storageAdapter.mode}</strong> · 데이터는 이 브라우저에만 저장됩니다. 정기적으로 백업 파일을 별도 보관하세요.</div><div class="settings-grid"><div class="setting-card"><h3>전체 데이터 백업</h3><p>업무원장·업무·상황·일정·체크리스트·처리기록을 JSON으로 저장합니다.</p><button class="btn navy" data-backup>전체 데이터 백업</button></div><div class="setting-card"><h3>백업파일 복원</h3><p>기존 버전의 저장 구조를 포함해 필수 컬렉션을 검증한 뒤 복원합니다.</p><button class="btn" data-restore>백업파일 복원</button></div><div class="setting-card"><h3>업무원장 CSV</h3><p>Excel에서 사용할 수 있는 UTF-8 BOM CSV로 내보냅니다.</p><button class="btn" data-export-csv>업무원장 CSV 내보내기</button></div><div class="setting-card danger-zone"><h3>전체 데이터 초기화</h3><p>현재 브라우저 데이터를 삭제하고 제공된 88개 항목 업무원장으로 되돌립니다.</p><button class="btn danger" data-reset>전체 데이터 초기화</button></div></div>`}

function renderSettings(){const tabs=[['operations','업무 생성·이력'],['master','업무원장 관리'],['data','백업·복원']];return `${pageHead('설정','업무원장, 정기업무 생성 규칙, 등록 이력과 데이터를 관리합니다.')}<div class="settings-nav">${tabs.map(([id,label])=>`<button class="btn ${app.settingsTab===id?'active':''}" data-settings-tab="${id}">${label}</button>`).join('')}</div>${app.settingsTab==='master'?settingsMaster():app.settingsTab==='data'?settingsData():settingsOperations()}`}

function openReset(){modal('전체 데이터 초기화',`<div class="notice">이 작업은 현재 브라우저의 업무·사건·일정·기록을 모두 삭제합니다. 계속하려면 아래에 <strong>산업안전</strong>을 입력하세요.</div><div class="field" style="margin-top:14px"><label>확인 문구</label><input id="resetPhrase" autocomplete="off"></div>`,`<button class="btn" data-close>취소</button><button class="btn danger" id="resetConfirm" data-confirm-reset disabled>초기화</button>`)}

/* =========================================================

   MODALS / QUICK SCHEDULE

========================================================= */

function modal(title,body,foot='',cls=''){document.getElementById('overlay').innerHTML=`<div class="modal-backdrop" data-close-overlay><div class="modal ${cls}" onclick="event.stopPropagation()"><div class="modal-head"><h3>${title}</h3><button class="close" data-close>×</button></div><div class="modal-body">${body}</div>${foot?`<div class="modal-foot">${foot}</div>`:''}</div></div>`}

function closeOverlay(){document.getElementById('overlay').innerHTML=''}

function openQuickEvent(){

  modal('일정 추가',`<p class="subtle" style="margin-top:0">공문 일정 또는 개인 일정을 직접 입력합니다. 상황 발생에 따른 업무 생성은 ‘상황 발생 등록’을 이용하세요.</p>

  <form id="quickForm" class="form-grid">

    <div class="field full official-field"><label>공문 파일 자동 입력</label><div class="doc-dropzone" id="docDropzone" tabindex="0" role="button" aria-label="공문 이미지 또는 PDF 선택"><input id="docFileInput" type="file" accept="image/*,.pdf,application/pdf" hidden><strong>공문 캡처 이미지나 PDF를 끌어놓으세요</strong><small>또는 클릭하여 파일 선택 · PDF 본문 추출 및 한글·영문 OCR · 최대 20MB</small></div><div class="doc-status" id="docStatus">파일은 브라우저에서 처리되며 외부 서버로 업로드하지 않습니다.</div><div id="docExtracted"></div></div>

    <div class="field"><label>일정 유형</label><select name="type" id="quickType"><option>공문</option><option>개인</option></select></div>

    <div class="field full"><label id="quickTitleLabel">공문제목</label><input name="title" required></div>

    <div class="field official-field"><label>시행기관</label><input name="agency"></div><div class="field official-field"><label>문서번호</label><input name="documentNo"></div>

    <div class="field official-field"><label>시행일</label><input type="date" name="issueDate" value="${localToday()}"></div><div class="field official-field"><label>제출기한</label><input type="date" name="dueDate" value=""></div>

    <div class="field official-field"><label>담당자</label><input name="manager"></div><div class="field official-field"><label>관련업무</label><input name="related"></div>

    <div class="field personal-field hidden"><label>날짜</label><input type="date" name="date" value="${localToday()}"></div><div class="field personal-field hidden"><label>시간</label><input type="time" name="time"></div><div class="field personal-field hidden"><label>중요도</label><select name="importance"><option>보통</option><option>높음</option><option>낮음</option></select></div>

    <div class="field full"><label>메모</label><textarea name="memo"></textarea></div>

  </form>`,`<button class="btn" data-close>취소</button><button class="btn primary" data-save-quick>일정 저장</button>`);

  document.getElementById('quickForm').addEventListener('input',e=>{if(e.target.name)e.target.dataset.userEdited='true'});
  bindDocumentDropzone();

}

function scheduleCalendarLabel(t){
 const official=['official_pdf_drop','official_image_drop','official_manual'].includes(t.sourceType);
 const legacy=!t.sourceType&&!t.masterCode&&!t.autoGenerated&&!t.occurrenceKey&&!t.workflowKind&&t.origin!=='auto'&&t.type!=='개인'&&(t.type==='공문'||t.category==='공문일정'||(app.data?.officialEvents||[]).some(e=>e.id===t.sourceEventId));
 return official||legacy?'자료제출':t.name||taskDisplay(t).title||'제목 확인 필요';
}
function isDirectSchedule(t){return !t.masterCode&&(['official_pdf_drop','official_image_drop','official_manual','personal_manual'].includes(t.sourceType)||['공문','개인'].includes(t.type)||scheduleCalendarLabel(t)==='자료제출')}
function directDeadlineHtml(t){const d=t.dueDate,label=scheduleCalendarLabel(t)==='자료제출'?'제출 마감일':'마감일';return validDay(d)?escapeHtml(label+' '+d+' · '+dDay(d)):escapeHtml(label+' 확인 필요')}
function migrateScheduleLabels(){
 const officials=new Map(app.data.officialEvents.map(e=>[e.id,e])),personal=new Map(app.data.personalEvents.map(e=>[e.id,e]));
 for(const t of app.data.tasks){
  const e=officials.get(t.sourceEventId)||personal.get(t.sourceEventId);
  if(!t.sourceType&&e){const source=e.sourceType||(personal.has(e.id)?'personal_manual':scheduleCalendarLabel(t)==='자료제출'?(/\.pdf\b/i.test(e.fileName||e.memo||t.memo||'')?'official_pdf_drop':'official_manual'):'');if(source){t.sourceType=source;e.sourceType=source}}
  if(scheduleCalendarLabel(t)==='자료제출'&&t.documentTitleVersion!==2){
   const edited=t.userModified||t.titleEditedByUser||e?.titleEditedByUser||(t.changes||[]).some(c=>c.before?.name!==undefined||c.after?.name!==undefined)||(e?.title&&e.title!==t.name);
   const raw=e?.rawText||t.rawText||'',parsed=raw?parseOfficialDocument(raw):null;
   const current=String(t.name||'').replace(/\s+/g,' ').trim();
   if(!edited){
    const tail=parsed?.title&&current.startsWith(parsed.title)?current.slice(parsed.title.length).trim():'';
    const contaminated=tail&&/^(?:\d+[.)]\s|[가-하][.)]\s|관련\s*[:：]|붙\s*임|제출기한\s*[:：]|담당자\s*[:：])/.test(tail);
    if(parsed&&!parsed.titleNeedsReview&&(current===parsed.title||contaminated)){
     if(contaminated){const before=t.name;t.name=parsed.title;t.changes??=[];t.changes.push({at:new Date().toISOString(),before:{name:before},after:{name:t.name},reason:'공문 원문의 명시된 제목으로 안전 정정'});if(e&&e.title===before)e.title=t.name;}
     t.body=parsed.body;if(e)e.body=parsed.body;t.titleNeedsReview=false;
    }else t.titleNeedsReview=true;
   }
   t.documentTitleVersion=2;if(e){e.documentTitleVersion=2;e.titleNeedsReview=!!t.titleNeedsReview;}
  }
  if(t.sourceType||scheduleCalendarLabel(t)==='자료제출'){t.calendarLabel=scheduleCalendarLabel(t);if(e)e.calendarLabel=t.calendarLabel}
 }
}
let pdfJsPromise=null,ocrWorkerPromise=null;

function setDocStatus(message,state=''){const el=document.getElementById('docStatus');if(el){el.textContent=message;el.className=`doc-status ${state}`}}

function bindDocumentDropzone(){

  const zone=document.getElementById('docDropzone'),input=document.getElementById('docFileInput');if(!zone||!input)return;

  zone.onclick=()=>input.click();zone.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click()}};

  input.onchange=()=>input.files[0]&&handleDocumentFile(input.files[0]);

  ['dragenter','dragover'].forEach(type=>zone.addEventListener(type,e=>{e.preventDefault();zone.classList.add('dragover')}));

  ['dragleave','drop'].forEach(type=>zone.addEventListener(type,e=>{e.preventDefault();zone.classList.remove('dragover')}));

  zone.addEventListener('drop',e=>{const file=e.dataTransfer.files[0];if(file)handleDocumentFile(file)});

}

async function loadPdfJs(){

  if(!pdfJsPromise)pdfJsPromise=import('./vendor/pdfjs/pdf.min.mjs').then(lib=>{lib.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',location.href).href;return lib});

  return pdfJsPromise;

}

function ocrProgress(m){if(!m||!m.status)return;const pct=Number.isFinite(m.progress)?` ${Math.round(m.progress*100)}%`:'';setDocStatus(`문자를 인식하고 있습니다 · ${m.status}${pct}`,'working')}

async function getOcrWorker(){

  if(!window.Tesseract)throw new Error('OCR 실행 파일을 불러오지 못했습니다.');

  if(!ocrWorkerPromise)ocrWorkerPromise=Tesseract.createWorker(['kor','eng'],1,{workerPath:'./vendor/tesseract/worker.min.js',corePath:'./vendor/tesseract-core',langPath:'./vendor/tessdata',gzip:false,logger:ocrProgress});

  return ocrWorkerPromise;

}

async function ocrImage(source){const worker=await getOcrWorker(),result=await worker.recognize(source);return result.data.text||''}

function pdfPageLines(items){
  const rows=[];
  for(const x of items){if(!x.str?.trim())continue;const y=x.transform?.[5]||0,h=Math.abs(x.height||x.transform?.[3]||10),left=x.transform?.[4]||0;
    let row=rows.find(r=>Math.abs(r.y-y)<=Math.max(2,Math.min(r.h,h)*0.35));
    if(!row){row={y,h,items:[]};rows.push(row)}row.items.push({text:x.str,x:left,width:x.width||0});
  }
  return rows.sort((a,b)=>b.y-a.y).map(r=>r.items.sort((a,b)=>a.x-b.x).map((x,i,a)=>(i&&x.x-(a[i-1].x+a[i-1].width)>1?' ':'')+x.text).join('').trim()).join('\n');
}
async function extractPdfText(file){
  const pdfjs=await loadPdfJs(),pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;let text='',pages=[];
  try{
    for(let i=1;i<=Math.min(pdf.numPages,8);i++){const page=await pdf.getPage(i),content=await page.getTextContent();text+=pdfPageLines(content.items)+'\n';pages.push(page)}
    if(text.replace(/\s/g,'').length>=20)return text;
    setDocStatus('스캔된 PDF입니다. 페이지 이미지를 OCR로 분석합니다.','working');text='';
    for(let i=0;i<Math.min(pages.length,3);i++){const page=pages[i],viewport=page.getViewport({scale:1.8}),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=viewport.width;canvas.height=viewport.height;await page.render({canvasContext:ctx,viewport}).promise;text+=await ocrImage(canvas)+'\n'}
    return text;
  }finally{await pdf.destroy()}
}
function normalizeDocDate(value){

  const n=String(value||'').match(/\d+/g);if(!n||n.length<3)return'';let y=Number(n[0]);if(y<100)y+=2000;const m=Number(n[1]),d=Number(n[2]);if(y<2000||y>2100||m<1||m>12||d<1||d>31)return'';return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

}

function firstMatch(text,patterns){for(const p of patterns){const m=text.match(p);if(m&&m[1])return m[1].trim().replace(/[|]+$/,'')}return''}

function parseOfficialDocument(text,fileName=''){

  const rawText=String(text||''),clean=rawText.replace(/\r/g,'').replace(/[ \t]+/g,' ').trim(),lines=clean.split('\n').map(x=>x.trim()).filter(Boolean);
  const marker=/^(?:문서\s*제\s*목|제\s*목|건\s*명)(?:\s*[:：]\s*|\s+|$)/;
  const numbered=/(?:^|\s)(?:\d+[.)]\s+|[가-하][.)]\s+)/;
  const metadata=/(?:^|\s)(?:관련|수\s*신|참\s*조|시\s*행|붙\s*임|첨부|담당자|문서번호|시행일|제출\s*기한|제출\s*방법)\s*[:：]\s*/;
  const footer=/^(?:붙\s*임|첨부)\s+.+(?:\d+\s*부|끝[.]?)\s*$/;
  const ending=/(?:요청|안내|알림|통보|협조|공고|보고|계획|제출|결과)(?:[.]|\s*)$/;
  const titleIndex=lines.findIndex(x=>marker.test(x));
  let title='',titleNeedsReview=true,body=clean;
  if(titleIndex>=0){
    const parts=[];let bodyIndex=titleIndex+1,bodyRemainder='',bounded=false;
    for(let i=titleIndex;i<lines.length;i++){
      const line=i===titleIndex?lines[i].replace(marker,''):lines[i];
      let boundary=line.search(numbered),meta=line.search(metadata);
      if(meta>=0&&(i>titleIndex||meta>0))boundary=boundary<0?meta:Math.min(boundary,meta);
      if(footer.test(line))boundary=0;
      if(boundary>=0){if(boundary>0)parts.push(line.slice(0,boundary).trim());bodyIndex=i;bodyRemainder=line.slice(boundary).trim();bounded=true;break;}
      if(i>titleIndex&&parts.length&&/(?:요청|안내|알림|통보|협조|공고|보고)[.]?$/.test(parts[parts.length-1])&&!/^(?:및|제출|안내|요청|결과|계획|협조|알림)(?:\s|$)/.test(line)){bodyIndex=i;bodyRemainder=line;bounded=true;break;}
      // Prose after an incomplete title cannot safely be treated as a continuation.
      if(/(?:합니다|바랍니다|드립니다|있습니다|하오니)[.]?$/.test(line)){bodyIndex=i;bodyRemainder=line;break;}
      if(line)parts.push(line);bodyIndex=i+1;
    }
    const candidate=parts.join(' ').replace(/\s+/g,' ').trim();
    titleNeedsReview=!candidate||candidate.length>200||(!bounded&&!ending.test(candidate));
    if(!titleNeedsReview){title=candidate;body=[bodyRemainder,...lines.slice(bodyIndex+(bodyRemainder?1:0))].filter(Boolean).join('\n');}
  }
  const agency=firstMatch(clean,[/(?:시행기관|발신기관|기관명|발\s*신)\s*[:：]?\s*([^\n]{2,60})/i])||lines.slice(0,titleIndex>=0?titleIndex:7).find(x=>x.length<50&&!/^(?:제\s*목|건\s*명|\d+[.)])/.test(x)&&/(교육청|지원청|학교|공단|부|청|과|센터|기관)$/.test(x))||'';

  const documentNo=firstMatch(clean,[/(?:문서번호|시행번호)\s*[:：]?\s*([A-Za-z가-힣0-9_.-]{3,60})/i,/(?:시\s*행)\s*[:：]?\s*([A-Za-z가-힣]+[- ][A-Za-z가-힣0-9_.-]*\d+)/i]);

  const issueRaw=firstMatch(clean,[/(?:시행일|발송일|작성일|일\s*자)\s*[:：]?\s*((?:20)?\d{2}[.\/-년]\s*\d{1,2}[.\/-월]\s*\d{1,2})/i,/(?:시\s*행)[^\n]{0,50}?((?:20)?\d{2}[.\/-년]\s*\d{1,2}[.\/-월]\s*\d{1,2})/i]);

  const dueRaw=firstMatch(clean,[/(?:제출\s*기한|회신\s*기한|제출일|마감일|제출\s*마감일)\s*[:：]?\s*(?:까지\s*)?((?:20)?\d{2}[.\/-년]\s*\d{1,2}[.\/-월]\s*\d{1,2})/i]);

  const manager=firstMatch(clean,[/(?:담당자|담\s*당)\s*[:：]?\s*([가-힣A-Za-z]{2,20})/i]);

  const related=firstMatch(clean,[/(?:관련업무|업무분야|분\s*류)\s*[:：]?\s*([^\n]{2,60})/i]);

  return{title:title.replace(/^[:：\s]+/,''),titleNeedsReview,agency,documentNo,issueDate:normalizeDocDate(issueRaw),dueDate:normalizeDocDate(dueRaw),manager,related,body,attachments:lines.filter(x=>/^붙\s*임/.test(x)).join('\n'),rawText};

}

function applyExtractedDocument(data,file){

  const form=document.getElementById('quickForm'),type=form?.elements.type;if(!form)return;if(type){type.value='공문';type.dispatchEvent(new Event('change',{bubbles:true}))}

  form.documentExtract={...data,fileName:file.name,sourceType:/\.pdf$/i.test(file.name)?'official_pdf_drop':'official_image_drop'};
  if(form.elements.title.dataset.userEdited!=='true'){form.elements.title.value='';form.elements.title.placeholder=data.titleNeedsReview?'제목을 확인하여 직접 입력하세요':'';}
  if(!data.dueDate&&form.elements.dueDate.dataset.userEdited!=='true')form.elements.dueDate.value='';
  let count=0;['title','agency','documentNo','issueDate','dueDate','manager','related'].forEach(name=>{const el=form.elements[name],value=data[name];if(el&&value&&el.dataset.userEdited!=='true'){el.value=value;el.classList.add('auto-filled');count++}});

  const memo=form.elements.memo;if(memo){const note=`첨부 공문 자동분석: ${file.name}`;memo.value=memo.value?memo.value+'\n'+note:note}

  const box=document.getElementById('docExtracted');if(box)box.innerHTML=`<details class="doc-extracted"><summary>추출 원문 확인</summary><pre>${escapeHtml(data.rawText.slice(0,5000))}</pre></details>`;

  return count;

}

async function handleDocumentFile(file){

  if(!file)return;if(file.size>20*1024*1024){setDocStatus('20MB 이하 파일만 사용할 수 있습니다.','error');return}

  const isPdf=file.type==='application/pdf'||/\.pdf$/i.test(file.name),isImage=/^image\/(png|jpeg|webp|bmp)$/i.test(file.type);

  if(!isPdf&&!isImage){setDocStatus('PDF 또는 이미지 파일만 사용할 수 있습니다.','error');return}

  const formAtStart=document.getElementById('quickForm'),readToken=uuid();if(formAtStart)formAtStart.documentReadToken=readToken;
  try{setDocStatus(`${file.name} 분석을 시작합니다.`,'working');const text=isPdf?await extractPdfText(file):await ocrImage(file);if(document.getElementById('quickForm')!==formAtStart||formAtStart.documentReadToken!==readToken)return;if(!text.trim())throw new Error('문자를 찾지 못했습니다. 더 선명한 파일을 사용해 주세요.');const data=parseOfficialDocument(text,file.name),count=applyExtractedDocument(data,file);setDocStatus(`${count}개 항목을 자동 입력했습니다. ${data.titleNeedsReview?'제목을 판별하지 못했습니다. 공문제목을 직접 확인·입력하세요.':'원문과 비교해 날짜·제목을 확인한 뒤 저장하세요.'}`,'success')}

  catch(error){console.error(error);const serverHint=location.protocol==='file:'?' 압축을 모두 풀었는지와 브라우저의 로컬 파일 실행 설정을 확인해 주세요.':'',message=error?.message||String(error||'파일을 읽지 못했습니다');setDocStatus(`자동 분석에 실패했습니다: ${message}.${serverHint}`,'error')}

}

async function saveQuick(){const v=Object.fromEntries(new FormData(document.getElementById('quickForm'))),personal=v.type==='개인';v.title=v.title.trim();if(!v.title){toast('제목을 입력하세요.');return}const extract=document.getElementById('quickForm').documentExtract,sourceType=personal?'personal_manual':extract?.sourceType||'official_manual',calendarLabel=personal?v.title:'자료제출';const event={id:uuid(),...v,sourceType,calendarLabel,titleEditedByUser:document.getElementById('quickForm').elements.title.dataset.userEdited==='true',body:personal?'':extract?.body||'',rawText:personal?'':extract?.rawText||'',attachments:personal?'':extract?.attachments||'',fileName:personal?'':extract?.fileName||'',createdAt:new Date().toISOString()};if(personal)app.data.personalEvents.unshift(event);else app.data.officialEvents.unshift(event);const t={id:uuid(),name:v.title,sourceType,calendarLabel,titleEditedByUser:event.titleEditedByUser,documentTitleVersion:2,titleNeedsReview:false,body:event.body,time:personal?v.time||'':'',agency:personal?'':v.agency||'',issueDate:personal?'':v.issueDate||'',rawText:event.rawText,category:personal?'개인일정':'공문일정',type:v.type,description:v.memo||`${v.type} 일정입니다.`,responsible:v.manager||'',supporter:'',target:v.related||'',date:personal?v.date:v.issueDate,dueDate:personal?'':v.dueDate,createdAt:new Date().toISOString(),completedAt:null,completedByUser:false,requiresReview:false,verificationStatus:'confirmed',forms:'',source:{},memo:v.memo||'',documentNo:v.documentNo||'',sourceEventId:event.id,linkedTaskId:v.linkedTaskId||null,deadlineKind:personal?'management':'official',originalDate:personal?v.date:v.issueDate,originalDueDate:personal?'':v.dueDate,checklist:personal?[]:[{id:uuid(),label:'내용 확인',required:true,done:false},{id:uuid(),label:'필요 자료 준비',required:true,done:false},{id:uuid(),label:'제출 또는 처리 완료',required:true,done:false}]};app.data.tasks.unshift(t);app.syncChecklist(t);app.history(t.id,'일정 등록');await app.save();closeOverlay();app.page='work';app.period='all';app.summaryFilter=null;toast(`${v.type} 일정을 등록했습니다.`);render()}

/* =========================================================

   EVENT BINDING / INITIALIZATION

========================================================= */

// 반복 간격을 포함해 업무원장 값만으로 현재 달의 정기업무를 생성한다.

generateRegular=async function(){

  let count=0,skipped=0;const now=new Date(),y=now.getFullYear(),m=now.getMonth();

  for(const master of app.data.taskMaster.filter(x=>x.active&&x.taskType==='정기')){

    if(!master.recurrenceType||master.recurrenceType==='custom'||master.dueOffsetDays===''||master.dueOffsetDays==null){skipped++;continue}

    const interval=Math.max(1,Number(master.recurrenceInterval)||1),monthIndex=y*12+m;let bases=[];

    if(master.recurrenceType==='weekly'){

      const d=new Date(y,m,1);while(d.getMonth()===m){bases.push(isoDate(d));d.setDate(d.getDate()+7*interval)}

    }else if(master.recurrenceType==='monthly'&&monthIndex%interval===0)bases=[isoDate(new Date(y,m,1))];

    else if(master.recurrenceType==='quarterly'&&m%3===0&&Math.floor(monthIndex/3)%interval===0)bases=[isoDate(new Date(y,m,1))];

    else if(master.recurrenceType==='halfyear'&&[0,6].includes(m)&&Math.floor(monthIndex/6)%interval===0)bases=[isoDate(new Date(y,m,1))];

    else if(master.recurrenceType==='yearly'&&m===0&&y%interval===0)bases=[isoDate(new Date(y,0,1))];

    for(const base of bases){

      if(app.data.tasks.some(t=>t.masterCode===master.taskCode&&t.date===base))continue;

      const t=masterToTask(master,{date:base,dueDate:addDays(base,master.dueOffsetDays)});app.data.tasks.unshift(t);app.syncChecklist(t);app.history(t.id,'정기업무 생성');count++

    }

  }

  await app.save();toast(`${count}건 생성, 설정 미완료 ${skipped}건 제외`);render()

};

function resetWorkFilters(){app.summaryFilter=null;app.period='all';app.customFrom='';app.customTo='';app.allType='전체';app.allStatus='전체';app.search='';app.sort='due'}

function bindPage(){

  document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{app.page=b.dataset.page;render()});

  document.querySelectorAll('[data-task]').forEach(x=>x.onclick=e=>{e.stopPropagation();openTask(x.dataset.task)});

  document.querySelectorAll('[data-open-summary]').forEach(x=>x.onclick=()=>{app.page='work';app.summaryFilter=x.dataset.openSummary;app.period=x.dataset.openSummary==='today'?'today':x.dataset.openSummary==='week'?'week':'all';render()});

  document.querySelectorAll('[data-home-tab]').forEach(x=>x.onclick=()=>{app.homeTab=x.dataset.homeTab;render()});

  document.querySelectorAll('[data-filter-card]').forEach(x=>x.onclick=()=>{const id=x.dataset.filterCard;app.summaryFilter=app.summaryFilter===id?null:id;if(id==='today')app.period='today';if(id==='week')app.period='week';if(id==='late'||id==='review')app.period='all';render()});

  document.querySelectorAll('[data-period]').forEach(x=>x.onclick=()=>{app.period=x.dataset.period;app.summaryFilter=null;if(app.period==='custom'&&!app.customFrom){app.customFrom=localToday();app.customTo=localToday()}render()});

  document.querySelectorAll('[data-view-mode]').forEach(x=>x.onclick=()=>{app.viewMode=x.dataset.viewMode;render()});

  document.querySelectorAll('[data-clear-filters]').forEach(x=>x.onclick=()=>{resetWorkFilters();render()});

  document.querySelectorAll('[data-settings-tab]').forEach(x=>x.onclick=()=>{app.settingsTab=x.dataset.settingsTab;render()});

  document.querySelectorAll('[data-cal]').forEach(x=>x.onclick=()=>{const a=x.dataset.cal;if(a==='today')app.calendarDate=new Date();else app.calendarDate=new Date(app.calendarDate.getFullYear(),app.calendarDate.getMonth()+(a==='next'?1:-1),1);render()});

  document.querySelectorAll('[data-day]').forEach(x=>x.onclick=()=>{const items=app.data.tasks.filter(t=>t.date===x.dataset.day||t.dueDate===x.dataset.day);modal(`${fmtDate(x.dataset.day)} 일정`,taskRows(items),'<button class="btn" data-close>닫기</button>','wide')});

  document.querySelectorAll('[data-toggle-master]').forEach(x=>x.onclick=async()=>{const m=app.data.taskMaster.find(a=>a.taskCode===x.dataset.toggleMaster);m.active=!m.active;ensureSchedules();await app.save();render()});

  document.querySelectorAll('[data-view-master]').forEach(x=>x.onclick=()=>openMaster(x.dataset.viewMaster));

  document.querySelectorAll('[data-edit-master]').forEach(x=>x.onclick=()=>openMaster(x.dataset.editMaster,true));

  const s=document.getElementById('taskSearch');if(s)s.oninput=()=>{app.search=s.value;render()};

  const tf=document.getElementById('typeFilter');if(tf)tf.onchange=()=>{app.allType=tf.value;render()};

  const sf=document.getElementById('statusFilter');if(sf)sf.onchange=()=>{app.allStatus=sf.value;render()};

  const so=document.getElementById('sortFilter');if(so)so.onchange=()=>{app.sort=so.value;render()};

  const cf=document.getElementById('customFrom');if(cf)cf.onchange=()=>{app.customFrom=cf.value;render()};

  const ct=document.getElementById('customTo');if(ct)ct.onchange=()=>{app.customTo=ct.value;render()};

}

document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;if(b.matches('[data-close]')||b.matches('[data-close-overlay]'))closeOverlay();if(b.matches('[data-action="situation"]'))openSituationHub();if(b.matches('[data-new-event]'))openEventForm(b.dataset.newEvent);if(b.matches('[data-action="quick-event"]'))openQuickEvent();if(b.matches('[data-action="generate-regular"]'))generateRegular();if(b.matches('[data-submit-event]'))submitEvent();if(b.matches('[data-save-quick]'))saveQuick();if(b.matches('[data-export-csv]'))exportCSV();if(b.matches('[data-import-csv]'))importCSVFile();if(b.matches('[data-backup]'))backupJSON();if(b.matches('[data-restore]'))restoreJSON();if(b.matches('[data-reset]'))openReset();if(b.matches('[data-edit-task]'))openTaskEdit(b.dataset.editTask);if(b.matches('[data-complete]')){const t=app.data.tasks.find(x=>x.id===b.dataset.complete),p=progressOf(t);if(!p.all&&!b.hasAttribute('data-checklist-free')){toast('필수 체크리스트를 모두 수행한 뒤 완료할 수 있습니다.');return}t.completedByUser=true;t.completedAt=new Date().toISOString();app.history(t.id,'업무 완료');await app.save();openTask(t.id)}if(b.matches('[data-reopen]')){const t=app.data.tasks.find(x=>x.id===b.dataset.reopen);t.completedByUser=false;t.completedAt=null;app.history(t.id,'완료 취소');await app.save();openTask(t.id)}if(b.matches('[data-delete-task]')){const id=b.dataset.deleteTask;if(confirm('이 일정을 삭제하시겠습니까?')){const removed=app.data.tasks.find(x=>x.id===id);if(removed?.occurrenceKey){app.data.appSettings.suppressed??=[];app.data.appSettings.suppressed.push(removed.occurrenceKey)}app.data.tasks=app.data.tasks.filter(x=>x.id!==id);app.data.taskChecklist=app.data.taskChecklist.filter(x=>x.taskId!==id);app.history(id,'업무 삭제');await app.save();closeOverlay();render();toast('일정을 삭제했습니다.')}}if(b.matches('[data-save-task]')){const f=document.getElementById('taskEdit'),t=app.data.tasks.find(x=>x.id===f.dataset.id),v=Object.fromEntries(new FormData(f));t.originalDate??=t.date;t.originalDueDate??=t.dueDate;t.changes??=[];t.changes.push({at:new Date().toISOString(),before:{date:t.date,dueDate:t.dueDate,responsible:t.responsible},after:v});Object.assign(t,v);t.userModified=true;if(scheduleCalendarLabel(t)==='자료제출'){t.titleEditedByUser=true;t.titleNeedsReview=false;const event=app.data.officialEvents.find(e=>e.id===t.sourceEventId);if(event){event.title=t.name;event.titleEditedByUser=true;event.titleNeedsReview=false;}}app.history(t.id,'일정 수정');await app.save();closeOverlay();render();toast('일정을 수정했습니다.')}if(b.matches('[data-save-master]')){const f=document.getElementById('masterForm'),m=app.data.taskMaster.find(x=>x.taskCode===f.dataset.code)||createMaster(f.dataset.code),v=Object.fromEntries(new FormData(f));if(!f.reportValidity())return;if(!validateRuleForm(f))return;v.checklistItems=v.checklistItems.split('\n').map(x=>x.trim()).filter(Boolean);v.dueOffsetDays=v.dueOffsetDays===''?'':Number(v.dueOffsetDays);v.recurrenceInterval=v.recurrenceInterval===''?'':Number(v.recurrenceInterval);v.active=v.active==='true';Object.assign(m,v);ensureSchedules();await app.save();closeOverlay();render();toast('업무원장을 저장했습니다.')}if(b.matches('[data-apply-csv]')){const mode=document.getElementById('csvMode').value;app.data.taskMaster=mode==='replace'?window.pendingCSV:[...app.data.taskMaster,...window.pendingCSV];await app.save();closeOverlay();render();toast('CSV 업무원장을 반영했습니다.')}if(b.matches('[data-apply-restore]')){app.data=mergeBackup(app.data,window.pendingRestore);migrateMasterData();ensureSchedules();await app.save();closeOverlay();render();toast('백업 데이터를 복원했습니다.')}if(b.matches('[data-confirm-reset]')){await storageAdapter.clear();app.data=freshData();migrateMasterData();ensureSchedules();await app.save();closeOverlay();app.page='home';render();toast('전체 데이터를 초기화했습니다.')}});

document.addEventListener('change',e=>{if(e.target.matches('[data-check]'))toggleCheck(e.target.dataset.checkTask,e.target.dataset.check,e.target.checked);if(e.target.id==='quickType'){const personal=e.target.value==='개인';document.querySelectorAll('.official-field').forEach(x=>x.classList.toggle('hidden',personal));document.querySelectorAll('.personal-field').forEach(x=>x.classList.toggle('hidden',!personal));document.getElementById('quickTitleLabel').textContent=personal?'제목':'공문제목'}});

document.addEventListener('input',e=>{if(e.target.id==='resetPhrase')document.getElementById('resetConfirm').disabled=e.target.value!=='산업안전'});

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOverlay()});

window.addEventListener('resize',()=>{if(app.page==='home')fitHomeDashboard()});

document.addEventListener('click',e=>{const b=e.target.closest('button[data-task]');if(b&&!b.onclick)openTask(b.dataset.task)});

// 동적으로 열린 모달/드로어에서도 문서 수준의 저장·완료 이벤트가 동작하도록 한다.

new MutationObserver(()=>document.querySelectorAll('#overlay .modal[onclick],#overlay .drawer[onclick]').forEach(el=>el.removeAttribute('onclick'))).observe(document.getElementById('overlay'),{childList:true,subtree:true});

/* Bundled third-party license notices

                                 Apache License

                           Version 2.0, January 2004

                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,

      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by

      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all

      other entities that control, are controlled by, or are under common

      control with that entity. For the purposes of this definition,

      "control" means (i) the power, direct or indirect, to cause the

      direction or management of such entity, whether by contract or

      otherwise, or (ii) ownership of fifty percent (50%) or more of the

      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity

      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,

      including but not limited to software source code, documentation

      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical

      transformation or translation of a Source form, including but

      not limited to compiled object code, generated documentation,

      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or

      Object form, made available under the License, as indicated by a

      copyright notice that is included in or attached to the work

      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object

      form, that is based on (or derived from) the Work and for which the

      editorial revisions, annotations, elaborations, or other modifications

      represent, as a whole, an original work of authorship. For the purposes

      of this License, Derivative Works shall not include works that remain

      separable from, or merely link (or bind by name) to the interfaces of,

      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including

      the original version of the Work and any modifications or additions

      to that Work or Derivative Works thereof, that is intentionally

      submitted to Licensor for inclusion in the Work by the copyright owner

      or by an individual or Legal Entity authorized to submit on behalf of

      the copyright owner. For the purposes of this definition, "submitted"

      means any form of electronic, verbal, or written communication sent

      to the Licensor or its representatives, including but not limited to

      communication on electronic mailing lists, source code control systems,

      and issue tracking systems that are managed by, or on behalf of, the

      Licensor for the purpose of discussing and improving the Work, but

      excluding communication that is conspicuously marked or otherwise

      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity

      on behalf of whom a Contribution has been received by Licensor and

      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of

      this License, each Contributor hereby grants to You a perpetual,

      worldwide, non-exclusive, no-charge, royalty-free, irrevocable

      copyright license to reproduce, prepare Derivative Works of,

      publicly display, publicly perform, sublicense, and distribute the

      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of

      this License, each Contributor hereby grants to You a perpetual,

      worldwide, non-exclusive, no-charge, royalty-free, irrevocable

      (except as stated in this section) patent license to make, have made,

      use, offer to sell, sell, import, and otherwise transfer the Work,

      where such license applies only to those patent claims licensable

      by such Contributor that are necessarily infringed by their

      Contribution(s) alone or by combination of their Contribution(s)

      with the Work to which such Contribution(s) was submitted. If You

      institute patent litigation against any entity (including a

      cross-claim or counterclaim in a lawsuit) alleging that the Work

      or a Contribution incorporated within the Work constitutes direct

      or contributory patent infringement, then any patent licenses

      granted to You under this License for that Work shall terminate

      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the

      Work or Derivative Works thereof in any medium, with or without

      modifications, and in Source or Object form, provided that You

      meet the following conditions:

      (a) You must give any other recipients of the Work or

          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices

          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works

          that You distribute, all copyright, patent, trademark, and

          attribution notices from the Source form of the Work,

          excluding those notices that do not pertain to any part of

          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its

          distribution, then any Derivative Works that You distribute must

          include a readable copy of the attribution notices contained

          within such NOTICE file, excluding those notices that do not

          pertain to any part of the Derivative Works, in at least one

          of the following places: within a NOTICE text file distributed

          as part of the Derivative Works; within the Source form or

          documentation, if provided along with the Derivative Works; or,

          within a display generated by the Derivative Works, if and

          wherever such third-party notices normally appear. The contents

          of the NOTICE file are for informational purposes only and

          do not modify the License. You may add Your own attribution

          notices within Derivative Works that You distribute, alongside

          or as an addendum to the NOTICE text from the Work, provided

          that such additional attribution notices cannot be construed

          as modifying the License.

      You may add Your own copyright statement to Your modifications and

      may provide additional or different license terms and conditions

      for use, reproduction, or distribution of Your modifications, or

      for any such Derivative Works as a whole, provided Your use,

      reproduction, and distribution of the Work otherwise complies with

      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,

      any Contribution intentionally submitted for inclusion in the Work

      by You to the Licensor shall be under the terms and conditions of

      this License, without any additional terms or conditions.

      Notwithstanding the above, nothing herein shall supersede or modify

      the terms of any separate license agreement you may have executed

      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade

      names, trademarks, service marks, or product names of the Licensor,

      except as required for reasonable and customary use in describing the

      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or

      agreed to in writing, Licensor provides the Work (and each

      Contributor provides its Contributions) on an "AS IS" BASIS,

      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or

      implied, including, without limitation, any warranties or conditions

      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A

      PARTICULAR PURPOSE. You are solely responsible for determining the

      appropriateness of using or redistributing the Work and assume any

      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,

      whether in tort (including negligence), contract, or otherwise,

      unless required by applicable law (such as deliberate and grossly

      negligent acts) or agreed to in writing, shall any Contributor be

      liable to You for damages, including any direct, indirect, special,

      incidental, or consequential damages of any character arising as a

      result of this License or out of the use or inability to use the

      Work (including but not limited to damages for loss of goodwill,

      work stoppage, computer failure or malfunction, or any and all

      other commercial damages or losses), even if such Contributor

      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing

      the Work or Derivative Works thereof, You may choose to offer,

      and charge a fee for, acceptance of support, warranty, indemnity,

      or other liability obligations and/or rights consistent with this

      License. However, in accepting such obligations, You may act only

      on Your own behalf and on Your sole responsibility, not on behalf

      of any other Contributor, and only if You agree to indemnify,

      defend, and hold each Contributor harmless for any liability

      incurred by, or claims asserted against, such Contributor by reason

      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following

      boilerplate notice, with the fields enclosed by brackets "{}"

      replaced with your own identifying information. (Don't include

      the brackets!)  The text should be enclosed in the appropriate

      comment syntax for the file format. We also recommend that a

      file or class name and description of purpose be included on the

      same "printed page" as the copyright notice for easier

      identification within third-party archives.

   Copyright {yyyy} {name of copyright owner}

   Licensed under the Apache License, Version 2.0 (the "License");

   you may not use this file except in compliance with the License.

   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software

   distributed under the License is distributed on an "AS IS" BASIS,

   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

   See the License for the specific language governing permissions and

   limitations under the License.

                                 Apache License

                           Version 2.0, January 2004

                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,

      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by

      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all

      other entities that control, are controlled by, or are under common

      control with that entity. For the purposes of this definition,

      "control" means (i) the power, direct or indirect, to cause the

      direction or management of such entity, whether by contract or

      otherwise, or (ii) ownership of fifty percent (50%) or more of the

      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity

      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,

      including but not limited to software source code, documentation

      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical

      transformation or translation of a Source form, including but

      not limited to compiled object code, generated documentation,

      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or

      Object form, made available under the License, as indicated by a

      copyright notice that is included in or attached to the work

      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object

      form, that is based on (or derived from) the Work and for which the

      editorial revisions, annotations, elaborations, or other modifications

      represent, as a whole, an original work of authorship. For the purposes

      of this License, Derivative Works shall not include works that remain

      separable from, or merely link (or bind by name) to the interfaces of,

      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including

      the original version of the Work and any modifications or additions

      to that Work or Derivative Works thereof, that is intentionally

      submitted to Licensor for inclusion in the Work by the copyright owner

      or by an individual or Legal Entity authorized to submit on behalf of

      the copyright owner. For the purposes of this definition, "submitted"

      means any form of electronic, verbal, or written communication sent

      to the Licensor or its representatives, including but not limited to

      communication on electronic mailing lists, source code control systems,

      and issue tracking systems that are managed by, or on behalf of, the

      Licensor for the purpose of discussing and improving the Work, but

      excluding communication that is conspicuously marked or otherwise

      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity

      on behalf of whom a Contribution has been received by Licensor and

      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of

      this License, each Contributor hereby grants to You a perpetual,

      worldwide, non-exclusive, no-charge, royalty-free, irrevocable

      copyright license to reproduce, prepare Derivative Works of,

      publicly display, publicly perform, sublicense, and distribute the

      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of

      this License, each Contributor hereby grants to You a perpetual,

      worldwide, non-exclusive, no-charge, royalty-free, irrevocable

      (except as stated in this section) patent license to make, have made,

      use, offer to sell, sell, import, and otherwise transfer the Work,

      where such license applies only to those patent claims licensable

      by such Contributor that are necessarily infringed by their

      Contribution(s) alone or by combination of their Contribution(s)

      with the Work to which such Contribution(s) was submitted. If You

      institute patent litigation against any entity (including a

      cross-claim or counterclaim in a lawsuit) alleging that the Work

      or a Contribution incorporated within the Work constitutes direct

      or contributory patent infringement, then any patent licenses

      granted to You under this License for that Work shall terminate

      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the

      Work or Derivative Works thereof in any medium, with or without

      modifications, and in Source or Object form, provided that You

      meet the following conditions:

      (a) You must give any other recipients of the Work or

          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices

          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works

          that You distribute, all copyright, patent, trademark, and

          attribution notices from the Source form of the Work,

          excluding those notices that do not pertain to any part of

          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its

          distribution, then any Derivative Works that You distribute must

          include a readable copy of the attribution notices contained

          within such NOTICE file, excluding those notices that do not

          pertain to any part of the Derivative Works, in at least one

          of the following places: within a NOTICE text file distributed

          as part of the Derivative Works; within the Source form or

          documentation, if provided along with the Derivative Works; or,

          within a display generated by the Derivative Works, if and

          wherever such third-party notices normally appear. The contents

          of the NOTICE file are for informational purposes only and

          do not modify the License. You may add Your own attribution

          notices within Derivative Works that You distribute, alongside

          or as an addendum to the NOTICE text from the Work, provided

          that such additional attribution notices cannot be construed

          as modifying the License.

      You may add Your own copyright statement to Your modifications and

      may provide additional or different license terms and conditions

      for use, reproduction, or distribution of Your modifications, or

      for any such Derivative Works as a whole, provided Your use,

      reproduction, and distribution of the Work otherwise complies with

      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,

      any Contribution intentionally submitted for inclusion in the Work

      by You to the Licensor shall be under the terms and conditions of

      this License, without any additional terms or conditions.

      Notwithstanding the above, nothing herein shall supersede or modify

      the terms of any separate license agreement you may have executed

      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade

      names, trademarks, service marks, or product names of the Licensor,

      except as required for reasonable and customary use in describing the

      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or

      agreed to in writing, Licensor provides the Work (and each

      Contributor provides its Contributions) on an "AS IS" BASIS,

      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or

      implied, including, without limitation, any warranties or conditions

      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A

      PARTICULAR PURPOSE. You are solely responsible for determining the

      appropriateness of using or redistributing the Work and assume any

      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,

      whether in tort (including negligence), contract, or otherwise,

      unless required by applicable law (such as deliberate and grossly

      negligent acts) or agreed to in writing, shall any Contributor be

      liable to You for damages, including any direct, indirect, special,

      incidental, or consequential damages of any character arising as a

      result of this License or out of the use or inability to use the

      Work (including but not limited to damages for loss of goodwill,

      work stoppage, computer failure or malfunction, or any and all

      other commercial damages or losses), even if such Contributor

      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing

      the Work or Derivative Works thereof, You may choose to offer,

      and charge a fee for, acceptance of support, warranty, indemnity,

      or other liability obligations and/or rights consistent with this

      License. However, in accepting such obligations, You may act only

      on Your own behalf and on Your sole responsibility, not on behalf

      of any other Contributor, and only if You agree to indemnify,

      defend, and hold each Contributor harmless for any liability

      incurred by, or claims asserted against, such Contributor by reason

      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following

      boilerplate notice, with the fields enclosed by brackets "{}"

      replaced with your own identifying information. (Don't include

      the brackets!)  The text should be enclosed in the appropriate

      comment syntax for the file format. We also recommend that a

      file or class name and description of purpose be included on the

      same "printed page" as the copyright notice for easier

      identification within third-party archives.

   Copyright {yyyy} {name of copyright owner}

   Licensed under the Apache License, Version 2.0 (the "License");

   you may not use this file except in compliance with the License.

   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software

   distributed under the License is distributed on an "AS IS" BASIS,

   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

   See the License for the specific language governing permissions and

   limitations under the License.

                                 Apache License

                           Version 2.0, January 2004

                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,

      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by

      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all

      other entities that control, are controlled by, or are under common

      control with that entity. For the purposes of this definition,

      "control" means (i) the power, direct or indirect, to cause the

      direction or management of such entity, whether by contract or

      otherwise, or (ii) ownership of fifty percent (50%) or more of the

      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity

      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,

      including but not limited to software source code, documentation

      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical

      transformation or translation of a Source form, including but

      not limited to compiled object code, generated documentation,

      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or

      Object form, made available under the License, as indicated by a

      copyright notice that is included in or attached to the work

      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object

      form, that is based on (or derived from) the Work and for which the

      editorial revisions, annotations, elaborations, or other modifications

      represent, as a whole, an original work of authorship. For the purposes

      of this License, Derivative Works shall not include works that remain

      separable from, or merely link (or bind by name) to the interfaces of,

      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including

      the original version of the Work and any modifications or additions

      to that Work or Derivative Works thereof, that is intentionally

      submitted to Licensor for inclusion in the Work by the copyright owner

      or by an individual or Legal Entity authorized to submit on behalf of

      the copyright owner. For the purposes of this definition, "submitted"

      means any form of electronic, verbal, or written communication sent

      to the Licensor or its representatives, including but not limited to

      communication on electronic mailing lists, source code control systems,

      and issue tracking systems that are managed by, or on behalf of, the

      Licensor for the purpose of discussing and improving the Work, but

      excluding communication that is conspicuously marked or otherwise

      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity

      on behalf of whom a Contribution has been received by Licensor and

      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of

      this License, each Contributor hereby grants to You a perpetual,

      worldwide, non-exclusive, no-charge, royalty-free, irrevocable

      copyright license to reproduce, prepare Derivative Works of,

      publicly display, publicly perform, sublicense, and distribute the

      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of

      this License, each Contributor hereby grants to You a perpetual,

      worldwide, non-exclusive, no-charge, royalty-free, irrevocable

      (except as stated in this section) patent license to make, have made,

      use, offer to sell, sell, import, and otherwise transfer the Work,

      where such license applies only to those patent claims licensable

      by such Contributor that are necessarily infringed by their

      Contribution(s) alone or by combination of their Contribution(s)

      with the Work to which such Contribution(s) was submitted. If You

      institute patent litigation against any entity (including a

      cross-claim or counterclaim in a lawsuit) alleging that the Work

      or a Contribution incorporated within the Work constitutes direct

      or contributory patent infringement, then any patent licenses

      granted to You under this License for that Work shall terminate

      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the

      Work or Derivative Works thereof in any medium, with or without

      modifications, and in Source or Object form, provided that You

      meet the following conditions:

      (a) You must give any other recipients of the Work or

          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices

          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works

          that You distribute, all copyright, patent, trademark, and

          attribution notices from the Source form of the Work,

          excluding those notices that do not pertain to any part of

          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its

          distribution, then any Derivative Works that You distribute must

          include a readable copy of the attribution notices contained

          within such NOTICE file, excluding those notices that do not

          pertain to any part of the Derivative Works, in at least one

          of the following places: within a NOTICE text file distributed

          as part of the Derivative Works; within the Source form or

          documentation, if provided along with the Derivative Works; or,

          within a display generated by the Derivative Works, if and

          wherever such third-party notices normally appear. The contents

          of the NOTICE file are for informational purposes only and

          do not modify the License. You may add Your own attribution

          notices within Derivative Works that You distribute, alongside

          or as an addendum to the NOTICE text from the Work, provided

          that such additional attribution notices cannot be construed

          as modifying the License.

      You may add Your own copyright statement to Your modifications and

      may provide additional or different license terms and conditions

      for use, reproduction, or distribution of Your modifications, or

      for any such Derivative Works as a whole, provided Your use,

      reproduction, and distribution of the Work otherwise complies with

      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,

      any Contribution intentionally submitted for inclusion in the Work

      by You to the Licensor shall be under the terms and conditions of

      this License, without any additional terms or conditions.

      Notwithstanding the above, nothing herein shall supersede or modify

      the terms of any separate license agreement you may have executed

      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade

      names, trademarks, service marks, or product names of the Licensor,

      except as required for reasonable and customary use in describing the

      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or

      agreed to in writing, Licensor provides the Work (and each

      Contributor provides its Contributions) on an "AS IS" BASIS,

      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or

      implied, including, without limitation, any warranties or conditions

      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A

      PARTICULAR PURPOSE. You are solely responsible for determining the

      appropriateness of using or redistributing the Work and assume any

      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,

      whether in tort (including negligence), contract, or otherwise,

      unless required by applicable law (such as deliberate and grossly

      negligent acts) or agreed to in writing, shall any Contributor be

      liable to You for damages, including any direct, indirect, special,

      incidental, or consequential damages of any character arising as a

      result of this License or out of the use or inability to use the

      Work (including but not limited to damages for loss of goodwill,

      work stoppage, computer failure or malfunction, or any and all

      other commercial damages or losses), even if such Contributor

      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing

      the Work or Derivative Works thereof, You may choose to offer,

      and charge a fee for, acceptance of support, warranty, indemnity,

      or other liability obligations and/or rights consistent with this

      License. However, in accepting such obligations, You may act only

      on Your own behalf and on Your sole responsibility, not on behalf

      of any other Contributor, and only if You agree to indemnify,

      defend, and hold each Contributor harmless for any liability

      incurred by, or claims asserted against, such Contributor by reason

      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

                                 Apache License

                           Version 2.0, January 2004

                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,

      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by

      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all

      other entities that control, are controlled by, or are under common

      control with that entity. For the purposes of this definition,

      "control" means (i) the power, direct or indirect, to cause the

      direction or management of such entity, whether by contract or

      otherwise, or (ii) ownership of fifty percent (50%) or more of the

      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity

      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,

      including but not limited to software source code, documentation

      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical

      transformation or translation of a Source form, including but

      not limited to compiled object code, generated documentation,

      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or

      Object form, made available under the License, as indicated by a

      copyright notice that is included in or attached to the work

      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object

      form, that is based on (or derived from) the Work and for which the

      editorial revisions, annotations, elaborations, or other modifications

      represent, as a whole, an original work of authorship. For the purposes

      of this License, Derivative Works shall not include works that remain

      separable from, or merely link (or bind by name) to the interfaces of,

      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including

      the original version of the Work and any modifications or additions

      to that Work or Derivative Works thereof, that is intentionally

      submitted to Licensor for inclusion in the Work by the copyright owner

      or by an individual or Legal Entity authorized to submit on behalf of

      the copyright owner. For the purposes of this definition, "submitted"

      means any form of electronic, verbal, or written communication sent

      to the Licensor or its representatives, including but not limited to

      communication on electronic mailing lists, source code control systems,

      and issue tracking systems that are managed by, or on behalf of, the

      Licensor for the purpose of discussing and improving the Work, but

      excluding communication that is conspicuously marked or otherwise

      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity

      on behalf of whom a Contribution has been received by Licensor and

      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of

      this License, each Contributor hereby grants to You a perpetual,

      worldwide, non-exclusive, no-charge, royalty-free, irrevocable

      copyright license to reproduce, prepare Derivative Works of,

      publicly display, publicly perform, sublicense, and distribute the

      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of

      this License, each Contributor hereby grants to You a perpetual,

      worldwide, non-exclusive, no-charge, royalty-free, irrevocable

      (except as stated in this section) patent license to make, have made,

      use, offer to sell, sell, import, and otherwise transfer the Work,

      where such license applies only to those patent claims licensable

      by such Contributor that are necessarily infringed by their

      Contribution(s) alone or by combination of their Contribution(s)

      with the Work to which such Contribution(s) was submitted. If You

      institute patent litigation against any entity (including a

      cross-claim or counterclaim in a lawsuit) alleging that the Work

      or a Contribution incorporated within the Work constitutes direct

      or contributory patent infringement, then any patent licenses

      granted to You under this License for that Work shall terminate

      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the

      Work or Derivative Works thereof in any medium, with or without

      modifications, and in Source or Object form, provided that You

      meet the following conditions:

      (a) You must give any other recipients of the Work or

          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices

          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works

          that You distribute, all copyright, patent, trademark, and

          attribution notices from the Source form of the Work,

          excluding those notices that do not pertain to any part of

          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its

          distribution, then any Derivative Works that You distribute must

          include a readable copy of the attribution notices contained

          within such NOTICE file, excluding those notices that do not

          pertain to any part of the Derivative Works, in at least one

          of the following places: within a NOTICE text file distributed

          as part of the Derivative Works; within the Source form or

          documentation, if provided along with the Derivative Works; or,

          within a display generated by the Derivative Works, if and

          wherever such third-party notices normally appear. The contents

          of the NOTICE file are for informational purposes only and

          do not modify the License. You may add Your own attribution

          notices within Derivative Works that You distribute, alongside

          or as an addendum to the NOTICE text from the Work, provided

          that such additional attribution notices cannot be construed

          as modifying the License.

      You may add Your own copyright statement to Your modifications and

      may provide additional or different license terms and conditions

      for use, reproduction, or distribution of Your modifications, or

      for any such Derivative Works as a whole, provided Your use,

      reproduction, and distribution of the Work otherwise complies with

      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,

      any Contribution intentionally submitted for inclusion in the Work

      by You to the Licensor shall be under the terms and conditions of

      this License, without any additional terms or conditions.

      Notwithstanding the above, nothing herein shall supersede or modify

      the terms of any separate license agreement you may have executed

      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade

      names, trademarks, service marks, or product names of the Licensor,

      except as required for reasonable and customary use in describing the

      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or

      agreed to in writing, Licensor provides the Work (and each

      Contributor provides its Contributions) on an "AS IS" BASIS,

      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or

      implied, including, without limitation, any warranties or conditions

      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A

      PARTICULAR PURPOSE. You are solely responsible for determining the

      appropriateness of using or redistributing the Work and assume any

      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,

      whether in tort (including negligence), contract, or otherwise,

      unless required by applicable law (such as deliberate and grossly

      negligent acts) or agreed to in writing, shall any Contributor be

      liable to You for damages, including any direct, indirect, special,

      incidental, or consequential damages of any character arising as a

      result of this License or out of the use or inability to use the

      Work (including but not limited to damages for loss of goodwill,

      work stoppage, computer failure or malfunction, or any and all

      other commercial damages or losses), even if such Contributor

      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing

      the Work or Derivative Works thereof, You may choose to offer,

      and charge a fee for, acceptance of support, warranty, indemnity,

      or other liability obligations and/or rights consistent with this

      License. However, in accepting such obligations, You may act only

      on Your own behalf and on Your sole responsibility, not on behalf

      of any other Contributor, and only if You agree to indemnify,

      defend, and hold each Contributor harmless for any liability

      incurred by, or claims asserted against, such Contributor by reason

      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following

      boilerplate notice, with the fields enclosed by brackets "[]"

      replaced with your own identifying information. (Don't include

      the brackets!)  The text should be enclosed in the appropriate

      comment syntax for the file format. We also recommend that a

      file or class name and description of purpose be included on the

      same "printed page" as the copyright notice for easier

      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");

   you may not use this file except in compliance with the License.

   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software

   distributed under the License is distributed on an "AS IS" BASIS,

   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

   See the License for the specific language governing permissions and

   limitations under the License.

*/

const EMBEDDED={};

/* v3: 순수 달력 계산과 저장되는 발생 일정. 날짜 문자열은 현지 날짜이며 UTC 변환하지 않는다. */

const RULE_TYPES={daily:'매일',weekly:'매주',biweekly:'격주',monthly:'매월',quarterly:'매분기',halfyear:'매반기',yearly:'매년',biennial:'2년마다',triennial:'3년마다',customMonths:'지정 개월마다',customYears:'지정 연수마다'};

const parseDay=s=>new Date(s+'T12:00:00');

const validDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&isoDate(parseDay(s))===s;

const monday=s=>{const d=parseDay(s);d.setDate(d.getDate()-(d.getDay()+6)%7);return isoDate(d)};

const monthEnd=s=>isoDate(new Date(parseDay(s).getFullYear(),parseDay(s).getMonth()+1,0,12));

function shiftMonths(s,n){const d=parseDay(s),day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+n);d.setDate(Math.min(day,new Date(d.getFullYear(),d.getMonth()+1,0).getDate()));return isoDate(d)}

const daysBetween=(a,b)=>Math.round((Date.UTC(...a.split('-').map((x,i)=>i===1?+x-1:+x))-Date.UTC(...b.split('-').map((x,i)=>i===1?+x-1:+x)))/86400000);

function planDate(m,start,end,holidays=[]){

  const d=parseDay(start),y=d.getFullYear(),mo=d.getMonth();let date=start;

  if(['weekly','biweekly'].includes(m.recurrenceType)){date=addDays(start,(Number(m.weekday||0)+6)%7)}

  else if(m.scheduleMode==='lastDay')date=end;

  else if(m.scheduleMode==='lastBusiness'){date=end;while([0,6].includes(parseDay(date).getDay())||holidays.includes(date))date=addDays(date,-1);if(date<start)date=start}

  else if(m.scheduleMode==='day')date=isoDate(new Date(y,mo,Math.min(Number(m.monthDay)||1,parseDay(monthEnd(start)).getDate()),12));

  else if(['nthWeekday','lastWeekday'].includes(m.scheduleMode)){const wd=Number(m.weekday)||0;if(m.scheduleMode==='lastWeekday'){date=end;date=addDays(date,-(parseDay(date).getDay()-wd+7)%7)}else{date=addDays(start,(wd-parseDay(start).getDay()+7)%7+7*((Number(m.nth)||1)-1));if(date>end)date=addDays(date,-7)}}

  if(m.recommendedDate&&validDay(m.recommendedDate)&&m.recommendedDate>=start&&m.recommendedDate<=end)date=m.recommendedDate;

  return date<start?start:date>end?end:date;

}

function recurrencePeriods(m,from,to,holidays=[]){

  if(!validDay(from)||!validDay(to)||from>to)throw Error('조회기간을 확인하세요.');

  const type=m.recurrenceType,interval=Math.max(1,Math.floor(Number(m.recurrenceInterval)||1));

  if(!RULE_TYPES[type])return [];

  const needsAnchor=['biennial','triennial','customMonths','customYears'].includes(type)||(type==='yearly'&&interval>1)||(type==='monthly'&&interval>1)||type==='daily'&&interval>1||type==='biweekly'||type==='weekly'&&interval>1;

  if(needsAnchor&&!validDay(m.anchorDate))return [];

  const anchor=validDay(m.anchorDate)?m.anchorDate:from.slice(0,4)+'-01-01';

  const activeStart=m.applyStart||from,activeEnd=m.applyEnd||to;

  if(activeStart>to||activeEnd<from)return [];

  let start,step,unit;

  if(type==='daily'){unit='days';step=interval;start=anchor}

  else if(['weekly','biweekly'].includes(type)){unit='days';step=7*(type==='biweekly'?2:interval);start=monday(anchor)}

  else {unit='months';step={monthly:interval,quarterly:3*interval,halfyear:6*interval,yearly:12*interval,biennial:24,triennial:36,customMonths:interval,customYears:12*interval}[type];const ad=parseDay(anchor);let mo=ad.getMonth();if(!validDay(m.anchorDate))mo=type==='quarterly'?Math.floor(mo/3)*3:type==='halfyear'?Math.floor(mo/6)*6:type==='monthly'?mo:0;start=isoDate(new Date(ad.getFullYear(),mo,1,12))}

  const shift=(s,n)=>unit==='days'?addDays(s,n*step):shiftMonths(s,n*step);

  // 조회 시작기간으로 바로 이동하여 장기간 자료의 매일 순회를 피한다.

  let n=unit==='days'?Math.floor(daysBetween(from,start)/step):Math.floor(((+from.slice(0,4)- +start.slice(0,4))*12+(+from.slice(5,7)- +start.slice(5,7)))/step);

  if(needsAnchor)n=Math.max(0,n);

  start=shift(start,n);const result=[];

  for(let guard=0;start<=to&&guard<40000;guard++){

    const next=shift(start,1),end=addDays(next,-1);

    if(end>=from&&end>=activeStart&&start<=activeEnd){const periodStart=start<activeStart?activeStart:start,periodEnd=end>activeEnd?activeEnd:end;let planned=planDate(m,start,end,holidays);planned=planned<periodStart?periodStart:planned>periodEnd?periodEnd:planned;result.push({key:start,periodStart,periodEnd,planned})}

    start=next;

  }

  return result;

}

function occurrenceKey(m,period,eventId=''){return [m.taskCode,m.targetId||'school-default',eventId||period,m.stage||'main'].map(encodeURIComponent).join('|')}

function migrateMasterData(){

  app.data.appSettings??={};const defaults=officialMasters(),byCode=new Map((app.data.taskMaster||[]).map(x=>[x.taskCode,x]));

  for(const m of defaults){if(!byCode.has(m.taskCode)){app.data.taskMaster.push(m);byCode.set(m.taskCode,m)}else{const old=byCode.get(m.taskCode);for(const [k,v] of Object.entries(m))if(old[k]===undefined)old[k]=v;}}

  app.data.appSettings.automationStart??=localToday();app.data.appSettings.holidays??=[];app.data.appSettings.suppressed??=[];

  app.data.appSettings.schemaVersion=3;app.data.appSettings.masterDataVersion=MASTER_DATA_VERSION;

  app.data.appSettings.version=APP_VERSION;

  // 기존 발생 일정의 내용·완료 상태를 유지한 채 대응 가능한 기간에 식별값만 추가한다.

  for(const t of app.data.tasks){t.originalDate??=t.date;t.originalDueDate??=t.dueDate;t.changes??=[];

    if(t.occurrenceKey||!t.masterCode)continue;const m=byCode.get(t.masterCode);if(!m)continue;

    if(t.sourceEventId){t.occurrenceKey=occurrenceKey(m,'',t.sourceEventId);continue}

    if(t.type==='정기'&&validDay(t.date)){const p=recurrencePeriods({...m,applyStart:'',applyEnd:''},t.date,t.date,[])[0];if(p)t.occurrenceKey=occurrenceKey(m,p.key)}

  }

  return true;

}

function ensureSchedules(from,to){

  if(!app.data)return 0;const today=localToday(),view=isoDate(app.calendarDate),start=app.data.appSettings.automationStart||today;

  from??=[start,view.slice(0,7)+'-01',...app.data.taskMaster.filter(m=>m.active&&m.taskType==='정기'&&m.applicability==='yes'&&validDay(m.applyStart)).map(m=>m.applyStart)].sort()[0];

  to??=shiftMonths((today>view?today:view).slice(0,7)+'-01',24);

  const existing=new Map(app.data.tasks.filter(x=>x.occurrenceKey).map(x=>[x.occurrenceKey,x])),suppressed=new Set(app.data.appSettings.suppressed||[]);let count=0;

  for(const m of app.data.taskMaster){if(!m.active||m.taskType!=='정기'||m.applicability!=='yes')continue;

    for(const p of recurrencePeriods({...m,applyStart:m.applyStart||start},from,to,app.data.appSettings.holidays||[])){

      const key=occurrenceKey(m,p.key);if(suppressed.has(key))continue;

      if(existing.has(key)){const t=existing.get(key);if(!t.userModified&&!t.completedByUser&&p.planned>=today&&t.periodStart&&t.date!==p.planned){t.changes??=[];t.changes.push({at:new Date().toISOString(),before:{date:t.date},after:{date:p.planned},reason:'반복규칙 변경'});t.date=p.planned;t.managementDue=p.periodEnd}continue}

      const t=masterToTask(m,{date:p.planned,dueDate:'',requiresReview:false});Object.assign(t,{id:'occ-'+key,occurrenceKey:key,periodStart:p.periodStart,periodEnd:p.periodEnd,managementDue:p.periodEnd,originalDate:p.planned,originalDueDate:'',legalDeadline:'',deadlineKind:'management',recurrenceLabel:recurrenceLabel(m),targetId:m.targetId||'school-default',priority:m.priority||'보통',legalVerification:m.legalVerification||'법령 검증 필요',alertDays:m.alertDays,changes:[]});app.data.tasks.push(t);existing.set(key,t);app.syncChecklist(t);count++;

    }

  }

  count+=ensureFollowups();return count;

}

function ensureFollowups(){let count=0;for(const parent of [...app.data.tasks]){if(statusOf(parent)!=='완료')continue;const origin=app.data.taskMaster.find(m=>m.taskCode===parent.masterCode);if(!origin?.successors)continue;for(const code of String(origin.successors).split(/[,|\s]+/).filter(Boolean)){const m=app.data.taskMaster.find(x=>x.taskCode===code);if(!m||!m.active||m.applicability==='no')continue;const key=occurrenceKey({...m,targetId:parent.targetId||m.targetId,stage:'followup'},'',parent.id);if(app.data.tasks.some(t=>t.occurrenceKey===key||parent.sourceEventId&&t.masterCode===code&&t.sourceEventId===parent.sourceEventId)||(app.data.appSettings.suppressed||[]).includes(key))continue;const t=masterToTask(m,{date:parent.completedAt?.slice(0,10)||localToday(),requiresReview:true,sourceEventId:parent.sourceEventId});Object.assign(t,{id:'occ-'+key,occurrenceKey:key,predecessorTaskId:parent.id,originalDate:t.date,deadlineKind:'unconfirmed',legalVerification:m.legalVerification||'법령 검증 필요',memo:(t.memo||'')+'\n선행업무 완료에 따라 생성. 적용조건과 실제 후속 확인일을 지정하세요.',changes:[]});app.data.tasks.push(t);app.syncChecklist(t);app.history(t.id,'선행업무 완료 후 후속업무 생성');count++}}return count}

generateRegular=async()=>{const n=ensureSchedules();await app.save();toast(`반복규칙으로 ${n}건 추가 · 기존 회차 유지`);render()};

recurrenceLabel=m=>`${RULE_TYPES[m.recurrenceType]||m.recurrenceLabel||'주기 미지정'}${Number(m.recurrenceInterval)>1?' (간격 '+Number(m.recurrenceInterval)+')':''}`;

taskDate=t=>t.date||t.dueDate||'';

function deadlineOf(t){return t.dueDate||t.managementDue||''}

statusOf=t=>{const p=progressOf(t);if(t.completedByUser&&p.all)return '완료';const due=deadlineOf(t);if(due&&due<localToday())return '지연';if(t.requiresReview)return '확인필요';if(p.done>0)return '진행';if(due&&daysBetween(due,localToday())<=7)return '임박';return '예정'};

function overlap(t,start,end){return (t.periodStart||taskDate(t)||'9999')<=end&&(t.periodEnd||deadlineOf(t)||taskDate(t)||'0000')>=start}

summaryTasks=kind=>{const today=localToday(),week=monday(today);return app.data.tasks.filter(t=>{const s=statusOf(t);if(kind==='done')return s==='완료';if(kind==='late')return s==='지연';if(kind==='review')return s!=='완료'&&(s==='확인필요'||t.requiresReview);if(kind==='today')return s!=='완료'&&overlap(t,today,today);if(kind==='week')return s!=='완료'&&overlap(t,week,addDays(week,6));if(kind==='month')return s!=='완료'&&overlap(t,today.slice(0,7)+'-01',monthEnd(today));if(kind==='soon')return s!=='완료'&&deadlineOf(t)>=today&&deadlineOf(t)<=addDays(today,7);return true})};

periodMatch=t=>{const today=localToday(),week=monday(today);if(app.period==='all')return true;if(app.period==='today')return (overlap(t,today,today)||statusOf(t)==='지연')&&statusOf(t)!=='완료';if(app.period==='week')return overlap(t,week,addDays(week,6));if(app.period==='month')return overlap(t,today.slice(0,7)+'-01',monthEnd(today));if(app.period==='custom')return overlap(t,app.customFrom||'0000',app.customTo||'9999');return true};

function completionRate(start,end){const ts=app.data.tasks.filter(t=>t.type==='정기'&&taskDate(t)>=start&&taskDate(t)<=end);const done=ts.filter(t=>statusOf(t)==='완료').length;return `${ts.length?Math.round(done/ts.length*100):0}% (${done}/${ts.length}건)`}

function notifications(){const today=localToday();return app.data.tasks.filter(t=>{if(statusOf(t)==='완료')return false;const alertDate=t.dueDate||t.date||t.managementDue;if(!alertDate)return false;const diff=daysBetween(performancePeriod(t)?.end||alertDate,today),rules=String(t.alertDays??'3,0').split(/[,|]/).map(x=>x.trim());return rules.includes(String(diff))||deadlineOf(t)<today&&!!deadlineOf(t)&&rules.includes('overdue')})}

function automationPanel(){const d=localToday(),w=monday(d),notices=notifications(),waiting=app.data.taskMaster.filter(m=>m.active&&m.applicability==='unknown');return `<section class="automation-panel"><div class="auto-metrics">${[['today','오늘 수행기간'],['week','이번 주'],['month','이번 달'],['soon','기한 임박'],['late','미완료·지연'],['done','완료 이력']].map(([id,label])=>`<button class="metric" data-auto-summary="${id}"><span>${label}</span><b>${summaryTasks(id).length}</b></button>`).join('')}</div><div class="notice">주간 반복 완료율 <b>${completionRate(w,addDays(w,6))}</b> · 월간 <b>${completionRate(d.slice(0,7)+'-01',monthEnd(d))}</b> · 반복 지연 ${app.data.tasks.filter(t=>t.type==='정기'&&statusOf(t)==='지연').length}건<br>달력의 날짜는 실시 예정일입니다. 수행기간 끝은 <b>관리상 마감</b>이며 법정기한과 구분합니다.</div><div class="auto-actions"><button class="btn" data-auto-settings>반복규칙·적용대상 설정 (${waiting.length}건 확인 필요)</button><button class="btn" data-auto-alerts>실행 시 알림 ${notices.length}건</button><button class="btn" data-new-master>＋ 업무원장 등록</button></div></section>`}

const originalRender=render;

render=function(){const count=ensureSchedules();if(count)app.save().catch(()=>{});originalRender();const bell=document.querySelector('.notification');if(bell){bell.innerHTML='🔔<i>'+notifications().length+'</i>';bell.setAttribute('aria-label','실행 시 알림 '+notifications().length+'건');bell.onclick=()=>document.querySelector('[data-auto-alerts]')?.click()}if(app.page==='work'||app.page==='home'){const view=document.getElementById('view'),target=app.page==='home'?view.querySelector('.home-screen'):view;const block=document.createElement('div');block.innerHTML=automationPanel();target.prepend(block);if(app.page==='home')fitHomeDashboard()}};

fitHomeDashboard=()=>{}; // 기존 홈 구성은 유지하고 축소 대신 스크롤로 추가 지표까지 읽게 한다.

homeTaskList=kind=>{let list=kind==='priority'?app.data.tasks.filter(t=>statusOf(t)!=='완료'):summaryTasks(kind);const rank={지연:0,확인필요:1,임박:2,진행:3,예정:4};return list.sort((a,b)=>(rank[statusOf(a)]??9)-(rank[statusOf(b)]??9)||(taskDate(a)||'9999').localeCompare(taskDate(b)||'9999')).slice(0,5)};

const oldRenderWork=renderWork;renderWork=()=>oldRenderWork().replace(/7일 이내/g,'이번 주').replace(/마감일 · D-Day/g,'예정일 · 관리기한');

renderWorkCalendar=function(){

  const y=app.calendarDate.getFullYear(),m=app.calendarDate.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());let days='';

  const list=app.data.tasks.filter(t=>(app.allType==='전체'||t.type===app.allType)&&(app.allStatus==='전체'||statusOf(t)===app.allStatus)&&(!app.search||taskSearchText(t).includes(app.search)));

  for(let i=0;i<42;i++){const d=new Date(start);d.setDate(d.getDate()+i);const key=isoDate(d),ts=list.filter(t=>taskDate(t)===key||t.dueDate===key);days+=`<div class="day ${d.getMonth()!==m?'other':''} ${key===localToday()?'today':''}"><button class="day-num date-pick" data-day="${key}" aria-label="${key} 일정">${d.getDate()}</button>${ts.slice(0,4).map(t=>`<button class="day-event ${statusOf(t)==='완료'?'completed':''} ${t.type==='사건'?'trigger':t.type==='정기'?'regular':''}" data-task="${t.id}" title="${escapeHtml(taskDisplay(t).title)}"><span class="tag">[${escapeHtml(t.type)}${statusOf(t)==='완료'?'·완료':''}]</span> ${escapeHtml(taskDisplay(t).title)}${taskActionHtml(t)}</button>`).join('')}${ts.length>4?`<button class="more" data-day="${key}">+${ts.length-4}건</button>`:''}</div>`}

  return `<div class="panel"><div class="panel-head"><div class="calendar-tools"><button class="btn" data-cal="prev">‹ 이전달</button><button class="btn" data-cal="today">오늘</button><button class="btn" data-cal="next">다음달 ›</button></div><b class="calendar-title">${y}년 ${m+1}월</b><span class="subtle">반복규칙 자동 계산 · 목록은 기간 필터 이용</span></div><div class="weekdays">${['일','월','화','수','목','금','토'].map(x=>`<div>${x}</div>`).join('')}</div><div class="calendar-grid">${days}</div></div>`;

};

const oldWorkTable=workTable;

workTable=list=>oldWorkTable(list).replaceAll('마감일 · D-Day','예정일 · 관리기한').replaceAll('일정일','실시 예정일')+ (list.length?`<div class="subtle table-note">관리상 마감은 업무 상세에서 확인할 수 있습니다. 완료율은 발생 일정 건수를 기준으로 계산합니다.</div>`:'');

const oldOpenTask=openTask;

openTask=function(id){oldOpenTask(id);const t=app.data.tasks.find(x=>x.id===id);if(!t)return;const area=document.querySelector('.drawer-body');if(!area)return;const info=document.createElement('section');info.className='detail-section';info.innerHTML=`<h4>반복 회차와 기한 구분</h4><p>반복주기: ${escapeHtml(t.recurrenceLabel||'일회성 / 확인 필요')}<br>수행기간: ${escapeHtml(t.periodStart||'미지정')} ~ ${escapeHtml(t.periodEnd||'미지정')}<br>실시 예정일: ${fmtDate(t.date)} · 최초 예정일: ${fmtDate(t.originalDate||t.date)}<br>관리상 마감: ${fmtDate(t.managementDue)}<br>법정기한: ${t.deadlineKind==='legal'?fmtDate(t.dueDate):'확정하지 않음'}<br>담당자: ${escapeHtml(t.responsible||'미지정')} · 중요도: ${escapeHtml(t.priority||'보통')}<br>법령 검증: ${escapeHtml(t.legalVerification||'법령 검증 필요')}<br>완료일: ${t.completedAt?escapeHtml(new Date(t.completedAt).toLocaleString('ko-KR')):'미완료'}<br>비고: ${escapeHtml(t.memo||'없음')}</p>${(t.changes||[]).length?`<h4>일정 변경 이력</h4>${t.changes.map(c=>`<p>${escapeHtml(c.at)} · ${escapeHtml(JSON.stringify(c.before))} → ${escapeHtml(JSON.stringify(c.after))}</p>`).join('')}` :''}`;area.prepend(info)};

const oldSettingsMaster=settingsMaster;

settingsMaster=()=>`<div class="auto-actions"><button class="btn primary" data-new-master>＋ 업무원장 등록</button><button class="btn" data-auto-settings>반복·적용조건 일괄 확인</button></div>`+oldSettingsMaster();

const oldSettingsOperations=settingsOperations;

settingsOperations=()=>`<div class="notice">프로그램 실행 및 달력 이동 시 적용 시작일부터 선택한 달 이후 24개월까지 자동 계산합니다. 완료·지연 이력은 계속 보관합니다. 공휴일·학교 휴무일은 아래에서 입력하세요.</div><div class="auto-actions"><button class="btn primary" data-auto-settings>적용조건 및 반복규칙</button><button class="btn" data-holidays>공휴일·학교 휴무일 설정</button></div>`+oldSettingsOperations().replaceAll('현재 달 정기업무 생성','반복일정 다시 계산').replace('활성 상태이며 주기와 기한이 설정된 업무원장 항목으로 현재 달 업무를 생성합니다.','적용 확인된 원장 규칙으로 자동 일정을 생성합니다.');

const oldSettingsData=settingsData;

settingsData=()=>oldSettingsData()+`<div class="setting-card settings-block"><h3>직전 저장 상태 복구</h3><p>마지막 정상 저장 직전의 데이터를 미리 확인하고 현재 데이터와 병합합니다. 브라우저 데이터 삭제 또는 다른 PC 사용 시 자동 공유되지 않습니다. 경로·브라우저가 바뀌면 기존 백업을 가져오세요.</p><button class="btn" data-recover>직전 백업 확인</button></div>`;

const oldBindPage=bindPage;

bindPage=function(){oldBindPage();const s=document.getElementById('taskSearch');if(s)s.oninput=()=>{const pos=s.selectionStart;app.search=s.value;render();const next=document.getElementById('taskSearch');next?.focus();next?.setSelectionRange(pos,pos)}};

const originalAppSave=app.save;

app.save=async function(){if(this.data)ensureFollowups();const result=await originalAppSave.call(this);if(window.safetyReady)render();return result};

const oldRenderHome=renderHome;

renderHome=()=>oldRenderHome().replaceAll('7일 이내 마감','이번 주 일정').replaceAll('7일 이내','이번 주');

function createMaster(code){const m={taskCode:code,taskName:'새 업무',taskType:'정기',category:'사용자 등록',active:true,verificationStatus:'needs_review',checklistItems:[],recurrenceType:'weekly',recurrenceInterval:1,dueOffsetDays:'',applicability:'unknown',targetId:'school-default',stage:'main'};app.data.taskMaster.push(m);return m}

function selectField(name,label,value,choices){return `<div class="field"><label>${label}</label><select name="${name}">${choices.map(([v,l])=>`<option value="${v}" ${String(value)===String(v)?'selected':''}>${l}</option>`).join('')}</select></div>`}

function inputField(name,label,value,type='text',attrs=''){return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" value="${escapeHtml(value??'')}" ${attrs}></div>`}

masterForm=function(m){return `<form id="masterForm" data-code="${escapeHtml(m.taskCode)}" class="form-grid">${inputField('taskName','업무명',m.taskName,'text','required')}${inputField('category','분류',m.category)}${selectField('taskType','업무유형',m.taskType,['정기','사건','공문','상시'].map(x=>[x,x]))}${selectField('applicability','적용대상 판정',m.applicability,[['unknown','추가 확인 필요 (자동일정 보류)'],['yes','적용조건 확인 · 해당'],['no','해당 없음']])}${inputField('targetId','학교·사업장·적용대상 ID',m.targetId||'school-default','text','required')}${inputField('target','수행 대상',m.target)}${inputField('responsible','담당자',m.responsible)}${selectField('priority','중요도',m.priority||'보통',['높음','보통','낮음'].map(x=>[x,x]))}${selectField('recurrenceType','반복주기',m.recurrenceType,[['','없음'],...Object.entries(RULE_TYPES)])}${inputField('recurrenceInterval','반복간격 (선택 주기의 배수)',m.recurrenceInterval||1,'number','min="1" max="120" required')}${inputField('anchorDate','계산 기준일 (격주·다년·지정간격은 필수)',m.anchorDate,'date')}${inputField('applyStart','적용 시작일',m.applyStart,'date')}${inputField('applyEnd','적용 종료일',m.applyEnd,'date')}${selectField('scheduleMode','실시 예정일 방식',m.scheduleMode||'period',[['period','수행기간 내 1회 (기간 시작일 표시)'],['day','매월 지정일 (없는 날짜는 말일)'],['nthWeekday','매월 첫째~넷째 요일'],['lastWeekday','매월 마지막 요일'],['lastDay','기간 마지막 날'],['lastBusiness','기간 마지막 근무일']])}${selectField('weekday','주간 실시요일 / 월간 요일',m.weekday??1,['일','월','화','수','목','금','토'].map((x,i)=>[i,x+'요일']))}${inputField('monthDay','매월 지정일',m.monthDay||1,'number','min="1" max="31"')}${selectField('nth','몇째 주',m.nth||1,[1,2,3,4].map(x=>[x,x+'째']))}${inputField('recommendedDate','기간 내 실제 실시 권장일',m.recommendedDate,'date')}${inputField('alertDays','알림 (30,14,7,3,0,overdue 중 선택)',m.alertDays??'3,0')}${inputField('triggerType','연결 사건 코드',m.triggerType)}${inputField('predecessors','선행업무 코드',m.predecessors)}${inputField('successors','후속업무 코드',m.successors)}${inputField('stage','후속업무 단계 ID',m.stage||'main')}${inputField('applicationConditions','적용조건 (직종·환경·금액·공사종류 등)',m.applicationConditions)}${inputField('sourceName','근거문서',m.sourceName)}${inputField('sourceArticle','관련 법령·조문',m.sourceArticle)}${inputField('sourcePage','매뉴얼 쪽수',m.sourcePage)}${inputField('sourceDate','근거 확인일',m.sourceDate,'date')}${inputField('legalVerification','법령 검증 상태',m.legalVerification||'법령 검증 필요')}${inputField('legalDeadline','법정기한 근거 설명 (계획일과 별도)',m.legalDeadline)}${inputField('baseDateType','기준일 설명',m.baseDateType)}${inputField('dueOffsetDays','기존 버전 기한 일수 (보관용·반복 계산 미사용)',m.dueOffsetDays,'number')}${selectField('verificationStatus','근거 검토상태',m.verificationStatus,[['confirmed','근거 확인'],['needs_review','법령 검증 필요'],['inactive','미사용']])}${selectField('active','활성상태',String(m.active),[['true','활성'],['false','비활성']])}${['description','checklistItems','relatedForms','memo'].map(k=>`<div class="field full"><label>${{description:'업무설명',checklistItems:'체크리스트 (한 줄에 하나)',relatedForms:'관련서식',memo:'비고'}[k]}</label><textarea name="${k}">${escapeHtml(k==='checklistItems'?(m[k]||[]).join('\n'):m[k]||'')}</textarea></div>`).join('')}</form><div class="notice">반복주기·기준일·실시 예정일·법정기한은 별도입니다. 주·월·반기 말일은 관리상 마감으로만 사용합니다. 마지막 근무일은 토·일과 직접 입력한 공휴일·휴무일을 제외합니다.</div>`};

function validateRuleForm(form){const v=Object.fromEntries(new FormData(form));if(v.applyStart&&v.applyEnd&&v.applyEnd<v.applyStart){toast('종료일은 시작일 이후로 입력하세요.');return false}if(v.taskType==='정기'&&v.applicability==='yes'){const type=v.recurrenceType,interval=+v.recurrenceInterval;if(!RULE_TYPES[type]){toast('반복주기를 선택하세요.');return false}if((['biweekly','biennial','triennial','customMonths','customYears'].includes(type)||interval>1)&&!validDay(v.anchorDate)){toast('해당 반복주기는 계산 기준일이 필요합니다.');return false}}if(!String(v.alertDays||'').split(',').every(x=>['','30','14','7','3','0','overdue'].includes(x.trim()))){toast('알림 값은 30,14,7,3,0,overdue만 입력하세요.');return false}return true}

function showAutomationSettings(){modal('반복규칙 · 학교별 적용조건',`<div class="notice">작업환경·대상자·계약조건을 확인한 업무만 ‘해당’으로 설정하세요. 불명확한 업무는 원장에 보존하고 확정 일정을 생성하지 않습니다. 다른 대상은 원장을 복제하여 ID를 구분합니다.</div><div class="preview-box"><table class="data-table"><thead><tr><th>업무명</th><th>적용조건</th><th>현재 판정</th><th>관리</th></tr></thead><tbody>${app.data.taskMaster.map(m=>`<tr><td>${escapeHtml(m.taskName)}<br><small>${escapeHtml(m.taskCode)} · ${escapeHtml(m.targetId||'school-default')}</small></td><td>${escapeHtml(m.applicationConditions||m.memo||'확인 필요')}<br>${escapeHtml(recurrenceLabel(m))}</td><td>${{yes:'해당',no:'비대상',unknown:'추가 확인 필요'}[m.applicability]||'추가 확인 필요'}</td><td><button class="btn" data-edit-master="${escapeHtml(m.taskCode)}">설정</button><button class="btn" data-clone-master="${escapeHtml(m.taskCode)}">다른 대상 복제</button></td></tr>`).join('')}</tbody></table></div>`,`<button class="btn" data-close>닫기</button>`,'wide')}

function normalizeBackup(data){const x=JSON.parse(JSON.stringify(data));for(const k of COLLECTIONS)if(x[k]===undefined)x[k]=k==='appSettings'?{}:[];return x}

function validateBackup(data){if(!data||!Array.isArray(data.tasks)||!Array.isArray(data.taskMaster))throw Error('업무와 원장 배열이 필요합니다.');for(const k of COLLECTIONS)if(data[k]!==undefined&&(k==='appSettings'?typeof data[k]!=='object'||Array.isArray(data[k]):!Array.isArray(data[k])))throw Error(k+' 형식 오류');for(const t of data.tasks)if(!t.id||typeof t.name!=='string'||t.checklist&&!Array.isArray(t.checklist))throw Error('업무 ID·명칭·체크리스트 형식 오류');for(const m of data.taskMaster)if(!m.taskCode||typeof m.taskName!=='string'||m.checklistItems&&!Array.isArray(m.checklistItems))throw Error('업무원장 형식 오류');}

function mergeBackup(current,incoming){validateBackup(incoming);const old=normalizeBackup(current),add=normalizeBackup(incoming);for(const k of COLLECTIONS){if(k==='appSettings'){old[k]={...add[k],...old[k],suppressed:[...new Set([...(add[k].suppressed||[]),...(old[k].suppressed||[])])]};continue}const key=x=>k==='taskMaster'?x.taskCode:x.occurrenceKey||x.id;const seen=new Set(old[k].map(key));for(const x of add[k])if(!seen.has(key(x))){old[k].push(x);seen.add(key(x))}}return old}

storageAdapter.init=async function(){this.mode='localStorage';try{localStorage.setItem('safety-storage-probe','1');localStorage.removeItem('safety-storage-probe')}catch(e){throw Error('브라우저 로컬 저장소를 사용할 수 없습니다. 일반 브라우저 창에서 열어 주세요.')} };

storageAdapter.load=async function(){const raw=localStorage.getItem(STORE_KEY);if(raw){try{const data=JSON.parse(raw);validateBackup(data);return normalizeBackup(data)}catch(e){localStorage.setItem(STORE_KEY+'_damaged',raw);const previous=localStorage.getItem(STORE_KEY+'_recovery');if(previous){const d=JSON.parse(previous);validateBackup(d);window.startupRecovery=true;return normalizeBackup(d)}throw Error('저장 데이터 손상: 자동 덮어쓰기를 중단했습니다. 백업 JSON을 가져와 복구하세요.')}}

  // v2 IndexedDB → v3 localStorage. 원본 DB는 수정하거나 삭제하지 않는다.

  return await new Promise(resolve=>{try{const request=indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('kv'))request.result.createObjectStore('kv')};request.onerror=()=>resolve(null);request.onsuccess=()=>{const db=request.result;if(!db.objectStoreNames.contains('kv')){db.close();resolve(null);return}const q=db.transaction('kv','readonly').objectStore('kv').get(STORE_KEY);q.onsuccess=()=>{db.close();resolve(q.result?normalizeBackup(q.result):null)};q.onerror=()=>{db.close();resolve(null)}}}catch{resolve(null)}});

};

storageAdapter.save=async function(data){data.appSettings.storageType='localStorage';const serialized=JSON.stringify(data),previous=localStorage.getItem(STORE_KEY);if(previous&&previous!==serialized)localStorage.setItem(STORE_KEY+'_recovery',previous);localStorage.setItem(STORE_KEY,serialized)};

storageAdapter.clear=async()=>{const raw=localStorage.getItem(STORE_KEY);if(raw)localStorage.setItem(STORE_KEY+'_recovery',raw);localStorage.removeItem(STORE_KEY)};

// 명시적으로 확인된 조건만 사용하여 보고 후보를 판정한다.

eventDefs.accident.fields.push(['death','사망자 발생','select:확인 필요|예|아니오'],['injury','부상자 발생','select:확인 필요|예|아니오'],['serious','산업안전보건법상 중대재해 해당 확인','select:확인 필요|예|아니오'],['employment','고용관계','select:확인 필요|학교 직접고용|수급인 소속'],['nature','재해 구분','select:확인 필요|사고성 재해|업무상 질병'],['reportConfirmed','사업주 보고대상 확인','select:확인 필요|예|아니오'],['insurance','보험·보상 적용 구분','select:확인 필요|산재보험 가입|공무원 재해보상|미가입·기타']);

eventDefs.contract.fields.push(['role','학교의 지위','select:확인 필요|도급인|건설공사발주자'],['construction','공사 종류','text'],['days','공사·작업기간(일)','number'],['contractExemption','적용 면제 여부','select:확인 필요|예|아니오']);

const originalOpenEventForm=openEventForm;

openEventForm=function(kind){originalOpenEventForm(kind);const form=document.getElementById('eventForm');form.querySelector('[name="date"]')?.setAttribute('required','');if(kind==='contract'||kind==='job_change'||kind==='chemical_product'||kind==='new_employee'||kind==='other'||kind==='external'){const candidates=app.data.taskMaster.filter(m=>m.active&&(m.triggerType===kind||kind==='other'&&['사건','상시'].includes(m.taskType)||kind==='external'&&['点검','점검'].includes(m.category)));const box=document.createElement('div');box.className='field full';box.innerHTML='<label>이번 사건에 적용 확인한 업무 선택 (미선택 업무는 원장에 보존)</label>'+candidates.map(m=>`<label class="check-item"><input type="checkbox" name="selectedCodes" value="${escapeHtml(m.taskCode)}"><span>${escapeHtml(m.taskName)}<br><small>${escapeHtml(m.applicationConditions||m.memo||'조건 확인 필요')}</small></span></label>`).join('');form.append(box)}};

const originalSubmitEvent=submitEvent;

submitEvent=async function(){const form=document.getElementById('eventForm');if(!form.reportValidity())return;const selected=[...form.querySelectorAll('[name="selectedCodes"]:checked')].map(x=>x.value);form.dataset.selected=JSON.stringify(selected);await originalSubmitEvent()};

function accidentDecision(values){const complete=values.death!=='확인 필요'&&['예','아니오'].includes(values.death)&&values.serious!=='확인 필요'&&values.injury!=='확인 필요'&&values.employment==='학교 직접고용'&&values.nature==='사고성 재해'&&values.reportConfirmed==='예';return {report:complete&&(values.death==='예'||values.leave==='예'&&values.leaveDays!==''&&Number(values.leaveDays)>=3),notReport:values.reportConfirmed==='아니오'||complete&&values.death==='아니오'&&(values.leave==='아니오'||values.leaveDays!==''&&Number(values.leaveDays)<3),serious:values.serious==='예'}}

addMasterTriggeredTasks=function(trigger,event,date){const values=event.data||{},acc=trigger==='accident'?accidentDecision(values):null,selected=JSON.parse(document.getElementById('eventForm')?.dataset.selected||'[]');let count=0;

  const candidates=app.data.taskMaster.filter(m=>m.active&&(trigger==='accident'?m.triggerType==='accident':selected.includes(m.taskCode)));

  for(const m of candidates){if(acc&&m.taskCode==='ACC-104'&&values.serious==='아니오')continue;if(acc&&m.taskCode==='ACC-102'&&acc.notReport)continue;if(acc&&/중대재해.*교육청/.test(m.taskName)&&values.serious==='아니오')continue;if(acc&&/요양급여/.test(m.taskName)&&values.insurance==='공무원 재해보상')continue;

    const key=occurrenceKey({...m,targetId:values.targetId||m.targetId},'',event.id);if(app.data.tasks.some(t=>t.occurrenceKey===key))continue;

    let due='',legal=false,review=true;

    if(acc&&m.taskCode==='ACC-102'&&acc.report){due=shiftMonths(date,1);legal=true;review=false}

    const t=masterToTask(m,{date,dueDate:due,sourceEventId:event.id,requiresReview:review});Object.assign(t,{occurrenceKey:key,originalDate:date,originalDueDate:due,deadlineKind:legal?'legal':'unconfirmed',legalVerification:m.legalVerification||'법령 검증 필요',alertDays:legal?'30,14,7,3,0,overdue':'0',changes:[],priority:'높음'});

    if(acc&&m.taskCode==='ACC-104'){t.memo+='\n중대재해 의심 시 즉시 보고 여부 확인. 숫자 일수 기한으로 변환하지 않음.'}

    if(review)t.memo+='\n추가 확인 필요: 적용조건·실시기한을 확인하세요.';app.data.tasks.push(t);app.syncChecklist(t);app.history(t.id,event.kind+' 사건에서 생성');count++;

  }

  if(acc){const t={id:uuid(),name:'사고 발생 즉시 응급조치 및 내부보고 확인',category:'산업재해',type:'사건',date,dueDate:'',sourceEventId:event.id,responsible:'학교 재해담당자',description:'응급조치·현장 위험 통제·내부 연락 및 보고기관 판정',checklist:['응급조치와 긴급구호','추가 위험 통제','내부 보고·보고기관 확인'].map(label=>({id:uuid(),label,required:true,done:false})),requiresReview:true,createdAt:new Date().toISOString(),completedByUser:false,memo:'즉시 대응 확인. 법정 일수 기한으로 확정하지 않음.',source:{name:'서울시교육청 매뉴얼',page:'PDF p.47~50'}};app.data.tasks.push(t);app.syncChecklist(t);count++}

  return count;

};

// 공문과 반복 일정은 사용자가 명시적으로 연결할 때만 관련 ID를 기록한다.

const originalQuickEvent=openQuickEvent;

openQuickEvent=function(){originalQuickEvent();const f=document.getElementById('quickForm');if(f){const div=document.createElement('div');div.className='field full';div.innerHTML='<label>연결할 기존 업무 ID (선택·명칭으로 자동 병합하지 않음)</label><select name="linkedTaskId"><option value="">연결하지 않음</option>'+app.data.tasks.filter(t=>statusOf(t)!=='완료').slice(0,500).map(t=>`<option value="${escapeHtml(t.id)}">${escapeHtml(taskDisplay(t).title)} · ${escapeHtml(t.date||'')}</option>`).join('')+'</select>';f.append(div)}};

const originalSaveQuick=saveQuick;

saveQuick=async function(){const f=document.getElementById('quickForm');if(!f.reportValidity())return;return originalSaveQuick()};

// 브라우저용 OCR·PDF 라이브러리는 파일 안에 포함된 자원만 사용한다.

const localResourceLoads={};
function loadLocalResources(kind){
 if(localResourceLoads[kind])return localResourceLoads[kind];
 localResourceLoads[kind]=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='assets/'+kind+'-resources.js';script.onload=()=>{const assets=window['Safety'+kind.toUpperCase()+'Assets'];if(!assets){delete localResourceLoads[kind];reject(Error('로컬 분석 자원을 확인하세요.'));return}Object.assign(EMBEDDED,assets);resolve()};script.onerror=()=>{script.remove();delete localResourceLoads[kind];reject(Error('압축을 모두 풀었는지와 assets/'+kind+'-resources.js 파일을 확인하세요.'))};document.head.append(script)});return localResourceLoads[kind];
}
const embeddedBytes=key=>Uint8Array.from(atob(EMBEDDED[key]),c=>c.charCodeAt(0));

const blobAsset=(key,type='text/javascript')=>URL.createObjectURL(new Blob([embeddedBytes(key)],{type}));

let bundledTesseractPromise;

getOcrWorker=async function(){
 await loadLocalResources('ocr');

  if(!bundledTesseractPromise)bundledTesseractPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=blobAsset('tesseract');s.onload=resolve;s.onerror=reject;document.head.append(s)});

  await bundledTesseractPromise;

  if(!ocrWorkerPromise){const languageLoader='\nconst bundledLanguages='+JSON.stringify({kor:EMBEDDED.kor,eng:EMBEDDED.eng})+';const nativeFetch=self.fetch;self.fetch=async function(url,...args){const match=String(url).match(/(kor|eng)\\.traineddata$/);if(match)return new Response(Uint8Array.from(atob(bundledLanguages[match[1]]),c=>c.charCodeAt(0)));return nativeFetch.call(self,url,...args)};\n';const worker=URL.createObjectURL(new Blob([embeddedBytes('core'),languageLoader,embeddedBytes('worker')],{type:'text/javascript'}));ocrWorkerPromise=Tesseract.createWorker(['kor','eng'],1,{workerPath:worker,workerBlobURL:false,langPath:'embedded-languages',gzip:false,cacheMethod:'none',logger:ocrProgress});ocrWorkerPromise.catch(()=>{ocrWorkerPromise=null})}

  return ocrWorkerPromise;

};

loadPdfJs=async function(){await loadLocalResources('pdf');if(!pdfJsPromise)pdfJsPromise=import(blobAsset('pdf')).then(lib=>{lib.GlobalWorkerOptions.workerSrc=blobAsset('pdfworker');return lib});return pdfJsPromise};

document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;

  if(b.matches('[data-auto-settings]'))showAutomationSettings();

  if(b.matches('[data-new-master]')){const m={taskCode:'USR-'+uuid(),taskName:'',taskType:'정기',category:'사용자 등록',active:true,verificationStatus:'needs_review',checklistItems:[],recurrenceType:'weekly',recurrenceInterval:1,applicability:'unknown',alertDays:'0',targetId:'school-default',stage:'main'};modal('업무원장 등록',masterForm(m),'<button class="btn" data-close>취소</button><button class="btn primary" data-save-master>저장</button>','wide')}

  if(b.matches('[data-clone-master]')){const m=JSON.parse(JSON.stringify(app.data.taskMaster.find(x=>x.taskCode===b.dataset.cloneMaster)));m.taskCode+='-'+uuid();m.targetId='target-'+uuid();m.applicability='unknown';app.data.taskMaster.push(m);await app.save();openMaster(m.taskCode,true)}

  if(b.matches('[data-auto-summary]')){const id=b.dataset.autoSummary;modal(({today:'오늘',week:'이번 주',month:'이번 달',soon:'기한 임박',late:'미완료·지연',done:'완료 이력'})[id],taskRows(summaryTasks(id)),'<button class="btn" data-close>닫기</button>','wide')}

  if(b.matches('[data-auto-alerts]'))modal('실행 시점 알림',`<div class="notice">프로그램을 열었을 때 현재 날짜로 계산합니다. 종료된 브라우저에는 알림을 보내지 않습니다. 설정 시점은 관리용 권장 알림입니다.</div>`+taskRows(notifications()),'<button class="btn" data-close>닫기</button>','wide');

  if(b.matches('[data-holidays]'))modal('공휴일·학교 휴무일',`<div class="notice">기본 비근무일은 토·일요일입니다. 법정공휴일과 학교 휴무일을 YYYY-MM-DD 형식으로 한 줄에 하나씩 입력하면 마지막 근무일 계산에서 제외합니다.</div><textarea id="holidayList" rows="12" style="width:100%">${escapeHtml((app.data.appSettings.holidays||[]).join('\n'))}</textarea>`,'<button class="btn" data-close>취소</button><button class="btn primary" data-save-holidays>저장</button>');

  if(b.matches('[data-save-holidays]')){const days=document.getElementById('holidayList').value.split(/\s+/).filter(Boolean);if(!days.every(validDay)){toast('날짜 형식을 확인하세요.');return}app.data.appSettings.holidays=[...new Set(days)];ensureSchedules();await app.save();closeOverlay();render()}

  if(b.matches('[data-recover]')){try{const raw=localStorage.getItem(STORE_KEY+'_recovery');if(!raw)throw Error('복구할 직전 저장본이 없습니다.');const data=JSON.parse(raw);validateBackup(data);window.pendingRestore=normalizeBackup(data);modal('직전 저장 상태 복구',`<p>복구본 업무 ${data.tasks.length}건 · 현재 업무 ${app.data.tasks.length}건. 동일 ID의 현재 데이터는 유지하고 누락 항목을 복구합니다.</p>`,'<button class="btn" data-close>취소</button><button class="btn primary" data-apply-restore>병합 복구</button>')}catch(err){toast(err.message)}}

});

document.addEventListener('visibilitychange',()=>{if(!document.hidden&&app.data){ensureSchedules();app.save().then(render).catch(()=>{})}});

/* v3.1: 한 번의 요약, 항상 보이는 월간 개요, 생략하지 않는 업무명 */

automationPanel=function(){const d=localToday(),w=monday(d),waiting=app.data.taskMaster.filter(m=>m.active&&m.applicability==='unknown').length;return `<section class="automation-panel"><div class="auto-metrics">${[['today','오늘'],['week','이번 주'],['month','이번 달'],['soon','기한 임박'],['late','미완료·지연'],['done','완료']].map(([id,label])=>`<button class="metric" data-auto-summary="${id}"><span>${label}</span><b>${summaryTasks(id).length}<small>건</small></b></button>`).join('')}</div><div class="automation-meta"><span>반복 완료율 · 이번 주 <b>${completionRate(w,addDays(w,6))}</b> · 이번 달 <b>${completionRate(d.slice(0,7)+'-01',monthEnd(d))}</b></span><details class="automation-options"><summary>반복 설정·알림</summary><div class="options-body"><button class="btn" data-auto-settings>적용대상 설정 (${waiting}건 확인 필요)</button><button class="btn" data-auto-alerts>알림 ${notifications().length}건</button><button class="btn" data-new-master>＋ 업무원장 등록</button><p>달력은 실시 예정일을 표시합니다. 수행기간 끝은 관리상 마감이며 법정기한과 구분합니다.</p></div></details></div></section>`};

function monthOverview(){const y=app.calendarDate.getFullYear(),m=app.calendarDate.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());let days='';const list=app.data.tasks.filter(t=>(app.allType==='전체'||t.type===app.allType)&&(app.allStatus==='전체'||statusOf(t)===app.allStatus)&&(!app.search||taskSearchText(t).includes(app.search)));for(let i=0;i<42;i++){const d=new Date(start);d.setDate(d.getDate()+i);const key=isoDate(d),ts=list.filter(t=>taskDate(t)===key||t.dueDate===key),done=ts.filter(t=>statusOf(t)==='완료').length;days+=`<button class="overview-day ${d.getMonth()!==m?'other':''} ${key===localToday()?'today':''} ${ts.length?'has-tasks':''}" data-day="${key}" aria-label="${key} 일정 ${ts.length}건" title="${escapeHtml(key+'\n'+ts.map(t=>taskDisplay(t).title+'\n해야 할 일: '+taskDisplay(t).action).join('\n'))}"><span class="overview-date">${d.getDate()}</span>${ts.length?`<span class="overview-count">${ts.length}건</span><span class="overview-dots">${[...new Set(ts.map(t=>t.type))].map(type=>`<i class="dot-${({정기:'regular',사건:'trigger',공문:'official',개인:'personal',상시:'always'}[type]||'always')}" aria-label="${escapeHtml(type)}"></i>`).join('')}${done?`<small>✓${done}</small>`:''}</span>`:'<span class="overview-count empty-count">—</span>'}</button>`}return `<section class="panel month-overview"><div class="overview-head"><h3 class="calendar-title">${y}년 ${m+1}월</h3><div class="calendar-tools"><button class="btn" data-cal="prev" aria-label="이전달">‹</button><button class="btn" data-cal="today">오늘</button><button class="btn" data-cal="next" aria-label="다음달">›</button></div></div><div class="overview-weekdays">${['일','월','화','수','목','금','토'].map(x=>`<span>${x}</span>`).join('')}</div><div class="overview-grid">${days}</div><div class="overview-legend"><span><i class="dot-regular"></i>정기</span><span><i class="dot-trigger"></i>사건</span><span><i class="dot-official"></i>공문</span><span><i class="dot-personal"></i>개인</span><small>날짜를 누르면 업무명 전체를 확인합니다.</small></div></section>`}

renderWorkCalendar=monthOverview;

renderWork=function(){const list=getFilteredTasks();return `<div class="work-overview-page">${pageHead('스마트 일정·업무관리','목록과 월간 일정을 함께 확인하세요.',`<button class="btn navy" data-action="situation">＋ 상황 등록</button><button class="btn primary" data-action="quick-event">＋ 일정 추가</button>`)}${toolbarHtml()}<div class="workspace-layout ${app.viewMode==='calendar'?'calendar-focus':''}"><section class="workspace-list"><div class="list-context"><strong>${escapeHtml(filterLabel())}</strong><button class="btn" data-clear-filters>조건 해제</button></div><div class="workspace-list-scroll">${renderWorkList(list)}</div></section>${monthOverview()}</div></div>`};

// 요약 모달도 화면 폭에 맞게 줄바꿈하는 카드 목록으로 표시한다.

taskRows=function(list){if(!list.length)return '<div class="empty">조건에 해당하는 업무가 없습니다.</div>';return `<div class="readable-task-list">${list.map(t=>`<article class="readable-task"><div class="readable-task-top">${statusBadge(statusOf(t))}${typeBadge(t.type)}<span>${fmtDate(taskDate(t))}</span></div><h4>${escapeHtml(taskDisplay(t).title)}</h4><div class="readable-task-foot"><span>${escapeHtml(t.responsible||t.category||'담당자 미지정')}${t.requiresReview?' · 추가 확인 필요':''}</span><button class="btn" data-task="${t.id}">업무보기</button></div></article>`).join('')}</div>`};

const renderBeforeLayout=render;

render=function(){renderBeforeLayout();const view=document.getElementById('view');if(app.page==='home'){view.querySelector('.home-metrics')?.remove();view.querySelector('.home-tabs')?.remove()}if(app.page==='work'){const page=view.querySelector('.work-overview-page'),metrics=view.querySelector('.automation-panel');if(page&&metrics)page.querySelector('.page-head').after(metrics)}view.classList.toggle('compact-work-view',app.page==='work')};

/* v3.2 참고 구성: 월간 달력 / 선택일 업무 / 다음 일정 / 전체 목록 */

app.dashDate=localToday();app.dashTab='day';app.period='all';

let dashDayTasks=()=>app.data.tasks.filter(t=>overlap(t,app.dashDate,app.dashDate));

function referenceMonth(){const y=app.calendarDate.getFullYear(),m=app.calendarDate.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay()),weeks=Math.ceil((first.getDay()+new Date(y,m+1,0).getDate())/7);let cells='';for(let i=0;i<weeks*7;i++){const d=new Date(start);d.setDate(d.getDate()+i);const key=isoDate(d),ts=app.data.tasks.filter(t=>taskDate(t)===key||t.dueDate===key);cells+=`<button class="ref-day ${d.getMonth()!==m?'outside':''} ${key===app.dashDate?'selected':''} ${d.getDay()===0?'sunday':d.getDay()===6?'saturday':''}" data-select-day="${key}" aria-label="${key} 일정 ${ts.length}건"><b>${d.getDate()}</b>${ts.length?`<span><i></i>${ts.length}건</span>`:''}${(app.data.appSettings.holidays||[]).includes(key)?'<small>휴무</small>':''}</button>`}return `<section class="panel ref-calendar"><div class="ref-calendar-head"><div><button class="btn" data-cal="prev" aria-label="이전달">‹</button><button class="btn" data-cal="next" aria-label="다음달">›</button></div><h3>${y}년 ${m+1}월</h3><button class="btn" data-dash-today>오늘</button></div><div class="ref-weekdays">${['일','월','화','수','목','금','토'].map(x=>`<span>${x}</span>`).join('')}</div><div class="ref-month-grid" style="--weeks:${weeks}">${cells}</div><div class="ref-calendar-note">날짜 선택 → 오른쪽 업무 확인 · 날짜는 실시 예정일 기준</div></section>`}

function referenceDayPanel(){const day=dashDayTasks(),late=app.data.tasks.filter(t=>!t.completedByUser&&['지연','임박','마감 임박'].includes(statusOf(t))).sort((a,b)=>(deadlineOf(a)||'9999').localeCompare(deadlineOf(b)||'9999')),pending=day.filter(t=>statusOf(t)!=='완료'),list=app.dashTab==='late'?late:app.dashTab==='all'?day:pending;const upcoming=app.data.tasks.filter(t=>statusOf(t)!=='완료'&&taskDate(t)>app.dashDate).sort((a,b)=>taskDate(a).localeCompare(taskDate(b))).slice(0,5);const d=parseDay(app.dashDate);return `<section class="panel ref-daily"><div class="ref-daily-head"><button class="btn" data-shift-day="-1" aria-label="이전 날짜">‹</button><h3>${d.getMonth()+1}월 ${d.getDate()}일 (${['일','월','화','수','목','금','토'][d.getDay()]})</h3><button class="btn" data-shift-day="1" aria-label="다음 날짜">›</button><button class="btn primary" data-dash-today>오늘</button></div><div class="ref-tabs">${[['day',app.dashDate===localToday()?'오늘 업무':'선택일 업무',pending.length],['late','지연·임박',late.length],['all','선택일 전체',day.length]].map(([key,label,count])=>`<button class="${key===app.dashTab?'active':''}" data-dash-tab="${key}">${label} <b>${count}</b></button>`).join('')}</div><div class="ref-daily-columns"><div class="ref-daily-list">${list.length?list.map(t=>`<article class="ref-task"><div class="ref-task-copy"><div class="ref-task-header">${statusBadge(statusOf(t))}<strong title="${escapeHtml(taskDisplay(t).title)}" ${isDirectSchedule(t)?'role="button" tabindex="0" data-task="'+escapeHtml(t.id)+'"':''}>${escapeHtml(taskDisplay(t).title)}</strong></div><div class="ref-task-body">${isDirectSchedule(t)?'':taskActionHtml(t)}<p class="ref-task-meta ${['지연','임박','마감 임박'].includes(statusOf(t))?'ref-urgent':''}">${performanceTimingHtml(t)}</p>${isDirectSchedule(t)?'':'<small>'+escapeHtml(t.category||'기타')+'</small>'}</div></div><button class="btn" data-task="${t.id}">업무 열기</button></article>`).join(''):'<div class="empty">해당 날짜의 업무가 없습니다.</div>'}</div><aside class="ref-upcoming"><div><h4>다음 일정 미리보기</h4><button data-upcoming-all>더보기 ›</button></div>${upcoming.length?upcoming.map(t=>`<button class="ref-upcoming-task" data-task="${t.id}"><i class="dot-${({정기:'regular',사건:'trigger',공문:'official',개인:'personal'}[t.type]||'always')}"></i><span><time>${scheduleCalendarLabel(t)==='자료제출'?directDeadlineHtml(t):fmtDate(taskDate(t))}</time><strong>${escapeHtml(taskDisplay(t).title)}</strong>${taskActionHtml(t)}</span></button>`).join(''):'<p class="subtle">다음 예정 일정이 없습니다.</p>'}</aside></div></section>`}

const referenceMetricsOld=automationPanel;

automationPanel=function(){if(app.page!=='work')return referenceMetricsOld();const w=monday(localToday());return `<section class="automation-panel ref-metrics"><div class="ref-metric-strip">${[['late','⚠','지연·미완료'],['soon','♟','기한 임박'],['today','▦','오늘'],['week','▦','이번 주'],['month','▦','이번 달'],['done','✓','완료']].map(([key,icon,label])=>`<button class="ref-metric ${key}" data-auto-summary="${key}"><i>${icon}</i><span>${label}</span><b>${summaryTasks(key).length}<small>건</small></b></button>`).join('')}</div><div class="automation-meta"><span>반복 완료율 · 이번 주 <b>${completionRate(w,addDays(w,6))}</b> · 이번 달 <b>${completionRate(localToday().slice(0,7)+'-01',monthEnd(localToday()))}</b></span><details class="automation-options"><summary>반복 설정·알림</summary><div class="options-body"><button class="btn" data-auto-settings>반복규칙·적용대상 설정</button><button class="btn" data-auto-alerts>실행 시 알림 ${notifications().length}건</button><button class="btn" data-new-master>＋ 업무원장 등록</button><p>반복 수행기간의 끝은 관리상 마감이며 법정기한과 구분합니다.</p></div></details></div></section>`};

function referenceTable(list){if(!list.length)return '<div class="empty">조건에 해당하는 업무가 없습니다.</div>';return `<div class="ref-table-scroll"><table class="ref-task-table"><thead><tr><th>No.</th><th>업무명</th><th>유형</th><th>근거/법령</th><th>예정일·반복</th><th>상태</th><th>담당자</th><th>관리</th></tr></thead><tbody>${list.map((t,i)=>`<tr><td>${i+1}</td><td><strong>${escapeHtml(taskDisplay(t).title)}</strong>${taskActionHtml(t)}</td><td>${typeBadge(t.type)}</td><td>${escapeHtml(t.source?.article||'—')}</td><td>${fmtDate(taskDate(t))}<small>${escapeHtml(t.recurrenceLabel||'일회성')}</small></td><td>${statusBadge(statusOf(t))}</td><td>${escapeHtml(t.responsible||'미지정')}</td><td><button class="btn" data-task="${t.id}">상세보기</button></td></tr>`).join('')}</tbody></table></div>`}

function referenceToolbar(count){return `<div class="ref-single-toolbar"><h3>☷ 전체 업무 목록 <small>(${count}건)</small></h3><input id="taskSearch" class="search-box" aria-label="업무명 검색" placeholder="업무명 검색" value="${escapeHtml(app.search)}"><select id="referencePeriod" aria-label="기간 필터">${[['all','전체 기간'],['today','오늘'],['week','이번 주'],['month','이번 달'],['custom','직접 지정']].map(([v,l])=>`<option value="${v}" ${app.period===v?'selected':''}>${l}</option>`).join('')}</select><select id="typeFilter" aria-label="업무유형 필터">${['전체','정기','사건','공문','개인','상시'].map(v=>`<option value="${v}" ${v===app.allType?'selected':''}>${v==='전체'?'전체 유형':v}</option>`).join('')}</select><select id="statusFilter" aria-label="상태 필터">${['전체','예정','임박','진행','완료','지연','확인필요'].map(v=>`<option value="${v}" ${v===app.allStatus?'selected':''}>${v==='전체'?'전체 상태':v}</option>`).join('')}</select><select id="sortFilter" aria-label="정렬"><option value="due" ${app.sort==='due'?'selected':''}>마감임박순</option><option value="recent" ${app.sort==='recent'?'selected':''}>최근등록순</option><option value="name" ${app.sort==='name'?'selected':''}>업무명순</option></select><div class="view-toggle"><button class="${app.viewMode==='list'?'active':''}" data-view-mode="list">☷ 목록</button><button class="${app.viewMode==='calendar'?'active':''}" data-view-mode="calendar">□ 캘린더</button></div></div>${app.period==='custom'?`<div class="ref-custom-period"><input id="customFrom" type="date" aria-label="시작일" value="${app.customFrom}"> ~ <input id="customTo" type="date" aria-label="종료일" value="${app.customTo}"></div>`:''}${app.period!=='all'||app.search||app.allType!=='전체'||app.allStatus!=='전체'?`<div class="ref-filter-info">${escapeHtml(filterLabel())}<button class="btn" data-clear-filters>조건 해제</button></div>`:''}`}

renderWork=function(){const list=getFilteredTasks();return `<div class="work-overview-page reference-dashboard">${pageHead('스마트 일정·업무관리','학교 산업안전보건 업무의 일정을 한눈에 확인하고 관리하세요.',`<details class="ref-register"><summary class="btn primary">＋ 업무 등록 <span>⌄</span></summary><div><button class="btn" data-action="situation">▤ 상황 등록</button><button class="btn" data-action="quick-event">▦ 일정 추가</button><button class="btn" data-new-master>＋ 업무원장 등록</button></div></details>`)}<div class="reference-top">${referenceMonth()}${referenceDayPanel()}</div><section class="panel ref-all-tasks">${referenceToolbar(list.length)}${app.viewMode==='calendar'?referenceMonth():referenceTable(list)}</section></div>`};

document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.matches('[data-select-day]')){app.dashDate=button.dataset.selectDay;app.dashTab='day';render()}if(button.matches('[data-dash-tab]')){app.dashTab=button.dataset.dashTab;render()}if(button.matches('[data-shift-day]')){app.dashDate=addDays(app.dashDate,Number(button.dataset.shiftDay));app.calendarDate=parseDay(app.dashDate);render()}if(button.matches('[data-dash-today]')){app.dashDate=localToday();app.calendarDate=new Date();app.dashTab='day';render()}if(button.matches('[data-upcoming-all]')){modal('다음 일정',taskRows(app.data.tasks.filter(t=>statusOf(t)!=='완료'&&taskDate(t)>app.dashDate).sort((a,b)=>taskDate(a).localeCompare(taskDate(b)))),'<button class="btn" data-close>닫기</button>','wide')}});

document.addEventListener("change",e=>{if(e.target.id==="referencePeriod"){app.period=e.target.value;app.summaryFilter=null;if(app.period==="custom"&&!app.customFrom){app.customFrom=localToday();app.customTo=localToday()}render()}});

/* SCOPE_CORRECTION_V33 */

// 홈은 최초 통합 홈 렌더러로 복원하고, 시안은 일정·업무관리에서만 적용한다.

renderHome=oldRenderHome;

fitHomeDashboard=function(){const viewport=document.querySelector('.home-viewport'),screen=viewport?.querySelector('.home-screen');if(!viewport||!screen)return;requestAnimationFrame(()=>{screen.style.transform='none';screen.style.width='100%';screen.dataset.scale='1';if(window.innerWidth<=820)return;const available=viewport.clientHeight;let scale=1;for(let i=0;i<4;i++){screen.style.width=`${100/scale}%`;const needed=screen.scrollHeight||1;const next=Math.min(1,available/needed);if(Math.abs(next-scale)<.002){scale=next;break}scale=next}screen.style.width=`${100/scale}%`;const finalNeeded=screen.scrollHeight||1;scale=Math.min(1,available/finalNeeded);screen.style.width=`${100/scale}%`;screen.style.transform=`scale(${scale})`;screen.dataset.scale=scale.toFixed(3)})};

homeTaskList=function(kind){let list=app.data.tasks.filter(t=>statusOf(t)!=='완료');if(kind==='today')list=list.filter(t=>dayDiff(taskDate(t))===0);if(kind==='week')list=list.filter(t=>{const d=dayDiff(taskDate(t));return d!==null&&d>=0&&d<=7});const rank={지연:0,확인필요:1,임박:2,진행:3,예정:4};return list.sort((a,b)=>(rank[statusOf(a)]??9)-(rank[statusOf(b)]??9)||(taskDate(a)||'9999').localeCompare(taskDate(b)||'9999')).slice(0,3)};

const iconSvg=(name)=>{const paths={home:'M3 11 12 3l9 8v10h-6v-7H9v7H3Z',calendar:'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2ZM7 2v5m10-5v5M3 10h18M7 14h2m3 0h2m3 0h1M7 18h2m3 0h2',chat:'M21 11a8 8 0 0 1-8 8H8l-5 3 1-6A8 8 0 1 1 21 11ZM8 11h.1m4 0h.1m4 0h.1',file:'M6 2h9l5 5v15H6ZM15 2v6h5M9 12h8M9 16h8',check:'M21 11v10H3V3h12M7 11l4 4L22 3',flask:'M9 2h6m-5 0v7L4 20q0 2 2 2h12q2 0 2-2l-6-11V2M8 15h8',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2',bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5ZM10 21h4'};return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.calendar}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`};

const restoredNav=renderNav;

renderNav=function(){if(app.page!=='work')return restoredNav();const icons={home:'home',work:'calendar',chatbot:'chat',forms:'file',inspection:'check',msds:'flask',settings:'settings'};document.getElementById('nav').innerHTML=menus.map(([id,_,label])=>`${id==='settings'?'<div class="nav-divider"></div>':''}<button data-page="${id}" aria-label="${label}" title="${label}" class="${app.page===id?'active':''}"><span class="ico">${iconSvg(icons[id])}</span><span class="txt">${label}</span></button>`).join('')};

automationPanel=function(){if(app.page!=='work')return '';const today=localToday(),week=monday(today),labels={late:'지연·미완료',soon:'기한 임박',today:'오늘',week:'이번 주',month:'이번 달'};return `<section class="automation-panel ref-metrics"><div class="ref-metric-strip">${['late','soon','today','week','month'].map(key=>`<button class="ref-metric ${key}" data-auto-summary="${key}"><i>${key==='late'?'!':iconSvg(key==='soon'?'bell':'calendar')}</i><span>${labels[key]}</span><b>${summaryTasks(key).length}<small>건</small></b>${key==='soon'?'<em>(7일 이내)</em>':key==='week'?`<em>(${+week.slice(5,7)}.${+week.slice(8)} - ${+addDays(week,6).slice(5,7)}.${+addDays(week,6).slice(8)})</em>`:key==='month'?`<em>(${+today.slice(5,7)}월)</em>`:''}</button>`).join('')}</div></section>`};

const beforeExactWork=renderWork;

renderWork=function(){return beforeExactWork().replace('<button class="btn" data-new-master>＋ 업무원장 등록</button>','<button class="btn" data-new-master>＋ 업무원장 등록</button><button class="btn" data-auto-settings>반복규칙·적용대상 설정</button><button class="btn" data-auto-alerts>알림 확인</button><button class="btn" data-auto-summary="done">완료 이력</button>')};

const displayState=t=>{const s=statusOf(t);return s==='예정'&&taskDate(t)===app.dashDate?'<span class="badge dash-today">오늘</span>':statusBadge(s)};

const oldRefDay=referenceDayPanel;

referenceDayPanel=function(){let html=oldRefDay();for(const t of dashDayTasks()){if(statusOf(t)==='예정')html=html.replace(`<div>${statusBadge('예정')}</div><div class="ref-task-copy"><strong>${escapeHtml(taskDisplay(t).title)}</strong>${taskActionHtml(t)}`,`<div>${displayState(t)}</div><div class="ref-task-copy"><strong>${escapeHtml(taskDisplay(t).title)}</strong>${taskActionHtml(t)}`)}return html};

render=function(){document.body.classList.toggle('reference-work',app.page==='work');document.body.classList.toggle('home-restored',app.page==='home');const n=ensureSchedules();if(n)app.save().catch(()=>{});originalRender();const view=document.getElementById('view');view.classList.toggle('compact-work-view',app.page==='work');if(app.page==='work'){const page=view.querySelector('.reference-dashboard'),block=document.createElement('div');block.innerHTML=automationPanel();page.querySelector('.page-head').after(block.firstElementChild)}const bell=document.querySelector('.notification');if(bell){bell.innerHTML='🔔<i>'+notifications().length+'</i>';bell.onclick=()=>modal('알림',taskRows(notifications()),'<button class="btn" data-close>닫기</button>','wide')}if(app.page==='home')fitHomeDashboard()};

/* v4: 두 개의 시안과 실제 로컬 업무 모듈 */

const SUITE_TEMPLATES=[['점검 결과·개선조치서','점검 일시·장소\n점검 대상 및 참여자\n확인한 위험요인\n개선 조치 내용·담당자·예정일\n조치 결과와 후속 확인'],['안전보건교육 기록부','교육 일시·시간·장소\n교육 구분·대상·참석자\n교육 담당자 및 강사\n교육 내용\n이수 확인 및 기록 보관'],['신규 채용자 교육기록','채용일·실제 작업 시작일\n직종·작업내용·고용형태\n교육 대상·면제 여부 확인\n교육 일시·시간·내용·강사\n실시 결과 및 확인'],['위험성평가 체크리스트','평가 대상 공정·작업\n근로자 의견과 유해·위험요인\n위험성 판단·우선순위\n감소대책·담당자·이행일\n결과 공유·교육 및 재확인'],['작업 전 안전점검표','작업명·장소·일시\n기계·기구·설비 상태\n작업장 정리·보호구 착용\n작업별 위험요인과 예방조치\n이상사항·작업중지·조치 확인']];

function suiteData(){const s=app.data.appSettings.suite??={};s.school??={name:'○○학교',owner:'',address:'',phone:''};for(const k of ['forms','inspections','products','chat'])s[k]??=[];return s}

const migrateBeforeSuite=migrateMasterData;

migrateMasterData=function(){const v=migrateBeforeSuite();suiteData();return v};

const mergeBeforeSuite=mergeBackup;

mergeBackup=function(a,b){const merged=mergeBeforeSuite(a,b),old=a.appSettings?.suite||{},incoming=b.appSettings?.suite||{};merged.appSettings.suite={...incoming,...old};for(const k of ['forms','inspections','products','chat']){const map=new Map;for(const x of [...(old[k]||[]),...(incoming[k]||[])])if(!map.has(x.id))map.set(x.id,x);merged.appSettings.suite[k]=[...map.values()]}return merged};

const validateBeforeSuite=validateBackup;

validateBackup=function(data){validateBeforeSuite(data);const s=data.appSettings?.suite;if(s===undefined)return;if(!s||typeof s!=='object'||Array.isArray(s))throw Error('통합 업무자료 형식 오류');for(const key of ['forms','inspections','products','chat'])if(s[key]!==undefined&&(!Array.isArray(s[key])||s[key].some(x=>!x||typeof x!=='object'||typeof x.id!=='string'||key!=='chat'&&typeof x.title!=='string')))throw Error(key+' 자료 형식 오류');};

function safeChatHtml(html){const doc=new DOMParser().parseFromString(String(html||''),'text/html');doc.querySelectorAll('script,style,iframe,object,embed,form,input,img,svg,link,meta').forEach(x=>x.remove());doc.querySelectorAll('*').forEach(el=>{for(const a of [...el.attributes])if(a.name.startsWith('on')||a.name==='style'||a.name==='srcdoc'||['href','src'].includes(a.name)&&!/^https?:\/\//i.test(a.value))el.removeAttribute(a.name)});return doc.body.innerHTML}

const mascot=()=>`<svg class="suite-bot" viewBox="0 0 76 84" aria-hidden="true"><path d="M38 10V5m0 0 4-2" stroke="#1731be" stroke-width="3" fill="none"/><circle cx="42" cy="3" r="3" fill="#00cbb0"/><path d="M19 48 9 57l4 7 9-8m34-8 10 9-4 7-9-8M28 65l-5 12 8 4 6-12m13-4 5 12-8 4-6-12" fill="#eef9ff" stroke="#213ab9" stroke-width="2"/><rect x="22" y="45" width="33" height="25" rx="11" fill="#f4fcff" stroke="#243abb" stroke-width="2"/><path d="M30 53h17l-2 12H32Z" fill="#09d5c7" stroke="#2945b6"/><ellipse cx="38" cy="31" rx="27" ry="23" fill="#effaff" stroke="#2432aa" stroke-width="2"/><rect x="17" y="16" width="42" height="29" rx="12" fill="#061c48" stroke="#1b5ace" stroke-width="2"/><path d="M26 27v5m23-5v5m-17 3q6 5 12 0" stroke="#00f1d1" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="14" cy="32" rx="4" ry="7" fill="#9dcfff" stroke="#2432aa"/><ellipse cx="62" cy="32" rx="4" ry="7" fill="#9dcfff" stroke="#2432aa"/></svg>`;

function suiteRegister(){return `<details class="ref-register"><summary class="btn primary">＋ 업무 등록 <span>⌄</span></summary><div><button class="btn" data-action="situation">▤ 상황 등록</button><button class="btn" data-action="quick-event">▦ 일정 등록</button><button class="btn" data-new-master>업무원장 등록</button><button class="btn" data-auto-settings>반복규칙·적용대상</button><button class="btn" data-auto-alerts>알림 확인</button><button class="btn" data-auto-summary="done">완료 이력</button></div></details>`}

function suiteHomeCalendar(){return referenceMonth().replaceAll('data-select-day=','data-suite-day=').replace(/(<button[^>]+data-suite-day="([^"]+)"[^>]*>)([\s\S]*?)(<\/button>)/g,(match,head,day,content,end)=>{const ts=app.data.tasks.filter(t=>taskDate(t)===day||t.dueDate===day);const dots=ts.slice(0,5).map(t=>{const status=statusOf(t),color=status==='지연'?'red':status==='임박'?'orange':/교육/.test(t.category)?'green':/점검/.test(t.category)?'purple':day===localToday()?'blue':t.type==='정기'?'purple':'muted';return `<i class="${color}" title="${escapeHtml(taskDisplay(t).title)}"></i>`}).join('');const labels=ts.filter(t=>['official_pdf_drop','personal_manual'].includes(t.sourceType)).map(t=>`<span class="calendar-schedule-item" role="button" tabindex="0" data-calendar-task="${escapeHtml(t.id)}" title="${escapeHtml(t.name)}">${escapeHtml(scheduleCalendarLabel(t))}</span>`).join('');return head+`<b>${parseDay(day).getDate()}</b>${labels?'<span class="calendar-task-preview">'+labels+'</span>':''}<span class="suite-date-dots">${dots}${ts.length>5?`<small>+${ts.length-5}</small>`:''}</span>`+((app.data.appSettings.holidays||[]).includes(day)?'<small>휴무</small>':'')+end})}

function miniRecords(kind){const s=suiteData();if(kind==='forms')return s.forms.slice(0,5).map(x=>`<button data-suite-edit="form" data-id="${x.id}" class="suite-record"><span class="record-icon">▤</span><strong>${escapeHtml(x.title)}</strong><em>${x.status==='done'?'완료':'작성중'}</em><time>${fmtDate(x.date)}</time></button>`).join('');if(kind==='inspections')return s.inspections.slice(0,5).map(x=>`<button data-suite-edit="inspection" data-id="${x.id}" class="suite-record"><span class="record-dot"></span><strong>${escapeHtml(x.title)}</strong><em class="${x.status==='미조치'?'red':x.status==='재점검 필요'?'orange':'green'}">${escapeHtml(x.status)}</em><time>${fmtDate(x.date)}</time></button>`).join('');return s.products.slice(0,5).map(x=>`<button data-suite-edit="product" data-id="${x.id}" class="suite-record"><span class="record-dot ${x.hazard==='위험물질'?'red':''}"></span><strong>${escapeHtml(x.title)}</strong><em class="${x.status==='정상'?'green':'orange'}">${escapeHtml(x.status)}</em><time>${fmtDate(x.date)}</time></button>`).join('')}

const emptyModule=(kind,text)=>`<button class="suite-empty" data-suite-new="${kind}">${text}<br><b>＋ 첫 자료 등록</b></button>`;

function suiteChatBox(full=false){const s=suiteData(),messages=s.chat.slice(full?-30:-2);return `<div class="suite-chat-stage ${full?'full-chat':''}"><div class="suite-greeting">${mascot()}<p>안녕하세요!<br>학교 산업안전보건 업무에 대해 무엇이든 질문해 주세요.</p></div>${messages.length?`<div class="suite-chat-history">${messages.map(m=>`<div class="suite-chat-message ${m.role}">${m.role==='assistant'?safeChatHtml(m.html):escapeHtml(m.text)}</div>`).join('')}</div>`:''}<div class="suite-prompts">${['신규 취업자 교육은 언제까지?','산업재해 발생 시 해야 할 일은?','위험성평가 추진 절차 알려줘','공사 시 확인해야 할 서식은?'].map(q=>`<button data-chat-prompt="${q}">${q}</button>`).join('')}</div></div><form id="suiteChatForm" class="suite-chat-input"><input name="question" aria-label="질문" placeholder="질문을 입력하세요…" required autocomplete="off"><button class="btn primary" aria-label="질문 보내기">➤</button></form><small class="suite-local-note">업무원장·체크리스트 기반 로컬 안내 · 외부 AI 연결 없음</small>`}

renderHome=function(){const s=suiteData(),ins=s.inspections,products=s.products;return `<div class="suite-home"><div class="suite-home-top"><section class="suite-card suite-home-schedule"><div class="suite-card-head"><span class="suite-square blue">${iconSvg('calendar')}</span><h2>오늘의 안전보건 업무</h2><div class="suite-home-month"><button class="btn" data-cal="prev" aria-label="이전달">‹</button><strong>${app.calendarDate.getFullYear()}년 ${app.calendarDate.getMonth()+1}월</strong><button class="btn" data-cal="next" aria-label="다음달">›</button><button class="btn" data-dash-today>오늘</button></div></div><div class="suite-home-summary">${[['late','지연','red'],['soon','임박','orange'],['today','오늘','blue'],['week','이번 주','purple']].map(([key,label,color])=>`<button data-auto-summary="${key}" class="${color}"><i></i>${label} <b>${summaryTasks(key).length}</b></button>`).join('')}${suiteRegister()}</div>${suiteHomeCalendar()}<div class="suite-calendar-legend">${[['red','지연'],['orange','임박'],['blue','오늘'],['purple','이번 주'],['green','교육'],['purple','점검'],['muted','기타']].map(([c,l])=>`<span class="${c}"><i></i>${l}</span>`).join('')}</div></section><section class="suite-card suite-home-chat"><div class="suite-card-head">${mascot()}<div><h2>AI 업무지원 챗봇</h2><p>산업안전보건 업무를 쉽고 빠르게 도와드립니다.</p></div><button class="suite-link" data-suite-help>ⓘ 도움말</button></div>${suiteChatBox()}</section></div><div class="suite-home-bottom"><section class="suite-card"><div class="suite-card-head"><span class="suite-square blue">${iconSvg('file')}</span><div><h2>대표서식 자동화</h2><p>자주 사용하는 서식을 빠르고 쉽게 작성합니다.</p></div><button class="suite-link" data-page="forms">전체 서식 ›</button></div><h4>최근 작성 서식</h4><div class="suite-records">${miniRecords('forms')||emptyModule('form','작성한 서식이 없습니다.')}</div></section><section class="suite-card"><div class="suite-card-head"><span class="suite-square green">${iconSvg('check')}</span><div><h2>시설안전 점검이력</h2><p>시설 점검 결과를 체계적으로 관리합니다.</p></div><button class="suite-link" data-page="inspection">전체 이력 ›</button></div><div class="suite-module-metrics">${[['미조치',ins.filter(x=>x.status==='미조치').length,'red'],['재점검 필요',ins.filter(x=>x.status==='재점검 필요').length,'orange'],['완료',ins.filter(x=>['완료','정상'].includes(x.status)).length,'green']].map(([label,n,c])=>`<button class="${c}" data-inspection-filter="${label}"><span>${label}</span><b>${n}건</b></button>`).join('')}</div><h4>최근 점검 내역</h4><div class="suite-records">${miniRecords('inspections')||emptyModule('inspection','등록한 점검이력이 없습니다.')}</div></section><section class="suite-card"><div class="suite-card-head"><span class="suite-square purple">${iconSvg('flask')}</span><div><h2>MSDS 업무지원</h2><p>화학물질을 안전하게 관리할 수 있도록 지원합니다.</p></div><button class="suite-link" data-page="msds">전체 제품 ›</button></div><div class="suite-module-metrics">${[['관리 제품',products.length,'blue'],['확인 필요',products.filter(x=>x.status!=='정상').length,'orange'],['위험물질',products.filter(x=>x.hazard==='위험물질').length,'red']].map(([label,n,c])=>`<button class="${c}" data-product-filter="${label}"><span>${label}</span><b>${n}개</b></button>`).join('')}</div><h4>최근 관리 제품</h4><div class="suite-records">${miniRecords('products')||emptyModule('product','등록한 화학제품이 없습니다.')}</div></section></div></div>`};

fitHomeDashboard=()=>{};

const suiteBaseModule=renderModulePage;

let suiteFilter='전체';

renderModulePage=function(id){const s=suiteData();if(id==='chatbot')return `${pageHead('AI 업무지원 챗봇','업무원장의 근거와 체크리스트를 찾아 안내합니다.')}<section class="suite-card suite-chat-page">${suiteChatBox(true)}<button class="btn" data-chat-clear>대화 기록 지우기</button></section>`;if(!['forms','inspection','msds'].includes(id))return suiteBaseModule(id);const kind={forms:'form',inspection:'inspection',msds:'product'}[id],items=id==='forms'?s.forms:id==='inspection'?s.inspections:s.products;const filtered=items.filter(x=>suiteFilter==='전체'||(x.status==='done'?'완료':x.status==='draft'?'작성중':x.status)===suiteFilter||suiteFilter==='관리 제품'||suiteFilter==='확인 필요'&&x.status!=='정상'||suiteFilter==='위험물질'&&x.hazard==='위험물질'||suiteFilter==='완료'&&x.status==='정상');return `${pageHead({forms:'대표서식 자동화',inspection:'시설안전 점검이력',msds:'MSDS 업무지원'}[id],id==='msds'?'제품별 자료 확보·교육·경고표시와 확인사항을 관리합니다.':id==='forms'?'서식을 작성·저장하고 미리보기·출력·다운로드합니다.':'점검과 개선조치, 재점검 기한을 함께 기록합니다.',`<button class="btn primary" data-suite-new="${kind}">＋ ${id==='forms'?'서식 작성':'등록'}</button>`)}${id==='forms'?`<div class="suite-template-list">${SUITE_TEMPLATES.map(([title],i)=>`<button class="btn" data-template="${i}">▤ ${title}</button>`).join('')}</div>`:''}<div class="suite-filter"><label>상태 <select id="suiteFilter">${['전체',...(id==='forms'?['작성중','완료']:id==='inspection'?['미조치','재점검 필요','정상','완료']:['정상','확인 필요','MSDS 자료 확인 필요','교육자료 변경 필요','MSDS 갱신 필요','위험물질'])].map(v=>`<option ${v===suiteFilter?'selected':''}>${v}</option>`).join('')}</select></label><span>${filtered.length}건</span></div><section class="suite-card suite-records module-records">${filtered.length?filtered.map(x=>`<button class="suite-record" data-suite-edit="${kind}" data-id="${x.id}"><strong>${escapeHtml(x.title)}</strong><span>${escapeHtml(x.location||x.target||'')}</span><em>${escapeHtml(x.status==='done'?'완료':x.status==='draft'?'작성중':x.status)}</em><time>${fmtDate(x.date)}</time></button>`).join(''):emptyModule(kind,'등록된 자료가 없습니다.')}</section>`};

function suiteField(name,label,value='',type='text',options){return options?`<div class="field"><label>${label}</label><select name="${name}">${options.map(x=>`<option ${String(value)===x?'selected':''}>${escapeHtml(x)}</option>`).join('')}</select></div>`:type==='textarea'?`<div class="field full"><label>${label}</label><textarea name="${name}" rows="6">${escapeHtml(value)}</textarea></div>`:`<div class="field"><label>${label}</label><input name="${name}" type="${type}" value="${escapeHtml(value)}" ${['title','date'].includes(name)?'required':''}></div>`}

function openSuiteRecord(kind,id,template=0){const s=suiteData(),key={form:'forms',inspection:'inspections',product:'products'}[kind],x=s[key].find(x=>x.id===id)||{id:uuid(),date:localToday(),owner:s.school.owner||'',school:s.school.name||'',title:kind==='form'?SUITE_TEMPLATES[template][0]:'',content:kind==='form'?SUITE_TEMPLATES[template][1]:'',status:kind==='form'?'draft':kind==='inspection'?'미조치':'확인 필요'};let fields=suiteField('title',kind==='product'?'제품명':'제목',x.title)+suiteField('date','작성·점검일',x.date,'date')+suiteField('owner','담당자',x.owner||'');if(kind==='form')fields+=suiteField('school','학교명',x.school||s.school.name)+suiteField('target','대상·장소',x.target||'')+suiteField('status','작성 상태',x.status==='done'?'완료':'작성중','text',['작성중','완료'])+suiteField('content','서식 본문 (필요한 내용을 입력하세요)',x.content||'','textarea');if(kind==='inspection')fields+=suiteField('location','점검 장소',x.location||'')+suiteField('status','조치 상태',x.status,'text',['미조치','재점검 필요','정상','완료'])+suiteField('nextDate','재점검·조치 예정일',x.nextDate||'','date')+suiteField('content','점검 내용·위험요인',x.content||'','textarea')+suiteField('action','개선조치·후속 확인',x.action||'','textarea');if(kind==='product')fields+=suiteField('location','보관·사용 장소',x.location||'')+suiteField('maker','제조사·공급처',x.maker||'')+suiteField('status','관리 상태',x.status,'text',['정상','확인 필요','MSDS 자료 확인 필요','교육자료 변경 필요','MSDS 갱신 필요'])+suiteField('hazard','위험물질 판정',x.hazard||'확인 필요','text',['확인 필요','위험물질','비대상 확인'])+suiteField('source','MSDS 출처·자료명',x.source||'')+suiteField('revision','MSDS 개정일',x.revision||'','date')+suiteField('educationDate','교육일',x.educationDate||'','date')+suiteField('nextDate','다음 확인 예정일',x.nextDate||'','date')+suiteField('content','유해·위험성·보호구·응급조치 메모',x.content||'','textarea')+`<div class="field full">${['MSDS 확보','현장 게시·비치','용기 경고표시','작업공정별 관리요령','취급자 교육'].map((label,i)=>`<label class="check-item"><input type="checkbox" name="check${i}" ${x.checks?.[i]?'checked':''}>${label}</label>`).join('')}</div>`;modal(kind==='form'?'서식 작성':kind==='inspection'?'시설안전 점검 기록':'MSDS 제품 관리',`<form id="suiteRecordForm" data-kind="${kind}" data-id="${x.id}" class="form-grid">${fields}</form>${kind==='product'?'<div class="notice">제품명만으로 위험물질이나 법정 측정·검진 대상을 자동 판정하지 않습니다. 공급처 MSDS와 적용조건을 확인하세요.</div>':''}`,`<button class="btn" data-close>닫기</button>${id?`<button class="btn danger" data-suite-delete="${kind}" data-id="${x.id}">삭제</button>`:''}${kind==='form'?'<button class="btn" data-form-preview>미리보기·출력</button><button class="btn" data-form-export>HTML 다운로드</button>':''}<button class="btn primary" data-suite-save>저장</button>`,'wide')}

async function saveSuiteRecord(close=true){const f=document.getElementById('suiteRecordForm');if(!f.reportValidity())return null;const s=suiteData(),kind=f.dataset.kind,key={form:'forms',inspection:'inspections',product:'products'}[kind],previous=s[key].find(x=>x.id===f.dataset.id),x={...previous,...Object.fromEntries(new FormData(f)),id:f.dataset.id,updatedAt:new Date().toISOString()};if(kind==='form')x.status=x.status==='완료'?'done':'draft';if(kind==='product')x.checks=Array.from({length:5},(_,i)=>f.querySelector(`[name="check${i}"]`).checked);x.history=[...(previous?.history||[]),{at:x.updatedAt,action:previous?'수정':'등록'}];s[key]=[x,...s[key].filter(v=>v.id!==x.id)];if(kind==='inspection'&&x.nextDate&&['미조치','재점검 필요'].includes(x.status)){let t=app.data.tasks.find(t=>t.linkedInspectionId===x.id);if(!t){t={id:uuid(),name:'시설점검 후속 확인 · '+x.title,type:'사건',category:'시설점검',date:x.nextDate,dueDate:'',responsible:x.owner,description:x.content,checklist:[{id:uuid(),label:'개선조치 이행 및 현장 확인',required:true,done:false}],createdAt:x.updatedAt,completedByUser:false,linkedInspectionId:x.id};app.data.tasks.push(t);app.syncChecklist(t)}else if(!t.completedByUser){t.originalDate??=t.date;t.date=x.nextDate;t.responsible=x.owner}}if(kind==='product'&&x.nextDate){let t=app.data.tasks.find(t=>t.linkedProductId===x.id);if(!t){t={id:uuid(),name:'MSDS 관리 확인 · '+x.title,type:'상시',category:'MSDS',date:x.nextDate,dueDate:'',responsible:x.owner,description:x.content,checklist:[],createdAt:x.updatedAt,completedByUser:false,linkedProductId:x.id};app.data.tasks.push(t)}else if(!t.completedByUser)t.date=x.nextDate}await app.save();if(close){closeOverlay();toast('저장했습니다.')}return x}

function formHtml(x){return `<!doctype html><html lang="ko"><meta charset="utf-8"><title>${escapeHtml(x.title)}</title><style>body{font:15px/1.9 'Malgun Gothic',sans-serif;margin:50px;color:#172b4d}h1{text-align:center;font-size:26px;border-bottom:2px solid #173b62;padding-bottom:18px}.meta{border:1px solid #bcc9d8;padding:14px}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid #bcc9d8;padding:20px;min-height:400px}button{padding:10px 20px}@media print{button{display:none}body{margin:18mm}}</style><h1>${escapeHtml(x.title)}</h1><div class="meta">학교: ${escapeHtml(x.school||'')}<br>작성일: ${escapeHtml(x.date)} · 담당자: ${escapeHtml(x.owner||'')}<br>대상·장소: ${escapeHtml(x.target||'')}</div><pre>${escapeHtml(x.content||'')}</pre></html>`}

function answerFromLedger(query){const keywords=query.split(/\s+/).filter(w=>w.length>1&&!/알려|언제|해야|절차|하는|해주세요/.test(w)),aliases=[[/신규|채용|취업/,'채용'],[/산업재해|사고/,'산업재해'],[/위험성/,'위험성평가'],[/공사|도급/,'공사'],[/건강|검진/,'건강진단'],[/물질|MSDS/i,'MSDS']].filter(([r])=>r.test(query)).map(x=>x[1]);const matches=app.data.taskMaster.map(m=>({m,score:[...keywords,...aliases].reduce((v,k)=>v+(m.taskName.includes(k)?5:(m.description+' '+m.category).includes(k)?2:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3);if(!matches.length)return '<p>업무원장에서 직접 일치하는 항목을 찾지 못했습니다. 업무명이나 분야(채용교육·위험성평가·도급·건강진단·MSDS)로 다시 질문해 주세요.</p>';return '<p><b>업무원장에 등록된 관련 절차입니다.</b></p>'+matches.map(({m})=>`<section><b>${escapeHtml(m.taskName)}</b><p>${escapeHtml(m.description||'')}</p><ol>${(m.checklistItems||[]).slice(0,6).map(v=>`<li>${escapeHtml(v)}</li>`).join('')}</ol><p>주기: ${escapeHtml(recurrenceLabel(m))}<br>적용조건: ${escapeHtml(m.applicationConditions||m.memo||'개별 확인 필요')}<br>근거: ${escapeHtml(m.sourceName||'업무원장')}<br>검증: ${escapeHtml(m.legalVerification||'법령 검증 필요')}</p><button class="btn" data-view-master="${m.taskCode}">원장 상세 확인</button></section>`).join('')+'<p>법정기한은 대상·기준일과 현행 법령 확인 후 확정하세요.</p>'}

async function sendSuiteChat(question){const q=question.trim();if(!q)return;const s=suiteData();s.chat.push({id:uuid(),role:'user',text:q,at:new Date().toISOString()},{id:uuid(),role:'assistant',html:answerFromLedger(q),at:new Date().toISOString()});s.chat=s.chat.slice(-100);await app.save();if(app.page==='home')document.querySelector('.suite-chat-history')?.scrollIntoView({block:'nearest'});}

function openSchoolSettings(){const school=suiteData().school;modal('학교 기본정보 설정',`<form id="suiteSchoolForm" class="form-grid">${suiteField('name','학교명',school.name)}${suiteField('owner','담당자',school.owner)}${suiteField('address','주소',school.address)}${suiteField('phone','연락처',school.phone)}</form>`,'<button class="btn" data-close>취소</button><button class="btn primary" data-school-save>저장</button>')}

const settingsBeforeSuite=renderSettings;renderSettings=()=>`<div class="suite-settings-shortcut"><button class="btn" data-school-settings>⚙ 학교 기본정보 설정</button></div>`+settingsBeforeSuite();

const navBeforeSuite=renderNav;renderNav=function(){const icons={home:'home',work:'calendar',chatbot:'chat',forms:'file',inspection:'check',msds:'flask',settings:'settings'};document.getElementById('nav').innerHTML=menus.map(([id,_,label])=>`${id==='settings'?'<div class="nav-divider"></div>':''}<button data-page="${id}" aria-label="${label}" title="${label}" class="${app.page===id?'active':''}"><span class="ico">${iconSvg(icons[id])}</span><span class="txt">${label}</span></button>`).join('')};

const renderBeforeSuite=render;

render=function(){if(!app.data)return;suiteData();document.body.classList.add('suite-v4');renderBeforeSuite();document.body.classList.toggle('suite-home-page',app.page==='home');const header=document.querySelector('.global-header');header.innerHTML=`<div class="suite-brand">${mascot()}<strong>산업안전 <em>안심</em>봇(BOT)</strong><span>산업안전 AI 비서, 든든한 안심 보따리</span></div><div class="suite-header-tools"><button class="suite-bell" data-suite-alerts aria-label="알림">${iconSvg('bell')}<b>${notifications().length}</b></button><button class="btn" data-school-settings>${escapeHtml(suiteData().school.name)} ⌄</button><button class="btn" data-school-settings>⚙ 학교 기본정보 설정</button><span id="saveStatus" hidden>브라우저에 저장됨</span></div>`;document.querySelector('.sample-note').innerHTML='<b>업무원장 변화별</b><br>전달할 항목 확인 ›';if(app.page==='home'){const screen=document.querySelector('.home-screen');screen.style.transform='none';screen.style.width='100%'}const f=document.getElementById('suiteChatForm');if(f)f.onsubmit=e=>{e.preventDefault();sendSuiteChat(new FormData(f).get('question'))};const sf=document.getElementById('suiteFilter');if(sf)sf.onchange=()=>{suiteFilter=sf.value;render()}};

document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;if(b.matches('[data-school-settings]'))openSchoolSettings();if(b.matches('[data-school-save]')){const f=document.getElementById('suiteSchoolForm');if(!f.reportValidity())return;suiteData().school=Object.fromEntries(new FormData(f));await app.save();closeOverlay()}if(b.matches('[data-suite-alerts]'))modal('알림',taskRows(notifications()),'<button class="btn" data-close>닫기</button>','wide');if(b.matches('[data-suite-day]')){app.dashDate=b.dataset.suiteDay;modal(fmtDate(app.dashDate)+' 업무',taskRows(app.data.tasks.filter(t=>overlap(t,app.dashDate,app.dashDate))),'<button class="btn" data-close>닫기</button>','wide')}if(b.matches('[data-suite-new]'))openSuiteRecord(b.dataset.suiteNew);if(b.matches('[data-suite-edit]'))openSuiteRecord(b.dataset.suiteEdit,b.dataset.id);if(b.matches('[data-template]'))openSuiteRecord('form',null,+b.dataset.template);if(b.matches('[data-suite-save]'))await saveSuiteRecord();if(b.matches('[data-suite-delete]')&&confirm('이 기록을 삭제하시겠습니까? 연결된 업무와 그 이력은 보존됩니다.')){const key={form:'forms',inspection:'inspections',product:'products'}[b.dataset.suiteDelete];suiteData()[key]=suiteData()[key].filter(x=>x.id!==b.dataset.id);await app.save();closeOverlay()}if(b.matches('[data-form-export]')){const x=await saveSuiteRecord(false);if(x)download(x.title+'.html',formHtml(x),'text/html;charset=utf-8')}if(b.matches('[data-form-preview]')){const x=await saveSuiteRecord(false);if(x){window.suitePreviewHtml=formHtml(x);modal('서식 미리보기',`<iframe id="suiteFormPreview" title="서식 미리보기" sandbox="allow-same-origin allow-modals" style="width:100%;height:60vh;border:1px solid #ddd"></iframe>`,'<button class="btn" data-close>닫기</button><button class="btn primary" data-form-print>인쇄·PDF 저장</button>','wide');document.getElementById('suiteFormPreview').srcdoc=window.suitePreviewHtml}}if(b.matches('[data-form-print]'))document.getElementById('suiteFormPreview').contentWindow.print();if(b.matches('[data-chat-prompt]'))await sendSuiteChat(b.dataset.chatPrompt);if(b.matches('[data-chat-clear]')&&confirm('대화 기록을 지우시겠습니까?')){suiteData().chat=[];await app.save()}if(b.matches('[data-suite-help]'))modal('챗봇 안내','<p>기본 업무원장과 체크리스트를 검색하여 근거·쪽수와 함께 안내하는 오프라인 도우미입니다. 외부 생성형 AI에 연결하지 않으며 개별 사건의 법적 판단이나 기한을 확정하지 않습니다. 질문과 답변은 이 브라우저에 저장되고 전체 데이터 백업에 포함됩니다.</p>','<button class="btn" data-close>닫기</button>');if(b.matches('[data-inspection-filter]')){app.page='inspection';suiteFilter=b.dataset.inspectionFilter;render()}if(b.matches('[data-product-filter]')){app.page='msds';suiteFilter=b.dataset.productFilter;render()}});

document.addEventListener('click',e=>{if(e.target.closest('[data-page]'))suiteFilter='전체'},true);

/* 기능 보완 전용. 대시보드 렌더러·HTML·CSS는 변경하지 않는다. */

function recordTaskSnapshot(t){return {name:t.name,date:t.date,responsible:t.responsible,description:t.description,completedByUser:t.completedByUser}}

function pushRecordTaskChange(t,before,reason){const after=recordTaskSnapshot(t);if(JSON.stringify(before)===JSON.stringify(after))return;t.changes??=[];t.changes.push({at:new Date().toISOString(),before,after,reason});app.history(t.id,reason)}

const saveRecordBeforeFix=saveSuiteRecord;

saveSuiteRecord=async function(close=true){

  const f=document.getElementById('suiteRecordForm');if(!f||!f.reportValidity())return null;

  const kind=f.dataset.kind,recordId=f.dataset.id,key={form:'forms',inspection:'inspections',product:'products'}[kind];

  const values=Object.fromEntries(new FormData(f));

  if(!String(values.title||'').trim()){toast('제목을 입력하세요.');f.querySelector('[name="title"]').focus();return null}

  for(const k of ['date','nextDate','revision','educationDate'])if(values[k]&&!validDay(values[k])){toast('날짜를 확인하세요.');return null}

  const beforeRecord=JSON.parse(JSON.stringify(suiteData()[key].find(x=>x.id===recordId)||null));

  const links=app.data.tasks.filter(t=>kind==='inspection'?t.linkedInspectionId===recordId:kind==='product'?t.linkedProductId===recordId:false);

  const taskBefore=new Map(links.map(t=>[t.id,recordTaskSnapshot(t)]));

  const x=await saveRecordBeforeFix(false);if(!x)return null;

  let needsSave=false;

  const now=new Date().toISOString();

  if(kind==='form'){x.completedAt=x.status==='done'?(beforeRecord?.completedAt||now):null;x.history[x.history.length-1].before=beforeRecord?{title:beforeRecord.title,date:beforeRecord.date,status:beforeRecord.status}:null;needsSave=true}

  if(kind==='inspection'||kind==='product'){

    let linked=app.data.tasks.filter(t=>kind==='inspection'?t.linkedInspectionId===recordId:t.linkedProductId===recordId);

    const pending=linked.filter(t=>!t.completedByUser),done=linked.filter(t=>t.completedByUser);

    const isFinal=kind==='inspection'&&['정상','완료'].includes(x.status);

    if(isFinal){for(const t of pending){const before=taskBefore.get(t.id)||recordTaskSnapshot(t);t.originalDate??=t.date;t.checklist??=[];t.checklist.forEach(c=>c.done=true);t.completedByUser=true;t.completedAt=now;t.memo=(t.memo||'')+'\n점검 기록에서 '+x.status+' 처리';app.syncChecklist(t);pushRecordTaskChange(t,before,'연결 점검 기록에서 완료 확인');needsSave=true}}

    else if(x.nextDate){

      let active=pending[0];

      if(!active){const matchingDone=done.find(t=>t.date===x.nextDate);const isNewCycle=beforeRecord&&['정상','완료'].includes(beforeRecord.status)&&!['정상','완료'].includes(x.status)||!matchingDone;

        if(isNewCycle){active={id:uuid(),name:(kind==='inspection'?'시설점검 후속 확인 · ':'MSDS 관리 확인 · ')+x.title,type:kind==='inspection'?'사건':'상시',category:kind==='inspection'?'시설점검':'MSDS',date:x.nextDate,dueDate:'',originalDate:x.nextDate,responsible:x.owner||'',description:x.content||'',checklist:kind==='inspection'?[{id:uuid(),label:'개선조치 이행 및 현장 확인',required:true,done:false}]:[],createdAt:now,completedByUser:false,changes:[]};active[kind==='inspection'?'linkedInspectionId':'linkedProductId']=recordId;app.data.tasks.push(active);app.syncChecklist(active);app.history(active.id,'다음 확인 회차 등록');needsSave=true}

      }

      if(active){const before=taskBefore.get(active.id)||recordTaskSnapshot(active);active.originalDate??=before.date;active.name=(kind==='inspection'?'시설점검 후속 확인 · ':'MSDS 관리 확인 · ')+x.title;active.date=x.nextDate;active.responsible=x.owner||'';active.description=x.content||'';pushRecordTaskChange(active,before,'연결 기록의 내용·담당자·일정 변경');needsSave=true}

    }

    const change=x.history[x.history.length-1];change.before=beforeRecord?{title:beforeRecord.title,date:beforeRecord.date,status:beforeRecord.status,nextDate:beforeRecord.nextDate||'',owner:beforeRecord.owner||''}:null;change.after={title:x.title,date:x.date,status:x.status,nextDate:x.nextDate||'',owner:x.owner||''};needsSave=true;

  }

  if(needsSave)await app.save();if(close){closeOverlay();toast('저장했습니다.')}return x;

};

const answerBeforeFix=answerFromLedger;

answerFromLedger=function(query){const q=String(query||'').trim(),compact=q.replace(/\s/g,'');let period=null;if(/오늘/.test(compact)&&/업무|할일|일정/.test(compact))period='today';else if(/이번주|금주/.test(compact)&&/업무|할일|일정/.test(compact))period='week';else if(/이번달|이달/.test(compact)&&/업무|할일|일정/.test(compact))period='month';else if(/지연|미완료/.test(compact)&&/업무|할일|일정/.test(compact))period='late';if(period){const ts=summaryTasks(period);return `<p><b>${{today:'오늘',week:'이번 주',month:'이번 달',late:'지연·미완료'}[period]} 업무 ${ts.length}건</b></p>${ts.length?'<ul>'+ts.slice(0,20).map(t=>`<li><b>${escapeHtml(taskDisplay(t).title)}</b><br>예정일 ${fmtDate(taskDate(t))} · ${escapeHtml(statusOf(t))}<br>담당자 ${escapeHtml(t.responsible||'미지정')}<br><button class="btn" data-task="${t.id}">업무 열기</button></li>`).join('')+'</ul>':'<p>현재 조건에 해당하는 업무가 없습니다.</p>'}${ts.length>20?'<p>전체 목록은 일정·업무관리에서 확인하세요.</p>':''}<p>실제 저장된 일정 기준입니다.</p>`}

  if(/점검.*(현황|진행|내역)|미조치|재점검/.test(q)){const rows=suiteData().inspections.filter(x=>!/미조치/.test(q)||x.status==='미조치');return `<p><b>시설점검 기록 ${rows.length}건</b></p>${rows.length?'<ul>'+rows.slice(0,10).map(x=>`<li>${escapeHtml(x.title)} · ${escapeHtml(x.status)}<br>${escapeHtml(x.location||'')} · ${fmtDate(x.date)}<br><button class="btn" data-suite-edit="inspection" data-id="${x.id}">기록 열기</button></li>`).join('')+'</ul>':'<p>등록된 점검이력이 없습니다.</p>'}`}

  if(/(MSDS|화학제품|화학물질).*(현황|목록|관리제품|관리 제품)/i.test(q)){const rows=suiteData().products;return `<p><b>관리 제품 ${rows.length}개</b></p>${rows.length?'<ul>'+rows.slice(0,10).map(x=>`<li>${escapeHtml(x.title)} · ${escapeHtml(x.status)}<br>자료 출처: ${escapeHtml(x.source||'미입력')}<br><button class="btn" data-suite-edit="product" data-id="${x.id}">제품 열기</button></li>`).join('')+'</ul>':'<p>등록된 제품이 없습니다.</p>'}`}

  return answerBeforeFix(q);

};

const validatorBeforeFix=validateBackup;

validateBackup=function(data){validatorBeforeFix(data);const s=data.appSettings?.suite;if(!s)return;if(s.school!==undefined&&(!s.school||typeof s.school!=='object'||Array.isArray(s.school)))throw Error('학교 정보 형식 오류');for(const key of ['forms','inspections','products'])for(const x of s[key]||[]){for(const k of ['date','nextDate','revision','educationDate'])if(x[k]&&!validDay(x[k]))throw Error(key+' 날짜 형식 오류');if(key==='products'&&x.checks!==undefined&&(!Array.isArray(x.checks)||x.checks.some(v=>typeof v!=='boolean')))throw Error('MSDS 체크리스트 형식 오류')}for(const x of s.chat||[])if(!['user','assistant'].includes(x.role)||x.role==='user'&&typeof x.text!=='string'||x.role==='assistant'&&typeof x.html!=='string')throw Error('대화 기록 형식 오류')};

const APPROVED_REFERENCE_URL='assets/home-reference.png';
document.documentElement.style.setProperty('--approved-reference',`url("${APPROVED_REFERENCE_URL}")`);

function mockSprite(x,y,w,h,cls=''){return `<span class="mock-sprite ${cls}" style="--sx:${x}px;--sy:${y}px;width:${w}px;height:${h}px" aria-hidden="true"></span>`}

const fidelityRecordBase=miniRecords;

miniRecords=function(kind){const s=suiteData(),rows=kind==='forms'?s.forms:kind==='inspections'?s.inspections:s.products;return rows.slice(0,5).map(x=>`<button data-suite-edit="${{forms:'form',inspections:'inspection',products:'product'}[kind]}" data-id="${x.id}" class="suite-record">${kind==='forms'?mockSprite(283,735,23,25,'record-icon'):`<span class="record-dot ${kind==='products'&&x.hazard==='위험물질'?'red':''}"></span>`}<strong>${escapeHtml(x.title)}</strong><em class="${kind==='forms'?'':x.status==='미조치'?'red':x.status==='재점검 필요'||x.status!=='정상'&&kind==='products'?'orange':'green'}">${escapeHtml(x.status==='done'?'완료':x.status==='draft'?'작성중':x.status)}</em><time>${fmtDate(x.date)}</time><span class="record-more" aria-label="편집">•••</span></button>`).join('')};

suiteRegister=()=>`<details class="ref-register"><summary class="btn primary">${mockSprite(937,160,22,22)} 업무 등록 <span>⌄</span></summary><div><button class="btn" data-action="situation">${iconSvg('file')} 상황 등록</button><button class="btn" data-action="quick-event">${iconSvg('calendar')} 일정 등록</button></div></details>`;

const fidelityNavBase=renderNav;

renderNav=function(){const icons={home:[25,106],work:[25,167],chatbot:[25,229],forms:[25,291],inspection:[25,356],msds:[25,418],settings:[25,503]};document.getElementById('nav').innerHTML=menus.map(([id,_,label])=>`${id==='settings'?'<div class="nav-divider"></div>':''}<button data-page="${id}" aria-label="${label}" title="${label}" class="${app.page===id?'active':''}"><span class="ico">${mockSprite(...icons[id],33,34)}</span><span class="txt">${label}</span></button>`).join('')};

const fidelityTableBase=referenceTable;

referenceTable=function(list){const raw=fidelityTableBase(list);if(!list.length)return raw;return raw.replace('<th>No.</th>','<th class="task-select-column"><input type="checkbox" data-select-all-tasks aria-label="표시된 업무 전체 선택"></th><th>No.</th>').replace(/<tr><td>(\d+)<\/td>/g,(_,n)=>`<tr><td class="task-select-column"><input type="checkbox" data-select-row="${list[Number(n)-1].id}" aria-label="${escapeHtml(list[Number(n)-1].name)} 선택"></td><td>${n}</td>`)};

const beforeFidelityRender=render;

render=function(){beforeFidelityRender();document.documentElement.style.setProperty('--approved-reference',`url("${APPROVED_REFERENCE_URL}")`);const brand=document.querySelector('.suite-brand');if(brand)brand.innerHTML=(app.page==='home'||app.page==='work')?`<span class="mock-brand custom-title-brand" role="img" aria-label="산업안전 안심봇(BOT), 산업안전 AI 비서 든든한 안심 보따리"><img class="custom-title-image" src="assets/title-logo.png" alt=""></span>`:`<span class="mock-brand" role="img" aria-label="산업안전 안심봇(BOT), 산업안전 AI 비서 든든한 안심 보따리"></span>`;

 const bell=document.querySelector('.suite-bell');if(bell)bell.innerHTML=mockSprite(1296,13,30,38)+`<b>${notifications().length}</b>`;

 if(app.page==='home'){

   const head=document.querySelector('.suite-home-chat .suite-card-head>.suite-bot');if(head)head.outerHTML=mockSprite(1121,96,68,73,'chat-reference-bot');

   const greeting=document.querySelector('.suite-greeting>.suite-bot');if(greeting)greeting.outerHTML=mockSprite(1132,221,51,59,'greeting-reference-bot');

   const icons=[['.suite-home-schedule .suite-square',271,100,49,47],['.suite-home-bottom>.suite-card:nth-child(1) .suite-square',271,603,64,65],['.suite-home-bottom>.suite-card:nth-child(2) .suite-square',746,603,65,65],['.suite-home-bottom>.suite-card:nth-child(3) .suite-square',1207,603,65,65]];

   for(const [selector,x,y,w,h]of icons){const el=document.querySelector(selector);if(el){el.innerHTML=mockSprite(x,y,w,h);el.classList.add('original-graphic')}}

   const stage=document.querySelector('.suite-chat-stage');if(stage){const watermark=document.createElement('span');watermark.className='approved-watermark';watermark.innerHTML=mockSprite(1121,96,68,73);stage.prepend(watermark)}

 }

 document.querySelectorAll('.ref-register>div').forEach(menu=>[...menu.querySelectorAll('button')].slice(2).forEach(x=>x.remove()));

 const note=document.querySelector('.sample-note');if(note){note.classList.add('approved-footer');note.setAttribute('role','button');note.setAttribute('tabindex','0');note.setAttribute('aria-label','업무원장 검토 필요 항목 확인');note.onclick=showAutomationSettings;note.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')showAutomationSettings()}}

 document.querySelectorAll('.ref-task-table .task-select-column input').forEach(x=>{if(x.dataset.selectRow)x.checked=app.selectedTaskIds?.has(x.dataset.selectRow)||false});

};

document.addEventListener('change',e=>{if(e.target.matches('[data-select-row]')){app.selectedTaskIds??=new Set;e.target.checked?app.selectedTaskIds.add(e.target.dataset.selectRow):app.selectedTaskIds.delete(e.target.dataset.selectRow);e.target.closest('tr').classList.toggle('selected-task-row',e.target.checked)}if(e.target.matches('[data-select-all-tasks]')){app.selectedTaskIds??=new Set;document.querySelectorAll('[data-select-row]').forEach(x=>{x.checked=e.target.checked;e.target.checked?app.selectedTaskIds.add(x.dataset.selectRow):app.selectedTaskIds.delete(x.dataset.selectRow);x.closest('tr').classList.toggle('selected-task-row',x.checked)})}});

/* 시안 고정 어댑터. 저장·업무 계산은 기존 함수에 위임한다. */

function approvedFullDate(value){const d=parseDay(value);return Number.isNaN(+d)?escapeHtml(value||''):`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}(${['일','월','화','수','목','금','토'][d.getDay()]})`}

function approvedShortDate(value){return String(value||'').slice(5).replace('-','.')}

miniRecords=function(kind){const s=suiteData(),rows=s[{forms:'forms',inspections:'inspections',products:'products'}[kind]];return rows.slice(0,5).map(x=>{const form=kind==='forms',cls=form?'':x.status==='미조치'?'red':x.status==='재점검 필요'||kind==='products'&&x.status!=='정상'?'orange':'green',status=x.status==='done'?'완료':x.status==='draft'?'작성중':x.status,day=form?String(x.date||'').replaceAll('-','. ')+'.':approvedShortDate(x.date),dot=kind==='products'?(x.hazard==='위험물질'?'red':x.status==='정상'?'green':'orange'):'';return `<button data-suite-edit="${{forms:'form',inspections:'inspection',products:'product'}[kind]}" data-id="${escapeHtml(x.id)}" class="suite-record" title="${escapeHtml(x.title)}">${form?mockSprite(283,735,23,25,'record-icon'):`<span class="record-dot ${dot}"></span>`}<strong>${escapeHtml(x.title)}</strong><em class="${cls} ${form&&x.status==='done'?'record-done':''}">${escapeHtml(status)}</em><time>${escapeHtml(day)}</time><span class="record-more" aria-label="편집">•••</span></button>`}).join('')};

const approvedRenderBase=render;

render=function(){approvedRenderBase();document.documentElement.style.setProperty('--approved-reference','url("assets/home-reference.png")');document.documentElement.style.setProperty('--approved-work-reference','url("assets/work-reference.png")');

 const school=document.querySelector('.suite-header-tools>.btn');if(school)school.innerHTML=`${escapeHtml(suiteData().school.name)} <span aria-hidden="true">⌄</span>`;

 const bell=document.querySelector('.suite-bell');if(bell)bell.innerHTML=mockSprite(1296,21,30,31)+`<b>${notifications().length}</b>`;

 document.querySelectorAll('#nav button').forEach(x=>{if(x.dataset.page===app.page)x.setAttribute('aria-current','page')});

 if(app.page==='home'){

  document.querySelectorAll('.suite-home-chat>.suite-card-head,.suite-home-bottom .suite-card-head').forEach(x=>x.classList.add('approved-skin'));

  document.querySelectorAll('.suite-home-bottom>.suite-card:first-child .suite-record').forEach(x=>{if(x.querySelector('.record-done'))x.classList.add('record-complete-form')});

  const stage=document.querySelector('.suite-chat-stage');if(stage&&suiteData().chat.length)stage.classList.add('has-conversation');

  const q=document.querySelector('[name="question"]');if(q)q.placeholder='질문을 입력하세요...';

 }

 if(app.page==='work'){

  document.querySelectorAll('.ref-calendar-head').forEach(head=>{const next=head.querySelector('[data-cal="next"]'),month=head.querySelector('h3');if(next&&month)month.after(next)});

  const h=document.querySelector('.ref-single-toolbar h3');if(h)h.innerHTML=`<span class="approved-list-icon" aria-hidden="true"></span><span>전체 업무 목록</span><small>(${getFilteredTasks().length}건)</small>`;

  const search=document.getElementById('taskSearch');if(search)search.placeholder='업무명 검색 (엔터로 검색)';

  const actions=document.querySelectorAll('.page-head .ref-register>div>.btn');actions.forEach((x,i)=>{x.innerHTML=iconSvg(i?'calendar':'file')+(i?' 일정 추가':' 상황 등록')});

  document.querySelectorAll('.ref-task').forEach(row=>{const id=row.querySelector('[data-task]')?.dataset.task,t=app.data.tasks.find(t=>t.id===id);if(!t)return;const p=row.querySelector('.ref-task-copy p');p.innerHTML=performanceTimingHtml(t);const small=row.querySelector('.ref-task-copy small:not(.task-action-summary)');if(small)small.textContent=(t.category||'기타')+(t.source?.article?'　|　'+t.source.article:'')});

  document.querySelectorAll('.ref-upcoming-task').forEach(row=>{const t=app.data.tasks.find(x=>x.id===row.dataset.task);if(!t)return;const d=parseDay(taskDate(t)),time=row.querySelector('time');time.textContent=approvedShortDate(taskDate(t))+`(${['일','월','화','수','목','금','토'][d.getDay()]})`;row.title=taskFullLabel(t)});

  document.querySelectorAll('.ref-task-table tbody tr').forEach(row=>{const id=row.querySelector('[data-task]')?.dataset.task,t=app.data.tasks.find(x=>x.id===id);if(!t)return;const cell=row.children[5];if(cell){const small=cell.querySelector('small');cell.innerHTML=approvedFullDate(taskDate(t))+(small?small.outerHTML:'')}row.querySelector('strong')?.setAttribute('title',t.name)});

 }

};

/* Manual name review 2026-10-20. Only presentation metadata is migrated. */
const NAME_FIELDS=['officialTaskName','subTaskName','actionSummary','formAction','nameSource','nameVerificationStatus','nameSourcePage','verifiedRelatedForms','nameReviewNote'];
MASTER_FIELDS.push(...NAME_FIELDS.filter(k=>!MASTER_FIELDS.includes(k)));
const legacyNameMap=new Map(legacyOfficialMasters().map(m=>[m.taskCode,m]));
function reviewFor(m){return m?NAME_REVIEW[m.taskCode]:null}
function masterDisplay(m){
  const base=legacyNameMap.get(m.taskCode), review=reviewFor(m);
  const custom=base&&m.taskName!==base.taskName;
  const official=m.officialTaskName??review?.officialTaskName??'';
  return {title:custom?m.taskName:official||m.subTaskName||m.taskName,
    action:custom?'세부업무: '+m.taskName:m.actionSummary??review?.actionSummary??'',
    sub:m.subTaskName||m.taskName,official,
    status:m.nameVerificationStatus||review?.nameVerificationStatus||'needs_review',
    forms:base&&m.relatedForms!==base.relatedForms?m.relatedForms:(m.verifiedRelatedForms??review?.verifiedRelatedForms??m.relatedForms??''),
    formAction:m.formAction??review?.formAction??'확인·활용',
    source:m.nameSource??review?.nameSource??m.sourceName??''};
}
function taskDisplay(t){
  // Personal and directly registered official-document tasks have no master link.
  const m=(app.data?.taskMaster||[]).find(m=>m.taskCode===t.masterCode);
  if(!m)return {title:t.name||'',action:'',sub:'',official:'',status:'',forms:t.forms||''};
  const d=masterDisplay(m),base=legacyNameMap.get(m.taskCode);
  // A changed title is retained, including titles edited before userModified existed.
  const known=[base?.taskName,m.taskName,m.subTaskName,m.officialTaskName].filter(Boolean);
  const generated=known.some(name=>t.name===name||String(t.name).startsWith(name+' (')||String(t.name).startsWith(name+' ·'));
  if(!generated&&t.name){d.title=t.name;d.action=d.official?'업무원장: '+d.official:d.action;}
  return d;
}
function taskSearchText(t){const m=(app.data?.taskMaster||[]).find(m=>m.taskCode===t.masterCode),d=taskDisplay(t);return [t.name,t.category,t.description,d.title,d.action,d.sub,d.forms,m?.officialTaskName,m?.relatedForms,m?.taskCode].filter(Boolean).join(' ')}
function taskActionHtml(t){const d=taskDisplay(t);return d.action?`<small class="task-action-summary" title="${escapeHtml(d.sub+'\n해야 할 일: '+d.action)}">해야 할 일: ${escapeHtml(d.action)}</small>`:''}
function taskFullLabel(t){const d=taskDisplay(t);return d.title+(d.action?'\n세부업무: '+d.sub+'\n해야 할 일: '+d.action:'')}
function migrateNameMetadata(){
  for(const m of app.data.taskMaster||[]){const r=reviewFor(m);if(!r)continue;for(const k of NAME_FIELDS)if(m[k]===undefined)m[k]=r[k];}
  app.data.appSettings.nameReviewVersion='2026-10-20';
}
const migrateBeforeNames=migrateMasterData;
migrateMasterData=function(){const result=migrateBeforeNames();migrateNameMetadata();migrateScheduleLabels();return result};
// Also enrich legacy CSV replacements without changing IDs, taskName or rules.
const saveBeforeNames=app.save;
app.save=async function(){if(this.data)migrateNameMetadata();return saveBeforeNames.call(this)};
const taskFactoryBeforeNames=masterToTask;
masterToTask=function(m,options){const t=taskFactoryBeforeNames(m,options);for(const k of NAME_FIELDS)if(m[k]!==undefined)t[k]=m[k];return t};
const formBeforeNames=masterForm;
masterForm=function(m){return formBeforeNames(m).replace('</form>',NAME_FIELDS.map(k=>inputField(k,({officialTaskName:'공식 업무명 (원문 미확인은 비워둠)',subTaskName:'세부업무명',actionSummary:'캘린더의 간략한 할 일',formAction:'서식 활용 방법',nameSource:'업무명 확인 출처',nameVerificationStatus:'명칭 원문 확인 상태 (confirmed / needs_review)',nameSourcePage:'명칭 근거 페이지',verifiedRelatedForms:'원문 대조 서식명·번호 (기존 연결과 별도)',nameReviewNote:'명칭 검토 비고'})[k],m[k]??reviewFor(m)?.[k]??'')).join('')+'</form>')};
function reviewSection(m){const d=masterDisplay(m);return `<section class="detail-section name-review-detail"><h4>공식 업무명 · 세부업무 · 서식</h4><p><b>${escapeHtml(d.official||'공식 업무명 확인 필요')}</b><br>세부업무: ${escapeHtml(d.sub)}<br>해야 할 일: ${escapeHtml(d.action)}<br>원문 확인: ${d.status==='confirmed'?'확인완료':'확인 필요'}<br>관련 서식: ${escapeHtml(d.forms)}<br>활용: ${escapeHtml(d.formAction)}<br>명칭 근거: ${escapeHtml(d.source)}<br>${escapeHtml(m.nameReviewNote||'')}</p></section>`}
const masterBeforeNames=openMaster;
openMaster=function(code,edit=false){masterBeforeNames(code,edit);const m=app.data.taskMaster.find(m=>m.taskCode===code);if(m&&!edit)document.querySelector('.modal-body')?.insertAdjacentHTML('afterbegin',reviewSection(m))};
// Display only: preserve stored task/master text and checklist behavior.
function taskOverviewHtml(t,m){
  const sub=String(m?.subTaskName||t.subTaskName||'').trim();
  const action=t.workflowAction||(m?(m.actionSummary??reviewFor(m)?.actionSummary??''):(t.actionSummary||''));
  const texts=t.workflowAction?[action]:[action,t.description||''];
  const key=text=>text.replace(/\s+/g,' ').trim();
  const seen=new Set(sub?[key(sub)]:[]),items=[];
  for(const text of texts){
    for(const line of String(text).split(/\r?\n|[•●]\s*/)){
      const item=line.replace(/^\s*(?:[-*·]\s+|\d+[.)]\s+|[①-⑳]\s*)/,'').trim();
      if(item&&!seen.has(key(item))){seen.add(key(item));items.push(item)}
    }
  }
  const savedTitle=m&&t.name!==m.taskName&&![sub,m.officialTaskName].includes(t.name)?t.name:'';
  return '<h4>② 이번에 해야 할 일</h4>'+
    (sub?'<div class="task-overview-sub"><span>세부업무</span><strong>'+escapeHtml(sub)+'</strong></div>':'')+
    (items.length?'<ul class="task-overview-actions">'+items.map(item=>'<li>'+escapeHtml(item)+'</li>').join('')+'</ul>':'')+
    (savedTitle&&!t.workflowAction?'<p class="task-overview-context">저장된 일정 제목: '+escapeHtml(savedTitle)+'</p>':'');
}
function renderTaskOverview(section,t,m){
  if(!section)return;
  section.classList.add('task-overview');
  section.innerHTML=taskOverviewHtml(t,m);
}
const LAW_OBLIGATION_WORKBOOK={
  url:'assets/downloads/law-obligation-self-check-2025-h2.xlsx',
  fileName:'2025년 하반기 안전보건 관계법령상 의무이행 자체 점검 및 관리감독자 평가표(평가표).xlsx',
  label:'안전보건 관계법령상 의무이행 자체 점검 및 관리감독자 평가표'
};
function usesLawObligationWorkbook(t,m,d){
  const code=t?.masterCode||t?.taskCode||m?.taskCode||'';
  const text=[t?.name,t?.subTaskName,m?.taskName,m?.subTaskName,d?.official,d?.sub].filter(Boolean).join(' ');
  const isHalfyear=['LAW-001','LAW-002'].includes(code)||m?.recurrenceType==='halfyear'||t?.recurrenceType==='halfyear';
  return isHalfyear&&(['LAW-001','LAW-002'].includes(code)||/안전보건\s*관계\s*법령(?:상)?\s*의무이행.*(?:자체점검|점검|평가)/.test(text));
}
function lawObligationWorkbookHtml(){
  const workbook=LAW_OBLIGATION_WORKBOOK;
  return `<div class="resource-row law-workbook-download"><div class="resource-meta"><strong>첨부 엑셀 서식</strong><span class="ready-label">${escapeHtml(workbook.label)}</span></div><a class="btn primary" data-law-workbook-download href="${workbook.url}" download="${escapeHtml(workbook.fileName)}">엑셀 파일 다운로드</a></div><p class="subtle law-workbook-note">파일을 내려받아 Excel에서 작성한 뒤 안내된 제출 절차에 따라 처리하세요.</p>`;
}
const openTaskBeforeNames=openTask;
openTask=function(id){
  openTaskBeforeNames(id);const t=app.data.tasks.find(t=>t.id===id),m=app.data.taskMaster.find(m=>m.taskCode===(t?.masterCode||t?.taskCode));
  if(!m){const overview=[...document.querySelectorAll('.drawer-body .detail-section')].find(s=>s.querySelector('.num')?.textContent==='1');if(t)renderTaskOverview(overview,t,null);return;}const area=document.querySelector('.drawer-body');if(!area)return;const d=taskDisplay(t);
  area.querySelector('.detail-title').textContent=d.official||d.title;
  area.querySelector('.detail-title').insertAdjacentHTML('beforebegin','<span class="kicker">① 공식 업무명</span>');
  const sections=[...area.querySelectorAll('.detail-section')];
  const recurrence=sections.find(s=>s.querySelector('h4')?.textContent==='반복 회차와 기한 구분');
  const overview=sections.find(s=>s.querySelector('.num')?.textContent==='1');
  const dates=sections.find(s=>s.querySelector('.num')?.textContent==='2');
  const procedure=sections.find(s=>s.querySelector('.num')?.textContent==='3');
  const checklist=sections.find(s=>s.querySelector('.num')?.textContent==='4');
  const forms=sections.find(s=>s.querySelector('.num')?.textContent==='5');
  const source=sections.find(s=>s.querySelector('.num')?.textContent==='6');
  if(overview){renderTaskOverview(overview,t,m);area.querySelector('.drawer-summary')?.after(overview)}
  if(procedure)procedure.remove();
  if(checklist){checklist.querySelector('h4').innerHTML='③ 업무 처리 체크리스트';overview?.after(checklist)}
  if(forms){const workbookOnly=usesLawObligationWorkbook(t,m,d);forms.innerHTML=workbookOnly?`<h4>④ 관련 서식</h4>${lawObligationWorkbookHtml()}`:`<h4>④ 관련 서식</h4>${resourceHtml('원문 대조 서식',d.forms,'서식')}<p>${escapeHtml(d.formAction)}</p><p class="subtle">서식 열람·작성만으로 현장점검·보고가 완료 처리되지 않습니다.</p>`+(t.forms&&t.forms!==d.forms?`<details><summary>기존 저장 서식·연결</summary>${resourceHtml('기존 연결',t.forms,'서식')}</details>`:'');checklist?.after(forms)}
  if(source){source.querySelector('h4').innerHTML='⑤ 업무 근거';source.insertAdjacentHTML('beforeend',`<p>명칭 확인 근거: ${escapeHtml(d.source)}<br>명칭 원문: ${d.status==='confirmed'?'확인완료':'확인 필요'} (법령·적용조건 검증과 별도)</p>`);forms?.after(source)}
  const actions=area.querySelector('.detail-actions');if(actions)actions.insertAdjacentHTML('beforebegin','<h4>⑥ 완료 처리</h4>');
  if(dates)source?.after(dates);
  if(recurrence)(dates||source)?.after(recurrence);
};
// Preserve calendar geometry: one clipped event preview; overflow remains in the day panel.
const referenceMonthBeforeNames=referenceMonth;
referenceMonth=function(){return referenceMonthBeforeNames().replace(/(<button[^>]+data-select-day="([^"]+)"[^>]*>)([\s\S]*?)(<\/button>)/g,(all,head,day,body,end)=>{
  const ts=app.data.tasks.filter(t=>taskDate(t)===day||t.dueDate===day);
  if(!ts.length)return all;const t=ts[0],d=taskDisplay(t),m=app.data.taskMaster.find(m=>m.taskCode===t.masterCode),period=m?recurrenceLabel(m):t.type;
  head=head.replace(/ aria-label="[^"]*"/,` aria-label="${escapeHtml(day+' '+ts.map(taskFullLabel).join('\n'))}"`);
  return head+body+`<span class="calendar-task-preview" title="${escapeHtml(ts.map(taskFullLabel).join('\n\n'))}"><strong>[${escapeHtml(period)}] ${escapeHtml(d.title)}</strong><small>${d.action?'해야 할 일: '+escapeHtml(d.action):''}</small></span>`+end;
})};
// Home keeps the existing dots and adds the full two-line text to hover/click details.
const suiteCalendarBeforeNames=suiteHomeCalendar;
suiteHomeCalendar=function(){return suiteCalendarBeforeNames().replace(/(<button[^>]+data-suite-day="([^"]+)"[^>]*>)/g,(head,dayHead,day)=>{
  const text=app.data.tasks.filter(t=>taskDate(t)===day||t.dueDate===day).map(taskFullLabel).join('\n\n');return text?dayHead.replace('>',' title="'+escapeHtml(text)+'">'):head;
}).replace(/(<button[^>]+data-suite-day="([^"]+)"[^>]*>)([\s\S]*?)(<\/button>)/g,(all,head,day,body,end)=>{const t=app.data.tasks.find(t=>taskDate(t)===day||t.dueDate===day);if(!t)return all;const d=taskDisplay(t);return head+body+`<span class="calendar-task-preview"><strong>${escapeHtml(d.title)}</strong><small>${d.action?'해야 할 일: '+escapeHtml(d.action):''}</small></span>`+end})};

/* Scoped schedule extension: long cycles, accident workflows, persistent deletion.
 * Master records, task IDs and completed checklists remain intact.
 */
const CYCLE_DEFS={
 'RSK-001':{short:'위험성평가',months:12,lead:60,offsets:[60,30,14],actions:['평가대상·계획 및 실시방법(자체·위탁) 확인','실시기관 및 평가일정 확인','근로자 참여 및 기초자료 준비'],main:'근로자 참여 위험성평가 실시',after:'평가 결과 확인 및 개선조치·공유',law:'산업안전보건법 시행규칙 제37조제2항: 매년 1회 이상',url:'https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0037&lsiSeq=288431&urlMode=lsScJoRltInfoR'},
 'MSK-001':{short:'근골격계조사',months:36,lead:90,offsets:[90,60,30],actions:['조사대상 및 실시방법(자체·위탁) 확인','실시기관 선정 및 조사일정 협의','조사자료 및 근로자 참여 준비'],main:'근골격계부담작업 유해요인조사 실시',after:'조사 결과 확인 및 개선조치·필요한 교육',law:'산업안전보건기준에 관한 규칙 제657조: 적용대상 3년 주기, 최초·수시조사 별도',url:'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1030668407'}
};
function scheduleState(){const s=app.data.appSettings??={};s.longCycles??={};s.deletedTasks??={};s.disabledRules??={};s.suppressed??=[];for(const [code,def] of Object.entries(CYCLE_DEFS))if(!s.longCycles[code]){
 const m=app.data.taskMaster.find(m=>m.taskCode===code),last=app.data.tasks.filter(t=>t.masterCode===code&&!t.sourceEventId&&t.completedByUser&&validDay(t.regularPerformedOn||t.actualDate)).sort((a,b)=>(b.regularPerformedOn||b.actualDate).localeCompare(a.regularPerformedOn||a.actualDate))[0];
 const lastDate=last?.regularPerformedOn||last?.actualDate||'';s.longCycles[code]={applicability:m?.applicability||'unknown',lastDate,targetDate:lastDate?shiftMonths(lastDate,def.months):'',leadDays:def.lead,method:'자체·위탁 확인 필요',result:'',history:[],updatedAt:'',basisConfirmed:false};
 }return s}
function repeatRuleKey(t){return (t.masterCode||'')+'|'+(t.targetId||app.data.taskMaster.find(m=>m.taskCode===t.masterCode)?.targetId||'school-default')}
function deletionKey(t){return t.workflowKey||t.occurrenceKey||t.id}
function isSuppressed(t){const s=scheduleState();return !!s.deletedTasks[t.id]||Object.values(s.deletedTasks).some(x=>x.key===deletionKey(t))||s.suppressed.includes(deletionKey(t))||s.suppressed.includes(t.occurrenceKey)||!!s.disabledRules[repeatRuleKey(t)]&&t.type==='정기'&&!t.completedByUser}
function purgeDeletedSchedules(){const gone=new Set(app.data.tasks.filter(isSuppressed).map(t=>t.id));if(!gone.size)return;app.data.tasks=app.data.tasks.filter(t=>!gone.has(t.id));app.data.taskChecklist=app.data.taskChecklist.filter(c=>!gone.has(c.taskId))}
function isLongRegular(t){return !!CYCLE_DEFS[t.masterCode]&&!t.sourceEventId&&(t.type==='정기'||t.workflowKind==='long')}
function visibleSchedule(t,today=localToday()){
 if(isSuppressed(t)||t.workflowInactive)return false;
 if(t.waitForStage&&!app.data.tasks.some(x=>x.sourceEventId===t.sourceEventId&&x.workflowPhase===t.waitForStage&&x.completedByUser))return false;
 if(!isLongRegular(t))return true;
 if(t.completedByUser)return false;
 const c=scheduleState().longCycles[t.masterCode],d=CYCLE_DEFS[t.masterCode];
 return c.applicability==='yes'&&(t.workflowPhase==='after'||validDay(c.targetDate)&&today>=addDays(cycleReadyDate(t.masterCode,c),-Number(c.leadDays||d.lead))&&t.cycleKey===activeCycleKey(t.masterCode,c));
}
function cycleKeyFor(code,date){return code+'|'+(code==='RSK-001'?date.slice(0,4):date)}
function activeCycleKey(code,c){return c.activeCycleKey||cycleKeyFor(code,c.targetDate||'')}
function cycleReadyDate(code,c){let date=c.targetDate;if(code==='MSK-001'&&c.basisConfirmed&&validDay(c.lastDate)){const due=shiftMonths(c.lastDate,36);if(due<date)date=due;}return date}
function withScheduleVisibility(fn,args){const all=app.data.tasks;app.data.tasks=all.filter(t=>visibleSchedule(t));try{return fn(...args)}finally{app.data.tasks=all}}
function workflowTask(masterCode,key,action,date,extra={}){
 const existing=app.data.tasks.find(t=>t.workflowKey===key||t.occurrenceKey===key);
 if(existing)return existing;
 const m=app.data.taskMaster.find(m=>m.taskCode===masterCode);if(!m)return null;
 const stub={id:'workflow-'+key,masterCode,type:extra.type||m.taskType,targetId:m.targetId,workflowKey:key,occurrenceKey:key};
 if(isSuppressed(stub))return null;
 const t=masterToTask(m,{date,sourceEventId:extra.sourceEventId||null,requiresReview:!!extra.requiresReview});
 Object.assign(t,stub,{date,dueDate:'',managementDue:date,originalDate:date,originalDueDate:'',workflowAction:action,workflowSubTask:action,deadlineKind:'management',changes:[],alertDays:'7,3,0,overdue',...extra});
 t.checklist=(extra.checklist||[action,'결과 및 필요한 기록 확인']).map(label=>({id:uuid(),label,done:false,required:true}));
 // Phase checklists use action text; main phases retain the existing ledger checklist.
 if(extra.workflowPhase==='main')t.checklist=(m.checklistItems||[]).map(label=>({id:uuid(),label,done:false,required:true}));
 app.data.tasks.push(t);app.syncChecklist(t);return t;
}
function syncLongCycles(today=localToday()){
 const s=scheduleState();for(const [code,def] of Object.entries(CYCLE_DEFS)){
  const c=s.longCycles[code],m=app.data.taskMaster.find(m=>m.taskCode===code);if(!m||!m.active||c.applicability!=='yes'||!validDay(c.targetDate)||s.disabledRules[code+'|'+(m.targetId||'school-default')])continue;
  const ck=activeCycleKey(code,c),lead=Number(c.leadDays||def.lead);if(today<addDays(cycleReadyDate(code,c),-lead))continue;c.activeCycleKey=ck;
  const dates=[lead,...def.offsets.slice(1)].filter((n,i,a)=>n<=lead&&a.indexOf(n)===i);
  const mainKey='long|'+ck+'|main';let main=app.data.tasks.find(t=>t.workflowKey===mainKey||t.workflowKind==='long'&&t.masterCode===code&&t.cycleKey===ck&&t.workflowPhase==='main');
  if(!main&&!s.suppressed.includes(mainKey)&&!Object.values(s.deletedTasks).some(d=>d.key===mainKey)){main=app.data.tasks.filter(t=>t.masterCode===code&&!t.sourceEventId&&!t.workflowKind&&!t.completedByUser&&String(t.date).slice(0,4)===c.targetDate.slice(0,4)&&!isSuppressed(t)).sort((a,b)=>Math.abs(daysBetween(a.date,c.targetDate))-Math.abs(daysBetween(b.date,c.targetDate)))[0];if(main){Object.assign(main,{workflowKey:mainKey,workflowKind:'long',workflowPhase:'main',cycleKey:ck,workflowAction:def.main});}}
  if(!main)main=workflowTask(code,mainKey,def.main,c.targetDate,{workflowKind:'long',workflowPhase:'main',cycleKey:ck,type:'정기'});
  if(main&&!main.completedByUser&&!main.userModified){main.date=c.targetDate;main.managementDue=c.targetDate;main.workflowInactive=false;main.requiresReview=false;main.deadlineKind='management';main.dueDate='';main.legalDeadline='';
   if(code==='MSK-001'&&c.basisConfirmed&&validDay(c.lastDate)){main.dueDate=shiftMonths(c.lastDate,36);main.deadlineKind='legal';main.legalDeadline=def.law;main.legalVerification='직전 정기 조사일·적용대상 사용자 확인';}
  }
  for(const [i,n] of dates.entries()){const date=addDays(c.targetDate,-n);if(date<=today&&!(main?.completedByUser)&&!app.data.tasks.some(t=>t.workflowKind==='long'&&t.masterCode===code&&t.cycleKey===ck&&t.workflowPhase==='prep'+i))workflowTask(code,'long|'+ck+'|prep'+i,def.actions[Math.min(i,2)]+' ('+c.method+')',date,{workflowKind:'long',workflowPhase:'prep'+i,cycleKey:ck,type:'정기',managementDue:date,checklist:[def.actions[Math.min(i,2)],'결과 및 준비상태 확인']});}
  for(const t of app.data.tasks.filter(t=>t.workflowKind==='long'&&t.masterCode===code&&t.cycleKey===ck&&!t.completedByUser)){
   const pi=/^prep(\d)$/.exec(t.workflowPhase);if(pi&&!t.userModified){const offset=dates[+pi[1]];if(offset===undefined){t.workflowInactive=true;continue;}t.workflowInactive=false;t.date=addDays(c.targetDate,-offset);t.managementDue=t.date;t.workflowAction=def.actions[Math.min(+pi[1],2)]+' ('+c.method+')';}
  }
 }
}
function recordLongCompletion(t,performedOn,result){
 if(!validDay(performedOn)||performedOn>localToday())throw Error('실제 실시일을 오늘 이전의 날짜로 입력하세요.');
 const s=scheduleState(),c=s.longCycles[t.masterCode],def=CYCLE_DEFS[t.masterCode];
 t.regularPerformedOn=performedOn;t.resultSummary=result;t.completedByUser=true;t.completedAt=new Date().toISOString();
 if(!c.history.some(x=>x.taskId===t.id))c.history.push({taskId:t.id,cycleKey:t.cycleKey,date:performedOn,result});
 c.lastDate=performedOn;c.result=result;c.updatedAt=new Date().toISOString();
 const ck=t.cycleKey||cycleKeyFor(t.masterCode,t.date);workflowTask(t.masterCode,'long|'+ck+'|after',def.after,addDays(performedOn,1),{workflowKind:'long',workflowPhase:'after',cycleKey:ck,type:'정기',checklist:['결과 확인','개선조치 이행 확인','공유·교육 및 기록 확인']});
 c.targetDate=shiftMonths(performedOn,def.months);c.activeCycleKey='';c.targetSource='직전 실시일 기준 권장 목표일 (변경 가능)';
 app.history(t.id,'정기 실시 결과 저장 및 다음 주기 관리');
}
function cycleStatus(code){const c=scheduleState().longCycles[code],def=CYCLE_DEFS[code];if(c.applicability==='no')return '해당 없음';if(c.applicability!=='yes'||!validDay(c.targetDate))return '확인 필요';if(scheduleState().disabledRules[code+'|'+(app.data.taskMaster.find(m=>m.taskCode===code)?.targetId||'school-default')])return '반복 중단';if(c.targetDate<localToday())return '목표일 경과';return localToday()>=addDays(c.targetDate,-Number(c.leadDays||def.lead))?'준비·실시 관리 중':'준비 전'}
function longSummaryHtml(){return `<button class="long-cycle-summary" data-long-cycles title="장기주기 업무 · 클릭하여 실시일·진행상태·연간 미리보기 확인"><b>장기주기 업무</b>${Object.entries(CYCLE_DEFS).map(([code,d])=>`<span>${d.short}: ${escapeHtml(scheduleState().longCycles[code].targetDate||'확인 필요')}</span>`).join('')}</button>`}
function showLongCycles(){const s=scheduleState(),year=app.calendarDate.getFullYear();modal('장기주기 업무 · 다음 실시 시기',`<form id="longCycleForm">${Object.entries(CYCLE_DEFS).map(([code,d])=>{const c=s.longCycles[code],m=app.data.taskMaster.find(m=>m.taskCode===code);return `<section class="detail-section"><h3>${escapeHtml(m.officialTaskName||m.taskName)}</h3><p>상태: ${cycleStatus(code)} · 마지막 정기 실시일: ${escapeHtml(c.lastDate||'확인 필요')}<br>${escapeHtml(d.law)} · <a href="${d.url}" target="_blank" rel="noopener">공식 근거</a><br>관련 서식: ${escapeHtml(masterDisplay(m).forms)}</p><div class="form-grid">${selectField(code+'_applicability','적용대상',c.applicability,[['unknown','확인 필요'],['yes','해당'],['no','해당 없음']])}${inputField(code+'_lastDate','확인된 마지막 정기 실시일',c.lastDate,'date')}${inputField(code+'_targetDate','다음 정기 실시 목표일 (법정기한과 별도)',c.targetDate,'date')}${inputField(code+'_leadDays','준비 시작: 목표일 며칠 전',c.leadDays,'number','min="1" max="365" required')}${selectField(code+'_method','실시방법',c.method,['자체·위탁 확인 필요','자체 실시','전문기관 위탁 검토','전문기관 위탁'].map(x=>[x,x]))}${selectField(code+'_basisConfirmed','직전 정기 실시일·적용조건 확인',String(c.basisConfirmed),[['false','확인 필요'],['true','근거 확인함']])}</div><p>저장 결과: ${escapeHtml(c.result||'아직 없음')}<br>준비 시작: ${c.targetDate?addDays(c.targetDate,-Number(c.leadDays)):'확인 필요'} · ${code==='RSK-001'?'연간 실시 기준. 직전 실시일+365일을 법정기한으로 확정하지 않습니다.':'직전 정기 조사일과 적용조건 확인 시 3년 주기 관리.'}<br>준비·위탁 일정은 권장 관리일정이며 위탁은 의무가 아닙니다.</p>${c.history.map(h=>`<p>${escapeHtml(h.date)}: ${escapeHtml(h.result||'결과 확인')}</p>`).join('')}${s.disabledRules[code+'|'+(m.targetId||'school-default')]?`<button type="button" class="btn" data-resume-rule="${code}">명시적으로 반복 관리 재개</button>`:''}</section>`}).join('')}</form><section class="detail-section"><h4>${year}년 연간 업무 미리보기</h4>${Object.entries(CYCLE_DEFS).map(([code,d])=>{const c=s.longCycles[code];return `<p>${d.short}: ${c.targetDate?.startsWith(String(year))?escapeHtml(c.targetDate)+' (목표일) · '+cycleStatus(code):c.targetDate?'해당 연도 예정 없음':'실시 시기 확인 필요'}</p>`}).join('')}<p>날짜를 확인할 수 없는 업무는 임의의 일정을 만들지 않습니다. 최초·수시 업무는 기존 사건 등록으로 별도 관리합니다.</p></section>`,`<button class="btn" data-close>닫기</button><button class="btn primary" data-save-long>저장</button>`,'wide')}
function saveLongForm(){const f=document.getElementById('longCycleForm');if(!f.reportValidity())return false;const v=Object.fromEntries(new FormData(f)),s=scheduleState();
 for(const [code,d] of Object.entries(CYCLE_DEFS)){const c=s.longCycles[code],last=v[code+'_lastDate'],target=v[code+'_targetDate'];if(last&&last>localToday())throw Error('마지막 정기 실시일은 오늘 이후일 수 없습니다.');const next=last&&last!==c.lastDate&&(!target||target===c.targetDate)?shiftMonths(last,d.months):target;if(last&&next&&next<=last)throw Error('다음 목표일은 마지막 실시일 이후로 입력하세요.');if(code==='RSK-001'&&last&&next&&Number(next.slice(0,4))>Number(last.slice(0,4))+1)throw Error('위험성평가는 다음 연도부터 매년 실시하도록 목표 연도를 확인하세요.');}
 for(const [code,d] of Object.entries(CYCLE_DEFS)){
 const c=s.longCycles[code],last=v[code+'_lastDate'],target=v[code+'_targetDate'];if(last&&last>localToday())throw Error('마지막 정기 실시일은 오늘 이후일 수 없습니다.');if(last&&target&&target<=last)throw Error('다음 목표일은 마지막 실시일 이후로 입력하세요.');
 const oldCycle=activeCycleKey(code,c),newTarget=last&&last!==c.lastDate&&(!target||target===c.targetDate)?shiftMonths(last,d.months):target;
 if(code==='RSK-001'&&last&&newTarget&&Number(newTarget.slice(0,4))>Number(last.slice(0,4))+1)throw Error('위험성평가는 다음 연도부터 매년 실시하도록 목표 연도를 확인하세요.');
 Object.assign(c,{applicability:v[code+'_applicability'],lastDate:last,targetDate:newTarget,leadDays:Number(v[code+'_leadDays']),method:v[code+'_method'],basisConfirmed:v[code+'_basisConfirmed']==='true',updatedAt:new Date().toISOString()});
 for(const t of app.data.tasks.filter(t=>t.workflowKind==='long'&&t.masterCode===code&&!t.completedByUser&&t.workflowPhase!=='after')){if(t.cycleKey===oldCycle&&newTarget){c.activeCycleKey=oldCycle;t.workflowInactive=false;}if(!newTarget)t.workflowInactive=true;}
 }syncLongCycles();return true}
function accidentFields(v={}){const yn=[['확인 필요','확인 필요'],['예','예'],['아니오','아니오']],val=k=>v[k]||'확인 필요';return `<div class="form-grid">${inputField('date','사고 발생일',v.date||localToday(),'date','required')}${inputField('accidentType','사고 유형',v.accidentType||v.injury||'','text','required')}${selectField('employment','근로자 소속',val('employment'),['확인 필요','학교 직접고용','수급업체 소속','기타'].map(x=>[x,x]))}${selectField('nature','재해 구분',val('nature'),['확인 필요','사고성 재해','업무상 질병'].map(x=>[x,x]))}<div class="field full"><label>사고 내용 (성명·주민번호 등 개인정보 입력 불필요)</label><textarea name="content" required>${escapeHtml(v.content||'')}</textarea></div></div><details class="accident-extra"><summary>추가 확인정보 (나중에 입력 가능)</summary><div class="form-grid">${selectField('death','사망 여부',val('death'),yn)}${selectField('serious','중대재해 해당 여부',val('serious'),[...yn,['의심','의심']])}${selectField('leave','휴업 필요 여부',val('leave'),yn)}${inputField('leaveDays','휴업 일수 (미확인은 비워두기)',v.leaveDays||'','number','min="0"')}${selectField('reportConfirmed','산업재해조사표 보고대상 확인',val('reportConfirmed'),yn)}${selectField('responsibilityConfirmed','학교의 제출 수행주체 확인',val('responsibilityConfirmed'),yn)}${inputField('reportBaseDate','업무상 질병의 확인된 보고 기준일 (선택)',v.reportBaseDate||'','date')}${selectField('reportBasisConfirmed','질병 기준일·제출기한 근거 확인',val('reportBasisConfirmed'),yn)}${inputField('work','발생 작업·관련 공정',v.work||'')}${inputField('restartDate','작업 재개 예정일',v.restartDate||'','date')}${selectField('riskRequired','수시 위험성평가 적용 확인',val('riskRequired'),yn)}${selectField('muscleRequired','수시 유해요인조사 적용 확인',val('muscleRequired'),yn)}${selectField('muscleException','최근 1년 내 조사·개선조치 예외 확인',val('muscleException'),yn)}${inputField('muscleBaseDate','수시 유해요인조사 사유 발생일',v.muscleBaseDate||'','date')}${selectField('preventionRequired','재발방지·개선조치 적용 확인',val('preventionRequired'),yn)}${selectField('educationRequired','필요 교육 적용 확인',val('educationRequired'),yn)}${inputField('followupTarget','후속조치 내부 목표일 (선택)',v.followupTarget||'','date')}</div></details><div class="notice accident-live" role="status">확인되지 않은 정보는 확인 필요로 저장됩니다. 긴급상황에서는 입력 완료를 기다리지 말고 응급조치·작업중지 및 보고 여부를 즉시 확인하세요.</div>`}
function incidentNumber(event){if(event.incidentNumber)return event.incidentNumber;const base='ACC-'+String(event.date||localToday()).replaceAll('-','')+'-'+event.id.slice(0,8);return app.data.triggerEvents.some(e=>e.id!==event.id&&e.incidentNumber===base)?base+'-'+event.id.slice(8):base}
function incidentPlan(event){const v=event.data||{},date=event.date||v.date,own=v.employment==='학교 직접고용'||v.responsibilityConfirmed==='예',plans=[];
 const add=(stage,code,action,when='',review=false,more={})=>plans.push({stage,code,action,date:when,requiresReview:review,...more});
 add('immediate','ACC-101','응급조치·현장 안전확보 및 필요한 작업중지 확인',date,false,{priority:'긴급',checklist:['응급조치·긴급구호 확인','추가 위험 통제·필요 시 작업중지·대피','현장 안전확보 및 내부 연락']});
 add('assessment','ACC-101','사고 상황·수행주체 및 중대재해·보고대상 판단',date,true,{checklist:['사고 사실·유형 확인','근로자 소속·수행주체 확인','사망·휴업 여부와 일수 확인','보고대상·기준일 확인']});
 const emergency=v.death==='예'||v.serious==='예'||v.serious==='의심';
 if(emergency)add('urgent-report','ACC-104',v.serious==='예'&&own?'중대재해 발생 사실을 관할 노동관서에 지체 없이 보고':'중대재해 긴급보고 대상·수행주체 즉시 확인',date,v.serious!=='예'||!own,{priority:'긴급',deadlineKind:'immediate',legalDeadline:'산업안전보건법 제54조·시행규칙 제67조: 지체 없이 (일수로 환산하지 않음)'});
 let report=v.reportConfirmed==='예',unknown=v.reportConfirmed!=='아니오';
 if(v.reportConfirmed==='확인 필요'||!v.reportConfirmed){report=own&&(v.death==='예'||v.leave==='예'&&v.leaveDays!==''&&v.leaveDays!=null&&Number(v.leaveDays)>=3);}
 const base=v.nature==='사고성 재해'?date:v.reportBasisConfirmed==='예'&&validDay(v.reportBaseDate)?v.reportBaseDate:'';
 const conflict=v.reportConfirmed==='아니오'&&own&&(v.death==='예'||v.leave==='예'&&Number(v.leaveDays)>=3);
 if(report&&!conflict&&own&&validDay(base)){const due=shiftMonths(base,1);add('report','ACC-102','산업재해조사표 작성 및 관할 지방고용노동관서 제출',due,false,{dueDate:due,deadlineKind:'legal',legalDeadline:'산업안전보건법 시행규칙 제73조제1항: 확인된 발생일·보고기준일부터 1개월 이내',legalVerification:'2026-10-20 공식 조문 확인; 개별 입력 조건 기준 산정'});
 }else if(unknown||report||conflict)add('report','ACC-102','산업재해조사표 보고대상·수행주체 및 제출기한 확인',date,true,{deadlineKind:'unconfirmed'});
 if(emergency&&own)add('education-office','ADD-012','중대재해 교육청 긴급보고 여부 확인',date,true,{priority:'긴급',deadlineKind:'immediate'});
 const later=validDay(v.followupTarget)?v.followupTarget:'';
 if(v.preventionRequired==='예'&&own){add('cause','ACC-103','사고 원인 확인 및 재발방지계획 수립',later,false);add('improvement','ADD-013','개선조치 이행 및 결과·후속점검 확인',later,false,{waitFor:'cause'});}
 else if(v.preventionRequired!=='아니오')add('prevention-check','ACC-101','재발방지·개선조치 적용대상 및 후속 목표일 확인','',true);
 if(v.riskRequired==='예'&&own)add('risk','RSK-301','재해 발생 작업의 수시 위험성평가 실시',v.restartDate?addDays(v.restartDate,-1):later,!v.restartDate,{dueDate:v.restartDate||'',deadlineKind:v.restartDate?'legal':'unconfirmed',legalDeadline:'시행규칙 제37조제2항제3호: 관련 작업 시작 전까지. 법정기한의 날짜는 재개일이며 작업 시작 전에 완료. 전일은 내부 준비 목표일',beforeWorkDate:v.restartDate||''});
 else if(v.riskRequired!=='아니오')add('risk-check','ACC-101','수시 위험성평가 적용 여부 및 작업 재개일 확인','',true);
 if(v.muscleRequired==='예'&&own&&v.muscleException!=='예'){const due=validDay(v.muscleBaseDate)?shiftMonths(v.muscleBaseDate,1):'';add('muscle','ADD-023','수시 유해요인조사 대상·방법 검토 및 조사 실시',due||later,!due||v.muscleException!=='아니오',{dueDate:v.muscleException==='아니오'?due:'',deadlineKind:due&&v.muscleException==='아니오'?'legal':'unconfirmed',legalDeadline:'안전보건규칙 제657조제2항: 사유 발생 시 1개월 이내. 최근 1년 내 조사·개선조치 예외 확인 필요'});}
 else if(v.muscleRequired!=='아니오'&&v.muscleException!=='예')add('muscle-check','ACC-101','업무상 근골격계질환 등 수시 조사사유·예외 확인','',true);
 if(v.educationRequired==='예'&&own)add('education','ACC-101','사고 관련 필요한 교육 및 후속점검 실시',later,false,{workflowForms:masterDisplay(app.data.taskMaster.find(m=>m.taskCode==='EDU-001')).forms,workflowFormAction:'필요한 교육 실시 후 교육일지 작성·보존; 교육 종류·시간은 적용조건 별도 확인'});
 else if(v.educationRequired!=='아니오')add('education-check','ACC-101','사고 관련 교육·후속점검 필요 여부 확인','',true);
 return plans;
}
function syncIncident(event){if(!event||event.type!=='accident')return;event.incidentNumber=incidentNumber(event);event.requiredStages=incidentPlan(event).map(p=>p.stage);event.resolvedDeleted??={};
 for(const t of app.data.tasks.filter(t=>t.sourceEventId===event.id&&t.workflowKind==='incident'))if(!event.requiredStages.includes(t.workflowPhase)&&!t.completedByUser){t.workflowInactive=true;t.inactiveReason='사고정보 변경으로 현재 적용대상 아님';}
 for(const p of incidentPlan(event)){
  const key='incident|'+event.id+'|'+p.stage;if(scheduleState().suppressed.includes(key)||Object.values(scheduleState().deletedTasks).some(d=>d.key===key))continue;let t=app.data.tasks.find(t=>t.workflowKey===key);
  // Adopt one legacy accident task per code; never reset IDs/checklists/completion.
  if(!t){t=app.data.tasks.find(t=>t.sourceEventId===event.id&&!t.workflowKind&&(p.stage==='immediate'?!t.masterCode:t.masterCode===p.code));if(t)Object.assign(t,{workflowKind:'incident',workflowKey:key,workflowPhase:p.stage,incidentNumber:event.incidentNumber});}
  if(!t)t=workflowTask(p.code,key,p.action,p.date,{workflowKind:'incident',workflowPhase:p.stage,sourceEventId:event.id,incidentNumber:event.incidentNumber,type:'사건',requiresReview:p.requiresReview,checklist:p.checklist||[p.action,'처리 결과 및 증빙 확인']});
  if(!t)continue;if(t.completedByUser)continue;
  if(t.workflowAction!==p.action&&!t.checklist.some(c=>c.label===p.action)){t.checklist.push({id:uuid(),label:p.action,done:false,required:true});app.syncChecklist(t)}
  Object.assign(t,{workflowInactive:false,workflowAction:p.action,workflowSubTask:p.action,requiresReview:p.requiresReview,priority:p.priority||'높음',deadlineKind:p.deadlineKind||'management',legalDeadline:p.legalDeadline||'',legalVerification:p.legalVerification||'개별 적용조건 확인',dueDate:p.dueDate||'',beforeWorkDate:p.beforeWorkDate||''});
  if(p.workflowForms){t.workflowForms=p.workflowForms;t.workflowFormAction=p.workflowFormAction;}
  if(!t.userModified){t.date=p.date||'';t.managementDue=p.date||'';}
  t.waitForStage=p.waitFor||'';t.awaitingTarget=!t.date;t.source={...t.source,name:'산업안전보건업무 매뉴얼(2025.3.) 및 현행 관련 조문',page:'PDF p.47~50,54,58',article:p.legalDeadline||'적용조건·기한 확인 필요'};
 }
 const required=event.requiredStages.map(stage=>app.data.tasks.find(t=>t.workflowKey==='incident|'+event.id+'|'+stage));
 if(event.closedAt&&required.some((t,i)=>!t?.completedByUser&&!event.resolvedDeleted['incident|'+event.id+'|'+event.requiredStages[i]])){event.closedAt=null;event.reopenedReason='사고정보 변경에 따른 필수 후속조치 재확인';}
}
function incidentTasks(event){return app.data.tasks.filter(t=>t.sourceEventId===event.id&&!isSuppressed(t))}
function showIncidentList(){const events=app.data.triggerEvents.filter(e=>e.type==='accident');modal('산업재해 사건 기록',events.length?events.map(e=>`<p><b>${escapeHtml(incidentNumber(e))}</b> · ${escapeHtml(e.date)} · ${e.closedAt?'종료':'진행/확인 필요'}<br>${escapeHtml(e.data?.content||'내용 확인 필요')} <button class="btn" data-incident="${escapeHtml(e.id)}">사고정보·후속업무</button></p>`).join(''):'<p>등록된 산업재해 사건이 없습니다.</p>','<button class="btn" data-close>닫기</button>','wide')}
function showIncident(id){const e=app.data.triggerEvents.find(e=>e.id===id);if(!e)return;const tasks=incidentTasks(e),deleted=Object.values(scheduleState().deletedTasks).filter(x=>x.sourceEventId===id);modal('사고 상세 · '+incidentNumber(e),`<p>발생일: ${escapeHtml(e.date)} · ${e.closedAt?'종료: '+escapeHtml(e.closedAt):'진행 중'}<br>${escapeHtml(e.data?.content||'내용 확인 필요')}</p><button class="btn" data-edit-incident="${id}">사고정보 추가·수정</button><h4>생성된 후속업무 (${tasks.length}건)</h4>${tasks.map(t=>`<p>${escapeHtml(t.workflowAction||taskDisplay(t).action||t.name)} · ${t.workflowInactive?'현재 비대상 (이력 보존)':statusOf(t)}<br>${t.deadlineKind==='legal'?'법정기한: '+escapeHtml(t.dueDate):t.deadlineKind==='immediate'?'긴급 · 즉시 확인':'내부 목표일: '+escapeHtml(t.date||'확인 필요')} <button class="btn" data-task="${t.id}">업무 열기</button></p>`).join('')}<h4>명시적으로 삭제한 업무</h4>${deleted.map(t=>`<p>${escapeHtml(t.action||t.masterCode||t.id)} · 삭제 유지 ${e.resolvedDeleted?.[t.key]?'(별도 이행 확인)':`<button class="btn" data-resolve-deleted="${escapeHtml(t.key)}" data-incident-id="${id}">별도 이행 확인</button>`}</p>`).join('')||'<p>없음</p>'}<p>사건 종료 전 필수 후속조치 완료를 확인합니다. 삭제한 필수 일정은 별도 이행 확인이 필요합니다.</p>`,`<button class="btn" data-incident-list>사고 목록</button><button class="btn" data-close>닫기</button>${e.closedAt?'':`<button class="btn primary" data-close-incident="${id}">필수조치 확인 후 사건 종료</button>`}`,'wide')}
function incidentCanClose(e){const stages=incidentPlan(e).map(p=>p.stage);return stages.every(stage=>{const key='incident|'+e.id+'|'+stage,t=app.data.tasks.find(t=>t.workflowKey===key);return t&&statusOf(t)==='완료'||e.resolvedDeleted?.[key]})}
function openIncidentForm(event=null){modal(event?'사고정보 추가·수정':'사건등록 · 산업재해',`<form id="eventForm" data-kind="accident" ${event?'data-event-id="'+escapeHtml(event.id)+'"':''}>${accidentFields({...event?.data,date:event?.date})}</form>`,`<button class="btn" data-incident-list>사고 기록</button><button class="btn" data-close>취소</button><button class="btn primary" data-submit-event>${event?'저장하고 후속업무 재판정':'등록하고 업무 생성'}</button>`,'wide')}
function deleteSchedule(id,whole=false){const t=app.data.tasks.find(t=>t.id===id);if(!t)return;const s=scheduleState(),repeat=t.type==='정기'&&!!t.masterCode,rule=repeatRuleKey(t);if(whole&&!repeat)throw Error('일회성 업무에는 반복 전체 삭제를 적용할 수 없습니다.');
 if(whole)s.disabledRules[rule]={at:new Date().toISOString(),masterCode:t.masterCode,targetId:t.targetId||'school-default'};
 const targets=whole?app.data.tasks.filter(x=>x.type==='정기'&&repeatRuleKey(x)===rule&&!x.completedByUser):[t];
 for(const x of targets){const key=deletionKey(x);s.deletedTasks[x.id]={id:x.id,key,occurrenceKey:x.occurrenceKey||'',masterCode:x.masterCode||'',sourceEventId:x.sourceEventId||'',action:x.workflowAction||x.name,at:new Date().toISOString()};if(key&&!s.suppressed.includes(key))s.suppressed.push(key);if(x.occurrenceKey&&!s.suppressed.includes(x.occurrenceKey))s.suppressed.push(x.occurrenceKey);app.history(x.id,whole?'반복 일정 전체 삭제·향후 생성 중단':'이번 일정 삭제');}
 purgeDeletedSchedules();
}
function askDeleteSchedule(id){const t=app.data.tasks.find(t=>t.id===id);if(!t)return;const repeat=t.type==='정기'&&!!t.masterCode;modal('일정삭제 확인',`<p><b>${escapeHtml(taskDisplay(t).title)}</b><br>${escapeHtml(taskDisplay(t).action)}<br>${escapeHtml(t.date||'예정일 확인 필요')}</p>${repeat?'<label class="check-item"><input type="radio" name="deleteScope" value="one" checked>이번 일정만 삭제 (기본)</label><label class="check-item"><input type="radio" name="deleteScope" value="all">해당 반복 일정 전체 삭제 (미완료 회차 제거·향후 생성 중단)</label>':''}${t.masterCode?'<div class="notice">일정을 삭제해도 법령상 이행 의무가 없어지는 것은 아닙니다.</div>':''}<p>원본 업무원장과 사건 기록·다른 후속업무는 유지됩니다.</p>`,`<button class="btn" data-close>취소</button><button class="btn danger" data-confirm-schedule-delete="${id}">삭제 확정</button>`)}
// Schedule engines retain their original master data and recurrence rules.
const ensureBeforeScoped=ensureSchedules;
ensureSchedules=function(...args){if(!app.data)return 0;scheduleState();purgeDeletedSchedules();const masters=app.data.taskMaster;app.data.taskMaster=masters.filter(m=>!CYCLE_DEFS[m.taskCode]&&!scheduleState().disabledRules[m.taskCode+'|'+(m.targetId||'school-default')]);let n;try{n=ensureBeforeScoped(...args)}finally{app.data.taskMaster=masters}const before=app.data.tasks.length;syncLongCycles();for(const e of app.data.triggerEvents.filter(e=>e.type==='accident'&&e.workflowVersion===2))syncIncident(e);const added=app.data.tasks.length-before;purgeDeletedSchedules();return n+added};
const followupsBeforeScoped=ensureFollowups;
ensureFollowups=function(){if(!app.data)return 0;const all=app.data.tasks;app.data.tasks=all.filter(t=>t.workflowKind!=='incident'&&t.workflowKind!=='long');let n;try{n=followupsBeforeScoped()}finally{const added=app.data.tasks.filter(t=>!all.some(x=>x.id===t.id));app.data.tasks=all.concat(added)}purgeDeletedSchedules();return n};
const migrateBeforeScoped=migrateMasterData;
migrateMasterData=function(){const r=migrateBeforeScoped();scheduleState();purgeDeletedSchedules();return r};
const saveBeforeScoped=app.save;
app.save=async function(){if(this.data){scheduleState();purgeDeletedSchedules()}return saveBeforeScoped.call(this)};
const mergeBeforeScoped=mergeBackup;
mergeBackup=function(a,b){const merged=mergeBeforeScoped(a,b),as=a.appSettings||{},bs=b.appSettings||{};merged.appSettings.deletedTasks={...bs.deletedTasks,...as.deletedTasks};merged.appSettings.disabledRules={...bs.disabledRules,...as.disabledRules};merged.appSettings.longCycles={...bs.longCycles,...as.longCycles};for(const [code,incoming] of Object.entries(bs.longCycles||{}))if((incoming.updatedAt||'')>(as.longCycles?.[code]?.updatedAt||''))merged.appSettings.longCycles[code]=incoming;
 const deleted=merged.appSettings.deletedTasks,disabled=merged.appSettings.disabledRules;merged.tasks=merged.tasks.filter(t=>!deleted[t.id]&&!Object.values(deleted).some(d=>d.key===(t.workflowKey||t.occurrenceKey||t.id))&&!(disabled[(t.masterCode||'')+'|'+(t.targetId||merged.taskMaster.find(m=>m.taskCode===t.masterCode)?.targetId||'school-default')]&&t.type==='정기'&&!t.completedByUser));const ids=new Set(merged.tasks.map(t=>t.id));merged.taskChecklist=merged.taskChecklist.filter(x=>ids.has(x.taskId));return merged};
const displayBeforeScoped=taskDisplay;
taskDisplay=function(t){const d=displayBeforeScoped(t);if(t.workflowAction){d.action=t.workflowAction;d.sub=t.workflowSubTask||t.workflowAction;}if(t.workflowForms){d.forms=t.workflowForms;d.formAction=t.workflowFormAction||d.formAction;}return d};
const stateBeforeScoped=statusOf;
statusOf=function(t){if(!t.completedByUser&&t.workflowKind){if(t.requiresReview)return '확인필요';const date=t.dueDate||t.managementDue||t.date;if(date&&date<localToday())return '지연';if(t.priority==='긴급'||date&&date<=addDays(localToday(),7))return '임박';}return stateBeforeScoped(t)};
const filteredBeforeScoped=getFilteredTasks;
getFilteredTasks=function(){return filteredBeforeScoped().filter(t=>visibleSchedule(t))};
const summaryBeforeScoped=summaryTasks;
summaryTasks=function(...args){return summaryBeforeScoped(...args).filter(t=>visibleSchedule(t))};
const noticesBeforeScoped=notifications;
notifications=function(){return noticesBeforeScoped().filter(t=>visibleSchedule(t))};
const rowsBeforeScoped=taskRows;
taskRows=function(list){return rowsBeforeScoped(list.filter(t=>visibleSchedule(t)))};
const dayBeforeScoped=dashDayTasks;
dashDayTasks=function(){return dayBeforeScoped().filter(t=>visibleSchedule(t))};
const monthBeforeScoped=referenceMonth;
referenceMonth=function(...args){let html=withScheduleVisibility(monthBeforeScoped,args);if(app.page==='work')html=html.replace('<section class="panel ref-calendar">','<section class="panel ref-calendar scoped-long-calendar">');return html};
const homeCalendarBeforeScoped=suiteHomeCalendar;
suiteHomeCalendar=function(...args){return withScheduleVisibility(homeCalendarBeforeScoped,args)};
const dayPanelBeforeScoped=referenceDayPanel;
referenceDayPanel=function(...args){return withScheduleVisibility(dayPanelBeforeScoped,args).replace(/(<button class="btn" data-task="([^"]+)">업무 열기<\/button>)/g,(_,button,id)=>`<span class="day-task-actions">${button}<button class="btn" data-schedule-delete="${id}">일정삭제</button></span>`)};
const calendarBeforeScoped=renderCalendar;
renderCalendar=function(...args){return withScheduleVisibility(calendarBeforeScoped,args)};
const eventFormBeforeScoped=openEventForm;
openEventForm=function(kind){if(kind==='accident')return openIncidentForm();return eventFormBeforeScoped(kind)};
const hubBeforeScoped=openSituationHub;
openSituationHub=function(){hubBeforeScoped();document.querySelector('.modal-body')?.insertAdjacentHTML('beforeend',`<button class="btn" data-incident-list>산업재해 사고 기록·후속업무 (${app.data.triggerEvents.filter(e=>e.type==='accident').length}건)</button>`)};
const submitBeforeScoped=submitEvent;
submitEvent=async function(){const form=document.getElementById('eventForm');if(form?.dataset.kind!=='accident')return submitBeforeScoped();if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));if(Number(data.leaveDays)<0)throw Error('휴업 일수는 0 이상이어야 합니다.');let event=app.data.triggerEvents.find(e=>e.id===form.dataset.eventId);if(event){event.data={...event.data,...data};event.date=data.date;event.updatedAt=new Date().toISOString()}else{event={id:uuid(),kind:'산업재해 발생',type:'accident',date:data.date,data,createdAt:new Date().toISOString(),workflowVersion:2};app.data.triggerEvents.unshift(event)}event.workflowVersion=2;syncIncident(event);await app.save();showIncident(event.id);return event};
const openTaskBeforeScoped=openTask;
openTask=function(id){openTaskBeforeScoped(id);const t=app.data.tasks.find(t=>t.id===id);if(!t)return;const area=document.querySelector('.drawer-body');if(t.sourceEventId&&app.data.triggerEvents.some(e=>e.id===t.sourceEventId&&e.type==='accident'))area?.insertAdjacentHTML('afterbegin',`<p>사건번호: ${escapeHtml(t.incidentNumber||incidentNumber(app.data.triggerEvents.find(e=>e.id===t.sourceEventId)))} <button class="btn" data-incident="${t.sourceEventId}">사고정보·후속업무</button></p>`);if(t.workflowAction){const sec=[...area.querySelectorAll('.detail-section')].find(s=>s.querySelector('h4')?.textContent.includes('이번에 해야 할 일'));if(sec)renderTaskOverview(sec,t,app.data.taskMaster.find(m=>m.taskCode===t.masterCode));area?.insertAdjacentHTML('beforeend',`<p>${t.deadlineKind==='legal'?'법정기한: '+escapeHtml(t.dueDate):t.deadlineKind==='immediate'?'긴급 · 즉시 확인':'내부 목표일: '+escapeHtml(t.date||'확인 필요')}<br>${escapeHtml(t.legalDeadline||'관리용 권장일정이며 법정기한이 아닙니다.')}</p>`);}}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 // Capture prevents the legacy delete/complete handlers from performing a second action.
 if(b.matches('[data-delete-task]')){e.preventDefault();e.stopImmediatePropagation();askDeleteSchedule(b.dataset.deleteTask);return;}
 if(b.matches('[data-complete]')){const t=app.data.tasks.find(t=>t.id===b.dataset.complete);if(t?.workflowKind==='long'&&t.workflowPhase==='main'){e.preventDefault();e.stopImmediatePropagation();modal('정기 실시 결과 저장',`<form id="longCompleteForm" class="form-grid" data-task-id="${t.id}">${inputField('performedOn','확인된 실제 정기 실시일',t.date||localToday(),'date','required max="'+localToday()+'"')}<div class="field full"><label>실시 결과·개선사항 요약</label><textarea name="result" required></textarea></div></form><p>서식 작성만으로 완료하지 마세요. 실제 실시 결과를 저장하면 다음 정기 목표일을 제안합니다.</p>`,`<button class="btn" data-close>취소</button><button class="btn primary" data-record-long-complete>결과 저장·완료</button>`);return;}}
},true);
document.addEventListener('input',e=>{if(e.target.closest('#eventForm[data-kind="accident"]')){const f=e.target.closest('form'),v=Object.fromEntries(new FormData(f)),urgent=v.death==='예'||['예','의심'].includes(v.serious);const box=f.querySelector('.accident-live');box.classList.toggle('urgent-incident',urgent);box.textContent=urgent?'긴급: 응급조치·작업중지·대피 및 관할 노동관서·교육청 긴급보고 여부를 지금 확인하세요. 입력 완료를 기다리지 마세요.':'확인되지 않은 정보는 확인 필요로 저장됩니다. 보고기한은 기준일·대상·수행주체 확인 후 산정합니다.';}});
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;try{
 if(b.matches('[data-long-cycles]'))showLongCycles();
 if(b.matches('[data-save-long]')){if(!saveLongForm())return;await app.save();closeOverlay();render()}
 if(b.matches('[data-record-long-complete]')){const f=document.getElementById('longCompleteForm');if(!f.reportValidity())return;const v=Object.fromEntries(new FormData(f)),t=app.data.tasks.find(t=>t.id===f.dataset.taskId);recordLongCompletion(t,v.performedOn,v.result);await app.save();closeOverlay();render()}
 if(b.matches('[data-schedule-delete]'))askDeleteSchedule(b.dataset.scheduleDelete);
 if(b.matches('[data-confirm-schedule-delete]')){deleteSchedule(b.dataset.confirmScheduleDelete,document.querySelector('[name="deleteScope"]:checked')?.value==='all');await app.save();closeOverlay();render();toast('일정을 삭제했습니다. 삭제 상태는 재실행 후에도 유지됩니다.')}
 if(b.matches('[data-resume-rule]')){const code=b.dataset.resumeRule,m=app.data.taskMaster.find(m=>m.taskCode===code);if(confirm('삭제한 개별 회차는 유지하고 향후 반복 관리를 다시 시작할까요?')){delete scheduleState().disabledRules[code+'|'+(m.targetId||'school-default')];await app.save();showLongCycles()}}
 if(b.matches('[data-incident-list]'))showIncidentList();
 if(b.matches('[data-incident]'))showIncident(b.dataset.incident);
 if(b.matches('[data-edit-incident]'))openIncidentForm(app.data.triggerEvents.find(e=>e.id===b.dataset.editIncident));
 if(b.matches('[data-close-incident]')){const incident=app.data.triggerEvents.find(e=>e.id===b.dataset.closeIncident);if(!incidentCanClose(incident)){toast('필수 후속조치 미완료 또는 삭제 업무의 별도 이행 확인이 필요합니다.');return;}incident.closedAt=new Date().toISOString();await app.save();showIncident(incident.id)}
 if(b.matches('[data-resolve-deleted]')&&confirm('이 업무를 별도로 실제 이행했음을 확인합니까?')){const incident=app.data.triggerEvents.find(e=>e.id===b.dataset.incidentId);incident.resolvedDeleted??={};incident.resolvedDeleted[b.dataset.resolveDeleted]=new Date().toISOString();await app.save();showIncident(incident.id)}
 }catch(err){toast(err.message)}});

/* Read-only presentation for unresolved, actionable workflow conditions. */
function confirmationItems(){
 const data=app.data,s=data.appSettings||{},cycles=s.longCycles||{},today=localToday();
 const masters=new Map(data.taskMaster.map(m=>[m.taskCode,m]));
 const hidden=t=>!!s.deletedTasks?.[t.id]||Object.values(s.deletedTasks||{}).some(x=>x.key===(t.workflowKey||t.occurrenceKey||t.id))||(s.suppressed||[]).some(k=>k===(t.workflowKey||t.occurrenceKey||t.id)||k===t.occurrenceKey)||!!s.disabledRules?.[(t.masterCode||'')+'|'+(t.targetId||masters.get(t.masterCode)?.targetId||'school-default')]&&t.type==='정기';
 const done=t=>t.completedByUser||statusOf(t)==='완료';
 const day=dashDayTasks(),late=data.tasks.filter(t=>visibleSchedule(t)&&['지연','임박','마감 임박'].includes(statusOf(t)));
 // Deduplicate only against the center list that is actually displayed.
 const center=app.dashTab==='late'?late:app.dashTab==='all'?day:day.filter(t=>statusOf(t)!=='완료');
 const reserved=new Set(center.map(t=>t.id));
 const urgent=t=>t.priority==='긴급'||t.deadlineKind==='immediate';
 const items=[],seen=new Set();
 const add=item=>{if(!seen.has(item.key)){seen.add(item.key);items.push(item)}};
 for(const [code,c] of Object.entries(cycles)){
  const m=masters.get(code);if(!CYCLE_DEFS[code]||!m?.active||m.applicability==='no'||c.applicability==='no'||s.disabledRules?.[code+'|'+(m.targetId||'school-default')])continue;
  const targetMissing=!validDay(c.targetDate),lastMissing=code==='MSK-001'&&!validDay(c.lastDate),unknown=c.applicability!=='yes';
  if(!targetMissing&&!lastMissing&&!unknown)continue;
  // A configuration check has its own key; another occurrence with the same master code does not resolve it.
  const needs=[];if(unknown)needs.push('적용대상 확인');if(lastMissing)needs.push('직전 조사일 확인');if(targetMissing)needs.push('다음 실시 목표일 설정');
  add({key:'cycle-check|'+code+'|'+(m.targetId||'school-default'),code,title:m.officialTaskName||m.taskName,action:needs.join(' 및 '),status:unknown?'대상 확인 필요':'날짜 확인 필요',kind:unknown?'대상 확인':'기한 확인',rank:unknown?1:2,route:'cycle'});
 }
 for(const t of data.tasks){
  const m=masters.get(t.masterCode);if(done(t)||hidden(t)||t.workflowInactive||m?.applicability==='no'||reserved.has(t.id)||urgent(t))continue;
  let action='',kind='',rank=3;
  const event=data.triggerEvents.find(e=>e.id===t.sourceEventId&&e.type==='accident'&&!e.closedAt);
  if(event&&t.workflowKind==='incident'){
   const v=event.data||{},phase=t.workflowPhase,plan=incidentPlan(event).find(p=>p.stage===phase);
   if(!plan)continue;
   if(phase==='report'&&plan.deadlineKind==='unconfirmed'){
    const needs=[];
    if(v.employment!=='학교 직접고용'&&v.responsibilityConfirmed!=='예')needs.push('제출 수행주체 확인');
    if(v.leave==='확인 필요'||!v.leave||v.leave==='예'&&(v.leaveDays===''||v.leaveDays==null))needs.push('휴업 여부·일수 확인');
    if(v.reportConfirmed!=='예')needs.push('조사표 제출대상 판단');
    if(v.nature!=='사고성 재해'&&(!validDay(v.reportBaseDate)||v.reportBasisConfirmed!=='예'))needs.push('보고 기준일 확인');
    action=needs.join(' 및 ')||'보고대상·기준일의 상충 정보 확인';kind=needs.some(x=>x.includes('대상')||x.includes('주체'))?'대상 확인':'기한 확인';rank=0;
   }else if(phase.endsWith('-check')){action=plan.action;kind='대상 확인';rank=1;}
   else if(phase==='risk'&&!validDay(v.restartDate)){action='작업 재개일 확인 및 수시 평가 일정 설정';kind='기한 확인';rank=2;}
   else if(phase==='muscle'&&(!validDay(v.muscleBaseDate)||v.muscleException!=='아니오')){action=!validDay(v.muscleBaseDate)?'조사사유 발생일 및 적용 예외 확인':'최근 조사·개선조치에 따른 적용 예외 확인';kind=!validDay(v.muscleBaseDate)?'기한 확인':'대상 확인';rank=2;}
   else if(['cause','improvement','education'].includes(phase)&&!validDay(t.date)&&!validDay(t.dueDate)){
    action=plan.action+(t.waitForStage&&!data.tasks.some(x=>x.sourceEventId===event.id&&x.workflowPhase===t.waitForStage&&done(x))?' (선행업무 완료 후 진행)':' · 후속 목표일 확인');kind='후속조치 필요';
   }
  }else if(t.workflowKind==='long'&&t.workflowPhase==='after'&&!validDay(t.date)&&!validDay(t.dueDate)){
   const c=cycles[t.masterCode];if(c?.applicability!=='yes')continue;
   const parent=data.tasks.find(x=>x.masterCode===t.masterCode&&x.cycleKey===t.cycleKey&&x.workflowPhase==='main'&&done(x));
   if(!parent&&!c.history?.some(h=>h.cycleKey===t.cycleKey))continue;
   action=t.workflowAction||CYCLE_DEFS[t.masterCode]?.after;kind='후속조치 필요';
  }else if(t.predecessorTaskId){
   const parent=data.tasks.find(x=>x.id===t.predecessorTaskId&&done(x));
   if(parent&&(!validDay(t.date)&&!validDay(t.dueDate)||t.deadlineKind==='unconfirmed')){action=t.workflowAction||t.actionSummary||m?.actionSummary||t.description||'후속조치 적용조건과 실제 처리일 확인';kind='후속조치 필요';}
  }
  if(!action)continue;
  // Confirmed dated tasks belong to the existing calendar and day panel.
  if(validDay(t.dueDate)&&t.deadlineKind==='legal'&&kind==='후속조치 필요')continue;
  add({key:t.workflowKey||t.occurrenceKey||t.id,taskId:t.id,code:t.masterCode||'',eventId:event?.id||'',incident:event?incidentNumber(event):'',title:m?.officialTaskName||taskDisplay(t).title||t.name,action,kind,status:kind==='기한 확인'?'날짜 확인 필요':kind==='대상 확인'?'대상 확인 필요':'후속조치 필요',rank,route:'task'});
 }
 return items.sort((a,b)=>a.rank-b.rank||a.code.localeCompare(b.code)||a.key.localeCompare(b.key));
}
function confirmationRows(items){return items.map((item,index)=>`<article class="confirmation-item" data-confirmation-key="${escapeHtml(item.key)}"><strong><span class="confirmation-number" aria-hidden="true">${index+1}.</span><span>${escapeHtml(item.title)}</span></strong><p>${escapeHtml(item.action)}</p>${item.incident?'<small class="confirmation-reference">'+escapeHtml(item.incident)+'</small>':''}<div class="confirmation-actions"><span class="confirmation-state">${escapeHtml(item.status)}</span><button class="btn" ${item.route==='cycle'?'data-long-cycles':'data-task="'+escapeHtml(item.taskId)+'"'}>업무열기</button></div></article>`).join('')}
function confirmationPanelHtml(){const items=confirmationItems();return `<aside class="ref-upcoming confirmation-panel ${items.length?'':'confirmation-empty'}"><div class="confirmation-heading"><h4>확인·조치가 필요한 업무</h4><small aria-label="확인이 필요한 업무 ${items.length}건">${items.length}건</small></div>${items.length?confirmationRows(items.slice(0,4)):'<p class="subtle">현재 확인이 필요한 업무가 없습니다</p>'}${items.length>4?'<button class="confirmation-more" data-confirmation-all>전체 '+items.length+'건 보기 ›</button>':''}</aside>`}
// Refresh only the replaced panel after existing forms/completion handlers save.
const saveBeforeConfirmation=app.save;
app.save=async function(...args){
 const result=await saveBeforeConfirmation.apply(this,args);
 const panel=app.page==='work'&&document.querySelector('.confirmation-panel');
 if(panel){const top=panel.scrollTop;panel.outerHTML=confirmationPanelHtml();document.querySelector('.confirmation-panel').scrollTop=top;}
 return result;
};
const dayPanelBeforeConfirmation=referenceDayPanel;
referenceDayPanel=function(...args){return dayPanelBeforeConfirmation(...args).replace(/<aside class="ref-upcoming">[\s\S]*?<\/aside>/,()=>confirmationPanelHtml())};
document.addEventListener('click',e=>{if(e.target.closest('[data-confirmation-all]')){const items=confirmationItems();modal('확인·조치가 필요한 업무 ('+items.length+'건)','<div class="confirmation-list">'+(confirmationRows(items)||'<p class="subtle">현재 확인이 필요한 업무가 없습니다</p>')+'</div>','<button class="btn" data-close>닫기</button>','wide')}});

/* Requested period status: derive display data without rewriting stored occurrences. */
function periodDayShift(day,n){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function calculatePerformancePeriod(t){
 const m=app.data?.taskMaster.find(m=>m.taskCode===t.masterCode),rule=t.recurrenceType||m?.recurrenceType;
 if(t.type!=='정기'||!['weekly','monthly','quarterly','halfyear','yearly'].includes(rule)||Number(m?.recurrenceInterval||t.recurrenceInterval||1)!==1)return null;
 if(t.workflowKind||t.sourceEventId||t.predecessorTaskId||m?.scheduleMode&&m.scheduleMode!=='period')return null;
 const base=t.periodStart||t.date;if(!validDay(base))return null;
 const y=+base.slice(0,4),month=+base.slice(5,7);let start,end;
 if(rule==='weekly'){const day=new Date(base+'T12:00:00Z').getUTCDay();start=periodDayShift(base,-(day+6)%7);end=periodDayShift(start,6)}
 else{const span={monthly:1,quarterly:3,halfyear:6,yearly:12}[rule],first=Math.floor((month-1)/span)*span+1;start=y+'-'+String(first).padStart(2,'0')+'-01';const d=new Date(start+'T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+span);end=periodDayShift(d.toISOString().slice(0,10),-1)}
 const periodEnd=end;
 // A dated official instruction or a user-set target takes precedence; the stored start is never a deadline.
 const explicit=[t.finalLegalDeadline,t.dueDate,t.userModified?(t.manualTargetDate||t.managementDue||t.date):'',t.explicitDueDate,m?.officialDueDate,m?.explicitDueDate].find(validDay);
 if(explicit)end=explicit;
 else if(m?.applyEnd&&m.applyEnd<end)end=m.applyEnd;
 return {start,end,periodEnd,rule,explicit:!!explicit,source:explicit?(t.deadlineSource||t.source?.name||m?.sourceName||'담당자 지정'):''};
}
let renderMemo=null;
function performancePeriod(t){if(!renderMemo)return calculatePerformancePeriod(t);if(renderMemo.period.has(t))return renderMemo.period.get(t);const p=calculatePerformancePeriod(t);renderMemo.period.set(t,p);return p}
// The first auto-generated occurrence may have been clipped to the first launch day.
// Keep its stored date, but continue showing the weekly representative on Monday.
const taskDateBeforePeriods=taskDate;
taskDate=function(t){const p=performancePeriod(t);return p&&['halfyear','quarterly','yearly'].includes(p.rule)?p.end:p?.rule==='weekly'&&!t.userModified?p.start:taskDateBeforePeriods(t)};
const deadlineBeforePeriods=deadlineOf;
deadlineOf=function(t){return performancePeriod(t)?.end||deadlineBeforePeriods(t)};
const statusBeforePeriods=statusOf;
statusOf=function(t){
 const p=performancePeriod(t);if(!p)return statusBeforePeriods(t);
 if(t.completedByUser)return '완료';
 const today=localToday();if(today>p.end)return '지연';
 if(t.requiresReview)return '확인필요';if(today<p.start)return '예정';
 const left=daysBetween(p.end,today);
 return left<=(p.rule==='weekly'?2:7)?'마감 임박':({weekly:'이번 주 업무',monthly:'이번 달 업무',quarterly:'이번 분기 업무',halfyear:'이번 반기 업무',yearly:'올해 업무'}[p.rule]);
};
const overlapBeforePeriods=overlap;
overlap=function(t,start,end){const p=performancePeriod(t);return p?p.start<=end&&p.end>=start:overlapBeforePeriods(t,start,end)};
const summaryBeforePeriods=summaryTasks;
summaryTasks=function(kind){if(kind!=='soon')return summaryBeforePeriods(kind);return summaryBeforePeriods('all').filter(t=>{const p=performancePeriod(t);return p?statusOf(t)==='마감 임박':statusOf(t)!=='완료'&&deadlineOf(t)>=localToday()&&deadlineOf(t)<=addDays(localToday(),7)})};
function performanceTimingHtml(t){
 if(isDirectSchedule(t))return directDeadlineHtml(t);
 if(t.workflowKind==='incident'&&window.safetyCoreIncident)return escapeHtml(safetyCoreIncident.timing(t));
 const p=performancePeriod(t);if(!p)return approvedFullDate(taskDate(t))+(t.dueDate?'　◷ '+dDay(t.dueDate):'');
 const heading=p.explicit?(t.deadlineKind==='legal'?'확인된 법정기한':'별도 처리기한'):'관리기준일';
 return '<span class="performance-range">점검·수행기간: '+escapeHtml(p.start)+' ~ '+escapeHtml(p.periodEnd)+'</span><span class="performance-remaining"><b>'+heading+' '+escapeHtml(p.end)+'</b> · '+(t.completedByUser?'완료':escapeHtml(dDay(p.end)))+'</span>'+(p.explicit?'<small>출처: '+escapeHtml(p.source)+'</small>':'<small>주기 내 이행을 위한 관리 기준 · 법정 제출기한 아님</small>');
}

(async function init(){try{await storageAdapter.init();app.data=await storageAdapter.load()||freshData();validateBackup(app.data);app.data=normalizeBackup(app.data);if(window.safetyWorkflowBoot)await window.safetyWorkflowBoot;migrateMasterData();ensureSchedules();await app.save();window.safetyReady=true;render();if(window.startupRecovery)toast('저장 데이터 손상으로 직전 정상 저장본을 복구했습니다.')}catch(e){document.getElementById('view').innerHTML=`<div class="notice"><h2>저장 데이터 확인이 필요합니다</h2><p>${escapeHtml(e.message)}</p><button class="btn" data-emergency-import>백업 JSON으로 복구</button></div>`;document.querySelector('[data-emergency-import]').onclick=()=>filePicker('.json','text',async text=>{try{const parsed=JSON.parse(text),data=parsed.data||parsed;validateBackup(data);app.data=normalizeBackup(data);migrateMasterData();ensureSchedules();await app.save();render()}catch(err){toast(err.message)}})}})();

;
/* Runtime: legal.js */
/* 법제처 법령 조회 확장. 기존 업무 및 일정 계산을 변경하지 않는다. 외부 의존성 없음. */
(() => {
 'use strict';
 const API='/api/law';
 const esc=v=>escapeHtml(String(v??''));
 const list=v=>v==null?[]:Array.isArray(v)?v:[v];
 const scalar=v=>v&&typeof v==='object'?String(v['#text']??v['#cdata-section']??v.content??''):String(v??'');
 const canon=v=>String(v??'').replace(/\s+/g,'').normalize('NFC');
 const now=()=>new Date().toISOString();
 let configured=false,connection='서버 연결 상태 확인 중',candidateResults=[],viewerToken=0;
 const refs=m=>(m.legalReferences??=[]);
 function scrub(v){
   if(typeof v==='string')return v.replace(/([?&])OC=[^&#\s"<>]*/gi,'$1').replace(/\?&/g,'?');
   if(Array.isArray(v))return v.map(scrub);
   if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).filter(([k])=>!/^OC$/i.test(k)).map(([k,x])=>[k,scrub(x)]));
   return v;
 }
 function safeLink(url){try{const u=new URL(url,'https://www.law.go.kr');if(u.hostname!=='law.go.kr'&&!u.hostname.endsWith('.law.go.kr'))return '';u.protocol='https:';u.searchParams.delete('OC');return u.href}catch{return ''}}
 function originalLink(r){
   const path=r.kind==='admrul'?'행정규칙':'법령';
   return 'https://www.law.go.kr/'+path+'/'+encodeURIComponent(r.lawName)+(r.article?'/제'+r.article+'조'+(r.branch?'의'+r.branch:''):'');
 }
 function label(r){return r.lawName+(r.article?' 제'+r.article+'조'+(r.branch?'의'+r.branch:''):'')+(r.paragraph?'제'+r.paragraph+'항':'')+(r.item?'제'+r.item+'호':'')+(r.subitem?r.subitem+'목':'')}
 function jo(article,branch=''){if(!/^\d{1,4}$/.test(String(article))||branch&&!/^\d{1,2}$/.test(String(branch)))throw Error('조 번호는 1~9999, 가지번호는 1~99로 입력하세요.');return String(article).padStart(4,'0')+String(branch||0).padStart(2,'0')}
 function parseCitation(text){
   const m=String(text||'').match(/제\s*(\d+)\s*조(?:\s*의\s*(\d+))?(?:\s*제\s*(\d+)\s*항)?(?:\s*제\s*(\d+)\s*호)?(?:\s*([가-힣])\s*목)?/);
   return m?{article:m[1],branch:m[2]||'',paragraph:m[3]||'',item:m[4]||'',subitem:m[5]||''}:{article:'',branch:'',paragraph:'',item:'',subitem:''};
 }
 function derive(m){
   const out=[];let base='';
   // sourceName가 교육청 매뉴얼이면 법령으로 간주하지 않는다. 조문이 명시된 필드만 사용한다.
   let text=m.sourceArticle||'';
   if(!text&&/법령|법률|행정규칙|고시|훈령|예규/.test(m.sourceType||''))text=m.sourceName||'';
   for(const part of text.split(/[;；\n]/)){
     const c=parseCitation(part);let name=part.split(/제\s*\d+\s*조/)[0].replace(/^[\s,·]+|[\s,·]+$/g,'').trim();
     if(/^(시행규칙|시행령)$/.test(name)&&base)name=base+' '+name;
     if(!/법(?:\s*시행령|\s*시행규칙)?$|규칙$|고시$|훈령$|예규$|지침$|규정$/.test(name)||/교육청|매뉴얼|공문|확인 필요/.test(name))continue;
     if(/법$/.test(name))base=name;
     const r={refId:uuid(),kind:/고시$|훈령$|예규$|지침$|규정$/.test(name)?'admrul':'law',lawName:name,lawId:'',serialId:'',...c,sourceUrl:'',promulgationDate:'',effectiveDate:'',lastFetchedAt:'',reviewStatus:'candidate',provenance:'기존 근거: '+part.trim()};
     r.sourceUrl=originalLink(r);if(!out.some(x=>label(x)===label(r)))out.push(r);
   }return out;
 }
 function initialize(){if(!app.data)return;for(const m of app.data.taskMaster)refs(m)}
 function xmlObject(text){
   const d=new DOMParser().parseFromString(text,'application/xml');if(d.querySelector('parsererror'))throw Error('API XML 응답을 해석할 수 없습니다.');
   function convert(el){if(!el.children.length)return el.textContent;const o={};for(const c of el.children){const v=convert(c);if(c.tagName in o)o[c.tagName]=[...list(o[c.tagName]),v];else o[c.tagName]=v}return o}
   return {[d.documentElement.tagName]:convert(d.documentElement)};
 }
 function parseResponse(text){let data;try{data=JSON.parse(text)}catch{if(!/^\s*<\??(?:xml|Law|법령|Adm|행정|Error|error)/.test(text))throw Error('API가 JSON/XML 대신 안내·인증 페이지를 반환했습니다. 인증값과 API 이용 권한을 확인하세요.');data=xmlObject(text)}return data}
 async function request(path,params){
   if(navigator.onLine===false)throw Error('인터넷 연결이 끊겼습니다. 마지막 성공 캐시 또는 국가법령정보센터 링크를 사용하세요.');
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),22000);
   try{
     const res=await fetch(API+'/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({endpoint:path,params}),credentials:'omit',signal:controller.signal,cache:'no-store'});
     const data=await res.json().catch(()=>({}));
     if(!res.ok){if(res.status===503)configured=false;throw Error(data.error||'법제처 API 중계 오류 (HTTP '+res.status+')')}
     configured=true;
     return scrub(data);
   }catch(e){if(e.name==='AbortError')throw Error('요청 시간 초과 (22초). 다시 조회하거나 원문 링크를 이용하세요.');if(e instanceof TypeError)throw Error('로컬 법령 API 서버에 연결하지 못했습니다. 프로그램을 다시 실행해 주세요.');throw e}finally{clearTimeout(timer)}
 }
 async function refreshConnection(){
   try{
     const res=await fetch(API+'/status',{cache:'no-store'}),data=await res.json();
     configured=!!data.configured;
     connection=configured?'서버 인증값 설정됨 · 연결 테스트를 실행해 주세요.':'서버에 법제처 API 인증값이 설정되지 않았습니다.';
   }catch{configured=false;connection='로컬 법령 API 서버 연결을 확인해 주세요.'}
   const status=document.getElementById('law-connection');if(status)status.textContent=connection;
   return configured;
 }
 async function search(name,kind='law'){
   const rows=[];let page=1,total=0;
   do{
     const data=await request('lawSearch',{target:kind,query:name,display:'100',page:String(page)}),root=kind==='admrul'?data.AdmRulSearch:data.LawSearch;
     if(!root)throw Error('검색 API 응답 구조가 올바르지 않습니다. 인증값과 해당 API 이용 권한을 확인하세요.');
     if(root.resultCode!==undefined&&scalar(root.resultCode)!=='00')throw Error('API 검색 오류 ('+scalar(root.resultCode)+'): '+scalar(root.resultMsg)+' · 인증값과 이용 권한을 확인하세요.');
     total=Number(scalar(root.totalCnt)||0);
     for(const x of list(root[kind==='admrul'?'admrul':'law'])){
       const lawName=scalar(x.법령명한글||x.행정규칙명),lawId=scalar(kind==='admrul'?x.행정규칙ID:x.법령ID),serialId=scalar(kind==='admrul'?x.행정규칙일련번호:x.법령일련번호);
       if(!lawName||!(lawId||kind==='admrul'&&serialId))continue;
       rows.push({kind,lawName,lawId,serialId,promulgationDate:scalar(x.공포일자||x.발령일자),effectiveDate:scalar(x.시행일자),lawType:scalar(x.법령구분명||x.행정규칙종류),sourceUrl:originalLink({kind,lawName})});
     }
     page++;
   }while(rows.length<total&&page<=10);
   if(total>rows.length&&page>10)throw Error('검색 결과가 1,000건을 초과합니다. 정확한 법령명으로 범위를 좁혀 주세요.');
   return rows;
 }
 function contentLines(node){
   if(node==null)return [];
   if(Array.isArray(node))return node.flatMap(contentLines);
   if(typeof node!=='object')return [String(node)];
   const out=[];
   // JSON의 객체 키 순서는 조문 순서가 아니다. 각 단계 본문 뒤 하위 항·호·목을 표시한다.
   for(const k of ['조문내용','항내용','호내용','목내용','내용','부칙내용','개정문내용','제개정이유내용'])if(node[k]!=null)out.push(...contentLines(node[k]));
   for(const [k,v] of Object.entries(node)){
     if(!/^(조문내용|항내용|호내용|목내용|내용|조문제목|제목)$/.test(k)&&typeof v==='object')out.push(...contentLines(v));
   }return out;
 }
 function articlesOf(data){const root=data.법령||data.LawService||data;return list(root.조문?.조문단위||root.조문단위)}
 function articleMatches(a,r){return Number(scalar(a.조문번호))===Number(r.article)&&Number(scalar(a.조문가지번호)||0)===Number(r.branch||0)&&!['N','전문'].includes(scalar(a.조문여부))}
 function validateSubarticle(a,r){
   let nodes=[a];
   for(const [prop,num,child] of [['paragraph','항번호','항'],['item','호번호','호'],['subitem','목번호','목']]){
     const found=[];function walk(v){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(walk);return}if(v[num]!==undefined)found.push(v);for(const [k,x] of Object.entries(v))if(typeof x==='object')walk(x)}
     nodes.forEach(walk);if(r[prop]){
       const wanted=String(r[prop]);const selected=found.filter(x=>{
         const value=scalar(x[num]);const n=value.match(/\d+/);return n?Number(n[0])===Number(wanted):value.replace(/[.\s()]/g,'')===wanted||'①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'.indexOf(value.trim())+1===Number(wanted);
       });
       if(!selected.length)throw Error('조문 불일치: 요청한 '+wanted+({paragraph:'항',item:'호',subitem:'목'}[prop])+'을 응답에서 확인하지 못했습니다. 원문 링크에서 확인하세요.');nodes=selected;
     }
   }
 }
 async function body(r,options={}){
   if(!r.lawId&&!(options.historical&&r.serialId)&&!(r.kind==='admrul'&&r.serialId))throw Error('법령 ID가 없습니다. 법령 검색에서 정확한 결과를 선택하세요.');
   const params=r.kind==='admrul'?{target:'admrul',...(r.lawId?{LID:r.lawId}:{ID:r.serialId})}:{target:'eflaw',...(options.historical?{MST:r.serialId,efYd:r.effectiveDate.replaceAll('-','')}:{ID:r.lawId}),...(r.article?{JO:jo(r.article,r.branch)}:{})};
   const data=await request('lawService',params),root=data.법령||data.AdmRulService||data.행정규칙||data.LawService;
   if(!root)throw Error('본문 API 응답 구조를 확인할 수 없습니다. 인증·권한 또는 API 응답을 확인하세요.');
   const meta=root.기본정보||root.행정규칙기본정보||root,receivedName=scalar(meta.법령명_한글||meta.법령명한글||meta.행정규칙명||root.행정규칙명);
   if(!receivedName||canon(receivedName)!==canon(r.lawName))throw Error('본문 응답의 법령명이 선택한 법령과 일치하지 않습니다. 연결을 다시 확인하세요.');
   let nodes;
   if(r.kind==='law'){
     nodes=articlesOf(data);if(r.article){nodes=nodes.filter(a=>articleMatches(a,r));if(!nodes.length)throw Error('조문 불일치: '+label(r)+'을 본문 응답에서 찾을 수 없습니다.');for(const a of nodes)validateSubarticle(a,r)}
   }else{
     nodes=list(root.조문내용||root.조문?.조문단위||root.조문||root.본문||root.JoSection);
     if(r.article){const numbered=nodes.filter(x=>x&&typeof x==='object'&&x.조문번호!==undefined);if(numbered.length){nodes=numbered.filter(x=>articleMatches(x,r));if(!nodes.length)throw Error('행정규칙 조문 불일치. 원문 링크에서 확인하세요.');for(const a of nodes)validateSubarticle(a,r)}else{
       // 행정규칙 JSON은 조별 원문 문자열 배열을 반환할 수 있다. 일치 조를 그대로 표시한다.
       nodes=nodes.filter(x=>{if(typeof x!=='string')return false;const c=parseCitation(x);return /^\s*제\s*\d+\s*조/.test(x)&&c.article===r.article&&c.branch===(r.branch||'')});
       if(!nodes.length)throw Error('행정규칙 조문 불일치. 공식 원문 링크에서 확인하세요.');
       if(r.paragraph||r.item||r.subitem)throw Error('이 행정규칙은 항·호·목이 분리되지 않은 원문입니다. 세부 번호를 비우고 조문 전체를 조회한 뒤 공식 원문과 대조하세요.');
     }}
   }
   const text=nodes.flatMap(contentLines).filter(Boolean).join('\n');if(!text.trim())throw Error('API 응답에 표시 가능한 조문 본문이 없습니다.');
   return {text,supplementaryText:[root.부칙,root.개정문,root.제개정이유].flatMap(contentLines).filter(Boolean).join('\n'),title:nodes.map(a=>scalar(a?.조문제목)).filter(Boolean).join(' · '),effectiveDate:scalar(meta.시행일자||root.시행일자),promulgationDate:scalar(meta.공포일자||meta.발령일자||root.발령일자),fetchedAt:now(),raw:data};
 }
 function status(r){return {candidate:'미검증 후보',fetched:'원문 확인 · 담당자 검토 대기',confirmed:'담당자 근거 검토 완료',changed:'법령 변경 검토 필요',needs_review:'근거 확인 필요'}[r.reviewStatus]||'근거 확인 필요'}
 function section(m){return `<section class="detail-section law-section" data-law-section="${esc(m.taskCode)}"><h4>관련 법령 근거</h4><p class="subtle">기존 지침·매뉴얼 근거와 담당자 메모는 위 업무정보에 보존됩니다. API 원문은 별도 열람창에 표시합니다.</p>${refs(m).length?refs(m).map((r,i)=>`<div class="law-reference"><strong>${esc(label(r))}</strong> <span class="badge review">${esc(status(r))}</span><p class="subtle">${esc(r.kind==='admrul'?'행정규칙':'법령')} · ID ${esc(r.lawId||'미확인')} · 시행일 ${esc(r.effectiveDate||'미확인')} · 마지막 조회 ${esc(r.lastFetchedAt||'없음')}</p><div class="law-actions"><button class="btn" data-law-view="${i}" data-code="${esc(m.taskCode)}">법령 원문 보기</button><button class="btn" data-law-refresh="${i}" data-code="${esc(m.taskCode)}">최신 법령 다시 조회</button><a class="btn" target="_blank" rel="noopener noreferrer" href="${esc(originalLink(r))}">국가법령정보센터에서 보기</a></div></div>`).join(''):'<p>근거 확인 필요 · 연결된 법령이 없습니다.</p>'}<button class="btn" data-law-manage="${esc(m.taskCode)}">법령 연결·후보 검토</button></section>`}
 function connectionArea(){return `<section class="panel law-settings"><h3>법제처 API 연결</h3><div class="law-actions"><button class="btn" data-law-connect>연결 테스트</button></div><p id="law-connection" role="status">${esc(connection)}</p><p class="subtle">인증값은 로컬 서버 환경변수에만 설정합니다. 화면·백업에는 저장하지 않습니다.</p><button class="btn" data-law-bulk>전체 업무 법령 연결 후보 생성</button><p id="law-bulk-status" role="status"></p></section>`}
 function manager(code){
   const m=app.data.taskMaster.find(x=>x.taskCode===code);if(!m)return;candidateResults=[];
   modal('법령 연결 · '+esc(m.taskName),`<div id="law-manager" data-code="${esc(code)}"><p>기존 근거: ${esc(m.sourceName)} · ${esc(m.sourceArticle)} · ${esc(m.sourcePage)}<br>기존 검토상태: ${esc(m.legalVerification)} / ${esc(m.verificationStatus)}</p><div class="notice">후보 생성·검색은 근거 확정이 아닙니다. API 원문을 조회한 뒤 적용 대상·개정 내용·경과규정을 검토하고 ‘근거 검토 완료’를 누르세요. 일정·기한은 자동 변경하지 않습니다.</div><button class="btn" data-law-derive="${esc(code)}">기존 근거에서 후보 생성</button><div class="law-actions"><select id="law-kind" aria-label="법령 종류"><option value="law">법령</option><option value="admrul">행정규칙 (고시·훈령·예규)</option></select><input id="law-query" placeholder="정확한 법령명" aria-label="법령명"><button class="btn" data-law-search="${esc(code)}">법령 검색</button></div><div class="law-actions"><label>조 <input id="law-article" inputmode="numeric" size="4" aria-label="조 번호"></label><label>의 <input id="law-branch" inputmode="numeric" size="3" aria-label="조 가지번호"></label><label>항 <input id="law-paragraph" inputmode="numeric" size="3" aria-label="항 번호"></label><label>호 <input id="law-item" inputmode="numeric" size="3" aria-label="호 번호"></label><label>목 <input id="law-subitem" size="3" aria-label="목"></label></div><p class="subtle">전체 원문은 조 번호를 비워 조회합니다. 조·항·호·목을 입력하면 응답에서 해당 번호를 검증합니다.</p><div id="law-search-results" role="status"></div><h4>연결정보 / 후보</h4>${refs(m).map((r,i)=>`<div class="law-reference"><b>${esc(label(r))}</b> · ${esc(status(r))}<p>${esc(r.provenance||'사용자 선택')}<br>ID ${esc(r.lawId||'미확인')} · 시행일 ${esc(r.effectiveDate||'미확인')}</p><div class="law-actions"><button class="btn" data-law-resolve="${i}" data-code="${esc(code)}">이 법령명으로 검색·조문 확인</button><button class="btn" data-law-view="${i}" data-code="${esc(code)}">원문 보기</button><button class="btn" data-law-approve="${i}" data-code="${esc(code)}" ${r.cache&&r.reviewStatus!=='confirmed'?'':'disabled'}>근거 검토 완료</button><button class="btn" data-law-remove="${i}" data-code="${esc(code)}">연결 삭제</button></div></div>`).join('')||'<p>근거 확인 필요</p>'}</div>`,'<button class="btn" data-close>닫기</button>','wide');
 }
 function viewer(code,index,force=false){
   const m=app.data.taskMaster.find(x=>x.taskCode===code),r=refs(m)[index];if(!r)return;
   const token=++viewerToken;
   modal('법령 원문',`<div id="law-viewer" data-code="${esc(code)}" data-index="${index}"><div class="law-actions"><label for="law-ref-select">관련 법령 선택</label><select id="law-ref-select">${refs(m).map((x,i)=>`<option value="${i}" ${i===index?'selected':''}>${esc(label(x))}</option>`).join('')}</select></div><h3>${esc(label(r))}</h3><div class="law-actions"><button class="btn" data-law-refresh="${index}" data-code="${esc(code)}">최신 법령 다시 조회</button><a class="btn" target="_blank" rel="noopener noreferrer" href="${esc(originalLink(r))}">국가법령정보센터에서 보기</a><button class="btn" data-law-manage="${esc(code)}">법령 연결 관리</button></div><p id="law-view-status" role="status">조회 준비 중</p><div id="law-meta"></div><pre id="law-original" class="law-original" tabindex="0" aria-label="법제처 API 조문 원문"></pre><p class="subtle">출처: 법제처 국가법령정보센터. 조문 전체(관련 항·호·목 포함)를 원문 순서로 표시합니다. 담당자 메모와 별도인 API 수신 본문이며 요약하지 않습니다.</p></div>`,'<button class="btn" data-close>닫기</button>','wide');
   const active=()=>token===viewerToken&&document.getElementById('law-viewer')?.dataset.code===code&&+document.getElementById('law-viewer')?.dataset.index===index;
   const show=(cache,message)=>{if(!active())return;document.getElementById('law-view-status').textContent=message+' · '+status(r);document.getElementById('law-original').textContent=cache.text;document.getElementById('law-meta').textContent=(cache.title?cache.title+' · ':'')+'법령명: '+r.lawName+' · 공포/발령일: '+(cache.promulgationDate||'응답 없음')+' · 시행일: '+(cache.effectiveDate||'응답 없음')+' · 조회일/캐시 기준일: '+cache.fetchedAt};
   if(r.cache&&!force){show(r.cache,'마지막 성공 조회 캐시 (최신 여부는 다시 조회로 확인)');return}
   (async()=>{try{
     if(active())document.getElementById('law-view-status').textContent='법제처 API 조회 중…';
     if(!r.lawId&&!(r.kind==='admrul'&&r.serialId)){
       const rows=await search(r.lawName,r.kind),exact=rows.filter(x=>canon(x.lawName)===canon(r.lawName));
       if(exact.length!==1)throw Error(exact.length?'동일 법령 결과가 여러 개입니다. 법령 연결 관리에서 선택하세요.':'정확히 일치하는 법령을 찾지 못했습니다. 법령 연결 관리에서 검색·선택하세요.');Object.assign(r,exact[0]);
     }
     const cache=await body(r),changed=r.cache&&(r.cache.text!==cache.text||r.cache.effectiveDate!==cache.effectiveDate||r.cache.promulgationDate!==cache.promulgationDate);
     if(changed){r.previousCache=r.cache;r.reviewStatus='changed'}else if(!['confirmed','changed'].includes(r.reviewStatus))r.reviewStatus='fetched';
     r.cache=cache;r.effectiveDate=cache.effectiveDate;r.promulgationDate=cache.promulgationDate;r.lastFetchedAt=cache.fetchedAt;r.sourceUrl=originalLink(r);
     try{await app.save();show(cache,'API 실제 조회 성공'+(changed?' · 법령 변경 검토 필요':''))}catch{show(cache,'API 조회 성공 · 저장 실패: 이 창에서만 열람 가능')}
   }catch(e){if(r.cache)show(r.cache,'조회 실패: '+e.message+' / 마지막 성공 캐시 표시');else if(active())document.getElementById('law-view-status').textContent='조회 실패: '+e.message;}})();
 }
 async function showSearch(code,query,kind,resolveIndex=null){
   const box=document.getElementById('law-search-results');box.textContent='API 검색 중…';
   const rows=await search(query,kind);if(!box.isConnected)return;candidateResults=rows;
   box.innerHTML=rows.length?`<p>실제 검색 결과 ${rows.length}건. 정확한 법령명과 시행일을 확인해 선택하세요.</p>`+rows.map((r,i)=>`<div class="law-reference"><b>${esc(r.lawName)}</b> ${canon(r.lawName)===canon(query)?'<span class="badge done">정확한 명칭 일치</span>':'<span class="badge review">유사 명칭 · 확인 필요</span>'}<p>${esc(r.lawType)} · ID ${esc(r.lawId||'없음')} · 일련번호 ${esc(r.serialId)} · 공포/발령일 ${esc(r.promulgationDate)} · 시행일 ${esc(r.effectiveDate)}</p><button class="btn" data-law-pick="${i}" data-code="${esc(code)}" ${resolveIndex===null?'':'data-resolve="'+resolveIndex+'"'}>이 결과 선택·조문 조회</button></div>`).join(''):'검색 결과 없음. 법령명을 확인하세요.';
 }
 function deriveInto(m){const before=refs(m).length;for(const r of derive(m))if(!refs(m).some(x=>label(x)===label(r)&&x.kind===r.kind))refs(m).push(r);return refs(m).length-before}
 const oldSettings=settingsMaster;settingsMaster=function(){initialize();return connectionArea()+oldSettings()};
 const oldOpenMaster=openMaster;openMaster=function(code,edit=false){oldOpenMaster(code,edit);if(!edit){const m=app.data.taskMaster.find(x=>x.taskCode===code);document.querySelector('.modal-body')?.insertAdjacentHTML('beforeend',section(m))}};
 const oldOpenTask=openTask;openTask=function(id){oldOpenTask(id);const t=app.data.tasks.find(x=>x.id===id),m=app.data.taskMaster.find(x=>x.taskCode===(t?.taskCode||t?.masterCode));if(m){document.querySelector('.drawer-body')?.insertAdjacentHTML('beforeend',`<section class="detail-section"><h4>업무원장 적용조건</h4><p>${esc(m.applicationConditions||m.target||'확인 필요')}</p></section>`+section(m))}};
 const oldMasterForm=masterForm;masterForm=function(m){return oldMasterForm(m).replace('</form>',inputField('sourceUrl','기존 근거 원문 URL',m.sourceUrl)+'</form>')};
 const oldRender=render;render=function(){initialize();return oldRender()};
 const oldNormalize=normalizeBackup;normalizeBackup=function(data){const x=oldNormalize(data);for(const m of x.taskMaster)m.legalReferences??=[];return x};
 const oldValidate=validateBackup;validateBackup=function(data){oldValidate(data);for(const m of data.taskMaster)if(m.legalReferences!==undefined){if(!Array.isArray(m.legalReferences))throw Error('legalReferences는 배열이어야 합니다.');for(const r of m.legalReferences)if(!r||typeof r!=='object'||!['law','admrul'].includes(r.kind)||typeof r.lawName!=='string'||r.cache&&(typeof r.cache.text!=='string'||typeof r.cache.fetchedAt!=='string'))throw Error('법령 연결정보 형식 오류');}};
 const oldMerge=mergeBackup;mergeBackup=function(a,b){const merged=oldMerge(a,b);for(const m of merged.taskMaster){const incoming=b.taskMaster.find(x=>x.taskCode===m.taskCode);for(const r of incoming?.legalReferences||[]){const found=refs(m).find(x=>x.kind===r.kind&&label(x)===label(r));if(!found)refs(m).push(JSON.parse(JSON.stringify(r)));else{for(const [k,v] of Object.entries(r))if(found[k]===undefined||found[k]==='')found[k]=v;if(r.cache&&!found.cache)found.cache=r.cache}}if(!m.sourceUrl&&incoming?.sourceUrl)m.sourceUrl=incoming.sourceUrl}return merged};
 function exportFields(){return [...new Set([...MASTER_FIELDS,...app.data.taskMaster.flatMap(Object.keys),'sourceUrl','legalReferences'])].filter(k=>!/^OC$|^apiKey$|^apiCredential$/i.test(k))}
 exportCSV=function(){const fields=exportFields();const rows=[fields.join(','),...app.data.taskMaster.map(m=>fields.map(k=>csvEscape(k==='checklistItems'?m[k]:typeof m[k]==='object'&&m[k]!==null?JSON.stringify(scrub(m[k])):m[k])).join(','))];download('업무원장_법령포함.csv','\ufeff'+rows.join('\r\n'),'text/csv;charset=utf-8');toast('기존 필드·원문 URL·법령 연결정보를 CSV에 저장했습니다.')};
 importCSVFile=function(){filePicker('.csv','text',text=>{try{
   const rows=parseCSV(text.replace(/^\ufeff/,'')),headers=rows.shift()?.map(x=>x.trim())||[],seen=new Set,items=[];
   for(const [i,row] of rows.entries()){if(!row.some(Boolean))continue;const o=Object.fromEntries(headers.map((h,j)=>[h,row[j]??'']));if(!o.taskCode||!o.taskName||seen.has(o.taskCode))throw Error((i+2)+'행: 업무코드·업무명 누락 또는 중복 코드');seen.add(o.taskCode);
     const prior=app.data.taskMaster.find(x=>x.taskCode===o.taskCode)||{};
     // 구 CSV에 없는 신규/기존 필드를 현재 원장에서 보존한다.
     const m={...prior,...o};m.active=String(m.active).toLowerCase()!=='false';m.checklistItems=typeof m.checklistItems==='string'?m.checklistItems.split('|').filter(Boolean):m.checklistItems||[];
     for(const k of ['dueOffsetDays','recurrenceInterval','weekday','monthDay','nth'])if(k in o&&o[k]!==''){const n=Number(o[k]);if(!Number.isFinite(n))throw Error((i+2)+'행: '+k+' 숫자 오류');m[k]=typeof prior[k]==='number'||(!prior.taskCode&&k==='dueOffsetDays')?n:o[k]}
     for(const k of headers)if((k!=='checklistItems'&&typeof prior[k]==='object'&&prior[k]!==null)||k==='legalReferences'){if(o[k]){try{m[k]=JSON.parse(o[k])}catch{throw Error((i+2)+'행: '+k+' JSON 오류')}}else if(k==='legalReferences')m[k]=prior[k]||[]}
     // 전체 CSV 열 집합 때문에 원래 없던 선택 필드가 빈 문자열로 신설되지 않도록 한다.
     if(prior.taskCode)for(const k of headers)if(o[k]===''&&!(k in prior)&&k!=='legalReferences')delete m[k];
     items.push(m);
   }validateBackup({tasks:[],taskMaster:items});window.pendingCSV=items;
   modal('CSV 가져오기 미리보기',`<p>정상 ${items.length}행 · sourceUrl 및 legalReferences 보존. 기존 업무 일정은 유지됩니다.</p><div class="preview-box">${items.slice(0,88).map(x=>`<p>${esc(x.taskCode)} · ${esc(x.taskName)} · 법령 ${refs(x).length}건</p>`).join('')}</div><label>가져오기 방식 <select id="csvMode"><option value="replace">기존 원장 전체 교체</option><option value="append">기존 원장에 추가 (중복 코드 제외)</option></select></label>`,'<button class="btn" data-close>취소</button><button class="btn primary" data-law-apply-csv>적용</button>','wide');
 }catch(e){toast('CSV 가져오기 중단: '+e.message)}})};
 // 법령 API 인증값은 로컬 서버에서만 읽고 화면에는 전달하지 않는다.
 document.addEventListener('change',e=>{if(e.target.id==='law-ref-select'){const v=document.getElementById('law-viewer');viewer(v.dataset.code,+e.target.value)}});
 document.addEventListener('click',async e=>{
   const b=e.target.closest('button');if(!b||![...b.attributes].some(a=>a.name.startsWith('data-law-')))return;
   b.disabled=true;try{
     const code=b.dataset.code,m=code?app.data.taskMaster.find(x=>x.taskCode===code):null;
     if(b.hasAttribute('data-law-connect')){await refreshConnection();if(!configured)throw Error(connection);connection='연결 테스트 중…';document.getElementById('law-connection').textContent=connection;const rows=await search('산업안전보건법');if(!rows.some(x=>canon(x.lawName)===canon('산업안전보건법')))throw Error('검색 응답은 받았으나 산업안전보건법을 확인하지 못했습니다.');connection='연결 성공 · 산업안전보건법 실제 검색 응답 확인 · '+new Date().toLocaleString('ko-KR');document.getElementById('law-connection').textContent=connection;document.dispatchEvent(new CustomEvent('safety-law-connected'))}
     else if(b.hasAttribute('data-law-bulk')){let added=0;for(const x of app.data.taskMaster)added+=deriveInto(x);await app.save();const connected=app.data.taskMaster.filter(x=>refs(x).length).length;document.getElementById('law-bulk-status').textContent='전체 '+app.data.taskMaster.length+'개 검토 · 신규 후보 '+added+'건 · 후보/연결 보유 '+connected+'개 · 근거 확인 필요 '+(app.data.taskMaster.length-connected)+'개. API 미검증 후보이며 자동 확정하지 않았습니다.'}
     else if(b.hasAttribute('data-law-manage'))manager(b.dataset.lawManage);
     else if(b.hasAttribute('data-law-derive')){deriveInto(app.data.taskMaster.find(x=>x.taskCode===b.dataset.lawDerive));await app.save();manager(b.dataset.lawDerive)}
     else if(b.hasAttribute('data-law-view'))viewer(code,+b.dataset.lawView);
     else if(b.hasAttribute('data-law-refresh'))viewer(code,+b.dataset.lawRefresh,true);
     else if(b.hasAttribute('data-law-search'))await showSearch(b.dataset.lawSearch,document.getElementById('law-query').value.trim(),document.getElementById('law-kind').value);
     else if(b.hasAttribute('data-law-resolve')){const r=refs(m)[+b.dataset.lawResolve];document.getElementById('law-query').value=r.lawName;document.getElementById('law-kind').value=r.kind;for(const k of ['article','branch','paragraph','item','subitem'])document.getElementById('law-'+k).value=r[k]||'';await showSearch(code,r.lawName,r.kind,+b.dataset.lawResolve)}
     else if(b.hasAttribute('data-law-pick')){
       const picked=candidateResults[+b.dataset.lawPick],c={};if(!picked)throw Error('검색 결과가 만료되었습니다. 다시 검색하세요.');for(const k of ['article','branch','paragraph','item','subitem'])c[k]=document.getElementById('law-'+k).value.trim();if(c.article)jo(c.article,c.branch);else if(c.branch||c.paragraph||c.item||c.subitem)throw Error('항·호·목 지정 시 조 번호를 입력하세요.');
       let r={...picked,...c,refId:uuid(),reviewStatus:'candidate',lastFetchedAt:'',provenance:'사용자가 실제 API 검색 결과 선택'};r.sourceUrl=originalLink(r);
       if(b.hasAttribute('data-resolve')){const index=+b.dataset.resolve,old=refs(m)[index];if(canon(old.lawName)===canon(r.lawName)&&label(old)===label(r))r={...old,...r,refId:old.refId};refs(m)[index]=r;await app.save();viewer(code,index,true)}else{const index=refs(m).findIndex(x=>label(x)===label(r)&&x.kind===r.kind);if(index>=0){refs(m)[index]={...refs(m)[index],...r};await app.save();viewer(code,index,true)}else{refs(m).push(r);await app.save();viewer(code,refs(m).length-1,true)}}
     }
     else if(b.hasAttribute('data-law-approve')){const r=refs(m)[+b.dataset.lawApprove];if(!r.cache)throw Error('실제 API 원문을 먼저 조회하세요.');r.reviewStatus='confirmed';r.reviewedAt=now();await app.save();manager(code)}
     else if(b.hasAttribute('data-law-remove')){refs(m).splice(+b.dataset.lawRemove,1);await app.save();manager(code)}
     else if(b.hasAttribute('data-law-apply-csv')){const mode=document.getElementById('csvMode').value;app.data.taskMaster=mode==='replace'?window.pendingCSV:[...app.data.taskMaster,...window.pendingCSV.filter(x=>!app.data.taskMaster.some(y=>y.taskCode===x.taskCode))];await app.save();closeOverlay();render();toast('법령 연결정보를 포함한 CSV를 반영했습니다.')}
   }catch(error){if(b.hasAttribute('data-law-connect')){connection='연결 실패: '+error.message;const el=document.getElementById('law-connection');if(el)el.textContent=connection}else{const box=document.getElementById('law-search-results');if(box)box.textContent=error.message;toast(error.message)}}finally{b.disabled=false}
 });
 initialize();if(window.safetyReady)render();refreshConnection();

 // Deadline integration shares the server transport, parser and original-text validator.
 async function versions(name){
   const all=[];let total=0;
   for(let page=1;page<=20;page++){
     const data=await request('lawSearch',{target:'eflaw',query:name,search:'1',display:'100',page:String(page)});
     const root=data.LawSearch;if(!root)throw Error('시행일 법령 목록 응답 구조 확인 필요');
     total=Number(scalar(root.totalCnt)||0);
     for(const row of list(root.law)){if(canon(scalar(row.법령명한글))!==canon(name))continue;
       const effectiveDate=scalar(row.시행일자).replace(/[^0-9]/g,'');
       if(!/^\d{8}$/.test(effectiveDate))continue;
       all.push({kind:'law',lawName:name,lawId:scalar(row.법령ID),serialId:scalar(row.법령일련번호),effectiveDate,promulgationDate:scalar(row.공포일자),versionClass:scalar(row.현행연혁코드)});
     }
     if(page*100>=total)break;if(page===20)throw Error('연혁 목록이 2,000건을 초과하여 적용본 확정 불가');
   }
   return all;
 }
 async function fetchAt(reference,asOf){
   if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf))throw Error('법령 적용 기준일 확인 필요');
   if(reference.kind==='admrul'){
     const rows=(await search(reference.lawName,'admrul')).filter(x=>canon(x.lawName)===canon(reference.lawName));
     const exact=rows.filter(x=>x.effectiveDate&&x.effectiveDate.replace(/[^0-9]/g,'')<=asOf.replaceAll('-','')).sort((a,b)=>b.effectiveDate.localeCompare(a.effectiveDate));
     if(!exact.length)throw Error('행정규칙 적용 판본 확인 필요');
     const r={...exact[0],...reference},cache=await body(r);
     // Current administrative-rule search alone does not prove historical coverage.
     return {...cache,reference:r,requestedAsOf:asOf,versionCoverage:false,coverageReason:'행정규칙의 사고일 적용 연혁·경과규정은 별도 원문 대조 필요',sourceUrl:originalLink(r)};
   }
   const rows=await versions(reference.lawName),date=asOf.replaceAll('-','');
   const applicable=rows.filter(x=>x.effectiveDate<=date&&x.serialId).sort((a,b)=>b.effectiveDate.localeCompare(a.effectiveDate)||b.promulgationDate.localeCompare(a.promulgationDate));
   if(!applicable.length)throw Error('기준일 이전 시행 법령 판본을 찾지 못했습니다.');
   const first=applicable[0];if(applicable.some(x=>x.effectiveDate===first.effectiveDate&&x.promulgationDate===first.promulgationDate&&x.serialId!==first.serialId))throw Error('동일 시행일의 적용 판본이 여러 개입니다. 판본 확인 필요');
   const r={...first,...reference},cache=await body(r,{historical:true});
   const effective=String(cache.effectiveDate).replace(/[^0-9]/g,'');
   if(effective!==first.effectiveDate)throw Error('요청한 판본의 시행일과 본문 시행일이 다릅니다.');
   const next=rows.filter(x=>x.effectiveDate>first.effectiveDate).sort((a,b)=>a.effectiveDate.localeCompare(b.effectiveDate))[0];
   return {...cache,reference:r,requestedAsOf:asOf,versionCoverage:true,validFrom:first.effectiveDate,validUntil:next?.effectiveDate||'',sourceUrl:'https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq='+encodeURIComponent(r.serialId)+'&efYd='+r.effectiveDate};
 }

 // 로컬 검증 및 장애 진단을 위한 읽기 전용 함수. 인증값은 노출하지 않는다.
 window.safetyLaw={jo,derive,parseCitation,parseResponse,search,body,section,originalLink,scrub,fetchAt,versions,connectionInfo:()=>({configured,online:navigator.onLine!==false})};
})();

;
/* Runtime: deadline-engine.js */
/* Pure calendar arithmetic. No network, credentials, or dependency on task storage. */
(function(root){
 'use strict';
 const iso=d=>d.toISOString().slice(0,10);
 const parse=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))throw Error('날짜 형식 확인 필요');const d=new Date(s+'T12:00:00Z');if(iso(d)!==s)throw Error('존재하지 않는 날짜');return d};
 const shift=(s,n)=>{const d=parse(s);d.setUTCDate(d.getUTCDate()+n);return iso(d)};
 const days=(a,b)=>Math.round((parse(a)-parse(b))/86400000);
 const monthEnd=s=>{const d=parse(s);return iso(new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0,12)))};
 const month=(s,n)=>{const d=parse(s),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+n);d.setUTCDate(Math.min(day,+monthEnd(iso(d)).slice(8)));return iso(d)};
 const fixed=['01-01','03-01','05-05','06-06','08-15','10-03','10-09','12-25'];
 const holiday=(s,c={})=>{const wd=parse(s).getUTCDay();return wd===0||wd===6||fixed.includes(s.slice(5))||(c.dates||[]).includes(s)};
 function roll(s,step,c){for(let n=0;n<370;n++){if(!holiday(s,c))return s;s=shift(s,step)}throw Error('휴일 자료를 확인하세요.');}
 function coverage(from,to,c={}){const years=[];for(let y=+from.slice(0,4);y<=+to.slice(0,4);y++)years.push(String(y));return years.every(y=>c.years?.[y]?.complete&&c.years[y].includesSubstitutes&&c.years[y].sourceUrl&&c.years[y].checkedAt);}
 function calculate(input,calendar={}){
   const r={kind:'conditional',...input},result={rule:r,triggerDate:r.base||'',computedBaseDeadline:'',candidateLegalDeadline:'',finalLegalDeadline:'',managementDue:'',reasons:[],calculation:[]};
   if(r.kind==='none'){result.calculation=['별도 고정 법정기한 없음 · 필요 조치·내부 목표일과 구분'];return result;}
   if(r.kind==='immediate'){result.calculation=['즉시·지체 없이: 일수로 환산하지 않음'];return result;}
   if(r.kind==='conditional'||!r.base){result.reasons.push('적용대상·수행주체·기산점 확인 필요');return result;}
   parse(r.base);
   if(r.kind==='before'){result.computedBaseDeadline=r.base;result.candidateLegalDeadline=r.base;result.managementDue=roll(shift(r.base,-1),-1,calendar);result.calculation=['지정 작업 시작 시각 전 완료 (해당 날짜 말일이 아님)','휴일이라는 이유로 작업 시작 이후로 연장하지 않음'];return result;}
   if(r.kind==='recurrence'){
     const unit=r.unit||'months',count=Number(r.count)||1;
     if(unit==='weeks'){const d=parse(r.base),start=shift(r.base,-(d.getUTCDay()+6)%7);result.periodStart=start;result.periodEnd=shift(start,7*count-1);}
     else{result.periodStart=unit==='years'?r.base.slice(0,4)+'-01-01':r.base.slice(0,7)+'-01';result.periodEnd=shift(month(result.periodStart,(unit==='years'?12:1)*count),-1);}
     result.managementDue=result.periodEnd;result.calculation=['주기 수행기간: 법정 단일 만료일과 구분'];return result;
   }
   const count=Number(r.count);if(!Number.isInteger(count)||count<1||count>36500)throw Error('기간 값 확인 필요');
   const start=r.includeFirst?r.base:shift(r.base,1);let base;
   if(r.kind==='days')base=shift(start,count-1);
   else if(r.kind==='months'||r.kind==='years'){
     const d=parse(start),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+count*(r.kind==='years'?12:1));
     const last=+monthEnd(iso(d)).slice(8);
     // Civil Code 160: absent corresponding day expires at month end, otherwise previous day.
     base=day>last?monthEnd(iso(d)):shift(iso(new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),day,12))),-1);
   }else throw Error('지원하지 않는 기간 유형');
   result.computedBaseDeadline=base;
   result.candidateLegalDeadline=r.holidayExtension===true?roll(base,1,calendar):base;
   result.managementDue=roll(shift(base,-1),-1,calendar);
   result.calculation=[r.includeFirst?'초일 산입':'초일 불산입',r.kind==='months'||r.kind==='years'?'달력상 월·연 단위 계산 (30일·365일 환산 없음)':'일 단위 계산','기본 만료일의 종료 시점',r.holidayExtension===true?'토요일·공휴일이면 다음 비휴일까지 순차 연장':r.holidayExtension===false?'확인된 특별규정: 휴일 연장 미적용':'휴일 연장 적용 여부 확인 필요'];
   if(r.holidayExtension==null)result.reasons.push('행정기본법 제6조·민법 제161조 및 특별규정 적용 검토 필요');
   if(!coverage(r.base,result.candidateLegalDeadline,calendar))result.reasons.push('해당 연도의 법정·대체·임시공휴일 전체 자료 확인 필요');
   return result;
 }
 // Fingerprints identify reviewed versions, not authenticity or cryptographic signatures.
 function fingerprint(v){const text=typeof v==='string'?v:JSON.stringify(v);let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16);}
 const api={parse,iso,shift,days,month,monthEnd,holiday,roll,coverage,calculate,fingerprint};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SafetyDeadline=Object.freeze(api);
})(typeof window!=='undefined'?window:globalThis);

;
/* Runtime: incident-integration.js */
/* Reuses v2's generators, storage, OC transport, deletion and long-cycle records. */
(()=>{
 'use strict';
 const D=SafetyDeadline,esc=v=>escapeHtml(String(v??'')),stamp=()=>new Date().toISOString();
 const ref=(lawName,article='',kind='law')=>({lawName,article:String(article),kind});
 const COMMON=[ref('행정기본법',6),...[157,159,160,161].map(n=>ref('민법',n)),ref('관공서의 공휴일에 관한 규정')];
 const REGISTRY={
   report:{kind:'months',count:1,label:'발생일·확인된 보고기준일부터 1개월 이내',refs:[ref('산업안전보건법',57),ref('산업안전보건법 시행규칙',73)],check:['산업재해','1개월','산업재해조사표','지방고용노동관서']},
   muscle:{kind:'months',count:1,label:'법정 수시조사 사유 발생일부터 1개월 이내',refs:[ref('산업안전보건기준에 관한 규칙',657)],check:['유해요인','1개월','조사']},
   risk:{kind:'before',label:'관련 작업 시작·재개 전 완료',refs:[ref('사업장 위험성평가에 관한 지침',15,'admrul')],check:['수시','작업']},
   'urgent-report':{kind:'immediate',label:'중대재해 발생 사실을 지체 없이 보고',refs:[ref('산업안전보건법',54),ref('산업안전보건법 시행규칙',67)],check:['보고','지체 없이']}
 };
 const knownRefs=[...Object.values(REGISTRY).flatMap(r=>r.refs),...COMMON];
 const refKey=r=>r.kind+'|'+r.lawName+'|'+r.article+'|'+(r.branch||'');
 const refLink=r=>safetyLaw.originalLink(r);
 function settings(){const s=scheduleState();s.deadlineEvidence??={};s.deadlineHolidays??={years:{}};s.scheduleRestores??={};return s;}
 function calendar(){const years=settings().deadlineHolidays.years||{};return {years,dates:[...new Set(Object.values(years).flatMap(x=>x.dates||[]))]};}
 function evidenceFresh(x){return !!x?.fetchedAt&&Date.now()-Date.parse(x.fetchedAt)<7*86400000&&Date.parse(x.fetchedAt)<=Date.now()+60000;}
 const signature=e=>D.fingerprint({date:e.date,data:e.data});
 const isIncident=t=>t?.workflowKind==='incident';
 function getOrigin(t){
   if(['auto','manual','legacy-unknown'].includes(t.origin))return {origin:t.origin,originType:t.originType||''};
   if(isIncident(t)||t.sourceEventId&&app.data.triggerEvents.some(e=>e.id===t.sourceEventId&&e.type==='accident'))return {origin:'auto',originType:'incident'};
   if(t.occurrenceKey||t.workflowKind==='long')return {origin:'auto',originType:'recurring'};
   if(t.autoGenerated&&t.type==='공문')return {origin:'auto',originType:'official'};
   if(t.sourceEventId&&app.data.officialEvents.some(e=>e.id===t.sourceEventId))return {origin:t.masterCode?'auto':'manual',originType:'official'};
   if(t.sourceEventId&&!t.masterCode&&app.data.personalEvents.some(e=>e.id===t.sourceEventId))return {origin:'manual',originType:'personal'};
   return {origin:'legacy-unknown',originType:''};
 }
 function originLabel(t){const o=getOrigin(t);return o.origin==='manual'?'✎ 직접등록':o.origin==='auto'?({incident:'⚡ 산재자동',recurring:'↻ 반복자동',official:'▣ 공문자동'}[o.originType]||'⚡ 자동생성'):'? 출처 확인';}
 const originMatch=t=>!app.originFilter||app.originFilter==='all'||getOrigin(t).origin===app.originFilter;
 function migrateOrigins(){if(!app.data)return;for(const t of app.data.tasks)if(!t.origin)Object.assign(t,getOrigin(t));}
 const factoryBefore=masterToTask;
 masterToTask=function(m,options={}){const t=factoryBefore(m,options);const event=app.data?.triggerEvents.find(e=>e.id===options.sourceEventId),official=app.data?.officialEvents.some(e=>e.id===options.sourceEventId);return Object.assign(t,{origin:'auto',originType:event?.type==='accident'?'incident':m.taskType==='정기'?'recurring':official||m.taskType==='공문'?'official':'event'});};
 const quickBefore=saveQuick;
 saveQuick=async function(...args){const before=new Set(app.data.tasks.map(t=>t.id));const result=await quickBefore(...args);for(const t of app.data.tasks)if(!before.has(t.id))Object.assign(t,{origin:'manual',originType:t.type==='개인'?'personal':'official'});await app.save();render();return result;};
 function baseFor(e,phase){if(REGISTRY[phase]?.baseFor)return REGISTRY[phase].baseFor(e);const v=e.data||{};return phase==='report'?(v.nature==='사고성 재해'?e.date:v.reportBasisConfirmed==='예'?v.reportBaseDate:''):phase==='muscle'?v.muscleBaseDate:phase==='risk'?v.restartDate:e.date;}
 function conditionIssues(e,phase){
   if(REGISTRY[phase]?.conditions)return REGISTRY[phase].conditions(e);
   const v=e.data||{},issues=[],own=v.employment==='학교 직접고용'||v.responsibilityConfirmed==='예';
   if(!own)issues.push('제출·조치 수행주체 확인 필요');
   if(phase==='report'){
     if(v.reportConfirmed!=='예')issues.push('산업재해조사표 보고대상 명시 확인 필요');
     if(v.nature!=='사고성 재해'&&(v.reportBasisConfirmed!=='예'||!validDay(v.reportBaseDate)))issues.push('업무상 질병 등 기산점과 근거 확인 필요');
     if(v.reportSpecial!=='아니오')issues.push('최초 재해 제출명령 등 특례·예외 검토 필요');
   }
   if(phase==='muscle'){
     if(v.muscleRequired!=='예'||!v.muscleReason||v.muscleReason==='확인 필요')issues.push('제657조제2항 수시조사 사유 확인 필요');
     if(v.muscleReason==='질환 발생·업무상 질병 인정'&&v.muscleException!=='아니오')issues.push('최근 1년 내 조사·개선조치 예외 확인 필요');
   }
   if(phase==='risk'&&(v.riskRequired!=='예'||!validDay(v.restartDate)))issues.push('수시평가 필요 여부·작업 재개 시점 확인 필요');
   if(phase==='urgent-report'&&v.serious!=='예')issues.push('중대재해 해당 여부 확인 필요');
   if(!validDay(baseFor(e,phase)))issues.push('법정 기산점 미확정');
   return issues;
 }
 function compute(e,phase){
   const spec=REGISTRY[phase];if(!spec)return null;
   const base=baseFor(e,phase),profile=e.deadlineReviews?.[phase],bundle=e.legalBundles?.[phase];
   const rule={kind:profile?.periodKind||spec.kind,count:profile?.periodCount||spec.count,base:validDay(base)?base:'',includeFirst:profile?.includeFirst===true,holidayExtension:profile?.holidayExtension};
   const result=D.calculate(rule,calendar()),reasons=[...conditionIssues(e,phase),...result.reasons];
   if(!bundle?.ok)reasons.push(bundle?.error||'공식 API 원문·적용 판본 조회 필요');
   if(bundle&&!evidenceFresh(bundle))reasons.push('공식 조회 캐시가 오래되었거나 최신 조회 실패');
   if(bundle?.sources?.some(s=>!evidenceFresh(s.applied)||!evidenceFresh(s.current)))reasons.push('조항별 원문 캐시의 기준일이 오래되어 재조회 필요');
   if(navigator.onLine===false)reasons.push('오프라인: 마지막 성공 캐시 기준, 최신 검증 미완료');
   if(bundle?.changed&&(!profile?.changeImpactReviewed||profile.bundleFingerprint!==bundle.fingerprint))reasons.push('사고일 적용본·현재 시행본 또는 직전 조회본 변경: 영향 검토 필요');
   if(bundle?.sources?.some(s=>!s.applied.versionCoverage))reasons.push('일부 법령의 사고일 적용 연혁 확인 필요');
   if(!profile||profile.bundleFingerprint!==bundle?.fingerprint||profile.inputSignature!==signature(e)||!profile.exceptionsReviewed||!profile.periodRulesReviewed||!profile.scopeReviewed)reasons.push('적용대상·특례·부칙 및 기간 계산 규칙 검토 필요');
   // Text checks only detect mismatches. They NEVER establish legal applicability by themselves.
   if(bundle?.sources?.length){const text=bundle.sources.filter(s=>spec.refs.some(r=>refKey(r)===refKey(s.ref))).map(s=>s.applied.text).join('\n');if(spec.check.filter(k=>!/[0-9]+개월/.test(k)).some(k=>!text.replace(/\s/g,'').includes(k.replace(/\s/g,'')))||(['days','months','years'].includes(rule.kind)&&!text.replace(/\s/g,'').includes(String(rule.count)+({days:'일',months:'개월',years:'년'}[rule.kind]))))reasons.push('등록 계산규칙과 실제 조문 내용 불일치 가능성');}
   result.reasons=[...new Set(reasons)];
   result.legalVerificationStatus=result.reasons.length?'needs_review':'verified';
   result.finalLegalDeadline=result.legalVerificationStatus==='verified'&&rule.kind!=='immediate'?result.candidateLegalDeadline:'';
   result.legalSource=bundle?.sources?.map(s=>({lawName:s.ref.lawName,article:s.ref.article,url:s.applied.sourceUrl,effectiveDate:s.applied.effectiveDate,fetchedAt:s.applied.fetchedAt}))||spec.refs.map(r=>({...r,url:refLink(r)}));
   result.legalCheckedAt=bundle?.fetchedAt||'';result.legalEffectiveDate=bundle?.sources?.[0]?.applied.effectiveDate||'';
   return result;
 }
 const originalPlan=incidentPlan;
 incidentPlan=function(e){
   const plans=originalPlan(e),v=e.data||{},own=v.employment==='학교 직접고용'||v.responsibilityConfirmed==='예';
   // Non-disease introduction/change cases do not inherit the disease-only one-year exception.
   if(v.muscleRequired==='예'&&own&&['새 작업·설비 도입','작업환경 변경'].includes(v.muscleReason)&&!plans.some(p=>p.stage==='muscle'))plans.push({stage:'muscle',code:'ADD-023',action:'수시 유해요인조사 대상·방법 검토 및 조사 실시',date:'',requiresReview:true});
   for(const p of plans){
     p.obligationType=['immediate','assessment','cause','improvement','education','education-check','prevention-check','education-office'].includes(p.stage)?'내부 관리업무':'조건부 의무';
     if(p.stage==='immediate'){p.deadlineKind='immediate';p.obligationType='긴급 안전조치';}
     if(p.stage==='assessment')p.requiresReview=!own||[v.nature,v.death,v.leave,v.serious,v.reportConfirmed].some(x=>!x||x==='확인 필요');
     const result=compute(e,p.stage);
     if(result){
       p.deadlineResult=result;p.deadlineRule={...result.rule,label:e.deadlineReviews?.[p.stage]?.ruleLabel||REGISTRY[p.stage].label,ruleId:p.stage};
       p.dueDate=result.finalLegalDeadline;p.requiresReview=result.legalVerificationStatus!=='verified';
       p.deadlineKind=REGISTRY[p.stage].kind==='immediate'?'immediate':result.finalLegalDeadline?'legal':'unconfirmed';
       p.date=result.managementDue||(p.stage==='urgent-report'||p.requiresReview?e.date:'');
       p.beforeWorkDate=p.stage==='risk'?baseFor(e,'risk')||'':'';
       p.legalDeadline=REGISTRY[p.stage].label;p.legalVerification=result.legalVerificationStatus==='verified'?'법령기준 자동 검증 완료':'추가 확인 필요';
       p.obligationType='조건부 의무';
     }
     if(p.stage==='education-office'){p.legalDeadline=v.officeDirective||'적용 가능한 교육청 보고 공문·지침 확인 필요';p.date=v.officeTarget||e.date;p.deadlineKind='management';p.requiresReview=!v.officeDirective||!v.officeSourceUrl;}
     if(!p.checklist)p.checklist=(METHODS[p.stage]||['업무 적용대상·수행주체 확인','필요한 조치 실시','처리 결과와 증빙 확인']).slice(0,5);
   }
   if(!plans.some(p=>p.stage==='followup-close'))plans.push({stage:'followup-close',code:'ACC-101',action:'후속점검·필수조치 확인 및 사건 종결 준비',date:v.followupTarget||'',requiresReview:false,deadlineKind:'management',obligationType:'내부 관리업무',checklist:['필수 후속조치 이행 및 증빙 확인','개선조치 현장 확인·재발위험 점검','미이행·삭제 일정의 별도 이행 확인 및 기록']});
   return plans;
 };
 const originalSync=syncIncident;
 syncIncident=function(e){
   if(!e||e.type!=='accident')return;
   const completed=new Map(app.data.tasks.filter(t=>t.sourceEventId===e.id&&t.completedByUser).map(t=>[t.id,JSON.stringify(t)]));
   originalSync(e);
   const plans=new Map(incidentPlan(e).map(p=>[p.stage,p]));
   for(const t of app.data.tasks.filter(t=>isIncident(t)&&t.sourceEventId===e.id)){
     Object.assign(t,{origin:'auto',originType:'incident'});const p=plans.get(t.workflowPhase);if(!p)continue;
     if(t.completedByUser){if(t.deadlineInputSignature&&t.deadlineInputSignature!==signature(e))t.completedRecheck='사고정보 변경: 완료 당시 계산 결과 보존, 적용조건 재확인 필요';continue;}
     t.obligationType=p.obligationType;t.triggerDate=baseFor(e,t.workflowPhase)||e.date;t.deadlineRule=p.deadlineRule||{kind:p.deadlineKind==='immediate'?'immediate':'management'};
     if(p.deadlineResult){const r=p.deadlineResult;for(const k of ['computedBaseDeadline','candidateLegalDeadline','finalLegalDeadline','legalVerificationStatus','legalSource','legalCheckedAt','legalEffectiveDate'])t[k]=r[k];t.deadlineReasons=r.reasons;t.calculation=r.calculation;t.deadlineInputSignature=signature(e);}
     if(t.manualOverride?.finalLegalDeadline){t.finalLegalDeadline=t.manualOverride.finalLegalDeadline;t.dueDate=t.finalLegalDeadline;t.deadlineKind='legal';t.legalVerificationStatus='manual';t.requiresReview=false;t.overrideRecheck=false;const bundle=e.legalBundles?.[t.workflowPhase];if(t.manualOverride.inputSignature!==signature(e)||bundle?.changed&&t.manualOverride.bundleFingerprint!==bundle.fingerprint){t.overrideRecheck=true;t.requiresReview=true;t.legalVerificationStatus='manual-recheck';}}
     else if(p.deadlineResult)t.dueDate=p.deadlineResult.finalLegalDeadline||'';
     if(t.userModified){t.managementDue=t.manualTargetDate??t.date;t.date=t.manualTargetDate??t.date;}
     else t.managementDue=t.date=p.date||'';
     t.source={...t.source,page:'',article:p.deadlineRule?REGISTRY[t.workflowPhase].refs.map(r=>r.lawName+' 제'+r.article+'조').join(' · '):p.legalDeadline||'',url:p.deadlineRule?refLink(REGISTRY[t.workflowPhase].refs[0]):''};
   }
   // Original sync already preserves checklist state and occurrence IDs.
   for(const [id,json] of completed){const t=app.data.tasks.find(x=>x.id===id);if(t){const before=JSON.parse(json);for(const k of ['checklist','completedAt','actualDate','resultSummary','manualOverride','date','dueDate','finalLegalDeadline'])if(k in before)t[k]=before[k];}}
 };
 const visibleBefore=visibleSchedule;
 visibleSchedule=function(t,...args){return isIncident(t)?!isSuppressed(t)&&!t.workflowInactive:visibleBefore(t,...args);};
 const ensureBefore=ensureSchedules;
 ensureSchedules=function(...args){const count=ensureBefore(...args);const before=app.data.tasks.length;for(const e of app.data.triggerEvents.filter(e=>e.type==='accident')){e.workflowVersion=2;syncIncident(e);}migrateOrigins();return count+Math.max(0,app.data.tasks.length-before);};
 const displayBefore=taskDisplay;
 taskDisplay=function(t){const d=displayBefore(t);if(isIncident(t)){d.title=t.userModified?t.name:t.workflowAction||d.title;d.action=t.obligationType||'산업재해 후속조치';}return d;};
 const statusBefore=statusOf;
 statusOf=function(t){if(!isIncident(t))return statusBefore(t);if(t.completedByUser)return '완료';if(t.deadlineKind==='immediate')return '임박';if(t.requiresReview)return '확인필요';const due=t.finalLegalDeadline||t.managementDue||t.date;if(due&&due<localToday())return '지연';return due&&D.days(due,localToday())<=7?'임박':progressOf(t).done?'진행':'예정';};
 const pendingFetch=new Map();
 async function fetchEvidence(r,asOf,force){
   const key=refKey(r)+'|'+asOf,s=settings(),cached=s.deadlineEvidence[key];
   if(!force&&evidenceFresh(cached)&&navigator.onLine!==false)return cached;
   if(pendingFetch.has(key))return pendingFetch.get(key);
   const promise=(async()=>{
     try{const result=await safetyLaw.fetchAt(r,asOf);s.deadlineEvidence[key]=safetyLaw.scrub(result);return result;}
     catch(error){throw Object.assign(Error(error.message),{lastSuccess:cached||null});}
     finally{pendingFetch.delete(key);}
   })();pendingFetch.set(key,promise);return promise;
 }
 async function refreshIncident(id,force=true){
   const e=app.data.triggerEvents.find(e=>e.id===id);if(!e)return;
   const input=signature(e);e.legalBundles??={};let failures=0;
   if(!safetyLaw.connectionInfo().configured){for(const phase of incidentPlan(e).map(p=>p.stage).filter(p=>REGISTRY[p]))e.legalBundles[phase]={...e.legalBundles[phase],ok:false,error:'법제처 API 인증값이 로컬 서버에 설정되지 않았습니다. 설정 후 재조회하세요.',lastAttemptAt:stamp()};syncIncident(e);await app.save();render();return {failures:1};}
   for(const phase of incidentPlan(e).map(p=>p.stage).filter(p=>REGISTRY[p])){
     const spec=REGISTRY[phase],asOf=spec.asOf?spec.asOf(e):baseFor(e,phase);if(!validDay(asOf))continue;
     const refs=[...spec.refs,...(['months','days','years'].includes(spec.kind)?COMMON:[])],old=e.legalBundles[phase];
     const sources=[],issues=[];
     // At most three existing API calls in flight. Request failures retain the last success cache.
     for(let i=0;i<refs.length;i+=3){
       const rows=await Promise.allSettled(refs.slice(i,i+3).map(async r=>({ref:r,applied:await fetchEvidence(r,asOf,force),current:await fetchEvidence(r,localToday(),force)})));
       rows.forEach((row,j)=>{if(row.status==='fulfilled')sources.push(row.value);else issues.push(refs[i+j].lawName+': '+row.reason.message);});
       if(signature(e)!==input){e.legalRefreshNotice='조회 중 사고정보가 변경되어 결과를 확정하지 않았습니다.';return;}
     }
     const fingerprint=D.fingerprint(sources.map(s=>({ref:s.ref,applied:s.applied.text,supplementary:s.applied.supplementaryText,effective:s.applied.effectiveDate,current:s.current.text,currentSupplementary:s.current.supplementaryText,currentEffective:s.current.effectiveDate})));
     const changed=sources.some(s=>D.fingerprint([s.applied.text,s.applied.supplementaryText])!==D.fingerprint([s.current.text,s.current.supplementaryText]))||!!old?.fingerprint&&old.fingerprint!==fingerprint;
     if(issues.length){failures++;e.legalBundles[phase]={...old,ok:false,error:issues.join('\n'),lastAttemptAt:stamp(),sources:old?.sources||sources};}
     else e.legalBundles[phase]={ok:true,fetchedAt:stamp(),sources,fingerprint,changed,asOf};
   }
   syncIncident(e);await app.save();render();
   return {failures};
 }
 function autoRefresh(e){refreshIncident(e.id,false).then(()=>{if(document.querySelector('[data-incident-detail="'+e.id+'"]'))showIncident(e.id)}).catch(error=>{e.legalRefreshNotice=error.message;app.save().catch(()=>{});});}
 const submitBefore=submitEvent;
 submitEvent=async function(...args){const form=document.getElementById('eventForm');if(form?.dataset.kind!=='accident')return submitBefore(...args);const result=await submitBefore(...args);if(result)autoRefresh(result);return result;};
 const fieldsBefore=accidentFields;
 accidentFields=function(v={}){let html=fieldsBefore(v);return html.replace('</details>',`<div class="form-grid incident-extra-fields">${selectField('reportSpecial','제출명령·특례·예외 가능성',v.reportSpecial||'확인 필요',[['확인 필요','확인 필요'],['아니오','해당 없음 확인'],['예','해당 가능성 있음']])}${selectField('muscleReason','수시 유해요인조사 사유',v.muscleReason||'확인 필요',['확인 필요','질환 발생·업무상 질병 인정','새 작업·설비 도입','작업환경 변경'].map(x=>[x,x]))}${inputField('officeDirective','적용 교육청 공문·지침 (선택)',v.officeDirective||'')}${inputField('officeSourceUrl','교육청 공식 원문 URL (선택)',v.officeSourceUrl||'','url')}${inputField('officeTarget','교육청 보고 내부 목표일 (선택)',v.officeTarget||'','date')}</div></details>`);};
 function verificationText(t){return ({verified:'법령기준 자동 검증 완료',manual:'담당자 직접 확정', 'manual-recheck':'담당자 확정값 · 사고정보 변경 재확인',needs_review:t.verificationStatus||'추가 확인 필요'})[t.legalVerificationStatus]||'추가 확인 필요';}
 function sourceList(t){const sources=t.legalSource||[];return sources.map(r=>`<li><a href="${esc(safeOfficialUrl(r.url))}" target="_blank" rel="noopener">${esc(r.lawName)}${r.article?' 제'+esc(r.article)+'조':''}</a> · 시행 ${esc(r.effectiveDate||'미확인')} · 조회 ${esc(r.fetchedAt||'없음')}</li>`).join('');}
 function safeOfficialUrl(value){try{const u=new URL(value);if(u.protocol==='https:'&&(u.hostname==='law.go.kr'||u.hostname.endsWith('.law.go.kr')||u.hostname.endsWith('.go.kr')||u.hostname.endsWith('.sen.go.kr')))return u.href;}catch{}return 'https://www.law.go.kr';}
 function deadlineHtml(t){const rule=t.deadlineRule||{};return `<div class="incident-deadline"><p><b>${esc(verificationText(t))}</b> · ${esc(t.deadlineKind==='immediate'?'즉시':t.finalLegalDeadline?'법정기한':'내부 목표일 · 법정기한 확인 필요')}</p><dl><dt>법령 기준</dt><dd>${esc(rule.label||t.legalDeadline||'내부 업무 관리일정')}</dd><dt>기산점</dt><dd>${esc(t.triggerDate||'확인 필요')}</dd><dt>기본 계산 만료일</dt><dd>${esc(t.computedBaseDeadline||'날짜형 기간 아님·확인 필요')}</dd><dt>최종 법정만료일</dt><dd>${t.deadlineKind==='immediate'?'즉시·지체 없이 (D+N 환산 없음)':esc(t.finalLegalDeadline||'확인 필요')}${rule.kind==='before'?' · 해당 작업 시작 시각 전':''}</dd><dt>내부 처리 목표일</dt><dd>${esc(t.managementDue||t.date||'미정')} ${t.managementDue?'· '+esc(dDay(t.managementDue)):''}</dd></dl>${t.finalLegalDeadline?`<p>법정기한 ${esc(dDay(t.finalLegalDeadline))}${rule.kind==='before'?' · 작업 시작 전 완료':''}</p>`:''}${t.candidateLegalDeadline&&!t.finalLegalDeadline?`<p class="subtle">휴일 규칙별 잠정 계산일: ${esc(t.candidateLegalDeadline)} (최종 확정 아님)</p>`:''}${t.deadlineReasons?.length?`<ul class="incident-issues">${t.deadlineReasons.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul>`:''}${t.overrideRecheck?'<p class="notice">직접 확정 후 사고정보가 변경되었습니다. 확정값의 적용 여부를 다시 확인하세요.</p>':''}${t.completedRecheck?'<p class="notice">'+esc(t.completedRecheck)+'</p>':''}</div>`;}
 function reviewDeadline(id){
   const t=app.data.tasks.find(t=>t.id===id),e=app.data.triggerEvents.find(e=>e.id===t?.sourceEventId);if(!t||!e)return;
   const phase=t.workflowPhase,b=e.legalBundles?.[phase],r=e.deadlineReviews?.[phase]||{};
   modal('기간 계산 규칙·적용조건 검토',`${deadlineHtml(t)}<p>API 원문 조회와 개별 적용 검토가 모두 충족되어야 자동 검증이 완료됩니다. 담당자 검토는 관할 기관 유권해석이 아닙니다.</p><details open><summary>사고일 적용본·현행본 원문과 변경 비교</summary>${(b?.sources||[]).map(s=>`<section class="detail-section"><b>${esc(s.ref.lawName)} ${esc(s.ref.article)}</b><p>적용 시행일 ${esc(s.applied.effectiveDate)} / 현재 시행일 ${esc(s.current.effectiveDate)}</p><pre class="law-original">${esc(s.applied.text)}</pre>${s.applied.supplementaryText?'<h4>수신된 부칙·경과규정</h4><pre class="law-original">'+esc(s.applied.supplementaryText)+'</pre>':'<p>부칙·경과규정은 전체 원문 링크에서도 대조하세요.</p>'}${s.applied.text!==s.current.text?`<h4>현재 시행본 (변경 있음)</h4><pre class="law-original">${esc(s.current.text)}</pre>`:''}</section>`).join('')||'<p>성공한 공식 원문 조회가 없습니다.</p>'}</details><form id="deadlineReview" data-id="${esc(id)}" class="form-grid">${["months","days","years"].includes(REGISTRY[phase]?.kind)?selectField("periodKind","원문에서 확인한 기간 단위",r.periodKind||REGISTRY[phase].kind,[["days","일"],["months","개월"],["years","년"]])+inputField("periodCount","확인한 기간 수",r.periodCount||REGISTRY[phase].count,"number","min=\"1\" max=\"36500\" required")+inputField("ruleLabel","확인한 기한 규정",r.ruleLabel||REGISTRY[phase].label,"text","required"):""}${selectField('includeFirst','초일 산입 규칙',String(!!r.includeFirst),[['false','초일 불산입'],['true','초일 산입 (특별규정·기간 성격 확인)']])}${selectField('holidayExtension','토요일·공휴일 만료 규칙',r.holidayExtension==null?'unknown':String(r.holidayExtension),[['unknown','해석·적용 확인 필요'],['true','민법 제161조 연장 적용 확인'],['false','연장 미적용 특별규정·기간 성격 확인']])}${['scopeReviewed','periodRulesReviewed','exceptionsReviewed'].map((k,i)=>`<label class="check-item field full"><input name="${k}" type="checkbox" required ${r[k]?'checked':''}>${['보고대상·수행주체·기산점을 확인했습니다.','초일·기간말일·휴일 및 특별규정 적용을 원문과 대조했습니다.','사고일 적용본·현행 개정·부칙·경과규정·예외의 영향을 검토했습니다.'][i]}</label>`).join('')}${inputField('reviewer','검토자',r.reviewer||'','text','required')}<div class="field full"><label>적용 판단 근거·특별규정 및 개정 영향 검토</label><textarea name="basis" required>${esc(r.basis||'')}</textarea></div></form>`,`<button class="btn" data-u-refresh="${esc(e.id)}">실제 API 재조회</button><button class="btn" data-u-holidays>공휴일 자료</button><button class="btn primary" data-u-review-save>검토 결과 저장·재계산</button>`,'wide');
 }
 function holidayForm(){
   const y=app.calendarDate.getFullYear(),prior=settings().deadlineHolidays.years[y]||{};
   modal('법정·대체·임시공휴일 자료',`<p>휴일 규정 원문만으로 음력·대체·임시공휴일 전체 일자를 알 수 없습니다. 해당 연도의 공식 월력·공휴일 공표 자료를 대조해 입력하세요. 미확인 자료는 최종 만료일 자동 검증을 막습니다.</p><form id="deadlineHolidayForm" class="form-grid">${inputField('year','적용 연도',y,'number','min="1900" max="2200" required')}${inputField('sourceUrl','공식 공표 자료 URL',prior.sourceUrl||'','url','required')}<div class="field full"><label>공휴일 날짜 (YYYY-MM-DD, 쉼표 또는 줄바꿈; 대체·임시공휴일 포함)</label><textarea name="dates" required>${esc((prior.dates||[]).join('\n'))}</textarea></div><label class="check-item field full"><input name="complete" type="checkbox" required>해당 연도 전체 공휴일·대체공휴일·임시공휴일을 공식 자료와 대조했습니다.</label>${inputField('reviewer','자료 확인자',prior.reviewer||'','text','required')}</form><p class="subtle">기존 확인 연도: ${esc(Object.keys(settings().deadlineHolidays.years).join(', ')||'없음')} · 공휴일 지정 변경 시 다시 입력하세요.</p>`,`<button class="btn" data-close>닫기</button><button class="btn primary" data-u-holidays-save>자료 저장·전체 사건 재계산</button>`,'wide');
 }
 const METHODS={
   immediate:['응급구호·119 등 필요한 긴급조치를 먼저 시행합니다.','추가 위험이 있으면 작업중지·대피 및 접근 통제를 실시합니다.','현장 안전과 연락·조치 내용을 기록합니다.'],
   assessment:['사고일·재해 형태·소속과 실제 작업관계를 확인합니다.','사망·휴업 필요 일수·중대재해 여부를 확인합니다.','산업재해조사표 제출대상·수행주체와 특례를 확인하고 사고정보를 보완합니다.'],
   'urgent-report':['중대재해 해당 여부와 사업주의 보고 수행주체를 즉시 확인합니다.','관할 지방고용노동관서에 발생 개요·피해·조치 및 전망 등 필요한 사항을 지체 없이 보고합니다.','보고 시각·방법·수신기관과 증빙을 기록합니다. 다른 단계의 완료를 기다리지 않습니다.'],
   report:['사고 사실·휴업 일수·대상 근로자와 보고 기준일을 확인합니다.','별지 제30호 산업재해조사표에 사실관계와 재발방지 내용을 작성합니다.','근로자대표 확인 등 적용 절차·제출기관을 원문과 대조합니다.','관할 지방고용노동관서에 제출하고 접수·발송 증빙과 실제 처리일을 보존합니다.'],
   risk:['재해가 발생한 관련 작업의 재개일과 평가 범위를 확인합니다.','근로자가 참여해 유해·위험요인을 파악하고 위험성을 결정합니다.','감소대책을 이행하고 해당 작업 재개 전에 결과를 공유·기록합니다.'],
   muscle:['수시 조사사유와 질환 관련 예외의 적용 여부를 확인합니다.','근로자 참여하에 조사대상·방법을 정해 유해요인조사를 시행합니다.','작업환경 개선 및 필요한 조치를 하고 결과·처리일을 기록합니다.'],
   cause:['사고 당시 작업·설비·절차와 관련 자료를 확보합니다.','직접 원인과 관리상 원인을 분석합니다.','재발방지계획에 조치·담당자·내부 목표일을 정합니다.'],
   improvement:['계획한 개선조치의 담당자와 완료 목표일을 확인합니다.','개선조치를 이행하고 현장의 위험 감소 여부를 재점검합니다.','미흡사항·추가 조치·증빙을 기록합니다.'],
   education:['대상 작업·근로자에게 필요한 교육 종류·내용과 적용 요건을 확인합니다.','실제 교육을 실시하고 참석·내용·시간을 기록합니다.','현장 적용과 필요한 후속점검 결과를 확인합니다.'],
   'followup-close':['생성된 필수·조건부 업무의 적용 판단과 실제 이행을 확인합니다.','삭제된 일정이 있으면 실제 처리일·별도 이행 증빙을 기록합니다.','현장 후속점검 후 사건 화면에서 종결 가능 여부를 확인합니다.']
 };
 const taskOpenBefore=openTask;
 openTask=function(id){const t=app.data.tasks.find(t=>t.id===id);if(!isIncident(t))return taskOpenBefore(id);showIncidentTask(id);};
 function showIncidentTask(id){
   if(window.safetyShowIncidentTask)return window.safetyShowIncidentTask(id);
   const t=app.data.tasks.find(t=>t.id===id);if(!t||!visibleSchedule(t))return;
   const e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId),methods=METHODS[t.workflowPhase]||['사고정보에서 적용조건과 미확인 항목을 확인합니다.','관련 원문·대상을 대조하고 필요한 조치와 목표일을 정합니다.','처리 결과와 확인 내용을 기록합니다.'];
   const phase=REGISTRY[t.workflowPhase],checks=t.checklist||[],p=progressOf(t);
   document.getElementById('overlay').innerHTML=`<div class="drawer-wrap" data-close-overlay><aside class="drawer incident-task-drawer"><div class="drawer-head"><h3>산업재해 업무 수행 안내</h3><button class="close" data-close aria-label="닫기">×</button></div><div class="drawer-body"><h2>${esc(t.userModified?t.name:t.workflowAction||t.name)}</h2><p>${statusBadge(statusOf(t))} <span class="origin-badge">${esc(originLabel(t))}</span> ${esc(t.obligationType||'조건 확인 필요')}</p><h4>① 처리기한</h4>${deadlineHtml(t)}<div class="incident-inline-actions">${phase?`<button class="btn" data-u-refresh="${esc(e.id)}">공식 법령 재조회·검증</button><button class="btn" data-u-review="${esc(t.id)}">기간 규칙 검토</button>`:''}<button class="btn" data-u-override="${esc(t.id)}">최종 만료일 직접 확정·수정</button></div><h4>② 지금 해야 할 일</h4><p>${p.done}/${p.total} 완료</p>${checks.map(c=>`<label class="check-item"><input type="checkbox" data-check-task="${esc(t.id)}" data-check="${esc(c.id)}" ${c.done?'checked':''} ${t.completedByUser?'disabled':''}>${esc(c.label)}</label>`).join('')}<h4>③ 구체적인 처리방법</h4><ol>${methods.map(m=>'<li>'+esc(m)+'</li>').join('')}</ol>${t.waitForStage?'<p class="subtle">선행 단계 이행 후 진행할 업무입니다. 긴급조치·긴급보고는 별도로 즉시 수행하세요.</p>':''}<h4>④ 관련 기능</h4><div class="incident-links">${phase?`<a class="btn" href="${esc(refLink(phase.refs[0]))}" target="_blank" rel="noopener">법령 원문 확인</a>`:''}<button class="btn" data-u-go="forms" data-id="${esc(t.id)}">서식 자동화</button><button class="btn" data-u-go="chatbot" data-id="${esc(t.id)}">AI 업무지원 챗봇</button><button class="btn" data-u-calendar="${esc(t.id)}">캘린더 일정 보기</button><button class="btn" data-edit-task="${esc(t.id)}">일정 수정</button><button class="btn" data-u-go="inspection" data-id="${esc(t.id)}">시설점검 이력</button><button class="btn" data-incident="${esc(e.id)}">사건의 단계별 업무</button></div><h4>⑤ 완료 처리</h4><form id="incidentComplete" data-id="${esc(t.id)}">${inputField('performedOn','실제 처리일',t.actualDate||localToday(),'date','required max="'+localToday()+'"')}<label>처리 결과·접수·증빙 기록<textarea name="result" required>${esc(t.resultSummary||'')}</textarea></label></form><div class="incident-inline-actions">${t.completedByUser?`<button class="btn" data-reopen="${esc(t.id)}">완료 취소</button>`:`<button class="btn primary" data-u-complete="${esc(t.id)}" ${p.all?'':'disabled'}>처리 결과 저장·완료</button>`}<button class="btn danger" data-schedule-delete="${esc(t.id)}">일정 삭제</button></div><details><summary>추가 법령·산정 근거 및 변경 이력</summary><p>API 원문 조회일: ${esc(t.legalCheckedAt||'없음')} · 적용 시행일: ${esc(t.legalEffectiveDate||'미확인')}</p><ul>${sourceList(t)}</ul><ul>${(t.calculation||[]).map(x=>'<li>'+esc(x)+'</li>').join('')}</ul>${(t.overrideHistory||[]).map(h=>`<p>${esc(h.at)} · ${esc(h.by)}: ${esc(h.finalLegalDeadline)} · ${esc(h.reason)} · ${esc(h.basis)}</p>`).join('')}</details></div></aside></div>`;
   window.safetyIncidentDetailEnhance?.(t);
 }
 function manualDeadline(id){const t=app.data.tasks.find(t=>t.id===id);if(!t)return;modal('최종 법정만료일 직접 확정·수정',`<p>공식 원문과 개별 적용조건을 확인한 담당자의 확정값으로 기록합니다. 자동 검증 완료와 구분됩니다.</p><form id="manualDeadlineForm" data-id="${esc(id)}" class="form-grid">${inputField('finalLegalDeadline','최종 만료일',t.finalLegalDeadline||t.computedBaseDeadline||'','date','required')}${inputField('by','변경자','','text','required')}${inputField('reason','변경 이유','','text','required')}<div class="field full"><label>확정·변경 근거</label><textarea name="basis" required></textarea></div></form>`,`<button class="btn" data-close>취소</button><button class="btn primary" data-u-override-save>담당자 확정값 저장</button>`);}
 function incidentProgress(e){if(window.safetyFlowProgress)return window.safetyFlowProgress(e);const tasks=incidentTasks(e).filter(t=>!t.workflowInactive),deleted=Object.values(settings().deletedTasks).filter(t=>t.sourceEventId===e.id);const done=tasks.filter(t=>t.completedByUser).length+deleted.filter(t=>validResolution(e.resolvedDeleted?.[t.key])).length;const next=tasks.filter(t=>!t.completedByUser).sort((a,b)=>(a.deadlineKind==='immediate'?-1:b.deadlineKind==='immediate'?1:0)||String(a.managementDue||'9999').localeCompare(b.managementDue||'9999'))[0];return {tasks,deleted,done,total:tasks.length+deleted.length,next};}
 function validResolution(value){return !!value&&typeof value==='object'&&validDay(value.performedOn)&&!!value.result?.trim();}
 incidentCanClose=function(e){return incidentPlan(e).every(p=>{const key='incident|'+e.id+'|'+p.stage,t=app.data.tasks.find(t=>t.workflowKey===key);return t?.completedByUser&&!t.completedRecheck&&!t.overrideRecheck||validResolution(e.resolvedDeleted?.[key]);});};
 showIncidentList=function(){const events=app.data.triggerEvents.filter(e=>e.type==='accident');modal('산업재해 사건 기록',events.map(e=>`<article class="incident-step"><b>산업재해 후속조치 · ${esc(e.date)}</b><p>${esc(e.data?.accidentType||'유형 확인 필요')} · ${esc(e.data?.content||'')} · ${e.closedAt?'종결':'진행 중'}</p><button class="btn" data-incident="${esc(e.id)}">단계별 업무 보기</button></article>`).join('')||'<p>등록된 사건이 없습니다.</p>','<button class="btn" data-close>닫기</button>','wide');};
 showIncident=function(id){
   const e=app.data.triggerEvents.find(e=>e.id===id);if(!e)return;
   const p=incidentProgress(e);
   modal('산업재해 발생 후속조치',`<div data-incident-detail="${esc(id)}"><p>발생일 ${esc(e.date)} · ${p.done}/${p.total} 완료 · ${e.closedAt?'종결':'진행 중'}<br>${esc(e.data?.accidentType||'')} · ${esc(e.data?.content||'')}</p><div class="incident-inline-actions"><button class="btn" data-edit-incident="${esc(id)}">사고정보 수정·재판정</button><button class="btn" data-u-refresh="${esc(id)}">공식 법령 재조회·검증</button><button class="btn" data-u-holidays>공휴일 자료</button></div>${e.legalRefreshNotice?'<p>'+esc(e.legalRefreshNotice)+'</p>':''}<ol class="incident-stages">${p.tasks.map(t=>`<li class="incident-step"><b>${esc(t.userModified?t.name:t.workflowAction||t.name)}</b><p>${esc(t.obligationType||'조건부 의무')} · ${statusBadge(statusOf(t))} · ${esc(verificationText(t))}<br>${t.deadlineKind==='immediate'?'즉시·지체 없이':`내부 목표 ${esc(t.managementDue||'확인 필요')} / 법정만료 ${esc(t.finalLegalDeadline||'확인 필요')}`}${t.waitForStage?' · 선행업무 후 진행':''}</p><button class="btn" data-task="${esc(t.id)}">업무 열기</button> <button class="btn" data-edit-task="${esc(t.id)}">수정</button> <button class="btn" data-schedule-delete="${esc(t.id)}">삭제</button></li>`).join('')}</ol><h4>삭제된 일정·별도 이행 확인</h4>${p.deleted.map(t=>`<article class="incident-step"><b>${esc(t.action||'삭제 일정')}</b><p>${validResolution(e.resolvedDeleted?.[t.key])?'별도 이행 확인: '+esc(e.resolvedDeleted[t.key].performedOn)+' · '+esc(e.resolvedDeleted[t.key].result):'일정 삭제 · 이행 미확인'}</p><button class="btn" data-u-resolve="${esc(t.id)}" data-event="${esc(id)}">실제 이행 기록</button> <button class="btn" data-u-restore="${esc(t.id)}">이 일정 복원</button></article>`).join('')||'<p>삭제된 일정 없음</p>'}<details><summary>사건 관리정보</summary><p>내부 관리번호: ${esc(incidentNumber(e))}<br>등록 ${esc(e.createdAt||'')} · 변경 ${esc(e.updatedAt||'')}</p></details><p>삭제는 업무 이행이 아닙니다. 필수조치와 별도 이행 기록을 모두 확인한 뒤 종결합니다.</p></div>`,`<button class="btn" data-incident-list>사고 목록</button><button class="btn" data-close>닫기</button>${e.closedAt?'':`<button class="btn primary" data-close-incident="${esc(id)}">필수조치 확인 후 사건 종결</button>`}`,'wide');
 };
 const confirmationBefore=confirmationItems;
 confirmationItems=function(){
   const prior=confirmationBefore().filter(x=>!x.eventId&&!(x.taskId&&isIncident(app.data.tasks.find(t=>t.id===x.taskId))))
     .map(x=>({...x,group:x.route==='cycle'?'regular':'other'}));
   for(const e of app.data.triggerEvents.filter(e=>e.type==='accident'&&!e.closedAt)){
     const p=incidentProgress(e);prior.push({key:'event-summary|'+e.id,eventId:e.id,group:'incident',title:'산업재해 발생 후속조치',status:p.done+'/'+p.total+' 완료',action:p.next?.workflowAction||'필수조치·삭제 이행 확인 후 사건 종결',date:e.date,target:p.next?.managementDue||'',route:'incident'});
   }return prior;
 };
 const groupTitle={incident:'산업재해 후속조치',regular:'정기·장기주기 업무 확인사항',other:'기타 확인사항'};
 function confirmationEntry(item){if(item.group==='incident')return `<article class="confirmation-item"><strong>${esc(item.title)}</strong><p>${esc(item.action)}</p><small>${esc(item.date)}</small><button class="btn" ${item.route==='incident-input'?'data-edit-incident="'+esc(item.eventId)+'"':'data-task="'+esc(item.taskId)+'"'}>입력하기</button></article>`;return `<article class="confirmation-item"><strong>● ${esc(item.title)}</strong>${item.group==='incident'?`<p>발생일 ${esc(item.date)} · ${esc(item.status)}</p><p>다음 조치: ${esc(item.action)}</p><p>긴급 미완료: ${esc(item.urgentCount??0)}건 · 다음 법정기한: ${esc(item.nextLegal||'기한·적용 확인 필요')}</p><button class="btn" data-incident="${esc(item.eventId)}">단계별 업무 보기</button>`:`<p>${esc(item.action)}</p><div class="confirmation-actions"><span class="confirmation-state">${esc(item.status)}</span><button class="btn" ${item.route==='cycle'?'data-long-cycles':'data-task="'+esc(item.taskId)+'"'}>업무 열기</button></div>`}</article>`;}
 function confirmationGroups(all=false){const items=confirmationItems();return Object.keys(groupTitle).map(group=>{const rows=items.filter(x=>x.group===group);return rows.length?`<section class="confirmation-group"><h5>${groupTitle[group]} <small>${rows.length}건</small></h5>${(all?rows:rows.slice(0,1)).map(confirmationEntry).join('')}${!all&&rows.length>1?`<button class="confirmation-more" data-u-confirm-all>이 그룹 ${rows.length}건 전체 보기</button>`:''}</section>`:''}).join('')||'<p class="subtle">현재 확인이 필요한 업무가 없습니다.</p>';}
 confirmationPanelHtml=function(){const items=confirmationItems();return `<aside class="ref-upcoming confirmation-panel"><div class="confirmation-heading"><h4>확인·조치가 필요한 업무</h4><small>${items.length}건</small><button class="btn" data-u-confirm-all aria-label="확인사항 ${items.length}건 전체 보기">전체</button></div>${confirmationGroups()}<button class="confirmation-more" data-u-confirm-all>전체 ${items.length}건 보기</button></aside>`;};
 const isSuppressedBefore=isSuppressed;
 isSuppressed=function(t){if(!t.restoredStandalone)return isSuppressedBefore(t);const s=settings();return !!s.deletedTasks[t.id]||Object.values(s.deletedTasks).some(d=>d.key===deletionKey(t))||s.suppressed.includes(deletionKey(t))||s.suppressed.includes(t.occurrenceKey);};
 const deleteBefore=deleteSchedule;
 deleteSchedule=function(id,whole=false,reason='사용자 일정 삭제'){
   const t=app.data.tasks.find(t=>t.id===id);if(!t)return;
   const candidates=(whole?app.data.tasks.filter(x=>x.type==='정기'&&repeatRuleKey(x)===repeatRuleKey(t)&&!x.completedByUser):[t]).map(t=>JSON.parse(JSON.stringify(t)));
   deleteBefore(id,whole);
   for(const old of candidates){const record=settings().deletedTasks[old.id];if(record)Object.assign(record,{snapshot:old,deletedAt:record.at,deletionReason:reason});}
 };
 const askBefore=askDeleteSchedule;
 askDeleteSchedule=function(id){askBefore(id);const body=document.querySelector('.modal-body');if(!body)return;const notice=body.querySelector('.notice');if(notice)notice.textContent='캘린더 일정을 삭제해도 법정 이행의무는 없어지지 않습니다.';else body.insertAdjacentHTML('beforeend','<p class="notice">캘린더 일정을 삭제해도 법정 이행의무는 없어지지 않습니다.</p>');body.insertAdjacentHTML('beforeend','<label>삭제 이유 (선택)<input name="scheduleDeletionReason" placeholder="일정 변경·별도 관리 등"></label>');};
 function restoreSchedule(id){
   const s=settings(),record=s.deletedTasks[id];if(!record?.snapshot)throw Error('이전 버전에서 삭제된 일정은 원본 스냅샷이 없어 복원할 수 없습니다.');
   const t=JSON.parse(JSON.stringify(record.snapshot));delete s.deletedTasks[id];for(const [key,value] of Object.entries(s.deletedTasks))if(value.key===record.key)delete s.deletedTasks[key];
   s.suppressed=s.suppressed.filter(k=>k!==record.key&&k!==record.occurrenceKey);
   t.restoredStandalone=true;s.scheduleRestores[id]={restoredAt:stamp(),task:t,key:record.key};
   if(!app.data.tasks.some(x=>x.id===t.id)){app.data.tasks.push(t);app.syncChecklist(t)}
   app.history(t.id,'삭제 일정 개별 복원 (중단한 반복규칙은 유지)');
   const e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId);if(e)syncIncident(e);return t;
 }
 function deletedList(){modal('삭제 일정·개별 복원',Object.values(settings().deletedTasks).map(r=>`<article class="incident-step"><b>${esc(r.action||'삭제 일정')}</b><p>${esc(r.deletedAt||r.at)} · ${esc(r.deletionReason||'이전 삭제 이력')}</p><button class="btn" data-u-restore="${esc(r.id)}" ${r.snapshot?'':'disabled'}>이 일정만 복원</button></article>`).join('')||'<p>삭제된 일정이 없습니다.</p>','<button class="btn" data-close>닫기</button>','wide');}
 const mergeBefore=mergeBackup;
 mergeBackup=function(a,b){
   const merged=mergeBefore(a,b),s=merged.appSettings;
   const tombstones={};for(const data of [a,b])for(const [id,record] of Object.entries(data.appSettings?.deletedTasks||{}))if(!tombstones[id]||(record.deletedAt||record.at||'')>(tombstones[id].deletedAt||tombstones[id].at||''))tombstones[id]=JSON.parse(JSON.stringify(record));s.deletedTasks=tombstones;
   s.scheduleRestores={...b.appSettings?.scheduleRestores,...a.appSettings?.scheduleRestores};
   for(const [id,r] of Object.entries(b.appSettings?.scheduleRestores||{}))if(r.restoredAt>(s.scheduleRestores[id]?.restoredAt||''))s.scheduleRestores[id]=r;
   for(const [id,r] of Object.entries(s.scheduleRestores||{})){
     const deleted=s.deletedTasks[id];if(deleted&&(deleted.deletedAt||deleted.at||'')>=r.restoredAt)continue;
     if(deleted)delete s.deletedTasks[id];s.suppressed=(s.suppressed||[]).filter(k=>k!==r.key&&k!==r.task.occurrenceKey);
     if(!merged.tasks.some(t=>t.id===id))merged.tasks.push(JSON.parse(JSON.stringify(r.task)));
   }
   // Preserve the most recent successful official cache without merging credentials.
   s.deadlineEvidence={...b.appSettings?.deadlineEvidence,...a.appSettings?.deadlineEvidence};
   for(const [k,v] of Object.entries(b.appSettings?.deadlineEvidence||{}))if(v.fetchedAt>(s.deadlineEvidence[k]?.fetchedAt||''))s.deadlineEvidence[k]=v;
   s.deadlineHolidays=a.appSettings?.deadlineHolidays||b.appSettings?.deadlineHolidays||{years:{}};
   return merged;
 };
 function calendarDates(t){return [...new Set([t.date,t.managementDue,t.finalLegalDeadline,t.beforeWorkDate,t.retentionEnd].filter(validDay))];}
 function dateMeaning(t,day){if(!isIncident(t))return t.dueDate===day?'마감일':'수행일';const labels=[];if(t.workflowPhase==='report'&&!t.finalLegalDeadline&&t.computedBaseDeadline===day)labels.push('1개월 기본 계산일 · 특례·휴일 적용 확인 필요');if(t.retentionEnd===day)labels.push('기록 보존 종료 확인 · 자동파기 없음');if((t.managementDue||t.date)===day)labels.push(t.deadlineKind==='immediate'?'즉시 조치':'내부 목표일');if(t.finalLegalDeadline===day)labels.push(t.deadlineRule?.kind==='before'?'작업 시작 전':'법정마감일');else if(t.beforeWorkDate===day)labels.push('작업 재개 전 · 적용 확인');return labels.join(' · ')||'처리일';}
 const dayBefore=dashDayTasks;
 dashDayTasks=function(){const list=dayBefore().filter(t=>!isIncident(t));return list.concat(app.data.tasks.filter(t=>isIncident(t)&&visibleSchedule(t)&&calendarDates(t).includes(app.dashDate))).filter(originMatch);};
 function withOrigin(fn,args){const all=app.data.tasks;app.data.tasks=all.filter(originMatch);try{return fn(...args)}finally{app.data.tasks=all;}}
 function calendarTaskIndex(){
  if(renderMemo?.calendar?.source===app.data.tasks)return renderMemo.calendar.map;
  const map=new Map();for(const t of app.data.tasks){if(!visibleSchedule(t)||!originMatch(t))continue;const dates=isIncident(t)?calendarDates(t):[taskDate(t),t.dueDate];for(const day of new Set(dates.filter(validDay))){if(!map.has(day))map.set(day,[]);if(!map.get(day).some(x=>x.id===t.id))map.get(day).push(t)}}
  if(renderMemo)renderMemo.calendar={source:app.data.tasks,map};return map;
 }
 function monthCalendar(home){
  const y=app.calendarDate.getFullYear(),m=app.calendarDate.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay()),weeks=Math.ceil((first.getDay()+new Date(y,m+1,0).getDate())/7),index=calendarTaskIndex();let cells='';
  for(let i=0;i<weeks*7;i++){const d=new Date(start);d.setDate(start.getDate()+i);const day=isoDate(d),tasks=[...(index.get(day)||[])].sort((a,b)=>Number(b.dueDate===day)-Number(a.dueDate===day)),visible=tasks.slice(0,1);
   const holiday=window.KoreanPublicHolidays?.getHoliday(day,app.data.appSettings.holidays||[]),holidayShort=holiday?.name.startsWith('대체공휴일')?'대체휴일':holiday?.name==='어린이날 · 부처님오신날'?'어린이날 외':holiday?.name||'';
   const dots=tasks.slice(0,5).map(t=>{const status=statusOf(t),color=status==='지연'?'red':status==='임박'?'orange':/교육/.test(t.category)?'green':/점검/.test(t.category)?'purple':day===localToday()?'blue':t.type==='정기'?'purple':'muted';return `<i class="${color}" title="${escapeHtml(taskDisplay(t).title)}"></i>`}).join('');
   const labels=visible.map(t=>{const deadline=t.dueDate===day;return `<span class="calendar-schedule-item ${deadline?'calendar-deadline':''}" role="button" tabindex="0" data-calendar-task="${esc(t.id)}" title="${deadline?'마감일 · ':''}${esc(t.name||taskDisplay(t).title)}">${deadline?'<span class="calendar-deadline-prefix">마감 · </span>':''}${esc(scheduleCalendarLabel(t))}</span>`}).join('');
   const holidayBadge=holiday?`<small class="calendar-holiday-badge ${holiday.kind==='custom'?'custom':''}" title="${esc(holiday.name)}">${esc(holidayShort)}</small>`:'';
   cells+=`<button class="ref-day ${home?'home-calendar-day':'work-calendar-day'} ${d.getMonth()!==m?'outside':''} ${day===app.dashDate?'selected':''} ${d.getDay()===0?'sunday':d.getDay()===6?'saturday':''} ${holiday?'is-public-holiday':''}" ${home?'data-suite-day':'data-select-day'}="${day}" aria-label="${day}${holiday?' '+esc(holiday.name):''} 일정 ${tasks.length}건"><b>${d.getDate()}${home&&holiday?holidayBadge:dots?'<span class="suite-date-dots">'+dots+'</span>':''}</b>${!home?holidayBadge:''}${labels?'<span class="calendar-task-preview">'+labels+'</span>':''}${tasks.length>1?`<span class="calendar-more" role="button" tabindex="0" data-calendar-more="${day}">+${tasks.length-1}건</span>`:''}</button>`;
  }
  const holidayNote=window.KoreanPublicHolidays?.hasFullYearData(y)?'공휴일·학교 휴무일 표시':'고정 공휴일만 표시 · 음력·임시공휴일은 휴무일 설정에서 추가';
  return `<section class="panel ref-calendar ${home?'home-month-calendar':'scoped-long-calendar'}"><div class="ref-calendar-head"><div><button class="btn" data-cal="prev" aria-label="이전달">‹</button><button class="btn" data-cal="next" aria-label="다음달">›</button></div><h3>${y}년 ${m+1}월</h3><button class="btn" data-dash-today>오늘</button></div><div class="ref-weekdays">${['일','월','화','수','목','금','토'].map(x=>'<span>'+x+'</span>').join('')}</div><div class="ref-month-grid" style="--weeks:${weeks}">${cells}</div>${home?'':`<div class="ref-calendar-note">일정명을 선택하면 상세 내용을 확인합니다. · ${holidayNote}</div>`}</section>`;
 }
 referenceMonth=function(){return monthCalendar(false)};
 suiteHomeCalendar=function(){return monthCalendar(true)};
 window.addEventListener('click',ev=>{const more=ev.target.closest('[data-calendar-more]');if(!more)return;ev.preventDefault();ev.stopImmediatePropagation();modal(more.dataset.calendarMore+' 일정',taskRows(calendarTaskIndex().get(more.dataset.calendarMore)||[]),'<button class="btn" data-close>닫기</button>','wide')},true);
 window.addEventListener('keydown',ev=>{if(['Enter',' '].includes(ev.key)&&ev.target.matches('[data-calendar-more]')){ev.preventDefault();ev.target.click()}},true);
 const filteredBefore=getFilteredTasks;
 getFilteredTasks=function(...args){return filteredBefore(...args).filter(originMatch);};
 const dayPanelBefore=referenceDayPanel;
 referenceDayPanel=function(...args){return withOrigin(dayPanelBefore,args);};
 const rowsBefore=taskRows;
 taskRows=function(list){return rowsBefore(list.filter(originMatch)).replace(/(<button class="btn" data-task="([^"]+)">업무보기<\/button>)/g,(button,all,id)=>{const t=app.data.tasks.find(t=>t.id===id);return `<span class="origin-badge">${esc(t?originLabel(t):'출처 확인')}</span>${button}<button class="btn" data-edit-task="${esc(id)}">수정</button><button class="btn" data-schedule-delete="${esc(id)}">삭제</button>`;});};
 const workCalendarBefore=renderWorkCalendar;
 renderWorkCalendar=function(list){return workCalendarBefore(list.filter(originMatch)).replace(/(<button[^>]+data-task="([^"]+)"[^>]*>)/g,(head,match,id)=>{const t=app.data.tasks.find(t=>t.id===id);return head+(t?`<span class="origin-inline">${esc(originLabel(t))}</span>`:'');});};
 const renderBefore=render;
 render=function(...args){
   if(app.data){settings();migrateOrigins();migrateScheduleLabels();app.originFilter??=app.data.appSettings.scheduleOriginFilter||'all';}
   const result=renderBefore(...args);if(app.page!=='work')return result;
   const mainCalendar=document.querySelector('.scoped-long-calendar');if(mainCalendar&&!mainCalendar.querySelector('.long-cycle-summary'))mainCalendar.insertAdjacentHTML('afterbegin',longSummaryHtml());
   const toolbar=document.querySelector('.ref-single-toolbar');if(toolbar&&!document.getElementById('originFilter')){
     const select=document.createElement('select');select.id='originFilter';select.setAttribute('aria-label','일정 출처 필터');select.innerHTML=[['all','전체 출처'],['auto','자동 생성'],['manual','직접 등록'],['legacy-unknown','출처 확인 필요']].map(([v,l])=>`<option value="${v}" ${app.originFilter===v?'selected':''}>${l}</option>`).join('');
     toolbar.append(select);toolbar.insertAdjacentHTML('beforeend','<button class="btn" data-u-deleted>삭제 일정·복원</button>');
   }
   document.querySelectorAll('.ref-task').forEach(row=>{
     const id=row.querySelector('[data-task]')?.dataset.task,t=app.data.tasks.find(t=>t.id===id);if(!t)return;
     const copy=row.querySelector('.ref-task-copy');if(!isDirectSchedule(t))copy?.insertAdjacentHTML('beforeend',`<small class="origin-badge">${esc(originLabel(t))}${isIncident(t)?' · '+esc(dateMeaning(t,app.dashDate)):''}</small>`);
     if(isIncident(t)){const p=copy?.querySelector('p');if(p)p.textContent=window.safetyCoreIncident?.timing(t)||'기한 확인 필요';}
     const actions=row.querySelector('.day-task-actions');if(actions)actions.insertAdjacentHTML('beforeend',`<button class="btn" data-edit-task="${esc(t.id)}">수정</button>`);
   });
   document.querySelectorAll('.ref-task-table tbody tr').forEach(row=>{
     const id=row.querySelector('[data-task]')?.dataset.task,t=app.data.tasks.find(t=>t.id===id);if(!t)return;
     const title=row.querySelector('td strong');title?.insertAdjacentHTML('afterend',`<small class="origin-badge">${esc(originLabel(t))}</small>`);
     const cell=row.lastElementChild;if(cell){cell.insertAdjacentHTML('beforeend',`<button class="btn" data-edit-task="${esc(t.id)}">수정</button><button class="btn" data-schedule-delete="${esc(t.id)}">삭제</button>`);}
   });
   const panel=document.querySelector('.confirmation-panel');if(panel)panel.outerHTML=confirmationPanelHtml();
   return result;
 };
 const editBefore=openTaskEdit;
 openTaskEdit=function(id){const t=app.data.tasks.find(t=>t.id===id);if(!isIncident(t))return editBefore(id);modal('산재 일정 수정',`<form id="incidentEdit" class="form-grid" data-id="${esc(id)}">${inputField('name','업무 제목',t.userModified?t.name:t.workflowAction||t.name,'text','required')}${inputField('date','내부 처리 목표일',t.managementDue||t.date||'','date')}${inputField('responsible','담당자',t.responsible||'')}${inputField('reason','수정 이유','','text','required')}<div class="field full"><label>메모</label><textarea name="memo">${esc(t.memo||'')}</textarea></div></form><p>법정만료일은 별도의 근거 검토 또는 담당자 확정 기능으로 변경합니다. 수동 목표일은 사고정보 재계산 후에도 유지합니다.</p>`,`<button class="btn" data-close>취소</button><button class="btn" data-u-override="${esc(id)}">법정만료일 직접 확정</button><button class="btn primary" data-u-edit-save>일정 수정 저장</button>`);};
 function actualResolution(id,eventId){const record=settings().deletedTasks[id];if(!record)return;modal('삭제 일정의 실제 이행 기록',`<p>${esc(record.action)} · 일정 복원과 실제 이행 확인은 별도입니다.</p><form id="deletedResolution" data-id="${esc(id)}" data-event="${esc(eventId)}">${inputField('performedOn','실제 처리일','','date','required max="'+localToday()+'"')}<label>이행 내용·증빙<textarea name="result" required></textarea></label></form>`,`<button class="btn" data-close>닫기</button><button class="btn primary" data-u-resolve-save>별도 이행 확인 저장</button>`);}
 const dataForm=id=>{const form=document.getElementById(id);if(!form?.reportValidity())return null;return {form,value:Object.fromEntries(new FormData(form))};};
 backupJSON=function(){
   function withoutCredentials(value){if(Array.isArray(value))return value.map(withoutCredentials);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!/^(OC|apiKey|apiCredential|accessToken)$/i.test(key)).map(([key,v])=>[key,withoutCredentials(v)]));return value;}
   const data=withoutCredentials(safetyLaw.scrub(app.data));
   download('산업안전업무_백업_'+localToday()+'.json',JSON.stringify({app:'산업안전보건 일정·업무 내비게이터',version:APP_VERSION,exportedAt:stamp(),data},null,2),'application/json;charset=utf-8');toast('인증정보를 제외한 전체 업무·삭제 이력 백업을 저장했습니다.');
 };
 function navigate(page,t){closeOverlay();app.page=page;render();if(page==='chatbot'){const q=document.querySelector('[name="question"]');if(q)q.value=(t?.workflowAction||'산업재해 후속조치')+' 처리 절차와 확인할 사항';}if(page==='forms'&&t)toast((t.workflowForms||taskDisplay(t).forms||t.workflowAction)+' · 제공된 실제 서식 목록에서 선택하세요.');}
 document.addEventListener('change',async event=>{if(event.target.id==='originFilter'){app.originFilter=event.target.value;app.data.appSettings.scheduleOriginFilter=app.originFilter;await app.save();render();}});
 document.addEventListener('click',async event=>{
   const button=event.target.closest('button');if(!button)return;
   const custom=[...button.attributes].some(a=>a.name.startsWith('data-u-'));
   if(!custom&&!button.hasAttribute('data-confirm-schedule-delete'))return;
   event.preventDefault();event.stopImmediatePropagation();button.disabled=true;
   try{
     if(button.hasAttribute('data-confirm-schedule-delete')){deleteSchedule(button.dataset.confirmScheduleDelete,document.querySelector('[name="deleteScope"]:checked')?.value==='all',document.querySelector('[name="scheduleDeletionReason"]')?.value||'사용자 일정 삭제');await app.save();closeOverlay();render();return;}
     if(button.hasAttribute('data-u-refresh')){button.textContent='공식 API 조회 중…';const id=button.dataset.uRefresh,taskId=document.querySelector('[data-flow-task-id]')?.dataset.flowTaskId;await refreshIncident(id);if(taskId)showIncidentTask(taskId);else showIncident(id);}
     else if(button.hasAttribute('data-u-review'))reviewDeadline(button.dataset.uReview);
     else if(button.hasAttribute('data-u-review-save')){
       const data=dataForm('deadlineReview');if(!data)return;const {form,value:v}=data,t=app.data.tasks.find(t=>t.id===form.dataset.id),e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId),bundle=e.legalBundles?.[t.workflowPhase];
       if(!bundle?.ok||!evidenceFresh(bundle))throw Error('성공한 최신 API 원문을 먼저 조회하세요.');
       e.deadlineReviews??={};e.deadlineReviews[t.workflowPhase]={periodKind:v.periodKind||REGISTRY[t.workflowPhase].kind,periodCount:Number(v.periodCount)||REGISTRY[t.workflowPhase].count,ruleLabel:v.ruleLabel||REGISTRY[t.workflowPhase].label,includeFirst:v.includeFirst==='true',holidayExtension:v.holidayExtension==='unknown'?null:v.holidayExtension==='true',scopeReviewed:!!v.scopeReviewed,periodRulesReviewed:!!v.periodRulesReviewed,exceptionsReviewed:!!v.exceptionsReviewed,changeImpactReviewed:true,reviewer:v.reviewer,basis:v.basis,at:stamp(),bundleFingerprint:bundle.fingerprint,inputSignature:signature(e)};
       syncIncident(e);await app.save();render();showIncidentTask(t.id);
     }
     else if(button.hasAttribute('data-u-holidays'))holidayForm();
     else if(button.hasAttribute('data-u-holidays-save')){
       const data=dataForm('deadlineHolidayForm');if(!data)return;const v=data.value,y=String(Number(v.year));
       const u=new URL(v.sourceUrl);if(u.protocol!=='https:'||!u.hostname.endsWith('.go.kr')&&u.hostname!=='kasi.re.kr'&&!u.hostname.endsWith('.kasi.re.kr'))throw Error('공식 기관(go.kr) 또는 한국천문연구원의 HTTPS 공표 자료 URL을 입력하세요.');
       const dates=[...new Set(v.dates.split(/[\s,]+/).filter(Boolean))];if(dates.some(x=>!validDay(x)||!x.startsWith(y+'-')))throw Error('선택 연도의 올바른 날짜만 입력하세요.');
       for(const suffix of ['01-01','03-01','05-05','06-06','08-15','10-03','10-09','12-25'])if(!dates.includes(y+'-'+suffix))throw Error('고정 공휴일 '+y+'-'+suffix+'도 포함하여 전체 연도를 입력하세요.');
       settings().deadlineHolidays.years[y]={dates,sourceUrl:u.href,checkedAt:stamp(),reviewer:v.reviewer,complete:true,includesSubstitutes:true};
       for(const e of app.data.triggerEvents.filter(e=>e.type==='accident'))syncIncident(e);await app.save();closeOverlay();render();toast('공휴일 자료를 저장하고 관련 사건을 재계산했습니다.');
     }
     else if(button.hasAttribute('data-u-override'))manualDeadline(button.dataset.uOverride);
     else if(button.hasAttribute('data-u-override-save')){
       const data=dataForm('manualDeadlineForm');if(!data)return;const {form,value:v}=data,t=app.data.tasks.find(t=>t.id===form.dataset.id),e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId);
       if(!validDay(v.finalLegalDeadline))throw Error('최종 만료일을 확인하세요.');
       t.overrideHistory??=[];const record={...v,at:stamp(),inputSignature:signature(e),bundleFingerprint:e.legalBundles?.[t.workflowPhase]?.fingerprint||'',previous:t.finalLegalDeadline||''};t.overrideHistory.push(record);t.manualOverride=record;
       syncIncident(e);app.history(t.id,'담당자 최종 만료일 확정: '+v.reason);await app.save();render();showIncidentTask(t.id);
     }
     else if(button.hasAttribute('data-u-edit-save')){
       const data=dataForm('incidentEdit');if(!data)return;const {form,value:v}=data,t=app.data.tasks.find(t=>t.id===form.dataset.id);
       if(v.date&&!validDay(v.date))throw Error('내부 목표일 확인 필요');t.changes??=[];t.changes.push({at:stamp(),before:{name:t.name,date:t.date},after:v,reason:v.reason});Object.assign(t,{name:v.name,date:v.date,managementDue:v.date,manualTargetDate:v.date,responsible:v.responsible,memo:v.memo,userModified:true});await app.save();render();showIncidentTask(t.id);
     }
     else if(button.hasAttribute('data-u-complete')){
       const data=dataForm('incidentComplete');if(!data)return;const t=app.data.tasks.find(t=>t.id===button.dataset.uComplete),v=data.value;if(!window.safetyCoreIncident&&!progressOf(t).all)throw Error('필수 체크리스트를 완료하세요.');if(t.waitForStage&&t.deadlineKind!=='immediate'&&t.priority!=='긴급'&&!app.data.tasks.some(x=>x.sourceEventId===t.sourceEventId&&x.workflowPhase===t.waitForStage&&x.completedByUser))throw Error('안내된 선행업무를 먼저 완료하세요.');if(!validDay(v.performedOn)||v.performedOn>localToday())throw Error('실제 처리일 확인 필요');
       window.safetyValidateIncidentCompletion?.(t,v);if(['report','urgent-report'].includes(t.workflowPhase))t.submissionEvidence={...t.submissionEvidence,institution:v.institution,method:v.method||t.submissionEvidence?.method||'',receipt:v.receipt||t.submissionEvidence?.receipt||'',reportedTime:v.reportedTime||t.submissionEvidence?.reportedTime||'',submittedOn:v.performedOn,representative:v.representative||t.submissionEvidence?.representative||'',result:v.result};if(window.safetyCoreIncident){for(const c of t.checklist||[])c.done=true;app.syncChecklist(t)}Object.assign(t,{actualDate:v.performedOn,actualTime:v.performedTime||'',resultSummary:v.result,completedByUser:true,completedAt:stamp()});app.history(t.id,'실제 처리일·결과 기록 후 완료');await app.save();render();if(window.safetyIncidentCompleted)await window.safetyIncidentCompleted(t);else showIncidentTask(t.id);
     }
     else if(button.hasAttribute('data-u-calendar')){const t=app.data.tasks.find(t=>t.id===button.dataset.uCalendar);closeOverlay();app.page='work';app.originFilter='all';app.dashDate=t.finalLegalDeadline||t.beforeWorkDate||t.managementDue||t.date||t.computedBaseDeadline||localToday();app.calendarDate=parseDay(app.dashDate);app.dashTab='all';render();}
     else if(button.hasAttribute('data-u-go'))navigate(button.dataset.uGo,app.data.tasks.find(t=>t.id===button.dataset.id));
     else if(button.hasAttribute('data-u-confirm-all'))modal('확인·조치가 필요한 업무 전체',`<div class="confirmation-list">${confirmationGroups(true)}</div>`,'<button class="btn" data-close>닫기</button>','wide');
     else if(button.hasAttribute('data-u-deleted'))deletedList();
     else if(button.hasAttribute('data-u-restore')){restoreSchedule(button.dataset.uRestore);await app.save();render();deletedList();}
     else if(button.hasAttribute('data-u-resolve'))actualResolution(button.dataset.uResolve,button.dataset.event);
     else if(button.hasAttribute('data-u-resolve-save')){
       const data=dataForm('deletedResolution');if(!data)return;const {form,value:v}=data,e=app.data.triggerEvents.find(e=>e.id===form.dataset.event),r=settings().deletedTasks[form.dataset.id];if(!validDay(v.performedOn)||v.performedOn>localToday())throw Error('실제 처리일 확인 필요');e.resolvedDeleted??={};e.resolvedDeleted[r.key]={...v,recordedAt:stamp()};await app.save();showIncident(e.id);
     }
   }catch(error){toast(error.message);}finally{if(button.isConnected)button.disabled=false;}
 },true);
 // An API connection event can retry real lookups after OC is entered; OC remains private to legal.js.
 document.addEventListener('safety-law-connected',()=>{for(const e of app.data.triggerEvents.filter(e=>e.type==='accident'&&!e.closedAt))autoRefresh(e);});
 function initialize(){if(!window.safetyReady||!app.data){setTimeout(initialize,50);return;}settings();ensureSchedules();app.save().then(()=>{render();for(const e of app.data.triggerEvents.filter(e=>e.type==='accident'&&!e.closedAt))autoRefresh(e);}).catch(e=>toast(e.message));}
 window.safetyIntegration=Object.freeze({compute,refreshIncident,getOrigin,originLabel,calendarDates,restoreSchedule,conditionIssues,registry:REGISTRY,knownRefs,signature,calendar,incidentProgress});
 initialize();
})();

;
/* Runtime: incident-rules.js */
/* Reviewed, finite rule catalogue. API transport receives law references only.
 * Manual: Seoul Education, March 2025, original PDF retained in assets.
 * Unknown inputs are never silently converted to a negative determination. */
(function(root){
 'use strict';
 const D=typeof module==='object'&&module.exports?require('./deadline-engine.js'):root.SafetyDeadline;
 const Y='예',N='아니오',U='확인 필요',version='2026-10-21.1';
 const ref=(lawName,article,kind='law')=>({lawName,article:String(article),kind});
 const manual={title:'서울특별시교육청 산업안전보건업무 매뉴얼 (2025.3.)',path:'assets/safety-manual-2025.pdf',sha256:'471C4FA8A6A5D9DD9A9651C2E20580C4C5FCABFD50EABAF10A54B3A84799D349'};
 const rules={
  immediate:{title:'응급조치·위험 통제 및 필요한 작업중지·대피',kind:'immediate',pages:[47,48],refs:[ref('산업안전보건법',51),ref('산업안전보건법',54)],legal:'위험·중대재해 시 법정 안전조치 / 모든 사고의 초기 확인',steps:['응급구호와 필요한 119 신고·의료기관 이송을 먼저 실시합니다.','추가 위험을 통제하고 급박한 위험·중대재해 시 작업중지·대피 등 필요한 조치를 합니다.','현장 안전확보, 내부 비상연락 및 조치 시각을 기록합니다.']},
  assessment:{title:'사고 사실·고용관계·보고 및 보상 적용조건 확인',kind:'none',pages:[48,49,50],refs:[ref('산업안전보건법',57),ref('산업안전보건법 시행령',2),ref('산업안전보건법 시행규칙',3),ref('산업재해보상보험법',40),ref('산업재해보상보험법 시행령',27)],legal:'적용조건 확인',steps:['익명 재해자별 사망·진단된 휴업·요양기간과 동일 사고 여부를 확인합니다.','사업주·보험 적용과 보고 수행주체를 확인합니다.','미확인 질문을 보완하고 기존 제출·신청 결과를 입력하여 재판정합니다.']},
  'urgent-report':{title:'중대재해 발생 사실을 관할 노동관서에 지체 없이 보고',kind:'immediate',pages:[48,49],refs:[ref('산업안전보건법',54),ref('산업안전보건법 시행규칙',3),ref('산업안전보건법 시행규칙',67)],check:['보고','지체 없이'],legal:'산업안전보건법상 보고의무',steps:['응급조치·작업중지·대피와 병행하여 사업주의 보고 수행주체를 확인합니다.','관할 지방고용노동관서에 발생 개요·피해·조치 및 전망 등을 전화 등 적절한 방법으로 지체 없이 보고합니다.','수신기관·보고 시각·방법·증빙을 기록합니다. 조사표 제출과는 별도 의무입니다.']},
  report:{title:'산업재해조사표 작성 및 제출',kind:'months',count:1,pages:[48,49],refs:[ref('산업안전보건법',57),ref('산업안전보건법 시행규칙',73)],check:['산업재해조사표','1개월'],legal:'산업안전보건법상 보고의무',form:'별지 제30호 산업재해조사표',institution:'관할 지방고용노동관서',steps:['보고대상·사업주 및 기산점을 확인합니다. 사고일을 제외하고 휴무일을 포함한 연속 휴업 필요기간을 확인합니다.','발생 개요·원인·피해·재발방지 내용 등을 별지 제30호 산업재해조사표에 작성하고 근로자대표 확인 등 적용 절차를 이행합니다.','발생일부터 1개월 이내 관할 지방고용노동관서에 제출합니다. 기존 제출 건은 접수·내용을 확인하며 중복 제출하지 않습니다.','접수증·발송 증빙·실제 제출일 및 관련 기록을 보존합니다. 요양 신청과 별개입니다.']},
  'education-office':{title:'교육청 보고체계에 따른 보고·수행 확인',kind:'none',pages:[48,49],refs:[ref('산업안전보건법',57)],legal:'교육청 매뉴얼상 행정업무 · 적용 공문 재확인',institution:'보건안전진흥원 산업안전보건지원과 / 중대재해 시 교육청 본청 및 교육지원청 담당부서',steps:['교육청의 현행 수신부서·연락망·공문을 확인합니다.','매뉴얼상 조사표 추가 보고를 수행하고, 중대재해이면 노동관서 긴급보고와 병행하여 본청·교육지원청에 즉시 연락합니다.','보고·안내·수신 증빙을 남깁니다. 2024년 매뉴얼 인용 공문을 2026년 유효 공문으로 단정하지 않습니다.']},
  compensation:{title:'산업재해 요양급여 신청 안내 및 지원',kind:'none',pages:[50],refs:[ref('산업재해보상보험법',40),ref('산업재해보상보험법',41),ref('산업재해보상보험법 시행규칙',20),ref('산업재해보상보험법',116)],legal:'근로자의 보험급여 신청 지원 · 신청 자체는 일괄 의무 아님',institution:'근로복지공단',form:'요양급여 신청서 및 의학적 소견서',steps:['산재보험 적용과 업무상 재해·4일 이상 요양 필요 여부를 확인합니다. 요양기간은 사고일을 포함합니다.','재해자에게 요양급여 신청서·의학적 소견서와 근로복지공단 제출 절차를 안내합니다. 의료기관 대행 시 본인 동의를 확인합니다.','신청·승인·불승인 결과를 확인하고 조사표 제출은 별개로 관리합니다. 신청 지원에 임의의 법정 제출기한을 부여하지 않습니다.']},
  'public-care':{title:'공무원 재해보상 공무상 요양 신청 안내',kind:'none',pages:[50],refs:[ref('공무원 재해보상법',22)],legal:'공무원 재해보상 적용 확인·신청 안내',institution:'소속 연금취급기관 / 공무원연금공단',form:'공무상 요양 승인신청서·진단서 등 해당 서식',steps:['공무원 신분·적용 제도와 공무 관련 재해 해당 여부를 확인합니다.','소속 연금취급기관을 통한 공무상 요양 승인 신청 절차와 진단서 등을 안내합니다.','심사 결과와 추가 보완을 기록합니다. 산재보험의 4일 요건을 그대로 적용하지 않습니다.']},
  'coverage-review':{title:'보험 적용 제외·단기 요양의 사용자 보상 경로 확인',kind:'none',pages:[50],refs:[ref('근로기준법',78),ref('근로기준법',87)],legal:'추가 법령 탐색에 따른 적용 검토 · 개별 보상의무 미확정',steps:['산재보험 적용 제외인지 단순 미가입인지 구분하고 공단·소속기관에 적용 제도를 확인합니다.','근로기준법상 요양보상 및 다른 보상과의 조정 규정 적용을 검토합니다. 3일 이내 요양이라는 이유만으로 모든 보상 경로가 없다고 판단하지 않습니다.','수행주체·적용 근거·필요 지원과 개별 지급절차를 확인해 기록합니다. 미검증 의무·지급기한을 자동 확정하지 않습니다.']},
  'care-result':{title:'요양 신청 심사 결과 및 후속절차 확인',kind:'none',pages:[50],refs:[ref('산업재해보상보험법',41)],legal:'신청 후 상태관리',steps:['신청 접수·보완 요구와 승인·불승인 결과를 확인합니다.','결정 내용에 따라 요양·후속 지원을 안내합니다. 불승인만으로 이미 발생한 보고의무를 자동 취소하지 않습니다.','결정일·결과·이행 기록을 저장합니다.']},
  'lost-wages':{title:'요양으로 취업하지 못한 기간의 휴업급여 안내',kind:'none',pages:[50],refs:[ref('산업재해보상보험법',52)],legal:'보험급여 신청 안내 · 지급요건 별도 심사',institution:'근로복지공단',steps:['요양으로 취업하지 못한 기간과 휴업급여 지급요건을 확인합니다.','3일 이내 취업하지 못한 경우의 부지급 규정·증빙을 확인하고 공단 신청 절차를 안내합니다.','휴업 3일 보고기준과 혼동하지 않고 심사 결과를 기록합니다.']},
  survivors:{title:'유족급여·장례비 신청 안내 및 지원',kind:'none',pages:[50],refs:[ref('산업재해보상보험법',62),ref('산업재해보상보험법',71)],legal:'유족의 보험급여 신청 지원',institution:'근로복지공단',steps:['유족에게 적용 보험제도·수급요건과 공식 신청 창구를 안내합니다.','유족급여·장례비 관련 서류와 사업주 조력을 제공합니다.','신청·결정 결과를 기록합니다. 공무원은 별도 재해보상 유족급여 창구를 확인합니다.']},
  impairment:{title:'치유 후 장해급여 적용 확인·신청 안내',kind:'none',pages:[50],refs:[ref('산업재해보상보험법',57)],legal:'치유 후 장해가 남은 경우의 보험급여 안내',institution:'근로복지공단',steps:['치유 여부와 잔존 장해에 대한 의학적 확인을 받습니다.','공단의 장해급여 신청 요건·장해진단서 등 서류를 확인해 안내합니다.','심사·결정 결과를 기록합니다.']},
  cause:{title:'사고 원인 조사 및 재발방지계획 수립',kind:'none',pages:[48,49,54,55],refs:[ref('산업안전보건법 시행규칙',72)],legal:'산업재해 원인·재발방지 기록 / 매뉴얼상 후속조치',steps:['현장·작업·설비·절차·증언 등 필요한 사실을 조사합니다.','직접 원인과 관리 원인을 분석하여 재발방지계획을 수립합니다.','담당자·개선방법·내부 목표일과 근거를 기록합니다. 법정 고정 일수가 있는 것으로 표시하지 않습니다.']},
  improvement:{title:'위험요인 개선·작업방법 보완 및 효과 확인',kind:'none',pages:[49,55,59],refs:[ref('산업안전보건법',36)],legal:'확인된 위험 감소조치 / 적용 법조항 별도 확인',steps:['원인·평가 결과에 맞춰 시설·설비·작업방법과 관리절차를 개선합니다.','작업 재개 전 필요한 안전을 확보하고 근로자에게 변경사항을 알립니다.','개선 효과·현장 확인·증빙 및 미흡사항을 기록합니다.']},
  risk:{title:'수시 위험성평가 필요 · 관련 작업 재개 전 실시',kind:'before',pages:[49,54,55],refs:[ref('산업안전보건법',36),ref('산업안전보건법 시행규칙',37),ref('사업장 위험성평가에 관한 지침',15,'admrul')],check:['작업'],legal:'관련 작업 시작 전 수시평가',steps:['재해 발생 관련 작업·재개 일시와 평가 범위를 확인합니다. 재개일 미상일 때 임의의 일정을 만들지 않습니다.','근로자 참여하에 유해·위험요인을 파악·평가하고 감소대책을 수립·실행합니다.','관련 작업 시작 전에 평가와 조치·공유를 완료하고 결과를 기록합니다.','매뉴얼의 과거 1개월 안내와 2026년 시행규칙 제37조 기준의 차이를 확인하고 사고 당시 법령을 우선합니다.']},
  muscle:{title:'수시 근골격계 유해요인조사 실시',kind:'months',count:1,pages:[49,58,59],refs:[ref('산업안전보건기준에 관한 규칙',657)],check:['유해요인','1개월'],legal:'해당 수시조사 사유 발생일부터 1개월',steps:['제657조제2항의 수시조사 사유·발생일과 질병 사유에만 적용되는 최근 1년 조사·개선 예외를 확인합니다.','근로자 참여하에 유해요인조사를 실시하고 개선조치를 마련합니다.','결과 공유·관련 교육 및 개선 확인을 실시합니다. 정기 3년 조사와 별도로 관리합니다.']},
  education:{title:'변경 작업·평가 결과 공유 및 필요한 안전보건교육',kind:'none',pages:[43,44,55,59],refs:[ref('산업안전보건법',29),ref('산업안전보건법',36)],legal:'필요 교육·결과 공유 · 종류·시간은 적용조건 확인',steps:['작업 변경·신규 작업·특별교육 대상 등 교육 요건을 확인합니다.','필요한 교육과 위험성평가·유해요인조사 결과 공유를 실시합니다.','교육 종류·시간·참석·내용과 실시 결과를 기록합니다. 사고만으로 모든 법정교육을 추가하지 않습니다.']},
  preservation:{title:'현장 훼손 금지·원인조사 협조 및 증거 보존',kind:'immediate',pages:[48,49],refs:[ref('산업안전보건법',56)],legal:'중대재해 현장 훼손·원인조사 방해 금지',steps:['구호·위험 제거를 우선하면서 사고 관련 현장·자료를 보존합니다.','사업주 등에게 현장 훼손·원인조사 방해 금지와 관계기관 조사 협조를 안내합니다.','필요한 안전조치로 현장을 변경할 경우 이유·시각·사진 등 기록을 남깁니다.']},
  'serious-system':{title:'중대산업재해 적용범위·재발방지 체계 점검',kind:'none',pages:[71,72],refs:[ref('중대재해 처벌 등에 관한 법률',2),ref('중대재해 처벌 등에 관한 법률 시행령',2),ref('중대재해 처벌 등에 관한 법률',3),ref('중대재해 처벌 등에 관한 법률',4),ref('중대재해 처벌 등에 관한 법률',5)],legal:'경영책임자등 의무 적용범위 별도 확인',steps:['중대산업재해 정의 충족과 법 적용범위·사업 지배·운영·관리 책임을 구분하여 확인합니다.','학교 인원만으로 법 적용이나 형사책임을 단정하지 않고 경영책임자등의 재발방지·안전보건관리체계를 점검합니다.','도급의 실질적 지배·운영·관리 여부와 관계기관 요구를 확인해 조치합니다.']},
  'executive-education':{title:'경영책임자등 안전보건교육 통지·이행 확인',kind:'none',pages:[71,72],refs:[ref('중대재해 처벌 등에 관한 법률',8),ref('중대재해 처벌 등에 관한 법률 시행령',6)],legal:'법 적용 및 교육 통지 확인 후 수행',steps:['중대산업재해 발생 법 적용 사업장과 교육 대상·통지를 확인합니다.','통지된 일정·기관·방법에 따라 대상자가 교육을 이행하도록 안내합니다.','통지서와 이수 결과를 보존합니다. 미통지 상태의 법정 교육일을 임의로 만들지 않습니다.']},
  'muscle-program':{title:'근골격계질환 예방관리 프로그램 수립·시행',kind:'none',pages:[59],refs:[ref('산업안전보건기준에 관한 규칙',662)],legal:'법정 집단발생 요건 또는 장관 명령 시 의무',steps:['업무상 인정 근골격계질환의 연간 발생 수와 사업장 근로자 수·발생 비율 또는 장관 명령을 확인합니다.','연간 10명 이상 또는 5명 이상이면서 10% 이상인 경우 등 해당 요건에 따라 노사협의를 거쳐 프로그램을 작성·시행합니다.','조사·교육·작업환경 개선과 결과를 기록합니다. 명령에 기한이 있으면 별도로 확인합니다.']},
  records:{title:'산업재해 발생·원인·재발방지 기록 작성 및 보존',kind:'none',pages:[49],refs:[ref('산업안전보건법',164),ref('산업안전보건법 시행규칙',72)],legal:'산업재해 기록 3년 보존',steps:['사업장·재해자·발생 일시·장소·원인·과정·재발방지계획을 기록합니다.','조사표 사본 또는 요양신청서 사본과 재발방지계획 등 법정 대체기록 요건을 확인합니다.','확인된 기록 작성일부터 3년 보존 종료일을 관리하고 연관 자료를 보존합니다. 자동 파기하지 않습니다.']},
  'risk-records':{title:'위험성평가 결과·조치 기록 및 보존',kind:'none',pages:[55],refs:[{...ref('산업안전보건법 시행규칙',37),branch:'4'}],legal:'위험성평가 기록 3년 보존',steps:['평가 대상·위험성 결정·감소조치 등 결과를 기록합니다.','실제 평가·기록 작성일을 확인하고 3년 보존기간을 관리합니다.','공유·개선 이력과 증빙을 보존하고 자동 파기하지 않습니다.']},
  'muscle-records':{title:'유해요인조사·개선 결과 기록 보존',kind:'none',pages:[59],refs:[ref('산업안전보건기준에 관한 규칙',657)],legal:'매뉴얼상 5년 보존 관리 · 법정 일률 5년으로 단정하지 않음',steps:['조사·개선·공유 결과와 실제 기록 작성일을 확인합니다.','매뉴얼의 5년 보존 안내와 기관 기록물 관리기준을 대조하여 보존 종료일을 관리합니다.','정기·수시 조사 기록을 구분하며 자동 파기하지 않습니다.']}
 };
 const num=x=>x!==''&&x!=null&&Number.isFinite(Number(x))&&Number(x)>=0?Number(x):null;
 const day=s=>{try{D.parse(s);return true}catch{return false}};
 function victims(v){try{const a=typeof v.victimsJson==='string'?JSON.parse(v.victimsJson):v.victims;if(Array.isArray(a)&&a.length)return a;}catch{}return [{death:v.death,leave:v.leave,leaveDays:v.leaveDays,leaveStart:v.leaveStart,leaveEnd:v.leaveEnd,care:v.care,careDays:v.careDays,careMonths:v.careMonths,careStart:v.careStart,careEnd:v.careEnd}];}
 function period(x,prefix,accident){
  const yes=x[prefix],explicit=num(x[prefix+'Days']),start=x[prefix+'Start'],end=x[prefix+'End'];
  let ranged=null,issue='';
  if(start&&end){if(!day(start)||!day(end)||end<start)issue='기간 시작·종료일 역전 또는 잘못된 날짜';else {const from=prefix==='leave'&&start<=accident?D.shift(accident,1):start;ranged=Math.max(0,D.days(end,from)+1);}}
  if(explicit!=null&&ranged!=null&&explicit!==ranged)issue='입력 일수와 날짜 구간이 다름: 의학적 필요기간 확인';
  if(yes===N&&(explicit>0||ranged>0))issue='필요 없음과 입력 기간이 서로 모순됨';
  return {days:issue?null:explicit??ranged??(yes===N?0:null),issue};
 }
 function analyze(e){
  const v=e.data||{},questions=[],audit=[],people=victims(v),rows=people.map((x,i)=>{const leave=period(x,'leave',e.date),care=period(x,'care',e.date);if(leave.issue)questions.push('재해자 '+(i+1)+' 휴업: '+leave.issue);if(care.issue)questions.push('재해자 '+(i+1)+' 요양: '+care.issue);return {...x,leaveCount:leave.days,careCount:care.days,careMonths:num(x.careMonths)};});
  const decision=(key,value,reason)=>{audit.push({key,value,reason});return value};
  const dead=rows.some(x=>x.death===Y)||v.death===Y,deathKnown=dead||rows.every(x=>x.death===N);
  const same=v.sameAccident||U,simultaneous=v.simultaneous||U;
  const atLeast=m=>rows.filter(x=>(x.injuryKind==='부상'||!x.injuryKind&&v.nature==='사고성 재해')&&(x.careMonths>=m||day(x.careStart)&&day(x.careEnd)&&x.careEnd>=D.calculate({kind:'months',base:x.careStart,count:m,includeFirst:true,holidayExtension:false}).computedBaseDeadline)).length;
  const injuryCount=num(v.injuredCount)??rows.length;
  const oshYes=dead||simultaneous===Y&&(atLeast(3)>=2||injuryCount>=10);
  const oshKnown=deathKnown&&(rows.length===1&&injuryCount<10||simultaneous===N||simultaneous===Y&&rows.every(x=>x.careMonths!=null||x.careCount===0));
  const osh=decision('oshSerious',v.workRelated===N?N:v.serious===Y?Y:oshYes?Y:oshKnown?N:U,'사망 1명 / 동시 3개월 이상 요양 부상 2명 / 동시 부상·직업성 질병 10명');
  const diseaseNum=num(v.sameFactorDiseaseCount),diseaseCriterion=v.listedDisease===Y&&v.sameFactor===Y&&v.diseaseWithinYear===Y&&diseaseNum>=3;
  const seriousYes=dead||same===Y&&atLeast(6)>=2||diseaseCriterion;
  const seriousKnown=deathKnown&&(rows.length===1||same===N||same===Y&&rows.every(x=>x.careMonths!=null||x.careCount===0))&&(v.nature==='사고성 재해'||v.listedDisease===N||diseaseNum!=null&&diseaseNum<3);
  const serious=decision('punishmentSerious',v.workRelated===N?N:seriousYes?Y:seriousKnown?N:U,'동일 사고 6개월 치료 2명 / 동일 유해요인 법정 직업성 질병 1년 이내 3명 / 사망 1명');
  if(v.serious===Y&&osh!==Y||v.serious===N&&osh===Y)questions.push('수동 중대재해 표시와 피해정보가 다름: 긴급 확인');
  const workRelated=v.workRelated===N?N:v.workRelated===Y||v.recognition===Y?Y:U;
  if(workRelated===U)questions.push('업무 관련성과 산업재해 해당 여부 확인');
  if(v.employment==null||v.employment===U)questions.push('재해자 고용관계와 사업주의 수행주체 확인');
  if(!v.place||v.place===U)questions.push('사고 발생 장소 확인');
  if(!v.nature||v.nature===U)questions.push('부상·질병 구분 확인');
  const reportFact=dead||rows.some(x=>x.leaveCount>=3)?Y:deathKnown&&rows.every(x=>x.leaveCount!=null)?N:U;
  const report=decision('report',workRelated===N?N:reportFact===Y?Y:reportFact,'사고일 제외·휴무일 포함, 의학적으로 연속 3일 이상 휴업 필요 또는 사망');
  if(report===U)questions.push(rows.some(x=>x.leaveCount==null)?'의사 소견에 따른 연속 휴업 필요기간 확인':'조사표 제출 해당 여부 확인 필요');
  if(v.reportConfirmed===N&&report===Y)questions.push('보고대상 아님 표시와 휴업·사망 정보 충돌: 보고 검토 필요');
  const publicEmployee=v.employment==='공무원·교원'||v.insurance==='공무원 재해보상';
  const careFact=rows.some(x=>x.careCount>=4||x.careMonths>=1)?Y:rows.every(x=>x.careCount!=null)?N:U;
  const care=decision('compensation',publicEmployee?N:workRelated===N?N:careFact,'산재보험 적용 확인 + 사고일 포함 4일 이상 요양');
  if(careFact===U&&!publicEmployee)questions.push('의학적으로 필요한 요양기간 확인 (휴업일수와 별개)');
  if(care===Y&&v.insurance!==Y)questions.push('산재보험 적용 여부 확인 후 요양급여 지원');
  if(osh===U)questions.push('동시 피해자 수·3개월 요양과 산업안전보건법상 중대재해 기준 확인');
  if(serious===U)questions.push('동일 사고 6개월 치료·법정 직업성 질병 집단발생 확인');
  const isMuscle=v.musculoskeletal===Y||v.muscleRequired===Y||v.muscleReason==='질환 발생·업무상 질병 인정';
  const change=['새 작업·설비 도입','작업환경 변경'].includes(v.muscleReason);
  const diseaseTrigger=isMuscle&&(v.recognition===Y||v.temporaryExamDiagnosis===Y),exception=v.muscleException===Y;
  const muscle=decision('muscle',change?(v.burdenWork===Y?Y:v.burdenWork===N?N:U):diseaseTrigger?(exception?N:v.muscleException===N?Y:U):isMuscle?U:N,'업무상 근골격계질병 인정 또는 부담작업 신규·변경. 질병 사유만 최근 1년 조사·개선 예외 검토');
  if(muscle===U)questions.push('유해요인조사 사유·질병 인정·최근 1년 조사 및 개선조치·부담작업 확인');
  const risk=decision('risk',workRelated===Y?Y:workRelated===N?v.riskRequired===Y?Y:N:U,'산업재해 발생에 따른 관련 작업의 수시평가 · 2026년 시행규칙 제37조');
  if(risk===Y&&!day(v.restartDate))questions.push('관련 작업 재개 일시 확인: 수시 위험성평가는 재개 전에 완료');
  if(v.nature==='업무상 질병'&&report===Y&&!(v.reportBasisConfirmed===Y&&day(v.reportBaseDate)&&v.reportBasisEvidence))questions.push('업무상 질병의 발생·인지 경위와 보고 기산점·공식 해석 근거 확인');
  if(v.lateRecognition===Y)questions.push('뒤늦은 산재 확인: 발생일부터 보고 원칙 유지, 인지일 특례는 공식 근거·적용조건 별도 확인');
  return {version,rows,osh,serious,report,care,publicEmployee,workRelated,muscle,risk,questions:[...new Set(questions)],audit};
 }
 function plan(e){
  const v=e.data||{},a=analyze(e),out=[],contractor=v.employment==='수급업체 소속',party=contractor?'수급업체 사업주 수행 · 학교 관리감독자는 안내·이행 확인':a.publicEmployee?'소속기관 담당자·공무원(적용제도별 확인)':'사업주·학교 담당자 (권한·위임 확인)';
  function add(stage,reason,extra={}){const r=rules[stage];out.push({stage,code:stage==='report'?'ACC-102':stage==='urgent-report'?'ACC-104':stage==='risk'?'RSK-301':stage==='muscle'?'ADD-023':'ACC-101',action:r.title,date:r.kind==='immediate'?e.date:stage==='assessment'?(e.registeredOn||(e.createdAt?new Date(Date.parse(e.createdAt)+9*3600000).toISOString().slice(0,10):e.date)):'',requiresReview:false,deadlineKind:r.kind==='immediate'?'immediate':r.kind==='none'?'none':'unconfirmed',obligationType:r.legal,triggerCondition:reason,triggerDate:e.date,deadlineType:r.kind,deadlineValue:r.count||null,applicableLaw:r.refs,manualReference:{...manual,pages:r.pages},responsibleParty:party,actionRequired:r.steps,workflowForms:r.form||'',submissionInstitution:r.institution||'',checklist:r.steps.slice(0,4),sourceVersion:version,...extra});}
  add('immediate','모든 사고의 초기 대응 확인',{priority:'긴급'});
  add('assessment',a.questions.length?a.questions.join(' / '):'필수 입력과 각 법률의 적용조건을 점검했습니다.',{requiresReview:a.questions.length>0});
  add('determination','사실 확인 후 법률별 적용조건을 별도로 판단',{requiresReview:a.questions.length>0});
  if(a.report===U)add('report','휴업 필요일수·사망 여부 확인 후 제출 여부 재판정',{requiresReview:true,action:'산업재해조사표 제출 여부 확인 필요'});
  if(a.osh===Y||v.serious===Y||v.serious==='의심'){
   add('urgent-report',a.osh===Y?'산업안전보건법 시행규칙 제3조 중대재해 기준 충족':'피해 정보와 수동 표시 확인 필요: 긴급보고 해당 여부 즉시 확인',{requiresReview:a.osh!==Y,priority:'긴급'});
   add('preservation','산업안전보건법상 중대재해 발생 또는 의심',{requiresReview:a.osh!==Y,priority:'긴급'});
  }
  if(a.report===Y)add('report',a.rows.some(x=>x.death===Y)||v.death===Y?'사망 발생에 따른 조사표 보고':'의사 소견 등에 따른 연속 3일 이상 휴업 필요 (사고일 제외)',{action:contractor?'수급업체 산업재해조사표 제출 안내·이행 확인':rules.report.title,requiresReview:a.workRelated!==Y});
  if(a.report===Y||a.osh===Y)add('education-office','보고대상 재해: 매뉴얼의 추가 수신기관과 현행 공문 확인',{deadlineKind:a.osh===Y?'immediate':'none',date:a.osh===Y?e.date:'',requiresReview:true,priority:a.osh===Y?'긴급':'높음'});
  if(a.publicEmployee&&a.workRelated!==N&&(v.death!==Y))add('public-care','공무원·교원 또는 공무원 재해보상제도 적용',{requiresReview:a.workRelated!==Y});
  if(a.care===Y&&!a.publicEmployee&&v.insurance!==N)add('compensation','휴업과 별개로 4일 이상 요양 필요',{requiresReview:v.insurance!==Y||a.workRelated!==Y,action:contractor?'수급업체 근로자 요양급여 신청 지원·업체 조력 확인':rules.compensation.title});
  if(!a.publicEmployee&&a.workRelated!==N&&(v.insurance===N||a.rows.some(x=>x.careCount>0&&x.careCount<=3)))add('coverage-review','산재보험 적용 제외 입력 또는 3일 이내 요양: 사용자 보상 경로 적용 검토',{requiresReview:true});
  if(v.applicationSubmitted===Y)add('care-result','요양급여·공무상 요양 신청이 실제 접수됨',{applicableLaw:a.publicEmployee?rules['public-care'].refs:rules['care-result'].refs});
  if(!a.publicEmployee&&v.insurance===Y&&a.workRelated!==N&&v.unableWorkForCare===Y)add('lost-wages','요양으로 취업하지 못한 기간이 있음: 급여 지급요건 별도 확인');
  if(v.death===Y||a.rows.some(x=>x.death===Y))add('survivors','사망 발생: 유족에 대한 제도별 신청 안내',{applicableLaw:a.publicEmployee?[ref('공무원 재해보상법',35)]:rules.survivors.refs,submissionInstitution:a.publicEmployee?'소속 연금취급기관 / 공무원연금공단':'근로복지공단',action:a.publicEmployee?'공무원 재해보상 유족급여 등 신청 안내':rules.survivors.title});
  if(!a.publicEmployee&&v.insurance===Y&&v.treatmentEnded===Y&&v.remainingDisability===Y)add('impairment','치유 후 장해가 남은 것으로 확인됨');
  if(a.workRelated===Y||a.report===Y||a.osh===Y||v.preventionRequired===Y){add('cause','산업재해 원인·재발방지 기록 및 매뉴얼 후속조치');if(v.hazardsRemain!==N||v.preventionRequired===Y||a.osh===Y)add('improvement','사고 관련 위험 감소·개선 및 효과 확인',{waitFor:'cause'});add('records','산업재해 발생·원인·재발방지 기록 보존',{retentionYears:3,retentionBasis:'산업안전보건법 제164조·시행규칙 제72조'});}
  if(a.risk===Y){add('risk','산업재해가 발생한 관련 작업의 수시평가',{beforeWorkDate:day(v.restartDate)?v.restartDate:''});add('risk-records','실시한 수시 위험성평가의 결과·조치 기록 보존',{waitFor:'risk',retentionYears:3,retentionBasis:'시행규칙 제37조의4'});}
  if(a.muscle===Y){add('muscle',v.muscleReason||'업무상 근골격계질병 인정',{triggerDate:v.muscleBaseDate||v.recognitionDate||''});add('muscle-records','수시 유해요인조사 및 개선 결과 보존',{waitFor:'muscle',retentionYears:5,retentionBasis:'매뉴얼 p.59의 행정상 보존 안내 · 기관 기준 대조 필요'});}
  const annual=num(v.annualMuscleCount),workers=num(v.workforceCount);
  if(annual>=10||annual>=5&&workers>0&&annual/workers>=0.1||v.muscleProgramOrder===Y)add('muscle-program','제662조의 연간 인정 질환 집단발생 요건 또는 장관 명령 해당');
  if(v.educationRequired===Y||a.risk===Y||a.muscle===Y)add('education',v.educationRequired===Y?'사고 관련 필요한 교육 적용 확인':'평가·조사 결과 공유 및 필요한 변경 작업 교육');
  if(a.serious===Y){add('serious-system','중대재해처벌법 제2조의 중대산업재해 정의 충족; 적용범위·책임주체 별도 검토',{requiresReview:v.seriousActScope!==Y});if(v.seriousActScope===Y)add('executive-education','법 적용대상 중대산업재해 발생: 교육 통지·이행 확인',{requiresReview:v.executiveNotice!==Y,date:v.executiveNotice===Y?v.executiveEducationDate||'':''});}
  add('followup-check','사건별 적용업무 이행 및 기관 보완 요구 확인');
  add('final-check','필수 후속조치 완료 후 최종 점검',{waitFor:'followup-check'});
  if(out.some(p=>p.stage==='improvement'))add('improvement-check','실제 개선조치 후 효과와 추가 위험 확인',{waitFor:'improvement'});
  const keep=new Set(['immediate','report','risk','risk-records','urgent-report','cause','improvement','improvement-check','compensation','public-care','survivors','impairment','lost-wages','muscle','muscle-program']);
  const plans=out.filter(p=>keep.has(p.stage)&&(p.stage!=='report'||a.report==='예'&&a.workRelated==='예')&&(p.stage!=='urgent-report'||a.osh==='예'&&a.workRelated==='예')&&(p.stage!=='compensation'||v.insurance==='예'&&a.workRelated==='예'));
  for(const p of plans){if(p.stage==='improvement'){p.waitFor='';p.action='필요한 개선조치 검토 및 착수';p.triggerCondition='확인된 위험요인을 제거하고 작업 재개 조건에 필요한 조치를 착수합니다.'}if(['risk','risk-records'].includes(p.stage)&&e.date<'2026-08-01'){p.requiresReview=true;p.triggerCondition='사고 당시 시행 법령의 수시평가 적용조건·기한 별도 확인 필요'}}
  return {analysis:a,plans};
 }
 rules.determination={title:'산업재해 보고대상 및 중대재해 여부 판단',kind:'none',pages:[48,49],refs:[ref('산업안전보건법 시행규칙',3),ref('산업안전보건법 시행규칙',73)],legal:'입력조건 분석·확인 업무',steps:['재해자별 휴업·요양·사망 및 업무 관련성을 확인합니다.','조사표 제출과 중대재해 긴급보고, 보상제도를 각각 판정합니다.','미확인 조건을 보완하고 판단 결과와 근거를 기록합니다.']};
 rules['followup-check']={title:'관계기관 보고 및 후속조치 이행 확인',kind:'none',pages:[48,49,50],refs:[ref('산업안전보건법',57)],legal:'내부 이행 점검 · 고정 법정기한 없음',steps:['대상으로 판정된 기관별 보고·신청·개선의 실제 이행을 확인합니다.','누락·보완 요구와 미완료 업무를 처리합니다.','확인한 증빙과 남은 조치 여부를 기록합니다.']};
 rules['final-check']={title:'최종 점검 및 사건 처리 완료',kind:'none',pages:[48,49,50],refs:[ref('산업안전보건법',57)],legal:'내부 종결 점검 · 고정 법정기한 없음',steps:['모든 적용업무의 처리 결과와 증빙을 점검합니다.','미확인 조건과 보완 요청이 해소되었는지 확인합니다.','보존할 자료와 최종 점검 결과를 입력한 후 사건을 종결합니다.']};
 rules.cause.title='사고원인 조사 및 재발방지';rules.cause.steps=['사고가 발생한 작업·설비·절차와 원인·발생과정을 확인합니다.','재발방지계획을 수립하고 담당자·개선방법을 정합니다.','산업재해 발생·원인·재발방지계획을 기록하고 관계 법령의 보존 기준에 따라 보관합니다.'];
 rules['improvement-check']={title:'개선 결과 및 추가 위험 확인',kind:'none',pages:[49,55],refs:[ref('산업안전보건법',36)],legal:'실제 개선조치 후 효과 확인 · 별도 고정 법정기한 없음',steps:['실제로 이행한 개선조치의 효과를 확인합니다.','추가 위험·미흡사항을 확인하고 필요한 조치를 기록합니다.']};
 rules.immediate.title='응급조치·현장 안전확보';rules['risk-records'].title='평가 결과 기록·공유 및 감소대책 확인';rules['risk-records'].refs.push({...ref('산업안전보건법 시행규칙',37),branch:'3'});rules.cause.refs=[ref('산업안전보건법',57),ref('산업안전보건법 시행규칙',72)];
 const api={version,rules,manual,analyze,plan,victims,period};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.SafetyIncidentRules=Object.freeze(api);
})(typeof window!=='undefined'?window:globalThis);

;
/* Runtime: incident-final.js */
/* Conditional navigator layered over existing storage, sync and deletion APIs. */
(()=>{
 'use strict';
 const R=SafetyIncidentRules,D=SafetyDeadline,I=safetyIntegration,esc=x=>escapeHtml(String(x??''));
 const valid=s=>{try{D.parse(s);return true}catch{return false}};
 function base(e,stage){const v=e.data||{};if(stage==='risk')return v.restartDate||'';if(stage==='muscle')return v.muscleBaseDate||v.recognitionDate||'';if(stage==='report'&&v.nature!=='사고성 재해')return v.reportBasisConfirmed==='예'&&v.reportBasisEvidence?v.reportBaseDate||'':'';return e.date;}
 function issues(e,stage){const v=e.data||{},a=R.analyze(e),list=[];
  if(!v.employment||v.employment==='확인 필요')list.push('보고·조치 수행주체 확인 필요');
  if(['report','urgent-report','risk','muscle'].includes(stage)&&a.workRelated!=='예')list.push('업무 관련성·적용대상 확인 필요');
  if(stage==='report'){
   if(a.report!=='예')list.push('산업재해조사표 보고 조건 확인 필요');
   if(v.reportSpecial!=='아니오')list.push('최초 재해 제출명령 등 특례 검토 필요');
   if(v.reportConfirmed==='아니오')list.push('보고대상 부정 표시와 피해정보 충돌');
   if(v.lateRecognition==='예'&&v.reportBasisConfirmed!=='예')list.push('뒤늦은 산재 확인의 기산점·공식 해석 확인 필요');
   if(v.nature!=='사고성 재해'&&!(v.reportBasisConfirmed==='예'&&v.reportBasisEvidence))list.push('질병 기산점 공식 근거 확인 필요');
  }
  if(stage==='urgent-report'&&a.osh!=='예')list.push('산업안전보건법상 중대재해 기준 확인 필요');
  if(stage==='risk'&&!valid(v.restartDate))list.push('관련 작업 재개 일시 확인 필요: 재개 전 완료');
  if(stage==='muscle'&&a.muscle!=='예')list.push('수시조사 사유·예외 적용 확인 필요');
  if(['risk','risk-records'].includes(stage)&&e.date<'2026-08-01')list.push('등록 규칙은 2026-08-01 시행본 기준: 과거 사고 당시 적용 규칙·기한을 별도 대조하고 담당자 근거로 확정');
  if(stage==='muscle'&&e.date<'2024-06-28')list.push('수시조사 1개월 규칙 개정 전 사유: 당시 시행본의 기한 별도 검토 필요');
  if(stage==='compensation'&&(v.insurance!=='예'||a.workRelated!=='예'))list.push('산재보험·업무 관련성 확인 필요');
  if(stage==='education-office'&&!(v.officeDirective&&v.officeSourceUrl))list.push('매뉴얼 보고체계와 현행 교육청 공문 대조 필요');
  if(['months','before'].includes(R.rules[stage]?.kind)&&!valid(base(e,stage)))list.push('법정 기산점 미확정');
  return list;
 }
 for(const [stage,r] of Object.entries(R.rules)){
  I.registry[stage]={kind:r.kind,count:r.count,label:r.kind==='months'?'해당 법정 기준일부터 1개월 이내':r.kind==='before'?'관련 작업 시작·재개 전 완료':r.kind==='immediate'?'즉시·지체 없이 (일수 환산 없음)':'별도 고정 법정기한 없음',refs:r.refs,check:r.check||[],baseFor:e=>base(e,stage),conditions:e=>issues(e,stage),asOf:e=>e.date};
  for(const ref of r.refs)if(!I.knownRefs.some(x=>JSON.stringify(x)===JSON.stringify(ref)))I.knownRefs.push(ref);
 }
 incidentPlan=function(e){const {analysis:a,plans}=R.plan(e);
  for(const p of plans){
   const r=I.compute(e,p.stage);p.deadlineResult=r;p.triggerDate=base(e,p.stage);p.deadlineRule={...r.rule,label:I.registry[p.stage].label,ruleId:p.stage};
   if(p.stage==='risk')p.beforeWorkTime=e.data?.restartTime||'';p.calculatedDeadline=r.computedBaseDeadline||'';p.finalLegalDeadline=r.finalLegalDeadline||'';p.dueDate=p.finalLegalDeadline;
   p.requiresReview=p.requiresReview||issues(e,p.stage).length>0;
   p.legalDeadline=I.registry[p.stage].label;p.legalVerification=r.legalVerificationStatus==='verified'?'법령기준 자동 검증 완료':e.legalBundles?.[p.stage]?.error?'API 조회 실패':e.legalBundles?.[p.stage]?.changed?'법령 개정 재검토 필요':'추가 조건 확인 필요';
   p.verificationStatus=p.legalVerification;p.manualVerification=['coverage-review','lost-wages','survivors','impairment','executive-education','muscle-program'].includes(p.stage)?'추가 법령 탐색 · 매뉴얼 일반 안내와 구분':'공식 매뉴얼 근거 확인';
   // No incident-date fallback for undated statutory/benefit obligations.
   if(['months','before'].includes(p.deadlineType)){p.date=r.finalLegalDeadline||r.managementDue||'';p.deadlineKind=r.finalLegalDeadline?'legal':'unconfirmed';}
   if(p.stage==='education-office'&&e.data?.officeTarget)p.date=e.data.officeTarget;if(p.stage==='cause'&&valid(e.data?.followupTarget))p.date=e.data.followupTarget;
   if(p.stage==='assessment')p.requiresReview=a.questions.length>0;
  }return plans;
 };
 const syncBefore=syncIncident;
 syncIncident=function(e){if(e?.type!=='accident')return syncBefore(e);const previous=e.conditionAudit?.signature;const assessed=R.plan(e),signature=I.signature(e);
  if(previous&&previous!==signature){e.conditionHistory??=[];e.conditionHistory.push({at:new Date().toISOString(),audit:e.conditionAudit});}
  e.conditionAudit={signature,version:R.version,questions:assessed.analysis.questions,decisions:assessed.analysis.audit,checkedAt:previous===signature?e.conditionAudit.checkedAt:new Date().toISOString()};
  syncBefore(e);
  const plans=new Map(incidentPlan(e).map(p=>[p.stage,p]));
  for(const t of app.data.tasks.filter(t=>t.sourceEventId===e.id&&t.workflowKind==='incident')){
   const p=plans.get(t.workflowPhase);
   if(!p){t.workflowInactive=true;t.inactiveReason='현재 조건상 비대상 · 완료·수정 이력 보존';continue;}
   t.workflowInactive=false;delete t.inactiveReason;
   // Preserve the original completion evidence and calculation snapshot.
   if(t.completedByUser){if(t.deadlineInputSignature&&t.deadlineInputSignature!==signature)t.completedRecheck='사고정보 변경: 완료 당시 기록 보존, 현재 조건 재확인 필요';}
   else {
    for(const k of ['beforeWorkTime','triggerCondition','triggerDate','deadlineType','deadlineValue','applicableLaw','manualReference','responsibleParty','verificationStatus','actionRequired','sourceVersion','submissionInstitution','retentionYears','retentionBasis','manualVerification'])t[k]=p[k];
    t.calculatedDeadline=p.calculatedDeadline;t.sourceVersion={ruleVersion:R.version,applied:t.legalEffectiveDate||'API 확인 필요',manual:'2025.3.'};
    if(!t.manualOverride?.finalLegalDeadline)t.finalLegalDeadline=p.finalLegalDeadline;
    if(!t.userModified)t.date=t.managementDue=p.date||'';
    t.deadlineInputSignature=signature;
   }
   if(p.retentionYears){
    const explicit=e.data?.[p.stage.replaceAll('-','_')+'Date'];
    const recordDate=valid(explicit)?explicit:t.completedByUser&&valid(t.actualDate)?t.actualDate:'';
    t.recordCreatedOn=recordDate;t.retentionYears=p.retentionYears;t.retentionBasis=p.retentionBasis;
    t.retentionEnd=recordDate?D.calculate({kind:'years',base:recordDate,count:p.retentionYears,includeFirst:false,holidayExtension:false}).computedBaseDeadline:'';
    t.retentionVerification='확인된 기록 작성일 기준 보존 관리 · 기산점·기관 기록물 기준 검토 필요';
   }
  }
 };
 const closeBefore=incidentCanClose;
 incidentCanClose=function(e){return R.analyze(e).questions.length===0&&closeBefore(e);};
 const confirmBefore=confirmationItems;
 confirmationItems=function(){
  const prior=confirmBefore().filter(x=>x.group!=='incident');
  for(const e of app.data.triggerEvents.filter(e=>e.type==='accident'&&!e.closedAt))for(const question of window.safetyCoreIncident?.questions(e)||[])
   prior.push({key:'input|'+e.id+'|'+question,eventId:e.id,group:'incident',title:question,status:'미확인',action:'사고정보를 입력하면 업무를 자동 갱신합니다.',date:e.date,route:'incident-input'});
  return prior;
 };
 const detailBefore=showIncident;
 showIncident=function(id){detailBefore(id);const e=app.data.triggerEvents.find(e=>e.id===id),box=document.querySelector('[data-incident-detail]');if(!e||!box)return;const a=R.analyze(e);
  box.insertAdjacentHTML('afterbegin',`<section class="incident-decision"><b>조건 판정</b><p>산업안전보건법상 중대재해: ${esc(a.osh)} · 중대재해처벌법상 중대산업재해: ${esc(a.serious)}<br>조사표 보고대상: ${esc(a.report)} · 산재보험 요양 4일 조건: ${esc(a.care)}${a.publicEmployee?' (공무원 제도 별도)':''}</p>${a.questions.length?'<b>추가 확인 질문</b><ul>'+a.questions.map(q=>'<li>'+esc(q)+'</li>').join('')+'</ul>':'<p>필수 판정조건 확인됨. 법령·특례 검증 상태는 개별 업무에서 확인하세요.</p>'}<details><summary>조건별 적용·제외 판단과 이전 이력</summary>${a.audit.map(x=>'<p>'+esc(({oshSerious:'중대재해',punishmentSerious:'중대산업재해',report:'조사표',compensation:'요양급여',muscle:'수시 유해요인조사',risk:'수시 위험성평가'})[x.key])+': '+esc(x.value)+' · '+esc(x.reason)+'</p>').join('')}<p>이전 조건판정 이력: ${e.conditionHistory?.length||0}건</p></details></section>`);
  for(const [i,t] of I.incidentProgress(e).tasks.entries()){
   const step=box.querySelectorAll('.incident-stages > li')[i];if(!step)continue;
   const p=step.querySelector('p');if(p&&t.deadlineType==='none')p.innerHTML=`${esc(t.obligationType)} · ${statusBadge(statusOf(t))}<br>별도 고정 법정기한 없음 · 내부 목표 ${esc(t.managementDue||'미지정')}<br>${esc(t.verificationStatus||'추가 조건 확인 필요')}`;
   step.insertAdjacentHTML('beforeend',`<p class="subtle">발생 이유: ${esc(t.triggerCondition||'완료 당시 기록 확인')}<br>수행: ${esc(t.responsibleParty||'담당자 확인')}${'<br>'+esc(t.verificationStatus||'추가 조건 확인 필요')}${t.retentionYears?'<br>보존 종료 확인: '+esc(t.retentionEnd||'실제 기록 작성일 확인 필요'):''}</p>`);
  }
 };
 window.safetyIncidentDetailEnhance=function(t){
  const box=document.querySelector('.incident-task-drawer .drawer-body');if(!box)return;const e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId),r=R.rules[t.workflowPhase];if(!r)return;
  const heads=[...box.querySelectorAll(':scope > h4')];
  const checks=heads[1],deadline=heads[0],methods=heads[2],links=heads[3],complete=heads[4];
  // Move the checklist section ahead of the deadline section, preserving handlers.
  const chunk=[];for(let n=checks;n&&n!==methods;){const next=n.nextSibling;chunk.push(n);n=next;}for(const n of chunk)box.insertBefore(n,deadline);
  checks.textContent='① 지금 해야 할 업무';deadline.textContent='③ 언제까지 해야 하는가';methods.textContent='④ 실제 처리방법';links.textContent='⑤ 관련 기능 연결';complete.textContent='⑥ 업무 완료 처리';
  deadline.insertAdjacentHTML('beforebegin',`<h4>② 이 업무가 발생한 이유</h4><p>${esc(t.triggerCondition||'완료 당시 사고정보와 기록 확인')}</p><p>수행주체: ${esc(t.responsibleParty||'확인 필요')}<br>${t.submissionInstitution?'제출·확인 기관: '+esc(t.submissionInstitution):''}</p>`);
  const list=methods.nextElementSibling;if(list?.tagName==='OL')list.innerHTML=(t.actionRequired||r.steps).map(x=>'<li>'+esc(x)+'</li>').join('');
  if(t.deadlineType==='none'){
   let n=deadline.nextElementSibling;while(n&&n!==methods){const next=n.nextElementSibling;n.remove();n=next;}
   deadline.insertAdjacentHTML('afterend',`<p>별도 고정 법정기한 없음 · ${esc(t.obligationType)}<br>내부 목표일: ${esc(t.managementDue||'미지정')} · ${esc(t.verificationStatus||'추가 조건 확인 필요')}</p>`);
  }
  if(t.workflowPhase==='care-result')methods.insertAdjacentHTML('beforebegin',`<p>입력된 심사결과: ${esc(e.data?.careDecision||'확인 필요')} · 결정일 ${esc(e.data?.careDecisionDate||'확인 필요')}</p>`);
  if(t.workflowPhase==='report'&&e.data?.reportSubmitted==='예')methods.insertAdjacentHTML('beforebegin',`<p>기제출 입력: ${esc(e.data.reportSubmittedDate||'제출일 확인 필요')} · 접수·제출 내용 확인 후 실제 완료를 기록하세요. 중복 제출을 지시하지 않습니다.</p>`);
  if(t.retentionYears)methods.insertAdjacentHTML('beforebegin',`<p>보존기간: ${t.retentionYears}년 · ${esc(t.retentionBasis)}<br>기록 작성일: ${esc(t.recordCreatedOn||'확인 필요')} / 보존 종료 확인: ${esc(t.retentionEnd||'작성일 확인 후 계산')}<br>자동 파기하지 않습니다.</p>`);
  if(t.workflowPhase==='risk'){deadline.insertAdjacentHTML('afterend',`<p>관련 작업 재개: ${esc(t.beforeWorkDate||'일자 확인 필요')} ${esc(t.beforeWorkTime||'시각 확인 필요')} 이전 완료 · 휴일을 이유로 재개 이후로 연장하지 않습니다.</p>`);document.getElementById('incidentComplete')?.insertAdjacentHTML('beforeend',inputField('performedTime','실제 평가 완료 시각 (재개일 당일 이행 시 입력)',t.actualTime||'','time'));}
  const refs=t.applicableLaw||r.refs;
  links.insertAdjacentHTML('afterend',`<div class="incident-links">${refs.map(x=>`<a class="btn" href="${esc(safetyLaw.originalLink(x))}" target="_blank" rel="noopener">${esc(x.lawName)} 제${esc(x.article)}조${x.branch?'의'+esc(x.branch):''}</a>`).join('')}<a class="btn" href="${R.manual.path}#page=${r.pages[0]||1}" target="_blank" rel="noopener">공식 매뉴얼 원문 열기</a><button class="btn" data-u-refresh="${esc(e.id)}">공식 법령 재조회</button></div>`);
  box.insertAdjacentHTML('beforeend',`<details><summary>매뉴얼 대조·확인 범위</summary><p>${esc(R.manual.title)} 관련 절 원문 대조 (${r.pages.join(', ')}쪽). ${esc(t.manualVerification||'매뉴얼 일반 안내와 추가 법령 근거 구분')}. 페이지 번호만으로 법령 검증을 대신하지 않습니다.</p><p>${t.workflowPhase==='risk'?'2025 매뉴얼의 1개월 안내와 2026 시행규칙의 관련 작업 시작 전 기준 차이: 사고 당시 시행 법령을 우선합니다.':'매뉴얼의 수신기관·행정절차는 현행 공문을 추가 대조합니다.'}</p><p>규칙판 ${esc(R.version)} · API 확인일 ${esc(t.legalCheckedAt||'없음')} · 적용 시행일 ${esc(t.legalEffectiveDate||'미확인')}</p></details>`);
 };
 const yn=[['확인 필요','확인 필요'],['예','예'],['아니오','아니오']];
 accidentFields=function(v={}){
  const yn=[['확인 필요','미확인'],['예','예'],['아니오','아니오']],choice=(k,label,options=yn)=>selectField(k,label,v[k]??'확인 필요',options),field=(k,label,type='text',extra='')=>inputField(k,label,v[k]??'',type,extra);
  const people=R.victims(v),shown=['death','leave','leaveDays','care','careDays','careMonths','injuryKind'];
  const person=(x,i)=>`<fieldset class="victim-row" data-victim="${i}"><legend>재해자 ${i+1}</legend><button type="button" class="btn" data-final-remove-victim>제거</button><div class="form-grid">${inputField('victim_'+i+'_leaveDays','휴업 필요일수 (일)',x.leaveDays??'','number','min="0" step="1" placeholder="미확인"')}${inputField('victim_'+i+'_careDays','요양 필요일수 (일)',x.careDays??'','number','min="0" step="1" placeholder="미확인"')}${inputField('victim_'+i+'_careMonths','요양 필요개월수 (장기요양 해당 시)',x.careMonths??'','number','min="0" step="0.1" placeholder="미확인"')}${selectField('victim_'+i+'_injuryKind','부상·질병',x.injuryKind||(v.nature==='업무상 질병'?'직업성 질병':v.nature==='사고성 재해'?'부상':'확인 필요'),['확인 필요','부상','직업성 질병'].map(k=>[k,k==='확인 필요'?'미확인':k]))}${selectField('victim_'+i+'_leave','휴업 필요 여부',x.leave||'확인 필요',yn)}${selectField('victim_'+i+'_care','요양 필요 여부',x.care||'확인 필요',yn)}</div>${Object.entries(x).filter(([k])=>!shown.includes(k)&&k!=='death').map(([k,value])=>`<input type="hidden" name="victim_${i}_${esc(k)}" value="${esc(value)}">`).join('')}</fieldset>`;
  return `<div class="form-grid">${inputField('date','사고 발생일',v.date||localToday(),'date','required')}${field('accidentType','사고 유형','text','required')}${choice('employment','근로자 소속·고용관계',['확인 필요','학교 직접고용','수급업체 소속','공무원·교원','기타'].map(k=>[k,k==='확인 필요'?'미확인':k]))}${choice('workRelated','업무상 재해 여부')}${choice('nature','사고·질병 구분',['확인 필요','사고성 재해','업무상 질병'].map(k=>[k,k==='확인 필요'?'미확인':k]))}${inputField('injuredCount','재해자 총수',v.injuredCount||people.length,'number','min="1" step="1"')}${choice('simultaneous','여러 재해자가 동시에 발생했는가')}</div><p class="subtle">휴업과 요양은 별도 입력합니다. 일수를 모르면 비워 두면 미확인으로 저장됩니다.</p><div id="incidentVictims">${people.map(person).join('')}</div><button type="button" class="btn" data-final-add-victim>재해자 추가</button>
  <details class="accident-extra"><summary>작업 재개·보상·추가정보 (해당 시)</summary><div class="form-grid">${field('restartDate','관련 작업 재개일 (미정은 비움)','date')}${field('restartTime','작업 재개시각','time')}${choice('insurance','보상제도',['확인 필요','예','아니오','공무원 재해보상'].map(k=>[k,{'확인 필요':'미확인','예':'산재보험 적용','아니오':'산재보험 적용 제외','공무원 재해보상':'공무원 재해보상'}[k]]))}${choice('sameAccident','동일 사고 여부')}${choice('serious','중대재해 해당 여부 (종합 판단)',[['확인 필요','확인 필요'],['예','해당 확인'],['아니오','비해당 확인'],['의심','의심·즉시 확인']])}${choice('musculoskeletal','근골격계질환 해당 여부')}${choice('recognition','업무상 질병 인정 여부')}${choice('muscleReason','수시 유해요인조사 사유',['확인 필요','질환 발생·업무상 질병 인정','새 작업·설비 도입','작업환경 변경'].map(k=>[k,k]))}${choice('burdenWork','신규·변경 작업의 근골격계부담작업 해당 여부')}${choice('muscleException','최근 1년 조사·개선 모두 이행한 예외 해당 여부')}${field('muscleBaseDate','수시조사 사유 발생일','date')}${field('place','사고 장소')}${field('accidentTime','발생시각','time')}${choice('reportSpecial','제출명령·특례 적용 가능성')}${choice('lateRecognition','산재가 뒤늦게 확인되었는가')}${field('reportBaseDate','질병 등 확인된 보고 기산일','date')}${choice('reportBasisConfirmed','질병 등 기산점 적용 근거 확인')}${field('reportBasisEvidence','기산점 적용 근거')}${field('followupTarget','원인 조사·개선 내부 목표일','date')}${choice('emergencyAid','응급조치 실시 여부')}${choice('workStopped','작업중지 실시 여부')}</div><label>사고 경위·기타 판단정보<textarea name="content">${esc(v.content||'')}</textarea></label></details>
  <input type="hidden" name="victimsJson" value="${esc(JSON.stringify(people))}"><input type="hidden" name="leave" value="${esc(v.leave||'확인 필요')}"><input type="hidden" name="leaveDays" value="${esc(v.leaveDays??'')}"><div class="notice accident-live" role="status">사고 조건을 입력하면 필요한 핵심 업무와 기한을 안내합니다.</div>`;
 };
 function collect(form){const old=app.data.triggerEvents.find(e=>e.id===form.dataset.eventId),legacy=old?R.victims(old.data||{}):[];const rows=[...form.querySelectorAll('[data-victim]')].map(row=>({...legacy[Number(row.dataset.victim)],...Object.fromEntries([...row.querySelectorAll('[name]')].map(el=>[el.name.replace(/^victim_\d+_/,''),el.value]))}));form.elements.victimsJson.value=JSON.stringify(rows);const a=rows[0]||{};form.elements.leave.value=a.leave||'확인 필요';form.elements.leaveDays.value=a.leaveDays??'';return rows;}
 const submitBefore=submitEvent;
 submitEvent=async function(...args){const f=document.getElementById('eventForm');if(f?.dataset.kind==='accident'){
  collect(f);const v=Object.fromEntries(new FormData(f));
  for(const row of R.victims(v))for(const prefix of ['leave','care']){const p=R.period(row,prefix,v.date);if(p.issue){toast(p.issue+' · 기간을 확인해 주세요.');return;}}
  if(v.restartDate&&v.restartDate<v.date){toast('작업 재개일은 사고 발생일 이후로 확인해 주세요.');return;}
   }return submitBefore(...args);};
 document.addEventListener('click',event=>{const btn=event.target.closest('[data-final-add-victim]');if(!btn)return;event.preventDefault();const form=btn.closest('form'),box=form.querySelector('#incidentVictims'),i=Math.max(...[...box.children].map(x=>+x.dataset.victim))+1;if(box.children.length>=30){toast('30명 초과 피해는 총수와 별도 조사기록으로 관리하세요.');return;}const row=box.firstElementChild.cloneNode(true);row.dataset.victim=i;row.querySelector('legend').textContent='재해자 '+(i+1)+' (성명 입력 불필요)';for(const el of row.querySelectorAll('[name]')){el.name=el.name.replace(/^victim_\d+_/,'victim_'+i+'_');if(el.tagName==='SELECT')el.value='확인 필요';else el.value='';}box.append(row);});
 document.addEventListener('click',event=>{const reveal=event.target.closest('[data-final-show-disease]');if(reveal){const d=reveal.closest('form').querySelector('[data-final-disease]');d.hidden=false;d.open=true;}const remove=event.target.closest('[data-final-remove-victim]');if(remove){const box=remove.closest('#incidentVictims');if(box.children.length>1){remove.closest('[data-victim]').remove();collect(box.closest('form'));}else toast('재해자는 최소 한 명의 확인정보를 남겨 주세요.');}});
 ['input','change'].forEach(type=>document.addEventListener(type,event=>{const form=event.target.closest('#eventForm[data-kind="accident"]');if(!form)return;collect(form);const v=Object.fromEntries(new FormData(form));if(v.nature==='업무상 질병')form.querySelector('[data-final-disease]')?.removeAttribute('hidden');const a=R.analyze({date:v.date,data:v}),notice=form.querySelector('.accident-live');if(notice)notice.textContent='조사표 제출: '+a.report+' · 중대재해 긴급보고: '+a.osh+' · 수시 위험성평가: '+(a.risk==='예'?'관련 작업 재개 전 실시':a.risk);}));
 window.safetyValidateIncidentCompletion=function(t,v){if(t.workflowPhase!=='risk')return;const day=t.beforeWorkDate;if(day&&v.performedOn===day&&!v.performedTime)throw Error('작업 재개일 당일 평가의 실제 완료 시각을 입력하세요.');t.beforeWorkResult=!day?'재개 시점 미확인':v.performedOn<day?'재개일 전 이행':v.performedOn>day?'재개 예정일 이후 이행 · 조치 경위 재확인':t.beforeWorkTime?(v.performedTime<t.beforeWorkTime?'재개 시각 전 이행':'재개 시각 이후 또는 같은 시각 이행 · 조치 경위 재확인'):'완료 시각 기록 · 실제 재개 시각 대조 필요';};
 window.safetyFinal=Object.freeze({rules:R,issues,base});
})();

;
/* Runtime: task-flow.js */
/* Read-only priority and navigation models. No deadline calculation or task generation. */
(function(root){
 'use strict';
 const valid=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 const urgent=t=>!t.completedByUser&&(t.deadlineKind==='immediate'||t.priority==='긴급');
 function dates(t,ctx){const p=ctx.period(t),legal=t.workflowKind==='incident'?t.finalLegalDeadline:p?null:t.finalLegalDeadline||t.dueDate;return {legal:valid(legal)?legal:'',end:[p?.end,t.managementDue,t.endDate,t.date,t.workflowPhase==='report'?t.computedBaseDeadline:''].find(valid)||''};}
 function rank(t,ctx){if(t.completedByUser||ctx.status(t)==='완료')return 6;if(urgent(t))return 0;const s=ctx.status(t),d=dates(t,ctx);if(d.legal&&d.legal<ctx.today||s==='지연'&&d.end&&d.end<ctx.today)return 1;if(['임박','마감 임박'].includes(s))return 2;if(['진행','확인필요','확인 필요'].includes(s)||s==='지연')return 3;if(['이번 주 업무','이번 달 업무'].includes(s))return 4;return 5;}
 function compare(a,b,ctx){const d=dates(a,ctx),e=dates(b,ctx);return rank(a,ctx)-rank(b,ctx)||(d.legal||'9999').localeCompare(e.legal||'9999')||(d.end||'9999').localeCompare(e.end||'9999')||ctx.title(a).localeCompare(ctx.title(b),'ko')||String(a.id).localeCompare(String(b.id));}
 function progress(event,plans,tasks,deleted,conditionIssues=()=>[]){
  const records=Object.values(deleted||{}).filter(x=>x.sourceEventId===event.id),byPhase=new Map(tasks.filter(t=>t.sourceEventId===event.id&&t.workflowKind==='incident').map(t=>[t.workflowPhase,t]));
  const rows=plans.map((p,index)=>{
   const key='incident|'+event.id+'|'+p.stage,del=records.find(x=>x.key===key),t=del?null:byPhase.get(p.stage),resolution=event.resolvedDeleted?.[key];
   const resolved=!!resolution&&valid(resolution.performedOn)&&!!resolution.result?.trim(),done=!!t?.completedByUser||resolved;
   const parallelDuty=t?.deadlineKind==='immediate'||t?.priority==='긴급'||p.deadlineKind==='immediate'||p.priority==='긴급';
   return {phase:p.stage,order:index+1,key,plan:p,task:t,deleted:del,resolution,done,urgent:!done&&parallelDuty,dependsOn:parallelDuty?'':t?.waitForStage||p.waitFor||'',issues:t?.completedRecheck||t?.overrideRecheck?['완료·기한 근거 재확인 필요']:conditionIssues(event,p.stage)};
  });
  for(const row of rows){row.blocked=!!row.dependsOn&&!rows.some(x=>x.phase===row.dependsOn&&x.done&&!x.task?.completedRecheck&&!x.task?.overrideRecheck);row.available=!!row.task&&!row.done&&(!row.blocked||row.urgent);}
  // Initial safety action remains the first recommended step. Independent urgent
  // duties are always accessible in parallel, regardless of the recommendation.
  const normal=rows.filter(r=>r.available&&!r.urgent),initial=rows.find(r=>r.phase==='immediate'&&r.available);
  const current=initial||normal[0]||rows.find(r=>r.available),next=rows.find(r=>r.available&&r!==current&&!r.urgent)||rows.find(r=>r.available&&r!==current);
  for(const r of rows)r.state=r.done?(r.blocked||r.issues?.some(x=>x.includes('완료·'))?'적용조건 확인 필요':'완료'):r.deleted?'적용조건 확인 필요':r.urgent?(r===current?'현재 진행':'병행 진행 가능'):r.blocked?'선행 단계 완료 필요':r.issues?.length?'적용조건 확인 필요':r===current?'현재 진행':'병행 진행 가능';
  const active=new Set(plans.map(p=>p.stage)),inactive=tasks.filter(t=>t.sourceEventId===event.id&&t.workflowKind==='incident'&&!active.has(t.workflowPhase)).map(task=>({task,phase:task.workflowPhase,state:'비대상'}));
  return {rows,inactive,current,next,urgent:rows.filter(r=>r.urgent),tasks:rows.map(r=>r.task).filter(Boolean),deleted:rows.map(r=>r.deleted).filter(Boolean),done:rows.filter(r=>r.done).length,total:rows.length,pct:rows.length?Math.round(rows.filter(r=>r.done).length/rows.length*100):0};
 }
 const api={valid,urgent,dates,rank,compare,progress};if(typeof module==='object'&&module.exports)module.exports=api;else root.SafetyTaskFlow=Object.freeze(api);
})(typeof window!=='undefined'?window:globalThis);

;
/* Runtime: workflow-ui.js */
/* Core incident work uses existing task IDs, storage, calendar and legal transport. */
(()=>{
 'use strict';
 const F=SafetyTaskFlow,I=safetyIntegration,R=SafetyIncidentRules,esc=x=>escapeHtml(String(x??''));
 const isIncident=t=>t?.workflowKind==='incident',done=t=>!!t?.completedByUser,title=t=>t.userModified?t.name:t.workflowAction||t.name;
 const due=t=>t.finalLegalDeadline||t.dueDate||t.beforeWorkDate||t.managementDue||'';
 const coreCompare=(a,b)=>(Number(b.deadlineKind==='immediate')-Number(a.deadlineKind==='immediate'))||(due(a)||'9999').localeCompare(due(b)||'9999')||({report:0,risk:1,cause:2}[a.workflowPhase]??3)-({report:0,risk:1,cause:2}[b.workflowPhase]??3)||title(a).localeCompare(title(b),'ko');
 const ctx=()=>({today:localToday(),status:statusOf,period:performancePeriod,title:t=>taskDisplay(t).title||t.name||''});
 const ordered=list=>[...list].sort((a,b)=>isIncident(a)&&isIncident(b)?(done(a)-done(b)||coreCompare(a,b)):F.compare(a,b,ctx()));
 function timing(t){
  if(!t)return '';
  if(t.workflowPhase==='immediate')return '즉시 · 작업중지·대피는 위험 상황에 따라 적용';
  if(t.deadlineKind==='immediate')return '지체 없이';
  if(['risk','risk-records'].includes(t.workflowPhase)&&t.date<'2026-08-01'&&t.date)return '사고 당시 시행 법령·기한 확인 필요';
  if(t.workflowPhase==='risk'){const e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId);if(e?.date<'2026-08-01')return '사고 당시 시행 법령·기한 확인 필요';return '관련 작업 재개 전 완료'+(t.beforeWorkDate?' · '+t.beforeWorkDate+(t.beforeWorkTime?' '+t.beforeWorkTime:''):' (재개일 미정)')}
  if(t.workflowPhase==='report')return t.finalLegalDeadline?'제출기한 '+t.finalLegalDeadline+' · '+dDay(t.finalLegalDeadline):'기한 확인 필요 · 원칙: 발생일부터 1개월 이내';
  if(t.waitForStage)return '선행 업무 실시 후 확인'+(t.managementDue?' · 내부 목표일 '+t.managementDue:'');
  return t.managementDue?'내부 목표일 '+t.managementDue+' · '+dDay(t.managementDue):'별도 고정 법정기한 없음 / 신속한 조치 필요';
 }
 const priorStatus=statusOf;statusOf=function(t){if(!isIncident(t))return priorStatus(t);if(done(t))return '완료';if(t.deadlineKind==='immediate')return '임박';const d=due(t);if(d&&d<localToday())return '지연';if(d&&d<=addDays(localToday(),7))return '임박';return t.requiresReview?'확인필요':'예정'};
 const summary=t=>({report:'조사표 작성 → 근로자대표 확인 등 필요한 절차 → 관할 지방고용노동관서 제출',risk:'사고 원인의 유해·위험요인 파악 → 위험성 결정 → 개선대책 수립·이행',
  'urgent-report':'발생 개요·피해 상황·조치 및 전망을 관할 지방고용노동관서에 즉시 보고',cause:'사고원인과 발생과정 조사 → 재발방지계획 수립·기록',compensation:'재해자에게 요양급여 신청서·의학적 소견서와 공단 신청 절차 안내',
  'public-care':'소속기관을 통한 공무상 요양 신청 및 구비서류 안내'}[t.workflowPhase]||R.rules[t.workflowPhase]?.steps.slice(0,2).join(' '));
 function questions(e){
  const v=e.data||{},a=R.analyze(e),q=[];if(a.workRelated==='아니오')return q;
  if(a.workRelated==='확인 필요')q.push('업무상 재해 여부 입력');
  if(!v.employment||v.employment==='확인 필요')q.push('근로자 소속·고용관계 입력');
  if(a.report==='확인 필요'&&a.rows.some(r=>r.leaveCount==null))q.push('휴업 필요일수 입력');
  if((a.rows.length>1||Number(v.injuredCount)>1)&&a.osh==='확인 필요')q.push('동시 발생 여부·재해자별 장기 요양기간 입력');
  if(a.rows.length<Number(v.injuredCount)&&Number(v.injuredCount)>1&&a.osh!=='예')q.push('추가 재해자의 요양기간 입력');
  if(a.muscle==='확인 필요')q.push('수시 유해요인조사 해당 여부 확인');
  if(a.care==='예'&&!a.publicEmployee&&v.insurance!=='예'&&v.insurance!=='아니오')q.push('산재보험 적용 여부 입력');
  if(a.report==='예'&&v.nature==='업무상 질병'&&!(v.reportBaseDate&&v.reportBasisConfirmed==='예'&&v.reportBasisEvidence))q.push('업무상 질병의 보고 기산일·적용 근거 입력');
  return [...new Set(q)];
 }
 function flow(e){
  const f=F.progress(e,incidentPlan(e),app.data.tasks,scheduleState().deletedTasks,()=>[]);
  const order={immediate:0,parallel:1,followup:2};for(const r of f.rows){r.group=['immediate','urgent-report','preservation'].includes(r.phase)?'immediate':r.dependsOn?'followup':'parallel';r.state=r.done?'완료':r.blocked?'선행 업무 실시 후':'미완료'}
  f.rows.sort((a,b)=>order[a.group]-order[b.group]||(a.task&&b.task?done(a.task)-done(b.task)||coreCompare(a.task,b.task):a.order-b.order));f.rows.forEach((r,i)=>r.order=i+1);
  f.current=f.rows.find(r=>r.available);f.next=f.rows.find(r=>r.available&&r!==f.current);f.urgent=f.rows.filter(r=>r.available&&r.group==='immediate');return f;
 }
 function navigationState(e){const f=flow(e);e.workflowNavigation={version:2,currentStageId:f.current?.phase||'',nextStageId:f.next?.phase||'',stageOrder:f.rows.map(r=>r.phase)};for(const r of f.rows)if(r.task)Object.assign(r.task,{flowCurrent:r===f.current,flowOrder:r.order,flowState:r.done?'완료':'처리 필요'});return f;}
 window.safetyFlowProgress=e=>{const f=flow(e);return {...f,current:f.current?.task||null,next:f.current?.task||null,nextExecutable:f.next?.task||null}};
 const saveBefore=app.save;
 app.save=async function(...args){if(this.data)for(const e of this.data.triggerEvents.filter(e=>e.type==='accident'))navigationState(e);return saveBefore.apply(this,args)};
 const syncBefore=syncIncident;syncIncident=function(e){const r=syncBefore(e);if(e?.type==='accident'&&app.data)navigationState(e);return r};
 incidentCanClose=function(e){const f=flow(e);return !questions(e).length&&f.rows.every(r=>r.done)};
 const filteredBefore=getFilteredTasks;getFilteredTasks=function(...a){const list=filteredBefore(...a);return ['name','recent'].includes(app.sort)?list:ordered(list)};
 const summaryBefore=summaryTasks;summaryTasks=function(...a){return ordered(summaryBefore(...a))};
 const dayBefore=dashDayTasks;dashDayTasks=function(...a){const list=dayBefore(...a);if(app.dashDate===localToday())for(const t of app.data.tasks.filter(t=>isIncident(t)&&!done(t)&&visibleSchedule(t)))if(!list.some(x=>x.id===t.id))list.push(t);return ordered(list)};
 homeTaskList=function(kind){return ordered((kind==='priority'?app.data.tasks:summaryTasks(kind)).filter(t=>visibleSchedule(t)&&!done(t))).slice(0,3)};
 const panelBefore=referenceDayPanel;referenceDayPanel=function(...a){const all=app.data.tasks;app.data.tasks=ordered(all);try{return panelBefore(...a).replace('오늘 업무','예정·임박 업무')}finally{app.data.tasks=all}};
 const rowsBefore=taskRows;taskRows=function(list,...a){return rowsBefore(ordered(list),...a)};
 const displayBefore=taskDisplay;taskDisplay=function(t){const d=displayBefore(t),p=performancePeriod(t),m=app.data?.taskMaster.find(m=>m.taskCode===t.masterCode);if(isIncident(t)){d.title=title(t);d.action=summary(t);d.sub=d.action}else if(p?.rule==='halfyear'&&(t.masterCode==='LAW-001'||/법령.*의무.*점검/.test(m?.taskName||t.name))){d.title=t.userModified?t.name:p.start.slice(0,4)+'년 '+(p.start.slice(5,7)==='01'?'상반기':'하반기')+' 법령 의무이행 점검';d.action='안전·보건 관계 법령상 의무이행 여부를 반기 1회 이상 점검';d.sub=d.action}return d};
 const actionsBefore=taskActionHtml;taskActionHtml=function(t){if(isDirectSchedule(t))return '';return isIncident(t)?'<small class="task-action-summary">'+esc(summary(t))+'</small>':actionsBefore(t)};
 const toolbarBefore=referenceToolbar;referenceToolbar=function(...a){return toolbarBefore(...a).replace('마감임박순','긴급도 우선')};
 function card(row){const t=row.task,completed=done(t);return `<article class="core-incident-card ${row.group==='immediate'&&!completed?'is-current':''} ${completed?'is-done':''}" data-core-task="${esc(t.id)}"><h3>${esc(title(t))} <small>${esc(row.state)}</small></h3><p class="core-deadline">${esc(timing(t))}</p><p class="core-summary">${esc(summary(t))}</p><div class="flow-tools">${t.workflowPhase==='report'?`<button class="btn" data-form-preparation="${esc(t.id)}">서식 작성</button>`:''}<button class="btn" data-task="${esc(t.id)}">${completed?'처리 결과':row.blocked?'수행 안내':'업무 수행'}</button></div></article>`}
 showIncident=function(id){const e=app.data.triggerEvents.find(e=>e.id===id);if(!e)return;const f=navigationState(e),a=R.analyze(e),q=questions(e);const groups=[['immediate','즉시 조치'],['parallel','병행 수행'],['followup','후속 관리']];modal('산업재해 업무처리',`<div class="flow-case core-incident" data-incident-detail="${esc(id)}"><section class="flow-case-summary"><h3>사고 발생일 ${esc(e.date)} · ${esc(e.data?.accidentType||'산업재해')}</h3><p>휴업 필요일수: ${a.rows.map((r,i)=>esc((a.rows.length>1?'재해자 '+(i+1)+' ':'')+(r.leaveCount==null?'미확인':r.leaveCount+'일'))).join(' / ')} · 완료 ${f.done}/${f.total}건</p><button class="btn" data-edit-incident="${esc(id)}">사고정보 수정</button>${a.osh==='확인 필요'?'<p class="subtle">중대재해 해당 여부 확인 필요 · 정보 부족만으로 비해당 판정하지 않습니다.</p>':''}</section>${groups.map(([key,label])=>{const rows=f.rows.filter(r=>r.group===key&&r.task);return rows.length?`<section class="incident-work-group" data-work-group="${key}"><h4>${label}</h4>${key==='parallel'?'<p class="subtle">각 업무는 조사표 제출 완료를 기다리지 않고 독립적으로 수행합니다.</p>':''}${rows.map(card).join('')}</section>`:''}).join('')}${q.length?'<div class="notice">'+q.map(x=>esc(x)).join(' · ')+` <button class="btn" data-edit-incident="${esc(id)}">정보 입력</button></div>`:''}<details class="flow-management"><summary>이전 처리 기록·사건 관리</summary>${f.inactive.filter(r=>done(r.task)||r.task.resultSummary).map(r=>`<p>${esc(title(r.task))} · ${esc(r.task.actualDate||'')} · ${esc(r.task.resultSummary||'')} <button class="btn" data-task="${esc(r.task.id)}">기록 보기</button></p>`).join('')||'<p>이전 처리 기록 없음</p>'}<button class="btn" data-incident-list>사고 목록</button><button class="btn" data-u-refresh="${esc(id)}">관련 법령 조회</button></details>${e.closedAt?'<p>사건 처리 완료</p>':incidentCanClose(e)?`<button class="btn primary" data-close-incident="${esc(id)}">사건 처리 완료</button>`:''}</div>`,`<button class="btn" data-close>닫기</button>`,'wide')};
 function evidence(t,e){const refs=t.applicableLaw||R.rules[t.workflowPhase]?.refs||[];return `<details class="core-evidence"><summary>법령·기한 근거</summary>${refs.map(r=>`<p><a href="${esc(safetyLaw.originalLink(r))}" target="_blank" rel="noopener">${esc(r.lawName)} 제${esc(r.article)}조</a></p>`).join('')}<p>${esc(t.triggerCondition||'')}<br>${esc((t.deadlineReasons||[]).join(' · '))}</p><button class="btn" data-u-refresh="${esc(e.id)}">공식 법령 조회</button>${t.deadlineType==='months'||t.deadlineType==='before'?`<button class="btn" data-u-override="${esc(t.id)}">기한 확인·수정</button>`:''}</details>`}
 window.safetyShowIncidentTask=function(id){const t=app.data.tasks.find(t=>t.id===id);if(!isIncident(t))return;const e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId);if(!e)return;const r=R.rules[t.workflowPhase],v=t.completionDraft||{},old=done(t),active=incidentPlan(e).some(p=>p.stage===t.workflowPhase),f=flow(e);document.getElementById('overlay').innerHTML=`<div class="drawer-wrap" data-close-overlay><aside class="drawer incident-task-drawer flow-task core-task" data-flow-task-id="${esc(id)}"><div class="drawer-head"><h3>${esc(title(t))}</h3><button class="close" data-close>×</button></div><div class="drawer-body"><section><p class="core-deadline">${esc(timing(t))}</p><p>${esc(summary(t))}</p>${t.workflowPhase==='report'?'<p>서식: 산업안전보건법 시행규칙 별지 제30호 산업재해조사표</p>':''}${t.workflowPhase==='report'?`<button class="btn" data-form-preparation="${esc(id)}">서식 작성</button>`:''}<button class="btn" data-edit-incident="${esc(e.id)}">${t.workflowPhase==='risk'?'작업 재개일 입력·수정':'사고정보 수정'}</button></section><details class="core-instructions"><summary>${t.workflowPhase==='urgent-report'?'보고방법':'자세한 수행방법'}</summary><p>수행주체: ${esc(t.responsibleParty||'담당자')}<br>제출·확인 기관: ${esc(t.submissionInstitution||'해당 업무 수행부서')}</p><ol>${(t.actionRequired||r?.steps||[]).map(x=>'<li>'+esc(x)+'</li>').join('')}</ol>${t.workflowPhase==='report'?'<p>기본 계산일은 원칙적인 1개월 기준입니다. 질병·늦은 확인·제출명령 등 특례와 휴일 적용은 별도로 검토합니다.</p>':''}</details>${evidence(t,e)}<section class="flow-complete"><h4>${old?'저장된 처리 결과':'처리 결과 입력'}</h4>${old?`<p>${esc(t.workflowPhase==='report'?'제출일':'처리일')} ${esc(t.actualDate)}<br>${esc(t.submissionEvidence?.institution||'')}<br>${esc(t.resultSummary)}</p><button class="btn" data-reopen="${esc(id)}">완료 취소</button>`:active?`<form id="incidentComplete" data-id="${esc(id)}">${inputField('performedOn',t.workflowPhase==='report'?'제출일':t.workflowPhase==='urgent-report'?'보고일':'실시일',v.performedOn||t.actualDate||localToday(),'date','required max="'+localToday()+'"')}${['report','urgent-report'].includes(t.workflowPhase)?inputField('institution',t.workflowPhase==='report'?'제출기관':'보고기관',v.institution||t.submissionEvidence?.institution||'관할 지방고용노동관서','text','required'):''}${t.workflowPhase==='risk'?inputField('performedTime','완료시각 (재개일 당일 실시 시)',v.performedTime||'','time'):''}<label>처리 결과<textarea name="result" required>${esc(v.result||t.resultSummary||'')}</textarea></label></form><button class="btn primary" data-u-complete="${esc(id)}">결과 저장·처리 완료</button>`:'<p>현재 조건에서는 별도 수행대상이 아닙니다. 이전 기록을 보존합니다.</p>'}</section><button class="btn" data-incident="${esc(e.id)}">사고 업무 전체 보기</button><button class="btn" data-u-calendar="${esc(id)}">일정 보기</button></div></aside></div>`};
 window.safetyIncidentDetailEnhance=()=>{};
 window.safetyValidateIncidentCompletion=function(t,v){const e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId);if(!incidentPlan(e).some(p=>p.stage===t.workflowPhase)||t.workflowInactive)throw Error('현재 사고조건에 적용되는 업무가 아닙니다.');const row=flow(e).rows.find(r=>r.task?.id===t.id);if(row?.blocked)throw Error('이 업무는 실제 선행 업무를 실시한 뒤 완료 결과를 기록합니다.');if(!v.result?.trim())throw Error('처리 결과를 입력하세요.');if(v.performedOn<e.date)throw Error('실제 처리일은 사고 발생일 이후여야 합니다.');if(['report','urgent-report'].includes(t.workflowPhase)&&!v.institution?.trim())throw Error('실제 제출·보고기관을 입력하세요.');if(t.workflowPhase==='risk'&&v.performedOn===t.beforeWorkDate&&!v.performedTime)throw Error('작업 재개일 당일의 실제 완료시각을 입력하세요.');if(t.completedRecheck){t.completionRevalidation??=[];t.completionRevalidation.push({at:new Date().toISOString(),previous:t.completedRecheck});delete t.completedRecheck}if(t.workflowPhase==='risk')t.beforeWorkResult=t.beforeWorkDate?(v.performedOn<t.beforeWorkDate?'재개일 전 이행':v.performedOn>t.beforeWorkDate?'재개일 이후 이행 · 경위 확인':t.beforeWorkTime&&v.performedTime>=t.beforeWorkTime?'재개시각 이후 이행 · 경위 확인':'재개일 당일 완료시각 기록'):'실시 완료 · 실제 재개일 대조 필요'};
 window.safetyIncidentCompleted=async function(t){const e=app.data.triggerEvents.find(e=>e.id===t.sourceEventId);if(!e)return;delete t.completionDraft;e.flowCompletionHistory??=[];e.flowCompletionHistory.push({action:'업무 완료',phase:t.workflowPhase,taskId:t.id,at:t.completedAt,actualDate:t.actualDate,resultSummary:t.resultSummary});const f=navigationState(e);await app.save();render();showIncident(e.id);toast(f.current?'해당 업무를 완료했습니다. 다른 병행 업무는 독립적으로 계속 수행할 수 있습니다.':'적용 업무의 처리가 완료되었습니다.')};
 window.addEventListener('input',ev=>{const f=ev.target.closest('#incidentComplete');if(!f)return;const t=app.data.tasks.find(t=>t.id===f.dataset.id);if(t)t.completionDraft=Object.fromEntries(new FormData(f));clearTimeout(window.incidentDraftTimer);window.incidentDraftTimer=setTimeout(()=>app.save().catch(e=>toast(e.message)),300)},true);
 window.addEventListener('click',async ev=>{const b=ev.target.closest('[data-reopen]'),t=b&&app.data?.tasks.find(t=>t.id===b.dataset.reopen);if(!isIncident(t))return;ev.preventDefault();ev.stopImmediatePropagation();t.completionHistory??=[];t.completionHistory.push({actualDate:t.actualDate,resultSummary:t.resultSummary,submissionEvidence:t.submissionEvidence,completedAt:t.completedAt});t.completedByUser=false;t.completedAt=null;await app.save();render();showIncident(t.sourceEventId)},true);
 function formPayload(id){const t=app.data.tasks.find(t=>t.id===id),e=app.data.triggerEvents.find(e=>e.id===t?.sourceEventId);if(!t||!e)return null;return {formId:'industrial_accident_report_30',taskId:t.id,incidentId:e.id,accidentDate:e.date,incidentData:JSON.parse(JSON.stringify(e.data||{})),victims:R.victims(e.data||{}),formName:'산업안전보건법 시행규칙 별지 제30호 산업재해조사표'}};
 async function requestForm(id){const payload=formPayload(id);if(!payload)return;if(typeof window.safetyFormAutomation?.open==='function')return window.safetyFormAutomation.open(payload);const event=new CustomEvent('safety:form-request',{detail:payload,cancelable:true});if(window.dispatchEvent(event))toast('서식작성 기능 준비 중 · 산업재해조사표에 필요한 자료와 작성방법은 업무 안내를 확인하세요.');return payload}
 window.safetyFormBridge=Object.freeze({buildPayload:formPayload,request:requestForm});
 document.addEventListener('click',ev=>{const b=ev.target.closest('[data-form-preparation]');if(b)requestForm(b.dataset.formPreparation)});
 window.safetyCoreIncident=Object.freeze({questions,timing,summary,flow});
 function calendarOpen(ev){const b=ev.target.closest('[data-calendar-task],.ref-task-copy strong[data-task]');if(!b||ev.type==='keydown'&&!['Enter',' '].includes(ev.key))return;ev.preventDefault();ev.stopImmediatePropagation();openTask(b.dataset.calendarTask||b.dataset.task);}
 window.addEventListener('click',calendarOpen,true);window.addEventListener('keydown',calendarOpen,true);
 const actualOpen=openTask;
 openTask=function(id){
   actualOpen(id);
   const t=app.data.tasks.find(t=>t.id===id);
   if(!t||t.workflowKind==='incident')return;
   const period=performancePeriod(t);
   if(period)document.querySelector('.drawer-body')?.insertAdjacentHTML('afterbegin','<section class="detail-section"><h4>수행기간과 관리기준일</h4><p>'+performanceTimingHtml(t)+'</p></section>');
   const e=app.data.officialEvents.find(e=>e.id===t.sourceEventId)||app.data.personalEvents.find(e=>e.id===t.sourceEventId);
   if(t.titleNeedsReview&&!e)document.querySelector('.drawer-body')?.insertAdjacentHTML('afterbegin','<p>제목 확인 필요: 원문을 확인한 뒤 일정 수정에서 제목을 확정하세요.</p>');
   if(e)document.querySelector('.drawer-body')?.insertAdjacentHTML('afterbegin',`<section class="detail-section"><h4>등록 일정 상세</h4><p>실제 제목: ${esc(t.name)}${t.titleNeedsReview?'<br>제목 확인 필요: 원문을 확인한 뒤 일정 수정에서 제목을 확정하세요.':''}<br>시행기관: ${esc(e.agency||'해당 없음·미입력')}<br>문서번호: ${esc(e.documentNo||'해당 없음·미입력')}<br>제출기한: ${esc(t.dueDate||'해당 없음·미입력')}<br>시간: ${esc(t.time||e.time||'미입력')}<br>처리상태: ${esc(statusOf(t))}</p>${(e.body||t.body)?'<div class="official-document-body" style="white-space:pre-wrap">'+esc(e.body||t.body)+'</div>':''}${e.rawText?'<details><summary>공문 원문 참고</summary><pre>'+esc(e.rawText)+'</pre></details>':''}</section>`);
   const m=app.data.taskMaster.find(m=>m.taskCode===(t.masterCode||t.taskCode));
   const d=taskDisplay(t);
   if(usesLawObligationWorkbook(t,m,d)){
     const drawer=document.querySelector('.drawer-body');
     const forms=[...drawer.querySelectorAll('.detail-section')].find(section=>section.querySelector('h4')?.textContent.includes('관련 서식'));
     if(forms)forms.innerHTML=`<h4>④ 관련 서식</h4>${lawObligationWorkbookHtml()}`;
     [...drawer.querySelectorAll('.badge')].filter(el=>el.textContent.trim()==='연결 준비').forEach(el=>el.remove());
   }
 };
 window.safetyWorkflowUI=Object.freeze({flow,navigationState,ordered,timing});
 const statusUncached=statusOf;statusOf=function(t){if(!renderMemo)return statusUncached(t);if(!renderMemo.status.has(t))renderMemo.status.set(t,statusUncached(t));return renderMemo.status.get(t)};
 const displayUncached=taskDisplay;taskDisplay=function(t){if(!renderMemo)return displayUncached(t);if(!renderMemo.display.has(t))renderMemo.display.set(t,displayUncached(t));return renderMemo.display.get(t)};
 const renderUncached=render;render=function(...args){const previous=renderMemo;renderMemo={period:new WeakMap(),status:new WeakMap(),display:new WeakMap(),calendar:null};try{return renderUncached(...args)}finally{renderMemo=previous}};
 window.safetyWorkflowBootResolve?.();
})();

;
/* Runtime: task-form-contract-integration.js */
/* 업무번호 기반 서식 연동, 법령 확인상태, 도급사업별 자동 주기 일정 확장. */
(()=>{
 'use strict';
 const CONTRACT_CODES=new Set(['CNT-001','CNT-002','CNT-003']);
 const explicitForms={
  'CNT-001':['04-01-08:meeting'],
  'CNT-002':['01-02-01'],
  'CNT-003':['04-01-08:inspection']
 };
 const lawSeed={
  'CNT-001':[
   ['산업안전보건법','64','1','1'],
   ['산업안전보건법 시행규칙','79','','']
  ],
  'CNT-002':[
   ['산업안전보건법','64','1','2'],
   ['산업안전보건법 시행규칙','80','','']
  ],
  'CNT-003':[
   ['산업안전보건법','64','2',''],
   ['산업안전보건법 시행규칙','82','','']
  ]
 };
 const formTitle={
  '01-02-01':'정기점검 실시 결과 보고',
  '04-01-08:meeting':'안전보건협의체 회의록',
  '04-01-08:inspection':'합동점검표',
  '05-02-01':'안전보건 교육일지',
  '06-02-01':'산업재해조사표',
  '06-02-02':'중대재해 발생 보고',
  '06-02-03':'재발방지 계획서'
 };
 function formIds(master){
  if(!master)return [];
  if(explicitForms[master.taskCode])return [...explicitForms[master.taskCode]];
  const ids=[...String(master.relatedForms||'').matchAll(/\b\d{2}-\d{2}-\d{2}\b/g)].map(x=>x[0]);
  return [...new Set(ids)];
 }
 function addLawSeeds(master){
  const seeds=lawSeed[master.taskCode];if(!seeds)return;
  master.legalReferences??=[];
  for(const [lawName,article,paragraph,item] of seeds){
   if(master.legalReferences.some(r=>r.lawName===lawName&&String(r.article||'')===article&&String(r.paragraph||'')===paragraph&&String(r.item||'')===item))continue;
   master.legalReferences.push({refId:uuid(),kind:'law',lawName,lawId:'',serialId:'',article,branch:'',paragraph,item,subitem:'',sourceUrl:`https://www.law.go.kr/법령/${encodeURIComponent(lawName)}/제${article}조`,promulgationDate:'',effectiveDate:'',lastFetchedAt:'',reviewStatus:'candidate',provenance:'업무원장 명시 근거 · 법제처 API 원문 확인 필요'});
  }
 }
 function enrichData(){
  if(!app.data)return;
  for(const m of app.data.taskMaster||[]){m.workId??=m.taskCode;m.formIds??=formIds(m);m.dueRule??={recurrenceType:m.recurrenceType||'',recurrenceInterval:Number(m.recurrenceInterval)||1,deadlineKind:m.deadlineKind||'management'};addLawSeeds(m)}
  for(const t of app.data.tasks||[]){const m=app.data.taskMaster.find(x=>x.taskCode===(t.masterCode||t.taskCode));t.workId??=t.masterCode||t.taskCode||'';t.scheduleInstanceId??=t.id;t.formIds??=m?.formIds?[...m.formIds]:[];t.taskStatus??=t.completedByUser?'완료':'미완료';t.verificationStatus??=t.requiresReview?'needs_review':'confirmed'}
 }
 const migrateBefore=migrateMasterData;
 migrateMasterData=function(...args){const result=migrateBefore(...args);enrichData();return result};
 const taskBefore=masterToTask;
 masterToTask=function(master,options){const t=taskBefore(master,options);t.workId=master.workId||master.taskCode;t.scheduleInstanceId=t.id;t.formIds=[...(master.formIds||formIds(master))];t.dueRule=JSON.parse(JSON.stringify(master.dueRule||{recurrenceType:master.recurrenceType||'',recurrenceInterval:Number(master.recurrenceInterval)||1,deadlineKind:master.deadlineKind||'management'}));t.taskStatus='미완료';return t};

 const extraContractFields=[
  ['contractId','도급사업 식별번호','text'],
  ['industryRule','업종·주기 구분','select:확인 필요|일반 업종(주 1회·분기 1회)|건설업·제조업 등(2일 1회 순회점검)|건설업·선박 및 보트 건조업(2개월 1회 합동점검)'],
  ['councilApplicable','안전보건협의체 적용','select:확인 필요|해당|비대상'],
  ['patrolApplicable','도급 작업장 순회점검 적용','select:확인 필요|해당|비대상'],
  ['jointApplicable','합동 안전·보건점검 적용','select:확인 필요|해당|비대상']
 ];
 for(const field of extraContractFields)if(!eventDefs.contract.fields.some(x=>x[0]===field[0]))eventDefs.contract.fields.push(field);

 function contractPlans(event){
  const v=event?.data||{},start=v.date||event?.date,end=v.endDate;
  if(!validDay(start)||!validDay(end)||end<start||v.role!=='도급인'||v.contractExemption==='예')return [];
  const common={applyStart:start,applyEnd:end,anchorDate:start,scheduleMode:'period'};
  const plans=[];
  if(v.councilApplicable==='해당')plans.push({code:'CNT-001',...common,recurrenceType:'monthly',recurrenceInterval:1,anchorDate:'',scheduleMode:'day',monthDay:1});
  if(v.patrolApplicable==='해당'){const twoDay=/2일 1회/.test(v.industryRule||'');plans.push({code:'CNT-002',...common,recurrenceType:twoDay?'daily':'weekly',recurrenceInterval:twoDay?2:1,anchorDate:start,weekday:1})}
  if(v.jointApplicable==='해당')plans.push({code:'CNT-003',...common,recurrenceType:/2개월 1회/.test(v.industryRule||'')?'customMonths':'quarterly',recurrenceInterval:/2개월 1회/.test(v.industryRule||'')?2:1,anchorDate:/2개월 1회/.test(v.industryRule||'')?start:''});
  return plans;
 }
 function contractBusinessDue(start,end){
  const custom=app.data.appSettings?.holidays||[];
  const calendar=window.KoreanPublicHolidays;
  if(start===end.slice(0,7)+'-01'&&end===monthEnd(end)&&calendar?.lastBusinessDay){
   return calendar.lastBusinessDay(Number(end.slice(0,4)),Number(end.slice(5,7)),custom);
  }
  let day=end;
  while(day>=start){
   const closed=calendar?.isNonWorkingDay?calendar.isNonWorkingDay(day,custom):[0,6].includes(parseDay(day).getDay())||custom.includes(day);
   if(!closed)return day;
   day=addDays(day,-1);
  }
  // A contract period with no weekday needs a human scheduling decision.
  return end;
 }
 function contractPlannedDate(plan,period){
  if(plan.recurrenceType==='monthly')return period.planned;
  const custom=app.data.appSettings?.holidays||[],calendar=window.KoreanPublicHolidays;
  let day=period.planned;
  while(day<=period.periodEnd){
   const closed=calendar?.isNonWorkingDay?calendar.isNonWorkingDay(day,custom):[0,6].includes(parseDay(day).getDay())||custom.includes(day);
   if(!closed)return day;
   day=addDays(day,1);
  }
  return period.planned;
 }
 function contractDeadlineSource(label,due){
  const year=Number(String(due).slice(0,4));
  const checked=window.KoreanPublicHolidays?.hasFullYearData?.(year);
  return label+' · 법정 제출기한 아님'+(checked?'':' · 해당 연도 공휴일 자료 확인 필요');
 }
 function syncContractSchedules(from,to){
  if(!app.data)return 0;
  const today=localToday(),view=isoDate(app.calendarDate),defaultTo=shiftMonths((today>view?today:view).slice(0,7)+'-01',24),suppressed=new Set(app.data.appSettings?.suppressed||[]),existing=new Map(app.data.tasks.filter(t=>t.occurrenceKey).map(t=>[t.occurrenceKey,t]));let count=0;
  for(const event of app.data.triggerEvents.filter(e=>e.type==='contract')){
   const v=event.data||{},contractId=(v.contractId||event.id).trim?.()||event.id;let eventCount=0;
   for(const plan of contractPlans(event)){
    const source=app.data.taskMaster.find(m=>m.taskCode===plan.code);if(!source)continue;
    const m={...source,...plan,targetId:'contract:'+contractId,applicability:'yes',active:true,formIds:explicitForms[plan.code]||source.formIds||formIds(source)};
    const rangeFrom=from&&from>plan.applyStart?from:plan.applyStart,rangeTo=[to||defaultTo,plan.applyEnd].sort()[0];if(rangeFrom>rangeTo)continue;
    for(const p of recurrencePeriods(m,rangeFrom,rangeTo,app.data.appSettings?.holidays||[])){
     const key=occurrenceKey(m,p.key);if(suppressed.has(key))continue;
     const saved=existing.get(key);
     const due=contractBusinessDue(p.periodStart,p.periodEnd),planned=contractPlannedDate(m,p);
     if(saved){eventCount++;if(!saved.completedByUser&&!saved.userModified){if(planned>=today)saved.date=planned;saved.managementDue=due;saved.dueDate=due;saved.periodStart=p.periodStart;saved.periodEnd=p.periodEnd;saved.deadlineSource=contractDeadlineSource('주기 내 평일 이행관리 최종일',due)}continue}
     const t=masterToTask(m,{date:planned,sourceEventId:event.id,requiresReview:false});
     Object.assign(t,{id:'occ-'+key,scheduleInstanceId:'occ-'+key,occurrenceKey:key,contractSchedule:true,contractId,periodStart:p.periodStart,periodEnd:p.periodEnd,managementDue:due,originalDate:planned,originalDueDate:due,dueDate:due,deadlineKind:'management',deadlineSource:contractDeadlineSource('주기 내 평일 이행관리 최종일',due),recurrenceType:m.recurrenceType,recurrenceInterval:m.recurrenceInterval,recurrenceLabel:plan.code==='CNT-001'?'월 1회 이상':plan.code==='CNT-002'?(m.recurrenceInterval===2?'2일에 1회 이상':'1주일에 1회 이상'):(m.recurrenceType==='customMonths'?'2개월에 1회 이상':'분기 1회 이상'),targetId:m.targetId,forms:source.relatedForms,formIds:[...m.formIds],legalVerification:source.legalVerification||'법령 검증 필요',changes:[]});
     app.data.tasks.push(t);app.syncChecklist(t);app.history(t.id,'도급사업 '+contractId+'의 적용 확인값으로 자동일정 생성');existing.set(key,t);eventCount++;count++;
    }
   }
   event.autoScheduleCount=eventCount;event.applicabilityStatus=['councilApplicable','patrolApplicable','jointApplicable'].some(k=>v[k]==='확인 필요'||!v[k])?'적용 여부 확인 필요':'확인값 반영';
  }
  return count;
 }
 function syncContractCandidates(from,to){
  if(!app.data)return 0;
  const today=localToday(),view=isoDate(app.calendarDate),viewMonth=view.slice(0,7)+'-01';
  const end=to||shiftMonths((today>view?today:view).slice(0,7)+'-01',24);
  const suppressed=new Set(app.data.appSettings?.suppressed||[]),existing=new Map(app.data.tasks.filter(t=>t.contractScheduleCandidate).map(t=>[t.occurrenceKey,t]));
  const patterns=[['CNT-001','monthly','월 1회 이상'],['CNT-002','weekly','주 1회 이상'],['CNT-003','quarterly','분기 1회 이상']];
  let count=0;
  for(const [code,recurrenceType,label] of patterns){
   const source=app.data.taskMaster.find(m=>m.taskCode===code);
   if(!source?.active||source.applicability==='no'||source.applicability==='yes')continue;
   const firstOfPeriod=recurrenceType==='weekly'?monday(today):recurrenceType==='quarterly'?today.slice(0,4)+'-'+String(Math.floor((Number(today.slice(5,7))-1)/3)*3+1).padStart(2,'0')+'-01':today.slice(0,7)+'-01';
   const start=from||(viewMonth<today.slice(0,7)+'-01'?viewMonth:firstOfPeriod);
   const plan={...source,recurrenceType,recurrenceInterval:1,anchorDate:'',applyStart:recurrenceType==='weekly'?monday(start):start,applyEnd:'',scheduleMode:recurrenceType==='monthly'?'day':'period',monthDay:1,weekday:1};
   for(const p of recurrencePeriods(plan,start,end,app.data.appSettings?.holidays||[])){
    const key='contract-candidate|'+occurrenceKey(source,p.key);
    if(suppressed.has(key))continue;
    if(contractActualInPeriod(code,p))continue;
    const due=contractBusinessDue(p.periodStart,p.periodEnd),planned=contractPlannedDate(plan,p),saved=existing.get(key);
    if(saved){
     if(!saved.userModified&&!saved.completedByUser){saved.date=planned;saved.dueDate=due;saved.managementDue=due;saved.periodStart=p.periodStart;saved.periodEnd=p.periodEnd;saved.deadlineSource=contractDeadlineSource('도급 적용 여부 확인 전 평일 이행관리 최종일',due)}
     continue;
    }
    const t=masterToTask(source,{date:planned,dueDate:due,requiresReview:true});
    Object.assign(t,{id:'occ-'+key,scheduleInstanceId:'occ-'+key,occurrenceKey:key,contractScheduleCandidate:true,periodStart:p.periodStart,periodEnd:p.periodEnd,managementDue:due,originalDate:planned,originalDueDate:due,dueDate:due,deadlineKind:'management',deadlineSource:contractDeadlineSource('도급 적용 여부 확인 전 평일 이행관리 최종일',due),recurrenceType,recurrenceInterval:1,recurrenceLabel:label,targetId:'school-default',target:'도급 사업장 · 적용 여부 확인',description:source.description+'\n도급인 지위와 관계수급인 근로자의 실제 작업 여부를 확인한 뒤 적용하세요. 해당 도급사업을 등록하면 계약별 일정으로 관리합니다.',memo:'도급사업 등록 전 적용 여부 확인용 일정입니다. 도급관계가 없으면 법정 의무로 보지 않습니다.',formIds:[...source.formIds],alertDays:'',changes:[]});
    app.data.tasks.push(t);app.syncChecklist(t);existing.set(key,t);count++;
   }
  }
  return count;
 }
 function contractActualInPeriod(code,p){
  return app.data.tasks.some(t=>t.masterCode===code&&!t.contractScheduleCandidate&&(t.contractSchedule||t.sourceEventId||t.targetId==='school-default')&&(t.periodStart||t.date||'9999')<=p.periodEnd&&(t.periodEnd||t.date||'0000')>=p.periodStart);
 }
 function alignMonthlySchedules(){
  for(const m of app.data.taskMaster||[]){
   if(m.taskCode==='CHK-002'&&m.active&&m.applicability==='yes'&&m.recurrenceType==='monthly'&&m.scheduleMode==='lastBusiness'){
    m.scheduleMode='day';m.monthDay=1;
   }
  }
  for(const t of app.data.tasks||[]){
   const m=app.data.taskMaster.find(x=>x.taskCode===t.masterCode);
   if(t.masterCode!=='CHK-002'||!m?.active||m.applicability!=='yes'||m.recurrenceType!=='monthly'||m.scheduleMode!=='day'||Number(m.monthDay)!==1||t.contractSchedule||t.contractScheduleCandidate||t.sourceEventId||t.userModified||t.completedByUser||!validDay(t.periodStart)||!validDay(t.periodEnd))continue;
   const scheduled=t.periodStart.slice(0,7)+'-01',due=contractBusinessDue(t.periodStart,t.periodEnd);
   if(t.date!==scheduled||t.dueDate!==due){
    t.changes??=[];t.changes.push({at:new Date().toISOString(),before:{date:t.date,dueDate:t.dueDate},after:{date:scheduled,dueDate:due},reason:'월간 일정일과 평일 관리마감 규칙 반영'});
    t.date=scheduled;t.dueDate=due;t.managementDue=due;t.deadlineKind='management';
   }
   t.deadlineSource=contractDeadlineSource('월간 주기 내 평일 이행관리 최종일',due);
  }
 }
 const ensureBefore=ensureSchedules;
 ensureSchedules=function(...args){alignMonthlySchedules();const base=ensureBefore(...args);enrichData();alignMonthlySchedules();return base+syncContractSchedules(...args)+syncContractCandidates(...args)};
 const visibleBeforeContract=visibleSchedule;
 visibleSchedule=function(t,...args){if(t.contractScheduleCandidate&&!t.completedByUser&&contractActualInPeriod(t.masterCode,{periodStart:t.periodStart,periodEnd:t.periodEnd}))return false;return visibleBeforeContract(t,...args)};
 const taskDateBeforeContract=taskDate;
 taskDate=function(t){return t.contractScheduleCandidate?t.date:taskDateBeforeContract(t)};
 const statusBeforeContract=statusOf;
 statusOf=function(t){return t.contractScheduleCandidate&&!t.completedByUser?'확인필요':statusBeforeContract(t)};
 const timingBeforeContract=performanceTimingHtml;
 performanceTimingHtml=function(t){
  const monthlyReport=t.masterCode==='CHK-002'&&t.periodStart&&t.periodEnd&&t.dueDate;
  if(!t.contractSchedule&&!t.contractScheduleCandidate&&!monthlyReport)return timingBeforeContract(t);
  const due=t.dueDate||t.managementDue||'';
  const periodLabel=monthlyReport?'업무 수행기간':'점검·수행기간';
  return `<span class="performance-range">${periodLabel}: ${escapeHtml(t.periodStart||'확인 필요')} ~ ${escapeHtml(t.periodEnd||'확인 필요')}</span><span class="performance-remaining"><b>관리상 최종일 ${escapeHtml(due||'확인 필요')}</b> · ${t.completedByUser?'완료':escapeHtml(dDay(due))}</span><small>${escapeHtml(t.deadlineSource||'주기 내 이행을 위한 관리 일정 · 법정 제출기한 아님')}</small>`;
 };
 const eventFormBefore=openEventForm;
 openEventForm=function(kind){
  eventFormBefore(kind);if(kind!=='contract')return;
  const form=document.getElementById('eventForm');if(!form)return;
  form.querySelector('[name="endDate"]')?.setAttribute('required','');
  form.querySelector('[name="role"]')?.setAttribute('required','');
  for(const code of CONTRACT_CODES)form.querySelector(`[name="selectedCodes"][value="${code}"]`)?.closest('label')?.remove();
  form.insertAdjacentHTML('afterend','<div class="notice" style="margin-top:12px">세 의무는 위 적용 여부를 <b>해당</b>으로 확인한 경우에만 사업별·주기별 자동 생성됩니다. 확인 필요 또는 비대상은 무조건 일정으로 만들지 않습니다.</div>');
 };
 const submitBefore=submitEvent;
 submitEvent=async function(){const form=document.getElementById('eventForm'),kind=form?.dataset.kind;if(kind==='contract'){const start=form.querySelector('[name="date"]')?.value,end=form.querySelector('[name="endDate"]')?.value;if(start&&end&&end<start){toast('도급사업 종료일은 시작일 이후여야 합니다.');return}}await submitBefore();if(kind==='contract'){const added=syncContractSchedules();await app.save();render();if(added)toast('적용 확인된 도급업무 자동일정 '+added+'건을 생성했습니다.')}};

 function taskMaster(t){return app.data.taskMaster.find(m=>m.taskCode===(t?.masterCode||t?.taskCode))}
 function payloadFor(t,formId){
  const m=taskMaster(t),school=suiteData().school||{},period=t.periodStart&&t.periodEnd?`${t.periodStart} ~ ${t.periodEnd}`:'';
  const scheduled=t.date||localToday();
  return {formId,workId:t.workId||m?.taskCode||'',scheduleInstanceId:t.scheduleInstanceId||t.id,prefill:{schoolName:school.name==='○○학교'?'':school.name,inspectorName:school.owner||t.responsible||'',docDate:scheduled,inspectionDate:scheduled,meetingDate:scheduled,eduDate:scheduled,occurDate:scheduled,hireDate:scheduled,dateTime:scheduled,dates:{1:scheduled},targetPeriod:period,taskName:taskDisplay(t).title,workName:taskDisplay(t).title,taskDetails:t.description||'',managementDue:t.managementDue||'',contractorCompany:app.data.triggerEvents.find(e=>e.id===t.sourceEventId)?.data?.company||''}};
 }
 function legalQuestion(t){const m=taskMaster(t),refs=(m?.legalReferences||[]).map(r=>`${r.lawName} 제${r.article}조${r.paragraph?' 제'+r.paragraph+'항':''}${r.item?' 제'+r.item+'호':''}`).join(', ');return `[업무번호 ${t.workId||m?.taskCode||'미지정'}] ${taskDisplay(t).title}에 대해 설명해 주세요.\n업무 내용: ${t.description||m?.description||'미입력'}\n실시주기·관리기간: ${t.recurrenceLabel||m?.recurrenceLabel||'확인 필요'} / ${t.periodStart||'미지정'}~${t.periodEnd||'미지정'}\n이행관리 최종일: ${t.managementDue||'미지정'}\n업무원장 법령 후보: ${refs||m?.sourceArticle||'연결 근거 확인 필요'}\n관련 서식: ${(t.formIds||m?.formIds||[]).join(', ')||'연결 서식 없음'}\n법령 원문, 교육청 지침, AI 설명을 구분하고 수행 이유·수행 주체·주기·관련 조항·주의사항을 알려 주세요.`}
 const openTaskBefore=openTask;
 openTask=function(id){
  openTaskBefore(id);
  const t=app.data.tasks.find(x=>x.id===id),drawer=document.querySelector('.drawer-body');
  if(!t||!drawer||drawer.closest('.incident-task-drawer'))return;
  const overview=[...drawer.querySelectorAll('.detail-section')].find(s=>s.querySelector('h4')?.textContent.includes('이번에 해야 할 일'));
  if(!overview)return;
  const m=taskMaster(t),workbookOnly=!!m&&usesLawObligationWorkbook(t,m,taskDisplay(t));
  const forms=[...drawer.querySelectorAll('.detail-section')].find(s=>s.querySelector('h4')?.textContent.includes('관련 서식'));
  if(m){
   t.workId??=m.taskCode;t.scheduleInstanceId??=t.id;t.formIds??=m.formIds||formIds(m);
   if(forms&&!workbookOnly){forms.innerHTML=`<h4>④ 관련 서식</h4>${t.formIds.length?t.formIds.map(fid=>`<div class="linked-form-row"><strong>${escapeHtml(formTitle[fid]||fid)}</strong><small>서식 ID ${escapeHtml(fid)} · 업무 ID ${escapeHtml(t.workId)}</small><button class="btn primary" data-open-linked-form="${escapeHtml(t.id)}" data-form-id="${escapeHtml(fid)}">서식 자동작성</button></div>`).join(''):'<p class="notice">연결 서식 없음 · 서식 매칭 필요</p>'}<p class="subtle">선택한 일정의 학교명·점검일·대상기간·담당자를 서식에 전달합니다. 서식 저장 이력은 이 일정에 기록됩니다.</p>`}
   const verify=t.legalVerificationStatus==='confirmed';
   drawer.insertAdjacentHTML('beforeend',`<section class="detail-section task-integration"><h4>업무 연계와 확인 상태</h4>${t.contractSchedule?`<p><b>도급사업 ID:</b> ${escapeHtml(t.contractId)}<br><b>실시 예정일:</b> ${escapeHtml(t.date)}<br><b>법정주기 이행관리기한:</b> ${escapeHtml(t.managementDue)} · ${escapeHtml(dDay(t.managementDue))}<br><small>주기 내 이행을 위한 관리상 최종일이며 법정 제출기한이 아닙니다.</small></p>`:''}<p><b>법령·지침 근거:</b> ${verify?'담당자 확인':'미확인'} · <b>업무:</b> ${t.completedByUser?'완료':'미완료'}</p><div class="law-actions"><button class="btn primary" data-ask-task="${escapeHtml(t.id)}">AI에게 법령·업무 문의</button><button class="btn" data-confirm-task-legal="${escapeHtml(t.id)}" ${verify?'disabled':''}>${verify?'근거 확인 완료':'법령·지침 근거 확인'}</button></div>${(t.linkedFormDocuments||[]).length?'<p class="subtle">저장된 연결 문서 '+t.linkedFormDocuments.length+'건 · 최근 '+escapeHtml(new Date(t.linkedFormDocuments.at(-1).savedAt).toLocaleString('ko-KR'))+'</p>':''}</section>`);
  }
  // The task description is the trigger: preserve linked forms for other work.
  const actionText=[...overview.querySelectorAll('.task-overview-sub strong,.task-overview-actions li')].map(el=>el.textContent).join(' ');
  const inspectionTask=/점검(?:표)?\s*(?:실시|수행|진행|작성)/.test(actionText);
  if(inspectionTask&&forms){
   const sub=overview.querySelector('.task-overview-sub');
   const target=sub||overview;
   const actions=document.createElement('div');
   actions.className='task-overview-form-actions';
   if(workbookOnly){
    const workbook=forms.querySelector('[data-law-workbook-download]');
    if(workbook){workbook.textContent='점검표 엑셀 다운로드';actions.append(workbook)}
   }else{
    for(const fid of Array.isArray(t.formIds)?t.formIds:[]){
     const button=document.createElement('button');
     button.className='btn primary';
     button.type='button';
     button.textContent='서식 자동작성';
     button.dataset.openLinkedForm=t.id;
     button.dataset.formId=fid;
     button.setAttribute('aria-label',`${formTitle[fid]||fid} 서식 자동작성`);
     if(t.formIds.length>1){const item=document.createElement('span');item.className='task-overview-form-item';const label=document.createElement('small');label.textContent=formTitle[fid]||fid;item.append(label,button);actions.append(item)}
     else actions.append(button);
    }
   }
   if(actions.childElementCount){if(sub){sub.classList.add('has-form-actions');target.append(actions)}else overview.querySelector('h4')?.after(actions)}
   forms.remove();
  }
  // These sections duplicate the work summary or require checklist steps that are no longer shown.
  for(const section of [...drawer.querySelectorAll('.detail-section')]){
   const heading=section.querySelector('h4')?.textContent.trim().replace(/^[0-9①-⑳]+\s*/, '')||'';
   if(['일정 및 마감일','반복 회차와 기한 구분','업무 처리 체크리스트','필수 체크리스트'].includes(heading))section.remove();
  }
  const complete=drawer.querySelector('[data-complete]');
  if(complete){complete.disabled=false;complete.textContent='업무 완료';complete.setAttribute('data-checklist-free','')}
  const hasFormSection=!!forms?.isConnected;
  const source=[...drawer.querySelectorAll('.detail-section')].find(s=>s.querySelector('h4')?.textContent.includes('업무 근거'));
  if(source)source.querySelector('h4').textContent=`${hasFormSection?'④':'③'} 업무 근거`;
  const history=[...drawer.querySelectorAll('.detail-section')].find(s=>s.querySelector('h4')?.textContent.includes('처리 이력'));
  if(history)history.querySelector('h4').innerHTML=`<span class="num">${hasFormSection?'5':'4'}</span>처리 이력`;
  const completionHeading=[...drawer.querySelectorAll('h4')].find(h=>h.textContent.includes('완료 처리'));
  if(completionHeading)completionHeading.textContent=`${hasFormSection?'⑥':'⑤'} 완료 처리`;
  if(hasFormSection)forms.querySelector('h4').textContent='③ 관련 서식';
 };
 function isChatScheduleTask(t){return !!(t?.chatDraftId||t?.source?.type==='챗봇 후속업무 제안')}
 function chatScheduleMemo(t){
  return String(t?.memo||t?.description||'')
   .split(/\n\n(?:챗봇 원 질문:|답변에서 제시한 참고 근거|이 일정은 사용자가 지정한 내부 업무 계획입니다\.)/u)[0]
   .trim();
 }
 function openChatScheduleTask(t){
  const memo=chatScheduleMemo(t),state=t.completedByUser?'완료':'예정';
  document.getElementById('overlay').innerHTML=`<div class="drawer-wrap" data-close-overlay><aside class="drawer"><div class="drawer-head"><div><span class="kicker">일정 상세</span><h3 style="margin:4px 0 0">일정 확인</h3></div><button class="close" data-close aria-label="닫기">×</button></div><div class="drawer-body"><h2 class="detail-title">${escapeHtml(t.name||'제목 없는 일정')}</h2><div class="detail-badges">${statusBadge(state)}${typeBadge('개인')}</div><div class="drawer-summary"><div class="summary-cell"><span>대상</span><strong>${escapeHtml(t.target||'미지정')}</strong></div><div class="summary-cell"><span>일정일</span><strong>${fmtDate(t.date)}</strong></div></div>${memo?`<div class="detail-section"><h4>메모</h4><p>${escapeHtml(memo)}</p></div>`:''}<div class="detail-actions"><button class="btn" data-edit-task="${escapeHtml(t.id)}">일정 수정</button>${t.completedByUser?`<button class="btn" data-reopen="${escapeHtml(t.id)}">완료 취소</button>`:`<button class="btn primary" data-complete="${escapeHtml(t.id)}">일정 완료</button>`}<button class="btn danger" data-delete-task="${escapeHtml(t.id)}">일정 삭제</button></div></div></aside></div>`;
 }
 const openTaskBeforeChatSchedule=openTask;
 openTask=function(id){const t=app.data.tasks.find(x=>x.id===id);if(isChatScheduleTask(t))return openChatScheduleTask(t);return openTaskBeforeChatSchedule(id)};
 const openTaskEditBeforeChatSchedule=openTaskEdit;
 openTaskEdit=function(id){
  const t=app.data.tasks.find(x=>x.id===id);if(!isChatScheduleTask(t))return openTaskEditBeforeChatSchedule(id);
  modal('일정 수정',`<form id="taskEdit" class="form-grid" data-id="${escapeHtml(id)}"><div class="field full"><label>일정명</label><input name="name" value="${escapeHtml(t.name||'')}" required></div><div class="field"><label>일정일</label><input type="date" name="date" value="${escapeHtml(t.date||'')}"></div><div class="field"><label>대상</label><input name="target" value="${escapeHtml(t.target||'')}"></div><div class="field full"><label>메모</label><textarea name="memo">${escapeHtml(chatScheduleMemo(t))}</textarea></div></form>`,`<button class="btn" data-close>취소</button><button class="btn primary" data-save-task>저장</button>`);
 };
 window.addEventListener('click',async e=>{
  const formButton=e.target.closest('[data-open-linked-form]');if(formButton){e.preventDefault();e.stopImmediatePropagation();const t=app.data.tasks.find(x=>x.id===formButton.dataset.openLinkedForm);if(!t)return;window.safetyModuleIntegration?.openForm(payloadFor(t,formButton.dataset.formId));return}
  const ask=e.target.closest('[data-ask-task]');if(ask){e.preventDefault();e.stopImmediatePropagation();const t=app.data.tasks.find(x=>x.id===ask.dataset.askTask);if(!t)return;window.safetyModuleIntegration?.openChatbot({workId:t.workId||t.masterCode,scheduleInstanceId:t.id,question:legalQuestion(t)});return}
  const confirmButton=e.target.closest('[data-confirm-task-legal]');if(confirmButton){e.preventDefault();e.stopImmediatePropagation();const t=app.data.tasks.find(x=>x.id===confirmButton.dataset.confirmTaskLegal);if(!t)return;t.legalVerificationStatus='confirmed';t.legalVerifiedAt=new Date().toISOString();app.history(t.id,'담당자가 법령·지침 근거 확인');await app.save();openTask(t.id);toast('이 일정의 근거 확인 상태를 저장했습니다.')}
 },true);
 window.safetyTaskIntegration=Object.freeze({
  onFormSaved:async message=>{const t=app.data.tasks.find(x=>x.id===message.scheduleInstanceId);if(!t)return;t.linkedFormDocuments??=[];if(!t.linkedFormDocuments.some(x=>x.documentId===message.documentId&&x.formId===message.formId))t.linkedFormDocuments.push({formId:message.formId,documentId:message.documentId,title:message.title,savedAt:message.savedAt||new Date().toISOString()});app.history(t.id,'연결 서식 저장 · '+(message.formId||''));await app.save();toast('작성한 서식을 일정 이력에 연결했습니다.')},
  payloadFor,formIds,contractPlans,syncContractSchedules,syncContractCandidates,contractBusinessDue
 });
 window.safetyWorkIntegration=window.safetyTaskIntegration;
})();

;
/* Runtime: app-viewport.js */
// 고정 화면의 높이는 유지하고 팝업을 현재 보이는 위치에 표시한다.
(()=>{let queued=false,last=0;if(parent!==window){document.body.classList.add('host-viewport');addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='safety-host-viewport'&&Number.isFinite(e.data.top)&&Number.isFinite(e.data.height)){document.documentElement.style.setProperty('--host-top',Math.max(0,e.data.top)+'px');document.documentElement.style.setProperty('--host-height',Math.max(1,e.data.height)+'px')}})}function update(){queued=false;const view=document.getElementById('view');const h=document.body.classList.contains('reference-work')?Math.max(941,Math.ceil(view.getBoundingClientRect().bottom+scrollY)):941;if(h!==last){last=h;parent.postMessage({type:'safety-content-height',height:h},'*')}}function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}new ResizeObserver(schedule).observe(document.getElementById('view'));new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});addEventListener('load',schedule);schedule()})();

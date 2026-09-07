// 서식별 기본값 및 점검 항목 프리셋 데이터

export const FORM_METAS = {
  '01-02-01': {
    code: '01-02-01',
    title: '(주1회) 정기점검 실시 및 (월1회) 기관장 보고',
    subtitle: '안전·보건 자체 점검표 (시설관리 / 청소 / 조리 / 학교사정)',
    category: '정기점검'
  },
  '04-01-03': {
    code: '04-01-03',
    title: '공사(용역) 안전·보건 체크리스트(공통)',
    subtitle: '공사·용역 발주 시 사전 안전점검 및 준수서약서',
    category: '도급/공사'
  },
  '04-01-08': {
    code: '04-01-08',
    title: '안전보건협의체 회의록 및 합동점검',
    subtitle: '도급·수급 합동 협의체 회의록 및 분기 합동 안전점검표',
    category: '협의체'
  },
  '05-02-01': {
    code: '05-02-01',
    title: '안전보건교육일지 (현장교육 시)',
    subtitle: '신규채용/정기/특별/작업변경 안전보건교육 및 20인 참석서명부',
    category: '안전교육'
  },
  '09-01-05': {
    code: '09-01-05',
    title: '안전보건 교육일지 (근골격계부담작업)',
    subtitle: '근골격계 질환 예방 교육 및 유해요인조사 교육일지',
    category: '보건관리'
  },
  '10-01-04': {
    code: '10-01-04',
    title: '안전보건교육일지 (MSDS교육)',
    subtitle: '물질안전보건자료 교육 및 취급 화학물질 목록 일지',
    category: '보건관리'
  }
};

// 01-02-01 분야별 체크리스트 프리셋
export const FORM_01_02_01_SECTORS = {
  facility: {
    name: '시설관리 분야',
    items: [
      { category: '안전관리', subcategory: '넘어짐 위험', check: '1. 바닥에 방치물·기름기 등으로 넘어질 위험 여부' },
      { category: '안전관리', subcategory: '넘어짐 위험', check: '2. 전정기, 톱, 전지가위 등의 보관 시 지정된 장소에 보관 여부' },
      { category: '안전관리', subcategory: '떨어짐 위험', check: '1. 사다리의 고정장치와 지지대는 견고한지 여부' },
      { category: '안전관리', subcategory: '떨어짐 위험', check: '2. 사다리 작업, 중량물 취급 등 2인1조 작업 준수 여부' },
      { category: '안전관리', subcategory: '떨어짐 위험', check: '3. 안전난간이 튼튼하게 고정되어 있는지 여부' },
      { category: '안전관리', subcategory: '무너짐 위험', check: '1. 운반물을 쌓아 올리고 내릴 때 적재단의 무너짐 여부' },
      { category: '안전관리', subcategory: '끼임 절단 위험', check: '1. 기계설비의 회전축, 벨트, 체인 등에 방호 덮개 부착 여부' },
      { category: '안전관리', subcategory: '끼임 절단 위험', check: '2. 동력을 이용한 기계·기구의 정비·청소 시 전원, 동력 차단 여부' },
      { category: '안전관리', subcategory: '끼임 절단 위험', check: '3. 동력을 이용한 기계·기구 작업 시 작업자 간 안전거리 유지 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '1. 전동기기 등의 전원공급 전선의 노후화 또는 피복손상 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '2. 이동형 또는 휴대형 전기기계·기구 사용 시 누전차단기 설치 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '3. 정전작업 시 분전함에는 시건장치 및 통전금지 표지 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '4. 분전함 회로별 명칭(실명, 설비명 등)을 표기 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '5. 전선의 접지선로 단선 및 접지형 콘센트 사용 여부' },
      { category: '안전관리', subcategory: '기타 위험', check: '1. 위험기계기구(예초기, 핸드그라인더 등)의 방호커버 부착 여부' },
      { category: '안전관리', subcategory: '기타 위험', check: '2. 유해·위험작업 시 안전모, 안전화 등 개인보호구 착용 여부' },
      { category: '안전관리', subcategory: '기타 위험', check: '3. 작업 또는 점검 장소에 적정한 조명 설치 여부' },
      { category: '보건관리', subcategory: '화학물질 관리', check: '1. 물질안전보건자료(MSDS)의 게시(비치) 및 교육 여부' },
      { category: '보건관리', subcategory: '화학물질 관리', check: '2. 취급 용기 및 포장에 MSDS 경고표지 부착 여부' },
      { category: '보건관리', subcategory: '화학물질 관리', check: '3. 화학제품은 별도 보관장소에 구획하여 보관 여부' },
      { category: '보건관리', subcategory: '화학물질 관리', check: '4. 인화성·가연성 물질 저장/취급장소 소화기 비치 여부' },
      { category: '보건관리', subcategory: '근골격계 예방', check: '1. 근골격계 부담작업 종사자의 작업 자세의 위험 여부' },
      { category: '보건관리', subcategory: '근골격계 예방', check: '2. 근골격계부담 종사자에 대한 유해성 주지(교육 등) 적정성' },
      { category: '보건관리', subcategory: '근골격계 예방', check: '3. 중량물 안내포스터 부착 유무 (5kg 이상 물체를 중량물 취급)' }
    ]
  },
  cleaning: {
    name: '청소(미화) 분야',
    items: [
      { category: '안전관리', subcategory: '넘어짐 위험', check: '1. 청소 후 바닥의 세제·물 등으로 미끄러질 위험 여부' },
      { category: '안전관리', subcategory: '넘어짐 위험', check: '2. 물품, 청소공구 등 지정된 장소에 보관 여부' },
      { category: '안전관리', subcategory: '떨어짐 위험', check: '1. 높은 곳 청소 시 계단식 작업발판 등 사용 여부' },
      { category: '안전관리', subcategory: '떨어짐 위험', check: '2. 사다리를 사용하는 작업에서 2인1조 작업 준수 여부' },
      { category: '안전관리', subcategory: '무너짐/베임', check: '1. 운반 물을 쌓아 올리고 내릴 때 무너짐 여부' },
      { category: '안전관리', subcategory: '무너짐/베임', check: '2. 날카로운 물체 등에 의해 베임·찔림 등 위험 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '1. 청소기 등 전선의 노후화 또는 피복 손상 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '2. 벽면 물 세척 시 전기 누전으로 감전 위험 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '3. 젖은 손으로 전기기구를 취급하여 감전 위험 여부' },
      { category: '안전관리', subcategory: '기타 위험', check: '1. 화학제품을 이용한 청소 시 환기 여부' },
      { category: '안전관리', subcategory: '기타 위험', check: '2. 살균·소독·청소 시 고무장갑, 장화 등 개인보호구 착용 여부' },
      { category: '보건관리', subcategory: '화학물질 관리', check: '1. 사용 세정제의 물질안전보건자료(MSDS) 게시(비치) 여부' },
      { category: '보건관리', subcategory: '화학물질 관리', check: '2. 취급용기 및 포장에 MSDS 경고표지 부착 여부' },
      { category: '보건관리', subcategory: '근골격계 예방', check: '1. 근골격계 부담작업 종사자의 작업자세의 위험 여부' },
      { category: '보건관리', subcategory: '근골격계 예방', check: '2. 중량물 안내포스터 부착 유무 및 운반도구 사용 여부' }
    ]
  },
  kitchen: {
    name: '조리(급식실) 분야',
    items: [
      { category: '안전관리', subcategory: '넘어짐 위험', check: '1. 바닥의 물·기름·물때 등으로 인해 미끄러질 위험 여부' },
      { category: '안전관리', subcategory: '넘어짐 위험', check: '2. 통로 확보 및 통행로에 물품 적재·방치 여부' },
      { category: '안전관리', subcategory: '넘어짐 위험', check: '3. 미끄럼방지용 안전장화·작업화 등 착용 여부' },
      { category: '안전관리', subcategory: '감김·끼임 위험', check: '1. 재료운반대차 및 배식차에 끼일 위험 여부' },
      { category: '안전관리', subcategory: '감김·끼임 위험', check: '2. 양념재료 분쇄기·절단기 및 덤웨이터 방호조치 여부' },
      { category: '안전관리', subcategory: '절단·베임 위험', check: '1. 절단기·분쇄기 칼날 부위 베임방지용 덮개 설치 여부' },
      { category: '안전관리', subcategory: '감전 위험', check: '1. 전기 기계·기구에 감전예방용 접지 상태 여부' },
      { category: '안전관리', subcategory: '기타 위험', check: '1. 뜨거운 물체에 의한 화상방지조치(장갑, 경고표지) 여부' },
      { category: '보건관리', subcategory: '화학물질 관리', check: '1. 물질안전보건자료(MSDS) 게시(비치) 및 경고표지 부착 여부' },
      { category: '보건관리', subcategory: '근골격계 예방', check: '1. 근골격계 부담작업 종사자의 작업자세 및 중량물 취급 수칙 준수' }
    ]
  }
};

// 04-01-03 공사 안전보건 체크리스트 10개 문항
export const FORM_04_01_03_ITEMS = [
  { no: 1, content: '학교(기관)는 과업지시서 또는 계약서에 ‘안전관리 및 예방조치 후 작업’ 실시 내용을 포함하였습니까?' },
  { no: 2, content: '학교(기관)는 공사(용역)업체 사업주(대표자)가 안전보건교육을 실시하였는지 확인하였습니까? (1년 이내 2시간 이상 이수증 확인)' },
  { no: 3, content: '학교(기관)는 공사(용역)업체가 근로자에 대한 정기 또는 특별안전보건교육 실시하였는지 확인하였습니까? (반기별 12시간 이상 등)' },
  { no: 4, content: '학교(기관)는 공사(용역)업체에 안전보호구(안전모, 안전대, 안전화 등)를 지급·착용하고 작업하도록 주지시켰습니까?' },
  { no: 5, content: '학교(기관)는 공사(용역)업체에 학교(기관)의 현장(작업공간) 이동 시나 현장 외 이동 시 학교 안내를 받도록 주지시켰습니까?' },
  { no: 6, content: '학교(기관)는 공사(용역)기관으로부터 과업에 따라 발생 가능한 재해 예방 체크리스트(추락/감전/밀폐/일반)를 제출받았습니까?', isSpecial: true },
  { no: 7, content: '학교(기관)는 공사(용역)업체와 과업 수행 중 예상되는 유해·위험요인에 대해 협의하고 대책을 수립하였습니까?' },
  { no: 8, content: '건설공사의 경우 학교에서의 ‘기술지도 계약’과 업체에서의 ‘산업안전보건관리비 계상’에 대한 안내를 하였습니까?' },
  { no: 9, content: '학교(기관)에서 산업재해가 발생할 경우 해당기관(고용노동부 등)과 학교(기관)에 즉시 보고할 것을 안내하였습니까?' },
  { no: 10, content: '학교(기관)는 과업 수행 중에 추가로 발견되는 유해·위험요인에 대해 학교(기관)와 예방대책에 대해 협의하도록 안내하였습니까?' }
];

/**
 * 산업안전보건 서식 자동 정리 및 요약 서비스
 * 
 * 1. 텍스트/문서 파싱 (녹취록, 회의록, 사고조사자료, 교육자료)
 * 2. 내장 지능형 규칙/키워드 추출 요약 엔진 (API 키 없이도 100% 동작)
 * 3. Google Gemini API 연동 (사용자가 API 키를 설정한 경우 초고품질 생성 AI 요약 지원)
 */

// 로컬 스토리지 키 및 기본 Google Gemini API 키
const GEMINI_API_KEY_STORAGE = 'safety_gemini_api_key';
const DEFAULT_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export function getGeminiApiKey() {
  try {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE) || DEFAULT_GEMINI_API_KEY;
  } catch {
    return DEFAULT_GEMINI_API_KEY;
  }
}

export function setGeminiApiKey(key) {
  try {
    if (!key) {
      localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    } else {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
    }
  } catch (e) {
    console.error('Failed to save Gemini API key', e);
  }
}

/**
 * 녹취록 및 회의/보고 텍스트 정제
 */
export function cleanRawText(rawText) {
  if (!rawText) return '';
  
  return rawText
    // 타임스탬프 제거 (예: [00:12:34], 12:34, (01:23))
    .replace(/\[?\d{1,2}:\d{2}(:\d{2})?\]?/g, '')
    // 괄호 안의 불필요한 소리/잡음 태그 제거 (예: (웃음), (박수), [잡음])
    .replace(/[\[(](웃음|박수|잡음|한숨|침묵|음성|녹음)[\])]/g, '')
    // 다중 공백 및 빈 줄 정리
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

/**
 * 텍스트에서 주요 발언/문장 추출
 */
function extractSentences(text) {
  const cleaned = cleanRawText(text);
  // 줄바꿈 또는 온점/물음표/느낌표 기준으로 문장 분리
  const rawSentences = cleaned
    .split(/\n+|(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
  return rawSentences;
}

/**
 * 내장 지능형 요약 엔진 (서식별 특화 템플릿 정리)
 */
export function summarizeWithBuiltInEngine(formCode, rawText) {
  const sentences = extractSentences(rawText);
  if (sentences.length === 0) {
    throw new Error('분석할 수 있는 텍스트 내용이 부족합니다.');
  }

  switch (formCode) {
    case '04-01-08': {
      // 04-01-08 안전보건협의체 회의록 및 합동점검: 협의 내용 등 (협의안건, 건의사항 및 조치)
      const agendaKeywords = ['안건', '회의', '점검', '안전', '보건', '사다리', '보호구', '착용', '위험', '작업', '협의', '추락', '화재', '점검', '규정'];
      const suggestKeywords = ['건의', '요구', '요청', '개선', '필요', '부탁', '지원', '수리', '보수', '설치', '교체', '조치', '의견'];

      const agendas = [];
      const suggestions = [];

      sentences.forEach(s => {
        // 화자 접두사 정리 (예: 홍길동: ..., 관리자: ...)
        const content = s.replace(/^[가-힣A-Za-z0-9_\s]{2,10}\s*[:：]\s*/, '').trim();
        if (suggestKeywords.some(k => content.includes(k))) {
          if (!suggestions.includes(content) && suggestions.length < 5) {
            suggestions.push(content);
          }
        } else if (agendaKeywords.some(k => content.includes(k))) {
          if (!agendas.includes(content) && agendas.length < 5) {
            agendas.push(content);
          }
        }
      });

      // 만약 분류가 비어있으면 상위 문장 분배
      if (agendas.length === 0) {
        agendas.push(...sentences.slice(0, 3).map(s => s.replace(/^[가-힣A-Za-z0-9_\s]{2,10}\s*[:：]\s*/, '')));
      }
      if (suggestions.length === 0) {
        suggestions.push(...sentences.slice(3, 5).map(s => s.replace(/^[가-힣A-Za-z0-9_\s]{2,10}\s*[:：]\s*/, '')));
      }

      const formattedAgendas = agendas.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
      const formattedSuggestions = suggestions.map((item, idx) => `${idx + 1}. ${item}`).join('\n');

      return {
        agendas: formattedAgendas || '1. 작업장 안전보건 수칙 준수 점검\n2. 보호구 착용 및 안전시설 보강 협의\n3. 계절별 위험요인 사전 예방활동 전개',
        suggestions: formattedSuggestions || '1. 현장 안전보호구 추가 지급 요청\n2. 노후 안전 표지판 교체 및 보수 요망'
      };
    }

    case '05-02-01': {
      // 05-02-01 안전보건교육일지: 교육내용
      const keyPoints = [];
      const topics = ['안전', '보건', '예방', '사고', '수칙', '위험', '작업', '관리', '보호구', '응급', '건강'];

      sentences.forEach(s => {
        const clean = s.replace(/^[가-힣A-Za-z0-9_\s]{2,10}\s*[:：]\s*/, '').trim();
        if (topics.some(t => clean.includes(t)) && !keyPoints.includes(clean) && keyPoints.length < 5) {
          keyPoints.push(clean);
        }
      });

      if (keyPoints.length === 0) {
        keyPoints.push(...sentences.slice(0, 4));
      }

      const formatted = keyPoints.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
      return {
        eduContent: formatted || '1. 산업안전보건법령 및 기본 안전수칙에 관한 사항\n2. 작업장 내 주요 위험요인 및 사고 예방대책\n3. 올바른 개인보호구 지급 및 착용 기준\n4. 비상상황 발생 시 응급조치 요령'
      };
    }

    case '06-02-01': {
      // 06-02-01 산업재해조사표 및 예시: 재해발생 당시 상황, 재해발생원인, 재발방지계획
      const situationSentences = [];
      const reasonSentences = [];
      const planSentences = [];

      sentences.forEach(s => {
        const clean = s.replace(/^[가-힣A-Za-z0-9_\s]{2,10}\s*[:：]\s*/, '').trim();
        if (clean.includes('대책') || clean.includes('방지') || clean.includes('개선') || clean.includes('계획') || clean.includes('교육')) {
          if (planSentences.length < 3) planSentences.push(clean);
        } else if (clean.includes('원인') || clean.includes('이유') || clean.includes('미흡') || clean.includes('부주의') || clean.includes('불량') || clean.includes('미착용')) {
          if (reasonSentences.length < 3) reasonSentences.push(clean);
        } else {
          if (situationSentences.length < 3) situationSentences.push(clean);
        }
      });

      return {
        occurSituation: situationSentences.join(' ') || sentences.slice(0, 2).join(' ') || '작업 수행 중 미끄러운 바닥 또는 설비 불안전 상태로 인해 사고 발생.',
        occurReason: reasonSentences.map((r, i) => `${i + 1}) ${r}`).join('\n') || '1) 인적요인: 안전수칙 미준수 및 보호구 착용 소홀\n2) 환경요인: 작업장 바닥 물기 잔류 및 방호조치 미비',
        preventPlan: planSentences.map((p, i) => `${i + 1}) ${p}`).join('\n') || '1) 작업환경 개선: 바닥 미끄럼 방지 조치 및 정리정돈 강화\n2) 안전교육: 동종 재해 예방 특별 안전교육 실시 및 2인 1조 작업 준수'
      };
    }

    case '06-02-02': {
      // 06-02-02 중대재해 발생보고: 재해발생 인지경위, 재해발생경위, 조치 및 전망
      const perceive = sentences.find(s => s.includes('보고') || s.includes('인지') || s.includes('발견') || s.includes('목격') || s.includes('연락'));
      const plan = sentences.filter(s => s.includes('병원') || s.includes('이송') || s.includes('조치') || s.includes('신고') || s.includes('경찰') || s.includes('소방') || s.includes('중지'));

      const rest = sentences.filter(s => s !== perceive && !plan.includes(s));

      return {
        perceiveReason: perceive || '현장 동료 근로자에 의해 사고 목격 및 관리자에게 즉시 유선 보고 접수.',
        occurDescription: rest.slice(0, 3).join('\n') || '작업장 내에서 정규 작업 진행 중 불안전한 상태 및 행동에 의해 재해 발생.',
        actionAndProspect: plan.length > 0 ? plan.join('\n') : '119 긴급 후송 조치 완료 및 병원 진료 중, 해당 작업 즉시 중지 및 2차 사고 방지 조치 시행.'
      };
    }

    case '06-02-03': {
      // 06-02-03 재발방지 계획서: 재해발생원인, 재발방지계획(단기적 대책, 장기적 대책)
      const reasons = sentences.filter(s => s.includes('원인') || s.includes('미흡') || s.includes('결함') || s.includes('미착용') || s.includes('부주의'));
      const shortTerm = sentences.filter(s => s.includes('즉시') || s.includes('청소') || s.includes('교육') || s.includes('점검') || s.includes('착용'));
      const longTerm = sentences.filter(s => s.includes('보수') || s.includes('교체') || s.includes('설치') || s.includes('규정') || s.includes('체계') || s.includes('도입'));

      return {
        occurReason: (reasons.length > 0 ? reasons.map((r, i) => `${i + 1}. ${r}`).join('\n') : '') || '1. 인적 요인: 작업 절차 미준수 및 개인보호구 착용 미흡\n2. 설비/환경 요인: 작업장 바닥 미끄럼 및 방호설비 점검 부족',
        shortTermPlan: (shortTerm.length > 0 ? shortTerm.map((s, i) => `${i + 1}. ${s}`).join('\n') : '') || '1. 현장 즉시 정리정돈 및 위험구역 안전표지 부착\n2. 전 근로자 대상 사고사례 전파 및 특별 안전보건교육 실시',
        longTermPlan: (longTerm.length > 0 ? longTerm.map((l, i) => `${l}`).join('\n') : '') || '1. 노후 설비 및 미끄럼 방지 바닥재 전면 개보수\n2. 정기 위험성평가 주기 단축 및 안전보건관리 체계 고도화'
      };
    }

    case '09-01-05': {
      // 09-01-05 안전보건 교육일지(근골격계부담작업): 교육내용
      const musculoPoints = sentences.filter(s => 
        s.includes('근골격계') || s.includes('부담') || s.includes('자세') || s.includes('중량물') || s.includes('스트레칭') || s.includes('증상') || s.includes('예방')
      );

      const items = musculoPoints.length >= 2 ? musculoPoints : sentences.slice(0, 5);
      const formatted = items.map((item, idx) => `${idx + 1}. ${item.replace(/^[가-힣A-Za-z0-9_\s]{2,10}\s*[:：]\s*/, '')}`).join('\n');

      return {
        eduContent: formatted || '1. 근골격계부담작업의 유해요인 및 위험성 이해\n2. 근골격계질환의 초기 징후와 증상별 대처요령\n3. 중량물 취급 시 올바른 작업자세 및 보조도구 활용법\n4. 작업 전후 스트레칭 및 피로 회복 관리 방법'
      };
    }

    case '10-01-04': {
      // 10-01-04 안전보건 교육일지(MSDS교육): 교육내용
      // 화학물질 추출 시도 (예: 락스, 세척제, 시너, 알코올, 염소산, 오븐크리너 등)
      const chemicalMatches = rawText.match(/([가-힣a-zA-Z0-9]+(세척제|소독제|크리너|락스|알코올|시너|약품|에탄올|가성소다|기름|오일|세제))/g) || [];
      const uniqueChems = [...new Set(chemicalMatches)].slice(0, 5);

      const msdsPoints = sentences.filter(s => 
        s.includes('화학') || s.includes('물질') || s.includes('MSDS') || s.includes('보호구') || s.includes('경고') || s.includes('응급') || s.includes('취급')
      );

      const items = msdsPoints.length >= 2 ? msdsPoints : sentences.slice(0, 5);
      const formatted = items.map((item, idx) => `${idx + 1}. ${item.replace(/^[가-힣A-Za-z0-9_\s]{2,10}\s*[:：]\s*/, '')}`).join('\n');

      return {
        eduContent: formatted || '1. 취급 화학물질(세척제, 소독제 등)의 명칭 및 유해위험성\n2. 취급 시 주의사항 및 필수 개인보호구 착용법\n3. 누출 또는 신체 접촉 시 비상 응급조치 요령\n4. 물질안전보건자료(MSDS) 경고표지 확인 및 게시 장소',
        detectedChemicals: uniqueChems
      };
    }

    default:
      return {
        summary: sentences.slice(0, 4).join('\n')
      };
  }
}

/**
 * Google Gemini API를 이용한 정밀 생성형 요약
 */
export async function summarizeWithGemini(apiKey, formCode, rawText) {
  if (!apiKey) {
    throw new Error('Gemini API 키가 입력되지 않았습니다.');
  }

  const formPrompts = {
    '04-01-08': `
당신은 서울시교육청 산업안전보건 전문가입니다.
제공된 안전보건협의체 회의 자료/녹취록을 바탕으로 회의록에 들어갈 [협의안건]과 [건의사항 및 기타 협의]를 깔끔한 개조식 문체로 요약 정리해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "agendas": "1. 사다리 작업 시 2인 1조 작업 및 안전모 착용 철저\\n2. 보호구 지급대장 작성 및 관리 점검\\n3. ...",
  "suggestions": "1. 미화 휴게실 노후 냉난방기 점검 및 수리 요청\\n2. ..."
}`,
    '05-02-01': `
당신은 서울시교육청 산업안전보건 전문가입니다.
제공된 교육 자료 또는 녹취록을 바탕으로 안전보건교육일지의 [교육내용]을 공문서 개조식(1. 2. 3. 형태)으로 핵심만 명확하게 요약 정리해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "eduContent": "1. 산업안전 및 작업장 사고 예방에 관한 사항\\n2. 물질안전보건자료 및 보호구 착용 요령\\n3. ..."
}`,
    '06-02-01': `
당신은 산업재해 조사 전문가입니다.
제공된 재해 관련 자료 또는 진술 텍스트를 분석하여 산업재해조사표의 세 항목을 작성해주세요:
1. occurSituation: 재해발생 당시 상황 (어떤 작업을 하던 중 무엇 때문에 사고가 났는지 구체적 기술)
2. occurReason: 재해발생원인 (인적/설비적/환경적 요인 분석을 개조식으로)
3. preventPlan: 재발방지계획 (향후 대책을 개조식으로)
반드시 아래 JSON 형식으로만 응답하세요:
{
  "occurSituation": "2024년 OO월 OO일 급식실 조리실에서...",
  "occurReason": "1. 바닥 미끄럼 방지 조치 미흡\\n2. 급격한 이동 중 주의 소홀",
  "preventPlan": "1. 미끄럼 방지 안전화 착용 의무화\\n2. 작업 전 바닥 수시 청소 및 물기 제거"
}`,
    '06-02-02': `
당신은 중대재해 발생보고 작성 전문가입니다.
제공된 사고 발생 기록 또는 녹취 자료를 분석하여 아래 세 항목을 작성해주세요:
1. perceiveReason: 재해발생 인지경위 (최초 발견자 및 상황 전파 경위)
2. occurDescription: 재해발생경위 (육하원칙에 입각한 상세 서술)
3. actionAndProspect: 조치 및 전망 (응급후송, 병원 진료, 작업중지, 향후 조치)
반드시 아래 JSON 형식으로만 응답하세요:
{
  "perceiveReason": "...",
  "occurDescription": "...",
  "actionAndProspect": "..."
}`,
    '06-02-03': `
당신은 재발방지 계획서 수립 전문가입니다.
제공된 사고 조사 자료를 분석하여 아래 세 항목을 작성해주세요:
1. occurReason: 재해발생원인 (인적, 설비적, 작업환경적, 관리적 원인)
2. shortTermPlan: 단기적 대책 (즉시 개선 및 시행 가능한 조치)
3. longTermPlan: 장기적 대책 (시설·장비 개선 및 체계 구축)
반드시 아래 JSON 형식으로만 응답하세요:
{
  "occurReason": "...",
  "shortTermPlan": "...",
  "longTermPlan": "..."
}`,
    '09-01-05': `
당신은 근골격계질환 예방 전문가입니다.
제공된 교육 자료 또는 녹취록을 바탕으로 근골격계부담작업 안전보건교육일지의 [교육내용]을 공문서 개조식(1. 2. 3. 형태)으로 요약 정리해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "eduContent": "1. 근골격계 부담작업의 유해요인 및 위험성\\n2. 올바른 인양 자세 및 중량물 취급 수칙\\n3. ..."
}`,
    '10-01-04': `
당신은 화학물질 및 MSDS 교육 전문가입니다.
제공된 교육 자료 또는 녹취록을 분석하여:
1. eduContent: MSDS 교육내용 요약 (1. 2. 3. 개조식)
2. detectedChemicals: 자료에서 언급된 취급 화학물질/세척제/소독제 명칭 배열 (예: ["락스", "식판세척제", "오븐크리너"])
반드시 아래 JSON 형식으로만 응답하세요:
{
  "eduContent": "1. 취급 유해물질의 특성 및 인체 유해성\\n2. 필수 보호구(고무장갑, 보안경) 착용 요령\\n3. ...",
  "detectedChemicals": ["오븐크리너", "살균소독제"]
}`
  };

  const systemInstruction = formPrompts[formCode] || formPrompts['05-02-01'];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${systemInstruction}\n\n[제공된 자료 원문]:\n${rawText}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini API 요청 실패 (HTTP ${response.status})`);
  }

  const result = await response.json();
  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse) {
    throw new Error('Gemini API 응답 결과가 비어있습니다.');
  }

  try {
    const parsed = JSON.parse(textResponse);
    return parsed;
  } catch {
    // 마크다운 코드블록 제거 후 재시도
    const cleanedJson = textResponse.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanedJson);
  }
}

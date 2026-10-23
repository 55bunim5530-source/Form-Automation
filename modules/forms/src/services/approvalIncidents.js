import { value, join, date } from './approvalHelpers.js';

const riskFactors = [
  ['fall', '떨어짐'], ['slip', '넘어짐'], ['shock', '감전'], ['hit', '부딪힘/맞음'],
  ['heavy', '중량물 취급작업'], ['jam', '끼임'], ['cut', '절단·베임·긁힘·찔림'],
  ['gas', '중독·질식'], ['heat', '온열질환(열사병)'], ['burn', '화상/피부/호흡기'],
  ['fire', '화재·폭발'], ['etc', '그 외']
];

const checklistSectors = {
  office: { name: '사무직', count: 19 },
  lab: { name: '실험실', count: 12 },
  cleaning: { name: '청소', count: 15 },
  guard: { name: '당직/경비', count: 9 }
};

const hasText = input => value(input, '') !== '';
const inputRows = (input, fields) => (Array.isArray(input) ? input : [])
  .filter(row => row && typeof row === 'object' && fields.some(field => hasText(row[field])));

// Use only explicitly stored responses. Form example rows and sample results are not defaults here.
function workerOpinions(data) {
  if (data.activeTab === 'example2') {
    const sectorKey = Object.hasOwn(checklistSectors, data.checklistSector) ? data.checklistSector : 'office';
    const sector = checklistSectors[sectorKey];
    const answers = data[`chkAnswers_${sectorKey}`] || {};
    const responses = Array.from({ length: sector.count }, (_, index) => ({
      number: index + 1,
      answer: answers[index]
    })).filter(item => item.answer === 'O' || item.answer === 'X');
    const oCount = responses.filter(item => item.answer === 'O').length;
    const xCount = responses.length - oCount;
    return {
      intro: '위험성평가를 위한 직종별 체크리스트의 입력 내용을 다음과 같이 보고합니다.',
      items: [
        ['기관명', value(data.schoolName, '[기관명 입력]')],
        ['직종 및 서식', `${sector.name} 체크리스트 (총 ${sector.count}개 항목)`],
        ['응답 입력현황', `O ${oCount}개, X ${xCount}개, 미입력 ${sector.count - responses.length}개`],
        ['항목별 응답', join(responses.map(item => `${item.number}번 ${item.answer}`), ', ', '[항목별 O/X 응답 입력]')],
        ['검토 및 후속조치', '[체크리스트 응답을 검토한 후 필요한 조치사항 입력]']
      ]
    };
  }

  const opinions = riskFactors
    .filter(([key]) => data[`rf_chk_${key}`] || hasText(data[`rf_txt_${key}`]))
    .map(([key, label]) => `${label}${data[`rf_chk_${key}`] ? ' (선택)' : ' (체크 미선택)'}: ${value(data[`rf_txt_${key}`], '[위험 내용 입력]')}`);
  return {
    intro: '위험성평가를 위한 근로자 의견청취 내용을 다음과 같이 보고합니다.',
    items: [
      ['기관명', value(data.schoolName, '[기관명 입력]')],
      ['작성일자', date(data.docDate, '[작성일자 입력]')],
      ['작성자 및 직종', `작성자 ${value(data.author, '[작성자 입력]')}, 직종 ${value(data.userCategory, '[직종 선택]')}`],
      ['유해·위험요인 의견', join(opinions, '\n', '[유해·위험요인 선택 및 내용 입력]')],
      ['자유의견 및 개선 요구사항', value(data.freeOpinion, '[자유의견 및 개선 요구사항 입력]')]
    ]
  };
}

function riskAssessment(data) {
  const rows = inputRows(data.rows, [
    'workDetail', 'place', 'riskType', 'hazardContent', 'currentAction',
    'reduceMeasure', 'planDate', 'doneDate', 'confirm'
  ]);
  return {
    intro: '위험성평가표에 입력한 유해·위험요인과 감소대책 및 이행 현황을 다음과 같이 보고합니다.',
    items: [
      ['공정명', value(data.processName, '[평가 대상 공정명 입력]')],
      // In this form the editable evaluation-date field is explicitly backed by docDate.
      ['평가일시', date(data.docDate, '[평가일시 입력]')],
      ['평가담당자 및 구성원', value(data.evalMembers, '[평가담당자 및 구성원 입력]')],
      ...(rows.length ? rows.map((row, index) => [
        `평가 항목 ${value(row.no, String(index + 1))}`,
        [
          `작업내용: ${value(row.workDetail, '[작업내용 입력]')}; 장소·설비: ${value(row.place, '[장소·설비 입력]')}`,
          `위험분류: ${value(row.riskType, '[위험분류 입력]')}; 유해·위험요인: ${value(row.hazardContent, '[유해·위험요인 입력]')}`,
          `현재 안전보건조치: ${value(row.currentAction, '[현재 안전보건조치 입력]')}`,
          `현재 위험성: ${value(row.curRisk, '[현재 위험성 입력]')}; 감소대책: ${value(row.reduceMeasure, '[위험성 감소대책 입력]')}`,
          `개선 후 위험성: ${value(row.afterRisk, '[개선 후 위험성 입력]')}`,
          `실행 예정일: ${date(row.planDate, '[실행 예정일 입력]')}; 완료일: ${date(row.doneDate, '[완료일 확인·입력]')}; 담당: ${value(row.confirm, '[실행 담당자 입력]')}`
        ].join('\n')
      ]) : [['평가 내용', '[작업별 유해·위험요인, 현재 조치, 위험성 및 감소대책 입력]']])
    ]
  };
}

function riskReduction(data) {
  const rows = inputRows(data.items, ['place', 'workContent', 'hazardContent', 'reduceContent']);
  return {
    intro: '위험요인 감소대책과 입력된 개선 내용을 다음과 같이 보고합니다.',
    items: rows.length ? rows.map((row, index) => [
      `감소대책 ${index + 1}`,
      [
        `장소·설비: ${value(row.place, '[장소·설비 입력]')}; 개선코드: ${value(row.actionCode, '[개선코드 입력]')}`,
        `작업내용: ${value(row.workContent, '[작업내용 입력]')}`,
        `유해·위험요인: ${value(row.hazardContent, '[유해·위험요인 입력]')}`,
        `감소대책·개선내용: ${value(row.reduceContent, '[감소대책 및 실제 개선내용 입력]')}`,
        `현재 위험성: ${value(row.curRisk, '[현재 위험성 입력]')}; 개선 후 위험성: ${value(row.afterRisk, '[개선 후 위험성 입력]')}`
      ].join('\n')
    ]) : [['감소대책 및 개선내용', '[장소·작업, 유해·위험요인, 감소대책 및 실제 개선내용 입력]']]
  };
}

export function incidentApproval(formCode, data = {}) {
  switch (formCode) {
    case '06-02-01':
      return {
        intro: '산업재해 발생 내용과 원인 및 재발방지 계획을 다음과 같이 보고합니다.',
        items: [
          ['사업장명', value(data.schoolName, '[사업장명 입력]')],
          ['발생일시', `${date(data.occurDate, '[발생일 입력]')} ${value(data.occurTime, '[발생시간 입력]')}`],
          ['발생장소', value(data.occurPlace, '[재해 발생장소 입력]')],
          ['재해관련 작업', `직종 ${value(data.jobTitle, '[관련 직종 입력]')}; 작업유형 ${value(data.workCategory, '[재해관련 작업유형 입력]')}`],
          ['발생 당시 상황', value(data.occurSituation, '[재해 발생 당시 상황 입력]')],
          ['발생원인', value(data.occurReason, '[조사한 재해 발생원인 입력]')],
          ['재발방지 계획', value(data.preventPlan, '[재발방지 계획 입력]')],
          ['작성자', value(data.author, '[작성자 입력]')]
        ]
      };
    case '06-02-02': {
      let severity = value(data.severity, '[재해 정도 선택]');
      if (data.severity === '사망') severity += ` (${value(data.fatalCount, '[사망 인원 입력]')}명)`;
      else if (data.severity === '부상') severity += ` (치료 예상 ${value(data.leaveDays, '[치료 예상일수 입력]')}일)`;
      return {
        intro: '중대재해 발생 내용과 조치 현황을 다음과 같이 보고합니다.',
        items: [
          ['사업장명', value(data.schoolName, '[사업장명 입력]')],
          ['발생일시 및 장소', `${date(data.occurDateTime, '[발생일시 입력]')} / ${value(data.occurPlace, '[재해 발생장소 입력]')}`],
          ['발생형태 및 기인물', `발생형태 ${value(data.occurPattern, '[발생형태 입력]')}; 기인물 ${value(data.causeMaterial, '[기인물 입력]')}`],
          ['재해 정도', severity],
          ['발생 인지경위', value(data.perceiveReason, '[재해 발생 인지경위 입력]')],
          ['발생경위', value(data.occurDescription, '[재해 발생경위 입력]')],
          ['행정조치', value(data.adminAction, '[행정조치 여부 확인·입력]')],
          ['조치 및 전망', value(data.actionAndProspect, '[실제 조치사항 및 전망 입력]')],
          ['보고 대상', join([data.laborOfficeName, data.eduOfficeName], ', ', '[보고 대상 기관 입력]')]
        ]
      };
    }
    case '06-02-03':
      return {
        intro: '산업재해 발생원인을 바탕으로 재발방지 계획을 다음과 같이 수립하고자 합니다.',
        items: [
          ['기관명', value(data.schoolName, '[기관명 입력]')],
          ['재해 발생일시', value(data.occurDateTimeText, '[재해 발생일시 입력]')],
          ['관련 직종', value(data.jobTitle, '[관련 직종 입력]')],
          ['재해 발생원인', value(data.occurReason, '[재해 발생원인 입력]')],
          ['단기적 대책', value(data.shortTermPlan, '[단기 재발방지 대책 입력]')],
          ['장기적 대책', value(data.longTermPlan, '[장기 재발방지 대책 입력]')]
        ]
      };
    case '08-01-01': return workerOpinions(data);
    case '08-01-02': return riskAssessment(data);
    case '08-01-03': return riskReduction(data);
    default: return null;
  }
}

import { FORM_METAS } from './formDataPresets.js';

const form = (formCode, description, overrides = {}) => ({
  value: formCode,
  formCode,
  title: FORM_METAS[formCode].title,
  description,
  ...overrides
});

// 작성 시기 분류입니다. 기존 서식 번호와 저장 자료의 구조는 유지합니다.
export const FORM_TIMING_GROUPS = [
  {
    label: '매월',
    options: [
      form('01-02-01', '주 1회 정기점검을 실시하고 월 1회 기관장에게 보고할 때 작성합니다.', {
        title: '정기점검 실시 결과 보고'
      }),
      form('04-01-08', '도급·용역·위탁 사업장 안전보건협의체 회의를 매월 1회 이상 개최하고 작성합니다.', {
        value: '04-01-08:meeting', docType: 'meeting', title: '안전보건협의체 회의록'
      })
    ]
  },
  {
    label: '분기별',
    options: [form('04-01-08', '도급인과 수급인 근로자 대표 등이 분기 1회 이상 합동 안전보건점검을 실시하고 작성합니다.', {
      value: '04-01-08:inspection', docType: 'inspection', title: '합동점검표'
    })]
  },
  {
    label: '교육 실시 시',
    options: [
      form('05-02-01', '정기교육(반기별), 채용 시 교육(8시간), 작업내용 변경 시 교육 등 해당 교육을 실시할 때마다 작성합니다.', {
        title: '안전보건 교육일지'
      }),
      form('09-01-05', '근골격계 유해요인 조사 완료 후 또는 근골격계질환 예방 교육을 실시할 때 작성합니다.'),
      form('10-01-04', '신규 유해화학물질 도입·수령, 취급 근로자 신규 배치·변경 등 MSDS 교육을 실시할 때 작성합니다.', {
        title: '안전보건 교육일지 (MSDS교육)'
      })
    ]
  },
  {
    label: '재해 발생 시',
    options: [
      form('06-02-01', '3일 이상 휴업이 필요한 산업재해 발생 시 발생일로부터 1개월 이내에 작성하여 노동관서 및 교육청에 보고합니다.'),
      form('06-02-02', '사망자 발생 등 중대재해 발생 즉시 유선 보고 후 발생 경위 및 조치사항을 작성하여 보고합니다.'),
      form('06-02-03', '산업재해 발생 시 원인을 분석하고 단기·장기 재발방지 대책을 수립할 때 작성합니다.')
    ]
  },
  {
    label: '보호구 지급 시',
    options: [form('03-01-01', '안전보호구를 지급할 때 지급 내역을 기록합니다.')]
  },
  {
    label: '공사·용역 준비 및 작업 시',
    options: [
      form('04-01-03', '공사·용역의 안전·보건 사항을 확인할 때 작성합니다.', {
        title: '공사(용역) 안전·보건 체크리스트'
      }),
      form('04-01-04', '공사·용역 작업의 재해예방 점검을 실시할 때 작성합니다.', {
        title: '재해예방 점검 체크리스트'
      }),
      form('04-01-05', '공사·용역의 안전보건관리 서약을 받을 때 작성합니다.')
    ]
  },
  {
    label: '위험성평가 실시·개선 시',
    options: [
      form('08-01-01', '위험성평가를 위해 근로자의 의견을 청취할 때 작성합니다.', {
        title: '근로자 의견청취'
      }),
      form('08-01-02', '위험성평가를 실시할 때 사용하는 예시 서식입니다.', {
        title: '위험성평가표 서식'
      }),
      form('08-01-03', '위험성 감소 대책을 수립하고 이행 내용을 기록할 때 작성합니다.', {
        title: '위험성 감소 대책 수립 및 이행 서식'
      })
    ]
  },
  {
    label: '근골격계 유해요인조사·개선 시',
    options: [
      form('09-01-01', '근골격계부담작업 해당 여부를 확인할 때 작성합니다.'),
      form('09-01-02', '근골격계 유해요인조사를 실시할 때 작성합니다.'),
      form('09-01-03', '근골격계질환 증상을 조사할 때 작성합니다.'),
      form('09-01-04', '조사 결과에 따라 작업환경 개선 계획을 수립할 때 작성합니다.')
    ]
  }
];

export const FORM_TIMING_OPTIONS = FORM_TIMING_GROUPS.flatMap(group =>
  group.options.map(option => ({ ...option, groupLabel: group.label }))
);

export function getFormOptionLabel(option) {
  return `${option.title} (${option.formCode})`;
}

export function getFormSelectionValue(formCode, data = {}) {
  if (formCode === '04-01-08') {
    return `${formCode}:${data?.docType === 'inspection' ? 'inspection' : 'meeting'}`;
  }
  return formCode;
}

export function resolveFormSelection(value) {
  // 종류가 없는 기존 자료는 이전과 같이 회의록으로 엽니다.
  const normalized = value === '04-01-08' ? '04-01-08:meeting' : value;
  return FORM_TIMING_OPTIONS.find(option => option.value === normalized);
}

export function getFormSelection(formCode, data = {}) {
  return resolveFormSelection(getFormSelectionValue(formCode, data));
}

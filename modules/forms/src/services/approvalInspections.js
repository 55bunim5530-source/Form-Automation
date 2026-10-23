import { FORM_01_02_01_SECTORS, FORM_04_01_03_ITEMS, FORM_04_01_04_TYPES } from '../forms/formDataPresets.js';
import { value, join, date, dateList, monthLabel } from './approvalHelpers.js';

const rows = input => Array.isArray(input) ? input.filter(row => row && typeof row === 'object') : [];
const inspector = data => join([data.inspectorDept, data.inspectorName], ' ', '[점검자 입력]');
const unique = inputs => [...new Set(inputs.map(input => value(input, '')).filter(Boolean))];

function checkResults(items, choices, labels = {}) {
  const entered = items.filter(item => choices.includes(item.result));
  if (!entered.length) return '[점검결과 확인 후 입력]' + (items.length ? ` (미기재 ${items.length}건)` : '');
  return '서식 기재 결과: ' + choices.map(choice => `${labels[choice] || choice} ${entered.filter(item => item.result === choice).length}건`).join(', ')
    + (entered.length < items.length ? `, 미기재 ${items.length - entered.length}건` : '');
}

export function inspectionApproval(formCode, data) {
  if (formCode === '01-02-01') {
    const preset = FORM_01_02_01_SECTORS[data.sector] || FORM_01_02_01_SECTORS.facility;
    const items = rows(data.items);
    const categories = unique((items.length ? items : preset.items).map(item => item.subcategory || item.check));
    const findings = items.filter(item => item.result === 'X' || value(item.issue, '') || value(item.improvement, ''))
      .map(item => `${value(item.check, '[점검항목 입력]')} / 문제점: ${value(item.issue, '[문제점 확인·입력]')} / 개선내용: ${value(item.improvement, '[개선내용 입력]')}`);
    const dates = [1, 2, 3, 4, 5].map(week => data.dates?.[week]);
    return {
      intro: `${monthLabel(dates)} ${join([data.schoolName, preset.name], ' ', '')} 정기 안전점검을 다음과 같이 실시하고 그 결과를 보고합니다.`,
      items: [
        ['점검기간', dateList(dates, '[주차별 점검일자 입력]')],
        ['점검자', inspector(data)],
        ['주요점검내용', `${join(categories, ', ', '[주요 점검항목 입력]')}\n${checkResults(items, ['O', 'X'])}${findings.length ? '\n' + findings.join('\n') : ''}`],
        ['기타사항', value(data.etcNotes, '[기타사항 확인·입력]')]
      ]
    };
  }

  if (formCode === '03-01-01') {
    const names = ['안전모', '안전화', '보안경', '안전장갑'].map((name, index) => data[`equipCol${index + 1}`] === undefined ? name : value(data[`equipCol${index + 1}`], '[보호구명 입력]'));
    const entries = rows(data.rows).filter(row => ['date', 'name', 'q1', 'q2', 'q3', 'q4'].some(key => value(row[key], '')));
    const details = entries.map(row => `${date(row.date, '[지급일자 입력]')} / ${value(row.name, '[수령자 입력]')} / ${join(names.map((name, index) => value(row[`q${index + 1}`], '') ? `${name} ${value(row[`q${index + 1}`])}` : ''), ', ', '[지급 수량 입력]')}`);
    return {
      intro: '근로자의 안전보호구 지급 내역을 다음과 같이 보고합니다.',
      items: [
        ['지급기간', dateList(entries.map(row => row.date), '[지급일자 입력]')],
        ['관리 기관 및 담당자', join([data.schoolName, data.inspectorName], ' / ', '[기관 및 담당자 입력]')],
        ['지급내역', join(details, '\n', '[수령자·보호구·지급 수량 입력]')],
        ['기타사항', '[기타사항 확인·입력]']
      ]
    };
  }

  if (formCode === '04-01-03' || formCode === '04-01-04') {
    const isCommon = formCode === '04-01-03';
    const type = data.checklistType || 'fall';
    const preset = FORM_04_01_04_TYPES[type] || FORM_04_01_04_TYPES.fall;
    // An untouched checklist displays defaults. Do not turn those defaults into reported results.
    const items = isCommon
      ? (rows(data.items).length === FORM_04_01_03_ITEMS.length ? rows(data.items) : [])
      : rows(data[`items_${type}`]);
    const title = isCommon ? '공사(용역) 안전·보건 공통 점검' : preset.title.replace(' 체크리스트', ' 점검');
    const findings = items.filter(item => item.result === '아니오').map(item => `확인 필요 항목: ${value(item.content, `${item.no || ''}번 항목`)}`);
    const subChecks = isCommon ? items.find(item => item.no === 6)?.subChecks : null;
    const submitted = subChecks ? Object.entries({ fall: '추락', electric: '감전', confined: '밀폐공간', general: '일반' })
      .filter(([key]) => value(subChecks[key], '')).map(([key, label]) => `${label}: ${value(subChecks[key])}`) : [];
    const scope = isCommon ? '안전관리·교육·보호구·유해위험요인 및 재해예방 조치 확인' : preset.title;
    return {
      intro: `${title} 내용을 다음과 같이 보고합니다.`,
      items: [
        ['점검일자', date(data.docDate, '[점검일자 입력]')],
        ['점검자', inspector(data)],
        ['점검대상', join([isCommon ? data.schoolName : '', data.contractorCompany, isCommon ? data.contractorLeader : ''], ' / ', '[점검대상 기관·업체 입력]')],
        ['주요점검내용', `${scope}\n${checkResults(items, ['예', '아니오'], { 예: 'O', 아니오: 'X' })}${submitted.length ? '\n재해예방 체크리스트 제출 표시: ' + submitted.join(', ') : ''}${findings.length ? '\n' + findings.join('\n') : ''}`],
        ['기타사항', '[기타사항 및 후속 조치 확인·입력]']
      ]
    };
  }

  if (formCode === '04-01-05') {
    const today = new Date();
    // These are the same date defaults displayed in the pledge form.
    const pledgeDate = `${data.docYear || today.getFullYear()}년 ${data.docMonth || String(today.getMonth() + 1).padStart(2, '0')}월 ${data.docDay || String(today.getDate()).padStart(2, '0')}일`;
    return {
      intro: `${value(data.projectName, '[사업명 입력]')} 관련 안전보건관리 준수 서약 내용을 다음과 같이 보고합니다.`,
      items: [
        ['서약일자', pledgeDate],
        ['사업명', value(data.projectName, '[공사·용역 사업명 입력]')],
        ['서약업체 및 대표자', join([data.contractorCompany, data.contractorLeader], ' / ', '[업체명 및 대표자 입력]')],
        ['주요내용', `계약 수행 시 안전보건관리 준수 서약\n준수 여부 기재: ${value(data.lawCompliance, '[준수 여부 확인·입력]')}`],
        ['기타사항', '[기타사항 확인·입력]']
      ]
    };
  }

  if (formCode === '04-01-08') {
    const inspection = data.docType === 'inspection';
    const year = value(data.year, String(new Date().getFullYear()));
    const term = inspection ? `${year}년 ${value(data.quarter, '1')}분기` : `${year}년 ${value(data.month, '[월 입력]')}월`;
    const participants = [
      ...rows(data.employerAttendees).filter(person => value(person.name, '')).map(person => `도급자 ${join([person.role, person.name], ' ', '')}`),
      ...rows(data.contractorAttendees).filter(person => value(person.name, '')).map(person => `수급자 ${join([person.role, person.name], ' ', '')}`)
    ];
    return {
      intro: inspection
        ? `${term} 합동 안전보건점검을 다음과 같이 실시하고 그 결과를 보고합니다.`
        : `${term} 안전보건협의체 회의를 다음과 같이 개최하고 그 결과를 보고합니다.`,
      items: [
        [inspection ? '점검일시' : '회의일시', value(data.dateTime, '[일시 입력]')],
        [inspection ? '점검장소' : '회의장소', join([data.schoolName, data.location], ' / ', '[장소 입력]')],
        [inspection ? '점검 참여자' : '참석자', join(participants, ', ', '[참석자 직책·성명 입력]')],
        [inspection ? '주요점검내용' : '주요 협의내용', value(data.agendas, inspection ? '[점검내용 및 지적사항 입력]' : '[협의안건 입력]')],
        [inspection ? '건의사항 및 조치계획' : '기타사항', value(data.suggestions, '[건의사항 및 기타사항 확인·입력]')]
      ]
    };
  }
  return null;
}

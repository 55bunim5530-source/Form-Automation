// Local, deterministic draft text. Education time/content templates match JSX.
// Illustrative work rows, scores, products and unselected health responses are
// deliberately not promoted into facts in a report.
const hasValue = (input) => (typeof input === 'string' && input.trim() !== '')
  || (typeof input === 'number' && Number.isFinite(input));
const value = (input, fallback = '[입력 필요]') => hasValue(input) ? String(input).trim() : fallback;
const date = (input, fallback = '[날짜 입력]') => {
  const raw = value(input, '');
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  return match ? `${match[1]}. ${Number(match[2])}. ${Number(match[3])}.` : raw || fallback;
};
const array = (input) => Array.isArray(input) ? input : [];
const rowsWithInput = (input, fields) => array(input).filter((row) => row && typeof row === 'object'
  && fields.some((field) => hasValue(row[field])));
const lines = (entries, fallback) => entries.length ? entries.join('\n') : fallback;
const number = (input) => {
  if (!hasValue(input)) return null;
  const parsed = Number(String(input).replaceAll(',', '').trim());
  return Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
};
const withUnit = (input, unit, fallback) => hasValue(input) ? `${value(input)}${unit}` : fallback;

function participantCount(data, prefix, label) {
  const male = number(data[`${prefix}Male`]);
  const female = number(data[`${prefix}Female`]);
  if (male !== null && female !== null) return `${male + female}명(남 ${male}명, 여 ${female}명)`;
  if (male === null && female === null) return `[${label} 인원 입력]`;
  return `남 ${male === null ? '[남성 인원 입력]' : `${male}명`}, 여 ${female === null ? '[여성 인원 입력]' : `${female}명`}(총인원 확인 필요)`;
}

function absentCount(data) {
  const counts = ['targetMale', 'targetFemale', 'actualMale', 'actualFemale'].map((key) => number(data[key]));
  if (counts.some((count) => count === null)) return '[대상·실시 인원 입력 후 확인]';
  const [targetMale, targetFemale, actualMale, actualFemale] = counts;
  if (actualMale > targetMale || actualFemale > targetFemale) return '[대상·실시 인원 확인 필요]';
  const male = targetMale - actualMale;
  const female = targetFemale - actualFemale;
  return `${male + female}명(남 ${male}명, 여 ${female}명)`;
}

function educationItems(formCode, data) {
  const titles = {
    '05-02-01': '안전보건교육',
    '09-01-05': '근골격계질환 예방 안전보건교육',
    '10-01-04': '물질안전보건자료(MSDS) 교육'
  };
  const categories = {
    new: '신규 채용 시 교육',
    regular: '근로자 정기교육(MSDS, 근골격계 관련 교육 포함)',
    change: '작업내용 변경 시 교육',
    other: '기타 교육'
  };
  const defaults = {
    '05-02-01': { start: '09:00', end: '10:00', subject: '', content: '' },
    '09-01-05': {
      start: '14:00', end: '15:00', subject: '근골격계 질환 예방 교육 및 유해요인조사',
      content: '1. 근골격계 부담작업의 유해요인\n2. 근골격계질환의 징후와 증상\n3. 근골격계질환 발생 시의 대처요령\n4. 올바른 작업자세와 작업도구, 작업시의 올바른 사용방법\n5. 그 밖에 근골격계질환 예방에 필요한 사항\n6. 유해요인조사 및 그 결과, 조사방법'
    },
    '10-01-04': {
      start: '15:00', end: '16:00', subject: '물질안전보건자료(MSDS) 교육',
      content: '1. 대상화학물질의 명칭(또는 제품명)\n2. 물리적 위험성 및 건강 유해성\n3. 취급상의 주의사항\n4. 적절한 보호구\n5. 응급조치 요령 및 사고시 대처방법\n6. 물질안전보건자료 및 경고표시를 이해하는 방법'
    }
  }[formCode];
  const attendees = rowsWithInput(data.attendees, ['name', 'jobType']);
  const namedCount = attendees.filter((person) => hasValue(person.name)).length;
  const jobTypes = [...new Set(attendees.filter((person) => hasValue(person.jobType)).map((person) => value(person.jobType)))];
  const absent = absentCount(data);
  const attendanceNotes = [
    `대상 ${participantCount(data, 'target', '교육 대상')}`,
    `실시 ${participantCount(data, 'actual', '교육 실시')}`,
    `미실시 ${absent}`
  ];
  if (absent !== '0명(남 0명, 여 0명)' || hasValue(data.absentReason)) attendanceNotes.push(`미실시 사유: ${value(data.absentReason, '[미실시 사유 확인]')}`);
  if (namedCount) attendanceNotes.push(`참석자 명단 기재 ${namedCount}명`);
  if (jobTypes.length) attendanceNotes.push(`직종: ${jobTypes.join(', ')}`);
  // JSX uses || for times/subject, but preserves an explicitly cleared content.
  const content = data.eduContent !== undefined ? data.eduContent : defaults.content;
  const items = [
    ['교육일시', `${date(data.eduDate, '[교육일자 입력]')} ${value(data.startTime || defaults.start)}~${value(data.endTime || defaults.end)}(${withUnit(data.durationMinutes || '60', '분', '[교육시간 입력]')})`],
    ['교육기관 및 장소', `${value(data.schoolName, '[학교·기관명 입력]')} / ${value(data.eduLocation, '[교육 장소 입력]')}`],
    ['교육대상 및 실시 현황', attendanceNotes.join('; ')]
  ];
  if (formCode === '05-02-01') {
    items.push(['교육 구분', categories[data.eduCategory || 'regular'] || value(data.eduCategory, '[교육 구분 선택]')]);
  }
  items.push(
    ['교육 강사', `${value(data.instructorTitle, '[강사 직명 입력]')} ${value(data.instructorName, '[강사 성명 입력]')}${hasValue(data.instructorNotes) ? ` / 비고: ${value(data.instructorNotes)}` : ''}`],
    ['교육 주제 및 내용', `${value(data.eduSubject || defaults.subject, '[교육 주제 입력]')}\n${value(content, '[교육 내용 입력]')}`]
  );
  if (formCode === '10-01-04') {
    items.push(['취급 유해화학물질', lines(array(data.chemList).filter(hasValue).map((chemical) => value(chemical)), '[대상 화학물질명 또는 제품명 입력]')]);
  }
  const photoCount = array(data.evidenceImages).filter(hasValue).length;
  if (photoCount) items.push(['등록된 교육사진', `${photoCount}장`]);
  return { intro: `${titles[formCode]} 관련 내용을 다음과 같이 보고합니다.`, items };
}

function burdenChecklist(data) {
  const workRows = array(data.workRows).filter((row) => row && typeof row === 'object'
    && (hasValue(row.workName) || Object.values(row.checks || {}).some((answer) => answer === 'O')));
  return {
    intro: '근골격계부담작업 점검 내용을 다음과 같이 보고합니다.',
    items: [
      ['사업장명', value(data.schoolName, '[사업장명 입력]')],
      // In this form the actual 조사 일자 input is stored in docDate.
      ['조사일자', date(data.docDate, '[조사일자 입력]')],
      ['조사자', value(data.inspectorName, '[조사자 입력]')],
      ['공정명 및 내용', `${value(data.processName, '[공정명 입력]')} / ${value(data.processContent, '[공정 내용 입력]')}`],
      ['작업별 점검 내용', lines(workRows.map((row) => {
        const checked = Array.from({ length: 11 }, (_, index) => `${index + 1}호`).filter((key) => row.checks?.[key] === 'O');
        return `${value(row.workName, '[작업명 입력]')}: ${checked.length ? `표시 항목 ${checked.join(', ')}` : '[해당 호수 또는 미해당 여부 확인]'}`;
      }), '[작업별 점검 내용 입력]')]
    ]
  };
}

function hazardSurvey(data) {
  const change = { none: '변화 없음', up: '늘어남', down: '줄음' };
  const equipment = data.eqChange === 'yes'
    ? `변화 있음(${value(data.eqChangeNote, '[변경 시기 및 내용 입력]')})`
    : data.eqChange === 'no' ? '변화 없음' : '[작업설비 변화 여부 선택]';
  const step2 = rowsWithInput(data.step2List, ['unitWork', 'burdenNo', 'loadScore', 'freqScore', 'total']);
  const items = [
    // In this form docDate is the 조사 일시 field, not a fallback date.
    ['조사일시', date(data.docDate, '[조사일시 입력]')],
    ['조사자', value(data.inspectorName, '[조사자 입력]')],
    ['조사 대상', `${value(data.deptName, '[부서명 입력]')} / ${value(data.processName, '[작업공정명 입력]')} / ${value(data.workTitle, '[작업명 입력]')}`],
    ['작업장 상황', `작업설비: ${equipment}; 작업량: ${change[data.workloadChange] || '[작업량 변화 선택]'}; 작업속도: ${change[data.speedChange] || '[작업속도 변화 선택]'}; 업무: ${change[data.jobChange] || '[업무 변화 선택]'}`],
    ['주요 작업내용', ['unitWork1', 'unitWork2', 'unitWork3'].map((key, index) => `${index + 1}) ${value(data[key], `[단위작업 ${index + 1} 내용 입력]`)}`).join('\n')],
    ['작업부하 및 작업빈도', lines(step2.map((row) => {
      const load = number(row.loadScore);
      const frequency = number(row.freqScore);
      // Recalculate only from two explicitly entered valid scores.
      const total = load !== null && load >= 1 && load <= 5 && frequency !== null && frequency >= 1 && frequency <= 5
        ? load * frequency : number(row.total);
      return `${value(row.unitWork, '[단위작업명 입력]')}: 부담작업 ${value(row.burdenNo, '[부담작업 호수 입력]')}, 작업부하 ${withUnit(row.loadScore, '점', '[작업부하 입력]')}, 작업빈도 ${withUnit(row.freqScore, '점', '[작업빈도 입력]')}, 총점 ${total === null ? '[총점 확인]' : `${total}점`}`;
    }), '[작업별 부하·빈도 조사 내용 입력]')],
    ['유해요인 발생 원인 및 비고', `식재료 운반: ${value(data.cause1, '[유해요인 원인 입력]')} / ${value(data.note1, '[비고 입력]')}\n국 조리 및 젓기: ${value(data.cause2, '[유해요인 원인 입력]')} / ${value(data.note2, '[비고 입력]')}`]
  ];
  const photos = ['evalPhoto1', 'evalPhoto2'].filter((key) => hasValue(data[key])).length;
  if (photos) items.push(['등록된 작업사진', `${photos}장`]);
  return { intro: '근골격계부담작업 유해요인 조사 내용을 다음과 같이 보고합니다.', items };
}

function symptomSurvey(data) {
  const parts = [['neck', '목'], ['shoulder', '어깨'], ['arm', '팔·팔꿈치'], ['hand', '손·손목·손가락'], ['back', '허리'], ['leg', '다리·발']];
  const durationLabels = { '1일미만': '1일 미만', '6달이상': '6개월 이상' };
  const levelLabels = { 없음: '통증 없음', 약한: '약한 통증', 중간: '중간 통증', 심한: '심한 통증', 매우심한: '매우 심한 통증' };
  const frequencyLabels = { '6개월1번': '6개월에 1번', '2-3달1번': '2~3달에 1번', '1달1번': '1달에 1번', '1주1번': '1주일에 1번' };
  const cureLabels = { 병원치료: '병원·한의원 치료', 약국치료: '약국치료', 병가산재: '병가·산재', 작업전환: '작업전환', 해당없음: '해당없음' };
  const responses = parts.map(([key, label]) => {
    const fields = [['side', '부위', {}], ['duration', '지속기간', durationLabels], ['level', '정도', levelLabels], ['freq', '빈도', frequencyLabels], ['week', '지난 1주일 통증', {}]];
    const answers = fields.filter(([field]) => hasValue(data[`pain_${key}_${field}`]))
      .map(([field, fieldLabel, labels]) => `${fieldLabel} ${labels[data[`pain_${key}_${field}`]] || value(data[`pain_${key}_${field}`])}`);
    return answers.length ? `${label}: ${answers.join(', ')}` : '';
  }).filter(Boolean);
  const actions = parts.filter(([key]) => hasValue(data[`pain_${key}_cure`]))
    .map(([key, label]) => `${label}: ${cureLabels[data[`pain_${key}_cure`]] || value(data[`pain_${key}_cure`])}`);
  return {
    intro: '근골격계질환 증상조사표의 응답 내용을 다음과 같이 보고합니다.',
    items: [
      // This questionnaire has no survey date or investigator input.
      ['조사일자 및 담당자', '[조사일자 입력] / [조사 담당자 입력]'],
      ['조사 대상', `${value(data.victimDept, '[작업부서 입력]')} ${value(data.victimName, '[성명 입력]')}, 수행작업: ${value(data.jobTitle, '[수행작업 입력]')}`],
      ['현재 작업 및 기간', `${value(data.currentJobDesc, '[현재 작업내용 입력]')} / ${value(data.currentJobPeriod, '[작업기간 입력]')}${hasValue(data.physicalBurden) ? ` / 육체적 부담: ${value(data.physicalBurden)}` : ''}`],
      ['근무 및 휴식시간', `1일 근무 ${value(data.dailyWorkHours, '[근무시간 입력]')}, 휴식 ${value(data.breakTime, '[휴식시간 입력]')}`],
      ['입력된 부위별 자각증상', lines(responses, '[부위별 증상 응답 입력]')],
      ['치료 및 후속조치', lines(actions, '[치료 및 후속조치 입력]')]
    ]
  };
}

function improvementPlan(data) {
  const rows = rowsWithInput(data.rows, ['process', 'work', 'issue', 'workerOpinion', 'improvement', 'schedule', 'manager', 'confirmDate', 'cost']);
  return {
    intro: '근골격계부담작업의 작업환경 개선계획을 다음과 같이 보고합니다.',
    items: [
      ['기관명', value(data.schoolName, '[학교·기관명 입력]')],
      ['작성일자 및 작성자', `${date(data.docDate, '[작성일자 입력]')} / ${value(data.author, '[작성자 입력]')}`],
      ['작업별 개선계획', lines(rows.map((row, index) => `${index + 1}) 공정: ${value(row.process, '[공정명 입력]')}; 작업: ${value(row.work, '[작업명 입력]')}; 문제점: ${value(row.issue, '[문제점 입력]')}; 근로자 의견: ${value(row.workerOpinion, '[근로자 의견 입력]')}; 개선방안: ${value(row.improvement, '[개선방안 입력]')}; 추진일정: ${value(row.schedule, '[추진일정 입력]')}; 담당자: ${value(row.manager, '[담당자 입력]')}; 확인일자: ${date(row.confirmDate, '[확인일자 입력]')}; 개선비용: ${withUnit(row.cost, '천원', '[개선비용 입력]')}`), '[작업별 문제점·근로자 의견·개선방안·추진일정·담당자·확인일자·개선비용 입력]')]
    ]
  };
}

export function educationApproval(formCode, data = {}) {
  if (['05-02-01', '09-01-05', '10-01-04'].includes(formCode)) return educationItems(formCode, data);
  if (formCode === '09-01-01') return burdenChecklist(data);
  if (formCode === '09-01-02') return hazardSurvey(data);
  if (formCode === '09-01-03') return symptomSurvey(data);
  if (formCode === '09-01-04') return improvementPlan(data);
  return null;
}

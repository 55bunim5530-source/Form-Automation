/* Chatbot follow-up schedules are validated and stored by the schedule module.
 * The chatbot iframe never receives direct access to app.data or browser storage.
 */
(() => {
  'use strict';

  const MAX_PAYLOAD_BYTES = 32768;
  const MAX_ANSWER_ID = 120;
  const inFlight = new Map();
  const duplicatePrompts = new Map();

  function text(value, maximum, field) {
    if (value == null) return '';
    if (typeof value !== 'string') throw Error(`${field} 형식이 올바르지 않습니다.`);
    const result = value.trim();
    if (result.length > maximum) throw Error(`${field}은(는) ${maximum}자 이하여야 합니다.`);
    return result;
  }

  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
  }

  function evidenceText(value) {
    if (value == null) return '';
    if (typeof value === 'string') return text(value, 2400, '근거');
    if (Array.isArray(value)) {
      if (value.length > 8) throw Error('근거 항목은 8개 이하로 전달해 주세요.');
      return value.map((item, index) => {
        if (typeof item === 'string') return text(item, 400, `근거 ${index + 1}`);
        if (!item || typeof item !== 'object' || Array.isArray(item)) throw Error('근거 형식이 올바르지 않습니다.');
        const label = text(item.title || item.name || item.source || '', 160, '근거 제목');
        const detail = text(item.excerpt || item.text || '', 300, '근거 내용');
        const url = text(item.url || '', 300, '근거 주소');
        return [label, detail, url].filter(Boolean).join(' · ');
      }).filter(Boolean).join('\n');
    }
    if (typeof value === 'object') {
      return evidenceText(value.sources || value.citations || value.summary || '');
    }
    throw Error('근거 형식이 올바르지 않습니다.');
  }

  function assertPayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw Error('일정 요청 형식이 올바르지 않습니다.');
    let serialized;
    try { serialized = JSON.stringify(payload); } catch { throw Error('일정 요청을 읽을 수 없습니다.'); }
    if (!serialized || serialized.length > MAX_PAYLOAD_BYTES) throw Error('일정 요청이 너무 큽니다.');
    if (payload.version !== 1) throw Error('지원하지 않는 일정 요청 버전입니다.');
    if (!payload.draft || typeof payload.draft !== 'object' || Array.isArray(payload.draft)) throw Error('일정 초안이 없습니다.');
  }

  function draftIdFor(answerId) {
    const answer = text(answerId, MAX_ANSWER_ID, '답변 ID');
    if (!answer) throw Error('답변 ID가 없어 같은 일정의 중복 등록을 방지할 수 없습니다.');
    return `chat:${encodeURIComponent(answer)}`;
  }

  function normalizeDraft(payload) {
    assertPayload(payload);
    const id = draftIdFor(payload.answerId);
    const suppliedId = text(payload.draft.draftId || '', 400, '초안 ID');
    if (suppliedId && suppliedId !== id) throw Error('일정 초안 ID가 답변 ID와 일치하지 않습니다.');
    const topic = text(payload.topic || '', 120, '업무 주제');
    const title = text(payload.draft.title || (topic.includes('위험성평가') ? '위험성평가 업무' : ''), 160, '업무명');
    const incomingDate = text(payload.draft.date || '', 10, '일정 날짜');
    const date = validDate(incomingDate) ? incomingDate : '';
    const target = text(payload.draft.target || '', 240, '업무 대상');
    const memo = text(payload.draft.memo || '', 2000, '메모');
    const sourceQuestion = text(payload.draft.sourceQuestion || payload.question || '', 2000, '원 질문');
    const evidence = evidenceText(payload.draft.evidence || payload.evidence || '');
    const legalStatus = text(payload.draft.legalStatus || '', 80, '법령 확인 상태');
    return {draftId: id, title, date, target, memo, sourceQuestion, evidence, legalStatus};
  }

  function missingFields(draft) {
    return ['title', 'date', 'target'].filter(field => !draft[field]);
  }

  function comparable(value) {
    return String(value || '').toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}]/gu, '');
  }

  function similarTasks(tasks, draft) {
    const title = comparable(draft.title);
    const target = comparable(draft.target);
    return (tasks || []).filter(task => {
      if (task.chatDraftId === draft.draftId) return false;
      if (task.date !== draft.date && task.dueDate !== draft.date) return false;
      const otherTitle = comparable(task.name);
      const sameTopic = title.includes('위험성평가') && (otherTitle.includes('위험성평가') || task.masterCode === 'RSK-001');
      const sameTitle = title.length >= 4 && otherTitle.length >= 4 && (title.includes(otherTitle) || otherTitle.includes(title));
      if (!sameTopic && !sameTitle) return false;
      const otherTarget = comparable(task.target);
      const broadTarget = !otherTarget || ['schoolworkplace', 'schooldefault', '학교', '학교전체', '대상확인필요', '해당여부확인'].includes(otherTarget);
      return sameTopic && task.masterCode === 'RSK-001' || !target || !otherTarget || target === otherTarget || broadTarget;
    }).slice(0, 5).map(task => ({taskId: task.id, title: task.name || '', date: task.date || task.dueDate || '', target: task.target || ''}));
  }

  function savedTaskId(draftId) {
    return app.data.appSettings?.chatScheduleSaved?.[draftId] || app.data.tasks.find(task => task.chatDraftId === draftId)?.id || '';
  }

  async function ready() {
    for (let attempts = 0; attempts < 200; attempts++) {
      if (window.safetyReady && typeof app !== 'undefined' && app.data && typeof app.save === 'function') return;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    throw Error('일정·업무관리 저장소가 준비되지 않았습니다. 화면을 새로고침한 뒤 다시 시도해 주세요.');
  }

  function savedMemo(draft) {
    return [draft.memo,
      draft.sourceQuestion ? `챗봇 원 질문: ${draft.sourceQuestion}` : '',
      draft.evidence ? `답변에서 제시한 참고 근거 (일정관리에서 별도 법령 검증 필요):\n${draft.evidence}` : '',
      '이 일정은 사용자가 지정한 내부 업무 계획입니다. 법정기한이나 적용대상 확정으로 사용하지 마세요.'
    ].filter(Boolean).join('\n\n');
  }

  async function preview(payload) {
    await ready();
    const draft = normalizeDraft(payload);
    return {draft, missing: missingFields(draft)};
  }

  async function persist(draft, confirmDuplicate) {
    await ready();
    const existingId = savedTaskId(draft.draftId);
    if (existingId) return {status: 'already-saved', taskId: existingId};
    const missing = missingFields(draft);
    if (missing.length) throw Error(`일정 등록에 필요한 항목: ${missing.join(', ')}`);
    const matches = similarTasks(app.data.tasks, draft);
    const duplicateSignature = JSON.stringify({
      date: draft.date, title: draft.title, target: draft.target,
      matches: matches.map(match => match.taskId)
    });
    if (matches.length && (confirmDuplicate !== true || duplicatePrompts.get(draft.draftId) !== duplicateSignature)) {
      duplicatePrompts.set(draft.draftId, duplicateSignature);
      return {status: 'duplicate', matches};
    }
    duplicatePrompts.delete(draft.draftId);

    const createdAt = new Date().toISOString();
    const eventId = uuid();
    const taskId = uuid();
    const memo = savedMemo(draft);
    const event = {
      id: eventId, type: '개인', title: draft.title, date: draft.date,
      target: draft.target, memo, sourceType: 'personal_manual',
      calendarLabel: draft.title, chatDraftId: draft.draftId, createdAt
    };
    const task = {
      id: taskId, name: draft.title, type: '개인', category: '개인일정',
      sourceType: 'personal_manual', calendarLabel: draft.title,
      origin: 'manual', originType: 'personal', chatDraftId: draft.draftId,
      sourceEventId: eventId, sourceQuestion: draft.sourceQuestion,
      description: memo, memo, target: draft.target, responsible: '', supporter: '',
      date: draft.date, dueDate: '', originalDate: draft.date, originalDueDate: '',
      deadlineKind: 'management', requiresReview: true,
      verificationStatus: 'needs_review', legalVerification: '별도 확인 필요',
      source: {type: '챗봇 후속업무 제안', name: '답변에서 제시한 참고 근거 · 별도 확인 필요'},
      forms: '', checklist: [], createdAt, completedAt: null,
      completedByUser: false, scheduleInstanceId: taskId, taskStatus: '미완료',
      chatEvidence: draft.evidence
    };

    app.data.appSettings ??= {};
    app.data.appSettings.chatScheduleSaved ??= {};
    const ids = app.data.appSettings.chatScheduleSaved;
    app.data.personalEvents.unshift(event);
    app.data.tasks.unshift(task);
    app.syncChecklist(task);
    app.history(task.id, '챗봇 후속업무에서 일정 등록');
    const historyId = app.data.taskHistory[0]?.id;
    ids[draft.draftId] = task.id;
    try {
      await app.save();
    } catch (error) {
      let persisted = false;
      try { persisted = !!JSON.parse(localStorage.getItem('appData') || '{}').tasks?.some(item => item.id === taskId); } catch { /* Storage may be unavailable. */ }
      if (persisted) return {status: 'saved', taskId};
      app.data.personalEvents = app.data.personalEvents.filter(item => item.id !== eventId);
      app.data.tasks = app.data.tasks.filter(item => item.id !== taskId);
      app.data.taskChecklist = app.data.taskChecklist.filter(item => item.taskId !== taskId);
      app.data.taskHistory = app.data.taskHistory.filter(item => item.id !== historyId);
      if (ids[draft.draftId] === taskId) delete ids[draft.draftId];
      throw error;
    }
    return {status: 'saved', taskId};
  }

  async function save(payload) {
    const draft = normalizeDraft(payload);
    if (inFlight.has(draft.draftId)) {
      const result = await inFlight.get(draft.draftId);
      return result.status === 'saved' ? {...result, status: 'already-saved'} : result;
    }
    const operation = persist(draft, payload.confirmDuplicate === true);
    inFlight.set(draft.draftId, operation);
    try { return await operation; }
    finally { if (inFlight.get(draft.draftId) === operation) inFlight.delete(draft.draftId); }
  }

  window.safetyChatScheduleAdapter = Object.freeze({
    preview, save,
    _test: Object.freeze({normalizeDraft, missingFields, similarTasks, validDate})
  });
})();

/* Chatbot law evidence bridge. It only reads the existing law API client and
   never persists credentials, legal claims, or schedule dates. */
(() => {
  'use strict';

  const TOPICS = [
    { test: /위험성\s*평가/u, codes: ['RSK-001'] },
    { test: /관리감독자.*교육/u, terms: ['관리감독자', '교육'] },
    { test: /(?:신규\s*채용|채용\s*시).*교육/u, terms: ['채용', '교육'] },
    { test: /(?:정기\s*)?안전보건교육|현업근로자.*교육/u, codes: ['EDU-001'] },
    { test: /작업환경\s*측정/u, terms: ['작업환경측정'] },
    { test: /근골격계.*(?:유해요인|조사)/u, terms: ['근골격계', '유해요인'] },
    { test: /(?:MSDS|물질안전보건자료)/iu, terms: ['MSDS'] },
  ];
  const unavailable = reason => ({ status: 'unavailable', laws: [], reason });
  const canonical = value => String(value || '').replace(/\s+/gu, '').normalize('NFC');

  function candidates(question, masters, law) {
    const topic = TOPICS.find(entry => entry.test.test(question));
    if (!topic) return [];
    const matching = topic.codes
      ? masters.filter(master => topic.codes.includes(master.taskCode))
      : masters.filter(master => topic.terms.every(term =>
        canonical([master.taskName, master.category, master.sourceArticle].join(' ')).includes(canonical(term))));
    const refs = [];
    for (const master of matching.slice(0, 3)) {
      const existing = Array.isArray(master.legalReferences) ? master.legalReferences : [];
      const derived = law.derive(master);
      for (const ref of [...existing, ...derived]) {
        if (ref.kind !== 'law' || !ref.lawName || !/^\d{1,4}$/u.test(String(ref.article || ''))) continue;
        if (!refs.some(item => canonical(item.lawName) === canonical(ref.lawName) && String(item.article) === String(ref.article))) {
          refs.push({ kind: 'law', lawName: ref.lawName, article: String(ref.article), branch: String(ref.branch || '') });
        }
      }
    }
    return refs.slice(0, 2);
  }

  async function lookup(question) {
    if (typeof question !== 'string' || !question.trim() || question.length > 500) {
      return unavailable('질문을 확인할 수 없습니다.');
    }
    const law = window.safetyLaw;
    if (!law?.connectionInfo?.().configured) {
      return unavailable('법제처 API 인증값이 연결되지 않았습니다. 일정·업무관리 설정에서 연결해 주세요.');
    }
    if (law.connectionInfo().online === false) return unavailable('법제처 API에 연결할 수 없는 오프라인 상태입니다.');
    if (typeof app === 'undefined' || !app.data?.taskMaster) return unavailable('업무원장이 아직 준비되지 않았습니다.');
    const refs = candidates(question, app.data.taskMaster, law);
    if (!refs.length) return unavailable('질문과 일치하는 조문을 업무원장에서 확인하지 못했습니다.');

    const laws = [];
    try {
      for (const ref of refs) {
        const rows = await law.search(ref.lawName, 'law');
        const exact = rows.filter(row => canonical(row.lawName) === canonical(ref.lawName));
        if (exact.length !== 1) return unavailable('법령명과 정확히 일치하는 현행 법령을 하나로 특정하지 못했습니다.');
        const selected = { ...ref, ...exact[0], article: ref.article, branch: ref.branch };
        const original = await law.body(selected);
        if (!original.text?.trim() || !original.fetchedAt || !original.effectiveDate) {
          return unavailable('법제처 API가 조문 원문 또는 시행일을 완전하게 반환하지 않았습니다.');
        }
        const effective = String(original.effectiveDate).replace(/[^\d]/gu, '');
        const today = new Date().toISOString().slice(0, 10).replaceAll('-', '');
        if (effective.length !== 8 || effective > today) {
          return unavailable('조회된 조문의 시행일이 미확인 또는 미래 날짜입니다.');
        }
        laws.push({
          lawName: ref.lawName,
          article: ref.article,
          excerpt: original.text.slice(0, 10000),
          effectiveDate: original.effectiveDate,
          fetchedAt: original.fetchedAt,
          sourceUrl: law.originalLink(selected),
          sourceTitle: `${ref.lawName} 제${ref.article}조`,
        });
      }
      return laws.length ? { status: 'verified', laws } : unavailable('확인된 조문이 없습니다.');
    } catch (error) {
      return unavailable(`법제처 API 조회 실패: ${String(error?.message || error).slice(0, 180)}`);
    }
  }

  window.safetyChatLawContext = Object.freeze({ lookup });
})();

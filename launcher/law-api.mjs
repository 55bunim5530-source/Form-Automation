const DRF_BASE = 'https://www.law.go.kr/DRF/';
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;

const SEARCH_PARAMS = new Set(['target', 'query', 'search', 'display', 'page', 'nw', 'LID']);
const SERVICE_PARAMS = new Set(['target', 'ID', 'LID', 'MST', 'efYd', 'JO']);
const LIST_TARGETS = new Set(['law', 'eflaw', 'admrul']);
const BODY_TARGETS = new Set(['eflaw', 'admrul']);

const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
const scalar = value => value && typeof value === 'object'
  ? String(value['#text'] ?? value['#cdata-section'] ?? value.content ?? '')
  : String(value ?? '');
const canonical = value => String(value ?? '').replace(/\s+/gu, '').normalize('NFC');
const digits = value => scalar(value).replace(/\D/gu, '');

function invalid(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function validateParams(endpoint, params) {
  if (!['lawSearch', 'lawService'].includes(endpoint)) throw invalid('허용되지 않은 법령 API 요청입니다.');
  if (!params || typeof params !== 'object' || Array.isArray(params)) throw invalid('법령 조회 조건이 올바르지 않습니다.');
  const allowed = endpoint === 'lawSearch' ? SEARCH_PARAMS : SERVICE_PARAMS;
  const clean = {};
  for (const [name, value] of Object.entries(params)) {
    if (!allowed.has(name) || typeof value !== 'string' && typeof value !== 'number' || String(value).length > 160) {
      throw invalid('법령 조회 조건이 올바르지 않습니다.');
    }
    clean[name] = String(value);
  }
  if (!(endpoint === 'lawSearch' ? LIST_TARGETS : BODY_TARGETS).has(clean.target)) {
    throw invalid('법령 조회 대상이 올바르지 않습니다.');
  }
  if (endpoint === 'lawSearch') {
    if (!clean.query.trim() || clean.query.length > 120 || /[\x00-\x1f\x7f]/u.test(clean.query)) throw invalid('법령명을 확인해 주세요.');
    if (clean.search && !['1', '2'].includes(clean.search)) throw invalid('검색 범위가 올바르지 않습니다.');
    if (clean.display && (!/^\d+$/u.test(clean.display) || +clean.display < 1 || +clean.display > 100)) throw invalid('검색 결과 개수가 올바르지 않습니다.');
    if (clean.page && (!/^\d+$/u.test(clean.page) || +clean.page < 1 || +clean.page > 20)) throw invalid('검색 페이지가 올바르지 않습니다.');
    if (clean.nw && !/^[123](?:,[123]){0,2}$/u.test(clean.nw)) throw invalid('시행 판본 지정이 올바르지 않습니다.');
    if (clean.LID && !/^\d{1,12}$/u.test(clean.LID)) throw invalid('법령 ID가 올바르지 않습니다.');
  } else {
    if (!clean.ID && !clean.LID && !clean.MST) throw invalid('본문 조회에 필요한 법령 ID가 없습니다.');
    for (const name of ['ID', 'LID', 'MST']) if (clean[name] && !/^\d{1,16}$/u.test(clean[name])) throw invalid('법령 ID가 올바르지 않습니다.');
    if (clean.efYd && !/^\d{8}$/u.test(clean.efYd)) throw invalid('시행일이 올바르지 않습니다.');
    if (clean.JO && !/^\d{6}$/u.test(clean.JO)) throw invalid('조문 번호가 올바르지 않습니다.');
    if (clean.target === 'eflaw' && clean.MST && !clean.efYd) throw invalid('연혁 본문 조회에는 시행일이 필요합니다.');
  }
  return clean;
}

function sanitizeResult(value) {
  if (typeof value === 'string') return value.replace(/([?&])OC=[^&#\s"<>]*/giu, '$1');
  if (Array.isArray(value)) return value.map(sanitizeResult);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !/^OC$/iu.test(key))
      .map(([key, item]) => [key, sanitizeResult(item)]));
  }
  return value;
}

export async function requestLaw(endpoint, params, options = {}) {
  const clean = validateParams(endpoint, params);
  const oc = String(options.oc ?? process.env.LAW_API_OC ?? process.env.LAW_OC ?? '').trim();
  if (!oc) {
    const error = new Error('서버에 법제처 API 인증값이 설정되지 않았습니다.');
    error.status = 503;
    throw error;
  }
  const url = new URL(`${endpoint}.do`, DRF_BASE);
  url.search = new URLSearchParams({ OC: oc, target: clean.target, type: 'JSON', ...clean }).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await (options.fetchImpl ?? fetch)(url, {
      signal: controller.signal,
      cache: 'no-store',
      redirect: 'error',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      const error = new Error(response.status === 401 || response.status === 403
        ? '법제처 API 인증 또는 이용 권한을 확인해 주세요.'
        : `법제처 API 응답 오류 (HTTP ${response.status})`);
      error.status = 502;
      throw error;
    }
    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > MAX_RESPONSE_BYTES) throw new Error('법제처 API 응답이 너무 큽니다.');
    const body = await response.text();
    if (Buffer.byteLength(body, 'utf8') > MAX_RESPONSE_BYTES) throw new Error('법제처 API 응답이 너무 큽니다.');
    let data;
    try { data = JSON.parse(body); }
    catch { throw new Error('법제처 API가 JSON 응답을 반환하지 않았습니다. 인증값과 이용 권한을 확인해 주세요.'); }
    if (!data || typeof data !== 'object') throw new Error('법제처 API 응답 구조가 올바르지 않습니다.');
    data = sanitizeResult(data);
    if (data.Error || data.error || data.errorCode || data.오류) {
      throw new Error('법제처 API가 조회 오류를 반환했습니다. 인증값과 이용 권한을 확인해 주세요.');
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('법제처 API 요청 시간 초과 (20초).');
    if (error instanceof TypeError) throw new Error('법제처 API에 연결하지 못했습니다. 인터넷 연결을 확인해 주세요.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// These references select which article to request; only the API response is evidence.
const TOPICS = [
  { test: /(?:사망\s*사고|사망자?\s*발생|중대재해.*(?:대응|보고|조치))/u, lawName: '산업안전보건법', article: '54', keyword: /중대재해/u },
  { test: /(?:조사표.*휴업|휴업.*조사표|(?:3|4|5)\s*일(?:간)?\s*휴업|휴업.*(?:3|4|5)\s*일)/u, lawName: '산업안전보건법 시행규칙', article: '73', keyword: /산업재해/u },
  { test: /(?:합동\s*(?:안전\s*보건)?점검|합동점검)/u, lawName: '산업안전보건법 시행규칙', article: '82', keyword: /합동.*점검/u },
  { test: /(?:안전\s*보건\s*협의체|안전보건협의체)/u, lawName: '산업안전보건법 시행규칙', article: '79', keyword: /협의체/u },
  { test: /(?:도급.*순회\s*점검|작업장\s*순회\s*점검)/u, lawName: '산업안전보건법 시행규칙', article: '80', keyword: /순회점검/u },
  { test: /(?:산업재해\s*조사표|산재\s*조사표|재해.*1개월.*보고)/u, lawName: '산업안전보건법 시행규칙', article: '73', keyword: /산업재해/u },
  { test: /(?:산업재해.*재발\s*방지|재해.*기록|재해.*보존)/u, lawName: '산업안전보건법 시행규칙', article: '72', keyword: /산업재해/u },
  { test: /(?:MSDS|물질안전보건자료).*?(?:경고\s*표시|경고\s*표지)|(?:경고\s*표시|경고\s*표지).*?(?:MSDS|물질안전보건자료)/iu, lawName: '산업안전보건법', article: '115', keyword: /경고표시/u },
  { test: /(?:MSDS|물질안전보건자료).*?(?:교육|게시)|(?:교육|게시).*?(?:MSDS|물질안전보건자료)/iu, lawName: '산업안전보건법', article: '114', keyword: /교육|게시/u },
  { test: /(?:근골격계.*(?:유해\s*요인|조사)|유해\s*요인.*근골격계)/u, lawName: '산업안전보건기준에 관한 규칙', article: '657', keyword: /유해요인/u },
  { test: /위험성\s*평가/u, lawName: '산업안전보건법', article: '36', keyword: /위험성평가/u },
  { test: /작업환경\s*측정/u, lawName: '산업안전보건법', article: '125', keyword: /작업환경측정/u },
  { test: /(?:안전\s*보건\s*교육|정기\s*교육|채용\s*시\s*교육|관리감독자.*교육)/u, lawName: '산업안전보건법', article: '29', keyword: /안전보건교육/u },
];

function referencesFor(question) {
  if (/중대산업재해/u.test(question) && /(?:일반\s*산업재해|보고\s*경로)/u.test(question)) {
    return { refs: [
      { lawName: '산업안전보건법', article: '54', branch: '', keyword: /중대재해/u },
      { lawName: '산업안전보건법 시행규칙', article: '73', branch: '', keyword: /산업재해/u },
    ], needsAnnex: false };
  }
  const lawAliases = [
    ['산업안전보건법 시행규칙', '산업안전보건법 시행규칙'],
    ['산업안전보건법 시행령', '산업안전보건법 시행령'],
    ['산업안전보건기준에 관한 규칙', '산업안전보건기준에 관한 규칙'],
    ['중대재해 처벌 등에 관한 법률', '중대재해 처벌 등에 관한 법률'],
    ['중대재해처벌법', '중대재해 처벌 등에 관한 법률'],
    ['산업재해보상보험법', '산업재해보상보험법'],
    ['근로기준법', '근로기준법'],
    ['산업안전보건법', '산업안전보건법'],
  ];
  const explicitLaw = lawAliases.find(([mentioned]) => question.includes(mentioned))?.[1];
  const matches = [...question.matchAll(/제\s*(\d{1,4})\s*조(?:\s*의\s*(\d{1,2}))?/gu)];
  const needsEducationHours = /(?:안전\s*보건\s*교육|정기\s*교육|채용\s*시\s*교육|관리감독자.*교육|교육.*(?:시간|얼마나|반기|기간제|한\s*달))/u.test(question)
    && /(?:몇\s*시간|교육\s*시간|시간|얼마나|반기|기간제|한\s*달)/u.test(question);
  if (explicitLaw && matches.length) {
    const refs = matches.slice(0, 2).map(match => {
      const prefix = question.slice(0, match.index);
      let lawName = explicitLaw;
      let lastMentionEnd = -1;
      for (const [mentioned, normalized] of lawAliases) {
        const offset = prefix.lastIndexOf(mentioned);
        const end = offset + mentioned.length;
        if (offset >= 0 && end > lastMentionEnd) {
          lawName = normalized;
          lastMentionEnd = end;
        }
      }
      return { lawName, article: match[1], branch: match[2] || '' };
    });
    if (needsEducationHours && explicitLaw === '산업안전보건법' && refs.length === 1 && refs[0].article === '29') {
      refs.push({ lawName: '산업안전보건법 시행규칙', article: '26', branch: '' });
    }
    return { refs, needsAnnex: needsEducationHours && refs.some(ref => ref.lawName === '산업안전보건법 시행규칙' && ref.article === '26') };
  }
  // A work injury without time off can still require an accident record,
  // even though the separate accident-report threshold may not be met.
  const asksAboutMinorAccident = /(?:찰과상|경미한\s*(?:사고|부상|재해)|가벼운\s*(?:사고|부상|상처)|(?:사고|부상|재해|다쳤).*(?:휴업(?:은|이|을)?\s*(?:없|안)|휴업하지\s*않|무휴업))/u.test(question)
    && /(?:기록|보존|보고|신고|조사표|남기|남겨|처리)/u.test(question);
  if (asksAboutMinorAccident) {
    return { refs: [
      { lawName: '산업안전보건법', article: '57', branch: '', keyword: /산업재해/u },
      { lawName: '산업안전보건법 시행규칙', article: '72', branch: '', keyword: /산업재해/u },
      { lawName: '산업안전보건법 시행규칙', article: '73', branch: '', keyword: /산업재해/u },
    ], needsAnnex: false };
  }
  // A real article's general duty is not evidence of where a form, file, or
  // application screen is located. Leave these navigation requests to the
  // embedded catalogue and product help.
  const asksForResource = /(?:서식|양식|일지|점검표|평가표|조사표|보고서|서류|파일|템플릿|메뉴|화면|페이지|카테고리|버튼|PDF|엑셀|MSDS|매뉴얼)/iu.test(question);
  const asksToNavigate = /(?:어디|위치|찾|다운로드|내려받|받을 수|열(?:어|어요|기| 수)|접속|이동|클릭|누르|켜(?:요|기)?)/u.test(question);
  const asksLegalDestination = /어디(?:에|로|서)?\s*(?:제출|신고|보고|신청|보관|게시)/u.test(question);
  if (asksForResource && asksToNavigate && !asksLegalDestination) return null;
  const refs = TOPICS.filter(entry => entry.test.test(question)).map(entry => ({ ...entry, branch: '' }));
  const has = (lawName, article) => refs.some(ref => ref.lawName === lawName && ref.article === article);
  const add = (lawName, article, keyword) => {
    if (!has(lawName, article)) refs.push({ lawName, article, branch: '', keyword });
  };
  if (/(?:MSDS|물질안전보건자료)/iu.test(question) && /교육/u.test(question)) {
    add('산업안전보건법 시행규칙', '169', /교육/u);
  }
  if (/(?:산업재해|산재|재해)/u.test(question) && /(?:기록|보존)/u.test(question)) {
    add('산업안전보건법', '164', /보존/u);
  }
  if (/(?:합동\s*(?:안전\s*보건)?점검|합동점검)/u.test(question) && /회의록/u.test(question)) {
    add('산업안전보건법 시행규칙', '79', /협의체/u);
  }
  if (needsEducationHours && has('산업안전보건법', '29')) {
    add('산업안전보건법 시행규칙', '26', /교육시간/u);
  }
  if (has('산업안전보건법', '36')) {
    add('산업안전보건법 시행규칙', '37', /위험성평가/u);
  }
  // The chatbot accepts at most two official excerpts. Prefer the detailed
  // implementing rule when a mixed question matches more than two topics.
  if (refs.length > 2 && has('산업안전보건법 시행규칙', '169')) {
    const educationLaw = refs.findIndex(ref => ref.lawName === '산업안전보건법' && ref.article === '114');
    if (educationLaw >= 0) refs.splice(educationLaw, 1);
  }
  if (!refs.length) return null;
  const selected = refs.slice(0, 2);
  return { refs: selected, needsAnnex: needsEducationHours && selected.some(ref => ref.lawName === '산업안전보건법 시행규칙' && ref.article === '26') };
}

function contentLines(node) {
  if (node == null) return [];
  if (Array.isArray(node)) return node.flatMap(contentLines);
  if (typeof node !== 'object') return [String(node)];
  const lines = [];
  for (const key of ['조문내용', '항내용', '호내용', '목내용', '내용']) {
    if (node[key] != null) lines.push(...contentLines(node[key]));
  }
  for (const [key, value] of Object.entries(node)) {
    if (!['조문내용', '항내용', '호내용', '목내용', '내용', '조문제목', '제목'].includes(key) && typeof value === 'object') {
      lines.push(...contentLines(value));
    }
  }
  return lines;
}

function unavailable(reason) { return { status: 'unavailable', laws: [], reason }; }

function currentLaw(body, ref, selected, today) {
  const law = body.법령 ?? body.LawService;
  const meta = law?.기본정보;
  if (!law || canonical(scalar(meta?.법령명_한글 ?? meta?.법령명한글)) !== canonical(ref.lawName)) {
    throw new Error('본문의 법령명이 검색 결과와 일치하지 않습니다.');
  }
  const effectiveDate = digits(meta.시행일자 ?? law.시행일자);
  if (effectiveDate.length !== 8 || effectiveDate > today || effectiveDate !== digits(selected.시행일자)) {
    throw new Error('본문의 시행일이 확인된 현행 판본과 일치하지 않습니다.');
  }
  return { law, effectiveDate };
}

function educationAnnex(law, today) {
  const rows = list(law.별표?.별표단위 ?? law.별표단위);
  const annex = rows.find(row => Number(scalar(row?.별표번호)) === 4
    && Number(scalar(row?.별표가지번호) || 0) === 0
    && /안전보건교육.*교육시간/u.test(scalar(row?.별표제목)));
  if (!annex) return null;
  const annexDate = digits(annex.별표시행일자);
  if (annexDate && (annexDate.length !== 8 || annexDate > today)) return null;
  // The JSON API sometimes wraps the edited annex as a two-dimensional
  // array of text lines rather than one string.
  const rawContent = Array.isArray(annex.별표내용)
    ? annex.별표내용.flat(Infinity).map(scalar).join('\n')
    : scalar(annex.별표내용);
  const content = rawContent.replace(/<[^>]+>/gu, ' ').replace(/&nbsp;/giu, ' ').trim();
  if (content.length < 50 || !/교육/u.test(content) || !/\d/u.test(content)) return null;
  return `[별표 4: ${scalar(annex.별표제목)}]\n${content.slice(0, 8500)}`;
}

export async function getLawContext(question, options = {}) {
  if (typeof question !== 'string' || !question.trim() || question.length > 500) return unavailable('질문을 확인할 수 없습니다.');
  const selection = referencesFor(question.trim());
  if (!selection) return unavailable('질문에 해당하는 조문을 특정하지 못했습니다.');
  const request = options.requestFn ?? requestLaw;
  try {
    const today = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const selectedByLaw = new Map();
    const laws = [];
    for (const ref of selection.refs) {
      let selected = selectedByLaw.get(ref.lawName);
      if (!selected) {
        const search = await request('lawSearch', {
          target: 'eflaw', query: ref.lawName, search: '1', display: '100', page: '1', nw: '3',
        });
        const root = search.LawSearch;
        if (!root || root.resultCode !== undefined && scalar(root.resultCode) !== '00') return unavailable('법제처 법령 검색 결과를 확인하지 못했습니다.');
        const exact = list(root.law).filter(row => canonical(scalar(row.법령명한글)) === canonical(ref.lawName))
          .filter(row => digits(row.시행일자).length === 8 && digits(row.시행일자) <= today && /^\d{1,16}$/u.test(scalar(row.법령ID)))
          .sort((a, b) => digits(b.시행일자).localeCompare(digits(a.시행일자)));
        if (!exact.length) return unavailable('현재 시행 중인 정확한 법령을 확인하지 못했습니다.');
        if (exact.length > 1 && digits(exact[0].시행일자) === digits(exact[1].시행일자) && scalar(exact[0].법령일련번호) !== scalar(exact[1].법령일련번호)) {
          return unavailable('동일 시행일 법령 판본이 여러 개여서 조문을 특정하지 못했습니다.');
        }
        selected = exact[0];
        selectedByLaw.set(ref.lawName, selected);
      }
      const jo = ref.article.padStart(4, '0') + (ref.branch || '0').padStart(2, '0');
      const body = await request('lawService', { target: 'eflaw', ID: scalar(selected.법령ID), JO: jo });
      const { law, effectiveDate } = currentLaw(body, ref, selected, today);
      const articles = list(law.조문?.조문단위 ?? law.조문단위);
      const article = articles.find(item => scalar(item?.조문여부).trim() === '조문'
        && Number(scalar(item?.조문번호)) === Number(ref.article)
        && Number(scalar(item?.조문가지번호) || 0) === Number(ref.branch || 0));
      if (!article) return unavailable('요청한 실제 조문이 API 본문에 없습니다.');
      const heading = scalar(article.조문내용).trim();
      const expected = new RegExp(`^제\\s*${Number(ref.article)}\\s*조${ref.branch ? `\\s*의\\s*${Number(ref.branch)}` : '(?!\\s*의\\s*\\d)'}(?=\\s|[\\(（①②③④⑤⑥⑦⑧⑨⑩]|$)`, 'u');
      if (!expected.test(heading)) return unavailable('조회한 조문 본문의 번호가 요청한 조문과 일치하지 않습니다.');
      let excerpt = contentLines(article).filter(Boolean).join('\n').trim();
      const substantive = excerpt.replace(expected, '').replace(/^\s*[\(（][^\)）]*[\)）]/u, '').trim();
      if (!substantive || ref.keyword && !ref.keyword.test(`${scalar(article.조문제목)}\n${excerpt}`)) {
        return unavailable('조회한 조문이 질문 내용과 일치하는지 확인하지 못했습니다.');
      }
      let annexIncluded = false;
      if (selection.needsAnnex && ref.lawName === '산업안전보건법 시행규칙' && ref.article === '26') {
        let annex = educationAnnex(law, today);
        if (!annex) {
          // JO-filtered responses often omit annexes. Fetch the same current
          // edition without JO, and accept only its verified 별표 4 text.
          try {
            const full = await request('lawService', { target: 'eflaw', ID: scalar(selected.법령ID) });
            annex = educationAnnex(currentLaw(full, ref, selected, today).law, today);
          } catch { /* The cited training hours must remain unverified. */ }
        }
        if (!annex) return unavailable('시행규칙 별표 4의 교육시간 원문을 확인하지 못해 시간을 확정할 수 없습니다.');
        excerpt = `${excerpt.slice(0, 1400)}\n${annex}`;
        annexIncluded = true;
      }
      const suffix = `제${ref.article}조${ref.branch ? `의${ref.branch}` : ''}`;
      laws.push({
        lawName: ref.lawName,
        article: ref.article,
        excerpt: excerpt.slice(0, 10000),
        effectiveDate,
        fetchedAt: new Date().toISOString(),
        sourceUrl: `https://www.law.go.kr/법령/${encodeURIComponent(ref.lawName)}/${suffix}`,
        sourceTitle: `${ref.lawName} ${suffix}${annexIncluded ? ' 및 별표 4' : ''}`,
      });
    }
    return {
      status: 'verified',
      laws,
    };
  } catch (error) {
    return unavailable(`법제처 API 조회 실패: ${String(error?.message || error).slice(0, 160)}`);
  }
}

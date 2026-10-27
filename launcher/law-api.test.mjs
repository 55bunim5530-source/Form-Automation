import assert from 'node:assert/strict';
import test from 'node:test';
import { getLawContext, requestLaw } from './law-api.mjs';

test('law transport supplies the server OC and does not return it to callers', async () => {
  let requested;
  const result = await requestLaw('lawSearch', { target: 'eflaw', query: '산업안전보건법' }, {
    oc: 'private-test-oc',
    fetchImpl: async url => {
      requested = new URL(url);
      return new Response(JSON.stringify({ LawSearch: { query: '산업안전보건법', OC: 'private-test-oc' } }), {
        headers: { 'content-type': 'application/json' },
      });
    },
  });
  assert.equal(requested.hostname, 'www.law.go.kr');
  assert.equal(requested.searchParams.get('OC'), 'private-test-oc');
  assert.equal(requested.searchParams.get('query'), '산업안전보건법');
  assert.equal('OC' in result.LawSearch, false);
});

test('law transport rejects arbitrary parameters and a missing server key', async () => {
  await assert.rejects(requestLaw('lawSearch', { target: 'law', query: '산업안전보건법', OC: 'client-key' }, { oc: 'server-key' }), /조건/u);
  await assert.rejects(requestLaw('lawSearch', { target: 'law', query: '산업안전보건법' }, { oc: '' }), /서버에 법제처 API 인증값/u);
});

test('law context verifies an API article and sends only law name and article to law.go.kr', async () => {
  const calls = [];
  const requestFn = async (endpoint, params) => {
    calls.push({ endpoint, params });
    if (endpoint === 'lawSearch') return {
      LawSearch: { law: { 법령명한글: '산업안전보건법', 법령ID: '1747', 법령일련번호: '100', 시행일자: '20260101' } },
    };
    return { 법령: {
      기본정보: { 법령명_한글: '산업안전보건법', 시행일자: '20260101' },
      조문: { 조문단위: { 조문여부: '조문', 조문번호: '36', 조문가지번호: '0', 조문제목: '위험성평가의 실시', 조문내용: '제36조 사업주는 위험성평가를 실시하여야 한다.' } },
    } };
  };
  const result = await getLawContext('홍길동의 산업안전보건법 제36조 의무를 알려줘', { requestFn });
  assert.equal(result.status, 'verified');
  assert.equal(result.laws[0].article, '36');
  assert.equal(result.laws[0].effectiveDate, '20260101');
  assert.match(result.laws[0].sourceUrl, /^https:\/\/www\.law\.go\.kr\//u);
  assert.deepEqual(calls[0].params.query, '산업안전보건법');
  assert.deepEqual(calls[1].params.JO, '003600');
  assert.equal(JSON.stringify(calls).includes('홍길동'), false);
});

test('unrelated or unverified article never becomes official evidence', async () => {
  let called = false;
  const unrelated = await getLawContext('학교 급식 메뉴는 무엇인가요?', { requestFn: async () => { called = true; } });
  assert.equal(unrelated.status, 'unavailable');
  assert.equal(called, false);

  const requestFn = async endpoint => endpoint === 'lawSearch'
    ? { LawSearch: { law: { 법령명한글: '산업안전보건법', 법령ID: '1747', 시행일자: '20990101' } } }
    : { 법령: {} };
  const future = await getLawContext('위험성평가 의무는?', { requestFn });
  assert.equal(future.status, 'unavailable');
});

test('a named statute and article are resolved to a known official title', async () => {
  let query;
  const result = await getLawContext('중대재해처벌법 제4조를 확인해 주세요', {
    requestFn: async (_endpoint, params) => { query = params.query; return { LawSearch: { law: [] } }; },
  });
  assert.equal(query, '중대재해 처벌 등에 관한 법률');
  assert.equal(result.status, 'unavailable');
});

test('form, file and menu navigation questions do not acquire unrelated legal evidence', async () => {
  let calls = 0;
  const requestFn = async () => { calls++; return { LawSearch: { law: [] } }; };
  for (const question of [
    '안전보건교육일지 서식은 어디 있나요?',
    '위험성평가표 어디 있나요?',
    'MSDS 화면 어떻게 열어요?',
    '산업재해조사표 파일 다운로드는 어디서 하나요?',
  ]) {
    const result = await getLawContext(question, { requestFn });
    assert.equal(result.status, 'unavailable', question);
    assert.equal(result.laws.length, 0, question);
  }
  assert.equal(calls, 0);
});

test('an explicit article still triggers verification, as does a legal submission question', async () => {
  const calls = [];
  const requestFn = async (_endpoint, params) => { calls.push(params.query); return { LawSearch: { law: [] } }; };
  await getLawContext('산업안전보건법 제29조와 안전보건교육일지 서식 위치를 알려줘', { requestFn });
  await getLawContext('산업재해조사표는 어디에 제출하나요?', { requestFn });
  assert.deepEqual(calls, ['산업안전보건법', '산업안전보건법 시행규칙']);
});

function lawFixtureRequest(calls, { annex = false, missing = [] } = {}) {
  const names = { '100': '산업안전보건법', '200': '산업안전보건법 시행규칙' };
  const ids = Object.fromEntries(Object.entries(names).map(([id, name]) => [name, id]));
  const headings = {
    '002600': ['교육시간 및 교육내용 등', '제26조(교육시간 및 교육내용 등) 안전보건교육의 교육시간은 별표 4와 같다.'],
    '002900': ['근로자에 대한 안전보건교육', '제29조(근로자에 대한 안전보건교육) 사업주는 근로자에게 안전보건교육을 하여야 한다.'],
    '003600': ['위험성평가의 실시', '제36조(위험성평가의 실시) 사업주는 위험성평가를 실시하여야 한다.'],
    '003700': ['위험성평가의 방법, 절차 및 시기', '제37조(위험성평가의 방법, 절차 및 시기) 최초평가, 정기평가, 수시평가를 실시한다.'],
    '005400': ['중대재해 발생 시 사업주의 조치', '제54조(중대재해 발생 시 사업주의 조치) 중대재해 발생 시 즉시 작업을 중지하고 지체 없이 보고한다.'],
    '005700': ['산업재해 발생 은폐 금지 및 보고 등', '제57조(산업재해 발생 은폐 금지 및 보고 등) 사업주는 산업재해 발생 원인 등을 기록하여 보존해야 한다.'],
    '007200': ['산업재해 기록 등', '제72조(산업재해 기록 등) 사업장은 근로자의 인적사항, 재해 발생의 일시 및 장소, 원인 및 과정, 재해 재발방지 계획을 기록ㆍ보존해야 한다.'],
    '007300': ['산업재해 발생 보고 등', '제73조(산업재해 발생 보고 등) 산업재해로 3일 이상의 휴업이 필요한 경우 산업재해조사표를 제출한다.'],
    '007900': ['안전보건협의체', '제79조(안전보건협의체) 협의체를 구성하고 운영한다.'],
    '008200': ['합동점검', '제82조(합동점검) 합동점검을 실시한다.'],
    '011400': ['물질안전보건자료의 게시 및 교육', '제114조(물질안전보건자료의 게시 및 교육) 근로자에게 교육한다.'],
    '016400': ['서류의 보존', '제164조(서류의 보존) 사업주는 기록을 보존한다.'],
    '016900': ['물질안전보건자료 교육', '제169조(물질안전보건자료 교육) 신규 배치 및 변경 시 교육한다.'],
  };
  return async (endpoint, params) => {
    calls.push({ endpoint, params });
    if (endpoint === 'lawSearch') return { LawSearch: { law: {
      법령명한글: params.query, 법령ID: ids[params.query], 법령일련번호: '100', 시행일자: '20260101',
    } } };
    const name = names[params.ID];
    const article = params.JO && !missing.includes(params.JO) ? headings[params.JO] : null;
    return { 법령: {
      기본정보: { 법령명_한글: name, 시행일자: '20260101' },
      조문: { 조문단위: article ? {
        조문여부: '조문', 조문번호: String(Number(params.JO.slice(0, 4))), 조문가지번호: '0',
        조문제목: article[0], 조문내용: article[1],
      } : [] },
      별표: { 별표단위: annex && !params.JO ? {
        별표번호: '4', 별표가지번호: '0', 별표제목: '안전보건교육 교육과정별 교육시간',
        별표시행일자: '20260101', 별표내용: '안전보건교육 교육시간: 정기교육 사무직 매반기 6시간, 그 밖의 근로자 매반기 12시간 이상 실시한다.',
      } : [] },
    } };
  };
}

test('a chapter heading with the same number cannot masquerade as a verified article', async () => {
  const requestFn = async (endpoint) => endpoint === 'lawSearch'
    ? { LawSearch: { law: { 법령명한글: '산업안전보건법', 법령ID: '100', 시행일자: '20260101' } } }
    : { 법령: {
      기본정보: { 법령명_한글: '산업안전보건법', 시행일자: '20260101' },
      조문: { 조문단위: [
        { 조문여부: '전문', 조문번호: '29', 조문가지번호: '0', 조문내용: '제3장 안전보건교육' },
        { 조문여부: '조문', 조문번호: '29', 조문가지번호: '0', 조문제목: '근로자에 대한 안전보건교육', 조문내용: '제29조(근로자에 대한 안전보건교육) 사업주는 근로자에게 교육해야 한다.' },
      ] },
    } };
  const verified = await getLawContext('산업안전보건법 제29조 의무는?', { requestFn });
  assert.equal(verified.status, 'verified');
  assert.match(verified.laws[0].excerpt, /^제29조/u);
  assert.doesNotMatch(verified.laws[0].excerpt, /제3장/u);

  const onlyHeading = await getLawContext('산업안전보건법 제29조 의무는?', {
    requestFn: async (endpoint, params) => endpoint === 'lawSearch'
      ? requestFn(endpoint, params)
      : { 법령: { 기본정보: { 법령명_한글: '산업안전보건법', 시행일자: '20260101' },
        조문: { 조문단위: { 조문여부: '전문', 조문번호: '29', 조문내용: '제3장 안전보건교육' } } } },
  });
  assert.equal(onlyHeading.status, 'unavailable');

  const wrongBody = await getLawContext('산업안전보건법 제29조 의무는?', {
    requestFn: async (endpoint, params) => endpoint === 'lawSearch'
      ? requestFn(endpoint, params)
      : { 법령: { 기본정보: { 법령명_한글: '산업안전보건법', 시행일자: '20260101' },
        조문: { 조문단위: { 조문여부: '조문', 조문번호: '29', 조문내용: '제28조(다른 내용) 조문번호가 맞지 않는다.' } } } },
  });
  assert.equal(wrongBody.status, 'unavailable');

  const titleWithoutBody = await getLawContext('산업안전보건법 제29조 의무는?', {
    requestFn: async (endpoint, params) => endpoint === 'lawSearch'
      ? requestFn(endpoint, params)
      : { 법령: { 기본정보: { 법령명_한글: '산업안전보건법', 시행일자: '20260101' },
        조문: { 조문단위: { 조문여부: '조문', 조문번호: '29', 조문내용: '제29조(근로자에 대한 안전보건교육)' } } } },
  });
  assert.equal(titleWithoutBody.status, 'unavailable');
});

test('related duty and implementing-rule articles are both verified for combined questions', async () => {
  for (const [question, expected] of [
    ['안전보건협의체 회의와 합동점검은 각각 언제 하나요?', ['82', '79']],
    ['합동점검 뒤 회의록도 작성해야 하나요?', ['82', '79']],
    ['MSDS 교육은 언제 해야 하나요?', ['114', '169']],
    ['산업재해 기록은 얼마나 보존하나요?', ['72', '164']],
    ['위험성평가는 매년 한 번만 하면 되나요?', ['36', '37']],
  ]) {
    const calls = [];
    const result = await getLawContext(question, { requestFn: lawFixtureRequest(calls) });
    assert.equal(result.status, 'verified', question);
    assert.deepEqual(result.laws.map(law => law.article), expected, question);
    assert.equal(result.laws.length, 2, question);
    assert.equal(calls.filter(call => call.endpoint === 'lawService').length, 2, question);
  }
});

test('accident follow-ups and two different reporting paths resolve to official articles', async () => {
  for (const [question, expected] of [
    ['학교 현장에서 사망사고가 발생하면 처음 어떤 순서로 대응해야 하나요?', ['54']],
    ['급식실 근로자가 넘어져 4일간 휴업하게 됐어요. 먼저 뭘 해야 하나요?', ['73']],
    ['급식실 근로자가 넘어져 4일간 휴업했습니다. 그럼 조사표는 언제까지 내야 하나요?', ['73']],
    ['중대산업재해와 일반 산업재해는 보고 경로가 어떻게 다른가요?', ['54', '73']],
  ]) {
    const result = await getLawContext(question, { requestFn: lawFixtureRequest([]) });
    assert.equal(result.status, 'verified', question);
    assert.deepEqual(result.laws.map(law => law.article), expected, question);
  }
});

test('a minor work injury without time off resolves record duties and the separate reporting threshold', async () => {
  const question = '가벼운 찰과상만 발생하고 휴업은 없었다면 학교가 어떤 기록을 남겨야 하나요?';
  const calls = [];
  const result = await getLawContext(question, { requestFn: lawFixtureRequest(calls) });
  assert.equal(result.status, 'verified');
  assert.deepEqual(result.laws.map(law => [law.lawName, law.article]), [
    ['산업안전보건법', '57'],
    ['산업안전보건법 시행규칙', '72'],
    ['산업안전보건법 시행규칙', '73'],
  ]);
  assert.equal(calls.filter(call => call.endpoint === 'lawService').length, 3);
  assert.ok(result.laws.every(law => law.excerpt.startsWith(`제${law.article}조`)));
  assert.match(result.laws[0].excerpt, /원인.*기록.*보존/u);
  assert.match(result.laws[1].excerpt, /인적사항.*일시.*장소.*원인.*재발방지/u);
  assert.match(result.laws[2].excerpt, /3일 이상의 휴업.*조사표/u);
});

test('education-hour claims require verified annex 4 text from the same current edition', async () => {
  const calls = [];
  const result = await getLawContext('근로자 정기 안전보건교육은 반기마다 몇 시간인가요?', {
    requestFn: lawFixtureRequest(calls, { annex: true }),
  });
  assert.equal(result.status, 'verified');
  assert.deepEqual(result.laws.map(law => law.article), ['29', '26']);
  assert.match(result.laws[1].excerpt, /^제26조/u);
  assert.match(result.laws[1].excerpt, /별표 4:[\s\S]*12시간/u);
  assert.ok(calls.some(call => call.endpoint === 'lawService' && call.params.ID === '200' && !call.params.JO));

  const missing = await getLawContext('근로자 정기 안전보건교육은 반기마다 몇 시간인가요?', {
    requestFn: lawFixtureRequest([], { annex: false }),
  });
  assert.equal(missing.status, 'unavailable');
  assert.match(missing.reason, /별표 4/u);
});

test('two explicitly named statutes keep their own article numbers', async () => {
  const result = await getLawContext('산업안전보건법 제29조와 산업안전보건법 시행규칙 제26조의 교육시간은?', {
    requestFn: lawFixtureRequest([], { annex: true }),
  });
  assert.equal(result.status, 'verified');
  assert.deepEqual(result.laws.map(law => [law.lawName, law.article]), [
    ['산업안전보건법', '29'],
    ['산업안전보건법 시행규칙', '26'],
  ]);
});

test('a partial response to a combined question is not marked verified', async () => {
  const result = await getLawContext('안전보건협의체 회의와 합동점검은 각각 언제 하나요?', {
    requestFn: lawFixtureRequest([], { missing: ['007900'] }),
  });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.laws.length, 0);
});

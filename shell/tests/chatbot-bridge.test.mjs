import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../integration.js', import.meta.url), 'utf8');

function boot(search = '?module=chatbot', options = {}) {
  const frames = [];
  const listeners = {};
  const sent = [];
  const modalCalls = [];
  const fetchCalls = [];
  const classes = () => ({ add() {}, remove() {}, toggle() {} });
  const element = () => ({
    classList: classes(), style: {}, children: [], hidden: false, innerHTML: '',
    appendChild(child) { this.children.push(child); return child; },
    append(...children) { this.children.push(...children); },
    setAttribute() {}, addEventListener() {},
  });
  const panes = [];
  const main = element();
  const host = element();
  host.querySelectorAll = () => panes;
  const view = element();
  const overlay = element();
  const registerMenu = element();
  registerMenu.open = false;
  registerMenu.setAttribute = (name) => { if (name === 'open') registerMenu.open = true; };
  registerMenu.querySelector = () => ({ click() { registerMenu.open = true; } });
  const openSituationHub = () => { modalCalls.push('situation'); };
  const openQuickEvent = () => { modalCalls.push('schedule'); };
  const fetch = (...args) => {
    fetchCalls.push(args);
    if (!options.fetch) throw Error('Unexpected fetch in bridge test');
    return options.fetch(...args);
  };
  const document = {
    body: element(),
    querySelector(selector) {
      if (selector.includes('[data-action="situation"]')) return { click: openSituationHub };
      if (selector.includes('[data-action="quick-event"]')) return { click: openQuickEvent };
      if (selector.includes('.ref-register')) return registerMenu;
      return main;
    },
    getElementById: (id) => id === 'view' ? view : id === 'overlay' ? overlay : null,
    addEventListener(type, listener) { listeners[`document:${type}`] = listener; },
    createElement(tag) {
      if (tag === 'section') return host;
      if (tag === 'iframe') {
        const frame = element();
        frame.contentWindow = { postMessage(data, origin) { sent.push({ data, origin }); } };
        frames.push(frame);
        return frame;
      }
      if (tag === 'div') {
        const wrapper = element();
        Object.defineProperty(wrapper, 'innerHTML', {
          set(html) {
            const id = html.match(/data-module-pane="([^"]+)"/)?.[1];
            const pane = element();
            pane.dataset = { modulePane: id };
            const expert = element();
            expert.dataset = { moduleView: 'expert' };
            const legacy = element();
            legacy.dataset = { moduleView: 'legacy' };
            const status = element();
            const expertTab = element();
            expertTab.dataset = { moduleTab: 'expert' };
            const legacyTab = element();
            legacyTab.dataset = { moduleTab: 'legacy' };
            pane.querySelector = (selector) => ({
              '[data-module-view="expert"]': expert,
              '[data-module-view="legacy"]': legacy,
              '[data-module-status]': status,
              '[data-module-tab="expert"]': expertTab,
              '[data-module-tab="legacy"]': legacyTab,
            })[selector];
            pane.querySelectorAll = (selector) => selector === '[data-module-tab]'
              ? [expertTab, legacyTab] : selector === '[data-module-view]' ? [expert, legacy] : [];
            host.appendChild = (child) => { panes.push(child); return child; };
            this.firstElementChild = pane;
          },
        });
        return wrapper;
      }
      return element();
    },
  };
  const app = { page: 'home' };
  let nativeRenders = 0;
  const window = {
    safetyReady: true,
    addEventListener(type, listener) { listeners[type] = listener; },
    setTimeout(callback, delay) { if (delay === 0) queueMicrotask(callback); },
    fetch, openSituationHub, openQuickEvent,
    SchoolSafetyAssets: {},
    SchoolSafetyHistory: { mount() { return {}; } },
  };
  const sandbox = {
    app, document, window, URL, URLSearchParams, fetch, openSituationHub, openQuickEvent,
    location: { href: `http://127.0.0.1:8080/shell/app.html${search}`, search },
    render() { nativeRenders++; }, renderNav() {}, renderModulePage() { return ''; }, bindPage() {},
  };
  runInNewContext(source, sandbox);
  const chatbotFrame = frames[0];
  if (new URLSearchParams(search).get('module') === 'chatbot') {
    assert.ok(chatbotFrame, 'chatbot iframe was mounted');
  }
  return {
    app, window, frames, sent, view, overlay, modalCalls, fetchCalls, registerMenu,
    get nativeRenders() { return nativeRenders; },
    send(data, origin = 'http://127.0.0.1:3001', sourceFrame = chatbotFrame) {
      listeners.message({ data, origin, source: sourceFrame.contentWindow });
    },
  };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

function aiRegistrationReply(registrationType) {
  return {
    ok: true,
    async json() {
      return { choices: [{ message: { content: JSON.stringify({ registrationType }) } }] };
    },
  };
}

test('only the real chatbot frame can navigate to allowlisted modules', () => {
  const h = boot();
  const request = { type: 'safety:assistant-action', version: 1, requestId: 'nav-1', action: 'navigate', module: 'forms' };
  h.send(request, 'http://evil.invalid');
  h.send(request, 'http://127.0.0.1:3001', { contentWindow: {} });
  assert.equal(h.app.page, 'chatbot');
  h.send({ ...request, module: 'settings' });
  assert.equal(h.app.page, 'chatbot');
  assert.equal(h.sent.at(-1).data.ok, false);
  h.send(request);
  assert.equal(h.app.page, 'forms');
  assert.equal(h.sent.at(-1).data.result.module, 'forms');
  h.send({ ...request, requestId: 'nav-2', module: 'inspection' });
  assert.equal(h.app.page, 'inspection');
  h.send({ ...request, requestId: 'nav-3', module: 'msds' });
  assert.equal(h.app.page, 'msds');
  h.send({ ...request, requestId: 'nav-4', module: 'work' });
  assert.equal(h.app.page, 'work');
  assert.ok(h.nativeRenders > 0);
});

for (const [registrationType, expectedModal] of [
  ['situation', 'situation'],
  ['schedule', 'schedule'],
]) {
  test(`work registration opens the existing ${registrationType} form selected by AI`, async () => {
    const h = boot(undefined, { fetch: async (url) => String(url).includes('/api/ai/status')
      ? { ok: true, async json() { return { features: { schedule: { configured: true } } }; } }
      : aiRegistrationReply(registrationType) });
    h.send({
      type: 'safety:assistant-action', version: 1, requestId: `register-${registrationType}`,
      action: 'work-register', module: 'work', question: '정기점검 일정은 어떻게 관리하나요?',
      topic: '정기점검', answer: '점검 일정을 등록해 관리하세요.',
    });
    await settle();

    const aiCall = h.fetchCalls.find(([url]) => String(url).includes('/api/ai/schedule'));
    assert.ok(aiCall, 'the schedule AI endpoint must classify the registration route');
    assert.equal(aiCall[1].method, 'POST');
    assert.match(JSON.stringify(JSON.parse(aiCall[1].body).messages), /정기점검/);
    assert.equal(h.app.page, 'work');
    assert.deepEqual(h.modalCalls, [expectedModal]);
    assert.equal(h.sent.at(-1).data.ok, true);
    assert.equal(h.sent.at(-1).data.result.registrationType, registrationType);
  });
}

test('work registration classification ignores messages outside the chatbot frame', async () => {
  const h = boot(undefined, { fetch: async () => aiRegistrationReply('schedule') });
  const request = {
    type: 'safety:assistant-action', version: 1, requestId: 'untrusted-register',
    action: 'work-register', module: 'work', question: '점검 일정을 등록해 줘',
    topic: '점검', answer: '일정 등록이 필요합니다.',
  };
  h.send(request, 'http://evil.invalid');
  h.send(request, 'http://127.0.0.1:3001', { contentWindow: {} });
  await settle();
  assert.equal(h.app.page, 'chatbot');
  assert.equal(h.fetchCalls.length, 0);
  assert.deepEqual(h.modalCalls, []);
});

for (const [reason, fetchResult] of [
  ['AI request failure', async () => { throw Error('AI 연결 실패'); }],
  ['invalid AI classification', async () => aiRegistrationReply('unknown')],
]) {
  test(`work registration leaves the choice to the user after ${reason}`, async () => {
    const h = boot(undefined, { fetch: fetchResult });
    h.send({
      type: 'safety:assistant-action', version: 1, requestId: `register-fallback-${reason}`,
      action: 'work-register', module: 'work', question: '안전보건 업무를 등록하고 싶어요',
      topic: '업무 등록', answer: '업무 일정을 등록해 관리하세요.',
    });
    await settle();

    assert.equal(h.app.page, 'work');
    assert.deepEqual(h.modalCalls, [], 'an invalid AI result must not choose a form');
    assert.equal(h.registerMenu.open, true, 'the existing registration menu must be expanded');
    assert.equal(h.sent.at(-1).data.ok, true);
    assert.equal(h.sent.at(-1).data.result.registrationType, 'choose');
  });
}

test('a verified chatbot formId opens the exact form through the existing handoff', async () => {
  const h = boot();
  h.overlay.innerHTML = '<aside>기존 업무 상세</aside>';
  h.send({
    type: 'safety:assistant-action', version: 1, requestId: 'form-nav-1',
    action: 'navigate', module: 'forms', formId: '04-01-08:inspection',
  });
  assert.equal(h.app.page, 'forms');
  assert.equal(h.overlay.innerHTML, '');
  assert.equal(h.sent.at(-1).data.ok, true);
  assert.equal(h.sent.at(-1).data.result.formId, '04-01-08:inspection');

  const formsFrame = h.frames[1];
  assert.ok(formsFrame);
  h.send({ type: 'safety:module-ready', module: 'forms' }, 'http://localhost:5173', formsFrame);
  await settle();
  const outbound = h.sent.at(-1).data;
  assert.equal(outbound.type, 'safety:open-form');
  assert.equal(outbound.formId, '04-01-08:inspection');
  assert.equal(outbound.version, 1);
  assert.ok(outbound.messageId);

  h.send({ type: 'safety:message-accepted', module: 'forms', messageId: outbound.messageId }, 'http://localhost:5173', formsFrame);
  const sentCount = h.sent.length;
  h.send({ type: 'safety:module-ready', module: 'forms' }, 'http://localhost:5173', formsFrame);
  await settle();
  assert.equal(h.sent.length, sentCount);
});

test('unknown form IDs and form IDs for other modules are rejected', () => {
  const h = boot();
  for (const [index, formId] of ['04-01-08', '00-00-00', '05-02-01 ', null].entries()) {
    h.send({
      type: 'safety:assistant-action', version: 1, requestId: `bad-form-${index}`,
      action: 'navigate', module: 'forms', formId,
    });
    assert.equal(h.app.page, 'chatbot');
    assert.equal(h.sent.at(-1).data.ok, false);
  }
  h.send({
    type: 'safety:assistant-action', version: 1, requestId: 'wrong-module',
    action: 'navigate', module: 'msds', formId: '05-02-01',
  });
  assert.equal(h.app.page, 'chatbot');
  assert.equal(h.sent.at(-1).data.ok, false);
  assert.equal(h.frames.length, 1);
});

test('a validated formId in the shell URL opens that form; an invalid one is ignored', async () => {
  const h = boot('?module=forms&formId=04-01-08%3Ameeting');
  assert.equal(h.app.page, 'forms');
  h.send({ type: 'safety:module-ready', module: 'forms' }, 'http://localhost:5173');
  await settle();
  assert.equal(h.sent.at(-1).data.type, 'safety:open-form');
  assert.equal(h.sent.at(-1).data.formId, '04-01-08:meeting');

  const invalid = boot('?module=forms&formId=not-a-form');
  assert.equal(invalid.app.page, 'forms');
  invalid.send({ type: 'safety:module-ready', module: 'forms' }, 'http://localhost:5173');
  await settle();
  assert.equal(invalid.sent.length, 0);
});

test('a standalone chatbot link opens the work registration choices', () => {
  const h = boot('?module=work&register=choose');
  assert.equal(h.app.page, 'work');
  assert.equal(h.registerMenu.open, true);
  assert.deepEqual(h.modalCalls, []);
});

test('schedule operations are delegated; one requestId cannot save twice', async () => {
  const h = boot();
  let saves = 0;
  let finishSave;
  h.window.safetyChatScheduleAdapter = {
    preview(payload) { return { draft: payload.draft, missing: [] }; },
    save() { saves++; return new Promise((resolve) => { finishSave = resolve; }); },
  };
  const preview = { type: 'safety:assistant-action', version: 1, requestId: 'preview-1', action: 'schedule-preview', draft: { title: '위험성평가' } };
  h.send(preview);
  await settle();
  assert.equal(h.app.page, 'chatbot');
  assert.equal(h.sent.at(-1).data.result.draft.title, '위험성평가');
  const save = { ...preview, requestId: 'save-1', action: 'schedule-save' };
  h.send(save);
  h.send(save);
  await settle();
  assert.equal(saves, 1);
  assert.equal(h.app.page, 'chatbot');
  finishSave({ status: 'saved', taskId: 'task-1' });
  await settle();
  assert.equal(h.app.page, 'work');
  assert.equal(h.sent.filter((item) => item.data.type === 'safety:assistant-action-result' && item.data.action === 'schedule-save').length, 2);
});

test('duplicate schedule result does not navigate; official-law lookup uses adapter', async () => {
  const h = boot();
  h.window.safetyChatScheduleAdapter = { save() { return { status: 'duplicate', matches: [{ id: 'old-task' }] }; } };
  h.send({ type: 'safety:assistant-action', version: 1, requestId: 'save-2', action: 'schedule-save' });
  await settle();
  assert.equal(h.app.page, 'chatbot');
  assert.equal(h.sent.at(-1).data.result.status, 'duplicate');
  h.window.safetyChatLawContext = { lookup() { return { status: 'unavailable', laws: [], reason: 'API 실패' }; } };
  h.send({ type: 'safety:chat-law-context', version: 1, requestId: 'law-1', question: '위험성평가' });
  await settle();
  assert.equal(h.sent.at(-1).data.type, 'safety:chat-law-context-result');
  assert.equal(h.sent.at(-1).data.context.status, 'unavailable');
  assert.equal(h.sent.at(-1).origin, 'http://127.0.0.1:3001');
  h.window.safetyChatLawContext = { lookup() { throw Error('법령 API 접속 실패'); } };
  h.send({ type: 'safety:chat-law-context', version: 1, requestId: 'law-2', question: '위험성평가' });
  await settle();
  assert.equal(h.sent.at(-1).data.ok, false);
  assert.match(h.sent.at(-1).data.error, /공식 법령을 조회하지 못했습니다/);
  assert.equal(h.app.page, 'chatbot');
});

test('existing form handoff and saved notification still require their real frame', async () => {
  const h = boot();
  const saved = [];
  h.window.safetyTaskIntegration = { onFormSaved(message) { saved.push(message); } };
  assert.equal(h.window.safetyModuleIntegration.openForm({ formId: '01-02-01' }), true);
  assert.equal(h.app.page, 'forms');
  const formsFrame = h.frames[1];
  h.send({ type: 'safety:module-ready', module: 'forms' }, 'http://localhost:5173', formsFrame);
  await settle();
  const outbound = h.sent.at(-1).data;
  assert.equal(outbound.type, 'safety:open-form');
  assert.equal(outbound.formId, '01-02-01');
  h.send({ type: 'safety:message-accepted', module: 'forms', messageId: outbound.messageId }, 'http://localhost:5173', formsFrame);
  const count = h.sent.length;
  h.send({ type: 'safety:module-ready', module: 'forms' }, 'http://localhost:5173', formsFrame);
  await settle();
  assert.equal(h.sent.length, count);
  h.send({ type: 'safety:form-saved', formId: '01-02-01' }, 'http://localhost:5173', { contentWindow: {} });
  assert.equal(saved.length, 0);
  h.send({ type: 'safety:form-saved', formId: '01-02-01' }, 'http://localhost:5173', formsFrame);
  assert.equal(saved.length, 1);
});

test('opening a linked form closes the task drawer and delivers its form context', async () => {
  const h = boot();
  h.overlay.innerHTML = '<div class="drawer-wrap"><aside class="drawer">업무 상세</aside></div>';
  const payload = {
    formId: '01-02-01',
    workId: 'CHK-002',
    scheduleInstanceId: 'task-1',
    prefill: { schoolName: '○○학교' },
  };

  assert.equal(h.window.safetyModuleIntegration.openForm(payload), true);
  assert.equal(h.app.page, 'forms');
  assert.equal(h.view.style.display, 'none');
  assert.equal(h.overlay.innerHTML, '');

  const formsFrame = h.frames[1];
  h.send({ type: 'safety:module-ready', module: 'forms' }, 'http://localhost:5173', formsFrame);
  await settle();
  const outbound = h.sent.at(-1).data;
  assert.equal(outbound.type, 'safety:open-form');
  assert.equal(outbound.formId, payload.formId);
  assert.equal(outbound.workId, payload.workId);
  assert.equal(outbound.scheduleInstanceId, payload.scheduleInstanceId);
  assert.equal(outbound.prefill.schoolName, payload.prefill.schoolName);
});

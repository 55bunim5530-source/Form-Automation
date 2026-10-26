import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../integration.js', import.meta.url), 'utf8');

function boot() {
  const frames = [];
  const listeners = {};
  const sent = [];
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
  const document = {
    body: element(),
    querySelector: () => main,
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
    addEventListener(type, listener) { listeners[type] = listener; },
    setTimeout(callback, delay) { if (delay === 0) queueMicrotask(callback); },
    SchoolSafetyAssets: {},
    SchoolSafetyHistory: { mount() { return {}; } },
  };
  const sandbox = {
    app, document, window, URL, URLSearchParams,
    location: { href: 'http://127.0.0.1:8080/shell/app.html?module=chatbot', search: '?module=chatbot' },
    render() { nativeRenders++; }, renderNav() {}, renderModulePage() { return ''; }, bindPage() {},
  };
  runInNewContext(source, sandbox);
  const chatbotFrame = frames[0];
  assert.ok(chatbotFrame, 'chatbot iframe was mounted');
  return {
    app, window, frames, sent, view, overlay, get nativeRenders() { return nativeRenders; },
    send(data, origin = 'http://127.0.0.1:3001', sourceFrame = chatbotFrame) {
      listeners.message({ data, origin, source: sourceFrame.contentWindow });
    },
  };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

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

(() => {
  'use strict';

  const MODULES = {
    chatbot: {
      title: 'AI 업무지원 챗봇',
      description: '학교 산업안전보건 자료 25종을 근거로 질문에 답합니다.',
      url: 'http://127.0.0.1:3001/chatbot?embed=1',
      directUrl: 'http://127.0.0.1:3001/chatbot',
      kind: 'frame',
    },
    forms: {
      title: '대표서식 자동화',
      description: '19종 서식을 작성하고 저장·서명·인쇄·내보내기 할 수 있습니다.',
      url: 'http://localhost:5173/?embed=1',
      directUrl: 'http://localhost:5173/',
      kind: 'frame',
    },
    inspection: {
      title: '시설안전 점검이력',
      description: 'PDF 평가표, 지적사항, 조치사진과 재점검 이력을 관리합니다.',
      directUrl: '/modules/facility/index.html',
      kind: 'facility',
    },
    msds: {
      title: 'MSDS·유해물질 관리',
      description: '제품 인식부터 MSDS 대장·라벨·교육자료 출력까지 지원합니다.',
      url: 'http://localhost:3000/?embed=1',
      directUrl: 'http://localhost:3000/',
      kind: 'frame',
    },
  };

  const moduleIds = new Set(Object.keys(MODULES));
  const moduleState = new Map();
  let originalRender;
  let originalModuleRenderer;
  let originalBindPage;
  let integrationHost;
  let coreApp;

  function createHost() {
    if (integrationHost) return integrationHost;
    integrationHost = document.createElement('section');
    integrationHost.id = 'integrationHost';
    integrationHost.className = 'integration-host';
    integrationHost.setAttribute('aria-live', 'polite');
    document.querySelector('.main').appendChild(integrationHost);
    return integrationHost;
  }

  function paneTemplate(id, config) {
    const expertLabel = id === 'chatbot' ? '근거 기반 챗봇' : id === 'forms' ? '전문 서식 시스템' : id === 'inspection' ? '전문 점검 시스템' : '전문 MSDS 시스템';
    return `
      <section class="integration-pane" data-module-pane="${id}">
        <header class="integration-toolbar">
          <div class="integration-title">
            <h2>${config.title}</h2>
            <p>${config.description}</p>
          </div>
          <div class="integration-actions">
            <span class="integration-status" data-module-status>연결 확인 중</span>
            <button class="integration-tab is-active" type="button" data-module-tab="expert">${expertLabel}</button>
            <button class="integration-tab" type="button" data-module-tab="legacy">기존 간편기록</button>
            <a class="integration-open" href="${config.directUrl}" target="_blank" rel="noopener noreferrer">새 창으로 열기 ↗</a>
          </div>
        </header>
        <div class="integration-body">
          <div class="integration-view is-active" data-module-view="expert"></div>
          <div class="integration-view integration-legacy" data-module-view="legacy"></div>
        </div>
      </section>`;
  }

  function ensurePane(id) {
    if (moduleState.has(id)) return moduleState.get(id);
    const host = createHost();
    const config = MODULES[id];
    const wrapper = document.createElement('div');
    wrapper.innerHTML = paneTemplate(id, config).trim();
    const pane = wrapper.firstElementChild;
    host.appendChild(pane);
    const expert = pane.querySelector('[data-module-view="expert"]');
    const legacy = pane.querySelector('[data-module-view="legacy"]');
    const status = pane.querySelector('[data-module-status]');
    const state = { pane, expert, legacy, status, loaded: false, legacyLoaded: false, activeTab: 'expert' };
    moduleState.set(id, state);

    pane.querySelectorAll('[data-module-tab]').forEach((button) => {
      button.addEventListener('click', () => activateTab(id, button.dataset.moduleTab));
    });

    if (config.kind === 'facility') {
      const mount = document.createElement('div');
      mount.className = 'facility-mount';
      mount.id = 'integrated-facility-root';
      expert.appendChild(mount);
      try {
        if (!window.SchoolSafetyHistory || !window.SchoolSafetyAssets) throw new Error('시설안전 모듈 자산을 불러오지 못했습니다.');
        state.instance = window.SchoolSafetyHistory.mount(mount, {
          storageKey: 'school-safety-history-v1',
          assets: window.SchoolSafetyAssets,
          onHome: () => { coreApp.page = 'home'; render(); },
        });
        state.loaded = true;
        setStatus(state, '연결됨', 'ready');
      } catch (error) {
        expert.innerHTML = `<div class="integration-offline"><strong>시설안전 모듈을 시작하지 못했습니다.</strong><br>${escapeText(error.message)}</div>`;
        setStatus(state, '연결 오류', 'error');
      }
    } else {
      const loading = document.createElement('div');
      loading.className = 'integration-loading';
      loading.textContent = `${config.title}을(를) 불러오는 중입니다…`;
      const frame = document.createElement('iframe');
      frame.className = 'integration-frame';
      frame.title = config.title;
      frame.src = config.url;
      frame.setAttribute('loading', 'eager');
      frame.setAttribute('allow', 'clipboard-read; clipboard-write');
      frame.addEventListener('load', () => {
        loading.hidden = true;
        state.loaded = true;
        setStatus(state, '연결됨', 'ready');
      });
      expert.append(loading, frame);
      state.frame = frame;
      window.setTimeout(() => {
        if (!state.loaded) {
          loading.textContent = `${config.title} 서비스 연결을 기다리고 있습니다. 실행 창의 오류 메시지를 확인해 주세요.`;
          setStatus(state, '연결 대기', 'error');
        }
      }, 10000);
    }
    return state;
  }

  function escapeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function setStatus(state, text, type) {
    state.status.textContent = text;
    state.status.classList.toggle('is-ready', type === 'ready');
    state.status.classList.toggle('is-error', type === 'error');
  }

  function activateTab(id, tab) {
    const state = ensurePane(id);
    state.activeTab = tab;
    state.pane.querySelectorAll('[data-module-tab]').forEach((button) => button.classList.toggle('is-active', button.dataset.moduleTab === tab));
    state.pane.querySelectorAll('[data-module-view]').forEach((view) => view.classList.toggle('is-active', view.dataset.moduleView === tab));
    if (tab === 'legacy' && !state.legacyLoaded) {
      state.legacy.innerHTML = originalModuleRenderer(id);
      state.legacyLoaded = true;
      originalBindPage();
    }
  }

  function showModule(id) {
    const host = createHost();
    document.getElementById('view').style.display = 'none';
    host.classList.add('is-active');
    renderNav();
    const state = ensurePane(id);
    host.querySelectorAll('[data-module-pane]').forEach((pane) => pane.classList.toggle('is-active', pane.dataset.modulePane === id));
    activateTab(id, state.activeTab);
    originalBindPage();
    document.body.classList.remove('reference-work');
  }

  function showNative() {
    createHost().classList.remove('is-active');
    document.getElementById('view').style.display = '';
    originalRender();
  }

  function install() {
    if (typeof app === 'undefined' || typeof render !== 'function' || typeof renderModulePage !== 'function') {
      window.setTimeout(install, 25);
      return;
    }
    coreApp = app;
    originalRender = render;
    originalModuleRenderer = renderModulePage;
    originalBindPage = bindPage;
    render = function integratedRender() {
      if (moduleIds.has(coreApp.page)) showModule(coreApp.page);
      else showNative();
    };

    // The original application binds navigation to its script-scoped render()
    // function. Capture page navigation first so module hosts stay mounted and
    // iframe/form state is not destroyed during menu changes.
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-page]');
      if (!target) return;
      const page = target.dataset.page;
      if (!page) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      coreApp.page = page;
      if (moduleIds.has(page)) showModule(page);
      else showNative();
    }, true);

    window.addEventListener('message', (event) => {
      const allowed = new Set(['http://127.0.0.1:3001', 'http://localhost:5173', 'http://localhost:3000']);
      if (!allowed.has(event.origin) || event.data?.type !== 'safety:navigate') return;
      if (!moduleIds.has(event.data.module)) return;
      coreApp.page = event.data.module;
      render();
    });

    const requested = new URLSearchParams(location.search).get('module');
    if (requested && moduleIds.has(requested)) {
      coreApp.page = requested;
      showModule(requested);
    }
  }

  install();
})();

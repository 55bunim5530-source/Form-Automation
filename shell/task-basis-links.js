// 업무 상세의 근거 자료를 저장된 업무원장 정보에 맞춰 바로 열 수 있게 한다.
(() => {
  const manualPath = 'assets/downloads/safety-health-work-manual-web.pdf';
  const manualFileName = '(웹게시용)산업안전보건업무 매뉴얼(용량축소).pdf';

  function sourceMaster(task) {
    return (app.data?.taskMaster || []).find(master => master.taskCode === (task.masterCode || task.taskCode));
  }

  function manualCited(task, master) {
    const text = [task.source?.name, task.source?.type, master?.sourceName, master?.sourceType].filter(Boolean).join(' ');
    return /산업안전보건업무\s*매뉴얼|교육청 공식 매뉴얼/u.test(text);
  }

  function statuteNames(task, master) {
    const names = new Set();
    const add = value => {
      const name = String(value || '').replace(/[「」]/g, '').replace(/\s+/g, ' ').trim();
      if (name && !/교육청|매뉴얼|기획안|공문|확인 필요/u.test(name) && /(?:법(?: 시행령| 시행규칙)?|규칙)$/u.test(name)) names.add(name);
    };

    for (const reference of master?.legalReferences || []) add(reference.lawName);

    let parentLaw = '';
    const articleText = task.source?.article || master?.sourceArticle || '';
    for (const part of String(articleText).split(/[;；\n]/u)) {
      const match = part.replace(/\([^)]*\)/g, '').trim().match(/^(.+?)\s*제\s*\d+\s*조/u);
      if (!match) continue;
      let name = match[1].trim();
      if (/^(시행령|시행규칙)$/u.test(name) && parentLaw) name = `${parentLaw} ${name}`;
      if (/법$/u.test(name)) parentLaw = name;
      add(name);
    }

    // Some older duties only store the law name in sourceName.
    const sourceName = String(task.source?.name || master?.sourceName || '').split(/[·,(]/u)[0].trim();
    add(sourceName);
    return [...names];
  }

  function resourceRow(title, description, label, href, download = false) {
    const row = document.createElement('div');
    row.className = 'resource-row task-basis-resource';
    const meta = document.createElement('div');
    meta.className = 'resource-meta';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const detail = document.createElement('span');
    detail.className = 'ready-label';
    detail.textContent = description;
    meta.append(heading, detail);
    const link = document.createElement('a');
    link.className = 'btn';
    link.href = href;
    link.textContent = label;
    if (download) link.download = manualFileName;
    else {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    row.append(meta, link);
    return row;
  }

  const previousOpenTask = openTask;
  openTask = function (id) {
    previousOpenTask(id);
    const task = app.data?.tasks.find(item => item.id === id);
    const drawer = document.querySelector('#overlay .drawer-body');
    if (!task || !drawer || drawer.closest('.incident-task-drawer')) return;
    const basis = [...drawer.querySelectorAll('.detail-section')]
      .find(section => section.querySelector('h4')?.textContent.includes('업무 근거'));
    if (!basis) return;

    const master = sourceMaster(task);
    const hasManual = manualCited(task, master);
    const laws = statuteNames(task, master);
    if (!hasManual && !laws.length) return;

    const actions = document.createElement('div');
    actions.className = 'task-basis-actions';
    if (hasManual) {
      const page = task.source?.page || master?.sourcePage;
      actions.append(resourceRow('산업안전보건업무 매뉴얼',
        `첨부 PDF${page ? ` · 업무원장 참고 위치 ${page}` : ''}`,
        '매뉴얼 다운로드', manualPath, true));
    }
    for (const name of laws) {
      const url = new URL('https://www.law.go.kr/lsSc.do');
      url.searchParams.set('menuId', '1');
      url.searchParams.set('subMenuId', '15');
      url.searchParams.set('query', name);
      actions.append(resourceRow(name, '국가법령정보센터 검색 결과에서 원문 확인·다운로드',
        '법제처에서 검색', url.href));
    }

    const placeholder = basis.querySelector(':scope > .resource-row');
    const linkedUrl = placeholder?.querySelector('a[href]')?.href || '';
    const wrongLabelForLaw = hasManual && /^https:\/\/(?:www\.)?law\.go\.kr\//iu.test(linkedUrl);
    if (placeholder?.querySelector('.badge')?.textContent.includes('연결 준비') || wrongLabelForLaw) {
      const article = task.source?.article || master?.sourceArticle;
      if (article) {
        const citation = document.createElement('p');
        citation.className = 'subtle';
        citation.textContent = `업무원장에 기재된 조문: ${article}`;
        actions.prepend(citation);
      }
      placeholder.remove();
    }
    const notice = basis.querySelector(':scope > .notice');
    if (notice) notice.before(actions);
    else basis.append(actions);
  };
})();

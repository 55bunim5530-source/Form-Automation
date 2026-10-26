import React, { useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import Header from './components/Header';
import DocumentList from './components/DocumentList';
import SignatureModal from './components/SignatureModal';
import SupabaseSettingsModal from './components/SupabaseSettingsModal';
import DefaultSettingsModal from './components/DefaultSettingsModal';
import UnsavedChangesModal from './components/UnsavedChangesModal';
import NoticeModal from './components/NoticeModal';
import ApprovalBodyModal from './components/ApprovalBodyModal';
import { generateApprovalBody } from './services/approvalBody';

import Form01_02_01 from './forms/Form01_02_01';
import Form03_01_01 from './forms/Form03_01_01';
import Form04_01_03 from './forms/Form04_01_03';
import Form04_01_04 from './forms/Form04_01_04';
import Form04_01_05 from './forms/Form04_01_05';
import Form04_01_08 from './forms/Form04_01_08';
import Form05_02_01 from './forms/Form05_02_01';
import Form06_02_01 from './forms/Form06_02_01';
import Form06_02_02 from './forms/Form06_02_02';
import Form06_02_03 from './forms/Form06_02_03';
import Form08_01_01 from './forms/Form08_01_01';
import Form08_01_02 from './forms/Form08_01_02';
import Form08_01_03 from './forms/Form08_01_03';
import Form09_01_01 from './forms/Form09_01_01';
import Form09_01_02 from './forms/Form09_01_02';
import Form09_01_03 from './forms/Form09_01_03';
import Form09_01_04 from './forms/Form09_01_04';
import Form09_01_05 from './forms/Form09_01_05';
import Form10_01_04 from './forms/Form10_01_04';

import { FORM_METAS } from './forms/formDataPresets';
import { getFormSelection, getFormSelectionValue, resolveFormSelection } from './forms/formTiming';
import { loadDocuments, saveDocument, deleteDocument, getDefaultSettings } from './services/storage';

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export default function App() {
  const acceptedMessageIdsRef = useRef(new Set());
  const [activeFormCode, setActiveFormCode] = useState('01-02-01');
  const [formData, setFormData] = useState({});
  const [activeDoc, setActiveDoc] = useState(null);
  const [defaultSettings, setDefaultSettingsState] = useState({});

  const [documents, setDocuments] = useState([]);
  const [storageSource, setStorageSource] = useState('local');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState('{}');
  const [notice, setNotice] = useState(null);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const isDirty = JSON.stringify(formData) !== savedSnapshot;

  const replaceFormData = (data) => {
    setFormData(JSON.parse(JSON.stringify(data)));
    setSavedSnapshot(JSON.stringify(data));
  };
  const requestNavigation = (action) => {
    if (saving) {
      setNotice({ message: '저장이 끝난 후 문서를 전환해 주세요.', type: 'success' });
      return false;
    }
    if (isDirty) {
      setPendingNavigation(() => action);
      return false;
    }
    action();
  };

  useEffect(() => {
    if (!isDirty) return;
    const warnBeforeLeave = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeLeave);
    return () => window.removeEventListener('beforeunload', warnBeforeLeave);
  }, [isDirty]);

  const [isListOpen, setIsListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDefaultSettingsOpen, setIsDefaultSettingsOpen] = useState(false);
  const [approvalBody, setApprovalBody] = useState(null);

  // 서명 모달 상태
  const [sigModal, setSigModal] = useState({
    isOpen: false,
    targetField: null,
    title: '서명 입력',
    customCallback: null
  });

  // 기본 세팅을 폼에 자동 적용하는 헬퍼
  const applyDefaultsToForm = (baseData, defaults) => {
    return {
      schoolName: defaults.schoolName || '',
      inspectorDept: defaults.inspectorDept || '',
      inspectorName: defaults.inspectorName || '',
      inspectorSign: defaults.inspectorSign || '',
      signManager: defaults.signManager || '',
      signPrincipal: defaults.signPrincipal || '',
      instructorName: defaults.instructorName || '',
      instructorTitle: defaults.instructorTitle || '',
      eduLocation: defaults.eduLocation || '',
      contractorCompany: defaults.contractorCompany || '',
      contractorLeader: defaults.contractorLeader || '',
      docDate: today(),
      eduDate: today(),
      ...baseData
    };
  };

  // 초기 문서 목록 및 기본 설정 로드
  const refreshDocuments = async () => {
    setLoading(true);
    try {
      const defaults = getDefaultSettings();
      setDefaultSettingsState(defaults);

      const { docs, source } = await loadDocuments();
      setDocuments(docs);
      setStorageSource(source);
    } catch (err) {
      console.error('Failed to load docs', err);
      setNotice({ message: '보관함을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDocuments();
    const defaults = getDefaultSettings();
    setDefaultSettingsState(defaults);
    replaceFormData(applyDefaultsToForm({}, defaults));
    if (window.parent !== window) window.parent.postMessage({ type: 'safety:module-ready', module: 'forms' }, '*');
  }, []);

  useEffect(() => {
    const receiveIntegratedTask = (event) => {
      if (event.source !== window.parent || event.data?.type !== 'safety:open-form') return;
      const messageId = String(event.data.messageId || '');
      if (messageId) {
        window.parent.postMessage({ type: 'safety:message-accepted', module: 'forms', messageId }, '*');
        if (acceptedMessageIdsRef.current.has(messageId)) return;
        acceptedMessageIdsRef.current.add(messageId);
      }
      const selection = resolveFormSelection(event.data.formId);
      if (!selection) {
        setNotice({ message: `연결된 서식(${event.data.formId || '미지정'})을 찾지 못했습니다.`, type: 'error' });
        return;
      }
      const open = () => {
        setActiveFormCode(selection.formCode);
        setActiveDoc(null);
        replaceFormData(applyDefaultsToForm({
          ...(selection.docType ? { docType: selection.docType } : {}),
          ...(event.data.prefill || {}),
          _integration: {
            workId: event.data.workId || '',
            scheduleInstanceId: event.data.scheduleInstanceId || '',
            formId: event.data.formId,
          },
        }, defaultSettings));
        setIsListOpen(false);
        setNotice({ message: '선택한 일정의 정보가 서식에 반영되었습니다. 확인 후 저장·출력하세요.', type: 'success' });
      };
      if (saving) {
        setNotice({ message: '저장이 끝난 후 다시 시도해 주세요.', type: 'error' });
      } else if (isDirty) {
        setPendingNavigation(() => open);
      } else {
        open();
      }
    };
    window.addEventListener('message', receiveIntegratedTask);
    return () => window.removeEventListener('message', receiveIntegratedTask);
  }, [defaultSettings, isDirty, saving]);

  // 서식 전환 시 기본값 자동 적용
  const handleSelectFormCode = (value) => {
    const selection = resolveFormSelection(value);
    if (!selection) return;
    if (selection.value === getFormSelectionValue(activeFormCode, formData)) {
      setIsListOpen(false);
      return;
    }
    requestNavigation(() => {
      setActiveFormCode(selection.formCode);
      setActiveDoc(null);
      replaceFormData(applyDefaultsToForm(selection.docType ? { docType: selection.docType } : {}, defaultSettings));
      setIsListOpen(false);
    });
  };

  // 새 서식 작성 시 기본값 자동 적용
  const handleNewDoc = () => {
    requestNavigation(() => {
      setActiveDoc(null);
      const selection = getFormSelection(activeFormCode, formData);
      replaceFormData(applyDefaultsToForm(selection?.docType ? { docType: selection.docType } : {}, defaultSettings));
      setIsListOpen(false);
    });
  };

  // 기본 설정 저장 후 처리
  const handleDefaultSettingsSaved = (newDefaults) => {
    setDefaultSettingsState(newDefaults);
    // 현재 수정 중인 문서가 없는 새 문서 상태라면 현재 폼에도 기본값 병합
    if (!activeDoc) {
      setFormData(prev => ({
        ...prev,
        schoolName: prev.schoolName || newDefaults.schoolName,
        inspectorDept: prev.inspectorDept || newDefaults.inspectorDept,
        inspectorName: prev.inspectorName || newDefaults.inspectorName,
        inspectorSign: prev.inspectorSign || newDefaults.inspectorSign,
        signManager: prev.signManager || newDefaults.signManager,
        signPrincipal: prev.signPrincipal || newDefaults.signPrincipal,
        instructorName: prev.instructorName || newDefaults.instructorName,
        instructorTitle: prev.instructorTitle || newDefaults.instructorTitle,
        eduLocation: prev.eduLocation || newDefaults.eduLocation,
        contractorCompany: prev.contractorCompany || newDefaults.contractorCompany,
        contractorLeader: prev.contractorLeader || newDefaults.contractorLeader
      }));
    }
  };

  // 문서 저장 (신규 또는 수정)
  const handleSaveDoc = async () => {
    if (saving) return;
    setSaving(true);
    const meta = getFormSelection(activeFormCode, formData) || FORM_METAS[activeFormCode] || { title: '산업안전보건 서식' };
    const schoolName = formData.schoolName || defaultSettings.schoolName;
    const title = schoolName
      ? `[${activeFormCode}] ${schoolName} - ${meta.title}`
      : `[${activeFormCode}] ${meta.title}`;

    const docToSave = {
      id: activeDoc?.id,
      createdAt: activeDoc?.createdAt,
      formCode: activeFormCode,
      title: activeFormCode === '04-01-08' ? title : activeDoc?.title || title,
      orgName: schoolName || '',
      author: formData.inspectorName || formData.instructorName || '',
      docDate: formData.docDate || formData.eduDate || today(),
      data: JSON.parse(JSON.stringify(formData))
    };

    try {
      const result = await saveDocument(docToSave);
      setActiveDoc(result.doc);
      setSavedSnapshot(JSON.stringify(docToSave.data));
      await refreshDocuments();

      let msg = '문서가 보관함에 저장되었습니다.';
      if (result.supabaseResult?.success) {
        msg += '\n(Supabase 클라우드 동기화 완료)';
      } else if (result.supabaseResult?.error) {
        msg += `\n(주의: 로컬에는 저장되었으나 Supabase 동기화 실패: ${result.supabaseResult.error})`;
      }
      setNotice({ message: msg, type: result.supabaseResult?.error ? 'error' : 'success' });
      if (window.parent !== window && docToSave.data?._integration?.scheduleInstanceId) {
        window.parent.postMessage({
          type: 'safety:form-saved',
          workId: docToSave.data._integration.workId,
          scheduleInstanceId: docToSave.data._integration.scheduleInstanceId,
          formId: docToSave.data._integration.formId,
          documentId: result.doc?.id || '',
          title: result.doc?.title || docToSave.title,
          savedAt: new Date().toISOString(),
        }, '*');
      }
    } catch (err) {
      setNotice({ message: '저장하지 못했습니다. ' + err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // 보관함에서 문서 선택 (불러오기)
  const handleSelectDocFromList = (doc, afterOpen) => {
    requestNavigation(() => {
      setActiveDoc(doc);
      setActiveFormCode(doc.formCode);
      replaceFormData(doc.data || {});
      setIsListOpen(false);
      if (typeof afterOpen === 'function') setTimeout(afterOpen, 300);
    });
  };

  // 문서 복사하여 새로 작성
  const handleCopyDoc = (doc) => {
    requestNavigation(() => {
      setActiveDoc(null);
      setActiveFormCode(doc.formCode);
      setFormData({
        ...JSON.parse(JSON.stringify(doc.data || {})),
        docDate: today()
      });
      setIsListOpen(false);
      setSavedSnapshot('{}');
      setNotice({ message: '문서를 복사했습니다. 내용을 확인하고 새 문서로 저장해 주세요.', type: 'success' });
    });
  };

  // 문서 삭제
  const handleDeleteDoc = async (id) => {
    if (saving) return;
    try {
      await deleteDocument(id);
      if (activeDoc?.id === id) {
        setActiveDoc(null);
        const selection = getFormSelection(activeFormCode, formData);
        replaceFormData(applyDefaultsToForm(selection?.docType ? { docType: selection.docType } : {}, defaultSettings));
      }
      await refreshDocuments();
    } catch (err) {
      setNotice({ message: '문서를 삭제하지 못했습니다. ' + err.message, type: 'error' });
    }
  };

  // 바로 인쇄
  const handlePrintDocFromList = (doc) => {
    handleSelectDocFromList(doc, () => window.print());
  };

  const handlePrintCurrent = () => {
    window.print();
  };

  // 서명 패드 열기
  const handleOpenSignature = (targetField, title = '서명 입력', customCallback = null) => {
    setSigModal({
      isOpen: true,
      targetField,
      title,
      customCallback
    });
  };

  // 서명 완료 저장
  const handleSaveSignature = (dataUrl) => {
    if (sigModal.customCallback) {
      sigModal.customCallback(dataUrl);
      return;
    }

    const target = sigModal.targetField;
    if (!target) return;

    if (target.startsWith('attendee_emp_')) {
      const idx = parseInt(target.replace('attendee_emp_', ''), 10);
      const list = [...(formData.employerAttendees || [])];
      if (list[idx]) {
        list[idx].sign = dataUrl;
        setFormData({ ...formData, employerAttendees: list });
      }
    } else if (target.startsWith('attendee_con_')) {
      const idx = parseInt(target.replace('attendee_con_', ''), 10);
      const list = [...(formData.contractorAttendees || [])];
      if (list[idx]) {
        list[idx].sign = dataUrl;
        setFormData({ ...formData, contractorAttendees: list });
      }
    } else if (target.startsWith('attendee_')) {
      const idx = parseInt(target.replace('attendee_', ''), 10);
      const attendees = [...(formData.attendees || [])];
      if (attendees[idx]) {
        attendees[idx].sign = dataUrl;
        setFormData({ ...formData, attendees });
      }
    } else {
      setFormData({
        ...formData,
        [target]: dataUrl
      });
    }
  };

  return (
    <div className="app-container">
      {/* 헤더 네비게이션 */}
      <Header
        activeFormCode={activeFormCode}
        formData={formData}
        onSelectFormCode={handleSelectFormCode}
        onNewDoc={handleNewDoc}
        onSaveDoc={handleSaveDoc}
        onPrint={handlePrintCurrent}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDefaultSettings={() => setIsDefaultSettingsOpen(true)}
        isListOpen={isListOpen}
        onToggleList={setIsListOpen}
        saving={saving}
        storageSource={storageSource}
        activeDoc={activeDoc}
        defaultSchoolName={defaultSettings.schoolName}
      />

      {/* 메인 작업 영역 */}
      <main className="main-workspace">
        {isListOpen ? (
          <DocumentList
            documents={documents}
            activeDocId={activeDoc?.id}
            onSelectDoc={handleSelectDocFromList}
            onCopyDoc={handleCopyDoc}
            onDeleteDoc={handleDeleteDoc}
            onPrintDoc={handlePrintDocFromList}
            onRefresh={refreshDocuments}
            loading={loading}
            storageSource={storageSource}
          />
        ) : (
          <div className="form-editor-layout">
          <div className="form-render-container">
            {activeFormCode === '01-02-01' && (
              <Form01_02_01
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '03-01-01' && (
              <Form03_01_01
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '04-01-03' && (
              <Form04_01_03
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '04-01-04' && (
              <Form04_01_04
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '04-01-05' && (
              <Form04_01_05
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '04-01-08' && (
              <Form04_01_08
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '05-02-01' && (
              <Form05_02_01
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '06-02-01' && (
              <Form06_02_01
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '06-02-02' && (
              <Form06_02_02
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '06-02-03' && (
              <Form06_02_03
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '08-01-01' && (
              <Form08_01_01
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '08-01-02' && (
              <Form08_01_02
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '08-01-03' && (
              <Form08_01_03
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '09-01-01' && (
              <Form09_01_01
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '09-01-02' && (
              <Form09_01_02
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '09-01-03' && (
              <Form09_01_03
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '09-01-04' && (
              <Form09_01_04
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '09-01-05' && (
              <Form09_01_05
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
            {activeFormCode === '10-01-04' && (
              <Form10_01_04
                formData={formData}
                onChange={setFormData}
                onOpenSignature={handleOpenSignature}
              />
            )}
          </div>
          <aside className="approval-side-panel no-print" aria-label="결재 본문 작성">
            <button
              type="button"
              className="approval-create-button"
              onClick={() => setApprovalBody(generateApprovalBody(activeFormCode, formData))}
              aria-describedby="approval-create-help"
            >
              <FileText size={22} aria-hidden="true" />
              <span>결재용 본문 만들기</span>
            </button>
            <p id="approval-create-help">작성한 내용으로 본문을 만들고<br />복사해 결재에 사용하세요.</p>
          </aside>
          </div>
        )}
      </main>

      {approvalBody !== null && (
        <ApprovalBodyModal
          initialText={approvalBody}
          formTitle={getFormSelection(activeFormCode, formData)?.title || FORM_METAS[activeFormCode]?.title || '서식'}
          onClose={() => setApprovalBody(null)}
          onRegenerate={() => generateApprovalBody(activeFormCode, formData)}
        />
      )}

      {notice && <NoticeModal message={notice.message} onClose={() => setNotice(null)} />}
      {pendingNavigation && (
        <UnsavedChangesModal
          onCancel={() => setPendingNavigation(null)}
          onDiscard={() => {
            const navigate = pendingNavigation;
            setPendingNavigation(null);
            navigate();
          }}
        />
      )}

      {/* 전자 서명 모달 */}
      <SignatureModal
        isOpen={sigModal.isOpen}
        title={sigModal.title}
        onClose={() => setSigModal({ ...sigModal, isOpen: false, customCallback: null })}
        onSave={handleSaveSignature}
      />

      {/* Supabase 설정 모달 */}
      <SupabaseSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigUpdated={refreshDocuments}
      />

      {/* 기본 정보 설정 모달 */}
      <DefaultSettingsModal
        isOpen={isDefaultSettingsOpen}
        onClose={() => setIsDefaultSettingsOpen(false)}
        onSaved={handleDefaultSettingsSaved}
        onOpenSignature={handleOpenSignature}
      />
    </div>
  );
}

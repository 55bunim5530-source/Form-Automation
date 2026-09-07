import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DocumentList from './components/DocumentList';
import SignatureModal from './components/SignatureModal';
import SupabaseSettingsModal from './components/SupabaseSettingsModal';
import DefaultSettingsModal from './components/DefaultSettingsModal';

import Form01_02_01 from './forms/Form01_02_01';
import Form04_01_03 from './forms/Form04_01_03';
import Form04_01_08 from './forms/Form04_01_08';
import Form05_02_01 from './forms/Form05_02_01';
import Form09_01_05 from './forms/Form09_01_05';
import Form10_01_04 from './forms/Form10_01_04';

import { FORM_METAS } from './forms/formDataPresets';
import { loadDocuments, saveDocument, deleteDocument, getDefaultSettings } from './services/storage';

export default function App() {
  const [activeFormCode, setActiveFormCode] = useState('01-02-01');
  const [formData, setFormData] = useState({});
  const [activeDoc, setActiveDoc] = useState(null);
  const [defaultSettings, setDefaultSettingsState] = useState({});

  const [documents, setDocuments] = useState([]);
  const [storageSource, setStorageSource] = useState('local');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isListOpen, setIsListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDefaultSettingsOpen, setIsDefaultSettingsOpen] = useState(false);

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
      docDate: new Date().toISOString().slice(0, 10),
      eduDate: new Date().toISOString().slice(0, 10),
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
      if (docs.length === 0) {
        // 최초 사용자 편의를 위한 01-02-01 샘플 1건 자동 생성
        const sampleDoc = {
          formCode: '01-02-01',
          title: `[예시] 2024년 정기 시설관리 자체 점검표`,
          orgName: defaults.schoolName || '서울안전고등학교',
          author: defaults.inspectorName || '홍길동 주무관',
          docDate: new Date().toISOString().slice(0, 10),
          data: applyDefaultsToForm({
            schoolName: defaults.schoolName || '서울안전고등학교',
            inspectorDept: defaults.inspectorDept || '행정실 시설관리팀',
            inspectorName: defaults.inspectorName || '홍길동',
            sector: 'facility',
            dates: {
              1: new Date().toISOString().slice(0, 10)
            },
            etcNotes: '해빙기 대비 옹벽 및 배수로 안전점검 완료. 수목 전정작업 시 2인1조 안전수칙 준수 바람.'
          }, defaults)
        };
        const saved = await saveDocument(sampleDoc);
        setDocuments([saved.doc]);
      } else {
        setDocuments(docs);
      }
      setStorageSource(source);
    } catch (err) {
      console.error('Failed to load docs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDocuments();
    const defaults = getDefaultSettings();
    setDefaultSettingsState(defaults);
    setFormData(applyDefaultsToForm({}, defaults));
  }, []);

  // 서식 전환 시 기본값 자동 적용
  const handleSelectFormCode = (code) => {
    setActiveFormCode(code);
    setActiveDoc(null);
    setFormData(applyDefaultsToForm({}, defaultSettings));
    setIsListOpen(false);
  };

  // 새 서식 작성 시 기본값 자동 적용
  const handleNewDoc = () => {
    setActiveDoc(null);
    setFormData(applyDefaultsToForm({}, defaultSettings));
    setIsListOpen(false);
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
    setSaving(true);
    const meta = FORM_METAS[activeFormCode] || { title: '산업안전보건 서식' };
    const schoolName = formData.schoolName || defaultSettings.schoolName;
    const title = schoolName
      ? `[${activeFormCode}] ${schoolName} - ${meta.title}`
      : `[${activeFormCode}] ${meta.title}`;

    const docToSave = {
      id: activeDoc?.id,
      formCode: activeFormCode,
      title: activeDoc?.title || title,
      orgName: schoolName || '',
      author: formData.inspectorName || formData.instructorName || '',
      docDate: formData.docDate || formData.eduDate || new Date().toISOString().slice(0, 10),
      data: formData
    };

    try {
      const result = await saveDocument(docToSave);
      setActiveDoc(result.doc);
      await refreshDocuments();

      let msg = '✅ 서식이 성공적으로 저장되었습니다!';
      if (result.supabaseResult?.success) {
        msg += '\n(Supabase 클라우드 동기화 완료)';
      } else if (result.supabaseResult?.error) {
        msg += `\n(주의: 로컬에는 저장되었으나 Supabase 동기화 실패: ${result.supabaseResult.error})`;
      }
      alert(msg);
    } catch (err) {
      alert('저장 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 보관함에서 문서 선택 (불러오기)
  const handleSelectDocFromList = (doc) => {
    setActiveDoc(doc);
    setActiveFormCode(doc.formCode);
    setFormData(doc.data || {});
    setIsListOpen(false);
  };

  // 문서 복사하여 새로 작성
  const handleCopyDoc = (doc) => {
    setActiveDoc(null);
    setActiveFormCode(doc.formCode);
    setFormData({
      ...(doc.data || {}),
      docDate: new Date().toISOString().slice(0, 10)
    });
    setIsListOpen(false);
    alert(`'${doc.title}' 내용이 복사되었습니다. 새 문서로 저장해 주세요.`);
  };

  // 문서 삭제
  const handleDeleteDoc = async (id) => {
    await deleteDocument(id);
    if (activeDoc?.id === id) {
      setActiveDoc(null);
      setFormData(applyDefaultsToForm({}, defaultSettings));
    }
    await refreshDocuments();
  };

  // 바로 인쇄
  const handlePrintDocFromList = (doc) => {
    handleSelectDocFromList(doc);
    setTimeout(() => {
      window.print();
    }, 300);
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
          <div className="form-render-container">
            {activeFormCode === '01-02-01' && (
              <Form01_02_01
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
        )}
      </main>

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

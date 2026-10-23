import React, { useState, useEffect } from 'react';
import { X, Settings, Check, PenTool, RotateCcw, Building, User, Award } from 'lucide-react';
import { getDefaultSettings, setDefaultSettings } from '../services/storage';

export default function DefaultSettingsModal({ isOpen, onClose, onSaved, onOpenSignature }) {
  const [settings, setSettings] = useState({
    schoolName: '',
    inspectorDept: '',
    inspectorName: '',
    inspectorSign: '',
    signManager: '',
    signPrincipal: '',
    instructorName: '',
    instructorTitle: '',
    eduLocation: '',
    contractorCompany: '',
    contractorLeader: ''
  });

  useEffect(() => {
    if (isOpen) {
      setSettings(getDefaultSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setDefaultSettings(settings);
    if (onSaved) onSaved(settings);
    alert('기본 정보가 저장되었습니다.\n새 서식 작성 시 자동으로 이 정보들이 채워집니다!');
    onClose();
  };

  const handleReset = () => {
    if (confirm('기본 설정을 모두 초기화하시겠습니까?')) {
      const empty = {
        schoolName: '',
        inspectorDept: '',
        inspectorName: '',
        inspectorSign: '',
        signManager: '',
        signPrincipal: '',
        instructorName: '',
        instructorTitle: '',
        eduLocation: '',
        contractorCompany: '',
        contractorLeader: ''
      };
      setSettings(empty);
      setDefaultSettings(empty);
      if (onSaved) onSaved(empty);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card default-settings-modal">
        <div className="modal-header">
          <div className="modal-title">
            <Settings size={20} className="text-primary" />
            <h3>기본 정보 설정 (자동 완성 프리셋)</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body space-y-4">
          <div className="notice-banner">
            <p>
              여기에 자주 사용하는 <strong>학교명, 담당자 정보, 결재 서명</strong> 등을 한 번 등록해 두시면,
              서식을 새로 작성할 때마다 <strong>자동으로 입력</strong>되어 일일이 다시 입력하실 필요가 없습니다.
            </p>
          </div>

          {/* 1. 기관 및 점검자 기본 정보 */}
          <div className="settings-section">
            <h4 className="section-title">
              <Building size={16} /> 기관 및 담당자 정보
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group col-span-2">
                <label>기본 학교(기관)명</label>
                <input
                  type="text"
                  placeholder="예: 서울OO고등학교"
                  value={settings.schoolName || ''}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>담당/점검자 소속 부서</label>
                <input
                  type="text"
                  placeholder="예: 행정실 / 시설관리팀"
                  value={settings.inspectorDept || ''}
                  onChange={(e) => handleChange('inspectorDept', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>담당/점검자 성명</label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={settings.inspectorName || ''}
                  onChange={(e) => handleChange('inspectorName', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* 2. 기본 결재 서명 등록 */}
          <div className="settings-section">
            <h4 className="section-title">
              <Award size={16} /> 기본 결재 서명 등록 (원클릭 자동 날인)
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="sign-box-item">
                <span className="text-xs font-semibold block mb-1.5">점검자 서명</span>
                <div className="sign-setting-preview">
                  {settings.inspectorSign ? (
                    <img src={settings.inspectorSign} alt="점검자 서명" />
                  ) : (
                    <span className="text-xs text-muted">서명 미등록</span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-xs btn-outline mt-1.5 w-full"
                  onClick={() => onOpenSignature('inspectorSign', '점검자 기본 서명', (signUrl) => handleChange('inspectorSign', signUrl))}
                >
                  <PenTool size={12} /> {settings.inspectorSign ? '변경' : '서명 등록'}
                </button>
              </div>

              <div className="sign-box-item">
                <span className="text-xs font-semibold block mb-1.5">담당 결재 서명</span>
                <div className="sign-setting-preview">
                  {settings.signManager ? (
                    <img src={settings.signManager} alt="담당 서명" />
                  ) : (
                    <span className="text-xs text-muted">서명 미등록</span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-xs btn-outline mt-1.5 w-full"
                  onClick={() => onOpenSignature('signManager', '담당 기본 서명', (signUrl) => handleChange('signManager', signUrl))}
                >
                  <PenTool size={12} /> {settings.signManager ? '변경' : '서명 등록'}
                </button>
              </div>

              <div className="sign-box-item">
                <span className="text-xs font-semibold block mb-1.5">학교장 결재 서명</span>
                <div className="sign-setting-preview">
                  {settings.signPrincipal ? (
                    <img src={settings.signPrincipal} alt="학교장 서명" />
                  ) : (
                    <span className="text-xs text-muted">서명 미등록</span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-xs btn-outline mt-1.5 w-full"
                  onClick={() => onOpenSignature('signPrincipal', '학교장 기본 서명', (signUrl) => handleChange('signPrincipal', signUrl))}
                >
                  <PenTool size={12} /> {settings.signPrincipal ? '변경' : '서명 등록'}
                </button>
              </div>
            </div>
          </div>

          {/* 3. 안전보건교육 기본 정보 */}
          <div className="settings-section">
            <h4 className="section-title">
              <User size={16} /> 안전보건교육 기본 정보
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="form-group">
                <label>교육 강사 성명</label>
                <input
                  type="text"
                  placeholder="예: 김안전"
                  value={settings.instructorName || ''}
                  onChange={(e) => handleChange('instructorName', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>교육 강사 직명</label>
                <input
                  type="text"
                  placeholder="예: 관리감독자 / 영양교사"
                  value={settings.instructorTitle || ''}
                  onChange={(e) => handleChange('instructorTitle', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>교육 실시 장소</label>
                <input
                  type="text"
                  placeholder="예: 본관 2층 시청각실"
                  value={settings.eduLocation || ''}
                  onChange={(e) => handleChange('eduLocation', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* 4. 공사/용역 협력업체 기본 정보 */}
          <div className="settings-section">
            <h4 className="section-title">공사/용역 협력업체 기본 정보 (04-01-03 용)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label>자주 함께하는 업체명</label>
                <input
                  type="text"
                  placeholder="예: (주)한국시설관리"
                  value={settings.contractorCompany || ''}
                  onChange={(e) => handleChange('contractorCompany', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>업체 책임자 성명</label>
                <input
                  type="text"
                  placeholder="예: 박대표"
                  value={settings.contractorLeader || ''}
                  onChange={(e) => handleChange('contractorLeader', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline text-danger" onClick={handleReset}>
            <RotateCcw size={15} /> 초기화
          </button>
          <div className="btn-group-right">
            <button className="btn btn-secondary" onClick={onClose}>닫기</button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Check size={16} /> 기본 정보 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

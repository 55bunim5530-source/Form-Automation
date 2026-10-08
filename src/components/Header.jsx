import React from 'react';
import { Shield, Printer, Save, Database, PlusCircle, FolderOpen, ChevronDown, Settings, Building } from 'lucide-react';
import { FORM_METAS } from '../forms/formDataPresets';

export default function Header({
  activeFormCode,
  onSelectFormCode,
  onNewDoc,
  onSaveDoc,
  onPrint,
  onOpenSettings,
  onOpenDefaultSettings,
  isListOpen,
  onToggleList,
  saving,
  storageSource,
  activeDoc,
  defaultSchoolName
}) {
  return (
    <header className="app-header-container no-print">
      {/* 1. 상단 전체를 차지하는 웅장하고 큰 타이틀 배너 */}
      <div className="top-hero-banner">
        <div className="hero-banner-inner">
          <div className="hero-left">
            <div className="hero-shield-icon">
              <Shield size={32} className="text-white" />
            </div>
            <div className="hero-text">
              <h1 className="hero-title">산업안전보건 서식 자동화 시스템</h1>
              <p className="hero-subtitle">
                표준서식 자동화 작성 &amp; 출력 &amp; 저장 기능
              </p>
            </div>
          </div>

          <div className="hero-right">
            {/* 기본 기관명 뱃지 */}
            <div className="school-pill" onClick={onOpenDefaultSettings} title="클릭하여 기본 정보 변경">
              <Building size={16} className="text-blue-500" />
              <div className="school-pill-text">
                <span className="pill-label">설정된 기본 기관:</span>
                <span className="pill-name">{defaultSchoolName || '기관명 미설정 (클릭하여 설정)'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 하단 액션 및 서식 컨트롤 바 */}
      <div className="action-control-bar">
        <div className="control-bar-left">
          <div className="form-selector-box">
            <label className="selector-label">선택된 서식:</label>
            <div className="select-container">
              <select
                value={activeFormCode}
                onChange={(e) => onSelectFormCode(e.target.value)}
                className="form-select-lg"
              >
                {Array.from(new Set(Object.values(FORM_METAS).map((m) => m.category))).map((cat) => (
                  <optgroup key={cat} label={`📂 ${cat}`}>
                    {Object.entries(FORM_METAS)
                      .filter(([_, meta]) => meta.category === cat)
                      .map(([code, meta]) => (
                        <option key={code} value={code}>
                          [{code}] {meta.title}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown size={16} className="select-arrow" />
            </div>
          </div>
        </div>

        <div className="control-bar-right">
          {/* 기본 정보 설정 버튼 */}
          <button
            className="btn btn-default-settings"
            onClick={onOpenDefaultSettings}
            title="기관명, 담당자, 결재 서명을 세팅해두면 매번 자동으로 입력됩니다"
          >
            <Settings size={16} />
            <span>기본 정보 세팅</span>
          </button>

          {/* 문서 보관함 토글 버튼 */}
          <button
            className={`btn ${isListOpen ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onToggleList(!isListOpen)}
          >
            <FolderOpen size={16} />
            <span>보관함 ({isListOpen ? '닫기' : '열기'})</span>
          </button>

          {/* 새 문서 작성 */}
          <button className="btn btn-outline" onClick={onNewDoc}>
            <PlusCircle size={16} />
            <span>새 서식 작성</span>
          </button>

          {/* Supabase 설정 */}
          <button
            className={`btn btn-outline ${storageSource === 'supabase' ? 'btn-supabase-active' : ''}`}
            onClick={onOpenSettings}
            title="Supabase 백엔드 연동 설정"
          >
            <Database size={16} className={storageSource === 'supabase' ? 'text-emerald-500' : ''} />
            <span>DB 연동</span>
          </button>

          {/* 저장 버튼 */}
          <button
            className="btn btn-secondary btn-save"
            onClick={onSaveDoc}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? '저장 중...' : activeDoc ? '수정 저장' : '저장하기'}</span>
          </button>

          {/* 출력/인쇄 버튼 */}
          <button className="btn btn-primary btn-print" onClick={onPrint}>
            <Printer size={16} />
            <span>출력 / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
}

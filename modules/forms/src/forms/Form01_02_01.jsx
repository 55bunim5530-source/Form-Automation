import React, { useState } from 'react';
import { FORM_01_02_01_SECTORS } from './formDataPresets';
import { PenTool, Trash2 } from 'lucide-react';

export default function Form01_02_01({ formData, onChange, onOpenSignature }) {
  const sector = formData.sector || 'facility';
  const sectorPreset = FORM_01_02_01_SECTORS[sector] || FORM_01_02_01_SECTORS.facility;

  // 체크리스트 항목이 없으면 기본 프리셋으로 초기화
  const items = formData.items && formData.items.length > 0 
    ? formData.items 
    : sectorPreset.items.map(item => ({
        ...item,
        result: 'O', // 기본 양호
        issue: '',
        improvement: ''
      }));

  const handleSectorChange = (newSector) => {
    const preset = FORM_01_02_01_SECTORS[newSector] || FORM_01_02_01_SECTORS.facility;
    onChange({
      ...formData,
      sector: newSector,
      items: preset.items.map(item => ({
        ...item,
        result: 'O',
        issue: '',
        improvement: ''
      }))
    });
  };

  const handleFieldChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const handleItemChange = (index, field, value) => {
    const nextItems = [...items];
    nextItems[index] = {
      ...nextItems[index],
      [field]: value
    };
    onChange({
      ...formData,
      items: nextItems
    });
  };

  return (
    <div className="official-document print-sheet">
      {/* 서식 메타 헤더 (인쇄 시 상단 표시) */}
      <div className="doc-top-bar">
        <div className="doc-top-subtext">(주1회) 정기점검 실시 및 (월1회) 기관장 보고</div>
      </div>

      {/* 분야 선택 탭 (화면에서만 보이고 인쇄시 숨김) */}
      <div className="sector-tab-bar no-print">
        <span className="font-semibold text-sm mr-2 text-slate-700">점검 분야 선택:</span>
        <div className="tab-group">
          {Object.entries(FORM_01_02_01_SECTORS).map(([key, val]) => (
            <button
              key={key}
              type="button"
              className={`tab-btn ${sector === key ? 'active' : ''}`}
              onClick={() => handleSectorChange(key)}
            >
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* 문서 메인 타이틀 */}
      <h2 className="doc-main-title">
        {sector === 'facility' && '시설관리 안전·보건 자체 점검표'}
        {sector === 'cleaning' && '청소(미화) 안전·보건 자체 점검표'}
        {sector === 'kitchen' && '조리(급식실) 안전·보건 자체 점검표'}
      </h2>

      {/* 상단 기본정보 & 결재란 */}
      <div className="doc-meta-and-approval">
        {/* 기본 정보 표 */}
        <table className="meta-info-table">
          <tbody>
            <tr>
              <th style={{ width: '15%' }}>학교(기관)명</th>
              <td colSpan={3}>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 서울OO고등학교"
                  value={formData.schoolName || ''}
                  onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>점검일자<br/><span className="text-xs text-muted">(주차별)</span></th>
              <td style={{ width: '35%' }}>
                <div className="week-date-inputs">
                  {[1, 2, 3, 4, 5].map((week) => (
                    <div key={week} className="week-row">
                      <span className="week-label">{week}주:</span>
                      <input
                        type="date"
                        className="table-input text-xs"
                        value={formData.dates?.[week] || ''}
                        onChange={(e) => {
                          const dates = { ...(formData.dates || {}) };
                          dates[week] = e.target.value;
                          handleFieldChange('dates', dates);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </td>
              <th style={{ width: '15%' }}>점검자</th>
              <td style={{ width: '35%' }}>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-xs w-12 text-muted form-inline-token">소속:</span>
                    <input
                      type="text"
                      className="table-input flex-1"
                      placeholder="행정실 / 시설관리실"
                      value={formData.inspectorDept || ''}
                      onChange={(e) => handleFieldChange('inspectorDept', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs w-12 text-muted form-inline-token">직·성명:</span>
                    <input
                      type="text"
                      className="table-input flex-1"
                      placeholder="직급 및 성명"
                      value={formData.inspectorName || ''}
                      onChange={(e) => handleFieldChange('inspectorName', e.target.value)}
                    />
                    {formData.inspectorSign ? (
                      <div className="sign-preview form-inline-signature" onClick={() => onOpenSignature('inspectorSign', '점검자 서명')}>
                        <img src={formData.inspectorSign} alt="서명" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-sign-trigger no-print"
                        onClick={() => onOpenSignature('inspectorSign', '점검자 서명')}
                      >
                        <PenTool size={12} /> 서명
                      </button>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 결재란 */}
        <table className="approval-table">
          <tbody>
            <tr>
              <th rowSpan={2} className="approval-side">결<br/><br/>재</th>
              <th className="approval-header">담당</th>
              <th className="approval-header">학교장</th>
            </tr>
            <tr>
              <td className="approval-cell">
                {formData.signManager ? (
                  <div className="sign-preview" onClick={() => onOpenSignature('signManager', '담당 결재')}>
                    <img src={formData.signManager} alt="담당 서명" />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-sign-trigger no-print"
                    onClick={() => onOpenSignature('signManager', '담당 결재')}
                  >
                    서명
                  </button>
                )}
              </td>
              <td className="approval-cell">
                {formData.signPrincipal ? (
                  <div className="sign-preview" onClick={() => onOpenSignature('signPrincipal', '학교장 결재')}>
                    <img src={formData.signPrincipal} alt="학교장 서명" />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-sign-trigger no-print"
                    onClick={() => onOpenSignature('signPrincipal', '학교장 결재')}
                  >
                    서명
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-caption-guide">
        ※ 점검결과: 해설내용에 따라 점검한 결과 ⇒ 양호하면 <strong>(O)</strong>, 불량하면 <strong>(X)</strong>
      </div>

      {/* 점검표 본문 테이블 */}
      <table className="official-table">
        <thead>
          <tr>
            <th style={{ width: '12%' }}>항 목</th>
            <th style={{ width: '48%' }}>점 검 내 용 (Check Point)</th>
            <th style={{ width: '10%' }}>점검결과</th>
            <th style={{ width: '15%' }}>문제점</th>
            <th style={{ width: '15%' }}>개선내용</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="text-center font-medium bg-slate-50">
                <div className="text-xs text-muted">{item.category}</div>
                <div className="text-xs font-semibold">{item.subcategory}</div>
              </td>
              <td className="text-left py-1 px-2 text-xs leading-relaxed">
                {item.check}
              </td>
              <td className="text-center">
                <div className="result-selector">
                  {['O', 'X'].map((res) => (
                    <label key={res} className={`result-label ${item.result === res ? 'checked' : ''}`}>
                      <input
                        type="radio"
                        name={`result_${idx}`}
                        aria-label={`${idx + 1}번 점검결과 ${res}`}
                        value={res}
                        checked={item.result === res}
                        onChange={() => handleItemChange(idx, 'result', res)}
                        className="hidden-radio"
                      />
                      <span>{res}</span>
                    </label>
                  ))}
                </div>
              </td>
              <td>
                <textarea
                  className="table-textarea text-xs"
                  rows={2}
                  placeholder="문제점 입력"
                  value={item.issue || ''}
                  onChange={(e) => handleItemChange(idx, 'issue', e.target.value)}
                />
              </td>
              <td>
                <textarea
                  className="table-textarea text-xs"
                  rows={2}
                  placeholder="개선조치 입력"
                  value={item.improvement || ''}
                  onChange={(e) => handleItemChange(idx, 'improvement', e.target.value)}
                />
              </td>
            </tr>
          ))}
          <tr>
            <th className="bg-slate-50 text-center">기타<br/>점검사항</th>
            <td colSpan={4}>
              <textarea
                className="table-textarea text-xs w-full"
                rows={3}
                placeholder="추가적인 위험요인 및 특이사항, 시설물 보수 요구사항 등을 기재하세요."
                value={formData.etcNotes || ''}
                onChange={(e) => handleFieldChange('etcNotes', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="doc-footer-note">
        ※ 점검내용은 학교(기관) 실정에 맞게 변경하여 사용할 수 있음
      </div>
    </div>
  );
}

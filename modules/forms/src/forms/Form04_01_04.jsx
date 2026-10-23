import React from 'react';
import { FORM_04_01_04_TYPES } from './formDataPresets';
import { PenTool, CheckCircle } from 'lucide-react';

export default function Form04_01_04({ formData, onChange, onOpenSignature }) {
  const currentType = formData.checklistType || 'fall';
  const typeConfig = FORM_04_01_04_TYPES[currentType] || FORM_04_01_04_TYPES.fall;

  const currentItems = formData[`items_${currentType}`] || typeConfig.items.map((text, idx) => ({
    no: idx + 1,
    content: text,
    result: '예' // 저장값 예 / 아니오를 화면에서 O / X로 표시
  }));

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleTypeChange = (typeKey) => {
    onChange({ ...formData, checklistType: typeKey });
  };

  const handleItemResultChange = (index, value) => {
    const next = [...currentItems];
    next[index] = { ...next[index], result: value };
    onChange({ ...formData, [`items_${currentType}`]: next });
  };

  const handleAllYes = () => {
    const next = currentItems.map(it => ({ ...it, result: '예' }));
    onChange({ ...formData, [`items_${currentType}`]: next });
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-top-subtext">( 제시된 서식은 예시 서식이니 추가하거나 변경할 수 있음 )</div>
      </div>

      {/* 4종 체크리스트 탭 전환 바 (인쇄 시 숨김) */}
      <div className="no-print mb-4 flex gap-2 border-b pb-2">
        <button
          type="button"
          className={`btn btn-sm ${currentType === 'fall' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleTypeChange('fall')}
        >
          1. 추락재해 예방 (7항목)
        </button>
        <button
          type="button"
          className={`btn btn-sm ${currentType === 'electric' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleTypeChange('electric')}
        >
          2. 전기공사 감전재해 (8항목)
        </button>
        <button
          type="button"
          className={`btn btn-sm ${currentType === 'confined' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleTypeChange('confined')}
        >
          3. 밀폐공간 질식재해 (11항목)
        </button>
        <button
          type="button"
          className={`btn btn-sm ${currentType === 'general' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleTypeChange('general')}
        >
          4. 일반 산업재해 (15항목)
        </button>
      </div>

      <h2 className="doc-main-title">{typeConfig.title}</h2>
      <div className="text-center text-xs text-muted mb-4 font-medium">
        {typeConfig.subtitle}
      </div>

      {/* 기본 정보 바 */}
      <div className="info-bar-box mb-3">
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">■ 공사(용역)업체명 :</span>
          <input
            type="text"
            className="form-input text-sm"
            placeholder="업체명 입력"
            value={formData.contractorCompany || ''}
            onChange={(e) => handleFieldChange('contractorCompany', e.target.value)}
          />
        </div>
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">■ 점 검 자 :</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="form-input text-sm w-28"
              placeholder="점검자 성명"
              value={formData.inspectorName || ''}
              onChange={(e) => handleFieldChange('inspectorName', e.target.value)}
            />
            {formData.inspectorSign ? (
              <div className="sign-preview small" onClick={() => onOpenSignature('inspectorSign', '점검자 서명')}>
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
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">■ 점검일자 :</span>
          <input
            type="date"
            className="form-input text-sm"
            value={formData.docDate || ''}
            onChange={(e) => handleFieldChange('docDate', e.target.value)}
          />
        </div>
      </div>

      <div className="no-print flex justify-end mb-2">
        <button type="button" className="btn btn-xs btn-outline" onClick={handleAllYes}>
          <CheckCircle size={13} /> 전 항목 'O'로 일괄 선택
        </button>
      </div>

      <div className="table-wrapper">
        <table className="doc-table">
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '45px' }}>번호</th>
              <th rowSpan="2">점 검 내 용</th>
              <th colSpan="2" style={{ width: '90px' }}>점검결과</th>
            </tr>
            <tr>
              <th style={{ width: '45px', padding: '4px' }}>O</th>
              <th style={{ width: '45px', padding: '4px' }}>X</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={idx}>
                <td className="text-center font-bold">{item.no}</td>
                <td style={{ fontSize: '0.85rem', lineHeight: '1.45', padding: '6px 10px' }}>
                  {item.content}
                </td>
                <td className="text-center">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`chk_${currentType}_${idx}`}
                      aria-label={`${item.no}번 점검결과 O`}
                      checked={item.result === '예'}
                      onChange={() => handleItemResultChange(idx, '예')}
                    />
                  </label>
                </td>
                <td className="text-center">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`chk_${currentType}_${idx}`}
                      aria-label={`${item.no}번 점검결과 X`}
                      checked={item.result === '아니오'}
                      onChange={() => handleItemResultChange(idx, '아니오')}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-xs text-muted">
        ※ A/S 등 1회성 작업의 경우에도 반드시 체크리스트 작성
      </div>

      {typeConfig.notes && typeConfig.notes.length > 0 && (
        <div className="border border-slate-300 rounded p-3 mt-3 bg-slate-50 text-xs text-slate-700 leading-relaxed">
          <div className="font-bold mb-1 text-slate-900">안전보건 점검사항 및 조치사항 (예시 / 참고)</div>
          {typeConfig.notes.map((note, nIdx) => (
            <div key={nIdx}>{note}</div>
          ))}
        </div>
      )}
    </div>
  );
}

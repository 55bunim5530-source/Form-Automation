import React from 'react';
import { FORM_04_01_03_ITEMS } from './formDataPresets';
import { PenTool } from 'lucide-react';

export default function Form04_01_03({ formData, onChange, onOpenSignature }) {
  const items = formData.items && formData.items.length === FORM_04_01_03_ITEMS.length
    ? formData.items
    : FORM_04_01_03_ITEMS.map(it => ({
        no: it.no,
        content: it.content,
        result: '예', // 예 / 아니오 / 해당없음
        subChecks: {
          fall: 'O',
          electric: 'O',
          confined: 'X',
          general: 'O'
        }
      }));

  const handleFieldChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const handleItemResultChange = (index, value) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], result: value };
    onChange({ ...formData, items: nextItems });
  };

  const handleSubCheckChange = (subKey, value) => {
    const nextItems = [...items];
    const item6 = nextItems[5];
    nextItems[5] = {
      ...item6,
      subChecks: {
        ...(item6.subChecks || {}),
        [subKey]: value
      }
    };
    onChange({ ...formData, items: nextItems });
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-code-tag">04-01-03</div>
        <div className="doc-top-subtext">( 제시된 서식은 예시 서식이니 추가하거나 변경할 수 있음 )</div>
      </div>

      <h2 className="doc-main-title">공사(용역) 안전·보건 체크리스트(공통)</h2>
      <div className="text-center text-xs text-muted mb-4 font-medium">
        [ 기관(학교)에서 점검하고, 업체에서 확인하여 자체 보관 ]
      </div>

      {/* 기본 정보 바 */}
      <div className="info-bar-box mb-3">
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">■ 기관(학교)명 :</span>
          <input
            type="text"
            className="form-input text-sm"
            placeholder="학교(기관)명 입력"
            value={formData.schoolName || ''}
            onChange={(e) => handleFieldChange('schoolName', e.target.value)}
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

      {/* 10개 점검 항목 테이블 */}
      <table className="official-table mb-4">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>번호</th>
            <th style={{ width: '68%' }}>점 검 내 용</th>
            <th style={{ width: '24%' }} colSpan={3}>점검결과</th>
          </tr>
          <tr className="sub-header-row">
            <th colSpan={2}></th>
            <th style={{ width: '8%' }}>예</th>
            <th style={{ width: '8%' }}>아니오</th>
            <th style={{ width: '8%' }}>해당없음</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <React.Fragment key={item.no}>
              <tr>
                <td className="text-center font-bold">{item.no}</td>
                <td className="text-left text-xs leading-relaxed py-2 px-3">
                  <div>{item.content}</div>

                  {/* 6번 항목 세부 서식 첨부 표 */}
                  {item.no === 6 && (
                    <div className="mt-2 pl-2 border-l-2 border-primary/30">
                      <table className="inner-table">
                        <thead>
                          <tr>
                            <th>점검 체크리스트</th>
                            <th style={{ width: '90px' }}>해당여부(○,×)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { key: 'fall', label: '(붙임) 추락재해 예방 체크리스트' },
                            { key: 'electric', label: '(붙임) 감전재해 예방 체크리스트' },
                            { key: 'confined', label: '(붙임) 밀폐공간 질식재해예방 체크리스트' },
                            { key: 'general', label: '(붙임) 일반 산업재해 예방 체크리스트' }
                          ].map((sub) => (
                            <tr key={sub.key}>
                              <td>{sub.label}</td>
                              <td className="text-center">
                                <select
                                  className="inner-select"
                                  value={item.subChecks?.[sub.key] || 'O'}
                                  onChange={(e) => handleSubCheckChange(sub.key, e.target.value)}
                                >
                                  <option value="O">O (해당)</option>
                                  <option value="X">X (해당없음)</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </td>
                {['예', '아니오', '해당없음'].map((option) => (
                  <td key={option} className="text-center">
                    <label className="checkbox-cell-label">
                      <input
                        type="radio"
                        name={`item_${item.no}`}
                        value={option}
                        checked={item.result === option}
                        onChange={() => handleItemResultChange(idx, option)}
                      />
                      <span className="print-mark">{item.result === option ? 'V' : ''}</span>
                    </label>
                  </td>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="text-xs text-muted mb-4">
        ※ A/S 등 1회성 작업의 경우에도 반드시 체크리스트 징구
      </div>

      {/* 하단 공사(용역)업체 확인·서약서 */}
      <div className="pledge-card">
        <h3 className="pledge-title">공사(용역)업체 확인·서약서</h3>
        <p className="pledge-text">
          학교(기관)로부터 위 점검항목에 대하여 안내(주지)받았으며, 공사(용역) 전 과정에 걸쳐 참여하는
          근로자에게 안전보건교육을 실시하고, 필요한 개인보호구를 지급 및 착용하며, 작업 시 안전수칙을 준수할 것을 서약합니다.
        </p>

        <div className="pledge-footer">
          <div className="pledge-row">
            <span className="pledge-label">소속(회사) :</span>
            <input
              type="text"
              className="pledge-input"
              placeholder="(주)안전건설"
              value={formData.contractorCompany || ''}
              onChange={(e) => handleFieldChange('contractorCompany', e.target.value)}
            />
          </div>

          <div className="pledge-row">
            <span className="pledge-label">공사(용역)업체 책임자 :</span>
            <input
              type="text"
              className="pledge-input"
              placeholder="홍길동"
              value={formData.contractorLeader || ''}
              onChange={(e) => handleFieldChange('contractorLeader', e.target.value)}
            />
            {formData.contractorSign ? (
              <div className="sign-preview" onClick={() => onOpenSignature('contractorSign', '업체 책임자 서명')}>
                <img src={formData.contractorSign} alt="서명" />
              </div>
            ) : (
              <button
                type="button"
                className="btn-sign-trigger no-print"
                onClick={() => onOpenSignature('contractorSign', '업체 책임자 서명')}
              >
                <PenTool size={12} /> (서명 / 인)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

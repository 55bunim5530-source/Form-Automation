import React from 'react';
import { MUSCULOSKELETAL_ITEMS } from './formDataPresets';
import { Plus, Trash2 } from 'lucide-react';

export default function Form09_01_01({ formData, onChange }) {
  const defaultWorkRows = [
    { workName: '급식실 조리 및 식재료 전처리', checks: { '2호': 'O', '3호': 'O', '4호': 'O', '7호': 'O', '9호': 'O', '10호': 'O' } },
    { workName: '교내 환경미화 및 바닥 청소', checks: { '2호': 'O', '4호': 'O', '5호': 'O', '7호': 'O' } },
    { workName: '행정실 문서 입력 및 전산 작업', checks: { '1호': 'O' } }
  ];

  const workRows = formData.workRows && formData.workRows.length > 0 ? formData.workRows : defaultWorkRows;

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleCheckToggle = (rowIdx, itemNo) => {
    const next = [...workRows];
    const curChecks = next[rowIdx].checks || {};
    next[rowIdx] = {
      ...next[rowIdx],
      checks: {
        ...curChecks,
        [itemNo]: curChecks[itemNo] === 'O' ? '' : 'O'
      }
    };
    onChange({ ...formData, workRows: next });
  };

  const handleWorkNameChange = (rowIdx, value) => {
    const next = [...workRows];
    next[rowIdx] = { ...next[rowIdx], workName: value };
    onChange({ ...formData, workRows: next });
  };

  const addWorkRow = () => {
    const next = [
      ...workRows,
      { workName: '', checks: {} }
    ];
    onChange({ ...formData, workRows: next });
  };

  const removeWorkRow = (idx) => {
    if (workRows.length <= 1) return;
    const next = workRows.filter((_, i) => i !== idx);
    onChange({ ...formData, workRows: next });
  };

  return (
    <div className="official-document print-sheet" style={{ maxWidth: '1080px' }}>
      <div className="doc-top-bar">
        <div className="doc-code-tag">09-01-01</div>
        <div className="doc-top-subtext">(근골격계부담작업 유해요인조사) 체크리스트</div>
      </div>

      <h2 className="doc-main-title mb-4">
        (정기/수시) 근골격계부담작업 체크리스트
      </h2>

      {/* 기본 정보 테이블 */}
      <div className="table-wrapper mb-3">
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '100px' }}>사업장명</th>
              <td>
                <input
                  type="text"
                  className="table-input font-bold"
                  value={formData.schoolName || ''}
                  onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                />
              </td>
              <th style={{ width: '100px' }}>조사 일자</th>
              <td>
                <input
                  type="date"
                  className="table-input"
                  value={formData.docDate || ''}
                  onChange={(e) => handleFieldChange('docDate', e.target.value)}
                />
              </td>
              <th style={{ width: '100px' }}>조 사 자</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  value={formData.inspectorName || ''}
                  onChange={(e) => handleFieldChange('inspectorName', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>공 정 명</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 급식공정, 청소미화공정"
                  value={formData.processName || ''}
                  onChange={(e) => handleFieldChange('processName', e.target.value)}
                />
              </td>
              <th>공정 내용</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="공정 주요 작업 내용 기술"
                  value={formData.processContent || ''}
                  onChange={(e) => handleFieldChange('processContent', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 1호~11호 매트릭스 테이블 */}
      <div className="table-wrapper">
        <table className="doc-table" style={{ fontSize: '0.74rem' }}>
          <thead>
            <tr>
              <th style={{ width: '70px' }}>구 분</th>
              {MUSCULOSKELETAL_ITEMS.map((item) => (
                <th key={item.no} style={{ minWidth: '82px', padding: '4px 2px' }}>
                  {item.no}
                </th>
              ))}
              <th className="no-print" style={{ width: '35px' }}>삭제</th>
            </tr>
            <tr>
              <th style={{ backgroundColor: '#f8fafc' }}>노출시간</th>
              {MUSCULOSKELETAL_ITEMS.map((item) => (
                <td key={item.no} className="text-center p-1 text-slate-700 font-medium">
                  {item.expTime}
                </td>
              ))}
              <td className="no-print"></td>
            </tr>
            <tr>
              <th style={{ backgroundColor: '#f8fafc' }}>노출빈도</th>
              {MUSCULOSKELETAL_ITEMS.map((item) => (
                <td key={item.no} className="text-center p-1 text-slate-700 font-medium">
                  {item.cycle}
                </td>
              ))}
              <td className="no-print"></td>
            </tr>
            <tr>
              <th style={{ backgroundColor: '#f8fafc' }}>신체부위</th>
              {MUSCULOSKELETAL_ITEMS.map((item) => (
                <td key={item.no} className="text-center p-1 font-semibold text-slate-900">
                  {item.body}
                </td>
              ))}
              <td className="no-print"></td>
            </tr>
            <tr>
              <th style={{ backgroundColor: '#f8fafc' }}>작업자세<br />및 내용</th>
              {MUSCULOSKELETAL_ITEMS.map((item) => (
                <td key={item.no} className="p-1 leading-snug text-slate-800" style={{ fontSize: '0.7rem' }}>
                  {item.posture}
                </td>
              ))}
              <td className="no-print"></td>
            </tr>
            <tr>
              <th style={{ backgroundColor: '#f8fafc' }}>무 게</th>
              {MUSCULOSKELETAL_ITEMS.map((item) => (
                <td key={item.no} className="text-center p-1 text-slate-700" style={{ fontSize: '0.7rem' }}>
                  {item.weight}
                </td>
              ))}
              <td className="no-print"></td>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-slate-100 font-bold">
              <td colSpan={13} className="p-1.5 text-slate-800">
                ▼ 작업별 해당 호수 체크 (클릭하여 'O' 표시)
              </td>
            </tr>
            {workRows.map((row, rIdx) => (
              <tr key={rIdx}>
                <td style={{ padding: '2px' }}>
                  <input
                    type="text"
                    className="table-input font-bold text-xs"
                    placeholder="작업명 입력"
                    value={row.workName}
                    onChange={(e) => handleWorkNameChange(rIdx, e.target.value)}
                  />
                </td>
                {MUSCULOSKELETAL_ITEMS.map((item) => {
                  const checked = row.checks?.[item.no] === 'O';
                  return (
                    <td
                      key={item.no}
                      className={`text-center cursor-pointer font-bold select-none ${checked ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50'}`}
                      style={{ fontSize: '1.05rem', verticalAlign: 'middle' }}
                      onClick={() => handleCheckToggle(rIdx, item.no)}
                    >
                      {checked ? 'O' : ''}
                    </td>
                  );
                })}
                <td className="text-center no-print">
                  <button
                    type="button"
                    className="btn-row-del"
                    onClick={() => removeWorkRow(rIdx)}
                    title="행 삭제"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="no-print mt-3 flex justify-between items-center">
        <button type="button" className="btn btn-sm btn-outline" onClick={addWorkRow}>
          <Plus size={14} /> 작업 행 추가하기
        </button>
        <span className="text-xs text-muted">
          * 칸을 클릭하면 'O'가 표시되며, 'O'가 하나라도 있는 작업은 법정 근골격계 부담작업으로 분류됩니다.
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import { PenTool, Plus, Trash2 } from 'lucide-react';

export default function Form03_01_01({ formData, onChange, onOpenSignature }) {
  const equipCol1 = formData.equipCol1 !== undefined ? formData.equipCol1 : '안전모';
  const equipCol2 = formData.equipCol2 !== undefined ? formData.equipCol2 : '안전화';
  const equipCol3 = formData.equipCol3 !== undefined ? formData.equipCol3 : '보안경';
  const equipCol4 = formData.equipCol4 !== undefined ? formData.equipCol4 : '안전장갑';

  const initialRows = Array.from({ length: 15 }, (_, i) => ({
    no: i + 1,
    date: '',
    name: '',
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    sign: ''
  }));

  const rows = formData.rows && formData.rows.length > 0 ? formData.rows : initialRows;

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleRowChange = (index, field, value) => {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...formData, rows: next });
  };

  const addRow = () => {
    const next = [
      ...rows,
      {
        no: rows.length + 1,
        date: '',
        name: '',
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        sign: ''
      }
    ];
    onChange({ ...formData, rows: next });
  };

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    const next = rows.filter((_, idx) => idx !== index).map((r, i) => ({ ...r, no: i + 1 }));
    onChange({ ...formData, rows: next });
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-top-subtext">산업안전보건업무 매뉴얼 [서식]</div>
      </div>

      <h2 className="doc-main-title">안전보호구 지급 대장</h2>

      {/* 기관명 및 관리 정보 */}
      <div className="info-bar-box mb-3">
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">■ 관리 기관(학교)명 :</span>
          <input
            type="text"
            className="form-input text-sm"
            placeholder="학교(기관)명 입력"
            value={formData.schoolName || ''}
            onChange={(e) => handleFieldChange('schoolName', e.target.value)}
          />
        </div>
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">■ 관리 담당자 :</span>
          <input
            type="text"
            className="form-input text-sm w-32"
            placeholder="성명"
            value={formData.inspectorName || ''}
            onChange={(e) => handleFieldChange('inspectorName', e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="doc-table">
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '45px' }}>번호</th>
              <th rowSpan="2" style={{ width: '100px' }}>지급일자</th>
              <th rowSpan="2" style={{ width: '90px' }}>성 명</th>
              <th colSpan="4">지급 수량</th>
              <th rowSpan="2" style={{ width: '95px' }}>서 명</th>
              <th rowSpan="2" className="no-print" style={{ width: '40px' }}>삭제</th>
            </tr>
            <tr>
              <th style={{ width: '70px', padding: '4px' }}>
                <input
                  type="text"
                  className="table-input text-center font-bold"
                  value={equipCol1}
                  onChange={(e) => handleFieldChange('equipCol1', e.target.value)}
                  placeholder="보호구명"
                />
              </th>
              <th style={{ width: '70px', padding: '4px' }}>
                <input
                  type="text"
                  className="table-input text-center font-bold"
                  value={equipCol2}
                  onChange={(e) => handleFieldChange('equipCol2', e.target.value)}
                  placeholder="보호구명"
                />
              </th>
              <th style={{ width: '70px', padding: '4px' }}>
                <input
                  type="text"
                  className="table-input text-center font-bold"
                  value={equipCol3}
                  onChange={(e) => handleFieldChange('equipCol3', e.target.value)}
                  placeholder="보호구명"
                />
              </th>
              <th style={{ width: '70px', padding: '4px' }}>
                <input
                  type="text"
                  className="table-input text-center font-bold"
                  value={equipCol4}
                  onChange={(e) => handleFieldChange('equipCol4', e.target.value)}
                  placeholder="보호구명"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="text-center font-bold">{row.no}</td>
                <td>
                  <input
                    type="date"
                    className="table-input text-center text-xs"
                    value={row.date}
                    onChange={(e) => handleRowChange(idx, 'date', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center font-medium"
                    placeholder="성명"
                    value={row.name}
                    onChange={(e) => handleRowChange(idx, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center"
                    placeholder="수량"
                    value={row.q1}
                    onChange={(e) => handleRowChange(idx, 'q1', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center"
                    placeholder="수량"
                    value={row.q2}
                    onChange={(e) => handleRowChange(idx, 'q2', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center"
                    placeholder="수량"
                    value={row.q3}
                    onChange={(e) => handleRowChange(idx, 'q3', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center"
                    placeholder="수량"
                    value={row.q4}
                    onChange={(e) => handleRowChange(idx, 'q4', e.target.value)}
                  />
                </td>
                <td className="text-center" style={{ height: '36px', verticalAlign: 'middle', padding: '2px' }}>
                  {row.sign ? (
                    <div
                      className="sign-preview micro cursor-pointer"
                      onClick={() =>
                        onOpenSignature(
                          `equip_sign_${idx}`,
                          `${row.name || row.no + '번'} 수령 서명`,
                          (url) => handleRowChange(idx, 'sign', url)
                        )
                      }
                    >
                      <img src={row.sign} alt="서명" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-sign-trigger micro no-print"
                      onClick={() =>
                        onOpenSignature(
                          `equip_sign_${idx}`,
                          `${row.name || row.no + '번'} 수령 서명`,
                          (url) => handleRowChange(idx, 'sign', url)
                        )
                      }
                    >
                      <PenTool size={11} /> 서명
                    </button>
                  )}
                </td>
                <td className="text-center no-print">
                  <button
                    type="button"
                    className="btn-row-del"
                    onClick={() => removeRow(idx)}
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

      <div className="no-print mt-2 flex justify-between items-center">
        <button type="button" className="btn btn-sm btn-outline" onClick={addRow}>
          <Plus size={14} /> 행 추가하기
        </button>
        <span className="text-xs text-muted">
          * 보호구명 상단 헤더를 직접 클릭하여 필요한 보호구(방진마스크, 귀마개 등)로 변경할 수 있습니다.
        </span>
      </div>
    </div>
  );
}

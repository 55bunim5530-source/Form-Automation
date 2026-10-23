import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function Form08_01_02({ formData, onChange }) {
  const defaultRows = [
    {
      no: 1,
      workDetail: '급식실 조리 및 배식 작업',
      place: '조리장 바닥 및 트렌치',
      riskType: '넘어짐(전도)',
      hazardContent: '조리 및 세척 중 바닥에 물기와 기름기로 미끄러짐 위험',
      currentAction: '미끄럼 방지 작업화 착용',
      curProb: 3,
      curSev: 2,
      curRisk: 6,
      reduceMeasure: '1. 트렌치 주변 미끄럼 방지 매트 설치\n2. 조리 중 실시간 바닥 청소 및 건조',
      afterProb: 1,
      afterSev: 2,
      afterRisk: 2,
      actionCode: 'R-01',
      planDate: '2026-05-30',
      doneDate: '2026-05-28',
      confirm: '영양사'
    },
    {
      no: 2,
      workDetail: '학교 교사동 수목 전지작업',
      place: '화단 및 정원 수목',
      riskType: '떨어짐(추락)',
      hazardContent: '높이 2m 이상 사다리 위에서 전정기 사용 중 균형 상실 추락',
      currentAction: '안전모 착용',
      curProb: 3,
      curSev: 3,
      curRisk: 9,
      reduceMeasure: '1. 2인 1조 작업 준수 및 하부 지지자 배치\n2. 아웃트리거 장착 사다리 또는 이동식 비계 사용',
      afterProb: 1,
      afterSev: 3,
      afterRisk: 3,
      actionCode: 'R-02',
      planDate: '2026-06-15',
      doneDate: '',
      confirm: '행정실장'
    }
  ];

  const rows = formData.rows && formData.rows.length > 0 ? formData.rows : defaultRows;

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleRowChange = (index, field, value) => {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };

    // 위험성(곱셈) 자동 계산
    if (field === 'curProb' || field === 'curSev') {
      const p = field === 'curProb' ? Number(value) : Number(next[index].curProb || 1);
      const s = field === 'curSev' ? Number(value) : Number(next[index].curSev || 1);
      next[index].curRisk = p * s;
    }
    if (field === 'afterProb' || field === 'afterSev') {
      const p = field === 'afterProb' ? Number(value) : Number(next[index].afterProb || 1);
      const s = field === 'afterSev' ? Number(value) : Number(next[index].afterSev || 1);
      next[index].afterRisk = p * s;
    }

    onChange({ ...formData, rows: next });
  };

  const addRow = () => {
    const next = [
      ...rows,
      {
        no: rows.length + 1,
        workDetail: '',
        place: '',
        riskType: '',
        hazardContent: '',
        currentAction: '',
        curProb: 2,
        curSev: 2,
        curRisk: 4,
        reduceMeasure: '',
        afterProb: 1,
        afterSev: 2,
        afterRisk: 2,
        actionCode: `R-${String(rows.length + 1).padStart(2, '0')}`,
        planDate: '',
        doneDate: '',
        confirm: ''
      }
    ];
    onChange({ ...formData, rows: next });
  };

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    const next = rows.filter((_, i) => i !== index).map((r, i) => ({ ...r, no: i + 1 }));
    onChange({ ...formData, rows: next });
  };

  return (
    <div className="official-document print-sheet" style={{ maxWidth: '1080px' }}>
      <div className="doc-top-bar">
        <div className="doc-top-subtext">위험성평가표 서식 (예시 1, 2)</div>
      </div>

      <h2 className="doc-main-title mb-4">위 험 성 평 가 표</h2>

      {/* 헤더 정보 */}
      <div className="info-bar-box mb-3">
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">공 정 명 :</span>
          <input
            type="text"
            className="form-input text-sm w-40"
            placeholder="예: 급식관리, 시설관리"
            value={formData.processName || ''}
            onChange={(e) => handleFieldChange('processName', e.target.value)}
          />
        </div>
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">평가일시 :</span>
          <input
            type="date"
            className="form-input text-sm"
            value={formData.docDate || ''}
            onChange={(e) => handleFieldChange('docDate', e.target.value)}
          />
        </div>
        <div className="info-bar-item flex-1">
          <span className="info-bar-label font-bold">평가담당자 및 구성원 :</span>
          <input
            type="text"
            className="form-input text-sm flex-1"
            placeholder="평가담당자, 관리감독자, 근로자 대표 등 성명"
            value={formData.evalMembers || ''}
            onChange={(e) => handleFieldChange('evalMembers', e.target.value)}
          />
        </div>
      </div>

      {/* 평가표 메인 테이블 */}
      <div className="table-wrapper">
        <table className="doc-table" style={{ fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '35px' }}>NO</th>
              <th rowSpan="2" style={{ width: '110px' }}>작업내용<br />(세부공정)</th>
              <th rowSpan="2" style={{ width: '90px' }}>장소<br />(설비)</th>
              <th rowSpan="2" style={{ width: '85px' }}>위험분류<br />(재해형태)</th>
              <th rowSpan="2">유해·위험요인<br />내용</th>
              <th rowSpan="2" style={{ width: '110px' }}>현재의<br />안전보건조치</th>
              <th colSpan="3" style={{ width: '105px' }}>현재 위험성</th>
              <th rowSpan="2" style={{ width: '160px' }}>위험성 감소대책</th>
              <th colSpan="3" style={{ width: '105px' }}>개선후 위험성</th>
              <th colSpan="3" style={{ width: '135px' }}>감소대책의 실행</th>
              <th rowSpan="2" className="no-print" style={{ width: '35px' }}>삭제</th>
            </tr>
            <tr>
              <th style={{ width: '35px', padding: '2px' }}>가능</th>
              <th style={{ width: '35px', padding: '2px' }}>중대</th>
              <th style={{ width: '35px', padding: '2px' }}>위험</th>
              <th style={{ width: '35px', padding: '2px' }}>가능</th>
              <th style={{ width: '35px', padding: '2px' }}>중대</th>
              <th style={{ width: '35px', padding: '2px' }}>위험</th>
              <th style={{ width: '45px', padding: '2px' }}>예정일</th>
              <th style={{ width: '45px', padding: '2px' }}>완료일</th>
              <th style={{ width: '45px', padding: '2px' }}>담당</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="text-center font-bold">{row.no}</td>
                <td>
                  <textarea
                    className="table-textarea text-xs"
                    rows="2"
                    value={row.workDetail}
                    onChange={(e) => handleRowChange(idx, 'workDetail', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-xs"
                    value={row.place}
                    onChange={(e) => handleRowChange(idx, 'place', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-xs text-center"
                    value={row.riskType}
                    onChange={(e) => handleRowChange(idx, 'riskType', e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    className="table-textarea text-xs"
                    rows="2"
                    value={row.hazardContent}
                    onChange={(e) => handleRowChange(idx, 'hazardContent', e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    className="table-textarea text-xs"
                    rows="2"
                    value={row.currentAction}
                    onChange={(e) => handleRowChange(idx, 'currentAction', e.target.value)}
                  />
                </td>
                {/* 현재 위험성 */}
                <td>
                  <input
                    type="number"
                    className="table-input text-center text-xs p-0"
                    min="1"
                    max="5"
                    value={row.curProb}
                    onChange={(e) => handleRowChange(idx, 'curProb', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="table-input text-center text-xs p-0"
                    min="1"
                    max="4"
                    value={row.curSev}
                    onChange={(e) => handleRowChange(idx, 'curSev', e.target.value)}
                  />
                </td>
                <td className="text-center font-bold text-xs" style={{ color: (row.curRisk || 0) >= 9 ? '#dc2626' : '#2563eb' }}>
                  {row.curRisk}
                </td>

                {/* 감소대책 */}
                <td>
                  <textarea
                    className="table-textarea text-xs"
                    rows="2"
                    value={row.reduceMeasure}
                    onChange={(e) => handleRowChange(idx, 'reduceMeasure', e.target.value)}
                  />
                </td>

                {/* 개선후 위험성 */}
                <td>
                  <input
                    type="number"
                    className="table-input text-center text-xs p-0"
                    min="1"
                    max="5"
                    value={row.afterProb}
                    onChange={(e) => handleRowChange(idx, 'afterProb', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="table-input text-center text-xs p-0"
                    min="1"
                    max="4"
                    value={row.afterSev}
                    onChange={(e) => handleRowChange(idx, 'afterSev', e.target.value)}
                  />
                </td>
                <td className="text-center font-bold text-xs text-emerald-600">
                  {row.afterRisk}
                </td>

                {/* 실행 관리 */}
                <td>
                  <input
                    type="text"
                    className="table-input text-center text-xs"
                    placeholder="월/일"
                    value={row.planDate}
                    onChange={(e) => handleRowChange(idx, 'planDate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center text-xs"
                    placeholder="월/일"
                    value={row.doneDate}
                    onChange={(e) => handleRowChange(idx, 'doneDate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center text-xs"
                    value={row.confirm}
                    onChange={(e) => handleRowChange(idx, 'confirm', e.target.value)}
                  />
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
          <Plus size={14} /> 위험성평가 항목 추가하기
        </button>
        <span className="text-xs text-muted">
          * 가능성(1~5) × 중대성(1~4) = 위험성(1~20)이 자동 계산됩니다. (9점 이상: 개선대책 필수)
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function Form09_01_04({ formData, onChange }) {
  const defaultRows = [
    {
      process: '급식실 조리공정',
      work: '식재료 입고 및 보관',
      issue: '20kg 쌀포대 및 중량 농산물을 바닥에서 허리를 숙여 운반하여 요추 부담 가중',
      workerOpinion: '운반 카트 높이 개선 및 소분 입고 요청',
      improvement: '1. 리프트형 전동 높낮이 조절 운반카트 도입\n2. 납품업체 10kg 이하 소분 납품 계약 변경',
      schedule: '2026.06.30',
      manager: '영양사',
      confirmDate: '2026.06.25',
      cost: '1,500'
    },
    {
      process: '급식실 조리공정',
      work: '대형 국솥 조리 및 세척',
      issue: '국솥 깊이가 깊어 팔을 어깨 위로 들고 장시간 젓는 부적절한 자세 지속',
      workerOpinion: '자동 회전 교반기 또는 발판 설치 요망',
      improvement: '1. 높이 조절식 조리 작업발판 설치\n2. 2인 교대 조리 실시 및 자동 교반기 점진적 교체',
      schedule: '2026.07.15',
      manager: '행정실장',
      confirmDate: '',
      cost: '800'
    }
  ];

  const rows = formData.rows && formData.rows.length > 0 ? formData.rows : defaultRows;

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
        process: '',
        work: '',
        issue: '',
        workerOpinion: '',
        improvement: '',
        schedule: '',
        manager: '',
        confirmDate: '',
        cost: ''
      }
    ];
    onChange({ ...formData, rows: next });
  };

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    const next = rows.filter((_, i) => i !== index);
    onChange({ ...formData, rows: next });
  };

  return (
    <div className="official-document print-sheet" style={{ maxWidth: '1080px' }}>
      <div className="doc-top-bar">
        <div className="doc-code-tag">09-01-04</div>
        <div className="doc-top-subtext">(근골격계부담작업 유해요인조사) 작업환경 개선 계획서</div>
      </div>

      <h2 className="doc-main-title mb-6">작업환경 개선 계획서</h2>

      {/* 기본 정보 바 */}
      <div className="info-bar-box mb-3">
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">기관(학교)명 :</span>
          <input
            type="text"
            className="form-input text-sm w-44"
            placeholder="학교명"
            value={formData.schoolName || ''}
            onChange={(e) => handleFieldChange('schoolName', e.target.value)}
          />
        </div>
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">작성일자 :</span>
          <input
            type="date"
            className="form-input text-sm"
            value={formData.docDate || ''}
            onChange={(e) => handleFieldChange('docDate', e.target.value)}
          />
        </div>
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">작성자 :</span>
          <input
            type="text"
            className="form-input text-sm w-32"
            placeholder="성명"
            value={formData.author || ''}
            onChange={(e) => handleFieldChange('author', e.target.value)}
          />
        </div>
      </div>

      {/* 메인 테이블 */}
      <div className="table-wrapper">
        <table className="doc-table" style={{ fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th style={{ width: '90px' }}>공정명</th>
              <th style={{ width: '100px' }}>작업명</th>
              <th style={{ width: '180px' }}>문제점<br />(유해요인의 원인)</th>
              <th style={{ width: '150px' }}>근로자의 의견</th>
              <th>개선방안</th>
              <th style={{ width: '80px' }}>추진일정</th>
              <th style={{ width: '70px' }}>담당자</th>
              <th style={{ width: '80px' }}>확인일자</th>
              <th style={{ width: '75px' }}>개선비용<br />(천원)</th>
              <th className="no-print" style={{ width: '35px' }}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="text"
                    className="table-input text-xs"
                    placeholder="공정명"
                    value={row.process}
                    onChange={(e) => handleRowChange(idx, 'process', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-xs font-bold"
                    placeholder="작업명"
                    value={row.work}
                    onChange={(e) => handleRowChange(idx, 'work', e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    className="table-textarea text-xs"
                    rows="3"
                    placeholder="유해요인 원인"
                    value={row.issue}
                    onChange={(e) => handleRowChange(idx, 'issue', e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    className="table-textarea text-xs"
                    rows="3"
                    placeholder="근로자 현장 의견"
                    value={row.workerOpinion}
                    onChange={(e) => handleRowChange(idx, 'workerOpinion', e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    className="table-textarea text-xs font-medium"
                    rows="3"
                    placeholder="구체적인 개선 대책"
                    value={row.improvement}
                    onChange={(e) => handleRowChange(idx, 'improvement', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center text-xs"
                    placeholder="YYYY.MM"
                    value={row.schedule}
                    onChange={(e) => handleRowChange(idx, 'schedule', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center text-xs"
                    placeholder="담당자"
                    value={row.manager}
                    onChange={(e) => handleRowChange(idx, 'manager', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center text-xs"
                    placeholder="확인일"
                    value={row.confirmDate}
                    onChange={(e) => handleRowChange(idx, 'confirmDate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-right text-xs"
                    placeholder="금액"
                    value={row.cost}
                    onChange={(e) => handleRowChange(idx, 'cost', e.target.value)}
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

      <div className="no-print mt-3 flex justify-between items-center">
        <button type="button" className="btn btn-sm btn-outline" onClick={addRow}>
          <Plus size={14} /> 개선 계획 행 추가하기
        </button>
        <span className="text-xs text-muted">
          * 근골격계부담작업 유해요인조사 결과에 따른 법정 작업환경 개선 계획서입니다.
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import { PenTool, Plus, Trash2, Image, Upload } from 'lucide-react';

export default function Form04_01_08({ formData, onChange, onOpenSignature }) {
  const docType = formData.docType || 'meeting'; // 'meeting' (회의록) or 'inspection' (합동점검)

  // 도급자 참석자 목록 기본 4명
  const employerAttendees = formData.employerAttendees || [
    { role: '학교장', name: '', sign: '' },
    { role: '교감', name: '', sign: '' },
    { role: '행정실장', name: '', sign: '' },
    { role: '안전담당자', name: '', sign: '' }
  ];

  // 수급자 참석자 목록 기본 4명
  const contractorAttendees = formData.contractorAttendees || [
    { role: '미화용역대표', name: '', sign: '' },
    { role: '경비용역대표', name: '', sign: '' },
    { role: '시설관리용역', name: '', sign: '' },
    { role: '급식위탁대표', name: '', sign: '' }
  ];

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleAttendeeChange = (listType, index, field, value) => {
    const list = listType === 'employer' ? [...employerAttendees] : [...contractorAttendees];
    list[index] = { ...list[index], [field]: value };
    onChange({
      ...formData,
      [listType === 'employer' ? 'employerAttendees' : 'contractorAttendees']: list
    });
  };

  const handleAddAttendee = (listType) => {
    const list = listType === 'employer' ? [...employerAttendees] : [...contractorAttendees];
    list.push({ role: '', name: '', sign: '' });
    onChange({
      ...formData,
      [listType === 'employer' ? 'employerAttendees' : 'contractorAttendees']: list
    });
  };

  const handleRemoveAttendee = (listType, index) => {
    const list = listType === 'employer' ? [...employerAttendees] : [...contractorAttendees];
    list.splice(index, 1);
    onChange({
      ...formData,
      [listType === 'employer' ? 'employerAttendees' : 'contractorAttendees']: list
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const images = formData.evidenceImages || [];
        onChange({
          ...formData,
          evidenceImages: [...images, reader.result]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    const images = [...(formData.evidenceImages || [])];
    images.splice(index, 1);
    onChange({ ...formData, evidenceImages: images });
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-code-tag">04-01-08</div>
        <div className="doc-top-subtext">안전보건협의체 회의록 및 합동점검</div>
      </div>

      {/* 모드 선택 탭 (회의록 / 합동점검) */}
      <div className="sector-tab-bar no-print">
        <span className="font-semibold text-sm mr-2 text-slate-700">문서 종류:</span>
        <div className="tab-group">
          <button
            type="button"
            className={`tab-btn ${docType === 'meeting' ? 'active' : ''}`}
            onClick={() => handleFieldChange('docType', 'meeting')}
          >
            안전보건협의체 회의록
          </button>
          <button
            type="button"
            className={`tab-btn ${docType === 'inspection' ? 'active' : ''}`}
            onClick={() => handleFieldChange('docType', 'inspection')}
          >
            분기 합동점검 결과보고
          </button>
        </div>
      </div>

      {/* 헤더 타이틀 및 결재란 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <input
              type="text"
              className="form-input text-lg font-bold w-48 border-b-2"
              placeholder="OO학교"
              value={formData.schoolName || ''}
              onChange={(e) => handleFieldChange('schoolName', e.target.value)}
            />
            <span className="text-lg font-bold">
              {docType === 'meeting' ? '안전보건협의체' : '합동점검'}
            </span>
          </div>

          <h2 className="doc-main-title text-left mt-1 mb-0">
            {docType === 'meeting' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="form-input w-20 text-center font-bold"
                  placeholder="2024"
                  value={formData.year || new Date().getFullYear()}
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                />
                <span>년 (</span>
                <input
                  type="text"
                  className="form-input w-14 text-center font-bold"
                  placeholder="1"
                  value={formData.month || ''}
                  onChange={(e) => handleFieldChange('month', e.target.value)}
                />
                <span>)월 회의록</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="form-input w-20 text-center font-bold"
                  placeholder="2024"
                  value={formData.year || new Date().getFullYear()}
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                />
                <span>년 (</span>
                <input
                  type="text"
                  className="form-input w-14 text-center font-bold"
                  placeholder="1"
                  value={formData.quarter || '1'}
                  onChange={(e) => handleFieldChange('quarter', e.target.value)}
                />
                <span>)분기 합동점검</span>
              </div>
            )}
          </h2>
        </div>

        {/* 결재란 */}
        <table className="approval-table">
          <tbody>
            <tr>
              <th rowSpan={2} className="approval-side">결<br/><br/>재</th>
              <th className="approval-header">담당</th>
              <th className="approval-header">학교(기관)장</th>
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

      {/* 일시 및 장소 표 */}
      <table className="official-table mb-3">
        <tbody>
          <tr>
            <th style={{ width: '15%' }}>일 시</th>
            <td style={{ width: '85%' }}>
              <input
                type="text"
                className="table-input"
                placeholder="예: 2024년 5월 10일 금요일 14:00"
                value={formData.dateTime || ''}
                onChange={(e) => handleFieldChange('dateTime', e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>{docType === 'meeting' ? '장 소' : '점검장소'}</th>
            <td>
              <input
                type="text"
                className="table-input"
                placeholder={docType === 'meeting' ? '예: 본관 2층 소회의실' : '예: 본관, 시설관리실, 급식실, 교사동 일대'}
                value={formData.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* 회의 내용 또는 점검 내용 */}
      <table className="official-table mb-3">
        <thead>
          <tr>
            <th>{docType === 'meeting' ? '협의 내용 등' : '점검내용 및 현장 건의사항'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">
              <div className="mb-2">
                <div className="font-bold text-xs text-primary mb-1">
                  {docType === 'meeting' ? '<협의안건>' : '<점검내용 및 지적사항>'}
                </div>
                <textarea
                  className="table-textarea text-xs w-full"
                  rows={4}
                  placeholder={
                    docType === 'meeting'
                      ? "1. 사다리 작업 시 안전모 착용 건\n2. 보호구 지급대장 관리 건\n3. 하절기 폭염 대비 근로자 휴게시설 운영 건"
                      : "1. 옥상 출입구 '추락주의' 위험표지 훼손 보수 필요\n2. 수목 전지작업 시 안전모 및 2인1조 미준수 개선\n3. 급식실 세척구역 미끄럼방지 매트 추가 설치"
                  }
                  value={formData.agendas || ''}
                  onChange={(e) => handleFieldChange('agendas', e.target.value)}
                />
              </div>

              <div>
                <div className="font-bold text-xs text-primary mb-1">
                  {docType === 'meeting' ? '<건의사항 및 기타 협의>' : '<현장 건의사항 및 조치계획>'}
                </div>
                <textarea
                  className="table-textarea text-xs w-full"
                  rows={3}
                  placeholder="위탁업체 및 근로자 건의사항, 조치 요구사항 기재"
                  value={formData.suggestions || ''}
                  onChange={(e) => handleFieldChange('suggestions', e.target.value)}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 참석자 명단 테이블 (도급자 / 수급자 분할) */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-xs">■ 참석자 명단</span>
          <div className="flex gap-2 no-print">
            <button
              type="button"
              className="btn btn-xs btn-outline"
              onClick={() => handleAddAttendee('employer')}
            >
              + 도급자 추가
            </button>
            <button
              type="button"
              className="btn btn-xs btn-outline"
              onClick={() => handleAddAttendee('contractor')}
            >
              + 수급자 추가
            </button>
          </div>
        </div>

        <table className="official-table">
          <thead>
            <tr>
              <th colSpan={3} style={{ width: '50%' }}>도급자 소속</th>
              <th colSpan={3} style={{ width: '50%' }}>수급자 소속</th>
            </tr>
            <tr className="sub-header-row">
              <th style={{ width: '18%' }}>직책</th>
              <th style={{ width: '18%' }}>성 명</th>
              <th style={{ width: '14%' }}>서 명</th>
              <th style={{ width: '18%' }}>소속 및 직책</th>
              <th style={{ width: '18%' }}>성 명</th>
              <th style={{ width: '14%' }}>서 명</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.max(employerAttendees.length, contractorAttendees.length) }).map((_, i) => {
              const emp = employerAttendees[i] || {};
              const con = contractorAttendees[i] || {};

              return (
                <tr key={i}>
                  {/* 도급자 열 */}
                  <td>
                    {employerAttendees[i] ? (
                      <input
                        type="text"
                        className="table-input text-center text-xs"
                        value={emp.role || ''}
                        onChange={(e) => handleAttendeeChange('employer', i, 'role', e.target.value)}
                        placeholder="직책"
                      />
                    ) : null}
                  </td>
                  <td>
                    {employerAttendees[i] ? (
                      <input
                        type="text"
                        className="table-input text-center text-xs"
                        value={emp.name || ''}
                        onChange={(e) => handleAttendeeChange('employer', i, 'name', e.target.value)}
                        placeholder="성명"
                      />
                    ) : null}
                  </td>
                  <td className="text-center">
                    {employerAttendees[i] && (
                      emp.sign ? (
                        <div
                          className="sign-preview small"
                          onClick={() => onOpenSignature(`attendee_emp_${i}`, `${emp.role || '도급자'} 서명`)}
                        >
                          <img src={emp.sign} alt="서명" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn-sign-trigger no-print"
                          onClick={() => onOpenSignature(`attendee_emp_${i}`, `${emp.role || '도급자'} 서명`)}
                        >
                          서명
                        </button>
                      )
                    )}
                  </td>

                  {/* 수급자 열 */}
                  <td>
                    {contractorAttendees[i] ? (
                      <input
                        type="text"
                        className="table-input text-center text-xs"
                        value={con.role || ''}
                        onChange={(e) => handleAttendeeChange('contractor', i, 'role', e.target.value)}
                        placeholder="업체명 및 직책"
                      />
                    ) : null}
                  </td>
                  <td>
                    {contractorAttendees[i] ? (
                      <input
                        type="text"
                        className="table-input text-center text-xs"
                        value={con.name || ''}
                        onChange={(e) => handleAttendeeChange('contractor', i, 'name', e.target.value)}
                        placeholder="성명"
                      />
                    ) : null}
                  </td>
                  <td className="text-center">
                    {contractorAttendees[i] && (
                      con.sign ? (
                        <div
                          className="sign-preview small"
                          onClick={() => onOpenSignature(`attendee_con_${i}`, `${con.role || '수급자'} 서명`)}
                        >
                          <img src={con.sign} alt="서명" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn-sign-trigger no-print"
                          onClick={() => onOpenSignature(`attendee_con_${i}`, `${con.role || '수급자'} 서명`)}
                        >
                          서명
                        </button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 증빙 자료 첨부 (사진) */}
      <div className="evidence-section">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-xs">■ 증빙 자료 (사진 등)</span>
          <label className="btn btn-xs btn-outline no-print cursor-pointer">
            <Upload size={13} /> 사진 추가
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <div className="evidence-grid">
          {(formData.evidenceImages || []).length === 0 ? (
            <div className="evidence-empty-box">
              <Image size={24} className="text-slate-400 mb-1" />
              <span className="text-xs text-muted">회의 또는 현장 합동점검 사진을 등록할 수 있습니다.</span>
            </div>
          ) : (
            formData.evidenceImages.map((img, idx) => (
              <div key={idx} className="evidence-item">
                <img src={img} alt={`증빙 ${idx + 1}`} />
                <button
                  type="button"
                  className="btn-remove-img no-print"
                  onClick={() => handleRemoveImage(idx)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

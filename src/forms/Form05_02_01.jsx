import React from 'react';
import { PenTool, Upload, Trash2, Image } from 'lucide-react';
import SummarizeButton from '../components/SummarizeButton';

export default function Form05_02_01({ formData, onChange, onOpenSignature }) {
  // 참석자 20명 초기화
  const attendees = formData.attendees && formData.attendees.length === 20
    ? formData.attendees
    : Array.from({ length: 20 }, (_, i) => ({
        no: i + 1,
        jobType: '',
        name: '',
        sign: ''
      }));

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleAttendeeChange = (index, field, value) => {
    const nextAttendees = [...attendees];
    nextAttendees[index] = { ...nextAttendees[index], [field]: value };
    onChange({ ...formData, attendees: nextAttendees });
  };

  // 인원 수 입력 시 합계 자동 계산
  const targetMale = parseInt(formData.targetMale || 0, 10) || 0;
  const targetFemale = parseInt(formData.targetFemale || 0, 10) || 0;
  const targetTotal = targetMale + targetFemale;

  const actualMale = parseInt(formData.actualMale || 0, 10) || 0;
  const actualFemale = parseInt(formData.actualFemale || 0, 10) || 0;
  const actualTotal = actualMale + actualFemale;

  const absentMale = targetMale - actualMale >= 0 ? targetMale - actualMale : 0;
  const absentFemale = targetFemale - actualFemale >= 0 ? targetFemale - actualFemale : 0;
  const absentTotal = absentMale + absentFemale;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const images = formData.evidenceImages || [];
        onChange({ ...formData, evidenceImages: [...images, reader.result] });
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
        <div className="doc-code-tag">05-02-01</div>
        <div className="doc-top-subtext">안전보건교육일지(현장교육 시)</div>
      </div>

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h2 className="doc-main-title text-left mt-2 mb-0">안전보건교육일지</h2>
          <div className="text-xs text-muted mt-1">
            학교(기관)명: 
            <input
              type="text"
              className="form-input text-xs w-48 inline-block ml-1 border-b"
              placeholder="OO초등학교"
              value={formData.schoolName || ''}
              onChange={(e) => handleFieldChange('schoolName', e.target.value)}
            />
          </div>
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

      {/* 교육 기본정보 표 */}
      <table className="official-table mb-3">
        <tbody>
          <tr>
            <th style={{ width: '15%' }}>교육일시</th>
            <td colSpan={3}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <input
                  type="date"
                  className="table-input w-36"
                  value={formData.eduDate || ''}
                  onChange={(e) => handleFieldChange('eduDate', e.target.value)}
                />
                <input
                  type="time"
                  className="table-input w-24"
                  value={formData.startTime || '09:00'}
                  onChange={(e) => handleFieldChange('startTime', e.target.value)}
                />
                <span>~</span>
                <input
                  type="time"
                  className="table-input w-24"
                  value={formData.endTime || '10:00'}
                  onChange={(e) => handleFieldChange('endTime', e.target.value)}
                />
                <span>(</span>
                <input
                  type="text"
                  className="table-input w-16 text-center"
                  placeholder="60"
                  value={formData.durationMinutes || '60'}
                  onChange={(e) => handleFieldChange('durationMinutes', e.target.value)}
                />
                <span>분간)</span>
              </div>
            </td>
          </tr>
          <tr>
            <th>교육구분</th>
            <td colSpan={3}>
              <div className="flex flex-wrap gap-4 text-xs py-1">
                {[
                  { key: 'new', label: '신규 채용시 교육' },
                  { key: 'regular', label: '근로자 정기교육(MSDS, 근골격계관련 교육 포함)' },
                  { key: 'change', label: '작업내용 변경시 교육' },
                  { key: 'other', label: '기타 교육' }
                ].map((cat) => (
                  <label key={cat.key} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="eduCategory"
                      value={cat.key}
                      checked={(formData.eduCategory || 'regular') === cat.key}
                      onChange={(e) => handleFieldChange('eduCategory', e.target.value)}
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 교육 인원 통계 표 */}
      <table className="official-table mb-3 text-center">
        <thead>
          <tr>
            <th style={{ width: '25%' }}>구 분</th>
            <th style={{ width: '15%' }}>계</th>
            <th style={{ width: '15%' }}>남</th>
            <th style={{ width: '15%' }}>여</th>
            <th style={{ width: '30%' }}>교육미실시사유</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="bg-slate-50 font-normal">교육 대상자 수</th>
            <td className="font-bold">{targetTotal}명</td>
            <td>
              <input
                type="number"
                className="table-input text-center"
                value={formData.targetMale || ''}
                onChange={(e) => handleFieldChange('targetMale', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                className="table-input text-center"
                value={formData.targetFemale || ''}
                onChange={(e) => handleFieldChange('targetFemale', e.target.value)}
              />
            </td>
            <td>-</td>
          </tr>
          <tr>
            <th className="bg-slate-50 font-normal">교육 실시자 수</th>
            <td className="font-bold text-primary">{actualTotal}명</td>
            <td>
              <input
                type="number"
                className="table-input text-center"
                value={formData.actualMale || ''}
                onChange={(e) => handleFieldChange('actualMale', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                className="table-input text-center"
                value={formData.actualFemale || ''}
                onChange={(e) => handleFieldChange('actualFemale', e.target.value)}
              />
            </td>
            <td>-</td>
          </tr>
          <tr>
            <th className="bg-slate-50 font-normal">교육 미실시자 수</th>
            <td className="font-bold text-rose-600">{absentTotal}명</td>
            <td>{absentMale}명</td>
            <td>{absentFemale}명</td>
            <td>
              <input
                type="text"
                className="table-input"
                placeholder="예: 연가, 병가, 출장 등"
                value={formData.absentReason || ''}
                onChange={(e) => handleFieldChange('absentReason', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* 교육과목 및 교육내용 */}
      <table className="official-table mb-3">
        <tbody>
          <tr>
            <th style={{ width: '22%', minWidth: '135px' }}>교육과목<br/>(주제)</th>
            <td>
              <input
                type="text"
                className="table-input font-bold"
                placeholder="예: 2024년 2분기 정기 안전보건교육 (재해예방 및 직무스트레스 관리)"
                value={formData.eduSubject || ''}
                onChange={(e) => handleFieldChange('eduSubject', e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th style={{ width: '22%', minWidth: '135px' }}>
              <div className="th-summary-container">
                <span className="th-summary-title">교육내용</span>
                <SummarizeButton
                  formCode="05-02-01"
                  buttonLabel={
                    <>
                      관련자료 업로드<br/>및 자동정리
                    </>
                  }
                  onApply={(result) => {
                    onChange({
                      ...formData,
                      eduContent: result.eduContent || formData.eduContent
                    });
                  }}
                />
              </div>
            </th>
            <td>
              <textarea
                className="table-textarea text-xs w-full"
                rows={5}
                placeholder="1. 산업안전 및 사고 예방에 관한 사항&#10;2. 산업보건 및 직업병 예방에 관한 사항&#10;3. 건강증진 및 질병 예방에 관한 사항&#10;4. 유해·위험 작업환경 관리에 관한 사항&#10;5. 산업안전보건법령 및 일반관리에 관한 사항"
                value={formData.eduContent || ''}
                onChange={(e) => handleFieldChange('eduContent', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* 교육강사 및 장소 */}
      <table className="official-table mb-3 text-center">
        <thead>
          <tr>
            <th colSpan={4}>교육강사 및 장소</th>
          </tr>
          <tr className="sub-header-row">
            <th style={{ width: '25%' }}>성 명</th>
            <th style={{ width: '25%' }}>직 명</th>
            <th style={{ width: '30%' }}>교육실시 장소</th>
            <th style={{ width: '20%' }}>비 고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                className="table-input text-center"
                placeholder="강사 성명"
                value={formData.instructorName || ''}
                onChange={(e) => handleFieldChange('instructorName', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className="table-input text-center"
                placeholder="관리감독자 / 전문강사"
                value={formData.instructorTitle || ''}
                onChange={(e) => handleFieldChange('instructorTitle', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className="table-input text-center"
                placeholder="시청각실 / 회의실"
                value={formData.eduLocation || ''}
                onChange={(e) => handleFieldChange('eduLocation', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className="table-input text-center"
                placeholder="자체교육 등"
                value={formData.instructorNotes || ''}
                onChange={(e) => handleFieldChange('instructorNotes', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* 안전보건교육 참석자 명단 (1~20인) 2열 분할 */}
      <div className="mb-3">
        <div className="text-center font-bold text-sm my-2">안전보건교육 참석자 명단</div>
        <table className="official-table text-center">
          <thead>
            <tr>
              <th style={{ width: '6%' }}>NO</th>
              <th style={{ width: '18%' }}>직 종</th>
              <th style={{ width: '16%' }}>성 명</th>
              <th style={{ width: '10%' }}>서 명</th>
              <th style={{ width: '6%' }}>NO</th>
              <th style={{ width: '18%' }}>직 종</th>
              <th style={{ width: '16%' }}>성 명</th>
              <th style={{ width: '10%' }}>서 명</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, row) => {
              const leftIdx = row;
              const rightIdx = row + 10;
              const leftItem = attendees[leftIdx];
              const rightItem = attendees[rightIdx];

              return (
                <tr key={row}>
                  {/* 왼쪽 열 (1~10) */}
                  <td className="font-bold bg-slate-50">{leftItem.no}</td>
                  <td>
                    <input
                      type="text"
                      className="table-input text-xs text-center"
                      placeholder="시설관리/조리 등"
                      value={leftItem.jobType || ''}
                      onChange={(e) => handleAttendeeChange(leftIdx, 'jobType', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input text-xs text-center"
                      placeholder="성명"
                      value={leftItem.name || ''}
                      onChange={(e) => handleAttendeeChange(leftIdx, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    {leftItem.sign ? (
                      <div
                        className="sign-preview small"
                        onClick={() => onOpenSignature(`attendee_${leftIdx}`, `${leftItem.name || leftItem.no}번 서명`)}
                      >
                        <img src={leftItem.sign} alt="서명" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-sign-trigger no-print"
                        onClick={() => onOpenSignature(`attendee_${leftIdx}`, `${leftItem.name || leftItem.no}번 서명`)}
                      >
                        서명
                      </button>
                    )}
                  </td>

                  {/* 오른쪽 열 (11~20) */}
                  <td className="font-bold bg-slate-50">{rightItem.no}</td>
                  <td>
                    <input
                      type="text"
                      className="table-input text-xs text-center"
                      placeholder="시설관리/조리 등"
                      value={rightItem.jobType || ''}
                      onChange={(e) => handleAttendeeChange(rightIdx, 'jobType', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input text-xs text-center"
                      placeholder="성명"
                      value={rightItem.name || ''}
                      onChange={(e) => handleAttendeeChange(rightIdx, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    {rightItem.sign ? (
                      <div
                        className="sign-preview small"
                        onClick={() => onOpenSignature(`attendee_${rightIdx}`, `${rightItem.name || rightItem.no}번 서명`)}
                      >
                        <img src={rightItem.sign} alt="서명" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-sign-trigger no-print"
                        onClick={() => onOpenSignature(`attendee_${rightIdx}`, `${rightItem.name || rightItem.no}번 서명`)}
                      >
                        서명
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 비고 및 교육사진 첨부 */}
      <div className="evidence-section">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-xs">비고 ※ 교육자료 및 교육사진이 있는 경우 첨부</span>
          <label className="btn btn-xs btn-outline no-print cursor-pointer">
            <Upload size={13} /> 교육사진 추가
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <div className="evidence-grid">
          {(formData.evidenceImages || []).length === 0 ? (
            <div className="evidence-empty-box">
              <Image size={24} className="text-slate-400 mb-1" />
              <span className="text-xs text-muted">교육 진행 사진을 등록하세요.</span>
            </div>
          ) : (
            formData.evidenceImages.map((img, idx) => (
              <div key={idx} className="evidence-item">
                <img src={img} alt={`교육사진 ${idx + 1}`} />
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

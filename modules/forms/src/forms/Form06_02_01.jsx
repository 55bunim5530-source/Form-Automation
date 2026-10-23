import React from 'react';
import { PenTool, FileText, CheckCircle } from 'lucide-react';
import { SAMPLE_ACCIDENT_REPORT } from './formDataPresets';
import SummarizeButton from '../components/SummarizeButton';

export default function Form06_02_01({ formData, onChange, onOpenSignature }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const loadSample = () => {
    if (confirm('PDF 42쪽 급식실 조리원 전도재해 작성 예시 데이터를 불러오시겠습니까?\n(현재 입력된 내용이 예시 내용으로 채워집니다)')) {
      onChange({
        ...formData,
        ...SAMPLE_ACCIDENT_REPORT
      });
    }
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-top-subtext">산업안전보건법 시행규칙 [별지 제30호서식] (앞쪽)</div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-muted">※ 뒤쪽의 작성방법을 읽고 작성하시기 바라며, [ ]에는 해당하는 곳에 체크합니다.</span>
        <button
          type="button"
          className="btn btn-xs btn-outline no-print"
          onClick={loadSample}
          title="급식실 조리원 미끄러짐 재해 표준 작성 예시를 자동으로 채웁니다"
        >
          <FileText size={13} /> 급식실 재해 작성 예시 불러오기
        </button>
      </div>

      <h2 className="doc-main-title mb-4">산 업 재 해 조 사 표</h2>

      {/* Ⅰ. 사업장 정보 */}
      <div className="table-wrapper mb-4">
        <div className="font-bold text-sm bg-slate-100 p-2 border-t-2 border-slate-700 border-b border-slate-300">
          Ⅰ. 사업장 정보
        </div>
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '130px' }}>① 산재관리번호</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="산재관리번호(사업개시번호)"
                  value={formData.certNo || ''}
                  onChange={(e) => handleFieldChange('certNo', e.target.value)}
                />
              </td>
              <th style={{ width: '130px' }}>사업자등록번호</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="사업자등록번호"
                  value={formData.bizRegNo || ''}
                  onChange={(e) => handleFieldChange('bizRegNo', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>② 사업장명</th>
              <td>
                <input
                  type="text"
                  className="table-input font-bold"
                  placeholder="사업장(학교)명"
                  value={formData.schoolName || ''}
                  onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                />
              </td>
              <th>③ 근로자 수</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="근로자 수 (명)"
                  value={formData.empCount || ''}
                  onChange={(e) => handleFieldChange('empCount', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>④ 업종</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 교육서비스업"
                  value={formData.bizType || ''}
                  onChange={(e) => handleFieldChange('bizType', e.target.value)}
                />
              </td>
              <th>소재지</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="사업장 주소"
                  value={formData.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ⅱ. 재해자 정보 */}
      <div className="table-wrapper mb-4">
        <div className="font-bold text-sm bg-slate-100 p-2 border-t-2 border-slate-700 border-b border-slate-300">
          Ⅱ. 재해 정보
        </div>
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '130px' }}>성명</th>
              <td>
                <input
                  type="text"
                  className="table-input font-bold"
                  placeholder="재해자 성명"
                  value={formData.victimName || ''}
                  onChange={(e) => handleFieldChange('victimName', e.target.value)}
                />
              </td>
              <th style={{ width: '130px' }}>주민등록번호</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="생년월일-성별"
                  value={formData.residentId || ''}
                  onChange={(e) => handleFieldChange('residentId', e.target.value)}
                />
              </td>
              <th style={{ width: '60px' }}>성별</th>
              <td style={{ width: '100px' }}>
                <select
                  className="table-input"
                  value={formData.gender || '여'}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                >
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>국적</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  value={formData.nationality || '내국인'}
                  onChange={(e) => handleFieldChange('nationality', e.target.value)}
                />
              </td>
              <th>⑪ 직업(직종)</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 조리원, 시설관리원, 미화원 등"
                  value={formData.jobTitle || ''}
                  onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>입사일</th>
              <td>
                <input
                  type="date"
                  className="table-input text-xs"
                  value={formData.hireDate || ''}
                  onChange={(e) => handleFieldChange('hireDate', e.target.value)}
                />
              </td>
              <th>⑫ 동종 근속기간</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 2년 4개월"
                  value={formData.careerYears || ''}
                  onChange={(e) => handleFieldChange('careerYears', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>⑬ 고용형태</th>
              <td>
                <select
                  className="table-input"
                  value={formData.employmentType || '상용'}
                  onChange={(e) => handleFieldChange('employmentType', e.target.value)}
                >
                  <option value="상용">상용(정규직/무기계약)</option>
                  <option value="임시">임시(기간제)</option>
                  <option value="일용">일용</option>
                  <option value="기타">그 밖의 사항</option>
                </select>
              </td>
              <th>⑭ 근무형태</th>
              <td colSpan="3">
                <select
                  className="table-input"
                  value={formData.workType || '정상'}
                  onChange={(e) => handleFieldChange('workType', e.target.value)}
                >
                  <option value="정상">정상 (통상 일근)</option>
                  <option value="2교대">2교대</option>
                  <option value="3교대">3교대</option>
                  <option value="시간제">시간제</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>⑮ 상해종류(질병명)</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 골절, 염좌, 화상, 열상 등"
                  value={formData.injuryType || ''}
                  onChange={(e) => handleFieldChange('injuryType', e.target.value)}
                />
              </td>
              <th>⑯ 상해부위</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 허리, 발목, 어깨, 손가락 등"
                  value={formData.injuryPart || ''}
                  onChange={(e) => handleFieldChange('injuryPart', e.target.value)}
                />
              </td>
              <th>⑰ 휴업예상</th>
              <td>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="table-input text-center w-16"
                    value={formData.leaveDays || ''}
                    onChange={(e) => handleFieldChange('leaveDays', e.target.value)}
                  />
                  <span className="text-xs">일</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ⅲ. 재해발생 개요 및 원인 */}
      <div className="table-wrapper mb-4">
        <div className="font-bold text-sm bg-slate-100 p-2 border-t-2 border-slate-700 border-b border-slate-300 flex items-center justify-between">
          <span>Ⅲ. 재해발생 개요 및 원인</span>
          <SummarizeButton
            formCode="06-02-01"
            buttonLabel="관련자료 업로드 및 자동정리 (상황·원인·계획)"
            buttonTitle="사고 경위 및 조사 자료를 업로드하여 발생상황, 원인, 재발방지계획을 자동으로 정리합니다"
            onApply={(result) => {
              onChange({
                ...formData,
                occurSituation: result.occurSituation || formData.occurSituation,
                occurReason: result.occurReason || formData.occurReason,
                preventPlan: result.preventPlan || formData.preventPlan
              });
            }}
          />
        </div>
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '140px' }}>발생일시</th>
              <td colSpan="3">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="table-input w-36"
                    value={formData.occurDate || ''}
                    onChange={(e) => handleFieldChange('occurDate', e.target.value)}
                  />
                  <input
                    type="time"
                    className="table-input w-28"
                    value={formData.occurTime || ''}
                    onChange={(e) => handleFieldChange('occurTime', e.target.value)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>발생장소</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="구체적인 발생 장소 및 공정"
                  value={formData.occurPlace || ''}
                  onChange={(e) => handleFieldChange('occurPlace', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>재해관련 작업유형</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="재해자가 무슨 작업을 하고 있었는지"
                  value={formData.workCategory || ''}
                  onChange={(e) => handleFieldChange('workCategory', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>재해발생 당시 상황</th>
              <td colSpan="3">
                <textarea
                  className="table-textarea"
                  rows="2"
                  placeholder="기계·설비 상태 및 불안전한 상태·행동 상세 기술"
                  value={formData.occurSituation || ''}
                  onChange={(e) => handleFieldChange('occurSituation', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>⑲ 재해발생원인</th>
              <td colSpan="3">
                <textarea
                  className="table-textarea"
                  rows="2"
                  placeholder="인적, 설비적, 작업환경적, 관리적 원인 분석"
                  value={formData.occurReason || ''}
                  onChange={(e) => handleFieldChange('occurReason', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ⅳ. 재발방지 계획 */}
      <div className="table-wrapper mb-4">
        <div className="font-bold text-sm bg-slate-100 p-2 border-t-2 border-slate-700 border-b border-slate-300">
          Ⅳ. 재발방지 계획
        </div>
        <div className="p-2 border border-slate-300 border-t-0">
          <textarea
            className="table-textarea"
            rows="3"
            placeholder="재해발생원인에 대응하는 구체적 재발방지 대책(시설개선, 교육, 작업방법 개선 등) 기술"
            value={formData.preventPlan || ''}
            onChange={(e) => handleFieldChange('preventPlan', e.target.value)}
          />
        </div>
      </div>

      {/* 하단 동의 및 서명란 */}
      <div className="border border-slate-300 p-3 bg-slate-50 text-xs mb-4 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!formData.requestTechSupport}
            onChange={(e) => handleFieldChange('requestTechSupport', e.target.checked)}
          />
          <span>재발방지 계획 이행을 위한 안전보건공단 기술지원 서비스 무료 지원 요청 [ ]</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!formData.agreePrivacy}
            onChange={(e) => handleFieldChange('agreePrivacy', e.target.checked)}
          />
          <span>산재보험급여 신청방법 안내를 위한 재해자의 개인정보 활용 동의 [ √ ]</span>
        </label>
      </div>

      <div className="info-bar-box mb-4">
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">작성자 성명 :</span>
          <input
            type="text"
            className="form-input text-sm w-32"
            value={formData.author || ''}
            onChange={(e) => handleFieldChange('author', e.target.value)}
          />
        </div>
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">작성자 연락처 :</span>
          <input
            type="text"
            className="form-input text-sm w-36"
            placeholder="02-0000-0000"
            value={formData.authorPhone || ''}
            onChange={(e) => handleFieldChange('authorPhone', e.target.value)}
          />
        </div>
        <div className="info-bar-item">
          <span className="info-bar-label font-bold">작성일 :</span>
          <input
            type="date"
            className="form-input text-sm"
            value={formData.docDate || ''}
            onChange={(e) => handleFieldChange('docDate', e.target.value)}
          />
        </div>
      </div>

      <div className="incident-signatures">
        <div className="incident-signature-row">
          <span className="font-bold text-sm form-inline-token">사업주(기관장) :</span>
          <input
            type="text"
            className="form-input text-sm w-28 text-center"
            placeholder="기관장명"
            value={formData.principalName || ''}
            onChange={(e) => handleFieldChange('principalName', e.target.value)}
          />
          <span className="text-xs font-bold form-inline-token">(서명/인)</span>
          {formData.signPrincipal ? (
            <div className="sign-preview small cursor-pointer" onClick={() => onOpenSignature('signPrincipal', '사업주(기관장) 결재')}>
              <img src={formData.signPrincipal} alt="서명" />
            </div>
          ) : (
            <button
              type="button"
              className="btn-sign-trigger no-print"
              onClick={() => onOpenSignature('signPrincipal', '사업주(기관장) 결재')}
            >
              <PenTool size={12} /> 서명
            </button>
          )}
        </div>

        <div className="incident-signature-row">
          <span className="font-bold text-sm form-inline-token">근로자대표(재해자) :</span>
          <input
            type="text"
            className="form-input text-sm w-28 text-center"
            placeholder="재해자명"
            value={formData.victimName || ''}
            onChange={(e) => handleFieldChange('victimName', e.target.value)}
          />
          <span className="text-xs font-bold form-inline-token">(서명/인)</span>
          {formData.victimSign ? (
            <div className="sign-preview small cursor-pointer" onClick={() => onOpenSignature('victimSign', '근로자대표(재해자) 서명')}>
              <img src={formData.victimSign} alt="서명" />
            </div>
          ) : (
            <button
              type="button"
              className="btn-sign-trigger no-print"
              onClick={() => onOpenSignature('victimSign', '근로자대표(재해자) 서명')}
            >
              <PenTool size={12} /> 서명
            </button>
          )}
        </div>
      </div>

      <div className="incident-addressee text-center font-bold text-lg">
        <span className="incident-office-name">
          (<input
            type="text"
            className="table-input text-center font-bold"
            aria-label="관할 지방고용노동청·지청 지역명"
            placeholder="서울관악"
            value={formData.laborOfficeName || ''}
            onChange={(e) => handleFieldChange('laborOfficeName', e.target.value)}
          />)
        </span>
        <span className="form-inline-token">지방고용노동청장(지청장)</span>
        <span className="form-inline-token">귀하</span>
      </div>
    </div>
  );
}

import React from 'react';
import { PenTool } from 'lucide-react';
import SummarizeButton from '../components/SummarizeButton';

export default function Form06_02_03({ formData, onChange, onOpenSignature }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-top-subtext">산업안전보건업무 매뉴얼 [서식]</div>
      </div>

      {/* 결재란 및 제목 */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="doc-main-title text-left flex-1" style={{ margin: '1rem 0', fontSize: '1.6rem' }}>
          산업재해 재발방지 계획서
        </h2>

        {/* 결재 도장 테이블 */}
        <div className="approval-box no-break">
          <table className="approval-table">
            <tbody>
              <tr>
                <th rowSpan="2" className="approval-header">결<br />재</th>
                <th>담 당</th>
                <th>학교(기관)장</th>
              </tr>
              <tr>
                <td className="sign-cell" onClick={() => onOpenSignature('signManager', '담당 결재')}>
                  {formData.signManager ? (
                    <div className="sign-preview">
                      <img src={formData.signManager} alt="담당 서명" />
                    </div>
                  ) : (
                    <span className="sign-placeholder no-print">서명</span>
                  )}
                </td>
                <td className="sign-cell" onClick={() => onOpenSignature('signPrincipal', '학교장 결재')}>
                  {formData.signPrincipal ? (
                    <div className="sign-preview">
                      <img src={formData.signPrincipal} alt="학교장 서명" />
                    </div>
                  ) : (
                    <span className="sign-placeholder no-print">서명</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 재해자 정보 테이블 */}
      <div className="table-wrapper mb-4">
        <table className="doc-table">
          <tbody>
            <tr>
              <th rowSpan="3" style={{ width: '80px', backgroundColor: '#f1f5f9' }}>재해자</th>
              <th style={{ width: '100px' }}>성명</th>
              <td>
                <input
                  type="text"
                  className="table-input font-bold"
                  placeholder="재해자 성명"
                  value={formData.victimName || ''}
                  onChange={(e) => handleFieldChange('victimName', e.target.value)}
                />
              </td>
              <th style={{ width: '120px' }}>상해종류(질병명)</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 요추 염좌, 골절 등"
                  value={formData.injuryType || ''}
                  onChange={(e) => handleFieldChange('injuryType', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>직업(직종)</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 조리원, 시설관리원"
                  value={formData.jobTitle || ''}
                  onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                />
              </td>
              <th>상해부위(질병부위)</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 허리, 발목, 무릎 등"
                  value={formData.injuryPart || ''}
                  onChange={(e) => handleFieldChange('injuryPart', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>발생일시</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 2026년 5월 15일 (금)요일 13시 40분"
                  value={formData.occurDateTimeText || ''}
                  onChange={(e) => handleFieldChange('occurDateTimeText', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 재해발생원인 */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden">
        <div className="bg-slate-100 p-2 font-bold text-sm border-b border-slate-300 flex justify-between items-center">
          <span>재해발생원인</span>
          <SummarizeButton
            formCode="06-02-03"
            buttonLabel="관련자료 업로드 및 자동정리 (원인·대책)"
            buttonTitle="사고 조사 자료를 업로드하여 원인과 단기/장기 재발방지계획을 자동으로 정리합니다"
            onApply={(result) => {
              onChange({
                ...formData,
                occurReason: result.occurReason || formData.occurReason,
                shortTermPlan: result.shortTermPlan || formData.shortTermPlan,
                longTermPlan: result.longTermPlan || formData.longTermPlan
              });
            }}
          />
        </div>
        <div className="p-2 bg-slate-50 text-xs text-muted leading-relaxed border-b border-slate-200">
          * <strong>인적 요인</strong>(무의식 행동, 착오, 피로 등), <strong>설비적 요인</strong>(기계 결함, 방호장치 불량 등),<br />
          * <strong>작업·환경적 요인</strong>(자세 결함, 미끄러운 바닥, 조명 불량 등), <strong>관리적 요인</strong>(안전교육 부족, 매뉴얼 미비 등)
        </div>
        <div className="p-2">
          <textarea
            className="table-textarea"
            rows="5"
            placeholder="사고가 발생하게 된 직접적 및 근본적인 원인을 상세히 기재합니다."
            value={formData.occurReason || ''}
            onChange={(e) => handleFieldChange('occurReason', e.target.value)}
          />
        </div>
      </div>

      {/* 재발방지계획 */}
      <div className="border border-slate-300 rounded mb-6 overflow-hidden">
        <div className="bg-slate-100 p-2 font-bold text-sm border-b border-slate-300">
          재발방지계획
        </div>
        <div className="p-2 bg-slate-50 text-xs text-muted leading-relaxed border-b border-slate-200">
          * 재해발생원인과 상호 대응이 되도록 작성<br />
          * 즉시 개선이 가능한 것은 <strong>단기적 대책</strong>, 예산 소요나 개선기간이 필요한 사항은 <strong>장기적 대책</strong>으로 구분하여 작성
        </div>
        <div className="p-2 space-y-3">
          <div>
            <div className="text-xs font-bold text-slate-700 mb-1">【단기적 대책 (즉시 개선)】</div>
            <textarea
              className="table-textarea"
              rows="3"
              placeholder="1. 작업장 바닥 물기/기름기 수시 청소 및 주의 표지 부착&#10;2. 안전보호구 올바른 착용 재교육 및 수시 점검"
              value={formData.shortTermPlan || ''}
              onChange={(e) => handleFieldChange('shortTermPlan', e.target.value)}
            />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-700 mb-1">【장기적 대책 (시설·장비 개선 및 체계 구축)】</div>
            <textarea
              className="table-textarea"
              rows="3"
              placeholder="1. 미끄럼 방지 트렌치 덮개 및 바닥재 전면 보수·교체&#10;2. 조리 및 운반 동선 표준화 및 작업공정 위험성평가 재실시"
              value={formData.longTermPlan || ''}
              onChange={(e) => handleFieldChange('longTermPlan', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 작성일 및 기관명 */}
      <div className="text-right pr-6 space-y-2 mt-8">
        <div className="text-sm">
          <span className="font-bold mr-2">작성일:</span>
          <input
            type="date"
            className="form-input text-xs"
            value={formData.docDate || ''}
            onChange={(e) => handleFieldChange('docDate', e.target.value)}
          />
        </div>
        <div className="text-base font-bold">
          <span className="mr-2">기관명:</span>
          <input
            type="text"
            className="form-input text-sm font-bold w-64 text-right inline-block"
            placeholder="학교(기관)명"
            value={formData.schoolName || ''}
            onChange={(e) => handleFieldChange('schoolName', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

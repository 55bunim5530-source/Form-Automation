import React from 'react';
import { PenTool } from 'lucide-react';

export default function Form04_01_05({ formData, onChange, onOpenSignature }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const today = new Date();
  const year = formData.docYear || today.getFullYear();
  const month = formData.docMonth || String(today.getMonth() + 1).padStart(2, '0');
  const day = formData.docDay || String(today.getDate()).padStart(2, '0');

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-top-subtext">산업안전보건업무 매뉴얼 [서식]</div>
      </div>

      <div style={{ padding: '2rem 1.5rem', minHeight: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 className="doc-main-title" style={{ fontSize: '1.8rem', letterSpacing: '4px', marginBottom: '3rem' }}>
            안전보건관리 준수 서약서
          </h2>

          <div style={{ fontSize: '1.05rem', lineHeight: '2.2', textAlign: 'justify', color: '#1e293b' }}>
            <p className="mb-6">
              본인은 귀 기관의 (
              <input
                type="text"
                className="form-input text-center font-bold"
                style={{ width: '320px', display: 'inline-block', margin: '0 8px', borderBottom: '2px solid #0f172a' }}
                placeholder="계 약 명  입 력"
                value={formData.projectName || ''}
                onChange={(e) => handleFieldChange('projectName', e.target.value)}
              />
              )을 수행함에 있어 재해예방을 위하여 아래의 내용과 관련 법규에서 정한 필수사항을 철저히 준수할 것을 다음과 같이 서약합니다.
            </p>

            <div className="my-8 p-4 bg-slate-50 border border-slate-300 rounded text-center">
              <span className="font-bold text-slate-800">
                ｢산업안전보건법, 중대재해처벌법｣ 등 관련 법규를 준수하겠습니다.
              </span>
              <div className="mt-3 flex justify-center items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="radio"
                    name="lawCompliance"
                    checked={formData.lawCompliance !== '아니오'}
                    onChange={() => handleFieldChange('lawCompliance', '예')}
                  />
                  예 ( O )
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="lawCompliance"
                    checked={formData.lawCompliance === '아니오'}
                    onChange={() => handleFieldChange('lawCompliance', '아니오')}
                  />
                  아니오 ( X )
                </label>
              </div>
            </div>

            <p className="mb-6">
              (
              <input
                type="text"
                className="form-input text-center font-bold"
                style={{ width: '220px', display: 'inline-block', margin: '0 8px', borderBottom: '2px solid #0f172a' }}
                placeholder="업 체 명"
                value={formData.contractorCompany || ''}
                onChange={(e) => handleFieldChange('contractorCompany', e.target.value)}
              />
              )는 본 계약을 수행함에 있어 위에 언급한 내용대로 계약을 성실히 이행할 것이며, 만일 이를 이행하지 않을 경우 계약해지, 입찰참가자격제한조치 등 불이익 처분을 받더라도 하등의 이의를 제기하지 아니할 것을 확약하고 안전보건관리 준수서약서를 제출합니다.
            </p>
          </div>
        </div>

        <div>
          {/* 서약 일자 */}
          <div className="text-center my-8 text-lg font-bold" style={{ letterSpacing: '2px' }}>
            <input
              type="text"
              className="table-input text-center font-bold"
              style={{ width: '60px', display: 'inline-block' }}
              value={year}
              onChange={(e) => handleFieldChange('docYear', e.target.value)}
            /> 년{' '}
            <input
              type="text"
              className="table-input text-center font-bold"
              style={{ width: '40px', display: 'inline-block' }}
              value={month}
              onChange={(e) => handleFieldChange('docMonth', e.target.value)}
            /> 월{' '}
            <input
              type="text"
              className="table-input text-center font-bold"
              style={{ width: '40px', display: 'inline-block' }}
              value={day}
              onChange={(e) => handleFieldChange('docDay', e.target.value)}
            /> 일
          </div>

          {/* 서약자 정보 및 서명 */}
          <div className="flex justify-end pr-8 mb-8">
            <div style={{ width: '360px', lineHeight: '2.2', fontSize: '0.95rem' }}>
              <div className="flex items-center">
                <span className="font-bold" style={{ width: '80px' }}>주 소 :</span>
                <input
                  type="text"
                  className="form-input text-sm flex-1"
                  placeholder="사업장 주소 입력"
                  value={formData.contractorAddress || ''}
                  onChange={(e) => handleFieldChange('contractorAddress', e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <span className="font-bold" style={{ width: '80px' }}>업 체 명 :</span>
                <input
                  type="text"
                  className="form-input text-sm flex-1"
                  placeholder="상호 또는 법인명"
                  value={formData.contractorCompany || ''}
                  onChange={(e) => handleFieldChange('contractorCompany', e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <span className="font-bold" style={{ width: '80px' }}>대 표 자 :</span>
                <input
                  type="text"
                  className="form-input text-sm font-bold"
                  style={{ width: '130px' }}
                  placeholder="대표자 성명"
                  value={formData.contractorLeader || ''}
                  onChange={(e) => handleFieldChange('contractorLeader', e.target.value)}
                />
                <span className="mx-2 font-bold">(인)</span>
                {formData.contractorSign ? (
                  <div className="sign-preview small cursor-pointer" onClick={() => onOpenSignature('contractorSign', '대표자 서명/직인')}>
                    <img src={formData.contractorSign} alt="서명" />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-sign-trigger no-print"
                    onClick={() => onOpenSignature('contractorSign', '대표자 서명/직인')}
                  >
                    <PenTool size={12} /> 서명/직인
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 수신처 */}
          <div className="mt-8 pt-4 border-t border-slate-300">
            <h3 className="text-xl font-bold text-slate-800" style={{ letterSpacing: '4px' }}>
              서울특별시교육감 귀하
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import SummarizeButton from '../components/SummarizeButton';

export default function Form06_02_02({ formData, onChange }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-top-subtext">유선 보고 후 서식 작성하여 송부 바람</div>
      </div>

      <h2 className="doc-main-title mb-4">중대(산업)재해 발생보고(학교, 직속기관용)</h2>

      {/* 공문 헤더 정보 */}
      <div className="border border-slate-300 p-3 bg-slate-50 mb-3 text-sm space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold">문서번호 :</span>
            <input
              type="text"
              className="form-input text-xs w-48"
              placeholder="예: 서울OO고-2026-00"
              value={formData.docNo || ''}
              onChange={(e) => handleFieldChange('docNo', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">보고일자 :</span>
            <input
              type="date"
              className="form-input text-xs"
              value={formData.docDate || ''}
              onChange={(e) => handleFieldChange('docDate', e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold" style={{ width: '60px' }}>수 신 :</span>
          <div className="text-xs text-slate-700 leading-relaxed flex-1">
            서울지방고용노동청{' '}
            <input
              type="text"
              className="table-input inline-block w-24 text-center font-bold"
              placeholder="OO지청"
              value={formData.laborOfficeName || ''}
              onChange={(e) => handleFieldChange('laborOfficeName', e.target.value)}
            />{' '}
            지청(산재예방지도과장),<br />
            서울특별시교육청 보건안전진흥원 산업안전보건지원과,<br />
            <input
              type="text"
              className="table-input inline-block w-28 text-center font-bold"
              placeholder="OO교육지원청"
              value={formData.eduOfficeName || ''}
              onChange={(e) => handleFieldChange('eduOfficeName', e.target.value)}
            />{' '}
            교육지원청교육장
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold" style={{ width: '60px' }}>발 신 :</span>
          <input
            type="text"
            className="form-input text-xs font-bold w-64"
            placeholder="발신 기관장명 (예: 서울OO고등학교장)"
            value={formData.senderOrg || (formData.schoolName ? `${formData.schoolName}장` : '')}
            onChange={(e) => handleFieldChange('senderOrg', e.target.value)}
          />
        </div>
      </div>

      {/* 1. 사업장 개요 */}
      <div className="table-wrapper mb-3">
        <div className="font-bold text-xs bg-slate-200 p-1.5 border border-slate-300">
          1. 사업장 개요
        </div>
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '90px' }}>사업장명</th>
              <td>
                <input
                  type="text"
                  className="table-input font-bold"
                  value={formData.schoolName || ''}
                  onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                />
              </td>
              <th style={{ width: '80px' }}>대표자</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  value={formData.principalName || ''}
                  onChange={(e) => handleFieldChange('principalName', e.target.value)}
                />
              </td>
              <th style={{ width: '80px' }}>소재지</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  value={formData.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                />
              </td>
              <th style={{ width: '60px' }}>근로자수</th>
              <td style={{ width: '65px' }}>
                <input
                  type="text"
                  className="table-input text-center"
                  value={formData.empCount || ''}
                  onChange={(e) => handleFieldChange('empCount', e.target.value)}
                />
              </td>
              <th style={{ width: '50px' }}>업종</th>
              <td style={{ width: '90px' }}>
                <input
                  type="text"
                  className="table-input"
                  value={formData.bizType || '교육서비스업'}
                  onChange={(e) => handleFieldChange('bizType', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-xs text-muted p-1 bg-slate-50">※ 도급, 용역, 위탁 등 계약의 경우 수급인 자료 작성</div>
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '90px' }}>수급자명</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="수급업체명"
                  value={formData.contractorCompany || ''}
                  onChange={(e) => handleFieldChange('contractorCompany', e.target.value)}
                />
              </td>
              <th style={{ width: '80px' }}>대표자</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="대표자"
                  value={formData.contractorLeader || ''}
                  onChange={(e) => handleFieldChange('contractorLeader', e.target.value)}
                />
              </td>
              <th style={{ width: '80px' }}>소재지</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="업체 소재지"
                  value={formData.contractorAddress || ''}
                  onChange={(e) => handleFieldChange('contractorAddress', e.target.value)}
                />
              </td>
              <th style={{ width: '60px' }}>근로자수</th>
              <td style={{ width: '65px' }}>
                <input
                  type="text"
                  className="table-input text-center"
                  placeholder="명"
                  value={formData.contractorEmpCount || ''}
                  onChange={(e) => handleFieldChange('contractorEmpCount', e.target.value)}
                />
              </td>
              <th style={{ width: '50px' }}>업종</th>
              <td style={{ width: '90px' }}>
                <input
                  type="text"
                  className="table-input"
                  placeholder="업종"
                  value={formData.contractorBizType || ''}
                  onChange={(e) => handleFieldChange('contractorBizType', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. 재해자 인적사항 */}
      <div className="table-wrapper mb-3">
        <div className="font-bold text-xs bg-slate-200 p-1.5 border border-slate-300">
          2. 재해자 인적사항
        </div>
        <table className="doc-table">
          <thead>
            <tr>
              <th>성 명</th>
              <th>주민등록번호</th>
              <th>소 속</th>
              <th>직 종</th>
              <th>입사일자</th>
              <th>동종경력</th>
              <th>재 해 정 도</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  className="table-input text-center font-bold"
                  value={formData.victimName || ''}
                  onChange={(e) => handleFieldChange('victimName', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input text-center"
                  value={formData.residentId || ''}
                  onChange={(e) => handleFieldChange('residentId', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input text-center"
                  value={formData.victimDept || ''}
                  onChange={(e) => handleFieldChange('victimDept', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input text-center"
                  value={formData.jobTitle || ''}
                  onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  className="table-input text-center text-xs"
                  value={formData.hireDate || ''}
                  onChange={(e) => handleFieldChange('hireDate', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input text-center"
                  value={formData.careerYears || ''}
                  onChange={(e) => handleFieldChange('careerYears', e.target.value)}
                />
              </td>
              <td style={{ fontSize: '0.8rem', padding: '4px' }}>
                <div className="space-y-1">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="severity"
                      checked={formData.severity === '사망'}
                      onChange={() => handleFieldChange('severity', '사망')}
                    />
                    사망 (
                    <input
                      type="text"
                      className="table-input w-8 inline-block text-center"
                      value={formData.fatalCount || ''}
                      onChange={(e) => handleFieldChange('fatalCount', e.target.value)}
                    />
                    명)
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="severity"
                      checked={formData.severity !== '사망'}
                      onChange={() => handleFieldChange('severity', '부상')}
                    />
                    부상 (치료예상:{' '}
                    <input
                      type="text"
                      className="table-input w-10 inline-block text-center"
                      value={formData.leaveDays || ''}
                      onChange={(e) => handleFieldChange('leaveDays', e.target.value)}
                    />
                    일)
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. 재해발생 내용 및 조치현황 */}
      <div className="table-wrapper mb-3">
        <div className="font-bold text-xs bg-slate-200 p-1.5 border border-slate-300">
          3. 재해발생 내용 및 조치현황
        </div>
        <table className="doc-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>일 시</th>
              <th>장 소</th>
              <th style={{ width: '100px' }}>발생형태</th>
              <th style={{ width: '100px' }}>기인물</th>
              <th style={{ width: '150px' }}>행정조치</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="datetime-local"
                  className="table-input text-xs"
                  value={formData.occurDateTime || ''}
                  onChange={(e) => handleFieldChange('occurDateTime', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input"
                  value={formData.occurPlace || ''}
                  onChange={(e) => handleFieldChange('occurPlace', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input text-center"
                  placeholder="넘어짐, 떨어짐 등"
                  value={formData.occurPattern || ''}
                  onChange={(e) => handleFieldChange('occurPattern', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="table-input text-center"
                  placeholder="바닥, 사다리 등"
                  value={formData.causeMaterial || ''}
                  onChange={(e) => handleFieldChange('causeMaterial', e.target.value)}
                />
              </td>
              <td style={{ fontSize: '0.78rem', padding: '4px' }}>
                <select
                  className="table-input"
                  value={formData.adminAction || '해당없음'}
                  onChange={(e) => handleFieldChange('adminAction', e.target.value)}
                >
                  <option value="해당없음">해당없음</option>
                  <option value="시정지시">시정지시</option>
                  <option value="사용중지">사용중지</option>
                  <option value="부분작업중지">부분작업중지</option>
                  <option value="전면작업중지">전면작업중지</option>
                  <option value="기타">기타</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4~6 상세 서술란 */}
      <div className="flex items-center justify-between mb-2 mt-4 px-1">
        <span className="font-bold text-xs text-slate-700">■ 4~6 상세 경위 및 조치사항</span>
        <SummarizeButton
          formCode="06-02-02"
          buttonLabel="관련자료 업로드 및 자동정리 (인지·경위·조치)"
          buttonTitle="사고 기록 또는 녹취 자료를 업로드하여 인지경위, 발생경위, 조치 및 전망을 자동으로 정리합니다"
          onApply={(result) => {
            onChange({
              ...formData,
              perceiveReason: result.perceiveReason || formData.perceiveReason,
              occurDescription: result.occurDescription || formData.occurDescription,
              actionAndProspect: result.actionAndProspect || formData.actionAndProspect
            });
          }}
        />
      </div>
      <div className="space-y-2 mb-3">
        <div className="border border-slate-300 rounded p-2">
          <div className="font-bold text-xs text-slate-800 mb-1">4. 재해발생 인지경위</div>
          <textarea
            className="table-textarea"
            rows="2"
            placeholder="인지 시점, 최초 보고자 및 전파 경로 등 기재"
            value={formData.perceiveReason || ''}
            onChange={(e) => handleFieldChange('perceiveReason', e.target.value)}
          />
        </div>

        <div className="border border-slate-300 rounded p-2">
          <div className="font-bold text-xs text-slate-800 mb-1">5. 재해발생경위 (육하원칙)</div>
          <textarea
            className="table-textarea"
            rows="3"
            placeholder="누가, 언제, 어디서, 무엇을 하던 중, 어떻게 왜 사고가 발생하였는지 상세 기술"
            value={formData.occurDescription || ''}
            onChange={(e) => handleFieldChange('occurDescription', e.target.value)}
          />
        </div>

        <div className="border border-slate-300 rounded p-2">
          <div className="font-bold text-xs text-slate-800 mb-1">6. 조치 및 전망</div>
          <textarea
            className="table-textarea"
            rows="2"
            placeholder="응급후송 병원, 경찰·소방 보고, 작업중지 여부 및 향후 대응 계획 기술"
            value={formData.actionAndProspect || ''}
            onChange={(e) => handleFieldChange('actionAndProspect', e.target.value)}
          />
        </div>
      </div>

      {/* 중대재해 기준 안내 */}
      <div className="border border-slate-300 p-2.5 bg-slate-100 rounded text-xs text-slate-700 leading-relaxed">
        <div className="font-bold text-slate-900 mb-1">■ 중대재해(중대산업재해) 정의</div>
        <div>① 사망자가 1명 이상 발생한 산업재해</div>
        <div>② 3개월 이상 요양을 요하는 부상자가 동시에 2인 이상 발생한 재해 (또는 동일 사고로 6개월 이상 치료 필요 부상자 2명 이상)</div>
        <div>③ 부상자 또는 직업성 질병자가 동시에 10인 이상 발생한 재해 (또는 동일 유해요인 직업성 질병자 1년 이내 3명 이상)</div>
      </div>
    </div>
  );
}

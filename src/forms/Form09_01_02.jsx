import React from 'react';
import { Upload } from 'lucide-react';

export default function Form09_01_02({ formData, onChange }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleNestedChange = (parent, field, value) => {
    onChange({
      ...formData,
      [parent]: {
        ...(formData[parent] || {}),
        [field]: value
      }
    });
  };

  const handleStep2Change = (index, field, value) => {
    const list = formData.step2List || [
      { unitWork: '식재료 운반 및 보관', burdenNo: '8호, 9호', loadScore: 4, freqScore: 3, total: 12 },
      { unitWork: '재료 썰기 및 전처리', burdenNo: '2호', loadScore: 3, freqScore: 4, total: 12 },
      { unitWork: '국/찌개 대량 조리 및 젓기', burdenNo: '3호, 7호', loadScore: 4, freqScore: 3, total: 12 }
    ];
    const next = [...list];
    next[index] = { ...next[index], [field]: value };
    const load = Number(next[index].loadScore || 1);
    const freq = Number(next[index].freqScore || 1);
    next[index].total = load * freq;
    onChange({ ...formData, step2List: next });
  };

  const step2List = formData.step2List || [
    { unitWork: '식재료 운반 및 보관', burdenNo: '8호, 9호', loadScore: 4, freqScore: 3, total: 12 },
    { unitWork: '재료 썰기 및 전처리', burdenNo: '2호', loadScore: 3, freqScore: 4, total: 12 },
    { unitWork: '국/찌개 대량 조리 및 젓기', burdenNo: '3호, 7호', loadScore: 4, freqScore: 3, total: 12 }
  ];

  const handleImageUpload = (field, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      handleFieldChange(field, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-code-tag">09-01-02</div>
        <div className="doc-top-subtext">(근골격계부담작업 유해요인조사) 유해요인조사표</div>
      </div>

      <h2 className="doc-main-title mb-6">유 해 요 인 조 사 표</h2>

      {/* 가. 조사 개요 */}
      <div className="table-wrapper mb-4">
        <div className="font-bold text-sm bg-slate-200 p-2 border border-slate-300">
          가. 조사 개요
        </div>
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '130px' }}>조사 일시</th>
              <td>
                <input
                  type="date"
                  className="table-input"
                  value={formData.docDate || ''}
                  onChange={(e) => handleFieldChange('docDate', e.target.value)}
                />
              </td>
              <th style={{ width: '130px' }}>조 사 자</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="조사자 성명"
                  value={formData.inspectorName || ''}
                  onChange={(e) => handleFieldChange('inspectorName', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>부 서 명</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 급식실, 시설관리실, 행정실"
                  value={formData.deptName || ''}
                  onChange={(e) => handleFieldChange('deptName', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>작업공정명</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 학교 급식 조리 및 배식 공정"
                  value={formData.processName || ''}
                  onChange={(e) => handleFieldChange('processName', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>작 업 명</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input font-bold"
                  placeholder="예: 전처리 및 국 조리 작업"
                  value={formData.workTitle || ''}
                  onChange={(e) => handleFieldChange('workTitle', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 나. 작업장 상황 조사 */}
      <div className="table-wrapper mb-4">
        <div className="font-bold text-sm bg-slate-200 p-2 border border-slate-300">
          나. 작업장 상황 조사
        </div>
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '130px' }}>작업 설비</th>
              <td className="space-y-1">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="eqChange"
                      checked={formData.eqChange !== 'yes'}
                      onChange={() => handleFieldChange('eqChange', 'no')}
                    />
                    변화 없음
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="eqChange"
                      checked={formData.eqChange === 'yes'}
                      onChange={() => handleFieldChange('eqChange', 'yes')}
                    />
                    변화 있음 (언제부터:
                    <input
                      type="text"
                      className="table-input inline-block w-40 ml-1"
                      placeholder="시기 및 내용"
                      value={formData.eqChangeNote || ''}
                      onChange={(e) => handleFieldChange('eqChangeNote', e.target.value)}
                    />
                    )
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th>작 업 량</th>
              <td>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="workloadChange"
                      checked={formData.workloadChange === 'none' || !formData.workloadChange}
                      onChange={() => handleFieldChange('workloadChange', 'none')}
                    />
                    변화 없음
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="workloadChange"
                      checked={formData.workloadChange === 'up'}
                      onChange={() => handleFieldChange('workloadChange', 'up')}
                    />
                    늘어남
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="workloadChange"
                      checked={formData.workloadChange === 'down'}
                      onChange={() => handleFieldChange('workloadChange', 'down')}
                    />
                    줄음
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th>작업 속도</th>
              <td>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="speedChange"
                      checked={formData.speedChange === 'none' || !formData.speedChange}
                      onChange={() => handleFieldChange('speedChange', 'none')}
                    />
                    변화 없음
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="speedChange"
                      checked={formData.speedChange === 'up'}
                      onChange={() => handleFieldChange('speedChange', 'up')}
                    />
                    늘어남(빨라짐)
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="speedChange"
                      checked={formData.speedChange === 'down'}
                      onChange={() => handleFieldChange('speedChange', 'down')}
                    />
                    줄음
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th>업무 변화</th>
              <td>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="jobChange"
                      checked={formData.jobChange === 'none' || !formData.jobChange}
                      onChange={() => handleFieldChange('jobChange', 'none')}
                    />
                    변화 없음
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="jobChange"
                      checked={formData.jobChange === 'up'}
                      onChange={() => handleFieldChange('jobChange', 'up')}
                    />
                    늘어남
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="jobChange"
                      checked={formData.jobChange === 'down'}
                      onChange={() => handleFieldChange('jobChange', 'down')}
                    />
                    줄음
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 다. 작업조건 조사 (인간공학적 측면을 고려한 조사) */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden">
        <div className="font-bold text-sm bg-slate-200 p-2 border-b border-slate-300">
          다. 작업조건 조사 (인간공학적인 측면을 고려한 조사)
        </div>

        {/* 1단계 */}
        <div className="p-3 border-b border-slate-300 bg-slate-50">
          <div className="font-bold text-xs text-slate-800 mb-2">
            1단계 : 작업별 주요 작업내용 (유해요인 조사자)
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold w-14">1)</span>
              <input
                type="text"
                className="form-input text-xs flex-1"
                placeholder="단위작업 1 내용 기술"
                value={formData.unitWork1 || '식재료 입고 검수 및 운반 대차 적재'}
                onChange={(e) => handleFieldChange('unitWork1', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold w-14">2)</span>
              <input
                type="text"
                className="form-input text-xs flex-1"
                placeholder="단위작업 2 내용 기술"
                value={formData.unitWork2 || '채소류 세척, 칼 및 절단기 이용 전처리 작업'}
                onChange={(e) => handleFieldChange('unitWork2', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold w-14">3)</span>
              <input
                type="text"
                className="form-input text-xs flex-1"
                placeholder="단위작업 3 내용 기술"
                value={formData.unitWork3 || '국솥 대용량 가열 및 주걱 젓기, 배식 용기 소분'}
                onChange={(e) => handleFieldChange('unitWork3', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 2단계 */}
        <div className="p-3 border-b border-slate-300">
          <div className="font-bold text-xs text-slate-800 mb-2">
            2단계 : 작업별 작업부하 및 작업빈도 (근로자 면담)
          </div>
          <table className="doc-table mb-2">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>구분</th>
                <th>단위작업명</th>
                <th style={{ width: '100px' }}>부담작업(호)</th>
                <th style={{ width: '90px' }}>작업부하(A)<br />(1~5점)</th>
                <th style={{ width: '90px' }}>작업빈도(B)<br />(1~5점)</th>
                <th style={{ width: '100px' }}>총점수(A×B)</th>
              </tr>
            </thead>
            <tbody>
              {step2List.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center font-bold">{idx + 1})</td>
                  <td>
                    <input
                      type="text"
                      className="table-input text-xs"
                      value={item.unitWork}
                      onChange={(e) => handleStep2Change(idx, 'unitWork', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input text-center text-xs"
                      value={item.burdenNo}
                      onChange={(e) => handleStep2Change(idx, 'burdenNo', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="table-input text-center text-xs"
                      value={item.loadScore}
                      onChange={(e) => handleStep2Change(idx, 'loadScore', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="table-input text-center text-xs"
                      value={item.freqScore}
                      onChange={(e) => handleStep2Change(idx, 'freqScore', e.target.value)}
                    />
                  </td>
                  <td className="text-center font-bold text-xs" style={{ color: (item.total || 0) >= 12 ? '#dc2626' : '#2563eb' }}>
                    {item.total} 점
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-muted">
            * 작업부하 점수: 매우쉬움(1), 쉬움(2), 약간힘듦(3), 힘듦(4), 매우힘듦(5)<br />
            * 작업빈도 점수: 3개월마다(1), 가끔(2), 자주/1일 4시간(3), 계속/1일 4시간이상(4), 초과근무/8시간이상(5)
          </div>
        </div>

        {/* 3단계 */}
        <div className="p-3 bg-slate-50">
          <div className="font-bold text-xs text-slate-800 mb-2">
            3단계 : 유해요인평가 (사진 및 원인분석)
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <span className="text-xs font-bold block mb-1">작업 사진 1</span>
              {formData.evalPhoto1 ? (
                <div className="text-center">
                  <img src={formData.evalPhoto1} alt="작업사진 1" className="h-32 mx-auto rounded border object-contain" />
                  <button type="button" className="btn btn-xs btn-outline text-danger mt-1 no-print" onClick={() => handleFieldChange('evalPhoto1', '')}>사진 삭제</button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 rounded p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white no-print">
                  <Upload size={20} className="text-muted mb-1" />
                  <span className="text-xs text-muted">사진 등록 (클릭)</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files && handleImageUpload('evalPhoto1', e.target.files[0])} />
                </label>
              )}
            </div>
            <div>
              <span className="text-xs font-bold block mb-1">작업 사진 2</span>
              {formData.evalPhoto2 ? (
                <div className="text-center">
                  <img src={formData.evalPhoto2} alt="작업사진 2" className="h-32 mx-auto rounded border object-contain" />
                  <button type="button" className="btn btn-xs btn-outline text-danger mt-1 no-print" onClick={() => handleFieldChange('evalPhoto2', '')}>사진 삭제</button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 rounded p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white no-print">
                  <Upload size={20} className="text-muted mb-1" />
                  <span className="text-xs text-muted">사진 등록 (클릭)</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files && handleImageUpload('evalPhoto2', e.target.files[0])} />
                </label>
              )}
            </div>
          </div>

          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>단위작업명</th>
                <th style={{ width: '90px' }}>부담작업(호)</th>
                <th>유해요인 발생 원인</th>
                <th style={{ width: '100px' }}>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>식재료 운반</td>
                <td className="text-center font-bold">8호, 9호</td>
                <td>
                  <input
                    type="text"
                    className="table-input"
                    value={formData.cause1 || '20kg 이상 쌀/배추 상자를 바닥에서 허리를 숙여 들어올림'}
                    onChange={(e) => handleFieldChange('cause1', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center"
                    value={formData.note1 || '2인1조 필요'}
                    onChange={(e) => handleFieldChange('note1', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>국 조리 및 젓기</td>
                <td className="text-center font-bold">3호, 7호</td>
                <td>
                  <input
                    type="text"
                    className="table-input"
                    value={formData.cause2 || '국솥 높이가 높아 팔을 어깨 위로 들고 장시간 젓는 반복동작'}
                    onChange={(e) => handleFieldChange('cause2', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="table-input text-center"
                    value={formData.note2 || '교대 필요'}
                    onChange={(e) => handleFieldChange('note2', e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

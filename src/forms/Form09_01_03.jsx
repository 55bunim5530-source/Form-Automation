import React from 'react';

export default function Form09_01_03({ formData, onChange }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleBodyPartChange = (part, field, value) => {
    onChange({
      ...formData,
      [`pain_${part}_${field}`]: value
    });
  };

  const bodyParts = [
    { key: 'neck', label: '목' },
    { key: 'shoulder', label: '어깨' },
    { key: 'arm', label: '팔/팔꿈치' },
    { key: 'hand', label: '손/손목/손가락' },
    { key: 'back', label: '허리' },
    { key: 'leg', label: '다리/발' }
  ];

  return (
    <div className="official-document print-sheet" style={{ maxWidth: '980px' }}>
      <div className="doc-top-bar">
        <div className="doc-code-tag">09-01-03</div>
        <div className="doc-top-subtext">(근골격계부담작업 유해요인조사) 근골격계질환 증상조사표</div>
      </div>

      <h2 className="doc-main-title mb-4">근골격계질환 증상조사표</h2>

      {/* Ⅰ. 인적사항 및 기본조사 */}
      <div className="table-wrapper mb-4">
        <div className="font-bold text-xs bg-slate-200 p-1.5 border border-slate-300">
          Ⅰ. 아래 사항을 직접 기입해 주시기 바랍니다.
        </div>
        <table className="doc-table">
          <tbody>
            <tr>
              <th style={{ width: '80px' }}>성 명</th>
              <td>
                <input
                  type="text"
                  className="table-input font-bold"
                  value={formData.victimName || ''}
                  onChange={(e) => handleFieldChange('victimName', e.target.value)}
                />
              </td>
              <th style={{ width: '70px' }}>연 령</th>
              <td style={{ width: '90px' }}>
                <input
                  type="text"
                  className="table-input text-center"
                  placeholder="만 세"
                  value={formData.age || ''}
                  onChange={(e) => handleFieldChange('age', e.target.value)}
                />
              </td>
              <th style={{ width: '70px' }}>성 별</th>
              <td style={{ width: '120px' }}>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === '남'}
                      onChange={() => handleFieldChange('gender', '남')}
                    />
                    남
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender !== '남'}
                      onChange={() => handleFieldChange('gender', '여')}
                    />
                    여
                  </label>
                </div>
              </td>
              <th style={{ width: '90px' }}>현 직장경력</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 3년 6개월"
                  value={formData.careerYears || ''}
                  onChange={(e) => handleFieldChange('careerYears', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>작업부서</th>
              <td>
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 급식실"
                  value={formData.victimDept || ''}
                  onChange={(e) => handleFieldChange('victimDept', e.target.value)}
                />
              </td>
              <th>수행작업</th>
              <td colSpan="3">
                <input
                  type="text"
                  className="table-input"
                  placeholder="예: 조리 및 세척"
                  value={formData.jobTitle || ''}
                  onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                />
              </td>
              <th>결혼여부</th>
              <td>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="marital"
                      checked={formData.marital !== '미혼'}
                      onChange={() => handleFieldChange('marital', '기혼')}
                    />
                    기혼
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="marital"
                      checked={formData.marital === '미혼'}
                      onChange={() => handleFieldChange('marital', '미혼')}
                    />
                    미혼
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th>현재 작업</th>
              <td colSpan="7">
                <div className="flex items-center gap-2">
                  <span>작업내용 :</span>
                  <input
                    type="text"
                    className="table-input flex-1"
                    value={formData.currentJobDesc || ''}
                    onChange={(e) => handleFieldChange('currentJobDesc', e.target.value)}
                  />
                  <span>기간 :</span>
                  <input
                    type="text"
                    className="table-input w-28 text-center"
                    placeholder="예: 2년"
                    value={formData.currentJobPeriod || ''}
                    onChange={(e) => handleFieldChange('currentJobPeriod', e.target.value)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>근무시간</th>
              <td colSpan="7">
                <div className="flex items-center gap-2">
                  <span>1일 근무 :</span>
                  <input
                    type="text"
                    className="table-input w-20 text-center"
                    placeholder="8시간"
                    value={formData.dailyWorkHours || '8시간'}
                    onChange={(e) => handleFieldChange('dailyWorkHours', e.target.value)}
                  />
                  <span className="ml-4">휴식시간 :</span>
                  <input
                    type="text"
                    className="table-input w-36 text-center"
                    placeholder="예: 30분씩 2회"
                    value={formData.breakTime || '60분'}
                    onChange={(e) => handleFieldChange('breakTime', e.target.value)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 1~5번 일반 설문 */}
      <div className="border border-slate-300 rounded p-3 bg-slate-50 mb-4 text-xs space-y-3">
        <div>
          <span className="font-bold">1. 규칙적인 여가 및 취미활동:</span>
          <div className="flex gap-4 mt-1 flex-wrap">
            {['컴퓨터/게임', '악기연주', '뜨개질/수예', '스포츠/운동', '해당사항 없음'].map((hobby) => (
              <label key={hobby} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData[`hobby_${hobby}`]}
                  onChange={(e) => handleFieldChange(`hobby_${hobby}`, e.target.checked)}
                />
                {hobby}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="font-bold">2. 하루 평균 가사노동시간:</span>
          <div className="flex gap-4 mt-1 flex-wrap">
            {['거의 하지 않음', '1시간 미만', '1~2시간 미만', '2~3시간 미만', '3시간 이상'].map((item) => (
              <label key={item} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="housework"
                  checked={formData.housework === item}
                  onChange={() => handleFieldChange('housework', item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="font-bold">3. 과거 의사진단 질병 (류머티스, 당뇨, 통풍 등):</span>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="diagnosed"
                checked={formData.diagnosed !== 'yes'}
                onChange={() => handleFieldChange('diagnosed', 'no')}
              />
              아니오
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="diagnosed"
                checked={formData.diagnosed === 'yes'}
                onChange={() => handleFieldChange('diagnosed', 'yes')}
              />
              예 (병명:
              <input
                type="text"
                className="table-input inline-block w-40 ml-1"
                placeholder="병명 입력"
                value={formData.diseaseName || ''}
                onChange={(e) => handleFieldChange('diseaseName', e.target.value)}
              />
              )
            </label>
          </div>
        </div>

        <div>
          <span className="font-bold">4. 현재 하시는 일의 육체적 부담 정도:</span>
          <div className="flex gap-4 mt-1 flex-wrap">
            {['전혀 힘들지 않음', '견딜만 함', '약간 힘듦', '힘듦', '매우 힘듦'].map((bur) => (
              <label key={bur} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="physicalBurden"
                  checked={formData.physicalBurden === bur}
                  onChange={() => handleFieldChange('physicalBurden', bur)}
                />
                {bur}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Ⅱ. 부위별 통증 증상 매트릭스 */}
      <div className="table-wrapper mb-4">
        <div className="font-bold text-xs bg-slate-200 p-1.5 border border-slate-300">
          Ⅱ. 지난 1년 동안 부위별 통증 자각증상 조사
        </div>
        <table className="doc-table" style={{ fontSize: '0.74rem' }}>
          <thead>
            <tr>
              <th style={{ width: '130px' }}>설 문 항 목</th>
              {bodyParts.map((p) => (
                <th key={p.key} style={{ minWidth: '95px' }}>
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-left font-bold" style={{ backgroundColor: '#f8fafc' }}>
                1. 통증 구체적 부위
              </th>
              {bodyParts.map((p) => (
                <td key={p.key} className="text-center p-1">
                  <select
                    className="table-input text-xs"
                    value={formData[`pain_${p.key}_side`] || '해당없음'}
                    onChange={(e) => handleBodyPartChange(p.key, 'side', e.target.value)}
                  >
                    <option value="해당없음">해당없음</option>
                    <option value="오른쪽">오른쪽</option>
                    <option value="왼쪽">왼쪽</option>
                    <option value="양쪽">양쪽 모두</option>
                  </select>
                </td>
              ))}
            </tr>
            <tr>
              <th className="text-left font-bold" style={{ backgroundColor: '#f8fafc' }}>
                2. 지속 기간
              </th>
              {bodyParts.map((p) => (
                <td key={p.key} className="text-center p-1">
                  <select
                    className="table-input text-xs"
                    value={formData[`pain_${p.key}_duration`] || '없음'}
                    onChange={(e) => handleBodyPartChange(p.key, 'duration', e.target.value)}
                  >
                    <option value="없음">없음</option>
                    <option value="1일미만">1일 미만</option>
                    <option value="1일~1주">1일~1주</option>
                    <option value="1주~1달">1주~1달</option>
                    <option value="1달~6달">1달~6달</option>
                    <option value="6달이상">6개월 이상</option>
                  </select>
                </td>
              ))}
            </tr>
            <tr>
              <th className="text-left font-bold" style={{ backgroundColor: '#f8fafc' }}>
                3. 아픈 정도
              </th>
              {bodyParts.map((p) => (
                <td key={p.key} className="text-center p-1">
                  <select
                    className="table-input text-xs"
                    value={formData[`pain_${p.key}_level`] || '없음'}
                    onChange={(e) => handleBodyPartChange(p.key, 'level', e.target.value)}
                  >
                    <option value="없음">통증 없음</option>
                    <option value="약한">약한 통증</option>
                    <option value="중간">중간 통증</option>
                    <option value="심한">심한 통증</option>
                    <option value="매우심한">매우 심한 통증</option>
                  </select>
                </td>
              ))}
            </tr>
            <tr>
              <th className="text-left font-bold" style={{ backgroundColor: '#f8fafc' }}>
                4. 발생 빈도
              </th>
              {bodyParts.map((p) => (
                <td key={p.key} className="text-center p-1">
                  <select
                    className="table-input text-xs"
                    value={formData[`pain_${p.key}_freq`] || '없음'}
                    onChange={(e) => handleBodyPartChange(p.key, 'freq', e.target.value)}
                  >
                    <option value="없음">없음</option>
                    <option value="6개월1번">6개월에 1번</option>
                    <option value="2-3달1번">2~3달에 1번</option>
                    <option value="1달1번">1달에 1번</option>
                    <option value="1주1번">1주일에 1번</option>
                    <option value="매일">매일</option>
                  </select>
                </td>
              ))}
            </tr>
            <tr>
              <th className="text-left font-bold" style={{ backgroundColor: '#f8fafc' }}>
                5. 지난 1주일 통증
              </th>
              {bodyParts.map((p) => (
                <td key={p.key} className="text-center p-1">
                  <div className="flex justify-center gap-1">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={`pain_${p.key}_week`}
                        checked={formData[`pain_${p.key}_week`] === '예'}
                        onChange={() => handleBodyPartChange(p.key, 'week', '예')}
                      />
                      예
                    </label>
                    <label className="cursor-pointer ml-1">
                      <input
                        type="radio"
                        name={`pain_${p.key}_week`}
                        checked={formData[`pain_${p.key}_week`] !== '예'}
                        onChange={() => handleBodyPartChange(p.key, 'week', '아니오')}
                      />
                      무
                    </label>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <th className="text-left font-bold" style={{ backgroundColor: '#f8fafc' }}>
                6. 치료 / 조치
              </th>
              {bodyParts.map((p) => (
                <td key={p.key} className="text-center p-1">
                  <select
                    className="table-input text-xs"
                    value={formData[`pain_${p.key}_cure`] || '해당없음'}
                    onChange={(e) => handleBodyPartChange(p.key, 'cure', e.target.value)}
                  >
                    <option value="해당없음">해당없음</option>
                    <option value="병원치료">병원/한의원</option>
                    <option value="약국치료">약국치료</option>
                    <option value="병가산재">병가/산재</option>
                    <option value="작업전환">작업전환</option>
                  </select>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted leading-relaxed">
        ※ 본 조사표는 산업안전보건법에 따라 근골격계부담작업 유해요인조사 시 근로자가 직접 작성하는 법정 서식입니다.
      </div>
    </div>
  );
}

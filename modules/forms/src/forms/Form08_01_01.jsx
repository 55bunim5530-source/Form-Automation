import React from 'react';
import { MessageSquare, CheckSquare, CheckCircle } from 'lucide-react';

export default function Form08_01_01({ formData, onChange }) {
  const activeTab = formData.activeTab === 'example2' ? 'example2' : 'example1';
  const checklistSector = ['office', 'lab', 'cleaning', 'guard'].includes(formData.checklistSector)
    ? formData.checklistSector
    : 'office';

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const riskFactors = [
    { key: 'fall', label: '떨어짐', defaultEx: '전지작업 중 사다리 추락' },
    { key: 'slip', label: '넘어짐', defaultEx: '화장실에 물기가 마르지 않아 넘어질 뻔 했음' },
    { key: 'shock', label: '감전', defaultEx: '' },
    { key: 'hit', label: '부딪힘/맞음', defaultEx: '' },
    { key: 'heavy', label: '중량물 취급작업', defaultEx: '' },
    { key: 'jam', label: '끼임', defaultEx: '' },
    { key: 'cut', label: '절단·베임·긁힘·찔림', defaultEx: '문서 재단기가 녹슬어 작동이 잘 안돼 힘을 주다가 장갑이 잘라진 적 있음' },
    { key: 'gas', label: '중독·질식', defaultEx: '' },
    { key: 'heat', label: '온열질환(열사병)', defaultEx: '' },
    { key: 'burn', label: '화상/피부/호흡기', defaultEx: '' },
    { key: 'fire', label: '화재·폭발', defaultEx: '' },
    { key: 'etc', label: '그 외', defaultEx: '' }
  ];

  const categories = [
    '시설관리', '조리', '청소', '차량통학', '당직전담원', '교육공무원', '지방공무원', '교육공무직원', '그 외'
  ];

  // 직종별 체크리스트 (예시2)
  const checklistData = {
    office: {
      name: '체크리스트 (사무직)',
      items: [
        '사무실 내 이동 시 장애물에 의해 미끄러지거나 넘어지는 위험을 예방하기 위하여 바닥을 청결한 상태로 유지하고 있는가?',
        '전자기기, 세단기 등 전기 사무용품 등의 사용 시 누전에 의한 감전을 예방하기 위하여 감전방지용 누전차단기를 설치하여 관리하고 있는가?',
        '사무기구(세단기 등) 사용 시 손가락 끼임 등의 사고를 예방하기 위하여 위험경고 표시를 부착하였는가?',
        '근골격계질환 위험을 예방하기 위하여 중량물 취급 시 올바른 작업자세 등에 대한 교육을 실시하고 있는가?',
        '사무실의 어두운 조명에 의한 눈의 피로도를 예방하기 위하여 충분한 채광 또는 조명시설을 갖추고 있는가?',
        '책상 사이의 좁은 통로로 이동 중 책상과 충돌위험을 예방하기 위하여 책상 재배치로 통로 확보가 되어 있는가?',
        '장시간 업무에 의한 스트레스를 예방하기 위하여 휴식시간에 이용하도록 휴게시설이 설치되어 있는가?',
        '부상자의 응급처치에 필요한 구급용구를 갖추고 그 장소와 사용방법을 근로자가 숙지하고 있는가?',
        '사무실 내 장시간 에어컨 및 히터 사용으로 인한 고온 및 저온 환경의 건강장해를 예방하기 위하여 적절한 온도·습도 조절장치를 갖추고 있는가?',
        '장시간 컴퓨터사용으로 인한 VDT증후군 발생위험을 예방하기 위하여 올바른 작업자세에 대한 교육을 실시하고 있는가?',
        '장시간 업무에 의한 스트레스를 예방하기 위하여 적절한 휴식시간 또는 적절한 교대근무를 실시하고 있는가?',
        '컴퓨터의 날카로운 모서리에 베일 위험이 있는가?',
        '문서정리 중 종이에 의한 베일 위험이 있는가?',
        '콘센트 파손상태로 조작자 충전부 신체 접촉에 의한 감전될 위험이 있는가?',
        '연속적으로 컴퓨터 단말기 작업으로 인한 건강장해 위험이 있는가?',
        '전화상담에 따른 업무스트레스로 인한 건강장해 위험이 있는가?',
        '장시간 에어컨 및 히터로 인한 고온 및 저온환경에 노출될 위험이 있는가?',
        '책상사이의 좁은 통로로 이동 중 책상과 충돌 위험이 있는가?',
        '반복적인 복사, 서류 작성에 따른 피로도로 인한 건강장해 위험이 있는가?'
      ]
    },
    lab: {
      name: '체크리스트 (실험실)',
      items: [
        '실험실 정리작업 시 장애물에 의해 미끄러지거나 넘어지는 위험을 예방하기 위하여 바닥을 청결한 상태로 유지하고 있는가?',
        '높은 선반에 적재된 초자기구 등을 정리 시 시약의 낙하 위험을 예방하기 위하여 작업발판 등을 이용하고 있는가?',
        '실험실 청소 작업 중 바닥의 물기 등에 의한 미끄러짐을 예방하기 위하여 미끄러짐 방지화를 착용하였는가?',
        '초자(유리)기구 등의 파손으로 손가락 등을 베임 위험을 예방하기 위하여 세척 시 보호장갑을 착용하였는가?',
        '실험종료 후 시약병을 개봉한 상태로 방치하여 유해증기노출의 위험을 예방하기 위하여 마개 밀봉 후 지정 장소에 보관하고 있는가?',
        '화학물질에 의한 노출을 예방하기 위하여 용액이 담겨있는 비커 등에는 모두 라벨이 붙어있는가?',
        '중량물 취급에 따른 근골격계질환 위험을 예방하기 위하여 중량물의 취급기준을 준수하고 있는가?',
        '근골격계질환 위험을 예방하기 위하여 중량물 취급 시 올바른 작업자세 등에 대한 교육을 실시하고 있는가?',
        '실험실 바닥에 떨어진 화학약품 및 초자기구들로 인한 사고를 예방하기 위하여 실험실 바닥은 항상 청결을 유지하고 있는가?',
        '실험실의 어두운 조명에 의한 눈의 피로도를 예방하기 위하여 충분한 채광 또는 조명시설을 갖추고 있는가?',
        '초자 등의 실험기구를 운반 시 부딪힘 등의 위험을 예방하기 위하여 충분한 안전통로가 확보되어 있는가?',
        '장시간 업무에 의한 스트레스를 예방하기 위하여 적절한 휴식시간 또는 적절한 교대근무를 실시하고 있는가?'
      ]
    },
    cleaning: {
      name: '체크리스트 (청소)',
      items: [
        '계단 청소작업 시 주변의 장애물에 의해 미끄러지거나 넘어지는 등의 위험을 예방하기 위하여 바닥을 청결한 상태로 유지하고 있는가?',
        '계단 청소 작업시 발생되는 분진 흡입으로 호흡기 질환 위험을 예방하기 위하여 호흡용 보호구를 착용하였는가?',
        '반복작업에 의한 근골격계질환 위험을 예방하기 위하여 유해요인 및 대처요령 등의 유해성 교육을 실시하고 있는가?',
        '계단 청소 시 반복동작/부적절한 작업자세로 인한 근골격계질환 위험을 예방하기 위하여 유해요인조사를 실시하였는가?',
        '계단 청소 시 인력작업 보조설비 및 편의설비 설치를 개선하였는가?',
        '반복동작/부적절한 자세 위험을 예방하기 위하여 근로자에게 유해성을 주지하였는가?',
        '인력으로 들어올리는 청소 작업 중 과도한 무게로 인한 위험을 예방하기 위하여 작업자세를 주지하였는가?',
        '계단 청소 시 사용한 보조도구의 정리정돈을 실시하고 있는가?',
        '청소물품 보관장소의 어두운 조명에 의한 눈의 피로도를 예방하기 위하여 조명시설을 갖추고 있는가?',
        '계단 청소 시 협소한 작업공간에 의하여 부딪히는 위험을 예방하기 위하여 안전통로가 확보되어 있는가?',
        '바닥청소작업 시 주변 장애물에 의한 미끄러짐/넘어짐 예방 조치를 하고 있는가?',
        '전기청소도구 사용시 전선 피복손상으로 누전되어 감전위험을 예방하기 위하여 피복절연조치가 되어있는가?',
        '청소도구(청소기 등)에서 발생하는 소음으로 인한 청력 손실 위험을 예방하기 위하여 청력보호구를 착용하고 있는가?',
        '화장실 바닥 표면 물기로 인한 넘어짐 위험 예방 조치(미끄럼 방지 등)가 되어 있는가?',
        '화학물질(락스 등) 사용 시 물질안전보건자료 비치 및 GHS 경고표지 부착 여부를 확인하는가?'
      ]
    },
    guard: {
      name: '체크리스트 (당직/경비)',
      items: [
        '야간순찰 시 돌출물 등에 걸리거나 헛디뎌 넘어질 위험을 예방하기 위하여 주위의 장애요인을 확인하였는가?',
        '야간순찰 시 어두워서 넘어지는 사고를 예방하기 위하여 랜턴, 야광조끼, 야광봉 등 필요한 장비를 지급 및 착용하였는가?',
        '중량물 취급에 따른 근골격계질환 위험을 예방하기 위하여 중량물의 취급기준을 준수하고 있는가?',
        '지하주차장 등 어두운 장소를 순찰 시 바닥을 확인하지 못하여 넘어지는 위험을 예방하기 위하여 충분한 조명시설을 갖추고 있는가?',
        '기계실 등 순찰 시 넘어짐 사고 위험을 예방하기 위하여 정리정돈 및 충분한 통로를 확보하였는가?',
        '순찰업무 시 외부 기후에 의한 안전사고 발생을 예방하기 위하여 악천후 및 강풍 시에는 작업을 중지하고 있는가?',
        '주차장 순찰 중 개구부로 떨어짐위험을 예방하기 위하여 개구부에 덮개를 설치하고 출입금지표시를 하였는가?',
        '순찰 시 동절기 기온저하로 뇌심혈관계질환 위험을 예방하기 위하여 순찰 전·후 스트레칭을 실시하고 있는가?',
        '장시간 업무에 의한 스트레스를 예방하기 위하여 적절한 휴식시간 또는 교대근무를 실시하고 있는가?'
      ]
    }
  };

  const currentChecklist = checklistData[checklistSector] || checklistData.office;
  const currentChecklistAnswers = formData[`chkAnswers_${checklistSector}`] || {};

  const handleChecklistAnswer = (idx, val) => {
    const next = { ...currentChecklistAnswers, [idx]: val };
    onChange({ ...formData, [`chkAnswers_${checklistSector}`]: next });
  };

  const handleAllChecklistO = () => {
    const next = {};
    currentChecklist.items.forEach((_, idx) => {
      next[idx] = 'O';
    });
    onChange({ ...formData, [`chkAnswers_${checklistSector}`]: next });
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-top-subtext">산업안전보건업무 매뉴얼 [서식]</div>
      </div>

      {/* 탭 전환 바 */}
      <div className="no-print mb-4 flex gap-2 border-b pb-2">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'example1' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleFieldChange('activeTab', 'example1')}
        >
          <MessageSquare size={14} /> 서식(예시1) 근로자 의견청취표
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'example2' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleFieldChange('activeTab', 'example2')}
        >
          <CheckSquare size={14} /> 서식(예시2) 직종별 체크리스트
        </button>
      </div>

      {activeTab === 'example1' ? (
        <div>
          <h2 className="doc-main-title mb-4">위험성평가 근로자 의견청취 서식(예시1)</h2>

          {/* 기본 정보 */}
          <div className="info-bar-box mb-3">
            <div className="info-bar-item">
              <span className="info-bar-label font-bold">작 성 자 :</span>
              <input
                type="text"
                className="form-input text-sm w-32"
                placeholder="성명"
                value={formData.author || ''}
                onChange={(e) => handleFieldChange('author', e.target.value)}
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
              <span className="info-bar-label font-bold">학교(기관)명 :</span>
              <input
                type="text"
                className="form-input text-sm w-44"
                placeholder="학교명"
                value={formData.schoolName || ''}
                onChange={(e) => handleFieldChange('schoolName', e.target.value)}
              />
            </div>
          </div>

          {/* 직종 구분 라디오/선택 */}
          <div className="border border-slate-300 p-2.5 bg-slate-50 mb-3 flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xs text-slate-800" style={{ width: '60px' }}>구 분 :</span>
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-1 text-xs cursor-pointer mr-3">
                <input
                  type="radio"
                  name="userCategory"
                  checked={formData.userCategory === cat}
                  onChange={() => handleFieldChange('userCategory', cat)}
                />
                {cat}
              </label>
            ))}
          </div>

          {/* 유해·위험요인 그리드 테이블 */}
          <div className="table-wrapper mb-4">
            <div className="font-bold text-xs bg-slate-200 p-1.5 border border-slate-300">
              작업 시 유해·위험요인 (해당 항목에 체크(√) 후 내용 기입)
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 border border-slate-300 border-t-0">
              {riskFactors.map((factor) => {
                const isChecked = !!formData[`rf_chk_${factor.key}`];
                const content = formData[`rf_txt_${factor.key}`] !== undefined ? formData[`rf_txt_${factor.key}`] : '';

                return (
                  <div key={factor.key} className={`border rounded p-2 text-xs flex flex-col justify-between ${isChecked ? 'border-blue-400 bg-blue-50/40' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">{factor.label}</span>
                      <label className="flex items-center gap-1 cursor-pointer font-bold text-blue-600">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleFieldChange(`rf_chk_${factor.key}`, e.target.checked)}
                        />
                        선택
                      </label>
                    </div>
                    <textarea
                      className="table-textarea text-xs mt-1"
                      rows="2"
                      placeholder={factor.defaultEx ? `예: ${factor.defaultEx}` : '발생 경험 또는 위험 내용 작성'}
                      value={content}
                      onChange={(e) => handleFieldChange(`rf_txt_${factor.key}`, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 자유의견 */}
          <div className="border border-slate-300 rounded p-3 bg-slate-50">
            <div className="font-bold text-xs text-slate-800 mb-1">■ 자유의견 (개선 요구사항 등)</div>
            <textarea
              className="table-textarea"
              rows="3"
              placeholder="작업 현장에서 평소 위험하다고 느꼈던 점이나 개선이 필요한 사항을 자유롭게 적어주세요."
              value={formData.freeOpinion || ''}
              onChange={(e) => handleFieldChange('freeOpinion', e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="doc-main-title text-left flex-1" style={{ margin: 0 }}>
              위험성평가 근로자 의견청취 서식(예시2)
            </h2>

            {/* 직종 선택 서브탭 */}
            <div className="no-print flex gap-1">
              <button
                type="button"
                className={`btn btn-xs ${checklistSector === 'office' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('checklistSector', 'office')}
              >
                사무직 (19)
              </button>
              <button
                type="button"
                className={`btn btn-xs ${checklistSector === 'lab' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('checklistSector', 'lab')}
              >
                실험실 (12)
              </button>
              <button
                type="button"
                className={`btn btn-xs ${checklistSector === 'cleaning' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('checklistSector', 'cleaning')}
              >
                청소 (15)
              </button>
              <button
                type="button"
                className={`btn btn-xs ${checklistSector === 'guard' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('checklistSector', 'guard')}
              >
                당직/경비 (9)
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-slate-800">{currentChecklist.name}</h3>
            <button type="button" className="btn btn-xs btn-outline no-print" onClick={handleAllChecklistO}>
              <CheckCircle size={13} /> 전 항목 'O(양호)'로 일괄 선택
            </button>
          </div>

          <div className="table-wrapper">
            <table className="doc-table">
              <thead>
                <tr>
                  <th style={{ width: '45px' }}>NO</th>
                  <th>유 해 위 험 요 인</th>
                  <th colSpan="2" style={{ width: '90px' }}>해당여부</th>
                </tr>
                <tr>
                  <th style={{ display: 'none' }}></th>
                  <th style={{ display: 'none' }}></th>
                  <th style={{ width: '45px', padding: '3px' }}>O</th>
                  <th style={{ width: '45px', padding: '3px' }}>X</th>
                </tr>
              </thead>
              <tbody>
                {currentChecklist.items.map((text, idx) => {
                  const ans = currentChecklistAnswers[idx] || '';
                  return (
                    <tr key={idx}>
                      <td className="text-center font-bold">{idx + 1}</td>
                      <td style={{ fontSize: '0.85rem', lineHeight: '1.45', padding: '6px 10px' }}>
                        {text}
                      </td>
                      <td className="text-center">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name={`chk_sec_${checklistSector}_${idx}`}
                            checked={ans === 'O'}
                            onChange={() => handleChecklistAnswer(idx, 'O')}
                          />
                        </label>
                      </td>
                      <td className="text-center">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name={`chk_sec_${checklistSector}_${idx}`}
                            checked={ans === 'X'}
                            onChange={() => handleChecklistAnswer(idx, 'X')}
                          />
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

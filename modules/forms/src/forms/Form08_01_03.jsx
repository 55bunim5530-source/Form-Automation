import React, { useRef } from 'react';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

export default function Form08_01_03({ formData, onChange }) {
  const defaultItems = [
    {
      place: '급식실 조리장 바닥 트렌치',
      actionCode: 'R-01',
      workContent: '배식 후 식기 세척 및 조리장 바닥 청소 작업',
      curRisk: '중 (6)',
      afterRisk: '하 (2)',
      beforeImg: '',
      afterImg: '',
      hazardContent: '트렌치 덮개 단차로 인해 운반 대차 바퀴 걸림 및 미끄러운 바닥으로 넘어짐 위험',
      reduceContent: '1. 트렌치 주변 미끄럼 방지 그레이팅 덮개 교체 및 단차 제거 수리\n2. 조리장 통로 미끄럼 방지 안전 매트 전면 포설 완료'
    },
    {
      place: '교사동 뒤편 수목 및 화단',
      actionCode: 'R-02',
      workContent: '수목 고사목 제거 및 전지·전정 작업',
      curRisk: '상 (9)',
      afterRisk: '하 (3)',
      beforeImg: '',
      afterImg: '',
      hazardContent: '높이 2.5m A형 사다리 위에서 1인 단독 작업 중 실족 추락 위험',
      reduceContent: '1. 전도방지대(아웃트리거)가 장착된 안전 인증 사다리 구입 및 2인 1조 작업 지침 이행\n2. 2m 이상 고소 작업 시 안전모 및 턱끈 체결 의무화'
    }
  ];

  const items = formData.items && formData.items.length > 0 ? formData.items : defaultItems;

  const handleItemChange = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...formData, items: next });
  };

  const handleImageUpload = (index, field, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      handleItemChange(index, field, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const addItem = () => {
    const next = [
      ...items,
      {
        place: '',
        actionCode: `R-${String(items.length + 1).padStart(2, '0')}`,
        workContent: '',
        curRisk: '중',
        afterRisk: '하',
        beforeImg: '',
        afterImg: '',
        hazardContent: '',
        reduceContent: ''
      }
    ];
    onChange({ ...formData, items: next });
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    const next = items.filter((_, i) => i !== index);
    onChange({ ...formData, items: next });
  };

  return (
    <div className="official-document print-sheet">
      <div className="doc-top-bar">
        <div className="doc-top-subtext">위험성 감소 대책 수립 및 이행 서식(예시)</div>
      </div>

      <h2 className="doc-main-title mb-6">
        (위험성평가) 위험요인 감소조치 실행 내용(예시)
      </h2>

      {/* 실행 내용 카드 목록 */}
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="border-2 border-slate-300 rounded overflow-hidden bg-white mb-6">
            <div className="bg-slate-100 p-2 font-bold text-sm border-b border-slate-300 flex justify-between items-center">
              <span>【조치 사례 {idx + 1}】</span>
              <button
                type="button"
                className="btn-row-del no-print"
                onClick={() => removeItem(idx)}
                title="사례 삭제"
              >
                <Trash2 size={14} /> 삭제
              </button>
            </div>

            <table className="doc-table">
              <tbody>
                <tr>
                  <th style={{ width: '110px' }}>장소(설비)</th>
                  <td>
                    <input
                      type="text"
                      className="table-input font-bold"
                      placeholder="장소 또는 설비명"
                      value={item.place}
                      onChange={(e) => handleItemChange(idx, 'place', e.target.value)}
                    />
                  </td>
                  <th style={{ width: '90px' }}>개선코드</th>
                  <td style={{ width: '130px' }}>
                    <input
                      type="text"
                      className="table-input text-center font-bold"
                      value={item.actionCode}
                      onChange={(e) => handleItemChange(idx, 'actionCode', e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <th>작업내용</th>
                  <td colSpan="3">
                    <input
                      type="text"
                      className="table-input"
                      placeholder="해당 장소에서의 작업내용"
                      value={item.workContent}
                      onChange={(e) => handleItemChange(idx, 'workContent', e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <th>현재위험성</th>
                  <td>
                    <input
                      type="text"
                      className="table-input text-center"
                      placeholder="상, 중, 하 또는 점수"
                      value={item.curRisk}
                      onChange={(e) => handleItemChange(idx, 'curRisk', e.target.value)}
                    />
                  </td>
                  <th>개선 후 위험성</th>
                  <td>
                    <input
                      type="text"
                      className="table-input text-center text-emerald-600 font-bold"
                      placeholder="상, 중, 하 또는 점수"
                      value={item.afterRisk}
                      onChange={(e) => handleItemChange(idx, 'afterRisk', e.target.value)}
                    />
                  </td>
                </tr>

                {/* 개선 전/후 사진 */}
                <tr>
                  <th className="text-center" style={{ verticalAlign: 'middle' }}>개선 전 사진</th>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                    {item.beforeImg ? (
                      <div className="relative group text-center">
                        <img
                          src={item.beforeImg}
                          alt="개선 전"
                          style={{ maxHeight: '180px', margin: '0 auto', objectFit: 'contain' }}
                          className="rounded border"
                        />
                        <button
                          type="button"
                          className="btn btn-xs btn-outline text-danger mt-1 no-print"
                          onClick={() => handleItemChange(idx, 'beforeImg', '')}
                        >
                          사진 삭제
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-300 rounded p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 no-print">
                        <Upload size={24} className="text-muted mb-1" />
                        <span className="text-xs text-muted">개선 전 사진 등록 (클릭)</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => e.target.files && handleImageUpload(idx, 'beforeImg', e.target.files[0])}
                        />
                      </label>
                    )}
                  </td>
                  <th className="text-center" style={{ verticalAlign: 'middle' }}>개선 후 사진</th>
                  <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                    {item.afterImg ? (
                      <div className="relative group text-center">
                        <img
                          src={item.afterImg}
                          alt="개선 후"
                          style={{ maxHeight: '180px', margin: '0 auto', objectFit: 'contain' }}
                          className="rounded border"
                        />
                        <button
                          type="button"
                          className="btn btn-xs btn-outline text-danger mt-1 no-print"
                          onClick={() => handleItemChange(idx, 'afterImg', '')}
                        >
                          사진 삭제
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-300 rounded p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 no-print">
                        <Upload size={24} className="text-primary mb-1" />
                        <span className="text-xs text-primary">개선 후 사진 등록 (클릭)</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => e.target.files && handleImageUpload(idx, 'afterImg', e.target.files[0])}
                        />
                      </label>
                    )}
                  </td>
                </tr>

                {/* 위험요인 내용 & 대책 */}
                <tr>
                  <th style={{ verticalAlign: 'top', paddingTop: '8px' }}>유해·위험요인<br />내용</th>
                  <td colSpan="3">
                    <textarea
                      className="table-textarea text-xs"
                      rows="2"
                      placeholder="구체적인 유해위험요인 내용 기재"
                      value={item.hazardContent}
                      onChange={(e) => handleItemChange(idx, 'hazardContent', e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <th style={{ verticalAlign: 'top', paddingTop: '8px' }}>위험성 감소대책<br />(개선내용)</th>
                  <td colSpan="3">
                    <textarea
                      className="table-textarea text-xs font-medium"
                      rows="3"
                      placeholder="이행 완료된 개선대책 내용 상세 기재"
                      value={item.reduceContent}
                      onChange={(e) => handleItemChange(idx, 'reduceContent', e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="no-print mt-4 flex justify-between items-center">
        <button type="button" className="btn btn-sm btn-outline" onClick={addItem}>
          <Plus size={14} /> 위험요인 개선 실행사례 추가하기
        </button>
        <span className="text-xs text-muted">
          * 스마트폰으로 촬영한 전·후 사진을 등록하면 인쇄 시 보고서 형태로 깔끔하게 출력됩니다.
        </span>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, UploadCloud, FileText, Sparkles, Check, 
  Settings, Key, AlertCircle, RefreshCw, FileUp, Clipboard, Eye
} from 'lucide-react';
import { 
  getGeminiApiKey, 
  setGeminiApiKey, 
  summarizeWithBuiltInEngine, 
  summarizeWithGemini,
  cleanRawText
} from '../services/aiSummarizer';

// 서식별 기본 안내 및 메타정보
const FORM_CONFIG = {
  '04-01-08': {
    name: '04-01-08 안전보건협의체 회의록 및 합동점검',
    targetItems: '협의 내용 등 (협의안건, 건의사항 및 조치)',
    fields: [
      { key: 'agendas', label: '1. 협의안건', rows: 4, placeholder: '1. 사다리 작업 안전수칙...' },
      { key: 'suggestions', label: '2. 건의사항 및 기타 협의', rows: 3, placeholder: '1. 현장 안전용품 추가 지급 요청...' }
    ],
    sampleText: `[2024년 5월 안전보건협의체 정기 회의 녹취록]
홍길동(학교장): 이번 달 학교 내 수목 전정작업과 옥상 방수공사가 예정되어 있습니다. 작업 전 안전수칙 준수 부탁드립니다.
김반장(시설용역): 네, A형 사다리 작업 시 반드시 2인 1조로 작업하고 안전모 턱끈을 체결하도록 교육하겠습니다.
박주임(미화용역): 최근 급식실 옆 분리수거장 턱이 높아 미끄러짐 위험이 있습니다. 미끄럼방지 패드 부착을 건의드립니다.
이팀장(경비용역): 정문 차량 통행 시 야간 식별을 위해 반사조끼 추가 지급을 요청드립니다.
홍길동(학교장): 좋습니다. 미끄럼방지 매트는 행정실에서 즉시 구매 설치하고, 반사조끼도 추가 불출하겠습니다.`
  },
  '05-02-01': {
    name: '05-02-01 안전보건교육일지',
    targetItems: '교육내용',
    fields: [
      { key: 'eduContent', label: '교육내용 요약', rows: 6, placeholder: '1. 작업장 안전수칙...' }
    ],
    sampleText: `[2분기 정기 안전보건교육 강의 녹취 및 교안]
강사: 오늘 교육은 작업장 내 넘어짐 재해 예방과 하절기 온열질환 관리입니다.
첫째, 작업장 바닥의 물기와 기름기는 발견 즉시 제거하고 안전화를 착용해야 합니다.
둘째, 이동 시 스마트폰 사용을 금지하고 계단 난간을 반드시 파지하십시오.
셋째, 폭염 특보 발령 시 1시간 작업 후 10~15분 휴식을 보장하고 시원한 음용수를 섭취합니다.
넷째, 신체 이상 증상 발생 시 즉시 작업을 멈추고 보건관리자 또는 119에 연락 조치합니다.`
  },
  '06-02-01': {
    name: '06-02-01 산업재해조사표 및 예시',
    targetItems: '재해발생 당시 상황, 재해발생원인, 재발방지계획',
    fields: [
      { key: 'occurSituation', label: '재해발생 당시 상황', rows: 3, placeholder: '당시 작업 상황 기술...' },
      { key: 'occurReason', label: '재해발생원인', rows: 3, placeholder: '1) 인적 원인\n2) 환경적 원인...' },
      { key: 'preventPlan', label: '재발방지계획', rows: 3, placeholder: '1) 단기 대책\n2) 장기 대책...' }
    ],
    sampleText: `[급식실 조리종사원 미끄러짐 사고 경위서]
- 사고개요: 2024년 5월 12일 11:30경 조리원 홍길순이 급식 배식 준비를 위해 국솥에서 국을 퍼 이동하던 중 바닥 물기에 미끄러지며 넘어져 우측 손목 골절 발생.
- 원인 분석: 조리실 바닥에 튄 국물과 물기가 즉시 제거되지 않아 바닥이 미끄러운 상태였으며, 이동 시 조급한 마음에 주변을 충분히 살피지 못함. 미끄럼방지 안전화 마모 상태 불량.
- 재발방지: 바닥 물기 제거용 와이퍼 항시 비치, 조리실 바닥 논슬립 매트 전면 교체, 작업 전 스트레칭 및 미끄럼 예방 안전교육 실시.`
  },
  '06-02-02': {
    name: '06-02-02 중대재해 발생보고',
    targetItems: '재해발생 인지경위, 재해발생경위, 조치 및 전망',
    fields: [
      { key: 'perceiveReason', label: '4. 재해발생 인지경위', rows: 2, placeholder: '인지 시점 및 전파 경로...' },
      { key: 'occurDescription', label: '5. 재해발생경위 (육하원칙)', rows: 4, placeholder: '누가 언제 어디서 어떻게...' },
      { key: 'actionAndProspect', label: '6. 조치 및 전망', rows: 3, placeholder: '응급구호 및 향후 조치...' }
    ],
    sampleText: `[긴급 재해 상황 메모 보고]
1. 인지경위: 2024년 6월 3일 14:10경 현장 보조인력 김OO이 비명을 듣고 급식실 조리장 내부로 진입하여 재해자를 발견, 즉시 행정실 및 교감에게 무전 및 유선 보고함.
2. 경위: 조리원 이OO이 조리실 환기후드 상부 기름때 청소를 위해 1.8m A형 사다리 3단에 올라가 작업하던 중, 중심을 잃고 콘크리트 바닥으로 추락하여 두부 출혈 및 쇄골 골절 부상 발생.
3. 조치현황: 14:15 119 구급대 현장 도착하여 서울대병원 응급실로 긴급 이송 완료. 고용노동부 관할지청 및 교육청 안전총괄과 유선보고 완료. 해당 청소작업 전면 중지 명령 하달 및 동종 고소작업 안전점검 실시 예정.`
  },
  '06-02-03': {
    name: '06-02-03 재발방지 계획서',
    targetItems: '재해발생원인, 재발방지계획 (단기적 대책, 장기적 대책)',
    fields: [
      { key: 'occurReason', label: '재해발생원인', rows: 3, placeholder: '인적, 설비적, 작업환경적 원인...' },
      { key: 'shortTermPlan', label: '단기적 대책 (즉시 개선)', rows: 3, placeholder: '즉시 시행 조치...' },
      { key: 'longTermPlan', label: '장기적 대책 (시설/체계 개선)', rows: 3, placeholder: '장기 계획...' }
    ],
    sampleText: `[사고조사 보고 및 대책 협의서]
- 사고원인: 고소작업 시 안전모 미착용, A형 사다리 최상단 디딤판 탑승 금지 수칙 미준수, 2인 1조 작업 미실시 등 불안전한 행동과 현장 관리감독 미흡이 복합 작용함.
- 대책 협의:
1) 즉시 조치로는 전 사다리 작업 전면 중지 후 전 직원 특별 안전수칙 교육 실시, 사다리 사용허가제 도입.
2) 장기 시설개선 대책으로는 후드 청소용 전용 발판대(말비계) 도입, 안전난간 일체형 작업대 구매 배치 및 작업표준 매뉴얼 전면 개정.`
  },
  '09-01-05': {
    name: '09-01-05 안전보건 교육일지(근골격계부담작업)',
    targetItems: '교육내용',
    fields: [
      { key: 'eduContent', label: '근골격계부담작업 교육내용', rows: 6, placeholder: '1. 근골격계 부담작업...' }
    ],
    sampleText: `[조리/미화 직군 근골격계 질환 예방 교육 교안 요약]
강사: 오늘 교육은 급식 및 시설관리 시 발생하는 허리, 어깨 통증 예방입니다.
1. 식재료 및 무거운 쓰레기통을 들 때는 허리를 굽히지 말고 무릎을 굽혀 몸에 밀착하여 들어올려야 합니다.
2. 20kg 이상의 중량물은 반드시 2인 1조로 운반하거나 운반대차를 이용합니다.
3. 동일한 반복작업 30분 후에는 반드시 1~2분간 목, 어깨, 허리 신전 스트레칭을 실시합니다.
4. 초기 통증이나 저림 증상이 있을 경우 방치하지 말고 즉시 보건담당자에게 통보하여 적절한 치료 및 작업전환을 지원받아야 합니다.`
  },
  '10-01-04': {
    name: '10-01-04 안전보건 교육일지(MSDS교육)',
    targetItems: '교육내용 및 취급 화학물질',
    fields: [
      { key: 'eduContent', label: 'MSDS 교육내용', rows: 5, placeholder: '1. 대상 화학물질 유해위험성...' }
    ],
    sampleText: `[급식실 물질안전보건자료(MSDS) 정기교육 내용]
오늘 교육에서는 조리실에서 사용하는 오븐크리너, 락스(살균소독제), 식기세척기용 세척제 및 린스 취급 수칙을 점검했습니다.
첫째, 화학물질 소분 시에는 반드시 경고표지가 부착된 전용 용기만 사용하고 음료수병 사용을 엄격히 금지합니다.
둘째, 오븐크리너 사용 시에는 강알칼리성 물질이므로 불침투성 고무장갑과 보안경, 방진마스크를 반드시 착용해야 합니다.
셋째, 눈이나 피부에 접촉했을 때는 즉시 흐르는 물에 15분 이상 충분히 세척 후 의사의 진료를 받습니다.
넷째, MSDS 자료는 조리실 입구 게시판과 세척실에 상시 비치되어 있으니 누구나 확인 가능합니다.`
  }
};

export default function DocumentSummarizerModal({ isOpen, onClose, formCode, onApply }) {
  const config = FORM_CONFIG[formCode] || {
    name: '서식 자료 자동 정리',
    targetItems: '항목 내용',
    fields: [{ key: 'content', label: '내용', rows: 4 }]
  };

  const [inputTab, setInputTab] = useState('upload'); // 'upload' | 'text'
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryResults, setSummaryResults] = useState({});
  const [detectedChemicals, setDetectedChemicals] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // 초기화
      setInputText('');
      setUploadedFiles([]);
      setSummaryResults({});
      setDetectedChemicals([]);
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 파일 업로드 처리
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const fileTexts = [];
    for (const file of files) {
      try {
        const text = await readFileAsText(file);
        fileTexts.push(`[파일명: ${file.name}]\n${text}`);
      } catch (err) {
        console.error('File read error:', err);
        alert(`파일 읽기 오류 (${file.name}): ${err.message}`);
      }
    }

    setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    setInputText(prev => (prev ? `${prev}\n\n` : '') + fileTexts.join('\n\n'));
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      reader.readAsText(file, 'utf-8');
    });
  };

  // 드래그 앤 드롭
  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const fileTexts = [];
      for (const file of files) {
        try {
          const text = await readFileAsText(file);
          fileTexts.push(`[파일명: ${file.name}]\n${text}`);
        } catch (err) {
          alert(`파일 읽기 오류: ${err.message}`);
        }
      }
      setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
      setInputText(prev => (prev ? `${prev}\n\n` : '') + fileTexts.join('\n\n'));
    }
  };

  // 샘플 텍스트 채우기
  const handleFillSample = () => {
    if (config.sampleText) {
      setInputText(config.sampleText);
      setInputTab('text');
      setStatusMessage('💡 테스트용 예시 자료가 입력되었습니다. 아래 [자동 정리 실행]을 눌러보세요.');
    }
  };

  // 자동 요약 실행
  const handleRunSummarize = async () => {
    if (!inputText.trim()) {
      alert('업로드된 파일 또는 입력된 텍스트 자료가 없습니다.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('');

    const apiKey = getGeminiApiKey();

    try {
      let results = null;

      if (apiKey) {
        setStatusMessage('✨ Google Gemini AI로 고성능 정밀 분석 중...');
        results = await summarizeWithGemini(apiKey, formCode, inputText);
      } else {
        setStatusMessage('⚡ 지능형 내장 요약 엔진으로 분석 중...');
        results = summarizeWithBuiltInEngine(formCode, inputText);
      }

      setSummaryResults(results);
      if (results.detectedChemicals) {
        setDetectedChemicals(results.detectedChemicals);
      }
      setStatusMessage('✅ 분석 및 정리가 완료되었습니다! 결과를 확인하고 필요 시 수정한 후 서식에 반영하세요.');
    } catch (err) {
      console.error('Gemini error, fallback to built-in:', err);
      try {
        const fallback = summarizeWithBuiltInEngine(formCode, inputText);
        setSummaryResults(fallback);
        if (fallback.detectedChemicals) {
          setDetectedChemicals(fallback.detectedChemicals);
        }
        setStatusMessage('✅ 분석 및 정리가 완료되었습니다! 결과를 확인하고 필요 시 수정한 후 서식에 반영하세요.');
      } catch (fallbackErr) {
        setStatusMessage(`❌ 분석 실패: ${fallbackErr.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // 서식에 최종 반영
  const handleApplyToForm = () => {
    if (Object.keys(summaryResults).length === 0) {
      alert('정리된 내용이 없습니다. 먼저 자동 정리를 실행해주세요.');
      return;
    }

    const payload = { ...summaryResults };
    if (formCode === '10-01-04' && detectedChemicals.length > 0) {
      payload._detectedChemicals = detectedChemicals;
    }

    onApply(payload);
    onClose();
  };

  // 결과 필드 편집
  const handleResultChange = (key, value) => {
    setSummaryResults(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card summarizer-modal" style={{ maxWidth: '780px', width: '92%' }}>
        {/* 모달 헤더 */}
        <div className="modal-header bg-slate-900 text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
          <div className="modal-title text-white">
            <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <Sparkles size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                자료 업로드 및 자동 정리
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 font-normal">
                  {formCode}
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-normal mt-0.5">
                대상 항목: <strong className="text-amber-300">{config.targetItems}</strong>
              </p>
            </div>
          </div>
          <button className="icon-btn text-slate-300 hover:text-white" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="modal-body space-y-4" style={{ maxHeight: '78vh' }}>
          {/* 상단 탭 및 샘플 버튼 */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-1.5 text-xs font-bold rounded-t border-b-2 flex items-center gap-1.5 transition-colors ${
                  inputTab === 'upload'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setInputTab('upload')}
              >
                <UploadCloud size={14} /> 파일 업로드 (.txt, .md, .csv, 문서 등)
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-xs font-bold rounded-t border-b-2 flex items-center gap-1.5 transition-colors ${
                  inputTab === 'text'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setInputTab('text')}
              >
                <Clipboard size={14} /> 녹취록/자료 직접 붙여넣기
              </button>
            </div>

            <button
              type="button"
              className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 px-2 py-1 bg-slate-100 rounded hover:bg-blue-50 transition-colors"
              onClick={handleFillSample}
              title="동작을 즉시 확인할 수 있는 테스트용 예시 회의록/자료를 채웁니다"
            >
              <FileText size={13} />
              <span>테스트 예시 채우기</span>
            </button>
          </div>

          {/* 파일 업로드 탭 내용 */}
          {inputTab === 'upload' && (
            <div className="space-y-2">
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:bg-blue-50/40 hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.md,.csv,.log,.json,.text"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UploadCloud size={24} />
                </div>
                <div className="text-sm font-bold text-slate-700 mb-1">
                  회의자료나 녹취록 텍스트 파일을 끌어다 놓거나 클릭하여 선택하세요
                </div>
                <div className="text-xs text-slate-500">
                  지원 형식: 일반 텍스트(.txt), 마크다운(.md), 회의록 기록 파일 등 (다중 선택 가능)
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 text-xs">
                  <div className="font-bold text-blue-900 mb-1 flex items-center gap-1">
                    <Check size={14} className="text-blue-600" /> 업로드된 파일 ({uploadedFiles.length}건):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadedFiles.map((name, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border rounded text-slate-700 font-mono">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 텍스트 직접 입력 탭 내용 또는 업로드 후 미리보기 */}
          {(inputTab === 'text' || inputText.length > 0) && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileText size={13} className="text-slate-500" /> 자료 내용 미리보기 및 수정
                  {inputText && <span className="font-normal text-slate-500">({inputText.length}자)</span>}
                </label>
                {inputText && (
                  <button
                    type="button"
                    className="text-xs text-rose-500 hover:underline"
                    onClick={() => { setInputText(''); setUploadedFiles([]); }}
                  >
                    내용 비우기
                  </button>
                )}
              </div>
              <textarea
                className="table-textarea text-xs w-full font-mono bg-white"
                rows={5}
                placeholder="회의 녹취록, 회의록 메모, 교육 교안, 사고 발생 조사 기록 등을 복사하여 붙여넣으세요..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          )}

          {/* AI 엔진 및 옵션 바 */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 shadow-sm">
                <Sparkles size={13} className="text-amber-500" />
                Google Gemini AI 자동 요약
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                * 자료를 분석하여 공문서 표준 개조식으로 간략히 정제합니다.
              </span>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-primary flex items-center gap-1.5 shadow-sm px-4"
              onClick={handleRunSummarize}
              disabled={isProcessing || !inputText.trim()}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                fontWeight: 700
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> 분석 및 정리 중...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> 자동 정리 실행
                </>
              )}
            </button>
          </div>

          {/* 상태/진행 메시지 */}
          {statusMessage && (
            <div className="text-xs font-semibold text-slate-700 px-3 py-1.5 rounded bg-slate-50 border border-slate-200">
              {statusMessage}
            </div>
          )}

          {/* 정리 결과 미리보기 및 편집 섹션 */}
          {Object.keys(summaryResults).length > 0 && (
            <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                  <Check size={16} className="text-blue-600" />
                  정리된 결과 미리보기 (이곳에서 직접 수정 후 반영할 수 있습니다)
                </div>
                <span className="text-[11px] text-slate-500">
                  {useGemini && geminiKey ? 'Gemini AI 정리' : '내장 지능형 엔진 정리'}
                </span>
              </div>

              {/* 필드별 렌더링 */}
              {config.fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {field.label}
                  </div>
                  <textarea
                    className="table-textarea text-xs w-full bg-white border-blue-200 focus:border-blue-500"
                    rows={field.rows || 3}
                    placeholder={field.placeholder || ''}
                    value={summaryResults[field.key] || ''}
                    onChange={(e) => handleResultChange(field.key, e.target.value)}
                  />
                </div>
              ))}

              {/* 화학물질 감지 시 안내 (10-01-04) */}
              {detectedChemicals.length > 0 && (
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900 mb-1">
                    🧪 자료에서 감지된 취급 화학물질 ({detectedChemicals.length}종):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {detectedChemicals.map((chem, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-amber-300 rounded font-bold text-amber-800">
                        {chem}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-1">
                    * [서식에 반영하기]를 누르면 서식의 취급화학물질 목록에도 자동으로 추가됩니다.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="modal-footer">
          <button type="button" className="btn btn-sm btn-outline" onClick={onClose}>
            취소
          </button>
          <div className="btn-group-right">
            <button
              type="button"
              className="btn btn-sm btn-primary flex items-center gap-1.5 font-bold shadow"
              disabled={Object.keys(summaryResults).length === 0}
              onClick={handleApplyToForm}
              style={{
                background: Object.keys(summaryResults).length > 0
                  ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                  : undefined
              }}
            >
              <Check size={16} /> 서식에 내용 반영하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

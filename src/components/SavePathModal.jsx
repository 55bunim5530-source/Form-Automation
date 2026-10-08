import React, { useState, useEffect } from 'react';
import { X, Folder, FolderPlus, Check, HardDrive, FileText, AlertCircle, Info, RotateCcw } from 'lucide-react';
import { 
  getSavePathConfig, 
  setSavePathConfig, 
  getActiveDirectoryHandle, 
  setActiveDirectoryHandle 
} from '../services/storage';

export default function SavePathModal({ isOpen, onClose, onPathUpdated }) {
  const [config, setConfig] = useState({
    folderName: '',
    customPathText: '',
    preferredFormat: 'hwp'
  });
  const [isSupported, setIsSupported] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfig(getSavePathConfig());
      setIsSupported(typeof window !== 'undefined' && 'showDirectoryPicker' in window);
      setStatusMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 내 컴퓨터 폴더 선택 (File System Access API)
  const handlePickDirectory = async () => {
    if (!('showDirectoryPicker' in window)) {
      alert('현재 브라우저에서는 폴더 직접 선택 API를 지원하지 않습니다.\n아래 경로 직접 입력란에 원하시는 저장 경로를 입력해 두세요.');
      return;
    }

    try {
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });

      if (dirHandle) {
        setActiveDirectoryHandle(dirHandle);
        const nextConfig = {
          ...config,
          folderName: dirHandle.name,
          customPathText: config.customPathText || dirHandle.name
        };
        setConfig(nextConfig);
        setSavePathConfig(nextConfig);
        setStatusMsg(`✅ 내 컴퓨터 '${dirHandle.name}' 폴더가 저장 경로로 지정되었습니다!`);
        if (onPathUpdated) onPathUpdated(nextConfig);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Directory pick error:', err);
        alert('폴더 선택 중 오류가 발생했습니다: ' + err.message);
      }
    }
  };

  // 수동 저장 및 닫기
  const handleSave = () => {
    setSavePathConfig(config);
    if (onPathUpdated) onPathUpdated(config);
    alert('저장 경로 설정이 저장되었습니다.');
    onClose();
  };

  // 경로 초기화
  const handleReset = () => {
    if (confirm('설정된 저장 경로를 초기화하시겠습니까? (기본 다운로드 폴더로 저장됩니다)')) {
      const resetConfig = {
        folderName: '',
        customPathText: '',
        preferredFormat: 'hwp'
      };
      setActiveDirectoryHandle(null);
      setConfig(resetConfig);
      setSavePathConfig(resetConfig);
      if (onPathUpdated) onPathUpdated(resetConfig);
      setStatusMsg('저장 경로가 초기화되었습니다.');
    }
  };

  const currentHandle = getActiveDirectoryHandle();

  return (
    <div className="modal-overlay">
      <div className="modal-card save-path-modal" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Folder className="text-primary" size={20} />
            <h3 className="font-bold text-base">내 컴퓨터 저장경로 설정</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body space-y-4">
          <div className="notice-banner">
            <p className="text-xs text-slate-700 leading-relaxed">
              보관함에서 서식을 <strong>한글(HWP)</strong> 및 <strong>PDF</strong> 파일로 내보낼 때,
              내 컴퓨터의 원하는 폴더에 <strong>자동으로 저장</strong>되도록 경로를 지정할 수 있습니다.
            </p>
          </div>

          {/* 1. 폴더 선택 버튼 및 상태 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <HardDrive size={15} className="text-blue-600" />
                지정된 저장 폴더
              </span>
              {currentHandle && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  직접 폴더 저장 활성됨
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-primary flex items-center gap-1.5 shadow-sm px-3.5"
                onClick={handlePickDirectory}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  whiteSpace: 'nowrap'
                }}
              >
                <FolderPlus size={15} />
                내 컴퓨터 폴더 선택
              </button>

              <div className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-mono truncate">
                {config.folderName ? `📁 ${config.folderName}` : '(설정된 폴더 없음 - 기본 다운로드)'}
              </div>
            </div>

            {statusMsg && (
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                {statusMsg}
              </div>
            )}
          </div>

          {/* 2. 폴더 경로 메모/수동 입력 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              참고용 폴더 전체 경로 (직접 입력 가능)
            </label>
            <input
              type="text"
              placeholder="예: C:\Users\user\Documents\산업안전보건서식"
              className="table-input text-xs w-full font-mono bg-white border border-slate-300 rounded px-2.5 py-1.5"
              value={config.customPathText}
              onChange={(e) => setConfig({ ...config, customPathText: e.target.value })}
            />
            <p className="text-[11px] text-slate-500">
              * 경로를 적어두시면 파일 다운로드 시 어떤 폴더에 분류할지 쉽게 확인할 수 있습니다.
            </p>
          </div>

          {/* 3. 지원 형식 안내 */}
          <div className="border border-slate-200 rounded-lg p-3 bg-white text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileText size={14} className="text-blue-500" /> 지원되는 저장 형식
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-bold text-blue-700">■ 한글 문서 (.hwp)</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  아래아한글 프로그램에서 공문서 표와 결재 서명 그대로 열리는 호환 문서로 저장
                </p>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-bold text-rose-700">■ PDF 문서 (.pdf)</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  A4 표준 규격 인쇄 창을 통해 PDF 파일로 원클릭 저장
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-outline text-slate-600 flex items-center gap-1"
            onClick={handleReset}
          >
            <RotateCcw size={13} /> 경로 초기화
          </button>

          <div className="btn-group-right">
            <button
              type="button"
              className="btn btn-sm btn-primary px-4 font-bold"
              onClick={handleSave}
            >
              <Check size={14} /> 설정 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, UploadCloud } from 'lucide-react';
import DocumentSummarizerModal from './DocumentSummarizerModal';

/**
 * 자료 업로드 및 자동 요약 실행 버튼 + 모달 통합 컴포넌트
 */
export default function SummarizeButton({ 
  formCode, 
  onApply, 
  buttonLabel = '관련자료 업로드 및 자동정리',
  buttonTitle = '녹취록 또는 회의/교육/사고자료를 업로드하여 내용을 자동으로 정리합니다',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`btn-ai-summarize no-print ${className}`}
        onClick={() => setIsOpen(true)}
        title={buttonTitle}
      >
        <Sparkles size={13} className="text-amber-300 flex-shrink-0" />
        <span className="btn-label-text">{buttonLabel}</span>
      </button>

      <DocumentSummarizerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        formCode={formCode}
        onApply={(result) => {
          onApply(result);
        }}
      />
    </>
  );
}

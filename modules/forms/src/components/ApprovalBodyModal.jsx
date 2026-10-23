import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, Check, Copy, FileText, RotateCcw, X } from 'lucide-react';

export default function ApprovalBodyModal({ initialText, formTitle, onClose, onRegenerate }) {
  const [text, setText] = useState(initialText || '');
  const [generatedText, setGeneratedText] = useState(initialText || '');
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [copying, setCopying] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const dialogRef = useRef(null);
  const textareaRef = useRef(null);
  const regenerateButtonRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const mountedRef = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const id = useId();
  const titleId = `${id}-title`;
  const textareaId = `${id}-text`;
  const guidanceId = `${id}-guidance`;
  const statusId = `${id}-status`;

  useEffect(() => {
    mountedRef.current = true;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    textareaRef.current?.focus();
    textareaRef.current?.setSelectionRange(0, 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), textarea:not([disabled]), [tabindex="0"]')]
        .filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      mountedRef.current = false;
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    if (confirmRegenerate) confirmButtonRef.current?.focus();
  }, [confirmRegenerate]);

  const selectText = () => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
    textareaRef.current?.setSelectionRange(0, textareaRef.current.value.length);
  };

  const copyWithSelection = () => {
    selectText();
    try {
      return typeof document.execCommand === 'function' && document.execCommand('copy') === true;
    } catch {
      return false;
    }
  };

  const handleCopy = async () => {
    if (copying) return;
    setCopying(true);
    setStatus({ type: '', message: '' });
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        // Keep the clipboard request inside the user's click activation.
        await navigator.clipboard.writeText(text);
        copied = true;
      } else {
        copied = copyWithSelection();
      }
    } catch {
      if (mountedRef.current) copied = copyWithSelection();
    }
    if (!mountedRef.current) return;
    if (copied) {
      setStatus({ type: 'success', message: '복사했습니다. 결재 문서에 붙여넣어 주세요.' });
    } else {
      selectText();
      setStatus({ type: 'warning', message: '자동 복사가 되지 않았습니다. 선택된 본문을 Ctrl+C로 복사해 주세요.' });
    }
    setCopying(false);
  };

  const regenerate = () => {
    try {
      const nextText = onRegenerate();
      if (typeof nextText !== 'string') throw new Error('본문 생성 결과가 올바르지 않습니다.');
      setText(nextText);
      setGeneratedText(nextText);
      setConfirmRegenerate(false);
      setStatus({ type: 'info', message: '현재 서식 내용으로 본문을 다시 만들었습니다.' });
      textareaRef.current?.focus();
      if (textareaRef.current) textareaRef.current.scrollTop = 0;
    } catch {
      setConfirmRegenerate(false);
      setStatus({ type: 'warning', message: '본문을 다시 만들지 못했습니다. 잠시 후 다시 시도해 주세요.' });
      regenerateButtonRef.current?.focus();
    }
  };

  const handleRegenerate = () => {
    if (text !== generatedText) {
      setConfirmRegenerate(true);
      setStatus({ type: '', message: '' });
    } else {
      regenerate();
    }
  };

  return (
    <div className="modal-overlay approval-body-overlay no-print">
      <section ref={dialogRef} className="modal-card approval-body-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={guidanceId}>
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={21} className="text-primary" aria-hidden="true" />
            <h3 id={titleId}>결재용 본문 만들기</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="결재용 본문 창 닫기"><X size={21} /></button>
        </div>

        <div className="modal-body approval-body-content">
          <p className="approval-body-source"><span>선택한 서식</span><strong>{formTitle}</strong></p>
          <p id={guidanceId} className="approval-body-guidance">본문을 검토하고 <strong>대괄호 [ ]</strong>로 표시된 부분을 보완한 뒤 복사해 주세요.</p>
          <div className="approval-body-label-row">
            <label htmlFor={textareaId}>결재용 본문</label>
            <button type="button" className="btn btn-xs btn-outline" onClick={() => {
              selectText();
              setStatus({ type: 'info', message: '본문을 전체 선택했습니다. Ctrl+C로 복사할 수 있습니다.' });
            }}>전체 선택</button>
          </div>
          <textarea
            ref={textareaRef}
            id={textareaId}
            className="approval-body-textarea"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setStatus({ type: '', message: '' });
              setConfirmRegenerate(false);
            }}
            aria-describedby={`${guidanceId} ${statusId}`}
            readOnly={copying}
            spellCheck={false}
          />
          <div id={statusId} className={`approval-body-status${status.type ? ` is-${status.type}` : ''}`} role="status" aria-live="polite" aria-atomic="true">
            {status.type === 'success' && <Check size={15} aria-hidden="true" />}
            {status.type === 'warning' && <AlertCircle size={15} aria-hidden="true" />}
            <span>{status.message}</span>
          </div>
        </div>

        <div className="modal-footer approval-body-footer">
          {confirmRegenerate && (
            <div className="approval-body-confirm" role="group" aria-label="본문 다시 만들기 확인">
              <p>편집한 내용이 있습니다. 현재 서식으로 다시 만들면 편집 내용이 바뀝니다.</p>
              <div className="approval-body-confirm-actions">
                <button ref={confirmButtonRef} type="button" className="btn btn-xs btn-outline" onClick={() => {
                  setConfirmRegenerate(false);
                  regenerateButtonRef.current?.focus();
                }}>편집 내용 유지</button>
                <button type="button" className="btn btn-xs btn-primary" onClick={regenerate} disabled={copying}>덮어쓰고 다시 만들기</button>
              </div>
            </div>
          )}
          <div className="approval-body-footer-actions">
            <button ref={regenerateButtonRef} type="button" className="btn btn-outline" onClick={handleRegenerate} disabled={copying}><RotateCcw size={15} /><span>다시 만들기</span></button>
            <div className="btn-group-right">
              <button type="button" className="btn btn-outline" onClick={onClose}>닫기</button>
              <button type="button" className="btn btn-primary" onClick={handleCopy} disabled={copying || !text.trim()}><Copy size={16} /><span>{copying ? '복사 중…' : '본문 복사'}</span></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

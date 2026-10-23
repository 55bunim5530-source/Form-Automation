import React, { useEffect, useRef } from 'react';
import { FilePenLine } from 'lucide-react';

export default function UnsavedChangesModal({ onCancel, onDiscard }) {
  const dialog = useRef(null);
  const cancel = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    cancel.current?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') onCancel();
      if (event.key === 'Tab') {
        const buttons = dialog.current.querySelectorAll('button');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);
  return (
    <div className="modal-overlay no-print">
      <section ref={dialog} className="modal-card unsaved-modal" role="alertdialog" aria-modal="true" aria-labelledby="unsaved-title" aria-describedby="unsaved-description">
        <div className="modal-body">
          <span className="guide-icon"><FilePenLine size={21} /></span>
          <h2 id="unsaved-title">아직 저장하지 않은 내용이 있습니다.</h2>
          <p id="unsaved-description">계속 작성하여 문서를 저장하거나, 변경 내용을 버리고 이동할 수 있습니다.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onDiscard}>변경 내용 버리기</button>
          <button ref={cancel} className="btn btn-primary" onClick={onCancel}>계속 작성하기</button>
        </div>
      </section>
    </div>
  );
}

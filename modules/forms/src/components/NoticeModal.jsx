import React, { useEffect, useRef } from 'react';

export default function NoticeModal({ message, onClose }) {
  const confirm = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    confirm.current?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        event.preventDefault();
        confirm.current?.focus();
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
      <section className="modal-card" role="alertdialog" aria-modal="true" aria-labelledby="notice-title" aria-describedby="notice-message">
        <div className="modal-header"><div className="modal-title"><h3 id="notice-title">알림</h3></div></div>
        <div className="modal-body"><p id="notice-message" style={{ whiteSpace: 'pre-line' }}>{message}</p></div>
        <div className="modal-footer"><button ref={confirm} className="btn btn-primary" onClick={onClose}>확인</button></div>
      </section>
    </div>
  );
}

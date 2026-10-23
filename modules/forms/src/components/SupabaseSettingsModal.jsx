import React, { useState, useEffect } from 'react';
import { X, Database, Copy, Check, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { getSupabaseConfig, setSupabaseConfig, getSupabaseClient, SQL_SCHEMA_GUIDE } from '../services/storage';

export default function SupabaseSettingsModal({ isOpen, onClose, onConfigUpdated }) {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url || '');
      setAnonKey(config.anonKey || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_GUIDE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!url || !anonKey) {
      setTestResult({ success: false, message: 'URL과 Anon Key를 모두 입력해 주세요.' });
      return;
    }
    setTesting(true);
    setTestResult(null);

    try {
      setSupabaseConfig(url, anonKey);
      const client = getSupabaseClient();
      if (!client) throw new Error('클라이언트 초기화 실패');

      const { error } = await client.from('safety_documents').select('id').limit(1);
      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          setTestResult({
            success: false,
            message: '연결은 되었으나 safety_documents 테이블이 없습니다. 아래의 SQL 스키마를 Supabase에 실행해 주세요.'
          });
        } else {
          setTestResult({ success: false, message: `연결 오류: ${error.message}` });
        }
      } else {
        setTestResult({ success: true, message: 'Supabase 데이터베이스에 성공적으로 연결되었습니다!' });
      }
    } catch (err) {
      setTestResult({ success: false, message: `연결 실패: ${err.message}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setSupabaseConfig(url.trim(), anonKey.trim());
    if (onConfigUpdated) onConfigUpdated();
    onClose();
  };

  const handleClear = () => {
    setSupabaseConfig('', '');
    setUrl('');
    setAnonKey('');
    setTestResult({ success: true, message: 'Supabase 연결이 해제되었습니다. 로컬 저장소 모드로 동작합니다.' });
    if (onConfigUpdated) onConfigUpdated();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card config-modal">
        <div className="modal-header">
          <div className="modal-title">
            <Database size={20} className="text-emerald-500" />
            <h3>Supabase 백엔드 데이터베이스 연동</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body space-y-4">
          <div className="notice-banner">
            <p>
              Supabase를 연동하면 입력한 서식 데이터를 <strong>다른 컴퓨터나 다른 사람들과 실시간으로 공유</strong>할 수 있습니다.
              (설정하지 않아도 브라우저 <strong>로컬 스토리지에 자동 보관</strong>되므로 즉시 사용 가능합니다.)
            </p>
          </div>

          <div className="form-group">
            <label>Supabase Project URL</label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Supabase Anon Public API Key</label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="form-input"
            />
          </div>

          {testResult && (
            <div className={`alert-box ${testResult.success ? 'alert-success' : 'alert-error'}`}>
              <AlertCircle size={18} />
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="schema-guide-card">
            <div className="schema-header">
              <span className="font-semibold text-sm">Supabase SQL 스키마 (1회 실행 필요)</span>
              <button className="btn btn-xs btn-outline" onClick={handleCopySql}>
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? '복사됨!' : 'SQL 복사'}
              </button>
            </div>
            <p className="text-xs text-muted">
              Supabase 콘솔의 <strong>[SQL Editor]</strong>에 붙여넣고 [Run]을 누르면 필요한 테이블과 정책이 자동 생성됩니다.
            </p>
            <pre className="schema-code-block">{SQL_SCHEMA_GUIDE}</pre>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline text-danger" onClick={handleClear}>
            연결 해제(로컬 전용)
          </button>
          <div className="btn-group-right">
            <button className="btn btn-outline" onClick={handleTestConnection} disabled={testing}>
              <RefreshCw size={15} className={testing ? 'animate-spin' : ''} />
              {testing ? '연결 확인 중...' : '연결 테스트'}
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              저장 및 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

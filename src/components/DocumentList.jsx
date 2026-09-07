import React, { useState } from 'react';
import { FileText, Calendar, School, User, Trash2, Edit3, Copy, Printer, Search, RefreshCw, Database, HardDrive } from 'lucide-react';
import { FORM_METAS } from '../forms/formDataPresets';

export default function DocumentList({
  documents = [],
  activeDocId,
  onSelectDoc,
  onCopyDoc,
  onDeleteDoc,
  onPrintDoc,
  onRefresh,
  loading,
  storageSource
}) {
  const [filterCode, setFilterCode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) => {
    if (filterCode !== 'ALL' && doc.formCode !== filterCode) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (doc.title || '').toLowerCase().includes(q);
      const matchOrg = (doc.orgName || '').toLowerCase().includes(q);
      const matchAuthor = (doc.author || '').toLowerCase().includes(q);
      const matchCode = (doc.formCode || '').toLowerCase().includes(q);
      return matchTitle || matchOrg || matchAuthor || matchCode;
    }
    return true;
  });

  return (
    <div className="doc-list-container">
      <div className="doc-list-header">
        <div className="doc-list-title-row">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            <h3 className="text-lg font-bold">저장된 서식 보관함</h3>
            <span className="count-badge">{filteredDocs.length}건</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`source-indicator ${storageSource === 'supabase' ? 'source-supabase' : 'source-local'}`}>
              {storageSource === 'supabase' ? <Database size={13} /> : <HardDrive size={13} />}
              {storageSource === 'supabase' ? 'Supabase 클라우드 동기화 중' : '로컬 스토리지 모드'}
            </span>

            <button
              className="btn btn-xs btn-outline"
              onClick={onRefresh}
              title="새로고침"
              disabled={loading}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="제목, 학교명, 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-chips">
            <button
              className={`chip ${filterCode === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterCode('ALL')}
            >
              전체 ({documents.length})
            </button>
            {Object.entries(FORM_METAS).map(([code, meta]) => {
              const count = documents.filter((d) => d.formCode === code).length;
              return (
                <button
                  key={code}
                  className={`chip ${filterCode === code ? 'active' : ''}`}
                  onClick={() => setFilterCode(code)}
                >
                  {code} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 목록 리스트 */}
      <div className="doc-cards-grid">
        {filteredDocs.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">저장된 서식이 없습니다.</p>
            <p className="empty-desc">
              상단 <strong>[새 서식 작성]</strong> 버튼을 눌러 양식을 작성하고 저장해 보세요.
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const meta = FORM_METAS[doc.formCode] || { title: doc.title, category: '기타' };
            const isSelected = doc.id === activeDocId;

            return (
              <div
                key={doc.id}
                className={`doc-card ${isSelected ? 'doc-card-active' : ''}`}
              >
                <div className="doc-card-top">
                  <span className="doc-code-badge">{doc.formCode}</span>
                  <span className="doc-category-badge">{meta.category}</span>
                  <span className="doc-date-text">
                    <Calendar size={12} /> {doc.docDate || '날짜 미지정'}
                  </span>
                </div>

                <h4 className="doc-card-title">{doc.title || meta.title}</h4>

                <div className="doc-card-meta-row">
                  {doc.orgName && (
                    <span className="meta-item">
                      <School size={13} /> {doc.orgName}
                    </span>
                  )}
                  {doc.author && (
                    <span className="meta-item">
                      <User size={13} /> {doc.author}
                    </span>
                  )}
                </div>

                <div className="doc-card-footer">
                  <span className="updated-at">
                    {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>

                  <div className="doc-card-actions">
                    <button
                      className="btn-icon-action"
                      title="불러와서 수정"
                      onClick={() => onSelectDoc(doc)}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="btn-icon-action"
                      title="복사하여 새 작성"
                      onClick={() => onCopyDoc(doc)}
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      className="btn-icon-action"
                      title="바로 출력 / PDF"
                      onClick={() => onPrintDoc(doc)}
                    >
                      <Printer size={15} />
                    </button>
                    <button
                      className="btn-icon-action text-danger"
                      title="삭제"
                      onClick={() => {
                        if (confirm(`'${doc.title || meta.title}' 서식을 삭제하시겠습니까?`)) {
                          onDeleteDoc(doc.id);
                        }
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

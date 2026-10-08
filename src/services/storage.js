import { createClient } from '@supabase/supabase-js';

const LOCAL_STORAGE_KEY = 'safety_automation_documents_v1';
const SUPABASE_CONFIG_KEY = 'safety_supabase_config_v1';
const DEFAULT_SETTINGS_KEY = 'safety_default_settings_v1';

export function getDefaultSettings() {
  try {
    const raw = localStorage.getItem(DEFAULT_SETTINGS_KEY);
    if (!raw) {
      return {
        schoolName: '',
        inspectorDept: '',
        inspectorName: '',
        inspectorSign: '',
        signManager: '',
        signPrincipal: '',
        instructorName: '',
        instructorTitle: '',
        eduLocation: '',
        contractorCompany: '',
        contractorLeader: ''
      };
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function setDefaultSettings(settings) {
  try {
    localStorage.setItem(DEFAULT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save default settings', e);
  }
}

export const SQL_SCHEMA_GUIDE = `-- Supabase SQL Editor에서 실행할 테이블 생성 스크립트
create table if not exists public.safety_documents (
  id text primary key,
  form_code text not null,
  title text not null,
  org_name text,
  author text,
  doc_date text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 누구나 읽고 쓸 수 있는 RLS 정책 (사내 및 학교 공유용)
alter table public.safety_documents enable row level security;

create policy "모든 사용자 조회 허용"
on public.safety_documents for select
using (true);

create policy "모든 사용자 등록/수정 허용"
on public.safety_documents for insert
with check (true);

create policy "모든 사용자 수정 허용"
on public.safety_documents for update
using (true);

create policy "모든 사용자 삭제 허용"
on public.safety_documents for delete
using (true);
`;

export function getSupabaseConfig() {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (!raw) return { url: '', anonKey: '' };
    return JSON.parse(raw);
  } catch {
    return { url: '', anonKey: '' };
  }
}

export function setSupabaseConfig(url, anonKey) {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url, anonKey }));
}

export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey);
  } catch (err) {
    console.error('Supabase Client Init Error:', err);
    return null;
  }
}

// 로컬 스토리지 목록 가져오기
function getLocalDocs() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read local storage', e);
    return [];
  }
}

function saveLocalDocs(docs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
}

// 통합 문서 목록 로드 (Supabase 우선, Fallback으로 로컬)
export async function loadDocuments() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('safety_documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        // 성공 시 로컬에도 동기화 캐시
        const formatted = data.map(row => ({
          id: row.id,
          formCode: row.form_code,
          title: row.title,
          orgName: row.org_name,
          author: row.author,
          docDate: row.doc_date,
          data: row.data,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          source: 'supabase'
        }));
        saveLocalDocs(formatted);
        return { docs: formatted, source: 'supabase' };
      }
      console.warn('Supabase fetch error, fallback to local:', error);
    } catch (err) {
      console.warn('Supabase connect error, fallback to local:', err);
    }
  }

  // 로컬 스토리지에서 반환
  const localDocs = getLocalDocs();
  return { docs: localDocs, source: 'local' };
}

// 문서 저장 (로컬 + Supabase 동시 저장)
export async function saveDocument(doc) {
  const now = new Date().toISOString();
  const documentToSave = {
    id: doc.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    formCode: doc.formCode,
    title: doc.title,
    orgName: doc.orgName || '',
    author: doc.author || '',
    docDate: doc.docDate || new Date().toISOString().slice(0, 10),
    data: doc.data,
    createdAt: doc.createdAt || now,
    updatedAt: now
  };

  // 1. 로컬 저장 (항상 유지)
  const localDocs = getLocalDocs();
  const existingIndex = localDocs.findIndex(d => d.id === documentToSave.id);
  if (existingIndex >= 0) {
    localDocs[existingIndex] = { ...documentToSave, source: 'local' };
  } else {
    localDocs.unshift({ ...documentToSave, source: 'local' });
  }
  saveLocalDocs(localDocs);

  // 2. Supabase 연동 시 클라우드 저장
  const supabase = getSupabaseClient();
  let supabaseResult = { success: false };
  if (supabase) {
    try {
      const payload = {
        id: documentToSave.id,
        form_code: documentToSave.formCode,
        title: documentToSave.title,
        org_name: documentToSave.orgName,
        author: documentToSave.author,
        doc_date: documentToSave.docDate,
        data: documentToSave.data,
        updated_at: now
      };
      const { error } = await supabase.from('safety_documents').upsert(payload);
      if (!error) {
        supabaseResult = { success: true };
      } else {
        console.error('Supabase upsert failed:', error);
        supabaseResult = { success: false, error: error.message };
      }
    } catch (err) {
      console.error('Supabase save exception:', err);
      supabaseResult = { success: false, error: err.message };
    }
  }

  return { doc: documentToSave, supabaseResult };
}

// 문서 삭제
export async function deleteDocument(id) {
  const localDocs = getLocalDocs().filter(d => d.id !== id);
  saveLocalDocs(localDocs);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('safety_documents').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase delete error:', e);
    }
  }
  return true;
}

// ================= 저장 경로 및 내보내기 설정 =================
const SAVE_PATH_CONFIG_KEY = 'safety_save_path_config_v1';

let activeDirectoryHandle = null;

export function getActiveDirectoryHandle() {
  return activeDirectoryHandle;
}

export function setActiveDirectoryHandle(handle) {
  activeDirectoryHandle = handle;
}

export function getSavePathConfig() {
  try {
    const raw = localStorage.getItem(SAVE_PATH_CONFIG_KEY);
    if (!raw) {
      return {
        folderName: '',
        customPathText: '',
        preferredFormat: 'hwp'
      };
    }
    return JSON.parse(raw);
  } catch {
    return { folderName: '', customPathText: '', preferredFormat: 'hwp' };
  }
}

export function setSavePathConfig(config) {
  try {
    localStorage.setItem(SAVE_PATH_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save path config', e);
  }
}


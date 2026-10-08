/**
 * 산업안전보건 서식 내보내기 및 파일 시스템 저장 서비스
 * 
 * 1. 아래아한글(HWP) 호환 문서 생성 및 다운로드
 * 2. File System Access API를 이용한 내 컴퓨터 지정 폴더 직접 저장
 * 3. 브라우저 PDF 인쇄 및 저장 연계
 */

import { getActiveDirectoryHandle } from './storage';

/**
 * 파일명에 사용할 수 없는 특수문자 제거
 */
function sanitizeFilename(name) {
  if (!name) return '안전보건서식';
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}

/**
 * 서식 데이터를 한글(HWP)에서 바로 열리는 호환 HTML 양식으로 변환
 */
export function generateHwpHtml(doc) {
  const data = doc.data || {};
  const formCode = doc.formCode || '';
  const title = doc.title || '산업안전보건 서식';
  const orgName = doc.orgName || data.schoolName || '';
  const docDate = doc.docDate || data.docDate || data.eduDate || new Date().toISOString().slice(0, 10);

  // 본문 콘텐츠 생성
  let bodyContentHtml = '';

  switch (formCode) {
    case '04-01-08': {
      // 회의록 및 합동점검
      bodyContentHtml = `
        <table class="form-table">
          <tr>
            <th style="width: 20%;">일 시</th>
            <td style="width: 80%;">${data.dateTime || docDate || '-'}</td>
          </tr>
          <tr>
            <th>장 소</th>
            <td>${data.location || '-'}</td>
          </tr>
        </table>
        <table class="form-table" style="margin-top: 15px;">
          <tr>
            <th style="background-color: #f1f5f9; text-align: left; padding: 8px 12px;">■ 협의안건 및 점검내용</th>
          </tr>
          <tr>
            <td style="height: 140px; vertical-align: top; padding: 12px; white-space: pre-wrap; font-size: 11pt;">${data.agendas || '안건 내용 없음'}</td>
          </tr>
          <tr>
            <th style="background-color: #f1f5f9; text-align: left; padding: 8px 12px;">■ 건의사항 및 조치계획</th>
          </tr>
          <tr>
            <td style="height: 100px; vertical-align: top; padding: 12px; white-space: pre-wrap; font-size: 11pt;">${data.suggestions || '건의사항 없음'}</td>
          </tr>
        </table>
      `;
      break;
    }

    case '05-02-01':
    case '09-01-05':
    case '10-01-04': {
      // 안전보건교육일지 계열
      bodyContentHtml = `
        <table class="form-table">
          <tr>
            <th style="width: 20%;">교육일시</th>
            <td>${data.eduDate || docDate || '-'} (${data.startTime || '09:00'} ~ ${data.endTime || '10:00'}, ${data.durationMinutes || '60'}분간)</td>
          </tr>
          <tr>
            <th>교육과목(주제)</th>
            <td style="font-weight: bold;">${data.eduSubject || title}</td>
          </tr>
          <tr>
            <th style="height: 180px;">교육내용</th>
            <td style="vertical-align: top; padding: 12px; white-space: pre-wrap; font-size: 11pt;">${data.eduContent || '교육 내용 없음'}</td>
          </tr>
          <tr>
            <th>교육강사 / 장소</th>
            <td>강사: ${data.instructorName || '-'} (${data.instructorTitle || '-'}) / 장소: ${data.eduLocation || '-'}</td>
          </tr>
        </table>
      `;
      break;
    }

    case '06-02-01': {
      // 산업재해조사표
      bodyContentHtml = `
        <table class="form-table">
          <tr>
            <th style="width: 25%;">재해발생일시</th>
            <td>${data.occurDate || docDate} ${data.occurTime || ''}</td>
            <th style="width: 20%;">발생장소</th>
            <td>${data.occurPlace || '-'}</td>
          </tr>
          <tr>
            <th>재해발생 당시 상황</th>
            <td colspan="3" style="height: 90px; vertical-align: top; padding: 10px; white-space: pre-wrap;">${data.occurSituation || '-'}</td>
          </tr>
          <tr>
            <th>재해발생원인</th>
            <td colspan="3" style="height: 110px; vertical-align: top; padding: 10px; white-space: pre-wrap;">${data.occurReason || '-'}</td>
          </tr>
          <tr>
            <th>재발방지계획</th>
            <td colspan="3" style="height: 110px; vertical-align: top; padding: 10px; white-space: pre-wrap;">${data.preventPlan || '-'}</td>
          </tr>
        </table>
      `;
      break;
    }

    case '06-02-02': {
      // 중대재해 발생보고
      bodyContentHtml = `
        <table class="form-table">
          <tr>
            <th style="width: 25%;">4. 인지경위</th>
            <td style="padding: 10px; white-space: pre-wrap;">${data.perceiveReason || '-'}</td>
          </tr>
          <tr>
            <th>5. 재해발생경위 (육하원칙)</th>
            <td style="height: 130px; vertical-align: top; padding: 10px; white-space: pre-wrap;">${data.occurDescription || '-'}</td>
          </tr>
          <tr>
            <th>6. 조치 및 전망</th>
            <td style="height: 100px; vertical-align: top; padding: 10px; white-space: pre-wrap;">${data.actionAndProspect || '-'}</td>
          </tr>
        </table>
      `;
      break;
    }

    case '06-02-03': {
      // 재발방지 계획서
      bodyContentHtml = `
        <table class="form-table">
          <tr>
            <th style="width: 25%;">사고개요 / 발생일시</th>
            <td>${data.occurDateTimeText || docDate} (재해자: ${data.victimName || '-'})</td>
          </tr>
          <tr>
            <th>재해발생원인</th>
            <td style="height: 120px; vertical-align: top; padding: 10px; white-space: pre-wrap;">${data.occurReason || '-'}</td>
          </tr>
          <tr>
            <th>단기적 대책 (즉시 개선)</th>
            <td style="height: 100px; vertical-align: top; padding: 10px; white-space: pre-wrap;">${data.shortTermPlan || '-'}</td>
          </tr>
          <tr>
            <th>장기적 대책 (시설·체계 개선)</th>
            <td style="height: 100px; vertical-align: top; padding: 10px; white-space: pre-wrap;">${data.longTermPlan || '-'}</td>
          </tr>
        </table>
      `;
      break;
    }

    default: {
      // 일반 공통 서식
      bodyContentHtml = `
        <table class="form-table">
          <tr>
            <th style="width: 20%;">문서명</th>
            <td>${title}</td>
          </tr>
          <tr>
            <th>기관(학교)명</th>
            <td>${orgName || '-'}</td>
          </tr>
          <tr>
            <th>작성자 / 일자</th>
            <td>${doc.author || '-'} / ${docDate}</td>
          </tr>
        </table>
      `;
    }
  }

  // 결재란 서명 이미지 태그 처리
  const signManagerHtml = data.signManager 
    ? `<img src="${data.signManager}" style="max-height: 45px; max-width: 70px;" alt="담당 서명" />` 
    : `<span style="color: #94a3b8; font-size: 9pt;">(서명/인)</span>`;

  const signPrincipalHtml = data.signPrincipal 
    ? `<img src="${data.signPrincipal}" style="max-height: 45px; max-width: 70px;" alt="기관장 서명" />` 
    : `<span style="color: #94a3b8; font-size: 9pt;">(서명/인)</span>`;

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>${sanitizeFilename(title)}</title>
  <style>
    @page {
      size: 210mm 297mm;
      margin: 20mm 15mm 15mm 15mm;
    }
    body {
      font-family: 'Malgun Gothic', '한컴바탕', 'Batang', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000000;
      margin: 0;
      padding: 0;
    }
    .header-box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .doc-code {
      font-size: 10pt;
      font-weight: bold;
      color: #475569;
      margin-bottom: 5px;
    }
    .main-title {
      font-size: 20pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 0;
    }
    .approval-table {
      border-collapse: collapse;
      float: right;
      margin-bottom: 15px;
    }
    .approval-table th, .approval-table td {
      border: 1px solid #000000;
      text-align: center;
      padding: 4px 10px;
      font-size: 10pt;
    }
    .approval-side {
      width: 25px;
      background-color: #f8fafc;
      font-weight: bold;
      line-height: 1.2;
    }
    .approval-cell {
      width: 75px;
      height: 55px;
      vertical-align: middle;
    }
    .form-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      clear: both;
    }
    .form-table th, .form-table td {
      border: 1px solid #000000;
      padding: 7px 10px;
      font-size: 10.5pt;
    }
    .form-table th {
      background-color: #f1f5f9;
      font-weight: bold;
      text-align: center;
    }
    .footer-box {
      margin-top: 30px;
      text-align: right;
      font-size: 12pt;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div style="overflow: hidden; margin-bottom: 15px;">
    <!-- 우측 상단 결재란 -->
    <table class="approval-table">
      <tr>
        <th rowspan="2" class="approval-side">결<br/>재</th>
        <th style="width: 75px;">담 당</th>
        <th style="width: 75px;">학교(기관)장</th>
      </tr>
      <tr>
        <td class="approval-cell">${signManagerHtml}</td>
        <td class="approval-cell">${signPrincipalHtml}</td>
      </tr>
    </table>

    <!-- 좌측 타이틀 -->
    <div style="float: left; width: 60%;">
      <div class="doc-code">[서식 ${formCode}] 산업안전보건 표준서식</div>
      <h1 class="main-title">${title}</h1>
      <div style="margin-top: 8px; font-size: 11pt; color: #334155;">
        소속 기관: <strong>${orgName || '기관명 미지정'}</strong>
      </div>
    </div>
  </div>

  <!-- 본문 서식 표 -->
  ${bodyContentHtml}

  <!-- 하단 발신/작성자 명의 -->
  <div class="footer-box">
    <div>작성일자: ${docDate}</div>
    <div style="margin-top: 8px; font-size: 14pt;">${orgName || '서울시교육청 소속기관'}</div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 사용자 컴퓨터로 파일 저장 (File System Access API 또는 브라우저 다운로드)
 */
export async function saveFileToDevice(filename, content, mimeType = 'text/plain') {
  const dirHandle = getActiveDirectoryHandle();

  // 1. File System Access API 디렉토리 핸들이 활성화되어 있는 경우 직접 해당 폴더에 파일 생성
  if (dirHandle && typeof dirHandle.getFileHandle === 'function') {
    try {
      const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return {
        success: true,
        method: 'filesystem',
        folderName: dirHandle.name,
        filename
      };
    } catch (err) {
      console.warn('Direct filesystem write failed, falling back to blob download:', err);
      // 권한 만료 또는 사용자 취소 시 브라우저 다운로드로 폴백 진행
    }
  }

  // 2. 브라우저 표준 다운로드 링크 방식
  const blob = typeof content === 'string' 
    ? new Blob([content], { type: `${mimeType};charset=utf-8` }) 
    : content;
    
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return {
    success: true,
    method: 'download',
    filename
  };
}

/**
 * 문서를 한글(HWP) 파일로 내보내기
 */
export async function exportDocumentAsHwp(doc) {
  const hwpContent = generateHwpHtml(doc);
  const dateStr = doc.docDate || new Date().toISOString().slice(0, 10);
  const filename = `[${doc.formCode}]_${sanitizeFilename(doc.orgName || '산업안전')}_${sanitizeFilename(doc.title)}_${dateStr}.hwp`;

  return await saveFileToDevice(filename, hwpContent, 'application/haansofthwp');
}

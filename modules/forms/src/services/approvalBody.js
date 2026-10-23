import { FORM_METAS } from '../forms/formDataPresets.js';
import { value } from './approvalHelpers.js';
import { inspectionApproval } from './approvalInspections.js';
import { educationApproval } from './approvalEducation.js';
import { incidentApproval } from './approvalIncidents.js';

export function generateApprovalBody(formCode, formData = {}) {
  const data = formData && typeof formData === 'object' ? formData : {};
  const report = inspectionApproval(formCode, data) || educationApproval(formCode, data) || incidentApproval(formCode, data);
  if (!report) {
    return `${FORM_METAS[formCode]?.title || '서식'} 내용을 다음과 같이 보고합니다.\n1. 관련: [관련 문서번호 또는 근거 입력]\n2. 주요내용: [내용 입력]\n3. 기타사항: [기타사항 확인·입력]`;
  }
  const items = [['관련', value(data.approvalReference, '[관련 문서번호 또는 근거 입력]')], ...report.items];
  return `${report.intro}\n${items.map(([label, content], index) => `${index + 1}. ${label}: ${value(content).replace(/\n/g, '\n   ')}`).join('\n')}`;
}

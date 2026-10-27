import type { Evidence, SearchResponse } from "@/features/chatbot/lib/manual-search";

const LAW_PUBLISHER = "법제처 국가법령정보센터";
const SAFETY_MANUAL = "서울특별시교육청 산업안전보건업무 매뉴얼";

function publicationDate(value: string): number | null {
  const date = value.trim();
  const range = date.match(/^(\d{4})[-.](\d{1,2})\s*[~–]\s*(\d{1,2})$/u);
  if (range) {
    const year = Number(range[1]);
    const lastMonth = Number(range[3]);
    return lastMonth >= Number(range[2]) && lastMonth <= 12 ? year * 10000 + lastMonth * 100 : null;
  }
  const match = date.match(/^(\d{4})(?:[-.](\d{1,2})(?:[-.](\d{1,2}))?)?$/u);
  if (!match) return null;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : 0;
  const day = match[3] ? Number(match[3]) : 0;
  if (year < 1900 || year > 2200 || month > 12 || (match[2] && month < 1)) return null;
  if (match[3]) {
    const valid = new Date(Date.UTC(year, month - 1, day));
    if (day < 1 || valid.getUTCFullYear() !== year || valid.getUTCMonth() !== month - 1 || valid.getUTCDate() !== day) return null;
  }
  return year * 10000 + month * 100 + day;
}

function priority(item: Evidence): { group: number; date: number } {
  if (item.sourcePublisher === LAW_PUBLISHER) return { group: 0, date: 0 };
  if (item.sourceTitle === SAFETY_MANUAL) return { group: 1, date: 0 };
  const date = item.sourceTitle.trim() ? publicationDate(item.sourceDate) : null;
  return date === null ? { group: 3, date: 0 } : { group: 2, date };
}

function orderedEntries(items: Evidence[]): Array<{ item: Evidence; oldIndex: number }> {
  return items.map((item, oldIndex) => ({ item, oldIndex })).sort((a, b) => {
    const left = priority(a.item);
    const right = priority(b.item);
    return left.group - right.group || right.date - left.date || a.oldIndex - b.oldIndex;
  });
}

/** Order displayed sources while preserving every citation's link to its source. */
export function orderAnswerEvidence(result: SearchResponse): SearchResponse {
  const ordered = orderedEntries(result.evidence);
  const newIds = new Map(ordered.map(({ oldIndex }, index) => [oldIndex + 1, index + 1]));
  const message = result.message.replace(/\[근거\s+(\d+)\]/gu, (reference, number: string) => {
    const newId = newIds.get(Number(number));
    return newId ? `[근거 ${newId}]` : reference;
  });
  return {
    ...result,
    message,
    keyPoints: result.keyPoints.map((point) => ({
      ...point,
      evidenceIds: point.evidenceIds.map((id) => newIds.get(id) ?? id),
    })),
    evidence: ordered.map(({ item }) => item),
    relatedEvidence: result.relatedEvidence ? orderedEntries(result.relatedEvidence).map(({ item }) => item) : undefined,
  };
}

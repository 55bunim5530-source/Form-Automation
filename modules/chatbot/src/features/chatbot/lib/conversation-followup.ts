import { analyzeQuery } from "@/features/chatbot/lib/query-understanding";
import type { ConversationContext } from "@/features/chatbot/lib/manual-search";

const REFERENT = /(?:^|\s)(?:그럼|그러면|그렇다면|(?:그런|이런|저런)\s*경우(?:에는|에서|엔|에|도|는)?|(?:그|이|저)\s*(?:거|것|건|걸|때|경우|내용|결과|점검|교육|사람|분)(?:에는|에서|은|는|이|가|을|를|에|엔|도|의|부터|까지|요)?)(?=\s|[?.,!]|$)/u;
const OMITTED_SUBJECT = /(?:언제|누가|어디|어떻게|왜|몇\s*(?:번|회|년|개월|시간)|얼마나|무엇|뭐부터|서류|기한|기간|주기|보관|보존|기록|비용|대상|작성|제출|신청|보고|해야|필요)/u;
const NAMED_TOPIC = /(?:산업재해조사표|중대재해|산업재해|위험성평가|안전보건협의체|합동점검|순회점검|정기점검|안전보건교육|정기교육|채용\s*시\s*교육|MSDS|물질안전보건자료|건강진단|경고표지|보호구|관리감독자|산업안전보건위원회)/iu;
const FULL_QUESTION = /(?:언제|누가|어디|어떻게|몇\s*(?:번|회|년|개월|시간)|얼마나|무엇|뭐부터|기한|기간|주기|보관|보존|작성|제출|신청|보고|해야|필요|의무|가능|대상)/u;

export function shouldResolveFollowUp(question: string, previous?: ConversationContext): boolean {
  if (!previous?.question) return false;
  const current = question.trim();
  if (!current) return false;
  const namedTopic = NAMED_TOPIC.test(current);
  const elliptical = /(?:은요|는요|도요|이요|그건|이건)[?.!]?$/u.test(current) && !FULL_QUESTION.test(current);
  if (namedTopic && !elliptical) return false;
  if (elliptical && namedTopic) return true;
  if (REFERENT.test(current)) return true;
  const analysis = analyzeQuery(current);
  const previousCategory = previous.category ?? analyzeQuery(previous.question).primaryCategory;
  if (analysis.primaryCategory && previousCategory && analysis.primaryCategory !== previousCategory) return false;
  return current.length <= 45 && !namedTopic && (OMITTED_SUBJECT.test(current) || /(?:은요|는요|도요|이요)[?.!]?$/u.test(current));
}

export function ambiguousReferent(question: string, previous?: ConversationContext): string | null {
  if (!previous || !/(?:그거|이거|저거|그것|이것|저것|그건|이건|그걸|이걸)/u.test(question)) return null;
  const prior = previous.question;
  if (!/(?:차이|비교|다르|달라|둘\s*중|어느\s*쪽)/u.test(prior)) return null;
  const options = prior.match(/(?:합동점검|순회점검|위험성평가|안전보건협의체|정기교육|채용\s*시\s*교육|MSDS|건강진단)/gu);
  const unique = [...new Set(options ?? [])];
  if (unique.length < 2) return "앞서 비교한 항목 중 어느 쪽을 말씀하시나요? 대상 업무명을 알려주세요.";
  return `${unique.slice(0, 3).join('·')} 중 어느 것을 말씀하시나요? 대상 업무명을 알려주세요.`;
}

export function recentConversationQuestions(previous?: ConversationContext): string[] {
  if (!previous) return [];
  const recent = previous.recentQuestions?.filter(Boolean) ?? [];
  return [...new Set([...recent, previous.question])].slice(-4);
}

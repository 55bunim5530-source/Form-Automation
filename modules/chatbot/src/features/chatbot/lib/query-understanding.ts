import rawConcepts from "@/features/chatbot/data/search-concepts.json";

type ConceptDefinition = {
  id: string;
  category?: string;
  canonical: string;
  aliases: string[];
  related: string[];
  excluded?: string[];
};

export type QueryIntent = "emergency" | "application" | "procedure" | "frequency" | "duration" | "retention" | "eligibility" | "comparison" | "location" | "general";

export type MatchedConcept = {
  id: string;
  category?: string;
  canonical: string;
  matchedText: string;
  matchType: "canonical" | "alias" | "related";
  weight: number;
};

export type QueryAnalysis = {
  original: string;
  normalized: string;
  compact: string;
  expandedText: string;
  terms: string[];
  concepts: MatchedConcept[];
  conceptIds: string[];
  categories: string[];
  primaryCategory?: string;
  intents: QueryIntent[];
  primaryIntent: QueryIntent;
  subjects: string[];
  isFollowUp: boolean;
};

const concepts = rawConcepts as ConceptDefinition[];
const STOP_WORDS = new Set(["학교", "근로자", "어떻게", "무엇", "어떤", "해야", "하나요", "있나요", "관한", "관련", "대해", "경우", "우리", "에서", "위한", "확인"]);
const SUBJECT_CONCEPTS = new Set(["cleaning_worker", "food_service_worker", "new_employee", "daily_worker", "supervisor"]);
const ENDING_PATTERN = /(하면|해서|했을|할지|할까|받아야|해야|하나요|인가요|습니까|나요|은|는|이|가|을|를|에|도|로|의|과|와|에서|에는|에게|마다|부터|까지)$/u;

export function normalizeText(value: string): string {
  return value.toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function compact(value: string): string {
  return normalizeText(value).replaceAll(" ", "");
}

function containsPhrase(question: string, phrase: string): boolean {
  const normalizedPhrase = compact(phrase);
  return normalizedPhrase.length >= 2 && question.includes(normalizedPhrase);
}

function matchConcepts(question: string): MatchedConcept[] {
  const matches = concepts.flatMap((concept) => {
    if (concept.excluded?.some((phrase) => containsPhrase(question, phrase))) return [];
    const candidates = [
      { values: [concept.canonical], matchType: "canonical" as const, weight: 10 },
      { values: concept.aliases, matchType: "alias" as const, weight: 8 },
      { values: concept.related, matchType: "related" as const, weight: 3 },
    ];
    for (const candidate of candidates) {
      const matchedText = candidate.values.find((phrase) => containsPhrase(question, phrase));
      if (matchedText) {
        return [{
          id: concept.id,
          category: concept.category,
          canonical: concept.canonical,
          matchedText,
          matchType: candidate.matchType,
          weight: candidate.weight,
        }];
      }
    }
    return [];
  });
  return matches.sort((a, b) => b.weight - a.weight || b.matchedText.length - a.matchedText.length);
}

function detectIntents(question: string, conceptIds: Set<string>): QueryIntent[] {
  const intents: QueryIntent[] = [];
  const add = (intent: QueryIntent, matched: boolean) => {
    if (matched && !intents.includes(intent)) intents.push(intent);
  };
  add("emergency", ["collapse_emergency", "electric_shock_emergency", "cut_entrapment_emergency", "head_injury_emergency", "fracture_emergency", "major_bleeding_emergency", "gas_inhalation_emergency", "chemical_ingestion_emergency", "fire_emergency"].some((id) => conceptIds.has(id)) || /(?:쓰러|실신|의식(?:이)?없|의식을잃|호흡없|심정지|감전|끼였|끼었|베였|절단|머리를다쳤|머리부상|골절|부러|피가많이나|출혈이심|가스중독|가스흡입|가스를마셔|불이났|화재|응급|119|aed|심폐소생)/u.test(question));
  add("application", /(?:신청|접수|제출|서류|보상|요양급여)/u.test(question));
  add("retention", /(?:보관|보존|기록.*몇년|얼마나.*보관|얼마나.*보존)/u.test(question));
  add("frequency", /(?:얼마나자주|몇년에한번|몇년마다|몇개월마다|몇회|몇번|몇차례|주기|매년|반기|분기)/u.test(question));
  add("duration", /(?:몇시간|교육시간|얼마동안|기간|언제까지)/u.test(question));
  add("eligibility", /(?:대상|누가|받아야|해당|포함|제외|인가요|되나요|가능한가|가능해)/u.test(question));
  add("comparison", /(?:차이|다른|비교|보다)/u.test(question));
  add("location", /(?:어디|장소|위치|어느기관|어느부서)/u.test(question));
  add("procedure", /(?:어떻게|뭐부터|무엇부터|절차|방법|순서|조치|대응|해야)/u.test(question));
  return intents.length ? intents : ["general"];
}

function tokenize(value: string): string[] {
  return [...new Set(normalizeText(value)
    .split(/\s+/u)
    .filter((word) => word.length >= 2 && !STOP_WORDS.has(word))
    .map((word) => word.replace(ENDING_PATTERN, ""))
    .filter((word) => word.length >= 2))];
}

export function analyzeQuery(value: string): QueryAnalysis {
  const normalized = normalizeText(value);
  const compactQuestion = normalized.replaceAll(" ", "");
  const matchedConcepts = matchConcepts(compactQuestion);
  const conceptIds = matchedConcepts.map((concept) => concept.id);
  const categoryScores = new Map<string, number>();
  for (const concept of matchedConcepts) {
    if (!concept.category) continue;
    categoryScores.set(concept.category, (categoryScores.get(concept.category) ?? 0) + concept.weight);
  }
  const categories = [...categoryScores.entries()].sort((a, b) => b[1] - a[1]).map(([category]) => category);
  const canonicalTerms = matchedConcepts.map((concept) => concept.canonical);
  const shorthandTerms: string[] = [];
  if (/뭐부터/u.test(compactQuestion)) shorthandTerms.push("무엇부터");
  if (/얼마나자주|몇년에한번|몇년마다|몇번|몇회/u.test(compactQuestion)) shorthandTerms.push("주기", "매년");
  const expandedText = [...new Set([...canonicalTerms, ...shorthandTerms, normalized])].join(" ");
  const intents = detectIntents(compactQuestion, new Set(conceptIds));
  const isFollowUp = compactQuestion.length <= 24 && /^(?:그럼|그러면|그건|그결과|그경우|그사람|이건|그것|또)|(?:은요|는요|도요|보관해요|어때요|자주해요|몇번해요|기한이에요|비용이에요)$/u.test(compactQuestion);
  return {
    original: value,
    normalized,
    compact: compactQuestion,
    expandedText,
    terms: tokenize(expandedText),
    concepts: matchedConcepts,
    conceptIds,
    categories,
    primaryCategory: categories[0],
    intents,
    primaryIntent: intents[0],
    subjects: conceptIds.filter((id) => SUBJECT_CONCEPTS.has(id)),
    isFollowUp,
  };
}

export function expandQuery(value: string): string {
  return analyzeQuery(value).expandedText;
}

export function queryTerms(value: string): string[] {
  return analyzeQuery(value).terms;
}

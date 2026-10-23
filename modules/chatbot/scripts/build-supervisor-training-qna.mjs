import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/build-supervisor-training-qna.mjs <converted.md> <output.json>");
  process.exit(1);
}

function cleanMarkup(value) {
  return value
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/t[dh]>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const markdown = readFileSync(resolve(inputPath), "utf8");
const starts = [...markdown.matchAll(/^Q(\d+)\.\s+(.+)$/gm)];
const searchTermsByQuestion = {
  1: ["법정 교육시간", "연간 교육시간", "연간 16시간", "교육내용"],
  2: ["집합교육", "집합교육 시간", "의무 비율", "2분의 1", "비대면 실시간교육"],
  3: ["수강기간", "미이수", "교육 미이수", "전문 교육기관", "유료 이수"],
  4: ["원격과정", "직무연수 20시간", "실 재생시간", "집합교육 8시간"],
  5: ["학교 안전사고 교육", "정기교육 인정", "교육내용 충족"],
  6: ["우편통신교육", "우편교육", "타 교육기관", "잔여 8시간"],
  7: ["매년 이수", "법정 필수교육", "교육 미실시", "과태료"],
  8: ["현업업무종사자", "근로자 정기교육", "추가 교육"],
  9: ["전출", "인사 발령", "다른 학교", "교육 다시", "신규 부임 학교장"],
  10: ["수료증", "이수증", "보존기간", "5년 보존"],
  11: ["자체 교육", "강사 자격", "근로자 대상 교육", "교육 실시"],
};
const chunks = starts.map((match, index) => {
  const number = Number(match[1]);
  const question = match[2].trim();
  const bodyStart = (match.index ?? 0) + match[0].length;
  const bodyEnd = starts[index + 1]?.index ?? markdown.length;
  const answer = cleanMarkup(markdown.slice(bodyStart, bodyEnd));
  return {
    pdfPage: number,
    referenceLabel: `질의응답 Q${number}`,
    category: "supervisor",
    searchTerms: searchTermsByQuestion[number] ?? [],
    section: `Q${number}. ${question}`,
    text: `질문: ${question}\n답변: ${answer}`,
  };
});

if (chunks.length !== 11 || chunks.some((chunk) => chunk.text.length < 30)) {
  throw new Error(`Expected 11 complete Q&A chunks, received ${chunks.length}.`);
}

const payload = {
  sourceTitle: "관리감독자 정기 안전보건교육 질의응답 모음",
  sourcePublisher: "서울특별시교육청보건안전진흥원 산업안전보건지원과",
  sourceDate: "",
  sourceUrl: null,
  sourceSha256: createHash("sha256").update(markdown).digest("hex"),
  extraction: "kordoc HWP to Markdown; chunked by Q&A item",
  chunkCount: chunks.length,
  pages: chunks,
};

writeFileSync(resolve(outputPath), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Created ${chunks.length} Q&A chunks at ${resolve(outputPath)}`);

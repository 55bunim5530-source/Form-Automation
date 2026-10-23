"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpenText,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  ExternalLink,
  FileQuestion,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Menu,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SearchResponse } from "@/features/chatbot/lib/manual-search";
import {
  getIntegrationUrl,
  integrationLabels,
  quickTopics,
} from "@/features/chatbot/lib/demo-data";

type AnswerMessage = {
  id: number;
  kind: "answer";
  result: SearchResponse;
};

type UserMessage = { id: number; kind: "user"; text: string };
type Message = UserMessage | AnswerMessage;

const topicIcons = [
  GraduationCap,
  TriangleAlert,
  FlaskConical,
  ClipboardList,
  ShieldCheck,
  HeartPulse,
  Waves,
];

export function ChatWorkspace({ aiEnabled, embedded = false }: { aiEnabled: boolean; embedded?: boolean }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const previousContextRef = useRef<SearchResponse["context"]>(undefined);
  const idRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => () => {
    requestRef.current?.abort();
  }, []);

  function chooseQuestion(question: string) {
    setMobileMenu(false);
    void sendQuestion(question);
  }

  async function sendQuestion(questionOverride?: string) {
    const question = (questionOverride ?? input).trim();
    if (!question || loading) return;
    idRef.current += 1;
    setMessages((current) => [...current, { id: idRef.current, kind: "user", text: question }]);
    setInput("");
    setLoading(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, previousContext: previousContextRef.current }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("검색 요청에 실패했습니다.");
      const result = (await response.json()) as SearchResponse;
      if (controller.signal.aborted) return;
      if (result.context) previousContextRef.current = result.context;
      idRef.current += 1;
      setMessages((current) => [
        ...current,
        { id: idRef.current, kind: "answer", result },
      ]);
    } catch {
      if (!controller.signal.aborted) {
        idRef.current += 1;
        setMessages((current) => [...current, { id: idRef.current, kind: "answer", result: { status: "not_found", message: "검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", keyPoints: [], sourceTitle: "", sourceDate: "", evidence: [] } }]);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
      if (requestRef.current === controller) requestRef.current = null;
    }
  }

  function clearConversation() {
    requestRef.current?.abort();
    requestRef.current = null;
    previousContextRef.current = undefined;
    setMessages([]);
    setLoading(false);
    setInput("");
    setMobileMenu(false);
    textareaRef.current?.focus();
  }

  const hasConversation = messages.length > 0;

  return (
    <div className="h-dvh overflow-hidden bg-[#dbeafe] text-[#172e36]">
      <div className={`mx-auto flex h-dvh ${embedded ? "max-w-none" : "max-w-[1760px]"}`}>
        {!embedded && <aside className="hidden w-[258px] shrink-0 flex-col border-r border-[#e2e9e9] bg-white px-5 py-7 lg:flex">
          <Brand />
          <div className="mt-10 px-2 text-[11px] font-bold tracking-[0.13em] text-[#84969a]">WORKSPACE</div>
          <button onClick={clearConversation} className="mt-3 flex w-full items-center gap-3 rounded-xl bg-[#ecf7f5] px-4 py-3.5 text-left text-sm font-semibold text-[#167568] transition hover:bg-[#dff2ef]">
            <BookOpenText size={18} strokeWidth={2} />
            새 대화 시작
          </button>
          <div className="mt-9 px-2 text-[11px] font-bold tracking-[0.13em] text-[#84969a]">빠른 업무 분야</div>
          <div className="mt-2 space-y-0.5">
            {quickTopics.map((topic, index) => {
              const Icon = topicIcons[index];
              return (
                <button key={topic.id} onClick={() => chooseQuestion(topic.question)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-[#5c7075] transition hover:bg-[#f2f7f7] hover:text-[#167568]">
                  <Icon size={17} strokeWidth={1.8} className="text-[#84999b] group-hover:text-[#279887]" />
                  {topic.label}
                </button>
              );
            })}
          </div>
          <div className="mt-auto rounded-2xl border border-[#e1eae9] bg-[#f7faf9] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#27675f]"><ShieldCheck size={16} /> 근거 중심 안내</div>
            <p className="mt-2 text-xs leading-5 text-[#718588]">{aiEnabled ? "등록된 근거자료를 검색한 뒤 AI가 근거 번호와 함께 답변합니다." : "등록된 근거자료에서 직접 확인되는 내용만 근거 번호와 함께 안내합니다."}</p>
          </div>
          <div className="px-2 pt-5 text-[11px] text-[#9aabae]">학교 산업안전보건 · v1.8</div>
        </aside>}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className={`${embedded ? "h-[54px]" : "h-[76px]"} flex shrink-0 items-center justify-between border-b border-[#e2e9e9] bg-white/90 px-5 backdrop-blur-sm sm:px-8 lg:px-10`}>
            <div className="flex items-center gap-3">
              {!embedded && <button aria-label="메뉴 열기" onClick={() => setMobileMenu(true)} className="rounded-lg p-1.5 text-[#47646a] lg:hidden"><Menu size={23} /></button>}
              {!embedded && <div className="lg:hidden"><Brand compact /></div>}
              <div className="flex items-center gap-2 text-sm text-[#72878b]"><span>업무 지원</span><ChevronRight size={15} /><span className="font-semibold text-[#21454c]">{aiEnabled ? "AI 도우미" : "근거 검색"}</span></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-[#d5e8e4] bg-[#f1faf7] px-3 py-1.5 text-xs font-semibold text-[#1e806f] sm:inline-flex"><span className="mr-2 mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#20a488]" />{aiEnabled ? "v1.8 AI 근거답변" : "v1.8 근거자료 검색"}</span>
              <button onClick={clearConversation} title="대화 초기화" aria-label="대화 초기화" className="rounded-full border border-[#e2e9e9] bg-white p-2.5 text-[#587278] transition hover:bg-[#f5f9f9]"><RotateCcw size={16} /></button>
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="챗봇 대화">
            <div className="mx-auto flex w-full max-w-[920px] flex-1 flex-col px-5 pb-7 pt-8 sm:px-8 lg:pt-10">
              {!hasConversation ? <Welcome onChoose={chooseQuestion} aiEnabled={aiEnabled} /> : (
                <div className="flex-1 space-y-8 pb-10">
                  <div className="flex items-center justify-between border-b border-[#e5ecec] pb-5">
                    <div><p className="text-[11px] font-bold tracking-[0.12em] text-[#239481]">CONVERSATION</p><h1 className="mt-1 text-xl font-bold tracking-tight">질문과 답변</h1></div>
                    <span className="text-xs text-[#83969a]">현재 대화는 저장되지 않습니다</span>
                  </div>
                  {messages.map((message) => message.kind === "user" ? <UserBubble key={message.id} text={message.text} /> : <AnswerBubble key={message.id} message={message} />)}
                  {loading && <LoadingBubble aiEnabled={aiEnabled} />}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>
          </main>

          <div className="shrink-0 border-t border-[#e2e9e9] bg-white px-5 pb-4 pt-4 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[920px]">
              <div className="flex items-end gap-2 rounded-2xl border border-[#cfdfdf] bg-white p-2 shadow-[0_8px_25px_rgba(29,71,73,0.06)] transition focus-within:border-[#56b3a3] focus-within:shadow-[0_8px_28px_rgba(30,141,121,0.11)]">
                <textarea
                  ref={textareaRef}
                  aria-label="산업안전보건 질문 입력"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                      event.preventDefault();
                      sendQuestion();
                    }
                  }}
                  rows={2}
                  placeholder="산업안전보건 업무에 대해 질문해 주세요"
                  className="max-h-36 min-h-[54px] flex-1 resize-y bg-transparent px-3 py-3 text-sm leading-6 text-[#223d43] outline-none placeholder:text-[#a2b0b2]"
                />
                <button aria-label="질문 전송" onClick={() => sendQuestion()} disabled={!input.trim() || loading} className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#138a76] text-white transition hover:bg-[#0d7463] disabled:cursor-not-allowed disabled:bg-[#c5d9d5]"><ArrowUp size={19} strokeWidth={2.3} /></button>
              </div>
              <p className="mt-2.5 text-center text-[11px] leading-4 text-[#899b9f]">Enter로 전송 · Shift+Enter로 줄바꿈 <span className="mx-1.5 text-[#c3d0d1]">|</span> {aiEnabled ? "AI 근거답변" : "근거자료 검색 안내"}이며 중요한 판단은 원문과 현행 기준을 확인하세요.</p>
            </div>
          </div>
        </div>
      </div>

      {!embedded && mobileMenu && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="메뉴 닫기" onClick={() => setMobileMenu(false)} className="absolute inset-0 bg-[#10292e]/40" /><div className="absolute inset-y-0 left-0 w-[290px] max-w-[85vw] overflow-y-auto bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><Brand /><button aria-label="메뉴 닫기" onClick={() => setMobileMenu(false)} className="rounded-lg p-1 text-[#506b70]"><X size={21} /></button></div><button onClick={clearConversation} className="mt-9 flex w-full items-center gap-2 rounded-xl bg-[#ecf7f5] px-4 py-3 text-sm font-semibold text-[#167568]"><BookOpenText size={17} /> 새 대화 시작</button><p className="mt-8 text-[11px] font-bold tracking-[0.13em] text-[#84969a]">빠른 업무 분야</p><div className="mt-3 space-y-1">{quickTopics.map((topic, index) => { const Icon = topicIcons[index]; return <button key={topic.id} onClick={() => chooseQuestion(topic.question)} className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left text-sm text-[#50676c]"><Icon size={18} />{topic.label}</button>; })}</div></div></div>}
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-3"><span className={`${compact ? "h-9 w-9 rounded-xl" : "h-10 w-10 rounded-[13px]"} flex items-center justify-center bg-[#178b78] text-white shadow-[0_5px_12px_rgba(24,139,120,0.16)]`}><ShieldCheck size={compact ? 21 : 23} strokeWidth={1.9} /></span><div><div className={`${compact ? "text-[13px]" : "text-[14px]"} font-extrabold leading-tight tracking-tight text-[#183c43]`}>학교 산업안전보건</div><div className="mt-0.5 text-[11px] font-semibold tracking-[0.05em] text-[#4e8580]">근거 기반 업무 안내</div></div></div>;
}

function Welcome({ onChoose, aiEnabled }: { onChoose: (question: string) => void; aiEnabled: boolean }) {
  return <div className="flex flex-1 flex-col">
    <div className="max-w-[680px] pt-3 sm:pt-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#d8ece7] bg-[#ecf8f5] px-3 py-1.5 text-[11px] font-bold text-[#1e8c78]"><Sparkles size={13} /> 학교 산업안전보건 업무의 출발점</div>
      <h1 className="mt-5 text-[30px] font-bold leading-[1.33] tracking-[-0.045em] text-[#18383e] sm:text-[39px]">산업안전보건 업무,<br /><span className="text-[#168d79]">궁금한 점을 질문해 주세요.</span></h1>
      <p className="mt-4 max-w-[620px] text-[14px] leading-7 text-[#657b80] sm:text-[15px]">학교 산업안전보건 매뉴얼과 규정, 중대산업재해 대응, 시설관리 위험작업, 고위험요인 대응, 산업안전보건위원회, 도급 협의체, 현장 개선사례, 건강관리 지원, 안전싸이렌, 교육자료 등 등록된 근거자료를 검색한 뒤 {aiEnabled ? "AI가 근거 번호를 붙여 답변하고" : "직접 확인되는 내용과"} 사용한 근거 항목을 함께 보여드립니다.</p>
    </div>
    <div className="mt-10 sm:mt-12">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-[15px] font-bold text-[#28484e]">빠른 질문으로 시작하기</h2><span className="text-[11px] font-medium text-[#92a3a6]">질문을 선택하면 바로 답변합니다</span></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {quickTopics.map((topic, index) => { const Icon = topicIcons[index]; return <button key={topic.id} onClick={() => onChoose(topic.question)} className="group flex min-h-[80px] items-center gap-3 rounded-2xl border border-[#e2ebeb] bg-white p-4 text-left shadow-[0_2px_7px_rgba(30,70,70,0.025)] transition hover:-translate-y-0.5 hover:border-[#a9dcd2] hover:shadow-[0_8px_20px_rgba(28,93,82,0.07)]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf7f5] text-[#278e7c]"><Icon size={20} strokeWidth={1.8} /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-bold text-[#278977]">{topic.label}</span><span className="mt-1 block text-[12px] leading-5 text-[#62777b]">{topic.question}</span></span><ArrowRight size={16} className="shrink-0 text-[#bbcccc] transition group-hover:translate-x-1 group-hover:text-[#389c8a]" /></button>; })}
      </div>
    </div>
    <div className="mt-9 grid gap-3 border-t border-[#e2eaea] pt-6 sm:grid-cols-3">
      <InfoItem icon={CircleHelp} title="질문 입력" body="업무 상황을 자연어로 질문" />
      <InfoItem icon={BookOpenText} title="근거 확인" body="매뉴얼 PDF 페이지와 원문 연결" />
      <InfoItem icon={ArrowDown} title="업무 연결" body="관련 기능이 준비되면 URL 연결" />
    </div>
  </div>;
}

function InfoItem({ icon: Icon, title, body }: { icon: typeof CircleHelp; title: string; body: string }) {
  return <div className="flex items-start gap-2.5"><Icon size={17} className="mt-0.5 shrink-0 text-[#52a493]" /><div><div className="text-xs font-bold text-[#506a6f]">{title}</div><div className="mt-0.5 text-[11px] leading-5 text-[#8a9b9e]">{body}</div></div></div>;
}

function formatEvidenceHeading(section: string, referenceLabel: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^0-9a-z가-힣]/g, "");
  return normalize(section).includes(normalize(referenceLabel))
    ? section
    : `${section} · ${referenceLabel}`;
}

function UserBubble({ text }: { text: string }) {
  return <div className="flex justify-end"><div className="max-w-[82%] rounded-[18px] rounded-tr-[5px] bg-[#1c8d7a] px-5 py-4 text-[16px] leading-7 whitespace-pre-wrap text-white shadow-[0_5px_14px_rgba(21,127,107,0.1)]">{text}</div></div>;
}

function AnswerBubble({ message }: { message: AnswerMessage }) {
  const result = message.result;
  const relatedEvidence = result.relatedEvidence ?? [];
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(0);
  const visibleEvidence = [
    ...result.evidence,
    ...relatedEvidence.slice(0, visibleRelatedCount),
  ];
  const hasMoreEvidence = visibleRelatedCount < relatedEvidence.length;
  const isGptAnswer = result.answerMode === "gpt";
  const targetUrl = result.topic ? getIntegrationUrl(result.topic) : undefined;
  return <div className="flex items-start gap-3 sm:gap-4">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e0f3ee] text-[#168f78]"><ShieldCheck size={19} /></div>
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-bold text-[#1e4046]">{result.status === "not_found" ? "직접 근거 없음" : isGptAnswer ? "AI 근거 답변" : "근거 검색 결과"}</span>
        <span className="rounded-full bg-[#eaf3ff] px-2.5 py-1 text-[11px] font-bold text-[#245899]">{result.status === "not_found" ? "담당 부서 확인 필요" : isGptAnswer ? "AI 답변" : "검색 모드"}</span>
      </div>
      <div className="rounded-2xl rounded-tl-[5px] border border-[#e1e9e9] bg-white p-5 shadow-[0_3px_12px_rgba(29,70,71,0.035)] sm:p-6">
        <p className="whitespace-pre-wrap text-[16px] leading-8 text-[#304b51]">{result.message}</p>
        {result.outOfScopeNotice && <div className="mt-4 rounded-xl border border-[#ead9a9] bg-[#fff9e9] px-4 py-3 text-[13px] leading-6 text-[#715d28]"><span className="font-bold">범위 밖 요청</span><span className="ml-2">{result.outOfScopeNotice}</span></div>}
        {result.keyPoints.length > 0 && <div className="mt-5 rounded-xl border border-[#c9dcf4] bg-[#f1f7ff] p-5 sm:p-6">
          <div className="text-[14px] font-bold tracking-[0.03em] text-[#245899]">핵심 내용</div>
          <ul className="mt-4 space-y-3">
            {result.keyPoints.map((point) => <li key={`${point.text}-${point.evidenceIds.join("-")}`} className="flex gap-3 text-[15px] leading-7 text-[#294b65]"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3274ba]" /><span>{point.text} <span className="whitespace-nowrap font-bold text-[#245899]">{point.evidenceIds.map((id) => `[근거 ${id}]`).join(" ")}</span></span></li>)}
          </ul>
        </div>}
        {result.evidence.length > 0 && <div className="mt-5 border-t border-[#ecf0f0] pt-5">
          <div className="mb-4 flex items-center gap-2 text-[14px] font-bold text-[#3d6267]"><BookOpenText size={18} className="text-[#218d7a]" /> 근거자료 내용</div>
          <div className="space-y-3">
            {visibleEvidence.map((item, index) => <details key={`${item.sourceTitle}-${item.pdfPage}-${item.section}`} className="group rounded-xl border border-[#d8e6e5] bg-[#f8fbfa]">
              <summary className="flex cursor-pointer list-none items-start gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f3f0] text-[#4b9b8a]"><FileQuestion size={17} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-[#e4f2ee] px-2 py-0.5 text-[11px] font-bold text-[#247665]">근거 {index + 1}</span><span className="text-[14px] font-bold text-[#385c62]">{formatEvidenceHeading(item.section, item.referenceLabel ?? `PDF ${item.pdfPage}쪽`)}</span></div>
                  <div className="mt-1.5 text-[12px] text-[#718b8f]">{item.sourceTitle}{item.sourcePublisher ? ` · ${item.sourcePublisher}` : ""}{item.sourceDate ? ` · ${item.sourceDate}` : ""}</div>
                  <div className="mt-2 text-[12px] font-semibold text-[#43877b]">근거 원문 펼치기</div>
                </div>
                <ChevronDown size={18} className="mt-1 shrink-0 text-[#6f9290] transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-[#e2ecea] px-4 pb-4 pt-3 sm:pl-[60px]">
                <p className="rounded-lg bg-white px-4 py-3 text-[14px] leading-7 text-[#405f65]">{item.excerpt}</p>
                {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1e806f] hover:underline">공식 원문 열기 <ExternalLink size={14} /></a> : <span className="mt-3 inline-flex text-[12px] font-semibold text-[#74898d]">첨부자료 원문 {item.referenceLabel ?? `PDF ${item.pdfPage}쪽`} 확인</span>}
              </div>
            </details>)}
          </div>
          {relatedEvidence.length > 0 && <div className="mt-4 rounded-xl border border-[#d8e6e5] bg-[#f4f9f8] px-4 py-3">
            <p className="text-[13px] leading-6 text-[#5d7579]">{visibleRelatedCount === 0 ? "관련 근거자료가 더 있습니다. 추가로 확인하시겠어요?" : hasMoreEvidence ? "관련성이 높은 자료부터 추가로 표시했습니다." : "관련 근거자료를 모두 표시했습니다."}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {hasMoreEvidence && <button type="button" onClick={() => setVisibleRelatedCount((count) => Math.min(count + 3, relatedEvidence.length))} className="inline-flex items-center gap-1.5 rounded-lg border border-[#b9dcd5] bg-white px-3 py-2 text-[12px] font-bold text-[#1e806f] transition hover:bg-[#e9f6f2]">관련 자료 더 보기 <ArrowDown size={14} /></button>}
              {visibleRelatedCount > 0 && <button type="button" onClick={() => setVisibleRelatedCount(0)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-[#71878b] transition hover:bg-white">추가 자료 접기 <ArrowUp size={14} /></button>}
            </div>
          </div>}
        </div>}
        {targetUrl && result.topic && <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#b9dcd5] bg-[#f0f9f6] px-3.5 py-2 text-xs font-bold text-[#1e866f] transition hover:bg-[#e0f3ed]">{integrationLabels[result.topic]} 열기 <ExternalLink size={13} /></a>}
      </div>
      <p className="mt-3 text-[12px] leading-6 text-[#7f9498]">{isGptAnswer ? "AI가 표시된 근거자료를 바탕으로 작성했습니다." : "AI 연결 전 검색 답변입니다."} 내용·숫자·기한은 원문과 현행 기준을 확인해 주세요.</p>
    </div>
  </div>;
}

function LoadingBubble({ aiEnabled }: { aiEnabled: boolean }) {
  return <div role="status" aria-live="polite" className="flex items-start gap-3 sm:gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e0f3ee] text-[#168f78]"><ShieldCheck size={19} /></div><div className="rounded-2xl border border-[#e1e9e9] bg-white px-5 py-4 text-sm text-[#647e82]"><span className="mr-2 inline-flex gap-1 align-middle"><i className="loading-dot" /><i className="loading-dot" /><i className="loading-dot" /></span>{aiEnabled ? "근거자료를 찾고 AI 답변을 준비하고 있습니다..." : "질문과 직접 관련된 근거자료를 찾고 있습니다..."}</div></div>;
}

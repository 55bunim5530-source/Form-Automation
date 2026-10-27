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
import { evidenceParagraphs } from "@/features/chatbot/lib/evidence-format";
import { recommendFollowUps, type FollowUpModule, type FollowUpRecommendation } from "@/features/chatbot/lib/action-recommendations";
import {
  quickTopics,
} from "@/features/chatbot/lib/demo-data";

type AnswerMessage = {
  id: number;
  kind: "answer";
  answerId: string;
  question: string;
  result: SearchResponse;
};

type UserMessage = { id: number; kind: "user"; text: string };
type Message = UserMessage | AnswerMessage;

const SHELL_ORIGIN = "http://127.0.0.1:8080";
const SHELL_ORIGINS = [SHELL_ORIGIN, "http://localhost:8080"];
const SHELL_URL = `${SHELL_ORIGIN}/shell/app.html`;
type ActionName = "navigate" | "work-register" | "schedule-preview" | "schedule-save";
type ScheduleDraft = {
  draftId: string;
  title: string;
  date: string;
  target: string;
  memo: string;
  sourceQuestion: string;
  evidence: unknown[];
  legalStatus: string;
};
type ActionResult = {
  version: 1;
  requestId: string;
  action: ActionName;
  ok: boolean;
  result?: {
    draft?: ScheduleDraft;
    missing?: string[];
    status?: "saved" | "already-saved" | "duplicate";
    registrationType?: "situation" | "schedule" | "choose";
    taskId?: string;
    matches?: unknown[];
  };
  error?: string;
};
type ParentReply = { type: "safety:assistant-action-result"; requestId: string; [key: string]: unknown };
type PendingReply = { resolve: (reply: ParentReply) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

function needsLegalContext(question: string): boolean {
  const normalized = question.toLowerCase().normalize("NFKC").replace(/\s+/gu, "");
  return /(?:법령|법정|법률|법적|법에따라|산업안전보건법|중대재해처벌법|제\d+조|시행령|시행규칙|고시|의무|적용대상|기한|주기|반기|연간|매년|몇(?:회|번|년|개월|시간)|얼마나자주|언제까지|언제해야|며칠(?:내|이내)|과태료)/u.test(normalized);
}

function isTrustedShellMessage(event: MessageEvent): boolean {
  return window.parent !== window && event.source === window.parent && SHELL_ORIGINS.some((origin) => origin === event.origin);
}

function postToShell(message: Record<string, unknown>): void {
  // Only the origin that actually hosts the parent window can receive this.
  for (const origin of SHELL_ORIGINS) window.parent.postMessage(message, origin);
}

function integratedUrl(item: FollowUpRecommendation): string {
  const url = new URL(SHELL_URL);
  url.searchParams.set("module", item.module);
  if (item.kind === "register") url.searchParams.set("register", "choose");
  if (item.module === "forms" && item.formId) url.searchParams.set("formId", item.formId);
  return url.toString();
}

function statedDate(question: string): string {
  if (/다음\s*달\s*(?:첫|1)\s*(?:평일|영업일)/u.test(question)) {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    while (first.getDay() === 0 || first.getDay() === 6) first.setDate(first.getDate() + 1);
    return `${first.getFullYear()}-${String(first.getMonth() + 1).padStart(2, "0")}-${String(first.getDate()).padStart(2, "0")}`;
  }
  const match = question.match(/(?:^|\D)(\d{4})\s*(?:년\s*|[-./])\s*(\d{1,2})\s*(?:월\s*|[-./])\s*(\d{1,2})\s*(?:일)?(?:\D|$)/u);
  if (!match) return "";
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) return "";
  return `${yearText}-${monthText.padStart(2, "0")}-${dayText.padStart(2, "0")}`;
}

function statedScheduleTitle(question: string, topic: string): string {
  if (/정기\s*점검/u.test(question)) return "정기점검";
  if (/합동\s*점검/u.test(question)) return "합동점검";
  if (/안전보건\s*협의체/u.test(question)) return "안전보건협의체 회의";
  return topic === "risk" ? "위험성평가 업무" : "산업안전보건 업무 일정";
}

function statedTarget(question: string): string {
  const match = question.match(/대상(?:은|:|으로)\s*([^,.?;\n]{2,80})/u);
  const candidate = match?.[1]?.split(/(?:이고|이며|인데|날짜는|일정은|실시일은)/u)[0]?.replace(/(?:입니다|이에요|예요)$/u, "").trim() ?? "";
  if (!candidate || /(?:누구|무엇|어떤|어디|해당|인가요|하나요|나요|까요|왜)/u.test(candidate)) return "";
  return candidate;
}

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
  const pendingRepliesRef = useRef(new Map<string, PendingReply>());
  const acceptedMessageIdsRef = useRef(new Set<string>());
  const previousContextRef = useRef<SearchResponse["context"]>(undefined);
  const idRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => () => {
    requestRef.current?.abort();
    for (const pending of pendingRepliesRef.current.values()) {
      clearTimeout(pending.timer);
      pending.reject(new Error("통합 화면 연결이 종료되었습니다."));
    }
    pendingRepliesRef.current.clear();
  }, []);

  function requestParent(type: "safety:assistant-action", payload: Record<string, unknown>): Promise<ParentReply> {
    if (!embedded || window.parent === window) return Promise.reject(new Error("통합 화면에서만 사용할 수 있습니다."));
    const requestId = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pendingRepliesRef.current.delete(requestId);
        reject(new Error("통합 화면의 응답이 지연되고 있습니다. 다시 시도해 주세요."));
      }, payload.action === "work-register" ? 70_000 : 12_000);
      pendingRepliesRef.current.set(requestId, { resolve, reject, timer });
      postToShell({ type, version: 1, requestId, ...payload });
    });
  }

  async function sendAction(action: ActionName, payload: Record<string, unknown>): Promise<ActionResult> {
    const reply = await requestParent("safety:assistant-action", { action, ...payload });
    if (reply.type !== "safety:assistant-action-result" || reply.action !== action || reply.version !== 1 || typeof reply.ok !== "boolean") {
      throw new Error("통합 화면의 응답 형식이 올바르지 않습니다.");
    }
    return reply as unknown as ActionResult;
  }

  useEffect(() => {
    const receiveReply = (event: MessageEvent) => {
      if (!isTrustedShellMessage(event)) return;
      const reply = event.data as ParentReply;
      if (reply?.type !== "safety:assistant-action-result") return;
      if (typeof reply.requestId !== "string") return;
      const pending = pendingRepliesRef.current.get(reply.requestId);
      if (!pending) return;
      clearTimeout(pending.timer);
      pendingRepliesRef.current.delete(reply.requestId);
      pending.resolve(reply);
    };
    window.addEventListener("message", receiveReply);
    return () => window.removeEventListener("message", receiveReply);
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
      if (controller.signal.aborted) return;
      const response = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, previousContext: previousContextRef.current }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("검색 요청에 실패했습니다.");
      const result = (await response.json()) as SearchResponse;
      if (controller.signal.aborted) return;
      previousContextRef.current = result.context;
      idRef.current += 1;
      setMessages((current) => [
        ...current,
        { id: idRef.current, kind: "answer", answerId: crypto.randomUUID(), question, result },
      ]);
    } catch {
      if (!controller.signal.aborted) {
        idRef.current += 1;
        setMessages((current) => [...current, { id: idRef.current, kind: "answer", answerId: crypto.randomUUID(), question, result: { status: "not_found", message: "검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", keyPoints: [], sourceTitle: "", sourceDate: "", evidence: [] } }]);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
      if (requestRef.current === controller) requestRef.current = null;
    }
  }

  useEffect(() => {
    const receiveTaskQuestion = (event: MessageEvent) => {
      if (!embedded || !isTrustedShellMessage(event) || event.data?.type !== "safety:ask-task") return;
      const messageId = String(event.data.messageId || "");
      if (messageId) {
        postToShell({ type: "safety:message-accepted", module: "chatbot", messageId });
        if (acceptedMessageIdsRef.current.has(messageId)) return;
        acceptedMessageIdsRef.current.add(messageId);
      }
      const question = String(event.data.question || "").trim();
      if (!question) return;
      setInput(question);
      textareaRef.current?.focus();
      if (!loading) void sendQuestion(question);
    };
    window.addEventListener("message", receiveTaskQuestion);
    return () => window.removeEventListener("message", receiveTaskQuestion);
  }, [embedded, loading]);

  useEffect(() => {
    // Register the message listener first so the parent cannot flush a queued
    // task question before this frame is ready to receive it.
    if (embedded && window.parent !== window) postToShell({ type: "safety:module-ready", module: "chatbot" });
  }, [embedded]);

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
                  {messages.map((message) => message.kind === "user" ? <UserBubble key={message.id} text={message.text} /> : <AnswerBubble key={message.id} message={message} embedded={embedded} sendAction={sendAction} />)}
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
      <InfoItem icon={ArrowDown} title="업무 연결" body="답변 후 관련 업무 등록 화면 연결" />
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

function AnswerBubble({ message, embedded, sendAction }: { message: AnswerMessage; embedded: boolean; sendAction: (action: ActionName, payload: Record<string, unknown>) => Promise<ActionResult> }) {
  const result = message.result;
  const lawVerification = (result as SearchResponse & { lawVerification?: { status: "verified" | "unavailable"; reason?: string } }).lawVerification;
  const relatedEvidence = result.relatedEvidence ?? [];
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(0);
  const visibleEvidence = [
    ...result.evidence.map((item, index) => ({ item, label: `근거 ${index + 1}` })),
    ...relatedEvidence.slice(0, visibleRelatedCount).map((item) => ({ item, label: "추가 자료" })),
  ];
  const hasMoreEvidence = visibleRelatedCount < relatedEvidence.length;
  const isGptAnswer = result.answerMode === "gpt";
  const isAppHelp = result.sourceTitle === "프로그램 기능 안내";
  const isClarification = result.status === "not_found" && /^-?\s*어떤\s*점검/u.test(result.message);
  const isOutOfScope = result.status === "not_found" && /지원\s*범위가\s*아닙니다/u.test(result.message);
  const answerLines = result.message.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  const answerBullets = answerLines.length > 0 && answerLines.every((line) => line.startsWith("- "))
    ? answerLines.map((line) => line.slice(2))
    : [];
  const recommendations = recommendFollowUps(message.question, result);
  return <div className="flex items-start gap-3 sm:gap-4">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e0f3ee] text-[#168f78]"><ShieldCheck size={19} /></div>
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-bold text-[#1e4046]">{result.status === "not_found" ? "직접 근거 없음" : isGptAnswer ? "AI 근거 답변" : "근거 검색 결과"}</span>
        <span className="rounded-full bg-[#eaf3ff] px-2.5 py-1 text-[11px] font-bold text-[#245899]">{isClarification ? "질문 확인" : isOutOfScope ? "지원 범위 안내" : result.status === "not_found" ? "담당 부서 확인 필요" : isAppHelp ? "프로그램 사용법" : isGptAnswer ? "AI 답변" : "근거자료 안내"}</span>
      </div>
      <div className="rounded-2xl rounded-tl-[5px] border border-[#e1e9e9] bg-white p-5 shadow-[0_3px_12px_rgba(29,70,71,0.035)] sm:p-6">
        {answerBullets.length > 0
          ? <ul className="list-disc space-y-2 pl-5 text-[16px] leading-7 text-[#304b51] marker:text-[#168f78]">
            {answerBullets.map((bullet, index) => <li key={`${index}-${bullet}`}>{bullet}</li>)}
          </ul>
          : <p className="whitespace-pre-wrap text-[16px] leading-8 text-[#304b51]">{result.message}</p>}
        {!isAppHelp && (lawVerification?.status === "verified" || needsLegalContext(message.question)) && <p className={`mt-3 rounded-lg px-3 py-2 text-[12px] leading-5 ${lawVerification?.status === "verified" ? "bg-[#eef8f2] text-[#24694c]" : "bg-[#fff7e8] text-[#795f28]"}`}>{lawVerification?.status === "verified" ? "국가법령정보센터 API 원문 조회 성공 · 실제 적용 조건은 별도로 확인하세요." : `국가법령정보센터 API 원문 확인 불가${lawVerification?.reason ? `: ${lawVerification.reason}` : " · 법정 기한·대상·주기를 확정하지 않습니다."}`}</p>}
        {isAppHelp && needsLegalContext(message.question) && <p className="mt-3 rounded-lg bg-[#fff7e8] px-3 py-2 text-[12px] leading-5 text-[#795f28]">이 답변은 프로그램 사용법 안내입니다. 실제 법정 의무·기한은 해당 법령 원문에서 확인해 주세요.</p>}
        {result.outOfScopeNotice && <div className="mt-4 rounded-xl border border-[#ead9a9] bg-[#fff9e9] px-4 py-3 text-[13px] leading-6 text-[#715d28]"><span className="font-bold">범위 밖 요청</span><span className="ml-2">{result.outOfScopeNotice}</span></div>}
        {recommendations.length > 0 && <FollowUpActions message={message} recommendations={recommendations} embedded={embedded} sendAction={sendAction} />}
        {result.keyPoints.length > 0 && !(isGptAnswer && answerBullets.length > 0) && <div className="mt-5 rounded-xl border border-[#c9dcf4] bg-[#f1f7ff] p-5 sm:p-6">
          <div className="text-[14px] font-bold tracking-[0.03em] text-[#245899]">핵심 내용</div>
          <ul className="mt-4 space-y-3">
            {result.keyPoints.map((point) => <li key={`${point.text}-${point.evidenceIds.join("-")}`} className="flex gap-3 text-[15px] leading-7 text-[#294b65]"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3274ba]" /><span>{point.text} <span className="whitespace-nowrap font-bold text-[#245899]">{point.evidenceIds.map((id) => `[근거 ${id}]`).join(" ")}</span></span></li>)}
          </ul>
        </div>}
        {result.evidence.length > 0 && <div className="mt-5 border-t border-[#ecf0f0] pt-5">
          <div className="mb-4 flex items-center gap-2 text-[14px] font-bold text-[#3d6267]"><BookOpenText size={18} className="text-[#218d7a]" /> 근거자료 내용</div>
          <div className="space-y-3">
            {visibleEvidence.map(({ item, label }) => <details key={`${item.sourceTitle}-${item.pdfPage}-${item.section}`} className="group rounded-xl border border-[#d8e6e5] bg-[#f8fbfa]">
              <summary className="flex cursor-pointer list-none items-start gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f3f0] text-[#4b9b8a]"><FileQuestion size={17} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-[#e4f2ee] px-2 py-0.5 text-[11px] font-bold text-[#247665]">{label}</span><span className="text-[14px] font-bold text-[#385c62]">{formatEvidenceHeading(item.section, item.referenceLabel ?? `PDF ${item.pdfPage}쪽`)}</span></div>
                  <div className="mt-1.5 text-[12px] text-[#718b8f]">{item.sourceTitle}{item.sourcePublisher ? ` · ${item.sourcePublisher}` : ""}{item.sourceDate ? ` · ${item.sourcePublisher === "법제처 국가법령정보센터" ? "시행일" : "발행일"} ${item.sourceDate}` : " · 발행일 미표기"}</div>
                  {item.fetchedAt && <div className="mt-1 text-[12px] text-[#718b8f]">조회 시각: {new Date(item.fetchedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</div>}
                  <div className="mt-2 text-[12px] font-semibold text-[#43877b]">근거 원문 펼치기</div>
                </div>
                <ChevronDown size={18} className="mt-1 shrink-0 text-[#6f9290] transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-[#e2ecea] px-4 pb-4 pt-3 sm:pl-[60px]">
                <div className="space-y-3 rounded-lg bg-white px-4 py-3 text-[14px] leading-7 text-[#405f65]">
                  {evidenceParagraphs(item.excerpt, item.sourcePublisher === "법제처 국가법령정보센터").map((paragraph, paragraphIndex) =>
                    <p key={paragraphIndex} className={`whitespace-pre-line break-words ${paragraphIndex === 0 && item.sourcePublisher === "법제처 국가법령정보센터" ? "font-semibold text-[#294d58]" : ""}`}>{paragraph}</p>)}
                </div>
                {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1e806f] hover:underline">공식 원문 열기 <ExternalLink size={14} /></a> : <span className="mt-3 inline-flex text-[12px] font-semibold text-[#74898d]">첨부자료 원문 {item.referenceLabel ?? `PDF ${item.pdfPage}쪽`} 확인</span>}
              </div>
            </details>)}
          </div>
          {relatedEvidence.length > 0 && <div className="mt-4 rounded-xl border border-[#d8e6e5] bg-[#f4f9f8] px-4 py-3">
            <p className="text-[13px] leading-6 text-[#5d7579]">{visibleRelatedCount === 0 ? "관련 근거자료가 더 있습니다. 추가로 확인하시겠어요?" : hasMoreEvidence ? "추가 자료를 출처 우선순위와 발행일 순으로 표시했습니다." : "관련 근거자료를 모두 표시했습니다."}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {hasMoreEvidence && <button type="button" onClick={() => setVisibleRelatedCount((count) => Math.min(count + 3, relatedEvidence.length))} className="inline-flex items-center gap-1.5 rounded-lg border border-[#b9dcd5] bg-white px-3 py-2 text-[12px] font-bold text-[#1e806f] transition hover:bg-[#e9f6f2]">관련 자료 더 보기 <ArrowDown size={14} /></button>}
              {visibleRelatedCount > 0 && <button type="button" onClick={() => setVisibleRelatedCount(0)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold text-[#71878b] transition hover:bg-white">추가 자료 접기 <ArrowUp size={14} /></button>}
            </div>
          </div>}
        </div>}
      </div>
      <p className="mt-3 text-[12px] leading-6 text-[#7f9498]">{isGptAnswer ? "AI가 표시된 근거자료를 바탕으로 작성했습니다." : "내장 근거자료 검색 결과입니다."} 내용·숫자·기한은 원문과 현행 기준을 확인해 주세요.</p>
    </div>
  </div>;
}

function FollowUpActions({ message, recommendations, embedded, sendAction }: {
  message: AnswerMessage;
  recommendations: FollowUpRecommendation[];
  embedded: boolean;
  sendAction: (action: ActionName, payload: Record<string, unknown>) => Promise<ActionResult>;
}) {
  const [dismissed, setDismissed] = useState<FollowUpModule[]>([]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<ScheduleDraft | null>(null);
  const [draftTopic, setDraftTopic] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [matches, setMatches] = useState<unknown[]>([]);
  const [duplicate, setDuplicate] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const inShell = embedded && typeof window !== "undefined" && window.parent !== window;
  const officialEvidence = message.result.evidence.filter((item) => item.sourcePublisher === "법제처 국가법령정보센터");
  const sourceEvidence = message.result.evidence.filter((item) => item.sourcePublisher !== "법제처 국가법령정보센터");
  const evidence = [...officialEvidence, ...sourceEvidence.slice(0, officialEvidence.length ? 2 : 3)].slice(0, 4).map((item) => ({
    title: `${item.sourceTitle} · ${item.referenceLabel ?? `PDF ${item.pdfPage}쪽`}`.slice(0, 160),
    excerpt: item.excerpt.slice(0, 300),
    url: item.url?.slice(0, 300),
  }));

  function decline(module: FollowUpModule) {
    setDismissed((current) => [...current, module]);
    setDraft(null);
    setMatches([]);
    setDuplicate(false);
    setError("");
    setNotice("");
  }

  async function navigate(target: FollowUpRecommendation | FollowUpModule) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const reply = await sendAction("navigate", {
        answerId: message.answerId,
        module: typeof target === "string" ? target : target.module,
        ...(typeof target !== "string" && target.formId ? { formId: target.formId } : {}),
      });
      if (!reply.ok) throw new Error(reply.error || "화면을 열지 못했습니다.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "화면 연결에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function openWorkRegistration(topic: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("AI가 업무에 맞는 등록 메뉴를 선택하고 있습니다.");
    try {
      const reply = await sendAction("work-register", {
        answerId: message.answerId,
        module: "work",
        question: message.question.slice(0, 500),
        topic: topic.slice(0, 80),
        answer: message.result.message.slice(0, 800),
      });
      if (!reply.ok) throw new Error(reply.error || "등록 화면을 열지 못했습니다.");
      setNotice(reply.result?.registrationType === "choose"
        ? "AI 연결을 확인하지 못해 업무 등록 메뉴를 열었습니다. 상황 등록 또는 일정 추가를 선택해 주세요."
        : "선택된 등록 화면을 열었습니다. 내용을 확인한 뒤 저장해 주세요.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "등록 화면 연결에 실패했습니다.");
      setNotice("");
    } finally {
      setBusy(false);
    }
  }

  async function preview(topic: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const reply = await sendAction("schedule-preview", {
        answerId: message.answerId,
        module: "work",
        question: message.question,
        topic,
        evidence,
        draft: {
          title: statedScheduleTitle(message.question, topic),
          date: statedDate(message.question),
          target: statedTarget(message.question),
          sourceQuestion: message.question,
          evidence,
          legalStatus: message.result.lawVerification?.status === "verified" ? "법령 원문 조회 확인 · 적용 여부 별도 확인" : "별도 확인 필요",
        },
      });
      if (!reply.ok) throw new Error(reply.error || "일정 초안을 만들지 못했습니다.");
      const candidate = reply.result?.draft;
      if (!candidate || typeof candidate.draftId !== "string" || typeof candidate.title !== "string") {
        throw new Error("일정 초안의 형식이 올바르지 않습니다.");
      }
      setDraft({
        draftId: candidate.draftId,
        title: candidate.title,
        date: typeof candidate.date === "string" ? candidate.date : "",
        target: typeof candidate.target === "string" ? candidate.target : "",
        memo: typeof candidate.memo === "string" ? candidate.memo : "",
        sourceQuestion: typeof candidate.sourceQuestion === "string" ? candidate.sourceQuestion : message.question,
        evidence: Array.isArray(candidate.evidence) ? candidate.evidence : evidence,
        legalStatus: typeof candidate.legalStatus === "string" ? candidate.legalStatus : "unavailable",
      });
      setDraftTopic(topic);
      setMissing(Array.isArray(reply.result?.missing) ? reply.result.missing.filter((item): item is string => typeof item === "string") : []);
      setMatches([]);
      setDuplicate(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "일정 초안을 확인하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function register(confirmDuplicate = false) {
    if (busy || !draft || saved) return;
    setBusy(true);
    setError("");
    try {
      const reply = await sendAction("schedule-save", {
        answerId: message.answerId,
        module: "work",
        question: message.question,
        topic: draftTopic,
        evidence,
        draft,
        confirmDuplicate,
      });
      if (!reply.ok) throw new Error(reply.error || "일정을 저장하지 못했습니다.");
      if (reply.result?.status === "duplicate") {
        setMatches(Array.isArray(reply.result.matches) ? reply.result.matches : []);
        setDuplicate(true);
        setNotice("비슷한 일정이 있습니다. 기존 일정을 확인한 뒤 중복 등록 여부를 선택해 주세요.");
        return;
      }
      if (reply.result?.status !== "saved" && reply.result?.status !== "already-saved") {
        throw new Error("일정 저장 결과를 확인할 수 없습니다.");
      }
      setSaved(true);
      setMatches([]);
      setDuplicate(false);
      setNotice(reply.result.status === "already-saved" ? "이 답변에서 이미 등록한 일정입니다. 중복 저장하지 않았습니다." : "일정을 저장하고 일정·업무관리 화면을 열었습니다.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "일정 저장에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="mt-5 space-y-3 border-t border-[#e3eeee] pt-5" aria-label="답변 후 관련 업무 연결">
    {!inShell && <div className="rounded-xl border border-[#c9dcf4] bg-[#f1f7ff] px-4 py-3 text-[12px] leading-5 text-[#294b65]">단독 창에서는 화면을 직접 연결할 수 없습니다. 통합 화면에서 업무 등록 메뉴를 선택해 주세요.</div>}
    {recommendations.filter((item) => !dismissed.includes(item.module)).map((item) => <div key={item.module} className="rounded-xl border border-[#d7e8e4] bg-[#f7fbfa] px-4 py-3">
      <p className="text-[13px] font-semibold leading-6 text-[#365960]">{item.question}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {inShell ? <button type="button" disabled={busy || saved} onClick={() => item.kind === "register" ? void openWorkRegistration(item.topic) : void navigate(item)} className="rounded-lg bg-[#138a76] px-3 py-2 text-[12px] font-bold text-white transition hover:bg-[#0d7463] disabled:opacity-50">{busy ? "등록 화면 연결 중..." : `예 · ${item.buttonLabel}`}</button>
          : <a href={integratedUrl(item)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#138a76] px-3 py-2 text-[12px] font-bold text-white">통합 화면 열기 <ExternalLink size={13} /></a>}
        <button type="button" disabled={busy} onClick={() => decline(item.module)} className="rounded-lg border border-[#cfdedb] bg-white px-3 py-2 text-[12px] font-bold text-[#536f73] disabled:opacity-50">아니요</button>
      </div>
    </div>)}
    {draft && !saved && <form onSubmit={(event) => { event.preventDefault(); void register(); }} className="space-y-3 rounded-xl border border-[#b9dcd5] bg-white p-4">
      <div className="text-[13px] font-bold text-[#1e806f]">일정 초안 확인</div>
      {missing.length > 0 && <p className="text-[12px] leading-5 text-[#805d21]">등록 전에 필요한 정보: {missing.map((field) => ({ title: "업무명", date: "실시 날짜", target: "대상" } as Record<string, string>)[field] || field).join(" · ")}</p>}
      <label className="block text-[12px] font-semibold text-[#536f73]">업무명<input aria-label="일정 업무명" required maxLength={120} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-1 w-full rounded-lg border border-[#cfdedb] px-3 py-2 text-sm text-[#263f44]" /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-[12px] font-semibold text-[#536f73]">실시 날짜<input aria-label="일정 실시 날짜" type="date" required value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} className="mt-1 w-full rounded-lg border border-[#cfdedb] px-3 py-2 text-sm text-[#263f44]" /></label>
        <label className="block text-[12px] font-semibold text-[#536f73]">대상<input aria-label="일정 대상" required maxLength={120} value={draft.target} onChange={(event) => setDraft({ ...draft, target: event.target.value })} placeholder="예: 급식실 근로자" className="mt-1 w-full rounded-lg border border-[#cfdedb] px-3 py-2 text-sm text-[#263f44]" /></label>
      </div>
      <label className="block text-[12px] font-semibold text-[#536f73]">메모<textarea aria-label="일정 메모" maxLength={2000} rows={3} value={draft.memo} onChange={(event) => setDraft({ ...draft, memo: event.target.value })} className="mt-1 w-full rounded-lg border border-[#cfdedb] px-3 py-2 text-sm text-[#263f44]" /></label>
      <p className="text-[11px] leading-5 text-[#7c8f92]">입력한 날짜는 담당자가 지정한 관리 일정입니다. 법정 기한·대상·주기는 확인된 법령 원문과 적용 조건에 따라 별도로 판단해야 합니다.</p>
      {duplicate && <div className="rounded-lg border border-[#f0d9ac] bg-[#fff9ed] px-3 py-2 text-[12px] text-[#715d28]">
        <p className="font-bold">기존 유사 일정 {matches.length}건을 먼저 확인해 주세요.</p>
        {matches.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-4">{matches.slice(0, 5).map((entry, index) => {
          const match = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
          return <li key={typeof match.taskId === "string" ? match.taskId : index}>{String(match.title || "이름 없는 일정")} · {String(match.date || "날짜 미확인")}{match.target ? ` · ${String(match.target)}` : ""}</li>;
        })}</ul>}
        <button type="button" disabled={busy} onClick={() => void navigate("work")} className="mt-2 rounded-lg border border-[#c9a96b] bg-white px-3 py-1.5 font-bold text-[#715d28] disabled:opacity-50">일정·업무관리에서 보기</button>
      </div>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy || duplicate} className="rounded-lg bg-[#138a76] px-3 py-2 text-[12px] font-bold text-white disabled:opacity-50">등록</button>
        {duplicate && <button type="button" disabled={busy} onClick={() => void register(true)} className="rounded-lg border border-[#c9a96b] bg-[#fff9ed] px-3 py-2 text-[12px] font-bold text-[#715d28] disabled:opacity-50">중복임을 확인하고 등록</button>}
        <button type="button" disabled={busy} onClick={() => decline("work")} className="rounded-lg border border-[#cfdedb] bg-white px-3 py-2 text-[12px] font-bold text-[#536f73] disabled:opacity-50">취소</button>
      </div>
    </form>}
    {notice && <p role="status" className="text-[12px] leading-5 text-[#27675f]">{notice}</p>}
    {error && <p role="alert" className="text-[12px] leading-5 text-[#ad3e36]">{error}</p>}
  </div>;
}

function LoadingBubble({ aiEnabled }: { aiEnabled: boolean }) {
  return <div role="status" aria-live="polite" className="flex items-start gap-3 sm:gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e0f3ee] text-[#168f78]"><ShieldCheck size={19} /></div><div className="rounded-2xl border border-[#e1e9e9] bg-white px-5 py-4 text-sm text-[#647e82]"><span className="mr-2 inline-flex gap-1 align-middle"><i className="loading-dot" /><i className="loading-dot" /><i className="loading-dot" /></span>{aiEnabled ? "근거자료를 찾고 AI 답변을 준비하고 있습니다..." : "질문과 직접 관련된 근거자료를 찾고 있습니다..."}</div></div>;
}

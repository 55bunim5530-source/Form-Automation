import type { Metadata } from "next";
import { connection } from "next/server";
import { ChatWorkspace } from "@/features/chatbot/components/chat-workspace";

export const metadata: Metadata = {
  title: "학교 산업안전보건 AI 챗봇",
  description: "학교 산업안전보건 자료에서 직접 근거를 찾아 안내하는 AI 챗봇",
};

async function isAiConfigured(): Promise<boolean> {
  try {
    const baseUrl = process.env.INTERNAL_API_BASE_URL?.trim() || "http://127.0.0.1:8080";
    const response = await fetch(new URL("/api/ai/status", baseUrl), {
      cache: "no-store",
      signal: AbortSignal.timeout(2_000),
    });
    if (!response.ok) return false;
    const status = await response.json() as { features?: { chatbot?: { configured?: boolean } } };
    return status.features?.chatbot?.configured === true;
  } catch {
    return false;
  }
}

export default async function ChatbotPage({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const aiEnabled = await isAiConfigured();
  return <ChatWorkspace aiEnabled={aiEnabled} embedded={params.embed === "1"} />;
}

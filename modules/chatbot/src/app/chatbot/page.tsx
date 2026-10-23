import type { Metadata } from "next";
import { connection } from "next/server";
import { ChatWorkspace } from "@/features/chatbot/components/chat-workspace";

export const metadata: Metadata = {
  title: "학교 산업안전보건 AI 챗봇",
  description: "학교 산업안전보건 자료에서 직접 근거를 찾아 안내하는 AI 챗봇",
};

export default async function ChatbotPage({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const aiEnabled = Boolean(process.env.OPENAI_API_KEY?.trim());
  return <ChatWorkspace aiEnabled={aiEnabled} embedded={params.embed === "1"} />;
}

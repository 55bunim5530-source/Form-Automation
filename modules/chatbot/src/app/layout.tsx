import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "학교 산업안전보건 업무 지원",
  description: "학교 산업안전보건 업무 기능을 한곳에서 제공하는 통합 서비스",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Memo",
  description: "Record and study English sentences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="text-lg font-semibold tracking-tight text-teal-800">
              English Memo
            </Link>
            <span className="text-sm text-stone-500">영어 문장 기록장</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

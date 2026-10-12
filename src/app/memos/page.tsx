import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./sign-out-button";
import { createClient } from "@/lib/supabase/server";

export default async function MemosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memos, error } = await supabase
    .from("english_notes")
    .select("id, korean_text, english_text, situation, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">English Memo</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">내 메모</h1>
          <p className="mt-3 text-sm text-stone-600">{user.email ?? "로그인된 사용자"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/memos/new" className="rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
            새 메모
          </Link>
          <SignOutButton />
        </div>
      </div>

      {error ? (
        <section role="alert" className="mt-8 rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error.code === "PGRST205" || error.code === "42P01"
            ? "Supabase에 메모 테이블이 없습니다. SQL Editor에서 english_notes 생성 마이그레이션을 먼저 실행해 주세요."
            : "메모 목록을 불러오지 못했습니다. 페이지를 새로고침해 주세요."}
        </section>
      ) : memos.length === 0 ? (
        <section className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-stone-900">아직 메모가 없습니다.</h2>
          <p className="mt-2 text-sm text-stone-600">오늘 배운 문장부터 기록해 보세요.</p>
          <Link href="/memos/new" className="mt-5 inline-flex min-h-10 items-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
            첫 메모 작성
          </Link>
        </section>
      ) : (
        <section aria-label="메모 목록" className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
          {memos.map((memo) => (
            <Link
              key={memo.id}
              href={`/memos/${memo.id}`}
              className="block bg-white px-5 py-5 transition hover:bg-teal-50/40 sm:px-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                {memo.situation ? <p className="text-xs font-semibold text-teal-800">{memo.situation}</p> : <span />}
                <time dateTime={memo.updated_at} className="text-xs text-stone-500">
                  {new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(memo.updated_at))}
                </time>
              </div>
              <h2 className="mt-3 line-clamp-2 whitespace-pre-wrap text-base font-semibold leading-7 text-stone-900">{memo.korean_text}</h2>
              <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-stone-600">{memo.english_text}</p>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteMemoButton from "../delete-memo-button";
import { createClient } from "@/lib/supabase/server";

export default async function MemoDetailPage({ params }: PageProps<"/memos/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: memo, error } = await supabase
    .from("english_notes")
    .select("id, korean_text, english_text, notes, situation, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        <p role="alert" className="text-sm text-red-700">메모를 불러오지 못했습니다. 새로고침해 주세요.</p>
        <Link href="/memos" className="mt-4 inline-block text-sm text-teal-800 hover:underline">목록으로 돌아가기</Link>
      </main>
    );
  }

  if (!memo) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/memos" className="text-sm font-medium text-teal-800 hover:underline">← 메모 목록</Link>
      <article className="mt-6 rounded-xl border border-stone-200 bg-white p-5 sm:p-8">
        {memo.situation ? <p className="text-sm font-medium text-teal-800">{memo.situation}</p> : null}
        <h1 className="mt-3 whitespace-pre-wrap text-2xl font-semibold leading-relaxed text-stone-950">{memo.korean_text}</h1>
        <p className="mt-4 whitespace-pre-wrap border-l-2 border-teal-600 pl-4 text-lg leading-relaxed text-stone-700">{memo.english_text}</p>
        {memo.notes ? (
          <section className="mt-8 border-t border-stone-200 pt-6">
            <h2 className="text-sm font-semibold text-stone-800">메모</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-stone-600">{memo.notes}</p>
          </section>
        ) : null}
        <p className="mt-8 text-xs text-stone-500">
          마지막 수정: {new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(memo.updated_at))}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-5">
          <Link href={`/memos/${memo.id}/edit`} className="rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">수정</Link>
          <DeleteMemoButton id={memo.id} />
        </div>
      </article>
    </main>
  );
}
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import MemoForm from "../../memo-form";
import { createClient } from "@/lib/supabase/server";
import { getSituationSuggestions } from "@/lib/memos";

export default async function EditMemoPage({ params }: PageProps<"/memos/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const situations = await getSituationSuggestions(supabase, user.id);

  const { data: memo, error } = await supabase
    .from("english_notes")
    .select("id, korean_text, english_text, notes, situation")
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
      <Link href={`/memos/${id}`} className="text-sm font-medium text-teal-800 hover:underline">← 메모 보기</Link>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-stone-950">메모 수정</h1>
      <section className="mt-8 rounded-xl border border-stone-200 bg-white p-5 sm:p-8">
        <MemoForm id={memo.id} memo={memo} situations={situations} />
      </section>
    </main>
  );
}
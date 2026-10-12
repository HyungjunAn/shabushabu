import Link from "next/link";
import { redirect } from "next/navigation";
import MemoForm from "../memo-form";
import { createClient } from "@/lib/supabase/server";
import { getSituationSuggestions } from "@/lib/memos";

export default async function NewMemoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const situations = await getSituationSuggestions(supabase, user.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/memos" className="text-sm font-medium text-teal-800 hover:underline">← 메모 목록</Link>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-stone-950">새 메모</h1>
      <p className="mt-2 text-sm text-stone-600">한국어 문장과 영어 표현을 입력해 주세요.</p>
      <section className="mt-8 rounded-xl border border-stone-200 bg-white p-5 sm:p-8">
        <MemoForm situations={situations} />
      </section>
    </main>
  );
}
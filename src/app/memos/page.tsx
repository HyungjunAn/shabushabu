import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-button";
import { createClient } from "@/lib/supabase/server";

export default async function MemosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">English Memo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">내 메모</h1>
          <p className="mt-3 text-stone-600">{user.email ?? "로그인된 사용자"}로 로그인되었습니다.</p>
        </div>
        <SignOutButton />
      </div>
      <section className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-stone-900">메모 기능은 곧 시작됩니다.</h2>
        <p className="mt-2 text-sm text-stone-600">로그인은 완료되었습니다. 다음 단계에서 문장을 기록할 수 있습니다.</p>
      </section>
    </main>
  );
}
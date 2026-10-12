import { redirect } from "next/navigation";
import Link from "next/link";
import MemoFilters from "./memo-filters";
import SignOutButton from "./sign-out-button";
import { createClient } from "@/lib/supabase/server";

const situationOptions = ["Daily", "Work", "Jira", "Family", "Travel"] as const;
const sortOptions = {
  updated_desc: { column: "updated_at", ascending: false },
  updated_asc: { column: "updated_at", ascending: true },
  created_desc: { column: "created_at", ascending: false },
  created_asc: { column: "created_at", ascending: true },
} as const;

function getValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function escapeSearchTerm(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/[%_]/g, "\\$&");
}

export default async function MemosPage({ searchParams }: PageProps<"/memos">) {
  const params = await searchParams;
  const search = getValue(params.q).trim().slice(0, 200);
  const situation = getValue(params.situation);
  const completeness = getValue(params.completeness);
  const sort = getValue(params.sort);
  const selectedSituation = situationOptions.includes(situation as typeof situationOptions[number]) || situation === "other"
    ? situation
    : "all";
  const selectedCompleteness = ["missing_korean", "missing_english", "missing_notes", "complete"].includes(completeness)
    ? completeness
    : "all";
  const selectedSort = sort in sortOptions ? sort as keyof typeof sortOptions : "updated_desc";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let memoQuery = supabase
    .from("english_notes")
    .select("id, korean_text, english_text, situation, updated_at")
    .eq("user_id", user.id);

  if (search) {
    const pattern = `"%${escapeSearchTerm(search)}%"`;
    memoQuery = memoQuery.or(
      `korean_text.ilike.${pattern},english_text.ilike.${pattern},notes.ilike.${pattern},situation.ilike.${pattern}`,
    );
  }

  if (selectedSituation === "other") {
    memoQuery = memoQuery.not("situation", "in", '("Daily","Work","Jira","Family","Travel")');
  } else if (selectedSituation !== "all") {
    memoQuery = memoQuery.ilike("situation", selectedSituation);
  }

  if (selectedCompleteness === "missing_korean") {
    memoQuery = memoQuery.eq("korean_text", "");
  } else if (selectedCompleteness === "missing_english") {
    memoQuery = memoQuery.eq("english_text", "");
  } else if (selectedCompleteness === "missing_notes") {
    memoQuery = memoQuery.or("notes.is.null,notes.eq.\"\"");
  } else if (selectedCompleteness === "complete") {
    memoQuery = memoQuery
      .neq("korean_text", "")
      .neq("english_text", "")
      .not("notes", "is", null)
      .neq("notes", "");
  }

  const ordering = sortOptions[selectedSort];
  const { data: memos, error } = await memoQuery
    .order(ordering.column, { ascending: ordering.ascending })
    .order("id", { ascending: ordering.ascending });

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

      <MemoFilters
        search={search}
        situation={selectedSituation}
        completeness={selectedCompleteness}
        sort={selectedSort}
      />

      {error ? (
        <section role="alert" className="mt-8 rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error.code === "PGRST205" || error.code === "42P01"
            ? "Supabase에 메모 테이블이 없습니다. SQL Editor에서 english_notes 생성 마이그레이션을 먼저 실행해 주세요."
            : "메모 목록을 불러오지 못했습니다. 페이지를 새로고침해 주세요."}
        </section>
      ) : memos.length === 0 ? (
        <section className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
          {search || selectedSituation !== "all" || selectedCompleteness !== "all" ? (
            <>
              <h2 className="text-lg font-semibold text-stone-900">조건에 맞는 메모가 없습니다.</h2>
              <p className="mt-2 text-sm text-stone-600">검색어나 필터 조건을 바꿔 다시 찾아보세요.</p>
              <Link href="/memos" className="mt-5 inline-flex min-h-10 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                필터 초기화
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-stone-900">아직 메모가 없습니다.</h2>
              <p className="mt-2 text-sm text-stone-600">오늘 배운 문장부터 기록해 보세요.</p>
              <Link href="/memos/new" className="mt-5 inline-flex min-h-10 items-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
                첫 메모 작성
              </Link>
            </>
          )}
        </section>
      ) : (
        <section aria-label="메모 목록" className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
          <p className="bg-stone-100 px-5 py-2 text-xs text-stone-600 sm:px-6">검색 결과 {memos.length}개</p>
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
import Link from "next/link";
import MemoSearch from "./memo-search";

type MemoFiltersProps = {
  search: string;
  situation: string;
  completeness: string;
  sort: string;
};

const controlClassName = "mt-1.5 min-h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-800 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100";

export default function MemoFilters({ search, situation, completeness, sort }: MemoFiltersProps) {
  return (
    <section className="mt-8 rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
      <div className="mb-4 max-w-xl">
        <MemoSearch search={search} />
      </div>
      <form action="/memos" method="get">
        <input type="hidden" name="q" value={search} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(12rem,1.5fr)_repeat(3,minmax(9rem,1fr))]">
        <div>
          <label htmlFor="situation-filter" className="text-xs font-semibold text-stone-700">상황</label>
          <select id="situation-filter" name="situation" defaultValue={situation} className={controlClassName}>
            <option value="all">모든 상황</option>
            <option value="Daily">Daily</option>
            <option value="Work">Work</option>
            <option value="Jira">Jira</option>
            <option value="Family">Family</option>
            <option value="Travel">Travel</option>
            <option value="other">기타</option>
          </select>
        </div>
        <div>
          <label htmlFor="completeness-filter" className="text-xs font-semibold text-stone-700">작성 상태</label>
          <select id="completeness-filter" name="completeness" defaultValue={completeness} className={controlClassName}>
            <option value="all">모든 메모</option>
            <option value="missing_english">영어 번역 없음</option>
            <option value="missing_korean">한국어 문장 없음</option>
            <option value="missing_notes">메모 없음</option>
            <option value="complete">완성된 메모</option>
          </select>
        </div>
        <div>
          <label htmlFor="sort-order" className="text-xs font-semibold text-stone-700">정렬</label>
          <select id="sort-order" name="sort" defaultValue={sort} className={controlClassName}>
            <option value="updated_desc">최근 수정순</option>
            <option value="updated_asc">오래된 수정순</option>
            <option value="created_desc">최근 작성순</option>
            <option value="created_asc">오래된 작성순</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" className="min-h-10 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
          적용
        </button>
        <Link href="/memos" className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-stone-600 hover:bg-stone-100">
          초기화
        </Link>
      </div>
      </form>
    </section>
  );
}
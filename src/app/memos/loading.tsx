export default function MemosLoading() {
  return (
    <main aria-label="메모 불러오는 중" className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="h-10 w-40 animate-pulse rounded bg-stone-200" />
      <div className="mt-8 h-28 animate-pulse rounded-xl bg-stone-200" />
      <div className="mt-4 h-28 animate-pulse rounded-xl bg-stone-200" />
    </main>
  );
}
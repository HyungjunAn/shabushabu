export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center px-5 py-12 sm:px-8 sm:py-16">
      <section className="grid w-full gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            Personal English Memo
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-6xl">
            오늘 배운 문장을
            <br />
            오래 기억하세요.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
            한국어 문장과 영어 표현을 한곳에 기록하고, 나중에 다시 꺼내 보세요.
            나만의 영어 문장 노트가 곧 시작됩니다.
          </p>
          <div className="mt-8 inline-flex min-h-12 items-center rounded-md bg-teal-50 px-5 text-sm font-medium text-teal-800">
            메모 기능은 다음 단계에서 제공됩니다.
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b border-stone-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Next step
              </p>
              <h2 className="mt-2 text-xl font-semibold text-stone-900">첫 메모를 준비하세요</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              준비 중
            </span>
          </div>
          <dl className="divide-y divide-stone-100 text-sm">
            <div className="flex items-center justify-between py-4">
              <dt className="text-stone-500">한국어 문장</dt>
              <dd className="font-medium text-stone-800">기록하기</dd>
            </div>
            <div className="flex items-center justify-between py-4">
              <dt className="text-stone-500">영어 표현</dt>
              <dd className="font-medium text-stone-800">번역하기</dd>
            </div>
            <div className="flex items-center justify-between py-4">
              <dt className="text-stone-500">상황과 메모</dt>
              <dd className="font-medium text-stone-800">정리하기</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}

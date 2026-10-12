"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const inputClassName = "mt-1.5 min-h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-800 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100";

export default function MemoSearch({ search }: { search: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const query = value.trim();

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      const currentUrl = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, router, searchParams, value]);

  return (
    <div>
      <label htmlFor="memo-search" className="text-xs font-semibold text-stone-700">
        문장·영어·메모·상황 검색
      </label>
      <input
        id="memo-search"
        type="search"
        maxLength={200}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="검색어 입력"
        className={inputClassName}
        autoComplete="off"
      />
    </div>
  );
}
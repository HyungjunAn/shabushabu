"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setIsLoading(true);
    setError(null);
    const { error: signOutError } = await createClient().auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setIsLoading(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={signOut}
        disabled={isLoading}
        className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoading ? "로그아웃 중..." : "로그아웃"}
      </button>
      {error ? <p className="mt-2 max-w-48 text-xs text-red-700">로그아웃에 실패했습니다: {error}</p> : null}
    </div>
  );
}
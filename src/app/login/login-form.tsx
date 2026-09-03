"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error"));

  async function signInWithGoogle() {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/memos`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={isLoading}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
      >
        <span aria-hidden="true" className="text-base font-bold">G</span>
        {isLoading ? "Google로 이동하는 중..." : "Continue with Google"}
      </button>
      {error ? <p className="mt-4 text-sm text-red-700">로그인에 실패했습니다: {error}</p> : null}
    </div>
  );
}
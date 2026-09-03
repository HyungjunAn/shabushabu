import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center px-5 py-12">
      <section className="w-full rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Personal English Memo
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
          로그인하고 문장을 기록하세요.
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Google 계정으로 로그인하면 나만의 영어 메모를 안전하게 관리할 수 있습니다.
        </p>
        <Suspense fallback={<div className="mt-8 h-12 animate-pulse rounded-md bg-stone-100" />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
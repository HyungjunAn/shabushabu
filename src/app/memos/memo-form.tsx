"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createMemo, type MemoFormState, updateMemo } from "./actions";

type MemoValues = {
  korean_text?: string;
  english_text?: string;
  notes?: string | null;
  situation?: string | null;
};

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "저장 중..." : editing ? "수정 저장" : "메모 저장"}
    </button>
  );
}

export default function MemoForm({
  id,
  memo,
  situations = [],
}: {
  id?: string;
  memo?: MemoValues;
  situations?: string[];
}) {
  const action = id ? updateMemo.bind(null, id) : createMemo;
  const [state, formAction] = useActionState<MemoFormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}
      <Field label="한국어 문장" name="korean_text" required error={state.errors?.korean_text}>
        <textarea
          id="korean_text"
          name="korean_text"
          required
          rows={3}
          defaultValue={memo?.korean_text ?? ""}
          aria-invalid={Boolean(state.errors?.korean_text)}
          className="w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
          placeholder="기록할 한국어 문장을 입력하세요"
        />
      </Field>
      <Field label="영어 표현" name="english_text" required error={state.errors?.english_text}>
        <textarea
          id="english_text"
          name="english_text"
          required
          rows={3}
          defaultValue={memo?.english_text ?? ""}
          aria-invalid={Boolean(state.errors?.english_text)}
          className="w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
          placeholder="자연스러운 영어 표현을 입력하세요"
        />
      </Field>
      <Field label="상황" name="situation">
        <div>
          <input
            id="situation"
            name="situation"
            list="situation-suggestions"
            autoComplete="off"
            defaultValue={memo?.situation ?? ""}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
            placeholder="기존 상황을 선택하거나 새로 입력하세요"
          />
          <datalist id="situation-suggestions">
            {situations.map((situation) => <option key={situation} value={situation} />)}
          </datalist>
          {situations.length > 0 ? (
            <p className="mt-1.5 text-xs text-stone-500">저장된 상황을 선택하거나 새로운 상황을 입력할 수 있습니다.</p>
          ) : null}
        </div>
      </Field>
      <Field label="메모" name="notes">
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={memo?.notes ?? ""}
          className="w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
          placeholder="표현의 뉘앙스나 기억할 점을 적어 두세요"
        />
      </Field>
      <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-5">
        <SubmitButton editing={Boolean(id)} />
        <Link href={id ? `/memos/${id}` : "/memos"} className="rounded-md px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100">
          취소
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-stone-800">
        {label}{required ? <span className="ml-1 text-red-700">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
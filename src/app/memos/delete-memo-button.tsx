"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteMemo, type MemoFormState } from "./actions";

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("이 메모를 삭제할까요? 삭제한 메모는 복구할 수 없습니다.")) {
          event.preventDefault();
        }
      }}
      className="rounded-md px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "삭제 중..." : "삭제"}
    </button>
  );
}

export default function DeleteMemoButton({ id }: { id: string }) {
  const [state, formAction] = useActionState<MemoFormState, FormData>(deleteMemo.bind(null, id), {});

  return (
    <form action={formAction}>
      <DeleteButton />
      {state.message ? <p role="alert" className="mt-2 text-sm text-red-700">{state.message}</p> : null}
    </form>
  );
}
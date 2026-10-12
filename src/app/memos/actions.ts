"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MemoFormState = {
  message?: string;
  errors?: {
    korean_text?: string;
    english_text?: string;
  };
};

type MemoFields = {
  korean_text: string;
  english_text: string;
  notes: string | null;
  situation: string | null;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readMemoFields(formData: FormData): MemoFields | MemoFormState {
  const koreanText = String(formData.get("korean_text") ?? "").trim();
  const englishText = String(formData.get("english_text") ?? "").trim();

  if (!koreanText || !englishText) {
    return {
      message: "한국어 문장과 영어 표현을 모두 입력해 주세요.",
      errors: {
        korean_text: koreanText ? undefined : "한국어 문장을 입력해 주세요.",
        english_text: englishText ? undefined : "영어 표현을 입력해 주세요.",
      },
    };
  }

  return {
    korean_text: koreanText,
    english_text: englishText,
    notes: String(formData.get("notes") ?? "").trim() || null,
    situation: String(formData.get("situation") ?? "").trim() || null,
  };
}

function isFormError(value: MemoFields | MemoFormState): value is MemoFormState {
  return "message" in value;
}

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function createMemo(
  _previousState: MemoFormState,
  formData: FormData,
): Promise<MemoFormState> {
  const fields = readMemoFields(formData);
  if (isFormError(fields)) return fields;

  const { supabase, user } = await getAuthenticatedClient();
  const { error } = await supabase.from("english_notes").insert({
    ...fields,
    user_id: user.id,
  });

  if (error) {
    if (error.code === "PGRST205" || error.code === "42P01") {
      return {
        message: "Supabase에 메모 테이블이 없습니다. SQL Editor에서 english_notes 생성 마이그레이션을 먼저 실행해 주세요.",
      };
    }

    return { message: "메모를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/memos");
  redirect("/memos");
}

export async function updateMemo(
  id: string,
  _previousState: MemoFormState,
  formData: FormData,
): Promise<MemoFormState> {
  const fields = readMemoFields(formData);
  if (isFormError(fields)) return fields;
  if (!uuidPattern.test(id)) return { message: "잘못된 메모 주소입니다." };

  const { supabase, user } = await getAuthenticatedClient();
  const { data, error } = await supabase
    .from("english_notes")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { message: "메모를 수정하지 못했습니다. 메모가 없거나 접근할 수 없습니다." };
  }

  revalidatePath("/memos");
  revalidatePath(`/memos/${id}`);
  redirect(`/memos/${id}`);
}

export async function deleteMemo(
  id: string,
  previousState: MemoFormState,
  formData: FormData,
): Promise<MemoFormState> {
  void previousState;
  void formData;
  if (!uuidPattern.test(id)) return { message: "잘못된 메모 주소입니다." };

  const { supabase, user } = await getAuthenticatedClient();
  const { data, error } = await supabase
    .from("english_notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { message: "메모를 삭제하지 못했습니다. 메모가 없거나 접근할 수 없습니다." };
  }

  revalidatePath("/memos");
  redirect("/memos");
}
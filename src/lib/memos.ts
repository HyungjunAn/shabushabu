import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getSituationSuggestions(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data } = await supabase
    .from("english_notes")
    .select("situation")
    .eq("user_id", userId)
    .not("situation", "is", null)
    .order("situation");

  return [...new Set(
    (data ?? [])
      .map(({ situation }) => situation?.trim())
      .filter((situation): situation is string => Boolean(situation)),
  )];
}
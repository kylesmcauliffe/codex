import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { CodexEntry, Chapter } from "@/apps/novelcrafter/data";

type Client = SupabaseClient<Database>;

export interface DbDraft {
  id: string;
  novel_id: string;
  name: string;
  slug: string;
  summary: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbDraftReference {
  id: string;
  novel_id: string;
  draft_id: string;
  source_draft_id: string;
  source_type: "codex" | "snippet" | "draft";
  source_id: string | null;
  note: string;
  created_at: string;
  /** Joined for display */
  source_draft_name?: string;
  source_label?: string;
  source_summary?: string;
}

export async function assertNovelOwner(
  supabase: Client,
  userId: string,
  novelId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("novels")
    .select("id")
    .eq("id", novelId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function listDrafts(
  supabase: Client,
  userId: string,
  novelId: string,
): Promise<DbDraft[]> {
  if (!(await assertNovelOwner(supabase, userId, novelId))) {
    throw new Error("Unauthorized");
  }
  const { data, error } = await supabase
    .from("novel_drafts")
    .select("id, novel_id, name, slug, summary, sort_order, created_at, updated_at")
    .eq("novel_id", novelId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as DbDraft[];
}

export async function getActiveDraftId(
  supabase: Client,
  novelId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("novels")
    .select("active_draft_id")
    .eq("id", novelId)
    .maybeSingle();
  if (error) throw error;
  return data?.active_draft_id ?? null;
}

/** PLACEHOLDER_REMAINDER - will be fixed */

import { supabase } from "../lib/supabase";

/** Un seul titre actif par utilisateur, basé sur un succès réellement enregistré. */
export async function getProfileTitle(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from("user_profile_titles")
    .select("badge_id").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data?.badge_id ?? null;
}

export async function setProfileTitle(userId: string, badgeId: string | null): Promise<void> {
  if (badgeId === null) {
    const { error } = await supabase.from("user_profile_titles").delete().eq("user_id", userId);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("user_profile_titles")
    .upsert({ user_id: userId, badge_id: badgeId }, { onConflict: "user_id" });
  if (error) throw error;
}

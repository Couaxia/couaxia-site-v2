import { supabase } from "../lib/supabase";

/** Dates de déblocage persistées. Ne jamais supprimer un succès acquis. */
export async function getUnlockedBadges(userId: string): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("user_badges")
    .select("badge_id, unlocked_at").eq("user_id", userId);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map(row => [String(row.badge_id), String(row.unlocked_at)]));
}

export async function saveUnlockedBadges(userId: string, badgeIds: string[]): Promise<void> {
  if (!badgeIds.length) return;
  const { error } = await supabase.from("user_badges")
    .upsert(badgeIds.map(badge_id => ({ user_id: userId, badge_id })),
      { onConflict: "user_id,badge_id", ignoreDuplicates: true });
  if (error) throw error;
}

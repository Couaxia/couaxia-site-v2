import { supabase } from "../lib/supabase";

/** Les badges exposés sont stockés dans Supabase, pas dans le navigateur. */
export async function getFeaturedBadges(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from("user_profile_badges")
    .select("badge_id, position").eq("user_id", userId).order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => String(row.badge_id));
}

/** Fonction SQL transactionnelle : 3 badges maximum, uniquement ceux gagnés. */
export async function setFeaturedBadges(badgeIds: string[]): Promise<void> {
  const { error } = await supabase.rpc("set_profile_featured_badges", { p_badge_ids: badgeIds });
  if (error) throw error;
}

import { supabase } from "../lib/supabase";

export interface TentacleStats {
  user_id: string;
  best_score: number;
  games_played: number;
  best_character: "hylda" | "cita";
}
export interface TentacleScoreRow {
  user_id: string;
  display_name: string;
  best_score: number;
  best_character: "hylda" | "cita";
}
export async function getTentacleStats(): Promise<TentacleStats | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return null;
  const { data, error } = await supabase.rpc("get_my_tentacle_run_stats");
  if (error) throw error;
  return (data as TentacleStats | null) ?? null;
}
export async function saveTentacleResult(score: number, character: "hylda" | "cita"): Promise<TentacleStats | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return null;
  const { data, error } = await supabase.rpc("record_tentacle_run_score", { p_score: score, p_character: character });
  if (error) throw error;
  return data as TentacleStats;
}
export async function getTentacleLeaderboard(): Promise<TentacleScoreRow[]> {
  const { data, error } = await supabase.rpc("get_tentacle_run_leaderboard");
  if (error) throw error;
  return (data as TentacleScoreRow[] | null) ?? [];
}

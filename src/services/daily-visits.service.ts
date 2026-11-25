
import { supabase } from "../lib/supabase";

/**
 * Nombre de jours calendaires distincts
 * pendant lesquels le membre a visité Couaxia V2.
 */
export async function getDailyVisitCount(
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("user_daily_visits")
    .select("visit_day", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId);

  if (error) {
    console.error(
      "[Couaxia] Erreur de lecture des visites :",
      error
    );
    throw error;
  }

  return count ?? 0;
}

/**
 * Enregistre une visite quotidienne.
 *
 * - Une seule visite par membre et par jour.
 * - La date est calculée par Supabase.
 * - Les doublons sont ignorés sans erreur HTTP 409.
 */
export async function recordDailyVisit(
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("user_daily_visits")
    .upsert(
      {
        user_id: userId,
      },
      {
        onConflict: "user_id,visit_day",
        ignoreDuplicates: true,
      }
    );

  if (error) {
    console.error(
      "[Couaxia] Erreur d'enregistrement de la visite :",
      error
    );
    throw error;
  }

  // Actualise les succès de fidélité.
  window.dispatchEvent(
    new CustomEvent("couaxia:daily-visit", {
      detail: { userId },
    })
  );
}

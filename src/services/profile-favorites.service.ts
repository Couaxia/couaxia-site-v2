import { supabase } from "../lib/supabase";
import { getCredits } from "./credits.service";

export interface FavoriteArtwork {
  id: string;
  title: string;
  imageUrl: string;
  artistName: string;
  mediaType: string;
}

export async function getMyFavoriteArtworks(userId: string): Promise<FavoriteArtwork[]> {
  const { data, error } = await supabase
    .from("artwork_likes")
    .select("artwork_id")
    .eq("user_id", userId);

  if (error) throw error;
  const ids = new Set((data ?? []).map(row => String(row.artwork_id)));
  if (ids.size === 0) return [];

  const credits = await getCredits();
  return credits
    .filter(credit => ids.has(String(credit.id)))
    .map(credit => ({
      id: String(credit.id),
      title: credit.art_id || "Illustration",
      imageUrl: credit.image_url,
      artistName: credit.artist || "Artiste inconnu",
      mediaType: credit.media_type || "image"
    }));
}

export async function removeMyFavoriteArtwork(userId: string, artworkId: string): Promise<void> {
  const { error } = await supabase
    .from("artwork_likes")
    .delete()
    .eq("user_id", userId)
    .eq("artwork_id", artworkId);
  if (error) throw error;
}

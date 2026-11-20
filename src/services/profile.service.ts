import { supabase } from "../lib/supabase";

const AVATAR_BUCKET = "avatars";
const OFFICIAL_AVATAR_FOLDER = "official";
const ALLOWED_AVATAR_EXTENSIONS = /\.(png|jpe?g|webp)$/i;

export type ProfileRole = "user" | "moderator" | "admin";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfilePayload {
  username?: string;
  display_name?: string | null;
  bio?: string | null;
}

export interface OfficialAvatar {
  name: string;
  path: string;
  url: string;
}

const PROFILE_SELECT = `
  id,
  username,
  display_name,
  avatar_url,
  bio,
  role,
  created_at,
  updated_at
`;

async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Erreur récupération utilisateur :", error);
    throw error;
  }
  return user;
}

async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Tu dois être connecté pour effectuer cette action.");
  }
  return user;
}

function validateUsername(value: string): string {
  const username = value.trim().toLowerCase();
  if (username.length < 3) {
    throw new Error("Le pseudo doit contenir au moins 3 caractères.");
  }
  if (username.length > 30) {
    throw new Error("Le pseudo ne peut pas dépasser 30 caractères.");
  }
  if (!/^[a-z0-9_-]+$/.test(username)) {
    throw new Error("Le pseudo peut uniquement contenir des lettres, chiffres, tirets et underscores.");
  }
  return username;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Erreur récupération profil :", error);
    throw error;
  }
  return (data as Profile | null) ?? null;
}

export async function checkUsernameAvailable(
  username: string,
  currentUserId?: string
): Promise<boolean> {
  const cleanUsername = validateUsername(username);
  let query = supabase
    .from("profiles")
    .select("id")
    .ilike("username", cleanUsername)
    .limit(1);

  if (currentUserId) {
    query = query.neq("id", currentUserId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Erreur vérification pseudo :", error);
    throw error;
  }
  return (data ?? []).length === 0;
}

export async function updateMyProfile(
  payload: UpdateProfilePayload
): Promise<Profile> {
  const user = await requireCurrentUser();

  // Ne jamais inclure id, role ou avatar_url dans cette mise à jour.
  const updateData: {
    username?: string;
    display_name?: string | null;
    bio?: string | null;
    updated_at: string;
  } = { updated_at: new Date().toISOString() };

  if (payload.username !== undefined) {
    const username = validateUsername(payload.username);
    if (!(await checkUsernameAvailable(username, user.id))) {
      throw new Error("Ce pseudo est déjà utilisé.");
    }
    updateData.username = username;
  }

  if (payload.display_name !== undefined) {
    const displayName = payload.display_name?.trim() ?? "";
    if (displayName.length > 40) {
      throw new Error("Le nom affiché ne peut pas dépasser 40 caractères.");
    }
    updateData.display_name = displayName || null;
  }

  if (payload.bio !== undefined) {
    const bio = payload.bio?.trim() ?? "";
    if (bio.length > 500) {
      throw new Error("La bio ne peut pas dépasser 500 caractères.");
    }
    updateData.bio = bio || null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id)
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    console.error("Erreur modification profil :", error);
    throw error;
  }
  return data as Profile;
}

/** Liste des images publiées dans avatars/official sur Supabase Storage. */
export async function getOfficialAvatars(): Promise<OfficialAvatar[]> {
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(OFFICIAL_AVATAR_FOLDER, {
      limit: 100,
      sortBy: { column: "name", order: "asc" }
    });

  if (error) {
    console.error("Erreur récupération avatars officiels :", error);
    throw error;
  }

  return (data ?? [])
    .filter(file => ALLOWED_AVATAR_EXTENSIONS.test(file.name))
    .map(file => {
      const path = `${OFFICIAL_AVATAR_FOLDER}/${file.name}`;
      const { data: publicUrlData } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(path);

      return {
        name: file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " "),
        path,
        url: publicUrlData.publicUrl
      };
    });
}

/** Seuls les avatars présents dans la galerie officielle sont sélectionnables. */
export async function selectOfficialAvatar(avatarUrl: string): Promise<Profile> {
  const user = await requireCurrentUser();
  const officialAvatars = await getOfficialAvatars();
  const isOfficial = officialAvatars.some(avatar => avatar.url === avatarUrl);

  if (!isOfficial) {
    throw new Error("Cet avatar officiel n'est pas valide.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id)
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    console.error("Erreur sélection avatar officiel :", error);
    throw error;
  }
  return data as Profile;
}

/** Retire l'avatar du profil sans supprimer les images du Storage. */
export async function deleteMyAvatar(): Promise<Profile> {
  const user = await requireCurrentUser();

  const { data, error } = await supabase
    .from("profiles")
    .update({
      avatar_url: null,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id)
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    console.error("Erreur retrait avatar :", error);
    throw error;
  }
  return data as Profile;
}

export function getProfileDisplayName(profile: Profile | null | undefined): string {
  return profile?.display_name?.trim() || profile?.username?.trim() || "POUP";
}

/** Masque les anciennes images personnelles et les URLs externes. */
export function getProfileAvatar(profile: Profile | null | undefined): string | null {
  const avatar = profile?.avatar_url?.trim();
  if (!avatar) return null;

  const officialPrefix = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(`${OFFICIAL_AVATAR_FOLDER}/`).data.publicUrl;

  if (!avatar.startsWith(officialPrefix)) return null;
  const filename = avatar.slice(officialPrefix.length);
  if (!filename || filename.includes("/") || filename.includes("?") || filename.includes("#")) {
    return null;
  }
  return ALLOWED_AVATAR_EXTENSIONS.test(filename) ? avatar : null;
}

export function getProfileInitial(profile: Profile | null | undefined): string {
  return getProfileDisplayName(profile).trim().charAt(0).toUpperCase() || "P";
}

export async function getProfileArtworkLikesCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("artwork_likes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Erreur récupération likes artworks :", error);
    return 0;
  }
  return count ?? 0;
}

export function getProfileRoleLabel(profile: Profile | null | undefined): string {
  switch (profile?.role) {
    case "admin": return "ADMIN";
    case "moderator": return "MODÉRATEUR";
    default: return "POUP";
  }
}

export function isProfileAdmin(profile: Profile | null | undefined): boolean {
  return profile?.role === "admin";
}

export function isProfileModerator(profile: Profile | null | undefined): boolean {
  return profile?.role === "moderator";
}

export async function logoutProfile(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erreur déconnexion :", error);
    throw error;
  }
}

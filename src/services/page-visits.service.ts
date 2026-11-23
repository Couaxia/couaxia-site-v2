import type { Router } from "vue-router";
import { supabase } from "../lib/supabase";

/** Pages publiques suivies pour les succès Couaxia V2. */
export const TRACKED_PAGES = [
  { id: "home", path: "/", title: "Accueil", icon: "🏠", badge: "Premier pas" },
  { id: "about", path: "/about", title: "À propos", icon: "📖", badge: "Curieux de Saphira" },
  { id: "games", path: "/games", title: "Jeux", icon: "🎮", badge: "Joueur curieux" },
  { id: "polls", path: "/polls", title: "Sondages", icon: "🗳️", badge: "Voix de l'équipage" },
  { id: "history", path: "/history", title: "Histoire", icon: "📜", badge: "Gardien des histoires" },
  { id: "credits", path: "/credits", title: "Crédits", icon: "🎨", badge: "Amateur de créations" },
  { id: "twitch", path: "/twitch", title: "Twitch", icon: "📺", badge: "Rendez-vous en live" },
  { id: "contact", path: "/contact", title: "Contact", icon: "💌", badge: "Messager POUP" },
  { id: "profile", path: "/profile", title: "Profil", icon: "🪪", badge: "Identité POUP" },
] as const;

export type TrackedPageId = (typeof TRACKED_PAGES)[number]["id"];
const knownPages = new Set<string>(TRACKED_PAGES.map(page => page.id));

/** Lit les pages déjà visitées par le membre connecté. */
export async function getVisitedPages(userId: string): Promise<TrackedPageId[]> {
  const { data, error } = await supabase.from("user_page_visits")
    .select("page_id").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map(row => String(row.page_id))
    .filter((id): id is TrackedPageId => knownPages.has(id));
}

/** Enregistre une visite unique par membre et par page. */
export async function recordPageVisit(userId: string, pageId: TrackedPageId): Promise<void> {
  const { error } = await supabase.from("user_page_visits")
    .upsert({ user_id: userId, page_id: pageId }, { onConflict: "user_id,page_id", ignoreDuplicates: true });
  if (error) throw error;
  window.dispatchEvent(new CustomEvent("couaxia:page-visited", { detail: { userId, pageId } }));
}

/** Installer UNE fois dans main.ts, après la création du router. */
export function installPageVisitTracking(router: Router): void {
  let lastVisitKey = "";
  const track = async (path: string) => {
    const page = TRACKED_PAGES.find(item => item.path === path);
    if (!page) return;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return;
    const key = `${user.id}:${page.id}`;
    if (lastVisitKey === key) return;
    try {
      await recordPageVisit(user.id, page.id);
      lastVisitKey = key;
    } catch (error) {
      console.error("Enregistrement visite de page :", error);
    }
  };
  router.afterEach(to => { void track(to.path); });
  void router.isReady().then(() => track(router.currentRoute.value.path));
}

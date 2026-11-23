export interface BadgeUnlockNotification {
  id: string;
  title: string;
  icon: string;
  rarity: string;
}

const EVENT_NAME = "couaxia:badge-unlocked";

/** Appelé uniquement APRÈS l'enregistrement réussi dans Supabase. */
export function announceUnlockedBadges(badges: BadgeUnlockNotification[]): void {
  if (typeof window === "undefined" || badges.length === 0) return;
  for (const badge of badges) {
    window.dispatchEvent(new CustomEvent<BadgeUnlockNotification>(EVENT_NAME, { detail: badge }));
  }
}

export function onBadgeUnlocked(callback: (badge: BadgeUnlockNotification) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<BadgeUnlockNotification>).detail);
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

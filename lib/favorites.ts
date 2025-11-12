export type FavoritesUpdatedDetail = { count: number };

export const FAVORITES_STORAGE_KEY = "favorites";
export const FAVORITES_UPDATED_EVENT = "favorites-updated";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  emitFavoritesUpdated(ids.length);
}

export function emitFavoritesUpdated(count?: number) {
  if (typeof window === "undefined") return;
  const current = typeof count === "number" ? count : getFavorites().length;
  const event = new CustomEvent<FavoritesUpdatedDetail>(FAVORITES_UPDATED_EVENT, {
    detail: { count: current },
  });
  window.dispatchEvent(event);
}

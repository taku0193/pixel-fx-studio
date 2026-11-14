const storageKey = 'pixel-fx-studio.library';
const recentLimit = 12;

function readIds(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string'))] : [];
}

export function createEffectLibrary(storage: Pick<Storage, 'getItem' | 'setItem'>) {
  let favorites: string[] = [];
  let recent: string[] = [];
  try {
    const saved = JSON.parse(storage.getItem(storageKey) ?? 'null');
    favorites = readIds(saved?.favorites);
    recent = readIds(saved?.recent).slice(0, recentLimit);
  } catch {
    // Keep an in-memory library if storage is unavailable.
  }

  function save() {
    try { storage.setItem(storageKey, JSON.stringify({ favorites, recent })); }
    catch { /* The current session can still use the library. */ }
  }

  return {
    get favorites(): readonly string[] { return favorites; },
    get recent(): readonly string[] { return recent; },
    toggleFavorite(id: string) {
      favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
      save();
    },
    recordSelection(id: string) {
      if (recent[0] === id) return;
      recent = [id, ...recent.filter((item) => item !== id)].slice(0, recentLimit);
      save();
    },
  };
}

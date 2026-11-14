import { describe, expect, it } from 'vitest';
import { createEffectLibrary } from '../library';

function memoryStorage(initial: string | null = null) {
  let saved = initial;
  return { getItem: () => saved, setItem: (_key: string, value: string) => { saved = value; } };
}

describe('effect library', () => {
  it('persists favorites, including removals', () => {
    const storage = memoryStorage();
    const library = createEffectLibrary(storage);
    library.toggleFavorite('fire/campfire');
    library.toggleFavorite('arcane/portal');
    expect(createEffectLibrary(storage).favorites).toEqual(['fire/campfire', 'arcane/portal']);
    library.toggleFavorite('fire/campfire');
    expect(createEffectLibrary(storage).favorites).toEqual(['arcane/portal']);
  });

  it('keeps the latest 12 different selections in newest-first order across reloads', () => {
    const storage = memoryStorage();
    const library = createEffectLibrary(storage);
    for (let i = 0; i < 14; i++) library.recordSelection(String(i));
    library.recordSelection('5');
    const reopened = createEffectLibrary(storage);
    expect(reopened.recent).toEqual(['5', '13', '12', '11', '10', '9', '8', '7', '6', '4', '3', '2']);
  });

  it('recovers from malformed storage and remains usable when saving is unavailable', () => {
    const library = createEffectLibrary({
      getItem: () => '{bad JSON',
      setItem: () => { throw new Error('Storage unavailable'); },
    });
    library.toggleFavorite('arcane/portal');
    library.recordSelection('arcane/portal');
    expect(library.favorites).toEqual(['arcane/portal']);
    expect(library.recent).toEqual(['arcane/portal']);
  });
});

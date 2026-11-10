import { describe, expect, it } from 'vitest';
import { categories, effects, getEffect, getEffectsByCategory } from '../effects';

describe('effect catalog', () => {
  it('contains thirty-two distinct, real pixelfx modules across multiple categories', () => {
    expect(effects.map((effect) => effect.id)).toEqual([
      'ice/frost-nova', 'fire/campfire', 'lightning/lightning-strike',
      'fire/fire-tornado', 'water/waterfall', 'water/water-orb',
      'explosions/firework-burst', 'arcane/portal', 'holy/halo',
      'shadow/black-hole', 'nature/leaf-storm', 'weather/rain',
      'weather/aurora', 'scifi/energy-core', 'pickups/gem-spin',
      'critters/butterfly',
      'fire/meteor', 'fire/spirit-flame', 'ice/ice-crystal',
      'lightning/ball-lightning', 'water/geyser', 'explosions/plasma-explosion',
      'arcane/rune-circle', 'holy/heal', 'nature/tornado',
      'weather/cherry-blossoms', 'critters/ghost', 'melee/sword-slash',
      'projectiles/magic-missile', 'spawn/respawn-beam', 'status/poisoned',
      'ui/confetti',
    ]);
    expect(new Set(effects.map((effect) => effect.id)).size).toBe(32);
    expect(new Set(effects.map((effect) => effect.category)).size).toBe(18);
    for (const effect of effects) {
      expect(effect.module.meta.name).toBe(effect.name);
      expect(effect.module.meta.duration).toBeGreaterThan(0);
      expect(effect.module.meta.size[0]).toBeLessThanOrEqual(320);
      expect(effect.module.meta.size[1]).toBeLessThanOrEqual(288);
    }
  });

  it('resolves only registered IDs', () => {
    expect(getEffect('fire/campfire')).toBe(effects[1]);
    expect(getEffect('unknown')).toBeUndefined();
    expect(getEffect('__proto__')).toBeUndefined();
  });

  it('offers unique categories, including the new effect families', () => {
    expect(categories).toHaveLength(18);
    expect(new Set(categories).size).toBe(18);
    expect(categories).toEqual(expect.arrayContaining(['MELEE', 'PROJECTILES', 'SPAWN', 'STATUS', 'UI']));
  });

  it('filters effects by their exact category while keeping catalog order', () => {
    expect(getEffectsByCategory('FIRE').map((effect) => effect.id)).toEqual([
      'fire/campfire', 'fire/fire-tornado', 'fire/meteor', 'fire/spirit-flame',
    ]);
    expect(getEffectsByCategory('SPAWN').map((effect) => effect.id)).toEqual(['spawn/respawn-beam']);
  });

  it('returns the whole catalog for all, and no effects for unknown categories', () => {
    expect(getEffectsByCategory('all')).toBe(effects);
    expect(getEffectsByCategory('unknown')).toEqual([]);
    expect(getEffectsByCategory('__proto__')).toEqual([]);
  });
});

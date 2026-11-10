import { describe, expect, it } from 'vitest';
import { effects, getEffect } from '../effects';

describe('effect catalog', () => {
  it('contains sixteen distinct, real pixelfx modules across multiple categories', () => {
    expect(effects.map((effect) => effect.id)).toEqual([
      'ice/frost-nova', 'fire/campfire', 'lightning/lightning-strike',
      'fire/fire-tornado', 'water/waterfall', 'water/water-orb',
      'explosions/firework-burst', 'arcane/portal', 'holy/halo',
      'shadow/black-hole', 'nature/leaf-storm', 'weather/rain',
      'weather/aurora', 'scifi/energy-core', 'pickups/gem-spin',
      'critters/butterfly',
    ]);
    expect(new Set(effects.map((effect) => effect.id)).size).toBe(16);
    expect(new Set(effects.map((effect) => effect.category)).size).toBeGreaterThanOrEqual(10);
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
});

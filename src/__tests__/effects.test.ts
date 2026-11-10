import { describe, expect, it } from 'vitest';
import { effects, getEffect } from '../effects';

describe('effect catalog', () => {
  it('contains three distinct, real pixelfx modules', () => {
    expect(effects.map((effect) => effect.id)).toEqual([
      'ice/frost-nova', 'fire/campfire', 'lightning/lightning-strike',
    ]);
    expect(new Set(effects.map((effect) => effect.id)).size).toBe(3);
    for (const effect of effects) {
      expect(effect.module.meta.name).toBe(effect.name);
      expect(effect.module.meta.duration).toBeGreaterThan(0);
    }
  });

  it('resolves only registered IDs', () => {
    expect(getEffect('fire/campfire')).toBe(effects[1]);
    expect(getEffect('unknown')).toBeUndefined();
    expect(getEffect('__proto__')).toBeUndefined();
  });
});

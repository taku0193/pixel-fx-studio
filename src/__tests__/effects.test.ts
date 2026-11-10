import { describe, expect, it } from 'vitest';
import { effects as upstreamEffects } from 'pixelfx/fx/index';
import { categories, effects, getEffect, getEffectsByCategory, searchEffects } from '../effects';

describe('effect catalog', () => {
  it('includes all 244 upstream effects while retaining the original selection order', () => {
    expect(effects.slice(0, 32).map((effect) => effect.id)).toEqual([
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
    expect(new Set(effects.map((effect) => effect.id)).size).toBe(244);
    expect(effects.map((effect) => effect.id).sort()).toEqual(Object.keys(upstreamEffects).sort());
    expect(new Set(effects.map((effect) => effect.category)).size).toBe(21);
    for (const effect of effects) {
      expect(effect.module.meta.name).toBe(effect.name);
      expect(effect.module.meta.duration).toBeGreaterThan(0);
      expect(effect.module).toBe(upstreamEffects[effect.id]);
      expect(effect.module.meta.size[0]).toBeGreaterThan(0);
      expect(effect.module.meta.size[1]).toBeGreaterThan(0);
    }
  });

  it('resolves only registered IDs', () => {
    expect(getEffect('fire/campfire')).toBe(effects[1]);
    expect(getEffect('unknown')).toBeUndefined();
    expect(getEffect('__proto__')).toBeUndefined();
  });

  it('offers unique categories, including the new effect families', () => {
    expect(categories).toHaveLength(21);
    expect(new Set(categories).size).toBe(21);
    expect(categories).toEqual(expect.arrayContaining(['MOVES', 'IMPACTS', 'TRANSITIONS']));
  });

  it('filters effects by their exact category while keeping catalog order', () => {
    expect(getEffectsByCategory('FIRE').slice(0, 4).map((effect) => effect.id)).toEqual([
      'fire/campfire', 'fire/fire-tornado', 'fire/meteor', 'fire/spirit-flame',
    ]);
    expect(getEffectsByCategory('FIRE')).toHaveLength(12);
    expect(getEffectsByCategory('SPAWN')).toHaveLength(10);
    expect(getEffectsByCategory('MOVES')).toHaveLength(12);
  });

  it('returns the whole catalog for all, and no effects for unknown categories', () => {
    expect(getEffectsByCategory('all')).toBe(effects);
    expect(getEffectsByCategory('unknown')).toEqual([]);
    expect(getEffectsByCategory('__proto__')).toEqual([]);
  });

  it('searches names and tags without case or full-width character differences', () => {
    expect(searchEffects('  ＣＨＥＲＲＹ  ').map((effect) => effect.id)).toContain('weather/cherry-blossoms');
    expect(searchEffects('mushroom').map((effect) => effect.id)).toContain('explosions/nuke');
  });

  it('combines category and Japanese category search with multiple terms', () => {
    expect(searchEffects('天候 snow', 'WEATHER').map((effect) => effect.id)).toContain('weather/snow');
    expect(searchEffects('snow', 'FIRE')).toEqual([]);
    expect(searchEffects('sword combo', 'MOVES').map((effect) => effect.id)).toEqual(['moves/sword-combo']);
  });

  it('keeps all results for an empty search and returns no unrelated matches', () => {
    expect(searchEffects('   ')).toBe(effects);
    expect(searchEffects('no-such-effect-123')).toEqual([]);
  });
});

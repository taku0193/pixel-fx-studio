import * as frostNova from 'pixelfx/fx/ice/frost-nova';
import * as campfire from 'pixelfx/fx/fire/campfire';
import * as lightningStrike from 'pixelfx/fx/lightning/lightning-strike';

export const effects = [
  { id: 'ice/frost-nova', name: frostNova.meta.name, category: 'ICE', description: '冷気を集めて、氷の結晶を解き放つ。', module: frostNova },
  { id: 'fire/campfire', name: campfire.meta.name, category: 'FIRE', description: '揺らぐ炎と、ゆっくり舞い上がる火の粉。', module: campfire },
  { id: 'lightning/lightning-strike', name: lightningStrike.meta.name, category: 'LIGHTNING', description: '光る魔法陣に、一筋の雷が落ちる。', module: lightningStrike },
] as const;

export type Effect = (typeof effects)[number];

export function getEffect(id: string): Effect | undefined {
  return effects.find((effect) => effect.id === id);
}

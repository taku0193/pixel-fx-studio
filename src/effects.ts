import { effects as upstreamEffects } from 'pixelfx/fx/index';
import type { EffectModule } from 'pixelfx';
import curated from './curated-effects.json';
import names from './effect-names.json';

export const categoryLabels = {
  ICE: '氷', FIRE: '炎', LIGHTNING: '雷', WATER: '水', EXPLOSIONS: '爆発',
  ARCANE: '魔法', HOLY: '光・回復', SHADOW: '闇', NATURE: '自然',
  WEATHER: '天候', 'SCI-FI': 'SF', PICKUPS: 'アイテム', CRITTERS: '生き物',
  MELEE: '剣撃・近接', PROJECTILES: '飛び道具', SPAWN: '出現・消滅',
  STATUS: '状態異常', UI: 'UI演出', MOVES: '連続攻撃', IMPACTS: '衝撃',
  TRANSITIONS: '画面切り替え',
} as const;
export type Category = keyof typeof categoryLabels;
export interface Effect {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly category: Category;
  readonly description: string;
  readonly module: EffectModule;
}

const descriptions = new Map(curated.map((effect) => [effect.id, effect.description]));
const localizedNames: Readonly<Record<string, string>> = names;
const ids = [...curated.map((effect) => effect.id), ...Object.keys(upstreamEffects).filter((id) => !descriptions.has(id))];

export const effects: readonly Effect[] = ids.map((id) => {
  const module = upstreamEffects[id];
  const root = id.split('/')[0];
  const category = (root === 'scifi' ? 'SCI-FI' : root.toUpperCase()) as Category;
  if (!module || !(category in categoryLabels)) throw new Error(`Unknown pixelfx effect: ${id}`);
  return { id, name: module.meta.name, label: localizedNames[id] ?? module.meta.name, category, description: descriptions.get(id) ?? module.meta.desc, module };
});
export const categories = [...new Set(effects.map((effect) => effect.category))];
const byId = new Map(effects.map((effect) => [effect.id, effect]));

export function getEffect(id: string): Effect | undefined {
  return byId.get(id);
}
export function getEffectsByCategory(category: string): readonly Effect[] {
  return category === 'all' ? effects : effects.filter((effect) => effect.category === category);
}
const normalize = (text: string) => text.normalize('NFKC').toLowerCase().trim();
export function searchEffects(query: string, category = 'all'): readonly Effect[] {
  const candidates = getEffectsByCategory(category);
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return candidates;
  return candidates.filter((effect) => {
    const text = normalize([effect.id, effect.name, effect.label, effect.description, effect.category, categoryLabels[effect.category], ...effect.module.meta.tags].join(' '));
    return terms.every((term) => text.includes(term));
  });
}

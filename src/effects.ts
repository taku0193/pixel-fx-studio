import * as frostNova from 'pixelfx/fx/ice/frost-nova';
import * as campfire from 'pixelfx/fx/fire/campfire';
import * as lightningStrike from 'pixelfx/fx/lightning/lightning-strike';
import * as fireTornado from 'pixelfx/fx/fire/fire-tornado';
import * as waterfall from 'pixelfx/fx/water/waterfall';
import * as waterOrb from 'pixelfx/fx/water/water-orb';
import * as fireworkBurst from 'pixelfx/fx/explosions/firework-burst';
import * as portal from 'pixelfx/fx/arcane/portal';
import * as halo from 'pixelfx/fx/holy/halo';
import * as blackHole from 'pixelfx/fx/shadow/black-hole';
import * as leafStorm from 'pixelfx/fx/nature/leaf-storm';
import * as rain from 'pixelfx/fx/weather/rain';
import * as aurora from 'pixelfx/fx/weather/aurora';
import * as energyCore from 'pixelfx/fx/scifi/energy-core';
import * as gemSpin from 'pixelfx/fx/pickups/gem-spin';
import * as butterfly from 'pixelfx/fx/critters/butterfly';

export const effects = [
  { id: 'ice/frost-nova', name: frostNova.meta.name, category: 'ICE', description: '冷気を集めて、氷の結晶を解き放つ。', module: frostNova },
  { id: 'fire/campfire', name: campfire.meta.name, category: 'FIRE', description: '揺らぐ炎と、ゆっくり舞い上がる火の粉。', module: campfire },
  { id: 'lightning/lightning-strike', name: lightningStrike.meta.name, category: 'LIGHTNING', description: '光る魔法陣に、一筋の雷が落ちる。', module: lightningStrike },
  { id: 'fire/fire-tornado', name: fireTornado.meta.name, category: 'FIRE', description: '火の粉を巻き込み、炎の竜巻が渦を描く。', module: fireTornado },
  { id: 'water/waterfall', name: waterfall.meta.name, category: 'WATER', description: '岩から流れ落ちる水が、水しぶきと波紋を広げる。', module: waterfall },
  { id: 'water/water-orb', name: waterOrb.meta.name, category: 'WATER', description: '浮かぶ水の球が揺れ、光としずくをこぼす。', module: waterOrb },
  { id: 'explosions/firework-burst', name: fireworkBurst.meta.name, category: 'EXPLOSIONS', description: '色とりどりの花火が開き、きらめく星が降り注ぐ。', module: fireworkBurst },
  { id: 'arcane/portal', name: portal.meta.name, category: 'ARCANE', description: '渦を巻く魔法のポータルが、光を放ちながら開く。', module: portal },
  { id: 'holy/halo', name: halo.meta.name, category: 'HOLY', description: 'やわらかな金色の光輪が、静かに輝く。', module: halo },
  { id: 'shadow/black-hole', name: blackHole.meta.name, category: 'SHADOW', description: '暗い中心へ光と粒子が吸い込まれていく。', module: blackHole },
  { id: 'nature/leaf-storm', name: leafStorm.meta.name, category: 'NATURE', description: '緑の葉が風に乗り、小さな嵐をつくる。', module: leafStorm },
  { id: 'weather/rain', name: rain.meta.name, category: 'WEATHER', description: '降り続く雨が、地面に小さな水しぶきを散らす。', module: rain },
  { id: 'weather/aurora', name: aurora.meta.name, category: 'WEATHER', description: '色の帯が夜空をゆっくりと揺らめく。', module: aurora },
  { id: 'scifi/energy-core', name: energyCore.meta.name, category: 'SCI-FI', description: '金属のケージに包まれたコアが、脈打ち放電する。', module: energyCore },
  { id: 'pickups/gem-spin', name: gemSpin.meta.name, category: 'PICKUPS', description: 'くるりと回る宝石の面に、きらりと光が走る。', module: gemSpin },
  { id: 'critters/butterfly', name: butterfly.meta.name, category: 'CRITTERS', description: '小さな蝶が羽ばたき、ふわりと飛び回る。', module: butterfly },
] as const;

export type Effect = (typeof effects)[number];

export function getEffect(id: string): Effect | undefined {
  return effects.find((effect) => effect.id === id);
}

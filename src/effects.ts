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
import * as meteor from 'pixelfx/fx/fire/meteor';
import * as spiritFlame from 'pixelfx/fx/fire/spirit-flame';
import * as iceCrystal from 'pixelfx/fx/ice/ice-crystal';
import * as ballLightning from 'pixelfx/fx/lightning/ball-lightning';
import * as geyser from 'pixelfx/fx/water/geyser';
import * as plasmaExplosion from 'pixelfx/fx/explosions/plasma-explosion';
import * as runeCircle from 'pixelfx/fx/arcane/rune-circle';
import * as heal from 'pixelfx/fx/holy/heal';
import * as tornado from 'pixelfx/fx/nature/tornado';
import * as cherryBlossoms from 'pixelfx/fx/weather/cherry-blossoms';
import * as ghost from 'pixelfx/fx/critters/ghost';
import * as swordSlash from 'pixelfx/fx/melee/sword-slash';
import * as magicMissile from 'pixelfx/fx/projectiles/magic-missile';
import * as respawnBeam from 'pixelfx/fx/spawn/respawn-beam';
import * as poisoned from 'pixelfx/fx/status/poisoned';
import * as confetti from 'pixelfx/fx/ui/confetti';

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
  { id: 'fire/meteor', name: meteor.meta.name, category: 'FIRE', description: '炎をまとった隕石が落下し、火花と煙を巻き上げる。', module: meteor },
  { id: 'fire/spirit-flame', name: spiritFlame.meta.name, category: 'FIRE', description: '青緑の霊火が浮かび、冷たい火の粉をこぼす。', module: spiritFlame },
  { id: 'ice/ice-crystal', name: iceCrystal.meta.name, category: 'ICE', description: '浮かぶ氷の結晶が回り、冷たい光をきらめかせる。', module: iceCrystal },
  { id: 'lightning/ball-lightning', name: ballLightning.meta.name, category: 'LIGHTNING', description: '雷の球が漂い、周囲へ細い稲妻を放つ。', module: ballLightning },
  { id: 'water/geyser', name: geyser.meta.name, category: 'WATER', description: '水面が盛り上がり、白い水柱が勢いよく噴き出す。', module: geyser },
  { id: 'explosions/plasma-explosion', name: plasmaExplosion.meta.name, category: 'EXPLOSIONS', description: '青紫のエネルギーが弾け、光の衝撃波を広げる。', module: plasmaExplosion },
  { id: 'arcane/rune-circle', name: runeCircle.meta.name, category: 'ARCANE', description: '床に浮かぶルーン文字が、光を追いながら回る。', module: runeCircle },
  { id: 'holy/heal', name: heal.meta.name, category: 'HOLY', description: '光の花と輪が広がり、回復のきらめきが舞い上がる。', module: heal },
  { id: 'nature/tornado', name: tornado.meta.name, category: 'NATURE', description: '風の渦がうねり、葉と砂ぼこりを巻き上げる。', module: tornado },
  { id: 'weather/cherry-blossoms', name: cherryBlossoms.meta.name, category: 'WEATHER', description: '春の風に乗って、桜の花びらがひらひらと舞う。', module: cherryBlossoms },
  { id: 'critters/ghost', name: ghost.meta.name, category: 'CRITTERS', description: '小さな幽霊がふわふわ漂い、こちらを見回す。', module: ghost },
  { id: 'melee/sword-slash', name: swordSlash.meta.name, category: 'MELEE', description: '鋭い三日月の剣閃が走り、青い軌跡を残す。', module: swordSlash },
  { id: 'projectiles/magic-missile', name: magicMissile.meta.name, category: 'PROJECTILES', description: '集まった魔力が光の弾となり、尾を引いて飛ぶ。', module: magicMissile },
  { id: 'spawn/respawn-beam', name: respawnBeam.meta.name, category: 'SPAWN', description: '光の柱と走査線が、復活の姿を描き出す。', module: respawnBeam },
  { id: 'status/poisoned', name: poisoned.meta.name, category: 'STATUS', description: '緑の毒の波としずくが、体を包み込む。', module: poisoned },
  { id: 'ui/confetti', name: confetti.meta.name, category: 'UI', description: 'クラッカーから色とりどりの紙吹雪が飛び出す。', module: confetti },
] as const;

export type Effect = (typeof effects)[number];

export const categories = [...new Set(effects.map((effect) => effect.category))];

export function getEffectsByCategory(category: string): readonly Effect[] {
  return category === 'all' ? effects : effects.filter((effect) => effect.category === category);
}

export function getEffect(id: string): Effect | undefined {
  return effects.find((effect) => effect.id === id);
}

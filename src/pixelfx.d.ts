// Only the upstream APIs used here; verified against pixelfx 0.3.1 source.
declare module 'pixelfx' {
  export interface Frame {
    w: number;
    h: number;
    ox: number;
    oy: number;
    color: Uint32Array;
    light: Uint32Array;
  }
  export interface EffectModule {
    meta: {
      name: string;
      size: readonly [number, number];
      origin: readonly [number, number];
      duration: number;
      loop: boolean;
      fps: number;
    };
  }
  export interface LiveEffect {
    update(dt: number): void;
    draw(frame: Frame, layer?: 'back' | 'front'): void;
    stop(): void;
    done(): boolean;
  }
  export function createFrame(w: number, h: number): Frame;
  export function clearFrame(frame: Frame): Frame;
  export function createFx(module: EffectModule, options?: { x: number; y: number }): LiveEffect;
  export function composite(frame: Frame, out: Uint8ClampedArray, background?: number | null): Uint8ClampedArray;
}

declare module 'pixelfx/fx/ice/frost-nova' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/fire/campfire' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/lightning/lightning-strike' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/fire/fire-tornado' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/water/waterfall' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/water/water-orb' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/explosions/firework-burst' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/arcane/portal' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/holy/halo' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/shadow/black-hole' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/nature/leaf-storm' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/weather/rain' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/weather/aurora' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/scifi/energy-core' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/pickups/gem-spin' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/critters/butterfly' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/fire/meteor' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/fire/spirit-flame' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/ice/ice-crystal' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/lightning/ball-lightning' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/water/geyser' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/explosions/plasma-explosion' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/arcane/rune-circle' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/holy/heal' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/nature/tornado' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/weather/cherry-blossoms' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/critters/ghost' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/melee/sword-slash' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/projectiles/magic-missile' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/spawn/respawn-beam' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/status/poisoned' {
  export const meta: import('pixelfx').EffectModule['meta'];
}
declare module 'pixelfx/fx/ui/confetti' {
  export const meta: import('pixelfx').EffectModule['meta'];
}

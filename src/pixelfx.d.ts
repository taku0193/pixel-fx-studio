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

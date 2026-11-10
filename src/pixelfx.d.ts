// APIs verified against the pinned pixelfx 0.3.1 source and its public registry.
declare module 'pixelfx' {
  export interface Frame {
    w: number; h: number; ox: number; oy: number;
    color: Uint32Array; light: Uint32Array;
  }
  export interface EffectModule {
    meta: {
      name: string; desc: string; tags: readonly string[];
      size: readonly [number, number]; origin: readonly [number, number];
      duration: number; loop: boolean; fps: number;
    };
  }
  export interface LiveEffect {
    update(dt: number): void;
    draw(frame: Frame, layer?: 'back' | 'front'): void;
    stop(): void;
    done(): boolean;
  }
  export interface LiveAct extends Omit<LiveEffect, 'draw'> { draw(frame: Frame): void; }
  export interface Bounds { x0: number; y0: number; x1: number; y1: number; }
  export function createFrame(w: number, h: number): Frame;
  export function clearFrame(frame: Frame): Frame;
  export function createFx(module: EffectModule, options?: { x: number; y: number }): LiveEffect;
  export function createAct(module: EffectModule, options?: { x: number; y: number }): LiveAct;
  export function actBounds(module: EffectModule): Bounds;
  export function actSpan(module: EffectModule): { from: number; to: number };
  export function backdrop(kind: 'dark' | 'ground' | 'sky' | 'light' | 'black', w: number, h: number, groundY?: number): Uint32Array;
  export function composite(frame: Frame, out: Uint8ClampedArray, background?: number | Uint32Array | null): Uint8ClampedArray;
}
declare module 'pixelfx/fx/index' {
  export const effects: Readonly<Record<string, import('pixelfx').EffectModule>>;
  export const categories: readonly { id: string; name: string; blurb: string }[];
}

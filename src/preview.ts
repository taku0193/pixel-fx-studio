import { actBounds, backdrop, createAct, createFx, type Bounds, type Frame } from 'pixelfx';
import type { Effect } from './effects';

const cachedBounds = new WeakMap<Effect['module'], Bounds>();
export function getPreviewLayout(effect: Effect, minWidth = 320, minHeight = 288) {
  let bounds = cachedBounds.get(effect.module);
  if (!bounds) {
    const { size, origin } = effect.module.meta;
    bounds = effect.category === 'MOVES' ? actBounds(effect.module) : {
      x0: -origin[0], y0: -origin[1], x1: size[0] - origin[0], y1: size[1] - origin[1],
    };
    cachedBounds.set(effect.module, bounds);
  }
  const w = bounds.x1 - bounds.x0;
  const h = bounds.y1 - bounds.y0;
  const width = Math.max(minWidth, Math.ceil(w));
  const height = Math.max(minHeight, Math.ceil(h));
  return { width, height, x: (width - w) / 2 - bounds.x0, y: (height - h) / 2 - bounds.y0, bounds };
}

export function createPreview(effect: Effect, layout = getPreviewLayout(effect)) {
  const position = { x: layout.x, y: layout.y };
  const act = effect.category === 'MOVES' ? createAct(effect.module, position) : undefined;
  const fx = act ? undefined : createFx(effect.module, position);
  const instance = act ?? fx!;
  return {
    background: effect.category === 'TRANSITIONS' ? backdrop('sky', layout.width, layout.height) : 0x1c1714,
    update: (dt: number) => instance.update(dt),
    draw(frame: Frame) {
      if (act) act.draw(frame);
      else { fx!.draw(frame, 'back'); fx!.draw(frame, 'front'); }
    },
    stop: () => instance.stop(),
    done: () => instance.done(),
  };
}

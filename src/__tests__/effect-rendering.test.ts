import { describe, expect, it } from 'vitest';
import { clearFrame, composite, createFrame, createFx } from 'pixelfx';
import { effects } from '../effects';

describe('real pixelfx effects', () => {
  it.each(effects)('renders visible, changing pixels for $name', (effect) => {
    const frame = createFrame(320, 288);
    const { size, origin } = effect.module.meta;
    const instance = createFx(effect.module, {
      x: (320 - size[0]) / 2 + origin[0],
      y: (288 - size[1]) / 2 + origin[1],
    });
    const snapshots: Uint8ClampedArray[] = [];
    let step = 0;
    let maxVisible = 0;
    try {
      for (const checkpoint of [15, 45, 75]) {
        while (step < checkpoint) {
          instance.update(1 / 60);
          step++;
        }
        clearFrame(frame);
        instance.draw(frame, 'back');
        instance.draw(frame, 'front');
        const pixels = new Uint8ClampedArray(320 * 288 * 4);
        composite(frame, pixels, 0x1c1714);
        let visible = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] !== 20 || pixels[i + 1] !== 23 || pixels[i + 2] !== 28) visible++;
        }
        maxVisible = Math.max(maxVisible, visible);
        snapshots.push(pixels);
      }
      expect(maxVisible).toBeGreaterThan(0);
      expect(snapshots.slice(1).some((pixels) => pixels.some((value, i) => value !== snapshots[0][i]))).toBe(true);
    } finally {
      instance.stop();
    }
  });
});

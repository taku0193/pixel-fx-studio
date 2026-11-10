import { describe, expect, it } from 'vitest';
import { actSpan, clearFrame, composite, createFrame } from 'pixelfx';
import { effects } from '../effects';
import { createPreview, getPreviewLayout } from '../preview';

describe('real pixelfx effects', () => {
  it.each(effects)('renders visible, changing pixels for $name', (effect) => {
    const layout = getPreviewLayout(effect);
    const frame = createFrame(layout.width, layout.height);
    const instance = createPreview(effect, layout);
    const span = effect.category === 'MOVES' ? actSpan(effect.module) : { from: 0, to: effect.module.meta.duration };
    const duration = span.to - span.from;
    const empty = new Uint8ClampedArray(frame.w * frame.h * 4);
    composite(frame, empty, instance.background);
    const snapshots: Uint8ClampedArray[] = [];
    let step = 0;
    let maxVisible = 0;
    try {
      for (const fraction of [0.12, 0.4, 0.72]) {
        const checkpoint = Math.ceil(duration * fraction * 120);
        while (step < checkpoint) {
          instance.update(1 / 120);
          step++;
        }
        clearFrame(frame);
        instance.draw(frame);
        const pixels = new Uint8ClampedArray(frame.w * frame.h * 4);
        composite(frame, pixels, instance.background);
        let visible = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] !== empty[i] || pixels[i + 1] !== empty[i + 1] || pixels[i + 2] !== empty[i + 2]) visible++;
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

import { describe, expect, it } from 'vitest';
import { effects, getEffect } from '../effects';
import { getPreviewLayout } from '../preview';

describe('preview layout', () => {
  it('keeps the original preview size for existing small effects', () => {
    expect(getPreviewLayout(effects[0])).toMatchObject({ width: 320, height: 288 });
  });

  it('allocates enough space for the largest explosions and complete attacks', () => {
    expect(getPreviewLayout(getEffect('explosions/nuke')!)).toMatchObject({ width: 400, height: 320 });
    expect(getPreviewLayout(getEffect('moves/rocket-launcher')!)).toMatchObject({ width: 480, height: 288 });
  });

  it.each(effects)('fits the declared bounds of $id inside the preview', (effect) => {
    const { width, height, x, y, bounds } = getPreviewLayout(effect);
    expect(width).toBeGreaterThanOrEqual(320);
    expect(height).toBeGreaterThanOrEqual(288);
    expect(x + bounds.x0).toBeGreaterThanOrEqual(0);
    expect(y + bounds.y0).toBeGreaterThanOrEqual(0);
    expect(x + bounds.x1).toBeLessThanOrEqual(width);
    expect(y + bounds.y1).toBeLessThanOrEqual(height);
  });
});

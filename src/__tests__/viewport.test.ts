import { describe, expect, it } from 'vitest';
import { clampPan, getViewportScale } from '../viewport';

describe('pixel preview viewport', () => {
  it('fits actual effect bounds and caps tiny effects at 4×', () => {
    expect(getViewportScale('fit', 600, 400, 180, 160)).toBe(2.2);
    expect(getViewportScale('fit', 600, 400, 16, 16)).toBe(4);
  });
  it('fits large effects inside narrow mobile stages', () => {
    expect(getViewportScale('fit', 288, 280, 480, 288)).toBeCloseTo(0.5);
    expect(getViewportScale('2', 288, 280, 480, 288)).toBe(2);
    expect(getViewportScale('4', 288, 280, 480, 288)).toBe(4);
  });
  it('keeps dragged content within the scaled canvas and recenters small canvases', () => {
    expect(clampPan(500, 640, 400)).toBe(120);
    expect(clampPan(-500, 640, 400)).toBe(-120);
    expect(clampPan(50, 320, 400)).toBe(0);
  });
});

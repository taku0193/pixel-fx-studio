import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createFx, type LiveEffect } from 'pixelfx';
import { effects } from '../effects';
import { createRenderer } from '../renderer';

vi.mock('pixelfx', async (importOriginal) => ({
  ...await importOriginal<typeof import('pixelfx')>(),
  createFx: vi.fn(),
}));

let callbacks: Map<number, FrameRequestCallback>;
let instances: LiveEffect[];
let nextId: number;
let canvas: HTMLCanvasElement;
const putImageData = vi.fn();

function advance(time: number) {
  const pending = [...callbacks.entries()];
  callbacks.clear();
  pending.forEach(([, callback]) => callback(time));
}

beforeEach(() => {
  vi.clearAllMocks();
  callbacks = new Map();
  instances = [];
  nextId = 0;
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
    callbacks.set(++nextId, callback);
    return nextId;
  }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => callbacks.delete(id)));
  vi.mocked(createFx).mockImplementation(() => {
    const effect = { update: vi.fn(), draw: vi.fn(), stop: vi.fn(), done: vi.fn(() => false) };
    instances.push(effect);
    return effect;
  });
  canvas = {
    width: 320, height: 288,
    getContext: vi.fn(() => ({
      createImageData: () => ({ data: new Uint8ClampedArray(320 * 288 * 4) }),
      putImageData,
    })),
  } as unknown as HTMLCanvasElement;
});

afterEach(() => vi.unstubAllGlobals());

describe('renderer lifecycle', () => {
  it('draws immediately and keeps exactly one loop during rapid switching', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    expect(putImageData).toHaveBeenCalledTimes(1);
    for (let i = 0; i < 30; i++) {
      const previous = instances.at(-1)!;
      renderer.select(effects[i % 3]);
      expect(previous.stop).toHaveBeenCalledOnce();
      expect(callbacks.size).toBe(1);
    }
    advance(1000);
    expect(callbacks.size).toBe(1);
    renderer.dispose();
  });

  it('ignores an already queued callback from the previous selection', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    const stale = [...callbacks.values()][0];
    renderer.select(effects[1]);
    const count = putImageData.mock.calls.length;
    stale(1000);
    expect(putImageData).toHaveBeenCalledTimes(count);
    expect(callbacks.size).toBe(1);
    renderer.dispose();
  });

  it('cancels drawing permanently on dispose, including queued callbacks', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    const stale = [...callbacks.values()][0];
    renderer.dispose();
    renderer.dispose();
    stale(1000);
    renderer.select(effects[1]);
    expect(callbacks.size).toBe(0);
    expect(instances[0].stop).toHaveBeenCalledOnce();
    expect(putImageData).toHaveBeenCalledTimes(1);
    expect(createFx).toHaveBeenCalledOnce();
  });

  it('uses elapsed seconds and caps large gaps after a background tab resumes', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    advance(1000);
    advance(1016);
    expect(instances[0].update).toHaveBeenLastCalledWith(0.016);
    advance(61016);
    expect(instances[0].update).toHaveBeenLastCalledWith(0.05);
    renderer.dispose();
  });

  it('recreates finished one-shot instances to keep playing', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    vi.mocked(instances[0].done).mockReturnValue(true);
    advance(1000);
    expect(instances[0].stop).toHaveBeenCalledOnce();
    expect(createFx).toHaveBeenCalledTimes(2);
    expect(callbacks.size).toBe(1);
    renderer.dispose();
  });

  it('stops the loop and reports asynchronous drawing errors', () => {
    const onError = vi.fn();
    const renderer = createRenderer(canvas, onError);
    renderer.select(effects[0]);
    vi.mocked(instances[0].draw).mockImplementation(() => { throw new Error('draw failed'); });
    advance(1000);
    expect(onError).toHaveBeenCalledOnce();
    expect(callbacks.size).toBe(0);
    expect(instances[0].stop).toHaveBeenCalledOnce();
  });

  it('reports an unavailable 2D Canvas', () => {
    vi.mocked(canvas.getContext).mockReturnValue(null);
    expect(() => createRenderer(canvas)).toThrow('Canvas');
  });
});

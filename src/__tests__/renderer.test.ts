import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAct, createFx, type LiveEffect } from 'pixelfx';
import { effects, getEffect } from '../effects';
import { createRenderer } from '../renderer';

vi.mock('pixelfx', async (importOriginal) => ({
  ...await importOriginal<typeof import('pixelfx')>(),
  createFx: vi.fn(),
  createAct: vi.fn(),
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
  const makeInstance = () => {
    const effect = { update: vi.fn(), draw: vi.fn(), stop: vi.fn(), done: vi.fn(() => false) };
    instances.push(effect);
    return effect;
  };
  vi.mocked(createFx).mockImplementation(makeInstance);
  vi.mocked(createAct).mockImplementation(makeInstance);
  canvas = {
    width: 320, height: 288,
    getContext: vi.fn(() => ({
      createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }),
      putImageData,
    })),
  } as unknown as HTMLCanvasElement;
});

afterEach(() => vi.unstubAllGlobals());

describe('renderer lifecycle', () => {
  it('pauses and advances exactly one effect frame without starting another loop', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    renderer.step();
    expect(renderer.isPaused).toBe(true);
    expect(callbacks.size).toBe(0);
    expect(instances[0].update).toHaveBeenCalledExactlyOnceWith(1 / effects[0].module.meta.fps);
    expect(renderer.frame).toBe(1);
    expect(renderer.elapsed).toBeCloseTo(1 / 30);
    expect(putImageData).toHaveBeenCalledTimes(2);
    renderer.dispose();
  });

  it('restarts from frame zero while preserving pause and never duplicates playback', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    renderer.step();
    renderer.step();
    const previous = instances[0];
    renderer.restart();
    expect(previous.stop).toHaveBeenCalledOnce();
    expect(renderer.frame).toBe(0);
    expect(renderer.elapsed).toBe(0);
    expect(renderer.isPaused).toBe(true);
    expect(callbacks.size).toBe(0);
    renderer.resume();
    renderer.restart();
    expect(renderer.isPaused).toBe(false);
    expect(callbacks.size).toBe(1);
    renderer.dispose();
  });

  it('reports playback frames for UI counters through the existing render loop', () => {
    const onFrame = vi.fn();
    const renderer = createRenderer(canvas, vi.fn(), onFrame);
    renderer.select(effects[0]);
    expect(onFrame).toHaveBeenLastCalledWith({ elapsed: 0, frame: 0, fps: 30, paused: false });
    renderer.step();
    expect(onFrame).toHaveBeenLastCalledWith({ elapsed: 1 / 30, frame: 1, fps: 30, paused: true });
    renderer.dispose();
  });

  it('ignores frame controls before selection and after disposal', () => {
    const renderer = createRenderer(canvas);
    renderer.step();
    renderer.restart();
    expect(createFx).not.toHaveBeenCalled();
    renderer.select(effects[0]);
    renderer.dispose();
    renderer.step();
    renderer.restart();
    expect(createFx).toHaveBeenCalledOnce();
    expect(callbacks.size).toBe(0);
  });

  it('resizes for large effects and returns to the original size for small ones', () => {
    const renderer = createRenderer(canvas);
    renderer.select(getEffect('explosions/nuke')!);
    expect([canvas.width, canvas.height]).toEqual([400, 320]);
    renderer.select(effects[0]);
    expect([canvas.width, canvas.height]).toEqual([320, 288]);
    renderer.dispose();
  });

  it('uses the official actor player for complete moves and draws it once', () => {
    const renderer = createRenderer(canvas);
    renderer.select(getEffect('moves/sword-combo')!);
    expect(createAct).toHaveBeenCalledOnce();
    expect(createFx).not.toHaveBeenCalled();
    expect(instances[0].draw).toHaveBeenCalledOnce();
    renderer.dispose();
  });
  it('draws immediately and keeps exactly one loop during rapid switching', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    expect(putImageData).toHaveBeenCalledTimes(1);
    for (let i = 0; i < effects.length * 2; i++) {
      const previous = instances.at(-1)!;
      renderer.select(effects[i % effects.length]);
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

  it('pauses on the current frame without stopping or discarding the effect', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    advance(1000);
    advance(1016);
    const stale = [...callbacks.values()][0];
    const drawCount = putImageData.mock.calls.length;
    const updateCount = vi.mocked(instances[0].update).mock.calls.length;
    renderer.pause();
    renderer.pause();
    expect(renderer.isPaused).toBe(true);
    expect(callbacks.size).toBe(0);
    advance(60000);
    stale(60000);
    expect(putImageData).toHaveBeenCalledTimes(drawCount);
    expect(instances[0].update).toHaveBeenCalledTimes(updateCount);
    expect(instances[0].stop).not.toHaveBeenCalled();
    renderer.dispose();
  });

  it('resumes the same instance without adding the time spent paused', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    advance(1000);
    advance(1016);
    renderer.pause();
    renderer.resume();
    renderer.resume();
    expect(renderer.isPaused).toBe(false);
    expect(callbacks.size).toBe(1);
    advance(61016);
    expect(instances[0].update).toHaveBeenCalledOnce();
    advance(61032);
    expect(instances[0].update).toHaveBeenLastCalledWith(0.016);
    expect(createFx).toHaveBeenCalledOnce();
    expect(instances[0].stop).not.toHaveBeenCalled();
    renderer.dispose();
  });

  it('ignores callbacks queued before a pause even after resuming', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    const stale = [...callbacks.values()][0];
    renderer.pause();
    renderer.resume();
    const count = putImageData.mock.calls.length;
    stale(1000);
    expect(putImageData).toHaveBeenCalledTimes(count);
    expect(callbacks.size).toBe(1);
    renderer.dispose();
  });

  it('preserves pause when selecting a different effect', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    renderer.pause();
    renderer.select(effects[1]);
    expect(renderer.isPaused).toBe(true);
    expect(instances[0].stop).toHaveBeenCalledOnce();
    expect(putImageData).toHaveBeenCalledTimes(2);
    expect(callbacks.size).toBe(0);
    renderer.resume();
    advance(1000);
    expect(instances[0].update).not.toHaveBeenCalled();
    expect(instances[1].update).not.toHaveBeenCalled();
    advance(1016);
    expect(instances[1].update).toHaveBeenCalledOnce();
    renderer.dispose();
  });

  it('keeps one loop after repeated pause and resume operations', () => {
    const renderer = createRenderer(canvas);
    renderer.select(effects[0]);
    for (let i = 0; i < 30; i++) {
      renderer.pause();
      expect(callbacks.size).toBe(0);
      renderer.resume();
      expect(callbacks.size).toBe(1);
    }
    expect(createFx).toHaveBeenCalledOnce();
    renderer.dispose();
  });

  it('does not start playback before selection or after disposal', () => {
    const renderer = createRenderer(canvas);
    renderer.pause();
    renderer.resume();
    expect(callbacks.size).toBe(0);
    renderer.select(effects[0]);
    renderer.pause();
    renderer.dispose();
    renderer.resume();
    renderer.pause();
    expect(callbacks.size).toBe(0);
    expect(createFx).toHaveBeenCalledOnce();
  });

  it('never sends a zero-duration update to effects that calculate velocities', () => {
    const onError = vi.fn();
    const renderer = createRenderer(canvas, onError);
    renderer.select(effects[0]);
    vi.mocked(instances[0].update).mockImplementation((dt) => {
      if (dt <= 0) throw new Error('Cannot calculate velocity for zero time');
    });
    advance(1000);
    expect(onError).not.toHaveBeenCalled();
    advance(1016);
    renderer.pause();
    renderer.resume();
    advance(60000);
    expect(onError).not.toHaveBeenCalled();
    expect(callbacks.size).toBe(1);
    renderer.dispose();
  });
});

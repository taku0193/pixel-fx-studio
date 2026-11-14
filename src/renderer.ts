import { clearFrame, composite, createFrame } from 'pixelfx';
import type { Effect } from './effects';
import { createPreview, getPreviewLayout } from './preview';

export interface PlaybackState {
  elapsed: number;
  frame: number;
  fps: number;
  paused: boolean;
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  onError: (error: unknown) => void = () => {},
  onFrame: (state: PlaybackState) => void = () => {},
) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvasの描画を開始できません。対応するブラウザで開いてください。');
  const minWidth = canvas.width;
  const minHeight = canvas.height;
  let frame = createFrame(canvas.width, canvas.height);
  let image = context.createImageData(canvas.width, canvas.height);
  let current: ReturnType<typeof createPreview> | undefined;
  let selected: Effect | undefined;
  let spawn: (() => ReturnType<typeof createPreview>) | undefined;
  let request: number | undefined;
  let generation = 0;
  let disposed = false;
  let paused = false;
  let elapsed = 0;
  let transparent = false;

  const isTransparent = () => transparent && !!selected && selected.category !== 'TRANSITIONS';

  const fps = () => selected?.module.meta.fps ?? 30;
  const frameIndex = () => Math.floor(elapsed * fps() + 1e-6);
  function notify() { onFrame({ elapsed, frame: frameIndex(), fps: fps(), paused }); }
  function cancelLoop() {
    generation++;
    if (request !== undefined) cancelAnimationFrame(request);
    request = undefined;
  }
  function stop() {
    cancelLoop();
    current?.stop();
    current = undefined;
    spawn = undefined;
  }
  function fail(error: unknown) { stop(); onError(error); }
  function paint() {
    clearFrame(frame);
    current!.draw(frame);
    composite(frame, image.data, isTransparent() ? null : current!.background);
    context!.putImageData(image, 0, 0);
    notify();
  }
  function advance(dt: number) {
    if (dt > 0) { current!.update(dt); elapsed += dt; }
    if (current!.done()) {
      current!.stop();
      current = spawn!();
      elapsed = 0;
    }
  }
  function startPlayback() {
    const token = generation;
    let previousTime: number | undefined;
    function tick(time: number) {
      if (disposed || paused || token !== generation) return;
      request = undefined;
      try {
        const dt = previousTime === undefined ? 0 : Math.min(Math.max((time - previousTime) / 1000, 0), 0.05);
        previousTime = time;
        advance(dt);
        paint();
        request = requestAnimationFrame(tick);
      } catch (error) { fail(error); }
    }
    request = requestAnimationFrame(tick);
  }
  function select(effect: Effect) {
    if (disposed) return;
    stop();
    selected = effect;
    elapsed = 0;
    const layout = getPreviewLayout(effect, minWidth, minHeight);
    if (canvas.width !== layout.width || canvas.height !== layout.height) {
      canvas.width = layout.width;
      canvas.height = layout.height;
      frame = createFrame(layout.width, layout.height);
      image = context!.createImageData(layout.width, layout.height);
    }
    spawn = () => createPreview(effect, layout);
    try { current = spawn(); paint(); }
    catch (error) { stop(); throw error; }
    if (!paused) startPlayback();
  }
  function pause() {
    if (disposed || !current || paused) return;
    paused = true;
    cancelLoop();
    notify();
  }
  return {
    select,
    get isPaused() { return paused; },
    get elapsed() { return elapsed; },
    get frame() { return frameIndex(); },
    get isTransparent() { return isTransparent(); },
    setTransparent(value: boolean) {
      if (disposed || transparent === value) return;
      transparent = value;
      if (!current) return;
      try { paint(); } catch (error) { fail(error); }
    },
    pause,
    resume() {
      if (disposed || !current || !paused) return;
      paused = false;
      startPlayback();
      notify();
    },
    step() {
      if (disposed || !current) return;
      pause();
      try { advance(1 / fps()); paint(); }
      catch (error) { fail(error); }
    },
    restart() { if (!disposed && selected) select(selected); },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
    },
  };
}

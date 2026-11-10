import { clearFrame, composite, createFrame } from 'pixelfx';
import type { Effect } from './effects';
import { createPreview, getPreviewLayout } from './preview';

export function createRenderer(canvas: HTMLCanvasElement, onError: (error: unknown) => void = () => {}) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvasの描画を開始できません。対応するブラウザで開いてください。');
  const minWidth = canvas.width;
  const minHeight = canvas.height;
  let frame = createFrame(canvas.width, canvas.height);
  let image = context.createImageData(canvas.width, canvas.height);
  let current: ReturnType<typeof createPreview> | undefined;
  let request: number | undefined;
  let generation = 0;
  let disposed = false;
  let paused = false;
  let startPlayback: (() => void) | undefined;

  function cancelLoop() {
    generation++;
    if (request !== undefined) cancelAnimationFrame(request);
    request = undefined;
  }

  function stop() {
    cancelLoop();
    current?.stop();
    current = undefined;
    startPlayback = undefined;
  }

  function paint() {
    clearFrame(frame);
    current!.draw(frame);
    composite(frame, image.data, current!.background);
    context!.putImageData(image, 0, 0);
  }

  return {
    select(effect: Effect) {
      if (disposed) return;
      stop();
      const layout = getPreviewLayout(effect, minWidth, minHeight);
      if (canvas.width !== layout.width || canvas.height !== layout.height) {
        canvas.width = layout.width;
        canvas.height = layout.height;
        frame = createFrame(layout.width, layout.height);
        image = context!.createImageData(layout.width, layout.height);
      }
      const spawn = () => createPreview(effect, layout);
      try {
        current = spawn();
        paint();
      } catch (error) {
        stop();
        throw error;
      }
      startPlayback = () => {
        const token = generation;
        // Start a fresh clock on resume, keeping the existing effect and its simulation time.
        let previousTime: number | undefined;
        function tick(time: number) {
          if (disposed || paused || token !== generation) return;
          request = undefined;
          try {
            const dt = previousTime === undefined ? 0 : Math.min(Math.max((time - previousTime) / 1000, 0), 0.05);
            previousTime = time;
            current!.update(dt);
            if (current!.done()) {
              current!.stop();
              current = spawn();
            }
            paint();
            request = requestAnimationFrame(tick);
          } catch (error) {
            stop();
            onError(error);
          }
        }
        request = requestAnimationFrame(tick);
      };
      if (!paused) startPlayback();
    },
    get isPaused() {
      return paused;
    },
    pause() {
      if (disposed || !current || paused) return;
      paused = true;
      cancelLoop();
    },
    resume() {
      if (disposed || !current || !paused) return;
      paused = false;
      startPlayback!();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
    },
  };
}

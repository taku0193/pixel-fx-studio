import { clearFrame, composite, createFrame, createFx, type LiveEffect } from 'pixelfx';
import type { Effect } from './effects';

export function createRenderer(canvas: HTMLCanvasElement, onError: (error: unknown) => void = () => {}) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvasの描画を開始できません。対応するブラウザで開いてください。');
  const frame = createFrame(canvas.width, canvas.height);
  const image = context.createImageData(canvas.width, canvas.height);
  let current: LiveEffect | undefined;
  let request: number | undefined;
  let generation = 0;
  let disposed = false;

  function stop() {
    generation++;
    if (request !== undefined) cancelAnimationFrame(request);
    request = undefined;
    current?.stop();
    current = undefined;
  }

  function paint() {
    clearFrame(frame);
    current!.draw(frame, 'back');
    current!.draw(frame, 'front');
    // pixelfx colors are packed as 0xBBGGRR: #14171c.
    composite(frame, image.data, 0x1c1714);
    context!.putImageData(image, 0, 0);
  }

  return {
    select(effect: Effect) {
      if (disposed) return;
      stop();
      const token = generation;
      const { size, origin } = effect.module.meta;
      const spawn = () => createFx(effect.module, {
        x: (canvas.width - size[0]) / 2 + origin[0],
        y: (canvas.height - size[1]) / 2 + origin[1],
      });
      let previousTime: number | undefined;
      try {
        current = spawn();
        paint();
      } catch (error) {
        stop();
        throw error;
      }
      function tick(time: number) {
        if (disposed || token !== generation) return;
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
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
    },
  };
}
